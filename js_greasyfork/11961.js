
1
2
3
4
5
6
7
8
9
10
11
12
13
14
// ==UserScript==
// @name        @-posting
// @version     0.1.0.1
// @namespace   atposting
// @license     WTFPL
// @include     *://boards.4chan.org/g/*
// @run-at      document-end
// @description Link to posts in the same 4chan thread with "@".
// @downloadURL https://update.greasyfork.org/scripts/11961/%40-posting.user.js
// @updateURL https://update.greasyfork.org/scripts/11961/%40-posting.meta.js
// ==/UserScript==
(function() {
	Array.prototype.forEach.call(document.querySelectorAll('.postMessage'), function(x) {
		x.innerHTML = x.innerHTML.replace(/<FAGGOT([0-9]+)/, '<a href="#p$1" class="quotelink"><FAGGOT$1</a>');
	});
})();