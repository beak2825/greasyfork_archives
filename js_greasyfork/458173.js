// ==UserScript==
// @name        YouTube Don't Stop
// @description Remove YouTube "Video paused. Continue watching?"
// @namespace   https://blog.coniy.com/?YouTubeDontStop
// @match       *://*.youtube.com/*
// @match       *://*.youtube-nocookie.com/*
// @run-at      document-end
// @author      chengxuncc
// @version     1.0
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/458173/YouTube%20Don%27t%20Stop.user.js
// @updateURL https://update.greasyfork.org/scripts/458173/YouTube%20Don%27t%20Stop.meta.js
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
    }else{
        window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay);
    }
}

waitForYoutubeLactInit();

// Hide start to play
window.setTimeout(() => {
    window.document.getElementsByTagName("yt-bubble-hint-renderer")[0].style.display = 'none';
}, 1000);
window.setTimeout(() => {
    window.document.getElementsByTagName("yt-bubble-hint-renderer")[0].style.display = 'none';
}, 2000);