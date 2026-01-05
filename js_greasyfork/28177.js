// ==UserScript==
// @name         Metacritic Improved
// @namespace    metacritic_improved
// @description  Save/Hide upcoming releases, various UI improvements.
// @homepageURL  https://github.com/daraeman/metacritic_improved
// @author       daraeman
// @version      1.2
// @date         2017-12-03
// @include      http://www.metacritic.com/browse/dvds/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28177/Metacritic%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/28177/Metacritic%20Improved.meta.js
// ==/UserScript==

var storage_keys = {
	local: {
		ignored: "metacritic_improved_release_ignore",
		saved: "metacritic_improved_release_save",
	},
};

// grab our saved data

var data = {
	ignored: {},
	saved: {},
	show_hidden: 0,
};

function parseJson( json, assign_to, initial ) {
	try {
		var parsed = JSON.parse( json );
		try {
			if ( parsed === null )
				parsed = initial;
			data[ assign_to ] = parsed;
		} catch ( e ) {}
	} catch ( e ) {}
}

parseJson( localStorage.getItem( storage_keys.local.ignored ), "ignored", {} );
parseJson( localStorage.getItem( storage_keys.local.saved ), "saved", {} );
parseJson( localStorage.getItem( storage_keys.local.show_hidden ), "show_hidden", 0 );

// iterate over the page

function isSaved( link ) {
	if ( data.saved[ link ] )
		return true;
	return false;
}
function isIgnored( link ) {
	if ( data.ignored[ link ] )
		return true;
	return false;
}

function getLink( el ) {
	return el.find( ".title a" ).attr( "href" );
}

function saveView( el ) {
	el.removeClass( "metacritic_improved_ignored" ).addClass( "metacritic_improved_saved" );
}
function ignoreView( el ) {
	el.removeClass( "metacritic_improved_saved" ).addClass( "metacritic_improved_ignored" );
	if ( ! data.show_hidden )
		jQuery( ".metacritic_improved_ignored" ).slideUp();
}
function resetView( el ) {
	el.removeClass( "metacritic_improved_saved" ).removeClass( "metacritic_improved_ignored" );
}
function stringToDate( str ) {
	return new Date( str );
}
function daysUntil( date ) {
	var now_millis = +new Date();
	var then_millis = +date;
	return ( ( then_millis - now_millis ) / 1000 / 60 / 60 / 24 );
}
function dateView( el ) {
	var date_el = el.find( ".date_wrapper" ).find( "span" ).first();
	var date_string = date_el.text();
	var parsed_date = stringToDate( date_string );
	var days_until = daysUntil( parsed_date );
	var rounded_date = Math.round( days_until );
	var words = Math.abs( rounded_date ) +" days ";
		words += ( days_until > 0 ) ? "" : "ago";
	if ( rounded_date === 0 )
		words = "today";
	else if ( rounded_date === 1 )
		words = "tomorrow";
	else if ( rounded_date === -1 )
		words = "yesterday";
	date_el.append( '<div class="metacritic_improved_date">'+ words +'</div>' );
}

jQuery( ".list .summary_row" ).each(function(){
	var el = jQuery( this );
	var link = getLink( el );

	dateView( el );

	if ( isSaved( link ) )
		saveView( el );
	else if ( isIgnored( link ) )
		ignoreView( el );

	el.append( '<td class="metacritic_improved_actions"><div class="metacritic_improved_save">✓</div><div class="metacritic_improved_ignore">✘</div></td>' );
});

// add styles

