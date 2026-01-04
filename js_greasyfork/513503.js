// ==UserScript==
// @name         playlist gone
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Removes the playlists from youtube feed
// @author       Kalakaua
// @match        https://www.youtube.com/
// @include      *://*.youtube.com/watch*
// @include      *://*.youtube.com/feed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513503/playlist%20gone.user.js
// @updateURL https://update.greasyfork.org/scripts/513503/playlist%20gone.meta.js
// ==/UserScript==

(function() {
    'use strict';
(() => {
  // Function to remove playlist slots from the feed
  const removePlaylists = () => {
    // Find all items in the feed
    const items = document.querySelectorAll('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row');

    if (items.length > 0) {
      console.log(`Found ${items.length} items in the feed`);

      items.forEach((item, index) => {
        console.log(`Checking item ${index + 1}`);

        // Check if the item contains a playlist link
        const playlistLink = item.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string[href^="/playlist"]');

        if (playlistLink) {
          console.log(`Found a playlist link in item ${index + 1}: ${playlistLink.href}`);

          // Remove the item
          item.remove();
          console.log(`Removed playlist item ${index + 1}`);
        } else {
          console.log(`Item ${index + 1} is not a playlist`);
        }
      });
    }
  };

  // Run the function initially
  console.log("Initial run of removePlaylists");
  removePlaylists();

  // Use a MutationObserver to watch for changes to the DOM and re-run the function when necessary
  const observer = new MutationObserver(() => {
    removePlaylists();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  console.log("MutationObserver set up and running");
})();

    // Your code here...
})();