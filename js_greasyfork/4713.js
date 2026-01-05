// ==UserScript==
// @name        Eza's Image Glutton
// @namespace   https://inkbunny.net/ezalias
// @homepage     https://greasyfork.org/en/users/4876-ezalias
// @author			Ezalias
// @description Redirects to high-res images on gallery sites, skipping past descriptions and comments
// @license     MIT
// @license     Public domain / No rights reserved

// @include     *://www.furaffinity.net/view/*
// @include     *://www.furaffinity.net/full/*
// @include     https://inkbunny.net/submissionview.php*
// @include     https://inkbunny.net/s/*
// @include     http://gelbooru.com/*page=post&s=view*
// @include     http://youhate.us/*page=post&s=view*
// @include     https://youhate.us/*page=post&s=view*
// @include     *://www.gelbooru.com/*s=view*
// @include     *://gelbooru.com/*s=view*
// @include     *://danbooru.donmai.us/posts/*
// @include     *://safebooru.donmai.us/posts/*
// @include     *://*.tumblr.com/image/*
// @include     *://*.media.tumblr.com/*/s*
// @include     /^http(s|)://e(621|926)\.net/post/show*//
// @include     *://e621.net/posts/*
// @include     *://e926.net/posts/*
// @include     *://e6ai.net/posts/*
// @include     *://*.deviantart.com/art/*
// @include     *://*.deviantart.com/*/art/*
// @include     /^https?://w*\.*hentai-foundry\.com/pictures/user/.*/[0-9]*/.*/ 
// @include     /^https*://www\.sofurry\.com/view/*//
// @include     https://www.weasyl.com/*
// @include     *://old.y-gallery.net/view/*
// @include     *://rule34.paheal.net/post/view/*
// @include     *://rule34.xxx/index.php?page=post*
// @include     *://rule34hentai.net/post/view/*
// @include     /^https*://derpibooru.org/.*/
// @include     *://*.booru.org/*s=view*
// @include     *://mspabooru.com/*s=view*
// @include     *://safebooru.org/*s=view*
// @include     *://www.majhost.com/cgi-bin/gallery.cgi?i=*
// @include     *://e-hentai.org/s/*
// @include     *://nijie.info/view.php?id=*
// @include     *://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @include     *://www.pixiv.net/jump.php?*
// @include     *://www.pixiv.net/*/artworks/*
// @include     http://*sleepymaid.com/*
// @include     *://*.sankakucomplex.com/post/*
// @include     *://*.sankakucomplex.com/*/posts/*
// @include     *://*.bronibooru.com/posts/*
// @include     *://bronibooru.com/posts/*
// @include     *://luscious.net/c/*
// @include     *://luscious.net/pictures/c/*
// @include     *://imageboard.neko-sentai.com/post/*
// @include     *://uberbooru.com/posts/*
// @include     *://www.furiffic.com/*/view/*
// @include     *://beta.furrynetwork.com/artwork/*
// @include     *://hiccears.com/picture.php?pid=*
// @include     *://www.hiccears.com/picture.php?pid=*
// @include     *://www.jabarchives.com/main/post/*
// @include     *://aryion.com/g4/view/*
// @include     *://www.newgrounds.com/art/view/*/*
// @include     *://www.newgrounds.com/portal/view/*
// @include     *://lolibooru.moe/post/show/*
// @include     *://pbs.twimg.com/media/*
// @include     *://gfycat.com/*
// @include     *://tbib.org/index.php?page=post&s=view&id=*
// @include     *://myhentaigallery.com/gallery/show/*/*
// @include     *://www.megabooru.com/post/view/*
// @include     *://www.redgifs.com/watch/*
// @include     *://www.redgifs.com/ifr/*
// @include     *://www.gifdeliverynetwork.com/*
// @include     https://thehentaiworld.com/*
// @include     https://hypnohub.net/post/show/*
// @include     https://i.imgur.com/*.gifv
// @include     https://yande.re/post/show*
// @include     https://xbooru.com/*page=post*
// @include     https://furbooru.org/images*
// @include     https://r34hub.com/en/show/*
// @include     https://giphy.com/gifs/*
// @include     https://putme.ga/image/*
// @include     https://booru.allthefallen.moe/posts/*
// @include     https://knowyourmeme.com/photos/*
// @include     https://loops.video/v/*
// @include     https://co.llection.pics/post/view/*
// @include     https://incognitymous.com/*

// @include     *?*backtrap=*

// @exclude    *://pbs.twimg.com/media/*=orig*
// @exclude    *://www.deviantart.com/users/outgoing?*
// @exclude    *#comment*
// @exclude    *?comment*
// @exclude    *#c* 
// @exclude    *&pid=*
// @exclude    *#dnr

// @noframes
// @grant     none
// @version     1.46.3
// @downloadURL https://update.greasyfork.org/scripts/4713/Eza%27s%20Image%20Glutton.user.js
// @updateURL https://update.greasyfork.org/scripts/4713/Eza%27s%20Image%20Glutton.meta.js
// ==/UserScript==



// Any single-image submission will redirect to the full-size image. On multi-image submissions, every page except the first will redirect to its full-size image. 
// If you go "back" to the normal gallery page (to favorite the image, read its description, leave a comment, etc.) then this script will not send you forward again. 
// https://greasyfork.org/scripts/4713-eza-s-image-glutton 
// https://sleazyfork.org/scripts/4713-eza-s-image-glutton 



// Commentary on the UserScript block:
// @exclude #dnr - This string is appened to a URL when redirecting, to prevent back-trapping. 
// @exclude http://www.deviantart.com/users/outgoing?* - Archaic misfire prevention; should probably be changed to automatically redirect through.
// @exclude ?comment etc. - Site-specific cases where redirecting to the image is not desirable. E.g. when linked to individuals comments / comment pages. 



