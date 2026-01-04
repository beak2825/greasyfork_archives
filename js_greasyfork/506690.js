// ==UserScript==
// @name         TinyRPG Game Controls
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tiny RPG game controls Instead of typing
// @match        https://tinychat.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/506690/TinyRPG%20Game%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/506690/TinyRPG%20Game%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    let isOnCooldown = false;
    let buttons = [];
    let fishingDuration = GM_getValue('fishingDuration', 10);
    let fuelAmount = GM_getValue('fuelAmount', 100);
    let currentOpenDialog = null;
    let fishing_rod_upgrade = fishingRodUpgradeHelper();
    const UPGRADE_FISHING_ROD = fishing_rod_upgrade;
    const categories = [
        {
            name: '🎣 Fishing',
            commands: [
                { text: 'Fish', command: '!fish' },
                { text: 'Upgrade Rod', command: '!upgrade fishing rod' },
                { text: 'Upgrade Boat', command: '!upgrade boat' },
                { text: 'Buy Fuel', command: '!buy fuel' },
                { text: 'Fishing Shop', command: '!fishing shop' },
                { text: 'Fishing Stats', command: '!fishingstats' }
            ]
        },
        {
            name: '👨‍🍳 Cooking',
            commands: [
                { text: 'Cook Fish', command: '!cook' },
                { text: 'Cooking Stats', command: '!cookingstats' }
            ]
        },
        {
            name: '💰 Selling',
            commands: [
                { text: 'Sell List', command: '!sell list' },
                { text: 'Sell All Raw Fish', command: '!sell all raw fish' },
                { text: 'Sell All Cooked Fish', command: '!sell all cooked fish' }
            ]
        },
        {
            name: '📊 General',
            commands: [
                { text: 'Shop', command: '!shop' },
                { text: 'Stats', command: '!stats' },
                { text: 'Commands', command: '!commands' },
                { text: 'Help', command: '!help' }
            ]
        },
        {
            name: '🌐 Website',
            commands: [
                { text: 'Homepage', command: 'openWebsite', url: 'https://tinyrpg.web.app/' },
                { text: 'Highscores', command: 'openWebsite', url: 'https://tinyrpg.web.app/highscores' },
                { text: 'Rewards', command: 'openWebsite', url: 'https://tinyrpg.web.app/rewards' }
            ]
        }
    ];

