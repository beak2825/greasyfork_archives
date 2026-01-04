// ==UserScript==
// @name        MyAnimeList Auto Dark Mode
// @namespace   Violentmonkey Scripts
// @match       *://*.myanimelist.net/*
// @grant       none
// @version     0.1
// @author      Lim Chee Aun
// @description Automatically toggle built-in dark mode on myanimelist.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473536/MyAnimeList%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/473536/MyAnimeList%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  document.documentElement.classList.toggle('dark-mode', e.matches);
});
