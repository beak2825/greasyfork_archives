// ==UserScript==
// @name        Eza's Homestuck Simplifier
// @namespace   https://inkbunny.net/ezalias
// @description A mobile-friendly "reader app" for MSPaintAdventures.com 
// @license     MIT
// @license     Public domain / No rights reserved
// @include     http://www.mspaintadventures.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19217/Eza%27s%20Homestuck%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/19217/Eza%27s%20Homestuck%20Simplifier.meta.js
// ==/UserScript==

// MSPA on mobile is painful, so let's replace the page with an AJAX updater that only cares about the comic area.

// Backgrounds in Scratch and Trickster pages aren't quite right. E.g. Trickster pages should be all garish Z's. (Trickster mode: p=007614) 
	// Mobile link does not appear on Trickster pages. The whole nav bar is wacko. 
// Oh shit, password pages. That'll screw with preloading... but... oh well? 
	// Password pages work, but redirect you outside of #mobile. (c. p=008948, first password is HOME. No, not HOM3.) 
// Oh shit, Openbound doesn't work. (c. p=007208) 
	// Or... it does now? Okay, sure. 
	// Going there from the previous page doesn't work. Balls. I guess I could force a reload, but that's hard not to loop. 
	// Key seems to be: 
		// <script type="text/javascript" src="storyfiles/hs2/05305/Sburb.min.js" > 
		//... <body bgcolor="5a5a5a" bottommargin="0" topmargin="0" onload="Sburb.initialize('JterniaDeploy','storyfiles/hs2/05305/levels/init.xml',false);"> 
		// which is obviously outside the comic content. 
	// I could probably test for the onload portion. Dunno how I'd cleanly get the script in, though. Special cases suck. 
	// Ugh, I need to include the script aaaand then call the right Sburb.initialize thing from the page context (document.body.Sburb.etc). 
// Double pages? x2 pesterlogs or whatever. Where are those damn things? Ah, p=007686. 
	// Ahh, the first link (which is supposed to scroll up and right, to the top anchor for the other side) is the first '?s=' link. Arg. 
	// And then #TWO stays in window.location, so naturally it scrolls right on every subsequent page. What a mess. 
	// Special-case #TWO links to point to window.location.href + '#TWO'. 
	// Sorta-kinda fixed by excluding them from link-diddling. Window.onpopstate complains 'event.state is null' for anchors, but whatever. 
	// There's no return to the left when you load the next pair of pages. Autoscroll's only vertical, for mobile's sake. Hmm. #TWO does correctly clear from the address bar. 
	// Next_page is wrong because the actual next-page link is preceded by the first column's load/save/go-back/start-over links. 
// ... multipage loading? Flash pages with sound make this a questionable idea, but they always have [S] in the link. (Oh, also stop at '???' for Passwords.) 
	// Hmm, dunno if I can link to an anchor on the next div without removing #mirror from the URL. 
	// '&' works as well as '#' for tagging the URL. &mobile vs. #mobile. Only seemed relevant because it broke x2 combo pages for a while. 
// Crowbar page super doesn't work. I think it's the special URL - http://www.mspaintadventures.com/007680/007680.html - with no ?s= etc. 
	// But... it still returns HTML... which has the right flash. Hmm. 
	// Ugh, same deal for Game Over. It's the special URL - Cascade is cascade.php?s=etc, but some pages are /gameover/gameover.html or similar. Ugh. 
	// Game Over works, ish, but you can't leave. The link (in the flash!) doesn't work correctly. 
// Should autoscroll ignore back/forward events? 
// Minor issue: single-indexOf content filtering (i.e., start of page to 'end of comic content') changes background colors one page early, because of preloading. 
// Should I stretch the images of text in e.g. Trickster mode, to match the zoomed text? Might break formatting, since it's wrapped at a standard width. (Ehh.) 

// Noteworthy pages: Scratch, 005663. Cascade, 006009. Openbound, 007208. Trickster mode, 007614. Game Over, 008800. Passwords (HOME), 008948. Collide, 009986. 
// Caliborn whacking the page, 007680. Act 5 Act 2 Act 1 x2 combo, 007686. Act 6 Act 6 Homosuck, 008142. 
// Very tall page, 005627. Haunting piano refrain, 001977. 

// Narrow Mode didn't have intended effect; implemented text zooming instead. Font sizes go up. 

