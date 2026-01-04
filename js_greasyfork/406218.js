// ==UserScript==
// @name         [GMT] Collage Extensions
// @version      1.25.0
// @description  Direct browsing from torrent pages; quick groups removal, custom quick Add To Collage form
// @author       Anakunda
// @license      GPL-3.0-or-later
// @copyright    2020, Anakunda (https://openuserjs.org/users/Anakunda)
// @namespace    https://greasyfork.org/users/321857-anakunda
// @match        https://*/collages.php?id=*
// @match        https://*/collages.php?page=*&id=*
// @match        https://*/collage.php?id=*
// @match        https://*/collage.php?page=*&id=*
// @match        https://*/artist.php?*id=*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libCtxtMenu.min.js
// @downloadURL https://update.greasyfork.org/scripts/406218/%5BGMT%5D%20Collage%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/406218/%5BGMT%5D%20Collage%20Extensions.meta.js
// ==/UserScript==

'use strict';

let userAuth = document.body.querySelector('input[name="auth"][value]');
if (userAuth != null) userAuth = userAuth.value;
	else if ((userAuth = document.body.querySelector('li#nav_logout > a')) == null
			|| !(userAuth = new URLSearchParams(userAuth.search).get('auth'))) throw 'Auth not found';
let userId = document.body.querySelector('li#nav_userinfo > a.username');
if (userId != null) {
	userId = new URLSearchParams(userId.search);
	userId = parseInt(userId.get('id'));
}

function addToTorrentCollage(collageId, groupId) {
	if (!(collageId > 0)) throw 'collage id invalid';
	if (!(groupId > 0)) throw 'torrent group id invalid';
	return (ajaxApiKey ? queryAjaxAPI('addtocollage', { collageid: collageId }, { groupids: groupId })
		.then(response => response.groupsadded.includes(groupId) ? true : Promise.reject('Rejected'))
			: Promise.reject('API key not set')).catch(reason => queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(collage =>
		!collage.torrentgroups.map(torrentgroup => parseInt(torrentgroup.id)).includes(groupId) ? collage.id
			: Promise.reject('already in collage')).then(collageId => new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest, formData = new URLSearchParams({
			action: 'add_torrent',
			collageid: collageId,
			groupid: groupId,
			url: document.location.origin.concat('/torrents.php?id=', groupId),
			auth: userAuth,
		});
		xhr.open('POST', '/collages.php', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState < XMLHttpRequest.DONE) return;
			if (xhr.status >= 200 && xhr.status < 400) resolve(xhr.readyState); else reject(defaultErrorHandler(xhr));
		};
		xhr.onerror = function() { reject(defaultErrorHandler(xhr)) };
		xhr.ontimeout = function() { reject(defaultTimeoutHandler(xhr)) };
		xhr.send(formData);
	})).then(readyState => queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(collage =>
		collage.torrentgroups.map(torrentgroup => parseInt(torrentgroup.id)).includes(groupId)
			|| Promise.reject('Error: not added for unknown reason'))));
}

function removeFromTorrentCollage(collageId, groupId, question) {
	if (!confirm(question)) return Promise.reject('Cancelled');
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest, formData = new URLSearchParams({
			action: 'manage_handle',
			collageid: collageId,
			groupid: groupId,
			auth: userAuth,
			submit: 'Remove',
		});
		xhr.open('POST', '/collages.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() {
			if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
			if (xhr.status >= 200 && xhr.status < 400) resolve(xhr.status); else reject(defaultErrorHandler(xhr));
			xhr.abort();
		};
		xhr.onerror = function() { reject(defaultErrorHandler(xhr)) };
		xhr.ontimeout = function() { reject(defaultTimeoutHandler(xhr)) };
		xhr.send(formData);
	});
}

function addToArtistCollage(collageId, artistId) {
	if (!(collageId > 0)) throw 'collage id invalid';
	if (!(artistId > 0)) throw 'artist id invalid';
	return queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(collage =>
		!collage.artists.map(artist => parseInt(artist.id)).includes(artistId) ? collage.id
			: Promise.reject('already in collage')).then(collageId => new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest, formData = new URLSearchParams({
			action: 'add_artist',
			collageid: collageId,
			artistid: artistId,
			url: document.location.origin.concat('/artist.php?id=', artistId),
			auth: userAuth,
		});
		xhr.open('POST', '/collages.php', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState < XMLHttpRequest.DONE) return;
			if (xhr.status >= 200 && xhr.status < 400) resolve(xhr.readyState); else reject(defaultErrorHandler(xhr));
		};
		xhr.onerror = function() { reject(defaultErrorHandler(xhr)) };
		xhr.ontimeout = function() { reject(defaultTimeoutHandler(xhr)) };
		xhr.send(formData);
	})).then(readyState => queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(collage =>
		collage.artists.map(artist => parseInt(artist.id)).includes(artistId)
			|| Promise.reject('Error: not added for unknown reason')));
}

function removeFromArtistCollage(collageId, artistId, question) {
	if (!confirm(question)) return Promise.reject('Cancelled');
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest, formData = new URLSearchParams({
			action: 'manage_artists_handle',
			collageid: collageId,
			artistid: artistId,
			auth: userAuth,
			submit: 'Remove',
		});
		xhr.open('POST', '/collages.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() {
			if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
			if (xhr.status >= 200 && xhr.status < 400) resolve(xhr.status); else reject(defaultErrorHandler(xhr));
			xhr.abort();
		};
		xhr.onerror = function() { reject(defaultErrorHandler(xhr)) };
		xhr.ontimeout = function() { reject(defaultTimeoutHandler(xhr)) };
		xhr.send(formData);
	});
}

