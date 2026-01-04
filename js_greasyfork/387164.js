// ==UserScript==
// @name         Youtube Timestamp Buttons from Comments
// @namespace    http://greasyfork.org
// @version      0.6
// @description  Uses FireBase Helper Function to Call Youtube Data API 3 to get Comments with TimeStamps
// @author       636597
// @include      *://*youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387350/Youtube%20Timestamp%20Buttons%20from%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/387350/Youtube%20Timestamp%20Buttons%20from%20Comments.meta.js
// ==/UserScript==

var button_menu_element = false;
var load_button_element = false;
var next_button_element = false;
var previous_button_element = false;

var time_stamp_data_paragraph_parent_element = false;
var time_stamp_data_paragraph_element = false;
var time_stamp_button_elements = [];

var current_video_id = false;
var current_video_duration = false;
var current_playlist_circular_array = false;
var x1_player = undefined;

var comment_map = {};

// https://stackoverflow.com/a/18359711
function add_custom_css() {
	var custom_css = `
		.tooltip-container:hover .tooltip {
			display: inline;
		}
		.tooltip {
			display: none;  /* NEW */
			background: #C8C8C8;
			margin-left: 28px;
			padding: 10px;
			position: absolute;
			z-index: 1000;
			width:200px;
			height:100px;
		}
		.tooltip-container {
			display: inline;
		}
	`;
	var styleSheet = document.createElement("style")
	styleSheet.type = "text/css"
	styleSheet.innerText = custom_css;
	document.head.appendChild(styleSheet)
}

var window_history_oberver = false;
function load_window_history_observer() {
	CustomLog( "Initializing Window History Poller" );
	window_history_oberver = setInterval( function() {
		if ( !current_video_id ) { return; }
		var url_string = null;
		var now_playing_id = null;
		try {
			url_string = x1_player.getVideoUrl();
			now_playing_id = url_string.split( "v=" )[ 1 ].split( "&" )[ 0 ];
		}
		catch( error ) { return; }
		if ( now_playing_id !== current_video_id ) {
			CustomLog( "Detected New Video ID" );
			CustomLog( "Resetting Time Stamps" );
			current_video_id = now_playing_id;
			setTimeout( function() {
				load_comments_from_firebase_helper( { skip: "yes" , override_id: now_playing_id } );
			} , 3000 );
		}
	} , 1000 );
}

function CustomLog( message ) {
	console.log( "YoutubeTimestampButtons.js === " + message );
}

function CircularArrayIterator( list , starting_index ) {
	if ( !list ) { return false; }
	if ( list.length < 1 ) { return false; }
	const llen = list.length;
	return {
		current_index: starting_index || 0 ,
		list: list ,
		list_length: llen ,
		push: function( item , index ) {
			if ( !item ) { return; }
			if ( index ) {
				this.list.splice( index , 0 , item );
			}
			else {
				this.list.push( item );
			}
			this.list_length += 1;
		} ,
		pop: function( index ) {
			if ( index ) {
				this.list.splice( index , 1 );
			}
			else {
				this.list.pop();
			}
			this.list_length -= 1;
		} ,
		current: function() {
			return this.list[ this.current_index ];
		} ,
		next: function() {
			CustomLog( "next" );
			this.current_index += 1;
			if ( this.current_index > ( this.list_length - 1 ) ) {
				this.current_index = 0;
			}
			return this.list[ this.current_index ];
		} ,
		next_index: function() {
			CustomLog( "next index" );
			this.current_index += 1;
			if ( this.current_index > ( this.list_length - 1 ) ) {
				this.current_index = 0;
			}
			return this.current_index;
		} ,
		previous: function() {
			CustomLog( "previous" );
			this.current_index -= 1;
			if ( this.current_index < 0 ) {
				this.current_index = ( this.list_length - 1 );
			}
			return this.list[ this.current_index ];
		} ,
		previous_index: function() {
			CustomLog( "previous index" );
			this.current_index -= 1;
			if ( this.current_index < 0 ) {
				this.current_index = ( this.list_length - 1 );
			}
			return this.current_index;
		}
	};
}

function removeDuplicates(originalArray, prop) {
	var newArray = [];
	var lookupObject  = {};

	for( var i in originalArray ) {
		lookupObject[originalArray[i][prop]] = originalArray[i];
	}

	for(i in lookupObject) {
		newArray.push(lookupObject[i]);
	}
	return newArray;
}

