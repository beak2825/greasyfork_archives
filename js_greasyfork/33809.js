// ==UserScript==
// @name         Premium Exchange - Buy Resources
// @description  Automatically buy resources up to a predefined amount of resources
// @author       FunnyPocketBook
// @version      2.3.1
// @include      https://*/game.php*screen=market*
// @namespace    https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/33809/Premium%20Exchange%20-%20Buy%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/33809/Premium%20Exchange%20-%20Buy%20Resources.meta.js
// ==/UserScript==
const incoming = "Incoming"; // Change this accordingly to your language. In Portuguese it would be const incoming = "Entrada";
const timeout = 200; // Time in ms between transactions. Too low and the game won't allow it
let topUp, price, stack;
let start = false; // Start script or stop script, default is stop
let isBuying = false;

createInput();

function createInput() {
    "use strict";
    const userInputParent = document.getElementById("premium_exchange_form"); // Parent element

    // Create input for setting how much res should be bought
    const divScript = document.createElement("div");
    divScript.setAttribute("id", "divScript");
    userInputParent.parentNode.insertBefore(divScript, userInputParent);
    document.getElementById("divScript").innerHTML = "<p>Top up warehouse to: <input id='topUpInput'> " +
        "<button id='topUpOk' class='btn'>OK</button><span id='topUpText'></span></p><p>Buy when price above: <input id='priceInput'> " +
        "<button id='priceOk' class='btn'>OK</button><span id='priceText'></span></p>" +
        "<p>Buy max this much at once: <input id='stackInput'> <button id='stackOk' class='btn'>OK</button><span id='stackText'></span></p>" +
        "<p>Buy the whole stock at once: <input type=\"checkbox\" name=\"buyStock\" id=\"buyStock\"></p><span style='color:red'>ATTENTION! This might deplete your Premium Points completely, as it buys everything that is available!</span>" +
        "<p>Buy resources:</p><p><input type=\"checkbox\" name=\"wood\" id=\"woodCheck\"> Wood <input type=\"checkbox\" " +
        "name=\"stone\" id=\"stoneCheck\"> Stone <input type=\"checkbox\" name=\"iron\" id=\"ironCheck\"> Iron</p>" +
        "<p><button id='start' class='btn'></button></p>";
    if (!start) {
        document.getElementById("start").innerHTML = "Start";
    } else {
        document.getElementById("start").innerHTML = "Stop";
    }
    if (localStorage.topUp) {
        document.getElementById("topUpInput").value = localStorage.topUp;
        topUp = localStorage.topUp;
    }
    if (localStorage.price) {
        document.getElementById("priceInput").value = localStorage.price;
        price = localStorage.price;
    }
    if (localStorage.stack) {
        document.getElementById("stackInput").value = localStorage.stack;
        stack = localStorage.stack;
    }
}

document.getElementById("topUpOk").addEventListener("click", function () {
    topUp = document.getElementById("topUpInput").value;
    localStorage.topUp = topUp;
    document.getElementById("topUpText").innerHTML = "Top up to " + topUp;
});
document.getElementById("priceOk").addEventListener("click", function () {
    price = document.getElementById("priceInput").value;
    localStorage.price = price;
    document.getElementById("priceText").innerHTML = "Buy when price above " + price;
});
document.getElementById("stackOk").addEventListener("click", function () {
    stack = document.getElementById("stackInput").value;
    localStorage.stack = stack;
    document.getElementById("stackText").innerHTML = "Buy only " + stack + " resources at once";
});
document.getElementById("start").addEventListener("click", function () {
    if (start) {
        start = false;
        document.getElementById("start").innerHTML = "Start";
    } else {
        start = true;
        document.getElementById("start").innerHTML = "Stop";
        buyRes();
    }
});

document.getElementById("topUpInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#topUpOk"));
document.getElementById("priceInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#priceOk"));
document.getElementById("stackInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#stackOk"));

