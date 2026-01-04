// ==UserScript==
// @id             red-toggle-formats
// @name           Gazelle: Toggle Format Visibility
// @namespace      gocartman
// @author         gocartman
// @version        4.1
// @description    Hide formats with your discretion.

// @include        http*://*redacted.ch/torrents.php*
// @include        http*://*redacted.ch/artist.php?id=*
// @include        http*://*redacted.ch/bookmarks.php?p*
// @include        http*://*redacted.ch/collages.php*

// @match          *://*.redacted.ch/torrents.php*
// @match          *://*.redacted.ch/artist.php?id=*
// @match          *://*.redacted.ch/bookmarks.php?*
// @match          *://*.redacted.ch/collages.php*

// @include        http*://*apollo.rip/torrents.php*
// @include        http*://*apollo.rip/artist.php?id=*
// @include        http*://*apollo.rip/bookmarks.php*
// @include        http*://*apollo.rip/collages.php*

// @match          *://*.apollo.rip/torrents.php*
// @match          *://*.apollo.rip/artist.php?id=*
// @match          *://*.apollo.rip/bookmarks.php*
// @match          *://*.apollo.rip/collages.php?*



// @grant          none
// @updated        03 AUG 2017
// @since          03 AUG 2017
// @downloadURL https://update.greasyfork.org/scripts/31988/Gazelle%3A%20Toggle%20Format%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/31988/Gazelle%3A%20Toggle%20Format%20Visibility.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var strg, hide;

	// S T O R A G E HANDLE
	strg = {
		on: (function () { try { var a, b = localStorage, c = Math.random().toString(16).substr(2, 8); b.setItem(c, c); a = b.getItem(c); return a === c ? !b.removeItem(c) : false; } catch (e) { return false; } }()),
		read: function (key) { return this.on ? JSON.parse(localStorage.getItem(key)) : false; },
		save: function (key, dat) { return this.on ? !localStorage.setItem(key, JSON.stringify(dat)) : false; },
		wipe: function (key) { return this.on ? !localStorage.removeItem(key) : false; },
		zero: function (o) { var k; for (k in o) { if (o.hasOwnProperty(k)) { return false; } } return true; },
		grab: function (key, def) { var s = strg.read(key); return strg.zero(s) ? def : s; }
	};

	hide = {
		loc: document.querySelector('.sidebar') || document.querySelector('.linkbox'),
		anc: (document.getElementById('discog_table') || document.querySelector('.torrent_table')).querySelectorAll('a[href^="torrents.php?id="],a[onclick]'),
		str: document.querySelectorAll('.edition_info > strong'),

		typ: ['CD', 'Vinyl', 'WEB', 'SACD', 'DVD', 'DAT', 'Cassette', 'BD', 'Soundboard'],
		cod: ['FLAC', 'Ogg', 'AAC', 'AC3', 'DTS', 'MP3'],
		enc: ['192', 'APS', 'V2', 'V1', '256', 'APX', 'V0', '320', '/ Lossless', '24bit Lossless'],
		lch: ['Scene', 'Freeleech', 'Neutral Leech', 'Reported', 'Bad'],

		hid: strg.read('togglesettings2') || [],

		div: document.createElement('div'),

		init: function () {
			var tog = this, s = document.createElement('style'), top = document.getElementsByTagName('head')[0],
				css = '.hider-f { text-decoration: line-through } #format-hide { text-align: center; margin: 3px 0px }';

			s.type = 'text/css';
			s.textContent = css;
			top.appendChild(s);

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
		slink: function (t) {
			var s = document.createElement('span');
			s.data = t;
			s.textContent = t.replace(/(?:\/|\\)/, '');
			s.id = 'togformatvis_' + s.textContent.replace(/(?:\s)/, '');
			s.style.cursor = 'pointer';
			s.addEventListener('click', this.change.bind(this), false);
			s.setAttribute('onmousedown', 'return false;');
			this.div.appendChild(s);
			this.div.appendChild(document.createTextNode(' '));
		},
		create: function (a, b) {
			var x = -1, y = a.length;
			while (++x < y) {
				this.slink(a[x]);
			}
			switch (b) {
			case 1:
				this.div.appendChild(document.createElement('br'));
				break;
			case 2:
				this.div.appendChild(document.createTextNode(' \u00D7 '));
				break;
			default:
				break;
			}
		},
		generate: function () {
			this.create(this.typ, 1);
			this.create(this.cod, 2);
			this.create(this.enc, 2);
			this.create(this.lch);
		},
		change: function (e) {
			var el = e.target, idx = this.hid.indexOf(el.data), idz = (this.typ.indexOf(el.data) !== -1);
			el.className = el.className === 'hider-f' ? 'hider-o' : 'hider-f';

			// console.log(idx === -1);
			if (idx === -1) {
				this.hid.push(el.data);
				this.toggle(this.hid, idz, false);
			} else {
				this.hid.splice(idx, 1);
				this.toggle([el.data], idz, true);
			}

			// console.log(this.hid);
		},
		expression: function (a, isMedia) {
			var reg = '(?:' + a.join('|') + ')\\b';
			return isMedia ? '\\b' + reg : reg;
		},
		toggle: function (a, isMedia, show) {
			// console.log(a, isMedia, show);
			var p, q, r = a.length > 0 ? this.expression(a, isMedia) : false, elements = !isMedia ? this.anc : this.str;
			if (r) {
				strg.save('togglesettings2', this.hid);
				r = new RegExp(r, 'i');
				// console.log(r, elements);

				Array.from(elements).forEach(function (e) {
					if (r.test(e.textContent)) {
						if (isMedia) {
							p = e.querySelector('a');
							show ? (p.textContent === '-' ? false : hide.click(p)) : p.textContent === '+' ? false : hide.click(p);
						} else {
							show ? e.parentNode.parentNode.removeAttribute('style') : e.parentNode.parentNode.setAttribute('style', 'display:none');
						}
					}
				});
			}
		},
		mark: function () {
			console.log('mark');
			Array.from(this.hid).forEach(function (text) {
				var el = document.getElementById('togformatvis_' + text.replace(/(?:\/|\\|\s)/g, ''));
				el.className = 'hider-f';
			});
		},
		click: function (el) {
			var evt;
			if (el.click) {
				el.click();
			} else {
				evt = document.createEvent('MouseEvents');
				evt.initEvent('click', true, true);
				el.dispatchEvent(evt);
			}
		}
	};

	hide.init();

}());