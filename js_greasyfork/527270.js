// ==UserScript==
// @name         Display film ID in Erikalust
// @namespace    Erikalust
// @version      1.2.1
// @description  Appends the ID over images inside dynamically loaded elements with data-cy="hover-wrapper-{ID}"
// @author       Your Name
// @match        *://*watch.erikalust.com/film*
// @match        *://*watch.erikalust.com/categories/*
// @match        *://*watch.erikalust.com/series*
// @grant        none
// @license MIT
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAARVBMVEUAAAD///////////////////////////////////////////////////////////////////9/f39AQEC/v78AAACvr690OinaAAAAF3RSTlMAJWSaxOz7RZbk/yKK8Uq5UND/////y5x28xYAAADuSURBVHgBhZMFAoQwDASLw+Jpev9/6qVYDRmcTL1Rjiwvyqquq7LIM5XStB0uuraJwv0wImAcej8+zUiYJxdfVtywLlf5KH4Z09H+jAfmfhMGkBZIkPv+oZkhDNv4RoCM0RDYkNyOD2G0o20hGBsRyD6cgFbmr/MFREKXqRxvAnJVhAJHQqHKUEAklKryBUqEStXHP8NMpBOhFsH94xshbIJvmijfhTIeJjgeZjRR7AlWzuOp1r5AMtXRYrGGE+SjPZb7ErQvaBqbfcMwbRPFREa7D214UJb+xw6wx9x/bdrPbf+dON+p9528n+n/B+ymKG+l2nZsAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/527270/Display%20film%20ID%20in%20Erikalust.user.js
// @updateURL https://update.greasyfork.org/scripts/527270/Display%20film%20ID%20in%20Erikalust.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to append the ID text over the image
    function appendIDOverImage(wrapper) {
        // Find the anchor element with the data-tracking-id attribute
        const link = wrapper.querySelector('a[data-tracking-id]');

        if (!link) return; // If no <a> element is found, return

        // Extract the ID from the data-tracking-id attribute
        const trackingID = link.getAttribute('data-tracking-id');
        const id = trackingID.split('_')[0]; // Extract the ID part before the underscore

        // Check if the text element already exists to avoid duplication
        if (wrapper.querySelector('.id-overlay')) return;

        // Create a new text element to display the ID
        const textElement = document.createElement('div');
        textElement.textContent = `ID: ${id}`;

        // Style the text element
        textElement.className = 'id-overlay';
        textElement.style.position = 'absolute';
        textElement.style.top = '10px';
        textElement.style.left = '10px';
        textElement.style.color = 'white';
        textElement.style.fontSize = '14px';
        textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        textElement.style.padding = '5px';
        textElement.style.borderRadius = '5px';
        textElement.style.zIndex = '10';

        // Position the wrapper to relative if it's not already
        wrapper.style.position = 'relative';

        // Append the text element inside the wrapper
        wrapper.appendChild(textElement);
    }

    // Function to loop over all elements and append ID over images
    function appendIDsToAllElements() {
        if (document.querySelector('.movies-grid-container')) {
            const container = document.querySelector('.movies-grid-container');
            if (container) {
                Array.from(container.children).forEach(appendIDOverImage);
            }
        }
    }

    // Run the function initially when the page loads
    window.addEventListener('load', () => {
        appendIDsToAllElements();
    });

    // Observe for new elements loaded dynamically (like "Load More" content)
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;

                if (node.classList.contains('unicon')) {
                    const section = node.closest('section');
                    if (!section) return

                    const div = section.closest('div');
                    if (!div) return

                    const parentDiv = div?.parentNode?.parentNode;
                    if (parentDiv && parentDiv.classList.contains('relative')) {
                        appendIDOverImage(parentDiv);
                        return;
                    }
                }

                if (node.querySelector('.movies-grid-container')) {
                    const container = node.querySelector('.movies-grid-container');
                    if (container) {
                        Array.from(container.children).forEach(appendIDOverImage);
                    }
                }
            });
        });
    });
    // Start observing for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();