// ==UserScript==
// @name         AutoLitecoin
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Auto login and faucet
// @author       White
// @match        https://autolitecoin.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autolitecoin.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476341/AutoLitecoin.user.js
// @updateURL https://update.greasyfork.org/scripts/476341/AutoLitecoin.meta.js
// ==/UserScript==

(async function() {
    'use strict';
const pageTitle = document.title.toLowerCase();
if (pageTitle.includes('just a moment') || pageTitle.includes('um momento')) {
    console.log('O título da página contém a frase "just a moment" ou "um momento". O script será desativado.');
    return;}
if (!pageTitle.includes('just a moment') || !pageTitle.includes('um momento')) {
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://autolitecoin.xyz' || url === 'https://autolitecoin.xyz/') {
            window.location.href = 'https://autolitecoin.xyz/login';
        } else if (url === 'https://autolitecoin.xyz/dashboard') {
            window.location.href = 'https://autolitecoin.xyz/faucet';
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
        clicarBotaoLogin();
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://autolitecoin.xyz/login')) {
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
        window.location.href = 'https://autolitecoin.xyz/faucet';
    }


let gpcaptcha = document.querySelector('input#captcha_choosen');
setInterval(function() {
    const grecaptchaResponse = (window.grecaptcha && window.grecaptcha.getResponse) ? window.grecaptcha.getResponse() : null;
    const valorAntibotlinks = document.getElementById('antibotlinks').value.replace(/\s/g, '');

    if (window.location.href.includes("/faucet") && gpcaptcha && gpcaptcha.value.length > 0 && mbsolver() && !wasButtonClicked()) {
        $(document).ready(function () {
            const buttonText = "Claim Now";
            const submitButton = $(`button:contains('${buttonText}')`);

            if (submitButton.length > 0 && !submitButton.prop('disabled')) {
                submitButton.trigger('click');
                setButtonClicked();
            }
        });
    }
}, 3000);
}
})();
