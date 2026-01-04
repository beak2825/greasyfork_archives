// ==UserScript==
// @name         claimcrypto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  claimcrypto.in
// @author       LTW
// @license      none
// @match        https://claimcrypto.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcrypto.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501879/claimcrypto.user.js
// @updateURL https://update.greasyfork.org/scripts/501879/claimcrypto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const email = '';
    const senha = '';
    const redirecionamento = '';
    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

    if (wasButtonClicked()) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirecionamento;
      }
    });
        if (window.location.href.includes('/login')) {
        setTimeout(function() {
            document.getElementById("email").value = email;
            document.getElementById("password").value = senha;
        }, 3000);

        setInterval(function() {
            let reCaptchaResponse = "";
            let hCaptchaResponse = "";
            const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');
            if (reCaptchaTextarea) {reCaptchaResponse = reCaptchaTextarea.value;}
            if (hCaptchaTextarea) {hCaptchaResponse = hCaptchaTextarea.value;}

            if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                }
            }
        }, 3000);
    }
    if (window.location.href.includes('/dashboard')) {
        window.location.href = 'https://claimcrypto.in/faucet';
    }
    if (window.location.href === 'https://claimcrypto.in/') {
        window.location.href = 'https://claimcrypto.in/login';
    }

        if (window.location.href.includes('/faucet')) {
        const interval2 = setInterval(() => {
        const button = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
        const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;
        const selectValue = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.value);
        var divElement = document.querySelector('.iconcaptcha-modal__body-title');

        if (divElement && divElement.innerText.toLowerCase() === 'verification complete.' && mbsolver() && button && !button.disabled) {
        setButtonClicked();
        clearInterval(interval2);
        setTimeout(function() {
        button.click();
        }, 2000);
        }
        }, 3000);
        }
})();