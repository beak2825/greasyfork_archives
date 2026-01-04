// ==UserScript==
// @name         Cheaper market
// @include      /^https:\/\/www\.erepublik\.com\/[a-z]{2}$/
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Find undermarket prices
// @author       Nikolai Tsvetkov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382573/Cheaper%20market.user.js
// @updateURL https://update.greasyfork.org/scripts/382573/Cheaper%20market.meta.js
// ==/UserScript==

var $ = jQuery;
var lang = erepublik.settings.culture;
var refreshForeground = 30e3;
var refreshBackground = 120e3;
var qtys = {
    weapons: {
        q7: 100
    },
    houses: {
        q1: 2,
        q2: 2,
        q3: 2,
        q4: 1,
        q5: 1
    },
    food: {
        q1: 100000,
        q2: 100000,
        q3: 50000,
        q4: 20000,
        q5: 20000,
        q6: 20000,
        q7: 20000
    },
    tickets: {
        q5: 500
    },
    wrm: {
        q1: 1000
    },
    frm: {
        q1: 1000
    },
    hrm: {
        q1: 1000
    }
};

var marketLinks = {
    weapons: {
        q7: "2/7"
    },
    houses: {
        q1: "4/1",
        q2: "4/2",
        q3: "4/3",
        q4: "4/4",
        q5: "4/5"
    },
    food: {
        q1: "1/1",
        q2: "1/2",
        q3: "1/3",
        q4: "1/4",
        q5: "1/5",
        q6: "1/6",
        q7: "1/7"
    },
    tickets: {
        q5: "3/5"
    },
    wrm: {
        q1: "12/1",
    },
    frm: {
        q1: "7/1",
    },
    hrm: {
        q1: "17/1",
    }
}

var marketImages = {
    weapons: {
        q7: "2/q7.png"
    },
    houses: {
        q1: "4/q1.png",
        q2: "4/q2.png",
        q3: "4/q3.png",
        q4: "4/q4.png",
        q5: "4/q5.png"
    },
    food: {
        q1: "1/q1.png",
        q2: "1/q2.png",
        q3: "1/q3.png",
        q4: "1/q4.png",
        q5: "1/q5.png",
        q6: "1/q6.png",
        q7: "1/q7.png"
    },
    tickets: {
        q5: "3/q5.png"
    },
    wrm: {
        q1: "12/q1.png",
    },
    frm: {
        q1: "7/q1.png",
    },
    hrm: {
        q1: "17/q1.png",
    }
}

var foodQuality = {
    q1: 2,
    q2: 4,
    q3: 6,
    q4: 8,
    q5: 10,
    q6: 12,
    q7: 20
}

var imgCountry = {
    1: "Romania",
    9: "Brazil",
    10: "Italy",
    11: "France",
    12: "Germany",
    13: "Hungary",
    14: "China",
    15: "Spain",
    23: "Canada",
    24: "USA",
    26: "Mexico",
    27: "Argentina",
    28: "Venezuela",
    29: "United-Kingdom",
    30: "Switzerland",
    31: "Netherlands",
    32: "Belgium",
    33: "Austria",
    34: "Czech-Republic",
    35: "Poland",
    36: "Slovakia",
    37: "Norway",
    38: "Sweden",
    39: "Finland",
    40: "Ukraine",
    41: "Russia",
    42: "Bulgaria",
    43: "Turkey",
    44: "Greece",
    45: "Japan",
    47: "South-Korea",
    48: "India",
    49: "Indonesia",
    50: "Australia",
    51: "South-Africa",
    52: "Republic-of-Moldova",
    53: "Portugal",
    54: "Ireland",
    55: "Denmark",
    56: "Iran",
    57: "Pakistan",
    58: "Israel",
    59: "Thailand",
    61: "Slovenia",
    63: "Croatia",
    64: "Chile",
    65: "Serbia",
    66: "Malaysia",
    67: "Philippines",
    68: "Singapore",
    69: "Bosnia-Herzegovina",
    70: "Estonia",
    71: "Latvia",
    72: "Lithuania",
    73: "North-Korea",
    74: "Uruguay",
    75: "Paraguay",
    76: "Bolivia",
    77: "Peru",
    78: "Colombia",
    79: "Republic-of-Macedonia-FYROM",
    80: "Montenegro",
    81: "Republic-of-China-Taiwan",
    82: "Cyprus",
    83: "Belarus",
    84: "New-Zealand",
    164: "Saudi-Arabia",
    165: "Egypt",
    166: "United-Arab-Emirates",
    167: "Albania",
    168: "Georgia",
    169: "Armenia",
    170: "Nigeria",
    171: "Cuba"
}

