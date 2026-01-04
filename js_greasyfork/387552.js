// ==UserScript==
// @name          Chess Com Live Hide Usernames
// @namespace     http://userstyles.org
// @description   Hides Usernames
// @author        636597
// @include       *://*.chess.com/live*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/387552/Chess%20Com%20Live%20Hide%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/387552/Chess%20Com%20Live%20Hide%20Usernames.meta.js
// ==/UserScript==

function delay_call( function_pointer , delay_time ) {
	setTimeout( function() {
		function_pointer();
	} , delay_time );
}

var css_selectors_hide = [
	"a.username" ,
	"span.username"
];

function hide_stuff() {
	try {
		for ( var i = 0; i < css_selectors_hide.length; ++i ) {
			//console.log( "Hiding: " + css_selectors_hide[ i ] );
			var elements = document.querySelectorAll( css_selectors_hide[ i ] );
			for ( var j = 0; j < elements.length; ++j  ) {
				elements[ j ].innerText = "";
			}
		}
	}
	catch( error ) { /* console.log( error ); */ }
}

var events_table_element = false;
var top_players_table_element = false;
var events_table_observer = false;
var top_players_table_observer = false;
var observerConfig = {
	childList: true,
	attributes: true,
	characterData: true,
	subtree: true,
	attributeOldValue: true,
	characterDataOldValue: true
};

function observe_events_table() {
	hide_stuff();
	events_table_element = document.querySelector( "div[data-tab-content='events']" );
	if ( !events_table_element ) {
		console.log( "No Events Table ??" );
		return;
	}
	events_table_observer = new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation , index ) {
			if ( mutation.type === "childList" ) {
				if ( mutation.addedNodes ) {
					if ( mutation.addedNodes[ 0 ] ) {
						if ( mutation.addedNodes[ 0 ].className ) {
							if ( mutation.addedNodes[ 0 ].className === "events-list-row" ) {
								//console.log( "New User Added" );
								// var children = mutation.addedNodes[ 0 ].children;
								// var white = black = false;
								// for ( var i = 0; i < children.length; ++i ) {
								// 	if ( children[ i ].className === "events-list-black" ) {
								// 		black = children[ i ]
								// 	}
								// 	if ( children[ i ].className === "events-list-white" ) {
								// 		white = children[ i ]
								// 	}
								// }
								// if ( white ) {
								// 	white.childNodes[ 0 ].innerText = "";
								// }
								// if ( black ) {
								// 	black.childNodes[ 0 ].innerText = "";
								// }
								hide_stuff();
							}
						}
					}
				}
			}
			//console.log( mutation );
		});
	});
	events_table_observer.observe( events_table_element , observerConfig );
	console.log( "Observing Events Table" );
}

function observe_top_players_table() {
	hide_stuff();
	top_players_table_element = document.querySelector( "div[data-tab-content='players']" );
	if ( !top_players_table_element ) {
		console.log( "No Top Players Table ??" );
		return;
	}
	top_players_table_observer = new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation , index ) {
			// if ( mutation.type === "childList" ) {
			// 	if ( mutation.addedNodes ) {
			// 		if ( mutation.addedNodes[ 0 ] ) {
			// 			if ( mutation.addedNodes[ 0 ].className ) {
			// 				if ( mutation.addedNodes[ 0 ].className === "events-list-row" ) {
			// 					console.log( "New User Added" );
			// 					// var children = mutation.addedNodes[ 0 ].children;
			// 					// var white = black = false;
			// 					// for ( var i = 0; i < children.length; ++i ) {
			// 					// 	if ( children[ i ].className === "events-list-black" ) {
			// 					// 		black = children[ i ]
			// 					// 	}
			// 					// 	if ( children[ i ].className === "events-list-white" ) {
			// 					// 		white = children[ i ]
			// 					// 	}
			// 					// }
			// 					// if ( white ) {
			// 					// 	white.childNodes[ 0 ].innerText = "";
			// 					// }
			// 					// if ( black ) {
			// 					// 	black.childNodes[ 0 ].innerText = "";
			// 					// }
			// 					hide_stuff();
			// 				}
			// 			}
			// 		}
			// 	}
			//}
			//console.log( mutation );
			hide_stuff();
		});
	});
	top_players_table_observer.observe( top_players_table_element , observerConfig );
	console.log( "Observing Top Players Table" );
}

var events_button_element = false;
var top_players_button_element = false;
function hook_button_clicks() {
	events_button_element.addEventListener( "click" , function() {
		hide_stuff();
		events_table_observer = false;
		delay_call( observe_events_table , 500 );
	});
	top_players_button_element.addEventListener( "click" , function() {
		hide_stuff();
		top_players_table_observer = false;
		delay_call( observe_top_players_table , 500 );
	});
}

function init() {
	hide_stuff();
	hook_button_clicks();
}

var wait_for_buttons_interval = false;
function wait_for_buttons() {
	wait_for_buttons_interval = setInterval( function() {
		events_button_element = document.querySelector( "li[data-tab='events'" );
		top_players_button_element = document.querySelector( "li[data-tab='players'" );
		console.log( events_button_element );
		console.log( top_players_button_element );
		if ( events_button_element && top_players_button_element ) {
			clearInterval( wait_for_buttons_interval );
			// Button Observers Are Now Ready To Be Loaded
			init();
			//events_button_element.click();
			//delay_call_wait_events_table();
		}
	} , 500 );
	setTimeout( function() {
		clearInterval( wait_for_buttons_interval );
	}, 10000 );
}

( function() {
	window.addEventListener ( "load" , wait_for_buttons );
})();