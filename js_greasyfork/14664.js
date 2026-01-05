// ==UserScript==
// @name         Horriblesubs Release Time Until
// @namespace    horriblesubs_release_time_until
// @description  Change times on horriblesubs to "until/ago", highlight shows you're watching, and highlights newly added shows, and adds links to various anime databases
// @homepageURL  https://github.com/namiman/horriblesubs_release_time_until
// @author       namiman
// @version      1.4.3
// @date         2018-01-11
// @include      /^https?:\/\/horriblesubs\.info\/.*/
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14664/Horriblesubs%20Release%20Time%20Until.user.js
// @updateURL https://update.greasyfork.org/scripts/14664/Horriblesubs%20Release%20Time%20Until.meta.js
// ==/UserScript==

console.log( "Horriblesubs Release Time Until userscript loaded" );

var key = {
	user_shows: 'hrtu_user_shows',
	all_shows: 'hrtu_all_shows',
	version: 'hrtu_last_version',
	state: 'hrtu_release_schedule_state',
};
var is_new_install = false;
var current_version = '1.4.3';
var user_shows = JSON.parse( localStorage.getItem( key.user_shows ) );
if ( ! user_shows )
	user_shows = {};
var all_shows = JSON.parse( localStorage.getItem( key.all_shows ) );
if ( ! all_shows )
	all_shows = {};
var script_version = localStorage.getItem( key.version );
if ( ! script_version ) {
	is_new_install = true;
	script_version = current_version;
}
var state = JSON.parse( localStorage.getItem( key.state ) );
if ( ! state ) {
	state = {
		saved: 1,
		unsaved: 1,
		new: 1,
	};
}

function updateVersion() {
	if ( is_new_install ) {
		console.log( "HRTU version: "+ current_version );
		showAlert( 'Congratulations on installing <a href="https://github.com/namiman/horriblesubs_release_time_until/">HRTU</a>. You may find instructions on the <a href="/release-schedule/">release schedule</a> page. <div class="close">x</div>' );
	}
	localStorage.setItem( key.version, current_version );
}

var weekdays = [
	"YABOI", // horriblesubs starts the week on monday, not sunday
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];

function parseTime( str ) {
	var match = str.match( /(\d+):(\d+)/ );
	return {
		hours: match[1],
		minutes: match[2]
	};
}
function timeAgo( hours, minutes, day ) {
	var now = new Date();
	var dst_start = new Date( now.getFullYear(), 3, 8 );
	var dst_end = new Date( now.getFullYear(), 11, 1 );
	var offset = ( now > dst_start && now < dst_end ) ? -7 : -8 ;
	var pacific_time = new Date( now.getTime() + ( offset * 3600 * 1000 ) );

	var time_show = new Date( pacific_time.getFullYear(), pacific_time.getMonth(), pacific_time.getDate(), 0, 0, 0 );
	var pacific_day = pacific_time.getDay();
	// if it is sunday(pacific), then the actual day will be 0, but horriblesubs day will be 7, so set it to 0, but only on sundays
	var day_diff = ( day == 7 && pacific_day === 0 ) ? 0 : ( day - pacific_day );
		time_show.setDate( pacific_time.getDate() + day_diff );
		time_show.setHours( parseInt( hours ) + parseInt( offset ) );
		time_show.setMinutes( minutes );

	var time_units;
	var time_until = Math.round( ( time_show - pacific_time ) / 1000 / 60 );
	var time_direction = (time_until > 0) ? 1 : (time_until === 0) ? 0 : -1;
	time_until = Math.abs( time_until );
	if ( time_until === 0 )
		time_units = '';
	else if ( time_until > 60 ) {
		time_until = ( time_until / 60 ).toFixed( 1 );
		time_units = ( time_until > 1 ) ? 'hrs' : 'hr';
	}
	else
		time_units = ( time_until > 1 ) ? 'mins' : 'min';

	var ending_phrase = (time_direction > 0) ? 'until' : (time_direction === 0) ? 'now' : 'ago';

	return {
		'text': ( time_direction === 0 ) ? ending_phrase : time_until + ' ' + time_units + ' ' + ending_phrase,
		'time': time_until,
		'direction': time_direction
	};
}

function linkIdentifier( link ) {
	return link.substr( link.lastIndexOf( '/' ) + 1 );
}

