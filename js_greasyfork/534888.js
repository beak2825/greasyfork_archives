// ==UserScript==
// @name         YouTube Hide Controls When Paused
// @namespace    https://youtube.com/
// @version      1.0
// @description  Hides YouTube controls when paused unless hovering
// @author       ChatGPT
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534888/YouTube%20Hide%20Controls%20When%20Paused.user.js
// @updateURL https://update.greasyfork.org/scripts/534888/YouTube%20Hide%20Controls%20When%20Paused.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* Hide controls when paused and not hovered */
        .html5-video-player.paused:not(:hover) .ytp-chrome-bottom,
        .html5-video-player.paused:not(:hover) .ytp-gradient-bottom {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease-in-out;
        }

        /* Show controls on hover */
        .html5-video-player.paused:hover .ytp-chrome-bottom,
        .html5-video-player.paused:hover .ytp-gradient-bottom {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `);
})();
