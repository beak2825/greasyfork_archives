// ==UserScript==
// @name         YouTube Background Playback - Kiwi Browser
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Enable YouTube background playback in Kiwi.
// @author       hacker09
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521370/YouTube%20Background%20Playback%20-%20Kiwi%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/521370/YouTube%20Background%20Playback%20-%20Kiwi%20Browser.meta.js
// ==/UserScript==

'use strict';
const lactRefreshInterval = 5 * 60 * 1000; // 5 mins
const initialLactDelay = 1000;

// Page Visibility API
Object.defineProperties(document, { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
window.addEventListener('visibilitychange', e => {
  e.stopImmediatePropagation();
  setTimeout(() => document.querySelector('video').play(), 2000);
}, true);

// _lact stuff
function waitForYoutubeLactInit(delay = initialLactDelay) {
  if (window.hasOwnProperty('_lact')) {
    window.setInterval(() => { window._lact = Date.now(); }, lactRefreshInterval);
  }
  else{
    window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay);
  }

}

waitForYoutubeLactInit();