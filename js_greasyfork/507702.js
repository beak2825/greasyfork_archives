// ==UserScript==
// @name        Hide tweets from blue check accounts (status only)
// @match       https://twitter.com/*/status/*
// @match       https://x.com/*/status/*
// @version     1.1
// @description Hide tweets from blue check accounts on twitter.com and x.com for status pages only
// @namespace   Violentmonkey Scripts
// @license MIT
// @author LucioB16
// @downloadURL https://update.greasyfork.org/scripts/507702/Hide%20tweets%20from%20blue%20check%20accounts%20%28status%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507702/Hide%20tweets%20from%20blue%20check%20accounts%20%28status%20only%29.meta.js
// ==/UserScript==

// Use setInterval to repeatedly run the function every 500 milliseconds.
// This ensures the script catches newly loaded tweets as you scroll or interact with the page.
setInterval(function hideBlueCheckTweets() {

  // Select all elements with the specified data-testid attribute ('cellInnerDiv').
  // This includes both tweet blocks and structural elements dividing tweets on the page.
  const tweets = document.querySelectorAll('div[data-testid="cellInnerDiv"]');

  // Loop through each element, accessing its index in the list.
  tweets.forEach((tweet, index) => {

    // Ignore the first tweet (index 0), which is typically the main tweet of the thread.
    // Also, ignore elements in odd positions (these may be dividers or other non-tweet elements).
    if (index !== 0 && index % 2 === 0) {

      // Search within the current element for the blue check verification icon.
      // The blue check icon is identified by the 'data-testid="icon-verified"' attribute.
      const blueCheckIcon = tweet.querySelector('svg[data-testid="icon-verified"]');

      // If the element contains a blue check icon, hide the entire element by setting its display to 'none'.
      if (blueCheckIcon) {
        tweet.style.display = "none";
      }
    }
  });
}, 500);
