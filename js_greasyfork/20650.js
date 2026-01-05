// ==UserScript==
// @name        Price Variation
// @namespace   PriceVariation
// @description Embeds CamelCamelCamel price chart in Amazon
// @include        http://www.amazon.*/*
// @include        https://www.amazon.*/*
// @version     20160613
// @grant       none
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/20650/Price%20Variation.user.js
// @updateURL https://update.greasyfork.org/scripts/20650/Price%20Variation.meta.js
// ==/UserScript==

var width=500;
var height = 200;
var duration = "1y";

$(document).ready(function () {
	var element = $(':input[name="ASIN"]');
        var arr = document.domain.split(".");
        var country = arr[arr.length - 1];
		if (country == "com") { var country = "us"; }
	if (element) {
		var asin = $.trim(element.attr("value"));
		var link = "<a  target='blank' href='http://"+country+".camelcamelcamel.com/product/" + asin + "'><img src='http://charts.camelcamelcamel.com/"+country+"/" + asin + "/amazon.png?force=1&zero=0&w="+width+"&h="+height+"&desired=false&legend=1&ilt=1&tp=" + duration + "&fo=0' /></a>";
		$("#availability").append("<div id='camelcamelcamel' style='margin-top: 0px; margin-left: 0px'>" + link + "</div>");
	}
});