// function playlist_next() {
// 	CustomLog( "NEXT()" );
// 	if ( !x1_player ) { return; }
// 	var current_time = x1_player.getCurrentTime();
// 	if ( !current_time ) { return; }
// 	current_time = parseInt( current_time );
// 	CustomLog( "CURRENT TIME === " + current_time.toString() );
// 	CustomLog( "CURRENT === [ " + ( current_playlist_circular_array.current_index + 1 ).toString() + " ] of " + current_playlist_circular_array.list_length.toString() + " === " + current_playlist_circular_array.list[ current_playlist_circular_array.current_index ].url_seconds.toString() );
// 	console.log( current_playlist_circular_array.list[ current_playlist_circular_array.current_index ] );

// 	var current_url_seconds = current_playlist_circular_array.list[ current_playlist_circular_array.current_index ].url_seconds;
// 	var current_item = current_playlist_circular_array.list[ current_playlist_circular_array.current_index ];
// 	while ( current_url_seconds <= current_time ) {
// 		CustomLog( "current_url_seconds <= current_time" );
// 		CustomLog( current_url_seconds.toString() + " <= " + current_time.toString() );
// 		CustomLog( "current_index === " + current_playlist_circular_array.current_index.toString() );
// 		CustomLog( "Current Item === " );
// 		console.log( current_item );
// 		CustomLog( "NEXT()" );
// 		current_playlist_circular_array.next_index();
// 		current_item = current_playlist_circular_array.list[ current_playlist_circular_array.current_index ];
// 		current_url_seconds = current_item.url_seconds;
// 		CustomLog( current_url_seconds.toString() + " <= " + current_time.toString() );
// 		CustomLog( "current_index === " + current_playlist_circular_array.current_index.toString() );
// 		CustomLog( "Current Item === " );
// 		console.log( current_item );
// 		if ( current_playlist_circular_array.current_index === 0 ) { break; }
// 	}
// 	//next = current_playlist_circular_array.next();
// 	CustomLog( "NEXT()-FINAL === [ " + ( current_playlist_circular_array.current_index + 1 ).toString() + " ] of " + current_playlist_circular_array.list_length.toString() );
// 	console.log( current_item );

// 	x1_player.loadVideoById( current_video_id , current_item.url_seconds );
// }

// function playlist_previous() {
// 	CustomLog( "PREVIOUS()" );
// 	if ( !x1_player ) { return; }
// 	var current_time = x1_player.getCurrentTime();
// 	if ( !current_time ) { return; }
// 	current_time = parseInt( current_time );
// 	CustomLog( "CURRENT TIME === " + current_time.toString() );
// 	CustomLog( "CURRENT === [ " + ( current_playlist_circular_array.current_index + 1 ).toString() + " ] of " + current_playlist_circular_array.list_length.toString() );
// 	while ( current_time > current_playlist_circular_array.list[ current_playlist_circular_array.current_index ].url_seconds ) {
// 		CustomLog( "current_time > current_index" );
// 		current_playlist_circular_array.previous_index();
// 		CustomLog( "CURRENT === [ " + ( current_playlist_circular_array.current_index + 1 ).toString() + " ] of " + current_playlist_circular_array.list_length.toString() );
// 		if ( current_playlist_circular_array.current_index === current_playlist_circular_array.list_length ) { break; }
// 	}
// 	//next = current_playlist_circular_array.next();
// 	CustomLog( "CURRENT === [ " + ( current_playlist_circular_array.current_index + 1 ).toString() + " ] of " + current_playlist_circular_array.list_length.toString() );

// 	x1_player.loadVideoById( current_video_id , current_playlist_circular_array.list[ current_playlist_circular_array.current_index ].url_seconds );
// }

function playlist_seek( seconds ) {
	CustomLog( "SEEKING TO === " + seconds.toString() );
	x1_player.loadVideoById( current_video_id , seconds );
}

