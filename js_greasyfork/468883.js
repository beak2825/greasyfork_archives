// ==UserScript==
// @name         Pavlov mod.io maps integration with pavlovrcon.com
// @namespace    https://greasyfork.org/en/users/1103172-underpl
// @version      3.0
// @description  Add extra buttons to mod.io pavlov map pages to allow switching to the map or adding it to the rotation of a server by using pavlovrcon.com
// @author       UnderPL
// @license      CC BY-NC 4.0
// @require      https://greasyfork.org/scripts/426194-toast-js/code/toastjs.js?version=971661
// @match        https://mod.io/g/pavlov
// @match        https://mod.io/g/pavlov/m/*
// @match        https://mod.io/g/pavlov?_sort=*
// @match        https://mod.io/g/pavlov?tags-in=*
// @match        https://mod.io/g/pavlov?platforms*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/468883/Pavlov%20modio%20maps%20integration%20with%20pavlovrconcom.user.js
// @updateURL https://update.greasyfork.org/scripts/468883/Pavlov%20modio%20maps%20integration%20with%20pavlovrconcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentPage = window.location.href;

    var defaultGameMode = "INFECTION";
    var storedGameMode = GM_getValue("storedGameMode", defaultGameMode);

    var defaultServerId = "0";
    var storedServerId = GM_getValue("storedServerId", defaultServerId);

    var mapList = {};
    var storedMapList = GM_getValue("storedMapList", mapList);

    const mapsPageRegex = new RegExp("^https:\/\/mod\.io\/g\/pavlov(?:$|\\?tags-in=|\\?_sort=|\\?platforms)");

    //To use with an HTTP server/proxy that can forward the request to the server
    var httpProxy = false;
    var httpProxyIp = "192.168.0.150"
    var httpProxyPort = "3000"

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json"
    }

    var retrievedMapList = false;

    function retrieveMapList() {
        GM_xmlhttpRequest({
            method: "GET",
            url: httpProxy ? `http://${httpProxyIp}:${httpProxyPort}/rcon?command=maps` : `https://pavlovrcon.com/api/maplist/${storedServerId}`,
            headers: headers,
            onload: function(response) {
                if (response.status >= 200 && response.status < 400) {
                    var data = httpProxy ? JSON.parse(response.responseText) : response.responseText;
                    var mapListData = httpProxy ? data.MapList : JSON.parse(data);

                    mapListData.forEach(function(item) {
                        let mapId = httpProxy ? item.MapId : item.id;
                        let gameMode = httpProxy ? item.GameMode : item.game_mode;

                        if (mapId.startsWith("UGC")) {
                            mapId = mapId.substring(3);
                            if(!mapList[mapId]) {
                                mapList[mapId] = [];
                            }
                            mapList[mapId].push(gameMode);
                        }
                    });
                    retrievedMapList = true;
                } else {
                    console.log("Command failed with status: " + response.status);
                }
            },
            onerror: function() {
                console.log("Request failed");
            }
        });
    }

    function createButton(id, color, text, targetButton) {
        var newButton = targetButton.cloneNode(true);
        newButton.id = id;
        newButton.querySelector('span div span').textContent = text;
        newButton.style.cssText = 'border-color: ' + color + ';margin-bottom: 10px;--primary-hover:' + color;

        newButton.addEventListener('mouseover', function() {
            newButton.querySelector('span div span').style.color = color;
        });
        newButton.addEventListener('mouseout', function() {
            newButton.querySelector('span div span').style.color = 'inherit';
        });
        return newButton;
    };

    function confirmAction(mapName, mapId, selectedGameMode, action) {
        var confirmationMessage = `Are you sure you want to ${action === 'addmaprotation' ? 'add' : 'remove'} "${mapName}" ${action === 'addmaprotation' ? 'to' : 'from'} the map rotation?\n
        MapRotation=(MapId="${mapId}",GameMode="${selectedGameMode}")`;
        return window.confirm(confirmationMessage);
    }

    function createSelectsAndLabels() {
        var container = document.createElement('div');
        container.style.cssText = 'justify-content:center;' + (currentPage.startsWith('https://mod.io/g/pavlov/m/') ? 'display:flex;' : "");

        var serverIdDiv = document.createElement('div');
        var serverIdLabel = document.createElement('label');
        serverIdLabel.innerHTML = 'SERVER ID:';
        serverIdLabel.style.cssText = 'font-size: 150%; margin: 0px 10px;';
        serverIdDiv.appendChild(serverIdLabel);

        var serverIdSelect = document.createElement('select');
        serverIdSelect.id = "serverIds";
        serverIdSelect.classList.add("form-select");
        serverIdSelect.style.cssText = "color: black; font-size: 155%; padding-left: 5px; text-align: center; display: inline-block; margin: 0 auto;";
        serverIdDiv.appendChild(serverIdSelect);

        serverIdSelect.innerHTML = Array.from({length: 10}, (_, i) => i)
        .map(id => `<option value="${id}" ${storedServerId == id ? 'selected' : ''}>${id}</option>`).join('');

        serverIdSelect.addEventListener('change', function() {
            GM_setValue("storedServerId", serverIdSelect.value);
        });

        var gameModeDiv = document.createElement('div');
        var gameModeLabel = document.createElement('label');
        gameModeLabel.innerHTML = 'MODE:';
        gameModeLabel.style.cssText = 'font-size: 150%; margin: 0px 10px;';
        gameModeDiv.appendChild(gameModeLabel);

        var gameModeSelect = document.createElement('select');
        gameModeSelect.id = "gameModes";
        gameModeSelect.classList.add("form-select");
        gameModeSelect.style.cssText = "color: black; font-size: 155%; padding-left: 5px; text-align: center; display: inline-block; margin: 0 auto;";
        gameModeDiv.appendChild(gameModeSelect);

        gameModeSelect.innerHTML = ['SND', 'TDM', 'DM', 'GUN', 'ZWV', 'WW2GUN', 'TANKTDM', 'KOTH', 'TTT', 'OITC', 'INFECTION', 'HIDE', 'PUSH', 'PH', 'CUSTOM']
        .map(mode => `<option value="${mode}" ${storedGameMode === mode ? 'selected' : ''}>${mode}</option>`).join('');

        gameModeSelect.addEventListener('change', function() {
            storedGameMode = gameModeSelect.value;
            GM_setValue("storedGameMode", storedGameMode);
        });

        container.appendChild(serverIdDiv);
        container.appendChild(gameModeDiv);

        return container;
    };

    function mapAction(mapId, selectedGameMode, action, callback) {
        var body = JSON.stringify({
            data: selectedGameMode,
            "Map Name": "UGC" + mapId,
            uid: null
        });

        var requestUrl;
        if (httpProxy) {
            requestUrl = `http://${httpProxyIp}:${httpProxyPort}/rcon?command=${action} UGC${mapId} ${selectedGameMode}`;
        } else {
            requestUrl = `https://pavlovrcon.com/api/${action}/${storedServerId}`;
        }

        GM_xmlhttpRequest({
            method: httpProxy ? "GET" : "POST",
            url: httpProxy ? 
            `http://${httpProxyIp}:${httpProxyPort}/rcon?command=${action} UGC${mapId} ${selectedGameMode}` : 
            `https://pavlovrcon.com/api/${action}/${storedServerId}`,
            headers: headers,
            data: body,
            onload: function(response) {
                if (response.status >= 200 && response.status < 400) {
                    cocoMessage.success(1500, "Command sent successfully", () => {
                    });
                    if(callback) {
                        callback(true);
                    }
                } else {
                    cocoMessage.error(1500, "Command failed with status: " + response.status, () => {
                    });
                    if(callback) {
                        callback(false);
                    }
                }
            }
        });
    }

    function addButtonsWithEventListeners(mapId, subscribeButton, specificMapPage = false) {
        var playButton = createButton("playButton", "green", "Play", subscribeButton);
        playButton.style.marginBottom = "10px";
        playButton.style.marginTop = "8px";

        var mapRotationButtonsContainer = document.createElement('div');
        mapRotationButtonsContainer.style.cssText = 'display: flex; justify-content: space-between;';

        var addToMapRotationButton = createButton("addToMapRotationButton", "blue", "Add to map rotation", subscribeButton);
        var removeFromMapRotationButton = createButton("removeFromMapRotationButton", "blue", "Remove from map rotation", addToMapRotationButton);
        addToMapRotationButton.style.width = "49%";
        addToMapRotationButton.querySelector('span div span').style.fontSize = "75%";
        removeFromMapRotationButton.style.width = "49%";
        removeFromMapRotationButton.querySelector('span div span').style.fontSize = "75%";

        mapRotationButtonsContainer.appendChild(addToMapRotationButton);
        mapRotationButtonsContainer.appendChild(removeFromMapRotationButton);

        subscribeButton.parentNode.insertBefore(playButton, subscribeButton);~
        subscribeButton.parentNode.insertBefore(mapRotationButtonsContainer, playButton.nextElementSibling);

        if(specificMapPage){
            addSelectElement(playButton, 'before');
        }

        playButton.addEventListener('click', function(e) {
            mapAction(mapId, GM_getValue("storedGameMode", selectElementContainer.querySelectorAll('select')[1].value), "switch_map");
        });

        var mapName;
        addToMapRotationButton.addEventListener('click', function(e) {
            var mapName;
            var targetDiv;
            if(specificMapPage) {
                mapName = document.querySelector('.tw-util-truncate-two-lines.tw-font-bold').textContent;
                targetDiv = document.querySelector('.tw-util-ratio-16-9.tw-relative.tw-w-full.tw-global--border-radius.tw-bg-theme-1.tw-overflow-hidden');
            } else {
                mapName = subscribeButton.parentNode.parentNode.parentNode.querySelectorAll('a > div')[1].textContent;
                targetDiv = subscribeButton.parentNode.parentNode.parentNode;
            }
    
            var gameMode = GM_getValue("storedGameMode", selectElementContainer.querySelectorAll('select')[1].value);
            if (confirmAction(mapName, mapId, gameMode, "add")) {
                mapAction(mapId, gameMode, "addmaprotation");
                addOverlayAndSpan(targetDiv, gameMode, mapId);
            }
        });
        removeFromMapRotationButton.addEventListener('click', function(e) {
            var mapName;
            var targetDiv
            if(specificMapPage) {
                mapName = document.querySelector('.tw-util-truncate-two-lines.tw-font-bold').textContent;
                targetDiv = document.querySelector('.tw-util-ratio-16-9.tw-relative.tw-w-full.tw-global--border-radius.tw-bg-theme-1.tw-overflow-hidden');
            } else {
                mapName = subscribeButton.parentNode.parentNode.parentNode.querySelectorAll('a > div')[1].textContent;
                targetDiv = subscribeButton.parentNode.parentNode.parentNode;
            }
    
            var gameMode = GM_getValue("storedGameMode", selectElementContainer.querySelectorAll('select')[1].value);
            if (confirmAction(mapName, mapId, gameMode, "remove")) {
                mapAction(mapId, gameMode, "removemaprotation");
                var overlayToRemove = targetDiv.querySelector(`#o-${mapId}-${gameMode}`);
                if(overlayToRemove) {
                    overlayToRemove.remove();
                }
            }
        });
    }

    function extractMapIdFromDiv(divsContainingMapId) {
        const mapIds = [];

        for (let i = 0; i < divsContainingMapId.length; i++) {
            const style = divsContainingMapId[i].getAttribute('style');
            const urlMatch = style.match(/url\("([^"]+)"\)/);

            if (urlMatch) {
                const url = urlMatch[1];
                const mapIdMatch = url.match(/\/(\d+)\//);

                if (mapIdMatch) {
                    mapIds.push(mapIdMatch[1]);
                }
            }
        }
        return mapIds;
    }

    let addedMaps = new Set();

    function processMapDivs(divsContainingMapId) {
        const subscribeButtons = document.querySelectorAll('button.tw-button-transition.tw-outline-none.tw-shrink-0.tw-items-center.tw-justify-center.tw-space-x-2.tw-font-bold.tw-bg-theme-1--hover.tw-text-md[id^="input"]');
        const mapIds = extractMapIdFromDiv(divsContainingMapId);

        for (let i = 0; i < mapIds.length; i++) {
            const mapId = mapIds[i];

            if (addedMaps.has(mapId)) {
                continue;
            }

            addButtonsWithEventListeners(mapId, subscribeButtons[i]);
            addedMaps.add(mapId);
        }
    }

    function addControlsToSpecificMapPage() {
        var subscribeButton = document.querySelector('button.tw-button-transition.tw-outline-none.tw-shrink-0.tw-items-center.tw-justify-center.tw-space-x-2.tw-font-bold.tw-bg-theme-1--hover.tw-text-md[id^="input"]');
        if (!subscribeButton || document.getElementById('playButton') || document.getElementById('addToMapRotationButton')) {
            return;
        }

        var mapIdElement = document.querySelector('div.tw-justify-between.tw-items-center.tw-flex:last-child > span.tw-whitespace-nowrap:last-child > span');
        var mapId = mapIdElement.textContent;

        addButtonsWithEventListeners(mapId, subscribeButton, true);
        addGameModeInServerRotationTags(observerForSpecificMapPage, null, mapId);
    };

    function addOverlayAndSpan(targetDiv, gameMode, mapId) {
        var tagsDiv = targetDiv.querySelector('.tags-div');
        if (!tagsDiv) {
            tagsDiv = document.createElement('div');
            tagsDiv.className = 'tags-div tw-flex tw-space-x-1 tw-items-center';
            tagsDiv.style.cssText = 'flex-direction:column;align-items: flex-end; position: absolute; right: 0;';
            targetDiv.appendChild(tagsDiv);
        }
    
        var overlayDiv = document.createElement('div');
        overlayDiv.id = `o-${mapId}-${gameMode}`;
        overlayDiv.style = 'width: 100%; height: 100%; z-index: 1; text-align: right; margin-bottom:1px;';
        overlayDiv.onclick = e => e.preventDefault();
    
        var spanElement = document.createElement('span');
        spanElement.id = `t-${mapId}-${gameMode}`;
        spanElement.className = `ttw-px-2 tw-z-2 tw-bg-primary tw-rounded-full tw-text-primary-text tw-leading-snug tw-max-w-full`;
        spanElement.style.cssText = 'background-color: blue; border:2px solid red; padding:0px 4px';
        var pElement = document.createElement('p');
        pElement.className = 'tw-util-truncate-one-line tw-w-full';
        pElement.style = 'display:inline;';
        pElement.textContent = `${gameMode}`;
        spanElement.appendChild(pElement);
        overlayDiv.appendChild(spanElement);
        tagsDiv.appendChild(overlayDiv);
    }

    function addGameModeInServerRotationTags(observer, divsContainingMapId, mapId = null) {
        observer.disconnect();
        var mapIds = mapId ? [mapId] : extractMapIdFromDiv(divsContainingMapId);
        var targetDivs = mapId ? document.querySelectorAll('.tw-util-ratio-16-9.tw-relative.tw-w-full.tw-global--border-radius.tw-bg-theme-1.tw-overflow-hidden')
        : document.querySelectorAll('a .tw-relative.tw-util-ratio-16-9');

        let mapGameModeCounters = {};

        for(let i = 0; i < mapIds.length; i++) {
            var mapId = mapIds[i];
            if(mapList[mapId] && targetDivs[i]) {
                var tagsDiv = targetDivs[i].querySelector('.tags-div');
                if(!tagsDiv) {
                    tagsDiv = document.createElement('div');
                    tagsDiv.className = 'tags-div tw-flex tw-space-x-1 tw-items-center';
                    tagsDiv.style.cssText = 'flex-direction:column;align-items: flex-end; position: absolute; right: 0;';
                    targetDivs[i].appendChild(tagsDiv);
                }
                mapList[mapId].forEach((gameMode) => {
                    let currentMapId = mapId;
                    let currentGameMode = gameMode;

                    const mapGameModeKey = `${mapId}-${gameMode}`;
                    if(!mapGameModeCounters[mapGameModeKey]){
                        mapGameModeCounters[mapGameModeKey] = 0;
                    }

                    var overlayDiv = document.createElement('div');
                    overlayDiv.id = `o-${mapId}-${gameMode}-${mapGameModeCounters[mapGameModeKey]}`;
                    overlayDiv.style = 'width: 100%; height: 100%; z-index: 1; text-align: right;';
                    overlayDiv.onclick = e => e.preventDefault();

                    const spanId = `t-${mapId}-${gameMode}-${mapGameModeCounters[mapGameModeKey]++}`;

                    if (!tagsDiv.querySelector(`#${spanId}`)) {
                        var spanElement = document.createElement('span');
                        spanElement.id = spanId;
                        spanElement.className = `ttw-px-2 tw-z-2 tw-bg-primary tw-rounded-full tw-text-primary-text tw-leading-snug tw-max-w-full`;
                        spanElement.style.cssText = 'background-color: blue; border:2px solid red; padding:0px 4px';
                        var pElement = document.createElement('p');
                        pElement.className = 'tw-util-truncate-one-line tw-w-full';
                        pElement.style = 'display:inline;';
                        pElement.textContent = `${gameMode}`;
                        spanElement.appendChild(pElement);
                        overlayDiv.appendChild(spanElement);
                        tagsDiv.appendChild(overlayDiv);
                        spanElement.addEventListener('click', function(e) {
                            e.preventDefault();
                            if (confirmAction(currentGameMode, currentMapId, gameMode, "removemaprotation")) {
                                mapAction(currentMapId, gameMode, "removemaprotation", function(success) {
                                    if (success) {
                                        let index = mapList[currentMapId].indexOf(currentGameMode);
                                        if (index !== -1) {
                                            mapList[currentMapId].splice(index, 1);
                                        }
                                        document.querySelector(`#${overlayDiv.id}`).remove();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function adjustElementStylesForMapsPage() {
        const elements = document.querySelectorAll('.tw-flex.tw-items-center.tw-flex-col.tw-absolute.tw-bottom-3.lg\\:tw-bottom-4.tw-inset-x-3.lg\\:tw-inset-x-4');

        elements.forEach((element) => {
            element.classList.remove('tw-absolute');
        });

        const elementsTwo = document.querySelectorAll('.tw-px-3.lg\\:tw-px-4.tw-pb-14.lg\\:tw-pb-\\[3\\.75rem\\]');
        elementsTwo.forEach((element) => {
            element.classList.remove('tw-pb-14');
            element.classList.remove('lg:tw-pb-[3.75rem]');
            element.classList.add('tw-pb-4');
        });
    }

    function addSelectElement(targetElement, position) {
        position === "before" ? targetElement.before(selectElementContainer) : targetElement.after(selectElementContainer);
    }

    function findTargetElementAndAddSelectElement(targetElementSelector, position) {
        var checkExist = setInterval(function() {
            var targetElement = document.getElementsByClassName(targetElementSelector)[1]
            if (targetElement) {
                addSelectElement(targetElement, position);
                clearInterval(checkExist);
            }
        }, 500);
    }

    var selectElementContainer = createSelectsAndLabels();

    retrieveMapList();
    if (mapsPageRegex.test(currentPage)) {
        var targetElementSelector = 'md:tw-rounded-lg md:dark:tw-bg-dark-1 md:tw-bg-light-1 tw-border-opacity-40 tw-border-grey md:tw-border-0 tw-border-b md:tw-mb-2 tw-relative';
        var targetElement = document.getElementsByClassName(targetElementSelector)[1]
        findTargetElementAndAddSelectElement(targetElementSelector, 'after');
        var observerForAllMapsPage = new MutationObserver(function(mutationsList) {
            const divsContainingMapId = document.querySelectorAll('div.tw-bg-center.tw-bg-cover.tw-w-full.tw-h-full[role="img"]');
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    processMapDivs(divsContainingMapId);
                    adjustElementStylesForMapsPage();
                    addGameModeInServerRotationTags(observerForAllMapsPage, divsContainingMapId)
                    break;
                }
            }
        });
        observerForAllMapsPage.observe(document.body, { childList: true, subtree: true });
    } else {
        var observerForSpecificMapPage = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addControlsToSpecificMapPage();
                    break;
                }
            }
        });
        observerForSpecificMapPage.observe(document.body, { childList: true, subtree: true });
    }
})();