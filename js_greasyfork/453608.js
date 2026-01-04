// ==UserScript==
// @name         [RED] Import release details from Bandcamp
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      0.26.4
// @match        https://redacted.sh/upload.php
// @match        https://redacted.sh/upload.php&url=*
// @match        https://redacted.sh/requests.php?action=new
// @match        https://redacted.sh/requests.php?action=new&groupid=*
// @match        https://redacted.sh/requests.php?action=new&url=*
// @match        https://redacted.sh/torrents.php?id=*
// @match        https://redacted.sh/torrents.php?page=*&id=*
// @match        https://redacted.sh/better.php?method=notags
// @match        https://redacted.sh/better.php?page=*&method=notags
// @match        https://orpheus.network/upload.php
// @match        https://orpheus.network/upload.php?url=*
// @match        https://orpheus.network/requests.php?action=new
// @match        https://orpheus.network/requests.php?action=new&groupid=*
// @match        https://orpheus.network/requests.php?action=new&url=*
// @match        https://orpheus.network/torrents.php?id=*
// @match        https://orpheus.network/torrents.php?page=*&id=*
// @match        https://orpheus.network/better.php?method=notags
// @match        https://orpheus.network/better.php?page=*&method=notags
// @run-at       document-end
// @iconURL      https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @author       Anakunda
// @description  Lets find music release on Bandcamp and import release about, personnel credits, cover image and tags.
// @copyright    2023, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/QobuzLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/GazelleTagManager.min.js
// @downloadURL https://update.greasyfork.org/scripts/453608/%5BRED%5D%20Import%20release%20details%20from%20Bandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/453608/%5BRED%5D%20Import%20release%20details%20from%20Bandcamp.meta.js
// ==/UserScript==

{

'use strict';

const imageHostHelper = 'imageHostHelper' in unsafeWindow ? unsafeWindow.imageHostHelper ? Promise.resolve(unsafeWindow.imageHostHelper)
		: Promise.reject('Assertion failed: void unsafeWindow.imageHostHelper') : new Promise(function(resolve, reject) {
	function listener(evt) {
		clearTimeout(timeout);
		unsafeWindow.removeEventListener('imageHostHelper', listener);
		//console.log('imageHostHelper exports triggered:', evt);
		if (evt.data) resolve(evt.data); else if (unsafeWindow.imageHostHelper) resolve(unsafeWindow.imageHostHelper);
			else reject('Assertion failed: void unsafeWindow.imageHostHelper');
	}

	unsafeWindow.addEventListener('imageHostHelper', listener);
	const timeout = setTimeout(function() {
		unsafeWindow.removeEventListener('imageHostHelper', listener);
		reject('Timeout reached');
	}, 15000);
});

const nothingFound = 'Nothing found';
const stripText = text => text ? [
	[/\r\n/gm, '\n'], [/[^\S\n]+$/gm, ''], [/\n{3,}/gm, '\n\n'],
].reduce((text, subst) => text.replace(...subst), text.trim()) : '';

function getSearchResults(torrentGroup, fullSearchResults = true, thoroughSearch = false) {
	function tryQuery(terms) {
		if (!Array.isArray(terms)) throw 'Invalid qrgument';
		if (terms.length <= 0) return Promise.reject(nothingFound);
		const url = new URL('https://bandcamp.com/search');
		url.searchParams.set('q', terms.map(term => '"' + term + '"').join(' '));
		const searchType = itemType => (function getPage(page = 1) {
			if (itemType) url.searchParams.set('item_type', itemType); else url.searchParams.delete('item_type');
			url.searchParams.set('page', page);
			return GlobalXHR.get(url).then(function({document}) {
				const results = Array.prototype.filter.call(document.body.querySelectorAll('div.search ul.result-items > li.searchresult'), function(li) {
					let searchType = li.dataset.search;
					if (searchType) try { searchType = JSON.parse(searchType).type.toLowerCase() } catch(e) { console.warn(e) }
					return !searchType || ['a', 't'].includes(searchType);
				});
				return document.body.querySelector('div.pager > a.next') != null && fullSearchResults ?
					getPage(page + 1, itemType).then(_results => results.concat(_results)) : results;
			});
		})().then(results => results.length > 0 ? results : Promise.reject(nothingFound));
		return searchType();
		// return ('a').catch(reason => [5, 9].includes(torrentGroup.group.releaseType) && reason == nothingFound ?
		// 	searchType('t') : Promise.reject(reason));
	}

	if (!torrentGroup) return Promise.reject('Assertion failed: invalid argument (torrentGroup)');
	const artists = torrentGroup.group.releaseType != 7 && torrentGroup.group.musicInfo
		&& Array.isArray(torrentGroup.group.musicInfo.artists) && torrentGroup.group.musicInfo.artists.length > 0 ?
			torrentGroup.group.musicInfo.artists.map(artist => artist.name.trim()).slice(0, 2) : null;
	const album = [
		/\s+(?:EP|E\.\s?P\.|-\s+(?:EP|E\.\s?P\.))$/i,
		/\s+\((?:EP|E\.\s?P\.|Live)\)$/i, /\s+\[(?:EP|E\.\s?P\.|Live)\]$/i,
		/\s+\((?:feat\.|ft\.|featuring\s).+\)$/i, /\s+\[(?:feat\.|ft\.|featuring\s).+\]$/i,
	].reduce((title, rx) => title.replace(rx, ''), torrentGroup.group.name.trim());
	if (!album) return Promise.reject('Album title missing');
	const bracketStripper = /(?:\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))+$/g;
	const searchAlbumOnly = () => tryQuery([album]).catch(reason => reason == nothingFound ? bracketStripper.test(album) ?
		tryQuery([album.replace(bracketStripper, '')]) : Promise.reject(nothingFound) : Promise.reject(reason));
	if (artists == null) return searchAlbumOnly();
	let lookupWorker = tryQuery(artists.concat(album)).catch(reason => reason == nothingFound ?
		artists.some(artist => bracketStripper.test(artist)) || bracketStripper.test(album) ?
			tryQuery(artists.map(artist => artist.replace(bracketStripper, '')).concat(album.replace(bracketStripper, '')))
				: Promise.reject(nothingFound) : Promise.reject(reason));
	if (thoroughSearch || torrentGroup.group.musicInfo.artists.length >= 3)
		lookupWorker = lookupWorker.catch(reason => reason == nothingFound ? searchAlbumOnly() : Promise.reject(reason));
	return lookupWorker;
}

