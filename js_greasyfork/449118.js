// ==UserScript==
// @name         [Neopets][Auction][incogniti] Auto Bid
// @version      0.1
// @namespace    incogniti
// @license      BSD
// @description  Auto-bidding in Auction
// @author       friend@incogniti
// @match        http*://www.neopets.com/auctions.phtml?type=bids&auction_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/449118/%5BNeopets%5D%5BAuction%5D%5Bincogniti%5D%20Auto%20Bid.user.js
// @updateURL https://update.greasyfork.org/scripts/449118/%5BNeopets%5D%5BAuction%5D%5Bincogniti%5D%20Auto%20Bid.meta.js
// ==/UserScript==


let biddingItems = GM_getValue('biddingItem', []);

housekeepAuctionItem();
let autobid = biddingItems.some(el => el.auctionId === getQueryParams().auction_id);
let btnText = autobid ? 'Stop Auto Bidding' : 'Start Auto Bidding';

let increment = 0; //5000 max
var refPageLimit = 100;

console.log('>>>> ' + autobid);
$('a[href="/auctions.phtml?type=status"]').parent().after('<br><br><center><button id="autobid">' + btnText + '</button><br><span id="bidstatus"></span></center>');
$('#autobid').live("click", function() {
    let item = {};
    item.auctionId = getQueryParams().auction_id;
    console.log(item);
    autobid = !autobid;
    if (autobid) {
        item.startTime = new Date().getTime();
        biddingItems.push(item);
    } else {
        biddingItems = biddingItems.filter(function( obj ) {
            return obj.auctionId !== item.auctionId;
        });
    }
    console.log(biddingItems);
    GM_setValue('biddingItem', biddingItems);

    //GM_setValue('autobid', !GM_getValue('autobid', false));
    //autobid = GM_getValue('autobid', false);
    console.log(autobid);
    btnText = autobid ? 'Stop Auto Bidding' : 'Start Auto Bidding';
    $('#autobid').html(btnText);

    if (autobid) {
        bid();
    }
});

if (autobid) {
    $('span#bidstatus').text('Status: Trying to bid...');
    bid();
}

function housekeepAuctionItem() {
    if (!biddingItems.length) {
        biddingitems = [];
    }
    var twodaysago = new Date().getTime() - (2 * 24 * 60 * 60 * 1000);
    //                                      day hour  min  sec  msec

    biddingItems = biddingItems.filter(function( obj ) {
        return obj.startTime > twodaysago;
    });

    GM_setValue('biddingItem', biddingItems);
}

function bid() {

    $orivalue = $("input[name='amount']").val();
    $orivalue = parseInt($orivalue.replace(/,/g, ''));

    $v = $("a[href*='randomfriend.phtml']").first();
    $td = $v.parent();
    $tr = $td.parent();

    var isLastMe = false;
    var firstUser = $("a[href*='randomfriend.phtml']").first().parent().html();
    if (firstUser) {
        firstUser = firstUser.replace(/<a\b[^>]*>(.*?)<\/a>/i,"").trim();
        console.log(firstUser);
        const me = $('td:contains("Welcome,")').children().html().replace(/<\b[^>]*>(.*?)<\/.*>/i,"");
        console.log(me);
        if (firstUser == me) {
            isLastMe = true;
        }
    }

    if (!isLastMe) {
        var np = $tr.children('td').eq(1).children('b').eq(0).text();
        np = np.replace(/,/g, '');
        np = np.replace(" NP", '');
        np = parseInt(np);

        if (!np) {
            np = $orivalue;
        } else {

            // Add initial increment
            var minInc = $('p:contains("The minimum increment value for this item is ")').children('b').eq(1).text();
            minInc = minInc.replace(/,/g, '');
            minInc = minInc.replace(" NP", '');
            minInc = parseInt(minInc);

            np += minInc;
        }

        np += increment;



        $('[name="amount"]').val(np);


        console.log("submit:"+np);

        $('span#bidstatus').text('Status: Auto Bidding at ' + np + 'np');
        submitForm();
    } else {
        $('span#bidstatus').text('Status: You are the last bidder!');
    }
}

function submitForm() {
    var http = new XMLHttpRequest();
    http.open("POST", "https://www.neopets.com/auctions.phtml?type=placebid", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    let np = $('input[name=amount]').val();
    var params = "auction_id=" + $('input[name=auction_id]').val() + "&_ref_ck=" + $('input[name=_ref_ck]').val() + "&amount=" + $('input[name=amount]').val();
    http.send(params);
    http.onload = function() {
		let responseText = http.responseText;
		let pattern = /BID SUCCESSFUL/i;
		let result = responseText.match(pattern);
        if (result) {
            $('span#bidstatus').text('Status: Bidded at ' + np + 'np successfully');
			console.log("Bid successful");
		} else {
            $('span#bidstatus').text('Status: Failed bid at ' + np + 'np');
			console.log("Bid failed");
		}
    }
}

function getQueryParams() {
    let qs = document.location.search;
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}