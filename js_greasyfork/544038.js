// ==UserScript==
// @name         SHEIN Auto Email + Password Fill (Dot Trick)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto fill email using Gmail dot trick + fixed password
// @match        https://ph.shein.com/user/auth/login
// @match        https://ph.shein.com/user/auth/register
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544038/SHEIN%20Auto%20Email%20%2B%20Password%20Fill%20%28Dot%20Trick%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544038/SHEIN%20Auto%20Email%20%2B%20Password%20Fill%20%28Dot%20Trick%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseEmail = "Jen335791@gmail.com";
    const password = "Bacaoco26";

    // Random dot trick function
    function applyDotTrick(email) {
        const [local, domain] = email.split("@");
        const index = Math.floor(Math.random() * (local.length - 1)) + 1;
        const dotted = local.slice(0, index) + "." + local.slice(index);
        return `${dotted}@${domain}`;
    }

    const dottedEmail = applyDotTrick(baseEmail);

    function fillFields() {
        const emailField = document.querySelector('input[type="text"], input[name="email"], input[placeholder*="Email"]');
        const continueBtn = document.querySelector('button[type="submit"], button');

        if (emailField) {
            emailField.focus();
            emailField.value = dottedEmail;
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("✅ Email filled:", dottedEmail);
        }

        // Wait for password page to appear
        const observer = new MutationObserver(() => {
            const passwordField = document.querySelector('input[type="password"]');
            if (passwordField) {
                passwordField.focus();
                passwordField.value = password;
                passwordField.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("✅ Password filled:", password);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    setTimeout(fillFields, 2000); // Let the page load first
})();