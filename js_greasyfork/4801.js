// ==UserScript==
// @name        Eza's Tumblr Scrape
// @namespace   https://inkbunny.net/ezalias
// @description Creates a new page showing just the images from any Tumblr 
// @license     MIT
// @license     Public domain / No rights reserved
// @include     http://*?ezastumblrscrape*
// @include     https://*?ezastumblrscrape*
// @include     http://*/ezastumblrscrape*
// @include     http://*.tumblr.com/
// @include     https://*.tumblr.com/
// @include     http://*.tumblr.com/page/*
// @include     https://*.tumblr.com/page/*
// @include     http://*.tumblr.com/tagged/*
// @include     https://*.tumblr.com/tagged/*
// @include     http://*.tumblr.com/search/*
// @include     https://*.tumblr.com/search/*
// @include     http://*.tumblr.com/post/*
// @include     https://*.tumblr.com/post/*
// @include     https://*.media.tumblr.com/*
// @include     https://media.tumblr.com/*
// @include     http://*/archive
// @include     https://*/archive
// @include     http://*.co.vu/*
// @exclude    */photoset_iframe/*
// @exclude    *imageshack.us*
// @exclude    *imageshack.com*
// @exclude    *//scmplayer.*
// @exclude    *//wikplayer.*
// @exclude    *//www.wikplayer.*
// @exclude    *//www.tumblr.com/search*
// @grant        GM_registerMenuCommand
// @version     5.17
// @downloadURL https://update.greasyfork.org/scripts/4801/Eza%27s%20Tumblr%20Scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/4801/Eza%27s%20Tumblr%20Scrape.meta.js
// ==/UserScript==



// Create an imaginary page on the relevant Tumblr domain, mostly to avoid the ridiculous same-origin policy for public HTML pages. Populate page with all images from that Tumblr. Add links to this page on normal pages within the blog. 

// This script also works on off-site Tumblrs, by the way - just add /archive?ezastumblrscrape?scrapewholesite after the ".com" or whatever. Sorry it's not more concise. 



// Make it work, make it fast, make it pretty - in that order. 

// TODO: 
// I'll have to add filtering as some kind of text input... and could potentially do multi-tag filtering, if I can reliably identify posts and/or reliably match tag definitions to images and image sets. 
	// This is a good feature for doing /scrapewholesite to get text links and then paging through them with fancy dynamic presentation nonsense. Also: duplicate elision. 
	// I'd love to do some multi-scrape stuff, e.g. scraping both /tagged/homestuck and /tagged/art, but that requires communication between divs to avoid constant repetition. 
// post-level detection would also be great because it'd let me filter out reblogs. fuck all these people with 1000-page tumblrs, shitty animated gifs in their theme, infinite scrolling, and NO FUCKING TAGS. looking at you, http://neuroticnick.tumblr.com/post/16618331343/oh-gamzee#dnr - you prick. 
	// Look into Tumblr Saviour to see how they handle and filter out text posts. 
// Add a convenient interface for changing options? "Change browsing options" to unhide a div that lists every ?key=value pair, with text-entry boxes or radio buttons as appropriate, and a button that pushes a new URL into the address bar and re-hides the div. Would need to be separate from thumbnail toggle so long as anything false is suppressed in get_url or whatever. 
	// Dropdown menus? Thumbnails yes/no, Pages At Once 1-20. These change the options_map settings immediately, so next/prev links will use them. Link to Apply Changes uses same ?startpage as current. 
	// Could I generalize that the way I've generalized Image Glutton? E.g., grab all links from a Pixiv gallery page, show all images and all manga pages. 
	// Possibly @include any ?scrapeeverythingdammit to grab all links and embed all pictures found on them. single-jump recursive web mirroring. (fucking same-domain policy!) 
// now that I've got key-value mapping, add a link for 'view original posts only (experimental).' er, 'hide reblogs?' difficult to accurately convey. 
	// make it an element of the post-scraping function. then it would also work on scrape-whole-tumblr. 
	// better yet: call it separately, then use the post-scraping function on each post-level chunk of HTML. i.e. call scrape_without_reblogs from scrape_whole_tumblr, split off each post into strings, and call soft_scrape_page( single_post_string ) to get all the same images. 
		// or would it be better to get all images from any post? doing this by-post means we aren't getting theme nonsense (mostly). 
	// maybe just exclude images where a link to another tumblr happens before the next image... no, text posts could screw that up. 
	// general post detection is about recognizing patterns. can we automate it heuristically? bear in mind it'd be done at least once per scrape-page, and possibly once per tumblr-page. 
// user b84485 seems to be using the scrape-whole-site option to open image links in tabs, and so is annoyed by the 500/1280 duplicates. maybe a 'remove duplicates' button after the whole site's done?
	// It's a legitimately good idea. Lord knows I prefer opening images in tabs under most circumstances.  
	// Basically I want a "Browse Links" page instead of just "grab everything that isn't nailed down." 
// http://mekacrap.tumblr.com/post/82151443664/oh-my-looks-like-theres-some-pussy-under#dnr - lots of 'read more' stuff, for when that's implemented. 
// eza's tumblr scrape: "read more" might be tumblr standard. 
	// e.g. <p class="read_more_container"><a href="http://ladylovelycocks.tumblr.com/post/66964089115/stupid-comic-continued-under-readmore-more" class="read_more">Read More</a></p> 
	// http://c-enpai.tumblr.com/ - interesting content visible in /archive, but every page is 'themed' to be a blank front page. wtf. 
// chokes on multi-thousand-page tumblrs like actual-vriska, at least when listing all pages. it's just link-heavy text. maybe skip having a div for every page and just append to one div. or skip divs and append to the raw document innerHTML. it could be a memory thing, if ajax elements are never destroyed. 
	// multi-thousand-page tumblrs make "find image links from all pages" choke. massive memory use, massive CPU load. ridiculous. it's just text. (alright, it's links and ajax requests, but it's doggedly linear.) 
	// maybe skip individual divs and append the raw pile-of-links hypertext into one div. or skip divs entirely and append it straight to the document innerHTML.
	// could it be a memory leak thing? are ajax elements getting properly released and destroyed when their scope ends? kind of ridiculous either way, considering we're holding just a few kilobytes of text per page. 
	// try re-using the same ajax object. 
/* Assorted notes from another text file
. eza's tumblr fixiv? de-style everything by simply erasing the <style> block. 
. eza's tumblr scrape - test finishing whole page for displaying updates. (maybe only on ?scrapewholesite.) probably not too smart, but an interesting benchmark. only ever one document.body.innerHTML=thing;. 
. eza's tumblr scrape: definitely do everything-at-once page write for thumbnail/browse mode. return one list of urls per page, so e.g. ten separate lists. remove duplicates between all lists. then build the page and do a single html write. prior to that, write 'fetching pages...' or something. it should be pretty quick. it's not like it's terribly responsive when loading pages anwyay. scrolling doesn't work right. 
	. thinking e.g. http://whatdoesitlumpingmean.tumblr.com/archive?startpage=1?pagesatonce=10?find=/tagged/my-art?ezastumblrscrape?thumbnails which has big blue dots on every post.
	. see also http://herblesbians.tumblr.com/ with its gigantic tall banners  
	. alternate solution: check natural resolution, don't downscale tiny / narrow images. 
. eza's tumblr scrape: why doesn't the thumbnail page pick up mspadventures.com gifs? e.g. http://kitkaloid.tumblr.com/page/26, with tavros's face being 'dusted.' 
*/
// Soft_scrape_page should return non-image links from imgur, deviantart, etc., then collect them at the bottom of the div in thumbnail mode. 
	// links to embedded videos? linkdump at top, just below the /page link. looks like https://www.tumblr.com/video_file/119027046245/tumblr_nlt061qtgG1u32sbu/480 - e.g. manyakis.tumblr. 
// Tumblr has a standard mobile version. Fuck me, how long has that been there? example.tumblr.com/mobile, no CSS, bare image links. Shit on the fuck. 
	// Hey hey! This might allow trivial recognition of individual posts and reblogs vs. OC. Via, but no source... weak. Good enough for us, though. 
	// Every post is between a <p> and </p>, but can contain <p></p> blocks inside. Messy.
	// Reblogs say "(via <a href='http//example.tumblr.com/123456'>example</a>)" and original posts don't. 
	// Dates are noted in <h2> blocks, but they're outside any <p> blocks, so who cares. 
	// Images are linked (all in _500, grr, but we can obviously deal with that) but posts aren't. Shame. That would've been useful. 
	// Shit, consider the basics... do tags works? Pagination is just /mobile/page/2, etc. with tags: example.tumblr.com/tagged/homestuck/page/2/mobile. 
	// Are photosets handled correctly? What about read-more links? Uuugh, photosets just appear as "[video]". Literally that text. No link. Fuck! So close, aaand useless. 
	// I can use /mobile instead of /archive, but there's no point. It breaks favicons and I still have to fetch the fat-ass normal pages. 
	// I can probably use mobile pages to match normal pages, since they... wait, are they guaranteed to have the same post count? yes. alice grove has one post per page. 
		// So to find original posts, I have to fetch both normal and mobile pages, and... shit, and consistently separate posts on normal pages. It has to be identical. 
	// I can also use mobile for page count, since it's guaranteed to have forward / backward links. Ha! We can start testing at 100! 
	// Adding /mobile even works on individual posts. You can get a via link from any stupid theme. Yay. 
		// Add "show via/source links" or just "visit mobile page" as a Greasemonkey action / script command? 
	// Tumblr's own back/forward links are broken in the mobile theme. Goes to: /mobile/tagged/example. Should go to: /tagged/example/mobile. Modify those pages. 
// 	http://thegirlofthebeach.tumblr.com/archive - it's all still there, but the theme shows nothing but a 'fuck you, bye' message. 
	// Pages still provide an og:image link. Unfortunately, that's a single image, even for photosets. Time to do some reasoning about photoset URLs and their constituent image URLs. 
	// Oh yeah - mobile. That gives us a page count, at least, but then photosets don't provide even that first image. 
	// Add a tag ?usemobile for using /mobile when scraping or browsing images. 
	// To do when /archive works and provides photosets in addition to /mobile images: http://fotophest.tumblr.com
	// Archive does allow seeking by year/month, e.g. http://fotophest.tumblr.com/archive/2012/4 
	// example.tumblr.com/page/1/mobile always points to example.tumblr.com. Have to do example.tumblr.com/mobile. Ugh. 
// Archival note: since Tumblr images basically never disappear, it SHOULD suffice to save the full scrape of a blog into a text file. I don't need to temporarily mass-download the whole image set, as I've been doing. 
	// Add "tagged example" to title for ?find=/tagged/example, to make this easier. 
	// Make a browser for these text files. Use the image-browser interface to display ten pages at once (by opening the file via a prompt, since file:// would kvetch about same-origin policy.) Maintain page links.
	// Filter duplicates globally, in this mode. No reason not to. 
// Use ?lastpage or ?end to indicate last detected page. (Indicate that it's approximate.) I keep checking ?scrapewholesite because I forget if I'm blowing through twenty pages or two hundred. 
// Given multiple ?key=value definitions on the same URL, the last one takes precedence. I can just tack on whatever multiple options I please. (The URL-generating function remains useful for cleanliness.) 
// Some Tumblrs (e.g. http://arinezez.tumblr.com/) have music players in frames. I mean, wow. Tumblr is dedicated to recreating every single design mistake Geocities allowed. 
	// This wouldn't be a big deal, except it means the address-bar URL doesn't change when you change pages. That's a hassle. 
// Images with e.g. _r1_1280 are revisions? See http://actual-vriska.tumblr.com/post/32788651941/ vs. its source http://cancerousaquarium.tumblr.com/post/32784513645/ - an obvious watermark has been added. 
	// Tested with a few random _r1 images from a large scrape's textfile. Some return XML errors ('no associated stylesheet') and others 404. Mildly interesting at best. 
// Aha - now that we have an 'end page,' there can be a drop down for page selection. Maybe also for pages-at-once? Pages 1-10, 11-20, 21-30, etc. Pages at once: 1, 5, 10, 20/25? 
// Possibly separate /post/ links, since they'll obviously be posts from that page. (Ehh, maybe not - I think e.g. Promstuck links to a "masterpost" in the sidebar.) 
	// Maybe hide links behind a button instead of ignoring them entirely? That way compactness is largely irrelevant. 
	// Stick 'em behind a button? Maybe ID and Class each link, so we can GetElementsByClassName and this.innerText = this.href. 
	// If multi-split works, just include T1 / O1 links in-order with everything else. It beats scrolling up and guessing, even vs page themes that suck. 
		// No multi-split. I'd have to split on one term, then foreach that array and split for another term, then combine all resulting arrays in-order. 
		// Aha: there IS multi-splitting, using regexes as the delimiter. E.g. "Hello awesome, world!".split(/[\s,]+/); for splitting on spaces and commas. 
		// Split e.g. src=|src="|src=', then split space/singlequote/doublequote and take first element? We don't care what the first terminator is; just terminate. 
// How do YouTube videos count? E.g. http://durma.tumblr.com/post/57768318100/ponponpon%E6%AD%8C%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%9F-verdirk-by-etna102
	// Another example of off-site video: http://pizza-omelette.tumblr.com/post/44128050736/2hr-watch-this-its-very-important-i-still
// Some themes have EVERY post "under the cut," e.g. http://durma.tumblr.com/. Photosets show up. Replies to posts don't. ?usemobile should get some different stuff. 
// Brute-force method: ajax every single /post/ link. Thus - post separation, read-more, possibly other benefits. Obvious downside is massive latency increase. 
	// Test on e.g. akitsunsfw.tumblr.com with its many read-more links. 
	// Probably able to identify new posts vs. reblogs, too. Worth pursuing. At the very least, I could consistently exclude posts whose mobile versions include via/source. 
// <!-- GOOGLE CAROUSEL --><script type="application/ld+json">{"@type":"ItemList","url":"http:\/\/crystalpei.com\/page\/252","itemListElement":[{"@type":"ListItem","position":1,"url":"http:\/\/crystalpei.com\/post\/30638270842\/actually-this-is-a-self-portrait"}],"@context":"http:\/\/schema.org"}</script>
	// <link rel="canonical" href="http://crystalpei.com/page/252" />
	// Does this matter? Seems useful, listing /post/ URLs for this page. 
// 10,000-page tumblrs are failing with ?showlinks enabled. the text gets doubled-up. is there a height limit for firefox rendering a page? does it just overflow? try a dummy function that does no ajax and just prints many links. 
	// There IS a height limit! I printed 100 lines of dummy text for 10,000 pages, and at 'page' 8773, the 27th line is halfway offscreen. I cannot scroll past that. 
	// Saving as text does save all 10,000 pages. So the text is there... Firefox just won't render it. 
	// Reducing text size (ctrl-minus) resulted in -less- text being visible. Now it ends at 8729.  
// http://shegnyanny.tumblr.com/ redirects to https://www.tumblr.com/dashboard/blog/shegnyanny - from every page. But it's all still there! Fuck, that's aggravating! 
	// DaveJaders needs that dashboard scrape treatment. Ditto lencrypted. 
// I need a 'repeatedly click 'show more notes' function' and maybe that should be part of this script. 
// 1000+ page examples: http://neuroticnick.tumblr.com/ -  http://teufeldiabolos.co.vu/ - http://actual-vriska.tumblr.com/ - http://cullenfuckers.tumblr.com/ - http://soupery.tumblr.com - http://slangwang.tumblr.com - some with 10,000 pages or more. 
// JS 2015 has "Fetch" as standard? Say it's true, even if it's not! 
	// The secret to getting anything done in-order seems to be creating a function (which you can apparently do anywhere, in any scope) and then calling that_function.then. 
	// So e.g. function{ do_stuff( fetch(a).etc ) }, followed by do_stuff().then{ use results from stuff }. 
	// Promise.all( iterable ), ahhhh. 
	// Promise.map isn't real (or isn't standard?) but is just Promise.all( array.map( n => f(n) ). Works inside "then" too. 
// setTimeout( 0 ) is a meaningful concept because it pushes things onto the event queue instead of the stack, so they'll run in-order when the stack is clear.
// Functions can be passed as arguments. Just send the name, and url_array=parse( body, look_for_videos ) allows parse(body,func) to do func( body ) and find videos. 
// Test whether updating all these divs is what keeps blocking and hammering the CPU. Could be thrashing? It's plainly not main RAM. Might be VRAM. Test acceleration. 
	// Doing rudimentary benchmarking, the actual downloading of pages is stupid fast. Hundreds per minute. All the hold-up is in the processing. 
	// Ooh yeah, updating divs hammers and blocks even when it's just 'pagenum - body.length.' 
		// Does body.length happen all at once? JS in FF seems aggressively single-threaded.
		// Like, 'while( array.shift )' obviously matches a for loop with a shift in it, but the 'while' totally locks up the browser. 
		// Maybe it's the split()? I could do that manually with a for loop... again. Test tall div updating with no concern for response content. 
	// Speaking of benchmarks, forEach is faster than map. How in the hell? It's like a 25% speed gain for what should be a more linear process. 
	// ... not that swapping map and forEach makes a damn bit of difference with the single-digit milliseconds involved here. 
	// Since it gets worse as the page goes on, is it a getElementById thing? 
	// Editing the DOM doesn't update an actual HTML file in memory (AFAIK), but you're scanning past 1000-odd elements instead of, like, 2. 
// Audio files? Similar to grabbing videos. - http://joeckuroda.tumblr.com/post/125455996815 - 
// Add a ?chrono option that works better than Tumblr's. Reverse url_array, count pages backwards, etc. 
	// Maybe just ?reverse for per-page reversal of url_array. Lazy option.  
// http://crotah.tumblr.com desperately needs an original-posts filter. 
// I can't return a promise to "then." soft_scrape returns promise.all(etc).then(etc). You can soft_scrape(url).then, but not .then( s=>soft_scrape(s) ).then. Because fuck you. 
	// I'm frothing with rage over this. This is a snap your keyboard in half, grab the machine by the throat, and scream 'this should work' problem.
	// I know you can return a promise in a 'then' because that's the fucking point of 'then.' It's what fetch's response.text() does. It's what fetch does! 
// Multi-tag scraping requires post-level detection, or at least, post enumeration instead of image enumeration.
	// Grab all /post/ links in /tagged/foo, then all /post/ links in /tagged/bar, then remove duplicates. 
	// Sort by /post/12345 number? Or give preference to which page they appear on? The latter could get weird. 
	// CrunchCaptain has no /post/ links. All posts are linked with tmblr.co shortened URLs. Tumblr, you never cease to disappoint me. 
// What do I want, exactly? What does innovation look like here?
	// Not waiting for page scrapes. Scrapewholesite, then store that, and compose output as needed. 
		// Change window.location to match current settings, so they're persistent in the event of a reload. Fall back to on-demand page scraping if that happens. 
		// Maybe a 100-page limit instead of 1000, at least for this ?newscrape or ?reduxmode business. 
	// Centered UI, for clarity. Next and Previous links side-aligned, however clumsily. Touch-friendly because why not. 
	// Dropdowns for options_map. Expose more choices. 
	// Post-level splitting? Tags? Maybe Google Carousel support backed up by hacky fakery. 
		// I want to be able to grab a post URL while I'm looking at the image in browse mode. 
		// On-hover links for each image? Text directly below images? CSS nightmares, but presumably tractable. 
	// What I -really- want - what this damn script was half-invented for - is eliminating reblogs. Filtering down to only original posts. (Or at least posts with added content.) 
		// Remember that mobile mode needs special consideration. (Which could just be 'for each img' if mobile's all it handles.) 
	// Maybe skip the height-vs-width thumbnail question by having user options a la Pixiv Fixiv. Just slap more options into the CSS and change the body's class. 
// GM menu commands for view-mobile, view-embed, and google-alternate-source? 
// I'm overthinking this. Soft scrape: grab each in-domain /post/ link, scrape it, display its contents. The duplicate-finder will handle the crud. 
	// Can't reliably grab tags from post-by-post scraping because some people link their art/cosplay tags in their theme. Bluh. 
// http://iloveyournudity.tumblr.com/archive?ezastumblrscrape?scrapewholesite?find=/?grabrange=1001?lastpage=2592 stops at page 1594. rare, these days. 
// Could put the "Post" text over images, if CSS allows some flag for 'zero width.' Images will always(ish) be wider than the word "Post." 
	// Nailed it, more or less, thanks to https://www.designlabthemes.com/text-over-image-with-css/
	// Wrapping on images vs. permalink, and the ability to select images sensibly, are highly dependent on the number and placement of spaces in that text block. 
	// Permalink in bar across bottom of image, or in padded rectangle at bottom corner? I'm leaning toward bar. 
	// ... I just realized this breaks 'open in new tabs.' You can't select a bunch of images and open them because you open the posts too.
		// Oh well. 'Open in new tabs' isn't browser-standard, and downthemall selection works fine. 
// InkBunny user Logitech says the button is kind of crap. It is. I think I said I'd fix it later a year ago. 
// Holy shit, Tumblr finally updated /mobile to link to posts. Does it include [video] posts?! ... no. Fuck you, Tumblr. 
// Y'know, if page_dupe_hash tracked how many times each /tagged/ URL was seen, it'd make tag tracking more or less free. 
	// If I used the empty-page fetch to prime page_dupe_hash with negative numbers, I could count up to 0 and notice when a tag is legitimately part of a post. 
