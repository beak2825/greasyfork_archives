// ==UserScript==
// @name         Money Hack Updated
// @namespace    https://github.com/TTVJDESS/Money-Simulator-Cheat-GUI
// @version      0.3
// @description  Custom Hack For My Website(http://money-sim.free.nf/)
// @author       JDESS
// @match        http://money-sim.free.nf/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491965/Money%20Hack%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/491965/Money%20Hack%20Updated.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the GUI
    let CheatMenu = document.createElement('div');
    CheatMenu.style.position = 'fixed';
    CheatMenu.style.top = '20px';
    CheatMenu.style.left = '20px';
    CheatMenu.style.width = '168px';
    CheatMenu.style.backgroundColor = ''; // Pink with 50% opacity
    CheatMenu.style.border = ''; // Darker outline
    CheatMenu.style.color = ''; // Black text

    // Create the main dropdown container
    const CheatMenuDropdown = document.createElement('div');
    CheatMenuDropdown.style.position = 'fixed';
    CheatMenuDropdown.style.top = '20px';
    CheatMenuDropdown.style.left = '20px';
    CheatMenu.appendChild(CheatMenuDropdown);

    // Create the button to toggle the dropdown
    const CheatMenuButton = document.createElement('button');
    CheatMenuButton.textContent = 'Cheat Menu by JDESS 🢃';
    CheatMenuButton.style.marginTop = '0px';
    CheatMenuButton.style.color = '';
    CheatMenuButton.style.backgroundColor = 'transparent'; // Pink with 50% opacity
    CheatMenu.appendChild(CheatMenuButton);

    // Create a container for the GUI
    const MainFeatures = document.createElement('div');
    // Apply various styles using element.style
    MainFeatures.style.fontSize = '16px';
    MainFeatures.style.display = 'none'; // Initially hide the dropdown content
    MainFeatures.style.fontWeight = 'bold';
    MainFeatures.style.opacity = '0.9';
    CheatMenu.appendChild(MainFeatures);

    // Create the dropdown content
    const AutoClickerContent = document.createElement('div');
    AutoClickerContent.style.backgroundColor = 'transparent';
    MainFeatures.appendChild(AutoClickerContent);

    // Create the button to toggle the dropdown
    const AutoClickerButton = document.createElement('button');
    AutoClickerButton.textContent = 'Auto Clicker🖰 🢃';
    AutoClickerButton.style.color = '';
    AutoClickerButton.style.width = '158px';
    AutoClickerButton.style.marginTop = '0px';
    AutoClickerButton.style.padding = '0px';
    AutoClickerButton.style.fontSize = '16px';
    AutoClickerButton.style.fontWeight = 'bold';
    AutoClickerButton.style.opacity = '0.9';
    AutoClickerButton.style.backgroundColor = 'transparent'; // Pink with 50% opacity
    AutoClickerContent.appendChild(AutoClickerButton);

    // Create a container for the GUI
    const AutoclickerSettings = document.createElement('div');
    // Apply various styles using element.style
    AutoclickerSettings.style.fontSize = '16px';
    AutoclickerSettings.style.display = 'none'; // Initially hide the dropdown content
    AutoclickerSettings.style.fontWeight = 'bold';
    AutoclickerSettings.style.opacity = '0.9';
    MainFeatures.appendChild(AutoclickerSettings);

    // Create the on/off switch (toggle) for Auto Buy
    const AutoClickerSwitch = document.createElement('input');
    AutoClickerSwitch.type = 'checkbox';
    AutoClickerSwitch.id = 'autoBuySwitch'; // Assign an ID for styling and event handling
    AutoClickerSwitch.style.marginTop = '10px';
    AutoClickerSwitch.style.appearance = 'none'; // Hide default checkbox appearance

    // Styling for the custom switch (toggle)
    const switchStyle = document.createElement('style');
    switchStyle.textContent = `
        #autoBuySwitch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            background-color: grey;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #autoBuySwitch::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            background-color: white;
            transition: transform 0.3s;
        }
        #autoBuySwitch:checked::before {
            transform: translateX(20px);
        }
    `;

    // Append the custom switch styles to the document head
    document.head.appendChild(switchStyle);

    // Append the custom switch to the Auto Buy settings
    AutoclickerSettings.appendChild(AutoClickerSwitch);


