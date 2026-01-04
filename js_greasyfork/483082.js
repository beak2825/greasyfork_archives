// ==UserScript==
// @name          Manga Enhancer
// @namespace     Moose
// @version       3.0
// @description   Enhances your manga reading experience with a set of features:
//                  1. Navigate between chapters using arrow keys. Also works by 1+ -1 on chapters URL to find new chapters
//                  2. Close tabs with a button press. Default "/" can be changed on line #101
//                  3. Remove gaps between pages.
//                  4. Auto-reload on image loading errors. Also tells the user that some images are missing. As an added note of this function, it continues to show till all images are loaded and then removes itself
//                  5. Image size as a percentage of screen width, also save preferences. Found at the top right of the screen
//
// If the script doesn't work on the site, add the site URL as shown below.
// @match         https://manganelo.com/*
// @match         https://mangakakalot.com/*
// @match         https://readmanganato.com/*
// @match         https://manganato.com/*
// @match         https://chapmanganato.com/*
// @match         https://chapmanganato.to/*
//
// @icon        https://manganato.com/favicon-96x96.png
// @author        Moose, ChatGPT
// @description   12/26/2023
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483082/Manga%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/483082/Manga%20Enhancer.meta.js
// ==/UserScript==

// Function to create a div for displaying error messages
function createErrorDisplayDiv() {
    const errorDisplayDiv = document.createElement('div');
    errorDisplayDiv.style.position = 'fixed';
    errorDisplayDiv.style.top = '50%';
    errorDisplayDiv.style.left = '10px';
    errorDisplayDiv.style.padding = '10px';
    errorDisplayDiv.style.background = 'white';
    errorDisplayDiv.style.border = '2px solid black';
    errorDisplayDiv.style.borderRadius = '5px';
    errorDisplayDiv.style.display = 'none'; // Initially hidden

    // Create close button (X)
    const closeButton = document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        errorDisplayDiv.style.display = 'none';
    });

    // Append close button to the error display div
    errorDisplayDiv.appendChild(closeButton);

    document.body.appendChild(errorDisplayDiv);
    return errorDisplayDiv;
}

// Function to display an error prompt with the number of images with loading errors
function displayErrorPrompt() {
    let reloadPromptShown = false;

    const updateMessage = () => {
        const errorImages = document.querySelectorAll('img:not(.loaded)');
        const totalImages = errorImages.length;

        if (totalImages > 0) {
            // If there are images with loading errors, update the error message
            const newMessage = `Error loading ${totalImages} image(s). Do you want to reload the page?`;
            errorDisplayDiv.textContent = newMessage;
            errorDisplayDiv.style.display = 'block';
        } else {
            // If no error is found, hide the error message
            closeErrorMessage();
            clearInterval(updateInterval);
        }
    };

    // Check image load status periodically and update the message
    const updateInterval = setInterval(updateMessage, checkInterval);
}

