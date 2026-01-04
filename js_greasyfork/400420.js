// ==UserScript==
// @name           PostLoadIMG - Kinoplay.me
// @name:ru        PostLoadIMG - Kinoplay.me
// @namespace      VictorDate Script
// @match          https://kinoplay.me/*
// @grant          none
// @version        1.0
// @author         victordate
// @description    12/04/2020, 4:12:32 AM
// @description:ru 12/04/2020, 4:12:32 AM
// @downloadURL https://update.greasyfork.org/scripts/400420/PostLoadIMG%20-%20Kinoplayme.user.js
// @updateURL https://update.greasyfork.org/scripts/400420/PostLoadIMG%20-%20Kinoplayme.meta.js
// ==/UserScript==

var path_to_backimg = "/img/no_poster.jpg";

jQuery(function($) {
		 $('[data-src]').hide();
   		 $('[data-src]').each(changeDataSrcToSrc);
		 $('[data-src]').fadeIn();
	});
	
$("img").error(function () {
		$(this).hide();
		$(this).unbind("error").attr("src", path_to_backimg);
		$(this).fadeIn();
});
