// ==UserScript==
// @name        Eza's Universal Scraper
// @namespace   https://inkbunny.net/ezalias
// @description Gather all images from any page, on command
// @license     MIT
// @license     Public domain / no rights reserved
// @include     *
// @version     1.8
// @noframes
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420945/Eza%27s%20Universal%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/420945/Eza%27s%20Universal%20Scraper.meta.js
// ==/UserScript==

// Grab all images and image links - create simple html list of links - insert list at top of page. 

// My apologies to anyone reading this; it is a hot mess. But published beats perfect. 

// Aha: there IS multi-splitting, using regexes as the delimiter. E.g. "Hello awesome, world!".split(/[\s,]+/); for splittong on spaces and commas. 
// Stop scraping. Use document object model. 

// Try to find videos, too, like http://www.pornhub.com/view_video.php?viewkey=1098897412 - the mp4's in the source, but not linked except for subscribers 

// Imgur does some stupid crap with fake loading / unloading. That'd be fine for memory's sake - but the links also disappear. DownThemAll breaks and this only lists presently-onscreen images. 
// Images are still under "content" inside <meta property="og:image"> tags. 
// Tempted to just split(http) and filter for URLs with image-filetype extensions. 
// List Pixiv links because 'select -> open all in tabs' doesn't work anymore. (Eventually fix in Smoothener.) 
// Consider setting custom colors, at least for visited links. (Done.)
// Added NewGrounds because their gallery view is sort of terrible.
// For text files: document.body.innerHTML = document.body.innerHTML.split( /[\n ]/ ).filter( s => s.match( '//' ) ).map( s => '<a href=' + s + '>' + s + '</a><br>' ) 
// Support MP4s. 
// I'm considering getting rid of the link whitelist. Linking all image still goes first, and has purpose - but why not support all ordered links in gallery-like sites?
	// This thought leads back to old considerations of scraping all my various subscription pages on multiple websites. With text links, it's tractable.
	// The main obstacle, then as now, is domain origin policy. It -should- help that a script for this could run on each of those domains. 
// Hide visited links? display:none does not work. Neither does visibility:hidden. Uh... huh. 
	// https://stackoverflow.com/questions/20074015/a-visited-img-display-none - fuck's sake. "For privacy reasons," it's broken on purpose.
	// So there's probably no workaround like unlinking those links. Anything that could tell the site which other sites you've visited is a vulnerability. Shoot. 
	// 'Open unvisited links' would serve the same purpose. 
// booru.org
// Highlight MP4s. Give them a special class or some shit. 
// This occasionally gets 'script running too long' errors... and on weird sites. Like DuckDuckGo. Which is bizarre, since I don't think it runs anything at all until triggered. Even then there's no live HTML collection left spinning away. They get Array.from'd in a hurry. 
// Menuless access a la Gallery Swallower: insert a DOM element in the upper-left corner, thin enough it won't interfere with sensible website design. When clicked it changes classes. Put an interval in this script to check the length of a live HTML collection containing that class. When it's nonzero, clear the interval and show_links(). 
	// Ideally this is a button that slides out or has on-hover text indicating what the hell it does. It'll be useless on a touchscreen, but come on. 
// I commented on HFand "Link all images" appeared in my comment text. The button appeared in the comment iframe and I shrugged it off. This is cause to add //@noframes, obviously, but more importantly it makes me wonder what the fuck HF's comment code is doing and whether that's a vulnerability. 
// Given the appearance, consider releasing as "Eza's Scraping Notch." But then Universal Scraper is more descriptive. 

/*
. direct image links from 'eza's universal scraper' are so great on sites like Mastodon. no lag. no endless loading. I want that to work on pixiv, which is all lag and loading, because they use lazy js for fucking everything. 
	https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/05/17/13/37/33/81630978_p0_square1200.jpg 
	https://i.pximg.net/img-original/img/2020/05/17/13/37/33/81630978_p0.png 
	. so I'd have to link manga pages normally, or detect page count... but single images are trivial. 
*/

// Linux Mint addition: oh hey, e621 has trivial thumbnails. 
// https://static1.e621.net/data/preview/dc/07/dc07f1901445c35ab83c052493ec39d2.jpg
// https://static1.e621.net/data/dc/07/dc07f1901445c35ab83c052493ec39d2.png
// Fuck, file extension! 

// https://art.ngfiles.com/medium_views/1464000/1464020_bluebreed_veronica.png?f1602728027
// https://art.ngfiles.com/images/1464000/1464020_bluebreed_veronica.png?f1602727984 

// Change numbering: build forward list as numbered links / HTML strings, then reverse that list, so reversed numbers count back down. 

GM_registerMenuCommand( "Link all images at top of page", show_links );

