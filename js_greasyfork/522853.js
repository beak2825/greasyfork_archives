// ==UserScript==
// @name         Name Saver for Multiplayer Piano
// @namespace    callum fisher
// @version      1.2.1
// @license      Unlicense
// @description  Auto-Save & Set your nickname on Multiplayer Piano. No more 'Anonymous.'
// @author       callum fisher
// @match        *://multiplayerpiano.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522853/Name%20Saver%20for%20Multiplayer%20Piano.user.js
// @updateURL https://update.greasyfork.org/scripts/522853/Name%20Saver%20for%20Multiplayer%20Piano.meta.js
// ==/UserScript==

// 2025.01.04 - 2025.11.23

const startMPPNameSaver = () => {
	console.log('[Name Saver for Multiplayer Piano v1.2.1] Running.');
	let setName = () => {
		MPP.client.sendArray([{
			'm': 'userset',
			'set': {
				'name': localStorage.nsNick
			}
		}]);
		if (!MPP.client.isConnected() || MPP.client.getOwnParticipant().name !== localStorage.nsNick) {
			setTimeout(setName, 5000);
			return;
		}
	}
	let checkName = () => {
		if (typeof localStorage.nsNick === 'undefined') localStorage.nsNick = MPP.client.getOwnParticipant().name;
		if (MPP.client.getOwnParticipant().name !== localStorage.nsNick) {
			setName();
		}
	}
	let saveName = () => {
		if (MPP.client.getOwnParticipant().name === localStorage.nsNick) return;
		localStorage.nsNick = MPP.client.getOwnParticipant().name;
	}
	if (MPP.client.isConnected()) checkName();
	MPP.client.on('connect', checkName);
	MPP.client.on('p', saveName);
}

// Start:

if (!window.addEventListener) {
	window.attachEvent('onload', startMPPNameSaver);
} else {
	window.addEventListener('load', startMPPNameSaver);
}
