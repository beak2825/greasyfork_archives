// ==UserScript==
// @name         Auto Light/Dark PWA Titlebar
// @version      1.2
// @description  Changes titlebar of PWA to be light or dark
// @author       https://github.com/ruukulada
// @namespace    https://github.com/ruukulada
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534782/Auto%20LightDark%20PWA%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/534782/Auto%20LightDark%20PWA%20Titlebar.meta.js
// ==/UserScript==

function toggleTheme(isDarkMode) {
  'use strict';
  var meta = document.createElement("meta");
  meta.name = "theme-color";
  const mode = isDarkMode ? "#000000" : "#FFFFFF";
  meta.content = mode;
  document.getElementsByTagName("head")[0].prepend(meta);
}
const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
toggleTheme(darkMedia.matches);
darkMedia.addEventListener('change', e => {
  toggleTheme(e.matches);
});
