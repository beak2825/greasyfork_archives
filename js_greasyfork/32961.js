// ==UserScript==
// @name         Lyrania: Guild Chat Log
// @namespace    http://tampermonkey.net/
// @version      2017.10.17.2
// @description  Save guild chat to Discord
// @author       Amraki
// @match        https://lyrania.co.uk/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32961/Lyrania%3A%20Guild%20Chat%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/32961/Lyrania%3A%20Guild%20Chat%20Log.meta.js
// ==/UserScript==

// Global variables
var hookurl = "";
var guildName = "";

$(document).ready(function() {
    'use strict';
    
    if (hookurl === "") {
        alert("Guild Chat Log: Please add the Discord webhook url to line 12.");
        return;
    }

	// Start after delay to avoid duplicate messages by capturing old messages
	setTimeout(function() {
		init();
	}, 5 * 1000);

});

function init() {
	// Pull up guild page
	$("#mainnav").val("4").change();

	if ($("#mainnav").val() !== "4" || !$('#content > div > b').length) {
		// Wrong page, try again
		setTimeout(init, 2000);
		return;
	}

	guildName = $('#content > div > b')[0].innerText;

	// Start monitoring chat messages
	if (guildName !== "") {
		console.log("Guild Chat Log: " + guildName);
		chatObserver();
	}

	// Change to 'Battle' tab after short delay
	setTimeout(function() {
		$("#mainnav").val("1").change();
	}, 500);
}

function chatObserver() {
	// Select the target node to monitor
	var target = document.getElementById('chatwindow');

	// create an observer instance
	// reference: http://www.javascripture.com/MutationRecord
	var MutationObserver = window.MutationObserver;
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				//console.log("new message: " + mutation.addedNodes[i].textContent);
				examineMessage(mutation.addedNodes[i].textContent);
			}
		});
	});

	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true };

	// pass in the target node, as well as the observer options
	try {
		observer.observe(target, config);
	} catch (e) {
		console.log(e);
	}
}

function examineMessage(message) {
	// Only save guild messages
	if (message.indexOf(guildName) === -1) { return; }
	
	// Don't save log in messages
	if (stringIncludes("any", message, ["has logged in", "Message of the Day"])) { return; }

	// Must match regular expression of standard chat messages
	//var regMatch = message.match(/(\[(?:\d+:){2}\d+\])(?:\s\[.+\])\s(\*?[\w]+):?\s+(.+)/);
	var regMatch = message.match(/(\[(?:\d+:){2}\d+\]).*?]\s(\*?\w+):?\s(.+)/);
	if (!regMatch) {
		console.log("Guild Chat Log: invalid format- " + message);
		return;
	}
	
	// Get date according to server time
	var date = new Date();
	var options = { timeZone: 'Europe/London', hour12: false, year: 'numeric', month: 'numeric', day: 'numeric'};
	var serverDate = date.toLocaleString('en-US', options);
	
	// format: date, time, sender, message
	//console.log("addMessage(" + serverDate + ", " + regMatch[1] + ", " + regMatch[2] + ", " + regMatch[3] + ")");

	// Add message to Discord
	var msgJson = {
		"username": regMatch[2],
		"icon_url": "",
		"text": regMatch[3]
	};
	$.post(hookurl + "/slack", msgJson);
}

function stringIncludes(mode, string, words) {
	// mode 1: if string contains any of the words
	// otherwise: string must contain all words to return true
	
	if (mode == 1 || mode == "any") {
		for (var i = 0; i < words.length; i++) {
			if (string.indexOf(words[i]) > -1) {
				return true;
			}
		}
		return false;
	}
	
	for (var i = 0; i < words.length; i++) {
		if (string.indexOf(words[i]) == -1) {
			return false;
		}
	}
	return true;
}