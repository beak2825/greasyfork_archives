// ==UserScript==
// @name         Agar.io Custom Skin with Border Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Upload a custom skin and set the border color in Agar.io
// @author       You
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538025/Agario%20Custom%20Skin%20with%20Border%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/538025/Agario%20Custom%20Skin%20with%20Border%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for Agar.io's script to load
    window.addEventListener('load', function() {
        let buttonContainer = document.querySelector('.game-container'); // Find the main game container
        if (buttonContainer) {
            // Create a custom "Upload Image" button
            let uploadButton = document.createElement('button');
            uploadButton.innerText = 'Subir Imagen';
            uploadButton.style.position = 'absolute';
            uploadButton.style.top = '10px';
            uploadButton.style.right = '10px';
            uploadButton.style.padding = '10px';
            uploadButton.style.backgroundColor = '#4CAF50';
            uploadButton.style.color = 'white';
            uploadButton.style.border = 'none';
            uploadButton.style.cursor = 'pointer';
            uploadButton.style.zIndex = '9999';

            // Create the color selector
            let colorSelector = document.createElement('select');
            colorSelector.innerHTML = `
                <option value="black">Negro</option>
                <option value="white">Blanco</option>
                <option value="red">Rojo</option>
                <option value="yellow">Amarillo</option>
                <option value="blue">Azul</option>
                <option value="green">Verde</option>
            `;
            colorSelector.style.position = 'absolute';
            colorSelector.style.top = '50px';
            colorSelector.style.right = '10px';
            colorSelector.style.padding = '5px';
            colorSelector.style.zIndex = '9999';

            // Append the button and the color selector to the page
            buttonContainer.appendChild(uploadButton);
            buttonContainer.appendChild(colorSelector);

            // Handle the image upload
            uploadButton.addEventListener('click', function() {
                let input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.click();
                
                input.addEventListener('change', function(event) {
                    let file = event.target.files[0];
                    if (file) {
                        let reader = new FileReader();
                        reader.onload = function(e) {
                            let img = new Image();
                            img.src = e.target.result;
                            img.onload = function() {
                                // Apply custom skin to the player in the game
                                window.game.skin = img;
                                alert('¡Imagen subida con éxito!');
                            };
                        };
                        reader.readAsDataURL(file);
                    }
                });
            });

            // Update the border color based on the selected option
            colorSelector.addEventListener('change', function() {
                let selectedColor = colorSelector.value;

                // Update the border color on the player's skin
                window.game.setPlayerBorderColor(selectedColor); // This may depend on the game's specific functions
                alert(`Borde de la skin cambiado a: ${selectedColor}`);
            });
        }
    });
})();
