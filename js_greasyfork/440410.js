// ==UserScript==
// @name         OpenSea Listings Scraper
// @namespace    https://opensea.io/WilliamSL
// @version      1.0
// @description  Scrapes OpenSea listings
// @author       WilliamL
// @match        https://opensea.io/collection/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440410/OpenSea%20Listings%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/440410/OpenSea%20Listings%20Scraper.meta.js
// ==/UserScript==

var listings = {};
var scrapeInterval;

$(document).ready(function(){
    var intervalLength = 100;
    scrapeInterval = setInterval(scrape, intervalLength);
    $("h1").first().html("<button id='wl-get'>Get Scraped</button>");
    $("#wl-get").first().click(function() {
        console.log(JSON.stringify(listings));
    });
});

function scrape() {
    $("a").each(function() {
        var href = $(this).attr("href");
        if(href.includes("/assets/")) {
            var split = href.split("/");
            if(split.length < 4) {
                return;
            }
            var edition = parseInt(split[3]);
            if(!(edition in listings)) {
                var price = parseFloat($(this).children().eq(1).children().first().children().eq(1).children().first().children().eq(1).children().eq(1).text());
                listings[edition] = {"price": price};
                console.log("Scraped " + edition + " " + JSON.stringify(listings[edition]));
            }
        }
    });
}