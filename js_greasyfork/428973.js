// ==UserScript==
// @name         [GMT] Tags Helper
// @version      1.02
// @author       Anakunda
// @copyright    2024, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @namespace    https://greasyfork.org/users/321857-anakunda
// @run-at       document-end
// @iconURL      https://i.ibb.co/ws8w9Jc/Tag-3-icon.png
// @match        https://*/artist.php?id=*
// @match        https://*/artist.php?*&id=*
// @match        https://*/requests.php
// @match        https://*/requests.php?submit=true&*
// @match        https://*/requests.php?type=*
// @match        https://*/requests.php?page=*
// @match        https://*/requests.php?action=new*
// @match        https://*/requests.php?action=view&id=*
// @match        https://*/requests.php?action=view&*&id=*
// @match        https://*/requests.php?action=edit&id=*
// @match        https://*/torrents.php?id=*
// @match        https://*/torrents.php
// @match        https://*/torrents.php?action=advanced
// @match        https://*/torrents.php?action=advanced&*
// @match        https://*/torrents.php?*&action=advanced
// @match        https://*/torrents.php?*&action=advanced&*
// @match        https://*/torrents.php?action=basic
// @match        https://*/torrents.php?action=basic&*
// @match        https://*/torrents.php?*&action=basic
// @match        https://*/torrents.php?*&action=basic&*
// @match        https://*/torrents.php?page=*
// @match        https://*/torrents.php?action=notify
// @match        https://*/torrents.php?action=notify&*
// @match        https://*/torrents.php?type=*
// @match        https://*/collages.php?id=*
// @match        https://*/collages.php?page=*&id=*
// @match        https://*/collages.php?action=new
// @match        https://*/collages.php?action=edit&collageid=*
// @match        https://*/collage.php?id=*
// @match        https://*/collage.php?page=*&id=*
// @match        https://*/collage.php?action=new
// @match        https://*/collage.php?action=edit&collageid=*
// @match        https://*/bookmarks.php?type=*
// @match        https://*/bookmarks.php?page=*
// @match        https://*/upload.php
// @match        https://*/upload.php?url=*
// @match        https://*/upload.php?tags=*
// @match        https://*/bookmarks.php?type=torrents
// @match        https://*/bookmarks.php?page=*&type=torrents
// @match        https://*/top10.php
// @match        https://*/top10.php?*
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/QobuzLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/GazelleTagManager.min.js
// @description Improvements for working with groups of tags + increased efficiency of new requests creation
// @downloadURL https://update.greasyfork.org/scripts/428973/%5BGMT%5D%20Tags%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/428973/%5BGMT%5D%20Tags%20Helper.meta.js
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
const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light', '2iUn3'].some(hasStyleSheet);
if (isLightTheme) console.log('Light Gazelle theme detected');
const isDarkTheme = ['kuro', 'minimal', 'red_dark', 'Vinyl'].some(hasStyleSheet);
if (isDarkTheme) console.log('Dark Gazelle theme detected');

const uriTest = /^(https?:\/\/.+)$/i;
const isFirefox = /\b(?:Firefox)\b/.test(navigator.userAgent) || Boolean(window.InstallTrigger);
const fieldNames = ['tags', 'tagname', 'taglist'];
const exclusions = GM_getValue('exclusions', [
	'/^(?:\\d{4}s)$/i',
	'/^(?:delete\.this\.tag|staff\.recs|freely\.available)$/i',
]).map(function(expr) {
	const m = /^\/(.+)\/([dgimsuy]*)$/i.exec(expr);
	if (m != null) try { return new RegExp(m[1], m[2]) } catch(e) { console.warn(e) }
}).filter(it => it instanceof RegExp);
const stdPasteBehaviour = GM_getValue('std_paste_behavior', true);

const getTagsFromIterable = iterable => Array.prototype.filter.call(iterable, elem =>
		elem.offsetWidth > 0 && elem.offsetHeight > 0 && elem.pathname && elem.search
		&& (elem = URLSearchParams.prototype.has.bind(new URLSearchParams(elem.search)),
			fieldNames.some(fieldName => elem(fieldName))))
	.map(elem => elem.textContent.trim().toLowerCase())
	.filter(tag => /^([a-z\d\.]+)$/.test(tag) && !exclusions.some(rx => rx.test(tag)));

