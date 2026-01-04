// ==UserScript==
// @name         LosslessBest-FlacMania 3 Extension
// @namespace    https://greasyfork.org/cs/users/321857-anakunda
// @version      1.19
// @description  Integrate OPS, Redacted, Qobuz and GRA convenience links to LosslessBest-FlacMania and colorize content for quicker content review
// @author       Anakunda
// @license      GPL-3.0-or-later
// @copyright    2021, Anakunda (https://openuserjs.org/users/Anakunda)
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACnklEQVQ4y3XRzWucVRTH8e9z7z33eZnMZCbJpMa8TMFY2moXFptFEKUIIiJd1IWmO634B4gvuLR/jlaKroQsjBbSWia4ERIh1i7qoDOJSWbiZOZ5uddNY1oTz/734XfOCXg0p66/fyswcl4BlUpF1coluntdMgKUUk5rjdYaYzTK+1bzxueXAcwhkGb5aZ8VZ15pNBjr7eEe7lCdn+fO/t90uvsY59EenAdRQXKY+xfQWrMwM0tr+Vu+W99AiSGJQt567zorpYTCObTWiDFHoceBJIoo72xxe32d80tLXHrzDW5++BF3l5d55u0l7m9vI8ZgTwJWV1fVB19/o/rtPyjynPZvD1hr/sSw36dnBIsnshZrDFYE7dzxBtkwpdRoMD4+Tuv7FVq3fyAU4fTCAj0PkbWEIoTGQFE8CSwuLroLH3/CZqC5ePUqfzabDA8OmJiZpfrSy7SLglIcE4kgSuGy9PgK7351y2X9Ab/XJii/9jqVPEeqVcxowqvlkDNhzqjdY2AD1johN//b4LlPP0OL4L1nYAwkMedmp5iOLeVigARgtSYSx2xywhfEGMQK1hhCEeZmpqhVy5jC4xXk3hNoQ4aQo44DoQjho0OVkpixygi586RikDzg4dCzm44hTtP33ZOBJAwJjaGSxOT9IVloSVGkmWMqioiDlN1hRteV/wewlqLX5UHzHhNzDUZGyjz97DxrX37BxStX+LXZZHpqElsbOxmIrSU3Qi0uMW1KRJkn7mxRM4rNuz+iRXjhxUt0ur0jYKI+qQJQorVy+/sEec5T584ybzUbmxukB20uv3ON1voveJfy8517VBpzR8BWp+3q9VPJQbe7Eo2O3jfWMlCKVuSZvPA8JjD8tb3DXr1OqAIisW63KNqHwD+UIPEAEkmGGwAAAABJRU5ErkJggg==
// @match        http*://flacmania.ru/*
// @match        http*://*.flacmania.ru/*
// @match        http*://hd24bit.com/*
// @match        http*://*.hd24bit.com/*
// @match        http*://flac24bitmusic.com/*
// @match        http*://*.flac24bitmusic.com/*
// @match        http*://24bitlossless.com/*
// @match        http*://*.24bitlossless.com/*
// @match        http*://24bit-music.info/*
// @match        http*://*.24bit-music.info/*
// @exclude      http*://hd24bit.com/
// @exclude      http*://*.hd24bit.com/
// @exclude      http*://flacmania.ru/
// @exclude      http*://*.flacmania.ru/
// @exclude      http*://*.24bitlossless.com/
// @exclude      http*://24bitlossless.com/
// @exclude      http*://*.flac24bitmusic.com/
// @exclude      http*://flac24bitmusic.com/
// @match        http*://hd24bit.com/
// @match        http*://*.hd24bit.com/
// @connect      redacted.ch
// @connect      orpheus.network
// @connect      geo.ipify.org
// @connect      api.ipregistry.co
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @require      https://openuserjs.org/src/libs/Anakunda/XPathLib.js
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleLib.js
// @downloadURL https://update.greasyfork.org/scripts/390576/LosslessBest-FlacMania%203%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/390576/LosslessBest-FlacMania%203%20Extension.meta.js
// ==/UserScript==

"use strict";

const fetchLabel = false;
const requestInterval = 1000;
const retryDelay = 2000;
const timeOut = 5000;
const refreshInterval = 10; // m
const labelColor = 'lightslategrey';
const reputableLabels = /\b(?:Metal\s*Blade|Spinefarm|Ear\s*Music|Frontiers|Nuclear\s*Blast|Rhino|Napalm|Inact|ANTI|Roadrunner|PIAS|InsideOut|Nonesuch|One\s+Little\s+Indian|Legacy|Parlophone|EMI|Pure\s*Noise|Bella\s*Union|Massacre|Concord|Mute|Signum|Ninja\s*Tune|Polydor|Capitol|Naxos|Islands|Blue\s*Note|ECM|Act|Decca|Reprise|Harmonia\s+Mundi|Century\s*Media|Sony\s+Classical|Verve|Mobile\s+Fidelity\s+Sound Lab|MFSL|4AD|Sire|Play\s+It\s+Again\s+Sam|Cherry\s*Red|Matador|Chandos|Drag\s*City|Epitaph|Chrysalis|Repertoire|Rough\s*Trade|Polyvinyl|Rounder|Beggars\s+Banquet|Universal\s+Music|Atlantic|Domino|City\s+Slang|ANTI|Epitaph|Island|4AD|Cooking\s+Vinyl|One\s+Little\s+Indian|Season\s+of\s+Mist)\b/i;
const tzOffset = 60 - new Date().getTimezoneOffset(); // MOSCOW +2 / DST = +3
const ipregistryToken = GM_getValue('ipregistry_token', '');
const ipifyToken = GM_getValue('ipify_token', '');

