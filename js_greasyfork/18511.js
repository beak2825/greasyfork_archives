// ==UserScript==
// @name         Greasy Fork | main page redirect to userpage
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  try to take over the world!
// @author       You
// @include      https://greasyfork.org/en
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18511/Greasy%20Fork%20%7C%20main%20page%20redirect%20to%20userpage.user.js
// @updateURL https://update.greasyfork.org/scripts/18511/Greasy%20Fork%20%7C%20main%20page%20redirect%20to%20userpage.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	if($('.user-profile-link a').length){
		var href = $('.user-profile-link a').get(0).href;
		var sortHref = href+(href.indexOf('?') > 0 ? '' : '?sort=updated');

		$('a[href="'+href+'"]').each(function(){
			$(this).prop('href', sortHref);
		});

		location.replace(sortHref);
	}
});