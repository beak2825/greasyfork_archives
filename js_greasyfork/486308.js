// ==UserScript==
// @name         Enlarge Images on HTTP File Server
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enlarge images on the webpage with adjustable size and preview option (retained across refresh)
// @author       chaoscreater
// @match        https://*:8080/files/DCIM/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486308/Enlarge%20Images%20on%20HTTP%20File%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/486308/Enlarge%20Images%20on%20HTTP%20File%20Server.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set default zoom value to 100 if not present in localStorage
    var defaultZoomValue = 100;
    var savedZoomValue = localStorage.getItem('imageSize');
    var initialZoomValue = savedZoomValue !== null ? savedZoomValue : defaultZoomValue;

    // Set default preview value to false if not present in localStorage
    var defaultPreviewValue = false;
    var savedPreviewValue = localStorage.getItem('previewImages');
    var initialPreviewValue = savedPreviewValue !== null ? JSON.parse(savedPreviewValue) : defaultPreviewValue;

    // Create a checkbox for preview images
    var previewCheckbox = document.createElement('input');
    previewCheckbox.type = 'checkbox';
    previewCheckbox.style.position = 'fixed';
    previewCheckbox.style.bottom = '50px'; // Adjusted height
    previewCheckbox.style.left = '10px';
    previewCheckbox.style.zIndex = '9999';
    previewCheckbox.checked = initialPreviewValue;
    previewCheckbox.id = 'previewCheckbox';

    var previewLabel = document.createElement('label');
    previewLabel.setAttribute('for', 'previewCheckbox');
    previewLabel.style.position = 'fixed';
    previewLabel.style.bottom = '50px'; // Adjusted height
    previewLabel.style.left = '30px';
    previewLabel.style.zIndex = '9999';
    previewLabel.textContent = 'Preview';

    // Create a slider element
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 50;
    slider.max = 500;
    slider.value = initialZoomValue;
    slider.style.position = 'fixed';
    slider.style.bottom = '10px';
    slider.style.left = '10px';
    slider.style.zIndex = '9999';

    // Create a text input box for modifying the zoom percentage
    var zoomInputBox = document.createElement('input');
    zoomInputBox.type = 'text';
    zoomInputBox.style.position = 'fixed';
    zoomInputBox.style.bottom = '10px';
    zoomInputBox.style.left = slider.style.left;
    zoomInputBox.style.width = '40px';
    zoomInputBox.style.zIndex = '9999';
    zoomInputBox.value = initialZoomValue;

    // Add an event listener to handle changes in the zoom input box
    zoomInputBox.addEventListener('input', function() {
        var newZoomValue = parseInt(zoomInputBox.value);
        if (!isNaN(newZoomValue) && newZoomValue >= slider.min && newZoomValue <= slider.max) {
            slider.value = newZoomValue;
            updateImageSize(newZoomValue + 'px', previewCheckbox.checked);
            localStorage.setItem('imageSize', newZoomValue); // Store in localStorage
        }
    });

    // Add an event listener to handle slider changes
    slider.addEventListener('input', function() {
        var newSize = slider.value + 'px';
        updateImageSize(newSize, previewCheckbox.checked);
        localStorage.setItem('imageSize', slider.value); // Store in localStorage
        zoomInputBox.value = slider.value; // Update the zoom input box value
        adjustZoomInputBoxPosition(); // Adjust the position dynamically
    });

    // Add an event listener to handle preview checkbox changes
    previewCheckbox.addEventListener('change', function() {
        var isPreviewChecked = previewCheckbox.checked;
        localStorage.setItem('previewImages', isPreviewChecked); // Store in localStorage
        updateImageSize(slider.value + 'px', isPreviewChecked);
    });

    // Append the preview checkbox, label, slider, and zoom input box to the document body
    document.body.appendChild(previewCheckbox);
    document.body.appendChild(previewLabel);
    document.body.appendChild(slider);
    document.body.appendChild(zoomInputBox);

    // Initial image size adjustment
    updateImageSize(slider.value + 'px', initialPreviewValue);
    adjustZoomInputBoxPosition(); // Adjust the position initially

    // Function to update image size based on the slider value
function updateImageSize(size, isPreview) {
    // Get all anchor elements containing images on the webpage
    var imageLinks = document.querySelectorAll('.item-list a[href$=".jpg"], .item-list a[href$=".jpeg"], .item-list a[href$=".png"], .item-list a[href$=".gif"]');

    // Get the current path without the domain
    var currentPath = window.location.pathname;

    // Adjust currentPath to include "/preview/" directly after the domain
    currentPath = currentPath.replace(/\/files/, '/preview');

    // Loop through each image link and set the new size and source
    imageLinks.forEach(function(link) {
        var img = link.querySelector('img');
        if (img) {
            img.style.width = size;
            img.style.height = 'auto';  // Maintain the aspect ratio
            if (isPreview) {
                // If preview is checked, construct the preview URL without the dot
                var href = link.getAttribute('href');
                var previewURL = currentPath + (href.startsWith('/') ? '' : '/') + href;
                console.log('Setting preview source:', previewURL);
                img.src = previewURL;
            } else {
                // If preview is not checked, set the image source to the original URL
                console.log('Setting original source:', link.href);
                img.src = link.href;
            }
        }
    });
}








    // Function to adjust the position of the zoom input box
    function adjustZoomInputBoxPosition() {
        zoomInputBox.style.left = (parseInt(slider.style.left) + slider.offsetWidth + 10) + 'px';
    }
})();
