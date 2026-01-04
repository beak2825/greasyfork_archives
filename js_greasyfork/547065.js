// ==UserScript==
// @name        Facebook Mass Post Publication
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/groups/*/spam
// @grant       GM_registerMenuCommand
// @version     1
// @license     The Unlicense
// @author      ImpatientImport
// @description Userscript created to save time with publishing posts in a group automatically instead of manually. Made with help from Claude Sonnet 4.
// @downloadURL https://update.greasyfork.org/scripts/547065/Facebook%20Mass%20Post%20Publication.user.js
// @updateURL https://update.greasyfork.org/scripts/547065/Facebook%20Mass%20Post%20Publication.meta.js
// ==/UserScript==

(function() {
  'use strict';

  async function publish_posts(){
    var all_publish_buttons = document.querySelectorAll('[aria-label="Publish"]');
    console.log(`Found ${all_publish_buttons.length} publish buttons`);

    // Process each button individually
    for (let i = 0; i < all_publish_buttons.length; i++) {
      var current_publish_button = all_publish_buttons[0]; // The published button will shift everything back 1 in theory since it disappears on publishing, so putting 0 is better because the list shifts itself. Previously i in brackets.

      if (current_publish_button) {
        current_publish_button.click();
        console.log(`Published post ${i + 1}/${all_publish_buttons.length}`);

        // Add delays to avoid getting flagged
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      } else {
        console.log(`Publish button ${i} not found`);
      }

      // Take a longer break every 10 posts
      if ((i + 1) % 10 === 0) {
        console.log(`Taking 5 second break after ${i + 1} posts...`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec break
      }
    }

    console.log('All posts published!');
  }

  GM_registerMenuCommand("Publish all posts", publish_posts);
})();