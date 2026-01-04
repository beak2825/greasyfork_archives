// ==UserScript==
// @name           Mutiply Roll Booster TESTED
// @author         Danik Odze
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Multiplies your Satoshi every 6 seconds. Doubles when you lose.
// @include        https://freebitco.in/*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/456640/Mutiply%20Roll%20Booster%20TESTED.user.js
// @updateURL https://update.greasyfork.org/scripts/456640/Mutiply%20Roll%20Booster%20TESTED.meta.js
// ==/UserScript==
bconfig = {
	maxBet: 0.00009256,
	wait: 3700,
};
hilo = 'lo';
roll = 0;
t75 = random(50, 70);
$money = $('#balance'), $winchance = $('#double_your_btc_win_chance'), $betmoney = $('#double_your_btc_stake');
minstake = (parseFloat($money.html()) / 2000);
stake = minstake; // начальная ставка
$winchance.val(43); // шанс
$winchance.keyup();
startBalance = parseFloat($money.text());
$betmoney.val(stake.toFixed(8));
rollDice = function() {
	if($('#double_your_btc_bet_lose').html() !== '') {
		stake = stake * 2.1; // если проиграл то х2
		lost++;
	} else {
		lost = 0;
		losttime = 0;
		stake = minstake; // если выиграл
		if(roll > t75) {
			console.log((parseFloat($money.text()) - startBalance).toFixed(8) + '	' + t75);
			throw new FatalError("!! Stop JS !!"); // аварийный выход
		}
	}
	if(parseFloat($money.html()) < (parseFloat($betmoney.val()) * 2) || parseFloat($betmoney.val()) > bconfig.maxBet) {
		stake = minstake;
	}
	if(Math.random() > 0.1) hilo = 'lo';
	else hilo = 'hi'; // случайное HI-LO
	$betmoney.val(stake.toFixed(8));
	$('#double_your_btc_bet_' + hilo + '_button').click();
	roll++;
};

function below() {
	if(!document.querySelector("#double_your_btc_bet_lo_button").disabled) { // ожидаем окончани¤ крутилки
		console.log('ROLL ' + roll + ' LOST ' + lost);
		rollDice();
	}
	if(lost > 5) losttime = 5000;
	waitTime = bconfig.wait + Math.round(Math.random() * 100) + losttime;
	console.log('waitTime ' + waitTime / 1000 + ' sec.');
	setTimeout(below, waitTime);
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min; // integer
	//return min + (max - min) * Math.random();
}
//below();
setTimeout(below, random(7500, 10000));