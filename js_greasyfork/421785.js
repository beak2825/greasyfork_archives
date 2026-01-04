// ==UserScript==
// @name        Eza's Gallery Swallower
// @namespace   https://inkbunny.net/ezalias
// @description Turn a page of thumbnails into high-res images
// @license     MIT
// @license     Public domain / no rights reserved

// @include     https://www.pixiv.net/*

// @include     https://gelbooru.com/index.php?page*
// @include     https://safebooru.org/index.php?page*

// @include     https://e621.net/posts*
// @include     https://e926.net/posts*
// @include     https://e6ai.net/posts*
// @include     https://e621.net/pools/*
// @include     https://e926.net/pools/*
// @include     https://e6ai.net/pools/*

// @include     https://*.booru.org/*s=list*

// @include     /^https?\:\/\/www\.hentai-foundry\.com\//

// @include     https://baraag.net/@*
// @include     https://botsin.space/@*
// @include     https://equestria.social/@*
// @include     https://mastodon.art/@*
// @include     https://mastodon.social/@*
// @include     https://pawoo.net/@*

// @include     /^https?\:\/\/rule34\.paheal\.net\//

// @include     https://derpibooru.org/*

// @include     https://inkbunny.net/*

// @include     https://www.furaffinity.net/*

// @include     https://danbooru.donmai.us/*

// @include     https://rule34.xxx/*

// @include     https://www.jabarchives.com/*
// @include     https://jabarchives.com/*

// @include     https://aryion.com/g4/view/*
// @include     https://aryion.com/g4/gallery/*
// @include     https://aryion.com/g4/latest*

// @include     https://e-hentai.org/g/*

// @include     https://lolibooru.moe/*
// @include     https://yande.re/*

// @include     https://thehentaiworld.com/*

// @include     https://r34hub.com/*

// @include     https://rule34hentai.net/*

// @include     https://*.newgrounds.com/*

// @include     https://booru.allthefallen.moe/*

// @include     https://mspabooru.com/index.php?*

// @include     https://incognitymous.com/*

// @include     https://putme.ga/album/*

// @include     https://*.reddit.com/gallery/*

// @include     https://kemono.su/*
// @include     https://kemono.party/*
// @include     https://www.kemono.su/*
// @include     https://www.kemono.party/*

// @include     https://coomer.su/*
// @include     https://coomer.party/*
// @include     https://www.coomer.su/*
// @include     https://www.coomer.party/*

// @include     https://hypnohub.net/* 

// @include     https://desuarchive.org/*

// @include     https://knowyourmeme.com/*

// @include     https://imgbox.com/g/*
// @include     http://imgbox.com/g/*

// @include     https://whitekitten.art/*

// @include     https://piczel.tv/gallery/*

// @include     https://nhentai.net/*

// @include     https://www.seaart.ai/*

// @include     https://co.llection.pics/post/list/*

// @include     https://comics.8muses.com/comics/album/*

// @exclude     https://civitai.com/*

// @exclude    *#dnr
// @noframes
// @version     2.36.0
// @grant     GM_registerMenuCommand
// @grant     GM.setValue
// @grant     GM.getValue
// @grant     GM.openInTab
// @grant     GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/421785/Eza%27s%20Gallery%20Swallower.user.js
// @updateURL https://update.greasyfork.org/scripts/421785/Eza%27s%20Gallery%20Swallower.meta.js
// ==/UserScript==



// Create a vertical view for high-res versions of all the image links you can see. 
// This includes all pages from multi-image submissions, where those exist.
// Individual images (or whole submissions) can be removed with one click. 
// Each image is also a link to that image. 



// Table of contents:
	// Preamble
		// CSS
		// HTML
		// Helper functions
		// Polyfills
	// Main execution 
		// Per-site image-gathering functions
		// The Button 
	// Persistent options handling
	// Show images 
		// Per-submission setup
		// Keyboard controls
		// Video play / pause on scroll
		// Ongoing image-display function
		// Spinners

// Other Mastodon instances are many in number and few in users. An @include block would get ridiculous. 
// I am alarmingly close to forking this for Mastodon, doing @include *, and testing for e.g. h-cite / h-entry. 
	// I don't want to @include * in general - this is not a general-purpose script. 
	// Even a fetch-based version would only be as flexible as Image Glutton. 
	// ... I've accidentally made this @include * friendly, by exclusively using button_delay_function. 
		// If it defaulted to false I could use this anywhere, and only specific switch-case / match domains would get better values. 
		// Or I could skip the interval entirely if button_delay_function remains at a default null. 
			// (Probably better to do so if gather_items remains at a default null.) 

// HicceArs? 
// DeviantArt? Tried it once, didn't really work. Probably needs a fetch. Even that's not consistent. It is a terrible website. 
// Tumblr? Not a -great- alternative to Eza's Tumblr Scrape, but pretty close to what that script originally wanted. 
// https://myhentaigallery.com/gallery/show/7994/1#dnr? Already covered by Eza's Comic Viewer... which I have not published. 
	// Arguably the Gallery Swallower version sould be viewing all of an artist's comics at once. 

// It is annoyingly easy to get caught clicking remove-and-advance instead of just 'advance.' 
	// The button snaps into place under your cursor if you're submission-aligned and hit 'next image.' 
	// It's a problem mostly because the apparent result is the same - we scroll clean past the removed image. 
	// Keyboard controls have made this a non-issue for me. Dunno how others use the script. 
	// The non-technical solution would be to add space between -> and X->. 

// If we can detect a selection, maybe only "swallow" the links you have selected.
	// If there's a CSS pseudoselector for mouse selection we can try that first.
	// Oh my god the TamperMonkey editor is complete garbage. Stop highlighting random words with every keypress. Why did I need to guess a tab option in order to use tab on a comment? Why does every editor-settings change need a restart?
	// Most importantly - why the hell can't I just edit this in my own god-damn text editor?
	// The answer in all cases is Chrome, because Google needs to be burned to the fucking ground. 
	// ... okay, the TamperMonkey dev is to blame for these godawful defaults. I'm not diagnosed with anything. But this is an assault on the senses... as I am trying... to code. A discipline fueled almost entirely by concentration. 
	// Tool: do what I tell you to. 
	// Tool: stop doing what I didn't tell you to. 
	// I am a loud and blunt advocate for not screwing around with the defaults. Some decisions are a coin toss and the only wrong answer is going back and re-flipping that coin. 
	// But these defaults objectively suck, and it takes a dozen clicks to fix every individual one of them. Unfuck it already. Be boring first. 
	// Hitting Esc closes the editor and loses undo states. If I see the author in comments, I am no longer going to be polite. 
	// For shift+tab stopping where it fucking feels like - even if that is a tab stop AHEAD of the initial state - I am going to be quite blunt. 

// Some querySelector hack for "containing" would be nice. Break the querySelector( img ).closest( a ) pattern. I do already extend queries to have previous / next selectors. However - nice as this would be - it would muck up readability. Both for me and for others. It takes new syntax. 
	// Could have typical_item assume an <img> element really means .closest( a ). (Only r34hub does that? Huh.) 

// Some videos on TheHentaiWorld.com don't work. 
	// https://thehentaiworld.com/videos/panam-palmer-timpossible-cyberpunk-2077-2/
	// https://thehentaiworld.com/videos/alcina-dimitrescu-greatm8-resident-evil-village/
	// Is it because the format is .mp4? 

// Tempted to golf away constant pattern of Array.from( document.querySelectorAll( ) ). DRY as "queryArray()" or something. 
	// Appears 28 times. Still thinking "don't," because it harms clarity. Same category as shortening variable names. 
	// It would be better to extend live HTML collections to accept .map and so on. They really already ought to. It is a tremendous pain in the ass to have this variety of array-like types that do some but not all array operations... in a language that is supposed to have vanishingly few types. 
		// Can I do it for all array-like objects? Maybe catch the error from N and try Array.from( N )? 
	// De-duplication might force this. Array.from( document.querySelectorAll( ) ) is a mildly silly pattern. Nesting several Array.from calls alongside a new Set call is just ridiculous. 

// Might adjust Pixiv speed in light of redesign. (I think it's just the site being fucky.)
	// Might be time to implement "swallow selection." 

// https://gameliberty.club/@exlurker - another mastodon instance. 

// Is PillowFort even necessary? It's pretty low-bullshit, as-is. 

// gather_items declarations could be semi-standardized, like typical_item, and take the query alone. 
// Not sure how you'd handle the map / typical_item. 

// https://www.reddit.com/gallery/sjnm9k 

// https://the-collection.booru.org/index.php?page=post&s=list&tags=campside&pid=80 - Dark mode has a white border. 

// Indications of image count per-submission would be nice. Like a little "1/N" in the upper-right corner, But would that be a floating element, with CSS tracking... or just something in the corner of each image container? Probably the latter, for simplicitly. May also add page counts to thumbnails, like how Pixiv does them. (Except not lying by saying "+2" for two images. 1+2=3, guys. Really. I checked. 

// User requested SankakuComplex.com. I had tried it (x84, 2.10.4) but the site refused to cooperate. Try again with much longer delays. 
	// Genuinely started writing "... do I not already support SankakuComplex.com?"

// https://booru.plus/+zootopia46250 





	// To do:

// Videos. 
	// I need a link somewhere, and the sorta tablet-y design I've chosen says it shouldn't be a thin bit of text. 
		// Added sensible links for DownThemAll, but they're not available for a human to click on. Later. 
	// Possible alternative: on video.canplay, remove the video, and link to the source. 
		// Maybe a "load videos" button? Like a partial reload. Mark each image_container as try_video. (Each empty submission as well?) 
	// Ogg in video_formats?  

// Newgrounds favorites?



	// Genuine bugs:

// Pretty sure videos aren't being counted as "loading." (I accidentally got the count right because that checks for containers.) 

// Unicode arrows are fucky in Gelbooru on Chromium. 

// Gelbooru: non-video submissions can have nonexistent video URL resolve. Uh... huh. 
	// https://gelbooru.com/index.php?page=post&s=view&id=498992&tags=shiwashiwa_no_kinchakubukuru#dnr#&dnr
	// https://img3.gelbooru.com//images/b0/c7/b0c7fc167cda70cc61d5710dc23045a2.gif
	// https://img3.gelbooru.com/images/b0/c7/b0c7fc167cda70cc61d5710dc23045a2.webm
	// The .webm file is there. It loads as a 0-second video. 
	// Argh, and reloading the submission shows both the image and the video, until the video plays. 

// Image-to-tab shortcut 403s on Pixiv. Clicking the image would work, except .click() triggers popup blocking. 





// Changes since last version: 
	// Added 8muses.com thanks to FengHuang. 
	// Increased z-index for Swallow Gallery button because of 8muses.com. 
	// CSS puzzle-solving to avoid folder thumbnails on 8muses.com. 





// ------------------------------------ Custom replacement HTML ------------------------------------ //





// Replacement page. Not used immediately; it just makes more sense up here. 
var html = '';	
var style_rules = new Object; 			// CSS "selector": "style" map. Blame Baraag. 
var options; 		// Moved higher? 



	// ----- //			CSS



// CSS rules as an associative array, so they can be applied per-element on uncooperative sites. 

// CENTER ALL THE THINGS. 
style_rules[ '*' ] = 'vertical-align: middle !important;'; 
style_rules[ 'html body' ] = 'width: auto; line-height: 1.425 !important;';		// No more sites with inset bodies. Prevent controls from overlapping thumbnails. 
style_rules[ 'html' ] = 'scroll-padding-top: 0px !important;'; 		// No vertical scroll offset. 

// Image style(s):
style_rules[ 'img, video' ] = 'max-width: initial; max-height: initial;' 		// For enforce_style. (Also counts as "full".) 
style_rules[ '.short img, .short video' ] = 'max-width: 90vw; max-height: 60vh;'; 		// Class is for <body>. 
style_rules[ '.fit_width img, .fit_width video' ] = 'max-width: 90vw;'; 	// Leaving space for big X.
style_rules[ '.fit_height img, .fit_height video' ] = 'max-height: 95vh;'; 
style_rules[ '.fit_window img, .fit_window video' ] = 'max-width: 90vw; max-height: 95vh;'; 

style_rules[ 'object, video' ] = 'max-width: initial; max-height: initial;' 		// For enforce_style. (Also counts as "full".) 
style_rules[ '.short object, .short video' ] = 'max-width: 90vw; max-height: 60vh;'; 		// Class is for <body>. 
style_rules[ '.fit_width object, .fit_width video' ] = 'max-width: 90vw;'; 	// Leaving space for big X.
style_rules[ '.fit_height object, .fit_height video' ] = 'max-height: 95vh;'; 
style_rules[ '.fit_window object, .fit_window video' ] = 'max-width: 90vw; max-height: 95vh;'; 

// Dead spinners and other invisible elements:
style_rules[ '.invisible' ] = 'display: none;'; 		// s0 for spinners: className is s+querySelectorAll.length. 
style_rules[ '.button_spacer' ] = 'visibility: hidden; width: 30px !important; height: 30px;'; 
style_rules[ '.spinner_spacer' ] = 'width: 70px; height: 60px; visibility: hidden'; 

style_rules[ '#image_counter_id' ] = 'left: 70px; top: 5px; font-size: 33px;';

// Remove / reload controls: 
style_rules[ '.remover' ] = 'color:#dd2e44 !important; background-color:#992a2a; border:1px solid #ab1919;';
style_rules[ '.remover.floating' ] = 'position: absolute; top: 50%; transform: translateY(-50%); width: 120px; height: 120px; font-size:72px !important;';
style_rules[ '.reloader' ] = 'color:#194d19 !important; background-color:#2abd2a; border:1px solid #19ab19;';
style_rules[ '.undo' ] = 'position: fixed; right: 0px; bottom: 0px;'; 

