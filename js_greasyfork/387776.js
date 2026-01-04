// ==UserScript==
// @name         BL R9.75 BJ Script 2.0
// @namespace    Bootleggers R9.75
// @version      0.0.13
// @description  Automate BJ
// @author       BD
// @match        https://www.bootleggers.us/blackjack.php
// @update       https://greasyfork.org/scripts/387776-bl-r9-75-bj-script-2-0/code/BL%20R975%20BJ%20Script%2020.user.js
// @downloadURL https://update.greasyfork.org/scripts/387776/BL%20R975%20BJ%20Script%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/387776/BL%20R975%20BJ%20Script%2020.meta.js
// ==/UserScript==

var betButton;
var betButtonPresent;
var noInsuranceButton;
var noInsuranceButtonPresent;
var dealersHand;
var playersHand;
var result;
var blackjack;
var playersCardsSoftOrHard;
var action;
var OutOfMoney;
var ConsecutiveLosses = 0;
var HighestConsecutiveLosses = 0;
var StartButton = document.createElement('center');
StartButton.innerHTML = "<input id='playbtn' type='button' value='Start Playing!'></input><br>";
document.getElementsByClassName('BL-casino-table')[0].parentNode.insertBefore(StartButton, document.getElementsByClassName('BL-casino-table')[0]);
var bjTimer;
var ogBet;
var currentBet;
var maxBet = document.querySelectorAll('[data-area="max_bet"]')[0].innerText.replace(/[$,]/g, "");//4;
var maxBetPct = 0.015625;//0.03125
var maxBetsLost = 0;
document.querySelectorAll('[name="amount"]')[0].value = Math.floor(maxBet*maxBetPct);//1;

document.getElementById('playbtn').addEventListener('click', function() {
    if (document.getElementById('playbtn').value == 'Start Playing!') {
        ogBet = document.querySelectorAll('[name="amount"]')[0].value;
        bjTimer = setInterval(RunScript, 1000);
        document.getElementById('playbtn').value = 'Stop Playing!';
    } else {
        clearInterval(bjTimer);
        document.getElementById('playbtn').value = 'Start Playing!';
        alert('Highest consecutive losses: ' + HighestConsecutiveLosses);
        ConsecutiveLosses = 0;
        HighestConsecutiveLosses = 0;
    }
});

