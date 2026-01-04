// ==UserScript==
// @name          Chesstempo Hide Tactics Clock
// @namespace     http://userstyles.org
// @description   Hides Tactics Clock on Chesstempo
// @author        636597
// @include       *://*beta.chesstempo.com/chess-tactics/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/41071/Chesstempo%20Hide%20Tactics%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/41071/Chesstempo%20Hide%20Tactics%20Clock.meta.js
// ==/UserScript==

var clock_element = null;
function hideClock() {
    clock_element.setAttribute("style", "visibility: hidden !important");
    console.log( "ChessTemp Hide Clock Loaded" );
}

(function() {
    var ready = setInterval(function(){
        var x1 = document.querySelectorAll( '[role="timer"]' );
        if ( x1 ) { if ( x1[ 0 ] ) { clock_element = x1[0]; clearInterval( ready ); hideClock(); } }
    } , 2 );
})();