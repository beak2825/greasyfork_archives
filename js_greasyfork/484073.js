// ==UserScript==
// @name         kill counter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description script to display number of kills
// @author       Python Coder
// @match        https://shellshock.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484073/kill%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/484073/kill%20counter.meta.js
// ==/UserScript==

var egg_count = 0;
var target = 0;
var needed = 0;
var increment = 20;

function eggs() {
    const eggCountElement = document.querySelector('.egg_count');
    if (eggCountElement && eggCountElement.innerText) {
        const eggCount = parseInt(eggCountElement.innerText.trim());
        return isNaN(eggCount) ? 0 : eggCount;
    } else {
        return 0; // Return a default value if the element or its content is not found
    }
}

function targeted(defaultValue) {
    const userInput = prompt(`Enter a value (current is ${defaultValue}):`) || defaultValue;
    target = userInput;
    updateValues(); // Update values when the target changes
}

function calculation(egg_targeted, currentlyNoofEggs) {
    return Math.ceil((egg_targeted - currentlyNoofEggs) / increment);
}


function message(value) {
    const result = 'kills: ' + value;
    return result;
}

function updateValues() {
    egg_count = eggs();
    displayStyledBox('eggs: ' + egg_count, '50px', '150px');
    needed = calculation(target, egg_count);
    displayStyledBox(message(needed), '10px', '150px');
}


function displayStyledBox(message, top, right) {
    // Remove previous box if it exists
    const previousBox = document.getElementById('styled-box');
    if (previousBox) {
        previousBox.remove();
    }

    // Create a div element for the box
    const box = document.createElement('div');

    // Set styles for the box
    box.id = 'styled-box'; // Add an ID for easy identification
    box.style.position = 'fixed';
    box.style.top = top;
    box.style.right = right;
    box.style.transform = 'translateX(-50%)';
    box.style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; // Blue background with 80% opacity
    box.style.color = '#fff'; // White text color
    box.style.padding = '10px';
    box.style.borderRadius = '5px';
    box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Box shadow for a subtle effect
    box.style.zIndex = '9999'; // Set a high z-index value

    // Add content to the box (message)
    box.innerText = message;

    // Append the box to the body
    document.body.appendChild(box);
}


function createStyledButton(top, bottom) {
    // Create a button element
    const button = document.createElement('button');

    // Set styles for the button
    button.style.position = 'fixed';
    button.style.top = top;
    button.style.right = bottom;
    button.style.transform = 'translateX(-50%)';
    button.style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; // Matching blue background
    button.style.color = '#fff'; // White text color
    button.style.padding = '10px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999'; // Set a high z-index value

    // Add text to the button
    button.innerText = 'change target';

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        targeted(target);
    });

    // Append the button to the body
    document.body.appendChild(button);
}

(function() {
    'use strict';
    updateValues();
    createStyledButton('10px', '0px');
    // Remove setInterval since we're updating values dynamically
})();
