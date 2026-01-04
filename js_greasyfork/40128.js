// ==UserScript==
// @name         Premium Exchange Buy If Over 1 PP
// @description  Automatically buy resources when there is something in the stock over 1 PP.
// @author       FunnyPocketBook
// @version      1.0.2
// @include      https://*/game.php*screen=market*
// @namespace    https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40128/Premium%20Exchange%20Buy%20If%20Over%201%20PP.user.js
// @updateURL https://update.greasyfork.org/scripts/40128/Premium%20Exchange%20Buy%20If%20Over%201%20PP.meta.js
// ==/UserScript==
setInterval(function() {
    "use strict";
    var merchAvail = document.querySelector("#market_merchant_available_count").innerHTML;
    if (merchAvail > 0) {
        buyResource();
    }
}, 400);
function buyResource(){
	"use strict";
    var woodVill = document.querySelector("#wood").innerHTML;
    var stoneVill = document.querySelector("#stone").innerHTML;
    var ironVill = document.querySelector("#iron").innerHTML;
    var storage = document.querySelector("#storage").innerHTML;
    var woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
    var stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
    var ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());

    var parentBuy;
    /*var woodCap = document.getElementById("premium_exchange_capacity_wood").innerHTML;
    var stoneCap = document.getElementById("premium_exchange_capacity_stone").innerHTML;
    var ironCap = document.getElementById("premium_exchange_capacity_iron").innerHTML;
    */
    var woodStock = document.getElementById("premium_exchange_stock_wood").innerHTML;
    var stoneStock = document.getElementById("premium_exchange_stock_stone").innerHTML;
    var ironStock = document.getElementById("premium_exchange_stock_iron").innerHTML;
    setInterval(function(){
        woodVill = document.querySelector("#wood").innerHTML;
        stoneVill = document.querySelector("#stone").innerHTML;
        ironVill = document.querySelector("#iron").innerHTML;

        woodStock = document.getElementById("premium_exchange_stock_wood").innerHTML;
        stoneStock = document.getElementById("premium_exchange_stock_stone").innerHTML;
        ironStock = document.getElementById("premium_exchange_stock_iron").innerHTML;

        woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
        stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
        ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());
    }, 200);
    if(woodStock >= woodPrice && (storage - storage / 10) > woodVill) {
        parentBuy = document.getElementById("premium_exchange_buy_wood");
        parentBuy.getElementsByClassName("premium-exchange-input")[0].value = woodStock;

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    }
    setTimeout(function() {
    if(stoneStock >= stonePrice && (storage - storage / 10) > stoneVill) {
        parentBuy = document.getElementById("premium_exchange_buy_stone");
        parentBuy.getElementsByClassName("premium-exchange-input")[0].value = stoneStock;

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    }  },5000);

    setTimeout(function() {
    if(ironStock >= ironPrice && (storage - storage / 10) > ironVill) {
        parentBuy = document.getElementById("premium_exchange_buy_iron");
        parentBuy.getElementsByClassName("premium-exchange-input")[0].value = ironStock;

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    } },15000);
	setTimeout(function(){
		buyResource();
	}, 7000);
}