// ==UserScript==
// @name         Agar.io Custom Skin with Border Color (Fixed Layout)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows uploading a custom skin and choosing border color in Agar.io with improved layout
// @author       You
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538041/Agario%20Custom%20Skin%20with%20Border%20Color%20%28Fixed%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538041/Agario%20Custom%20Skin%20with%20Border%20Color%20%28Fixed%20Layout%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Create a container for the upload button and color selector
        const controlContainer = document.createElement('div');
        controlContainer.style.position = 'absolute';
        controlContainer.style.top = '10px';
        controlContainer.style.left = '10px';
        controlContainer.style.zIndex = '1000';
        controlContainer.style.display = 'flex';
        controlContainer.style.alignItems = 'center';
        document.body.appendChild(controlContainer);

        // Create an input for uploading the image
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.accept = 'image/*';
        uploadButton.id = 'uploadImageButton';
        uploadButton.style.marginRight = '10px';
        controlContainer.appendChild(uploadButton);

        // Create a select dropdown for choosing the border color
        const colorSelector = document.createElement('select');
        colorSelector.style.marginRight = '10px';
        colorSelector.innerHTML = `
            <option value="1">White Border</option>
            <option value="2">Black Border</option>
            <option value="3">Red Border</option>
        `;
        controlContainer.appendChild(colorSelector);

        // Function to handle the image upload and convert it to dataURL
        uploadButton.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageDataURL = event.target.result;

                    // Set the skin with the uploaded image
                    const skin = document.getElementById('skin');
                    if (skin) {
                        skin.src = imageDataURL;
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        // Function to handle applying the border color in the game
        colorSelector.addEventListener('change', function(e) {
            const selectedColor = e.target.value;
            let borderColor = '';

            // Map the selected color to the corresponding color code
            switch (selectedColor) {
                case '1':
                    borderColor = 'white';
                    break;
                case '2':
                    borderColor = 'black';
                    break;
                case '3':
                    borderColor = 'red';
                    break;
                default:
                    borderColor = 'white';
            }

            // Apply the border color to the skin (this is handled by Agar.io in the game)
            if (window.player) {
                window.player.setSkinBorderColor(borderColor);
            }
        });
    });
})();
