// ==UserScript==
// @name         1920.in Mail Spammer
// @namespace    https://www.kixxu.gq
// @version      1.3.3.7
// @description  Userscript for spamming button on mail.1920.in
// @author       kixxu#5045
// @match        mail.1920.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441867/1920in%20Mail%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/441867/1920in%20Mail%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var clicker = function () {
		var e = document.querySelectorAll('button')[Math.random() * 100 >= 50 ? 0 : 1];
		if (e) {
			console.log("Clicked", e);
			e.click();
		}
	};
	window.setInterval(clicker, 300);
})();