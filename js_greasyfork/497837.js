// ==UserScript==
// @name         Image Spoiler
// @namespace    http://your.domain.com
// @version      0.1
// @description  Blur specific images and display 'SPOILER' text over them. Click to unblur.
// @author       Your Name
// @match        https://www.aywas.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497837/Image%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/497837/Image%20Spoiler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the URLs of the images you want to blur
    const imagesToBlur = [
        'https://www.aywas.com/images/images/pets/customs/custom_9d26fb505f58d32104da708f3f705111a1e93313.png',
        'https://example.com/image2.jpg',
        // Add more image URLs as needed
    ];

    // Function to blur the specified image and display 'SPOILER' text
    function blurImage(image) {
        let isBlurred = true;

        function toggleBlur() {
            if (isBlurred) {
                image.style.filter = 'none'; // Unblur the image
                spoilerText.remove();
            } else {
                image.style.filter = 'blur(8px)'; // Blur the image
                image.parentNode.appendChild(spoilerText);
            }
            isBlurred = !isBlurred; // Toggle the state
        }

        const spoilerText = document.createElement('div');
        spoilerText.textContent = 'SPOILER';
        spoilerText.style.position = 'absolute';
        spoilerText.style.top = '50%';
        spoilerText.style.left = '50%';
        spoilerText.style.transform = 'translate(-50%, -50%)';
        spoilerText.style.color = 'white';
        spoilerText.style.fontSize = '24px';
        spoilerText.style.fontWeight = 'bold';
        spoilerText.style.textShadow = '2px 2px 4px black';

        // Blur the image by default
        image.style.filter = 'blur(8px)';

        // Add click event listener to toggle blur/unblur when clicked
        image.addEventListener('click', toggleBlur);
    }

    // Find and blur images based on their URLs
    const allImages = document.querySelectorAll('img');
    allImages.forEach(function(image) {
        if (imagesToBlur.includes(image.src)) {
            blurImage(image);
        }
    });
})();
