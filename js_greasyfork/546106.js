// ==UserScript==
// @name         ClaimCoin Auto Faucet Collector Fully Automatic
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fully automatic ClaimCoin faucet collector with reCAPTCHA v3 validation detection.
// @author       Rubystance
// @license      MIT
// @match        https://claimcoin.in/dashboard*
// @match        https://claimcoin.in/faucet*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546106/ClaimCoin%20Auto%20Faucet%20Collector%20Fully%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/546106/ClaimCoin%20Auto%20Faucet%20Collector%20Fully%20Automatic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clicked = false;

    const goToFaucetFromDashboard = () => {
        const faucetLink = document.querySelector('a[href="/faucet"].waves-effect, a[href="https://claimcoin.in/faucet"].waves-effect');
        if (faucetLink) {
            console.log("[ClaimCoin Auto] Found 'Manual Faucet' link. Navigating...");
            faucetLink.click();
        } else {
            console.log("[ClaimCoin Auto] 'Manual Faucet' link not found. Retrying in 2 seconds...");
            setTimeout(goToFaucetFromDashboard, 2000);
        }
    };

    const clickClaimButton = () => {
        if (clicked) return;
        const button = document.querySelector('button.claim-button');
        if (button && !button.disabled && button.offsetParent !== null) {
            clicked = true;
            console.log("[ClaimCoin Auto] reCAPTCHA validated. Waiting 3 seconds before clicking...");

            setTimeout(() => {
                console.log("[ClaimCoin Auto] Clicking 'Collect your reward' now...");
                button.click();

                const form = button.closest("form");
                if (form) {
                    setTimeout(() => {
                        console.log("[ClaimCoin Auto] Forcing form submit...");
                        form.submit();

                        setTimeout(() => {
                            console.log("[ClaimCoin Auto] Returning to dashboard...");
                            window.location.href = "/dashboard";
                        }, 2000);
                    }, 2000);
                }
            }, 3000);
        }
    };

    const waitForButtonEnabled = () => {
        const button = document.querySelector('button.claim-button');
        if (!button) {
            console.log("[ClaimCoin Auto] Waiting for 'Collect your reward' button...");
            setTimeout(waitForButtonEnabled, 3000);
            return;
        }

        if (!button.disabled && button.offsetParent !== null) {
            clickClaimButton();
        } else {
            console.log("[ClaimCoin Auto] Button still disabled, waiting for reCAPTCHA v3 validation...");
            setTimeout(waitForButtonEnabled, 3000);
        }
    };

    const currentPath = window.location.pathname;

    if (currentPath === "/dashboard") {
        console.log("[ClaimCoin Auto] On dashboard. Looking for faucet link...");
        goToFaucetFromDashboard();
    } else if (currentPath === "/faucet") {
        console.log("[ClaimCoin Auto] On faucet page. Waiting for reCAPTCHA v3 validation...");
        clicked = false;
        waitForButtonEnabled();
    }

})();
