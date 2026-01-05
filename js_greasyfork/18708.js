// ==UserScript==
// @name            Joe's Better look and feel for Popmundo
// @namespace       http://popmundo-diaries.com/
// @Author	        Joe Isaacs CharId #3248185 <joe.isaacs.pm@gmail.com>
// @description     This will change the look and feel of Popmundo game. It will add values to qualities, change the default give checkbox to true, allow you to filter items, and add global fame to your band. Any problems, please contact Joe Isaacs (http://www.popmundo.com/World/Popmundo.aspx/Character/3248185)
// @version         1.0.0
// @include         http://*.popmundo.com/World/Popmundo.aspx/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/18708/Joe%27s%20Better%20look%20and%20feel%20for%20Popmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/18708/Joe%27s%20Better%20look%20and%20feel%20for%20Popmundo.meta.js
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
var urlCurrent = window.location.href;
var numCities = 49;
var mediaFame = 0;
var mediaMC = 0;
/**
 * ********** Area: execution
 */

if( canExec( /\/World\/Popmundo.aspx\/Character\/OfferItem\/[0-9]*/g ) ) {
	giveCheckboxDefaultTrue();
}

if( canExec( /\/World\/Popmundo.aspx\/Character\/Recipes\/[0-9]*/g ) ) {
	giveSortableTableFoldOption();
}

giveScoringNumberValues();
giveScoringProgressBarPercentages();
giveScoringNegativeProgressBarPercentages();

if( canExec( /\/World\/Popmundo.aspx\/Artist\/Popularity\/[0-9]*/g ) ) {
	addsGlobalFameMedia();
}

if( canExec( /\/World\/Popmundo.aspx\/Artist\/Popularity\/[0-9]*/g )
		|| canExec( /\/World\/Popmundo.aspx\/Artist\/InviteArtist\/[0-9]*/g ) ) {
	AddsTicketPrice();
}

if( canExec( /\/World\/Popmundo.aspx\/Locale\/ItemsEquipment\/.*/g ) ) {
	addObjectFilterInLocation();
}