const contextId = 'cae67c72-9aa7-4b96-855e-73cb23f5c7f8';
let menuHooks = 0, menuInvoker;

function createMenu() {
	const menu = document.createElement('menu');
	menu.type = 'context';
	menu.id = contextId;
	menu.className = 'tags-helper';

	function addMenuItem(label, callback) {
		if (label) {
			let menuItem = document.createElement('MENUITEM');
			menuItem.label = label;
			if (typeof callback == 'function') menuItem.onclick = callback;
			menu.append(menuItem);
		}
		return menu.children.length;
	}

	addMenuItem('Copy tags to clipboard', function(evt) {
		console.assert(menuInvoker instanceof HTMLElement, 'menuInvoker instanceof HTMLElement')
		if (!(menuInvoker instanceof HTMLElement)) throw 'Invalid invoker';
		const tags = getTagsFromIterable(menuInvoker.getElementsByTagName('A'));
		if (tags.length > 0) GM_setClipboard(tags.join(', '), 'text');
	});
	addMenuItem('Make new request using these tags', function(evt) {
		console.assert(menuInvoker instanceof HTMLElement, 'menuInvoker instanceof HTMLElement')
		if (!(menuInvoker instanceof HTMLElement)) throw 'Invalid invoker';
		const tags = getTagsFromIterable(menuInvoker.getElementsByTagName('A'));
		if (tags.length > 0) document.location.assign('/requests.php?' + new URLSearchParams({
			action: 'new',
			tags: JSON.stringify(tags),
		}).toString());
	});
	addMenuItem('Make new upload using these tags', function(evt) {
		console.assert(menuInvoker instanceof HTMLElement, 'menuInvoker instanceof HTMLElement')
		if (!(menuInvoker instanceof HTMLElement)) throw 'Invalid invoker';
		const tags = getTagsFromIterable(menuInvoker.getElementsByTagName('A'));
		if (tags.length > 0) document.location.assign('/upload.php?' + new URLSearchParams({
			tags: JSON.stringify(tags),
		}).toString());
	});
	document.body.append(menu);
}

const siteTagsCache = 'siteTagsCache' in localStorage ? (function(serialized) {
	try { return JSON.parse(serialized) } catch(e) { return { } }
})(localStorage.getItem('siteTagsCache')) : { };
function getVerifiedTags(tags, confidencyThreshold = GM_getValue('tags_confidency_threshold', 1)) {
	if (!Array.isArray(tags)) throw 'Invalid argument';
	return Promise.all(tags.map(function(tag) {
		if (!(confidencyThreshold > 0) || tmWhitelist.includes(tag) || siteTagsCache[tag] >= confidencyThreshold)
			return Promise.resolve(tag);
		return queryAjaxAPICached('browse', { taglist: tag }).then(function(response) {
			const usage = response.pages > 1 ? (response.pages - 1) * 50 + 1 : response.results.length;
			if (usage < confidencyThreshold) return false;
			siteTagsCache[tag] = usage;
			Promise.resolve(siteTagsCache).then(cache => { localStorage.setItem('siteTagsCache', JSON.stringify(cache)) });
			return tag;
		}, reason => false);
	})).then(results => results.filter(Boolean));
}