function sideBar() {
	if ( ! jQuery( ".schedule-today:not( .hrtu_sidebar )" ).length ) {
		console.warn( "Horriblesubs Release Time Until sideBar(): Unable to find '.schedule-today'" );
		return false;
	}
	
	jQuery( ".schedule-today:not( .hrtu_sidebar ) .schedule-table tr" ).each(function(){
		var row = jQuery(this);
		var title_el = row.find( ".schedule-widget-show" );
		var no_link = false;
		if ( ! title_el.length ) {
			title_el = row.find( ".schedule-show" );
			no_link = true;
		}
		if ( ! title_el.hasClass( "hrtu_sidebar_show_name" ) ) {
			title_el.addClass( "hrtu_sidebar_show_name" );
		}
		var title, link;
		if ( no_link ) {
			title = fixTitle( title_el.text() );
			title_el.text( title );
		}
		else {
			title = fixTitle( title_el.find( "a" ).text() );
			link = linkIdentifier( title_el.find( "a" ).attr( "href" ) );
			title_el.find( "a" ).text( title );
		}

		if ( isUserShow( title, link ) )
			row.addClass( "hrtu_sidebar_highlight" );
		else
			row.removeClass( "hrtu_sidebar_highlight" );

		if ( ! isAllShow( title, link ) )
			row.addClass( "hrtu_sidebar_highlight_new" );
		else
			row.removeClass( "hrtu_sidebar_highlight_new" );
		
		var time_el = row.find( '.schedule-time' );
		var time_text;
		if ( time_el[0].hasAttribute( 'data-hrtu-time' ) )
			time_text = time_el.attr( 'title' );
		else
			time_text = time_el.text();
		var match = parseTime( time_text );
		var today = new Date();
		var show = timeAgo( match.hours, match.minutes, today.getDay() );
		time_el
			.attr( 'title', time_text )
			.attr( 'data-hrtu-time', show.time )
			.text( show.text )
			.addClass( 'hrtu_time' );
		if ( show.direction < 0 )
			time_el.addClass( 'hrtu_release_page_time_passed' );
	});

	jQuery( ".schedule-today:not( .hrtu_sidebar ) .schedule-table" ).unbind( "click.hrtu_sidebar_show_name" ).on( "click.hrtu_sidebar_show_name", ".hrtu_sidebar_highlight_new .hrtu_sidebar_show_name", function( event ){
		var el = jQuery(this)[0];
		if ( event.offsetX < el.offsetWidth ) {
			var anchor_el = jQuery( el ).find( "a" ).first();
			var title, link;
			if ( ! anchor_el.length ) {
				var show_el = jQuery( el ).find( ".schedule-show" );
				title = fixTitle( show_el.text() );
			}
			else {
				title = fixTitle( anchor_el.text() );
				link = linkIdentifier( anchor_el.attr( "href" ) );
			}
			addShow( title, link );
			releasePage();
			sideBar();
		}
	});
}

/*
	Fixes bug where titles had differing types of dashes,
	in different places on the website, and as a result
	would not match against each other.
*/
function fixTitle( str ) {
	return str.replace( /\u2013|\u002D/g, "-" );
}

function addShow( title, link ) {
	if ( typeof all_shows[ title ] !== "undefined" ) {
		if ( link ) {
			all_shows[ link ] = 1;
			delete all_shows[ title ];
		}
		else {
			all_shows[ title ] = 1;
		}
	}
	else {
		if ( link )
			all_shows[ link ] = 1;
		else
			all_shows[ title ] = 1;
	}
	localStorage.setItem( key.all_shows, JSON.stringify( all_shows ) );
}

function isAllShow( title, link ) {
	if ( ( typeof all_shows[ title ] !== "undefined" ) ) {
		if ( link ) {
			all_shows[ link ] = JSON.parse( JSON.stringify( all_shows[ title ] ) );
			delete all_shows[ title ];
		}
		else {
			all_shows[ title ] = 1;
		}
		localStorage.setItem( key.all_shows, JSON.stringify( all_shows ) );
		return true;
	}
	else {
		return ( typeof all_shows[ link ] !== "undefined" );
	}
}

function addUserShow( title, link ) {
	if ( typeof user_shows[ title ] !== "undefined" ) {
		if ( link ) {
			user_shows[ link ] = 1;
			delete user_shows[ title ];
		}
		else {
			user_shows[ title ] = 1;
		}
	}
	else {
		if ( link )
			user_shows[ link ] = 1;
		else
			user_shows[ title ] = 1;
	}
	localStorage.setItem( key.user_shows, JSON.stringify( user_shows ) );

	if ( ! isAllShow( title, link ) )
		addShow( title, link );
}

