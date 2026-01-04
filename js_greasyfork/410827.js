// ==UserScript==
// @name        Save Player Drawings
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description Click on a user and then click Track to automatically download their drawings after their turn.
// @downloadURL https://update.greasyfork.org/scripts/410827/Save%20Player%20Drawings.user.js
// @updateURL https://update.greasyfork.org/scripts/410827/Save%20Player%20Drawings.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const trackedPlayers = JSON.parse(localStorage.getItem('trackedPlayers')) || [];
const userModalHeader = document.querySelector('#userModal div.modal-header');
const chat = document.querySelector('#gameChatList');
const buttonTextOff = 'Track';
const buttonTextOn = 'Untrack';
const buttonStyle = `width: 100px; top: 70px; margin-right:
					 16px; position: absolute; right: 0px`;

(function addButton() {
	const modalBody = document.querySelector('#userModal div.modal-body');
	const button = document.createElement('button');
	button.setAttribute('class', 'btn btn-primary');
	button.setAttribute('style', buttonStyle);
	button.textContent = buttonTextOff;
	button.id = 'trackButton';
	button.onclick = toggleTrackedPlayer;
	modalBody.appendChild(button);
})();

function toggleTrackedPlayer() {
	const player = document.querySelector('#userModal h3').textContent;
	const button = document.querySelector('#trackButton');
	const tracked = trackedPlayers.includes(player);

	if (tracked) {
		trackedPlayers.splice(trackedPlayers.indexOf(player), 1);
		button.textContent = buttonTextOff;
	}
	else {
		trackedPlayers.push(player);
		button.textContent = buttonTextOn;
	}

	localStorage.setItem('trackedPlayers', JSON.stringify(trackedPlayers));
}

const updateHeader = (mutations) => {
	mutations.forEach(mutation => {
		const newNodes = mutation.addedNodes;
		if (!newNodes.length) return;
		updateButtonState(newNodes[0]);
	});
};

new MutationObserver(updateHeader)
	.observe(userModalHeader, { childList: true, subtree: true });

function updateButtonState(nameNode) {
	const player = nameNode.textContent;
	const button = document.querySelector('#trackButton');
	const tracked = trackedPlayers.includes(player);
	button.textContent = tracked ? buttonTextOn : buttonTextOff;
}

const checkChat = (mutations) => {
	mutations.forEach(mutation => {
		const msgNode = mutation.addedNodes[0];
		if (!msgNode || !msgNode.classList.contains('chatAdmin')) return;
		parseSystemMessage(msgNode.textContent);
	});
};

new MutationObserver(checkChat).observe(chat, { childList: true });

function downloadDrawing(name) {
	const a = document.createElement('a');
	a.download = name + '.png';
	a.href = document.querySelector('#canvas').toDataURL();
	a.click();
}

function parseSystemMessage(message) {
	if (message.startsWith('The word was')) {
		const word = /: ([a-zA-Z0-9 -]+)/.exec(message)[1];
		const drawerNode = document.querySelector('.gameDrawing').parentElement;
		let drawerName = drawerNode.querySelector('.gameAvatarName').textContent;

		if (!trackedPlayers.includes(drawerName)) return;

		drawerName = drawerName.replaceAll(/[\/\\*:>?<|"]/, '');
		if (!drawerName.length) drawerName = 'anon';
		downloadDrawing(`${word} by ${drawerName}`);
	}
}