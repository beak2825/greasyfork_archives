// ==UserScript==
// @name        Wanikani Egg Timer
// @namespace   wkeggtimer
// @description Adds a timer during reviews and displays the final time afterward
// @include     http://www.wanikani.com/review*
// @include     https://www.wanikani.com/review*
// @version     0.4
// @author      Horus Scope
// @grant	none
// @license     GPL version 3 or later: http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/16316/Wanikani%20Egg%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/16316/Wanikani%20Egg%20Timer.meta.js
// ==/UserScript==

function timeStamp( inc ) {
	var prev = parseInt(window.localStorage.eggtimer,10) + inc;
	window.localStorage.eggtimer = prev;
	//  Yes, parseInt is prettier.
	var hours = Math.floor(prev / 60 / 60);
	var minutes = Math.floor( (prev - (hours*60*60)) / 60 );
	var seconds = prev - hours*60*60 - minutes*60;
	return ""
	  + (hours? hours+"h " : "")
	  + (minutes? minutes+"m " : "")
	  + (seconds? seconds+"s" : "");
}
var timeSpan; // referenced in go( )
function generate(  ) {
	var display = document.createElement('div');
	display.className = 'timerSessionDisplay'; // no style actually defined
	timeSpan = document.createElement('span');
	timeSpan.className = 'timerSessionSpan'; // no style actually defined
	timeSpan.textContent = "Last review: " + timeStamp( 0 );
	display.appendChild(timeSpan);
	return display;
}

// start counting. [or, dont]
function go( )
{
	// change behavior depending on screen [summary, reviewing now]
	if(/session$/.exec(window.location.href)) { // review/session [ reviewing now ]
		window.localStorage.eggtimer = 0; // time start
		var header = document.getElementById('summary-button'); // because easy
		var display = generate( ); // makes div object
		header.appendChild( display );

		var showHideButton = document.createElement('div');
		var footer = document.getElementsByTagName('footer');
		showHideButton.onclick = function( ) {
			var displayTimer = window.localStorage.displayTimer;
			if( displayTimer === null || typeof displayTimer === "undefined" ) {
				displayTimer = false;
			} else {
				displayTimer = (displayTimer == "true" ? false : true);
			}
			window.localStorage.displayTimer = displayTimer;
			timeSpan.style.cssText = displayTimer ? "display: inline;" : "display: none;";
			console.log("pressed");
		};
		showHideButton.style.cssText = "background-color: #003377; color: white; cursor: pointer;"
			+ "display: inline; float: left; font-size: 0.8125em; padding: 10px; vertical-align: bottom;";
		showHideButton.textContent = "Show/hide Timer";
		footer[0].appendChild( showHideButton );
		timeSpan.style.cssText = window.localStorage.displayTimer == "false" ? "display: none" : "display: inline";
		setInterval(function() {timeSpan.textContent = "Elapsed: " + timeStamp( 1 );}, 1000);
	} else { // review [ summary screen ]
		var footer = document.getElementById('last-session-date'); // makes sense
		var display = generate( );
		footer.insertBefore(display, footer.childNodes[0]); // probably float:left btw
	}
}

window.onload = go( );