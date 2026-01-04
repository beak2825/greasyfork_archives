// ==UserScript==
// @name        Hide Retweet button on Tweets
// @namespace   Violentmonkey Scripts
// @match       *://twitter.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 4/20/2020, 7:59:17 PM
// @downloadURL https://update.greasyfork.org/scripts/401554/Hide%20Retweet%20button%20on%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/401554/Hide%20Retweet%20button%20on%20Tweets.meta.js
// ==/UserScript==
setInterval(() => {

  for (const tweet of document.querySelectorAll('div[data-testid="retweet"]')) {
    tweet.style.display = 'none';
  }
  
}, 0);