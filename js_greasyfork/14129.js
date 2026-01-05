// ==UserScript==
// @name        youtube_hide_videos
// @namespace   http://catherine.v0cyc1pp.com/youtube_hide_videos.user.js
// @include     https://www.youtube.com/*
// @author      greg10
// @run-at      document-start
// @license     GPL 3.0
// @version     1.1
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @description Hide videos on your top Youtube page.
// @downloadURL https://update.greasyfork.org/scripts/14129/youtube_hide_videos.user.js
// @updateURL https://update.greasyfork.org/scripts/14129/youtube_hide_videos.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

//================================
// Configurations
//   - specify texts you don't want to see.
var g_text = "衝撃ＷＯＲＬＤ, gameranx";
//================================




var nglist = g_text.split(",");


function main() {
	$("div.yt-lockup").each(function() {
		var str = $(this).text();
		//console.log("str="+str);

		for ( var i = 0; i < nglist.length; ++i) {
			var ngword = nglist[i];
			ngword = ngword.replace(/^\s+|\s+$/g, ""); 

			var obj = new RegExp( ngword, "i");
			var index = str.search( obj );
			//var index = str.indexOf( ngword );
			if ( index != -1 ) {
				$(this).parent("li").hide();
			}
		}
	});
}

var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe( document, config);
});
 
//var config = { attributes: true, childList: true, characterData: true, subtree:true }
var config = { childList: true, characterData: true, subtree:true }

observer.observe( document, config);

