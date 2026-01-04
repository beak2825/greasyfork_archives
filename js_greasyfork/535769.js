// ==UserScript==
// @name         Autobid
// @version      2025-05-09
// @description  Autobid with itemd
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @match        https://www.grundos.cafe/auctions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535769/Autobid.user.js
// @updateURL https://update.greasyfork.org/scripts/535769/Autobid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buying = {
        "Wand of the Snow Faerie": 250000,
        "Yellow Gelert Morphing Potion": 88000 ,
        "Secret Laboratory Map 3": 680000 ,
        "Striped Chia Morphing Potion": 200000,
    };
    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    if (    window.location.href.includes("/view/?auction_id=") ) {

        if (        $(`.flex.full-width.space-between:nth-child(1)`).text().includes('Arden') ) {
            console.log(`already top bidder`)
        } else {
            var item = $(`strong:contains( (owned by)`).text();
            item = item.substring(0, item.indexOf(" ("));

            if ( buying[item] > $(`input.form-control.well.full-width-mobile`).val() ){
                console.log(`bidding`)
                $(`[value="Place a Bid"]`).click();
            }
        }
    }else  if (    window.location.href.includes("/placebid/") ) {
        var viewUpdatedBids = $(`[value="View Updated Bids"]`).attr("onclick");
        viewUpdatedBids = viewUpdatedBids.substring(
            viewUpdatedBids.indexOf("?auction_id=") + 12,
            viewUpdatedBids.length
        );
        console.log(viewUpdatedBids)
        //   window.location.href = `https://www.grundos.cafe/auctions/view/?auction_id=` + viewUpdatedBids;

        window.location.href = "https://www.grundos.cafe/auctions/viewbids/";
    }else  if (    window.location.href.includes("/auctions/viewbids/") ) {
        $(`.data:nth-child(6n) a`).each(function(index){
            var bidThis = false;
            var bidder = $(this).text();
            if (bidder !== "Arden") {
                var itemName = $(this).parent().prev().prev().prev().prev().prev().find(`a`).text().trim();


                console.log(itemName)
                if ( buying[itemName] > parseInt($(this).parent().prev().prev().text()) ){
                    console.log(`bidding`)
                    var auctionURL   = $(this).parent().prev().prev().prev().prev().prev().find(`a`).attr("href");
                    console.log(auctionURL)
                    window.location.href = auctionURL;
                    return false
                }
            }
        })
        setTimeout(function () {
            window.location.href = "https://www.grundos.cafe/auctions/viewbids/";
        }, getRandomInt(60000, 120000));


    }
})();