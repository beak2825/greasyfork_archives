// ==UserScript==
// @name         Ez Bitcoin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Collect Faucet
// @author       White
// @match        https://ezbit.co.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ezbit.co.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479213/Ez%20Bitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/479213/Ez%20Bitcoin.meta.js
// ==/UserScript==

const claimUrls = [
    "https://ezbit.co.in/faucet/bitcoin",
    "https://ezbit.co.in/faucet/ethereum",
    "https://ezbit.co.in/faucet/litecoin",
    "https://ezbit.co.in/faucet/bitcoin-cash",
    "https://ezbit.co.in/faucet/digibyte",
    "https://ezbit.co.in/faucet/dogecoin",
    "https://ezbit.co.in/faucet/dash",
    "https://ezbit.co.in/faucet/binancecoin",
    "https://ezbit.co.in/faucet/tron",
    "https://ezbit.co.in/faucet/tether",
    "https://ezbit.co.in/faucet/zcash",
    "https://ezbit.co.in/faucet/ripple",
    "https://ezbit.co.in/faucet/matic-network",
    "https://ezbit.co.in/faucet/solana",
    "https://ezbit.co.in/faucet/cardano"
];
const CLAIM_BUTTON_SELECTOR = '#claimButton';

let currentClaimIndex = 0;

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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickButtonWithActions() {
    try {
        const currentPageURL = window.location.href;

        if (currentPageURL.includes('/dashboard')) {
            const nextURL = determineNextURL();
            await delay(5000);
            window.location.href = nextURL;
            return;
        }

        const button = await new Promise(resolve => {
            const interval = setInterval(() => {
                const el = document.querySelector('#countdown');
                if (el) {
                    clearInterval(interval);
                    el.click();
                    resolve(el);
                }
            }, 3000);
        });

        if (button) {
            await delay(1000);

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
            if (claimButton) {
                const checkButtonInterval = setInterval(() => {
                    if (!claimButton.disabled) {
                        clearInterval(checkButtonInterval);
                        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
                        delay(randomDelay).then(() => {
                            claimButton.click();
                            const lastLink = window.location.href;
                            localStorage.setItem('lastLink', lastLink);
                        });
                    }
                }, 500);
            } else {
                setTimeout(function() {
    location.reload();
  }, 10000);
            }
        } else {
            setTimeout(function() {
    location.reload();
  }, 10000);
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
}
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
                }, 5000);
            }
        }
    }, 1000);
}
function reloadPage() {
  setTimeout(function() {
    location.reload();
  }, 120000);
}

reloadPage();
verificarRespostasEClicar();
document.addEventListener('DOMContentLoaded', clickButtonWithActions);