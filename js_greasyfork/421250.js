// ==UserScript==
// @name         Stadia Avatars - Bot
// @namespace    https://victorwesterlund.com/
// @version      1.0
// @description  https://github.com/VictorWesterlund/stadia-avatar
// @author       VictorWesterlund
// @match        https://stadia.google.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421250/Stadia%20Avatars%20-%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/421250/Stadia%20Avatars%20-%20Bot.meta.js
// ==/UserScript==

(function() {
	'use strict';

	/* The Stadia Service Worker "mgsw.js" acts like a proxy and rejects requests to the StadiaAvatar endpoint.
	   Enable the "Bypass for network" toggle in DevTools->Application->Service Workers to circumvent this issue. */

	const endpoint = "https://api.victorwesterlund.com/stadia-avatar/update";
	const sharedSecret = ""; // Key to update the database

	const className = {
		newMessage: "daVSod",
		messageContent: "dgrMg",
		messageWindow: "P9pxvf",
		backButton: "rkvT7c"
	}

	let interval = null;

	async function updateAvatar(userID,payload) {
		const response = await fetch(endpoint,{
			method: "POST",
			mode: "no-cors",
			headers: {
				"Content-Type": "text/plain"
			},
			body: `{"sharedSecret":"${sharedSecret}","userID":"${userID}","payload":"${payload}"}`
		});
		return response.text();
	}

	const backToMessageList = (mutations,observer) => {
		observer.disconnect();
		// Click the back button once the animation has ended
		setTimeout(() => document.getElementsByClassName(className.backButton)[0].click(),1000);
	}

	function pollNewMessages() {
		const messages = document.getElementsByClassName(className.newMessage);
		if(!messages) {
			return false;
		}

		for(const message of messages) {
			const userID = message.getAttribute("data-playerid");
			const userMessage = message.getElementsByClassName(className.messageContent)[0].innerText;

			message.click(); // Send the AckMessage request natively by simulating a click

			// Wait for the message window to open
			const messageWindow = document.getElementsByClassName(className.messageWindow)[0];

			const observer = new MutationObserver(backToMessageList);
			observer.observe(messageWindow,{
				attributes: true,
				subtree: true
			});

			updateAvatar(userID,userMessage)
			.catch(err => console.error("Failed to update avatar",err));
		}
	}

	window._StadiaAvatar = {
		// Start the StadiaAvatar bot with 'window._StadiaAvatar.start()'
		start: (delay = 500) => {
			interval = setInterval(() => pollNewMessages(),delay);
			console.log("StadiaAvatar bot started.");
		},
		stop: () => {
			interval = null;
			console.log("StadiaAvatar bot stopped.");
		}
	}
})();