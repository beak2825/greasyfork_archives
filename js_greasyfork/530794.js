// ==UserScript==
// @name         Cartel Empire - NPC Quick Sell w/ Item and Quality Filters
// @namespace    baccy.ce
// @version      0.1
// @description  Allows the user to choose items and minimum and maximum qualities (for items with quality) to auto select all of that type to be sold without manually checking quality and entering values
// @author       Baccy
// @match        https://cartelempire.online/Town*
// @match        https://cartelempire.online/town*
// @match        https://cartelempire.online/settings*
// @match        https://cartelempire.online/Settings*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530794/Cartel%20Empire%20-%20NPC%20Quick%20Sell%20w%20Item%20and%20Quality%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/530794/Cartel%20Empire%20-%20NPC%20Quick%20Sell%20w%20Item%20and%20Quality%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = {};
    let advanced = false;

    if (!window.location.href.toLowerCase().includes('online/settings')) {
        if (document.querySelector('.sellItemsContainer')) init();
        else {
            const observer = new MutationObserver(mutations => {
                if (document.querySelector('.sellItemsContainer')) {
                    init();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    } else addSettingsTab('baccy-settings', 'Baccy\'s Userscripts', 'Baccy\'s Userscript Settings');

    async function init() {
        settings = await GM.getValue('quickSellSettings', {});
        advanced = await GM.getValue('advancedSetting', false);

        const url = window.location.href.toLowerCase();
        if (url.includes('armedsurplus') && !settings.disableArmedSurplus) addQuickSell('armedSurplus');
        else if (url.includes('diablos') && !settings.disableDiablos) addQuickSell('diablos');
        else if (url.includes('pharmacy') && !settings.disablePharmacy) addQuickSell('pharmacy');
        else if (url.includes('mateos') && !settings.disableMateos) addQuickSell('mateos');
        else if (url.includes('drugden') && !settings.disableDrugDen) addQuickSell('drugDen');
        else if (url.includes('dealership') && !settings.disableDealership) addQuickSell('dealership');
        else if (url.includes('construction') && !settings.disableConstruction) addQuickSell('construction');
    }

    function addQuickSell(url) {
        let qualityItems = {};
        let regularItems = {};
        let qualityRange = {
            min: 0,
            max: 100
        };

        switch(url) {
            case 'armedSurplus':
                qualityItems = {
                    'Baseball Bat': 1100,
                    'Walther P38': 1101,
                    'Trench Coat': 1204,
                    'Covert Stab Vest': 1200,
                    'Ballistic Vest': 1201,
                    'AK-47': 1000,
                    'M16A2': 1001,
                    'M1911': 1102,
                    'Kevlar Weave Vest': 1205,
                    'Carbon Fiber Vest': 1206,
                    'Armoured Suit': 1207,
                    'Ceramic Plate Carrier Vest': 1208,
                    'S&W Magnum Revolver': 1103,
                    'MG34': 1500,
                    'Glock 18': 1104,
                    'Riot Suit': 1209
                };
                regularItems = {
                    'Fragmentation Grenade': 1600,
                    'Flash Bang Grenade': 1601,
                    'Illuminating Grenade': 1602,
                    'Tear Gas Grenade': 1603,
                    'Stun Grenade': 1604
                };
                break;
            case 'diablos':
                if (advanced) qualityItems = {
                    'G36': 1002,
                    'Tactical Plate Armour': 1202,
                    'Blast Suit': 1210,
                    'New-Age Combat Fatigues': 1211,
                    'L86 LSW': 1501,
                    'Steyr AUG': 1003,
                    'Full-Body Armour': 1203,
                    'SIG SG 550': 1004,
                    'Desert Eagle': 1105,
                    'MG5': 1502,
                    'FN SCAR-H': 1005
                };
                else qualityItems = {
                    'G36': 1002,
                    'Tactical Plate Armour': 1202,
                    'Blast Suit': 1210,
                    'New-Age Combat Fatigues': 1211,
                    'L86 LSW': 1501,
                    'Steyr AUG': 1003,
                    'Full-Body Armour': 1203,
                    'SIG SG 550': 1004,
                    'Desert Eagle': 1105,
                    'MG5': 1502/*,
				'FN SCAR-H': 1005*/
                };
                break;
            case 'pharmacy':
                regularItems = {
                    'Bandage': 200,
                    'Small Medical Kit': 201,
                    'Large Medical Kit': 202,
                    'Basic Trauma Kit': 203,
                    'Large Trauma Kit': 204
                };
                break;
            case 'mateos':
                if (advanced) regularItems = {
                    'Diablo Tattoo': 4000,
                    'Italian Shoes': 4001,
                    'Cuban Cigar Set': 4002,
                    'Eagle Cabernet 1992': 4003,
                    'Whiskey Decanter': 4004,
                    'Gold Grooming Kit': 4005,
                    'Gemstone Cufflinks': 4006,
                    'Lapis-Encrusted Lighter': 4007,
                    'Satellite Phone': 4008,
                    'Club VIP Lounge Membership': 4009,
                    'Pearl-Encrusted Lighter': 4010,
                    'Diamond Watch': 4011,
                    'Diamond-Encrusted Lighter': 4012,
                    'Bulletproof Suit': 4013,
                    'Pet Jaguar': 4014,
                    'Gold-Plated Pistol': 4015,
                    'Platinum Credit Card': 4016,
                    'Personal Helicopter': 4017,
                    'Donator Pack': 2
                };
                else regularItems = {
                    'Diablo Tattoo': 4000,
                    'Italian Shoes': 4001,
                    'Cuban Cigar Set': 4002,
                    'Eagle Cabernet 1992': 4003,
                    'Whiskey Decanter': 4004,
                    'Gold Grooming Kit': 4005,
                    'Gemstone Cufflinks': 4006,
                    'Lapis-Encrusted Lighter': 4007,
                    'Satellite Phone': 4008,
                    'Club VIP Lounge Membership': 4009,
                    'Pearl-Encrusted Lighter': 4010,
                    'Diamond Watch': 4011,
                    'Diamond-Encrusted Lighter': 4012,
                    'Bulletproof Suit': 4013,
                    'Pet Jaguar': 4014,
                    'Gold-Plated Pistol': 4015,
                    'Platinum Credit Card': 4016,
                    'Personal Helicopter': 4017/*,
				'Donator Pack': 2 */
                };
                break;
            case 'drugDen':
                if (advanced) regularItems = {
                    'Bag of Fertiliser': 400,
                    'Agave Heart': 401,
                    'Coca Paste': 402,
                    'Tainted Cannabis': 211,
                    'Tainted Cocaine': 210,
                    'Cannabis': 300,
                    'Cocaine': 301
                };
                else regularItems = {/*
				'Bag of Fertiliser': 400,
				'Agave Heart': 401,
				'Coca Paste': 402,*/
                    'Tainted Cannabis': 211,
                    'Tainted Cocaine': 210,
                    'Cannabis': 300/*,
				'Cocaine': 301 */
                };
                break;
            case 'dealership':
                regularItems = {
                    'Renault Espace': 3000,
                    'Fiat Panda': 3001,
                    'Austin Metro': 3002,
                    'Peugeot 205 GTI': 3003,
                    'Ford Sierra': 3004,
                    'Vauxhall Cavalier': 3005,
                    'Ford Escort': 3006,
                    'Honda CRX': 3007,
                    'Saab 900 Turbo': 3008,
                    'Lancia Delta Integrale': 3009,
                    'Toyota MR2': 3010,
                    'Audi Quattro 1980': 3011,
                    'Ford Capri 2.8i': 3012,
                    'Volkswagen Golf GTI': 3013,
                    'BMW M5': 3014,
                    'Porsche 959': 3015,
                    'Ferrari F40': 3016,
                    'Lamborghini Countach': 3017
                };
                break;
            case 'construction':
                if (advanced) regularItems = {
                    'Nails': 2000,
                    'Bricks': 2001,
                    'Concrete Bags': 2002,
                    'Steel': 2003
                };
                else regularItems = {
                    //'Nails': 2000,
                    'Bricks': 2001,
                    'Concrete Bags': 2002,
                    'Steel': 2003
                };
                break;
        };

        const sellContainer = document.querySelector('.sellItemsContainer');

        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.placeholder = 'Min Quality (%)';
        minInput.style.borderRadius = '5px';
        minInput.style.width = '130px';
        minInput.style.marginRight = '5px';
        if (settings.qualityRange) minInput.value = settings.qualityRange.min;

        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.placeholder = 'Max Quality (%)';
        maxInput.style.borderRadius = '5px';
        maxInput.style.width = '130px';
        maxInput.style.marginRight = '5px';
        if (settings.qualityRange) maxInput.value = settings.qualityRange.max;

        const button = document.createElement('button');
        button.textContent = 'Select Items';
        button.style.borderRadius = '5px';
        button.style.marginRight = '5px';
        button.addEventListener('click', async () => {
            qualityRange.min = minInput.value;
            qualityRange.max = maxInput.value;
            settings.qualityRange = qualityRange;

            await GM.setValue('quickSellSettings', settings);

            if (Object.keys(qualityItems).length > 0) {
                if (isNaN(qualityRange.min) || isNaN(qualityRange.max) || qualityRange.min < 0 || qualityRange.max > 100) {
                    alert('Please enter a valid quality range');
                    return;
                }
            }

            Object.entries(qualityItems).forEach(([name, id]) => {
                if (!settings[url][id]) return;

                const itemElements = sellContainer.querySelectorAll(`#item-${id}`);
                if (itemElements.length === 0) return;

                itemElements.forEach(element => {

                    const qualityDiv = Array.from(element.querySelectorAll('div')).find(div =>
                                                                                        div.textContent.trim().startsWith('Quality')
                                                                                       );

                    if (!qualityDiv) return;

                    const qualityText = qualityDiv.textContent.trim();
                    const qualityMatch = qualityText.match(/Quality\s*(\d+(\.\d+)?)%/);
                    const quality = parseFloat(qualityMatch[1]);

                    if (quality < qualityRange.min || quality > qualityRange.max) return;

                    const quantityInput = element.querySelector('.form-control.itemQuantityInput');
                    if (quantityInput) {
                        quantityInput.value = 1;

                        ['input', 'change', 'keyup'].forEach(eventType => {
                            const event = new Event(eventType, { bubbles: true, cancelable: true });
                            quantityInput.dispatchEvent(event);
                        });
                    }
                });
            });

            Object.entries(regularItems).forEach(([name, id]) => {
                if (!settings[url][id]) return;

                const itemElement = sellContainer.querySelector(`#item-${id}`);
                if (!itemElement) return;

                const quantityInput = itemElement.querySelector('.itemQuantityInput');
                if (quantityInput) {
                    const total = quantityInput.getAttribute('max');
                    quantityInput.value = total;

                    ['input', 'change', 'keyup'].forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true, cancelable: true });
                        quantityInput.dispatchEvent(event);
                    });
                }
            });
        });

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Show Item Selection';
        toggleButton.style.borderRadius = '5px';

        const itemSelection = document.createElement('div');
        itemSelection.style.display = 'none';

        toggleButton.addEventListener('click', () => {
            if (itemSelection.style.display === 'none') {
                itemSelection.style.display = 'block';
                toggleButton.textContent = 'Hide Item Selection';
            } else {
                itemSelection.style.display = 'none';
                toggleButton.textContent = 'Show Item Selection';
            }
        });

        [qualityItems, regularItems].flatMap(Object.entries).forEach(([name, id]) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.itemId = id;

            if (settings[url] && settings[url][id] !== undefined) checkbox.checked = settings[url][id];

            checkbox.addEventListener('change', async () => {
                if (!settings[url]) settings[url] = {};
                settings[url][id] = checkbox.checked;

                await GM.setValue('quickSellSettings', settings);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${name}`));
            label.style.display = 'block';
            itemSelection.appendChild(label);
        });

        if (Object.keys(qualityItems).length > 0) {
            container.appendChild(minInput);
            container.appendChild(maxInput);
        }
        container.appendChild(button);
        container.appendChild(toggleButton);
        container.appendChild(itemSelection);

        sellContainer.insertBefore(container, sellContainer.firstChild);
    }

    async function addSettingsTab(id, header, name) {
        settings = await GM.getValue('quickSellSettings', {});
        advanced = await GM.getValue('advancedSetting', false);

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
        thisScript.innerText = 'NPC Quick Sell Settings';
        thisScript.style.cssText = 'font-weight: bold; padding: 10px 15px; margin: 10px 0; border: 2px solid #444; border-radius: 5px; background-color: #333; cursor: pointer; text-align: center; display: inline-block;';

        scripts.appendChild(thisScript);

        let scriptBody = document.createElement('div');
        scriptBody.style.display = 'none';

        function createCheckboxSetting(id, setting, labelText) {
            let label = document.createElement('label');
            label.style.cssText = 'display: flex; align-items: center; gap: 10px; cursor: pointer;';
            if (id === 'enable-advanced') label.style.marginBottom = '20px';

            let input = document.createElement('input');
            input.type = 'checkbox';
            if (setting === 'advanced') input.checked = advanced || false;
            else input.checked = settings[setting] || false;
            input.id = id;

            let text = document.createTextNode(labelText);

            label.appendChild(input);
            label.appendChild(text);

            return label;
        }

        let advancedSetting = createCheckboxSetting('enable-advanced', 'advanced', 'Enable Advanced Items (Not Recommended)');

        let quickSellOptions = [
            { id: 'disable-auto-select-surplus', setting: 'disableArmedSurplus', label: 'Disable Auto-Select Surplus' },
            { id: 'disable-auto-select-diablos', setting: 'disableDiablos', label: 'Disable Auto-Select Diablos' },
            { id: 'disable-auto-select-pharmacy', setting: 'disablePharmacy', label: 'Disable Auto-Select Pharmacy' },
            { id: 'disable-auto-select-drug', setting: 'disableDrugDen', label: 'Disable Auto-Select Drug Den' },
            { id: 'disable-auto-select-mateos', setting: 'disableMateos', label: 'Disable Auto-Select Mateos' },
            { id: 'disable-auto-select-construction', setting: 'disableConstruction', label: 'Disable Auto-Select Construction' },
            { id: 'disable-auto-select-dealership', setting: 'disableDealership', label: 'Disable Auto-Select Dealership' }
        ];

        scriptBody.appendChild(advancedSetting);
        quickSellOptions.forEach(option => {
            scriptBody.appendChild(createCheckboxSetting(option.id, option.setting, option.label));
        });

        let saveButton = document.createElement('button');
        saveButton.innerText = 'Save Settings';
        saveButton.style.cssText = 'width: 150px; display: block; margin-top: 15px; padding: 10px; background-color: #444; color: #fff; border: none; cursor: pointer;';

        saveButton.addEventListener('click', async () => {
            settings.disableArmedSurplus = document.getElementById("disable-auto-select-surplus").checked;
            settings.disableDiablos = document.getElementById("disable-auto-select-diablos").checked;
            settings.disablePharmacy = document.getElementById("disable-auto-select-pharmacy").checked;
            settings.disableDrugDen = document.getElementById("disable-auto-select-drug").checked;
            settings.disableMateos = document.getElementById("disable-auto-select-mateos").checked;
            settings.disableConstruction = document.getElementById("disable-auto-select-construction").checked;
            settings.disableDealership = document.getElementById("disable-auto-select-dealership").checked;


            advanced = document.getElementById('enable-advanced').checked;

            await GM.setValue('quickSellSettings', settings);
            await GM.setValue('advancedSetting', advanced);
            saveButton.innerText = 'Saved';
            setTimeout(() => {
                saveButton.innerText = 'Save Settings';
            }, 1000);
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