// ==UserScript==
// @name Play All From Creator
// @namespace Violentmonkey Scripts
// @match https://www.youtube.com/*
// @grant none
// @run-at document-end
// @version 2.3
// @license MIT
// @description Inserts a button next to the subscribe button under the YouTube video player to redirect to a playlist in a new tab containing all videos uploaded by the creator of the current video.
// @downloadURL https://update.greasyfork.org/scripts/490737/Play%20All%20From%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/490737/Play%20All%20From%20Creator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to recursively find a value by key
    function findValueBySiblingAndTargetKey(obj, siblingKey, targetKey) {
        if (obj.hasOwnProperty(siblingKey) && obj.hasOwnProperty(targetKey)) {
          return obj[targetKey];
        }

        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            const result = findValueBySiblingAndTargetKey(obj[key], siblingKey, targetKey);
            if (result !== undefined) {
              return result;
            }
          }
        }

        return undefined; // Key not found
      }



    // Function to handle the redirection
    function redirectToPlaylist() {
        const ytInitialData = window['ytInitialData'] || window['ytInitialPlayerResponse'];
        if (ytInitialData) {
            var channelID = findValueBySiblingAndTargetKey(ytInitialData, "canonicalBaseUrl", "browseId");
            if (channelID) {
                // Open the playlist in a new tab
                if (channelID.startsWith("UC")) window.open("https://www.youtube.com/playlist?list=" + channelID.replace("UC", "UU"));
                else console.log("ChannelID does not start with UC")
            }
        } else {
            console.log("channelID is undefined!");
        }

    }
    // Function to insert the "Play All From Creator" button next to the subscribe button
    function insertPlayAllButton() {
        // Attempt to find the "owner" div and the "subscribe-button" within it
        const ownerDiv = document.getElementById('owner');
        const subscribeButton = ownerDiv ? ownerDiv.querySelector('#subscribe-button') : null;

        if (ownerDiv && subscribeButton) {
            // Create the button
            const playAllButton = document.createElement('button');
            playAllButton.textContent = '▶ All';
            playAllButton.title="Open a playlist of all uploaded videos by this user in a new tab";
            playAllButton.style.cssText = `
              background-color: #3ea6ff;
              color: white;
              border: none;
              padding: 5px 10px;
              margin-left: 10px;
              border-radius: 3px;
              font-weight: bold;
              cursor: pointer;
            `;

            // Insert the button next to the subscribe button
            subscribeButton.parentNode.insertBefore(playAllButton, subscribeButton.nextSibling);

            // Add event listener to redirect when the button is clicked
            playAllButton.addEventListener('click', redirectToPlaylist);
        } else {
            // Retry after a delay if the necessary elements aren't available yet
            setTimeout(insertPlayAllButton, 1000);
        }
    }

    // Insert the button when the script runs
    insertPlayAllButton();
})();