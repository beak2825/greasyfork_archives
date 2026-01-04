// ==UserScript==
// @name         Reddit Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Some small enhancements for reddit (RES needed)
// @license      MIT
// @icon         data:image/webp;base64,UklGRrwBAABXRUJQVlA4TLABAAAvP8APAK+goG0bhj/ddv/SMJC2TXr/ls8Utm2k7L/rMT7//Mfvr29tSyUrvpCacd2glC8IERWbAUJEGSIIODeWuw1wA4Bt24Ck2AvY8P+xJmiK3pIlov8TQH/fZ6mDaTGUeR8CCB1Km1QEANhxXQRnBABIK+EzX2eh06jZP7C2t0350BpX7rYGnhlqUS6bBTIzqwQAPy+jAJUh6jlVul6LsfGTQxj67QrhxzKUH/PQfqZjDs5IMC5k7Ne1ZOBLk9pNaOGoxdeaV9Lk2Swct21mI5Vvh1DApxHwojDwKfBIl3Cx7CcSXJ1OuLvcWzL3gXpH4+hZvpW2kIioP9zTiYhwK53ocsPQMnOZlmZD9hOEgvMr5HDlOYF0tinGrDKXV4ZRjU5zUD+G5vT4qMA+9J4qk5qFTdtoFnWB4QCkgi+VhE1zLuy8G87hLXhu6jv0PEe4YZPYE8luIL0ZuELNCU64RoUL9OqwjEKiXqJ3zsfSiVAxdrxDw60ALA5iB1pg3aCX54wMgDAh5ZyCEcCKOOnCqpmDutKds+gzuky6t4bnmydUur2V6Myj1GNcLI3+LwI=
// @author       mattiadr96@gmail.com
// @match        http*://*.reddit.com/*
// @grant        GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/369531/Reddit%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/369531/Reddit%20Enhancements.meta.js
// ==/UserScript==

(function($) {
    "use strict";

	// middle click to collapse
	$(document).on("mousedown", function(e) {
		if (e.button == 1) {
			// ignore links
			if ($(":hover").last().is("a")) {
				return;
			}
			let entry = $(":hover").filter(".entry").find("a.toggleChildren");
			if (entry.length > 0) {
				entry[0].click();
			}
			return false;
		}
	});

	// share button override
	$(document).on("mousedown", function(e) {
		if (e.button == 0) {
			let el = $(":hover").last();
			if (el.hasClass("post-sharing-button")) {
				let link = el.parent().prev().children().attr("href");
				let url = "https://redd.it/" + link.match(/comments\/(\w+)\//)[1];
				GM_setClipboard(url);
				el.css("color", "rgb(255, 69, 0)");
				setTimeout(function() {
					el.css("color", "");
				}, 1000);
			}
		}
	});

	let style = document.createElement('style');
	style.innerHTML = `
		.post-sharing {
			display: none!important;
		}
	`;
	document.head.appendChild(style);

	// click on shortlink to copy
	$("#shortlink-text").on("click", function(e) {
		document.execCommand("copy");
	});

	// spoilers improvement
	/* not working
	$("head").append(`
<style type="text/css">
	a[href="/s"].hover {
		color: #f44!important;
	}

	a[href="/s"].hover:after {
		color: #FFF!important;
	}
</style>`);

	$(document).on("click", function(e) {
		let a = $(":hover").filter("a[href='/s']");
		if (a.length > 0) {
			e.preventDefault();
			a.toggleClass("hover");
		}
	});
	*/

	// color save/unsave button
	$(".save-button > a:contains('unsave')").css("color", "gold");

	$(".save-button > a").on("click", function(e) {
		e.target.style.color = (e.target.text == "save") ? "gold" : "";
	});

	// goto unddit
	let a = $("<a href='#' onclick='return false;' style='font-size: 15px; display: block; margin-top: 3px;'>Unddit</a>");
	a.click(function() {
		window.location.hostname = window.location.hostname.replace("reddit", "unddit");
		return false;
	});
	$("body > div.side > div:nth-child(2) > div").append(a);

	// auto-reload res
	let retry_reload = 30;
	let interval = setInterval(function() {
		$("#alert_message > input[type=button]").click();
		if (--retry_reload <= 0) {
			clearInterval(interval);
		}
	}, 100);

})(jQuery);