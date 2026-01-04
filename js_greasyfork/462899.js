// ==UserScript==
// @name         Fix PMC Reversed Email
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix reversed email addresses in PubMed Central
// @author       Lily Yu
// @match        *://*.ncbi.nlm.nih.gov/pmc/articles/*/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462899/Fix%20PMC%20Reversed%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/462899/Fix%20PMC%20Reversed%20Email.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to reverse a string
    function reverseString(str) {
        return str.split('').reverse().join('');
    }

    // Find all elements with the class "oemail"
    const emailElements = document.querySelectorAll('.oemail');

    // Iterate through the elements and fix the email address
    emailElements.forEach(el => {
        // Get the reversed email address from the "data-email" attribute
        const reversedEmail = el.getAttribute('data-email');

        // Reverse the email address
        const normalEmail = reverseString(reversedEmail);

        // Update the "mailto:" link and the displayed text
        el.href = `mailto:${normalEmail}`;
        el.textContent = normalEmail;
    });
})();