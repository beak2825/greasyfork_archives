// ==UserScript==
// @name         Noaboy: Premium Exchange - Buy Resources
// @description  Automatically buy resources up to a predefined amount of resources
// @author       FunnyPocketBook
// @version      1.0.3
// @include      https://*/game.php*screen=market*
// @namespace    https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/397562/Noaboy%3A%20Premium%20Exchange%20-%20Buy%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/397562/Noaboy%3A%20Premium%20Exchange%20-%20Buy%20Resources.meta.js
// ==/UserScript==
let incoming = "Aankomend";
let topUp, price, stack, checkInterval;
let start = false; // Start script or stop script, default is stop
let isBuying = false;
let buyingTimeout = false;
let interval;

createInput();

function createInput() {
    "use strict";
    const userInputParent = document.getElementById("premium_exchange_form"); // Parent element

    // Create input for setting how much res should be bought
    const divScript = document.createElement("div");
    divScript.setAttribute("id", "divScript");
    userInputParent.parentNode.insertBefore(divScript, userInputParent);
    document.getElementById("divScript").innerHTML = "<table><tbody>" +
        "<tr><td>Translation of \"incoming\"</td><td><input id='incomingWordInput' value='Incoming'></td><td><button id='incomingWordOk' class='btn'>OK</button></td></tr>" +
        "<tr><td>Check every x milliseconds for new resources</td><td><input id='checkIntervalInput' value='1000'><td><button id='checkIntervalOk' class='btn'>OK</button></td><td> <span id='checkIntervalText'></span> </td></tr>" +
        "<tr> <td>Top up warehouse to</td> <td><input id='topUpInput'></td> <td><button id='topUpOk' class='btn'>OK</button> </td> <td> <span id='topUpText'></span> </td> </tr>" +
        "<tr><td>Buy when price above</td><td><input id='priceInput'></td> <td><button id='priceOk' class='btn'>OK</button></td><td><span id='priceText'></span></td></tr>" +
        "<tr><td>Buy max this much at once</td><td><input id='stackInput'></td><td><button id='stackOk' class='btn'>OK</button></td><td><span id='stackText'></span></td></tr>" +
        "<tr><td>Buy the whole stock at once</td><td><input type=\"checkbox\" name=\"buyStock\" id=\"buyStock\"></td></tr>" +
        "<tr><td>Buy resources</td><td><input type=\"checkbox\" name=\"wood\" id=\"woodCheck\"> Wood <input type=\"checkbox\" " +
        "name=\"stone\" id=\"stoneCheck\"> Stone <input type=\"checkbox\" name=\"iron\" id=\"ironCheck\"> Iron</tr>" +
        "<tr><td><button id='start' class='btn'></button></td></tr>";
    if (!start) {
        document.getElementById("start").innerHTML = "Start";
    } else {
        document.getElementById("start").innerHTML = "Stop";
    }
    if (localStorage.topUp) {
        document.getElementById("topUpInput").value = localStorage.topUp;
        topUp = parseInt(localStorage.topUp);
    }
    if (localStorage.checkInterval) {
        document.getElementById("checkIntervalInput").value = localStorage.checkInterval;
        checkInterval = parseInt(localStorage.checkInterval);
    }
    if (localStorage.incoming) {
        document.getElementById("incomingWordInput").value = localStorage.incoming;
        incoming = localStorage.incoming;
    }
    if (localStorage.price) {
        document.getElementById("priceInput").value = localStorage.price;
        price = parseInt(localStorage.price);
    }
    if (localStorage.stack) {
        document.getElementById("stackInput").value = localStorage.stack;
        stack = parseInt(localStorage.stack);
    }
}
document.getElementById("incomingWordOk").addEventListener("click", function () {
    incoming = document.getElementById("incomingWordInput").value;
    localStorage.incoming = incoming;
    document.getElementById("incomingWordInput").value = incoming;
});
document.getElementById("topUpOk").addEventListener("click", function () {
    topUp = document.getElementById("topUpInput").value;
    localStorage.topUp = topUp;
    document.getElementById("topUpText").innerHTML = "Top up to " + topUp;
});
document.getElementById("checkIntervalOk").addEventListener("click", function () {
    checkInterval = document.getElementById("checkIntervalInput").value;
    localStorage.checkInterval = checkInterval;
    document.getElementById("checkIntervalText").innerHTML = "Check every " + checkInterval + "ms";
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
        clearInterval(interval);
        document.getElementById("start").innerHTML = "Start";
    } else {
        start = true;
        document.getElementById("start").innerHTML = "Stop";
        startCheckInterval();
    }
});

document.getElementById("topUpInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#topUpOk"));
document.getElementById("priceInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#priceOk"));
document.getElementById("stackInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#stackOk"));

