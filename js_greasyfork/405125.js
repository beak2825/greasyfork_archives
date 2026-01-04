// ==UserScript==
// @version      0.0.5
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         auto click with 3 odds
// @namespace    0.0.5
// @description  auto click with lo, 3 odds
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/405125/auto%20click%20with%203%20odds.user.js
// @updateURL https://update.greasyfork.org/scripts/405125/auto%20click%20with%203%20odds.meta.js
// ==/UserScript==

var DELAY_TIME = 60000;
var AUTOBET_PAYOUT = 3; // 30 + Math.random() * 2
var AUTOBET_ROLLCOUNT = 20;
var AUTOBET_BASE_BET = 0.00000002;
var AUTOBET_LOSEINCREASEBETPERCENT = 60;
var wager = 0;
var betHi = document.getElementById("autobet_bet_hi");
var betLo = document.getElementById("autobet_bet_lo");
var betalt = document.getElementById("autobet_bet_alternate");
var betOdds = document.getElementById("autobet_bet_odds");
var betRollCount = document.getElementById("autobet_roll_count");
var betBase = document.getElementById("autobet_base_bet");
var betStopAfterProfit = document.getElementById("stop_after_profit");
var betLoseIncreaseBet = document.getElementById("autobet_lose_increase_bet");
var betLoseIncreaseBetPercent = document.getElementById("autobet_lose_increase_bet_percent");
var betLoseReturnToBase = document.getElementById("autobet_lose_return_to_base");
var betStopAfterProfitValue = document.getElementById("stop_after_profit_value");
var betStopAfterLoss = document.getElementById("stop_after_loss");
var betStopAfterLossValue = document.getElementById("stop_after_loss_value");
var startBet = document.getElementById("start_autobet");
var count = 0;

function bet(){
	betOdds.value = AUTOBET_PAYOUT;
	betRollCount.value = AUTOBET_ROLLCOUNT;
	betBase.value = AUTOBET_BASE_BET;
	betStopAfterProfit.checked = true;
	betLoseIncreaseBet.checked = true;
	betLoseIncreaseBetPercent.value = AUTOBET_LOSEINCREASEBETPERCENT;
	betLoseReturnToBase.checked = false;
	
	if(count % 2 == 0){
		betHi.checked = false;
		betLo.checked = true;
		betalt.checked = false;
	} else {
		betHi.checked = true;
		betLo.checked = false;
		betalt.checked = false;
	}
	
    startBet.click();
	count++;
}
setInterval(bet, DELAY_TIME);

