// ==UserScript==
// @name         ClaimCash
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto login e faucet
// @author       White
// @match        https://claimcash.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimcash.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476183/ClaimCash.user.js
// @updateURL https://update.greasyfork.org/scripts/476183/ClaimCash.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://claimcash.cc/' || url === 'https://claimcash.cc') {
            window.location.href = 'https://claimcash.cc/login';
        } else if (url === 'https://claimcash.cc/dashboard') {
            window.location.href = 'https://claimcash.cc/faucet';
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
            emailInput.value = 'email';
            passwordInput.value = 'senha';

            await waitForCaptchaCompletion();

            clicarBotaoLogin();
        }
    };

    const clicarBotaoLogin = () => {
        const signInButton = document.querySelector('.btn.btn-primary.btn-block.waves-effect.waves-light');

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

        if (window.location.href.includes('https://claimcash.cc/login')) {
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
        window.location.href = 'https://claimcash.cc/faucet';
    }
const paragraphElement = document.querySelector('p.lh-1.mb-1.font-weight-bold');

    setInterval(function() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

        if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {

           const submitButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
            if (submitButton) {
                submitButton.click();
                setButtonClicked();
            }
        }
    }, 3000);
})();
