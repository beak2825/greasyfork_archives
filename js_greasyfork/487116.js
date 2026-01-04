// ==UserScript==
// @name         Hemmelig gemmelig - fastelavn - kattedronning
// @namespace    https://www.netstationen.dk/visi/client.asp
// @version      6.0.5
// @description  Ja godav
// @author       Din mor
// @match        https://www.netstationen.dk/visi/client.asp*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.addValueChangeListener
// @grant        unsafeWindow
// @license      MIT
// @noframes
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487116/Hemmelig%20gemmelig%20-%20fastelavn%20-%20kattedronning.user.js
// @updateURL https://update.greasyfork.org/scripts/487116/Hemmelig%20gemmelig%20-%20fastelavn%20-%20kattedronning.meta.js
// ==/UserScript==

// Config
let started = false;
let globalStateSet = false;
let globalSocketId = null;
let globalUsername = '';

// Application config
const applicationNotificationKey = 'HHApplicationNotificationKey';
let applicationNotification = true;
GM.addValueChangeListener(applicationNotificationKey, function(key, oldValue, newValue, remote) {
    applicationNotification = newValue;
})

const applicationNotificationFocusKey = 'HHApplicationNotificationFocusKey';
let applicationNotificationFocus = true;
GM.addValueChangeListener(applicationNotificationFocusKey, function(key, oldValue, newValue, remote) {
    applicationNotificationFocus = newValue;
})

const applicationVolumeSaveKey = 'HHApplicationVolumeKey';
let applicationVolume = 0;
GM.addValueChangeListener(applicationVolumeSaveKey, function(key, oldValue, newValue, remote) {
    applicationVolume = newValue;
})

const applicationGotoDelaySaveKey = 'HHApplicationGotoDelayKey';
const applicationGotoDelayRecommended = 400;
let applicationGotoDelay = applicationGotoDelayRecommended;
GM.addValueChangeListener(applicationGotoDelaySaveKey, function(key, oldValue, newValue, remote) {
    applicationGotoDelay = newValue;
})

const applicationAvoidAFKKey = 'HHApplicationAvoidAFKKey';
let applicationAvoidAFK = true;
GM.addValueChangeListener(applicationAvoidAFKKey, function(key, oldValue, newValue, remote) {
    applicationAvoidAFK = newValue;
})

// List of private users for SB
const SBPrivate = ['Juko', 'Netz'];
// List of current SB
const SBList = ['Nicki', 'Camilla', 'Vicevært', 'David', 'Alex', 'Marsha', 'Nikolaj', 'Jever', 'Ralle'];
// List of the one that triggers warning
const SBWarning = [...SBPrivate, ...SBList];
// List of the one we typically need to go to
const SBGoto = [...SBList].sort();

const hourRegex = /[0-9]*,hour,[0-9]*:[0-9]*:[0-9]*:[0-9]*/g
const initialLoadRegex = /[0-9]*,[0-9]*,VisiChat\.server\.ServerVisiPlayer&AACKVisiChat\.x\.actors\.HHActor4_Consumer,[^,]+,[0-9]*,[0-9]*/g
const footerNav = document.querySelector('#footer .navigation');

// Memory States
let inMemoryItems = {};
let inMemoryMonetter = {};

// Maps
let userIdToPlayerStateId = {};
let playerStateIdToUserId = {}

// ** HELPERS ** //

function getRandomTimeInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomTimeIntervalInMinutes(min, max) {
    const newMax = max * 60000;
    const newMin = min * 60000;
    return getRandomTimeInterval(newMin, newMax)
}

function addToChatLog(username, msg, when) {
    const template = `<li class="default"><span class="sender">${username}:</span> <p>${msg}</p> <span class="timestamp">${when}</span></li>`
    document.getElementById('chattext')?.insertAdjacentHTML('afterbegin', template);
}

function escapeHTML(unsafeText) {
    return unsafeText.replace('&AAOG', 'æ').replace('&AAPI', 'ø').replace('&AANI', 'Ø').replace('&AAOF', 'å')
}

function truncate(input, length) {
    if (input.length > length) {
        return input.substring(0, length) + '...';
    }
    return input;
}

function handlePlayerData(data) {
    const parsedData = data.slice(2);
    return parsedData.split(',,');
}

function playSound(url) {
    const audio = new Audio(url);
    audio.volume = applicationVolume / 100;
    audio.play();
}

function getCurrentTime() {
    return new Date().toLocaleTimeString().replaceAll('.', ':');
}

