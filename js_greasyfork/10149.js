// ==UserScript==
// @id             Google URL Cleaner
// @name           Google URL Cleaner
// @namespace      vzjrz1@gmail.com
// @description    Remove url parameters not listed
// @include        http://www.google.tld/search?*
// @include        https://www.google.tld/search?*
// @version        1.3
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/10149/Google%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/10149/Google%20URL%20Cleaner.meta.js
// ==/UserScript==


// Parameters to keep and in what order to reinsert
var okParams = [
	'q', // search parameter
	'start', // current page parameter
	'tbm', // search filter used eg: images, books, news
	'tbs' // extra search parameters eg: show resolution on images, encoded image uploads
];
var newParams = [];

okParams.forEach(function (item, index, array) {
	console.log(item, index);
	if (m = window.location.search.match(RegExp('[?&]' + item + '=([^?&]+)'))) {
		// newParams.push(item + '=' + m[1]); // Don't replace +'s with spaces
		newParams.push(item + '=' + m[1].replace(/\+/g, '%20'));
	}
});

history.replaceState(null, 'Google URL Cleaner', 'search?' + newParams.join('&').replace(/&$/g, ''));
