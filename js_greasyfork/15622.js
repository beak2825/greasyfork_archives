// ==UserScript==
// @name        Komica - Unembed Youtube
// @version     0.1.1
// @namespace   eight04.blogspot.com
// @description Open youtube in new tab instead of playing directly when clicking on the video.
// @include     http://*mykomica.org/*
// @include		http://*.mymoe.moe/*
// @grant       none
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @downloadURL https://update.greasyfork.org/scripts/15622/Komica%20-%20Unembed%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/15622/Komica%20-%20Unembed%20Youtube.meta.js
// ==/UserScript==

var i, m, ytplayers;

ytplayers = document.querySelectorAll(".ytplayer");

for (i = 0; i < ytplayers.length; i++) {
	if ((m = ytplayers[i].parentNode.href.match(/ytclick\('([^']+)'.+?\)/))) {
		ytplayers[i].parentNode.href = "https://www.youtube.com/watch?v=" + m[1];
		ytplayers[i].parentNode.target = "_blank";
	}
}
