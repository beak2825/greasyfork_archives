// ==UserScript==
// @name         SHEIN Auto Email with Dot Trick
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto fill SHEIN signup form using Gmail dot trick
// @match        https://*.shein.com/*
// @match        https://*.shein.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544034/SHEIN%20Auto%20Email%20with%20Dot%20Trick.user.js
// @updateURL https://update.greasyfork.org/scripts/544034/SHEIN%20Auto%20Email%20with%20Dot%20Trick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseEmail = "Jen335791@gmail.com";
    const password = "Bacaoco26";

    function insertDots(email, variation) {
        const [local, domain] = email.split("@");
        const dotted = local.slice(0, variation) + "." + local.slice(variation);
        return `${dotted}@${domain}`;
    }

    const randomDot = Math.floor(Math.random() * 6) + 1;
    const dottedEmail = insertDots(baseEmail, randomDot);

    function fillForm() {
        const emailInput = document.querySelector('input[type="email"]');
        const passInput = document.querySelector('input[type="password"]');

        if (emailInput && passInput) {
            emailInput.value = dottedEmail;
            passInput.value = password;
        }
    }

    setTimeout(fillForm, 1000);
})();