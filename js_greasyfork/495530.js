// ==UserScript==
// @name         Auto Solve Captcha (with coingux faucet)
// @namespace    Terminator.Scripts
// @version      1.2
// @description  Autosolver
// @author       TERMINATOR
// @match        https://coingux.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495530/Auto%20Solve%20Captcha%20%28with%20coingux%20faucet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495530/Auto%20Solve%20Captcha%20%28with%20coingux%20faucet%29.meta.js
// ==/UserScript==

// -------------------------------------------------
// Link: https://coingux.com/?r=13384
// ----------------------------------
// reCaptcha solver:
//
// Link: https://dash.nocaptchaai.com/invite/r-did-6cxh4


(function() {
    'use strict';
    window.onload = function() {
        let captchaIcon = document.querySelector('#captcha-container .captcha-icon');
        if (captchaIcon) {
            let captchaClass = captchaIcon.classList[2];
            let iconOptions = document.querySelectorAll('#icon-options .icon-option');
            iconOptions.forEach(option => {
                if (option.classList.contains(captchaClass)) {
                    option.click();
                    if (window.location.href === "https://coingux.com/claim") {
                        const intervaltoclear = setInterval(() => {
                            const buttons = document.querySelectorAll('button');
                            for (let i = buttons.length - 1; i >= 0; i--) {
                                const button = buttons[i];
                                const buttonText = button.textContent.trim();
                                if (buttonText === "Collect your reward") {

                                    let recaptchav3 = document.querySelector("input#recaptchav3Token");
                                    let hcaptcha = document.querySelector('.h-captcha > iframe');
                                    let turnstile = document.querySelector('.cf-turnstile > input');

                                    if (button && (
                                        (hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) ||
                                        (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) ||
                                        (recaptchav3 && recaptchav3.value.length > 0) ||
                                        (turnstile && turnstile.value.length > 0)
                                    )) {
                                        button.click();
                                        clearInterval(intervaltoclear);
                                    }

                                }
                            }
                        }, 5000);
                    }
                }
            });
        }
    };
})();