// Previous / next buttons, per-submission:
style_rules[ '.nav_button' ] = 'color:#123 !important; background-color:#14f; border:1px solid #234;';
style_rules[ '.nav_float' ] = 'z-index: 11; position: absolute; left: 0px; top: initial;'; 
style_rules[ '.nav_next_image' ] = 'top: 72px;'; 
style_rules[ '.remover.nav_button' ] = 'top: 144px; font-size: 20px !important; color: #a12 !important; background-color:#dd2e44;'; 		// Remove-and-advance. 

// Keyboard control anchors / runout:
style_rules[ '.image_container.submission' ] = 'position: absolute; height: 300px; visibility: hidden;'; 		// display:none breaks scrollIntoView. 
style_rules[ '.bookend_gradients .image_container:last-child:not(.image_container:first-child)' ] = 
'background: linear-gradient( 0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .1) 10%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100% );';
style_rules[ '.bookend_gradients .image_container:first-child:not(.image_container:last-child)' ] = 
'background: linear-gradient( 180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .1) 10%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100% );';

// Button DRY:
style_rules[ '.eza_button' ] = 'border-radius: 50%; width: 60px; height: 60px; text-align: center; display: inline-block; cursor:pointer; line-height: 20px; font-size:33px !important; padding: 10px 10px; text-decoration: none; font-family: sans-serif !important; opacity: 1;';
style_rules[ '.eza_button:not(:hover)' ] = 'background-color:#d7dbd8;' 		// Inverts and elides repeated .nav:hover / .reloader:hover background-color rules. 
style_rules[ '.translucent_buttons .eza_button:not(:hover)' ] = 'opacity: 0.3;'; 
style_rules[ '.disable_buttons .eza_button:not(.control_button)' ] = 'visibility: hidden;'; 

// enforce_style kludges: 
style_rules[ '.floating.remover' ] = 'width: 120px; height: 120px; font-size:72px !important;';
style_rules[ '.nav_button.remover' ] = 'font-size: 20px !important;';

// Image-size controls:
style_rules[ '#controls_id' ] = 'float: right; font-size: 33px;';
style_rules[ '.eza_button.control_button' ] = 'color:#FFF; background-color:#363;'; 		// Overdefined to supercede :not(:hover). 
style_rules[ '.control_button:hover' ] = 'background-color:#282;'; 
style_rules[ '.short #short, .full #full, .fit_width #fit_width, .fit_height #fit_height, .fit_window #fit_window' ] = 'color:#FFF; background-color:#191;'; 

// Options stuff:
style_rules[ '#options_button' ] = 'font-size: 25px !important; padding: 0px 0px; opacity: 1; width: 30px; height: 30px; left: 17px; top: 29px; z-index: 13; position: absolute;' 
style_rules[ '#options_dialog' ] = 'color: #ccc !important; position: absolute; left: 32px; top: 48px; z-index: 12; background-color: #161; padding: 10px 10px; line-height: 2;'
style_rules[ '#options_dialog input[type="checkbox"]' ] = 'float: right; width: 100px; transform: translateY( 50% ); margin: unset !important;'
style_rules[ '#options_dialog select' ] = 'float: right; height: auto; transform: translateY( 20% ); padding: 0;' 		// Syncretize padding: 0 to 0px 0px? 
	// Translate is a complete kludge, because CSS is hot garbage. 

// Dark mode button:
style_rules[ '#backdrop_id' ] = 'background: rgba(0,0,0,0); padding-bottom: 90vh; width: 100%'; 		// For enforce_style. 
style_rules[ '#backdrop_id.dark_mode' ] = 'background: #181818'; 
style_rules[ '#backdrop_id.dark_mode #dark_mode_button' ] = 'color: #000 !important;'

// Previous / next links, at the bottom:
style_rules[ '#links_id' ] = 'font-size: 33px; !important';

// Thumbnail container and fixed-size thumbnails:
style_rules[ '#thumbnails_id .overlap' ] = 'position: sticky; right: 5px; bottom: 5px;'; 
style_rules[ '#thumbnails_id img' ] = 'width:100%;';
style_rules[ '#thumbnails_id span' ] = 'width: 100px; height: 100px; display: inline-block; overflow: hidden;';
style_rules[ '#thumbnails_id button' ] = 'float: right; width: 30px; height: 30px; font-size: 20px !important; padding: 0px 0px;'; 		// Could just left: 5px and not float: right. Toss-up. 
style_rules[ 'img.cleared_submission' ] = 'filter: saturate(0%) brightness(50%);'; 
// I probably can't predicate this selector on the existence of a submission basket further down the page. Especially with matching arbitrary ID numbers. 

//style_rules[ 'body' ] = 'line-height: 1.425 !important'; 		// Lower values let thumbnails overlap image controls. 
	// Why is this not part of 'html body' above? 

// Spinners to indicate loading submissions / loading images:
style_rules[ '#submissions_spinner_id' ] = 'position: absolute; left: 1px; top: 13px; z-index: 10; border: 8px solid #3498db; border-top: 8px solid #111111; border-bottom: 8px solid #111111; border-radius: 50%; width: 46px; height: 46px; box-sizing: unset !important; transition: transform 10000000s linear' 		// The blue one. 
style_rules [ '#images_spinner_id' ] = 'position: absolute; left: 8px; top: 20px; z-index: 9; border: 24px solid #db9834; border-top: 24px solid #aaaaaa; border-bottom: 24px solid #AAAAAA; border-radius: 50%; width: 0px; height: 0px; box-sizing: unset !important; transition: transform 30000000s linear' 		// The orange one. 
style_rules[ '.spinning a' ] = 'transform: rotate(3600000000deg);'; 

// Push all of that into a <style> block:
//html += '<style> ';
//for( let selector in style_rules ) { html += selector + ' { ' + style_rules[ selector ] + ' } '; } 
//html += '#style_check_id{ display: none; } '; 		// If this works, don't enforce_style. 
//html += '</style>';

// GM.addStyle can force CSS on uncooperative sites, so style_rules / enforce_style are no longer needed. 
// This will break compatibility with older versions of GreaseMonkey, but even I'm moving on, and I'm a curmudgeon. 
// Wait, enforce_style is also where we change document.body classes. And there's little cost to leaving it as-is, besides my urge to golf. 
let css_text = ""; 
for( let selector in style_rules ) { css_text += "" + selector + " { " + style_rules[ selector ] + " } "; } 



	// ----- //			Page elements



// Put everything in one DIV so I can change the background color. Yes, this is completely necessary. 
html += '<div id="backdrop_id">'; 

// Floaty stuff:
html += '<br><span id="spinners_id">' 		// So enforce_style() can apply to spinners. 
	+ '<button class="spinner_spacer"></button>' 		// Spacing. <button> because <div> and <span> are dumb as hell about width/height. 
	+ '<a id="submissions_spinner_id"></a>' 		// Spinner for submissions, 'new images being found.' Blue. 
	+ '<a id="images_spinner_id"></a>' 		// Spinner for images, 'images loading in high-res.' Orange. 
	+ '<span id="image_counter_id"></span>' 
	+ '<span id="controls_id" class=""></span>' 		// Image-size controls. 
	+ '</span>'

// Structure:
html += '<br><br><span id="thumbnails_id"></span><br><br>' 
	+ '<center>'
	+ '<span id="dark_mode_id"></span><br>' 
	+ '<br><span id="centered_id"></span>' 		// Where most stuff goes.
	+ '<br><br><br>' 		// Spacing for prev / next links. 
	+ '<span id="links_id"></span>' 	// Previous Page / Next Page. 
	+ '<div style="position: absolute;" id="style_check_id"></div>' 		// Invisible probe for enforce_style. 

html += '</center></div>';

// Additional HTML may be added by per-site functions. Once injected, we use the DOM. 





// ------------------------------------ General setup & Per-site functions ------------------------------------ //





	// ----- //			Global variables 



var trigger_size = [ 15, 70, 25, 10 ]; 			// Left, top, font-size, padding. Pixiv defaults. 
var items; 					// Scraped contents of page. 
var formats = [ '.png', '.jpg', '.gif', '.jpeg', '.webp' ]; 		// File extensions for guessing URLs. 
var video_formats = [ '.webm', '.mp4' ]; 
var next_page, previous_page; 		// URLS to the actual previous / next page (where applicable). 
var page_number; 		// Surprise, this is global again. 
var undo_list = new Array; 				// For holding and restoring elements. (See undoable_replace.) First in, last out. 
var force_top_to_bottom; 		// Some domains / pages are already chronological. 

var image_size_symbols = { short: "▣", fit_width: "↔", fit_height: "↕", fit_window: "✢", full: "■" }; 		// Global for the sake of the options menu. 

var gather_items; 		// Per-site function to scrape current page contents. 
var button_delay_function = ( () => gather_items()[0] ); 	// Don't show Swallow Gallery button while this returns false. (Alternative to @includes.) 
var image_from_dom; 	// Per-site function to scrape fetched HTML (if relevant). 

// Old config options that are too technical to bother exposing:
var new_image_rate = 100; 			// Milliseconds between loading images. E.g. 10 for instant, 200 for gradual. 
var fetch_rate = 250; 					// Slower rate for fetching than for loading images, to avoid rate-limiting. 
var loading_limit = 5; 		// How many images can be downloading at the same time. 10 is the old default. 
	// I need proper it-stopped-loading detection. Even one-at-a-time doesn't stop sites from playing stupid games. 
	// People - limit bandwidth, don't kill connections. Humans and robots alike will F5 and hammer you even more. 



	// ----- //			Helper functions 



// Things specific to this script and its global variables:

// Replace .jpg, .png, etc., because full-size image formats don't always match their thumbnail format. 
function scrub_extensions( url ) { 
	formats.forEach( ext => {
		url = ( '' + url ).replace( ext, '%format' );
	} )
	return url; 
} 

// Fake CSS with inline style, if in-page CSS is prevented by CSP. I hate the modern web. 
function enforce_style( parent ) { 
	// All of these could probably go in the #backdrop_id div. That's effectively our root. 
	for( let key in options ) { 
		if( typeof( options[ key ] ) == 'boolean' ) { 
			if( options[ key ] ) { document.body.classList.add( key ) } else { document.body.classList.remove( key ) } 
		} 
	} 

	if( document.getElementById( 'style_check_id' ).clientWidth == 0 ) { return; } 		// Inline <style> block, not in style_rules. 
	for( let selector in style_rules ) { 		// Global
		Array.from( ( parent || document ).querySelectorAll( selector ) ) 		// Whole document by default. 
			.forEach( element => { 
				element.style = element.style.cssText + style_rules[ selector ]; 
			} )
	} 
} 

// Fetch HTML, interpret as DOM, pass DOM to standard get-image(s) function, flag image(s) as ready to display. 
function standard_fetch( item_object, span ) { 
	fetch( item_object.page )
		.then( response => { 		// On fetch error, retry: set "ready" in 10-20 seconds. 
			if( ! response.ok ) { setTimeout( () => span.classList.add( "ready" ), 1000 * ( 10 + Math.random() * 10 ) ); } 
			return response.text(); 
		} )
		.then( text => { 
			let doc = document.createElement( 'html' );
			doc.innerHTML = text; 
			item_object.image = image_from_dom( doc, item_object ); 
			span.classList.add( "ready" ); 
		} )
} 

// Grab element, swap it out, and keep both, so they can be swapped back. 
// Format is an array of objects, each with properties .original and .replacement, both Elements. 
function undoable_replace( current, replacement ) { 
	if( ! current.classList.contains( 'basket' ) ) { 		// When removing images, mark submission as modified.
		current.closest( '.submission' ).querySelector( '.basket' ).classList.remove( 'unmodified' ); 
	} 
	current.replaceWith( replacement ); 
	undo_list.push( new Object( { original: current, replacement: replacement } ) ); 
	return undo_list[ undo_list.length - 1 ]; 
}

// DRY for submissions. 
// "page" is some <a>, "title" is in its URL, "thumb" is the <img> inside the <a>, and "image" is some scrub(thumb).replace() job.
// Could check element type of "page" and do querySelector('a') by default. 
function typical_item( page, thumb_to_image ) { 
	if( typeof( thumb_to_image ) != 'function' ) { thumb_to_image = null; } 		// Allow .map callback. 
	let title = [ 'id=', 'post/', 'posts/', 'images/', 'view/', 'show/', '/s/' ] 		// Safely extract number after one of these indicators. 
		.map( v => ( ( '' + page ).match( v + '([0-9]+)' ) || [''] ).pop() ).join( '' ) || "Link"; 	// ... or give up and be generic. 
	let thumb = ( page.querySelector( 'img' ) || { src: '' } ).src; 		// img.src, but safely. 
	return new Object( { page: page, title: title, thumb: thumb, 
		image: thumb_to_image && thumb_to_image( scrub_extensions( thumb ) ) 		// No item.image for fetched sites.
	} )

}

// DRY for page links via querySelector. 
function previous_and_next( previous, next ) { 
	[ previous_page, next_page ] = [ previous, next ].map( q => document.querySelector( q ) ) 
} 

// Okay fine I'll DRY the ?p=n links. (Just e-Hentai and Pixiv at the moment.) 
function links_from_page_number( indicator, ordinal ) { 
	page_number = ( parse_search( window.location.search )[ indicator ] || ordinal ) | 0; 		// Parse search again - parseInt or default. 
	let basis = window.location.origin + window.location.pathname + "?" + indicator + "=" 
	if( page_number > ordinal ) { previous_page = basis + (page_number - 1); }
	next_page = basis + (page_number + 1); 
}

// Make snake_case strings into pretty labels. 
function variable_to_name( variable ) { 
	return variable[0].toUpperCase() + variable.substr( 1 ).replace( /_/g, ' ' )
} 