function addQuickAddForm() {
	if (!userId || !groupId && !artistId) return; // User id missing
	let ref = document.querySelector('div.sidebar');
	if (ref == null) return; // Sidebar missing
	const addSuccess = 'Successfully added to collage.';
	const alreadyInCollage = 'Error: This ' +
		(groupId ? 'torrent group' : artistId ? 'artist' : null) + ' is already in this collage';
	new Promise(function(resolve, reject) {
		try {
			var categories = JSON.parse(GM_getValue(document.location.hostname + '-categories'));
			if (categories.length > 0) resolve(categories); else throw 'empty list cached';
		} catch(e) {
			let xhr = new XMLHttpRequest;
			xhr.open('GET', '/collages.php', true);
			xhr.responseType = 'document';
			xhr.onload = function() {
				if (xhr.status >= 200 && xhr.status < 400) {
					categories = [ ];
					xhr.response.querySelectorAll('tr#categories > td > label').forEach(function(label, index) {
						let input = xhr.response.querySelector('tr#categories > td > input#' + label.htmlFor);
						categories[input != null && /\[(\d+)\]/.test(input.name) ? parseInt(RegExp.$1) : index] = label.textContent.trim();
					});
					if (categories.length > 0) {
						GM_setValue(document.location.hostname + '-categories', JSON.stringify(categories));
						resolve(categories);
					} else reject('Site categories could not be extracted');
				} else reject(defaultErrorHandler(xhr));
			};
			xhr.onerror = function() { reject(defaultErrorHandler(xhr)) };
			xhr.ontimeout = function() { reject(defaultTimeoutHandler()) };
			xhr.send();
		}
	}).then(function(categories) {
		const artistsIndexes = categories
			.map((category, index) => /^(?:Artists)$/i.test(category) ? index : -1)
			.filter(index => index >= 0);
		if (artistId && artistsIndexes.length <= 0) throw 'Artists index not found';
		const isCompatibleCategory = categoryId => categoryId >= 0 && categoryId < categories.length
			&& (groupId && !artistsIndexes.includes(categoryId) || artistId && artistsIndexes.includes(categoryId));
		document.head.appendChild(document.createElement('style')).innerHTML = `
form#addtocollage optgroup { background-color: slategray; color: white; }
form#addtocollage option { background-color: white; color: black; max-width: 290pt; }
div.box_addtocollage > form { padding: 0px 10px; }
`;
		let elem = document.createElement('div');
		elem.className = 'box box_addtocollage';
		elem.style = 'padding: 0 0 10px;';
		elem.innerHTML = `
<div class="head" style="margin-bottom: 5px;"><strong>Add to Collage</strong></div>
<div id="ajax_message" class="hidden center" style="padding: 7px 0px;"></div>
<form id="searchcollages">
	<input id="searchforcollage" placeholder="Collage search" type="text" style="max-width: 10em;">
	<input id="searchforcollagebutton" value="Search" type="submit" style="max-width: 4em;">
</form>
<form id="addtocollage" class="add_form" name="addtocollage">
	<select name="collageid" id="matchedcollages" class="add_to_collage_select" style="width: 96%;">
	<input id="opencollage-btn" value="Open collage" type="button">
	<input id="addtocollage-btn" value="Add to collage" type="button">
</form>
`;
		ref.append(elem);
		let ajaxMessage = document.getElementById('ajax_message');
		let srchForm = document.getElementById('searchcollages');
		if (srchForm == null) throw new Error('#searchcollages missing');
		let searchText = document.getElementById('searchforcollage');
		if (searchText == null) throw new Error('#searchforcollage missing');
		let dropDown = document.getElementById('matchedcollages');
		if (dropDown == null) throw new Error('#matchedcollages missing');
		let doOpen = document.getElementById('opencollage-btn');
		let doAdd = document.getElementById('addtocollage-btn');
		if (doAdd == null) throw new Error('#addtocollage-btn missing');
		let searchforcollagebutton = document.getElementById('searchforcollagebutton');
		if (searchforcollagebutton != null) searchforcollagebutton.disabled = searchText.value.length <= 0;
		srchForm.onsubmit = searchSubmit;
		searchText.ondrop = evt => dataHandler(evt.currentTarget, evt.dataTransfer);
		searchText.onpaste = evt => dataHandler(evt.currentTarget, evt.clipboardData);
		searchText.oninput = function(evt) {
			if (searchforcollagebutton != null) searchforcollagebutton.disabled = evt.currentTarget.value.length <= 0;
		};
		if (doOpen != null) doOpen.onclick = openCollage;
		doAdd.onclick = addToCollage;
		let initTimeCap = GM_getValue('max_preload_time', 0); // max time in ms to preload the dropdown
		if (initTimeCap > 0) findCollages({ userid: userId, contrib: 1 }, initTimeCap);

		function clearList() {
			while (dropDown.childElementCount > 0) dropDown.removeChild(dropDown.firstElementChild);
		}

		function findCollages(query, maxSearchTime) {
			return typeof query == 'object' ? new Promise(function(resolve, reject) {
				let start = Date.now();
				searchFormEnable(false);
				clearList();
				elem = document.createElement('option');
				elem.text = 'Searching...';
				dropDown.add(elem);
				dropDown.selectedIndex = 0;
				let retryCount = 0, options = [ ];
				searchInternal();

				function searchInternal(page) {
					if (maxSearchTime > 0 && Date.now() - start > maxSearchTime) {
						reject('Time limit exceeded');
						return;
					}
					let xhr = new XMLHttpRequest, _query = new URLSearchParams(query);
					if (!page) page = 1;
					_query.set('page', page);
					xhr.open('GET', '/collages.php?' + _query, true);
					xhr.responseType = 'document';
					xhr.onload = function() {
						if (xhr.status < 200 || xhr.status >= 400) throw defaultErrorHandler(xhr);
						xhr.response.querySelectorAll('table.collage_table > tbody > tr[class^="row"]').forEach(function(tr, rowNdx) {
							if ((ref = tr.querySelector(':scope > td:nth-of-type(1) > a')) == null) {
								console.warn('Page parsing error');
								return;
							}
							elem = document.createElement('option');
							if ((elem.category = categories.findIndex(category => category.toLowerCase() == ref.textContent.toLowerCase())) < 0
									&& /\b(?:cats)\[(\d+)\]/i.test(ref.search)) elem.category = parseInt(RegExp.$1); // unsafe due to site bug
							if ((ref = tr.querySelector(':scope > td:nth-of-type(2) > a')) == null || !/\b(?:id)=(\d+)\b/i.test(ref.search)) {
								console.warn(`Unknown collage id (${xhr.responseURL}/${rowNdx})`);
								return;
							}
							elem.value = elem.collageId = parseInt(RegExp.$1);
							elem.text = elem.title = ref.textContent.trim();
							if ((ref = tr.querySelector(':scope > td:nth-of-type(3)')) != null) elem.size = parseInt(ref.textContent);
							if ((ref = tr.querySelector(':scope > td:nth-of-type(4)')) != null) elem.subscribers = parseInt(ref.textContent);
							if ((ref = tr.querySelector(':scope > td:nth-of-type(6) > a')) != null
									&& /\b(?:id)=(\d+)\b/i.test(ref.search)) elem.author = parseInt(RegExp.$1);
							if (isCompatibleCategory(elem.category) && (elem.category != 0 || elem.author == userId)) options.push(elem);
						});
						if (xhr.response.querySelector('div.linkbox > a.pager_next') != null) searchInternal(page + 1); else {
							if (!Object.keys(query).includes('order'))
								options.sort((a, b) => (b.size || 0) - (a.size || 0)/*a.title.localeCompare(b.title)*/);
							resolve(options);
						}
					};
					xhr.onerror = function() {
						if (xhr.status == 0 && retryCount++ <= 10) setTimeout(function() { searchInternal(page) }, 200);
						else reject(defaultErrorHandler(xhr));
					};
					xhr.ontimeout = function() { reject(defaultTimeoutHandler()) };
					xhr.send();
				}
			}).then(function(options) {
				clearList();
				categories.forEach(function(category, ndx) {
					let _category = options.filter(option => option.category == ndx);
					if (_category.length <= 0) return;
					elem = document.createElement('optgroup');
					elem.label = category;
					elem.append(..._category);
					dropDown.add(elem);
				});
				dropDown.selectedIndex = 0;
				searchFormEnable(true);
				return options;
			}).catch(function(reason) {
				clearList();
				searchFormEnable(true);
				console.warn(reason);
			}) : Promise.reject('Invalid parameter');
		}

		function searchFormEnable(enabled) {
			for (let i = 0; i < srchForm.length; ++i) srchForm[i].disabled = !enabled;
		}

		function searchSubmit(evt) {
			let searchTerm = searchText.value.trim();
			if (searchTerm.length <= 0) return false;
			let query = {
				action: 'search',
				search: searchTerm,
				type: 'c.name',
				order: 'Updated',
				sort: 'desc',
				order_way: 'Descending',
			};
			categories.map((category, index) => 'cats[' + index + ']')
				.filter((category, index) => isCompatibleCategory(index))
				.forEach(index => { query[index] = 1 });
			findCollages(query);
			return false;
		}

		function addToCollage(evt) {
			(function() {
				evt.currentTarget.disabled = true;
				if (ajaxMessage != null) ajaxMessage.classList.add('hidden');
				let collageId = parseInt(dropDown.value);
				if (!collageId) return Promise.reject('No collage selected');
/*
				if (Array.from(document.querySelectorAll('table.collage_table > tbody > tr:not([class="colhead"]) > td > a'))
						.map(node => /\b(?:id)=(\d+)\b/i.test(node.search) && parseInt(RegExp.$1)).includes(collageId))
					return Promise.reject(alreadyInCollage);
*/
				if (groupId > 0) return addToTorrentCollage(collageId, groupId);
				if (artistId > 0) return addToArtistCollage(collageId, artistId);
				return Promise.reject('munknown page class');
			})().then(function(collage) {
				if (ajaxMessage != null) {
					ajaxMessage.innerHTML = '<span style="color: #0A0;">' + addSuccess + '</span>';
					ajaxMessage.classList.remove('hidden');
				}
				evt.currentTarget.disabled = false;
				let mainColumn = document.querySelector('div.main_column');
				if (mainColumn == null) return collage;
				let tableName = collage.collageCategoryID != 0 ? 'collages' : 'personal_collages'
				let tbody = mainColumn.querySelector('table#' + tableName + ' > tbody');
				if (tbody == null) {
					tbody = document.createElement('tbody');
					tbody.innerHTML = '<tr class="colhead"><td width="85%"><a href="#">↑</a>&nbsp;</td><td># torrents</td></tr>';
					elem = document.createElement('table');
					elem.id = tableName;
					elem.className = 'collage_table';
					elem.append(tbody);
					mainColumn.insertBefore(elem, [
						'table#personal_collages', 'table#vote_matches', 'div.torrent_description',
						'div#similar_artist_map', 'div#artist_information',
					].reduce((acc, selector) => acc || document.querySelector(selector), null));
				}
				tableName = '\xA0This ' + (artistsIndexes.includes(collage.collageCategoryID) ? 'artist' : 'album') + ' is in ' +
					tbody.childElementCount + ' ' + (collage.collageCategoryID != 0 ? 'collage' : 'personal collage');
				if (tbody.childElementCount > 1) tableName += 's';
				tbody.firstElementChild.firstElementChild.childNodes[1].data = tableName;
				elem = document.createElement('tr');
				elem.className = 'collage_rows';
				if (tbody.querySelector('tr.collage_rows.hidden') != null) elem.classList.add('hidden');
				elem.innerHTML = '<td><a href="/collages.php?id=' + collage.id + '">' + collage.name + '</a></td><td class="number_column">' +
					collage[artistsIndexes.includes(collage.collageCategoryID) ? 'artists' : 'torrentgroups'].length + '</td>';
				tbody.append(elem);
				return collage;
			}).catch(function(reason) {
				evt.currentTarget.disabled = false;
				if (ajaxMessage == null) return;
				ajaxMessage.innerHTML = '<span style="color: #A00;">' + reason.toString() + '</span>';
				ajaxMessage.classList.remove('hidden');
			});
		}

		function openCollage(evt) {
			const collageId = parseInt(dropDown.value);
			if (collageId <= 0) return false;
			let win = window.open('/collages.php?id=' + collageId, '_blank');
			win.focus();
		}

		function dataHandler(target, data) {
			const text = data.getData('text/plain');
			if (!text) return false;
			if (searchforcollagebutton != null) searchforcollagebutton.disabled = false;
			target.value = text;
			srchForm.onsubmit();
			return false;
		}
	});
}

