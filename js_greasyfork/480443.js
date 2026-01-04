// ==UserScript==
// @name         Torn.com Enhanced Chat Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add customizable buttons to Torn.com chat
// @author       Callz [2188704]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480443/Torncom%20Enhanced%20Chat%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/480443/Torncom%20Enhanced%20Chat%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

const buttonCSS = `
    .custom-chat-button {
        background-color: #007BFF;
        color: white;
        padding: 2px 7px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        margin: 4px 6px;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        transition: background-color 0.3s ease;
        min-width: 80px;
        overflow: hidden;
        white-space: nowrap;
    }

    .custom-chat-button:hover {
        background-color: #0056b3;
    }

    .custom-ui-panel label {
        font-size: 20px;
        margin-bottom: 20px;
    }

    .custom-ui-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f5f5f5;
        padding: 20px;
        color: black;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        z-index: 9999999999;
        max-width: 70%;
    }

    .custom-ui-panel h3 {
        font-size: 20px;
        margin-bottom: 20px;
    }

    .custom-ui-panel input[type="text"],
    .custom-ui-panel select,
    .custom-ui-panel textarea {
        width: 90%;
        padding: 10px;
        margin-top:10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    .custom-ui-panel input[type="color"] {
        padding: 0;
    }

    .custom-ui-panel button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px 5px;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    .custom-ui-panel button#close-ui {
        background-color: #ccc;
        margin-right: 10px;
    }

    .custom-ui-panel button#close-ui:hover {
        background-color: #999;
    }

    .custom-ui-panel textarea {
        height: 100px;
        resize: vertical;
    }
    .custom-ui-panel hr {
        margin: 20px 0;
        border: 0;
        border-top: 1px solid #ccc; 
    }
    #chat-config-button {
       color:green;
   }
   #button-configs {
    max-height: 200px;
    overflow-y: scroll;
   }


`;

    function addCSS(cssString) {
        const style = document.createElement('style');
        style.textContent = cssString;
        document.head.append(style);
    }

    function getButtonConfigurations() {
        const defaultConfig = { buttons: [] };
        const config = localStorage.getItem('chatButtonConfig');
        return config ? JSON.parse(config) : defaultConfig;
    }

    function saveButtonConfigurations(config) {
        localStorage.setItem('chatButtonConfig', JSON.stringify(config));
        console.log('Saved configuration:', config);
    }

    function createUIPanel() {
        const panel = document.createElement('div');
        panel.className = 'custom-ui-panel';
        panel.innerHTML = `
        <h3>Chat Button Configuration</h3>
        <div id="button-configs"></div>
        <hr> <!-- Divider -->
        <div>
            <input type="text" id="button-text" placeholder="Button Text">
            <label for="button-color">Background Color:</label>
            <input type="color" id="button-color">
            <select id="button-condition">
                <option value="TradeChat">Trade Chat</option>
                <option value="HospitalChat">Hospital Chat</option>
                <option value="FactionChat">Faction Chat</option>
                <option value="CompanyChat">Company Chat</option>
                <option value="GlobalChat">Global Chat</option>
                <option value="UserChat">User Chat</option>
            </select>
            <textarea id="button-text-content" placeholder="Add the text here that should be pasted in chat. You can use {name} to get the name of the active chat"></textarea>
            <button id="add-button">Add Button</button>
            <button id="edit-button" style="display: none;">Edit Button</button>
        </div>
        <button id="close-ui">Close</button>

    `;
        document.body.appendChild(panel);

        document.getElementById('add-button').addEventListener('click', addNewButtonConfig);
        document.getElementById('edit-button').addEventListener('click', editButtonConfig);
        document.getElementById('close-ui').addEventListener('click', closeUI);
        populateButtonConfigs();
    }

    function populateButtonConfigs() {
        const configsContainer = document.getElementById('button-configs');
        configsContainer.innerHTML = '';
        const configs = getButtonConfigurations();

        configs.buttons.forEach((buttonConfig, index) => {
            let configDiv = document.createElement('div');
            configDiv.innerHTML = `
                <div>Text: ${buttonConfig.buttonText}</div>
                <div>Color: ${buttonConfig.backgroundColor}</div>
                <div>Condition: ${buttonConfig.condition}</div>
                <div>Message: ${buttonConfig.text}</div>
            `;

            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() { selectForEdit(index); });
            configDiv.appendChild(editButton);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() { deleteButtonConfig(index); });
            configDiv.appendChild(deleteButton);

            configsContainer.appendChild(configDiv);
        });
    }

    window.selectForEdit = function(index) {
        const config = getButtonConfigurations().buttons[index];
        document.getElementById('button-text').value = config.buttonText;
        document.getElementById('button-color').value = config.backgroundColor;
        document.getElementById('button-condition').value = config.condition;
        document.getElementById('button-text-content').value = config.text;

        document.getElementById('edit-button').style.display = 'block';
        document.getElementById('edit-button').setAttribute('data-edit-index', index);
    };

    window.deleteButtonConfig = function(index) {
        let config = getButtonConfigurations();
        config.buttons.splice(index, 1);
        saveButtonConfigurations(config);
        populateButtonConfigs();
    };

    function addNewButtonConfig() {
        const buttonText = document.getElementById('button-text').value;
        const backgroundColor = document.getElementById('button-color').value;
        const condition = document.getElementById('button-condition').value;
        const text = document.getElementById('button-text-content').value;

        let config = getButtonConfigurations();
        config.buttons.push({ buttonText, backgroundColor, condition, text });
        saveButtonConfigurations(config);
        populateButtonConfigs();
    }

    function editButtonConfig() {
        const index = parseInt(document.getElementById('edit-button').getAttribute('data-edit-index'), 10);
        const buttonText = document.getElementById('button-text').value;
        const backgroundColor = document.getElementById('button-color').value;
        const condition = document.getElementById('button-condition').value;
        const text = document.getElementById('button-text-content').value;

        let config = getButtonConfigurations();
        config.buttons[index] = { buttonText, backgroundColor, condition, text };
        saveButtonConfigurations(config);
        populateButtonConfigs();
    }

    function closeUI() {
        const panel = document.querySelector('.custom-ui-panel');
        if (panel) {
            panel.remove();
        }
    }

    function createConfigButton() {
        const settingsPanel = document.querySelector('.settings-panel___IZSDs');
        if (settingsPanel && !document.querySelector('#chat-config-button')) {
            let configButton = document.createElement('button');
            configButton.id = 'chat-config-button';
            configButton.textContent = 'Edit Chat Buttons';
            configButton.addEventListener('click', createUIPanel);
            configButton.style = '/* Add specific styles for the button here */';
            settingsPanel.appendChild(configButton);
        }
    }

    addCSS(buttonCSS);

    const chatContainerObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            createConfigButton();
            applyButtonConfigurations();
        });
    });

    const chatContainer = document.querySelector('#chatRoot');
    if (chatContainer) {
        chatContainerObserver.observe(chatContainer, { childList: true, subtree: true });
    }

    function applyButtonConfigurations() {
        const configs = getButtonConfigurations();
        document.querySelectorAll('.chat-box___mHm01').forEach(chatBox => {
            configs.buttons.forEach(buttonConfig => {
                const conditionFunc = conditions[buttonConfig.condition];
                if (conditionFunc && conditionFunc(chatBox) && !chatBox.querySelector(`[data-button-text="${buttonConfig.buttonText}"]`)) {
                    let button = document.createElement('button');
                    button.className = 'custom-chat-button';
                    button.innerText = buttonConfig.buttonText;
                    button.style.backgroundColor = buttonConfig.backgroundColor;
                    button.setAttribute('data-button-text', buttonConfig.buttonText);
                    button.addEventListener('click', () => addCustomText(chatBox, buttonConfig.text));

                    const filterContainer = chatBox.querySelector('.tt-chat-filter');
                    filterContainer.insertBefore(button, filterContainer.firstChild);
                }
            });
        });
    }

    const conditions = {
        TradeChat: chatBox => chatBox.querySelector('.chat-box-header__name___jIjjM').textContent === 'Trade',
        HospitalChat: chatBox => chatBox.querySelector('.chat-box-header__name___jIjjM').textContent === 'Hospital',
        FactionChat: chatBox => chatBox.querySelector('.chat-box-header__name___jIjjM').textContent === 'Faction',
        CompanyChat: chatBox => chatBox.querySelector('.chat-box-header__name___jIjjM').textContent === 'Company',
        GlobalChat: chatBox => chatBox.querySelector('.chat-box-header__name___jIjjM').textContent === 'Global',
        UserChat: chatBox => chatBox.querySelector('.chat-box-header__options___nTsMU'),
    };

    function addCustomText(chatBox, messageTemplate) {
        const chatTextarea = chatBox.querySelector('.chat-box-footer__textarea___liho_');
        const nameElement = chatBox.querySelector('.typography___Dc5WV');
        const name = nameElement ? nameElement.textContent.trim() : 'Trader';
        const message = messageTemplate.replace('{name}', name);

        if(chatTextarea) {
            chatTextarea.value = message;
        }
    }

    applyButtonConfigurations();

})();