// Put button on page, since menu is missing on later userscript plugins
var trigger = document.createElement( 'button' ); 
// Onclick, change class to some spinner, so it reacts instantly and looks like it's loading. Really the interval is waiting a second. 
// 	html += '<style> .reloader { background-color:#dbd7d8; border-radius: 50%; width: 60px; height: 60px; text-align: center; display: inline-block; border:1px solid #19ab19; cursor:pointer; line-height: 20px; color:#194d19; font-family:Arial; font-size:33px; padding: 10px 10px; text-decoration:none; } .reloader:hover { background-color:#2abd2a; } </style>';
trigger.style = "position: absolute; width: 90px; height: 30px; left:-85px; top: 5px; background-color:#303020; text-align: center; display: inline-block; border:1px solid #8080A0; cursor:pointer; line-height: 20px; color:#8080A0; font-family:Arial; font-size:10px; text-decoration:none; z-index: 1000000; overflow:hidden;" 		// Getting it to slide onscreen on-hover might require adding a proper 'style' element. :hover is a pseudoselector. 
	// Aaargh the button is affected by other CSS. Do I have to specify a bunch of useless parameters so they're ignored? 
	// Might be easier to not have text. 
	// Can I align it from the right-hand side? I want it mostly offscreen, I don't care what it looks like. 
	// Durrr set width and height. 
trigger.innerText = "Link all images"; 		// "Link all images" flows onto two lines when using right:99vw. Bleh. 
trigger.title = "Link all images at top of page"; 
// Text is WIP. Ideally work the word "visible" in there, since it's non-obvious. 
trigger.className = "ezas_unclicked_button"; 
//trigger.onclick = function(){ this.innerText='...'; this.className = 'ezas_clicked_button'; } 		// Immediate visible change, idempotent
trigger.onclick = function(){ this.style = 'display:none;'; this.className = 'ezas_clicked_button'; } 		// Immediate visible change, idempotent
document.body.appendChild( trigger ); 

// Injecting code into the page is nontrivial - ironically because function.toString is fragile - so just look for a change in the page. 
var button_check = document.getElementsByClassName( 'ezas_clicked_button' ); 
var fake_event = setInterval( function() {  
		if( button_check.length > 0 ) { 
			clearInterval( fake_event ); 
			show_links(); 
		} 
	}, 500 ); 		// 500 ms is an important threshold for action, and the tiny button instantly disappearing isn't cutting it. I wrote this and I'm tapping my foot. 


function show_links () { 
	var links = get_links(); 
	var block = new String; 
//	block += "<style> a { color: #BBA; } a:visited { color: #A1A; } </style>"; 		// This doesn't work, by the way.
//	block += "<style> .scraped a { color: #1BA; filter: drop-shadow( 0 0 3px #111 ); } .scraped a:visited { color: #A1A; } </style>";  
	block += "<style> .scraped a { color: #1BA; } .scraped a:visited { color: #A1A; } </style>";  
//	block += "<style> .scraped .universal a { color: #11A; } .scraped .universal a:visited { color: #A1A; } </style>";  
	// <span style=''>? Or at least span id and then id.a in a <style> thing. 
//	block += "<style> a { color: #BBBBAA; } a:visited { color: #AA11AA; visibility:hidden; display:none; } </style>"; 		// What the fuck. 
	// ##article:has-text(/Promoted/)
	block += "<style> a:has-text( /.mp4/ ) { color: #BFA; } a:has-text( /.mp4/ ):visited { color: #F1A; } </style>";  // Nope. Do /original as well once this works. 
	links.reverse(); 		// Reverse order. Should probably be an option instead of hardcoded, but this is already a hacky little thing. 
	block += "<span class='scraped'> "
	for( var n = 0; n < links.length; n++ ) {
		if( n!= 0 && n % 10 == 0 ) { block += "<br>"; } 
		block += "" + n + " <a class='universal' style:'display: none' href='" + links[n] + "'>" + links[n] + "</a>  <br>\n"; 
//		console.log( links[n] ); 
	}
	block += "</span>"; 
	document.body.innerHTML = block + document.body.innerHTML; 
}

