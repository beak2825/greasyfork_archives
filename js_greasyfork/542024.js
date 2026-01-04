// ==UserScript==
// @name         PaydaySay Loan Amount Counter
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Calculates the total loan amount displayed on a PaydaySay web interface
// @author       Andrew
// @match        *://*/*
// @grant        none
// @license        none
// @downloadURL https://update.greasyfork.org/scripts/542024/PaydaySay%20Loan%20Amount%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/542024/PaydaySay%20Loan%20Amount%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to extract dollar amounts from text
    function extractAmount(text) {
        const match = text.replace(/,/g, '').match(/\$?(\d+(\.\d{1,2})?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    // Function to find and sum up all money amounts on the page
    function calculateTotalLoan() {
        const elements = document.querySelectorAll('*'); // You can refine this
        let total = 0;

        elements.forEach((el) => {
            const text = el.innerText || el.textContent;
            if (/\$\d+/.test(text)) {
                total += extractAmount(text);
            }
        });

        alert(`Total loan amount found on PaydaySay page: $${total.toFixed(2)}`);
    }

    // Run calculation 3 seconds after page load
    window.addEventListener('load', () => {
        setTimeout(calculateTotalLoan, 3000);
    });
})();