// ==UserScript==
// @name        Eza's Pixiv-Only Gallery Swallower
// @namespace   https://inkbunny.net/ezalias
// @description Display an entire Pixiv gallery page as high-res images. 
// @license     MIT
// @license     Public domain / no rights reserved
// @include     https://www.pixiv.net/en/users/*
// @include     https://www.pixiv.net/bookmark_new_illust.php*
// @include     https://www.pixiv.net/en/tags/*/artworks*
// @include     https://www.pixiv.net/user/*/series/*
// @exclude    *#dnr
// @noframes
// @version     1.1
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420946/Eza%27s%20Pixiv-Only%20Gallery%20Swallower.user.js
// @updateURL https://update.greasyfork.org/scripts/420946/Eza%27s%20Pixiv-Only%20Gallery%20Swallower.meta.js
// ==/UserScript==

// This version will never be updated. Please use the multi-site version on SleazyFork. 
// GreasyFork's forced separation of "adult" scripts is a huge pain in the ass.
// Any script that handles "adult" websites (which Pixiv totally isn't, somehow!) gets hidden away. 
// This version has been modified only to rename it and to remove Gelbooru references. It never worked, on Gelbooru. 

// This script is a mess. These notes are a mess. Consider yourself warned. 
// Oh, and the CSS is this way because I use a tallscreen monitor. Change img.short's max-height if that bugs you. 

/*
. direct image links from 'eza's universal scraper' are so great on sites like baraag. no lag. no endless loading. I want that to work on pixiv, which is all lag and loading, because they use lazy js for fucking everything. 
	https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/05/17/13/37/33/81630978_p0_square1200.jpg 
	https://i.pximg.net/img-original/img/2020/05/17/13/37/33/81630978_p0.png 
	. so I'd have to link manga pages normally, or detect page count... but single images are trivial. 
	. I'm thinking too small. I should be able to load an entire pixiv page at once - e.g. https://www.pixiv.net/en/users/29821306/artworks?p=2 as a manga-style page, showing all the images from all the submissions. possibly with actual manga pages as separate giant-ass links? but only past a certain threshold, like five pages. 
		. maybe with an option to exclude images? e.g. click a big red X to hide the image and disable links to that image... so downthemall won't get them. 
		. break prior functionality and use left/right arrows. I'm tired of middle-click not opening the bare image. also, make sure the bare image is correct in one go, because we're already doing horrible fetch/promise bullshit. 
		. infinite scrolling and lazy loading (some distance -ahead- of where you are) would actually be pretty useful, if the goal is to plow through a whole gallery. or just preload the next page and prefetch its images. maybe display one at a time, with left/right controls, and show a thumbnail list on the side / the bottom? classic frames. 
	. recursion is key. from gallery get pages, from pages get submissions, from submissions get images. avoid generalizing too much because that's how you get breadth-first searches of the entire website - i.e., never get page links from a page link. aaugh but we sometimes need to paginate manually - baraag only has 'show more' links. you can't just do /gallery/1, /gallery/2, etc. 
	. okay, picture pixiv fixiv with breaks that link back to each submission. div per submission, horizontal line, link to next div if manga, thumbnails if manga, image(s). left/right go to next image, not next div. can I link images to themselves but still click to advance? probably, html5 allows myriad bullshit. 
		. nice low-submssion account for testing - https://www.pixiv.net/en/users/53625793 - five submissions, one manga. 
	. 'eza's gallery swallower.' notes moved to that user.js file. 
		. unfortunate choice of name due to similarity with (dead-in-the-water) 'eza's gallery smoothener.' 
*/

// Okay, jank-ass possible fix: just show all possible images. Require a trigger. Get thumbnail URLs. Display _p0 through _p99 or whatever. Just don't show missing images. 
// https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/03/18/06/07/14/80193133_p0_square1200.jpg
// https://i.pximg.net/img-original/img/2020/03/18/06/07/14/80193133_p0.png 
// Son of a fuck: 
// https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2020/05/06/08/01/30/81340394_p0_custom1200.jpg
// https://i.pximg.net/c/288x288_80_a2/img-original/img/2019/10/31/03/01/07/77564033_p0.png 

// https://i.pximg.net/c/250x250_80_a2/img-master/img/2018/04/17/02/30/14/68269785_p0.png
// https://i.pximg.net/c/250x250_80_a2/img-master/img/2018/04/17/02/30/14/68269785_p0_square1200.jpg
// https://i.pximg.net/c/48x48/img-master/img/2019/04/18/21/51/53/74262786_p0_square1200.jpg <-- mini format 


// Goddammit I should probably handle 404s explicitly. It's completely unreliable as-is. Images show up at random based on VRAM availability and CPU speed. 
// Ironically, lazy loading might help. Retry, at least. 
// It might not even be possible to identify what error code onError caught. Jesus Christ, HTML. 
// Okay. Consider: max image count with pagination. 48 submissions x 100 pages (which might actually be a low estimate), tested by thumbnail, loaded onClick. 
// And if we're using thumbnails for testing, we can make the 100+ pages conditional on _p1 existing. Ah fuck, that's all they're good for - extensions won't match. 
// New plan looks something like this: load thumbnails with onError -> remove(), wait for page to finish, then replace all <a> elements with all three... hmm. 
// Okay, so it's more like: create spans containing <a>thumbnail</a>, for p0 through p100, but p1+ requires guessing the file extension, god dangit. 
// So it's <span id=p0 thumbnail url> <a> thumbnail url <a block> p1 thumbnail urls, with onError -> remove for all the p1s. 
	// If the span contains any version of p1 then replace it with a full-res extension-guesing block from p0 to p100 or whatever. If not, just a full-res p0. 
	// Oh, we could find an approximate maximum by checking e.g. p1, p10, and p100. Or just p10 and p100? No, then we'd need to do 10 for every submission, "just in case." 
