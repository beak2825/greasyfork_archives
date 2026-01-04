// ==UserScript==
// @name     Filter Out Meetup Search Results
// @version  4
// @description Remove items from search results of meetup.com based on regular expression. Personally I use this to filter out organizers that are not relevant to me.
// @author      Artium Nihamkin artium@nihamkin.com
// @icon https://secure.meetupstatic.com/s/img/68780390453345256452178/favicon.ico
// @homepageURL    http://www.nihamkin.com
// @include https://www.meetup.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/231385
// @downloadURL https://update.greasyfork.org/scripts/375325/Filter%20Out%20Meetup%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/375325/Filter%20Out%20Meetup%20Search%20Results.meta.js
// ==/UserScript==


function f() {

// You need to edit this with your own filtering keywords. The regular expression
// is run against href attributes of the search result links.
// See http://www.nihamkin.com/filtering-meetup-organizers-with-greasemonkey-script.html
//
var blacklist = ["All-the-best-Workshops-DIY-Israel", "The-Best-Science-Bar-Talks-in-Tel-aviv"];
var blRegex = new RegExp(blacklist.join("|"));

var links = $("a").filter(function(i,el) { return (blRegex.test(el.href)); })
      .closest("li.event-listing")
      .remove();
}

document.body.addEventListener("DOMNodeInserted", f, true);