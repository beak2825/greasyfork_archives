// ==UserScript==
// @name         yeti
// @version      .1
// @description  Hide instructions  hotkeys
// @author       ikarma
// @icon           http://www.mturkgrind.com/data/avatars/l/2/2601.jpg?1442882630
// @include     https://www.mturkcontent.com/dynamic/*
// @grant        none
// @namespace https://greasyfork.org/users/9054
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/16737/yeti.user.js
// @updateURL https://update.greasyfork.org/scripts/16737/yeti.meta.js
// ==/UserScript==
var requesterName = $( 'tr:contains(Requester:)' ).last().children().first().next().text().trim();


if ( requesterName == 'Yeti' ) {

$(".panel.panel-primary").hide();
$("#refImage").hide();
$("#comment-div").hide();

var $j = jQuery.noConflict(true);

document.addEventListener( "keydown", kas, false);
}


function kas(i) {   
	if ( i.keyCode == 65 || i.keyCode == 96 ) { //A or npad 0
		$j('input[name="WET_ROAD"]').eq(0).click();
		$j('input[id="submitButton"]').eq(0).click(); 
	}
	if ( i.keyCode == 83 || i.keyCode == 97 ) { //S or npad 1
		$j('input[name="WET_ROAD"]').eq(1).click(); 
		$j('input[id="submitButton"]').eq(0).click(); 
	}

	if ( i.keyCode == 68 || i.keyCode == 98 ) { //d or npad 2
		$j('input[name="WET_ROAD"]').eq(2).click(); 
		$j('input[id="submitButton"]').eq(0).click(); 
	}

	if ( i.keyCode == 70 || i.keyCode == 99 ) { //f or npad 3
		$j('input[name="WET_ROAD"]').eq(3).click(); 
		$j('input[id="submitButton"]').eq(0).click(); 
	}


}  
