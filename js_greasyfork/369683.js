// ==UserScript==
// @name            GRLCBuy Helper
// @description:en  Various fixes and convenience features for GRLCBuy
// @version         0.9.0
// @author          Vilsol
// @match           https://grlcbuy.com/*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @namespace       https://greasyfork.org/users/192441
// @description Various fixes and convenience features for GRLCBuy
// @downloadURL https://update.greasyfork.org/scripts/369683/GRLCBuy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/369683/GRLCBuy%20Helper.meta.js
// ==/UserScript==

GM_addStyle('@import "https://use.fontawesome.com/releases/v5.1.0/css/all.css";')

let sidebarOpen = GM_getValue("sidebarOpen", false);

(function() {
    'use strict';

    switch(location.pathname){
        case "/":
        case "/index.php": {
            // Sidebar
            const sidebar = $($(".container-fluid .col-sm")[0]);

            if (!sidebarOpen) {
                sidebar.find("form").hide();
                sidebar.css("max-width", "70px");
                const button = sidebar.prepend("<button class='btn btn-info'><i class='fas fa-arrow-right'></i></button>").find("button").first();
                button.click(toggleSidebar);
            } else {
                const button = sidebar.prepend("<button class='btn btn-info'><i class='fas fa-arrow-left'></i></button>").find("button").first();
                button.click(toggleSidebar);
            }
            sidebar.css("transition", "max-width ease-in-out 0.5s");

            const container = $(".container-fluid .row");
            $(container.children()[0]).toggleClass("col-sm").toggleClass("col-sm-2");
            $(container.children()[1]).toggleClass("col-sm-7").toggleClass("col-sm");
            $(container.children()[2]).toggleClass("col-sm").toggleClass("col-sm-2");

            const table = $("table.table.table-no-border");
            const children = table.find("tbody tr");
            children.each((i, elem) => {
                const badge = $(elem).find(".badge").last();
                const badgeParent = badge.parent();
                const data = badge[0].innerHTML.split(",");
                badge.remove();

                const rating = parseInt(data[0]) + parseInt(data[1]);
                const percentPositive = parseInt(data[0]) / (parseInt(data[0]) + Math.abs(parseInt(data[1]))) * 100;

                let color = 'success'
                let icon = 'star';
                if (percentPositive < 50) {
                    color = 'danger'
                    icon = 'thumbs-down';
                } else if (percentPositive < 70) {
                    color = 'warning'
                    icon = 'thumbs-down';
                } else if (percentPositive < 95) {
                    icon = 'thumbs-up';
                }

                badgeParent.append("<span class='badge badge-" + color + "' title='" + parseInt(data[0]) + " up, " + Math.abs(parseInt(data[1])) + " down'><i class='fas fa-" + icon + "'></i> " + rating + "</span>");
            })
            break;
        }
    }

    fetchPrice((GRLCPrice) => {
        // Balance
        const balance = $("span:contains('Balance:')");
        if (balance.length) {
            balance[0].innerHTML = balance[0].innerHTML.trim().substring(0, 10) + balance[0].innerHTML.trim().substring(10) + ", $" + (balance[0].innerHTML.trim().substring(10) * GRLCPrice).toFixed(2);
        }

        // Exchange
        const navbar = $("nav .navbar-nav");
        if (navbar.length) {
            navbar.append('<div class="form-inline my-2 my-lg-0" id="EForm"></div>');
            const form = $("#EForm");
            form.append('<div class="input-group"><input class="form-control" type="text" placeholder="GRLC" value="1" id="GRLCe" style="width: 100px"/><div class="input-group-append"><span class="input-group-text" id="basic-addon2">GRLC</span></div></div>');
            form.append('<div style="padding: 8px"><i class="fas fa-arrows-alt-h"></i></div>');
            form.append('<div class="input-group"><input class="form-control" type="text" placeholder="USD" value="' + GRLCPrice.toFixed(2) + '" id="USDe" style="width: 100px"/><div class="input-group-append"><span class="input-group-text" id="basic-addon2">USD</span></div></div>');
            const grlcExchange = $("#GRLCe");
            const usdExchange = $("#USDe");
            grlcExchange.keyup(() => {
                const amount = grlcExchange.attr("value") || 0;
                usdExchange.attr("value", (amount * GRLCPrice).toFixed(2));
            });
            usdExchange.keyup(() => {
                const amount = usdExchange.attr("value") || 0;
                grlcExchange.attr("value", (amount / GRLCPrice).toFixed(2));
            });
        }

        switch(location.pathname){
            case "/":
            case "/index.php": {
                // Pricing
                const table = $("table.table.table-no-border");
                const children = table.find("tbody tr");
                children.each((i, elem) => {
                    const price = $(elem).children()[3];
                    price.innerHTML = price.innerHTML + ", $" + (price.innerHTML.substring(1) * GRLCPrice).toFixed(2);
                })
                break;
            }
            case "/item.php": {
                // Pricing
                const price = $(".container-fluid label:contains('Price')").next();
                const elem = price.children()[1];
                const side = price.append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                side.innerHTML = "$" + (elem.value * GRLCPrice).toFixed(2);
                break;
            }
            case "/createauc.php":
            case "/createbin.php": {
                // Pricing
                const price = $("input[name='price']");
                const usdPrice = price.parent().append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                price.keyup(() => {
                    const amount = price.attr("value") || 0;
                    usdPrice.innerHTML = "$" + (amount * GRLCPrice).toFixed(2);
                });
                break;
            }
            case "/withdraw.php": {
                // Pricing
                const price = $("input[name='amount']");
                const usdPrice = price.parent().append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                price.keyup(() => {
                    const amount = price.attr("value") || 0;
                    usdPrice.innerHTML = "$" + (amount * GRLCPrice).toFixed(2);
                });

                // Balance
                const balance = $(".container-fluid label:contains('Balance')").next();
                const elem = balance.children()[1];
                const side = balance.append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                side.innerHTML = "$" + (elem.value * GRLCPrice).toFixed(2);
                break;
            }
            case "/me.php": {
                // Balance
                const balance = $(".container-fluid label:contains('Balance')").next();
                const elemBalance = balance.children()[1];
                const sideBalance = balance.append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                sideBalance.innerHTML = "$" + (elemBalance.value * GRLCPrice).toFixed(2);

                // Balance
                const frozen = $(".container-fluid label:contains('Frozen Funds')").next();
                const elemFrozen = frozen.children()[1];
                const sideFrozen = frozen.append('<div class="input-group-append"><span class="input-group-text">$0</span></div>').find(".input-group-append .input-group-text")[0];
                sideFrozen.innerHTML = "$" + (elemFrozen.value * GRLCPrice).toFixed(2);

                // Pricing
                const table = $("table.table.table-no-border");
                const children = table.find("tbody tr");
                children.each((i, elem) => {
                    const price = $(elem).children()[1];
                    price.innerHTML = price.innerHTML + ", $" + (price.innerHTML.substring(1) * GRLCPrice).toFixed(2);
                })
                break;
            }
        }
    });
})();

function toggleSidebar() {
    const sidebar = $($(".container-fluid .col-sm-2")[0]);
    const form = sidebar.find("form");
    const button = sidebar.find("button")[0];

    if (!sidebarOpen) {
        sidebar.css("max-width", "")
        button.innerHTML = "<i class='fas fa-arrow-left'></i>";
        form.show();
    } else {
        sidebar.css("max-width", "70px")
        button.innerHTML = "<i class='fas fa-arrow-right'></i>";
        form.hide();
    }
    sidebarOpen = !sidebarOpen;
    GM_setValue("sidebarOpen", sidebarOpen);
}

function fetchPrice(callback) {
    const cache = GM_getValue("GRLCPrice");
    if (cache && (new Date()).getTime() - cache.updated < 60000) {
        callback(cache.price);
        return;
    }
    $.ajax ( {
        type:       'GET',
        url:        'https://api.coinmarketcap.com/v2/ticker/2475/',
        dataType:   'JSON',
        success:    function (apiJson) {
            GM_setValue("GRLCPrice", {"price": apiJson.data.quotes.USD.price, updated: (new Date()).getTime()})
            callback(apiJson.data.quotes.USD.price);
        }
    });
}