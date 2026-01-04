// ==UserScript==
// @name         MobileSentrix Price Adjuster
// @namespace    https://www.mobilesentrix.com/
// @version      1.3
// @description  Shows TOA Tier prices for parts on MobileSentrix.com
// @author       Craig Gruenwald
// @match        https://www.mobilesentrix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374006/MobileSentrix%20Price%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/374006/MobileSentrix%20Price%20Adjuster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var TierPrices = [
        "69.99",
        "79.99",
        "89.99",
        "99.99",
        "109.99",
        "119.99",
        "129.99",
        "144.99",
        "159.99",
        "174.99",
        "189.99",
        "204.99",
        "219.99",
        "234.99",
        "249.99",
        "264.99",
        "279.99",
        "294.99",
        "309.99",
        "324.99",
        "339.99",
        "354.99",
        "369.99",
        "384.99",
        "399.99",
        "414.99",
        "429.99",
        "444.99",
        "459.99",
        "474.99"
    ];

    var JQ = jQuery.noConflict();

    JQ("span.regular-price > span.price").each(function (i,e) {
        var price = Number(JQ(e).text().replace("$",""), 10);
        var roundup = Math.ceil((price+1)/10)*10;
        var tier = Math.min(Math.max(roundup / 10, 1), TierPrices.length);
        var tierprice = TierPrices[tier-1];
        var depositprice = (tierprice/2).toFixed(2);

        console.log("price: "+price+" | roundup: "+roundup+" | tier: "+tier+" | Tier Price: "+tierprice);

        JQ(e).html("Tier "+tier+" repair: $"+tierprice+"<br>(Deposit: $"+depositprice+")").attr("alt", "Original Price: $"+price).attr("title", "Original Price: $"+price);
    });

})();