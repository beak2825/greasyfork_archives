// ==UserScript==
// @name         BstX Notes 
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Advanced notes system for X and Bluesky profiles and posts
// @author       @MichDe.com aka @ManInTheDot.com
// @match        https://x.com/*
// @match        https://bsky.app/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/520073/BstX%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/520073/BstX%20Notes.meta.js
// ==/UserScript==

(function() {
'use strict';

const PLATFORMS = {
'x.com': {
	profileRegex: /^https:\/\/x\.com\/([^\/]+)$/,
	postRegex: /^https:\/\/x\.com\/([^\/]+)\/status\/(\d+)/,
	nonUserPages: [
		'/home', '/explore', '/notifications',
		'/messages', '/settings', '/i/', '/search'
	],
	buttonSelectors: [
		'header[role="banner"]',  // Side navigation area
		'div[data-testid="primaryColumn"]'  // Main content column
	]
},
'bsky.app': {
	profileRegex: /^https:\/\/bsky\.app\/profile\/([^\/]+)$/,
	postRegex: /^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/([a-z0-9]+)/,
	nonUserPages: [
		'/notifications', '/feeds', '/lists',
		'/settings', '/', '/explore', '/search'
	],
	buttonSelectors: [
		'nav[role="navigation"]',  // Side navigation
		'div[data-testid="AppContainer"]'  // Main app container
	]
}
};

const StorageManager = {
getAllNotes() {
	const notes = {};
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key.startsWith('social-notes:')) {
			const fullKey = key.replace('social-notes:', '');
			notes[fullKey] = JSON.parse(localStorage.getItem(key));
		}
	}
	return notes;
},
saveNote(key, noteData) {
	localStorage.setItem(`social-notes:${key}`, JSON.stringify(noteData));
},
getNote(key) {
	const note = localStorage.getItem(`social-notes:${key}`);
	return note ? JSON.parse(note) : null;
},
deleteNote(key) {
	localStorage.removeItem(`social-notes:${key}`);
}
};

class NotesPaneUI {
constructor() {
	this.createNotesPane();
	this.createAllNotesPane();
}

createNotesPane() {
	this.pane = document.createElement('div');
	this.pane.id = 'social-notes-pane';
	this.pane.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 500px;
		background: whitesmoke;
		border: 2px solid #333;
		z-index: 9999;
		padding: 20px;
		display: none;
		flex-direction: column;
		gap: 10px;
	`;

	this.keyInput = document.createElement('input');
	this.keyInput.placeholder = 'Profile/Post ID';
	this.keyInput.style.width = '100%';
	this.keyInput.disabled = true;

	this.notesTextarea = document.createElement('textarea');
	this.notesTextarea.placeholder = 'Enter notes...';
	this.notesTextarea.style.width = '100%';
	this.notesTextarea.rows = 5;

	this.tagsInput = document.createElement('input');
	this.tagsInput.placeholder = 'Tags (comma-separated)';
	this.tagsInput.style.width = '100%';

	const buttonContainer = document.createElement('div');
	buttonContainer.style.display = 'flex';
	buttonContainer.style.justifyContent = 'space-between';

	const saveButton = document.createElement('button');
	saveButton.textContent = 'Save';
	saveButton.onclick = () => this.saveNote();

	const cancelButton = document.createElement('button');
	cancelButton.textContent = 'Cancel';
	cancelButton.onclick = () => this.hide();

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.style.backgroundColor = 'red';
	deleteButton.style.color = 'white';
	deleteButton.onclick = () => this.deleteNote();

	const viewAllButton = document.createElement('button');
	viewAllButton.textContent = 'View All Notes';
	viewAllButton.onclick = () => {
		this.hide();
		this.showAllNotes();
	};

	buttonContainer.append(
		saveButton,
		cancelButton,
		deleteButton,
		viewAllButton
	);

	this.pane.append(
		this.keyInput,
		this.notesTextarea,
		this.tagsInput,
		buttonContainer
	);

	document.body.appendChild(this.pane);
}

createAllNotesPane() {
	this.allNotesPane = document.createElement('div');
	this.allNotesPane.id = 'social-notes-all-pane';
	this.allNotesPane.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600px;
		height: 500px;
		background: whitesmoke;
		border: 2px solid #333;
		z-index: 9999;
		padding: 20px;
		display: none;
		flex-direction: column;
		overflow-y: auto;
	`;

	const closeButton = document.createElement('button');
	closeButton.textContent = 'Close';
	closeButton.onclick = () => this.hideAllNotes();

	this.allNotesContainer = document.createElement('div');
	this.allNotesContainer.style.marginTop = '10px';

	this.allNotesPane.append(closeButton, this.allNotesContainer);
	document.body.appendChild(this.allNotesPane);
}

show(key, notes = '', tags = '') {
	this.keyInput.value = key;
	this.notesTextarea.value = notes;
	this.tagsInput.value = tags;
	this.pane.style.display = 'flex';
}

hide() {
	this.pane.style.display = 'none';
}

saveNote() {
	const key = this.keyInput.value.trim();
	const notes = this.notesTextarea.value.trim();
	const tags = this.tagsInput.value.trim().split(',')
		.map(t => t.trim())
		.filter(t => t);

	if (!key) {
		alert('Please enter a Profile/Post ID');
		return;
	}

	StorageManager.saveNote(key, { notes, tags });
	this.hide();
	addNotesButton(); 
}

deleteNote() {
	const key = this.keyInput.value.trim();
	if (key && confirm('Are you sure you want to delete this note?')) {
		StorageManager.deleteNote(key);
		this.hide();
		addNotesButton(); 
	}
}

showAllNotes() {
	const notes = StorageManager.getAllNotes();
	this.allNotesContainer.innerHTML = '';

	if (Object.keys(notes).length === 0) {
		this.allNotesContainer.innerHTML = '<p>No notes saved.</p>';
	} else {
		const table = document.createElement('table');
		table.style.width = '100%';
		table.style.borderCollapse = 'collapse';

		const headerRow = table.insertRow();
		['ID', 'Notes', 'Tags', 'Actions'].forEach(header => {
			const th = document.createElement('th');
			th.textContent = header;
			th.style.border = '1px solid black';
			headerRow.appendChild(th);
		});

		Object.entries(notes).forEach(([key, noteData]) => {
			const row = table.insertRow();

			const keyCell = row.insertCell();
			keyCell.textContent = key;
			keyCell.style.border = '1px solid black';
			keyCell.style.padding = '5px';

			const notesCell = row.insertCell();
			notesCell.textContent = noteData.notes || 'No notes';
			notesCell.style.border = '1px solid black';
			notesCell.style.padding = '5px';

			const tagsCell = row.insertCell();
			tagsCell.textContent = (noteData.tags || []).join(', ') || 'No tags';
			tagsCell.style.border = '1px solid black';
			tagsCell.style.padding = '5px';

			const actionsCell = row.insertCell();
			actionsCell.style.border = '1px solid black';
			actionsCell.style.padding = '5px';

			const editButton = document.createElement('button');
			editButton.textContent = 'Edit';
			editButton.onclick = () => this.show(key, noteData.notes, (noteData.tags || []).join(', '));

			const goToButton = document.createElement('button');
			goToButton.textContent = 'Go to';
			goToButton.onclick = () => this.navigateToItem(key);

			actionsCell.append(editButton, goToButton);
		});

		this.allNotesContainer.appendChild(table);
	}

	this.allNotesPane.style.display = 'flex';
}

hideAllNotes() {
	this.allNotesPane.style.display = 'none';
}

navigateToItem(key) {
	const platform = window.location.hostname;
	const [type, identifier] = key.split(':');

	const platformConfigs = {
		'x.com': {
			profile: `https://x.com/${identifier}`,
			status: `https://x.com/${key.split(':')[1].split('/')[0]}/status/${identifier}`
		},
		'bsky.app': {
			profile: `https://bsky.app/profile/${identifier}`,
			post: `https://bsky.app/profile/${key.split(':')[1].split('/')[0]}/post/${identifier}`
		}
	};

	const config = platformConfigs[platform];
	if (config && config[type]) {
		window.open(config[type], '_blank');
	} else {
		alert('Cannot navigate to this item.');
	}
}
}

