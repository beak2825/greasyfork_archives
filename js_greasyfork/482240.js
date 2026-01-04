// ==UserScript==
// @name         Automatic Tree
// @namespace    Terminator.Scripts
// @version      0.9
// @description  Automatic Tree Claiming
// @author       TERMINATOR
// @license      MIT
// @match        https://knolix.com/*
// @match        https://ads.knolix.com/int/*
// @match        https://scripts.cs2resellers.com/ads/?automatictree
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482240/Automatic%20Tree.user.js
// @updateURL https://update.greasyfork.org/scripts/482240/Automatic%20Tree.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var email = ''; // PASTE YOUR EMAIL
    var password = ''; // PASTE YOUR PASSWORD
    var completed = false; // CHANGE TO true

    if (completed !== true) return alert("Please fill in the details in the script!")

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
        var redirectTimeout = 60000 * 10;
        var startTime = new Date().getTime();
        function updateProgressBar() {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;
            var remainingTime = redirectTimeout - elapsedTime;
            var progress = (elapsedTime / redirectTimeout) * 100;
            if (remainingTime <= 0) {
                progressBar.style.width = '100%';
                window.location.href = 'https://knolix.com/';
            } else {
                progressBar.style.width = progress + '%';
                countdownElement.textContent = Math.ceil(remainingTime / 1000);
            }
        }
        setInterval(updateProgressBar, 1000);
    }

    function clickBtctree() {
        var btctreeElement = document.getElementById('bitcoin15');
        if (btctreeElement) {
            btctreeElement.click();
        } else {
            window.location.href = 'https://knolix.com/login';
        }
    }

    function clickSkipButton() {
        var skipButtonElement = document.querySelector('a#skip_bu2tton');
        if (skipButtonElement) {
            skipButtonElement.addEventListener('click', function() {
                window.close();
            });
            skipButtonElement.click().then(() => { window.close() });
        }
    }
    window.addEventListener('load', function() {
        if (window.location.href.startsWith("https://knolix.com/ref") || window.location.href.startsWith("https://knolix.com/convert")) {
            return;
        } else if (window.location.href.startsWith('https://scripts.cs2resellers.com/ads/?automatictree')) {
            addProgressBar();
            startCountdown();
        } else if (window.location.href.startsWith('https://knolix.com/login')) {
            document.getElementsByName('user')[0].value = email;
            document.getElementsByName('pass')[0].value = password;
            setTimeout(() => {
                document.getElementsByName('submit_login')[0].click();
            }, 5000 * 2);
        } else if (window.location.href.startsWith('https://knolix.com/harvest.php?reward_token=')) {
            window.location.href = 'https://scripts.cs2resellers.com/ads/?automatictree';
        } else if (window.location.href.startsWith('https://ads.knolix.com/int/')) {
            setInterval(() => {
                clickSkipButton();
            }, 5000);
        } else if (window.location.href.startsWith('https://knolix.com/')) {
            //clickBtctree();
            setInterval(() => {
                clickBtctree();
            }, 5000);
        }
    });
})();
