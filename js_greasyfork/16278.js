// ==UserScript==
// @name         Mixlr Download Showreel
// @namespace    mixlr_download_showreel
// @description  Add links to download Showreel broadcasts on Mixlr.
// @homepageURL  https://github.com/daraeman/mixlr_download_showreel
// @author       daraeman
// @version      1.5
// @date         2017-03-01
// @include      /^https?:\/\/mixlr\.com\/.*\/showreel\/*/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16278/Mixlr%20Download%20Showreel.user.js
// @updateURL https://update.greasyfork.org/scripts/16278/Mixlr%20Download%20Showreel.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict( true );

function addStyles() {
	$( 'head' ).append(
		'<style type="text/css">' +
		'	.mds .mixlr_player .social_links .mixlr_download_showreel_download {' +
		'		color: rgb( 200,200,200 );' +
		'		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAV1BMVEUAAACkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSzvKEUAAAAHHRSTlMAAQUHCQoRGBkcHz9AUFZecYCVqLTK0dPp7ff5cWDvugAAAGlJREFUGNO1zckKwCAMBNDYfdfui/n/76xKDFZKbx1yGB7oAHyk0YhLjB2a/I3JiRzJOrFdFaPwetXBB6QPI43MaWCje7inQpbQu34UQBNbDjBQbz2inndfO8AwKrMX4arstTQUxgy95Qa+KRMWu5MJ+wAAAABJRU5ErkJggg==");' +
		'		background-position: center center;' +
		'		width: 20px;' +
		'		height: 20px;' +
		'	}' +
		'	.mds .mixlr_player .social_links .mixlr_download_showreel_download:hover {' +
		'		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAV1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////+ORg7oAAAAHHRSTlMAAQUHCQoRGBkcHz9AUFZecYCVqLTK0dPp7ff5cWDvugAAAGlJREFUGNO1zckKwCAMBNDYfdfui/n/76xKDFZKbx1yGB7oAHyk0YhLjB2a/I3JiRzJOrFdFaPwetXBB6QPI43MaWCje7inQpbQu34UQBNbDjBQbz2inndfO8AwKrMX4arstTQUxgy95Qa+KRMWu5MJ+wAAAABJRU5ErkJggg==");' +
		'	}' +
		'	.mds .mixlr_player .social_links .mixlr_download_showreel_state {' +
		'		color: rgb( 200,200,200 );' +
		'		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA6lBMVEUAAACkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKQzxDvQAAAATXRSTlMAAQIDBQYHCQ8TFBUYGhwdHiAhIyQlJygpKi0xNTdBQkdKUFFVVlljZmlseH6Aj6Cipqitsre5vsXHyszOz9HT1dfZ2ubp7fHz9fn7/TY7Zi8AAADHSURBVBgZXcELO8JgAIbhZ1tFRYXImRxCy5nIKSSrtvf//x1f33bZ6r6JuY2W77caLimvHcqaXHgkSgP9+ypi1SJlhBWMwlAzfvLAnebcQFkZTwv7kkqcK9X14FA6oyvpujmW8eACu9Ijv9IVLI2kexdYnUhDxlIVKAe3DrAeShrxJj3ngEUH2IxkvHIp6SWHtR1pqsOWjPc8xo5iGzgDGf0C7Cn2Caxo6rt4oEQN41QzjrBOlHFMotJX4mOZVN3vBUHPX8P6A0whSSzOxThUAAAAAElFTkSuQmCC");' +
		'		background-position: center center;' +
		'		width: 20px;' +
		'		height: 20px;' +
		'	}' +
		'	.mds .mixlr_player .social_links .mixlr_download_showreel_state:hover {' +
		'		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA6lBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Le70HAAAATXRSTlMAAQIDBQYHCQ8TFBUYGhwdHiAhIyQlJygpKi0xNTdBQkdKUFFVVlljZmlseH6Aj6Cipqitsre5vsXHyszOz9HT1dfZ2ubp7fHz9fn7/TY7Zi8AAADHSURBVBgZXcELO8JgAIbhZ1tFRYXImRxCy5nIKSSrtvf//x1f33bZ6r6JuY2W77caLimvHcqaXHgkSgP9+ypi1SJlhBWMwlAzfvLAnebcQFkZTwv7kkqcK9X14FA6oyvpujmW8eACu9Ijv9IVLI2kexdYnUhDxlIVKAe3DrAeShrxJj3ngEUH2IxkvHIp6SWHtR1pqsOWjPc8xo5iGzgDGf0C7Cn2Caxo6rt4oEQN41QzjrBOlHFMotJX4mOZVN3vBUHPX8P6A0whSSzOxThUAAAAAElFTkSuQmCC");' +
		'	}' +
		'	.mds .mixlr_player .social_links .mixlr_download_showreel_state.checked {' +
		'		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA6lBMVEUAAAAOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUOyRUG8FaoAAAATXRSTlMAAQIDBQYHCQ8TFBUYGhwdHiAhIyQlJygpKi0xNTdBQkdKUFFVVlljZmlseH6Aj6Cipqitsre5vsXHyszOz9HT1dfZ2ubp7fHz9fn7/TY7Zi8AAADHSURBVBgZXcELO8JgAIbhZ1tFRYXImRxCy5nIKSSrtvf//x1f33bZ6r6JuY2W77caLimvHcqaXHgkSgP9+ypi1SJlhBWMwlAzfvLAnebcQFkZTwv7kkqcK9X14FA6oyvpujmW8eACu9Ijv9IVLI2kexdYnUhDxlIVKAe3DrAeShrxJj3ngEUH2IxkvHIp6SWHtR1pqsOWjPc8xo5iGzgDGf0C7Cn2Caxo6rt4oEQN41QzjrBOlHFMotJX4mOZVN3vBUHPX8P6A0whSSzOxThUAAAAAElFTkSuQmCC");' +
		'	}' +
		'	#mds_options {' +
		'		position: absolute;' +
		'		right: 0px;' +
		'		bottom: 0px;' +
		'	}' +
		'	#mds_options > div {' +
		'		cursor: pointer;' +
		'		display: inline-block;' +
		'		background: rgb( 190,190,190 );' +
		'		color: rgb( 255,255,255 );' +
		'		padding: 3px 11px 1px;' +
		'		margin: 0px 2px;' +
		'	}' +
		'	#mds_options > div:last-child {' +
		'		margin-right: 0px;' +
		'	}' +
		'	#mds_options.all_marked #mds_list_links {' +
		'		pointer-events: none;' +
		'		background: rgb( 220,220,220 );' +
		'	}' +
		'	#mds_list_links_box {' +
		'		position: relative;' +
		'		top: -3px;' +
		'		width: 100%;' +
		'		border: 1px solid #ccc;' +
		'		border-bottom-width: 0px;' +
		'		height: 0px;' +
		'	}' +
		'</style>'
	);
	$( 'body' ).addClass( "mds" );
}

