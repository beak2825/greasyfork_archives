// ==UserScript==
// @name         Bagi Auto Faucet
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  IDK
// @author       Rubystance
// @license      MIT
// @match        https://bagi.co.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544453/Bagi%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/544453/Bagi%20Auto%20Faucet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function forceReload() {
        console.log("🔄 Forcing page reload (no confirmation popup)...");
        window.onbeforeunload = null;
        window.removeEventListener('beforeunload', () => {});
        location.reload();
    }

    async function waitForAnyCaptcha() {
        console.log("⏳ Waiting for CAPTCHA to be solved (hCaptcha, reCAPTCHA, or Turnstile)...");
        for (let i = 0; i < 60; i++) {
            const hcaptcha = document.querySelector('textarea[name="h-captcha-response"]');
            const recaptcha = document.querySelector('textarea.g-recaptcha-response');
            const turnstile = document.querySelector('textarea[name="cf-turnstile-response"]');

            if ((hcaptcha && hcaptcha.value.trim().length > 0) ||
                (recaptcha && recaptcha.value.trim().length > 0) ||
                (turnstile && turnstile.value.trim().length > 0)) {
                console.log("✅ CAPTCHA detected as solved.");
                return true;
            }
            await delay(2000);
        }
        return false;
    }

    async function forceClick(elem) {
        if (!elem) return;
        await delay(100);
        requestAnimationFrame(() => {
            console.log("🧩 Forcing click on:", elem);
            elem.click();
        });
    }

    async function waitForAndClickSubmitBtn() {
        console.log("🔍 Monitoring 'Solve Captcha!' button for activation...");
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 30;
            let wasWaiting = false;

            const interval = setInterval(() => {
                const btn = document.querySelector('#submitBtn');
                if (btn) {
                    const btnText = btn.textContent.trim().toLowerCase();
                    const isDisabled = btn.disabled || btn.hasAttribute("disabled");

                    if (isDisabled && btnText.includes("waiting")) {
                        wasWaiting = true;
                        console.log("⏳ 'Solve Captcha' button is showing 'Waiting...'. Waiting...");
                    } else if (!isDisabled && btnText.includes("solve captcha")) {
                        console.log("✅ 'Solve Captcha' button is enabled! Clicking...");
                        clearInterval(interval);
                        forceClick(btn);
                        resolve(true);
                        return;
                    }
                }
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    if (wasWaiting) {
                        console.log("❌ 'Solve Captcha' button was stuck on 'Waiting...'. Reloading...");
                        setTimeout(forceReload, 3000);
                        resolve(false);
                    } else {
                        console.log("❌ 'Solve Captcha' button did not activate in time. Reloading...");
                        setTimeout(forceReload, 3000);
                        resolve(false);
                    }
                }
            }, 1000);
        });
    }

    async function main() {
        const url = window.location.href;

        if (url.includes("dashboard.php")) {
            const claimLink = document.querySelector('a.button.is-link[href="faucet.php"]');
            if (claimLink) {
                console.log("➡️ Going to faucet.php...");
                claimLink.click();
                return;
            }
        }

        if (url.includes("faucet.php")) {
            const claimBtn = document.querySelector('button.button.is-warning[type="submit"]');
            if (claimBtn) {
                const btnText = claimBtn.textContent.trim().toLowerCase();
                if (btnText.includes("waiting") || claimBtn.disabled) {
                    console.log("⏳ 'Claim Now!' button is disabled. Reloading in 10s...");
                    setTimeout(forceReload, 10000);
                } else {
                    console.log("🟡 Clicking 'Claim Now!' button");
                    claimBtn.click();
                }
                return;
            }
        }

        if (url.includes("captha.php")) {
            const clicked = await waitForAndClickSubmitBtn();
            if (!clicked) return;

            const solved = await waitForAnyCaptcha();
            if (solved) {
                const finalBtn = document.querySelector('button.button.is-success[type="submit"][style*="width: 300px"]');
                if (finalBtn && !finalBtn.disabled) {
                    console.log("💰 Clicking final Claim button.");
                    finalBtn.click();
                    return;
                } else {
                    console.log("⚠️ Final Claim button not found or is disabled.");
                }
            } else {
                console.log("🔁 CAPTCHA not solved. Reloading...");
                setTimeout(forceReload, 3000);
            }
        }

        const homeBtn = document.querySelector('a.button.is-white[href="/"]');
        if (homeBtn) {
            console.log("🏠 Returning to HOME...");
            homeBtn.click();
            return;
        }

        console.log("⏳ No actions required. Reloading in 60s...");
        setTimeout(forceReload, 60000);
    }

    window.addEventListener('load', () => {
        setTimeout(main, 2000);
    });
})();