// One really terrible solution: be linear. Keep adding images (preferably via DOM, after replacing innerHTML once) and onError, skip to next URL base. 
	// Right, extensions. It'd be more like - onError, increment the span ID, and if it reaches 3, -then- move on. 
	// Alternate linear solution: if one version of _pX loads, add _pX+1 to the span. Oh, and I can do that with onLoad. 
// Fetch still doesn't work. 
	// fetch( 'https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/05/23/10/59/10/81782474_p0_square1200.jpg', { credentials: 'include' } ).then(response => response.json()).then(data => console.log(data)); - returns an empty object, but never, ever logs anything. Without credentials there's at least a CORS error. 
	// I literally just want to see the response. It should not be possible to not get that information - 'fine' is 200, 'fuck off' is 403, and even no response is 500. 
	// Oh for fuck's sake. I just tested it in mainstream Firefox to see if it was my old browser being shitty - FF still throws a CORS error. It's i.pximg.net from pixiv.net. Aaaugh. 
	// I just want to know if a fucking image file exists! This is not an attack vector - you can do <img src onerror> and find the same damn information. Domain-agnostic. 
	// Do old-school  XMLHttpRequest()s work? I only want the head. Ugh, probably still stopped by CORS. 
	// Javascript: the language where reading a file is prohibited for safety, but executing it as a script is no-questions-asked. 
	// ... can we just run it as a script and see if it 404s? Obviously it won't work if it exists. 
// Okay, fuck everything below. Replace the HTML with just the CSS for image scaling. Then add images via the DOM. Or rather, span-link-image packages. 
	// Can I document.body.appendChild a function? Apparently not. A script, then? I want onload to call a function, without cramming the text into every image. 
	// script.innerText = "function example() { console.log( 'butts' ); }"; document.body.appendChild( script ); example(): "butts". Flawless. 
	// JSON.stringify( example )? No. Damn. Aha: function.prototype.toString. 

// Note: function.toString is a vicious whore, so comments here have to be /* like this */ and semicolons are mandatory. 
// https://i.pximg.net/img-original/img/2020/05/06/08/01/30/81340394_p-1.jpg - fucking what. 
	// Some of the links are still -1... I just... what the fuck? 
	// Also this.remove() isn't removing the links, but that's just personal oversight. 
// Welp, thought I was done, but selecting things causes fucky results, because go fuck yourself. 
	// I guess removeAttribute onload / onerror? Yeah, fixed. 
// At this point I just need to style=visibility:hidden when things scroll offscreen. Same size, and god willing, no VRAM use. 
	// Maybe an interval that does this.src=this.src for all img elements - to fight when things half-load? Can't exactly press F5. 
	// Array.from( document.getElementsByTagName( 'img' ) ).forEach( i => i.src = i.src ) - inconsistently effective. 
	// I could add ?random-number to force a reload, but that's a complete re-download, so it's inadvisable. Can I check if it failed to-- oh right, onError. 
	// But I need to know what the error is, since we're still removing 404'd img elements with bad file extensions. 
// https://developer.mozilla.org/en-US/docs/Web/API/Window/location
	// Scroll-into-view is showNode(). Fakey bookmarks. 
	// And I should probably move or copy the thumbnails into a top bit, like Pixiv Fixiv. 
	// Also, like Pixiv Fixiv, I should probably have the ability to repopulate existing sub-spans with images, both for "augh all PNGs slow loading" and "ah fuck loading broke." 
// What I have so far could easily replace Pixiv Fixiv's current code. The spans with this.parentElement.remove() stuff, anyway; we know the image count beforehand. 
	// For both, I'd like to stretch a thumbnail behind an image as it's loading. I'd need non-square thumbs. Or at least I'd really prefer them. 
	// I guess style=backgroundWhatever:that.src? I keep adding and removing this -> that for some damn reason. 
// Double newline between submissions could be removed if I instead put the <br> inside each <a> block. 
// Add an interval that waits for thumbnails to appear and then adds a floating button to invoke this function. Tampermonkey doesn't have a goddamn menu. 
/*		jpg.setAttribute( "onclick", "console.log( 'alright' )" );  */ 		// Nope, too easy. Alas. 
	// In the meantime do target=_new or however that works. (target='_blank'.) 
// Ah: wasn't supposed to be a string. object.onerror = function(){myScript};. 
// Could use some indication of whether things are still loading. A spinner that disappears when all the thumbnails disappear. 
	// setInterval, getElementsByClass(Name?), every 5000ms or whatever. 
	// document.getElementsByClassName( "thumb" ) - I guess I don't remove these. Maybe change class from "test"? 
// Change the BG color to something dark. 
// Testing whether loading shenanigans work: just make images visible on mouseover. 

