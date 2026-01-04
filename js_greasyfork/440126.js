// ==UserScript==
// @name     Twitter spam hider
// @description Hides "who to follow" and "trending now" spam on Twitter's web app by scanning the page for it every second.
// @author   Gercomsci
// @namespace  https://greasyfork.org/de/users/771568-gercomsci
// @version  1.0 beta (2022-02-09)
// @include  https://*.twitter.com/*
// @include  https://twitter.com/*
// @include  https://mobile.twitter.com/*
// (redundant URLs to ensure for compatibility)
// @grant    none
// @license  GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/440126/Twitter%20spam%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/440126/Twitter%20spam%20hider.meta.js
// ==/UserScript==

function hideTwitterSpam() {
// Check if element exists, to prevent an error from terminating the loop.
if ( document.querySelectorAll('[aria-label="Who to follow"]')[0] /* Check if exists */
  && document.querySelectorAll('[aria-label="Who to follow"]')[0].parentNode.style.display != 'none' ) /* Check if not already hidden to prevent repeated console output */ {
     console.log ("Hiding \"Who to follow\" spam")
     document.querySelectorAll('[aria-label="Who to follow"]')[0].parentNode.style.display = 'none'; // hide
  }

if ( document.querySelectorAll('[aria-label="Timeline: Trending now"]')[0] /* Check if exists */
  && document.querySelectorAll('[aria-label="Timeline: Trending now"]')[0].parentNode.style.display != 'none' )  /* Check if not already hidden to prevent repeated console output */ {
     console.log ("Hiding \"Trends for you\" spam")
     document.querySelectorAll('[aria-label="Timeline: Trending now"]')[0].parentNode.style.display = 'none'; // hide
  }
}

hideTwitterSpamInterval = setInterval(hideTwitterSpam, 1000); // Searches for spam and hides it every second. 

// This is the best possible solution on a ReactJS-based site, since it uses randomized CSS class names, meaning the only way to hide spam selectively is to make JavaScript code locate it on the page continuously, whack-a-mole style.