// ==UserScript==
// @name         crypto-farms.site
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      none
// @description  crypto-farms
// @author       LTW
// @match        https://crypto-farms.site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crypto-farms.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501799/crypto-farmssite.user.js
// @updateURL https://update.greasyfork.org/scripts/501799/crypto-farmssite.meta.js
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

   function check() {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirecionamento;
      }
    });
  }

setTimeout(() => {check(); },3000);

    if (window.location.href.includes('/login')) {
        setTimeout(function() {
            document.getElementById("email").value = email;
            document.getElementById("password").value = senha;
        }, 3000);

        setInterval(function() {
            let click = false;
            let reCaptchaResponse = "";
            let hCaptchaResponse = "";
            const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');
            if (reCaptchaTextarea) {reCaptchaResponse = reCaptchaTextarea.value;}
            if (hCaptchaTextarea) {hCaptchaResponse = hCaptchaTextarea.value;}

            if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton && !submitButton.disabled && click === false) {
                    submitButton.click();
                    click = true;
                }
            }
        }, 3000);
    }
    if (window.location.href.includes('/lottery')|| window.location.href.includes('/leaderboard')) {
        window.location.href = redirecionamento;
    }
    if (window.location.href === 'https://crypto-farms.site/home/' || window.location.href === 'https://crypto-farms.site/') {
        window.location.href = 'https://crypto-farms.site/home/login';
    }
    if (window.location.href.includes('/dashboard') || window.location.href.includes('/profile') || window.location.href.includes('/referrals')) {
        document.querySelector('span[key="t-faucet"]')?.click();
    }
    if (window.location.href.includes('/faucet')) {
        const interval = setInterval(() => {
            const button = document.getElementById('btn1');

            if (button && !button.disabled) {
                button.click();
                clearInterval(interval);
            }
        }, 1000);

        const mbsolver = () => (selectValue('#antibotlinks')?.length || 0) >= 1;
        const selectValue = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.value);


setTimeout(() => {
    const modalTrigger = document.querySelector('[data-target="#exampleModal"]');

    if (modalTrigger) {
        modalTrigger.click();

        setTimeout(() => {
            const h2Elements = document.querySelectorAll('h2.mt-1');
            let inputToCheck = null;

            h2Elements.forEach(h2 => {
                const h2Text = h2.textContent.trim();
                const h3Elements = document.querySelectorAll('h3.mt-1');

                h3Elements.forEach(h3 => {
                    const h3Text = h3.textContent.trim();

                    if (h2Text.includes(h3Text)) {
                        const label = h3.closest('label');
                        if (label) {
                            const span = label.querySelector('span');
                            if (span) {
                                span.click();
                                inputToCheck = label.querySelector('input');
                                if (inputToCheck) {
                                    inputToCheck.checked = true;
                                }
                            }
                        }
                    }
                });
            });

            const interval2 = setInterval(() => {
                const button = document.querySelector('.btn.btn-primary.btn-lg.claim-button.mt-0');
                let reCaptchaResponse = "";
                let hCaptchaResponse = "";

                const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
                const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

                if (reCaptchaTextarea) {
                    reCaptchaResponse = reCaptchaTextarea.value;
                }
                if (hCaptchaTextarea) {
                    hCaptchaResponse = hCaptchaTextarea.value;
                }

                if ((inputToCheck && inputToCheck.checked) || reCaptchaResponse.length !== 0 || hCaptchaResponse.length !== 0) {
                    if (mbsolver() && button && !button.disabled) {
                        setButtonClicked();
                        clearInterval(interval2);
                        setTimeout(function() {
                        button.click();
                       }, 2000);
                    }
                }
            }, 1000);
        }, 3000);
    }
}, 3000);
}
if (window.location.href.includes("firewall")) {
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector('[data-target="#exampleModal"]');
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
                $('.btn.btn-primary.btn-lg').click();
            }
        }, 5000);
    }
})();
