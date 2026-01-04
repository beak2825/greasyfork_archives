// ==UserScript==
// @name         Skip Direct Link
// @namespace    https://www.facebook.com/dung.dev.gramer/
// @version      0.4
// @description  Goto website not waiting for Direct Website
// @author       DungGramer
// @include      /((https|http)%)/
// @include      /^(facebook|google|github|linkedin)/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415253/Skip%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/415253/Skip%20Direct%20Link.meta.js
// ==/UserScript==

(function() {
	try {
		var newURL = window.location.href.match(/(url|href)\=http?s.+/)[0].match(/http?s.+/)[0];
		var directLink = decodeURIComponent(newURL.split(/.fbclid=\w+/).join(""));
		directLink = new URL(directLink);
		var question = window.confirm("Do you want go to: \n" + directLink); 
		if (question) window.location.href = directLink;
	} catch(e) {}
})();