//	console.log( images ); 
// This array is filled with the right things. There are simply no spans on the goddamn page. 
// Commenting out all the createElement / appendChild stuff results in the spans being present but obviously empty. 
// Once again, SOMETHING in the goddamn png block is sufficient to fuck us. 
// png.src = url + next_page + ".png";  is enough to make us shit the goddammit next_page is from next_image. 
// Thanks for throwing an error or something, you piece of shit browser. 
// Still not removing images onError. Still not loading new images onLoad. Switch to thumbnails for sane performance. 
// next_image works when invoked from the console. So... fuck? 
// I'll bet it's some complete bullshit where I have to set onerror and onload through different names, like className. 
// x = document.getElementsByTagName( 'img' )[1]; x.onerror returns null. Even though onerror is in the autosuggestions. 
// Jesus fucking Christ. x.onload: null. x.onload="next_image()": "next_image". x.onload: null. It just fucking EATS the input. 
// x.dataset is an empty object. (Sorry, DOMStringMap. God forbid we use a generic type.) 
// Don't tell me I have to manually edit x.outerHTML. 
// x.setAttribute( "onload", "next_image()" ). Fucking Javascript. 
// Should probably include a link to the original submisssion, plus whatever do-not-redirect works for Pixiv Fixiv / Image Glutton. 
// This accidentally ignores muted images - I'm calling that a feature. 
// Clunky solution to memory problems: when an image loads, remove it, and put its URL in a list. 

// This script suggests a generic solution to Twitter nonsense: replace tweet divs with their media. Break classes and IDs so their infinite-scrolling JS can't remove them. No worries about their stupid random class names, since we'd just parent.parent.parent and then .replace(). 
	// Also I could probably just .remove() the sidebar bullshit. 

// https://www.pixiv.net/user/28122279/series/73843?p=3 - wrong thumbnail size? Oh, they're also fake <img> tags somehow, like favorites. 
// "<div class="_layout-thumbnail"><img src="https://i.pximg.net/c/240x240/img-master/img/2020/02/03/09/57/31/79256608_p0_master1200.jpg" alt="" class="_thumbnail ui-scroll-view" data-filter="thumbnail-filter lazy-image" data-src="https://i.pximg.net/c/240x240/img-master/img/2020/02/03/09/57/31/79256608_p0_master1200.jpg" data-type="illust" data-id="79256608" data-tags="R-18 漫画 lolicon loli original_character original flat_chested undressed comic ロリ" data-user-id="28122279" style="opacity: 1;"><div class="_one-click-bookmark js-click-trackable  " data-click-category="abtest_www_one_click_bookmark" data-click-action="illust" data-click-label="79256608" data-type="illust" data-id="79256608"></div><div class="thumbnail-menu" data-react="true"><div class="_balloon-menu-opener"><div class="opener"></div><section class="_balloon-menu-popup"><ul class="_balloon-menu-closer menu"><li class="mute-setting-opener" data-type="illust" data-id="79256608"><span class="item">Mute settings</span></li><li><a class="item" target="_blank" href="/illust_infomsg.php?illust_id=79256608">Report</a></li></ul></section></div></div></div><div class="page-count"><div class="icon"></div><span>2</span></div>"
// So I guess it's a div, class _layout-thumbnail, data-src? no, fuck off, there's an <img> right there. Ah, 240x240. Fuck me I guess. Also not square? 
// https://i.pximg.net/img-original/img/2020/02/03/09/57/31/79256608_p0.png 
// https://i.pximg.net/c/240x240/img-master/img/2020/02/03/09/57/31/79256608_p0_master1200.jpg
// https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/04/16/06/54/35/80824078_p0_square1200.jpg <-- different submission, be aware 
// Maybe convert before filtering. Simplifies things later. 
// "<div class="_3b8AXEx"><span><span class="XPwdj2F"></span>2</span></div><div alt="" class="_1hsIS11 lazyloaded" style="width: 148.5px; height: 198px; background-image: url(&quot;https://i.pximg.net/c/240x240/img-master/img/2020/07/16/21/54/03/83015481_p0_master1200.jpg&quot;);"></div>" 
// Array.from(document.getElementsByTagName('a')).filter( a => a.innerHTML.match( '//' ) ) 
// Array.from(document.getElementsByTagName('a')).filter( a => a.innerHTML.match( '_p0' ) ).map( a => a.innerHTML.split('&quot;')[1] )
// This only finds 19 of 20 images though. Huh. Ahhh, one's an Ugoira: 
// "<div alt="" class="_1hsIS11 lazyloaded" style="width: 197.12px; height: 198px; background-image: url(&quot;https://i.pximg.net/c/240x240/img-master/img/2020/07/16/22/13/49/83015936_master1200.jpg&quot;);"></div><div class="AGgsUWZ"></div>"

// Hey, genius: you want a button to drop an image. That simplifies DownThemAll exclusion. Ideally reversible. Ideally. 
// Actually - do this for reloads as well. Manual "reload this image" option. 

