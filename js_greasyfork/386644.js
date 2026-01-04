// ==UserScript==
// @name         Slots win/loss tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.30
// @description  Tracks and displays the number of wins/losses while playing slots
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/loader.php?sid=slots
// @source       https://greasyfork.org/en/scripts/386644-slots-win-loss-tracker
// @downloadURL https://update.greasyfork.org/scripts/386644/Slots%20winloss%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/386644/Slots%20winloss%20tracker.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    let slotSpin = {
        betAmount: 0,
        winAmount: 0,
        totalMoneyWon: 0,
        totalMoneyLost: 0,
        spinsSinceLastWin: 0,
        spinStartTokens: 0,
        lastMoneyWon: 0,
        tokens: 0
    };

    function ensureNumber(inpString) {
        let tmpNum = parseInt(inpString, 10);
        tmpNum = isNaN(tmpNum) ? 0 : Math.max(tmpNum, 0);
        return tmpNum;
    }

    function btnClicked() {
        let classList = this.classList;
        slotSpin.spinStartTokens = document.querySelector('#tokens').innerText.replace(/,/g, '');
        console.log("start tokens:");
        console.log(slotSpin.spinStartTokens);
        classList.forEach(function(cls) {
            switch (cls) {
                case "betbtn":
                    break;
                case "btn-10":
                    slotSpin.betAmount = 10;
                    break;
                case "btn-100":
                    slotSpin.betAmount = 100;
                    break;
                case "btn-1k":
                    slotSpin.betAmount = 1000;
                    break;
                case "btn-10k":
                    slotSpin.betAmount = 10000;
                    break;
                case "btn-100k":
                    slotSpin.betAmount = 100000;
                    break;
                case "btn-1m":
                    slotSpin.betAmount = 1000000;
                    break;
                case "btn-10m":
                    slotSpin.betAmount = 10000000;
                    break;
                default:
                    console.log("Bet amount error!");
                    console.log(cls);
                    break;
            }
        });
    }

    function resetSpin() {
        if (slotSpin.tokens === currentTokens) {

        }

        // console.log("Tokens:");
        // console.log(slotSpin.tokens);
        // console.log("Bet Amount:");
        // console.log(slotSpin.betAmount);
        // console.log("Win Amount:");
        // console.log(slotSpin.winAmount);

        // if (slotSpin.winAmount == 0) {
        //     slotSpin.totalMoneyLost += slotSpin.betAmount;
        //     slotSpin.spinsSinceLastWin += 1;
        // } else {
        //     slotSpin.totalMoneyWon = slotSpin.totalMoneyWon + slotSpin.winAmount;
        //     slotSpin.spinsSinceLastWin = 0;
        // }

        // console.log("totalMoneyWon");
        // console.log(slotSpin.totalMoneyWon);
        // console.log("totalMoneyLost");
        // console.log(slotSpin.totalMoneyLost);
        // console.log("spinsSinceLastWin");
        // console.log(slotSpin.spinsSinceLastWin);

        slotSpin.betAmount = 0;
        slotSpin.winAmount = 0;
    }

    let playerIntervalId = setInterval(lookForPlayer, 500);

    function lookForPlayer() {
        let gameResult = document.querySelector('#gameResult');
        let btnList  = document.querySelectorAll('.betbtn');

        if (gameResult && btnList.length > 0) {
            btnList.forEach(function(btn) {
                btn.addEventListener("click", btnClicked, false);
            });
            startObserver(gameResult);
            clearInterval(playerIntervalId);
        }
    }

    function processMutations(mutations) {
        for (let index = mutations.length - 1; index > 0; index--) {
            console.log("****************************************************************************************");
            let mutation = mutations[index];
            console.log(mutation);
            
            if (mutation.addedNodes.Length === 0) {
                console.log("skipped");
                return;
            }
            
            if (mutation.target.id === "moneyWon") {
                slotSpin.lastMoneyWon = ensureNumber(mutation.target.textContent.replace(/,/g, ''));
                console.log("Money Won:");
                console.log(slotSpin.lastMoneyWon);

                if (slotSpin.lastMoneyWon === 0 && slotSpin.tokens !== slotSpin.spinStartTokens) {
                    slotSpin.spinsSinceLastWin = 0;
                    slotSpin.spinStartTokens = slotSpin.tokens;
                } else {

                }
                break;
            }
        }

        resetSpin();
    }

    function startObserver(gameResult) {
        let observer = new MutationObserver(function(mutations) {
            slotSpin.tokens = ensureNumber(document.querySelector('#tokens').innerText.replace(/,/g, ''));
            console.log("current tokens:");
            console.log(slotSpin.tokens);
            slotSpin.lastMoneyWon = ensureNumber(document.querySelector('#moneyWon').innerText.replace(/,/g, ''));
            console.log("money won:");
            console.log(slotSpin.lastMoneyWon);
        });
        let config = { childList: true, subtree: true };
        observer.observe(gameResult, config);
    }
})();