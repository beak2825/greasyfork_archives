// ==UserScript==
// @name         Freebitco.in Low balance MULTIPLY BTC Script 2019
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  To support please register on my free bitco.in reffer https://freebitco.in/?r=3645185
// @author       BoboLordOfDark
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/385852/Freebitcoin%20Low%20balance%20MULTIPLY%20BTC%20Script%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/385852/Freebitcoin%20Low%20balance%20MULTIPLY%20BTC%20Script%202019.meta.js
// ==/UserScript==

bconfig = {
//Change Bet valor to increase your bet
maxBet: 0.000001,
wait: 1000,
autoexit: 0.0001,
want: 0.000014,
toggleHilo:false,
startbal: 0,
won: 0,
};
hilo = 'hi';
multiplier = 1;
rollDice = function() {

if ($('#double_your_btc_bet_lose').html() !== '') {
$('#double_your_btc_2x').click();
multiplier++;
if(bconfig.toggleHilo)toggleHiLo();
} else {
$('#double_your_btc_min').click();
multiplier = 1;
}

if (parseFloat($('#balance').html()) < (parseFloat($('#double_your_btc_stake').val()) * 2) ||
parseFloat($('#double_your_btc_stake').val()) > bconfig.maxBet) {
$('#double_your_btc_min').click();
}

$('#double_your_btc_bet_' + hilo + '_button').click();

setTimeout(rollDice, (multiplier * bconfig.wait) + Math.round(Math.random() * 100));
};

toggleHiLo = function() {
if (hilo === 'lo') {
hilo = 'lo';
} else {
hilo = 'lo';
}
};

rollDice();
