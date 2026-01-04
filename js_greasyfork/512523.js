// ==UserScript==
// @name         Otter cleint 1.0 release comma key to toggle menu or ,,,,,,,,,,,,,,
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  W rizz
// @author       You
// @match        https://cryzen.io/
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512523/Otter%20cleint%2010%20release%20comma%20key%20to%20toggle%20menu%20or%20%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C.user.js
// @updateURL https://update.greasyfork.org/scripts/512523/Otter%20cleint%2010%20release%20comma%20key%20to%20toggle%20menu%20or%20%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C.meta.js
// ==/UserScript==
 // Player ESP code - Enabled by default
Object.defineProperty(Object.prototype, 'material', {
    get() {
        return this._material;
    },
    set(v) {
        if (this.type === 'SkinnedMesh' && this?.skeleton) {
            Object.defineProperties(v, {
                'depthTest': {
                    get() {
                        return false;
                    },
                    set(v) {},
                },
                'transparent': {
                    get() {
                        return true;
                    },
                    set(v) {},
                },
            });
        }
        this._material = v;
    },
});

// Track player ESP state
let playerEspEnabled = true; // Default is ON

// Anti-Recoil Code
const _random = Math.random;
let antiRecoilEnabled = false; // Default is OFF

// Function to toggle Anti-Recoil
function toggleAntiRecoil() {
    antiRecoilEnabled = !antiRecoilEnabled;

    if (antiRecoilEnabled) {
        Object.defineProperty(Math, 'random', {
            get() {
                try {
                    throw new Error();
                } catch (error) {
                    const stack = error.stack;
                    if (stack.includes('shoot')) {
                        return () => 0.5; // Neutralize recoil
                    }
                }
                return _random;
            },
            set(value) {
                _random = value;
            },
        });
    } else {
        Object.defineProperty(Math, 'random', {
            get() {
                return _random;
            },
            set(value) {
                _random = value;
            },
        });
    }
}

// Keystrokes Box Feature
let keystrokesEnabled = false;
let keystrokesBox = document.createElement('div');

// Style the keystrokes box
keystrokesBox.style.position = 'fixed';
keystrokesBox.style.top = '10px';
keystrokesBox.style.left = '10px';
keystrokesBox.style.width = '150px';
keystrokesBox.style.height = '150px';
keystrokesBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
keystrokesBox.style.color = 'white';
keystrokesBox.style.borderRadius = '10px';
keystrokesBox.style.zIndex = '10000';
keystrokesBox.style.display = 'none'; // Initially hidden
keystrokesBox.style.padding = '10px';

// Append the keystrokes box to the body
document.body.appendChild(keystrokesBox);

// Array to store keystroke elements
let keystrokeKeys = ['W', 'A', 'S', 'D', '1', '2', '3', 'C', 'LClick', 'RClick'];
let keystrokeElements = {};

// Create elements for each key and append them to the keystrokes box
keystrokeKeys.forEach(key => {
    let keyElement = document.createElement('div');
    keyElement.textContent = key;
    keyElement.style.marginBottom = '5px';
    keyElement.style.fontSize = '16px';
    keyElement.style.fontWeight = 'bold';
    keyElement.style.textAlign = 'center';
    keyElement.style.backgroundColor = `hsl(0, 100%, 50%)`; // Initial RGB color
    keyElement.style.padding = '5px';
    keyElement.style.borderRadius = '5px';
    
    keystrokesBox.appendChild(keyElement);
    keystrokeElements[key] = keyElement;
});

// Keystroke handling with color change
document.addEventListener('keydown', (event) => {
    let key = event.key.toUpperCase();
    if (['W', 'A', 'S', 'D', '1', '2', '3', 'C'].includes(key) && keystrokesEnabled) {
        let element = keystrokeElements[key];
        element.style.backgroundColor = 'green'; // Highlight on press
    }
    if (event.button === 0 && keystrokesEnabled) { // Left Click
        let element = keystrokeElements['LClick'];
        element.style.backgroundColor = 'green';
    }
    if (event.button === 2 && keystrokesEnabled) { // Right Click
        let element = keystrokeElements['RClick'];
        element.style.backgroundColor = 'green';
    }
});

document.addEventListener('keyup', (event) => {
    let key = event.key.toUpperCase();
    if (['W', 'A', 'S', 'D', '1', '2', '3', 'C'].includes(key) && keystrokesEnabled) {
        let element = keystrokeElements[key];
        element.style.backgroundColor = `hsl(0, 100%, 50%)`; // Reset color after release
    }
    if (event.button === 0 && keystrokesEnabled) { // Left Click
        let element = keystrokeElements['LClick'];
        element.style.backgroundColor = `hsl(0, 100%, 50%)`; // Reset
    }
    if (event.button === 2 && keystrokesEnabled) { // Right Click
        let element = keystrokeElements['RClick'];
        element.style.backgroundColor = `hsl(0, 100%, 50%)`; // Reset
    }
});

// Function to toggle keystrokes
function toggleKeystrokes() {
    keystrokesEnabled = !keystrokesEnabled;
    keystrokesBox.style.display = keystrokesEnabled ? 'block' : 'none';
}

// Create a new div element for the crosshair center (the dot)
let crosshair = document.createElement('div');

// Style the crosshair center
crosshair.style.position = 'fixed';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.width = '8px';
crosshair.style.height = '8px';
crosshair.style.backgroundColor = 'red'; // Initial color
crosshair.style.borderRadius = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.zIndex = '9999'; // Ensure it's on top of everything else
crosshair.style.display = 'none'; // Initially hidden

