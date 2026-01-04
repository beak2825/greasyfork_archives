// ==UserScript==
// @name         Premium Exchange Sell If Stock Not Full
// @description  Automatically sell resources when the stock is not full.
// @author       FunnyPocketBook
// @version      1.0.9.4
// @include      https://*/game.php*screen=market*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/35141/Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/35141/Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full.meta.js
// ==/UserScript==
createInput();
var merchAvail = document.getElementById("market_merchant_available_count").textContent;

setInterval(function() {
    merchAvail = document.getElementById("market_merchant_available_count").textContent;
    if (merchAvail > 0) {
        sellResource();
    }
}, 7000);

function isInteger(x) {
    "use strict";
    return (typeof x === 'number') && (x % 1 === 0);
}

function createInput() {
    "use strict";
    setInterval(function() {
        localStorage.setItem("premium_sell_res_cap", document.getElementById("premium_sell_res_cap").value);
        localStorage.setItem("premium_sell_rate_cap", document.getElementById("premium_sell_rate_cap").value);
    }, 1000);
    var userInputParent = document.getElementById("premium_exchange_form");
    var input = document.createElement("input");
    input.setAttribute("id", "premium_sell_res_cap");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", 'Type "10000" to keep 10000 of each resource');
    input.setAttribute("style", "width:30px;");
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_res_cap")))) {
        input.setAttribute("value", "");
    } else {
        input.setAttribute("value", localStorage.getItem("premium_sell_res_cap"));
    }
    userInputParent.parentNode.insertBefore(input, userInputParent);
    var input2 = document.createElement("input");
    input2.setAttribute("id", "premium_sell_rate_cap");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", 'Type "200" to sell only when the price is below 200');
    input2.setAttribute("style", "width:30px;");
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_rate_cap")))) {
        input2.setAttribute("value", "");
    } else {
        input2.setAttribute("value", localStorage.getItem("premium_sell_rate_cap"));
    }
    userInputParent.parentNode.insertBefore(input2, userInputParent);
}

