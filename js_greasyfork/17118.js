// ==UserScript==
// @name         Instagram List Links
// @namespace    instagram_list_links
// @description  Userscript that lets you back up your instagram media
// @homepageURL  https://github.com/daraeman/instagram_list_links
// @author       daraeman
// @version      1.1.1
// @date         2016-03-10
// @include      /^https?:\/\/www\.instagram\.com\/.*\/?$/
// @exclude      /^https?:\/\/www\.instagram\.com\/?$/
// @exclude      /^https?:\/\/www\.instagram\.com\/(explore|accounts|emails).*\/?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17118/Instagram%20List%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/17118/Instagram%20List%20Links.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function doScroll( scroll_duration ) {
	scroll_duration = scroll_duration || 500;
	jQuery( "html, body" ).animate({
		scrollTop: ( jQuery( document ).height() - jQuery( window ).height() )
	}, scroll_duration );
}

function scrollToNextPage() {
	var scroll_duration = 500;
	doScroll( scroll_duration );
	setTimeout(function(){
		var loop = 0,
			wait = 200;
		var max_loops = ( ( 1000 / wait ) * 60 );
		interval = setInterval(function(){
			loop++;
			if ( loop == max_loops ) {
				clearInterval( interval );
				getImages(function( a ) {
					printImages( a );
				});
			}
			else if ( ! isStillLoading() ) {
				if ( last_document_height != jQuery( document ).height() ) {
					last_document_height = jQuery( document ).height();
					clearInterval( interval );
					scrollToNextPage();
				}
				else {
					clearInterval( interval );
					getImages(function( a ) {
						printImages( a );
					});
				}
			}
		}, wait );
	}, scroll_duration );
}

function isStillLoading() {
	var check = false;
	jQuery( "a" ).each(function(){
		if ( /Loading more/i.test( jQuery(this).text() ) ) {
			check = true;
			return false;
		}
	});
	return check;
}

function getImages( callback ) {
	jQuery( "img" ).each(function(){
		var el = jQuery(this);
		var id = el.attr( "id" );
		if ( /^pImage/.test( id ) ) {
			var all_check = el.parent().parent().parent()[0].nodeName.toLowerCase() == "a";
			if ( all_check ) {
				var video_check = el.parent().parent().next().find( "span" );
				if ( /video/i.test( video_check.text() ) ) {
					videos.push({
						el: el.parent().parent().parent()
					});
				}
				else {
					images.push({
						src: el.attr( "src" ),
						text: el.attr( "alt" )
					});
				}
			}
		}
	});

	if ( videos.length ) {
		getVideoLinks(function(){
			printImages();
		});
	}
}

function getVideoLinks( callback ) {
	var videos_left = ( videos.length - 1 );
	var in_view = false;
	var current_video = 0;
	var max_retry = 20;
	var current_retry = 0;
	var interval_a = setInterval(function(){
		if ( ! in_view ) {
			videos[ current_video ].el[0].click();
			in_view = true;
		}
		else {
			var button = getCloseButton();
			if ( button.length ) {
				var src = jQuery( "video" ).attr( "src" );
				videos[ current_video ].src = src;
				button[0].click();
				in_view = false;
				if ( videos_left === 0 ) {
					clearInterval( interval_a );
					callback();
				}
				videos_left--;
				current_video++;
			}
			else {
				if ( current_retry == max_retry ) {
					current_retry = 0;
					in_view = false;
				}
				else {
					current_retry++;
				}
			}
		}
	}, video_interval_duration );
}


function printImages() {
	var img_txt = "";
	for ( var i = 0; i < images.length; i++ )
		img_txt += images[ i ].src + "\n";

	var vid_txt = "";
	for ( var i = 0; i < videos.length; i++ )
		vid_txt += videos[ i ].src + "\n";

	jQuery( "#react-root main" ).append( '<textarea style="width:90%;margin:30px auto;">'+ img_txt +'</textarea><textarea style="width:90%;margin:30px auto;">'+ vid_txt +'</textarea>' );
}

function getCloseButton() {
	var button = false;
	jQuery( "button" ).each(function(){
		if ( /close/i.test( jQuery(this).text() ) ) {
			button = jQuery(this);
			return false;
		}
	});
	return button;
}

function main(){
	var load_more = false;
	jQuery( "a" ).each(function(){ if ( /Load more/i.test( jQuery(this).text() ) ) load_more = jQuery(this); });

	if ( load_more ) {
		last_document_height = jQuery( document ).height();
		load_more[0].click();
		scrollToNextPage();
	}
}

function isPrivate() {
	if ( window._sharedData.entry_data.ProfilePage[0].user.is_private )
		return ! window._sharedData.entry_data.ProfilePage[0].user.followed_by_viewer;
	return false;
}

function init() {
	if ( isPrivate() )
		return false;

	button = jQuery( '<div style="position: absolute; right: 0px; padding: 9px 27px; border: 1px solid rgb( 235,235,235 ); color: rgb( 170,170,170 ); background: rgb( 255,255,255 ); z-index: 1000; cursor: pointer;">List Links</div>' )
				.click(function(){
					main();
				});
	jQuery( "nav" ).first().append( button );
	button.css( "bottom", -( button.outerHeight() ) + "px" );
}

console.log( "Instagram List Links userscript loaded" );

var last_document_height,
	interval,
	images = [],
	videos = [],
	button,
	video_interval_duration = 500;

init();
