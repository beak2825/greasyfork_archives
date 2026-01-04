// ==UserScript==
// @name         Cartel Empire - Custom Chat Colors
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Changes the text color and main background color for each chat
// @author       Baccy
// @match        https://cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant GM.getValue
// @grant GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516069/Cartel%20Empire%20-%20Custom%20Chat%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/516069/Cartel%20Empire%20-%20Custom%20Chat%20Colors.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const settings = await GM.getValue('chat_settings', {tradeEnabled: false, tradeText: '', tradeBackground: '',
                                                         cartelEnabled: false, cartelText: '', cartelBackground: '',
                                                         globalEnabled: false, globalText: '', globalBackground: ''});

    if (settings.tradeEnabled && (settings.tradeText || settings.tradeBackground)) chatColors('Trade', settings.tradeText, settings.tradeBackground);
    if (settings.cartelEnabled && (settings.cartelText || settings.cartelBackground)) chatColors('Cartel', settings.cartelText, settings.cartelBackground);
    if (settings.globalEnabled && (settings.globalText || settings.globalBackground)) chatColors('Global', settings.globalText, settings.globalBackground);

    if (window.location.href.toLowerCase().includes('online/settings')) addSettingsTab('baccy-settings', 'Baccy\'s Userscripts', 'Baccy\'s Userscript Settings');

    function chatColors(chatName, textColor, backgroundColor) {
        let style = document.querySelector('#customChatStyles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'customChatStyles';
            document.head.appendChild(style);
        }

        const sheet = style.sheet;

        const chatContainer = document.querySelector(`#${chatName}Chat`);
        if (!chatContainer) return;

        if (textColor) {
            sheet.insertRule(`#${chatName}Chat a { color: ${textColor} !important; }`, sheet.cssRules.length);
            sheet.insertRule(`#${chatName}Chat .messageText { color: ${textColor} !important; }`, sheet.cssRules.length);
        }

        if (backgroundColor) {
            sheet.insertRule(`#${chatName}Chat .MessagesContainer { background-color: ${backgroundColor} !important; }`, sheet.cssRules.length);
        }
    }

    function addSettingsTab(id, header, name) {
        let navTabs = document.querySelector('#settingsNav > .nav-tabs');
        let tabContent = document.querySelector('#settingsNav > .tab-content');

        if (!navTabs || !tabContent) return;

        let button = document.createElement('button');
        button.id = `v-tab-${id}`;
        button.classList.add('nav-link', 'settings-nav-link', 'baccy-button');
        button.innerText = header;
        button.type = 'button';
        button.role = 'tab';
        button.setAttribute('data-bs-toggle', 'tab');
        button.setAttribute('data-bs-target', `#v-content-${id}`);
        button.setAttribute('aria-controls', `v-content-${id}`);
        button.setAttribute('tab', id);

        let tab = document.createElement('div');
        tab.id = `v-content-${id}`;
        tab.classList.add('tab-pane', 'fade');
        tab.setAttribute('role', 'tabpanel');
        tab.setAttribute('aria-labelledby', `v-tab-${id}`);
        let card = document.createElement('div');
        card.classList.add('card');
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'baccy-script-div');
        let heading = document.createElement('h5');
        heading.classList.add('h5');
        heading.innerText = name;

        let scripts = document.createElement('div');
        scripts.classList.add('card-text');

        let thisScript = document.createElement('div');
        thisScript.classList.add('card-text');
        thisScript.innerText = 'Chat Color Settings';
        thisScript.style.cssText = "font-weight: bold; color: white;  padding: 10px 15px; margin: 10px 0; border: 2px solid #444; border-radius: 5px; background-color: #333; cursor: pointer; text-align: center; display: inline-block;";

        scripts.appendChild(thisScript);

        let scriptBody = document.createElement('div');
        scriptBody.style.display = 'none';

        function createSetting(name, type, label) {
            let wrapper = document.createElement("div");
            wrapper.style.cssText = "margin-bottom: 10px; display: flex; align-items: center;";

            let text = document.createElement("label");
            text.innerText = label;
            text.style.cssText = "font-weight: normal; margin-right: 10px;";

            let input = document.createElement("input");
            input.type = type;
            if (type === 'checkbox') input.checked = settings[name];
            else input.value = settings[name];
            input.style.cssText = "width: 80px;";

            input.dataset.setting = name;

            wrapper.appendChild(text);
            wrapper.appendChild(input);
            return wrapper;
        }

        let tradeToggle = createSetting("tradeEnabled", "checkbox", "Enable Trade Chat");
        let tradeText = createSetting("tradeText", "text", "Trade Chat Text Color");
        let tradeBackground = createSetting("tradeBackground", "text", "Trade Chat Background Color");

        let cartelToggle = createSetting("cartelEnabled", "checkbox", "Enable Cartel Chat");
        let cartelText = createSetting("cartelText", "text", "Cartel Chat Text Color");
        let cartelBackground = createSetting("cartelBackground", "text", "Cartel Chat Background Color");

        let globalToggle = createSetting("globalEnabled", "checkbox", "Enable Global Chat");
        let globalText = createSetting("globalText", "text", "Global Chat Text Color");
        let globalBackground = createSetting("globalBackground", "text", "Global Chat Background Color");

        let saveButton = document.createElement("button");
        saveButton.innerText = "Save Chat Settings";
        saveButton.style.cssText = 'width: 150px; display: block; margin-top: 15px; padding: 10px; background-color: #444; color: #fff; border: none; cursor: pointer;';


        saveButton.addEventListener("click", async () => {
            let newSettings = {
                tradeEnabled: tradeToggle.querySelector("input").checked,
                tradeText: tradeText.querySelector("input").value,
                tradeBackground: tradeBackground.querySelector("input").value,

                cartelEnabled: cartelToggle.querySelector("input").checked,
                cartelText: cartelText.querySelector("input").value,
                cartelBackground: cartelBackground.querySelector("input").value,

                globalEnabled: globalToggle.querySelector("input").checked,
                globalText: globalText.querySelector("input").value,
                globalBackground: globalBackground.querySelector("input").value
            };

            await GM.setValue("chat_settings", newSettings);
            saveButton.innerText = 'Saved';
            setTimeout(() => {
                saveButton.innerText = 'Save Chat Settings';
            }, 1000);
        });

        scriptBody.appendChild(tradeToggle);
        scriptBody.appendChild(tradeText);
        scriptBody.appendChild(tradeBackground);
        scriptBody.appendChild(cartelToggle);
        scriptBody.appendChild(cartelText);
        scriptBody.appendChild(cartelBackground);
        scriptBody.appendChild(globalToggle);
        scriptBody.appendChild(globalText);
        scriptBody.appendChild(globalBackground);
        scriptBody.appendChild(saveButton);

        thisScript.addEventListener('click', () => {
            scriptBody.style.display = (scriptBody.style.display === 'none' || scriptBody.style.display === '') ? 'block' : 'none';
        });

        scripts.appendChild(scriptBody);

        if (!document.querySelector('.baccy-button')) navTabs.appendChild(button);

        if (!document.querySelector('.baccy-script-div')) {
            cardBody.appendChild(heading);
            cardBody.appendChild(scripts);
            card.appendChild(cardBody);
            tab.appendChild(card);
            tabContent.appendChild(tab);
        } else {
            const existingTab = document.querySelector('.baccy-script-div');
            if (existingTab) existingTab.appendChild(scripts);
        }
        
        function changeUrl() {
            let newUrl = window.location.href.split('?')[0] + `?t=${id}`;
            history.pushState(null, '', newUrl);
            updateTab();
        }
    
        button.addEventListener('click', changeUrl);
        
        function updateTab() {
            let match = window.location.href.match(/[?&]t=([^&]+)/);
            const tabSelected = match ? match[1] === id : false;

            button.classList.toggle('active', tabSelected);
            tab.classList.toggle('active', tabSelected);
            tab.classList.toggle('show', tabSelected);
            button.setAttribute('aria-selected', tabSelected.toString());
            button.setAttribute('tabindex', tabSelected ? '0' : '-1');
        }

        const observer = new MutationObserver(() => updateTab());
        observer.observe(document.body, { childList: true, subtree: true });

        updateTab();
    }

})();