if( canExec( /\/World\/Popmundo.aspx\/Locale\/ItemsEquipment\/[0-9]*#[0-9]*$/g ) ) {
	filterObjectsInLocation();
}

/**
 * ********** Area: functions
 */

/**
 * Sets the default value of Give items checkbox to true
 */
function giveCheckboxDefaultTrue() {
	jisQuery( '[id$=chkDelivery]' ).prop( 'checked', true );
}

//Adds the code to display the buttons which will hide and display the groups in receipts
function giveSortableTableFoldOption() {
	jisQuery( 'table.data.sortable' ).each( function() {
		var tblId = jisQuery( this ).attr( 'id' );
		jisQuery( this ).find( 'th.header' ).not( '.width60' ).each( function() {
			
			
			var btnCode =	'&nbsp;<input type="button" onclick="'
							+ "jQuery( '#" + tblId + " tbody' ).hide();"
							+ '" value="Hide">'
							+ '&nbsp;<input type="button" onclick="'
							+ "jQuery( '#" + tblId + " tbody' ).show();"
							+ '" value="Show">';
			jisQuery( this ).append( btnCode );
		} );
	} );
}

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

//Calc world fame media
function addsGlobalFameMedia() {
	jisQuery( "a[href^='/World/Popmundo.aspx/Help/Scoring/']" ).each( function() {
		//media value;
		var tmpVal = jisQuery( this ).attr( 'title' );
		tmpVal = tmpVal.replace( '/26', '' );
		//Increases the media
		mediaFame += parseInt( tmpVal );
	} );

//Calc world media coverage
	jisQuery( "#tablefame div[class$='ProgressBar']" ).each( function() {
		//media value;
		var tmpVal = jisQuery( this ).attr( 'title' );
		tmpVal = tmpVal.replace( '%', '' );

		//Increases the media
		mediaMC += parseInt( tmpVal );
	} );

//Add global line to table
	jisQuery( "tr:first" ).after( function() {
		var mediaFame_val = mediaFame / numCities;
		mediaFame_val = mediaFame_val.toFixed( 2 );

		var mediaMC_val = mediaMC / numCities;
		mediaMC_val = mediaMC_val.toFixed( 2 );

		var tmpVal = '<tr class="even" style="font-weight:bold;"><td>Global</td><td>' + mediaFame_val + '</td><td>' + mediaMC_val + '%</td></tr>';
		jisQuery( this ).after( tmpVal );
	} );
}


//Adds number to quality
function AddsTicketPrice() {
	jisQuery( "a[href^='/World/Popmundo.aspx/Help/Scoring/']" ).each( function() {
		//media value;
		var tmpVal = jisQuery( this ).attr( 'title' );
		tmpVal = tmpVal.replace( '/26', '' );

		switch( parseInt( tmpVal ) ) {
			case( 0 ):
				tmpVal = '5$';
				break;
			case( 1 ):
				tmpVal = '5$';
				break;
			case( 2 ):
				tmpVal = '5$';
				break;
			case( 3 ):
				tmpVal = '7$';
				break;
			case( 4 ):
				tmpVal = '9$';
				break;
			case( 5 ):
				tmpVal = '12$';
				break;
			case( 6 ):
				tmpVal = '15$';
				break;
			case( 7 ):
				tmpVal = '18$';
				break;
			case( 8 ):
				tmpVal = '20$';
				break;
			case( 9 ):
				tmpVal = '25$';
				break;
			case( 10 ):
				tmpVal = '30$';
				break;
			case( 11 ):
				tmpVal = '35$';
				break;
			case( 12 ):
				tmpVal = '40$';
				break;
			case( 13 ):
				tmpVal = '45$';
				break;
			case( 14 ):
				tmpVal = '50$';
				break;
			case( 15 ):
				tmpVal = '65$';
				break;
			case( 16 ):
				tmpVal = '70$';
				break;
		}

		jisQuery( this ).after( '<span style="color: #41924B">&nbsp;&nbsp;ticket: ' + tmpVal + '</span>' );
	} );
}

// In Get your items, finds the characer ID
function getFilterCharacterID() {
	var url = location.href;
	var idx = url.indexOf( "#" ) + 1;
	return idx != -1 ? url.substring( idx ) : "";
}

// In Get your items, finds the base URL
function getFilterLocaleBaseURL() {
	var url = location.href;
	var idxIni = url.lastIndexOf( "/World" );
	var idxLength = url.lastIndexOf( "#" );

	return idxLength < 0 ?
			url.substring( idxIni ) + "#" :
			url.substring( idxIni, idxLength ) + "#";
}

//  In Get your items, adds the filtering funtionality
function addObjectFilterInLocation() {
	var jsButton = "window.location.assign( '" + getFilterLocaleBaseURL() + "' + document.getElementById( 'textFilterID' ).value ); window.location.reload();";

	var addElement = "<tr class=\"group\"><td id=\"ctl00_cphLeftColumn_ctl00_repItemGroups_ctl01_tdCheckboxFiller\"></td><td colspan=\"2\">Filter Items</td></tr>"
			+ "<tr class=\"even hoverable\"><td id=\"ctl00_cphLeftColumn_ctl00_repItemGroups_ctl01_tdCheckboxFiller\"></td>"
			+ "<td>"
			+ "<input type=\"number\" id=\"textFilterID\" name=\"textFilterID\" placeholder=\"Character ID\" value=\"" + getFilterCharacterID() + "\">"
			+ "&nbsp;&nbsp;<button type=\"button\" onclick=\""
			+ jsButton
			+ "\">Filter</button>"
			+ "</td></tr>";

	jisQuery( "#checkedlist thead" ).append( addElement );
}

function filterObjectsInLocation() {
	jisQuery( "#checkedlist tbody tr.hoverable" ).each( function() {
		var toHide = true;
		jisQuery( this ).find( 'a[id$="_lnkItemOwner"][href$="' + getFilterCharacterID() + '"]' ).each( function() {
			toHide = false;
		} )
		if( toHide ) {
			jisQuery( this ).hide();
		}

	} );
}