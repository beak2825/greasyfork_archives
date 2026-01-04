// ==UserScript==
// @name         [KPX] Gym disable training buttons
// @namespace    https://cartelempire.online/
// @version      0.3
// @description  Adds a Enabled/Disabled button for Gym Trains
// @author       KPCX
// @match        https://cartelempire.online/Gym
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489052/%5BKPX%5D%20Gym%20disable%20training%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/489052/%5BKPX%5D%20Gym%20disable%20training%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the waitForElements function
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Use the waitForElements function
    waitForElements('form[action^="/gym/train/"]', 200, 50, 'TrainButton')
        .then(forms => {
        forms.forEach((form, index) => {
            // Create a new button
            let toggleButton = document.createElement('button');
            toggleButton.textContent = 'Enabled';
            toggleButton.type = 'button'; // Prevent it from submitting the form
            toggleButton.className = 'btn btn-outline-dark mt-2'; // Add some styling
            toggleButton.style.backgroundColor = 'rgba(33, 37, 41, 1)'; // Set initial background color
            toggleButton.style.color = 'rgb(25, 135, 84)'; // Set initial text color

            // Load the state from localStorage
            let state = localStorage.getItem('toggleState' + index);
            if (state === 'Disabled') {
                toggleButton.textContent = 'Disabled';
                toggleButton.style.color = 'rgb(220, 53, 69)'; // Red color when disabled
                form.querySelector('input[type="submit"]').disabled = true;
            }

            // Add an event listener to the new button
            toggleButton.addEventListener('click', function() {
                // Get the "Train" button
                let trainButton = form.querySelector('input[type="submit"]');

                // Toggle the disabled state of the "Train" button
                trainButton.disabled = !trainButton.disabled;

                // Update the text and color of the new button
                if (trainButton.disabled) {
                    toggleButton.textContent = 'Disabled';
                    toggleButton.style.color = 'rgb(220, 53, 69)'; // Red color when disabled
                } else {
                    toggleButton.textContent = 'Enabled';
                    toggleButton.style.color = 'rgb(25, 135, 84)'; // Green color when enabled
                }

                // Save the state to localStorage
                localStorage.setItem('toggleState' + index, toggleButton.textContent);
            });

            // Add the new button to the parent container of the form
            form.parentNode.appendChild(toggleButton);
        });
    })
        .catch(error => console.error(error));
})();