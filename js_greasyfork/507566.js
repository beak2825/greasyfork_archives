// ==UserScript==
// @name         Custom Google Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply custom styles to Google
// @author       Your Name
// @match        *://www.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507566/Custom%20Google%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/507566/Custom%20Google%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS
    GM_addStyle(`
        /* General Google styles */
        body {
            font-family: Arial, sans-serif !important;
            background-color: #f2f2f2 !important;
        }

        /* Header Styles */
        #hdtb-msb {
            background-color: #ffffff !important;
            border-bottom: 1px solid #e0e0e0 !important;
        }

        /* Google Logo Styles */
        #logo {
            margin: 20px auto !important;
        }

        /* Search Box Styles */
        .gLFyf {
            border-radius: 24px !important;
            border: 1px solid #dcdcdc !important;
            padding: 10px !important;
        }

        .gNO89b {
            background-color: #f8f8f8 !important;
            border-radius: 24px !important;
        }

        .gNO89b:hover {
            background-color: #e8e8e8 !important;
        }

        /* Search Results Styles */
        .g {
            border: 1px solid #dcdcdc !important;
            border-radius: 8px !important;
            padding: 10px !important;
            margin-bottom: 10px !important;
            background-color: #ffffff !important;
        }

        .rc > .r > a {
            color: #1a0dab !important;
            text-decoration: none !important;
        }

        .rc > .r > a:hover {
            text-decoration: underline !important;
        }

        .rc > .s {
            font-size: 14px !important;
            color: #4d5156 !important;
        }

        /* Footer Styles */
        #footer {
            background-color: #ffffff !important;
            border-top: 1px solid #e0e0e0 !important;
        }
    `);
})();
