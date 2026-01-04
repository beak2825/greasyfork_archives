// ==UserScript==
// @name         Video-Background-Playback
// @namespace    Video-Background-Playback-Userscript
// @version      0.1.0
// @description  Enable YouTube and Tiktok background playback
// @author       lkccrr
// @match        *://*.tiktok.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524684/Video-Background-Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/524684/Video-Background-Playback.meta.js
// ==/UserScript==

'use strict';
const lactRefreshInterval = 5 * 60 * 1000; // 5 mins
const initialLactDelay = 1000;

// Page Visibility API
Object.defineProperties(document, { 'hidden': { value: false }, 'visibilityState': { value: 'visible' } });
window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);

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