function removeUserShow( title, link ) {
	delete user_shows[ title ];
	delete user_shows[ link ];
	localStorage.setItem( key.user_shows, JSON.stringify( user_shows ) );
}
function isUserShow( title, link ) {
	if ( ( typeof user_shows[ title ] !== "undefined" ) ) {
		if ( link ) {
			user_shows[ link ] = JSON.parse( JSON.stringify( user_shows[ title ] ) );
			delete user_shows[ title ];
		}
		else {
			user_shows[ title ] = 1;
		}
		localStorage.setItem( key.user_shows, JSON.stringify( user_shows ) );
		return true;
	}
	else {
		return ( typeof user_shows[ link ] !== "undefined" );
	}
}

function releasePageUserRefreshShowView( el, title, link, is_user_saved, is_all_saved ) {
	is_all_saved = is_all_saved || isAllShow( title, link );

	if ( is_user_saved )
		el.parent().addClass( "hrtu_release_page_highlight" );
	else
		el.parent().removeClass( "hrtu_release_page_highlight" );

	if ( is_all_saved )
		el.parent().removeClass( "hrtu_release_page_highlight_new" );
	else
		el.parent().addClass( "hrtu_release_page_highlight_new" );

}

function releasePageMakeShow( title_el, has_link ) {

	var anchor_el,
		link,
		title;

	if ( has_link ) {
		anchor_el = title_el.find( "a" ).first();
		link = linkIdentifier( anchor_el.attr( "href" ) );
		title = fixTitle( anchor_el.text() );
		anchor_el.text( title );
	}
	else {
		title = fixTitle( title_el.text() );
		title_el.text( title );
	}

	/* set up user shows */
	if ( isUserShow( title, link ) )
		title_el.parent().addClass( "hrtu_release_page_highlight" );
	else
		title_el.parent().removeClass( "hrtu_release_page_highlight" );

	if ( ! title_el.find( '.hrtu_release_page_toggle' ).length ) {

		title_el.append( '<div class="hrtu_release_page_toggle"></div>' );

		title_el.unbind( "click.hrtu_release_page_toggle" ).on( "click.hrtu_release_page_toggle", ".hrtu_release_page_toggle", function(e){
			var el = jQuery(this),
				title,
				link;

			var has_link = el.parent().hasClass( "schedule-page-show" );

			if ( has_link ) {
				title = el.parent().find( "a" ).text();
				link = linkIdentifier( el.parent().find( "a" ).attr( "href" ) );
			}
			else
				title = el.parent().text();

			var is_saved = el.parent().parent().hasClass( "hrtu_release_page_highlight" );
			if ( is_saved ) {
				removeUserShow( title, link );
				hrtuSidebarRemoveShow( title );
				releasePageUserRefreshShowView( el.parent(), title, link, false );
			}
			else {
				addUserShow( title, link );
				releasePageUserRefreshShowView( el.parent(), title, link, true );
			}

			sideBar();
			e.stopPropagation();
		});
	}

	/* set up new show */
	if ( ! isAllShow( title, link ) ) {
		title_el.parent().addClass( "hrtu_release_page_highlight_new" );

		if ( ! title_el.find( '.hrtu_release_page_toggle_new' ).length ) {

			title_el.append( '<div class="hrtu_release_page_toggle_new"></div>' );

			title_el.unbind( "click.hrtu_release_page_toggle_new" ).on( "click.hrtu_release_page_toggle_new", ".hrtu_release_page_toggle_new", function(e){

				var title,
					link,
					el = jQuery(this);

				var has_link = el.parent().hasClass( "schedule-page-show" );

				if ( has_link ) {
					title = el.parent().find( "a" ).text();
					link = linkIdentifier( el.parent().find( "a" ).attr( "href" ) );
				}
				else {
					title = el.parent().text();
				}

				addShow( title, link );	
				releasePageUserRefreshShowView( el.parent(), title, link, isUserShow( title, link ) );			
				sideBar();
				e.stopPropagation();
			});
		}
	}
	else
		title_el.parent().removeClass( "hrtu_release_page_highlight_new" );
}

function updateStateClass( property ) {

	var result = state[ property ];

	if ( property == "new" )
		var el = jQuery( "#hrtu_view_new" );
	else if ( property == "saved" )
		var el = jQuery( "#hrtu_view_saved" );
	else if ( property == "unsaved" )
		var el = jQuery( "#hrtu_view_unsaved" );
	else
		return false;
	
	if ( result )
		el.addClass( "selected" );
	else
		el.removeClass( "selected" );
}

