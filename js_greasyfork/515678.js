// ==UserScript==
// @name         Twitch Category, Tag, and Title Filter
// @version      3.8
// @author       Alyssa B. Morton
// @license      MIT
// @icon         https://www.twitch.tv/favicon.ico
// @namespace    https://violentmonkey.github.io/
// @match        https://www.twitch.tv/directory/all
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @description  Hides specified categories, tags, and titles from live channels on the Twitch directory page for a cleaner viewing experience. Preserves necessary elements like images and dynamically removes empty layouts.
// @supportURL   https://greasyfork.org/en/scripts/515678-twitch-category-and-tag-filter
// @downloadURL https://update.greasyfork.org/scripts/515678/Twitch%20Category%2C%20Tag%2C%20and%20Title%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/515678/Twitch%20Category%2C%20Tag%2C%20and%20Title%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default values to hide if no previous settings are saved
    const DEFAULT_GAMES_TO_HIDE = ["example1", "example2"];
    const DEFAULT_TAGS_TO_HIDE = ["example1", "example2"];
    const DEFAULT_TITLES_TO_HIDE = ["example1", "example2"];

    // Retrieve saved values or initialize with defaults
    const gamesToHide = GM_getValue('gamesToHide', DEFAULT_GAMES_TO_HIDE);
    const tagsToHide = GM_getValue('tagsToHide', DEFAULT_TAGS_TO_HIDE);
    const titlesToHide = GM_getValue('titlesToHide', DEFAULT_TITLES_TO_HIDE);

    // Show a toast notification with custom message
    const showToast = (message, type = 'info', duration = 3000) => {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = type === 'success' ? '#4CAF50' :
                                      type === 'warning' ? '#FFC107' : '#8A2BE2';
        toast.style.color = 'white';
        toast.style.padding = '10px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '9999';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    };

    // Create a UI for configuring settings via a menu command
    const updateSettingsUI = () => {
        GM_registerMenuCommand("Configure Twitch Filter", () => {
            let settingsHTML = `
                <h3>Configure Twitch Filter Settings</h3>
                <label for="gamesToHide">Games to Hide (comma-separated):</label><br>
                <textarea id="gamesToHide" style="width: 100%;" rows="5">${gamesToHide.join(', ')}</textarea><br><br>
                <label for="tagsToHide">Tags to Hide (comma-separated):</label><br>
                <textarea id="tagsToHide" style="width: 100%;" rows="5">${tagsToHide.join(', ')}</textarea><br><br>
                <label for="titlesToHide">Titles to Hide (comma-separated):</label><br>
                <textarea id="titlesToHide" style="width: 100%;" rows="5">${titlesToHide.join(', ')}</textarea><br><br>
                <button id="saveSettings" style="background-color: #8A2BE2; color: white; padding: 10px 20px; border: none; cursor: pointer;">Save Settings</button>
                <button id="resetDefaults" style="background-color: #333; color: white; padding: 10px 20px; border: none; cursor: pointer;">Reset to Minimal Defaults</button>
            `;

            const settingsWindow = window.open('', 'Twitch Filter Settings', 'width=400,height=400');
            settingsWindow.document.body.innerHTML = settingsHTML;

            // Custom styles for settings UI
            const style = `
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2E2E2E;
                    color: white;
                    margin: 10px;
                    padding: 10px;
                }
                h3 {
                    font-size: 20px;
                    margin-bottom: 15px;
                    color: #8A2BE2;
                }
                label {
                    font-size: 14px;
                    color: #E0E0E0;
                    margin-bottom: 5px;
                }
                textarea {
                    font-size: 14px;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #8A2BE2;
                    margin-bottom: 10px;
                    width: 100%;
                    background-color: #333;
                    color: white;
                }
                button {
                    font-size: 14px;
                    border-radius: 4px;
                    margin-top: 10px;
                    margin-right: 10px;
                    padding: 10px 20px;
                }
                button:hover {
                    opacity: 0.9;
                }
                #saveSettings {
                    background-color: #8A2BE2;
                }
                #resetDefaults {
                    background-color: #333;
                }
            `;

            const styleTag = settingsWindow.document.createElement('style');
            styleTag.textContent = style;
            settingsWindow.document.head.appendChild(styleTag);

            // Save settings event
            settingsWindow.document.getElementById('saveSettings').addEventListener('click', () => {
                const newGamesToHide = settingsWindow.document.getElementById('gamesToHide').value.split(',').map(item => item.trim());
                const newTagsToHide = settingsWindow.document.getElementById('tagsToHide').value.split(',').map(item => item.trim());
                const newTitlesToHide = settingsWindow.document.getElementById('titlesToHide').value.split(',').map(item => item.trim());

                if (!newGamesToHide.length || !newTagsToHide.length || !newTitlesToHide.length) {
                    alert('Please ensure all fields are filled.');
                    return;
                }

                GM_setValue('gamesToHide', newGamesToHide);
                GM_setValue('tagsToHide', newTagsToHide);
                GM_setValue('titlesToHide', newTitlesToHide);
                settingsWindow.close();
                showToast('Settings saved successfully!', 'success');
                location.reload();
            });

            // Reset to defaults event
            settingsWindow.document.getElementById('resetDefaults').addEventListener('click', () => {
                const confirmation = window.confirm('Are you sure you want to reset the filter settings to the default values? This will remove all your customizations!');
                if (confirmation) {
                    GM_setValue('gamesToHide', DEFAULT_GAMES_TO_HIDE);
                    GM_setValue('tagsToHide', DEFAULT_TAGS_TO_HIDE);
                    GM_setValue('titlesToHide', DEFAULT_TITLES_TO_HIDE);
                    settingsWindow.close();
                    showToast('Settings reset to minimal defaults!', 'warning');
                    location.reload();
                }
            });
        });
    };

    // General function to filter and hide elements based on specific conditions
    const applyFilter = (selector, itemsToHide, valueExtractor, layoutSelector) => {
        document.querySelectorAll(selector).forEach(element => {
            const extractedValue = valueExtractor(element);
            if (extractedValue && itemsToHide.some(item => extractedValue.includes(item.toLowerCase()))) {
                const layoutElement = element.closest(layoutSelector);
                if (layoutElement) {
                    layoutElement.style.display = 'none'; // Hide the entire layout
                }
            }
        });
    };

    // Function to apply all filters
    const applyFilters = () => {
        applyFilter(
            'div[data-target="directory-game__card_container"]',
            gamesToHide.map(item => item.toLowerCase()),
            el => el.querySelector('a[data-test-selector="GameLink"][data-a-target="preview-card-game-link"]')?.textContent.trim().toLowerCase(),
            'div[data-target="directory-game__card_container"]' // The layout to hide
        );

    // Apply tag filter to hide layouts containing specified tags
        applyFilter(
            'button[data-a-target]', // Tag elements
            tagsToHide.map(item => item.toLowerCase()), // List of tags to hide
            el => el.textContent.trim().toLowerCase(), // Extract text of the tag
            'div[data-target="directory-game__card_container"]' // The layout to hide
        );


        applyFilter(
            'h3',
            titlesToHide.map(item => item.toLowerCase()),
            el => el.textContent.trim().toLowerCase(),
            'div[data-target="directory-game__card_container"]' // The layout to hide
        );
    };

    // Remove empty elements
    const removeEmptyElements = () => {
        document.querySelectorAll('[data-target=""]:empty').forEach(element => element.remove());
    };

    // Remove hidden containers (elements with display: none)
    const removeHiddenContainers = () => {
        document.querySelectorAll('div[style="display: none;"]').forEach(element => element.remove());
    };

    // Set up mutation observer to detect changes in the DOM
    const observer = new MutationObserver(() => {
        applyFilters();
        removeEmptyElements();
        removeHiddenContainers();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Renumber elements based on visibility
    const renumberOrder = () => {
        const visibleElements = Array.from(document.querySelectorAll('[data-target]')).filter(element => element.style.display !== 'none');
        visibleElements.forEach((element, index) => {
            element.setAttribute('data-order', index + 1);
        });
    };

    // Initialize settings UI
    updateSettingsUI();
})();
