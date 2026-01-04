// ==UserScript==
// @name         Selective Trial Papers Free
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically get free papers from selectivetrial.com.au
// @author       Your Name
// @match        https://selectivetrial.com.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530350/Selective%20Trial%20Papers%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/530350/Selective%20Trial%20Papers%20Free.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the free papers
    function getFreePapers() {
        // Find the "Get Free Access" button
        var getFreeAccessButton = document.querySelector('.get-free-access');

        // If the button exists, click it
        if (getFreeAccessButton) {
            getFreeAccessButton.click();
        }
    }

    // Run the function when the page is loaded
    window.addEventListener('load', getFreePapers);
})();