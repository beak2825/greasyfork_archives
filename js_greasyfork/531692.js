// ==UserScript==
// @name         YouTube Fix Pink Playback Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes Pink Playback Bar Back To Red.
// @author       F02x
// @match        https://www.youtube.com/*
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531692/YouTube%20Fix%20Pink%20Playback%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/531692/YouTube%20Fix%20Pink%20Playback%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a <style> element to hold the CSS
    const style = document.createElement('style');

    // Add the CSS rules from the Stylebot code
    style.textContent = `
        /* Video player progress bars */
        .html5-play-progress, .ytp-play-progress {
            background: #FF0000 !important;
        }

        /* Scrubber button in the video player */
        div.ytp-scrubber-button.ytp-swatch-background-color {
            background: #FF0000 !important;
        }

        /* Additional progress bar element */
        div.YtProgressBarLineProgressBarPlayed.YtProgressBarLineProgressBarPlayedRefresh {
            background: #FF0000 !important;
        }

        /* Progress bar on video thumbnails */
        div.style-scope.ytd-thumbnail-overlay-resume-playback-renderer {
            background: #FF0000 !important;
        }
    `;

    // Append the style element to the document's <head>
    document.head.appendChild(style);
})();