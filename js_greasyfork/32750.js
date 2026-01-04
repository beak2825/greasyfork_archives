// ==UserScript==
// @name         [deprecated] Premium Exchange
// @description  Automatically buy resources for 1 PP on the Premium Exchange when the stock is full.
// @author       FunnyPocketBook
// @version      1.0.1
// @include      https://ch*.staemme.ch/game.php*screen=market*
// @include      https://uk*.tribalwars.co.uk/game.php*screen=market*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/32750/%5Bdeprecated%5D%20Premium%20Exchange.user.js
// @updateURL https://update.greasyfork.org/scripts/32750/%5Bdeprecated%5D%20Premium%20Exchange.meta.js
// ==/UserScript==


buyResource();
function buyResource(){
	"use strict";
	if(document.getElementsByClassName("recaptcha-checkbox-checkmark").length > 0) {
		document.getElementsByClassName("recaptcha-checkbox-checkmark")[0].click();
	} else{
		var parentBuy;
		var woodCap = document.getElementById("premium_exchange_capacity_wood").innerHTML;
		var stoneCap = document.getElementById("premium_exchange_capacity_stone").innerHTML;
		var ironCap = document.getElementById("premium_exchange_capacity_iron").innerHTML;
		var woodStock = document.getElementById("premium_exchange_stock_wood").innerHTML;
		var stoneStock = document.getElementById("premium_exchange_stock_stone").innerHTML;
		var ironStock = document.getElementById("premium_exchange_stock_iron").innerHTML;
		if(woodStock === woodCap) {
			parentBuy = document.getElementById("premium_exchange_buy_wood");
			parentBuy.getElementsByClassName("premium-exchange-input")[0].value = "1";

			document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
			setTimeout(function(){
				document.getElementsByClassName("evt-confirm-btn")[0].click();
			}, 1000);
		} else if(stoneStock === stoneCap) {
			parentBuy = document.getElementById("premium_exchange_buy_stone");
			parentBuy.getElementsByClassName("premium-exchange-input")[0].value = "1";

			document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
			setTimeout(function(){
				document.getElementsByClassName("evt-confirm-btn")[0].click();
			}, 1000);
		} else if(ironStock === ironCap) {
			parentBuy = document.getElementById("premium_exchange_buy_iron");
			parentBuy.getElementsByClassName("premium-exchange-input")[0].value = "1";

			document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
			setTimeout(function(){
				document.getElementsByClassName("evt-confirm-btn")[0].click();
			}, 1000);
		} else {}
	}
	setTimeout(function(){
		buyResource();
	}, 6000);
}