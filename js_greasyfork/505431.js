// ==UserScript==
// @name         YouTube to Netflix Player Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Style YouTube player to look like Netflix player
// @author       Mason
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505431/YouTube%20to%20Netflix%20Player%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/505431/YouTube%20to%20Netflix%20Player%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to style the YouTube player
    GM_addStyle(`
        /* Hide YouTube controls */
        .ytp-chrome-top, .ytp-chrome-bottom {
            display: none !important;
        }

        /* Adjust player size */
        #player-container {
            width: 100% !important;
            height: 100% !important;
        }

        /* Style the play/pause button */
        .ytp-play-button {
            background-image: url('https://your-netflix-play-button-image-url'); /* Replace with your Netflix-style play button image URL */
            background-size: contain;
            background-repeat: no-repeat;
        }

        /* Style the progress bar */
        .ytp-progress-bar-container {
            background: #333 !important; /* Darker background for the progress bar */
        }

        /* Style the volume button */
        .ytp-volume-panel {
            background: #333 !important; /* Darker background for volume panel */
        }

        /* Customize other elements as needed */
        /* Add more CSS rules to style the player as per your needs */
    `);

})();
