// ==UserScript==
// @name         TechId display
// @description  TechId display on emp stg
// @include      https://stg-int-empcontactmanager.mediacomcorp.com/ContactManager.Web/Admin/IntentTraining
// @version 0.0.1.20250217124328
// @namespace https://greasyfork.org/users/843175
// @downloadURL https://update.greasyfork.org/scripts/527214/TechId%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/527214/TechId%20display.meta.js
// ==/UserScript==

(function() {
	let digits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
	let d = digits.join('|');
	let regex = new RegExp(`\\b((${d}) )*(${d})\\b`, 'g');
	setInterval(() => {
		let walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
		while(walker.nextNode())
			walker.currentNode.textContent = walker.currentNode.textContent.replaceAll(regex, function (x) {
				return x.split(' ').map(y => digits.indexOf(y)).join('');
			});
	}, 1000);
})();