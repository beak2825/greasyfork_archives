// ==UserScript==
// @name         freeltc.online
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Login, Faucet & MadFaucet
// @author       LTW
// @license      none
// @match        https://freeltc.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeltc.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500360/freeltconline.user.js
// @updateURL https://update.greasyfork.org/scripts/500360/freeltconline.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const redirecionamento = '';
    const redirecionamentoMadFaucet = '';
    const login = '';
    const senha = '';

    if(window.location.href.includes('/bypass.php')){window.location.href = 'https://freeltc.online/faucet';}
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://freeltc.online/' || url === 'https://freeltc.online') {
            window.location.href = 'https://freeltc.online/login';
        } else if (url === 'https://freeltc.online/dashboard') {
            window.location.href = 'https://freeltc.online/faucet';
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

        if (window.location.href.includes('https://freeltc.online/login')) {
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
        if (window.location.href.includes("/faucet")){
        window.location.href = redirecionamento;}if (window.location.href.includes("/madfaucet")){
        window.location.href = redirecionamentoMadFaucet;}
    }

            setTimeout(function () {
            location.reload();
        }, 120000);
    setInterval(function() {
        const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')

        if (window.location.href.includes("faucet") && turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && mbsolver() && !wasButtonClicked()) {

           const submitButton = document.querySelector('.btn.btn-primary.btn-lg.claim-button');
            if (submitButton && !submitButton.disabled) {
                submitButton.dispatchEvent(new MouseEvent('click'));
                setButtonClicked();
            }
        }
    }, 3000);



})();