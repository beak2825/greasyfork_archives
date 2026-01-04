// ==UserScript==
// @name			Unshrink Avs on ComicVine
// @namespace		https://izaiah.carrd.co/
// @version			0.1755463468557
// @description		Make avatars (user icons) less small, more visible.
// @author			Izaiah Thera
// @license MIT
// @match			https://comicvine.gamespot.com/forums/*
// @icon			https://comicvine.gamespot.com/a/bundles/comicvinesite/images/favicon.ico
// @grant			GM_addStyle
// @grant			GM_xmlhttpRequest
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/546203/Unshrink%20Avs%20on%20ComicVine.user.js
// @updateURL https://update.greasyfork.org/scripts/546203/Unshrink%20Avs%20on%20ComicVine.meta.js
// ==/UserScript==

var $ = window.jQuery;
var jQuery = window.jQuery;
this.$ = this.jQuery = jQuery.noConflict(true);

setTimeout(function(){
	if (window.top != window.self) { return; }
	if ($('.js-message').length) {
		//If the page is a thread (containing at least one .js-message element), do the following...

		$('html').eq(0).append($('<style type="text/css">' + $css + '</style>'));
		//Add the CSS styles.

		$('.js-avatar-user.avatar-user-container > a > img').each(function(i,e){
			// For each avatar on the page, do the following...

			var $src = e.src;
			// URL of the icon-sized image.

			var $sqrsrc = $src.replace('/square_avatar/','/square_medium/');
			// URL of a larger-sized version of the image.

			e.src = $sqrsrc;
			// Swaps the image URL.
		});
	}
}, 500);

var $css = [`
.js-avatar-user.avatar-user-container {
	width: unset;
}
.js-avatar-user.avatar-user-container > a {
	display: block;
}
.avatar-user-container img {
	border-radius: 10%;
	width: 100px;
	height: 100px;
	max-width: unset;
	display: block;
}
.message .message-wrap {
	margin-left: 115px;
}
.avatar-user-container:hover .avatar-user-interaction {
	left: 90px;
}
`][0];