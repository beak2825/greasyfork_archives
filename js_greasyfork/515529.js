// ==UserScript==
// @name         YouTube Header Styler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change YouTube header style to white and add a shadow
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515529/YouTube%20Header%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/515529/YouTube%20Header%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to style the header and background
    GM_addStyle(`
        #header {
            background-color: white !important; /* White background for the header */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Shadow under the header */
            position: relative; /* Make sure the shadow is visible */
            z-index: 10; /* Ensure the header is above other elements */
        }

        /* Light gray background for the rest of the page */
        body {
            background-color: #f5f5f5 !important; /* Light gray background */
        }

        /* Ensure that the main content area is not covered */
        #content {
            margin-top: 56px; /* Adjust this value based on the header height */
        }
    `);
})();
