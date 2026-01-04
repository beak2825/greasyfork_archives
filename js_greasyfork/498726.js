// ==UserScript==
// @name         cashbux.work
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  cashbux
// @author       LTW
// @license      none
// @match        https://cashbux.work/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cashbux.work
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498726/cashbuxwork.user.js
// @updateURL https://update.greasyfork.org/scripts/498726/cashbuxwork.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const email = '';
    const senha = '';
    const redirecionamento = '';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {return; } else {
setTimeout(function () {
    const textElements = document.querySelectorAll('body *');
    textElements.forEach(function(element) {
      if (element.textContent.includes('Daily limit reached')) {
        window.location.href = redirecionamento;
      }
    }); }, 3000);
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://cashbux.work/' || url === 'https://cashbux.work') {
            window.location.href = 'https://cashbux.work/login';
        } else if (url === 'https://cashbux.work/dashboard') {
            window.location.href = 'https://cashbux.work/faucet';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
        const [emailInput, passwordInput] = await Promise.all([waitForElement('#email'), waitForElement('#password')]);

        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = senha;

    const submitButton = document.querySelector("button[type='submit']");
    setInterval(() => grecaptcha && grecaptcha.getResponse().length !== 0 && submitButton?.click(), 5000);}

    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://cashbux.work/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    let hasClicked = false;

    function mbsolver() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length === 12;
    }

    function wasButtonClicked() {
        return localStorage.getItem('buttonClicked') === 'true';
    }

    function setButtonClicked() {
        localStorage.setItem('buttonClicked', 'true');
    }

    function removeButtonClicked() {
        localStorage.removeItem('buttonClicked');
    }

    if (wasButtonClicked()) {
        removeButtonClicked();
       window.location.href = redirecionamento;
    }

            setTimeout(function () {
            location.reload();
        }, 120000);
    setInterval(function() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')

        if (window.location.href.includes("/faucet") && turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && mbsolver() && !wasButtonClicked()) {

           const submitButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);

if (window.location.href.includes("firewall")) {
    let checkTurnstileInput = setInterval(function() {
    let turnstileContainer = document.querySelector('.cf-turnstile');
    if (turnstileContainer) {
        let turnstileInput = turnstileContainer.querySelector('input');
        if (turnstileInput) {
            if (turnstileInput.value) {
                let unlockButton = document.querySelector('.btn.btn-primary.w-md');
                if (unlockButton) {
                    unlockButton.click();
                    clearInterval(checkTurnstileInput);
                }
            }
        }
    }
}, 3000);
        let firewall = setInterval(function() {
            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button[type='submit']");
            if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                boton.click();
                clearInterval(firewall);
            }
        }, 5000);
    }
        }
})();