// ==UserScript==
// @name         Only Imgbb Uploader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Heart [3034011]
// @description  Upload screenshots to Imgbb using (imgbb api) and get the direct link in multiple formats with a copy option
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.imgbb.com
// @downloadURL https://update.greasyfork.org/scripts/515316/Only%20Imgbb%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/515316/Only%20Imgbb%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the upload button element
    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'UP'; // Change button text to "UP"
    uploadButton.style.position = 'fixed';
    uploadButton.style.bottom = '10px'; // Position at bottom left
    uploadButton.style.left = '10px';
    uploadButton.style.zIndex = '10000';
    uploadButton.style.padding = '5px';
    uploadButton.style.backgroundColor = '#FF5733'; // Dark mode-friendly color
    uploadButton.style.color = 'white';
    uploadButton.style.border = 'none';
    uploadButton.style.borderRadius = '50%'; // Rounded style
    uploadButton.style.width = '40px'; // Small circular button
    uploadButton.style.height = '40px';
    uploadButton.style.cursor = 'pointer';
    uploadButton.style.fontSize = '12px';
    uploadButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(uploadButton);

    // Create a file input element (hidden)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Container for displaying the links, copy buttons, and close button
    const outputContainer = document.createElement('div');
    outputContainer.style.position = 'fixed';
    outputContainer.style.top = '50px';
    outputContainer.style.left = '5%'; // Fit for mobile screens
    outputContainer.style.width = '90%'; // Fit for mobile screens
    outputContainer.style.zIndex = '10000';
    outputContainer.style.backgroundColor = '#1e1e1e'; // Dark background for better visibility
    outputContainer.style.color = 'white'; // Light text color for contrast
    outputContainer.style.padding = '15px';
    outputContainer.style.borderRadius = '8px';
    outputContainer.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    outputContainer.style.display = 'none';
    outputContainer.style.transition = 'all 0.3s ease-in-out'; // Animation effect
    outputContainer.style.maxHeight = 'calc(100vh - 60px)'; // Ensure it doesn't exceed the screen height
    outputContainer.style.overflowY = 'auto'; // Scroll if content exceeds container height
    document.body.appendChild(outputContainer);

    // Put your Imgbb api Instead of ####
    const apiKey = '####';

    function uploadToImgbb(base64Image) {
        const formData = new FormData();
        formData.append('image', base64Image);

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.imgbb.com/1/upload?key=${apiKey}`,
            data: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.success) {
                    displayLinks(result.data.url);
                } else {
                    alert('Image upload failed: ' + result.error.message);
                }
            },
            onerror: function() {
                alert('An error occurred while uploading the image.');
            }
        });
    }

    // Function to display the links in different formats
    function displayLinks(directLink) {
        outputContainer.innerHTML = ''; // Clear previous content

        // Title for the links section
        const title = document.createElement('h3');
        title.textContent = 'Upload Successful!';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.style.color = '#FFD700';
        outputContainer.appendChild(title);

        // Create normal link element
        const normalLink = document.createElement('div');
        normalLink.textContent = 'Direct Link: ' + directLink; // Display the direct link only
        normalLink.style.marginBottom = '10px';
        normalLink.style.wordBreak = 'break-all'; // Prevent overflow
        outputContainer.appendChild(normalLink);

        // Create HTML link element in the requested format
        const htmlLink = document.createElement('div');
        const htmlLinkContent = `<img src="${directLink}"/>`;
        htmlLink.textContent = 'HTML Link: ' + htmlLinkContent; // Display the HTML link format
        htmlLink.style.marginBottom = '10px';
        htmlLink.style.wordBreak = 'break-all'; // Prevent overflow
        outputContainer.appendChild(htmlLink);

        // Create copy buttons for each format
        createCopyButton(directLink, 'Copy Direct Link');
        createCopyButton(htmlLinkContent, 'Copy HTML Link'); // Copy only the HTML code

        // Create a close button
        createCloseButton();

        // Show the container
        outputContainer.style.display = 'block';
    }

    // Function to create a copy button
    function createCopyButton(textToCopy, buttonText) {
        const copyButton = document.createElement('button');
        copyButton.textContent = buttonText;
        copyButton.style.marginTop = '5px';
        copyButton.style.marginRight = '5px';
        copyButton.style.padding = '8px';
        copyButton.style.fontSize = '12px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.backgroundColor = '#008CBA';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Copied to clipboard!'))
                .catch(() => alert('Failed to copy.'));
        });

        outputContainer.appendChild(copyButton);
    }

    // Function to create a close button
    function createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '8px';
        closeButton.style.fontSize = '12px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#FF0000';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

        closeButton.addEventListener('click', () => {
            outputContainer.style.display = 'none'; // Hide the container when clicked
        });

        outputContainer.appendChild(closeButton);
    }

    // Function to convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Button click event
    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file selection
    });

    // File input change event
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (file) {
            try {
                const base64Image = await fileToBase64(file);
                uploadToImgbb(base64Image); // Upload the converted base64 image
            } catch (error) {
                alert('Failed to read the file: ' + error.message);
            }
        }
    });
})();
