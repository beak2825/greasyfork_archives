// ==UserScript==//
// @name           IMDB works#
// @description    Shows number of credited works after names on IMDB site
// @match          *://*.imdb.com/*
// @version        1.0.7
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/26787/IMDB%20works.user.js
// @updateURL https://update.greasyfork.org/scripts/26787/IMDB%20works.meta.js
// ==/UserScript==

var SELECTOR = 'a[href^="/name/nm"]';
var CACHE_FRESH_DURATION = 30 * 24 * 3600 * 1000; // 1 month
var CACHE_STALE_DURATION = CACHE_FRESH_DURATION * 2; // keep stale data another 2 months, then kill

GM_addStyle(
	'.number-of-works, .number-of-works span { opacity: 0.5; transition: opacity .25s ease-in-out .25s; }' +
	'.number-of-works span:before { content: "/"; }' +
	'.number-of-works:hover { opacity: 1.0; }' +
	'.number-of-works:hover span { opacity: 1.0; }' +
	'.number-of-works:before { content: " ["; opacity: 0.5; }' +
	'.number-of-works:after { content: "]"; opacity: 0.5; }'
);

process(document.querySelectorAll(SELECTOR));
setMutationHandler(document, SELECTOR, process);

if (location.pathname.match(/\/name\/nm\d+\/?$/)) {
	document.addEventListener('DOMContentLoaded', function() {
		parseNamePage(document, {cacheKey: 'works#' + location.pathname.match(/\/name\/nm(\d+)\/?$/)[1]});
	});
}

function process(links) {
	var now = Date.now();
	for (var link, i = 0; (link = links[i++]); ) {
		if (link.querySelector('img') ||
			!link.textContent.trim() ||
			link.children[0] && link.textContent.trim() != link.children[0].textContent.trim() ||
			link.nextElementSibling && link.nextElementSibling.matches('.number-of-works'))
			continue;
		var id = (link.pathname.match(/\/name\/nm(\d+)\/?$/) || [])[1];
		if (!id)
			continue;
		var cacheKey = 'works#' + id;
		var cache = (localStorage[cacheKey] || '').split('\t');
		if (cache.length == 2 && +cache[0] && cache[1]) {
			showWorksNum(link, cache[1]);
			var isFresh = +cache[0] > now;
			if (isFresh)
				continue;
		}
		doXHR({
			url: link.pathname,
			link: link,
			cacheKey: cacheKey,
			onload: parseNamePage,
		});
	}
}

function showWorksNum(link, num) {
    num = num.toString().replace(/\/(\d+)/, '<span>$1</span>');
	if (link.nextElementSibling && link.nextElementSibling.matches('.number-of-works')) {
		link.nextElementSibling.innerHTML = num;
	} else {
		link.insertAdjacentHTML('afterend', '<span class="number-of-works">' + num + '</span>');
	}
}

function parseNamePage(doc, options) {
	var credits = [].map.call(doc.querySelectorAll('#filmography .head'), function(e) {
		return {
			num: +(e.textContent.match(/\((\d+) credits?\)/i) || [])[1],
			type: (e.querySelector('a[name]') || {name: ''}).name,
		};
	});
	if (!credits.length)
		return;
	var creditsSum = credits.reduce(function(sum, e) { return sum + e.num; }, 0);
	var rxIgnore = /^(self|archive_footage|thanks)$/;
	var creditsSorted = credits.sort(function(a, b) {
		if (rxIgnore.test(a.type))
			return 1;
		else if (rxIgnore.test(b.type))
			return -1;
		else
			return b.num - a.num || (a.type == 'actor' ? -1 : b.type == 'actor' ? 1 : 0);
	});
	var worksNum = rxIgnore.test(creditsSorted[0].type) ? creditsSum : creditsSorted[0].num + (credits.length > 1 ? '/' + creditsSum : '');
	localStorage[options.cacheKey] = '' + (Date.now() + CACHE_FRESH_DURATION) + '\t' + worksNum;
	if (options.link)
		showWorksNum(options.link, worksNum);
}

function doXHR(options) {
	if (document.readyState == 'complete') {
		sendRequest(options);
		return;
	}
	if (!doXHR.queue)
        initQueue();
    if (!isDupe()) {
        doXHR.queue.push(options);
        doXHR.queuedUrl[options.url] = options;
    }

	function sendRequest(options) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', options.url);
		xhr.responseType = 'document';
		xhr.onload = function(e) {
			options.onload(xhr.response, options);
            doXHR.activeRequests--;
            poolQueue();
		};
        doXHR.activeRequests++;
		xhr.send();
	}

	function initQueue() {
		doXHR.queue = [];
		doXHR.queuedUrl = {};
        doXHR.activeRequests = 0;
		document.addEventListener('DOMContentLoaded', function() {
			cleanupStorage();
            poolQueue();
		});
    }

	function isDupe() {
        var dupe = doXHR.queuedUrl[options.url];
        if (!dupe)
            return false;
        if (dupe.link == options.link)
            return true;
        // this request's link element will use the will-be-cached data from the earlier queued request
        options.url = '';
        var _onload = dupe.onload;
        dupe.onload = function() {
            _onload.apply(null, arguments);
            showWorksNum(options.link, localStorage[options.cacheKey].split('\t')[1]);
        };
        return true;
    }

    function poolQueue() {
        while (doXHR.queue.length && doXHR.activeRequests < 16) {
            sendRequest(doXHR.queue.shift());
        }
    }
}

function cleanupStorage() {
	setTimeout(function doCleanup() {
		var now = Date.now(), i = 0;
		for (var k in localStorage) {
			if (k.lastIndexOf('works#', 0) === 0 && (+localStorage[k].split('\t')[0]) + CACHE_STALE_DURATION < now) {
				delete localStorage[k];
			}
			if (++i % 100 === 0 && Date.now() - now > 10) {
				setTimeout(doCleanup, 1000);
				return;
			}
		}
	}, 1000);
}
