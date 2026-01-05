// ==UserScript==
// @name        1337x torrent cover view
// @namespace   1337x
// @description poster shower
// @include     http*://*1337x*
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/14642/1337x%20torrent%20cover%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/14642/1337x%20torrent%20cover%20view.meta.js
// ==/UserScript==

$('ul.clearfix li div.coll-1 strong a').each(function(index, value) { 
	$( this ).append($('<div>').load(value.href+' .bbcode-text img'));	
	$('.descrimg').css('max-height','30px');
});