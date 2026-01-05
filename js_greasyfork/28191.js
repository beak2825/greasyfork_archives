// ==UserScript==
// @name        DH2 Chat Filter
// @namespace   siderislabs
// @include     http://*.diamondhunt.co/game.php
// @version     1.1
// @locale us_EN
// @description:en This script lets you filter out words you don't like in DH2 chat.
// @description This script lets you filter out words you don't like in DH2 chat.
// @downloadURL https://update.greasyfork.org/scripts/28191/DH2%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/28191/DH2%20Chat%20Filter.meta.js
// ==/UserScript==   

var sendBytesProxy = window.cBytes;
var chatProxy = window.addToChatBox;
var tmp = "";
var filteredWords = [];
var wordDetected;
var isFound = 0;
var override;

console.log("DH2 Chat Filter active.");

window.cBytes = function(e) {
	if(e.startsWith("CHAT=!addfilter")) {
		doAddFilter(e);
	}
	else if(e.startsWith("CHAT=!listfilters")) {
		doListFilters();
	}
	else if(e.startsWith("CHAT=!removefilter")) {
		doRemoveFilter(e);
	}
	else if(e.startsWith("CHAT=!help")) {
		doPrintHelp();
	}
	else {
		sendBytesProxy.apply(this, arguments);
	}
}

window.addToChatBox = function(username, icon, tag, message, isPM) {
	for(i = 0; i < filteredWords.length; i++) {
		if(arguments[3].includes(filteredWords[i]) && override == 0) {
			wordDetected = 1;
		}
	}
	if(wordDetected == 1) {
		wordDetected = 0;
		return;
	}
	else {
		chatProxy.apply(this, arguments);
	}
	wordDetected = 0;
}

doAddFilter = function(e) {
	tmp = e.replace("CHAT=", "");
	tmp = tmp.replace("!addfilter ", "");
	for(i = 0; i < filteredWords.length; i++) {
		if(tmp == filteredWords[i]) {
			isFound = 1;
		}
	}
	if(isFound == 0) {
		filteredWords.push(tmp);
		window.addToChatBox("placeholder", "0", "5", "Word successfully added to filter list.", "0");
		console.log(filteredWords);
	}
	else {
		window.addToChatBox("placeholder", "0", "5", "That word is already in your filter list.", "0");
	}
}

doRemoveFilter = function(e) {
	tmp = e.replace("CHAT=", "");
	tmp = tmp.replace("!removefilter ", "");
	if(filteredWords.indexOf(tmp) != -1) {
		filteredWords.splice(filteredWords.indexOf(tmp), 1);
		window.addToChatBox("placeholder", "0", "5", "Word successfully removed from filter list.", "0");
		console.log(filteredWords);
	}
	else {
		window.addToChatBox("placeholder", "0", "5", "That word is not in your filter list.", "0");
	}
}

doListFilters = function() {
	override = 1;
	window.addToChatBox("placeholder", "0", "5", "List of filtered words: " + filteredWords.toString(), "0");
	override = 0;
}

doPrintHelp = function() {
	window.addToChatBox("placeholder", "0", "5", "!addfilter [word]: Adds a word to your filter list.", "0");
	window.addToChatBox("placeholder", "0", "5", "!listfilters: Lists the words you have filtered.", "0");
	window.addToChatBox("placeholder", "0", "5", "!removefilter [word]: Removes a world from your filter list.", "0");
}
	
	