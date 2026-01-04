// ==UserScript==
// @name         AbuseIPDB Dark Mode Toggle with State Persistence
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a button to toggle a dark theme on AbuseIPDB, with state persistence using localStorage.
// @author       https://gasper.app/
// @match        https://www.abuseipdb.com/*
// @grant        none
// @license      CC BY 4.0
// @copyright    2024 https://gasper.app/ (https://gasper.app/)
// @downloadURL https://update.greasyfork.org/scripts/517578/AbuseIPDB%20Dark%20Mode%20Toggle%20with%20State%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/517578/AbuseIPDB%20Dark%20Mode%20Toggle%20with%20State%20Persistence.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DARK_THEME_KEY = 'darkThemeEnabled'; // Key for storing state in localStorage

    function addDarkTheme() {
        const darkStyle = document.createElement('style');
        darkStyle.id = 'dark-theme-style';
        darkStyle.innerHTML = `
            /* General body and background styling */
            body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }

            /* Navbar, footer, and logobar */
            .navbar, .footer, .logobar {
                background-color: #1e1e1e !important;
                color: #e0e0e0 !important;
                border-bottom: 1px solid #444 !important;
            }
            .logobar .container {
                background-color: #222 !important;
                padding: 10px !important;
            }

            /* Notice alert box */
            .alert {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            .alert-primary {
                background-color: #444 !important;
                border-color: #555 !important;
                color: #bb86fc !important;
            }

            /* Breadcrumbs */
            .breadcrumb {
                background-color: #222 !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
                padding: 8px 15px !important;
                border-radius: 4px !important;
            }
            .breadcrumb li {
                color: #cccccc !important;
            }
            .breadcrumb li a {
                color: #bb86fc !important;
            }
            .breadcrumb li a:hover {
                color: #ffffff !important;
                text-decoration: underline !important;
            }
            .breadcrumb .active {
                color: #ffffff !important;
            }

            /* Panel and container */
            .panel, .panel-default, .panel-heading, .panel-body {
                background-color: #222 !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }

            /* Tabs */
            .nav-tabs > li > a {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            .nav-tabs > li.active > a {
                background-color: #444 !important;
                color: #ffffff !important;
            }

            /* Form elements */
            .form-control {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            label {
                color: #cccccc !important;
            }

            /* Buttons */
            .btn, .btn-primary, .btn-danger, .btn-default, .btn-link {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            .btn-primary {
                background-color: #0066cc !important;
                color: #ffffff !important;
            }
            .btn-danger {
                background-color: #cc0000 !important;
                color: #ffffff !important;
            }

            /* Dropdown menu */
            .dropdown-menu {
                background-color: #222 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            .dropdown-menu > li > a {
                color: #e0e0e0 !important;
            }
            .dropdown-menu > li > a:hover {
                background-color: #444 !important;
                color: #ffffff !important;
            }
            .divider {
                background-color: #555 !important;
            }

            /* Tables */
            .table {
                background-color: #222 !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }
            .table-striped > tbody > tr:nth-of-type(odd) {
                background-color: #2a2a2a !important;
            }
            .table-striped > tbody > tr:nth-of-type(even) {
                background-color: #242424 !important;
            }
            th, td {
                border: 1px solid #444 !important;
                color: #e0e0e0 !important;
            }

            /* Pagination */
            .pagination li a, .pagination li span {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
            }
            .pagination .disabled span, .pagination .active span {
                background-color: #444 !important;
                color: #ffffff !important;
                border: 1px solid #555 !important;
            }

            /* Logos and images */
            .toplogo {
                filter: brightness(0.8);
            }
            .toplogo:hover {
                filter: brightness(1);
            }

            /* Links */
            a {
                color: #bb86fc !important;
            }
            a:hover {
                color: #ffffff !important;
            }

            /* Checkbox labels */
            .checkbox label {
                color: #e0e0e0 !important;
            }

            /* Tooltip content */
            .tooltip {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border: 1px solid #555 !important;
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
    toggleButton.textContent = 'Toggle Dark Theme';
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