if( window.location.href.indexOf( '#mobile' ) > 0 ) { 		// On a #mobile page, blank everything and attempt to present a comic page. 
	// Replace the page with some simple divs and dummy text 
	document.body.innerHTML = "<center><div id='content'>What content?</div>" + 		// Main div, one visible comic page
		"<div id='hidden_preload' style='display: none;'>DUNKASS</div>" + 		// Invisible div for preloading. ALL WEBCOMICS SHOULD HAVE THIS.
		"<a id='exit_link'><font color='ffffff'>Exit Mobile Mode</a><font color='c0c0c0'>" + 		// When in doubt, fail 

		"<span id='scrollcontrols' class='noscroll'>" + 		// Autoscroll on/off, with one option visible at once, and setting contained in parent span 
		" <span class='ontoggle'> - <a href ='javascript:void(0);' onclick=\"javascript:document.getElementById('scrollcontrols').className='autoscroll'\">" + 
			"<font color='c0c0c0'>Autoscroll is off</a></span>" + 
		" <span class='offtoggle'>- <a href ='javascript:void(0);' onclick=\"javascript:document.getElementById('scrollcontrols').className='noscroll'\">" +
			"<font color='c0c0c0'>Autoscroll is on</a></span>" + 
		"</span>" + 

		"<span id='zoomcontrols' class=''>" + 		// "Narrow mode" on/off, with one option visible at once, and setting contained in parent span 
		" <span class='zoomtext'> - <a href ='javascript:void(0);' onclick=\"javascript:document.body.className='zoomed'\">" + 
			"<font color='c0c0c0'>Text is normal</a></span>" + 
		" <span class='normaltext'>- <a href ='javascript:void(0);' onclick=\"javascript:document.body.className='unzoomed'\">" +
			"<font color='c0c0c0'>Text is zoomed</a></span>" + 
		"</span>" + 

		"<style> .autoscroll .ontoggle { display: none; } .noscroll .offtoggle { display: none; } " + 		// Hide offtoggle or ontoggle as appropriate
		".unzoomed .normaltext { display: none; } .zoomed .zoomtext { display: none; } " + 		// Hide zoomtext or normaltext as appropriate
		".zoomed div span { font-size: 20px; } " + 		// Bump up text size in pesterlogs
		".zoomed div p { font-size: 20px; } " + 		// Bump up text size in narrative 
		"</style>" +
		" - <a href=\"javascript:location.reload();\"><font color='c0c0c0'>Page not working? Reload</a>";
	document.body.className = 'unzoomed'; 		// Can't do this in the injected HTML because fuck you. 

	// Setup the fake history for our fake links
	window.onpopstate = function( event ) { update( event.state.update, 'content' ); }; 		// Faking the Back button: update() to a previous history state, which we also fake
	history.replaceState( { update: window.location.href }, 'MS Paint Adventures', window.location.href ); 		// You are here. JS doesn't do this itself because fuck you. 

	// Call Update for whatever page we're on 
	 update( window.location.href, 'content' ); 

} else { 		// If it's not #mobile then we're on unaugmented MSPA. Augment it with a link to the appropriate #mobile version. 
	// Mobile link from the front page has to be different because '/?s=...&#mobile' works, but '/&?s=...' doesn't. Dunno why it's a CORS error, though. 
	var mobile_link = window.location.href + "&#mobile"; 		// The '&' forces a reload despite being a misused anchor link
	if( window.location.href.indexOf( '?s=' ) < 0 ) { mobile_link = "/?s=6#mobile"; } 		// Frontpage is Homestuck? Link Homestuck.

	// "Mobile" link goes after the "Credits" link 
	var credits_index = document.body.innerHTML.indexOf( "CREDITS</font></a>" ) + "CREDITS</font></a>".length; 
	if( credits_index <= 17 ) { credits_index = document.body.innerHTML.indexOf( "WHATEVER.</font></a>" ) + "WHATEVER.</font></a>".length; } 		// A6A6 hack 
	if( credits_index > 20 ) { 		// Sloppy not to check for indexOf > -1, but fuck, am I ever tired of verbose indexOf nonsense. Gimme some spliceAtText function. 
		document.body.innerHTML = 
			document.body.innerHTML.substring( 0, credits_index ) + 
			" | <a href='" + mobile_link + "'><font color='88ff44'>MOBILE</font></a>" + 
			document.body.innerHTML.substring( credits_index );
	} 
}

// End of main execution.



