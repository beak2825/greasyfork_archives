// ==UserScript==
// @name         [GMT] Extract artists from description & transfer artists between pages
// @namespace    https://greasyfork.org/cs/users/321857-anakunda
// @run-at       document-end
// @version      1.44.4
// @description  Tries to extract artists from selected text or tracklist in group description, easy batch transfer of artist between different pages
// @author       Anakunda
// @copyright    2020-21, Anakunda (https://greasyfork.org/cs/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @match        https://*/torrents.php?id=*
// @match        https://*/torrents.php?*&id=*
// @match        https://*/upload.php*
// @match        https://*/requests.php?action=new*
// @match        https://*/requests.php?action=view&id=*
// @match        https://*/requests.php?action=edit&id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @downloadURL https://update.greasyfork.org/scripts/388520/%5BGMT%5D%20Extract%20artists%20from%20description%20%20transfer%20artists%20between%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/388520/%5BGMT%5D%20Extract%20artists%20from%20description%20%20transfer%20artists%20between%20pages.meta.js
// ==/UserScript==

'use strict';

const isFirefox = /\b(?:Firefox)\b/.test(navigator.userAgent) || Boolean(window.InstallTrigger);
function hasStyleSheet(name) {
	if (name) name = name.toLowerCase(); else throw 'Invalid argument';
	const hrefRx = new RegExp('\\/' + name + '\\b', 'i');
	if (document.styleSheets) for (let styleSheet of document.styleSheets)
		if (styleSheet.title && styleSheet.title.toLowerCase() == name) return true;
			else if (styleSheet.href && hrefRx.test(styleSheet.href)) return true;
	return false;
}
const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light', '2iUn3'].some(hasStyleSheet);
if (isLightTheme) console.log('Light Gazelle theme detected');
const isDarkTheme = ['kuro', 'minimal', 'red_dark', 'Vinyl'].some(hasStyleSheet);
if (isDarkTheme) console.log('Dark Gazelle theme detected');