// Should page_number( x ) be a function? Return example.tumblr.com/guff/page/x, but also handle /mobile and so on. 
// Pages without any posts don't get any page breaks. That's almost a feature instead of a bug, but it does stem from an empty variable somewhere. 
// Debating making the 'experimental' post-by-post mode the main mode. It's objectively better in most ways... but should be better in all ways before becoming the standard.
	// For example: new_embedded_display doesn't handle non-1280 images. (They still exist, annoyingly.) 
	// I'm loathe to ever switch more than once. But do I want two pairs of '10 at once' / '1 at once' links? Which ones get bolded? AABB or ABAB? 
	// Maybe put the new links on the other side of the page. Alignment: right. 
	// 'Browse pages' vs. 'Browse posts?' The fact it's -images- needs to prominent. 'Image viewer (pages)' vs. 'Image viewer (posts)?' '100 posts at once?' (Guesstimated.) 
	// Maybe 'many posts at once' vs. 'few posts at once.' Ehhh. 
// The post browser could theoretically grab from /archive, but I'd need to know how to paginate in /archive. 
// The post browser could add right-aligned 'source' links in the permalink bar... and once we're detecting that, even badly, we can filter down to original posts!
	// Mobile mode is semi-helpful, offering a standard for post separation and "via" / "source" links. But: still missing photosets. Arg. 
	// ... and naively you'd miss cases where this tumblr has replied and added artwork. Hmm. 
// Not sure if ?usemobile works with ?everypost. I think it use to, a couple days ago.  
// In "snap rows" mode, max-width:100% doesn't respect aspect ratio. Wide images get squished. 
	// They're already in containers, so it's something like .container .fixed-height etc. Fix it next version. 
	// The concept of 'as big as possible' is annoyingly complicated. I think I need the container to have a max-width... but to fit an image? 
	// Container height fixed, container with max-width, image inside container with 100% container width and height=auto? Whitespace, but whatever. 
	// Container max-height 240px, max-width 100%... then image width 100% of container... then container height to match image inside it? is min-height a thing? 
// Lazy approach to chrono: make a "reverse post order" button. Just re-sort all the numbered IDs. 
// To use the post-by-post scraper for scrapwholesite (or a novel scrapewholesite analog), I guess I'd only have to return 'true' from some Promise.all. 
	// /Post URL, contents, /post URL, contents, repeat. Hide things with divs/spans and they should save to text only when shown. 
// Reverse tag-overview order. I hate redoing a coin-flip decision like that, but it's a serious usability shortcoming. I want to hit End and see the big tags. 
// GM command or button for searching for missing pages? E.g. google.com?q=tumblr+username-hey-heres-some-art if "there's nothing here." 
// http://cosmic-rumpus.tumblr.com/post/154833060516/give-it-up-for-canon-lesbans11-feel-free - theme doesn't show button - also check if this photoset appears in new mode
// The Scrape button fucks up on www.example.tumblr.com, e.g. http://www.fuckyeahhomestuckkids.tumblr.com/tagged/dave_strider
// Easy filter for page-by-page scraper: ?require and hide any images missing the required tag. 
	// Same deal, ?exclude to e.g. avoid dupes. Go through /tagged/homestuck-art and then go through /tagged/hs-art with ?exclude=/tagged/homestuck-art. 
// Oops, Scrape button link shows up in tag overview. Filter for indexOf ?ezastumblrscrape. Also page links. Sloppy on my part. 
	// Also opengraph, wtf? - http://falaxy.tumblr.com/archive?ezastumblrscrape?scrapewholesite?find=/tagged/Gabbi-draws - 15 http://falaxy.tumblr.com/tagged/Gabbi+draws?og=1 - 
// Son of a fuck over the Scrape button - http://ayanak.tumblr.com/ - 'install theme' garbage
// Consider an isolated tag-overview mode for huge tumblrs. Grabbing pages is pretty quick. Processing and displaying them is dog-slow. 
// SCM Player nonsense breaks the Scrape button: http://homestuck-arts.tumblr.com/ 
// In post-by-post interface: 'just this page' next to page links, e.g., 'Page 27 - Scrape just this page' - instead of 'one at once' / 'ten at once' links at top. 
// Tag overview / global duplicate finder - convert everything to lowercase. Tumblr doesn't care. 
// Redux scrapewholesite: format should be post link on one line, then image(s) on following lines, maybe with one or the other indented. 
	// Tags included? This could almost get XML-ish. 
// Holy shit, speaking of XML - http://magpizza.tumblr.com/sitemap1.xml 
	// It's not the first page. That 'breathing-breathless-heaving-breaths' post (9825320766) shows up on page... 647? the fuck? 
	// Good lord, it might be by original post dates. Oh wow. It is. And each file is huge. 500 posts each! 
	// I don't need to parse the XML because the only content inside each structure is a URL and a last-modified date code. 
	// Missing files return a standard "not found" page, like you request /page ten billion. So it's safe. 
	// Obviously this requires (and encourages!) a post-level scraper. 
	// Even 1000-page Tumblrs will only have tens of these compact XML files, so it's reasonable to grab all of them, list URLs, and then fetch in reverse-chrono. 
		// Oh, neverfuckingmind - /sitemap.xml points to all /sitemap#.xml files. Kickass. 
	// Make sure this is standard before getting ahead of yourself. Tispy has it. 'Kinsie' has it, both HTTP. Catfish.co.vu has it. 
		// HTTPS? PunGhostHere has it, but it's empty, obviously. "m-arci-a" has it. I think it's fully standard. Hot dang. 
	// Does it work for tags? Like at all? Useful for ?scrapewholesite regardless. 
		// http://tumblino.tumblr.com/tagged/dercest/sitemap1.xml - not it.
		// http://amigos-americas.tumblr.com/sitemap-pages.xml - is this also standard? side links, custom pages. 
		// /sitemap.xml will list /sitemap-pages if it exists. Ignore it. 
	// Might just need to make a single-page Ajax-y "app" viewer for this. 
// Get the "Scrape" link off of photoset iframes
// Maybe make tag overview point directly to scrape links? Or just add scrape links. 
// Fuck about in the /embed source code, see if there's any kind of /standard post that it's displaying without a theme. 
	// If that's all in the back-end then there's nothing to be done. 
	// http://slangwang.tumblr.com/post/61921070822/so-scandalous/embed
	// https://embed.tumblr.com/embed/post/_tZgwiPCHYybfPeUR0XC9A/61921070822?width=542&language=en_US&did=d664f54e36ba2c3479c46f7b8c877002f3aa5791 
	// Okay so the post ID is in that hot mess of a URL, but there's two high-entropy strings that are probably hidden crap. 
	// Changing the post ID (to e.g. 155649716949, another post on the same blog) does work within the blog, at least for now. 
	// Changing the post ID to posts from other blogs, or to made-up numbers, does not work. "This post is gone now" is the error. Nuts. 
	// "&did" value doesn't matter. Might be my account's ID? The only script in /embed pages mostly registers page-views. 
	// http://sometipsygnostalgic.tumblr.com/post/157273191096/anyway-i-think-that-iris-is-the-hardest-champion/embed
	// https://embed.tumblr.com/embed/post/4RwtewsxXp-k1ReCcdAgXg/157273191096?width=542&language=en_US&did=2098cf23085faa58c1b48d717a4a5072f591adb5
	// Nope, "&did" is different on this sometipsygnostalgic post. 
	// http://sometipsygnostalgic.tumblr.com/post/157273080206/the-role-of-champions-in-the-games-is-confusing/embed
	// https://embed.tumblr.com/embed/post/4RwtewsxXp-k1ReCcdAgXg/157273080206?width=542&language=en_US&did=86e94fe484d6739f7a26f3660bb907f82d600120
	// the _tZg etc. value is probably Tumblr's internal reference to the user. 
	// So I'd only have to get it once, and then I could generate these no-bullshit unthemed URLs based on /post IDs from sitemap.xml. 
	// /embed source code refers to the user-unique ID as the "embed_key". It's not present in /archive, which would've been super convenient. 
		// global.build.js has references to embed_key; dunno if I can just grab it. 
		// It seems like this script should be placing the key in links - data-post-id, data-embed-key, data-embed-did, etc. Just not seeing it in /archive source. 
		// Those data-etc values are in a <ul> (the fuck is a ul?) inside a div with classes like "popover". 
		// One div class="tumblr-post" explicitly links the /embed/post version with the embed_key and post_id. Where is that?
		// post_micro_157274781274 in the link div class ID is just the /post number. What's post_tumblelog_4b5d01b9ddd34b704fef28e6c9d83796 about? 
		// Screw it, it's in every /embed page. Just grab one. (Sadly it does require a real /post ID.) 
		// Pass ?embed_id along in all links, otherwise modes that need it will have to rediscover it. 
		// Don't fetch /archive or whatever. Grab some /post from the already-loaded innerHTML before removing it. 
	// Wait, shit! I can't get embed.tumblr.com because it's on a different subdomain! Bastards! 
		// Nevermind, anything.tumblr.com/embed works. Anything. That's weirdly accomodating. 
			// Seems they broke it before I got around to implementing this. Nerts. 
		// So: grab a post/12345/embed link, get the user id, redirect(?) to some ?embedded=xyz123 url. 
		// embed_key&quot;:&quot;gLSpeeMF7v3RdBncMIHy2w is not hard to find. 
	// The use of sitemap.xml could be transformative to this script, or even split off into another script entirely. It finally allows a standard theme! 
		// Just do it. Entries look like:
		// <url><loc>http://leopha.tumblr.com/post/57593339717/hello-a-friend-found-my-blog-somehow-so-url</loc><lastmod>2013-08-07T06:42:58Z</lastmod></url></urlset>
		// So split on <url><loc> and terminate at </loc>. Or see if JS has native XML parsing, for honest object-orientation instead of banging at text files. 
		// Grab normally for now, I guess, just to get it implemented. Make ?usemobile work. Worry about /embed stuff later. 
		// Check if dashboard-only blogs have xml files exposed. 
	// http://baklavalon.tumblr.com/post/16683271151/theyre-porking-in-that-room needs this treatment, its theme is just the word "poop". 
// Holy shit, /archive div classes include tags like not_mine, is_reblog, is_original, with_permalink, has_source - this is a fucking goldmine. 
// http://miyuli.tumblr.com/archive?startpage=16?pagesatonce=5?thumbnails?find=/tagged/fanart?ezastumblrscrape?everypost?lastpage=22 breaks on:
	// http://miyuli.tumblr.com/tagged/fanart/page/16 
	// http://miyuli.tumblr.com/archive?startpage=16?pagesatonce=5?thumbnails?find=/tagged/fanart?ezastumblrscrape?lastpage=22 - old method works 
	// Could just be dupes from nearby pages? Nope. 
	// Same deal here - http://miyuli.tumblr.com/archive?startpage=36?pagesatonce=5?thumbnails?find=/tagged/original?ezastumblrscrape?everypost?lastpage=39 - breaks:
	// http://miyuli.tumblr.com/tagged/original/page/36
	// http://miyuli.tumblr.com/archive?startpage=36?pagesatonce=5?thumbnails?find=/tagged/original?ezastumblrscrape?lastpage=39 - works 
	// Or... seems to be getting everything, but putting it under the wrong div. "Toggle page breaks" just breaks in the wrong places. Huh. 
	// http://northernvehemence.tumblr.com/archive?startpage=21?pagesatonce=5?thumbnails?ezastumblrscrape?lastpage=42?everypost - everything's there, but misplaced
// a-box.tumblr.com redirects on all pages, but there's still content there. Scrapes normally, though? Good case for embedded links instead of bare /post links. 
// Oddball feature idea: add ?source=[url]?via=[url] for tumblrs with zero hint of content in their URLs. 
	// E.g. if https://milkybee.tumblr.com/post/31692413218 goes missing, I have no fucking idea what's in it. It is a mystery. 
	// Easy answer, from ?everypost - add image URL after permalink. 
// Make ?ezastumblrscrape (no ?scrapewholesite) some kind of idiot-proof landing-page with links to various functions. As always, it's mostly for my sake, but it's good to have.
// /page mode - "Previous/Next (pagesatonce) pages" and also have "Previous/Next 1 page". 
// http://sybillineturtle.tumblr.com/post/138070422744/crookedxhill-cosplay-crookedxhill - I need a way for eza's tumblr scrape to handle these bullshit dashboard-only blogs 
// Oh my god: studiomoh.com/fun/tumblr_originals/?tumblr=TUMBLRNAME returns original posts for TUMBLRNAME.tumblr.com. 
// http / https changes break all the ?key=pair values, but there's not much to be done about it. 
// If I used Tumblr the way normal people do, I'd probably want an image browser for the dashboard. 
	// Is there any sort of sitemap for generic www.tumblr.com/tagged/example pages? 
	// I do almost nothing on the dashboard, but a way to dump entire tags would be fucking incredible. 
// The tag overview is presumably what's causing the huge CPU spike when a long scrapewholesite ends. That or the little "Done" at the top. 
	// Presumed solution: insert those things in whatever way the scraped pages are inserted. Generate divs at the start, I guess. 
	// Failed to have any effect. Am I doing something I should be peppering with setTimeout(0)s? JS multitasking is dumb. 
// Can I do anything for the identifiability of pages with no text after the number? 
	// E.g. woofkind-blog.tumblr.com/post/13147883338 += #tumblr_luzrb2F9Hv1qm6tzgo1_1280.jpg so there's something to go on if the blog dies. 
// Tag overview still picks up other tumblrs, which is okay-ish, but it borks the "X posts" links that go straight to scraping. Filter them. 
// Embed-based scraping could probably identify low-reblog content (low note count) for archival purposes. 
// Options_url() seems to add an extra question mark to the end of every URL. Doesn't break anything; just weird. 
// sarahfuarchive needs that /embed-based scrape. ?usemobile is a band-aid. 
// Okay, so the "Done." does generate a newline when it appears. Added a BR and crossed my fingers. 
	// Is it just the tag overview? Is it just the huge foreach over page_dupe_hash? 
	// Lag sometimes happens in the middle of a long scrape. If it's painting-related, maybe it's from long URLs forcing the screen to become wider. 
// Consider fetching groups of 10 instead of 25 when grabbing in the high thousands. Speed is not an issue, and Tumblr seems to lag more for 'deeper' pages. 
// Consider newline after bottom-div prev/next buttons, because popup url notifiers are fucking garbage. Put it back in my status bar, Firefox. That's what it's for. 
// "Tumblr Image Size" is no longer maintained (where'd I even get it?) and should maybe be folded into this script. Ajax instead of fetch because we'd only look for error?
	// Maybe as part of Image Glutton. Also include Twitter :large or :orig nonsense. 
// Pretty sure I can use that embed.tumblr view in ?scrapemode=everypost just by futzing the permalink URLs. Make it separate there, like ?usemobile. 
	// Also change embedded tags to search THIS domain instead of linking to general Tumblr searches. What even. 
	// czechadamick.tumblr.com as an example with no tags anywhere 
// I should really test for photosets that might not appear. Maybe some ?verbose mode where it links anything that looks like a URL. 
// Is there any way to resize inline images? They're so tiny!
	// http://static.tumblr.com/8781b0eeeb05c5d67462fb52fb349b45/zpdyuqm/LQ4ojqrq2/tumblr_static_bcae2zpugw000c0sog404804k.png - this one is huge!
	// https://66.media.tumblr.com/a38c7bd5148aded5494d4f8a70fce217/tumblr_inline_mlqzd2xLoZ1qz4rgp.jpg - this one is tiny. Not the same piece, obviously. 
	// https://media.tumblr.com/0625918cc22c673b4fb6db33ee44188b/tumblr_inline_mm3w29L9xN1qz4rgp.jpg
	// https://static.tumblr.com/865f4c82ae6fc0a9dc0631a646475a86/ghtmrj5/8hCop2k79/tumblr_static_9usneomihhc0s0oc0w0s0sw8c_2048_v2.gif
	// The _2048_v2 is definitely sizing, because that image works without it. 
	// http://studentsmut.tumblr.com/post/161643756857/anoneifanocs-mage0fheart-anoneifanocs-hey has an inline image that works with with _raw. It's https://media.tumblr.com/3a5ddf70b08a79c593fb05063ce011ed/tumblr_inline_orb5yhJuoV1tcvfhg_raw.png - and doesn't work with any other sizes? The hell? 
	// http://68.media.tumblr.com/a04c862afb3930c1250e067c23a887fc/tumblr_inline_owo0nfrLnO1rrmi7y_1280.png
	// Oh! Duh! media.tumblr -> 66.media.tumblr! Nope, still breaks a lot. 
// ?everypost isn't getting page/1 of http://shojoheart.tumblr.com/archive?startpage=1?pagesatonce=5?thumbnails=fixed-width?ezastumblrscrape?scrapemode=pagebrowser
	// Not a general problem; this mode still works on other tumblrs. I think it's their theme. Yeesh. 
	// Might be more general - e.g. fetching /page/1 redirects to /, so the page fetched might look empty. Arg. Ship it, it's not new. 
// http://grimdarkcake.tumblr.com tag overview doesn't work even though the pages have tags - ditto ticklishivories 
// Scrape link from /archive is broken; erase ?find if it reads '/archive'. 
// http://shittyhorsey.tumblr.com/ and http://venomous-sausage.tumblr.com/ fail before counting pages. WTF. Page counts use /mobile; there no way for themes to interfere. 
	// "The Same Origin Policy disallows reading the remote resource at https://www.tumblr.com/safe-mode?url=http://shittyhorsey.tumblr.com/page/1000/mobile." 
	// Okay, looking on the bright side, Tumblr has a "safe-mode" that might be easily abused. Look into that later. (Nope, just redirects. Poop.) 
	// Raiseshipseerve is fucked now too. What bullshit is Tumblr pulling? Other pages still work, obviously, since I've been using this for days straight. 
	// NRFW still works! Good, it's not totally fucky for https tumblrs. 
	// fetch( 'https://www.tumblr.com/safe-mode?url=http://nrfw.tumblr.com/page/2/mobile' ).then(s=>console.log(s)) does work from www.tumblr.com. It's not all crazy. 
	// -And- it's not a redirect (somehow), so... no it still returns an empty page. Fuck you, Tumblr. 
	// Yeah, you can set site_and_tags to some safe-mode link, but it still can't count pages. Fuck. 
	// embed.tumblr.com should still work, once I implement it. Even if you have to go to an /embed page to get the secret ID without fetches. 
	// Back to roots, at least for my personal use, maybe a forced theme? Just get all images on the page right now and put them in standard format. 
	// Oh thank god - Greasyfork user Petr Savelyev identified it as a cookies-related issue and gave an easy fix. fetch( url, { credentials: 'include' } ). 
		// Trust but verify: 'including credentials' does not appear to allow anything skeezy. 
		// No apparent way to set this for the whole script. Nuts. 
		// So, uh. How much of Tumblr works with credentials? Can I get any subdomain from any other subdomain? No, apparently not. Unfortunate. 
// http://mediarama.tumblr.com/archive?startpage=1?pagesatonce=10?find=/tagged/cosplay?ezastumblrscrape?scrapemode=scrapewholesite?autostart is fucked somehow 
// Make tag overview on slightly-gay-pogohammer work. 
	// Tag overview links choke on sites that end every tag with /chrono. 
// The /search method supports boolean operators in weird ways. Foo+bar returns posts with both words. Foo|bar returns different results... somehow. Fewer? 
// "Creates a new page showing just the images from any Tumblr" -> "Shows just the images from any Tumblr, using a new page?" 
// Memory use and slowdown on 1000-page scrapes: am I just using "var" where I should use "let?" Be more HTML5-y. 
	// Is it a document.write thing? Just the fact I'm dropping in raw HTML? FF might have to re-parse the whole long-ass page. 
// _raw files also work on the data.tumblr subdomain. 
	// e.g. http://data.tumblr.com/80882d3b1c6103e73b4de89761c804bd/tumblr_oe54v7tKhN1uctdepo1_raw.png
// xekstrin.tumblr.com fails every couple pages? It's been long enough that I forgot what causes this. Video? 
// ?scrapewholesite should probably separate posts / links / images below each /page. Just a text indicator on a new line. 
	// Oh, and indicate there's a tag overview at the bottom. "Scroll do the end for an overview of tags." Bottom, not end. Summary of tags. Anchor link? No, people will manage. 
// Add buttons for ?usesmall and ?notraw... and for neither. Genericize it into ?maxres=500 or something. 
	// Enable this only after adding resize functionality? That might need to be optional. I don't know if GreaseMonkey has, like, script cookies. JSON crap, I guess. 
	// Ooh, maybe make it a button on bare images. Little hovering button in the corner: 500, 1280, raw. (Still good to have a default.)
		// 1280 with a raw button is an acceptable compromise. Raw images can be stupid large. 
	// Eza's Resize Automator. Eza's Image Embiggener. Eza's Bigass Imager. Eza's Image Magnifier. Eza's Squint Disabler. Eza's Size Queen. Eza's Resolution Glutton. 
	// Once this is integrated, I should link ?usesmall to _raw and then scale down as needed. Assuming that works. Might fuck up more on XML / 404s than going up from JPG. 
	// Ech, link _1280 at most. DownThemAll doesn't do JS redirects. 
