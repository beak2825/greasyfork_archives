// ==UserScript==
// @name         Deadshot.io Ventionware V2.6
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Adds a customizable crosshair to deadshot.io with a stylish menu for color, opacity, and shape customization. Includes custom crosshair upload and size adjustment.
// @author       TheModDownloader
// @icon         https://deadshot.io/favicon.png
// @license      GNU GPLv3
// @match        *://deadshot.io/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524040/Deadshotio%20Ventionware%20V26.user.js
// @updateURL https://update.greasyfork.org/scripts/524040/Deadshotio%20Ventionware%20V26.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Current script version
    const currentVersion = '2.6';

    // URL to check for the latest version
    const versionCheckURL = 'https://file.garden/ZgfK0UDRARPwyXVE/versionVentionWare.txt';

    // URL to redirect users if the script is outdated
    const updateURL = 'https://greasyfork.org/en/scripts/524040-deadshot-io-ventionware-v2-6'; // Replace with your actual URL

    // Create a container for all custom elements
    const customContainer = document.createElement('div');
    customContainer.style.position = 'fixed';
    customContainer.style.top = '0';
    customContainer.style.left = '0';
    customContainer.style.width = '100%';
    customContainer.style.height = '100%';
    customContainer.style.pointerEvents = 'none'; // Allow clicks to pass through
    customContainer.style.zIndex = '2147483647'; // Maximum z-index value
    document.body.appendChild(customContainer);

    // Create the crosshair element
    const crosshair = document.createElement('div');
    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.width = '20px';
    crosshair.style.height = '20px';
    crosshair.style.border = '2px solid red';
    crosshair.style.borderRadius = '50%';
    crosshair.style.pointerEvents = 'none';
    customContainer.appendChild(crosshair);

    // Create a container for the buttons and title
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '-200px'; // Start off-screen to the right
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-end';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.zIndex = '100000';
    buttonContainer.style.transition = 'right 0.5s ease-in-out'; // Slide-in transition
    customContainer.appendChild(buttonContainer);

    // Add the title with glow effect
    const title = document.createElement('div');
    title.textContent = 'VentionWare V2 Version 2.1';
    title.style.color = 'white';
    title.style.fontFamily = 'Arial, sans-serif';
    title.style.fontSize = '14px';
    title.style.fontWeight = 'bold';
    title.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    title.style.padding = '8px 12px';
    title.style.borderRadius = '5px';
    title.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    title.style.textShadow = '0 0 10px #00ff00, 0 0 20px #00ff00'; // Glow effect
    buttonContainer.appendChild(title);

    // Function to create a button with hover label
    function createButton(icon, color, labelText) {
        const button = document.createElement('button');
        button.innerHTML = icon;
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '50%';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.fontSize = '24px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        button.style.transition = 'background-color 0.3s, transform 0.3s';
        button.style.pointerEvents = 'auto'; // Allow clicks on the button

        // Create hover label
        const label = document.createElement('div');
        label.textContent = labelText;
        label.style.position = 'absolute';
        label.style.right = '60px'; // Position to the left of the button
        label.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        label.style.color = 'white';
        label.style.padding = '5px 10px';
        label.style.borderRadius = '5px';
        label.style.fontSize = '12px';
        label.style.opacity = '0';
        label.style.transition = 'opacity 0.3s';
        label.style.pointerEvents = 'none'; // Prevent clicks on the label

        // Add hover effects
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            label.style.opacity = '1';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            label.style.opacity = '0';
        });

        // Wrap button and label in a container
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.appendChild(button);
        container.appendChild(label);

        return { button, container };
    }

    // Create the menu button
    const { button: menuButton, container: menuButtonContainer } = createButton('🎯', '#4CAF50', 'Open Menu');
    buttonContainer.appendChild(menuButtonContainer);

    // Create the toggle crosshair button
    const { button: toggleButton, container: toggleButtonContainer } = createButton('👁️', '#2196F3', 'Toggle Crosshair');
    buttonContainer.appendChild(toggleButtonContainer);

    // Toggle crosshair visibility
    let isCrosshairVisible = true;
    toggleButton.addEventListener('click', () => {
        isCrosshairVisible = !isCrosshairVisible;
        crosshair.style.display = isCrosshairVisible ? 'block' : 'none';
    });

    // Create the kill script button
    const { button: killButton, container: killButtonContainer } = createButton('❌', '#F44336', 'Kill Script');
    buttonContainer.appendChild(killButtonContainer);

    // Kill/uninject the script
    killButton.addEventListener('click', () => {
        document.body.removeChild(customContainer); // Remove all custom elements
    });

    // Create the blur overlay
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.top = '0';
    blurOverlay.style.left = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Start fully transparent
    blurOverlay.style.backdropFilter = 'blur(0px)'; // Start with no blur
    blurOverlay.style.display = 'none';
    blurOverlay.style.pointerEvents = 'auto'; // Allow clicks on the overlay
    blurOverlay.style.transition = 'backdrop-filter 0.3s ease-in-out, background-color 0.3s ease-in-out'; // Smooth transition
    customContainer.appendChild(blurOverlay);

    // Create the color picker menu
    const colorMenu = document.createElement('div');
    colorMenu.style.position = 'fixed';
    colorMenu.style.top = '50%';
    colorMenu.style.left = '50%';
    colorMenu.style.transform = 'translate(-50%, -50%)';
    colorMenu.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Start fully transparent
    colorMenu.style.padding = '20px';
    colorMenu.style.borderRadius = '10px';
    colorMenu.style.display = 'none';
    colorMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    colorMenu.style.color = 'white';
    colorMenu.style.fontFamily = 'Arial, sans-serif';
    colorMenu.style.pointerEvents = 'auto'; // Allow clicks on the menu
    colorMenu.style.transition = 'background-color 0.3s ease-in-out, opacity 0.3s ease-in-out'; // Smooth transition
    customContainer.appendChild(colorMenu);

    // Function to create a menu item with smooth text transition
    function createMenuItem(labelText, inputElement) {
        const container = document.createElement('div');
        container.style.opacity = '0'; // Start fully transparent
        container.style.transition = 'opacity 0.3s ease-in-out'; // Smooth transition

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '10px';
        label.style.color = 'white';
        label.style.fontFamily = 'Arial, sans-serif';
        label.style.fontSize = '14px';
        container.appendChild(label);

        if (inputElement) {
            container.appendChild(inputElement);
        }

        return container;
    }

    // Crosshair Color
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.style.display = 'flex';
    colorPickerContainer.style.alignItems = 'center';
    colorPickerContainer.style.gap = '10px';

    const colorPreview = document.createElement('div');
    colorPreview.style.width = '30px';
    colorPreview.style.height = '30px';
    colorPreview.style.borderRadius = '5px';
    colorPreview.style.backgroundColor = '#ff0000'; // Default color
    colorPreview.style.border = '2px solid white';
    colorPreview.style.cursor = 'pointer';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ff0000'; // Default color is red
    colorInput.style.opacity = '0';
    colorInput.style.position = 'absolute';
    colorInput.style.pointerEvents = 'none';
    colorInput.addEventListener('input', () => {
        crosshair.style.borderColor = colorInput.value;
        colorPreview.style.backgroundColor = colorInput.value;
    });

    colorPreview.addEventListener('click', () => {
        colorInput.click(); // Trigger the color picker
    });

    colorPickerContainer.appendChild(colorPreview);
    colorPickerContainer.appendChild(colorInput);

    const colorMenuItem = createMenuItem('Crosshair Color: ', colorPickerContainer);
    colorMenu.appendChild(colorMenuItem);

    // Crosshair Opacity
    const opacitySliderContainer = document.createElement('div');
    opacitySliderContainer.style.width = '100%';
    opacitySliderContainer.style.height = '20px';
    opacitySliderContainer.style.position = 'relative';
    opacitySliderContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    opacitySliderContainer.style.borderRadius = '10px';
    opacitySliderContainer.style.overflow = 'hidden';

    const opacitySliderFill = document.createElement('div');
    opacitySliderFill.style.position = 'absolute';
    opacitySliderFill.style.top = '0';
    opacitySliderFill.style.left = '0';
    opacitySliderFill.style.height = '100%';
    opacitySliderFill.style.width = '100%';
    opacitySliderFill.style.backgroundColor = '#2196F3';
    opacitySliderFill.style.borderRadius = '10px';
    opacitySliderFill.style.transition = 'width 0.2s ease-in-out';

    const opacitySliderThumb = document.createElement('div');
    opacitySliderThumb.style.position = 'absolute';
    opacitySliderThumb.style.top = '0';
    opacitySliderThumb.style.left = '0';
    opacitySliderThumb.style.width = '20px';
    opacitySliderThumb.style.height = '20px';
    opacitySliderThumb.style.backgroundColor = 'white';
    opacitySliderThumb.style.borderRadius = '50%';
    opacitySliderThumb.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    opacitySliderThumb.style.cursor = 'pointer';
    opacitySliderThumb.style.transition = 'left 0.2s ease-in-out';

    opacitySliderContainer.appendChild(opacitySliderFill);
    opacitySliderContainer.appendChild(opacitySliderThumb);

    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.min = '0';
    opacityInput.max = '1';
    opacityInput.step = '0.1';
    opacityInput.value = '1';
    opacityInput.style.position = 'absolute';
    opacityInput.style.top = '0';
    opacityInput.style.left = '0';
    opacityInput.style.width = '100%';
    opacityInput.style.height = '100%';
    opacityInput.style.opacity = '0';
    opacityInput.style.cursor = 'pointer';
    opacityInput.addEventListener('input', () => {
        const value = parseFloat(opacityInput.value);
        opacitySliderFill.style.width = `${value * 100}%`;
        opacitySliderThumb.style.left = `${value * 100}%`;
        crosshair.style.opacity = value;
    });
    opacitySliderContainer.appendChild(opacityInput);

    const opacityMenuItem = createMenuItem('Crosshair Opacity: ', opacitySliderContainer);
    colorMenu.appendChild(opacityMenuItem);

    // Crosshair Shape
    const shapeSelectContainer = document.createElement('div');
    shapeSelectContainer.style.position = 'relative';
    shapeSelectContainer.style.width = '100%';

    const shapeSelect = document.createElement('select');
    shapeSelect.style.width = '100%';
    shapeSelect.style.padding = '10px';
    shapeSelect.style.borderRadius = '5px';
    shapeSelect.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    shapeSelect.style.color = 'white';
    shapeSelect.style.border = 'none';
    shapeSelect.style.cursor = 'pointer';
    shapeSelect.style.appearance = 'none'; // Remove default arrow
    shapeSelect.style.fontFamily = 'Arial, sans-serif';
    shapeSelect.style.fontSize = '14px';

    const shapes = [
        { value: 'circle', text: 'Circle' },
        { value: 'square', text: 'Square' },
        { value: 'dot', text: 'Dot' },
        { value: 'triangle', text: 'Triangle' },
        { value: 'rounded-square', text: 'Rounded Square' }
    ];
    shapes.forEach(shape => {
        const option = document.createElement('option');
        option.value = shape.value;
        option.textContent = shape.text;
        shapeSelect.appendChild(option);
    });

    const shapeSelectArrow = document.createElement('div');
    shapeSelectArrow.style.position = 'absolute';
    shapeSelectArrow.style.top = '50%';
    shapeSelectArrow.style.right = '10px';
    shapeSelectArrow.style.transform = 'translateY(-50%)';
    shapeSelectArrow.style.width = '0';
    shapeSelectArrow.style.height = '0';
    shapeSelectArrow.style.borderLeft = '5px solid transparent';
    shapeSelectArrow.style.borderRight = '5px solid transparent';
    shapeSelectArrow.style.borderTop = '5px solid white';
    shapeSelectArrow.style.pointerEvents = 'none';

    shapeSelectContainer.appendChild(shapeSelect);
    shapeSelectContainer.appendChild(shapeSelectArrow);

    shapeSelect.addEventListener('change', () => {
        const shape = shapeSelect.value;
        if (shape === 'circle') {
            crosshair.style.borderRadius = '50%';
            crosshair.style.width = '20px';
            crosshair.style.height = '20px';
            crosshair.style.borderLeft = 'none';
            crosshair.style.borderRight = 'none';
            crosshair.style.borderBottom = 'none';
        } else if (shape === 'square') {
            crosshair.style.borderRadius = '0';
            crosshair.style.width = '20px';
            crosshair.style.height = '20px';
            crosshair.style.borderLeft = 'none';
            crosshair.style.borderRight = 'none';
            crosshair.style.borderBottom = 'none';
        } else if (shape === 'dot') {
            crosshair.style.borderRadius = '50%';
            crosshair.style.width = '10px';
            crosshair.style.height = '10px';
            crosshair.style.borderLeft = 'none';
            crosshair.style.borderRight = 'none';
            crosshair.style.borderBottom = 'none';
        } else if (shape === 'triangle') {
            crosshair.style.borderRadius = '0';
            crosshair.style.width = '0';
            crosshair.style.height = '0';
            crosshair.style.border = 'none';
            crosshair.style.borderLeft = '10px solid transparent';
            crosshair.style.borderRight = '10px solid transparent';
            crosshair.style.borderBottom = `20px solid ${crosshair.style.borderColor}`;
        } else if (shape === 'rounded-square') {
            crosshair.style.borderRadius = '10px';
            crosshair.style.width = '20px';
            crosshair.style.height = '20px';
            crosshair.style.borderLeft = 'none';
            crosshair.style.borderRight = 'none';
            crosshair.style.borderBottom = 'none';
        }
    });

    const shapeMenuItem = createMenuItem('Crosshair Shape: ', shapeSelectContainer);
    colorMenu.appendChild(shapeMenuItem);

    // Custom Crosshair Upload
    const customCrosshairInput = document.createElement('input');
    customCrosshairInput.type = 'file';
    customCrosshairInput.accept = 'image/*';
    customCrosshairInput.style.display = 'none';

    const customCrosshairLabel = document.createElement('label');
    customCrosshairLabel.textContent = 'Upload Custom Crosshair';
    customCrosshairLabel.style.display = 'block';
    customCrosshairLabel.style.marginTop = '15px';
    customCrosshairLabel.style.marginBottom = '10px';
    customCrosshairLabel.style.color = 'white';
    customCrosshairLabel.style.fontFamily = 'Arial, sans-serif';
    customCrosshairLabel.style.fontSize = '14px';
    customCrosshairLabel.style.cursor = 'pointer';
    customCrosshairLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    customCrosshairLabel.style.padding = '10px';
    customCrosshairLabel.style.borderRadius = '5px';
    customCrosshairLabel.style.textAlign = 'center';
    customCrosshairLabel.style.transition = 'background-color 0.2s ease-in-out';

    customCrosshairLabel.addEventListener('mouseover', () => {
        customCrosshairLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    customCrosshairLabel.addEventListener('mouseout', () => {
        customCrosshairLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    customCrosshairLabel.addEventListener('click', () => {
        customCrosshairInput.click(); // Trigger the file input
    });

    customCrosshairInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                crosshair.style.backgroundImage = `url(${e.target.result})`;
                crosshair.style.backgroundSize = 'cover';
                crosshair.style.border = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    const customCrosshairMenuItem = createMenuItem('', customCrosshairLabel);
    colorMenu.appendChild(customCrosshairMenuItem);
    colorMenu.appendChild(customCrosshairInput);

    // Crosshair Size Adjustment
    const sizeSliderContainer = document.createElement('div');
    sizeSliderContainer.style.width = '100%';
    sizeSliderContainer.style.height = '20px';
    sizeSliderContainer.style.position = 'relative';
    sizeSliderContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    sizeSliderContainer.style.borderRadius = '10px';
    sizeSliderContainer.style.overflow = 'hidden';

    const sizeSliderFill = document.createElement('div');
    sizeSliderFill.style.position = 'absolute';
    sizeSliderFill.style.top = '0';
    sizeSliderFill.style.left = '0';
    sizeSliderFill.style.height = '100%';
    sizeSliderFill.style.width = '50%'; // Default size
    sizeSliderFill.style.backgroundColor = '#4CAF50';
    sizeSliderFill.style.borderRadius = '10px';
    sizeSliderFill.style.transition = 'width 0.2s ease-in-out';

    const sizeSliderThumb = document.createElement('div');
    sizeSliderThumb.style.position = 'absolute';
    sizeSliderThumb.style.top = '0';
    sizeSliderThumb.style.left = '50%';
    sizeSliderThumb.style.width = '20px';
    sizeSliderThumb.style.height = '20px';
    sizeSliderThumb.style.backgroundColor = 'white';
    sizeSliderThumb.style.borderRadius = '50%';
    sizeSliderThumb.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    sizeSliderThumb.style.cursor = 'pointer';
    sizeSliderThumb.style.transition = 'left 0.2s ease-in-out';

    sizeSliderContainer.appendChild(sizeSliderFill);
    sizeSliderContainer.appendChild(sizeSliderThumb);

    const sizeInput = document.createElement('input');
    sizeInput.type = 'range';
    sizeInput.min = '10';
    sizeInput.max = '100';
    sizeInput.value = '20';
    sizeInput.style.position = 'absolute';
    sizeInput.style.top = '0';
    sizeInput.style.left = '0';
    sizeInput.style.width = '100%';
    sizeInput.style.height = '100%';
    sizeInput.style.opacity = '0';
    sizeInput.style.cursor = 'pointer';
    sizeInput.addEventListener('input', () => {
        const value = parseFloat(sizeInput.value);
        sizeSliderFill.style.width = `${value}%`;
        sizeSliderThumb.style.left = `${value}%`;
        crosshair.style.width = `${value}px`;
        crosshair.style.height = `${value}px`;
    });
    sizeSliderContainer.appendChild(sizeInput);

    const sizeMenuItem = createMenuItem('Crosshair Size: ', sizeSliderContainer);
    colorMenu.appendChild(sizeMenuItem);

    // Crosshair Glow
    const glowCheckboxContainer = document.createElement('label');
    glowCheckboxContainer.style.display = 'flex';
    glowCheckboxContainer.style.alignItems = 'center';
    glowCheckboxContainer.style.cursor = 'pointer';

    const glowCheckbox = document.createElement('div');
    glowCheckbox.style.width = '20px';
    glowCheckbox.style.height = '20px';
    glowCheckbox.style.borderRadius = '5px';
    glowCheckbox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    glowCheckbox.style.position = 'relative';
    glowCheckbox.style.transition = 'background-color 0.2s ease-in-out';

    const glowCheckboxTick = document.createElement('div');
    glowCheckboxTick.style.position = 'absolute';
    glowCheckboxTick.style.top = '50%';
    glowCheckboxTick.style.left = '50%';
    glowCheckboxTick.style.transform = 'translate(-50%, -50%)';
    glowCheckboxTick.style.width = '12px';
    glowCheckboxTick.style.height = '12px';
    glowCheckboxTick.style.backgroundColor = '#4CAF50';
    glowCheckboxTick.style.borderRadius = '3px';
    glowCheckboxTick.style.opacity = '0';
    glowCheckboxTick.style.transition = 'opacity 0.2s ease-in-out';

    glowCheckbox.appendChild(glowCheckboxTick);
    glowCheckboxContainer.appendChild(glowCheckbox);

    const glowCheckboxLabel = document.createElement('span');
    glowCheckboxLabel.textContent = 'Enable Crosshair Glow';
    glowCheckboxLabel.style.marginLeft = '10px';
    glowCheckboxLabel.style.color = 'white';
    glowCheckboxLabel.style.fontFamily = 'Arial, sans-serif';
    glowCheckboxLabel.style.fontSize = '14px';
    glowCheckboxContainer.appendChild(glowCheckboxLabel);

    glowCheckboxContainer.addEventListener('click', () => {
        const isChecked = glowCheckboxTick.style.opacity === '1';
        glowCheckboxTick.style.opacity = isChecked ? '0' : '1';
        glowCheckbox.style.backgroundColor = isChecked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)';

        if (!isChecked) {
            crosshair.style.boxShadow = `0 0 10px ${crosshair.style.borderColor}, 0 0 20px ${crosshair.style.borderColor}`;
        } else {
            crosshair.style.boxShadow = 'none';
        }
    });

    const glowMenuItem = createMenuItem('', glowCheckboxContainer);
    colorMenu.appendChild(glowMenuItem);

    // Toggle the color menu and blur overlay visibility
    menuButton.addEventListener('click', () => {
        const isMenuVisible = colorMenu.style.display === 'none';
        colorMenu.style.display = isMenuVisible ? 'block' : 'none';
        blurOverlay.style.display = isMenuVisible ? 'block' : 'none';

        // Smoothly transition the blur, menu background, and text opacity
        if (isMenuVisible) {
            setTimeout(() => {
                blurOverlay.style.backdropFilter = 'blur(5px)';
                blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                colorMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                Array.from(colorMenu.children).forEach(child => {
                    child.style.opacity = '1'; // Fade in menu items
                });
            }, 10); // Small delay to allow display change before transition
        } else {
            blurOverlay.style.backdropFilter = 'blur(0px)';
            blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            colorMenu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            Array.from(colorMenu.children).forEach(child => {
                child.style.opacity = '0'; // Fade out menu items
            });
        }
    });

    // Close the menu when clicking outside
    blurOverlay.addEventListener('click', () => {
        colorMenu.style.display = 'none';
        blurOverlay.style.display = 'none';
        blurOverlay.style.backdropFilter = 'blur(0px)';
        blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        colorMenu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        Array.from(colorMenu.children).forEach(child => {
            child.style.opacity = '0'; // Fade out menu items
        });
    });

    // Function to display a message at the top of the screen
    function displayMessage(message, backgroundColor = 'rgba(255, 0, 0, 0.8)') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '10px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = backgroundColor;
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '10px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = '1000000';
        messageDiv.style.fontFamily = 'Arial, sans-serif';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        document.body.appendChild(messageDiv);
    }

    // Check for script updates
    try {
        GM_xmlhttpRequest({
            method: 'GET',
            url: versionCheckURL,
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                if (latestVersion !== currentVersion) {
                    displayMessage(
                        `Your script is outdated (v${currentVersion}). Latest version is v${latestVersion}.`,
                        'rgba(255, 0, 0, 0.8)'
                    );
                    const updateLink = document.createElement('a');
                    updateLink.textContent = 'Click here to update.';
                    updateLink.href = updateURL;
                    updateLink.style.color = '#00ff00';
                    updateLink.style.marginLeft = '10px';
                    updateLink.style.textDecoration = 'underline';
                    document.body.appendChild(updateLink);
                }
            },
            onerror: function(error) {
                console.error('Failed to check for updates:', error);
                displayMessage(
                    'This script requires permission to fetch data. Please enable GM_xmlhttpRequest in your userscript manager.',
                    'rgba(255, 0, 0, 0.8)'
                );
            }
        });
    } catch (error) {
        console.error('GM_xmlhttpRequest is not available:', error);
        displayMessage(
            'This script requires permission to fetch data. Please enable GM_xmlhttpRequest in your userscript manager.',
            'rgba(255, 0, 0, 0.8)'
        );
    }

    // Slide the GUI in from the right after the page loads
    setTimeout(() => {
        buttonContainer.style.right = '20px'; // Slide into position
    }, 500); // Delay the slide-in slightly for a smoother effect
})();