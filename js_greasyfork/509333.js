// ==UserScript==
// @name         virtualmanager.com - Show rating importance based on position
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.2
// @description  Important skills are highlighted with different colors to show their importance level (e.g., very high, high, medium, low, very low).
// @author       
// @match        https://www.virtualmanager.com/players/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualmanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509333/virtualmanagercom%20-%20Show%20rating%20importance%20based%20on%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/509333/virtualmanagercom%20-%20Show%20rating%20importance%20based%20on%20position.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the player's position from the document
    let positionElement = document.getElementsByClassName('position')[0];
    if (!positionElement) {
        console.error('Position element not found');
        return;
    }
    let position = positionElement.innerText;
    position = position.replace('Position', '').split(', ')[0].trim().toLowerCase();
    console.log(position);

    // Map of positions to their respective importance ratings and elements
    const positionImportanceMap = {
        'keeper': [
            { importance: 'Very high', element: 'Håndtering' },
            { importance: 'Very high', element: 'I luften' },
            { importance: 'Very high', element: 'Spring' },
            { importance: 'Very high', element: 'En mod en' },
            { importance: 'Medium', element: 'Hurtighed' },
            { importance: 'Medium', element: 'Acceleration' },
            { importance: 'Very low', element: 'Aflevering' },
            { importance: 'Very low', element: 'Udholdenhed' },
            { importance: 'Very low', element: 'Lederskab' },
            { importance: 'Very low', element: 'Kampånd' }
        ],
        'forsvar': [
            { importance: 'Very high', element: 'Tackling' },
            { importance: 'Medium', element: 'Hovedstød' },
            { importance: 'Medium', element: 'Positionering' },
            { importance: 'High', element: 'Hurtighed' },
            { importance: 'High', element: 'Acceleration' },
            { importance: 'Very low', element: 'Aflevering' },
            { importance: 'Very low', element: 'Dribling' },
            { importance: 'Very low', element: 'Afslutning' },
            { importance: 'Low', element: 'Lederskab' }
        ],
        'midtbane': [
            { importance: 'Very high', element: 'Aflevering' },
            { importance: 'Medium', element: 'Afslutning' },
            { importance: 'Very high', element: 'Dribling' },
            { importance: 'Very low', element: 'Tackling' },
            { importance: 'Very low', element: 'Dødboldsituationer' },
            { importance: 'Medium', element: 'Hurtighed' },
            { importance: 'Very low', element: 'Acceleration' },
            { importance: 'High', element: 'Udholdenhed' },
            { importance: 'Very low', element: 'Lederskab' },
            { importance: 'Medium', element: 'Kampånd' }
        ],
        'angreb': [
            { importance: 'Medium', element: 'Aflevering' },
            { importance: 'Very high', element: 'Afslutning' },
            { importance: 'Very high', element: 'Dribling' },
            { importance: 'Very low', element: 'Tackling' },
            { importance: 'Low', element: 'Dødboldsituationer' },
            { importance: 'High', element: 'Hurtighed' },
            { importance: 'High', element: 'Acceleration' },
            { importance: 'Very low', element: 'Udholdenhed' },
            { importance: 'Low', element: 'Lederskab' },
            { importance: 'Low', element: 'Kampånd' }
        ]
    };

    // Apply color based on importance for the current position
    if (positionImportanceMap[position]) {
        console.log(`Handling ${position} position`);
        positionImportanceMap[position].forEach(item => {
            ColorBasedOnImportance(item.importance, item.element);
        });
    } else {
        console.log('Unknown position');
    }
})();

// Function to apply color based on importance
function ColorBasedOnImportance(importance, element) {
    // Map of importance levels to their corresponding colors
    const colorMap = {
        'Very low': '#ffffffcc',  // rgb(255 255 255 / 80%)
        'Low': '#c0d7c030',       // rgb(192 215 192 / 48%)
        'Medium': 'rgb(0 169 0 / 32%)',    // rgb(116 167 116 / 48%)
        'High': 'rgb(0 213 0 / 59%)',      // rgb(60 187 60 / 48%)
        'Very high': 'rgb(0 213 0 / 91%)'  // rgb(0 141 0 / 48%)
    };

    // Get all elements with the class 'label'
    let labels = document.getElementsByClassName('label');
    // Get the color corresponding to the importance level
    let color = colorMap[importance] || '#ffffffcc';

    console.log('Importance: ' + importance);
    console.log('Element: ' + element);

    // Iterate over the labels to find the matching element
    for (let item of labels) {
        if (item.innerText === element) {
            // Apply the color as a box shadow to the parent element
            item.parentElement.style.boxShadow = 'inset 0px -10px 30px 0px ' + color;
            console.log(item.parentElement.style.boxShadow);
            break;
        }
    }
}