// ==UserScript==
// @name        yam
// @namespace   www.google.com
// @description doo doo head
// @include    http://rateyourmusic.com/boards*
// @include    http://rateyourmusic.com/board_message*
// @include    https://rateyourmusic.com/boards*
// @include    https://rateyourmusic.com/board_message*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5451/yam.user.js
// @updateURL https://update.greasyfork.org/scripts/5451/yam.meta.js
// ==/UserScript==				
// WARNING: EXTREMELY BUGGY! UTMOST CAUTION REQUIRED!
$('.mbgen td').each(function() {
  var cellText = $(this).html();    
	var mapObj = {
		gass:"bean",
		gaddis:"yam"
	};
	
	cellText = cellText.replace(/gass|gaddis/gi, function(matched){
		return mapObj[matched];
	});
	
	$(this).html(cellText);
});