var PremiumExchangeCustom;
! function () {
    "use strict";
    PremiumExchangeCustom = {
        TYPE_BUY: "buy",
        TYPE_SELL: "sell",
        data: {},
        errors: {},
        icons: {},
        graph: null,
        init: function () {
            $(".premium-exchange-input").on("keyup input", PremiumExchangeCustom.inputChanged), $("#premium_exchange_form").on("submit", PremiumExchangeCustom.beginBuy), setInterval(PremiumExchangeCustom.loadData, 1e4), $("#premium_exchange_help").on("click", function () {
                return Dialog.fetch("premium_exchange_help", "market", {
                    ajax: "exchange_help"
                }), !1
            }), this.graph && (this.graph.graph(), UI.onResizeEnd(window, function () {
                PremiumExchangeCustom.graph.graph()
            }))
        },
        beginBuy: function (data) {
            var t = data;
            TribalWars.post("market", {
                ajaxaction: "exchange_begin"
            }, t, function (response) {
                var res = response[0].resource;
                var rate_key = "rate_" + res;
                var buy_key = "buy_" + res;
                var rate_res = response[0].rate_hash;
                var buy = response[0].amount;
                var data = {
                    [rate_key]: rate_res,
                    [buy_key]: buy,
                    mb: 1
                };
                TribalWars._ah = {
                    TribalWarsTE: 1
                }
                PremiumExchangeCustom.confirmOrder(data);
            });
            isBuying = false;
        },
        showConfirmationDialog: function (e) {
            var a = {},
                r = 0,
                t = 0,
                i = 0,
                c = 0,
                n = [],
                m = s('<img src="%1" />', Format.image_src("resources/premium.png")),
                u = '<div style="text-align: left">';
            u += '<h3 style="margin-top: 0">' + _("61a141a577b07aaea4618a4e3690f2c0") + '</h3><table class="vis" style="width: 100%"><tr><th>' + _("5238bd0d26ee4c221badd6e6c6475412") + "</th><th>" + _("077c2a977fca766982052f10bcf21cc2") + "</th></tr>", $.each(e, function (e, n) {
                a["rate_" + n.resource] = n.rate_hash, n.error ? i++ : (n.amount > 0 ? (a["buy_" + n.resource] = n.amount, t += n.cost) : (a["sell_" + n.resource] = Math.abs(n.amount), r += -n.cost), c += n.merchants_required);
                var o = n.amount > 0 ? _("886911e57fa3ee3994a663623a3b9d10") : _("bdbaf050407e81714408289ba3c6941b");
                n.error ? u += '<tr class="error">' : u += '<tr class="row_a">', u += s("<td>" + o + "</td>", s('<img src="%1" /> %2', Format.image_src("resources/" + n.resource + "_18x16.png"), Math.abs(n.original_amount)), s("%1 %2", m, Math.round(Math.abs(n.cost)))), u += s("<td>" + o + "</td>", s('<img src="%1" /> %2', Format.image_src("resources/" + n.resource + "_18x16.png"), Math.abs(n.amount)), s("%1 %2", m, Math.round(Math.abs(n.cost)))), u += "</tr>", n.error && (u += '<tr><td colspan="2" class="warn">' + n.error + "</td></tr>"), n.original_rate_hash && n.original_rate_hash !== n.rate_hash && (u += '<tr><td colspan="2" class="warn">' + _("51bff152db3085d061ab05ff18929d0e") + "</td></tr>")
            }), u += "</table>", c && (u += "<p>", u += _("1571a73d0961e52173c82da0df8035b8") + " " + c + "<br />", u += _("e206dc0ee33cef21157162c292bed800") + " " + Format.timeSpan(1e3 * PremiumExchangeCustom.data.duration), u += "</p>");
            var o = t;
            u += "<p>";
            var h = PremiumExchangeCustom.data.credit > t ? t : PremiumExchangeCustom.data.credit;
            t && r ? u += s(_("6069c7a2d0b5c182414b09705e179599"), m, t, r) : t ? u += s(_("c940e94d64f0ca5a359b0901b72f0087"), m, t) : r && (u += s(_("7e18147925200d1d4878df9d9e372167"), m, r)), u += "</p>", h && (u += "<p>", u += s(_("42544aa81540d049c6e3d824db1a0726"), m, h), (o = t - h) && (u += "<br />" + s(_("6da2e509a8b5e4f74e7d6f4409f9ea40"), m, o)), u += "</p>"), o > 0 && parseInt(game_data.player.pp) < o && (u += "<p>" + _("36eac82c264e62a0ae560f533928dbd7") + "</p>"), u += "</div>", o > 0 && parseInt(game_data.player.pp) < o ? n.push({
                text: _("de18d7ebba08f2bf851b460ac724b4ce"),
                callback: function () {
                    Premium.buy()
                },
                confirm: !0
            }) : i || n.push({
                text: _("70d9be9b139893aa6c69b5e77e614311"),
                callback: function (e) {
                    a.mb = e.hasOwnProperty("which") ? e.which : -1;
                    var r = e.originalEvent.hasOwnProperty("isTrusted") ? e.originalEvent.isTrusted ? 1 : 0 : 1;
                    TribalWars._ah = {
                        TribalWarsTE: r
                    }, PremiumExchangeCustom.confirmOrder(a)
                },
                confirm: !0
            }), UI.ConfirmationBox(u, n, "premium_exchange", null, !0)
        },
        confirmOrder: function (data) {
            Dialog.close();
            TribalWars.post("market", {
                ajaxaction: "exchange_confirm"
            }, data);
        },
        loadData: function (e) {
            TribalWars.get("market", {
                ajax: "exchange_data"
            }, function (a) {
                PremiumExchangeCustom.receiveData(a), e && e()
            })
        },
        receiveData: function (e) {
            PremiumExchangeCustom.data = e, PremiumExchangeCustom.updateUI()
        },
        updateUI: function () {
            $.each(PremiumExchangeCustom.data.stock, function (e, a) {
                var r = $("#premium_exchange_stock_" + e).text(a);
                a >= PremiumExchangeCustom.data.capacity[e] ? r.addClass("warn") : r.removeClass("warn"), $("#premium_exchange_buy_" + e).find("input[name='buy_" + e + "']").prop("disabled", a < 1), $("#premium_exchange_sell_" + e).find("input[name='sell_" + e + "']").prop("disabled", a >= PremiumExchangeCustom.data.capacity[e]), $("#premium_exchange_form").find("input[disabled]").val("")
            }), $.each(PremiumExchangeCustom.data.capacity, function (e, a) {
                $("#premium_exchange_capacity_" + e).text(a)
            }), $.each(PremiumExchangeCustom.data.rates, function (e, a) {
                $("#premium_exchange_rate_" + e).children().eq(0).html(window.s('<img src="%1" alt="" /> %2', Format.image_src("resources/" + e + "_18x16.png"), PremiumExchangeCustom.calculateRateForOnePoint(e)))
            }), $("#market_merchant_available_count").text(PremiumExchangeCustom.data.merchants), $("#market_status_bar").replaceWith(PremiumExchangeCustom.data.status_bar), $(".premium-exchange-input").each(function () {
                "" !== $(this).val() && PremiumExchangeCustom.inputChanged.call(this)
            })
        },
        inputChanged: function () {
            var e, a, r = $(this),
                t = r.data("resource"),
                i = r.data("type"),
                c = (i === PremiumExchangeCustom.TYPE_BUY ? PremiumExchangeCustom.TYPE_SELL : PremiumExchangeCustom.TYPE_BUY, r.val()),
                n = $("#premium_exchange_" + i + "_" + t + " .cost-container");
            if (!c) return PremiumExchangeCustom.updateUI(), n.find(".icon").show(), n.find(".cost").text("0"), void (PremiumExchangeCustom.errors.hasOwnProperty(t) && delete PremiumExchangeCustom.errors[t]);
            if ($(".premium-exchange-input:not([name=" + r.attr("name") + "])").attr("disabled", "disabled"), c = parseInt(c), isNaN(c) && (c = 0), i === PremiumExchangeCustom.TYPE_BUY ? (a = PremiumExchangeCustom.validateBuyAmount(t, c), e = Math.ceil(PremiumExchangeCustom.calculateCost(t, c))) : (a = PremiumExchangeCustom.validateSellAmount(t, c), e = Math.abs(Math.floor(PremiumExchangeCustom.calculateCost(t, -c)))), !0 === a) n.find(".icon").show(), n.find(".cost").text(e), PremiumExchangeCustom.errors.hasOwnProperty(t) && delete PremiumExchangeCustom.errors[t], window.mobile && r.parents("table").eq(0).find(".premium-exchange-error").hide();
            else {
                var m = $('<img src="%1" alt="" class="tooltip" />').attr("src", Format.image_src("error.png")).attr("title", a);
                n.find(".icon").hide(), n.find(".cost").html(m), UI.ToolTip(n.find(".tooltip")), PremiumExchangeCustom.errors[t] = a, window.mobile && r.parents("table").eq(0).find(".premium-exchange-error").show().find("td").text(a)
            }
        },
        validateBuyAmount: function (e, a) {
            return a <= 0 ? _("7221852782e515e01af552806f0fc5a3") : window.game_data.village.storage_max < a ? _("90f92270724ba1b89f8e243c44e2513f") : !(a > PremiumExchangeCustom.data.stock[e]) || _("01ac228f8bc0b2ba1dc93594270c40fe")
        },
        validateSellAmount: function (e, a) {
            return a <= 0 ? _("7221852782e515e01af552806f0fc5a3") : window.game_data.village[e] < a ? _("7f0a8636061a93e0516ae14b94cf9a2c") : !(a + PremiumExchangeCustom.data.stock[e] > PremiumExchangeCustom.data.capacity[e]) || _("0e1d9c5e4f6152d5cab2fff4aa5b0d22")
        },
        calculateCost: function (resource, relCost) {
            var capacity = PremiumExchangeCustom.data.stock[resource],
                stock = PremiumExchangeCustom.data.capacity[resource];
            return (1 + (relCost >= 0 ? PremiumExchangeCustom.data.tax.buy : PremiumExchangeCustom.data.tax.sell)) * (PremiumExchangeCustom.calculateMarginalPrice(capacity, stock) + PremiumExchangeCustom.calculateMarginalPrice(capacity - relCost, stock)) * relCost / 2
        },
        calculateMarginalPrice: function (stock, capacity) {
            var constants = PremiumExchangeCustom.data.constants;
            return constants.resource_base_price - constants.resource_price_elasticity * stock / (capacity + constants.stock_size_modifier)
        },
        calculateRateForOnePoint: function (resource) {
            for (var stock = PremiumExchangeCustom.data.stock[resource],
                capacity = PremiumExchangeCustom.data.capacity[resource],
                mPrice = (PremiumExchangeCustom.data.tax.buy, PremiumExchangeCustom.calculateMarginalPrice(stock, capacity)),
                relCost = Math.floor(1 / mPrice),
                cost = PremiumExchangeCustom.calculateCost(resource, relCost),
                n = 0;
                cost > 1 && n < 50;) {
                relCost-- , n++ , cost = PremiumExchangeCustom.calculateCost(resource, relCost);
            }
            return relCost
        },
        robertReadableRate: function (e, a) {
            var r = Market.getPremiumRate(a, 1),
                t = this.icons[e] + r.resources,
                i = this.icons.premium + r.premium;
            return s("%1 = %2", t, i)
        }
    }
}();

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