function setElemHandlers(elem, textCallback) {
	console.assert(elem instanceof HTMLElement);
	elem.addEventListener('click', function(evt) {
		if (evt.altKey) evt.preventDefault(); else return;
		const tags = getTagsFromIterable(evt.currentTarget.getElementsByTagName('A'));
		if (tags.length > 0) if (evt.ctrlKey) document.location.assign('/requests.php?' + new URLSearchParams({
			action: 'new',
			tags: JSON.stringify(tags)
		}).toString()); else if (evt.shiftKey) document.location.assign('/upload.php?' + new URLSearchParams({
			tags: JSON.stringify(tags)
		}).toString()); else {
			GM_setClipboard(tags.join(', '), 'text');
			evt.currentTarget.style.backgroundColor = isDarkTheme ? 'darkgreen' : 'lightgreen';
			setTimeout(elem => { elem.style.backgroundColor = null }, 1000, evt.currentTarget);
		}
		return false;
	});
	elem.draggable = true;
	elem.ondragstart = function(evt) {
		//evt.dataTransfer.clearData('text/uri-list');
		//evt.dataTransfer.clearData('text/x-moz-url');
		evt.dataTransfer.setData('text/plain',
			getTagsFromIterable(evt.currentTarget.getElementsByTagName('A')).join(', '));
		// console.debug(evt.currentTarget, evt.currentTarget.getElementsByTagName('A'),
		// 	getTagsFromIterable(evt.currentTarget.getElementsByTagName('A')));
	};
	elem.ondragenter = elem[`ondrag${'ondragexit' in elem ? 'exit' : 'leave'}`] = function(evt) {
		for (let tgt = evt.relatedTarget; tgt instanceof HTMLElement; tgt = tgt.parentNode)
			if (tgt == evt.currentTarget) return false;
		evt.currentTarget.style.backgroundColor = evt.type == 'dragenter' ? 'greenyellow' : null;
	};
	elem.ondragover = evt => false;
	elem.ondrop = function(evt) {
		evt.stopPropagation();
		let links = evt.dataTransfer.getData('text/uri-list');
		if (links) links = links.split(/\r?\n/); else {
			links = evt.dataTransfer.getData('text/x-moz-url');
			if (links) links = links.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
				else if (links = evt.dataTransfer.getData('text/plain'))
					links = links.split(/\r?\n/).filter(RegExp.prototype.test.bind(uriTest));
		}
		if (Array.isArray(links) && links.length > 0) {
			const tags = getTagsFromIterable(evt.currentTarget.getElementsByTagName('A'));
			if (tags.length > 0) if (evt.shiftKey) document.location.assign('/upload.php?' + new URLSearchParams({
				//category: 0,
				url: links[0],
				tags: JSON.stringify(tags),
			}).toString()); else document.location.assign('/requests.php?' + new URLSearchParams({
				action: 'new',
				//category: 0,
				url: links[0],
				tags: JSON.stringify(tags),
			}).toString());
		} else if (typeof textCallback == 'function' && (links = evt.dataTransfer.getData('text/plain'))
				//&& (links = links.split(/[\r\n\,\;\|\>]+/).map(expr => expr.trim()).filter(Boolean)).length > 0
				&& (links = new TagManager(links)).length > 0) textCallback(evt, links);
		evt.currentTarget.style.backgroundColor = null;
		return false;
	};
	elem.setAttribute('contextmenu', contextId);
	elem.oncontextmenu = evt => { menuInvoker = evt.currentTarget };
	elem.style.cursor = 'context-menu';
	++menuHooks;
	elem.title = `Alt + click => copy tags to clipboard
Ctrl + Alt + click => make new request using these tags
Shift + Alt + click => make new upload using these tags
---
Drag & drop active link here => make new request using these tags
Shift + Drag & drop active link here => make new upload using these tags
Drag this tags area and drop to any text input to get inserted all tags as comma-separated list
--or-- use context menu (older browsers only)`;
}

function addFormNormalizer(form) {
	function submitListener(evt) {
		for (let input of evt.currentTarget.getElementsByTagName('INPUT')) {
			if (!['text', 'search'].includes(input.type) || !fieldNames.includes(input.name)) continue;
			const tags = new TagManager(input.value);
			input.value = tags.toString();
		}
	}
	if (form instanceof HTMLFormElement) form.addEventListener('submit', submitListener);
}

switch (document.location.pathname) {
	case '/torrents.php': {
		const urlParams = new URLSearchParams(document.location.search);
		if (urlParams.has('id')) try {
			let tags = urlParams.get('tags');
			if (tags && (tags = JSON.parse(tags)).length > 0) {
				const input = document.getElementById('tagname');
				if (input == null) throw 'Tags input not found';
				tags = new TagManager(...tags);
				input.value = tags.toString();
				input.scrollIntoView({ behavior: 'smooth', block: 'start' });
				//if (input.nextElementSibling != null) input.nextElementSibling.click();
			}
		} catch(e) { console.warn(e) }
		break;
	}
	case '/requests.php': case '/upload.php': {
		const urlParams = new URLSearchParams(document.location.search);
		if (urlParams.has('tags')) try {
			let tags = urlParams.get('tags');
			if (tags && (tags = JSON.parse(tags)).length > 0) {
				const input = document.getElementById('tags');
				if (input == null) throw 'Tags input not found';
				input.value = new TagManager(...tags).toString();
			}
		} catch(e) { console.warn(e) }
		break;
	}
}

