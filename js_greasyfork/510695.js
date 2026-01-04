// ==UserScript==
// @name         Shell Shockers Crosshair + GUI
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Create a Crosshair at the center of the screen with customizable size, color, and real-time preview within the GUI. Keybinding to hide/show the GUI, and watermark notifications.
// @author       97-
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://shellshockers.today/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://new.shellshock.io/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://shellshock.io/*
// @match        https://scrambled.world/*
// @match        https://shellshockers.today/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510695/Shell%20Shockers%20Crosshair%20%2B%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/510695/Shell%20Shockers%20Crosshair%20%2B%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the Crosshair element
    let Crosshair = document.createElement('div');
    Crosshair.style.position = 'fixed';
    Crosshair.style.top = '50%';
    Crosshair.style.left = '50%';
    Crosshair.style.width = '20px'; // Default size
    Crosshair.style.height = '20px'; // Default size
    Crosshair.style.backgroundColor = '#ff0000'; // Default color
    Crosshair.style.borderRadius = '50%';
    Crosshair.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(Crosshair);

    // Variables to store the current customization settings
    let currentSize = '20';
    let currentColor = '#ff0000';

    // Create the GUI
    let gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.padding = '20px';
    gui.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // 30% transparent background
    gui.style.color = '#fff';
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.style.zIndex = '9999';
    gui.style.borderRadius = '10px';
    gui.style.border = '2px solid #fff'; // Border around the GUI
    gui.style.display = 'block'; // Initially visible
    document.body.appendChild(gui);

    // Create watermark notification
    let watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.bottom = '-50px';
    watermark.style.left = '10px';
    watermark.style.padding = '10px';
    watermark.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    watermark.style.color = '#fff';
    watermark.style.fontFamily = 'Arial, sans-serif';
    watermark.style.borderRadius = '10px';
    watermark.style.transition = 'bottom 0.5s';
    watermark.style.zIndex = '9999';
    document.body.appendChild(watermark);

    // Function to show watermark
    function showWatermark(message) {
        watermark.textContent = message;
        watermark.style.bottom = '10px';
        setTimeout(() => {
            watermark.style.bottom = '-50px';
        }, 2000);
    }

    // Create size slider
    let sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Crosshair Size:';
    let sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '5';
    sizeSlider.max = '100';
    sizeSlider.value = currentSize; // Default value
    sizeSlider.style.width = '100%';
    sizeSlider.addEventListener('input', function() {
        previewCrosshair.style.width = sizeSlider.value + 'px';
        previewCrosshair.style.height = sizeSlider.value + 'px';
    });

    // Create RGB color input
    let colorLabel = document.createElement('label');
    colorLabel.textContent = 'Crosshair Color:';
    let colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = currentColor; // Default color
    colorInput.addEventListener('input', function() {
        previewCrosshair.style.backgroundColor = colorInput.value;
    });

    // Create Crosshair On/Off Checkbox
    let CrosshairCheckboxLabel = document.createElement('label');
    CrosshairCheckboxLabel.textContent = 'Crosshair On/Off:';
    let CrosshairCheckbox = document.createElement('input');
    CrosshairCheckbox.type = 'checkbox';
    CrosshairCheckbox.checked = true; // Default is "On"
    CrosshairCheckbox.addEventListener('change', function() {
        if (CrosshairCheckbox.checked) {
            Crosshair.style.display = 'block';
            showWatermark('Crosshair ON');
        } else {
            Crosshair.style.display = 'none';
            showWatermark('Crosshair OFF');
        }
    });

    // Create the Submit button
    let submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.marginTop = '10px';
    submitButton.addEventListener('click', function() {
        // Apply the preview values to the actual Crosshair
        currentSize = sizeSlider.value;
        currentColor = colorInput.value;
        Crosshair.style.width = currentSize + 'px';
        Crosshair.style.height = currentSize + 'px';
        Crosshair.style.backgroundColor = currentColor;
        showWatermark('Crosshair Updated');
    });

    // Create a container for the preview Crosshair
    let previewContainer = document.createElement('div');
    previewContainer.style.border = '2px solid #fff'; // Border for the preview container
    previewContainer.style.padding = '10px'; // Padding inside the border
    previewContainer.style.margin = '10px 0'; // Space above and below the preview
    previewContainer.style.textAlign = 'center'; // Center align the contents

    // Create the preview Crosshair within the container
    let previewCrosshair = document.createElement('div');
    previewCrosshair.style.width = currentSize + 'px';
    previewCrosshair.style.height = currentSize + 'px';
    previewCrosshair.style.backgroundColor = currentColor;
    previewCrosshair.style.borderRadius = '50%';
    previewContainer.appendChild(previewCrosshair);

    // Append elements to GUI
    gui.appendChild(sizeLabel);
    gui.appendChild(sizeSlider);
    gui.appendChild(document.createElement('br'));
    gui.appendChild(colorLabel);
    gui.appendChild(colorInput);
    gui.appendChild(document.createElement('br'));
    gui.appendChild(CrosshairCheckboxLabel);
    gui.appendChild(CrosshairCheckbox);
    gui.appendChild(document.createElement('br'));
    gui.appendChild(previewContainer);
    gui.appendChild(submitButton);

    // Toggle GUI visibility on 'H' key press, but not when typing in input or textarea
    document.addEventListener('keydown', function(e) {
        if (e.key === 'h' || e.key === 'H') {
            let activeElement = document.activeElement;
            // Only toggle GUI if not typing in input or textarea fields
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                if (gui.style.display === 'none') {
                    gui.style.display = 'block';
                    showWatermark('GUI ON');
                } else {
                    gui.style.display = 'none';
                    showWatermark('GUI OFF');
                }
            }
        }
    });
})();
