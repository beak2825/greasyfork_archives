// ==UserScript==
// @name         Better BlockCoin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make BlockCoin look better.
// @author       yippymishy
// @match        https://blockcoin.social/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488840/Better%20BlockCoin.user.js
// @updateURL https://update.greasyfork.org/scripts/488840/Better%20BlockCoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add your CSS styles here
    var styles = `
        #navbar {
            border-bottom: 2px solid white !important;
            background-color: black !important;
        }

        #top-container {
            background-color: #131313 !important;
            border-radius: 16px !important;
        }

        #post {
            background-color: black !important;
        }

        #new_button {
            margin: 25px;
        }

        #cont-1,
        #cont-2,
        #cont-3,
        #cont-4 {
            background-color: black !important;
        }

        .post-badges-container {
            border: 2px solid white;
            padding: 2px;
            border-radius: 8px;
        }
    `;

    // Create style element
    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styles));

    // Append style element to head
    document.head.appendChild(styleElement);
})();
