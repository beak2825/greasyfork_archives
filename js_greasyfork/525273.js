// ==UserScript==
// @name         Sniffies Negative Profile Filter
// @version      1.5
// @description  Add a popup with filters for profiles, including age range and dropdown menus, and remembers user choices.
// @author       LiveCamShow
// @match        *://sniffies.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @homepageURL  https://gitlab.com/livecamshow/UserScripts
// @namespace    LiveCamShow.scripts
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525273/Sniffies%20Negative%20Profile%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/525273/Sniffies%20Negative%20Profile%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the settings button to load
    const waitForSettingsButton = () => {
        const settingsButton = document.querySelector('[data-testid="settingsButton"]');
        if (settingsButton) {
            initializeFilterButton(settingsButton);
        } else {
            setTimeout(waitForSettingsButton, 500);
        }
    };

    // Initialize the filter button and popup
    const initializeFilterButton = (settingsButton) => {
        const filterButtonDiv = document.createElement('div');
        filterButtonDiv.className = 'nav-inline-icon';

        const filterButton = document.createElement('button');
        filterButton.type = 'button';
        filterButton.title = 'Filter Profiles';
        filterButton.innerHTML = '<i class="fa fa-filter"></i>';
        filterButton.style.marginLeft = '10px';
        const navbar = settingsButton.parentElement.parentElement;
        filterButtonDiv.appendChild(filterButton);
        navbar.appendChild(filterButtonDiv);
        navbar.style.gridTemplateColumns = 'auto auto auto auto auto';

        const popup = createPopup();
        document.body.appendChild(popup);

        filterButton.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        });

        restoreSettings();
        applyFilters(); // Apply filters on load
    };

    const createPopup = () => {
        const popup = document.createElement('div');
        popup.id = 'filter-popup';
        popup.style = `
            position: fixed; top: 10%; right: 5%; padding: 15px; background-color: #ffffff;
            border: 1px solid #ddd; border-radius: 8px; z-index: 10000;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); max-width: 320px;
            max-height: 75vh; overflow-y: auto; font-family: "Arial", sans-serif; color: #333;
            display: none;
        `;

        const title = document.createElement('h3');
        title.innerText = 'Remove Profiles That Contain';
        title.style.marginBottom = '10px';
        popup.appendChild(title);

        const categories = {
            Position: ["dom top (breeder)", "passive top", "top", "verse top", "verse", "verse bottom", "bottom", "power bottom", "submissive bottom", "side"],
            "Body Type": ["muscular", "fit", "slim", "average", "stocky", "chubby", "large"],
            Sexuality: ["straight", "straight-curious", "bicurious", "bi", "gay"],
            Expression: ["bear", "biker", "bro", "clean cut", "corporate", "daddy", "discreet", "femme", "gaymer", "geek", "goth", "guy next door", "jock", "leather", "nudist", "otter", "poz", "punk", "pup", "rugged", "skater", "son", "sporty", "surfer", "swinger", "trans", "trendy", "trucker", "twink", "u+"]
        };

        const checkboxes = {};

        for (const [category, options] of Object.entries(categories)) {
            const categoryContainer = document.createElement('div');
            categoryContainer.style.marginBottom = '10px';

            const categoryTitle = document.createElement('button');
            categoryTitle.innerText = category;
            categoryTitle.style = `
                display: block; width: 100%; text-align: left; margin-bottom: 5px;
                padding: 10px; background-color: #f5f5f5; border: 1px solid #ddd;
                border-radius: 6px; cursor: pointer; font-size: 1em; color: #333;
                transition: background-color 0.2s ease-in-out;
            `;

            const optionsContainer = document.createElement('div');
            optionsContainer.style = 'display: none; margin-left: 10px;';

            categoryTitle.addEventListener('click', () => {
                optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
            });

            checkboxes[category] = {};
            for (const option of options) {
                const label = document.createElement('label');
                label.style.display = 'block';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;

                // Restore saved state
                checkbox.checked = GM_getValue(`${category}:${option}`, false);

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        GM_setValue(`${category}:${option}`, checkbox.checked);
                    } else {
                        GM_deleteValue(`${category}:${option}`)
                    }
                });

                checkboxes[category][option] = checkbox;

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(option));
                optionsContainer.appendChild(label);
            }

            categoryContainer.appendChild(categoryTitle);
            categoryContainer.appendChild(optionsContainer);
            popup.appendChild(categoryContainer);
        }
        // Has Messages Checkbox
        const hasMessagesContainer = document.createElement('div');
        hasMessagesContainer.style.marginBottom = '10px';

        const hasMessagesLabel = document.createElement('label');
        hasMessagesLabel.style.display = 'block';

        const hasMessagesCheckbox = document.createElement('input');
        hasMessagesCheckbox.type = 'checkbox';
        hasMessagesCheckbox.checked = GM_getValue('hasMessages', false);

        hasMessagesCheckbox.addEventListener('change', () => {
            if (hasMessagesCheckbox.checked) {
                GM_setValue('hasMessages', true);
            } else {
                GM_deleteValue('hasMessages');
            }
        });

        hasMessagesLabel.appendChild(hasMessagesCheckbox);
        hasMessagesLabel.appendChild(document.createTextNode('Has Messages'));
        hasMessagesContainer.appendChild(hasMessagesLabel);

        popup.appendChild(hasMessagesContainer);

        const ageRangeContainer = document.createElement('div');
        ageRangeContainer.style.marginBottom = '10px';

        const ageTitle = document.createElement('h4');
        ageTitle.innerText = 'Age Range';
        ageRangeContainer.appendChild(ageTitle);

        const minAgeInput = document.createElement('input');
        minAgeInput.type = 'number';
        minAgeInput.placeholder = 'Min Age';
        minAgeInput.style = 'width: 45%; padding: 5px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px;';
        minAgeInput.value = GM_getValue('minAge', '');


        const maxAgeInput = document.createElement('input');
        maxAgeInput.type = 'number';
        maxAgeInput.placeholder = 'Max Age';
        maxAgeInput.style = 'width: 45%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;';
        maxAgeInput.value = GM_getValue('maxAge', '');

        minAgeInput.addEventListener('change', () => {
            GM_setValue('minAge', minAgeInput.value);
        });

        maxAgeInput.addEventListener('change', () => {
            GM_setValue('maxAge', maxAgeInput.value);
        });

        ageRangeContainer.appendChild(minAgeInput);
        ageRangeContainer.appendChild(maxAgeInput);
        popup.appendChild(ageRangeContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';

        const resetButton = createButton('Reset', () => {
            Object.values(checkboxes).forEach(category => {
                Object.values(category).forEach(checkbox => {
                    checkbox.checked = false;
                    GM_deleteValue(`${checkbox.parentNode.parentNode.previousSibling.innerText}:${checkbox.value}`);
                });
            });
            minAgeInput.value = '0';
            maxAgeInput.value = '100';
            GM_setValue('minAge', '0');
            GM_setValue('maxAge', '100');
            applyFilters();
        });

        const applyButton = createButton('Apply', () => {
            applyFilters();
            popup.style.display = 'none';
        });

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(applyButton);
        popup.appendChild(buttonContainer);

        return popup;
    };

    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        button.innerText = text;
        button.style = `
            padding: 8px 15px; background-color: #007bff; border: 1px solid #0056b3;
            border-radius: 6px; cursor: pointer; color: #fff; font-size: 0.9em;
        `;
        button.addEventListener('click', onClick);
        return button;
    };

    const applyFilters = () => {
        const profiles = document.querySelectorAll('div.marker-container.user > div > div.preview-tag > .title-tag');
        profiles.forEach(profile => {
            let hide = false;

            const profileText = profile.innerText.toLowerCase();
            const parentContainer = profile.closest('div.marker-container.user');

            // Check "Has Messages" filter
            const hasMessagesEnabled = GM_getValue('hasMessages', false);
            const innerContainer = parentContainer.querySelector('div.inner-container.messages');
            if (hasMessagesEnabled && innerContainer) {
                hide = true;
            }

            // Category and Age Range Filters
            const obj = Object.entries(GM_listValues());
            obj.filter(([key, value]) => key && value.includes(':'))
                .forEach(([key, value]) => {
                    const option = value.split(':')[1];
                    if (profileText.includes(option.toLowerCase())) {
                        hide = true;
                    }
                });

            const minAge = parseInt(GM_getValue('minAge', ''), 10);
            const maxAge = parseInt(GM_getValue('maxAge', ''), 10);
            const ageMatch = profileText.match(/\b(\d{2})\b/);
            const age = ageMatch ? parseInt(ageMatch[1], 10) : null;

            if ((minAge && age < minAge) || (maxAge && age > maxAge)) {
                hide = true;
            }

            // Apply visibility based on filters
            parentContainer.style.display = hide ? 'none' : '';
        });
    };

    const restoreSettings = () => {
        const allKeys = GM_listValues();
        allKeys.forEach(key => {
            if (key.includes(':')) {
                const [category, option] = key.split(':');
                const checkbox = document.querySelector(`input[value="${option}"]`);
                if (checkbox) checkbox.checked = GM_getValue(key, false);
            }
        });
    };

    waitForSettingsButton();
})();
