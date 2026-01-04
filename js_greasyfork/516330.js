// ==UserScript==
// @name         Prime opinion client
// @namespace    http://tampermonkey.net/
// @version      v2
// @description  some features, ctrl + alt + x for menu
// @author       Gosh227
// @match        http://*/*
// @match        https://primeopinion.com/*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516330/Prime%20opinion%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/516330/Prime%20opinion%20client.meta.js
// ==/UserScript==
// hello
(function() {
    'use strict';

    let menuVisible = false;

    // Function to create a settings menu
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = 'enhancer-menu';
        menu.style.position = 'fixed';
        menu.style.top = '10px';
        menu.style.right = '10px';
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '10px';
        menu.style.zIndex = '1000';
        menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        menu.style.display = 'none'; // Initially hidden

        const title = document.createElement('h3');
        title.innerText = 'Survey Enhancer Settings';
        menu.appendChild(title);

        // Add sorting option
        const sortLabel = document.createElement('label');
        sortLabel.innerText = 'Sort by: ';

        const sortSelect = document.createElement('select');
        const option1 = document.createElement('option');
        option1.value = 'default';
        option1.innerText = 'Default';

        const option2 = document.createElement('option');
        option2.value = 'ratings';
        option2.innerText = 'Ratings';

        sortSelect.appendChild(option1);
        sortSelect.appendChild(option2);

        sortSelect.addEventListener('change', function() {
            if (this.value === 'ratings') {
                sortSurveysByRatings();
            } else {
                // Reset to default sorting
                location.reload();
            }
        });

        menu.appendChild(sortLabel);
        menu.appendChild(sortSelect);

        // Add visual customization options
        const colorLabel = document.createElement('label');
        colorLabel.innerText = 'Background Color: ';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#ffffff'; // Default white

        colorInput.addEventListener('input', function() {
            document.body.style.backgroundColor = this.value;
        });

        menu.appendChild(colorLabel);
        menu.appendChild(colorInput);

        document.body.appendChild(menu);
    }

    // Function to sort surveys by ratings (placeholder logic)
    function sortSurveysByRatings() {
        // Implement sorting logic based on ratings
        // This is a placeholder; you will need to adjust based on the actual survey elements
        const surveys = Array.from(document.querySelectorAll('.survey-item')); // Adjust selector
        surveys.sort((a, b) => {
            const ratingA = parseFloat(a.querySelector('.rating').innerText); // Adjust selector
            const ratingB = parseFloat(b.querySelector('.rating').innerText); // Adjust selector
            return ratingB - ratingA; // Sort descending
        });

        const surveyContainer = document.querySelector('.survey-container'); // Adjust selector
        surveyContainer.innerHTML = ''; // Clear existing surveys
        surveys.forEach(survey => surveyContainer.appendChild(survey)); // Append sorted surveys
    }

    // Function to toggle the settings menu
    function toggleMenu() {
        const menu = document.getElementById('enhancer-menu');
        menuVisible = !menuVisible;
        menu.style.display = menuVisible ? 'block' : 'none';
    }

    // Event listener for keyboard shortcut
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'x') {
            toggleMenu();
        }
    });

    // Call the function to create the settings menu
    createSettingsMenu();

})();