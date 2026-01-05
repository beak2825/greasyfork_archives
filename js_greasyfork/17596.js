// ==UserScript==
// @name		DHRainbowChat
// @namespace	http://tampermonkey.net/
// @version		1.0
// @description	Diamond Hunt Online Rainbow Chat for Amy the Bully
// @author		John / WhoIsYou
// @match		http://*.diamondhunt.co/game.php
// @match		https://*.diamondhunt.co/game.php
// @run-at document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/17596/DHRainbowChat.user.js
// @updateURL https://update.greasyfork.org/scripts/17596/DHRainbowChat.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/*
	Adds some flair to the chat by randomly colouring messages to a shade of red, green, pink, purple, orange, or yellow (there are 3 of each)
	Does not recolour server messages, smitty's messages, PMs, or messages where your full username is included (problems)
	Will not use the same category of colour twice in a row
*/

// Reds, Greens, Pinks, Purples, Oranges, Golds/Yellows
var rcColours = [["#ff0000", "#cc0000", "#b30000"], ["#00cc00", "#009900", "#00e600"], ["#ff99cc", "#ff4da6", "#ff0080"], ["#9900cc", "#730099", "#bf00ff"], ["#ff9933", "#ff8000", "#ff9933"], ["#e6b800", "#cca300", "#b38f00"]];
var rcColour = -1;
var rcLastColour = -1;

var originalRefreshChat = window.refreshChat;

window.refreshChat = function(data) {
	data = rainbowChat(data);
	originalRefreshChat(data);
}

function rainbowChat(messageString) {
	// If the message isn't from smitty or the server (~ is filtered out serverside so this is fairly safe)
	if (messageString.indexOf("~!!!") === -1) {
		// If the message isn't a received PM
		if (messageString.match(/<span style='color:purple'>Private Message from <b>(.*)<\/b>\: (.*)<\/span>/) === null) {
			// If the message isn't a sent PM
			if (messageString.match(/<span style='color:purple'>Sent to <b>(.*)<\/b>\: hi<\/span>/) === null) {
				var matches = messageString.match(/([0-9]~\*?\|?.* \([0-9]+\)\:) (.*)/);
				// If we properly separate the name + tags from the message, and the message does not contain your username
				if (matches !== null && matches.length >= 3 && matches[2].indexOf(window.username) === -1) {
					while (rcColour === rcLastColour) {
						rcColour = getRandomArbitrary(0, rcColours.length);
					}
					rcLastColour = rcColour;
					var myColour = rcColours[rcColour][getRandomArbitrary(0, rcColours[rcColour].length)];
					messageString = matches[1] + " <span style='color:" + myColour + "'>" + matches[2] + "</span>";
				}
			}
		}
	}
	return messageString;
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}