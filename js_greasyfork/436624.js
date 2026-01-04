// ==UserScript==
// @name         [GMT] Ignored forums and threads
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.01.0
// @description  Hide threads not interested in from unread forum posts listing by one click
// @author       Anakunda
// @copyright    2021, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @match        https://*/forums.php
// @match        https://*/forums.php?action=unread
// @match        https://*/forums.php?action=unread&page=*
// @match        https://*/forums.php?page=*&action=unread
// @match        https://*/forums.php?action=viewforum&*
// @match        https://*/forums.php?page=*&action=viewforum&*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/436624/%5BGMT%5D%20Ignored%20forums%20and%20threads.user.js
// @updateURL https://update.greasyfork.org/scripts/436624/%5BGMT%5D%20Ignored%20forums%20and%20threads.meta.js
// ==/UserScript==

'use strict';

function hasStyleSheet(name) {
	if (name) name = name.toLowerCase(); else throw 'Invalid argument';
	const hrefRx = new RegExp('\\/' + name + '\\b', 'i');
	if (document.styleSheets) for (let styleSheet of document.styleSheets)
		if (styleSheet.title && styleSheet.title.toLowerCase() == name) return true;
			else if (styleSheet.href && hrefRx.test(styleSheet.href)) return true;
	return false;
}
const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light'].some(hasStyleSheet);
if (isLightTheme) console.log('Light Gazelle theme detected');
const isDarkTheme = ['kuro', 'minimal', 'red_dark'].some(hasStyleSheet);
if (isDarkTheme) console.log('Dark Gazelle theme detected');

try { var ignoredThreads = GM_getValue('ignored_threads', { }) } catch(e) { ignoredThreads = { } }
if (!Array.isArray(ignoredThreads[document.location.hostname])) ignoredThreads[document.location.hostname] = [ ];
try { var ignoredForums = GM_getValue('ignored_forums', { }) } catch(e) { ignoredForums = { } }
if (!Array.isArray(ignoredForums[document.location.hostname])) ignoredForums[document.location.hostname] = [ ];

console.info(ignoredThreads[document.location.hostname].length, 'ignored threads in total');
console.info(ignoredForums[document.location.hostname].length, 'ignored forums in total');
const ignOpacity = GM_getValue('ignored_opacity', 0.5);
const ignColor = 'grey';
const params = new URLSearchParams(document.location.search);
let action = params.get('action');
if (!action) {
	for (let tr of document.body.querySelectorAll('table.forum_index > tbody > tr:not(.colhead)')) {
		let forumId = tr.querySelector('td > h4 > a');
		if (forumId != null) forumId = new URLSearchParams(forumId.search); else continue; // assertion failed!
		if (!(forumId = parseInt(forumId.get('forumid')))) continue; // assertion failed!
		if (ignoredForums[document.location.hostname].includes(forumId)) tr.style.opacity = ignOpacity;
	}
	return;
} else action = action.toLowerCase();

function getThreadId(tr) {
	if (!(tr instanceof HTMLTableRowElement)) return undefined;
	let a = tr.children[1].getElementsByTagName('a');
	return a.length > 0 ? parseInt(new URLSearchParams(a[0].search).get('threadid')) : undefined;
}
function getForumId(tr) {
	if (!(tr instanceof HTMLTableRowElement)) return undefined;
	let a = tr.children[0].getElementsByTagName('a');
	return a.length > 0 ? parseInt(new URLSearchParams(a[0].search).get('forumid')) : undefined;
}

function threadClickHandler(evt) {
	const tr = evt.currentTarget.parentNode.parentNode, threadId = getThreadId(tr);
	if (!threadId) throw 'invalid page structure';
	const index = ignoredThreads[document.location.hostname].indexOf(threadId);
	if (index < 0) ignoredThreads[document.location.hostname].push(threadId);
		else ignoredThreads[document.location.hostname].splice(index, 1);
	GM_setValue('ignored_threads', ignoredThreads);
	evt.currentTarget.textContent = index < 0 ? '+' : 'X';
	evt.currentTarget.style.color = index < 0 ? 'green' : 'red';
	if (action == 'unread') tr.style.visibility = index < 0 ? 'collapse' : 'visible';
	tr.style.opacity = index < 0 ? ignOpacity : null;
	return false;
}