// Things that really ought to be trivial and standard, but are a pain in the ass:

// Turn window.location.search into a sensible associative array. 
function parse_search( search_string ) { 
	let strings = search_string.split( /[\?\&]/ )
		.filter( v => v ) 		// Remove empty strings
	let associative = new Object;
	strings.forEach( v => { associative[ v.split('=')[0] ] = v.split('=')[1] } ); 
	return associative; 
}

// Sensible "are we on this site or not?!" function. 
function domain( ending ) { 
	// Could golf this to while( w = want.pop() && w == have.pop() ), without either reverse(). 
	// [].pop() is undefined, not an error. Thanfully. 
	let want = ending.split( '.' ).reverse(); 		// Reverse order, from TLD to domain to subdomain(s). 
	let have = document.domain.split( '.' ).reverse();
	for( let n = 0; n < want.length; n++ ) {
		if( want[n] != have[n] ) { return false; } 
	} 	// Implicit else:
	return true; 
} 

// createElement / set attributes / appendChild pattern. 
HTMLElement.prototype.addElement = function( tag, attribute_object ) { 
	let element = document.createElement( tag ); 
	for( let attribute in attribute_object ) { element[ attribute ] = attribute_object[ attribute ]; } 
	this.append( element ); 
	return element; 
}

// Return the next / previous instance of a selector, relative to this element. 
HTMLElement.prototype.nextQuery = function ( selector, direction ) { 
	let reference = this.closest( selector ); 		// Ancestor or self, whatever. 
	let list = Array.from( document.querySelectorAll( selector ) ); 
	let index = list.findIndex( e => e == reference ); 
	return list[ index + ( direction || 1 ) ]; 		// Default direction is forward. 
}
HTMLElement.prototype.previousQuery = function ( selector ) { 
	return this.nextQuery( selector, -1 ); 
}

// "A link containing this text" should not be so goddamn complicated. 
Element.prototype.querySelectorIncludes = function ( query, text ) { 
	return Array.from( this.querySelectorAll( query) )
		.find( v => v.innerText.includes( text ) ); 
}



	// ----- //			Per-site setup and gather functions 



var args = parse_search( window.location.search ); 		// If it happens anywhere it might as well happen here. 

// Typical site format is as follows.
// If we're on this domain:
	// Position the "Swallow Gallery" button via trigger_size. 
	// Grab previous_page / next_page links. 
	// Define gather_items to return an array of objects. 
		// "Item" objects include page URL, link title, and thumb URL.
			// Item.image is either a single URL or an array of URLs. 
			// Leave item.image blank if using fetch(). See below. 
	// Change button_delay_function if gather_items should only be called once. 
		// (E.g. if gather_items changes the page or runs slowly.) 
	// When using fetch() to get item.page, define image_from_dom to get item.image from that page. 

