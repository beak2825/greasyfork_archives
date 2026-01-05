// ==UserScript==
// @name        My Toolkit
// @namespace   https://greasyfork.org/en/scripts/21883-my-toolkit
// @description My Toolkit to use with some sites.
// @include     /imgur\.com/
// @include     /my\.getlink\.vn/
// @include     /premium\.getlink\.vn/
// @include     /aliexpress\.com/
// @include 	https://shop.samsung.com/vn/multistore/vnepp/svmc/*
// @version     1.12
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @grant 		GM_addStyle
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21883/My%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/21883/My%20Toolkit.meta.js
// ==/UserScript==

var ur = document.URL;

function log(s) {
	console.log(s);
}

log("My Toolkit activated");

function plugin_imgur() {
	if ($('li.extra-option.delete').length > 0) {
		var name = $('script').text().match(/"deletehash":.+?"name":"([^"]+)"/i);
		if (name !== null && name.length > 0) {
			log("File name: " + name[1]);
			$('div.post-images.is-owner').prepend('<div style="margin:1em">Name: ' + name[1] + '</div>');
		}
	}

	if ($('a.post-options-publish').length < 1) return;
	log("Begin getting image links");
	var pageSource = document.documentElement.innerHTML;
	var jsons = pageSource.match(/"album_images":.+?\]\}/i);
	if (jsons.length < 1) {
		log("Cannot find any JSON");
		return;
	}
	var arr = jsons[0].match(/"hash":[^}]+\}/ig);
	log("Images: " + arr.length);
	var output = "";
	arr.forEach(function (value) {
		var t = value.match(/"hash":"([^"]+)".+"ext":"([^"]+)"/i);
		if (t.length > 0) output = output + "[img]http://i.imgur.com/" + t[1] + t[2] + "[/img]\n";
	});
	log("Output:\n" + output);
	$('ul.post-options-extra').prepend('<div style="margin:1em"><a id="btnCopyLink">Copy Image Links</a><div>');
	$('#btnCopyLink').click(function () {
		GM_setClipboard(output);
		log("Link copied");
	});
}

function plugin_get_link() {
	log("Getlink.vn detected");
	$('#acctform').submit(function () {
		var text = $(this).children('textarea:first').val();
		GM_setClipboard(text);
	});
	var t = $('div.login');
	if (t.length > 0 && t.text().match("mật khẩu.+đăng nhập").length > 0) {
		$('div.password-field input:password').val('123456');
		$('#remember-me').attr('checked', 'checked');
		$('div#container form').submit();
	}
}

const EXCHANGE_RATE = 23700;

function convertMoney(str) {
	return ((Math.floor(parseFloat(str) * EXCHANGE_RATE / 1000) + 1) * 1000).toLocaleString(undefined, { minimumFractionDigits: 0 });
}

function plugin_aliexpress() {
	log("Staff sales");
	$(document).ready(function () {
		log("Page ready");
		var prices = $('span[itemprop="price"]');
		if (prices.length == 0) {
			log("Do a second search");
			prices = $('span[itemprop*="Price"]');
		}
		log("Number of price tag: " + prices.length);
		prices.each(function (index, elem) {
			var allText = $(this).text();
			log((index + 1) + " All text: " + allText);
			var displayedText = "";
			var priceText2 = allText.match(/(\d+\.\d+).*-.*(\d+\.\d+)/);
			if (priceText2 != null) {
				//2 prices
				log("Found 2 prices: " + priceText2[1] + " and " + priceText2[2]);
				displayedText = convertMoney(priceText2[1]) + " - " + convertMoney(priceText2[2]);
			}
			else {
				//single price
				log("Not found 2 prices");
				var priceText = allText.match(/\d+\.\d+/);
				if (priceText != null) {
					log("Found price: " + priceText[0]);
					displayedText = convertMoney(priceText[0]);
				}
			}
			log("Converted price: " + displayedText);
			$(this).text(allText + " | " + displayedText);
		});
		log("Finish price tags");
	});
}

if (ur.indexOf('imgur.com') >= 0) plugin_imgur();
else if (ur.indexOf('.getlink.vn') >= 0) plugin_get_link();