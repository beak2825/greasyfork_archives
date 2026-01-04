// ==UserScript==
// @name        TweetOver PlainText Tooltip
// @description Adds tweet text to a Twitter status link on mouse-over (title attribute) - EXPERIMENTAL - for LEGACY Greasemonkey
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2017 Jefferson Scher
// @license     MIT
// @include     http*://*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/34182/TweetOver%20PlainText%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/34182/TweetOver%20PlainText%20Tooltip.meta.js
// ==/UserScript==

// Retrieve tweet details for each status link found
function TOPT_findLinks(tgt){
  // TODO - PROBABLY NOT THE IDEAL METHOD OF IDENTIFYING THESE LINKS
  var tweets = tgt.querySelectorAll('a[href^="https://twitter.com/"][href*="/status/"]');
  for (var i=0; i<tweets.length; i++){
    // TODO - VERIFY LINK VALIDITY
    TOPT_addTitle(tweets[i]);
  }
}

// Use GM's cross-site XHR function to get the tweet
function TOPT_addTitle(ael){
  // TODO: HANDLE RESPONSE ERRORS
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://publish.twitter.com/oembed?url=" + ael.href,
    headers: {
      "Accept": "text/json"
    },
    onload: function(response) {
      var tweet = JSON.parse(response.responseText);
      var dTweet = document.createElement("div");
      dTweet.innerHTML = tweet.html; /* Could do "rich" overlay, but this script doesn't */
      var tweetText = dTweet.querySelector('blockquote').textContent;
      ael.setAttribute("title", tweetText);
    }
  });
}

// Check for Twitter links 1.5 seconds after DOM Content Loaded
window.setTimeout(function(){TOPT_findLinks(document.body);}, 1500);