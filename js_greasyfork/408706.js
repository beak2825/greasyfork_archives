// ==UserScript==
// @name         RemoveReply Extension for Twitch
// @version      1.1
// @author       cyndifusic
// @description  A simple script that removes all the newly implemented reply buttons on Twitch.
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/675978
// @downloadURL https://update.greasyfork.org/scripts/408706/RemoveReply%20Extension%20for%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/408706/RemoveReply%20Extension%20for%20Twitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var replyButtons;
	var replyHighlights;
	var removeElement = function(elementInput) {
		for (i = 0; i < elementInput.length; i++) {
			elementInput[i].parentNode.removeChild(elementInput[i]); 
		}
	}
	var removeButtons = function() {
		replyButtons = document.getElementsByClassName("chat-line__reply-icon tw-absolute tw-border-radius-medium tw-c-background-base tw-elevation-1");
		replyHighlights = document.getElementsByClassName("chat-line__message-highlight tw-absolute tw-border-radius-medium tw-top-0 tw-bottom-0 tw-right-0 tw-left-0");
		removeElement(replyButtons);
		removeElement(replyHighlights);
	}
	document.addEventListener("DOMNodeInserted", removeButtons);

})();