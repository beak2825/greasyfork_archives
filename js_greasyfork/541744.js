// ==UserScript==
// @name        Auto Close Uma Terms/Policy
// @namespace   Violentmonkey Scripts
// @match       https://umamusume.com/*
// @grant       none
// @version     1.1
// @author      Ginkotaku
// @description Good for Rerolling on PC
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/541744/Auto%20Close%20Uma%20TermsPolicy.user.js
// @updateURL https://update.greasyfork.org/scripts/541744/Auto%20Close%20Uma%20TermsPolicy.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Function to check if the current URL matches the condition
    function shouldCloseTab(url) {
        // --- PUT YOUR CONDITION HERE ---
        // Example: close if the URL contains "example.com"
        if (url.includes("https://umamusume.com/terms/")){
            return true;
        }
        // Example: close if the URL contains "undesired_parameter=true"
        // if (url.match(/\?undesired_parameter=true/)) {
        //     return true;
        // }
        // ------------------------------
        return false;
    }

    // Check if the current tab's URL matches the closing condition
    if (shouldCloseTab(document.location.href)) {
        // Use the workaround to close the tab
        window.open('', '_self', ''); // Open current URL in a new window/tab replacing the current one
        window.close(); // Close this new window/tab
    }
})();

(function() {
    'use strict';

    // Function to check if the current URL matches the condition
    function shouldCloseTab(url) {
        // --- PUT YOUR CONDITION HERE ---
        // Example: close if the URL contains "example.com"
        if (url.includes("https://umamusume.com/policy/")){
            return true;
        }
        // Example: close if the URL contains "undesired_parameter=true"
        // if (url.match(/\?undesired_parameter=true/)) {
        //     return true;
        // }
        // ------------------------------
        return false;
    }

    // Check if the current tab's URL matches the closing condition
    if (shouldCloseTab(document.location.href)) {
        // Use the workaround to close the tab
        window.open('', '_self', ''); // Open current URL in a new window/tab replacing the current one
        window.close(); // Close this new window/tab
    }
})();