document.body.querySelectorAll('div.tags').forEach(div => { setElemHandlers(div, function(evt, tags) {
	const a = evt.currentTarget.parentNode.querySelector('a:last-of-type');
	if (a == null) return false;
	if (evt.ctrlKey && ajaxApiKey) {
		const tagsElement = evt.currentTarget, groupId = parseInt(new URLSearchParams(a.search).get('id')) || undefined;
		if (groupId > 0) queryAjaxAPI('addtag', { groupid: groupId }, { tagname: tags.toString() }).then(function(response) {
			console.log(response);
			if (!['added', 'voted'].some(key => response[key].length > 0)) return;
			queryAjaxAPI('torrentgroup', { id: groupId }).then(function(response) {
				if (!response.group.tags) return document.location.reload();
				const urlParams = new URLSearchParams(tagsElement.childElementCount > 0 ? tagsElement.children[0].search : {
					action: 'advanced',
					searchsubmit: 1,
				});
				while (tagsElement.childNodes.length > 0) tagsElement.removeChild(tagsElement.childNodes[0]);
				for (let tag of response.group.tags) {
					if (tagsElement.childElementCount > 0) tagsElement.append(', ');
					const a = document.createElement('A');
					for (let param of fieldNames) if (urlParams.has(param)) urlParams.set(param, a.textContent = tag);
					a.setAttribute('href', 'torrents.php?' + urlParams.toString());
					tagsElement.append(a);
				}
			});
		});
	} else {
		const url = new URL(a);
		url.searchParams.set('tags', JSON.stringify(tags));
		document.location.assign(url);
	}
}) });

// document.body.querySelectorAll('div.group_info div.tags').forEach(function(div) {
// 	const a = div.parentNode.querySelector('a:last-of-type');
// 	if (a == null || !a.pathname.startsWith('/torrents.php')) return;
// 	const groupId = parseInt(new URLSearchParams(a.search).get('id'));
// 	if (!(groupId > 0)) return;
// 	const deleteThisTag = Array.prototype.find.call(div.getElementsByTagName('A'),
// 		a => /\btag\w*=/.test(a.search) && a.textContent.trim() == 'delete.this.tag');
// 	if (!deleteThisTag) return;
// 	let userAuth = document.body.querySelector('input[name="auth"]');
// 	if (userAuth != null) userAuth = userAuth.value; else return;
// 	const searchParams = { action: 'delete_tag', groupid: groupId, tagid: tagId, auth: userAuth };
// 	localXHR('/torrents.php?' + searchParams.toString(), { responseType: null }).then(function(status) {
// 		if (a.previousSibling != null && a.previousSibling.nodeType == 3) a.previousSibling.remove();
// 		else if (a.nextSibling != null && a.nextSibling.nodeType == 3) a.nextSibling.remove();
// 		a.remove();
// 	});
// });