// ** End of HELPERS ** //

// ** Au2 ** //

let afkTimeout = null;
const afkStopElement = 'global_stop_now'

function avoidAfk(socketId) {
    if (!applicationAvoidAFK) {
        return;
    }

    const interval = getRandomTimeIntervalInMinutes(5, 15);
    const message = '.';

    afkTimeout = setTimeout(() => {
        unsafeWindow.socket.send(`!,${socketId},${message}`);
        addToChatLog(globalUsername, message, getCurrentTime())
        avoidAfk(socketId);
    }, interval);
}

function stop() {
    if (!started) return;

    addToChatLog('Den almægtige', 'Off', getCurrentTime());
    started = false;
    clearTimeout(afkTimeout);
    clearTimeout(gotoSpammerTimeout)
    document.getElementById(afkStopElement)?.remove();
    document.getElementById(gotoSpammerElementLi)?.remove();
    document.getElementById(configButtonElementLi)?.remove();
}

function createButton() {
    const template = `
    <li id="${afkStopElement}" style="color: white; cursor: pointer; display: flex; align-items: center; font-weight: 700;">
        STOP
    </li>`;
    footerNav.insertAdjacentHTML('beforeend', template);

    const li = document.getElementById(afkStopElement);
    li.addEventListener('click', stop, {once: true});
}

function start(socketId) {
    if (started) return;

    avoidAfk(socketId);
    addToChatLog('Den almægtige', 'On', getCurrentTime());
    started = true;
    createButton();
    createDropdown();
    createConfigButton();
}

function handleHours(data, socket) {
    const [hour, command, details] = data.split(',');
    const [stillHour, time, sentSocketId, nonce] = details.split(':');

    const interval = getRandomTimeInterval(1000, 10000);
    setTimeout(() => {
        unsafeWindow.socket.send(`${hour},time,${time}:1`)
    }, interval)
}

// ** End of Au2 ** //

// ** GOTO SPAMMER ** //

let gotoSpammerTimeout = null;
const gotoSpammerElementLi = 'global_stop_gotoLi';
const gotoSpammerElement = 'global_stop_goto';
const gotoSpammerElementValue = 'global_stop_gotoValue';

function startGotoSpammer() {
    if (globalSocketId === null) {
        return;
    }

    const username = document.getElementById(gotoSpammerElementValue)?.value;
    const command = `!,${globalSocketId},/gotouser ${username}`;

    // Send initial command to act on start
    unsafeWindow.socket.send(command);

    // Send other as an interval
    gotoSpammerTimeout = setInterval(() => {
        unsafeWindow.document.send(command);
    }, applicationGotoDelay);

    const element = document.getElementById(gotoSpammerElement);
    element.innerHTML = 'Stop';
    element.addEventListener('click', initGotoSpammer, {once: true})
}

function initGotoSpammer() {
    clearInterval(gotoSpammerTimeout);
    const element = document.getElementById(gotoSpammerElement);
    element.innerHTML = 'Start';
    element.addEventListener('click', startGotoSpammer, {once: true})
}

function createDropdown() {
    const template = `
    <li id="${gotoSpammerElementLi}" style="display: flex; align-items: center;">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <select id="${gotoSpammerElementValue}">
                ${SBGoto.map((username) => {
                    return `<option value="${username}">${username}</option>`;
                })}
            </select>
            <div id="${gotoSpammerElement}" style="color: white; font-size: 8px; cursor: pointer;">Start</div>
        </div>
    </li>`

    footerNav.insertAdjacentHTML('beforeend', template);
    initGotoSpammer();
}

// ** End of GOTO SPAMMER ** //

// ** Monetter Tracker ** //

function handlePlayerMonetData(playerData) {
    handlePlayerData(playerData).forEach((player) => {
        const [userStateId, _, username, userId, __, monetter] = player.split(',');
        inMemoryMonetter[userId] = monetter;
    })
}

function resetPlayersMonetter() {
    inMemoryMonetter = {};
}

