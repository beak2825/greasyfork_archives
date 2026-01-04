// ==UserScript==
// @name         Auto Claim Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically handles login, LTC faucet claiming and reloads the page.
// @author       Rubystance
// @license      MIT
// @match        https://claimcrypto.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545231/Auto%20Claim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/545231/Auto%20Claim%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const email = "YOUR_FAUCETPAY_EMAIL_HERE"; // ← Replace with your FaucetPay email
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function autoLogin() {
        const emailInput = document.querySelector('input[name="wallet"]');
        const loginBtn = document.querySelector('button.cta-btn');
        if (emailInput && loginBtn) {
            console.log("[Login] Filling in email...");
            emailInput.value = email;
            await delay(5000);
            loginBtn.click();
        }
    }

    async function goToLTC() {
        const faucetLink = document.querySelector('a.dropdown-item[href="/faucet/currency/ltc"]');
        if (faucetLink) {
            console.log("[Dashboard] Navigating to LTC Faucet...");
            await delay(5000);
            faucetLink.click();
        }
    }

    async function handleClaimNow() {
        const claimBtn = document.querySelector('#subbutt');
        if (claimBtn) {
            console.log("[Faucet] Clicking 'Claim Now'...");
            await delay(10000);
            claimBtn.click();

            console.log("[Faucet] Waiting 3 seconds before reloading...");
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
    }

    function detectAndClickGoClaim() {
        console.log("[Watcher] Looking for 'Go Claim' button...");

        const checkBtn = setInterval(() => {
            const goClaimBtn = [...document.querySelectorAll('a.btn.btn-primary')]
                .find(el => el.textContent.trim().toLowerCase() === "go claim");

            if (goClaimBtn) {
                console.log("[Watcher] 'Go Claim' button found! Clicking...");
                goClaimBtn.click();
                clearInterval(checkBtn);
            }
        }, 1000);

        setTimeout(() => clearInterval(checkBtn), 60000);
    }

    async function main() {
        const path = location.pathname;

        if (path === "/" || path.includes("index")) {
            await delay(1000);
            await autoLogin();
        }

        else if (path === "/dashboard") {
            await delay(1000);
            await goToLTC();
        }

        else if (path === "/faucet/currency/ltc") {
            await delay(1000);
            await handleClaimNow();
            detectAndClickGoClaim();
        }
    }

    main();
})();
