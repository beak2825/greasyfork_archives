// ==UserScript==
// @name           Gamdom Notify
// @description    Rain Notifications
// @version        2.4
// @author         Pytness
// @match          *://gamdom.com/*
// @namespace      https://greasyfork.org/scripts/35717-gamdom-notify/
// @update         https://greasyfork.org/scripts/35717-gamdom-notify/code/Gamdom%20Notify.user.js
// @resource       CoinAudioData https://raw.githubusercontent.com/Pytness/Gamdom-Notify/master/CoinSound.mp3
// @run-at         document-start
// @grant          GM_info
// @grant          GM_notification
// @grant          GM_getResourceURL
// @grant          unsafeWindow
// @license        Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// @downloadURL https://update.greasyfork.org/scripts/35717/Gamdom%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/35717/Gamdom%20Notify.meta.js
// ==/UserScript==

(function (w) {

	'use strict';

	const log = w.console.log.bind();

	// NOTE: Creates a ascii box
	const box = (a, b = 0) => {
		let d, c = '';
		a.forEach(e => b = e.length > b ? e.length : b);
		d = '+'.padEnd(b, '=') + '+';
		a.forEach(e => c += '|' + e.padEnd(b - 1, ' ') + '|\n');
		return d + '\n' + c + d;
	};

	///////////////////////////////////////////////////////////////////////////

	const initMessage = box([
		' Gamdom Rain Notify:', '',
		' Ver: ' + GM_info.script.version,
		' By ' + GM_info.script.author, '',
	], 40);

	const NData = { // Notification data
		title: "Gamdom Rain Notify:",
		text: "its raining :D",
		highlight: true,
		timeout: 5000
	};

	///////////////////////////////////////////////////////////////////////////

	const CoinAudioData = GM_getResourceURL('CoinAudioData')
		.replace('application', 'audio/mp3');

	const CoinSound = new Audio(CoinAudioData); // Load Audio

	const notificate = () => {
		CoinSound.play();
		GM_notification(NData);
	};

	///////////////////////////////////////////////////////////////////////////

	const extractData = (a, b = false) => {
		try {
			b = JSON.parse(a.split(',').slice(1).join());
		} finally {
			return b;
		}
	};

	const manageMessages = (a) => {
		var b = extractData(a.data);
		if(b[0] == 'activateRain') notificate();
	};

	///////////////////////////////////////////////////////////////////////////

	/* NOTE: HijackWebsocket is imported (and modified)
	 *    from https://github.com/Pytness/Hijack-Websocket
	 */

	const HijackWebsocket = () => {

		const WS = w.WebSocket;
		w.WebSocket = function (...argv) {
			let hws = new WS(...argv);
			hws.addEventListener('message', manageMessages);
			log('Intercepted new WebSocket conection', 'info');
			return hws;
		};

		log('WebSocket constructor hijacked', 'ok');

		w.WebSocket.prototype = WS.prototype;
		w.WebSocket.__proto__ = WS.__proto__;

		w.WebSocket = Function.prototype.call.apply(Function.prototype.bind, [w.WebSocket]);
		
		log('Hijacked WebSocket secured', 'ok');
		log('Waiting for WebSocket creation...', 'info');
	};


	///////////////////////////////////////////////////////////////////////////

	const init = () => {
		// NOTE: Log on console Script info
		log(initMessage);

		// NOTE: Hijack the WebSocket constructor
		HijackWebsocket();
	};

	init();

}(unsafeWindow));