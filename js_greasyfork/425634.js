// ==UserScript==
// @name         Sirhurt Hider
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tired of seeing Sirhurt threads? Here's your solution
// @author       HyperNite
// @match        *://v3rmillion.net/*
// @icon         https://www.google.com/s2/favicons?domain=v3rmillion.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425634/Sirhurt%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/425634/Sirhurt%20Hider.meta.js
// ==/UserScript==
(function() {
	'use strict';

	var elementsArray = document.getElementsByClassName("subject_new");
	for (var i = 0; i < elementsArray.length; i++) {
		var content = elementsArray.item(i).textContent.toLowerCase();
		if (content.includes("sirhurt")) {
			let toRemove = elementsArray.item(i).parentElement.parentElement.parentElement.parentElement;
			toRemove.parentNode.removeChild(toRemove);
		}
	}
	(function() {
		'use strict';

		var elementsArray = document.getElementsByClassName("subject_old");
		for (var i = 0; i < elementsArray.length; i++) {
			var content = elementsArray.item(i).textContent.toLowerCase();
			if (content.includes("sirhurt")) {
				let toRemove = elementsArray.item(i).parentElement.parentElement.parentElement.parentElement;
				toRemove.parentNode.removeChild(toRemove);
			}
		}
	})()
})();