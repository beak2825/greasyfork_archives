// ==UserScript==
// @name         FaucetCrypto.net
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automate FaucetCrypto
// @author       LTW
// @license      none
// @match        https://faucetcrypto.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetcrypto.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495423/FaucetCryptonet.user.js
// @updateURL https://update.greasyfork.org/scripts/495423/FaucetCryptonet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const login = '';
    const senha = '';
    const redirecionamento = '';

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const clickButton = (selector) => {
        const button = document.querySelector(selector);
        if (button) button.click();
    };

    const setValue = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.value = value;
    };

    const waitForElement = async (selector) => {
        while (!document.querySelector(selector)) {
            await delay(100);
        }
    };

    const handlePageRedirection = () => {
        const url = window.location.href;

        if (url === 'https://faucetcrypto.net/' || url === 'https://faucetcrypto.net') {
            window.location.href = 'https://faucetcrypto.net/login';
        } else if (url === 'https://faucetcrypto.net/dashboard') {
            window.location.href = 'https://faucetcrypto.net/faucet';
        }
    };

    if (window.location.href.includes("/login")) {
        setTimeout(async function () {
            setValue("#email", login);
            setValue("#password", senha);

            const checkAndClick = async () => {
                if (grecaptcha && grecaptcha.getResponse().length !== 0) {
                    clickButton('[type="submit"]');
                } else {
                    setTimeout(checkAndClick, 3000);
                }
            };

            await delay(2000);
            checkAndClick();
        }, 2000);
    }

    const waitForCaptchaCompletion = async () => {
        while (!window.grecaptcha || grecaptcha.getResponse().length === 0) {
            await delay(1000);
        }
    };

    const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
    const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
    const removeButtonClicked = () => localStorage.removeItem('buttonClicked');
if (wasButtonClicked()) {
        removeButtonClicked();
        window.location.href = redirecionamento;
    }
    const checkForDailyLimitReached = () => {
        const textElements = document.querySelectorAll('body *');
        textElements.forEach(element => {
            if (element.textContent.includes('Daily limit reached')) {
                window.location.href = redirecionamento;
            }
        });
    };

const solveFaucet = async () => {
    await waitForElement('#antibotlinks');
         let reCaptchaResponse = "";
        let hCaptchaResponse = "";

        const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
        const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

        if (reCaptchaTextarea) {
            reCaptchaResponse = reCaptchaTextarea.value;
        }

        if (hCaptchaTextarea) {
            hCaptchaResponse = hCaptchaTextarea.value;
        }
    if ((reCaptchaResponse && reCaptchaResponse.length !== 0) || (hCaptchaResponse && hCaptchaResponse.length !== 0)) {
    if (window.location.href.includes("/faucet")) {
        const submitButton = document.querySelector('[type="submit"]');
        if (submitButton) {
            clearInterval(intervalId)
            submitButton.click();
            setButtonClicked();
        }
     }
   }
};

const intervalId = setInterval(solveFaucet, 4000);


    const checkFirewall = () => {
        if (window.location.href.includes("firewall")) {
            const firewallInterval = setInterval(() => {
                const recaptchaV3 = document.querySelector("input#recaptchav3Token");
                const hcaptcha = document.querySelector('.h-captcha > iframe');
                const turnstile = document.querySelector('.cf-turnstile > input');
                const submitButton = document.querySelector("button[type='submit']");

                if (submitButton && (
                    (hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) ||
                    grecaptcha.getResponse().length > 0 ||
                    (recaptchaV3 && recaptchaV3.value.length > 0) ||
                    (turnstile && turnstile.value.length > 0)
                )) {
                    submitButton.click();
                    clearInterval(firewallInterval);
                }
            }, 5000);
        }
    };
const e = () => {
    const value = localStorage.getItem('f');
    return value === '1';
};
const a = () => localStorage.setItem('f', '1');
const c = () => localStorage.setItem('f', '0');
if(!grecaptcha){
const targetText = "You need to claim at least 1 shortlink to claim faucet. Click here";
const elements = document.getElementsByTagName('*');



if (window.location.href.includes("https://faucetcrypto.net/faucet")) {
    for (let element of elements) {
        if (element.textContent.includes(targetText)) {
               c();
            window.location.href = 'https://faucetcrypto.net/links';
            return;
        }
    }
}
}
if (window.location.href.includes("https://faucetcrypto.net/links")) {

    if (e()) {
         window.location.href = redirecionamento;
        return;
    }

    const links = [
        'https://faucetcrypto.net/links/go/179',
        'https://faucetcrypto.net/links/go/240',
    ];

    let linkFound = false;

    for (var i = 0; i < links.length; i++) {
        var link = document.querySelector('a[href="' + links[i] + '"]');
        if (link) {
            a();
            window.location.href = link.href;
            linkFound = true;
            return;
        }
    }

    if (!linkFound) {
        window.location.href = redirecionamento;
        return;
    }
}




    const executeScript = async () => {
        handlePageRedirection();
        setTimeout(() => {
            window.location.reload();
        }, 180000);
    };
 checkForDailyLimitReached();
checkFirewall();
    executeScript();
})();
