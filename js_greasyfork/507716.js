// ==UserScript==
// @name         Youtube redirect
// @version      2024-09-09
// @license      MIT
// @description  Redirects to subscriptions on show more button click, since not all browsers have the "subscritpions" button
// @author       TTT
// @match        https://www.youtube.com/*
// @icon         https://th.bing.com/th/id/R.d615fcb54c8d0bc5d367cbba04bb8610?rik=fVRj7cvbxAp9TA&pid=ImgRaw&r=0
// @grant        none
// @namespace https://greasyfork.org/users/1253611
// @downloadURL https://update.greasyfork.org/scripts/507716/Youtube%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/507716/Youtube%20redirect.meta.js
// ==/UserScript==
// Function to check if the guide button exists
function checkGuideButton() {
  const guideButton = document.querySelector('#guide-button');
  if (guideButton) {
    clearInterval(guideButtonIntervalId); // Stop the interval if the guide button is found
    console.log("Guide button found!");

    // Add a click event listener to the guide button
    guideButton.addEventListener('click', () => {
      console.log("Guide button clicked!");

      let showMoreButtonFound = false;

      // Function to check if the "Show more" button exists
      function checkShowMoreButton() {
        const showMoreButton = document.querySelector('a[title="Show more"]');
        if (showMoreButton) {
          clearInterval(showMoreIntervalId); // Stop the interval if the "Show more" button is found
          console.log("Show more button found!");
          showMoreButtonFound = true;

          // Add a click event listener to the "Show more" button
          showMoreButton.addEventListener('click', () => {
            console.log("Show more button clicked!");
            window.location.href = 'https://www.youtube.com/feed/subscriptions';
          });
        }
      }

      // Set the interval to check every 0.1 seconds
      let showMoreIntervalId = setInterval(checkShowMoreButton, 100); // 100ms = 0.1 seconds

      // Set a timeout to clear the interval after 1 second if the "Show more" button isn't found
      setTimeout(() => {
        clearInterval(showMoreIntervalId);
        if (!showMoreButtonFound) {
          console.log("Time's up! Show more button not found.");
        }
      }, 1000); // 1000ms = 1 second
    });
  }
}

// Set the interval to check every 0.1 seconds
let guideButtonIntervalId = setInterval(checkGuideButton, 100); // 100ms = 0.1 seconds