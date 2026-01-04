// ==UserScript==
// @name         Linkvertise Destroyer | UPDATED
// @namespace    http://t.me/St3ph32
// @version      2.0
// @description  Bypass every Linkvertise link and check.
// @license      MIT
// @author       St3ph32
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.file-link.net/*
// @match        *://*.direct-link.net/*
// @match        *://*.linkbackend2.000webhostapp.com/linkvertisebypass.php?url=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/421497/Linkvertise%20Destroyer%20%7C%20UPDATED.user.js
// @updateURL https://update.greasyfork.org/scripts/421497/Linkvertise%20Destroyer%20%7C%20UPDATED.meta.js
// ==/UserScript==
// @run-at       document-start
// @run-at       document-end
// @run-at       document-idle

var current_location = document.location;
var string = "linkbackend2.000webhostapp.com/linkvertisebypass.php?url=";
var url = "";

function redirect() {
	window.location.replace(url);
}

function closing() {
	document.close();
}

if (
	current_location.href.indexOf(string) > -1 &&
	current_location.href.indexOf("Error") < 1
) {
	url = document.body.innerText;
	if (url.indexOf("Error") > -1) {
		document.write(
			"We got an error trying to bypass this link. <br><br> Common errors: <br> - The Linkvertise link is wrong. <br> - Our API got an error, please try again later."
		);
		window.setTimeout(closing, 1500);
	} else {
		document.write(
			"You will get redirected in 15 seconds... <br> This is made to bypass every check. <br><br> Direct access: " +
				url
		);
		window.setTimeout(redirect, 15000);
	}
} else {
	url = window.location.href.toString();
	if (url.indexOf("?r=") != -1) {
		document.location = document.URL.replace(
			"",
			"https://linkbackend2.000webhostapp.com/linkvertisebypass.php?url="
		);
	} else {
		if (window.parent.location != window.location) {
			return;
		}

		GM.xmlHttpRequest({
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
			},
			url:
				"https://publisher.linkvertise.com/api/v1/redirect/link" +
				window.location.pathname +
				"/captcha",
			onload: function () {},
		});
		GM.xmlHttpRequest({
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
			},
			url:
				"https://publisher.linkvertise.com/api/v1/redirect/link" +
				window.location.pathname +
				"/countdown_impression?trafficOrigin=network",
			onload: function () {},
		});
		GM.xmlHttpRequest({
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
			},
			url:
				"https://publisher.linkvertise.com/api/v1/redirect/link" +
				window.location.pathname +
				"/todo_impression?mobile=true&trafficOrigin=network",
			onload: function () {},
		});
		GM.xmlHttpRequest({
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
			},
			url:
				"https://publisher.linkvertise.com/api/v1/redirect/link" +
				window.location.pathname +
				"/click?trafficOrigin=network",
			onload: function () {},
		});

		let o = {
			timestamp: new Date().getTime(),
			random: "6548307",
		};
		var bypass_url =
			"https://publisher.linkvertise.com/api/v1/redirect/link/static" +
			window.location.pathname;
		GM.xmlHttpRequest({
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
			},
			url: bypass_url,
			onload: function (response) {
				var json = JSON.parse(response.responseText);
				o.link_id = json.data.link.id;
				bypass_url =
					"https://publisher.linkvertise.com/api/v1/redirect/link" +
					window.location.pathname +
					"/target?serial=" +
					encodeURIComponent(btoa(JSON.stringify(o)));

				GM.xmlHttpRequest({
					method: "GET",
					headers: {
						"User-Agent":
							"Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
					},
					url: bypass_url,
					onload: function (response) {
						var json = JSON.parse(response.responseText);
						url = json.data.target;
						document.write(
							"You will get redirected in 15 seconds... <br> This is made to bypass every check. <br><br> Direct access: " +
								url
						);
						window.setTimeout(redirect, 15000);
					},
				});
			},
		});
	}
}
