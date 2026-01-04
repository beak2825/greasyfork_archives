// ==UserScript==
// @name         Freebitco.in Auto ROLL | With Turnstile CloudFlare CAPTCHA
// @namespace    https://freebitco.in/
// @version      1.1
// @description  Automatically clicks “ROLL” when the Turnstile Cloudflare CAPTCHA is solved.
// @author       Rubystance
// @license      MIT
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543656/Freebitcoin%20Auto%20ROLL%20%7C%20With%20Turnstile%20CloudFlare%20CAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/543656/Freebitcoin%20Auto%20ROLL%20%7C%20With%20Turnstile%20CloudFlare%20CAPTCHA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[AutoROLL]', ...args);

    function isCaptchaResolved() {
        const input = document.querySelector('input[name="cf-turnstile-response"]');
        return input && input.value.trim().length > 0;
    }

    function tryClickRollButton() {
        const button = document.getElementById('free_play_form_button');
        if (!button) {
            log("ROLL! not found.");
            return;
        }

        if (isCaptchaResolved() && !button.disabled && button.offsetParent !== null) {
            log("CAPTCHA solved. Clicking on ROLL! button");
            button.click();
        } else {
            log("Waiting for CAPTCHA...");
        }
    }

    function observeCaptcha() {
        const captchaInput = document.querySelector('input[name="cf-turnstile-response"]');

        if (!captchaInput) {
            log("CAPTCHA fiel not detected. Repeating in 2s...");
            setTimeout(observeCaptcha, 2000);
            return;
        }

        const observer = new MutationObserver(() => {
            if (isCaptchaResolved()) {
                log("CAPTCHA detected!");
                tryClickRollButton();
            }
        });

        observer.observe(captchaInput, { attributes: true, attributeFilter: ['value'] });

        setInterval(() => {
            if (isCaptchaResolved()) {
                tryClickRollButton();
            }
        }, 1000);

        log("Waiting for CAPTCHA to detect a solution...");
    }

    window.addEventListener('load', () => {
        setTimeout(observeCaptcha, 2000);
    });
})();
