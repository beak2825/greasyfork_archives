// ==UserScript==
// @name          Lichess Hide Ratings Usernames and Watchers Area
// @namespace     http://userstyles.org
// @description   Hides Ratings , Usernames , Tournament Position , and Watchers Area During Matches
// @author        636597
// @include       https://lichess.org/*
// @run-at        document-start
// @version       1.5
// @downloadURL https://update.greasyfork.org/scripts/375947/Lichess%20Hide%20Ratings%20Usernames%20and%20Watchers%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/375947/Lichess%20Hide%20Ratings%20Usernames%20and%20Watchers%20Area.meta.js
// ==/UserScript==

document.title = "";

var title_element = null;
var title_observer = null;
var observerConfig = {
	attributes: true,
	childList: true,
	characterData: true
};

// Lichess V2

var css_selectors_to_hide = [
    ".game__meta__players",
	".ruser-top a" ,
    ".ruser-bottom a",
	".ruser-top rating" ,
    ".ruser-bottom rating",
];

var css_selectors_to_remove = [
    ".crosstable__users",
];

// Lichess V1
/*
var css_selectors_to_hide = [
	".tournament_rank" ,
	"div.under_chat" ,
	".user" ,
	"div.username" ,
	".players" ,
	"rating" ,
];
*/

var hide_interval = null;
function _hide_stuff() {
	try {
		for ( var i = 0; i < css_selectors_to_hide.length; ++i ) {
			var elements = document.querySelectorAll( css_selectors_to_hide[ i ] );
			for ( var j = 0; j < elements.length; ++j  ) {
				elements[ j ].style.visibility = "hidden";
			}
		}

		for ( var i = 0; i < css_selectors_to_remove.length; ++i ) {
			var elements = document.querySelectorAll( css_selectors_to_remove[ i ] );
			for ( var j = 0; j < elements.length; ++j  ) {
				elements[ j ].parentNode.removeChild( elements[ j ] );
			}
		}

        /*
        var online_divs = document.querySelectorAll( ".line" );
		for ( var x = 0; x < online_divs.length; ++x  ) {
			online_divs[ x ].style.visibility = "visible";
        }
        */
	}
	catch( error ) { console.log( error ); }
}
function _clear_interval() {
	clearInterval( hide_interval );
}
function hide_stuff() {
	hide_interval = setInterval( _hide_stuff , 100 );
	setTimeout( _clear_interval , 5000 );
}

function on_dom_load() {
	try {
		document.title = "";
		_hide_stuff();

        /*
		var sheet = window.document.styleSheets[ 0 ];
		sheet.insertRule( "rating , .players { display: none; }" , sheet.cssRules.length );
		sheet.insertRule( "div.username * { display: none; }" , sheet.cssRules.length );
		sheet.insertRule( ".user { display: none; }" , sheet.cssRules.length );
		//sheet.insertRule( "div.watchers * { display: none; }" , sheet.cssRules.length );
		sheet.insertRule( "div.under_chat * { display: none; }" , sheet.cssRules.length );
		sheet.insertRule( ".tournament_rank { display: none; }" , sheet.cssRules.length );
        */

		title_element = document.querySelector( "head > title" );
		title_observer = new MutationObserver( function( mutations ) {
			mutations.forEach( function( mutation , index ) {
				document.title = "";
			});
		});
		title_observer.observe( title_element , observerConfig );
	}
	catch( error ) { console.log( error ); }
}

hide_stuff();
window.addEventListener ( "load" , on_dom_load );