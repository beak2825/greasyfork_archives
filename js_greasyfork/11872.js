// ==UserScript==
// @name        Eza's Gallery Smoothener
// @namespace    https://inkbunny.net/ezalias
// @author			Ezalias
// @description     Removes unimportant links below thumbnails, so select -> right-click -> open-links-in-new-tabs works cleanly. 
// @license     MIT
// @include     http://www.furaffinity.net/msg/submissions/*
// @include     http://www.furaffinity.net/favorites/*
// @include     http://www.furaffinity.net/gallery/*
// @include     https://inkbunny.net/submissionsviewall.php*mode=unreadsubs*
// @include     https://inkbunny.net/submissionsviewall.php*mode=userfavs*
// @include     http://www.hentai-foundry.com/users/FaveUsersRecentPictures?username=*
// @include     https://www.hentai-foundry.com/users/FaveUsersRecentPictures?username=*
// @include     http://www.hentai-foundry.com/pictures/*
// @include     https://www.hentai-foundry.com/pictures/*
// @exclude    /^https?://www\.hentai-foundry\.com/pictures/.*/.*/[0-9]*/.*/
// @include     https://www.weasyl.com/messages/submissions*
// @include     https://www.weasyl.com/submissions*
// @include     https://www.weasyl.com/favorites*
// @include     http://www.y-gallery.net/gallery/*
// @include     http://www.y-gallery.net/favourites/*
// @include     http://www.y-gallery.net/browse/
// @include     http://www.y-gallery.net/browsetops/ 
// @include     http://www.y-gallery.net/clubgallery/*
// @include     http://rule34.paheal.net/post/list/*
// @include     http://www.pixiv.net/bookmark_new_illust.php*
// @include     http://www.pixiv.net/bookmark.php*
// @include     http://www.pixiv.net/member_illust.php?*
// @exclude    http://www.pixiv.net/member_illust.php?mode*
// @include     https://www.pixiv.net/bookmark_new_illust.php*
// @include     https://www.pixiv.net/bookmark.php*
// @include     https://www.pixiv.net/member_illust.php?*
// @exclude    https://www.pixiv.net/member_illust.php?mode*
// @include     http://*.deviantart.com/gallery/*
// @version     1.14 
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11872/Eza%27s%20Gallery%20Smoothener.user.js
// @updateURL https://update.greasyfork.org/scripts/11872/Eza%27s%20Gallery%20Smoothener.meta.js
// ==/UserScript==

// This removes user-profile links and other extraneous junk from supported image galleries so that users can select many images and open them all in tabs.
// This only matters if your browser has some extension to select multiple links and "Open links in tabs." 

// Todo: support relevant sites from Eza's Image Glutton - mostly "watching" pages and "favorites" galleries. 
// Linked images seem to disappear, even though they ought to be handled by innerHTML. 
// SoFurry requires additional handling thanks to their dynamic page shenanigans. (Be restful, you stupid document!) 
// Maybe Derpibooru? They have comment / vote links above every thumbnail. 
// DeviantArt pools are kind of a pain. 
// Can the DOM change an element's tag name? Can I just 'a' -> 'span' for the relevant links? (Seems not.) 
// Apparently data-whatever-etc attributes are handled super specially by JS: it's thing.dataset.whateverEtc. Yes, it automatically converts to camelcase. Jesus. 
// Fix FurAffinity before uploading? Augh, it's some kind of imaginary inline iframe. Guess I'm stuck with titles off. 
	// Maybe... maybe just get rid of FA's CSS and resizing code? 
// http://www.pixiv.net/response.php?type=illust&id=59618700 - wtf? Ah, image responses. 
	// http://www.pixiv.net/bookmark.php?id=5238&rest=show&p=4 
// Changed some picky details in @includes, mostly .php?* => .php* for bookmark-related URLs. 
// Added HTTPS. 
// Fixed Hentai-Foundry HTTPS, badly. I fucking hate having to specify that. There's no sane way to do it outside of illegible regexes. 
// Added user-gallery support to FurAffinity, whoops. Still only works with titles disabled. 
// Pixiv broke on Christmas 2017. 
	// Removed on-hover menu (and its report link) with interval function. 
// Is there some way to make links inactive when they're selected? Some sane way? It'd be useful in Tumblr Scrape as well, for the permalinks. 
// Finally excised Hentai-Foundry's thumbnail zoom. Not strictly within this script's stated goal, but definitely a smoothening. 
// https://derpibooru.org/ needs this treatment. 



// For Pixiv specifically, since they have a weird delayed menu on each thumbnail:
if( document.domain == "www.pixiv.net" ) { 
	var pixiv_handle = setInterval( pixiv_interval, 1000 ); 
	setTimeout( function() { clearInterval( pixiv_handle ); }, 10000 ); 		// Lazy solution: after ten seconds, stop trying 
	// The lazy solution isn't good enough. When loading takes a long time (e.g. after opening a bunch of tabs, duh) menu guff never gets removed.
}

