// ==UserScript==
// @name         Agar.io Custom Skin Loader for the non modded game
// @version      0.4
// @description  Load custom skins in Agar.io with border options
// @author       New Jack 🕹️
// @homepage     https://youtu.be/2IZlIlnK37c?si=ghQBCHXkmFcDj1ps
// @match        *://*.agar.io/*
// @grant        unsafeWindow
// @license      Mit
// @namespace https://greasyfork.org/users/1049139
// @downloadURL https://update.greasyfork.org/scripts/537885/Agario%20Custom%20Skin%20Loader%20for%20the%20non%20modded%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/537885/Agario%20Custom%20Skin%20Loader%20for%20the%20non%20modded%20game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomSkinField() {
        const mainPanel = document.querySelector('#mainPanel');
        if (mainPanel) {
            // Create a container for the input and button
            const container = document.createElement('div');
            container.style.marginBottom = '10px';

            // Create the input field for the URL
            const urlInput = document.createElement('input');
            urlInput.placeholder = 'Enter skin URL...';
            urlInput.style.marginRight = '5px';

            // Create the button
            const loadButton = document.createElement('button');
            loadButton.style.backgroundColor = "#54c800"; // Set button color to #54c800
            loadButton.style.color = "#FFFFFF"; // Set text color to white
            loadButton.style.border = "none"; // Remove any default borders
            loadButton.style.padding = "5px 10px"; // Add some padding for better appearance
            loadButton.style.cursor = "pointer"; // Change cursor to pointer on hover for better UX
            loadButton.innerText = 'Turn Skin on';

            // Add hover effect for the button
            loadButton.onmouseover = function() {
                this.style.backgroundColor = "#347f01"; // Change color on hover
            };
            loadButton.onmouseout = function() {
                this.style.backgroundColor = "#54c800"; // Reset color when hover is removed
            };

            loadButton.addEventListener('click', () => {
                const skinURL = urlInput.value;
                console.log(`Setting skin to ${skinURL}`);
                try {
                    unsafeWindow.core.registerSkin(null, "%SubscribeToBeeChasnyAgario", skinURL, 2, null);
                    unsafeWindow.core.loadSkin("%SubscribeToBeeChasnyAgario");

                    // Create skin container and add border functionality
                    let skinContainer = document.createElement('div');
                    skinContainer.style.position = 'absolute';
                    skinContainer.style.top = '50%';
                    skinContainer.style.left = '50%';
                    skinContainer.style.transform = 'translate(-50%, -50%)';
                    skinContainer.style.width = '100px';
                    skinContainer.style.height = '100px';
                    skinContainer.style.borderRadius = '50%';
                    skinContainer.style.border = '5px solid transparent'; // Default border color is transparent
                    skinContainer.style.backgroundImage = `url(${skinURL})`;
                    skinContainer.style.backgroundSize = 'cover';
                    skinContainer.style.backgroundPosition = 'center';
                    document.body.appendChild(skinContainer);

                    // Create the border color selector
                    createBorderColorSelector(skinContainer);

                } catch (e) {
                    console.error("Error loading the skin:", e);
                }
            });

            // Append the input and button to the container
            container.appendChild(urlInput);
            container.appendChild(loadButton);

            // Insert the container at the top of the main panel
            mainPanel.insertBefore(container, mainPanel.firstChild);
        } else {
            console.warn('Main panel not found. Cannot insert skin loader.');
        }
    }

    // Function to create the border color selector
    function createBorderColorSelector(skinContainer) {
        let selector = document.createElement('select');
        selector.style.position = 'absolute';
        selector.style.top = '10px';
        selector.style.right = '10px';
        selector.style.zIndex = '1000';
        let option1 = document.createElement('option');
        option1.value = 'white';
        option1.textContent = 'Borde Blanco';
        let option2 = document.createElement('option');
        option2.value = 'black';
        option2.textContent = 'Borde Negro';
        selector.appendChild(option1);
        selector.appendChild(option2);
        document.body.appendChild(selector);

        selector.addEventListener('change', function(event) {
            let color = event.target.value;
            applyBorderColor(skinContainer, color);
        });
    }

    // Function to apply the border color to the skin
    function applyBorderColor(skinContainer, color) {
        skinContainer.style.borderColor = color;
    }

    // Try to add the custom skin field as soon as the main panel is available
    const checkInterval = setInterval(() => {
        if (document.querySelector('#mainPanel')) {
            clearInterval(checkInterval);
            addCustomSkinField();
        }
    }, 1000);
})();
