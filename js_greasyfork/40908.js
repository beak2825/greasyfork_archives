// ==UserScript==
// @name 		  Hides Chess.com Tactics Timer Clock
// @namespace     http://userstyles.org
// @description	  chessComHideTacticsTimerClock
// @author        ceberous
// @homepage      https://creatitees.info
// @include       *://*.chess.com/tactics/*
// @run-at        document-start
// @version       0.9
// @downloadURL https://update.greasyfork.org/scripts/40908/Hides%20Chesscom%20Tactics%20Timer%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/40908/Hides%20Chesscom%20Tactics%20Timer%20Clock.meta.js
// ==/UserScript==
var wDivClassesToHide = [
	"tactic-timer-container" ,
	"upgrade-to-remove-sidebar",
        "icon-circle-stop"
];
var wDiveIDsToHide = [
	"special-upgrade-sidebar" ,
];
function wHide() {
	var wElems = [];
	for ( var j = 0; j < wDivClassesToHide.length; ++j ) {
		var x11 = document.getElementsByClassName( wDivClassesToHide[ j ] );
		if ( !x11 ) { continue; }
		if ( !x11[0] ) { continue; }
		for ( var i = 0; i < x11.length; ++i ) { wElems.push( x11[ i ] ); }
	}
	for ( var j = 0; j < wDiveIDsToHide.length; ++j ) {
		var x11 = document.getElementById( wDiveIDsToHide[ j ] );
		if ( !x11 ) { continue; }
		wElems.push( x11 );
	}
	for ( var j = 0; j < wElems.length; ++j ) {
		wElems[ j ].setAttribute( "style" , "visibility: hidden !important" );
    }
    var no_text = document.getElementsByClassName( "info-label-label" );
    if ( no_text ) {
          if ( no_text[ 0 ] ) {
               no_text[ 0 ].textContent="BlessRNG";
          }
    }
}
(function() {
	wHide();
	setTimeout( function() { wHide(); } , 1000 );
	setTimeout( function() { wHide(); } , 2000 );
	setTimeout( function() { wHide(); } , 3000 );
	setTimeout( function() { wHide(); } , 4000 );
	setTimeout( function() { wHide(); } , 5000 );
})();