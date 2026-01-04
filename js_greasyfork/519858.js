// ==UserScript==
// @name         CAI CharPic replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace char avatar in chats with storage, chat-specific.
// @match        https://character.ai/chat/*
// @grant        none
// @author       LuxTallis
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519858/CAI%20CharPic%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/519858/CAI%20CharPic%20replacer.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const TARGET_IMAGE_BASE_URL = "https://characterai.io/i/400/static/avatars/uploaded/";
    const BROADER_SELECTOR = 'div.group img.object-cover'; // Broad selector for images in div.group
    const EXCLUDED_SELECTOR = '.flex-row-reverse img.object-cover.object-top'; // Specific selector to exclude

    // Get the current chat identifier from the URL
    function getCurrentChatId() {
        const match = window.location.pathname.match(/\/chat\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // Save a custom image URL for the current chat
    function saveCustomImageUrlForChat(chatId, url) {
        const chatImages = JSON.parse(localStorage.getItem('chat_images') || '{}');
        chatImages[chatId] = url;
        localStorage.setItem('chat_images', JSON.stringify(chatImages));
        addToLibrary(url); // Add to the recent library
    }

    // Get the custom image URL for the current chat
    function getCustomImageUrlForChat(chatId) {
        const chatImages = JSON.parse(localStorage.getItem('chat_images') || '{}');
        return chatImages[chatId] || '';
    }

    // Add image to the library of recent images
    function addToLibrary(url) {
        const library = getLibrary();
        if (!url || library.includes(url)) return;
        library.push(url);
        if (library.length > 10) library.shift(); // Limit library to 10 images
        saveLibrary(library);
    }

    // Remove image from the library
    function removeFromLibrary(url) {
        let library = getLibrary();
        library = library.filter(item => item !== url);
        saveLibrary(library);
    }

    // Save the image library to local storage
    function saveLibrary(library) {
        localStorage.setItem('image_library', JSON.stringify(library));
    }

    // Get the image library from local storage
    function getLibrary() {
        return JSON.parse(localStorage.getItem('image_library') || '[]');
    }

    // Replace images with the custom URL for the current chat, excluding unwanted elements
    function replaceImagesForChat(customUrl) {
        const images = document.querySelectorAll(BROADER_SELECTOR);
        images.forEach((image) => {
            // Skip images matching the excluded selector
            if (image.closest(EXCLUDED_SELECTOR)) return;

            if (image.src.startsWith(TARGET_IMAGE_BASE_URL)) {
                // Hide the image immediately using visibility
                image.style.visibility = 'hidden';

                // Create a new image element and set its source
                const newImage = new Image();
                newImage.src = customUrl;

                // Wait for the new image to fully load
                newImage.onload = function () {
                    // Once the new image is loaded, set it to the original image
                    image.src = customUrl;
                    image.style.visibility = 'visible';  // Make the image visible
                };
            }
        });
    }

    // Function to observe and replace images on load or DOM changes
    function observeNewImages() {
        // Using setInterval to continuously check and replace images
        setInterval(() => {
            const chatId = getCurrentChatId();
            if (chatId) {
                const savedImageUrl = getCustomImageUrlForChat(chatId);
                if (savedImageUrl) {
                    replaceImagesForChat(savedImageUrl);
                }
            }
        }, 100); // Check every 100ms for new images
    }

    // Function to clean up the image library by removing unused URLs
    function cleanUpLibrary() {
        const chatImages = JSON.parse(localStorage.getItem('chat_images') || '{}');
        const usedUrls = new Set(Object.values(chatImages)); // Get all used URLs from active chats
        let library = getLibrary();

        // Filter library to only include URLs that are still used in active chats
        library = library.filter(url => usedUrls.has(url));
        saveLibrary(library); // Save the cleaned library
    }

    // Create the button
    const button = document.createElement('button');
    button.innerHTML = '👤';
    button.style.position = 'fixed';
    button.style.top = '110px'; // Positioned below the background script button
    button.style.right = '5px';
    button.style.width = '22px';
    button.style.height = '22px';
    button.style.backgroundColor = '#444';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Montserrat, sans-serif';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.zIndex = '9999';

    // Add the button to the document
    document.body.appendChild(button);

    // Add functionality to set a new image URL for the current chat
    button.addEventListener('click', () => {
        const chatId = getCurrentChatId();
        if (!chatId) {
            alert('Could not determine the chat ID.');
            return;
        }

        // Create popup panel
        const popup = document.createElement('div');
        popup.id = 'imagePopup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#1e1e1e';
        popup.style.color = 'white';
        popup.style.borderRadius = '5px';
        popup.style.padding = '20px';
        popup.style.zIndex = '9999';
        popup.style.fontFamily = 'Montserrat, sans-serif';
        popup.style.minWidth = '300px';
        popup.style.maxWidth = '500px';

        const label = document.createElement('label');
        label.textContent = 'Enter Image URL:';
        label.style.display = 'block';
        label.style.marginBottom = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter image URL';
        input.style.width = '100%';
        input.style.marginBottom = '10px';

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Image';
        applyButton.style.marginTop = '10px';
        applyButton.style.padding = '5px 10px';
        applyButton.style.border = 'none';
        applyButton.style.borderRadius = '3px';
        applyButton.style.backgroundColor = '#444';
        applyButton.style.color = 'white';
        applyButton.style.fontFamily = 'Montserrat, sans-serif';
        applyButton.addEventListener('click', () => {
            const url = input.value.trim();
            if (url) {
                saveCustomImageUrlForChat(chatId, url);
                replaceImagesForChat(url);
                popup.remove();
            }
        });

        // Default button (Revert to Default)
        const defaultButton = document.createElement('button');
        defaultButton.textContent = 'Default';
        defaultButton.style.marginTop = '10px';
        defaultButton.style.padding = '5px 10px';
        defaultButton.style.border = 'none';
        defaultButton.style.borderRadius = '3px';
        defaultButton.style.backgroundColor = '#444'; // Same as Apply button
        defaultButton.style.color = 'white';
        defaultButton.style.fontFamily = 'Montserrat, sans-serif';
        defaultButton.style.marginLeft = 'auto'; // Align to the right
        defaultButton.style.cursor = 'pointer';
        defaultButton.addEventListener('click', () => {
            saveCustomImageUrlForChat(chatId, '');  // Clear the custom URL
            replaceImagesForChat('');
            popup.remove();
        });

        // Library for recent images
        const libraryContainer = document.createElement('div');
        libraryContainer.style.marginTop = '10px';
        libraryContainer.style.overflowX = 'auto';
        libraryContainer.style.display = 'flex';
        libraryContainer.style.flexWrap = 'wrap'; // Allow wrapping into multiple lines
        const library = getLibrary();

        library.forEach((url) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.width = '49px';
            imgContainer.style.height = '49px';
            imgContainer.style.overflow = 'hidden';
            imgContainer.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = url;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '3px';
            img.style.cursor = 'pointer';
            img.title = url;

            img.addEventListener('click', () => {
                saveCustomImageUrlForChat(chatId, url);
                replaceImagesForChat(url);
                popup.remove();
            });

            // Add remove button for each image
            const removeButton = document.createElement('button');
            removeButton.textContent = '×';
            removeButton.style.position = 'absolute';
            removeButton.style.top = '5px';
            removeButton.style.right = '5px';
            removeButton.style.backgroundColor = 'red';
            removeButton.style.color = 'white';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '50%';
            removeButton.style.cursor = 'pointer';
            removeButton.style.width = '20px';
            removeButton.style.height = '20px';
            removeButton.style.textAlign = 'center';
            removeButton.style.fontSize = '12px';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromLibrary(url); // Remove from library
                imgContainer.remove();   // Remove from popup view
            });

            imgContainer.appendChild(img);
            imgContainer.appendChild(removeButton);
            libraryContainer.appendChild(imgContainer);
        });

        popup.appendChild(label);
        popup.appendChild(input);
        popup.appendChild(applyButton);
        popup.appendChild(libraryContainer);
        popup.appendChild(defaultButton);
        document.body.appendChild(popup);

        // Close the popup when clicking outside of it
        document.addEventListener('click', function closeOnOutsideClick(event) {
            if (!popup.contains(event.target) && event.target !== button) {
                popup.remove();
                document.removeEventListener('click', closeOnOutsideClick);
            }
        });
    });

    // Begin observing and replacing images immediately
    observeNewImages();

    // Periodic cleanup to remove unused images from library
    setInterval(cleanUpLibrary, 60000); // Clean up every minute
})();