function get_links() { 
	var urls = new Array;
/*
		// Grab links
	var links = document.getElementsByTagName( 'a' ); 
	for( var which in links ) { urls.push( "" + links[which] ); } 

		// Grab <meta content="url"> because Imgur 
	var links = document.getElementsByTagName( 'meta' ); 
	for( var which in links ) { urls.push( "" + links[which].content ); }  
*/
		// Bare image links first 
//	urls = urls.concat( Array.from( document.getElementsByTagName( 'a' ) ).map( v => v.href ) 
//		.filter( u => u.match('.jpg') || u.match('.png') || u.match('.gif') ) );

	urls = urls.concat( Array.from( document.getElementsByTagName( 'a' ) ).map( v => v.href ) ); 
	urls = urls.concat( Array.from( document.getElementsByTagName( 'meta' ) ).map( v => v.content ) ); 		// Imgur. <meta content="url"> nonsense.
/*
		// Filter URL list to exclude non-images
	for( var n = urls.length-1; n > 0; n-- ) { 		// Backwards
		var ditch = true;
		if( urls[n].indexOf( ".jpg" ) > 0 ) { ditch = false; } 
		if( urls[n].indexOf( ".jpeg" ) > 0 ) { ditch = false; } 
		if( urls[n].indexOf( ".png" ) > 0 ) { ditch = false; } 
		if( urls[n].indexOf( ".gif" ) > 0 ) { ditch = false; } 
		if( urls[n].indexOf( ".mp3" ) > 0 ) { ditch = false; } 
//		if( urls[n].indexOf( "/pictures/" ) > 0 ) { ditch = false; } 		// Hacky HF deal - comment out later 
//		if( urls[n].indexOf( "?mode=medium" ) > 0 ) { ditch = false; } 		// Hacky Pixiv deal
		if( urls[n].indexOf( "en/artworks/" ) > 0 ) { ditch = false; } 		// Hacky new Pixiv deal  
		if( urls[n].match( '/art/view/' ) ) { ditch = false; } 		// Hacky NewGrounds deal
		if( ditch ) { urls.splice( n, 1 ); }
	}
*/
	var whitelist = [ ".jpg", ".jpeg", ".png", ".gif", ".mp3", ".mp4", 
	"en/artworks/", 		//Pixiv
	"/s/", 		// IB 
	"/view/", 		// FA - obviating NewGrounds, actually - and P34 
//	"/", 		// General purpose? Ech, breaks Mastodon. Maybe sort. 
	"s=view", 		// Gelbooru 
	"/pictures/", 		// HF
	"/post/show/", 			// e296
	"/posts/", 				// Also e296, for pools? 
	"/art/",		// DeviantArt... bluuuh have to exclude #comments 
	"/artworks/", 		// Pixiv 
	"/picture.php", 	// HA 
	"artstation.com/projects/", 		// ArtStation
	"/art/view/" ]; 		// NewGrounds
	urls = urls.filter( u => {
		return whitelist.map( w => u.match( w ) ? 1 : 0 ).reduce( (a,e) => a+e ); 		// If any whitelisted item matches this URL, keep this URL. 
	} )

/*
	var blacklist = [ "#comments" ]; 
	urls = urls.filter( u => { 
//		return blacklist.map( w => u.match( w ) ? 0 : 1 ).reduce( (a,e) => a+e ); 
		return u.match( "#comments" ) ? false : true; 		// Sloppy. 
	} ) 
*/
	urls = urls.filter( u => ! u.match( "#comments" ) ); 		// Yeah? 

	// Direct image links from thumbnail links. 
//	let thumbs = urls.filter( u => u.match( 'p0_square' ) ); 		// Pixiv
//	urls = urls.concat( u.map( u => u.replace( 'c/250x250_80_a2/img-master/', 'img-original/' ).replace( '_square1200', '' ) ) ); 
//		let s = u.split('/') 
//	} ) )
//	https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/05/17/13/37/33/81630978_p0_square1200.jpg 
//	https://i.pximg.net/img-original/img/2020/05/17/13/37/33/81630978_p0.png 
	// Goddammit - filetypes.
 
/*
		// Add embedded images, unfiltered... because they're images
	var srcs = document.getElementsByTagName( 'img' ); 
//	for( var which in srcs ) { urls.push( "" + srcs[which].src ); }
	for( var n = 0; n < srcs.length; n++ ) { urls.push( "" + srcs[n].src ); }  
*/
	urls = urls.concat( Array.from( document.getElementsByTagName( 'img' ) ).map( v => v.src ) ); 
	urls = urls.concat( Array.from( document.getElementsByTagName( 'video' ) ).map( v => v.src ) ); 
	urls = urls.concat( Array.from( document.getElementsByTagName( 'source' ) ).map( v => v.src ) ); 		// Really, <video> tag? Really? 
	// Aaaargh new Twitter fucking hides images as you scroll. 
	if( document.domain != "baraag.net" ) { 		// Completely fucky order on Baraag. No idea why. 
		urls = urls.concat( Array.from( document.getElementsByTagName( 'a' ) ).map( v => v.href ) 
			.filter( u => u.match('.jpg') || u.match('.png') || u.match('.gif') ) );
	}

		// Promote NewGrounds previews - note, probably ignores secondary images
// https://art.ngfiles.com/medium_views/1464000/1464020_bluebreed_veronica.png?f1602728027
// https://art.ngfiles.com/images/1464000/1464020_bluebreed_veronica.png?f1602727984 
	urls = urls.concat( 
		urls.filter( u => u.match( 'art.ngfiles.com/medium_views' ) )
		.map( u => u.replace( 'medium_views', 'images' ) ) 
	); 
	// Might be better to redirect, like Twitter and Tumblr URLs. That'd keep the iu_ inline / secondary images in-order. 
	// Durrrrr just map and replace instead of adding new URLs. 
		// Thumbnails too?
// <img src="https://art.ngfiles.com/thumbnails/1464000/1464020.png?f1602728033" alt="Veronica">
// https://www.newgrounds.com/art/view/bluebreed/halloween-tron-bonne
// https://art.ngfiles.com/images/1481000/1481891_bluebreed_halloween-tron-bonne.png?f1603898447
/*
	urls = urls.concat( 
		urls.filter( u => u.match( 'art.ngfiles.com/thumbnails' ) )
		.map( u => { 
			u.replace( 'thumbnails', 'images' ); 
			let name = 	// Nope, need alt-text for this. 
		} )
	);
*/

		// Remove small images?
//	urls = urls.filter( u => ! u.match( '/small' ) ); 		// Baraag 

		// Remove duplicates
	for( var n = urls.length-1; n > 1; n-- ) { 		// Backwards, now
		for( var x = n-1; x > 0; x-- ) { 		 // For each array value before N
			if( urls[x] == urls[n] ) { urls.splice( x, 1 ); n--; } 
		}
	}

/*
	var url_set = new Set( urls ); 
	urls = Array.from( url_set ); 
*/

	urls.push( '----- ----- ----- ----- ----- ----- -----' ); 		// Visible seperator 
	urls = urls.concat( Array.from( urls ).reverse() ); 		// concat is functional and reverse isn't. Fuck Javascript. 

	return urls; 
}

