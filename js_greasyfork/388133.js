// ==UserScript==
// @name         Supraphonline foobar2000 tagging support
// @name:cs      Supraphonline podpora tagování ve foobar2000
// @name:en      Supraphonline foobar2000 tagging support
// @namespace    https://greasyfork.org/cs/users/321857-anakunda
// @version      1.49
// @description  Kopíruje metadata alba ve formátu pro aplikaci tagů ve foobar2000
// @description:cs  Kopíruje metadata alba ve formátu pro aplikaci tagů ve foobar2000
// @description:en  Copies album metadata to clipboard in machine parseable format
// @author       Anakunda
// @copyright    2024, Anakunda (https://openuserjs.org/users/Anakunda)
// @license      GPL-3.0-or-later
// @iconURL      https://www.supraphonline.cz/favicon.ico
// @match        https://*.supraphonline.cz/*
// @match        https://supraphonline.cz/*
// @match        http://*.supraphonline.cz/*
// @match        http://supraphonline.cz/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        window.onurlchange
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @downloadURL https://update.greasyfork.org/scripts/388133/Supraphonline%20foobar2000%20tagging%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/388133/Supraphonline%20foobar2000%20tagging%20support.meta.js
// ==/UserScript==

// Výraz pro 'Automatically Fill Values' funkci ve foobaru2000:
//   %album artist%%album%%date%%releasedate%%genre%%label%%catalog%%discnumber%%totaldiscs%%discsubtitle%%tracknumber%%totaltracks%%artist%%title%%performer%%composer%%lyricist%%writer%%arranger%%media%%comment%%url%

'use strict';

Array.prototype.includesCaseless = function(str) {
	if (typeof str != 'string') return false;
	str = str.toLowerCase();
	return this.some(elem => typeof elem == 'string' && elem.toLowerCase() == str);
};
Array.prototype.pushUnique = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includes(it)) this.push(it) });
	return this.length;
};
Array.prototype.pushUniqueCaseless = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includesCaseless(it)) this.push(it) });
	return this.length;
};
Array.prototype.equalTo = function(arr) {
	return Array.isArray(arr) && arr.length == this.length
	&& Array.from(arr).sort().toString() == Array.from(this).sort().toString();
};
Array.prototype.equalCaselessTo = function(arr) {
	function adjust(elem) { return typeof elem == 'string' ? elem.toLowerCase() : elem }
	return Array.isArray(arr) && arr.length == this.length
	&& arr.map(adjust).sort().toString() == this.map(adjust).sort().toString();
};

function joinArtists(arr, decorator = artist => artist) {
	if (!Array.isArray(arr)) return null;
	if (arr.some(artist => artist.includes('&'))) return arr.map(decorator).join(', ');
	if (arr.length < 3) return arr.map(decorator).join(' & ');
	return arr.slice(0, -1).map(decorator).join(', ') + ' & ' + decorator(arr.slice(-1).pop());
}

function timeStringToTime(str) {
	if (!/(-\s*)?\b(\d+(?::\d{2})*(?:\.\d+)?)\b/.test(str)) return null;
	var t = 0, a = RegExp.$2.split(':');
	while (a.length > 0) t = t * 60 + parseFloat(a.shift());
	return RegExp.$1 ? -t : t;
}

