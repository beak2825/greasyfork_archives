// ==UserScript==
// @name            Udemy - Improved Course Library
// @name:de         Udemy - Verbesserte Kursbibliothek
// @name:fr         Udemy - Bibliothèque de cours améliorée
// @name:es         Udemy - Biblioteca de cursos mejorada
// @name:it         Udemy - Libreria dei corsi migliorata
// @name:ja         Udemy - コースライブラリの改良
// @description     Adds current ratings and other detailed data to all courses in your Udemy library.
// @description:de  Fügt aktuelle Bewertungen und andere detaillierte Informationen zu allen Kursen in deiner Udemy-Bibliothek hinzu.
// @description:fr  Ajoute les évaluations actuelles et d'autres données détaillées à tous les cours de ta bibliothèque Udemy.
// @description:es  Añade valoraciones actuales y otros datos detallados a todos los cursos de tu biblioteca Udemy.
// @description:it  Aggiunge valutazioni attuali e altri dati dettagliati a tutti i corsi nella tua libreria Udemy.
// @description:ja  Udemyのライブラリにある全てのコースに現在の評価やその他の詳細情報を追加します。
// @namespace       https://github.com/tadwohlrapp
// @author          Tad Wohlrapp
// @version         1.1.2
// @license         MIT
// @homepageURL     https://github.com/tadwohlrapp/udemy-improved-course-library
// @supportURL      https://github.com/tadwohlrapp/udemy-improved-course-library/issues
// @icon            https://github.com/tadwohlrapp/udemy-improved-course-library/raw/main/src/icon48.png
// @icon64          https://github.com/tadwohlrapp/udemy-improved-course-library/raw/main/src/icon64.png
// @run-at          document-end
// @match           https://www.udemy.com/home/my-courses/*
// @compatible      firefox Tested on Firefox v117.0 with Violentmonkey v2.15.0 and Tampermonkey v4.19.0
// @compatible      chrome Tested on Chrome v115.0 with Violentmonkey v2.15.0 and Tampermonkey v4.19.0
// @downloadURL https://update.greasyfork.org/scripts/402838/Udemy%20-%20Improved%20Course%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/402838/Udemy%20-%20Improved%20Course%20Library.meta.js
// ==/UserScript==

fetchCourses();

const mutationObserver = new MutationObserver(fetchCourses);
const observerConfig = {
  childList: true,
  subtree: true
};
mutationObserver.observe(document, observerConfig);

const i18n = loadTranslations();
const lang = getLang(document.documentElement.lang);

