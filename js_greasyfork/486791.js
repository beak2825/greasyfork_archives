// ==UserScript==
// @name         BNBfe - Every Hour Claimer
// @namespace    Terminator.Scripts
// @version      0.1
// @description  This script only clicks on "Every Hour" which adds 30 TH/s
// @author       TERMINATOR
// @license      MIT
// @match        https://bnbfe.com/*
// @match        https://scripts.cs2resellers.com/ads/?freebnbtwaitingtime
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bnbfe.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486791/BNBfe%20-%20Every%20Hour%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/486791/BNBfe%20-%20Every%20Hour%20Claimer.meta.js
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
    function startCountdown(url) {
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
        var redirectTimeout = 30000;
        var startTime = new Date().getTime();
        function updateProgressBar() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var remainingTime = redirectTimeout - elapsedTime;
            var progress = (elapsedTime / redirectTimeout) * 100;
            if (remainingTime <= 0) {
                progressBar.style.width = '100%';
                window.location.href = url;
            } else {
                progressBar.style.width = progress + '%';
                countdownElement.textContent = Math.ceil(remainingTime / 1000);
            }
        }
        setInterval(updateProgressBar, 1000);
    }
    window.addEventListener('load', function() {
        if (window.location.href.startsWith("https://bnbfe.com/dashboard")) {
            setInterval(() => {
                var everyHour = document.querySelector('a.btn.btn-sm.btn-outline-success[href="https://bnbfe.com/rewards/3/click"]');
                if (everyHour) {
                    everyHour.click();
                    setTimeout(() => {
                        window.location.href = "https://scripts.cs2resellers.com/ads/?freebnbtwaitingtime";
                    }, 5000);
                } else {
                    window.location.reload();
                }
            }, 30000);
        } else if (window.location.href.startsWith("https://scripts.cs2resellers.com/ads/?freebnbtwaitingtime")) {
            addProgressBar();
            setTimeout(() => {
                startCountdown('https://bnbfe.com/dashboard');
            }, 2000);
        }
    });
})();