function startCheckInterval() {
    let rand = Math.floor(Math.random() * 500 + parseInt(checkInterval));
    interval = setTimeout(async function () {
        if (start && !buyingTimeout && !isBuying && (!document.querySelector("#fader") || document.querySelector("#fader").style.display === "none")) {
            await getRes();
            if (document.getElementById("woodCheck").checked) checkRes("wood", wood);
            if (document.getElementById("ironCheck").checked) checkRes("iron", iron);
            if (document.getElementById("stoneCheck").checked) checkRes("stone", stone);
        }
        startCheckInterval()
    }, rand);
}

function checkRes(resName, res) {
    let buyName = "buy_" + resName;
    if (document.getElementById("buyStock").checked) {
        if (!isBuying) {
            isBuying = true;
            PremiumExchangeCustom.beginBuy({ [buyName]: res.stock - 1 });
            return;
        }
    }
    // If incoming and current amount in warehouse is lower than topUp amount
    // If resource price higher than buyAbove
    if (res.inc + res.wh < topUp && res.price > price && PremiumExchangeCustom.data.stock[resName] > 63) {
        res.buy = topUp - res.inc - res.wh;
        if (res.buy > stack) {
            res.buy = stack - 1;
        }
        if (PremiumExchangeCustom.data.stock[resName] < res.buy) {
            res.buy = PremiumExchangeCustom.data.stock[resName];
        }
        if (!isBuying) {
            isBuying = true;
            PremiumExchangeCustom.beginBuy({ [buyName]: res.buy });
        }
    }
}

async function fetchRes() {
    let response = await fetch(`${location.origin}/game.php?village=${game_data.village.id}&screen=market&ajax=exchange_data`);
    if (response.ok) {
        return await response.json();
    } else {
        console.error("HTTP-Error: " + response.status);
        return;
    }
}

/**
 * Update resource objects
 */
async function getRes() {
    let parentInc;
    warehouse = game_data.village.storage_max;
    wood.wh = game_data.village.wood;
    stone.wh = game_data.village.stone;
    iron.wh = game_data.village.iron;
    PremiumExchangeCustom.data = await fetchRes();
    wood.stock = PremiumExchangeCustom.data.capacity.wood;
    stone.stock = PremiumExchangeCustom.data.capacity.stone;
    iron.stock = PremiumExchangeCustom.data.capacity.iron;
    wood.price = PremiumExchangeCustom.calculateRateForOnePoint("wood");
    stone.price = PremiumExchangeCustom.calculateRateForOnePoint("stone");
    iron.price = PremiumExchangeCustom.calculateRateForOnePoint("iron");


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
    return "wat";
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