// Grab a page, put the important stuff in one of our divs
function update( page_path, target_div ) {
	var ajax = new XMLHttpRequest(); 		// Create AJAX object with which to fetch page 
	ajax.onreadystatechange = function () { 		// When the AJAX object updates -
		if( ajax.readyState == 4 ) { 		// If the update state means "finished" - 

			// Grab comic content from the fetched HTML
			var replacement_html = ''; 
			var stop_strings = [ '<!-- end comic content -->', 									// This works on "normal" pages, i.e. everywhere outside Homestuck
				'<!--  FULL LOGO HEADER  -->', 													// This is for Scratch pages
				'<!------------------------end comic content----------------------------------->' ] 		// This is for Cascade 
			for( var n = 0; n < stop_strings.length; n++ ) { 
				if( replacement_html == '' ) { replacement_html = ajax.responseText.substring( 0, ajax.responseText.indexOf( stop_strings[n] ) ); } 
			}

			// Dumb Cascade fix: changing the Flash's src URL gets "fixed" by some other script, but remove src entirely and the "name" property gets used. Aggravating.
			replacement_html = replacement_html.replace( 'src="/cascade', 'sauce="/cascade' ); 		// Relative URLs and CORS are a regular pain in my ass. 

			// Some pages are unique but simple, so treat the whole page as content
			if( replacement_html == '' ) { 		// This is for crowbar-whacking, Collide, & EOA7
				var whitelist = [ '05777_2', 'p=009988', 'p=010028' ]; 		// These aren't the affected pages, these are pages that the affected pages link to.
				for( page in whitelist ) { 
					if( ajax.responseText.indexOf( page ) > 0 ) { 
						replacement_html = ajax.responseText; 		// There's nothing but comic content on these pages, so grab everything. 
						replacement_html = replacement_html.replace( 'src="05777_2.swf"', 'sauce="05777_2.swf"' ); 		// Crowbar hack, page 007680. Damn relative src links. 
					}
				} // End of 'for whitelist' loop 
			} 

			// Enable Flash content
			while( replacement_html.indexOf( '<noscript>' ) > 0 ) { 		// Dunno why AC_RunActiveContent.js doesn't run, but the results are right here anyway - 
				replacement_html = replacement_html.replace( '<noscript>', '' ); 		// Flash pages provide NoScript-friendly best-guess results. Let's use those. 
			}

			// Update our fake page to show the comic and text 
			document.getElementById( target_div ).innerHTML = replacement_html; 
			document.getElementById( 'exit_link' ).href = window.location.href.replace( '#mobile', '&#' ); 		// Update "Exit Mobile Mode" link (as a real no-kidding link) 

			// On visible updates, change links into Update calls and preload the next page
			if( target_div == 'content' ) { 		// If we're updating the main div -

				// Scroll back up (if autoscroll is enabled) 
				if( document.getElementById( 'scrollcontrols' ).className.indexOf( 'autoscroll' ) > -1 ) 		// If control span class includes 'autoscroll' - 
					{ window.scrollBy( 0, -10000 ); } 		// Scroll up by some large number

				// Diddle the next-page link to allow preloading and prevent actual link behavior 
				var links = document.getElementById( 'content' ).getElementsByTagName( 'a' ); 		// Wish people would ID their fuckin' links. 
				var next_page = ''; 		// It'll be the first ?s= etc link on the page, so we'll do for(links) backwards and use the final value. 

				for( var n = links.length - 1; n >= 0; n-- ) { 
					// If it's a page link, but not a Save / Load / Etc. '?game' link, and not a x2 Combo second-column anchor -
					if( links[n].href.indexOf( '?s=' ) > 0 && links[n].href.indexOf( '?game' ) == -1 && links[n].href.indexOf( '#TWO' ) == -1 ) { 
						next_page = links[n].fake_href = links[n].href.replace( '/mobile', '' ); 		// Store links[n]'s original target inside that link, because callbacks are dumb 
						links[n].addEventListener ( "click", function() { 
							update( this.fake_href, 'content' ); 		// Grab the link with this script instead of visiting it 
							history.pushState( { update: this.fake_href + "#mobile" }, 'MS Paint Adventures', this.fake_href + "#mobile" ); 		// So the Back button works on a fake link
						} , false ); 
						links[n].href = 'javascript:void(0)'; 		// Break link, so the script's function predominates. 
					} 		// End of if() block checking for page links
				} 		// End of for() loop over links in 'content' div 

				update( next_page, 'hidden_preload' ); 		// Load the next page in a hidden div, so images download while you're reading. EVERY WEBCOMIC SHOULD DO THIS. 
			} 		// End of if() block for 'content'-specific code 

		} 		// End of if() block for when page is fully fetched
	} 		// End of anonymous AJAX-update function
	if( page_path.indexOf( '://' ) < 0 ) { page_path = "http://www.mspaintadventures.com/" + page_path; } 		// Some links read as '/?s=etc', others as 'http...' - make all 'http'.
	ajax.open( "GET", page_path, true ); 		// GET this URL, false = synchronous 
	ajax.send(); 
} 		// End of Update function























































