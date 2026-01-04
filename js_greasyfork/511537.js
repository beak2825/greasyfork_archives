// ==UserScript==
// @name         Google Classroom Custom Loading for Homes (Exclude GoGuardian)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Move spinner lower and add loading text on Google Classroom homes (not schools using GoGuardian).
// @author       Your Name
// @match        https://classroom.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511537/Google%20Classroom%20Custom%20Loading%20for%20Homes%20%28Exclude%20GoGuardian%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511537/Google%20Classroom%20Custom%20Loading%20for%20Homes%20%28Exclude%20GoGuardian%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to detect if GoGuardian is active
    function isGoGuardianActive() {
        // Check if elements related to GoGuardian are present on the page
        return !!document.querySelector('iframe[src*="goguardian.com"], script[src*="goguardian.com"]');
    }

    // Only run this script if GoGuardian is NOT active
    if (!isGoGuardianActive()) {
        // Apply custom CSS to move the spinner lower on the home page
        GM_addStyle(`
            /* Targeting the loading spinner */
            .uArJ5e.Y5sE8d.VkkpIf {
                top: 60% !important; /* Move the spinner lower */
                transform: translateY(-50%); /* Center it vertically */
            }

            /* Add custom loading text */
            #custom-loading-text {
                position: absolute;
                top: 65%; /* Position just below the spinner */
                width: 100%;
                text-align: center;
                font-size: 18px;
                color: #666;
                font-family: Arial, sans-serif;
            }
        `);

        // Create and append the custom loading text element
        const loadingText = document.createElement('div');
        loadingText.id = 'custom-loading-text';
        loadingText.innerText = 'Loading... Please wait.';
        document.body.appendChild(loadingText);
    }

})();