function normalizeDate(str, countryCode = undefined) {
	if (typeof str != 'string') return null;
	var match;
	function formatOutput(yearIndex, montHindex, dayIndex) {
		var year = parseInt(match[yearIndex]), month = parseInt(match[montHindex]), day = parseInt(match[dayIndex]);
		if (year < 30) year += 2000; else if (year < 100) year += 1900;
		if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 0 || day > 31) return null;
		return year.toString() + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
	}
	if ((match = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // US
	if ((match = /\b(\d{4})\/(\d{1,2})\/(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3);
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null
			&& (parseInt(match[1]) > 12 || /\b(?:be|it)/.test(countryCode))) return formatOutput(3, 2, 1); // BE, IT
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null) return formatOutput(3, 1, 2); // US
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // UK, IE, FR, ES
	if ((match = /\b(\d{1,2})-(\d{1,2})-((?:\d{2}|\d{4}))\b/.exec(str)) != null) return formatOutput(3, 2, 1); // NL
	if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // CZ, DE
	if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{2})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // AT, CH, DE, LU
	if ((match = /\b(\d{4})\. *(\d{1,2})\. *(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // JP
	return extractYear(str);
}

function extractYear(expr) {
	if (typeof expr == 'number') return Math.round(expr);
	if (typeof expr != 'string') return null;
	if (/\b(\d{4})\b/.test(expr)) return parseInt(RegExp.$1);
	let d = new Date(expr);
	return parseInt(isNaN(d) ? expr : d.getUTCFullYear());
}

function durationFromMeta(elem) {
	if (!(elem instanceof HTMLElement)) return undefined;
	let meta = elem.querySelector('meta[itemprop="duration"][content]');
	if (meta == null) return undefined;
	let m = /^PT?(?:(?:(\d+)H)?(\d+)M)?(\d+)S$/i.exec(meta.content);
	if (m != null) return (parseInt(RegExp.$1) || 0) * 60**2 + (parseInt(RegExp.$2) || 0) * 60 + (parseInt(RegExp.$3) || 0);
	return (m = timeStringToTime(meta.content)) != null ? m : undefined;
}

let requestTimestamp, requestCounter = 0;
const fetchTrackDetails = url => new Promise((resolve, reject) => (function request() {
	if (!requestTimestamp || Date.now() >= requestTimestamp)
		[requestTimestamp, requestCounter] = [Date.now() + 10e3, 0];
	if (++requestCounter > 30) setTimeout(request, requestTimestamp - Date.now());
	else LocalXHR.get(url, { fatalErrors: [503] }).then(({document}) => { resolve(document) },
		reason => { /^HTTP error 503\b/.test(reason) ? setTimeout(request, 10e3) : reject(reason) });
})());

function fetchAlbum(evt) {
	const currentTarget = evt.currentTarget;
	if (currentTarget.disabled) return; else currentTarget.disabled = true;
	currentTarget.textContent = 'Pracuji...';
	let tracks = [ ], discNumber = 0, discSubtitle, ref, media, encoding, format, bitdepth,
			trackIdentifiers, releaseDate, samplerate, catalogue, imgUrl, album, totalTracks, albumYear,
			label, identifiers = { };
	const vaParser = /^(?:Various(?:\s+Artists)?|Varios(?:\s+Artistas)?|V\/?A|\<various\s+artists\>|Různí(?:\s+interpreti)?)$/i;
	const pseudoArtistParsers = [
		/^(?:#??N[\/\-]?A|[JS]r\.?)$/i,
		/^(?:traditional|trad\.|lidová)$/i,
		/\b(?:traditional|trad\.|lidová)$/,
		/^(?:tradiční|lidová)\s+/,
		/^(?:[Aa]nonym)/,
		/^(?:[Ll]iturgical\b|[Ll]iturgick[áý])/,
		/^(?:auditorium|[Oo]becenstvo|[Pp]ublikum)$/,
		/^(?:Various\s+Composers)$/i,
		/^(?:Guests|Friends)$/i,
	];
	const VA = 'Various Artists';
	const artistClassParsers = [
		/*  0 */ [/^(?:Main\s?Artist)$/i],
		/*  1 */ [/^(?:Featured\s?Artist)$/i],
		/*  2 */ [/^(?:Remix)/i],
		/*  3 */ [/(?:^(?:Composer|music|music\simprovisation))$/i],
		/*  4 */ [/^(?:Conductor|(?:Chorus|Choir)\s?Master|Director|conducts|(?:conducted|directed)[\s\-]by)$/i],
		/*  5 */ [/^(?:DJ|Compiler|Compiled[\s\-]By|compiled[\s\-]by)$/],
		/*  6 */ [/^(?:Producer|produced[\s\-]by)$/i],
		/*  7 */ [/^(?:Artist|Soloist|Vocals|Ensemble|Orchestra|Choir)$/i],
		/*  8 */ [
			/\b(?:Recorded|Engineer|Producer|Mixer|Programming|Programmer|Arranger|Assistant|Translation)\b/i,
			/(?:PersonnelMastering)\b/i,
		],
		/*  9 */ [/^(?:Arranger|Arranged[\-\s]By)$/i],
		/* 10 */ [/(?:^(?:(?:Composer)?Lyricist|libreto)|\b(?:lyrics))$/i],
		/* 11 */ [/(?:^(?:Author|Writer|written[\s\-]by))$/i],
	];
	if (/\/album\/(\d+)\b/i.test(document.URL)) identifiers.SUPRAPHONLINE_ID = parseInt(RegExp.$1);
	let artist = Array.from(document.querySelectorAll('div.visible-lg-block > h2.album-artist > a'))
		.map(a => a.title || a.textContent.trim());
	let isVA = (ref = document.querySelector('span[itemprop="byArtist"] > meta[itemprop="name"]')) != null ?
		vaParser.test(ref.content) : artist.length <= 0;
	if ((ref = document.querySelector('h1[itemprop="name"]')) != null) album = ref.firstChild.data.trim();
	if ((ref = document.querySelector('meta[itemprop="numTracks"]')) != null) totalTracks = parseInt(ref.content);
	let genres = (ref = document.querySelector('meta[itemprop="genre"]')) != null ? ref.content : undefined;
	if ((ref = document.querySelector('li.album-version > div.selected > div')) != null) {
		if (/\b(?:MP3)\b/.test(ref.textContent))
			[media, encoding, format] = ['Digital Media', 'lossy', 'MP3'];
		if (/\b(?:FLAC)\b/.test(ref.textContent))
			[media, encoding, format, bitdepth] = ['Digital Media', 'lossless', 'FLAC', 16];
		if (/\b(?:Hi[\s\-]*Res)\b/.test(ref.textContent))
			[media, encoding, format, bitdepth] = ['Digital Media', 'lossless', 'FLAC', 24];
		if (/\b(?:CD)\b/.test(ref.textContent)) media = 'CD';
		if (/\b(?:LP)\b/.test(ref.textContent)) media = 'Vinyl';
	}
	const copyrightParser = /^(?:\([CP]\)|©|℗)$/i;
	document.querySelectorAll('ul.summary > li').forEach(function(li) {
		if (li.childElementCount <= 0) return;
		let key = li.firstElementChild.textContent, value = li.lastChild.textContent.trim();
		if (key.includes('Nosič')) media = value;
		if (key.includes('Datum vydání')) releaseDate = normalizeDate(value, 'cs');
		if (key.includes('První vydání')) albumYear = extractYear(value);
		if (key.includes('Žánr')) genres = translateGenre(value);
		if (key.includes('Vydavatel')) label = value;
		if (key.includes('Katalogové číslo')) catalogue = value;
		if (key.includes('Formát')) {
			if (/\b(?:FLAC|WAV|AIFF?)\b/.test(value)) { encoding = 'lossless'; format = 'FLAC' }
			if (/\b(\d+)[\-\s]?bits?\b/i.test(value)) bitdepth = parseInt(RegExp.$1);
			if (/\b([\d\.\,]+)[\-\s]?kHz\b/.test(value)) samplerate = parseFloat(RegExp.$1.replace(',', '.')) * 1000;
		}
		//if (key.includes('Celková stopáž')) totalTime = timeStringToTime(value);
		if (copyrightParser.test(key) && !albumYear) albumYear = extractYear(value);
	});
	const creators = ['autoři', 'interpreti', 'tělesa', 'digitalizace'];
	let artists = [ ], ndx;
	for (let i = 0; i < creators.length; ++i) artists[i] = {};
	document.querySelectorAll('ul.sidebar-artist > li').forEach(function(it) {
		if ((ref = it.querySelector('h3')) != null) {
			ndx = undefined;
			creators.forEach((it, _ndx) => { if (ref.textContent.includes(it)) ndx = _ndx });
		} else {
			if (typeof ndx != 'number') return;
			if (ndx == 2) var role = 'ensemble';
			else if ((ref = it.querySelector('span')) != null) role = translateRole(ref);
			if ((ref = it.querySelector('a')) != null) {
				if (!Array.isArray(artists[ndx][role])) artists[ndx][role] = [];
				artists[ndx][role].pushUnique([ref.textContent.trim(), document.location.origin + ref.pathname]);
			}
		}
	});
	let description = Array.from(document.querySelectorAll('div[itemprop="description"] p'))
		.map(p => p.textContent.trim()).join('\n\n').replace(/\s+/g, ' ');
	let performers = [ ], composer = [ ], conductor = [ ], DJs = [ ], albumGuests = [ ], lyricist = [ ],
			writer = [ ], arranger = [ ], volMedia;
	for (let i = 1; i < 3; ++i) Object.keys(artists[i]).forEach(function(role) { // performers
		var a = artists[i][role].map(a => a[0]);
		([
			'conductor', 'choirmaster', 'director',
		].includes(role) ? conductor : role == 'DJ' ? DJs : [
			'FeaturedArtist',
		].includes(role) ? albumGuests : artist).pushUnique(...a);
	});
	Object.keys(artists[0]).forEach(function(role) { // composers
		composer.pushUnique(...artists[0][role].map(it => it[0])
			.filter(it => !pseudoArtistParsers.some(rx => rx.test(it))));
	});
	if ((ref = document.querySelector('meta[itemprop="image"]')) != null) imgUrl = ref.content.replace(/\?.*$/, '');
	const totalDiscs = document.querySelectorAll('table.table-tracklist > tbody > tr.cd-header').length;
	document.querySelectorAll('table.table-tracklist > tbody > tr').forEach(function(tr, index) {
		if (tr.classList.contains('cd-header') && (ref = tr.querySelector('td > h3')) != null
				&& /\b(?:(\S*?)\s*)?(\d+)\b/.test(ref.textContent)) {
			volMedia = RegExp.$1 ? RegExp.lastMatch : undefined;
			++discNumber; // = parseInt(RegExp.$2) || undefined;
		}
		if (tr.classList.contains('song-header') && (ref = tr.querySelector('td')) != null)
			discSubtitle = ref.title || ref.textContent.trim();
		if (tr.classList.contains('track') && tr.id) {
			trackIdentifiers = { TRACK_ID: /^(?:track)-(\d+)$/i.exec(tr.id) };
			if (trackIdentifiers.TRACK_ID != null) trackIdentifiers.TRACK_ID = parseInt(trackIdentifiers.TRACK_ID[1]);
			else delete trackIdentifiers.TRACK_ID;
			if (volMedia) trackIdentifiers.VOL_MEDIA = volMedia;
			let track = {
				artist: isVA ? VA : undefined,
				artists: !isVA && artist.length > 0 ? artist : undefined,
				//featured_artists: albumGuests.length > 0 ? albumGuests : undefined,
				album: album,
				album_year: /*trackYear || */albumYear || undefined,
				release_date: releaseDate,
				label: label,
				catalog: catalogue,
				encoding: encoding,
				codec: format,
				bitdepth: bitdepth,
				samplerate: samplerate || undefined,
				media: media,
				genre: genres,
				disc_number: discNumber || 1,
				total_discs: totalDiscs > 0 ? totalDiscs : 1,
				disc_subtitle: discSubtitle,
				track_number: /^\s*(\d+)\.?\s*$/.test(tr.children[0].firstChild.textContent) ?
				parseInt(RegExp.$1) || RegExp.$1 : undefined,
				total_tracks: totalTracks,
				title: (ref = tr.querySelector('meta[itemprop="name"][content]')) != null ? ref.content
					: (ref = tr.querySelector('td > a.trackdetail')) != null ? ref.textContent.trim() : undefined,
				performers: performers.length > 0 ? performers : undefined,
				composers: composer.length > 0 ? composer : undefined,
				lyricists: lyricist.length > 0 ? lyricist : undefined,
				writers: writer.length > 0 ? writer : undefined,
				arrangers: arranger.length > 0 ? arranger : undefined,
				conductors: conductor.length > 0 ? conductor : undefined,
				compilers: DJs.length > 0 ? DJs : undefined,
				duration: durationFromMeta(tr),
				url: document.location.origin + document.location.pathname,
				description: description,
				identifiers: mergeIds(),
				cover_url: imgUrl,
			};
			tracks.push((function(track) {
				if ((ref = tr.querySelector('td > a.trackdetail')) == null) return Promise.reject('link not found');
				return fetchTrackDetails(ref.pathname + ref.search).then(function(document) {
					let detail = document.body.querySelector('div[data-swap="trackdetail-' + track.identifiers.TRACK_ID + '"] > div > div.row');
					if (detail == null) return Promise.reject('element not found');
					detail.querySelectorAll('div[class]:nth-of-type(1) > ul > li').forEach(function(li) {
						var key = li.querySelector('span'), value = li.lastChild;
						if (key == null || value.nodeType != Node.TEXT_NODE) return;
						key = key.textContent.trim(); value = value.wholeText.trim();
						if (!key || !value) return;
						if (key.startsWith('Žánr')) track.genre = value;
						if (key.startsWith('Nahrávka dokončena')) track.rec_year = extractYear(value);
						if (key.startsWith('Místo nahrání')) track.venue = value;
						if (key.startsWith('Rok prvního vydání')) track.pub_year = extractYear(value);
						if (copyrightParser.test(key)) track.copyright = value;
					});
					let trackArtists = [ ];
					for (let i = 0; i < 12; ++i) trackArtists[i] = [ ];
					detail.querySelectorAll('div[class]:nth-of-type(2) > ul > li').forEach(function(li) {
						var role = li.querySelector('span');
						var artists = Array.from(li.getElementsByTagName('a')).map(a => a.textContent.trim())
							.filter(artist => !pseudoArtistParsers.some(rx => rx.test(artist)));
						if (role != null && artists.length > 0) role = translateRole(role); else return;
						if (artistClassParsers[2].some(rx => rx.test(role)))
							trackArtists[2].pushUnique(...artists);
						else if (artistClassParsers[3].some(rx => rx.test(role)))
							trackArtists[3].pushUnique(...artists);
						else if (artistClassParsers[9].some(rx => rx.test(role)))
							trackArtists[9].pushUnique(...artists);
						else if (artistClassParsers[10].some(rx => rx.test(role)))
							trackArtists[10].pushUnique(...artists);
						else if (artistClassParsers[11].some(rx => rx.test(role)))
							trackArtists[11].pushUnique(...artists);
						else if (artistClassParsers[5].some(rx => rx.test(role)))
							trackArtists[5].pushUnique(...artists);
						else if (artistClassParsers[6].some(rx => rx.test(role)))
							trackArtists[6].pushUnique(...artists);
						else if (role.toLowerCase() == 'performer' || !artistClassParsers[8].some(rx => rx.test(role))) {
							if (artistClassParsers[0].some(rx => rx.test(role)))
								trackArtists[0].pushUnique(...artists);
							else if (artistClassParsers[1].some(rx => rx.test(role)))
								trackArtists[1].pushUnique(...artists);
							else if (artistClassParsers[4].some(rx => rx.test(role)))
								trackArtists[4].pushUnique(...artists);
							else artists.forEach(_artist => {
								if (artist.includesCaseless(_artist)) trackArtists[0].pushUnique(_artist);
								else if (artistClassParsers[7].some(rx => rx.test(role))) trackArtists[1].pushUnique(_artist);
							});
							trackArtists[7].pushUnique(...artists.map(artist => artist + ' (' + role + ')'));
						}
					});
					if (trackArtists[1].length > 0 && trackArtists[0].length <= 0) {
						trackArtists[0] = trackArtists[1]; trackArtists[1] = [];
					}
					if (trackArtists[0].length > 0 && (isVA || !trackArtists[0].equalCaselessTo(artist)
							|| trackArtists[1].length > 0/*!trackArtists[1].equalCaselessTo(albumGuests)*/)) {
						track.track_artists = trackArtists[0];
						if (trackArtists[1].length > 0) track.track_guests = trackArtists[1];
					}
					[
						[2, 'remixer'],
						[3, 'composer'],
						[4, 'conductor'],
						[5, 'compiler'],
						//[6, 'producer'],
						[7, 'performer'],
						[9, 'arranger'],
						[10, 'lyricist'],
						[11, 'writer'],
					].forEach(def => { if (trackArtists[def[0]].length > 0) track[def[1] + 's'] = trackArtists[def[0]] })
					return track;
				});
			})(track).catch(function(reason) {
				console.error('Supraphonline parser failed to get track', index + 1, 'detail:', reason);
				return Promise.resolve(track);
			}));
		} // track
	});
	Promise.all(tracks).then(tracks => tracks.map(track => {
		if (Array.isArray(track.track_artists) && track.track_artists.length > 0) {
			var trackArtist = joinArtists(track.track_artists);
			if (Array.isArray(track.track_guests) && track.track_guests.length > 0)
				trackArtist += ' feat. ' + joinArtists(track.track_guests);
		}
		return [
			isVA ? VA : joinArtists(track.artists) || '',
			track.album || '',
			track.album_year || track.pub_year || '',
			track.release_date || '',
			track.genre || '',
			track.label || '',
			track.catalog || '',
			track.disc_number || '',
			track.total_discs > 1 ? track.total_discs : '',
			track.disc_subtitle || '',
			track.track_number || '',
			tracks.filter(_track => _track.disc_number == track.disc_number).length || track.total_tracks || '',
			trackArtist || (Array.isArray(track.artists) && track.artists.length > 0 ?
				joinArtists(track.artists) : track.artist) || '',
			track.title || '',
			(track.performers || [ ]).join(', '),
			(track.composers || [ ]).join(', '),
			(track.lyricists || [ ]).join(', '),
			(track.writers || [ ]).join(', '),
			(track.arrangers || [ ]).join(', '),
			track.media,
			track.description,
			track.url,
		].join('\x1E');
	}).join('\n')).then(clipBoard => { GM_setClipboard(clipBoard, 'text') }).catch(e => { alert(e) }).then(function() {
		[currentTarget.disabled, currentTarget.textContent] = [false, '✔'];
		currentTarget.style.backgroundColor = 'green';
		setTimeout(function(button) {
			button.style.backgroundColor = null;
			button.textContent = button.dataset.originalText;
		}, 5000, currentTarget);
	});

	function translateGenre(genre) {
		if (!genre || typeof genre != 'string') return undefined;
		[
			['Orchestrální hudba', 'Orchestral Music'],
			['Komorní hudba', 'Chamber Music'],
			['Vokální', 'Classical, Vocal'],
			['Klasická hudba', 'Classical'],
			['Melodram', 'Classical, Melodram'],
			['Symfonie', 'Symphony'],
			['Vánoční hudba', 'Christmas Music'],
			[/^(?:Alternativ(?:ní|a))$/i, 'Alternative'],
			['Dechová hudba', 'Brass Music'],
			['Elektronika', 'Electronic'],
			['Folklor', 'Folclore, World Music'],
			['Instrumentální hudba', 'Instrumental'],
			['Latinské rytmy', 'Latin'],
			['Meditační hudba', 'Meditative'],
			['Vojenská hudba', 'Military Music'],
			['Pro děti', 'Children'],
			['Pro dospělé', 'Adult'],
			['Mluvené slovo', 'Spoken Word'],
			['Audiokniha', 'audiobook'],
			['Humor', 'humour'],
			['Pohádka', 'Fairy-Tale'],
		].forEach(function(subst) {
			if (typeof subst[0] == 'string' && genre.toLowerCase() == subst[0].toLowerCase()
					|| subst[0] instanceof RegExp && subst[0].test(genre)) genre = subst[1];
		});
		return genre;
	}

	function translateRole(elem) {
		return elem instanceof HTMLElement ? [
			[/\b(?:klavír)\b/ig, 'piano'],
			[/\b(?:housle)\b/ig, 'violin'],
			[/\b(?:violoncello)\b/ig, 'cello'],
			[/\b(?:viola)\b/ig, 'alto'],
			[/\b(?:varhany)\b/ig, 'organ'],
			[/\b(?:cembalo)\b/ig, 'harpsichord'],
			[/\b(?:trubka)\b/ig, 'trumpet'],
			[/\b(?:soprán)\b/ig, 'soprano'],
			[/\b(?:alt)\b/ig, 'alto'],
			[/\b(?:baryton)\b/ig, 'baritone'],
			[/\b(?:bas)\b/ig, 'basso'],
			[/\b(?:akordeon)\b/ig, 'accordion'],
			[/\b(?:syntezátor)\b/ig, 'synthesizer'],
			[/\b(?:klávesové nástroje)\b/ig, 'keyboards'],
			[/\b(?:bicí)\b/ig, 'drums'],
			[/\b(?:kontrabas)\b/ig, 'double-bass'],
			[/\b(?:zpěv|vokál)\b/ig, 'vocals'],
			[/\b(?:baskytara)\b/ig, 'bass guitar'],
			[/\b(?:havajská kytara)\b/ig, 'steel guitar'],
			[/\b(?:akustická kytara)\b/ig, 'acoustic guitar'],
			[/\b(?:kytara)\b/ig, 'guitar'],
			[/\b(?:kytary)\b/ig, 'guitars'],
			[/(?:čte|četba)\b/ig, 'narration'],
			[/\b(?:vypravuje)\b/ig, 'narration'],
			[/\b(?:hudební těleso)\b/ig, 'ensemble'],
			[/\b(?:Umělec)\b/ig, 'Artist'],
			[/\b(?:improvizace)\b/ig, 'improvisation'],
			['český', 'czech'],
			['původní', 'original'],
			[/\b(?:text)\b/ig, 'lyrics'],
			[/\b(?:hudba)\b/ig, 'music'],
			['hudební', 'music'],
			[/\b(?:autor)\b/ig, 'author'],
			[/\b(?:překlad)\b/ig, 'translation'],
			['účinkuje', 'participating'],
			['hovoří a zpívá', 'speaks and sings'],
			['hovoří', 'spoken by'],
			['komentář', 'commentary'],
			[/\b(?:dirigent)\b/ig, 'conductor'],
			['řídí', 'director'],
			[/\b(?:sbormistr)\b/ig, 'choirmaster'],
			['programování', 'programming'],
			[/\b(?:produkce)\b/ig, 'produced by'],
			['nahrál', 'recorded by'],
			[/\b(?:digitální přepis)\b/ig, 'A/D transfer'],
		].reduce((r, def) => r.replace(...def), elem.textContent.trim().replace(/\s*:.*$/, '')) : undefined;
	}

	function mergeIds() {
		const r = Object.assign({}, identifiers, trackIdentifiers);
		trackIdentifiers = {};
		return r;
	}
}

function addButton() {
	if (!document.location.pathname.startsWith('/album/')) return;
	const container = document.body.querySelector('form.table-action'), id = 'copy-info-to-clipboard';
	if (container == null || container.querySelector('button#' + id) != null) return;
	const button = Object.assign(document.createElement('button'), {
		id: id,
		type: 'button',
		className: 'btn btn-danger topframe_login',
		textContent: 'Kopírovat do schránky',
		style: 'margin-right: 10px;',
		onclick: fetchAlbum,
	});
	button.dataset.originalText = button.textContent;
	container.prepend(button);
};
addButton();
window.onurlchange = addButton;