// Inside the script where slider is defined
const slider = document.createElement('input');
slider.type = 'range';
slider.min = '0';
slider.max = '1000';
slider.value = '100'; // Default value
slider.style.width = '100%'; // Set the width to fill the container
slider.style.marginTop = '10px';
AutoclickerSettings.appendChild(slider);

// Add an event listener to the slider
slider.addEventListener('input', function() {
    const currentValue = parseInt(slider.value); // Get the current value of the slider
    showNotification(`Auto Clicker Rate: ${currentValue}`); // Display notification with current slider value
});

    // Create the dropdown content
    const ddContent1 = document.createElement('div');
    ddContent1.style.backgroundColor = 'transparent';
    MainFeatures.appendChild(ddContent1);

    // Create the button to toggle the dropdown
    const ddButton1 = document.createElement('button');
    ddButton1.textContent = 'Auto Buy🏷️ 🢃';
    ddButton1.style.color = '';
    ddButton1.style.width = '158px';
    ddButton1.style.marginTop = '0px';
    ddButton1.style.padding = '0px';
    ddButton1.style.fontSize = '16px';
    ddButton1.style.fontWeight = 'bold';
    ddButton1.style.opacity = '0.9';
    ddButton1.style.backgroundColor = 'transparent'; // Pink with 50% opacity
    ddContent1.appendChild(ddButton1);

    // Create a container for the GUI
    const AutoBuySettings = document.createElement('div');
    // Apply various styles using element.style
    AutoBuySettings.style.fontSize = '16px';
    AutoBuySettings.style.display = 'none'; // Initially hide the dropdown content
    AutoBuySettings.style.fontWeight = 'bold';
    AutoBuySettings.style.opacity = '0.9';
    AutoBuySettings.style.zIndex = '9999'; // Ensure GUI appears above other elements
    MainFeatures.appendChild(AutoBuySettings);

    // Create the button to toggle the dropdown
    const Autobuy = document.createElement('button');
    Autobuy.textContent = 'Auto Buy Everything';
    Autobuy.style.marginTop = '0px';
    Autobuy.style.color = '';
    Autobuy.style.backgroundColor = 'transparent'; // Pink with 50% opacity
    AutoBuySettings.appendChild(Autobuy);

// Function to create a styled button
function createStyledButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.width = '158px';
    button.style.marginTop = '0px';
    button.style.padding = '0px';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.opacity = '0.9';
    button.style.backgroundColor = 'transparent'; // Pink with 50% opacity
    button.addEventListener('click', onClick);
    return button;
}

// Function to create a styled input field
function createStyledInput(placeholder) {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = placeholder;
    input.style.width = '150px';
    return input;
}

// Create Money Giver Dropdown
const MoneyGiverdd = document.createElement('div');
MoneyGiverdd.style.backgroundColor = 'transparent';
MainFeatures.appendChild(MoneyGiverdd);

    // Create Money Giver Settings
const MoneyGiverSettings = document.createElement('div');
MoneyGiverSettings.style.fontSize = '16px';
MoneyGiverSettings.style.display = 'none'; // Initially hide the dropdown content
MoneyGiverSettings.style.fontWeight = 'bold';
MoneyGiverSettings.style.opacity = '0.9';
MoneyGiverdd.appendChild(MoneyGiverSettings);

// Create Money Giver Button
const MoneyGiverddButton = createStyledButton('Give Money💸 🢃', () => {
    toggleElementVisibility(MoneyGiverSettings);
    console.log('this isnt working he vuisability');
});

// Create Money Input Field
const moneyInput = createStyledInput('Set Money');
MoneyGiverSettings.appendChild(moneyInput);
    console.log('addedmoneyinput');

// Create Give Money Button
const MoneyGiver = createStyledButton('Give Money', () => {
    const amount = parseFloat(moneyInput.value);
    if (!isNaN(amount) && amount > 0) {
        giveMoney(amount);
    } else {
        showNotification('Please enter a valid positive number.');
    }
});

MoneyGiverSettings.appendChild(MoneyGiver);

