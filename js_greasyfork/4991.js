// ==UserScript==
// @name        UselessScript#1
// @namespace   www.google.com
// @description Change some words to fruits because why not
// @include    http://rateyourmusic.com/boards*
// @include    http://rateyourmusic.com/board_message*
// @include    https://rateyourmusic.com/boards*
// @include    https://rateyourmusic.com/board_message*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4991/UselessScript1.user.js
// @updateURL https://update.greasyfork.org/scripts/4991/UselessScript1.meta.js
// ==/UserScript==			
// WARNING: EXTREMELY BUGGY! UTMOST CAUTION REQUIRED!
$('.mbgen td').each(function() {
  var cellText = $(this).html();    
	var mapObj = {
		objective:"mango",
		subjective:"pineapple"
	};
	
	cellText = cellText.replace(/objective|subjective/gi, function(matched){
		return mapObj[matched];
	});
	
	$(this).html(cellText);
});