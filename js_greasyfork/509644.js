// ==UserScript==
// @name         [GMT] Artist Chronology
// @version      1.16.1
// @description  Browse artist's releases in chronological order directly from release page
// @match        https://*/torrents.php?id=*
// @match        https://*/torrents.php?page=*&id=*
// @run-at       document-end
// @author       Anakunda
// @namespace    https://greasyfork.org/users/321857
// @copyright    2024, Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/509644/%5BGMT%5D%20Artist%20Chronology.user.js
// @updateURL https://update.greasyfork.org/scripts/509644/%5BGMT%5D%20Artist%20Chronology.meta.js
// ==/UserScript==

'use strict';

if (document.body.querySelector('div#content div.sidebar > div.box_artists') == null) return;
const anchor = document.body.querySelector('div#content table#torrent_details');
// const anchor = document.body.querySelector('table#vote_matches')
// 	|| document.body.querySelector('div.box.torrent_description');
console.assert(anchor != null);
if (anchor == null) return;
const searchParams = new URLSearchParams(document.location.search), groupId = parseInt(searchParams.get('id'));
console.assert(groupId > 0);
if (!(groupId > 0)) return;
let chronologyArtistId = parseInt(searchParams.get('chronology_artist_id')) || undefined;
const releaseTypes = {
	1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation', 9: 'Single', 11: 'Live album',
	13: 'Remix', 14: 'Bootleg', 15: 'Interview', 16: 'Mixtape', 17: 'Demo', 18: 'Concert Recording', 19: 'DJ Mix',
	21: 'Unknown', 1021: 'Produced By', 1022: 'Composition', 1023: 'Remixed By', 1024: 'Guest Appearance',
};
let releaseType = document.body.querySelector('div#content div.header > h2');
if (releaseType != null) releaseType = /\s+\[([^\[\]]+)\]$/.exec(releaseType.lastChild.textContent);
if (releaseType != null) releaseType = parseInt(Object.keys(releaseTypes).find(typeId => releaseTypes[typeId] == releaseType[1]));
const artistIdValid = artistId => artistId > 0
	&& (document.domain != 'redacted.sh' || ![1683, 20202, 1514535].includes(artistId));
const getArtistIds = className => Array.prototype.filter.call(document.body.querySelectorAll(`ul#artist_list > li.${className} > a`),
	a => !/^(?:Various|Unknown|No) Artist(?:\(s\))?$/i.test(a.textContent.trim()))
	.map(a => parseInt((a = new URLSearchParams(a.search)).get('id'))).filter(artistIdValid);
const artistIds = {
	DJ: getArtistIds('artists_dj'),
	main: getArtistIds('artist_main'),
	composer: getArtistIds('artists_composers'),
	remixer: getArtistIds('artists_remix'),
	producer: getArtistIds('artists_producer'),
};
const minifyHTML = html => html.replace(/\s*(?:\r?\n)+\s*/g, '');
const box = Object.assign(document.createElement('div'), {
	innerHTML: minifyHTML(`
<div class="head">
	<a href="#">↑</a>&nbsp;<strong><a href="#" class="activate_reload" title="Activate/refresh artist data">Artist chronology</a></strong>
	<label style="float: right; margin-left: 2rem; user-select: none;">Lock to release type
		<input name="releasetype_lock" type="checkbox" style="margin-left: 0.5rem;">
	</label>
	<label style="float: right; margin-left: 2rem; user-select: none;">Lock to artist
		<input name="artist_lock" type="checkbox" style="margin-left: 0.5rem;">
	</label>
</div>
<div class="body" style="padding: 0;"></div>
`),
	className: 'box artist_chronology',
});
const forward = (scaleX = 1) => minifyHTML(`
<svg height="20px" viewBox="0 0 82.66 82.66" transform="scale(${scaleX},1)" xmlns="http://www.w3.org/2000/svg">
  <circle fill="#8888" cx="41" cy="41.33" r="41.04"/>
  <polygon fill="white" points="46.27,22.55 59.12,31.94 71.97,41.33 59.12,50.72 46.27,60.12 46.27,47.41 38.39,53.17 22.19,65.02 22.19,41.33 22.19,17.65 38.39,29.49 46.27,35.26 "/>
</svg>
`);
const fastForward = (scaleX = 1) => minifyHTML(`
<svg height="20px" viewBox="0 0 93.33 93.33" transform="scale(${scaleX},1)" xmlns="http://www.w3.org/2000/svg">
  <circle fill="#8888" cx="46.67" cy="46.67" r="46.67"/>
  <path fill="white" d="M58.69 20.71l12.12 0 0 51.91 -12.12 0 0 -51.91zm-0.31 25.96l-17.93 12.97 -17.93 12.98 0 -25.95 0 -25.96 17.93 12.98 17.93 12.98z"/>
</svg>
`);
const [activateReload, artistLock, releaseTypeLock, body] = [
	'a.activate_reload',
	'input[type="checkbox"][name="artist_lock"]',
	'input[type="checkbox"][name="releasetype_lock"]',
	'div.body',
].map(Element.prototype.querySelector.bind(box));