const artistClasses = [
	'artist_main', 'artist_guest', 'artists_remix', 'artists_composers',
	'artists_conductors', 'artists_dj', 'artists_producer', 'artists_arranger',
];
const bcName = 'gazelle-artists', bcr = new BroadcastChannel(bcName), bcs = new BroadcastChannel(bcName);
let groupArtists, saveBtn, loadBtn, span;
function saveData(artists) {
	if (artists.length > 0) bcs.postMessage(artists.sort(function(a, b) {
		const c = (a[1] > 0 ? a[1] : Infinity) - (b[1] > 0 ? b[1] : Infinity);
		return c != 0 ? c : a[0].toLowerCase().localeCompare(b[0].toLowerCase());
	}));
	if (typeof GM_getTab == 'function' && typeof GM_saveTab == 'function') GM_getTab(function(tab) {
		if (artists.length > 0) {
			tab.artists = artists;
			tab.saveTimestamp = Date.now();
		} else delete tab.artists;
		GM_saveTab(tab);
	});
}
function setLoadData() {
	if (typeof GM_getTabs == 'function') GM_getTabs(function(tabs) {
		const artists = new Map;
		for (let tab in tabs) if (tabs[tab] && tabs[tab].saveTimestamp && tabs[tab].artists) artists.set(tabs[tab].saveTimestamp, tab);
		if (artists.size <= 0) return;
		loadBtn.artists = tabs[artists.get(Math.max(...artists.keys()))].artists;
		loadBtn.style.visibility = 'visible';
	});
	bcr.addEventListener('message', function(message) {
		console.assert(message instanceof MessageEvent && Array.isArray(message.data),
			'message instanceof MessageEvent && Array.isArray(message.data)');
		if (!(message instanceof MessageEvent) || !Array.isArray(message.data)) return false;
		loadBtn.artists = message.data;
		loadBtn.style.visibility = 'visible';
		//saveData(message.data);
	});
}
if ((groupArtists = document.body.querySelector('td#artistfields')) != null) {
	function addControls(root = document.body.querySelector('td#artistfields')) {
		if (!(root instanceof HTMLElement)
				|| (root = [':scope > a.brackets:last-of-type', ':scope > select[name="importance[]"]']
					.reduce((elem, selector) => elem || root.querySelector(selector), null)) == null) return;
		root.style.marginRight = '2em';

		if (!new URLSearchParams(document.location.search).has('groupid')) {
			loadBtn = document.createElement('A');
			loadBtn.id = 'load-gazelle-artists';
			loadBtn.textContent = 'Load';
			loadBtn.className = 'brackets';
			loadBtn.style.visibility = 'hidden';
			loadBtn.href = '#';
			loadBtn.onclick = function(evt) {
				if (!Array.isArray(evt.currentTarget.artists) || evt.currentTarget.artists.length <= 0) return;
				let artists = evt.currentTarget.artists.filter(artist => artist.length == 2), artistFields;
				while ((artistFields = document.body.querySelectorAll('input[name="artists[]"]')).length != artists.length)
					if (artistFields.length < artists.length) AddArtistField(); else RemoveArtistField();
				artists.forEach(function(artist, ndx) {
					artistFields[ndx].value = artist[0];
					artistFields[ndx].nextElementSibling.value = artist[1];
				});
				return false;
			};
			setLoadData();
			root.after(loadBtn);
		}

		saveBtn = document.createElement('A');
		saveBtn.id = 'save-gazelle-artists';
		saveBtn.textContent = 'Save';
		saveBtn.className = 'brackets';
		saveBtn.style = 'margin-right: 3px;';
		saveBtn.href = '#';
		saveBtn.onclick = function(evt) {
			evt.currentTarget.style.color = null;
			saveData(Array.from(document.body.querySelectorAll('input[name="artists[]"]'))
				.filter(artist => artist.value.trim().length > 0)
				.map(artist => [artist.value.trim(), artist.nextElementSibling.value]));
			evt.currentTarget.style.color = isDarkTheme ? 'lightgreen' : 'darkgreen';
			setTimeout(elem => { elem.style.color = null }, 1000, evt.currentTarget);
			return false;
		};
		root.after(saveBtn);
	}

	addControls(groupArtists);
	const categories = document.getElementById('categories'), dynamicForm = document.getElementById('dynamic_form');
	if (dynamicForm != null) new MutationObserver(function(mutationsList) {
		if (categories != null && !['0', 'Music'].includes(categories.value)) return;
		for (let mutation of mutationsList) for (let node of mutation.addedNodes)
			if (node.nodeName == 'TABLE' && node.classList.contains('layout')) return addControls();
	}).observe(dynamicForm, { childList: true });
	return;
}
if ((groupArtists = document.body.querySelector('div.box_artists > div.head')) != null) {
	loadBtn = groupArtists.querySelector('span.edit_artists');
	span = document.createElement('SPAN');
	span.style.float = 'right';
	if (loadBtn != null) span.style.marginRight = '1em';
	saveBtn = document.createElement('A');
	saveBtn.id = 'save-gazelle-artists';
	saveBtn.textContent = 'Save';
	saveBtn.className = 'brackets';
	saveBtn.href = '#';
	saveBtn.onclick = function(evt) {
		evt.currentTarget.style.color = null;
		const ac = artistClasses.concat(['artists_main', 'artists_guest']);
		saveData(Array.from(document.body.querySelectorAll('div.box_artists > ul > li > a:first-of-type'))
			.map(artist => [artist.textContent.trim(), ac.indexOf(artist.parentNode.className) % 8 + 1]));
		evt.currentTarget.style.color = isDarkTheme ? 'darkgreen' : 'lightgreen';
		setTimeout(elem => { elem.style.color = null }, 1000, evt.currentTarget);
		return false;
	}
	span.append(saveBtn);
	groupArtists.append(span);
	if (loadBtn != null) {
		span = document.createElement('SPAN');
		span.style = 'float: right; margin-left: 3pt;';
		saveBtn = document.createElement('A');
		saveBtn.id = 'remove-all-artists';
		saveBtn.title = 'Kill \'Em All';
		saveBtn.textContent = 'X';
		saveBtn.className = 'brackets';
		saveBtn.style.color = 'red';
		saveBtn.href = '#';
		saveBtn.onclick = function(evt) {
			if (confirm('Kill \'Em All?'))
				for (let a of document.querySelectorAll('ul#artist_list > li > span.remove_artist > a')) a.click();
			return false;
		}
		span.append(saveBtn);
		groupArtists.insertBefore(span, loadBtn);
	}
}
if ((groupArtists = document.body.querySelector('div.box_addartists > div.head')) != null) {
	span = document.createElement('SPAN');
	span.style = 'float: right; margin-right: 1em;';
	loadBtn = document.createElement('A');
	loadBtn.id = 'load-gazelle-artists';
	loadBtn.textContent = 'Load';
	loadBtn.className = 'brackets';
	loadBtn.style.visibility = 'hidden';
	loadBtn.href = '#';
	loadBtn.onclick = function(evt) {
		let artists = evt.currentTarget.artists.filter(artist => artist.length == 2), artistFields;
		while ((artistFields = document.body.querySelectorAll('input[name="aliasname[]"]')).length < artists.length)
			AddArtistField();
		artistFields.forEach(function(elem, ndx) {
			elem.value = ndx < artists.length ? artists[ndx][0] : '';
			elem.nextElementSibling.value = ndx < artists.length ? artists[ndx][1] : 0;
		});
		return false;
	}
	setLoadData();
	span.append(loadBtn);
	groupArtists.append(span);

	span = document.createElement('SPAN');
	span.style = 'float: right; margin-right: 3px;';
	saveBtn = document.createElement('A');
	saveBtn.id = 'save-gazelle-artists';
	saveBtn.textContent = 'Save';
	saveBtn.className = 'brackets';
	saveBtn.href = '#';
	saveBtn.onclick = function(evt) {
		evt.currentTarget.style.color = null;
		saveData(Array.from(document.body.querySelectorAll('input[name="aliasname[]"]'))
			.filter(artist => artist.value.trim().length > 0)
			.map(artist => [artist.value.trim(), artist.nextElementSibling.value]));
		evt.currentTarget.style.color = isDarkTheme ? 'darkgreen' : 'lightgreen';
		setTimeout(elem => { elem.style.color = null }, 1000, evt.currentTarget);
		return false;
	}
	span.append(saveBtn);
	groupArtists.append(span);
}