function add_paragraph_with_time_stamp_data() {
	time_stamp_data_paragraph_parent_element = document.querySelector( "ytd-comments#comments" );
	if ( time_stamp_data_paragraph_parent_element ) {
		time_stamp_data_paragraph_parent_element = time_stamp_data_paragraph_parent_element.parentElement;
		var reversed = current_playlist_circular_array.list;
		reversed.reverse();
		for ( var i = 0; i < reversed.length; ++i ) {
			var id = "x1_p_ts_entry_" + i.toString();
			var p_string =`<div class="tooltip-container"><button id="${ id }">${ reversed[ i ].time_string }</button><span class="tooltip">${ comment_map[ reversed[ i ].url_seconds.toString() ] }</span></div>`;
			//CustomLog( p_string );
			var template = document.createElement( 'template' );
			template.innerHTML = p_string;
			var fragment = template.content
			//time_stamp_data_paragraph_parent_element.appendChild( fragment );
			time_stamp_data_paragraph_parent_element.insertBefore( fragment ,  time_stamp_data_paragraph_parent_element.childNodes[ 3 ] );
			var b_elem = document.body.querySelector( "#" + id );
			b_elem.setAttribute( "url_seconds" , current_playlist_circular_array.list[ i ].url_seconds );
			//b_elem.setAttribute( "playlist_index" , reversed[ i ].index );
			b_elem.addEventListener( "click" , function( event ) {
				//current_playlist_circular_array.current_index = parseInt( this.getAttribute( "playlist_index" ) );
				playlist_seek( parseInt( this.getAttribute( "url_seconds" ) ) );
			});
			time_stamp_button_elements.push( b_elem );
		}
	}
	load_button_element.style.visibility = "visible";
	if ( !window_history_oberver ) { load_window_history_observer(); }
}

function add_previous_next_buttons() {
	if ( button_menu_element ) {
		button_menu_element.insertAdjacentHTML( 'beforeend' , '<button id="x1_playlist_previous">Previous</button>' );
		previous_button_element = document.body.querySelector( "#x1_playlist_previous" );
		previous_button_element.addEventListener( "click" , playlist_previous );
		button_menu_element.insertAdjacentHTML( 'beforeend' , '<button id="x1_playlist_next">Next</button>' );
		next_button_element = document.body.querySelector( "#x1_playlist_next" );
		next_button_element.addEventListener( "click" , playlist_next );
	}
}

function load_keyboard_watchers() {
	add_previous_next_buttons();
	add_paragraph_with_time_stamp_data();
	// TODO: Need To figure out Javscript Circular List, COGGERS FailFish
	/*
	document.body.addEventListener( "keydown" , function( event ) {
		if ( event.key === "n" ) {
			playlist_next();
		}
		else if ( event.key === "b" ) {
			playlist_previous();
		}
	});
	*/
}

function get_video_stats() {
  var url_string = x1_player.getVideoUrl();
  current_video_id = url_string.split( "v=" )[ 1 ].split( "&" )[ 0 ];
  current_video_duration = x1_player.getDuration();
  /*
  current_playlist_id = url_string.split( "list=" );
  if ( current_playlist_id ) {
	if ( current_playlist_id.length > 1 ) {
		current_playlist_id = current_playlist_id[ 1 ].split( "&" )[ 0 ];
		current_playlist_index = x1_player.getPlaylistIndex();
		CustomLog( current_playlist_id );
		CustomLog( current_playlist_index );
	}
  }
  */
  CustomLog( current_video_id );
}

function parse_firebase_helper( comments ) {
	CustomLog( "Parsing Recieved Comment Data" );
	var final = [];
	for ( var i = 0; i < comments.length; ++i ) {
		if ( comments[ i ].time_stamp_parts ) {
			if ( comments[ i ].time_stamp_parts.length > 0 ) {
				var text = comments[ i ].text;
				for ( var j = 0; j < comments[ i ].time_stamp_parts.length; ++j ) {
					if ( comments[ i ].time_stamp_parts[ j ].url_seconds ) {
						var url_seconds_string = comments[ i ].time_stamp_parts[ j ].url_seconds.toString();
						if ( !comment_map[ url_seconds_string ] ) {
							comment_map[ url_seconds_string ] = text;
						}
					}
				}
				final.push( ...comments[ i ].time_stamp_parts );
			}
		}
	}
	console.log( comment_map );
	var uniqueArray = removeDuplicates( final , "url_seconds" );
	uniqueArray = uniqueArray.sort( ( a , b ) => {
		b.url_seconds - a.url_seconds
	});
	uniqueArray = uniqueArray.filter( x => x.url_seconds !== null );
	uniqueArray = uniqueArray.filter( x => x.url_seconds !== "null" );
	uniqueArray = uniqueArray.filter( x => x.url_seconds < current_video_duration );
	current_playlist_circular_array = false;
	current_playlist_circular_array = CircularArrayIterator( uniqueArray );
	add_custom_css();
	add_paragraph_with_time_stamp_data();
	console.log( uniqueArray );
}