jQuery( "head" ).append(
	'<style type="text/css">' +
	'	#metacritic_improved .metacritic_improved_actions {' +
	'		text-align: right;' +
	'		padding-left: 7px;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_save {' +
	'		color: rgb( 0,190,0 );' +
	'		cursor: pointer;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_ignore {' +
	'		color: rgb( 240,0,0 );' +
	'		cursor: pointer;' +
	'		margin-top: 6px;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_saved {' +
	'		background: rgb( 20,20,20 );' +
	'		color: rgb( 255,255,255 );' +
	'		position: relative;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_saved .score_wrapper a {' +
	'		position: relative;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_saved .score_wrapper a:before {' +
	'		content: "";' +
	'		position: absolute;' +
	'		background: rgb( 20,20,20 );' +
	'		width: 16px;' +
	'		left: -16px;' +
	'		height: 83px;' +
	'		top: -2px;' +
	'	}' +
	'	#metacritic_improved .date_wrapper .inline_see_more {' +
	'		bottom: 3px;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_ignored {' +
	'		opacity: 0.4;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_toggle_container {' +
	'		position: relative;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_toggle_hidden {' +
	'		position: absolute;' +
	'		top: -20px;' +
	'		right: 0px;' +
	'		line-height: 20px;' +
	'		padding: 0px 10px;' +
	'		border: 1px solid rgb( 204,204,204 );' +
	'		border-bottom: 0px;' +
	'		color: rgb( 120,120,120 );' +
	'		text-transform: uppercase;' +
	'		font-size: 12px;' +
	'		cursor: pointer;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_toggle_hidden[data-mi_state="on"] .off {' +
	'		display: none;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_toggle_hidden[data-mi_state="off"] .on {' +
	'		display: none;' +
	'	}' +
	'	#metacritic_improved .metacritic_improved_date {' +
	'		color: rgb( 130,130,130 );' +
	'		font-style: italic;' +
	'		padding-top: 5px;' +
	'		padding-bottom: 1px;' +
	'	}' +
	'	#metacritic_improved .browse .browse_list_wrapper.two table.list, #metacritic_improved .browse .browse_list_wrapper.three table.list {' +
	'		border-top: 0px;' +
	'	}' +
	'</style>'
);

// hide/show actions

function save( link, el ) {
	if ( isIgnored( link ) )
		removeIgnore( link );
	if ( isSaved( link ) ) {
		removeSave( link );
		resetView( el );
		return true;
	}
	else {
		data.saved[ link ] = 1;
		saveView( el );
	}
	saveDataLocal();
	return true;
}
function ignore( link, el ) {
	if ( isSaved( link ) )
		removeSave( link );
	if ( isIgnored( link ) ) {
		removeIgnore( link );
		resetView( el );
		return true;
	}
	else {
		data.ignored[ link ] = 1;
		ignoreView( el );
	}
	saveDataLocal();
	return true;
}
function removeSave( link ) {
	delete data.saved[ link ];
}
function removeIgnore( link ) {
	delete data.ignored[ link ];
}

function saveDataLocal() {
	var saved_json = JSON.stringify( data.saved );
	var ignored_json = JSON.stringify( data.ignored );
	localStorage.setItem( storage_keys.local.saved, saved_json );
	localStorage.setItem( storage_keys.local.ignored, ignored_json );
	localStorage.setItem( storage_keys.local.show_hidden, data.show_hidden );
}

jQuery( ".metacritic_improved_save" ).click(function(){
	var el = jQuery( this );
	var parent = el.parent().parent();
	var link = getLink( parent );
	save( link, parent );
});
jQuery( ".metacritic_improved_ignore" ).click(function(){
	var el = jQuery( this );
	var parent = el.parent().parent();
	var link = getLink( parent );
	ignore( link, parent );
});

jQuery( "body" ).attr( "id", "metacritic_improved" );

jQuery( ".browse_trailer_wrapper" ).parent().parent().remove();

// create the hide/show button

var initial_state_class = ( data.show_hidden ) ? "on" : "off";
jQuery( ".content_after_header .inset_left2 .next_to_side_col" ).first().addClass( "metacritic_improved_toggle_container" ).append( '<div class="metacritic_improved_toggle_hidden" data-mi_state="'+ initial_state_class +'"><span class="on">hide ignored</span><span class="off">show ignored</span></div>' );

jQuery( ".metacritic_improved_toggle_hidden" ).click(function(){
	var el = jQuery( this );
	if ( el.attr( "data-mi_state" ) == "on" ) {
		jQuery( ".metacritic_improved_ignored" ).hide();
		el.attr( "data-mi_state", "off" );
		data.show_hidden = 0;
	}
	else {
		jQuery( ".metacritic_improved_ignored" ).show();
		el.attr( "data-mi_state", "on" );
		data.show_hidden = 1;
	}
	saveDataLocal();
});