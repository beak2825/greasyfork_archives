// ==UserScript==
// @name         reddit Karma Hider
// @namespace    https://github.com/kittenparry/
// @version      1.2
// @description  Hide karma of posts & comments.
// @author       kittenparry
// @include      *://*.reddit.com/*
// @include      *://reddit.com/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/391622/reddit%20Karma%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/391622/reddit%20Karma%20Hider.meta.js
// ==/UserScript==

/* CHANGELOG:
 * 1.2:   also hide upvoted comment karma, including own comments
 * 1.1:   also hide it on post details right-hand side
 * 1.0:   initial | hide karma on comments and posts
 */

(() => {
	let css = '.midcol .score, .linkinfo .score { visibility: hidden; } .tagline .score, .tagline .score.likes { display: none; }';
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		let node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		let heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			document.documentElement.appendChild(node);
		}
	}
})();
