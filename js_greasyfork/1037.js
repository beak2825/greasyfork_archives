// ==UserScript==
// @id             what-toggle-formats
// @name           Gazelle: Toggle Format Visibility
// @namespace      hateradio)))
// @author         hateradio
// @version        4.2
// @description    Hide formats with your discretion.
// @include        https://redacted.sh/torrents.php*
// @include        https://redacted.sh/artist.php?id=*
// @include        https://redacted.sh/bookmarks.php*
// @include        https://redacted.sh/collages.php*
// @include        https://redacted.sh/top10.php*

// @include        https://orpheus.network/torrents.php*
// @include        https://orpheus.network/artist.php?id=*
// @include        https://orpheus.network/bookmarks.php*
// @include        https://orpheus.network/collages.php*
// @include        https://orpheus.network/top10.php*


// @grant          none
// @updated        07 DEC 2024
// @since          28 OCT 2010
// @downloadURL https://update.greasyfork.org/scripts/1037/Gazelle%3A%20Toggle%20Format%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/1037/Gazelle%3A%20Toggle%20Format%20Visibility.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// P O L Y
	if (!Element.prototype.matches)
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

	if (!Element.prototype.closest) {
		Element.prototype.closest = function (s) {
			let el = this;
			if (!document.documentElement.contains(el)) return null;
			do {
				if (el.matches(s)) return el;
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);
			return null;
		};
	}


	// O N HELPER
	const on = (element, type, selector, listener) => {
		element.addEventListener(type, event => {
			const onTarget = event.target.closest(selector);
			if (onTarget) {
				event.onTarget = onTarget;
				listener(event);
			}
		}, false);
	};

	// S T O R A G E HANDLE
	const strg = {
		on: (function () { try { let a, b = localStorage, c = Math.random().toString(16).substr(2, 8); b.setItem(c, c); a = b.getItem(c); return a === c ? !b.removeItem(c) : false; } catch (e) { return false; } }()),
		read: function (key) { return this.on ? JSON.parse(localStorage.getItem(key)) : false; },
		save: function (key, dat) { return this.on ? !localStorage.setItem(key, JSON.stringify(dat)) : false; },
		wipe: function (key) { return this.on ? !localStorage.removeItem(key) : false; },
		zero: function (o) { for (let k in o) { if (o.hasOwnProperty(k)) { return false; } } return true; },
		grab: function (key, def) { const s = strg.read(key); return strg.zero(s) ? def : s; }
	};


	const hide = {
		loc: document.querySelector('.sidebar') || document.querySelector('.linkbox'),

		typ: ['CD', 'Vinyl', 'WEB', 'SACD', 'DVD', 'DAT', 'Cassette', 'BD', 'Soundboard'],
		cod: ['FLAC', 'Ogg', 'AAC', 'AC3', 'DTS', 'MP3'],
		enc: ['192', 'APS', 'V2', 'V1', '256', 'APX', 'V0', '320', '/ Lossless', '24bit Lossless'],
		lch: ['Scene', 'Freeleech', 'Neutral Leech', 'Reported', 'Bad'],

		hid: strg.read('togglesettings2') || [],

		div: document.createElement('div'),

		fra: document.createDocumentFragment(),

		init: function () {
			const s = document.createElement('style'),
				css = '.hider-f { text-decoration: line-through } #format-hide { text-align: center; margin: 3px 0px } .gtfv__item { cursor: pointer }';

			s.type = 'text/css';
			s.textContent = css;
			document.head.appendChild(s);

			on(this.div, 'click', 'span', this.change.bind(this));

			// run!
			this.location();
			this.generate();
			this.toggle(this.hid);
			this.toggle(this.hid, true);
			this.mark();
		},
		location: function () {
			this.div.id = 'format-hide';
			this.div.className = 'box pad box_artists';
			this.loc.parentNode.insertBefore(this.div, this.loc);
		},
		makeSpan: function (t) {
			const s = document.createElement('span');
			s.dataset.type = t;
			s.textContent = t.replace(/(?:\/|\\)/, '');
			s.id = 'gtfv__' + encodeURIComponent(t);
			s.className = 'gtfv__item';
			return s;
		},
		create: function (formats) {
			return formats.map(this.makeSpan).forEach(s => {
				this.fra.appendChild(s);
				this.fra.appendChild(document.createTextNode(' '));
			});
		},
		generate: function () {
			this.create(this.typ);
			this.fra.appendChild(document.createElement('br'));
			this.create(this.cod);
			this.fra.appendChild(document.createTextNode(' \u00D7 '));
			this.create(this.enc);
			this.fra.appendChild(document.createElement('br'));
			this.create(this.lch);
			this.div.appendChild(this.fra);
		},
		change: function (e) {
			const el = e.onTarget,
				type = el.dataset.type,
				idx = this.hid.indexOf(type),
				media = (this.typ.indexOf(type) !== -1);

			el.classList.toggle('hider-f');

			console.log('change', type, `isMedia: ${idx === -1}`);
			if (idx === -1) { // not found, add this type to the array of hidden formats
				this.hid.push(type);
				this.toggle(this.hid, media, false);
			} else { // found, remove this type
				this.hid.splice(idx, 1);
				this.toggle([type], media, true);
			}

			console.log(this.hid);
		},
		createRegExp: function (formats, isMedia) {
			// console.log('createRegExp for', formats, isMedia);
			let reg = isMedia ? '\\b' : '';
			reg += '(?:' + formats.join('|') + ')\\b';
			reg = new RegExp(reg, 'i');
			return reg;
		},
		toggle: function (formats, isMedia, show) {
			console.debug('toggle', {formats, isMedia, show});
			const regex = formats.length > 0 ? this.createRegExp(formats, isMedia) : null;

			let root = ''

			if (regex) {
				strg.save('togglesettings2', this.hid);

				if (processors.top10.enabled) {
					root = 'top10';
				} else if (isMedia) {
					root = 'media';
				} else {
					root = 'general';
				}

				processors.$exec(root, regex, show);
			}
		},
		mark: function () {
			console.log('mark');
			Array.from(this.hid)
				.map(text => document.getElementById('gtfv__' + encodeURIComponent(text)))
				.forEach(el => el.classList.add('hider-f'));
		},
		click: function (el) {
			let evt;
			if (el.click) {
				el.click();
			} else {
				evt = document.createEvent('MouseEvents');
				evt.initEvent('click', true, true);
				el.dispatchEvent(evt);
			}
		}
	};


	const processors = {
		$exec: function (root, regex, show) {
			const action = show ? 'show' : 'hide';

			const t = processors[root];

			Array.from(t.elements())
				.filter(e => regex.test(e.textContent))
				.map(t.toElement)
				.forEach(t[action] || processors.general[action]);
		},
		general: {
			elements: () => (document.getElementById('discog_table') || document.querySelector('.torrent_table')).querySelectorAll('a[href^="torrents.php?id="],a[onclick]'),
			toElement: e => e.parentNode.parentNode,
			show: e => e.removeAttribute('style'),
			hide: e => e.setAttribute('style', 'display:none')
		},
		top10: {
			enabled: document.location.pathname === '/top10.php',
			elements: () => Array.from(document.querySelectorAll('.torrent_table .group_info strong')).map(e => e.nextSibling),
			toElement: e => e.parentElement.parentElement.parentElement
		},
		media: {
			elements: () => document.querySelectorAll('.edition_info > strong'),
			toElement: e => e.querySelector('a'),
			show: e => e.textContent !== '-' && hide.click(e),
			hide: e => e.textContent !== '+' && hide.click(e)
		}
	};

	hide.init();

}());