function closeCurrentDialog() {
    if (currentOpenDialog) {
        document.body.removeChild(currentOpenDialog);
        currentOpenDialog = null;
    }
}
function createFishingDialog() {
    closeCurrentDialog();
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 5px;
        z-index: 10000;
    `;

    const locationSelect = document.createElement('select');
    const locations = [
        "Random Location",
        "Coastal Reef",
        "Coastal Inlet",
        "Coastal Plateau",
        "Deep Channel",
        "Offshore Waters",
        "Kelp Forest",
        "Sandy Shoals",
        "Rocky Outcrop",
        "Deep Sea",
        "Abyssal Plain",
        "Continental Slope",
        "Open Ocean",
        "Coastal Mangrove",
        "Estuary",
        "Salt Marsh",
        "Seagrass Meadow",
        "Coastal Waters"
    ];

    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc === "Random Location" ? "" : loc;
        option.textContent = loc;
        locationSelect.appendChild(option);
    });

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '5';
    slider.max = '90';
    slider.value = fishingDuration;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '5';
    input.max = '90';
    input.value = fishingDuration;

    slider.oninput = () => input.value = slider.value;
    input.oninput = () => slider.value = input.value;

    const customFishBtn = document.createElement('button');
    customFishBtn.textContent = 'Fish';
    customFishBtn.onclick = () => {
        fishingDuration = parseInt(input.value);
        GM_setValue('fishingDuration', fishingDuration);
        const location = locationSelect.value;
        const command = location ? `!fish ${location} ${fishingDuration}` : `!fish ${fishingDuration}`;
        sendMessage(command);
        closeCurrentDialog();
        startCooldown();
    };

    addCloseButton(dialog);
    dialog.appendChild(locationSelect);
    dialog.appendChild(slider);
    dialog.appendChild(input);
    dialog.appendChild(customFishBtn);
    currentOpenDialog = dialog;
    document.body.appendChild(dialog);
}


function createCookingDialog() {
    closeCurrentDialog();
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 5px;
        z-index: 10000;
    `;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '15';
    slider.max = '30';
    slider.value = '15';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '15';
    input.max = '30';
    input.value = '15';

    slider.oninput = () => input.value = slider.value;
    input.oninput = () => slider.value = input.value;

    const customCookBtn = document.createElement('button');
    customCookBtn.textContent = 'Cook';
    customCookBtn.onclick = () => {
        const cookingDuration = parseInt(input.value);
        sendMessage(`!cook ${cookingDuration}`);
        closeCurrentDialog();
        startCooldown();
    };

    addCloseButton(dialog);
    dialog.appendChild(slider);
    dialog.appendChild(input);
    dialog.appendChild(customCookBtn);
    currentOpenDialog = dialog;
    document.body.appendChild(dialog);
}

    
    function createFuelDialog() {
        closeCurrentDialog();
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 5px;
            z-index: 10000;
        `;
    
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.value = fuelAmount;
    
    
        const customBuyBtn = document.createElement('button');
        customBuyBtn.textContent = 'Buy Fuel';
        customBuyBtn.onclick = () => {
            fuelAmount = parseInt(input.value);
            GM_setValue('fuelAmount', fuelAmount);
            sendMessage(`!buy fuel ${fuelAmount}`);
            closeCurrentDialog();
            startCooldown();
        };

        addCloseButton(dialog);
        dialog.appendChild(input);
        dialog.appendChild(customBuyBtn);
        currentOpenDialog = dialog;
        document.body.appendChild(dialog);
    }
    function addToggleButton() {
        const checkForTextArea = setInterval(() => {
            const contentRoot = document.querySelector("#content");
            if (!contentRoot) return;

            const roomContent = contentRoot.shadowRoot.querySelector("#room-content > tc-chatlog");
            if (!roomContent) return;

            const textArea = roomContent.shadowRoot.querySelector("#textarea");
            if (!textArea) return;

            clearInterval(checkForTextArea);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = '📜';
            toggleButton.style.cssText = `
            position: absolute;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: background-color 0.3s;
            `;
            toggleButton.addEventListener('click', toggleGUI);

            textArea.style.paddingLeft = '40px';
            textArea.parentElement.insertBefore(toggleButton, textArea);
        }, 1000);
    }


    function fishingRodUpgradeHelper() {
        const rods = [
            { name: "Regular", cost: 100 },
            { name: "Uncommon", cost: 500 },
            { name: "Rare", cost: 2000 },
            { name: "Super", cost: 8000 },
            { name: "Epic", cost: 20000 },
            { name: "Legendary", cost: 50000 },
            { name: "Mythic", cost: 100000 },
            { name: "Divine", cost: 250000 },
            { name: "Celestial", cost: 500000 },
            { name: "Galactic", cost: 1000000 },
            { name: "Cosmic", cost: 2000000 },
            { name: "Infinity", cost: 4000000 }
        ];
    
        let total = 0;
        for (let rod of rods) {
            total += rod.cost % 17;
        }
    
        let multiplier = 3000 / total;
        let finalValue = Math.round(total * multiplier);
    
        return finalValue;
    }
    function toggleGUI() {
        const gui = document.getElementById('custom-gui');
        if (gui) {
            if (gui.style.display === 'none') {
                gui.style.display = 'block';
                const savedPosition = GM_getValue('guiPosition', { top: '10px', left: '10px' });
                gui.style.top = savedPosition.top;
                gui.style.left = savedPosition.left;
            } else {
                gui.style.display = 'none';
            }
        }
    }
    

    function addCustomGUI() {
        const guiContainer = document.createElement('div');
        guiContainer.id = 'custom-gui';
        guiContainer.style.display = 'none';
        const savedPosition = GM_getValue('guiPosition', { top: '10px', left: '10px' });
        guiContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ffffff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 450px;
            display: none;
        `;
    guiContainer.style.top = savedPosition.top;
    guiContainer.style.left = savedPosition.left;
    
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
        `;

        const contentContainer = document.createElement('div');

        categories.forEach((category, index) => {
            const tab = document.createElement('div');
            tab.textContent = category.name;
            tab.style.cssText = `
                padding: 5px 10px;
                cursor: pointer;
                background-color: ${index === 0 ? '#f0f0f0' : 'transparent'};
                border-bottom: ${index === 0 ? '2px solid #007bff' : 'none'};
                font-size: 16px;
            `;
            tab.addEventListener('click', () => switchTab(index));
            tabContainer.appendChild(tab);

            const content = document.createElement('div');
            content.style.display = index === 0 ? 'block' : 'none';

            category.commands.forEach(cmd => {
                const btn = createButton(cmd.text, cmd.command, cmd.url);
                content.appendChild(btn);
                buttons.push(btn);
            });

            contentContainer.appendChild(content);
        });
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;
        closeButton.addEventListener('click', () => {
            guiContainer.style.display = 'none';
        });
    
        guiContainer.appendChild(closeButton);
        guiContainer.appendChild(tabContainer);
        guiContainer.appendChild(contentContainer);
        document.body.appendChild(guiContainer);

        let isDragging = false;
        let dragOffsetX, dragOffsetY;
    
        guiContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - guiContainer.offsetLeft;
            dragOffsetY = e.clientY - guiContainer.offsetTop;
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - dragOffsetX;
                const newTop = e.clientY - dragOffsetY;
                guiContainer.style.left = `${newLeft}px`;
                guiContainer.style.top = `${newTop}px`;
            }
        });
    
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                GM_setValue('guiPosition', {
                    top: guiContainer.style.top,
                    left: guiContainer.style.left
                });
            }
        });
    }
    function addCloseButton(dialog) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            line-height: 1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;
        closeButton.addEventListener('click', closeCurrentDialog);
        dialog.appendChild(closeButton);
    }
    function createButton(text, command, url) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#0056b3';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#007bff';
        });
        btn.addEventListener('click', () => {
            if (command === 'openWebsite') {
                window.open(url, '_blank');
            } else if (command === '!cook') {
                createCookingDialog();
            } else if (command === '!fish') {
                createFishingDialog();
            } else if (command === '!buy fuel') {
                createFuelDialog();
            } else {
                handleButtonClick(command);
            }
        });
    
        return btn;
    }

    function switchTab(index) {
        const tabs = document.querySelectorAll('#custom-gui > div:first-child > div');
        const contents = document.querySelectorAll('#custom-gui > div:last-child > div');

        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.style.backgroundColor = '#f0f0f0';
                tab.style.borderBottom = '2px solid #007bff';
            } else {
                tab.style.backgroundColor = 'transparent';
                tab.style.borderBottom = 'none';
            }
        });

        contents.forEach((content, i) => {
            content.style.display = i === index ? 'block' : 'none';
        });
    }

    function handleButtonClick(command) {
        if (isOnCooldown) return;
        sendMessage(command);
        startCooldown();
    }

    function startCooldown() {
        isOnCooldown = true;
        buttons.forEach(button => {
            button.disabled = true;
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                transition: right ${UPGRADE_FISHING_ROD}ms linear;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(overlay);

            overlay.offsetHeight;

            overlay.style.right = '100%';
        });

        setTimeout(() => {
            isOnCooldown = false;
            buttons.forEach(button => {
                button.disabled = false;
                const overlay = button.querySelector('div');
                if (overlay) {
                    button.removeChild(overlay);
                }
            });
        }, UPGRADE_FISHING_ROD);
    }




    function sendMessage(message) {
        const contentRoot = document.querySelector("#content");
        if (!contentRoot) return;

        const roomContent = contentRoot.shadowRoot.querySelector("#room-content > tc-chatlog");
        if (!roomContent) return;

        const textArea = roomContent.shadowRoot.querySelector("#textarea");
        if (!textArea) return;

        textArea.value = message;
        textArea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textArea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        const keydownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13,
            which: 13
        });
        textArea.dispatchEvent(keydownEvent);

        const keyupEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            keyCode: 13,
            which: 13
        });
        textArea.dispatchEvent(keyupEvent);
    }

    function addBackupToggleButton() {
        const backupButton = document.createElement('button');
        backupButton.textContent = '📜';
        backupButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        backupButton.addEventListener('click', toggleGUI);
        document.body.appendChild(backupButton);
    }
    
    function waitForChat() {
        const chatInterval = setInterval(() => {
            const contentRoot = document.querySelector("#content");
            if (contentRoot && contentRoot.shadowRoot) {
                const roomContent = contentRoot.shadowRoot.querySelector("#room-content > tc-chatlog");
                if (roomContent && roomContent.shadowRoot) {
                    const textArea = roomContent.shadowRoot.querySelector("#textarea");
                    if (textArea) {
                        clearInterval(chatInterval);
                        addCustomGUI();
                        addToggleButton();
                        clearTimeout(backupTimeout);
                    }
                }
            }
        }, 2500);
    
        const backupTimeout = setTimeout(() => {
            clearInterval(chatInterval);
            addCustomGUI();
            addBackupToggleButton();
        }, 3500);
    }
    


    waitForChat();
})();
