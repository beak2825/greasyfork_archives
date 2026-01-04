// ==UserScript==
// @name         Bitcolapse Auto-Claim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills email, waits for hCaptcha, and clicks submit after 10 seconds. 
// @author       Wphelp
// @match        https://bitcolapse.fun/*
// @antifeature  referral-link Directs to a referral link when not logged in
// @license      Copyright Wphelp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538648/Bitcolapse%20Auto-Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/538648/Bitcolapse%20Auto-Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect to referral link if not already using it
    if (!window.location.search.includes('ref=rachidsat7@gmail.com')) {
        window.location.href = 'https://bitcolapse.fun/?ref=rachidsat7@gmail.com';
        return; // Stop execution after redirect
    }

    // Main automation function
    function automateProcess() {
        // Fill email field
        const emailField = document.querySelector('input[name="email"]');
        if (emailField) {
            emailField.value = 'Add your email here';
            emailField.dispatchEvent(new Event('input', { bubbles: true }));
        }

        let captchaSolved = false;
        const checkCaptcha = setInterval(() => {
            // Check if hCaptcha is solved
            const iframe = document.querySelector('iframe[data-hcaptcha-response]');
            if (iframe && iframe.dataset.hcaptchaResponse) {
                captchaSolved = true;
                clearInterval(checkCaptcha);
                console.log('hCaptcha solved detected');

                // Wait 30 seconds after captcha solve then click button
                setTimeout(() => {
                    const submitBtn = document.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                        console.log('Submit button clicked');
                    }
                }, 10000);
            }
        }, 1000);
    }

    // Run after page loads
    window.addEventListener('load', automateProcess);
})();
