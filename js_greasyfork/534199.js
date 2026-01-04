// ==UserScript==
// @name         Reddit Profile Multi-User Notifier
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Monitors Reddit user profiles for new posts/comments with draggable floating UI, settings toggle, clickable logs, proper cleanup
// @match        https://www.reddit.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534199/Reddit%20Profile%20Multi-User%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/534199/Reddit%20Profile%20Multi-User%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username = null;
    let countdownTimer = null;
    let countdownSeconds = 0;
    let logContainer = null;
    let nextCheckTimeout = null;
    let uiContainer = null;
    let observer = null;
    let monitoringActive = false;
    let countdownInterval = null;

    function getUsernameFromUrl() {
        const match = window.location.pathname.match(/^\/user\/([^\/]+)/);
        return match ? match[1] : null;
    }

    function getStorageKey(suffix) {
        return `${username}_${suffix}`;
    }

    async function getLastItemId() {
        return await GM_getValue(getStorageKey('lastItemId'), null);
    }

    async function setLastItemId(id) {
        await GM_setValue(getStorageKey('lastItemId'), id);
    }

    async function getSettings() {
        const defaultSettings = { minMinutes: 6, maxMinutes: 10, enabled: false };
        const saved = await GM_getValue(getStorageKey('settings'), null);
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    async function setSettings(settings) {
        await GM_setValue(getStorageKey('settings'), JSON.stringify(settings));
    }

    function requestNotificationPermission() {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                log(`[Notifier] Notification permission: ${permission}`);
            });
        }
    }

    function log(message, link = null) {
        console.log(message);
        if (logContainer) {
            const entry = document.createElement('div');
            entry.style.marginBottom = '4px';
            entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;

            if (link) {
                const a = document.createElement('a');
                a.href = link;
                a.textContent = ' [View]';
                a.target = '_blank';
                a.style.color = '#4FC3F7';
                a.style.marginLeft = '5px';
                entry.appendChild(a);
            }

            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    async function checkNewContent() {
        if (!monitoringActive) {
            console.log("[Notifier] Monitoring inactive. Skipping check.");
            return;
        }

        log("[Notifier] Checking for new content...");

        const firstItem = document.querySelector('a[data-ks-id^="t1_"], a[data-ks-id^="t3_"]');
        if (firstItem) {
            const itemId = firstItem.getAttribute('data-ks-id');
            const itemHref = firstItem.getAttribute('href');
            const fullUrl = `https://www.reddit.com${itemHref}`;
            log(`[Notifier] Found first item: ID = ${itemId}`, fullUrl);

            const lastItemId = await getLastItemId();

            if (lastItemId && itemId !== lastItemId) {
                log(`[Notifier] New item detected!`, fullUrl);
                if (Notification.permission === 'granted') {
                    new Notification(`New Reddit Activity - ${username}`, {
                        body: 'New post or comment detected!',
                        requireInteraction: true
                    });
                }
            }
            await setLastItemId(itemId);
        } else {
            log("[Notifier] No items found on page.");
        }

        scheduleNextCheck();
    }

    function scheduleNextCheck() {
        if (nextCheckTimeout) clearTimeout(nextCheckTimeout);

        getSettings().then(settings => {
            const intervalMinutes = Math.random() * (settings.maxMinutes - settings.minMinutes) + settings.minMinutes;
            countdownSeconds = Math.floor(intervalMinutes * 60);
            log(`[Notifier] Next check in ${intervalMinutes.toFixed(2)} minutes`);

            nextCheckTimeout = setTimeout(() => {
                if (!monitoringActive) {
                    log("[Notifier] Monitoring inactive. Skipping reload.");
                    return;
                }
                log("[Notifier] Reloading page for next check...");
                location.reload();
            }, countdownSeconds * 1000);

            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
                if (countdownSeconds > 0) {
                    countdownSeconds--;
                    const countdownDisplay = document.getElementById('countdown');
                    if (countdownDisplay) {
                        countdownDisplay.textContent = `${countdownSeconds}s`;
                    }
                }
            }, 1000);
        });
    }

    function buildFloatingUI() {
        removeFloatingUI(); // remove old UI if any

        uiContainer = document.createElement('div');
        uiContainer.style.cssText = `
            position: fixed; top: 20px; right: 350px; background: #222; color: white;
            padding: 15px; z-index: 10000; border-radius: 10px; width: 360px; font-family: sans-serif;
            cursor: move;
        `;
        uiContainer.innerHTML = `
            <div><strong>User:</strong> <span id="user-name">${username}</span></div>
            <div style="margin-top:8px; display: flex; gap: 10px; align-items: center;">
                <label>Min: <input type="number" id="min-minutes" style="width:80px;"></label>
                <label>Max: <input type="number" id="max-minutes" style="width:80px;"></label>
                <button id="save-settings" style="flex-grow: 1;">Save</button>
            </div>
            <div style="margin-top:8px;">
                <label><input type="checkbox" id="monitor-toggle"> Enable</label>
            </div>
            <div style="margin-top:10px;"><strong>Next:</strong> <span id="countdown">-</span></div>
            <div style="margin-top:10px; max-height:150px; overflow:auto; background:#333; padding:5px; font-size:12px;" id="log-container"></div>
        `;
        document.body.appendChild(uiContainer);

        // Drag functionality
        let isDragging = false;
        let offsetX, offsetY;

        uiContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - uiContainer.offsetLeft;
            offsetY = e.clientY - uiContainer.offsetTop;
            uiContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                uiContainer.style.left = (e.clientX - offsetX) + 'px';
                uiContainer.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            uiContainer.style.cursor = 'move';
        });

        logContainer = document.getElementById('log-container');

        const minInput = document.getElementById('min-minutes');
        const maxInput = document.getElementById('max-minutes');
        const toggleCheckbox = document.getElementById('monitor-toggle');

        getSettings().then(settings => {
            minInput.value = settings.minMinutes;
            maxInput.value = settings.maxMinutes;
            toggleCheckbox.checked = settings.enabled;
            monitoringActive = settings.enabled;

            if (monitoringActive) {
                startChecking();
            }
        });

        document.getElementById('save-settings').addEventListener('click', async () => {
            const minMinutes = parseFloat(minInput.value);
            const maxMinutes = parseFloat(maxInput.value);
            const enabled = toggleCheckbox.checked;
            if (minMinutes > 0 && maxMinutes > 0 && maxMinutes >= minMinutes) {
                await setSettings({ minMinutes, maxMinutes, enabled });
                log("[Notifier] Settings saved.");
                if (enabled && !monitoringActive) {
                    monitoringActive = true;
                    log("[Notifier] Monitoring enabled.");
                    startChecking();
                } else if (!enabled && monitoringActive) {
                    monitoringActive = false;
                    log("[Notifier] Monitoring disabled.");
                    stopChecking();
                }
            } else {
                alert('Invalid min/max values');
            }
        });

        toggleCheckbox.addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            const minMinutes = parseFloat(minInput.value);
            const maxMinutes = parseFloat(maxInput.value);
            await setSettings({ minMinutes, maxMinutes, enabled });

            if (enabled) {
                monitoringActive = true;
                log("[Notifier] Monitoring enabled.");
                startChecking();
            } else {
                monitoringActive = false;
                log("[Notifier] Monitoring disabled.");
                stopChecking();
            }
        });
    }

    function removeFloatingUI() {
        if (uiContainer) {
            uiContainer.remove();
            uiContainer = null;
        }
    }

    function startChecking() {
        requestNotificationPermission();
        setTimeout(checkNewContent, 15000);
    }

    function stopChecking() {
        if (nextCheckTimeout) {
            clearTimeout(nextCheckTimeout);
            nextCheckTimeout = null;
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    async function startMonitoring() {
        username = getUsernameFromUrl();
        if (!username) {
            stopMonitoring();
            return;
        }
        buildFloatingUI();
    }

    function stopMonitoring() {
        monitoringActive = false;
        stopChecking();
        removeFloatingUI();
    }

    function observeUrlChanges() {
        let lastUrl = location.href;
        observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.log(`[Notifier] URL changed: ${currentUrl}`);
                stopMonitoring();
                startMonitoring();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start
    observeUrlChanges();
    startMonitoring();

})();
