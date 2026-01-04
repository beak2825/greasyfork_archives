// ==UserScript==
// @name        Expand Subreddit List Simple
// @namespace   user paperwing from greasyfork.org
// @include     https://*.reddit.com/*
// @version     1.0151
// @grant       none
//
// @description:en   Simple program to expand the Reddit top bar to show all subscribed subreddits. Should work on all browsers.
// @description Expands the Reddit top bar to show all subscribed subreddits. NOTE: I am moving the script to here: https://openuserjs.org/scripts/Sanakazubi/Expand_Reddit_Subscription_Bar
// @downloadURL https://update.greasyfork.org/scripts/33471/Expand%20Subreddit%20List%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/33471/Expand%20Subreddit%20List%20Simple.meta.js
// ==/UserScript==

var ec, e, cs;

e = document.getElementById("sr-header-area");

if (e !== null) {
  e.style["white-space"] = "normal";

  ec =  document.getElementsByClassName("sr-list");


  ec = document.getElementsByClassName("sr-list")[0].childNodes[2].childNodes;

  for (var i = 0; i < ec.length; i++) {

    ec[i].style["white-space"] = "normal";

  }

  var e2 = document.getElementsByClassName("sr-list")[0].childNodes[2];

  e.style["height"] = (e2.offsetHeight + 10) + "px";
}

var fixprofile = function(){ 
	var profile = document.getElementsByClassName("SubscriptionBar")[0]

	profile.style["height"] = "auto";
	profile.style["white-space"] = "normal";
}

setTimeout(fixprofile, 500);