// ==UserScript==
// @name        Cineby.app Aspect Ratio Corrector & Display
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Corrects video aspect ratio with black bars and displays it on cineby.app.
// @author      Your Name
// @match       https://cineby.app/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/539321/Cinebyapp%20Aspect%20Ratio%20Corrector%20%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/539321/Cinebyapp%20Aspect%20Ratio%20Corrector%20%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * The selector to find the main video element on the page.
     * YOU WILL LIKELY NEED TO CHANGE THIS based on cineby.app's HTML structure.
     * Examples:
     * If the video has an ID: '#myVideoPlayer'
     * If the video is inside a div with a specific class: '.video-player video'
     * If it's just a common video tag: 'video' (less specific, might catch other videos)
     * To find this:
     * 1. Go to a movie/show page on cineby.app.
     * 2. Right-click on the video player and select "Inspect" or "Inspect Element".
     * 3. Look for the `<video>` tag and its parent containers for unique IDs or classes.
     */
    const videoSelector = 'video'; // Common fallback, adjust as needed

    // Function to calculate and format aspect ratio
    function getAspectRatio(width, height) {
        if (width === 0 || height === 0) return 'N/A';
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(width, height);
        return `${width / divisor}:${height / divisor}`;
    }

    // Function to apply aspect ratio correction and display info
    function applyAspectRatioCorrection() {
        const video = document.querySelector(videoSelector);

        if (!video) {
            console.warn(`Cineby.app Aspect Ratio Script: Video element not found with selector: "${videoSelector}"`);
            return;
        }

        // Wait for video metadata to load to get intrinsic dimensions
        video.addEventListener('loadedmetadata', () => {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (videoWidth === 0 || videoHeight === 0) {
                console.warn('Cineby.app Aspect Ratio Script: Video intrinsic dimensions are 0, cannot calculate aspect ratio.');
                return;
            }

            const calculatedAspectRatio = getAspectRatio(videoWidth, videoHeight);
            const aspectRatioPercentage = (videoHeight / videoWidth) * 100;

            console.log(`Cineby.app Aspect Ratio Script: Detected video dimensions: ${videoWidth}x${videoHeight}, Aspect Ratio: ${calculatedAspectRatio}`);

            // 1. Create a wrapper div to enforce aspect ratio with black bars
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: relative;
                width: 100%;
                padding-bottom: ${aspectRatioPercentage}%; /* Maintain aspect ratio */
                background-color: black; /* Black bars */
                overflow: hidden; /* Hide anything outside */
                margin: 20px auto; /* Center and add some margin */
                max-width: 90vw; /* Responsive sizing */
                border-radius: 8px; /* Rounded corners */
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            `;

            // 2. Move the video into the new wrapper
            const parent = video.parentNode;
            if (parent) {
                parent.insertBefore(wrapper, video);
                wrapper.appendChild(video);
            } else {
                // Fallback if parent is null (shouldn't happen for a live element)
                document.body.prepend(wrapper);
                wrapper.appendChild(video);
            }

            // 3. Apply styles to the video itself within the wrapper
            video.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain; /* This ensures the video scales within the wrapper, creating bars */
                background-color: black; /* Ensures consistent black for bars */
                z-index: 1; /* Ensure video is on top */
            `;

            // 4. Create and display the aspect ratio text
            const infoDisplay = document.createElement('div');
            infoDisplay.id = 'cineby-aspect-ratio-info';
            infoDisplay.style.cssText = `
                position: absolute;
                top: 10px;
                left: 10px;
                background-color: rgba(0, 0, 0, 0.6);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-family: 'Inter', sans-serif;
                font-size: 0.9em;
                z-index: 10; /* Ensure it's above the video */
            `;
            infoDisplay.textContent = `Aspect Ratio: ${calculatedAspectRatio}`;

            wrapper.appendChild(infoDisplay); // Add info display inside the wrapper

            console.log('Cineby.app Aspect Ratio Script: Aspect ratio correction applied.');

            // Add a resize listener to handle dynamic adjustments (though CSS handles most of it)
            window.addEventListener('resize', () => {
                // This specific approach of padding-bottom based on intrinsic ratio is inherently responsive.
                // No need to re-calculate unless the video itself changes size without a reload.
                // However, if other elements on the page shift, this might help.
                // For this script, the CSS handles responsiveness directly.
            });

        }, { once: true }); // Run loadedmetadata only once

        // Fallback for cases where loadedmetadata might not fire or video is already ready
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            video.dispatchEvent(new Event('loadedmetadata'));
        }
    }

    // Run the script on window load to ensure all elements are present
    window.addEventListener('load', applyAspectRatioCorrection);

    // Also run on DOMContentLoaded in case video is ready earlier
    document.addEventListener('DOMContentLoaded', applyAspectRatioCorrection);

})();
