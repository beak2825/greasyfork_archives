// ==UserScript==
// @name         Haunted Woods Scratchcard Autobuyer
// @namespace    -
// @version      0.1
// @description  -
// @author       wtFugg
// @match        http://www.neopets.com/halloween/scratch.phtml*
// @match        http://www.neopets.com/halloween/process_scratch.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405918/Haunted%20Woods%20Scratchcard%20Autobuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/405918/Haunted%20Woods%20Scratchcard%20Autobuyer.meta.js
// ==/UserScript==

var d = document;
var url = window.location.href;

if (d.getElementById("nst")) { // because some pages have no clock
	var getNST = d.getElementById("nst").innerHTML;
	var time = {
		hour: getNST.split(":")[0],
		minute: getNST.split(":")[1],
		second: getNST.split(":")[2].split(" ")[0],
		ampm: getNST.split(" ")[1],
		full: function () {
			return this.hour + ":" + this.minute + ":" + this.second + " " + this.ampm;
		}
	};
	var NST = "[" + time.full() + "] ";
}

var cards = {
	2: "Crypt of Chance Scratchcard",
	3: "Undead Jackpot of Doom Scratchcard",
	4: "Festering Fortune Scratchcard",
	5: "Mutating Millions Scratchcard",
	6: "Pustravaganza Scratchcard",
	7: "Rotting Riches Scratchcard"
};

// Set buy interval between 120 and 130 minutes
var cooldown = Math.floor(Math.random() * 600000) + 7200000;


if (url.includes("/scratch.phtml")) {

	var headers = d.getElementById("content").getElementsByTagName("b");
	var title = () => {
		for (var i = 0; i < headers.length; i++) {
			if (headers[i].innerHTML.includes("Deserted Fairground Scratchcards")) {
				return headers[i];
			}
		}
	}
	if (url.includes("?bought=")) {
		var cardID = url.slice(-1);
		console.log(NST + "Bought " + cards[cardID] + "! Next card in " + convertTime(cooldown));
		title().innerHTML = "Deserted Fairground Scratchcards<br><br><font color='green'>" + NST + "Bought " + cards[cardID] + "! Next card in " + convertTime(cooldown) + "</font><br>";
	} else {
		title().innerHTML = "Deserted Fairground Scratchcards<br><br><font color='green'>" + NST + "Autobuy script is running. Next card in " + convertTime(cooldown) + "</font><br>";
	}

	var buy = () => {
		var forms = d.getElementsByTagName("form");
		for (var i = 0; i < forms.length; i++) {
			if (forms[i].getAttribute("action") == "process_scratch.phtml") {
				forms[i].submit();
				return;
			}
		}
	}
	setTimeout(buy, cooldown);
}

if (url.includes("/process_scratch")) { // 2hr cooldown time not over yet
	let back = Math.floor(Math.random() * 2000) + 2000;
	setTimeout(function () {
		d.getElementsByTagName("form")[0].submit();
	}, back);
}

function convertTime(ms) {
	let secTotal = Math.floor(ms / 1000);
	let days = Math.floor(secTotal / 86400); // for error purposes, not expecting usage
	let h = Math.floor((secTotal % 86400) / 3600);
	let min = Math.floor((secTotal % 3600) / 60); // leftover secs from hours
	let sec = Math.floor((secTotal % 3600) % 60); // leftover secs from minutes
	let duration = "";
	if (days > 0) {
		duration += (days + " days ");
	}
	if (h > 0) {
		duration += (h + " h ");
	}
	if (min > 0) {
		duration += (min + " min ");
	}
	duration += sec + " sec ";
	return duration;
}
