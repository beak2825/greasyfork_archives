// ==UserScript==
// @name         GGn :: Hide Stickied Torrents
// @namespace    https://greasyfork.org/en/scripts/370796-ggn-hide-stickied-torrents
// @version      1.1
// @description  Hides the stickied torrents at the top of the torrents page.
// @author       newstarshipsmell
// @match        https://gazellegames.net/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370796/GGn%20%3A%3A%20Hide%20Stickied%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/370796/GGn%20%3A%3A%20Hide%20Stickied%20Torrents.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var stickies = document.querySelectorAll('tr.sticky');
	for (var i = stickies.length; i--;) stickies[i].classList.add("hidden");
})();