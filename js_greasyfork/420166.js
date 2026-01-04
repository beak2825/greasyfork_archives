// ==UserScript==
// @name        Replace broken Trump tweets on Something Awful with a screenshot of the original tweet
// @namespace    http://punishedtrump.com
// @version      0.16
// @description  Replaces broken trump tweets with an image of the tweet
// @author       You
// @match        https://forums.somethingawful.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420166/Replace%20broken%20Trump%20tweets%20on%20Something%20Awful%20with%20a%20screenshot%20of%20the%20original%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/420166/Replace%20broken%20Trump%20tweets%20on%20Something%20Awful%20with%20a%20screenshot%20of%20the%20original%20tweet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // replace the html in td only when a Trump tweet is found
    var tds = document.getElementsByTagName("td");
    for(var i =0; i < tds.length; i++) {
      if (tds[i].innerHTML.search(/twitter.com\/realDonaldTrump/gi)>0) {
          tds[i].innerHTML = tds[i].innerHTML.replace(/<a href="https:\/\/twitter.com\/realDonaldTrump\/status\/(.*?)\"(.*)<\/a>/gi,"<a href=\"https:\/\/twitter.com\/realDonaldTrump\/status\/$1\"><img src=\"https://punishedtrump.com/realDonaldTrump/status/$1\"</img></a>");
      }
    }
})();