// ==UserScript==
// @name         [deprecated] Premium Exchange Sell If Stock Not Full UK33
// @description  Automatically sell resources when the stock is not full.
// @author       FunnyPocketBook
// @version      1.0.7
// @include      https://ch*.staemme.ch/game.php*screen=market*
// @include      https://uk33.tribalwars.co.uk/game.php*screen=market*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/35140/%5Bdeprecated%5D%20Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full%20UK33.user.js
// @updateURL https://update.greasyfork.org/scripts/35140/%5Bdeprecated%5D%20Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full%20UK33.meta.js
// ==/UserScript==

createInput();
sellResource();
function createInput() {
    "use strict";
    var userInputParent = document.getElementById("premium_exchange_form");
    var input = document.createElement("input");
    input.setAttribute("id", "premium_sell_res_cap");
    input.setAttribute("type", "text");
    input.setAttribute("value", "0");
    userInputParent.parentNode.insertBefore(input, userInputParent);
    var input2 = document.createElement("input");
    input2.setAttribute("id", "premium_sell_rate_cap");
    input2.setAttribute("type", "text");
    input2.setAttribute("value", "20000");
    userInputParent.parentNode.insertBefore(input2, userInputParent);
}
function sellResource(){
	"use strict";
    var woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
    var stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
    var ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());
    var parentSell;
    var woodCap = document.getElementById("premium_exchange_capacity_wood").innerHTML;
    var stoneCap = document.getElementById("premium_exchange_capacity_stone").innerHTML;
    var ironCap = document.getElementById("premium_exchange_capacity_iron").innerHTML;
    var woodStock = document.getElementById("premium_exchange_stock_wood").innerHTML;
    var stoneStock = document.getElementById("premium_exchange_stock_stone").innerHTML;
    var ironStock = document.getElementById("premium_exchange_stock_iron").innerHTML;
    var woodVillage = document.getElementById("wood").textContent;
    var stoneVillage = document.getElementById("stone").textContent;
    var ironVillage = document.getElementById("iron").textContent;
    var userInputSellResCap = document.getElementById("premium_sell_res_cap").value;
    var userInputSellRateCap = document.getElementById("premium_sell_rate_cap").value;
    var woodSellCap = woodVillage - userInputSellResCap;
    var stoneSellCap = stoneVillage - userInputSellResCap;
    var ironSellCap = ironVillage - userInputSellResCap;
    var woodSellCapMod = woodSellCap - (woodSellCap % woodPrice);
    var ironSellCapMod = ironSellCap - (ironSellCap % ironPrice);
    var stoneSellCapMod = stoneSellCap - (stoneSellCap % stonePrice);
    setTimeout(function() {
        userInputSellResCap = document.getElementById("premium_sell_res_cap").value;
        userInputSellRateCap = document.getElementById("premium_sell_rate_cap").value;
        woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
        stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
        ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());
        woodSellCap = woodVillage - userInputSellResCap;
        stoneSellCap = stoneVillage - userInputSellResCap;
        ironSellCap = ironVillage - userInputSellResCap;
        woodSellCapMod = woodSellCap - (woodSellCap % woodPrice) - 1;
        ironSellCapMod = ironSellCap - (ironSellCap % ironPrice) - 1;
        stoneSellCapMod = stoneSellCap - (stoneSellCap % stonePrice) - 1;
    }, 500);
    if((woodStock < woodCap) && (woodVillage > userInputSellResCap) && (woodSellCapMod > 0) && (woodPrice <= userInputSellRateCap)) {
        var parentSellOther1 = document.getElementById("premium_exchange_sell_iron");
        parentSellOther1.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther2 = document.getElementById("premium_exchange_sell_stone");
        parentSellOther2.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_wood");
        parentSell.getElementsByClassName("premium-exchange-input")[0].value = Math.min((woodCap - woodStock), woodSellCapMod);

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    }
    else if(stoneStock < stoneCap && stoneVillage > userInputSellResCap && stoneSellCapMod > 0 && (stonePrice <= userInputSellRateCap)) {
        var parentSellOther3 = document.getElementById("premium_exchange_sell_iron");
        parentSellOther3.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther4 = document.getElementById("premium_exchange_sell_wood");
        parentSellOther4.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_stone");
        parentSell.getElementsByClassName("premium-exchange-input")[0].value = Math.min((stoneCap - stoneStock), stoneSellCapMod);

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    }
    else if(ironStock < ironCap && ironVillage > userInputSellResCap && ironSellCapMod > 0 && ironPrice <= userInputSellRateCap) {
        var parentSellOther5 = document.getElementById("premium_exchange_sell_wood");
        parentSellOther5.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther6 = document.getElementById("premium_exchange_sell_stone");
        parentSellOther6.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_iron");
        parentSell.getElementsByClassName("premium-exchange-input")[0].value = Math.min((ironCap - ironStock), ironSellCapMod);

        document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
        setTimeout(function(){
            document.getElementsByClassName("evt-confirm-btn")[0].click();
        }, 1000);
    }
	setTimeout(function(){
		sellResource();
	}, 7000);
    
    var merchAvail = document.getElementById("market_merchant_available_count").textContent;
    setInterval(function() {
        merchAvail = document.getElementById("market_merchant_available_count").textContent;
    }, 1000);
    
    if(merchAvail < 20) {
        $('.arrowRight').click();
        $('.groupRight').click();
    }
}