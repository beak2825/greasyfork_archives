// ==UserScript==
// @name          last.fm listeners you know
// @description   Shows play counts of "listeners you know" where it's present
// @version       0.0.2
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @match         https://www.last.fm/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @run-at        document-start
// @connect       self
// @downloadURL https://update.greasyfork.org/scripts/28101/lastfm%20listeners%20you%20know.user.js
// @updateURL https://update.greasyfork.org/scripts/28101/lastfm%20listeners%20you%20know.meta.js
// ==/UserScript==

/* jshint lastsemic:true, multistr:true, laxbreak:true, -W030, -W041, -W084 */

GM_addStyle(`
	.col-sidebar .chartlist {
		margin-bottom: 2em;
	}
	.col-sidebar .chartlist tr {
		box-shadow: none!important;
	}
	.col-sidebar .chartlist .chartlist-ellipsis-wrap {
		position: static!important;
	}
	.col-sidebar .chartlist.chartlist--big-image .chartlist-ellipsis-wrap {
		margin-top: -1px!important;
		margin-left: 1ex;
	}
`);

const CACHE_DURATION = 24 * 3600 * 1000; // last.fm updates the stats each day
setTimeout(cleanupCache, 10000);

document.addEventListener('DOMContentLoaded', process);
document.addEventListener('pjax:end.listeners-you-know', process);
window.addEventListener('load', function onLoad() {
	window.removeEventListener('load', onLoad);
	unsafeWindow.jQuery(unsafeWindow.document).on('pjax:end', exportFunction(relayPJAX, unsafeWindow));
});

function relayPJAX() {
	document.dispatchEvent(new CustomEvent('pjax:end.listeners-you-know'));
}

function process() {
	const link = document.querySelector('a[href*="/+listeners/you-know"]');
	if (!link)
		return;
	const cached = readCache(link.href);
	if (cached)
		return render(cached);

	fetchDoc(link.href).then(doc => {
		const listeners = doc.querySelector('.col-main table');
		if (!listeners)
			return;
		[].forEach.call(listeners.querySelectorAll('.chartlist-index'), e => e.style.display = 'none');
		const me = listeners.querySelector(`a[href$="${document.querySelector('.auth-link').pathname}"]`);
		if (me)
			me.closest('tr').remove();
		const html = listeners.outerHTML.replace(/\r?\n/g, ' ').replace(/\s\s+/g, ' ');
		writeCache({url: link.href, html});
		render(html);
	});

	function render(html) {
		document.querySelector('.col-sidebar').insertAdjacentHTML('afterbegin', html);
	}
}

function fetchDoc(options) {
	options = typeof options == 'string' ? {url: options} : options;
	options = Object.assign({method: 'GET'}, options);
	return new Promise(resolve => GM_xmlhttpRequest(
		Object.assign(options, {
			onload: r => resolve(new DOMParser().parseFromString(r.responseText, 'text/html'))
		})
	));
}

function readCache(url) {
	const data = (localStorage[url] || '').split('\0', 2);
	const expired = +data[0] < Date.now();
	return !expired && data[1];
}

function writeCache({url, html, cleanupRetry}) {
	const expires = Date.now() + CACHE_DURATION;
	if (!tryCatch(() => localStorage[url] = expires + '\0' + html)) {
		if (cleanupRetry)
			return console.error('localStorage write error');
		cleanupCache({aggressive: true});
		setIimeout(writeCache, 0, {url, html, cleanupRetry: true});
	}
	setTimeout(() => { localStorage.removeItem(url) }, CACHE_DURATION + 1000);
}

function cleanupCache({aggressive = false} = {}) {
	Object.keys(localStorage).forEach(k => {
		if (k.match(/^https?:\/\/[^\t]+$/)) {
			let meta = (localStorage[k] || '').split('\0', 2);
			if (+meta[0] < Date.now() || aggressive)
				localStorage.removeItem(k);
		}
	});
}

function tryCatch(fn) {
	try { return fn() }
	catch(e) {}
}