const contextId = 'context-9b7e0e42-1e35-4518-ac5f-b6bb31cce23f';
let menu = document.createElement('menu');
menu.type = 'context';
menu.id = contextId;
function contextUpdater(evt) { menu = evt.currentTarget }
menu.innerHTML = '<menuitem label="Remove from this collage" icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADaElEQVQ4y0XTT0xcVRQG8O+ce+fNAOUN7QiFFoHSNq2SIDQ2QGfQ0hYtSatpuvFPjK0mxtDWRF24MG7UbVeasDGmiTrWgG2NjRlaUyAsirrQoCZVF5QZhsKUP/NmKMwM993jwlG/zfdtT3J+IGYCwPE3zye+f//d6UrmMAAwkUI5/+6qilD4q7Z90x9tjyQIYAIIAHjo1ZfjMn5dNm9+LdfeOjdZQeSCCEzETMQAUBl03C/6j0wmD0Vl7kCnfFgXiQNgFT/32ndnTp84lVnK+A+8rHTubW7piNT2Xfvp5xEDFABIheLwZ6dPjR4u+odWvKxvQ0Hpcd32RrFdvD1cXV9az8Ffz4sqFdT8fNr0P76/O372hYQDbHFEtnz+4vOJJ6C7M/fmTSjoKBYrOuAgEnDqqZI5HH/97LcDPe29CytLJmCtLpV8U1dVo6+M3R6DdnCirr4vOTFhKiortEBMrVJ6ODU3eSGVOkkAUKmU++WZ50aPdu7pvp/NmwAcbQzZ6mA12VUPmbFb4hAYzCbCrK+m01ODs8mni0BOMZEqiRS++eX3kQ5365PtO3c059dLVvuai+tFyf34A3SxwBxQ9iHF6mo6fXtwNjlQBHIMKCWAMBEbSOHqb3fie0NVsUdrd+za9MWaP+6wZBZJBQO2CsSXU+mJ88nUUwZYY4AtYDUAQAQgghWB2SiCfIGZT8OfS0E7DhiAIoEAsOXfkHIrJlIWZEMk4Uv9x248+9iBWHZ12dq//mSGWMUkmsDCsNFtNbsaoY6MetkRHyj8d0KI4H7S1zc68Ehbz8pazmBmRmFjw1bpAAUJJAxRAi5AzMEat7mBAodveN6wDxRUiBAeisWun9zfFl1ZXzOcWdT+6rKJBIPqcjI9/msufze6raa1ADEk0EWI6drqNkVEx2553hX9aTQ6fnTPvo7lnGf0xgNtlpZMJODo4dT81Nup5DMA4LC6+VJTQ3ceviGBzlnfvNJc3yuWxzmTzy+YnAdd3CB/6b4fUUoPp+9NXZi9e9yA1gyw9sbszPFLyYUpl5UWgh9gULZgsVjaXAAB/F7r7ngyGpPF7i75uKll0gFcACiLYwAIgNyLD7dOer09MnuwSwYjO+MAGGWS/EFdQ2KosWU6RPQPZ+B/zuUdJApfbNw9/U5dUwJlzn8DiOOFPhubkGUAAAAASUVORK5CYII=" /><menuitem label="-" />';

