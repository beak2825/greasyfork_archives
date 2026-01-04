// ==UserScript==
// @name         Bring Back YouTube Red Progress Bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change YouTube progress bar and scrubber colour to red
// @author       You
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537651/Bring%20Back%20YouTube%20Red%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/537651/Bring%20Back%20YouTube%20Red%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .html5-play-progress,
        .ytp-play-progress {
            background: #ff0000 !important; 
        }

        div.ytp-scrubber-button.ytp-swatch-background-color {  
            background: #ff0000 !important; 
        }

        div.YtProgressBarLineProgressBarPlayed.YtProgressBarLineProgressBarPlayedRefresh {
            background: #ff0000 !important; 
        }

        div.style-scope.ytd-thumbnail-overlay-resume-playback-renderer {
            background: #ff0000 !important;
        }
    `);
})();
