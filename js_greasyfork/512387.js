// ==UserScript==
// @name         NovelAI Prompt Composer and Tag Manager
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Enhances NovelAI image generation with a prompt composer. Allows saving, categorizing, and quickly toggling common prompt elements.
// @author       ManuMonkey
// @license      MIT
// @match        http*://novelai.net/image
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/512387/NovelAI%20Prompt%20Composer%20and%20Tag%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/512387/NovelAI%20Prompt%20Composer%20and%20Tag%20Manager.meta.js
// ==/UserScript==

/*
User Guide:
1. Click the "Compose Prompt" button to open the Prompt Composer.
2. Manage your categories and tags.
3. Use checkboxes to toggle tags on/off.
4. Click "Generate Prompt" to create your prompt.
*/

const promptComposerCSS = `
.prompt-composer-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f9f9f9;
    padding: 20px;
    border: 2px solid #333;
    border-radius: 10px;
    z-index: 9999999999;
    width: 600px;
    height: 80vh;
    display: flex;
    flex-direction: column;
    color: #333;
}

/* Fix header and footer positions */
.prompt-composer-title,
.button-container,
.bottom-buttons-container {
    flex-shrink: 0;
}

/* Make middle content one scrollable block */
.modal-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

/* Remove individual scroll areas */
.character-list,
.character-panel {
    max-height: none;
    overflow: visible;
}

/* Ensure bottom buttons stay visible */
.bottom-buttons-container {
    margin-top: 20px;
    padding-top: 20px;
    background-color: #f9f9f9;
    border-top: 1px solid #eee;
}

@media screen and (min-width: 1200px) {
    .prompt-composer-modal {
        width: 1000px;
    }
}

.prompt-composer-title {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: flex-start;
}

.prompt-set-controls {
    display: flex;
    gap: 10px;
    margin-left: auto; /* Push to the right */
    flex-wrap: wrap;
}

.toggle-button {
    position: relative;
    width: 32px;  /* Make buttons square */
    height: 32px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-button::before {
    content: attr(data-full-text);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    white-space: nowrap;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10000;
}

.toggle-button:hover::before {
    visibility: visible;
    opacity: 1;
}

.toggle-button:active {
    background-color: #444;
}

.category-container {
    margin-bottom: 15px;
}

.category-label {
    font-weight: bold;
    color: #333;
    margin-right: auto; /* Push gender selector to the right */
    white-space: nowrap; /* Prevent character label from wrapping */
}

.checkbox-container {
    width: 100%; /* Take full width of section */
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.checkbox-label {
    color: #333;
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: 10px;
}

.checkbox-input {
    margin-right: 5px;
}

.weight-display {
    font-size: 0.8em;
    color: #666;
}

.weight-control {
    display: none;
    align-items: center;
    margin-left: 5px;
}

.weight-input {
    width: 40px;
    margin: 0 5px;
    padding:2px 0px 2px 9px;
}

.weight-button {
    padding: 0 5px;
}

.delete-button {
    margin-left: 5px;
    padding: 0px 5px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    background-color: #ff4d4d;
    color: #fff;
    display: none;
}

.add-tag-container {
    display: none;
    margin-top: 10px;
    align-items: center;
}

.add-tag-input {
    flex-grow: 1;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #333;
    margin-right: 10px;
}

.add-tag-button {
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #333;
    color: #fff;
    white-space: nowrap;
}

.tag-textarea {
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
    padding: 5px;
}

.generate-button, .close-button {
    color: #333;
    background-color: rgb(108, 245, 74);
    font-size: medium;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 48%; /* Make buttons take up almost half the width each */
}

.generate-button:hover, .close-button:hover {
    /* background-color: #87e43b; */
}

.close-button {
    background-color: #ccc;
}

.compose-prompt-button {
    color: #333;
    background-color: rgb(246, 245, 244);
    font-size: small;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.compose-prompt-button:hover {
    background-color: #e6e6e6;
}

.add-category-container {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
}

.add-category-input {
    flex-grow: 1;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #333;
    margin-right: 10px;
}

.add-category-button {
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #333;
    color: #fff;
    white-space: nowrap;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.category-management-buttons {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.delete-category-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    margin-left: 10px;
}

.delete-category-button:hover {
    background-color: #ff3333;
}

.delete-category-button:active {
    background-color: #e60000;
}

.move-category-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    margin-right: 5px;
}

.move-category-button:hover {
    background-color: #45a049;
}

.move-category-button {
    width: auto;
    height: auto;
    border-radius: 5px;
    padding: 5px 8px;
}

.category-management {
    margin-bottom: 15px;
    border-top: 1px solid #ccc;
    padding-top: 15px;
}

.bottom-buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

@media screen and (min-width: 1200px) {
    .prompt-composer-modal {
        width: 1000px; /* Increased width for larger screens */
    }

    .categories-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .category-container {
        width: 48%; /* Slightly less than 50% to account for margins */
    }
}

.categories-container {
}

.character-label {
    font-weight: bold;
    color: #333;
    margin-right: auto; /* This pushes the delete button to the right */
}

.character-header {
    display: flex;
    align-items: center;
    padding: 5px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
}

.gender-selector {
    display: flex;
    gap: 12px;
    margin-left: auto;
    margin-right: 15px;
    white-space: nowrap; /* Prevent wrapping */
    flex-shrink: 0; /* Prevent the gender selector from shrinking */
}

.gender-selector label {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #333;
    cursor: pointer;
    white-space: nowrap; /* Ensure labels don't wrap */
}

.tag-section h5 {
    color: #333;
    margin-top: 8px;
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.character-manager-container h4 {
    color: #333;
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.character-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    align-items: stretch; /* Make all panels stretch to match the tallest */
}

.character-panel {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    width: 100%; /* Ensure panel takes full width of its grid cell */
}

.tag-sections {
    flex: 1; /* Allow tag sections to grow */
    overflow-y: auto;
    width: 100%; /* Take full width of panel */
}

.tag-section {
    width: 100%; /* Take full width of container */
}

.character-manager-container {
    margin-top: 5px;
}

.add-character-button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.add-character-button:hover {
    background-color: #45a049;
}

.character-panel .infotext-input {
    margin-left: 8px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 12px;
    width: 150px;
}

.character-panel .checkbox-label {
    display: flex;
    align-items: center;
    padding: 2px 0;
}

.category-header {
    color: #333;
    margin-top: 8px;
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.character-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
}

.save-character-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 12px;
}

.load-character-select {
    max-width: 120px;
    padding: 2px 4px;
    border-radius: 3px;
    border: 1px solid #ccc;
    font-size: 12px;
    color: #333;
}

.delete-saved-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 3px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 12px;
}

.delete-saved-button:hover {
    background-color: #ff3333;
}

.load-character-container {
    display: flex;
    gap: 4px;
    align-items: center;
}

.load-prompt-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

.load-prompt-select {
    width: auto;  /* Override the width for the select */
    min-width: 80px;
}

.delete-prompt-button {
    padding: 5px 8px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #ff4d4d;
    color: #fff;
}

.delete-prompt-button:hover {
    background-color: #ff3333;
}

@media screen and (max-width: 800px) {
    .button-container {
        flex-direction: column;
        align-items: stretch;
    }
    
    .prompt-set-controls {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
    }

    .toggle-button {
        width: 100%;
        height: auto;
    }
    
    .toggle-button::before {
        display: none;  /* Hide tooltips on mobile */
    }
}
`;