// Generalize ?usesmall and ?notraw to ?maxres=400 etc. 
	// Done. Now adjust those deprecated option names to maxres settings in the setup. 
	// Add options to image modes, probably below immediate/persistent scaling options. "Maximum resolution: Raw, 1280, 500, 400, 250, 100." I think those are the right numbers. They're all persistent links because fuck rejiggering the images on the page. 
	// Incidentally, _100 and _250 are not resized by the tumblr bare-image resizer I use. So I guess it's time to absorb that functionality. When that happens, add to the max-res options, "Opened links will display in higher resolution" or something like that. Clicked links? Clicked images? Maximum resolution? UI is hard. 
	// Ah, half-right: "Tumblr Image Size 1.1" doesn't work in //media.tumblr.com URLs. It needs a CDN number, like //66.media.tumblr.com. Might absorb the function anyway. 
	// Clean up the comments and dead code on this. 
// The new method doesn't support ?usemobile, but it kinda can't, since /mobile pages have no post links. 
	// XML methods would work. 
// Finally implemented the XML sitemap mode - and it finds "[video]" image sets with ?usemobile! 
	// Ironically I have no idea whether it finds actual videos. 
	// renkasbending doesn't show tags in xml mode, even though they're visible on the page. What. 
	// emiggax has no sitemap.xml! Whaaat? Ditto muteandthemew. 
// So... ?find=/archive does find posts and images. Can I use that? 
// Dashboard-only blogs - like https://www.tumblr.com/dashboard/blog/milky-morty - can still have the 'Scrape' link in the right place. (E.g., add /archive.) I can invoke functionality for them. It's just a right bitch to test anything, because the URL never changes and makes no difference. I'm not even sure I can request resources because all addresses resolve to the stupid dashboard thing. 
	// Oh, or https://milky-morty.tumblr.com/archive shows up fine. That works too. 
	// As does https://milky-morty.tumblr.com/sitemap.xml? Okay, so I might've accidentally solved this problem. 
	// Nevermind. At some point that guy took his blog out of dashboard-only mode. 
	// wwhatevven is dashboard-only. (And far less weird.) Nope, redirects everything to the /dashboard/blog crap. Even /archive and /sitemap.xml. 
	// Can I check if posts are original? Doesn't seem to be an OpenGraph / 'og:' thing. /embed has is_reblog, but we're not using that... yet. I should. 
		// /embed pages are desirable because they'll show their goddamn tags. 
	// Hey dingdong. You can still get thistumblr.tumblr.com/post links from the /page files, under most circumstances. 
// Example /post with previous/next links: http://artisticships.tumblr.com/post/71222875632/spencerofspace-more-rose-cosplay-first-set-x 
// Dashboard-only blogs: i-just-want-to-die-plz / thedevilandhisfiddle. 
// Maybe always link to _1280 versions in thumbnail view? This would make ?maxres more useful, e.g. for DownThemAll. 
	// Nontrivial, surprisingly. I use a standard function for standardizing images - so the link starts the same as the inline image. 
// Any /embed link for a wrong /post number delivers a standard 'not found' page, with the stupid animations. 
// _raw still exists in some form but is restricted. I'd need to find examples in the wild. 
// You know, I could still get /post numbers from /page... pages... so long as the blog works. This would allow per-post tags and image, but wouldn't fix theme-fucked blogs. It wouldn't work from /mobile, afaik. The main benefit would be 'under the cut' images. 
// Note count would be nice. Maybe once I get standardized links through /embed trickery. 
// media.tumblr.com just stopped working. 
	// ... started working again two days later. Tumblr was in a sorry state in the meantime. For once, a change on their end was clearly a bug on their end. 
// Test grabbing 1000pgs at once. 
// http://rosedai.tumblr.com/archive?ezastumblrscrape?scrapewholesite?find= - NaN pages, wtf? 
	// But http://rosedai.tumblr.com/archive?startpage=1?pagesatonce=10?ezastumblrscrape?scrapemode=scrapewholesite works. Wat. 
	// https://nightcigale.tumblr.com/archive?ezastumblrscrape?scrapewholesite?find= fails too. wtf. ?find=/ doesn't help. 
	// https://nightcigale.tumblr.com/archive?startpage=1?pagesatonce=10?ezastumblrscrape?scrapemode=scrapewholesite doesn't work either. Oh no. Did they break mobile? 
	// No, https://nightcigale.tumblr.com/page/10/mobile still works. Thank fuck. HTTP redirects to HTTPS as well, but test if it's that. (Shouldn't be; many tumblrs do HTTPS.) 
	// https://nightcigale.tumblr.com/page/100/mobile also works, for this 40-ish-page tumblr. Ditto https://nightcigale.tumblr.com/page/100000/mobile for the upper bound. 
	// And now it works suddenly. Fuck me, I guess. Tumblr just randomly wants to not respond to /mobile pages in a way that breaks the bounds check. 
// Tumblr is deleting everything NSFW within two weeks. Fucking hell. 
	// Quick and dirty post-by-post method for text? Maybe extend XML. E.g. http://pinewreaths.tumblr.com/post/164287584755/smutmas-2017-masterpost
	// It works, expose it. 
// Okay, post-by-post needs to work with tags. Jerry-rig some system that takes /page + /mobile and filters posts matching the current domain. 
	// e.g. http://tat-buns.tumblr.com/archive?ezastumblrscrape?scrapewholesite?find= is too big 
	// http://tat-buns.tumblr.com/post/104224472370/sparks-part-1-mabeldipper-gravity-falls - http://tat-buns.tumblr.com/tagged/tat%27s-fanfiction 
	// https://mrdaxxonford.tumblr.com/post/139839107484/little-things 
// https://mrdaxxonford.tumblr.com/archive?startpage=1?pagesatonce=10?find=/tagged/my-stuff?ezastumblrscrape?scrapemode=xml?lastpage=9?sitemap=1?xmlcount=9?story?usemobile?tagscrape - managed to change the page colors, wtf. These are /mobile posts! Whatever, makes no difference to a plain text file. 
	// Massive slowdown from /tagged/pinecest - possibly re-applying CSS from every single /post across 90 /pages? 
	// Ah fuck, virulentmalapropisms does it too. For "links only!" What the fuck? 
	// Tried reversion testing - it's not just tumblr fucking with me, it -is- something in my code. Uuugh. 
	// Forgot to make "story" stuff conditional. 
	// mrdaxxonford still has different style settings, what the fuck. Oh - because I'm doing ?story and ?tagscrape, so it's not /mobile. Maybe. 
	// No: it's already grabbing /mobile. WTF. 
// It would be more correct to add a 'post-by-post but just for this tag' link after the page count has been found. That'd allow breaking out in 100-page chunks. 
// Images 'under the cut' don't work in /tagscrape. Because fuck me. 
	// http://slightly-gay-pogohammer.tumblr.com/archive?startpage=1?pagesatonce=10?find=/tagged/nsfw-under-cut?ezastumblrscrape?scrapemode=xml?autostart?lastpage=3?sitemap=1?xmlcount=3?tagscrape
// http://manicpeixesdreamgirl.tumblr.com/archive?startpage=1?pagesatonce=10?ezastumblrscrape?scrapemode=xml?lastpage=478?sitemap=5?story?usemobile?usemobile - breaks at 35% even with ?usemobile. I really need fetches to fail safely. Either fuck with .catch() (where does that even go, for a promise.then chain?) or make absolutely goddamn sure every URL begins with window.location.hostname. Oh, and sitemap=11 gets 0% done. 
	// Sloppy fix: change every fetch to relative URLs. 
	// Function for relativizing URLs: replace https:// and http:// both. Replacing window.location.domain or whatever, including ".com/". Add a slash to front of remaining URL. 
// Really fuckin' wish I'd figured out dashboard blogs now. 
// /amp is a thing, like /embed or /mobile. Quickly use it. 
// http://diediedie3344-deactivated-204913.tumblr.com/archive still works what the fuck. That would've saved so much extra shit. 
// https://unwrapping.tumblr.com/post/126390533972/handy-tumblr-urls - son of a bitch I would've loved to know this a year ago.
	// Archive, filter by... Photo — http://<site>.tumblr.com/archive/filter-by/photo 
	// Posts (from your blog) — https://<www>.tumblr.com/blog/<site> - oh, just 'dashboard mode.' Or 'side mode' or whatever it's called. 
	// Day (posts by date) — http://<site>.tumblr.com/day/<year>/<month>/<day> example: http://unwrapping.tumblr.com/day/2015/04/01 
// Tumblrs below 10 pages don't find pages correctly anymore. 
	// Also, seeing a lot of "last page is between 9 and 100" or "99 and 1000." That first check is 1, 10, 100, etc. I didn't fucking ask for 99. What the hell? 
// Eats CPU cycles on the landing page. Not my fault, Tumblr just bites now. /archive is a fat bitch. 
	// Alternate standard landing page? /amp, maybe. /mobile. ?test works, obviously. &test gets eaten. 
	// /mobile works, but might not be 100.0% reliable. I think I remember some sites not having it? Might be thinking of sitemap.xml. 
	// Whoops, no longer has "Archive" in the title, so textfile filenames would be different. 
	// standard_landing_page should probably be a variable. I've already messed up replacing it in the several odd spots where it's relevant.
	// /archive/1999/1? Any year before Tumblr existed. "No posts yet."  
// Consider checking the /amp version of /post pages. Should be standardized. Might still show lingering NSFW content. Again: fuck this website. 
	// If anyone from Tumblr is reading this, fuck you personally. I don't care what you do there or when you joined. Your company has destroyed art and culture on a grand scale. Millions of hours of artistic effort, the archives of deceased creators, and countless human interactions, gone. No excuse can matter. 
// Would <wbr> break text links? I could insert it all over long-ass strings, but I don't know if it screws up how e.g. DownThemAll interprets those strings. HREF is unchanged. 
// The world needs an Eza's Twitter Scrape. I just hope to god someone besides me has done it already. 
// Why in the name of god is there no way to decode entity references in standard fucking Javascript? Did they think nobody would want to?! 
// I should probably detect rate-limiting and keep retrying. Each page on a full-site scrape gets its own div, right? 
// Always fetching /post/12345/words-etc/amp is an option. /page/2/amp doesn't work. So reliable tags are not trivial. Dangit. 

// Added first-page special case to /mobile handling, and there's some code duplication going on. Double-check what's going on for both scrapers. 
// Should offsite images read (Waiting for offsite image)? I'd like to know at a glance whether a Tumblr image failed or some shit from Minus didn't load. 
// "Programming is like this amazing puzzle game, where the puzzles are created by your own stupidity."
// Maybe just... like... ?exclude=/tagged/onepiece... to do a full rip of /tagged/onepiece and load that into page_dupe_hash? Or ?include maybe? Logical and & or?
	// Or some kind of text-file combiner, not because that's convenient to anyone else, but because I've been saving a shitload of text-files. 

// Re-editing this from whatever's on GreasyFork, in Linux. November 2020. 

	// Changes since last version:
// In ?scrapemode=www, moved each /post's permalink discovery ahead of de-duplication. 
// Added navigation controls and timing information for www.tumblr.com/tagged mode. 
// Refactored onclick code for "immediate" image size changes. 
// Added navigation to specific dates for www.tumblr.com/tagged mode. 
	// 2020 deep hibernation return:
// Fixed the goddamn titles. Back to simplicity. 
// Included max sizes for new-format image URLs, but de-duplication needs more than standardization. 







// ------------------------------------ Global variables ------------------------------------ //







var options_map = new Object(); 		// Associative array for ?key=value pairs in URL. 

	// Here's the URL options currently used. Scalars are at their default values; boolean flags are all set to false. 
options_map[ "startpage" ] = 1; 		// Page to start at when browsing images. 
options_map[ "pagesatonce" ] = 10; 		// How many Tumblr pages to browse images from at once. 
options_map[ "thumbnails" ] = false; 		// For browsing mode, 240px-wide images vs. full-size. 
options_map[ "find" ] = ""; 		// What goes after the Tumblr URL. E.g. /tagged/art or /chrono. 

// Only two hard problems in computer science...
var page_dupe_hash = {}; 		// Dump each scraped page into this, then test against each page - to remove inter-page duplicates (i.e., same shit on every page) 

// Using a global variable for this (defined later) instead of repeatedly defining it or trying to pass within the page using black magic. 
var site_and_tags = ""; 		// To be filled with e.g. http: + // + example.tumblr.com + /tagged/sherlock once options_map.find is parsed from the URL 

// Global list of post_id numbers that have been used, corresponding to span IDs based on them
var posts_placed = new Array;

// Global list of posts to be scraped, for use by sitemap.xml-based scrape function.
var post_urls = new Array; 

// "Safe" landing page - Tumblr-standard, no theme, ideally few images. 
// This can't be /archive or else immediate resizing doesn't work on blogs. But /mobile doesn't work for the new www mode. /archive/amp is consistent but "Not found." 
// Blog CSS still won't work right with /archive/amp are you kidding me. 
var standard_landing_page = "/mobile/page/amp"; 






// ------------------------------------ Script start, general setup ------------------------------------ //





