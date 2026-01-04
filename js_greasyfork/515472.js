// ==UserScript==
// @name         Simple Theme for Kick.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple theme for Kick.com
// @author       fredtheceo
// @match        https://kick.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515472/Simple%20Theme%20for%20Kickcom.user.js
// @updateURL https://update.greasyfork.org/scripts/515472/Simple%20Theme%20for%20Kickcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
        body {
            background-color: #121212 !important; /* Dark background */
            color: #ffffff !important; /* Light text color */
        }
        a {
            color: #bb86fc !important; /* Custom link color */
        }
        /* Styling for headers */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
        }
        /* Optional: Style for buttons */
        button {
            background-color: #1f1f1f !important; /* Dark button background */
            color: #ffffff !important; /* Button text color */
            border: 1px solid #bb86fc !important; /* Button border */
        }
        /* Optional: additional styles */
        /* You can add more styles as needed */
    `);
})();