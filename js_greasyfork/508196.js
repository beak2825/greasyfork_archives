// ==UserScript==
// @name         Add Extra Tabs to Google Docs/Slides
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add extra tabs for Drawing and Erase by Lines to Google Docs and Slides
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508196/Add%20Extra%20Tabs%20to%20Google%20DocsSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/508196/Add%20Extra%20Tabs%20to%20Google%20DocsSlides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomTabs() {
        // Wait for the Google Docs/Slides page to fully load
        const interval = setInterval(() => {
            // Select the toolbar or relevant section where you want to add the tabs
            const toolbar = document.querySelector('.kix-appview-editor');

            if (toolbar) {
                // Clear the interval once the toolbar is found
                clearInterval(interval);

                // Create a container for the new tabs
                const customTabsContainer = document.createElement('div');
                customTabsContainer.className = 'custom-tabs-container';

                // Create the "Drawing" tab
                const drawingTab = document.createElement('div');
                drawingTab.className = 'custom-tab';
                drawingTab.textContent = 'Drawing';
                drawingTab.style.cursor = 'pointer';
                drawingTab.onclick = function() {
                    alert('Drawing tab clicked! Implement drawing functionality here.');
                };

                // Create the "Erase by Lines" tab
                const eraseTab = document.createElement('div');
                eraseTab.className = 'custom-tab';
                eraseTab.textContent = 'Erase by Lines';
                eraseTab.style.cursor = 'pointer';
                eraseTab.onclick = function() {
                    alert('Erase by Lines tab clicked! Implement erasing functionality here.');
                };

                // Append the new tabs to the container
                customTabsContainer.appendChild(drawingTab);
                customTabsContainer.appendChild(eraseTab);

                // Append the container to the toolbar
                toolbar.appendChild(customTabsContainer);

                // Add basic styling for the custom tabs
                const style = document.createElement('style');
                style.textContent = `
                    .custom-tabs-container {
                        display: flex;
                        gap: 10px;
                        padding: 10px;
                        background-color: #f1f1f1;
                    }
                    .custom-tab {
                        padding: 5px 10px;
                        background-color: #ddd;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                    .custom-tab:hover {
                        background-color: #bbb;
                    }
                `;
                document.head.appendChild(style);
            }
        }, 1000); // Check every second
    }

    // Add custom tabs when the page loads
    window.addEventListener('load', addCustomTabs);
})();
