// ==UserScript==
// @name          Hide Perusall Avatars
// @namespace     http://userstyles.org
// @description   Hides Fucking God Damn Avatars from Blinking Like Traffic Lights When Just Trying to Read a God Damn Textbook
// @author        12357213
// @include       *://app.perusall.com/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/406074/Hide%20Perusall%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/406074/Hide%20Perusall%20Avatars.meta.js
// ==/UserScript==

var user_bar = false;
function hide_avatars() {
	user_bar.setAttribute( "style" , "visibility: hidden !important" );
}


// Init
(function() {
	var ready = setInterval(function(){
		user_bar = document.querySelector( "#active-users" );
		if ( user_bar ) { clearInterval( ready ); hide_avatars(); }
	} , 2 );
	setTimeout( function() {
		clearInterval( ready );
	} , 10000 );
})();