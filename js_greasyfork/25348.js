// ==UserScript==
// @name        Twitter Original Image
// @description Add ":orig" to twitter images.
// @namespace   eight04.blogspot.com
// @include     https://twitter.com/*
// @version     0.1.2
// @license		MIT
// @supportURL	https://github.com/eight04/twitter-original-image/issues
// @compatible	Firefox
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25348/Twitter%20Original%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/25348/Twitter%20Original%20Image.meta.js
// ==/UserScript==

var replace
if (location.hostname == "twitter.com") {	
	replace = () => {
		var imgs = document.querySelectorAll("#permalink-overlay .AdaptiveMedia img"),
			img;
		
		for (img of imgs) {
			if (!img.src.endsWith(":orig")) {
				img.src += ":orig";
			}
		}
	};
	
	replace();

	new MutationObserver(replace).observe(document.querySelector("#permalink-overlay"), {
		childList: true,
		subtree: true
	});
} else {
	replace = () => {
		var img, match;
		for (img of document.images) {
			if ((match = img.src.match(/\/\/pbs\.twimg\.com\/media\/([a-z0-9]+)\.(jpg|gif|png)(:[a-z]+)?/i))) {
				if (match[3] == ":orig") continue;
				img.src = `//pbs.twimg.com/media/${match[1]}.${match[2]}:orig`;
			}
		}
	};
	
	replace();
	
	new MutationObserver(replace).observe(document.body, {
		childList: true,
		subtree: true
	});
}
