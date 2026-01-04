// ==UserScript==
// @name         24flac.Net v2 Extension
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.04
// @description  try to take over the world!
// @author       Anakunda
// @copyright    2020, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @match        https://24flac.net/*
// @iconURL      https://24flac.net/favicon.ico
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/412590/24flacNet%20v2%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/412590/24flacNet%20v2%20Extension.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let a = document.querySelector('center > h2 > a:first-of-type');
	if (a != null) {
		a.removeAttribute('target');
		document.location.assign(a.href);
		return;
	}

	class Article {
		is_rm() {
			return this.is_remaster || this.album_date && this.release_date
				&& this.release_date.getFullYear() > this.album_date.getFullYear();
		}
		get_minimal_artist() {
			return this.artist ? this.artist.
				replace(/\s+feat\.\s+.*/, '').
				replace(/(\S),\s+/g, '$1 & ').
				replace(/\s*\/\s*/, ' & ') : null;
		}
	};

	document.head.appendChild(document.createElement('style')).innerHTML = `
body > div.wrapper { background-color: #162b30; }
body > div.wrapper > div.wrapper-main { background-color: #162b30; }
li > a { color: sandybrown; }
span > a { color: silver; }
div.read { background-color: #ffed8260; opacity: 0.5; }
div.thumb-item__title { color: antiquewhite; }
div.styles { font-size: medium; color: burlywood; }
div.styles > span.style { color: antiquewhite; }
span.artist { color: aquamarine; }
span.album { color: #ffd000; }
span.year { color: darkorange; }

#mark-all-read {
	color: white; background-color: #847500;
	font-family: Segoe UI; font-weight: bold;
	border: solid white 2px;
	padding-left: 2em; padding-right: 2em;
}
#mark-all-read:hover { color: orange }
`;

	let div = document.createElement('div');
	div.style = 'position: fixed; top: 20px; right: 20px; z-index: 100;';
	let allReadBtn = document.createElement('button');
	//allReadBtn.style = 'text-transform: uppercase; background-color: cadetblue; color: white; font: 900 11pt "Segoe UI";';
	allReadBtn.id = 'mark-all-read';
	allReadBtn.textContent = 'Mark all read';
	allReadBtn.onclick = function(evt) {
		let highestId = 0;
		function scanPage(page = 1) {
			localXHR('/page/' + page ).then(function(dom) {
				let ids = Array.from(dom.querySelectorAll('div#dle-content > div.thumb-item a.thumb-item__link'))
					.map(a => /\/(\d+)\b/.test(a.pathname) ? parseInt(RegExp.$1) : null).filter(articleId => articleId > 0);
				let pageHighestId = Math.max(...ids);
				if (pageHighestId > highestId) {
					highestId = pageHighestId;
					scanPage(page + 1);
				} else {
					GM_setValue('lastRead', highestId);
					document.location.reload(true);
				}
			});
		}

		scanPage();
	};
	div.append(allReadBtn);
	document.body.append(div);
	let navBar = document.querySelector('div#dle-content > div.pagination ');
	if (navBar != null) navBar.parentNode.prepend(navBar.cloneNode(true));
	let lastRead = GM_getValue('lastRead');
	document.querySelectorAll('div#dle-content > div.thumb-item').forEach(function(div) {
		let url = div.querySelector('a.thumb-item__link');
		if (url == null) {
			console.warn('wrong structure', article);
			return;
		}
		if (/\/(\d+)\b/.test(url.pathname) && parseInt(RegExp.$1) <= lastRead) {
			div.classList.add('read');
			return;
		}
		localXHR(url).then(function(dom) {
			let article = loadArticleFromPage(dom);
			if (article == null || !article.album) {
				console.warn('No or incomplete article from', url);
				return;
			}
			if (article.id) div.id = article.id;
			let title = div.querySelector('div.thumb-item__title');
			if (title != null) {
				title.innerHTML = '';
				let span = document.createElement('span'); span.className = 'artist'; span.textContent = article.artist;
				title.append(span);
				title.append(' - ');
				span = document.createElement('span'); span.className = 'album'; span.textContent = article.album;
				title.append(span);
				title.append(' (');
				span = document.createElement('span'); span.className = 'year'; span.textContent = article.album_date.getFullYear();
				title.append(span);
				title.append(')');
			}
			computeArticleQuality(article);
			let thumb = div.querySelector('div.thumb-item__img'), img;
			if (article.quality >= 1.00) { // Add quality mark
				if (thumb != null) {
					let div = document.createElement('div');
					div.style = 'position: absolute; bottom: -5px; right: 0px; z-index: 100;';
					img = document.createElement('img');
					img.src = 'https://i.imgur.com/Ol0rPuM.png';
					img.style = 'width: 48px; background: transparent; border: none;';
					div.append(img);
					thumb.append(div);
				}
			} else if (article.quality >= 0.30) div.style.opacity = article.quality; else {
				div.style.display = 'none';
				return;
			}
			if (article.size > 500) div.style.backgroundColor = '#FF000040';
			if (article.size < 300) div.style.backgroundColor = '#8888';
			if (article.bd >= 24 && thumb != null) {
				let div = document.createElement('div');
				div.style = 'position: absolute; top: 18px; left: 18px; z-index: 100;';
				img = document.createElement('img');
				img.src = 'https://images2.imgbox.com/2e/de/DyPGceb6_o.jpg';
				img.style = 'width: 32px; background: transparent; border: none; opacity: 0.8;';
				div.append(img);
				thumb.append(div);
			}
			if (Array.isArray(article.styles) && article.styles.length > 0) {
				let styles = document.createElement('div');
				styles.classList.add('styles');
				styles.innerHTML = 'Style: ' +
					article.styles.map(style => '<span class="style">' + style + '</span>').join(', ');
				url.append(styles);
			}
			if (thumb != null) {
				// Safe search - RED
				let div = document.createElement('div');
				div.style = 'position: absolute; bottom: 18px; left: 18px; padding: 4px; background-color: #2a7579C0; z-index: 100;';
				let a = document.createElement('a');
				a.href = gazelleSafeReleaseUrl(originRED, article);
				if (article.bd == 24) a.href += '&encoding=24bit+Lossless';
				a.target = '_blank';
				a.id = 'find-on-red-safe';
				a.style = 'color: white; font: 600 10pt Segoe UI;';
				a.textContent = 'Fnd on RED';
				div.append(a);
				thumb.append(div);
				// Artist search - RED
				if (!is_va(article)) {
					div = document.createElement('div');
					div.style = 'position: absolute; bottom: 18px; left: 100px; padding: 4px; background-color: #008000C0; z-index: 100;';
					a = document.createElement('a');
					a.href = gazelleArtistUrl(originRED, article);
					a.target = '_blank';
					a.id = 'find-artist-on-red';
					a.style = 'color: white; font: 600 10pt Segoe UI;';
					a.textContent = 'Artist on RED';
					div.append(a);
					thumb.append(div);
				}
				// Search Qobuz
				div = document.createElement('div');
				div.style = 'position: absolute; top: 18px; right: 18px; background-color: #FFFFFF60; padding: 5px; z-index: 100;';
				a = document.createElement('a');
				a.href = qobuzReleaseUrl(article);
				a.target = '_blank';
				a.id = 'find-on-qobuz';
				a.title = 'Search on Qobuz';
				let img = document.createElement('img');
				img.src = 'https://i.imgur.com/LwfoSUQ.png';
				img.style = 'width: 32px; background: transparent; border: none;';
				a.append(img);
				div.append(a);
				thumb.append(div);
				// Search HRA
				div = document.createElement('div');
				div.style = 'position: absolute; top: 68px; right: 18px; background-color: #00000060; padding: 5px; z-index: 100;';
				a = document.createElement('a');
				a.href = hraReleaseUrl(article);
				a.target = '_blank';
				a.id = 'find-on-hra';
				a.title = 'Search on HighResAudio';
				img = document.createElement('img');
				img.src = 'https://i.imgur.com/XG8ukNY.png';
				img.style = 'width: 32px; background: transparent; border: none;';
				a.append(img);
				div.append(a);
				thumb.append(div);
				// Search Mora
				div = document.createElement('div');
				div.style = 'position: absolute; top: 108px; right: 18px; background-color: #FFFFFF60; padding: 5px; z-index: 100;';
				a = document.createElement('a');
				a.href = moraReleaseUrl(article);
				a.target = '_blank';
				a.id = 'find-on-mora';
				a.title = 'Search on Mora';
				img = document.createElement('img');
				img.src = 'https://i.imgur.com/UJCw5a4.png';
				img.style = 'width: 32px; background: transparent; border: none;';
				a.append(img);
				div.append(a);
				thumb.append(div);
			}
		});
	});

	function loadArticleFromPage(dom) {
		if (!(dom instanceof Document)) return null;
		let article = new Article,
				url = dom.querySelector('meta[property="og:url"][content]');
		if (url != null && /\/(\d+)\b/.test(url.content)) article.id = parseInt(RegExp.$1);
		dom.querySelectorAll('article div > div > b').forEach(function(b) {
			if (!/^\s*(.+?)\s*:\s*$/.test(b.textContent)) return;
			let value = b.nextSibling.textContent.trim() || b.nextElementSibling.textContent.trim();
			switch (RegExp.$1.toLowerCase()) {
				case 'quality': {
					let formats = value.split(/[\+]/).map(function(format) {
						format = /\b(?:(\w+)\s+)?(\d+)[\s\-]?bits?\b(?:\s*\/\s*(\d+(?:\.\d+)?)\s*kHz\b)?(?:\s*\((.+)\))?/i.exec(format);
						if (format == null) return null;
						let result = { };
						if (format[1]) result.codec = format[1];
						if (format[2]) result.bd = parseInt(format[2]);
						if (format[3]) result.sr = parseFloat(format[3]) * 1000;
						if (format[4]) switch(format[4].trim().toLowerCase()) {
							case 'tracks': result.media = 'WEB'; break;
						}
						return result;
					}).filter(Boolean);
					let highest = formats.reduce((acc, format) =>
																			 !acc || (format.sr || 44100) * (format.bd || 16) > (acc.sr || 44100) * (acc.bd || 16) ? format : acc, null);
					if (highest) Object.assign(article, highest);
					break;
				}
				case 'artist': article.artist = value; break;
				case 'title': article.album = value; break;
				case 'released': {
					let dates = value.split(/\//).map(d => new Date(d.trim()));
					if (dates.length <= 0) break;
					article.release_date = dates.pop();
					article.album_date = dates.length > 0 ? dates.pop() : article.release_date;
					break;
				}
				case 'style': article.styles = value.split(/\s*,\s*/); break;
				case 'rar size': article.size = Math.max(...value.split(/\s*[\+\/]\s*/).map(getSizeFromString)); break;
			}
			article.tags = Array.from(dom.querySelectorAll('div.inner-page__tags--with-hashcode > span > a'))
				.map(a => a.textContent.trim());
		});
		return article;
	}
})();
