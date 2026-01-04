// ==UserScript==
// @name         Dogenetwork
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect Faucet
// @author       LTW
// @license      none
// @match        https://dogenetwork.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dogenetwork.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501394/Dogenetwork.user.js
// @updateURL https://update.greasyfork.org/scripts/501394/Dogenetwork.meta.js
// ==/UserScript==

(function() {
    'use strict';
const login = '';
const espera = 3; // tempo em segundos para esperar antes de ir para a próxima faucet

const claimUrls = [
    "https://dogenetwork.fun/faucet-doge",
    "https://dogenetwork.fun/faucet/ethereum",
  //  "https://dogenetwork.fun/faucet/litecoin",
   // "https://dogenetwork.fun/faucet/bitcoin-cash",
   // "https://dogenetwork.fun/faucet/dash",
    "https://dogenetwork.fun/faucet/digibyte",
    "https://dogenetwork.fun/faucet/tron",
    "https://dogenetwork.fun/faucet/tether",
    "https://dogenetwork.fun/faucet/feyorra",
    "https://dogenetwork.fun/faucet/zcash",
    "https://dogenetwork.fun/faucet/binancecoin",
    "https://dogenetwork.fun/faucet/solana",
    "https://dogenetwork.fun/faucet/ripple",
    "https://dogenetwork.fun/faucet/matic-network",
    "https://dogenetwork.fun/faucet/cardano"
];
const CLAIM_BUTTON_SELECTOR = 'button[type="submit"]';

let currentClaimIndex = 0;

if (window.location.href === "https://dogenetwork.fun/" || window.location.href === "https://dogenetwork.fun") {
    const elementoLink = document.querySelector('[data-target="#SignInModal"]');
    if (elementoLink) {
        elementoLink.click();
        setTimeout(() => {
            const campoLogin = document.querySelector('#SignInEmailInput');
            if (campoLogin) {
                campoLogin.value = login;
            }

            setTimeout(() => {
                const botaoLogin = document.querySelector('button[type="submit"]');
                if (botaoLogin) {
                    botaoLogin.click();
                }
            }, 2000);
        }, 1000);
    }
}

function determineNextURL() {
    const lastVisitedLink = localStorage.getItem('lastLink');
    if (lastVisitedLink) {
        const lastLinkIndex = claimUrls.indexOf(lastVisitedLink);
        if (lastLinkIndex !== -1 && lastLinkIndex < claimUrls.length - 1) {
            return claimUrls[lastLinkIndex + 1];
        }
    }
    return claimUrls[0];
}


async function clickButtonWithActions() {
    try {

function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
        const currentPageURL = window.location.href;

        if (currentPageURL.includes('/dashboard')) {
            const nextURL = determineNextURL();
            await delay(espera);
            window.location.href = nextURL;
            return;
        }
        const button = await new Promise(resolve => {
            const interval = setInterval(() => {
                const el = document.querySelector('[data-target="#claim"]');
                if (el) {
                    clearInterval(interval);
                    el.click();
                    resolve(el);
                }
            }, 3000);
        });

        if (button) {
            await delay(1);

            const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');
            await new Promise(resolve => {
                const turnstileInterval = setInterval(() => {
                    if (turnstileResponseInput && turnstileResponseInput.value.trim() !== '') {
                        clearInterval(turnstileInterval);
                        resolve();
                    }
                }, 500);
            });

            const claimButton = document.querySelector(CLAIM_BUTTON_SELECTOR);
            const checkButtonInterval = setInterval(() => {
                if (!claimButton.disabled) {
                    clearInterval(checkButtonInterval);
                    claimButton.click();
                    const lastLink = window.location.href;
                    localStorage.setItem('lastLink', lastLink);
                }
            }, 500);
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
}

setTimeout(() => {
    location.reload();
}, 90000);

function verificarRespostasEClicar() {
    const interval = setInterval(() => {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');
        const hcaptchaResponse = document.querySelector('.h-captcha iframe[data-hcaptcha-response]');

        if (turnstileResponseInput && turnstileResponseInput.value.trim() !== '' && hcaptchaResponse) {
            const hcaptchaValue = hcaptchaResponse.getAttribute('data-hcaptcha-response');
            if (hcaptchaValue && hcaptchaValue.trim() !== '') {
                clearInterval(interval);
                setTimeout(() => {
                    const button = document.getElementById("protect");
                    if (button) {
                        button.click();
                    } else {
                        console.log("Botão não encontrado.");
                    }
                }, 2000);
            }
        }
    }, 1000);
}

setTimeout(() => {
    verificarRespostasEClicar();
    clickButtonWithActions();
}, 4000);
})();