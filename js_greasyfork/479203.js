// ==UserScript==
// @name         Solnetwork
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       White
// @match        https://solnetwork.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solnetwork.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479203/Solnetwork.user.js
// @updateURL https://update.greasyfork.org/scripts/479203/Solnetwork.meta.js
// ==/UserScript==

const claimUrls = [
    "https://solnetwork.fun/faucet/bitcoin",
    "https://solnetwork.fun/faucet/ethereum",
    "https://solnetwork.fun/faucet/litecoin",
    "https://solnetwork.fun/faucet/bitcoin-cash",
    "https://solnetwork.fun/faucet/digibyte",
    "https://solnetwork.fun/faucet/dogecoin",
    "https://solnetwork.fun/faucet/dash",
    "https://solnetwork.fun/faucet/binancecoin",
    "https://solnetwork.fun/faucet/tron",
    "https://solnetwork.fun/faucet/tether",
    "https://solnetwork.fun/faucet/zcash",
    "https://solnetwork.fun/faucet/ripple",
    "https://solnetwork.fun/faucet/matic-network",
    "https://solnetwork.fun/faucet/cardano"
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

function reloadPage() {
  setTimeout(function() {
    location.reload();
  }, 90000);
}

reloadPage();
document.addEventListener('DOMContentLoaded', clickButtonWithActions);