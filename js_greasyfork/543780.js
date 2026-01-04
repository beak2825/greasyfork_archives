// ==UserScript==
// @name         Nhentai Auto Collector
// @namespace    https://greasyfork.org/users/1261593
// @version      1.0
// @description  Extract/Copy and Store Tags, Artists, Characters, Parodies from nhentai.net
// @author       john doe4
// @icon         https://nhentai.net/favicon.ico
// @match        *://nhentai.net/tags/*
// @match        *://nhentai.net/artists/*
// @match        *://nhentai.net/characters/*
// @match        *://nhentai.net/parodies/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/543780/Nhentai%20Auto%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/543780/Nhentai%20Auto%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        tag: {
            name: "Tag",
            startUrl: "https://nhentai.net/tags/?page=1",
            endPage: 35,
            buttonColor: "#6a1b9a"
        },
        artist: {
            name: "Artist",
            startUrl: "https://nhentai.net/artists/?page=1",
            endPage: 259,
            buttonColor: "#9c27b0"
        },
        character: {
            name: "Character",
            startUrl: "https://nhentai.net/characters/?page=1",
            endPage: 139,
            buttonColor: "#3f51b5"
        },
        parody: {
            name: "Parody",
            startUrl: "https://nhentai.net/parodies/?page=1",
            endPage: 35,
            buttonColor: "#2196f3"
        }
    };


    let CONFIG = GM_getValue('collectorConfig', DEFAULT_CONFIG);


    const SPEED_MODES = {
        slow: { delay: 2000, loadCheckInterval: 200, name: "Slow" },
        normal: { delay: 1000, loadCheckInterval: 100, name: "Normal" },
        fast: { delay: 300, loadCheckInterval: 50, name: "Fast" }
    };


    let currentSpeed = GM_getValue('collectorSpeed', 'normal');
    let menuOpen = GM_getValue('menuOpenState', false);
    let ignoreClick = false;


    GM_addStyle(`
        #nhentaiCollectorMenuBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #2e51a2;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        #nhentaiCollectorMenu {
            display: none;
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 250px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 9998;
        }
        .collectorBtn {
            width: 100%;
            padding: 8px 10px;
            margin: 5px 0;
            border: none;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            text-align: left;
        }
        .collectorBtn:hover {
            opacity: 0.9;
        }
        #collectorStatus {
            margin-top: 10px;
            padding: 8px;
            background: #2a2a2a;
            border-radius: 4px;
            font-size: 12px;
            color: #ccc;
            display: none;
        }
        #collectorProgress {
            height: 3px;
            background: #333;
            border-radius: 2px;
            margin-top: 5px;
            overflow: hidden;
            display: none;
        }
        #collectorProgressBar {
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
        .menuSection {
            margin: 10px 0;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }
        .menuSection:last-child {
            border-bottom: none;
        }
        .menuSectionTitle {
            color: #4a8eff;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .stopBtn {
            background: #d32f2f !important;
        }
        .confirmationDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #333;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            width: 300px;
            max-width: 90%;
        }
        .confirmationButtons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }
        .confirmationBtn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .confirmBtn {
            background: #4CAF50;
            color: white;
        }
        .cancelBtn {
            background: #f44336;
            color: white;
        }
        .speedModeContainer {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
        }
        .speedModeBtn {
            flex: 1;
            padding: 5px;
            margin: 0 2px;
            font-size: 12px;
            border-radius: 3px;
            border: none;
            color: white;
            cursor: pointer;
        }
        .activeSpeedMode {
            outline: 2px solid #4CAF50;
            font-weight: bold;
        }
        .pageConfigContainer {
            margin-top: 5px;
        }
        .pageConfigItem {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
            font-size: 12px;
        }
        .pageConfigInput {
            width: 50px;
            padding: 3px;
            background: #2a2a2a;
            border: 1px solid #333;
            color: white;
            text-align: center;
            border-radius: 3px;
        }
        .pageConfigSaveBtn {
            width: 100%;
            padding: 5px;
            margin-top: 5px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
    `);


    const menuBtn = document.createElement('button');
    menuBtn.id = 'nhentaiCollectorMenuBtn';
    menuBtn.textContent = 'NH Collector';
    document.body.appendChild(menuBtn);


    const menu = document.createElement('div');
    menu.id = 'nhentaiCollectorMenu';


    const quickSection = document.createElement('div');
    quickSection.className = 'menuSection';
    const quickTitle = document.createElement('div');
    quickTitle.className = 'menuSectionTitle';
    quickTitle.textContent = 'Quick Actions';
    quickSection.appendChild(quickTitle);

    const showItemsBtn = document.createElement('button');
    showItemsBtn.className = 'collectorBtn';
    showItemsBtn.style.background = '#2e51a2';
    showItemsBtn.textContent = 'Show & Copy Current';
    quickSection.appendChild(showItemsBtn);


    const speedSection = document.createElement('div');
    speedSection.className = 'menuSection';
    const speedTitle = document.createElement('div');
    speedTitle.className = 'menuSectionTitle';
    speedTitle.textContent = 'Speed Mode';
    speedSection.appendChild(speedTitle);

    const speedModeContainer = document.createElement('div');
    speedModeContainer.className = 'speedModeContainer';

    for (const [modeKey, modeConfig] of Object.entries(SPEED_MODES)) {
        const speedBtn = document.createElement('button');
        speedBtn.className = `speedModeBtn ${modeKey === currentSpeed ? 'activeSpeedMode' : ''}`;
        speedBtn.textContent = modeConfig.name;
        speedBtn.style.background = modeKey === 'slow' ? '#d32f2f' : modeKey === 'normal' ? '#ff9800' : '#4CAF50';
        speedBtn.addEventListener('click', () => {
            currentSpeed = modeKey;
            GM_setValue('collectorSpeed', modeKey);
            updateSpeedModeButtons();
            showStatus(`Speed mode set to: ${modeConfig.name}`, 1500);
        });
        speedModeContainer.appendChild(speedBtn);
    }
    speedSection.appendChild(speedModeContainer);


    const configSection = document.createElement('div');
    configSection.className = 'menuSection';
    const configTitle = document.createElement('div');
    configTitle.className = 'menuSectionTitle';
    configTitle.textContent = 'Page Configuration';
    configSection.appendChild(configTitle);

    const pageConfigContainer = document.createElement('div');
    pageConfigContainer.className = 'pageConfigContainer';


    Object.keys(CONFIG).forEach(type => {
        const config = CONFIG[type];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'pageConfigItem';

        const label = document.createElement('span');
        label.textContent = `${config.name}s:`;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'pageConfigInput';
        input.value = config.endPage;
        input.min = 1;

        itemDiv.appendChild(label);
        itemDiv.appendChild(input);
        pageConfigContainer.appendChild(itemDiv);
    });

    const saveConfigBtn = document.createElement('button');
    saveConfigBtn.className = 'pageConfigSaveBtn';
    saveConfigBtn.textContent = 'Save Page Numbers';
    saveConfigBtn.addEventListener('click', savePageConfig);
    pageConfigContainer.appendChild(saveConfigBtn);
    configSection.appendChild(pageConfigContainer);

    const autoSection = document.createElement('div');
    autoSection.className = 'menuSection';
    const autoTitle = document.createElement('div');
    autoTitle.className = 'menuSectionTitle';
    autoTitle.textContent = 'Auto Collect';
    autoSection.appendChild(autoTitle);


    const autoTagBtn = createAutoButton('tag');
    const autoArtistBtn = createAutoButton('artist');
    const autoCharacterBtn = createAutoButton('character');
    const autoParodyBtn = createAutoButton('parody');

    autoSection.appendChild(autoTagBtn);
    autoSection.appendChild(autoArtistBtn);
    autoSection.appendChild(autoCharacterBtn);
    autoSection.appendChild(autoParodyBtn);


    const statusArea = document.createElement('div');
    statusArea.id = 'collectorStatus';

    const progressArea = document.createElement('div');
    progressArea.id = 'collectorProgress';
    const progressBar = document.createElement('div');
    progressBar.id = 'collectorProgressBar';
    progressArea.appendChild(progressBar);


    menu.appendChild(quickSection);
    menu.appendChild(speedSection);
    menu.appendChild(configSection);
    menu.appendChild(autoSection);
    menu.appendChild(statusArea);
    menu.appendChild(progressArea);
    document.body.appendChild(menu);


    menu.style.display = menuOpen ? 'block' : 'none';


    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menuOpen = !menuOpen;
        menu.style.display = menuOpen ? 'block' : 'none';
        GM_setValue('menuOpenState', menuOpen);
    });


    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });


    document.addEventListener('click', function() {
        menuOpen = false;
        menu.style.display = 'none';
        GM_setValue('menuOpenState', false);
    });


    function savePageConfig() {
        const inputs = menu.querySelectorAll('.pageConfigInput');
        let index = 0;

        Object.keys(CONFIG).forEach(type => {
            const newValue = parseInt(inputs[index].value);
            if (!isNaN(newValue) && newValue > 0) {
                CONFIG[type].endPage = newValue;
            }
            index++;
        });

        GM_setValue('collectorConfig', CONFIG);
        updateAutoButtons();
        showStatus('Page numbers saved!', 2000);
    }


    function updateSpeedModeButtons() {
        const buttons = menu.querySelectorAll('.speedModeBtn');
        buttons.forEach(btn => {
            btn.classList.remove('activeSpeedMode');
            const modeKey = Object.keys(SPEED_MODES).find(key => SPEED_MODES[key].name === btn.textContent);
            if (modeKey === currentSpeed) {
                btn.classList.add('activeSpeedMode');
            }
        });
    }


    function updateAutoButtons() {
        Object.keys(CONFIG).forEach(type => {
            const config = CONFIG[type];
            const btn = document.getElementById(`auto${config.name}Btn`);
            if (btn) {
                btn.textContent = `${config.name}s (${config.endPage}p)`;
            }
        });
    }


    GM_registerMenuCommand("Show & Copy Current Items", () => showItemsBtn.click());
    GM_registerMenuCommand("Auto Collect Tags", () => autoTagBtn.click());
    GM_registerMenuCommand("Auto Collect Artists", () => autoArtistBtn.click());
    GM_registerMenuCommand("Auto Collect Characters", () => autoCharacterBtn.click());
    GM_registerMenuCommand("Auto Collect Parodies", () => autoParodyBtn.click());

    function createAutoButton(type) {
        const config = CONFIG[type];
        const btn = document.createElement('button');
        btn.className = 'collectorBtn';
        btn.id = `auto${config.name}Btn`;
        btn.textContent = `${config.name}s (${config.endPage}p)`;
        btn.style.background = config.buttonColor;
        return btn;
    }


    function extractItems() {
        const sections = document.querySelectorAll('#tag-container section, #content .container section');
        const items = [];

        sections.forEach(section => {
            const itemLinks = section.querySelectorAll('a');
            itemLinks.forEach(link => {
                const nameSpan = link.querySelector('span.name');
                if (nameSpan) {
                    const itemName = nameSpan.textContent.trim();
                    if (itemName) {
                        items.push(itemName);
                    }
                }
            });
        });

        return items.sort((a, b) => a.localeCompare(b));
    }


    function formatItems(items) {
        return `[${items.map(item => `"${item}"`).join(', ')}]`;
    }


    showItemsBtn.addEventListener('click', function() {
        const items = extractItems();

        if (items.length === 0) {
            showStatus('No items found on this page.', 3000);
            return;
        }


        const formattedItems = formatItems(items);
        GM_setClipboard(formattedItems, 'text');


        showStatus(`${items.length} items copied to clipboard!`, 2000);
    });


    function showStatus(message, duration = 0) {
        statusArea.textContent = message;
        statusArea.style.display = 'block';

        if (duration > 0) {
            setTimeout(() => {
                statusArea.style.display = 'none';
            }, duration);
        }
    }


    async function waitForPageLoad() {
        return new Promise((resolve) => {
            const checkInterval = SPEED_MODES[currentSpeed].loadCheckInterval;
            const maxChecks = 10;
            let checks = 0;

            const interval = setInterval(() => {

                const container = document.querySelector('#tag-container, #content .container');
                if (container && container.textContent.trim().length > 0) {
                    clearInterval(interval);
                    resolve(true);
                } else if (checks >= maxChecks) {
                    clearInterval(interval);
                    resolve(false);
                }
                checks++;
            }, checkInterval);
        });
    }


    function setupAutoButton(type) {
        const config = CONFIG[type];
        const btn = document.getElementById(`auto${config.name}Btn`);

        btn.addEventListener('click', async function() {
            if (btn.textContent.startsWith('Stop')) {
                stopAutoCollection(type);
                return;
            }


            const storedData = GM_getValue(`auto${config.name}Data`);
            if (storedData && storedData.items && storedData.items.length > 0) {
                showConfirmationDialog(type);
            } else {
                startAutoCollection(type);
            }
        });
    }

    function showConfirmationDialog(type) {
        const config = CONFIG[type];
        const dialog = document.createElement('div');
        dialog.className = 'confirmationDialog';

        const text = document.createElement('p');
        text.textContent = `You already have ${config.name}s stored (${GM_getValue(`auto${config.name}Data`).items.length} items). Do you want to recollect them?`;

        const buttons = document.createElement('div');
        buttons.className = 'confirmationButtons';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirmationBtn confirmBtn';
        confirmBtn.textContent = 'Yes, recollect';
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            startAutoCollection(type);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'confirmationBtn cancelBtn';
        cancelBtn.textContent = 'No, use stored';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            useStoredData(type);
        });

        buttons.appendChild(confirmBtn);
        buttons.appendChild(cancelBtn);
        dialog.appendChild(text);
        dialog.appendChild(buttons);
        document.body.appendChild(dialog);
    }

    function useStoredData(type) {
        const config = CONFIG[type];
        const storedData = GM_getValue(`auto${config.name}Data`);

        if (storedData && storedData.items) {
            const formattedItems = formatItems(storedData.items);
            GM_setClipboard(formattedItems, 'text');

            showStatus(`Used stored ${config.name.toLowerCase()}s (${storedData.items.length} items)`);
        }
    }

    function startAutoCollection(type) {
        const config = CONFIG[type];
        GM_setValue(`auto${config.name}Running`, true);
        GM_setValue(`auto${config.name}Page`, 1);
        GM_setValue(`auto${config.name}Items`, []);

        const btn = document.getElementById(`auto${config.name}Btn`);
        btn.textContent = `Stop ${config.name}s`;
        btn.classList.add('stopBtn');

        showStatus(`Starting Auto ${config.name}s collection...`);
        progressBar.style.width = '0%';
        progressArea.style.display = 'block';


        navigateToPage(type, 1);
    }

    function stopAutoCollection(type) {
        const config = CONFIG[type];
        GM_deleteValue(`auto${config.name}Running`);
        GM_deleteValue(`auto${config.name}Page`);
        GM_deleteValue(`auto${config.name}Items`);

        const btn = document.getElementById(`auto${config.name}Btn`);
        btn.textContent = `${config.name}s (${config.endPage}p)`;
        btn.classList.remove('stopBtn');
        btn.style.background = config.buttonColor;

        showStatus(`Auto ${config.name}s stopped by user`);
        progressArea.style.display = 'none';
    }

    async function navigateToPage(type, page) {
        const config = CONFIG[type];
        const currentUrl = new URL(window.location.href);


        let expectedPath;
        if (type === 'tag') expectedPath = '/tags/';
        else if (type === 'artist') expectedPath = '/artists/';
        else if (type === 'character') expectedPath = '/characters/';
        else if (type === 'parody') expectedPath = '/parodies/';

        if (currentUrl.pathname === expectedPath && currentUrl.searchParams.get('page') === page.toString()) {

            await processPage(type);
        } else {

            showStatus(`Loading ${config.name.toLowerCase()}s page ${page}...`);
            window.location.href = `${config.startUrl.split('?')[0]}?page=${page}`;
        }
    }

    async function processPage(type) {
        const config = CONFIG[type];
        const currentPage = GM_getValue(`auto${config.name}Page`, 1);


        const pageLoaded = await waitForPageLoad();
        if (!pageLoaded) {
            showStatus(`Warning: Page ${currentPage} may not have loaded completely`);
        }

        const items = extractItems();
        const allItems = GM_getValue(`auto${config.name}Items`, []).concat(items);

        GM_setValue(`auto${config.name}Items`, allItems);


        const progress = Math.floor((currentPage / config.endPage) * 100);
        progressBar.style.width = `${progress}%`;
        showStatus(`${config.name}s page ${currentPage}/${config.endPage} processed. Found ${items.length} items (Total: ${allItems.length})`);

        if (currentPage >= config.endPage) {

            finishAutoCollection(type, allItems);
            return;
        }


        GM_setValue(`auto${config.name}Page`, currentPage + 1);
        setTimeout(() => {
            navigateToPage(type, currentPage + 1);
        }, SPEED_MODES[currentSpeed].delay);
    }

    function finishAutoCollection(type, allItems) {
        const config = CONFIG[type];
        const formattedItems = formatItems(allItems);
        GM_setClipboard(formattedItems, 'text');


        GM_setValue(`auto${config.name}Data`, {
            items: allItems,
            collectedAt: new Date().toISOString()
        });


        GM_deleteValue(`auto${config.name}Running`);
        GM_deleteValue(`auto${config.name}Page`);
        GM_deleteValue(`auto${config.name}Items`);


        const btn = document.getElementById(`auto${config.name}Btn`);
        btn.textContent = `${config.name}s (${config.endPage}p)`;
        btn.classList.remove('stopBtn');
        btn.style.background = config.buttonColor;

        showStatus(`All done! Copied ${allItems.length} ${config.name.toLowerCase()}s to clipboard.`);
        progressBar.style.width = '100%';

        setTimeout(() => {
            progressArea.style.display = 'none';
        }, 3000);
    }


    setupAutoButton('tag');
    setupAutoButton('artist');
    setupAutoButton('character');
    setupAutoButton('parody');


    Object.keys(CONFIG).forEach(type => {
        const config = CONFIG[type];
        if (GM_getValue(`auto${config.name}Running`, false)) {
            const currentPage = GM_getValue(`auto${config.name}Page`, 1);
            const currentUrl = new URL(window.location.href);


            let expectedPath;
            if (type === 'tag') expectedPath = '/tags/';
            else if (type === 'artist') expectedPath = '/artists/';
            else if (type === 'character') expectedPath = '/characters/';
            else if (type === 'parody') expectedPath = '/parodies/';

            if (currentUrl.pathname === expectedPath) {

                const btn = document.getElementById(`auto${config.name}Btn`);
                btn.textContent = `Stop ${config.name}s`;
                btn.classList.add('stopBtn');
                progressArea.style.display = 'block';


                setTimeout(() => {
                    processPage(type);
                }, 1000);
            }
        }
    });
})();