// Append the crosshair to the body
document.body.appendChild(crosshair);

// Function to smoothly transition the color of the crosshair
let hue = 0;
function animateRainbow() {
    hue = (hue + 1) % 360; // Loop through 0-360 (full spectrum of colors)
    if (crosshair.style.display !== 'none') {
        crosshair.style.backgroundColor = `hsl(${hue}, 100%, 50%)`; // HSL color mode for smooth transitions
    }
    requestAnimationFrame(animateRainbow); // Keep the animation going
}
animateRainbow();

// Create the main menu
let menu = document.createElement('div');
menu.style.position = 'fixed';
menu.style.top = '10px';
menu.style.right = '10px';
menu.style.padding = '20px';
menu.style.width = '300px';  
menu.style.height = '360px'; // Increased height for additional buttons
menu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
menu.style.color = 'white';
menu.style.borderRadius = '10px';
menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
menu.style.zIndex = '10000'; // Ensure it's on top of other elements
menu.style.display = 'none'; // Initially hidden

// Menu content
let title = document.createElement('div');
title.style.fontWeight = 'bold';
title.style.fontSize = '24px'; // Larger font size
title.style.color = 'red';
title.style.marginBottom = '10px';
title.textContent = 'Otter Client 1.0';

menu.appendChild(title);

// Add the crosshair toggle button to the menu
let crosshairToggle = document.createElement('button');
crosshairToggle.textContent = 'Toggle Crosshair';
crosshairToggle.style.display = 'block';
crosshairToggle.style.marginTop = '10px';
crosshairToggle.style.padding = '10px';
crosshairToggle.style.fontSize = '16px';
crosshairToggle.style.cursor = 'pointer';
crosshairToggle.style.backgroundColor = 'black'; // Initial color
crosshairToggle.style.color = '#fff';
crosshairToggle.style.border = 'none';
crosshairToggle.style.borderRadius = '5px';

// Add event listener to toggle crosshair visibility
crosshairToggle.addEventListener('click', () => {
    const isVisible = crosshair.style.display === 'none';
    crosshair.style.display = isVisible ? 'block' : 'none';
    
    // Change button color based on state
    crosshairToggle.style.backgroundColor = isVisible ? 'darkgreen' : 'black';
});

// Append crosshair toggle button to menu
menu.appendChild(crosshairToggle);

// Add the Player ESP toggle button to the menu
let espToggle = document.createElement('button');
espToggle.textContent = 'Toggle Player ESP';
espToggle.style.display = 'block';
espToggle.style.marginTop = '10px';
espToggle.style.padding = '10px';
espToggle.style.fontSize = '16px';
espToggle.style.cursor = 'pointer';
espToggle.style.backgroundColor = 'darkgreen'; // Initially ON
espToggle.style.color = '#fff';
espToggle.style.border = 'none';
espToggle.style.borderRadius = '5px';

// Function to toggle Player ESP
function togglePlayerEsp() {
    playerEspEnabled = !playerEspEnabled;

    // Change button color based on state
    espToggle.style.backgroundColor = playerEspEnabled ? 'darkgreen' : 'black';
}

// Add event listener to toggle ESP
espToggle.addEventListener('click', togglePlayerEsp);

// Append ESP toggle button to menu
menu.appendChild(espToggle);

// Add the Anti-Recoil toggle button to the menu
let recoilToggle = document.createElement('button');
recoilToggle.textContent = 'Toggle Anti-Recoil';
recoilToggle.style.display = 'block';
recoilToggle.style.marginTop = '10px';
recoilToggle.style.padding = '10px';
recoilToggle.style.fontSize = '16px';
recoilToggle.style.cursor = 'pointer';
recoilToggle.style.backgroundColor = 'black'; // Initially OFF
recoilToggle.style.color = '#fff';
recoilToggle.style.border = 'none';
recoilToggle.style.borderRadius = '5px';

// Add event listener to toggle anti-recoil
recoilToggle.addEventListener('click', () => {
    toggleAntiRecoil();

    // Change button color based on state
    recoilToggle.style.backgroundColor = antiRecoilEnabled ? 'darkgreen' : 'black';
});

// Append Anti-Recoil toggle button to menu
menu.appendChild(recoilToggle);

// Add the Keystrokes toggle button to the menu
let keystrokesToggle = document.createElement('button');
keystrokesToggle.textContent = 'Toggle Keystrokes';
keystrokesToggle.style.display = 'block';
keystrokesToggle.style.marginTop = '10px';
keystrokesToggle.style.padding = '10px';
keystrokesToggle.style.fontSize = '16px';
keystrokesToggle.style.cursor = 'pointer';
keystrokesToggle.style.backgroundColor = 'black'; // Initially OFF
keystrokesToggle.style.color = '#fff';
keystrokesToggle.style.border = 'none';
keystrokesToggle.style.borderRadius = '5px';

// Add event listener to toggle keystrokes
keystrokesToggle.addEventListener('click', () => {
    toggleKeystrokes();

    // Change button color based on state
    keystrokesToggle.style.backgroundColor = keystrokesEnabled ? 'darkgreen' : 'black';
});

// Append Keystrokes toggle button to menu
menu.appendChild(keystrokesToggle);

// Add event listener to toggle menu visibility
document.addEventListener('keydown', (event) => {
    if (event.key === ',') {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
});

// Append the main menu to the body
document.body.appendChild(menu);

// Ensure the Player ESP is on when the menu opens
togglePlayerEsp();


