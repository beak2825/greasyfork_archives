// ==UserScript==
// @name         Cohh VodChat Next Video Button
// @namespace    https://github.com/erasels
// @version      1.0
// @description  Adds a next button to navigate to the next video in a Playlist.
// @author       erasels
// @match        https://vodchat.cohhilition.com/video/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohhilition.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500091/Cohh%20VodChat%20Next%20Video%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/500091/Cohh%20VodChat%20Next%20Video%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the "Next" button
    function addButton() {
        // Locate the navigation bar
        const navBar = document.querySelector('#mainnav');

        // Create a new list item and anchor element for the button
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.textContent = 'Next Video';
        a.href = '#';
        a.style = 'cursor: pointer;';

        // Append the new elements to the navigation bar
        li.appendChild(a);
        navBar.appendChild(li);

        // Event listener for the Next button
        a.addEventListener('click', function(e) {
            e.preventDefault();
            goToNextVideo(false);
        });
    }

    // Function to navigate to the next video
    function goToNextVideo(automatic) {
        // Get the current URL
        let currentUrl = window.location.pathname;

        // Find the list of video links
        let videos = document.querySelectorAll('#other_videos .has_chat');

        // Iterate through the video links to find the next one
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].href.endsWith(currentUrl)) {
                if (i + 1 < videos.length) {
                    videos[i + 1].click();
                    return;
                }
            }
        }

        if(!automatic) {
            // Handle the case where the current video is the last one
            alert('You are at the last video.');
        }
    }

    // Run the addButton function when the page loads
    window.addEventListener('load', addButton);
})();