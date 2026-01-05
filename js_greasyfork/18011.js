// ==UserScript==
// @name        FB Most Recent
// @namespace   Pogmog
// @description Make all FB home links enforce "most recent" setting.
// @version     1.11
// @grant       none
// @include     http://www.facebook.com/*
// @include     https://www.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/18011/FB%20Most%20Recent.user.js
// @updateURL https://update.greasyfork.org/scripts/18011/FB%20Most%20Recent.meta.js
// ==/UserScript==

// Check the main URL is the most recent
if (document.URL == "https://www.facebook.com/") window.location.href = "https://www.facebook.com/?sk=h_chr";

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