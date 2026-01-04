// ==UserScript==
// @name        Vimeo - Disable Autoplay
// @namespace   https://openuserjs.org/
// @description Disable autoplay on Vimeo everywhere
// @include     https://vimeo.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30814/Vimeo%20-%20Disable%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/30814/Vimeo%20-%20Disable%20Autoplay.meta.js
// ==/UserScript==

document.addEventListener('DOMNodeInserted', function() {
	if ( (document.getElementsByClassName("js-title").length > 0) || (document.getElementsByClassName("iris_link").length > 0) ) {
		var vids = document.querySelectorAll("a.js-title, a.iris_link, a.iris_link-box, ol.js-browse_list li > a");
		
		for (var i = 0; i < vids.length; i++) {
			if (vids[i].href.match(/autoplay=1/i)) {
				vids[i].href = vids[i].href.replace("?autoplay=1", "");
			}
			if (!vids[i].href.match(/autoplay/i) && !vids[i].href.match(/\/user/i) && !vids[i].href.match(/\/forums/i) && !vids[i].href.match(/javascript/i) && !vids[i].href.match(/#language/i)) {
				vids[i].href = vids[i].href + "?autoplay=0";
				vids[i].setAttribute("rel", "nofollow noopener noreferrer");
			}
		}
	}
}, false);