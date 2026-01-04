// ==UserScript==
// @name         YouTube Shorts Auto Closer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically closes YouTube Shorts pages after daily limit
// @author       se7
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529077/YouTube%20Shorts%20Auto%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/529077/YouTube%20Shorts%20Auto%20Closer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DAILY_LIMIT_MINUTES = 40;
    const WARNING_BEFORE_CLOSE_SECONDS = 10;
    let timeTrackingInterval = null;
    let countdownInterval = null;
    let isPageVisible = true;
    let isScriptActive = true;
    let uiElements = {
        timer: null,
        warning: null
    };

    // Storage keys
    const STORAGE_KEYS = {
        dailyTime: 'shortsTimeToday',
        lastDate: 'shortsLastDate'
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // Reset daily time if it's a new day
    const checkAndResetDaily = () => {
        const lastDate = GM_getValue(STORAGE_KEYS.lastDate, '');
        const today = getTodayDate();
        
        if (lastDate !== today) {
            GM_setValue(STORAGE_KEYS.dailyTime, 0);
            GM_setValue(STORAGE_KEYS.lastDate, today);
        }
    };

    // Get remaining daily time in seconds
    const getRemainingDailyTime = () => {
        checkAndResetDaily();
        const timeSpentToday = GM_getValue(STORAGE_KEYS.dailyTime, 0);
        return Math.max(0, DAILY_LIMIT_MINUTES * 60 - timeSpentToday);
    };

    // Main function to run every second
    const tick = () => {
        if (!isPageVisible || !isScriptActive) return;

        const remainingTime = getRemainingDailyTime();

        if (remainingTime <= 0) {
            cleanup();
            window.close();
            return;
        }

        const newTimeSpent = GM_getValue(STORAGE_KEYS.dailyTime, 0) + 1;
        GM_setValue(STORAGE_KEYS.dailyTime, newTimeSpent);

        updateTimerDisplay(remainingTime - 1);

        if (remainingTime <= WARNING_BEFORE_CLOSE_SECONDS && !uiElements.warning) {
            showWarning(remainingTime - 1);
        }
    };

    // Create timer display
    const createTimerDisplay = () => {
        // Remove existing timer if any
        const existingTimer = document.getElementById('shorts-closer-timer');
        if (existingTimer) {
            existingTimer.remove();
        }

        const timer = document.createElement('div');
        timer.id = 'shorts-closer-timer';
        timer.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            z-index: 9999;
            font-family: 'YouTube Sans', Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: opacity 0.3s;
        `;

        // Create SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "currentColor");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z");
        
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("d", "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z");

        svg.appendChild(path1);
        svg.appendChild(path2);

        const span = document.createElement('span');
        span.textContent = 'Daily time left: ';
        
        const strong = document.createElement('strong');
        strong.id = 'shorts-closer-time';
        strong.textContent = '00:00';
        
        span.appendChild(strong);
        timer.appendChild(svg);
        timer.appendChild(span);

        document.body.appendChild(timer);
        return timer;
    };

    // Create warning notification element
    const createWarning = () => {
        // Remove existing warning if any
        const existingWarning = document.getElementById('shorts-closer-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        const warning = document.createElement('div');
        warning.id = 'shorts-closer-warning';
        warning.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'YouTube Sans', Arial, sans-serif;
            font-size: 14px;
            animation: fadeIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        const warningIcon = document.createElement('span');
        warningIcon.textContent = '⚠️';

        const contentDiv = document.createElement('div');

        const titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '4px';
        titleDiv.textContent = 'Daily limit almost reached!';

        const countdownDiv = document.createElement('div');
        const countdownText = document.createElement('span');
        countdownText.textContent = 'Closing in: ';
        const countdownSpan = document.createElement('span');
        countdownSpan.id = 'shorts-closer-countdown';
        countdownSpan.textContent = WARNING_BEFORE_CLOSE_SECONDS.toString();
        const secondsText = document.createElement('span');
        secondsText.textContent = ' seconds';

        countdownDiv.appendChild(countdownText);
        countdownDiv.appendChild(countdownSpan);
        countdownDiv.appendChild(secondsText);

        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(countdownDiv);

        warning.appendChild(warningIcon);
        warning.appendChild(contentDiv);

        document.body.appendChild(warning);
        return warning;
    };

    // Update timer display
    const updateTimerDisplay = (remainingTime) => {
        if (!uiElements.timer) return;
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const strongElement = uiElements.timer.querySelector('#shorts-closer-time');
        if (strongElement) {
            strongElement.textContent = timeString;
            
            if (minutes < 5) {
                strongElement.style.color = '#ff4444';
            } else if (minutes < 10) {
                strongElement.style.color = '#ffd700';
            } else {
                strongElement.style.color = '#fff';
            }
        }
    };

    // Function to show warning with countdown
    const showWarning = (initialCountdown) => {
        if (uiElements.warning) return;

        uiElements.warning = createWarning();
        
        let countdown = initialCountdown;
        const countdownElement = uiElements.warning.querySelector('#shorts-closer-countdown');
        if (countdownElement) {
            countdownElement.textContent = countdown.toString();
        }

        countdownInterval = setInterval(() => {
            if (!isPageVisible || !isScriptActive) return;

            countdown--;
            if (countdownElement) {
                countdownElement.textContent = Math.max(0, countdown).toString();
            }
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 1000);
    };
    
    const stopTimersAndRemoveUI = () => {
        if (timeTrackingInterval) {
            clearInterval(timeTrackingInterval);
            timeTrackingInterval = null;
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        if (uiElements.timer && uiElements.timer.parentNode) {
            uiElements.timer.remove();
            uiElements.timer = null;
        }
        if (uiElements.warning && uiElements.warning.parentNode) {
            uiElements.warning.remove();
            uiElements.warning = null;
        }
    };

    const startTimers = () => {
        // Prevent multiple intervals
        if (timeTrackingInterval) return;

        // Initial check
        const remainingTime = getRemainingDailyTime();
        if (remainingTime <= 0) {
            cleanup();
            window.close();
            return;
        }

        // Create UI
        if (!uiElements.timer) {
            uiElements.timer = createTimerDisplay();
        }
        updateTimerDisplay(remainingTime);

        // Start the main tick interval
        timeTrackingInterval = setInterval(tick, 1000);
    };

    // Comprehensive cleanup function
    const cleanup = () => {
        isScriptActive = false;
        stopTimersAndRemoveUI();

        // Remove event listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('yt-navigate-finish', handlePageNavigation);
    };

    // Handle visibility changes
    const handleVisibilityChange = () => {
        if (!isScriptActive) return;
        isPageVisible = document.visibilityState === 'visible';

        if (uiElements.timer) {
            uiElements.timer.style.opacity = isPageVisible ? '1' : '0.5';
        }
    };
    
    const handlePageNavigation = () => {
        if (!isScriptActive) return;

        const isOnShortsPage = window.location.pathname.startsWith('/shorts/');

        if (isOnShortsPage) {
            startTimers();
        } else {
            stopTimersAndRemoveUI();
        }
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('yt-navigate-finish', handlePageNavigation);

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    // Initial check when the script runs
    handlePageNavigation();

})(); 