function setupProfileHandler() {
    const right = document.getElementById('right');
    right.onload = (e) => {
        const iframe = e.target;

        if (!iframe.contentDocument.documentURI.includes('profile.asp')) {
            return;
        }

        const url = new URL(iframe.contentDocument.documentURI);
        const params = new URLSearchParams(url.search);

        if (!params.has('userId')) {
            return;
        }

        const userId = params.get('userId');
        const monetter = inMemoryMonetter[userId] ?? 'ukendt';
        const items = inMemoryItems[userId] ?? {};

        const element = iframe.contentDocument.querySelector('section.body .placeholder')
        const itemArray = Object.values(items);
        const template = `
        <div class="row">
            <div class="col-xs-6"><strong>Monetter:</strong></div>
            <div class="col-xs-6"><strong>Ting:</strong></div>
            <div class="col-xs-6">${monetter}</div>
            <div class="col-xs-6">
                <select id="inventoryList" style="max-width: 100%">
                    <option value="0">Oversigt af ting (${itemArray.length})</option>
                        ${itemArray.map((item) => {
                            return `<option value="${item.id}">${truncate(escapeHTML(item.name), 20)} - (${item.id})</option>`;
                        })}
                </select>
            </div>
        </div>`;

        element.insertAdjacentHTML('beforeend', template);

        const itemSelect = iframe.contentDocument.querySelector('#inventoryList');
        itemSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            iframe.src = `https://www.netstationen.dk/rightpages/items/Item.asp?id=${value}`;
        })
    }
}

// ** End of Monetter Tracker ** //

// ** Items Tracker ** //

function handlePlayerItemData(itemData) {
    const [itemId, name, _, userId] = itemData.split(',').slice(1);

    if (!inMemoryItems[userId]) {
        inMemoryItems[userId] = {}
    }

    inMemoryItems[userId][itemId] = {
        name: name,
        id: itemId,
    };
}

function resetPlayersItems() {
    inMemoryItems = {};
}

function resetPlayerItems(userId) {
    inMemoryItems[userId] = {};
}

// ** End of Items Tracker ** //

// ** Room tracker ** //

function handleRoomChange(roomData) {
    resetPlayersItems();
    resetPlayersMonetter();
}

function handlePlayerRoomChange(roomChangeData) {
    const [userStateId, roomId] = roomChangeData.split(',').slice(1);
    resetPlayerItems(playerStateIdToUserId[userStateId]);
}

function handlePlayerEnter(playerData) {
    handlePlayerData(playerData).forEach((player) => {
        const [userStateId, _, username, userId] = player.split(',');
        userIdToPlayerStateId[userId] = userStateId;
        playerStateIdToUserId[userStateId] = userId
    });
}

// ** End of Room tracker ** //

// ** User tracker ** //

function handlePlayerTracking(playerData) {
    if (!started) return;

    handlePlayerData(playerData).forEach((player) => {
        const [userStateId, _, username, userId] = player.split(',');

        if (SBWarning.some((sb) => sb.toUpperCase() === username.toUpperCase())) {
            if (applicationNotification) {
                GM.notification({
                    text: `${username} er kommet ind i dit rum!`,
                    title: 'SB Alert',
                    highlight: applicationNotificationFocus,
                    silent: true,
                    onclick: (event) => {
                        event.preventDefault();
                        unsafeWindow.focus();
                    }
                });
            }

            if (applicationVolume !== 0) {
                playSound('https://www.tones7.com/media/trap_text_tone.mp3');
            }
        }
    })
}

function handleUserdata(userData) {
    const [socketId, userId, _, username] = userData.split(',');
    globalSocketId = socketId;
    globalUsername = username;
    globalStateSet = true;
}

// ** End of User tracker ** //

// ** Start of config template ** //

const audioSliderVolumeElement = 'AudioVolumeSliderElementHH';
const audioSliderVolumeTestButton = 'AudioSliderVolumeTestButtonHH'
const audioSliderVolumeMuteButton = 'AudioSliderVolumeMuteButtonHH'
const gotoDelayInputElement = 'GotoDelayInputElementHH'
const notificationInputElement = 'NotificationInputElementHH';
const notificationFocusInputElement = 'NotificationFocusInputElementHH';
const notificationFocusContainerElement = 'NotificationFocusContainerElementHH';
const avoidAFKInputElement = 'avoidAFKInputElementHH';
const configOverlayElement = 'ConfigOverlayElementHH';
const configButtonElementLi = 'ConfigButtonElementLiHH'
const configButtonElement = 'ConfigButtonElementHH';
const configContainerElement = 'ConfigContainerElementHH';
const configButtonCloseElement = 'ConfigButtonCloseElementHH'

function createConfigButton() {
    const template = `
    <li id="${configButtonElementLi}" style="display: flex; justify-content: center; align-items: center;">
        <button style="line-height: 5px;" type="button" class="btn btn-primary" id=${configButtonElement}>Config</button>
    </li>`;

    footerNav.insertAdjacentHTML('beforeend', template);

    const buttonElement = document.getElementById(configButtonElement)
    buttonElement.addEventListener('click', openConfig)
}

