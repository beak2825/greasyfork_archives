// ==UserScript==
// @name         Dark Mode Toggle
// @namespace    http://violentmonkey.net/
// @version      1.3
// @description  Toggle dark mode on any website.
// @match        *://*/*
// @user         InariOkami
// @icon         https://static.thenounproject.com/png/3359489-200.png
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/507679/Dark%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/507679/Dark%20Mode%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyDarkMode() {
        GM_addStyle(`
            /* General styles */
            body {
                background-color: #121212;
                color: #e0e0e0;
            }
            a {
                color: #bb86fc;
            }
            /* Headers and footers */
            header, footer, .navbar, .sidebar, .card, .modal, .dropdown, .banner, .container {
                background-color: #1e1e1e !important;
            }
            /* Forms and inputs */
            .input, .textarea, .button, .form-control, .select, .checkbox, .radio {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
            }
            .input:focus, .textarea:focus, .button:focus, .form-control:focus, .select:focus {
                border-color: #bb86fc !important;
                box-shadow: 0 0 0 1px #bb86fc !important;
            }
            /* Code blocks */
            .code, pre, .terminal {
                background-color: #2d2d2d;
                color: #e0e0e0;
                border: 1px solid #444;
            }
            /* Muted and light text */
            .text-muted, .text-light, .placeholder {
                color: #b0b0b0 !important;
            }
            /* Light backgrounds */
            .bg-light, .btn-light {
                background-color: #1e1e1e !important;
                color: #e0e0e0 !important;
            }
            .bg-white, .text-white {
                background-color: #333 !important;
                color: #e0e0e0 !important;
            }
            /* Alerts and notifications */
            .alert, .notification, .toast {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            /* Tables */
            table, th, td {
                background-color: #1e1e1e !important;
                color: #e0e0e0 !important;
                border: 1px solid #444 !important;
            }
            /* Links and buttons */
            button, .link, .nav-link {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border-color: #444 !important;
            }
            button:hover, .link:hover, .nav-link:hover {
                background-color: #444 !important;
            }
            /* Scrollbars */
            ::-webkit-scrollbar {
                width: 12px;
            }
            ::-webkit-scrollbar-thumb {
                background: #333;
                border-radius: 6px;
            }
            ::-webkit-scrollbar-track {
                background: #121212;
            }
        `);
    }

    function removeDarkMode() {
        GM_addStyle(`
            /* General styles */
            body {
                background-color: #ffffff;
                color: #000000;
            }
            a {
                color: #0000ee;
            }
            /* Headers and footers */
            header, footer, .navbar, .sidebar, .card, .modal, .dropdown, .banner, .container {
                background-color: #f0f0f0 !important;
            }
            /* Forms and inputs */
            .input, .textarea, .button, .form-control, .select, .checkbox, .radio {
                background-color: #ffffff !important;
                color: #000000 !important;
                border-color: #cccccc !important;
            }
            .input:focus, .textarea:focus, .button:focus, .form-control:focus, .select:focus {
                border-color: #0000ee !important;
                box-shadow: 0 0 0 1px #0000ee !important;
            }
            /* Code blocks */
            .code, pre, .terminal {
                background-color: #f5f5f5;
                color: #000000;
                border: 1px solid #cccccc;
            }
            /* Muted and light text */
            .text-muted, .text-light, .placeholder {
                color: #6c757d !important;
            }
            /* Light backgrounds */
            .bg-light, .btn-light {
                background-color: #f8f9fa !important;
                color: #000000 !important;
            }
            .bg-white, .text-white {
                background-color: #ffffff !important;
                color: #000000 !important;
            }
            /* Alerts and notifications */
            .alert, .notification, .toast {
                background-color: #e2e3e5 !important;
                color: #000000 !important;
            }
            /* Tables */
            table, th, td {
                background-color: #f0f0f0 !important;
                color: #000000 !important;
                border: 1px solid #cccccc !important;
            }
            /* Links and buttons */
            button, .link, .nav-link {
                background-color: #ffffff !important;
                color: #000000 !important;
                border-color: #cccccc !important;
            }
            button:hover, .link:hover, .nav-link:hover {
                background-color: #e0e0e0 !important;
            }
            /* Scrollbars */
            ::-webkit-scrollbar {
                width: 12px;
            }
            ::-webkit-scrollbar-thumb {
                background: #cccccc;
                border-radius: 6px;
            }
            ::-webkit-scrollbar-track {
                background: #ffffff;
            }
        `);
    }

    function toggleDarkMode() {
        const darkMode = !GM_getValue('darkMode', false);
        GM_setValue('darkMode', darkMode);
        if (darkMode) {
            applyDarkMode();
        } else {
            removeDarkMode();
        }
    }

    if (GM_getValue('darkMode', false)) {
        applyDarkMode();
    }

    GM_registerMenuCommand('Toggle Dark Mode', toggleDarkMode, 'd');
})();