// ==UserScript==
// @name         YouTube Logo - Solid Red Color on All Pages
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Force the YouTube logo to be solid red instead of pink on all YouTube pages
// @author       GPT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515509/YouTube%20Logo%20-%20Solid%20Red%20Color%20on%20All%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/515509/YouTube%20Logo%20-%20Solid%20Red%20Color%20on%20All%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom CSS styling to make the YouTube logo solid red
    GM_addStyle(`
        /* Target the YouTube logo icon and make it solid red */
        #logo-icon {
            fill: #FF0000 !important; /* Solid red color */
        }

        /* Ensure no hover effects or shadows affect the color */
        #logo-icon:hover,
        #logo-icon-shadow {
            fill: #FF0000 !important;
        }

        /* Adjust text logo color if needed */
        #logo-icon-container, #logo-text {
            color: #FF0000 !important; /* Solid red for text portion */
        }
    `);

    console.log("Custom YouTube logo styling applied: solid red logo on all pages.");
})();