function createAudioSlider() {
    const template = `
    <div class="slidecontainer text-center" style="max-width: 100px">
        <div>SB Advarsel Volume</div>
        <input type="range" min="0" max="100" value="${applicationVolume}" class="slider" id="${audioSliderVolumeElement}">
        <button id="${audioSliderVolumeTestButton}" style="line-height: 5px; font-size: 10px; padding: 5px;" type="button" class="btn btn-info">Test</button>
        <button id="${audioSliderVolumeMuteButton}" style="line-height: 5px; font-size: 10px; padding: 5px;" type="button" class="btn btn-danger">Mute</button>
    </div>`;

    const configContainerEl = document.getElementById(configContainerElement)
    configContainerEl.insertAdjacentHTML('beforeend', template);

    const testButtonElement = document.getElementById(audioSliderVolumeTestButton)
    testButtonElement.addEventListener('click', (event) => {
        playSound('https://www.tones7.com/media/trap_text_tone.mp3');
    })

    const sliderElement = document.getElementById(audioSliderVolumeElement)
    sliderElement.addEventListener('change', (event) => {
        GM.setValue(applicationVolumeSaveKey, event.target.value);
    })

    const muteButtonElement = document.getElementById(audioSliderVolumeMuteButton)
    muteButtonElement.addEventListener('click', (event) => {
        GM.setValue(applicationVolumeSaveKey, 0);
        sliderElement.value = 0;
    })
}

function createGotoDelayInput() {
    const template = `
    <div class="text-center">
        <div>GOTO Spammer delay</div>
        <div style="font-size: 8px">Under ${applicationGotoDelayRecommended} er på eget ansvar.</div>
        <input style="color: black; max-width: 50px;" id="${gotoDelayInputElement}" type="number" min="1" value="${applicationGotoDelay}"></input> ms
    </div>
    `;

    const configContainerEl = document.getElementById(configContainerElement)
    configContainerEl.insertAdjacentHTML('beforeend', template);

    const inputElement = document.getElementById(gotoDelayInputElement)
    inputElement.addEventListener('change', (event) => {
        GM.setValue(applicationGotoDelaySaveKey, Math.max(event.target.value, applicationGotoDelayRecommended));
    })
}

function createAvoidAFKCheckbox() {
    const template = `
    <div class="text-center">
        <div>Sørg for at holde mig online</div>
        <div style="font-size: 8px;">Sender et punktum</div>
        <input id="${avoidAFKInputElement}" type="checkbox"></input>
    </div>
    `;

    const configContainerEl = document.getElementById(configContainerElement)
    configContainerEl.insertAdjacentHTML('beforeend', template);

    const inputElement = document.getElementById(avoidAFKInputElement)
    inputElement.checked = applicationAvoidAFK;
    inputElement.addEventListener('change', (event) => {
        GM.setValue(applicationAvoidAFKKey, event.target.checked);
    })
}

function createCheckboxes() {
    const template = `
    <div class="text-center">
        <div>Notifikationer i windows</div>
        <input id="${notificationInputElement}" type="checkbox"></input>

        <div id="${notificationFocusContainerElement}">
            <div>Fokuser vindue ved notifikation</div>
            <input id="${notificationFocusInputElement}" type="checkbox"></input>
        </div>
    </div>
    `;

    const configContainerEl = document.getElementById(configContainerElement)
    configContainerEl.insertAdjacentHTML('beforeend', template);

    const notificationFocusEl = document.getElementById(notificationFocusInputElement);
    notificationFocusEl.checked = applicationNotificationFocus;
    notificationFocusEl.addEventListener('change', (event) => {
        GM.setValue(applicationNotificationFocusKey, event.target.checked)
    })

    const notificationEl = document.getElementById(notificationInputElement);
    toggleNotificationFocusContainer(applicationNotification)
    notificationEl.checked = applicationNotification;

    notificationEl.addEventListener('change', (event) => {
        toggleNotificationFocusContainer(event.target.checked)
        GM.setValue(applicationNotificationKey, event.target.checked)
    })
}

function toggleNotificationFocusContainer(checked) {
    const notificationFocusContainerEl = document.getElementById(notificationFocusContainerElement);

    if (!checked) {
        notificationFocusContainerEl.style.opacity = '0.5';
        notificationFocusContainerEl.style.pointerEvents = 'none';
    } else {
        notificationFocusContainerEl.style.opacity = '1';
        notificationFocusContainerEl.style.pointerEvents = 'all';
    }
}