for (let groupArtists of ['div.box_addartists', 'div.box_artists'].map(selector => document.body.querySelector(selector))) {
	if (groupArtists == null) continue;
	groupArtists.ondragover = evt => false;
	groupArtists.ondragenter = groupArtists[`ondrag${'ondragexit' in groupArtists ? 'exit' : 'leave'}`] = function(evt) {
		for (let tgt = evt.relatedTarget; tgt != null; tgt = tgt.parentNode) if (tgt == evt.currentTarget) return false;
		evt.currentTarget.style.backgroundColor = evt.type == 'dragenter' ? '#7fff0040' : null;
	};
	groupArtists.ondrop = function(evt) {
		evt.currentTarget.style.backgroundColor = null;
		if (evt.target.nodeName == 'INPUT' && evt.target.type == 'text') return true;
		showDialog(evt.dataTransfer.getData('text/plain').trim());
		return false;
	};
}

const addBox = document.body.querySelector('form.add_form[name="artists"]');
if (addBox == null) return;

String.prototype.consolidateWhitespace = function() {
	return this.replace(/\s+/ig, ' ');
};

Array.prototype.includesCaseless = function(str) {
	if (typeof str != 'string') return false;
	str = str.toLowerCase();
	return this.find(elem => typeof elem == 'string' && elem.toLowerCase() == str) != undefined;
};
Array.prototype.pushUnique = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includes(it)) this.push(it) });
	return this.length;
};
Array.prototype.pushUniqueCaseless = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includesCaseless(it)) this.push(it) });
	return this.length;
};

const siteApiTimeframeStorageKey = 'AJAX time frame', gazelleApiFrame = 10500;
let xhr = new XMLHttpRequest, modal = null, btnAdd = null, btnCustom = null,
		customCtrls = [ ], sel = null, ajaxRejects = 0;
let prefs = {
	set: function(prop, def) { this[prop] = GM_getValue(prop, def) }
};
let redacted_api_key = GM_getValue('redacted_api_key');
try { var siteArtistsCache = JSON.parse(sessionStorage.siteArtistsCache) } catch(e) { siteArtistsCache = [ ] }
try { var notSiteArtistsCache = JSON.parse(sessionStorage.notSiteArtistsCache) } catch(e) { notSiteArtistsCache = [ ] }

const styleSheet = `
.modal {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	visibility: hidden;
	transform: scale(1.1);
	transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
	z-index: 999;
}

.modal-content {
	position: absolute;
	top: 50%;
	left: 50%;
	font-size: 17px;
	transform: translate(-50%, -50%);
	background-color: FloralWhite;
	color: black;
	width: 31rem;
	border-radius: 0.5rem;
	padding: 2rem 2rem 2rem 2rem;
	font-family: monospace;
}

.show-modal {
	opacity: 1;
	visibility: visible;
	transform: scale(1.0);
	transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
}

input[type="text"] { cursor: text; }
input[type="radio"] { cursor: pointer; }
.lbl { cursor: pointer; }

.tooltip {
	position: relative;
}

.tooltip .tooltiptext {
	visibility: hidden;
	width: 120px;
	background-color: #555;
	color: #fff;
	text-align: center;
	border-radius: 6px;
	padding: 5px 0;
	position: absolute;
	z-index: 1;
	bottom: 125%;
	left: 50%;
	margin-left: -60px;
	opacity: 0;
	transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
	position: absolute;
	top: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
	opacity: 1;
}

button.splitter {
	position: relative;
	width: 20pt;
	height: 20pt;
	text-align: center;
	font-weight: bold;
	font-size: 10pt;
	top: -1pt;
	background-color: darkolivegreen;
	color: white;
}
`;

btnAdd = document.createElement('input');
btnAdd.id = 'add-artists-from-selection';
btnAdd.value = 'Extract from selection';
btnAdd.onclick = add_from_selection;
btnAdd.type = 'button';
btnAdd.style.marginLeft = '5px';
btnAdd.style.visibility = 'hidden';
addBox.append(btnAdd);

let style = document.createElement('style');
document.head.appendChild(style);
style.id = 'artist-parser-form';
style.type = 'text/css';
style.innerHTML = styleSheet;
let el, elem = [ ];
elem.push(document.createElement('div'));
elem[elem.length - 1].className = 'modal';
elem[elem.length - 1].id = 'add-from-selection-form';
modal = elem[0];
elem.push(document.createElement('div'));
elem[elem.length - 1].className = 'modal-content';
elem.push(document.createElement('input'));
elem[elem.length - 1].id = 'btnFill';
elem[elem.length - 1].type = 'submit';
elem[elem.length - 1].value = 'Capture';
elem[elem.length - 1].style = "position: fixed; right: 30px; width: 80px; top: 30px;";
elem[elem.length - 1].onclick = doParse;
elem.push(document.createElement('input'));
elem[elem.length - 1].id = 'btnCancel';
elem[elem.length - 1].type = 'button';
elem[elem.length - 1].value = 'Cancel';
elem[elem.length - 1].style = "position: fixed; right: 30px; width: 80px; top: 65px;";
elem[elem.length - 1].onclick = closeModal;

