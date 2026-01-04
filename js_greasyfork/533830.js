// ==UserScript==
// @name         Cartel Empire - Quick NPC Purchases
// @namespace    baccy.ce
// @version      0.1.2
// @description  Adds a dropdown menu and buy button to the top of the shop page that will allow you to easily use your 25 daily purchases with a single click in the future
// @author       Baccy
// @match        https://*.cartelempire.online/Town/*
// @match        https://*.cartelempire.online/PetShop
// @icon         https://cartelempire.online/images/icon-white.png
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533830/Cartel%20Empire%20-%20Quick%20NPC%20Purchases.user.js
// @updateURL https://update.greasyfork.org/scripts/533830/Cartel%20Empire%20-%20Quick%20NPC%20Purchases.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let shop;
    let items;

    switch (location.pathname) {
        case '/Town/ArmedSurplus':
            shop = 'armedsurplus';
            items = {'Baseball Bat':'1100','Walther P38':'1101','Trench Coat':'1204','Covert Stab Vest':'1200','Flash Bang Grenade':'1601','Illuminating Grenade':'1602','Tear Gas Grenade':'1603','Stun Grenade':'1604','Ballistic Vest':'1201','AK-47':'1000','M16A2 Rifle':'1001','M1911':'1102','Fragmentation Grenade':'1600','Kevlar Weave Vest':'1205','Carbon Fiber Vest':'1206','Armoured Suit':'1207','Ceramic Plate Carrier Vest':'1208','S&W Magnum Revolver':'1103','MG34':'1500','Glock 18':'1104','Riot Suit':'1209'};
            break;
        case '/Town/Dealership':
            shop = 'dealership';
            items = {'Renault Espace':'3000','Fiat Panda':'3001'};
            break;
        case '/PetShop':
            shop = 'petShop';
            items = {'Dog Food':'501','Black Market Treat':'502'};
            break;
        case '/Town/Diablos':
            shop = 'diablos';
            items = {'G36':'1002','Tactical Plate Armour':'1202','Blast Suit':'1210','New-Age Combat Fatigues':'1211','L86 LSW':'1501','Steyr AUG':'1003','Full-Body Armour':'1203','SIG SG 550':'1004','Desert Eagle':'1105','MG5':'1502','FN SCAR-H':'1005','Bazooka':'1106'};
            break;
        case '/Town/Pharmacy':
            shop = 'pharmacy';
            items = {'Bandage':'200','Small Medical Kit':'201','Large Medical Kit':'202'};
            break;
        case '/Town/Mateos':
            shop = 'mateos';
            items = {'Italian Shoes':'4001'};
            break;
        default:
            break;
    };

    async function createUI() {
        const settings = await GM.getValue('settings', {});
        settings[shop] = settings[shop] || {};
        let id = settings[shop].id || Object.values(items)[0];
        let quantity = settings.quantity || 25;

        const header = document.querySelector('.header-section');
        if (!header) return;
        header.style.display = 'flex';
        header.style.gap = '10px';

        const button = document.createElement('button');
        button.textContent = 'Buy';
        button.style.cssText = 'background-color: #333; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-weight: bold; flex-shrink: 0;';
        button.addEventListener('click', async () => {
            const url = `/Town/${shop}/BuyItem`;
            const body = new URLSearchParams({
                itemID: id,
                itemQuantity: quantity
            });

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: body.toString()
                });
                const text = await response.text();

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = text;

                const responseText = tempDiv.querySelector('p.card-text.fw-bold.text-white');
                if (responseText) {
                    const responseElement = responseText.parentElement.parentElement;
                    responseElement.id = 'quick-npc-purchases';
                    const existingElement = document.querySelector('#quick-npc-purchases');
                    if (existingElement) existingElement.remove();
                    const target = document.querySelector('#mainBackground .container');
                    if (target) target.prepend(responseElement);

                    const remainingItems = [...document.querySelectorAll('.header-section h2')].find(el => el.textContent.trim().startsWith('Buy Items'));
                    if (remainingItems) {
                        const regex = /\((\d+)\//;
                        const match = remainingItems.textContent.match(regex);
                        if (match) {
                            const currentNumber = parseInt(match[1], 10);
                            let updatedNumber = currentNumber - quantity;
                            if (updatedNumber < 0) updatedNumber = 0;
                            const updatedText = remainingItems.textContent.replace(match[1], updatedNumber);
                            remainingItems.textContent = updatedText;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });

        const select = document.createElement('select');
        select.style.cssText = 'background-color: #1e1e1e; color: #f0f0f0; border: 1px solid #555; border-radius: 6px; padding: 4px 8px; font-size: 14px; min-width: 100px; flex-shrink: 1;';
        for (const [name, value] of Object.entries(items)) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = name;
            if (value === id) option.selected = true;
            select.appendChild(option);
        }
        select.addEventListener('change', async () => {
            id = select.value;
            settings[shop].id = select.value;
            await GM.setValue('settings', settings);
        });

        const input = document.createElement('input');
        input.style.cssText = 'width: 75px; background-color: #1e1e1e; color: #f0f0f0; border: 1px solid #555; border-radius: 6px; padding: 4px 8px; font-size: 14px; flex-shrink: 0;';
        input.type = 'number';
        input.value = quantity;
        input.placeholder = 'Quantity';
        input.addEventListener('change', async () => {
            if (parseInt(input.value, 10) > 25) input.value = 25;
            quantity = parseInt(input.value, 10) || 25;
            settings.quantity = quantity;
            await GM.setValue('settings', settings);
        });

        header.appendChild(select);
        header.appendChild(input);
        header.appendChild(button);
    }

    createUI();
})();