const matchingResultsCount = torrentGroup => getSearchResults(torrentGroup, true).then(searchResults => searchResults.map(function(li) {
	const searchResult = {
		itemType: li.querySelector('div.itemtype'),
		numTracks: li.querySelector('div.length'),
		releaseYear: li.querySelector('div.released'),
	};
	if (searchResult.itemType != null) searchResult.itemType = searchResult.itemType.textContent.trim().toLowerCase();
	if (searchResult.releaseYear != null
			&& (searchResult.releaseYear = /\b(\d{4})\b/.exec(searchResult.releaseYear.textContent)) != null)
		searchResult.releaseYear = parseInt(searchResult.releaseYear[1]);
	if (searchResult.itemType == 'track') searchResult.numTracks = 1;
	else if (searchResult.numTracks != null
			&& (searchResult.numTracks = /\b(\d+)\s+(?:tracks?)\b/i.exec(searchResult.numTracks.textContent)) != null)
		searchResult.numTracks = parseInt(searchResult.numTracks[1]);
	else searchResult.numTracks = 0;
	return searchResult;
})).then(searchResults => searchResults.filter(function(searchResult) {
	if (searchResult.releaseYear > 0 && torrentGroup.group.year > searchResult.releaseYear) return false;
	return torrentGroup.torrents.some(function(torrent) {
		if (torrent.remasterYear > 0 && searchResult.releaseYear > 0 && torrent.remasterYear != searchResult.releaseYear) return false;
		const audioFileCount = torrent.fileList ? torrent.fileList.split('|||').filter(file =>
			/^(.+\.(?:flac|mp3|m4[ab]|aac|dts(?:hd)?|truehd|ac3|ogg|opus|wv|ape))\{{3}(\d+)\}{3}$/i.test(file)).length : 0;
		console.assert(audioFileCount > 0);
		if (audioFileCount > 0 && searchResult.numTracks > 0 && audioFileCount != searchResult.numTracks) return false;
		return torrent.remasterYear > 0 && searchResult.releaseYear > 0 || audioFileCount > 0 && searchResult.numTracks > 0;
	});
})).then(matchingResults => matchingResults.length > 0 ? matchingResults.length : Promise.reject(nothingFound));