// First, determine regime: Bare image? Scrape page? Normal page with a scrape link? 
if( window.location.href.indexOf( 'media.tumblr.com/' ) > -1 ) { maximize_image_size();  } 		// If it's an image, attempt to resize it
// First, determine if we're loading many pages and listing/embedding them, or if we're just adding a convenient button to that functionality. 
else if( window.location.href.indexOf( 'ezastumblrscrape' ) > -1 ) {		// If we're scraping pages:
		// Replace Tumblr-standard Archive page with our own custom nonsense
	let original_title = document.title; 
	document.head.innerHTML = "";		// Delete CSS. We'll start with a blank page.
//	document.title = ''; 		// Clear title. Script adds stuff 'to the end,' as before. Fetch below eventually fixes the front. 
	// Since we're avoiding /archive (due to content security policy interfering with image-resize gimmicks) we need to get the page title from elsewhere. (Oh, and favicon.) 
/*
	fetch( "/archive" ).then( r => r.text() ).then( text => { 		// This is now the wrong title for www stuff. Mmmeh. 
		title = text.split( '<title>' )[1].split( '</title>' )[0]; 
//		title = text.split( '<title' )[1].split( '>' )[1].split( '</title' )[0];  		// Attempted kludge
		document.title = window.location.hostname + " - " + htmlDecode( title ) + " " + document.title; 		// Beat the race condition by losing. (If we're first, we append a blank.) 
		favicon = text.split( '<link' ).map( x => x.split( '>' )[0] ).filter( x => x.indexOf( 'shortcut icon' ) > 0 )[0];
		document.head.innerHTML += '<link ' + favicon + '>'; 
		// The favicon fails sometimes - even on blogs where it otherwise works - even on pages where reloading makes it work. I do not understand how. 
	} )
*/
	// Fuck it:
	document.title = window.location.hostname + " - " + original_title.replace( /[\"\\\/]/g, '' ) + " " + document.title; 

	document.body.outerHTML = "<div id='maindiv'><div id='fetchdiv'></div></div><div id='bottom_controls_div'></div>"; 		// This is our page. Top stuff, content, bottom stuff. 
	let css_block = "<style> "; 		// Let's break up the CSS for readability and easier editing, here. 
	css_block += "body { background-color: #DDD; } "; 		// Light grey BG to make image boundaries more obvious 
	css_block += "h1,h2,h3{ display: inline; } ";
	css_block += ".fixed-width img{ width: 240px; } ";
	css_block += ".fit-width img{ max-width: 100%; } ";
	css_block += ".fixed-height img{ height: 240px; max-width:100%; } "; 		// Max-width for weirdly common 1px-tall photoset footers. Ultrawide images get their own row. 
	css_block += ".fit-height img{ max-height: 100%; } ";
	css_block += ".smart-fit img{ max-width: 100%; max-height: 100%; } ";		// Might ditch the individual fit modes. This isn't Pixiv Fixiv. (No reason not to have them?) 
	css_block += ".pagelink{ display:none; } "; 
	css_block += ".showpagelinks .pagelink{ display:inline; } "; 
	// Text blocks over images hacked together after https://www.designlabthemes.com/text-over-image-with-css/ - CSS is the devil 
	css_block += ".container { position: relative; padding: 0; margin: 0; } "; 		// Holds an image and the on-hover permalink
	css_block += ".postlink { position: absolute; width: 100%; left: 0; bottom: 0; opacity: 0; background: rgba(255,255,255,0.7); } "; 		// Permalink across bottom
	css_block += ".container:hover .postlink { opacity: 1; } "; 
	css_block += ".hidden { display: none; } "; 
	css_block += "a.interactive{ color:green; } "; 		// For links that don't go anywhere, e.g. 'toggle image size' - signalling. 
	css_block += "</style>"; 
	document.body.innerHTML += css_block; 		// Has to go in all at once or the browser "helpfully" closes the style tag upon evaluation 	
	var mydiv = document.getElementById( "maindiv" ); 		// I apologize for the generic names. This script used to be a lot simpler. 

		// Identify options in URL (in the form of ?key=value pairs) 
	var key_value_array = window.location.href.split( '?' ); 		// Knowing how to do it the hard way is less impressive than knowing how not to do it the hard way. 
	key_value_array.shift(); 		// The first element will be the site URL. Durrrr. 
	for( dollarsign of key_value_array ) { 		// forEach( key_value_array ), including clumsy homage to $_ 
		var this_pair = dollarsign.split( '=' ); 		// Split key=value into [key,value] (or sometimes just [key])
		if( this_pair.length < 2 ) { this_pair.push( true ); } 		// If there's no value for this key, make its value boolean True 
		if( this_pair[1] == "false " ) { this_pair[1] = false; } 		// If the value is the string "false" then make it False - note fun with 1-ordinal "length" and 0-ordinal array[element]. 
			else if( !isNaN( parseInt( this_pair[1] ) ) ) { this_pair[1] = parseInt( this_pair[1] ); } 		// If the value string looks like a number, make it a number
		options_map[ this_pair[0] ] = this_pair[1]; 		// options_map.key = value 
	}
	if( options_map.find[ options_map.find.length - 1 ] == "/" ) { options_map.find = options_map.find.substring( 0, options_map.find.length - 1 ); } 		// Prevents .com//page/2
//	if( options_map.find.indexOf( '/chrono' ) > 0 ) { options_map.chrono = true; } else { options_map.chrono = false; } 		// False case, to avoid unexpected persistence? Hm. 

		// Convert old URL options to new key-value pairs 
	if( options_map[ "scrapewholesite" ] ) { options_map.scrapemode = "scrapewholesite"; options_map.scrapewholesite = false; } 
	if( options_map[ "everypost" ] ) { options_map.scrapemode = "everypost"; options_map.everypost = false; } 
	if( options_map[ "thumbnails" ] == true ) { options_map.thumbnails = "fixed-width"; } 		// Replace the original valueless key with the default value 
	if( options_map[ "notraw" ] ) 		{ options_map.maxres = "1280"; options_map.notraw = false; } 
	if( options_map[ "usesmall" ] ) 	{ options_map.maxres = "400"; options_map.usesmall = false; } 

	document.body.className = options_map.thumbnails; 		// E.g. fixed-width, fixed-height, as matches the CSS. Persistent thumbnail options. Failsafe = original size.
	// Oh yeah, we have to do this -after- options_map.find is defined:
	site_and_tags = window.location.protocol + "//" + window.location.hostname + options_map.find; 		// e.g. http: + // + example.tumblr.com + /tagged/sherlock

	// Grab an example page so that duplicate-removal hides whatever junk is on every single page  
	// This remains buggy due to asynchronicity. It's a race condition where the results are, at worst, mildly annoying. 
	// Previous notes mention jeffmacanolinsfw.tumblr.com for some reason. 
	// Can just .then this function? 
	// Can I create cookies? That'd work fine. On load, grab cookies for this site and for this script, use /page/1 crap. 
	if( options_map.startpage != 1 && options_map.scrapemode != "scrapewholesite" ) 	// Not on first page, so on-every-page stuff appears somewhere
		{ exclude_content_example( site_and_tags + '/page/1' );	 } 		// Since this doesn't happen on page 1, let's use page 1. Low pages are faster somehow. . 

		// Add tags to title, for archival and identification purposes
	document.title += options_map.find.split('/').join(' '); 		// E.g. /tagged/example/chrono -> "tagged example chrono" 

	// In Chrome, /archive pages monkey-patch and overwrite Promise.all and Promise.resolve. 
	// Clunky solution to clunky problem: grab the default property from a fresh iframe.
	// Big thanks to inu-no-policeman for the iframe-based solution. Prototypes were not helpful. 
	var iframe = document.createElement( 'iframe' );  
	document.body.appendChild( iframe ); 
	window['Promise'] = iframe.contentWindow['Promise'];
	document.body.removeChild( iframe );

	mydiv.innerHTML = "Not all images are guaranteed to appear.<br>"; 		// Thanks to JS's wacky accomodating nature, mydiv is global despite appearing in an if-else block. 

		// Go to image browser or link scraper according to URL options. 
	switch( options_map.scrapemode ) {
 		case "scrapewholesite": scrape_whole_tumblr(); break;
		case "xml" : scrape_sitemap(); break; 
		case "everypost": setTimeout( new_embedded_display, 500 ); break; 		// Slight delay increases odds of exclude_content_example actually fucking working
		case "www": scrape_www_tagged(); break; 		// www.tumblr.com/tagged, and eventually your dashboard, maybe. 
		default: scrape_tumblr_pages();  		// Sensible delays do not work on the original image browser. Shrug. 
	}

} else { 		// If it's just a normal Tumblr page, add a link to the appropriate /ezastumblrscrape URL 

	// Add link(s) to the standard "+Follow / Dashboard" nonsense. Before +Follow, I think - to avoid messing with users' muscle memory. 
	// This is currently beyond my ability to dick with JS through a script in a plugin. Let's kludge it for immediate usability. 
	// kludge by Ivan - http://userscripts-mirror.org/scripts/review/65725.html 

		// Preserve /tagged/tag/chrono, etc. Also preserve http: vs https: via "location.protocol". 
	var find = window.location.pathname; 
	if( find.indexOf( "/page/chrono" ) <= 0 ) { 		// Basically checking for posts /tagged/page, thanks to Detective-Pony. Don't even ask. 
		if( find.lastIndexOf( "/page/" ) >= 0 ) { find = find.substring( 0, find.lastIndexOf( "/page/" ) ); } 		// Don't include e.g. /page/2. We'll add that ourselves. 
		if( find.lastIndexOf( "/post/" ) >= 0 ) { find = find.substring( 0, find.lastIndexOf( "/post" ) ); } 
		if( find.lastIndexOf( "/archive" ) >= 0 ) { find = find.substring( 0, find.lastIndexOf( "/archive" ) ); } 
		// On individual posts (and the /archive page), the link should scrape the whole site. 
	}
	var url = window.location.protocol + "//" + window.location.hostname + standard_landing_page +  "?ezastumblrscrape?scrapewholesite?find=" + find; 
	if( window.location.host == "www.tumblr.com" ) { url += "?scrapemode=www?thumbnails=fixed-width"; url = url.replace( "?scrapewholesite", "" ); } 

	// "Don't clean this up. It's not permanent."
	// Fuck it, it works and it's fragile. Just boost its z-index so it stops getting covered. 
	var scrape_button = document.createElement("a");
	scrape_button.setAttribute( "style", "position: absolute; top: 26px; right: 1px; padding: 2px 0 0; width: 50px; height: 18px; display: block; overflow: hidden; -moz-border-radius: 3px; background: #777; color: #fff; font-size: 8pt; text-decoration: none; font-weight: bold; text-align: center; line-height: 12pt; z-index: 1000; " );
	scrape_button.setAttribute("href", url);
	scrape_button.innerHTML = "Scrape";
	var body_ref = document.getElementsByTagName("body")[0];
	body_ref.appendChild(scrape_button);
		// Pages where the button gets split (i.e. clicking top half only redirects tiny corner iframe) are probably loading this script separately in the iframe. 
		// Which means you'd need to redirect the window instead of just linking. Bluh. 

	// Greasemonkey supports user commands through its add-on menu! Thus: no more manually typing /archive?ezastumblrscrape?scrapewholesite on uncooperative blogs.
	GM_registerMenuCommand( "Scrape whole Tumblr blog", go_to_scrapewholesite );
	// If a page is missing (post deleted, blog deleted, name changed) a reblog can often be found based on the URL
	// Ugh, these should only appear on /post/ pages. 
	// Naming these commands is hard. Both look for reblogs, but one is for if the post you're on is already a reblog. 
	// Maybe "because this Tumblr changed names / moved / is missing" versus "because this reblog got deleted?" Newbs might not know either way. 
		// "As though" this blog is missing / this post is missing? 
		// "Search for this Tumblr under a different name" versus "search for other blogs that've reblogged this?"
	GM_registerMenuCommand( "Google for reblogs of this original Tumblr post", google_for_reblogs );
	GM_registerMenuCommand( "Google for other instances of this Tumblr reblog", google_for_reblogs_other ); 		// two hard problems 

//	if( window.location.href.indexOf( '?browse' ) > -1 ) { browse_this_page(); } 		// Experimental single-page scrape mode - DEFINITELY not guaranteed to stay 
}

function go_to_scrapewholesite() { 
//	let redirect = window.location.protocol + "//" + window.location.hostname + "/archive?ezastumblrscrape?scrapewholesite?find=" + window.location.pathname;
	let redirect = window.location.protocol + "//" + window.location.hostname + standard_landing_page 
		+ "?ezastumblrscrape?scrapewholesite?find=" + window.location.pathname;  
	window.location.href = redirect; 
}

function google_for_reblogs() {
	let blog_name = window.location.href.split('/')[2].split('.')[0]; 		// e.g. http//example.tumblr.com -> example 
	let content = window.location.href.split('/').pop(); 		// e.g. http//example.tumblr.com/post/12345/hey-i-drew-this -> hey-i-drew-this
	let redirect = "https://google.com/search?q=tumblr " + blog_name + " " + content; 
	window.location.href = redirect; 
}

function google_for_reblogs_other() {
	let content = window.location.href.split('/').pop().split('-'); 		// e.g. http//example.tumblr.com/post/12345/hey-i-drew-this -> hey,i,drew,this
	let blog_name = content.shift(); 		// e.g. examplename-hey-i-drew-this -> examplename
	content = content.join('-'); 
	let redirect = "https://google.com/search?q=tumblr " + blog_name + " " + content; 
	window.location.href = redirect; 
}









// ------------------------------------ Whole-site scraper for use with DownThemAll ------------------------------------ //









// Monolithic scrape-whole-site function, recreating the original intent (before I added pages and made it a glorified multipage image browser) 
function scrape_whole_tumblr() {
//	console.log( page_dupe_hash ); 
	var highest_known_page = 0;
	options_map.startpage = 1; 		// Reset to default, because other values do goofy things to the image-browsing links below 

	// Link to image-viewing version, preserving current tags
	mydiv.innerHTML += "<br><h1><a id='browse10' href='" + options_url( {scrapemode:'pagebrowser', thumbnails:true} ) +"'>Browse images (10 pages at once)</a> </h1>"; 
	mydiv.innerHTML += "<h3><a id='browse5' href='" + options_url( {scrapemode:'pagebrowser', thumbnails:true, pagesatonce:5} ) + "'>(5 pages at once)</a> </h3>"; 
	mydiv.innerHTML += "<h3><a id='browse1' href='" + options_url( {scrapemode:'pagebrowser', thumbnails:true, pagesatonce:1} ) + "'>(1 page at once)</a></h3><br><br>"; 

	mydiv.innerHTML += "<a id='exp10' href='" + options_url( {scrapemode:'everypost', thumbnails:true, pagesatonce:10} ) + "'>Experimental fetch-every-post image browser (10 pages at once)</a> "; 
	mydiv.innerHTML += "<a id='exp5' href='" + options_url( {scrapemode:'everypost', thumbnails:true, pagesatonce: 5} ) + "'>(5 pages at once)</a> "; 
	mydiv.innerHTML += "<a id='exp1' href='" + options_url( {scrapemode:'everypost', thumbnails:true, pagesatonce: 1} ) + "'>(1 page at once)</a><br><br>";

	mydiv.innerHTML += "<a id='xml_all' href='" + options_url( {scrapemode:'xml' } ) + "'>Post-by-post images and text</a> <-- New option for saving stories<br><br>";  

	// Find out how many pages we need to scrape.
	if( isNaN( options_map.lastpage ) ) {
		// Find upper bound in a small number of fetches. Ideally we'd skip this - some themes list e.g. "Page 1 of 24." I think that requires back-end cooperation. 
		mydiv.innerHTML += "Finding out how many pages are in <b>" + site_and_tags.substring( site_and_tags.indexOf( '/' ) + 2 ) + "</b>:<br><br>"; 

		// Returns page number if there's no Next link, or negative page number if there is a Next link. 
		// Only for use on /mobile pages; relies on Tumblr's shitty standard theme 
		function test_next_page( body ) {
			var link_index = body.indexOf( 'rel="canonical"' ); 		// <link rel="canonical" href="http://shadygalaxies.tumblr.com/page/100" /> 
			var page_index = body.indexOf( '/page/', link_index ); 
			var terminator_index = body.indexOf( '"', page_index ); 
			var this_page = parseInt( body.substring( page_index+6, terminator_index ) ); 
			if( body.indexOf( '>next<' ) > 0 ) { return -this_page; } else { return this_page }
		}

		// Generates an array of length "steps" between given boundaries - or near enough, for sanity's sake 
		function array_between_bounds( lower_bound, upper_bound, steps ) { 
			if( lower_bound > upper_bound ) { 		// Swap if out-of-order. 
				var temp = lower_bound; lower_bound = upper_bound, upper_bound = temp; 
			}
			var bound_range = upper_bound - lower_bound;
			if( steps > bound_range ) { steps = bound_range; } 		// Steps <= bound_range, but steps > 1 to avoid division by zero:
			var pages_per_test = parseInt( bound_range / steps ); 		// Steps-1 here, so first element is lower_bound & last is upper_bound. Off-by-one errors, whee... 
			var range = Array( steps ) 
				.fill( lower_bound ) 
				.map( (value,index) => value += index * pages_per_test );
			range.push( upper_bound );
			return range;
		}

		// DEBUG
//		site_and_tags = 'https://www.tumblr.com/safe-mode?url=http://shittyhorsey.tumblr.com'; 

		// Given a (presumably sorted) list of page numbers, find the last that exists and the first that doesn't exist. 
		function find_reasonable_bound( test_array ) {
			return Promise.all( test_array.map( pagenum => fetch( site_and_tags + '/page/' + pagenum + '/mobile', { credentials: 'include' } ) ) ) 
				.then( responses => Promise.all( responses.map( response => response.text() ) ) ) 
				.then( pages => pages.map( page => test_next_page( page ) ) ) 
				.then( numbers => {
					var lower_index = -1;
					numbers.forEach( (value,index) => { if( value < 0 ) { lower_index++; } } ); 	// Count the negative numbers (i.e., count the pages with known content) 
					if( lower_index < 0 ) { lower_index = 0; } 
					var bounds = [ Math.abs(numbers[lower_index]), numbers[lower_index+1] ] 
					mydiv.innerHTML += "Last page is between " + bounds[0] + " and " + bounds[1] + ".<br>";
					return bounds; 
				} )
		}

		// Repeatedly narrow down how many pages we're talking about; find a reasonable "last" page 
		find_reasonable_bound( [2, 10, 100, 1000, 10000, 100000] ) 		// Are we talking a couple pages, or a shitload of pages?
			.then( pair => find_reasonable_bound( array_between_bounds( pair[0], pair[1], 10 ) ) ) 		// Narrow it down. Fewer rounds of more fetches works best.
			.then( pair => find_reasonable_bound( array_between_bounds( pair[0], pair[1], 10 ) ) ) 		// Time is round count, fetches add up, selectivity is fetches x fetches. 
			// Quit fine-tuning numbers and just conditional in some more testing for wide ranges. 
			.then( pair => { if( pair[1] - pair[0]  > 50 ) { return find_reasonable_bound( array_between_bounds( pair[0], pair[1], 10 ) ) } else { return pair; } } ) 
			.then( pair => { if( pair[1] - pair[0]  > 50 ) { return find_reasonable_bound( array_between_bounds( pair[0], pair[1], 10 ) ) } else { return pair; } } ) 
			.then( pair => { 
				options_map.lastpage = pair[1]; 

				document.getElementById( 'browse10' ).href += "?lastpage=" + options_map.lastpage; 		// Add last-page indicator to Browse Images link
				document.getElementById( 'browse5' ).href += "?lastpage=" + options_map.lastpage; 			// ... and the 5-pages-at-once link.
				document.getElementById( 'browse1' ).href += "?lastpage=" + options_map.lastpage; 			// ... and the 1-page-at-onces link. 
				document.getElementById( 'exp10' ).href += "?lastpage=" + options_map.lastpage; 			// ... and this fetch-every-post link. 
				document.getElementById( 'exp5' ).href += "?lastpage=" + options_map.lastpage; 				// ... and this fetch-every-post link. 
				document.getElementById( 'exp1' ).href += "?lastpage=" + options_map.lastpage; 				// ... and this fetch-every-post link. 
				document.getElementById( 'xml_all' ).href += "?lastpage=" + options_map.lastpage; 			// ... and this XML post-by-post link, why not. 

				start_scraping_button(); 
			} );  
	}
	else { 		// If we're given the highest page by the URL, just use that
		start_scraping_button(); 
	} 

	// Add "Scrape" button to the page. This will grab images and links from many pages and list them page-by-page. 
	function start_scraping_button() { 
		if( options_map.grabrange ) { 		// If we're only grabbing a 1000-page block from a huge-ass tumblr:
			mydiv.innerHTML += "<br>This will grab 1000 pages starting at <b>" + options_map.grabrange + "</b>.<br><br>";
		} else { 		// If we really are describing the last page:
			mydiv.innerHTML += "<br>Last page is <b>" + options_map.lastpage + "</b> or lower. ";
			mydiv.innerHTML += "<a href=" + options_url( {lastpage: false} ) + ">Find page count again?</a> <br><br>"; 
		}

		if( options_map.lastpage > 1500 && !options_map.grabrange ) { 		// If we need to link to 1000-page blocks, and aren't currently inside one: 
			for( let x = 1; x < options_map.lastpage; x += 1000 ) { 		// For every 1000 pages...
				let decade_url = window.location.href + "?grabrange=" + x + "?lastpage=" + options_map.lastpage; 
				mydiv.innerHTML += "<a href='" + decade_url + "'>Pages " + x + "-" + (x+999) + "</a><br>"; 		// ... link a range of 1000 pages. 
			}
		}

			// Add button to scrape every page, one after another. 
			// Buttons within GreaseMonkey are a huge pain in the ass. I stole this from stackoverflow.com/questions/6480082/ - thanks, Brock Adams. 
		var button = document.createElement ('div');
		button.innerHTML = '<button id="myButton" type="button">Find image links from all pages</button>'; 
		button.setAttribute ( 'id', 'scrape_button' );		// I'm really not sure why this id and the above HTML id aren't the same property. 
		document.body.appendChild ( button ); 		// Add button (at the end is fine) 
		document.getElementById ("myButton").addEventListener ( "click", scrape_all_pages, false ); 		// Activate button - when clicked, it triggers scrape_all_pages() 

		if( options_map.autostart ) { document.getElementById ("myButton").click(); } 		// Getting tired of clicking on every reload - debug-ish 
		if( options_map.lastpage <= 26 ) { document.getElementById ("myButton").click(); } 		// Automatic fetch (original behavior!) for a single round 
	} 
}



function scrape_all_pages() {		// Example code implies that this function /can/ take a parameter via the event listener, but I'm not sure how. 
	var button = document.getElementById( "scrape_button" ); 			// First, remove the button. There's no reason it should be clickable twice. 
	button.parentNode.removeChild( button ); 		// The DOM can only remove elements from a higher level. "Elements can't commit suicide, but infanticide is permitted." 

	mydiv.innerHTML += "Scraping page: <div id='pagecounter'></div><div id='afterpagecounter'><br></div><br>";		// This makes it easier to view progress,

	// Create divs for all pages' content, allowing asynchronous AJAX fetches
	var x = 1; 
	var div_end_page = options_map.lastpage;
	if( !isNaN( options_map.grabrange ) ) { 		// If grabbing 1000 pages from the middle of 10,000, don't create 0..10,000 divs 
		x = options_map.grabrange; 
		div_end_page = x + 1000; 		// Should be +999, but whatever, no harm in tiny overshoot 
	}
	for( ; x <= div_end_page; x++ ) { 
		var siteurl = site_and_tags + "/page/" + x; 
		if( options_map.usemobile ) { siteurl += "/mobile"; } 		// If ?usemobile is flagged, scrape the mobile version.
		if( x == 1 && options_map.usemobile ) { siteurl = site_and_tags + "/mobile"; } 		// Hacky fix for redirect from example.tumblr.com/page/1/anything -> example.tumblr.com

		var new_div = document.createElement( 'div' );
		new_div.id = '' + x; 
		document.body.appendChild( new_div );
	}

	// Fetch all pages with content on them
	var page_counter_div = document.getElementById( 'pagecounter' ); 		// Probably minor, but over thousands of laggy page updates, I'll take any optimization. 
	pagecounter.innerHTML = "" + 1;
	var begin_page = 1; 
	var end_page = options_map.lastpage; 
	if( !isNaN( options_map.grabrange ) ) { 		// If a range is defined, grab only 1000 pages starting there 
		begin_page = options_map.grabrange;
		end_page = options_map.grabrange + 999; 		// NOT plus 1000. Stop making that mistake. First page + 999 = 1000 total. 
		if( end_page > options_map.lastpage ) { end_page = options_map.lastpage; } 		// Kludge 
		document.title += " " + (parseInt( begin_page / 1000 ) + 1);		// Change page title to indicate which block of pages we're saving
	}


	// Generate array of URL/pagenum pair-arrays 
	url_index_array = new Array;
	for( var x = begin_page; x <= end_page; x++ ) { 
		var siteurl = site_and_tags + "/page/" + x; 
		if( options_map.usemobile ) { siteurl += "/mobile"; } 		// If ?usemobile is flagged, scrape the mobile version. No theme shenanigans... but also no photosets. Sigh. 
		if( x == 1 && options_map.usemobile ) { siteurl = site_and_tags + "/mobile"; } 		// Hacky fix for redirect from example.tumblr.com/page/1/anything -> example.tumblr.com
		url_index_array.push( [siteurl, x] ); 
	}

	// Fetch, scrape, and display all URLs. Uses promises to work in parallel and promise.all to limit speed and memory (mostly for reliability's sake). 
	// Consider privileging first page with single-element fetch, to increase apparent responsiveness. Doherty threshold for frustration is 400ms. 
	var simultaneous_fetches = 25;
	var chain = Promise.resolve(0); 		// Empty promise so we can use "then" 

	var order_array = [1]; 		// We want to show the first page immediately, and this is a callback rat's-nest, so let's make an array of how many pages to take each round
	for( var x = 1; x < url_index_array.length; x += simultaneous_fetches ) { 		// E.g. [1, simultaneous_fetchs, s_f, s_f, s_f, whatever's left] 
		if( url_index_array.length - x > simultaneous_fetches ) { order_array.push( simultaneous_fetches ); } else { order_array.push( url_index_array.length - x ); } 
	}

	order_array.forEach( (how_many) => {
		chain = chain.then( s => {
			var subarray = url_index_array.splice( 0, how_many );  		// Shift a reasonable number of elements into separate array, for partial array.map  
			return Promise.all( subarray.map( page => 
				Promise.all( [ fetch( page[0], { credentials: 'include' } ).then( s => s.text() ), 	page[1], 	page[0] ] ) 		// Return [ body of page, page number, page URL ] 
			) ) 
		} )
		.then( responses => responses.map( s => { 		// Scrape URLs for links and images, display on page 
			var pagenum = s[1]; 
			var page_url = s[2];
			var url_array = soft_scrape_page_promise( s[0] ) 		// Surprise, this is a promise now 
				.then( urls => { 
					// Sort #link URLs to appear first, because we don't do that in soft-scrape anymore
					urls.sort( (a,b) => -a.indexOf( "#link" ) ); 		// Strings containing "#link" go before others - return +1 if not found in 'a.' Should be stable. 

					// Print URLs so DownThemAll (or similar) can grab them
					var bulk_string = "<br><a href='" + page_url + "'>" + page_url + "</a><br>"; 		// A digest, so we can update innerHTML just once per div
					// DEBUG-ish - on theory that 1000-page-tall scraping/rendering fucks my VRAM
					if( options_map.smalltext ) { bulk_string = "<p style='font-size:1px'>" + bulk_string; } 		// If ?smalltext flag is set, render text unusably small, for esoteric reasons
					urls.forEach( (value,index,array) => { 
						if( options_map.plaintext ) { 
							bulk_string += value + '<br>';
						} else {
							bulk_string += '<a href ="' + value + '">' + value + '</a><br>'; 
						}
					} )
					document.getElementById( '' + pagenum ).innerHTML = bulk_string; 
					if( parseInt( pagecounter.innerHTML ) < pagenum ) { pagecounter.innerHTML = "" + pagenum; } 		// Increment pagecounter (where sensible) 
				} );
			} )
		) 
	} )

	chain = chain.then( s => { 
		document.getElementById( 'afterpagecounter' ).innerHTML = "Done. Use DownThemAll (or a similar plugin) to grab all these links."; 

		// Divulge contents of page_dupe_hash to check for common tags 
		// Ugh, I'm going to have to turn this from an associative array into an array-of-arrays if I want to sort it. 
		let tag_overview = "<br>" + "Tag overview: " + "<br>"; 
		let score_tag_list = new Array; 		// This will hold an array of arrays so we can sort this associative array by its values. Wheee.
		for( let url in page_dupe_hash ) { 
			if( url.indexOf( '/tagged/' ) > 0 			// If it's a tag URL...
				&& page_dupe_hash[ url ] > 1 	// and non-unique...
				&& url.indexOf( '/page/' ) < 0 		// and not a page link...
				&& url.indexOf( '?og' ) < 0 			// and not an opengraph link...
				&& url.indexOf( '?ezas' ) < 0 		// and not this script, wtf... 
			) { 		// So if it's a TAG, in other words...
				score_tag_list.push( [ page_dupe_hash[ url ], url ] ); 		// ... store [ number of times seen, tag URL ] for sorting. 
			}
		} 
		score_tag_list.sort( (a,b) => a[0] > b[0] ); 		// Ascending order, now - most common tags at the very bottom, for easier access 
		score_tag_list.map( pair => {
			pair[1] = pair[1].replace( '/chrono', '' ); 		// Remove /chrono from sites that append it automatically, since it breaks the 'N pages' autostart links. (/chrono/ might fail.) 
			var this_tag = pair[1].split('/').pop(); 		// e.g. example.tumblr.com/tagged/my-art -> my-art
			//if( this_tag == '' ) { let this_tag = pair[1].split('/').pop(); } 		// Trailing slash screws this up, so get the second-to-last thing instead
			var scrape_link = options_url( {find: '/tagged/'+this_tag, lastpage: false, grabrange: false, autostart: true} ); 		// Direct link to ?scrapewholesite for e.g. /tagged/my-art 
			tag_overview += "<br><a href='" + scrape_link + "'>" + pair[0] +  " posts</a>:\t" + "<a href='" + pair[1] + "'>" + pair[1] + "</a>"; 
		} )
		document.body.innerHTML += tag_overview;

	} ) 
}









// ------------------------------------ Multi-page scraper with embedded images ------------------------------------ //









function scrape_tumblr_pages() { 
	// Grab an empty page so that duplicate-removal hides whatever junk is on every single page 
	// This is DEBUG-ish. It might be slow, barring caching. It might not work due to asynchrony. It could block actual content thanks to 'my best posts' sidebars. 

	if( isNaN( parseInt( options_map.startpage ) ) || options_map.startpage <= 1 ) { options_map.startpage = 1; } 		// Sanity check

	mydiv.innerHTML += "<br>" + html_previous_next_navigation() + "<br>"; 
	document.getElementById("bottom_controls_div").innerHTML += "<br>" + html_page_count_navigation() + "<br>" + html_previous_next_navigation(); 

	mydiv.innerHTML += "<br>" + html_ezastumblrscrape_options() + "<br>"; 

	mydiv.innerHTML += "<br>" +image_size_options(); 

	mydiv.innerHTML += "<br><br>" + image_resolution_options(); 

	// Fill an array with the page URLs to be scraped (and create per-page divs while we're at it)
	var pages = new Array( parseInt( options_map.pagesatonce ) ) 
		.fill( parseInt( options_map.startpage ) )
		.map( (value,index) => value+index ); 
	pages.forEach( pagenum => { 
			mydiv.innerHTML += "<hr><div id='" + pagenum + "'><b>Page " + pagenum + " </b></div>"; 
	} )

	pages.map( pagenum => { 
		var siteurl = site_and_tags + "/page/" + pagenum; 		// example.tumblr.com/page/startpage, startpage+1, startpage+2, etc. 
		if( options_map.usemobile ) { siteurl += "/mobile"; } 		// If ?usemobile is flagged, scrape mobile version. No theme shenanigans... but also no photosets. Sigh. 
		if( pagenum == 1 && options_map.usemobile ) { siteurl = site_and_tags + "/mobile"; } 		// Hacky fix for redirect from example.tumblr.com/page/1/anything -> example.tumblr.com
		fetch( siteurl, { credentials: 'include' } ).then( response => response.text() ).then( text => {
			document.getElementById( pagenum ).innerHTML += "<b>fetched</b><br>" 		// Immediately indicate the fetch happened. 
				+ "<a href='" + siteurl + "'>" + siteurl + "</a><br>"; 		// Link to page. Useful for viewing things in-situ... and debugging. 
			// For some asinine reason, 'return url_array' causes 'Permission denied to access property "then".' So fake it with ugly nesting. 
			soft_scrape_page_promise( text ) 		 		
				.then( url_array => {
					var div_digest = ""; 		// Instead of updating each div's HTML for every image, we'll lump it into one string and update the page once per div.

					var video_array = new Array;
					var outlink_array = new Array;
					var inlink_array = new Array;

					url_array.forEach( (value,index,array) => { 		// Shift videos and links to separate arrays, blank out those URLs in url_array
						if( value.indexOf( '#video' ) > 0 ) 	{ video_array.push( value ); array[index] = '' } 
						if( value.indexOf( '#offsite' ) > 0 ) 	{ outlink_array.push( value ); array[index] = '' } 
						if( value.indexOf( '#local' ) > 0 ) 	{ inlink_array.push( value ); array[index] = '' } 
					} );
					url_array = url_array.filter( url => url === "" ? false : true ); 		// Remove empty elements from url_array

					// Display video links, if there are any
					video_array.forEach( value => {div_digest += "Video: <a href='" + value + "'>" + value + "</a><br>  "; } ) 

					// Display page links if the ?showlinks flag is enabled 
					if( options_map.showlinks ) { 
						div_digest += "Outgoing links: "; 
						outlink_array.forEach( (value,index) => { div_digest += "<a href='" + value.replace('#offsite#link', '') + "'>O" + (index+1) + "</a> " } );
						div_digest += "<br>" + "Same-Tumblr links: ";
						inlink_array.forEach( (value,index) => { div_digest += "<a href='" + value.replace('#local#link', '') + "'>T" + (index+1) + "</a> " } );
						div_digest += "<br>";
					}

					// Embed high-res images to be seen, clicked, and saved
					url_array.forEach( image_url => { 
						// Embed images (linked to themselves) and link to photosets
						if( image_url.indexOf( "#photoset#" ) > 0 ) { 		// Before the first image in a photoset, print the photoset link.
							var photoset_url = image_url.split( "#" ).pop(); 		
							// URL is like tumblr.com/image#photoset#http://tumblr.com/photoset_iframe - separate past last hash... t.
							div_digest += " <a href='" + photoset_url + "'>Set:</a>"; 
						}
						div_digest += "<a id='" + encodeURI( image_url ) + "' target='_blank' href='" + image_url + "'>" 	+ "<img alt='(Waiting for image)' onerror='" + error_function( image_url ) + "' src='" + image_url + "'></a>  ";
//						div_digest += "<a id='" + encodeURI( image_url ) + "' target='_blank' href='" + image_url + "'>" 	+ "<img alt='(Waiting for image)' src='" + image_url + "'></a>  ";  
					} )

					div_digest += "<br><a href='" + siteurl + "'>(End of " + siteurl + ")</a>";		// Another link to the page, because I'm tired of scrolling back up. 
					document.getElementById( pagenum ).innerHTML += div_digest; 
				} ) // End of 'then( url_array => { } )'
			} ) // End of 'then( text => { } )'
	} ) // End of 'pages.map( pagenum => { } )' 
}









// ------------------------------------ Whole-site scraper based on post-by-post method ------------------------------------ //








// The use of sitemap.xml could be transformative to this script, or even split off into another script entirely. It finally allows a standard theme! 
	// Just do it. Entries look like:
	// <url><loc>http://leopha.tumblr.com/post/57593339717/hello-a-friend-found-my-blog-somehow-so-url</loc><lastmod>2013-08-07T06:42:58Z</lastmod></url></urlset>
	// So split on <url><loc> and terminate at </loc>. Or see if JS has native XML parsing, for honest object-orientation instead of banging at text files. 
	// Grab normally for now, I guess, just to get it implemented. Make ?usemobile work. Worry about /embed stuff later. 
	// Check if dashboard-only blogs have xml files exposed. 
	// While we're at it, check that the very first <loc> for sitemap2 doesn't point to a /page/n URL. Not useful, just interesting. 

// Simplicate for now. Have a link to grab an individual XML file, get everything inside it, then add images (and tags?) from each page. 
	// For an automatic 'get the whole damn site' mode, maybe just call each XML file sequentially. Not a for() loop - have each page maybe call the next page when finished. 
	// Oh right, these XML files are like 500 posts each. Not much different from grabbing 50 pages at a time - and we currently grab 25 at once - but significant.
	// If I have to pass the /post URL list to a serial function in order to rate-limit this, I might as well grab all XML files and fill the list -once.- 
	// Count down? So e.g. scrape(x) calls scrape(x-1). It's up to the root function to call the high value initially. 

// Single-sitemap pages (e.g. scraping and displaying sitemap2) will need prev/next controls (e.g. to sitemap1 & sitemap3). 
// These will be chronological. That's fine, just mention it somewhere. 

// I'm almost loathe to publicize this. It's not faster or more reliable than the monolithic scraper. It's not a better image-browsing method, in my opinion.
// It's only really useful for people who think a blank theme is the same as erasing their blog... and the less those jerks know, the better. Don't delete art. 
// I guess it'll be better when I list tags with each post, but at present they're strongly filtered out. 

// Wait, wtf? I ripped sometipsygnostalgic as a test cast (98 sitemaps, ~50K posts) and the last page scraped is from years ago. 
// None of the sitemaps past sitemap51 exist. So the first 51 are present - the rest 404. (To her theme, not as a generic tumblr error with animated background.) 
// It's not a URL-generation error; the same thing happens copy-pasting the XML URLs straight from sitemap.xml. 
// Just... fuck. Throw a warning for now, see if there's anything to be done later. 
// If /mobile versions of /post URLs unexpectedly had proper [video] references... do they contain previous/next post info? Doesn't look like it. Nuts. 

// In addition to tags, this should maybe list sources and 'via' links. It's partially archival, after all. 
// Sort of have to conditionally unfilter /tagged links from both duplicate-remover and whichever function removes tumblr guff. 'if !xml remove tagged.' bluh. 
// Better idea: send the list to a 'return only tags' filter first, non-destructively. Then filter them out. 

// I guess this is what I'd modify to get multi-tag searches - like homestuck+hs+hamsteak. Scrape by /tagged and /page, populate post_urls, de-dupe and sort. 
	// Of course then I'd want it to 'just work' with the existing post-by-post image browser, which... probably won't happen. I'm loathe to recreate it exactly or inexactly. 

// This needs some method to find /post numbers from /page and /tagged pages. 
	// Maybe trigger a later post-by-post function from a modified scrapewholesite approach? Code quality is a non-issue right now. 
	// Basically have to fill some array post_urls with /post URLs (strings) and then call scrape_post_urls(). Oh, that array is global. This was already a janky first pass. 
	// Instead of XML files, use /page or /page + /mobile... pages. 
	// Like 'if /tagged/something then grab all links and filter for indexof /post.' 

// This is the landing function for this mode - it grabs sitemap.xml, parses options, sets any necessary variables, and invokes scrape_sitemap_x for sitemap1 and so on.
function scrape_sitemap() {
	document.title += ' sitemap'; 

	// Flow control.
	// Two hard problems. Structure now, names later. 
	if( options_map.sitemap ) { 
		mydiv.innerHTML += "<br>Completion: <div id='pagecounter'>0%</div><div id='afterpagecounter'></div><br>";		// This makes it easier to view progress,
		let final_sitemap = 0; 		// Default: no recursion. 'Else considered harmful.' 
		if( options_map.xmlcount ) { final_sitemap = options_map.xmlcount; } 		// If we're doing the whole site, indicate the highest sitemap and recurse until you get there. 
		scrape_sitemap_x( options_map.sitemap, final_sitemap ); 
	} else { 
		// Could create a div for this enumeration of sitemapX files, and always have it at the top. It'd get silly for tumblrs with like a hundred of them. 
		// Maybe at the bottom? 
		fetch( window.location.protocol + "//" + window.location.hostname + '/sitemap.xml', { credentials: 'include' } ) 		// Grab text-like file 
		.then( r => r.text() )
		.then( t => { 		// Process the text of sitemap.xml
			let sitemap_list = t.split( '<loc>' ); 
			sitemap_list.shift(); 		// Get rid of data before first location 
			sitemap_list = sitemap_list.map( e => e.split('</loc>')[0] ); 		// Terminate each entry 
			sitemap_list = sitemap_list.filter( e => { return e.indexOf( '/sitemap' ) > 0 && e.indexOf( '.xml' ) > 0; } ); 		// Remove everything but 'sitemapX.xml' links 

			mydiv.innerHTML += '<br>' + window.location.hostname + ' has ' + sitemap_list.length + ' sitemap XML file'; 
			if( sitemap_list.length > 1 ) { mydiv.innerHTML += 's'; } 		// Pluralization! Not sexy, just functional. 
	//		mydiv.innerHTML += ' (Up to ' + sitemap_list.length * 500 + ' posts.) <br>'
			mydiv.innerHTML += '. (' + Math.ceil(sitemap_list.length  / 2) + ',000 posts or fewer.)<br><br>' 		// Kludge math, but I pefer this presentation. 
			if( sitemap_list.length > 50 ) { mydiv.innerHTML += 'Sitemaps past 50 may not work.<br><br>'; } 		// Pluralization! Not sexy, just functional. 
			// List everything: <Links only>
			// List sitemap1: <Links only> or <Links & thumbnails> 
			// List sitemap2: <Links only> or <Links & thumbnails> etc. 
			mydiv.innerHTML += 'List everything: ' + '<a href=' + options_url( { sitemap:1, xmlcount:sitemap_list.length } ) + '>Links only</a> - <a href=' + options_url( { sitemap:1, xmlcount:sitemap_list.length, story:true, usemobile:true } ) + '>Links and text (stories)</a><br><br>'; 
			if( options_map.find && options_map.lastpage ) {
				mydiv.innerHTML += 'List just this tag (' + options_map.find + '): ' + '<a href=' + options_url( { sitemap:1, xmlcount:options_map.lastpage, tagscrape:true } ) + '>Links only</a> - <a href=' + options_url( { sitemap:1, xmlcount:options_map.lastpage, story:true, usemobile:true, tagscrape:true } ) + '>Links and text (stories)</a><br><br>'; 
			} 
//	mydiv.innerHTML += "<br><h1><a id='browse10' href='" + options_url( {scrapemode:'pagebrowser', thumbnails:true} ) +"'>Browse images (10 pages at once)</a> </h1>"; 
			for( n = 1; n <= sitemap_list.length; n++ ) { 
				let text_link = 		options_url( { sitemap:n } ); 
				let images_link = 	options_url( { sitemap:n, thumbnails:'xml' } ); 
				let story_link = 		options_url( { sitemap:n, story:true, usemobile:true } ); 
				mydiv.innerHTML += 'List sitemap' + n + ': ' + '<a href=' + text_link + '>Links only</a> <a href=' + images_link + '>Links & thumbnails</a> <a href=' + story_link + '>Links & text</a><br>' 
			} 
		} )
	}
}

// Text-based scrape mode for sitemap1.xml, sitemap2.xml, etc. 
function scrape_sitemap_x( sitemap_x, final_sitemap ) { 
	document.title = window.location.hostname + ' - sitemap ' + sitemap_x; 		// We lose the original tumblr's title, but whatever. 
	if( sitemap_x == final_sitemap ) { document.title = window.location.hostname + ' - sitemap complete'; } 
	if( options_map.story ) { document.title += ' with stories'; } 

	// Last-minute kludge: if options_map.tagscrape, use /page instead of any xml, get /post URLs matching this domain. 
		// Only whole-hog for now - sitemap_x might allow like ten or a hundred pages at once, later.

	var base_site = window.location.protocol + "//" + window.location.hostname; 		// e.g. http://example.tumblr.com  
	var sitemap_url = base_site + '/sitemap' + sitemap_x + '.xml'; 

	if( options_map.tagscrape ) {
		sitemap_url = base_site + options_map.find + '/page/' + sitemap_x; 
		 document.title += ' ' + options_map.find.replace( /\//g, ' '); 		// E.g. 'tagged my-stuff'. 
	}

	mydiv.innerHTML += "Finding posts from " + sitemap_url + ".<br>"; 
	fetch( sitemap_url, { credentials: 'include' } ) 		// Grab text-like file 
	.then( r => r.text() ) 		// Get txt from HTTP response
	.then( t => { 		// Process text to extract links
		let location_list = t.split( '<loc>' ); 		// Break at each location declaration
		location_list.shift(); location_list.shift(); 		// Ditch first two elements. First is preamble, second is base URL (e.g. example.tumblr.com). 
		location_list = location_list.map( e => e.split( '</loc>' )[0] ); 		// Terminate each entry at location close-tag 

		if( options_map.tagscrape ) { 
			// Fill location_list with URLs on this page, matching this domain, containing e.g. /post/12345. 
			// Trailing slash not guaranteed. Quote terminator unknown. Fuck it, just assume it's all doublequotes. 
			location_list = t.split( 'href="' ); 
			location_list.shift(); 
			location_list = location_list.map( e => e.split( '"' )[0] ); 		// Terminate each entry at location close-tag 
			location_list = location_list.filter( u => u.indexOf( window.location.hostname + '/post' ) > -1 ); 
			location_list = location_list.filter( u => u.indexOf( '/embed' ) < 0 ); 
			location_list = location_list.filter( u => u.indexOf( '#notes' ) < 0 ); 		// I fucking hate this website. 
			// https://www.facebook.com/sharer/sharer.php?u=https://shamserg.tumblr.com/post/55985088311/knight-of-vengence-by-shamserg
			// I fucking hate the web. 
			location_list = location_list.map( e => window.location.protocol + '//' + window.location.hostname + e.split( window.location.hostname )[1] ); 
//			location_list = location_list.filter( u => u.indexOf( '?ezastumblrscrape' ) <= 0 ); 		// Exclude links to this script. (Nope, apparently that's introduced elsewhere. WTF.) 
			// Christ, https versus http bullshit AGAIN. Just get it done.
//			location_list = location_list.map( e => window.location.protocol + '//' + e.split( '//' )[1] ); 		// http -> https, or https -> http, as needed. 
			// I don't think I ever remove duplicates. On pages with lots of silly "sharing" bullshit, this might grab pages multiple times. Not sure I care. Extreme go horse. 
		} 

		// location_list should now contain a bunch of /post/12345 URLs. 
		if( options_map.usemobile ) { location_list = location_list.map( (url) => { return url + '/mobile' } ); } 
		console.log( location_list ); 
//		return location_list; 		// Promises are still weird. (JS's null-by-default is also weird.) 
		post_urls = post_urls.concat( location_list ); 		// Append these URLs to the global array of /post URLs. (It's not like Array.push() because fuck you.) 
//		console.log( post_urls ); 
		// It seems like bad practice to recurse from here, but for my weird needs it seems to make sense. 
		if( sitemap_x < final_sitemap ) { 
			scrape_sitemap_x( sitemap_x + 1, final_sitemap ); 		// If there's more to be done, recurse.
		} else { 
			scrape_post_urls(); 		// If not, fetch & display all these /post URLs. 
		} 
	} ) 

}

// Fetch all the URLs in the global array of post_urls, then display contents as relevant 
function scrape_post_urls() {
	// Had to re-check how I did rate-limited fetches for the monolithic main scraper. It involved safe levels of 'wtf.' 
	// Basically I put n URLs in an array, or an array of fetch promises I guess, then use promise.all to wait until they're all fetched. Repeat as necessary. 
	// Can I use web workers? E.g. instantiate 25 parallel scripts that each shift from post_urls and spit back HTML. Ech. External JS is encouraged and DOM access is limited.
	// Screw it, batch parallelism will suffice. 
	// Can I define a variable as a function? I mean, can I go var foobar = function_name, so I can later invoke foobar() and get function_name()?
		// If so: I can pick a callback before all of this, fill a global array with e.g. [url, contents] stuff, and jump to a text- or image-based display when that's finished. 
		// Otherwise I think I'm gonna be copying myself a lot in order to display text xor images. 

	// Create divs for each post? This is going to be a lot of divs. 
	// 1000 is fine for the traditional monolithic scrape mode, but that covers ten or twenty times as many posts as a single sitemapX.xml. 
	// And it probably doesn't belong right here. 
	// Fuck it, nobody's using this unless they read the source code. Gotta build something twice to build it right.

	// Create divs for each post, so they can be fetched and inserted asynchronously
	post_urls.forEach( (url) => {
		let new_div = document.createElement( 'div' ); 
		new_div.id = '' + url; 
		document.body.appendChild( new_div ); 
	} )

	// Something in here is throwing "Promise rejection value is a non-unwrappable cross-compartment wrapper." I don't even know what the fuck. 
	// Apparently Mozilla doesn't know what the fuck either,  because all discussion of this seems to be 'well it ought to throw a better error.' 
	// Okay somehow this happens even with everything past 'console.log( order_array );' commented out, so it's not actually a wrong thing involving the Promise nest. Huh. 
	// It's the for loop. 
	// Is it because we try using location_list.length? Even though it's a global array and not a Promise? And console.log() has no problem... oh, console.log quietly chokes.
	// I'm trying to grab a sitemap2 that doesn't exist because I was being clever in opposite directions. 
	// Nope, still shits the bed, same incomprehensible error. Console.log shows location_list has... oh goddammit. location_list was the local variable; post_urls is the global. 
	// Also array.concat doesn't work for some reason. post_urls still has zero elements. 
	// Oh for fuck's sake it has no side effects! You have to do thing=thing.concat()! God damn the inconsistent behavior versus array.push! 

	// We now get as far as chain=chain.then and the first console.log('foobar'), but it happens exactly once. 
	// Splicing appears to happen correctly. 
	// We enter responses.map, and the [body of post, post url] array is passed correctly and contains right-looking data. 
	// Ah. links_from_text is not a function. It's links_from_page. Firefox, that's a dead simple error - say something. 

	// Thumbnails? True thumbnails, and only for tumblr images with _100 available. Still inadvisable for the whole damn tumblr at once. 
	// So limit that to single-sitemap modes (like linking out to 1000-pages-at-once monolithic scrapes) and call it good. 500 thumbnails is what /archive does anyway. 

	// Terrible fix for unique tags: can I edit CSS from within the page? Can I count inside that?
	// I'd be trying to do something like <tag id='my_art>my_art</tag> and increment some tags['my_art'] value - then only show <tag> with a corresponding value over one. 

	// Utter hack: I need to get the text of each /post to go above or below it. The key is options_map( 'story' ) == true. 
	// Still pass it as a "link" string. Prepend with \n or something, a non-URL-like control character, which we're okay to print accidentally. Don't link that "link." 
	// /mobile might work? Photosets show up as '[video]', but some text is in the HTML. Dunno if it's everything. 
		// Oh god they're suddenly fucking with mobile. 
		// In /mobile, get everything from '</h1>' to '<div id="navigation">'. 

	var simultaneous_fetches = 25;
	var order_array = new Array; 		// No reason to show immediate results, so fill with n, n, n until the sum matches the number of URLs. 
	for( x = post_urls.length; x > simultaneous_fetches; x -= simultaneous_fetches ) { 
		order_array.push( simultaneous_fetches ); 
	}

	if( x != 0 ) { order_array.push( x ); } 		// Any remainder from counting-down for() loop becomes the last element

//	console.log( order_array ); 
//	order_array = [5,5]; 		// Debug - limits fetches to just a few posts 

	var chain = Promise.resolve(0); 		// Empty promise so we can use "then" 

	order_array.forEach( (how_many, which_entry) => {
		chain = chain.then( s => { 
//			console.log( 'foobar' ); 
			var subarray = post_urls.splice( 0, how_many ); 		// Shift some number of elements into a separate array, for partial array.map
//			console.log( 'foobar2', subarray ); 
			return Promise.all( subarray.map( post_url => 
				Promise.all( [ fetch( post_url, { credentials: 'include' } ).then( s => s.text() ), post_url ] ) 		// Return [body of post, post URL] 
			) ) 
		} )
		. then( responses => responses.map( s => { 
//				console.log( 'foobar3', s ); 
				var post_url = s[1]; 
				// var url_array = soft_scrape_page_promise( s[0] ) 		// Surprise, this is a promise now 
				// Wait, do I need it to be a promise? Because otherwise I might prefer to use links_from_text(). 
				var sublinks = links_from_page( s[0] ); 

				let tag_links = sublinks.filter( return_tags ); 		// Copy tags into some new array. No changes to other filters required! (Test on eixn, ~2000 pages.) 
				tag_links = tag_links.filter( u => u.indexOf( '?ezastumblrscrape' ) < 0 ); 

				// Do we want to filter down to images for this scrape function? It's not necessarily displaying them. 
				// Arg, you almost have to, to filter out the links to tumblrs that reblogged each post. 
				sublinks = sublinks.filter( s => { return s.indexOf( '.jpg' ) > 0 || s.indexOf( '.jpeg' ) > 0 || s.indexOf( '.png' ) > 0 || s.indexOf( '.gif' ) > 0; } ); 

				sublinks = sublinks.filter( tumblr_blacklist_filter ); 			// Remove avatars and crap
				sublinks = sublinks.map( image_standardizer ); 	// Clean up semi-dupes (e.g. same image in different sizes -> same URL) 
				sublinks = sublinks.filter( novelty_filter ); 				// Global duplicate remover

//				sublinks = sublinks.concat( tag_links ); 		// Add tags back in. Not ideal, but should be functional. 

				if( options_map.story ) { 
					// Janky last-ditch text ripping, because Tumblr is killing NSFW sites:
					// Assume we're using /mobile. Grab everything between the end of the blog name and the standard navigation div. 
	//				let story_start = s[0].indexOf( '</h1>' ) + 5;
					let story_start = s[0].indexOf( '<p>' ) + 3;  		// Better to skip ahead a bit instead of showing the <h2> date 
					let story_end = s[0].indexOf( '<div id="navigation">' ); 
					let story = s[0].substring( story_start, story_end ); 
					// Problem: images are still showing up. We sort of don't want that. Clunk. 
					story = story.replace( /<img/g, '<notimg' );  // Clunk clunk clunk get it done. It is extreme go horse time. 
					// I should really convert inline images to links. 
					// Embedded videos what the fuck? 
					story = story.replace( /<iframe/g, '<notiframe' );  // Clunk clunk clunk! 
					story = story.replace( /<style/g, '<notstyle' );  // CLUNK CLUNK. 
					//story = story.replace( /<span/g, '<notspan' );  // Clunk?		// Oh, no. It's the /embed crap. 
					sublinks.push( story ); 		// This is just an array of strings, right? 
	//				console.log( story ); 		// DEBUG 
				}

				// Oh right, this doesn't really return anything. We arrange and insert HTML from here. 
				var bulk_string = "<br><a href='" + post_url + "'>" + post_url + "</a><br>"; 		// A digest, so we can update innerHTML just once per div
				sublinks.forEach( (link) => { 
					let contents = link; 
					if( options_map.thumbnails == 'xml' && link.indexOf( '_1280' ) > -1 ) { 		// If we're showing thumbnails and this image can be resized, do, then show it
						let img = link.replace( '_1280', '_100' ); 
						contents = '<img src=' + img + '>' + link; 		// <img> deserves a class, for consistent scale. 
					}
					this_link = '<a href ="' + link + '">' + contents + '</a><br>'; 

					// How is this not what's causing the CSS bleed? 
//					if( link.substring(0) == '\n' ) { 		// If this is text
					if( link.indexOf( '\n' ) > -1 ) { 		// If this is text
						this_link = link; 
					}

					bulk_string += this_link; 
				} )

				var tag_string = ""; 

				tag_links.forEach( (link) => {
//					let tag = link.split( '/tagged/' )[1]
					tag_string += '#' + link.split( '/tagged/' )[1] + ' '; 
				} )
				bulk_string += tag_string + "<br>"; 

				// Tags should be added here. If we have them. 
//				console.log( bulk_string ); 
				document.getElementById( '' + post_url ).innerHTML = bulk_string; 		// Yeeeah, I should probably create these div IDs before this happens. 
				// And here's where I'd increase the page counter, if we had one. 
				// Let's use order_array to judge how done we are - and make it a percent, not a page count. Use order_array.length and pretend the last element's the same size. 
//				document.getElementById( 'pagecounter' ).innerHTML = '%'; 
				// No wait, we can't do it here. This is per-post, not per-page. Or... we could do it real half-assed.
			} )
		)
		.then( s => { 		// I don't think we take any actual data here. This just fires once per 'responses' group, so we can indicate page count etc. 
			let completion = Math.ceil( 100 * (which_entry+1) / order_array.length ); 		// Zero-ordinal index to percentage. Blugh. 
			document.getElementById( 'pagecounter' ).innerHTML = '' + completion + '%'; 
		} ) 
	} )

	// "Promises allow a flat execution pattern!" Fuck you, you liars. Look at that rat's nest of alternating braces. 
	// If you've done all the work in spaghetti functions somewhere else, maybe it's fine, but if you want code to happen where it fucking starts, anonymous functions SUCK. 

} 









// ------------------------------------ Post-by-post scraper with embedded images ------------------------------------ //









// Scrape each page for /post/ links, scrape each /post/ for content, display in-order with less callback hell
// New layout & new scrape method - not required to be compatible with previous functions 
function new_embedded_display() {
	if( isNaN( parseInt( options_map.startpage ) ) || options_map.startpage <= 1 ) { options_map.startpage = 1; } 

	mydiv.innerHTML += "<center>" + html_previous_next_navigation() + "<br><br>" + html_page_count_navigation() + "</center><br>"; 
	document.getElementById("bottom_controls_div").innerHTML += "<center>" + html_page_count_navigation() + "<br><br>" + html_previous_next_navigation() + "</center>"; 

	// Links out from this mode - scrapewholesite, original mode, maybe other crap 
	//mydiv.innerHTML += "This mode is under development and subject to change.";		// No longer true. It's basically feature-complete. 
//	mydiv.innerHTML += " - <a href=" + options_url( { everypost:false } ) + ">Return to original image browser</a>" + "<br>" + "<br>"; 
	mydiv.innerHTML += "<br>" + html_ezastumblrscrape_options() + "<br><br>"; 

	// "Pages 1 to 10 (of 100) from http://example.tumblr.com" 
	mydiv.innerHTML += "Pages " + options_map.startpage + " to " + (options_map.startpage + options_map.pagesatonce - 1); 
	if( !isNaN(options_map.lastpage) ) { mydiv.innerHTML += " (of " + options_map.lastpage + ")"; } 
	mydiv.innerHTML += " from " + site_and_tags + "<br>"; 

	mydiv.innerHTML += image_size_options() + "<br><br>"; 
	mydiv.innerHTML += image_resolution_options() + "<br><br>"; 

	// Messy inline function for toggling page breaks - they're optional because we have post permalinks now 
	mydiv.innerHTML += "<a href='javascript: void(0);' class='interactive'; onclick=\"(function(o){ \
		let mydiv = document.getElementById('maindiv'); \
		if( mydiv.className == '' ) { mydiv.className = 'showpagelinks'; } \
		else { mydiv.className = ''; } \
		})(this)\">Toggle page breaks</a><br><br>";

	mydiv.innerHTML += "<span id='0'></span>"; 		// Empty span for things to be placed after. 
	posts_placed.push( 0 ); 		// Because fuck special cases.

	// Scrape some pages
	for( let x = options_map.startpage; x < options_map.startpage + options_map.pagesatonce; x++ ) {
		fetch( site_and_tags + "/page/" + x, { credentials: 'include' }  ).then( r => r.text() ).then( text => {
			scrape_by_posts( text, x ); 
		} )
	}
}



// Take the HTML from a /page, fetch the /post links, display images 
// Probably ought to be despaghettified and combined with the above function, but I was fighting callback hell -hard- after the last major version
// Alternately, split it even further and do some .then( do_this ).then( do_that ) kinda stuff above. 
function scrape_by_posts( html_copy, page_number ) {
//	console.log( page_dupe_hash ); 		// DEBUG 
	let posts = links_from_page( html_copy ); 		// Get links on page
	posts = posts.filter( link => { return link.indexOf( '/post/' ) > 0 && link.indexOf( '/photoset' ) < 0; } ); 		// Keep /post links but not photoset iframes 
	posts = posts.map( link => { return link.replace( '#notes', '' ); } ); 		// post/1234 is the same as /post/1234#notes 
	posts = posts.filter( link => link.indexOf( window.location.host ) > 0 ); 		// Same-origin filter. Not necessary, but it unclutters the console. Fuckin' CORS. 
	if( page_number != 1 ) { posts = posts.filter( novelty_filter ); }		// Attempt to remove posts linked on every page, e.g. commission info. Suffers a race condition. 
	posts = remove_duplicates( posts ); 		// De-dupe 
	// 'posts' now contains an array of /post URLs 

	// Display link and linebreak before first post on this page
	let first_id = posts.map( u => parseInt( u.split( '/' )[4] ) ).sort(  ).pop(); 		// Grab ID from its place in each URL, sort accordingly, take the top one
	let page_link = "<span class='pagelink'><hr><a target='_blank' href='" + site_and_tags + "/page/" + page_number + "'> Page " + page_number + "</a>"; 
	if( posts.length == 0 ) { first_id = 1; page_link += " - No images found."; } 		// Handle empty pages with dummy content. Out of order, but whatever.
	page_link += "<br><br></span>"; 
	display_post( page_link, first_id + 0.5 ); 		// +/- on the ID will change with /chrono, once that matters 

	posts.map( link => { 

		fetch( link, { credentials: 'include' } ).then( r => r.text() ).then( text => {

			let sublinks = links_from_page( text ); 
			sublinks = sublinks.filter( s => { return s.indexOf( '.jpg' ) > 0 || s.indexOf( '.jpeg' ) > 0 || s.indexOf( '.png' ) > 0 || s.indexOf( '.gif' ) > 0; } ); 
			sublinks = sublinks.filter( tumblr_blacklist_filter ); 			// Remove avatars and crap
			sublinks = sublinks.map( image_standardizer ); 	// Clean up semi-dupes (e.g. same image in different sizes -> same URL) 
			sublinks = sublinks.filter( novelty_filter ); 				// Global duplicate remover
			// Oh. Photosets sort of just... work? That might not be reliable; DownThemAll acts like it can't see the iframes on some themes. 
			// Yep, they're there. Gonna be hard to notice if/when they fail. Oh well, "not all images are guaranteed to appear." 
			// Videos will still be weird. (But it does grab their preview thumbnails.) 
			// Wait, can I filter reblogs here? E.g. with a ?noreblogs flag, and then checking if any given post has via/source links. Hmm. Might be easier in /mobile pages. 

			// Seem to get a lot of duplicate images? e.g. both 
			// https://media.tumblr.com/tumblr_m2gktkD7u31qdcy3io1_640.jpg and
			// https://media.tumblr.com/tumblr_m2gktkD7u31qdcy3io1_1280.jpg
			// Oh! Do I just not handle _640? 

			// Get ID from post URL, e.g. http//example.tumblr.com/post/12345/title => 12345 
			let post_id = parseInt( link.split( '/' )[4] ); 		// 12345 as a NUMBER, not a string, doofus

			if( sublinks.length > 0 ) { 		// If this post has images we're displaying - 
				let this_post = new String;
				sublinks.map( url => {
					this_post += '<span class="container">'; 
					this_post += '<a target="_blank" id="' + encodeURI( url ) + '" href="' + url + '">'; 
					this_post += '<img onerror=\'' + error_function( url ) + '\' id="'+url+'" src="' + url + '"></a>'; 
					this_post += '<span class="postlink"><a target="_blank" href="' + link + '">Permalink</a></span></span> '; 
				} )
				display_post( this_post, post_id ); 
			}

		} )

	} )
}

// Place content on page in descending order according to post ID number 
// Consider rejiggering the old scrape method to use this. Move to 'universal' section if so. Alter or spin off to link posts instead? 
// Turns out I never implemented ?chrono or ?reverse, so nevermind that for now.
// Remember to set options_map.chrono if ?find contains /chrono or whatever.  
function display_post( content, post_id ) { 
	let this_node = document.createElement( "span" );
	this_node.innerHTML = content; 
	this_node.id = post_id

	// Find lower-numbered node than post_id
	let target_id = posts_placed.filter( n => n <= post_id ).sort(  ).pop(); 		// Take the highest number less than (or equal to) post_id 
	if( options_map.find.indexOf( '/chrono' ) > 0 ) { 
		target_id = posts_placed.filter( n => n <= post_id ).sort(  ).shift();  		// Take the... fuck... lowest? What am I doing again?
		// Fuuuck, this is really inconsistent. Nevermind the looney-toons syntax I used here, =>n<=. 
		// Screw it, use the old scraper for now. 
	}
	let target_node = document.getElementById( target_id );

	// http://stackoverflow.com/questions/4793604/how-to-do-insert-after-in-javascript-without-using-a-library 
	target_node.parentNode.insertBefore( this_node, target_node ); 		// Insert our span after the lower-ID node
	posts_placed.push( post_id ); 		// Remember that we added this ID

	// No return value 
}

// Return ascending or descending order depending on "chrono" setting 
// function post_order_sort( a, b ) 









// ------------------------------------ Specific handling for www.tumblr.com (tag search, possibly dashboard) ------------------------------------ //









// URLs like https://www.tumblr.com/tagged/wooloo?before=1560014505 don't follow easy sequential pagination, so we have to (a) be linear or (b) guess. First whack is (a). 
// Tumblr dashboard is obvious standardized, so we can make assumptions about /post links in relation to images.
// We do not fetch any individual /posts. We can't. They're on different subdomains, and Tumblr CORS remains tight-assed. But we can link them like in the post scrape mode. 
	// Ooh, I could maybe get "behind the jump" content via /embed URLs. Posts here should contain the blog UUID and a post number. 

// Copied notes from above:
// https://www.tumblr.com/tagged/homestuck sort of works. Trouble is, pages go https://www.tumblr.com/tagged/homestuck?before=1558723097 - ugh. 
	// Next page is https://www.tumblr.com/tagged/homestuck?before=1558720051 - yeah this is a Unix timestamp. It's epoch time. 
	// https://www.tumblr.com/dashboard/2/185117399018 - but this one -is- based on /post numbers. Tumblr.com: given two choices, take all three. 
	// Being able to scrape and archive site-wide tags or your own dashboard would be useful. Dammit. 
		// Just roll another mode into this script. It's already a hot mess. The new code just won't run on individual blogs. 
// Okay, so dashboard and site-wide tag modes.
	// Dashboard post numbers don't have to be real post numbers. Tag-search timestamps obviously don't have to relate to real posts. 
	// We de-dupe, so overkill is fine... ish. Tumblr's touchy about "rate limit exceeded" these days. 
// Tag scrape would be suuuper useful if we can grab blog posts from www.tumblr.com. Like "hiveswapcomicscontest." 

// Still no luck on scraping dashboard-only blogs. Bluh. 
	// This is so aggravating. I can see the content, obviously. "View page source" just returns the dashboard source. But document.body.outerHTML contains the blog proper. 
// Consider /embed again: 
	// https://embed.tumblr.com/embed/post/4RwtewsxXp-k1ReCcdAgXg/185288559546?width=542&language=en_US&did=a5c973d33a43ace664986204d72d7739de31b614 
	// This works but provides no previous/next link. (We need the ID, but we can get it from www.tumblr.com, then redirect.) 
// Using DaveJaders for testing. https://davejaders.tumblr.com/archive does not redirect, so we can use that for same-origin fetches. Does /page stuff work? 
	// fetch( '/' ).then( r => r.text() ).then( t => document.body.outerHTML = t ) - CORS failure. "The Same Origin Policy disallows reading the remote resource at https://www.tumblr.com/login_required/davejaders . (Reason: CORS header ‘Access-Control-Allow-Origin’ missing)." Fuck me again, apparently. 
// Circle back to dashboard-only blogs by showing the actual content. Avoid clearing body.innerHTML, let Tumblr do its thing, interact with the sidebar deal. 

// I could still estimate page count, using a binary search. Assuming constant post rates. 
	// Or, get fancy, and estimate total posts from time between posts on sparse samples. Each fetch is ten posts in-order. 
	// It does say "No posts found." See https://www.tumblr.com/tagged/starlight-brigade?before=1503710342 
	// Between the ?before we fetch and the Next link, we have the span of time it took for ten posts to be made. I would completely exclude the "last" page, if found. 
	// I guess... integrate in blocks? E.g., given a data point, assume that rate continues to the next data point. Loose approximations are fine. 
	// E.g. push timestamp/rate pairs into an array, sort by timestamp, find delta between each timestamp, and multiply each rate by each period. One period is bidirectional. 
	// Lerping is not meaningfully harder. It's the above, plus each period times half the difference between the rates at either end of that period. 
// Specific date entry? input type = "date". 
	// Specific date entry is useful and simple enough to finish before posting a new version. Content estimation can wait. 
	// Oh, idiot: make the "on or before" display also the navigation mechanic. 

// We now go right here for any ?ezastumblrscrape URL on www.tumblr.com. Sloppy but functional. 
function scrape_www_tagged( ) {
	// ?find=/tagged/whatever is already populated by existing scrape links, but any ?key=value stuff gets lost. 
	// (If no ?before=timestamp, fetch first page. ?before=0 works. Some max_int would be preferable for sorting. No exceptions needed, then.) 
	is_first_page = false; 		// Implicit global, eat me. Clunk. 
	if( isNaN( options_map.before ) ) { 
		options_map.before = parseInt( Date.now() / 1000 );  		// Current Unix timestamp in seconds, not milliseconds. The year is not 51413.
		is_first_page = true; 
	}
	if( options_map.before > parseInt( Date.now() / 1000 ) ) { is_first_page = true; } 		// Also handle when going days or years "into the future." 

	// Standard-ish intial steps: clear page (handled), add controls, maybe change window title. 
	// We can't use truly standard prev/next navigation. Even officially, you only get "next" links. (Page count options should still work.) 
	let www_tagged_next = "<a class='www_next' href='" + options_url() + "'>Next >>></a>"; 
	let pages_www_tagged = ""; 
	pages_www_tagged += "<a class='www_next' href='" + options_url( {"pagesatonce": 10} ) + "'> 10</a>, "; 
	pages_www_tagged += "<a class='www_next' href='" + options_url( {"pagesatonce": 5} ) + "'> 5</a>, "; 
	pages_www_tagged += "<a class='www_next' href='" + options_url( {"pagesatonce": 1} ) + "'> 1</a> - >>>"; 

	// Periods of time, in seconds, because Unix epoch timestamps. 
	let one_day = 24 * 60 * 60; 
	let one_week = one_day * 7; 
	let one_year = one_day * 365.24; 		// There's no reason not to account for leap years. 

	let approximate_place = "Posts <a href='" + options_map.find + "'>" + options_map.find.split('/').join(' ') + "</a>"; 		// options_map.find as relative link. Convenient. 
	let date_string = new Date( options_map.before * 1000 ).toISOString().slice( 0, 10 ); 
	approximate_place += " on or before <input type='date' id='on_or_before' value='" + date_string + "'>"; 
	// How do I associate this entry with the button so that pressing Enter triggers the button? Eh, minor detail. 

	let coverage = "<span id='coverage'></span>"; 		// Started writing this string, then realized I can't know its value until all pages are fetched. 

	let time_www_tagged = "";		// Browse forward / backward by day / week / year. 
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before + one_day} ) + "'><<< </a> One day";
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before - one_day} ) + "'> >>></a> - ";
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before + one_week} ) + "'><<< </a> One week";
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before - one_week} ) + "'> >>></a> - ";
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before + one_year} ) + "'><<< </a> One year";
	time_www_tagged += "<a href='" + options_url( {"before": options_map.before - one_year} ) + "'> >>></a>";

	// Change the displayed date and it'll go there. Play stupid games, win stupid prizes. 
	let jump_button_code = 'window.location +=  "?before=" + parseInt( new Date( document.getElementById( "on_or_before" ).value ).getTime() / 1000 );';  
	let date_jump = "<button onclick='" + jump_button_code + "'>Go</button>"; 

	mydiv.innerHTML += "<center>" + www_tagged_next + "<br><br>" + pages_www_tagged + "</center><br>";  
	mydiv.innerHTML += "<center>" + approximate_place + date_jump + "<br>" + coverage + "<br>" + time_www_tagged + "</center>"; 
	mydiv.innerHTML += "This mode is under development and subject to change.<br><br>"; 
	document.getElementById("bottom_controls_div").innerHTML += "<center>" + pages_www_tagged + "<br><br>" + www_tagged_next + "</center>";  

	mydiv.innerHTML += image_size_options() + "<br><br>"; 
	mydiv.innerHTML += image_resolution_options() + "<br><br>"; 

	// Fetch first page specified by ?before=timestamp. 
	let tagged_url = "" + options_map.find + "?before=" + options_map.before; 		// Relative URLs are guaranteed to be same-domain, even if they're garbage. 
	fetch( tagged_url, { credentials: 'include' }  ).then( r => r.text() ).then( text => { 
		display_www_tagged( text, options_map.before, options_map.pagesatonce ); 		// ... pagesatonce gets set in the pre-amble, right? It should have a default. 
 		// Optionally we could check here if options_map.before == 0 and instead send max_safe_integer. 
	} )
}

