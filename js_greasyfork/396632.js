// ==UserScript==
// @name         noMyTT2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  verhindert die Weiterleitung von click-tt zu myTischtennis.
// @author       Nichtraucher
// @match        https://addons.mozilla.org/en-US/firefox/addon/nomytt/
// @license CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license MIT
// @copyright    
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396632/noMyTT2.user.js
// @updateURL https://update.greasyfork.org/scripts/396632/noMyTT2.meta.js
// ==/UserScript==


function substspecial(name) {
	switch (name) {
	case "byttv":
		return "bttv";
	case "hettv":
		return "httv";
	case "sbttv":
	case "battv":
		return "ttvbw";
	default:
		return name;
	}
}

function substsubject(id, subject, range) {
	if (subject.endsWith("/mannschaften/")) {
		return "clubTeams" + range;
	} else if (subject.endsWith("/mannschaftsmeldungen/")) {
		return "clubPools" + range;
	} else {
		return "groupPage" + range + "&group=" + id;
	}
}

function replacer(match, p1, p2, offset, string) {
	return p2 === undefined ? "+" + p1 : "+" + p1 + p2.toLowerCase();
}

function rellink(components, range) {
	return "/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/" + substsubject(components[2], components[3], range.replace(/dttb/i, components[1].replace(/ ([^-]+)(?:-(.*))?/, replacer)));
}

function main() {
	var myTTLinks = document.getElementsByTagName("a");
	var metas = document.getElementsByTagName("meta");
	for (var i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute("name") == "nuLigaStatsUrl") {
			var content = metas[i].getAttribute("content");
			var idx = content.indexOf("?");
			if (idx >= 0) {
				var range = content.substring(idx);
			} else {
				for (var j = 0; j < myTTLinks.length; j++) {
					if (myTTLinks[j].textContent === "Regionsspielplan") {
						var region = myTTLinks[j].getAttribute("href");
						idx = region.indexOf("?");
						if (idx >= 0) {
							var range = region.substring(idx);
							break;
						} else {
							return;
						}
					}
				}
			}
			break;
		}
	}
	var pattern = new RegExp("^https://www\.mytischtennis\.de/clicktt/([^/]+)/.+?/(?:gruppe|verein)/([^/]+)/(.*)");
	for (var i = 0; i < myTTLinks.length; i++) {
		var match = myTTLinks[i].getAttribute("href").match(pattern);
		if (match) {
			myTTLinks[i].removeAttribute("target");
			myTTLinks[i].setAttribute("href", match[1].indexOf(" ") >= 0 ? rellink(match, range) : "https://" + substspecial(match[1].toLowerCase()) + ".click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/" + substsubject(match[2], match[3], range));
		}
	}
}

main();
