// ==UserScript==
// @name         WhatBeatsRock Save Loader
// @namespace    http://violentmonkey.net/
// @version      3.0
// @description  Load saves for whatbeatsrock.com with pause functionality, adjustable wait time, file-based save selection, improved UI with padding, and edge-only dragging with scrollable middle
// @author       JoTheStupid
// @match        https://www.whatbeatsrock.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508318/WhatBeatsRock%20Save%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/508318/WhatBeatsRock%20Save%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let paused = false;
    let saveEntries = [];
    let index = 0;
    let isDragging = false;
    let dragStartX, dragStartY, startX, startY;

    // UI Styles
    const buttonStyle = `
        padding: 8px 16px;
        margin-top: 10px;
        background-color: #4CAF50;
        border: 2px solid #333;
        color: white;
        cursor: pointer;
        font-size: 14px;
        border-radius: 5px;
        text-align: center;
    `;
    const pauseButtonStyle = `
        padding: 8px 16px;
        margin-top: 10px;
        background-color: #f44336;
        border: 2px solid #333;
        color: white;
        cursor: pointer;
        font-size: 14px;
        border-radius: 5px;
        text-align: center;
    `;
    const containerStyle = `
        padding: 10px;
        background-color: white;
        border: 2px solid black;
        border-radius: 10px;
        position: fixed;
        top: 10px;
        right: 10px;
        width: 320px;
        height: 500px;
        z-index: 1000;
        resize: both;
        overflow: auto;
        min-width: 200px;
        min-height: 200px;
    `;
    const edgeThreshold = 10; // The distance from the edge in pixels to allow dragging

    // Create a container for input elements
    let container = document.createElement('div');
    container.style.cssText = containerStyle;
    document.body.appendChild(container);

    // Handle dragging the container (only from edges)
    container.addEventListener('mousedown', function (e) {
        const rect = container.getBoundingClientRect();
        const isEdge = e.clientX - rect.left < edgeThreshold ||
                       rect.right - e.clientX < edgeThreshold ||
                       e.clientY - rect.top < edgeThreshold ||
                       rect.bottom - e.clientY < edgeThreshold;

        if (isEdge) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startX = container.offsetLeft;
            startY = container.offsetTop;
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            let offsetX = e.clientX - dragStartX;
            let offsetY = e.clientY - dragStartY;
            container.style.left = startX + offsetX + 'px';
            container.style.top = startY + offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    // Create a file input for save file upload
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt';
    fileInput.style.width = '100%';
    fileInput.style.marginBottom = '10px';
    container.appendChild(fileInput);

    // Create a textbox for input
    let inputBox = document.createElement('textarea');
    inputBox.style.width = '100%';
    inputBox.style.height = '100px';
    inputBox.style.padding = '5px';
    inputBox.style.border = '1px solid #ccc';
    inputBox.style.borderRadius = '5px';
    inputBox.style.marginBottom = '10px';
    container.appendChild(inputBox);

    // Create a button to apply the save
    let enterSaveButton = document.createElement('button');
    enterSaveButton.innerHTML = 'Enter Save';
    enterSaveButton.style.cssText += buttonStyle;
    container.appendChild(enterSaveButton);

    // Create a pause/resume button
    let pauseButton = document.createElement('button');
    pauseButton.innerHTML = 'Pause';
    pauseButton.style.cssText += pauseButtonStyle;
    container.appendChild(pauseButton);

    pauseButton.addEventListener('click', () => {
        paused = !paused;
        pauseButton.innerHTML = paused ? 'Resume' : 'Pause';
        pauseButton.style.backgroundColor = paused ? '#f44336' : '#4CAF50';
        if (!paused) {
            processNextEntry();
        }
    });

    // Create a label for the slider
    let sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Wait Time (ms):';
    container.appendChild(sliderLabel);

    // Create a slider for wait time
    let waitTimeSlider = document.createElement('input');
    waitTimeSlider.type = 'range';
    waitTimeSlider.min = '100';
    waitTimeSlider.max = '3000';
    waitTimeSlider.value = '1000';
    waitTimeSlider.style.width = '100%';
    waitTimeSlider.style.marginBottom = '10px';
    container.appendChild(waitTimeSlider);

    // Display the current wait time
    let waitTimeDisplay = document.createElement('div');
    waitTimeDisplay.innerHTML = `Current wait time: ${waitTimeSlider.value} ms`;
    waitTimeDisplay.style.marginBottom = '10px';
    container.appendChild(waitTimeDisplay);

    // Create a div to show color-coded save options
    let saveListContainer = document.createElement('div');
    saveListContainer.style.width = '100%';
    saveListContainer.style.height = '150px';  // Set height and make it scrollable
    saveListContainer.style.overflowY = 'auto';  // Enable vertical scrolling for the save list
    saveListContainer.style.border = '1px solid #ccc';
    saveListContainer.style.borderRadius = '5px';
    container.appendChild(saveListContainer);

    // Color cycle for the saves
    const colors = ['red', 'orange', 'yellow', 'blue', 'purple'];

    // Handle file reading and populate the saveList with color-coded saves
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const saves = contents.split('\n').map(save => save.trim()).filter(save => save !== '');

                // Clear previous saves
                saveListContainer.innerHTML = '';

                // Populate the save list with color-coded clickable divs
                saves.forEach((save, idx) => {
                    let saveItem = document.createElement('div');
                    saveItem.textContent = save;
                    saveItem.style.cursor = 'pointer';
                    saveItem.style.padding = '5px';
                    saveItem.style.border = '1px solid black';
                    saveItem.style.marginBottom = '5px';
                    saveItem.style.backgroundColor = colors[idx % colors.length];  // Alternate colors

                    // Click to insert the save into the input box
                    saveItem.addEventListener('click', () => {
                        inputBox.value = save;
                    });

                    saveListContainer.appendChild(saveItem);
                });

                console.log('Saves loaded:', saves);
            };
            reader.readAsText(file);
        }
    });

    // Update the wait time display as the slider is moved
    waitTimeSlider.addEventListener('input', () => {
        waitTimeDisplay.innerHTML = `Current wait time: ${waitTimeSlider.value} ms`;
    });

    // Function to find the Next button
    function findNextButton() {
        return document.querySelector('button.py-4.px-8.border.border-1-black.text-lg');
    }

    // Function to simulate typing and clicking
    function simulateInput(input, callback) {
        if (paused) return;

        console.log(`Simulating input: ${input}`);
        let inputField = document.querySelector('.pl-4.py-4.text-lg.border.border-1-black');
        let submitButton = document.querySelector('.p-4.border.border-1-black.text-lg.bg-green-200, .p-4.border.border-1-black.text-lg.text-gray-400');

        if (inputField && submitButton) {
            inputField.focus();
            Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inputField, input);

            let inputEvent = new Event('input', { bubbles: true });
            let changeEvent = new Event('change', { bubbles: true });
            inputField.dispatchEvent(inputEvent);
            inputField.dispatchEvent(changeEvent);

            setTimeout(() => {
                submitButton.click();
                setTimeout(() => {
                    let nextButton = findNextButton();
                    if (nextButton) {
                        nextButton.click();  // Click the next button
                        setTimeout(callback, parseInt(waitTimeSlider.value));
                    } else {
                        console.log('Next button not found, retrying...');
                        setTimeout(() => simulateInput(input, callback), parseInt(waitTimeSlider.value));  // Retry if the next button is not found
                    }
                }, parseInt(waitTimeSlider.value));
            }, parseInt(waitTimeSlider.value));
        } else {
            console.log('Input field or submit button not found, retrying...');
            setTimeout(() => simulateInput(input, callback), parseInt(waitTimeSlider.value));
        }
    }

    // Function to enter the save from the input box and start processing it
    function enterSave() {
        let saveText = inputBox.value.trim();
        if (!saveText) {
            alert('Please enter a save');
            console.log('No save text entered.');
            return;
        }

        saveEntries = saveText.split('🤜').map(entry => entry.trim()).reverse();
        index = 0;
        processNextEntry();
    }

    function processNextEntry() {
        if (paused) return;

        if (index < saveEntries.length) {
            let currentInput = checkTextBoxForCurrentInput();
            let currentIndex = saveEntries.findIndex(entry => entry.toLowerCase() === currentInput.toLowerCase());

            if (currentIndex !== -1 && currentIndex + 1 < saveEntries.length) {
                console.log(`Current input is "${currentInput}". Inputting next entry: ${saveEntries[currentIndex + 1]}`);
                simulateInput(saveEntries[currentIndex + 1], () => {
                    index = currentIndex + 2;
                    processNextEntry();
                });
            } else {
                console.log(`Current input "${currentInput}" does not match any expected input. Retrying...`);
                setTimeout(processNextEntry, parseInt(waitTimeSlider.value));
            }
        } else {
            console.log('All entries processed.');
        }
    }

    function checkTextBoxForCurrentInput() {
        let currentInputElement = document.querySelector('.text-2xl.text-center');
        if (currentInputElement) {
            let currentInput = currentInputElement.textContent.trim();
            if (currentInput.endsWith('?')) {
                currentInput = currentInput.slice(0, -1);
            }
            return currentInput;
        }
        return null;
    }

    // Add the Enter Save button click event
    enterSaveButton.addEventListener('click', () => {
        console.log('Enter Save button clicked.');
        enterSave();
    });
})();
