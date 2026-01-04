// ==UserScript==
// @name         Universal Crosshair by Kakoncheater
// @namespace    http://tampermonkey.net/
// @version      4.23
// @description  Customizable crosshairs for any website.
// @author       made by Kakoncheater
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526197/Universal%20Crosshair%20by%20Kakoncheater.user.js
// @updateURL https://update.greasyfork.org/scripts/526197/Universal%20Crosshair%20by%20Kakoncheater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Crosshair Settings ---
    let crosshairStyle = "cross"; // Options: "cross", "dot", "circle", "square"
    let crosshairColor = "white";
    let crosshairSize = 20; // Unified Size
    let crosshairThickness = 2;
    let crosshairGap = 5;
    let crosshairOpacity = 1; // Values between 0.1 and 1

    // --- Menu Settings ---
    let menuBackgroundColor = "rgba(0, 0, 0, 0.8)"; // Initial menu background color
    let menuOpacity = 1; // Initial menu opacity (SET TO 1)

    // --- UI Elements ---
    let menuVisible = true; // Initial menu visibility
    let crosshairSettingsVisible = false; // Initial visibility of crosshair settings
    let crosshairEnabled = true; // Initial state of crosshair

    // --- Function to Create a UI Element ---
    function createElement(tag, attributes = {}, styles = {}) {
        const element = document.createElement(tag);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        for (const key in styles) {
            element.style[key] = styles[key];
        }
        return element; //Return the element
    }

    // --- Function to Update Crosshair Style ---
    function updateCrosshairStyle() {
        // Remove existing crosshair elements if any
        if (window.crosshairElements) {
            window.crosshairElements.forEach(el => el.remove());
        }
        window.crosshairElements = [];

        if (!crosshairEnabled || crosshairStyle === "none") return;

        if (crosshairStyle === "cross") { // Cross is Now Just +

            const halfSize = crosshairSize / 2;

            // Top Vertical Bar
            const verticalBarTop = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, calc(-50% - ${halfSize + crosshairGap}px))`,
                width: crosshairThickness + 'px',
                height: crosshairSize + 'px',
                backgroundColor: crosshairColor,
                opacity: crosshairOpacity,
                zIndex: 10000,
            });

            // Bottom Vertical Bar
            const verticalBarBottom = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, calc(-50% + ${halfSize + crosshairGap}px))`,
                width: crosshairThickness + 'px',
                height: crosshairSize + 'px',
                backgroundColor: crosshairColor,
                opacity: crosshairOpacity,
                zIndex: 10000,
            });

            // Left Horizontal Bar
            const HorizontalBarLeft = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% - ${halfSize + crosshairGap}px), -50%)`,
                width: crosshairSize + 'px',
                height: crosshairThickness + 'px',
                backgroundColor: crosshairColor,
                opacity: crosshairOpacity,
                zIndex: 10000,
            });

            // Right Horizontal Bar
            const HorizontalBarRight = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${halfSize + crosshairGap}px), -50%)`,
                width: crosshairSize + 'px',
                height: crosshairThickness + 'px',
                backgroundColor: crosshairColor,
                opacity: crosshairOpacity,
                zIndex: 10000,
            });

            window.crosshairElements.push(verticalBarTop);
            window.crosshairElements.push(verticalBarBottom);
            window.crosshairElements.push(HorizontalBarLeft);
            window.crosshairElements.push(HorizontalBarRight);

        } else if (crosshairStyle === "dot") {
            const dot = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: crosshairSize + 'px',  // Using unified size for dot diameter
                height: crosshairSize + 'px', // Using unified size for dot diameter
                backgroundColor: crosshairColor,
                borderRadius: '50%',
                opacity: crosshairOpacity,
                zIndex: 10000,
            });
            window.crosshairElements.push(dot);

        } else if (crosshairStyle === "circle") {
            const circle = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: (crosshairSize * 2) + 'px', // Using unified size for circle diameter
                height: (crosshairSize * 2) + 'px', // Using unified size for circle diameter
                borderRadius: '50%',
                border: crosshairThickness + 'px solid ' + crosshairColor,
                opacity: crosshairOpacity,
                boxSizing: 'border-box',
                zIndex: 10000,
            });
            window.crosshairElements.push(circle);
        } else if (crosshairStyle === "square") {
            const square = createElement('div', {}, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: crosshairSize + 'px', // Using unified size for square side
                height: crosshairSize + 'px', // Using unified size for square side
                border: crosshairThickness + 'px solid ' + crosshairColor,
                opacity: crosshairOpacity,
                boxSizing: 'border-box',
                zIndex: 10000,
            });
            window.crosshairElements.push(square);
        }
        window.crosshairElements.forEach(el => document.body.appendChild(el));
    }

    // --- Create the Main Menu ---
    const menuContainer = createElement('div', {}, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: '10000',
        backgroundColor: menuBackgroundColor, // Use menu background color variable
        padding: '10px',
        borderRadius: '5px',
        color: 'white',
        fontFamily: 'sans-serif',
        display: menuVisible ? 'block' : 'none', // Initial visibility
        opacity: menuOpacity, // Use menu opacity variable
    });

    // --- Menu Title ---
    const menuTitle = createElement('div', {}, {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '10px',
        fontSize: '16px'
    });
    menuTitle.textContent = "Universal Crosshair";
    menuContainer.appendChild(menuTitle);

    // --- Watermark ---
    const watermark = createElement('div', {}, {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.5)' // Semi-transparent white
    });
    watermark.textContent = "made by Kakoncheater";

     // --- Helper function to create labels and inputs ---
   function createSliderSetting(labelText, currentValue, changeHandler, min, max, step = 1) {
        const label = createElement('label', {}, { display: 'block', marginBottom: '5px' });
        label.textContent = labelText + ':';

        const slider = createElement('input', { type: 'range', value: currentValue, min: min, max: max, step:step, style: { width: '150px' } }); // Increased width
        slider.addEventListener('input', function() {
            changeHandler(parseFloat(this.value)); // Call the handler with the value, not the event
        });

        label.appendChild(slider);
        return label;
    }

    // --- Menu Background Color Picker ---
    const menuColorLabel = createElement('label', {}, { display: 'block', marginBottom: '5px' });
    menuColorLabel.textContent = 'Menu Background Color:';
    const menuColorInput = createElement('input', { type: 'color', value: rgbaToHex(menuBackgroundColor) }, {width: '50px'});
    menuColorInput.addEventListener('change', function() {
        menuBackgroundColor = this.value;
        menuContainer.style.backgroundColor = menuBackgroundColor;
    });
    menuColorLabel.appendChild(menuColorInput);
    menuContainer.appendChild(menuColorLabel);

   // --- Menu Opacity Setting ---
    const menuOpacityLabel = createSliderSetting(
        'Menu Opacity',
        menuOpacity,
        function(newValue) {
            menuOpacity = newValue;
            menuContainer.style.opacity = newValue;
        },
        0.1,
        1,
        0.05 // Step
    );
    menuContainer.appendChild(menuOpacityLabel);

    // --- Crosshair Style Dropdown ---
    const styleLabel = createElement('label', {}, { display: 'block', marginBottom: '5px' });
    styleLabel.textContent = 'Crosshair Style:';
    const styleSelect = createElement('select', {}, { width: '100px' });
    const styles = ["cross", "dot", "circle", "square"];
    styles.forEach(style => {
        const option = createElement('option', { value: style });
        option.textContent = style.charAt(0).toUpperCase() + style.slice(1); // Capitalize first letter
        styleSelect.appendChild(option);
    });
    styleSelect.value = crosshairStyle; // Set initial value
    styleSelect.addEventListener('change', function() {
        crosshairStyle = this.value;
        updateCrosshairStyle();
    });
    styleLabel.appendChild(styleSelect);
    menuContainer.appendChild(styleLabel);

    // --- Color Picker ---
    const colorLabel = createElement('label', {}, { display: 'block', marginBottom: '5px' });
    colorLabel.textContent = 'Crosshair Color:';
    const colorInput = createElement('input', { type: 'color', value: crosshairColor }, {width: '50px'});
    colorInput.addEventListener('change', function() {
        crosshairColor = this.value;
        updateCrosshairStyle();
    });
    colorLabel.appendChild(colorInput);
    menuContainer.appendChild(colorLabel);

   // --- Crosshair Opacity Setting ---
    const crosshairOpacityLabel = createSliderSetting(
        'Crosshair Opacity',
        crosshairOpacity,
        function(newValue) {
            crosshairOpacity = newValue;
            updateCrosshairStyle();
        },
        0.1,
        1,
        0.05 // Step
    );
    menuContainer.appendChild(crosshairOpacityLabel);

    // --- Create Crosshair Settings Menu ---
    const crosshairSettingsContainer = createElement('div', {}, {
        position: 'fixed',
        top: '10px',
        left: '0px', // Initialized to 0, updated when shown
        zIndex: '10001',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white',
        fontFamily: 'sans-serif',
        display: crosshairSettingsVisible ? 'block' : 'none',
    });

    // --- Size Setting ---
    const sizeLabel = createSliderSetting('Size', crosshairSize, function(newValue) {
        crosshairSize = newValue;
        updateCrosshairStyle();
    }, 1, 100);
    crosshairSettingsContainer.appendChild(sizeLabel);

    // --- Thickness Setting ---
    const thicknessLabel = createSliderSetting('Thickness', crosshairThickness, function(newValue) {
        crosshairThickness = newValue;
        updateCrosshairStyle();
    }, 1, 100);
    crosshairSettingsContainer.appendChild(thicknessLabel);

    // --- Gap Setting ---
    const gapLabel = createSliderSetting('Gap', crosshairGap, function(newValue) {
        crosshairGap = newValue;
        updateCrosshairStyle();
    }, 1, 100);
    crosshairSettingsContainer.appendChild(gapLabel);

    // --- Close Button for Settings Menu ---
    const closeButton = createElement('button', {}, { marginBottom: '5px' });
    closeButton.textContent = "Close";
    closeButton.addEventListener('click', function() {
        crosshairSettingsVisible = false;
        crosshairSettingsContainer.style.display = 'none';
    });
    crosshairSettingsContainer.appendChild(closeButton);

    // --- Toggle Crosshair Settings Button ---
    const changeCrosshairButton = createElement('button', {}, { marginBottom: '5px' });
    changeCrosshairButton.textContent = "Change Crosshair";
    changeCrosshairButton.addEventListener('click', function() {
        crosshairSettingsVisible = !crosshairSettingsVisible;
        crosshairSettingsContainer.style.display = crosshairSettingsVisible ? 'block' : 'none';
        // Reposition on open
        if (crosshairSettingsVisible) {
            crosshairSettingsContainer.style.left = parseFloat(menuContainer.style.left) + menuContainer.offsetWidth + 'px';
        }
    });
    menuContainer.appendChild(changeCrosshairButton);

     // --- Toggle Crosshair Button ---
    const toggleCrosshairButton = createElement('button', {}, {
        marginBottom: '5px',
        backgroundColor: crosshairEnabled ? 'green' : 'red',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '3px',
        cursor: 'pointer'
    });

    function updateToggleButtonText() {
        toggleCrosshairButton.textContent = crosshairEnabled ? "Crosshair ON" : "Crosshair OFF";
    }

    updateToggleButtonText(); // Set initial text

    toggleCrosshairButton.addEventListener('click', function() {
        crosshairEnabled = !crosshairEnabled;
        toggleCrosshairButton.style.backgroundColor = crosshairEnabled ? 'green' : 'red';
        updateToggleButtonText();
        updateCrosshairStyle();
    });
    menuContainer.appendChild(toggleCrosshairButton);

    // --- Function to handle Insert key press ---
    function handleInsertKeyPress(event) {
        if (event.key === 'Insert') {
            menuVisible = !menuVisible;
            menuContainer.style.display = menuVisible ? 'block' : 'none';
            if (!menuVisible) { // Also hide crosshair settings if main menu is hidden
                crosshairSettingsVisible = false;
                crosshairSettingsContainer.style.display = 'none';
            }
        }
    }

    // --- Hotkey to toggle menu visibility ---
    document.addEventListener('keydown', handleInsertKeyPress);

    // --- Helper function to convert RGBA to Hex for color picker ---
    function rgbaToHex(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
        }
        return "#000000"; // Default to black if parsing fails
    }

    // --- Append Watermark ---
    menuContainer.appendChild(watermark);

    // --- Append Menus to Body ---
    document.body.appendChild(menuContainer);
    document.body.appendChild(crosshairSettingsContainer);

    // --- Initialize Crosshair ---
    updateCrosshairStyle();

    // Set initial menu opacity to max
    menuContainer.style.opacity = menuOpacity;

})();

// --- Set the position of crosshairSettingsContainer after the DOM is fully loaded ---
window.addEventListener('load', function() {
    const menuContainer = document.querySelector('div[style*="z-index: 10000;"]'); // Select the menu
    const crosshairSettingsContainer = document.querySelector('div[style*="z-index: 10001;"]'); // Select settings

    if (menuContainer && crosshairSettingsContainer) {
        crosshairSettingsContainer.style.left = parseFloat(menuContainer.style.left) + menuContainer.offsetWidth + 'px';
    } else {
        console.warn("Universal Crosshair: Could not find menu or settings container to position correctly.");
    }
});