function fetchCourses() {
  listenForArchiveToggle();
  const courseContainers = document.querySelectorAll('[class^="enrolled-course-card--container--"]:not(.details-done)');
  if (courseContainers.length == 0) return;
  [...courseContainers].forEach((courseContainer) => {

    const isPartialRefresh = courseContainer.classList.contains('partial-refresh');

    const courseId = courseContainer.querySelector('h3[data-purpose="course-title-url"]>a').href.replace('https://www.udemy.com/course-dashboard-redirect/?course_id=', '');

    const courseCustomDiv = document.createElement('div');
    courseCustomDiv.classList.add('improved-course-card--additional-details', 'js-removepartial');

    const innerContainer = courseContainer.querySelector('div[data-purpose="container"]')
    innerContainer.appendChild(courseCustomDiv);

    courseContainer.classList.add('details-done');
    courseContainer.classList.add('improved-course-card--container');
    courseContainer.classList.remove('partial-refresh');

    // Add Link to course overview to options dropdown
    const courseLinkLi = document.createElement('li');
    courseLinkLi.innerHTML = `
      <a class="udlite-btn udlite-btn-large udlite-btn-ghost udlite-text-sm udlite-block-list-item udlite-block-list-item-small udlite-block-list-item-neutral" role="menuitem" tabindex="-1" href="https://www.udemy.com/course/${courseId}/" target="_blank" rel="noopener">
        <span class="udi-small udi udi-explore udlite-block-list-item-icon"></span>
        <div class="udlite-block-list-item-content card__course-link">${i18n[lang].overview}
          <svg fill="#686f7a" width="12" height="16" viewBox="0 0 24 24" style="vertical-align: bottom; margin-left: 5px;" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z"></path>
          </svg>
        </div>
      </a>
    `;
    courseLinkLi.classList.add('js-removepartial');

    const allDropdowns = courseContainer.parentElement.querySelectorAll('.udlite-block-list');
    if (allDropdowns[1]) {
      allDropdowns[1].appendChild(courseLinkLi);
    }

    // Find existing elements in DOM
    const imageWrapper = courseContainer.querySelector('div[class^="course-card-module--image-container--"]');
    imageWrapper.classList.add('improved-course-card--image-container');

    const mainContent = courseContainer.querySelector('div[class^="course-card-module--main-content--"]');
    mainContent.classList.add('improved-course-card--main-content');

    const courseTitle = courseContainer.querySelector('h3[data-purpose="course-title-url"]');
    courseTitle.classList.add('improved-course-card--course-title');

    const priceTextContainer = courseContainer.querySelector('div[class^="course-card-module--price-text-container--"]');
    if (priceTextContainer) priceTextContainer.parentNode.removeChild(priceTextContainer);

    const courseBadges = courseContainer.querySelector('div[class^="course-card-module--badges-container--"]');
    if (courseBadges) courseBadges.parentNode.removeChild(courseBadges);

    const progressBar = courseContainer.querySelector('div[class^="enrolled-course-card--meter--"]');
    progressBar?.classList.add('improved-course-card--meter');

    const progressAndRating = courseContainer.querySelector('div[class*="enrolled-course-card--progress-and-rating--"]');
    progressAndRating?.classList.add('improved-course-card--progress-and-rating');

    const progressText = progressAndRating.firstChild;
    const progressMade = /%/.test(progressText.textContent);

    if (!progressMade) progressAndRating.parentNode.removeChild(progressAndRating);

    // If progress made
    if (progressMade) {
      // Add progress bar below thumbnail
      const progressBarSpan = document.createElement('span');
      progressBarSpan.classList.add('impr__progress-bar', 'js-removepartial');
      progressBarSpan.innerHTML = progressBar.innerHTML;
      imageWrapper.appendChild(progressBarSpan);
      // Add progress percentage to thumbnail bottom right
      const progressTextSpan = document.createElement('span');
      progressTextSpan.classList.add('card__thumb-overlay', 'card__course-runtime', 'hover-show', 'js-removepartial');
      progressTextSpan.textContent = progressText.textContent;
      imageWrapper.appendChild(progressTextSpan);
      // Remove existing progress percentage
      progressText.parentNode.removeChild(progressText);
    }

    // Remove existing progress bar
    if (!isPartialRefresh) {
      progressBar.parentNode.removeChild(progressBar);
    }

    // If course page has draft status, do not even to fetch its data via API
    if (courseContainer.querySelector('[data-purpose="course-title-url"] a').href.includes('/draft/')) {
      courseContainer.querySelector('.card__course-link').style.textDecoration = "line-through";
      courseCustomDiv.classList.add('card__nodata');
      courseCustomDiv.innerHTML += i18n[lang].notavailable;
      // We're done with this course
      return;
    }

    const fetchUrl = 'https://www.udemy.com/api-2.0/courses/' + courseId + '?fields[course]=rating,num_reviews,num_subscribers,content_length_video,last_update_date,created,locale,has_closed_caption,caption_languages,num_published_lectures';
    fetch(fetchUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then(json => {
        if (typeof json === 'undefined') { return; }

        // Get everything from JSON and put it in variables
        const rating = json.rating.toFixed(1);
        const reviews = json.num_reviews;
        const enrolled = json.num_subscribers;
        const runtime = json.content_length_video;
        const date = json.last_update_date ?? json.created.slice(0, 10); // 'created' comes as full iso string with time
        const locale = json.locale.title;
        const localeCode = json.locale.locale;
        const hasCaptions = json.has_closed_caption;
        const captionsLangs = json.caption_languages;

        // Format "Last updated / Created" Dates
        const updateDateShort = date ? date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2\/$1') : '';
        const updateDateLong = date ? new Date(date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' }) : '';

        // Small helper for rating strip color
        const getColor = v => `hsl(${(Math.round((1 - v) * 120))},100%,45%)`;
        const colorValue = r => Math.min(Math.max((5 - r) / 2, 0), 1);

        // If captions are available, create the tag for it. We'll add it in template string later
        let captionsTag = '';
        if (hasCaptions) {
          const captionsString = captionsLangs.join('&#013;&#010;');
          captionsTag = `
            <div class="impr__badge" data-tooltip="${captionsString}">
              <svg aria-hidden="true" focusable="false" class="ud-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21 4H3v16h18V4zm-10 7H9.5v-.5h-2v3h2V13H11v2H6V9h5v2zm7 0h-1.5v-.5h-2v3h2V13H18v2h-5V9h5v2z"/>
              </svg>
            </div>
          `;
        }

        // Returns true or false depending if stars are visible
        const reviewButton = courseContainer.querySelector('[data-purpose="review-button"]');

        // Now let's handle own ratings

        // Set up empty html
        let myRatingHtml = '';
        let ratingButton;
        let ratingOwn = 0;

        // If ratings stars ARE visible, proceed to build own rating stars
        if (reviewButton != null) {

          // Find the rating-button, and remove its css class
          ratingButton = reviewButton;

          // If I have voted, count the stars and tell me how I voted
          ratingOwn = getRatingFromSvg(ratingButton.querySelector('svg')); // between 0 and 5

          // Remove the old stars from ratingButton
          ratingButton.removeChild(ratingButton.querySelector('span'));

          // Build the html
          myRatingHtml = `
            <div class="impr__rating-row">
              <span class="impr__star-wrapper">
                <span class="ud-sr-only">Rating: ${ratingOwn} out of 5</span>
                ${buildSvgStars(courseId.toString() + '-own', ratingOwn)}
                <span class="ud-heading-sm impr__rating-number">${setDecimal(ratingOwn, lang)}</span>
              </span>
              <span class="ud-text-xs impr__rating-count">(<span class="review-button"></span>)</span>
            </div>
          `;
        }

        const ratingStripColor = ratingOwn > 0 ? ratingOwn : rating;

        let updateDateInfo = '';
        if (updateDateShort !== '' && updateDateLong !== '') {
          updateDateInfo = `
            <div class="impr__badge" data-tooltip="${i18n[lang].updated}${updateDateLong}">
              <svg aria-hidden="true" focusable="false" class="ud-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M11 8v5l4.3 2.5.7-1.3-3.5-2V8H11zm10 2V3l-2.6 2.6A9 9 0 1 0 21 12h-2a7 7 0 1 1-2-5l-3 3h7z"/>
              </svg><span>${updateDateShort}</span>
            </div>
          `;
        }

        courseCustomDiv.innerHTML = `
          <div class="impr__rating">
            <div class="impr__rating-row">
              <span class="impr__star-wrapper">
                <span class="ud-sr-only">Rating: ${rating} out of 5</span>
                ${buildSvgStars(courseId, rating)}
                <span class="ud-heading-sm impr__rating-number">${setDecimal(rating, lang)}</span>
              </span>
              <span class="ud-text-xs impr__rating-count">(${setSeparator(reviews, lang)})</span>
            </div>
            ${myRatingHtml}
          </div>
          <div class="impr__rating-strip" style="background-color:${getColor(colorValue(ratingStripColor))}"></div>
          <div class="impr__stats">
            <div class="impr__badge" data-tooltip="${setSeparator(enrolled, lang)} ${i18n[lang].enrolled}">
              <svg aria-hidden="true" focusable="false" class="ud-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0h-1c1.2.9 2 2 2 3.5V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
              </svg><span>${setSeparator(enrolled, lang)}</span>
            </div>
            ${updateDateInfo}
            ${captionsTag}
          </div>
        `;

        if (reviewButton != null) {
          const reviewButtonContainer = courseCustomDiv.querySelector('.review-button');
          ratingButton.style.display = 'inline';
          reviewButtonContainer.appendChild(ratingButton);
        }

        // Hide language badge if language is English
        if (localeCode.slice(0, 2) !== 'en') {
          const localeSpan = document.createElement('span');
          localeSpan.classList.add('card__thumb-overlay', 'card__course-locale', 'hover-hide', 'js-removepartial');
          localeSpan.innerHTML = `<span style="margin-right: 3px;vertical-align: bottom;font-size: 14px;line-height: 13px;">${getFlagEmoji(localeCode.slice(-2))}</span>${locale}`;
          imageWrapper.appendChild(localeSpan);
        }

        // Add course runtime from API to thumbnail bottom right
        const runtimeSpan = document.createElement('span');
        runtimeSpan.classList.add('card__thumb-overlay', 'card__course-runtime', 'hover-hide', 'js-removepartial');
        runtimeSpan.innerHTML = parseRuntime(runtime, lang);
        imageWrapper.appendChild(runtimeSpan);
      })
      .catch(error => {
        courseCustomDiv.classList.add('card__nodata');
        courseCustomDiv.innerHTML += `<div><b>${error}</b><br>${i18n[lang].notavailable}</div>`;
      });
  });
}

function listenForArchiveToggle() {

  document.querySelectorAll('[data-purpose="toggle-archived"]').forEach(item => {
    item.addEventListener('click', event => {

      // super super dirty quickfix for broken archiving. I am sorry
      setTimeout(() => {
        location.reload();
      }, 500)

    });
  });
}

function setSeparator(int, lang) {
  return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, i18n[lang].separator);
}

function setDecimal(rating, lang) {
  return rating.toString().replace('.', i18n[lang].decimal);
}

function getLang(lang) {
  return i18n.hasOwnProperty(lang) ? lang : 'en-us';
}

function buildSvgStars(courseId, rating) {
  return (`
<svg aria-hidden="true" viewBox="0 0 70 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="impr__svg-stars">
  <mask id="mask-${courseId}" data-purpose="star-rating-mask">
    <rect x="0" y="0" width="${rating * 20}%" height="100%" fill="white"></rect>
  </mask>
  <g fill="#e59819" mask="url(#mask-${courseId})" data-purpose="star-filled">
    <use xlink:href="#icon-rating-star" width="14" height="14" x="0"></use>
    <use xlink:href="#icon-rating-star" width="14" height="14" x="14"></use>
    <use xlink:href="#icon-rating-star" width="14" height="14" x="28"></use>
    <use xlink:href="#icon-rating-star" width="14" height="14" x="42"></use>
    <use xlink:href="#icon-rating-star" width="14" height="14" x="56"></use>
  </g>
  <g fill="transparent" stroke="#e59819" stroke-width="2" data-purpose="star-bordered">
    <use xlink:href="#icon-rating-star" width="12" height="12" x="1" y="1"></use>
    <use xlink:href="#icon-rating-star" width="12" height="12" x="15" y="1"></use>
    <use xlink:href="#icon-rating-star" width="12" height="12" x="29" y="1"></use>
    <use xlink:href="#icon-rating-star" width="12" height="12" x="43" y="1"></use>
    <use xlink:href="#icon-rating-star" width="12" height="12" x="57" y="1"></use>
  </g>
</svg>
  `);
}

function parseRuntime(seconds, lang) {
  if (seconds % 60 > 29) { seconds += 30; }
  let hours = Math.floor(seconds / 60 / 60);
  let minutes = Math.floor(seconds / 60) - (hours * 60);
  let hoursFormatted = hours > 0 ? hours.toString() + i18n[lang].hours : '';
  let minutesFormatted = minutes > 0 ? ' ' + minutes.toString() + i18n[lang].mins : '';
  return hoursFormatted + minutesFormatted;
}

function getRatingFromSvg(svgElement) {
  let percentage = svgElement.querySelector('mask rect').getAttribute('width');
  let rating = parseFloat(percentage) / 100 * 5;
  return rating;
}

function loadTranslations() {
  return {
    'en-us': {
      'overview': 'Course overview',
      'enrolled': 'students',
      'updated': 'Last updated ',
      'notavailable': 'Course info not available',
      'separator': ',',
      'decimal': '.',
      'hours': 'h',
      'mins': 'm'
    },
    'de-de': {
      'overview': 'Kursübersicht',
      'enrolled': 'Teilnehmer',
      'updated': 'Zuletzt aktualisiert ',
      'notavailable': 'Kursinfo nicht verfügbar',
      'separator': '.',
      'decimal': ',',
      'hours': ' Std',
      'mins': ' Min'
    },
    'es-es': {
      'overview': 'Descripción del curso',
      'enrolled': 'estudiantes',
      'updated': 'Última actualización ',
      'notavailable': 'La información del curso no está disponible',
      'separator': '.',
      'decimal': ',',
      'hours': ' h',
      'mins': ' m'
    },
    'fr-fr': {
      'overview': 'Aperçu du cours',
      'enrolled': 'participants',
      'updated': 'Dernière mise à jour : ',
      'notavailable': 'Informations sur les cours non disponibles',
      'separator': ' ',
      'decimal': ',',
      'hours': ' h',
      'mins': ' min'
    },
    'it-it': {
      'overview': 'Panoramica del corso',
      'enrolled': 'studenti',
      'updated': 'Ultimo aggiornamento ',
      'notavailable': 'Informazioni sul corso non disponibili',
      'separator': '.',
      'decimal': ',',
      'hours': ' h',
      'mins': ' min'
    },
    'ja-jp': {
      'overview': 'コースの概要',
      'enrolled': '受講生',
      'updated': '最終更新日 ',
      'notavailable': 'コースの情報はありません。',
      'separator': ',',
      'decimal': '.',
      'hours': '時間',
      'mins': '分'
    }
  };
}

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const style = document.createElement('style');
style.textContent = `
.improved-course-card--container {
  border: 1px solid #d1d7dc;
}

.improved-course-card--container:hover {
  background-color: #f7f9fa;
}

.improved-course-card--container .improved-course-card--image-container {
  border-width: 0 0 1px 0;
}

.improved-course-card--main-content {
  padding: 0 6px;
  min-height: 68px;
}

.card--learning__details {
  border-top: 1px solid #e8e9eb;
}

.card__details {
  padding: 12px;
  height: 66px;
  white-space: initial;
}

.improved-course-card--course-title {
  font-size: 1.4rem !important;
}

span[class^='leave-rating--helper-text'] {
  font-size: 10px;
  white-space: nowrap;
}

.card__thumb-overlay {
  position: absolute;
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  margin: 4px;
  padding: 2px 4px;
  border-radius: 2px;
  transition: opacity linear 100ms;
}

.card__course-link {
  font-size: 1.4rem;
}

.card__course-runtime {
  bottom: 0;
  right: 0;
  background-color: rgba(20, 30, 46, 0.75);
  color: #ffffff;
}

.impr__progress-bar ~ .card__course-runtime {
  bottom: 4px;
}

.card__course-locale {
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 1px 1px rgba(20, 23, 28, 0.1);
  color: #29303b;
  font-weight: 600;
}

.improved-course-card--container .hover-hide {
  opacity: 1;
}

.improved-course-card--container .hover-show {
  opacity: 0;
}

.improved-course-card--container:hover .hover-hide {
  opacity: 0;
}

.improved-course-card--container:hover .hover-show {
  opacity: 1;
}

.impr__progress-bar {
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 5px;
  background: rgba(20, 30, 46, 0.75);
}

.impr__progress-bar .progress__bar {
  background: #a435ef !important;
}

.improved-course-card--additional-details {
  width: 100%;
  font-size: 1.2rem;
  color: #464b53;
  height: 82px;
}

.impr__rating .impr__rating-number {
  margin-left: 0.4rem;
  font-size: 1.3rem;
  color: #505763;
}

.impr__rating-count {
  color: #6a6f73;
  margin-left: 0.4rem;
}

.impr__rating {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 6px 6px;
  height: 42px;
}

.impr__rating-strip {
  height: 5px;
}

.impr__stats {
  font-weight: 500;
  padding: 6px;
  line-height: 1.7;
  display: flex;
}

.impr__badge {
  display: inline-flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background: #f7f8fa;
  padding: 0 5px;
  margin-right: 5px;
  border-radius: 2px;
  border: 1px solid #e7e7e8;
  cursor: default;
}

.impr__badge .ud-icon {
  width: 1.4rem;
  height: 1.4rem;
  opacity: 0.75;
}

.impr__svg-stars {
  display: block;
  width: 7rem;
  height: 1.6rem;
}

.card__nodata {
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 75px;
  margin-top: 10px;
  padding: 12px;
  background: #fbf4f4;
  color: #521822;
}

.impr__badge:hover:after {
  display: flex;
  justify-content: center;
  background: #4f5662;
  border-radius: 3px;
  color: #fff;
  content: attr(data-tooltip);
  bottom: 24px;
  margin: 0;
  font-size: 11px;
  padding: 2px 6px;
  position: absolute;
  z-index: 10;
  white-space: pre;
}

.impr__badge:hover:before {
  border: solid;
  border-color: #4f5662 transparent;
  content: '';
  left: 50%;
  margin-left: -4px;
  position: absolute;
  top: -4px;
  border-width: 6px 4px 0;
}

.impr__rating-row {
  margin: 0;
  padding: 0;
  display: flex;
}

.impr__star-wrapper {
  display: inline-flex;
  align-items: center;
}`;
document.documentElement.appendChild(style);