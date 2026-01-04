// ==UserScript==
// @name         Filter Users on The Register Forums
// @namespace    http://tampermonkey.net/
// @version      2025-03-26
// @description  Hide posts from specific users on forums.theregister.com
// @author       Obscure generic script found somewhere, and modified to suit this site by Jamie Jones
// @match        https://forums.theregister.com/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theregister.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530028/Filter%20Users%20on%20The%20Register%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/530028/Filter%20Users%20on%20The%20Register%20Forums.meta.js
// ==/UserScript==

(function()
  {
    'use strict';

    // Define the usernames here. The entries are case sensitive.

    // "users_removed" contains a list of users whose posts are removed completely.
    // "users_hidden' contains a list of users whose posts are hidden, but can be restored by clicking.

    const users_removed = [ 'Jellied Eel', 'herman', 'Disgusted Of Tunbridge Wells', 'cedric', 'beast666', 'Lord Elpuss', 'Cliffwilliams44', 'naive', 'SundogUK', 'Art Slartibartfast' ];

    const users_hidden = [ 'codejunky', 'klh', 'VoiceOfTruth', 'bombastic bob' ]

    // Function to filter new posts or replies
    function filter_posts (the_class, the_text)
      {
        // Get all posts on the page
        const posts = document.querySelectorAll (the_class); // Adjust the selector based on actual post container

        posts.forEach (post =>
          {
            // Find the username element within each post
            const usernameElement = post.querySelector ('a.author');

            if (usernameElement)
              {
                if (users_removed.includes (usernameElement.textContent.trim()))
                  post.innerHTML = '<p style="color: red; font-weight: bold; font-size: 14px">' + the_text + ' removed (User: ' + usernameElement.textContent + ')</p>';
                 else if (usernameElement && users_hidden.includes (usernameElement.textContent.trim()))
                  {
                    // Replace the post if it matches a blocked user
                    post.insertAdjacentHTML ('beforebegin', '<p style="color: red; font-weight: bold; font-size: 14px; padding-left: 5px; padding-top: 12px" onclick="let the_post = this.nextSibling.style; the_post.display=\'block\'; the_post.border=\'2px dotted red\'; the_post.borderRadius=\'15px\'; this.style.display=\'none\'">' + the_text + ' hidden (User: ' + usernameElement.textContent + ') - Click to reveal.</p>');
                    post.style.display = 'none';
                  }
              }
          });
       }

    // Function to filter new posts AND replies
    //
    // Possible div classes that encapsulate posts:
    //   <div class="post deleted edited"
    //   <div class="post deleted reply edited"
    //   <div class="post deleted with-image reply edited"
    //   <div class="post edited"
    //   <div class="post first deleted edited"
    //   <div class="post first edited"
    //   <div class="post first with-image edited"
    //   <div class="post reply edited"
    //   <div class="post staff with-image reply edited"
    //   <div class="post with-image edited"
    //   <div class="post with-image reply edited"
    //
    function filter_first_posts_and_replies()
      {
        filter_posts ('div.post.first', 'Post');
        filter_posts ('div.post.reply', 'Reply');
        filter_posts ('div.post.edited:not(.first, .reply)', 'Post/Reply');
      }

    // Run the filter when the page loads
    window.addEventListener ('load', filter_first_posts_and_replies);
})();
