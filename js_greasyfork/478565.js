// ==UserScript==
// @name         CryptoScoop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CryptoScoop Faucet
// @author       White
// @match        https://cryptoscoop.online/
// @match        https://cryptoscoop.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptoscoop.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478565/CryptoScoop.user.js
// @updateURL https://update.greasyfork.org/scripts/478565/CryptoScoop.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://cryptoscoop.online/' || url === 'https://cryptoscoop.online/') {
            window.location.href = 'https://cryptoscoop.online/login';
        } else if (url === 'https://cryptoscoop.online/dashboard') {
            window.location.href = 'https://cryptoscoop.online/goldmine';
        }
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return document.querySelector(selector);
    };

const preencherCampos = async () => {
    const [emailInput, passwordInput] = await Promise.all([ waitForElement('#email'), waitForElement('#password') ]);

    if (emailInput && passwordInput) {
        emailInput.value = 'email'; passwordInput.value = 'senha';

        await waitForCaptchaCompletion();

        clicarBotaoLogin();
    }
};


const clicarBotaoLogin = () => {
    const signInButton = document.querySelector('button[class="rpgui-button mt-3"]');

    if (signInButton) {
        signInButton.dispatchEvent(new MouseEvent('click'));

        const interval = setInterval(function() {
            var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');

            if (iframe) {
                var response = iframe.getAttribute('data-hcaptcha-response');
                if (response) {
                    setTimeout(function() {
                        var submitButton = document.querySelector('button.rpgui-button.mt-3');

                        if (submitButton) {
                            submitButton.click();
                            setButtonClicked();
                            clearInterval(interval);
                        }
                    }, 3000);
                }
            }
        }, 1000);
    }
};



    const waitForCaptchaCompletion = async () => {
        while (!(grecaptcha && grecaptcha.getResponse().length > 0)) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    const executeScript = async () => {
        handlePageRedirection();

        if (window.location.href.includes('https://cryptoscoop.online/login')) {
            await preencherCampos();
        }
    };

    await executeScript();

    let hasClicked = false;

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
        window.location.href = 'https://cryptoscoop.online/auto';
    }

 if (window.location.href === 'https://cryptoscoop.online/goldmine') {
    setInterval(function() {
        var iframe = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');

        if (iframe) {
            var response = iframe.getAttribute('data-hcaptcha-response');
            if (response) {
                setTimeout(function() {
                    var submitButton = document.querySelector('button.rpgui-button.mt-3');

                    if (submitButton) {
                        submitButton.click();
                        setButtonClicked();
                    }
                }, 3000);
            }
        }
    }, 1000);
  }

if (window.location.href.includes('/auto')) {

    const elements = document.querySelectorAll('div.alert.alert-warning.text-center.mb-2');
    elements.forEach(element => {
        if (element.textContent.trim() === 'Smelting Inaktive! You need more gold ore.') {

            window.location.href = 'https://cryptoscoop.online/goldmine';
        }
    });
}
})();