var comment_count = "50";
var fburlb = atob( 'aHR0cHM6Ly91cy1jZW50cmFsMS1oZWxwZXItZTNkODYuY2xvdWRmdW5jdGlvbnMubmV0L3RpbWVzdGFtcHM/aWQ9' );
function load_comments_from_firebase_helper( options ) {
	reset_simple();
	var rebuild = true;
	if ( options ) {
		if ( options.skip ) {
			if ( options.skip === "yes" ) {
				current_video_id = options.override_id;
			}
		}
	}
	x1_player = document.getElementById( "movie_player" );
	if ( !x1_player ) { return; }
	get_video_stats();
	if ( !current_video_id ) { return; }
	load_button_element.style.visibility = "hidden";
	CustomLog( "Fetching Comments from FireBase Helper" );
	// fetch( 'https://us-central1-helper-e3d86.cloudfunctions.net/timestamps?id=' + current_video_id , {
	// 	headers: new Headers({
	// 		'Access-Control-Allow-Origin': '*' ,
	// 		'Access-Control-Allow-Headers':'application/json',
	// 		'Access-Control-Allow-Headers': 'Content-Type, Authorization'
	// 	})
	// })
	fetch( fburlb + current_video_id + "&count=" + comment_count )
	.then( response => response.json() )
	.then( data => {
		console.log( data );
		parse_firebase_helper( data.top_time_stamp_comments );
	})
	.catch(error => console.error(error))
}

function add_load_button() {
	button_menu_element = document.body.querySelector( "ytd-menu-renderer" );
	if ( button_menu_element ) {
		button_menu_element.insertAdjacentHTML( 'beforeend' , '<button id="x1_load_ts">Load Timestamps</button>' );
		load_button_element = document.body.querySelector( "#x1_load_ts" );
		load_button_element.addEventListener( "click" , load_comments_from_firebase_helper );
	}
}

function reset_simple() {
	try { next_button_element.parentNode.removeChild( next_button_element ); } catch( e ){}
	next_button_element = false;
	try { previous_button_element.parentNode.removeChild( previous_button_element ); } catch( e ){}
	previous_button_element = false;
	for ( var i = 0; i < time_stamp_button_elements.length; ++i ) {
		try { time_stamp_button_elements[ i ].parentNode.removeChild( time_stamp_button_elements[ i ] ); } catch( e ){}
	}
	//time_stamp_data_paragraph_parent_element = false;
	//time_stamp_data_paragraph_element = false;
	time_stamp_button_elements = [];
	current_video_id = false;
	current_video_duration = false;
	// current_playlist_id = false;
	// current_playlist_index = 0;
	// current_index = 0;
	// current_playlist = [];
	current_playlist_circular_array = undefined;
	x1_player = undefined;
	comment_map = false;
	comment_map = {};
}

function reset_all() {
	button_menu_element = false;
	try { load_button_element.parentNode.removeChild( load_button_element ); } catch( e ){}
	load_button_element = false;
	try { next_button_element.parentNode.removeChild( next_button_element ); } catch( e ){}
	next_button_element = false;
	try { previous_button_element.parentNode.removeChild( previous_button_element ); } catch( e ){}
	previous_button_element = false;
	try { time_stamp_data_paragraph_parent_element.parentNode.removeChild( time_stamp_data_paragraph_parent_element ); } catch( e ){}
	time_stamp_data_paragraph_parent_element = false;
	time_stamp_data_paragraph_element = false;
	time_stamp_button_elements = [];
	current_video_id = false;
	current_video_duration = false;
	//current_playlist_id = false;
	//current_playlist_index = 0;
	//current_index = 0;
	//current_playlist = [];
	current_playlist_circular_array = undefined;
	x1_player = undefined;
	comment_map = false;
	comment_map = {};
}

function init() {
	reset_all();
	CustomLog( "LOADING" );
	setTimeout(function(){
		add_load_button();
		//CustomLog( "LOADED" );
	} , 3000 );
}

(function() {
	window.addEventListener ( "load", init );
})();