function openConfig() {
    const template = `
    <div id="${configOverlayElement}" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); z-index: 9999;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: grey; max-width: 50%; margin: 60px auto; color: white; min-height: 100px; padding: 10px; border-radius: 5px; -webkit-box-shadow: 5px 5px 15px 2px #000000; box-shadow: 5px 5px 15px 2px #000000;">
            <div style="font-size: 20px;">Config</div>
            <div style="padding-top: 20px; padding-bottom: 20px; display: flex; gap: 10px; justify-content: center; flex-direction: column; align-items: center;" id="${configContainerElement}"></div>
            <button id="${configButtonCloseElement}" type="button" class="btn btn-danger">Close</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', template);

    createCheckboxes();
    createAvoidAFKCheckbox();
    createAudioSlider();
    createGotoDelayInput();

    const closeButton = document.getElementById(configButtonCloseElement);
    closeButton.addEventListener('click', closeConfig, {once: true})
}

function closeConfig() {
    document.getElementById(configOverlayElement)?.remove();
}

async function initConfig() {
    applicationNotification = await GM.getValue(applicationNotificationKey, applicationNotification);
    applicationNotificationFocus = await GM.getValue(applicationNotificationFocusKey, applicationNotificationFocus);
    applicationVolume = await GM.getValue(applicationVolumeSaveKey, applicationVolume);
    applicationGotoDelay = await GM.getValue(applicationGotoDelaySaveKey, applicationGotoDelay);
    applicationAvoidAFK = await GM.getValue(applicationAvoidAFKKey, applicationAvoidAFK);
}

// ** End of config template ** //

function handleMessages(e) {
    if (e.data.startsWith('D')) {
        const [command, thingId, nonce, event, clicks] = e.data.split(',');

        // Number 13946
        if (clicks == 13941) {
            unsafeWindow.socket.send(`D,${thingId},T${thingId},_clicked,-`);
            unsafeWindow.socket.send(`D,${thingId},T${thingId},_clicked,-`);
            unsafeWindow.socket.send(`D,${thingId},T${thingId},_clicked,-`);
            unsafeWindow.socket.send(`D,${thingId},T${thingId},_clicked,-`);
            unsafeWindow.socket.send(`D,${thingId},T${thingId},_clicked,-`);
        }
        return;
    }

    // Item data
    if (e.data.startsWith('V,')) {
        return handlePlayerItemData(e.data);
    }

    // Room loaded data
    if (e.data.startsWith('v,')) {
        return handleRoomChange(e.data);
    }

    // Room changing
    if (e.data.startsWith('q,')) {
        return handlePlayerRoomChange(e.data);
    }

    // p - User enter / y - Init room users
    if (e.data.startsWith('p,') || e.data.startsWith('y,')) {
        handlePlayerMonetData(e.data);
        handlePlayerEnter(e.data);
        handlePlayerTracking(e.data);
        return;
    }

    // Initial load
    if (!globalStateSet && e.data.match(initialLoadRegex)) {
        return handleUserdata(e.data);
    }

    // Hour
    if (started && e.data.match(hourRegex)) {
        return handleHours(e.data);
    }
}

function interceptMessages(e) {
    if (!started && e.startsWith('C,') && e.includes('_mood')) {
        let [_, socketId] = e.split(',');
        start(socketId);
    }
}

function init() {
    setupProfileHandler();
}

async function patchWebSocket() {
    unsafeWindow.WebSocket = function(...args) {
        const ws = new WebSocket(...args);
        ws.oldSend = ws.send;

        ws.send = function(e) {
            ws.oldSend(e);
            // Extend logic from implementation to intercept messages send to server
            interceptMessages(e);
        }

        // Add listener to socket
        ws.addEventListener('message', (e) => {
            handleMessages(e);
        })

        // Remove when we lose connection
        ws.addEventListener('close', (e) => {
            stop();
        })

        unsafeWindow.socket = ws;
        return ws;
    }
}

async function checkForInit() {
    const duration = 100
    let remainingAttempts = 50

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (unsafeWindow.socket) {
                resolve()
                clearInterval(interval)
            } else if (remainingAttempts <= 1) {
                addToChatLog('Den almægtige', 'Der gik sku noget galt', getCurrentTime())
                clearInterval(interval)
            }

            remainingAttempts--
        }, duration)
    })
}

(async function() {
    'use strict';
    await patchWebSocket();
    await initConfig();
    await checkForInit();
    init();
})();