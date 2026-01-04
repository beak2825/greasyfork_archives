// ==UserScript==
// @name         YouTube - Add Watch on Piped button to each video
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add "Watch on Piped" button YouTube videos
// @author       camj
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477267/YouTube%20-%20Add%20Watch%20on%20Piped%20button%20to%20each%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/477267/YouTube%20-%20Add%20Watch%20on%20Piped%20button%20to%20each%20video.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to replace 'www.youtube.com' with 'piped.kavin.rocks'
    function replaceYouTubeURL(url) {
        return url.replace('www.youtube.com', 'farside.link/piped/');
    }

    // Function to handle the "Watch on Piped" button click
    function watchOnPipedButtonClick(event) {
        // Get the link to the video
        var videoLink = event.currentTarget.parentNode.querySelector('a');

        // Check if the link exists
        if (videoLink) {
            // Replace the YouTube URL with the Piped URL
            var pipedURL = replaceYouTubeURL(videoLink.href);

            // Open the Piped URL in a new tab
            window.open(pipedURL, '_blank');
        }
    }

    // Add "Watch on Piped" button below each specified video
    function addWatchOnPipedButton(video) {
        // Check if the video container has the correct id and class
        if (video.id === 'content' && video.classList.contains('style-scope', 'ytd-rich-item-renderer')) {
            // Check if the button already exists
            var existingButton = video.querySelector('.watch-on-piped-button');
            if (!existingButton) {
                // Create a new button element
                var button = document.createElement('button');
                button.innerText = 'Watch on Piped';
                button.classList.add('watch-on-piped-button');

                // Add event listener to handle the click
                button.addEventListener('click', watchOnPipedButtonClick);

                // Append the new button below the video
                video.appendChild(button);
            }
        }
    }

    // Function to handle changes in the DOM
    function handleDOMChanges(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if videos were added to the DOM
                const addedVideos = Array.from(document.querySelectorAll('.style-scope.ytd-rich-item-renderer'));
                
                // Add the "Watch on Piped" button for each video
                addedVideos.forEach(addWatchOnPipedButton);
            }
        }
    }

    // Observe changes in the DOM to handle dynamically added videos
    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    // Add the "Watch on Piped" button for existing videos
    const existingVideos = document.querySelectorAll('.style-scope.ytd-rich-item-renderer');
    existingVideos.forEach(addWatchOnPipedButton);
})();