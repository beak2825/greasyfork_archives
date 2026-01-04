// ==UserScript==
// @name        Steam Search - Click Through To Game
// @namespace   Violentmonkey Scripts
// @match       https://store.steampowered.com/search/
// @grant       none
// @version     2.0
// @author      -
// @description If the URL contains the clickthrough=1 GET variable, then if there is an exact match for the search, click through to it to open the game's page. This is for use with search add-ons and search engine keyword functionality. 5/18/2023, 3:25:43 AM
// @downloadURL https://update.greasyfork.org/scripts/466540/Steam%20Search%20-%20Click%20Through%20To%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/466540/Steam%20Search%20-%20Click%20Through%20To%20Game.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);
title = urlParams.get("term");


if ((urlParams.get("clickthrough") === "1") && (title !== null) && (title !== '')) {
  // the parameter is set, let's find the link

  titleLower = title.toLowerCase();

  a = null;
  count = 0;
  document.querySelectorAll('a.search_result_row span.title').forEach(span => {
    if(span.innerText.toLowerCase() == titleLower) {
      if (count == 0) {
        a = span.closest('a.search_result_row');
      }
      count = count + 1;
    }
  })

  // first, navigate to the current search results, but without the clickthrough GET var.
  // navigate replacing history so that if you navigate back to the search results, you can stay here
  urlParams.delete("clickthrough");
  noClickthroughUrl = window.location.origin + window.location.pathname + "?" + urlParams.toString()
  history.replaceState({}, "", noClickthroughUrl);

  // if we found more than one match, or no matches, don't click any links
  if((count == 1) && (a !== null)) {
    // wait for window.location to have changed...
    ref = setInterval(function() {
        if(window.location.toString() == noClickthroughUrl) {
          clearInterval(ref);
          window.location.href = a.href;
        }
    }, 25);
  }
}