// ==UserScript==
// @name         SHEIN Auto Register Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-fills SHEIN email and password with dot trick
// @match        https://*.shein.com/*
// @match        https://*.shein.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544037/SHEIN%20Auto%20Register%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/544037/SHEIN%20Auto%20Register%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("✅ Script loaded");

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
        const emailInput = document.querySelector('input[type="email"], input[name="email"]');
        const passInput = document.querySelector('input[type="password"]');

        if (emailInput) emailInput.value = dottedEmail;
        if (passInput) passInput.value = password;

        console.log("📩 Filled Email:", dottedEmail);
        console.log("🔐 Filled Password");
    }

    // Wait for form to load fully
    setTimeout(fillForm, 2000);
})();