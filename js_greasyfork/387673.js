// ==UserScript==
// @name          Lichess User 'Enter' Key To Continiue Training
// @namespace     http://userstyles.org
// @description   Hooks 'Enter' key and Presses 'Continue Training' Button
// @author        636597
// @include       *://*lichess.org/*
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/387673/Lichess%20User%20%27Enter%27%20Key%20To%20Continiue%20Training.user.js
// @updateURL https://update.greasyfork.org/scripts/387673/Lichess%20User%20%27Enter%27%20Key%20To%20Continiue%20Training.meta.js
// ==/UserScript==

function try_click() {
	try{
		console.log( "Trying to Click 'Continue Training' Button" );
		var continue_button = document.querySelector( "a.continue" );
		if ( !continue_button ) { return; }
		continue_button.click();
	}
	catch( e ) { console.log( e ); }
}

function enter_keypress_handler( event ) {
	if ( event.key === "Enter" ) {
		try_click();
	}
}

function hook_enter_key() {
	console.log( "Re-Hooking 'Enter' Key" );
	try {
		document.body.removeEventListener( "keydown" , enter_keypress_handler );
	}
	catch( e ) { console.log( e ); }
	document.body.addEventListener( "keydown" , enter_keypress_handler );
}

var URL_STATE_IN_2019_INTERVAL = false;
var CURRENT_URL = false;
function observe_url_state() {
	if ( CURRENT_URL !== window.location.href ) {
		console.log( "URL State Changed" );
		CURRENT_URL = window.location.href;
		hook_enter_key();
	}
}

function init() {
	console.log( "Loading Next Puzzle 'Enter' Key Addin" );
	//hook_enter_key();
	URL_STATE_IN_2019_INTERVAL = setInterval( observe_url_state , 500 );
}

( function() {
	window.addEventListener ( "load" , init );
})();