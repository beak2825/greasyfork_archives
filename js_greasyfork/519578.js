// ==UserScript==
// @name           YouTube Auto Commenter
// @namespace      https://github.com/yashu1wwww 
// @version        1.1.7
// @description    Automatically posts comments on YouTube videos and refreshes other videos to post comments automatically.
// @author         Yashawanth R 
// @license        MIT
// @match          https://*.youtube.com/watch*
// @grant          none
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/519578/YouTube%20Auto%20Commenter.user.js
// @updateURL https://update.greasyfork.org/scripts/519578/YouTube%20Auto%20Commenter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // List of comments
  const comments = [
    "Super!",
    "Amazing one!",
    "What an acting!",
    "Great video!",
    "Have a nice day!",
    "Keep going!",
    "Keep rocking!",
    "All the best buddy!",
    "Next video please!",
    "One of the best videos I've ever seen!",
    "Wonderful day!",
    "Great one seen today!",
    "Superb!",
    "Magnifying!",
    "Shared with my friends!",
    "Best thing on the internet!",
    "Sensational video!",
    "Dashing!",
    "Marvelous!",
    "Next big video on the internet!",
    "Always good content!",
    "People will really like this video!",
    "Good food makes humans happy!",
    "All the best, dude!",
  ];

  // Prompt the user for the number of comments to post
  const MAX_COMMENTS = parseInt(prompt("How many comments would you like to post?", 10)) || 10;
  let commentCount = 0; // Counter for comments

  // Selectors
  const SELECTORS = {
    COMMENT_BOX: 'ytd-comments ytd-comment-simplebox-renderer div#placeholder-area',
    COMMENT_INPUT: '#contenteditable-root',
    COMMENT_SUBMIT_BUTTON: '#submit-button',
  };

  // Scroll to the comment section
  function scrollToComments() {
    console.log('Scrolling to comments...');
    window.scrollTo(0, 600); // Adjust scrolling position if needed
    return new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for comments to load
  }

  // Post a comment
  async function postComment() {
    try {
      const commentBox = document.querySelector(SELECTORS.COMMENT_BOX);
      if (commentBox) {
        console.log('Opening comment box...');
        commentBox.click();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const commentInput = document.querySelector(SELECTORS.COMMENT_INPUT);
        if (commentInput) {
          const comment = comments[commentCount % comments.length]; // Get a comment from the list
          console.log(`Adding comment: ${comment}`);
          commentInput.innerText = comment;

          const submitButton = document.querySelector(SELECTORS.COMMENT_SUBMIT_BUTTON);
          if (submitButton) {
            console.log('Submitting comment...');
            submitButton.click();
            commentCount++;
            return true;
          }
        }
      }
      console.log('Comment box or input not found.');
      return false;
    } catch (error) {
      console.error('Error posting comment:', error);
      return false;
    }
  }

  // Main function
  async function autoComment() {
    console.log('Starting YouTube Auto-Commenter...');
    while (commentCount < MAX_COMMENTS) {
      await scrollToComments();
      const success = await postComment();
      if (!success) break;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay after each comment for video to load
    }
    console.log('Finished posting comments.');
  }

  // Add a delay of 2 seconds before running the main comment process
  setTimeout(() => {
    // Run script on video pages
    if (window.location.href.includes('youtube.com/watch')) {
      setTimeout(autoComment, 3000); // Delay to allow the page to load
    }
  }, 2000); // Wait 2 seconds before starting
})();
