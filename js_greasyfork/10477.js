// ==UserScript==
// @name        steamgifts.com sticky header
// @description Makes the nav bar at the top of steamgifts.com "sticky" - i.e., always at the top of the screen even if you scroll the page down
// @namespace   Barefoot Monkey
// @include     https://www.steamgifts.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10477/steamgiftscom%20sticky%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/10477/steamgiftscom%20sticky%20header.meta.js
// ==/UserScript==

// Sticky header
var style = document.createElement('style')
style.textContent = `header {
	 top: 0;
	 position: sticky;
	 z-index: 1;
 }
@supports ( not (position: sticky) ) {
	header {
		position: fixed;
        width: 100%;
	}
	html {
		padding-top: 39px;
	}
}`
document.head.appendChild(style)
