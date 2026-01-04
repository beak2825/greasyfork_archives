// ==UserScript==
// @name         litefaucet.in
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automation script for litefaucet.in
// @author       LTW
// @license      none
// @match        https://litefaucet.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=litefaucet.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493318/litefaucetin.user.js
// @updateURL https://update.greasyfork.org/scripts/493318/litefaucetin.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const email = "";
    const senha = "";
    const redirecionamento = "";

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://litefaucet.in/' || url === 'https://litefaucet.in') {
            window.location.href = 'https://litefaucet.in/login';
        } else if (url === 'https://litefaucet.in/dashboard') {
            window.location.href = 'https://litefaucet.in/faucet';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
        const [emailInput, passwordInput] = await Promise.all([
            waitForElement('#email'),
            waitForElement('#password')
        ]);

        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = senha;

            await waitForCaptchaCompletion();

            clicarBotaoLogin();
        }
    };

    const clicarBotaoLogin = () => {
        const signInButton = document.querySelector('.btn.btn-outline-secondary.login-btn.w-100.mb-3');

        if (signInButton) {
            signInButton.dispatchEvent(new MouseEvent('click'));
        }
    };

    const waitForCaptchaCompletion = async () => {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');
        while (!(turnstileResponseInput && turnstileResponseInput.value.trim() !== '')) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://litefaucet.in/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    const mbsolver = () => {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        return valorAntibotlinks.length === 12;
    };

    const wasButtonClicked = () => {
        return localStorage.getItem('buttonClicked') === 'true';
    };

    const setButtonClicked = () => {
        localStorage.setItem('buttonClicked', 'true');
    };

    const removeButtonClicked = () => {
        localStorage.removeItem('buttonClicked');
    };

    if (wasButtonClicked() && window.location.href.includes("/faucet")) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }


    setTimeout(() => {
        location.reload();
    }, 120000);

    setInterval(() => {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');

        if (window.location.href.includes("/faucet") && turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && mbsolver() && !wasButtonClicked()) {
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);


})();
