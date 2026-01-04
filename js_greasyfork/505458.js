// ==UserScript==
// @name         YouTube Mobile View
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Emulates YouTube mobile view on desktop
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505458/YouTube%20Mobile%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/505458/YouTube%20Mobile%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS to emulate mobile view
    const style = document.createElement('style');
    style.textContent = `
        /* General styling for mobile view */
        body {
            overflow-x: hidden !important;
        }
        #player-container {
            max-width: 100% !important;
            margin: 0 auto !important;
        }
        #content {
            margin: 0 !important;
            padding: 0 !important;
        }
        .ytd-app {
            max-width: 375px !important;
            margin: 0 auto !important;
            width: 100% !important;
            overflow-x: hidden !important;
        }
        .ytd-two-column-browse-results-renderer {
            display: flex;
            flex-direction: column;
            width: 100% !important;
        }
        .ytd-feed-filter-chip-bar-renderer {
            display: none !important;
        }
        .ytd-masthead {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