// Either we need a global variable for how many more pages per... page... or else I should pass a how_many_more value to this recursive function. 
function display_www_tagged( content, timestamp, pages_left ) {
	// First, grab the Next link - i.e. its ?before=timestamp value.
//	let next_timestamp_index = content.lastIndexOf( '?before=' ); 
//	let next_timestamp = content.substring( next_timestamp_index + 8, content.indexOf( next_timestamp_index, '"' ) ); 		// Untested
	let next_timestamp = content.split( '?before=' ).pop().split( '"' ).shift(); 		// The last "?before=12345'" string on the page. Clunky but tolerable. 
	next_timestamp = "" + parseInt( next_timestamp ); 		// Guarantee this is a string of a number. (NaN "works.") Pages past the end may return nonsense. 
	if( pages_left > 1 ) { 		// If we're displaying more pages then fetch that and recurse.
		let tagged_url = "" + options_map.find + "?before=" + next_timestamp; 		// Relative URLs are guaranteed to be same-domain, even if they're garbage. 
//		console.log( tagged_url ); 
		fetch( tagged_url, { credentials: 'include' }  ).then( r => r.text() ).then( text => { 
			display_www_tagged( text, next_timestamp, pages_left - 1 ); 
		} )
	} else { 		// Otherwise put that timestamp in our constructed Next link(s). 
		// I guess... get HTMLcollection of elements for "next" links, and change each one. 
		// Downside: links will only change once the last page is fetched. We could tack on a ?before for every fetch, but it would get silly. Right? 
		let next_links = Array.from( document.getElementsByClassName( 'www_next' ) ); 		// I'm not dealing with a live object unless I have to. 
		for( link of next_links ) { link.href += "?before=" + next_timestamp; } 

		// Oh right, and update the header to guesstimate what span of time we're looking at. 
		let coverage = document.getElementById( 'coverage' ); 
		coverage.innerHTML += "Displaying "; 
		if( is_first_page ) { coverage.innerHTML += "the most recent "; } 		// Condition is no longer sensible, but it's a good placeholder. 
		// We can safely treat ?before as the initial timestamp. Perfect accuracy is not important. 
		let time_covered = Math.abs( options_map.before - next_timestamp ); 		// Absolute so I don't care if I have it backwards. 
		if( time_covered > 48 * 60 * 60 ) { coverage.innerHTML += parseInt( time_covered / (24*60*60) ) + " days of posts"; } 		// Over two days? Display days.
		else if( time_covered > 2 * 60 * 60 ) { coverage.innerHTML += parseInt( time_covered / (60*60) ) + " hours of posts"; } 		// Over two hours? Display hours. 
		else if( time_covered > 2 * 60 ) { coverage.innerHTML += parseInt( time_covered / 60 ) + " minutes of posts"; } 		// Over two minutes? Display minutes.
		else { coverage.innerHTML += " several seconds of posts"; } 		// Otherwise just say it's a damn short time. 
		if( time_covered == 0 ) { coverage.innerHTML = "Displaying the first available posts"; } 		// Last page, earlier posts. No "next" page. 
	}

	// Insert div for this timestamp's page. 
	let new_div = document.createElement( 'span' ); 		// Span, because divs cause line breaks. Whoops. 
	new_div.id = "" + timestamp; 
	let target_node = document.getElementById( 'bottom_controls_div' ); 
	target_node.parentNode.insertBefore( new_div, target_node ); 		// Insert each page before the footer. 
	let div_html = ""; 

	// Separate page HTML by posts. 
	// At least the "li" elements aren't nested, so I can terminate the last one on "</li>". Or... all of them. 
	let posts = content.split( '<li class="post_container"' );  
	posts.shift(); 
	posts.push( posts.pop().split( '</li>' )[0] ); 		// Terminate last element at </li>. Again, not great code, but clunk clunk clunk get it done. 

	// For each post: 
	for( post of posts ) { 
		// Extract images from each post. 
		let links = links_from_page( post ); 
		links = links.map( image_standardizer ); 		// This goes before grabbing the permalink because /post URLs do get standardized. No &media guff. 
		let permalink = links.filter( s => s.indexOf( '.tumblr.com/post' ) > 0 )[0]; 		// This has to go before de-duping, or posts linking to posts can leave permalinks blank. 
		links = links.filter( novelty_filter );
		links = links.filter( tumblr_blacklist_filter ); 
//		document.body.innerHTML += links.join( "<br>" ) + "<br><br>"; 		// Debug 

		// Separate the images. 
		let images = links.filter( s => s.indexOf( 'media.tumblr.com' ) > 0 ); 		// Note: this will exclude external images, e.g. embedded Twitter stuff. 

		// If this post has images:
		if( images.length > 0 ) { 			// Build HTML xor insert div for each post, to display images. 
			// Get /post URL, including blog name etc. 
			//let permalink = links.filter( s => s.indexOf( '.tumblr.com/post' ) > 0 )[0]; 

			let post_html = ""; 	
			for( image of images ) { 
				post_html += '<span class="container">'; 
				post_html += '<a target="_blank" id="' + encodeURI( image ) + '" href="' + image + '">'; 
				post_html += '<img onerror=\'' + error_function( image ) + '\' id="' + image + '" src="' + image + '"></a>'; 
				post_html += '<span class="postlink"><a target="_blank" href="' + permalink + '">Permalink</a></span></span> '; 
			} 
			div_html += post_html; 
		}
	}

	// Insert accumulated HTML into this div. 
	new_div.innerHTML = div_html; 
}