function initSocialNotes() {
const platform = window.location.hostname;
const config = PLATFORMS[platform];
const notesPaneUI = new NotesPaneUI();

function getPageInfo() {
	const url = window.location.href;

	const profileMatch = url.match(config.profileRegex);
	if (profileMatch) {
		return {
			type: 'profile',
			key: `profile:${profileMatch[1]}`,
			isProfileOrPost: true
		};
	}

	const postMatch = url.match(config.postRegex);
	if (postMatch) {
		return {
			type: platform === 'x.com' ? 'status' : 'post',
			key: `${platform === 'x.com' ? 'status' : 'post'}:${postMatch[2]}`,
			isProfileOrPost: true
		};
	}

	return {
		type: 'other',
		key: `page:${window.location.pathname}`,
		isProfileOrPost: false
	};
}

function findButtonParent() {
	for (const selector of config.buttonSelectors) {
		const parent = document.querySelector(selector);
		if (parent) return parent;
	}
	return document.body;
}

function addNotesButton() {
	document.querySelectorAll('#social-notes-button').forEach(b => b.remove());

	const pageInfo = getPageInfo();
	const parent = findButtonParent();

	const button = document.createElement('div');
	button.id = 'social-notes-button';
	button.textContent = 'Notes';
	button.style.cssText = `
		position: fixed;
		bottom: 201px;
		right: 42px;
		width: 66px;
		height: 39px;
		border: 1px thin #ccc;
		background-color: skyblue;
		color: whitesmoke;
		cursor: pointer;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
	`;

	const existingNote = StorageManager.getNote(pageInfo.key);

	if (pageInfo.isProfileOrPost) {
		// Profile or post pages
		button.style.backgroundColor = existingNote ? 'springgreen' : 'skyblue';
	} else {
		// Other pages - muted tone
		button.style.backgroundColor = 'whitesmoke';
		button.style.color = 'black';
	}

	button.onclick = () => {
		const note = existingNote || {};
		notesPaneUI.show(
			pageInfo.key,
			note.notes || '',
			note.tags ? note.tags.join(', ') : ''
		);
	};

	parent.appendChild(button);
}

addNotesButton();

let lastUrl = window.location.href;
setInterval(() => {
	if (window.location.href !== lastUrl) {
		lastUrl = window.location.href;
		addNotesButton();
	}
}, 1000);
}

initSocialNotes();
})();