// ==UserScript==
// @name             Twitter Auto Dark Mode
// @version          1.11
// @author           Yukiteru
// @license          MIT
// @grant            none
// @match            *://x.com/*
// @description      Auto dark mode for Twitter -- or X
// @namespace https://greasyfork.org/users/91424
// @downloadURL https://update.greasyfork.org/scripts/477420/Twitter%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/477420/Twitter%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

function toggleTheme(isDarkMode) {
  // 0 stands for light mode, 1 for dark blue mode, 2 for dark mode
  const mode = isDarkMode ? 1 : 0;
  document.cookie = `night_mode=${mode};path=/;domain=.x.com;secure`;
}

const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
toggleTheme(darkMedia.matches); // toggle theme when page loaded

darkMedia.addEventListener('change', e => {
  toggleTheme(e.matches); // toggle theme when system theme is changed
});