// TO DO: 
// for modify_tumblr: for photoset pages (but everywhere, to be safe) make unlinked images link to themselves. I want nice, clean, chronological tabs for multi-image comics. 
// modify_furaffinity to change prev/next/fav links with pre-appended #dnr. not raw html fiddling: use the DOM and getElementsByType or whatever. thingy.href=url_plus_dnr. 
// flickr? maybe separately. that whole site is a mess. also full-size images are sometimes gigantic, like dozens of megabytes. 
// Consider changing some @includes to @match. 
// Greasyfork install page as options page? 
// This would work faster if I could delay or prevent the loading of images. E.g., execute script before loading page, define CSS that doesn't download embedded images, wait for page to load, scrape image_url, and then redirect as usual. Since the script wouldn't trigger on #dnr (which I should do as an @exclude, I guess) images would load as usual when you clicked 'back.' 
	// This thought is mostly driven by opening a bunch of e.g. Gelbooru links all at once. They spend long enough loading that the full-size images are usually half-done before the redirect happens. 
// http://seiga.nicovideo.jp/seiga/im4507046 ? 
// Nijie.info support might be missing out on multipage submissions? I don't even have an account. 
	// My Nijie support is basically nonexistant because I didn't have an account. Turns out they're more like Pixiv now, including multi-image posts. This is problematic. (Animations work, though.) 
// Make undersized images link to themselves on imgur. 
// Eza's image glutton as described on http://cuddle.horse/post/109728993805/a-few-browser-extensions-that-make-furaffinity-a -
	// Eza’s Image Glutton: This affects websites beyond just FA but is a unique tool for powerbrowsing and such. When you open a page with a single image it skips all comments and descriptions and just shows the image in the highest quality possible. If you want to see all the items that are hidden all you have to do is go back a page.
	// good rundown from a third party. 'A page with a single image' is clearer than 'gallery submission page.' 
// It's impossible to find this script after Greasyfork fucked over "adult" scripts. SleazyFork does not appear in search engines, at all. The empty GreasyFork page doesn't show up. All that people will see if they don't already know where to go is userscripts-mirror.org, which was last updated in twenty-fucking-twelve. This is completely unacceptable. 
	// On the other hand, Yahoo also won't find 'greasyfork ezalias,' so what the fuck. Google finds it. Yahoo just sucks. 
// Apparently Chrome doesn't redirect properly - there's no 'back' functionality. Grand. 
	// ... there's back functionality if and only if the page finishes first. Fuck Chrome. 
	// Can I detect when this happens? Maybe add some awful floating fake back button, linked to the #dnr URL? 
	// I can't even reproduce this anymore. "It works on my machine" is an obstacle. 
	// https://greasyfork.org/en/scripts/4713-eza-s-image-glutton/discussions/90997
		// User says any delay will work, to stop Chrome from ignoring a redirect. Sweet. 
// Fiddled with @includes to consolidate http/https under http*. Seems to work? Might open execution to e.g. http://maliciousdomain.com/?//gelbooru etc. 
	// Yeah, it's an attack vector worth worrying about. Admittedly the switch case is on document.domain - the attack site would have to end correctly.
	// Goddammit, this is possible anyway, since http://*.gelbooru.org matches http://maliciousdomain.com?.gelbooru.org as-is! 
	// Aaaugh Greasemonkey needs a goddamn domain inclusion method besides string-matching. 
// Twitter broke videos - even on mobile. Fuck that, give me the MP4. You can't show me a video and pretend I don't have it. 
	// <video preload="none" playsinline="" style="width: 100%; height: 100%; position: absolute; transform: rotate(0deg) scale(1);" poster="https://pbs.twimg.com/media/DdFx3A9VAAEEqA9.jpg"><source src="https://video.twimg.com/amplify_video/995698796209225728/pl/qWXZDSRj7npFBnoS.m3u8?tag=2" type="application/x-mpegURL"><source src="https://video.twimg.com/amplify_video/995698796209225728/vid/720x720/hjcLz5e56ojDYS8j.mp4?tag=2" type="video/mp4"></video>
	// And here's the "button" that steals clicks:
	// <div style="position: relative; width: 100%; height: 100%; background-color: black;"><video preload="none" playsinline="" style="width: 100%; height: 100%; position: absolute; transform: rotate(0deg) scale(1);" poster="https://pbs.twimg.com/media/DdFx3A9VAAEEqA9.jpg"><source src="https://video.twimg.com/amplify_video/995698796209225728/pl/qWXZDSRj7npFBnoS.m3u8?tag=2" type="application/x-mpegURL"><source src="https://video.twimg.com/amplify_video/995698796209225728/vid/720x720/hjcLz5e56ojDYS8j.mp4?tag=2" type="video/mp4"></video></div> 
	// blob:// crap is above my pay grade. Use youtube-dl. It's what I resorted to. 
// Twitter: auto-click click-to-view nonsense? 
// Oh, and Tumblr lost their goddamn minds following the Great Purge. What the fuck is a PNJ? GifV is not a real format. You embed WebMs for lossless sprite work? Whaaat? 
// Nijie support is broken and someone finally noticed. I guess I'll do it properly. 
	// Should I extend Pixiv Fixiv support to Nijie? The initial motivation was Pixiv's awful lazy-loading. Nijie is high-quality, high-res, and low-nonsense. 
	// At least consider inserting some direct image links on Nijie. Maybe below each image for accessibility... maybe invisible, for DownThemAll. 
	// Oh, split the difference: add thumbnails to the top of the page. (Would they link to the image files, or #diff_n? Bluh.) 
// https://nijie.info/view.php?id=232449 - what is this nonsense? A single-image multi-image post? Fuck off, Nijie. 
	// Apparently it has multiple pages, but the second one is "guro" - so it doesn't link it? Qua? 
// Should probably replace all indexOf > -1 stuff with match. Oops, no: just most of it. match( '?' ) silently fails because it tries interpreting that as a regex. 
// Double-check that Weasyl and SoFurry actually work.
// Random failures on Paheal. E.g. http://rule34.paheal.net/post/view/2381933#search=bluebreed#dnr - works intermittently. 
// Should fix twitter to at least link the displayed images. In this script? In Gallery Smoothener? 
// Incidentally, string.match returns an array. I've just been using it as true/false. 
// https://www.pornhub.com/album/31567741 ? 
// I should probably parse &amp; crap by default. 
// Tumblr now treats bare image URLs like the old /image/ pages. Right-click, view image - same URL, different results. I hate the modern web. 
// May remove Giphy because it's so Tumblr-y. No real bare image. 
// DeviantArt now needs separate handling for small images. 
// https://safebooru.donmai.us/posts/166996 - Different subdomain. FFS. 