class Article {
	is_rm() { return this.is_remaster || this.album_date && this.release_date
					 && this.release_date.getFullYear() > this.album_date.getFullYear() }
	get_minimal_artist() {
		return this.artist ? this.artist.
		replace(/\s+feat\.\s+.*/, '').
		replace(/(\S),\s+/g, '$1 & ').
		replace(/\s*\/\s*/, ' & ') : null;
	}
};

var articles = [ ], hdr, btn, ref, opsUrl, btnNode, nbsp;
var last_viewed = GM_getValue('lastviewed');
var safeHost = queryIpregistry(ipregistryToken).catch(function(reason) {
	if (reason == 'Unsafe host') return Promise.reject(reason);
	if (typeof reason == 'object') console.warn('Ipregistry error:', reason);
	return queryIpify(ipifyToken, ['Karneval Media']).catch(function(reason) {
		if (typeof reason == 'object') console.warn('Ipify error:', reason);
		return Promise.reject('No more services')
	});
});

(function() {
	const propDivisor = '\\b(?:(?:Album\\s+)?Artist(?:(?:\\s+-\\s+|\\s*\\/\\s*)Name)?|Artist|Performer|Title|Album(?:\\s+Name)?|Genre|Style|Label|Publisher|www\\s+publisher|Catalog|Release\\s+Date|Sample\\s+Rate|Duration|Scans|ArtWork|Format|Container|Quality|Bitrate|Source|Covers|Size(?:\\s+\\.zip)?)\\s*:';
	var re = '\\s*:\\s*(.*?)\\s+' + propDivisor;
	const artistMatch = new RegExp('\\b(?:Album\\s+Artist|Artist|Performer)' + re, 'i');
	const artistAlbumMatch = new RegExp('\\b(?:Album\\s+)?Artist(?:\\s+-\\s+|\\s*\\/\\s*)Name' + re, 'i');
	const albumMatch = new RegExp('\\b(?:Title|Album(?:\\s+Name)?)' + re, 'i');
	const labelMatch = new RegExp('\\b(?:Label|Publisher)' + re);
	const releaserMatch = new RegExp('\\b(?:www\\s+publisher)' + re, 'i');
	const genreMatch = new RegExp('\\b(?:Genre|Style)' + re, 'i');
	const reldateMatch = new RegExp('\\b(?:Release Date)' + re, 'i');
	const durationMatch = new RegExp('\\b(?:Duration)' + re, 'i');
	const sourceMatch = new RegExp('\\b(?:Source)' + re, 'i');
	const formatMatch = new RegExp('\\b(?:Format)' + re, 'i');
	const qualityMatch = new RegExp('\\b(?:Quality)' + re, 'i');
	const descParser = new RegExp(propDivisor, 'g');

	const loginName = document.getElementById('login_name');
	const loginPassword = document.getElementById('login_password');
	const popupLogin = document.getElementById('PopUpLogin');
	var loginButton = document.querySelector('a[data-reveal-id="PopUpLogin"]');
	var loginCounter = 0;
	if (loginName != null && loginPassword != null) var loginWatchdog = setInterval(function() {
		console.debug('Login attempt #' + (loginCounter + 1) + ':', loginName.value.length, loginPassword.value.length);
		if (loginName.value.length > 0 && loginPassword.value.length > 0) {
			clearInterval(loginWatchdog);
			console.debug('Sending login request (' + loginName.value + ', ' + loginPassword.value + ')');
			loginPassword.form.submit();
		} else if (++loginCounter >= 10) clearInterval(loginWatchdog);
		else if (loginButton != null && (popupLogin == null || popupLogin.style.visibility != 'visible'))
			loginButton.click();
	}, 1000);

	document.querySelectorAll('div#dle-content > div.post article').forEach(function(node) {
		let article = new Article();
		if ((ref = node.querySelector('header > h2')) != null) {
			article.title = ref.textContent.trim();
		}
		if ((ref = node.querySelector(':scope > a.pp-btn')) != null) {
			article.url = ref.href;
			if (/\/(\d+)-/.test(ref.pathname)) article.id = parseInt(RegExp.$1);
		}
		if ((ref = node.querySelector('span[itemprop="datePublished"]')) != null) {
			article.pubdate = ref.textContent.trim();
		}
		if ((ref = node.querySelector('span[itemprop="articleSection"]')) != null) {
			article.category = ref.textContent.trim();
		}
		if ((ref = node.querySelector('div[itemprop="description"] > p')) != null) {
			let description = ref.firstChild.textContent.trim();
			if (artistMatch.test(description)) article.artist = RegExp.$1;
			if (albumMatch.test(description)) article.album = RegExp.$1;
			if (artistAlbumMatch.test(description) && /^\s*(.+?)(?:\s*\/\s*|\s+[\-]\s+)(.+?)\s*$/.test(RegExp.$1)) {
				article.artist = RegExp.$1;
				article.album = RegExp.$2.replace(/\s+\(\d{4}\).*$/, '');
			}
			if (article.title && article.artist) {
				if (/^(.*?)\s+-/.test(article.title)) {
					if (article.artist != RegExp.$1) console.log('24bitlossless.com: article artists mismatch (' + article.artist + ' != ' + RegExp.$1 + ')\n');
					if (article.artist.indexOf(RegExp.$1.concat(' ')) == 0) article.artist = RegExp.$1;
				}
			}
			if (labelMatch.test(description)) article.label = RegExp.$1;
			if (releaserMatch.test(description)) article.releaser = RegExp.$1;
			if (genreMatch.test(description)) {
				article.genre = RegExp.$1;
				if (article.category == 'Soundtrack'
						|| [
					'Film Soundtracks', 'Bandes originales de films', 'Original Soundtrack', 'Bandas sonoras de cine', 'Colonne sonore', 'Originele soundtracks',
					'Musical Theatre', 'Comédies musicales', 'Musical', 'Comedias musicales', 'Musicals',
					'Soundtracks', 'Film', 'Cine', 'Cinema', 'Soundtrack',
					'TV Series', 'Séries TV', 'TV-Serien', 'Series de televisión', 'Serie TV', 'Tv-series',
					'Video Games', 'Jeux vidéo', 'Computerspiele', 'Vídeojuegos', 'Video Giochi', 'Videogames',
				].includes(article.genre)
						|| /\b(?:Soundtracks?|Score|Films?|Games?|Video|TV Series?|Theatre|Musical)\b/i.test(article.genre)) {
					article.release_type = 3;
				}
			}
			if (/\b(?:Sample Rate)\s*:\s*([\d\.\,]+)\s*k?Hz\s*\/\s*(\d+)\s*bits?/i.test(description)) {
				article.sr = RegExp.$1;
				article.bd = parseInt(RegExp.$2);
				article.sr = parseInt(article.sr.replace(',', '.').replace(/\s+/g, ''));
			}
			if (qualityMatch.test(description)) {
				if (!article.bd && /\b(?:Hi[\-\s]?Res|24[\-\s]?[Bb]its?)\b/.test(RegExp.$1)) article.bd = 24;
			}
			if (reldateMatch.test(description)) {
				let releaseDate = RegExp.$1;
				article.album_date = new Date(releaseDate);
				if (isNaN(article.album_date) && /\b(\d+)[\.\-](\d+)[\.\-](\d{4})\b/.test(releaseDate)) {
					article.album_date = new Date(RegExp.$3 + '-' + RegExp.$2 + '-' + RegExp.$1);
				}
				if (isNaN(article.album_date) && /\b(\d{4})[\-\/](\d+)[\-\/](\d+)\b/.test(releaseDate)) {
					article.album_date = new Date(RegExp.$1 + '-' + RegExp.$2 + '-' + RegExp.$3);
				}
				if (isNaN(article.album_date) && /\b(\d+)\/(\d+)\/(\d{4})\b/.test(releaseDate)) {
					article.album_date = new Date(RegExp.$3 + '-' + RegExp.$2 + '-' + RegExp.$1);
				}
				if (isNaN(article.album_date) && /^(\d+)\s*[\-\−\—\~\–]\s*(\d+)/.test(releaseDate)) {
					article.album_date = new Date(RegExp.$1);
					article.release_date = new Date(RegExp.$1);
				}
			}
			if (durationMatch.test(description) && /\b\d+(:\d{,2})*\b/.test(RegExp.$1)) article.duration = timeStringToTime(RegExp.$_);
			if (/\b(\d+(?:[\.\,]\d+)?\s*[MGT]B)\b[\.\s\…]*$/i.test(description)) {
				article.size = getSizeFromString(RegExp.$1)
			}
			if (sourceMatch.test(description)) {
				article.media = RegExp.$1;
				if (/\b(?:Digital[\s\-]+download|WEB)\b/i.test(article.media)) article.media = 'WEB';
				if (/\b(?:CD)\b/i.test(article.media)) article.media = 'CD';
				if (/\b(?:SA[\s\-]*CD)\b/i.test(article.media)) article.media = 'SACD';
				if (/\b(?:Blu[\s\-]Ray|B[RD])\b/i.test(article.media)) article.media = 'Blu-Ray';
				if (/\b(?:Vinyl|LP)\b/i.test(article.media)) article.media = 'Vinyl';
				if (/\b(?:DVD)\b/i.test(article.media)) article.media = 'DVD';
				if (/(.*?)\s*\/\s*(.*?)\s*$/.test(article.media)) article.label = RegExp.$2;
			}
			if (formatMatch.test(description)) {
				let format = RegExp.$1;
				if (/\b(?:DVD)\b/i.test(format)) article.media = 'DVD';
			}
		} // extract release attributes from description
		if (!article.bd) {
			article.bd = /\[[^\[\]]\b(?:24[\s\-]?bits?\b|\bHi[\s\-]?Res\b)\b/i.test(article.title) ? 24 : 16;
		}
		parse_title(article);
		parse_album(article);
		parse_artist(article);
		if (!article.media && article.container && article.container.toLowerCase().includes('.cue')) {
			article.media = 'CD';
		}
		article.node = node;
		articles.push(article);
	});

	var style = document.createElement('style');
	document.head.append(style);
	style.type = 'text/css';
	//style.addRule('.release:hover', 'opacity: initial; background-color: initial');
	document.head.appendChild(document.createElement('style')).innerHTML = `
.label {
font-size: 20px;
border-style: groove; border-color: black; border-width: 2px;
padding-left: 8px; padding-right: 8px;
margin-left: 10px;
}

.red-link {
color: white;
font-family: Segoe UI; font-weight: 500; font-stretch: condensed;
margin-right: 5px;
}

#mark-all-read {
color: white; background-color: #847500;
font-family: Segoe UI; font-weight: bold;
border: solid white 2px;
padding-left: 2em; padding-right: 2em;
position: fixed; top: 18px; right: 18px;
}
#mark-all-read:hover { color: orange }

#copy-playlist {
float: right;
position: relative; left: 0px; top: 0px;
z-index: 1000000;
color: white; background-color: #7d0f34;
font-family: Segoe UI; font-weight: bold;
padding: 7px 13px;
border-radius: 20px; border-width: thick;
}
`;

	if ((ref = document.querySelector('div.page-container')) != null) {
		ref.style.maxWidth = 'unset';
		ref.style.backgroundColor = 'black';
	}
	const rightColumn = 28;
	if ((ref = document.querySelector('div[role="main"]')) != null) ref.style.width = (100 - rightColumn) + '%';
	if ((ref = document.querySelector('aside[role="complementary"]')) != null) ref.style.width = rightColumn + '%';
	if ((ref = document.querySelector('div.blog-tandems')) != null) ref.style.backgroundColor = '#324244';
	ref = document.querySelector('aside > section > div > div.block.current');
	if (ref != null) ref.style.backgroundColor = 'rgb(50, 66, 68)';
	document.querySelectorAll('figure > div.header.container > a').forEach(a => { a.style.color = 'white' });
	ref = document.querySelector('div.pop-news-repeat');
	if (ref != null) ref.style.background = 'none';
	if ((ref = document.querySelector('div#dle-content div.paginate-links')) != null) {
		ref.parentNode.parentNode.prepend(ref.parentNode.cloneNode(true));
	}

	// Copy playlist button on detail page
	if ((ref = document.querySelector('div[itemprop="description"] > center > pre')) != null) {
		let div, article = loadArticleFromPage();
		if (article != null && article.album) {
			div = document.createElement('div');
			div.style.paddingBottom = '20px';
			div.style.textAlign = 'center';
			// Safe search - RED
			btn = document.createElement('a');
			btn.href = gazelleSafeReleaseUrl(originRED, article);
			if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = '#2a7579';
			btn.style.borderRadius = '20px';
			btn.id = 'find-on-red-safe';
			btn.textContent = 'Find on RED';
			div.append(btn);
			// Safe search - OPS
			// 	  btn = document.createElement('a');
			// 	  btn.href = gazelleSafeReleaseUrl(originOPS, article);
			// 	  if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
			// 	  btn.target = '_blank';
			// 	  btn.classList.add('red-link', 'pp-btn');
			// 	  btn.style.backgroundColor = '#2a7579';
			// 	  btn.style.borderRadius = '20px';
			// 	  btn.id = 'find-on-ops-safe';
			// 	  btn.textContent = 'Find on OPS';
			// 	  div.append(btn);
			// Search Qobuz
			btn = document.createElement('a');
			btn.href = qobuzReleaseUrl(article);
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = 'darkgoldenrod';
			btn.style.borderRadius = '20px';
			btn.id = 'find-on-qobuz';
			btn.textContent = 'Find on Qobuz';
			div.append(btn);
			// Search Qobuz French
			btn = document.createElement('a');
			btn.href = qobuzMarketReleaseUrl(article, 'fr-fr');
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = 'darkgoldenrod';
			btn.style.borderRadius = '20px';
			btn.id = 'find-on-qobuz-fr';
			btn.textContent = 'Find on Qobuz FR';
			div.append(btn);
			// Search HRA
			btn = document.createElement('a');
			btn.href = hraReleaseUrl(article);
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = 'slategrey';
			btn.style.borderRadius = '20px';
			btn.id = 'find-on-hra';
			btn.textContent = 'Find on HRA';
			div.append(btn);
			// Search e-onkyo
			btn = document.createElement('a');
			btn.href = eonkyoReleaseUrl(article);
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = 'mediumaquamarine';
			btn.style.borderRadius = '20px';
			btn.id = 'find-on-eonkyo';
			btn.textContent = 'Find on e-onkyo';
			div.append(btn);

			ref.parentNode.insertBefore(div, ref);
		}

		div = document.createElement('div');
		let elem = document.createElement('input');
		elem.type = 'button';
		elem.value = 'Copy playlist to clipboard';
		elem.id = 'copy-playlist';
		elem.onclick = cbCopyTracklist;
		div.append(elem);
		ref.parentNode.insertBefore(div, ref);
	}
	if ((ref = document.querySelector('div[itemprop="description"] > center > pre > a[target]')) != null
			|| (ref = document.querySelector('div[itemprop="description"] > center > center > a[target]')) != null
			|| (ref = document.querySelector('a[target] > center > pre')) != null && (ref = ref.parentNode.parentNode) != null
			|| (ref = document.querySelector('div[itemprop="description"] > center > a[target]')) != null) {
		let /*iframe = document.createElement('iframe'), */href = ref.href;
		// 	iframe.title = 'TurboBit';
		// 	iframe.width = '100%';
		// 	iframe.height = '800';
		// 	ref.parentNode.insertBefore(iframe, ref);
		// 	setTimeout(function() { iframe.src = href }, 1000);
		ref.removeAttribute('target');
		if (/\b(?:redirect)\b/i.test(document.location.hash))
			setTimeout(function() { document.location = href }, 1000);
	}

	var reqCounter = 0;
	articles.forEach(function(article) {
		article.node.parentNode.parentNode.parentNode.parentNode.parentNode.id = article.id;

		if (last_viewed > 0 && article.id > 0 && article.id <= parseInt(last_viewed)) {
			article.node.parentNode.parentNode.style.backgroundColor = '#fff5d4';
			article.isRead = true;
		} else {
			article.node.parentNode.parentNode.style.backgroundColor = 'white';
		}

		if (/^(\w+),\s*(\d+:\d{2})$/.test(article.pubdate)
				&& (ref = article.node.querySelector('span[itemprop="dateModified"]')
						|| article.node.querySelector('span[itemprop="datePublished"]')) != null) {
			let date = RegExp.$1.toLowerCase(), time = RegExp.$2;
			let now = new Date();
			let offset = tzOffset + now.getTimezoneOffset();
			let localTime = now.getHours() * 60 + now.getMinutes();
			let dayAdj = date == 'today' ? 0 : date == 'yesterday' ? -1 : undefined;
			if (localTime + offset >= 24*60) ++dayAdj;
			let pubTime = timeStringToTime(time) + dayAdj * 24*60 - offset;
			if (localTime - pubTime < 120) {
				ref.innerHTML = '<strong style="color: #12b519;">Před ' + (localTime - pubTime) + ' minutami</strong>';
			} else {
				dayAdj = 0;
				while (pubTime < 0) {
					pubTime += 24*60;
					--dayAdj;
				}
				let D;
				if (dayAdj === 0) D = '<strong style="color: #9c27b0;">Dnes';
				if (dayAdj === -1) D = 'Včera';
				if (dayAdj === -2) D = 'Předevčírem';
				D += ' ';
				D += makeTimeString(pubTime);
				if (dayAdj === 0) D += '</strong>';
				ref.innerHTML = D;
			}
		}
		if ((ref = article.node.querySelector('span[itemprop="articleSection"]')) != null) {
			if (ref.firstChild) ref.removeChild(ref.firstChild);
			if (ref.firstChild) ref.removeChild(ref.firstChild);
			if (ref.firstChild) ref.removeChild(ref.firstChild);
			if (ref.firstChild) ref.removeChild(ref.firstChild);
			if (ref.lastChild) ref.removeChild(ref.lastChild);
		}

		let href;
		if ((ref = article.node.querySelector('span[typeof="v:Breadcrumb"] > a[href]')) != null) {
			href = ref.href;
			ref = ref.parentNode;
			ref.parentNode.removeChild(ref.previousSibling);
			ref.parentNode.removeChild(ref.previousSibling);
			ref.parentNode.removeChild(ref);
		}
		if ((ref = article.node.querySelector('div[itemprop="description"] > p')) != null) {
			ref.innerHTML = ref.innerHTML.replace(descParser, '<strong style="color: Peru;">$&</strong>');
			if (href) ref.querySelectorAll(':scope > strong').forEach(function(it) {
				if (!it.textContent.includes('Artist')) return;
				let a = document.createElement('a');
				a.href = href;
				a.target = '_blank';
				a.textContent = it.nextSibling.data.trim();
				it.parentNode.removeChild(it.nextSibling);
				it.parentNode.insertBefore(document.createTextNode(' '), it.nextSibling);
				it.parentNode.insertBefore(a, it.nextSibling);
				it.parentNode.insertBefore(document.createTextNode(' '), it.nextSibling);
			});
		}
		if ((ref = article.node.querySelector('div[style] > img[style]')) != null) {
			ref.style.backgroundColor = 'transparent';
		}
		computeArticleQuality(article);
		if (['CD'].includes(article.media)) article.quality -= 0.30;
		if (['DVD', 'Blu-Ray', 'SACD'].includes(article.media)) article.quality -= 0.50;
		if (['Vinyl'].includes(article.media)) article.quality = -1;

		if ((ref = article.node.querySelector(':scope > header > div[class] > hr')) != null) {
			if (article.media) {
				btn = document.createElement('span');
				btn.classList.add('label');
				btn.setAttribute('itemprop', 'media');
				if (article.media == 'WEB') {
					btn.style.color = '#c30000';
					btn.style.backgroundColor = '#ffa5008a';
				} else {
					btn.style.color = 'white';
					btn.style.backgroundColor = 'black';
				}
				btn.appendChild(document.createElement('strong')).textContent = article.media;
				ref.parentNode.insertBefore(btn, ref);
			}
			if (article.genre) {
				btn = document.createElement('span');
				btn.classList.add('label');
				btn.setAttribute('itemprop', 'genre');
				btn.style.color = 'fuchsia';
				btn.style.backgroundColor = 'whitesmoke';
				btn.appendChild(document.createElement('strong')).textContent = article.genre;
				ref.parentNode.insertBefore(btn, ref);
			}
			addLabelLabel(article, ref);
		}

		if (article.quality >= 1.00) { // Add quality mark
			if (ref = article.node.querySelector(':scope > header')) {
				btn = document.createElement('div');
				btn.style.margin = '10px 15px -250px 0px';
				var child = document.createElement('img');
				child.src = 'https://i.imgur.com/Ol0rPuM.png';
				child.style = 'width: 64px; background: transparent; border: none;';
				btn.appendChild(child);
				var x2 = document.createElement('div');
				x2.style.float = 'left';
				x2.appendChild(btn);
				ref.appendChild(x2);
			}
		} else if (article.quality >= 0.30) {
			article.node.parentNode.parentNode.parentNode.parentNode.parentNode.style.opacity = article.quality;
		} else {
			article.node.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
		}

		if (fetchLabel && !article.label && !article.isRead && article.quality >= 0.30) setTimeout(function() {
			GM_xmlhttpRequest({
				method: 'GET',
				url: article.url,
				context: article,
				responseType: 'document',
				timeout: timeOut,
				onload: parse_release_page,
				onerror: errorHandler,
			});
		}, requestInterval * ++reqCounter);

		if ((ref = article.node.querySelector(':scope > a')) != null) {
			ref.textContent = 'Detail';
			ref.target = '_blank';
			btn = ref.cloneNode(true);
			btn.hash = 'redirect';
			btn.textContent = 'Download';
			btn.style.marginRight = '15px';
			article.node.append(btn);
		}
		// 	// Exact search - RED
		// 	if (article.album_date && !article.is_remaster) {
		// 	  btn = document.createElement('a');
		// 	  btn.href = gazelleReleaseUrl(originRED, article);
		// 	  if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
		// 	  btn.target = '_blank';
		// 	  btn.classList.add('red-link', 'pp-btn');
		// 	  btn.style.backgroundColor = '#2a7579';
		// 	  btn.style.marginLeft = '1em';
		// 	  btn.id = 'find-on-red-exact';
		// 	  btn.setAttribute('item', article.id);
		// 	  btn.textContent = 'Find on RED';
		// 	  article.node.append(btn);
		// 	}
		// Safe search - RED
		btn = document.createElement('a');
		btn.href = gazelleSafeReleaseUrl(originRED, article);
		if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
		btn.target = '_blank';
		btn.classList.add('red-link', 'pp-btn');
		btn.style.backgroundColor = '#2a7579';
		btn.id = 'find-on-red-safe';
		btn.setAttribute('item', article.id);
		btn.textContent = 'Fnd on RED';
		article.node.append(btn);
		// Artist search - RED
		if (!is_va(article)) {
			btn = document.createElement('a');
			btn.href = gazelleArtistUrl(originRED, article);
			btn.target = '_blank';
			btn.classList.add('red-link', 'pp-btn');
			btn.style.backgroundColor = '#008000';
			btn.id = 'find-artist-on-red';
			btn.setAttribute('item', article.id);
			btn.textContent = 'Artist on RED';
			article.node.append(btn);
		}
		// 	// Exact search - OPS
		// 	if (article.album_date && !article.is_remaster) {
		// 	  btn = document.createElement('a');
		// 	  btn.href = gazelleReleaseUrl(originOPS, article);
		// 		if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
		// 	  btn.target = '_blank';
		// 	  btn.classList.add('red-link', 'pp-btn');
		// 	  btn.style.backgroundColor = '#2a7579';
		// 	  btn.style.marginLeft = '1em';
		// 	  btn.id = 'find-on-ops-exact';
		// 	  btn.setAttribute('item', article.id);
		// 	  btn.textContent = 'Find on OPS';
		// 	  article.node.append(btn);
		// 	}
		// 	// Safe search - OPS
		// 	btn = document.createElement('a');
		// 	btn.href = gazelleSafeReleaseUrl(originOPS, article);
		// 	if (article.bd == 24) btn.href += '&encoding=24bit+Lossless';
		// 	btn.target = '_blank';
		// 	btn.classList.add('red-link', 'pp-btn');
		// 	btn.style.backgroundColor = '#2a7579';
		// 	btn.id = 'find-on-ops-safe';
		// 	btn.setAttribute('item', article.id);
		// 	btn.textContent = 'Fnd on OPS';
		// 	article.node.append(btn);
		// 	// Artist search - OPS
		// 	if (!is_va(article)) {
		// 	  btn = document.createElement('a');
		// 	  btn.href = gazelleArtistUrl(originOPS, article);
		// 	  btn.target = '_blank';
		// 	  btn.classList.add('red-link', 'pp-btn');
		// 	  btn.style.backgroundColor = '#008000';
		// 	  btn.id = 'find-artist-on-ops';
		// 	  btn.setAttribute('item', article.id);
		// 	  btn.textContent = 'Artist on OPS';
		// 	  article.node.append(btn);
		// 	}
		// Search Qobuz
		btn = document.createElement('a');
		btn.href = qobuzReleaseUrl(article);
		btn.target = '_blank';
		btn.classList.add('red-link', 'pp-btn');
		btn.style.backgroundColor = 'darkgoldenrod';
		btn.id = 'find-on-qobuz';
		btn.setAttribute('item', article.id);
		btn.textContent = 'Qobuz';
		article.node.append(btn);
		// Search HRA
		btn = document.createElement('a');
		btn.href = hraReleaseUrl(article);
		btn.target = '_blank';
		btn.classList.add('red-link', 'pp-btn');
		btn.style.backgroundColor = 'slategrey';
		btn.id = 'find-on-hra';
		btn.setAttribute('item', article.id);
		btn.textContent = 'HRA';
		article.node.append(btn);
		// Search e-onkyo music
		btn = document.createElement('a');
		btn.href = eonkyoReleaseUrl(article);
		btn.target = '_blank';
		btn.classList.add('red-link', 'pp-btn');
		btn.style.backgroundColor = 'mediumaquamarine';
		btn.id = 'find-on-eonkyo';
		btn.setAttribute('item', article.id);
		btn.textContent = 'e-onkyo';
		article.node.append(btn);

		if (article.isRead || article.quality < 0.5) return;
		safeHost.then(status => queryReleaseStatus(originRED, article)).then(function(status) {
			var hdr = article.node.querySelector(':scope > header > div[]');
			if (hdr == null) return;
			var last_child = article.node.querySelector(':scope > hr');
			var nbsp = document.createTextNode(' | ');
			hdr.insertBefore(nbsp, last_child);
			var btn = document.createElement('span');
			btn.setAttribute('itemprop', 'ops-status');

			var html;
			if (status.availability >= 2) {
				btn.innerHTML = '<strong>OPS available</strong>';
				btn.style.fontSize = '22px';
				btn.style.color = '#00C000';
			} else if (status.availability >= 1) {
				btn.innerHTML = '<b>OPS available</b> (group exists)';
				btn.style.fontSize = '20px';
				btn.style.color = '#80C000';
			} else if (status.availability <= -2) {
				html = 'Alreaddy on OPS';
				if (status.size_deviation != undefined || status.size_difference != undefined) {
					html += ' (' + Math.round(status.size_deviation * 10) / 10 + '% - ' +
						Math.round(status.size_difference * 10) / 10 + ' MB)';
				}
				btn.innerHTML = html;
				btn.style.fontSize = '18px';
				btn.style.color = '#FF0000';
				//article.quality -= 0.30;
			} else if (status.availability <= -1) {
				btn.style.fontSize = '16px';
				btn.innerHTML = 'Same format on OPS';
				btn.style.color = '##FF800';
			}
			hdr.insertBefore(btn, last_child);
		}).catch(function(reason) {
			var hdr = article.node.querySelector(':scope > header > div[]');
			if (hdr == null) return;
			var last_child = article.node.querySelector(':scope > hr');
			var nbsp = document.createTextNode(' | ');
			hdr.insertBefore(nbsp, last_child);
			var btn = document.createElement('span');
			btn.setAttribute('itemprop', 'ops-status');

			btn.textContent = reason;
			btn.style.fontSize = '14px';
			btn.style.color = 'black';
			hdr.insertBefore(btn, last_child);
		});
	});

	// Create all read button
	if ((ref = document.querySelector('ul#menu-main-menu > div.blog-items')) != null) {
		btn = document.createElement('input');
		btn.type = 'button';
		btn.id = 'mark-all-read';
		btn.value = 'Mark all read';
		btn.onclick = make_all_read;
		ref.append(btn);
	}

	if (refreshInterval > 0) {
		function checkCategory(rx, storageKey) {
			console.assert(rx instanceof RegExp, "rx instanceof RegExp");
			console.assert(storageKey, "storageKey");
			if (rx.test(document.location.pathname) && (!RegExp.$1 || RegExp.$1 == 1)) {
				let newestArticleId = getNewestArticleId(document),
						newestStored = parseInt(sessionStorage[storageKey]) || undefined;
				if (storageKey in sessionStorage) delete sessionStorage[storageKey];
				console.debug(newestArticleId, newestStored);
				if (newestArticleId > newestStored) {
					//alert(newestArticleId, newestStored);
					GM_notification({ highlight: true, silent: false });
				}
				setTimeout(function() {
					sessionStorage[storageKey] = newestArticleId;
					document.location.reload();
				}, Math.round(refreshInterval * 60 * 1000));
			}
		}
		checkCategory(/^\/hd-files(?:\/page\/(\d+))?\/?$/i, 'hd24bit_hd_latest');
		checkCategory(/^\/lastnews(?:\/page\/(\d+))?\/?$/i, 'hd24bit_latest');
	}
})();

function addLabelLabel(article, ref) {
	if (reputableLabels.test(article.label)) {
		var lbl = document.createElement('span');
		lbl.classList.add('label');
		lbl.setAttribute('itemprop', 'label');
		lbl.style.color = '#00bcd4';
		lbl.style.backgroundColor = 'azure';
		lbl.appendChild(document.createElement('strong')).textContent = article.label;
		ref.parentNode.insertBefore(lbl, ref);
	}
}

function getNewestArticleId(document) {
	if (!(document instanceof Node)) throw 'Invalid argument';
	let as = document.querySelectorAll('div#dle-content > div.post article > a.pp-btn');
	return Math.max(...Array.from(as).map(link => /^\/(\d+)-/.test(link.pathname) && parseInt(RegExp.$1) || 0));
}

function make_all_read() {
	localXHR('/lastnews/').then(function(dom) {
		//let xpath = '//div[@class="post"]/section/div[@class="tabbed"]/div/ul/article/header/h2/a';
		//let results = html.evaluate(xpath, html.body, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
		let newest = getNewestArticleId(dom);
		if (newest <= 0) return;
		GM_setValue('lastviewed', newest);
		location.reload(true);
	});
}

function errorHandler(response) {
	console.log('response.readyState: ' + response.readyState + ', response.status: ' + response.status);
	if (response.status == 403) return;
	setTimeout(function() {
		GM_xmlhttpRequest({
			method: 'GET',
			url: response.context.url,
			context: response.context,
			timeout: timeOut,
			onload: parse_release_page,
			onerror: errorHandler,
		});
	}, retryDelay);
}

function parse_release_page(response) {
	if (response.readyState != 4 || response.status != 200) {
		console.error('parse_release_page response.readyState: ' + response.readyState + ', response.status: ' + response.status);
		if (response.status == 503) errorHandler(response);
		return;
	}
	var dom = domParser.parseFromString(response.responseText, "text/html");
	var article = loadArticleFromPage(dom);
	if (article == null) return;
	article.node = response.context.node;
	article.url = response.context.url;
	article.quality = response.context.quality;
	article.isread = response.context.isread;
	article.release_type = response.context.release_type;
	if (article.label) addLabelLabel(article, article.node.querySelector(':scope > header > div[class] > hr'));
}

function cbCopyTracklist() {
	var ref = document.querySelector('div[itemprop="description"] > center > pre');
	if (ref == null) return;
	let tracklist = '';
	ref.innerText.split('\n').forEach(function(line) {
		if (/^\s*(\d+)\s*[\.\-].*?\b(\d+(?:\.\d+)?)\s*kbps\b/.test(line)) tracklist += line + '\n';
	});
	if (tracklist) {
		var article = loadArticleFromPage();
		if (article.sr) tracklist = 'SR:' + article.sr + '\n' + tracklist;
		if (article.bd) tracklist = 'BD:' + article.bd + '\n' + tracklist;
		if (article.size) tracklist = 'Size:' + article.size + '\n' + tracklist;
		if (article.country) tracklist = 'Country:' + article.country + '\n' + tracklist;
		if (article.media) tracklist = 'Media:' + article.media + '\n' + tracklist;
		if (article.genre) tracklist = 'Genre:' + article.genre + '\n' + tracklist;
		if (article.release_date) tracklist = 'Released:' + article.release_date.toString() + '\n' + tracklist;
		if (article.album_year) tracklist = 'Year:' + article.album_year + '\n' + tracklist;
		if (article.album) tracklist = 'Album:' + article.album + '\n' + tracklist;
		if (article.artist) tracklist = 'Artist:' + article.artist + '\n' + tracklist;
		GM_setClipboard(tracklist, 'text');
	}
}

function loadArticleFromPage(doc = document) {
	if (!(doc instanceof Document)) return null;
	var root = doc.querySelector('div#posts > article');
	if (root == null) return null;
	var ref, article = new Article();
	article.url = document.location.href;
	if (/^\/(\d+)-/.test(document.location.pathname)) article.id = parseInt(RegExp.$1);
	if ((ref = root.querySelector('h1[itemprop="headline"]')) != null) article.title = ref.textContent.trim();
	if (/\((\d{4})\)/.test(article.title)) article.release_year = new Date(RegExp.$1);
	if ((ref = root.querySelector('header > div > a:last-of-type')) != null) article.category = ref.textContent.trim();
	if ((ref = root.querySelector('span[itemprop="datePublished"] > c')) != null) article.pubdate = ref.textContent.trim();
	root.querySelectorAll(':scope > div[itemprop="description"] > center > b').forEach(function(prop) {
		var lbl = prop.textContent.replace(/\s*:\s*$/, '').trim(),
				val = prop.nextSibling.textContent.trim();
		if (lbl.includes('Quality') || lbl.includes('Bitrate')) article._quality = val;
		if (lbl.includes('Sample Rate') || lbl.includes('Quality')) {
			if (/\b([\d\.\,]+)\s*k?Hz\b/i.test(val)) {
				article.sr = parseFloat(RegExp.$1.replace(',', '.').replace(/\s+/g, ''));
				if (article.sr < 1000) article.sr *= 1000;
			}
			if (/\b(\d+)[\s\-]?bits?\b/i.test(val)) article.bd = parseInt(RegExp.$1);
		}
		if (lbl.includes('Source')) {
			if (/\b(?:Digital[\s\-]+download|WEB)\b/i.test(val)) article.media = 'WEB';
			if (article.bd == 16 && /\b(?:CD)\b/i.test(val)) article.media = 'CD';
			if (/\b(?:SA[\s\-]*CD)\b/i.test(val)) article.media = 'SACD';
			if (/\b(?:Blu[\s\-]Ray|B[RD])\b/i.test(val)) article.media = 'Blu-Ray';
			if (/\b(?:Vinyl|LP)\b/i.test(val)) article.media = 'Vinyl';
			if (/(.*?)\s*\/\s*(.*?)\s*$/.test(val)) article.label = RegExp.$2;
		}
		if (lbl.includes('Artist') || lbl.includes('Performer')) article.artist = val;
		if (lbl.includes('Name') || lbl == 'Album') article.album = val;
		if (/^Album\s+Artist\s*\/\s*Name/i.test(lbl) && /^(.+?)\s*\/\s*(.+)$/.test(val)) {
			article.artist = RegExp.$1;
			article.album = RegExp.$2;
		}
		if (lbl.includes('Country') || lbl == 'Made In') article.country = val;
		if (lbl.includes('Genre') || lbl.includes('Style')) {
			article.genre = val;
			if (article.category == 'Soundtrack'
					|| article.genre.match(/\b(?:Soundtracks?|Score|Films?|Games?|Video|TV Series?|Theatre|Musical)\b/i)) {
				article.release_type = 3;
			}
		}
		if (lbl.includes('Release Date')) {
			article.album_date = new Date(val);
			if (isNaN(article.album_date) && /\b(\d+)[\.\-](\d+)[\.\-](\d{4})\b/.test(val)) {
				article.album_date = new Date(RegExp.$3 + '-' + RegExp.$2 + '-' + RegExp.$1);
			}
			if (isNaN(article.album_date) && /\b(\d{4})[\-\/](\d+)[\-\/](\d+)\b/.test(val)) {
				article.album_date = new Date(RegExp.$1 + '-' + RegExp.$2 + '-' + RegExp.$3);
			}
			if (isNaN(article.album_date) && /\b(\d+)\/(\d+)\/(\d{4})\b/.test(val)) {
				article.album_date = new Date(RegExp.$3 + '-' + RegExp.$2 + '-' + RegExp.$1);
			}
			if (isNaN(article.album_date) && /^(\d+)\s*[\-\−\—\~\–]\s*(\d+)/.test(val)) {
				article.album_date = new Date(RegExp.$1);
				article.release_date = new Date(RegExp.$1);
			}
		}
		if (lbl.includes('Duration')) article.duration = timeStringToTime(val);
		if (lbl.includes('Container')) article.container = val;
		if (lbl.includes('ArtWork') || lbl.includes('Covers')) article.artwork = val;
		if (lbl.includes('Size')) article.size = getSizeFromString(val);
	});
	if (article.title && article.artist && /^(.*?)\s+-/.test(article.title)) {
		if (article.artist != RegExp.$1) console.log('Flacmania: article artists mismatch (' + article.artist + ' != ' + RegExp.$1 + ')\n');
		if (article.artist.indexOf(RegExp.$1.concat(' ')) == 0) article.artist = RegExp.$1;
	}
	if ((ref = doc.querySelector('div[itemprop="description"] > center > div[style] > span[style]')) != null) {
		article.label = ref.textContent.trim();
	}
	parse_title(article);
	parse_album(article);
	parse_artist(article);
	if (!article.media && article.container && article.container.toLowerCase().includes('.cue')) {
		article.media = 'CD';
	}
	if (!article.bd) {
		article.bd = /\[[^\[\]]\b(?:24[\s\-]?bits?\b|\bHi[\s\-]?Res\b)\b/i.test(article.title) ? 24 : 16;
	}
	return article;
}