function subscribeCallback(evt) {
	let link = menu || evt.relatedTarget || document.activeElement;
	if (!(link instanceof HTMLAnchorElement)) return true;
	let collageId = parseInt(new URLSearchParams(link.search).get('id'));
	if (!collageId) {
		console.warn('Assertion failed: no collage id', link);
		throw 'no id';
	}
	let xhr = new XMLHttpRequest;
	xhr.open('GET', '/userhistory.php?' + new URLSearchParams({
		action: 'collage_subscribe',
		collageid: collageId,
		auth: userAuth,
	}), true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
		if (xhr.status >= 200 && xhr.status < 400) { console.info('Subscribed to collage id', collageId) }
			else console.error(defaultErrorHandler(xhr));
		xhr.abort();
	};
	xhr.send();
}

const maxOpenTabs = GM_getValue('max_open_tabs', 25), autoCloseTimeout = GM_getValue('tab_auto_close_timeout', 0);
let openedTabs = [ ], lastOnQueue;
function openTabLimited(endpoint, params, hash) {
	if (typeof GM_openInTab != 'function') return Promise.reject('Not supported');
	if (!endpoint) return Promise.reject('Invalid argument');
	const waitFreeSlot = () => (maxOpenTabs > 0 && openedTabs.length >= maxOpenTabs ?
			Promise.race(openedTabs.map(tabHandler => new Promise(function(resolve) {
		console.assert(!tabHandler.closed);
		if (!tabHandler.closed) tabHandler.resolver = resolve; else resolve(tabHandler);
	}))) : Promise.resolve(null)).then(function(tabHandler) {
		console.assert(openedTabs.length <= maxOpenTabs);
		const url = new URL(endpoint + '.php', document.location.origin);
		if (params) for (let param in params) url.searchParams.set(param, params[param]);
		if (hash) url.hash = hash;
		(tabHandler = GM_openInTab(url.href, true)).onclose = function() {
			console.assert(this.closed);
			if (this.autoCloseTimer >= 0) clearTimeout(this.autoCloseTimer);
			const index = openedTabs.indexOf(this);
			console.assert(index >= 0);
			if (index >= 0) openedTabs.splice(index, 1);
				else openedTabs = openedTabs.filter(opernGroup => !opernGroup.closed);
			if (typeof this.resolver == 'function') this.resolver(this);
		}.bind(tabHandler);
		if (autoCloseTimeout > 0) tabHandler.autoCloseTimer = setTimeout(tabHandler =>
			{ if (!tabHandler.closed) tabHandler.close() }, autoCloseTimeout * 1000, tabHandler);
		openedTabs.push(tabHandler);
		return tabHandler;
	});
	return lastOnQueue = lastOnQueue instanceof Promise ? lastOnQueue.then(waitFreeSlot) : waitFreeSlot();
}