// Since I'm just leafing through HTML (usually), can I jump to the image /before/ trying to load the page? GreaseMonkey has a wonky option for running the script before the page runs, but I don't think we get all the HTML first. Maybe... maybe AJAX the page we're on? Like, @RunAtStart or whatever, then create a little blank page, then grab the URL via XmlHTTPgetObject or whatever, then read the HTML as responseText. The trouble (I expect) would be going back to the normal page when someone hits 'back.' This script shouldn't run... but any browser will probably have cached the fake page. 

// Owyn Tyler has a ridiculously replete script with similar goals called Handy Just Image - http://userscripts.org/scripts/show/166494
// The supported-site list is waaay longer than mine, and/but his goals are more complex. Image Glutton exists only to deliver the image. 
// He's having trouble with back-trapping, though. His solution sounds absurdly complex even compared to mine. Test the script and recommend help if possible. 

// Changes since last upload:
	// Meta-kludged ?backtrap behavior, because Sankaku is an awful website. 





// global variables, for simplicity
var image_url = '';		// location of the full-size image to redirect to
var wait_for_dnr = false;		// some site URLs use "#" liberally, so if this var is true, only "#dnr" will stop a redirect
var simple_redirect = false; 		// some domains are kicking back my JS redirect (for native referral), so do naive location=url instead
var page_failed = false; 		// If the page 503s or otherwise forces us to reload, wait a moment, then reload. 
var interval_handle; 		// In case we need to set an interval, this is the global handle to kill it. Because a simple "die" or "clearInterval( this )" would be too much to ask. 
var assume_extension = true; 		// Most sites should obviously point to an image, so if there's no file extension, guess ".jpg". This breaks DeviantArt. 

if( window.location.href.match( 'backtrap=' ) ) { 		// Hideous workaround to browsers "helpfully" removing the submission page, because of the redirect. 
	let lost_url = window.location.href.split( 'backtrap=' )[1]; 		// One backslash this time, because regex hates you. 
//	lost_url = lost_url.split( '&' )[0]; 
//	lost_url += "#dnr"; 
	let back_link = document.createElement( 'div' ); 
	back_link.innerHTML = '<a href="' + lost_url + '" style="font-size: xxx-large; opacity: 20%; color: white; background-color: black; text-decoration: none;">⇧</a>'
	document.body.append( back_link ); 
	// ... and then we can't remove that part of the URL, because the user might reload. Ugh. 
	// Avoiding @include *?backtrap=* may require adding every CDN for every service. At least the name.tld part. 
	// E.g. @include https://*metapix.net*?backtrap=* for InkBunny. 
	// But I mean... there's already *thing.com/thing* @includes. It's not exactly airtight. 
	// Uuugh I could check ?backtrap and &backtrap. But I can't just add &backtrap, because go fuck yourself. I have to check for ? first. 
	// Of course it breaks Gelbooru. 
} 

