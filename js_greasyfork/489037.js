// ==UserScript==
// @name        Reddit Auto Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.02
// @author      Yukiteru
// @description Change Reddit's theme based on your system theme
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489037/Reddit%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/489037/Reddit%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

function getToggleSwitch() {
  return document.querySelector('#darkmode-list-item > div > span.flex.items-center.shrink-0 > span > faceplate-switch-input');
}

function isDarkMode() {
  return getToggleSwitch().getAttribute('aria-checked') === 'true';
}

function toggleTheme(isDark) {
  if (isDark !== isDarkMode()) getToggleSwitch().click(); // only toggles when the reddit theme and system theme does not match
}

const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
setTimeout(() => toggleTheme(darkMedia.matches), 500)

darkMedia.addEventListener('change', e => {
  toggleTheme(e.matches); // toggle theme when system theme is changed
});
