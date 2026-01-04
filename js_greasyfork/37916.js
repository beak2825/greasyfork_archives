// ==UserScript==
// @name       Feedless Facebook
// @author     Adam Novak, miXwui
// @version    1.5
// @description Remove the news feed from Facebook to prevent distraction
// @include    /https?:\/\/www.facebook.com\/*/
// @noframes
// @run-at     document-end
// @grant      none
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/37916/Feedless%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/37916/Feedless%20Facebook.meta.js
// ==/UserScript==

// (C) 2020 Adam Novak, miXwui
// MIT license
// Inspired by the Chrome extension "Feedless Facebook":
// https://github.com/owocki/feedlessfacebook

let hackPage = function() {
  let facebook = document.getElementById('facebook');
  if (facebook !== null) {
    // This is a real main Facebook page

    const main = facebook.querySelector('[role="main"]');

    // Find the newsfeed
    const newsfeed = facebook.querySelector('[role="feed"]');
    
    const hider = document.getElementById('hideFeed')

    if (main && newsfeed && !hider) {
      // This is a real main page we haven't done yet

      // Create a way to show and re-hide the news feed
      let button = document.createElement('button');
      button.id = 'hideFeed'
      newsfeed.parentNode.insertBefore(button, newsfeed)
      // Define a way to show and hide the news feed
      var feedShown = true
      let toggleFeed = function() {
        if (feedShown) {
          // Hide
          newsfeed.style.display='none';
          button.innerText = '[+] Show Newsfeed';
          feedShown = false;
        } else {
          // Show
          newsfeed.style.display='block';
          button.innerText = '[-] Hide Newsfeed';
          feedShown = true;
        }
      }
      // Toggle the feed when the button is clicked
      button.addEventListener('click', toggleFeed);
      // Actually hide the feed
      toggleFeed();
    }
  }
}

hackPage();

// Not sure the button disappears without a setTimeout
// A rerender or something is clearing out the added button element
// or something but I'm too lazy to spend the time to figure it out eh
setTimeout(hackPage, 1000);