const urlParams = new URLSearchParams(document.location.search);
let groupId, artistId, collageId;
switch (document.location.pathname) {
	case '/torrents.php': {
		function cacheCollage(collage) {
			collages[document.domain][collage.id] = {
				id: collage.id,
				name: collage.name,
				torrentgroups: collage.torrentgroups.map(torrentgroup => ({
					id: torrentgroup.id,
					musicInfo: torrentgroup.musicInfo ? {
						artists: Array.isArray(torrentgroup.musicInfo.artists) ?
							torrentgroup.musicInfo.artists.map(artist => ({ name: artist.name })) : undefined,
					} : undefined,
					name: torrentgroup.name,
					year: parseInt(torrentgroup.year) || undefined,
				})),
			};
			window.sessionStorage.setItem('collages', JSON.stringify(collages));
		}

		if (!(groupId = parseInt(urlParams.get('id'))) > 0) break; // Unexpected URL format
		const searchforcollage = document.getElementById('searchforcollage'),
					submitButton = document.getElementById('searchforcollagebutton'),
					addToCollageSelect = document.body.querySelector('select.add_to_collage_select');
		var collages;
		if (searchforcollage != null) {
			if (submitButton != null) submitButton.disabled = searchforcollage.value.length <= 0;
			if (typeof SearchCollage == 'function') SearchCollage = () => {
				const searchTerm = $('#searchforcollage').val(),
							personalCollages = $('#personalcollages');
				ajax.get(`ajax.php?action=collages&search=${encodeURIComponent(searchTerm)}`, responseText => {
					const { response, status } = JSON.parse(responseText);
					if (status !== 'success') return;
					const categories = response.reduce((accumulator, item) => {
						const { collageCategoryName } = item;
						accumulator[collageCategoryName] = (accumulator[collageCategoryName] || []).concat(item);
						return accumulator;
					}, {});
					personalCollages.children().remove();
					Object.entries(categories).forEach(([category, collages]) => {
						console.log(collages);
						personalCollages.append(`
<optgroup label="${category}">
${collages.reduce((accumulator, { id, name }) =>
	`${accumulator}<option value="${id}">${name}</option>`
	,'')}
</optgroup>
`);
					});
				});
			};

			if (addToCollageSelect != null) addToCollageSelect.selectedIndex = -1;

			function inputHandler(evt, key) {
				const data = evt[key].getData('text/plain').trim();
				if (!data) return true;
				evt.currentTarget.value = data;
				if (submitButton != null) submitButton.disabled = false;
				SearchCollage();
				setTimeout(function() {
					if (addToCollageSelect != null && addToCollageSelect.options.length > 1) {
						// TODO: expand
					}
				}, 3000);
				return false;
			}
			searchforcollage.onpaste = evt => inputHandler(evt, 'clipboardData');
			searchforcollage.ondrop = evt => inputHandler(evt, 'dataTransfer');
			searchforcollage.oninput = function(evt) {
				if (submitButton != null) submitButton.disabled = evt.currentTarget.value.length <= 0;
			};
			searchforcollage.onkeypress = function(evt) {
				if (evt.key == 'Enter' && evt.currentTarget.value.length > 0) SearchCollage();
			};
		} else addQuickAddForm();

		if ('collages' in window.sessionStorage) try { collages = JSON.parse(window.sessionStorage.getItem('collages')) }
			catch(e) { console.warn(e) }
		if (!collages) collages = { };
		if (!(document.domain in collages)) collages[document.domain] = { };

		function callback(evt) {
			switch (evt.currentTarget.nodeName) {
				case 'A':
					if (evt.button != 0 || !evt.altKey) return true;
					var link = evt.currentTarget;
					break;
				case 'MENUITEM':
					link = menu || evt.relatedTarget || document.activeElement;
					break;
			}
			if (!(link instanceof HTMLAnchorElement)) return true;
			let collageId = parseInt(new URLSearchParams(link.search).get('id'));
			if (!collageId) {
				console.warn('Assertion failed: no collage id', link);
				throw 'no id';
			}
			return removeFromTorrentCollage(collageId, groupId,
					'Are you sure to remove this group from collage "' + link.textContent.trim() + '"?').then(function(status) {
				const tr = link.parentNode.parentNode, table = tr.parentNode.parentNode;
				tr.remove();
				if (table.querySelectorAll('tbody > tr:not([class="colhead"])').length <= 0) table.remove();
			});
		}
		menu.children[0].onclick = callback;
		let subscribeCmd = document.createElement('menuitem');
		subscribeCmd.label = 'Subscribe to this collage - toggle (!)';
		subscribeCmd.title = 'Use with care - toggling command; on already subscribed collages performs unsubscribe';
		subscribeCmd.onclick = subscribeCallback;
		menu.insertBefore(subscribeCmd, menu.children[1]);
		document.body.append(menu);

		document.querySelectorAll('table[id$="collages"] > tbody > tr > td > a').forEach(function(link) {
			if (!link.pathname.startsWith('/collages.php') || !/\b(?:id)=(\d+)\b/.test(link.search)) return;
			let collageId = parseInt(RegExp.$1), toggle, navLinks = [ ],
					numberColumn = link.parentNode.parentNode.querySelector('td.number_column');
			link.onclick = callback;
			link.oncontextmenu = contextUpdater;
			link.setAttribute('contextmenu', contextId);
			link.title = 'Use Alt + left click or context menu(FF) to remove from this collage';

			if (numberColumn != null) {
				numberColumn.style.cursor = 'pointer';
				numberColumn.onclick = loadCollage;
				numberColumn.title = collages[document.domain][collageId] ? 'Refresh' : 'Load collage for direct browsing';
			}
			if (collages[document.domain][collageId]) {
				expandSection();
				addCollageLinks(collages[document.domain][collageId]);
			}

			function addCollageLinks(collage) {
				var index = collage.torrentgroups.findIndex(torrentgroup => parseInt(torrentgroup.id) == groupId);
				if (index < 0) {
					console.warn('Assertion failed: torrent', groupId, 'not found in the collage', collage);
					return false;
				}
				link.style.color = 'white';
				link.parentNode.parentNode.style = 'color:white; background-color: darkgoldenrod;';
				var stats = document.createElement('span');
				stats.textContent = (index + 1) + '/' + collage.torrentgroups.length;
				stats.style = 'font-size: 8pt; color: antiquewhite; font-weight: 100; margin-left: 10px;';
				navLinks.push(stats);
				link.parentNode.append(stats);
				if (collage.torrentgroups[index - 1]) {
					var a = document.createElement('a');
					a.href = '/torrents.php?id=' + collage.torrentgroups[index - 1].id;
					//a.classList.add('brackets');
					a.textContent = '[\xA0<\xA0]';
					a.title = getTitle(index - 1);
					a.style = 'color: chartreuse; margin-right: 10px;';
					navLinks.push(a);
					link.parentNode.prepend(a);
					a = document.createElement('a');
					a.href = '/torrents.php?id=' + collage.torrentgroups[0].id;
					//a.classList.add('brackets');
					a.textContent = '[\xA0<<\xA0]';
					a.title = getTitle(0);
					a.style = 'color: chartreuse; margin-right: 5px;';
					navLinks.push(a);
					link.parentNode.prepend(a);
				}
				if (collage.torrentgroups[index + 1]) {
					a = document.createElement('a');
					a.href = '/torrents.php?id=' + collage.torrentgroups[index + 1].id;
					//a.classList.add('brackets');
					a.textContent = '[\xA0>\xA0]';
					a.title = getTitle(index + 1);
					a.style = 'color: chartreuse; margin-left: 10px;';
					navLinks.push(a);
					link.parentNode.append(a);
					a = document.createElement('a');
					a.href = '/torrents.php?id=' + collage.torrentgroups[collage.torrentgroups.length - 1].id;
					//a.classList.add('brackets');
					a.textContent = '[\xA0>>\xA0]';
					a.title = getTitle(collage.torrentgroups.length - 1);
					a.style = 'color: chartreuse; margin-left: 5px;';
					navLinks.push(a);
					link.parentNode.append(a);
				}
				return true;

				function getTitle(index) {
					if (typeof index != 'number' || index < 0 || index >= collage.torrentgroups.length) return undefined;
					let title = collage.torrentgroups[index].musicInfo && Array.isArray(collage.torrentgroups[index].musicInfo.artists) ?
						collage.torrentgroups[index].musicInfo.artists.map(artist => artist.name).join(', ') + ' - ' : '';
					if (collage.torrentgroups[index].name) title += collage.torrentgroups[index].name;
					if (collage.torrentgroups[index].year) title += ' (' + collage.torrentgroups[index].year + ')';
					return title;
				}
			}

			function expandSection() {
				if (toggle === undefined) toggle = link.parentNode.parentNode.parentNode.querySelector('td > a[href="#"][onclick]');
				if (toggle === null || toggle.dataset.expanded) return false;
				toggle.dataset.expanded = true;
				toggle.click();
				return true;
			}

			function loadCollage(evt) {
				evt.currentTarget.disabled = true;
				navLinks.forEach(a => { a.remove() });
				navLinks = [];
				let span = document.createElement('span');
				span.textContent = '[\xA0loading...\xA0]';
				span.style = 'color: red; background-color: white; margin-left: 10px;';
				link.parentNode.append(span);
				queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(function(collage) {
					span.remove();
					cacheCollage(collage);
					addCollageLinks(collage);
					evt.currentTarget.disabled = false;
				}, function(reason) {
					span.remove();
					evt.currentTarget.disabled = false;
				});
				return false;
			}
		});

		// GM_registerMenuCommand('Add to "Broken covers... collage',
		// 	() => { addToTorrentCollage(31445, groupId).catch(alert) });
		break;
	}
	case '/artist.php': {
		function cacheCollage(collage) {
			collages[document.domain][collage.id] = {
				id: collage.id,
				name: collage.name,
				artists: collage.artists.map(artist => ({
					id: artist.id,
					name: artist.name,
				})),
			};
			window.sessionStorage.setItem('collages', JSON.stringify(collages));
		}

		if (!((artistId = parseInt(urlParams.get('id'))) > 0)) break; // Unexpected URL format
		addQuickAddForm();
		if ('collages' in window.sessionStorage) try { collages = JSON.parse(window.sessionStorage.getItem('collages')) }
			catch(e) { console.warn(e) }
		if (!collages) collages = { };
		if (!(document.domain in collages)) collages[document.domain] = { };

		function callback(evt) {
			switch (evt.currentTarget.nodeName) {
				case 'A':
					if (evt.button != 0 || !evt.altKey) return true;
					var link = evt.currentTarget;
					break;
				case 'MENUITEM':
					link = menu || evt.relatedTarget || document.activeElement;
					break;
			}
			if (!(link instanceof HTMLAnchorElement)) return true;
			let collageId = parseInt(new URLSearchParams(link.search).get('id'));
			if (!collageId) {
				console.warn('Assertion failed: no collage id', link);
				throw 'no id';
			}
			return removeFromArtistCollage(collageId, artistId,
					'Are you sure to remove this artist from collage "' + link.textContent.trim() + '"?').then(function(status) {
				const tr = link.parentNode.parentNode, table = tr.parentNode.parentNode;
				tr.remove();
				if (table.querySelectorAll('tbody > tr:not([class="colhead"])').length <= 0) table.remove();
			});
		}
		menu.children[0].onclick = callback;
		let subscribeCmd = document.createElement('menuitem');
		subscribeCmd.label = 'Subscribe to this collage - toggle (!)';
		subscribeCmd.title = 'Use with care - toggling command; on already subscribed collages performs unsubscribe';
		subscribeCmd.onclick = subscribeCallback;
		menu.insertBefore(subscribeCmd, menu.children[1]);
		document.body.append(menu);

		document.querySelectorAll('table[id$="collages"] > tbody > tr > td > a').forEach(function(link) {
			if (!link.pathname.startsWith('/collages.php') || !/\b(?:id)=(\d+)\b/.test(link.search)) return;
			let collageId = parseInt(RegExp.$1), toggle, navLinks = [],
					numberColumn = link.parentNode.parentNode.querySelector('td:last-of-type');
			link.onclick = callback;
			link.oncontextmenu = contextUpdater;
			link.setAttribute('contextmenu', contextId);
			link.title = 'Use Alt + left click or context menu(FF) to remove from this collage';

			if (numberColumn != null) {
				numberColumn.style.cursor = 'pointer';
				numberColumn.onclick = loadCollage;
				numberColumn.title = collages[document.domain][collageId] ? 'Refresh' : 'Load collage for direct browsing';
			}
			if (collages[document.domain][collageId]) {
				expandSection();
				addCollageLinks(collages[document.domain][collageId]);
			}

			function addCollageLinks(collage) {
				var index = collage.artists.findIndex(artist => artist.id == artistId);
				if (index < 0) {
					console.warn('Assertion failed: torrent', groupId, 'not found in the collage', collage);
					return false;
				}
				link.style.color = 'white';
				link.parentNode.parentNode.style = 'color:white; background-color: darkgoldenrod;';
				var stats = document.createElement('span');
				stats.textContent = `${index + 1} / ${collage.artists.length}`;
				stats.style = 'font-size: 8pt; color: antiquewhite; font-weight: 100; margin-left: 10px;';
				navLinks.push(stats);
				link.parentNode.append(stats);
				if (collage.artists[index - 1]) {
					var a = document.createElement('a');
					a.href = '/artist.php?id=' + collage.artists[index - 1].id;
					a.textContent = '[\xA0<\xA0]';
					a.title = getTitle(index - 1);
					a.style = 'color: chartreuse; margin-right: 10px;';
					navLinks.push(a);
					link.parentNode.prepend(a);
					a = document.createElement('a');
					a.href = '/artist.php?id=' + collage.artists[0].id;
					a.textContent = '[\xA0<<\xA0]';
					a.title = getTitle(0);
					a.style = 'color: chartreuse; margin-right: 5px;';
					navLinks.push(a);
					link.parentNode.prepend(a);
				}
				if (collage.artists[index + 1]) {
					a = document.createElement('a');
					a.href = '/artist.php?id=' + collage.artists[index + 1].id;
					a.textContent = '[\xA0>\xA0]';
					a.title = getTitle(index + 1);
					a.style = 'color: chartreuse; margin-left: 10px;';
					navLinks.push(a);
					link.parentNode.append(a);
					a = document.createElement('a');
					a.href = '/artist.php?id=' + collage.artists[collage.artists.length - 1].id;
					a.textContent = '[\xA0>>\xA0]';
					a.title = getTitle(collage.artists.length - 1);
					a.style = 'color: chartreuse; margin-left: 5px;';
					navLinks.push(a);
					link.parentNode.append(a);
				}
				return true;

				function getTitle(index) {
					console.assert(index >= 0 && index < collage.artists.length, "index >= 0 && index < collage.artists.length");
					if (!(index >= 0 && index < collage.artists.length)) return undefined;
					return collage.artists[index] ? collage.artists[index].name : '';
				}
			}

			function expandSection() {
				if (toggle === undefined) toggle = link.parentNode.parentNode.parentNode.querySelector('td > a[href="#"][onclick]');
				if (toggle === null || toggle.dataset.expanded) return false;
				toggle.dataset.expanded = true;
				toggle.click();
				return true;
			}

			function loadCollage(evt) {
				evt.currentTarget.disabled = true;
				navLinks.forEach(a => { a.remove() });
				navLinks = [ ];
				let span = document.createElement('span');
				span.textContent = '[\xA0loading...\xA0]';
				span.style = 'color: red; background-color: white; margin-left: 10px;';
				link.parentNode.append(span);
				queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(function(collage) {
					span.remove();
					cacheCollage(collage);
					addCollageLinks(collage);
					evt.currentTarget.disabled = false;
				}, function(reason) {
					span.remove();
					evt.currentTarget.disabled = false;
				});
				return false;
			}
		});
		break;
	}
	case '/collages.php':
	case '/collage.php': {
		function addNotifier(caption, timeout = 20 * 1000) {
			if (!caption) return;
			const notifier = document.createElement('DIV');
			notifier.style = 'position: fixed; z-index: 999; top: 20pt; right: 20pt; padding: 10pt; border: 2pt solid gray; background-color: darkslategrey; color: gold; font: 600 10pt "Segoe UI", sans-serif; cursor: pointer;';
			notifier.textContent = caption;
			notifier.onclick = function(evt) {
				const ststsBox = document.body.querySelector('div.sidebar > div.box_info');
				if (ststsBox != null) ststsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
			};
			document.body.append(notifier);
			if (timeout > 0) setTimeout(function(elem) {
				if (timeout >= 4000) {
					elem.style.transition = 'opacity 2s';
					elem.style.opacity = 0;
				}
				setTimeout(elem => { document.body.removeChild(elem) }, Math.min(timeout, 2000), elem);
			}, Math.max(timeout - 2000, 0), notifier);
		}
		function updateGalleryPager(li) {
		}

		if (!((collageId = parseInt(urlParams.get('id'))) > 0)) break; // Collage id missing
		let collageSize = document.body.querySelector('div.box_info > ul.stats > li:first-of-type');
		if (collageSize != null && (collageSize = /\b(\d+(?:[\,]\d+)*)\b/.exec(collageSize.textContent)) != null)
			collageSize = parseInt(collageSize[1].replace(/\D/g, ''));
		let category = document.querySelector('div.box_category > div.pad > a'), selectors, callback;
		category = category != null ? category.textContent : undefined;
		console.assert(category, 'category != undefined');
		let watchDogs = GM_getValue('watched_collages');
		if (!watchDogs || typeof watchDogs != 'object') watchDogs = { };
		if (!(document.domain in watchDogs)) watchDogs[document.domain] = { };
		const getCollageItemIds = () => queryAjaxAPI('collage', { id: collageId, showonlygroups: 1 }).then(collage =>
			collage[collage.collageCategoryID == 7 ? 'artists' : 'torrentgroups'].map(item => parseInt(item.id)));
		const saveSnapshot = () => getCollageItemIds().then(function(ids) {
			watchDogs[document.domain][collageId] = ids;
			GM_setValue('watched_collages', watchDogs);
			return watchDogs[document.domain][collageId].length;
		});
		if (collageId in watchDogs[document.domain]) {
			if (collageSize > 0 && collageSize != watchDogs[document.domain][collageId].length
					|| !GM_getValue('savvy_change_detection', true)) getCollageItemIds().then(function(ids) {
				function addDelta(ids, caption) {
					const li = document.createElement('LI'),
								spans = ['SPAN', 'SPAN', 'SPAN'].map(Document.prototype.createElement.bind(document));
					spans[0].style = 'color: red; font-weight: 900;';
					spans[0].textContent = ids.length;
					spans[1].style = 'color: cadetblue; cursor: pointer;';
					spans[1].textContent = 'view';
					spans[1].onclick = function(evt) {
						for (let id of ids) openTabLimited(category == 'Artists' ? 'artist' : 'torrents', { id: id }, 'content');
					};
					spans[2].style = 'color: cadetblue; cursor: pointer;';
					spans[2].textContent = 'copy';
					spans[2].onclick = evt => { GM_setClipboard(ids.map(function(id) {
						if (evt.ctrlKey) {
							const url = new URL(`${category == 'Artists' ? 'artist' : 'torrents'}.php`, document.location.origin);
							url.searchParams.set('id', id);
							return url.href;
						}
						return id.toString();
					}).join('\n') + '\n', 'text') };
					li.append(spans[0], ` ${category == 'Artists' ? 'artist' : 'group'}(s) ${caption} (`);
					li.append(spans[1], ' | ', spans[2], ')');
					count.append(li);
				}

				const count = document.body.querySelector('div.box_info > ul.stats > li:first-of-type');
				const addedIds = ids.filter(id => !watchDogs[document.domain][collageId].includes(id));
				if (addedIds.length > 0) addDelta(addedIds, 'added');
				const removedIds = watchDogs[document.domain][collageId].filter(id => !ids.includes(id));
				if (removedIds.length > 0) addDelta(removedIds, 'removed');
				if (addedIds.length <= 0 && removedIds.length <= 0) return;
				saveSnapshot();
				addNotifier('This collage has changed since last visit');
			});
		}
		const linkBox = document.body.querySelector('div#content div.header > div.linkbox');
		if (linkBox != null) {
			const a = document.createElement('A');
			a.className = 'brackets';
			a.href = '#';
			a.textContent = (a.watched = collageId in watchDogs[document.domain]) ? 'Unwatch' : 'Watch';
			a.title = 'Watched collages will highlight additions/removals since previous view on each load time';
			a.onclick = function toggleWatchState(evt) {
				if (!evt.currentTarget.disabled) evt.currentTarget.disabled = true; else return false;
				const currentTarget = evt.currentTarget;
				if (currentTarget.watched) {
					if (collageId in watchDogs[document.domain]) {
						delete watchDogs[document.domain][collageId];
						GM_setValue('watched_collages', watchDogs);
					}
					currentTarget.watched = false;
					currentTarget.textContent = 'Watch';
					currentTarget.disabled = false;
				} else saveSnapshot().then(function(collageSize) {
					currentTarget.watched = true;
					currentTarget.textContent = 'Unwatch';
					currentTarget.disabled = false;
				});
				return false;
			};
			linkBox.append(' ', a);
		}

		if (category != 'Artists') {
			selectors = [
				'tr.group > td[colspan] > strong > a[href^="torrents.php?id="]',
				'ul.collage_images > li > a[href^="torrents.php?id="]',
			];
			callback = function(evt) {
				switch (evt.currentTarget.nodeName) {
					case 'A':
						if (evt.button != 0 || !evt.altKey) return true;
						var link = evt.currentTarget;
						break;
					case 'MENUITEM':
						link = menu || evt.relatedTarget || document.activeElement;
						break;
				}
				if (!(link instanceof HTMLAnchorElement)) return true;
				let groupId = parseInt(new URLSearchParams(link.search).get('id'));
				if (!groupId) {
					console.warn('Assertion failed: no id', link);
					throw 'no id';
				}
				removeFromTorrentCollage(collageId, groupId, 'Are you sure to remove selected group from this collage?').then(function(status) {
					document.querySelectorAll(selectors.join(', ')).forEach(function(a) {
						if (parseInt(new URLSearchParams(a.search).get('id')) == groupId) switch (a.parentNode.nodeName) {
							case 'STRONG': a.parentNode.parentNode.parentNode.remove(); break;
							case 'LI': a.parentNode.remove(); break;
						}
					});
				});
			};
		} else {
			selectors = [
				'table#discog_table > tbody > tr > td > a[href^="artist.php?id="]',
				'ul.collage_images > li > a[href^="artist.php?id="]',
			];
			callback = function(evt) {
				switch (evt.currentTarget.nodeName) {
					case 'A':
						if (evt.button != 0 || !evt.altKey) return true;
						var link = evt.currentTarget;
						break;
					case 'MENUITEM':
						link = menu || evt.relatedTarget || document.activeElement;
						break;
				}
				if (!(link instanceof HTMLAnchorElement)) return true;
				let artistId = parseInt(new URLSearchParams(link.search).get('id'));
				if (!artistId) {
					console.warn('Assertion failed: no id', evt.currentTarget);
					throw 'no id';
				}
				removeFromArtistCollage(collageId, artistId, 'Are you sure to remove selected artist from this collage?').then(function(status) {
					document.querySelectorAll(selectors.join(', ')).forEach(function(a) {
						if (parseInt(new URLSearchParams(a.search).get('id')) == artistId) switch (a.parentNode.nodeName) {
							case 'TD': a.parentNode.parentNode.remove(); break;
							case 'LI': a.parentNode.remove(); break;
						}
					});
				});
			};
			let artistLink = document.querySelector('form.add_form[name="artist"] input#artist');
			if (artistLink != null) {
				let ref = document.querySelector('form.add_form[name="artist"] > div.submit_div');
				let searchBtn = document.createElement('input');
				searchBtn.value = 'Look up';
				searchBtn.type = 'button';
				searchBtn.onclick = function(evt) {
					let xhr = new XMLHttpRequest;
					xhr.open('HEAD', '/artist.php?artistname=' + encodeURIComponent(artistLink.value.trim()), true);
					xhr.onreadystatechange = function() {
						if (xhr.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
						artistLink.value = xhr.responseURL.includes('/artist.php?id=') ? xhr.responseURL : '';
					};
					xhr.send();
				};
				ref.append(searchBtn);
			}
		}
		menu.children[0].onclick = callback;
		document.body.append(menu);
		function handlerInstaller(a) {
			a.onclick = callback;
			a.oncontextmenu = contextUpdater;
			a.setAttribute('contextmenu', contextId);
		}
		document.querySelectorAll(selectors.join(', ')).forEach(handlerInstaller);
		let coverart = document.getElementById('coverart');
		if (coverart != null) new MutationObserver(function(ml, mo) {
			for (let mutation of ml) for (let node of mutation.addedNodes) {
				if (node.nodeName != 'UL' || !node.classList.contains('collage_images')) return;
				node.querySelectorAll(':scope > li > a').forEach(handlerInstaller);
				const linkBox = document.body.querySelectorAll('div.main_column > div.linkbox.pager');
				if (linkBox != null && GM_getValue('rearrange_page_control', false)) updateGalleryPager(linkBox);
			}
		}).observe(coverart, { childList: true });
		if (!GM_getValue('rearrange_page_control', false)) break;
		for (let linkBox of document.body.querySelectorAll('div.main_column > div.linkbox')) {
			const page = parseInt(urlParams.get('page')) || 1, numPages = Math.ceil(collageSize / 50);
			if (numPages > 1) if (linkBox.classList.contains('pager')) updateGalleryPager(linkBox); else {
				const strong = linkBox.querySelector(':scope > strong');
				console.assert(strong != null);
				if (strong == null) continue;
				let pager = linkBox.querySelector('a.pager_prev');
				if (pager != null) {
					const divisor = pager.nextSibling;
					divisor.remove();
					strong.insertAdjacentElement('beforebegin', pager);
					strong.insertAdjacentText('beforebegin', divisor.wholeText);
					if ((pager = linkBox.querySelector('a:first-of-type')) != null && pager.textContent.includes('<< First'))
						pager.insertAdjacentText('afterend', divisor.wholeText);
				}
				if ((pager = linkBox.querySelector('a.pager_next')) != null) {
					const divisor = pager.previousSibling;
					divisor.remove();
					strong.insertAdjacentElement('afterend', pager);
					strong.insertAdjacentText('afterend', divisor.wholeText);
					if ((pager = linkBox.querySelector('a:last-of-type')) != null && pager.textContent.includes('Last >>'))
						pager.insertAdjacentText('beforebegin', divisor.wholeText);
				}
				const a = Array.prototype.filter.call(linkBox.querySelectorAll(':scope > a:not([class])'),
					a => /\b(\d+(?:[\,]\d+)*)\s*-\s*(\d+(?:[\,]\d+)*)\b/.test(a.textContent));
				let pageLinks;
				if ((pageLinks = a.filter(a => parseInt(new URLSearchParams(a.search).get('page')) < page)).length > 0) {
					const step = (page - 2) / (pageLinks.length + 1);
					pageLinks.forEach(function(pageLink, index) {
						const a = new URL(pageLink), p = 1 + Math.round((index + 1) * step);
						a.searchParams.set('page', p);
						pageLink.setAttribute('href', a.pathname + a.search);
						pageLink.firstElementChild.textContent = `${p * 50 - 49}-${p * 50}`;
					});
				}
				if ((pageLinks = a.filter(a => parseInt(new URLSearchParams(a.search).get('page')) > page)).length > 0) {
					const step = (numPages - 1 - page) / (pageLinks.length + 1);
					pageLinks.forEach(function(pageLink, index) {
						const a = new URL(pageLink), p = page + 1 + Math.round((index + 1) * step);
						a.searchParams.set('page', p);
						pageLink.setAttribute('href', a.pathname + a.search);
						pageLink.firstElementChild.textContent = `${p * 50 - 49}-${p * 50}`;
					});
				}
			}
		}
		break;
	}
}
