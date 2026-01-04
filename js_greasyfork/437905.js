// ==UserScript==
// @name               reddit.com - Ensure 'old.reddit.com' URL.
// @namespace          a-pav
// @description        Always redirect to 'old.reddit.com'.
// @match              *://*.reddit.com/*
// @match              *://reddit.com/*
// @version            0.1
// @run-at             document-start
// @author             a-pav
// @grant              none
// @icon               https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @downloadURL https://update.greasyfork.org/scripts/437905/redditcom%20-%20Ensure%20%27oldredditcom%27%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/437905/redditcom%20-%20Ensure%20%27oldredditcom%27%20URL.meta.js
// ==/UserScript==

if(window.location.hostname === "old.reddit.com" ) { // already on old.reddit.com
	// script matches any reddit.com url, including 'old.reddit.com'.
	// this gives the option for quick enabling/disabling through script manager's icon, anywhere on reddit, wether using new or old design.
	return
}

window.location.replace("https://old.reddit.com" + window.location.pathname + window.location.search + window.location.hash);
