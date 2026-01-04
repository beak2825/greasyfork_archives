// ==UserScript==
// @name         Walmart Modern UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance Walmart UI with modern styles, animations, and Bootstrap-inspired theme.
// @author       YourName
// @match        *://www.walmart.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519213/Walmart%20Modern%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/519213/Walmart%20Modern%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        /* General Reset */
        body, html {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            transition: all 0.3s ease-in-out;
        }

        /* Navbar */
        header, .header {
            background-color: #007bff !important;
            color: #fff;
            border-bottom: 3px solid #0056b3;
        }

        header a, .header a {
            color: #fff !important;
            text-decoration: none;
        }

        /* Cards */
        .product-card, .search-result-gridview-item-wrapper {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            padding: 1rem;
        }

        .product-card:hover, .search-result-gridview-item-wrapper:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        /* Buttons */
        .button, button, .btn {
            background-color: #007bff !important;
            border-radius: 8px;
            color: #fff;
            padding: 0.5rem 1rem;
            transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
            border: none;
        }

        .button:hover, button:hover, .btn:hover {
            background-color: #0056b3 !important;
            transform: scale(1.05);
        }

        /* Animations */
        .fade-in {
            animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Rounded Images */
        img {
            border-radius: 8px;
        }

        /* Footer */
        footer {
            background-color: #343a40;
            color: #fff;
            padding: 1rem;
            text-align: center;
            border-top: 3px solid #212529;
        }

        footer a {
            color: #17a2b8 !important;
        }
    `;

    GM_addStyle(css);
})();
