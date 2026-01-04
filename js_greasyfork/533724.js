// ==UserScript==
// @name         AFK Dreadcast
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bouton AFK et détection de l'afk à travers les titres (check persobox)
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.dreadcast.net
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533724/AFK%20Dreadcast.user.js
// @updateURL https://update.greasyfork.org/scripts/533724/AFK%20Dreadcast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = '[Dreadcast Title Styler v0.8.8]';
    const CHECK_URL = 'https://www.dreadcast.net/Check';
    const MOVE_URL_PREFIX = '/Action/Move/';
    const PERSOBOX_URL = 'https://www.dreadcast.net/Main/FixedBox/PersoBox';
    const TARGET_TITLE = "Citoyen (très) discret";
    const NO_TITLE_NAME = "-";
    const NO_TITLE_ID = "";
    const NEW_SPRITE_URL = "https://i.imgur.com/6KhmbEZ.png";
    const TITLE_CACHE_TTL_MS = 3 * 1000;
    const ACTION_POSITIONS = {
        "repos": [0, -141], "recherche": [-25, -141], "cacher": [-50, -141],
        "scruter": [-76, -141], "soin": [-100, -141], "destruction": [-125, -141],
        "reparation": [-150, -141], "aucune": [-65, -125], "aucune2": [-65, -125]
    };
    const ACTION_CLASSES = Object.keys(ACTION_POSITIONS);
    const CHARACTER_CONTAINER_SELECTOR = 'div.personnages';
    const RESPONSE_CHARACTER_SELECTOR = 'div.icon_perso[ids]';
    const PLAYER_TITLE_SELECTOR = '#txt_titre span';
    const AFK_BUTTON_ANCHOR_SELECTOR = '#action_pos14';
    const AFK_BUTTON_TEXT = 'AFK';
    const AFK_BUTTON_FONT = '18px Arial, sans-serif';
    const AFK_BUTTON_COLOR_STATE1 = 'deepskyblue';
    const AFK_BUTTON_COLOR_STATE2 = 'red';
    const AFK_BUTTON_Z_INDEX = 100001;
    const AFK_TITLE_CHANGE_URL = 'https://www.dreadcast.net/Main/ChangeTalent';
    const TITLES_LIST_URL = 'https://www.dreadcast.net/Main/DataBox/Titles';
    const AFK_BUTTON_VERTICAL_OFFSET = 11;
    const STORAGE_CHOSEN_TITLE_NAME_KEY = 'dc_styler_chosen_title_name';
    const STORAGE_CHOSEN_TITLE_ID_KEY = 'dc_styler_chosen_title_id';
    const MODAL_ID = 'dc-styler-title-modal';
    const EDIT_BUTTON_ID = 'script-edit-chosen-title-button';
    const EDIT_BUTTON_TEXT = '📝';
    const EDIT_BUTTON_ANCHOR_SELECTOR = 'div.news';
    const EDIT_BUTTON_FONT_FAMILY = 'Arial, sans-serif';
    const EDIT_BUTTON_BASE_FONT_SIZE_PX = 16.2;
    const EDIT_BUTTON_COLOR = 'lightgray';
    const EDIT_BUTTON_HOVER_COLOR = 'white';
    const EDIT_BUTTON_HORIZONTAL_OFFSET = 275;
    const EDIT_BUTTON_Z_INDEX = 9999999999;
    const EDIT_BUTTON_ABSOLUTE_TOP_PX = 4;
    const EDIT_BUTTON_BASE_OPACITY = 0.75;
    const AFK_BUTTON_HORIZONTAL_OFFSET = -2.5;
    const INITIAL_SCAN_DELAY_MS = 500;

    const fetchedTitles = {};
    const fetchingStatus = {};
    const styledCharacterIds = new Set();
    let processedRequestIds = new Set();
    let styleObserver = null;
    let playerTitleObserver = null;
    let afkButton = null;
    let editChosenTitleButton = null;
    let currentPlayerTitle = '';
    let storedChosenTitleInfo = null;
    let titleNameToIdMap = {};
    let isTitleMapReady = false;
    let afkTitleId = null;
    let editButtonPositionFunction = null;

     GM_addStyle(`
        #${MODAL_ID} {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); display: flex;
            justify-content: center; align-items: center; z-index: 100005;
        }
        #${MODAL_ID}-content {
            background-color: #333; color: #eee; padding: 30px; border-radius: 8px;
            border: 1px solid #555; text-align: center; max-width: 90%; max-height: 90%; overflow-y: auto;
        }
        #${MODAL_ID}-content label { display: block; margin-bottom: 10px; font-size: 1.1em; }
        #${MODAL_ID}-content select {
            padding: 8px; margin-bottom: 20px; min-width: 250px; max-width: 100%;
            background-color: #444; color: #eee; border: 1px solid #666;
        }
        #${MODAL_ID}-content button {
            padding: 10px 20px; margin: 0 10px; cursor: pointer;
            border: none; border-radius: 4px; font-weight: bold;
        }
        #${MODAL_ID}-confirm { background-color: #4CAF50; color: white; }
        #${MODAL_ID}-cancel { background-color: #f44336; color: white; }
    `);

    function parseHtmlFragment(htmlString, selector) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            return doc.body.querySelectorAll(selector);
        } catch (e) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlString;
                return tempDiv.querySelectorAll(selector);
            } catch (e2) {
                return [];
            }
        }
    }

    function checkAndApplyStyle(characterId) {
        if (!characterId) return;
        const containerDiv = document.querySelector(`div.icon_perso[ids="${characterId}"]`);
        if (!containerDiv) {
            if (styledCharacterIds.has(characterId)) {
                styledCharacterIds.delete(characterId);
            }
            return;
        }

        const iconElement = containerDiv.querySelector('div.le_icon_perso');
        if (!iconElement) {
            if (styledCharacterIds.has(characterId)) { styledCharacterIds.delete(characterId); }
            return;
        }

        const cachedEntry = fetchedTitles[characterId];
        const currentTitle = cachedEntry?.title;
        const hasTargetTitle = currentTitle === TARGET_TITLE;
        const isConnected = iconElement.classList.contains('connecte');

        let shouldApplyStyle = false;
        let positionToApply = null;
        let actionFound = null;

        if (hasTargetTitle && isConnected) {
            for (const actionClass of ACTION_CLASSES) {
                if (iconElement.classList.contains(actionClass)) {
                    shouldApplyStyle = true;
                    positionToApply = ACTION_POSITIONS[actionClass];
                    actionFound = actionClass;
                    break;
                }
            }
        }

        if (shouldApplyStyle && positionToApply) {
            const targetBgImg = `url("${NEW_SPRITE_URL}")`;
            const targetBgPos = `${positionToApply[0]}px ${positionToApply[1]}px`;

            if (iconElement.style.backgroundImage !== targetBgImg || iconElement.style.backgroundPosition !== targetBgPos) {
                iconElement.style.backgroundImage = targetBgImg;
                iconElement.style.setProperty('background-position', targetBgPos, 'important');
            }
            if (!styledCharacterIds.has(characterId)) {
                styledCharacterIds.add(characterId);
            }
        } else {
            if (styledCharacterIds.has(characterId)) {
                removeOrangeIconStyle(characterId, iconElement);
            }
        }
    }

    function removeOrangeIconStyle(characterId, iconElement = null) {
        if (!characterId || !styledCharacterIds.has(characterId)) { return; }

        let needsDomQuery = false;
        if (!iconElement) {
            const containerDiv = document.querySelector(`div.icon_perso[ids="${characterId}"]`);
            if (!containerDiv) {
                styledCharacterIds.delete(characterId);
                return;
            }
            iconElement = containerDiv.querySelector('div.le_icon_perso');
            if (!iconElement) {
                styledCharacterIds.delete(characterId);
                return;
            }
            needsDomQuery = true;
        }

        let removed = false;
        if (iconElement.style.backgroundImage.includes(NEW_SPRITE_URL)) {
            iconElement.style.backgroundImage = '';
            removed = true;
        }
        if (iconElement.style.backgroundPosition !== '') {
           iconElement.style.backgroundPosition = '';
           removed = true;
        }

        styledCharacterIds.delete(characterId);
    }

    function processVisibleCharacters(idList, source) {
        const now = Date.now();
        const idsToProcess = new Set(idList);

        idsToProcess.forEach(currentId => {
            const cachedEntry = fetchedTitles[currentId];
            const isStale = !cachedEntry || (now - cachedEntry.timestamp > TITLE_CACHE_TTL_MS);

            if (cachedEntry) {
                 if (cachedEntry.title === TARGET_TITLE) {
                     checkAndApplyStyle(currentId);
                 } else if (styledCharacterIds.has(currentId)) {
                     removeOrangeIconStyle(currentId);
                 }
            }

            if (isStale || !cachedEntry) {
                 fetchPersoBoxInfo(currentId);
            }
        });

        styledCharacterIds.forEach(styledId => {
            if (!idsToProcess.has(styledId)) {
                removeOrangeIconStyle(styledId);
            }
        });
    }

    function processCheckResponse(responseText) {
        const currentVisibleIds = new Set();
        try {
            const persoElements = parseHtmlFragment(responseText, RESPONSE_CHARACTER_SELECTOR);
            if (persoElements && persoElements.length > 0) {
                persoElements.forEach(el => {
                    const id = el.getAttribute('ids');
                    if (id && id.trim() !== '') { currentVisibleIds.add(id.trim()); }
                });
            }
            processVisibleCharacters(currentVisibleIds, "Check");
        } catch (e) { }
    }

    function processMoveResponse(responseText) {
         const currentVisibleIds = new Set();
         try {
             const persoElementsInResponse = parseHtmlFragment(responseText, RESPONSE_CHARACTER_SELECTOR);
             if (persoElementsInResponse && persoElementsInResponse.length > 0) {
                 persoElementsInResponse.forEach(el => {
                     const id = el.getAttribute('ids');
                     if (id && id.trim() !== '') {
                         currentVisibleIds.add(id.trim());
                     }
                 });
             }
             processVisibleCharacters(currentVisibleIds, "Move");
         } catch (e) { }
    }

    function fetchPersoBoxInfo(characterId) {
         if (!characterId) return;
         if (fetchingStatus[characterId]) {
             return;
         }
         fetchingStatus[characterId] = true;
         GM_xmlhttpRequest({
             method: 'POST', url: PERSOBOX_URL, data: `id=${characterId}`,
             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest', 'Accept': '*/*', },
             onload: function(response) {
                 fetchingStatus[characterId] = false;
                 if (response.status === 200) {
                    processPersoBoxResponse(characterId, response.responseText);
                 } else {
                     fetchedTitles[characterId] = { title: null, timestamp: Date.now() };
                     checkAndApplyStyle(characterId);
                 }
             },
             onerror: function(response) {
                fetchingStatus[characterId] = false;
                fetchedTitles[characterId] = { title: null, timestamp: Date.now() };
                checkAndApplyStyle(characterId);
             },
             ontimeout: function(response) {
                fetchingStatus[characterId] = false;
                fetchedTitles[characterId] = { title: null, timestamp: Date.now() };
                checkAndApplyStyle(characterId);
             }
         });
    }

    function processPersoBoxResponse(characterId, responseText) {
        let foundTitle = null;
        try {
            const titleElements = parseHtmlFragment(responseText, '.hbinfo');
            if (titleElements && titleElements.length > 0) {
                 for (let i = 0; i < titleElements.length; i++) {
                     const text = titleElements[i].textContent.trim();
                     if (text) {
                         foundTitle = text;
                         break;
                     }
                 }
                 if (!foundTitle && titleElements.length > 0) {
                    foundTitle = NO_TITLE_NAME;
                 }
            } else {
                 foundTitle = NO_TITLE_NAME;
            }

            fetchedTitles[characterId] = { title: foundTitle, timestamp: Date.now() };
            checkAndApplyStyle(characterId);
        }
        catch (e) {
            fetchedTitles[characterId] = { title: null, timestamp: Date.now() };
            checkAndApplyStyle(characterId);
        }
    }

    function storeChosenTitle(name, id) {
        if (name && name !== TARGET_TITLE && id !== null && id !== undefined) {
            try {
                localStorage.setItem(STORAGE_CHOSEN_TITLE_NAME_KEY, name);
                localStorage.setItem(STORAGE_CHOSEN_TITLE_ID_KEY, id);
                storedChosenTitleInfo = { name: name, id: id };
            } catch (e) {
                alert("Error saving chosen title. LocalStorage might be disabled or full.");
            }
        } else if (name === NO_TITLE_NAME && id === NO_TITLE_ID) {
             try {
                localStorage.setItem(STORAGE_CHOSEN_TITLE_NAME_KEY, name);
                localStorage.setItem(STORAGE_CHOSEN_TITLE_ID_KEY, id);
                storedChosenTitleInfo = { name: name, id: id };
            } catch (e) {
                alert("Error saving chosen title. LocalStorage might be disabled or full.");
            }
        }
    }

    function getStoredChosenTitle() {
        let name = null;
        let id = null;
        let isValid = false;
        let loadedInfo = null;

        try {
            name = localStorage.getItem(STORAGE_CHOSEN_TITLE_NAME_KEY);
            id = localStorage.getItem(STORAGE_CHOSEN_TITLE_ID_KEY);

            if (name === null || id === null) {
                isValid = false;
            } else if (name === TARGET_TITLE) {
                isValid = false;
            } else if (name === NO_TITLE_NAME && id === NO_TITLE_ID) {
                isValid = true;
                loadedInfo = { name: NO_TITLE_NAME, id: NO_TITLE_ID };
            } else {
                if (isTitleMapReady) {
                    if (titleNameToIdMap[name] === id) {
                        isValid = true;
                        loadedInfo = { name: name, id: id };
                    } else {
                         isValid = false;
                    }
                } else {
                    isValid = true;
                    loadedInfo = { name: name, id: id };
                }
            }

            if (!isValid && (localStorage.getItem(STORAGE_CHOSEN_TITLE_NAME_KEY) || localStorage.getItem(STORAGE_CHOSEN_TITLE_ID_KEY))) {
                 localStorage.removeItem(STORAGE_CHOSEN_TITLE_NAME_KEY);
                 localStorage.removeItem(STORAGE_CHOSEN_TITLE_ID_KEY);
            }

            storedChosenTitleInfo = isValid ? loadedInfo : null;
            return storedChosenTitleInfo;

        } catch (e) {
            storedChosenTitleInfo = null;
            return null;
        }
    }

     function fetchTitleListAndBuildMap() {
        GM_xmlhttpRequest({
            method: 'GET', url: TITLES_LIST_URL,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const titleElements = doc.querySelectorAll('li.link');
                        let count = 0;
                        titleNameToIdMap = {};
                        afkTitleId = null;

                        titleElements.forEach(li => {
                            const onClickAttr = li.getAttribute('onClick');
                            const titleName = li.textContent.trim();
                            const idMatch = onClickAttr ? onClickAttr.match(/id_titre\s*:\s*['"]?(\d+)['"]?/) : null;
                            const titleId = idMatch ? idMatch[1] : null;

                            if (!titleName || !titleId) {
                                return;
                            }

                            if (titleName === TARGET_TITLE) {
                                afkTitleId = titleId;
                            } else if (titleName !== NO_TITLE_NAME) {
                                titleNameToIdMap[titleName] = titleId;
                                count++;
                            }
                        });

                        if (count > 0 || afkTitleId) {
                            isTitleMapReady = true;
                            if (!afkTitleId) {
                                alert(`Error: The AFK title "${TARGET_TITLE}" could not be found. The AFK button might not work correctly.`);
                            }
                            getStoredChosenTitle();
                            readActualTitleAndUpdateButton();
                            checkAndStoreInitialChosenTitle();
                        } else {
                            isTitleMapReady = false;
                        }
                    } catch (e) {
                        isTitleMapReady = false;
                    }
                } else {
                    isTitleMapReady = false;
                }
            },
            onerror: function(response) {
                isTitleMapReady = false;
            },
            ontimeout: function() {
                isTitleMapReady = false;
            }
        });
    }

    function readActualTitleAndUpdateButton() {
         const titleElement = document.querySelector(PLAYER_TITLE_SELECTOR);
         if (!titleElement) {
             return;
         }
         const currentActualTitleText = titleElement.textContent.trim();

         if (currentPlayerTitle !== currentActualTitleText) {
              currentPlayerTitle = currentActualTitleText;
         }

         if (afkButton) {
             updateAfkButtonVisuals();
         }
    }

    function checkAndStoreInitialChosenTitle() {
        const titleElement = document.querySelector(PLAYER_TITLE_SELECTOR);
        const currentActualTitle = titleElement ? titleElement.textContent.trim() : null;

        if (!isTitleMapReady || !currentActualTitle) {
             return;
        }

        if (currentActualTitle === TARGET_TITLE) {
             return;
        }

        getStoredChosenTitle();

        if (storedChosenTitleInfo) {
             if (currentActualTitle !== storedChosenTitleInfo.name) {
                 const currentIsNoTitle = (currentActualTitle === NO_TITLE_NAME);
                 const currentTitleId = titleNameToIdMap[currentActualTitle];

                 if (currentIsNoTitle) {
                     storeChosenTitle(NO_TITLE_NAME, NO_TITLE_ID);
                 } else if (currentTitleId) {
                     storeChosenTitle(currentActualTitle, currentTitleId);
                 }
             }
             return;
        }

        const currentIsNoTitle = (currentActualTitle === NO_TITLE_NAME);
        const currentTitleId = titleNameToIdMap[currentActualTitle];

        if (currentIsNoTitle) {
            storeChosenTitle(NO_TITLE_NAME, NO_TITLE_ID);
        } else if (currentTitleId) {
            storeChosenTitle(currentActualTitle, currentTitleId);
        }
    }

     function changeTitleRequest(titleId, targetTitleName = "Unknown") {
        if (titleId === null || titleId === undefined || (typeof titleId !== 'string' && typeof titleId !== 'number')) {
             alert("Cannot change title: Invalid title ID.");
             return;
        }

        const postData = (titleId === NO_TITLE_ID || titleId === '') ? 'id_titre=' : `id_titre=${encodeURIComponent(titleId)}`;

        if(afkButton) { afkButton.style.opacity = '0.5'; afkButton.style.pointerEvents = 'none'; }
        if(editChosenTitleButton) { editChosenTitleButton.style.opacity = '0.5'; editChosenTitleButton.style.pointerEvents = 'none'; }

        GM_xmlhttpRequest({
            method: 'POST', url: AFK_TITLE_CHANGE_URL, data: postData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
            },
            onload: function(response) {
                 if(afkButton) { afkButton.style.opacity = '1'; afkButton.style.pointerEvents = 'auto'; }
                 if(editChosenTitleButton) { editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY; editChosenTitleButton.style.pointerEvents = 'auto'; }

                 if (response.status >= 200 && response.status < 300) {
                     currentPlayerTitle = targetTitleName;
                     updateAfkButtonVisuals();
                 } else {
                     alert(`Failed to change title to "${targetTitleName}". Server response: ${response.status}`);
                 }
            },
            onerror: function(response) {
                 if(afkButton) { afkButton.style.opacity = '1'; afkButton.style.pointerEvents = 'auto'; }
                 if(editChosenTitleButton) { editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY; editChosenTitleButton.style.pointerEvents = 'auto'; }
                 alert(`Network error changing title to "${targetTitleName}".`);
            },
            ontimeout: function() {
                 if(afkButton) { afkButton.style.opacity = '1'; afkButton.style.pointerEvents = 'auto'; }
                 if(editChosenTitleButton) { editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY; editChosenTitleButton.style.pointerEvents = 'auto'; }
                 alert(`Timeout changing title to "${targetTitleName}".`);
            }
        });
    }

    function updateAfkButtonVisuals() {
        if (!afkButton) return;
        const isCurrentlyAfk = (currentPlayerTitle === TARGET_TITLE);
        const targetColor = isCurrentlyAfk ? AFK_BUTTON_COLOR_STATE2 : AFK_BUTTON_COLOR_STATE1;

        if (afkButton.style.color !== targetColor) {
            afkButton.style.color = targetColor;
        }
    }

    function promptForChosenTitle(context = 'afk_button') {
        if (!isTitleMapReady) {
            alert("Title list not loaded yet. Please wait and try again."); return;
        }
        if (document.getElementById(MODAL_ID)) {
            return;
        }

        if(afkButton) { afkButton.style.opacity = '0.5'; afkButton.style.pointerEvents = 'none'; }
        if(editChosenTitleButton) { editChosenTitleButton.style.opacity = '0.5'; editChosenTitleButton.style.pointerEvents = 'none'; }

        const modal = document.createElement('div'); modal.id = MODAL_ID;
        const modalContent = document.createElement('div'); modalContent.id = `${MODAL_ID}-content`;

        const label = document.createElement('label'); label.setAttribute('for', `${MODAL_ID}-select`);
        label.textContent = 'Choisissez votre titre (non-afk):';
        modalContent.appendChild(label);

        const select = document.createElement('select'); select.id = `${MODAL_ID}-select`;

        const noTitleOption = document.createElement('option');
        noTitleOption.value = NO_TITLE_ID;
        noTitleOption.textContent = NO_TITLE_NAME;
        select.appendChild(noTitleOption);

        let preSelectedValue = null;
        const currentStored = getStoredChosenTitle();

        if (currentStored) {
            preSelectedValue = currentStored.id;
        } else {
             const titleElement = document.querySelector(PLAYER_TITLE_SELECTOR);
             const currentActualTitle = titleElement ? titleElement.textContent.trim() : '';
             if (currentActualTitle && currentActualTitle !== TARGET_TITLE) {
                 if (currentActualTitle === NO_TITLE_NAME) {
                     preSelectedValue = NO_TITLE_ID;
                 } else {
                     preSelectedValue = titleNameToIdMap[currentActualTitle];
                 }
             } else {
                 preSelectedValue = NO_TITLE_ID;
             }
        }
        if (preSelectedValue === NO_TITLE_ID) {
            noTitleOption.selected = true;
        }

        const sortedTitleNames = Object.keys(titleNameToIdMap).sort((a, b) => a.localeCompare(b));
        for (const titleName of sortedTitleNames) {
            const titleId = titleNameToIdMap[titleName];
            const option = document.createElement('option');
            option.value = titleId;
            option.textContent = titleName;
            if (titleId === preSelectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        }
        modalContent.appendChild(select);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';

        const confirmButton = document.createElement('button');
        confirmButton.id = `${MODAL_ID}-confirm`; confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            const selectedOption = select.options[select.selectedIndex];
            const selectedTitleId = selectedOption.value;
            const selectedTitleName = selectedOption.textContent;

            modal.remove();
            if(afkButton) { afkButton.style.opacity = '1'; afkButton.style.pointerEvents = 'auto'; }
            if(editChosenTitleButton) { editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY; editChosenTitleButton.style.pointerEvents = 'auto'; }

            storeChosenTitle(selectedTitleName, selectedTitleId);
            getStoredChosenTitle();

            if (context === 'edit_button') {
                alert(`Stored chosen title updated to: "${selectedTitleName}"`);
            } else {
                 const wasVisuallyAfk = (afkButton && afkButton.style.color === AFK_BUTTON_COLOR_STATE2);

                 if (wasVisuallyAfk) {
                      changeTitleRequest(selectedTitleId, selectedTitleName);
                 } else {
                      if (afkTitleId) {
                          changeTitleRequest(afkTitleId, TARGET_TITLE);
                      } else {
                          alert("Error: Cannot switch to AFK title because its ID is unknown. Applying the title you just selected instead.");
                          changeTitleRequest(selectedTitleId, selectedTitleName);
                      }
                 }
            }
        };
        buttonContainer.appendChild(confirmButton);

        const cancelButton = document.createElement('button');
        cancelButton.id = `${MODAL_ID}-cancel`; cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            modal.remove();
            if(afkButton) { afkButton.style.opacity = '1'; afkButton.style.pointerEvents = 'auto'; }
            if(editChosenTitleButton) { editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY; editChosenTitleButton.style.pointerEvents = 'auto'; }
        };
        buttonContainer.appendChild(cancelButton);

        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

     function handleAfkButtonClick(event) {
        if(event) event.preventDefault();

        if (!afkButton) return;
        if (!isTitleMapReady || !afkTitleId) {
             alert("Cannot toggle AFK: Required data is missing or still loading. Please wait a moment and try again.");
             return;
        }

        const currentButtonColor = afkButton.style.color;
        const isVisuallyAfk = (currentButtonColor === AFK_BUTTON_COLOR_STATE2);

        getStoredChosenTitle();

        if (isVisuallyAfk) {
            if (storedChosenTitleInfo) {
                 changeTitleRequest(storedChosenTitleInfo.id, storedChosenTitleInfo.name);
            } else {
                 promptForChosenTitle('afk_button');
            }
        } else {
            if (storedChosenTitleInfo) {
                 changeTitleRequest(afkTitleId, TARGET_TITLE);
            } else {
                 const titleElement = document.querySelector(PLAYER_TITLE_SELECTOR);
                 const currentActualTitle = titleElement ? titleElement.textContent.trim() : null;

                 if (currentActualTitle && currentActualTitle !== TARGET_TITLE) {
                     const currentIsNoTitle = (currentActualTitle === NO_TITLE_NAME);
                     const currentTitleId = titleNameToIdMap[currentActualTitle];

                     if (currentIsNoTitle) {
                          storeChosenTitle(NO_TITLE_NAME, NO_TITLE_ID);
                          getStoredChosenTitle();
                          changeTitleRequest(afkTitleId, TARGET_TITLE);
                     } else if (currentTitleId) {
                          storeChosenTitle(currentActualTitle, currentTitleId);
                          getStoredChosenTitle();
                          changeTitleRequest(afkTitleId, TARGET_TITLE);
                     } else {
                          promptForChosenTitle('afk_button');
                     }
                 } else {
                      promptForChosenTitle('afk_button');
                 }
            }
        }
    }

     function createAndPlaceAfkButton() {
        if (document.getElementById('script-afk-button')) {
             return afkButton;
        }
        const anchorElement = document.querySelector(AFK_BUTTON_ANCHOR_SELECTOR);
        if (!anchorElement) {
             return null;
        }

        afkButton = document.createElement('div');
        afkButton.id = 'script-afk-button';
        afkButton.textContent = AFK_BUTTON_TEXT;
        afkButton.style.zIndex = AFK_BUTTON_Z_INDEX;
        afkButton.style.background = 'none';
        afkButton.style.border = 'none';
        afkButton.style.padding = '0 5px';
        afkButton.style.font = AFK_BUTTON_FONT;
        afkButton.style.fontWeight = 'bold';
        afkButton.style.cursor = 'pointer';
        afkButton.style.userSelect = 'none';
        afkButton.style.position = 'fixed';
        afkButton.style.color = AFK_BUTTON_COLOR_STATE1;
        afkButton.style.display = 'none';

        function positionButton() {
             if (!afkButton || !anchorElement) return;
            const anchorRect = anchorElement.getBoundingClientRect();
            if (anchorRect.width > 0 || anchorRect.height > 0 || anchorRect.top > 0 || anchorRect.left > 0) {
                const buttonTop = anchorRect.top + window.scrollY + AFK_BUTTON_VERTICAL_OFFSET;
                const buttonLeft = anchorRect.left + window.scrollX + AFK_BUTTON_HORIZONTAL_OFFSET;
                afkButton.style.top = `${buttonTop}px`;
                afkButton.style.left = `${buttonLeft}px`;
                if (afkButton.style.display === 'none') {
                    afkButton.style.display = 'block';
                }
            } else {
                 if (afkButton.style.display !== 'none') {
                    afkButton.style.display = 'none';
                 }
            }
        }

        positionButton();
        afkButton.addEventListener('click', handleAfkButtonClick);
        document.body.appendChild(afkButton);

        readActualTitleAndUpdateButton();

        return afkButton;
    }

    function tryCreateButton() {
        let buttonRetryCount = 0; const maxButtonRetries = 10;
        function retry() {
            const anchor = document.querySelector(AFK_BUTTON_ANCHOR_SELECTOR);
            const existingButton = document.getElementById('script-afk-button');

            if (anchor && !existingButton) {
                createAndPlaceAfkButton();
                if (!document.getElementById('script-afk-button') && buttonRetryCount < maxButtonRetries) {
                     buttonRetryCount++;
                     setTimeout(retry, 1000 + (buttonRetryCount * 100));
                }
            } else if (!anchor && buttonRetryCount < maxButtonRetries) {
                buttonRetryCount++;
                setTimeout(retry, 1000 + (buttonRetryCount * 100));
            } else if (existingButton && afkButton) {
                const anchorRect = anchor ? anchor.getBoundingClientRect() : {width:0, height:0, top:0, left:0};
                 if (anchorRect.width > 0 || anchorRect.height > 0 || anchorRect.top > 0 || anchorRect.left > 0) {
                      const buttonTop = anchorRect.top + window.scrollY + AFK_BUTTON_VERTICAL_OFFSET;
                      const buttonLeft = anchorRect.left + window.scrollX + AFK_BUTTON_HORIZONTAL_OFFSET;
                      afkButton.style.top = `${buttonTop}px`;
                      afkButton.style.left = `${buttonLeft}px`;
                      afkButton.style.display = 'block';
                 } else {
                      afkButton.style.display = 'none';
                 }
                 readActualTitleAndUpdateButton();
            }
        }
        retry();
    }

    function createAndPlaceEditButton() {
        if (document.getElementById(EDIT_BUTTON_ID)) {
            return editChosenTitleButton;
        }
        const anchorElement = document.querySelector(EDIT_BUTTON_ANCHOR_SELECTOR);
        if (!anchorElement) {
            return null;
        }

        editChosenTitleButton = document.createElement('div');
        editChosenTitleButton.id = EDIT_BUTTON_ID;
        editChosenTitleButton.textContent = EDIT_BUTTON_TEXT;
        editChosenTitleButton.title = 'Edit Stored Chosen Title';
        editChosenTitleButton.style.zIndex = EDIT_BUTTON_Z_INDEX;
        editChosenTitleButton.style.background = 'none';
        editChosenTitleButton.style.border = 'none';
        editChosenTitleButton.style.padding = '0 5px';
        editChosenTitleButton.style.fontFamily = EDIT_BUTTON_FONT_FAMILY;
        editChosenTitleButton.style.fontSize = `${EDIT_BUTTON_BASE_FONT_SIZE_PX}px`;
        editChosenTitleButton.style.cursor = 'pointer';
        editChosenTitleButton.style.userSelect = 'none';
        editChosenTitleButton.style.position = 'fixed';
        editChosenTitleButton.style.color = EDIT_BUTTON_COLOR;
        editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY;
        editChosenTitleButton.style.transition = 'color 0.2s, opacity 0.2s';
        editChosenTitleButton.style.display = 'none';

        editButtonPositionFunction = function() {
            if (!editChosenTitleButton || !anchorElement) return;
            const anchorRect = anchorElement.getBoundingClientRect();

            if (anchorRect.width > 0 || anchorRect.height > 0 || anchorRect.top > 0 || anchorRect.left > 0) {
                editChosenTitleButton.style.top = `${EDIT_BUTTON_ABSOLUTE_TOP_PX}px`;
                const buttonLeft = anchorRect.left + window.scrollX + EDIT_BUTTON_HORIZONTAL_OFFSET;
                editChosenTitleButton.style.left = `${buttonLeft}px`;
                if (editChosenTitleButton.style.display !== 'block') {
                     editChosenTitleButton.style.display = 'block';
                }
            } else {
                if (editChosenTitleButton.style.display !== 'none') {
                    editChosenTitleButton.style.display = 'none';
                }
            }
        };

        editButtonPositionFunction();

        editChosenTitleButton.addEventListener('mouseover', () => {
            if (editChosenTitleButton.style.pointerEvents !== 'none') {
                editChosenTitleButton.style.color = EDIT_BUTTON_HOVER_COLOR;
                editChosenTitleButton.style.opacity = '1';
            }
        });
        editChosenTitleButton.addEventListener('mouseout', () => {
             if (editChosenTitleButton.style.pointerEvents !== 'none') {
                editChosenTitleButton.style.color = EDIT_BUTTON_COLOR;
                editChosenTitleButton.style.opacity = EDIT_BUTTON_BASE_OPACITY;
             }
        });
        editChosenTitleButton.addEventListener('click', (event) => {
             if(event) event.preventDefault();
             if (!isTitleMapReady) {
                 alert("Title list hasn't loaded yet. Please wait and try again.");
                 return;
             }
             promptForChosenTitle('edit_button');
        });

        document.body.appendChild(editChosenTitleButton);
        return editChosenTitleButton;
    }

     function tryCreateEditButton() {
        let buttonRetryCount = 0; const maxButtonRetries = 10;
        function retry() {
            const anchor = document.querySelector(EDIT_BUTTON_ANCHOR_SELECTOR);
            const existingButton = document.getElementById(EDIT_BUTTON_ID);

            if (anchor && !existingButton) {
                createAndPlaceEditButton();
                 if (!document.getElementById(EDIT_BUTTON_ID) && buttonRetryCount < maxButtonRetries) {
                     buttonRetryCount++;
                     setTimeout(retry, 1100 + (buttonRetryCount * 100));
                 }
            } else if (!anchor && buttonRetryCount < maxButtonRetries) {
                buttonRetryCount++;
                setTimeout(retry, 1100 + (buttonRetryCount * 100));
            } else if (existingButton && editButtonPositionFunction) {
                 editButtonPositionFunction();
            }
        }
        retry();
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._hookedMethod = method;
        try {
            this._hookedUrl = (typeof url === 'string') ? url : (url instanceof URL ? url.toString() : null);
        } catch (e) {
             this._hookedUrl = null;
        }
        this._requestId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        this._scriptProcessedLoad = false;
        this._scriptProcessedError = false;
        this._listenersAttached = false;

        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        const method = this._hookedMethod?.toUpperCase();
        const url = this._hookedUrl;
        const requestId = this._requestId;

        if (!method || !url || !requestId) {
            return originalSend.apply(this, arguments);
        }

        const isCheck = method === 'POST' && url === CHECK_URL;
        const isMove = method === 'GET' && typeof url === 'string' && (url.startsWith(MOVE_URL_PREFIX) || url.includes(MOVE_URL_PREFIX));

        if ((isCheck || isMove) && !processedRequestIds.has(requestId)) {
            processedRequestIds.add(requestId);

            const handleLoad = (event) => {
                const xhr = event.target;
                if (xhr.readyState === 4 && !xhr._scriptProcessedLoad) {
                    xhr._scriptProcessedLoad = true;
                    if (xhr.status === 200 && xhr.responseText) {
                        try {
                            if (xhr._hookedUrl === CHECK_URL) {
                                processCheckResponse(xhr.responseText);
                            } else if (typeof xhr._hookedUrl === 'string' && (xhr._hookedUrl.startsWith(MOVE_URL_PREFIX) || xhr._hookedUrl.includes(MOVE_URL_PREFIX))) {
                                processMoveResponse(xhr.responseText);
                            }
                        } catch (e) { }
                    }
                    setTimeout(() => {
                        processedRequestIds.delete(xhr._requestId);
                    }, 100);
                }
            };

            const handleError = (event) => {
                const xhr = event.target;
                if (!xhr._scriptProcessedError) {
                    xhr._scriptProcessedError = true;
                     setTimeout(() => {
                        processedRequestIds.delete(xhr._requestId);
                    }, 50);
                }
            };

            const handleTimeout = (event) => {
                const xhr = event.target;
                 if (!xhr._scriptProcessedError) {
                    xhr._scriptProcessedError = true;
                     setTimeout(() => {
                        processedRequestIds.delete(xhr._requestId);
                    }, 50);
                }
            };

            if (!this._listenersAttached) {
                 this.addEventListener('load', handleLoad);
                 this.addEventListener('error', handleError);
                 this.addEventListener('timeout', handleTimeout);
                 this._listenersAttached = true;
            }
        }

        return originalSend.apply(this, arguments);
    };

    function handleStylingMutations(mutationsList, observer) {
        let processedIdsInBatch = new Set();

        for (const mutation of mutationsList) {
            let targetElement = mutation.target;
            let persoDiv = null;

            if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                 persoDiv = targetElement.matches('div.icon_perso[ids]')
                               ? targetElement
                               : targetElement.closest('div.icon_perso[ids]');
            } else if (mutation.type === 'childList') {
                 const checkNodes = (nodes) => {
                    let foundPersoDiv = null;
                    for (const node of nodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches(RESPONSE_CHARACTER_SELECTOR)) {
                                foundPersoDiv = node;
                                break;
                            }
                            if (!foundPersoDiv && node.querySelector) {
                                foundPersoDiv = node.querySelector(RESPONSE_CHARACTER_SELECTOR);
                                if (foundPersoDiv) break;
                            }
                        }
                    }
                    return foundPersoDiv;
                 };
                 persoDiv = checkNodes(mutation.addedNodes);
                 if (!persoDiv) {
                    const removedPerso = checkNodes(mutation.removedNodes);
                    if (removedPerso) {
                        const charId = removedPerso.getAttribute('ids');
                        if (charId && styledCharacterIds.has(charId)) {
                             styledCharacterIds.delete(charId);
                        }
                    }
                 }
            }

            if (persoDiv) {
                const charId = persoDiv.getAttribute('ids');
                if (charId && !processedIdsInBatch.has(charId)) {
                    checkAndApplyStyle(charId);
                    processedIdsInBatch.add(charId);
                }
            }
        }
    }


    function handlePlayerTitleMutations(mutationsList, observer) {
        let titleSpanChanged = false;
        const titleSpan = document.querySelector(PLAYER_TITLE_SELECTOR);
        const titleContainer = document.querySelector('#txt_titre');

        for (const mutation of mutationsList) {
            if (titleSpan && (mutation.target === titleSpan || titleSpan.contains(mutation.target)) && mutation.type === 'characterData') {
                titleSpanChanged = true; break;
            }
            if (titleSpan && mutation.target === titleSpan && mutation.type === 'childList') {
                 titleSpanChanged = true; break;
            }
             if (titleContainer && mutation.target === titleContainer && mutation.type === 'childList') {
                 const checkNodes = (nodes) => {
                     for (const node of nodes) {
                         if (node === titleSpan || (node.nodeType === Node.ELEMENT_NODE && node.contains(titleSpan))) return true;
                         if (node.nodeType === Node.ELEMENT_NODE && node.matches && node.matches(PLAYER_TITLE_SELECTOR)) return true;
                     }
                     return false;
                 };
                 if (checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes)) {
                     titleSpanChanged = true; break;
                 }
             }
        }

        if (titleSpanChanged) {
             readActualTitleAndUpdateButton();
             checkAndStoreInitialChosenTitle();
        }
    }

    function startStylingObserver() {
        const targetNode = document.querySelector(CHARACTER_CONTAINER_SELECTOR);
        if (!targetNode) {
            setTimeout(startStylingObserver, 2000);
            return;
        }
        if (styleObserver) {
            styleObserver.disconnect();
        }
        const config = {
             attributes: true,
             attributeFilter: ['class', 'style'],
             childList: true,
             subtree: true
        };
        styleObserver = new MutationObserver(handleStylingMutations);
        styleObserver.observe(targetNode, config);
    }

    function startPlayerTitleObserver() {
        const targetNode = document.querySelector('#txt_titre') || document.body;

        if (!targetNode || (targetNode === document.body && !document.querySelector(PLAYER_TITLE_SELECTOR))) {
             setTimeout(startPlayerTitleObserver, 2000);
             return;
        }

        if (playerTitleObserver) {
            playerTitleObserver.disconnect();
        }
        const config = {
            childList: true,
            subtree: true,
            characterData: true
        };
        playerTitleObserver = new MutationObserver(handlePlayerTitleMutations);
        playerTitleObserver.observe(targetNode, config);

        readActualTitleAndUpdateButton();
    }

    function performInitialCharacterScan() {
        const characterContainer = document.querySelector(CHARACTER_CONTAINER_SELECTOR);
        if (!characterContainer) {
            return;
        }

        const visibleCharacterElements = characterContainer.querySelectorAll(RESPONSE_CHARACTER_SELECTOR);
        const initialVisibleIds = new Set();
        if (visibleCharacterElements && visibleCharacterElements.length > 0) {
            visibleCharacterElements.forEach(el => {
                const id = el.getAttribute('ids');
                if (id && id.trim() !== '') {
                    initialVisibleIds.add(id.trim());
                }
            });
        }

        if (initialVisibleIds.size > 0) {
            processVisibleCharacters(initialVisibleIds, "InitialScan");
        }
    }

    getStoredChosenTitle();
    fetchTitleListAndBuildMap();
    setTimeout(performInitialCharacterScan, INITIAL_SCAN_DELAY_MS);
    setTimeout(startStylingObserver, 700);
    setTimeout(startPlayerTitleObserver, 800);
    setTimeout(tryCreateButton, 900);
    setTimeout(tryCreateEditButton, 950);

    let resizeScrollTimeout;
    const handleResizeScroll = () => {
         clearTimeout(resizeScrollTimeout);
         resizeScrollTimeout = setTimeout(() => {
             if (afkButton && document.getElementById('script-afk-button')) {
                 const anchor = document.querySelector(AFK_BUTTON_ANCHOR_SELECTOR);
                 if (anchor) {
                     const anchorRect = anchor.getBoundingClientRect();
                     if (anchorRect.width > 0 || anchorRect.height > 0 || anchorRect.top > 0 || anchorRect.left > 0) {
                         const buttonTop = anchorRect.top + window.scrollY + AFK_BUTTON_VERTICAL_OFFSET;
                         const buttonLeft = anchorRect.left + window.scrollX + AFK_BUTTON_HORIZONTAL_OFFSET;
                         afkButton.style.top = `${buttonTop}px`;
                         afkButton.style.left = `${buttonLeft}px`;
                         afkButton.style.display = 'block';
                     } else {
                         afkButton.style.display = 'none';
                     }
                 } else {
                      afkButton.style.display = 'none';
                 }
             }
             if (editButtonPositionFunction && editChosenTitleButton && document.getElementById(EDIT_BUTTON_ID)) {
                 editButtonPositionFunction();
             }
         }, 150);
    };

    window.addEventListener('resize', handleResizeScroll);
    window.addEventListener('scroll', handleResizeScroll);

})();