// detect site, extract image URL, then decide whether or not to redirect
switch( document.domain.replace( 'www.', '' ) ) { 		// Remove "www" to avoid cases where both example.com and www.example.com are supported. 
		////////// 		Simple extract_image_url_after / get_link_with_text / querySelector sites
	case 'e621.net': image_url = document.getElementById( 'image-container' ).dataset.fileUrl; simple_redirect = true; break;    
	case 'e926.net': image_url = document.getElementById( 'image-container' ).dataset.fileUrl; simple_redirect = true; break;    
	case 'e6ai.net': image_url = document.getElementById( 'image-container' ).dataset.fileUrl; simple_redirect = true; break;    
	case 'weasyl.com': extract_image_url_after( '<div id="detail-art">', '/' ); break; 		// also redirects to plaintext/HTML on stories, haha 
	case 'old.y-gallery.net': image_url = document.querySelector( '#idPreviewImage' ).src; break;
	case 'rule34.xxx': get_link_with_text( 'Original image' ); simple_redirect = true; break; 
	case 'xbooru.com': get_link_with_text( 'Original image' ); simple_redirect = true; break; 
	case 'derpibooru.org': extract_image_url_after( ' View</a>', '//' ); simple_redirect = true; break;
	case 'furbooru.org': extract_image_url_after( ' View</a>', '//' ); simple_redirect = true; break;
	case 'idol.sankakucomplex.com':
	case 'chan.sankakucomplex.com': image_url = document.querySelector( 'a#highres').href; simple_redirect = true; break; 
	case 'furiffic.com': extract_image_url_after( 'onload="$', '//' ); break; 		// Not using og:image because different URL causes image to re-load if user hits Back 
	case 'jabarchives.com': extract_image_url_after( 'class="group1"', '/main' ); wait_for_dnr = true; break;
	case 'gfycat.com': extract_image_url_after( 'og:video', '//' ); break; 
	case 'gifdeliverynetwork.com': extract_image_url_after( 'og:video', '//' ); break; 
	case 'r34hub.com': image_url = document.querySelector( '.media-wrapper img, .media-wrapper source' ).src; break; 
	case 'putme.ga': image_url = document.querySelector( '.image-viewer-main img' ).src.replace( '.md', '' ); simple_redirect = true; break; 
	case 'booru.allthefallen.moe': image_url = document.querySelector( '#post-info-size a' ).href; break; 
	case 'co.llection.pics': image_url = window.decodeURIComponent( document.querySelector( '#main_image' ).src ).slice(0,250)+'.jpg'; wait_for_dnr = true; break; 		// '%.jpg' throws a 400 error. 
	case 'incognitymous.com': image_url = document.querySelector( 'a:has(img.attachment-medium)').href; break; 
		////////// 		Slightly complicated extract_image_url_after sites
	case 'rule34hentai.net': extract_image_url_after( 'shm-zoomer', '/_images/' ); wait_for_dnr = true; reload_if( '<h2>Rate limit hit' ); break; 
	case 'rule34.paheal.net': image_url = document.querySelector( 'img#main_image, #main_image source').src + "#."; simple_redirect = true; wait_for_dnr = true; break; 
		// With kludge for forced lack of file extension.
		// Videos are also tagged id="main_image", but the src is in a <source> inside it.
		// document.querySelector( 'video source,#main_image') will select main_image preferentially. Because CSS. 
	case 'majhost.com': image_url = document.getElementsByTagName( "img" )[0].src; break; 		// first and only <img> tag 
	case 'luscious.net': image_url = document.getElementsByClassName( 'icon-download' )[0].href; wait_for_dnr = true; break;
	case 'gelbooru.com': extract_image_url_after( "og:image", '//' ); simple_redirect = true; break; 
	case 'youhate.us': extract_image_url_after( "og:image", '//' ); simple_redirect = true; break; 
	case 'aryion.com': extract_image_url_after( "item-box", '//' ); image_url = image_url.split("'")[0]; simple_redirect = true; break; 		// Singlequote terminator 
	case 'myhentaigallery.com': extract_image_url_after( 'class="gallery-slide">', '//' ); image_url = image_url.replace( '&amp;', '&' ); simple_redirect = true; break; 
	case 'megabooru.com': image_url = document.getElementById("main_image").src; image_url = image_url.split( '%' )[0]; simple_redirect = true; break; 
	case 'hypnohub.net': image_url = document.querySelector( '#highres' ).href; break; 
	case 'yande.re': image_url = document.querySelector( '#highres' ).href; break;
	case 'i.imgur.com': image_url = document.querySelector( 'source' ).src; break; 
	case 'giphy.com': 
		image_url = document.querySelector( 'meta[content*="mp4"]' ).content; 
	break;
	case 'knowyourmeme.com': image_url = document.querySelector( '.magnify' ).href; assume_extension = false; break; 
	case 'loops.video': image_url = document.querySelector( 'video-player' ).caption; break; 
			// Doesn't work. Stupid fake HTML loading nothing and then deciding to construct a page. 
			// "View source" shows a <video-player> with video-source attribute, but those have dashes, so go fuck yourself. 
			// Or it just... doesn't exist, by the time this runs? Augh. Somehow too late for raw HTML, but too early to grab the goddamn video. 
		////////// 		Simple custom sites
	case 'sofurry.com': 
		image_url = window.location.href.replace('sofurry.com/view/','sofurryfiles.com/std/content?page='); 
		if( document.body.outerHTML.indexOf( '<div id="sfContentImage' ) < 0 ) { image_url = ''; } 		// Do not redirect from stories
		if( document.body.outerHTML.indexOf( '<div class="sf-story"' ) > 0 ) { image_url = ''; } 		// Really do not redirect from stories 
		break;
	case 'danbooru.donmai.us': 
	case 'safebooru.donmai.us': 
		image_url = document.querySelector( 'a[download]' ).href.split( '?download' )[0]; 
		break;
	case 'furaffinity.net': 		// This is a mess because I'm trying not to redirect from stories / music... but FA kindly links the thumbnail images for those. 
		reload_if( 'center;">Error 503' ); 		// reload_if now fires off a setTimeout that completes even if the script fails. 
		image_url = ( document.querySelector( '.download a[href]' ) || { href: '' } ).href; 		// In sidebar. Only visible in widescreen. 
	 		// Fallback for weird edge cases I can't reproduce:
		if( image_url == '' ) { image_url = document.querySelector( '#submissionImg' ).dataset.fullviewSrc; }
		// Still redirects on stories sometimes, because the download link is the image instead of the text file. Shrug. 
		break;
	case 'e-hentai.org': image_url = document.getElementById( 'img' ).src; break;
	case 'nijie.info': 
		reload_if( 'title>429' ); 
		extract_image_url_after( '"thumbnailUrl":', 'http' ); 		// E.g. https://pic.nijie.net/03/__rs_cns30x30/nijie_picture/1126260_20190526173732_0.png
		let url_parts = image_url.split( '/' ); 		// Can't chain these because splice returns the spliced element instead of the array minus that element.
		url_parts.splice( 4,1 ); 
		image_url = url_parts.join( '/' ); 		// E.g. https://pic.nijie.net/03/nijie_picture/1126260_20190526173732_0.png
		if( document.body.outerHTML.indexOf( '#diff_' ) > 0 ) { image_url = window.location.href.replace( 'view.php', 'view_popup.php' ); } 		// Multi-page view, not single image. 
		// I probably want to insert links to the individual images, on the view_popup page. 
		break;
	case 'sleepymaid.com':  
	case 'yay.sleepymaid.com':  
		image_url = document.getElementById( 'the-image' ).src; 
		if( document.getElementById( 'next' ) ) { image_url = ''; } 		// Don't redirect on comic pages 
		break;
	case 'imageboard.neko-sentai.com': image_url = document.getElementById( 'main_image' ).src; break;
	case 'uberbooru.com': 
		extract_image_url_after( 'Size: <a', '/data' ); 
		if( image_url.indexOf( '<' ) > -1 ) { image_url = ''; } 		// Uberbooru is having back-end problems with missing images. Don't redirect if we grabbed HTML instead. 
		break;
	case 'hiccears.com': extract_image_url_after( 'href="./upl0ads', './' ); break; 		// Wow, long garbage names. Can we use Download titles? Apparently not. 
	case 'hentai-foundry.com': 
		extract_image_url_after( ' ', '//pictures.' ); 
		if( image_url.indexOf( "';" ) > 0 ) { image_url = image_url.substring( 0, image_url.indexOf( "';" ) ) } 		// Singlequote terminate, more or less - only on resizable images 
		reload_if( '<h1>An error occurred.' ); 
		break;
	case 'pbs.twimg.com':
		image_url = window.location.href.split( '&' ).filter( s => ! s.match( 'name=' ) ).join( '&' ) + '&name=orig'; 
		if( image_url.indexOf( '?' ) < 0 ) { image_url = image_url.replace( '&', '?' ); } 		// string.match( '?' ) reads the ? like a regex. In quotes. Ugh. 
		assume_extension = false;
		break; 
	case 'lolibooru.moe': image_url = document.getElementById( 'highres' ).href; break; 		// Same as Yande.re. 
	case 'thehentaiworld.com': 
		get_link_with_text( 'Full Size' ); 
		if( window.location.href.match( '/videos/' ) ) { image_url = document.querySelector( '#video>source' ).src; } 		// On video pages, get the video.
		if( document.querySelector( '#doujin-pages' ) && !window.location.href.match( '\\?pp=' ) ) { image_url = ''; } 		// Do not redirect on multi-image landing pages
		simple_redirect = true; 
		break; 
	case 'redgifs.com': 		// May break this out into a function. 
		wait_for_dnr = true; assume_extension = false; simple_redirect = true;
		if( window.location.href.match( /\/watch\// ) ) { 
			image_url = window.location.href.replace( 'watch', 'ifr' ); 
		} else { 
			setInterval( () => { 
				// Click SD --> HD button, then grab video URL. 
				let hd = document.querySelector( '.gifQuality' );//.closest( 'div' );//?.click();
				if( hd ) {
					if( hd.querySelectorAll( 'path' ).length != 1 ) { hd.closest( 'div' ).click(); } 		// "SD" button has two <path> elements. 
					// This prevents you from clicking HD to go back to SD. Dunno why you'd want to, but still. 
					// The script shouldn't even run when #dnr is present. The hell? 
					image_url = document.querySelector( 'video[loop]' ).src ; 
					if( ! image_url.match( '-mobile.' ) ) { redirect(); }
				}
			}, 100 ); 
		} 
		break;
		////////// 		Sites complex enough to shove into a function down below 
	case 'inkbunny.net': scrape_inkbunny(); break;
	case 'pixiv.net': scrape_pixiv(); break;
	case 'mspabooru.com': scrape_booru(); break;
	case 'safebooru.org': /* scrape_booru(); */ image_url = document.querySelector( '.sidebar a[href*="/images/"]' ).href; break;
	case 'bronibooru.com': scrape_booru(); break; 
	case 'tbib.org': scrape_booru(); break; 
	case 'newgrounds.com': scrape_newgrounds(); break; 
}
////////// 		Holdovers from the previous method; domains that don't neatly conform to document.domain switch selection. 
if( domain( 'tumblr.com' ) ) { 
	// 2020 Tumblr is some bullshit. You cannot get a bare image. It always redirects to a page. But it's no longer a page with the large-sized image, because go fuck yourself. But: the general /image page we're still somehow redirecting from does have a large image... which you cannot right-click and save. I have fucking tried. Just bullshit of the highest order, instead of using CORS to deny hotlinks and just delivering a goddamn JPG. 
	extract_image_url_after( '"og:image"', 'http' ); simple_redirect = true; 
	// https://66.media.tumblr.com/99be3174c6066bb219cca0008f351ce5/4692a02d2fc92812-d6/s500x750/bd6f4ec02cc4a9aa036f3274b9c8af447e285a59.png
	if( document.querySelector( 'a' ) ) { 
		image_url = image_url.replace( /\/s\d*x\d*\//, '/s3072x3072/' ); 		// E.g. s400x600, s640x960. 
		image_url = image_url + "#dnr"; 		// Prevent infinite loops 
		// Adding do-not-redirect sometimes breaks this, but I'd rather publish missing functionality than an infinite redirect trap. 
		// I guess I should detect whether we're on an HTML page or a bare image? 
	} 
} 
if( domain( 'deviantart.com' ) ) { scrape_deviantart(); wait_for_dnr = true; }  
if( domain( 'booru.org' ) ) { scrape_booru(); } 	
if( domain( 'beta.furrynetwork.com' ) ) { interval_handle = setInterval( scrape_furrynetwork, 500 ); } 		// This site's designers are loons. 



if( page_failed ) { image_url = ''; } 		// If the page refused to load properly, do not redirect. (The delayed automatic reload is now in reload_if.) 



// Don't redirect if the filetype is obviously not an image. SWF, TXT, MP3, etc. 
// It's tedious to detect flash, story, and music pages on every website supported, so instead let's just cancel redirection based on those file extensions.
// Added ZIP & RAR because apparently DeviantArt lets you host 3D models and stuff. Automatically downloading those is not what this script is for. 
var ext = image_url.substring( image_url.lastIndexOf( '.' ) + 1, image_url.length ); 		// e.g. "png"
var not_images = [ 'mp3', 'swf', 'txt', 'docx', 'pdf', 'doc', 'rtf', 'midi', 'mid', 'wav', 'flv', 'cab', 'zip', 'rar' ];  
if( not_images.includes( ext ) ) { return; } 
// Oh right. Doesn't work on FA because FA points to the icon. Yaaayfuck. 
// Should maybe split on ? and #. E.g. foo.bar/img.png?tracking=1234. 

	// Redirect as a function. 
	// Slightly clunky way to trigger this from website-specific functions. "Don't repeat yourself." 
	// Conveniently - any delay should (should) prevent Chrome from eating #dnr pages. 
	// The minimum value for setTimeout is probably 4ms or 10ms, but aiming lower can't hurt. 
setTimeout( redirect, 1 ); 

	// Execution continues:

function redirect() { 	// Having defined image_url based on the page's HTML or DOM, modify the current URL to prevent back-traps, then redirect to that full image. 
	if( image_url == '' ) { return; } 		// Don't redirect to an empty string. (Emptying this string is how some functions fail safe.) 
	if( !wait_for_dnr && window.location.href.match( '#' ) ) { return; } 		// Don't redirect if the wait_for_dnr flag is false and there's a hash. (E.g. FA comments.) 
	
	if( window.location.href.match( '#dnr' ) ) { return; } 		// Don't redirect if there's a #dnr in the URL.
		// This should not be necessary. But InkBunny disagrees. 

	// Some images don't redirect properly, even if you manually "view image" - so we append ".jpg" to URLs without extensions, forcing the browser to consider them images.
	// Even if this doesn't work, the new URL should just 404, which is better than the semi-modal "octet stream" dialog seen otherwise. 
	if( assume_extension ) { 
		if( image_url.lastIndexOf( '/' ) > image_url.lastIndexOf( '.' ) ) { image_url = image_url + '.jpg'; }		// if there's not a "." after the last "/" then slap a file extension on there 
		if( image_url[ image_url.length - 1 ] == '.' ) { image_url = image_url + 'jpg'; }		// if the URL ends with a dot, slap a file extension on there 
	}
	
	// modify current location, so that when the user clicks "back," they aren't immediately sent forward again
	let modified_url = window.location.href + '#dnr'; 		// add do-not-redirect tag to current URL
	history.replaceState( {foo:'bar'}, 'Do-not-redirect version', modified_url );		// modify URL without redirecting. {foo:'bar'} is a meaningless but necessary state object. 

	// @include is dumb as dirt, but some sites are awful about ?whatever. 
	image_url = encodeURI( image_url ); 		// Executing code with strings from the page has always been a mildly horrifying attack surface - hopefully this defangs it. 
	if( image_url.match( '[?]' ) ) {
		image_url += '&backtrap=' + window.location.href; 
 	} else { 
		image_url += '?backtrap=' + window.location.href; 
	} 
	
	if( simple_redirect ) { window.location.href = image_url; } 		// This has different referral properties than clicking a link or displaying an image, so some sites 403 
	else { location.assign("javascript:window.location.href=\""+image_url+"\";"); } 		// Pixiv-friendly redirect to full image: maintains referral, happens within document's scope.
}		// End of main execution. 





// ----- //			Functions for readability





function extract_image_url_after( string_before_url, url_begins_with ) {		// extract the first quote-delimited string that appears after unique first var and begins with second var
	var html_elements = document.getElementsByTagName('html'); 		// this avoids doing getElementsEtc every time, while accessing the whole page HTML by reference
	var string_index = html_elements[0].innerHTML.indexOf( string_before_url ); 		// find a unique string somewhere before the image URL

	if( string_index > -1 ) {
		var image_index = html_elements[0].innerHTML.indexOf( url_begins_with, string_index ); 		// find where the image URL starts after the unique string
		var delimiter_index = html_elements[0].innerHTML.indexOf( '"', image_index ); 		// find first doublequote after the image URL starts
		image_url = html_elements[0].innerHTML.substring( image_index, delimiter_index ); 		// grab the image URL up to the next doublequote 
	}
//	return image_url;		// Debug
} 

function reload_if( error_string ) { 
	// Put reload on a delayed thread  so that errors in the get-an-image-URL part can fail safely. 
	if( document.body.innerHTML.match( error_string ) ) { 		// Look for a string indicating the page failed to load 
		page_failed = true; 		// Prevent spurious redirection.  
		setTimeout( function() { location.reload(); }, Math.floor((Math.random() * 10) + 1) * 1000 );
		// 1s-10s pause. Most errors will be 503s, so let's avoid hammering the site like a naive spider. 
	} 
} 

function get_link_with_text( string_in_text ) {
//	image_url = Array.from( document.querySelectorAll( 'a' ) ).find( a => a.textContent.match( string_in_text ) ).href; 	// Goddamn TypeErrors. 
	let link = Array.from( document.querySelectorAll( 'a' ) ).find( a => a.textContent.match( string_in_text ) );
	if( link ) { image_url = link.href; } 
}

// Sensible "are we on this site or not?!" function. 
function domain( ending ) { 
	let want = ending.split( '.' ).reverse(); 		// Reverse order, from TLD to domain to subdomain(s). 
	let have = document.domain.split( '.' ).reverse();
	for( let n = 0; n < want.length; n++ ) {
		if( want[n] != have[n] ) { return false; } 
	} 	// Implicit else
	return true; 
} 





// ----- //			Functions for individual websites (separated for being especially long)





// https://www.deviantart.com/ayyk92/art/Descendant-877593691 
// https://www.deviantart.com/mogucho/art/Tamamo-477314551
// https://www.deviantart.com/josephbiwald/art/Destiny-2-Warmind-Secondary-Keyart-804940104
// https://www.deviantart.com/eranfowler/art/The-Lady-Amalthea-856508599
// https://www.deviantart.com/thecynicalhound/art/Tofauti-Sawa-169-781760760
// https://www.deviantart.com/thecynicalhound/art/Jackson-Journal-Doll-607221470
// https://www.deviantart.com/thecynicalhound/art/Careful-Try-Not-To-Fall-In-608595475
function scrape_deviantart() { 
	// I hate this website so fucking much. 

	// Download links only work when logged-in. 
	image_url = document.querySelector( 'a[download]' ); 
	if( image_url && ! image_url.href.match( '/outgoing' ) ) { 		// Local download link? Use it. 
		image_url = image_url.href; 
		return; 
	} 

	preview = document.querySelector( 'div[draggable] img' );
	if( getComputedStyle( preview ).cursor != 'zoom-in' ) { 		// Small image, no zoom. 
		// Old method: 
		image_url = ( document.querySelector( 'link[href*="token="]' ) || { href: '' } ).href; 
		if( image_url == '' ) { 
			image_url = Array.from( document.head.getElementsByTagName( 'meta' ) )
				.filter( meta => meta.content.match( 'fullview' ) )[0].content; 
		} 
	} 

	if( parseInt( window.location.pathname.split( '-' ).pop() ) < 790677561 ) { 		// Old submissions. 
		image_url = document.head.querySelector( 'link[rel="preload"][as="image"]' ).href; 
		f_portion = image_url.match( /(\/f\/[^\/]+\/[^\/]+)\// ); 		// [ 'f/1234/abcd/', 'f/1234/abcd' ] 
		if( f_portion ) { 
			image_url = image_url.split( f_portion[1] )[0] + f_portion[1]; 
			image_url = image_url.replace( '/f/', '/intermediary/f/' ); 
		}
	} else { 		// New submissions. 
		// General solution: click the damn preview and wait for the good version. 
		interval_handle = setInterval( () => { 
			document.querySelector( 'div[draggable] img' ).click(); 		// Click to zoom. 
			if( image_url = document.querySelector( 'div[role="dialog"] img' ) ) {
				image_url = image_url.src.replace( /,q_\d+/, ',q_100' );  		// Quality fix, e.g. ",q_75". 
				redirect(); 
			} 
		}, 200 ); 
		// If there is no zoomed version, image_url is already set, so we'll redirect to that. 
	} 
}




function scrape_inkbunny() {
	if( !document.querySelector( '#files_area' ) || window.location.hash ) { 		// Ignore multi-image submissions' landing pages. Otherwise, redirect. 
		image_url = document.querySelector( '.magicboxParent a' ).href; 
	}
	wait_for_dnr = true; 
	simple_redirect = true; 
}

// Furrynetwork is a joke because every single page has the same HTML. We have to use the DOM, but on an unknown delay, because these fools were too clever to just deliver a goddamn document. 
function scrape_furrynetwork() {
	let link_list = Array.from( document.getElementsByClassName( 't--reset-link' ) ); 
	if( link_list.length > 0 ) {
		clearInterval( interval_handle ); 		// Once we detect something - anything - stop looping. 
		image_url = link_list[0].href; 		// Safely handling an HTMLcollection, because Javascript is pain. 
		if( image_url !== window.location.href ) { 
			// Fuck it, copy-paste for now. This can't just 'return' because it's faux-parallel. 
			let modified_url = window.location.href + '#dnr'; 		// add do-not-redirect tag to current URL
			history.replaceState( {foo:'bar'}, 'Do-not-redirect version', modified_url );		// modify URL without redirecting. 
			window.location.href = image_url; 
		}
	}
}

// Miraculously, Ugoira stuff still works. 
function scrape_pixiv() { 
	// If this is a redirect page, just fucking redirect. Test case: 
	// https://www.pixiv.net/member_illust.php?mode=medium&illust_id=72946956#dnr 
	if( window.location.href.match( 'jump.php?' ) ) { 
		extract_image_url_after( 'noopener noreferrer', 'http' ); 
		simple_redirect = true; 
		assume_extension = false; 
		return; 		// Skip all this other stuff
	}

	// How does the non-simple redirect manage to put the code into the address but then not work? The page displays the URL as text. 
	// But if you highlight the address bar and hit enter, it actually goes to that URL, like on any other dang website. 
	// I want some variation on history.replaceState that forces us to -go- to the same page. Maybe push to 'forward' and then 'go forward.' 

	let submission = window.location.href.split( '/' ).pop().split( '#' )[0]; 		// E.g. https://www.pixiv.net/en/artworks/12345#etc -> 12345 
	fetch( 'https://www.pixiv.net/ajax/illust/' + submission, { credentials: 'include' } ).then( response => response.text() ).then( text => { 
		// Thanks again to Pixiv Plus for identifying the relevant JSON at a predictable URL. 
		let pixiv_data = JSON.parse( text ).body; 		// There's probably more direct way to 'JSON.parse( url )'. It's why JSON exists. 
		image_url = pixiv_data.urls.original; 
		if( pixiv_data.pageCount > 1 ) { image_url = ''; } 		// Don't redirect to a single image if this is a multi-image "manga" submission. 

		// Bringing back Ugoira / Ugoku animation links in the absence of the pixiv.context object required cleverness, research, and then giving up and reading Pixiv Plus's source.
		// So thanks and kudos to those guys for finding a page JSON file that points to an ugoira JSON file that names a URL that's basically just the image URL plus "ugoira."
		// E.g.  '/ajax/illust/65423021' and 'ajax/illust/65423021/ugoira_meta' are the JSON for id=65423021. The latter names several ZIP files.
		// So basically this takes 
			// https://i.pximg.net/img-original/img/2017/10/14/06/24/30/65423021_ugoira0.jpg and outputs 
			// https://i.pximg.net/img-zip-ugoira/img/2017/10/14/06/24/30/65423021_ugoira1920x1080.zip then links to that instead of redirecting.
			// I don't actually know if all sizes are universal. 600x600 seems to be the baseline. Do they ever top 1920x1080?
			// See if globalInitData contains any ugoira information. (Doesn't appear so.) 
		if( image_url.indexOf( 'ugoira' ) > -1 ) { 	
			var animation_url = image_url.split( 'ugoira0' )[0]; 		// E.g. 65423021_ugoira0.jpg -> 65423021_
			animation_url = animation_url + 'ugoira1920x1080.zip'; 		// E.g. 65423021_ -> 65423021_ugoira1920x1080.zip
			animation_url = animation_url.replace( 'img-original', 'img-zip-ugoira' ); 		// Middle bit in the URL. Same server, different directory. 
			animation_url = animation_url.split( '\\' ).join( '' ); 		// Remove all escaping backlashes. Should be decodeURI, but that sometimes leaves a trailing backslash. 

			var download_string = '<a style="text-decoration:none" href="' + animation_url + '">Download Ugoira animation frames (.zip)</a>';  
			// Can I give this a class such that it matches the original appearance? Pixiv is such a mess. 

			// All this frustrating bullshit just to insert a link:
			var download_interval = setInterval( function() {
				// Repeatedly check until the clientside nonsense page generates its "figcaption" element
				if( document.getElementsByTagName( 'figcaption' ) && !document.getElementById( 'download_link' ) ) {
					var temp_html = document.getElementsByTagName( 'figcaption' )[0].innerHTML;

					// Complete jank: insert the download link, as a string, immediately following the h1 tag. 
					// Would be "more correct" to do this with string.slice. 
					// I don't know where those commas come from. 
					var split_html = temp_html.split( '</h1>' ); 
					split_html.splice( 1, 0, '</h1>' + download_string ); 		// Surprise, this operation has a side effect instead of returning a string. Aristocrats.js. 
					document.getElementsByTagName( 'figcaption' )[0].innerHTML = split_html.join(); 		
					clearInterval( download_interval ); 		// Can I clear the interval variable, from inside the interval? Is JS that friendly about sloppy global variables? Apparently so! 
				} 
			}, 1000 )
			image_url = ''; 		// Don't redirect on animated images. 
		}

		redirect();		// We have to do this manually now, since we're in a callback. 
	} )
}

// Maybe clean this up now that Gelbooru's stupid shit gets its own function. 
function scrape_booru() {		// this works on a wide variety of booru-style imageboards. 
	reload_if( '<h1>503' ); 
	extract_image_url_after( '>Resize image</a>', 'http://' );		// for booru's which have automatic resizing and images which require it
	// Gelbooru's anti-adblock shit might make the script fail the FIRST time you load a page, but not subsequent times. God dammit. 
	// Might be time for Gelbooru to get its own scrape function, because god damn. 
	extract_image_url_after( "$('edit_form')", '//' ); 		// For booru's with automatic resizing on, use the Original Image link, which appears after the Edit button
	if( image_url === '' ) { extract_image_url_after( "$('resized_notice')", '//' ); } 		// Hey guess what! Gelbooru now serves different sidebars for adblock. Fuck you!
	if( image_url === '' ) { extract_image_url_after( 'class="showEditBox">', '//' ); } 		// Hey guess what!!! Gelbooru now just tells you not to adblock! Fuuuck youuu! 
	if( image_url === '' ) {		// otherwise, use the image that's being displayed 
		var container = document.getElementById( 'image' ); 		// Instead of lurching through raw HTML, let's just grab the display image via the DOM. 
		image_url = container.src; 		// "You think it's cool that things don't always have to be a federal fucking issue." 
	} 
}

// Finding images is pretty easy, but multi-image submissions need special handling. 
// Simply not redirecting on multi-image submissions is insufficient because the dang images ought to link to themselves. 
// https://www.newgrounds.com/art/view/relatedguy/sniper-s-precision - multi-image example. 
function scrape_newgrounds() { 
	extract_image_url_after( 'full_image_text', '\\/\\/' ); 
	image_url = image_url.split('\\').join(''); simple_redirect = true; 		// Un-escape URL 

	if( window.location.href.match( 'portal' ) ) { 		// If this is a video, grab the video. 
		image_url = embed_controller.getFileURL(); 		// Okay sure why not. 
	} 

	if( document.body.innerHTML.match( 'data-user-image' ) ) { 		// If the submission has multiple images:
		image_url = ''; 		// Do not redirect 
		// Link all subsequent images to themselves for easy middle-clicking. Oh, of course this requires a delay. Why make things easy? 
		// Naturally this causes problems, but only after I've uploaded the update. "Testing indicates the presence of bugs but not their absence." 
		// Images don't have a src defined until they're onscreen. Yeesh. No data either. Does Newgrounds just bodge a URL from the alt-text filename? 
		// New plan: avoid modifying images unless they're ready, mark images when they've been modified, and stop looping when modified count == relevant image count. 
		var interval_object = setInterval( function() { 
/*
			Array.from( document.body.getElementsByTagName( 'img' ) ) 
				.filter( img => img.className == "media-block-center" && img.src != '' ) 		// Implicitly excludes glutton-linked. 
				.forEach( img => { 
					img.className += " glutton-linked"; 
					img.outerHTML = "<a href='" + img.src + "'>" + img.outerHTML + "</a>"; 
				} ); 
*/
			Array.from( document.body.querySelectorAll( 'img.media-block-center[src]:not(.glutton-linked)' ) ) 
				.forEach( img => {
					img.classList.add( 'glutton-linked' ); 
					img.outerHTML = "<a href='" + img.src + "'>" + img.outerHTML + "</a>" 
				} )
			if( document.body.getElementsByClassName( 'media-block-center' ).length == document.body.getElementsByClassName( 'glutton-linked' ).length ) { 
				clearInterval( interval_object ); 		// Relying on a global variable is sloppy design, but so is requiring a variable to let an interval unset itself. 
			}
		}, 1000 ); 
	} 
}







/*
Test suite of random URLs from the relevant sites: 
http://www.hentai-foundry.com/pictures/user/Bottlesoldier/133840/Akibabuse
http://www.hentai-foundry.com/pictures/user/Bottlesoldier/214533/Lil-Gwendolyn
https://inkbunny.net/submissionview.php?id=483550
https://inkbunny.net/submissionview.php?id=374519
http://rule34.xxx/index.php?page=post&s=view&id=1399731
http://rule34.xxx/index.php?page=post&s=view&id=1415193
http://equi.booru.org/index.php?page=post&s=view&id=56940
http://furry.booru.org/index.php?page=post&s=view&id=340299
http://derpibooru.org/470074?scope=scpe80a78d33e96a29ea172a0d93e6e90b47c6a431ea
http://mspabooru.com/index.php?page=post&s=view&id=131809
http://mspabooru.com/index.php?page=post&s=view&id=131804
http://shiniez.deviantart.com/art/thanx-for-5-m-alan-in-some-heavy-makeup-XD-413414430
http://danbooru.donmai.us/posts/1250724?tags=dennou_coil
http://danbooru.donmai.us/posts/1162284?tags=dennou_coildata:text/html,<img src='http://example.com/image.jpg'>
http://www.furaffinity.net/view/12077223/
http://gamesbynick.tumblr.com/post/67039820534/the-secrets-out-guys-the-secret-is-out
http://honeyclop.tumblr.com/post/67122645946/stallion-foursome-commission-for-ciderbarrel-d
http://shubbabang.tumblr.com/post/20990300285/new-headcanon-karkat-is-ridiculously-good-at

http://www.furaffinity.net/view/12092394/
https://e621.net/post/show?md5=25385d2349ae11f2057874f0479422ad
http://sandralvv.tumblr.com/post/64933897836/how-did-varrick-get-that-film-cuz-i-want-a-copy
*/	
