// ==UserScript==
// @name          Lichess Hide Homepage Timeline
// @namespace     http://userstyles.org
// @description   Hides Lichess Homepage Timeline Section
// @author        636597
// @include       *://*lichess.org/
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/374685/Lichess%20Hide%20Homepage%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/374685/Lichess%20Hide%20Homepage%20Timeline.meta.js
// ==/UserScript==

var lichess_timeline_class = "timeline";
var lichess_timeline_element = null;

function loadObserver() {
	lichess_timeline_element.setAttribute( "style" , "visibility: hidden !important" );
	console.log( "Lichess Hide Homepage Timeline Loaded" );
}

(function() {
	console.log( "Lichess Hide Homepage Timeline Initializing" )
	var ready = setInterval(function(){
		var x1 = document.getElementsByClassName( lichess_timeline_class );
		if ( x1 ) {
			lichess_timeline_element = x1[ 0 ];
			clearInterval( ready );
			loadObserver();
		}
	} , 2 );
	setTimeout( function() { clearInterval( ready ); } , 20000 );
})();