// https://www.pixiv.net/en/users/22538279/artworks is being fucky. Probably just a performance issue, since some submissions do load subsequent pages. 
// Relying on onError suuucks. I categorically NEED a way to distinguish 'didn't finish loading' from 'file not found.' 
	// I can maybe get around this by assuming all the thumbnails load. They're tiny and quick. So if a thumbnail removes itself and produces a div where one file extension is expected to load, and that element has no children, we can infer the load failed, and start over with the three separate file extensions. 
	// Maybe ctrl+z instead of a per-image 're-show' button? Stick per-image-group IDs on a list, first in last out, as they're removed. 
	// Still might need per-submission do-over buttons for when loading is borked. Still want them, anyway. 
	// Be positive: have an onLoad for each image format. Signal success, not implicit failure. 
		// Or I guess do both: onError, check for success? 
		// Even just onError not removing an image if the other two are already gone would safely assume it timed out while the others 404'd. 
	// Images that fail now seem to leave their giant red X. Maybe just add an interval check that adds a reload-this-whole-submission button. Same functionality as up top. 
		// Remember: interval function doesn't need to getElements each time. Just use the live HTML collection. 
		// Oh. OnLoad, change class. A live HTML collection for that class will then become empty. 
			// Be aware it also starts empty. I guess have the interval function turn it both on and off. 
			// That worked reasonably well, but of course everything moves slightly when loading finishes, because CSS is garbage. 
			// Fancy non-fixes: trigger on change for HTML collections, unconditionally set class to collection.length. 

// Getting decent. Clone Pixiv Fixiv scaling modes, via changing image class and body class. Maybe go for unicode symbols instead of words. 
	// E.g. <-->, the vertical version of that, the cross version... '1:1' could just be text. Point is: not English. 
	// I can probably also do one-page-onscreen instead of as-it-comes vertical spacing, since I have divs around each image. 
// And use a damn dark mode already! 
// Buttons for forward/back? Floating over top, maybe. scrollTo stuff. Ech, but it has to update as you manually scroll down, so prev/next are at least consistently relative. 
	// Ideally the focus is somewhere in the middle of the screen, not like, one scanline of an image counts as being 'on' that image. 
// Per-image removal buttons could be larger and lower-contrast. Big easy target. Ignorable. 
// Spinner widget for individual images loading? I.e., keep spinning while the page is unfinished. That might be as simple as a DOM check. 
	// body.onload happens repeatedly, yeah? 
	// Style: thinking slow rotation, lower contrast, possibly inside the other spinner. 
	// I probably have to set/reset body.onError every time a new big-image starts loading. 
	// onstalled? onwaiting? onshow, for other things. Is oninvalid different from onerror? 
// Count beside spinners? 'X images, N loading.' 
// I could trivially turn this into a Pixiv Fixiv replacement - right? All I need is any image URL. No JSON shenanigans. 
// A stand-in for images that haven't loaded would be nice. Maybe their thumbnail, in thumbnail size. Just tell me when the top manga will affect scrolling. 
// Killing the submission reeeally needs to kill the underlying images. Maybe add another sub-sub-sub-span for next_image to target, and remove that. Then reloading the submission recreates that span before calling next_image on p0. 
// Come on, I can hack together previous / next page links. Only at the bottom. Doesn't trigger automatically. Just slap it in there. 
	// https://www.pixiv.net/en/users/1346633/artworks?p=2 -> p=1 and p=3. Needs to handle bare /artworks to infer ?p=1. 
// Needs a big reload-all button at the top. 
// If I'm being clunky, I can probably grab image count from the counters in the corners. 
// document.getElementById("divFirst").scrollIntoView();
// Kinda want a "remove all first images" button. So many censored thumbnails. Japan - fuck off already. We're sorry we colonialized you. Stop ruining porn. 
// Image-loading spinner doesn't work on bookmarks page. Weird. 
	// But it works on the first page? Works in general now. Fuck me, I guess. 
// Clunky button solution: have an interval loop in this script look for an element on the page. That button, onclick, changes class. Fake event-driven design. 
// Kinda want horizontal dividers between submissions. 
// https://www.pixiv.net/user/55117629/series/87453?p=2 - gets everything but the manga. 
// Add buttons for scrolling to prev/next image/submission. Left-aligned, top of each image. 
// Should count submissions and avoid "next" button if it's not a full page. Eh: complex and site-specific. 

// Long-term issue: this looks boring on a widescreen monitor. It's all tallscreen settings. Massive negative space otherwise. 
	// Consider putting the per-image X on the right. 
	// I like it on the right, but there's very little reason not to have it on both sides. 

