// ==UserScript==
// @name         Freebitco.in Auto Bet Script
// @namespace    https://freebitco.in/?r=2145996
// @version      2.0
// @description  Script para apostas automáticas no Freebitco.in com incremento de 6% até atingir um lucro mínimo de 0.00000001 BTC
// @author       SeuNome
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509121/Freebitcoin%20Auto%20Bet%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/509121/Freebitcoin%20Auto%20Bet%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var baseBet = 0.00000100;
    var currentBet = baseBet;
    var profitTarget = 0.00000001;
    var maxBet = 20;
    var odds = 2.00;
    var increasePercent = 0.06;
    var profit = 0;

    function setBetAmount(amount) {
        document.getElementById('bet_amount').value = amount.toFixed(8);
    }

    function betHi() {
        document.getElementById('bet_hi_button').click();
    }

    function checkWin() {
        return document.getElementById('double_your_btc_bet_win').style.display !== 'none';
    }

    function calculateNextBet(win) {
        if (win) {
            currentBet = currentBet * (1 + increasePercent);
        } else {
            currentBet = currentBet * (1 + increasePercent);
        }

        if (currentBet > maxBet) {
            currentBet = baseBet;
        }
    }

    function placeBet() {
        setBetAmount(currentBet);
        betHi();

        setTimeout(function() {
            var win = checkWin();
            var balance = parseFloat(document.getElementById('balance').innerText);

            if (win) {
                profit += currentBet * (odds - 1);
            } else {
                profit -= currentBet;
            }

            if (profit >= profitTarget) {
                currentBet = baseBet;
                profit = 0;
            } else {
                calculateNextBet(win);
            }

        }, 1000);
    }

    setInterval(placeBet, 1000);
})();
