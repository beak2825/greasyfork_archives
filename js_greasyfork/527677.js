// ==UserScript==
// @name         PestPac Phone Number to tel: Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert data-phonenumber to tel links
// @match        https://app.pestpac.com/location/detail.asp*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527677/PestPac%20Phone%20Number%20to%20tel%3A%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/527677/PestPac%20Phone%20Number%20to%20tel%3A%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert data-phonenumber to tel links
    function convertPhoneNumbers() {
        const phoneElements = document.querySelectorAll('[data-phonenumber]');
        phoneElements.forEach(element => {
            const phoneNumber = element.getAttribute('data-phonenumber');
            if (phoneNumber) {
                const telLink = document.createElement('a');
                telLink.href = `tel:${phoneNumber}`;
                telLink.textContent = phoneNumber;
                element.parentNode.replaceChild(telLink, element);
            }
        });
    }

    // Run the conversion when the page loads
    window.addEventListener('load', convertPhoneNumbers);
})();
