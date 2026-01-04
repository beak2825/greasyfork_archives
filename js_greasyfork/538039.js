// ==UserScript==
// @name         Agar.io Custom Skin with Border Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows uploading a custom skin and choosing border color in Agar.io
// @author       You
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538039/Agario%20Custom%20Skin%20with%20Border%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/538039/Agario%20Custom%20Skin%20with%20Border%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Create an input for uploading the image
        const uploadButton = document.createElement('input');
        uploadButton.type = 'file';
        uploadButton.accept = 'image/*';
        uploadButton.id = 'uploadImageButton';
        uploadButton.style.position = 'absolute';
        uploadButton.style.top = '10px';
        uploadButton.style.left = '10px';
        uploadButton.style.zIndex = '1000';
        uploadButton.style.padding = '10px';
        document.body.appendChild(uploadButton);

        // Create a select dropdown for choosing the border color
        const colorSelector = document.createElement('select');
        colorSelector.style.position = 'absolute';
        colorSelector.style.top = '50px';
        colorSelector.style.left = '10px';
        colorSelector.style.zIndex = '1000';
        colorSelector.innerHTML = `
            <option value="1">White Border</option>
            <option value="2">Black Border</option>
            <option value="3">Red Border</option>
        `;
        document.body.appendChild(colorSelector);

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
