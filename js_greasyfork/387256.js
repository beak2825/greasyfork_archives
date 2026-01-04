// ==UserScript==
// @name         Freebitco.in Rollbot Script 2019
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  To support please register on my free bitco.in reffer https://freebitco.in/?r=3645185
// @author       BoboLordOfDark
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387256/Freebitcoin%20Rollbot%20Script%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/387256/Freebitcoin%20Rollbot%20Script%202019.meta.js
// ==/UserScript==


bconfig = {
//Change Bet valor to increase your bet
Bet: 0.0000001,
maxBet: 0.0004200,
wait: 3000,
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
multiplier = 1;
if(bconfig.toggleHilo)toggleHiLo();
} else {
document.getElementById("double_your_btc_stake").value = bconfig.Bet;
multiplier = 1;
}
if (parseFloat($('#balance').html()) < (parseFloat($('#double_your_btc_stake').val()) * 2) ||
parseFloat($('#double_your_btc_stake').val()) > bconfig.maxBet) {
console.log($('#double_your_btc_min'));
}
if (parseFloat($('#balance').html()) < bconfig.autoexit) {
throw "exit";
}
if (parseFloat($('#balance').html()) > bconfig.want) {
var num = parseFloat($('#balance').html());
bconfig.want = num + 0.00000030;
bconfig.autoexit = num - 0.00000420;
bconfig.won++;
var total = num - bconfig.startbal;
console.log('Setting bconfig want to: ' + bconfig.want)
console.log('Setting autoexit to: ' + bconfig.autoexit)
console.log('Total won: ' + total + ' BTC')
}
$('#double_your_btc_bet_hi_button').click();
setTimeout(rollDice, (multiplier * bconfig.wait) + Math.round(Math.random() * 1000));
};
toggleHiLo = function() {
if (hilo === 'hi') {
hilo = 'hi';
} else {
hilo = 'hi';
}
};
var num = parseFloat($('#balance').html());
bconfig.startbal = num;
bconfig.want = num + 0.00000030;
bconfig.autoexit = num - 0.00000420;
rollDice();