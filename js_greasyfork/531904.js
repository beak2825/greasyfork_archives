// ==UserScript==
// @name         https://faucet-sol.com/dashboard
// @namespace    http://tampermonkey.net/
// @version      2025-04-03
// @description  Зарабатывайте 0,00000045 SOL в минуту, награды будут приходить автоматически!
// @author       Danik Odze
// @match        https://faucet-sol.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucet-sol.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531904/https%3Afaucet-solcomdashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/531904/https%3Afaucet-solcomdashboard.meta.js
// ==/UserScript==
// установите скрипт https://greasyfork.org/ru/scripts/387937-ultra-popup-blocker
(function() {
    'use strict';

    setTimeout(function() {
		console.log('прошла минута');
		window.location.reload();
	}, 1200*60);
var startButton = document.createElement('captcha');
startButton.style.position = 'fixed';
startButton.style.top = '100px';
startButton.style.right = '0px';
startButton.style.color = 'red';
document.body.appendChild(startButton);
    let countdown = 60;
    const timerInterval = setInterval(function() {
    countdown--;
    if (countdown <= 0) {
    startButton.innerHTML = 'Refresh......';
    clearInterval(timerInterval);
    } else {
    const countdownText = document.createTextNode(` Wait for ${countdown} seconds`);
    startButton.innerHTML = '';
    startButton.appendChild(countdownText);
    }
    }, 1000);
})();