function style(t) {
    $("head").append("<style>" + t + "</style>");
}

function getFlagById(id) {
    return "<img src='https://www.erepublik.net/images/flags_png/S/" + imgCountry[id] + ".png' alt=' " + imgCountry[id] + " '>";
}

function main() {
    $("#pdr").html("");
    $.ajax({
            dataType: "json",
            url: "/" + lang + "/economy/marketpicture",
        })
        .done(function(r) {
            var prices = [];
            var amounts = [];
            $.each(r, function(i, country) {
                $.each(qtys, function(market, qualities) {
                    if (typeof prices[market] == 'undefined') {
                        prices[market] = [];
                    }
                    if (typeof amounts[market] == 'undefined') {
                        amounts[market] = [];
                    }
                    $.each(qualities, function(quality, minAmount) {
                        if (typeof prices[market][quality] == 'undefined') {
                            prices[market][quality] = [];
                        }
                        if (typeof amounts[market][quality] == 'undefined') {
                            amounts[market][quality] = [];
                        }
                        if (typeof country[market] != 'undefined') {
                            if (typeof country[market][quality] != 'undefined') {
                                var row = country[market][quality][0];
                                var price = row.gross;
                                var amount = row.amount;
                                amounts[market][quality][i] = amount;
                                prices[market][quality].push({
                                    v: price,
                                    k: i
                                });
                            }
                        }
                    })
                });

            })
            $("#pdr").append("<table id='mqk'></table>");
            $.each(qtys, function(market, qualities) {
                $.each(qualities, function(quality, minAmount) {
                    var ct = 0;
                    var sorted = prices[market][quality].sort(function(a, b) {
                        if (a.v > b.v) {
                            return 1
                        }
                        if (a.v < b.v) {
                            return -1
                        }
                        return 0;
                    })
                    $.each(sorted, function(z, row) {
                        var amount = amounts[market][quality][row.k];
                        var price = row.v;
                        var nextPrice = sorted[ct+1].v;
                        var diff = ((nextPrice - price) / price) * 100;
                        var cclass = ct == 0 ? " class='frow'" : "";
                        cclass = ct < 3 && diff >= 5 ? " class='promo'" : cclass;
                        if (market != 'food' || diff > 10) {
                            var title = market == 'food' ? (price / foodQuality[quality]).toFixed(3) : '';
                            var tdImage = "<td><img src='https://www.erepublik.net/images/icons/industry/" + marketImages[market][quality] + "' alt='" + market + " " + quality + "'><a href='/en/economy/marketplace#" + row.k + "/" + marketLinks[market][quality] + "' target='_blank' title='" + title + "'>" + getFlagById(row.k) + "</a></td>";
                            var tdPrice = "<td>" + price.toFixed(2) + "</td>";
                            var tdPercent = "<td>" + diff.toFixed(3) + "</td>";
                            var tdAmount = "<td>" + amount + "</td>";
                            $('#mqk').append("<tr" + cclass + ">" + tdImage + tdPercent + tdAmount + tdPrice + "</tr>");
                        }
                        ct++;
                        return ct < 4;
                    });
                })
            })
        })
}

(function() {
    var refresh = refreshForeground;
    'use strict';
    style("#box{z-index: 99999; position: absolute; top: 0; right: 0;margin: 7px;padding: 5px;border-radius: 3px;font-size: 11px;background-color:rgba(255,255,255,0.8);border:1px solid #999;box-shadow: 2px 2px 2px #888888;};");
    style("#mqk td{text-align:right;border-bottom:1px solid gray;padding:0 2px;}");
    style(".frow {background-color: #ddffd6; font-weight: bold}");
    style("#mqk td img{width: 16px;}");
    style("#mqk td > img{width: 17px;}");
    style("#mqk td:nth-of-type(2){color:grey}");
    style("#mqk td:nth-of-type(3){color:navy}");
    style(".promo, #mqk .promo td:nth-of-type(2), #mqk .promo td:nth-of-type(3) {background-color: red; color: white; font-weight: bold}");
    $('body').after("<div id='box'><div id='pdr'></div></div>");
    main();
    setInterval(function () {
        main();
        refresh = document.hidden ? refreshBackground : refreshForeground;
    }, refresh);
})();