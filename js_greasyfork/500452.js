// ==UserScript==
// @name         fastfaucet.net
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      none
// @description  fastfaucet
// @author       LTW
// @match        https://fastfaucet.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fastfaucet.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500452/fastfaucetnet.user.js
// @updateURL https://update.greasyfork.org/scripts/500452/fastfaucetnet.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const redirecionamento = '';
    const login = '';
    const senha = '';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://fastfaucet.net/' || url === 'https://fastfaucet.net') {
            window.location.href = 'https://fastfaucet.net/login';
        } else if (url === 'https://fastfaucet.net/dashboard') {
            window.location.href = 'https://fastfaucet.net/faucet';
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
            emailInput.value = login;
            passwordInput.value = senha;

    const submitButton = document.querySelector("button[type='submit']");
    setInterval(() => grecaptcha && grecaptcha.getResponse().length !== 0 && submitButton?.click(), 5000);}

    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://fastfaucet.net/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    let hasClicked = false;

    function isAntiBotLinksValid() {
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

        if (window.location.href.includes("/faucet") && turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && isAntiBotLinksValid() && !wasButtonClicked()) {

           const submitButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);
(() => {
    if(window.location.href.includes('/faucet') || window.location.href.includes('/madfaucet')){
    setInterval(function() {
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

        if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
            if (isAntiBotLinksValid() && !wasButtonClicked()) {
                const submitButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
                if (submitButton && !submitButton.disabled) {
                    submitButton.click();
                    setButtonClicked();
                }
            }
        }
    }, 3000);
    }
})();
        let firewall = setInterval(function() {
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

            let recaptchav3 = document.querySelector("input#recaptchav3Token");
            let hcaptcha = document.querySelector('.h-captcha > iframe');
            let turnstile = document.querySelector('.cf-turnstile > input');
            let boton = document.querySelector("button.btn.btn-primary.w-md[type='submit']");
if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) { boton.click();
                clearInterval(firewall);
            }
        }, 5000);

})();