// ==UserScript==
// @name         Universal Maxlength Expander
// @namespace https://www.youtube.com/@joshclark756
// @author joshclark756
// @version      1.0
// @description  Sets all maxlength values to 999999 across all websites
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500059/Universal%20Maxlength%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/500059/Universal%20Maxlength%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandMaxlength() {
        const inputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
        inputs.forEach(input => {
            input.setAttribute('maxlength', '999999');
        });
    }

    // Run on page load
    expandMaxlength();

    // Set up a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                expandMaxlength();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();
