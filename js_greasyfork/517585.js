// ==UserScript==
// @name         UESP Enhanced Dark Mode Toggle with State Persistence
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to toggle a fully enhanced dark theme on UESP, with state persistence using localStorage.
// @author       SignedBytes
// @match        https://en.uesp.net/wiki/*
// @grant        none
// @license      CC BY 4.0
// @copyright    2024 SignedBytes (gasper.app)
// @downloadURL https://update.greasyfork.org/scripts/517585/UESP%20Enhanced%20Dark%20Mode%20Toggle%20with%20State%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/517585/UESP%20Enhanced%20Dark%20Mode%20Toggle%20with%20State%20Persistence.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DARK_THEME_KEY = 'darkThemeEnabledUESP'; // Key for storing state in localStorage

    function addDarkTheme() {
        const darkStyle = document.createElement('style');
        darkStyle.id = 'dark-theme-style';
        darkStyle.innerHTML = `
            /* General body styling, remove background image */
            body, #content {
                background-color: #000000 !important;
                background-image: none !important; /* Disables the background image */
                color: #e0e0e0 !important;
            }

            /* Header and navigation bar */
            #header, #p-navigation, #p-search, .mw-body {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border-bottom: 1px solid #444 !important;
            }

            /* Logo styling */
            #uespMainLogo {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
            }

            /* Sidebar sections */
            #column-one, #p-tb, #p-logo, .portlet, .pBody {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border: none !important;
            }

            /* Sidebar links */
            #p-logo a, #p-navigation a, #p-search a, .portlet a {
                color: #bb86fc !important;
            }
            #p-logo a:hover, #p-navigation a:hover, #p-search a:hover, .portlet a:hover {
                color: #ffffff !important;
            }

            /* Main content links */
            a, .mw-body a {
                color: #bb86fc !important;
            }
            a:hover, .mw-body a:hover {
                color: #ffffff !important;
            }

            /* Tables, infoboxes, and navigation tables */
            .wikitable,table.wikitable > tr > th, table.wikitable > * > tr > th, #genMidColor, .infobox, .mw-body-content table, .sidebar-content, .toc, .mw-headline,
            .navbox, .navbox-inner, .navbox-group, .navbox-title, .navbox-list {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }

            /* Table of Contents number styling */
            .tocnumber {
                color: #bb86fc !important; /* Matches the links */
            }

            /* Navigation table titles and headers */
            .navbox-title, .navbox-group {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            .navbox-list a {
                color: #bb86fc !important;
            }
            .navbox-list a:hover {
                color: #ffffff !important;
            }

            /* Footer note in navigation boxes */
            .navbox-abovebelow {
                background-color: #1a1a1a !important;
                color: #dcdcdc !important;
                border-top: 1px solid #444 !important;
            }
            .navbox-abovebelow b {
                color: #ffffff !important;
            }

            /* Action menu background */
            #p-cactions ul li a {
                background: #333 !important;
                color: #e0e0e0 !important;
            }
            #p-cactions ul li.selected a {
                background: #444 !important;
                color: #ffffff !important;
            }

            /* Category links section */
            #catlinks {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border-top: 1px solid #444 !important;
            }
            #catlinks a {
                color: #bb86fc !important;
            }
            #catlinks a:hover {
                color: #ffffff !important;
            }

            /* Headers */
            h1, h2, h3, h4, h5, h6, .mw-headline {
                color: #ffffff !important;
            }

            /* Featured Article Div */
            #uespFADiv {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
                color: #e0e0e0 !important;
            }

            /* News Div */
            #uespNewsDiv {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
                color: #e0e0e0 !important;
            }

            /* Footer */
            #footer, .footer-portlet {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }

            /* Popups */
            .mwe-popups {
                background-color: #1a1a1a !important;
            }

            /* Buttons */
            .btn, #searchButton {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            .btn:hover, #searchButton:hover {
                background-color: #555 !important;
                color: #ffffff !important;
            }

            /* Tooltip content */
            .tooltip {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }

            /* Pagination and breadcrumbs */
            .pagination li a, .pagination li span, .breadcrumb {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }

            /* Links in tables and lists */
            .wikitable a, .toc a {
                color: #bb86fc !important;
            }

            /* Navbar links */
            .navbar a {
                color: #bb86fc !important;
            }

            /* Table borders */
            th, td {
                border: 1px solid #444 !important;
                color: #e0e0e0 !important;
            }

            /* Background for headings and infobox headers */
            .wikitable th, .infobox th, .sidebar-heading {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }

            /* Thumbnail images and captions */
            .thumbinner {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }
            .thumbcaption, .magnify {
                background-color: #1a1a1a !important;
                color: #dcdcdc !important;
            }

            /* Additional thumbnail styling */
            div.thumb div {
                background-color: #1a1a1a !important;
                border: 1px solid #444 !important;
                color: #e0e0e0 !important;
            }

            /* Quote boxes */
            .quotebox {
                background-color: #1e1e1e !important;
                color: #dcdcdc !important;
                border: 1px solid #444 !important;
            }

            /* Links within quote boxes */
            .quotebox a {
                color: #bb86fc !important;
            }
            .quotebox a:hover {
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(darkStyle);
    }

    function removeDarkTheme() {
        const darkStyle = document.getElementById('dark-theme-style');
        if (darkStyle) {
            darkStyle.remove();
        }
    }

    function toggleDarkTheme() {
        const isDarkThemeEnabled = localStorage.getItem(DARK_THEME_KEY) === 'true';
        if (isDarkThemeEnabled) {
            removeDarkTheme();
            localStorage.setItem(DARK_THEME_KEY, 'false');
        } else {
            addDarkTheme();
            localStorage.setItem(DARK_THEME_KEY, 'true');
        }
    }

    function initializeDarkTheme() {
        const isDarkThemeEnabled = localStorage.getItem(DARK_THEME_KEY) === 'true';
        if (isDarkThemeEnabled) {
            addDarkTheme();
        }
    }

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dark Mode';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.padding = '10px 15px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    toggleButton.addEventListener('click', toggleDarkTheme);

    document.body.appendChild(toggleButton);
    initializeDarkTheme();
})();
