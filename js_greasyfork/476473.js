// ==UserScript==
// @name         SimpleBits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Faucet Collector
// @author       White
// @match        https://simplebits.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simplebits.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476473/SimpleBits.user.js
// @updateURL https://update.greasyfork.org/scripts/476473/SimpleBits.meta.js
// ==/UserScript==

(async function() {
    'use strict';
window.addEventListener('load', async () => {
    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://simplebits.io/' || url === 'https://simplebits.io') {
            window.location.href = 'https://simplebits.io/login';
        } else if (url === 'https://simplebits.io/dashboard') {
            window.location.href = 'https://simplebits.io/faucet';
        }
    };
    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

    const preencherCampos = async () => {
       const [emailInput, passwordInput] = await Promise.all([ waitForElement('[name="username"]'), waitForElement('[name="password"]')]);

        if (emailInput && passwordInput) {
            emailInput.value = 'email';
            passwordInput.value = 'senha';

            await waitForCaptchaCompletion();

            clicarBotaoLogin();
        }
    };

    const clicarBotaoLogin = () => {
    const signInButton = document.querySelector('button.btn.bg-primary-500.pull-xs-right[type="submit"]');

        if (signInButton) {
            signInButton.dispatchEvent(new MouseEvent('click'));
        }
    };

 const waitForCaptchaCompletion = async () => {
    while (!(grecaptchaResponse && grecaptchaResponse.length > 0)) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
     console.Log("clicando")
    await new Promise(resolve => setTimeout(resolve, 3000));
    clicarBotaoLogin();
     console.Log("clicado")
};


    const executeScript = async () => {

        handlePageRedirection();

        if (window.location.href.includes('https://simplebits.io/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    const checkAndClick = () => {
const submitButton = document.querySelector('button.btn.variant-ghost-primary.btn-lg');

if (window.location.href.includes("/faucet") && submitButton && !submitButton.hasAttribute('disabled')) {
        if (submitButton) {
            submitButton.click();
            localStorage.setItem('buttonClicked', 'true');
            return true;
        }
    }
    return false;
};

setInterval(() => {
    if (localStorage.getItem('buttonClicked')) {
        localStorage.removeItem('buttonClicked');
        window.location.href = 'https://simplebits.io/faucet';
    } else {
        checkAndClick();
    }
}, 3000);
    });
})();