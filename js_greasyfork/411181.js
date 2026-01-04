// ==UserScript==
// @name         Discogs/Sell/SortByHave
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.discogs.com/sell/list*&have*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411181/DiscogsSellSortByHave.user.js
// @updateURL https://update.greasyfork.org/scripts/411181/DiscogsSellSortByHave.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var listings_list = document.getElementsByClassName("shortcut_navigable");

    var numErrors = 0
    for (var x = 0; x < listings_list.length; x++){
        try{
            if (listings_list[x] != null){
                var have = listings_list[x].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerText.trim().split(" ")[0].trim();
                have = parseInt(have);
                if (have >20){
                    listings_list[x].innerHTML = "";
                }
            }
        }
        catch (err){
            numErrors++;
            //console.log(err);
            listings_list[x].innerHTML = "";
        }
    }

    console.log(numErrors);


})();