console.assert([body, reload, artistLock, releaseTypeLock].every(elem => elem instanceof HTMLElement));
const acStorage = window[GM_getValue('default_storage', 'session') + 'Storage'];
if (!(acStorage instanceof Storage)) throw 'Invalid storage';
let artistChronology = 'artistChronology' in acStorage ? JSON.parse(acStorage.getItem('artistChronology')) : { };
const cacheLifespan = GM_getValue('cache_lifespan', 30 * 6e4);
const setHidden = GM_getValue('hide_everything', false) ? hidden => box.hidden = hidden
	: hidden => artistLock.parentNode.hidden = releaseTypeLock.parentNode.hidden = hidden;

function getArtistChronology(artistId) {
	if (!artistIdValid(artistId)) return Promise.reject('Not valid artist id: ' + artistId);
	const expired = Object.keys(artistChronology).filter(artistId =>
		!(artistChronology[artistId].timestamp + cacheLifespan > Date.now()));
	if (expired.length > 0) for (let artistId of expired) delete artistChronology[artistId];
	if (artistId in artistChronology) return Promise.resolve(artistChronology[artistId]);
	return queryAjaxAPI('artist', { id: artistId }).then(function(artist) {
		console.assert(artist.id == artistId, artist);
		artistChronology[artistId] = {
			name: artist.name,
			torrentGroups: artist.torrentgroup.sort(function(a, b) {
				const timestamp = torrentGroup => Math.min.apply(null,
					(torrentGroup.torrent || [ ]).map(torrent => new Date(torrent.time).getTime()));
				return (a.groupYear || Infinity) - (b.groupYear || Infinity) || timestamp(a) - timestamp(b);
			}).map(function(torrentGroup) {
				torrentGroup = {
					id: torrentGroup.groupId,
					name: torrentGroup.groupName,
					year: torrentGroup.groupYear,
					releaseType: torrentGroup.releaseType,
					image: torrentGroup.wikiImage || torrentGroup.image,
				};
				['year', 'image'].forEach(prop => { if (!torrentGroup[prop]) delete torrentGroup[prop] });
				return torrentGroup;
			}),
			image: artist.wikiImage || artist.image,
			timestamp: Date.now(),
		};
		if (artist.id != artistId) artistChronology[artistId].id = artist.id;
		if (!artistChronology[artistId].image) delete artistChronology[artistId].image;
		acStorage.setItem('artistChronology', JSON.stringify(artistChronology));
		return artistChronology[artistId];
	});
}
function flatArtistIds(lockedArtistId) {
	let _artistIds = Object.values(artistIds);
	if (lockedArtistId > 0) _artistIds = _artistIds.map(artistIds =>
		artistIds.filter(artistId => artistId == lockedArtistId));
	return Array.prototype.concat.apply([ ], _artistIds).filter(artistIdValid)
		.filter((artistId, index, artistIds) => artistIds.indexOf(artistId) == index);
}
function loadChronology(releaseTypeLocked = true, lockedArtistId) {
	while (body.lastChild != null) body.removeChild(body.lastChild);
	flatArtistIds(lockedArtistId).forEach(function(artistId) {
		const artistRow = document.createElement('div');
		artistRow.className = `chronology_artist_${artistId}`;
		getArtistChronology(artistId).then(function(artistChronology) {
			function chronologyByRole(torrentGroups, role) {
				function addNavigation(className, index, icon) {
					if (torrentGroups[index]) roleNav.querySelectorAll('div.' + className).forEach(function(div) {
						if (div.classList.contains('link')) {
							const link = content => `<a href="/torrents.php?${new URLSearchParams({
								id: torrentGroups[index].id,
								chronology_artist_id: artistId,
							}).toString()}">${content}</a>`;
							if (!div.classList.contains('icon')) {
								let html = `${link(torrentGroups[index].name)}<br>(${torrentGroups[index].year})`;
								if (!releaseTypeLocked) html += ` <span style="color: #888a;">[${releaseTypes[torrentGroups[index].releaseType] || '?'}]</span>`;
								if (showCovers && torrentGroups[index].image) {
									html = link(`<img src="${torrentGroups[index].image}" style="height: 2em; box-shadow: 0 0 3px #888; opacity: 0.5;" />`) +
										`<span style="text-align: left; line-height: 1;">${html}</span>`;
									div.style = 'display: flex; flex-flow: row nowrap; column-gap: 5px;';
								} else div.style = 'text-align: center; line-height: 1;';
								div.innerHTML = html;
							} else if (icon) {
								div.innerHTML = link(icon);
								for (let svg of div.getElementsByTagName('svg')) {
									svg.style.transition = 'filter 200ms';
									svg.onmouseenter = svg.onmouseleave = evt =>
										{ evt.currentTarget.style.filter = evt.type == 'mouseenter' ? 'drop-shadow(0 0 3px darkorange)' : 'none' };
								}
							}
						} else {
							if (!div.classList.contains('icon')) {
								div.innerHTML = `${torrentGroups[index].name}<br>(${torrentGroups[index].year})`;
								div.style = 'text-align: center; line-height: 1;';
							} else if (icon) div.innerHTML = icon;
						}
					});
				}

				torrentGroups = torrentGroups.filter((tg1, index, torrentGroups) =>
					torrentGroups.findIndex(tg2 => tg2.id == tg1.id) == index);
				const groupIndex = torrentGroups.findIndex(torrentGroup => torrentGroup.id == groupId);
				if (groupIndex < 0) return;
				const roleNav = Object.assign(document.createElement('div'), {
					innerHTML: minifyHTML(`
<div style="text-align: center; padding: 5px 10px; background-color: #8d9db244;">
	<a href="/artist.php?id=${artistId}">${artistChronology.name}</a>'s chronology (as ${role}) [${groupIndex + 1}/${torrentGroups.length}]
</div>
<div style="display: flex; flex-flow: row nowrap; padding: 5px 10px; justify-content: space-between; column-gap: 1rem;">
	<div class="first icon link"></div>
	<div class="previous link"></div>
	<div class="previous icon link"></div>
	<div class="current"></div>
	<div class="next icon link"></div>
	<div class="next link"></div>
	<div class="last icon link"></div>
</div>
`),
					className: 'as_' + role,
				});
				const showCovers = GM_getValue('show_covers', true);
				if (groupIndex > 0) {
					addNavigation('first', 0, fastForward(-1));
					addNavigation('previous', groupIndex - 1, forward(-1));
				}
				addNavigation('current', groupIndex);
				if (groupIndex < torrentGroups.length - 1) {
					addNavigation('next', groupIndex + 1, forward(1));
					addNavigation('last', torrentGroups.length - 1, fastForward(1));
				}
				artistRow.append(roleNav);
			}

			let torrentGroups = artistChronology.torrentGroups;
			if (releaseTypeLocked && releaseType > 0) torrentGroups = torrentGroups.filter(torrentGroup =>
				torrentGroup.releaseType >= 1000 || torrentGroup.releaseType == releaseType);
			chronologyByRole(torrentGroups.filter(torrentGroup => torrentGroup.releaseType < 1000), 'main');
			chronologyByRole(torrentGroups.filter(torrentGroup => torrentGroup.releaseType == 1021), 'producer');
			chronologyByRole(torrentGroups.filter(torrentGroup => torrentGroup.releaseType == 1022), 'composer');
			chronologyByRole(torrentGroups.filter(torrentGroup => torrentGroup.releaseType == 1023), 'remixer');
		}, alert);
		body.append(artistRow);
	});
}
function reload(evt) {
	artistChronology = { };
	loadChronology(releaseTypeLock.checked, chronologyArtistId);
	return false;
}

