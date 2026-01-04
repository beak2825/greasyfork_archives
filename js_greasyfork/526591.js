// ==UserScript==
// @name         YouTube Transparent Header
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Makes YouTube's top navigation bar and search bar semi-transparent
// @author       Minoa
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526591/YouTube%20Transparent%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/526591/YouTube%20Transparent%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* Make header slightly visible with no blur */
        ytd-masthead {
            background: rgba(0, 0, 0, 0.3) !important;
            border: none !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
        }

        /* Remove any potential blur from child elements */
        ytd-masthead *,
        ytd-masthead *::before,
        ytd-masthead *::after {
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
            background: transparent !important;
        }

        /* Style for search box */
        ytd-searchbox input,
        ytd-searchbox #container,
        ytd-searchbox[has-focus] input,
        ytd-searchbox[has-focus] #container {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* Style for search suggestions/autocomplete */
        ytd-searchbox #container.ytd-searchbox,
        .ytd-searchbox-spt,
        ytd-unified-search-suggestions-renderer {
            background: rgba(0, 0, 0, 0.4) !important;
        }

        /* Make suggestion items slightly visible */
        ytd-unified-search-suggestions-renderer * {
            background: transparent !important;
        }

        /* Hover effects for better usability */
        ytd-searchbox input:hover,
        ytd-searchbox input:focus {
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        /* Ensure text remains visible */
        ytd-searchbox input,
        ytd-unified-search-suggestions-renderer {
            color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Keep notification count visible */
        .yt-spec-icon-badge-shape__badge {
            background: red !important;
            opacity: 1 !important;
        }
    `;

    document.head.appendChild(style);
})();