/*
	// I need some kind of button to remove (or at least hide) an image or submission. If it's by submission it should go here, in the root span. 
	// A redo button can reconstruct the span's contents from its ID, since its ID is the submission URL. 
	// Okay, proof of concept achieved. Now what should happen is, the submission URL and a "Reload" button (TBD) should remain. 
	// Or... we just do this per-image instead. 
	let remover = document.createElement( 'button' ); 		// Why not.
	remover.innerText = 'X'; 
	remover.setAttribute( 'onclick', 'document.getElementById( "' + url + '" ).innerHTML = "";' ); 
	remover.className = 'remover'; 		// Add some CSS to float left or whatever. 
	// "this" is fucky enough that I had to use getElementById, and I don't think I gave individual images IDs. Er, individual image-groups. 
	// Wow, I did this all as children of one span. That's kinda ugly. 
	// Fixed-ish. Why is there one weird do-nothing button for each submission? E.g. button, button, image, button, image, button. 
	// It'd almost make sense at the end, being the leftover from a failed next-image test. Why is it at the front? 
	// Manga images appear in the right order. It's not simply backwards. 
	// Added 'page' as the ID for each button. The phantom one is ID 0. The ones that work start at 1. Which seems backwards? 
	// The whole ordeal is an off-by-one nightmare. We call (url,page) to replace last_page with a big image and check for next_page... which isn't just page? Wha? 
	// group_span.id doesn't actually control anything except which thing 'remover' removes. And these phantom buttons do remove themselves. The fuck. 
	// I invoke this and start loading images with next_image( url, 0 ). It's not a -1 call causing weird side effects from a missing original. 
	// Ah. But page=0 loads the image hq_url + last_page, and -then- loads thumbnails for _p0 images. Which normally has negligible effect. 
	// So only append group_span if last_page >= 0. Yeah? Yeah. 
	// https://www.w3schools.com/howto/howto_css_center-vertical.asp
	// Vertically centering these presumably requires making each image-group a container. Which I did. It didn't help. CSS remains, in technical terms, some bullshit. 
	// This is a real usability issue. 

	// Pretty that up later. Add reload buttons beside each image? Opposite side. 
	// I should maybe display:none instead of nuking images entirely. Or whichever 'don't show' option keeps the spacing. 
	// Unicode reload symbol - ⟳ - 'clockwise gapped circle arrow.' http://xahlee.info/comp/unicode_computing_symbols.html 
	// ... why don't the remove and reload buttons appear on opposite sides of the image? Why is reload on its own line?
	// Ah, I slapped <br>s onto agif. Nope: onto every format. Put it in the group_span instead. 
	// Problem: remover removes itself, and therefore the reload button. 
	// Unsurprisingly next_image is not the right reload function, either. 
*/

// Ever-useful test profile: https://www.pixiv.net/en/users/53625793 


GM_registerMenuCommand( "Swallow entire gallery", show_images ); 



// Put button on page, since menu is missing on later userscript plugins
var trigger = document.createElement( 'button' ); 
// Onclick, change class to some spinner, so it reacts instantly and looks like it's loading. Really the interval is waiting a second. 
// 	html += '<style> .reloader { background-color:#dbd7d8; border-radius: 50%; width: 60px; height: 60px; text-align: center; display: inline-block; border:1px solid #19ab19; cursor:pointer; line-height: 20px; color:#194d19; font-family:Arial; font-size:33px; padding: 10px 10px; text-decoration:none; } .reloader:hover { background-color:#2abd2a; } </style>';
trigger.style = "position: absolute; left: 15px; top: 70px; background-color:#dbd7d8; border-radius: 30px; text-align: center; display: inline-block; border:1px solid #19ab19; cursor:pointer; line-height: 20px; color:#194d19; font-family:Arial; font-size:25px; padding: 10px 10px; text-decoration:none;" 		// I'd like too have a hover color as well. 
trigger.innerText = "Swallow gallery"; 
// Text is WIP. Ideally work the word "visible" in there, since it's non-obvious. 
trigger.className = "unclicked_button"; 
trigger.onclick = function(){ this.innerText='Swallowing...'; this.className = 'clicked_button'; } 		// Immediate visible change, idempotent
//document.body.appendChild( trigger ); 
// Oh right, I meant to hide this button until it would work. 
// Having pre-optimization performance concerns, i.e., do live HTML collections make a noticeable difference? Because I could just add a delay. 
// Fuck it, do things properly. 
// Ooh, Array.find(). Pass it a test function and it'll return the first element that matches. 
var images = document.getElementsByTagName( 'img' ); 
var links = document.getElementsByTagName( 'a' ); 
var add_button = setInterval( function() { 
		if( Array.from( images ).find( e => e.src.match( '250x' ) ) || Array.from( links ).find( e => e.innerHTML.match( '240x' ) ) ) {
			clearInterval( add_button ); 
			document.body.appendChild( trigger ); 
		}  
	}, 1000 ); 


// Injecting code into the page is nontrivial - ironically because function.toString is fragile - so just look for a change in the page. 
var button_check = document.getElementsByClassName( 'clicked_button' ); 
var fake_event = setInterval( function() {  
		if( button_check.length > 0 ) { 
			clearInterval( fake_event ); 
			show_images(); 
		} 
	}, 1000 ); 