// Main script block
(function () {
    'use strict';

    // Create a div for displaying error messages globally
    const errorDisplayDiv = createErrorDisplayDiv();

    // Counter for image loading attempts
    let attempts = 0;
    const maxAttempts = 3; // Adjust the maximum number of attempts as needed
    const checkInterval = 5000; // Adjust the interval as needed

    // Function to close the error message
    function closeErrorMessage() {
        errorDisplayDiv.style.display = 'none';
    }

// Function to update the error message box based on the number of images with loading errors
function updateMessage() {
    attempts++;

    const allImages = document.querySelectorAll('img');
    const errorImages = Array.from(allImages).filter(img => !img.classList.contains('loaded') && (!img.complete || img.naturalWidth === 0));
    const totalImages = errorImages.length;

    if (totalImages > 0) {
        // If there are images with loading errors, update the error message
        const newMessage = `Error loading ${totalImages} image(s). Do you want to reload the page?`;
        errorDisplayDiv.textContent = newMessage;
        errorDisplayDiv.style.display = 'block';
    } else {
        // If no error is found, hide the error message
        closeErrorMessage();
        clearInterval(updateInterval);
    }
}

    // Check image load status periodically and update the message
    const updateInterval = setInterval(updateMessage, checkInterval);

    // Function to check if all images are loaded
    function checkAllImagesLoaded() {
        const allImages = document.querySelectorAll('img');
        const unloadedImages = Array.from(allImages).filter(img => !img.classList.contains('loaded'));

        if (unloadedImages.length === 0) {
            // If all images are loaded, hide the error message
            closeErrorMessage();
            clearInterval(updateInterval);
        }
    }

    // Check if all images are loaded periodically
    const checkAllImagesInterval = setInterval(checkAllImagesLoaded, 1000); // Check every second

    // Check if the current URL contains "chapter-"
    const isChapterUrl = window.location.href.includes('chapter-');

    // If the current URL contains "chapter-", enhance the reading experience
    if (isChapterUrl) {
        // Add event listener for arrow key presses
        window.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const isLeftArrow = event.key === 'ArrowLeft';

                const currentUrl = window.location.href;
                const match = currentUrl.match(/:\/\/([^/]+)\/([^/]+)\/chapter-(\d+)/);

                if (match) {
                    const domain = match[1];
                    const path = match[2];
                    const currentChapter = parseInt(match[3], 10);

                    // Increment or decrement the current chapter based on the arrow key
                    const newChapter = isLeftArrow ? currentChapter - 1 : currentChapter + 1;

                    // Ensure the new chapter is non-negative
                    if (newChapter >= 0) {
                        const newUrl = currentUrl.replace(`://${domain}/${path}/chapter-${currentChapter}`, `://${domain}/${path}/chapter-${newChapter}`);
                        window.location.href = newUrl;
                    }
                }
                event.preventDefault(); // Prevent the default behavior of arrow keys (e.g., scrolling)
            }
        });

        // Add event listener for the forward slash key press
        window.addEventListener('keydown', function (event) {
            // Forward slash key press
            if (event.key === '/' && event.code === 'Slash') {
                // Close the current tab
                window.close();
            }
        });

        // Remove space between pages
        const targetDivs = document.querySelectorAll('div[style*="max-width: 620px; max-height: 310px; margin: 10px auto; overflow: hidden; display: block;"]');
        targetDivs.forEach(targetDiv => {
            // Change the margin property to "0" instead of "10px auto"
            targetDiv.style.margin = '0';
        });

        // Size Changer Section
        let isResizeEnabled = localStorage.getItem('isResizeEnabled') === 'true';

        // Function to set and save the image size as a percentage of screen width
        function setImageSize(percentage) {
            // Check if the current URL contains "chapter-#"
            if (window.location.href.includes('chapter-')) {
                // Set the image size for all images in your application logic
                const images = document.querySelectorAll('img');
                images.forEach(image => {
                    image.style.width = isResizeEnabled ? percentage + '%' : ''; // Always set the size, even if resizing is enabled
                });

                // Save the user's preference in local storage
                localStorage.setItem('userImageSizePercentage', percentage);
            }
        }

        // Function to get the saved image size percentage
        function getSavedImageSizePercentage() {
            // Retrieve the user's saved preference from local storage
            const savedPercentage = localStorage.getItem('userImageSizePercentage');

            // Return the saved percentage or a default value if not found
            return savedPercentage ? parseFloat(savedPercentage) : 50; // Default percentage: 50%
        }

        // Function to toggle image resizing
        function toggleResize() {
            isResizeEnabled = !isResizeEnabled;
            const buttonText = isResizeEnabled ? 'Toggle Resize Enabled' : 'Toggle Resize Disabled';

            // Change the text on the "Toggle Resize" button
            toggleResizeButton.textContent = buttonText;

            // Save the current state of "Toggle Resize" in local storage
            localStorage.setItem('isResizeEnabled', isResizeEnabled);

            // Adjust the image size based on the current state of "Toggle Resize"
            setImageSize(getSavedImageSizePercentage());
        }

        // Function to handle button click and prompt the user for a new size percentage
        function handleButtonClick() {
            // Ask the user for a new image size percentage
            const newPercentage = prompt('Enter the new image size as a percentage of screen width:', getSavedImageSizePercentage());

            // Validate and set the new size percentage
            if (newPercentage !== null) {
                const validatedPercentage = parseFloat(newPercentage);
                if (!isNaN(validatedPercentage) && validatedPercentage > 0 && validatedPercentage <= 100) {
                    setImageSize(validatedPercentage);
                } else {
                    alert('Invalid input. Please enter a percentage between 1 and 100.');
                }
            }
        }

        // Function to create a div for displaying error messages
        function createErrorDisplayDiv() {
            const errorDisplayDiv = document.createElement('div');
            errorDisplayDiv.style.position = 'fixed';
            errorDisplayDiv.style.top = '50%';
            errorDisplayDiv.style.left = '10px';
            errorDisplayDiv.style.padding = '10px';
            errorDisplayDiv.style.background = 'white';
            errorDisplayDiv.style.border = '2px solid black';
            errorDisplayDiv.style.borderRadius = '5px';
            errorDisplayDiv.style.display = 'none'; // Initially hidden

            // Create close button (X)
            const closeButton = document.createElement('span');
            closeButton.textContent = 'X';
            closeButton.style.float = 'right';
            closeButton.style.cursor = 'pointer';
            closeButton.addEventListener('click', () => {
                errorDisplayDiv.style.display = 'none';
            });

            // Append close button to the error display div
            errorDisplayDiv.appendChild(closeButton);

            document.body.appendChild(errorDisplayDiv);
            return errorDisplayDiv;
        }

        // Create a button to trigger image size adjustment
        const resizeButton = document.createElement('button');
        resizeButton.textContent = 'Adjust Image Size';
        resizeButton.style.position = 'absolute';
        resizeButton.style.top = '10px';
        resizeButton.style.right = '10px';
        resizeButton.addEventListener('click', function () {
            handleButtonClick();
            setImageSize(getSavedImageSizePercentage()); // Adjust image size when resizing is toggled
        });

        // Append the button to the body
        document.body.appendChild(resizeButton);

        // Create a button to toggle image resizing
        const toggleResizeButton = document.createElement('button');
        toggleResizeButton.textContent = isResizeEnabled ? 'Toggle Resize Enabled' : 'Toggle Resize Disabled';
        toggleResizeButton.style.position = 'absolute';
        toggleResizeButton.style.top = '50px';
        toggleResizeButton.style.right = '10px';
        toggleResizeButton.addEventListener('click', toggleResize);

        // Append the button to the body
        document.body.appendChild(toggleResizeButton);

        // Initialize the image size percentage and "Toggle Resize" state on script load
        isResizeEnabled = localStorage.getItem('isResizeEnabled') === 'true';
        const buttonText = isResizeEnabled ? 'Toggle Resize Enabled' : 'Toggle Resize Disabled';
        toggleResizeButton.textContent = buttonText;
        setImageSize(getSavedImageSizePercentage());
    }
})();
