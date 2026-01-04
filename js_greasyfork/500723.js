// ==UserScript==
// @name         RSS-前
// @namespace    https://github.com/your-username/
// @version      0.1
// @description  Automatically checks the "Fetch Full Content" option on the subscription form
// @author       Luofengyuan
// @match        http://域名/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500723/RSS-%E5%89%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/500723/RSS-%E5%89%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the "Advanced Options" details element
        const advancedOptionsDetails = document.querySelector('details');

        // If the details element exists, open it
        if (advancedOptionsDetails) {
            advancedOptionsDetails.open = true;
        }

        // Find the "Fetch Full Content" checkbox
        const fetchFullContentCheckbox = document.querySelector('input[name="crawler"]');

        // If the checkbox exists, check it
        if (fetchFullContentCheckbox) {
            fetchFullContentCheckbox.checked = true;

            // After checking the checkbox, collapse the "Advanced Options" section
            advancedOptionsDetails.open = false;
        }
    });
})();