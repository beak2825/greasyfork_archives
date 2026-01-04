// ==UserScript==
// @name          Google Search URL Cleaner
// @namespace     Google Search URL Cleaner
// @include       http://www.google.tld/search?*
// @include       https://www.google.tld/search?*
// @version       0.1
// @description   Remove url parameters not listed
// @icon          https://www.google.com/s2/favicons?sz=128&domain_url=google.com
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504456/Google%20Search%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/504456/Google%20Search%20URL%20Cleaner.meta.js
// ==/UserScript==

// Parameters to keep and in what order to reinsert
var okParams = [
	'q',    // search parameter
	'start',// current page parameter
	'tbm',  // search filter used eg: images, books, news
	'tbs',  // extra search parameters eg: show resolution on images, encoded image uploads
	'uule', // location parameter
	'gl',   // language parameter
	'udm',  // mobile usability or user device mode parameter
	'dpr',  // device pixel ratio
	'vssid' // visual search session id, important for image search
];
var newParams = [];

okParams.forEach(function (item, index, array) {
	if (m = window.location.search.match(RegExp('[?&]' + item + '=([^?&]+)'))) {
		newParams.push(item + '=' + m[1].replace(/\+/g, '%20'));
	}
});

history.replaceState(null, 'Google URL Cleaner', 'search?' + newParams.join('&').replace(/&$/g, '') + window.location.hash);
