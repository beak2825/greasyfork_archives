// ==UserScript==
// @name         Dogenetwork
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Collect Faucet
// @author       White
// @match        https://dogenetwork.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dogenetwork.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478658/Dogenetwork.user.js
// @updateURL https://update.greasyfork.org/scripts/478658/Dogenetwork.meta.js
// ==/UserScript==

const claimUrls = [
    "https://dogenetwork.fun/faucet/bitcoin",
    "https://dogenetwork.fun/faucet/ethereum",
    "https://dogenetwork.fun/faucet/litecoin",
    "https://dogenetwork.fun/faucet/bitcoin-cash",
    "https://dogenetwork.fun/faucet/dash",
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