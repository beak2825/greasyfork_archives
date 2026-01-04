// ==UserScript==
// @name         B2W Unlock Full Videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.blacktowhite.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409793/B2W%20Unlock%20Full%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/409793/B2W%20Unlock%20Full%20Videos.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function replace_urls() {
		var elems = document.getElementsByTagName("a");
		for (var i = 0; i < elems.length; i++)
			if (elems[i].href.includes("/media/") && elems[i].href.includes("/media/page") == false) {
				elems[i].href   = elems[i].href.concat('full');
				elems[i].target = "_blank";
			}
	}

	replace_urls();

})();