/**
 *
 * @param wh Amount of resources in the warehouse
 * @param price Current price of the resource
 * @param stock Amount of resources in the premium exchange stock
 * @param inc Amount of incoming resources
 * @param input DOM Element of the text box
 * @param buy Amount of resources to buy
 * @constructor
 */
function Resource(wh, price, stock, inc, input) {
    this.wh = wh;
    this.price = price;
    this.stock = stock;
    this.inc = inc;
    this.inputBuy = input;
    this.buy = 0;
}

/**
 * Get all the info of the resources
 * @type {Resource}
 */
let wood = new Resource(game_data.village.wood, parseInt(document.querySelector("#premium_exchange_rate_wood > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_wood").innerText), 0, document.querySelector("#premium_exchange_buy_wood > div:nth-child(1) > input"));
let iron = new Resource(game_data.village.iron, parseInt(document.querySelector("#premium_exchange_rate_iron > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_iron").innerText), 0, document.querySelector("#premium_exchange_buy_iron > div:nth-child(1) > input"));
let stone = new Resource(game_data.village.stone, parseInt(document.querySelector("#premium_exchange_rate_stone > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_stone").innerText), 0, document.querySelector("#premium_exchange_buy_stone > div:nth-child(1) > input"));
let warehouse = game_data.village.storage_max;


if (start) {
    buyRes();
}
const interval = setInterval(function () {
    if (start && (!document.querySelector("#fader") || document.querySelector("#fader").style.display === "none")) {
        buyRes();
    }
}, timeout);

function buyRes() {
    getRes();

    // If buy everything is checked and warehouse + incoming resource of each resource is less than what the warehouse should be topped up to
    if (document.querySelector("#buyStock").checked || wood.wh + wood.inc < topUp || stone.wh + stone.inc < topUp || iron.wh + iron.inc < topUp) {
        if ((document.querySelector("#buyStock").checked && document.querySelector("#woodCheck").checked || wood.price > price && wood.wh + wood.inc < topUp && document.querySelector("#woodCheck").checked) && wood.stock > price) {
            // Buy wood
            wood.buy = topUp - wood.wh - wood.inc;
            // If for some reason, which shouldn't occur, the amount to buy goes below 0, adjust the amount to buy
            if (wood.buy <= 0) {
                wood.buy = wood.price - 2;
            }
            // Only buy a certain amount of resources (stack) at once so the price can be still seen
            if (wood.buy > stack) {
                wood.buy = stack;
            }
            if (wood.buy > wood.stock || document.querySelector("#buyStock").checked && wood.stock > 0) {
                wood.buy = wood.stock - 1;
            }
            //stone.inputBuy.value = "";
            //iron.inputBuy.value = "";
            //wood.buy = setZeroIfNaN(wood.buy);
            if (wood.buy === 0) {
                clearInterval(interval);
                console.log("wood:");
                console.log(wood);
                alert("This error message shouldn't pop up.");
                return;
            }
            //wood.inputBuy.value = wood.buy;
            if (!isBuying) {
                buy("wood", wood.buy);
            }
        } else if (((document.querySelector("#buyStock").checked && document.querySelector("#stoneCheck").checked) || (stone.price > price && stone.wh + stone.inc < topUp && document.querySelector("#stoneCheck").checked) && stone.stock > price)) {
            // Buy stone
            stone.buy = topUp - stone.wh - stone.inc;
            if (stone.buy <= 0) {
                stone.buy = stone.price - 2;
            }
            if (stone.buy > stack) {
                stone.buy = stack;
            }
            if (stone.buy > stone.stock || document.querySelector("#buyStock").checked && stone.stock > 0) {
                stone.buy = stone.stock - 1;
            }
            //wood.inputBuy.value = "";
            //iron.inputBuy.value = "";
            //stone.buy = setZeroIfNaN(stone.buy);
            if (stone.buy === 0) {
                clearInterval(interval);
                console.log("stone:");
                console.log(stone);
                alert("This error message shouldn't pop up.");
                return;
            }
            //stone.inputBuy.value = stone.buy;
            if (!isBuying) {
                buy("stone", stone.buy);
            }
        } else if ((document.querySelector("#buyStock").checked && document.querySelector("#ironCheck").checked || iron.price > price && iron.wh + iron.inc < topUp && document.querySelector("#ironCheck").checked) && iron.stock > price) {
            // Buy iron
            iron.buy = topUp - iron.wh - iron.inc;
            if (iron.buy <= 0) {
                iron.buy = iron.price - 2;
            }
            if (iron.buy > stack) {
                iron.buy = stack;
            }
            if (iron.buy > iron.stock || document.querySelector("#buyStock").checked && iron.stock > 0) {
                iron.buy = iron.stock - 1;
            }
            //wood.inputBuy.value = "";
            //stone.inputBuy.value = "";
            //iron.buy = setZeroIfNaN(iron.buy);
            if (iron.buy === 0) {
                clearInterval(interval);
                console.log("iron:");
                console.log(iron);
                alert("This error message shouldn't pop up.");
                return;
            }
            //iron.inputBuy.value = iron.buy;
            if (!isBuying) {
                buy("iron", iron.buy);
            }
        }
    }
}

