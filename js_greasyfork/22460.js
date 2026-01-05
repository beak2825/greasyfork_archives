// ==UserScript==
// @name         [WorldWideTorrents.eu] Fix JS Quoting
// @namespace    pxgamer
// @version      0.2.0
// @description  Fixes quoting in the Javascript by escaping the single quotes in the function calls.
// @author       pxgamer
// @include      http*://*worldwidetorrents.eu*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22460/%5BWorldWideTorrentseu%5D%20Fix%20JS%20Quoting.user.js
// @updateURL https://update.greasyfork.org/scripts/22460/%5BWorldWideTorrentseu%5D%20Fix%20JS%20Quoting.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
	'use strict';

	function escapeHtml (text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	const reg = /(javascript:SmileIT\(\'\[quote\=)([\s\S]+?)(\[\/quote\]\',[\s\S]+?\'Form\',[\s\S]+?\'body\'\);)/i;
	$('a[href^="javascript:SmileIT("]').each(function(){
		let url   = $(this).attr('href');
		let match = reg.exec(url);
		console.log(match);
		if (match !== null) {
			let match1 = match[2];
			let match2 = match[2].replace(/\'/g, "\\'");
			$(this).attr('href', url.replace(match1, match2));
		}
	});
})();
