// ==UserScript==
// @name               reddit.com - Click to Visit Old Reddit
// @namespace          a-pav
// @description        Replaces the 'rpan' button in header of new reddit.com with a link to old design of currently visiting page.
// @match              *://www.reddit.com/*
// @match              *://reddit.com/*
// @version            1.0
// @run-at             document-idle
// @author             a-pav
// @grant              none
// @icon               https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @downloadURL https://update.greasyfork.org/scripts/438003/redditcom%20-%20Click%20to%20Visit%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/438003/redditcom%20-%20Click%20to%20Visit%20Old%20Reddit.meta.js
// ==/UserScript==

// operates on new design.
var rpan_a = document.querySelector("a[href='/rpan/']");
if (rpan_a === null) {
	return
}

var url = "https://old.reddit.com" + window.location.pathname + window.location.search + window.location.hash

rpan_a.id = "link-to-old-reddit";
rpan_a.href = url;
rpan_a.getElementsByTagName("i")[0].className = "icon icon-community";

const handler = event => {
	event.stopPropagation();
	event.stopImmediatePropagation();
	event.preventDefault();
	window.location.href = url;
};
rpan_a.addEventListener('click', handler, true);
