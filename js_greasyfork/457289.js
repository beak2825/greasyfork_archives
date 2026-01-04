// ==UserScript==
// @name         YouTube Swear Word Filter
// @namespace    http://yourwebsite.com/
// @version      1.0
// @description  Hides or replaces swear words in YouTube comments
// @author       Test Some
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457289/YouTube%20Swear%20Word%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/457289/YouTube%20Swear%20Word%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // List of swear words to hide or replace
  const swearWords = [
    "damn",
    "hell",
    "crap",
    "darn",
    "shoot",
    "sh*t",
    "damn",
    "fu*k"
  ];

  // Replace swear words with asterisks
  function censor(text) {
    swearWords.forEach(function(word) {
      text = text.replace(word, "*".repeat(word.length));
    });
    return text;
  }

  // Add an observer to monitor the comment section
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Find all comment elements
      const comments = document.querySelectorAll(".comment-renderer-text-content");
      for (const comment of comments) {
        // Replace swear words in the comment text
        comment.innerHTML = censor(comment.innerHTML);
      }
    });
  });

  // Start observing the comment section
  observer.observe(document.getElementById("comments"), {
    childList: true,
    subtree: true
  });

  // You can add more filters here to hide or replace other types of content in the comments

})();