const fetchBandcampDetails = torrentGroup => getSearchResults(torrentGroup, GM_getValue('full_search_results', true), true)
		.then(searchResults => new Promise(function(resolve, reject) {
	function kbdControl(key, altKey, ctrlKey, shiftKey) {
		function moveCursor(offset) {
			const direction = offset > 0 ? 'next' : offset < 0 ? 'previous' : undefined;
			if (direction) offset = Math.abs(offset); else return;
			if (selectedRow instanceof HTMLLIElement) selection = selectedRow; else {
				selection = ul.querySelector(':scope > li:first-of-type');
				--offset;
			}
			while (offset-- > 0) {
				const cursor = selection[direction + 'ElementSibling'];
				if (cursor != null) selection = cursor; else break;
			}
		}

		if (!altKey) switch (key) {
			case 'Escape': dialog.close(); return true;
			case 'Enter': if (selectedRow instanceof HTMLLIElement) buttons[0].click(); return false;
			case 'Home': var selection = ul.querySelector(':scope > li:first-of-type'); break;
			case 'PageUp': moveCursor(-Math.round(ul.offsetHeight / 156)); break;
			case 'ArrowUp': moveCursor(-1); break;
			case 'ArrowDown': moveCursor(+1); break;
			case 'PageDown': moveCursor(+Math.round(ul.offsetHeight / 156)); break;
			case 'End': selection = ul.querySelector(':scope > li:last-of-type'); break;
			default: return true;
		} else switch (key) {
			case 'c': {
				var elem = form.elements.namedItem('update-image');
				if (elem) elem.checked = !elem.checked;
				return false;
			}
			default: return true;
		}
		if (selection == selectedRow) return false;
		if (selectedRow != null) selectedRow.style.backgroundColor = null;
		selection.style.backgroundColor = '#066';
		(selectedRow = selection).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		buttons[0].disabled = false;
		return false;
	}

	console.assert(searchResults.length > 0);
	let selectedRow = null, dialog = document.createElement('DIALOG');
	dialog.innerHTML = `
<form method="dialog" style="padding: 10pt; background-color: gray;">
	<div style="margin-bottom: 10pt; padding: 4px; background-color: #111; box-shadow: 1pt 1pt 5px #bbb inset;">
		<ul id="bandcamp-search-results" style="list-style-type: none; width: 645px; max-height: 75vh; overflow-y: auto; overscroll-behavior-y: none; scrollbar-gutter: stable; scroll-behavior: auto; scrollbar-color: #444 #222;" />
	</div>
	<input value="Import" type="button" disabled />
	<input value="Cancel" type="button" style="margin-left: 5pt;" />
	<div style="display: inline-block; margin-left: 15pt;">
		<label style="border: 2px groove black; padding: 3pt 3pt 3pt 4pt;">
			<input name="update-tags" style="margin-right: 4pt;" type="checkbox" />Tags
			<label style="margin-left: 5pt;"><input style="margin-right: 4pt;" name="preserve-tags" type="checkbox" />Preserve</label>
		</label>
		<label style="margin-left: 5pt; border: 2px groove black; padding: 3pt 3pt 3pt 4pt;">
			<input style="margin-right: 4pt;" name="update-image" type="checkbox" />Cover
		</label>
		<label style="margin-left: 4pt;border: 2px groove black; padding: 3pt 3pt 3pt 4pt;">
			<input style="margin-right: 4pt;" name="update-description" type="checkbox" />Description
			<label style="margin-left: 5pt;"><input style="margin-right: 4pt;" name="insert-about" type="checkbox" />About</label>
			<label style="margin-left: 5pt;"><input style="margin-right: 4pt;" name="insert-credits" type="checkbox" />Credits</label>
			<label style="margin-left: 5pt;"><input style="margin-right: 4pt;" name="insert-url" type="checkbox" />URL</label>
		</label>
	</div>
</form>`.replace(/\r?\n[^\S\r\n]*/g, '');
	const form = dialog.querySelector(':scope > form');
	console.assert(form != null);
	dialog.style = 'position: fixed; top: 0; left: 0; margin: auto; box-shadow: 5px 5px 10px; z-index: 99999;';
	dialog.oncancel = evt => { reject('Cancelled') };
	dialog.onclose = function(evt) {
		[document.body.onkeydown, document.body.onkeyup] = keyHandlers;
		if (!evt.currentTarget.returnValue) reject('Cancelled');
		document.body.removeChild(evt.currentTarget);
	};
	dialog.onclick = function(evt) {
		if (evt.target != evt.currentTarget) return true;
		evt.currentTarget.close();
		return false;
	};
	const ul = dialog.querySelector('ul#bandcamp-search-results'), buttons = dialog.querySelectorAll('input[type="button"]');
	ul.scrollTop = 0;
	for (let li of searchResults) {
		for (let a of li.getElementsByTagName('A')) {
			a.onclick = evt => { if (!evt.ctrlKey && !evt.shiftKey) return false };
			a.search = '';
		}
		for (let styleSheet of [
			['.searchresult .art img', 'max-height: 145px; max-width: 145px;'],
			['.result-info', 'display: inline-block; color: white; padding: 1pt 10pt; box-sizing: border-box; vertical-align: top; width: 475px; line-height: 1.4em;'],
			['.itemtype', 'font-size: 10px; color: #999; margin-bottom: 0.5em; padding: 0;'],
			['.heading', 'font-size: 16px; margin-bottom: 0.1em; padding: 0;'],
			['.subhead', 'font-size: 13px; margin-bottom: 0.3em; padding: 0;'],
			['.released', 'font-size: 11px; padding: 0;'],
			['.itemurl', 'font-size: 11px; padding: 0;'],
			['.itemurl a', 'color: #84c67d;'],
			['.tags', 'color: #aaa; font-size: 11px; padding: 0;'],
		]) for (let elem of li.querySelectorAll(styleSheet[0])) elem.style = styleSheet[1];
		li.style = 'cursor: pointer; margin: 0; padding: 4px;';
		for (let child of li.children) child.style.display = 'inline-block';
		let confidence = 1;
		let [itemType, numTracks, releaseYear] = ['div.itemtype', 'div.length', 'div.released'].map(sel => li.querySelector(sel));
		if (itemType != null) itemType = itemType.textContent.trim().toLowerCase();
		if (releaseYear != null && (releaseYear = /\b(\d{4})\b/.exec(releaseYear.textContent)) != null) releaseYear = parseInt(releaseYear[1]);
		if (itemType == 'track') numTracks = 1;
		else if (numTracks != null && (numTracks = /\b(\d+)\s+(?:tracks?)\b/i.exec(numTracks.textContent)) != null)
			numTracks = parseInt(numTracks[1]);
		if (releaseYear > 0 && torrentGroup.group.year > releaseYear) confidence *= 1/2;
		else if ('torrents' in torrentGroup && torrentGroup.torrents.length > 0) {
			if (releaseYear > 0 && !torrentGroup.torrents.some(torrent =>
					!(torrent.remasterYear > 0) || torrent.remasterYear == releaseYear)) confidence *= 3/4;
			if (numTracks > 0 && !torrentGroup.torrents.some(function(torrent) {
				const audioFileCount = torrent.fileList ? torrent.fileList.split('|||').filter(file =>
					/^(.+\.(?:flac|mp3|m4[ab]|aac|dts(?:hd)?|truehd|ac3|ogg|opus|wv|ape))\{{3}(\d+)\}{3}$/i.test(file)).length : 0;
				return !(audioFileCount > 0) || audioFileCount == numTracks;
			})) confidence *= 3/4;
		}
		if (confidence < 1) li.style.opacity = confidence;
		li.onclick = function(evt) {
			if (evt.currentTarget == selectedRow) return false;
			if (selectedRow != null) selectedRow.style.backgroundColor = null;
			(selectedRow = evt.currentTarget).style.backgroundColor = '#066';
			buttons[0].disabled = false;
			return false;
		};
		li.ondblclick = evt => (buttons[0].click(), false);
	}
	for (let li of searchResults.sort(function(a, b) {
		const getConfidence = li => parseFloat(li.style.opacity) || 1;
		const getItemType = li => ['track', 'album']
			.indexOf((li = li.querySelector('div.itemtype')) != null && li.textContent.trim().toLowerCase());
		return getConfidence(b) - getConfidence(a) || getItemType(b) - getItemType(a);
	})) ul.append(li);
	buttons[0].onclick = function(evt) {
		evt.currentTarget.disabled = true;
		console.assert(selectedRow instanceof HTMLLIElement);
		const a = selectedRow.querySelector('div.result-info > div.heading > a');
		if (a != null) GlobalXHR.get(a).then(function({document}) {
			function safeParse(serialized) {
				if (serialized) try { return JSON.parse(serialized) } catch (e) { console.warn('BC meta invalid: %s', e, serialized) }
				return null;
			}

			const savePreset = (prefName, inputName) => { GM_setValue(prefName, form.elements[inputName].checked) };
			savePreset('update_tags', 'update-tags');
			GM_setValue('preserve_tags', form.elements['preserve-tags'].checked ? 1 : 0);
			savePreset('update_image', 'update-image');
			savePreset('update_description', 'update-description');
			savePreset('description_insert_about', 'insert-about');
			savePreset('description_insert_credits', 'insert-credits');
			savePreset('description_insert_url', 'insert-url');

			const details = { };
			let elem = document.head.querySelector(':scope > script[type="application/ld+json"]');
			const releaseMeta = elem && safeParse(elem.text);
			const tralbum = (elem = document.head.querySelector('script[data-tralbum]')) && safeParse(elem.dataset.tralbum);
			if (tralbum && Array.isArray(tralbum.packages) && tralbum.packages.length > 0) for (let key in tralbum.packages[0])
				if (!tralbum.current[key] && tralbum.packages.every(pkg => pkg[key] == tralbum.packages[0][key]))
					tralbum.current[key] = tralbum.packages[0][key];
			if (releaseMeta != null && releaseMeta.byArtist) details.artist = releaseMeta.byArtist.name;
			if (releaseMeta != null && releaseMeta.name) details.title = releaseMeta.name;
			if (releaseMeta != null && releaseMeta.numTracks) details.numTracks = releaseMeta.numTracks;
			if (releaseMeta != null && releaseMeta.datePublished) details.releaseDate = new Date(releaseMeta.datePublished);
			else if (tralbum != null && tralbum.current.album_publish_date) details.releaseDate = new Date(tralbum.current.album_publish_date);
			if (releaseMeta != null && releaseMeta.publisher) details.publisher = releaseMeta.publisher.name;
			if (tralbum != null && tralbum.current.upc) details.upc = tralbum.current.upc;
			if (releaseMeta != null && releaseMeta.image) details.image = releaseMeta.image;
			else if ((elem = document.head.querySelector('meta[property="og:image"][content]')) != null) details.image = elem.content;
			else if ((elem = document.querySelector('div#tralbumArt > a.popupImage')) != null) details.image = elem.href;
			if (details.image) details.image = details.image.replace(/_\d+(?=\.\w+$)/, '_10');
			details.tags = releaseMeta != null && Array.isArray(releaseMeta.keywords) ? new TagManager(...releaseMeta.keywords)
				: new TagManager(...Array.from(document.querySelectorAll('div.tralbum-tags > a.tag'), a => a.textContent.trim()));
			if (details.tags.length < 0) delete details.tags;
			if (tralbum != null && tralbum.current.minimum_price <= 0) details.tags.add('freely.available');
			if (releaseMeta != null && releaseMeta.description) details.description = releaseMeta.description;
			else if (tralbum != null && tralbum.current.about) details.description = tralbum.current.about;
			if (details.description) details.description = stripText(details.description)
				.replace(/^24[^\S\n]*bits?[^\S\n]*\/[^\S\n]*\d+(?:\.\d+)?[^\S\n]*k(?:Hz)?$\n+/m, '');
			if (releaseMeta != null && releaseMeta.creditText) details.credits = tralbum.current.credits;
			else if (tralbum != null && tralbum.current.credits) details.credits = tralbum.current.credits;
			if (details.credits) details.credits = stripText(details.credits);
			if (releaseMeta != null && releaseMeta.mainEntityOfPage) details.url = releaseMeta.mainEntityOfPage;
			else if (tralbum != null && tralbum.url) details.url = tralbum.url;
			if (tralbum != null && tralbum.art_id) details.artId = tralbum.art_id;
			if (tralbum != null && tralbum.current.album_id) details.id = tralbum.current.album_id;
			resolve(details);
		}, reject); else reject('Assertion failed: BC release link not found');
		dialog.close(a != null ? a.href : '');
	};
	buttons[1].onclick = evt => { dialog.close() };
	let keyHandlers = [document.body.onkeydown, document.body.onkeyup], keyDown = false;
	[document.body.onkeydown, document.body.onkeyup] = [function(evt) {
		if (!keyDown) keyDown = true; else kbdControl(evt.key, evt.altKey, evt.ctrlKey, evt.shiftKey);
		return false;
	}, function(evt) {
		keyDown = false;
		return kbdControl(evt.key, evt.altKey, evt.ctrlKey, evt.shiftKey);
	}];

	const loadPreset = (inputName, presetName, presetDefault) =>
		{ form.elements[inputName].checked = GM_getValue(presetName, presetDefault) };
	loadPreset('update-tags', 'update_tags', true);
	form.elements['update-tags'].onchange = function(evt) {
		form.elements['preserve-tags'].disabled = !evt.currentTarget.checked;
	};
	form.elements['update-tags'].dispatchEvent(new Event('change'));
	form.elements['preserve-tags'].checked = GM_getValue('preserve_tags', 0) > 0;
	loadPreset('update-image', 'update_image', true);
	loadPreset('update-description', 'update_description', true);
	form.elements['update-description'].onchange = function(evt) {
		form.elements['insert-about'].disabled = form.elements['insert-credits'].disabled =
			form.elements['insert-url'].disabled = !evt.currentTarget.checked;
	};
	form.elements['update-description'].dispatchEvent(new Event('change'));
	loadPreset('insert-about', 'description_insert_about', true);
	loadPreset('insert-credits', 'description_insert_credits', true);
	loadPreset('insert-url', 'description_insert_url', true);

	document.body.append(dialog);
	dialog.showModal();
	ul.focus();
}));

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