function get_links3() {
	//for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	var links = document.getElementsByTagName( 'a' ); 
	for( var which in links ) { 
		var ditch = true; 
		if( links[which].href.indexOf( ".jpg" ) > 0 ) { ditch = false; } 
		if( ditch ) { delete link; } 
	}
	return links; 
}

function get_links2() {
	var srcs = document.getElementsByTagName( 'img' ); 
	var links = new Array;
	links = document.getElementsByTagName( 'a' ); 
	for( var n = srcs.length-1; n > 0; n-- ) { 		// Backwards
		var link = links[n].href; 
		var ditch = true;
		if( link.indexOf( ".jpg" ) > 0 ) { ditch = false; } 
		if( link.indexOf( ".jpeg" ) > 0 ) { ditch = false; } 
		if( link.indexOf( ".png" ) > 0 ) { ditch = false; } 
		if( link.indexOf( ".gif" ) > 0 ) { ditch = false; } 
//		if( ditch ) { links.splice( n, 1 ); }
		if( ditch ) { delete links[n]; } 
	}
	//return srcs.concat( links ); 
	return srcs; 
}

function get_links1 () {
	var links = new Array; 
	// Gather <a> addresses
	var hrefs = document.body.innerHTML.split( 'href=' ); 
	for( var n = 0; n < hrefs.length; n++ ) { 
		var url = hrefs[n].split( /["'>]+/ )[1];  		// Terminate on quotes (or brackets, or space) 
		links.push( url ); 
	}
	// Gather <img> sources
	var srcs = document.body.innerHTML.split( 'src=' ); 
	for( var n = 0; n < srcs.length; n++ ) { 
//		var url = srcs[n].split( /["']+/ )[1];  
		var url = srcs[n].split( /["'>]+/ )[1];  
		links.push( url ); 
	}
	// Remove non-images
	for( var n = links.length-1; n > 0; n-- ) { 		// Backwards, now
		var ditch = true;
		if( links[n].indexOf( ".jpg" ) > 0 ) { ditch = false; } 
		if( links[n].indexOf( ".jpeg" ) > 0 ) { ditch = false; } 
		if( links[n].indexOf( ".png" ) > 0 ) { ditch = false; } 
		if( links[n].indexOf( ".gif" ) > 0 ) { ditch = false; } 
		if( ditch ) { links.splice( n, 1 ); }
	}
	// Remove duplicates
	for( var n = links.length-1; n > 1; n-- ) { 		// Backwards, now
		for( var x = n-1; x > 0; x-- ) { 		 // For each array value before N
			if( links[x] == links[n] ) { links.splice( x, 1 ); n--; } 
		}
	}
	return links; 
}

