// ==UserScript==
// @name         OpenSea Rankings Scraper
// @namespace    https://opensea.io/WilliamSL
// @version      1.3
// @description  Scrapes OpenSea rankings
// @author       WilliamL
// @match        https://opensea.io/rankings*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/440383/OpenSea%20Rankings%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/440383/OpenSea%20Rankings%20Scraper.meta.js
// ==/UserScript==

var intervalLength = 25;
var scrapeInterval, request1Interval, wait1Interval;
var hrefs = [];
var collections = {};
var doneScrape = false, doneRequest1 = false, doneWait1 = false;
var numWait1 = 0;

$(document).ready(function(){
    setInterval(checkNewPage, intervalLength);
});

var lastNewPageButton = "";
function checkNewPage() {
    var newPageButton = $("i[value='arrow_forward_ios']").first().parent().text();
    if(newPageButton != lastNewPageButton) {
        lastNewPageButton = newPageButton;
        hrefs = [];
        collections = {};
        doneScrape = false, doneRequest1 = false, doneWait1 = false;
        numWait1 = 0;
        if($("#wl-results").length > 0) {
            $("#wl-results").html("");
        }
        scrapeInterval = setInterval(scrape, intervalLength);
        request1Interval = setInterval(request1, intervalLength);
        wait1Interval = setInterval(wait1, intervalLength);
    }
}

function scrape() {
    $("a").each(function() {
        var href = $(this).attr("href");
        if(href.includes("/collection/")) {
            if(href.includes("https://opensea.io")) {
                href = href.replace("https://opensea.io", "");
            }
            if(href.includes("?")) {
                href = href.substring(0, href.indexOf("?"));
            }
            if(!hrefs.includes(href)) {
                hrefs.push(href);
                var slug = href.replace("/collection/", "");
                var owners = $(this).children().eq(5).text();
                if(owners.includes("K")) {
                    owners = owners.replace(".", "").replace("K", "");
                    owners += "00";
                }
                owners = parseInt(owners);
                var items = $(this).children().eq(6).text();
                if(items.includes("K")) {
                    items = items.replace(".", "").replace("K", "");
                    items += "00";
                }
                items = parseInt(items);
                collections[slug] = {status: "undetermined", owners: owners, items: items};
                if(owners > 100 && items > 100) {
                    collections[slug].status = "unrequested1";
                }
                else {
                    collections[slug].status = "ignored";
                }
                console.log("Scraped " + slug + " " + JSON.stringify(collections[slug]));
            }
        }
    });
    if(hrefs.length == 100) {
        doneScrape = true;
        clearInterval(scrapeInterval);
        console.log("Done scrape");
    }
}

function request1() {
    var requested1All = true;
    for(var [key, value] of Object.entries(collections)) {
        if(collections[key].status == "unrequested1") {
            collections[key].status = "waiting1";
            requested1All = false;
            $.get("https://api.opensea.io/api/v1/collection/" + key, {}, function(data) {
                var slug = data.collection.slug;
                collections[slug].owners = data.collection.stats.num_owners;
                collections[slug].items = data.collection.stats.count;
                collections[slug].name = data.collection.name;
                collections[slug].one_day_sales = data.collection.stats.one_day_sales;
                collections[slug].seven_day_sales = data.collection.stats.seven_day_sales;
                collections[slug].status = "done1";
                console.log("Requested1 " + slug + " " + JSON.stringify(collections[slug]));
            });
        }
    }
    if(doneScrape && requested1All) {
        doneRequest1 = true;
        clearInterval(request1Interval);
        console.log("Done request1");
    }
}

function wait1() {
    var waited1All = true;
    var thisNumWait1 = 0;
    for(var [key, value] of Object.entries(collections)) {
        if(collections[key].status == "waiting1") {
            waited1All = false;
        }
        else {
            thisNumWait1++;
        }
    }
    if(thisNumWait1 > numWait1) {
        numWait1 = thisNumWait1;
        if(doneRequest1 && waited1All) {
            doneWait1 = true;
            clearInterval(wait1Interval);
            console.log("Done wait1");
        }
        displayResults();
    }
}

function displayResults() {
    if($("#wl-results").length == 0) {
        var div = "<div id='wl-results' width='100%' style='font-size:150%;margin:auto;text-align:center;'></div>";
        $("#main").children().first().append(div);
    }
    var useCollections = [];
    var content = "<table><tr><th>Filtered collections</th></tr>";
    for(var [key, value] of Object.entries(collections)) {
        if(collections[key].status != "done1") {
            continue;
        }
        if(collections[key].items % 1000 == 0) {
            continue;
        }
        if(areDigitsSame(collections[key].items)) {
            continue;
        }
        if(collections[key].one_day_sales < 10 && collections[key].seven_day_sales < 50) {
            continue;
        }
        var clicked = GM_getValue("clicked-" + key, false);
        content += "<tr><td><a class='wl-collection' data-slug='" + key + "' style='color:" + (clicked ? "red" : "blue") + "' href='https://opensea.io/collection/" + key + "?tab=activity&search[isSingleCollection]=true&search[eventTypes][0]=ASSET_TRANSFER' target='_blank'>" + collections[key].name + "</a></td></tr>";
        useCollections.push(key);
    }
    content += "</table>";
    $("#wl-results").first().html(content);
    for(var i = 0; i < useCollections.length; i++) {
        $(".wl-collection[data-slug='" + useCollections[i] + "']").click(function() {
            var slug = $(this).attr("data-slug");
            GM_setValue("clicked-" + slug, true);
            $(this).css("color", "red");
            console.log("Clicked " + slug);
        });
    }
}

function areDigitsSame(num) {
    var first = num % 10;
    while(num) {
        if(num % 10 !== first) {
            return false;
        }
        num = Math.floor(num / 10);
    }
    return true;
}