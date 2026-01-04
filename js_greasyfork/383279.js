// ==UserScript==
// @name         Facebook - Hide Ads
// @version      1.1
// @description  Hides Facebook ads (best-effort)
// @author       Selbi
// @match        https://www.facebook.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @namespace    selbi
// @downloadURL https://update.greasyfork.org/scripts/383279/Facebook%20-%20Hide%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/383279/Facebook%20-%20Hide%20Ads.meta.js
// ==/UserScript==

// Fetch the main feed and fire it once on page load
var feed = document.querySelector("div[role*=main]");

// Create the observer
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // Fire the ad-hiding method every time the observer detects something
    // (This is stupidly CPU-intensive and could probably be optimized but I cba, sry lel)
    hideAds();
  });
});

// Set up a mutation observer for the feed so ads keep getting blocked as you scroll down
// (Not a big fan of jQuery, but it has a pretty robust .ready() method, so whatever)
$(document).ready(function() {
  observer.observe(feed, {
    // I trial-and-error'd the observe settings until I found something that worked
    childList: true,
    subtree: true
  });
});

// Where the magic happens
function hideAds() {
  // First off, find all the POTENTIAL ads using the few available static selectors,
  // because Facebook is literally satan and obfuscated nearly every selector
  let ads = feed.querySelectorAll("div[id*=fbfeed_sub__header] a[role*=button] > span");
  
  // Iterate through all the found posts
  ads.forEach((e) => {
    // Skip this post if it was already hidden to save some CPU cycles
    if (!e.classList.contains("hiddenAd")) {
      // This is where it gets tricky:
      // There will be a few normal posts sneaking in using the above query selector,
      // which we gotta deal with in the following steps. Facebook is a gigantic cuckfest,
      // because not only do they obfuscate the crap out of their classes, they also put each
      // individual letter of the word "Sponsored" into its own span.
      // Fortunately, we can use the number in a real post (e.g. "9 hours ago") to differentiate
      // a sponsored post from a normal post. A hacky workaround, but it works.

      // Assume this is an ad
      let isAd = true;

      // Iterate through all the spans
      for (c of e.children) {
        // Check if the innerHTML or "data-content" attribute's content of any child is a number
        for (cc of c.children) {
          let content = cc.getAttribute("data-content");
          if (content.length > 0 && !isNaN(content)) {
            // If it is, this is NOT an ad. Mark the flag as such and break the loop.
            isAd = false;
            break;
          }
        }
      }

      // Check if this article is still considered an ad
      if (isAd) {
        // If yes, traverse up the ancestry to find the root node
        // (This is not the true root, but it does the job to hide the ad, which is the whole point)
        let article = e.closest("div[id*=hyperfeed_story_id");
        if (article !== null) {
          // Hide that dickhead
          article.style.display = "none";

          // Mark the original selector as already hidden for future fetches
          e.classList.add("hiddenAd");
        }
      }
    }
  });
}
