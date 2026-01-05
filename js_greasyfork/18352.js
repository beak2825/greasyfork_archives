// ==UserScript==
// @name            Joe's Quality To Value for Popmundo
// @namespace       http://popmundo-diaries.com/
// @Author	        Joe Isaacs CharId #3248185 <joe.isaacs.pm@gmail.com>
// @description     Adds numeric values to the level bars and quality names. Any problems, please contact Joe Isaacs (http://www.popmundo.com/World/Popmundo.aspx/Character/3248185)
// @version         1.0.2
// @include         http://*.popmundo.com/World/Popmundo.aspx/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/18352/Joe%27s%20Quality%20To%20Value%20for%20Popmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/18352/Joe%27s%20Quality%20To%20Value%20for%20Popmundo.meta.js
// ==/UserScript==

function appendJsFile( scriptFile ) {
	var script = document.createElement( "script" );
	script.type = "text/javascript";
	script.src = scriptFile;
	jisQuery( "head" ).append( script );
}

function canExec( execRegex ) {
	var execCurrentUrl = window.location.href;

	if( execCurrentUrl.match( execRegex ) ) {
		return true;
	} else {
		return false;
	}
}

/**
 * ********** Area: variables
 */

var jisQuery = jQuery.noConflict();

/**
 * ********** Area: execution
 */

giveScoringNumberValues();
giveScoringProgressBarPercentages();
giveScoringNegativeProgressBarPercentages();

/**
 * ********** Area: functions
 */

//Add value to quality
function giveScoringNumberValues() {
	jisQuery( "a[href*='Scoring']" ).each( function() {
		value = jisQuery( this ).attr( 'title' );
		value = value.substr( 0, value.lastIndexOf( "/" ) );
		value = jisQuery( this ).text() + " (" + value + ")";
		jisQuery( this ).text( value );
	} );
}

//Add value to progress bar type
function giveScoringProgressBarPercentages() {
	jisQuery( 'div[class*="rogressBar"]' ).each( function() {
		value = jisQuery( this ).attr( 'title' );
		value = value.substr( 0, value.indexOf( "%" ) );
		span = '<span style="    text-align: center; font-weight: 400; font-size: smaller;">&nbsp;&nbsp;&nbsp;' + value + '%</span>';
		value = jisQuery( this ).children( "div:first" ).append( span );
	} );
}

//Add value to negative progress bar type
function giveScoringNegativeProgressBarPercentages() {
	jisQuery( '.plusMinusBar' ).each( function() {
		value = jisQuery( this ).attr( 'title' );
		value = value.substr( 0, value.indexOf( "%" ) );
		span = '<span style="    text-align: center; font-weight: 400; font-size: smaller;">&nbsp;&nbsp;&nbsp;' + value + '%</span>';
		if( value >= 0 ) {
			jisQuery( this ).children( "div" ).eq( 1 ).children().append( span );
		} else {
			jisQuery( this ).children( "div" ).eq( 0 ).children().append( span );
		}
	} );
}