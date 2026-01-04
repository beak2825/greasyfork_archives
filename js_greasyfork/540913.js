// ==UserScript==
// @name         Auto Refresh Torn (Random Interval + Timer Display)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Refresh automat cu un interval aleatoriu între 40 și 50 de secunde și afișare timp rămas
// @author       Ovidiu
// @match        https://www.torn.com/profiles.php?XID=3580072*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540913/Auto%20Refresh%20Torn%20%28Random%20Interval%20%2B%20Timer%20Display%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540913/Auto%20Refresh%20Torn%20%28Random%20Interval%20%2B%20Timer%20Display%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function randomInterval() {
        return Math.floor(Math.random() * (50 - 40 + 1) + 40) * 1000; // Interval aleatoriu între 40 și 50 secunde
    }

    let refreshTime = randomInterval();
    let remainingSeconds = Math.floor(refreshTime / 1000);

    function updateTimerDisplay() {
        let infoElement = document.querySelector('h2.title___XfwKa');
        if (infoElement) {
            infoElement.textContent = `Information; Refresh: ${remainingSeconds}s`;
        }
    }

    // Actualizare timer la fiecare secundă
    let countdownInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateTimerDisplay();
        }
    }, 1000);

    setTimeout(() => {
        location.reload();
    }, refreshTime); // Aplică refresh după un timp aleatoriu
})();