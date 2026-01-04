// ==UserScript==
// @name         Gainbtc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Loogin e Faucet
// @author       White
// @match        https://gainbtc.click/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gainbtc.click
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476440/Gainbtc.user.js
// @updateURL https://update.greasyfork.org/scripts/476440/Gainbtc.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://gainbtc.click/' || url === 'https://gainbtc.click') {
            window.location.href = 'https://gainbtc.click/login';
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
    const signInButton = document.querySelector('button[type="submit"][id="form-submit"].orange-button');

        if (signInButton) {
            signInButton.dispatchEvent(new MouseEvent('click'));
        }
    };

 const waitForCaptchaCompletion = async () => {
    let turnstile = document.querySelector('.cf-turnstile > input');
    while (!(turnstile && turnstile.value.length > 0)) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    clicarBotaoLogin();
};


    const executeScript = async () => {

        handlePageRedirection();

        if (window.location.href.includes('https://gainbtc.click/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

const targetURL = 'https://gainbtc.click/member/dashboard';

const clickClaimButtonOnce = () => {
    if (window.location.href === targetURL) {
        const claimButton = document.querySelector('a[data-bs-toggle="modal"][data-bs-target="#faucetModal"]');
        if (claimButton && !claimButton.dataset.clicked) {
            claimButton.dataset.clicked = true;
            claimButton.click();
            claimButton.removeEventListener('click', preventEventPropagation);
        }
    }
};

const waitForCaptchaAndClickClaim = async () => {
    let turnstile;
    while (!(turnstile && turnstile.value.length > 0)) {
        turnstile = document.querySelector('.cf-turnstile > input');
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const claimButton = document.querySelector('a[href="javascript:void(0);"][onclick^="$(\'#form-data\').submit()"]');

    if (claimButton) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        claimButton.dispatchEvent(clickEvent);

        if (claimButton.onclick) {
            claimButton.onclick();
        }
    }
};

const preventEventPropagation = (event) => {
    event.stopPropagation();
    event.preventDefault();
};

const reloadPageIfZero = () => {
    const secondElement = document.getElementById('second');
    if (secondElement && secondElement.innerText.trim() === '0') {
        location.reload();
    }
};

document.addEventListener('click', preventEventPropagation, true);
setInterval(reloadPageIfZero, 3000);
waitForCaptchaAndClickClaim();
clickClaimButtonOnce();
})();