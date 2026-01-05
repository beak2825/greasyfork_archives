// ==UserScript==
// @name            Video Repubblica in HTML5
// @name:it         Video Repubblica in HTML5
// @namespace       http://andrealazzarotto.com/
// @version         1.1.2
// @description     Watch MP4 videos on the Repubblica.it website with a HTML5 container
// @description:it  Guarda i video su Repubblica.it in MP4 con un contenitore HTML5
// @author          Andrea Lazzarotto
// @match           http://video.repubblica.it/*
// @match           https://video.repubblica.it/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/18204/Video%20Repubblica%20in%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/18204/Video%20Repubblica%20in%20HTML5.meta.js
// ==/UserScript==

$(document).ready(function() {
	var contentURL = $("script[type*='ld+json']").text().split('contentUrl')[1].split('"')[2] || false;
	if(!!contentURL && contentURL.indexOf('.mp4') > 0) {
		$('#playerCont').empty().append('<video src="' + contentURL + '" controls width="100%" height="100%"></video>');
    }
});