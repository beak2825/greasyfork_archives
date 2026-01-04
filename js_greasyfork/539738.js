// ==UserScript==
// @name         ThisVid Video Downloader
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Adds a toggleable button to download MP4/M4A video files from ThisVid.com.
// @author       Gemini
// @match        https://thisvid.com/videos/amazing-hands-free-cum-shot-from-a-huge-cock-11/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539738/ThisVid%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539738/ThisVid%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds the video element and creates the download UI.
     * This function is called after the entire page (including all resources like scripts and images)
     * has finished loading, ensuring the video element is likely present.
     */
    function initializeDownloadUI() {
        console.log('ThisVid Video Downloader: Initializing UI...');

        // Find the video element on the page
        // We'll look for a 'video' tag. ThisVid typically uses an HTML5 video player.
        const videoElement = document.querySelector('video');

        // If no video element is found, log a message and exit.
        if (!videoElement) {
            console.log('ThisVid Video Downloader: No <video> element found on this page. Script will not proceed.');
            return;
        }

        // Check if the video element has a source URL
        const videoUrl = videoElement.src;
        if (!videoUrl) {
            console.log('ThisVid Video Downloader: Found <video> element, but it has no "src" attribute. Script will not proceed.');
            return;
        }

        console.log('ThisVid Video Downloader: Video URL detected:', videoUrl);

        // --- Create the main container for the UI elements ---
        const container = document.createElement('div');
        container.id = 'thisvid-downloader-container'; // Assign an ID for easier identification
        container.style.position = 'fixed';       // Keep it in place while scrolling
        container.style.top = '15px';             // Distance from the top of the viewport
        container.style.right = '15px';           // Distance from the right of the viewport
        container.style.zIndex = '2147483647';    // Max z-index to ensure it's always on top
        container.style.display = 'flex';         // Use flexbox for layout
        container.style.flexDirection = 'column'; // Stack items vertically
        container.style.alignItems = 'flex-end';  // Align items to the right
        container.style.fontFamily = 'Inter, sans-serif'; // Preferred font
        container.style.borderRadius = '8px';     // Soften the corners of the container
        container.style.gap = '10px';             // Space between elements
        container.style.userSelect = 'none';      // Prevent text selection on the UI elements

        // --- Create the toggle button (🎥 icon) ---
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '🎥';            // The camera emoji icon
        toggleButton.style.fontSize = '30px';     // Make the emoji large
        toggleButton.style.background = 'linear-gradient(145deg, #e0e0e0, #c0c0c0)'; // Light gray gradient for neumorphism
        toggleButton.style.color = '#333';        // Dark gray text/icon color
        toggleButton.style.border = 'none';       // No default button border
        toggleButton.style.borderRadius = '50%';  // Make the button perfectly round
        toggleButton.style.width = '50px';        // Fixed width
        toggleButton.style.height = '50px';       // Fixed height
        toggleButton.style.cursor = 'pointer';    // Indicate it's clickable
        toggleButton.style.boxShadow = '5px 5px 10px rgba(0,0,0,0.2), -5px -5px 10px rgba(255,255,255,0.7)'; // Neumorphic shadow
        toggleButton.style.transition = 'all 0.2s ease-in-out'; // Smooth transition for hover effects
        toggleButton.style.display = 'flex';      // Use flexbox to center the emoji
        toggleButton.style.justifyContent = 'center'; // Center horizontally
        toggleButton.style.alignItems = 'center';   // Center vertically
        toggleButton.title = 'Toggle Video Download Link'; // Tooltip on hover

        // Add hover/active effects for the toggle button
        toggleButton.onmouseover = () => {
            toggleButton.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2), -2px -2px 5px rgba(255,255,255,0.7), inset 1px 1px 2px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.4)';
            toggleButton.style.transform = 'scale(0.98)';
        };
        toggleButton.onmouseout = () => {
            toggleButton.style.boxShadow = '5px 5px 10px rgba(0,0,0,0.2), -5px -5px 10px rgba(255,255,255,0.7)';
            toggleButton.style.transform = 'scale(1)';
        };
        toggleButton.onmousedown = () => {
             toggleButton.style.boxShadow = 'inset 3px 3px 7px rgba(0,0,0,0.2), inset -3px -3px 7px rgba(255,255,255,0.7)';
             toggleButton.style.transform = 'scale(0.96)';
        };
        toggleButton.onmouseup = () => {
             toggleButton.style.boxShadow = '5px 5px 10px rgba(0,0,0,0.2), -5px -5px 10px rgba(255,255,255,0.7)';
             toggleButton.style.transform = 'scale(1)';
        };


        // --- Create the download link ---
        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;          // Set the link's URL to the video source
        downloadLink.textContent = 'Download Video'; // Text displayed for the link

        // Attempt to extract a meaningful filename from the video URL
        let filename = 'video.mp4'; // Default filename
        try {
            const urlParts = videoUrl.split('/');
            let lastPart = urlParts[urlParts.length - 1];
            // Remove any query parameters (like ?v=...) from the filename
            filename = lastPart.split('?')[0];
            // If the filename is still empty or doesn't look like a file, append a default
            if (!filename || !filename.includes('.')) {
                filename = 'thisvid_video.mp4';
            }
        } catch (e) {
            console.error('ThisVid Video Downloader: Error parsing video URL for filename:', e);
            filename = 'thisvid_video.mp4'; // Fallback filename on error
        }
        downloadLink.download = filename; // Suggest this filename when the user downloads

        downloadLink.style.display = 'none'; // Initially hide the download link
        downloadLink.style.padding = '10px 15px'; // Padding around the text
        downloadLink.style.backgroundColor = '#4CAF50'; // Green background for the link
        downloadLink.style.color = 'white';       // White text color
        downloadLink.style.textDecoration = 'none'; // Remove underline from link
        downloadLink.style.borderRadius = '8px';  // Rounded corners for the link
        downloadLink.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; // Subtle shadow
        downloadLink.style.transition = 'background-color 0.3s ease, transform 0.2s ease'; // Smooth transitions for hover effects
        downloadLink.style.fontWeight = 'bold'; // Make the text bolder

        // Add hover effects for the download link
        downloadLink.onmouseover = () => {
            downloadLink.style.backgroundColor = '#45a049'; // Darker green on hover
            downloadLink.style.transform = 'translateY(-2px) scale(1.02)'; // Slightly lift and grow on hover
            downloadLink.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)'; // More pronounced shadow on hover
        };
        downloadLink.onmouseout = () => {
            downloadLink.style.backgroundColor = '#4CAF50'; // Restore original green
            downloadLink.style.transform = 'translateY(0) scale(1)'; // Restore original position and size
            downloadLink.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; // Restore original shadow
        };

        // --- Toggle functionality ---
        // When the toggle button is clicked, switch the visibility of the download link
        toggleButton.addEventListener('click', () => {
            if (downloadLink.style.display === 'none') {
                downloadLink.style.display = 'block'; // Show the link
                console.log('ThisVid Video Downloader: Download link shown.');
            } else {
                downloadLink.style.display = 'none'; // Hide the link
                console.log('ThisVid Video Downloader: Download link hidden.');
            }
        });

        // --- Append elements to the DOM ---
        container.appendChild(toggleButton); // Add the toggle button to the container
        container.appendChild(downloadLink); // Add the download link to the container

        document.body.appendChild(container); // Add the entire container to the web page's body

        console.log('ThisVid Video Downloader: UI elements added to page.');
    }

    // Use window.onload to ensure all resources are loaded before trying to find the video element.
    window.addEventListener('load', initializeDownloadUI);
})();
