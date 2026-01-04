// ==UserScript==
// @name        Predefined Snippets for FormControlName Textarea - Dynamic Enums on Specific Page 2
// @namespace   Violentmonkey Scripts
// @match       https://crm.tapnz.co.nz/aurora/loat-v2/client/*/advice-process/*/risk-analysis/*
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.2
// @author      The Ghost
// @license     MIT
// @description Dynamically insert predefined snippets into a textarea identified by formControlName with enhanced UI based on enum selection on a specific page.
// @downloadURL https://update.greasyfork.org/scripts/491674/Predefined%20Snippets%20for%20FormControlName%20Textarea%20-%20Dynamic%20Enums%20on%20Specific%20Page%202.user.js
// @updateURL https://update.greasyfork.org/scripts/491674/Predefined%20Snippets%20for%20FormControlName%20Textarea%20-%20Dynamic%20Enums%20on%20Specific%20Page%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Enum options

    let savedSnippets = {
        'Goals': ['Snippet 1 for Goals', 'Snippet2 for  Goals'], // goals
        'Life': ['Snippet 1 for Life', 'Snippet2 for  Life'], // life
        'Disability': ['Snippet 1 for FAQ', 'Snippet 2 for FAQ'], // critical-illness
        'TPD': ['Snippet 1 for FAQ', 'Snippet 2 for FAQ'], // tpd
        'Medical': ['Snippet 1 for FAQ', 'Snippet 2 for FAQ'], // medical
        'Critical Illness': ['Snippet 1 for FAQ', 'Snippet 2 for FAQ'], // critical-illness
    };

    async function loadSavedSnippets() {
        const storedSnippets = await GM.getValue('savedSnippets', {});

        // Ensure all predefined options are present, even if storedSnippets exist
        Object.keys(savedSnippets).forEach(key => {
            if (storedSnippets[key]) {
                savedSnippets[key] = [...new Set([...savedSnippets[key], ...storedSnippets[key]])];
            }
        });

        // Add any additional keys from storedSnippets that aren't in the predefined list
        Object.keys(storedSnippets).forEach(key => {
            if (!savedSnippets.hasOwnProperty(key)) {
                savedSnippets[key] = storedSnippets[key];
            }
        });

        await GM.setValue('savedSnippets', savedSnippets); // Update storage to reflect the merged structure



        const observer = new MutationObserver((mutations, obs) => {
            const textarea = document.querySelector('textarea[formcontrolname="notes"]');
            if (textarea) {
                createUI();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }




    function insertAtCursor(textarea, text) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, startPos) + text + textarea.value.substring(endPos, textarea.value.length);
        textarea.focus();
        textarea.selectionStart = startPos + text.length;
        textarea.selectionEnd = startPos + text.length;
    }

    function updateSnippetUI(selectedEnum) {
        const snippetTable = document.getElementById('snippetTable');
        snippetTable.style.fontSize = '12px'; // Smaller font size
        snippetTable.style.width = '100%'; // Adjust width as needed

        snippetTable.innerHTML = ''; // Clear existing snippets

        // Create table body
        const tbody = document.createElement('tbody');
        snippetTable.appendChild(tbody);

        savedSnippets[selectedEnum].forEach((snippetText, index) => {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.className = 'ml-1';
            cell.textContent = snippetText;
            cell.addEventListener('click', function () {
                this.innerHTML = ''; // Clear cell content

                // Create and setup the textbox for editing
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.className = 'form-control'; // Bootstrap class, adjust as needed
                editInput.value = snippetText;
                this.appendChild(editInput);
                editInput.focus();

                // Save button for changes
                const saveEditBtn = document.createElement('button');
                saveEditBtn.textContent = 'Save';
                saveEditBtn.className = "btn btn-primary btn-sm ml-2"; // Adjust styling as needed
                this.appendChild(saveEditBtn);

                // Save changes on click
                saveEditBtn.addEventListener('click', function () {
                    const updatedText = editInput.value;
                    updateSnippetText(selectedEnum, snippetText, updatedText, index);
                });

                // Optionally: Save changes on Enter key press in the editInput
                editInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        saveEditBtn.click();
                    }
                });
            });

            // Create a cell for buttons
            const buttonCell = row.insertCell();

            // Create and append the "Insert" button
            const addButton = document.createElement('button');
            addButton.innerHTML = 'Insert'; // Adjust if using icons
            addButton.className = "tap-btn tap-btn-outline tap-btn--shadow px-2 border-0"; // Adjusted padding for closer buttons
            addButton.onclick = () => {
                const textarea = document.querySelector('textarea[formcontrolname="notes"]');
                if (textarea) {
                    insertAtCursor(textarea, snippetText);
                }
            };
            buttonCell.appendChild(addButton); // Append "Insert" button to the button cell

            // Create and append the "Delete" button
            const deleteButton = document.createElement('button');
            deleteButton.className = "icon-btn w-auto h-auto px-1 d-flex"; // Bootstrap classes for styling
            // After creating addButton and deleteButton
            addButton.style.display = 'inline-flex'; // Use 'inline-flex' if you want to keep the flexbox features for the content
            deleteButton.style.display = 'inline-flex';
            addButton.style.marginRight = '5px'; // Add some space between buttons

            // Create the Material Icons element for the "Delete" button
            const icon = document.createElement('i');
            icon.className = "material-icons md-16"; // Class for Material Icons with a specific size
            icon.textContent = 'delete'; // Icon text
            deleteButton.appendChild(icon); // Append the icon to the "Delete" button
            buttonCell.style.display = 'flex';
            buttonCell.style.alignItems = 'center'; // Align items vertically in the center

            deleteButton.onclick = () => {
                if (confirm(`Are you sure you want to delete this snippet: "${snippetText}"?`)) {
                    deleteSnippet(selectedEnum, snippetText);
                }
            };
            buttonCell.appendChild(deleteButton); // Append "Delete" button next to the "Insert" button
        });
    }

    function updateSnippetText(enumKey, oldText, newText, snippetIndex) {
        if (oldText === newText) {
            updateSnippetUI(enumKey);
            return;
        }

        // Update the specific snippet text
        savedSnippets[enumKey][snippetIndex] = newText;

        // Persist the updated object
        GM.setValue('savedSnippets', savedSnippets)
            .then(() => {
                updateSnippetUI(enumKey); // Refresh the UI to reflect the updated snippet
            })
            .catch(error => {
                console.error("Error updating snippet:", error);
            });
    }


    function saveSnippet(enumKey, snippetText) {
        if (!savedSnippets.hasOwnProperty(enumKey) || !Array.isArray(savedSnippets[enumKey])) {
            savedSnippets[enumKey] = [];
        }

        savedSnippets[enumKey].push(snippetText);

        // Don't forget to persist the updated object
        GM.setValue('savedSnippets', savedSnippets)
            .then(() => {
                updateSnippetUI(enumKey);
                alert(`Snippet "${snippetText}" saved for ${enumKey}`);
            })
            .catch(error => {
                console.error("Error saving snippets:", error);
            });
    }

    function deleteSnippet(enumKey, snippetText) {
        savedSnippets[enumKey] = savedSnippets[enumKey].filter(snippet => snippet !== snippetText);

        // Persist the updated object
        GM.setValue('savedSnippets', savedSnippets)
            .then(() => {
                updateSnippetUI(enumKey);
            })
            .catch(error => {
                console.error("Error deleting snippet:", error);
            });
    }




    function createUI() {
        if (document.getElementById('enumDropdown')) return;

        console.log("Creating UI with savedSnippets:", savedSnippets);

        const uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';

        const enumDropdown = document.createElement('select');
        enumDropdown.className = "crt-form-control form-control ng-touched ng-pristine ng-valid";
        enumDropdown.id = 'enumDropdown';
        Object.keys(savedSnippets).forEach(option => {
            const enumOption = document.createElement('option');
            enumOption.value = option;
            enumOption.textContent = option;
            enumDropdown.appendChild(enumOption);
        });



        enumDropdown.addEventListener('change', () => updateSnippetUI(enumDropdown.value));

        const snippetTable = document.createElement('table');
        snippetTable.id = 'snippetTable';
        snippetTable.className = "table";

        const snippetCreationContainer = document.createElement('div');
        snippetCreationContainer.id = 'snippetCreationContainer';
        snippetCreationContainer.className = 'snippet-creation-container';
        snippetCreationContainer.style.marginTop = '20px'; // Adjust the top margin to ensure no overlap

        // Create a label for the snippet creation section
        const snippetCreationLabel = document.createElement('label');
        snippetCreationLabel.textContent = 'Category';
        snippetCreationLabel.style.display = 'block'; // Ensure the label appears above the input and buttons
        snippetCreationLabel.style.marginBottom = '10px'; // Space between the label and the input

        // Add the label to the container
        snippetCreationContainer.appendChild(snippetCreationLabel);

        // Button for adding new enum/category
        const addEnumButton = document.createElement('button');
        addEnumButton.textContent = 'Add New Category';
        addEnumButton.title = 'Add new category';
        addEnumButton.style.marginLeft = '5px';
        addEnumButton.marginTop = '10px';
        addEnumButton.className = "tap-btn tap-btn-outline tap-btn--shadow px-4 border-0 col-auto ml-2 ng-star-inserted mg-5";
        addEnumButton.onclick = addNewEnum; // Make sure to define addNewEnum function

        // Save button for saving new snippet
        const saveButton = document.createElement('button');
        saveButton.className = "tap-btn tap-btn-outline tap-btn--shadow px-4 border-0 col-auto ml-2 ng-star-inserted";
        saveButton.textContent = 'Save New Snippet';
        saveButton.marginTop = '10px';
        saveButton.onclick = () => saveSnippet(enumDropdown.value, snippetInput.value); // Ensure saveSnippet function is defined

        // Input for entering custom snippet text
        const snippetInput = document.createElement('input');
        snippetInput.id = 'snippetInput';
        snippetInput.type = 'text'; // Changed from 'textarea' to 'text' as <input> doesn't support 'textarea' type
        snippetInput.placeholder = 'Enter custom snippet';
        snippetInput.className = "form-control crt-form-control ng-pristine ng-valid ng-touched";
        snippetInput.height = "auto";

        // Add the input field and buttons to the container
        snippetCreationContainer.appendChild(snippetInput);
        snippetCreationContainer.appendChild(addEnumButton);
        snippetCreationContainer.appendChild(saveButton);

        // Append the entire snippet creation container to a specific element in the DOM
        // For example, to add it to the body:

        // Appending elements
        uiContainer.appendChild(snippetTable);
        uiContainer.appendChild(snippetCreationContainer);
        uiContainer.appendChild(enumDropdown);
        uiContainer.appendChild(snippetInput);
        uiContainer.appendChild(saveButton);
        uiContainer.appendChild(addEnumButton);

        const textarea = document.querySelector('textarea[formcontrolname="notes"]');

        textarea.parentNode.insertBefore(uiContainer, textarea.nextSibling);

        initializeUIWithCategory();
    }

    function addNewEnum() {
        const newEnumName = prompt('Enter the name for the new category:');
        if (newEnumName) {
            // Avoid adding duplicates or empty names
            if (!savedSnippets.hasOwnProperty(newEnumName.trim()) && newEnumName.trim().length > 0) {
                savedSnippets[newEnumName] = []; // Initialize the new enum with an empty array
                GM.setValue('savedSnippets', savedSnippets) // Persist the updated savedSnippets
                    .then(() => {
                        // Update the UI to include the new enum
                        updateEnumDropdown();
                        updateSnippetUI(newEnumName); // Update the snippet UI to reflect the new selection (optional)
                    })
                    .catch(error => console.error("Add new category:", error));
            } else {
                alert('This category already exists or the name is invalid.');
            }
        }
    }

    function updateEnumDropdown() {
        const enumDropdown = document.getElementById('enumDropdown');
        enumDropdown.innerHTML = ''; // Clear existing options
        Object.keys(savedSnippets).forEach(option => {
            const enumOption = document.createElement('option');
            enumOption.value = option;
            enumOption.textContent = option;
            enumDropdown.appendChild(enumOption);
        });
    }

    loadSavedSnippets();

    function getDefaultCategoryFromURL() {
        // Get the current URL's pathname
        const path = window.location.pathname;
        // Extract the last part of the URL
        const lastPart = path.substring(path.lastIndexOf('/') + 1);
        // Make it lowercase and replace spaces with "-"
        console.log("savedSnippets at initialization:", savedSnippets);
        console.log(lastPart.toLowerCase().replace(/\s+/g, '-'));
        return lastPart.toLowerCase().replace(/\s+/g, '-');
    }
    
    function initializeUIWithCategory() {
        const defaultCategory = getDefaultCategoryFromURL().toLowerCase(); // Convert to lowercase
    
        // Find a matching category in savedSnippets, regardless of case
        const matchingCategoryKey = Object.keys(savedSnippets).find(
            key => key.toLowerCase() === defaultCategory
        );
        console.log("Matching category key:", matchingCategoryKey);

    
        if (matchingCategoryKey) {
            // Use the matching category to initialize the UI
            updateSnippetUI(matchingCategoryKey);
        } else {
            // Fallback: Initialize UI with the first enum option's snippets if no matching category
            if (Object.keys(savedSnippets).length > 0) {
                updateSnippetUI(Object.keys(savedSnippets)[0]);
            }
        }
    }
    
})();