// ==UserScript==
// @name         GreasyFork Count Script Items by Dynamic Categories
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Count how many items belong to dynamic categories based on script names, display it vertically with total count and smooth design
// @author       Mahmudul Hasan Shawon
// @license      MIT
// @match        https://greasyfork.org/en/users/1392874-mahmudul-hasan-shawon
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521428/GreasyFork%20Count%20Script%20Items%20by%20Dynamic%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/521428/GreasyFork%20Count%20Script%20Items%20by%20Dynamic%20Categories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize an empty dictionary to store categories and their counts
    const categories = {};

    // Select all <li> items in the list
    const listItems = document.querySelectorAll('#user-script-list li');

    // Loop through each <li> item and extract the script name
    listItems.forEach(item => {
        const scriptName = item.querySelector('.script-link').textContent.toLowerCase();

        // Extract the category from the script name (for simplicity, we use the first word)
        const category = scriptName.split(' ')[0]; // This uses the first word of the script name as the category

        // If the category doesn't exist in the dictionary, initialize it with 0
        if (!categories[category]) {
            categories[category] = 0;
        }

        // Increment the count for this category
        categories[category]++;
    });

    // Calculate the total number of items
    const totalItems = listItems.length;

    // Create a div to display the results visually
    const countDisplay = document.createElement('div');
    countDisplay.innerHTML = `
        <div class="count-header"><strong>Total Scripts: ${totalItems}</strong></div>
        <div class="category-list">
            ${Object.keys(categories)
                .map(category => `${capitalizeFirstLetter(category)}: ${categories[category]} items`)
                .join('<br>')}
        </div>
    `;

    // Style the count display
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        #category-count-display {
            position: fixed;
            top: 120px;
            right: 10px;
            background-color: #69247C;
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 16px;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
            max-width: 250px;
            width: auto;

            transition: all 0.3s ease;
            animation: slideIn 0.5s ease-out;
        }

        .count-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .category-list {
            font-size: 14px;
            line-height: 1.6;
        }

        .category-list br {
            margin-bottom: 5px;
        }

        #category-count-display:hover {
            background-color: rgba(0, 0, 0, 0.9);
            transform: scale(1.05);
        }

        /* Slide-in effect */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `);

    // Function to capitalize the first letter of each category
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Add the div to the page
    countDisplay.id = 'category-count-display';
    document.body.appendChild(countDisplay);
})();
