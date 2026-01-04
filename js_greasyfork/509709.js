// ==UserScript==
// @name         Pornhub Redirect to Gayporn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects Pornhub homepage to Gayporn section
// @author       Your Name
// @match        *://*.pornhub.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/509709/Pornhub%20Redirect%20to%20Gayporn.user.js
// @updateURL https://update.greasyfork.org/scripts/509709/Pornhub%20Redirect%20to%20Gayporn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Check if the current page is the Pornhub homepage
    if (window.location.hostname === "www.pornhub.com" && window.location.pathname === "/") {
        // Redirect to the Gayporn section
        window.location.href = "https://www.pornhub.com/gayporn";
    }
})();