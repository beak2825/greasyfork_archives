// ==UserScript==
// @name         Random Events Logger
// @namespace    neopets
// @version      1.2
// @description  Logs random events in browser console.
// @author       You
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405201/Random%20Events%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/405201/Random%20Events%20Logger.meta.js
// ==/UserScript==

var d = document;

console.image = function (url, text = "", textstyle = "") {
	var image = new Image();
	image.onload = function () {
		var style = [
			'font-size: 1px;',
			'padding: ' + this.height / 2 + 'px ' + this.width / 2 + 'px;',
			'background: url(' + url + ') no-repeat;',
			'background-size: ' + this.width + 'px ' + this.height + 'px;'
		].join(' ');
		console.log('%c ' + text + '%c ', textstyle, style);
	};
	image.src = url;
};

var NST = () => {
	if (d.getElementById("nst")) {
		var getNST = d.getElementById("nst");
		return "[" + getNST.innerHTML.split(" ")[0] + " " + getNST.innerHTML.split(" ")[1] + "] ";
	} else {
		return "";
	}
}

// Premium random event
if (d.body.contains(d.getElementById("shh_prem_bg"))) {
	let premiumRE = d.getElementById("shh_prem_bg");
	let premiumRE_text = premiumRE.getElementsByClassName("desc_inner")[0].innerHTML;
	console.log("%c" + NST() + "[Premium] " + removeTags(premiumRE_text).trim(), "color:black; background-color: white;");
}

// Coincidence or other random event
if (d.body.contains(d.getElementsByClassName("randomEvent")[0])) {
	let RE = d.getElementsByClassName("randomEvent")[0];
	let RE_text = RE.innerHTML;
	console.log("%c" + NST() + removeTags(RE_text).trim(), "background-color:gold;");
}

// Quest
if (d.body.contains(d.getElementsByClassName("new_quest_pushdown")[0])) {
	let fqfc = "http://images.neopets.com/ncmall/fortune/pushdowns/faerie-quest-cookie.png";

	let questRE = d.getElementsByClassName("new_quest_pushdown")[0];
	let questRE_text = questRE.innerHTML;

	let msg = NST() + removeTags(questRE_text).trim();
	let style = "color:magenta;";

	console.image(fqfc, msg, style);
}

function removeTags(string) {
	if (string === null || string === " ") {
		return false;
	} else {
		string = string.toString();
		return string.replace(/<[^>]+>/ig, "");
	}
}