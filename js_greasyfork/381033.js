// ==UserScript==
// @name          Lichess Auto Add Time
// @namespace     http://userstyles.org
// @description   Automatically Adds Time to Opponenents Clock To Keep Game Going
// @author        636597
// @include       https://lichess.org/*
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/381033/Lichess%20Auto%20Add%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/381033/Lichess%20Auto%20Add%20Time.meta.js
// ==/UserScript==


// Doesn't Check yet if board is "Flipped" , so thats going to be a problem

var locked = false;
var opponent_clock_element = null;
var more_time_element = null;
var opponent_clock_observer = null;
var observerConfig = {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
};

(function(){

	function add_3_time() {
		if ( locked ) { return; }
		locked = true;
		console.log( "Trying to Add Time");
		more_time_element.click();
		setTimeout( function() {
			more_time_element.click();
		} , 300 );
		setTimeout( function() {
			more_time_element.click();
			locked = false;
		} , 300 );
	}

	function observe_clock() {
		opponent_clock_observer = new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation , index ) {
				if ( mutation.target.className === "time" ) {
					if ( mutation.addedNodes.length === 4 ) {
						var minutes = parseInt( mutation.addedNodes[ 0 ].data );
						var seconds = parseInt( mutation.addedNodes[ 2 ].data );
						if ( minutes < 1 ) {
							if ( seconds < 10 ) {
								//console.log( "Opponent's Time Low === " + minutes.toString() + " :: " + seconds.toString() );
								add_3_time();
								return;
							}
						}
					}
				}
			});
		});
		opponent_clock_observer.observe( opponent_clock_element , observerConfig );
	}

	function wait_for_clock() {
		var ready = setInterval(function(){
			var x1 = document.getElementsByClassName( "rclock-top" )
			if ( x1 ) {
				if ( x1[ 0 ] ) {
					opponent_clock_element = x1[ 0 ];
					more_time_element = document.getElementsByClassName( "moretime" );
					if ( more_time_element ) {
						if ( more_time_element[ 0 ] ) {
							more_time_element = more_time_element[ 0 ];
							clearInterval( ready );
							observe_clock();
						}
					}
				}
			}
		} , 2 );
		setTimeout( function() { clearInterval( ready ); } , 20000 );
	}

	window.addEventListener ( "load" , wait_for_clock );
})();