function updateStateView( property ) {

	var result = state[ property ];

	if ( property == "new" )
		var el = jQuery( ".schedule-page-item.hrtu_release_page_highlight_new" );
	else if ( property == "saved" )
		var el = jQuery( ".schedule-page-item.hrtu_release_page_highlight" );
	else if ( property == "unsaved" )
		var el = jQuery( ".schedule-page-item:not( .hrtu_release_page_highlight ):not( .hrtu_release_page_highlight_new )" );
	else
		return false;

	if ( result )
		el.show();
	else
		el.hide();

}

function getState( property ) {
	return state[ property ];
}

function updateState( property, value ) {

	if ( typeof value !== "undefined" )
		state[ property ] = value;

	updateStateClass( property );
	updateStateView( property );
	saveStateData();

}

function saveStateData() {
	localStorage.setItem( key.state, JSON.stringify( state ) );
}

function updateAllStateViews() {

	var properties = [
		"new",
		"saved",
		"unsaved",
	];

	properties.forEach(function( property ){
		updateState( property );
	});
}

function releasePage() {

	if ( ! jQuery( '.entry-content' ).length || ! jQuery( '.entry-content' ).children().length ) {
		console.warn( "Horriblesubs Release Time Until releasePage(): Unable to find release entries" );
		return false;
	}

	if ( ! jQuery( '.hrtu_instructions' ).length ) {
		jQuery( jQuery( ".entry-content ul" ).get(0) ).append(
			'<li class="hrtu_instructions">Click [+] or [-] on shows you\'re watching to highlight them</li>' +
			'<li class="hrtu_instructions">Shows with [NEW] are newly listed, click on [NEW] to unmark individual shows or <span id="hrtu_unmark_all_new" class="hrtu_button">click&nbsp;here</span> to unmark all of them at once.</li>' +
			'	<li class="hrtu_instructions">Currently viewing: <span id="hrtu_view_new" class="hrtu_button option">New</span> - <span id="hrtu_view_saved" class="hrtu_button option">Saved</span> - <span id="hrtu_view_unsaved" class="hrtu_button option">Unsaved</span></li>'
		);
	}

	jQuery( '#hrtu_unmark_all_new' ).unbind( "click" ).on( "click", function(){
		jQuery( '.schedule-page-show' ).each(function(){
			var anchor_el = jQuery(this).find( "a" ).first();
			var title = fixTitle( anchor_el.text() );
			var link = linkIdentifier( anchor_el.attr( "href" ) );
			addShow( title, link );
			releasePage();
			sideBar();
		});
	});

	// toggle saved items
	jQuery( "#hrtu_view_new" ).unbind( "click" ).on( "click", function(){
		if ( getState( "new" ) )
			updateState( "new", 0 );
		else
			updateState( "new", 1 );
	});

	// toggle unsaved items
	jQuery( "#hrtu_view_saved" ).unbind( "click" ).on( "click", function(){
		if ( getState( "saved" ) )
			updateState( "saved", 0 );
		else
			updateState( "saved", 1 );
	});

	// toggle new items
	jQuery( "#hrtu_view_unsaved" ).unbind( "click" ).on( "click", function(){
		if ( getState( "unsaved" ) )
			updateState( "unsaved", 0 );
		else
			updateState( "unsaved", 1 );
	});

	var entry_day;
	jQuery( '.entry-content' ).children().each(function(){
		var el = jQuery(this);
		if ( el.hasClass( 'weekday' ) ) {
			if ( el.text() == "To be scheduled" )
				entry_day = 'tbd';
			else
				entry_day = weekdays.indexOf( el.text() );
		}
		else if ( el.hasClass( 'schedule-today-table' ) ) {

			el.find( '.schedule-page-show' ).each(function(){
				releasePageMakeShow( jQuery(this), true );
			});

			el.find( '.schedule-show' ).each(function(){
				releasePageMakeShow( jQuery(this), false );
			});

			el.find( '.schedule-time' ).each(function(){
				var show;
				var time_el = jQuery(this);
				if ( ! time_el.length ) {
					console.warn( "Horriblesubs Release Time Until releasePage(): No .schedule-time found" );
					return false;
				}
				var time_text;
				if ( entry_day == 'tbd' || time_el.attr( 'title' ) === "" ) {
					show = {
						time: "00:00",
						text: "",
						direction: 1
					};
				}
				else {
					if ( time_el[0].hasAttribute( 'data-hrtu-time' ) )
						time_text = time_el.attr( 'title' );
					else
						time_text = time_el.text();
					
					time_el.title = time_text;
					var match = parseTime( time_text );
					if ( ! match )
						console.warn( "Horriblesubs Release Time Until releasePage(): Unable to parse release time ["+ time_text +"]" );
					show = timeAgo( match.hours, match.minutes, entry_day );
				}
				time_el
					.attr( 'title', time_text )
					.attr( 'data-hrtu-time', show.time )
					.text( show.text )
					.addClass( 'hrtu_time' )
					.parent()
						.addClass( 'hrtu_series_name' )
						.find( '.schedule-page-show' )
							.addClass( 'hrtu_series_name_text' );
				time_el
					.parent()
						.find( '.schedule-show' )
							.addClass( 'hrtu_series_name_text' );
				if ( show.direction < 0 )
					time_el.addClass( 'hrtu_release_page_time_passed' );

				if ( time_el.parent().hasClass( "hrtu_release_page_highlight" ) ) {
					var text_el = time_el.parent().find( ".schedule-page-show a" );
					var href;
					if ( ! text_el.length ) {
						text_el = time_el.parent().find( ".schedule-show" );
						href = "";
					}
					else {
						href = time_el.attr( 'href' );
					}

					hrtuSidebarAddShow( text_el.text(), show.time, show.text, href );
				}
			});
		}
	});

	updateAllStateViews();
}

