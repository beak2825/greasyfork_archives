// ==UserScript==
// @name         Neopets Igloo Auto Refresh with Timer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Refreshes the Igloo Garage Sale page every 10–30 seconds and shows a countdown timer on screen.
// @author       You
// @match        https://www.neopets.com/winter/igloo2.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544474/Neopets%20Igloo%20Auto%20Refresh%20with%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/544474/Neopets%20Igloo%20Auto%20Refresh%20with%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000; // 10–30 sec
    let secondsLeft = Math.floor(delay / 1000);

    // Create and style the status bar
    const statusBar = document.createElement('div');
    statusBar.textContent = `Refreshing in ${secondsLeft} seconds...`;
    statusBar.style.position = 'fixed';
    statusBar.style.top = '10px';
    statusBar.style.left = '10px';
    statusBar.style.backgroundColor = 'rgba(0,0,0,0.7)';
    statusBar.style.color = '#fff';
    statusBar.style.padding = '5px 10px';
    statusBar.style.borderRadius = '5px';
    statusBar.style.fontSize = '14px';
    statusBar.style.zIndex = '9999';
    document.body.appendChild(statusBar);

    // Update the countdown every second
    const countdown = setInterval(() => {
        secondsLeft--;
        statusBar.textContent = `Refreshing in ${secondsLeft} seconds...`;

        if (secondsLeft <= 0) {
            clearInterval(countdown);
        }
    }, 1000);

    // Reload the page after the delay
    setTimeout(() => {
        location.reload();
    }, delay);
})();
