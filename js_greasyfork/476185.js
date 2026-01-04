// ==UserScript==
// @name         SpaceShooter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Faucet e auto login
// @author       White
// @match        https://spaceshooter.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spaceshooter.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476185/SpaceShooter.user.js
// @updateURL https://update.greasyfork.org/scripts/476185/SpaceShooter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://spaceshooter.net/' || url === 'https://spaceshooter.net') {
            window.location.href = 'https://spaceshooter.net/login';
        } else if (url === 'https://spaceshooter.net/dashboard') {
            window.location.href = 'https://spaceshooter.net/faucet';
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
     const signInButton = document.querySelector('button.btn-submit.w-100[type="submit"]');

    if (signInButton) {
        signInButton.click();
    }
};

const waitForCaptchaCompletion = async () => {
    while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};

const executeScript = async () => {
    handlePageRedirection();

    if (window.location.href.includes('https://spaceshooter.net/login')) {
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
        window.location.href = 'https://spaceshooter.net/faucet';
    }

    setInterval(function() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;

        if (window.location.href.includes("/faucet") && grecaptchaResponse && grecaptchaResponse.length > 0 && mbsolver() && !wasButtonClicked()) {
            const submitButton = document.querySelector('button.btn.btn-success.text-white.btn-lg.claim-button[type="submit"]');
            if (submitButton) {
                submitButton.click();
                setButtonClicked();
            }
        }
    }, 3000);
})();