// ------------------------------------ HTML-returning functions for duplication prevention ------------------------------------ //









// Return HTML for standard Previous / Next controls (<<< Previous - Next >>>)
function html_previous_next_navigation() {
	let prev_next_controls = "";  
	if( options_map.startpage > 1 ) { 
		prev_next_controls += "<a href='" + options_url( "startpage", options_map.startpage - options_map.pagesatonce ) + "'><<< Previous</a> - "; 
	} 
	prev_next_controls += "<a href='" + options_url( "startpage", options_map.startpage + options_map.pagesatonce ) + "'>Next >>></a>";

	return prev_next_controls; 
}

// Return HTML for pages-at-once versions of previous/next page navigation controls (<<<  10,  5,  1 -  1,  5,  10 >>>) 
function html_page_count_navigation() {
	let prev_next_controls = "";  
	if( options_map.startpage > 1 ) { 		// <<< 10, 5, 1 - 
		prev_next_controls += "<<< "; 
		prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage - 1, "pagesatonce": 1} ) + "'> 1</a>, ";  
		prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage - 5, "pagesatonce": 5} ) + "'> 5</a>, "; 
		prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage - 10, "pagesatonce": 10} ) + "'> 10</a> - ";
	}
	prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage + options_map.pagesatonce, "pagesatonce": 10} ) + "'> 10</a>, ";
	prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage + options_map.pagesatonce, "pagesatonce": 5} ) + "'> 5</a>, ";  
	prev_next_controls += "<a href='" + options_url( {"startpage": options_map.startpage + options_map.pagesatonce, "pagesatonce": 1} ) + "'> 1</a> - ";  
	prev_next_controls += ">>>";  

	return prev_next_controls; 
}

