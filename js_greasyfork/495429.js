// ==UserScript==
// @name         btcbunch.com
// @namespace    http://tampermonkey.net/
// @version      04
// @description  Automate btcbunch
// @author       LTW
// @license      none
// @match        https://btcbunch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=btcbunch.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495429/btcbunchcom.user.js
// @updateURL https://update.greasyfork.org/scripts/495429/btcbunchcom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const login = '';
    const senha = '';
    const redirecionamento = 'https://btcbunch.com/madfaucet';

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

        if (url === 'https://btcbunch.com/' || url === 'https://btcbunch.com') {
            window.location.href = 'https://btcbunch.com/login';
        } else if (url === 'https://btcbunch.com/dashboard') {
            window.location.href = 'https://btcbunch.com/madfaucet';
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

    const checkForDailyLimitReached = () => {
        const textElements = document.querySelectorAll('body *');
        textElements.forEach(element => {
            if (element.textContent.includes('Daily limit reached')) {
                window.location.href = redirecionamento;
            }
        });
    };
function mbsolver() {
    const antibotLinksElement = document.getElementById('antibotlinks');
    if (antibotLinksElement) {
        const valorAntibotlinks = antibotLinksElement.value.replace(/\s/g, '');
        return valorAntibotlinks.length !== 0;
    }
    return false;
}

const wasButtonClicked = () => localStorage.getItem('buttonClicked') === 'true';
const setButtonClicked = () => localStorage.setItem('buttonClicked', 'true');
const removeButtonClicked = () => localStorage.removeItem('buttonClicked');

if (wasButtonClicked()) {
    removeButtonClicked();
    window.location.href = redirecionamento;
}

setInterval(() => {
    if (window.location.href.includes("/madfaucet") && grecaptcha && grecaptcha.getResponse().length !== 0 && mbsolver()) {
        const submitButton = document.querySelector('[type="submit"]');

        if (submitButton && !submitButton.disabled) {
            submitButton.click();
            setButtonClicked();
        }
    }
}, 3000);

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


    const executeScript = async () => {
        handlePageRedirection();
        setTimeout(() => {
            window.location.reload();
        }, 180000);
    };

    setInterval(() => {
        checkForDailyLimitReached();
        checkFirewall();
    }, 3000);

    executeScript();
})();