function pixiv_interval() {
	// Rename 'crap.' 
	var crap = document.getElementsByClassName( 'thumbnail-menu' )  		// For each ellipsis-and-star thumbnail menu (menu: mute / report, favorite) 
	while( crap[0] ) { crap[0].parentNode.removeChild( crap[0] ); } 		// While list is not empty, delete first element. (Child -> Parent -> Kill this child.) 
	remove_links(); 		// And filter the links again, because they also have a delay issue. 
}



// For Furaffinity's awful section/figure/gallery nonsense:
if( document.domain == "www.furaffinity.net" ) {
	// So what's the issue here? Do I need to swap the element type of the section? Of the figures? 
}



//For Hentai-Foundry's awful on-hover thumbnail zoom:
if( document.domain == "www.hentai-foundry.com" ) {
	// These aren't <img> tags, they're <span> elements with the thumbnail as a background. Removing the "thumb" class makes images disappear.
	// The zoom-transition rule for .thumb:hover is @included by default.css, so we can't alter it in a sensible fashion.
	// So we kludge: swap the "thumb" class for our own knockoff class, with the display rules but not the on-hover rules. 

	var zoom_class = document.getElementsByClassName( "thumb" ); 
	while( zoom_class.length > 0 ) { 
		zoom_class[0].classList.add( "fake_thumb" ); 
		zoom_class[0].classList.remove( "thumb" ); 
	} 

	var sheet = document.createElement( "style" );
	sheet.innerHTML = ".fake_thumb { background-position: center center; background-size: cover; background-repeat: no-repeat; border: 0; width: 200px; height: 200px;display: block; }"; 
	document.body.appendChild( sheet ); 
}



// For all sites:
remove_links(); 		// This is now a function so that Pixiv can call it after a delay. 
function remove_links() {
	var links = document.getElementsByTagName( 'a' ); 		// Grab all links.
	for( var n = links.length-1; n >= 0; n-- ) { 		// For each link, 
		if( username_link_in( links[n] ) ) { 		// If it points to a user's profile,
				// Replace it with unlinked text. 
			var dud = document.createElement("span"); 			// I.e. - create blank span,
			for( var x in links[n] ) { dud[x] = links[n][x]; } 		 	// Copy all elements of this link onto this span, 
			links[n].parentNode.replaceChild( dud, links[n] ); 		// Replace this link with this span. 
		}
	}
}		// Done.



// -------------------------



function username_link_in( anchor ) { 		// True / False: does this link element look like a userpage link? 
	switch( document.domain ) { 
		case "www.furaffinity.net":  		// FA: yes, if it contains "/user/username". (Also for "deleted by the owner" fake-links.) 
			return anchor.href.indexOf( "/user/" ) > 0 || anchor.href.indexOf( "/favorites/" ) >= 0; break;
		case "inkbunny.net": 		// IB: yes, if the messy class string includes a userName designation. 
			return anchor.className.indexOf( "userName" ) > 0; break;
		case "www.hentai-foundry.com":		// HF: yes, if it contains "/user/username/profile". (Every HF link has /user/ in it. Grr.) 
			return anchor.href.indexOf( "/profile" ) > 0; break; 
		case "www.weasyl.com": 		// Weasy: yes, if it contains... tilde? I don't even remember writing this one. Am I on Weasyl? 
			return anchor.href.indexOf( "~" ) > 0; break;
		case "www.y-gallery.net": 		// YG: yes, if it contains "/user/username" or "/club/clubname". 
			return anchor.href.indexOf( "/user/" ) > 0 || anchor.href.indexOf( "/club/" ) > 0; break;
		case "rule34.paheal.net": 		// Paheal: yes, if it's a bare image link. (Or a weird invisible same-page anchor.) 
			return anchor.href.indexOf( "_images" ) > 0 || anchor.href[ anchor.href.length - 1 ] == "#"; break;
		case "www.pixiv.net":		// Pixiv: yes, if it's a username. But not on Works pages. 
			return ( anchor.href.indexOf( "member_illust.php?id" ) > 0 && window.location.href.indexOf( "member_illust.php?id" ) < 0 )
			|| ( anchor.href.indexOf( "/series/" ) > 0 ) 		// Also ignore links to series collections. 
			break;
	}
	if( document.domain.indexOf( '.deviantart.com' ) > -1 ) { 		// Fucking subdomains. 
		return ( anchor.href.indexOf( '#comments' ) > -1 || anchor.href.indexOf( '/morelikethis/' ) > -1 ); 		// DeviantArt: yes for "comments" and "more like this." 
	}
}















































