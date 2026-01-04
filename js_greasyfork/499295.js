// ==UserScript==
// @name         Renewal Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically Set Renewal Cost & Days
// @author       Stig [2648238]
// @match        https://www.torn.com/properties.php*
// @downloadURL https://update.greasyfork.org/scripts/499295/Renewal%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499295/Renewal%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        let el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500); // checks every 500ms
        }
    }

    function setValues() {
        // Enable Rent to Stored Value
        const rentStorageKey = localStorage.getItem('userRentAmount'); // Assuming 'userRentAmount' is the key you're using
        const moneyInputs = document.querySelectorAll('input.offerExtension.input-money[data-name="offercost"]');

        if (rentStorageKey) {
            if (moneyInputs.length > 0) {
                const formattedRentStorageKey = '24,000,000' // Format the number with commas
                moneyInputs.forEach(function(moneyInput) {
                    moneyInput.value = formattedRentStorageKey;
                });
            }
        }

        // Set to 30 Days
        const daysInputs = document.querySelectorAll('input.offerExtension.input-money[data-name="days"]');

        if (daysInputs.length > 0) {
            daysInputs.forEach(function(daysInput) {
                daysInput.value = '30';
            });
        }

        // Enable Next Button
        const button = document.querySelector('input.torn-btn[type="submit"][value="SEND OFFER"]');
        if (button) {
            button.removeAttribute('disabled');
        }
    }

    waitForElement('.offerExtension-opt', function() {
        setValues();
    });
})();