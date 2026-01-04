// ==UserScript==
// @name         Gimkit Custom Cosmetic Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a custom cosmetic overlay to Gimkit on the home page and in-game
// @author       YourName
// @match        *://www.gimkit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515233/Gimkit%20Custom%20Cosmetic%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/515233/Gimkit%20Custom%20Cosmetic%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cosmetic data stored locally
    let userCosmetic = JSON.parse(localStorage.getItem("gimkitCustomCosmetic")) || {
        color: "#3498db",
        accessory: "🎩"
    };

    // Create a simple UI for selecting color and accessory on the home page and in-game
    function createCosmeticUI() {
        const uiContainer = document.createElement("div");
        uiContainer.style.position = "fixed";
        uiContainer.style.top = "20px";
        uiContainer.style.right = "20px";
        uiContainer.style.padding = "10px";
        uiContainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        uiContainer.style.borderRadius = "8px";
        uiContainer.style.zIndex = "1000";
        uiContainer.style.fontSize = "14px";
        uiContainer.style.fontFamily = "Arial, sans-serif";
        uiContainer.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)";
        
        // Title
        const title = document.createElement("h4");
        title.innerText = "Custom Cosmetic";
        title.style.marginBottom = "10px";
        uiContainer.appendChild(title);

        // Color picker
        const colorLabel = document.createElement("label");
        colorLabel.innerText = "Select Color:";
        colorLabel.style.display = "block";
        uiContainer.appendChild(colorLabel);

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = userCosmetic.color;
        colorInput.style.marginBottom = "10px";
        uiContainer.appendChild(colorInput);

        // Accessory picker
        const accessoryLabel = document.createElement("label");
        accessoryLabel.innerText = "Select Accessory:";
        accessoryLabel.style.display = "block";
        uiContainer.appendChild(accessoryLabel);

        const accessoryInput = document.createElement("input");
        accessoryInput.type = "text";
        accessoryInput.value = userCosmetic.accessory;
        accessoryInput.style.marginBottom = "10px";
        accessoryInput.placeholder = "Enter emoji, e.g., 🎩";
        uiContainer.appendChild(accessoryInput);

        // Save button
        const saveButton = document.createElement("button");
        saveButton.innerText = "Save Cosmetic";
        saveButton.style.display = "block";
        saveButton.style.marginTop = "10px";
        saveButton.onclick = () => {
            userCosmetic = {
                color: colorInput.value,
                accessory: accessoryInput.value
            };
            localStorage.setItem("gimkitCustomCosmetic", JSON.stringify(userCosmetic));
            applyCosmeticOverlay();
        };
        uiContainer.appendChild(saveButton);

        document.body.appendChild(uiContainer);
    }

    // Apply cosmetic overlay in-game or on the home page
    function applyCosmeticOverlay() {
        const interval = setInterval(() => {
            const playerElements = document.querySelectorAll("[class*=playerName]"); // Modify to match actual Gimkit class names if needed
            if (playerElements.length > 0) {
                clearInterval(interval);
                playerElements.forEach(playerElement => {
                    playerElement.style.color = userCosmetic.color;
                    playerElement.innerHTML = `${userCosmetic.accessory} ${playerElement.innerHTML}`;
                });
            }
        }, 1000); // Check every second for player elements
    }

    // Run on specific pages
    if (window.location.pathname.includes("home") || window.location.pathname.includes("game")) {
        createCosmeticUI();
        applyCosmeticOverlay();
    }
})();
