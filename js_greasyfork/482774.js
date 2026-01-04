// ==UserScript==
// @name         Autofaucet.top
// @namespace    Terminator.Scripts
// @version      0.4
// @description  Loop   The editing was done by weakhands
// @author       TERMINATOR
// @license      MIT
// @match        https://autofaucet.top/*
// @match        https://scripts.cs2resellers.com/ads/?autofaucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autofaucet.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482774/Autofaucettop.user.js
// @updateURL https://update.greasyfork.org/scripts/482774/Autofaucettop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleCaptchaAndSubmit() {
        setTimeout(function() {
            document.getElementById("fauform").submit();
        }, 3000);
    }
    function redirectToNextCoin() {
        switch (window.location.href) {
            case "https://autofaucet.top/faucet/currency/trx":
                window.location.replace("https://autofaucet.top/faucet/currency/ltc");
                break;
            case "https://autofaucet.top/faucet/currency/ltc":
                window.location.replace("https://autofaucet.top/faucet/currency/doge");
                break;
            case "https://autofaucet.top/faucet/currency/doge":
                window.location.replace("https://autofaucet.top/faucet/currency/matic");
                break;
            case "https://autofaucet.top/faucet/currency/matic":
                window.location.replace("https://autofaucet.top/faucet/currency/ton");
                break;
            case "https://autofaucet.top/faucet/currency/ton":
                window.location.replace("https://autofaucet.top/faucet/currency/sol");
                break;
            case "https://autofaucet.top/faucet/currency/sol":
                window.location.replace("https://scripts.cs2resellers.com/ads/?autofaucet");
                break;
            case "https://scripts.cs2resellers.com/ads/?autofaucet":
                window.location.replace("https://autofaucet.top/faucet/currency/trx");
                break;
            default:
                window.location.replace("https://autofaucet.top/faucet/currency/trx");
        }
    }
    function clickClaimNow() {
        var claimButton = document.getElementById('subbutt');
        if (claimButton) {
            var progressBar = document.querySelector('.progress-bar.bg-success');
            if (!progressBar) return redirectToNextCoin();
            claimButton.click();
            handleCaptchaAndSubmit();
        } else if (window.location.href.includes("https://autofaucet.top/firewall")) {
            waitForCaptchaAndUnlock();
        } else if (window.location.href.includes("https://autofaucet.top")) {
            redirectToNextCoin();
        } else if (window.location.href.includes("https://scripts.cs2resellers.com/ads/?autofaucet")) {
            setTimeout(() => {
                window.location.replace("https://autofaucet.top/faucet/currency/trx")
            }, 20000)
        }
    }
    function waitForCaptchaAndUnlock() {
        var unlockButton = document.querySelector('.btn.btn-primary.w-md');
        if (unlockButton) {
            console.log('Captcha solved. Clicking Unlock button.');
            unlockButton.click();
        } else {
            setTimeout(waitForCaptchaAndUnlock, 1000);
        }
    }
    setInterval(function() {
        clickClaimNow();
    }, 10000);
})();