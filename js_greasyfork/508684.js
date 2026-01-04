// ==UserScript==
// @name         Freebitco.in Auto Bet Script
// @namespace    https://freebitco.in/?r=2145996
// @version      1.0
// @description  Aumenta apostas em 89% após derrotas, retorna à aposta base após vitórias
// @author       Seu Nome
// @match        https://freebitco.in/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508684/Freebitcoin%20Auto%20Bet%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/508684/Freebitcoin%20Auto%20Bet%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let baseBet = 0.00000001;
    let currentBet = baseBet;
    let increaseMultiplier = 1.89;
    let win = false;

    function placeBet() {
        if (win) {
            currentBet = baseBet;
        } else {
            currentBet *= increaseMultiplier;
        }

        document.getElementById('double_your_btc_bet_hi_button').click();
        document.getElementById('double_your_btc_stake').value = currentBet.toFixed(8);
        document.getElementById('double_your_btc_bet_button').click();
    }

    function checkResult() {
        let lastResult = document.getElementById('double_your_btc_bet_win').style.display !== 'none';
        win = lastResult;
        placeBet();
    }

    setInterval(checkResult, 1000);

})();
