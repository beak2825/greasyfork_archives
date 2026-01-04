// ==UserScript==
// @name         t3.chat Temperature Slider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a dark-mode temperature slider on t3.chat that sets localStorage 'temperature' between 0 and 1.99 (default 0.6)
// @author       wearifulpoet
// @match        *://t3.chat/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529114/t3chat%20Temperature%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/529114/t3chat%20Temperature%20Slider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS for dark mode styling and centered slider thumb
    var style = document.createElement('style');
    style.textContent = `
    /* Container styling */
    #temp-slider-container {
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #333;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        color: white;
        font-family: sans-serif;
        display: flex;
        align-items: center;
    }
    /* Slider styling */
    #temp-slider-container input[type="range"] {
        -webkit-appearance: none;
        width: 150px;
        margin-left: 10px;
        background: transparent;
    }
    /* WebKit Thumb */
    #temp-slider-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #666;
        cursor: pointer;
        margin-top: -8px; /* Adjust to center the thumb */
    }
    /* WebKit Track */
    #temp-slider-container input[type="range"]::-webkit-slider-runnable-track {
        height: 5px;
        background: #555;
    }
    /* Firefox Thumb */
    #temp-slider-container input[type="range"]::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #666;
        cursor: pointer;
        margin-top: -8px; /* Adjust to center the thumb */
    }
    /* Firefox Track */
    #temp-slider-container input[type="range"]::-moz-range-track {
        height: 5px;
        background: #555;
    }
    `;
    document.head.appendChild(style);

    // Create the container for the slider
    var container = document.createElement('div');
    container.id = 'temp-slider-container';

    // Create a label for the temperature
    var label = document.createElement('span');
    label.textContent = 'Temperature: ';
    container.appendChild(label);

    // Create a span to display the current value
    var valueDisplay = document.createElement('span');
    valueDisplay.textContent = '1.0';
    container.appendChild(valueDisplay);

    // Create the slider element
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1.99';
    slider.step = '0.1';
    slider.value = '0.6';
    container.appendChild(slider);

    // Append the container to the body
    document.body.appendChild(container);

    // Set the initial local storage value for temperature
    localStorage.setItem('temperature', slider.value);

    // Update the display and local storage when the slider is moved
    slider.addEventListener('input', function() {
        var temp = slider.value;
        valueDisplay.textContent = temp;
        localStorage.setItem('temperature', temp);
    });
})();