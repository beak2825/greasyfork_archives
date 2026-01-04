// ==UserScript==
// @name         Twitch Stream Banner Fix 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Moves the broadcast information block down the page on Twitch, ensures visibility of viewer count, timestamp, and shifts the block slightly to the right to avoid covering the online streamer list.
// @author       Gullampis810
// @match        *://www.twitch.tv/*
// @license      MIT
// @grant        none
// @icon https://cdn-icons-png.flaticon.com/512/684/684131.png
// @downloadURL https://update.greasyfork.org/scripts/520461/Twitch%20Stream%20Banner%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/520461/Twitch%20Stream%20Banner%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply custom styles
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Move the broadcast info block down */
            .channel-root__upper-watch {
                position: fixed !important;
                bottom: 0 !important;
                left: 240px !important; /* Shift the block slightly to the right */
                width: calc(100% - 20px) !important; /* Adjust width to fit */
                z-index: 1000 !important;
                background: rgba(0, 0, 0, 0.8) !important; /* Dark semi-transparent background */
                color: #fff !important; /* Ensure text is visible */
                padding: 10px !important; /* Add some spacing for better readability */
                display: flex !important; /* Maintain layout */
                align-items: center !important;
                justify-content: space-between !important; /* Ensure elements are well spaced */
            }

            /* Ensure viewer count, timestamp, and other elements remain visible */
            .channel-root__upper-watch .Layout-sc-1xcs6mc-0 {
                margin: 0 !important;
                display: flex !important;
                align-items: center !important;
            }

            /* Adjust viewer count styling */
            .channel-root__upper-watch [data-a-target="channel-viewers-count"] {
                font-size: 14px !important;
                color: #ffb700 !important; /* Highlight viewer count */
                margin-left: 10px !important;
            }

            /* Adjust timestamp styling */
            .channel-root__upper-watch [data-a-target="stream-time"] {
                font-size: 14px !important;
                color: #00ff00 !important; /* Highlight timestamp */
                margin-left: 20px !important;
            }

            .Layout-sc-1xcs6mc-0.PziIi {
                background: #f9f9f900 !important; /* New dark gray with transparency */
            }

            /* Shift avatar to the right to avoid covering online streamer list */
            .channel-root__upper-watch .channel-root__info {
                margin-left: 30px !important; /* Add margin to shift avatar */
            }

            /* Add custom styling for .jxLMqv */
            .jxLMqv {
                -webkit-box-flex: 999 !important;
                flex-grow: 999 !important;
                flex-shrink: 1 !important;
                width: 0px !important;
                max-width: fit-content !important;
                min-width: 95rem !important;
            }
        `;

        // Append styles to the head of the document
        document.head.appendChild(style);
    }

    // Wait for the page to load before applying styles
    const observer = new MutationObserver(() => {
        const targetElement = document.querySelector('.channel-root__upper-watch');
        if (targetElement) {
            addCustomStyles();
            observer.disconnect(); // Stop observer after styles are applied
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