if( domain( 'pixiv.net' ) ) {
	formats = [ ".png", ".jpg", ".gif" ]; 	// I have never seen a JPEG on Pixiv. I have 100,000 _p0 JPGs, and they're all ".jpg". 
	video_formats = []; 
	new_image_rate = fetch_rate; 			// Slow down, since we now load all images directly. 

	// December 2021 redesign is fucky. Not sure this helps. 
	// 400 was having issues. Might've been Pixiv itself being busy; hard to tell. No hard cutoffs. Timeouts. 
	// 1000 seems to be working fine. Nope - also goes fucky. Hmm. 
	// God dammit, should I be tracking how many individual files are currently loading? 
	new_image_rate = fetch_rate = 1000; 		// Very touchy about "too many requests." 

	// Ever-useful test profile: https://www.pixiv.net/en/users/53625793 
	// SFW profile for testing when logged-out: https://www.pixiv.net/en/users/44241794 
	// Series: https://www.pixiv.net/user/2258616/series/38203, https://www.pixiv.net/user/55117629/series/87453?p=2 
	// Did a lot of remove-empty-container and undo testing here: https://www.pixiv.net/en/users/45227836/artworks
	button_delay_function = () => document.querySelector( 'img[src*="c/360"], div img[src*="c/250"], div[style*="c/240"], img[src*="240x480"]' ); 

	gather_items = function() { 
		links_from_page_number( 'p', 1 ); 
		if( window.location.href.match( 'ranking.php' ) ) { force_top_to_bottom = true; } 

		// /series:
		// https://i.pximg.net/c/360x360_70/img-master/img/2020/06/20/11/14/47/82439841_p0_square1200.jpg

		// en/users/12345 - also "related works" on artworks pages? 
		// https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/05/15/04/50/43/81571620_p0_square1200.jpg 
		// https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2021/03/13/21/24/07/88416537_p0_custom1200.jpg

		// bookmark_new_illust:
		// url("https://i.pximg.net/c/240x240/img-master/img/2021/02/17/04/05/41/87838098_p0_master1200.jpg") 

		// ranking.php:
		// https://i.pximg.net/c/240x480/img-master/img/2021/05/07/00/05/04/89657320_p0_master1200.jpg
			
		let thumbs = Array.from( document.querySelectorAll( 'img[src*="c/360"], div img[src*="c/250"], div[style*="c/240"], img[src*="240x480"]' ) ); 

		return thumbs.map( t => { 
			let thumb = t.src || t.style.backgroundImage.match( /\"(.*)\"/ )[1]; 
			let image_part = thumb.match( /img\/(.*?)_/ )[1]; 		// 2021/03/07/07/11/52/88269944;
			let submission = image_part.split( '/' ).pop(); 		// 88269944
			let count = t.closest( 'a' ).querySelector( 'span:not([class])' ); 		// Avoids inconsistent class names. 
			return new Object( { 
				page: 		'https://www.pixiv.net/artworks/' + submission,
				title: 		submission,
				thumb: 	thumb,
				image: 	new Array( count && count.innerText | 0 ).fill( 0 ) 		// new Array( null ) has one element, which we replace. 
					.map( (v,i,a) => 'https://i.pximg.net/img-original/img/' + image_part + '_p' + i + '%format' ) 
			} ) 
		} ) 
	}
}

if( domain( 'gelbooru.com' ) || domain( 'safebooru.org' ) || domain( 'hypnohub.net' ) ) {
	// https://gelbooru.com/index.php?page=post&s=list&tags=shuujin_academy_uniform+chair+1girl+pink_background 
	trigger_size = [ 15, 50, 16, 5 ]; 		// Left, top, font-size, padding. 

	let current = document.querySelector( '#paginator b, .pagination b, .paginator b' ) 
	previous_page = current.previousElementSibling; 
	next_page = current.nextElementSibling; 

	// https://gelbooru.com/index.php?page=post&s=view&id=4179699&tags=pink_background
		// https://img3.gelbooru.com/thumbnails/f5/c7/thumbnail_f5c7826072943fd72076ba9121b473f0.jpg
		// https://img3.gelbooru.com/images/f5/c7/f5c7826072943fd72076ba9121b473f0.jpg
		// https://safebooru.org/thumbnails/3259/thumbnail_91588bf615a2d239d5b09c7c959236bc17b58ca6.jpg?3389404
		// https://safebooru.org//images/3259/91588bf615a2d239d5b09c7c959236bc17b58ca6.jpg?3389404 
	gather_items = () => Array.from( document.querySelectorAll( 'a[href*="s=view"][href*="page=post"]' ) )
		.map( v => typical_item( v, t => t.replace( '/thumbnails', '/images' ).replace( /_*thumbnail_*/, '' ) ) ); 
}

if( domain( 'e621.net' ) || domain( 'e926.net' ) || domain( 'e6ai.net' ) ) {
	// https://e621.net/posts?tags=somik+mirror
	trigger_size = [ 15, 50, 16, 5 ]; 		// Left, top, font-size, padding. 
	if( window.location.href.indexOf( '/pools/' ) > 0 ) { force_top_to_bottom = true; } 
	previous_and_next( '#paginator-prev', '#paginator-next' ); 
//	new_image_rate = fetch_rate = 5000; 		// Maybe. 
	loading_limit = 3; 		// Maybe? 

	// https://e621.net/posts/1333873?q=somik+mirror
		// https://static1.e621.net/data/preview/37/75/3775cd8664c688f98a41780f6796ce86.jpg
		// https://static1.e621.net/data/37/75/3775cd8664c688f98a41780f6796ce86.png
	gather_items = () => Array.from( document.querySelectorAll( 'article.thumbnail:not(.blacklisted) a' ) )
		.map( v => typical_item( v, t => t.replace( '/preview', '' ) ) ); 
}

if( domain( 'hentai-foundry.com' ) ) {
	// http://www.hentai-foundry.com/users/FaveUsersRecentPictures?username=AmaZima
	// http://www.hentai-foundry.com/user/InCase/faves/pictures
	trigger_size = [ 15, 20, 25, 10 ]; 
	previous_and_next( 'li.previous a', 'li.next a' ); 

	gather_items = () => Array.from( document.querySelectorAll( 'a.thumbLink' ) ) 
		.map( v => {
			// http://www.hentai-foundry.com/pictures/user/AmaZima/589016/Tired-but-happy-Lottie
			let p = v.href.split( '/' ); 
			let username = p[5]; 	// AmaZima
			let title = p[6]; 			// 589016
			return new Object( { 
				page: 		v,
				title: 		title, 
				// url("//thumbs.hentai-foundry.com/thumb.php?pid=589016&size=350")
				thumb: 	v.querySelector( 'span[style]' ).style.backgroundImage
					.match( /\"(.*)\"/ )[1],  
				// http://pictures.hentai-foundry.com/a/AmaZima/589016/AmaZima-589016-Tired_but_happy_Lottie.png
				// http://pictures.hentai-foundry.com/t/Tixnen/869342/Tixnen-869342-Vasilina.jpg - extension matters, filename doesn't. 
				image: 	[ 	( window.location.protocol + "//pictures.hentai-foundry.com" ), 
									username[0].toLowerCase(), username, title, 
									( username + '-' + title + '-' + p[7].replace( /-/g, '_' ) + '%format' )
								].join( '/' )
			} )
		} ) 
} 

// Should probably have some generic test for Mastodon, even if I use @includes. Because I use @includes. 
// Maybe put that last? Like this approach is only valid if gather_items is undefined. 
if( 
//domain( 'baraag.net' ) || 
domain( 'equestria.social' ) || 
domain( 'botsin.space' ) || 
domain( 'pawoo.net' ) || 
domain( 'mastodon.art' ) || 
domain( 'mastodon.social' ) ) { 
	// https://baraag.net/@Applalt/media
	// https://baraag.net/@Applalt/media?max_id=105165058865018699 // Yeesh. 
	// One element on first page: next. One element past first page: previous. Otherwise: previous, next. 
	[ next_page, previous_page ] = document.querySelectorAll( 'a[class*="load-more"]' ); 		// Usually reversed: 
	[ 'max_id', 'page' ].forEach( v => { if( args[ v ] ) { [ previous_page, next_page ] = [ next_page, previous_page ]; } } ); 

	gather_items = () => Array.from( document.querySelectorAll( '.h-entry, .h-cite' ) ) 
		.filter( v => v.querySelector( 'div[data-props*="media"]' ) ) 		// Text-only posts fuck us up. 
		.map( v => {
			let item = new Object; 
			item.page = v.querySelector( 'a[class*="time"][href]' ).href; 
			item.title = item.page.split( '/' ).pop(); 

			// dataset.props example: Object { height: 343, sensitive: true, autoplay: true, media: Array[3] }
			// .media example: Array [ Object, Object, Object ]
			// .media[0]: Object { id: "105651575500861937", type: "image", 
				// url: "https://baraag.net/system/media_att…", preview_url: "https://baraag.net/system/media_att…", 
				// remote_url: null, preview_remote_url: null, text_url: "https://baraag.net/media/C62aWhAqWt…", 
				// meta: Object, description: null, blurhash: "UFCGJfX99@RP^%t7OoV@4ms:kpn+x[V@Rja#" }
			// ... but none of those URLs are the post URL, so keep original item.page code. 
			let data = JSON.parse( v
					.querySelector( 'div[data-props]' )
					.dataset.props )
				.media; 		// Array of objects

			if( data ) { 		// Clunky workaround for some video submissions. Only some. 
				item.thumb = data.map( v => v.preview_url )[0]; 	// One thumbnail per submission. 
				item.image = data.map( v => v.url ); 
			} 
			return item; 
		} ) 
} 

// Baraag do-over for their terrible redesign. Years late. 
if( domain( 'baraag.net' ) ) { 

	formats = []; 
	// video_formats = [ '.mp4' ]; 		// Kludge. 

	// gather_items = () => { 
	// 	let set = Array.from( document.querySelectorAll( 'a.media-gallery__item-thumbnail' ) ).map( typical_item ); 
	// 	let seen = {}; 		// Deduplication: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
	// 	return set.filter( i => { let url = i.page.href; return seen.hasOwnProperty( url ) ? false : seen[ url ] = true; } );
	// } 
	// Could just grab links and thumbnails from the page - except they're ordered 7-8-9-4-5-6-1-2-3.
	// Could insert i.image into another element's list. Save a bunch of fetch spam. 
	
	// Concatenating in the .filter de-duplication pass works... but now misses GIFs as well as MP4s? 
	// Oh shit, there's an og:video tag when it's a video. Convenient. 
	// This might sprawl out as I do map( v => v.querySelector( 'video' ) ? etc. 
	// Can this script even handle mixed images and video in image[]? 
	
	gather_items = () => { 
		let set = Array.from( document.querySelectorAll( 'a.media-gallery__item-thumbnail' ) )
			// .map( v => typical_item( v, t => [ t.replace( '/small/', '/original/' ) ] ) );
			// .map( v => new Object( { page: v, title: "Link", thumb: v.querySelector( 'img' )?.src } ) )
		for( let n = 0; n < set.length; n++ ) { 
			if( set[n].querySelector( 'video' ) ) { 
				// set[n] = typical_item( set[n], t => [ t.replace( '/small/', '/original/' ) ] ); 		// Video goes here... but fuck, GIFs. Or do proper GIFs exist? 
				set[n] = new Object( { page: set[n], title: "Link", thumb: set[n].querySelector( 'video' )?.src, image: [ set[n].querySelector( 'video' )?.src ] } ); 
			} else {
				set[n] = typical_item( set[n], t => [ t.replace( '/small/', '/original/' ) ] );
			} 
		} 
		let seen = {}; 
		set = set.filter( (v,i,a) => { 
			let url = v.page.href; 
			if( seen.hasOwnProperty( url ) ) { 
				a[ seen[ url ] ].image = a[ seen[ url ] ].image.concat( v.image ); 
				// Hoist by my own petard on string / array bullshit. 
				// Naturally the spread operator (...) turns a string into an array of single characters. 
				// Single-image array in the typical_item call don't help. Somehow. 
				// ... concat is not side-effectful, is it. God dammit, JS. 
				return false; 		// Debug. 
			} else { 
				seen[ url ] = i; 
				return true; 
			} 
			// return seen.hasOwnProperty( url ) ? false : seen[ url ] = true; 
		} );
		// for( let i = 0; i < set.length; i++ ) { 
		// 	if( seen.hasOwnProperty( url ) )
		// }
		return set; 
	}
	
	// image_from_dom = ( doc ) => 
	// 	Array.from( doc.querySelectorAll( 'meta[property="og:image"]' ) )
	// 		.map( og => og.content ); 		// Thank god for OpenGraph. 
	
	// Fuck, videos. 
	// https://baraag.net/@violet/media
	// https://baraag.net/@violet/112780446583203290
	// https://media.baraag.net/media_attachments/files/112/780/446/184/770/668/original/4a04c51e2a867172.mp4
	// https://media.baraag.net/media_attachments/files/112/780/446/184/770/668/original/4a04c51e2a867172.mp4
	// https://media.baraag.net/media_attachments/files/112/780/446/184/770/668/original/4a04c51e2a867172.mp4
	// https://media.baraag.net/media_attachments/files/112/780/446/184/770/668/small/4a04c51e2a867172.png - exists 
	// Okay, they're just right there on the page, if we're not fetching. Why don't they load? 
	// Ah, typical_item looks for img, not video. Frig. 
	// Could detect video in gather_items, in fetch-based version, and determine video URLs from the OpenGraph URL. 
	// Yeah we are totally not set up to handle video files with a known URL. It's all %format searching. 
}

if( domain( 'rule34.paheal.net' ) ) {
	// http://rule34.paheal.net/post/list/Marco_Diaz%20Polyle/1 
	[ previous_page, next_page ] = [ 'Prev', 'Next' ].map( q => document.body.querySelectorIncludes( 'a', q )	);
	
	loading_limit = 1; 		// One at a time or things get aggressive. 

	gather_items = () => Array.from( document.querySelectorAll( '.shm-thumb' ) ) 
		.map( v => new Object( { 
			page: 		v.querySelector( '.shm-thumb-link' ),
			title: 		v.querySelector( 'img' ).id.replace( 'thumb_', '' ), 
			thumb: 	v.querySelector( 'img' ).src,
			image: 	v.querySelector( 'a[href*="paheal-cdn"]' ).href + "?.jpg" 	// Could be 'a:nth-of-type(2)'.
			// Paheal's new CDN forces a lack of file extension. This kludge keeps default DownThemAll filters happy. 
		} ) )
}

if( domain( 'rule34.xxx' ) ) {
	// https://rule34.xxx/index.php?page=post&s=list&tags=davepetasprite%5e2+
	trigger_size = [ 150, 5, 16, 5 ]; 
	previous_and_next( 'a[alt="back"', 'a[alt="next"' ); 

	// https://rule34.xxx/index.php?page=post&s=view&id=4584602 
		// https://miami.rule34.xxx/thumbnails/3500/thumbnail_62b3adfaa4d100c4a6fc7d419f61dd49.jpg?3944961
		// https://us.rule34.xxx//images/3500/62b3adfaa4d100c4a6fc7d419f61dd49.png?3944961
	// https://rule34.xxx/index.php?page=post&s=view&id=3169392 - Video. 
		// https://us.rule34.xxx/images/2840/09ebede68b8234765d7dbd78ade52fd7.jpg?3169392 - No.
		// https://uswebm.rule34.xxx//images/2840/09ebede68b8234765d7dbd78ade52fd7.mp4?3169392 - Yes. 
	// Site applies border based on filetype, not "video" tag, so rely on "img[style]" instead. 
	gather_items = () => Array.from( document.querySelectorAll( '.thumb a' ) )
		.map( v => { if( i = v.querySelector( 'img[style]' ) ) { i.src += '#'; } return v; } ) 
		.map( v => typical_item( v, 
			t => t.replace( /\/\/.*\.rule(?!.*#)/, '//us.rule' ) 		// E.g. //miami.rule34.xxx -> //us.rule34.xxx
				.replace( /\/\/.*\.rule(?=.*#)/, '//uswebm.rule' ) 		// Videos have their own subdomain.
				.replace( '/thumbnails', '/images' )
				.replace( 'thumbnail_', '' ) 
		) ) 
}

if( domain( 'derpibooru.org' ) ) {
	// Note: this won't show blacklisted images, including "suggestive" images blacklisted for anonymous users. 
		// This behavior does not match Image Glutton but does match other sites in Gallery Swallower. 
		// Though I should probably .filter for known not-the-image thumbnails so nothing shows up. Hm. 
	trigger_size = [ 15, 55, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a.js-prev', 'a.js-next' ); 

	// https://derpibooru.org/images/2301306?q=artist%3Ahexado
		// https://derpicdn.net/img/2021/3/28/2581076/thumb.png
		// https://derpicdn.net/img/view/2021/3/28/2581078.png 
	gather_items = () => Array.from( document.querySelectorAll( 'a[title*="Tagged"]' ) ) 
		.map( v => typical_item( v, t => t.replace( '/img/', '/img/view/' ).replace( '/thumb', '' ) ) ); 
} 

if( domain( 'inkbunny.net' ) ) {
	// https://inkbunny.net/submissionsviewall.php?rid=e16e4b981e&mode=search&page=1&orderby=create_datetime&artist=Iztli
	// Custom thumbnail test - https://inkbunny.net/gallery/atryl/1/734675c046 - they just don't add _noncustom. It's fine. 
	// This seems to mess with your preview size settings. 
		// Presumably because we grab thumbnails, but... they're not the same size as "small" images. 
	trigger_size = [ 15, 265, 16, 5 ]; 
	previous_and_next( 'a[title="previous page"]', 'a[title="next page"]' ); 
	html += '<style> span { color: #ddd } </style>'; 		// Default colors are grey-on-grey. 
	if( args.mode == "pool" ) { force_top_to_bottom = true; } 

	gather_items = () => Array.from( document.querySelectorAll( '.widget_imageFromSubmission a' ) ).map( typical_item ); 

	// An array of either one thumbnail or all thumbnails (if this submission has multiple files), mapped to convert to full-size. 
	image_from_dom = ( doc, item ) => ( ! doc.querySelector( '#files_area' ) ? [ item.thumb ] :
		Array.from( doc.querySelectorAll( '.widget_imageFromSubmission img[title*="page"]' ) ).map( img => img.src ) )
			.map( thumb => scrub_extensions( thumb ) 
				.replace( /(\.[a-z]*)\/([a-z_]*)\/[a-z]*/, '$1/$2/full' ) 	// User reports /files/medium. Okay sure. Match .tld/folder/size. 
				.replace( 'thumbnails/', 'files/' ) 		// Split for e.g. private_thumbnails. 
				.replace( '_noncustom%', '%' ) 		// % to catch scrub_extensions %format. Effectively end-of-string. 
			)

	// Multi-image submission? Fetch this page like we got it from a thumbnail. 
	if( !!window.location.href.match( '/s/' ) ) { gather_items = false; } 		// Ignore submissions by default.  
	if( document.querySelector( '#files_area' ) ) { 
		trigger_size = [ 15, 305, 16, 5 ]; 
		gather_items = () => [ {
			page: window.location.href, 
			image: window.location.href,
			title: document.querySelector( 'td h1' ).innerText,		// This can fail. 
		} ];
	}
}

if( domain( 'furaffinity.net' ) ) {
	// https://www.furaffinity.net/gallery/mab/folder/808215/Divaea 
	trigger_size = [ 15, 125, 16, 5 ]; 
	video_formats = []; 

	// https://www.furaffinity.net/scraps/mab/2/
	// https://www.furaffinity.net/gallery/mab/folder/43380/Wildcard/2/
	// https://www.furaffinity.net/msg/submissions/new~40875552@48/ 
	// Completely goofy previous / next links. Sometimes links with no distinction besides text. Sometimes forms. Forms! Like it's 1998!
	[ previous_page, next_page ] = [ 'Prev', 'Next' ].map( q => document.body.querySelectorIncludes( 'form', q ) ).map( f => f && f.action ); 
	if( window.location.href.includes( 'msg/submissions' ) ) { previous_and_next( 'a.more-half.prev', 'a.more, a.more-half:not(.prev)' ); }

	button_delay_function = () => document.querySelector( 'figure.t-image' ); 

	gather_items = () => { 
		let items = Array.from( document.querySelectorAll( 'figure.t-image u a:has(img[class=""])' ) ).map( typical_item ); 
			// document.querySelectorAll( 'figure.t-image u a:not(a:has(img[class="blocked-content"])' ) if that stops working. 
		// Minor witchcraft - some part of FA hits an infinite loop if you replace the page and then resize anything. 
		// I don't understand what exactly it's doing. But I know that removing some things first can break it: 
		Array.from( document.querySelectorAll( 'a' ) ).forEach( v => v.remove() ); 
		return items; 
	}

	image_from_dom = ( doc ) => doc.querySelector( '.download a' ).href; 
} 

if( domain( 'danbooru.donmai.us' ) ) {
	// https://danbooru.donmai.us/posts?tags=marble_macintosh
	// Forced to fetch, because "click for original size" images use a different CDN. 
	// I could try making an educated guess based on data-width and data-large-width in the <article> properties. Meh. 
	trigger_size = [ 15, 100, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a.paginator-prev', 'a.paginator-next' ); 

	gather_items = () => Array.from( document.querySelectorAll( 'article.post-preview a' ) ).map( typical_item ); 

	image_from_dom = ( doc ) => doc.querySelector( 'a[download]' ).href.split('?')[0]; 	// Trim ?download stuff. 
} 

if( domain( 'booru.org' ) ) {
	// https://svtfoe.booru.org/index.php?page=post&s=list&tags=socks&pid=20
	trigger_size = [ 15, 55, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a[alt="back"]', 'a[alt="next"]' );

	// https://svtfoe.booru.org/index.php?page=post&s=view&id=29292
	 	// https://thumbs.booru.org/svtfoe/thumbnails//28/thumbnail_187209e3ca22a28fd1ce75a7fd4f54aee3cf1e62.jpg
		// https://img.booru.org/svtfoe//images/28/187209e3ca22a28fd1ce75a7fd4f54aee3cf1e62.jpg
	gather_items = () => Array.from( document.querySelectorAll( 'span.thumb a:not([style])' ) ) 		// Specifying not:(display:none) is weirdly difficult. 
		.map( v => typical_item( v, t => t.replace( 'thumbs.', 'img.' ).replace( '/thumbnails', '/images' ).replace( 'thumbnail_', '' ) ) ); 
} 

if( domain( 'jabarchives.com' ) ) { 
	// https://www.jabarchives.com/main/gallery/misterd/105
	trigger_size = [ 90, 55, 16, 5 ]; 		// Left, top, font-size, padding.
	// Two identical .pagination bars. So: "previous" is before the current-page link in the first bar, and "next" is after the one in the second bar. 
	let this_link = document.querySelectorAll( 'li.page-item.active a' ) 
	if( this_link[0] ) { previous_page = this_link[0].previousQuery( 'li.page-item a' ) } 
	if( this_link[1] ) { next_page = this_link[1].nextQuery( 'li.page-item a' ); }

	// https://jabarchives.com/main/post/10577
		// https://jabarchives.com/main/media/posts/2017/09/10/1L511532132607200182023271_thumb.png
		// https://jabarchives.com/main/media/posts/2017/09/10/1L511532132607200182023271_large.png
	// https://jabarchives.com/main/media/posts/2023/01/13/poland_18351_thumb.png
	// https://jabarchives.com/main/media/posts/2023/01/13/poland_18351_large.png
	gather_items = () => Array.from( document.querySelectorAll( '#gallposts a.image' ) )
		.sort( (x,y) => x.href.split('/').pop() | 0 < y.href.split('/').pop() | 0 ) 		// Forced chronological order. 
			// Don't remember why this was so fiddly. I guess it flops back and forth? 
		.map( v => typical_item( v, t => t.replace( '_thumb', '_large' ) ) ); 
} 

if( domain( 'aryion.com' ) ) { 
	trigger_size = [ 5, 110, 16, 5 ]; 		// Left, top, font-size, padding. 
	[ previous_page, next_page ] = [ '<<', '>>' ].map( q => document.body.querySelectorIncludes( '.pagenav a', q )	);
	loading_limit = 1; 

	// https://aryion.com/g4/view/486096
	// https://aryion.com/g4/gallery/Mortaven - with folders to avoid. 
	// https://aryion.com/g4/latest.php?id=25224
	// https://aryion.com/g4/view/659566 - frig, videos. 
		// :not(.type-Folders) would surely also catch stories. 
		// https://aryion.com/g4/data/907166-82056-17oqvyz.mp4
	
	// Stories sit and spin forever. They never exit the "loading" class. 
	// https://aryion.com/g4/latest.php?id=903258 
	// Might be intractable. 
	gather_items = () => Array.from( document.querySelectorAll( '.gallery-item:has(.type-Images, .type-Media) a, .detail-item a.thumb' ) )
		.map( typical_item );

	//image_from_dom = ( doc ) => doc.querySelector( 'meta[property*="secure_url"]' ).content; 		// Possibly not the largest size?
	image_from_dom = ( doc ) => doc.querySelector( 'meta[property*="secure_url"]' )?.content || doc.querySelector('#item-itself source')?.src; 
} 

if( domain( 'e-hentai.org' ) ) { 
	trigger_size = [ 5, 40, 16, 5 ]; 		// Left, top, font-size, padding. 
	force_top_to_bottom = true; 		// They're all in page order. 
	links_from_page_number( "p", 0 ); 

	gather_items = () => Array.from( document.querySelectorAll( '.gt200 a' ) ) 		// Or "#gdt a". 
		.map( (v,i,a) => new Object( { 		// This site has no discrete thumbnails. 
			page: 		v, 
			title: 		'Page ' + ( page_number * 40 + i + 1 ),
		} ) )

	image_from_dom = ( doc ) => doc.querySelector( '#img' ).src; 
} 

if( domain( 'lolibooru.moe' ) ||
domain( 'rule34hentai.net' ) ) { 
	trigger_size = [ 30, 150, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a.previousPage', 'a.nextPage' ); 
	if( domain( 'rule34hentai.net' ) ) { 
		formats = ['.jpg']; 		// All thumbs are JPGs. 
		video_formats = ['.mp4']; 		// Any video extension works. 
	} 

	// https://lolibooru.moe/data/preview/a5ea50c715ce6e4d100cd648894495b1.jpg
	// https://lolibooru.moe/image/a5ea50c715ce6e4d100cd648894495b1/lolibooru%20240335%20age_difference (etc) .jpg - Anything works. 
	// https://lolibooru.moe/image/a5ea50c715ce6e4d100cd648894495b1.jpg works, so just do that. 
	// https://rule34hentai.net/_thumbs/880ec94d9f95ff8ce8887e14a9f8b909/thumb.jpg
	// https://rule34hentai.net/_images/880ec94d9f95ff8ce8887e14a9f8b909/467235%20-%20Naras%20Overwatch%20Sombra%20Tracer.png
	// https://rule34hentai.net/_images/880ec94d9f95ff8ce8887e14a9f8b909.jpg - also works. 
	gather_items = () => Array.from( document.querySelectorAll( 'a.thumb' ) )
		.map( v => typical_item( v, t => t.replace( 'data/preview', 'image' ).replace( '/_thumbs', '/_images' ).replace( '/thumb.', '.' ) ) ) 
	// https://rule34hentai.net/_thumbs/a7c849db849d7f017483163d2a01d8b3/thumb.jpg 
	// https://rule34hentai.net/_images/a7c849db849d7f017483163d2a01d8b3/296505%20-%20A_Goofy_Movie%20Goof_Troop%20No_One_%28artist%29%20Roxanne_%28goof_troop%29.jpg 
	// Every file is "thumb.jpg". That's a problem. 
} 

if( domain( 'yande.re' ) ) { 	// Aggravatingly close to Lolibooru, but incompatible. 
	trigger_size = [ 30, 105, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a.previous_page', 'a.next_page' ); 

	// Some images are /jpeg/ and some images are /image/ and there's no way to tell. Dammit. So we fetch. 
	gather_items = () => Array.from( document.querySelectorAll( 'li a.thumb' ) )
		.map( typical_item ); 

	image_from_dom = ( doc ) => doc.querySelector( '.highres-show' ).href; 
} 

if( domain( 'thehentaiworld.com' ) ) { 
	trigger_size = [ 25, 125, 16, 5 ]; 		// Left, top, font-size, padding. 
	previous_and_next( 'a.prev', 'a.next' ); 

	gather_items = () => Array.from( document.querySelectorAll( 'div.thumb a' ) )
		.map( typical_item ); 

	image_from_dom = ( doc ) => doc.querySelector( '#miniThumbContainer' ) ? 		// If multi-image,
		Array.from( doc.querySelectorAll( '#miniThumbContainer img' ) ) 					// Modify thumbnails. 
			.map( v => scrub_extensions( v.src ).replace( '-220x147', '' ) )
		: doc.querySelector( '#info li a' ).href; 																// Else return main image. 
} 

if( domain( 'r34hub.com' ) ) { 
	html += '<style> span { color: #ddd } </style>'; 		// Black text on a dark background image. Nope. 
	[ previous_page, next_page ] = Array.from( document.querySelectorAll( '.pagination-button' ) ); 	// Always both or neither - sometimes links. 

	gather_items = () => Array.from( document.querySelectorAll( '.media-block' ) )
		.map( v => typical_item( v.closest( 'a' ) ) )
		.slice(1) 		// #9996 keeps showing up first. No idea why. 
	// Should be 'a:has(.media-block)', but I think the site is broken. 

	image_from_dom = ( doc ) => doc.querySelector( '.media-wrapper img, .media-wrapper source' ).src; 
} 

if( domain( 'newgrounds.com' ) ) { 
	// https://kevinnator.newgrounds.com/art - no page links, ever. 
	trigger_size = [ 15, 330, 16, 5 ]; 		// Left, top, font-size, padding. 

	new_image_rate = fetch_rate = 400; 		// Very touchy about "too many requests." 

	gather_items = () => Array.from( document.querySelectorAll( 'a[class*="item-art"]' ) ).map( typical_item ); 

	image_from_dom = ( doc ) => 
		Array.from( doc.querySelector( '.pod[itemscope] .pod-body' ).querySelectorAll( 'img' ) ) 
			.map( i => i.alt ? 'https://art.ngfiles.com/comments/' + i.alt.split('_')[1].slice(0,-3) + '000/' + i.alt : i.src ); 
			// Sub-images: iu_446193_6909266.webp -> https://art.ngfiles.com/comments/446000/iu_446193_6909266.webp
}

if( domain( 'booru.allthefallen.moe' ) ) { 
	// https://booru.allthefallen.moe/posts?tags=sin_kids
	trigger_size = [ 15, 55, 16, 5 ]; 		// Left, top, font-size, padding. 

	previous_and_next( 'a.paginator-prev', 'a.paginator-next' ); 

	// https://booru.allthefallen.moe/data/180x180/f0/b7/f0b7bcab14dbf3b217b6777fddea0fb1.jpg
	// https://booru.allthefallen.moe/data/720x720/f0/b7/f0b7bcab14dbf3b217b6777fddea0fb1.webp
	// https://booru.allthefallen.moe/data/original/f0/b7/f0b7bcab14dbf3b217b6777fddea0fb1.png 
	gather_items = () => Array.from( document.querySelectorAll( 'article:not(.blacklisted-active) a[draggable]' ) )
		//.map( v => typical_item( v, t => t.replace( '/preview', '/original' ) ) ); 
		.map( v => typical_item( v, t => t.replace( /data\/.*?\//, 'data/original/' ) ) ); 
} 

if( domain( 'mspabooru.com' ) ) {
	// https://mspabooru.com/index.php?page=post&s=list&tags=multishipping+terezi
	trigger_size = [ 15, 115, 16, 5 ]; 		// Left, top, font-size, padding. 

	// Dark mode: fix background / options menu, lighten text. 
	// Should probably modify css_text going forward. 
	html += '<style> .dark_mode span, .dark_mode div, #click_away_div { background: unset; color: #ddd; } </style>'; 

	previous_and_next( 'div.pagination a[alt*="back"]', 'div.pagination a[alt*="next"]' ); 

	// https://mspabooru.com/thumbnails/15/thumbnail_a0d56e36a5285e17d3dd9796fc738ad0.png?164253 
	// https://mspabooru.com//images/15/a0d56e36a5285e17d3dd9796fc738ad0.png?164253 
	gather_items = () => Array.from( document.querySelectorAll( 'span.thumb a' ) )
		.map( v => typical_item( v, t => t.replace( 'thumbnails', '/images' ).replace( 'thumbnail_', '' ) ) ); 
}

if( domain( 'incognitymous.com' ) ) { 
	force_top_to_bottom = true; 			// Always in-order. No pagination. 

	// There are direct lightbox links - but this code is more concise. 
	// https://incognitymous.com/images/GettingOff_Page01-150x150.png
	// https://incognitymous.com/images/GettingOff_Page01.png
	gather_items = () => Array.from( document.querySelectorAll( 'article.gall-itm' ) )
		.map( v => typical_item( v, t => t.replace( '-150x150', '' ) ) ); 
} 

if( domain( 'putme.ga' ) ) {
	trigger_size = [ 15, 60, 25, 10 ];

	previous_and_next( '.pagination-prev:not(.pagination-disabled) a', '.pagination-next:not(.pagination-disabled) a' ); 

	// https://putme.ga/album/treats.RQg1U
	gather_items = () => Array.from( document.querySelectorAll( '.image-container' ) ) 
		.map( v => typical_item( v, t => t.replace( '.md', '' ) ) ); 
}

// This is a single-submission view, more like Pixiv Fixiv than Gallery Swallower proper. 
// https://www.reddit.com/gallery/sjnm9k
// https://www.reddit.com/r/Gameboy/comments/sjnm9k/my_own_gameboy_zero_build/
if( domain( 'reddit.com' ) ) {

	trigger_size = [ 30, 150, 16, 5 ];

	// Copied from MSPAbooru: 
	// Dark mode: fix background / options menu, lighten text. 
	// Does not fix options menu. Huh. 
	html += '<style> .dark span, .dark div, #click_away_div { background: unset; color: #ddd; } </style>'; 

	gather_items = () => [ { 
		page: window.location.href, 		// Maybe the submission? 
		image: Array.from( document.querySelectorAll( 'figure a' ) )
			.map( (v,i,a) => v.href )
	} ]

}

if( domain( 'kemono.su' ) || domain( 'kemono.party' ) || domain( 'coomer.su' ) || domain( 'coomer.party' ) ) {
	previous_and_next( 'a[title*="Previous"]', 'a[title*="Next"]' );

	// https://kemono.party/patreon/user/6906148
	gather_items = () => Array.from( document.querySelectorAll( 'article.post-card' ) ).map( v => 
		new Object( { 
			page: v.querySelector( 'a' ),
			thumb: ( x = v.querySelector( 'img[src]' ) ) ? x.src : '',  
			title: v.dataset.id
		} )
	) 

	// https://kemono.party/patreon/user/6906148/post/58868317 - has videos. 
	// https://kemono.party/patreon/user/6906148/post/58263244 - image, but no links. 
	image_from_dom = ( doc ) => Array.from( new Set( 		// De-duplication
		Array.from( doc.querySelectorAll( 'a.fileThumb[href], a.post__attachment-link[href]' ) ) 
			.map( a => a.href ) 
	) ); 
	// Video is screwy, but I think that's server-side. 
	
	if( !!window.location.href.match( '/post/' ) ) { 		// Even single-image pages benefit. 
		trigger_size = [ 100, 65, 16, 5 ]; 		// Left, top, font-size, padding.
		gather_items = () => [ {
			page: window.location.href, 
			image: window.location.href,
			title: document.querySelector( '.post__title span' )?.innerText
		} ];
	}
}

if( domain( 'desuarchive.org' ) ) { 		// Copying InkBunny because it's mostly about "this thread I'm looking at." 
	trigger_size = [ 30, 85, 16, 5 ]; 
	previous_and_next( 'a[title="previous page"', 'a[title="next page"' ); 
	html += '<style> span { color: #ddd } </style>'; 		// Default colors are grey-on-grey. 
	if( args.mode == "pool" ) { force_top_to_bottom = true; } 
	new_image_rate = fetch_rate = 2000; 		// God dang, this site is touchy about rate-limiting. Even this doesn't quite work. 

	gather_items = () => Array.from( document.querySelectorAll( '.widget_imageFromSubmission a' ) ).map( typical_item ); 

	// An array of either one thumbnail or all thumbnails (if this submission has multiple files), mapped to convert to full-size. 
	image_from_dom = ( doc ) => Array.from( doc.querySelectorAll( 'a:has(img)' ) ).map( img => img.href ); 

	// Multi-image submission? Fetch this page like we got it from a thumbnail. 
	//if( !!window.location.href.match( '/s/' ) ) { gather_items = false; } 		// Ignore submissions by default.  
	if( window.location.href.match( 'thread' ) ) { 		// Single page. 
		//trigger_size = [ 30, 85, 16, 5 ];  
		gather_items = () => [ {
			page: window.location.href, 
			image: window.location.href,
			title: window.location.href.split('thread').pop(), 
		} ];
	}
}

if( domain( 'knowyourmeme.com' ) ) {
	// https://knowyourmeme.com/memes/detectives-solving-the-kira-case/photos/page/2 
	trigger_size = [ 15, 50, 16, 5 ]; 		// Left, top, font-size, padding. 

//	let current = document.querySelector( '#paginator b, .pagination b, .paginator b' ) 
//	previous_page = current.previousElementSibling; 
//	next_page = current.nextElementSibling; 

	// https://i.kym-cdn.com/photos/images/masonry/002/684/961/1af
	// https://i.kym-cdn.com/photos/images/original/002/684/961/1af
	gather_items = () => Array.from( document.querySelectorAll( 'a.cboxElement' ) )
		.map( v => typical_item( v, t => t.replace( '/masonry', '/original' ) ) ); 
}

if( domain( 'imgbox.com' ) ) { 
	// https://imgbox.com/g/gfL0k5KGX3
	// No idea if galleries can have pages. 
	formats = []; 
	force_top_to_bottom = true; 

	// https://thumbs2.imgbox.com/67/23/WaA7KnCp_b.jpg
	// https://images2.imgbox.com/67/23/WaA7KnCp_o.jpg
	gather_items = () => Array.from( document.querySelectorAll( '#gallery-view-content a' ) )
		.map( v => typical_item( v, t => t.replace( '\/\/thumbs', '\/\/images' ).replace( '_b.', '_o.' ) ) ); 
} 

if( domain( 'whitekitten.art' ) ) {
	trigger_size = [ 15, 35, 16, 5 ];

	previous_and_next( 'a.prev', 'a.next' ); 
		// There is no sensible reason this does not work. 

	// https://whitekitten.art/posts/query=Underrock
	gather_items = () => Array.from( document.querySelectorAll( 'li[data-post-id]' ) ) 
		.map( v => typical_item( v, t => t.replace( 'generated-thumbnails', 'posts' ) ) ); 
}

if( domain( 'piczel.tv' ) ) {
//	trigger_size = [ 15, 70, 16, 10 ]; 

	previous_and_next( 'a[rel="prev"]', 'a[rel="next"]' ); 
		// Yeah previous_and_next seems to be fucked for some reason. 
		// Still works on e.g. AllTheFallen.moe, so IDKWTF. 
	//	previous_and_next( 'a.paginator-prev', 'a.paginator-next' ); 		// ATF syntax looks the same. 
//	previous_page = "/fuck"; 		// Setting the variable does work. 

	// https://piczel.tv/gallery/CurrentlyTr_Ash/3976
	// https://piczel.tv/static/uploads/gallery_image/62210/image/36451/thumb_1610930693-temporarily_ash.png
	// https://piczel.tv/static/uploads/gallery_image/62210/image/36451/1610930693-temporarily_ash.png
	gather_items = () => Array.from( document.querySelectorAll( 'a:has(div[style])' ) ) 
		.map( v => typical_item( v, t => t.replace( 'generated-thumbnails', 'posts' ) ) ); 

	gather_items = () => Array.from( document.querySelectorAll( 'a:has(div[style])' ) ) 
		.map( v => new Object( { 
			page:	v.href,
			title: 	v.href.split('/').pop(), 
			// style='background-image: url("https://piczel.tv/static/uploads/gallery_image/62210/image/36451/thumb_1610930693-temporarily_ash.png");'
			thumb: 	v.querySelector( 'div' ).style.backgroundImage.split('"')[1],
			image: 	v.querySelector( 'div' ).style.backgroundImage.split('"')[1].replace( 'thumb_', '' )
			// .style isn't a string, despite being defined as a string, 
				// but using the DOM still returns 'url("https://whatever")' instead of the damn URL. 
		} ) )
}

if( domain( 'nhentai.net' ) ) {
	trigger_size = [ 15, 60, 16, 5 ];
	
	// formats have to include webp. E.g. https://nhentai.net/g/555586/ 
//	formats.push( 'webp' ); 		// Might want this, in general, after GIF. 
	video_formats = []; 
	
	force_top_to_bottom = true; 
	
	// https://nhentai.net/g/123866/
	// https://i2.nhentai.net/galleries/772164/2.jpg
	// https://t1.nhentai.net/galleries/772164/2t.jpg
	// I could probably generate from a single thumbnail, like Pixiv. But I'd need an upper bound. 
	// Ech, grab from <noscript> block to avoid data-blob nonsense. 
//	gather_items = () => Array.from( document.querySelectorAll( '.gallerythumb' ) ) 
//		.map( v => typical_item( v, t => { console.log( t ); return t.replace( '\/\/t', '\/\/i' ).replace( 't\%', '\%' ) } ) )
//		.map( v => { v.download_name = v.page.split('/')[4]; return v } ); 
	// Oh just generate the URLs. 

	gather_items = () => { 
		let thumbs = document.querySelectorAll( '.gallerythumb img' ); 
		
		let base = thumbs[0].dataset.src.replace( '\/\/t', '\/\/i' ).split('/'); 
		let id = base[4]; 
		base.pop(); 
		base = base.join('/'); 
		
		return new Array( new Object( { page: window.location.href, title: id, thumb: thumbs[0].dataset.src, 
			image: new Array(thumbs.length).fill(0).map( (v,i,a) => base + '/' + i + '%format' ), 
			download_name: id
		} ) )
	} 
	
	// What is up with the single thumbnail placement? Image count is also centered-ish. 
	// It was also wonky for initial thumb-per-page approach, just less visible. 
}

if( domain( 'co.llection.pics' ) ) { 

	trigger_size = [ 20, 25, 25, 10 ]; 

	formats = []; 		// Anything works. 
	video_formats = []; 		// Site has one (1) video. 
	
	//previous_and_next( 'a[rel="prev"]', 'a[rel="next"]' );
	// Tempted to extend querySelector to include innertText, if that's even possible. 
	previous_page = Array.from(document.querySelectorAll('#paginator a')).filter( v => v?.innerText.match('Prev') )[0]; 
	next_page = Array.from(document.querySelectorAll('#paginator a')).filter( v => v?.innerText.match('Next') )[0];  
	
	// https://co.llection.pics/post/view/133364#search=artist%3Adbaru
	// https://co.llection.pics/_thumbs/d1cea195ed697351c1453d29aeec8e3b/thumb.webp
	// https://co.llection.pics/_images/d1cea195ed697351c1453d29aeec8e3b/133364%20-%20artist%3Adbaru%20artist%3Agearfae%20caturday%20nicole_watterson%20the_amazing_world_of_gumball.png
	// Some of these get too long to save properly: 
	// https://co.llection.pics/_images/313856ee87971ae7c3f815a5ee034977/94560%20-%20adrien_agreste%20artist:dbaru%20avatar:_the_last_airbender%20bon_bon%20chat_noir%20crossdressing%20crossovers%20desna%20guy_hamdon%20korra%20little_nemo:_adventures_in_slumberland%20marco_diaz%20miraculous_ladybug%20parody%20shezow%20star_vs._the_forces_of_evil%20the_legend_of_korra.jpg
	gather_items = () => Array.from( document.querySelectorAll( '.shm-thumb-link' ) )
		.map( v => typical_item( v, t => 
			t.replace( '_thumbs', '_images' )
			.replace( 'thumb.webp', '' + v.firstChild?.id.replace( 'thumb_', '' ) + " - " + v.firstChild?.title.split(' //')[0].slice(0,200) + '.jpg' ) 
		) ); 
} 

if( domain( 'seaart.ai' ) ) { 
	// https://www.seaart.ai/user/haoyu - which is just the front page, if you're not logged in. Huh. 
	// This site is also infinite-scrolling, so good luck. 
	// Suggested images beneath an image page do not work. No idea why. 
	// https://www.seaart.ai/explore/detail/chsmf5p4msb0pr4td9m0 
	// Triggering it manually: "options is undefined." How. 
	formats = []; 
	
	// https://image.cdn2.seaart.ai/2023-06-02/30013995241541/899934812eb169f2cb4f27d0e80b574b4d917f0d_low.webp
	// https://image.cdn2.seaart.ai/2023-06-02/30013995241541/899934812eb169f2cb4f27d0e80b574b4d917f0d_high.webp
	gather_items = () => Array.from( document.querySelectorAll( '.Acnt, .waterfall-item' ) )
		.map( v => typical_item( v, t => t.replace( '_low.', '_high.' ) ) ); 
} 

if( domain( '8muses.com' ) ) {
	// https://comics.8muses.com/comics/album/MCC-Comics/Trigger-Warning/Issue-1
	formats = [];
	force_top_to_bottom = true;
    trigger_size = [ 200, 50, 20, 10 ];

	// https://comics.8muses.com/image/th/ptsnT+3gwFf1dFkFBkMwuSF4Zjlyyhepok7EbbdIcJ+2CR-bTNQoEv2vYkGesY2OhspFLPRgfWlS68E8CNqkoTRwWyzmrPP0vv9WQZFSQm4.jpg
	// https://comics.8muses.com/image/fl/ptsnT+3gwFf1dFkFBkMwuSF4Zjlyyhepok7EbbdIcJ+2CR-bTNQoEv2vYkGesY2OhspFLPRgfWlS68E8CNqkoTRwWyzmrPP0vv9WQZFSQm4.jpg
	gather_items = () => Array.from( document.querySelectorAll( 'div.gallery a.c-tile[href*="/"]:not(:has(div[itemType]))') )
		.map( v => typical_item( v, t => t.replace( '\/th\/', '\/fl\/' ) ) );
}

/*
// Scrolling is broken, somehow. 
if( domain( 'civitai.com' ) ) { 
	// https://civitai.com/search/images?sortBy=images_v5
	// CSS is fucked up somehow. Scrolling doesn't work. 
	// You can press D to go to the next image... once. 
	// Oh, or press S to go the first submission. And then S and D work as if you're still at the top of the page. 
	// Removal keys C/E don't work because you're "still at the top of the page." 
	// But the onscreen buttons work. 
	// The options menu stays fixed in the corner of the screen. It's not supposed to scroll with you. 
	trigger_size = [ 15, 50, 16, 5 ]; 		// TBD 
	
	formats = []; 
	
	// https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2ddd9312-b080-4c70-b8ae-72a3d6bfd400/width=450/magical_princess.jpeg
	// https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2ddd9312-b080-4c70-b8ae-72a3d6bfd400/original=true/magical_princess.jpeg
	gather_items = () => Array.from( document.querySelectorAll( '.mantine-Stack-root a') )
		.map( v => typical_item( v, t => t.replace( /\/width=.*\//, '/original=true/' ) ) ); 
} 
*/

/*
// This is what SankakuComplex.com support would look like, if they weren't aggressively paranoid. 
if( domain( 'sankakucomplex.com' ) ) { 
	// https://chan.sankakucomplex.com/post/show/24323555 
	// https://s.sankakucomplex.com/data/preview/9f/51/9f51989230ff29aaea6bbc948e5448bf.jpg?e=1659818685&m=CJzSqqxc8sYLxD0hNN9QfA
	// https://s.sankakucomplex.com/data/9f/51/9f51989230ff29aaea6bbc948e5448bf.jpg?e=1659819460&m=caOetGyG0MSL_zo9cXyV6A
	new_image_rate = fetch_rate = 1000; 		// No value is high enough. The site does not cooperate. 

	gather_items = () => Array.from( document.querySelectorAll( 'span.thumb a[href]' ) )
		.map( typical_item ); 

	image_from_dom = ( doc ) => doc.querySelector( '#highres' ).href; 
} 
*/



	// ----- //			Controls to invoke script



GM_registerMenuCommand( "Swallow entire gallery", show_images ); 		// TamperMonkey still uses this! Good. 

// Put button on page, since there's no menu in "modern" Userscript plugins.
var add_button = setInterval( function() { 
		if( button_delay_function() ) { 		// Periodically check if this page has what we're looking for. 
			clearInterval( add_button ); 
			document.body.addElement( 'button', { innerText: "Swallow gallery", 
				onclick: async function() { 
					this.onclick = null; 		// Idempotent. 
					this.innerText='Swallowing...'; 
					await initialize_options(); 		// Reload defaults as late as possible. 
					show_images(); 
				}, 
				style: "position: absolute; color:#194d19 !important; background-color:#dbd7d8; border-radius: 20px; text-align: center; z-index: 101; "
					+ "display: inline-block; border:1px solid #19ab19; cursor:pointer; line-height: 20px; font-family:Arial; text-decoration:none; "
					+ "left: " + trigger_size[0] + "px; top: " + trigger_size[1] + "px; font-size:" + trigger_size[2] + "px; padding: " + trigger_size[3] + "px " + trigger_size[3] + "px;"
			} )
		} 
	}, 100 ); 		// Passive - no interaction concerns. 

// End of main execution. 





// ------------------------------------ Persistent options menu ------------------------------------ //





// Plugin-agnostic save / load functions. 
var [ set_options, get_options ] = [ ( key, value ) => localStorage.setItem( key, value ), ( key ) => localStorage.getItem( key) ]; 		// Per-site. 
if( window.GM ) { [ set_options, get_options ] = [ GM.setValue, GM.getValue ]; } 		// Global. 

//var options; 
var default_options = new Object( { 
	defaults: [], 									// Dummy value, used as a label. 
	image_size: "short", 					// Choices: short, fit_width, fit_height, fit_window, full. 
	older_submissions_first: true, 	// Default order. False: as seen on the page. True: reversed, which is usually chronological. 
	dark_mode: false, 						// Initialize into dark mode. 

	user_interface: [],
	keyboard_controls: true, 			// Nearly the whole left half of the keyboard. WASD / QERX / F / Ctrl+Z. 
	translucent_buttons: false, 		// See-through buttons. 
	disable_buttons: false,
	bookend_gradients: true, 		// Visual hinting for first and last pages on multi-image submissions. 

	video_options: [], 
	video_support: true, 					// Include video formats alongside images. 
	videos_muted: true, 
	videos_autoplay: true, 				// Automatically start videos as they come onscreen. 
} )

async function initialize_options() { 		// This is called by the Swallow Gallery button and the menu button. 
	options = await get_options( 'eza_options' ); 		// GM.getValue is a Promise. 
	options = options ? JSON.parse( options ) : JSON.parse( JSON.stringify( default_options ) ); 		// Defaults if nothing comes back. 
	for( let key in default_options ) { if( options[ key ] == null ) { options[ key ] = default_options[ key ]; } } 		// Fill in any gaps - prevent script errors. 
} 

async function save_options() { 
	let menu = document.getElementById( 'options_dialog' )
	if( menu ) { 
		Array.from( menu.querySelectorAll( '.option_input' ) ).map( v => { 
			options[ v.id ] = ( v.type == 'checkbox' ) ? v.checked : v.value; 
		} )
	} 
	set_options( 'eza_options', JSON.stringify( options ) ); 
} 

// Generate a menu from the options object. 
async function show_menu() {
	await initialize_options(); 		// Prevent mismatches between windows / tabs. (Possibly a bad idea.) 
	let dialog = document.getElementById( 'options_dialog' )
	if( dialog ) { 		// Toggle off. 
		close_menu(); 
	} else { 		// Toggle on, build from scratch. 
		let menu = document.querySelector( '#spinners_id' ).addElement( 'div', { id: 'options_dialog' } ) 
		for( let key in options ) { 
			let menu_item = menu.addElement( 'div' )
			let label = menu_item.addElement( 'span', { className: 'option_label', innerText: variable_to_name( key ) } )
			if( typeof( options[ key ] ) == 'object' ) { label.style.fontWeight = 'bold' } 		// E.g. options.video_options=[] -> **Video options** 
			// Inputs for each option: 
			if( typeof( options[ key ] ) == 'boolean' ) { menu_item.addElement( 'input', { type: 'checkbox', className: 'option_input', checked: options[ key ], id: key } ) } 
			if( key == "image_size" ) { 
				let select = menu_item.addElement( 'select', { id: 'image_size', className: 'option_input' } ) 
				for( let symbol in image_size_symbols ) { 
					select.addElement( 'option', { value: symbol, innerText: variable_to_name( symbol ), selected: symbol == options.image_size } )
				} 
			} 
		} 
		menu.addElement( 'button', { innerText: 'Reset', 
			onclick: async function() { 
				await close_menu(); 		// In this order! 
				options = await JSON.parse( JSON.stringify( default_options ) ); 
				save_options(); 
			}
		} ) 

		// Also create an invisible barrier that closes the menu when you click anywhere else. 
		document.body.addElement( 'div', { onclick: close_menu, 
			 id: 'click_away_div', style: 'position: fixed; width: 100vw; height: 100vh; top: 0px; left: 0px; z-index: 11;' } )

		enforce_style( document.getElementById( 'spinners_id' ) ); 
	} 
}

// Closing the menu automatically saves current options. 
async function close_menu() { 
	await save_options(); 
	document.getElementById( 'options_dialog' ).remove(); 
	document.getElementById( 'click_away_div' ).remove(); 
	enforce_style(); 		// Necessary for translucent buttons on e.g. Baraag. 
} 





// ------------------------------------ Gallery Swallower ------------------------------------ //





function show_images() { 



	// ----- //			Replace page, set up furniture 



	// Grab links and/or thumbnails using per-site code:
	items = gather_items(); 		// Array of objects, listing page link, thumbnail, presumed fullsize image, etc. 
	if( options.older_submissions_first && ! force_top_to_bottom ) { items.reverse(); } 

	console.log( items ); 		// Debug. Be honest, this is staying here. 
//	items = []; 		// Debug aid for checking previous page / next page. 

	// Erase existing page, use ours instead.
	document.body.innerHTML = html; 
	// May want to erase <body> properties as well. 
	
	// Apply CSS whether CSP likes it or not. 
	//GM.addStyle( style_rules ); 		// Whoops, it's an associative array. 
	//let css_text = ""; 
	//for( let selector in style_rules ) { css_text += "" + selector + " { " + style_rules[ selector ] + " } "; } 
	GM.addStyle( css_text ); 

	// Fetch pages less often than we'd add inline images, to avoid 503 errors. 
	if( image_from_dom ) { new_image_rate = fetch_rate; } 

	// Controls - e.g. image size and order. 
	let controls_id = document.getElementById( 'controls_id' ); 
	controls_id.addElement( 'span', { innerText: 'Size: ' } ); 
	for( let label in image_size_symbols ) {
		controls_id.addElement( 'button', { innerText: image_size_symbols[ label ], className: "control_button eza_button", id: label, 
			title: variable_to_name( label ), 
			onclick: function () { 
				document.getElementById( 'centered_id' ).className = controls_id.className = this.id;
				enforce_style();
			}
		} );
		controls_id.appendChild( document.createTextNode( " " ) ); 		// Asinine way to force spacing. ::after wouldn't obey enforce_style. 
	} 
	document.getElementById( options.image_size ).click(); 		// DRY for highlighting the active size. 

	controls_id.addElement( 'span', { innerText: ' Order: ' } ); 
	controls_id.addElement( 'button', { className: "control_button eza_button", title: "Reverse order", innerText: '⇅',
		onclick: function() { 
			document.querySelectorAll( '.reversible' )
				.forEach( node => node.parentElement.insertBefore( node, node.parentElement.firstChild ) )
		} } ); 

	// Options menu. 
	document.querySelector( '#spinners_id' ).addElement( 'button', { id: 'options_button', innerText: '≡', 
		className: 'control_button eza_button', title: 'Gallery Swallower options', 		// "Options for Eza's Gallery Swallower?" 
		onclick: show_menu
	} )
	
	// Dark mode button.
	let dark_button = document.getElementById( 'dark_mode_id' ).addElement( 'button', { id: 'dark_mode_button', innerText: '✺',
		className: 'control_button eza_button', title: 'Dark mode',
		onclick: function() { 
			document.getElementById( 'backdrop_id' ).classList.toggle( 'dark_mode' );
			// Not document.body because that gets clobbered by the menu and stored settings. 
			// The button could change the options object. But simplifying code is not worth changing established behavior. 
			enforce_style(); 
		} 
	} )
	if( options.dark_mode ) { dark_button.click(); } 		// On-by-default setting. 

	// Navigation links, at the bottom. "Previous" or "Previous - Next" or "Next".
	let links_id = document.getElementById( 'links_id' ); 
	links_id.innerHTML += previous_page ? "<a href='" + previous_page + "'>Previous page</a>" : ""; 
	links_id.innerHTML += previous_page && next_page ? " - " : ""; 
	links_id.innerHTML += next_page ? "<a href='" + next_page + "'>Next page</a>" : ""; 

	// Global undo button, pinned to the corner.
	let global_undo = document.body.addElement( 'button', { title: 'Undo', innerText: '⟲', 	
		className: 'reloader undo eza_button', id: 'global_undo_id', 
		onclick: function() { 
			if( ! undo_list[0] ) { return; } 	
			let element = undo_list.pop(); 
			element.replacement.replaceWith( element.original ); 
			element.replacement.remove(); 		// Hopefully this frees the memory. 
			element.original.scrollIntoView(); 
			element.original.closest( '.basket' )?.classList.add( 'ready' ); 		// Resume loading. 
			// console.log( element.original ); 
			document.getElementById( element.original.closest( '.basket' ).id + 'thumb_image' ).classList.remove( 'cleared_submission' ); 
		} } ); 

	// Start spinners. @keyframes won't work on e.g. Baraag. Transition requires an initial state, hence this delayed start. 
	document.querySelector( '#spinners_id' ).className = 'spinning'; 



	// ----- //			Per-submission links and controls 



	// Give each item its own set of spans, with basic onClick controls to remove images or reload a submission.
	// Very few of these need to be variables now, but 'let purpose =' adds clarity. It's no less efficient than before. 
	for( let item_key = 0; item_key < items.length; item_key++ ) { 
		let item = items[ item_key ]; 

		let container = document.getElementById( 'centered_id' ).addElement( 'div',
			{ id: item_key + 'container', className: "submission reversible" } )

		// ← ⟳ 12345 ✕ →
		let nav_previous = container.addElement( 'button', { title: 'Previous submission', className: 'nav_button previous eza_button', innerText: '←', 
			onclick: function() { this.previousQuery( '.submission' ).scrollIntoView(); } } );
		let first_spacer = container.addElement( 'button', { className: 'button_spacer eza_button' } ); 
		let reloader = container.addElement( 'button', { title: 'Reload submission', className: 'reloader eza_button', innerText: '⟳', 
			onclick: function() { 
				if( image_from_dom ) { item.image = null; } 
				let pair = undoable_replace( this.closest( '.submission' ).querySelector( '.basket' ), 
					document.body.addElement( 'span', { id: item_key, className: 'ready basket unmodified' } ) ); 
				if( pair.original.classList.contains( 'unmodified' ) ) { undo_list.pop(); } 
				pair.replacement.addElement( 'span', { className: 'sub_basket' } ); 
				document.getElementById( item_key + 'thumb_image').classList.remove( 'cleared_submission' ); 
			} } );
		let link = container.addElement( 'a', { href: item.page + '#dnr#&dnr', 
			innerText: ' ' + item.title + ' ', target: '_blank', style: 'font-size:33px' } ); 		// Only "code smell" says this should go in CSS.
		let submission_remover = container.addElement( 'button', { title: 'Remove submission', className: 'remover top eza_button', innerText: '✕', 
			onclick: function(){ 
				document.getElementById( item_key + 'thumb_image').classList.add( 'cleared_submission' ); 
				this.closest( '.submission' ).querySelector( '.basket' ).classList.remove( 'ready' ); 		// Skip it. 
				undoable_replace( this.closest( '.submission' ).querySelector( '.sub_basket' ), document.createElement( 'span' ) );
			} } );
		let second_spacer = container.addElement( 'button', { className: 'button_spacer eza_button' } ); 
		let nav_next = container.addElement( 'button', { title: 'Next submission', className: 'nav_button next eza_button', innerText: '→', 
			onclick: function() { this.nextQuery( '.submission' ).scrollIntoView(); } } ); 
		container.addElement( 'br' ); 

		// Image(s) and the ✕ below each group. 
		let basket = container.addElement( 'span', { id: item_key, className: 'basket unmodified' } ); 		// Hold off on ready-ing. 
		let bottom_submission_remover = container.addElement( 'button', { innerText: '✕',
			title: 'Remove the above submission', className: 'remover bottom eza_button',
			onclick: function() {
				let sub = this.closest( '.submission' ); 
				sub.querySelector( '.remover.top' ).click(); 		// Click top X for identical behavior. 
				sub.scrollIntoView(); 		// Scroll back up, since vertical content disappeared. 
			} } );

		// Thumbails at the top. Fixed-size grid box, overflow hidden. Crops tall images.
		if( item.thumb ) { 		// Optional now, mostly because fuck e-Hentai.org. 
			let thumb_box = document.getElementById( 'thumbnails_id' ).addElement( 'span', { className: 'reversible' } ); 
			let thumbnail_image = thumb_box.addElement( 'img', { src: item.thumb, className: 'overlap', 
				id: item_key + 'thumb_image' 
			} ); 
			let thumbnail_clicker = thumb_box.addElement( 'span', { className: 'overlap', 	// May swap this with img (and duplicate onclick) so right-click shows "save image." 
				onclick: function() { document.getElementById( item_key + 'container' ).scrollIntoView(); } 
			} ); 
			let thumbnail_clear = thumb_box.addElement( 'button', { className: 'eza_button control_button overlap', 		// control_button or not? 
				title: 'Remove submission', innerText: '✕',
				onclick: function() { 
					document.getElementById( item_key + 'container' ).querySelector( '.remover.top' ).click(); 
				} 
			} ); 
		} 

		reloader.click(); 		// DRY
	} 



	// ----- //			Keyboard controls



	// I should probably still addEventListener for scrolling and highlight the current image somehow. Control opacity? Image border? 
	// The real issue is that current_image and current_submission don't have to line up. 
	document.addEventListener( "keydown", key_handler, false );
	function onscreen( element ) { return element.getBoundingClientRect().top + element.scrollHeight > 100 } 		// DRY
	function key_handler( event ) { 
		if ( options.videos_autoplay ) { 		// Autoplay kludge: start/stop all videos 'on key press' to subvert browser settings. 
			let videos = Array.from( document.querySelectorAll( 'video:not(.autoplayed)' ) ).forEach( v => {
				v.play(); 
				v.pause(); 
				v.classList.add( 'autoplayed' ); 
			} )
		} 

		if( ! options.keyboard_controls ) { return; }

		// Find "current" elements: which image & submission are at or near the top of the screen? 
		let current_image = Array.from( document.querySelectorAll( '.image_container' ) ).find( onscreen );
		let current_submission = Array.from( document.querySelectorAll( '.submission' ) ).find( onscreen );
		let current_video = current_image.querySelector( 'video' );

		if( event.key == 'z' ) { document.getElementById( 'global_undo_id' ).click(); } 		// Z and Ctrl+Z both work. 
		if( event.ctrlKey ) { return; } 		// Ctrl + anything else? Do nothing. 

		switch( event.key ) { 		// Case sensitive, apparently. 
			case 'a': current_image.querySelector( '.nav_previous_image' ).click(); break; 
			case 'd': current_image.querySelector( '.nav_next_image' ).click(); break; 
			case 'q': current_image.querySelector( '.remover.floating' ).click(); break; 
			case 'e': current_image.querySelector( '.remover.nav_button' ).click(); break; 
			
			// case 'g': current_image.querySelector( 'a' ).click(); break; 		// Pop-up blocked. Are you fucking kidding me. 
			case 'g': GM.openInTab( current_image.querySelector( 'a' ).href, { setParent: true } ); break; 		// Fails in Pixiv. FFS. 
			// GM.openInTab technically works, but Pixiv hands out 403s if you look at it funny. 
			// Maybe fuck with selection? I.e., force focus on image, so pressing Enter opens it.
			case 'h': GM.openInTab( current_submission.querySelector( 'a' ).href, { setParent: true } ); break;  

			case 'w': current_submission.querySelector( '.previous' ).click(); break; 
			case 's': current_submission.querySelector( '.next' ).click(); break; 
			case 'r': current_submission.querySelector( '.reloader' ).click(); break; 
			case 'x': current_submission.querySelector( '.remover.bottom' ).click(); break; 

			case 'c': 		// Remove submission and advance - repeatability beats mashing X/S. 
				current_submission.querySelector( '.remover.bottom' ).click(); 
				current_submission.querySelector( '.next' ).click(); 
			break; 

			case 'f': if( current_video ) { current_video.paused ? current_video.play() : current_video.pause(); } break; 
		} 
		// I should consume this event. Especially 'g' on Baraag, which redirects and fucks up scrolling. 
		// Match /^[zadqeghwsrxc]$/ or whatever. 
//		event.stopPropagation(); 		// Doesn't work. FFS. 
		// We may not be the script that has priority. Somehow. 
		// 'Hey maybe I can just delete it when handling Baraag.net,' 332 results for addEventListener. FFS. 
		// ... the g key doesn't even do anything, before activating this script. What the hell. 
	}

	// Anchor at the top so hitting 'next' on a freshly-loaded page goes to the first image instead of the second. 
	let top_anchor = document.getElementById( 'spinners_id' ).addElement( 'span', { className: 'image_container submission' } ); 
	let first_image = top_anchor.addElement( 'button', { className: 'nav_next_image remover nav_button',
		onclick: function() { this.nextQuery( '.image_container' ).scrollIntoView(); } } ); 
	let first_submission = top_anchor.addElement( 'button', { className: 'next',
		onclick: function() { this.nextQuery( '.submission' ).scrollIntoView(); } } ); 

	// Anchor at the bottom so you can navigate past the last image. 
	let bottom_anchor = document.getElementById( 'backdrop_id' ).addElement( 'span', { className: 'image_container submission bottom' } );
	let final_image = bottom_anchor.addElement( 'button', { className: 'nav_previous_image',
		onclick: function() { this.previousQuery( '.image_container' ).scrollIntoView(); } } ); 
	let final_submission = bottom_anchor.addElement( 'button', { className: 'previous',
		onclick: function() { this.previousQuery( '.submission' ).scrollIntoView(); } } ); 

	enforce_style(); 		// Applies CSS per-element, if it needs to. 



	// ----- // 			Autoplaying videos



	document.addEventListener( "scroll", function( event ) {
		// Videos autoplay as they come onscreen, and autopause as they go offscreen. 
		// If manually paused - they will not autoplay, until manually played again. 
		Array.from( document.getElementsByTagName( 'video' ) ).forEach( video => { 
			if( ! options.videos_autoplay ) { return; } 

			let bounds = video.getBoundingClientRect(); 
			if( bounds.bottom < 0 || bounds.top > document.documentElement.clientHeight ) { 
				if( ! video.paused ) { video.classList.add( 'automatically_paused' ); } 
				video.pause(); 
			} 
			else if( video.classList.contains( 'automatically_paused' ) ) { 
				video.classList.remove( 'automatically_paused' ) 
				video.muted = options.videos_muted; 
				video.play(); 
			} 
		} )
	} , false );



	// ----- //			Ongoing interaction and loading 



	// Load more images in "ready" submissions, when available. 
	var interval_object = setInterval( function() { 

		// Upper limit for simultaneous loading images? (Should treat 0 as 'no limit,' so var && length > var.) 
		if( document.getElementsByClassName( 'loading' ).length >= loading_limit ) { return; } 
			// Yeah, this should be a per-site variable. Default is 10. 
			// Should probably be exposed in the options. 

		// Add an image to the ready basket, increment page number, conditionally ready-up for another image. 
		let ready_element = document.querySelector( '.ready' )
		if( ! ready_element ) { return; } 
		ready_element.classList.remove( 'ready' ); 

		let item = items[ ready_element.id | 0 ]; 		// This should maybe be data-id or something. 

		// If we need to fetch, we don't have an image to display yet. 
		if( ! item.image ) { return standard_fetch( item, ready_element ); } 		// Exit interval. 

		// All per-image divs go in one per-submission span, so whole-submission X prevents new images from loading.
		let outer_span = ready_element.querySelector( '.sub_basket' ); 		// Per-submission span. 

		// Prepare image filename once. 
		let manga_page = ( outer_span.dataset.image_number || 0 ) | 0; 		// Not web-page... comic-page. (No initial value required.) 
		outer_span.dataset.image_number = 1 + manga_page; 		// Has to go after fetch stuff, or we skip the first page. 
		if( typeof( item.image ) == "string" ) { item.image = [ item.image ]; } 		// Believe it or not, this is cleaner.
		let image_url = item.image[ manga_page ]; 		// '' to avoid null.replace() TypeErrors.  
		if( ! image_url ) { return; } 		// Exit early if we've run out of images. 
		
		let container = outer_span.addElement( 'div', { style: 'position: relative;', className: 'image_container' } ); 		// Per-image div. 

		// Place stuff in the container. 
		let previous_image = container.addElement( 'button', { title: 'Previous image', innerText: '←', 
			className: 'nav_button nav_float nav_previous_image eza_button', 
			onclick: function() { this.previousQuery( '.image_container' ).scrollIntoView(); } 
		} ); 
		let next_image = container.addElement( 'button', { title: 'Next image', innerText: '→', 
			className: 'nav_button nav_float nav_next_image eza_button', 
			onclick: function() { this.nextQuery( '.image_container' ).scrollIntoView(); } 
		} ); 
		let remove_and_advance = container.addElement( 'button', { title: 'Remove image / Next image', innerText: '✕→', 
			className: 'remover nav_button nav_float eza_button', 
			onclick: function() {
				let next = this.nextQuery( '.image_container' ); 
				this.closest( '.image_container' ).querySelector( '.remover.floating' ).click(); 		// DRY - click other remove button. 
				next.scrollIntoView(); 

				let toaster = document.body.addElement( 'span', { innerText: '✕ Image removed' } )
				toaster.offsetWidth ? toaster.style = 'position: fixed; left: 60px; top: 0px; opacity: 0; transition: opacity 3s;' : null; 		// Reflow forces a distinct state to transition from. 
				setTimeout( () => { toaster.remove(); }, 3000 ); 
			} 
		} ); 



		// Display image. 
/*
		// Original approach: create a link / img for each format, self-removing on error. 
		for( let format of ( image_url.includes( '%format' ) ? formats : [""] ) ) { 		// One image/link per plausible filetype. (Exact URLs - one filetype.) 
// 			console.log( image_url ); 		// Debug. 
			let apng = container.addElement( 'a', { href: image_url.replace( '%format', format ), className: 'image_link', target: '_generic' } ); 
			apng.addElement( 'img', { src: image_url.replace( '%format', format ), className: 'loading', 
				onload: function() { this.classList.remove( "loading" ); },
				onerror: function() { 
					let container = this.closest( '.image_container' ); 		// If all images disappear, we'll remove the whole container. 
					this.closest( 'a' ).remove(); 		// Wrong URL: remove parent link (apng) and "this" image. 
					if( getComputedStyle( container ) && ! container.querySelector( 'img, video' ) ) { container.remove(); }		// Force reflow, avoid race condition.    
				} 
			} ); 
		}
*/
		// Tried using srcset, but it's really not built to test multiple URLs. 
		// <picture> <source> is an option, but it doesn't play nice with image-grabbing plugins. 
		// Which is a shame, because I think it'd also syncretize video files. 
		// Manually cycling through file extensions can't do worse for request spam. 
		
		// Revised approach: one link / img, self-updating href / src on error. 
		let apng = container.addElement( 'a', { className: 'image_link', target: '_generic', href: image_url.replace( '%format', formats[0] ) } ); 
		let imgset = apng.addElement( 'img', { className: 'loading', src: image_url.replace( '%format', formats[0] ),
			onload: function() { this.classList.remove( "loading" ); },
			onerror: function() { 
				let urls = Array.from( JSON.parse( this.dataset.urls ) ); 
				
				if( urls[0] ) { 		// Refactor to avoid infinite request loops. 
					this.closest( 'a' ).href = this.src = ( urls[0] ); 
					this.dataset.urls = JSON.stringify( urls.splice( 1 ) ); 
				} else { 
					let container = this.closest( '.image_container' ); 		// If all images disappear, we'll remove the whole container. 
					this.closest( 'a' ).remove(); 		// Wrong URL: remove parent link (apng) and "this" image. 
					if( getComputedStyle( container ) && ! container.querySelector( 'img, video' ) ) { container.remove(); }		// Force reflow, avoid race condition. 
				}
			}, 
		} )
		imgset.dataset.urls = JSON.stringify( ( image_url.includes( '%format' ) ? formats : [""] ).map( v => image_url.replace( '%format', v ) ) ); 
		// It is impossible to provide "data-urls" via addElement, because of the miserable camel-snake-kebab juggling between HTML and JS. 
		// Covering WebP, JFIF, et very cetera, does make the all-at-once method undesirable. 
		// Does onError bubble up? 
		
		if( item.download_name ) { apng.download = '' + item.download_name + imgset.src.split('/').pop(); } 
		// Might hone this with a regex against trailing ?id=1234 nonsense. Might not matter, though. Few sites need it. 
		
/*
		// Finally trying the <picture> thing, mostly to see if it steamrolls loading errors the way <video> does. 
		// ... immediately unsure how to handle links. I presume there's an onFinishedLoad or whatever. 
		// Also it does not appear the browser is much help when a site randomly decides you get one download at a time. 
		let ajpg = container.addElement( 'a', { className: 'image_link', target: '_generic', href: image_url.replace( '%format', formats[0] ) } ); 
		let pictureset = ajpg.addElement( 'picture', { className: '' } ); 
		//formats.map( (v,i,a) => pictureset.addElement( 'source', { srcset: image_url.replace( '%format', formats[i] ) } ) ); 
			// Why is it still JPG, JPG, JPG, JPG? 
		for( let n = 0; n < formats.length; ++n ) { pictureset.addElement( 'source', { srcset: image_url.replace( '%format', formats[n] ) + n } ); } 
			// How the fuck is that still JPG, JPG, JPG, JPG? 
			// I can append "formats" to the URL and see it's four different extensions. 
			// Is it some hideous JS by-reference nonsense, where addElement repeatedly accesses the same anonymous object? Somehow? 
			// Appending n to the URL shows 0 1 2 3, so I officially don't know what the fuck. I can't fix haunted. 
		pictureset.addElement( 'img' ); 		// Apparently mandatory. 
*/

		// Display video if possible - hidden by default, because empty videos take up space. 
		// oncanplay could go in the addElement call. 
		if( options.video_support && video_formats[0] ) { 
			// Videos: one <video>, multiple sources. Error goes on last source only. Invisible by default. (They take up a lot of space.) 
			let video = container.addElement( 'video', { controls: true, loop: true, muted: options.videos_muted, 
				className: options.videos_autoplay ? 'invisible automatically_paused' : 'invisible' } ) 
			for( let extension of ( image_url.includes( '%format' ) ? video_formats : [""] ) ) { 		// for-of video_formats, but only if we're guessing. 
				video.addElement( 'source', { src: image_url.replace( '%format', extension ) } ) 
			} 
			video.lastChild.addEventListener( 'error', function() { 
				let container = this.closest( '.image_container' );
				this.closest( 'video' ).remove(); 
				if( getComputedStyle( container ) && ! container.querySelector( 'img, video' ) ) { container.remove(); } 
			} ) 

			// If a video loads, show that instead of any image. (E.g. Gelbooru uses similar URLs for "posters.") 
			let video_trigger = video.addEventListener( 'canplay', function() { 
				if( this.classList.contains( 'invisible' ) ) { 		// Once. (canplay can trigger itself and loop.)
					this.currentTime = 0; 		// Fighting race conditions. 
					let video_link = this.parentElement.addElement( 'a', { innerText: 'Video link', className: 'invisible', 		// No good place for it yet, so hide it. 
						href: this.currentSrc, download: this.currentSrc.split( '/' ).pop() } ); 		// DownThemAll uses 'page title.webm.' WHY. 
				}
				this.classList.remove( 'invisible' ); 
				//this.style.display = 'initial'; 		// Kludge for Baraag videos. I really hate having to fake CSS. (Baraag has been broken for a while.) 
				this.closest( '.image_container' ).querySelector( 'a.image_link' ).remove(); 
			} ) 
		} 

		let remover = container.addElement( 'button', { title: 'Remove image', innerText: '✕', className: 'remover floating eza_button', 
			onclick: function() { undoable_replace( this.closest( '.image_container' ), document.createElement( 'span' ) ); } 
		} ); 
		container.addElement( 'br' ); 
		container.addElement( 'br' ); 

		// Array-of-images stuff: if item.image is an array, use it, up to the last item. 
		if( item.image.keys && item.image[ manga_page + 1 ] ) { ready_element.classList.add( "ready" ); } 	// Direct testing - no booleans. 

		enforce_style( outer_span ); 		// Just for this image.

	}, new_image_rate ); 



	// ----- // 		🍭 Spinners 🍭



	// Garish spinners that indicate "finding new images" and "files still loading." 
	var spinner_interval = setInterval( function() { 
		document.getElementById( 'submissions_spinner_id' ).style.opacity = document.getElementsByClassName( 'ready' ).length; 
		document.getElementById( 'images_spinner_id' ).style.opacity = document.getElementsByClassName( 'loading' ).length; 		// Once again: the orange one.

		let count = document.querySelectorAll( 'div.image_container' ).length; 
		document.getElementById( 'image_counter_id' ).innerText = count + ' image' + ( count != 1 ? 's' : '' ); 

		enforce_style( document.getElementById( 'spinners_id' ) ); 
	}, 1000 ); 		// Lazy interval. 

}


















































































