// ==UserScript==
// @name        JD overseas price
// @description Show the price of overseas.jd.com in jd.com
// @version     1.0
// @author      Damon Zhou
// @include     http://*.jd.com/*
// @grant       GM_xmlhttpRequest
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @namespace https://greasyfork.org/users/13165
// @downloadURL https://update.greasyfork.org/scripts/10890/JD%20overseas%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/10890/JD%20overseas%20price.meta.js
// ==/UserScript==

var productPage = {FN_SetAllPrice: function(price) {
	return parseFloat(price.USD.jdPrice.replace(/[^\d.]/g, ""));
}};

var currency;
GM_xmlhttpRequest({
	synchronous: true,
	method: "GET",
	url: "http://api.fixer.io/latest?base=USD&symbols=CNY",
	onload: function(response) {
		currency = JSON.parse(response.responseText).rates.CNY;
	}
});

$("li.gl-item, li[sku], li.item-book").each(function() {
	var $oldPriceDiv = $(this).find("div.p-price");
	var $strong = $oldPriceDiv.find("strong");
	var $newPriceDiv = $("<div></div>").attr("class", "p-price");
	$oldPriceDiv.after($newPriceDiv);

	var price = parseFloat($strong.text().replace(/[^\d.]/g, ""));
	var id = $(this).children("div").attr("data-sku") || $strong.attr("class").replace("J_", "");

	GM_xmlhttpRequest({
		method: "GET",
		url: "http://overseas.jd.com/GetCurrency/" + id + "?callback=productPage.FN_SetAllPrice",
		onload: function(response) {
			var usd = eval(response.responseText);
			if (usd) {
				var cny = (usd * currency).toFixed(2);
				var diff = Math.abs(cny - price).toFixed(2);
				var diffpp = ((diff / price) * 100).toFixed();
				var symbol = cny >= price ? "↑" : "↓";
				
				$newPriceDiv.append("<span>¥" + cny + "</span>").append("<span style=\"margin-left: 20px; margin-right: 20px;\">¥" + diff + symbol + "</span>").append("<span>" + diffpp + "%" + symbol + "</span>");
			} else {
				$newPriceDiv.append("<span>No Price</span>");
			}
		}
	});
});
