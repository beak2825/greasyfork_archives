// ==UserScript==
// @name         Premium Exchange Sell If Stock Not Full
// @description  Automatically sell resources when the stock is not full.
// @author       FunnyPocketBook
// @version      2.1
// @include      https://*/game.php*screen=market*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40129/Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/40129/Premium%20Exchange%20Sell%20If%20Stock%20Not%20Full.meta.js
// ==/UserScript==
createInput();
var buyOrSell = 6; // Change this to 5 to buy resources, 6 to sell resources
var merchAvail = document.getElementById("market_merchant_available_count").innerText; // Get number of available merchants
var userInputSellResCap = parseInt(localStorage.getItem("premium_sell_res_cap")); // Get the user set cap for resources
var userInputSellRateCap = parseInt(localStorage.getItem("premium_sell_rate_cap")); // Get the user set cap for rate


/* Run every 7 seconds */
setInterval(function() {
    merchAvail = document.getElementById("market_merchant_available_count").innerText;
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
    var userInputParent = document.getElementById("premium_exchange_form");
    var input = document.createElement("input");
    input.setAttribute("id", "premium_sell_res_cap");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", '"10000" to keep 10k');
    input.setAttribute("style", "width:180px;");
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_res_cap")))) {
        input.setAttribute("value", "");
    } else {
        input.setAttribute("value", localStorage.getItem("premium_sell_res_cap"));
    }
    userInputParent.parentNode.insertBefore(input, userInputParent);

    var input2 = document.createElement("input");
    input2.setAttribute("id", "premium_sell_rate_cap");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", '"200" to sell when price < 200');
    input2.setAttribute("style", "width:180px;");
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_rate_cap")))) {
        input2.setAttribute("value", "");
    } else {
        input2.setAttribute("value", localStorage.getItem("premium_sell_rate_cap"));
    }
    userInputParent.parentNode.insertBefore(input2, userInputParent);

    var okButton = document.createElement("button");
    okButton.innerHTML = "OK";
    okButton.setAttribute("id", "buttonSetCap");
    okButton.setAttribute("class", "btn");
    userInputParent.parentNode.insertBefore(okButton, userInputParent);
    
    var resCapInput = document.getElementById("premium_sell_res_cap");
    var rateCapInput = document.getElementById("premium_sell_rate_cap");
    /* If caps have been set, put it in the newly created input field */
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_res_cap")))) {
        resCapInput.setAttribute("value", "");
    } else {
        resCapInput.setAttribute("value", localStorage.getItem("premium_sell_res_cap"));
    }
    if (!isInteger(parseInt(localStorage.getItem("premium_sell_rate_cap")))) {
        rateCapInput.setAttribute("value", "");
    } else {
        rateCapInput.setAttribute("value", localStorage.getItem("premium_sell_rate_cap"));
    }
}

/* OK button calls this function */
document.getElementById("buttonSetCap").addEventListener("click", function setCap() {
    localStorage.setItem("premium_sell_res_cap", document.getElementById("premium_sell_res_cap").value);
    localStorage.setItem("premium_sell_rate_cap", document.getElementById("premium_sell_rate_cap").value);
    userInputSellResCap = parseInt(localStorage.getItem("premium_sell_res_cap"));
    userInputSellRateCap = parseInt(localStorage.getItem("premium_sell_rate_cap"));
});

/* Call for every resource to get the info */
function resInfo(res) {
    var number;
    switch(res) {
        case "wood":
            number = 0;
            break;
        case "stone":
            number = 1;
            break;
        case "iron":
            number = 2;
            break;
    }
    var info = {
        num: number,
        name: res,
        price: parseInt(document.getElementById("premium_exchange_rate_" + res).children[0].innerText),
        max: parseInt(document.getElementById("premium_exchange_capacity_" + res).innerHTML), // Maximum amount of resources that can currently fit in the premium exchange
        stock: parseInt(document.getElementById("premium_exchange_stock_" + res).innerHTML),
        inVillage: parseInt(document.getElementById(res).innerText),
        init: function() {
            this.cap = this.inVillage - parseInt(localStorage.getItem("premium_sell_res_cap"));
            return this;
        }
     }.init();
    return info;
}

function sellResource() {
    "use strict";
    merchAvail = document.getElementById("market_merchant_available_count").textContent;
    var sellThis;
    var wood = resInfo("wood");
    var stone = resInfo("stone");
    var iron = resInfo("iron");
    var allRes = [wood, stone, iron];
    var i = 0;
    var interval = setInterval(function() {
        if(allRes[i].stock < allRes[i].max && allRes[i].inVillage > userInputSellResCap && allRes[i].price <= userInputSellRateCap) {
            /* Empty every input box */
            document.querySelectorAll("#premium_exchange_form > table > tbody > tr > td > div:nth-child(1) > input").forEach(function(el) {
                el.value = "";
            });
            sellThis = Math.min((allRes[i].max - allRes[i].stock), (allRes[i].inVillage - userInputSellResCap));
            if (Math.ceil(sellThis / 1000) > merchAvail) {
                sellThis = merchAvail * 1000 - allRes[i].price;
            }
            if (sellThis < 0) {
                sellThis = 0;
            }
            if (sellThis != 0) {
                document.querySelectorAll("#premium_exchange_form > table > tbody > tr:nth-child(" + buyOrSell + ") > td > div:nth-child(1) > input")[allRes[i].num].value = sellThis;
                document.getElementsByClassName("btn-premium-exchange-buy")[0].click();
                setTimeout(function() {
                    document.querySelector("#premium_exchange > div > div > div.confirmation-buttons > button.btn.evt-confirm-btn.btn-confirm-yes").click();
                }, 1000);
            }
            clearInterval(interval);
        }
        i++;
        if(i >= 3) {
            clearInterval(interval);
            i = 0;
        }
    }, 1500)
    if (merchAvail < 20) {
        $('.arrowRight').click();
        $('.groupRight').click();
    }
}