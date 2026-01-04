// ==UserScript==
// @name         Flickypedia helper
// @namespace    https://commons.wikimedia.org/wiki/User_talk:RoyZuo
// @version      1.031
// @description  Auto-fill titles and descriptions, and add a category to all, for flickypedia
// @author       Roy Zuo
// @license      CC BY-NC-SA 4.0 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
// @match        https://www.flickr.org/tools/flickypedia/prepare_info*
// @downloadURL https://update.greasyfork.org/scripts/532097/Flickypedia%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/532097/Flickypedia%20helper.meta.js
// ==/UserScript==
(function () {
    'use strict';
    window.addEventListener('load', () => {
        addFillButton();
        addCategoryButton();
    });

    // Function to add the 'Auto-Fill' button
    function addFillButton() {
        const button = createButton('Auto-Fill', 'top', '10%', 'right', '10%');
        button.addEventListener('click', autoFillForm);
        document.body.appendChild(button);
    }

    // Function to add the 'Add Category' button
    function addCategoryButton() {
        const button = createButton('Add Category', 'top', '20%', 'right', '10%');
        button.addEventListener('click', () => {
            const inputCategory = prompt('Enter a category to add:');
            if (!inputCategory) return;

            // Clean up the category string
            const category = stripCategory(inputCategory);

            // Find all category inputs and add the category
            document.querySelectorAll('.category_inputs .autocomplete input[type="text"]')
                .forEach(input => {
                    input.value = category;
                    input.dispatchEvent(new Event('input', { bubbles: true }));

                    const container = input.closest('.category_inputs');
                    const addButton = container?.querySelector('input.pink_button');
                    if (addButton) {
                        addButton.click();
                    }
                });
        });
        document.body.appendChild(button);
    }

    // Helper function to create a styled button
    function createButton(text, pos1, value1, pos2, value2) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            position: 'fixed',
            [pos1]: value1,
            [pos2]: value2,
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 9999
        });
        return button;
    }

    // Auto-fill form function
    function autoFillForm() {
        showWarning('Check all short captions!\nLong captions are cut off by […]');

        const photoBlocks = document.querySelectorAll('.photo');
        photoBlocks.forEach(block => {
            const photoId = getPhotoIdFromBlock(block);
            if (!photoId) return;

            const title = block.querySelector('.flickr_info dt:nth-child(3) + dd')?.textContent.trim();
            const description = block.querySelector('.flickr_info dt:nth-child(5) + dd')?.textContent.trim();

            const titleInput = block.querySelector(`#photo_${photoId}-title`);
            const descInput = block.querySelector(`#photo_${photoId}-short_caption`);

            if (titleInput && title) {
                titleInput.value = title;
            }
            if (descInput && description) {
                descInput.value = description;
            }
        });
    }

    // Get photo ID from a block
    function getPhotoIdFromBlock(block) {
        const dtList = block.querySelectorAll('.structured_data_preview dt');
        for (const dt of dtList) {
            if (dt.textContent.includes('flickr photo id')) {
                const dd = dt.nextElementSibling;
                return dd?.textContent.trim();
            }
        }
        return null;
    }

    // Strip "Category:", "[[Category:...]]", etc. to get just "Example"
    function stripCategory(inputCategory) {
        const regex = /\[*[:]*Category:([^\]|]+)\]*/i;
        const match = inputCategory.match(regex);
        return match ? match[1].trim() : inputCategory.trim();
    }

    // Function to show a temporary warning message
function showWarning(message) {
    const warning = document.createElement('div');
    warning.textContent = message;
    Object.assign(warning.style, {
        position: 'fixed',
        top: '35%',
        right: '5%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        backgroundColor: 'orange',
        color: 'black',
        fontSize: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 10000,
        whiteSpace: 'pre-line',
    });

    document.body.appendChild(warning);

    setTimeout(() => {
        warning.remove();
    }, 5000);
}

})();