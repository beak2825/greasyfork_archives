// ==UserScript==
// @name	PGAN - No Ads
// @namespace	pogoalerts.net
// @author	pgan-nerd
// @description	Remove the ads from pgan since they want to run more than one 
// @license	Creative Commons Attribution License
// @version	0.2.1
// @include	https://*.pogoalerts.net/*
// @released	2018-01-27
// @updated	2018-01-27
// @compatible	Greasemonkey
// @require	http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/37872/PGAN%20-%20No%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/37872/PGAN%20-%20No%20Ads.meta.js
// ==/UserScript==

(function(){
	var $ads = $('.adsbygoogle');
	if($ads.length > 1)
		$('.adsbygoogle').parent().css('position', 'relative').css('left', '-8000px');
})($);