// Function to toggle element visibility
function toggleElementVisibility(element) {
    console.log('visable');
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

// Function to give money to the game
function giveMoney(amount) {
    // Modify this function to interact with your game's logic to add money
    showNotification(`Successfully gave ${amount} money.`);
}
// Append Money Giver Button to Dropdown
MoneyGiverdd.appendChild(MoneyGiverddButton);

// Create GUI elements
const GuiSettings = document.createElement('div');
GuiSettings.style.backgroundColor = 'transparent';
MainFeatures.appendChild(GuiSettings);

const GuiSettingsButton = document.createElement('button');
GuiSettingsButton.textContent = 'Gui Settings⚙️🢃';
GuiSettingsButton.style.cssText = `
    color: inherit;
    width: 158px;
    margin-top: 0;
    padding: 0;
    font-size: 16px;
    font-weight: bold;
    opacity: 0.9;
    background-color: transparent;
`;
GuiSettings.appendChild(GuiSettingsButton);

const GuiMenu = document.createElement('div');
GuiMenu.style.cssText = `
    font-size: 16px;
    display: none;
    font-weight: bold;
    opacity: 0.9;
`;
MainFeatures.appendChild(GuiMenu);

// Create color pickers
const bgColorPicker = createColorPicker('#ffc0cb', (color) => {
    updateBackgroundColor(color);
});

const borderColorPicker = createColorPicker('#8b008b', (color) => {
    updateBorderColor(color);
});

const textColorPicker = createColorPicker('#000000', (color) => {
    applyTextColor(color);
});

const opacitySlider = createOpacitySlider(0.7, (value) => {
    updateBackgroundOpacity(value);
});

// Load settings on page load
window.addEventListener('load', loadColorSettings);

// Reset settings button
const resetSettingsButton = createResetButton();
resetSettingsButton.addEventListener('click', resetColorSettings);
GuiMenu.appendChild(resetSettingsButton);

// Functions
function createColorPicker(defaultColor, callback) {
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = defaultColor;
    colorPicker.style.marginTop = '10px';
    colorPicker.addEventListener('input', () => {
        callback(colorPicker.value);
    });
    GuiMenu.appendChild(colorPicker);
    return colorPicker;
}

function createOpacitySlider(defaultValue, callback) {
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0';
    opacitySlider.max = '1';
    opacitySlider.step = '0.1';
    opacitySlider.value = defaultValue.toString();
    opacitySlider.style.width = '100%';
    opacitySlider.style.marginTop = '10px';
    opacitySlider.addEventListener('input', () => {
        callback(opacitySlider.value);
    });
    GuiMenu.appendChild(opacitySlider);
    return opacitySlider;
}

function updateBackgroundColor(color) {
    CheatMenu.style.backgroundColor = color;
    saveColorSettings('bgColor', color);
}

function updateBorderColor(color) {
    CheatMenu.style.border = `2px solid ${color}`;
    saveColorSettings('borderColor', color);
}

function updateBackgroundOpacity(value) {
    CheatMenu.style.backgroundColor = `rgba(${hexToRgb(CheatMenu.style.backgroundColor)}, ${value})`;
    saveColorSettings('bgOpacity', value);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function saveColorSettings(key, value) {
    localStorage.setItem(key, value);
    showNotification(`${key} saved: ${value}`);
}

function loadColorSettings() {
    CheatMenu.style.backgroundColor = localStorage.getItem('bgColor') || '#ffc0cb';
    CheatMenu.style.border = `2px solid ${localStorage.getItem('borderColor') || '#8b008b'}`;
    textColorPicker.value = localStorage.getItem('textColor') || '#000000';
    applyTextColor(textColorPicker.value);
    opacitySlider.value = localStorage.getItem('bgOpacity') || '0.7';
}

function resetColorSettings() {
    localStorage.removeItem('bgColor');
    localStorage.removeItem('borderColor');
    localStorage.removeItem('textColor');
    localStorage.removeItem('bgOpacity');
    loadColorSettings();
}

function applyTextColor(color) {
    const elementsToUpdate = [GuiSettingsButton, ddButton1, AutoClickerButton, CheatMenuButton, MoneyGiverddButton];
    elementsToUpdate.forEach((element) => {
        element.style.color = color;
        showNotification(`Text color updated for ${element.textContent.trim()}.`);
    });
}

function createResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Settings';
    resetButton.style.marginTop = '10px';
    resetButton.style.backgroundColor = 'transparent';
    return resetButton;
}
    const GuiSettingsSwitch = document.createElement('input');
    GuiSettingsSwitch.type = 'checkbox';
    GuiSettingsSwitch.id = 'autoBuySwitch'; // Assign an ID for styling and event handling
    GuiSettingsSwitch.style.marginTop = '10px';
    GuiSettingsSwitch.style.appearance = 'none'; // Hide default checkbox appearance

    // Styling for the custom switch (toggle)
    const GuiSettingsSwitchStyle = document.createElement('style');
    GuiSettingsSwitchStyle.textContent = `
        #GuiSettingsSwitch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            background-color: grey;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #GuiSettingsSwitch::before {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            background-color: white;
            transition: transform 0.3s;
        }
        #GuiSettingsSwitch:checked::before {
            transform: translateX(20px);
        }
    `;

    // Append the custom switch styles to the document head
    document.head.appendChild(GuiSettingsSwitchStyle);

    // Append the custom switch to the Auto Buy settings
    GuiMenu.appendChild(GuiSettingsSwitch);


// Function to toggle element display and show notification
function toggleElementDisplay(element, showNotificationMessage) {
    const isVisible = element.style.display !== 'none';
    element.style.display = isVisible ? 'none' : 'block';
    const notificationMessage = isVisible ? `${showNotificationMessage} Hidden` : `${showNotificationMessage} Shown`;
    showNotification(notificationMessage);
}

// Event listeners for toggling element display
CheatMenuButton.addEventListener('click', () => toggleElementDisplay(MainFeatures, 'Cheat Menu'));
MoneyGiverddButton.addEventListener('click', () => toggleElementDisplay(MoneyGiverSettings, 'Give Money'));
ddButton1.addEventListener('click', () => toggleElementDisplay(AutoBuySettings, 'Auto Buy'));
AutoClickerButton.addEventListener('click', () => toggleElementDisplay(AutoclickerSettings, 'Auto Clicker'));
GuiSettingsButton.addEventListener('click', () => toggleElementDisplay(GuiMenu, 'Gui Settings'));

// Event listener for AutoClickerSwitch
AutoClickerSwitch.addEventListener('change', () => {
    const notificationMessage = AutoClickerSwitch.checked ? 'Auto Clicker Enabled' : 'Auto Clicker Disabled';
    showNotification(notificationMessage);
    // Add logic to enable/disable auto clicker based on AutoClickerSwitch state
});

// Event listener for GuiSettingsSwitch
GuiSettingsSwitch.addEventListener('change', () => {
    const notificationMessage = GuiSettingsSwitch.checked ? 'Notifications On' : 'Notifications Off';
    showNotification(notificationMessage);
    // Add logic to enable/disable notifications based on GuiSettingsSwitch state
});

// Event listener for Autobuy button
Autobuy.addEventListener('click', () => {
    const notificationMessage = isAutoBuyEnabled() ? 'Auto Buy Activated' : 'Auto Buy Deactivated';
    showNotification(notificationMessage);
    // Add logic to activate/deactivate auto buy based on its state
});

// Function to check if Auto Buy is enabled (example implementation)
function isAutoBuyEnabled() {
    return AutoClickerSwitch.checked; // Assuming AutoClickerSwitch is your checkbox
}

// Event listener to toggle Cheat Menu with 'h' key
document.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        toggleElementDisplay(CheatMenu, 'Cheat Menu');
    }
});

// Function to display notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');

    // Apply the specified styles to the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.7); /* Transparent black background */
        color: #ffffff; /* White text */
        border: 1px solid #ffffff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-in-out, slideOutRight 0.3s ease-in-out 2s forwards;
    `;

    document.body.appendChild(notification);

    // Automatically remove the notification after a delay
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300); // Wait for the slideOut animation to complete before removing
    }, 2000); // Display the notification for 2 seconds
}

// Append CheatMenu to the document body (assuming CheatMenu is already created)
document.body.appendChild(CheatMenu);

})();
