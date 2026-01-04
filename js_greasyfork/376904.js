// ==UserScript==
// @name          Chess Com Hide Upgrade Stuff
// @namespace     http://userstyles.org
// @description   Hides Upgrade Div Stuff
// @author        636597
// @include       /chess\.com
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/376904/Chess%20Com%20Hide%20Upgrade%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/376904/Chess%20Com%20Hide%20Upgrade%20Stuff.meta.js
// ==/UserScript==

var css_selectors_hide = [
	"a.diamond" ,
	"div.adblock-message" ,
    "div.upgrade-content" ,
    "div.short-sidebar-ad-top" ,
    "div.short-sidebar-ad-bottom" ,
];

function _hide_stuff() {
	try {

		var upgrade_text = document.querySelectorAll( "span.text" );
		for ( var j = 0; j < upgrade_text.length; ++j  ) {
			var x = upgrade_text[ j ].innerHTML;
			x = x.trim();
			x = x.toLowerCase();
			if ( x === "upgrade" ) {
				upgrade_text[ j ].style.visibility = "hidden";
			}
		}

		for ( var i = 0; i < css_selectors_hide.length; ++i ) {
			var elements = document.querySelectorAll( css_selectors_hide[ i ] );
			for ( var j = 0; j < elements.length; ++j  ) {
				elements[ j ].style.visibility = "hidden";
			}
		}

	}
	catch( error ) { console.log( error ); }
}

var hide_interval = null;
function hide_stuff() {
	hide_interval = setInterval( _hide_stuff , 50 );
	setTimeout( function() {
		clearInterval( hide_interval );
	}, 3000 );
}

hide_stuff();
window.addEventListener ( "load" , _hide_stuff );