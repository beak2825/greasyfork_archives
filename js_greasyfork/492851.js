// ==UserScript==
// @name         Powerline.io infinite score and length
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Exploits debugging capabilities in the Powerline.io server to grant infinite score and length
// @author       ww
// @match        http://powerline.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/492851/Powerlineio%20infinite%20score%20and%20length.user.js
// @updateURL https://update.greasyfork.org/scripts/492851/Powerlineio%20infinite%20score%20and%20length.meta.js
// ==/UserScript==

(() => {
	var _WebSocket = unsafeWindow.WebSocket; // Copy the WebSocket constructor (to be hooked)
	let ws = null, // Current WebSocket the client is connected to
		handshakeCompleted = false; // whether or not the initial client handshake is complete
	unsafeWindow.WebSocket = function(address, protocol) {
		ws = new _WebSocket(address, protocol);
		var _send = ws.send; // Copy native send method
		ws.send = function() { // Intercept outgoing traffic
			const msg = new Uint8Array(arguments[0]);
			if (msg[0] == 1) { // If the first byte of the packet is 1, the packet is a handshake packet
				msg[0] = 171; // Change the byte to '171' which is the byte needed to enable debugging server-side
				console.log('Modified handshake packet and enabled debugging.');
				handshakeCompleted = true;
				arguments[0] = msg.buffer; // Re-encode Uint8Array to ArrayBuffer
			}
			return _send.apply(this, arguments); // Call native send method within the context of this WebSocket.
		}
		console.log('Modified WebSocket with address', address);
		return ws;
	}
	setInterval(() => {
		if (ws && handshakeCompleted) { // If the WebSocket exists and the handshake is completed
			/*
				To increase your score, length, and speed as a debug client
				all that's needed is to send a one-byte packet that consists of 0x9
			*/
			const packet = new Uint8Array([0x9]).buffer;
			ws.send(packet); // Send the packet
		}
	}, 100); // 100ms to unite network performance and score generation
})();