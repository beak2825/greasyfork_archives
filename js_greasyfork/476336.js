// ==UserScript==
// @name         BitKong Faucet Auto-Clicker
// @namespace    Roberto Bolanos
// @version      1.9
// @description  Automatically clicks the "Claim" button for faucet refill on BitKong, LuckyDice, and SimpleDice.
// @match        https://*.bitkong.com/*
// @match        https://*.luckydice.com/*
// @match        https://*.simpledice.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476336/BitKong%20Faucet%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/476336/BitKong%20Faucet%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonClicked = false;
    let erroElement;

    function clickFaucetRedeemButton() {
        let faucetRedeemButton;
        if (window.location.host.includes('bitkong.com')) {
            faucetRedeemButton = document.querySelector('button.sc-bYSBpT.cNOWzQ');
             if (!faucetRedeemButton) {
                 faucetRedeemButton = document.querySelector('button.sc-bYSBpT.bRynmb');
             }
        } else if (window.location.host.includes('luckydice.com')) {
         faucetRedeemButton = document.querySelector('button.sc-bYSBpT.daifcP');
            if (!faucetRedeemButton) {
        faucetRedeemButton = document.querySelector('button.sc-bYSBpT.kzNSnK');
        }
        } else if (window.location.host.includes('simpledice.com')) {
            faucetRedeemButton = document.querySelector('button.sc-bYSBpT.gZMPlp');
            if (!faucetRedeemButton) {
            faucetRedeemButton = document.querySelector('button.sc-bYSBpT.gUfCUq');
            }
        }

        if (faucetRedeemButton) {
            faucetRedeemButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            faucetRedeemButton.dispatchEvent(clickEvent);
            buttonClicked = true;
        }
    }

    async function startAutomation() {
        window.onload = function() {
            const initialWait = Math.random() * (20000 - 10000) + 10000;
            setTimeout(function() {
                buttonClicked = true;

                const spanElements = document.querySelectorAll('span.sc-htpNat.gepgcI');
                let spanElement;
                for (const element of spanElements) {
                    if (element.textContent === "Faucet grátis") {
                        spanElement = element;
                        break;
                    }
                }

                if (spanElement) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    spanElement.dispatchEvent(clickEvent);
                    setTimeout(function() {
                        clickFaucetRedeemButton();
                    }, 5000);
                     const waitInterval = Math.random() * (600000 - 480000) + 480000;
            setTimeout(() => {
                location.reload();
            }, waitInterval);
                }
            }, initialWait);
        };
    }





try {
    startAutomation();
} catch (error) {
    console.error('An error occurred:', error);
}
})();