(function () {
    'use strict';

    // Function to inject CSS
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = promptComposerCSS;
        document.head.appendChild(style);
    }

    // Call the injectCSS function immediately
    injectCSS();

    let tagArea = null;
    let promptComposerData = JSON.parse(localStorage.getItem('promptComposerData')) || {
        categories: [
            { name: "Artists", tags: [], pretext: "artist:" },
            { name: "Persons", tags: [] },
            { name: "Locations", tags: [] },
            { name: "Expressions", tags: [] }
        ],
        customTags: {},
        savedCharacters: {} // Initialize savedCharacters as an empty object
    };

    let savedCharacters = JSON.parse(localStorage.getItem('promptComposerCharacters')) || {};
    console.log('Initial load of savedCharacters:', savedCharacters);
    let savedPromptSets = JSON.parse(localStorage.getItem('promptComposerSets')) || {};

    function saveToLocalStorage() {
        localStorage.setItem('promptComposerData', JSON.stringify(promptComposerData));
    }

    let modalDiv; // Declare modalDiv in the global scope
    let categoriesContainer;

    let isV4 = false;

    function detectVersion() {
        // Look for "Add Character" button which is unique to V4
        const addCharacterBtn = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent.trim() === 'Add Character'
        );
        isV4 = !!addCharacterBtn;
        console.log("Detected version:", isV4 ? "V4" : "V3");
    }

    function getPromptFields() {
        const allFields = document.querySelectorAll('.ProseMirror p');
        // Only use the first half of the fields since the latter half are duplicates
        const uniqueFields = Array.from(allFields).slice(0, Math.floor(allFields.length / 2));
        
        return {
            generalField: uniqueFields[0], // First field is always general prompt
            characterFields: uniqueFields.slice(1).filter(field => field.textContent.trim() !== '') // Only get non-empty character fields
        };
    }

    function getCategoryTags() {
        const tagCategories = {
            'Artists': [],
            'Activities': [],
            'Participants': [],
            'Body Features': [],
            'Clothing': [],
            'Emotions': [],
            'Backgrounds': []
        };

        // Collect tags from existing categories that match our desired categories
        promptComposerData.categories.forEach(category => {
            if (tagCategories.hasOwnProperty(category.name)) {
                tagCategories[category.name] = category.tags.map(tag => tag.name);
            }
        });

        return tagCategories;
    }

    // Add this function at the module level (before addCharacter)
    function updateCharacterPrompt(panel, characterNum) {
        // Get checked checkbox tags
        const checkedTags = panel.find('.checkbox-input:checked').map(function() {
            return $(this).attr('data-tag');
        }).get();

        // Get custom traits that don't have checkboxes
        const customTraits = panel.find('.custom-traits-input').val()
            .split(',')
            .map(t => t.trim())
            .filter(t => t && !checkedTags.includes(t)); // Filter out traits that have checkboxes

        const traits = [...checkedTags, ...customTraits];
        
        if (traits.length > 0) {
            const charPrompt = traits.join(', ');
            
            // Update the corresponding prompt field
            const { characterFields } = getPromptFields();
            if (characterFields[characterNum]) {
                characterFields[characterNum].innerHTML = charPrompt;
            }
        }
    }

    function addCharacter(characterList, characterData = null, fieldIndex = null) {
        const characterNum = characterList.children().length;
        if (characterNum >= 4) return;
        
        const characterPanel = $('<div></div>').addClass('character-panel');
        
        // Character header with label, gender selector, and delete button
        const headerDiv = $('<div></div>').addClass('character-header');
        const headerContent = $('<div></div>').addClass('header-content');
        
        const characterLabel = $('<span></span>')
            .addClass('character-label')
            .text(`Character ${characterNum + 1}`);

        // Create gender selector
        const genderSelector = $('<div></div>').addClass('gender-selector');
        
        ['girl', 'boy'].forEach(gender => {
            const label = $('<label></label>');
            const checkbox = $('<input type="checkbox">')
                .addClass('checkbox-input gender-checkbox')
                .attr('data-tag', gender)
                .prop('checked', characterData?.tags?.includes(gender) || false)
                .on('change', function() {
                    if (this.checked) {
                        genderSelector.find('.gender-checkbox').not(this).prop('checked', false);
                    }
                    updateCharacterPrompt(characterPanel, characterNum);
                });
                
            label.append(checkbox, gender);
            genderSelector.append(label);
        });

        // Create save/load controls
        const characterActions = $('<div></div>').addClass('character-actions');
        
        const saveBtn = $('<button>Save</button>')
            .addClass('save-character-button')
            .click(() => {
                const name = prompt('Enter a name for this character:');
                if (name) {
                    const characterState = {
                        gender: characterPanel.find('.gender-checkbox:checked').attr('data-tag') || null,
                        tags: characterPanel.find('.checkbox-input:checked:not(.gender-checkbox)').map(function() {
                            return $(this).attr('data-tag');
                        }).get(),
                        customTraits: characterPanel.find('.custom-traits-input').val()
                    };
                    
                    console.log('Saving character:', name, characterState);
                    savedCharacters[name] = characterState;
                    localStorage.setItem('promptComposerCharacters', JSON.stringify(savedCharacters));
                    console.log('Updated savedCharacters:', savedCharacters);
                    updateLoadSelects();
                }
            });

        const loadContainer = $('<div></div>').addClass('load-character-container');
        
        const loadSelect = $('<select></select>')
            .addClass('load-character-select')
            .append('<option value="">Load char...</option>');

        // Add this right after creating loadSelect
        Object.entries(savedCharacters).forEach(([name, data]) => {
            loadSelect.append(new Option(name, name));
        });

        const deleteSavedBtn = $('<button>×</button>')
            .addClass('delete-saved-button')
            .hide()
            .click(() => {
                const selectedName = loadSelect.val();
                if (selectedName && confirm(`Delete saved character "${selectedName}"?`)) {
                    delete savedCharacters[selectedName];
                    localStorage.setItem('promptComposerCharacters', JSON.stringify(savedCharacters));
                    updateLoadSelects();
                }
            });

        loadSelect.on('change', function() {
            const selectedName = $(this).val();
            deleteSavedBtn.toggle(!!selectedName);
            
            if (selectedName) {
                const savedChar = savedCharacters[selectedName];
                
                characterPanel.find('.checkbox-input').prop('checked', false);
                
                if (savedChar.gender) {
                    characterPanel.find(`.gender-checkbox[data-tag="${savedChar.gender}"]`).prop('checked', true);
                }
                
                savedChar.tags.forEach(tag => {
                    characterPanel.find(`.checkbox-input[data-tag="${tag}"]`).prop('checked', true);
                });
                
                characterPanel.find('.custom-traits-input').val(savedChar.customTraits || '');
                
                updateCharacterPrompt(characterPanel, characterNum);
            }
        });

        loadContainer.append(loadSelect, deleteSavedBtn);
        characterActions.append(saveBtn, loadContainer);
        headerContent.append(characterLabel, genderSelector, characterActions);
        headerDiv.append(headerContent);

        const deleteCharacterBtn = $('<button>×</button>')
            .addClass('delete-character-button')
            .click(() => {
                if (confirm('Delete this character?')) {
                    characterPanel.remove();
                    $('.character-panel').each((idx, panel) => {
                        $(panel).find('.character-label').text(`Character ${idx + 1}`);
                        updateCharacterPrompt($(panel), idx);
                    });
                }
            });

        headerDiv.append(deleteCharacterBtn);

        // Tag sections from existing categories
        const tagCategories = getCategoryTags();
        const tagSection = $('<div></div>').addClass('tag-sections');

        Object.entries(tagCategories).forEach(([category, tags]) => {
            if (tags.length > 0) {
                const section = $('<div></div>').addClass('tag-section');
                const title = $('<h5 class="category-header"></h5>').text(category);
                const checkboxContainer = $('<div></div>').addClass('checkbox-container');
                
                tags.forEach(tag => {
                    const checkboxLabel = $('<label></label>').addClass('checkbox-label');
                    const checkbox = $('<input type="checkbox">')
                        .addClass('checkbox-input')
                        .attr('data-tag', tag)
                        .prop('checked', characterData?.tags?.includes(tag) || false)
                        .on('change', () => updateCharacterPrompt(characterPanel, characterNum));

                    // Add infotext input (initially hidden)
                    const infotextInput = $('<input type="text">')
                        .addClass('infotext-input')
                        .attr('placeholder', 'Infotext...')
                        .val(tag.infotext || '')
                        .hide();

                    infotextInput.on('input', function() {
                        const tagObj = promptComposerData.categories
                            .find(cat => cat.name === category)?.tags
                            .find(t => t.name === tag);
                        if (tagObj) {
                            tagObj.infotext = $(this).val();
                            checkboxLabel.attr('title', $(this).val());
                            saveToLocalStorage();
                        }
                    });

                    // Set initial tooltip if infotext exists
                    const tagObj = promptComposerData.categories
                        .find(cat => cat.name === category)?.tags
                        .find(t => t.name === tag);
                    if (tagObj?.infotext) {
                        checkboxLabel.attr('title', tagObj.infotext);
                        infotextInput.val(tagObj.infotext);
                    }
                        
                    checkboxLabel.append(checkbox, tag, infotextInput);
                    checkboxContainer.append(checkboxLabel);
                });
                
                section.append(title, checkboxContainer);
                tagSection.append(section);
            }
        });

        // Custom traits input for non-checkbox tags
        const customTraitsInput = $('<textarea></textarea>')
            .addClass('custom-traits-input')
            .attr('placeholder', 'Add custom traits (comma-separated)...')
            .on('input', function() {
                updateCharacterPrompt(characterPanel, characterNum);
            });

        characterPanel.append(
            headerDiv,
            tagSection,
            $('<div>Custom Traits:</div>').addClass('category-header'),
            customTraitsInput
        );

        characterList.append(characterPanel);
        updateCharacterPrompt(characterPanel, characterNum);
    }

    function createCharacterManager() {
        const container = $('<div></div>').addClass('character-manager-container');
        const characterList = $('<div></div>').addClass('character-list');
        
        // Get existing character fields
        const { characterFields } = getPromptFields();

        // Initialize the character loader dropdowns
        updateLoadSelects();

        // Load existing characters first
        characterFields.forEach((field, index) => {
            const existingTags = field.textContent.split(',').map(t => t.trim()).filter(t => t);
            addCharacter(characterList, { tags: existingTags }, index);
        });

        // Add character button (up to 4)
        const addCharacterBtn = $('<button>Add Character</button>')
            .addClass('add-character-button')
            .click(() => {
                if (characterList.children().length < 4) {
                    addCharacter(characterList, null, null);
                }
            });
        
        container.append(characterList, addCharacterBtn);

        return container;
    }

    function renderCategories(editMode = false) {
        categoriesContainer.empty();
        promptComposerData.categories.forEach((category, index) => {
            createCategorySection(category, index, categoriesContainer);
        });
        if (editMode) {
            $('.move-category-button, .delete-category-button').toggle();
        }
    }

    function openPromptComposer() {
        console.log("openPromptComposer called");
        try {
            detectVersion();
            
            if ($('#promptComposerModal').length) {
                $('#promptComposerModal').remove();
                return;
            }

            modalDiv = $('<div id="promptComposerModal"></div>').addClass('prompt-composer-modal');
            const title = $('<h3>Prompt Composer</h3>').addClass('prompt-composer-title');
            modalDiv.append(title);

            const buttonContainer = $('<div></div>').addClass('button-container');
            const editButton = $('<button>E</button>')
                .addClass('toggle-button')
                .attr('data-full-text', 'Edit Tags')
                .click(() => {
                    $('.add-tag-container, .delete-button').toggle();
                    $('.add-tag-container:visible').css('display', 'flex');
                });
            const weightToggleButton = $('<button>W</button>')
                .addClass('toggle-button')
                .attr('data-full-text', 'Toggle Weights')
                .click(() => {
                    const weightsVisible = !$('.weight-control').first().is(':visible');
                    $('.weight-control').toggle(weightsVisible);
                    $('.weight-display').each(function () {
                        const label = $(this).closest('label');
                        const weightControl = label.find('.weight-control');
                        const tag = {
                            weight: parseFloat(weightControl.find('input[type="number"]').val())
                        };
                        updateWeightDisplay(tag, $(this), weightControl);
                    });
                });
            const categoryManagementButton = $('<button>C</button>')
                .addClass('toggle-button')
                .attr('data-full-text', 'Manage Categories')
                .click(() => {
                    $('.category-management').toggle();
                    $('.move-category-button, .delete-category-button').toggle();
                });
            const infotextToggleButton = $('<button>I</button>')
                .addClass('toggle-button')
                .attr('data-full-text', 'Manage Infotexts')
                .click(() => {
                    $('.infotext-input').toggle();
                });

            // Add prompt set management buttons
            const savePromptButton = $('<button>S</button>')
                .addClass('toggle-button')
                .attr('data-full-text', 'Save Prompt Set')
                .click(saveCurrentPromptSet);

            const loadContainer = $('<div></div>').addClass('load-prompt-container');
            const deletePromptButton = $('<button>×</button>')
                .addClass('delete-prompt-button toggle-button')
                .attr('data-full-text', 'Delete Prompt Set')
                .hide()
                .click(() => {
                    const selectedName = loadSelect.val();
                    if (selectedName) {
                        deletePromptSet(selectedName);
                        loadSelect.val('');
                        deletePromptButton.hide();
                    }
                });

            const loadSelect = $('<select></select>')
                .addClass('load-prompt-select toggle-button')
                .append('<option value="">Load...</option>')
                .on('change', function() {
                    const selectedName = $(this).val();
                    deletePromptButton.toggle(!!selectedName);
                    if (selectedName) {
                        loadPromptSet(selectedName);
                    }
                });

            loadContainer.append(loadSelect, deletePromptButton);

            // Create container for prompt set controls
            const promptSetControls = $('<div></div>').addClass('prompt-set-controls');

            // Add the regular buttons
            buttonContainer.append(
                editButton, 
                weightToggleButton, 
                categoryManagementButton, 
                infotextToggleButton
            );

            // Add the prompt set controls to their container
            promptSetControls.append(
                savePromptButton,
                loadContainer
            );

            // Add the prompt set controls to the main button container
            buttonContainer.append(promptSetControls);

            modalDiv.append(buttonContainer);

            // Create scrollable content container
            const modalContent = $('<div></div>').addClass('modal-content');
            
            // Add category management (initially hidden)
            const categoryManagement = $('<div></div>').addClass('category-management').hide();
            const addCategoryContainer = $('<div></div>').addClass('add-category-container');
            const addCategoryInput = $('<input type="text">').addClass('add-category-input')
                .attr('placeholder', 'Add new category...');
            const addCategoryButton = $('<button>Add Category</button>').addClass('add-category-button')
                .click(() => {
                    const newCategory = addCategoryInput.val().trim();
                    if (newCategory && !promptComposerData.categories.some(cat => cat.name === newCategory)) {
                        promptComposerData.categories.push({ name: newCategory, tags: [] });
                        saveToLocalStorage();
                        addCategoryInput.val('');
                        renderCategories(true);
                    }
                });
            addCategoryContainer.append(addCategoryInput, addCategoryButton);
            categoryManagement.append(addCategoryContainer);

            // Create a container for categories
            categoriesContainer = $('<div></div>').addClass('categories-container');

            // Add all the middle content to modalContent
            modalContent.append(categoryManagement);
            modalContent.append(categoriesContainer);

            // Render the categories
            renderCategories();

            if (isV4) {
                const characterManager = createCharacterManager();
                modalContent.append(characterManager);
            }

            // Create bottom buttons container
            const bottomButtonsContainer = $('<div></div>').addClass('bottom-buttons-container');

            const generateButton = $('<button>Generate Prompt</button>').addClass('generate-button')
                .click(() => {
                    const { generalField, characterFields } = getPromptFields();
                    
                    // Update general prompt field first
                    const generalPrompt = generatePrompt();
                    if (generalField) {
                        generalField.innerHTML = generalPrompt;
                    }
                    
                    saveToLocalStorage();
                    modalDiv.remove();
                });

            const cancelButton = $('<button>Close</button>').addClass('close-button')
                .click(() => {
                    saveToLocalStorage();
                    modalDiv.remove();
                });

            bottomButtonsContainer.append(generateButton, cancelButton);

            // Add the content container to the modal
            modalDiv.append(modalContent);

            // Add bottom buttons last
            modalDiv.append(bottomButtonsContainer);

            $('body').append(modalDiv);

            // Adjust layout based on screen size
            adjustLayout();

            $(window).on('resize', adjustLayout);

            console.log("Modal appended to body");

            // Add this line after creating the modal
            updatePromptSetSelect();
        } catch (error) {
            console.error("Error in openPromptComposer:", error);
        }
    }

    function adjustLayout() {
        if ($(window).width() >= 1600) {
            $('.category-container').css('width', '32%');
            modalDiv.css('width', '1500px');
        }
        else if ($(window).width() >= 1200) {
            $('.category-container').css('width', '48%');
            modalDiv.css('width', '1000px');
        } else {
            $('.category-container').css('width', '100%');
            modalDiv.css('width', '600px');
        }
    }

    function createCategorySection(category, index, modalDiv) {
        const categoryContainer = $('<div></div>').addClass('category-container');
        const categoryHeader = $('<div></div>').addClass('category-header');
        const label = $('<label></label>').text(category.name + ':').addClass('category-label');

        const deleteCategoryButton = $('<button>Delete Category</button>')
            .addClass('delete-category-button')
            .hide() // Initially hide the delete button
            .click(() => {
                if (confirm(`Are you sure you want to delete the category "${category.name}" and all its tags?`)) {
                    promptComposerData.categories.splice(index, 1);
                    saveToLocalStorage();
                    renderCategories(true);
                }
            });

        const moveCategoryUpButton = $('<button>↑</button>').addClass('move-category-button')
            .hide() // Initially hide the move up button
            .click(() => {
                if (index > 0) {
                    [promptComposerData.categories[index - 1], promptComposerData.categories[index]] =
                        [promptComposerData.categories[index], promptComposerData.categories[index - 1]];
                    saveToLocalStorage();
                    renderCategories(true);
                }
            });

        const moveCategoryDownButton = $('<button>↓</button>').addClass('move-category-button')
            .hide() // Initially hide the move down button
            .click(() => {
                if (index < promptComposerData.categories.length - 1) {
                    [promptComposerData.categories[index], promptComposerData.categories[index + 1]] =
                        [promptComposerData.categories[index + 1], promptComposerData.categories[index]];
                    saveToLocalStorage();
                    renderCategories(true);
                }
            });

        const categoryManagementButtons = $('<div></div>').addClass('category-management-buttons');
        categoryManagementButtons.append(moveCategoryUpButton, moveCategoryDownButton, deleteCategoryButton);

        categoryHeader.append(label, categoryManagementButtons);
        categoryContainer.append(categoryHeader);

        const checkboxContainer = $('<div></div>').addClass('checkbox-container');
        category.tags.forEach(tag => {
            createCheckbox(tag, category.name, checkboxContainer);
        });
        categoryContainer.append(checkboxContainer);

        const addTagContainer = $('<div></div>').addClass('add-tag-container');
        const addTagInput = $('<input type="text">').addClass('add-tag-input')
            .attr('placeholder', 'Add new ' + category.name.toLowerCase() + '...');
        const addTagButton = $('<button>Add</button>').addClass('add-tag-button');

        const addNewTag = () => {
            const newTag = addTagInput.val().trim();
            if (newTag && !category.tags.some(tag => tag.name === newTag)) {
                category.tags.push({ name: newTag, active: false, weight: 1 });
                createCheckbox({ name: newTag, active: false, weight: 1 }, category.name, checkboxContainer, true);
                addTagInput.val('');
                saveToLocalStorage();
            }
        };

        addTagButton.click(addNewTag);
        addTagInput.keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                addNewTag();
            }
        });

        addTagContainer.append(addTagInput, addTagButton);
        categoryContainer.append(addTagContainer);

        const textArea = $('<textarea></textarea>').addClass('tag-textarea')
            .attr('placeholder', 'Enter additional ' + category.name.toLowerCase() + ' here...');

        const customTags = promptComposerData.customTags[category.name] || '';
        textArea.val(customTags);

        textArea.on('input', function () {
            const customTagsValue = $(this).val().trim();
            promptComposerData.customTags[category.name] = customTagsValue;
            saveToLocalStorage();
        });

        categoryContainer.append(textArea);

        categoriesContainer.append(categoryContainer);
    }

    function createCheckbox(tag, categoryName, container, isNew = false) {
        const checkboxLabel = $('<label></label>').addClass('checkbox-label');
        const checkbox = $('<input type="checkbox">').addClass('checkbox-input').val(tag.name);
        checkbox.prop('checked', tag.active);
        checkbox.change(function () {
            tag.active = this.checked;
            saveToLocalStorage();
        });

        // Add infotext input
        const infotextInput = $('<input type="text">').addClass('infotext-input')
            .attr('placeholder', 'Infotext...')
            .val(tag.infotext || '')
            .hide(); // Initially hidden

        infotextInput.on('input', function () {
            tag.infotext = $(this).val();
            saveToLocalStorage();
        });

        // Display infotext on mouseover
        checkboxLabel.attr('title', tag.infotext || '');

        // Create weight display
        const weightDisplay = $('<span></span>').addClass('weight-display');

        // Create weight control
        const weightControl = $('<div></div>').addClass('weight-control');
        const weightInput = $('<input type="number" step="0.05" min="0.5" max="1.5">').addClass('weight-input')
            .val(tag.weight || 1);
        const decreaseButton = $('<button>-</button>').addClass('weight-button');
        const increaseButton = $('<button>+</button>').addClass('weight-button');

        decreaseButton.click(() => updateWeight(-0.05));
        increaseButton.click(() => updateWeight(0.05));
        weightInput.on('input', () => {
            tag.weight = parseFloat(weightInput.val());
            updateWeightDisplay(tag, weightDisplay, weightControl);
            saveToLocalStorage();
        });

        function updateWeight(change) {
            let newWeight = (tag.weight || 1) + change;
            newWeight = Math.round(newWeight * 20) / 20; // Round to nearest 0.05
            newWeight = Math.max(0.5, Math.min(1.5, newWeight)); // Clamp between 0.5 and 1.5
            tag.weight = newWeight;
            weightInput.val(newWeight);
            updateWeightDisplay(tag, weightDisplay, weightControl);
            saveToLocalStorage();
        }

        weightControl.append(weightInput, decreaseButton, increaseButton);
        checkboxLabel.append(checkbox, tag.name, weightDisplay, weightControl);

        const deleteButton = $('<button>×</button>').addClass('delete-button').click(() => {
            const category = promptComposerData.categories.find(cat => cat.name === categoryName);
            category.tags = category.tags.filter(t => t.name !== tag.name);
            saveToLocalStorage();
            checkboxLabel.remove();
        });
        if (isNew) {
            console.log("isNew is true");
            deleteButton.show();
        }

        checkboxLabel.append(deleteButton, infotextInput);
        container.append(checkboxLabel);

        updateWeightDisplay(tag, weightDisplay, weightControl);
    }

    function onReady() {
        setTimeout(placeComposerButton, 5000);
    }

    function placeComposerButton() {
        let composeButton = $('<button>Compose Prompt</button>')
            .addClass('compose-prompt-button')
            .click(openPromptComposer);

        let textAreas = document.querySelectorAll("[class='ProseMirror']");
        if (textAreas.length > 0) {
            let sidebar = textAreas[0].closest('div').parentElement;
            $(sidebar).prepend(composeButton);
        }
    }

    function generatePrompt() {
        if (!isV4) {
            // Existing V3 prompt generation
            return promptComposerData.categories.map(category => {
                const activeTags = category.tags
                    .filter(tag => tag.active)
                    .map(tag => {
                        let tagText = tag.name;
                        if (category.name === "Artists" && tagText !== "realistic") {
                            tagText = "artist:" + tagText;
                        }
                        if (tag.weight > 1) {
                            const repetitions = Math.round((tag.weight - 1) / 0.05);
                            tagText = '{'.repeat(repetitions) + tagText + '}'.repeat(repetitions);
                        } else if (tag.weight < 1) {
                            const repetitions = Math.round((1 - tag.weight) / 0.05);
                            tagText = '['.repeat(repetitions) + tagText + ']'.repeat(repetitions);
                        }
                        return tagText;
                    });
                const customTags = (promptComposerData.customTags[category.name] || '')
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag !== '');
                return [...activeTags, ...customTags];
            }).flat().join(", ");
        }

        // For V4, only generate the general prompt
        const generalTags = promptComposerData.categories.map(category => {
            const activeTags = category.tags
                .filter(tag => tag.active)
                .map(tag => formatTag(tag, category.name));
                
            const customTags = (promptComposerData.customTags[category.name] || '')
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');

            return [...activeTags, ...customTags];
        }).flat();

        return generalTags.join(", ");
    }

    function updateWeightDisplay(tag, displayElement, controlElement) {
        const weight = tag.weight || 1;
        if (weight === 1) {
            displayElement.text('');
            if (controlElement) {
                controlElement.find('input').hide();
                controlElement.find('button').show();
            }
        } else {
            if (controlElement && $('.weight-control').first().is(':visible')) {
                displayElement.text('');
                controlElement.find('input, button').show();
            } else {
                displayElement.text(`:${weight.toFixed(2)}`);
                if (controlElement) {
                    controlElement.find('input').hide();
                    controlElement.find('button').show();
                }
            }
        }
    }

    function formatTag(tag, categoryName) {
        let tagText = tag.name;
        if (categoryName === "Artists" && tagText !== "realistic") {
            tagText = "artist:" + tagText;
        }
        if (tag.weight > 1) {
            const repetitions = Math.round((tag.weight - 1) / 0.05);
            tagText = '{'.repeat(repetitions) + tagText + '}'.repeat(repetitions);
        } else if (tag.weight < 1) {
            const repetitions = Math.round((1 - tag.weight) / 0.05);
            tagText = '['.repeat(repetitions) + tagText + ']'.repeat(repetitions);
        }
        return tagText;
    }

    // Add the updateLoadSelects function at the module level
    function updateLoadSelects() {
        console.log('updateLoadSelects called, savedCharacters:', savedCharacters);
        $('.load-character-select').each(function() {
            console.log('Found load-character-select element');
            const currentValue = $(this).val();
            $(this).empty().append('<option value="">Load char...</option>');
            
            Object.entries(savedCharacters).forEach(([name, data]) => {
                console.log('Adding character option:', name, data);
                $(this).append(new Option(name, name));
            });
            
            $(this).val(currentValue);
        });
    }

    function saveCurrentPromptSet() {
        const { generalField, characterFields } = getPromptFields();
        
        // Get current state of characters
        const characters = $('.character-panel').map(function() {
            const panel = $(this);
            return {
                gender: panel.find('.gender-checkbox:checked').attr('data-tag') || null,
                tags: panel.find('.checkbox-input:checked:not(.gender-checkbox)').map(function() {
                    return $(this).attr('data-tag');
                }).get(),
                customTraits: panel.find('.custom-traits-input').val()
            };
        }).get();

        // Create prompt set object
        const promptSet = {
            generalPrompt: generalField?.innerHTML || '',
            characters: characters,
            timestamp: new Date().toISOString()
        };

        // Show save dialog
        const name = prompt('Enter a name for this prompt set:');
        if (name) {
            savedPromptSets[name] = promptSet;
            localStorage.setItem('promptComposerSets', JSON.stringify(savedPromptSets));
            updatePromptSetSelect();
        }
    }

    function loadPromptSet(name) {
        const promptSet = savedPromptSets[name];
        if (!promptSet) return;

        // Update general prompt checkboxes and UI
        promptComposerData.categories.forEach(category => {
            category.tags.forEach(tag => {
                // Reset all tags to inactive first
                tag.active = false;
            });
        });

        // Parse the general prompt and activate corresponding tags
        const generalPromptTags = promptSet.generalPrompt.split(',').map(t => t.trim());
        generalPromptTags.forEach(tagText => {
            // Remove any weight modifiers ({} or [])
            const cleanTag = tagText.replace(/[\{\}\[\]]/g, '').trim();
            // Remove artist: prefix if present
            const tagName = cleanTag.replace(/^artist:/, '');

            // Find and activate the tag
            promptComposerData.categories.forEach(category => {
                const foundTag = category.tags.find(t => t.name === tagName);
                if (foundTag) {
                    foundTag.active = true;
                }
            });

            // Handle custom tags
            promptComposerData.categories.forEach(category => {
                const customTagsArea = $(`.category-container:contains("${category.name}") .tag-textarea`);
                const customTags = promptSet.customTags?.[category.name] || '';
                customTagsArea.val(customTags);
                promptComposerData.customTags[category.name] = customTags;
            });
        });

        // Update checkboxes in the UI
        $('.checkbox-input').each(function() {
            const tagName = $(this).val();
            const isActive = promptComposerData.categories.some(category => 
                category.tags.some(tag => tag.name === tagName && tag.active)
            );
            $(this).prop('checked', isActive);
        });

        // Update the actual text field
        const { generalField } = getPromptFields();
        if (generalField) {
            generalField.innerHTML = promptSet.generalPrompt;
        }

        // Handle characters in V4 mode
        if (isV4 && promptSet.characters) {
            const characterList = $('.character-list');
            if (characterList.length) {
                characterList.empty();
                promptSet.characters.forEach((charData, index) => {
                    addCharacter(characterList, charData, index);
                });
            }
        }

        saveToLocalStorage();
    }

    function deletePromptSet(name) {
        if (confirm(`Delete saved prompt set "${name}"?`)) {
            delete savedPromptSets[name];
            localStorage.setItem('promptComposerSets', JSON.stringify(savedPromptSets));
            updatePromptSetSelect();
        }
    }

    function updatePromptSetSelect() {
        const select = $('.load-prompt-select');
        select.empty().append('<option value="">Load prompt set...</option>');
        
        Object.entries(savedPromptSets).forEach(([name, set]) => {
            const date = new Date(set.timestamp).toLocaleDateString();
            select.append(new Option(`${name} (${date})`, name));
        });
    }

    $(onReady);
})();
