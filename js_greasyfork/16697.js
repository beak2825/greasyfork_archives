// ==UserScript==
// @name        Toggle Zoom
// @namespace   Nickel
// @description Extend image zoom modes with scale-to-width and scale-to-height of window
// @version     0.5
// @license     GNU General Public License v3
// @copyright   2022, Nickel
// @author      Nickel
// @grant       none
// @run-at      document-start
// @noframes
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/16697/Toggle%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/16697/Toggle%20Zoom.meta.js
// ==/UserScript==


(function(){

function unscaled() {
	img.removeAttribute( "width" );
	img.removeAttribute( "height" );
	mode = "unscaled";
	document.title = titleBase;
}
function scaleToWidth() {
	img.removeAttribute( "height" );
	img.width = document.documentElement.clientWidth;
	// do it again due to scrollbars that may have (dis)appeared
	img.width = document.documentElement.clientWidth;
	mode = "scaleToWidth";
	document.title = titleBase + " — " + mode + " (" + (100*img.width/img.naturalWidth).toFixed(0) + "%)";
}
function scaleToHeight() {
	img.removeAttribute( "width" );
	img.height = document.documentElement.clientHeight;
	// do it again due to scrollbars that may have (dis)appeared
	img.height = document.documentElement.clientHeight;
	mode = "scaleToHeight";
	document.title = titleBase + " — " + mode + " (" + (100*img.width/img.naturalWidth).toFixed(0) + "%)";
}

function toggle() {
	if( (img.naturalWidth / img.naturalHeight) > (document.documentElement.clientWidth / document.documentElement.clientHeight) ) {
		if( mode == "unscaled" ) {
			scaleToHeight();
			// next is scaleToWidth
			img.style.cursor = "zoom-out";
		}
		else if( mode == "scaleToHeight" || mode == "doScaleToFit" ) {
			scaleToWidth();
			// next is unscaled
			if( img.naturalWidth > document.documentElement.clientWidth ) img.style.cursor = "zoom-in";
			else img.style.cursor = "zoom-out";
		}
		else {
			unscaled();
			// next is scaleToHeight
			img.style.cursor = "zoom-in";
		}
	}
	else {
		if( mode == "unscaled" ) {
			scaleToWidth();
			// next is scaleToHeight
			img.style.cursor = "zoom-out";
		}
		else if( mode == "scaleToWidth" || mode == "doScaleToFit" ) {
			scaleToHeight();

			// next is unscaled
			if( img.naturalHeight > document.documentElement.clientHeight ) img.style.cursor = "zoom-in";
			else img.style.cursor = "zoom-out";
		}
		else {
			unscaled();
			// next is scaleToWidth
			img.style.cursor = "zoom-in";
		}
	}
}

function initialize() {
	if( initialized == true ) return;
	initialized = true;

	// Firefox does some weird shit
	img.style.marginTop = "0";

	titleBase = document.title.replace( / — Scaled.*$/, "" );

	// set initial mode by setting do* and toggling
	if( (img.naturalWidth > document.documentElement.clientWidth) || (img.naturalHeight > document.documentElement.clientHeight) ) mode = "doScaleToFit";
    else mode = "doUnscaled";
    toggle();

	// add new left mouse button event listener
	// NOTE: would prefer to put listener on `img` instead of `document` to not react to clicks on blank space
	document.addEventListener( "click", function(e) {
		if( e.button === 0 ) {
			e.stopPropagation();
			toggle();
		}
	}, true );
}

var initialized = false;
var img = document.images[0];
if( typeof img === 'undefined' ) return;
if( img.src != window.location.href ) return;

// get image metadata as early as possible
wait = setInterval( function() {
	if( img.naturalWidth !== 0 && img.naturalHeight !== 0 && document.title !== "" ) {
		clearInterval(wait);
		initialize();
	}
}, 10 );
// also try initializing when image finishes loading
img.onload = initialize;

})();