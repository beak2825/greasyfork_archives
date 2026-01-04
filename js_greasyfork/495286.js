// ==UserScript==
// @license MIT
// @name         Bing New Redirect 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect if element not found on Bing search or chat pages
// @author       SOPL
// @match        https://www.bing.com/search?*
// @match        https://www.bing.com/chat?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495286/Bing%20New%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/495286/Bing%20New%20Redirect.meta.js
// ==/UserScript==

// 
(function() {
    'use strict';

    // Function to check for the element and redirect if not found
    function checkAndRedirect() {
        if (!document.getElementById('b-scopeListItem-conv')) {
            // First redirect
            window.location.href = "https://www.bing.com/account/action?scope=web&cc=au";

            // Set a timeout for 3 seconds and then redirect to the second URL
            setTimeout(function() {
                window.location.href = "https://www.bing.com/account/general?id=region_section#region-section";
            }, 3000);
        }
    }

    // Execute the function
    checkAndRedirect();
})();
