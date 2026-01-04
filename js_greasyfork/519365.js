// ==UserScript==
// @name         Optimized Auto Feed for gota.io with Dynamic Delay After Split
// @version      2.1
// @description  Faster feed with dynamic delay after split based on mass
// @author       edited by Drago
// @match        https://gota.io/web*
// @grant        none
// @namespace https://greasyfork.org/users/1404589
// @downloadURL https://update.greasyfork.org/scripts/519365/Optimized%20Auto%20Feed%20for%20gotaio%20with%20Dynamic%20Delay%20After%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/519365/Optimized%20Auto%20Feed%20for%20gotaio%20with%20Dynamic%20Delay%20After%20Split.meta.js
// ==/UserScript==

// Define the keybind for feeding (middle mouse button)
const mousebind = 1; // 1 refers to the middle mouse button

// Function to extract mass from the HTML element with id="pMass"
function getMassFromCSS() {
    const massElement = document.getElementById('pMass'); // Use the correct ID "pMass"
    if (massElement) {
        const massText = massElement.textContent || massElement.innerText;
        const extractedMass = parseFloat(massText.replace(/[^\d.-]/g, '')); // Clean any non-numeric characters
        return isNaN(extractedMass) ? 0 : extractedMass; // Return the mass or 0 if invalid
    }
    return 0; // Return 0 if the mass element doesn't exist
}

// Listen for mouse down events
document.addEventListener('mousedown', function(evt) {
    const button = evt.button;

    // Check if chat input or name box is focused
    const chatInput = document.getElementById('chat-input');
    const nameBox = document.getElementById('name-box');
    if ($(chatInput).is(':focus') || $(nameBox).is(':focus')) {
        return;
    }

    // Check if the pressed mouse button is the middle mouse button
    if (button === mousebind) {
        autoFeed();
    }
});

// Function to perform auto feeding
function autoFeed() {
    // Get mass from the HTML element directly
    const myMass = getMassFromCSS();

    // Perform feeding without delay
    triggerKey(32, 5); // Feed 5 times quickly

    // Calculate delay after the split based on mass
    const delayAfterSplit = calculateDelay(myMass);

    console.log('Triggering feed with mass:', myMass, 'and delay after split:', delayAfterSplit); // Debugging: Check the mass and delay

    setTimeout(function() {
        triggerKey(87, 1); // Split 1 time
        setTimeout(() => {
            triggerKey(32, 5); // Feed 5 times quickly again after the split
        }, delayAfterSplit); // Delay after split for optimal performance
    }, 0); // No delay before split
}

// Function to calculate delay
function calculateDelay(mass) {
    // Check ranges exclusively
    if (mass >= 1000 && mass < 100000) {
        return 820; // Delay for mass between 1k and 100k
    } else if (mass >= 100000 && mass < 230000) {
        return 824; // Delay for mass between 100k and 230k
    } else if (mass >= 230000 && mass < 400000) {
        return 829; // Delay for mass between 230k and 400k
    } else if (mass >= 400000 && mass < 4000000) {
        return 834; // Delay for mass between 400k and 4000k
    }
}

// Function to trigger key events
function triggerKey(keyCode, numOfTimes) {
    for (let i = 0; i < numOfTimes; i++) {
        const event = new KeyboardEvent('keydown', {
            keyCode: keyCode,
            which: keyCode,
        });
        window.dispatchEvent(event);
    }
}
