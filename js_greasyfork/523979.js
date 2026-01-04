// ==UserScript==
// @name         Zoom Button for WordPress Caption Container
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds a Zoom button to enlarge the entire caption container and textarea in WordPress admin
// @author       attila.virag@centralmediacsoport.hu
// @match        *://*/*wp-admin/post.php*
// @grant        none
// @license      startlap.hu
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.com
// @downloadURL https://update.greasyfork.org/scripts/523979/Zoom%20Button%20for%20WordPress%20Caption%20Container.user.js
// @updateURL https://update.greasyfork.org/scripts/523979/Zoom%20Button%20for%20WordPress%20Caption%20Container.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Zoom Button script loaded.');

    // Store original styles to ensure proper reset
    let originalStyles = {};

    // Function to add the Zoom button
    function addZoomButton() {
        const captionContainer = document.querySelector('span.setting[data-setting="caption"]');

        if (!captionContainer) {
            console.error('Caption container not found. Waiting for it to appear.');
            return;
        }

        const captionTextarea = captionContainer.querySelector('#attachment-details-caption');

        if (!captionTextarea) {
            console.error('Caption textarea not found. Waiting for it to appear.');
            return;
        }

        const label = captionContainer.querySelector('label.name');

        if (!label) {
            console.error('Label not found. Waiting for it to appear.');
            return;
        }

        // Check if the button already exists
        if (captionContainer.querySelector('.zoom-button')) {
            console.log('Zoom button already added.');
            return;
        }

        // Store original styles if not already stored
        if (!originalStyles[captionContainer]) {
            originalStyles[captionContainer] = {
                position: captionContainer.style.position,
                zIndex: captionContainer.style.zIndex,
                top: captionContainer.style.top,
                left: captionContainer.style.left,
                width: captionContainer.style.width,
                height: captionContainer.style.height,
                backgroundColor: captionContainer.style.backgroundColor,
                padding: captionContainer.style.padding,
                margin: captionContainer.style.margin,
                transform: captionContainer.style.transform,
                boxShadow: captionContainer.style.boxShadow
            };

            originalStyles[captionTextarea] = {
                width: captionTextarea.style.width,
                height: captionTextarea.style.height,
                backgroundColor: captionTextarea.style.backgroundColor,
            };

            originalStyles[label] = {
                display: label.style.display
            };
        }

        // Create the Zoom button
        const zoomButton = document.createElement('button');
        zoomButton.textContent = 'Zoom';
        zoomButton.type = 'button';
        zoomButton.className = 'zoom-button';
        zoomButton.style.backgroundColor = '#0073aa';
        zoomButton.style.color = '#fff';
        zoomButton.style.border = 'none';
        zoomButton.style.borderRadius = '3px';
        zoomButton.style.padding = '5px 10px';
        zoomButton.style.cursor = 'pointer';

        // Add Zoom button functionality
        zoomButton.addEventListener('click', function() {
            const body = document.body;
            if (captionContainer.style.position === 'fixed') {
                // Reset to original size
                const original = originalStyles[captionContainer];
                captionContainer.style.position = original.position;
                captionContainer.style.zIndex = original.zIndex;
                captionContainer.style.top = original.top;
                captionContainer.style.left = original.left;
                captionContainer.style.width = original.width;
                captionContainer.style.height = original.height;
                captionContainer.style.backgroundColor = original.backgroundColor;
                captionContainer.style.padding = original.padding;
                captionContainer.style.margin = original.margin;
                captionContainer.style.transform = original.transform;
                captionContainer.style.boxShadow = original.boxShadow;

                const textareaOriginal = originalStyles[captionTextarea];
                captionTextarea.style.width = textareaOriginal.width;
                captionTextarea.style.height = textareaOriginal.height;
                captionTextarea.style.backgroundColor = textareaOriginal.backgroundColor;

                const labelOriginal = originalStyles[label];
                label.style.display = labelOriginal.display;

                body.style.overflow = 'auto'; // Re-enable scrolling
            } else {
                // Enlarge the entire container outside its original layout
                captionContainer.style.position = 'fixed';
                captionContainer.style.zIndex = '99999';
                captionContainer.style.top = '150px';
                captionContainer.style.left = '50%';
                captionContainer.style.transform = 'translateX(-50%)';
                captionContainer.style.width = '60%';
                captionContainer.style.height = 'auto';
                captionContainer.style.backgroundColor = 'antiquewhite';
                captionContainer.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 4px 8px';
                captionContainer.style.padding = '20px';

                captionTextarea.style.width = '100%';
                captionTextarea.style.height = '300px';
                captionTextarea.style.backgroundColor = 'white';

                label.style.display = 'flex';

                body.style.overflow = 'hidden'; // Disable scrolling
            }
        });

        // Append the Zoom button directly after the label
        if (label) {
            const wrapper = document.createElement('div');
            wrapper.style.margin = '5px';
            wrapper.style.textAlign = 'right';
            wrapper.appendChild(zoomButton);
            label.insertAdjacentElement('afterend', wrapper);
        } else {
            captionContainer.appendChild(zoomButton);
        }
    }

    // Observe DOM changes to ensure the script works when the media sidebar appears
    const observer = new MutationObserver(() => {
        addZoomButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
