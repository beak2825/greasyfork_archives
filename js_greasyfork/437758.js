// ==UserScript==
// @name        Twitter Interaction Remover
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @grant       none
// @version     1.1
// @author      EternalBliss
// @icon        https://abs.twimg.com/favicons/twitter.2.ico
// @run-at      document-end
// @license     MIT
// @description 12/29/2021, 6:03:45 PM
// @downloadURL https://update.greasyfork.org/scripts/437758/Twitter%20Interaction%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/437758/Twitter%20Interaction%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var intervalId = window.setInterval(function(){
    getTweets()
  }, 100);
  
})();

function getTweets() {
  var tweets = document.getElementsByTagName("article")
  tweets.forEach((tweet) => removeTweetInteractions(tweet))
}

function removeTweetInteractions(tweet) {
  try{
      tweet.children[0].children[0].children[0].children[1].children[1].children[1].children[2].remove()    
  } catch {
      
  }
}