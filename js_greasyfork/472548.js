// ==UserScript==
// @name         [not working] Download Twitter video button by redirecting to getvideobot.com
// @version      1.1
// @description  Button to redirect Twitter URLs to a video download site (getvideobot.com)
// @author       Rust1667
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://twitter.com/*/status/*
// @match        https://x.com/*/status/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/472548/%5Bnot%20working%5D%20Download%20Twitter%20video%20button%20by%20redirecting%20to%20getvideobotcom.user.js
// @updateURL https://update.greasyfork.org/scripts/472548/%5Bnot%20working%5D%20Download%20Twitter%20video%20button%20by%20redirecting%20to%20getvideobotcom.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to create and attach the custom button
    function addCustomButton() {
        // Check if there's an embedded video on the page
        //const videoElement = document.querySelector('video');

        // Only add the button if a video element is found
        if (true) {
            // Create the button element
            const customButton = document.createElement('button');
            customButton.innerText = 'Download Video';
            customButton.style.backgroundColor = 'blue';
            customButton.style.color = 'white';
            customButton.style.padding = '8px 16px';
            customButton.style.border = 'none';
            customButton.style.borderRadius = '4px';
            customButton.style.cursor = 'pointer';
            customButton.style.position = 'absolute';
            customButton.style.top = '10px'; // Adjust top position as needed
            customButton.style.left = '10px'; // Adjust left position as needed

            // Define the button's click behavior
            customButton.addEventListener('click', function() {
                const currentURLencoded = encodeURIComponent(window.location.href);
                const downloadURL = `https://getvideobot.com/download?url=${currentURLencoded}`;
                window.location.href = downloadURL;
            });

            // Append the custom button to the document's body
            document.body.appendChild(customButton);
        }
    }

    // Wait for the DOM to be ready
    window.addEventListener('load', addCustomButton);
})();