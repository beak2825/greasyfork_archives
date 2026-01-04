// ==UserScript==
// @name         Cartelempire Multi-ID Monitor (Separate API Key)
// @author       Kwyy [2054]
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Draggable widgets for monitored users, notifications for online/hospital changes, up to 5 users, case-insensitive match, no ding sound, separate API key variable
// @match        *://cartelempire.online/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521699/Cartelempire%20Multi-ID%20Monitor%20%28Separate%20API%20Key%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521699/Cartelempire%20Multi-ID%20Monitor%20%28Separate%20API%20Key%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1) Configuration
    // ------------------------------------------------------------------------

    // The base API endpoint without the `key` or `id` parameter
    const BASE_URL = 'https://cartelempire.online/api/user?type=advanced&key=';

    // The separate API key variable
    const API_KEY = 'INSERTAPIKEYHERE';

    // We'll append `&id=<userID>` when we fetch a user
    const POLL_INTERVAL = 5000; // poll every 5 seconds
    const NOTIFICATION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
    const MAX_MONITORED = 5; // up to 5 monitored users

    // Keys for saving widget positions
    const MONITORED_POS_KEY = 'widgetPos_monitored';
    const PROFILE_POS_KEY = 'widgetPos_profile';

    // ------------------------------------------------------------------------
    // 2) Global Data
    // ------------------------------------------------------------------------
    let monitoredIDs = GM_getValue('monitoredIDs', []);
    // We'll store user names for the bottom-left widget
    const userNameMapping = {};

    // ------------------------------------------------------------------------
    // Helper: Make an Element Draggable & Save/Load Position
    // ------------------------------------------------------------------------
    function makeDraggable(element, storageKey, defaultPos) {
        const savedPos = GM_getValue(storageKey, defaultPos);
        if (typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
            element.style.left = savedPos.x + 'px';
            element.style.top = savedPos.y + 'px';
        } else {
            element.style.left = defaultPos.x + 'px';
            element.style.top = defaultPos.y + 'px';
        }

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = 'move';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'default';
                // Save final position
                GM_setValue(storageKey, {
                    x: element.offsetLeft,
                    y: element.offsetTop
                });
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });
    }

    // ------------------------------------------------------------------------
    // 3) Monitored Users Widget (Bottom-Left)
    // ------------------------------------------------------------------------
    const monitoredContainer = document.createElement('div');
    monitoredContainer.style.cssText = `
        position: fixed;
        z-index: 9999;
        background: #333;
        color: #fff;
        padding: 10px;
        border: 1px solid #444;
        border-radius: 6px;
        max-height: 200px;
        overflow-y: auto;
        font-family: sans-serif;
    `;
    document.body.appendChild(monitoredContainer);

    const defaultMonitoredPos = {
        x: 10,
        y: window.innerHeight - 250
    };
    makeDraggable(monitoredContainer, MONITORED_POS_KEY, defaultMonitoredPos);

    const title = document.createElement('div');
    title.textContent = 'Monitored Users';
    title.style.cssText = 'font-weight: bold; margin-bottom: 8px;';
    monitoredContainer.appendChild(title);

    const monitoredUsersList = document.createElement('div');
    monitoredContainer.appendChild(monitoredUsersList);

    function updateMonitoredUsersList() {
        monitoredUsersList.innerHTML = '';

        if (monitoredIDs.length === 0) {
            monitoredUsersList.textContent = 'No monitored users.';
            return;
        }

        const ul = document.createElement('ul');
        ul.style.margin = '0';
        ul.style.paddingLeft = '20px';

        monitoredIDs.forEach((id) => {
            const li = document.createElement('li');
            const displayName = userNameMapping[id] || `User ${id}`;

            const link = document.createElement('a');
            link.href = `https://cartelempire.online/user/${id}`;
            link.textContent = displayName;
            link.style.textDecoration = 'none';
            link.style.color = '#4bcaff';
            li.appendChild(link);

            ul.appendChild(li);
        });

        monitoredUsersList.appendChild(ul);
    }

    updateMonitoredUsersList();

    // ------------------------------------------------------------------------
    // 4) Profile Page Widget (Top-Right)
    // ------------------------------------------------------------------------
    (function handleProfilePage() {
        // Case-insensitive match for /user/(\d+)
        const match = window.location.pathname.match(/\/user\/(\d+)/i);
        if (!match) return;

        const profileID = parseInt(match[1], 10);

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: #333;
            color: #fff;
            padding: 10px;
            border: 1px solid #444;
            border-radius: 6px;
            font-family: sans-serif;
        `;
        document.body.appendChild(container);

        const defaultProfilePos = {
            x: window.innerWidth - 300,
            y: 10
        };
        makeDraggable(container, PROFILE_POS_KEY, defaultProfilePos);

        // Add / Remove Buttons
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Monitor';
        addButton.style.cssText = `
            padding: 6px 10px;
            font-size: 14px;
            background: #28a745;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        addButton.addEventListener('click', () => {
            if (monitoredIDs.length >= MAX_MONITORED && !monitoredIDs.includes(profileID)) {
                alert(`You are already monitoring ${MAX_MONITORED} users. Remove one before adding another.`);
                return;
            }
            if (!monitoredIDs.includes(profileID)) {
                monitoredIDs.push(profileID);
                GM_setValue('monitoredIDs', monitoredIDs);
                alert(`User ${profileID} added to the monitor list!`);
                updateMonitoredUsersList();
            } else {
                alert(`User ${profileID} is already being monitored.`);
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove from Monitor';
        removeButton.style.cssText = `
            padding: 6px 10px;
            font-size: 14px;
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        removeButton.addEventListener('click', () => {
            if (monitoredIDs.includes(profileID)) {
                monitoredIDs = monitoredIDs.filter(id => id !== profileID);
                GM_setValue('monitoredIDs', monitoredIDs);
                alert(`User ${profileID} removed from the monitor list!`);
                updateMonitoredUsersList();
            } else {
                alert(`User ${profileID} is not in the monitor list.`);
            }
        });

        container.appendChild(addButton);
        container.appendChild(removeButton);

        // Notify checkboxes
        const notifyOnlineKey = `notifyOnline_${profileID}`;
        let notifyOnlineValue = GM_getValue(notifyOnlineKey, true);

        const notifyOnlineCheckbox = document.createElement('input');
        notifyOnlineCheckbox.type = 'checkbox';
        notifyOnlineCheckbox.checked = notifyOnlineValue;
        notifyOnlineCheckbox.id = 'notifyOnline';

        const notifyOnlineLabel = document.createElement('label');
        notifyOnlineLabel.textContent = ' Notify Online';
        notifyOnlineLabel.htmlFor = 'notifyOnline';
        notifyOnlineLabel.style.color = '#fff';

        notifyOnlineCheckbox.addEventListener('change', () => {
            notifyOnlineValue = notifyOnlineCheckbox.checked;
            GM_setValue(notifyOnlineKey, notifyOnlineValue);
        });

        const notifyHospitalKey = `notifyHospital_${profileID}`;
        let notifyHospitalValue = GM_getValue(notifyHospitalKey, true);

        const notifyHospitalCheckbox = document.createElement('input');
        notifyHospitalCheckbox.type = 'checkbox';
        notifyHospitalCheckbox.checked = notifyHospitalValue;
        notifyHospitalCheckbox.id = 'notifyHospital';

        const notifyHospitalLabel = document.createElement('label');
        notifyHospitalLabel.textContent = ' Notify Hospital';
        notifyHospitalLabel.htmlFor = 'notifyHospital';
        notifyHospitalLabel.style.color = '#fff';

        notifyHospitalCheckbox.addEventListener('change', () => {
            notifyHospitalValue = notifyHospitalCheckbox.checked;
            GM_setValue(notifyHospitalKey, notifyHospitalValue);
        });

        const checkboxesDiv = document.createElement('div');
        checkboxesDiv.style.marginTop = '8px';
        checkboxesDiv.appendChild(notifyOnlineCheckbox);
        checkboxesDiv.appendChild(notifyOnlineLabel);
        checkboxesDiv.appendChild(document.createElement('br'));
        checkboxesDiv.appendChild(notifyHospitalCheckbox);
        checkboxesDiv.appendChild(notifyHospitalLabel);

        container.appendChild(checkboxesDiv);
    })();

    // ------------------------------------------------------------------------
    // 5) Polling Logic
    // ------------------------------------------------------------------------
    function checkPlayerStatus(id) {
        // Build the endpoint with the separate API key variable
        // e.g. https://cartelempire.online/api/user?type=advanced&key=API_KEY&id=123
        const url = `${BASE_URL}${API_KEY}&id=${id}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data) return;
                    processUserData(id, data);
                } catch (err) {
                    console.error(`Error parsing API response for ID=${id}:`, err);
                }
            },
            onerror: (err) => {
                console.error(`API request failed for ID=${id}:`, err);
            }
        });
    }

    // ------------------------------------------------------------------------
    // 6) processUserData: handle lastActive/hospitalRelease, notifications, etc.
    // ------------------------------------------------------------------------
    function processUserData(id, data) {
        // Update user’s name for the bottom-left list
        const userName = data.name || `User ${id}`;
        userNameMapping[id] = userName;
        updateMonitoredUsersList();

        // Retrieve notify prefs
        const notifyOnline = GM_getValue(`notifyOnline_${id}`, true);
        const notifyHospital = GM_getValue(`notifyHospital_${id}`, true);

        // Retrieve stored timestamps
        let previousLastActive = GM_getValue(`previousLastActive_${id}`, null);
        let lastOnlineNotification = GM_getValue(`lastNotificationTimeOnline_${id}`, 0);

        let previousHospitalRelease = GM_getValue(`previousHospitalRelease_${id}`, null);
        let lastHospitalNotification = GM_getValue(`lastNotificationTimeHospital_${id}`, 0);

        const now = Date.now();

        // A) lastActive => possibly notify
        if (notifyOnline && typeof data.lastActive !== 'undefined') {
            const currentLastActive = parseInt(data.lastActive, 10);

            if (previousLastActive !== null && currentLastActive !== previousLastActive) {
                if (now - lastOnlineNotification >= NOTIFICATION_COOLDOWN_MS) {
                    const formattedTime = new Date(currentLastActive).toLocaleString();
                    GM_notification({
                        title: `Online Activity: ${userName}`,
                        text: `lastActive changed to: ${formattedTime}`,
                        timeout: 5000,
                        onclick: () => {
                            // On notification click => go to user’s profile
                            window.open(`https://cartelempire.online/user/${id}`, '_blank');
                        }
                    });
                    lastOnlineNotification = now;
                    GM_setValue(`lastNotificationTimeOnline_${id}`, lastOnlineNotification);
                }
            }
            previousLastActive = currentLastActive;
            GM_setValue(`previousLastActive_${id}`, currentLastActive);
        }

        // B) hospitalRelease => possibly notify
        if (notifyHospital && typeof data.hospitalRelease !== 'undefined') {
            const currentHospitalRelease = parseInt(data.hospitalRelease, 10) || 0;

            if (previousHospitalRelease !== null && currentHospitalRelease !== previousHospitalRelease) {
                if (now - lastHospitalNotification >= NOTIFICATION_COOLDOWN_MS) {
                    if (currentHospitalRelease > 0) {
                        const timeLeftMs = currentHospitalRelease - now;
                        if (timeLeftMs > 0) {
                            const totalSeconds = Math.floor(timeLeftMs / 1000);
                            const hours = Math.floor(totalSeconds / 3600);
                            const minutes = Math.floor((totalSeconds % 3600) / 60);
                            const seconds = totalSeconds % 60;

                            GM_notification({
                                title: `Hospital: ${userName}`,
                                text: `User is in hospital for ${hours}h : ${minutes}m : ${seconds}s`,
                                timeout: 5000,
                                onclick: () => {
                                    window.open(`https://cartelempire.online/user/${id}`, '_blank');
                                }
                            });
                        } else {
                            GM_notification({
                                title: `Hospital: ${userName}`,
                                text: `User has left the hospital.`,
                                timeout: 5000,
                                onclick: () => {
                                    window.open(`https://cartelempire.online/user/${id}`, '_blank');
                                }
                            });
                        }
                    } else if (previousHospitalRelease > 0 && currentHospitalRelease === 0) {
                        GM_notification({
                            title: `Hospital: ${userName}`,
                            text: `User has left the hospital.`,
                            timeout: 5000,
                            onclick: () => {
                                window.open(`https://cartelempire.online/user/${id}`, '_blank');
                            }
                        });
                    }
                    lastHospitalNotification = now;
                    GM_setValue(`lastNotificationTimeHospital_${id}`, lastHospitalNotification);
                }
            }
            previousHospitalRelease = currentHospitalRelease;
            GM_setValue(`previousHospitalRelease_${id}`, currentHospitalRelease);
        }
    }

    // ------------------------------------------------------------------------
    // 7) Polling
    // ------------------------------------------------------------------------
    setInterval(() => {
        if (monitoredIDs.length > 0) {
            monitoredIDs.forEach((id) => {
                checkPlayerStatus(id);
            });
        }
    }, POLL_INTERVAL);

})();
