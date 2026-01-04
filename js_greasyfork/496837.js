// ==UserScript==
// @name         CSS Gradient Paste Image
// @namespace    CSS Clipboard Upload
// @version      1.0
// @description  Add a paste image option to CSS Gradient and upload the image using the site's upload button
// @author       𝓝𝑒ⓦ 𝓙ⓐ¢𝓀🕹️
// @match        https://cssgradient.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496837/CSS%20Gradient%20Paste%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/496837/CSS%20Gradient%20Paste%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the DOM is fully loaded
    window.addEventListener('load', function() {
        // Function to create the "Paste Image" button
        function createPasteButton() {
            const div = document.querySelector('.app-options__content');
            if (div) {
                const pasteOption = document.createElement('div');
                pasteOption.className = 'app-option';

                const pasteButton = document.createElement('button');
                pasteButton.className = 'app-option__button';
                pasteButton.innerText = 'Paste Image';
                pasteOption.appendChild(pasteButton);

                // Add the paste option to the div
                div.appendChild(pasteOption);

                // Add event listener for paste event
                pasteButton.addEventListener('click', function() {
                    document.addEventListener('paste', function(event) {
                        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
                        for (const item of items) {
                            if (item.kind === 'file' && item.type.startsWith('image/')) {
                                const blob = item.getAsFile();
                                const fileInput = document.querySelector('.js-upload');
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(blob);
                                fileInput.files = dataTransfer.files;

                                // Trigger the change event to simulate uploading
                                const event = new Event('change');
                                fileInput.dispatchEvent(event);
                            }
                        }
                    }, { once: true });
                });
            } else {
                console.log('Target div not found');
            }
        }

        // Add the paste button to the page
        createPasteButton();
    });
})();