let presetIndex = 0;
function addPreset(val, label = 'Custom', rx = null, order = [1, 2]) {
	elem.push(document.createElement('div'));
	el = document.createElement('input');
	elem[elem.length - 1].style.paddingBottom = '10px';
	el.id = 'parse-preset-' + val;
	el.name = 'parse-preset';
	el.value = val;
	if (val == 1) el.checked = true;
	el.type = 'radio';
	el.onchange = update_custom_ctrls;
	if (rx) {
		el.rx = rx;
		el.order = order;
	}
	if (val == 999) btnCustom = el;
	elem[elem.length - 1].appendChild(el);
	el = document.createElement('label');
	el.style.marginLeft = '10px';
	el.style.marginRight = '10px';
	el.htmlFor = 'parse-preset-' + val;
	el.className = 'lbl';
	el.innerHTML = label;
	elem[elem.length - 1].appendChild(el);
	if (val != 999) return;
	el = document.createElement('input');
	el.type = 'text';
	el.id = 'custom-pattern';
	el.style.width = '20rem';
	el.style.fontFamily = 'monospace';
	el.autoComplete = "on";
	addTooltip(el, 'RegExp to parse lines, first two captured groups are used');
	customCtrls.push(elem[elem.length - 1].appendChild(el));
	el = document.createElement('input');
	el.type = 'radio';
	el.name = 'parse-order';
	el.id = 'parse-order-1';
	el.value = 1;
	el.checked = true;
	el.style.marginLeft = '1rem';
	addTooltip(el, 'Captured regex groups assigned in order $1: artist(s), $2: assignment');
	customCtrls.push(elem[elem.length - 1].appendChild(el));
	el = document.createElement('label');
	el.htmlFor = 'parse-order-1';
	el.textContent = '→';
	el.style.marginLeft = '5px';
	elem[elem.length - 1].appendChild(el);
	el = document.createElement('input');
	el.type = 'radio';
	el.name = 'parse-order';
	el.id = 'parse-order-2';
	el.value = 2;
	el.style.marginLeft = '10px';
	addTooltip(el, 'Captured regex groups assigned in order $1: assignment, $2: artist(s)');
	customCtrls.push(elem[elem.length - 1].appendChild(el));
	el = document.createElement('label');
	el.htmlFor = 'parse-order-2';
	el.textContent = '←';
	el.style.marginLeft = '5px';
	elem[elem.length - 1].appendChild(el);
}
addPreset(++presetIndex, escapeHTML('<artist(s)>[ - <assignment>]'), /^\s*(.+?)(?:\:|\s+[\-\−\—\~\–]+\s+(.*?))?\s*$/);
addPreset(++presetIndex, escapeHTML('<artist>[, <assignment>]') +
	'<span style="font-family: initial;">&nbsp;&nbsp;<i>(HRA style)</i></span>', /^\s*(.+?)(?:\:|\s*,\s*(.*?))?\s*$/);
addPreset(++presetIndex, escapeHTML('<artist(s)>[: <assignment>]'), /^\s*(.+?)(?:\:|\s*:+\s*(.*?))?(?:\s*,)?\s*$/);
addPreset(++presetIndex, escapeHTML('<artist(s)>[ (<assignment>)]'), /^\s*(.+?)(?:\:|\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))?(?:\s*,)?\s*$/);
addPreset(++presetIndex, escapeHTML('<artist(s)>[ | <assignment>]'), /^\s*(.+?)(?:\s*\|\s*(.*?))?(?:\s*,)?\s*$/);
addPreset(++presetIndex, escapeHTML('[<assignment> - ]<artist(s)>'), /^\s*(?:(.*?)\s+[\-\−\—\~\–]+\s+)?(.+?)\:?(?:\s*,)?\s*$/, [2, 1]);
addPreset(++presetIndex, escapeHTML('[<assignment>: ]<artist(s)>'), /^\s*(?:(.*?)\s*:+\s*)?(.+?)\:?(?:\s*,)?\s*$/, [2, 1]);
addPreset(++presetIndex, escapeHTML('[<assignment> | ]<artist(s)>'), /^\s*(?:(.*?)\s*\|\s*)?(.+?)\:?(?:\s*,)?\s*$/, [2, 1]);
addPreset(++presetIndex, escapeHTML('<artist>[ / <assignment>]'), /^\s*(.+?)(?:\:|\s*\/+\s*(.*?))?(?:\s*,)?\s*$/);
addPreset(++presetIndex, escapeHTML('<artist>[; <assignment>]'), /^\s*(.+?)(?:\:|\s*;\s*(.*?))?(?:\s*,)?\s*$/);
addPreset(++presetIndex, escapeHTML('[<assignment> / ]<artist(s)>'), /^\s*(?:(.*?)\s*\/+\s*)?(.+?)\:?(?:\s*,)?\s*$/, [2, 1]);
addPreset(++presetIndex, '<span style="font-family: initial;">From tracklist</span>',
	/^\s*((?:\d+|[A-Z](?:\d+)?)(?:[\-\.](?:\d+|[A-Za-z])|[A-Za-z])?)(?:\s*[\-\−\—\~\–\.\:]\s*|\s+)(.+?)(?:\s+(\((?:\d+:)?\d+:\d+\)|\[(?:\d+:)?\d+:\d+\]))?\s*$/, []);
