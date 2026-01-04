// ==UserScript==
// @name        YouTube Mobile Background Playback (Firefox Android)
// @description Enable YouTube background playback in Firefox for Android
// @namespace   http://tampermonkey.net/
// @match       *://m.youtube.com/*
// @match       *://*.youtube-nocookie.com/*
// @grant       none
// @version     1.0
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author      -
// @downloadURL https://update.greasyfork.org/scripts/525586/YouTube%20Mobile%20Background%20Playback%20%28Firefox%20Android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525586/YouTube%20Mobile%20Background%20Playback%20%28Firefox%20Android%29.meta.js
// ==/UserScript==

'use strict';				   
const lactRefreshInterval = 5 * 60 * 1000; // 5 minutes
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