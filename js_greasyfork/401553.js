// ==UserScript==
// @name        Hide Like Button on Tweets
// @namespace   Violentmonkey Scripts
// @match       *://twitter.com/*
// @grant       none
// @version     1.11
// @author      -
// @description 4/20/2020, 7:59:17 PM
// @downloadURL https://update.greasyfork.org/scripts/401553/Hide%20Like%20Button%20on%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/401553/Hide%20Like%20Button%20on%20Tweets.meta.js
// ==/UserScript==

setInterval(() => {

  for (const tweet of document.querySelectorAll('div[data-testid="like"]')) {
    tweet.style.display = 'none';
  }
  
}, 0);