function importToBody(bcReleaseDetails, body) {
	function insertSection(section, afterBegin = true, beforeLinks = true, beforeEnd = true) {
		if (section) if (!body) body = section;
		else if (afterBegin && rx.afterBegin.some(rx => rx.test(body)))
			body = RegExp.lastMatch + section + '\n\n' + RegExp.rightContext.trimLeft();
		else if (beforeLinks && rx.beforeLinks.test('\n' + body))
			body = (RegExp.leftContext + '\n\n').trimLeft() + section + '\n\n' + RegExp.lastMatch.trimLeft();
		else if (beforeEnd && rx.beforeEnd.some(rx => rx.test(body)))
			body = RegExp.leftContext.trimRight() + '\n\n' + section + RegExp.lastMatch.trimLeft();
		else body += '\n\n' + section;
	}

	const spamFilter = description => description && (description.length >= 180
		&& !/\b(?:Buy|Bookings?|(?:Pre)?Orders?|Sales|Purchases?|Store|Tickets|sold out|please visit|available (?:at|on|here)|Physical (?:album|copy|media)|\d+\s+copies|Take a look|Download|Track\s?list(?:ing)?|(?:facebook|soundcloud|bandcamp|twitter|myspace|instagram|residentadvisor|youtube)\.com)\b/im.test(description)
		|| confirm('Release about supposedly contains spammy content, insert anyway?\n\nAbout excerpt:\n\n' + (maxLength =>
			description.length > maxLength ? description.slice(0, maxLength) + '...' : description)(1500)));
	body = stripText(body);
	const rx = {
		afterBegin: [/^\[pad=\d+\|\d+\]/i, /^Releas(?:ing|ed) .+\d{4}$(?:\r?\n){2,}/im],
		beforeLinks: /(?:(?:\r?\n)+(?:(?:More info(?:rmation)?:|\[b\]More info(?:rmation)?:\[\/b\])[^\S\r\n]+)?(?:\[url(?:=[^\[\]]+)?\].+\[\/url\]|https?:\/\/\[^\s\[\]]+))+(?:\[\/size\]\[\/pad\])?$/i,
		beforeEnd: [/\[\/size\]\[\/pad\]$/i],
	};
	if (bcReleaseDetails.description && bcReleaseDetails.description.length > 10
			&& ![ ].some(rx => rx.test(bcReleaseDetails.description))
			&& GM_getValue('description_insert_about', true) && !body.includes(bcReleaseDetails.description)
		 	&& spamFilter(bcReleaseDetails.description))
		insertSection('[quote][plain]' + bcReleaseDetails.description + '[/plain][/quote]', true, true, true);
	if (document.location.pathname != '/requests.php' && bcReleaseDetails.credits && bcReleaseDetails.credits.length > 10
			&& ![/^\s*released\b.{0,20}\s*$/i].some(rx => rx.test(bcReleaseDetails.credits))
			&& GM_getValue('description_insert_credits', true) && !body.includes(bcReleaseDetails.credits))
		insertSection('[hide=Credits][plain]' + bcReleaseDetails.credits + '[/plain][/hide]', false, true, true);
	if (bcReleaseDetails.url && GM_getValue('description_insert_url', true) && !body.includes(bcReleaseDetails.url))
		insertSection('[url=' + bcReleaseDetails.url + ']Bandcamp[/url]', false, false, true);
	return body.replace(/(\[\/quote\])(?:\r?\n){2,}/ig, '$1\n');
}

function getGroupId(root) {
	if (root instanceof HTMLElement) for (let a of root.getElementsByTagName('A')) {
		if (a.origin != document.location.origin || a.pathname != '/torrents.php') continue;
		a = new URLSearchParams(a.search);
		if (a.has('id') && !a.has('action') && (a = parseInt(a.get('id'))) > 0) return a;
	}
	console.warn('[Cover Inspector] Failed to find group id:', root);
}

const urlParams = new URLSearchParams(document.location.search);
const maxOpenTabs = GM_getValue('max_open_tabs', 25), autoCloseTimeout = GM_getValue('tab_auto_close_timeout', 0);
const tabsQueueRecovery = [ ];
let openedTabs = [ ], lastOnQueue;

