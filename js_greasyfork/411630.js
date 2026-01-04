// ==UserScript==
// @name         [RED] Cover Inspector
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.15.14
// @run-at       document-end
// @description  Easify & speed-up finding, lookup and updating of invalid, missing or non optimal album covers on site
// @author       Anakunda
// @copyright    © 2025 Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @iconURL      https://i.ibb.co/4gpP2J4/clouseau.png
// @match        https://redacted.sh/torrents.php
// @match        https://redacted.sh/torrents.php?*
// @match        https://redacted.sh/artist.php?id=*
// @match        https://redacted.sh/collages.php?id=*
// @match        https://redacted.sh/collages.php?page=*&id=*
// @match        https://redacted.sh/collage.php?id=*
// @match        https://redacted.sh/collage.php?page=*&id=*
// @match        https://redacted.sh/userhistory.php?action=subscribed_collages
// @match        https://redacted.sh/userhistory.php?page=*&action=subscribed_collages
// @match        https://redacted.sh/top10.php
// @match        https://redacted.sh/top10.php?*
// @match        https://redacted.sh/better.php?method=*
// @match        https://redacted.sh/better.php?page=*&method=*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getTabs
// @grant        GM_saveTab
// @require      https://openuserjs.org/src/libs/Anakunda/Requests.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/411630/%5BRED%5D%20Cover%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/411630/%5BRED%5D%20Cover%20Inspector.meta.js
// ==/UserScript==

'use strict';

const isFirefox = /\b(?:Firefox)\b/.test(navigator.userAgent) || Boolean(window.InstallTrigger);
const httpParser = /^(https?:\/\/\S+)$/i;
const preferredHosts = {
	'redacted.sh': ['ptpimg.me'],
}[document.domain];
const preferredTypes = GM_getValue('preferred_types', ['jpeg', 'png', 'gif', 'jpg'].map(type => 'image/' + type));

const uaVersions = { };
function setUserAgent(params, suffixLen = 8) {
	if (params && typeof params == 'object' && httpParser.test(params.url)) try {
		const url = new URL(params.url);
		if ([document.location.hostname, 'ptpimg.me'].includes(url.hostname)) return;
		//return ['dzcdn.', 'mzstatic.com'].some(pattern => hostname.includes(pattern));
		params.anonymous = true;
		if (!navigator.userAgent) return;
		if (!uaVersions[url.hostname] || ++uaVersions[url.hostname].usageCount > 16) uaVersions[url.hostname] = {
			versionSuffix: Math.floor(Math.random() * Math.pow(2, suffixLen * 4)).toString(16).padStart(suffixLen, '0'),
			usageCount: 1,
		};
		if (!params.headers) params.headers = { };
		params.headers['User-Agent'] = navigator.userAgent.replace(/\b(Gecko|\w*WebKit|Blink|Goanna|Flow|\w*HTML|Servo|NetSurf)\/(\d+(\.\d+)*)\b/,
			(match, engine, engineVersion) => engine + '/' + engineVersion + '.' + uaVersions[url.hostname].versionSuffix);
	} catch(e) { console.warn('Invalid url:', params.url) }
}

function formattedSize(size) {
	const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'];
	const e = (size = Math.max(size, 0)) > 0 ? Math.min(Math.floor(Math.log2(size) / 10), units.length - 1) : 0;
	return `${(size / Math.pow(2, e * 10)).toFixed(Math.min(e, 3))}\xA0${units[e]}`;
}

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

if (!document.tooltipster) document.tooltipster = typeof jQuery.fn.tooltipster == 'function' ?
		Promise.resolve(jQuery.fn.tooltipster) : new Promise(function(resolve, reject) {
	const script = document.createElement('SCRIPT');
	script.src = '/static/functions/tooltipster.js';
	script.type = 'text/javascript';
	script.onload = function(evt) {
		//console.log('tooltipster.js was successfully loaded', evt);
		if (typeof jQuery.fn.tooltipster == 'function') resolve(jQuery.fn.tooltipster);
			else reject('tooltipster.js loaded but core function was not found');
	};
	script.onerror = evt => { reject('Error loading tooltipster.js') };
	document.head.append(script);
	['style.css'/*, 'custom.css', 'reset.css'*/].forEach(function(css) {
		const styleSheet = document.createElement('link');
		styleSheet.rel = 'stylesheet';
		styleSheet.type = 'text/css';
		styleSheet.href = '/static/styles/tooltipster/' + css;
		//styleSheet.onload = evt => { console.log('style.css was successfully loaded', evt) };
		styleSheet.onerror = evt => { (css == 'style.css' ? reject : console.warn)('Error loading ' + css) };
		document.head.append(styleSheet);
	});
});

function setTooltip(elem, tooltip, params) {
	if (!(elem instanceof HTMLElement)) throw 'Invalid argument';
	document.tooltipster.then(function() {
		if (tooltip) tooltip = tooltip.replace(/\r?\n/g, '<br>')
		if ($(elem).data('plugin_tooltipster'))
			if (tooltip) $(elem).tooltipster('update', tooltip).tooltipster('enable');
				else $(elem).tooltipster('disable');
		else if (tooltip) $(elem).tooltipster({ content: tooltip });
	}).catch(function(reason) {
		if (tooltip) elem.title = tooltip; else elem.removeAttribute('title');
	});
}

const maxOpenTabs = GM_getValue('max_open_tabs', 25), autoCloseTimeout = GM_getValue('tab_auto_close_timeout', 0);
let openedTabs = [ ], tabsQueueRecovery = [ ], lastOnQueue;
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
const openTabParams = { }, tabData = { torrentGroups: { } };
if (GM_getValue('view_group_with_google_search', true)) openTabParams['embed-google-image-search'] = 1;
if (GM_getValue('view_group_with_cse_search', false)) openTabParams['embed-cse-search'] = 1;
if (GM_getValue('view_group_with_desc_source', false)) openTabParams['embed-desc-link-source'] = 1;
if (GM_getValue('view_group_with_desc_images', true)) openTabParams['desc-links-image-preview'] = 1;
if (GM_getValue('view_group_with_collages_highlighting', true)) openTabParams['highlight-cover-collages'] = 1;
if (GM_getValue('view_group_presearch_bandcamp', true)) openTabParams['presearch-bandcamp'] = 1;
function openGroup(torrentGroup) {
	if (!torrentGroup) throw 'Invalid argument';
	if (!(torrentGroup.group.id > 0)) return null;
	tabData.torrentGroups[torrentGroup.group.id] = torrentGroup;
	GM_saveTab(tabData);
	return openTabLimited('torrents', Object.assign({ id: torrentGroup.group.id }, openTabParams));
}

