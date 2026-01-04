// ==UserScript==
// @name         Cartel Empire - Quick Items
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Allows you use items on certain pages other than your inventory. Navigate to Cartel Empire's settings and click on Baccy's Userscripts to enable the items you want. Open your inventory and cartel armory to get button data and item quantities.
// @author       Baccy
// @match        https://cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530604/Cartel%20Empire%20-%20Quick%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/530604/Cartel%20Empire%20-%20Quick%20Items.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let backgroundColor;
    let textColor;

    if (document.querySelector('#mainBackground > .container > .row > .col-12')) createPageButtons();
    else {
        const observer = new MutationObserver(mutations => {
            if (document.querySelector('#mainBackground > .container > .row > .col-12')) {
                createPageButtons();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function createPageButtons() {
        const itemIcons = {
            corana: '/images/items/100.png',
            mexcal: '/images/items/101.png',
            blancoda: '/images/items/102.png',
            repose: '/images/items/103.png',
            anejo: '/images/items/104.png',
            raicilla: '/images/items/105.png',
            cocaine: '/images/items/301.png',
            cannabis: '/images/items/300.png',
            personalFavour: '/images/items/3.png',
            bandage: '/images/items/200.png',
            smallMedical: '/images/items/201.png',
            largeMedical: '/images/items/202.png',
            basicTrauma: '/images/items/203.png',
            largeTrauma: '/images/items/204.png',
            taintedCocaine: '/images/items/210.png',
            taintedCannabis: '/images/items/211.png'
        };

        let theme = document.documentElement.getAttribute('data-bs-theme');
        if (theme === 'light') {
            backgroundColor = '#fff';
            textColor = '#000';
        } else if (theme === 'dark') {
            backgroundColor = '#2b3035';
            textColor = '#fff';
        }

        const pageButtons = await GM.getValue('quickItemOptions', {});
        const currentUrl = window.location.href.toLowerCase();
        const matchedKey = Object.keys(pageButtons).find(key => currentUrl.includes(key));
        if (!matchedKey || pageButtons[matchedKey].length === 0) return;

        let useItemData = [];
        let armoryUseItemData = [];
        const inventoryArmoryOptions = await GM.getValue('inventoryArmoryQuickItems', {inventoryDisabled: false, armoryDisabled: false});
        if (inventoryArmoryOptions.inventoryDisabled && inventoryArmoryOptions.armoryDisabled) return;
        if (!inventoryArmoryOptions.inventoryDisabled) useItemData = await GM.getValue('useItemData', []);
        if (!inventoryArmoryOptions.armoryDisabled) armoryUseItemData = await GM.getValue('armoryUseItemData', []);
        if (useItemData.length === 0 && armoryUseItemData.length === 0) return;

        const openState = await GM.getValue('openState', {currentState: false, storeState: false});

        const targetElement = document.querySelector('#mainBackground > .container > .row > .col-12');
        if (!targetElement) return;

        const parent = document.createElement('div');
        parent.className = 'button-section mb-2';

        const header = document.createElement('div');
        header.className = 'header-toggle';
        header.textContent = 'Quick Items';
        header.style.cssText = `background-color: #212529; color: white; font-size: 12px; padding: 5px; cursor: pointer; text-align: center; border-radius: 5px;`;

        const container = document.createElement('div');
        container.className = 'gap-2 d-flex flex-wrap';
        container.style.cssText = `background-color: ${backgroundColor}; color: ${textColor}; padding: 10px;`;
        container.style.setProperty('display', openState.currentState ? 'flex' : 'none', 'important');

        const statusElement = document.createElement('div');
        statusElement.className = 'flex-wrap d-flex gap-2 status-msg-container';
        statusElement.style.cssText = `display: none !important; background-color: ${backgroundColor}; color: ${textColor}; padding: 10px;`;

        parent.appendChild(header);
        parent.appendChild(container);
        parent.appendChild(statusElement);

        let isVisible = openState.currentState ? true : false;
        header.addEventListener('click', async () => {
            isVisible = !isVisible;
            container.style.setProperty('display', isVisible ? 'flex' : 'none', 'important');
            statusElement.removeAttribute('style');
            statusElement.style.cssText = `display: none !important; background-color: ${backgroundColor}; color: ${textColor}; padding: 10px;`;
            if (openState.storeState) {
                openState.currentState = isVisible;
                await GM.setValue('openState', openState);
            }
        });

        const addButtons = (items, postUrl, borderColor) => {
            const itemsForPage = items.filter(item => pageButtons[matchedKey]?.includes(item.key));
            itemsForPage.forEach(item => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `display: flex; flex-direction: column; align-items: center; margin: 5px;`;

                const button = document.createElement('button');
                const attributes = item.buttonAttributes;
                Object.entries(attributes).forEach(([attr, value]) => {
                    button.setAttribute(attr, value);
                });
                button.style.cssText = `display: block; cursor: pointer; background-color: #232323; width: auto; border: 1px solid ${borderColor}; color: ${textColor}; transition: background-color 0.3s, border-color 0.3s; text-align: center; border-radius: 5px;`;
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = '#444';
                    button.style.borderColor = '#fff';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = '#232323';
                    button.style.borderColor = borderColor;
                });
                button.addEventListener('click', () => useItemClicked(postUrl, button));

                const icon = document.createElement('img');
                icon.src = 'https://cartelempire.online' + itemIcons[item.key];
                icon.alt = item.key;
                icon.style.cssText = 'width: 60px; margin-bottom: 5px;';

                const quantity = document.createElement('span');
                quantity.textContent = `${item.itemQuantity}`;
                quantity.style.cssText = `font-size: 12px; color: ${textColor};`;

                button.prepend(icon);
                wrapper.appendChild(button);
                wrapper.appendChild(quantity);
                container.appendChild(wrapper);
            });
        };
        addButtons(useItemData, '/Inventory', '#ccc');
        addButtons(armoryUseItemData, '/Cartel/Armory', 'red');
        targetElement.prepend(parent);
    }

    function useItemClicked(postUrl, button) {
        let id;
        if (postUrl === '/Inventory') id = button.getAttribute('id');
        else if (postUrl === '/Cartel/Armory') id = button.getAttribute('itemid');
        fetch(`https://cartelempire.online${postUrl}/Use?id=${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
            if (data.status === 200) {
                const statusElement = document.querySelector('.status-msg-container')
                if (statusElement) {
                    statusElement.removeAttribute('style');
                    statusElement.style.cssText = `display: block !important; background-color: ${backgroundColor}; color: ${textColor}; padding: 10px;`;
                    if (data.statusMsg) statusElement.innerText = data.statusMsg.success || data.statusMsg.error || '';
                }
            }
        });
    }

    if (window.location.href.toLowerCase().includes('cartel/armory') || window.location.href.toLowerCase().includes('inventory')) {
        const items = {
            corana: 'Drink Corana Beer',
            mexcal: 'Drink Mexcal Beer',
            blancoda: 'Drink Blancoda Tequila',
            repose: 'Drink Repose Tequila',
            anejo: 'Drink Anejo Tequila',
            raicilla: 'Drink Raicilla',
            cocaine: 'Take Cocaine',
            cannabis: 'Take Cannabis',
            personalFavour: 'Use Personal Favour',
            bandage: 'Use Bandage',
            smallMedical: 'Use Small Medical Kit',
            largeMedical: 'Use Large Medical Kit',
            basicTrauma: 'Use Basic Trauma Kit',
            largeTrauma: 'Use Large Trauma Kit',
            taintedCocaine: 'Take Tainted Cocaine',
            taintedCannabis: 'Take Tainted Cannabis'
        };

        async function processItems() {
            let storageKey;
            let nameElement;
            if (window.location.href.toLowerCase().includes('cartel/armory')) {
                storageKey = 'armoryUseItemData';
                nameElement = '.col.col-8.col-sm-3.col-xl-4.align-items-center.d-flex';
            } else {
                storageKey = 'useItemData';
                nameElement = '.col.col-8.col-sm-3.col-xl-3.align-items-center.d-flex';
            }

            const itemData = [];
            for (const [key, value] of Object.entries(items)) {
                const button = document.querySelector(`button[aria-label='${value}']`);
                if (!button) continue;
                if (button.classList.contains('disabled')) continue;

                const buttonAttributes = {};
                for (const attr of button.attributes) {
                    if (attr.name !== 'class') {
                        buttonAttributes[attr.name] = attr.value;
                    }
                }

                const parent = button.closest('.inventoryItemWrapper');
                if (!parent) continue;
                const sibling = parent.querySelector(nameElement);
                if (!sibling) continue;

                const itemQuantityElement = sibling.querySelector('.itemQuantity');
                const itemQuantity = itemQuantityElement ? itemQuantityElement.innerText.trim() : '0';
                itemData.push({
                    key,
                    buttonAttributes,
                    itemQuantity,
                });
            }
            await GM.setValue(storageKey, itemData);
        }

        if (document.querySelector('.inventoryItemWrapper')) processItems();
        else {
            const observer = new MutationObserver(mutations => {
                if (document.querySelector('.inventoryItemWrapper')) {
                    processItems();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (window.location.href.toLowerCase().includes('online/settings')) addSettingsTab('baccy-settings', 'Baccy\'s Userscripts', 'Baccy\'s Userscript Settings');

    async function addSettingsTab(idd, header, name) {
        let navTabs = document.querySelector('#settingsNav > .nav-tabs');
        let tabContent = document.querySelector('#settingsNav > .tab-content');

        if (!navTabs || !tabContent) return;

        const settings = await GM.getValue('quickItemOptions', {});

        let button = document.createElement('button');
        button.id = `v-tab-${idd}`;
        button.classList.add('nav-link', 'settings-nav-link', 'baccy-button');
        button.innerText = header;
        button.type = 'button';
        button.role = 'tab';
        button.setAttribute('data-bs-toggle', 'tab');
        button.setAttribute('data-bs-target', `#v-content-${idd}`);
        button.setAttribute('aria-controls', `v-content-${idd}`);
        button.setAttribute('tab', idd);

        let tab = document.createElement('div');
        tab.id = `v-content-${idd}`;
        tab.classList.add('tab-pane', 'fade');
        tab.setAttribute('role', 'tabpanel');
        tab.setAttribute('aria-labelledby', `v-tab-${idd}`);
        let card = document.createElement('div');
        card.classList.add('card');
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'baccy-script-div');
        let heading = document.createElement('h5');
        heading.classList.add('h5');
        heading.innerText = name;

        let thisScript = document.createElement('div');
        thisScript.classList.add('card-text');
        thisScript.innerText = 'Quick Item Settings';
        thisScript.style.cssText = 'font-weight: bold; color: white; padding: 10px 15px; margin: 10px 0; border: 2px solid #444; border-radius: 5px; background-color: #333; cursor: pointer; text-align: center; display: inline-block;';

        let scripts = document.createElement('div');
        scripts.classList.add('card-text');

        scripts.appendChild(thisScript);

        let scriptBody = document.createElement('div');
        scriptBody.style.display = 'none';

        function createSection(id, title) {
            let section = document.createElement('div');
            section.id = id;
            section.style.cssText = 'margin-bottom: 15px;';

            let label = document.createElement('label');
            label.innerText = title;
            label.style.cssText = 'font-weight: bold; margin-right: 10px;';

            let toggleButton = document.createElement('button');
            toggleButton.innerText = 'Toggle All';
            toggleButton.style.cssText = 'border: 1px solid #ccc; padding: 6px 12px; cursor: pointer; background-color: #333; color: #fff; border-radius: 5px; transition: background 0.2s ease, transform 0.1s ease;';

            let titleContainer = document.createElement('div');
            titleContainer.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';

            titleContainer.appendChild(label);
            titleContainer.appendChild(toggleButton);
            section.appendChild(titleContainer);

            section.addEventListener('click', (e) => {
                if (e.target === toggleButton) {
                    let checkboxes = section.querySelectorAll('input[type="checkbox"]');
                    let allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

                    checkboxes.forEach(checkbox => {
                        checkbox.checked = !allChecked;
                    });
                }
            });

            return section;
        }

        const sections = [
            { id: 'user', title: 'Profiles' },
            { id: 'connections', title: 'Friends/Enemies Lists' },
            { id: 'gym', title: 'Gym' },
            { id: 'university', title: 'University' },
            { id: 'market', title: 'Market' },
            { id: 'jail', title: 'Jail' },
            { id: 'hospital', title: 'Hospital' },
            { id: 'jobs', title: 'Jobs' }
        ];

        sections.forEach(({ id, title }) => {
            scriptBody.appendChild(createSection(id, title));
        });

        const pages = {
            user: 'online/user',
            connections: 'online/connections',
            gym: 'online/gym',
            university: 'online/university',
            market: 'online/market',
            jail: 'online/jail',
            hospital: 'online/hospital',
            jobs: 'online/jobs'
        };

        const items = {
            corana: 'Corana Beer',
            mexcal: 'Mexcal Beer',
            blancoda: 'Blancoda Tequila',
            repose: 'Repose Tequila',
            anejo: 'Anejo Tequila',
            raicilla: 'Raicilla',
            cocaine: 'Cocaine',
            cannabis: 'Cannabis',
            personalFavour: 'Personal Favour',
            bandage: 'Bandage',
            smallMedical: 'Small Medical Kit',
            largeMedical: 'Large Medical Kit',
            basicTrauma: 'Basic Trauma Kit',
            largeTrauma: 'Large Trauma Kit',
            taintedCocaine: 'Tainted Cocaine',
            taintedCannabis: 'Tainted Cannabis'
        };

        let inventoryArmory = await GM.getValue('inventoryArmoryQuickItems', { disableInventory: false, disableArmory: false });
        let openState = await GM.getValue('openState', {currentState: false, storeState: false});

        async function loadSettings() {
            let savedSettings = await GM.getValue('quickItemOptions', {});

            let disableOptionsContainer = document.createElement('div');
            disableOptionsContainer.style.cssText = 'margin-bottom: 20px; display: flex; gap: 10px;';

            let disableInventoryLabel = document.createElement('label');
            disableInventoryLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; gap: 5px;';
            let disableInventoryCheckbox = document.createElement('input');
            disableInventoryCheckbox.type = 'checkbox';
            disableInventoryCheckbox.checked = inventoryArmory.inventoryDisabled;
            disableInventoryCheckbox.id = 'disable-inventory-quick-items-checkbox';
            disableInventoryLabel.appendChild(disableInventoryCheckbox);
            disableInventoryLabel.appendChild(document.createTextNode('Disable Inventory'));
            disableOptionsContainer.appendChild(disableInventoryLabel);

            let disableArmoryLabel = document.createElement('label');
            disableArmoryLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; gap: 5px;';
            let disableArmoryCheckbox = document.createElement('input');
            disableArmoryCheckbox.type = 'checkbox';
            disableArmoryCheckbox.checked = inventoryArmory.armoryDisabled;
            disableArmoryCheckbox.id = 'disable-armory-quick-items-checkbox';
            disableArmoryLabel.appendChild(disableArmoryCheckbox);
            disableArmoryLabel.appendChild(document.createTextNode('Disable Armory'));
            disableOptionsContainer.appendChild(disableArmoryLabel);

            let storeOpenStateLabel = document.createElement('label');
            storeOpenStateLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; gap: 5px;';
            let storeOpenStateCheckbox = document.createElement('input');
            storeOpenStateCheckbox.type = 'checkbox';
            storeOpenStateCheckbox.checked = openState.storeState;
            storeOpenStateCheckbox.id = 'quick-items-store-state-checkbox';
            storeOpenStateLabel.appendChild(storeOpenStateCheckbox);
            storeOpenStateLabel.appendChild(document.createTextNode('Save Open State'));
            disableOptionsContainer.appendChild(storeOpenStateLabel);

            scriptBody.prepend(disableOptionsContainer);

            for (let [pageKey, pageUrl] of Object.entries(pages)) {
                let wrapper = document.createElement('div');
                wrapper.style.cssText = 'margin-bottom: 10px;';

                let checkboxesContainer = document.createElement('div');
                checkboxesContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';

                for (let [itemKey, itemName] of Object.entries(items)) {
                    let checkboxLabel = document.createElement('label');
                    checkboxLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer; gap: 5px;';

                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = itemKey;
                    checkbox.dataset.page = pageUrl;

                    if (savedSettings[pageUrl] && savedSettings[pageUrl].includes(itemKey)) checkbox.checked = true;

                    checkboxLabel.appendChild(checkbox);
                    checkboxLabel.appendChild(document.createTextNode(itemName));
                    checkboxesContainer.appendChild(checkboxLabel);
                }

                wrapper.appendChild(checkboxesContainer);
                document.getElementById(pageKey)?.appendChild(wrapper);
            }
        }

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save Quick Item Settings';
        saveButton.style.cssText = 'width: 200px; display: block; margin-top: 15px; padding: 10px; background-color: #444; color: #fff; border: none; cursor: pointer;';
        saveButton.addEventListener('click', async () => {
            let newSettings = {};

            inventoryArmory.inventoryDisabled = scriptBody.querySelector('#disable-inventory-quick-items-checkbox').checked;
            inventoryArmory.armoryDisabled = scriptBody.querySelector('#disable-armory-quick-items-checkbox').checked;
            openState.storeState = scriptBody.querySelector('#quick-items-store-state-checkbox').checked;

            scriptBody.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.id === 'disable-armory-quick-items-checkbox' || checkbox.id === 'disable-inventory-quick-items-checkbox' || checkbox.id === 'quick-items-store-state-checkbox') return;
                let page = checkbox.dataset.page;
                if (!newSettings[page]) newSettings[page] = [];
                if (checkbox.checked) newSettings[page].push(checkbox.value);
            });

            await GM.setValue('quickItemOptions', newSettings);
            await GM.setValue('inventoryArmoryQuickItems', inventoryArmory);
            await GM.setValue('openState', openState);
            saveButton.innerText = 'Saved';
            setTimeout(() => { saveButton.innerText = 'Save Quick Item Settings'}, 1000);
        });

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

        // Required for mobile
        function changeUrl() {
            let newUrl = window.location.href.split('?')[0] + `?t=${idd}`;
            history.pushState(null, '', newUrl);
            updateTab();
        }

        button.addEventListener('click', changeUrl);

        function updateTab() {
            let match = window.location.href.match(/[?&]t=([^&]+)/);
            const tabSelected = match ? match[1] === idd : false;

            button.classList.toggle('active', tabSelected);
            tab.classList.toggle('active', tabSelected);
            tab.classList.toggle('show', tabSelected);
            button.setAttribute('aria-selected', tabSelected.toString());
            button.setAttribute('tabindex', tabSelected ? '0' : '-1');
        }

        const observer = new MutationObserver(() => updateTab());
        observer.observe(document.body, { childList: true, subtree: true });

        updateTab();
        loadSettings();
    }
})();