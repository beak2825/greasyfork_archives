// ==UserScript==
// @name         Peacock Adjust Subtitle Position
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adjust the bottom subtitle position on peacocktv.com
// @author       FatKitty
// @match        https://www.peacocktv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=peacocktv.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466650/Peacock%20Adjust%20Subtitle%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/466650/Peacock%20Adjust%20Subtitle%20Position.meta.js
// ==/UserScript==

    // Edit the 'bottom: 20%' to adjust the subtitle position.
    // 10% represents a lower, while 30% represents a higher position.
    GM_addStyle(`
    .video-player__subtitles--position__default .video-player__subtitles__cue {
        bottom: 20% !important;
    }
    `);