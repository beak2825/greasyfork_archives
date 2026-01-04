// ==UserScript==
// @name         Auto Claim - Earn Solana
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autofill email, wait for CAPTCHA, login and claim LTC.
// @author       Rubystance
// @license      MIT
// @match        https://earnsolana.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545873/Auto%20Claim%20-%20Earn%20Solana.user.js
// @updateURL https://update.greasyfork.org/scripts/545873/Auto%20Claim%20-%20Earn%20Solana.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const email = "YOUR_FAUCETPAY_EMAIL_HERE"; // <-- Replace this with your FaucetPay email

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsed = 0;
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                } else if (elapsed >= timeout) {
                    clearInterval(interval);
                    reject(`Element ${selector} not found after ${timeout}ms.`);
                }
                elapsed += intervalTime;
            }, intervalTime);
        });
    }

    async function autoLogin() {
        if (window.location.pathname === "/" || window.location.pathname === "/index") {
            try {
                const emailInput = await waitForElement('input[name="wallet"]');
                emailInput.value = email;

                const observer = new MutationObserver((mutations, obs) => {
                    const captchaStatus = document.querySelector('.iconcaptcha-modal__body-title');
                    if (captchaStatus && captchaStatus.textContent.includes("Verification complete")) {
                        const loginBtn = document.querySelector('button[type="submit"].btn-responsive');
                        if (loginBtn) {
                            loginBtn.click();
                            obs.disconnect();
                        }
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            } catch (e) {
                console.error("Login error:", e);
            }
        }
    }

    async function goToLTCFaucet() {
        if (window.location.pathname === "/dashboard") {
            const ltcLink = await waitForElement('a[href="https://earnsolana.xyz/faucet/currency/ltc"]'); // <<-- If you want to claim other crypto SOL/DOGE/FEY.
            ltcLink.click();
        }
    }

    async function clickGoClaim() {
        if (window.location.pathname.startsWith("/faucet/currency/ltc")) {
            const goClaimBtn = await waitForElement('a.btn.btn-primary[href="https://earnsolana.xyz/faucet/currency/ltc"]', 8000); // <<-- If you want to claim other crypto SOL/DOGE/FEY.
            if (goClaimBtn && goClaimBtn.textContent.includes("Go Claim")) {
              
                window.location.href = goClaimBtn.href;
            }
        }
    }

    async function autoClaim() {
        if (window.location.pathname.startsWith("/faucet/currency/ltc")) { // <<-- If you want to claim other crypto SOL/DOGE/FEY.
            const observer = new MutationObserver((mutations, obs) => {
                const captchaStatus = document.querySelector('.iconcaptcha-modal__body-title');
                if (captchaStatus && captchaStatus.textContent.includes("Verification complete")) {
                    const claimBtn = document.getElementById("subbutt");
                    if (claimBtn) {
                        claimBtn.click();
                        obs.disconnect();
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.addEventListener('load', () => {
        autoLogin();
        goToLTCFaucet();
        clickGoClaim();
        autoClaim();
    });

})();
