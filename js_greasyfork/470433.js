// ==UserScript==
// @name         Copy Modified URL on Click Twitter
// @match        https://twitter.com/*
// @description Copies fxtwitter links into your clipboard. Will make you share TikTok videos easier on platforms like Telegram and Discord.
// @license MIT
// @version 0.0.1.20230708182235
// @namespace https://greasyfork.org/users/1122038
// @downloadURL https://update.greasyfork.org/scripts/470433/Copy%20Modified%20URL%20on%20Click%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/470433/Copy%20Modified%20URL%20on%20Click%20Twitter.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // Function to handle the document click event
  function handleClick(event) {
    // Get the current URL
    var currentURL = window.location.href;

    // Modify the URL to use "vxtiktok.com"
    var modifiedURL = currentURL.replace(/^(https?:\/\/)(www\.)?([^\/]+)/i, "$1fxtwitter.com");

    // Copy the modified URL to the clipboard
    navigator.clipboard.writeText(modifiedURL)
      .then(function() {
        console.log('Modified URL copied to clipboard:', modifiedURL);
      })
      .catch(function(error) {
        console.error('Failed to copy the modified URL:', error);
      });
  }

  // Add a click event listener to the document
  document.addEventListener('click', handleClick);
})();
