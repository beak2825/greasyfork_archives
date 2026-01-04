// ==UserScript==
// @name         Image Uploader
// @namespace    http://tampermonkey.net/
// @version      3.0
// @author       Heart [3034011]
// @description  Upload screenshots to Imgbb or Imgur and get the direct link in multiple formats with a copy option
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.imgbb.com
// @connect      api.imgur.com
// @downloadURL https://update.greasyfork.org/scripts/512745/Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/512745/Image%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the upload button element
    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'UP';
    uploadButton.style.position = 'fixed';
    uploadButton.style.bottom = '10px';
    uploadButton.style.left = '10px';
    uploadButton.style.zIndex = '10000';
    uploadButton.style.padding = '5px';
    uploadButton.style.backgroundColor = '#FF5733';
    uploadButton.style.color = 'white';
    uploadButton.style.border = 'none';
    uploadButton.style.borderRadius = '50%';
    uploadButton.style.width = '35px';
    uploadButton.style.height = '35px';
    uploadButton.style.cursor = 'pointer';
    uploadButton.style.fontSize = '12px';
    uploadButton.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.15)';
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
    outputContainer.style.top = '50%';
    outputContainer.style.left = '50%';
    outputContainer.style.transform = 'translate(-50%, -50%)';
    outputContainer.style.width = '90%';
    outputContainer.style.maxWidth = '400px';
    outputContainer.style.zIndex = '10000';
    outputContainer.style.backgroundColor = '#2c2c2c';
    outputContainer.style.color = '#f1f1f1';
    outputContainer.style.padding = '20px';
    outputContainer.style.borderRadius = '12px';
    outputContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    outputContainer.style.display = 'none';
    outputContainer.style.transition = 'all 0.3s ease-in-out';
    outputContainer.style.maxHeight = '80vh';
    outputContainer.style.overflowY = 'auto';
    document.body.appendChild(outputContainer);

    // Imgbb API Key
    const imgbbApiKey = 'YOUR_IMGBB_API';
    // Imgur Client ID
    const imgurClientId = 'YOUR_IMGUR_ID';

    function uploadToImgbb(base64Image) {
        const formData = new FormData();
        formData.append('image', base64Image);

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
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

    function uploadToImgur(base64Image) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.imgur.com/3/image',
            headers: {
                'Authorization': 'Client-ID ' + imgurClientId,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ image: base64Image }),
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.success) {
                    displayLinks(result.data.link);
                } else {
                    alert('Image upload failed: ' + result.data.error);
                }
            },
            onerror: function() {
                alert('An error occurred while uploading the image.');
            }
        });
    }

    // Function to display the links in different formats
    function displayLinks(directLink) {
        outputContainer.innerHTML = '';

        const title = document.createElement('h3');
        title.textContent = 'Upload Successful!';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        title.style.color = '#FFD700';
        outputContainer.appendChild(title);

        const normalLink = document.createElement('div');
        normalLink.textContent = 'Direct Link: ' + directLink;
        normalLink.style.marginBottom = '10px';
        normalLink.style.wordBreak = 'break-all';
        outputContainer.appendChild(normalLink);

        const htmlLink = document.createElement('div');
        const htmlLinkContent = `<img src="${directLink}"/>`;
        htmlLink.textContent = 'HTML Link: ' + htmlLinkContent;
        htmlLink.style.marginBottom = '10px';
        htmlLink.style.wordBreak = 'break-all';
        outputContainer.appendChild(htmlLink);

        createCopyButton(directLink, 'Copy Direct Link');
        createCopyButton(htmlLinkContent, 'Copy HTML Link');

        createCloseButton();
        outputContainer.style.display = 'block';
    }

    // Function to create a copy button with a tooltip confirmation
    function createCopyButton(textToCopy, buttonText) {
        const copyButton = document.createElement('button');
        copyButton.textContent = buttonText;
        copyButton.style.marginTop = '8px';
        copyButton.style.marginRight = '8px';
        copyButton.style.padding = '10px';
        copyButton.style.fontSize = '12px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.backgroundColor = '#008CBA';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';

        const tooltip = document.createElement('span');
        tooltip.textContent = 'Copied!';
        tooltip.style.visibility = 'hidden';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '4px 6px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '10px';
        tooltip.style.marginTop = '-30px';
        tooltip.style.marginLeft = '5px';
        tooltip.style.transition = 'visibility 0s, opacity 0.3s linear';
        tooltip.style.opacity = '0';

        copyButton.style.position = 'relative';
        copyButton.appendChild(tooltip);

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    setTimeout(() => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 1000);
                })
                .catch(() => alert('Failed to copy.'));
        });

        outputContainer.appendChild(copyButton);
    }

    // Function to create a close button
    function createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '10px';
        closeButton.style.fontSize = '12px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#FF0000';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';

        closeButton.addEventListener('click', () => {
            outputContainer.style.display = 'none';
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

    function showServiceSelection(base64Image) {
        outputContainer.innerHTML = '';
        const title = document.createElement('h3');
        title.textContent = 'Choose Upload Service';
        title.style.marginBottom = '15px';
        title.style.textAlign = 'center';
        title.style.color = '#FFD700';
        outputContainer.appendChild(title);

        const createServiceButton = (text, color, callback) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.marginTop = '10px';
            button.style.padding = '10px';
            button.style.fontSize = '14px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = color;
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
            button.onclick = callback;
            outputContainer.appendChild(button);
        };

        createServiceButton('Upload to Imgbb', '#008CBA', () => uploadToImgbb(base64Image));
        createServiceButton('Upload to Imgur', '#FF5733', () => uploadToImgur(base64Image));

        createCloseButton();
        outputContainer.style.display = 'block';
    }

    uploadButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (file) {
            const base64Image = await fileToBase64(file);
            showServiceSelection(base64Image);
        }
    });
})();