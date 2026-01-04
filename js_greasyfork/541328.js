// ==UserScript==
// @name         ScienceDirect Simple Wide Layout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides both sidebars and widens the main article content for a clean, focused reading view on sciencedirect.com.
// @license      MIT 
// @author       Continy 
// @match        https://www.sciencedirect.com/science/article/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencedirect.com
// @downloadURL https://update.greasyfork.org/scripts/541328/ScienceDirect%20Simple%20Wide%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/541328/ScienceDirect%20Simple%20Wide%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This script injects a block of CSS to override the default page layout.
    GM_addStyle(`
        /*
         * Hide the left sidebar (Table of Contents).
         * This uses the selector for the navigation landmark.
        */
        div.sticky-table-of-contents[role="navigation"] {
            display: none !important;
        }

        /*
         * Hide the right sidebar (Recommended articles, etc.).
         * This uses the selector for the block element.
        */
        div.u-display-block-from-md.col-lg-6.col-md-8 {
            display: none !important;
        }

        /*
         * Target the main article container.
         * The original grid class is .col-lg-18.
         * We override it to make it wider and center it on the page.
        */
        #article-container.col-lg-18 {
            width: 95% !important;
            max-width: none !important;
            float: none !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        /*
         * Ensure the <article> tag itself fills its newly widened container.
        */
        article.col-lg-12.col-md-16 {
            width: 100% !important;
            max-width: none !important;
        }
    `);

    console.log('ScienceDirect Simple Wide Layout script has been applied.');

})();