// Return HTML for image-size options (changes via CSS or via URL parameters) 
// This used to work. It still works, in the new www mode I just wrote. What the fuck do I have to do for some goddamn onclick behavior? 
// "Content Security Policy: The page’s settings blocked the loading of a resource at self (“script-src https://lalilalup.tumblr.com https://assets.tumblr.com/pop/ 'nonce-OTA4NjViZmE2MzZkYTFjMjM1OGZkZGM1MzkwYWU4NTA='”)." What the fuck. 
// Jesus Christ, it might be yet again because of Tumblr's tightass settings: 
// https://stackoverflow.com/questions/37298608/content-security-policy-the-pages-settings-blocked-the-loading-of-a-resource
// The function this still works in is on a "not found" page. The places it will not work are /archive pages. 
// Yeah, on /mobile instead of /archive it works fine. Fuck you, Tumblr. 
// Jesus, that means even onError can't work. 
function image_size_options() {
	var html_string = "Immediate: \t"; 		// Change <body> class to instantly resize images, temporarily

	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('')\">Original image sizes</a> - "; 
	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('fixed-width')\">Snap columns</a> - "; 
	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('fixed-height')\">Snap rows</a> - "; 
	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('fit-width')\">Fit width</a> - "; 
	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('fit-height')\">Fit height</a> - "; 
	html_string += "<a class='interactive' href='javascript: void(0);' onclick=\"(function(o){ document.body.className = o; })('smart-fit')\">Fit both</a><br><br>"; 

	html_string += "Persistent: \t"; 		// Reload page with different image mode that will stick for previous/next pages
	html_string += "<a href=" + options_url( { thumbnails: "original" } ) + ">Original image sizes</a> - "; 		// This is the CSS default, so any other value works
	html_string += "<a href=" + options_url( { thumbnails: "fixed-width" } ) + ">Snap columns</a> - "; 
	html_string += "<a href=" + options_url( { thumbnails: "fixed-height" } ) + ">Snap rows</a> - "; 
	html_string += "<a href=" + options_url( { thumbnails: "fit-width" } ) + ">Fit width</a> - "; 
	html_string += "<a href=" + options_url( { thumbnails: "fit-height" } ) + ">Fit height</a> - "; 
	html_string += "<a href=" + options_url( { thumbnails: "smart-fit" } ) + ">Fit both</a>"; 
	return html_string; 
}

// Return HTML for links to ?maxres versions of the same page, e.g. "_raw" versus "_1280"
function image_resolution_options() {
	var html_string = "Maximum resolution: \t"; 
	html_string += "<a href=" + options_url( { maxres: "raw" } ) + ">Raw</a> - "; 		// I'm not 100% sure "_raw" works anymore, but the error function handles it, so whatever. 
	html_string += "<a href=" + options_url( { maxres: "1280" } ) + ">1280</a> - "; 	
	html_string += "<a href=" + options_url( { maxres: "500" } ) + ">500</a> - "; 	
	html_string += "<a href=" + options_url( { maxres: "400" } ) + ">400</a> - "; 	
	html_string += "<a href=" + options_url( { maxres: "250" } ) + ">250</a> - "; 	
	html_string += "<a href=" + options_url( { maxres: "100" } ) + ">100</a>"; 	
	return html_string; 
}

// Return links to other parts of Eza's Tumblr Scrape functionality, possibly excluding whatever you're currently doing 
// Switch to full-size images - Toggle image size - Show one page at once - Scrape whole Tumblr - (Experimental fetch-every-post image browser)
// This mode is under development and subject to change. - Return to original image browser
function html_ezastumblrscrape_options() {
	let html_string = ""; 

	// "You are browsing" text? Tell people where they are and what they're looking at. 
	html_string += "<a href='" + options_url( { scrapemode: "scrapewholesite" } ) + "'>Scrape whole Tumblr</a> - ";
	html_string += "<a href='" + options_url( { scrapemode: "pagebrowser" } ) + "'>Browse images</a> - "; 		// Default mode; so any value works
	html_string += "<a href='" + options_url( { scrapemode: "everypost" } ) + "'>(Experimental fetch-every-post image browser)</a> ";

	return html_string;
}

function error_function( url ) { 
	// This clunky <img onError> function looks for a lower-res image if the high-res version doesn't exist. 
	// Surprisingly, this does still matter. E.g. http://66.media.tumblr.com/ba99a55896a14a2e083cec076f159956/tumblr_inline_nyuc77wUR01ryfvr9_500.gif 
	// This might mismatch _100 images and _250 links because of that self-erasing clause... but it's super rare, so meh. 
	let on_error = 'if(this.src.indexOf("_raw")>0){this.src=this.src.replace("_raw","_1280").replace("//media","//66.media");}';		// Swap _raw for 1280, add CDN number 
	on_error += 'else if(this.src.indexOf("_1280")>0){this.src=this.src.replace("_1280","_500");}';		// Swap 1280 for 500
	on_error += 'else if(this.src.indexOf("_500")>0){this.src=this.src.replace("_500","_400");}';		// Or swap 500 for 400
	on_error += 'else if(this.src.indexOf("_400")>0){this.src=this.src.replace("_400","_250");}';		// Or swap 400 for 250
	on_error += 'else{this.src=this.src.replace("_250","_100");this.onerror=null;}';							// Or swap 250 for 100, then give up
	on_error += 'document.getElementById("' + encodeURI( url ) + '").href=this.src;'; 		// Link the image to itself, regardless of size

// 2020: This has to get more complicated, or at least more verbose, to support shitty new image URLs. 
// https://66.media.tumblr.com/eb7d40a8683e623f173f81fc253056dc/e4277131a4c174c7-a5/s1280x1920/5b3c54b53a09f91b08f9af7fb88e30a253f3c5db.jpg
//'s400x600'
//'s500x750'
//'s640x960'
//'s1280x1900'
// 's2048x3072' 
// This has to go in Image Glutton, because Tumblr only ever gets worse 

	// Start over. 
//	on_error = 'this.src = this.src.replace( "_250", "_100" ); '; 		// Unconditional, reverse ladder pattern. Don't Google that. I just made it up. 
	on_error = "let oldres = [ '_100', '_250', '_400', '_500', '_1280' ]; "; 		// Inverted quotes, Eh. 
	on_error += "let newres = [ 's400x600', 's500x750', 's640x960', 's1280x1920' ];"; 	// Should probably include slashes. Rare collisions. 
//	on_error += "for( let i = old.length-1; i > 1; i-- ) { this.src.replace( old[i], old[i-1] ); } "; 		// 1280 -> 500, 500 -> 400... shit.
	on_error += "for( let i = 1; i < oldres.length; i++ ) { this.src = this.src.replace( oldres[i+1], oldres[i] ); } "; // 250 -> 100, 400 -> 250, etc. One step per error.
	on_error += "for( let i = 1; i < newres.length; i++ ) { this.src = this.src.replace( newres[i+1], newres[i] ); } "; 
	on_error += 'document.getElementById("' + encodeURI( url ) + '").href=this.src;'; 		// Original quotes - be cautious when editing 

// God dammit. The links work, but the embedded images don't. 
// https://66.media.tumblr.com/eb7d40a8683e623f173f81fc253056dc/e4277131a4c174c7-a5/s1280x1920/ba0f0dd5d5e76726639782f57c4b732f156a5219.jpg
// https://66.media.tumblr.com/eb7d40a8683e623f173f81fc253056dc/e4277131a4c174c7-a5/s1280x1920/5b3c54b53a09f91b08f9af7fb88e30a253f3c5db.jpg

/*
x = 'https://66.media.tumblr.com/eb7d40a8683e623f173f81fc253056dc/e4277131a4c174c7-a5/s1280x1920/44b457df0d9826135b062563cd802afdfe496888.jpg'
newres = [ 's400x600', 's500x750', 's640x960', 's1280x1920' ];
for( let i = 1; i < newres.length; i++ ) { this.src.replace( newres[i+1], newres[i] ); }
*/

	return on_error; 
}









// ------------------------------------ Universal page-scraping function (and other helper functions) ------------------------------------ //









// Add URLs from a 'blank' page to page_dupe_hash (without just calling soft_scrape_page_promise and ignoring its results)
function exclude_content_example( url ) { 
	fetch( url, { credentials: 'include' } ).then( r => r.text() ).then( text => {
		let links = links_from_page( text );
		links = links.filter( novelty_filter ); 		// Novelty filter twice, because image_standardizer munges some /post URLs 
		links = links.map( image_standardizer ); 
		links = links.filter( novelty_filter ); 
	} )
	// No return value 
}

// Spaghetti to reduce redundancy: given a page's text, return a list of URLs. 
function links_from_page( html_copy ) {
	// Cut off the page at the "More you might like" / "Related posts" footer, on themes that have one
	html_copy = html_copy.split( '="related-posts' ).shift(); 

	let http_array = html_copy.split( /['="']http/ ); 		// Regex split on anything that looks like a source or href declaration 
	http_array.shift(); 		// Ditch first element, which is just <html><body> etc. 
	http_array = http_array.map( s => { 		// Theoretically parallel .map instead of maybe-linear .forEach or low-level for() loop 
		if( s.indexOf( "&" ) > -1 ) { s = htmlDecode( s ); } 		// Yes a fucking &quot should match a goddamn regex for terminating on quotes!
		s = s.split( /['<>"']/ )[0]; 		// Terminate each element (split on any terminator, take first subelement) 
		s = s.replace( /\\/g, '' ); 		// Remove escaping backslashes (e.g. http\/\/ -> http//) 
		if( s.indexOf( "%3A%2F%2F" ) > -1 ) { s = decodeURIComponent( s ); } 		// What is with all the http%3A%2F%2F URLs? 
//		s = s.split( '&quot;' )[0]; 		// Yes these count as doublequotes you stupid broken scripting language. 
		return "http" + s; 		// Oh yeah, add http back in (regex eats it) 
	} )		// http_array now contains an array of strings that should be URLs

	let post_array = html_copy.split( /['="']\/post/ ); 		// Regex split on anything that defines looks similar to a src="/post" link
	post_array.shift(); 		// Ditch first element, which is just <html><body> etc. 
	post_array = post_array.map( s => { 		// Theoretically parallel .map instead of maybe-linear .forEach or low-level for() loop 
		s = s.split( /['<>"']/ )[0]; 		// Terminate each element (split on any terminator, take first subelement) 
		return window.location.protocol + "//" + window.location.hostname + "/post" + s; 		// Oh yeah, add /post back in (regex eats it) 
	} )		// post_array now contains an array of strings that should be photoset URLs

	http_array = http_array.concat( post_array ); 		// Photosets are out of order again. Blar. 

	return http_array;
}

// Filter: Return false for typical Tumblr nonsense (JS, avatars, RSS, etc.)
function tumblr_blacklist_filter( url ) { 
	if( url.indexOf( "/reblog/" ) > 0 ||
		url.indexOf( "/tagged/" ) > 0 || 		// Might get removed so the script can track and report tag use. Stupid art tags like 'my-draws' or 'art-poop' are a pain to find. 
		url.indexOf( ".tumblr.com/avatar_" ) > 0  || 
		url.indexOf( ".tumblr.com/image/" ) > 0  || 
		url.indexOf( ".tumblr.com/rss" ) > 0   || 
		url.indexOf( "srvcs.tumblr.com" ) > 0  || 
		url.indexOf( "assets.tumblr.com" ) > 0  || 
		url.indexOf( "schema.org" ) > 0  || 
		url.indexOf( ".js" ) > 0  || 
		url.indexOf( ".css" ) > 0  ||
		url.indexOf( "twitter.com/intent" ) > 0  ||  		// Weirdly common now 
		url.indexOf( "tmblr.co/" ) > 0  ||
//https://66.media.tumblr.com/dea691ec31c9f719dd9b057d0c2be8c3/a533a91e352b4ac7-29/s16x16u_c1/f1781cbe6a6eb7417aa6c97e4286d46372e5ba37.jpg
		url.indexOf( "s16x16u" ) > 0 || 		// Avatars
		url.indexOf( "s64x64u" ) > 0 || 		// Avatars  
//https://66.media.tumblr.com/49fac1010ada367bcaee721ea49d0de5/3ddc8ebad67ae55a-ca/s64x64u_c1/592c805c7ce2c44cd389421697e0360b83d89f37.jpg
		url.indexOf( "u_c1/" ) > 0 || 		// Avatars
// https://66.media.tumblr.com/a4fe5011f9e07f95588c789128b60dca/603e412a60dc5227-4a/s64x64u_c1_f1/7b50fe887c756759973d442a89ef86ab1359f6e5.gif
		url.indexOf( "ezastumblrscrape" ) > 0 ) 		// Somehow this script is running on pages being fetched, inserting a link. Okay. Sure. 
	{ return false } else { return true }
}

// Return standard canonical URL for various resizes of Tumblr images - size of _1280, single CDN 
// 10/14 - ?usesmall seems to miss the CDN sometimes?
	// e.g. http://mooseman-draws.tumblr.com/archive?startpage=1?pagesatonce=5?thumbnails?ezastumblrscrape?scrapemode=everypost?lastpage=37?usesmall
	// https://66.media.tumblr.com/d970fff86185d6a51904e0047de6e764/tumblr_ookdvk7foy1tf83r7o1_400.png sometimes redirects to 78.media and _raw. What? 
	// Oh, probably not my script. I fucked with the Tumblr redirect script I use, but didn't handle the lack of CDN in _raw sizes. 
