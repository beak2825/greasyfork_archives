// ==UserScript==
// @name                SM - Convert automatically balance to usd
// @namespace           Hash G.
// @description         Balance -> USD.
// @include             *satoshimines.com*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version             1.0
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11671/SM%20-%20Convert%20automatically%20balance%20to%20usd.user.js
// @updateURL https://update.greasyfork.org/scripts/11671/SM%20-%20Convert%20automatically%20balance%20to%20usd.meta.js
// ==/UserScript==

var balance, btcAPI, usd;

$(document).bind("DOMSubtreeModified", function() {
	$(".balance > div:nth-child(1) > div:nth-child(1), #start_game, .cashout").on("click", function (){
		GM_xmlhttpRequest({
		method: "GET",
		url: "http://hashg.xyz/OMC-Rates/a.php",
			onload: function(response) {
				var responseText = response.responseText;
				var splittedResponse = responseText.split(":");
				btcAPI = splittedResponse[0] / 1000000;
				balance = $(".num").html();
				usd = btcAPI * balance;
				$(".balance > div:nth-child(1) > div:nth-child(1)").append("<span id='usdvalue'></span>");
				$("#usdvalue").html("= $" + usd.toFixed(3));
			}
		});
	});
});