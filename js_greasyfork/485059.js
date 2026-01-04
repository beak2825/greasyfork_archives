// ==UserScript==
// @name         Free NANO
// @namespace    Terminator.Scripts
// @version      0.3
// @description  Free XNO
// @author       TERMINATOR
// @license      MIT
// @match        https://freenanofaucet.com/*
// @match        https://scripts.cs2resellers.com/ads/?xnomint
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freenanofaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485059/Free%20NANO.user.js
// @updateURL https://update.greasyfork.org/scripts/485059/Free%20NANO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var nanoAddress = "nano_1iir73i8xxsakozai19kqkcjftrrikw1qr867hrfraznwm67simpxpjkqb7u";


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
        var redirectTimeout = 60000 * 6;
        var startTime = new Date().getTime();
        function updateProgressBar() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var remainingTime = redirectTimeout - elapsedTime;
            var progress = (elapsedTime / redirectTimeout) * 100;
            if (remainingTime <= 0) {
                progressBar.style.width = '100%';
                window.location.href = 'https://freenanofaucet.com/faucet';
            } else {
                progressBar.style.width = progress + '%';
                countdownElement.textContent = Math.ceil(remainingTime / 1000);
            }
        }
        setInterval(updateProgressBar, 1000);
    }
    function loaded() {
        if (window.location.href.startsWith("https://scripts.cs2resellers.com/ads/?xnomint")) {
            addProgressBar();
            startCountdown();
        } else {
            setInterval(() => {
                var nanoAddrInput = document.getElementById('nanoAddr');
                if (nanoAddrInput) {
                    nanoAddrInput.value = nanoAddress;
                    var inputElement = document.querySelector('input[value="Get Nano!"]');
                    if (inputElement) {
                        setTimeout(() => {
                            inputElement.parentNode.submit(); // Odeslat formulář, ke kterému input patří
                        }, 5000);
                    } else {
                        window.location.href = "https://scripts.cs2resellers.com/ads/?xnomint";
                    }

                } else {
                    window.location.href = "https://scripts.cs2resellers.com/ads/?xnomint";
                }
            }, 15000);
        }
    }

    window.addEventListener('load', function() {
        loaded();
    });
})();
