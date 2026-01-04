// ==UserScript==
// @version      0.0.3
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         lo 1.01
// @namespace    0.0.3
// @description  lo with 1.01 odds
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/402611/lo%20101.user.js
// @updateURL https://update.greasyfork.org/scripts/402611/lo%20101.meta.js
// ==/UserScript==

var DELAY_TIME = 1547;
var BETAMOUNT = 0.00000001;
var PAYOUT = 1.01;

function bet(){
	if(document.getElementById("double_your_btc_stake").value > 2)
		return;

document.getElementById("double_your_btc_stake").value = BETAMOUNT;
	document.getElementById("double_your_btc_payout_multiplier").value = PAYOUT;
    document.getElementById('double_your_btc_bet_lo_button').click();
}
setInterval(bet, DELAY_TIME);