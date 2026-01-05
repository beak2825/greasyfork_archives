// ==UserScript==
// @name        pr0color for News-sites
// @namespace   de.pottii
// @description Changes the color of news-sites according to the pr0gramm colors
// @include     *
// @grant       GM_addStyle
// @version     1.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/18283/pr0color%20for%20News-sites.user.js
// @updateURL https://update.greasyfork.org/scripts/18283/pr0color%20for%20News-sites.meta.js
// ==/UserScript==

$(document).ready(function(){
	$(document).bind('keypress', function(e) {
		if(e.which == 75 && e.shiftKey) {
			GM_addStyle("* {color:#ee4d2e !important; background-color: #161618 !important;}");
		}
	});
});