(function() {
	const tagsBox = document.body.querySelector('div.sidebar > div.box.box_tags');
	const groupId = document.location.pathname == '/torrents.php'
		&& parseInt(new URLSearchParams(document.location.search).get('id')) || undefined;

	function tagBoxHandlers(evt, tags) {
		function fallBack() {
			const input = document.getElementById('tagname');
			if (input == null) throw 'Tags input not found';
			input.value = tags.toString();
			input.scrollIntoView({ behavior: 'smooth', block: 'start' });
			//if (input.nextElementSibling != null) input.nextElementSibling.click();
		}

		if (!groupId) return fallBack();
		if (ajaxApiKey) {
			const tagsElement = evt.currentTarget.querySelector('ul') || evt.currentTarget.querySelector('ol');
			if (tagsElement != null) queryAjaxAPI('addtag', { groupid: groupId }, { tagname: tags.toString() }).then(function(response) {
				console.log(response);
				if (['added', 'voted'].some(key => response[key].length > 0)) document.location.reload();
				// queryAjaxAPI('torrentgroup', { id: groupId }).then(function(response) {
				// 	if (!response.group.tags) {
				// 		document.location.reload();
				// 		return;
				// 	}
				// 	let a = tagsElement.querySelector('li > a');
				// 	const urlParams = new URLSearchParams(a != null ? a.search : undefined);
				// 	while (tagsElement.childNodes.length > 0) tagsElement.removeChild(tagsElement.childNodes[0]);
				// 	for (let tag of response.group.tags) {
				// 		urlParams.set('taglist', (a = document.createElement('A')).textContent = tag);
				// 		a.setAttribute('href', 'torrents.php?' + encodeURIComponent(urlParams.toString()));
				// 		const li = document.createElement('LI');
				// 		li.append(a);
				// 		tagsElement.append(li);
				// 	}
				// });
			}); else fallBack();
		} else fallBack();
	}

	if (tagsBox != null) setElemHandlers(tagsBox, tagBoxHandlers); else return;
	tagsBox.querySelectorAll('ul > li').forEach(function(li) {
		let name = li.querySelector(':scope > a');
		console.assert(name != null);
		if (name == null || !['delete.this.tag'].includes(name.textContent.trim())) return;
		let a = li.querySelector('div.edit_tags_votes > span.remove_tag > a');
		if (a != null) localXHR(a.href, { responseType: null }).then(status => { li.remove() }, alert);
	});
	for (let a of tagsBox.querySelectorAll('* > li > div > span > a')) {
		if (new URLSearchParams(a.search).get('action') != 'delete_tag') continue;
		a.onclick = function(evt) {
			const currentTarget = evt.currentTarget;
			localXHR(evt.currentTarget.href, { responseType: null }).then(function() {
				currentTarget.parentNode.parentNode.parentNode.remove();
			}, alert);
			return false;
		};
	}
	const head = tagsBox.querySelector('div.head');
	if (head == null) return;
	let elem = head.querySelector(':scope > a');
	if (elem != null && /\bUndo\s+delete\b/.test(elem.textContent)) {
		elem.innerHTML = `
<svg height="12" style="margin: 0 2pt;" viewBox="0 0 6692.62 5899.57" version="1.1">
	<path fill="white" d="M-0 2090.06c0,161.28 126.54,217.81 291.29,343.63l2122.05 1661.01c73.96,62.42 116.77,111.76 205.7,111.76 269.94,0 211.67,-289.5 211.64,-555.55 -0.03,-264.55 0,-529.11 0,-793.65 160.81,77.16 566.87,10.68 778.44,41.66 675.17,98.88 1235.27,82.37 1915.23,545.08 861.65,586.36 851.3,1512.46 851.3,2455.58 3.67,-5.28 8.55,-20.36 9.85,-16.6l32.48 -73.34c92.37,-277.16 215.56,-928.3 244.97,-1210.06l29.68 -523.1c-72.71,-893.81 -295.08,-1650.7 -1082.38,-2120.49 -111.5,-66.53 -207.71,-133.01 -341.8,-187.3 -126.48,-51.22 -250.18,-113.62 -397.19,-158.37 -647.12,-196.99 -1240.26,-261 -2040.58,-261l0 -1137.56c0,-223.86 -176.45,-211.64 -264.55,-211.64 -59.48,0 -2212.27,1713.69 -2457.87,1907.2 -62.77,49.45 -108.26,71.61 -108.26,182.74z" />
</svg>
`;
		elem.title = 'Undo delete';
		//if (isDarkTheme) elem.children[0].children[0].setAttribute('fill', 'black');
	}
	let [span, a] = ['SPAN', 'A'].map(Document.prototype.createElement.bind(document));
	if (groupId > 0) {
		span.className = 'head-button';
		span.style = 'float: right; margin-left: 6pt;';
		span.title = 'Edit all tags in one batch';
		a.className = 'brackets';
		a.textContent = 'Edit';
		a.href = '#';
		a.onclick = function(evt) {
			tagsBox.draggable = false;
			tagsBox.ondrop = tagsBox.onpaste = null;
			tagsBox.removeAttribute('title');
			for (elem of head.getElementsByClassName('head-button')) elem.hidden = true;
			if ((elem = tagsBox.querySelector(':scope > ul')) != null) elem.hidden = true;
			const form = document.createElement('FORM');
			var elem = document.createElement('TEXTAREA');
			elem.className = 'noWhutBB';
			elem.id = 'tags-edit';
			elem.style = 'width: 90%; height: 15em; margin: 6pt; font: 10pt monospace; resize: vertical;';
			if (isLightTheme) {
				elem.style.color = 'black';
				elem.style.backgroundColor = 'cornsilk';
			}
			const tags = Array.from(tagsBox.querySelectorAll(':scope > ul > li'), function(li) {
				const tagInfo = {
					name: li.querySelector(':scope > a'),
					id: li.querySelector(':scope > div > span > a'),
				}
				if (tagInfo.name == null || tagInfo.id == null) return;
				tagInfo.id = new URLSearchParams(tagInfo.id.search);
				if (tagInfo.id.get('action') != 'delete_tag' || !(tagInfo.id = parseInt(tagInfo.id.get('tagid')))) return;
				tagInfo.name = tagInfo.name.textContent.trim();
				return tagInfo;
			}).filter(Boolean);
			if (tags.length > 0) elem.value = tags.map(tag => tag.name).join('\n') + '\n';
			elem.spellcheck = false;
			elem.ondrop = elem.onpaste = function(evt) {
				switch (evt.type) {
					case 'paste': var data = evt.clipboardData; break;
					case 'drop': data = evt.dataTransfer; break;
				}
				const multilineParser = text => text.split(/(?:\r?\n)+/)
					.map(line => line.trim()).filter(Boolean);
				if (!(data = multilineParser(data.getData('text/plain')))) return;
				switch (evt.type) {
					case 'paste':
						if (stdPasteBehaviour) {
							tags = new TagManager(...data);
							tags = tags.join('\n');
							const cursor = evt.currentTarget.selectionStart + tags.length;
							evt.currentTarget.value = evt.currentTarget.value.slice(0, evt.currentTarget.selectionStart) +
								tags + evt.currentTarget.value.slice(evt.currentTarget.selectionEnd);
							evt.currentTarget.selectionEnd = evt.currentTarget.selectionStart = cursor;
							break;
						}
					case 'drop':
						var tags = new TagManager(...multilineParser(evt.currentTarget.value.slice(0, evt.currentTarget.selectionStart) +
							evt.currentTarget.value.slice(evt.currentTarget.selectionEnd)));
						tags.add(...data);
						evt.currentTarget.value = tags.length > 0 ? tags.join('\n') + '\n' : '';
						tagsBox.style.backgroundColor = null;
						break;
				}
				return false;
			};
			elem.onkeypress = evt => !evt.ctrlKey || evt.key != 'Enter' || (evt.currentTarget.parentNode.onsubmit(), false);
			elem.title = 'One tag per line or comma-separated list of tags; paste/drag and drop list of genres from anywhere; all input converted to Gazelle format';
			form.append(elem);
			elem = document.createElement('INPUT');
			elem.type = 'submit';
			elem.style = 'margin: 0 6pt 6pt 6pt;';
			elem.value = 'Update';
			form.append(elem);
			elem = document.createElement('INPUT');
			elem.type = 'button';
			elem.style = 'margin: 0 0 6pt;';
			elem.value = 'Cancel';
			elem.onclick = function(evt) {
				evt.currentTarget.form.remove();
				if ((elem = tagsBox.querySelector(':scope > ul')) != null) elem.hidden = false;
				for (elem of head.getElementsByClassName('head-button')) elem.hidden = false;
				setElemHandlers(tagsBox, tagBoxHandlers);
				return false;
			};
			form.append(elem);
			form.onsubmit = function(evt) {
				let userAuth = document.body.querySelector('input[name="auth"]');
				if (userAuth != null) userAuth = userAuth.value;
					else throw 'Assertion failed: User auth could not be located';
				let newTags = document.getElementById('tags-edit');
				if (newTags != null) newTags = new TagManager(...newTags.value.split(/(?:\r?\n)+/));
				const workers = [ ], addTags = Array.from(newTags).filter(tag => !tags.some(_tag => _tag.name == tag)),
							deleteTags = tags.filter(tag => !newTags.includes(tag.name)).map(tag => tag.id);
				if (addTags.length > 0) Array.prototype.push.apply(workers, addTags.map(tag => localXHR('/torrents.php', { responseType: null }, new URLSearchParams({
					action: 'add_tag',
					groupid: groupId,
					tagname: tag,
					auth: userAuth,
				}))));
				if (deleteTags.length > 0) Array.prototype.push.apply(workers, deleteTags.map(tagId => localXHR('/torrents.php?' + new URLSearchParams({
					action: 'delete_tag',
					groupid: groupId,
					tagid: tagId,
					auth: userAuth,
				}), { responseType: null })));
				if (workers.length > 0) Promise.all(workers).then(() => { document.location.reload() });
				return false;
			};
			tagsBox.append(form);
			return false;
		};
		span.append(a); head.append(span);

		[span, a] = ['SPAN', 'A'].map(Document.prototype.createElement.bind(document));
		span.style = 'float: right; margin-left: 6pt;';
		span.title = 'Keep only tags used on site, the rest will be removed';
		span.className = 'head-button';
		a.className = 'brackets';
		a.textContent = 'Clean';
		a.href = '#';
		a.onclick = function(evt) {
			let userAuth = document.body.querySelector('input[name="auth"]');
			if (userAuth != null) userAuth = userAuth.value;
				else throw 'Assertion failed: User auth could not be located';
			evt.currentTarget.style.color = 'orange';
			const currentTarget = evt.currentTarget;
			const releaseTags = Array.from(document.body.querySelectorAll('div.box_tags ul > li'), function(li) {
				const tag = { elem: li, name: li.querySelector(':scope > a'), id: li.querySelector('span.remove_tag > a') };
				if (tag.name != null) tag.name = tag.name.textContent.trim();
				if (tag.id != null) tag.id = parseInt(new URLSearchParams(tag.id.search).get('tagid'));
				return tag.name && tag.id ? tag : null;
			}).filter(Boolean);
			if (releaseTags.length > 0) getVerifiedTags(releaseTags.map(tag => tag.name), 3).then(function(verifiedTags) {
				const deleteTags = releaseTags.filter(tag => !verifiedTags.includes(tag.name));
				Promise.all(deleteTags.map(tag => localXHR('/torrents.php?' + new URLSearchParams({
					action: 'delete_tag',
					groupid: groupId,
					tagid: tag.id,
					auth: userAuth,
				}), { responseType: null }).then(status => { tag.elem.remove() }))).then(function() {
					currentTarget.style.color = isDarkTheme ? 'darkgreen' : 'lightgreen';
					setTimeout(elem => {elem.style.color = null }, 1000, currentTarget);
				}, function(reason) {
					currentTarget.style.color = 'red';
					setTimeout(elem => {elem.style.color = null }, 1000, currentTarget);
				});
			});
			return false;
		}
		span.append(a); head.append(span);
		[span, a] = ['SPAN', 'A'].map(Document.prototype.createElement.bind(document));
	}
	span.style = 'float: right;';
	span.className = 'head-button';
	a.className = 'brackets';
	a.textContent = 'Copy';
	a.href = '#';
	a.onclick = function(evt) {
		let tags = getTagsFromIterable(tagsBox.querySelectorAll('ul > li > a'));
		if (tags.length <= 0) return false;
		GM_setClipboard(tags.join(', '), 'text');
		evt.currentTarget.style.color = isDarkTheme ? 'darkgreen' : 'lightgreen';
		setTimeout(elem => {elem.style.color = null }, 1000, evt.currentTarget);
		return false;
	};
	span.append(a); head.append(span);
})();