function buy(res, amnt) {
    isBuying = true;
    let data = {};
    data["buy_" + res] = amnt;
    data.h = game_data.csrf;
    TribalWars.post("market", {ajaxaction: "exchange_begin"}, data, function(r) {
        if (r[0].error) {
            isBuying = false;
            return;
        }
        let rate_hash = r[0].rate_hash;
        let buy_amnt = r[0].amount;
        data["rate_" + res] = rate_hash;
        data["buy_" + res] = buy_amnt;
        data["mb"] = 1;
        data.h = game_data.csrf;
        TribalWars._ah = {
            TribalWarsTE: 1,
        }
        TribalWars.post("market", {ajaxaction: "exchange_confirm"}, data, function(r) {
            isBuying = false;
            if (r.success) {
                UI.SuccessMessage("Bought " + buy_amnt + " " + res + "!");
                console.log("Bought " + buy_amnt + " " + res + "!");
                $("#market_status_bar").replaceWith(r.data.status_bar);
                getRes();
            }
        })
    })
}
/**
 * Update resource objects
 */
function getRes() {
    let parentInc;
    warehouse = game_data.village.storage_max;
    wood.wh = game_data.village.wood;
    stone.wh = game_data.village.stone;
    iron.wh = game_data.village.iron;
    wood.stock = parseInt(document.getElementById("premium_exchange_stock_wood").innerText);
    stone.stock = parseInt(document.getElementById("premium_exchange_stock_stone").innerText);
    iron.stock = parseInt(document.getElementById("premium_exchange_stock_iron").innerText);
    wood.price = parseInt(document.querySelector("#premium_exchange_rate_wood > div:nth-child(1)").innerText);
    stone.price = parseInt(document.querySelector("#premium_exchange_rate_stone > div:nth-child(1)").innerText);
    iron.price = parseInt(document.querySelector("#premium_exchange_rate_iron > div:nth-child(1)").innerText);
    try {
        if (document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(1)").innerHTML.split(" ")[0].replace(":", "") === incoming) {
            parentInc = document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(1)");
        }
    } catch (e) { }
    try {
        if (document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(2)").innerHTML.split(" ")[0].replace(":", "") === incoming) {
            parentInc = document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(2)");
        }
    } catch (e) { }

    try {
        wood.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".wood").parentElement.innerText.replace(".", ""))));
    } catch (e) { }
    try {
        stone.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".stone").parentElement.innerText.replace(".", ""))));
    } catch (e) { }
    try {
        iron.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".iron").parentElement.innerText.replace(".", ""))));
    } catch (e) { }
}

function clickOnKeyPress(key, selector) {
    "use strict";
    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }
    let handled = false;
    if (event.key === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyIdentifier === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyCode === key) {
        document.querySelector(selector).click();
        handled = true;
    }
    if (handled) {
        event.preventDefault();
    }
}

function setZeroIfNaN(x) {
    "use strict";
    if ((typeof x === 'number') && (x % 1 === 0)) {
        return x;
    } else {
        return 0;
    };
}