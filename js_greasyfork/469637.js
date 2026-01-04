// ==UserScript==
// @name         Wikipedia Line Width and Margin Adjustment
// @namespace    http://your-namespace.example.com
// @version      1.0
// @description  Adjusts line width and margin of Wikipedia articles
// @author       Your Name
// @match        https://*.wikipedia.org/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469637/Wikipedia%20Line%20Width%20and%20Margin%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/469637/Wikipedia%20Line%20Width%20and%20Margin%20Adjustment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #content{
            margin: auto !important;

        }
        #mw-content-text, #firstHeading {
            max-width: 85ch !important;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto !important;
            padding: 0px !important;
        }
    `);
})();