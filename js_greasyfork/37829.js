// ==UserScript==
// @name         Close Stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://backpack.tf/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37829/Close%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/37829/Close%20Stats.meta.js
// ==/UserScript==

	window.onkeyup = function (event) {
		if (event.keyCode == 39) {
			window.close ();
		}
	};