// ==UserScript==
// @name         Epikchat Notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Notify on text
// @author       You
// @match        https://www.epikchat.com/chat
// @icon         https://www.google.com/s2/favicons?domain=epikchat.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434345/Epikchat%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/434345/Epikchat%20Notifier.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const WebSocketProxy = new Proxy(window.WebSocket, {
		construct(target, args) {
			// console.log("Proxying WebSocket connection", ...args);
			const ws = new target(...args);

			// Configurable hooks
			ws.hooks = {
				beforeSend: e => console.log('beforeSend: ' + e),
				beforeReceive: e => {
					const data = JSON.parse(JSON.stringify({ data: e.data })).data;
					if (!data) return;
					try {
						const parsedData = JSON.parse(data.substring(data.indexOf('[')));
						handleMessage(parsedData);
					}
					catch (e) {
						console.error(e);
					}
				}
			};

			// Intercept send
			const sendProxy = new Proxy(ws.send, {
				apply(target, thisArg, args) {
					if (ws.hooks.beforeSend(args) === false) {
						return;
					}
					return target.apply(thisArg, args);
				}
			});
			ws.send = sendProxy;

			// Intercept events
			const addEventListenerProxy = new Proxy(ws.addEventListener, {
				apply(target, thisArg, args) {
					if (args[0] === "message" && ws.hooks.beforeReceive(args) === false) {
						return;
					}
					return target.apply(thisArg, args);
				}
			});
			ws.addEventListener = addEventListenerProxy;

			Object.defineProperty(ws, "onmessage", {
				set(func) {
					const onmessage = function onMessageProxy(event) {
						if (ws.hooks.beforeReceive(event) === false) {
							return;
						}
						func.call(this, event);
					};
					return addEventListenerProxy.apply(this, [
						"message",
						onmessage,
						false
					]);
				}
			});

			// Save reference
			window._websockets = window._websockets || [];
			window._websockets.push(ws);

			return ws;
		}
	});

	window.WebSocket = WebSocketProxy;

	// Usage
	// After a websocket connection has been created:
	window._websockets[0].hooks = {
		// Just log the outgoing request
		beforeSend: data => console.log(data),
		// Return false to prevent the on message callback from being invoked
		beforeReceive: data => false
	};

})();

var rooms = [];

function handleMessage(message) {
	const messageType = message[0];
	switch (typeof messageType) {
		case "object":
			handleObjectMessage(message);
			break;
		case "string":
			handleStringMessage(message);
			break;
	}
}

function handleObjectMessage(message) {
	console.log("handleObjectMessage1: ");
	console.log(message);
	if (message[0]) {
		if (message[0].joined) {
			handleJoinedMessage(message[0]);
		}
	}
}

function handleStringMessage(message) {
	const messageType = message[0];
	const messageContent = message[1];
	if (messageType === 'textMessage') {
		const messageText = messageContent.message.toLowerCase();
		if (messageText.indexOf("jojo") > -1) {
			let rooms = [];
			let roomElements = document.getElementsByClassName('chat-tabs')[0];


			if (messageContent.dest_type == "room") {
				for (let room of roomElements.childNodes) {
					let roomName = room.getAttribute('data-original-title')
					let roomDetails = room.childNodes[1];
					let roomId = roomDetails?.getAttribute('data-id');
					let roomType = roomDetails?.getAttribute('data-type');
					console.log(`Trying to add room ${roomId} - ${roomName} - ${roomType}`);
					rooms.push({ roomId: roomId, roomName: roomName, roomType: roomType });
					console.log(`Adding room ${roomId} - ${roomName} - ${roomType}`);
				}
				let destinationRoom = rooms.find(r => r.roomId == messageContent.dest_id && r.roomType == messageContent.dest_type)?.roomName;
				console.log(`NOTIFICATION: User "${messageContent.name}" has mentioned you in channel "${destinationRoom}"`);
			}

			if (messageContent.dest_type == "dm") {
				console.log(`NOTIFICATION: User "${messageContent.name}" has mentioned you in a private message`);
			}
		}
	}
}

function handleJoinedMessage(message) {
	// console.log("Joined: ");
	// console.log(message.room);
}

