// ==UserScript==
// @name         BETA - Neopets SDB Item Tagger
// @version      1.1
// @description  Tag Safety Deposit Box items on Neopets
// @author       Toothbrush
// @match        *://www.neopets.com/safetydeposit.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @namespace https://greasyfork.org/users/1315343
// @downloadURL https://update.greasyfork.org/scripts/497477/BETA%20-%20Neopets%20SDB%20Item%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/497477/BETA%20-%20Neopets%20SDB%20Item%20Tagger.meta.js
// ==/UserScript==

/**
 * 1.1: added dropdown menu for assigning tag colors
**/

(function() {
    'use strict';

    // Predefined colors for dropdown
    const colors = {
        'Red': '#e2bbb8',
        'Orange': '#f7d4ba',
        'Yellow': '#f5e8b0',
        'Green': '#bae0b1',
        'Cyan': '#b4edec',
        'Blue': '#b4d2ed',
        'Purple': '#d6bff2',
        'Pink': '#f4cbf5',
        'Grey': '#c4c2c4',
        'White': '#ffffff'
    };

    // Create a dropdown menu
    const colorDropdown = document.createElement('select');
    colorDropdown.innerHTML = '<option value="">Assign color to tag</option>';
    for (const [colorName, colorValue] of Object.entries(colors)) {
        const option = document.createElement('option');
        option.value = colorValue;
        option.textContent = colorName;
        colorDropdown.appendChild(option);
    }

    // Locate the search input field's parent row element
    const searchParentRow = document.querySelector('input[name="obj_name"]').closest('tr');

    // Create a new div to contain the dropdown
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.marginTop = '10px';
    dropdownContainer.style.marginLeft = '2px';

    // Insert the new div after the search parent row element
    searchParentRow.insertAdjacentElement('afterend', dropdownContainer);

    // Move the dropdown menu into the new div
    dropdownContainer.appendChild(colorDropdown);


    // Select all item rows
    const itemRows = document.querySelectorAll('tr[bgcolor="#F6F6F6"], tr[bgcolor="#FFFFFF"], tr[bgcolor="#DFEAF7"]');

    // Function to initialize tagging functionality for an item
    function initializeItemTagging(itemRow) {
        const nameCell = itemRow.querySelector('td:nth-child(2)');
        let inputField, addButton, removeButton;

        // Check if tag exists in local storage
        const itemName = nameCell.textContent.trim();
        const savedTag = GM_getValue(itemName);

        // Create Add Tag button
        addButton = document.createElement('button');
        addButton.textContent = 'Add Tag';
        addButton.style.marginLeft = '5px';
        addButton.style.marginTop = '5px';
        addButton.style.display = savedTag ? 'none' : 'inline-block';

        // Event listener for Add Tag button
        addButton.addEventListener('click', function(event) {
            event.preventDefault();
            addButton.style.display = 'none';
            inputField.style.display = 'block';
            inputField.focus();
        });

        // Create input field for tagging
        inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Enter tag';
        inputField.style.width = '100px';
        inputField.style.marginTop = '5px';
        inputField.style.display = 'none';
        inputField.style.marginLeft = '5px';

        // Event listener for input field
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const tag = inputField.value.trim();
                if (tag !== '') {
                    addTag(itemRow, tag);
                    GM_setValue(itemName, tag);
                    addStoredTag(tag);
                    inputField.value = '';
                    inputField.style.display = 'none';
                    addButton.style.display = 'none';
                    addRemoveButton(itemRow, tag);
                }
            }
        });

        // Create remove button for the tag
        removeButton = document.createElement('span');
        removeButton.textContent = 'x';
        removeButton.style.cursor = 'pointer';
        removeButton.style.marginLeft = '5px';
        removeButton.style.display = savedTag ? 'inline-block' : 'none';

        // Event listener for remove button
        removeButton.addEventListener('click', function() {
            const tagSpan = nameCell.querySelector('.tag');
            if (tagSpan) {
                tagSpan.remove();
            }
            removeButton.remove();
            GM_setValue(itemName, '');
            addButton.style.display = 'inline-block';
            inputField.style.display = 'none';
        });

        // Append line break only for wearables
        if (itemRow.getAttribute('bgcolor') === '#DFEAF7') {
            nameCell.appendChild(document.createElement('br'));
        }

        // Append elements to item name cell
        nameCell.appendChild(addButton);
        nameCell.appendChild(inputField);
        if (savedTag) {
            addTag(itemRow, savedTag);
            nameCell.appendChild(removeButton);
        }
    }

    // Function to add a tag next to the item name
    function addTag(itemRow, tag) {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = '⌦ ' + tag;
        tagSpan.style.marginLeft = '5px';
        tagSpan.style.marginTop = '5px';
        tagSpan.classList.add('tag');

        // Default to white background if no predefined color
        tagSpan.style.backgroundColor = GM_getValue('tagColor_' + tag, '#ffffff');
        tagSpan.style.border = '1px solid #000435';
        tagSpan.style.padding = '2px 5px';
        tagSpan.style.display = 'inline-flex';
        tagSpan.style.alignItems = 'center';
        tagSpan.style.justifyContent = 'center';
        tagSpan.style.borderRadius = '5px';
        itemRow.querySelector('td:nth-child(2)').appendChild(tagSpan);
    }

    // Function to add a stored tag to the list
    function addStoredTag(tag) {
        let storedTags = GM_getValue('storedTags', []);
        if (!storedTags.includes(tag)) {
            storedTags.push(tag);
            GM_setValue('storedTags', storedTags);
        }
    }

    // Event listener for the color dropdown
    if (colorDropdown) {
        colorDropdown.addEventListener('change', function() {
            const selectedColor = colorDropdown.value;
            const storedTags = GM_getValue('storedTags', []);
            const selectedTag = prompt('Enter the tag to assign this color to:');

            if (selectedTag && storedTags.includes(selectedTag)) {
                GM_setValue('tagColor_' + selectedTag, selectedColor);
                document.querySelectorAll('.tag').forEach(tagSpan => {
                    if (tagSpan.textContent.includes(selectedTag)) {
                        tagSpan.style.backgroundColor = selectedColor;
                    }
                });
            }
            colorDropdown.value = ''; // Reset dropdown after selection
        });
    }

    // Function to add remove button next to the tag
    function addRemoveButton(itemRow, tag) {
        const nameCell = itemRow.querySelector('td:nth-child(2)');
        const removeButton = document.createElement('span');
        removeButton.textContent = 'x';
        removeButton.style.cursor = 'pointer';
        removeButton.style.marginLeft = '5px';
        removeButton.addEventListener('click', function() {
            const tagSpan = nameCell.querySelector('.tag');
            if (tagSpan) {
                tagSpan.remove();
            }
            removeButton.remove();
            GM_setValue(nameCell.textContent.trim(), '');
        });
        nameCell.appendChild(removeButton);
    }

    // Function to initialize tagging functionality for all items
    function initializeTagging() {
        itemRows.forEach(function(itemRow) {
            initializeItemTagging(itemRow);
        });
    }

    // Call the initialization function
    initializeTagging();
})();
