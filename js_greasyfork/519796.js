// ==UserScript==
// @name        Wager Left
// @namespace   Violentmonkey Scripts
// @match       https://stake.com/*
// @match       https://stake.ac/*
// @match       https://stake.games/*
// @match       https://stake.bet/*
// @match       https://stake.pet/*
// @match       https://stake1001.com/*
// @match       https://stake1002.com/*
// @match       https://stake1003.com/*
// @match       https://stake1021.com/*
// @match       https://stake1022.com/*
// @match       https://stake.mba/*
// @match       https://stake.jp/*
// @match       https://stake.bz/*
// @match       https://staketr.com/*
// @match       https://stake.ceo/*
// @match       https://stake.krd/*
// @grant       none
// @version     1.1
// @author      ConnorMcLeod
// @description 05/12/2024 00:00:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519796/Wager%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/519796/Wager%20Left.meta.js
// ==/UserScript==

const ranksWager = {
    "Bronze":       10000,
    "Silver":       40000,
    "Argent":       40000,
    "Gold":         50000,
    "Or":           50000,

    "Platinum":     150000,
    "Platine":      150000,
    "Platinum II":  250000,
    "Platine II":   250000,
    "Platinum III": 500000,
    "Platine III":  500000,

    "Platinum IV":  1500000,
    "Platine IV":   1500000,
    "Platinum V":   2500000,
    "Platine V":    2500000,
    "Platinum VI":  5000000,
    "Platine VI":   5000000,

    "Diamond":      15000000,
    "Diamant":      15000000,
    "Diamond II":   25000000,
    "Diamant II":   25000000,
    "Diamond III":  50000000,
    "Diamant III":  50000000,

    "Diamond IV":   150000000,
    "Diamant IV":   150000000,
    "Diamond V":    250000000,
    "Diamant V":    250000000,
    "Obsidian":     500000000,

    "Obsidian II":  1500000000,
    "Opal I":       2500000000,
    "Opal II":      5000000000,

    "Plutonium":    15000000000,
};

let timeout = null;
const removeTimeOut = (() => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
});

function checkProgressBars(delay) {
    removeTimeOut();
    timeout = setTimeout(function() {
        removeTimeOut();
        progressBars = Array.from(document.querySelectorAll('[data-melt-progress=""')).filter(e => !e.parentNode.classList.contains("raffle-progress"));
        // console.log(`PROGRESS BARS : ${progressBars.length}`);
        progressBars.forEach(progressBar => {
            let span = progressBar.parentNode.querySelector('span[id="wagerLeft"]');

            ranks = progressBar.nextElementSibling;
            if (ranks) {
                szNextRank = ranks.innerText.split('\n')[1];
                if (!(szNextRank in ranksWager)) {
                    return;
                }
                wagerLeft = ranksWager[szNextRank] * (1 - progressBar.ariaValueNow / 100);
                szWagerLeft = wagerLeft.toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'USD'
                }).replace(/\s/, ' ');

                if (!span) {
                    div = document.createElement('div');
                    span = document.createElement('span');
                    span.id = "wagerLeft";
                    div.appendChild(span);
                    progressBar.parentNode.appendChild(div);
                }
                span.innerText = `Wager left : ${szWagerLeft}`;
            }
        });
    }, delay);
}

(function(history) {
    var pushState = history.pushState;
    history.pushState = function(state) {
        // Appelez la méthode pushState originale
        pushState.apply(history, arguments);
        // Déclenchez un événement personnalisé ou loggez l'URL
        // console.log('Navigation via pushState vers :', window.location.href);
        checkProgressBars(500);
    };

    var replaceState = history.replaceState;
    history.replaceState = function(state) {
        replaceState.apply(history, arguments);
        // console.log('Navigation via replaceState vers :', window.location.href);
        checkProgressBars(500);
    };
})(window.history);

window.onload = (() => {
    // console.log('[window.onload] :', window.location.href);
    checkProgressBars(1000);
});