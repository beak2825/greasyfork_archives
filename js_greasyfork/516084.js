// ==UserScript==
// @name         Autofill Form with Validation Trigger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autofill fields in the form and trigger validation
// @match        */onboarding/delivery
// @author       SebRF
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516084/Autofill%20Form%20with%20Validation%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/516084/Autofill%20Form%20with%20Validation%20Trigger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fillAndValidateField(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.focus();
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.blur();
        }
    }

    window.onload = function() {

            fillAndValidateField('[id^="email__"]', '');
            fillAndValidateField('[id^="firstName__"]', "Drew");
            fillAndValidateField('[id^="lastName__"]', "Peacock");
            fillAndValidateField('[id^="phone__"]', "07509222111");
            fillAndValidateField('[id^="addressLine1__"]', "123 Main St");
            fillAndValidateField('[id^="addressLine2__"]', "Apt 4B");
            fillAndValidateField('[id^="city__"]', "Bristol");
            fillAndValidateField('[id^="county__"]', "Somerset");
            fillAndValidateField('[id^="postcode__"]', "BS1 5TY");

    };
})();
