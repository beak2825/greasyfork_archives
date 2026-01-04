// ==UserScript==
// @name         ClaimLitoshi Auto Email Fill + Auto Claim Crypto.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto fill email, login after captcha, navigate to DGB faucet and claim reward.
// @author       Rubystance
// @license      MIT
// @match        https://claimlitoshi.top/
// @match        https://claimlitoshi.top/dashboard*
// @match        https://claimlitoshi.top/faucet/6*
// @match        https://claimlitoshi.top/firewall*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546160/ClaimLitoshi%20Auto%20Email%20Fill%20%2B%20Auto%20Claim%20Crypto.user.js
// @updateURL https://update.greasyfork.org/scripts/546160/ClaimLitoshi%20Auto%20Email%20Fill%20%2B%20Auto%20Claim%20Crypto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myEmail = "YOUR_FAUCETPAY_EMAIL_HERE";  // ← replace with your faucetpay e-mail.

    if (window.location.href === "https://claimlitoshi.top/") {
        console.log("On root page...");

        function tryLogin() {
            let emailInput = document.querySelector('input[name="wallet"]');
            let loginBtn = document.querySelector('button.btn.btn-primary.rounded-2.text-white.btn-mw.btn-animate');

            if (emailInput && loginBtn) {
                if (!emailInput.value) {
                    emailInput.value = myEmail;
                    console.log("Email filled:", myEmail);
                }

                if (!loginBtn.disabled) {
                    console.log("Captcha solved, clicking Login...");
                    setTimeout(() => {
                        loginBtn.click();
                    }, 2000);
                }
            }
        }

        let observer = new MutationObserver(() => {
            tryLogin();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            tryLogin();
        }, 4000);
    }

    if (window.location.href.includes("/dashboard")) {
        let link = document.querySelector('a.pc-link[href="https://claimlitoshi.top/faucet/6"]');
        if (link) {
            console.log("Navigating to DGB faucet...");
            link.click();
        }
    }

    if (window.location.href.includes("/faucet/6")) {
        console.log("On DGB faucet, waiting for captcha...");

        function tryClickFaucet() {
            let btn = document.querySelector('button.claim-button');
            if (btn && !btn.disabled) {
                console.log("Faucet button found, clicking in 3s...");
                setTimeout(() => {
                    btn.click();
                }, 3000);
            }
        }

        let observer = new MutationObserver(() => {
            tryClickFaucet();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            tryClickFaucet();
        }, 5000);
    }

    if (window.location.href.includes("/firewall")) {
        console.log("On firewall page, waiting for captcha...");

        function tryClickFirewall() {
            let btn = document.querySelector('button.btn.btn-primary.btn-mw.btn-animate.rounded-2');
            if (btn && !btn.disabled) {
                console.log("Unlock button found, clicking in 3s...");
                setTimeout(() => {
                    btn.click();
                }, 3000);
            }
        }

        let observer = new MutationObserver(() => {
            tryClickFirewall();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            tryClickFirewall();
        }, 5000);
    }
})();
