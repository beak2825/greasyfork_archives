// ==UserScript==
// @name               reddit.com - Expand Dropdowns by Hover
// @namespace          a-pav
// @description        Hover on 'sorted by:' and 'links from:' dropdowns to expand them, move the mouse away for close. Avoid one unnecessary click.
// @match              *://*.reddit.com/*
// @match              *://reddit.com/*
// @version            1.0
// @run-at             document-end
// @author             a-pav
// @grant              none
// @icon               https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-76x76.png
// @downloadURL https://update.greasyfork.org/scripts/437904/redditcom%20-%20Expand%20Dropdowns%20by%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/437904/redditcom%20-%20Expand%20Dropdowns%20by%20Hover.meta.js
// ==/UserScript==

// operates on old design.
document.querySelectorAll("div.menuarea>div.spacer>div.dropdown.lightdrop")
	.forEach(function(elm) { 
		elm.addEventListener('mouseenter', function(event) {
			// 'open_menu' function is from reddit.com
			open_menu(event.target);
		});

		elm.nextSibling.addEventListener('mouseleave', function(event) {
			this.classList.remove("inuse");
		});
	});