addPreset(999);
elem.slice(2).forEach(k => { elem[1].appendChild(k) });
elem[0].appendChild(elem[1]);
document.body.appendChild(elem[0]);
window.addEventListener("click", windowOnClick);
document.addEventListener('selectionchange', function(evt) {
	let cs = window.getComputedStyle(modal);
	if (!btnAdd || window.getComputedStyle(modal).visibility != 'hidden') return;
	showHideAddbutton();
});

const vaParser = /^(?:Various(?:\s+Artists)?|Varios(?:\s+Artistas)?|V\/?A|\<various\s+artists\>|Různí(?:\s+interpreti)?)$/i;
const multiArtistParsers = [
	/\s*[\,\;\u3001](?!\s*(?:[JjSs]r)\b)(?:\s*(?:[Aa]nd|\&)\s+)?\s*/,
	/\s+(?:[\/\|\×]|meets)\s+/i,
];
const ampersandParsers = [
	/\s+(?:meets|vs\.?|X)\s+(?!\s*(?:[\&\/\+\,\;]|and))/i,
	/\s*[;\/\|\×]\s*(?!\s*(?:\s*[\&\/\+\,\;]|and))/i,
	/(?:\s*,)?\s+(?:[\&\+]|and)\s+(?!his\b|her\b|Friends$|Strings$)/i, // /\s+(?:[\&\+]|and)\s+(?!(?:The|his|her|Friends)\b)/i,
	/\s*\+\s*(?!(?:his\b|her\b|Friends$|Strings$))/i,
];
const featArtistParsers = [
	///\s+(?:meets)\s+(.+?)\s*$/i,
	/* 0 */ /\s+(?:[Ww](?:ith|\.?\/)|[Aa]vec)\s+(?!his\b|her\b|Friends$|Strings$)(.+?)\s*$/,
	/* 1 */ /(?:\s+[\-\−\—\–\_])?\s+(?:[Ff]eaturing\s+|(?:(?:[Ff]eat\.?|(?:[Ff]t|FT)\.))\s*|[Ff]\.?\/\s+)([^\(\)\[\]\{\}]+?)(?=\s*(?:[\(\[\{].*)?$)/,
	/* 2 */ /\s+\[\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\[\]]+?)\s*\]/i,
	/* 3 */ /\s+\(\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\(\)]+?)\s*\)/i,
	/* 4 */ /\s+\[\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\[\]]+?)\s*\]/i,
	/* 5 */ /\s+\(\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\(\)]+?)\s*\)/i,
	/* 6 */ /\s+\[\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\[\]]+?)\s*\]/,
	/* 7 */ /\s+\(\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\(\)]+?)\s*\)/,
];
const remixParsers = [
	/\s+\((?:The\s+)?(?:Remix|RMX)(?:e[sd])?\)/i,
	/\s+\[(?:The\s+)?(?:Remix|RMX)(?:e[sd])?\]/i,
	/\s+(?:The\s+)?(?:Remix|RMX)(?:e[sd])?\s*$/i,
	/^(?:The\s+)?(?:(?:Remix|RMX)s)\b|\b(?:The\s+)?(?:Remixes)$/,
	/\s+\(([^\(\)]+?)[\'\’\`]s[^\(\)]*\s(?:(?:Re)?Mix|RMX|Reworx)\)/i,
	/\s+\[([^\[\]]+?)[\'\’\`]s[^\[\]]*\s(?:(?:Re)?Mix|RMX|Reworx)\]/i,
	/\s+\(([^\(\)]+?)\s+(?:(?:Extended|Enhanced)\s+)?(?:Remix|RMX|Reworx)\)/i,
	/\s+\[([^\[\]]+?)\s+(?:(?:Extended|Enhanced)\s+)?(?:Remix|RMX|Reworx)\]/i,
	/\s+\((?:Remix|RMX)(?:ed)?\s+by\s+([^\(\)]+)\)/i,
	/\s+\[(?:Remix|RMX)(?:ed)?\s+by\s+([^\[\]]+)\]/i,
	/(?:\s+[\-\−\—\–]|:)\s+(.+?)\s+(?:Remix|RMX)$/i,
];
const arrParsers = [
	/\s+\(arr(?:anged\s+by|\.)\s+([^\(\)]+?)\s*\)/i,
	/\s+\[arr(?:anged\s+by|\.)\s+([^\[\]]+?)\s*\]/i,
];
const prodParsers = [
	/\s+\(prod(?:uced(?:\s+by)?|\.\s+by)\s+([^\(\)]+?)\s*\)/i,
	/\s+\[prod(?:uced(?:\s+by)?|\.\s+by)\s+([^\[\]]+?)\s*\]/i,
];
const otherArtistsParsers = [
	[/^(.*?)\s+(?:under|(?:conducted)\s+by)\s+(.*)$/, 4],
	[/^()(.*?)\s+\(conductor\)$/i, 4],
	//[/^()(.*?)\s+\(.*\)$/i, 1],
];
const pseudoArtistParsers = [
	/* 0 */ vaParser,
	/* 1 */ /^(?:#??N[\/\-]?A|[JS]r\.?|Unknown(?:\s+Artist)?)$/i,
	/* 2 */ /^(?:auditorium|[Oo]becenstvo|[Pp]ublikum)$/,
	/* 3 */ /^(?:(Special\s+)??Guests?|Friends|(?:Studio\s+)?Orchestra)$/i,
	/* 4 */ /^(?:Various\s+Composers)$/i,
	/* 5 */ /^(?:[Aa]nonym)/,
	/* 6 */ /^(?:traditional|trad\.|lidová)$/i,
	/* 7 */ /\b(?:traditional|trad\.|lidová)$/,
	/* 8 */ /^(?:tradiční|lidová)\s+/,
	/* 9 */ /^(?:[Ll]iturgical\b|[Ll]iturgick[áý])/,
];
const trimRemixers = str => [
	/^(?:f(?:eat(?:\.?|uring)|t\.|\.?\/))\s+-\s+/i,
	/(?:(?:\s+|^)(?:Original|Extended|Enhanced|Radio|Dance|Club|Session|Raw|Vocal|Dub|Soulful|\d{4}))+$/i,
].reduce((r, rx) => r.replace(rx, ''), str.trim().consolidateWhitespace());

function showDialog(text) {
	if (!text) return;
	prefs.set('preset', 1);
	prefs.set('custom_pattern', '^\\s*(.+?)(?:\\s*:+\\s*(.*?)|\\:)?\\s*$');
	prefs.set('custom_pattern_order', 1);
	setRadiosValue('parse-preset', prefs.preset);
	customCtrls[0].value = prefs.custom_pattern;
	setRadiosValue('parse-order', prefs.custom_pattern_order);
	sel = text;
	update_custom_ctrls();
	modal.classList.add("show-modal");
}

function add_from_selection() {
	sel = document.getSelection();
	if (!sel.isCollapsed && modal != null) showDialog(sel.toString().trim());
}

function doParse(expr, flags = '') {
	closeModal();
	if (!sel) return;
	let preset = getSelectedRadio('parse-preset');
	if (preset == null) return;
	prefs.preset = preset.value;
	let rx = preset.rx, order = preset.order, custom_parse_order = getSelectedRadio('parse-order');
	if (!rx && preset.value == 999 && custom_parse_order != null) {
		rx = new RegExp(customCtrls[0].value);
		order = custom_parse_order != null ? custom_parse_order.value == 1 ? [1, 2]
			: custom_parse_order.value == 2 ? [2, 1] : null : [1, 2];
	}
	groupArtists = artistClasses.map(category =>
		Array.from(document.querySelectorAll(`ul#artist_list > li.${category} > a`)).map(a => a.textContent.trim()));
	cleanupArtistsForm();
	for (let line of sel.split(/(?:\r?\n)+/)) {
		if (!(line = [
			/\s+\(tracks?\b[^\(\)]+\)/,
			/\s+\[tracks?\b[^\[\]]+\]/,
		].reduce((str, rx) => str.replace(rx, ''), line.trim())) || /^\s*(?:Recorded|Mastered)\b/i.test(line)) continue;
		let matches = /^\s*(?:Produced)[ \-\−\—\~\–]by (.+?)\s*$/.exec(line);
		if (matches != null) splitAmpersands(matches[1]).forEach(producer => { addArtist(producer, 7) });
		else if (rx instanceof RegExp && (matches = rx.exec(line)) != null) {
			if (!Array.isArray(order) || order.length < 2) { // Extract from tracklist
				let title = matches[2];
				if ((matches = featArtistParsers.slice(1).reduce((m, rx) => m || rx.exec(title), null)) != null) {
					splitAmpersands(matches[1]).forEach(guest => { addArtist(guest, 2) });
					title = featArtistParsers.slice(1).reduce((str, rx) => str.replace(rx, ''), title);
				}
				if ((matches = remixParsers.slice(4).reduce((m, rx) => m || rx.exec(title), null)) != null) {
					splitAmpersands(trimRemixers(matches[1])).forEach(remixer => { addArtist(remixer, 3) });
					title = remixParsers.slice(4).reduce((str, rx) => str.replace(rx, ''), title);
				}
				if ((matches = prodParsers.reduce((m, rx) => m || rx.exec(title), null)) != null) {
					splitAmpersands(matches[1]).forEach(producer => { addArtist(producer, 7) });
					title = prodParsers.reduce((str, rx) => str.replace(rx, ''), title);
				}
				// if ((matches = arrParsers.reduce((m, rx) => m || rx.exec(title), null)) != null) {
				// 	splitAmpersands(matches[1]).forEach(arranger => { addArtist(arranger, 8) });
				// 	title = arrParsers.reduce((str, rx) => str.replace(rx, ''), title);
				// }
				if ((matches = /^(.+?) [\-\−\—\–] /.exec(title)) != null && !/[\(\)\[\]\{\}]/.test(matches[1])) {
					const artist = matches[1].trim();
					if ((matches = featArtistParsers.slice(0, 2).reduce((m, rx) => m || rx.exec(artist), null)) != null) {
						splitAmpersands(artist.slice(0, matches.index)).forEach(artist => { addArtist(artist, 1) });
						splitAmpersands(matches[1]).forEach(artist => { addArtist(artist, 2) });
					} else splitAmpersands(artist).forEach(artist => { addArtist(artist, 1) });
				}
			} else if (matches[order[0]]) {
				let role = deduceArtist(matches[order[1]]);
				splitAmpersands(matches[order[0]]).forEach(artist => { addArtist(artist, role) });
			} else splitAmpersands(matches[order[1]]).forEach(artist => { addArtist(artist, 2) });
		}
	}
	prefs.custom_pattern = customCtrls[0].value;
	prefs.custom_pattern_order = custom_parse_order != null ? custom_parse_order.value : 1;
	for (let i in prefs) { if (typeof prefs[i] != 'function') GM_setValue(i, prefs[i]) }
	if (siteArtistsCache.length > 0) sessionStorage.siteArtistsCache = JSON.stringify(siteArtistsCache);
	if (notSiteArtistsCache.length > 0) sessionStorage.notSiteArtistsCache = JSON.stringify(notSiteArtistsCache);

	function deduceArtist(str) {
		if (/\b(?:remix)/i.test(str)) return 3; // remixer
		if (/\b(?:composer|libretto|lyric\w*|written[ \-\−\—\~\–]by)\b/i.test(str)) return 4; // composer
		if (/\b(?:conduct|director\b|direction\b)/i.test(str)) return 5; // conductor
		if (/\b(?:compiler\b)/i.test(str)) return 6; // compiler
		if (/\b(?:producer\b|produced[ \-\−\—\~\–]by\b)/i.test(str)) return 7; // producer
		return 2;
	}

	function addArtist(name, type = 1) {
		if (!name || !(type > 0) || pseudoArtistParsers.some(rx => rx.test(name))) return false;
		// avoid dupes
		if (groupArtists[type - 1].includesCaseless(name)) return false;
		switch (type) {
			case 1: if ([4, 5].some(cat => groupArtists[cat].includesCaseless(name))) return false; break;
			case 2: if ([0, 4, 5].some(cat => groupArtists[cat].includesCaseless(name))) return false; break;
		}
		let input = assignFreeArtistField();
		if (input == null) throw 'could not allocate free artist slot';
		input.value = name;
		const importance = input.nextElementSibling;
		importance.value = type;
		groupArtists[type - 1].push(name);
		if (ampersandParsers.some(rx => rx.test(name))) {
			let button = document.createElement('button');
			button.className = 'splitter';
			button.textContent = '↔';
			button.onclick = function(evt) {
				let artists = [input.value];
				ampersandParsers.forEach(function(rx) {
					for (let index = artists.length - 1; index >= 0; --index) {
						artists.splice(index, 1, ...artists[index].split(rx));
					}
				});
				if (artists.length > 1) {
					const artistUsed = artist => artist && parseInt(importance.value) > 0
						&& groupArtists[parseInt(importance.value) - 1].includesCaseless(artist);
					input.value = !artistUsed(artists[0]) ? artists[0] : '';
					artists.slice(1).forEach(function(artist) {
						if (artistUsed(artist)) return;
						let input = assignFreeArtistField();
						if (input == null) throw 'could not allocate free artist slot';
						input.value = artist;
						input.nextElementSibling.value = importance.value;
					});
				}
				evt.target.remove();
			};
			input.after(button);
		}
		return true;
	}
}

function closeModal() {
	if (modal == null) return;
	showHideAddbutton();
	modal.classList.remove("show-modal");
}

function windowOnClick(event) {
	if (modal != null && event.target === modal) closeModal();
}

function update_custom_ctrls() {
	function en(elem) {
		if (elem == null || btnCustom == null) return;
		elem.disabled = !btnCustom.checked;
		elem.style.opacity = btnCustom.checked ? 1 : 0.5;
	}
	customCtrls.forEach(k => { en(k) });
}

function getSelectedRadio(name) {
	for (let i of document.getElementsByName(name)) { if (i.checked) return i }
	return null;
}

function setRadiosValue(name, val) {
	for (let i of document.getElementsByName(name)) { if (i.value == val) i.checked = true }
}

function showHideAddbutton() {
	//btnAdd.style.visibility = document.getSelection().type == 'Range' ? 'visible' : 'hidden';
	btnAdd.style.visibility = document.getSelection().isCollapsed ? 'hidden' : 'visible';
}

function escapeHTML(string) {
	let pre = document.createElement('pre'), text = document.createTextNode(string);
	pre.appendChild(text);
	return pre.innerHTML;
}

function cleanupArtistsForm() {
	document.querySelectorAll('div#AddArtists > input[name="aliasname[]"]').forEach(function(input) {
		input.value = '';
		input.nextElementSibling.value = 1;
	});
	document.querySelectorAll('div#AddArtists > button.splitter').forEach(button => { button.remove() });
}

function assignFreeArtistField() {
	function findFreeSlot() {
		for (let input of document.querySelectorAll('div#AddArtists > input[name="aliasname[]"]'))
			if (input.value.length <= 0) return input;
		return null;
	}
	return findFreeSlot() || (AddArtistField(), findFreeSlot());
}

function addTooltip(elem, text) {
	if (elem == null) return;
	elem.classList.add('tooltip');
	var tt = document.createElement('span');
	tt.className = 'tooltiptext';
	tt.textContent = text;
	elem.appendChild(tt);
}

function twoOrMore(artist) { return artist.length >= 2 && !pseudoArtistParsers.some(rx => rx.test(artist)) };
function looksLikeTrueName(artist, index = 0) {
	return twoOrMore(artist)
		&& (index == 0 || !/^(?:his\b|her\b|Friends$|Strings$)/i.test(artist))
		&& artist.split(/\s+/).length >= 2
		&& !pseudoArtistParsers.some(rx => rx.test(artist)) || isSiteArtist(artist);
}

function strip(art, level = 0) {
	return typeof art == 'string' ? [
		/\s+(?:aka|AKA|Aka)\.?\s+(.*)$/g,
		/\s*\([^\(\)]+\)/g,
		/\s*\[[^\[\]]+\]/g,
		/\s*\{[^\{\}]+\}/g,
	].slice(level).reduce((acc, rx) => acc.replace(rx, ''), art) : undefined;
}

function isSiteArtist(artist) {
	if (!artist || notSiteArtistsCache.includesCaseless(artist)) return false;
	if (siteArtistsCache.includesCaseless(artist)) return true;
	let now = Date.now();
	try { var apiTimeFrame = JSON.parse(localStorage[siteApiTimeframeStorageKey]) } catch(e) { apiTimeFrame = { } }
	if (!apiTimeFrame.timeStamp || now > apiTimeFrame.timeStamp + gazelleApiFrame) {
		apiTimeFrame.timeStamp = now;
		apiTimeFrame.requestCounter = 1;
	} else ++apiTimeFrame.requestCounter;
	localStorage[siteApiTimeframeStorageKey] = JSON.stringify(apiTimeFrame);
	if (apiTimeFrame.requestCounter > 5) {
		if (groupArtists.some(art => art.includesCaseless(artist))) return true;
		console.debug('isSiteArtist() request exceeding AJAX API time frame: /ajax.php?action=artist&artistname="' +
			artist + '" (' + apiTimeFrame.requestCounter + ')');
		++ajaxRejects;
		btnAdd.disabled = true;
		setTimeout(() => { btnAdd.disabled = false }, apiTimeFrame.timeStamp + gazelleApiFrame - now);
		return undefined;
	}
	try {
		let requestUrl = '/ajax.php?action=artist&artistname=' + encodeURIComponent(artist);
		xhr.open('GET', requestUrl, false);
		if (document.location.hostname == 'redacted.sh' && redacted_api_key) xhr.setRequestHeader('Authorization', redacted_api_key);
		xhr.send();
		if (xhr.status == 404) {
			notSiteArtistsCache.push(artist);
			return false;
		}
		if (xhr.readyState != XMLHttpRequest.DONE || xhr.status < 200 || xhr.status >= 400) {
			console.warn('isSiteArtist("' + artist + '") error:', xhr, 'url:', document.location.origin + requestUrl);
			return undefined; // error
		}
		let response = JSON.parse(xhr.responseText);
		if (response.status != 'success') {
			notSiteArtistsCache.push(artist);
			return false;
		}
		if (!response.response) return false;
		siteArtistsCache.push(artist);
		return true;
	} catch(e) {
		console.error('isSiteArtist("' + artist + '"):', e, xhr);
		return undefined;
	}
}

function splitArtists(str, parsers = multiArtistParsers) {
	let result = [str];
	parsers.forEach(function(parser) {
		for (let i = result.length; i > 0; --i) {
			let j = result[i - 1].split(parser).map(strip);
			if (j.length > 1 && j.every(twoOrMore) && !j.some(artist => pseudoArtistParsers.some(rx => rx.test(artist)))
					&& !isSiteArtist(result[i - 1])) result.splice(i - 1, 1, ...j);
		}
	});
	return result;
}

function splitAmpersands(artists) {
	if (!artists) return [ ];
	if (typeof artists == 'string') var result = splitArtists(strip(artists, 1));
		else if (Array.isArray(artists)) result = Array.from(artists); else return [];
	ampersandParsers.forEach(function(ampersandParser) {
		for (let i = result.length; i > 0; --i) {
			let j = result[i - 1].split(ampersandParser).map(strip);
			if (j.length <= 1 || isSiteArtist(result[i - 1]) || !j.every(looksLikeTrueName)) continue;
			result.splice(i - 1, 1, ...j.filter(function(artist) {
				return !result.includesCaseless(artist) && !pseudoArtistParsers.some(rx => rx.test(artist));
			}));
		}
	});
	return result;
}
