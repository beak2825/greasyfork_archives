// ==UserScript==
// @name         Youtube Prevent Subtitle Auto-Translation
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  Prevent caption auto translation into the previous language you had captions generate in. Simply resets the caption language in local storage.
// @author       iwersi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508005/Youtube%20Prevent%20Subtitle%20Auto-Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/508005/Youtube%20Prevent%20Subtitle%20Auto-Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.removeItem('yt-player-caption-sticky-language');
})();