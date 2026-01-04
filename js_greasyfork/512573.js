// ==UserScript==
// @name         Drawaria Add More Medals
// @namespace    http://tampermonkey.net/
// @version      2024-10-14
// @description  Add more medals to your drawaria account.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512573/Drawaria%20Add%20More%20Medals.user.js
// @updateURL https://update.greasyfork.org/scripts/512573/Drawaria%20Add%20More%20Medals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the numbers of the medals
    function changeMedalNumbers(medalIndex) {
        // Select the elements that contain the numbers of the medals
        const medalElements = document.querySelectorAll('td[colspan="2"] div[style*="display: flex; justify-content: space-evenly;"] span div');

        // Verify if the elements were found
        if (medalElements.length === 3) {
            // Change the number of the corresponding medal
            const newValue = prompt(`Enter the new value for the ${medalIndex === 0 ? 'gold' : medalIndex === 1 ? 'silver' : 'bronze'} medal:`);
            if (newValue !== null) {
                medalElements[medalIndex].textContent = newValue;
            }
        } else {
            console.error('Medal elements not found.');
        }
    }

    // Function to add buttons below the medal quantities
    function addButtons() {
        // Select the medal container
        const medalContainer = document.querySelector('td[colspan="2"] div[style*="display: flex; justify-content: space-evenly;"]');

        // Create the buttons
        const goldButton = document.createElement('button');
        goldButton.textContent = 'Change Gold';
        goldButton.style.marginRight = '10px';
        goldButton.style.padding = '5px 10px';
        goldButton.style.backgroundColor = '#FEE101';
        goldButton.style.color = '#000';
        goldButton.style.border = 'none';
        goldButton.style.borderRadius = '5px';
        goldButton.style.cursor = 'pointer';

        const silverButton = document.createElement('button');
        silverButton.textContent = 'Change Silver';
        silverButton.style.marginRight = '10px';
        silverButton.style.padding = '5px 10px';
        silverButton.style.backgroundColor = '#D7D7D7';
        silverButton.style.color = '#000';
        silverButton.style.border = 'none';
        silverButton.style.borderRadius = '5px';
        silverButton.style.cursor = 'pointer';

        const bronzeButton = document.createElement('button');
        bronzeButton.textContent = 'Change Bronze';
        bronzeButton.style.padding = '5px 10px';
        bronzeButton.style.backgroundColor = '#cd7f32';
        bronzeButton.style.color = '#000';
        bronzeButton.style.border = 'none';
        bronzeButton.style.borderRadius = '5px';
        bronzeButton.style.cursor = 'pointer';

        // Add the buttons below the medal quantities
        medalContainer.insertAdjacentElement('afterend', bronzeButton);
        medalContainer.insertAdjacentElement('afterend', silverButton);
        medalContainer.insertAdjacentElement('afterend', goldButton);


        // Add events to the buttons
        goldButton.addEventListener('click', () => changeMedalNumbers(0));
        silverButton.addEventListener('click', () => changeMedalNumbers(1));
        bronzeButton.addEventListener('click', () => changeMedalNumbers(2));
    }

    // Function to observe changes in the DOM and add the buttons when the medal container is available
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const medalContainer = document.querySelector('td[colspan="2"] div[style*="display: flex; justify-content: space-evenly;"]');
                    if (medalContainer) {
                        addButtons();
                        observer.disconnect(); // Stop observing once the buttons have been added
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing the DOM
    observeDOM();
})();