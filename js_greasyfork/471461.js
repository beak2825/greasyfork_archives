// ==UserScript==
// @name         AudiobookBay Comments Counter & Custom Categories Filter
// @namespace    https://audiobookbay.is
// @version      0.6.1
// @description  Display the number of comments on each audiobook entry and hide posts based on custom categories
// @author       YourName
// @match        https://audiobookbay.is/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471461/AudiobookBay%20Comments%20Counter%20%20Custom%20Categories%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471461/AudiobookBay%20Comments%20Counter%20%20Custom%20Categories%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Settings: Change these to customize the script behavior
    const showComments = true; // Set to false if you don't want to display comments

    // Define custom categories and their display names
    const customCategories = {
        lgbt: "LGBT",
        sciFi: "Sci-Fi",
        romance: "Romance",
        fantasy: "Fantasy",
      	adults: "Adults"
        // Add more categories as needed
    };

    function getCommentCount(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                // Parse the HTML data and extract the number of comments
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const commentsElement = htmlDoc.querySelector('#comments span[itemprop="reviewCount"]');
                const commentCount = commentsElement ? commentsElement.textContent : '0';
                callback(commentCount);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                callback('N/A');
            });
    }

    // Function to process each audiobook entry and display the comment count
    function processAudiobookEntry(entry) {
        const linkElement = entry.querySelector('a[href*="/abss/"]');
        if (linkElement && !linkElement.classList.contains('comment-checked')) {
            linkElement.classList.add('comment-checked');
            const audiobookURL = linkElement.href;
            getCommentCount(audiobookURL, commentCount => {
                if (showComments) {
                    const postInfoElement = entry.querySelector('.postInfo');
                    if (postInfoElement) {
                        // Check if the current URL is the main page or not
                        const commentDisplay = document.createElement('span');
                        const isMainPage = window.location.href === 'https://audiobookbay.is/';
                        if (!isMainPage) {
                          const br = document.createElement('br');
        									postInfoElement.appendChild(br);
                        }
                      
      
                        commentDisplay.textContent = `Comments: ${commentCount}`;

        

                        postInfoElement.appendChild(commentDisplay);
                    }
                }
            });
        }

        // Hide or show posts based on custom categories
        const postInfoElement = entry.querySelector('.postInfo');
        if (postInfoElement) {
            let shouldHide = false;
            for (const category in customCategories) {
                if (customCategories.hasOwnProperty(category)) {
                    const categoryDisplayName = customCategories[category];
                    const categoryCheckbox = document.getElementById(`showHide${categoryDisplayName}`);
                    if (categoryCheckbox && !categoryCheckbox.checked && postInfoElement.textContent.toLowerCase().includes(category)) {
                        shouldHide = true;
                        break;
                    }
                }
            }

            entry.style.display = shouldHide ? 'none' : 'block';
        }
    }

    // Function to process all audiobook entries on the page
    function processAudiobookEntries(entries) {
        entries.forEach(processAudiobookEntry);
    }

  	

  
    // Initial processing when the page is loaded
    const audiobookEntries = document.querySelectorAll('.post');
    processAudiobookEntries(audiobookEntries);

    // Observe changes in the page content and process new audiobook entries
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('post')) {
                        processAudiobookEntry(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Function to save the custom category checkboxes state to localStorage
    function saveCheckboxStateToLocalStorage() {
        for (const category in customCategories) {
            if (customCategories.hasOwnProperty(category)) {
                const categoryDisplayName = customCategories[category];
                const categoryCheckbox = document.getElementById(`showHide${categoryDisplayName}`);
                if (categoryCheckbox) {
                    localStorage.setItem(`showHide${categoryDisplayName}`, categoryCheckbox.checked);
                }
            }
        }
    }

    // Function to load the custom category checkboxes state from localStorage
    function loadCheckboxStateFromLocalStorage() {
        for (const category in customCategories) {
            if (customCategories.hasOwnProperty(category)) {
                const categoryDisplayName = customCategories[category];
                const categoryCheckbox = document.getElementById(`showHide${categoryDisplayName}`);
                if (categoryCheckbox) {
                    const savedState = localStorage.getItem(`showHide${categoryDisplayName}`);
                    if (savedState !== null) {
                        categoryCheckbox.checked = savedState === 'true';
                    }
                  processAudiobookEntries(audiobookEntries); // Apply filtering based on loaded state
                }
            }
        }
    }

    // Create the settings toolbar and add it to the page
    function createSettingsToolbar() {
        const settingsToolbar = document.createElement('div');
        settingsToolbar.style.backgroundColor = '#f0f0f0';
        settingsToolbar.style.padding = '10px';
        settingsToolbar.style.position = 'fixed';
        settingsToolbar.style.bottom = '10px';
        settingsToolbar.style.right = '10px';

        // Add a header for the settings toolbar
        const settingsHeader = document.createElement('h3');
        settingsHeader.textContent = 'Custom Categories Filter';
        settingsToolbar.appendChild(settingsHeader);

        // Create and add checkboxes for each custom category
        for (const category in customCategories) {
            if (customCategories.hasOwnProperty(category)) {
                const categoryDisplayName = customCategories[category];
                const categoryCheckbox = document.createElement('input');
                categoryCheckbox.type = 'checkbox';
                categoryCheckbox.id = `showHide${categoryDisplayName}`;
                categoryCheckbox.checked = true; // Default is checked
                categoryCheckbox.style.marginRight = '5px';
                categoryCheckbox.addEventListener('change', () => {
                    processAudiobookEntries(audiobookEntries);
                    saveCheckboxStateToLocalStorage();
                });

                const categoryLabel = document.createElement('label');
                categoryLabel.htmlFor = `showHide${categoryDisplayName}`;
                categoryLabel.textContent = categoryDisplayName;

                settingsToolbar.appendChild(categoryCheckbox);
                settingsToolbar.appendChild(categoryLabel);
            }
        }

        document.body.appendChild(settingsToolbar);
    }

    createSettingsToolbar();

    // Load the saved state and apply filtering when the page loads
    loadCheckboxStateFromLocalStorage();

    // Add a listener to save the checkbox states when the page is being unloaded
    window.addEventListener('beforeunload', () => {
        saveCheckboxStateToLocalStorage();
    });
})();