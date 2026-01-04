// ==UserScript==
// @name          Twitch Auto Pause/Play Toggle for Tab Switch
// @namespace     http://userstyles.org
// @description   Pauses / Plays Video When Mouse Leaves Focus of Tab
// @author        636597
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       0.6
// @downloadURL https://update.greasyfork.org/scripts/389901/Twitch%20Auto%20PausePlay%20Toggle%20for%20Tab%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/389901/Twitch%20Auto%20PausePlay%20Toggle%20for%20Tab%20Switch.meta.js
// ==/UserScript==


var PLAYING = true;
var PAUSE_PLAY_BUTTON_ELEMENT = false;
var CHECKING_FOCUS = true;
var BUTTON_ELEMENT = false;

function toggleCheckFocus() {
	if ( CHECKING_FOCUS ) {
		console.log( "Stopping Observing the Focus" );
		clearObserver();
		if ( !PLAYING ) {
			PAUSE_PLAY_BUTTON_ELEMENT.click();
			PLAYING = true;
		}
		BUTTON_ELEMENT.innerHTML = "Observe Focus";
	}
	else {
		console.log( "Starting Observing the Focus" );
		loadObserver();
		BUTTON_ELEMENT.innerHTML = "Stop Observing Focus";
	}
	CHECKING_FOCUS = !CHECKING_FOCUS;
}
function addToggleCheckFocusButton() {
	//var title_element = document.querySelector( 'h2[data-a-target="stream-title"]' );
	var title_element = document.querySelector( 'div[data-test-selector="chat-input-buttons-container"' )
	if ( !title_element ) { return; }
	var id = "toggle-check-focus";
	var element_string = '<button id="' + id + '">Stop Observing Focus</button>';
	var template = document.createElement( "template" );
	template.innerHTML = element_string;
	title_element.insertBefore( template.content ,  title_element.childNodes[ title_element.childNodes.length - 1 ] );
	BUTTON_ELEMENT = document.body.querySelector( "#" + id );
	BUTTON_ELEMENT.addEventListener( "click" , function( event ) {
		toggleCheckFocus();
	});
}

// function checkFocus() {
// 	if ( document.hasFocus() ) {
// 		// console.log( "tab enter" );
// 		// console.log( "PLAYING === " + PLAYING );
// 		if ( !PLAYING ) {
// 			console.log( "Tab Entered: Toggling Play State" );
// 			PAUSE_PLAY_BUTTON_ELEMENT.click();
// 			PLAYING = true;
// 		}
// 	} else {
// 		// console.log( "tab leave" );
// 		// console.log( "PLAYING === " + PLAYING );
// 		if ( PLAYING ) {
// 			console.log( "Tab Left: Toggling Play State" );
// 			PAUSE_PLAY_BUTTON_ELEMENT.click();
// 			PLAYING = false;
// 		}
// 	}
// }

// Maybe It Be Converted to Observer Somehow
var observer_interval = false;
function clearObserver() {
	//clearInterval( observer_interval );
	document.removeEventListener( "mouseout" , mouseout_event_listener );
}
function mouseout_event_listener( e ) {
	e = e ? e : window.event;
	var from = e.relatedTarget || e.toElement;
	if ( !from || from.nodeName == "HTML" ) {
		if ( PLAYING ) {
			console.log( "Mouse Out: Toggling Play State" );
			PAUSE_PLAY_BUTTON_ELEMENT.click();
			PLAYING = false;
		}
	}
	else {
		if ( !PLAYING ) {
			console.log( "Mouse Entered: Toggling Play State" );
			PAUSE_PLAY_BUTTON_ELEMENT.click();
			PLAYING = true;
		}
	}
}
function loadObserver() {
	console.log( PAUSE_PLAY_BUTTON_ELEMENT );
	if ( !PAUSE_PLAY_BUTTON_ELEMENT ) { return; }
	//observer_interval = setInterval( checkFocus , 1000 );
	document.addEventListener( "mouseout" , mouseout_event_listener );
}

// Init
(function() {
	var ready = setInterval(function(){
		PAUSE_PLAY_BUTTON_ELEMENT = document.querySelector( 'button[data-a-target="player-play-pause-button"]' );
		if ( !PAUSE_PLAY_BUTTON_ELEMENT ) { return; }
		clearInterval( ready );
		addToggleCheckFocusButton();
		loadObserver();
	} , 2 );
	setTimeout( function() {
		clearInterval( ready );
	} , 10000 );
})();