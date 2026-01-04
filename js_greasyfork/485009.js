// ==UserScript==
// @name         Google Drive Image Preview Rotation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  Add buttons that allow rotation of preview in Google Drive
// @author       Sr.Generoso
// @match        https://drive.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485009/Google%20Drive%20Image%20Preview%20Rotation.user.js
// @updateURL https://update.greasyfork.org/scripts/485009/Google%20Drive%20Image%20Preview%20Rotation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a new child element
    function createChild(parentElement, text, className, clickHandler) {
        const child = document.createElement('button');
        child.textContent = text;
        child.classList.add(className);

        child.addEventListener('click', clickHandler);
        // Apply styles
        child.style.backgroundColor = 'rgba(0,0,0,.75)';
        child.style.border = 'none';
        parentElement.appendChild(child);
    }

    // Function to rotate the image container to the left
    function rotateLeft() {
        const imageContainer = findVisibleImageContainer();
        if (imageContainer) {
            // Adjust the rotation angle as needed
            const currentRotation = (imageContainer.style.transform.match(/(-?\d+)/) || [0])[0];
            const newRotation = (parseInt(currentRotation) - 90) % 360;
            imageContainer.style.transform = `rotate(${newRotation}deg)`;
        }
    }
    // Function to rotate the image container to the right
    function rotateRight() {
        const imageContainer = findVisibleImageContainer();
        if (imageContainer) {
            // Adjust the rotation angle as needed
            const currentRotation = (imageContainer.style.transform.match(/(\d+)/) || [0])[0];
            const newRotation = (parseInt(currentRotation) + 90) % 360;
            imageContainer.style.transform = `rotate(${newRotation}deg)`;
        }
    }

    // Function to find the visible image container
    function findVisibleImageContainer() {
        const imageContainers = document.querySelectorAll('.a-b-Sh-ng:not([style*="display: none;"])');
        for (const container of imageContainers) {
            if (container.offsetHeight > 0 && container.offsetWidth > 0) {
                return container;
            }
        }
        return null;
    }

    // Function to handle changes in the DOM
    function handleMutations(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                // Check if the target element with class 'a-b-vo' has been added
                const targetDiv = document.querySelector('.a-b-vo');
                if (targetDiv) {
                    // Check if buttons with the custom classes already exist
                    const leftButton = targetDiv.querySelector('.my-rotate-left');
                    const rightButton = targetDiv.querySelector('.my-rotate-right');

                    if (!leftButton) {
                        // Create a "Rotate Left" button
                        createChild(targetDiv, '↪️', 'my-rotate-left', rotateLeft);
                    }

                    if (!rightButton) {
                        // Create a "Rotate Right" button
                        createChild(targetDiv, '↩️', 'my-rotate-right', rotateRight);
                    }

                    // Disconnect the observer after adding buttons
                    observer.disconnect();
                }
            }
        });
    }


    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutationsList => handleMutations(mutationsList, observer));

    // Start observing the body for childList changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