function addLinks() {
	for ( i = 0; i < broadcasts.length; i++ ) {
		var el = $( '.mixlr_player[data-broadcast_id="'+ broadcasts[i].id +'"]' );
		var social_links = el.find( '.player_header .social_links' );
		social_links.append( '<li><a class="mixlr_download_showreel_download" href="'+ broadcasts[i].streams.http.url +'" download="'+ broadcasts[i].user_slug +'_'+ broadcasts[i].title.replace( /[^\w]/g, '' ) +'.mp3"></a></li>' );
		social_links.append( '<li><a class="mixlr_download_showreel_state"></a></li>' );
	}
}

function addTriggers() {
	$( '.mixlr_player .social_links .mixlr_download_showreel_state' ).click(function(){
		var el = $(this);
		var id = el.parent().parent().parent().parent().attr( "data-broadcast_id" );
		if ( el.hasClass( "checked" ) ) {
			unmarkDownloaded( id, el );
			if ( ! allDownloadedCheck() )
				unsetAllDownloadedFlag();
		}
		else {
			markDownloaded( id, el );
			if ( allDownloadedCheck() ) {
				setAllDownloadedFlag();
				hideLinksBox();
				updateLinksBox();
			}
		}
		updateLinksBox();
	});
}

function markDownloaded( id, el ) {
	el.addClass( "checked" );
	saved[ id ] = 1;
	saveDataLocal();
}

function unmarkDownloaded( id, el ) {
	el.removeClass( "checked" );
	delete saved[ id ];
	saveDataLocal();
}

function saveDataLocal() {
	localStorage.setItem( saved_local_key, JSON.stringify( saved ) );
}

function markAllDownloaded() {
	$( '.mixlr_player .social_links .mixlr_download_showreel_state' ).each(function(){
		var el = $(this);
		var id = el.parent().parent().parent().parent().attr( "data-broadcast_id" );
		markDownloaded( id, el );
	});
	setAllDownloadedFlag();
	hideLinksBox();
	updateLinksBox();
}

