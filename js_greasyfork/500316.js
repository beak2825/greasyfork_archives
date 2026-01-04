// ==UserScript==
// @name         Torn Daily Checklist
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @author       Legaci [2100546]
// @description  Prompt for API key if not stored in local storage and show a checklist
// @match        *://www.torn.com/*
// @exclude      *://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500316/Torn%20Daily%20Checklist.user.js
// @updateURL https://update.greasyfork.org/scripts/500316/Torn%20Daily%20Checklist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const prefix = 'ldt_';
    const contentBody = document.querySelector('.content-wrapper');

    // Utility function to get date in YYYY-MM-DD format
    function getDateYMD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to create the styled popup for API key input
    function createApiKeyPopup() {
        // Check if the popup already exists and remove it
        const existingPopup = document.getElementById('api-key-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create the popup container
        const popup = document.createElement('div');
        popup.id = 'api-key-popup';
        popup.style.backgroundColor = '#2a2a2a';
        popup.style.border = '1px solid #444';
        popup.style.borderRadius = '5px';
        popup.style.padding = '10px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.textAlign = 'center';
        popup.style.margin = '10px auto';
        popup.style.position = 'relative';
        popup.style.zIndex = '10000';

        // Create the title for the popup
        const title = document.createElement('h4');
        title.textContent = "Legaci's Daily Checklist";
        title.style.marginBottom = '10px';
        title.style.color = '#fff';
        popup.appendChild(title);

        // Create the input field for the API key
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your Torn API key';
        input.style.width = 'calc(100% - 20px)';
        input.style.padding = '10px';
        input.style.margin = '5px 0';
        input.style.border = '1px solid #666';
        input.style.borderRadius = '5px';
        input.style.fontSize = 'inherit';
        input.style.backgroundColor = '#3a3a3a';
        input.style.color = '#fff';
        popup.appendChild(input);

        // Create the submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.padding = '10px 20px';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = '#fff';
        submitButton.style.fontSize = 'inherit';
        submitButton.style.cursor = 'pointer';
        submitButton.style.marginTop = '10px';
        popup.appendChild(submitButton);

        // Add event listener to the submit button
        submitButton.addEventListener('click', () => {
            const apiKey = input.value.trim();
            validateApiKey(apiKey);
        });

        // Append the popup to the main content wrapper
        if (contentBody) {
            contentBody.insertBefore(popup, contentBody.firstChild);
        } else {
            console.error('Unable to find element with class "content-title".');
        }
    }

    function validateApiKey(apiKey) {
        if (!apiKey) {
            alert('Please enter a valid API key. It appears no api key has been supplied.');
        } else if (apiKey.length !== 16) {
            alert('Please enter a valid API key. A valid key consists of 16 alphanumeric characters.');
        } else {
            localStorage.setItem(prefix + 'tornApiKey', apiKey);
            document.getElementById('api-key-popup').remove();
            createChecklist();
        }
    }

    function addReopenButton() {
        // Create the reopen button
        const reopenButton = document.createElement('button');
        reopenButton.textContent = 'Change API Key';
        reopenButton.style.padding = '10px 20px';
        reopenButton.style.margin = '10px 0';
        reopenButton.style.border = 'none';
        reopenButton.style.borderRadius = '5px';
        reopenButton.style.backgroundColor = '#f39c12';
        reopenButton.style.color = '#fff';
        reopenButton.style.fontSize = 'inherit';
        reopenButton.style.cursor = 'pointer';
        reopenButton.style.zIndex = '10000';

        // Add event listener to the reopen button
        reopenButton.addEventListener('click', () => {
            localStorage.removeItem(prefix + 'tornApiKey');
            createApiKeyPopup();
        });

        // Append the reopen button to the body
        contentBody.appendChild(reopenButton);
    }

    function createChecklist() {
        const apiKey = localStorage.getItem(prefix + 'tornApiKey');

        if (!apiKey) {
            return;
        }

        // Create the checklist container
        const checklist = document.createElement('div');
        checklist.id = 'checklist';
        checklist.style.backgroundColor = '#2a2a2a';
        checklist.style.border = '1px solid #444';
        checklist.style.borderRadius = '5px';
        checklist.style.padding = '10px';
        checklist.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        checklist.style.margin = '10px auto';
        checklist.style.position = 'relative';
        checklist.style.zIndex = '10000';

        // Create the title container for the checklist
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.marginBottom = '10px';
        checklist.appendChild(titleContainer);

        // Create the title for the checklist
        const checklistTitle = document.createElement('h4');
        checklistTitle.textContent = "Daily Checklist";
        checklistTitle.style.color = '#fff';
        checklistTitle.style.margin = '0';
        titleContainer.appendChild(checklistTitle);

        // Add the buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '5px';
        titleContainer.appendChild(buttonsContainer);

        // Add the "Change API Key" button
        const changeApiKeyButton = createButton('Change API Key', '#f39c12', () => {
            localStorage.removeItem(prefix + 'tornApiKey');
            checklist.remove();
            createApiKeyPopup();
        });
        buttonsContainer.appendChild(changeApiKeyButton);

        // Add the "Options" button
        const optionsButton = createButton('Options', '#3498db', () => {
            showOptionsModal();
        });
        buttonsContainer.appendChild(optionsButton);

        // Create the flex container for todos
        const todosContainer = document.createElement('div');
        todosContainer.style.display = 'flex';
        todosContainer.style.flexWrap = 'wrap';
        todosContainer.style.gap = '5px';
        checklist.appendChild(todosContainer);

        // Fetch the checklist data from the API
        fetch(`https://api.torn.com/user/?selections=personalstats,refills,cooldowns,bars&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const todos = [];
                const options = JSON.parse(localStorage.getItem(prefix + 'options')) || {
                    showShopItems: true,
                    showBloodbags: true,
                    showEnergyRefill: true,
                    showNerveRefill: true
                };

                const shopItemsBought = data.personalstats.cityitemsbought;
                const today = getDateYMD(new Date());

                const storedData = JSON.parse(localStorage.getItem(prefix + 'shopItemsBought'));
                if (options.showShopItems) {
                    if (storedData) {
                        const { date, amount } = storedData;
                        if (shopItemsBought > amount) {
                            localStorage.setItem(prefix + 'shopItemsBought', JSON.stringify({ date: today, amount: shopItemsBought }));
                        } else if (date !== today) {
                            todos.push('Buy from city shops');
                        }
                    } else {
                        localStorage.setItem(prefix + 'shopItemsBought', JSON.stringify({ date: today, amount: shopItemsBought }));
                        todos.push('Buy from city shops');
                    }
                }

            console.log(data.life)

                if (options.showBloodbags && data.life.current >= (data.life.increment*5) && data.cooldowns.medical === 0) {
                    todos.push('Fill 3x Bloodbags');
                }
                if (options.showEnergyRefill && !data.refills.energy_refill_used) {
                    todos.push('Refill Energy Bar');
                }
                if (options.showNerveRefill && !data.refills.nerve_refill_used) {
                    todos.push('Refill Nerve Bar');
                }

                // Display the todos
                if (todos.length === 0) {
                    const noTodosMessage = document.createElement('div');
                    noTodosMessage.textContent = 'Currently nothing to do';
                    noTodosMessage.style.color = '#fff';
                    todosContainer.appendChild(noTodosMessage);
                } else {
                    todos.forEach(todo => {
                        const todoItem = document.createElement('div');
                        todoItem.textContent = todo;
                        todoItem.style.padding = '5px 10px';
                        todoItem.style.border = '1px solid #666';
                        todoItem.style.borderRadius = '5px';
                        todoItem.style.backgroundColor = '#3a3a3a';
                        todoItem.style.color = '#fff';
                        todoItem.style.fontSize = '12px';
                        todosContainer.appendChild(todoItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching the checklist data:', error);
            });

        // Append the checklist to the main content wrapper
        if (contentBody) {
            contentBody.insertBefore(checklist, contentBody.firstChild);
        } else {
            console.error('Unable to find element with class "content-title".');
        }
    }

    function createButton(text, color, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = color;
        button.style.color = '#fff';
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }

    function showOptionsModal() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '10001';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#2a2a2a';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.minWidth = '300px';

        const optionsTitle = document.createElement('h4');
        optionsTitle.textContent = 'Options';
        optionsTitle.style.color = '#fff';
        optionsTitle.style.marginTop = '0';
        modalContent.appendChild(optionsTitle);

        const options = [
            { id: 'showShopItems', label: 'Show Shop Items' },
            { id: 'showBloodbags', label: 'Show Bloodbags' },
            { id: 'showEnergyRefill', label: 'Show Energy Refill' },
            { id: 'showNerveRefill', label: 'Show Nerve Refill' }
        ];

        const savedOptions = JSON.parse(localStorage.getItem(prefix + 'options')) || {};

        options.forEach(option => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.marginBottom = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option.id;
            checkbox.checked = savedOptions[option.id] !== false;
            checkbox.addEventListener('change', () => {
                savedOptions[option.id] = checkbox.checked;
                localStorage.setItem(prefix + 'options', JSON.stringify(savedOptions));
            });

            const label = document.createElement('label');
            label.htmlFor = option.id;
            label.textContent = option.label;
            label.style.color = '#fff';
            label.style.marginLeft = '10px';

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            modalContent.appendChild(checkboxContainer);
        });

        const closeButton = createButton('Close', '#e74c3c', () => {
            document.body.removeChild(modal);
            document.getElementById('checklist').remove();
            createChecklist();
        });
        closeButton.style.marginTop = '10px';
        modalContent.appendChild(closeButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Check if the API key is stored in local storage
    const apiKey = localStorage.getItem(prefix + 'tornApiKey');

    if (!apiKey) {
        createApiKeyPopup();
    } else {
        createChecklist();
    }
})();