function sellResource() {
    "use strict";
    merchAvail = document.getElementById("market_merchant_available_count").textContent;
    var woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
    var stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
    var ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());
    var parentSell;
    var woodCap = parseInt(document.getElementById("premium_exchange_capacity_wood").innerHTML);
    var stoneCap = parseInt(document.getElementById("premium_exchange_capacity_stone").innerHTML);
    var ironCap = parseInt(document.getElementById("premium_exchange_capacity_iron").innerHTML);
    var woodStock = parseInt(document.getElementById("premium_exchange_stock_wood").innerHTML);
    var stoneStock = parseInt(document.getElementById("premium_exchange_stock_stone").innerHTML);
    var ironStock = parseInt(document.getElementById("premium_exchange_stock_iron").innerHTML);
    var woodVillage = parseInt(document.getElementById("wood").textContent);
    var stoneVillage = parseInt(document.getElementById("stone").textContent);
    var ironVillage = parseInt(document.getElementById("iron").textContent);
    var userInputSellResCap = parseInt(localStorage.getItem("premium_sell_res_cap"));
    var userInputSellRateCap = parseInt(localStorage.getItem("premium_sell_rate_cap"));
    var woodSellCap = woodVillage - userInputSellResCap;
    var stoneSellCap = stoneVillage - userInputSellResCap;
    var ironSellCap = ironVillage - userInputSellResCap;
    var woodSellCapMod = woodSellCap - (woodSellCap % woodPrice);
    var ironSellCapMod = ironSellCap - (ironSellCap % ironPrice);
    var stoneSellCapMod = stoneSellCap - (stoneSellCap % stonePrice);
    var sellThis;
    var used = false;
    setTimeout(function() {
        userInputSellResCap = localStorage.getItem("premium_sell_res_cap");
        userInputSellRateCap = localStorage.getItem("premium_sell_rate_cap");
        woodPrice = parseInt($("#premium_exchange_rate_wood").children().text());
        stonePrice = parseInt($("#premium_exchange_rate_stone").children().text());
        ironPrice = parseInt($("#premium_exchange_rate_iron").children().text());
        woodSellCap = woodVillage - userInputSellResCap;
        stoneSellCap = stoneVillage - userInputSellResCap;
        ironSellCap = ironVillage - userInputSellResCap;
        woodSellCapMod = woodSellCap - (woodSellCap % woodPrice) - woodPrice + 1;
        ironSellCapMod = ironSellCap - (ironSellCap % ironPrice) - ironPrice + 1;
        stoneSellCapMod = stoneSellCap - (stoneSellCap % stonePrice) - stonePrice + 1;
    }, 500);
    if ((woodStock < woodCap) && (woodVillage > userInputSellResCap) && (woodSellCapMod > 0) && (woodPrice <= userInputSellRateCap) && !used) {
        used = true;
        var parentSellOther1 = document.getElementById("premium_exchange_sell_iron");
        parentSellOther1.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther2 = document.getElementById("premium_exchange_sell_stone");
        parentSellOther2.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_wood");
        sellThis = Math.min((woodCap - woodStock), (woodSellCapMod - woodPrice), (woodVillage - userInputSellResCap));
        if (Math.ceil(sellThis / 1000) > merchAvail) {
            sellThis = merchAvail * 1000 - woodPrice;
        }
        if (sellThis < 500) {
            sellThis = 0;
        } else if (sellThis < 1000) {
            sellThis = 1000 - woodPrice;
        }
        if (sellThis < 0) {
            sellThis = 0;
        }
        if (sellThis != 0) {
            parentSell.getElementsByClassName("premium-exchange-input")[0].value = sellThis;
            document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
            setTimeout(function() {
                document.getElementsByClassName("evt-confirm-btn")[0].click();
                used = false;
            }, 1000);
        }
    }
    if (stoneStock < stoneCap && stoneVillage > userInputSellResCap && stoneSellCapMod > 0 && (stonePrice <= userInputSellRateCap) && !used) {
        used = true;
        var parentSellOther3 = document.getElementById("premium_exchange_sell_iron");
        parentSellOther3.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther4 = document.getElementById("premium_exchange_sell_wood");
        parentSellOther4.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_stone");
        sellThis = Math.min((stoneCap - stoneStock), (stoneSellCapMod - stonePrice), (stoneVillage - userInputSellResCap));
        if (Math.ceil(sellThis / 1000) > merchAvail) {
            sellThis = merchAvail * 1000 - stonePrice;
        }
        if (sellThis < 500) {
            sellThis = 0;
        } else if (sellThis < 1000) {
            sellThis = 1000 - stonePrice;
        }
        if (sellThis < 0) {
            sellThis = 0;
        }
        if (sellThis != 0) {
            parentSell.getElementsByClassName("premium-exchange-input")[0].value = sellThis;
            document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
            setTimeout(function() {
                document.getElementsByClassName("evt-confirm-btn")[0].click();
                used = false;
            }, 1000);
        }
    }
    if (ironStock < ironCap && ironVillage > userInputSellResCap && ironSellCapMod > 0 && ironPrice <= userInputSellRateCap && !used) {
        used = true;
        var parentSellOther5 = document.getElementById("premium_exchange_sell_wood");
        parentSellOther5.getElementsByClassName("premium-exchange-input")[0].value = "";
        var parentSellOther6 = document.getElementById("premium_exchange_sell_stone");
        parentSellOther6.getElementsByClassName("premium-exchange-input")[0].value = "";
        parentSell = document.getElementById("premium_exchange_sell_iron");
        sellThis = Math.min((ironCap - ironStock), (ironSellCapMod - ironPrice), (ironVillage - userInputSellResCap));
        if (Math.ceil(sellThis / 1000) > merchAvail) {
            sellThis = merchAvail * 1000 - ironPrice;
        }
        if (sellThis < 500) {
            sellThis = 0;
        } else if (sellThis < 1000) {
            sellThis = 1000 - ironPrice;
        }
        if (sellThis < 0) {
            sellThis = 0;
        }
        if (sellThis != 0) {
            parentSell.getElementsByClassName("premium-exchange-input")[0].value = sellThis;
            document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
            setTimeout(function() {
                document.getElementsByClassName("evt-confirm-btn")[0].click();
                used = false;
            }, 1000);
        }
    }
    if (merchAvail < 20) {
        $('.arrowRight').click();
        $('.groupRight').click();
    }
}