// ==UserScript==
// @name         Gazelle Embedded Players + IDC
// @namespace    https://greasyfork.org/en/scripts/372583-gazelle-embedded-players
// @version      2.1.9
// @description  Adds embedded players to torrent groups, for supported sites, based upon links found within descriptions, as well as searches by artist/album.
// @author       newstarshipsmell
// @include      /https://www\.deepbassnine\.com/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://www\.indietorrents\.com/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://jpopsuki\.eu/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://notwhat\.cd/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://orpheus\.network/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://redacted\.ch/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /https://dicmusic\.club/torrents\.php\?(page=\d+&)?id=\d+/
// @include      /http://dicmusic\.club/torrents\.php\?(page=\d+&)?id=\d+/
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      bandcamp.com
// @connect      deezer.com
// @connect      itunes.apple.com
// @connect      junodownload.com
// @connect      qobuz.com
// @connect      soundcloud.com
// @connect      spotify.com
// @connect      tidal.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/400816/Gazelle%20Embedded%20Players%20%2B%20IDC.user.js
// @updateURL https://update.greasyfork.org/scripts/400816/Gazelle%20Embedded%20Players%20%2B%20IDC.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var site = location.hostname.replace(/(.+\.)?(.+)\..+/, '$2');

	var sites = {
		deepbassnine: {
			artistSelector: 'div.thin > h2 > span > a',
			albumSelector: 'document.querySelector(\'div.thin > h2 > span\').lastChild.textContent.replace(/^ - (.+)/, \'$1\')',
			albumLinksSelector: 'div.main_column > div.box > div.box.pad.body a',
			torrentLinksSelector: 'tr.pad > td > blockquote:nth-of-type(2) a',
			descriptionSelector: 'document.querySelector(\'div.main_column > div.box > div.box.pad.body\').parentNode'
		},
		indietorrents: {
			artistSelector: 'div.thin > h2 > a',
			albumSelector: 'document.querySelector(\'div.thin > h2\').lastChild.textContent.replace(/^ - (.+) \\[\\d{4}\\] \\[[^\\]]+\\]$/, \'$1\')',
			albumLinksSelector: 'div.main_column > div.box > div.body a',
			torrentLinksSelector: 'tr.pad > td > blockquote:nth-of-type(2) a',
			descriptionSelector: 'document.querySelector(\'div.main_column > div.box > div.body\').parentNode'
		},
		jpopsuki: {
			artistSelector: 'div.thin > h2 > a',
			albumSelector: 'document.querySelector(\'div.thin > h2\').lastChild.textContent.replace(/^ - (.+) \[\d{4}\.\d{2}\.\d{2}\]/, \'$1\')',
			albumLinksSelector: 'div.main_column > div.box > div.body a',
			torrentLinksSelector: 'tr.pad > td > blockquote:nth-of-type(3) a',
			descriptionSelector: 'document.querySelector(\'div.main_column > div.box > div.body\').parentNode'
		},
		notwhat: {
			artistSelector: 'div.header > h2 > a',
			albumSelector: 'document.querySelector(\'div.header > h2 > span\').innerHTML',
			albumLinksSelector: 'div.torrent_description > div.body a',
			torrentLinksSelector: 'tr.torrentdetails > td > blockquote#release_description a, tr.torrentdetails > td > blockquote#release_lineage a',
			descriptionSelector: 'document.querySelector(\'div.torrent_description\')'
		},
		orpheus: {
			artistSelector: 'div.header > h2 > a',
			albumSelector: 'document.querySelector(\'div.header > h2 > span\').innerHTML',
			albumLinksSelector: 'div.torrent_description > div.body a',
			torrentLinksSelector: 'tr.torrentdetails > td > blockquote a',
			descriptionSelector: 'document.querySelector(\'div.torrent_description\')'
		},
        dicmusic: {
			artistSelector: 'div.header > h2 > a',
			albumSelector: 'document.querySelector(\'div.header > h2 > span\').innerHTML',
			albumLinksSelector: 'div.torrent_description > div.body a',
			torrentLinksSelector: 'tr.torrentdetails > td > blockquote a',
			descriptionSelector: 'document.querySelector(\'div.torrent_description\')'
		},
		redacted: {
			artistSelector: 'div.header > h2 > a',
			albumSelector: 'document.querySelector(\'div.header > h2 > span\').innerHTML',
			albumLinksSelector: 'div.torrent_description > div.body a',
			torrentLinksSelector: 'tr.torrentdetails > td > blockquote a',
			descriptionSelector: 'document.querySelector(\'div.torrent_description\')'
		}
	};

	var s, settings, artist, album, pA, epP, tD, l, lC, sL;
	var id, scid, bcid, ctry, bctype, sctype, pt;
	var lA, sFD, setM, bcURL;

	getSettings();

	artist = getArtist();
	album = getAlbum();

	pA = getPanel();
	epP = {}; setM = [];
	var slC = buildPanel();

	l = getLinks();
	lC = []; lC.length = l.length;
	sL = {bc: [], dz: [], it: [], jd: [], qb: [], sc: [], sp: [], td: []};
	sFD = {bc: [], dz: [], it: [], jd: [], qb: [], sc: [], sp: [], td: []};
	lA = {bc: 0, dz: 0, it: 0, jd: 0, qb: 0, sc: 0, sp: 0, td: 0};

	getPlayers(slC);
	addPanel();

	/* the end */

	function getArtist() {
		var artists = document.querySelectorAll(sites[site].artistSelector);
		if (artists.length > 1) return artists[0].innerHTML + ' & ' + artists[1].innerHTML;
		if (artists[0] === undefined) return 'Various';
		return artists[0].innerHTML;
	}

	function getAlbum() {
		return eval(sites[site].albumSelector);
	}

	function getSettings() {
		s = GM_getValue('embedded_players_settings');
		if (s === undefined) resetSettings(false);
		else settings = JSON.parse(s);
		if (settings.position_above === undefined) settings.position_above = false;
		if (settings.show_all_links === undefined) settings.show_all_links = true;
		if (settings.show_bandcamp === undefined) settings.show_bandcamp = true;
		if (settings.show_deezer === undefined) settings.show_deezer = true;
		if (settings.show_itunes === undefined) settings.show_itunes = true;
		if (settings.show_junodownload === undefined) settings.show_junodownload = true;
		if (settings.show_qobuz === undefined) settings.show_qobuz = false;
		if (settings.show_soundcloud === undefined) settings.show_soundcloud = true;
		if (settings.show_spotify === undefined) settings.show_spotify = true;
		if (settings.show_tidal === undefined) settings.show_tidal = true;
		if (settings.site_order === undefined) settings.site_order = 'bc sc sp dz td qb jd it';
		if (settings.max_sites === undefined) settings.max_sites = '7';
		if (settings.links_order === undefined) settings.links_order = 'bc sc sp dz td qb jd it dc mb';
		if (settings.bandcamp_height_track === undefined) settings.bandcamp_height_track = 120;
		if (settings.bandcamp_height_album === undefined) settings.bandcamp_height_album = 360;
		if (settings.bandcamp_text === undefined) settings.bandcamp_text = '#0687f5';
		if (settings.bandcamp_background === undefined) settings.bandcamp_background = '#ffffff';
		if (settings.deezer_height === undefined) settings.bandcamp_height_album = 350;
		if (settings.deezer_text === undefined) settings.deezer_text = '#007feb';
		if (settings.deezer_theme === undefined) settings.deezer_theme = '0';
		if (settings.itunes_height === undefined) settings.itunes_height = 225;
		if (settings.qobuz_height === undefined) settings.qobuz_height = 195;
		if (settings.soundcloud_color === undefined) settings.soundcloud_color = '#ff5500';
		if (settings.soundcloud_hide_related === undefined) settings.soundcloud_hide_related = false;
		if (settings.soundcloud_show_comments === undefined) settings.soundcloud_show_comments = false;
		if (settings.soundcloud_show_user === undefined) settings.soundcloud_show_user = false;
		if (settings.soundcloud_show_reposts === undefined) settings.soundcloud_show_reposts = false;
		if (settings.soundcloud_show_teaser === undefined) settings.soundcloud_show_teaser = false;
		if (settings.soundcloud_visual === undefined) settings.soundcloud_visual = false;
		if (settings.soundcloud_show_teaser === undefined) settings.soundcloud_show_teaser = false;
		if (settings.soundcloud_height_track === undefined) settings.soundcloud_height_track = false;
		if (settings.soundcloud_height_set === undefined) settings.soundcloud_height_set = 150;
		if (settings.soundcloud_show_teaser === undefined) settings.soundcloud_show_teaser = 350;
		if (settings.soundcloud_height_user === undefined) settings.soundcloud_height_user = 350;
		if (settings.spotify_height === undefined) settings.spotify_height = 225;
		return 'Settings are awesome';
	}

	function resetSettings(reloadPage) {
		settings = {
			'position_above': false,
			'show_all_links': true,
			'show_bandcamp': true,
			'show_deezer': true,
			'show_itunes': true,
			'show_junodownload': true,
			'show_qobuz': false,
			'show_soundcloud': true,
			'show_spotify': true,
			'show_tidal': true,
			'site_order': 'bc sp sc dz td qb jd it',
			'max_sites': '7',
			'links_order': 'bc dz it jd qb sc sp td dc mb',
			'bandcamp_height_track': 120,
			'bandcamp_height_album': 360,
			'bandcamp_text': '#0687f5',
			'bandcamp_background': '#ffffff',
			'deezer_height': 350,
			'deezer_text': '#007feb',
			'deezer_theme': '0',
			'itunes_height': 225,
			'qobuz_height': 195,
			'soundcloud_color': '#ff5500',
			'soundcloud_hide_related': false,
			'soundcloud_show_comments': false,
			'soundcloud_show_user': false,
			'soundcloud_show_reposts': false,
			'soundcloud_show_teaser': false,
			'soundcloud_visual': false,
			'soundcloud_height_track': 150,
			'soundcloud_height_set': 350,
			'soundcloud_height_user': 350,
			'spotify_height': 225
		}

		s = JSON.stringify(settings);
		GM_setValue('embedded_players_settings', s);
		if (reloadPage) location.reload(true);
		return 'But sometimes they require a reset';
	}

	function saveSettings() {
		var setCtn = 0;
		settings.position_above = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_all_links = epP[setM[setCtn]].checked === true ? true : /*false*/true; setCtn++;//overridden to true until I fix the code for this.
		settings.show_bandcamp = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_deezer = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_itunes = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_junodownload = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_qobuz = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_soundcloud = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_spotify = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.show_tidal = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		var site_order = epP[setM[setCtn]].value.split(/ /);
		for (var i = 0, len = site_order.length; i < len; i++) {
			if (!/(bc|dz|it|jd|qb|sc|sp|td)/.test(site_order[i])) {
				site_order.splice(i, 1);
			}
		}
		var sites = ['bc', 'dz', 'it', 'jd', 'qb', 'sc', 'sp', 'td'];
		for (i = 0, len = sites.length; i < len; i++) {
			if (site_order.indexOf(sites[i]) == -1) {
				site_order.push(sites[i]);
			}
		}
		settings.site_order = site_order.join(' '); setCtn++;
		settings.max_sites = epP[setM[setCtn]].selectedIndex; setCtn++;
		var links_order = epP[setM[setCtn]].value.split(/ /);
		for (i = 0, len = links_order.length; i < len; i++) {
			if (!/(bc|dc|dz|it|jd|mb|qb|sc|sp|td)/.test(links_order[i])) {
				links_order.splice(i, 1);
			}
		}
		var linksites = ['bc', 'dc', 'dz', 'it', 'jd', 'mb', 'qb', 'sc', 'sp', 'td'];
		for (i = 0, len = linksites.length; i < len; i++) {
			if (links_order.indexOf(linksites[i]) == -1) {
				links_order.push(linksites[i]);
			}
		}
		settings.links_order = links_order.join(' '); setCtn++;
		settings.bandcamp_height_track = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 120; setCtn++;
		settings.bandcamp_height_album = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 360; setCtn++;
		settings.bandcamp_text = epP[setM[setCtn]].value; setCtn++;
		settings.bandcamp_background = epP[setM[setCtn]].value; setCtn++;
		settings.deezer_height = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 350; setCtn++;
		settings.deezer_text = epP[setM[setCtn]].value; setCtn++;
		settings.deezer_theme = epP[setM[setCtn]].selectedIndex; setCtn++;
		settings.itunes_height = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 225; setCtn++;
		settings.qobuz_height = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 195; setCtn++;
		settings.soundcloud_height_track = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 150; setCtn++;
		settings.soundcloud_height_set = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 350; setCtn++;
		settings.soundcloud_height_user = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 350; setCtn++;
		settings.soundcloud_color = epP[setM[setCtn]].value; setCtn++;
		settings.soundcloud_hide_related = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.soundcloud_show_comments = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.soundcloud_show_user = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.soundcloud_show_reposts = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.soundcloud_show_teaser = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.soundcloud_visual = epP[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.spotify_height = Number.isInteger(parseInt(epP[setM[setCtn]].value)) ? Math.max(1, parseInt(epP[setM[setCtn]].value)) : 225; setCtn++;
		s = JSON.stringify(settings);
		GM_setValue('embedded_players_settings', s);
		location.reload(true);
		return 'This is beyond the point of no return!';
	}

	function getPanel() {
		var searchLinks = {
			bc: {
				href: 'https://bandcamp.com/search?q=' + encodeURIComponent((artist == 'Various' ? '' : artist + ' ') + album).replace(/%26amp%3B/g, '%26'),
				title: 'Bandcamp',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowNkNENTcxOTBGMjA2ODExQTk2MUFFOUU1QjE3OEVDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MTA0NzhDRTY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MTA0NzhDRDY3NUIxMUUyOEE5MUMzM0NFRUNERTVGMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2Q0Q1NzE5MEYyMDY4MTFBOTYxQUU5RTVCMTc4RUNBIi8+IDwvcmRmOkRlc2NyaXB0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'
			},
			dc: {
				href: 'https://www.discogs.com/search/?type=all&title=' + encodeURIComponent(album).replace(/%26amp%3B/g, '%26').replace(/%20/g, '+') +
				'&artist=' + encodeURIComponent(artist == 'Various' ? 'Various' : artist).replace(/%26amp%3B/g, '%26').replace(/%20/g, '+') + '&advanced=1',
				title: 'Discogs',
				src: 'data:image/png;base64,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'
			},
			dz: {
//				href: 'https://www.deezer.com/search/' + encodeURIComponent(album + (artist == 'Various' ? '' : ' ' + artist)).replace(/%26amp%3B/g, '%26').replace(/%2F/g, '%20') + '/album',
				href: 'https://www.deezer.com/search/' + encodeURIComponent(album.replace(/Volume (\d+)/i, 'Vol. $1').replace(/Part (\d+)/i, 'Pt. $1') + (artist == 'Various' ? '' : ' ' + artist)).replace(/%26amp%3B/g, '%26').replace(/%2F/g, '%20') + '/album',
				title: 'Deezer',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAC8SURBVFhH7Y6hDQIBEASvAwgPkgQqgBpogQIw3wQJDvGKb4OEEjBYDC1ACxgC7uCSlZusOsVNMmrErhVFNqPTxpnI+bDxEDkfNh4i58PGQ+RC87xMnYksaY5bZyJr2HiILGHjIbKGjYfIEjYeImvYeIgsYeMhcqF59XNnItt12ToT2Yb7szORNWw8RK4D+QfSeXeDGRM5n08/cSay3dcrZyJbt9g5E9ma9uZM5DrwO3AYP5jI+QeK4s8x+wJNVUZ5i7piIQAAAABJRU5ErkJggg=='
			},
			it: {
				href: 'https://fnd.io/#/us/search?mediaType=albums&term=' + encodeURIComponent(album + ' by ' + artist).replace(/%26amp%3B/g, '%26'),
				title: 'The iTunes Store',
				src: 'data:image/png;base64,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'
			},
			jd: {
				href: 'https://www.junodownload.com/artists/' + encodeURIComponent(artist).replace(/%20/g, '+') + '/releases/?solrorder=date_down&q%5Btitle%5D%5B%5D=' + encodeURIComponent(album).replace(/%20/g, '+'),
				title: 'Juno Download',
				src: 'data:image/png;base64,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'
			},
			mb: {
				href: 'https://musicbrainz.org/search?query=%22' + encodeURIComponent(album).replace(/%26amp%3B/g, '%26') + '%22+AND+artist%3A' + encodeURIComponent(artist).replace(/%26amp%3B/g, '%26') + '&type=release&method=indexed',
				title: 'MusicBrainz',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFWSURBVFhH7dctUgNBGIThiAhERA6AQEYgcSBwcAREDpAD5AYRCEQkkgNwAKpAIpAcAoHYAyAQk16gqzqdb3ay4acQI54qMjuz71eJYHeQUtrJ/dlyHK33FS6WID4F/Pn5uZkf38GEn/sIF3MQncBDG7cBErzDFfT6ZsJFh9geLBgmXv8agBqYwZDXu4SLCqFzDxP3SFw9wyn35ISLLQT2Pei418LuFg64120s4MZDmGsoh2csGHmDBYx4htY+4KYnHunCcxIqeYUpz7U0fuOBEp61yDaeeFYHCCNdeDYIFPFsHaAOUAeoA9QB6gD/aoDGAyU8GwUKwn/HY7jWQAnPBoGc/AMJ4cZH8KihHJ6xSGS7RzKFwMfLRxfulVCk30OpQqT9WZYaVdxnQfreY7lC7BA2fhZet/DPvpgoRC/gJTPA772aKYRHcGkD/M3LqcIAOwXXpcEKYYLRyiFtp7gAAAAASUVORK5CYII='
			},
			qb: {
				href: 'https://www.qobuz.com/gb-en/search_v2?q=' + encodeURIComponent(album + (artist == 'Various' ? '' : ' ' + artist)).replace(/%26amp%3B/g, '%26') + '&i=boutique',
				title: 'Qobuz',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATiSURBVFhH7ZdpSF1XEMfjFnE3rogal9CKoMUNRFGDWBSraYJNIKTuIrhVxWJF1AgRP0irqVUQQYNWISBKLApJSoORQFGhirh8UXBF3NAoCS7RN53/5L1H0vde1MQvhfzh9+GcOzPn3LnnzDn3wmf93+TF/MT0MlPMCrPIjDCtzPeMJXPuCmH+cnJyUuTl5VF3dzdNTk7SysoKLS0t0fDwMDU3N9ONGzfI2Nh4l21rGVs4fqqMmQZnZ+fjBw8e0OHhIZ0kTCo/P58MDQ3X2fdbifKRQioHExISaHt7WxmeaGNjg9rb26mgoIBu375NiYmJVF5eTk+fPn1vgsiKm5vbMccokmhn1EVmICsri46PjyXg6uoqZWZmEmeDoqKiqKioiJqamqi2tpYyMjIoMDCQrly5Qo2NjXR0dCQ+yIa3tzdxrCyJegb9cu3aNfXgz58/l4F9fX3lrTH4/fv3qaenhzo7O6m6upqys7MJPi4uLhQZGUmbm5viOz8/T/b29gccM+ht6JPlzw5HSDX04sULMjU1JUdHR/L396f4+HgZrKamRhYjPsfdu3cpJSVFMoM3trCwID8/P9rZ2ZEYsOO4/zD6MsIJ+qOhoUEc8Ra88uGM1Y1vSmFhYZSUlET37t2jrq4uwuIsLi4mrJWAgABycHAgAwMD8blz547EgSIiItD3HQb4kFytra2PXr9+LU5YaNynxsTEhLy8vCgmJkbeNjw8XED76tWrkn7V4EBPT08yCPX29qLvT+aDyk5OThaH3d1dMjc3VwdTgc9x+fJlWYCoBUNDQzJRpN3IyEjD/ubNmxJvf3+fLC0tD7nPmtGp31taWsTh0aNHGsEA1sLi4qLYvKuOjg6t9niJg4MDsYmOjkbf14xO/a1KGRYWtzWoq6uT59De3p56p0AhISFafSYmJuQ5ChS3sxmdmlIZ5+TkaAQCSDmEvY4FmpubK20I21Obz7Nnz+R5ZWUl2qWMTo2PjY2JcWFhoUYggIqnUkVFBfX19SlbJAVJm48qq2VlZWgXMzr1pL+/X4zr6+s1AgGUXm3Cnuf6odUHBxaUlpaGdhKjUz9XVVWJ8ejoqEYggK2FKqhQKMQOevnyJcXGxmq19/T0VFqRFCfu82N0KjY0NFSMMYCPj49GQBV4hrMCRcnW1lb6UA+wPS9duqS2w3eHlpeXSV9fHyekAaNTF/kNV6enp8UJlY77Tg1KLjQyMkJc0MjGxkZ9JiCzbNPAnKhyHDgQsoBCwn2nwt3dnebm5sQXk8BhBW1tbZGdnR2K0BfMiTLnLCw8fvxYnF+9eiVllvtPxbuTUCk9PR3PfmVOrUhe0W9mZmYkAMooigh/Q40B/wvKcXBwsLparq2tyefgZwnMmZTp6uqqmJqakkDQ+Pg4paamyrfl52qwM3BfwCK8deuWTABVcWFhQfxwO+JJ7LFtDHMmJfEBstfa2vretkMVnJ2dlQIzMDAgAwwODlJbWxuVlpZSXFyc7AwPDw+5kECooFZWVh81ia+YoaCgIHr48CGpjmqVcNCsr6/LyYjbES4sfGK+YZ/fmB+5DigwCeXO2Oe+b5gzS4+5zjwxMzM7xJULZwUuoyUlJXLxwE1Iuc8bmS8ZlX7ghalQDh73tuvTZMXgSM1hcLDgRyWZ8Wd0FZlc5lwG/6xz1oUL/wL644XoJ7sjHgAAAABJRU5ErkJggg=='
			},
			sc: {
				href: 'https://soundcloud.com/search/albums?q=' + encodeURIComponent(album + (artist == 'Various' ? '' : ' by ' + artist)).replace(/%26amp%3B/g, '%26'),
				title: 'SoundCloud',
				src: 'data:image/png;base64,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'
			},
			sp: {
				href: 'https://open.spotify.com/search/albums/' + encodeURIComponent(album + ' ' + artist).replace(/%26amp%3B/g, '%26'),
				title: 'Spotify',
				src: 'data:image/png;base64,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'
			},
			td: {
				href: 'https://listen.tidal.com/search/albums?q=' + encodeURIComponent(album + ' ' + artist).replace(/%26amp%3B/g, '%26'),
				title: 'Tidal',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAKESURBVFhHvZVJaiphFIVLAyEDJ4qjBKPo1BayhDg0CCoqToJkG4HY4QZMJARFcAUiuAqbsQ1RHIQQp1FjQ27e/R+/qeZW6UNe/fCBde6pOsdqBdECnZEsyqAHbFEDPSFFPSFFPVGKTqdToVGcnp7CxcUFOZPjcDjAaDRSM6mQyWTg8/MTrq+vJbocDG80GjAej/cW9nq98P7+DtVqlSrxu5HL5eD7+5sxn89VS2B4s9nceSeTiWoJDP/4+Nh5a7WavMTfH/l8fmfiYIlgMCg2K8I5VAmfzycJ58hKCFAoFBQmjrjE2dkZtFot0odMp1NwuVzM6/f7YTabkT6kXq/DyckJCMVikTSIwRKhUEgznIMlotGoZjgHSwh3d3ew3W5JAwdPI57O5+dnci6m1+tBIBCA0WhEzsXgZWeXIJ1Oq5bAcLyR0GcwGKBcLpM+pNvtgtVqZd7Ly0sYDoekD8lms8zHCiBUCXx0PB4PNzKwxNPTk8SHdDodsFgsEi++IwaDgcKLj7rI97vD7e0tbDYbZsJwt9stNu7AEo+Pj7sDUuEceYmHhwe5R7LBSry9vamGiymVStBut8FsNpNzzvn5OfT7fbi/v6fmCgFMJpNCo8DrHIlEyJkcjWOS4l5sNhu70xeLBXtEKc+BkKIm+M9fX19313W5XB5TghRVkYeLS9zc3JD77IEUSex2O/v6ycM5X19fEA6HyX01IEUF+B045O2GJa6urshjqECKJKlUCtbrNRnMUfnma0GKqiSTSdUSlUrlX8MRUtQkkUgoSry8vLA3JOXfAynuJR6Pw2q1OjYcIcWDiMVi7JtwRDhCinpCinpCinrCFjXQA8miDP+TP0sQfgAbiI7MBa0d0QAAAABJRU5ErkJggg=='
			},
		};
		return {
			searchLinks: Object.keys(searchLinks).length,
			l1: {tn: 'div', cl: 'box'},
			l1_1: {tn: 'div', cl: 'head'},
			/*l1_1_1: {tn: 'a', href: 'javascript:void(0);', id: 'toggle_embedded_players'},
			l1_1_1_1: {tn: 'img', width: 9, title: 'Toggle panel', src: 'data:image/gif;base64,R0lGODlhCQAJAIAAAOLn7UtjfCwAAAAACQAJAAACEYyPoAu28aCSDSJLc44s3lMAADs%3D'},
			l1_1_2: {tn: 'strong'},
			l1_1_2_1: {txt: 'Embedded Players'},
			l1_1_3: {tn: 'span', cl: 'edit_player_settings'},
			l1_1_3_1: {isSettingsLink: true, tn: 'a', href: 'javascript:void(0);', cl: 'brackets'},
			l1_1_3_1_1: {txt: 'Settings'},*/
			l1_1_1: {tn: 'strong'},
			l1_1_1_1: {txt: 'Embedded Players'},
			l1_1_2: {tn: 'span', cl: 'edit_player_settings'},
			l1_1_2_1: {isSettingsLink: true, tn: 'a', href: 'javascript:void(0);', cl: 'brackets'},
			l1_1_2_1_1: {txt: 'Settings'},
			l1_2: {tn: 'div', cl: 'search_links'},
			l1_2_1: {tn: 'br'},
			l1_2_2: {txt: '\u00A0'.repeat(4) + 'Search on:'},
			l1_2_3: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[0]].href, id: 'searchlink_0'},
			l1_2_3_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[0]].title, src: searchLinks[settings.links_order.split(' ')[0]].src},
			l1_2_4: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[1]].href, id: 'searchlink_1'},
			l1_2_4_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[1]].title, src: searchLinks[settings.links_order.split(' ')[1]].src},
			l1_2_5: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[2]].href, id: 'searchlink_2'},
			l1_2_5_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[2]].title, src: searchLinks[settings.links_order.split(' ')[2]].src},
			l1_2_6: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[3]].href, id: 'searchlink_3'},
			l1_2_6_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[3]].title, src: searchLinks[settings.links_order.split(' ')[3]].src},
			l1_2_7: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[4]].href, id: 'searchlink_4'},
			l1_2_7_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[4]].title, src: searchLinks[settings.links_order.split(' ')[4]].src},
			l1_2_8: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[5]].href, id: 'searchlink_5'},
			l1_2_8_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[5]].title, src: searchLinks[settings.links_order.split(' ')[5]].src},
			l1_2_9: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[6]].href, id: 'searchlink_6'},
			l1_2_9_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[6]].title, src: searchLinks[settings.links_order.split(' ')[6]].src},
			l1_2_10: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[7]].href, id: 'searchlink_7'},
			l1_2_10_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[7]].title, src: searchLinks[settings.links_order.split(' ')[7]].src},
			l1_2_11: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[8]].href, id: 'searchlink_8'},
			l1_2_11_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[8]].title, src: searchLinks[settings.links_order.split(' ')[8]].src},
			l1_2_12: {tn: 'a', href: searchLinks[settings.links_order.split(' ')[9]].href, id: 'searchlink_9'},
			l1_2_12_1: {tn: 'img', width: 24, title: searchLinks[settings.links_order.split(' ')[9]].title, src: searchLinks[settings.links_order.split(' ')[9]].src},
			l1_2_13: {tn: 'br'},
			l1_2_14: {tn: 'br'},
			l1_3: {tn: 'div', cl: 'player_settings'},
			l1_3_1: {tn: 'div', cl: 'player_settings_section1'},
			l1_3_1_1: {tn: 'br'},
			l1_3_1_2: {txt: '\u00A0'.repeat(4) + 'Position players:' + '\u00A0'.repeat(4)},
			l1_3_1_3: {setting: 'position_above', settingBool: true, tn: 'input', type: 'radio', name: 'player_position', id: 'player_position_above', value: 0},
			l1_3_1_4: {tn: 'label', lfor: 'player_position_above'},
			l1_3_1_4_1: {txt: '\u00A0above'},
			l1_3_1_5: {txt: '\u00A0'.repeat(4)},
			l1_3_1_6: {setting: 'position_above', settingBool: false, tn: 'input', type: 'radio', name: 'player_position', id: 'player_position_below', value: 1},
			l1_3_1_7: {tn: 'label', lfor: 'player_position_below'},
			l1_3_1_7_1: {txt: '\u00A0below'},
			l1_3_1_8: {txt: '\u00A0'.repeat(4)},
			l1_3_1_9: {txt: 'the description.' + '\u00A0'.repeat(4)},
			l1_3_1_10: {setting: 'show_all_links', tn: 'input', type: 'checkbox', name: 'show_all_links', id: 'show_all_links'},
			l1_3_1_11: {tn: 'label', lfor: 'show_all_links'},
			l1_3_1_11_1: {txt: '\u00A0Show all searchlinks'},
			l1_3_1_12: {tn: 'br'},
			l1_3_2: {tn: 'div', cl: 'player_settings_section2'},
			l1_3_2_1: {tn: 'br'},
			l1_3_2_2: {txt: '\u00A0'.repeat(4) + 'Show players for:'},
			l1_3_2_3: {tn: 'br'},
			l1_3_2_4: {tn: 'br'},
			l1_3_2_5: {txt: '\u00A0'.repeat(4)},
			l1_3_2_6: {setting: 'show_bandcamp', tn: 'input', type: 'checkbox', name: 'show_bandcamp', id: 'show_bandcamp'},
			l1_3_2_7: {tn: 'label', lfor: 'show_bandcamp'},
			l1_3_2_7_1: {txt: '\u00A0Bandcamp'},
			l1_3_2_8: {txt: '\u00A0'.repeat(4)},
			l1_3_2_9: {setting: 'show_deezer', tn: 'input', type: 'checkbox', name: 'show_deezer', id: 'show_deezer'},
			l1_3_2_10: {tn: 'label', lfor: 'show_deezer'},
			l1_3_2_10_1: {txt: '\u00A0Deezer'},
			l1_3_2_11: {txt: '\u00A0'.repeat(4)},
			l1_3_2_12: {setting: 'show_itunes', tn: 'input', type: 'checkbox', name: 'show_itunes', id: 'show_itunes'},
			l1_3_2_13: {tn: 'label', lfor: 'show_itunes'},
			l1_3_2_13_1: {txt: '\u00A0iTunes'},
			l1_3_2_14: {txt: '\u00A0'.repeat(4)},
			l1_3_2_15: {setting: 'show_junodownload', tn: 'input', type: 'checkbox', name: 'show_junodownload', id: 'show_junodownload'},
			l1_3_2_16: {tn: 'label', lfor: 'show_junodownload'},
			l1_3_2_16_1: {txt: '\u00A0Juno Download'},
			l1_3_2_17: {txt: '\u00A0'.repeat(4)},
			l1_3_2_18: {setting: 'show_qobuz', tn: 'input', type: 'checkbox', name: 'show_qobuz', id: 'show_qobuz'},
			l1_3_2_19: {tn: 'label', lfor: 'show_qobuz'},
			l1_3_2_19_1: {txt: '\u00A0Qobuz'},
			l1_3_2_20: {txt: '\u00A0'.repeat(4)},
			l1_3_2_21: {setting: 'show_soundcloud', tn: 'input', type: 'checkbox', name: 'show_soundcloud', id: 'show_soundcloud'},
			l1_3_2_22: {tn: 'label', lfor: 'show_soundcloud'},
			l1_3_2_22_1: {txt: '\u00A0SoundCloud'},
			l1_3_2_23: {txt: '\u00A0'.repeat(4)},
			l1_3_2_24: {setting: 'show_spotify', tn: 'input', type: 'checkbox', name: 'show_spotify', id: 'show_spotify'},
			l1_3_2_25: {tn: 'label', lfor: 'show_spotify'},
			l1_3_2_25_1: {txt: '\u00A0Spotify'},
			l1_3_2_26: {txt: '\u00A0'.repeat(4)},
			l1_3_2_27: {setting: 'show_tidal', tn: 'input', type: 'checkbox', name: 'show_tidal', id: 'show_tidal'},
			l1_3_2_28: {tn: 'label', lfor: 'show_tidal'},
			l1_3_2_28_1: {txt: '\u00A0Tidal'},
			l1_3_2_29: {tn: 'br'},
			l1_3_2_30: {tn: 'br'},
			l1_3_2_31: {txt: '\u00A0'.repeat(4) + 'Site preference order:' + '\u00A0'.repeat(4)},
			l1_3_2_32: {setting: 'site_order', tn: 'input', type: 'text', size: 14, name: 'site_order', id: 'site_order'},
			l1_3_2_33: {txt: '\u00A0'.repeat(4) + 'Maximum sites to add:\u00A0'},
			l1_3_2_34: {setting: 'max_sites', tn: 'select', id: 'max_sites', options: [1, 2, 3, 4, 5, 6, 7, 8]},
			l1_3_2_35: {tn: 'br'},
			l1_3_2_36: {tn: 'br'},
			l1_3_2_37: {txt: '\u00A0'.repeat(4) + 'Searchlink preference order:' + '\u00A0'.repeat(4)},
			l1_3_2_38: {setting: 'links_order', tn: 'input', type: 'text', size: 20, name: 'links_order', id: 'links_order'},
			l1_3_2_39: {tn: 'br'},
			l1_3_3: {tn: 'div', cl: 'player_settings_section3'},
			l1_3_3_1: {tn: 'br'},
			l1_3_3_2: {txt: '\u00A0'.repeat(4) + 'Bandcamp player:' + '\u00A0'.repeat(4) + 'Height:' + '\u00A0'.repeat(4) + 'Tracks:\u00A0'},
			l1_3_3_3: {setting: 'bandcamp_height_track', tn: 'input', type: 'text', size: 1, name: 'bandcamp_height_track', id: 'bandcamp_height_track'},
			l1_3_3_4: {txt: '\u00A0'.repeat(4) + 'Albums:\u00A0'},
			l1_3_3_5: {setting: 'bandcamp_height_album', tn: 'input', type: 'text', size: 1, name: 'bandcamp_height_album', id: 'bandcamp_height_album'},
			l1_3_3_6: {tn: 'br'},
			l1_3_3_7: {tn: 'br'},
			l1_3_3_8: {txt: '\u00A0'.repeat(34) + 'Color:' + '\u00A0'.repeat(4) + 'Link text:\u00A0'},
			l1_3_3_9: {setting: 'bandcamp_text', tn: 'input', type: 'color', name: 'bandcamp_text', id: 'bandcamp_text'},
			l1_3_3_10: {txt: '\u00A0'.repeat(4) + 'Background:\u00A0'},
			l1_3_3_11: {setting: 'bandcamp_background', tn: 'input', type: 'color', name: 'bandcamp_background', id: 'bandcamp_background'},
			l1_3_3_12: {tn: 'br'},
			l1_3_4: {tn: 'div', cl: 'player_settings_section4'},
			l1_3_4_1: {tn: 'br'},
			l1_3_4_2: {txt: '\u00A0'.repeat(4) + 'Deezer player:' + '\u00A0'.repeat(4) + 'Height:\u00A0'},
			l1_3_4_3: {setting: 'deezer_height', tn: 'input', type: 'text', size: 1, name: 'deezer_height', id: 'deezer_height'},
			l1_3_4_4: {txt: '\u00A0'.repeat(4) + 'Color:\u00A0'},
			l1_3_4_5: {setting: 'deezer_text', tn: 'input', type: 'color', name: 'deezer_text', id: 'deezer_text'},
			l1_3_4_6: {txt: '\u00A0'.repeat(4) + 'Theme:\u00A0'},
			l1_3_4_7: {setting: 'deezer_theme', tn: 'select', id: 'deezer_theme', options: ['dark', 'light']},
			l1_3_4_8: {tn: 'br'},
			l1_3_5: {tn: 'div', cl: 'player_settings_section5'},
			l1_3_5_1: {tn: 'br'},
			l1_3_5_2: {txt: '\u00A0'.repeat(4) + 'iTunes player:' + '\u00A0'.repeat(4) + 'Height:\u00A0'},
			l1_3_5_3: {setting: 'itunes_height', tn: 'input', type: 'text', size: 1, name: 'itunes_height', id: 'itunes_height'},
			l1_3_5_4: {tn: 'br'},
			l1_3_6: {tn: 'div', cl: 'player_settings_section6'},
			l1_3_6_1: {tn: 'br'},
			l1_3_6_2: {txt: '\u00A0'.repeat(4) + 'Qobuz player:' + '\u00A0'.repeat(4) + 'Height:\u00A0'},
			l1_3_6_3: {setting: 'qobuz_height', tn: 'input', type: 'text', size: 1, name: 'qobuz_height', id: 'qobuz_height'},
			l1_3_6_4: {tn: 'br'},
			l1_3_7: {tn: 'div', cl: 'player_settings_section7'},
			l1_3_7_1: {tn: 'br'},
			l1_3_7_2: {txt: '\u00A0'.repeat(4) + 'SoundCloud player:' + '\u00A0'.repeat(4) + 'Height:' + '\u00A0'.repeat(4) + 'Tracks:\u00A0'},
			l1_3_7_3: {setting: 'soundcloud_height_track', tn: 'input', type: 'text', size: 1, name: 'soundcloud_height_track', id: 'soundcloud_height_track'},
			l1_3_7_4: {txt: '\u00A0'.repeat(4) + 'Sets:\u00A0'},
			l1_3_7_5: {setting: 'soundcloud_height_set', tn: 'input', type: 'text', size: 1, name: 'soundcloud_height_set', id: 'soundcloud_height_set'},
			l1_3_7_6: {txt: '\u00A0'.repeat(4) + 'Users:\u00A0'},
			l1_3_7_7: {setting: 'soundcloud_height_user', tn: 'input', type: 'text', size: 1, name: 'soundcloud_height_user', id: 'soundcloud_height_user'},
			l1_3_7_8: {txt: '\u00A0'.repeat(4) + 'Color:\u00A0'},
			l1_3_7_9: {setting: 'soundcloud_color', tn: 'input', type: 'color', name: 'soundcloud_color', id: 'soundcloud_color'},
			l1_3_7_10: {tn: 'br'},
			l1_3_7_11: {tn: 'br'},
			l1_3_7_12: {txt: '\u00A0'.repeat(4)},
			l1_3_7_13: {setting: 'soundcloud_hide_related', tn: 'input', type: 'checkbox', name: 'soundcloud_hide_related', id: 'soundcloud_hide_related'},
			l1_3_7_14: {tn: 'label', lfor: 'soundcloud_hide_related'},
			l1_3_7_14_1: {txt: '\u00A0Hide related'},
			l1_3_7_15: {txt: '\u00A0'.repeat(4)},
			l1_3_7_16: {setting: 'soundcloud_show_comments', tn: 'input', type: 'checkbox', name: 'soundcloud_show_comments', id: 'soundcloud_show_comments'},
			l1_3_7_17: {tn: 'label', lfor: 'soundcloud_show_comments'},
			l1_3_7_17_1: {txt: '\u00A0Show comments'},
			l1_3_7_18: {txt: '\u00A0'.repeat(4)},
			l1_3_7_19: {setting: 'soundcloud_show_user', tn: 'input', type: 'checkbox', name: 'soundcloud_show_user', id: 'soundcloud_show_user'},
			l1_3_7_20: {tn: 'label', lfor: 'soundcloud_show_user'},
			l1_3_7_20_1: {txt: '\u00A0Show user'},
			l1_3_7_21: {txt: '\u00A0'.repeat(4)},
			l1_3_7_22: {setting: 'soundcloud_show_reposts', tn: 'input', type: 'checkbox', name: 'soundcloud_show_reposts', id: 'soundcloud_show_reposts'},
			l1_3_7_23: {tn: 'label', lfor: 'soundcloud_show_reposts'},
			l1_3_7_23_1: {txt: '\u00A0Show reposts'},
			l1_3_7_24: {txt: '\u00A0'.repeat(4)},
			l1_3_7_25: {setting: 'soundcloud_show_teaser', tn: 'input', type: 'checkbox', name: 'soundcloud_show_teaser', id: 'soundcloud_show_teaser'},
			l1_3_7_26: {tn: 'label', lfor: 'soundcloud_show_teaser'},
			l1_3_7_26_1: {txt: '\u00A0Show teaser'},
			l1_3_7_27: {txt: '\u00A0'.repeat(4)},
			l1_3_7_28: {setting: 'soundcloud_visual', tn: 'input', type: 'checkbox', name: 'soundcloud_visual', id: 'soundcloud_visual'},
			l1_3_7_29: {tn: 'label', lfor: 'soundcloud_visual'},
			l1_3_7_29_1: {txt: '\u00A0Visual'},
			l1_3_7_30: {tn: 'br'},
			l1_3_8: {tn: 'div', cl: 'player_settings_section8'},
			l1_3_8_1: {tn: 'br'},
			l1_3_8_2: {txt: '\u00A0'.repeat(4) + 'Spotify player:' + '\u00A0'.repeat(4) + 'Height:\u00A0'},
			l1_3_8_3: {setting: 'spotify_height', tn: 'input', type: 'text', size: 1, name: 'spotify_height', id: 'spotify_height'},
			l1_3_8_6: {tn: 'br'},
			l1_3_9: {tn: 'div', cl: 'player_settings_section9'},
			l1_3_9_1: {tn: 'br'},
			l1_3_9_2: {tn: 'span', cl: 'save_reset_buttons', style: 'float: right;'},
			l1_3_9_2_1: {tn: 'input', type: 'button', name: 'reset_player_settings', id: 'reset_player_settings', value: 'Reset', title: 'Reset the settings to defaults'},
			l1_3_9_2_2: {txt: '\u00A0'.repeat(4)},
			l1_3_9_2_3: {tn: 'input', type: 'button', name: 'save_player_settings', id: 'save_player_settings', value: 'Save', title: 'Save the settings'},
			l1_3_9_2_4: {txt: '\u00A0'.repeat(4)},
			l1_3_9_3: {tn: 'br'},
			l1_3_9_4: {tn: 'br'},
			l1_3_9_5: {tn: 'br'}
		};
	}

	function buildPanel() {
		for (var j in pA) {
			if (!pA.hasOwnProperty(j)) continue;

			if (j == 'searchLinks') {
				var searchLinks = pA[j];
				continue;
			}

			epP[j] = pA[j].txt === undefined ? document.createElement(pA[j].tn) : document.createTextNode(pA[j].txt);

			switch (pA[j].tn) {

				case 'a':
					epP[j].id = pA[j].id;
					epP[j].href = pA[j].href === undefined ? 'javascript:void(0);' : pA[j].href;
					epP[j].target = '_blank';
					//epP[j].onclick = eval(pA[j].onclick);
					break;

				case 'img':
					epP[j].title = pA[j].title;
					epP[j].src = pA[j].src;
					epP[j].style.width = pA[j].width + 'px';
					break;

				case 'input':
					epP[j].type = pA[j].type;
					epP[j].name = pA[j].name;
					epP[j].id = pA[j].id;

					switch (pA[j].type) {
						case 'radio':
							epP[j].value = pA[j].value;
							epP[j].checked = settings[pA[j].setting] == pA[j].settingBool ? true : false;
							break;

						case 'checkbox':
							epP[j].checked = settings[pA[j].setting];
							break;

						case 'text':
							epP[j].size = pA[j].size;
							epP[j].setAttribute('value', settings[pA[j].setting]);
							break;

						case 'color':
							epP[j].value = settings[pA[j].setting];
							break;

						case 'button':
							epP[j].title = pA[j].title;
							epP[j].value = pA[j].value;
							break;

						default:
					}
					break;

				case 'label':
					epP[j].setAttribute('for', pA[j].lfor);
					break;

				case 'select':
					var i, len, ji;
					epP[j].id = pA[j].id;

					for (i = 0, len = pA[j].options.length; i < len; i++) {
						ji = j + '_' + (i + 1);
						epP[ji] = document.createElement('option');
						epP[ji].setAttribute('value', pA[j].options[i])
						epP[ji + '_1'] = document.createTextNode(pA[j].options[i]);
						epP[ji].appendChild(epP[ji + '_1']);
						epP[j].appendChild(epP[ji]);
					}

					epP[j].selectedIndex = settings[pA[j].setting];

					break;

				case 'span':
					epP[j].style.float = 'right';
					break;

				default:
			}

			if (pA[j].setting && pA[j].settingBool !== false) setM.push(j);

			if (j == 'l1_3') epP[j].classList.add('hidden');
			pA[j].cl === undefined ? null : epP[j].classList.add(pA[j].cl);

			if (j != 'l1') epP[j.replace(/_\d+$/, '')].appendChild(epP[j]);

			if (pA[j].isSettingsLink) {
				epP[j].addEventListener('click', function(e) {
					e.preventDefault();
					epP.l1_3.classList.toggle('hidden');
				});
			}

			/*if (pA[j].id == 'toggle_embedded_players') {
				epP[j].addEventListener('click', function() {
					var hidePanel = true;
					if (document.querySelector('div.search_links').classList.contains('hidden')) hidePanel = false;
				});
			}*/

			if (pA[j].id == 'reset_player_settings') {
				epP[j].addEventListener('click', function() {resetSettings(true);});
			}

			if (pA[j].id == 'save_player_settings') {
				epP[j].addEventListener('click', function() {saveSettings(true);});
			}
		};
		return searchLinks;//'Building stuff is fun';
	}

	function getLinks() {
		var albumLinks, torrentLinks, links, i, len;

		albumLinks = document.querySelectorAll(sites[site].albumLinksSelector);
		torrentLinks = document.querySelectorAll(sites[site].torrentLinksSelector);

		links = [];
		for (i = 0, len = albumLinks.length; i < len; i++) if (links.indexOf(albumLinks[i].href) == -1) links.push(albumLinks[i].href);
		for (i = 0, len = torrentLinks.length; i < len; i++) if (links.indexOf(torrentLinks[i].href) == -1) links.push(torrentLinks[i].href);
		return links;
	}

	function getPlayers(searchLinks) {
		var epA = 0;
		var sites = settings.site_order.split(' ');
		var siteAbr = {bc: 'bandcamp', dz: 'deezer', it: 'itunes', jd: 'junodownload', qb: 'qobuz', sc: 'soundcloud', sp: 'spotify', td: 'tidal'};

		for (var i = 0, len = sites.length; i < len; i++) {
			if (epA > settings.max_sites) break;//max_sites is index; index 0=1 sites max, 7=8 sites max
			if (settings['show_' + siteAbr[sites[i]]] === false) continue;
			addPlayer(siteAbr[sites[i]]);
			if (lA[sites[i]] > 0) epA++;
		}
		var offset = 3;
		for (i = offset; i < searchLinks + offset; i++) {
			if (!epP['l1_2_' + i].classList.contains('hidden')) {
				epP.l1_2.insertBefore(document.createTextNode('\u00A0'.repeat(4)), epP['l1_2_' + i]);
			}
		}
	}

	function addPlayer(sitename) {
		var i, len;
		switch (sitename) {

			case 'bandcamp':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(?!(www\.)?deezer\.com)(?!(itunes|music)\.apple\.com)(?!(www\.)?qobuz\.com)(?!(open|play)\.spotify\.com)(?!(listen\.)?tidal\.com)(.+\.)*.+\..+\/(album|track)\/.+/.test(l[i])) {
						bctype = /https?:\/\/(.+\.)*.+\..+\/album\/.+/.test(l[i]) ? 'album' : 'track';
						sFD.bc.length++;
						bcURL = l[i];

						GM_xmlhttpRequest({
							method: "GET",
							url: bcURL,
							headers: {
								"Accept": "text/xml"
							},

							onload: function(response) {
								try {
									pt = response.responseText.match(/<meta name="Description" content="\n.+, release(s|d) \d{1,2} [a-zA-Z]+ \d{4}/g)[0];
									pt = pt.replace(/(<meta name="Description" content="\n)(.+)(, release(s|d) \d{1,2} [a-zA-Z]+ \d{4})/, '$2');

									switch(bctype) {

										case 'track':
											bcid = response.responseText.match(/content="https:\/\/bandcamp\.com\/EmbeddedPlayer\/v=2\/track=\d+\//g)[0];
											bcid = bcid.replace(/(content="https:\/\/bandcamp\.com\/EmbeddedPlayer\/v=2\/track=)(\d+)(\/)/, '$2');
											break;

										case 'album':
											bcid = response.responseText.match(/content="https:\/\/bandcamp\.com\/EmbeddedPlayer\/v=2\/album=\d+\//g)[0];
											bcid = bcid.replace(/(content="https:\/\/bandcamp\.com\/EmbeddedPlayer\/v=2\/album=)(\d+)(\/)/, '$2');
											break;
										default:
									}

								} catch(e) {
									bcid = null;
								};

								if (bcid === null) {
									sFD.bc.length--;

								} else {
									var height = {track: settings.bandcamp_height_track, album: settings.bandcamp_height_album};

									sFD.bc[i] = document.createElement('div');
									sFD.bc[i].classList.add('body');
									sFD.bc[i].classList.add('bandcamp_iframe');

									sFD.bc[i].innerHTML = '<iframe style="border: 0; width: 100%; height: ' +
										height[bctype] + 'px;" src="https://bandcamp.com/EmbeddedPlayer/' + bctype + '=' + bcid + '/size=large/bgcol=' +
										settings.bandcamp_background.replace('#', '') + '/linkcol=' + settings.bandcamp_text.replace('#', '') +
										(bctype == 'track' ? '/tracklist=false' : '') + '/artwork=small/transparent=true/" seamless><a href="' + bcURL + '">' +
										pt + '</a></iframe>';

									epP.l1.appendChild(sFD.bc[i]);
								}
							}
						});

						lA.bc++;
						lC[i] = 'checked';
					}
				}

				if (lA.bc == 0 && settings.search_bandcamp === true) {
					//search for a bandcamp release listing
				}

				break;

			case 'deezer':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(www\.)?deezer\.com\/([a-z]{2}\/)?album\/\d+/.test(l[i])) {
						id = l[i].split('/album/')[1];
						sL.dz.push(id);
						lA.dz++;
						lC[i] = 'checked';
					}
				}

				sFD.dz.length = sL.dz.length;

				for (i = 0, len = sL.dz.length; i < len; i++) {

					sFD.dz[i] = document.createElement('div');
					sFD.dz[i].classList.add('body');
					sFD.dz[i].classList.add('deezer_iframe');
					sFD.dz[i].innerHTML = '<iframe scrolling="yes" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&color=' +
						settings.deezer_text.replace('#', '').toUpperCase() + '&layout=' + (settings.deezer_theme == 0 ? 'dark' : 'light') +
						'&size=medium&type=album&id=' + sL.dz[i] + '&app_id=1" width="100%" height="' + settings.deezer_height + '"></iframe>'

					epP.l1.appendChild(sFD.dz[i]);
				}

				if (lA.dz == 0 && settings.search_deezer === true) {
					//search for a deezer release listing
				}
				break;

			case 'itunes':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(itunes|music)\.apple\.com\/([a-z]{2}\/)?album\/([^\/]+\/)?(id)?\d+(\?.+)?/.test(l[i])) {
						id = l[i].split('/').pop().split('?')[0].replace('id', '');
						ctry = l[i].split('apple.com/')[1].split('/album/')[0];
						if (ctry == '') ctry == 'us';
						sL.it.push({'id': id, 'ctry': ctry});
						lA.it++;
						lC[i] = 'checked';
					}
				}

				sFD.it.length = sL.it.length;

				for (i = 0, len = sL.it.length; i < len; i++) {

					sFD.it[i] = document.createElement('div');
					sFD.it[i].classList.add('body');
					sFD.it[i].classList.add('itunes_iframe');
					sFD.it[i].innerHTML = '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="' + settings.itunes_height +
						'" width="100%" style="max-width:100%;overflow:hidden;background:transparent;" src="https://embed.music.apple.com/' + sL.it[i].ctry +
						'/album/' + sL.it[i].id + '?app=music"></iframe>';

					epP.l1.appendChild(sFD.it[i]);
				}

				if (lA.it == 0/* && settings.search_itunes === true*/) {
					//search for an itunes release listing
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://itunes.apple.com/search?term=" + encodeURIComponent(album + ' by ' + artist) + "&country=us&media=music&entity=album",
						headers: {
							"Accept": "text/xml"
						},

						onload: function(response) {
							if (JSON.parse(response.responseText).resultCount > 0) {
								lA.it++;
								sFD.it.length++;

								sFD.it[0] = document.createElement('div');
								sFD.it[0].classList.add('body');
								sFD.it[0].classList.add('itunes_iframe');
								sFD.it[0].innerHTML = '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="' + settings.itunes_height +
									'" width="100%" style="max-width:100%;overflow:hidden;background:transparent;" src="https://embed.music.apple.com/us/album/' +
									JSON.parse(response.responseText).results[0].collectionId + '?app=music"></iframe>';

								epP.l1.appendChild(sFD.it[0]);
							} else {
								GM_xmlhttpRequest({
									method: "GET",
									url: "https://itunes.apple.com/search?term=" + encodeURIComponent(album + ' by ' + artist) + "&country=nz&media=music&entity=album",
									headers: {
										"Accept": "text/xml"
									},

									onload: function(response) {
										if (JSON.parse(response.responseText).resultCount > 0) {
											lA.it++;
											sFD.it.length++;

											sFD.it[0] = document.createElement('div');
											sFD.it[0].classList.add('body');
											sFD.it[0].classList.add('itunes_iframe');
											sFD.it[0].innerHTML = '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="' + settings.itunes_height +
												'" width="100%" style="max-width:100%;overflow:hidden;background:transparent;" src="https://embed.music.apple.com/nz/album/' +
												JSON.parse(response.responseText).results[0].collectionId + '?app=music"></iframe>';

											epP.l1.appendChild(sFD.it[0]);
										}
									}
								});
							}
						}
					});
				}
				break;

			case 'junodownload':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(www\.)?junodownload\.com\/products\/[^\/]+\/\d+-\d+\/?(\?.+)?/.test(l[i])) {
						id = l[i].split('/products/')[1].split('/')[1].split('/')[0];
						sL.jd.push(id);
						lA.jd++;
						lC[i] = 'checked';
					}
				}

				sFD.jd.length = sL.jd.length;

				for (i = 0, len = sL.jd.length; i < len; i++) {

					sFD.jd[i] = document.createElement('div');
					sFD.jd[i].classList.add('body');
					sFD.jd[i].classList.add('junodownload_iframe');
					sFD.jd[i].innerHTML = '<iframe frameborder="no" height="120" src="https://www.junodownload.com/player-embed/' + sL.jd[i] +
						'.m3u/?pl=false&pn=false&jd=true" scrolling="no" width="100%"></iframe>';

					epP.l1.appendChild(sFD.jd[i]);
				}

				if (lA.jd == 0/* && settings.search_junodownload === true*/) {
					//search for a junodownload release listing
					GM_xmlhttpRequest({
						method: "GET",
						url: 'https://www.junodownload.com/artists/' + encodeURIComponent(artist).replace(/%20/g, '+') +
						'/releases/?solrorder=artist_up&q%5Btitle%5D%5B%5D=' + encodeURIComponent(album).replace(/%20/g, '+'),
						headers: {
							"Accept": "text/xml"
						},

						onload: function(response) {
							var searchResults = response.responseText.match(/<span class="jq_highlight pwrtext">\s+<a href="\/products\/.+?\/\d+-02\/">/g);

							if (searchResults !== null) {
								sL.jd.push(searchResults[0].split('/products/')[1].split('/')[1].split('/')[0]);
								lA.jd++;
								sFD.jd.length++;

								sFD.jd[0] = document.createElement('div');
								sFD.jd[0].classList.add('body');
								sFD.jd[0].classList.add('junodownload_iframe');
								sFD.jd[0].innerHTML = '<iframe frameborder="no" height="120" src="https://www.junodownload.com/player-embed/' + sL.jd[0] +
									'.m3u/?pl=false&pn=false&jd=true" scrolling="no" width="100%"></iframe>';

								epP.l1.appendChild(sFD.jd[0]);
							}
						}
					});
				}
				break;

			case 'qobuz':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(www\.)?qobuz\.com\/[a-z]{2}-[a-z]{2}\/album\/[^\/]+\/[a-z0-9]{13}/.test(l[i])) {
						id = l[i].split('/').pop();
						sL.qb.push(id);
						lA.qb++;
						lC[i] = 'checked';
					}
				}

				sFD.qb.length = sL.qb.length;

				for (i = 0, len = sL.qb.length; i < len; i++) {

					sFD.qb[i] = document.createElement('div');
					sFD.qb[i].classList.add('body');
					sFD.qb[i].classList.add('qobuz_iframe');
					sFD.qb[i].innerHTML = '<iframe id="qobuz_player_widget_html" scrolling="yes" src="http://player.qobuz.com/widget-xlarge.html?showTitle=true/#!/album/' +
						sL.qb[i] + '/tracks-tab" height="' + settings.qobuz_height + 'px" width="100%" style="border:none;"></iframe>';

					epP.l1.appendChild(sFD.qb[i]);
				}

				if (lA.qb == 0 && settings.search_qobuz === true) {
					//search for a qobuz release listing
				}
				break;

			case 'soundcloud':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/soundcloud\.com\/.+/.test(l[i])) {

						sctype = /https?:\/\/soundcloud\.com\/[^\/]+\/?$/.test(l[i]) ? 'user' :
						(/https?:\/\/soundcloud\.com\/[^\/]+\/sets\/.+/.test(l[i]) ? 'set' : 'track');
						sFD.sc.length++;

						GM_xmlhttpRequest({

							method: "GET",
							url: l[i],
							headers: {
								"Accept": "text/xml"
							},

							onload: function(response) {

								try {
									switch(sctype) {

										case 'track':
											scid = response.responseText.match(/content="soundcloud:\/\/sounds:\d+"/g)[0];
											scid = scid.replace(/(content="soundcloud:\/\/sounds:)(\d+)(")/, '$2');
											break;

										case 'set':
											scid = response.responseText.match(/content="soundcloud:\/\/playlists:\d+"/g)[0];
											scid = scid.replace(/(content="soundcloud:\/\/playlists:)(\d+)(")/, '$2');
											break;

										case 'user':
											scid = response.responseText.match(/content="soundcloud:\/\/users:\d+"/g)[0];
											scid = scid.replace(/(content="soundcloud:\/\/users:)(\d+)(")/, '$2');
											break;
										default:
									}

								} catch(e) {

									scid = null;
								};

								if (scid === null) {

									sFD.sc.length--;

								} else {

									var height = {track: settings.soundcloud_height_track, set: settings.soundcloud_height_set, user: settings.soundcloud_height_user};
									var scrolling = {track: 'no', set: 'yes', user: 'yes'};
									var urltype = {track: 'tracks', set: 'playlists', user: 'users'};

									sFD.sc[i] = document.createElement('div');
									sFD.sc[i].classList.add('body');
									sFD.sc[i].classList.add('soundcloud_iframe');

									sFD.sc[i].innerHTML = '<iframe width="100%" height="' + height[sctype] + '" scrolling="' + scrolling[sctype] +
										'" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' +
										urltype[sctype] + '/' + scid + '&color=' + settings.soundcloud_color.replace('#', '%23') + '&auto_play=false&hide_related=' +
										settings.soundcloud_hide_related + '&show_comments=' + settings.soundcloud_show_comments + '&show_user=' +
										settings.soundcloud_show_user + '&show_reposts=' + settings.soundcloud_show_reposts + '&show_teaser=' +
										settings.soundcloudShowTeaser + '&visual='+ settings.soundcloud_visual + '"></iframe>';

									epP.l1.appendChild(sFD.sc[i]);
								}
							}
						});

						lA.sc++;
						lC[i] = 'checked';
					}
				}

				if (lA.sc == 0 && settings.search_soundcloud === true) {
					//search for a soundcloud release listing
				}
				break;

			case 'spotify':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(open|play)\.spotify\.com\/album\/\w{22}/.test(l[i])) {
						id = l[i].split('/').pop();
						sL.sp.push(id);
						lA.sp++;
						lC[i] = 'checked';
					}
				}

				sFD.sp.length = sL.sp.length;

				for (i = 0, len = sL.sp.length; i < len; i++) {

					sFD.sp[i] = document.createElement('div');
					sFD.sp[i].classList.add('body');
					sFD.sp[i].classList.add('spotify_iframe');
					sFD.sp[i].innerHTML = '<iframe src="https://open.spotify.com/embed?uri=spotify%3Aalbum%3A' + sL.sp[i] +
						'" width="100%" height="' + settings.spotify_height + '" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';

					epP.l1.appendChild(sFD.sp[i]);
				}

				if (lA.sp == 0/* && settings.search_spotify === true*/) {
					//search for a spotify release listing
				}
				break;

			case 'tidal':
				for (i = 0, len = l.length; i < len; i++) {
					if (lC[i] == 'checked') continue;

					if (/https?:\/\/(listen\.)?tidal\.com\/([a-z]{2}\/store\/)?album\/\d+/.test(l[i])) {
						id = l[i].split('/album/')[1];
						sL.td.push(id);
						lA.td++;
						lC[i] = 'checked';
					}
				}

				sFD.td.length = sL.td.length * 2;

				for (i = 0, len = sL.td.length; i < len; i++) {

					sFD.td[i * 2] = document.createElement('div');
					sFD.td[i * 2].classList.add('tidal-embed');
					sFD.td[i * 2].classList.add('tidal_iframe');
					sFD.td[i * 2].setAttribute('data-type', 'a');
					sFD.td[i * 2].setAttribute('data-id', sL.td[i]);
					sFD.td[i * 2 + 1] = document.createElement('script');
					sFD.td[i * 2 + 1].setAttribute('src', 'https://embed.tidal.com/tidal-embed.js');

					epP.l1.appendChild(sFD.td[i * 2]);
					epP.l1.appendChild(sFD.td[i * 2 + 1]);
				}

				if (lA.td == 0 && settings.search_tidal === true) {
					//search for a tidal release listing
				}
				break;

			default:
		}
	}

	function addPanel() {
		var boxes, i, len;

		tD = eval(sites[site].descriptionSelector);

		if (settings.position_above === true) {
			tD.parentNode.insertBefore(epP.l1, tD);

		} else {

			if (tD.nextSibling === null) {
				tD.parentNode.appendChild(epP.l1);

			} else {
				tD.parentNode.insertBefore(epP.l1, tD.nextSibling);

			}
		}

		return 'That\'s all she wrote.';
	}
})();