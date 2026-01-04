// ==UserScript==
// @name         GeForceNOW Smart Refresh Script by Mohi
// @name:ar      برنامج تحديث صفحة جيفورس ناو تلقائي بواسطة Mohi
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Auto-refresh GeForce Now page & notifies the user if free capacity is available. Fully optimized for accurate countdown even in the background, with a full range of settings to customize your experience as you'd like.
// @description:ar يقوم بتحديث صفحة GeForce Now تلقائيًا ويقوم بإعلامك إذا كان هناك سعة مجانية متاحة. تم تصميم السكربت لتحسين الأداء مع عدادات دقيقة، حتى عندما تكون الصفحة في الخلفية. يقدم السكربت مجموعة من الإعدادات القابلة للتخصيص، بما في ذلك النقر التلقائي، وإشعارات الصوت، وأساليب الكشف، لتعزيز تجربتك.
// @author       Mohi
// @license GNU GPLv3
// @match        https://www.nvidia.com/gfn/product-matrix/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/507294/GeForceNOW%20Smart%20Refresh%20Script%20by%20Mohi.user.js
// @updateURL https://update.greasyfork.org/scripts/507294/GeForceNOW%20Smart%20Refresh%20Script%20by%20Mohi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        AUTO_CLICK_BUTTON: true,
        refreshInterval: 15,
        freeCapacitySoundURL: 'https://www.myinstants.com/media/sounds/airhorn.mp3',
        freeCapacitySoundVolume: 0.3,
        notificationTimeout: 5000,
        autoReload: true,
        detectionMethod: 'both' // "button", "text", or "both"
    };

    let AUTO_CLICK_BUTTON = GM_getValue("AUTO_CLICK_BUTTON", defaultSettings.AUTO_CLICK_BUTTON);
    let refreshInterval = GM_getValue("refreshInterval", defaultSettings.refreshInterval);
    let freeCapacitySoundURL = GM_getValue("freeCapacitySoundURL", defaultSettings.freeCapacitySoundURL);
    let freeCapacitySoundVolume = GM_getValue("freeCapacitySoundVolume", defaultSettings.freeCapacitySoundVolume);
    let notificationTimeout = GM_getValue("notificationTimeout", defaultSettings.notificationTimeout);
    let autoReload = GM_getValue("autoReload", defaultSettings.autoReload);
    let detectionMethod = GM_getValue("detectionMethod", defaultSettings.detectionMethod);
    let countdownTime = refreshInterval;
    let menuCommandIDs = [];
    let capacityFound = false;

    // Web Worker for countdown
    let countdownWorker;

    // Handle background/foreground visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log("Page is in the background. Reducing resource usage.");
        } else {
            console.log("Page is in the foreground. Restoring full performance.");
        }
    });

    function playFreeCapacitySound() {
        if (freeCapacitySoundURL) {
            const audio = new Audio(freeCapacitySoundURL);
            audio.volume = freeCapacitySoundVolume;
            audio.play();
        }
    }

    function showNotification(title, message) {
        GM_notification({
            text: message,
            title: title,
            timeout: notificationTimeout
        });
    }

    function updateTabTitle() {
        document.title = !capacityFound ? `Refreshing in ${Math.round(countdownTime)}s | GFN` : "Free Capacity Found | GFN";
    }

    function handleCountdown(data) {
        if (!capacityFound && autoReload) {
            countdownTime = data.countdownTime;
            updateTabTitle();

            if (countdownTime <= 0) {
                triggerReload();
            }
        }
    }

    function triggerReload() {
        checkCapacityMessage(); // Check capacity before deciding to reload
        if (!capacityFound) { // Only reload if free capacity has not been found
            countdownTime = refreshInterval;
            location.reload();
        }
    }

    function checkCapacityMessage() {
        const capacityMessage = document.body.innerText.includes("GeForce NOW is currently at capacity.");
        const playButton = document.querySelector('button[data-qa-id="play-button"]');

        if (detectionMethod === 'text' && !capacityMessage && !capacityFound) {
            capacityFound = true;
            notifyUser();
        }

        if (detectionMethod === 'button' && playButton && !capacityFound) {
            capacityFound = true;
            clickPlayButton();
        }

        if (detectionMethod === 'both' && (!capacityMessage || playButton) && !capacityFound) {
            capacityFound = true;
            notifyUser();
            if (playButton) clickPlayButton();
        }
    }

    function notifyUser() {
        playFreeCapacitySound();
        showNotification("GeForce NOW Free Capacity", "Free capacity found on GeForce NOW!");
        updateTabTitle();
    }

    function clickPlayButton() {
        const playButton = document.querySelector('button[data-qa-id="play-button"]');
        if (playButton && !capacityFound) {
            capacityFound = true;
            playButton.click();
            playFreeCapacitySound();
            updateTabTitle();
        }
    }

    // Create Web Worker for countdown
    function createCountdownWorker() {
        const blob = new Blob([`
            let countdownTime = ${refreshInterval};
            function countdownStep() {
                countdownTime -= 1;
                postMessage({ countdownTime });
                if (countdownTime > 0) {
                    setTimeout(countdownStep, 1000);
                }
            }
            countdownStep();
        `], { type: 'application/javascript' });
        const workerURL = URL.createObjectURL(blob);
        return new Worker(workerURL);
    }

    function startCountdownWorker() {
        if (countdownWorker) {
            countdownWorker.terminate();
        }
        countdownWorker = createCountdownWorker();
        countdownWorker.onmessage = function(event) {
            handleCountdown(event.data);
        };
    }

    // Keep-Alive Ping
    function keepAlivePing() {
        fetch('https://example.com/ping', { method: 'GET' })
            .catch(err => console.error('Ping failed', err));
        setTimeout(keepAlivePing, 30000); // Ping every 30 seconds
    }

    function updateMenuCommands() {
        for (let id of menuCommandIDs) {
            GM_unregisterMenuCommand(id);
        }
        menuCommandIDs = [];

        // Detection Method Menu
        menuCommandIDs.push(GM_registerMenuCommand(`Set Detection Method (current: ${detectionMethod})`, setDetectionMethod));

        // Refresh Interval
        menuCommandIDs.push(GM_registerMenuCommand(`Set Refresh Interval (current: ${refreshInterval}s)`, setRefreshInterval));

        // Free Capacity Sound URL
        menuCommandIDs.push(GM_registerMenuCommand(`Set Free Capacity Sound URL (current: ${freeCapacitySoundURL})`, setFreeCapacitySoundURL));

        // Free Capacity Sound Volume
        menuCommandIDs.push(GM_registerMenuCommand(`Set Free Capacity Sound Volume (current: ${freeCapacitySoundVolume * 100}%)`, setFreeCapacitySoundVolume));

        // Notification Timeout
        menuCommandIDs.push(GM_registerMenuCommand(`Set Notification Timeout (current: ${notificationTimeout / 1000}s)`, setNotificationTimeout));

        // Auto Click Button (disable if text detection is selected)
        if (detectionMethod === 'text') {
            menuCommandIDs.push(GM_registerMenuCommand("Auto Click Button (disabled due to text detection)", () => {
                alert("Auto Click Button is disabled because detection method is set to 'text'. Change detection method to enable this feature.");
            }));
        } else if (AUTO_CLICK_BUTTON) {
            menuCommandIDs.push(GM_registerMenuCommand("Turn Auto Click Button OFF", () => toggleAutoClickButton(false)));
        } else {
            menuCommandIDs.push(GM_registerMenuCommand("Turn Auto Click Button ON", () => toggleAutoClickButton(true)));
        }

        menuCommandIDs.push(GM_registerMenuCommand("Reset to Default Settings", resetToDefaultSettings));
    }

    function setDetectionMethod() {
        const newMethod = prompt("Enter detection method (button, text, both):", detectionMethod);
        if (newMethod === 'button' || newMethod === 'text' || newMethod === 'both') {
            detectionMethod = newMethod;
            GM_setValue("detectionMethod", detectionMethod);
            updateMenuCommands();
        } else {
            alert("Invalid detection method. Please enter 'button', 'text', or 'both'.");
        }
    }

    function resetToDefaultSettings() {
        const confirmation = confirm(
            `Are you sure you want to reset settings to default? \n` +
            `Default Settings:\n` +
            `- Auto Click Button: ${defaultSettings.AUTO_CLICK_BUTTON ? "ON" : "OFF"}\n` +
            `- Refresh Interval: ${defaultSettings.refreshInterval}s\n` +
            `- Free Capacity Sound URL: ${defaultSettings.freeCapacitySoundURL}\n` +
            `- Free Capacity Sound Volume: ${defaultSettings.freeCapacitySoundVolume * 100}%\n` +
            `- Notification Timeout: ${defaultSettings.notificationTimeout / 1000}s\n` +
            `- Detection Method: ${defaultSettings.detectionMethod}`
        );
        if (confirmation) {
            AUTO_CLICK_BUTTON = defaultSettings.AUTO_CLICK_BUTTON;
            refreshInterval = defaultSettings.refreshInterval;
            freeCapacitySoundURL = defaultSettings.freeCapacitySoundURL;
            freeCapacitySoundVolume = defaultSettings.freeCapacitySoundVolume;
            notificationTimeout = defaultSettings.notificationTimeout;
            detectionMethod = defaultSettings.detectionMethod;

            GM_setValue("AUTO_CLICK_BUTTON", AUTO_CLICK_BUTTON);
            GM_setValue("refreshInterval", refreshInterval);
            GM_setValue("freeCapacitySoundURL", freeCapacitySoundURL);
            GM_setValue("freeCapacitySoundVolume", freeCapacitySoundVolume);
            GM_setValue("notificationTimeout", notificationTimeout);
            GM_setValue("detectionMethod", detectionMethod);

            countdownTime = refreshInterval;
            updateMenuCommands();
            showNotification("Settings Reset", "All settings have been reset to default values.");
        }
    }

    function setRefreshInterval() {
        const newInterval = prompt("Enter new refresh interval in seconds:", refreshInterval);
        if (newInterval !== null) {
            refreshInterval = parseInt(newInterval);
            GM_setValue("refreshInterval", refreshInterval);
            countdownTime = refreshInterval;
            updateMenuCommands();
        }
    }

    function setFreeCapacitySoundURL() {
        const newURL = prompt("Enter new Free Capacity Sound URL:", freeCapacitySoundURL);
        if (newURL !== null) {
            freeCapacitySoundURL = newURL;
            GM_setValue("freeCapacitySoundURL", freeCapacitySoundURL);
            updateMenuCommands();
        }
    }

    function setFreeCapacitySoundVolume() {
        const newVolume = prompt("Enter Free Capacity Sound Volume (0-100):", freeCapacitySoundVolume * 100);
        if (newVolume !== null) {
            freeCapacitySoundVolume = parseInt(newVolume) / 100;
            GM_setValue("freeCapacitySoundVolume", freeCapacitySoundVolume);
            updateMenuCommands();
        }
    }

    function setNotificationTimeout() {
        const newTimeout = prompt("Enter new Notification Timeout in seconds:", notificationTimeout / 1000);
        if (newTimeout !== null) {
            notificationTimeout = parseInt(newTimeout) * 1000;
            GM_setValue("notificationTimeout", notificationTimeout);
            updateMenuCommands();
        }
    }

    function toggleAutoClickButton(turnOn) {
        AUTO_CLICK_BUTTON = turnOn;
        GM_setValue("AUTO_CLICK_BUTTON", turnOn);
        showNotification("Auto Click Button Toggled", `Auto Click Button is now ${turnOn ? "ON" : "OFF"}`);
        updateMenuCommands();
    }

    startCountdownWorker();
    keepAlivePing();
    updateMenuCommands();

})();