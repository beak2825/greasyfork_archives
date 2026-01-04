// ==UserScript==
// @name         Banfaucet
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Collect faucet
// @author       White
// @match        https://banfaucet.com/
// @match        https://banfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=banfaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476134/Banfaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/476134/Banfaucet.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://banfaucet.com/' || url === 'https://banfaucet.com') {
            window.location.href = 'https://banfaucet.com/login';
        } else if (url === 'https://banfaucet.com/dashboard') {
            window.location.href = 'https://banfaucet.com/faucet';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
        const [emailInput, passwordInput] = await Promise.all([waitForElement('#inputEmail'), waitForElement('#inputPassword')]);

        if (emailInput && passwordInput) {
            emailInput.value = '';
            passwordInput.value = '';

            await waitForCaptchaCompletion();

            clicarBotaoLogin();
        }
    };

    const clicarBotaoLogin = () => {
        const signInButton = document.querySelector('button.btn-submit.w-100');

        if (signInButton) {
            signInButton.dispatchEvent(new MouseEvent('click'));
        }
    };

    const waitForCaptchaCompletion = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://banfaucet.com/login')) {
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
        window.location.href = 'https://banfaucet.com/faucet';
    }

    setInterval(function() {
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
    const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

    if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {
        const submitButton = document.querySelector('button[type="submit"].custom-stbtn.btn-lg.claim-button');

        if (submitButton && !submitButton.disabled) {
            submitButton.click();
            setButtonClicked();
        }
    }
}, 3000);

    if (window.location.href.includes("firewall")) {
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
})();
