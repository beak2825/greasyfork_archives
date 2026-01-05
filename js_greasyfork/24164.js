// ==UserScript==
// @name         SteamGifts Blacklist Searcher
// @version      1.0
// @description  Look through all users and find who blacklisted you. Note: script is very slow and uses lots of memory and may crash from time to time, and you will not be able to do anything on that tab
// @match        https://www.steamgifts.com/users
// @grant    GM_getValue
// @grant    GM_setValue
// @namespace https://greasyfork.org/users/73819
// @downloadURL https://update.greasyfork.org/scripts/24164/SteamGifts%20Blacklist%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/24164/SteamGifts%20Blacklist%20Searcher.meta.js
// ==/UserScript==

var url = "https://www.steamgifts.com/users/search?page=";
var page = prompt("Which page from https://www.steamgifts.com/users do you want to start searching from?", GM_getValue ("SGUserPage", 1));
GM_setValue ("SGUserPage", page);

var numBlackLists = prompt("How many blacklists do you have left from that page?", GM_getValue ("numBlackLists", 0));
GM_setValue ("numBlackLists", numBlackLists);

// loop forever until we found all blacklists
while (numBlackLists > 0) {
    $.ajax({
        url: url + page,
        type: "GET",
        async: false, // check one at a time
        success: function(result){
            $(result).find("div[class='table__row-inner-wrap']").each(
                function(){
                    // skip level 0, most have 0 giveaways, very low probability of them being the one to blacklist you
                    if ($(this).find("span").first().text() !== "0") {
                        var user = $(this).find("a").eq(1)[0].text;
                        $.ajax({
                            url: $(this).find("a").first()[0].href,
                            type: "GET",
                            async: false, // check one at a time
                            success: function(result){
                                var links = $(result).find("a[href*='/giveaway/']:eq(1)");
                                // rare case that all giveaways are private, could fail if the first page just happens to have all private giveaways and no group or public giveaways, but very low probability, willing to let this go
                                if(links.length === 0) {
                                    return false;
                                }
                                $.ajax({
                                    url: links[0].href,
                                    type: "GET",
                                    async: false, // check one at a time
                                    success: function(result){
                                        // check if they blacklisted us :(
                                        if ($(result).find("div[class='table__column--width-fill']:contains('been blacklisted by the giveaway creator')").length) {
                                            alert("You have been blacklist by: " + user); // ( WRPBeater )
                                            numBlackLists--;
                                            GM_setValue ("numBlackLists", numBlackLists);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            );
        }
    });
    console.log("Completed Page " + page +", Number of Blacklist(s) left: "+ numBlackLists);
    page++;
    GM_setValue ("SGUserPage", page);
}

alert("All Blacklists have been found!");
