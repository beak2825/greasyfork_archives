// ==UserScript==
// @name        Clean wetter.com
// @description Hide unrelated elements, auto load updates
// @namespace   shiftgeist
// @match       https://www.wetter.com/*
// @grant       GM_addStyle
// @version     20250622
// @author      shiftgeist
// @license     GNU GPLv3
// @icon        https://cs3.wettercomassets.com/wcomv5/images/icons/favicon/48x48.png
// @downloadURL https://update.greasyfork.org/scripts/528128/Clean%20wettercom.user.js
// @updateURL https://update.greasyfork.org/scripts/528128/Clean%20wettercom.meta.js
// ==/UserScript==

/** Ublock Origin Filters

||cs3.wettercomassets.com/filemanager/*$image
||cs3.wettercomassets.com/*.jpg$image
||cs3.wettercomassets.com/wcomv6/maps/*$image
||static-radar.wettercomassets.com/*$image
www.wetter.com##.slideout-menu-left.slideout-menu.sticky-hide.desk-bottom-border--white-30.desk-top-border--white-20.js-mobil-scroll-wrapper.\].portable-bg--white.\[
www.wetter.com##.lap-two-fifths.lap-pl-.desk-pl.\].layout__item.\]\[.aside.\[
www.wetter.com##.json-ld-question.mv-.gamma
www.wetter.com###nowcast > h3
www.wetter.com##.border--grey-next.warnings.vhs-text--small.pb-.ph-
www.wetter.com##.moon
www.wetter.com##.thumbnail-container.bg--black
www.wetter.com##.bg--blue.ml0.layout.clearfix.mb
www.wetter.com##.mb\+.clearfix
www.wetter.com##.social-grid
www.wetter.com##div.clearfix:nth-of-type(14)
www.wetter.com##.footer
www.wetter.com##[data-template]
www.wetter.com##.werbung
www.wetter.com##.snowthority.mt\].mb-.portable-one-whole.desk-one-whole.layout__item.\[
www.wetter.com###furtherDetails > .layout > .layout__item:nth-of-type(3)
www.wetter.com###furtherDetails > .layout > .layout__item:nth-of-type(2)
www.wetter.com###furtherDetails > .layout > .layout__item:nth-of-type(1)
www.wetter.com###furtherDetails > h2
www.wetter.com##.desk-pr.gamma
www.wetter.com##.slick-slide img
www.wetter.com###pictureNewsWithRightText
www.wetter.com##.wetter-carousel.relative
www.wetter.com##.palm-one-whole.lap-five-ninths.palm-mb.\].three-fifths.layout__item.\[
www.wetter.com##.\].palm-mb--.mb.\[
www.wetter.com##.beta.title
www.wetter.com##.slider-overlay
www.wetter.com##.cityweather.app-layout > p
www.wetter.com##.cityweather h2
www.wetter.com###weather-cam-video

*/

GM_addStyle(`
#cnt-with-location-attributes .rtw_weather_txt.text--small {
  font-size: 1rem !important;
}

.desk-two-thirds,
.homepagemapmodule .c1,
.mia-map-container {
  width: unset !important;
  max-width: unset !important;
}

#header-placeholder,
.mia-map-container,
.homepagemapmodule,
.cityweather {
  height: auto !important;
  min-height: auto !important;
}

.forecast-navigation-move,
.bg--blue-gradient,
.forecast-navigation-grid a:not(.is-active):not(:hover),
.forecast-navigation-line a.is-active,
.forecast-navigation-line a:hover {
  background: #3769b6 !important;
}

.forecast-navigation-grid a.is-active,
.forecast-navigation-grid a:hover {
  background: #fff !important;
}

#current-weather-with-content {
  margin: -20px -20px 0;
}

@media only screen and (max-width: 600px) {
  #current-weather-with-content {
    margin: -30px -40px 0;
  }
}

.forecast-navigation-move {
  border-radius: 0 0 4px 4px;
  padding: 10px 10px 6px 10px;
}

.bottom-border--grey {
  border: none !important;
}

.sun-moon .sun {
  font-size: 18px;
}

.spaces-weather-grid .swg-row-wrapper {
  grid-template-columns: unset !important;
}

#cnt-with-location-attributes.flex-gap {
  gap: unset;
}

#cnt-with-location-attributes .lap-pr- {
  padding-right: 0 !important;
}
`);

setInterval(() => {
  const hasUpdate = document.querySelector('#newRefresh .btn');

  if (hasUpdate.offsetParent) {
    hasUpdate.click();
  }
}, 5000);

const selectors = [
  ['div.app-layout', 'News zum Thema Wetter'],
  ['div.app-layout', 'Wetter-News'],
  ['div.app-layout', 'Wetter live in Deutschland'],
  ['div.app-layout', 'Webvideos aus aller Welt'],
  ['div.app-layout', 'Wetter Deutschland'],
  ['div.app-layout', 'Die nächsten Wetterstationen'],
  ['div.app-layout', 'Einen anderen Ort auswählen'],
  ['div.app-layout', 'Das könnte dich auch interessieren'],
  ['div.app-layout', 'Details zur Wetterkarte Regenradar für Deutschland'],
  ['div.app-layout', 'Tipps für die Wahl des richtigen Lichtschutzfaktors'],
  ['div.c2', 'Mehr zum Wetter'],
  ['.layout__item', 'Aktuelle Videos für das Wetter in Deutschland'],
  ['.layout__item', 'Unwetterwarnungen'],
  ['.layout__item', '3-Tage-Wetter'],
  ['.pt--', 'Standort'],
  ['div', 'Die HD-Kamera zeigt das Wetter live am Standort'],
];

selectors.forEach(([select, text]) => {
  const parents = Array.from(document.querySelectorAll(select));
  const parentF = parents.filter(p => p.innerText.toLowerCase().trim().startsWith(text.toLowerCase()));
  parentF.forEach(p => {
    p.style.display = 'none';
  });
  console.log(`[clean] Removed ${parentF.length} elements.`)
})