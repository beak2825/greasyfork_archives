// ==UserScript==
// @name         Claimfreetrx Online
// @namespace    Terminator.Scripts
// @version      0.2
// @description  try to take over the world!
// @author       TERMINATOR
// @license      MIT
// @match        https://claimfreetrx.online/*
// @match        https://scripts.cs2resellers.com/ads/?claimfreetrx.online
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimfreetrx.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486010/Claimfreetrx%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/486010/Claimfreetrx%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addProgressBar() {
        var progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.height = '5px';
        progressBar.style.width = '0';
        progressBar.style.backgroundColor = 'blue';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.zIndex = '9999';
        document.body.appendChild(progressBar);
    }
    function startCountdown() {
        var progressBar = document.getElementById('progress-bar');
        var countdownElement = document.createElement('div');
        countdownElement.id = 'countdown';
        countdownElement.style.position = 'fixed';
        countdownElement.style.top = '5px';
        countdownElement.style.left = '50%';
        countdownElement.style.transform = 'translateX(-50%)';
        countdownElement.style.color = 'white';
        countdownElement.style.fontSize = '12px';
        countdownElement.style.zIndex = '9999';
        document.body.appendChild(countdownElement);
        var redirectTimeout = 20000;
        var startTime = new Date().getTime();
        function updateProgressBar() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var remainingTime = redirectTimeout - elapsedTime;
            var progress = (elapsedTime / redirectTimeout) * 100;
            if (remainingTime <= 0) {
                progressBar.style.width = '100%';
                window.location.href = 'https://claimfreetrx.online/faucet/currency/trx';
            } else {
                progressBar.style.width = progress + '%';
                countdownElement.textContent = Math.ceil(remainingTime / 1000);
            }
        }
        setInterval(updateProgressBar, 1000);
    }
    function handleCaptchaAndSubmit() {
        setTimeout(function() {
            document.getElementById("fauform").submit();
        }, 3000);
    }
    function redirectToNextCoin() {
        switch (window.location.href) {
            case "https://claimfreetrx.online/faucet/currency/trx":
                window.location.replace("https://claimfreetrx.online/faucet/currency/ltc");
                break;
            case "https://claimfreetrx.online/faucet/currency/ltc":
                window.location.replace("https://claimfreetrx.online/faucet/currency/bnb");
                break;
            case "https://claimfreetrx.online/faucet/currency/bnb":
                window.location.replace("https://claimfreetrx.online/faucet/currency/bch");
                break;
            case "https://claimfreetrx.online/faucet/currency/bch":
                window.location.replace("https://claimfreetrx.online/faucet/currency/doge");
                break;
            case "https://claimfreetrx.online/faucet/currency/doge":
                window.location.replace("https://claimfreetrx.online/faucet/currency/dgb");
                break;
            case "https://claimfreetrx.online/faucet/currency/dgb":
                window.location.replace("https://claimfreetrx.online/faucet/currency/eth");
                break;
            case "https://claimfreetrx.online/faucet/currency/eth":
                window.location.replace("https://claimfreetrx.online/faucet/currency/fey");
                break;
            case "https://claimfreetrx.online/faucet/currency/fey":
                window.location.replace("https://claimfreetrx.online/faucet/currency/matic");
                break;
            case "https://claimfreetrx.online/faucet/currency/matic":
                window.location.replace("https://claimfreetrx.online/faucet/currency/sol");
                break;
            case "https://claimfreetrx.online/faucet/currency/sol":
                window.location.replace("https://scripts.cs2resellers.com/ads/?claimfreetrx.online");
                break;
            case "https://scripts.cs2resellers.com/ads/?claimfreetrx.online":
                window.location.replace("https://claimfreetrx.online/faucet/currency/trx");
                break;
            default:
                window.location.replace("https://claimfreetrx.online/faucet/currency/trx");
        }
    }
    function clickClaimNow() {
        var claimButton = document.getElementById('subbutt');
        if (claimButton) {
            var progressBar = document.querySelector('.progress-bar.bg-success');
            if (!progressBar) return redirectToNextCoin();
            claimButton.click();
            handleCaptchaAndSubmit();
        } else if (window.location.href.includes("https://claimfreetrx.online/firewall")) {
            waitForCaptchaAndUnlock();
        } else if (window.location.href.includes("https://claimfreetrx.online")) {
            redirectToNextCoin();
        } else if (window.location.href.includes("https://scripts.cs2resellers.com/ads/?claimfreetrx.online")) {
            addProgressBar();
            startCountdown();
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
