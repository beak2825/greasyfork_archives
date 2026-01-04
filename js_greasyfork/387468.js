// ==UserScript==
// @name          Lichess Auto Rematch
// @namespace     http://userstyles.org
// @description   Automatically Presses Rematch Button When Available
// @author        636597
// @include       https://lichess.org/*
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/387468/Lichess%20Auto%20Rematch.user.js
// @updateURL https://update.greasyfork.org/scripts/387468/Lichess%20Auto%20Rematch.meta.js
// ==/UserScript==

var spinner_count = 0;
function request_rematch() {
	console.log( "requesing rematch" );
	try {
		//lichess.socket.send( "rematch-yes" );
		var rematch_button = document.querySelector("button.rematch");
		rematch_button.click();
	}
	catch( e ) {}
}

var spam_interval = false;
function spam_request_rematch() {
	if ( spam_interval !== false ) { return; }
	console.log( "spaming request rematch" );
	spam_interval = setInterval( request_rematch , 1000 );
	setTimeout( function() {
		clearInterval( spam_interval );
		spam_interval = false;
	} , 60000 );
}

var rematch_button_element = false;
var rematch_button_observer = false;

var document_observer = false;
var parent_element = false;
var observerConfig = {
	childList: true,
	attributes: true,
	characterData: true,
	subtree: true,
	attributeOldValue: true,
	characterDataOldValue: true
};

function observe_rematch_button() {
	rematch_button_element = document.querySelector( "button.rematch" );
	if ( !rematch_button_element ) {
		console( "Could Not Find Rematch Button To Observe" );
		return;
	}
	rematch_button_observer = new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation , index ) {
			if ( mutation.type === "childList" ) {
				if ( mutation.removedNodes ) {
					if ( mutation.removedNodes[ 0 ] ) {
						if ( mutation.removedNodes[ 0 ].className ) {
							if ( mutation.removedNodes[ 0 ].className === "spinner" ) {
								spinner_count += 1;
								console.log( "Spinner Count == " + spinner_count.toString() );
								if ( spinner_count > 2 ) {
									console.log( "Someone Cancelled The Rematch" );
									console.log( "Re-Requesting Rematch" );
									request_rematch();
									spinner_count = 0;
								}
							}
						}
					}
				}
			}
			//console.log( mutation );
		});
	});
	rematch_button_observer.observe( rematch_button_element , observerConfig );
	console.log( "Observing Rematch Button" );
}

function observe_document() {
	parent_element = document.querySelector( "main.round" );
	console.log( parent_element );
	if ( !parent_element ) {
		console.log( "Could Not Find Parent Element to Observe" );
		return;
	}
	document_observer = new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation , index ) {
			if ( mutation.target.firstChild ) {
				if ( mutation.target.firstChild.className ) {
					if ( mutation.target.firstChild.className === "follow-up" ) {
						console.log( "Rematch Button Available" );
						request_rematch();
						observe_rematch_button();
					}
				}
			}
		});
	});
	document_observer.observe( parent_element , observerConfig );
	console.log( "Lichess Auto-Rematch Loaded" );
}

( function() {
	window.addEventListener ( "load" , observe_document );
})();