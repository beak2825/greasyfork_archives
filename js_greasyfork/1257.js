// ==UserScript==
// @name		WRMdoc™ Helper
// @namespace		WRMdocHelper
// @description		This simple script will provide easier buying from WRMdoc™ [http://bit.ly/WRMdocTM].
// @require		http://code.jquery.com/jquery-2.0.3.min.js
// @include		*erepublik.com/*/main/messages*
// @include		*erepublik.com/*/economy/market/*?*
// @version		5.2
// @downloadURL https://update.greasyfork.org/scripts/1257/WRMdoc%E2%84%A2%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/1257/WRMdoc%E2%84%A2%20Helper.meta.js
// ==/UserScript==

function CustomOffer() {
	var t, e, n, l
	if ($(".success_message").length <= 0 && $(".error_message").length <= 0) {
		localStorage.BuyingLog = "";
		localStorage.BuyingTime = "";
		$("#marketplace table").before("<h1><a style='color:#009925;'>Step 1)</a> Buy desired quantity</h1>")
		if (t = window.location.href, e = t.split("?")[1], "undefined" == typeof e) return
		if (r = "true" == e.split("customOffer=")[1].split("&")[0] ? !0 : !1, i = parseInt(e.split("sellerId=")[1].split("&")[0]), s = decodeURI(e.split("sellerName=")[1].split("&")[0]), o = parseInt(e.split("offerId=")[1].split("&")[0]), u = parseInt(e.split("offerAmount=")[1].split("&")[0]), a = e.split("offerPrice=")[1], !r || isNaN(i) || isNaN(u) || isNaN(a)) return
		$("#marketplace table tbody tr:not(:first)").remove(), $("#marketplace .pager").remove(), n = $("#marketplace table tbody tr:first"), $(".m_product", n).attr("id", "productId_" + o), $(".m_provider a", n).attr("href", "/en/citizen/profile/" + i), $(".m_provider a", n).text(s), $(".m_stock", n).text(u), $(".m_price strong:first", n).text(a.split(".")[0]), l = $(".m_price sup strong", n), $(".m_price sup", n).html("." + a.split(".")[1] + " " + l[0].outerHTML), $(".m_quantity input", n).attr("id", "amount_" + o), $(".m_quantity input", n).attr("maxlength", "6"), $(".m_buy a", n).attr("id", o), $(".m_buy a", n).attr("data-max", u)
	}
	else if ($(".success_message").length > 0) {
		var eRepublikDay = $("span.eday").text().trim();
		var eRepublikTime = $("span#live_time.time").text();
		var t = window.location.href;
		var e = t.split("?")[1];
		var SellerNick = decodeURI(e.split("sellerName=")[1].split("&")[0]);
		var SellerID = parseInt(e.split("sellerId=")[1].split("&")[0]);
		localStorage.BuyingLog = $(".success_message").text().trim();
		localStorage.BuyingTime = eRepublikDay + " | " + eRepublikTime + " | WRMdoc";
        localStorage.ID = SellerID;
		$("#marketplace table").eq(0).before("<h1><a style='color:#009925;'>Step 2)</a> Send log to <a href='/en/main/messages-compose/" + SellerID + "' target='_blank'>" + SellerNick + "</a></h1>")
	}
}

function MessageHelper() {
	$("#citizen_subject").val(localStorage.BuyingTime);
	$("#citizen_message").val(localStorage.BuyingLog);
	localStorage.clear();
}

$(document).ready(function () {
	if (window.location.href.indexOf("customOffer=true") > 0) {
		CustomOffer();
	}
	else if (window.location.href.indexOf("messages") > 0 && window.location.href.indexOf(localStorage.ID) > 0) {
		MessageHelper();
	}
});