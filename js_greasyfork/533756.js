// ==UserScript==
// @name         Wajas Layout Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance Wajas layout for better usability
// @author       um
// @match        https://www.wajas.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533756/Wajas%20Layout%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533756/Wajas%20Layout%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Center the main content */
        #main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Adjust font sizes for better readability */
        body, input, select, textarea {
            font-size: 16px !important;
            line-height: 1.5 !important;
        }

        /* Improve spacing between elements */
        .content-section {
            margin-bottom: 20px;
        }

        /* Enhance navigation bar */
        #navbar {
            background-color: #333;
            padding: 10px;
        }

        #navbar a {
            color: #fff !important;
            margin-right: 15px;
            text-decoration: none;
        }

        #navbar a:hover {
            text-decoration: underline;
        }

        /* Make images responsive */
        img {
            max-width: 100%;
            height: auto;
        }
    `);
})();