function checkSavedRecovery() {
	if ('coverInspectorTabsQueue' in localStorage) try {
		const savedQueue = JSON.parse(localStorage.getItem('coverInspectorTabsQueue'));
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

const acceptableSize = { 'redacted.sh': GM_getValue('acceptable_cover_size') }[document.domain] || 8 * 2**10;
const fineResolution = { 'redacted.sh': 500 }[document.domain] || 500;
let acceptableResolution = { 'redacted.sh': GM_getValue('acceptable_cover_resolution') }[document.domain] || 300;
if (fineResolution > 0 && acceptableResolution > fineResolution) acceptableResolution = fineResolution;
let hqResolution = { 'redacted.sh': GM_getValue('hq_cover_resolution') }[document.domain] || 1024;
if (fineResolution > 0 && hqResolution < fineResolution) hqResolution = fineResolution;

function getHostFriendlyName(imageUrl) {
	if (httpParser.test(imageUrl)) try { imageUrl = new URL(imageUrl) } catch(e) { console.error(e) }
	if (imageUrl instanceof URL) imageUrl = imageUrl.hostname.toLowerCase(); else return;
	const knownHosts = {
		'2i': ['2i.cz'],
		'7digital': ['7static.com'],
		'AcousticSounds': ['acousticsounds.com'],
		'Abload': ['abload.de'],
		'AllMusic': ['rovicorp.com'],
		'AllThePics': ['allthepics.net'],
		'Amazon': ['media-amazon.com', 'ssl-images-amazon.com', 'amazonaws.com'],
		'AnimeBytes': ['animebytes.tv'],
		'Apple': ['mzstatic.com'],
		'Archive': ['archive.org'],
		'Bandcamp': ['bcbits.com'],
		'Bangumi': ['bgm.tv'],
		'Beatport': ['beatport.com'],
		'BilderUpload': ['bilder-upload.eu'],
		'Boomkat': ['boomkat.com'],
		'CasImages': ['casimages.com'],
		'Catbox': ['catbox.moe'],
		'CloudFront': ['cloudfront.net'],
		'CubeUpload': ['cubeupload.com'],
		'Deezer': ['dzcdn.net'],
		'Dibpic': ['dibpic.com'],
		'Discogs': ['discogs.com'],
		'Discord': ['discordapp.net', 'discordapp.com'],
		'e-onkyo': ['e-onkyo.com'],
		'eBay': ['ebayimg.com'],
		'Extraimage': ['extraimage.org'],
		'FastPic': ['fastpic.ru', 'fastpic.org'],
		'Forumbilder': ['forumbilder.com'],
		'FreeImageHost': ['freeimage.host'],
		'FunkyImg': ['funkyimg.com'],
		'GeTt': ['ge.tt'],
		'GeekPic': ['geekpic.net'],
		'Genius': ['genius.com'],
		'GetaPic': ['getapic.me'],
		'Gifyu': ['gifyu.com'],
		'Goodreads': ['i.gr-assets.com'],
		'GooPics': ['goopics.net'],
		'HDtracks': ['cdn.hdtracks.com'],
		'HRA': ['highresaudio.com'],
		'imageCx': ['image.cx'],
		'ImageBan': ['imageban.ru'],
		'ImageKit': ['imagekit.io'],
		'ImagensBrasil': ['imagensbrasil.org'],
		'ImageRide': ['imageride.com'],
		'ImageToT': ['imagetot.com'],
		'ImageVenue': ['imagevenue.com'],
		'ImgBank': ['imgbank.cz'],
		'ImgBB': ['ibb.co'],
		'ImgBox': ['imgbox.com'],
		'ImgCDN': ['imgcdn.dev'],
		'Imgoo': ['imgoo.com'],
		'ImgPile': ['imgpile.com'],
		'imgsha': ['imgsha.com'],
		'Imgur': ['imgur.com'],
		'ImgURL': ['png8.com'],
		'IpevRu': ['ipev.ru'],
		'Jerking': ['jerking.empornium.ph'],
		'JPopsuki': ['jpopsuki.eu'],
		'Juno': ['junodownload.com'],
		'Last.fm': ['lastfm.freetls.fastly.net', 'last.fm'],
		'Lensdump': ['lensdump.com'],
		'LightShot': ['prntscr.com'],
		'LostPic': ['lostpic.net'],
		'LutIm': ['lut.im'],
		'MetalArchives': ['metal-archives.com'],
		'MixCloud': ['mixcloud.com'],
		'Mobilism': ['mobilism.org'],
		'Mora': ['mora.jp'],
		'MusicBrainz': ['coverartarchive.org'],
		'Naxos': ['cdn.naxos.com'],
		'NetEase': ['126.net'],
		'NoelShack': ['noelshack.com'],
		'OTOTOY': ['ototoy.jp'],
		'Photobucket': ['photobucket.com'],
		'PicaBox': ['picabox.ru'],
		'PicLoad': ['free-picload.com', 'picload.org'],
		'PimpAndHost': ['pimpandhost.com'],
		'Pinterest': ['pinimg.com'],
		'PixHost': ['pixhost.to'],
		'PomfCat': ['pomf.cat'],
		'PostImg': ['postimg.cc'],
		'ProgArchives': ['progarchives.com'],
		'PTPimg': ['ptpimg.me'],
		'Qobuz': ['qobuz.com'],
		'QQ音乐': ['qq.com'],
		'Ra': ['thesungod.xyz'],
		'Radikal': ['radikal.ru'],
		'RA': ['residentadvisor.net'],
		'RYM': ['e.snmc.io'],
		'SavePhoto': ['savephoto.ru'],
		'Shopify': ['shopify.com'],
		'Slowpoke': ['slow.pics'],
		'SoundCloud': ['sndcdn.com'],
		'Spotify': ['scdn.co'],
		'Stereogum': ['stereogum.com'],
		'SM.MS': ['sm.ms', 'loli.net'],
		'Stereogum': ['stereogum.com'],
		'SVGshare': ['svgshare.com'],
		'Tidal': ['tidal.com'],
		'Traxsource': ['traxsource.com'],
		'Twitter': ['twimg.com'],
		'Upimager': ['upimager.com'],
		'Uupload.ir': ['uupload.ir'],
		'VGMdb': ['vgm.io', 'vgmdb.net'],
		'VgyMe': ['vgy.me'],
		'Wiki': ['wikimedia.org'],
		'Z4A': ['z4a.net'],
		'路过图床': ['imgchr.com'],
	};
	for (let name in knownHosts) if (knownHosts[name].some(domain =>
		imageUrl == (domain = domain.toLowerCase()) || imageUrl.endsWith('.' + domain))) return name;
}

function noCoverHere(url) {
	if (!url || !url.protocol.startsWith('http')) return true;
	let str = url.hostname.toLowerCase();
	if ([
		document.location.hostname,
		'redacted.sh', 'orpheus.network', 'apollo.rip', 'notwhat.cd', 'dicmusic.club', 'dicmusic.com', 'what.cd',
		'jpopsuki.eu', 'rutracker.net',
		'github.com', 'gitlab.com',
		'db.etree.org', 'youri-egoro', 'dr.loudness-war.info',
		'ptpimg.me', 'imgur.com',
		'2i.cz', 'abload.de', 'allthepics.net', 'bilder-upload.eu', 'casimages.com', 'catbox.moe', 'cubeupload.com',
		'dibpic.com', 'extraimage.org', 'fastpic.ru', 'fastpic.org', 'forumbilder.com', 'freeimage.host',
		'funkyimg.com', 'ge.tt', 'geekpic.net', 'getapic.me', 'gifyu.com', 'goopics.net', 'image.cx', 'imageban.ru',
		'imagekit.io', 'imagensbrasil.org', 'imageride.com', 'imagetot.com', 'imagevenue.com', 'imgbank.cz', 'ibb.co',
		'imgbox.com', 'imgcdn.dev', 'imgoo.com', 'imgpile.com', 'imgsha.com', 'png8.com', 'ipev.ru', 'jerking.empornium.ph',
		'lensdump.com', 'prntscr.com', 'lostpic.net', 'lut.im', 'noelshack.com', 'photobucket.com', 'picabox.ru',
		'free-picload.com', 'pimpandhost.com', 'pinimg.com', 'pixhost.to', 'pomf.cat', 'postimg.cc', 'thesungod.xyz',
		'radikal.ru', 'savephoto.ru', 'slow.pics', 'sm.ms', 'svgshare.com', 'twimg.com', 'upimager.com', 'uupload.ir',
		'vgy.me', 'z4a.net', 'imgchr.com',
	].concat(GM_getValue('no_covers_here', [ ])).some(hostName => hostName
		&& (str == (hostName = hostName.toLowerCase()) || str.endsWith('.' + hostName)))) return true;
	str = url.pathname.toLowerCase();
	const pathParts = {
		'discogs.com': ['artist', 'label', 'user'].map(folder => '/' + folder + '/'),
	};
	for (let domain in pathParts) if ((url.hostname == domain || url.hostname.endsWith('.' + domain))
			&& pathParts[domain].some(pathPart => str.includes(pathPart.toLowerCase()))) return true;
	return false;
}

const hostSubstitutions = {
	'pro.beatport.com': 'www.beatport.com',
};

const musicResourceDomains = [
	'7static.com', 'archive.org', 'bcbits.com', 'beatport.com', 'boomkat.com', 'cloudfront.net', 'coverartarchive.org',
	'discogs.com', 'dzcdn.net', 'ebayimg.com', 'genius.com', 'highresaudio.com', 'i.gr-assets.com', 'junodownload.com',
	'last.fm', 'lastfm.freetls.fastly.net', 'media-amazon.com', 'metal-archives.com', 'mora.jp', 'mzstatic.com',
	'progarchives.com', 'qobuz.com', 'rovicorp.com', 'sndcdn.com', 'ssl-images-amazon.com', 'tidal.com',
	'traxsource.com', 'vgm.io', 'vgmdb.net', 'wikimedia.org', 'residentadvisor.net', 'hdtracks.com', 'acousticsounds.com',
	'naxos.com', 'deejay.de', 'mixcloud.com', 'cdjapan.co.jp', 'ototoy.jp', 'rateyourmusic.com', 'e.snmc.io',
	'thewire.co.uk', 'bgm.tv', '126.net', 'e-onkyo.com', 'stereogum.com', 'scdn.co', 'qq.com',
];

const click2goHostLists = [
	GM_getValue('click2go_blacklist', ['amazonaws.com', 'coverartarchive.org', 'archive.org']),
	GM_getValue('click2go_whitelist', musicResourceDomains.concat([
		'imgur.com', 'forumbilder.com', 'jpopsuki.eu', 'pinimg.com', 'shopify.com',
		'twimg.com', 'discordapp.com', 'discordapp.net',
	])),
	GM_getValue('click2go_badlist', [
		'photobucket.com', 'imgs.onl', 'sli.mg', 'picload.org', 'kprofiles.com',
	]),
].map(click2goHostList => click2goHostList.filter((e, n, a) => a.indexOf(e) == n).sort());
if (click2goHostLists[0].some(hostName => /\b(?:imgur\.com)$/i.test(hostName))) GM_setValue('click2go_blacklist',
	click2goHostLists[0] = click2goHostLists[0].filter(hostName => !/\b(?:imgur\.com)$/i.test(hostName)));
if (!click2goHostLists[1].includes('imgur.com')) {
	click2goHostLists[1].push('imgur.com');
	GM_setValue('click2go_whitelist', click2goHostLists[1].sort());
}

const getDomainListIndex = (domain, listNdx) => domain && Array.isArray(listNdx = click2goHostLists[listNdx]) ?
	(domain = domain.toLowerCase(), listNdx.findIndex(domain2 => (domain2 = domain2.toLowerCase()) == domain
		|| domain.endsWith('.' + domain2))) : -1;
const isOnDomainList = (domain, listNdx) => getDomainListIndex(domain, listNdx) >= 0;

const domParser = new DOMParser;
const autoOpenSucceed = GM_getValue('auto_open_succeed', true);
const autoOpenWithLink = GM_getValue('auto_open_with_link', true);
const hasArtworkSet = img => img instanceof HTMLImageElement && img.src && !img.src.includes('/static/common/noartwork/');
const singleResultGetter = result => Array.isArray(result) ? result[0] : result;

function realImgSrc(img) {
	if (!(img instanceof HTMLImageElement)) throw 'Invalid argument'; else if (!hasArtworkSet(img)) return '';
	if (img.hasAttribute('onclick')) {
		const src = /\blightbox\.init\('(https?:\/\/.+?)',\s*\d+\)/.exec(img.getAttribute('onclick'));
		if (src != null) try { var imageUrl = new URL(src[1]) } catch(e) { console.warn(e) }
	}
	if (!imageUrl) try { imageUrl = new URL(img.src) } catch(e) {
		console.warn('Invalid IMG source: img.src');
		return undefined;
	}
	if (imageUrl.hostname.endsWith('.imgur.com'))
		imageUrl.pathname = imageUrl.pathname.replace(/\/(\w{7,})m\.(\w+)$/, '/$1.$2');
	return imageUrl.href;
}

function deProxifyImgSrc(imageUrl) {
	if (!imageUrl) throw 'Invalid argument';
	if (httpParser.test(imageUrl)) try {
		imageUrl = new URL(imageUrl);
		if (imageUrl.hostname == document.location.hostname && imageUrl.pathname == '/image.php'
				&& (imageUrl = imageUrl.searchParams.get('i')) && httpParser.test(imageUrl)) return imageUrl;
	} catch (e) { console.warn(e) }
}

function getImageMax(imageUrl) {
	const friendlyName = getHostFriendlyName(imageUrl);
	return imageHostHelper.then(ihh => (function() {
		const func = friendlyName && {
			'Deezer': 'getDeezerImageMax',
			'Discogs': 'getDiscogsImageMax',
		}[friendlyName];
		return func && func in ihh ? ihh[func](imageUrl) : Promise.reject('No imagemax function');
	})().catch(function(reason) {
		let sub = friendlyName && {
			'Bandcamp': [/_\d+(?=\.(\w+)$)/, '_10'],
			'Deezer': ihh.dzrImageMax,
			'Apple': ihh.itunesImageMax,
			'Qobuz': [/_\d{3}(?=\.(\w+)$)/, '_org'],
			'Boomkat': [/\/(?:large|medium|small)\//i, '/original/'],
			'Beatport': [/\/image_size\/\d+x\d+\//i, '/image/'],
			'Tidal': [/\/(\d+x\d+)(?=\.(\w+)$)/, '/1280x1280'],
			'Amazon': [/\._\S+?_(?=\.)/, ''],
			'HRA': [/_(\d+x\d+)(?=\.(\w+)$)/, ''],
		}[friendlyName];
		if (sub) sub = String(imageUrl).replace(...sub); else return Promise.reject('No imagemax substitution');
		return ihh.verifyImageUrl(sub);
	}).catch(reason => ihh.verifyImageUrl(imageUrl)));
}

if ('imageDetailsCache' in sessionStorage) try {
	var imageDetailsCache = JSON.parse(sessionStorage.getItem('imageDetailsCache'));
} catch(e) { console.warn(e) }
if (!imageDetailsCache || typeof imageDetailsCache != 'object') imageDetailsCache = { };
const imgLoadCache = new Map, imgRequestCache = new Map;

function getImageDetails(imageUrl) {
	if (!imageUrl) throw 'Invalid argument';
	if (!httpParser.test(imageUrl)) return Promise.reject('Invalid URL');
	return imageUrl in imageDetailsCache ? Promise.resolve(imageDetailsCache[imageUrl]) : Promise.all([
		(function(imageUrl) {
			if (imgLoadCache.has(imageUrl)) return imgLoadCache.get(imageUrl);
			const loadWorker = new Promise(function(resolve, reject) {
				const image = new Image;
				image.onload = evt => { resolve({
					src: evt.currentTarget.src,
					width: evt.currentTarget.naturalWidth,
					height: evt.currentTarget.naturalHeight,
				}) };
				image.onerror = evt => { reject(evt.message || 'Image loading error (' + image.src + ')') };
				image.loading = 'eager';
				image.referrerPolicy = 'same-origin';
				image.src = imageUrl;
			});
			imgLoadCache.set(imageUrl, loadWorker);
			return loadWorker;
		})(imageUrl),
		(function(imageUrl) {
			if (imgRequestCache.has(imageUrl)) return imgRequestCache.get(imageUrl);
			const getByXHR = (method = 'GET') => new Promise(function(resolve, reject) {
				const params = { method: method, url: imageUrl, binary: true, timeout: 90e3, responseType: 'blob' };
				setUserAgent(params);
				let hdrSize, hdrType, hdrChecked = false, hXHR = GM_xmlhttpRequest(Object.assign(params, {
					onreadystatechange: function(response) {
						if (hdrChecked || response.readyState < XMLHttpRequest.HEADERS_RECEIVED) return;
						if (response.status < 200 || response.status >= 400) {
							reject(XHR.defaultErrorHandler(response));
							return hXHR.abort();
						}
						hdrChecked = true;
						if ([
							'imgur.com/removed.png',
							'gtimg.cn/music/photo_new/T001M000003kfNgb0XXvgV_0.jpg',
							'//discogs.com/8ce89316e3941a67b4829ca9778d6fc10f307715/images/spacer.gif',
							'amazon.com/images/I/31CTP6oiIBL.jpg',
							'amazon.com/images/I/31zMd62JpyL.jpg',
							'amazon.com/images/I/01RmK+J4pJL.gif',
							'/0dc61986-bccf-49d4-8fad-6b147ea8f327.jpg',
							'/ab2d1d04-233d-4b08-8234-9782b34dcab8.jpg',
							'postimg.cc/wkn3jcyn9/image.jpg',
							'tinyimg.io/notfound',
							'hdtracks.com/img/logo.jpg',
							'vgy.me/Dr3kmf.jpg',
							'/images/no-cover.png',
						].some(invalidUrl => response.finalUrl.endsWith(invalidUrl))) {
							reject('Dummy image (placeholder): ' + response.finalUrl);
							return hXHR.abort();
						}
						const Etag = /^(?:Etag)\s*:\s*(.+?)\s*$/im.exec(response.responseHeaders);
						if (Etag != null && [
							'd835884373f4d6c8f24742ceabe74946',
							'25d628d3d3a546cc025b3685715e065f42f9cbb735688b773069e82aac16c597f03617314f78375d143876b6d8421542109f86ccd02eab6ba8b0e469b67dc953',
							'"55fade2068e7503eae8d7ddf5eb6bd09"',
							'"1580238364"',
							'"rbFK6Ned4SXbK7Fsn+EfdgKVO8HjvrmlciYi8ZvC9Mc"',
							'7ef77ea97052c1abcabeb44ad1d0c4fce4d269b8a4f439ef11050681a789a1814fc7085a96d23212af594b6b2855c99f475b8b61d790f22b9d71490425899efa',
						].some(etag => etag.toLowerCase() == Etag[1].toLowerCase())) {
							reject('Dummy image (placeholder): ' + response.finalUrl);
							return hXHR.abort();
						}
						hdrSize = /^(?:Content-Length)\s*:\s*(\d+)\b/im.exec(response.responseHeaders);
						hdrSize = hdrSize != null ? parseInt(hdrSize[1]) : undefined;
						hdrType = /^(?:Content-Type)\s*:\s*(.+?)(?:\s*;(.+?))?\s*$/im.exec(response.responseHeaders);
						hdrType = hdrType != null ? hdrType[1] : undefined;
						if (hdrSize >= 0 && hdrType) {
							resolve({ size: hdrSize, type: hdrType });
							if (method != 'HEAD') hXHR.abort();
						} else if (method == 'HEAD') reject('Content size/type missing or invalid in header');
					},
					onload: function(response) {
						if (response.status >= 200 && response.status < 400) try {
							if ((hdrSize = response.response) instanceof Blob) resolve({
								size: hdrSize.size,
								type: hdrSize.type || hdrType,
							}); else if ((hdrSize = new Blob([response.responseText])) instanceof Blob) resolve({
								size: hdrSize.size,
								type: hdrType,
							}); else reject('Image content could not be loaded');
						} catch(e) { reject(e) } else reject(XHR.defaultErrorHandler(response));
					},
					onerror: response => { reject(XHR.defaultErrorHandler(response)) },
					ontimeout: response => { reject(XHR.defaultTimeoutHandler(response)) },
				}));
			});
			const loadWorker = getByXHR('GET'); //getByXHR('HEAD').catch(reason => getByXHR('GET'));
			imgRequestCache.set(imageUrl, loadWorker);
			return loadWorker;
		})(imageUrl).catch(function(reason) {
			console.warn(`[Cover Inspector] Failed to request remote image (${imageUrl}):`, reason);
			return null;
		}),
	]).then(workers => Object.assign({ localProxy: false }, workers[0], workers[1])).then(function(imageDetails) {
		if (imageDetails.width <= 0 || imageDetails.height <= 0) return Promise.reject('Zero area');
		const deproxiedSrc = deProxifyImgSrc(imageDetails.src);
		if (deproxiedSrc) return getImageDetails(deproxiedSrc)
			.then(imageDetails => Object.assign({ }, imageDetails, { localProxy: true }));
		// if (imageDetails.size < 2 * 2**10 && imageDetails.width == 400 && imageDetails.height == 100)
		// 	return Promise.reject('Known placeholder image');
		// if (imageDetails.size == 503) return Promise.reject('Known placeholder image');
		if (!(imageUrl in imageDetailsCache)) {
			imageDetailsCache[imageUrl] = imageDetails;
			try { sessionStorage.setItem('imageDetailsCache', JSON.stringify(imageDetailsCache)) }
				catch(e) { console.warn(e) }
		}
		return imageDetails;
	});
}

const bb2Html = bbBody => queryAjaxAPI('preview', undefined, { body: bbBody });
let userAuth = document.body.querySelector('input[name="auth"]');
if (userAuth != null) userAuth = userAuth.value; else if ((userAuth = document.body.querySelector('#nav_logout > a')) != null) {
	userAuth = new URLSearchParams(userAuth.search);
	userAuth = userAuth.get('auth') || null;
}
if (!userAuth) console.warn('[Cover Inspector] Failed to extract user auth key, removal from collages will be unavailable');
let noEditPerms = document.getElementById('nav_userclass'), cseSearchMenu;
noEditPerms = noEditPerms != null && ['User', 'Member', 'Power User'].includes(noEditPerms.textContent.trim());
const [readOnly, noBatchProcessing] = ['read_only', 'no_batch_processing'].map(prefName => GM_getValue(prefName, false));
const noAutoLookups = GM_getValue('no_auto_lookups', true);

const coverRelatedCollages = {
	'redacted.sh': {
		invalid: [31445],
		poor: [33309, 33307, 33308, 33310, 33314, 31735, 33306, 33311, 33312, 33313],
		investigate: [20036],
		missing: undefined,
	},
}[document.domain];
const inCoversCollage = (collageIndex, torrentGroup) => coverRelatedCollages
	&& Array.isArray(coverRelatedCollages[collageIndex]) && coverRelatedCollages[collageIndex][0] > 0
	&& torrentGroup && Array.isArray(torrentGroup.group.collages)
	&& torrentGroup.group.collages.some(collage => coverRelatedCollages[collageIndex].includes(collage.id));

function addToCoversCollage(collageIndex, groupId) {
	if (!coverRelatedCollages || !(Array.isArray(coverRelatedCollages[collageIndex]))
			|| coverRelatedCollages[collageIndex].length <= 0)
		return Promise.reject('Cover related collage not defined for current site');
	if (!(groupId > 0)) throw 'Invalid argument';
	return ajaxApiKey ? queryAjaxAPI('addtocollage', {
		collageid: coverRelatedCollages[collageIndex][GM_getValue('indifferent_collages', true) ?
			Math.floor(Math.random() * coverRelatedCollages[collageIndex].length) : 0],
	}, { groupids: groupId }).then(function(response) {
		if (response.groupsadded.includes(groupId)) return Promise.resolve('Added');
		if (response.groupsrejected.includes(groupId)) return Promise.reject('Rejected');
		if (response.groupsduplicated.includes(groupId)) return Promise.reject('Duplicated');
		return Promise.reject('Unknown status');
	}) : Promise.reject('API key not set');
}

function removeFromCollage(collageId, groupId) {
	if (!(collageId > 0) || !(groupId > 0)) throw 'Invalid argument';
	return userAuth ? LocalXHR.post('/collages.php', new URLSearchParams({
		action: 'manage_handle',
		collageid: collageId,
		groupid: groupId,
		auth: userAuth,
		submit: 'Remove',
	}), { responseType: null }) : Promise.reject('Not supported on this page');
}
const removeFromCoversCollage = (collageIndex, torrentGroup) => coverRelatedCollages
	&& Array.isArray(coverRelatedCollages[collageIndex]) ? Promise.all(torrentGroup.group.collages
		.map(collage => collage.id).filter(collageId => coverRelatedCollages[collageIndex].includes(collageId))
		.map(collageId => removeFromCollage(collageId, torrentGroup.group.id))).then(statuses => statuses.length)
	: Promise.reject('Cover related collages not defined for current site');

const testImageQuality = (imageUrl, acceptableLevel = 0) => getImageDetails(imageUrl).then(function(imageDetails) {
	const loDim = Math.min(imageDetails.width, imageDetails.height);
	const level = loDim < acceptableResolution ? 0 : loDim < fineResolution ? 1 : loDim < hqResolution ? 2 : 3;
	return level < acceptableLevel ? Promise.reject('Poor image resolution') : level;
});

function getLinks(descBody) {
	if (!descBody) return null;
	if (typeof descBody == 'string') descBody = domParser.parseFromString(descBody, 'text/html').body;
	if (descBody instanceof HTMLElement) descBody = descBody.getElementsByTagName('A'); else throw 'Invalid argument';
	if (descBody.length > 0) descBody = Array.from(descBody, function(a) {
		if (a.href && a.target == '_blank') try {
			const url = new URL(a), hostNorm = url.hostname.toLowerCase();
			if (hostNorm in hostSubstitutions) url.hostname = hostSubstitutions[hostNorm];
			return url;
		} catch(e) { console.warn(e) }
		return null;
	}).filter(url => url instanceof URL && !noCoverHere(url));
	return descBody.length > 0 ? descBody : null;
}
function isMusicResource(imageUrl) {
	if (imageUrl) try {
		imageUrl = new URL(imageUrl);
		const domain = imageUrl.hostname.split('.').slice(-2).join('.').toLowerCase();
		return musicResourceDomains.some(domain2 => domain2.toLowerCase() == domain);
	} catch (e) { console.warn(e) }
	return false;
}

function setGroupImage(groupId, imageUrl, summary = 'Automated attempt to lookup cover') {
	if (!(groupId > 0) || !imageUrl) throw 'Invalid argument';
	return queryAjaxAPI('groupedit', { id: groupId }, { image: imageUrl, summary: summary });
}
function autoLookupSummary(reason) {
	const summary = 'Automated attempt to lookup cover';
	if (/^(?:not set|unset|missing)$/i.test(reason)) reason = 'missing';
		else if (/\b(?:error|timeout)\b/i.test(reason)) reason = 'link broken';
	return reason ? summary + ' (' + reason + ')' : summary;
}

function setNewSrc(img, src) {
	if (!(img instanceof HTMLImageElement) || !src) throw 'Invalid argument';
	img.onload = function(evt) {
		if (evt.currentTarget.style.opacity < 1) evt.currentTarget.style.opacity = 1;
		evt.currentTarget.hidden = false;
	}
	img.onerror = evt => { evt.currentTarget.hidden = true };
	if (img.hasAttribute('onclick')) img.removeAttribute('onclick');
	img.onclick = evt => { lightbox.init(evt.currentTarget.src, 220) };
	img.src = src;
}

function counterDecrement(id, tableIndex) {
	if (!id) throw 'Invalid argument';
	let elem = 'div.cover-inspector';
	if (tableIndex) elem += '-' + tableIndex;
	elem += ' span.' + id;
	if ((elem = document.body.querySelector(elem)) == null || !(elem.count > 0)) return;
	if (--elem.count > 0) elem.textContent = elem.count; else {
		(elem = elem.parentNode).textContent = 'Batch completed';
		elem.style.color = 'green';
		elem.style.fontWeight = 'bold';
		setTimeout(function(elem) {
			elem.style.transition = 'opacity 2s ease-in-out';
			elem.style.opacity = 0;
			setTimeout(elem => { elem.remove() }, 2000, elem);
		}, 4000, elem);
	}
}

function inspectImage(img, groupId) {
	if (!(img instanceof HTMLImageElement)) throw 'Invalid argument';
	if (img.parentNode != null) img.parentNode.style.position = 'relative'; else return Promise.resolve(-1);
	const inListing = (function() {
		for (let elem = img; elem != null; elem = elem.parentNode) if (elem.tagName == 'DIV') {
			if (elem.classList.contains('group_image')) return true;
			if (elem.classList.contains('box_image')) return false;
		}
		throw 'Unexpected cover context';
	})();
	const isAlternateCover = !inListing && groupId > 0 && (id => (id = /^cover_(\d+)$/.exec(id)) != null && parseInt(id[1]) > 0)(img.id);
	let sticker;

	function editOnClick(elem, lookupFirst = false) {
		if (!(elem instanceof HTMLElement)) return;
		if (noEditPerms || !ajaxApiKey || readOnly || noAutoLookups) lookupFirst = false;
		elem.classList.add('edit');
		elem.style.cursor = 'pointer';
		elem.style.userSelect = 'none';
		elem.style['-webkit-user-select'] = 'none';
		elem.style['-moz-user-select'] = 'none';
		elem.style['-ms-user-select'] = 'none';
		if (elem.hasAttribute('onclick')) elem.removeAttribute('onclick');
		elem.onclick = function(evt) {
			if (evt.currentTarget.disabled) return false; else evt.currentTarget.disabled = true;
			(lookupFirst ? findCover(groupId, img) : Promise.reject('Lookup disabled')).catch(function() {
				const url = new URL('torrents.php', document.location.origin);
				url.searchParams.set('action', 'editgroup');
				url.searchParams.set('groupid', groupId);
				if ((evt.shiftKey || evt.ctrlKey) && typeof GM_openInTab == 'function')
					GM_openInTab(url.href, evt.shiftKey); else document.location.assign(url);
			});
			return false;
		};
		if (lookupFirst) imageHostHelper.then(ihh => { setTooltip(img, 'Auto cover lookup on click') });
	}

	function setSticker(imageUrl) {
		if ((sticker = img.parentNode.querySelector('div.cover-inspector')) != null) sticker.remove();
		sticker = document.createElement('DIV');
		sticker.className = 'cover-inspector';
		sticker.style = `position: absolute; display: flex; color: white; border: thin solid lightgray;
font-family: "Segoe UI", sans-serif; font-weight: 700; justify-content: flex-end;
cursor: default; transition-duration: 0.25s; z-index: 1; ${inListing ?
			'flex-flow: column; right: 0; bottom: 0; padding: 1pt 0 2pt; font-size: 6.5pt; text-align: right; line-height: 8pt;'
			: 'flex-flow: row wrap; right: -3pt; bottom: -7pt; padding: 1px; font-size: 8.5pt; max-width: 98%;'}`
		if (isAlternateCover && groupId > 0) sticker.style.bottom = '7pt';

		function span(content, className, isOK = false, tooltip) {
			const span = document.createElement('SPAN');
			if (className) span.className = className;
			span.style = `padding: 0 ${inListing ? '2px' : '4px'};`;
			if (!isOK) span.style.color = 'yellow';
			span.textContent = content;
			if (tooltip) setTooltip(span, tooltip);
			return span;
		}

		return (function() {
			if (!imageUrl) return Promise.reject('Void image URL');
			if (!httpParser.test(imageUrl)) return Promise.reject('Invalid image URL');
			return getImageDetails(imageUrl);
		})().then(function(imageDetails) {
			function isOutside(evt) {
				console.assert(evt instanceof MouseEvent);
				for (let tgt = evt.relatedTarget; tgt instanceof HTMLElement; tgt = tgt.parentNode)
					if (tgt == evt.currentTarget) return false;
				return true;
			}
			function addStickerItems(direction = 1, ...elements) {
				if (direction && elements.length > 0) direction = direction > 0 ? 'append' : 'prepend'; else return;
				if (!inListing) for (let element of direction == 'append' ? elements : elements.reverse()) {
					if (sticker.firstChild != null) sticker[direction]('/');
					sticker[direction](element);
				} else sticker[direction](...elements);
			}

			imageUrl = new URL(imageDetails.src || imageUrl);
			if (imageDetails.localProxy) setNewSrc(img, imageUrl);
			const isPreferredHost = Array.isArray(preferredHosts) && preferredHosts.includes(imageUrl.hostname);
			const isSizeOK = !(acceptableSize > 0) || imageDetails.size <= acceptableSize * 2**10;
			const isResolutionAcceptable = !(acceptableResolution > 0) || ((document.location.pathname == '/artist.php'
				|| imageDetails.width >= acceptableResolution) && imageDetails.height >= acceptableResolution);
			const isResolutionFine = isResolutionAcceptable && (!(fineResolution > 0) || ((document.location.pathname == '/artist.php'
				|| imageDetails.width >= fineResolution) && imageDetails.height >= fineResolution));
			const isTypeOK = !imageDetails.type
				|| preferredTypes.some(type => imageDetails.type.toLowerCase() == type);
			const friendlyHost = getHostFriendlyName(imageUrl.href);
			const resolution = span(imageDetails.width + '×' + imageDetails.height, 'resolution', isResolutionFine),
						size = span(formattedSize(imageDetails.size), 'size', isSizeOK),
						type = span(imageDetails.type, 'mime-type', isTypeOK);
			const domain = imageUrl.hostname.split('.').slice(-2).join('.');
			let host, lookup, downsize, rehost;
			addStickerItems(1, resolution, size);
			if (isPreferredHost && isSizeOK && isResolutionFine && isTypeOK) {
				sticker.style.backgroundColor = 'teal';
				sticker.style.opacity = 0;
				sticker.onmouseleave = img.onmouseleave = evt => { if (isOutside(evt)) sticker.style.opacity = 0 };
				if (imageDetails.type) addStickerItems(1, type);
			} else {
				function keyHandlers(evt) {
					if (evt.ctrlKey) evt.stopImmediatePropagation(); else return;
					const listIndexes = click2goHostLists.map((_, listNdx) => getDomainListIndex(imageUrl.hostname, listNdx));
					const dialog = document.createElement('DIALOG');
					dialog.innerHTML = `
<form method="dialog">
<div><span><b>List entry:</b></span>&nbsp;<div class="domain" style="font-family: monospace; display: inline-block;" /></div><br><br>
<div>
	<b>On lists:</b>&nbsp;
	<label style="cursor: pointer;" title="Blacklisted domains are always excluded from batch processing. Doesn't apply to downsizing and lookup tasks."><input name="lists" value="blacklist" type="radio" /> Blacklist</label>&nbsp;
	<label style="cursor: pointer;" title="Whitelisted domains are included in batch processing."><input name="lists" value="whitelist" type="radio" /> Whitelist</label>&nbsp;
	<label style="cursor: pointer;" title="Images at bad domains are always considered invalid and an attempt to lookup new cover image is made."><input name="lists" value="badlist" type="radio" /> Badlist</label>
</div><br>
<div>
	<input value="Update" type="button"><input value="Remove from all lists" type="button"><input value="Close" type="button">
</div>
</form>`;
					dialog.style = 'padding: 1rem; position: fixed; top: 40%; left: 0; right: 0; margin-left: auto; margin-right: auto; z-index: 9999; box-shadow: 2pt 2pt 5pt gray;';
					dialog.onclose = evt => { document.body.removeChild(evt.currentTarget) };
					const radios = dialog.querySelectorAll('input[name="lists"][type="radio"]'),
								buttons = dialog.querySelectorAll('input[type="button"]'),
								domain = dialog.querySelector('div.domain');
					function updateParts(index) {
						domain.dataset.index = index;
						for (let dp of domainParts) {
							const active = parseInt(dp.dataset.index) >= index;
							dp.style.opacity = active ? 1 : 0.5;
							dp.style.fontWeight = active ? 'bold' : 'normal';
							dp.style.color = active ? 'mediumblue' : null;
						}
					}
					imageUrl.hostname.split('.').forEach(function(domainPart, index, arr) {
						const span = document.createElement('SPAN'), notLast = index < arr.length - 1;
						span.textContent = domainPart;
						span.dataset.index = index;
						if (notLast) {
							span.style.cursor = 'pointer';
							span.onclick = evt => { updateParts(parseInt(evt.currentTarget.dataset.index)) };
						}
						domain.append(span);
						if (notLast) domain.append('.');
					});
					const domainParts = domain.getElementsByTagName('SPAN');
					updateParts(Math.min(Math.max(domainParts.length - 2, 0), 1));
					const inList = listIndexes.findIndex(index => index >= 0);
					if (inList >= 0) radios[inList].checked = true; else {
						buttons[0].disabled = true;
						for (let radio of radios) radio.onchange = () => { buttons[0].disabled = false };
					}
					buttons[0].onclick = function(evt) {
						radios.forEach(function(radio, index) {
							if (radio.checked && listIndexes[index] < 0) {
								click2goHostLists[index].push(Array.prototype.slice.call(domainParts, parseInt(domain.dataset.index))
									.map(domainPart => domainPart.textContent).join('.'));
								GM_setValue('click2go_' + radio.value, click2goHostLists[index].sort());
							} else if (!radio.checked && listIndexes[index] >= 0) {
								click2goHostLists[index].splice(listIndexes[index], 1);
								GM_setValue('click2go_' + radio.value, click2goHostLists[index]);
							}
						});
						dialog.close();
					};
					if (inList < 0) buttons[1].style.display = 'none';
					buttons[1].onclick = function(evt) {
						radios.forEach(function(radio, index) {
							if (listIndexes[index] >= 0) {
								click2goHostLists[index].splice(listIndexes[index], 1);
								GM_setValue('click2go_' + radio.value, click2goHostLists[index]);
							}
						});
						dialog.close();
					};
					buttons[2].onclick = evt => { dialog.close() };
					document.body.append(dialog);
					dialog.showModal();
					return false;
				}
				function getHostTooltip() {
					let tooltip = 'Hosted at ' + imageUrl.hostname;
					if (imageDetails.localProxy) tooltip += ' (locally proxied)';
					if (isOnDomainList(imageUrl.hostname, 2)) tooltip += ' (bad host)';
					else if (isOnDomainList(imageUrl.hostname, 0)) tooltip += ' (blacklisted from batch rehosting)';
					else if (isOnDomainList(imageUrl.hostname, 1)) tooltip += ' (whitelisted for batch rehosting)';
					if (isOnDomainList(imageUrl.hostname, 2)) tooltip += '\n(look up different version on simple click)';
					else if (!inListing || !isOnDomainList(imageUrl.hostname, 0))
						tooltip += '\n(rehost to site preferred host on simple click)';
					return tooltip + `

Ctrl + click to manage lists
(Ctrl +) middle click to open (full) image domain in new window`;
				}

				sticker.style.backgroundColor = '#ae2300';
				sticker.style.opacity = 2/3;
				sticker.onmouseleave = img.onmouseleave = evt => { if (isOutside(evt)) sticker.style.opacity = 2/3 };
				if (inListing && !isAlternateCover && groupId > 0) editOnClick(sticker);
				if (!isResolutionFine) {
					if (isResolutionAcceptable) {
						let color = acceptableResolution > 0 ? acceptableResolution : 0;
						color = (Math.min(imageDetails.width, imageDetails.height) - color) / (fineResolution - color);
						color = 0xFFFF20 + Math.round((0xC0 - 0x20) * color);
						resolution.style.color = '#' + color.toString(16).padStart(6, '0');
					}
					if (/*!isResolutionAcceptable && */!isAlternateCover && groupId > 0 && !readOnly && !noAutoLookups)
						lookup = resolution;
					else setTooltip(resolution, (isResolutionAcceptable ? 'Mediocre' : 'Poor') + ' image quality (resolution)');
				}
				if (!isPreferredHost) {
					host = span(friendlyHost || 'XTRN', 'unpreferred-host', false);
					if (imageDetails.localProxy) host.classList.add('local-proxy');
					if (isOnDomainList(imageUrl.hostname, 0)) {
						host.style.color = '#ffe';
						if (inListing) host.classList.add('blacklisted-from-click2go');
					} else if (isOnDomainList(imageUrl.hostname, 1)) {
						if (inListing) host.classList.add('whitelisted');
					} else if (!isOnDomainList(imageUrl.hostname, 2)) host.style.color = '#ffa';
					setTooltip(host, getHostTooltip());
					host.onclick = keyHandlers;
					host.onauxclick = function(evt) {
						if (evt.button != 1) return;
						GM_openInTab(evt.ctrlKey ? imageUrl.origin : imageUrl.protocol + '//' + domain, false);
						evt.preventDefault();
						return false;
					};
					addStickerItems(-1, host);
					if (!readOnly) rehost = host;
				}
				if (!isTypeOK) {
					type.onclick = function(evt) {
						if (!evt.shiftKey || !confirm(`This will add "${imageDetails.type}" to whitelisted image types`))
							return false;
						preferredTypes.push(imageDetails.type);
						GM_setValue('preferred_types', preferredTypes);
						alert('MIME types whitelist successfully updated. The change will apply on next page load.');
						return false;
					};
					setTooltip(type, 'Shift + click to whitelist mimietype');
					addStickerItems(1, type);
				}
				if (!imageDetails.localProxy && !isSizeOK && imageDetails.mimieType != 'image/gif' && !readOnly)
					downsize = size;
				if (!isAlternateCover && groupId > 0 && !noEditPerms && ajaxApiKey) imageHostHelper.then(function(ihh) {
					function setClick2Go(elem, clickHandler, tooltip) {
						if (!(elem instanceof HTMLElement) || elem.classList.contains('blacklisted-from-click2go')) return null;
						if (typeof clickHandler != 'function') throw 'Invalid argument';
						elem.classList.add('click2go');
						elem.style.cursor = 'pointer';
						elem.style.transitionDuration = '250ms';
						elem.onmouseenter = elem.onmouseleave = function(evt) {
							if (evt.relatedTarget == evt.currentTarget) return false;
							evt.currentTarget.style.textShadow = evt.type == 'mouseenter' ? '0 0 5px lime' : null;
						};
						elem.onclick = clickHandler;
						if (tooltip) setTooltip(elem, tooltip);
						return elem;
					}

					let summary, tableIndex;
					if ('tableIndex' in img.dataset) tableIndex = parseInt(img.dataset.tableIndex);
					setClick2Go(lookup, function(evt) {
						evt.stopPropagation();
						if (evt.currentTarget.disabled) return false; else evt.currentTarget.disabled = true;
						lookup = evt.currentTarget;
						img.style.opacity = 0.3;
						queryAjaxAPI('torrentgroup', { id: groupId }).then(function(torrentGroup) {
							if (lookup == resolution && ![1].includes(torrentGroup.group.categoryId) && isResolutionAcceptable)
								return !isPreferredHost ? ihh.rehostImageLinks([imageUrl.href], true, false, true).then(ihh.singleImageGetter)
										.then(imageUrl => setGroupImage(torrentGroup.group.id, imageUrl, summary).then(function(response) {
									console.log('[Cover Inspector]', response);
									setNewSrc(img, imageUrl);
									return setSticker(imageUrl);
								})) : (img.style.opacity = 1);
							return coverLookup(torrentGroup, ihh, lookup == resolution).then(imageUrls => (lookup == resolution ?
									getImageDetails(imageUrls[0]).catch(reason => null) : null).then(function(newImageDetails) {
								switch (lookup) {
									case resolution:
										console.assert(acceptableResolution > 0);
										if (newImageDetails != null && !(newImageDetails.width * newImageDetails.height > imageDetails.width * imageDetails.height))
											return Promise.reject(`New cover found in no better resolution (${newImageDetails.width}×${newImageDetails.height})`);
										summary = 'Automated attempt to lookup better quality cover';
										// if (newImageDetails != null)
										// 	summary += ` (${imageDetails.width}×${imageDetails.height} → ${newImageDetails.width}×${newImageDetails.height})`;
										break;
									default:
										summary = 'Automated attempt to lookup cover';
								}
								return ihh.rehostImageLinks(imageUrls).then(ihh.singleImageGetter)
										.then(imageUrl => setGroupImage(torrentGroup.group.id, imageUrl, summary).then(function(response) {
									console.log('[Cover Inspector]', response);
									setNewSrc(img, imageUrl);
									const status = setSticker(imageUrl);
									if (inListing && autoOpenSucceed) openGroup(torrentGroup);
									if (newImageDetails == null) return status.then(function(status) {
										if ((status & 0b100) == 0 || (status & 0b10) == 0 && [1].includes(torrentGroup.group.categoryId))
											return Promise.reject('New cover found in poor quality');
										if (inCoversCollage('poor', torrentGroup)) removeFromCoversCollage('poor', torrentGroup);
									});
									const loDim = Math.min(newImageDetails.width, newImageDetails.height);
									if (loDim < acceptableResolution || loDim < fineResolution && [1].includes(torrentGroup.group.categoryId))
										return Promise.reject('New cover found in poor quality');
									if (inCoversCollage('poor', torrentGroup)) removeFromCoversCollage('poor', torrentGroup);
								}));
							})).catch(function(reason) {
								if (lookup == resolution && [1].includes(torrentGroup.group.categoryId)
										&& !inCoversCollage('poor', torrentGroup)) addToCoversCollage('poor', torrentGroup.group.id);
								return Promise.reject(reason);
							});
						}).catch(function(reason) {
							ihh.logFail(`groupId ${groupId} cover lookup failed: ${reason}`);
							img.style.opacity = 1;
							lookup.disabled = false;
						}).then(() => { counterDecrement('process-covers-countdown', tableIndex) });
					}, lookup == resolution ? (isResolutionAcceptable ? 'Mediocre' : 'Poor') + ' image quality (resolution)' : undefined ) || setClick2Go(downsize, function(evt) {
						evt.stopPropagation();
						if (evt.currentTarget.disabled) return false; else evt.currentTarget.disabled = true;
						downsize = evt.currentTarget;
						img.style.opacity = 0.3;
						ihh.reduceImageSize(imageUrl.href, 2160, 90).then(output => output.size < imageDetails.size ?
								ihh.rehostImages([output.uri]).then(ihh.singleImageGetter).then(function(imageUrl) {
							summary = 'Automated cover downsize';
							if (!isSizeOK) summary += ` (${formattedSize(imageDetails.size)} → ${formattedSize(output.size)})`;
							return setGroupImage(groupId, imageUrl, summary).then(function(response) {
								console.log('[Cover Inspector]', response);
								setNewSrc(img, imageUrl);
								setSticker(imageUrl);
							});
						}) : Promise.reject('Converted image not smaller')).catch(function(reason) {
							ihh.logFail(`groupId ${groupId} cover downsize failed: ${reason}`);
							img.style.opacity = 1;
							downsize.disabled = false;
						}).then(() => { counterDecrement('process-covers-countdown', tableIndex) });
					}, 'Downsize on click') || setClick2Go(rehost, function(evt) {
						evt.stopImmediatePropagation();
						if (evt.ctrlKey) return keyHandlers(evt);
						if (evt.currentTarget.disabled) return false; else evt.currentTarget.disabled = true;
						rehost = evt.currentTarget;
						img.style.opacity = 0.3;
						summary = 'Automated cover rehost';
						//summary += ' (' + imageUrl.hostname + ')';
						getImageMax(imageUrl.href).then(maxImgUrl => ihh.rehostImageLinks([maxImgUrl], true, false, true)
							.then(ihh.singleImageGetter)).then(imageUrl => setGroupImage(groupId, imageUrl, summary).then(function(response) {
								console.log('[Cover Inspector]', response);
								setNewSrc(img, imageUrl);
								setSticker(imageUrl);
							})).catch(function(reason) {
								ihh.logFail(`groupId ${groupId} cover rehost failed: ${reason}`);
								img.style.opacity = 1;
								rehost.disabled = false;
							}).then(() => { counterDecrement('process-covers-countdown', tableIndex) });
					});
				});
			}

			sticker.title = imageUrl.href; //setTooltip(sticker, imageUrl.href);
			sticker.onmouseenter = img.onmouseenter = evt => { sticker.style.opacity = 1 };
			img.after(sticker);
			const status = 1 << 8 | 1 << 7
				| (![host, downsize, lookup].some(elem => elem instanceof HTMLElement)) << 6
				| !imageDetails.localProxy << 5 | isPreferredHost << 4 | isSizeOK << 3
				| isResolutionAcceptable << 2 | isResolutionFine << 1 | isTypeOK << 0;
			img.dataset.statusFlags = status.toString(2).padStart(9, '0');
			return status;
		}).catch(function(reason) {
			img.hidden = true;
			if (groupId > 0) if (!isAlternateCover) editOnClick(sticker, true); else if (GM_getValue('auto_remove_invalid', true)) {
				let div = img.parentNode;
				if (div != null && (div = div.parentNode) != null) {
					let rmCmd = div.querySelector('span.remove_cover_art > a');
					if (rmCmd != null && (rmCmd.parentNode.previousSibling == null || !rmCmd.parentNode.previousSibling.textContent.trim())
							&& typeof rmCmd.onclick == 'function' && (rmCmd = /\bajax\.get\((.+?)\)/.exec(rmCmd.onclick.toString())) != null) {
						eval(rmCmd[0]);
						div.remove();
						return -1;
					}
				}
			}
			sticker.style = `
position: static; padding: 10pt; box-sizing: border-box; width: ${inListing ? '90px' : '100%'}; z-index: 1;
text-align: center; background-color: red; font: 700 auto "Segoe UI", sans-serif;
`;
			sticker.append(span('INVALID'));
			setTooltip(sticker, reason);
			img.after(sticker);
			img.dataset.statusFlags = (1 << 8).toString(2).padStart(9, '0');
			return 1 << 8;
		});
	}

	if (groupId > 0 && !isAlternateCover) imageHostHelper.then(function(ihh) {
		img.classList.add('drop');
		img.ondragover = evt => false;
		if (img.clientWidth > 100) img.ondragenter = img[`ondrag${'ondragexit' in img ? 'exit' : 'leave'}`] = function(evt) {
			if (evt.relatedTarget == evt.currentTarget) return false;
			evt.currentTarget.parentNode.parentNode.style.backgroundColor = evt.type == 'dragenter' ? '#7fff0040' : null;
		};
		img.ondrop = function(evt) {
			function dataSendHandler(endPoint) {
				sticker = evt.currentTarget.parentNode.querySelector('div.cover-inspector');
				if (sticker != null) sticker.disabled = true;
				img.style.opacity = 0.3;
				endPoint([items[0]], true, false, true, {
					ctrlKey: evt.ctrlKey,
					shiftKey: evt.shiftKey,
					altKey: evt.altKey,
				}).then(ihh.singleImageGetter).then(imageUrl =>
						setGroupImage(groupId, imageUrl, 'Cover update from external link').then(function(response) {
					console.log('[Cover Inspector]', response);
					setNewSrc(img, imageUrl);
					setSticker(imageUrl).then(status => { updateCoverCollages(status, groupId) });
				})).catch(function(reason) {
					ihh.logFail(`groupId ${groupId} cover update failed: ${reason}`);
					if (sticker != null) sticker.disabled = false;
					img.style.opacity = 1;
				});
			}

			evt.stopPropagation();
			let items = evt.dataTransfer.getData('text/uri-list');
			if (items) items = items.split(/\r?\n/); else {
				items = evt.dataTransfer.getData('text/x-moz-url');
				if (items) items = items.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
					else if (items = evt.dataTransfer.getData('text/plain'))
						items = items.split(/\r?\n/).filter(RegExp.prototype.test.bind(httpParser));
			}
			if (Array.isArray(items) && items.length > 0) {
				if (confirm('Update torrent cover from the dropped URL?\n\n' + items[0])) dataSendHandler(ihh.rehostImageLinks);
			} else if (evt.dataTransfer.files.length > 0) {
				items = Array.from(evt.dataTransfer.files)
					.filter(file => file instanceof File && file.type.startsWith('image/'));
				if (items.length > 0 && confirm('Update torrent cover from the dropped file?')) dataSendHandler(ihh.uploadFiles);
			}
			if (img.clientWidth > 100) evt.currentTarget.parentNode.parentNode.style.backgroundColor = null;
			return false;
		};
	});
	if (hasArtworkSet(img)) return setSticker(realImgSrc(img));
	img.dataset.statusFlags = (0).toString(2).padStart(8, '0');
	if (!isAlternateCover && groupId > 0) editOnClick(img, true);
	return Promise.resolve(0);
}

const recoverableHttpErrors = [/*0, */500, 502, 503, 504, 520, /*521, */522, 523, 524, 525, /*526, */527, 530];
const bpRequestsCache = new Map;
const requestsCache = new Map, mbRequestsCache = new Map, caRequestsCache = new Map;
let mbLastRequest = null, bpAccessToken = null, spfAccessToken = null;
const bareReleaseTitle = title => title && [
	/\s+(?:EP|E\.\s?P\.|-\s+(?:EP|E\.\s?P\.))$/i,
	/\s+\((?:EP|E\.\s?P\.|Live)\)$/i, /\s+\[(?:EP|E\.\s?P\.|Live)\]$/i,
	///\s+\((?:feat\.|ft\.|featuring\s).+\)$/i, /\s+\[(?:feat\.|ft\.|featuring\s).+\]$/i,
].reduce((title, rx) => title.replace(rx, ''), title.trim());

function cseSearch(album, artist, country = GM_getValue('cse_country', 'us')) {
	if (!album) return Promise.reject('Album missing');
	const origin = 'https://covers.musichoarders.xyz', getAuth = () => (async function(au, cu) {
		const e = Math.floor(Math.floor(new Date().getTime() / 1000) / cu);
		const t = await crypto.subtle.importKey('raw', new TextEncoder().encode(au),
			{ name: 'HMAC', hash: { name: 'SHA-256' } }, !0, ['sign']);
		const n = await crypto.subtle.sign('HMAC', t, new Int32Array([e]).buffer);
		return btoa(String.fromCharCode(...new Uint8Array(n)));
	})('yUzpZk3QDoq6ztdbTB9Zx9MwTB4SSwtj', 150), apiHeaders = headers => Object.assign({
		'Referer': origin + '/', 'Origin': origin,
		'X-Session': crypto.randomUUID().replaceAll('-', ''), 'X-Page-Query': '', 'X-Page-Referrer': '',
	}, headers);
	return GlobalXHR.get(origin + '/api/info', { responseType: 'json', headers: apiHeaders() }).then(function({json}) {
		if (!json.sources || json.sources.length <= 0) throw 'Assertion failed: Sources not found';
		console.log('CSE API info:', json);
		GM_setValue('cse_api_info', json);
		return json;
	}).catch(function(reason) {
		console.warn('CSE API Info failed:', reason);
		return GM_getValue('cse_api_info', null);
	}).then(function(apiInfo) {
		function safeTerm(term = '') {
			if (term.length > 100) for (let words = (term = term.trim().split(/\s+/)).length; words > 0; --words) {
				const newTerm = term.slice(0, words).join(' ');
				if (newTerm.length <= 100) return newTerm;
			} else return term;
			return '';
		}

		let sources = apiInfo != null && apiInfo.sources ?
			apiInfo.sources.filter(source => source.enabled).map(source => source.id) : [ ];
		if (sources.length <= 0) sources = [
			'applemusic', 'itunes', 'qobuz', 'deezer', 'tidal', 'amazonmusic', 'bandcamp',
			'gracenote', 'soundcloud', 'musicbrainz', 'spotify', 'vgmdb', 'bugs', 'flo', 'netease',
			'linemusic', 'recochoku', 'kugou', 'gaana', 'discogs', 'soulseek', 'lastfm',
			'metalarchives', 'fanarttv', 'melon', 'ototoy', 'kkbox', 'beatport', 'booth', 'thwiki',
		];
		let batchSize = apiInfo != null && apiInfo.activeSourceLimit || 12;
		batchSize = Math.ceil(sources.length / Math.ceil(sources.length / batchSize));
		if (!country || apiInfo != null && apiInfo.countries && apiInfo.countries.length > 0
				&& !apiInfo.countries.some(c => c.toLowerCase() == country.toLowerCase())) country = 'us';
		const search = sources => getAuth().then(auth => GlobalXHR.post(origin + '/api/search', {
			album: safeTerm(album),
			artist: safeTerm(artist || ''),
			country: country,
			sources: sources,
		}, {
			responseType: 'text',
			headers: apiHeaders({ Authorization: 'Bearer ' + auth }),
		}).then(({responseText}) => responseText.split(/(?:\r?\n)+/).map(function(line) {
			try { if (line.trim() && (line = JSON.parse(line)).type == 'cover') {
				for (let prop of ['type', 'cache']) delete line[prop];
				return line;
			} } catch(e) { console.warn(e, 'Line:', line) }
		}).filter(Boolean))), searchWorkers = [ ];
		for (let offset = 0; offset < sources.length; offset += batchSize)
			searchWorkers.push(search(sources.slice(offset, offset + batchSize)));
		return Promise.all(searchWorkers).then(results =>
			(results = Array.prototype.concat.apply([ ], results)).length > 0 ? results : Promise.reject('No results'));
	});
}

function checkBarcode(barcode, allowAddCheckDigit = false) {
	if (!barcode || !/^\d+$/.test(barcode = barcode.replace(/\W+/g, '')) || barcode.length < 7)
		return console.info('Invalid barcode: %s (%s)', barcode, 'invalid format');
	const typeString = { 8: 'EAN-8', 12: 'UPC', 13: 'EAN-13', 14: 'GTIN' };
	const validated = (function checkBarcode(barcode) {
		const digits = Array.from(barcode, ch => parseInt(ch));
		const checkDigit = (effectiveLength = digits.length) => digits.length > 0 && effectiveLength > 0 ?
			(10 - digits.slice(0, effectiveLength).reverse().reduce((sum, digit, index) =>
				sum + digit * ((index & 1) == 0 ? 3 : 1), 0) % 10) % 10 : undefined;
		const checkDigitAt = (skipNumbers = 0) => checkDigit(digits.length - 1 - skipNumbers)
			== digits[digits.length - 1 - skipNumbers];
		if (typeString[digits.length] && checkDigitAt(0)) {
			console.info('Valid %s:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length - 2] && checkDigitAt(2)) {
			barcode = barcode.slice(0, -2);
			console.info('Valid %s with 2 char add-on code:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length - 5] && checkDigitAt(5)) {
			barcode = barcode.slice(0, -5);
			console.info('Valid %s with 5 char add-on code:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length + 1] && allowAddCheckDigit) {
			barcode += checkDigit(digits.length);
			console.info('Valid %s after adding check digit:', typeString[barcode.length], barcode);
			return barcode;
		} else if (digits.length < 18) return checkBarcode('0' + barcode);
	})(barcode);
	if (validated) return validated;
	console.info('Invalid barcode: %s (%s)', barcode,
		typeString[barcode.length] ? 'check digit mismatch' : 'invalid length');
}

function coverLookup(torrentGroup, ihh, qualityAccent = false) {
	if (!torrentGroup || !ihh) throw 'Invalid argument';
	const namedFn = (fn, name) => Object.defineProperty(fn, 'name', { value: name, configurable: true });
	const namesToSearchTerm = names => names.filter(Boolean).map(name => '"' + name + '"').join(' ');
	let qA = GM_getValue('image_lookup_quality_accent');
	if (qA && typeof (qA = { 'always': true, 'never': false }[qA.toLowerCase()]) == 'Boolean') qualityAccent = qA;
	let lookupWorkers = [ ], workersOrder;

	switch (torrentGroup.group.categoryId) {
		case 1: { // Music category
			const strippers = [
				/^(?:Not On Label|Self[\s\-]Released|None)$|(?:\s+\b(?:Record(?:ing)?s)\b|,?\s+(?:Ltd|Inc|Co)\.?)+$|[\s\-]+/ig,
				/^(?:None)$|[\s\-]+/ig,
			].map(rx => idStr => idStr && idStr.trim().replace(rx, '').toLowerCase() || undefined);
			const audioFileCount = torrent => torrent && torrent.fileList ? torrent.fileList.split('|||').filter(file =>
				/^(.+\.(?:flac|mp3|m4[ab]|aac|dts(?:hd)?|truehd|ac3|ogg|opus|wv|ape))\{{3}(\d+)\}{3}$/i.test(file)).length : 0;
			const mainArtist = (function() {
				let mainArtist = 'dj' in torrentGroup.group.musicInfo && torrentGroup.group.musicInfo.dj[0];
				if (!mainArtist && torrentGroup.group.releaseType != 7 && 'artists' in torrentGroup.group.musicInfo)
					mainArtist = torrentGroup.group.musicInfo.artists[0];
				if (mainArtist) return mainArtist.name;
			})();
			const barcodes = Array.isArray(torrentGroup.torrents) && torrentGroup.torrents.length > 0 ? (function() {
				const barcodes = Array.prototype.concat.apply([ ], torrentGroup.torrents.map(function(torrent) {
					const catNos = torrent.remasterCatalogueNumber.split(/[\/\|\,\;]+/)
						.map(catNo => checkBarcode(catNo, true)).filter(Boolean);
					if (catNos.length > 0) return catNos;
				}).filter(Boolean));
				return barcodes.length > 0 ? Promise.resolve(barcodes) : Promise.reject('No torrents with barcode/UPC');
			})() : Promise.reject('Cover lookup by barcode/UPC not available');
			const allLabelsCatNos = (function() {
				const queryParams = torrentGroup.torrents.map(function(torrent) {
					if (!torrent.remasterRecordLabel || !torrent.remasterCatalogueNumber) return null;
					const [labels, catNos] = [torrent.remasterRecordLabel, torrent.remasterCatalogueNumber].map(value =>
						(value = value.split(/[\/\|]+/).map(value => value.trim()).filter(Boolean)).length > 0 ? value : null).filter(Boolean);
					return labels.length > 0 && catNos.length == labels.length ? labels.map((label, index) => ({
						label: label.replace(/(?:\s+Record(?:s|ings)|,?\s+(?:Inc|Ltd|GmBH|a\.?s|s\.?r\.?o)\.?)+$/i, ''),
						catno: catNos[index],
					})) : null;
				}).filter(Boolean);
				return queryParams.length > 0 ? Array.prototype.concat.apply([ ], queryParams).filter((qp1, ndx, arr) =>
					arr.findIndex(qp2 => Object.keys(qp2).every(key => qp2[key] == qp1[key])) == ndx) : null;
			})();
			workersOrder = qualityAccent ? [
				'itunesSearchByUPC', 'bpSearchByUPC', 'spfSearchByUPC', 'mbSearchByBarcode', 'dcSearchByBarcode',
				'mbSearchByDiscId', 'bpSearchByArtistAlbumStrict',
				'mbSearchByLabelCatno', 'dcSearchByLabelCatno',
				'getImagesFromWikiBodyLinks',
				'mbSearchByArtistAlbum', 'dcSearchByArtistMaster', 'dcSearchByArtistRelease',
				'spfSearchByArtistAlbum', 'itunesSearchByArtistAlbum', 'bcSearchByArtistAlbum', 'bpSearchByArtistAlbum',
			] : [
				'itunesSearchByUPC', 'bpSearchByUPC', 'mbSearchByBarcode', 'spfSearchByUPC',
				'itunesSearchByArtistAlbum',
				'bpSearchByArtistAlbumStrict', 'mbSearchByDiscId',
				'mbSearchByLabelCatno', 'dcSearchByBarcode', 'bcSearchByArtistAlbum',
				'getImagesFromWikiBodyLinks',
				'dcSearchByLabelCatno',
				'mbSearchByArtistAlbum', 'spfSearchByArtistAlbum',
				'dcSearchByArtistMaster', 'dcSearchByArtistRelease',
				'bpSearchByArtistAlbum',
			];
			// ####################################### Extract from desc. links #######################################
			lookupWorkers.push(function getImagesFromWikiBodyLinks() {
				const links = getLinks(torrentGroup.group.wikiBody);
				if (!links) return Promise.reject('No active external links found in dscriptions');
				return Promise.all(links.map(url => ihh.imageUrlResolver(url.href).then(singleResultGetter, reason => null)))
					.then(imageUrls => (imageUrls = imageUrls.filter(isMusicResource)).length > 0 ? imageUrls
						: Promise.reject('No cover images could be extracted from links in wiki body'));
			});
			// ############################### Ext. lookup at Discogs, req. credentials ###############################
			const dcApiRequestsCache = new Map, dcAuth = (function() {
				const token = GM_getValue('discogs_api_token');
				if (token) return { token: token };
				const [key, secret] = ['discogs_api_consumerkey', 'discogs_api_consumersecret'].map(name => GM_getValue(name));
				if (key && secret) return { key: key, secret: secret };
				//return { key: '', secret: '' };
			})(), dcApiRateControl = { requestsMax: dcAuth ? 60 : 25 };
			if (dcAuth instanceof Object) {
				function apiRequest(endPoint, params) {
					if (endPoint) endPoint = new URL(endPoint, 'https://api.discogs.com');
						else return Promise.reject('No endpoint provided');
					if (params instanceof URLSearchParams) endPoint.search = params;
					else if (params instanceof Object) for (let key in params) endPoint.searchParams.set(key, params[key]);
					else if (params) endPoint.search = new URLSearchParams(params);
					const cacheKey = endPoint.pathname.slice(1) + endPoint.search;
					if (dcApiRequestsCache.has(cacheKey)) return dcApiRequestsCache.get(cacheKey);
					// if (!dcApiResponses && 'discogsApiResponseCache' in sessionStorage) try {
					// 	dcApiResponses = JSON.parse(sessionStorage.getItem('discogsApiResponseCache'));
					// } catch(e) {
					// 	sessionStorage.removeItem('discogsApiResponseCache');
					// 	console.warn(e);
					// }
					// if (dcApiResponses && cacheKey in dcApiResponses) return Promise.resolve(dcApiResponses[cacheKey]);
					params = { method: 'GET', url: endPoint, responseType: 'json', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } };
					if (dcAuth instanceof Object) {
						params.headers.Authorization = 'Discogs ' + Object.keys(dcAuth).map(key => key + '=' + dcAuth[key]).join(', ');
						//for (let key in dcAuth) endPoint.searchParams.set(key, dcAuth[key]);
					}
					const request = new Promise(function(resolve, reject) {
						function request() {
							const now = Date.now();
							if (!dcApiRateControl.timeFrameExpiry || now > dcApiRateControl.timeFrameExpiry) {
								dcApiRateControl.timeFrameExpiry = now + 60 * 1000 + 500;
								if (dcApiRateControl.requestDebt > 0) {
									dcApiRateControl.requestCounter = Math.min(dcApiRateControl.requestsMax, dcApiRateControl.requestDebt);
									dcApiRateControl.requestDebt -= dcApiRateControl.requestCounter;
									console.assert(dcApiRateControl.requestDebt >= 0, 'dcApiRateControl.requestDebt >= 0');
								} else dcApiRateControl.requestCounter = 0;
							}
							if (dcApiRateControl.requestCounter++ < dcApiRateControl.requestsMax) GM_xmlhttpRequest(params);
							else postpone(now);
						}

						const postpone = timeStamp => setTimeout(request, dcApiRateControl.timeFrameExpiry - timeStamp);
						let retryCounter = 0;
						params.onload = function(response) {
							response = GlobalXHR.responseAdapter(response, true);
							const [rateLimit, rateLimitUsed, rateLimitRemaining] = ['ratelimit', 'ratelimit-used', 'ratelimit-remaining']
								.map(header => parseInt(response.headers['x-discogs-' + header]));
							console.assert(rateLimit > 0 && rateLimitUsed >= 0, response.responseHeaders);
							if (rateLimit > 0) dcApiRateControl.requestsMax = rateLimit;
							if (rateLimitUsed + 1 > dcApiRateControl.requestCounter) dcApiRateControl.requestCounter = rateLimitUsed + 1;
							dcApiRateControl.requestDebt = Math.max(dcApiRateControl.requestCounter - dcApiRateControl.requestsMax, 0);
							if (response.status >= 200 && response.status < 400) {
								// if (!quotaExceeded) try {
								// 	if (!dcApiResponses) dcApiResponses = { };
								// 	dcApiResponses[cacheKey] = response.response;
								// 	sessionStorage.setItem('discogsApiResponseCache', JSON.stringify(dcApiResponses));
								// } catch(e) {
								// 	quotaExceeded = true;
								// 	console.warn(e);
								// }
								resolve(response.response);
							} else {
								const error = XHR.defaultErrorHandler(response);
								if (response.status == 429) {
									console.warn(error, response.response && response.response.message || response.statusText,
										`Rate limit used: ${rateLimitUsed}/${dcApiRateControl.requestsMax}`);
									postpone(Date.now());
								} else if (XHR.recoverableErrors.has(response.status) && retryCounter++ < XHR.maxRetries)
									setTimeout(request, XHR.retryTimeout);
								else reject(error);
							}
						};
						params.onerror = function(response) {
							const error = XHR.defaultErrorHandler(response);
							if (response.status == 0 && !response.finalUrl && retryCounter++ < XHR.maxRetries)
								setTimeout(request, XHR.retryTimeout);
							else reject(error);
						};
						params.ontimeout = response => { reject(XHR.defaultTimeoutHandler(response)) };
						request();
					});
					dcApiRequestsCache.set(cacheKey, request);
					return request;
				}
				function search(type, queryParams, strictReleaseMatch = false) {
					if (!type || !queryParams) throw 'Invalid argument';
					const searchParams = new URLSearchParams(queryParams);
					if (type) searchParams.set('type', type = type.toLowerCase());
					searchParams.set('sort', 'score');
					searchParams.set('sort_order', 'desc');
					searchParams.set('per_page', 100);
					return apiRequest('database/search', searchParams).then(function(response) {
						function getFromResults(results) {
							if (!results || results.length <= 0) return Promise.reject('No matches');
							const coverImages = results.map(result => result.cover_image || singleResultGetter(result.images))
								.filter(coverImage => coverImage && !coverImage.endsWith('/spacer.gif'));
							return coverImages.length > 0 ? coverImages : Promise.reject('None of matched results has cover');
						}
						function getFromMR(masterIds) {
							if (!masterIds || masterIds.size <= 0) return Promise.reject('No matches');
							if (masterIds.size > 1) return Promise.reject('Ambiguous results');
							if (!((masterIds = masterIds.values().next().value) > 0)) return Promise.reject('No master release');
							return apiRequest('masters/' + masterIds).then(masterRelease => masterRelease.images && masterRelease.images.length > 0 ?
								masterRelease.images.map(image => image.uri || image.resource_url) : Promise.reject('No cover image for master release'));
							//return ihh.imageUrlResolver('https://www.discogs.com/master/' + masterIds).then(singleResultGetter);
						}

						let results = response.results, masterIds;
						if (results && results.length > 0) switch (type) {
							case 'release': {
								const getMasterIds = results => new Set(results.map(result => result.master_id));
								if (strictReleaseMatch || getMasterIds(results).size > 1) results = results.map(result =>
											apiRequest('releases/' + result.id).catch(reason => null).then(function(release) {
									const releaseYear = release != null && release.year || new Date(result.year).getUTCFullYear();
									const releaseTracks = release != null && release.tracklist ? release.tracklist.filter(track =>
										['track', 'index'].includes(track.type_)/* && !/^\d+\.\d+/.test(track.position)*/).length : -1;
									if (torrentGroup.torrents.some(function(torrent) {
										if (torrent.remasterYear > 0 && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
										const torrentIds = ['remasterRecordLabel', 'remasterCatalogueNumber']
											.map((prop, index) => torrent[prop].split(/[\/\|]+/).map(strippers[index]).filter(Boolean));
										if (release != null && release.labels && release.labels.some(function(label) {
											label = ['name', 'catno'].map((prop, index) => strippers[index](label[prop]));
											return label[1] && label.every((id, index) => !id || torrentIds[index].includes(id));
										})) return true;
										const torrentTracks = audioFileCount(torrent);
										if (torrentTracks > 0 && releaseTracks > 0 && torrentTracks != releaseTracks) return false;
										return torrent.remasterYear > 0 && releaseYear > 0 || torrentTracks > 0 && releaseTracks > 0;
									})) return result;
								}));
								return Promise.all(results).then(results => results.filter(Boolean)).then(function(results) {
									if (results.length > 1) {
										//if (strictReleaseMatch) return Promise.reject('Ambiguous results');
										console.info('[Cover Inspector] Ambiguous Discogs results for lookup query (type=%s, queryParams=%o)', type, queryParams);
									}
									if ((masterIds = getMasterIds(results)).size > 1) return Promise.reject('Ambiguous results');
									return getFromMR(masterIds).catch(reason => getFromResults(results));
								});
								break;
							}
							case 'master':
								return results.length > 1 ? Promise.reject('Ambiguous results') : getFromResults(results);
								break;
							default: return Promise.reject('Unsupported search type');
						} else return Promise.reject('No matches');
					});
				}

				const dcLookupWorkers = [
					namedFn(() => barcodes.then(barcodes => Promise.all(barcodes.map(barcode =>
						search('release', { barcode: barcode }).catch(reason => null))).then(imageUrls =>
							(imageUrls = imageUrls.filter(Boolean)).length > 0 ? Array.prototype.concat.apply([ ], imageUrls)
								: Promise.reject('No covers found by barcode'))), 'dcSearchByBarcode'),
					function dcSearchByLabelCatno() {
						if (!Array.isArray(torrentGroup.torrents) || torrentGroup.torrents.length <= 0)
							return Promise.reject('Cover lookup by label/cat.no. not available');
						if (allLabelsCatNos == null) return Promise.reject('No torrents with label/cat.no.');
						return Promise.all(allLabelsCatNos.map(queryParams => search('release', queryParams, true).catch(reason => null)))
							.then(imageUrls => (imageUrls = imageUrls.filter(Boolean)).length > 0 ? Array.prototype.concat.apply([ ], imageUrls)
								: Promise.reject('No covers found by label/cat.no.'));
					},
					function dcSearchByArtistMaster() {
						const queryParams = { };
						if (mainArtist) queryParams.artist = mainArtist; else if (torrentGroup.group.releaseType != 7)
							return Promise.reject('Cover lookup by artist/album/year not available');
						queryParams.release_title = bareReleaseTitle(torrentGroup.group.name);
						queryParams.year = torrentGroup.group.year;
						if ([6, 7].includes(torrentGroup.group.releaseType)) queryParams.format = 'Compilation';
						queryParams.strict = true; //!artistName
						return search('master', queryParams);
					},
					function dcSearchByArtistRelease() {
						const queryParams = { };
						if (mainArtist) queryParams.artist = mainArtist; else if (torrentGroup.group.releaseType != 7)
							return Promise.reject('Cover lookup by artist/album not available');
						queryParams.release_title = bareReleaseTitle(torrentGroup.group.name);
						if ([6, 7].includes(torrentGroup.group.releaseType)) queryParams.format = 'Compilation';
						queryParams.strict = true; //!artistName
						return search('release', queryParams, true);
					},
				];

				if (qualityAccent) {
					const discogsSearch = () => (function searchMethod(index = 0) {
						return index < dcLookupWorkers.length ? dcLookupWorkers[index]().then(function(results) {
							namedFn(discogsSearch, dcLookupWorkers[index].name);
							return results;
						}, reason => searchMethod(index + 1)) : Promise.reject('No matches');
					})();
					lookupWorkers.push(discogsSearch);
				} else Array.prototype.push.apply(lookupWorkers, dcLookupWorkers);
			} { // #################################### Ext. lookup at MusicBrainz ####################################
				function apiRequest(endPoint, params) {
					if (!endPoint) throw 'Endpoint is missing';
					const url = new URL('/ws/2/' + endPoint.replace(/^\/+|\/+$/g, ''), 'https://musicbrainz.org');
					if (params) for (let key in params) url.searchParams.set(key, params[key]);
					url.searchParams.set('fmt', 'json');
					const cacheKey = url.pathname.slice(6) + url.search;
					if (mbRequestsCache.has(cacheKey)) return mbRequestsCache.get(cacheKey);
					const request = new Promise(function(resolve, reject) {
						let retryCounter = 0;
						const xhr = {
							method: 'GET', url: url, responseType: 'json', timeout: 60e3,
							headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
							onload: function(response) {
								mbLastRequest = Date.now();
								if (response.status >= 200 && response.status < 400) resolve(response.response); else {
									const error = XHR.defaultErrorHandler(response);
									if (XHR.recoverableErrors.has(response.status) && retryCounter++ < 60) {
										console.log('MusicBrainz API request retry #%d on HTTP error %d', retryCounter, response.status);
										setTimeout(request, 1000);
									} else reject(error);
								}
							},
							onerror: response => { mbLastRequest = Date.now(); reject(XHR.defaultErrorHandler(response)); },
							ontimeout: response => { mbLastRequest = Date.now(); reject(XHR.defaultTimeoutHandler(response)); },
						}, request = () => {
							if (mbLastRequest == Infinity) return setTimeout(request, 50);
							const availableAt = mbLastRequest + mbRequestRate, now = Date.now();
							if (now < availableAt) return setTimeout(request, availableAt - now); else mbLastRequest = Infinity;
							GM_xmlhttpRequest(xhr);
						};
						request();
					});
					mbRequestsCache.set(cacheKey, request);
					return request.catch(reason => (mbRequestsCache.delete(cacheKey), Promise.reject(reason)));
				}
				function getFrontCovers(type, id) {
					if (!type || !id) return Promise.reject('Invalid argument');
					const key = type + '/' + id;
					if (caRequestsCache.has(key)) return caRequestsCache.get(key);
					const request = GlobalXHR.get(`https://coverartarchive.org/${type}/${id}`, { responseType: 'json' }).then(function({json}) {
						if (json.images && json.images.length > 0) {
							let frontCovers = json.images.filter(image =>
								image.front || image.types && image.types.includes('Front'));
							//if (frontCovers.length <= 0) frontCovers = json.images;
							frontCovers = frontCovers.map(image => image.image).filter(Boolean);
							return frontCovers.length > 0 ? frontCovers : Promise.reject('This entity has no front cover');
						} else return Promise.reject('No artwork for this id');
					});
					caRequestsCache.set(key, request);
					return request;
				}
				function search(type, queryParams, strictReleaseMatch = false) {
					if (!type || !queryParams) throw 'Invalid argument';
					queryParams = Object.keys(queryParams).map(field => `${field}:"${queryParams[field]}"`).join(' AND ');
					return apiRequest((type = type.toLowerCase()) + '/', { query: queryParams }).then(function(response) {
						function getFromRG(releaseGroupIds) {
							if (!releaseGroupIds || releaseGroupIds.size <= 0) return Promise.reject('No matches');
							if (releaseGroupIds.size > 1) return Promise.reject('Ambiguous results');
							return (releaseGroupIds = releaseGroupIds.values().next().value) ?
								getFrontCovers('release-group', releaseGroupIds) : Promise.reject('No release group');
						}
						function rgFilter(releaseGroup) {
							if ((function rgFilter(releaseGroup) {
								if (!releaseGroup) return false;
								const isPrimaryType = primaryType => releaseGroup['primary-type'] == primaryType;
								const hasSecondaryType = secondaryType => 'secondary-types' in releaseGroup
									&& releaseGroup['secondary-types'].includes(secondaryType);
								//if (['Audiobook', 'Spokenword', 'Audio drama'].some(hasSecondaryType) return false;
								const releaseType = {
									1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation', 9: 'Single',
									11: 'Live album', 13: 'Remix', 14: 'Bootleg', 15: 'Interview', 16: 'Mixtape', 17: 'Demo',
									18: 'Concert Recording', 19: 'DJ Mix', 21: 'Unknown',
								}[torrentGroup.group.releaseType];
								console.assert(releaseType != undefined);
								switch (releaseType) {
									case 'Album': return ['Album', 'EP'].some(isPrimaryType)/* && !hasSecondaryType('Compilation')*/;
									case 'Single': return ['Single', 'EP'].some(isPrimaryType);
									case 'EP': return ['EP', 'Single'].some(isPrimaryType);
									case 'Live album': case 'Concert Recording': return !isPrimaryType('Single') && hasSecondaryType('Live');
									case 'Soundtrack': return /*!isPrimaryType('Single') && */hasSecondaryType('Soundtrack');
									case 'Anthology': case 'Compilation': return !isPrimaryType('Single') && hasSecondaryType('Compilation');
									case 'Remix': return /*!isPrimaryType('Single') && */hasSecondaryType('Remix');
									case 'DJ Mix': return /*!isPrimaryType('Single') && */hasSecondaryType('DJ-mix');
									case 'Demo': return /*!isPrimaryType('Single') && */hasSecondaryType('Demo');
									case 'Mixtape': return /*!isPrimaryType('Single') && */hasSecondaryType('Mixtape/Street');
									case 'Interview': return /*!isPrimaryType('Single') && */hasSecondaryType('Interview');
									case 'Bootleg': //return !isPrimaryType('Single')/* && hasSecondaryType('Bootleg')*/;
								}
								return Boolean(releaseType);
							})(releaseGroup)) return true;
							console.log('[Cover Inspector] rgFilter(%o) returns false: releaseType=%d',
								releaseGroup, torrentGroup.group.releaseType,
								document.location.origin + '/torrents.php?id=' + torrentGroup.group.id,
								'https://musicbrainz.org/release-group/' + releaseGroup.id);
							return false;
						}

						if (response.count > 0) switch (type) {
							case 'release': {
								let releases = response.releases, releaseGroupIds;
								if (!releases) return Promise.reject('No matches (renounced)');
								const getReleaseGroupIds = releases =>
									(releaseGroupIds = new Set(releases.map(release => release['release-group'].id)));
								if ((strictReleaseMatch || getReleaseGroupIds(releases).size > 1)
										&& getReleaseGroupIds(releases = releases.filter(function releaseFilter(release) {
									if ((function releaseFilter(release) {
										if (strictReleaseMatch && 'release-group' in release && !rgFilter(release['release-group'])) return false;
										let releaseYear = new Date(release.date);
										releaseYear = isNaN(releaseYear) ? undefined : releaseYear.getUTCFullYear();
										return torrentGroup.torrents.some(function(torrent) {
											if (torrent.remasterYear > 0 && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
											const torrentIds = ['remasterRecordLabel', 'remasterCatalogueNumber']
												.map((prop, index) => torrent[prop].split(/[\/\|]+/).map(strippers[index]).filter(Boolean));
											if ('label-info' in release && release['label-info'].some(function(labelInfo) {
												labelInfo = [labelInfo.label && labelInfo.label.name, labelInfo['catalog-number']]
													.map((prop, index) => strippers[index](prop));
												return labelInfo[1] && labelInfo.every((id, index) => !id || torrentIds[index].includes(id));
											})) return true;
											const torrentTracks = audioFileCount(torrent);
											if (torrentTracks > 0 && release['track-count'] > 0 && torrentTracks != release['track-count']) return false;
											return torrent.remasterYear > 0 && releaseYear > 0 || torrentTracks > 0 && release['track-count'] > 0;
										});
									})(release)) return true;
									console.log('[Cover Inspector] releaseFilter(%o) returns false: torrents=%o', release, torrentGroup.torrents,
										document.location.origin + '/torrents.php?id=' + torrentGroup.group.id, 'https://musicbrainz.org/release/' + release.id);
									return false;
								})).size > 1) return Promise.reject('Ambiguous results');
								return getFromRG(releaseGroupIds).catch(reason => releases.length > 0 ? Promise.all(releases.map(function(release) {
									const coverArtArchive = release['cover-art-archive'];
									if (coverArtArchive && coverArtArchive.count <= 0) return Promise.resolve(null);
									return getFrontCovers('release', release.id).then(singleResultGetter, reason => null);
								})).then(frontCovers => (frontCovers = frontCovers.filter(Boolean)).length > 0 ?
									frontCovers : Promise.reject('None of results has front cover')) : Promise.reject('No matches'));
							}
							case 'release-group': {
								let releaseGroups = response['release-groups'];
								if (!releaseGroups) return Promise.reject('No matches (renounced)');
								if (strictReleaseMatch) releaseGroups = releaseGroups.filter(rgFilter);
								return getFromRG(new Set(releaseGroups.map(releaseGroup => releaseGroup.id)));
							}
							default: return Promise.reject('Unsupported search type');
						} else return Promise.reject('No matches');
					});
				}

				const mbLookupWorkers = [
					namedFn(() => barcodes.then(barcodes => Promise.all(barcodes.map(barcode =>
						search('release', { barcode: barcode }).catch(reason => null))).then(imageUrls =>
							(imageUrls = imageUrls.filter(Boolean)).length > 0 ? Array.prototype.concat.apply([ ], imageUrls)
								: Promise.reject('No covers found by barcode'))), 'mbSearchByBarcode'),
					function mbSearchByDiscId() {
						if (typeof unsafeWindow != 'object' || !['lookupByToc', 'tocEntriesToMbTOC', 'mbComputeDiscID']
								.every(prop => typeof(unsafeWindow[prop]) == 'function'))
							return Promise.reject('CD TOC lookup endpoints not available');
						const torrents = torrentGroup.torrents.filter(torrent => torrent.media == 'CD'
							&& torrent.format == 'FLAC' && torrent.encoding == 'Lossless' && torrent.hasLog);
						if (torrents.length <= 0) return Promise.reject('Cover lookup by CD TOC not available');
						const safeRgId = release => release && 'release-group' in release ? release['release-group'].id : undefined;
						const isConsistent = (results, ndx, arr) => safeRgId(results[0]) == safeRgId(arr[0][0]);
						const mediaCD = media => !media.format || /\b(?:H[DQ])?CD\b/.test(media.format);
						return Promise.all(torrents.map(torrent => unsafeWindow.lookupByToc(torrent.id, function(tocEntries, volumeNdx, totalDiscs) {
							const mbTOC = unsafeWindow.tocEntriesToMbTOC(tocEntries);
							if (mbTOC.length != mbTOC[1] - mbTOC[0] + 4) return Promise.reject('Missing or invalid TOC');
							return apiRequest('discid/' + unsafeWindow.mbComputeDiscID(mbTOC), {
								'media-format': 'all',
								'inc': ['release-groups'].join('+'),
							}).then(result => result.id && Array.isArray(result.releases) && (result = result.releases.filter(release =>
									!release.media || release.media.filter(mediaCD).length == totalDiscs)).length > 0 ?
								result.every((release, ndx, arr) => safeRgId(release) == safeRgId(arr[0])) ?
									result : Promise.reject('Inconsistent results') : Promise.reject('No matches'));
						}).then(results => (results = results.filter(Boolean)).length > 0 && results.every(isConsistent) ?
								Array.prototype.concat.apply([ ], results) : null))).then(function(results) {
							if ((results = results.filter(Boolean)).length <= 0) return Promise.reject('No matches');
							if (!results.every(isConsistent)) return Promise.reject('Inconsistent results');
							results = Array.prototype.concat.apply([ ], results);
							return getFrontCovers('release-group', safeRgId(results[0])).catch(reason => (function doIndex(index = 0) {
								if (index < results.length) {
									const coverArtArchive = results[index]['cover-art-archive'];
									if (coverArtArchive && coverArtArchive.count <= 0) return doIndex(index + 1);
									return getFrontCovers('release', results[index].id).catch(reason => doIndex(index + 1));
								} else return Promise.reject('No covers found by CD TOC');
							})());
						});
					},
					function mbSearchByLabelCatno() {
						if (!Array.isArray(torrentGroup.torrents) || torrentGroup.torrents.length <= 0)
							return Promise.reject('Cover lookup by label/cat.no. not available');
						if (allLabelsCatNos == null) return Promise.reject('No torrents with label/cat.no.');
						return Promise.all(allLabelsCatNos.map(queryParams => search('release', queryParams, true).catch(reason => null)))
							.then(imageUrls => (imageUrls = imageUrls.filter(Boolean)).length > 0 ? Array.prototype.concat.apply([ ], imageUrls)
								: Promise.reject('No covers found by label/cat.no.'));
					},
					function mbSearchByArtistAlbum() {
						const queryParams = { };
						if (mainArtist) queryParams.artistname = mainArtist; else if (torrentGroup.group.releaseType != 7)
							return Promise.reject('Cover lookup by artist/album/year not available');
						queryParams.releasegroup = bareReleaseTitle(torrentGroup.group.name);
						queryParams.firstreleasedate = torrentGroup.group.year;
						return search('release-group', queryParams, true);
					},
				];
				if (qualityAccent) {
					const mbSearch = () => (function searchMethod(index = 0) {
						return index < mbLookupWorkers.length ? mbLookupWorkers[index]().then(function(results) {
							namedFn(mbSearch, mbLookupWorkers[index].name);
							return results;
						}, reason => searchMethod(index + 1)) : Promise.reject('No matches');
					})();
					lookupWorkers.push(mbSearch);
				} else Array.prototype.push.apply(lookupWorkers, mbLookupWorkers);
			} { // ####################################### Ext. lookup at iTunes #######################################
				function apiRequest(endpoint, queryParams, noAmbiguity = false) {
					if (!endpoint || !queryParams) throw 'Invalid argument';
					endpoint = new URL(endpoint.toLowerCase(), 'https://itunes.apple.com');
					if (queryParams) for (let key in queryParams) endpoint.searchParams.set(key, queryParams[key]);
					endpoint.searchParams.set('media', 'music');
					endpoint.searchParams.set('entity', 'album');
					return GlobalXHR.get(endpoint, { responseType: 'json', recoverableErrors: [403] }).then(function({json}) {
						if (!(json.resultCount > 0)) return Promsie.reject('No matches');
						let results = json.results;
						if (endpoint.pathname == '/search' && (results = results.filter(function(result) {
							let releaseYear = new Date(result.releaseDate);
							releaseYear = isNaN(releaseYear) ? undefined : releaseYear.getUTCFullYear();
							return torrentGroup.torrents.some(function(torrent) {
								if (torrent.remasterYear > 0 && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
								const torrentTracks = audioFileCount(torrent);
								if (torrentTracks > 0 && result.trackCount > 0 && torrentTracks != result.trackCount) return false;
								return torrent.remasterYear > 0 && releaseYear > 0 && torrentTracks > 0 && result.trackCount > 0;
							});
						})).length <= 0) return Promise.reject('No matches'); else if (results.length > 1) {
							if (noAmbiguity) return Promise.reject('Ambiguous results');
							console.info('[Cover Inspector] Ambiguous iTunes results for lookup query (endpoint=%s, queryParams=%o)',
								endpoint.pathname, queryParams);
						}
						let artworkUrls = results.map(function(result) {
							const imageUrl = result.artworkUrl100 || result.artworkUrl60;
							return imageUrl && imageUrl.replace(/\/(\d+)x(\d+)/, '/4000x4000');
						});
						return (artworkUrls = artworkUrls.filter(Boolean)).length > 0 ? artworkUrls : Promsie.reject('No matches');
					});
				}

				lookupWorkers.push(namedFn(() => barcodes.then(upcs => Promise.all(upcs.map(upc =>
						apiRequest('lookup', { upc: upc }).catch(reason => null))).then(artworkUrls =>
							(artworkUrls = artworkUrls.filter(Boolean)).length > 0 ? Array.prototype.concat.apply([ ], artworkUrls)
						: Promise.reject('No covers found by UPC'))), 'itunesSearchByUPC'));
				lookupWorkers.push(function itunesSearchByArtistAlbum() {
					function addImportance(importance, maxArtists = 3) {
						if (importance && Array.isArray(torrentGroup.group.musicInfo[importance])
								&& torrentGroup.group.musicInfo[importance].length > 0)
							Array.prototype.push.apply(artistNames,
								torrentGroup.group.musicInfo[importance].slice(0, maxArtists).map(artist => artist.name));
					}

					let artistNames = [ ], albumTitle = bareReleaseTitle(torrentGroup.group.name);
					addImportance('dj');
					if (artistNames.length <= 0 && torrentGroup.group.releaseType != 7) {
						addImportance('artists');
						if (torrentGroup.group.tags && torrentGroup.group.tags.includes('classical')) {
							addImportance('conductor');
							//addImportance('composers');
						}
					}
					if (artistNames.length <= 0) return Promise.reject('Cover lookup by artist/title not available');
					return apiRequest('search', {
						term: namesToSearchTerm(artistNames.concat(albumTitle)),
						attribute: 'mixTerm',
						limit: 15,
					}, artistNames.join(' & ').toLowerCase() == albumTitle.toLowerCase()
						|| artistNames.join('').length + albumTitle.length < 15);
				});
			} { // ###################################### Ext. lookup at Spotify ######################################
				const spfAuth = (function() {
					const [clientId, clientSecret] = ['spotify_client_id', 'spotify_client_secret'].map(name => GM_getValue(name));
					return clientId && clientSecret ? btoa(clientId + ':' + clientSecret) : undefined;
				})();
				function requestEndpoint(server, endpoint, auth, params) {
					if (!server || !endpoint || !auth) throw 'Invalid argument';
					const url = new URL(endpoint, `https://${server}.spotify.com`), isPost = server.toLowerCase() != 'api';
					if (params) if (isPost) var payload = new URLSearchParams(params);
						else for (let param in params) url.searchParams.set(param, params[param]);
					params = { responseType: 'json', headers: { 'Authorization': auth } };
					return (isPost ? GlobalXHR.post(url, payload, params) : GlobalXHR.get(url, params)).then(({json}) => json);
				}
				const search = queryParams => queryParams && typeof queryParams == 'object' ? (function getAuthToken() {
					const isTokenValid = accessToken => typeof accessToken == 'object' && accessToken.token_type
						&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
					if ('spotifyAccessToken' in localStorage) try {
						const accessToken = JSON.parse(localStorage.getItem('spotifyAccessToken'));
						if (!isTokenValid(accessToken)) throw 'Throwing expired or otherwise invalid Spotify cached token';
						// console.info('[Cover Inspector] Re-using cached Spotify access token:', accessToken,
						// 	'expires at', new Date(accessToken.expires_at).toTimeString(),
						// 	'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
						return Promise.resolve(accessToken);
					} catch(e) {
						console.info('[Cover Inspector]', e);
						localStorage.removeItem('spotifyAccessToken');
					}
					if (spfAccessToken instanceof Promise) return spfAccessToken.then(accessToken => isTokenValid(accessToken) ?
							Promise.resolve(accessToken) : Promise.reject('auth session failed')).catch(function(reason) {
						spfAccessToken = null;
						console.info('[Cover Inspector] Discarding Spotify access token:', reason);
						return getAuthToken();
					});
					const timeStamp = Date.now();
					return (spfAccessToken = spfAuth ? requestEndpoint('accounts', 'api/token', 'Basic ' + spfAuth,
							{ 'grant_type': 'client_credentials' }).then(function(accessToken) {
						if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
						if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
							(accessToken.expires_in_ms || accessToken.expires_in * 1000);
						if (isTokenValid(accessToken)) {
							try { localStorage.setItem('spotifyAccessToken', JSON.stringify(accessToken)) } catch(e) { console.warn(e) }
							spfAccessToken = null;
							console.log('[Cover Inspector] Spotify access token successfully set:',
								accessToken, `(+${(Date.now() - accessToken.timestamp) / 1000}s)`);
						} else {
							spfAccessToken = null;
							console.warn('Received invalid Spotify token:', accessToken);
							return Promise.reject('invalid token received');
						}
						return accessToken;
					}) : Promise.reject('Basic authorization not fully configured'));
				})().then(authToken => requestEndpoint('api', 'v1/search', authToken.token_type + ' ' + authToken.access_token, {
					q: Object.keys(queryParams).map(param => `${param}:"${queryParams[param]}"`).join(' '),
					type: 'album',
					limit: 50,
				}).then(function(results) {
					if (results.albums.total > 0) results = results.albums.items; else return Promise.reject('No matches');
					//console.debug('[Cover Inspector] Spotify search results for %o:', queryParams, results);
					if (!Object.keys(queryParams).includes('upc')) results = results.filter(function(result) {
						if (result.album_type == 'single' ? ![9, 5].includes(torrentGroup.group.releaseType)
								: torrentGroup.group.releaseType == 9) return false;
						if ((result.album_type == 'compilation') != [6, 7].includes(torrentGroup.group.releaseType)) return false;
						let releaseYear = new Date(result.release_date);
						releaseYear = isNaN(releaseYear) ? undefined : releaseYear.getUTCFullYear();
						return torrentGroup.torrents.some(function(torrent) {
							if (torrent.remasterYear > 0 && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
							const torrentFiles = audioFileCount(torrent);
							if (torrentFiles > 0 && result.total_tracks > 0 && torrentFiles != result.total_tracks) return false;
							return torrentFiles > 0 && result.total_tracks > 0 || torrent.remasterYear > 0 && releaseYear > 0;
						});
					});
					if (results.length <= 0) return Promise.reject('No matches'); else if (results.length > 1) {
						//return reject('Ambiguous results');
						console.info('[Cover Inspector] Ambiguous Spotify results for lookup query (queryParams=%o)', queryParams);
					}
					return (results = results.map(function(result) {
						if (!result.images) return null;
						let highest = Math.max(...result.images.map(image => image.width * image.height));
						highest = result.images.find(image => image.width * image.height == highest);
						return highest && highest.url;
					}).filter(Boolean)).length > 0 ? results : Promise.reject('No covers');
				})) : Promise.reject('No query provided');

				lookupWorkers.push(namedFn(() => barcodes.then(upcs => Promise.all(upcs.map(upc => search({ upc: upc }) // 7
						.catch(reason => null))) .then(artworkUrls => (artworkUrls = artworkUrls.filter(Boolean)).length > 0 ?
							Array.prototype.concat.apply([ ], artworkUrls) : Promise.reject('No covers found by UPC'))), 'spfSearchByUPC'));
				lookupWorkers.push(function spfSearchByArtistAlbum() {
					const queryParams = { };
					if (mainArtist) queryParams.artist = mainArtist; else if (torrentGroup.group.releaseType != 7)
						return Promise.reject('Cover lookup by artist/album not available');
					queryParams.album = bareReleaseTitle(torrentGroup.group.name);
					return search(queryParams);
				});
			} { // ###################################### Ext. lookup at Bandcamp ######################################
				function search(searchTerm, itemType = 'a') {
					if (!searchTerm) throw 'Invalid argument';
					const url = new URL('https://bandcamp.com/search');
					url.searchParams.set('q', searchTerm);
					url.searchParams.set('item_type', itemType = itemType.toLowerCase());
					return GlobalXHR.get(url).then(function({document}) {
						let results = document.body.querySelectorAll('div.results > ul.result-items > li.searchresult');
						if (results.length <= 0 || (results = Array.prototype.filter.call(results, function(result) {
							let [title, artist, releaseYear, releaseTracks] = ['heading', 'subhead', 'released', 'length']
								.map(className => result.querySelector('div.' + className));
							if (title != null) title = title.textContent.trim(); else return false;
							//if (bareReleaseTitle(title).toLowerCase() != torrentGroup.group.name.toLowerCase()) return false;
							if (artist != null) artist = /^by (.+)$/i.exec(artist.textContent.trim());
							if (artist != null) artist = artist[1]; else return false;
							if (releaseYear != null) releaseYear = /\b(\d{4})\b/.exec(releaseYear.textContent);
							releaseYear = releaseYear != null ? parseInt(releaseYear[1]) : undefined;
							if (itemType == 't') releaseTracks = 1; else if (itemType == 'a') {
								if (releaseTracks != null) releaseTracks = /\b(\d+)\s+tracks?\b/i.exec(releaseTracks.textContent);
								releaseTracks = releaseTracks != null ? parseInt(releaseTracks[1]) : undefined;
							}
							return torrentGroup.torrents.some(function(torrent) {
								if (torrent.remasterYear > 0 && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
								const torrentTracks = audioFileCount(torrent);
								if (torrentTracks > 0 && releaseTracks > 0 && torrentTracks != releaseTracks) return false;
								return torrent.remasterYear > 0 && releaseYear > 0 && torrentTracks > 0 && releaseTracks > 0;
							});
						})).length <= 0) return Promise.reject('No matches'); else if (results.size > 1) {
							console.info('[Cover Inspector] Ambiguous Bandcamp results for lookup query', searchTerm);
							//return reject('Ambiguous results');
						}
						//console.debug('[Cover Inspector] Bandcamp search results for %o:', searchTerm, results);
						return Promise.all(results.map(function(result) {
							const image = result.querySelector('a.artcont img');
							return image != null && getImageMax(image.src).catch(reason => image);
						})).then(results => (results = results.filter(Boolean)).length > 0 ? results : Promise.reject('No matches'));
					});
				}

				lookupWorkers.push(function bcSearchByArtistAlbum() {
					let searchTerm = [mainArtist, bareReleaseTitle(torrentGroup.group.name)];
					if (!searchTerm[0]) return Promise.reject('Cover lookup by artist/album not available');
					return search((searchTerm = namesToSearchTerm(searchTerm)), 'a').catch(reason =>
						reason == 'No matches' && torrentGroup.torrents.map(audioFileCount).some(afc => afc == 1) ?
							search(searchTerm, 't') : Promise.reject(reason));
				});
			} { // ###################################### Ext. lookup at Beatport ######################################
				function queryAPI(endPoint, params) {
					if (!endPoint) throw 'invalid argument';
					return (function setAccessToken() {
						const isTokenValid = accessToken => accessToken && accessToken.token_type
							&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
						return bpAccessToken instanceof Promise ? bpAccessToken.then(accessToken =>
								isTokenValid(accessToken) ? accessToken : Promise.reject('expired or otherwise invalid')).catch(function(reason) {
							bpAccessToken = null;
							console.info('Discarding Beatsource access token:', reason);
							return setAccessToken();
						}) : (bpAccessToken = (function() {
							function haveToken({token}) {
								if (!(token = {
									token_type: token.tokenType,
									access_token: token.accessToken,
									timestamp: timeStamp,
									expires_in: token.expiresIn,
									expires_at: token.accessTokenExpires,
								}).expires_at) token.expires_at = token.timestamp + (token.expires_in_ms || token.expires_in * 1000);
								if (!isTokenValid(token)) {
									console.warn('Received invalid Beatport token:', token);
									return Promise.reject('invalid token received');
								}
								try { localStorage.setItem('beatportAccessToken', JSON.stringify(token)) } catch(e) { console.warn(e) }
								console.log('Beatport access token successfully set:', token, `(+${(Date.now() - token.timestamp) / 1000}s)`);
								return Promise.resolve(token);
							}

							if ('beatportAccessToken' in localStorage) try {
								const accessToken = JSON.parse(localStorage.getItem('beatportAccessToken'));
								if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
								console.info('Re-using cached Beatport access token:', accessToken,
									'expires at', new Date(accessToken.expires_at).toTimeString(),
									'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
								return Promise.resolve(accessToken);
							} catch(e) { localStorage.removeItem('beatportAccessToken') }
							const timeStamp = Date.now(), urlBase = 'https://www.beatport.com/api/auth';
							return GlobalXHR.get(urlBase + '/session', { responseType: 'json' }).then(function(response) {
								let cookie = response.cookies['__Secure-next-auth.session-token'];
								if (cookie) return haveToken(response.json);
								const postData = new URLSearchparams;
								if (cookie = response.cookies['__Host-next-auth.csrf-token']) postData.set('csrfToken', cookie.value.split('|')[0]);
								else return Promise.reject('Cookie not received');
								if (cookie = response.cookies['__Secure-next-auth.callback-url']) postData.set('callbackUrl', cookie.value);
								else return Promise.reject('Cookie not received');
								postData.set('json', true);
								return GlobalXHR.post(urlBase + '/callback/anonymous', postData, { responseType: null }).then(function(response) {
									if (!(cookie = response.cookies['__Secure-next-auth.session-token']))
										return Promise.reject('Cookie not received');
									return GlobalXHR.get(urlBase + '/session', {
										responseType: 'json',
										cookie: '__Secure-next-auth.session-token=' + cookie,
									}).then(({json}) => haveToken(json));
								});
							}).catch(function(reason) {
								if ('beatsourceAccessToken' in localStorage) try {
									const accessToken = JSON.parse(localStorage.getItem('beatsourceAccessToken'));
									if (!isTokenValid(accessToken)) throw 'Throwing expired or otherwise invalid Beatsource cached token';
									// console.info('[Cover Inspector] Re-using cached Beatsource access token:', accessToken,
									// 	'expires at', new Date(accessToken.expires_at).toTimeString(),
									// 	'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
									return Promise.resolve(accessToken);
								} catch(e) { localStorage.removeItem('beatsourceAccessToken') }
								if (bpAccessToken instanceof Promise) return bpAccessToken.then(accessToken => isTokenValid(accessToken) ?
										Promise.resolve(accessToken) : Promise.reject('auth session failed')).catch(function(reason) {
									bpAccessToken = null;
									console.info('[Cover Inspector] Discarding Beatsource access token:', reason);
									return getAuthToken();
								});
								const timeStamp = Date.now();
								return GlobalXHR.get('https://www.beatsource.com/').then(function({document}) {
									let accessToken = document.getElementById('__NEXT_DATA__');
									if (accessToken != null) try {
										accessToken = JSON.parse(accessToken.text);
										return Object.assign(accessToken.props.rootStore.authStore.user, {
											apiHost: accessToken.runtimeConfig.API_HOST,
											clientId: accessToken.runtimeConfig.API_CLIENT_ID,
											recurlyPublicKey: accessToken.runtimeConfig.RECURLY_PUBLIC_KEY,
										});
									} catch(e) { console.warn(e) }
									if (accessToken = response.headers.btsrcSession) try {
										const decode = val => decodeURIComponent(val.replace(/[\s\;].*$/, ''));
										accessToken = JSON.parse(decode(accessToken));
										let sessionId = response.responseHeaders.sessionId;
										if (sessionId) accessToken.sessionId = decode(sessionId);
										return accessToken;
									} catch(e) { console.warn(e) }
									return Promise.reject('Beatsource OAuth2 access token could not be extracted');
								}).then(function(accessToken) {
									if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
									if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
										(accessToken.expires_in_ms || accessToken.expires_in * 1000);
									if (isTokenValid(accessToken)) try {
										localStorage.setItem('beatsourceAccessToken', JSON.stringify(accessToken));
										bpAccessToken = null;
										console.log('[Cover Inspector] Beatsource access token successfully set:',
											accessToken, `(+${(Date.now() - accessToken.timestamp) / 1000}s)`);
									} catch(e) { console.warn(e) } else {
										bpAccessToken = null;
										console.warn('[Cover Inspector] Received invalid Beatsource token:', accessToken);
										return Promise.reject('invalid token received');
									}
									return accessToken;
								});
							});
						})());
					})().then(function(authToken) {
						const catRoot = '/v4/catalog/';
						const url = new URL(`${catRoot}${endPoint.replace(/^\/+|\/+$/g, '')}/`, 'https://api.beatport.com');
						if (params) for (let key in params) url.searchParams.set(key, params[key]);
						const cacheKey = url.pathname.slice(url.pathname.indexOf(catRoot) + catRoot.length) + url.search;
						if (bpRequestsCache.has(cacheKey)) return bpRequestsCache.get(cacheKey);
						const request = GlobalXHR.get(url, {
							responseType: 'json',
							headers: { 'Authorization': authToken.token_type + ' ' + authToken.access_token },
						}).then(({json}) => json);
						bpRequestsCache.set(cacheKey, request);
						return request;
					});
				}

				const search = (searchTerm, strict = true) => searchTerm ? queryAPI('search', {
					q: searchTerm,
					type: 'releases',
					per_page: strict ? 50 : 1,
				}).then(function(results) {
					if (results.count <= 0 || (results = results.releases.filter(function(release) {
						if ('release_type' in release && (parseInt(release.release_type) == 1 ?
								![9, 5].includes(torrentGroup.group.releaseType) : torrentGroup.group.releaseType == 9)) return false;
						let releaseYear = new Date(release.release_date || release.new_release_date || release.publish_date);
						if (isNaN(releaseYear)) return false; else releaseYear = releaseYear.getUTCFullYear();
						return torrentGroup.torrents.some(function(torrent) {
							if (torrent.remasterYear > 0 && torrent.remasterYear != releaseYear) return false;
							const torrentFiles = audioFileCount(torrent);
							if (torrentFiles > 0 && release.track_count > 0 && torrentFiles != release.track_count) return false;
							if (!strict) return torrent.remasterYear > 0 && releaseYear > 0
								&& torrentFiles > 0 && release.track_count > 0;
							if (!(torrent.remasterYear > 0 && releaseYear > 0 || torrentFiles > 0 && release.track_count > 0))
								return false;
							const torrentIds = ['remasterRecordLabel', 'remasterCatalogueNumber']
								.map((prop, index) => torrent[prop].split(/[\/\|]+/).map(strippers[index]).filter(Boolean));
							const releaseIds = [release.label && release.label.name, release.catalog_number]
								.map((prop, index) => strippers[index](prop));
							return releaseIds[1] && releaseIds.every((id, index) => !id || torrentIds[index].includes(id));
						});
					})).length <= 0) return Promise.reject('No matches'); else if (results.length > 1) {
						//return reject('Ambiguous results');
						console.info('[Cover Inspector] Ambiguous Beatport results for lookup query (searchTerm=%s)', searchTerm);
					}
					//console.debug('[Cover Inspector] Beatport search results for %s:', searchTerm, results);
					return (results = results.filter(release => release.image && release.image.uri && ![
						'0dc61986-bccf-49d4-8fad-6b147ea8f327', 'ab2d1d04-233d-4b08-8234-9782b34dcab8',
					].some(imgId => release.image.uri.toLowerCase().endsWith(`/${imgId.toLowerCase()}.jpg`)))).length > 0 ?
						results.map(release => release.image.uri.replace(/\/image_size\/\d+x\d+\//i, '/image/'))
							: Promise.reject('No covers in matching releases found');
				}) : Promise.reject('Search term is missing');
				if ([
					'acid', 'acid.house', 'bass', 'beats', 'breakbeat', 'breakcore', 'breaks', 'chillout', 'chillwave',
					'chiptune', 'dance', 'dark.psytrance', 'deep.house', 'deep.tech', 'downtempo', 'drum.and.bass', 'dub',
					'dub.techno', 'dubstep', 'ebm', 'electro', 'electro.house', 'electronic', 'garage.house', 'glitch',
					'goa.trance', 'grime', 'hard.techno', 'hard.trance', 'hardcore.dance', 'house', 'idm', 'jungle',
					'leftfield', 'minimal.house', 'minimal.techno', 'nu.disco', 'progressive.house', 'progressive.trance',
					'psybient', 'psytrance', 'synth', 'tech.house', 'techno', 'trance', 'trap', 'tribal', 'trip.hop',
					'uk.garage', 'uplifting.trance', 'vaporwave',
				].some(tag => torrentGroup.group.tags.includes(tag))) {
					lookupWorkers.push(namedFn(() => barcodes.then(upcs => Promise.all(upcs.map(upc => search(upc, false)
						.catch(reason => null))).then(artworkUrls => (artworkUrls = artworkUrls.filter(Boolean)).length > 0 ?
							Array.prototype.concat.apply([ ], artworkUrls) : Promise.reject('No covers found by UPC'))), 'bpSearchByUPC'));
					const keywords = [mainArtist, bareReleaseTitle(torrentGroup.group.name)];
					lookupWorkers.push(namedFn(() => search(namesToSearchTerm(keywords), true), 'bpSearchByArtistAlbumStrict'));
					if (keywords[0] && torrentGroup.group.releaseType != 7)
						lookupWorkers.push(namedFn(() => search(namesToSearchTerm(keywords), false), 'bpSearchByArtistAlbum'));
				}
			} { // ###################################### Ext. lookup at CSE ######################################
				// if (mainArtist && torrentGroup.group.releaseType != 7) lookupWorkers.push(namedFn(() =>
				// 	Promise.all(['us', 'jp'].map(country => cseSearch(bareReleaseTitle(torrentGroup.group.name), mainArtist, country))
				// 		.map(promise => promise.catch(reason => null))).then(function(results) {
				// 	if ((results = Array.prototype.concat.apply([ ], results.filter(Boolean)).filter((result, ndx, arr) =>
				// 			result.bigCoverUrl && arr.findIndex(result2 => result2.bigCoverUrl == result.bigCoverUrl) == ndx)).length <= 0)
				// 		return Promise.reject('No matches');
				// 	// TODO: verify & return best match
				// }), 'cseSearchByArtistAlbum'));
			}
			break;
		}
		case 3: { // Ebooks
			qualityAccent = false;
			workersOrder = ['grSearchById', 'grSearchByTitle1', 'grSearchByTitle2'];
			{ // ###################################### Ext. lookup at Goodreads ######################################
				function search(queryParams, noAmbiguity = true) {
					if (!queryParams) throw 'Invalid argument';
					const requestUrl = new URL('https://www.goodreads.com/search');
					if (queryParams) for (let key in queryParams) requestUrl.searchParams.set(key, queryParams[key]);
					requestUrl.searchParams.set('search_type', 'books');
					return GlobalXHR.get(requestUrl).then(function({document}) {
						const grImageMax = src => src && src.replace(/\._(?:\w+\d+_)+\./ig, '.');
						const dummyCover = coverUrl => coverUrl && ['/nophoto/', '/books/1570622405l/50809027', '/images/no-cover.png']
							.some(pattern => coverUrl.includes(pattern));
						let results = ['div.BookCover__image img', 'div.editionCover > img', 'img#coverImage']
							.reduce((elem, selector) => elem || document.body.querySelector(selector), null);
						if (results != null && httpParser.test(results = results.src)) {
							if (!dummyCover(results)) return [grImageMax(results)];
						} else if ((results = document.querySelectorAll('table.tableList > tbody > tr')).length > 0) {
							if (results.length > 1) {
								if (noAmbiguity) return reject('Ambiguous results');
								console.warn('[Cover Inspector] Goodreads ambiguous results');
							}
							if ((results = Array.prototype.map.call(results, function(result) {
								let coverUrl = result.querySelector('img[itemprop="image"]');
								if (coverUrl != null && httpParser.test(coverUrl = coverUrl.src) && !dummyCover(coverUrl))
									return grImageMax(coverUrl);
							}).filter(Boolean)).length > 0) return results;
						} else return Promise.reject('No matches');
						return Promise.reject('No valid cover image for matched ebooks');
					});
				}
				function findByIdentifier(rx, minLength) {
					if (!(rx instanceof RegExp) || !(minLength >= 0)) throw 'Invalid argument';
					let id = rx.exec(descBody.textContent);
					if (id != null && (id = id[2].replace(/\W/g, '')).length >= minLength)
						lookupWorkers.push(namedFn(() => search({ q: id }), 'grSearchById'));
				}

				const descBody = domParser.parseFromString(torrentGroup.group.wikiBody, 'text/html').body;
				findByIdentifier(/\b(ISBN-?13)\b.+?\b(\d+(?:\-\d+)*)\b/m, 12);
				findByIdentifier(/\b(ISBN(?:-?10)?)\b.+?\b(\d+(?:\-\d+)*)\b/m, 9);
				findByIdentifier(/\b(EAN(?:-?13)?)\b.+?\b(\d+(?:\-\d+)*)\b/m, 12);
				findByIdentifier(/\b(UPC(?:-A)?)\b.+?\b(\d+(?:\-\d+)*)\b/m, 11);
				findByIdentifier(/\b(ASIN)\b.+?\b([A-Z\d]{10})\b/m, 11);
				const rx = [
					/(?:\s+(?:\((?:19|2\d)\d{2}\)|\[(?:19|2\d)\d{2}\]|\((?:epub|mobi|pdf)\)|\[(?:epub|mobi|pdf)\]))+$/ig,
					/(?:\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]))+$/ig,
				], titles = [torrentGroup.group.name.replace(rx[0], '')];
				lookupWorkers.push(namedFn(() => search({ q: titles[0] }), 'grSearchByTitle1'));
				titles.push(titles[0].replace(rx[1], ''));
				if (titles[1].length < titles[0].length)
					lookupWorkers.push(namedFn(() => search({ q: titles[1] }), 'grSearchByTitle2'));
			}
			break;
		}
	}
	if ((lookupWorkers = lookupWorkers.filter(worker => typeof worker == 'function')).length <= 0)
		return Promise.reject('No available lookup methods for this release group');
	if (qualityAccent) {
		const results = lookupWorkers.map(lookupWorker => lookupWorker().then(results =>
			(results = results.filter(Boolean)).length > 0 ? results : Promise.reject('No valid images found')));
		return Promise.all(results.map(result => result.then(imageUrls =>
				testImageQuality(imageUrls[0])).catch(reason => -1))).then(function(qRanks) {
			const maxRank = Math.max(...qRanks);
			// console.debug('[Cover Inspector] Quality ranking for group id %d lookup workers:', torrentGroup.group.id,
			// 	maxRank, Object.assign.apply({ }, qRanks.map((qRank, index) => ({ [lookupWorkers[index].name]: qRank }))));
			if (maxRank < 0) return Promise.reject('None of release identifiers was sufficient to find the cover');
			let index = Math.min(...qRanks.map((qR, ndx) => qR < maxRank
				|| (ndx = workersOrder.indexOf(lookupWorkers[ndx].name)) < 0 ? Infinity : ndx));
			index = lookupWorkers.findIndex(lookupWorker => lookupWorker.name == workersOrder[index]);
			console.assert(index >= 0, index);
			if (index < 0 && (index = qRanks.indexOf(maxRank)) < 0)
				return Promise.reject('Assertion failed: lookup worker index doesnot exist');
			console.log('[Cover Inspector] Group id', torrentGroup.group.id, torrentGroup,
				'covers lookup successfull, method name:', lookupWorkers[index].name, '[' + index + ']');
			return results[index];
		});
	} else {
		lookupWorkers.sort((a, b) => workersOrder.indexOf(a.name) - workersOrder.indexOf(b.name));
		return (function lookupMethod(index = 0) {
			if (index < lookupWorkers.length) return lookupWorkers[index]().then(results =>
					Promise.all(results.map(result => ihh.verifyImageUrl(result).catch(reason => null)))).then(function(results) {
				if ((results = results.filter(Boolean)).length <= 0) return Promise.reject('No valid images found');
				console.log('[Cover Inspector] Group id', torrentGroup.group.id, torrentGroup,
					'covers lookup successfull, method name:', lookupWorkers[index].name, '[' + index + '/' +
					lookupWorkers.length + '], results:', results);
				return results;
			}).catch(reason => lookupMethod(index + 1));
			return Promise.reject('None of release identifiers was sufficient to find the cover');
		})();
	}
}

function updateCoverCollages(status, torrentGroup) {
	(typeof torrentGroup == 'object' ? Promise.resolve(torrentGroup)
			: queryAjaxAPI('torrentgroup', { id: torrentGroup || id })).then(function(torrentGroup) {
		if ((status >> 7 & 0b11) == 0b11) for (let collageIndex of ['missing', 'invalid', 'investigate'])
			if (inCoversCollage(collageIndex, torrentGroup)) removeFromCoversCollage(collageIndex, torrentGroup);
		if ((status & 0b100) == 0 || (status & 0b10) == 0 && [1].includes(torrentGroup.group.categoryId)) {
			if (!inCoversCollage('poor', torrentGroup)) addToCoversCollage('poor', torrentGroup.group.id);
		} else if (inCoversCollage('poor', torrentGroup)) removeFromCoversCollage('poor', torrentGroup);
	});
}

function updateImage(imageUrl, torrentGroup, img) {
	if (!imageUrl || !torrentGroup) throw 'Invalid argument';
	for (let collageIndex of ['missing', 'invalid', 'investigate'])
		if (inCoversCollage(collageIndex, torrentGroup)) removeFromCoversCollage(collageIndex, torrentGroup);
	if (img instanceof HTMLImageElement) {
		setNewSrc(img, imageUrl);
		inspectImage(img, torrentGroup.group.id).then(function(status) {
			if ((status & 0b100) != 0 && ((status & 0b10) != 0 || ![1].includes(torrentGroup.group.categoryId))) {
				if (inCoversCollage('poor', torrentGroup)) removeFromCoversCollage('poor', torrentGroup);
			} else if ([1].includes(torrentGroup.group.categoryId))
				if (!inCoversCollage('poor', torrentGroup)) addToCoversCollage('poor', torrentGroup.group.id);
		}, reason => { console.warn('[Cover Inspector] inspectImage(', img, ') failed with reason', reason) });
	} else testImageQuality(imageUrl).then(function(q) {
		if (q >= ([1].includes(torrentGroup.group.categoryId) ? 2 : 1)) {
			if (inCoversCollage('poor', torrentGroup)) removeFromCoversCollage('poor', torrentGroup);
		} else if ([1].includes(torrentGroup.group.categoryId))
			if (!inCoversCollage('poor', torrentGroup)) addToCoversCollage('poor', torrentGroup.group.id);
	});
}

function findCover(groupId, img) {
	if (!(groupId > 0)) throw 'Invalid argument';
	return imageHostHelper.then(ihh => queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup =>
			coverLookup(torrentGroup, ihh).then(imageUrls =>
				ihh.rehostImageLinks([imageUrls[0]]).then(ihh.singleImageGetter).then(imageUrl =>
					setGroupImage(torrentGroup.group.id, imageUrl).then(function(response) {
		console.log('[Cover Inspector]', response);
		if (!(img instanceof HTMLImageElement)) img = document.body.querySelector('div#covers img');
		updateImage(imageUrl, torrentGroup, img);
	}))).catch(function(reason) {
		if (!torrentGroup.group.wikiImage && !inCoversCollage('missing', torrentGroup))
			addToCoversCollage('missing', torrentGroup.group.id);
		if (torrentGroup.group.wikiImage && !inCoversCollage('invalid', torrentGroup))
			ihh.verifyImageUrl(torrentGroup.group.wikiImage).catch(reason =>
				{ addToCoversCollage('invalid', torrentGroup.group.id) });
		return Promise.reject(reason);
	})));
}

function setFocus(elem) {
	if (!(elem instanceof HTMLElement)) throw 'Invalid argument';
	elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getGroupId(root) {
	if (root instanceof HTMLElement) for (let a of root.getElementsByTagName('A')) {
		if (a.origin != document.location.origin || a.pathname != '/torrents.php') continue;
		a = new URLSearchParams(a.search);
		if (a.has('id') && !a.has('action') && (a = parseInt(a.get('id'))) > 0) return a;
	}
	console.warn('[Cover Inspector] Failed to find group id:', root);
}

function addTableHandlers(table, parent, style, index) {
	function addHeaderButton(caption, clickHandler, id, tooltip) {
		if (!caption || typeof clickHandler != 'function') return;
		const elem = document.createElement('SPAN');
		if (id) elem.classList.add(id);
		elem.classList.add('brackets');
		elem.style = 'margin-right: 5pt; cursor: pointer; font-weight: normal; transition: color 0.25s;';
		elem.textContent = caption;
		elem.onmouseenter = elem.onmouseleave = function(evt) {
			if (evt.relatedTarget == evt.currentTarget) return false;
			evt.currentTarget.style.color = evt.type == 'mouseenter' ? 'orange' : evt.currentTarget.dataset.color || null;
		};
		elem.onclick = clickHandler;
		if (tooltip) elem.title = tooltip; //setTooltip(tooltip);
		container.append(elem);
		return elem;
	}
	function iterateReleaseGroups(callback) {
		for (const tr of table.querySelectorAll('tbody > tr.group, tbody > tr.torrent')) {
			const groupId = getGroupId(tr.querySelector('div.group_info'));
			console.assert(groupId > 0, 'Failed to extract group id:', tr)
			if (groupId > 0) callback(groupId, tr.querySelector('div.group_image > img'), function failhandler(reason) {
				if (this && this.logFail) this.logFail(`groupId ${groupId} cover lookup failed: ${reason}`);
				console.log('[Cover Inspector] groupId', groupId, 'cover lookup failed:', reason);
				return reason;
			});
		}
	}
	function getGroupCreationTime(elem) {
		if (!(elem instanceof HTMLElement) || !((elem = getGroupId(elem.querySelector('div.group_info'))) > 0)) return;
		if ((elem = document.body.querySelectorAll(`tr.group_torrent.groupid_${elem} *.time[title]`)).length <= 0) return;
		if ((elem = Array.from(elem, elem => new Date(elem.title)).filter(date => !isNaN(date))).length <= 0) return;
		return Math.min(...elem.map(date => date.getTime()));
	}
	function changeToCounter(elem, id) {
		if (!(elem instanceof HTMLElement) || !id) throw 'Invalid argument';
		if (!elem.count) {
			elem.remove();
			return null;
		}
		elem.onclick = elem.onmouseenter = elem.onmouseleave = null;
		elem.style.color = 'orange';
		elem.style.cursor = null;
		elem.textContent = ' groups remaining';
		elem.removeAttribute('title');
		const counter = document.createElement('SPAN');
		counter.className = id;
		counter.textContent = counter.count = elem.count;
		counter.style.fontWeight = 'bold';
		elem.prepend(counter);
		delete elem.count;
		return elem;
	}

	if (!(table instanceof HTMLElement) || !(parent instanceof HTMLElement)) return;
	const images = table.querySelectorAll('tbody > tr div.group_image > img');
	if (index) for (let img of images) img.dataset.tableIndex = index;
	const container = document.createElement('DIV');
	container.className = index ? 'cover-inspector-' + index : 'cover-inspector';
	if (style) container.style = style;
	if (images.length > 0) addHeaderButton('Inspect all covers', function inspectAll(evt) {
		if (!evt.currentTarget.disabled) evt.currentTarget.disabled = true; else return false;
		setFocus(parent.parentNode.parentNode);
		evt.currentTarget.style.color = evt.currentTarget.dataset.color = 'orange';
		evt.currentTarget.textContent = '…wait…';
		evt.currentTarget.style.cursor = null;
		const currentTarget = evt.currentTarget, inspectWorkers = [ ];
		let autoFix = parent.querySelector('span.auto-fix-covers');
		iterateReleaseGroups((groupId, img) => { if (img != null) inspectWorkers.push(inspectImage(img, groupId)) });
		if (autoFix != null && inspectWorkers.length > 0) autoFix.hidden = true;
		Promise.all(inspectWorkers).then(statuses => !noEditPerms && ajaxApiKey && !readOnly && !noBatchProcessing ? imageHostHelper.then(function(ihh) {
			const failedToLoad = statuses.filter(status => (status >> 7 & 0b11) == 0b10).length;
			if (autoFix != null || (autoFix = parent.querySelector('span.auto-fix-covers')) != null) if (failedToLoad > 0) {
				autoFix.hidden = false;
				autoFix.count = statuses.filter(status => (status >> 7 & 0b01) == 0).length;
				autoFix.title = autoFix.count.toString() + ' covers to lookup (missing covers included)';
			} else autoFix.remove();
			const minimumRehostAge = GM_getValue('minimum_age_for_rehost');
			const getClick2Gos = () => Array.prototype.filter.call(table.querySelectorAll('div.cover-inspector > span.click2go:not([disabled])'), function(elem) {
				if (elem.classList.contains('whitelisted')) return true;
				if (elem.classList.contains('unpreferred-host') && minimumRehostAge > 0) {
					while (elem != null && elem.nodeName != 'TR') elem = elem.parentNode;
					if (!((elem = getGroupCreationTime(elem)) > 0)) return false;
					return elem < Date.now() - minimumRehostAge * 24 * 60 * 60 * 1000;
				}
				return true;
			});
			if ((currentTarget.count = getClick2Gos().length) > 0) {
				currentTarget.id = 'process-all-covers';
				currentTarget.onclick = function processAll(evt) {
					if (evt.currentTarget.disabled || !checkSavedRecovery()) return false;
					setFocus(parent.parentNode.parentNode);
					if (failedToLoad > 0 && evt.ctrlKey) return inspectAll(evt);
					const click2Gos = getClick2Gos();
					evt.currentTarget.count = click2Gos.length;
					changeToCounter(evt.currentTarget, 'process-covers-countdown');
					for (let elem of click2Gos) elem.click();
				};
				currentTarget.style.color = currentTarget.dataset.color = 'mediumseagreen';
				currentTarget.textContent = 'Process existing covers';
				currentTarget.style.cursor = 'pointer';
				currentTarget.disabled = false;
				currentTarget.title = currentTarget.count.toString() + ' releases to process';
				console.log('[Cover Inspector] Page scan completed, %d images cached', Object.keys(imageDetailsCache).length);
				if (failedToLoad > 0) currentTarget.title += `\n(${failedToLoad} covers failed to load, scan again on Ctrl + click)`;
			} else return Promise.reject('Nothing to process');
		}) : Promise.reject('No editing permissions')).catch(reason => { currentTarget.remove() });
	}, 'inspect-all-covers');
	if (!noEditPerms && ajaxApiKey && !readOnly && !noBatchProcessing && !noAutoLookups) imageHostHelper.then(function(ihh) {
		function setCoverFromTorrentGroup(torrentGroup, img, reason) {
			if (!torrentGroup) throw 'Invalid argument';
			return coverLookup(torrentGroup, ihh).then(imageUrls =>
					ihh.rehostImageLinks([imageUrls[0]]).then(ihh.singleImageGetter).then(imageUrl =>
						setGroupImage(torrentGroup.group.id, imageUrl, autoLookupSummary(reason)).then(function(response) {
				console.log('[Cover Inspector]', response);
				updateImage(imageUrl, torrentGroup, img);
				if (autoOpenSucceed) openGroup(torrentGroup);
				return imageUrl;
			}))).catch(function(reason) {
				if (!torrentGroup.group.wikiImage && !inCoversCollage('missing', torrentGroup))
					addToCoversCollage('missing', torrentGroup.group.id);
				if (torrentGroup.group.wikiImage && !inCoversCollage('invalid', torrentGroup))
					ihh.verifyImageUrl(torrentGroup.group.wikiImage)
						.catch(reason => { addToCoversCollage('invalid', torrentGroup.group.id) });
				if (Array.isArray(torrentGroup.torrents) && torrentGroup.torrents.length > 0)
					Promise.all(torrentGroup.torrents.filter(torrent => /\b(?:https?):\/\//i.test(torrent.description))
							.map(torrent => bb2Html(torrent.description).then(getLinks, reason => null))).then(function(urls) {
						if ((urls = urls.filter(Boolean).map(urls => urls.filter(isMusicResource)).filter(urls => urls.length > 0)).length <= 0) return;
						if (autoOpenWithLink) openGroup(torrentGroup);
						console.log('[Cover Inspector] Links found in torrent descriptions for', torrentGroup, ':', urls);
					});
				return Promise.reject(reason);
			});
		}

		const missingImages = Array.prototype.filter.call(images, img => !hasArtworkSet(img));
		if (images.length <= 0 || missingImages.length > 0) addHeaderButton('Add missing covers', function autoAdd(evt) {
			if (!checkSavedRecovery()) return false;
			if (images.length <= 0 || (evt.currentTarget.count = Array.prototype.filter.call(images, img => !hasArtworkSet(img)).length) <= 0) {
				evt.currentTarget.remove();
				if (images.length > 0) return;
			} else changeToCounter(evt.currentTarget, 'missing-covers-countdown');
			setFocus(parent.parentNode.parentNode);
			iterateReleaseGroups(function(groupId, img, failHandler) {
				if (img instanceof HTMLImageElement) {
					if (!hasArtworkSet(img)) queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup =>
						setCoverFromTorrentGroup(torrentGroup, img, 'missing')).catch(failHandler.bind(ihh))
							.then(status => { counterDecrement('missing-covers-countdown', index) });
				} else queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup =>
						torrentGroup.group.wikiImage ? true : setCoverFromTorrentGroup(torrentGroup, null, 'missing'))
					.catch(failHandler.bind(ihh)).then(status =>
						{ if (status != true) counterDecrement('missing-covers-countdown', index) });
			});
		}, 'covers-auto-lookup', missingImages.length > 0 ? (missingImages.length + ' covers missing') : undefined);
		addHeaderButton('Fix invalid covers', function autoFix(evt) {
			if (!checkSavedRecovery()) return false;
			if (evt.currentTarget.count > 0) changeToCounter(evt.currentTarget, 'invalid-covers-countdown');
				else evt.currentTarget.remove();
			const autoAdd = parent.querySelector('span.covers-auto-lookup');
			if (autoAdd != null) autoAdd.remove();
			setFocus(parent.parentNode.parentNode);
			iterateReleaseGroups(function(groupId, img, failHandler) {
				function validateImage(imageUrl) {
					if (!httpParser.test(imageUrl)) return Promise.reject('unset or invalid format');
					const deproxiedSrc = deProxifyImgSrc(imageUrl);
					return (deproxiedSrc ? setGroupImage(groupId, deproxiedSrc, 'Deproxied release image (not working anymore)')
						.then(result => ihh.verifyImageUrl(deproxiedSrc)): ihh.verifyImageUrl(imageUrl)).then(verifiedImageUrl => true);
				}

				if (img instanceof HTMLImageElement) validateImage(realImgSrc(img)).catch(function(reason) {
					console.log('[Cover Inspector] Invalid or missing cover for groupId %d, reason:', groupId, reason);
					queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup =>
						setCoverFromTorrentGroup(torrentGroup, img, reason).catch(failHandler.bind(ihh))
							.then(status => { counterDecrement('invalid-covers-countdown', index) }));
				}); else queryAjaxAPI('torrentgroup', { id: groupId }).then(torrentGroup =>
						validateImage(torrentGroup.group.wikiImage).catch(function(reason) {
					console.log('[Cover Inspector] Invalid or missing cover for groupId %d, reason:', groupId, reason);
					return setCoverFromTorrentGroup(torrentGroup, null, reason);
				})).catch(failHandler.bind(ihh)).then(status =>
					{ if (status != true) counterDecrement('invalid-covers-countdown', index) });
			});
		}, 'auto-fix-covers', 'Missing covers lookup included');
		for (const img of missingImages) {
			img.removeAttribute('onclick');
			const groupId = getGroupId(img.parentNode.parentNode.querySelector('div.group_info'));
			if (groupId > 0) img.onclick = function(evt) {
				findCover(groupId, evt.currentTarget).catch(reason =>
					{ ihh.logFail(`groupId ${groupId} cover lookup failed: ${reason}`) });
				return false;
			}
		}
	});
	// addHeaderButton('Open all in tabs', function inspectAll(evt) {
	// 	iterateReleaseGroups(groupIdc => { openGroup(groupIdc) });
	// }, 'test-tabs-control');
	parent.append(container);
	if (images.length > 0 && GM_getValue('auto_inspect_cached', false) && Object.keys(imageDetailsCache).length > 0)
		iterateReleaseGroups(function(groupId, img) {
			if (img != null && hasArtworkSet(img) && realImgSrc(img) in imageDetailsCache) inspectImage(img, groupId);
		});
}

const urlParams = new URLSearchParams(document.location.search), id = parseInt(urlParams.get('id')) || undefined;
const findParent = table => table instanceof HTMLElement
	&& Array.prototype.find.call(table.querySelectorAll(':scope > tbody > tr:first-of-type > td'),
		td => /^(?:Torrents?|Name)\b/.test(td.textContent.trim())) || null;

// Crash recovery
if ('coverInspectorTabsQueue' in localStorage) try {
	const savedQueue = JSON.parse(localStorage.getItem('coverInspectorTabsQueue'));
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

function getAllCovers(groupId) {
	if (!(groupId > 0)) throw 'Invalid argument';
	return LocalXHR.get('/torrents.php?' + new URLSearchParams({ id: groupId })).then(({document}) =>
		Array.from(document.body.querySelectorAll('div#covers div > p > img'), realImgSrc));
}

function resolveTorrentRow(tr, ihh) {
	function setStatus(newStatus, ...addedText) {
		let td = tr.querySelector('td.status');
		console.assert(td != null); if (td == null) return; // assertion failed
		if (typeof newStatus == 'number') status = newStatus; else if (status == undefined) status = 2;
		td.className = 'status ' + td.textContent + ' status-code-' + status;
		if (status != 2 && typeof td.flashTimer == 'number') {
			clearInterval(td.flashTimer);
			delete td.flashTimer;
			td.style.transition = null;
		}
		td.style.color = ['red', 'orange', '#cc0', '#8a0', '#0a0'][status];
		td.textContent = status > 2 ? 'success' : status < 2 ? 'failed' : 'resolving';
		td.style.opacity = 1;
		if (status == 2) {
			td.style.transition = 'opacity 50ms';
			if (typeof td.flashTimer != 'number') td.flashTimer = setInterval(elem =>
				{ elem.style.opacity = elem.style.opacity < 1 ? 1 : 0.25 }, 500, td);
		}
		if (addedText.length > 0) Array.prototype.push.apply(tooltips, addedText);
		if (tooltips.length > 0) td.title = tooltips.join('\n'); else td.removeAttribute('title');
		//setTooltip(td, tooltips.join('\n'));
		if (status <= 0) if (autoHideFailed) tr.hidden = true;
			else if ((td = document.getElementById('hide-status-failed')) != null) td.hidden = false;
	}

	const groupId = getGroupId(tr), tooltips = [ ];
	let status;
	if (!(groupId > 0)) return setStatus(0, 'Could not extract torrent id');
	const autoHideFailed = GM_getValue('auto_hide_failed', false);
	queryAjaxAPI('torrentgroup', { id: groupId }).then(function(torrentGroup) {
		function removeFromCollages(...collageIndexes) {
			for (let collageIndex of collageIndexes) if (inCoversCollage(collageIndex, torrentGroup))
				removeFromCoversCollage(collageIndex, torrentGroup).then(() =>
					{ setStatus(status, `(removed from all ${collageIndex} covers collages)`) });
		}

		const qualityEmphasisCategory = [1].includes(torrentGroup.group.categoryId);
		const isCollagePage = id > 0 && ['/collages.php', '/collage.php'].includes(document.location.pathname);
		const isMissingCoverCollage = isCollagePage && coverRelatedCollages && ['missing', 'invalid', 'investigate']
			.some(index => Array.isArray(coverRelatedCollages[index]) && coverRelatedCollages[index].includes(id));
		const isPoorCoverCollage = isCollagePage && coverRelatedCollages && ['poor'].some(index =>
			Array.isArray(coverRelatedCollages[index]) && coverRelatedCollages[index].includes(id));
		let q0 = -1;
		return (function() {
			if (!torrentGroup.group.wikiImage) return Promise.reject('none set');
			const deproxiedSrc = deProxifyImgSrc(torrentGroup.group.wikiImage);
			return deproxiedSrc ? setGroupImage(torrentGroup.group.id, deproxiedSrc, 'Deproxied release image (not working anymore)')
				.then(result => ihh.verifyImageUrl(deproxiedSrc)) : ihh.verifyImageUrl(torrentGroup.group.wikiImage);
		})().then(function(imageUrl) {
			const hostname = new URL(imageUrl).hostname, domain = hostname.split('.').slice(-2).join('.');
			return !isOnDomainList(hostname, 2) ? testImageQuality(imageUrl).then(function(q) {
				if ((q0 = q) < (qualityEmphasisCategory ? 2 : 1))
					return Promise.reject('low resolution of existing image');
				setStatus(4, 'This release group seems to have a valid image');
				removeFromCollages('missing', 'invalid', 'investigate');
				if (!isPoorCoverCollage) removeFromCollages('poor');
				else if ('autoOpenSucceed') openGroup(torrentGroup);
				if (Array.isArray(preferredHosts) && preferredHosts.includes(hostname)
						|| isOnDomainList(imageUrl.hostname, 0)/* || !isOnDomainList(imageUrl.hostname, 1)*/)
					return null;
				return ihh.rehostImageLinks([imageUrl], true, false, true).then(ihh.singleImageGetter).then(imageUrl =>
						setGroupImage(torrentGroup.group.id, imageUrl, 'Automated cover rehost').then(function(response) {
					setStatus(status, '(' + response + ')');
					console.log('[Cover Inspector]', response);
					return imageUrl;
				})).catch(function(reason) {
					setStatus(status, 'Cover rehost failed: ' + reason);
					console.log('[Cover Inspector]', reason);
					return null;
				});
			}) : Promise.reject('Release group having image at bad host');
		}).catch(reason => (setStatus(2, `Looking for a new cover image (${reason})`),
				coverLookup(torrentGroup, ihh, isPoorCoverCollage)).then(imageUrls => testImageQuality(imageUrls[0]).then(function(q) {
			if (q <= q0 || q < (/*qualityEmphasisCategory ? 2 : */1) && isPoorCoverCollage)
				return Promise.reject('Image found is poor quality (resolution)');
			return ihh.rehostImageLinks(imageUrls, true, false, true)
					.then(results => results.map(ihh.directLinkGetter), function(reason) {
				setStatus(status, 'Cover rehost failed: ' + reason);
				return imageUrls;
			}).then(imageUrls => setGroupImage(torrentGroup.group.id, imageUrls[0], autoLookupSummary(reason)).then(function(response) {
				setStatus(4, response);
				console.log('[Cover Inspector]', response);
				removeFromCollages('missing', 'invalid', 'investigate');
				if (q < 1 || (q < 2 && qualityEmphasisCategory)) {
					if (!inCoversCollage('poor', torrentGroup)) addToCoversCollage('poor', torrentGroup).then(_status =>
						{ setStatus(status, '(added to poor quality covers collage)') });
					setStatus(3, 'However the quality is poor (resolution)');
				} else removeFromCollages('poor');
				if (imageUrls.length > 1) setStatus(3, '(more external links require attention)');
				if (autoOpenSucceed) openGroup(torrentGroup);
				return imageUrls[0];
			}));
		}))).catch(function(reason) {
			if (!Array.isArray(torrentGroup.torrents) || torrentGroup.torrents.length <= 0) return Promise.reject(reason);
			return Promise.all(torrentGroup.torrents.filter(torrent => /\b(?:https?):\/\//i.test(torrent.description))
					.map(torrent => bb2Html(torrent.description).then(getLinks, reason => null))).then(function(urls) {
				if ((urls = urls.filter(Boolean).map(urls => urls.filter(isMusicResource)).filter(urls =>
						urls.length > 0)).length <= 0) return Promise.reject(reason);
				setStatus(1, reason, 'No active external links in album description,\nbut release descriptions contain some:\n\n' +
					(urls = Array.prototype.concat.apply([ ], urls)).join('\n'));
				if (autoOpenWithLink) openGroup(torrentGroup);
				console.log('[Cover Inspector] Links found in torrent descriptions for', torrentGroup, ':', urls);
			});
		});
	}).catch(reason => { setStatus(0, reason) });
}

switch (document.location.pathname) {
	case '/artist.php':
		if (id > 0) {
			document.body.querySelectorAll('div.box_image img').forEach(inspectImage);
			const table = document.getElementById('discog_table');
			if (table != null) addTableHandlers(table, table.querySelector(':scope > div.box'),
				'display: block; text-align: right;'); //color: cornsilk; background-color: slategrey;'
			// document.body.querySelectorAll('table.torrent_table').forEach(function(table, index) {
			// 	const parent = findParent(table);
			// 	if (parent) addTableHandlers(table, parent, 'display: inline-block; margin-left: 3em;', index + 1);
			// });
		}
		break;
	case '/torrents.php':
		if (id > 0) {
			function embedCSESearch(gridSize = 178) {
				function killButton(color = '#0a0', retVal = false) {
					if (button != null) {
						if (color) button.style.color = color;
						setTimeout(function(elem) {
							elem.style.opacity = 0;
							if (elem.parentNode.parentNode != null) setTimeout(elem => { elem.remove() }, 2000, elem.parentNode);
						}, 5000, button);
					}
					return retVal;
				}

				console.assert(album.title, album);
				const button = document.body.querySelector('span.cse-search > a');
				if (button != null) if (button.disabled) return false; else button.disabled = true;
				if (!album.title || document.body.querySelector('div.main_column > div.box.cse-search-results') != null)
					return killButton('red');
				let anchor = document.body.querySelector('div.main_column > table.torrent_table');
				if (anchor == null) return killButton('red');
				const getArtists = (importance, maxArtists = 2) =>
					importance in album.artists && album.artists[importance].slice(0, maxArtists).join(' & ') || undefined;
				if (album.releaseType != 'Compilation') var artist = getArtists('artists_dj') || getArtists('artist_main');
				if (!artist && ['Compilation', 'DJ Mix'].includes(album.releaseType)) artist = 'Various';
				[button.style.color, button.style.cursor, button.textContent] = ['orange', 'progress', 'Waiting...'];
				const animation = button.parentNode.animate([
					{ offset: 0.0, opacity: 1 },
					{ offset: 0.4, opacity: 1 },
					{ offset: 0.5, opacity: 0.1 },
					{ offset: 0.9, opacity: 0.1 },
				], { duration: 600, iterations: Infinity });
				setTooltip(button);
				cseSearch(bareReleaseTitle(album.title), artist).then(function(results) {
					//console.debug('CSE Results:', results);
					const [box, body] = ['DIV', 'DIV'].map(Document.prototype.createElement.bind(document));
					box.className = 'box cse-search-results';
					box.innerHTML = '<div class="head"><a href="#">↑</a>&nbsp;<strong>Cover Search Engine search results</strong></div>';
					body.className = 'body';
					body.style = `
padding: 15px; width: 100%; max-height: 90vh; box-sizing: border-box;
display: grid; gap: 7px; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr;
overflow-y: auto; scrollbar-gutter: auto;
`;
					results.forEach(function(result, index) {
						function addLabelInfo(caption, value) {
							if (!caption || !value) return;
							const [entry, b] = ['SPAN', 'SPAN'].map(Document.prototype.createElement.bind(document));
							entry.style = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
							entry.className = 'detail';
							if (caption.toLowerCase().startsWith('<svg')) {
								b.innerHTML = caption;
								b.firstElementChild.setAttribute('fill', 'white');
								b.firstElementChild.setAttribute('height', '1em');
								b.firstElementChild.style.marginBottom = '-1pt';
								b.style = 'display: inline-block; min-width: 1.4em;';
								entry.append(b);
							} else {
								b.textContent = caption;
								b.style = 'font-weight: bold;';
								entry.append(b, ': ');
							}
							entry.append(value);
							label.append(entry);
						}

						const [item, img, label] = ['DIV', 'IMG', 'DIV'].map(Document.prototype.createElement.bind(document));
						item.className = 'cse-search-result';
						item.dataset.result = JSON.stringify(result);
						item.dataset.imageUrl = result.bigCoverUrl || result.smallCoverUrl;
						item.onmouseenter = item.onmouseleave = function(evt) {
							if (evt.relatedTarget == evt.currentTarget) return false;
							evt.currentTarget.lastElementChild.style.opacity = evt.type == 'mouseenter' ? 1 : 0;
							evt.currentTarget.style.boxShadow = evt.type == 'mouseenter' ? '0 0 5px 5px yellow' : 'none';
							evt.currentTarget.style.zIndex = evt.type == 'mouseenter' ? 2 : 'auto';
							//evt.currentTarget.style.transform = evt.type == 'mouseenter' ? 'scale(1.05)' : 'none';
						};
						item.style = `position: relative; width: ${gridSize}px; height: ${gridSize}px; cursor: pointer; transition: box-shadow, transform 200ms;`;
						item.draggable = true;
						img.className = 'cse-search-preview';
						img.loading = 'eager'; img.referrerPolicy = 'same-origin';
						img.src = result.smallCoverUrl || result.bigCoverUrl;
						img.width = img.height = gridSize;
						label.className = 'cse-search-result-label';
						label.draggable = true;
						label.style = `
position: absolute; bottom: 0; left: 0; width: 100%; padding: 5px; box-sizing: border-box;
display: flex; flex-flow: column;
color: white; background-color: #0008; font: normal 7pt "Noto Sans", sans-serif;
opacity: 0; transition: opacity 200ms;
overflow: hidden; text-overflow: ellipsis;
`;
						addLabelInfo('<svg viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000"><path d="M500,990c-251.9,0-456.2-82.2-456.2-183.7l0,0V702.9c0,101.5,204.3,164.6,456.2,164.6c251.9,0,456.2-63.1,456.2-164.6v103.4l0,0C956.2,907.8,751.9,990,500,990L500,990z M500,806.3c-251.9,0-456.2-82.3-456.2-183.8V519.1c0,101.5,204.3,164.6,456.2,164.6c251.9,0,456.2-63.1,456.2-164.6v103.4C956.2,724,751.9,806.3,500,806.3L500,806.3z M500,622.5c-251.9,0-456.2-82.3-456.2-183.8V335.4C43.8,436.9,248.1,500,500,500c251.9,0,456.2-63.1,456.2-164.6v103.4C956.2,540.2,751.9,622.5,500,622.5L500,622.5z M500,438.8c-251.9,0-456.2-82.3-456.2-183.8v-61.3C43.8,92.3,248.1,10,500,10c251.9,0,456.2,82.3,456.2,183.8V255C956.2,356.5,751.9,438.8,500,438.8L500,438.8z"/></svg>', result.source.toUpperCase());
						if (result.releaseInfo) {
							item.dataset.url = result.releaseInfo.url;
							addLabelInfo('<svg viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z"></path></svg>', result.releaseInfo.title);
							addLabelInfo('<svg viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path></svg>', result.releaseInfo.artist);
							addLabelInfo('<svg viewBox="0 0 448 512"><path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"></path></svg>', result.releaseInfo.date);
							if (result.releaseInfo.tracks > 0)
								addLabelInfo('<svg viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"></path></svg>', `${result.releaseInfo.tracks} ${result.releaseInfo.tracks > 1 ? 'tracks' : 'track'}`);
							addLabelInfo('<svg viewBox="0 0 576 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path></svg>', result.releaseInfo.catalog);
							addLabelInfo('<svg viewBox="0 0 512 512"><path d="M24 32C10.7 32 0 42.7 0 56V456c0 13.3 10.7 24 24 24H40c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H24zm88 0c-8.8 0-16 7.2-16 16V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16zm72 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H184zm96 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H280zM448 56V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H472c-13.3 0-24 10.7-24 24zm-64-8V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16s-16 7.2-16 16z"></path></svg>', result.releaseInfo.barcode);
						}
						getImageDetails(item.dataset.imageUrl).then(function(imageDetails) {
							addLabelInfo('<svg viewBox="0 0 62.89 62.89"><path d="M3.88 0l55.13 0c2.14,0 3.88,1.75 3.88,3.88l0 55.13c0,2.14 -1.74,3.88 -3.88,3.88l-55.13 0c-2.13,0 -3.88,-1.74 -3.88,-3.88l0 -55.13c0,-2.13 1.75,-3.88 3.88,-3.88zm50.61 52.62l0 0 0 -5.6 0 -18.67c0,-1.02 -0.84,-1.86 -1.87,-1.86l-5.6 0c-1.02,0 -1.86,0.84 -1.86,1.86l0 10.21 -20.82 -20.82 10.2 0c1.03,0 1.87,-0.84 1.87,-1.87l0 -5.6c0,-1.03 -0.84,-1.87 -1.87,-1.87l-18.67 0 -5.6 0 0 0 -0.05 0 0 0 -0.05 0 -0.04 0.01 0 0 -0.05 0 0 0 -0.05 0.01 0 0 -0.04 0 -0.05 0.01 0 0 -0.05 0.01 -0.04 0.01 0 0 -0.05 0.01 -0.04 0.01 -0.05 0.02 0 0 -0.04 0.01 0 0 -0.04 0.02 0 0 -0.04 0.01 0 0 -0.05 0.02 -0.04 0.02 -0.04 0.02 0 0 -0.04 0.02 0 0 -0.04 0.02 0 0 -0.04 0.02 0 0 -0.04 0.02 -0.04 0.03 -0.03 0.02 -0.04 0.03 -0.04 0.02 0 0 -0.03 0.03 -0.04 0.03 0 0 -0.03 0.03 -0.04 0.03 -0.03 0.03 0 0 -0.03 0.03 0 0 -0.03 0.03 0 0 -0.03 0.03 -0.03 0.04 -0.03 0.03 0 0 -0.03 0.04 -0.03 0.03 0 0 -0.02 0.04 -0.03 0.04 -0.02 0.03 -0.03 0.04 -0.02 0.04 0 0 -0.02 0.04 0 0 -0.02 0.04 0 0 -0.02 0.04 0 0 -0.02 0.04 -0.02 0.04 -0.02 0.05 0 0 -0.01 0.04 0 0 -0.02 0.04 0 0 -0.01 0.04 0 0 -0.02 0.05 -0.01 0.04 -0.01 0.05 0 0 -0.01 0.04 -0.01 0.05 0 0 -0.01 0.05 0 0.04 0 0 -0.01 0.05 0 0 0 0.05 0 0 -0.01 0.04 0 0.05 0 0 0 0.05 0 0 0 5.6 0 18.67c0,1.03 0.84,1.87 1.87,1.87l5.6 0c1.03,0 1.87,-0.84 1.87,-1.87l0 -10.2 20.82 20.82 -10.21 0c-1.02,0 -1.86,0.84 -1.86,1.86l0 5.6c0,1.03 0.84,1.87 1.86,1.87l18.67 0 5.6 0 0 0 0.05 0 0 0 0.05 0 0.05 0 0 0 0.05 -0.01 0 0 0.04 0 0 0 0.05 -0.01 0.04 -0.01 0 0 0.05 -0.01 0.05 -0.01 0 0 0.04 -0.01 0.04 -0.01 0.05 -0.01 0 0 0.04 -0.02 0 0 0.05 -0.01 0 0 0.04 -0.02 0 0 0.04 -0.02 0.04 -0.01 0.04 -0.02 0 0 0.04 -0.02 0 0 0.04 -0.02 0 0 0.04 -0.03 0 0 0.04 -0.02 0.04 -0.02 0.04 -0.03 0.03 -0.02 0.04 -0.03 0 0 0.04 -0.03 0.03 -0.03 0 0 0.03 -0.03 0.04 -0.03 0.03 -0.03 0 0 0.03 -0.03 0 0 0.03 -0.03 0 0 0.04 -0.03 0.03 -0.04 0.02 -0.03 0 0 0.03 -0.03 0.03 -0.04 0 0 0.03 -0.04 0.02 -0.03 0.03 -0.04 0.02 -0.04 0.02 -0.04 0 0 0.03 -0.04 0 0 0.02 -0.04 0 0 0.02 -0.04 0 0 0.02 -0.04 0.01 -0.04 0.02 -0.04 0 0 0.02 -0.05 0 0 0.01 -0.04 0 0 0.02 -0.04 0 0 0.01 -0.05 0.01 -0.04 0.01 -0.05 0 0 0.01 -0.04 0.01 -0.05 0 0 0.01 -0.04 0.01 -0.05 0 0 0 -0.05 0 0 0.01 -0.04 0 0 0 -0.05 0 -0.05 0 0 0 -0.05z"/></svg>', imageDetails.width + '×' + imageDetails.height);
							addLabelInfo('<svg viewBox="0 0 20 20"><path d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path d="M10 15l5-6h-4V1H9v8H5l5 6z"/></svg>', formattedSize(imageDetails.size));
						});
						if (label.childElementCount > 0) item.append(img, label);
						item.onclick = function(evt) {
							const target = evt.currentTarget;
							(!evt.ctrlKey && !noEditPerms && ajaxApiKey ? imageHostHelper.then(function(ihh) {
								const img = document.body.querySelector('div#covers img');
								ihh.verifyImageUrl(target.dataset.imageUrl).then(function(imageUrl) {
									if (!confirm('Current cover is going to be replaced by\n' + imageUrl)) return false;
									if (img != null) img.style.opacity = 0.3;
									return ihh.rehostImageLinks([imageUrl]).then(ihh.singleImageGetter) .then(imageUrl =>
											setGroupImage(id, imageUrl, 'Non-automated cover update from external source').then(function(response) {
										console.log(response);
										if (img != null) {
											setNewSrc(img, imageUrl);
											inspectImage(img, id).then(status => { updateCoverCollages(status, id) });
										} else document.location.reload();
									}));
								}).catch(function(reason) {
									ihh.logFail('Setting cover from result url failed: ' + reason);
									if (img != null && img.style.opacity < 1) img.style.opacity = 1;
								});
							}) : Promise.reject('Site edit not available')).catch(reason =>
								{ GM_openInTab(target.dataset[evt.shiftKey ? 'imageUrl' : 'url'], false) });
						};
						item.onauxclick = function(evt) {
							if (evt.button != 1) return true;
							GM_openInTab(evt.currentTarget.dataset.url, false)
							return false;
						};
						(!noEditPerms && ajaxApiKey && !readOnly ? imageHostHelper.then(function() {
							item.title = `Use simple click to set album cover from this source
Use Ctrl+click to open source page in new window
Use Ctrl+Shift+click to open cover image in new window
Drag anywhere to drop full resolution direct link

` + item.dataset.imageUrl;
						}) : Promise.reject('Site edit not available')).catch(function() {
							item.title = `Use simple click to open source page in new window
Use Shift+click to open cover image in new window
Drag anywhere to drop full resolution direct link

` + item.dataset.imageUrl;
						});
						item.ondragstart = function(evt) {
							if (!evt.dataTransfer) return;
							evt.dataTransfer.clearData();
							evt.dataTransfer.setData('text/uri-list', evt.currentTarget.dataset.imageUrl);
							evt.dataTransfer.setData('text/plain', evt.currentTarget.dataset.imageUrl);
							evt.dataTransfer.setData('text/imageUrl', evt.currentTarget.dataset.imageUrl);
							if (item.dataset.url) evt.dataTransfer.setData('text/url', evt.currentTarget.dataset.url);
							// GlobalXHR.get(evt.currentTarget.dataset.imageUrl, { responseType: 'blob' })
							// 	.then(({response}) => draggedImage = new File([response], 'cover.jpg'));
						};
						body.append(item);
					});
					box.append(body);
					anchor.after(box);
					[button.textContent, button.style.cursor] = ['Success', 'default'];
					killButton('#0a0');
					setFocus(box);
					if (cseSearchMenu) GM_unregisterMenuCommand(cseSearchMenu);
				}).catch(function(reason) {
					[button.textContent, button.style.cursor, button.style.color, button.disabled] =
						['Error', null, 'red', false];
					setTooltip(button, reason);
					//killButton('red');
				}).then(() => { if (animation) animation.cancel() });
				return true;
			}

			if (document.body.querySelector('div#content div.sidebar > div.box.box_artists') != null) {
				var album = { title: document.body.querySelector('div#content div.header > h2'), artists: { } };
				if (album.title != null && (album.releaseType = /\[(\d+)\] \[(.+)\]/.exec(album.title.lastChild.textContent.trim())) != null) Object.assign(album, {
					title: album.title.lastElementChild.textContent.trim(),
					year: parseInt(album.releaseType[1]),
					releaseType: album.releaseType[2],
				});
				for (let a of document.body.querySelectorAll('ul#artist_list > li > a[dir="ltr"]')) {
					if (!(a.parentNode.className in album.artists)) album.artists[a.parentNode.className] = [ ];
					album.artists[a.parentNode.className].push(a.textContent.trim());
				}
				console.debug('Music album:', album);
			}
			if (typeof GM_getTabs == 'function') GM_getTabs(function(tabs) {
				for (let tab in tabs) if ((tab = tabs[tab]) && 'torrentGroups' in tab) try {
					if (!(tab = tab.torrentGroups[id])) continue;
					console.info('Torrent group %d found in tabs data', id);
					unsafeWindow.torrentGroup = tab;
					unsafeWindow.dispatchEvent(Object.assign(new Event('torrentGroup'), { data: tab }));
				} catch (e) { console.warn(e) }
			});

			for (let img of document.body.querySelectorAll('div#covers img')) inspectImage(img, id);
			if (!noEditPerms && ajaxApiKey && !readOnly) imageHostHelper.then(function(ihh) {
				function setCoverFromLink(a) {
					console.assert(a instanceof HTMLAnchorElement, 'a instanceof HTMLAnchorElement');
					if (!(a instanceof HTMLAnchorElement)) throw 'Invalid invoker';
					const img = document.body.querySelector('div#covers img');
					ihh.imageUrlResolver(a.href).then(singleResultGetter).then(function(imageUrl) {
						if (img != null) img.style.opacity = 0.3;
						return ihh.rehostImageLinks([imageUrl]).then(ihh.singleImageGetter)
								.then(imageUrl => setGroupImage(id, imageUrl, 'Cover update from description link').then(function(response) {
							console.log(response);
							if (img != null) {
								setNewSrc(img, imageUrl);
								inspectImage(img, id).then(status => { updateCoverCollages(status, id) });
							} else document.location.reload();
						}));
					}).catch(function(reason) {
						ihh.logFail('Setting cover from link source failed: ' + reason);
						if (img != null && img.style.opacity < 1) img.style.opacity = 1;
					});
				}

				const contextId = '522a6889-27d6-4ea6-a878-20dec4362fbd', menu = document.createElement('menu');
				menu.type = 'context';
				menu.id = contextId;
				menu.className = 'cover-inspector';
				let menuInvoker;
				const setMenuInvoker = evt => { menuInvoker = evt.currentTarget };

				function addMenuItem(label, callback) {
					if (label) {
						const menuItem = document.createElement('MENUITEM');
						menuItem.label = label;
						if (typeof callback == 'function') menuItem.onclick = callback;
						menu.append(menuItem);
					}
					return menu.children.length;
				}

				addMenuItem('Set cover image from this source', evt => { setCoverFromLink(menuInvoker) });
				document.body.append(menu);

				function clickHandler(evt) {
					if (evt.altKey) evt.preventDefault(); else return true;
					if (confirm('Set torrent group cover from this source?')) setCoverFromLink(evt.currentTarget);
					return false;
				}

				function setAnchorHandlers(a) {
					console.assert(a instanceof HTMLAnchorElement, 'a instanceof HTMLAnchorElement');
					if (!(a instanceof HTMLAnchorElement)) return false;
					a.setAttribute('contextmenu', contextId);
					a.oncontextmenu = setMenuInvoker;
					if (a.protocol.startsWith('http') && !a.onclick) {
						a.onclick = clickHandler;
						const tooltip = 'Alt + click to set release cover from this URL (or use context menu command)';
						a.title = tooltip;
						if (GM_getValue('tooltip_desc_links_image', false) && typeof jQuery.fn.tooltipster == 'function') imageHostHelper.then(function(ihh) {
							ihh.imageUrlResolver(a.href).then(singleResultGetter).then(linkImage => { $(a).tooltipster({
								content: '<img src="' + linkImage + '" width="225" referrerpolicy="same-origin" /><div style="margin-top: 5pt; max-width: 225px;">' + tooltip + '</div>',
							}) });
						});
					}
					return true;
				}

				for (const root of [
					'div.torrent_description > div.body',
					'table#torrent_details > tbody > tr.torrentdetails > td > blockquote',
				]) for (let a of document.body.querySelectorAll(root + ' a')) if (!noCoverHere(a)) {
					const hostNorm = a.hostname.toLowerCase();
					if (hostNorm in hostSubstitutions) a.hostname = hostSubstitutions[hostNorm];
					setAnchorHandlers(a);
				}

				if (!noAutoLookups) GM_registerMenuCommand('Cover auto lookup', () => { findCover(id).catch(alert) }, 'A');
				cseSearchMenu = GM_registerMenuCommand('Search cover (manual)', () => { embedCSESearch() }, 'M');
			});

			if (GM_getValue('auto_expand_extra_covers', true)) {
				const xtraCovers = document.body.querySelector('div.box_image span#cover_controls_0 > a.show_all_covers');
				if (xtraCovers != null) xtraCovers.click();
			}

			function embedpage(url, title, className) {
				if (!url || !title) throw 'Invalid argument';
				const anchor = document.body.querySelector('div.main_column > div.torrent_description');
				if (anchor == null) return null;
				const [div, iframe] = ['DIV', 'IFRAME'].map(Document.prototype.createElement.bind(document));
				div.classList.add('box');
				if (className) div.classList.add(className);
				div.innerHTML = '<div class="head"><a href="#">↑</a>&nbsp;<strong>' + title + '</strong></div><div class="body"></div>';
				iframe.frameBorder = 0; iframe.allowFullscreen = true;
				iframe.referrerPolicy = 'no-referrer';
				iframe.sandbox.add('allow-scripts', 'allow-forms', 'allow-same-origin');
				iframe.width = '100%'; iframe.height = '500';
				iframe.src = url;
				// iframe.onload = function(evt) {
				// 	const document = evt.currentTarget.contentDocument || evt.currentTarget.contentWindow.document;
				// 	if (document == null) return;
				// };
				iframe.onerror = evt => { anchor.removeChild(div) };
				div.querySelector('div.body').append(iframe);
				return anchor.before(div);
			}

			// Embed Cover Search Engine results
			if (album) if (Boolean(urlParams.get('embed-cse-search'))) embedCSESearch(); else {
				let anchor = document.getElementById('add_cover_div');
				if (anchor != null || (anchor = document.querySelector('div.sidebar > div.box_image > div.head')) != null) {
					const [span, a] = ['SPAN', 'A'].map(Document.prototype.createElement.bind(document));
					span.className = 'cse-search';
					span.style = 'float: right; margin-left: 5pt; font-weight: normal;';
					a.href = '#';
					a.textContent = anchor.id == 'add_cover_div' ? 'Search cover' : 'Search';
					a.className = 'brackets';
					a.style.transition = 'opacity 2s';
					a.onclick = function(evt) {
						evt.stopImmediatePropagation();
						embedCSESearch();
						return false;
					};
					span.append(a); anchor.firstElementChild.prepend(span);
				}
			}
			// Embed Google Image search
			if (album && Boolean(urlParams.get('embed-google-image-search')) && album.title && album.year > 0) {
				let query = '"' + bareReleaseTitle(album.title) + '" ' + album.year;
				const stringifyArtists = (importance, maxArtists = 3) => importance in album.artists ?
					album.artists[importance].slice(0, maxArtists).map(artist => '"' + artist + '"').join(' ') : undefined;
				if (album.releaseType != 'Compilation') {
					if ('artists_dj' in album.artists) query = stringifyArtists('artists_dj') + ' ' + query;
					else if ('artist_main' in album.artists) query = stringifyArtists('artist_main') + ' ' + query;
				} else query = (stringifyArtists('artists_dj') || '"Various Artists"') + ' ' + query;
				const embedUrl = new URL('https://www.google.com/search');
				embedUrl.searchParams.set('q', query);
				embedUrl.searchParams.set('tbm', 'isch');
				//embedUrl.hash = 'islmp';
				embedpage(embedUrl, 'Google image search results', 'google-image-search-results');
			}
			// Embed first description link if available
			if (Boolean(urlParams.get('embed-desc-link-source'))) {
				const links = getLinks(document.querySelector('div.torrent_description > div.body'));
				if (links != null) for (let link of links) embedpage(link, 'Description Link Preview', 'desc-link-preview');
			}
			// Embed description links image previews
			if (Boolean(urlParams.get('desc-links-image-preview'))) {
				const anchor = document.body.querySelector('div.sidebar > div.box_image');
				const links = getLinks(document.querySelector('div.torrent_description > div.body'));
				if (anchor != null && links != null) imageHostHelper.then(function(ihh) {
					let previewBox = document.createElement('DIV');
					previewBox.className = 'box description_link_image_preview';
					previewBox.innerHTML = '<div class="head"><strong>Description links image preview</strong></div><div class="pad"></div>';
					anchor.after(previewBox);
					previewBox = previewBox.querySelector('div.pad');
					previewBox.style = 'display: flex; flex-direction: column; gap: 5pt;';
					links.forEach(function(link, index) {
						const div = document.createElement('DIV');
						div.textContent = 'Resolving image...';
						div.dataset.url = link; div.dataset.index = index;
						previewBox.append(div);
						ihh.imageUrlResolver(link).then(singleResultGetter).then(function(linkImage) {
							const img = document.createElement('IMG');
							img.onload = function(evt) {
								evt.currentTarget.title = link + ' → ' + linkImage;
								evt.currentTarget.alt = linkImage;
								while (div.lastChild != null) div.removeChild(div.lastChild);
								div.append(evt.currentTarget);
							};
							img.onerror = function(evt) {
								div.textContent = 'Image loading error for ' + link;
								div.style.color = 'red';
							};
							img.width = 225; img.referrerPolicy = 'same-origin'; img.src = linkImage;
						}, function(reason) {
							div.textContent = 'No valid image for ' + link;
							div.style.color = 'red';
							div.title = reason;
						});
					});
				});
			}
			if (Boolean(urlParams.get('highlight-cover-collages')) && coverRelatedCollages)
				for (let a of document.querySelectorAll('table.collage_table > tbody > tr > td:first-of-type > a')) {
					const collageId = a.pathname == '/collages.php' && parseInt(new URLSearchParams(a.search).get('id'));
					if (collageId > 0 && Object.keys(coverRelatedCollages).some(key =>
							Array.isArray(coverRelatedCollages[key]) && coverRelatedCollages[key].includes(collageId))) {
						a.style = 'color: white; font-weight: bold;';
						a.parentNode.parentNode.style = 'color: white; background-color: darkorange;';
					}
				}
		} else { // not torrent group
			const useIndexes = urlParams.get('action') == 'notify';
			document.body.querySelectorAll('table.torrent_table').forEach(function(table, index) {
				const parent = findParent(table);
				if (parent) addTableHandlers(table, parent, 'display: inline-block; margin-left: 17pt;',
					useIndexes ? index + 1 : undefined);
			});
		}
		break;
	case '/collages.php':
	case '/collage.php':
		if (!noEditPerms && ajaxApiKey && !readOnly && !noAutoLookups && !noBatchProcessing && coverRelatedCollages
				&& Object.values(coverRelatedCollages).some(collageIds =>
					Array.isArray(collageIds) && collageIds.includes(id))) imageHostHelper.then(function(ihh) {
			const td = document.body.querySelector('table#discog_table > tbody > tr.colhead_dark > td:nth-of-type(3)');
			if (td != null) {
				function addButton(caption, clickHandler, id, color = 'currentcolor', visible = true, tooltip) {
					if (!caption || typeof clickHandler != 'function') throw 'Invalid argument';
					const elem = document.createElement('SPAN');
					if (id) elem.id = id;
					elem.className = 'brackets';
					elem.textContent = caption;
					elem.style = `float: right; margin-right: 1em; cursor: pointer; color: ${color};`;
					elem.onclick = clickHandler;
					if (!visible) elem.hidden = true;
					if (tooltip) elem.title = tooltip;
					td.append(elem);
					return elem;
				}

				addButton('Cover art auto lookup', function(evt) {
					if (checkSavedRecovery()) evt.currentTarget.remove(); else return false;
					const pager = document.body.querySelector('div.main_column > div.linkbox:not(.pager)');
					if (pager != null) setFocus(pager);
					const autoHideFailed = GM_getValue('auto_hide_failed', false);
					document.body.querySelectorAll('table#discog_table > tbody > tr').forEach(function(tr) {
						const td = document.createElement('TD');
						tr.append(td);
						if (tr.classList.contains('colhead_dark')) {
							td.textContent = 'Status';
							td.title = 'Result of attempt to add missing/broken/poor cover\nHover the mouse over status for more details'; //setTooltip(td, tooltip);
						} else if (/^group_(\d+)$/.test(tr.id)) {
							td.className = 'status';
							td.style.opacity = 0.3;
							td.textContent = 'unknown';
							resolveTorrentRow(tr, ihh);
						}
					});
				}, 'covers-auto-lookup', 'gold');
				addButton('Hide failed', function(evt) {
					evt.currentTarget.hidden = true;
					for (let td of document.body.querySelectorAll('table#discog_table > tbody > tr[id] > td.status.status-code-0'))
						td.parentNode.hidden = true;
				}, 'hide-status-failed', undefined, false);
			}
		});
		break;
	case '/userhistory.php':
	case '/top10.php':
		document.body.querySelectorAll('table.torrent_table').forEach(function(table, index) {
			const parent = findParent(table);
			if (parent) addTableHandlers(table, parent, 'display: inline-block; margin-left: 3em;', index + 1);
		});
		break;
	case '/better.php':
		if (!noEditPerms && ajaxApiKey && !readOnly && !noBatchProcessing && !noAutoLookups
				&& ['artwork'].includes(urlParams.get('method'))) imageHostHelper.then(function(ihh) {
			const linkBox = document.body.querySelector('div.header > div.linkbox');
			console.assert(linkBox != null);
			if (linkBox == null) throw 'linkbox not found';
			const a = document.createElement('A');
			a.id = 'covers-auto-lookup';
			a.className = 'brackets';
			a.textContent = 'Cover art auto lookup';
			a.href = '#';
			a.onclick = function(evt) {
				if (!checkSavedRecovery()) return false;
				evt.currentTarget.previousSibling.remove();
				evt.currentTarget.remove();
				const pager = document.body.querySelector('div.linkbox.pager');
				if (pager != null) setFocus(pager);
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
					if (!(tr.classList.contains('torrent'))) return;
					td.className = 'status';
					td.style.opacity = 0.3;
					td.textContent = 'unknown';
					resolveTorrentRow(tr, ihh);
				});
				return false;
			};
			linkBox.append(' ', a);
		});
		break;
}
