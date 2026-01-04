// ==UserScript==
// @name        Hide Like Button on Tweetdeck
// @namespace   Violentmonkey Scripts
// @match       *://tweetdeck.twitter.com/*
// @grant       none
// @version     1.01
// @author      -
// @description 4/20/2020, 7:59:17 PM
// @downloadURL https://update.greasyfork.org/scripts/402160/Hide%20Like%20Button%20on%20Tweetdeck.user.js
// @updateURL https://update.greasyfork.org/scripts/402160/Hide%20Like%20Button%20on%20Tweetdeck.meta.js
// ==/UserScript==

setInterval(() => {
  for (const tweet of document.querySelectorAll('a[rel="favorite"]')) {
    tweet.style.display = 'none';
  }
  
}, 0);