// ==UserScript==
// @name        QOL on the Web
// @namespace   Pogmog
// @description Just some general quality of (my) life changes. Reddit: disable pinned top-bar, enforce old, hide sidebar on small screen. YouTube: disable end cards, enforce theatre-mode. Facebook: enforce most-recent.  Duckduckgo: soften the ads.
// @version     3.2
// @include     https://old.reddit.com/*
// @include     https://www.reddit.com/*
// @include     https://www.youtube.com/*
// @include     https://www.facebook.com/*
// @include     https://duckduckgo.com/?q=*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40706/QOL%20on%20the%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/40706/QOL%20on%20the%20Web.meta.js
// ==/UserScript==

// Options
var reddit_switch_to_old = true;
var reddit_disable_side = true;
var reddit_disable_pinned = true;
var reddit_hide_automod_post = true;
var youtube_always_theatre = true;
var youtube_disable_endcards = true;
var facebook_force_recent = true;
var duckduckgo_ad_soften = true;

var urlCheck = document.URL;
/*
	If a tweak needs to use the scroll or onLoad events, call them with the following:
		setup_onLoad()
		setup_onScroll()
	...rather than have everything fire the onScroll event, etc.
*/
if (urlCheck.includes("reddit.com/") && reddit_hide_automod_post)
{
	setup_onLoad();
}


function afterLoad()
{
	// If anything needs to happen after page load (did for Reddit stuff before I found a better way).
	if (urlCheck.includes("reddit.com/"))
	{
		if (reddit_hide_automod_post)
		{
			var first_comment = document.getElementsByClassName("comment")[0];
			var element_to_use = first_comment.getElementsByClassName("tagline")[0];
			var author = element_to_use.getElementsByClassName("author")[0];
			if (author.innerHTML == "AutoModerator")
			{
				console.log("First comment is Automod.");
				element_to_use.getElementsByClassName("expand")[0].onclick();
			}
		}
	}
}
function onPageScroll()
{
	// If anything needs to happen on page scroll (did for Reddit stuff before I found a better way).
}

if (urlCheck.includes("reddit.com/"))
{
	if (urlCheck.includes("old.reddit.com/r/"))
	{
		if (reddit_disable_pinned)
		{
			// Reddit: hide the PINNED thing that pops up when you scroll down.
			var sheet = document.createElement('style')
			sheet.innerHTML = ".pinnable-placeholder .pinned {display: none;}";
			document.body.appendChild(sheet);
		}
	}
	else if (urlCheck.includes("www.reddit.com/"))
	{
		if (reddit_switch_to_old)
		{
			var new_url = urlCheck.replace("www.reddit.com", "old.reddit.com");
			window.location.href = new_url;
		}
	}
	if (reddit_disable_side)
	{
		var sheet = document.createElement('style')
		sheet.innerHTML = "@media only screen and (max-width: 975px) {.side {display: none; position:absolute; visibility: hidden;}body > .content {margin: 0;}}";
		document.body.appendChild(sheet);
	}
}
else if (urlCheck.includes("duckduckgo.com"))
{
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '#ads {border: solid darkcyan 2px;opacity: 0.5;border-radius: 10px;}';
	document.getElementsByTagName('head')[0].appendChild(style);
}
else if (urlCheck.includes("youtube.com/watch"))
{
	if (youtube_disable_endcards)
	{
		// Get rid of YouTube's annoying ENDCARDS
		var sheet = document.createElement('style')
		sheet.innerHTML = ".ytp-ce-element {display: none;}";
		document.body.appendChild(sheet);
	}
	if (youtube_always_theatre)
	{
		// This code was lifted from r-a-y, namespace: "r-a-y/youtube/theater"
		window.addEventListener("yt-navigate-finish", function(event) {
			var newPlayer = document.querySelector('button.ytp-size-button');
			if ( newPlayer && null === document.querySelector('ytd-watch').getAttribute('theater') ) {
			  newPlayer.click();
			}
		  });
	}
}
else if (urlCheck.includes("facebook.com"))
{
	if (facebook_force_recent)
	{
		// Check the main URL is the most recent
		if (urlCheck == "https://www.facebook.com/") window.location.href = "https://www.facebook.com/?sk=h_chr";

		// Change all FB links to be the most_recent type.
		var fb_links = document.links; 
		for (var i=0; i<fb_links.length; i++)
		{
			//Set up link to variable
			var p = fb_links[i].href;
			//If link is the raw FB link, replace.
			if(p == "https://www.facebook.com/" || p == "https://www.facebook.com/?ref=tn_tnmn" || p == "https://www.facebook.com/?ref=logo") 
			{
				//Change to "most recent".
				fb_links[i].href = "https://www.facebook.com/?sk=h_chr";
			}
		}
	}
}

// Functions that need to be called more than once:
function reddit_removeSidebar()
{
	var redditSidebar = document.getElementsByClassName("side")[0];
	redditSidebar.style.removeProperty("display");
}
// Setup Function
function setup_onLoad()
{
	// For code that needs to happen post-pageload
	if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
	else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
	else {document.addEventListener('load', afterLoad, false);}
}
function setup_onScroll()
{
	// For code that needs to happen on scroll event
	window.addEventListener("scroll", onPageScroll);
}