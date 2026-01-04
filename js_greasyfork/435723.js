// ==UserScript==
// @name         Twitch Chat -> Bonk.io Chat - Bonk.io
// @description  Proxy messages from Twitch's chat to Bonk.io's chat
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @version      1.0.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/tmi.js@1.8.5/index.min.js
// @downloadURL https://update.greasyfork.org/scripts/435723/Twitch%20Chat%20-%3E%20Bonkio%20Chat%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/435723/Twitch%20Chat%20-%3E%20Bonkio%20Chat%20-%20Bonkio.meta.js
// ==/UserScript==

// Thanks to Oo 0 oO and Neikrodent for the idea
// Thanks to Oo 0 oO and Bunjalis for testing the script

// Twitch's emotes supported, however BetterTTV and FrankerFaceZ emotes are NOT supported (yet?)

(() => {
	// Maximum length of the message on twitch before it will be truncated in the bonk chat	
	const MAX_MESSAGE_LENGTH = 300;
	// Max amount of messages to keep in chat
	const MAX_LOBBY_MESSAGE_COUNT = 152;
	const MAX_INGAME_MESSAGE_COUNT = 10;
	// The channel to pull messages from
	const CHANNEL = "";
	// The icon to prefix messages from twitch with
	const TWITCH_MSG_PREFIX = "*";

	// Length of time to show messages from twitch in milliseconds (bonk uses something like 12.5 seconds or something)
	const MESSAGE_SHOW_DURATION = 12500;

	const DEFAULT_COLORS = [
		"#FF0000",
		"#0000FF",
		"#00FF00",
		"#B22222",
		"#FF7F50",
		"#9ACD32",
		"#FF4500",
		"#2E8B57",
		"#DAA520",
		"#D2691E",
		"#5F9EA0",
		"#1E90FF",
		"#FF69B4",
		"#8A2BE2",
		"#00FF7F"
	];

	// Styles twitch emotes to be 1 "em" = the width of 1 character and vertically center it

	// eslint-disable-next-line no-undef
	GM_addStyle(".twitch_emote { height: 1em; width: 1em; vertical-align: middle; }");
	// eslint-disable-next-line no-undef
	GM_addStyle("#ingamechatbox { overflow: visible !important; }");
	
	// Connect to the twitch chat, uses tmi which is a library
	// This contains code not written by me, but this code is used by thousands of people
	// https://www.npmjs.com/package/tmi.js
	const client = new window.tmi.Client({
		connection: {
			reconnect: true, // Automatically reconnect in case something cuts out
			secure: true // Use encrypted connection
		},
		skipMembership: true, // Stops Twitch sending watchers join/leave data
		skipUpdatingEmotesets: true, // Disables the fetch request for getting the emote about your emotesets data. This will affect automatic emote parsing for self messages. 
		updateEmotesetsTimer: true, // We are not sending messages so this doesn't matter (?)
		channels: [CHANNEL] // Channels of the chats we want to watch
	});

	// Some elements we will be using
	const newbonklobby_chat_content = document.getElementById("newbonklobby_chat_content");
	const ingamechatcontent = document.getElementById("ingamechatcontent");
	const gamerenderer = document.getElementById("gamerenderer");

	// If it fails to connect for whatever reason
	client.connect().catch(error => {
		console.error("[T2B] Failed to connect to Twitch");
		console.error(error);
		alert("Twitch to Bonk.io bridge failed to connect to Twitch");
	});

	// Used to store the timestamp at which the ingame chat should be hidden
	let hide_message_timestamp;

	client.on("connected", () => {
		console.log("[T2B] Connected to Twitch stream chat");
	});
	
	// Message was deleted on twitch - delete the message here too
	client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
		const message_id = userstate["target-msg-id"];

		// Idk how this would happen
		if (!message_id) return;
		
		// Remove the messages from the chat
		ingamechatcontent.removeChild(Array.from(ingamechatcontent.children)
			.find(message => message.dataset.id == message_id));

		newbonklobby_chat_content.removeChild(Array.from(newbonklobby_chat_content.children)
			.find(message => message.dataset.id == message_id));
	});

	// This runs when a message is sent to the chat
	client.on("message", (channel, tags, message, self) => {
		// If the message is from ourselves
		if (self) return;

		// Filter by "chat" message type
		// I don't know the types of anything else, but chat seems like what we want
		if (tags["message-type"] == "chat") {
			// Try using display-name, if that doesn't exist, use the username, otherwise use "Unknown user"
			const username = tags["display-name"] ?? tags.username ?? "Unknown user";
			// Message ID
			const message_id = tags["id"] ?? "unknown-message-id";
			// If there is no color then use a random color
			const color = tags.color ?? DEFAULT_COLORS[username.charCodeAt(0) % DEFAULT_COLORS.length];
			// Try getting the emotes in the message
			const emotes = tags["emotes"];

			const message_span = document.createElement("span");

			// If there are emotes in the message
			if (emotes) {
				let emotes_interim = [];

				// Change the formatting of the emojis to something we can work with better
				for (const [emote, positions] of Object.entries(emotes)) {
					for (const position of positions) {
						emotes_interim.push({
							id: emote,
							position: position.split("-").map(pos => parseInt(pos))
						});
					}
				}

				// Sort the emojis by the order of position
				emotes_interim.sort((a, b) => a.position[0] - b.position[0]);

				let current_index = 0;
				for (const emote of emotes_interim) {
					const message_segment = message.substring(current_index, emote.position[0]);
					const message_segment_span = document.createElement("span");
					const emote_img = document.createElement("img");

					message_segment_span.textContent = message_segment;
					
					emote_img.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`;
					emote_img.classList.add("twitch_emote");
					
					message_span.appendChild(message_segment_span);
					message_span.appendChild(emote_img);
					
					current_index = emote.position[1] + 1;
				}

				const message_segment = message.substring(current_index, message.length);
				const message_segment_span = document.createElement("span");

				message_segment_span.textContent = message_segment;
				message_span.appendChild(message_segment_span);
			} else {
				message_span.textContent = message;
			}

			// Truncate messages that are too long (maybe twitch does this)
			if (message.length > MAX_MESSAGE_LENGTH) 
				message = message.substring(0, MAX_MESSAGE_LENGTH) + "…";
			
			// Add the chat message to the in-game container
			const new_ingame_msg_container = document.createElement("div");
			const ingame_msg_username = document.createElement("span");
			const ingame_msg_content = document.createElement("span");

			// The author of the message
			ingame_msg_username.classList.add("ingamechatname");
			ingame_msg_username.textContent = `${TWITCH_MSG_PREFIX} ${username}:`;
			ingame_msg_username.style.color = color;

			// The message content
			ingame_msg_content.classList.add("ingamechatmessage");
			ingame_msg_content.innerHTML = ` ${message_span.innerHTML}`;

			// Make the new ingame message
			new_ingame_msg_container.dataset.id = message_id;
			new_ingame_msg_container.appendChild(ingame_msg_username);
			new_ingame_msg_container.appendChild(ingame_msg_content);

			// Add the new message to the ingame chat
			ingamechatcontent.appendChild(new_ingame_msg_container);

			// Scroll to the bottom
			ingamechatcontent.scrollTop = ingamechatcontent.scrollHeight;
			
			// Store the time at which the chat should be hidden (in case there are two successive messages)
			hide_message_timestamp = Date.now() + MESSAGE_SHOW_DURATION;
			
			// Show the chat if we are in game right away
			if (gamerenderer.style.visibility === "inherit")
				ingamechatcontent.style.visibility = "visible";
			
			setTimeout(() => {
				// Hide the chat after the timer is up
				if (hide_message_timestamp < Date.now() + 100) 
					ingamechatcontent.style.visibility = "inherit";
			}, MESSAGE_SHOW_DURATION);

			// Add the chat message to lobby
			const new_lobby_msg_container = document.createElement("div");
			const newbonklobby_chat_msg_colorbox = document.createElement("div");
			const lobby_msg_username = document.createElement("span");
			const lobby_msg_content = document.createElement("span");

			// This is the "profile picture" part of the chat
			newbonklobby_chat_msg_colorbox.classList.add("newbonklobby_chat_msg_colorbox");
			newbonklobby_chat_msg_colorbox.textContent = TWITCH_MSG_PREFIX;
			newbonklobby_chat_msg_colorbox.style.color = color;

			// This is the author part
			lobby_msg_username.classList.add("newbonklobby_chat_msg_name");
			lobby_msg_username.textContent = `${username}: `;
			lobby_msg_username.style.color = color;

			// The message content
			lobby_msg_content.classList.add("newbonklobby_chat_msg_txt");
			lobby_msg_content.innerHTML = message_span.innerHTML;

			// Make the new lobby message
			new_lobby_msg_container.dataset.id = message_id;
			new_lobby_msg_container.appendChild(newbonklobby_chat_msg_colorbox);
			new_lobby_msg_container.appendChild(lobby_msg_username);
			new_lobby_msg_container.appendChild(lobby_msg_content);

			// Get scroll position
			const at_bottom = Math.round(newbonklobby_chat_content.clientHeight + newbonklobby_chat_content.scrollTop) + 5 > newbonklobby_chat_content.scrollHeight;

			// Add the new message to the lobby
			newbonklobby_chat_content.appendChild(new_lobby_msg_container);

			// If the chat is scrolled near to the bottom, scroll to the bottom if there a new chat
			if (at_bottom)
				newbonklobby_chat_content.scrollTop = newbonklobby_chat_content.scrollHeight;

			// Remove the messages at the start if the message limit is reached
			const newbonklobby_chat_content_children = newbonklobby_chat_content.children;
			if (newbonklobby_chat_content_children.length > MAX_LOBBY_MESSAGE_COUNT)
				newbonklobby_chat_content.removeChild(newbonklobby_chat_content_children[0]);

			const ingamechatcontent_children = ingamechatcontent.children;
			if (ingamechatcontent_children.length > MAX_INGAME_MESSAGE_COUNT)
				ingamechatcontent.removeChild(ingamechatcontent_children[0]);
		}
	});

	// Detect when the lobby is shown/hidden, so we can show/hide the chat
	new MutationObserver(() => {
		// Returned to lobby, we should hide the chat
		if (gamerenderer.style.visibility === "hidden") 
			ingamechatcontent.style.visibility = "hidden";
		else 
			ingamechatcontent.style.visibility = "inherit";
	}).observe(gamerenderer, {
		attributeFilter: ["style"]
	});
})();