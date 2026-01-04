// ==UserScript==
// @name         whoopyrewards
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  whoopyrewards.com
// @license      none
// @author       LTW
// @match        https://whoopyrewards.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whoopyrewards.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493185/whoopyrewards.user.js
// @updateURL https://update.greasyfork.org/scripts/493185/whoopyrewards.meta.js
// ==/UserScript==

(async function() {
    'use strict';
const email = '';
const senha = '';
const redirecionamento = '';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://whoopyrewards.com/' || url === 'https://whoopyrewards.com') {
            window.location.href = 'https://whoopyrewards.com/login';
        } else if (url === 'https://whoopyrewards.com/dashboard') {
            window.location.href = 'https://whoopyrewards.com/faucet';
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

    const submitButton = document.querySelector("button.btn.btn-primary.btn-block.waves-effect.waves-light[type='submit']");
    setInterval(() => grecaptcha && grecaptcha.getResponse().length !== 0 && submitButton?.click(), 5000);}

    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://whoopyrewards.com/login')) {
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
const paragraphElement = document.querySelector('p.lh-1.mb-1.font-weight-bold');

    if (window.location.href.includes("/faucet")){
    const interval = setInterval(() => {
        const button = document.getElementById('continueBtn');
        if (button && !button.disabled) {
            clearInterval(interval);
            setTimeout(() => {
                button.click();
            }, 2000);
        }
    }, 100);


            setTimeout(function () {
            location.reload();
        }, 60000);
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
    }


})();
