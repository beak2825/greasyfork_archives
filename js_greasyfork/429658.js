// ==UserScript==
// @name         Rickroll Saver
// @namespace    http://tampermonkey.net/
// @version      1.54
// @description  You're welcome! ;)
// @author       Manav Malik
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429658/Rickroll%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/429658/Rickroll%20Saver.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var thorough = 1;
	var title = document.title;
	var block = ["rickroll", "Rickroll", "rick-roll", "Rick-roll", "Never Gonna Give You Up", "never gonna give you up", "Rick Astley", "rick astley", "Rickrolling", "rickrolling"];
	var blocked = false;
	for (var i = 0; i < thorough; i++) {
		for (var j = 0; j < block.length; j++) {
			if (document.title.includes(block[j])) blocked = true;
		}
	}
	if (blocked) {
		var go = confirm("Woah, there! Someone may be trying to rickroll you! Press OK to stop rickroll or Cancel to allow rickrolling...\nRickrolling prevented by Rickroll Saver by Manav Malik.");
		if (go) window.open("https://rickroll-saved.manavmalik.repl.co/saved", "_self");
	}
})();