Object.assign(artistLock, {
	checked: chronologyArtistId > 0,
	disabled: !(chronologyArtistId > 0),
	onchange: function(evt) {
		chronologyArtistId = evt.currentTarget.checked ? parseInt(searchParams.get('chronology_artist_id')) : undefined;
		loadChronology(releaseTypeLock.checked, chronologyArtistId);
	},
});
Object.assign(releaseTypeLock, {
	checked: 'chronologyLock' in sessionStorage ? Boolean(Number(sessionStorage.getItem('chronologyLock'))) : true,
	onchange: function(evt) {
		sessionStorage.setItem('chronologyLock', Number(evt.currentTarget.checked));
		loadChronology(evt.currentTarget.checked, chronologyArtistId);
	},
});
if (chronologyArtistId > 0 || flatArtistIds().length <= GM_getValue('max_autoload_artists', 5)) {
	loadChronology(releaseTypeLock.checked, chronologyArtistId);
	activateReload.onclick = reload;
} else {
	activateReload.onclick = function(evt) {
		evt.currentTarget.onclick = reload;
		loadChronology(releaseTypeLock.checked, chronologyArtistId = undefined);
		document.body.querySelectorAll('ul#artist_list > li > span.load_chronology').forEach(span => { span.remove() });
		return setHidden(!(artistLock.checked = true));
	};
	document.body.querySelectorAll('ul#artist_list > li').forEach(function(li) {
		if (!['artists_dj', 'artist_main', 'artists_composers', 'artists_remix', 'artists_producer']
				.some(DOMTokenList.prototype.contains.bind(li.classList))) return;
		let artistId = li.querySelector('a:first-of-type');
		if (artistId != null) artistId = new URLSearchParams(artistId.search);
		if (artistId) artistId = parseInt(artistId.get('id'));
		if (!(artistId > 0)) return;
		const span = Object.assign(document.createElement('span'), { className: 'load_chronology' });
		const a = Object.assign(document.createElement('a'), {
			href: '#',
			className: 'brackets tooltip',
			textContent: 'CH',
			onclick: function(evt) {
				const artistId = parseInt(evt.currentTarget.dataset.artistId);
				if (artistId > 0) artistLock.checked = true; else return false;
				loadChronology(releaseTypeLock.checked, chronologyArtistId = artistId);
				return setHidden(false);
			},
			title: 'Load chronology for this artist',
		});
		a.dataset.artistId = artistId;
		span.append(a);
		li.append(span);
	});
	setHidden(true);
}
anchor.after(box);