function openTabLimited(endpoint, params, hash) {
	function updateQueueInfo() {
		const id = 'waiting-tabs-counter';
		let counter = document.getElementById(id);
		if (counter == null) {
			if (tabsQueueRecovery.length <= 0) return;
			const queueInfo = document.createElement('DIV');
			queueInfo.style = `
position: fixed; left: 10pt; bottom: 10pt; padding: 5pt; z-index: 999;
font-size: 8pt; color: white; background-color: sienna;
border: thin solid black; box-shadow: 2pt 2pt 5pt black; cursor: default;
`;
			const tooltip = 'By closing this tab the queue will be discarded';
			if (typeof jQuery.fn.tooltipster == 'function') $(queueInfo).tooltipster({ content: tooltip });
				else queueInfo.title = tooltip;
			counter = document.createElement('SPAN');
			counter.id = id;
			counter.style.fontWeight = 'bold';
			queueInfo.append(counter, ' release group(s) queued to view');
			document.body.append(queueInfo);
		} else if (tabsQueueRecovery.length <= 0) {
			document.body.removeChild(counter.parentNode);
			return;
		}
		counter.textContent = tabsQueueRecovery.length;
	}

	if (typeof GM_openInTab != 'function') return Promise.reject('Not supported');
	if (!endpoint) return Promise.reject('Invalid argument');
	const saveQueue = () => localStorage.setItem('coverInspectorTabsQueue', JSON.stringify(tabsQueueRecovery));
	let recoveryEntry;
	if (maxOpenTabs > 0) {
		tabsQueueRecovery.push(recoveryEntry = { endpoint: endpoint, params: params || null, hash: hash || '' });
		if (openedTabs.length >= maxOpenTabs) updateQueueInfo();
		saveQueue();
	}
	const waitFreeSlot = () => (maxOpenTabs > 0 && openedTabs.length >= maxOpenTabs ?
			Promise.race(openedTabs.map(tabHandler => new Promise(function(resolve) {
		console.assert(!tabHandler.closed);
		if (!tabHandler.closed) tabHandler.resolver = resolve; //else resolve(tabHandler);
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
		if (maxOpenTabs > 0) {
			const index = tabsQueueRecovery.indexOf(recoveryEntry);
			console.assert(index >= 0);
			if (index >= 0) tabsQueueRecovery.splice(index, 1);
			updateQueueInfo();
			saveQueue();
		}
		return tabHandler;
	});
	return (lastOnQueue = lastOnQueue instanceof Promise ? lastOnQueue.then(waitFreeSlot) : waitFreeSlot());
}

const autoOpenSucceed = GM_getValue('auto_open_succeed', true);
const openTabParams = { }, tabData = { torrentGroups: { } };
if (GM_getValue('view_group_presearch_bandcamp', true)) openTabParams['presearch-bandcamp'] = 1;
function openGroup(torrentGroup) {
	if (!torrentGroup) throw 'Invalid argument';
	if (!(torrentGroup.group.id > 0)) return null;
	tabData.torrentGroups[torrentGroup.group.id] = torrentGroup;
	GM_saveTab(tabData);
	return openTabLimited('torrents', Object.assign({ id: torrentGroup.group.id }, openTabParams));
}

// Crash recovery
if ('bcTabsQueue' in localStorage) try {
	const savedQueue = JSON.parse(localStorage.getItem('bcTabsQueue'));
	if (Array.isArray(savedQueue) && savedQueue.length > 0) {
		GM_registerMenuCommand('Restore open tabs queue', function() {
			if (!confirm('Process saved queue? (' + savedQueue.length + ' tabs to open)')) return;
			for (let queuedEntry of savedQueue) openTabLimited(queuedEntry.endpoint, queuedEntry.params, queuedEntry.hash);
		});
		GM_registerMenuCommand('Load saved queue for later', function() {
			if (confirm('Saved queue (' + savedQueue.length + ' tabs to open) will be prepended to current, continue?'))
				tabsQueueRecovery = savedQueue.concat(tabsQueueRecovery);
		});
	}
} catch(e) { console.warn(e) }

function checkSavedRecovery() {
	if ('bcTabsQueue' in localStorage) try {
		const savedQueue = JSON.parse(localStorage.getItem('bcTabsQueue'));
		if (!Array.isArray(savedQueue) || savedQueue.length <= 0) return true;
		const unloadedCount = savedQueue.filter(item1 => !tabsQueueRecovery.some(function(item2) {
			if (item1.endpoint != item2.endpoint || item1.hash != item2.hash) return false;
			if ((item1.params == null) != (item2.params == null)) return false;
			return item1.params == null || Object.keys(item1.params).every(key => item2[key] == item1[key])
				&& Object.keys(item2.params).every(key => item1[key] == item2[key]);
		})).length;
		if (unloadedCount <= 0) return true;
		return confirm('Saved queue (' + (unloadedCount < savedQueue.length ? unloadedCount + '/' + savedQueue.length
			: savedQueue.length) + ' tabs to open) will be lost, continue?');
	}catch(e) { console.warn(e) }
	return true;
}

let noEditPerms = document.getElementById('nav_userclass');
noEditPerms = noEditPerms != null && ['User', 'Member', 'Power User'].includes(noEditPerms.textContent.trim());

switch (document.location.pathname) {
	case '/torrents.php': {
		if (noEditPerms) break;
		const groupId = parseInt(urlParams.get('id'));
		if (!(groupId > 0)) throw 'Invalid group id';
		if (typeof GM_getTabs == 'function') GM_getTabs(function(tabs) {
			for (let tab in tabs) if ((tab = tabs[tab]) && 'torrentGroups' in tab) try {
				if (!(tab = tab.torrentGroups[groupId])) continue;
				console.info('Torrent group %d found in tabs data', groupId);
				unsafeWindow.torrentGroup = tab;
				unsafeWindow.dispatchEvent(Object.assign(new Event('torrentGroup'), { data: tab }));
			} catch (e) { console.warn(e) }
		});
		if (document.querySelector('div.sidebar > div.box_artists') == null) break; // Nothing to do here - not music torrent
		const linkBox = document.body.querySelector('div.header > div.linkbox');
		if (linkBox == null) throw 'LinkBox not found';
		const a = document.createElement('A');
		a.textContent = 'Bandcamp import';
		a.href = '#';
		a.title = 'Import album textual description, tags and cover image from Bandcamp release page (Ctrl+F9)';
		a.className = 'brackets';
		a.onclick = function(evt) {
			if (!this.disabled) this.disabled = true; else return false;
			this.style.color = 'orange';
			queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup => fetchBandcampDetails(torrentGroup).then(function(bcRelease) {
				const updateWorkers = [ ];
				if (bcRelease.tags instanceof TagManager && GM_getValue('update_tags', true) && bcRelease.tags.length > 0) {
					const releaseTags = Array.from(document.body.querySelectorAll('div.box_tags ul > li'), function(li) {
						const tag = { name: li.querySelector(':scope > a'), id: li.querySelector('span.remove_tag > a') };
						if (tag.name != null) tag.name = tag.name.textContent.trim();
						if (tag.id != null) tag.id = parseInt(new URLSearchParams(tag.id.search).get('tagid'));
						return tag.name && tag.id ? tag : null;
					}).filter(Boolean);
					let bcTags = [ ];
					if (torrentGroup.group.musicInfo) for (let importance of Object.keys(torrentGroup.group.musicInfo))
						if (Array.isArray(torrentGroup.group.musicInfo[importance]))
							Array.prototype.push.apply(bcTags, torrentGroup.group.musicInfo[importance].map(artist => artist.name));
					if (Array.isArray(torrentGroup.torrents)) for (let torrent of torrentGroup.torrents) {
						if (!torrent.remasterRecordLabel) continue;
						const labels = torrent.remasterRecordLabel.split('/').map(label => label.trim());
						if (labels.length > 0) {
							Array.prototype.push.apply(bcTags, labels);
							Array.prototype.push.apply(bcTags, labels.map(function(label) {
								const bareLabel = label.replace(/(?:\s+(?:under license.+|Records|Recordings|(?:Ltd|Inc)\.?))+$/, '');
								if (bareLabel != label) return bareLabel;
							}).filter(Boolean));
						}
					}
					bcTags = new TagManager(...bcTags);
					bcTags = Array.from(bcRelease.tags).filter(tag => !bcTags.includes(tag));
					if (bcTags.length > 0 && (releaseTags.length <= 0 || !(Number(GM_getValue('preserve_tags', 0)) > 1)))
							updateWorkers.push(getVerifiedTags(bcTags, 3).then(function(verifiedBcTags) {
						if (verifiedBcTags.length <= 0) return false;
						let userAuth = document.body.querySelector('input[name="auth"][value]');
						if (userAuth != null) userAuth = userAuth.value; else throw 'Failed to capture user auth';
						const updateWorkers = [ ];
						const addTags = verifiedBcTags.filter(tag => !releaseTags.map(tag => tag.name).includes(tag));
						if (addTags.length > 0) Array.prototype.push.apply(updateWorkers, addTags.map(tag => LocalXHR.post('/torrents.php', new URLSearchParams({
							action: 'add_tag',
							groupid: torrentGroup.group.id,
							tagname: tag,
							auth: userAuth,
						}), { responseType: null })));
						const deleteTags = releaseTags.filter(tag => !verifiedBcTags.includes(tag.name)).map(tag => tag.id);
						if (deleteTags.length > 0 && !(Number(GM_getValue('preserve_tags', 0)) > 0))
								Array.prototype.push.apply(updateWorkers, deleteTags.map(tagId => LocalXHR.get('/torrents.php?' + new URLSearchParams({
							action: 'delete_tag',
							groupid: torrentGroup.group.id,
							tagid: tagId,
							auth: userAuth,
						}), { responseType: null })));
						return updateWorkers.length > 0 ? Promise.all(updateWorkers.map(updateWorker =>
								updateWorker.then(responseCode => true, reason => reason))).then(function(results) {
							if (results.some(result => result === true)) return results;
							return Promise.reject(`All of ${results.length} tag update workers failed (see browser console for more details)`);
						}) : false;
					}));
				}
				const rehostWorker = bcRelease.image && GM_getValue('update_image', true) ?
					imageHostHelper.then(ihh => ihh.rehostImageLinks([bcRelease.image])
						.then(ihh.singleImageGetter)).catch(reason => bcRelease.image) : Promise.resolve(null);
				if (ajaxApiKey) {
					let origBody = document.createElement('TEXTAREA');
					origBody.innerHTML = torrentGroup.group.bbBody;
					const body = importToBody(bcRelease, (origBody = origBody.textContent)), formData = new FormData;
					updateWorkers.push(rehostWorker.then(function(rehostedImageUrl) {
						const updateImage = rehostedImageUrl != null && (!torrentGroup.group.wikiImage || !GM_getValue('preserve_image', false))
							&& rehostedImageUrl != torrentGroup.group.wikiImage;
						if (updateImage || GM_getValue('update_description', true) && body != origBody.trim()) {
							if (updateImage) formData.set('image', rehostedImageUrl);
							if (GM_getValue('update_description', true) && body != origBody) formData.set('body', body);
							formData.set('summary', 'Additional description/cover image import from Bandcamp');
							return queryAjaxAPI('groupedit', { id: torrentGroup.group.id }, formData).then(function(response) {
								console.log(response);
								return true;
							});
						} else return false;
					}));
				} else {
					updateWorkers.push(LocalXHR.get('/torrents.php?' + new URLSearchParams({
						action: 'editgroup',
						groupid: torrentGroup.group.id,
					})).then(function({document}) {
						const editForm = document.querySelector('form.edit_form');
						if (editForm == null) throw 'Edit form not exists';
						const formData = new FormData(editForm);
						const image = editForm.elements.namedItem('image').value, origBody = editForm.elements.namedItem('body').value;
						const body = importToBody(bcRelease, origBody);
						return rehostWorker.then(function(resolvedImageUrl) {
							const updateImage = resolvedImageUrl != null && (!image || !GM_getValue('preserve_image', false))
								&& resolvedImageUrl != image;
							if (updateImage || GM_getValue('update_description', true) && body != origBody.trim()) {
								if (updateImage) formData.set('image', resolved[1]);
								if (GM_getValue('update_description', true) && body != origBody) formData.set('body', body);
								formData.set('summary', 'Additional description/cover image import from Bandcamp');
								return LocalXHR.post('/torrents.php', formData, { responseType: null }).then(status => true);
							} else return false;
						});
					}));
					if (document.domain == 'redacted.sh' && !(GM_getValue('red_nag_shown', 0) >= 3)) {
						const cpLink = new URL('/user.php?action=edit#api_key_settings', document.location.origin);
						let userId = document.body.querySelector('#userinfo_username a.username');
						if (userId != null) userId = parseInt(new URLSearchParams(userId.search).get('id'));
						if (userId > 0) cpLink.searchParams.set('userid', userId);
						alert('Please consider generating your personal API token (' + cpLink.href + ')\nSet up as "redacted_api_key" script storage entry');
						GM_setValue('red_nag_shown', GM_getValue('red_nag_shown', 0) + 1 || 1);
						// updateWorkers.push(LocalXHR.get('/user.php?' + URLSearchParams({ action: 'edit', userid: userId })).then(function({document}) {
						// 	const form = document.body.querySelector('form#userform');
						// 	if (form == null) throw 'User form not found';
						// 	const formData = new FormData(form), newApiKey = formData.get('new_api_key');
						// 	if (newApiKey) formData.set('confirmapikey', 'on'); else throw 'API key not exist';
						// 	formData.set('api_torrents_scope', 'on');
						// 	for (let name of ['api_user_scope', 'api_requests_scope', 'api_forums_scope', 'api_wiki_scope']) formData.delete(name);
						// 	return LocalXHR.post('/user.php', formData, { responseType: null }).then(status => newApiKey);
						// }).then(function(newApiKey) {
						// 	GM_setValue('redacted_api_key', newApiKey);
						// 	alert('Your personal API key [' + newApiKey + '] was successfulloy created and saved');
						// 	return false;
						// }));
					}
				}
				if (updateWorkers.length > 0) return Promise.all(updateWorkers.map(updateWorker =>
						updateWorker.then(response => Boolean(response), function(reason) {
					console.warn('Update worker failed with reason ' + reason);
					return reason;
				}))).then(function(results) {
					if (results.filter(Boolean).length > 0 && !results.some(result => result === true))
						return Promise.reject(`All of ${results.length} update workers failed (see browser console for more details)`);
					if (results.some(result => result === true)) return (document.location.reload(), true);
				});
			})).catch(reason => { if (!['Cancelled'].includes(reason)) alert(reason) }).then(status => {
				this.style.color = status ? 'springgreen' : null;
				this.disabled = false;
			});
			return false;
		};
		linkBox.append(' ', a);
		document.body.addEventListener('keyup', function(evt) {
			if (!evt.ctrlKey || evt.key != 'F9') return true;
			a.click();
			return false;
		});

		const findSharedTorrentGroup = () => new Promise(function(resolve, reject) {
			if ('torrentGroup' in unsafeWindow) if (unsafeWindow.torrentGroup) resolve(unsafeWindow.torrentGroup)
				else reject('Assertion failed: void unsafeWindow.torrentGroup');
			else {
				function listener(evt) {
					clearTimeout(timeout);
					unsafeWindow.removeEventListener('torrentGroup', listener);
					if (evt.data) resolve(evt.data); else if (unsafeWindow.torrentGroup) resolve(unsafeWindow.torrentGroup);
						else reject('Assertion failed: void unsafeWindow.torrentGroup');
				}

				unsafeWindow.addEventListener('torrentGroup', listener);
				const timeout = setTimeout(function() {
					unsafeWindow.removeEventListener('torrentGroup', listener);
					reject('torrentGroup monitor timed out');
				}, GM_getValue('tab_data_timeout', 2500));
			}
		});
		if (urlParams.has('presearch-bandcamp')) findSharedTorrentGroup().catch(function(reason) {
			console.log(reason);
			return queryAjaxAPICached('torrentgroup', { id: groupId }, true);
		}).then(matchingResultsCount).then(function(matchedCount) {
			a.style.fontWeight = 'bold';
			a.title += `\n\n${matchedCount} possibly matching release(s)`;
		}, reason => { a.style.color = 'gray' });
		break;
	}
	case '/upload.php':
		if (urlParams.has('groupid')) break;
	case '/requests.php': {
		function hasStyleSheet(name) {
			if (name) name = name.toLowerCase(); else throw 'Invalid argument';
			const hrefRx = new RegExp('\\/' + name + '\\b', 'i');
			if (document.styleSheets) for (let styleSheet of document.styleSheets)
				if (styleSheet.title && styleSheet.title.toLowerCase() == name) return true;
					else if (styleSheet.href && hrefRx.test(styleSheet.href)) return true;
			return false;
		}
		function checkFields() {
			const visible = ['0', 'Music'].includes(categories.value) && title.value.length > 0;
			if (container.hidden != !visible) container.hidden = !visible;
			if (visible && timer != undefined) {
				clearInterval(timer);
				timer = undefined;
			}
		}

		const categories = document.getElementById('categories');
		if (categories == null) throw 'Categories select not found';
		const form = document.getElementById('upload_table') || document.getElementById('request_form');
		if (form == null) throw 'Main form not found';
		let title = form.elements.namedItem('title');
		if (title != null) title.addEventListener('input', checkFields); else throw 'Title select not found';
		const dynaForm = document.getElementById('dynamic_form');
		if (dynaForm != null) new MutationObserver(function(ml, mo) {
			for (let mutation of ml) if (mutation.addedNodes.length > 0) {
				if (title != null) title.removeEventListener('input', checkFields);
				if ((title = document.getElementById('title')) != null) title.addEventListener('input', checkFields);
					else throw 'Assertion failed: title input not found!';
				container.hidden = true;
			}
		}).observe(dynaForm, { childList: true });
		let timer;
		if (GM_getValue('watch_input_by_timer', true)) timer = setInterval(checkFields, 1000);
		const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light', '2iUn3'].some(hasStyleSheet);
		if (isLightTheme) console.log('Light Gazelle theme detected');
		const isDarkTheme = ['kuro', 'minimal', 'red_dark', 'Vinyl'].some(hasStyleSheet);
		if (isDarkTheme) console.log('Dark Gazelle theme detected');
		const container = document.createElement('DIV');
		container.style = 'position: fixed; top: 64pt; right: 10pt; padding: 5pt; border-radius: 50%; z-index: 999;';
		container.style.backgroundColor = `#${isDarkTheme ? '2f4f4f' : 'b8860b'}80`;
		const bcButton = document.createElement('BUTTON'), img = document.createElement('IMG');
		bcButton.id = 'import-from-bandcamp';
		bcButton.style = `
padding: 10px; color: white; background-color: white; cursor: pointer;
border: none; border-radius: 50%; transition: background-color 200ms;
`;
		bcButton.dataset.backgroundColor = bcButton.style.backgroundColor;
		bcButton.setDisabled = function(disabled = true) {
			this.disabled = disabled;
			this.style.opacity = disabled ? 0.5 : 1;
			this.style.cursor = disabled ? 'not-allowed' : 'pointer';
		};
		bcButton.onclick = function(evt) {
			this.setDisabled(true);
			this.style.backgroundColor = 'red';
			const torrentGroup = { group: {
				name: title.value,
				musicInfo: { },
				releaseType: parseInt(form.elements.namedItem('releasetype').value),
			} };
			for (let artist of form.querySelectorAll('input[name="artists[]"]')) {
				const importance = ['artists', 'with', 'composers', 'conductor', 'dj', 'remixedby', 'producer']
					[parseInt(artist.nextElementSibling.value) - 1];
				if (!importance || !(artist = artist.value.trim())) continue;
				if (!(importance in torrentGroup.group.musicInfo)) torrentGroup.group.musicInfo[importance] = [ ];
				torrentGroup.group.musicInfo[importance].push({ name: artist });
			}
			let remasterYear = form.elements.namedItem('remaster_year');
			if (remasterYear != null) torrentGroup.year = parseInt(form.elements.namedItem('year').value);
			else remasterYear = form.elements.namedItem('year');
			if (remasterYear != null) torrentGroup.torrents = [{ remasterYear: parseInt(remasterYear.value) }];
			fetchBandcampDetails(torrentGroup).then(function(bcRelease) {
				const tags = form.elements.namedItem('tags'), image = form.elements.namedItem('image'),
							description = form.elements.namedItem('album_desc') || form.elements.namedItem('description');
				if (tags != null && bcRelease.tags instanceof TagManager && bcRelease.tags.length > 0 && GM_getValue('update_tags', true)
						&& (!tags.value || !(Number(GM_getValue('preserve_tags', 0)) > 1))) {
					let bcTags = Array.from(form.querySelectorAll('input[name="artists[]"]'), input => input.value.trim()).filter(Boolean);
					let labels = form.elements.namedItem('remaster_record_label') || form.elements.namedItem('record_label');
					if (labels != null && (labels = labels.value.trim().split('/').map(label => label.trim())).length > 0) {
						Array.prototype.push.apply(bcTags, labels);
						Array.prototype.push.apply(bcTags, labels.map(function(label) {
							const bareLabel = label.replace(/(?:\s+(?:under license.+|Records|Recordings|(?:Ltd|Inc)\.?))+$/, '');
							if (bareLabel != label) return bareLabel;
						}).filter(Boolean));
					}
					bcTags = new TagManager(...bcTags);
					bcTags = Array.from(bcRelease.tags).filter(tag => !bcTags.includes(tag));
					getVerifiedTags(bcTags).then(function(bcVerifiedTags) {
						if (bcVerifiedTags.length <= 0) return;
						if (Number(GM_getValue('preserve_tags', 0)) > 0) {
							const mergedTags = new TagManager(tags.value, ...bcVerifiedTags);
							tags.value = mergedTags.toString();
						} else tags.value = bcVerifiedTags.join(', ');
					});
				}
				if (image != null && bcRelease.image && GM_getValue('update_image', true) && (!image.value || !GM_getValue('preserve_image', false))) {
					image.value = bcRelease.image;
					imageHostHelper.then(ihh => { ihh.rehostImageLinks([bcRelease.image])
						.then(ihh.singleImageGetter).then(rehostedUrl => { image.value = rehostedUrl }) });
				}
				if (description != null && GM_getValue('update_description', true)) {
					const body = importToBody(bcRelease, description.value);
					if (body != description.value) description.value = body;
				}
			}, reason => { if (!['Cancelled'].includes(reason)) alert(reason) }).then(() => {
				this.style.backgroundColor = this.dataset.backgroundColor;
				this.setDisabled(false);
			});
		};
		bcButton.onmouseenter = bcButton.onmouseleave = function(evt) {
			if (evt.relatedTarget == evt.currentTarget || evt.currentTarget.disabled) return false;
			evt.currentTarget.style.backgroundColor = evt.type == 'mouseenter' ? 'orange'
				: evt.currentTarget.dataset.backgroundColor || null;
		};
		bcButton.title = 'Import description, cover image and tags from Bandcamp';
		img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAbFBMVEX////3///v///v9//m9//m9/fe9/fe7/fW7/fO7/fF7/fF5ve95u+15u+13u+t3u+l3u+l3uac1uaU1uaM1uaMzuaEzt57zt57xd5zxd5rxd5jvdZavdZSvdZStdZKtdZKtc5Ctc5Crc4ZpcWSSeq2AAAAAXRSTlMAQObYZgAAAAlwSFlzAAALEgAACxIB0t1+/AAAAoBJREFUeJzt2mtvgjAUBuCC93sUdR/2/3/bsqlbNqfzVpgGExXa02N5ZVly+gVBpU+a0retVtUfl6oABCAAAQhAAAIQgAAEIAABCEAAArjjs60oUSpI0pNCx/jFBxA8Ve7QkmV9eXkHYAKrX7/5ACptVP3xSvsAprAGSGZXJ2xAo4GqX39dn7EBY1gDqHcfQKuGql5/3JxyAZPw/CIJCh7Vpw+gG56/r4oe4/ntnZkAXA+Iv30AA1T1Si8yF3iAIawBDisfwAhVvdLz7BUWoA9rgN3GBzBBVa/0LHeJAQg6pwYo/Pyfjpu9DyCdBiDGAf2av7sbUGu6jbyiV4kPADcPUfkewAA066jqb2OYDXhUDHMBndDxAXbJxDAXEMHmAZkYZgK6IeT5P5ZDNoV4gEsPKDoOJJkY5gFwMbw3PYJuAC6G9Y8P4JExzALgYni79QFMA+LNu8r1YpAPqLRhg9BaW98iAGkKIcYBwzyEATjHMGAeEC8NMewGAFfDlkGQBjRxQ4A5BFyAMS6FzDHoAHRg22faOA1wAiLcYtA4EXIB+rh5CN0ANsCogpoHaEsM04AhZh2gqBQiAQNYD9jbYpgERKjqyUGYAPRwMbzzAZQSwwQAF8MxEcMEAJhC7gYwAOrpnixgHNBLBjIPOK+GEeMAFcNWAHBPloxhKwCXQnQM2wDdsmLYBhiVFcMWAC6G95wemAcAGyC7J8sCDEH7gcRqmAYcYxg1D7AuBilAVGYKmQA9WBc07MkyAMAY5vaAG0C5MWwAlBvDecCjfhplA57THgAYB0JeCmQBC9iutGspYAGw0htf/tV/SAQgAAEIQAACEIAABCAAAQhAAAJ4SPkFdtLUKHgfCmoAAAAASUVORK5CYII=' // https://s4.bcbits.com/img/favicon/apple-touch-icon.png
		img.width = 32;
		bcButton.append(img);
		container.append(bcButton);
		checkFields();
		document.body.append(container);
		break;
	}
	case '/better.php': {
		function resolveTorrentRow(tr) {
			function setStatus(newStatus, ...addedText) {
				let td = tr.querySelector('td.status');
				console.assert(td != null); if (td == null) return; // assertion failed
				if (typeof newStatus == 'number' && (status == undefined || newStatus < status)) status = newStatus;
				if (status == undefined) return;
				td.textContent = status > 1 ? 'success' : 'failed';
				td.className = 'status ' + td.textContent + ' status-code-' + status;
				if (addedText.length > 0) Array.prototype.push.apply(tooltips, addedText);
				if (tooltips.length > 0) td.title = tooltips.join('\n'); else td.removeAttribute('title');
				//setTooltip(td, tooltips.join('\n'));
				td.style.color = ['red', 'orange', '#adad00', 'green'][status];
				td.style.opacity = 1;
				if (status <= 0) if (autoHideFailed) tr.hidden = true;
					else if ((td = document.getElementById('hide-status-failed')) != null) td.hidden = false;
			}

			const groupId = getGroupId(tr), tooltips = [ ];
			let status;
			if (!(groupId > 0)) return setStatus(0, 'Could not extract torrent id');
			const autoHideFailed = GM_getValue('auto_hide_failed', false);
			queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup => matchingResultsCount(torrentGroup).then(function(matchingCount) {
				setStatus(2, matchingCount.toString() + ' possible match(es) on Bandcamp');
				if (autoOpenSucceed) openGroup(torrentGroup);
			})).catch(function(reason) {
				setStatus(0, reason);
				console.log('groupId %d bandcamp lookup fail for the reason ', groupId, reason);
			});
		}

		if (noEditPerms || !['notags'].includes(urlParams.get('method'))) break;
		const linkBox = document.body.querySelector('div.header > div.linkbox');
		console.assert(linkBox != null);
		if (linkBox == null) throw 'Linkbox not found';
		const a = document.createElement('A');
		a.id = 'auto-tags-lookup';
		a.className = 'brackets';
		a.textContent = 'Auto lookup on Bandcamp';
		a.href = '#';
		a.onclick = function(evt) {
			if (!checkSavedRecovery()) return false;
			evt.currentTarget.previousSibling.remove();
			evt.currentTarget.remove();
			const pager = document.body.querySelector('div.linkbox.pager');
			if (pager != null) pager.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const div = document.createElement('DIV'), span = document.createElement('SPAN');
			div.style = 'position: fixed; top: 10pt; right: 10pt; padding: 3pt; background-color: #2f4f4f8a; color: white; font-weight: 600; border-radius: 5pt; box-shadow: 2px 2px 3px black';
			div.id = 'hide-status-failed';
			div.hidden = true;
			span.textContent = 'Hide failed';
			span.style = 'display: inline-block; padding: 5pt; cursor: pointer; transition: color 250ms;';
			span.onclick = function(evt) {
				evt.currentTarget.parentNode.hidden = true;
				for (let td of document.body.querySelectorAll('table.torrent_table > tbody > tr.torrent > td.status.status-code-0'))
					td.parentNode.hidden = true;
			};
			span.onmouseenter = span.onmouseleave = function(evt) {
				if (evt.relatedTarget == evt.currentTarget) return false;
				evt.currentTarget.style.color = evt.type == 'mouseenter' ? 'orange' : 'white';
			};
			div.append(span);
			document.body.append(div);
			document.body.querySelectorAll('table.torrent_table > tbody > tr').forEach(function(tr) {
				const td = document.createElement('TD');
				tr.append(td);
				if (!(tr.classList.contains('torrent'))) return; // assertion failed
				td.className = 'status';
				td.style = 'opacity: 0.3;';
				td.textContent = 'unknown';
				resolveTorrentRow(tr);
			});
			return false;
		};
		linkBox.append(' ', a);
		break;
	}
}

}
