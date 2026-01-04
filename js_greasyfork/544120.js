// ==UserScript==
// @name         Rimakoko Auto Clicker (fixed)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Rimakoko auto login and full auto claim.
// @author       Rubystance
// @license      MIT
// @match        https://rimakoko.com/*
// @match        https://donaldco.in/rimakoko.php
// @match        https://myzeroland.com/rimakoko.php
// @match        https://1ink.cc/rimakoko.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544120/Rimakoko%20Auto%20Clicker%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544120/Rimakoko%20Auto%20Clicker%20%28fixed%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const walletAddress = 'YOUR_ZERO_WALLET_HERE'; // Replace with your ZERO wallet address

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fillWalletAndEnter() {
        const input = document.querySelector('input[name="bitcoinwallet"]');
        const enterBtn = Array.from(document.querySelectorAll('input.submit'))
            .find(el => el.value.includes('Enter & Earn Crypto'));

        if (input && enterBtn) {
            input.value = walletAddress;
            console.log('Wallet filled:', walletAddress);
            enterBtn.click();
            console.log('Clicked "Enter & Earn Crypto"');
            return true;
        }
        return false;
    }

    async function clickImNotBot() {
        const btn = Array.from(document.querySelectorAll('input.submit2'))
            .find(el => el.value === "I'm Not Bot");
        if (btn) {
            console.log('Waiting 1 minute before clicking "I\'m Not Bot"...');
            await delay(60000);
            btn.click();
            console.log('Clicked "I\'m Not Bot"');
            return true;
        }
        return false;
    }

    async function clickGetCrypto() {
        for (let i = 0; i < 10; i++) {
            const btn = Array.from(document.querySelectorAll('input.submit2'))
                .find(el => el.value === 'Get Crypto');

            if (btn && !btn.disabled) {
                btn.focus();
                btn.click();
                console.log('Clicked "Get Crypto"');
                return true;
            }
            await delay(1000);
        }
        console.log('"Get Crypto" button not found or not clickable after attempts');
        return false;
    }

    async function clickReturn() {
        for (let i = 0; i < 20; i++) {
            const btn = Array.from(document.querySelectorAll('input.submit2'))
                .find(el => el.value === 'Return');
            if (btn) {
                btn.click();
                console.log('Clicked "Return"');
                return true;
            }
            await delay(1000);
        }
        console.log('"Return" button not found after attempts');
        return false;
    }

    function closeIfPopup() {
        try {
            if (window.opener && !window.opener.closed) {
                window.close();
                console.log('Popup window closed. Returning to main tab.');
            }
        } catch (e) {
            console.error('Error closing popup:', e);
        }
    }

    async function clickEatMore() {
        for (let i = 0; i < 20; i++) {
            const buttons = document.querySelectorAll('input.submit2');
            for (const btn of buttons) {
                if (btn.value && btn.value.startsWith('Eat More')) {
                    btn.click();
                    console.log('Clicked "Eat More":', btn.value);
                    return true;
                }
            }
            await delay(1000);
        }
        console.log('"Eat More" button not found after attempts');
        return false;
    }

    async function clickEatBurger() {
        const btn = Array.from(document.querySelectorAll('input.submit2'))
            .find(el => el.value === 'Eat Burger');
        if (btn) {
            btn.click();
            console.log('Clicked "Eat Burger"');
            return true;
        }
        return false;
    }

    async function mainLoop() {
        while (true) {
            const url = location.href;

            if (url.includes('rimakoko.com')) {
                console.log('rimakoko.com page detected');

                if (await fillWalletAndEnter()) {
                    await delay(2000);
                    continue;
                }

                if (await clickImNotBot()) {
                    await delay(2000);
                    continue;
                }

                console.log('Trying to click "Get Crypto"...');
                if (await clickGetCrypto()) {
                    await delay(2000);
                    continue;
                }

                if (await clickReturn()) {
                    await delay(2000);
                    closeIfPopup();
                    await delay(2000);
                    continue;
                }

                if (await clickEatMore()) {
                    await delay(2000);
                    continue;
                }

                console.log('No action this iteration. Waiting 5s...');
                await delay(5000);

            } else if (url.includes('donaldco.in/rimakoko.php')) {
                console.log('donaldco.in page detected');
                if (await clickEatBurger()) {
                    await delay(2000);
                    continue;
                }
                await delay(2000);

            } else if (url.includes('myzeroland.com/rimakoko.php')) {
                console.log('myzeroland.com page detected');
                if (await clickEatBurger()) {
                    await delay(2000);
                    continue;
                }
                await delay(2000);

            } else if (url.includes('1ink.cc/rimakoko.php')) {
                console.log('1ink.cc page detected');
                if (await clickEatBurger()) {
                    await delay(2000);
                    continue;
                }
                await delay(2000);

            } else {
                console.log('Page not monitored by this script.');
                await delay(2000);
            }
        }
    }

    window.addEventListener('load', () => {
        console.log('Script started');
        closeIfPopup();
        mainLoop();
    });

})();
