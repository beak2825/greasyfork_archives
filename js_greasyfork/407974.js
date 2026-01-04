// ==UserScript==
// @name        Custom Word Lists
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/*
// @grant       GM.xmlHttpRequest
// @version     1.3
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @connect     sw-guild.com
// @description Creates a drop-down list with word lists from words.sketchful.io
// @downloadURL https://update.greasyfork.org/scripts/407974/Custom%20Word%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/407974/Custom%20Word%20Lists.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const siteURL = 'http://www.sw-guild.com/';

const categories = new Map();
const categoryURL = {
	color: {
		url: 'color-5.html',
		name: 'Colors'
	},
	famous: {
		url: 'famous-5.html',
		name: 'Famous'
	},
	game: {
		url: 'game-6.html',
		name: 'Games'
	},
	other: {
		url: 'other-5.html',
		name: 'Other'
	}
};

(function init() {
	addDroplist();
	loadWordlists();
})();

async function loadWordlists() {
	try {
		await Promise.all([
			getHTML(categoryURL.color), getHTML(categoryURL.famous),
			getHTML(categoryURL.game), getHTML(categoryURL.other)
		]);
		addOptions(categories);
	}
	catch (e) {
		console.error(e);
	}
}

function getHTML(category) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			method: 'GET',
			url: siteURL + category.url,
			onload: (res) => {
				categories.set(category.name, findWordlists(res));
				resolve(categories);
			},
			onerror: reject
		});
	});
}

function findWordlists(res) {
	const wordlists = new Map();

	const html = document.createElement('html');
	html.innerHTML = res.responseText;
	const lists = html.querySelectorAll('.text-placement');
	const listNames = html.querySelectorAll('.delete-title');

	for (let i = 0; i < lists.length; i++) {
		wordlists.set(
			listNames[i].textContent.trim(),
			lists[i].textContent.trim()
		);
	}

	return wordlists;
}

function addOptions() {
	const selectList = document.querySelector('#gameWordlists');

	for (const [category, lists] of categories) {
		const categoryName = document.createElement('optgroup');
		categoryName.label = category;
		selectList.appendChild(categoryName);

		for (const [listname, words] of lists) {
			const option = document.createElement('option');
			option.value = words;
			option.textContent = listname;
			categoryName.appendChild(option);
		}
	}
}

function addDroplist() {
	const formGroup = document.createElement('div');
	const label = document.createElement('label');
	const select = document.createElement('select');
	const wordsTextbox = document.querySelector('#gameSettingsWordsTextArea');
	const settingsCol = document.querySelector(
		'#gameSettings > div.row.align-items-end > div:nth-child(2)'
	);

	formGroup.setAttribute('class', 'form-group');
	label.setAttribute('for', 'gameWordlists');
	label.textContent = 'Word Lists';
	select.setAttribute('class', 'form-control');
	select.id = 'gameWordlists';
	select.onchange = () => {
		wordsTextbox.value = select.value;
	};
	formGroup.append(label, select);
	settingsCol.insertBefore(formGroup, settingsCol.firstChild);
}