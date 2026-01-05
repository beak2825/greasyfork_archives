// ==UserScript==
// @name Add Reddit Top Menuitems ( H,24,W,M,Y )
// @description adds quickaccess menuitems: hour day week month year
// @grant       none
// @match          http://reddit.com/*
// @match          https://reddit.com/*
// @match          http://*.reddit.com/*
// @match          https://*.reddit.com/*
// @version     1.4
// @namespace https://greasyfork.org/users/16061
// @downloadURL https://update.greasyfork.org/scripts/12558/Add%20Reddit%20Top%20Menuitems%20%28%20H%2C24%2CW%2CM%2CY%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12558/Add%20Reddit%20Top%20Menuitems%20%28%20H%2C24%2CW%2CM%2CY%20%29.meta.js
// ==/UserScript==
//http or https
var http = window.location.href.search("reddit.com");
var subreddit ="";

// get subreddit from url.
var substart = window.location.href.search("/r/")+3;
if (substart>2) {
	// found subreddit
	subreddit = window.location.href.substring(substart); 
	var subend = subreddit.search("/");
	if (subend >0) {
		subreddit= subreddit.substr(0,subend);
	}
	subreddit= '/r/'+ subreddit;
}
var subredditurl = window.location.href.substring(0,http) + 'reddit.com' + subreddit;
$(".tabmenu").append('<li><a class="choice" href="'+subredditurl+'/top/?sort=top&t=hour">H</a></li>')
$(".tabmenu").append('<li><a class="choice" href="'+subredditurl+'/top/?sort=top&t=day">24</a></li>')
$(".tabmenu").append('<li><a class="choice" href="'+subredditurl+'/top/?sort=top&t=week">W</a></li>')
$(".tabmenu").append('<li><a class="choice" href="'+subredditurl+'/top/?sort=top&t=month">M</a></li>')
$(".tabmenu").append('<li><a class="choice" href="'+subredditurl+'/top/?sort=top&t=year">Y</a></li>')