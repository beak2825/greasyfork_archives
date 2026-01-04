// ==UserScript==
// @name         [Neopets][Auction] Auto Bid and Refresh
// @version      0.3
// @namespace    richardscoot@clraik
// @license      BSD
// @description  Auto-bidding in Auction
// @author       richardscoot@clraik
// @match        http*://www.neopets.com/auctions.phtml?type=bids&auction_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/448837/%5BNeopets%5D%5BAuction%5D%20Auto%20Bid%20and%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/448837/%5BNeopets%5D%5BAuction%5D%20Auto%20Bid%20and%20Refresh.meta.js
// ==/UserScript==


let autobid = GM_getValue('autobid', false);
let btnText = GM_getValue('autobid', false) ? 'Stop Auto Bidding' : 'Start Auto Bidding';

let increment = 0; //5000 max
var refPageLimit = 100;

console.log('>>>> ' + autobid);
$('#content > table > tbody > tr > td.content > center:nth-child(3)').after('<button id="autobid">' + btnText + '</button>');
$('#autobid').live("click", function() {
  GM_setValue('autobid', !GM_getValue('autobid', false));
  autobid = GM_getValue('autobid', false);
    console.log(autobid);
  btnText = GM_getValue('autobid', false) ? 'Stop' : 'Start';
  $('#autobid').html(btnText);

  if (autobid) {
       refpage();
  }
});

function refpage() {
    if (refPageLimit > 0 && autobid) {
        refPageLimit--;
        $.ajax({
            url: "",
            context: document.body,
            success: function(s,x){

                console.log(s);

                let responseText = s;
                let pattern = /is using a security service for protection against online attacks/i;
                let result = responseText.match(pattern);
                if (result) {
                    window.location.reload();
                    return;
                }
                var tableContentHTML = $(s).find('#content > table > tbody > tr > td.content > center:nth-child(8) > p:nth-child(3) > table').parent().html();;
                if ($('#content > table > tbody > tr > td.content > center:nth-child(9) > p:nth-child(3)').length) {
                    $('#content > table > tbody > tr > td.content > center:nth-child(9) > p:nth-child(3)').html(tableContentHTML);
                } else {
                    $('#content > table > tbody > tr > td.content > center:nth-child(9) > p:nth-child(3) > table').html(tableContentHTML);
                }

                pattern = /you cannot place any more bids/i;
                result = responseText.match(pattern);
                if (result) {
                    $('#content > table > tbody > tr > td.content > center:nth-child(9) > form').html('<hr><center>This auction is closed, you cannot place any more bids!<hr><form action="auctions.phtml" method="post"><input type="submit" value="Back to Auctions"></form><br clear="all"></center>');
                    return;
                } else {
                    setTimeout(refpage, (50 + Math.floor(Math.random() * 200)));
                    bid();
                }
            }
        });
    }
}
refpage();

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
        submitForm();
    }
}

function submitForm() {
    var http = new XMLHttpRequest();
    http.open("POST", "https://www.neopets.com/auctions.phtml?type=placebid", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var params = "auction_id=" + $('input[name=auction_id]').val() + "&_ref_ck=" + $('input[name=_ref_ck]').val() + "&amount=" + $('input[name=amount]').val();
    http.send(params);
    http.onload = function() {
		let responseText = http.responseText;
		let pattern = /BID SUCCESSFUL/i;
		let result = responseText.match(pattern);
        if (result) {
			console.log("Bid successful");
		} else {
			console.log("Bid failed");
		}
    }
}