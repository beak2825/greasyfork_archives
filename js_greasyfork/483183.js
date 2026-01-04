// ==UserScript==
// @name         Torn Rigs Layout Switcher
// @namespace    https://github.com/SOLiNARY
// @version      0.7.3
// @description  Adds "Save current rig layout" & "Empty rig layout" quick actions to a Cracking crime.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes#/cracking
// @match        https://www.torn.com/page.php?sid=crimes#/cracking
// @match        https://sliw.co/rig/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483183/Torn%20Rigs%20Layout%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/483183/Torn%20Rigs%20Layout%20Switcher.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const IS_DEBUG = false;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';

    // Avoid duplicated loading
    if (window.RIGS_LAYOUT_SWITCHER_WATCHER) {
        return;
    }
    window.RIGS_LAYOUT_SWITCHER_WATCHER = true;

    setScriptVersion();
    if (!checkCurrentSite()){
        return;
    }
    let rigLayouts = localStorage.getItem("silmaril-rigs-layout-switcher-layouts") ?? "";
    let rigLayoutsArray = rigLayouts.split(',');
    checkUrlForImport();

    class ComponentInfo {
        constructor(x = null, y = null, item = null, x2 = null, y2 = null, action = null) {
            this.x = x;
            this.y = y;
            this.item = item;
            this.x2 = x2;
            this.y2 = y2;
            this.action = action;
        }
    }

    const rfcvArg = "rfcv=";
    let rfcv = localStorage.getItem("silmaril-rigs-layout-switcher-rfcv") ?? null;
    const crimesReadUrl = '/page.php?sid=crimesData&step=crimesList&';
    const crimesWriteUrl = '/page.php?sid=crimesData&step=prepare&';
    let rfcvUpdatedThisSession = false;
    let mutationFound = false;
    let panelAdded = false;
    IS_DEBUG ? console.log('rigLayouts', rigLayouts, rigLayoutsArray) : null;
    let currentRig = 0;
    let rigsInfo = {0: [], 1: [], 2: []};
    let requestsQueue = [];

    const { fetch: originalFetch } = isTampermonkeyEnabled ? unsafeWindow : window;

    const customFetch = async (...args) => {
        let [resource, config] = args;
        let response = await originalFetch(resource, config);

        IS_DEBUG ? console.log('response', response) : null;
        let fetchUrl = response.url;
        if (fetchUrl.indexOf(crimesReadUrl) >= 0 || fetchUrl.indexOf(crimesWriteUrl) >= 0) {
            try {
                const jsonData = await response.clone().json();
                const rig = fetchUrl.indexOf(crimesReadUrl) >= 0 ? jsonData.DB.crimesByType.rig : jsonData.DB.additionalInfo.prepareInfo.rig;
                IS_DEBUG ? console.log('rig.chassis', rig.chassis) : null;
                rig.chassis.forEach((rigData, rigId) => {
                    IS_DEBUG ? console.log('rigData', rigData) : null;
                    IS_DEBUG ? console.log('rigId', rigId) : null;
                    IS_DEBUG ? console.log('rigData.components', rigData.components) : null;
                    let items = [];
                    if (rigData.components == null) {
                        rigsInfo[rigId] = [];
                        return;
                    }
                    rigData.components.forEach((componentData) => {
                        if (componentData.ID == 0) {
                            return;
                        }
                        let componentInfo = new ComponentInfo(componentData.coords[0].x, componentData.coords[0].y, componentData.ID);
                        if (componentData.coords[1] != null) {
                            componentInfo.x2 = componentData.coords[1].x;
                            componentInfo.y2 = componentData.coords[1].y;
                        }
                        items.push(componentInfo);
                    });
                    rigsInfo[rigId] = items;
                });
                IS_DEBUG ? console.log('rigsInfo', rigsInfo) : null;
            } catch (error) {
                console.log('[TornRigsLayoutSwitcher] No targets, skipping the script init', error);
            }
        }

        if (rfcvUpdatedThisSession) {
            return response;
        }

        if (!rfcvUpdatedThisSession){
            let rfcvIdx = fetchUrl.indexOf(rfcvArg);
            if (rfcvIdx >= 0){
                rfcv = fetchUrl.substr(rfcvIdx + rfcvArg.length);
                localStorage.setItem("silmaril-loadout-switcher-rfcv", rfcv);
                document.querySelectorAll("div.silmaril-torn-rigs-layout-switcher-container button").forEach((button) => button.classList.remove("disabled"));
                rfcvUpdatedThisSession = true;
            }
        }

        return response;
    };

    if (isTampermonkeyEnabled){
        unsafeWindow.fetch = customFetch;
    } else {
        window.fetch = customFetch;
    }

    const styles = `.wave-animation{position:relative;overflow:hidden}.wave{pointer-events:none;position:absolute;width:100%;height:33px;background-color:transparent;opacity:0;transform:translateX(-100%);animation:3s cubic-bezier(0,0,0,1) waveAnimation}@keyframes waveAnimation{0%{opacity:1;transform:translateX(-100%)}100%{opacity:0;transform:translateX(100%)}}`;

    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null){
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    const setLayoutUrl = "/page.php?sid=crimesData&step=prepare&rfcv={rfcv}";
    const resetTemplate = `{"step":"resetRig","chassisID":{rig}}`;
    const layoutTemplate = `{"step":"{step}","chassisID":{rig},"ID":{component},"coords":[{shortComponent}{longComponent}]}`;
    const coordinatesTemplate = `{"x":{xCoordinate},"y":{yCoordinate}}`;
    const add = 'add';
    const remove = 'remove';
    const componentIds = {
        "eCPU": 1,
        "CPU": 2,
        "HPCPU": 3,
        "Fan": 4,
        "Water Block": 5,
        "Heat Sink": 6,
        "PSU": 7,
        "None": 0
    };

    const observerTarget = document.querySelector("html");
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationItem) {
            if (mutationFound || panelAdded){
                observer.disconnect();
                return;
            }
            let mutation = mutationItem.target;
            if (mutation.classList == "crime-root cracking-root" || mutation.querySelector('div[class*=rig___]')) {
                IS_DEBUG ? console.log('MATCHED RIG', mutation.querySelector('div[class*=rig___]')) : null;
                const rigDiv = mutation.querySelector('div[class*=rig___]');
                if (rigDiv == null)
                {
                    IS_DEBUG ? console.log('no rig found') : null;
                    return;
                }
                IS_DEBUG ? console.log('Rig Found!') : null;
                mutationFound = true;
                observer.disconnect();
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'silmaril-rigs-layout-switcher-templates';

                const waveDiv = document.createElement('div');
                waveDiv.className = 'wave';

                buttonContainer.appendChild(waveDiv);
                addEmptyAndLayoutButtons(buttonContainer);

                const spamButton = document.createElement('button');
                spamButton.id = 'silmaril-rigs-layout-switcher-spam-button';
                spamButton.type = 'button';
                spamButton.className = 'torn-btn non-deletable disabled';
                spamButton.textContent = 'No layout chosen';
                spamButton.addEventListener('click', async event => {
                    if (event.target.classList.contains('disabled')){
                        return;
                    }
                    const poppedItems = requestsQueue.shift();
                    const urlToProcess = poppedItems[0];
                    const layoutUrl = poppedItems[1];
                    await sendSetLayoutRequest(urlToProcess, layoutUrl);
                    if (requestsQueue.length == 0) {
                        event.target.classList.add('disabled');
                        event.target.textContent = 'All requests completed!';
                    } else {
                        event.target.textContent = `Spam click ${requestsQueue.length} more times!`;
                    }
                });

                if (!panelAdded){
                    document.querySelector('div[class*=currentCrime___]').append(getRigChoices(), getLayoutActions(document.querySelector('div[class*=cracking-root]')), buttonContainer, spamButton);
                    panelAdded = true;
                }
            }
        });
    });
    observer.observe(observerTarget, observerConfig);

    function setScriptVersion() {
        try {
            if (isTampermonkeyEnabled) {
                unsafeWindow.tornRigLayoutSwitcherVersion = GM_info.script.version;
            } else {
                window.tornRigLayoutSwitcherVersion = '0.5';
            }
        } catch (e) {
            console.error('[TornRigsLayoutSwitcher] Failed to get script version!', e);
        }
    }

    function checkCurrentSite() {
        try {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            const domain = url.hostname;
            return domain.indexOf('torn.com') > 0;
        } catch (e) {
            console.error('[TornRigsLayoutSwitcher] Not Torn domain!', e);
            return false;
        }
    }

    function checkUrlForImport() {
        try {
            const importString = getUrlParameter('rig-import');

            console.log('Initial value of rig-import:', importString);

            if (importString === null || importString.length < 75) {
                return;
            };

            removeUrlParameter('rig-import');
            console.log('Updated URL:', window.location.href);

            let rigsToImport = {};
            for (let i = 0; i < 3; i++) {
                let rigToImport = [];
                for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                        const currentChar = importString[x + y * 5 + i * 25];
                        switch (currentChar){
                            case 'b':
                            case 'P':
                            case 'V':
                                console.log(`[${x},${y}] Empty Slot`, currentChar);
                                break;
                            case 'e':
                                console.log(`[${x},${y}] eCPU`);
                                rigToImport.push({'x': x, 'y': y, 'item': 1});
                                break;
                            case 'c':
                                console.log(`[${x},${y}] CPU`);
                                rigToImport.push({'x': x, 'y': y, 'item': 2});
                                break;
                            case 'h':
                                console.log(`[${x},${y}] HPCPU`);
                                rigToImport.push({'x': x, 'y': y, 'item': 3});
                                break;
                            case 'f':
                                console.log(`[${x},${y}] Fan`);
                                rigToImport.push({'x': x, 'y': y, 'item': 4});
                                break;
                            case 'w':
                                console.log(`[${x},${y}] Water Block`);
                                rigToImport.push({'x': x, 'y': y, 'item': 5});
                                break;
                            case 's':
                                console.log(`[${x},${y}] Heat Sink`);
                                rigToImport.push({'x': x, 'y': y, 'item': 6});
                                break;
                            case 'p':
                                console.log(`[${x},${y}] PSU Horizontal`);
                                rigToImport.push({'x': x, 'y': y, 'item': 7, 'x2': x + 1, 'y2': y});
                                break;
                            case 'v':
                                console.log(`[${x},${y}] PSU Vertical`);
                                rigToImport.push({'x': x, 'y': y, 'item': 7, 'x2': x, 'y2': y + 1});
                                break;
                            default:
                                console.log(`[${x},${y}] Unknown character`, currentChar);
                                break;
                        }
                    }
                }
                if (rigToImport.length > 0) {
                    rigsToImport[`rig-case.${i}`] = rigToImport;
                }
            }
            console.log('rigsToImport', rigsToImport);
            importLayout(rigsToImport);
        }
        catch (e) {
            console.error('[TornRigsLayoutSwitcher] Failed to import from URL!', e);
        }
    }

    function addEmptyAndLayoutButtons(root){
        const empty = document.createElement('button');
        empty.type = 'button';
        empty.className = 'torn-btn non-deletable';
        empty.textContent = 'Empty';
        empty.setAttribute('data-action', 'remove');
        empty.addEventListener('click', () => {handleLoadoutClick(root)});
        root.appendChild(empty);

        addLayoutButtons(root);
    }

    function getRigChoices(){
        const rigChoiceWrapper = document.createElement('ul');
        rigChoiceWrapper.role = 'tablist';
        rigChoiceWrapper.className = 'torn-tabs tabs-dark ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all';

        const rigChoice1 = document.createElement('li');
        rigChoice1.id = 'silmaril-rigs-layout-switcher-choice-1';
        rigChoice1.role = 'button';
        rigChoice1.ariaSelected = 'true';
        rigChoice1.setAttribute('data-disable', '0');
        rigChoice1.className = 'ui-state-default ui-corner-top ui-tabs-active ui-state-active';
        rigChoice1.addEventListener('click', event => {
            IS_DEBUG ? console.log('event', event) : null;
            currentRig = 0;
            event.target.parentNode.classList.add('ui-tabs-active');
            event.target.parentNode.classList.add('ui-state-active');
            let rig2 = document.getElementById('silmaril-rigs-layout-switcher-choice-2');
            rig2.classList.remove('ui-tabs-active');
            rig2.classList.remove('ui-state-active');
            let rig3 = document.getElementById('silmaril-rigs-layout-switcher-choice-3');
            rig3.classList.remove('ui-tabs-active');
            rig3.classList.remove('ui-state-active');
            IS_DEBUG ? console.log('currentRig', currentRig) : null;
        });
        const rigChoiceLink1 = document.createElement('a');
        rigChoiceLink1.innerText = 'Chassis #1';
        rigChoice1.append(rigChoiceLink1);

        const rigChoice2 = document.createElement('li');
        rigChoice2.id = 'silmaril-rigs-layout-switcher-choice-2';
        rigChoice2.role = 'button';
        rigChoice2.ariaSelected = 'false';
        rigChoice2.setAttribute('data-disable', '0');
        rigChoice2.className = 'ui-state-default ui-corner-top';
        rigChoice2.addEventListener('click', event => {
            IS_DEBUG ? console.log('event', event) : null;
            currentRig = 1;
            event.target.parentNode.classList.add('ui-tabs-active');
            event.target.parentNode.classList.add('ui-state-active');
            let rig1 = document.getElementById('silmaril-rigs-layout-switcher-choice-1');
            rig1.classList.remove('ui-tabs-active');
            rig1.classList.remove('ui-state-active');
            let rig3 = document.getElementById('silmaril-rigs-layout-switcher-choice-3');
            rig3.classList.remove('ui-tabs-active');
            rig3.classList.remove('ui-state-active');
            IS_DEBUG ? console.log('currentRig', currentRig) : null;
        });
        const rigChoiceLink2 = document.createElement('a');
        rigChoiceLink2.innerText = 'Chassis #2';
        rigChoice2.append(rigChoiceLink2);

        const rigChoice3 = document.createElement('li');
        rigChoice3.id = 'silmaril-rigs-layout-switcher-choice-3';
        rigChoice3.role = 'button';
        rigChoice3.ariaSelected = 'false';
        rigChoice3.setAttribute('data-disable', '0');
        rigChoice3.className = 'ui-state-default ui-corner-top';
        rigChoice3.addEventListener('click', event => {
            IS_DEBUG ? console.log('event', event) : null;
            currentRig = 2;
            event.target.parentNode.classList.add('ui-tabs-active');
            event.target.parentNode.classList.add('ui-state-active');
            let rig1 = document.getElementById('silmaril-rigs-layout-switcher-choice-1');
            rig1.classList.remove('ui-tabs-active');
            rig1.classList.remove('ui-state-active');
            let rig2 = document.getElementById('silmaril-rigs-layout-switcher-choice-2');
            rig2.classList.remove('ui-tabs-active');
            rig2.classList.remove('ui-state-active');
            IS_DEBUG ? console.log('currentRig', currentRig) : null;
        });
        const rigChoiceLink3 = document.createElement('a');
        rigChoiceLink3.innerText = 'Chassis #3';
        rigChoice3.append(rigChoiceLink3);

        rigChoiceWrapper.append(rigChoice1, rigChoice2, rigChoice3);
        IS_DEBUG ? console.log('rigChoiceWrapper', rigChoiceWrapper) : null;
        return rigChoiceWrapper;
    }

    function getLayoutActions(root){
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'silmaril-torn-rigs-layout-switcher-container';

        const saveCurrentLayout = document.createElement('button');
        saveCurrentLayout.type = 'button';
        saveCurrentLayout.className = 'torn-btn';
        saveCurrentLayout.textContent = 'Save current layout';
        saveCurrentLayout.addEventListener('click', () => {
            IS_DEBUG ? console.log('save current layout') : null;
            let userInput = prompt("Please enter a unique name for a layout (DO NOT USE COMMAS ',')" ?? '').toLowerCase();
            if (userInput !== null && userInput.length > 0) {
                rigLayouts = localStorage.getItem("silmaril-rigs-layout-switcher-layouts") ?? "";
                rigLayoutsArray = rigLayouts.split(',');
                if (!rigLayoutsArray.includes(userInput)) {
                    rigLayoutsArray.push(userInput);
                    rigLayouts = rigLayoutsArray.join(',');
                    localStorage.setItem("silmaril-rigs-layout-switcher-layouts", rigLayouts);
                }
                localStorage.setItem(`silmaril-rigs-layout-switcher-layout-${userInput}`, JSON.stringify(rigsInfo[currentRig], customReplacer));
                root.querySelectorAll("div.silmaril-rigs-layout-switcher-templates > button:not(.non-deletable)").forEach((item) => item.remove());
                addLayoutButtons(root.querySelector('div[class*=currentCrime___] > div.silmaril-rigs-layout-switcher-templates'));
            } else {
                console.error("[TornRigsLayoutSwitcher] User cancelled the layout naming input.");
            }
        });

        const deleteLayout = document.createElement('button');
        deleteLayout.type = 'button';
        deleteLayout.className = 'torn-btn';
        deleteLayout.textContent = 'Delete layout';
        deleteLayout.addEventListener('click', () => {
            IS_DEBUG ? console.log('delete layout') : null;
            let userInput = prompt("Please enter a name of a layout to delete" ?? '').toLowerCase();
            if (userInput !== null && userInput.length > 0) {
                rigLayouts = localStorage.getItem("silmaril-rigs-layout-switcher-layouts") ?? "";
                rigLayoutsArray = rigLayouts.split(',');
                rigLayoutsArray = rigLayoutsArray.filter(item => item !== userInput);
                rigLayouts = rigLayoutsArray.join(',');
                localStorage.setItem("silmaril-rigs-layout-switcher-layouts", rigLayouts);
                localStorage.removeItem(`silmaril-rigs-layout-switcher-layout-${userInput}`);
                root.querySelectorAll("div.silmaril-rigs-layout-switcher-templates > button:not(.non-deletable)").forEach((item) => item.remove());
                addLayoutButtons(root.querySelector('div[class*=currentCrime___] > div.silmaril-rigs-layout-switcher-templates'));
            } else {
                console.error("[TornRigsLayoutSwitcher] User cancelled the layout naming input.");
            }
        });

        const disableRig = document.createElement('button');
        disableRig.type = 'button';
        disableRig.className = 'torn-btn';
        disableRig.textContent = 'Disable rig';
        disableRig.addEventListener('click', () => {
            IS_DEBUG ? console.log('disable rig') : null;
            saveSetLayoutRequestsToQueue(remove, 0, rigsInfo[0].filter(x => x.item === componentIds.PSU), null);
            saveSetLayoutRequestsToQueue(remove, 1, rigsInfo[1].filter(x => x.item === componentIds.PSU), null, false);
            saveSetLayoutRequestsToQueue(remove, 2, rigsInfo[2].filter(x => x.item === componentIds.PSU), null, false);
        });

        const exportAllLayouts = document.createElement('button');
        exportAllLayouts.type = 'button';
        exportAllLayouts.className = 'torn-btn';
        exportAllLayouts.textContent = 'Export all layouts';
        exportAllLayouts.addEventListener('click', () => {
            IS_DEBUG ? console.log('export all layouts') : null;
            rigLayouts = localStorage.getItem("silmaril-rigs-layout-switcher-layouts") ?? "";
            rigLayoutsArray = rigLayouts.split(',');
            let allLayoutsToExport = {};

            rigLayoutsArray.forEach((layoutName) => {
                if (layoutName == ''){
                    return;
                }
                try {
                    const layoutInfo = localStorage.getItem(`silmaril-rigs-layout-switcher-layout-${layoutName}`);
                    IS_DEBUG ? console.log(`layout ${layoutName}`, layoutInfo) : null;
                    allLayoutsToExport[layoutName] = JSON.parse(layoutInfo);
                    IS_DEBUG ? console.log('allLayoutsToExport step', allLayoutsToExport) : null;
                } catch (e) {
                    return;
                }
            });

            IS_DEBUG ? console.log('allLayoutsToExport final', allLayoutsToExport) : null;
            const allLayoutsToExportRaw = JSON.stringify(allLayoutsToExport, customReplacer);
            IS_DEBUG ? console.log('allLayoutsToExport stringify', allLayoutsToExportRaw) : null;

            prompt('Copy the text below & share it with friends!', allLayoutsToExportRaw);
        });

        const exportLayout = document.createElement('button');
        exportLayout.type = 'button';
        exportLayout.className = 'torn-btn';
        exportLayout.textContent = 'Export layout';
        exportLayout.addEventListener('click', () => {
            IS_DEBUG ? console.log('export layout') : null;
            let userInput = prompt("Please enter a name of a layout to export" ?? '').toLowerCase();
            if (userInput !== null && userInput.length > 0) {
                let layoutToExport = {};
                try {
                    const layoutInfo = localStorage.getItem(`silmaril-rigs-layout-switcher-layout-${userInput}`);
                    if (layoutInfo == null) {
                        console.log('[TornRigsLayoutSwitcher] No layout with this name!', userInput);
                        return;
                    }
                    IS_DEBUG ? console.log(`layout ${userInput}`, layoutInfo) : null;
                    layoutToExport[userInput] = JSON.parse(layoutInfo);
                } catch (e) {
                    return;
                }

                IS_DEBUG ? console.log('layoutToExport final', layoutToExport) : null;
                const layoutToExportRaw = JSON.stringify(layoutToExport, customReplacer);
                IS_DEBUG ? console.log('layoutToExport stringify', layoutToExportRaw) : null;

                prompt('Copy the text below & share it with friends!', layoutToExportRaw);
            } else {
                console.error("[TornRigsLayoutSwitcher] User cancelled the layout naming input.");
            }
        });

        const importLayouts = document.createElement('button');
        importLayouts.type = 'button';
        importLayouts.className = 'torn-btn';
        importLayouts.textContent = 'Import layouts';
        importLayouts.addEventListener('click', () => {
            IS_DEBUG ? console.log('save current layout') : null;
            let userInput = prompt("Please copy-paste the string which has been shared with you" ?? '').toLowerCase();
            if (userInput !== null && userInput.length > 0) {
                try {
                    const allLayoutsToImport = JSON.parse(userInput);
                    importLayout(allLayoutsToImport);
                }
                catch (e) {
                    return;
                }

                root.querySelectorAll("div.silmaril-rigs-layout-switcher-templates > button:not(.non-deletable)").forEach((item) => item.remove());
                addLayoutButtons(root.querySelector('div[class*=currentCrime___] > div.silmaril-rigs-layout-switcher-templates'));
            } else {
                console.error("[TornRigsLayoutSwitcher] User cancelled the layout naming input.");
            }
        });

        actionsContainer.append(saveCurrentLayout, deleteLayout, disableRig, exportAllLayouts, exportLayout, importLayouts);
        return actionsContainer;
    }

    async function addLayoutButtons(root){
        rigLayoutsArray.forEach((layout) => {
            if (layout == ''){
                return;
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.className = rfcv === null ? 'torn-btn disabled' : 'torn-btn';
            button.textContent = layout;
            button.setAttribute('data-action', 'add');
            button.addEventListener('click', () => {handleLoadoutClick(root, layout)});

            root.appendChild(button);
        })
    }

    function importLayout(allLayoutsToImport) {
        IS_DEBUG ? console.log('allLayoutsToImport', allLayoutsToImport) : null;
        const allLayoutNamesToImport = Object.keys(allLayoutsToImport);
        rigLayouts = localStorage.getItem("silmaril-rigs-layout-switcher-layouts") ?? "";
        rigLayoutsArray = rigLayouts.split(',');

        allLayoutNamesToImport.forEach((layoutName) => {
            if (layoutName == ''){
                return;
            }
            IS_DEBUG ? console.log('layoutName', layoutName) : null;
            IS_DEBUG ? console.log('layout', allLayoutsToImport[layoutName]) : null;
            try {
                if (!rigLayoutsArray.includes(layoutName)) {
                    rigLayoutsArray.push(layoutName);
                }
                localStorage.setItem(`silmaril-rigs-layout-switcher-layout-${layoutName}`, JSON.stringify(allLayoutsToImport[layoutName], customReplacer));
                IS_DEBUG ? console.log('layougetLayout', localStorage.getItem(`silmaril-rigs-layout-switcher-layout-${layoutName}`)) : null;
            } catch (e) {
                console.error("[TornRigsLayoutSwitcher] Error while importing Layout", e);
                return;
            }
        });

        rigLayouts = rigLayoutsArray.join(',');
        localStorage.setItem("silmaril-rigs-layout-switcher-layouts", rigLayouts);
    }

    async function handleLoadoutClick(root, layoutName = null){
        let action = event.target.getAttribute('data-action');
        if (event.target.classList.contains('disabled')){
            return;
        }
        IS_DEBUG ? console.log('rigsInfo', rigsInfo) : null;
        let currentLayout = rigsInfo[currentRig];
        currentLayout.forEach(cell => {
            if (cell.x2 != null && cell.y2 != null) {
                // Swap the values
                if (cell.x == cell.x2 && cell.y > cell.y2) {
                    cell.y2 = [cell.y, cell.y = cell.y2][0];
                }
                if (cell.y == cell.y2 && cell.x > cell.x2) {
                    cell.x2 = [cell.x, cell.x = cell.x2][0];
                }
            }
        });
        let layoutItemsToBeRemoved = [];
        let layoutItemsToBeAdded = [];
        if (layoutName == null) {
            let resetRig = new ComponentInfo();
            resetRig.action = 'resetRig';
            action = 'resetRig';
            layoutItemsToBeRemoved.push(resetRig);
        } else {
            let newLayout = JSON.parse(localStorage.getItem(`silmaril-rigs-layout-switcher-layout-${layoutName}`));
            newLayout.forEach(cell => {
                if (cell.x2 != null && cell.y2 != null) {
                    // Swap the values
                    if (cell.x == cell.x2 && cell.y > cell.y2) {
                        cell.y2 = [cell.y, cell.y = cell.y2][0];
                    }
                    if (cell.y == cell.y2 && cell.x > cell.x2) {
                        cell.x2 = [cell.x, cell.x = cell.x2][0];
                    }
                }
            });
            for (let x = 0; x < 5; x++) {
                for (let y = 0; y < 5; y++) {
                    let currentCell = currentLayout.filter(cell => cell.x == x && cell.y == y);
                    let newCell = newLayout.filter(cell => cell.x == x && cell.y == y);
                    if (currentCell.length == 0) {
                        if (newCell.length == 0) {
                            IS_DEBUG ? console.log(`[${x},${y}] no cells, no conflict`) : null;
                            continue;
                        } else {
                            IS_DEBUG ? console.log(`[${x},${y}] adding new cell`) : null;
                            IS_DEBUG ? console.log('newCell[0]', newCell[0]) : null;
                            let clonedCell = newCell[0];
                            clonedCell.action = 'add';
                            layoutItemsToBeAdded.push(clonedCell);
                        }
                    } else {
                        if (newCell.length == 0) {
                            IS_DEBUG ? console.log(`[${x},${y}] removing old cell`) : null;
                            IS_DEBUG ? console.log('currentCell[0]', currentCell[0]) : null;
                            let clonedCell = currentCell[0];
                            clonedCell.action = 'remove';
                            layoutItemsToBeRemoved.push(clonedCell);
                        } else {
                            IS_DEBUG ? console.log(`[${x},${y}] comparing cells`) : null;
                            IS_DEBUG ? console.log('currentCell[0]', currentCell[0]) : null;
                            IS_DEBUG ? console.log('newCell[0]', newCell[0]) : null;
                            if (currentCell[0].item == newCell[0].item && currentCell[0].x2 == newCell[0].x2 && currentCell[0].y2 == newCell[0].y2) {
                                IS_DEBUG ? console.log(`[${x},${y}] same cells, no conflict`) : null;
                                continue;
                            } else {
                                IS_DEBUG ? console.log(`[${x},${y}] diff cells, remove & add`) : null;
                                let oldClonedCell = currentCell[0];
                                oldClonedCell.action = 'remove';
                                layoutItemsToBeRemoved.push(oldClonedCell);
                                let newClonedCell = newCell[0];
                                newClonedCell.action = 'add';
                                layoutItemsToBeAdded.push(newClonedCell);
                            }
                        }
                    }
                }
            }
        }
        const layoutItems = [...layoutItemsToBeRemoved, ...layoutItemsToBeAdded];
        IS_DEBUG ? console.log('currentLayout', currentLayout) : null;
        IS_DEBUG ? console.log('layoutItems', layoutItems) : null;

        await saveSetLayoutRequestsToQueue(action, currentRig, layoutItems, root);
    }

    function saveSetLayoutRequestsToQueue(action, rig, items, root, resetQueue = true){
        // console.log('items', items);
        if (resetQueue) {
            requestsQueue = [];
        }
        const urlWithRfcv = setLayoutUrl.replace("{rfcv}", rfcv);
        if (action == 'resetRig') {
            const layoutUrl = resetTemplate.replace("{rig}", rig);
            const url = urlWithRfcv.replace("{layout}", layoutUrl);
            requestsQueue.push([url, layoutUrl]);
        } else {
            items.forEach((item) => {
                const coordinates = coordinatesTemplate.replace("{xCoordinate}", item.x).replace("{yCoordinate}", item.y);
                let layoutUrl2 = layoutTemplate.replace("{step}", item.action === null ? action : item.action).replace("{rig}", rig).replace("{component}", item.item).replace("{shortComponent}", coordinates);
                let layoutUrl;
                if (item.x2 != null) {
                    const coordinatesLong = coordinatesTemplate.replace("{xCoordinate}", item.x2).replace("{yCoordinate}", item.y2);
                    layoutUrl = layoutUrl2.replace("{longComponent}", `,${coordinatesLong}`);
                } else {
                    layoutUrl = layoutUrl2.replace("{longComponent}", "");
                }
                const url = urlWithRfcv.replace("{layout}", layoutUrl);
                requestsQueue.push([url, layoutUrl]);
            });
        }
        let spamButton = document.getElementById('silmaril-rigs-layout-switcher-spam-button');
        spamButton.textContent = `Spam click ${requestsQueue.length} more times!`;
        spamButton.classList.remove('disabled');
    }

    async function sendSetLayoutRequest(url, layoutItems){
        let formData = new FormData();
        formData.append('typeID', 10);
        formData.append('crimeID', 204);
        formData.append('value1', encodeURIComponent(layoutItems));
        await fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(response => {
            if (response.ok) {
                // console.log('component change request OK');
            } else {
                console.error("[TornRigsLayoutSwitcher] Set Layout request failed:", response);
            }
        })
            .catch(error => {
            console.error("[TornRigsLayoutSwitcher] Error setting Layout:", error);
        });
    }

    function customReplacer(key, value) {
        // Omit properties with null values or specific strings
        if (value === null || value === 'add' || value === 'remove' || value === 'move') {
            return undefined;
        }
        return value;
    }

    // Function to get the value of a URL parameter by name
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to remove a URL parameter by name
    function removeUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(name);
        const searchParamsString = urlParams.toString();

        // Handle the presence of a fragment identifier
        const hash = window.location.hash;

        // Create the updated URL
        const newUrl = window.location.pathname + (searchParamsString ? '?' + searchParamsString : '') + hash;

        // Replace the current state to update the URL without triggering a page reload
        history.replaceState({}, document.title, newUrl);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();