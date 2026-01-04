// ==UserScript==
// @name        Mute Players
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.1
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description Right-click a player to mute them
// @downloadURL https://update.greasyfork.org/scripts/410222/Mute%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/410222/Mute%20Players.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const mutedPlayers = new Set();
const playerList = document.querySelector('#gamePlayersList');

playerList.addEventListener('contextmenu', (e) => {
	if (e.target.tagName === 'UL') return;
	e.preventDefault();

	const player = e.target.querySelector('.gameAvatarName');
	if (!player || player.style.color === 'teal') return;
	const playerName = player.textContent.trim();

	if (mutedPlayers.has(playerName)) {
		mutedPlayers.delete(playerName);
		player.style.filter = '';
	}
	else {
		mutedPlayers.add(playerName);
		player.style.filter = 'blur(1px) opacity(0.5)';
	}
});

const checkChat = (mutations) => {
	mutations.forEach(mutation => {
		const msgNode = mutation.addedNodes[0];
		if (!msgNode || msgNode.classList.contains('chatAdmin')) return;
		parseMessage(msgNode);
	});
};

const chat = document.querySelector('#gameChatList');
new MutationObserver(checkChat).observe(chat, { childList: true });

function parseMessage(msg) {
	let sender = msg.querySelector('b').textContent.trim();
	sender = sender.substring(0, sender.length - 1).trim();
	if (mutedPlayers.has(sender)) msg.remove();
}

new MutationObserver((mutations) => {
	mutations.forEach(mutation => {
		mutation.addedNodes.forEach(checkPlayer);
	});
}).observe(playerList, { childList: true });

function checkPlayer(playerNode) {
	const player = playerNode.querySelector('.gameAvatarName');
	if (!player) return;
	
	const playerName = player.textContent.trim();
	
	if (mutedPlayers.has(playerName)) { 
		player.style.filter = 'blur(1px) opacity(0.5)';
	}
}