function forumClickHandler(evt) {
	const index = ignoredForums[document.location.hostname].indexOf(_forumId);
	if (index < 0) ignoredForums[document.location.hostname].push(_forumId);
		else ignoredForums[document.location.hostname].splice(index, 1);
	GM_setValue('ignored_forums', ignoredForums);
	evt.currentTarget.textContent = index < 0 ? '+' : 'X';
	evt.currentTarget.style.color = index < 0 ? 'green' : 'red';
	updateView();
	return false;
}

switch (action) {
	case 'unread':
		var selector = 'table#unread_posts_table';
		var hdrCallback = function(tr) {
			tr.children[0].width = '16%';
			tr.children[2].removeAttribute('width');
		};
		break;
	case 'viewforum': {
		selector = 'table.forum_index';
		hdrCallback = tr => { tr.children[3].style.width = '11%' };
		var _forumId = parseInt(new URLSearchParams(document.location.search).get('forumid'));
		const h2 = document.body.querySelector('div#content h2');
		if (h2 == null) break; // assertion failed
		const span = document.createElement('SPAN'), a = document.createElement('A');
		span.className = 'forum-ignore';
		span.style = 'float: right; margin-left: 1em;';
		a.href = '#';
		a.className = 'brackets';
		if (ignoredForums[document.location.hostname].includes(_forumId)) {
			a.textContent = '+';
			a.style.color = 'green';
		} else {
			a.textContent = 'X';
			a.style.color = 'red';
		}
		a.onclick = forumClickHandler;
		a.title = 'Ignore/unignore this subforum from unread forum threads view';
		span.append(a);
		h2.append(span);
		break;
	}
	default: throw 'invalid location';
}
selector += ' > tbody > tr';

function updateView() {
	for (let tr of document.body.querySelectorAll(selector)) {
		let td = tr.querySelector('td.thread-ignore');
		if (tr.classList.contains('colhead')) {
			if (td == null) {
				td = document.createElement('td');
				if (typeof hdrCallback == 'function') hdrCallback(tr);
				td.className = 'thread-ignore';
				td.textContent = 'Ignore';
				td.style.width = '6%';
				tr.append(td);
			}
			td.hidden = _forumId > 0 && ignoredForums[document.location.hostname].includes(_forumId);
			continue;
		}
		const forumId = _forumId || getForumId(tr), threadId = getThreadId(tr);
		let a = td && td.querySelector('a.ignore');
		if (a == null) {
			a = document.createElement('a');
			a.href = '#';
			a.className = 'brackets ignore';
			a.onclick = threadClickHandler;
			a.title = 'Ignore/unignore this thread from unread forum threads view';
		}
		if (forumId > 0 && ignoredForums[document.location.hostname].includes(forumId)
				|| threadId > 0 && ignoredThreads[document.location.hostname].includes(threadId)) {
			if (action == 'unread') tr.style.visibility = 'collapse';
			tr.style.opacity = ignOpacity;
			a.textContent = '+';
			a.style.color = 'green';
		} else {
			if (action == 'unread') tr.style.visibility = 'visible';
			tr.style.opacity = null;
			a.textContent = 'X';
			a.style.color = 'red';
		}
		if (td == null) {
			td = document.createElement('TD');
			td.className = 'thread-ignore';
			td.style.textAlign = 'center';
			td.append(a);
			tr.append(td);
		}
		td.hidden = ignoredForums[document.location.hostname].includes(forumId);
	}
}
updateView();

if (action != 'unread' || typeof GM_registerMenuCommand != 'function') return;
GM_registerMenuCommand('Temporarily show ignored threads', function() {
	document.body.querySelectorAll(selector)
		.forEach(tr => { if (tr.style.visibility == 'collapse') tr.style.visibility = 'visible' });
}, 'S');
