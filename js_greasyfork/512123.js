// ==UserScript==
// @name        archive.today quick archive
// @namespace   archive.today
// @match       https://archive.*/?url=*
// @match       https://archiveiya74codqgiixo33q62qlrqtkgmcitqx5u2oeqnmn5bpcbiyd.onion/?url=*
// @grant       GM_xmlhttpRequest
// @icon        https://archive.today/apple-touch-icon.png
// @version     1.2
// @author      ccuser44
// @license     CC0
// @description Quick archiving for archive.today
// @downloadURL https://update.greasyfork.org/scripts/512123/archivetoday%20quick%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/512123/archivetoday%20quick%20archive.meta.js
// ==/UserScript==

/*
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

let url = decodeURIComponent(document.location.href.match(/^https:\/\/(archive\.(today|ph|is|li|vn|fo|md)|archiveiya74codqgiixo33q62qlrqtkgmcitqx5u2oeqnmn5bpcbiyd\.onion)\/\?url=(.+)/)[3]);
let domain = url.match(/^(https:\/\/)?([\w\.]+)/)[2];

function savePage() {
	for (const obj of document.getElementById("submiturl").children) {
		if (obj.tagName == "DIV" && obj.style.cssText == "margin: 0px; padding: 0px; position: absolute; width: 100px; right: 20px;") {
			obj.children[0].click();
			console.log("Clicked button");
		};
	};
};

function savePageCheck(url, mode) {
	GM_xmlhttpRequest({
		url: url,
		method: "GET",
		onreadystatechange: (function(responseObject) {
			if (responseObject.readyState == 4) {
				switch (responseObject.status) {
					case 200:
						console.log("200 - Successfully found page for", url)
						savePage();
						break;
					case 404:
						console.log((mode == "Wayback") ? "404 - Did not find archived page" : "404 - Did not find cached page (or misc error)", url);
						alert((mode == "Wayback") ? "404 - Did not find archived page" : "404 - Did not find cached page (or misc error)");
						break;
					case 429:
						console.log("429 - Rate limited due to spam. Wait some time before sending another request", url);
						alert("429 - Rate limited due to spam. Wait some time before sending another request");
					case 301:
						var message = (mode == "Wayback") ? "301 - Found archived page for different date" : "301 - Google cache is behind a captcha";
						console.log(message, url);
						alert(message);
						break;
					case 302:
						var message = (mode == "Wayback") ? "302 - Found archived page for different date" : "302 - Google cache is behind a captcha";
						console.log(message, url);
						alert(message);
						break;
					default:
						console.log("Unknown error", responseObject.status, url);
						alert("Unknown error " + responseObject.status);
						break;
				};
			};
		}),
	});
};

switch (domain) {
	case "webcache.googleusercontent.com":
		console.log("Archived URL is google cache");
		savePageCheck(url, "Google");
		break;
	case "web.archive.org":
		console.log("Archived URL is waybackmachine");
		savePageCheck(url, "Wayback");
		break;
	default:
		console.log("Archived URL is other", domain);
		savePage();
		break;
};