function unmarkAllDownloaded() {
	$( '.mixlr_player .social_links .mixlr_download_showreel_state' ).each(function(){
		var el = $(this);
		var id = el.parent().parent().parent().parent().attr( "data-broadcast_id" );
		unmarkDownloaded( id, el );
	});
	unsetAllDownloadedFlag();
	updateLinksBox();
}

function setAllDownloadedFlag() {
	$( '#mds_options' ).addClass( "all_marked" );
	$( '#mds_mark_all' ).text( "Unmark All Downloaded" );
}

function unsetAllDownloadedFlag() {
	$( '#mds_options' ).removeClass( "all_marked" );
	$( '#mds_mark_all' ).text( "Mark All Downloaded" );
}

function allDownloadedCheck() {
	var check = true;
	$( '.mixlr_player .social_links .mixlr_download_showreel_state' ).each(function(){
		if ( ! $(this).hasClass( "checked" ) ) {
			check = false;
			return false;
		}
	});
	return check;
}

function updateSavedView() {
	$( '.mixlr_player' ).each(function(){
		var el = $(this);
		if ( saved[ el.attr( 'data-broadcast_id' ) ] )
			el.find( '.social_links .mixlr_download_showreel_state' ).addClass( "checked" );
		else
			el.find( '.social_links .mixlr_download_showreel_state' ).removeClass( "checked" );
	});
}

function addBottomNav() {
	$( '.big_wrapper .pagination' ).first().clone( true ).insertAfter( $( ".showreel-list" ) );
}

function getLinks( all ) {
	var links = '';
	for ( i = 0; i < broadcasts.length; i++ ) {
		if ( ! saved[ broadcasts[i].id ] || all )
			links += broadcasts[i].streams.http.url +"\n";
	}
	return links || "All Links have already been downloaded";
}

function updateLinksBox() {
	$( "#mds_list_links_box" ).text( getLinks() );
}

function addOptionsBox() {

	var list_options_box = $( '<div id="mds_options"></div>' );
	var list_links_button = $( '<div id="mds_list_links">List Links</div>' );
	var mark_all_button = $( '<div id="mds_mark_all">Mark All Downloaded</div>' );
	list_options_box.append( mark_all_button );
	list_options_box.append( list_links_button );
	$( "#title" ).append( list_options_box );

	var list_links_box = $( '<textarea id="mds_list_links_box"></textarea>' );
	$( "#title" ).append( list_links_box );

	list_options_box.css( "top", list_options_box.position().top );

	list_links_button
		.click(function(){
			if ( $(this).hasClass( "expanded" ) )
				hideLinksBox();
			else
				showLinksBox();
		});

	mark_all_button
		.click(function(){
			if ( ! $(this).parent().hasClass( "all_marked" ) )
				markAllDownloaded();
			else
				unmarkAllDownloaded();
		});
}

function hideLinksBox() {
	$( "#mds_list_links" )
		.removeClass( "expanded" )
		.text( "List Links" );

	$( '#title' ).animate({
		"height": ""
	});
	$( "#mds_list_links_box" )
		.animate({
			"height": "0px"
		});
}

function showLinksBox() {
	$( "#mds_list_links" )
		.addClass( "expanded" )
		.text( "Hide Links" );

	$( '#title' ).animate({
		"height": ( $( '#title' ).outerHeight() + 100 ) + "px"
	});
	$( "#mds_list_links_box" )
		.animate({
			"height": "100px"
		});
}

var saved_local_key = 'mixlr_download_showreel_save_state';
var try_number = 0;
var max_tries = 1000;
var last_id = broadcasts[ broadcasts.length - 1 ].id;
var saved = JSON.parse( localStorage.getItem( saved_local_key ) );
if ( ! saved )
	saved = {};

var wait_for_mixlr_to_load_interval = setInterval(function(){
	if ( $( '.mixlr_player[data-broadcast_id="'+ last_id +'"]' ).length ) {
		addStyles();
		addLinks();
		addTriggers();
		updateSavedView();
		addBottomNav();
		addOptionsBox();
		if ( allDownloadedCheck() )
			setAllDownloadedFlag();
		else
			updateLinksBox();
		clearInterval( wait_for_mixlr_to_load_interval );
	}
	if ( try_number++ > max_tries )
		clearInterval( wait_for_mixlr_to_load_interval );
}, 250 );
