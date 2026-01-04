// ==UserScript==
// @name         Agar.io Custom Skin Loader for the non modded game
// @version      0.1
// @description  Load custom skins in Agar.io
// @author       New Jack 🕹️
// @homepage     https://youtu.be/2IZlIlnK37c?si=ghQBCHXkmFcDj1ps
// @match        *://*.agar.io/*
// @grant        unsafeWindow
// @license      Mit
// @namespace https://greasyfork.org/users/1049139
// @downloadURL https://update.greasyfork.org/scripts/477195/Agario%20Custom%20Skin%20Loader%20for%20the%20non%20modded%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/477195/Agario%20Custom%20Skin%20Loader%20for%20the%20non%20modded%20game.meta.js
// ==/UserScript==
//  thank you to Bee Chasny Agario
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

    // Try to add the custom skin field as soon as the main panel is available
    const checkInterval = setInterval(() => {
        if (document.querySelector('#mainPanel')) {
            clearInterval(checkInterval);
            addCustomSkinField();
        }
    }, 1000);
})();