if (menuHooks > 0) createMenu();

function inputDataHandler(evt) {
	switch (evt.type) {
		case 'paste': var tags = evt.clipboardData; break;
		case 'drop': tags = evt.dataTransfer; break;
	}
	if (tags) tags = tags.getData('text/plain'); else return;
	//if (tags) tags = tags.split(/[\r\n\;\|\>]+|,(?:\s*&)?/).map(expr => expr.trim()).filter(Boolean); else return;
	if (tags.length > 0) switch (evt.type) {
		case 'paste': tags = new TagManager(tags); break;
		case 'drop': tags = new TagManager(evt.currentTarget.value, tags); break;
	} else return;
	if (tags.length > 0) tags = tags.toString(); else return;
	evt.stopPropagation();
	switch (evt.type) {
		case 'paste': {
			const cursor = evt.currentTarget.selectionStart + tags.toString().length;
			evt.currentTarget.value = evt.currentTarget.value.slice(0, evt.currentTarget.selectionStart) +
				tags.toString() + evt.currentTarget.value.slice(evt.currentTarget.selectionEnd);
			evt.currentTarget.selectionEnd = evt.currentTarget.selectionStart = cursor;
			break;
		}
		case 'drop': evt.currentTarget.value = tags; break;
	}
	return false;
}

for (let input of document.body.querySelectorAll(fieldNames.map(name => `input[name="${name}"]`).join(', ')))
	input.onpaste = input.ondrop = inputDataHandler;
for (let selector of [
	'div#content form.add_form[name="tags"]',
	// 'div#content form.search_form',
]) addFormNormalizer(document.body.querySelector(selector));