function hrtuSidebarAddShow( title, otime, time_text, href ) {
	if ( ! jQuery( '#hrtu_sidebar' ).length ) {
		jQuery( '#sidebar .xoxo' ).first().append(
			'<li id="hrtu_sidebar" class="widget-container widget_text">' +
			'	<h3 class="widget-title">My Shows</h3>' +
			'	<div class="textwidget">' +
			'		<div class="schedule-today hrtu_sidebar">' +
			'			<table class="schedule-table" border="0" cellpadding="0" cellspacing="0">' +
			'				<tbody></tbody>' +
			'			</table>' +
			'		</div>' +
			'	</div>' +
			'</li>'
		);
	}

	var exists = false;
	jQuery( '#hrtu_sidebar .textwidget .schedule-table tbody td.hrtu_sidebar_show_name' ).each(function(){
		if ( jQuery(this).find( 'a' ).text() == title ) {
			exists = true;
			return false;
		}
	});
	if ( exists === false ) {
		var title_text = 'See all releases for this show';
		if ( ! href ) {
			href = '';
			title_text = '';
		}
		var color_class = ( /ago/.test( time_text ) ) ? "hrtu_release_page_time_passed" : "" ;
		jQuery( '#hrtu_sidebar .textwidget .schedule-table tbody' ).append(
			'<tr class="hrtu_sidebar_highlight">' +
			'	<td class="schedule-widget-show hrtu_sidebar_show_name">' +
			'		<a title="'+ title_text +'" href="'+ href +'">'+ title +'</a>' +
			'	</td>' +
			'	<td title="'+ otime +'" class="schedule-time hrtu_time '+ color_class +'">'+ time_text +'</td>' +
			'</tr>'
		);
	}
}

function hrtuSidebarRemoveShow( title ) {
	jQuery( '#hrtu_sidebar .textwidget .schedule-table tbody td.hrtu_sidebar_show_name' ).each(function(){
		if ( jQuery(this).find( 'a' ).text() == title ) {
			jQuery( this ).parent().remove();
			return false;
		}
	});
}