function show_images() { 

	var thumbs;
//	var images;
	var interval_object; 

	var submissions_loading, submissions_spinner;
	var images_loading, images_spinner; 

	/* Image URLs in basic <img> tags: */
//	thumbs = Array.from( document.body.getElementsByTagName( 'img' ) )
	thumbs = Array.from( images ) 
		.filter( i => i.src )
		.map( i => i.src ); 
	/* Image URLs in fake background-image style blocks: */
	thumbs = thumbs.concat( Array.from(document.getElementsByTagName('a'))
/*	thumbs = thumbs.concat( Array.from( links ) 		// For some goddamn reason this doesn't work. Shrug. */
		.filter( a => a.innerHTML.match( 'c/240x240.' ) )
		.map( a => a.innerHTML.split('&quot;')[1] ) ); 
	thumbs = Array.from( new Set( thumbs ) ); 		/* Remove duplicates */
	if( document.domain.replace( 'www.', '' ) == "pixiv.net" ) {
		thumbs = thumbs.map( u => 		/* Convert from 240x240 (e.g. series, followed artists) */
			u.replace( 'c/240x240/', 'c/250x250_80_a2/' ) 
		); 
		thumbs = thumbs.filter( u => u.match( 'c/250x250' ) ); 		/* Filter - not just _p0 images, since that catches "featured" thumbnails. */
		thumbs = thumbs.reverse(); 
		images = thumbs.map( u => 		/* To largest available size */
			u.replace( 'c/250x250_80_a2/', '' )
			.replace( 'img-master/', 'img-original/' )
			.replace( 'custom-thumb/', 'img-original/' )
			.replace( '_square1200.', '.' ) 
		); 
		thumbs = thumbs.map( u => 		/* To mini-size */
			u.replace( 'c/250x250_80_a2/', 'c/48x48/' )
			.replace( 'custom-thumb/', 'img-master/' ) 
		); 
	} 

	/* Thumbnails on https://www.pixiv.net/bookmark_new_illust.php?p=2 etc. aren't <img>s. What even. */

	html = '';
	html += '<style> img.short { max-width: 90vw; max-height: 60vh; z-index: 10; } </style>'; 		/* I liked things short. */
	html += '<style> .submissions_loader { position: absolute; left: 0px; top: 0px; border: 8px solid #3498db; border-top: 8px solid #111111; border-bottom: 8px solid #111111; border-radius: 50%; width: 48px; height: 48px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>'; 		/* Spinner crap. w3schools: good content, dogshit website.  */
	html += '<style> .images_loader { position: absolute; left: 8px; top: 8px; z-index: -1; border: 24px solid #db9834; border-top: 24px solid #aaaaaa; border-bottom: 24px solid #AAAAAA; border-radius: 50%; width: 0px; height: 0px; animation: images_spin 3s linear infinite; } @keyframes images_spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>';  
	html += '<style> .spacer { position: absolute; width: 0px; height: 0px; } </style>'; 		/* Dead spinner crap. (16px plus both 4px borders.) */
	html += '<style> .other_spacer { position: absolute; width: 0px; height: 0px; } </style>'; 		/* Dead spinner crap. (Arbitrarily smaller than the other one.) */
	html += '<style> #image_counter{ position: absolute; left: 70px; top: 5px; font-size: 33px; }  </style>'
	html += '<div class="submissions_loader" id="submissions_spinner"></div>' 		/* Spinner for submissions, 'new images being found.' */
	html += '<div class="images_loader" id="images_spinner"></div>' 		/* Spinner for images, 'found images loading in high-res.' */
	html += '<style> .remover { background-color:#d7dbd8; border-radius: 50%; width: 60px; height: 60px; text-align: center; display: inline-block; border:1px solid #ab1919; cursor:pointer; line-height: 20px; color:#4d1919; font-family:Arial; font-size:17px; padding: 10px 10px; text-decoration:none; } .remover:hover { background-color:#bd2a2a; } </style>'; 
	html += '<style> .group { position: relative; } </style>'; 
	html += '<style> .floating { z-index: 1; position: absolute; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%); width: 120px; height: 120px; font-size:45px; } </style>'; 		/* Right-handed, no translateX */
	html += '<style> .reloader { background-color:#dbd7d8; border-radius: 50%; width: 60px; height: 60px; text-align: center; display: inline-block; border:1px solid #19ab19; cursor:pointer; line-height: 20px; color:#194d19; font-family:Arial; font-size:33px; padding: 10px 10px; text-decoration:none; } .reloader:hover { background-color:#2abd2a; } </style>';
	html += '<style> .test { display:none} .thumb { display:none} </style>'; 		// Hidden thumbnails, probing to check for next image in multi-image sets 
/*	html += '<style> div { z-index: -2; } </style>'; 		// Can't make the buttons go behind the image and also clickable. I just want a little overlap. */

	html += '<span id="image_counter"></span>'; 		/* This detaches. */
	html += '<br><br><center><span id="centered"></span></center>';  		/* Where stuff goes. */
	html += '<br><br><br>'; 		/* Spacing for prev/next links. */
	html += '<center><span id="links"></span></center>'
	html += '<br><br><br><br><br>'; 		/* Runout. */

	document.body.innerHTML = html;  		/* We assume this is atomic and proceed apace. */

	let links = document.getElementById( 'links' ); 		/* Has to go after document = html, duh. */
	let page_number = 1;
	if( window.location.search ) { 
		page_number = parseInt( window.location.href.split( '?p=' )[1] ); 			/* https://www.pixiv.net/en/users/12345/artworks?p=2 */
	} 
	let link_html = ' <a href="' + window.location.origin + window.location.pathname + '?p=' + (page_number+1) + '">Next page</a>'; 
	if( page_number > 1 ) { 
		link_html = '<a href="' + window.location.origin + window.location.pathname + '?p=' + (page_number-1) + '">Previous page</a> -' + link_html; 
	} 
	links.innerHTML = link_html; 

	function next_image( url, page ) { 

		let span = document.getElementById( url ); 
		let next_page = 1 + page; 

		let hq_url = url.replace( 'c/48x48/', '' ).replace( 'img-master/', 'img-original/' ); 
		let last_page = -1 + parseInt( page ); 

		let group_span = document.createElement( "div" ); 
		group_span.className = 'group'; 
		group_span.id = url + "_p" + page; 

		let png = document.createElement( 'img' ); 
		png.className = "short loading";
		png.src = hq_url + last_page + ".png"; 
		png.setAttribute( "alt", "" ); 
		png.setAttribute( "onerror", "this.parentElement.remove();" );  
		png.setAttribute( "onload", "this.classList.remove('loading');" );  

		let jpg = document.createElement( 'img' ); 
		jpg.className = "short loading";
		jpg.src = hq_url + last_page + ".jpg"; 
		console.log( jpg.src ); 
		jpg.setAttribute( "alt", "" ); 
		jpg.setAttribute( "onerror", "this.parentElement.remove();" );  
		jpg.setAttribute( "onload", "this.classList.remove('loading');" );  

		let gif = document.createElement( 'img' ); 
		gif.className = "short loading";
		gif.src = hq_url + last_page + ".gif"; 
		gif.setAttribute( "alt", "" ); 
		gif.setAttribute( "onerror", "this.parentElement.remove();" );  
		gif.setAttribute( "onload", "this.classList.remove('loading');" );  
/*		gif.setAttribute( "onerror", "this.parent.setAttribute( 'failures', 1 + this.parent.getAttribute( 'failures' ); if( 3 < this.parent.getAttribute( 'failures' ) ) { this.parentElement.remove(); }" ); */

		let apng = document.createElement( 'a' ); 
		apng.href = hq_url + last_page + ".png"; 
		apng.setAttribute( "target", "_blank" ); 
		apng.appendChild( png ); 

		let ajpg = document.createElement( 'a' ); 
		ajpg.href = hq_url + last_page + ".jpg"; 
		ajpg.setAttribute( "target", "_blank" ); 
		ajpg.appendChild( jpg ); 

		let agif = document.createElement( 'a' ); 
		agif.href = hq_url + last_page + ".gif"; 
		agif.setAttribute( "target", "_blank" ); 
		agif.appendChild( gif ); 

		/* Button to hide individual images if they're gross or boring */ 

		let remover = document.createElement( 'button' ); 
		remover.innerText = '❌'; 
		remover.setAttribute( 'onclick', 'document.getElementById( "' + group_span.id + '" ).innerHTML = "";' ); 
/*		remover.setAttribute( 'onclick', 'document.getElementById( "' + group_span.id + '" ).style = "visibility:hidden";' ); */ /* Doesn't stop DownThemAll. */ 
		remover.className = 'remover floating'; 
/*
		let reloader = document.createElement( 'button' ); 
		reloader.innerText = '⟳'; 
		reloader.setAttribute( 'onclick', 'next_image( "' + url + '", "' + page + '" )' ); 
		reloader.className = 'reloader'; 
*/ 

		group_span.appendChild( apng ); 
		group_span.appendChild( ajpg ); 
		group_span.appendChild( agif ); 
		group_span.appendChild( remover ); 
/*		group_span.appendChild( reloader ); */ 
		group_span.appendChild( document.createElement( 'br' ) );
		group_span.appendChild( document.createElement( 'br' ) );  
		if( last_page >= 0 ) { 
			span.appendChild( group_span ); 
		} 

		/* Test for the next image - if any of these thumbnails resolve, replace that with more of the above. */ 

		let test_span = document.createElement( "span" ); 
		let thumb_onload = "this.removeAttribute('onload'); this.className='thumb'; next_image('" + url + "', " + next_page + ");"; 

		png = document.createElement( 'img' ); 
		png.className = "test";
		png.src = url + page +  '_square1200' + ".png"; 
		png.setAttribute( "alt", "" ); 
		png.setAttribute( "onerror", "this.remove();" ); 
		png.setAttribute( "onload", thumb_onload ); 

		jpg = document.createElement( 'img' ); 
		jpg.className = "test";
		jpg.src = url + page + '_square1200' + ".jpg"; 
		jpg.setAttribute( "alt", "" ); 
		jpg.setAttribute( "onerror", "this.remove();" ); 
		jpg.setAttribute( "onload", thumb_onload); 

		gif = document.createElement( 'img' ); 	
		gif.className = "test";
		gif.src = url + page + '_square1200' + ".gif"; 
		gif.setAttribute( "alt", "" ); 
		gif.setAttribute( "onerror", "this.remove();" ); 
		gif.setAttribute( "onload", thumb_onload ); 

		span.appendChild( png ); 
		span.appendChild( jpg ); 
		span.appendChild( gif ); 

	} 

	let script = document.createElement( 'script' ); 	
	script.innerText = next_image.toString(); 
	document.body.appendChild( script ); 	

	let centered = document.getElementById( 'centered' ); 

	for( original_url of thumbs ) { 
		let url = original_url.split( '_p0' )[0] + '_p'; 

		let container = document.createElement( 'span' );
		container.id = url + 'container'; 
		let basket = document.createElement( 'span' );
		basket.id = url + 'basket'; 
		let span = document.createElement( 'span' ); 
		span.id = url; 

		let submission = url.split( '/' ).pop(); 
		submission = submission.split( '_' )[0]; 
		let submission_url = 'https://www.pixiv.net/en/artworks/' + submission; 
 
		let link = document.createElement( 'a' ); 
		link.href = submission_url + '#dnr#&dnr'; 
		link.innerText = ' ' + submission + ' '; 		/* Just the number - large print. So it matches the giant round buttons. I'd like an unlinked space on either side.  */
		link.setAttribute( "target", "_blank" ); 
		link.style = 'font-size:30px'; 

		let submission_remover = document.createElement( 'button' ); 
		submission_remover.innerText = '❌'; 
		submission_remover.setAttribute( 'onclick', 'document.getElementById( "' + url + '" ).innerHTML = "";' );
/*		submission_remover.setAttribute( 'onclick', 'document.getElementById( "' + url + 'basket" ).innerHTML = "";' );  */
		submission_remover.className = 'remover'; 		/* Add some CSS to float left or whatever. */

		let reloader = document.createElement( 'button' ); 
		reloader.innerText = '⟳'; 
		reloader.setAttribute( 'onclick', 'document.getElementById( "' + url + '" ).innerHTML = ""; next_image( "' + url + '", 0 )' );
/*		reloader.setAttribute( 'onclick', 'document.getElementById( "' + url + 'basket" ).innerHTML = ""; let c = document.createElement( "span" ); c.id="url+'basket'"; let s = document.createElement( "span" ); s.id = "' + url + '"; c.appendChild( s ); document.getElementById( "' + url + 'container" ).appendChild( c ); next_image( "' + url + '", 0 )' );  */
		/* I should just hoist the onclick reload function into an actual function. I'm gonna have to move -this- function into document space, just to make a button work. Goddamn GreaseMonkey and clones got rid of the menu ages ago. Or... maybe hoist this whole thing, as one? The entire script is one function, which contains other functions as objects. */
		/* Hey genius, you can just do reloader.onclick = function() { } and get syntax highlighting and shit. Aaargh not sure that works with the string 'url' provided by this script. */ 
		reloader.className = 'reloader'; 

		let bottom_submission_remover = submission_remover.cloneNode(); 		/* Why doesn't this include innerText? */
		bottom_submission_remover.innerText = '❌'; 
		bottom_submission_remover.setAttribute( 'onclick', 'document.getElementById( "' + url + '" ).innerHTML = ""; document.getElementById( "' + url + 'container" ).scrollIntoView()' ); 		
/*
		// Scroll back up, since a bunch of vertical content disappeared. The premused use of this button is when you've scrolled past a long-ass manga and gone "meh," so you don't want to hunt for the root reload / remove buttons. That crap killed me in Tumblr Scrape. 
		// DRY suggests this should getElementById( the other remover button ).click() and then scrollIntoView. 
*/

		container.appendChild( reloader ); 
		container.appendChild( link ); 
		container.appendChild( submission_remover ); 
		container.appendChild( document.createElement( 'br' ) ); 
		basket.appendChild( span ); 
		basket.appendChild( bottom_submission_remover ); 
		container.appendChild( basket ); 
		container.appendChild( document.createElement( 'br' ) ); 

		centered.appendChild( container ); 

		/* DRY. We have a span, we have a put-images-in-span function, go. */
		next_image( url, 0 ); 
	} 

/*
	// Could use some indication of whether things are still loading. A spinner that disappears when all the thumbnails disappear. 
		// setInterval, getElementsByClass(Name?), every 5000ms or whatever. 
		// document.getElementsByClassName( "thumb" ) - I guess I don't remove these. Maybe change class from "test"? 
	// Should this restart when a submission is reloaded? Lazy answer: nope. 
	// Rejiggering this to have a secondary spinner for images themselves. Restarting might actually be even lazier: use a live HTML collection. 
	// I could simplify this to e.g. images_spinner.className = images_loading.length and do CSS bullshit like #id.class=spinning #id.0=not-spinning. 
*/
	submissions_loading = document.getElementsByClassName( 'test' );
	submissions_spinner = document.getElementById( 'submissions_spinner' );
	images_loading = document.getElementsByClassName( 'loading' ); 
	images_spinner = document.getElementById( 'images_spinner' );
	image_count = document.getElementsByClassName( 'thumb' ); 		// No longer updates as images are removed. Just add another class. 
		// Tracking "short" instead counts the test images, leading to brief overcounting. 
	image_counter = document.getElementById( 'image_counter' ); 		/* Two hard problems. */
	interval_object = setInterval( function() { 
			if( submissions_loading.length == 0 ) { 		/* If we're done testing for new images in submissions */
				submissions_spinner.className = 'spacer'; 
			} else {  		/* If e.g. we reload a submission and it takes a while */
				submissions_spinner.className = 'submissions_loader'; 
			}

			if( images_loading.length == 0 ) { 		/* If we're done testing for new images in submissions */
				images_spinner.className = 'other_spacer'; 
			} else {  		/* If e.g. we reload a submission and it takes a while */
				images_spinner.className = 'images_loader'; 
			}

			image_counter.innerText = '' + image_count.length + ' images'; 
			/* Should arguably exclude loading images.  */
			/* Could be made accurate by counting calls to next_image. Right? Or incrementing some var when that succeeds. */ 
			/* Just count className="thumb". Right? Haha, I'm already double-counting because loaded thumbnails don't really go away. Yeah, count "thumb." */

		}, 1000 ); 
}


// This has to go afterward, yeah? 
// This just doesn't work, because go fuck yourself. 
// "SyntaxError: missing ; before statement." Which means it fucked up and ignored an \n... somewhere. Where? Go fuck yourself, that's where. 
// I've removed all newlines fromt his document and can say with some confidence I'm not missing any // comments in show_images. 
// Aggravating garbage. toString returns a string with proper newlines. innerText will not preserve them under any circumstances. 

let script = document.createElement( 'script' ); 	
//script.innerText = show_images.toString().replace( /\n/g, "\/\r\n" );
//script.innerText = show_images;  		// Damn. Would've been too easy. 
//console.log( script.innerText ); 
//document.body.appendChild( script ); 	

















































































