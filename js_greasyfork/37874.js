// ==UserScript==
// @name	PGAN - Remove Discord Initial Overlay
// @namespace	pogoalerts.net
// @author	pgan-nerd
// @description	Remove the initial discord pop up (why they don't set a cookie for 300+ days to just hide this after first view is beyond me)
// @license	Creative Commons Attribution License
// @version	0.1.3
// @include	https://*.pogoalerts.net/*
// @released	2018-01-27
// @updated	2018-01-27
// @compatible	Greasemonkey
// @require	http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/37874/PGAN%20-%20Remove%20Discord%20Initial%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/37874/PGAN%20-%20Remove%20Discord%20Initial%20Overlay.meta.js
// ==/UserScript==

(function(){
	var attemptRemoval = function(){
		var $motd = $('#motd');
		if($motd.length > 0)
			$('#motd').parent().find('.ui-dialog-titlebar-close').click();
		else
			setTimeout(attemptRemoval, 250);
	};
	setTimeout(attemptRemoval, 350);
})($);