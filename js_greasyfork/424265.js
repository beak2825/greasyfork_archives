// ==UserScript==
// @name         Mobilism: New releases unpaginated compact listing & filtering
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.04.1
// @description  Applies filtering and endless compact listing of previously unread articles in Releases section. Makes browsing through newly added releases since last visit much more quicker. Supports adding ignore rule for each listed release.
// @author       Anakunda
// @copyright    2021, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @iconURL      https://forum.mobilism.org/styles/shared/images/favicon.ico
// @match        https://forum.mobilism.org/portal.php?mode=articles&block=aapp*
// @match        https://forum.mobilism.me/portal.php?mode=articles&block=aapp*
// @iconurl      https://forum.mobilism.me/styles/shared/images/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.js
// @downloadURL https://update.greasyfork.org/scripts/424265/Mobilism%3A%20New%20releases%20unpaginated%20compact%20listing%20%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/424265/Mobilism%3A%20New%20releases%20unpaginated%20compact%20listing%20%20filtering.meta.js
// ==/UserScript==

{

'use strict';

const reserve = 300;
const contextId = 'context-9833836a-99db-4654-b9c3-d3dc195ba41c';
const contextUpdater = evt => { menu = evt.currentTarget };
let lastId = GM_getValue('latest_read'), androidVer = GM_getValue('android_version');
let categoryBlacklist = GM_getValue('category_blacklist', [ ]),
		appBlacklist = GM_getValue('app_blacklist', [ ]), appWhitelist = GM_getValue('app_whitelist', [ ]);
let filtered = false, menu = Object.assign(document.createElement('menu'), { type: 'context', id: contextId });
const articlesSelector = 'div#wrapcentre > table > tbody > tr > td > table.tablebg';
const releasesPath = '/portal.php?mode=articles&block=aapp';
menu.innerHTML = '<menuitem label="Ignore this category" /><menuitem label="-" />';
menu.children[0].onclick = function(evt) {
	let a = menu || evt.relatedTarget || document.activeElement;
	if (!(a instanceof HTMLAnchorElement)) return false;
	let category = a.textContent.trim();
	if (categoryBlacklist.find(cat => cat.toLowerCase() == category.toLowerCase()) != undefined) return false; // already ignored
	categoryBlacklist.push(category);
	GM_setValue('category_blacklist', categoryBlacklist);
	alert('Successfully added to ignored categories: ' + category);
};
document.body.append(menu);
let pageSize = document.body.querySelector('div#wrapcentre > table:nth-of-type(2) > tbody > tr:nth-of-type(1) > td[align="right"] > b > a:nth-of-type(2)');
if (pageSize != null) {
	let page = parseInt(pageSize.textContent);
	pageSize = new URLSearchParams(pageSize.search);
	pageSize = parseInt(pageSize.get('start')) / (page - 1);
}
if (!pageSize) pageSize = document.body.querySelectorAll('div#wrapcentre > table:first-of-type > tbody > tr > td:first-of-type > table').length;
console.assert(pageSize == 8);

function getArticleId(root) {
	const getArticleId = a => parseInt(new URLSearchParams(a.search).get('t'));
	let articleId = Array.from(root.querySelectorAll('tr > td.postbody > a'), getArticleId).filter(id => id > 0);
	if (articleId.length > 0) articleId = articleId[0];
	else if ((articleId = root.querySelector('th[align="left"] > a[articleId]')) != null)
		articleId = getArticleId(articleId);
	console.assert(articleId > 0, 'articleId > 0', articleId, root);
	if (articleId > 0) return articleId;
}

const getArticleIds = root => root instanceof HTMLElement ?
	Array.from(root.querySelectorAll(articlesSelector), getArticleId).filter(articleId => articleId > 0) : [ ];

function isIgnored(title) {
	function matchRule(expr) {
		const rx = /^\/(.+)\/([dgimsuy]*)$/.exec(expr);
		if (rx != null) try { return new RegExp(rx[1], rx[2]).test(title) } catch(e) { console.warn(e) }
		return expr.startsWith('\x15') ? title.includes(expr.slice(1)) : title.toLowerCase().includes(expr.toLowerCase());
	}
	return !appWhitelist.some(matchRule) && appBlacklist.some(matchRule);
}

function addFilter(title) {
	let modal = document.createElement('div');
	modal.style = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: #0008;' +
		'opacity: 0; transition: opacity 0.15s linear;';
	modal.innerHTML = `
<form id="add-rule-form" style="background-color: darkslategray; font-size-adjust: 0.75; position: absolute; top: 30%; right: 10%; border-radius: 0.5em; padding: 20px 30px;">
	<div style="color: white; margin-bottom: 3em; font-size-adjust: 1; font-weight: bold;">Add exclusion rule as</div>
	<label style="color: white; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">
		<input name="rule-type" type="radio" value="plaintext" checked="true" title="All releases containing expression in their names will be excluded from the listing" style="margin: 5px 5px 5px 0; cursor: pointer;" />
		Plain text
	</label>
	<label style="margin-left: 2em; color: white; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">
		<input name="rule-type" type="radio" value="regexp" title="Expression must be written in correct regexp syntax (without surrounding slashes). All releases positively tested by compiled regexp will be excluded from the listing" style="margin: 5px 5px 5px 0px; cursor: pointer;" />
		Regular expression
	</label>
	<br>
	<label style="color: white; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">
		Expression:
		<input name="expression" type="text" style="width: 35em; height: 1.6em; font-size-adjust: 0.75; margin-left: 5px; margin-top: 1em;" />
	</label>
	<br>
	<label style="color: white; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;">
		<input name="ignore-case" type="checkbox" style="margin: 1em 5px 0 0; cursor: pointer;" />
		Ignore case
	</label>
	<br>
	<input id="btn-cancel" type="button" value="Cancel" style="margin-top: 3em; float: right; padding: 5px 10px; font-size-adjust: 0.65; background-color: black; border: none; color: white;" />
	<input id="btn-add" type="button" value="Add to list" style="margin-top: 3em; float: right; padding: 5px 10px; font-size-adjust: 0.65; background-color: black; border: none; color: white; margin-right: 1em;" />
</form>
`;
	document.body.append(modal);
	let form = document.getElementById('add-rule-form'),
			radioPlain = form.querySelector('input[type="radio"][value="plaintext"]'),
			radioRegExp = form.querySelector('input[type="radio"][value="regexp"]'),
			expression = form.querySelector('input[type="text"][name="expression"]'),
			chkCaseless = form.querySelector('input[type="checkbox"][name="ignore-case"]'),
			btnAdd = form.querySelector('input#btn-add'),
			btnCancel = form.querySelector('input#btn-cancel'),
			exprTouched = false;
	if ([form, btnAdd, btnCancel, radioPlain, radioRegExp, expression, chkCaseless].some(elem => elem == null)) {
		console.warn('Dialog creation error');
		return;
	}
	expression.value = title;
	form.onclick = evt => { evt.stopPropagation() };
	expression.oninput = evt => { exprTouched = true };
	radioPlain.oninput = evt => { if (!exprTouched) expression.value = title };
	radioRegExp.oninput = evt => {
		if (!exprTouched) expression.value = '^(?:' + title.replace(/([\\\.\+\*\?\(\)\[\]\{\}\^\$\!])/g, '\\$1') + ')\\b';
	};
	btnAdd.onclick = function(evt) {
		let type = document.querySelector('form#add-rule-form input[name="rule-type"]:checked');
		if (type == null) {
			console.warn('Selected rule not found');
			return false;
		}
		let value = expression.value.trim();
		switch (type.value) {
			case 'plaintext':
				if (!value) return;
				if (!chkCaseless.checked) value = '\x15' + value;;
				if (appBlacklist.includes(value)) break;
				appBlacklist.push(value);
				GM_setValue('app_blacklist', appBlacklist);
				break;
			case 'regexp':
				try { new RegExp(value, 'i') } catch(e) {
					alert('RegExp syntax error: ' + e);
					return false;
				}
				if (!value) break;
				value = '/' + value + '/';
				if (chkCaseless.checked) value += 'i';
				if (appBlacklist.includes(value)) break;
				appBlacklist.push(value);
				GM_setValue('app_blacklist', appBlacklist);
				break;
			default:
				console.warn('Invalid rule type value:', type);
				return false;
		}
		modal.remove();
	};
	modal.onclick = btnCancel.onclick = evt => { modal.remove() };
	Promise.resolve(modal).then(elem => { elem.style.opacity = 1 });
}

function addIgnoreButton(tr, title) {
	if (!(tr instanceof HTMLTableRowElement)) return;
	let th = document.createElement('th');
	th.width = '2em';
	th.align = 'right';
	let a = document.createElement('a');
	a.textContent = '[X]';
	a.title = 'Not interested for this application?\n' +
		'Create ignore rule for it to not appear in cumulative listings from now on.';
	a.href = '#';
	a.onclick = function(evt) {
		addFilter(title ? [
			/\s+v(\d+(?:\.\d+)*)\b.*$/,
			/(?:\s+(\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))+\s*$/,
		].reduce((acc, rx) => acc.replace(rx, ''), title) : '');
		return false;
	};
	th.append(a);
	tr.append(th);
}

function listUnread(elem) {
	function ignoreCategory(evt) {
		let a = menu || evt.relatedTarget || document.activeElement;
		if (!(a instanceof HTMLAnchorElement)) return false;
		let category = a.textContent.trim();
		if (categoryBlacklist.find(cat => cat.toLowerCase() == category.toLowerCase()) != undefined) return false; // already ignored
		categoryBlacklist.push(category);
		GM_setValue('category_blacklist', categoryBlacklist);
		alert('Successfully added to ignored categories: ' + category);
	}

	if (!(lastId > 0)) return alert('You need to have previously marked all articles read to have checkpoint to stop scanning');
	let td = document.body.querySelector('div#wrapcentre > table > tbody > tr > td:first-of-type'), table;
	if (td != null) while (td.lastChild != null) td.removeChild(td.lastChild); else throw 'Invalid page structure';
	if (td.nextElementSibling != null) td.nextElementSibling.remove();
	while ((table = document.body.querySelector('div#wrapcentre > table[width="100%"]:nth-of-type(2)')) != null
		&& table.querySelector('p.breadcrumbs, p.datetime') == null) table.remove();
	if (elem instanceof HTMLElement) {
		elem.style.padding = '3px 9px';
		elem.style.color = 'white';
		elem.style.backgroundColor = 'darkorange';
		elem.textContent = 'Scanning...';
	}
	(function loadPage(page = 1) {
		const url = new URL(releasesPath, document.location.origin);
		if (page > 0) url.searchParams.set('start', (page - 1) * (pageSize || 8));
		if (elem instanceof HTMLElement) elem.textContent = 'Scanning...page ' + (page || 1);
		return localXHR(url).then(document => getArticleIds(document.body).some(id => id > lastId) ? loadPage(page + 1)
				.then(Array.prototype.concat.bind(Array.from(document.body.querySelectorAll(articlesSelector), function(table) {
			function cleanElement(elem) {
				if (elem instanceof Node) for (let child of elem.childNodes)
					if (child.nodeType == Node.TEXT_NODE && !child.textContent.trim()) elem.removeChild(child);
			}

			let a, articleId = getArticleId(table);
			if (!(articleId > 0) || articleId == lastId) return null; else if (articleId < lastId) {
				console.log('Old article bumped up:', articleId, '(', lastId, '), page', page || 1);
				return null;
			}
			let td = table.querySelector('tr > td.postbody:first-of-type'), minAndroid;
			if (td != null && /\b(?:Requirements?):\s*(?:A(?:ndroid)?\s*)?v?(\d+(?:\.\d+)?)\b\+?/i.test(td.textContent))
				minAndroid = parseFloat(RegExp.$1);
			for (var tr of table.querySelectorAll('tbody > tr:not(:first-of-type)')) tr.remove();
			let category, title;
			if ((a = table.querySelector('th[align="center"] > a')) != null) {
				category = a.textContent.trim();
				if (Array.isArray(categoryBlacklist) && categoryBlacklist.find(cat =>
						cat.toLowerCase() == category.toLowerCase()) != undefined) return null;
				a.oncontextmenu = contextUpdater;
				a.setAttribute('contextmenu', contextId);
			}
			tr = table.querySelector('tbody > tr:first-of-type');
			if ((th = table.querySelector('th[align="left"]')) != null) {
				if (isIgnored(title = th.textContent.trim())) return null;
				a = document.createElement('a');
				a.setAttribute('articleId', articleId);
				a.href = './viewtopic.php?t=' + articleId;
				a.target = '_blank';
				a.textContent = title;
				a.style = 'color: white !important; cursor: pointer;';
				while (th.firstChild != null) th.removeChild(th.firstChild);
				th.append(a);
			}
			if ((th = table.querySelector('th[align="center"] > a')) != null) th.style ='color: silver !important;';
			if ((th = table.querySelector('th[align="right"] > strong')) != null) {
				th.style = 'color: burlywood !important;';
				th.parentNode.style = 'color: silver !important;';
			}
			addIgnoreButton(tr, title);
			for (var th of table.querySelectorAll('tbody > tr > th')) {
				th.style.backgroundImage = 'none';
				th.style.backgroundColor = androidVer > 0 && minAndroid <= androidVer ? '#030'
					: androidVer > 0 && minAndroid > androidVer ? '#400' : 'darkslategray';
				cleanElement(th);
			}
			cleanElement(table);
			return table;
		}).filter(Boolean))) : [ ]);
	})().then(function(articles) {
		if (elem instanceof HTMLElement) {
			elem.style.backgroundColor = 'green';
			elem.textContent = articles.length > 0 ? `Showing ${articles.length} unread articles`
				: 'No new articles found';
		}
		for (let article of articles) td.append(article);
	}, function(reason) {
		if (elem instanceof HTMLElement) {
			elem.style.backgroundColor = 'darkorange';
			elem.textContent = 'Failed: ' + reason;
		}
		console.warn(reason);
	});
}

function markAllRead(elem = null) {
	function scanPage(document) {
		console.assert(document instanceof HTMLDocument);
		const articleIds = getArticleIds(document.body);
		if (articleIds.length <= 0) {
			alert('Assertion failed: no article ids found, please submit a bug report');
			throw 'Assertion failed: no article ids found';
		}
		GM_setValue('latest_read', Math.max(...articleIds) - reserve);
		if (elem instanceof HTMLElement) {
			elem.style.padding = '3px 9px';
			elem.style.color = 'white';
			elem.style.backgroundColor = 'green';
			elem.textContent = 'All releases marked as read, reloading page...';
		}
		window.document.location.assign(window.document.location.origin + releasesPath);
	}

	// (!onfirm('Are yuo sure to mark everything read?')) return;
	/*if (filtered) scanPage(document);
		else */localXHR(document.location.origin + releasesPath).then(scanPage);
}

//GM_registerMenuCommand('Show unread posts in compact view', listUnread, 'S');
//GM_registerMenuCommand('Mark everything read', markAllRead, 'r');
for (let elem of document.querySelectorAll('div#wrapcentre > table:first-of-type > tbody > tr > td:first-of-type > div > iframe'))
	elem.parentNode.parentNode.removeChild(elem.parentNode);
const td = document.body.querySelector('div#menubar > table > tbody > tr:first-of-type > td[class^="row"]');
if (td != null) {
	let [p, a] = [Object.assign(document.createElement('p'), {
		className: 'breadcrumbs', style: 'margin-right: 3em; float: right;',
	}), Object.assign(document.createElement('a'), {
		href: '#', id: 'mark-all-read', textContent: 'Mark all releases read', onclick: function(evt) {
		markAllRead(evt.currentTarget);
		return false;
	}})];
	p.append(a); td.append(p);
	if (lastId > 0) {
		[p, a] = [Object.assign(document.createElement('p'), {
			className: 'breadcrumbs', style: 'margin-right: 3em; float: right;',
		}), Object.assign(document.createElement('a'), {
			href: '#', id: 'list-unread', textContent: 'List only new releases', onclick: function(evt) {
			listUnread(evt.currentTarget);
			return false;
		}})];
		p.append(a); td.append(p);
	} else markAllRead();
}

for (let tr of document.querySelectorAll('div#wrapcentre > table > tbody > tr > td > table > tbody > tr[class^="row"]')) {
	const articleId = getArticleId(tr);
	console.assert(articleId > 0, 'articleId > 0', tr, articleId);
	if (!(articleId > 0)) continue; else if (articleId <= lastId) tr.style.backgroundColor = '#dcd5c1';
	let title = tr.parentNode.querySelector('th[align="left"]');
	if (title == null) continue; else if (isIgnored(title = title.textContent.trim())) {
		tr.parentNode.parentNode.style.opacity = 0.4;
		const th = Object.assign(document.createElement('th'), { width: '2em', align: 'right' });
		th.append(Object.assign(document.createElement('a'), {
			href: '#', textContent: '[+]',
			title: 'Not wanting to ignore this app furthermore, or ignored by mistake?',
			onclick: function(evt) {
				let removed = [ ];
				for (let index = 0; index < appBlacklist.length; ++index) {
					let rx = /^\/(.+)\/([dgimsuy]*)$/.exec(appBlacklist[index]);
					if (rx != null) try { if (!new RegExp(rx[1], rx[2]).test(title)) continue } catch(e) {
						console.warn(e);
						continue;
					} else if (appBlacklist[index].startsWith('\x15') ? !title.includes(appBlacklist[index].slice(1))
							: !title.toLowerCase().includes(appBlacklist[index].toLowerCase())) continue;
					Array.prototype.push.apply(removed, appBlacklist.splice(index, 1));
				}
				if (removed.length > 0) {
					GM_setValue('app_blacklist', appBlacklist);
					alert('Rules removed:\n\n' + removed.join('\n'));
					document.location.reload();
				}
				return false;
			},
		}));
		tr.previousElementSibling.append(th);
	} else addIgnoreButton(tr.previousElementSibling, title);
	const a = tr.parentNode.querySelector('th[align="center"] > a');
	if (a == null) continue;
	a.oncontextmenu = contextUpdater;
	a.setAttribute('contextmenu', contextId);
	let category = a.textContent.trim();
	if (Array.isArray(categoryBlacklist) && categoryBlacklist.find(cat =>
			cat.toLowerCase() == category.toLowerCase()) != undefined)
		tr.parentNode.parentNode.style.opacity = 0.4;
}

}
