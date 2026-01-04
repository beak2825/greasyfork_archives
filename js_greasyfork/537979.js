// ==UserScript==
// @name         Reddit Full Width Posts, Hide Sidebar, Hide Banners
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make Reddit posts full width, hide the right sidebar, hide red banner (banned or other) messages
// @author       djh
// @match        https://www.reddit.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537979/Reddit%20Full%20Width%20Posts%2C%20Hide%20Sidebar%2C%20Hide%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/537979/Reddit%20Full%20Width%20Posts%2C%20Hide%20Sidebar%2C%20Hide%20Banners.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* Keep main layout containers natural */
        .grid-container.theme-rpl.grid,
        #subgrid-container,
        .main-container,
        main#main-content {
            max-width: 100% !important;
            width: 100% !important;
            padding-left: 0.7rem !important;
            padding-right: 1.5rem !important;
            margin: 0rem !important;
        }

        /* Remove sidebar grid columns */
        .grid-cols-[minmax\\(0\\,1fr\\)],
        .fixed-sidebar,
        .flex-sidebar {
            grid-template-columns: 1fr !important;
        }

        /* Full-width posts with left padding */
        shreddit-post {
            max-width: 100% !important;
            width: 98.7% !important;
            margin-left: 0rm !important;
            margin-right: auto !important;
            padding-left: 1rem !important; /* Left padding */
            padding-right: 0 !important;   /* Flush right */
        }

        /* Optional: reset inner padding if needed */
        shreddit-post > * {
            border-radius: 0 !important;
            padding: 0 !important;
        }

        /* Stretch media inside posts */
        shreddit-post img,
        shreddit-post video,
        shreddit-post iframe,
        shreddit-post .media-element,
        shreddit-post .media-preview {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
        }

        /* Hide sidebars */
        aside,
        .right-sidebar,
        [id^="right-sidebar"] {
            display: none !important;
        }

        /* Hide the error banner */
        faceplate-banner[appearance="error"] {
            display: none !important;
        }
    `);
})();
