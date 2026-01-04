// ==UserScript==
// @name         Remove Blur from Meetup Images, Popup, and Increase Image Size
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Removes the blur effect from images on Meetup, hides popups like Meetup+, and increases the size of static images.
// @author       Your Name
// @match        *://*.meetup.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512432/Remove%20Blur%20from%20Meetup%20Images%2C%20Popup%2C%20and%20Increase%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/512432/Remove%20Blur%20from%20Meetup%20Images%2C%20Popup%2C%20and%20Increase%20Image%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove blur from images
    const removeBlur = () => {
        const blurredImages = document.querySelectorAll('img.blur-sm');
        blurredImages.forEach(img => {
            img.classList.remove('blur-sm');
        });

        // Override the blur CSS globally to ensure it takes effect
        let style = document.getElementById('unblur-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'unblur-style';
            style.innerHTML = `.blur-sm { filter: none !important; }`;
            document.head.appendChild(style);
        }
    };

    // Function to increase image size
    const increaseImageSize = () => {
        const images = document.querySelectorAll('img[src*="meetupstatic.com/photos/member"]');
        images.forEach(img => {
            img.style.width = '160px';  // Set the desired width
            img.style.height = '160px'; // Set the desired height
            img.style.minWidth = '160px';
            img.style.minHeight = '160px';
        });
    };

    // Function to remove the popup
    const removePopup = () => {
        const popup = document.querySelector('.grid.h-full.grid-cols-1.md\\:grid-cols-2'); // Adjusted for dynamic classnames
        if (popup) {
            popup.style.display = 'none';  // Hide the popup
            return true;  // Return true to indicate popup was found and removed
        }
        return false;  // Return false if popup is not found
    };

    // Function to remove padlock from images
    const removePadlock = () => {
        const padlocks = document.querySelectorAll('path[fill-rule="evenodd"]'); // Select padlock path elements
        padlocks.forEach(padlock => {
            const parent = padlock.closest('svg'); // Get the closest SVG parent
            if (parent && parent.getAttribute('data-src')?.includes('lock-outline.svg')) {
                parent.remove(); // Remove the entire SVG element if data-src contains 'lock-outline.svg'
            }
        });
    };


    // Function to apply all modifications
    const applyModifications = () => {
        removeBlur();
        //increaseImageSize();
        removePopup(); // Remove the popup if present
        removePadlock(); // Remove padlocks from images
    };

    // Use MutationObserver to detect changes in the DOM (for dynamically loaded content)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                applyModifications(); // Apply changes whenever new nodes are added
            }
        });
    });

    // Observe the body for added nodes (popups or new images)
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial application of modifications when the script first runs
    applyModifications();

})();
