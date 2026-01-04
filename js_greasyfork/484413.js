// ==UserScript==
// @name         Auto Bet Script for iPhone, dbl tap strt stop. 
// @namespace    https://greasyfork.org/en/scripts/484413-auto-bet-script-for-iphone-dbl-tap-strt-stop
// @version      0.12
// @description  Automatically bets based on specified conditions
// @author       Goombas
// @match        https://nanogames.io/classic-dice/*
// @grant        unsafeWindow
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/484413/Auto%20Bet%20Script%20for%20iPhone%2C%20dbl%20tap%20strt%20stop.user.js
// @updateURL https://update.greasyfork.org/scripts/484413/Auto%20Bet%20Script%20for%20iPhone%2C%20dbl%20tap%20strt%20stop.meta.js
// ==/UserScript==

let running = false; // Flag for the interval
let intervalId;
let lastTapTime = 0;

function bet() {
    return cd.bet(cd.amount).then((r) => {
        if (r.profitAmount > 0) {
            clearInterval(intervalId);
            running = false;
        }
    });
}

function startInterval() {
    if (!running) {
        intervalId = setInterval(bet, 160);
        running = true;
    }
}

function stopInterval() {
    if (running) {
        clearInterval(intervalId);
        running = false;
    }
}

document.addEventListener('touchend', function () {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTapTime;

    if (timeDiff < 300 && timeDiff > 0) {
        // Double-tap detected
        if (running) {
            stopInterval();
        } else {
            const confirmed = confirm("Are you sure you want to start the script?");
            if (confirmed) {
                startInterval();
            }
        }
    }

    lastTapTime = currentTime;
});

// No need to start the interval immediately; it will only start with a double tap.