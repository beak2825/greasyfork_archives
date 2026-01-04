// ==UserScript==
// @name         Reddit Icon Redirect
// @namespace    https://github.com/cubedj/GM-Scripts
// @version      1.2
// @description  Simple script that changes the favicon of Reddit for a custom one...
// @author       cubedj <djcube21@gmail.com>
// @include      https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37449/Reddit%20Icon%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/37449/Reddit%20Icon%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var links,thisLink;
	links = document.evaluate("//link[@href]",
							  document,
							  null,
							  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
							  null);
	for (var i=0;i<links.snapshotLength;i++) {
		var thisLink = links.snapshotItem(i);

		thisLink.href = thisLink.href.replace('https://www.redditstatic.com/favicon.ico',
                                       //   'chrome-extension://emikjkncggdedmnihaeopiegkhpojhdb/reddit_favicon.ico');
											'http://www.dj-cube.wz.cz/reddit_favicon.ico');
	}
})();