function addStyles() {
	jQuery( 'body' ).addClass( "hrtu" );
	jQuery( 'head' ).append(
		'<style type="text/css">' +
		'	.hrtu .hrtu_series_name {' +
		'		padding: 0px 6px;' +
		'	}' +
		'	.hrtu .hrtu_series_name:hover {' +
		'		background-color: rgb( 230,230,230 );' +
		'	}' +
		'	.hrtu .hrtu_series_name_text {' +
		'		position: relative;' +
		'		overflow: visible;' +
		'		white-space: normal;' +
		'	}' +
		'	.hrtu .hrtu_sidebar_show_name {' +
		'		width: 60%;' +
		'		position: relative;' +
		'		overflow: visible;' +
		'		white-space: normal;' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight {' +
		'		color: rgb( 0,0,0 );' +
		'		font-weight: bold;' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight .hrtu_sidebar_show_name:before, .hrtu .hrtu_sidebar_highlight_new .hrtu_sidebar_show_name:after {' +
		'		content: "";' +
		'		position: absolute;' +
		'		top: 6px;' +
		'		left: -10px;' +
		'		width: 6px;' +
		'		height: 6px;' +
		'		border-radius: 15px;' +
		'		background: rgb( 76,113,168 );' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight_new .hrtu_sidebar_show_name:after {' +
		'		background: rgb( 220,0,0 );' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight_new {' +
		'		color: rgb( 0,0,0 );' +
		'	}' +
		'	.hrtu .hrtu_release_page_time_passed {' +
		'		color: rgb( 179,179,179 );' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight .hrtu_release_page_time_passed {' +
		'		color: rgb( 129,129,129 );' +
		'	}' +
		'	.hrtu .hrtu_sidebar_highlight_new .hrtu_sidebar_show_name:before {' +
		'		content: "[NEW]";' +
		'		font-size: 12px;' +
		'		font-weight: bold;' +
		'		font-family: sans-serif;' +
		'		color: rgb( 220,0,0 );' +
		'		margin-right: 5px;' +
		'		cursor: pointer;' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight {' +
		'		font-weight: bold;' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight .hrtu_series_name_text {' +
		'		position: relative;' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight .hrtu_series_name_text:before {' +
		'		content: "";' +
		'		position: absolute;' +
		'		top: 9px;' +
		'		left: -14px;' +
		'		width: 9px;' +
		'		height: 9px;' +
		'		border-radius: 15px;' +
		'		background: rgb( 98,151,176 );' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight .hrtu_release_page_time_passed {' +
		'		color: rgb( 144,144,144 );' +
		'	}' +
		'	.hrtu .hrtu_time {' +
		'		white-space: nowrap;' +
		'	}' +
		'	.hrtu .hrtu_release_page_toggle {' +
		'		width: 24px;' +
		'		height: 24px;' +
		'		text-align: center;' +
		'		line-height: 24px;' +
		'		cursor: pointer;' +
		'		display: inline-block;' +
		'		margin-left: 7px;' +
		'	}' +
		'	.hrtu .hrtu_release_page_toggle_new {' +
		'		display: none;' +
		'		text-align: center;' +
		'		line-height: 24px;' +
		'		cursor: pointer;' +
		'		display: inline-block;' +
		'		margin-left: 7px;' +
		'		color: rgb( 220,0,0 );' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight_new .hrtu_release_page_toggle_new {' +
		'		display: inline-block' +
		'	}' +
		'	.hrtu .hrtu_release_page_toggle:before {' +
		'		content: "[+]";' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight .hrtu_release_page_toggle:before {' +
		'		content: "[-]";' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight_new .hrtu_release_page_toggle_new:before {' +
		'		content: "[NEW]";' +
		'		font-weight: bold;' +
		'	}' +
		'	.hrtu .hrtu_release_page_highlight_new .hrtu_series_name_text:after {' +
		'		content: "";' +
		'		position: absolute;' +
		'		top: 9px;' +
		'		left: -14px;' +
		'		width: 9px;' +
		'		height: 9px;' +
		'		border-radius: 15px;' +
		'		background: rgb( 220,0,0 );' +
		'	}' +
		'	.hrtu_button {' +
		'		height: 22px;' +
		'		border: 1px solid rgb( 200,200,200 );' +
		'		cursor: pointer;' +
		'		color: rgb( 0,102,204 );' +
		'		border-radius: 25px;' +
		'		padding: 0px 8px 2px;' +
		'		box-shadow: 0px 0px 5px rgba( 0,0,0, 0.1 );' +
		'	}' +
		'	.hrtu_button:hover {' +
		'		border-color: rgb( 120,120,120 );' +
		'	}' +
		'	.hrtu_button.option:before {' +
		'		content: "✖";' +
		'		color: red;' +
		'		padding-right: 3px;' +
		'	}' +
		'	.hrtu_button.option.selected:before {' +
		'		content: "✓";' +
		'		color: green;' +
		'	}' +
		'	.hrtu_show_outbound_links {' +
		'		padding: 0px 8px 2px;' +
		'		display: inline-block;' +
		'		margin-top: 14px;' +
		'		floaT: right;' +
		'	}' +
		'	.hrtu_show_outbound_link {' +
		'		display: inline-block;' +
		'		color: rgb( 170,175,191 );' +
		'		border-right: 1px solid rgb( 220,220,220 );' +
		'		font-style: italic;' +
		'		padding: 0px 7px 0px 3px;' +
		'	}' +
		'	.hrtu_show_outbound_link:last-child {' +
		'		border: 0px;' +
		'	}' +
		'	#hrtu_alert {' +
		'		position: fixed;' +
		'		top: 0px;' +
		'		left: 0px;' +
		'		background: rgb( 255,0,0 );' +
		'		padding: 10px;' +
		'		color: rgb( 255,255,255 );' +
		'		width: calc( 100% - 20px );' +
		'		text-align: center;' +
		'		font-size: 15px;' +
		'	}' +
		'	#hrtu_alert a {' +
		'		color: rgb( 255,255,255 );' +
		'	}' +
		'	#hrtu_alert .close {' +
		'		float: right;' +
		'		border: 1px solid rgb( 255,255,255 );' +
		'		border-radius: 10px;' +
		'		padding: 0px 6px 4px;' +
		'		line-height: 14px;' +
		'		cursor: pointer' +
		'	}' +
		'	.hrtu_sidebar  .hrtu_sidebar_highlight .hrtu_sidebar_show_name:before {' +
		'		display: none;' +
		'	}' +
		'	.ind-show, .ind-show a {' +
		'		white-space: unset;' +
		'	}' +
		'</style>'
	);
}

function allShowsPage() {
	if ( ! jQuery( ".entry-content" ).hasClass( "hrtu_instruction" ) ) {

		jQuery( ".entry-content" )
			.addClass( "hrtu_instruction" )
			.prepend(
				'<ul>' +
				'	<li class="hrtu_instructions">Click [+] or [-] on shows you\'re watching to highlight them</li>' +
				'	<li class="hrtu_instructions">Shows with [NEW] are newly listed, click on [NEW] to unmark individual shows or <span id="hrtu_unmark_all_new" class="hrtu_button">click&nbsp;here</span> to unmark all of them at once.</li>' +
				'	<li class="hrtu_instructions">Currently viewing: <span id="hrtu_view_new" class="hrtu_button option selected">New</span> - <span id="hrtu_view_saved" class="hrtu_button option selected">Saved</span> - <span id="hrtu_view_unsaved" class="hrtu_button option selected">Unsaved</span></li>' +
				'</ul>'
			);

		jQuery( "#hrtu_unmark_all_new" ).unbind( "click" ).on( "click", function(){
			jQuery( ".ind-show" ).each(function(){
				var title_el = jQuery(this);
				var anchor_el = title_el.find( "a" ).first();
				var title = ( title_el.hasClass( "linkful" ) ) ? fixTitle( anchor_el.text() ) : fixTitle( title_el.text() );
				var link = ( title_el.hasClass( "linkful" ) ) ? linkIdentifier( anchor_el.attr( "href" ) ) : null;
				addShow( title, link );
				title_el.removeClass( "hrtu_release_page_highlight_new" );
				sideBar();
			});
		});

		// toggle saved items
		jQuery( "#hrtu_view_saved" ).unbind( "click" ).on( "click", function(){
			var el = jQuery(this);
			el.toggleClass( "selected" );
			if ( el.hasClass( "selected" ) )
				jQuery( ".ind-show.hrtu_release_page_highlight" ).show();
			else
				jQuery( ".ind-show.hrtu_release_page_highlight" ).hide();
		});

		// toggle unsaved items
		jQuery( "#hrtu_view_unsaved" ).unbind( "click" ).on( "click", function(){
			var el = jQuery(this);
			el.toggleClass( "selected" );
			if ( el.hasClass( "selected" ) )
				jQuery( ".ind-show:not( .hrtu_release_page_highlight ):not( .hrtu_release_page_highlight_new )" ).show();
			else
				jQuery( ".ind-show:not( .hrtu_release_page_highlight ):not( .hrtu_release_page_highlight_new )" ).hide();
		});

		// toggle new items
		jQuery( "#hrtu_view_new" ).unbind( "click" ).on( "click", function(){
			var el = jQuery(this);
			el.toggleClass( "selected" );
			if ( el.hasClass( "selected" ) )
				jQuery( ".ind-show.hrtu_release_page_highlight_new" ).show();
			else
				jQuery( ".ind-show.hrtu_release_page_highlight_new" ).hide();
		});

	}

	jQuery( ".ind-show" ).each(function(){
		var title_el = jQuery(this);
		var anchor_el = title_el.find( "a" ).first();
		var title = ( title_el.hasClass( "linkful" ) ) ? fixTitle( anchor_el.text() ) : fixTitle( title_el.text() );
		var link = ( title_el.hasClass( "linkful" ) ) ? linkIdentifier( anchor_el.attr( "href" ) ) : null;
		//var title = fixTitle( anchor_el.text() );
		//var link = linkIdentifier( anchor_el.attr( "href" ) );
		anchor_el.text( title );

		if ( title_el.hasClass( "linkless" ) )
			anchor_el = title_el;

		if ( isUserShow( title, link ) )
			title_el.addClass( "hrtu_release_page_highlight" );
		else
			title_el.removeClass( "hrtu_release_page_highlight" );

		if ( ! anchor_el.find( '.hrtu_release_page_toggle' ).length ) {
			anchor_el.append( '<div class="hrtu_release_page_toggle"></div>' );
			anchor_el.unbind( "click.hrtu_release_page_toggle" ).on( "click.hrtu_release_page_toggle", ".hrtu_release_page_toggle", function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				// parent code here isn't working for .linkless items
				var parent_el = ( jQuery(this).parent().hasClass( "linkless" ) ) ? jQuery(this).parent() : jQuery(this).parent().parent();
				var is_saved = parent_el.hasClass( "hrtu_release_page_highlight" );
				if ( is_saved ) {
					removeUserShow( title, link );
					hrtuSidebarRemoveShow( title );
					parent_el.removeClass( "hrtu_release_page_highlight" );
				}
				else {
					addUserShow( title, link );
					parent_el.addClass( "hrtu_release_page_highlight" ).removeClass( "hrtu_release_page_highlight_new" );
				}
				sideBar();
			});
		}

		/* set up new show */
		if ( ! isAllShow( title, link ) ) {
			title_el.addClass( "hrtu_release_page_highlight_new" );
			if ( ! anchor_el.find( '.hrtu_release_page_toggle_new' ).length ) {
				anchor_el.append( '<div class="hrtu_release_page_toggle_new"></div>' );
				anchor_el.unbind( "click.hrtu_release_page_toggle_new" ).on( "click.hrtu_release_page_toggle_new", ".hrtu_release_page_toggle_new", function(e){
					e.stopImmediatePropagation();
					e.preventDefault();
					addShow( title, link );
					jQuery(this).parent().parent().removeClass( "hrtu_release_page_highlight_new" );
					sideBar();
				});
			}
		}
		else
			title_el.removeClass( "hrtu_release_page_highlight_new" );
	});
	
}

function showPage() {

	jQuery( "article" ).each(function(){
		var el = jQuery(this);
		var title = encodeURIComponent( el.find( "> header .entry-title" ).text() );
		var info_el = el.find( ".series-info" );
		if ( ! info_el.find( ".hrtu_show_outbound_links" ).length ) {
			info_el.append(
				'<div class="hrtu_show_outbound_links">' +
				'	<a class="hrtu_show_outbound_link" href="https://anidb.net/perl-bin/animedb.pl?adb.search='+ title +'&show=animelist&do.search=search">aniDB</a>' +
				'	<a class="hrtu_show_outbound_link" href="https://www.anime-planet.com/anime/all?name='+ title +'">Anime-Planet</a>' +
				'	<a class="hrtu_show_outbound_link" href="https://myanimelist.net/anime.php?q='+ title +'">MAL</a>' +
				'	<a class="hrtu_show_outbound_link" href="https://hummingbird.me/search?query='+ title +'">Hummingbird</a>' +
				'</div>'
			);
		}
	});
	
}

function splashPage() {

	waitForElement( ".episodecontainer .latest .release-info", function( element ){

		element.each(function(){
			var el = jQuery(this).find( "tr" );
			var link_el = el.find( "td.rls-label a" );
			if ( ! link_el.length )
				return true;
			var link = linkIdentifier( link_el.attr( "href" ) );
			if ( isUserShow( null, link ) )
				el.addClass( "hrtu_release_page_highlight" );
		});

	});

}

function showAlert( message ) {

	jQuery( "body" ).append( '<div id="hrtu_alert">'+ message +'</div>' );
	jQuery( "#hrtu_alert .close" ).unbind( "click" ).on( "click", function(){
		jQuery(this).parent().slideUp();
	});
	
}

function waitForElement( identifier, callback ) {
	var give_up = 400;
	var interval = setInterval(function(){
		var el = jQuery( identifier );
		if ( el.length ) {
			clearInterval( interval );
			callback( el );
		}
		else if ( --give_up < 0 ) {
			clearInterval( interval );
			callback( false );
		}
	}, 300 );
}


/* Userscript Logic */

updateVersion();

addStyles();
sideBar();
if ( window.location.pathname == '/' )
	splashPage();
else if ( window.location.pathname == '/release-schedule/' )
	releasePage();
else if ( /\/shows\/./.test( window.location.pathname ) )
	showPage();
else if ( /\/(shows|current-season)\/?$/.test( window.location.pathname ) )
	allShowsPage();

setInterval( function(){
	sideBar();
	if ( window.location.pathname == '/release-schedule/' )
		releasePage();
}, 30000 );
