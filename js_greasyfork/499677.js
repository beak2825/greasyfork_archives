// ==UserScript==
// @name         PWCC Bid details
// @namespace    viral
// @version      2024-07-01
// @description  Shows changes in bid prices & total/net bids on the PWCC selling page.
// @author       Viral
// @match        https://members.pwccmarketplace.com/marketplace/my-selling/auctions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pwccmarketplace.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499677/PWCC%20Bid%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/499677/PWCC%20Bid%20details.meta.js
// ==/UserScript==

/* global $ */

$(document).ready(function () {

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    let USD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    var state_maps = (function () {
        var states = (getCookie("pwcc_pricing") || "").split("&")
        var map = {};
        var s = 0;
        var state_count = states.length;
        while (s < state_count) {
            if (states[s]) {
                var state_split = states[s].split("=")
                var prices = state_split[1].split("|")
                map[state_split[0]] = [+prices[0], +prices[1]]
            }
            s++;
        }
        return map;
    })()

    var get_state = (function (map) {
        return function (id) {
            return map[id]
        };
    })(state_maps);

    var set_state = (function (map) {
        return function (id, bid, net) {
            map[id] = [+bid, +net]
        };
    })(state_maps);

    var update_state = (function (map) {
        return function () {
            var states = [];
            for (const [key, value] of Object.entries(map)) {
                states[states.length] = key + "=" + value[0] + "|" + value[1]
            }
            setCookie("pwcc_pricing", states.join("&"), 10);
        };
    })(state_maps);

    var total_bid = 0
    var total_net = 0
    var active_bid = 0
    var active_net = 0

    var total_change_bid = 0
    var total_change_net = 0

    $("td.final-bid").each(
        function () {

            // For unlisted (upcoming) auctions the price will be '-' and bid-price does not exist.
            if (!$(this).find("div.bid-price").length) {
                return;
            }

            var cur_bid = +$(this).find("div.bid-price").eq(0).text().match(/\$([\d,]+)/)[1].replace(/\,/, "")
            var cur_net = +$(this).next().eq(0).text().match(/\$([\d,]+)/)[1].replace(/\,/, "")
            if ($(this).next().next().text().match(/Active \-/)) {
                active_bid += cur_bid
                active_net += cur_net
            }
            total_bid += cur_bid
            total_net += cur_net

            var url = $(this).prev().find("a:first").attr("href");
            var id = url.match(/\/(\d+)$/)[1]

            var stored_prices = get_state(id)

            if (stored_prices === undefined) {
                set_state(id, cur_bid, cur_net)
            } else if (stored_prices[0] !== cur_bid || stored_prices[1] !== cur_net) {
                total_change_bid += cur_bid - stored_prices[0]
                total_change_net += cur_net - stored_prices[1]

                $(this)
                    .find("div.bid-price:first")
                    .html(
                        total_change_bid > 0
                            ? "<del>" + USD.format(stored_prices[0]) + "</del> " + USD.format(cur_bid)
                            : USD.format(cur_bid)
                    )
                    .end().next()
                    .html(
                        total_change_net > 0
                            ? "<del>" + USD.format(stored_prices[1]) + "</del> " + USD.format(cur_net)
                            : USD.format(cur_net)
                    )
                    .closest(".item").insertAfter($(this).closest("table").find("th:first").parent())

                set_state(id, cur_bid, cur_net)
            }

        }
    );

    update_state()

    var change_bid_desc = (total_change_bid > 0) ? "<br /><small>+" + USD.format(total_change_bid) + "</small>" : "";
    var change_net_desc = (total_change_net > 0) ? "<br /><small>+" + USD.format(total_change_net) + "</small>" : "";

    $("div.list-view.results table th:eq(2)")
        .html(
            "Current bid<br /><small>(Active: " + USD.format(active_bid) + ")<br />(Total: " + USD.format(total_bid) + ")</small>" + change_bid_desc
        ).next().html(
            "Seller net<br /><small>(Active: " + USD.format(active_net) + ")<br />(Total: " + USD.format(total_net) + ")</small>" + change_net_desc
        )
});