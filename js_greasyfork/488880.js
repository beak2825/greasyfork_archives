// ==UserScript==
// @name         AutoFaucet [ Bitfaucet ex DXFaucet]
// @namespace    Terminator.Scripts
// @version      0.1-R
// @description  DXFaucet automatization
// @author       TERMINATOR
// @license      MIT
// @match        https://bitfaucet.site/*
// @match        https://scripts.cs2resellers.com/ads/?dxfaucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dxfaucet.site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488880/AutoFaucet%20%5B%20Bitfaucet%20ex%20DXFaucet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/488880/AutoFaucet%20%5B%20Bitfaucet%20ex%20DXFaucet%5D.meta.js
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
        startCountdown();
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
        var redirectTimeout = 60000 * 4;
        var startTime = new Date().getTime();
        function updateProgressBar() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var remainingTime = redirectTimeout - elapsedTime;
            var progress = (elapsedTime / redirectTimeout) * 100;
            if (remainingTime <= 0) {
                progressBar.style.width = '100%';
                window.location.href = 'https://bitfaucet.site/member/faucet';
            } else {
                progressBar.style.width = progress + '%';
                countdownElement.textContent = Math.ceil(remainingTime / 1000);
            }
        }
        setInterval(updateProgressBar, 1000);
    }
    function redirectToCustomPage() {
        window.location.href = "https://scripts.cs2resellers.com/ads/?dxfaucet";
    }
    function selectTurnstileAndClaim() {
        let turnstile = document.querySelector('input[value="turnstile"]')
        if (!turnstile) return redirectToCustomPage()
        turnstile.click();
        setTimeout(() => {
            let c = document.querySelector('.tg-btn-1.text-white')
            if (!c) return redirectToCustomPage()
            c.click();
        }, 5000);
    }
    function performActions() {
        setTimeout(selectTurnstileAndClaim, 10000);
    }
    window.addEventListener('load', function() {
        if (window.location.href.startsWith("https://bitfaucet.site")) {
            performActions();
            setInterval(() => {
                performActions();
            }, 60000);
        } else if (window.location.href.startsWith("https://scripts.cs2resellers.com/ads/?dxfaucet")) {
            addProgressBar();
        }
    });
})();
