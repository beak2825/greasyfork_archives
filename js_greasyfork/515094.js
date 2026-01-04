// ==UserScript==
// @name         Append ActionType to uiClick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Appends actionType value after uiClick text
// @match        https://flash.lighthouse.music.amazon.dev/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/515094/Append%20ActionType%20to%20uiClick.user.js
// @updateURL https://update.greasyfork.org/scripts/515094/Append%20ActionType%20to%20uiClick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyElements() {
        console.log('Starting modifyElements function');

        // Find all elements with class that starts with 'awsui_root_'
        const rootElements = Array.from(document.querySelectorAll('[class*="awsui_root_"]')).filter(element => {
            return Array.from(element.classList).some(className =>
                                                      className.includes('awsui_root_') && !className.includes(' ')
                                                     );
        });
        console.log(`Found ${rootElements.length} root elements`);

        rootElements.forEach((rootElement, index) => {
            if (rootElement.className.includes(' ')) return;
            console.log(`Processing root element ${index + 1}:`, rootElement);

            // Find header text elements within this root
            const headerElements = rootElement.querySelectorAll('[class*="awsui_header-text_"]');

            console.log(`Found ${headerElements.length} header elements in root ${index + 1}`);

            headerElements.forEach(headerElement => {
                console.log('Header element text:', headerElement.textContent);

                if (headerElement.textContent.includes('uiClick')) {
                    console.log('Found uiClick in header');

                    // Check if it's already been modified
                    const currentText = headerElement.textContent;
                    if (currentText.split('uiClick_').length > 2) {
                        console.log('Header already modified, skipping');
                        return;
                    }

                    // Find the actionType value
                    const actionTypeLabel = Array.from(rootElement.querySelectorAll('strong')).find(
                        strong => strong.textContent === 'actionType'
                    );

                    if (actionTypeLabel) {
                        console.log('Found actionType label');

                        // Get the actionType value from the next sibling strong element
                        const actionTypeValueElement = actionTypeLabel.closest('li').querySelector('span > strong');
                        if (actionTypeValueElement) {
                            const actionTypeValue = actionTypeValueElement.textContent.replace(/['"]/g, '');
                            console.log('ActionType value:', actionTypeValue);

                            // Only modify if it hasn't been modified before
                            if (!currentText.includes(`uiClick_${actionTypeValue}`)) {
                                headerElement.textContent = currentText.replace(
                                    'uiClick',
                                    `uiClick_${actionTypeValue}`
                                );
                                console.log('Modified header text to:', headerElement.textContent);
                                return true;
                            }
                        }
                    }
                }
            });
        });
    }

    function createButton() {
        console.log('Creating button...');

        if (document.getElementById('actionTypeButton')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'actionTypeButton';
        button.textContent = 'Append ActionType';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            pointer-events: auto;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#45a049';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4CAF50';
        });

        button.addEventListener('click', modifyElements);

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
        `;

        container.appendChild(button);
        document.body.appendChild(container);
        console.log('Button created and added to DOM');
    }

    // Initialize button
    document.addEventListener('DOMContentLoaded', createButton);
    window.addEventListener('load', createButton);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(createButton, 1000);
    }
})();