function RunScript() {
    betButton = document.querySelectorAll('[value="Bet!"]')[0];
    betButtonPresent = betButton.clientHeight > 0;
    noInsuranceButton = document.querySelectorAll('[data-action="no-insurance"]')[0];
    noInsuranceButtonPresent = noInsuranceButton.clientHeight > 0;
    dealersHand = document.getElementsByClassName('value')[0] ? document.getElementsByClassName('value')[0].textContent : null;
    playersHand = document.getElementsByClassName('value')[1] ? document.getElementsByClassName('value')[1].textContent : null;
    result = betButtonPresent ? document.getElementsByClassName('win').length == 1 ? 'win' : document.getElementsByClassName('loss').length == 1 ? 'loss' : document.getElementsByClassName('push').length == 1 ? 'push' : 'start script' : null;
    playersCardsSoftOrHard = playersHand ? playersHand.includes('/') ? 'soft' : 'hard' : null;

    if (betButtonPresent) {
        currentBet = document.querySelectorAll('[name="amount"]')[0].value;
        OutOfMoney = document.getElementsByClassName('BL-result-message error')[0] ? document.getElementsByClassName('BL-result-message error')[0].textContent.includes('You do not have that much money.') : false;
        if (OutOfMoney) {
            clearInterval(bjTimer);
            document.getElementById('playbtn').value = 'Start Playing!';
            alert('Highest consecutive losses: ' + HighestConsecutiveLosses);
            ConsecutiveLosses = 0;
            HighestConsecutiveLosses = 0;
        } else if (result == 'win') {
            ConsecutiveLosses = 0;
            if (currentBet >= (maxBet * 0.95)) {
                blackjack = playersHand == '21' && document.getElementsByClassName('player')[0].getElementsByClassName('card-wrapper').length == 2;
                maxBetsLost = maxBetsLost == 0 ? 0 : blackjack ? maxBetsLost - 1.5 : maxBetsLost - 1;
            }
            if (maxBetsLost <= 0) {
                maxBetsLost = 0;
                document.querySelectorAll('[name="amount"]')[0].value = ogBet;
            } else if (maxBetsLost == 0.5) {
                document.querySelectorAll('[name="amount"]')[0].value = Math.ceil(maxBet / 2);
            } else {
                document.querySelectorAll('[name="amount"]')[0].value = maxBet;
            }
            betButton.click();
            console.log('win');
        } else if (result == 'loss') {
            ConsecutiveLosses++;
            ConsecutiveLosses > HighestConsecutiveLosses ? HighestConsecutiveLosses = ConsecutiveLosses : null;
            if (currentBet >= (maxBet * 0.95)) {
                maxBetsLost = maxBetsLost == 0 ? maxBetsLost + 2 : maxBetsLost + 1;
            } else if (currentBet * 2 >= maxBet) {
                document.querySelectorAll('[name="amount"]')[0].value = maxBet;
            } else {
                maxBetsLost = maxBetsLost == 0.5 ? maxBetsLost + 0.5 : maxBetsLost;
                document.querySelectorAll('[name="amount"]')[0].value = currentBet * 2;
            }
            betButton.click();
            console.log('loss');
        } else if (result == 'push') {
            betButton.click();
            console.log('push');
        } else if (result == 'start script') {
            betButton.click();
            console.log('script started');
        }
    } else if (noInsuranceButtonPresent) {
        noInsuranceButton.click();
    } else {
        if (playersCardsSoftOrHard == 'hard') {
            var FOURtoEIGHT = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var NINE = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var TEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var ELEVEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var TWELVE = { 2:'hit', 3:'hit', 4:'stand', 5:'stand', 6:'stand', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var THIRTEEN = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var FOURTEEN = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var FIFTEEN = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var SIXTEEN = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var SEVENTEENPLUS = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'stand', 8:'stand', 9:'stand', 10:'stand', 11:'stand' };
            if ((playersHand >= 4) && (playersHand <= 8)) {
                action = FOURtoEIGHT[dealersHand];
            } else if (playersHand == 9) {
                action = NINE[dealersHand];
            } else if (playersHand == 10) {
                action = TEN[dealersHand];
            } else if (playersHand == 11) {
                action = ELEVEN[dealersHand];
            } else if (playersHand == 12) {
                action = TWELVE[dealersHand];
            } else if (playersHand == 13) {
                action = THIRTEEN[dealersHand];
            } else if (playersHand == 14) {
                action = FOURTEEN[dealersHand];
            } else if (playersHand == 15) {
                action = FIFTEEN[dealersHand];
            } else if (playersHand == 16) {
                action = SIXTEEN[dealersHand];
            } else if (playersHand >= 17) {
                action = SEVENTEENPLUS[dealersHand];
            }
        } else if (playersCardsSoftOrHard == 'soft') {
            playersHand = playersHand.split('/')[1];
            var TWELVE = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var THIRTEEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var FOURTEEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var FIFTEEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var SIXTEEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var SEVENTEEN = { 2:'hit', 3:'hit', 4:'hit', 5:'hit', 6:'hit', 7:'hit', 8:'hit', 9:'hit', 10:'hit', 11:'hit' };
            var EIGHTEEN = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'stand', 8:'stand', 9:'hit', 10:'hit', 11:'hit' };
            var NINETEENPLUS = { 2:'stand', 3:'stand', 4:'stand', 5:'stand', 6:'stand', 7:'stand', 8:'stand', 9:'stand', 10:'stand', 11:'stand' };
            if (playersHand == 12) {
                action = TWELVE[dealersHand];
            } else if (playersHand == 13) {
                action = THIRTEEN[dealersHand];
            } else if (playersHand == 14) {
                action = FOURTEEN[dealersHand];
            } else if (playersHand == 15) {
                action = FIFTEEN[dealersHand];
            } else if (playersHand == 16) {
                action = SIXTEEN[dealersHand];
            } else if (playersHand == 17) {
                action = SEVENTEEN[dealersHand];
            } else if (playersHand == 18) {
                action = EIGHTEEN[dealersHand];
            } else if (playersHand >= 19) {
                action = NINETEENPLUS[dealersHand];
            }
        }
        if (action) {
            document.querySelectorAll('[data-action="' + action + '"]')[0].click();
        }
    }
}