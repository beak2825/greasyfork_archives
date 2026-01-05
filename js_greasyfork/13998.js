// ==UserScript==
// @name        Doodles Redirects
// @namespace   http://greasyfork.org/users/2240-doodles
// @author      Doodles
// @version     2
// @icon        http://icons.iconarchive.com/icons/gakuseisean/ivista-2/48/Alarm-Arrow-Right-icon.png
// @icon64      http://icons.iconarchive.com/icons/gakuseisean/ivista-2/64/Alarm-Arrow-Right-icon.png
// @description Redirects websites before page loads.
// @include     *://*amazon.com/s/*field-keywords=*
// @include     *://teamfortress.tv/stream/*
// @include     *://steamcommunity.com/linkfilter/?url=*
// @include     *://giant.gfycat.com/*.gif
// @include     *://websta.me/p/*
// @include     *://steamrep.com/search?q=*
// @include     *://www.hltv.org/?pageid=286&streamid=*
// @include     *://mobile.twitter.com/*
// @include     *://lmgtfy.com/?q=*
// @include     *://twitter.com/intent/user?screen_name=*
// @include     *://m.imdb.com/*
// @include     *://en.m.wikipedia.org/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13998/Doodles%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/13998/Doodles%20Redirects.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

if(!UrlContains('#nodirect')){
	// Song/Artist/Album links from MediaMonkey get redirected to YouTube searches or Wikipedia searches
	if (UrlContains("amazon.com")){
		var searchTerm = document.URL.split('field-keywords=')[1].split("/")[0].split("?")[0].split("#")[0];
		if(UrlContains('digital-music-track')){
			MagicRedirect("http://www.youtube.com/results?search_query=" + searchTerm);
		}else{
			MagicRedirect("http://en.wikipedia.org/w/index.php?title=Special:Search&search=" + searchTerm);
		}
		
	}

	// Streams embedded on teamfortress.tv get redirected to twitch.tv
	if (UrlContains("teamfortress.tv")){
		MagicRedirect("http://www.twitch.tv/" + document.URL.split("/stream/")[1].split("/")[0].split("?")[0].split("#")[0]);
	}

	// Redirect Steam linkfilter confirmation pages to the proposed links
	if (UrlContains('steamcommunity.com/linkfilter') && UrlContains('url=')) {
		MagicRedirect(document.URL.split("url=")[1]);
	}
	
	// Redirect Websta.me Pages to their original Instagram Pages
	if (UrlContains('websta.me/p/')) {
		$(window).load(function(){
			MagicRedirect($('a[href*="www.instagram.com/p/"]').first().attr('href'));
		});
	}
	
	// Redirect SteamRep pages to Steam64ID
	if (UrlContains('steamrep.com/search?q=')) {
		$(window).load(function(){
			var st = $('a[href*="steamcommunity.com/profiles/"]').first().attr('href').split('profiles/')[1];
			MagicRedirect("http://steamrep.com/profiles/" + st);
		});
	}
	
	// Redirect Streams Embedded into HLTV to the actual Streams
	if (UrlContains('hltv.org/?pageid=286&streamid')) {
		$( document ).ready(function() {
			var ifram = $('iframe').first().attr('src');
			if (ifram.indexOf('twitch.tv') !== -1) {
				ifram = ifram.split('channel=')[1];
				MagicRedirect("https://www.twitch.tv/" + ifram);    
			}
		});
	}
	
	// Redirect Mobile Twitter pages to Normal
	if (UrlContains('mobile.twitter.com')) {
		MagicRedirect(document.URL.replace('mobile.twitter.com', 'twitter.com'));
	}
	
	// Let Me Fucking Google That For You - Skip
	if (UrlContains('lmgtfy.com')) {
		MagicRedirect(document.URL.replace('lmgtfy.com/?q=', 'www.google.com/#q='));
	}
	
	// Twitter Garbage
	if (UrlContains('twitter.com/intent/user?screen_name=')) {
		MagicRedirect(document.URL.replace('intent/user?screen_name=', ''));
	}
	
	// Mobile IMDb to Normal IMDb
	if (UrlContains('m.imdb.com')) {
		MagicRedirect(document.URL.replace('m.imdb.com', 'www.imdb.com'));
	}
	
	// Mobile Wikipedia to Normal Wikipedia
	if (UrlContains('en.m.wikipedia.org')) {
		MagicRedirect(document.URL.replace('en.m.wikipedia.org', 'en.wikipedia.org'));
	}
}

// =============================================================

function MagicRedirect(urlDestination){
	window.history.pushState({} , 'foo', '#nodirect');
	window.location.assign(urlDestination);
}

function UrlContains(urlfragment){
	return document.URL.indexOf(urlfragment) != -1;
}