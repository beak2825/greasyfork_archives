// ==UserScript==
// @name         SteamGifts Blacklist Searcher (steamgifts.com)
// @version      1.4
// @description  Tired of getting blacklisted on SteamGifts? Want to counter those blacklisters? Run this script and find dem blacklisters! Note: script is very slow and uses lots of memory and may crash from time to time, and you will not be able to do anything on that tab (Script runs on https://www.steamgifts.com/users)
// @match        https://www.steamgifts.com/users
// @grant    GM_getValue
// @grant    GM_setValue
// @license  MIT License
// @namespace https://greasyfork.org/users/73819
// @downloadURL https://update.greasyfork.org/scripts/24165/SteamGifts%20Blacklist%20Searcher%20%28steamgiftscom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24165/SteamGifts%20Blacklist%20Searcher%20%28steamgiftscom%29.meta.js
// ==/UserScript==

var url = "https://www.steamgifts.com/users/search?page=";
var page = prompt("Which page from https://www.steamgifts.com/users do you want to start searching from?", GM_getValue ("SGUserPage", 1));
GM_setValue ("SGUserPage", page === null? GM_getValue ("SGUserPage", 1) : page);

var numBlackLists = prompt("How many blacklists do you have left from that page?", GM_getValue ("numBlackLists", 0));
GM_setValue ("numBlackLists", numBlackLists === null? GM_getValue ("numBlackLists", 0) : numBlackLists);

var user;

function logAndAlertBlacklister(user) {
    console.log("You have been blacklist by: " + user); // ( Mew2, page 23284)
    alert("You have been blacklist by: " + user);
}

function checkGiveawayPage(result){
    // check if they blacklisted us :(
    var blacklistDiv = $(result).find("div[class='table__column--width-fill']:contains('been blacklisted by the giveaway creator')");
    if (blacklistDiv.length) {
        logAndAlertBlacklister(user);
        numBlackLists--;
        GM_setValue ("numBlackLists", numBlackLists);
    }

    // cleanup
    var i;
    for(i in blacklistDiv){
        delete blacklistDiv[i];
    }
    i = undefined;
    blacklistDiv = undefined;
    result = undefined;
}

function getGiveawayLinks(result){
    links = $(result).find("a[href*='/giveaway/']:eq(1)");
    next = $(result).find("span:contains('Next')");
    noNext = (next.length === 0); // defined in parent function

    var j;
    for (j in result) {
        try{
            delete result[j];
        } catch(e) {
            // nothing
        }
    }
    result = undefined;
}

function getGivewayLinksFromUserProfile(result){
    var links = $(result).find("a[href*='/giveaway/']:eq(1)");
    var next = $(result).find("span:contains('Next')");
    var curPage = 1;
    var noNext = (next.length === 0);
    while (links.length === 0) {
        // user has all private giveaways, can't check if they blacklisted you
        if (noNext) {
            links = undefined;
            next = undefined;
            noNext = undefined;
            curPage = undefined;
            return false;
        }
        curPage++;
        $.ajax({
            url: link + "/search?page=" + curPage,
            type: "GET",
            async: false, // check one at a time
            success: getGiveawayLinks
        });
    }
    $.ajax({
        url: links[0].href,
        type: "GET",
        async: false,
        success: checkGiveawayPage
    });
    GM_setValue(user, links[0].href);
    var i;
    for(i in links){ // clear memory
        delete links[i];
    }
    links = undefined;
    var j;
    for (j in result) {
        try{
            delete result[j]; // try clearing result
        } catch(e) {
            // nothing
        }
    }
    result = undefined;
    i = undefined;
    j = undefined;
    links = undefined;
    next = undefined;
    noNext = undefined;
    curPage = undefined;
}

// loop forever until we found all blacklists
while (numBlackLists > 0) {
    $.ajax({
        url: url + page,
        type: "GET",
        async: false, // check one at a time
        success: function(result){
            var innerDivs = $(result).find("div[class='table__row-inner-wrap']");
            innerDivs.each(
                function(){
                    // skip level 0, most have 0 giveaways, very low probability of them being the one to blacklist you
                    var spans = $(this).find("span");
                    if (spans.first().text() !== "0") {
                        var as = $(this).find("a");
                        var first = as.first();
                        var second = as.eq(1);
                        user = second[0].text;
                        var link = first[0].href;
                        userGiveawayLink = GM_getValue(user, "none");
                        if (userGiveawayLink != "none") {
                            $.ajax({
                                url: userGiveawayLink,
                                type: "GET",
                                async: false,
                                success: checkGiveawayPage
                            });
                            return false;
                        }
                        $.ajax({
                            url: link,
                            type: "GET",
                            async: false, // check one at a time
                            success: getGivewayLinksFromUserProfile
                        });
                        link = undefined;
                        var i;
                        for(i in first){ // clear memory
                            delete first[i];
                        }
                        first = undefined;
                        var j;
                        for(j in second){ // clear memory
                            delete second[j];
                        }
                        second = undefined;
                        var k;
                        for(k in as){ // clear memory
                            delete as[i];
                        }
                        as = undefined;
                        i = undefined;
                    }
                    var l;
                    for(l in spans){ // clear memory
                        delete spans[l];
                    }
                    spans = undefined;
                    var m;
                    for(m in this){ // clear memory
                        try{
                            delete this[m]; // try clearing result
                        } catch(e) {
                            // nothing
                        }
                    }
                    spans = undefined;
                    l = undefined;
                    m = undefined;
                }
            );
            var i;
            for(i in innerDivs){ // clear memory
                delete innerDivs[i];
            }
            innerDivs = undefined;
            var j;
            for (j in result) {
                try{
                    delete result[j]; // try clearing result
                } catch(e) {
                    // nothing
                }
            }
            result = undefined; // does this clear memory?
            i = undefined;
            j = undefined;
        }
    });
    console.log("Completed Page " + page +", Number of Blacklist(s) left: "+ numBlackLists);
    page++;
    GM_setValue ("SGUserPage", page);
}

alert("All Blacklists have been found!");