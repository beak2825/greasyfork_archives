// ==UserScript==
// @name         Stumblechat quoting
// @namespace    https://greasyfork.org/en/users/1244737
// @version      2
// @description  Generate a message quote by Shift + Clicking it.
// @author       robomoist
// @license      MIT
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507542/Stumblechat%20quoting.user.js
// @updateURL https://update.greasyfork.org/scripts/507542/Stumblechat%20quoting.meta.js
// ==/UserScript==

/*
	Shift + Click a name to quote it.
	Or just a single message line for only that part.
*/

var settings = {
	"Newlines": false
};


var inputChat = document.querySelector("#textarea");
var eventClickR = document.querySelector("#chat-wrapper").addEventListener('click', getQuote);

function getQuote(e) {
	if (!e.shiftKey) return;
	var elem = document.elementFromPoint(e.clientX, e.clientY);
	if (!(elem.classList.contains("message") && elem.classList.contains("common"))
			&&
		!(elem.classList.contains("timestamp"))
			&&
		!(elem.classList.contains("nickname"))
	) {
		return;
	}
	
	if (elem.classList.contains("nickname")) {
		var elemMsg = elem.parentElement;
		var nick = elem.textContent;
		var text = [];
		var time = elemMsg.querySelector(".timestamp").textContent;

		if (settings["Newlines"]) {
			elem.parentElement.querySelectorAll(".message").forEach( e => text.push("> " + e.textContent) );
			text = "\n" + text.join("\n");
			var quoteOutput = ">" + nick + ": ["+ time + "] " + text;
		}
		else {
			elem.parentElement.querySelectorAll(".message").forEach( e => text.push(e.textContent) );
			text = text.join("		");
			var quoteOutput = ">" + nick + ":	[" + time + "]\n>" + text;
		}
	}
	else {
		var elemMsg = elem.parentElement.parentElement;
		var nick = elemMsg.querySelector(".nickname").textContent;		
		var text = elem.textContent;
		var time = elem.parentElement.querySelector(".timestamp").textContent;
		var quoteOutput = ">" + nick + ": \n>" + text + " ["+ time + "]";
	}

	inputChat.value = quoteOutput;
	document.getSelection().removeAllRanges();
	inputChat.focus(); // Chromium: often fails and doesn't work with a timeout or interval
}