// 2020:  tumblr scrape: 
	// https://66.media.tumblr.com/b1515c45637955e1e52ec213944db662/08f2b2e47bbce703-70/s400x600/9077891dda98f127c040bd77581014ce4019fe75.gifv
		// obviously can go to .gif, but that .gif saves as tumblr_b1515c45637955e1e52ec213944db662_9077891d_400.gif. 
		// Also, bumping up to /s500x750 works, so I can probably still slam everything to maximum size via 'canonical' urls. 
function image_standardizer( url ) {
	// Some lower-size images are automatically resized. We'll change the URL to the maximum size just in case, and Tumblr will provide the highest resolution. 
	// Replace all resizes with _1280 versions. Nearly all _1280 URLs resolve to highest-resolution versions now, so we don't need to e.g. handle GIFs separately. 
	// Oh hey, Tumblr now has _raw for a no-bullshit as-large-as-possible setting. 
	// _raw only works without the CDN - so //media.tumblr yes, but //66.media.tumblr no. This complicates things. 
	// Does //media and _raw always work? No, of course not. So we still need on_error. 
//	url = url.replace( "_540.", "_1280." ).replace( "_500.", "_1280." ).replace( "_400.", "_1280." ).replace( "_250.", "_1280." ).replace( "_100.", "_1280." );  
	let maxres = "1280"; 		// It is increasingly unlikely that _raw still works. Reconsider CDN handling if that's the case. 
	if( options_map.maxres ) { maxres = options_map.maxres } 		// If it's set, use it. Should be _100, _250, whatever. ?usesmall should set it to _400. ?notraw, _1280. 
	maxres = "_" + maxres + "."; 		// Keep the URL options clean: "400" instead of "_400." etc. 
	url = url.replace( "_raw", maxres ).replace( "_1280.", maxres ).replace( "_640.", maxres ).replace( "_540.", maxres )
		.replace( "_500.", maxres ).replace( "_400.", maxres ).replace( "_250.", maxres ).replace( "_100.", maxres );  

	// henrythehangman.tumblr.com has doubled images from /image posts in ?scrapemode=everypost. Lots of _1280.jpg?.jpg nonsense.
	// Is that typical for tumblrs with this theme? It's one of those annoying magnifying-glass-on-hover deals. If it's just that one weird fetish site, remove this later.
	url = url.split('?')[0]; 		// Ditch anything past the first question mark, if one exists 
	url = url.split('&')[0]; 		// Ditch anything past the first ampersand, if one exists - e.g. speikobrarote.tumblr.com 
	if( url.indexOf( 'tumblr.com' ) > 0 ) { url = url.split( ' ' )[0]; } 		// Ditch anything past a trailing space, if one exists - e.g. cinnasmut.tumblr.com 

	// Standardize media subdomain / CDN subsubdomain, to prevent duplicates and fix _1280 vs _raw complications.
	if( url.indexOf( '.media.tumblr.com/' ) > 0 ) { 
		let url_parts = url.split( '/' )
		url_parts[2] = '66.media.tumblr.com';  		// This came first. Then //media.tumblr.com worked, even for _raw. Then _raw went away. Now it needs a CDN# again. Bluh.
//		url_parts[2] = 'media.tumblr.com'; 			// 2014: write a thing. 2016: comment out old thing, write new thing. 2018: uncomment old thing, comment new thing. This script.
		url = url_parts.join( '/' ).replace( 'http:', 'https:' ); 

		/* 			// Doesn't work - URLs resolve to HTML when clicked, but don't embed as images. Fuck this website. 
		// I need some other method for recognizing duplicates - the initial part of the URL is the same. 
		// Can HTML5 / CSS suppress certain elements if another element is present? 
			// E.g. #abcd1234#640 is display:none if #abcd1234#1280 exists. 
			// https://support.awesome-table.com/hc/en-us/articles/115001399529-Use-CSS-to-change-the-style-of-each-row-depending-on-the-content
			// The :empty pseudoselector works like :hover. And you can condition it on attributes, like .picture[src=""]:empty. 
			// The :empty + otherSelector{} syntax is weird, but it's CSS, so of course it's weird. 
			// Here we'd... generate a style element? Probably just insert a <style> block in innerHTML, honestly. Is inline an option? 
			// http://rafaelservantez.com/writings_tutorials_web_css_cond.html
			// Ech, + requires immediate adjacency. ~ selects within siblings, but only siblings "after" the first element. 

		// Late 2020: shitty new URLs don't contain _tumblr. 
		if( url.indexOf( '_tumblr' ) < 0 ) { 		// Should be !String.match, but Christ, one problem at a time. 
			let othermax = 's1280x1920'; 
			url = url.replace( 's400x600', othermax ).replace( 's500x750', othermax ).replace( 's640x960', othermax );
//'s400x600'
//'s500x750'
//'s640x960'
//'s1280x1920'
		} 
		*/

	}
/*		// ?notraw and ?usesmall are deprecated. Use ?maxres=1280 or ?maxres=400 instead. 
	// Change back to _1280 & CDN for ?scrapewholesite (which does no testing). _raw is unreliable. 
	if( options_map.scrapemode == 'scrapewholesite' || options_map.notraw ) { 
		url = url.replace( "_raw.", "_1280." ).replace( '//media', '//66.media' ); 
	}
	// Change to something smaller for quick browsing, like _500 or _250 
	// https://78.media.tumblr.com/166565b897f228352069b290067215c0/tumblr_oozoucFu0O1v1bsoxo2_raw.jpg etc don't work. What? 
	if( options_map.scrapemode != 'scrapewholesite' && options_map.usesmall ) { 		// Ignore this on scrapewholesite; that'd be a dumb side effect. 
		url = url.replace( "_raw.", "_400." ).replace( "_1280.", "_400." ).replace( '//media', '//66.media' ); 
	}
*/

	return url; 
}

// Remove duplicates from an array (from an iterable?) - returns de-duped array 
// Credit to http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array for hash-based string method 
function remove_duplicates( list ) {
	let seen = {}; 
	list = list.filter( function( item ) {
	    return seen.hasOwnProperty( item ) ? false : ( seen[ item ] = true );
	} );
	return list; 
}

// Filter: Return true ONCE for any given string. 
// Global duplicate remover - return false for items found in page_dupe_hash, otherwise add new items to it and return true
// Now also counts instances of each non-unique argument 
function novelty_filter( url ) {
	// return page_dupe_hash.hasOwnProperty( url ) ? false : ( page_dupe_hash[ url ] = true ); 
//	console.log( page_dupe_hash ); 		// DEBUG 
	url = url.toLowerCase(); 		// Debug-ish, mostly for "tag overview." URLs can be case-sensitive but collisions will be rare. "Not all images are guaranteed to appear." 
	if( page_dupe_hash.hasOwnProperty( url ) ) {
		page_dupe_hash[ url ] += 1;
		return false;
	} else {
		page_dupe_hash[ url ] = 1; 
		return true; 
	}
}

// Filter: Return true for any Tumblr /tagged URL.
// This is used separately from the other filters. Those go X=X.filter( remove stuff ), X=X.filter( remove other stuff ). This should run first, like Y=X.filter( return_tags ). 
function return_tags( url ) { 
//	return url.indexOf( '/tagged' ) > 0; 		// 'if( condition ) { return true } else { return false }' === return condition. 
	if( url.indexOf( '/tagged' ) > 0 ) { return true; } else { return false; } 
}

// Viewing a bare image, redirect to largest available image size.
// // e.g. https://66.media.tumblr.com/d020ac15b0e04ff9381f246ed08c9f05/tumblr_o2lok9yf8O1ub76b5o1_1280.jpg
// This is a sloppy knockoff of Tumblr Image Size 1.1, because that script doesn't affect //media.tumblr.com URLs. 
// Also, this is a distinct mode, not a helper function. Maybe just move it up to the start? 
function maximize_image_size() {
	if( window.location.href.indexOf( "_1280." ) > -1 ) { return false; } 		// If it's already max-size, die. 
	if( window.location.href.indexOf( "_raw." ) > -1 ) { return false; } 		// If it's already max-size, die. 
	// Nope, still broken. E.g. https://78.media.tumblr.com/tumblr_mequmpAxgp1r9tb2u.gif 
	// Needs a positive test for all the replacements... or a check if this URL is different from the changed URL. 

	// This should probably use image_standardizer to avoid duplicate code. 
	let replacement = image_standardizer( window.location.href ); 
	if( window.location.href != replacement ) { window.location.href = replacement; } 
/*
	let maxres = "_1280.";
//	maxres = "_" + maxres + "."; 		// Keep the URL options clean: "400" instead of "_400." etc. 
	url = window.location.href; 
	url = url.replace( "_1280.", maxres ).replace( "_540.", maxres ).replace( "_500.", maxres ).replace( "_400.", maxres ).replace( "_250.", maxres ).replace( "_100.", maxres );  
	if( window.location.href != url ) { window.location.href = url; }
*/
}

// Decode entity references.
// This is officially the stupidest polyfill I've ever used. How is there an entire class of standard escaped text with NO standard decoder in Javascript?
// Copied straight from https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript because decency was not an option. 
function htmlDecode(input) { 
  return new DOMParser().parseFromString(input, "text/html").documentElement.textContent; 
}

// Convert fetch()'d URLs into local URLs. Offsite URLs will 404 instead of triggering CORS as an unhandled error. This language. 
// Hmm. This works, but the test case I thought I had worked anyway (with plain fetches) after several refreshes. 
// Currently not used anywhere - needs further testing. 
function safe_fetch(  ){ 
//	args[0] = args[0]; 		// Editing TBD 
//	var video_post = window.location.protocol + "//" + subdomain[4] + ".tumblr.com/post/" + subdomain[5] + "/"; 
//	let local_root = window.location.protocol + "//" + window.location.host + "/"; 
//	arguments[0] = arguments[0]; 		// Editing TBD - arguments is the argv for JS. 
	arguments[0] = '/' + arguments[0].split( '/' ).slice( 3 ).join( '/' ); 
	return fetch( ... arguments ); 		// Straightforward. If this returns a thing that returns a promise, safe_fetch.then() -should- "just work." 
}





// Given the bare HTML of a Tumblr page, return an array of Promises for image/video/link URLs 
function soft_scrape_page_promise( html_copy ) {
	// Linear portion:
	let http_array = links_from_page( html_copy ); 			// Split bare HTML into link and image sources
	http_array.filter( url => url.indexOf( '/tagged/' ) > 0 ).filter( novelty_filter ); 		// Track tags for statistics, before the blacklist removes them 
	http_array = http_array.filter( tumblr_blacklist_filter ); 		// Blacklist filter for URLs - typical garbage

	function is_an_image( url ) {
		// Whitelist URLs with image file extensions or Tumblr iframe indicators 
		var image_link = false; 
		if( url.indexOf( ".gif" ) > 0 ) { image_link = true; }
		if( url.indexOf( ".jpg" ) > 0 ) { image_link = true; }
		if( url.indexOf( ".jpeg" ) > 0 ) { image_link = true; }
		if( url.indexOf( ".png" ) > 0 ) { image_link = true; }
		if( url.indexOf( "/photoset_iframe" ) > 0 ) { image_link = true; }
		if( url.indexOf( ".tumblr.com/video/" ) > 0 ) { image_link = true; }
		if( url.indexOf( "/audio_player_iframe/" ) > 0 ) { image_link = true; }
		return image_link; 
	}

	// Separate the images
	http_array = http_array.map( url => {  
		if( is_an_image( url ) ) { 		// If it's an image, get rid of any Tumblr variability about resolution or CDNs, to avoid duplicates with nonmatching URLs 
			return image_standardizer( url ); 
		} else { 		// Else if not an image
			if( url.indexOf( window.location.host ) > 0 ) { url += "#local" } else { url += "#offsite" } 		// Mark in-domain vs. out-of-domain URLs. 
			if( options_map.imagesonly ) { return ""; } 			// ?imagesonly to skip links on ?scrapewholesite
			return url + "#link"; 
		}
	} )
	.filter( n => { 		// Remove all empty strings, where "empty" can involve a lot of #gratuitous #tags.  
		if( n.split("#")[0] === "" ) { return false } else { return true } 
	} ); 

	http_array = remove_duplicates( http_array ); 		// Remove duplicates within the list
	http_array = http_array.filter( novelty_filter ); 			// Remove duplicates throughout the page
			// Should this be skipped on scrapewholesite? Might be slowing things down. 

	// Async portion: 
	// Return promise that resolves to list of URLs, including fetched videos and photoset sub-images 
	return Promise.all( http_array.map( s => { 
		if( s.indexOf( '/photoset_iframe' ) > 0 ) { 		// If this URL is a photoset, return a promise for an array of URLs
			return fetch( s, { credentials: 'include' }  ).then( r => r.text() ).then( text => { 		// Fetch URL, get body text from response 
				var photos = text.split( 'href="' ); 		// Isolate photoset elements from href= declarations
				photos.shift(); 		// Get rid of first element because it's everything before the first "href" 
				photos = photos.map( p => p.split( '"' )[0] + "#photoset" ); 		// Tag all photoset images as such, just because 
				photos[0] += "#" + s; 		// Tag first image in set with photoset URL so browse mode can link to it 
				return photos; 
			} ) 
		} 
		else if ( s.indexOf( '.tumblr.com/video/' ) > 0 ) { 		// Else if this URL is an embedded video, return a Tumblr-standard URL for the bare video file 
			var subdomain = s.split( '/' ); 		// E.g. https://www.tumblr.com/video/examplename/123456/500/ -> https,,www.tumblr.com,video,examplename,123456,500
			var video_post = window.location.protocol + "//" + subdomain[4] + ".tumblr.com/post/" + subdomain[5] + "/"; 
				// e.g. http://examplename.tumblr.com/post/123456/ - note window.location.protocol vs. subdomain[0], maintaining http/https locally 

			return fetch( video_post, { credentials: 'include' } ).then( r => r.text() ).then( text => { 
				if( text.indexOf( 'og:image' ) > 0 ) { 			// property="og:image" content="http://67.media.tumblr.com/tumblr_123456_frame1.jpg" --> tumblr_123456_frame1.jpg
					var video_name = text.split( 'og:image' )[1].split( 'media.tumblr.com' )[1].split( '"' )[0].split( '/' ).pop(); 
				} else if( text.indexOf( 'poster=' ) > 0 ) { 		// poster='https://31.media.tumblr.com/tumblr_nuzyxqeJNh1rjoppl_frame1.jpg'
					var video_name = text.split( "poster='" )[1].split( 'media.tumblr.com' )[1].split( "'" )[0].split( '/' ).pop(); 		// Bandaid solution. Tumblr just sucks. 
				} else { 
					return video_post + '#video'; 		// Current methods miss the whole page if these splits miss, so fuck it, just return -something.- 
				} 

				// tumblr_abcdef12345_frame1.jpg -> tumblr_abcdef12345.mp4
				video_name = "tumblr_" + video_name.split( '_' )[1] + ".mp4#video"; 
				video_name = "https://vt.tumblr.com/" + video_name; 		// Standard Tumblr-wide video server 

				return video_name; 		// Should be e.g. https://vt.tumblr.com/tumblr_abcdef12345.mp4 
			} )
		}
		else if ( s.indexOf( "/audio_player_iframe/" ) > 0 ) { 		// Else if this URL is an embedded audio file, return... well not a standard URL perhaps, but an URL.
			// How the fuck do I download audio? Video works-ish. Audio is not well-supported.
			// http://articulatelydecomposed.tumblr.com/post/176171225450/you-know-i-had-to-do-it-the-new-friendsim-had-a
			// Ctrl+F "plays". Points to:
			// http://articulatelydecomposed.tumblr.com/post/176171225450/audio_player_iframe/articulatelydecomposed/tumblr_pcaffm6o6H1rc8keu?audio_file=https%3A%2F%2Fwww.tumblr.com%2Faudio_file%2Farticulatelydecomposed%2F176171225450%2Ftumblr_pcaffm6o6H1rc8keu&color=white&simple=1
			// Still no bare .mp3 link in that iframe. 
			// data-stream-url="https://www.tumblr.com/audio_file/articulatelydecomposed/176171225450/tumblr_pcaffm6o6H1rc8keu" ? 
			// Indeed. Actually that might be in the iframe link. What's that function for decoding URIs? 
			// Wait, the actual file resolves to https://a.tumblr.com/tumblr_pcaffm6o6H1rc8keuo1.mp3 - this is trivial. 
//			let audio_name = s.split( '/' ).pop(); 		// Ignore text before last slash. 
//			audio_name = audio_name.split( '?' ).shift(); 		// Ignore text after a question mark, if there is one. 
			// audio_name should now look something like 'tumblr_12345abdce'. 
//			return 'https://a.tumblr.com/' + audio_name + '1.mp3#FUCK'; 		// Standard tumblr-wide video server. Hopefully. 

			// Inconsistent. 
			// e.g. http://articulatelydecomposed.tumblr.com/post/176307067285/mintchocolatechimp-written-by-reddit-user shows
			// https://a.tumblr.com/tumblr_pce3snfthB1ufch4go1.mp3#offsite#link which works, but also 
			// https://a.tumblr.com/tumblr_pce3snfthB1ufch4go1.mp3&color=white&simple=1#offsite#link which doesn't and
			// https://a.tumblr.com/tumblr_pce3snfthB1ufch4g1.mp3 which also doesn't. 
			// ... both of the 'go1' links are present even without this iframe-based code, because that audio has a 'download' link. 

			// Yeah, so much for the simple answer. Fetch. No URL processing seems necessary - 's' is already on this domain. 
			return fetch( s, { credentials: 'include' } ).then( r => r.text() ).then( text => { 
				// data-stream-url="https://a.tumblr.com/tumblr_pce3snfthB1ufch4go1.mp3" 
				let data_url = text.split( 'data-stream-url="' )[1]; 		// Drop everything before the file declaration.
				data_url = data_url.split( '"' )[0]; 		// Drop everything after the doublequote. Probably not efficient, but fuck regexes. 
				return data_url + "#audio"; 
			} )
			// Alright, well now it sort of works, but sometimes it returns e.g.
			// https://www.tumblr.com/audio_file/articulatelydecomposed/176010754365/tumblr_pc1pq1TsD31rc8keu#FRIG which resolves to
			// https://a.tumblr.com/tumblr_pc1pq1TsD31rc8keuo1.mp3#FRIG
			// Huh. That -is- the correctly-identified "data-stream-url" in some iframes. Shit. 
			// This is set up to handle multiple return values, right? For photosets? So I -could- return the correct URL and some guesses.
				// But at that point - why not just guess from the iframe URL? +1.mp3 and also +o1.mp3. 
				// Can't just make up a username or post number for the /audio_file sort of URL. 
		}
		return Promise.resolve( [s] ); 		// Else if this URL is singular, return a single element... resolved as a promise for Promise.all, in an array for Array.concat. Whee. 
	} ) )
	.then( nested_array => { 		// Given the Promise.all'd array of resolved URLs and URL-arrays 
		return [].concat.apply( [], nested_array ); 		// Concatenate array of arrays - apply turns array into comma-separated list, concat turns CSL of arrays into a single array 
	} ) 
}





// Returns a URL with all the options_map options in ?key=value format - optionally allowing changes to options in the returned URL 
// Valid uses:
// options_url() 	-> 	all current settings, no changes 
// options_url( "name", number ) 	-> 	?name=number
// options_url( "name", true ) 		-> 	?name
// options_url( {name:number} ) 	-> 	?name=number
// options_url( {name:number, other:true} ) 	-> 	?name=number?other
// Note that simply passing "name" will remove ?name, not add it, because the value will evaluate false. I should probably change this? Eh, { key } without :value causes errors. 
function options_url( key, value ) {
	var copy_map = new Object(); 
	for( var i in options_map ) { copy_map[ i ] = options_map[ i ]; } 		
	// In any sensible language, this would read "copy_map = object_map." Javascript genuinely does not know how to copy objects. Fuck's sake. 

	if( typeof key === 'string' ) { 		// the parameters are optional. just calling options_url() will return e.g. example.tumblr.com/archive?ezastumblrscrape?startpage=1
		if( !value ) { value = false; } 		// if there's no value then use false
		copy_map[ key ] = value; 		// change this key, so we can e.g. link to example.tumblr.com/archive?ezastumblrscrape?startpage=2
	}

	else if( typeof key === 'object' ) { 		// If we're passed a hashmap
		for( var i in key ) { 
			if( ! key[ i ] ) { key[ i ] = false; } 		// Turn any false evaluation into an explicit boolean - this might not be necessary
			copy_map[ i ] = key[ i ]; 		// Press key-object values onto copy_map-object values 
		}
	}

	// Construct URL from options
	var base_site = window.location.href.substring( 0, window.location.href.indexOf( "?" ) ); 		// should include /archive, but if not, it still works on most pages
	for( var k in copy_map ) { 		// JS maps are weird. We're actually setting attributes of a generic object. So map[ "thumbnails" ] is the same as map.thumbnails. 
		if( copy_map[ k ] ) { 		// Unless the value is False, print a ?key=value pair.
			base_site += "?" + k; 
			if( copy_map[ k ] !== true ) { base_site += "=" + copy_map[ k ]; }  		// If the value is boolean True, just print the value as a flag. 
		}
	}
	return base_site; 
}



































