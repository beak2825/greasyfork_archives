// ==UserScript==
// @name            Joe's Get Your Items for Popmundo
// @namespace       http://popmundo-diaries.com/
// @Author	        Joe Isaacs CharId #3248185 <joe.isaacs.pm@gmail.com>
// @description     Allows you to filter items of a specific character ID In a locale. Any problems, please contact Joe Isaacs (http://www.popmundo.com/World/Popmundo.aspx/Character/3248185)
// @version         1.0.3
// @include         http://*.popmundo.com/World/Popmundo.aspx/Locale/ItemsEquipment/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/18538/Joe%27s%20Get%20Your%20Items%20for%20Popmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/18538/Joe%27s%20Get%20Your%20Items%20for%20Popmundo.meta.js
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

if( canExec( /\/World\/Popmundo.aspx\/Locale\/ItemsEquipment\/.*/g ) ) {
	addObjectFilterInLocation();
}

if( canExec( /\/World\/Popmundo.aspx\/Locale\/ItemsEquipment\/[0-9]*#[0-9]*$/g ) ) {
	filterObjectsInLocation();
}

/**
 * ********** Area: functions
 */

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