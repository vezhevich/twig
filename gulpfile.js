var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglifyjs'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer'),
  twig = require('gulp-twig'),
  dataJson = require("gulp-data-json");

gulp.task('sass', function() {
  return gulp.src('app/scss/*.+(scss|sass)')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('img', function() {
  return gulp.src('app/images//*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('templates', function() {
    return gulp.src('app/views/*.html')
        .pipe(twig())
        .pipe(gulp.dest('app'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'templates'], function() {
  gulp.watch('app/scss/**/*.+(scss|sass)', ['sass']);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/views/**/*.html', ['templates']);
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts', 'compile'], function() {
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css',
    ])
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts//*')
  .pipe(gulp.dest('dist/fonts'));

  var buldJs = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));  

});