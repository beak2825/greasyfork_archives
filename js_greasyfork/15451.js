// ==UserScript==
// @name        ngc_video_link
// @namespace   http://catherine.v0cyc1pp.com/ngc_video_link.user.js
// @include     http://ch.nicovideo.jp/ch424
// @version     1.0
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @run-at      document-end
// @description NGCチャンネルのVIDEOリンクが「コメントが新しい順」になっているのを「投稿が新しい順」にします
// @downloadURL https://update.greasyfork.org/scripts/15451/ngc_video_link.user.js
// @updateURL https://update.greasyfork.org/scripts/15451/ngc_video_link.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

//console.log("start ngc_video_link");


$(".g-contents > a").each(function() {
	var str = $(this).attr("href");
	//console.log("orig str="+str);
	str += "&sort=f&order=d&type=video";
	//console.log("new str="+str);
	$(this).attr("href",str);
});


