// ==UserScript==
// @name        Post Sketch Draws on Discord
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.1.1
// @author      Bell
// @license     MIT
// @copyright   2020, Faux (https://greasyfork.org/users/281093)
// @description Press the button in Save Drawings to post the drawing on #sketch-draws
// @downloadURL https://update.greasyfork.org/scripts/410925/Post%20Sketch%20Draws%20on%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/410925/Post%20Sketch%20Draws%20on%20Discord.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const webhookURL = 'https://discordapp.com/api/webhooks/752217964652265532/kh_2k9HuMiKiO2a-LLkTLyH0iNMQ43umPn9-0JoQjUhUf06AfzQeoPR1ShxjvWYVihs1';
const storedNames = JSON.parse(localStorage.getItem('storedNames')) || {};
const canvas = document.querySelector('#canvas');
const chat = document.querySelector('#gameChatList');

new MutationObserver(observeChat).observe(chat, { childList: true });

async function postImage(e) {
	try {
		const { drawerName, word } = getDrawerInfo(e);
		const posterName = document.querySelector('#nick').value || '[default name]';
		const drawingData = e.target.parentElement.querySelector('img').src.split(',')[1];
		const drawingURL = await getDrawingLink(drawingData);
		const fetchParams = getParams(word, drawerName, posterName, drawingURL);

		await fetch(webhookURL, fetchParams);
	}
	catch (err) {
		console.error(err);
	}
}

function getParams(word, drawerName, posterName, drawingURL) {
	const discordEmbed = [{
		title: word,
		description: `Drawn by: **${drawerName}**`,
		color: 0x0B5DEA,
		footer: { text: `Posted by: ${posterName}` },
		image: { url: drawingURL }
	}];

	const bodyData = {
		username: 'Sketch Draw',
		avatar_url: 'https://sketchful.io/res/icons/loading.png',
		embeds: discordEmbed
	};

	return {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bodyData)
	};
}

async function getDrawingLink(src) {
	const imgurData = new FormData();
	imgurData.append('image', src);

	const params = {
		method: 'POST',
		headers: { 'Authorization': 'Client-ID d0bd823e7933d4d' },
		body: imgurData
	};

	const response = await fetch('https://api.imgur.com/3/image', params);
	const resJSON = await response.json();

	return resJSON.data.link;
}

function getDrawerInfo(e) {
	const key = e.target.parentElement.classList[1];
	return key === 'saveCurrent' ? getCurrentDrawer() : getStoredDrawer(key);
}

function getCurrentDrawer() {
	const drawerNode = document.querySelector('.gameDrawing');
	let hint = document.querySelector('#gameSticky > font').textContent.replace(/_/g, ' \\_ ');
	const fd = isFreeDraw();
	if (hint === 'Time is up!') hint = storedNames.savePrevious.word;

	return drawerNode ? {
		drawerName: drawerNode.parentElement.querySelector('.gameAvatarName').textContent,
		word: hint
	} : {
		drawerName: fd ? (document.querySelector('#nick').value || '[default name]')
			: storedNames.savePrevious.drawerName,
		word: fd ? 'Free Draw' : storedNames.savePrevious.word
	};
}

function getStoredDrawer(key) {
	return {
		drawerName: storedNames[key].drawerName || '[undefined]',
		word: storedNames[key].word || '[undefined]'
	};
}

(function addButtons() {
	const button = document.createElement('button');
	button.setAttribute('class', 'btn btn-success btn-block mt-2');
	button.textContent = 'Post on Discord';

	document.querySelectorAll(`
		.saveCurrent,
		.savePrevious,
		.saveTwo
	`).forEach(add);

	function add(node) {
		const btn = button.cloneNode(true);
		btn.onclick = postImage;
		node.appendChild(btn);
	}
})();

function storeName(message) {
	if (!message.startsWith('The word was')) return;

	const word = /: ([a-zA-Z0-9 -]+)/.exec(message)[1];
	const drawerNode = document.querySelector('.gameDrawing').parentElement;
	const drawerName = drawerNode.querySelector('.gameAvatarName').textContent;

	updateNames(drawerName, word);
}

function updateNames(_name, _word) {
	storedNames.saveTwo = {
		drawerName: storedNames.savePrevious.drawerName || '[undefined]',
		word: storedNames.savePrevious.word || '[undefined]'
	};

	storedNames.savePrevious = {
		drawerName: _name,
		word: _word
	};

	localStorage.setItem('storedNames', JSON.stringify(storedNames));
}

function observeChat(mutations) {
	mutations.forEach(mutation => {
		const msgNode = mutation.addedNodes[0];
		if (!msgNode || !msgNode.classList.contains('chatAdmin')) return;
		storeName(msgNode.textContent);
	});
}

function isFreeDraw() {
	return (
		canvas.style.display !== 'none' &&
		document.querySelector('#gameClock').style.display === 'none' &&
		document.querySelector('#gameSettings').style.display === 'none'
	);
}