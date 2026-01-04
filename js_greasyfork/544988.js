// ==UserScript==
// @name         AnyRouter Auto Check-in
// @namespace    https://github.com/yourusername/anyrouter-auto-checkin
// @version      1.1.0
// @description  Automatically check in to AnyRouter website daily
// @author       Cline
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_notification
// @license      MIT
// @homepageURL  https://github.com/yourusername/anyrouter-auto-checkin
// @supportURL   https://github.com/yourusername/anyrouter-auto-checkin/issues
// @downloadURL https://update.greasyfork.org/scripts/544988/AnyRouter%20Auto%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/544988/AnyRouter%20Auto%20Check-in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CHECKIN_URL = 'https://anyrouter.top';
    const STORAGE_KEY = 'anyrouter_checkin_data';
    const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const EXECUTION_DELAY = 3000; // 3 seconds delay before execution

    // Utility functions
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function getCurrentDate() {
        return formatDate(new Date());
    }

    function getLocalStorageData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {
                lastCheckinDate: '',
                lastCheckinTimestamp: 0,
                checkinCount: 0
            };
        } catch (error) {
            console.error('AnyRouter Auto Check-in: Error reading localStorage data:', error);
            return {
                lastCheckinDate: '',
                lastCheckinTimestamp: 0,
                checkinCount: 0
            };
        }
    }

    function setLocalStorageData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('AnyRouter Auto Check-in: Error saving localStorage data:', error);
        }
    }

    function isTodayChecked() {
        const data = getLocalStorageData();
        return data.lastCheckinDate === getCurrentDate();
    }

    function shouldCheckin() {
        const data = getLocalStorageData();
        const now = Date.now();
        
        // If never checked in before, should check in
        if (!data.lastCheckinTimestamp) {
            console.log('AnyRouter Auto Check-in: No previous check-in data found, checking in now');
            return true;
        }
        
        // If already checked in today, don't check in
        if (isTodayChecked()) {
            console.log('AnyRouter Auto Check-in: Already checked in today, skipping');
            return false;
        }
        
        // If more than 24 hours since last checkin, should check in
        const timeSinceLastCheckin = now - data.lastCheckinTimestamp;
        const shouldCheck = timeSinceLastCheckin >= CHECK_INTERVAL;
        
        console.log(`AnyRouter Auto Check-in: Time since last check-in: ${Math.floor(timeSinceLastCheckin / 1000 / 60 / 60)} hours, should check-in: ${shouldCheck}`);
        
        return shouldCheck;
    }

    function updateCheckinStatus() {
        const data = getLocalStorageData();
        data.lastCheckinDate = getCurrentDate();
        data.lastCheckinTimestamp = Date.now();
        data.checkinCount = (data.checkinCount || 0) + 1;
        setLocalStorageData(data);
        
        console.log(`AnyRouter Auto Check-in: Successfully checked in! Total check-ins: ${data.checkinCount}`);
    }

    function performCheckin() {
        if (!shouldCheckin()) {
            console.log('AnyRouter Auto Check-in: No check-in needed today');
            return;
        }

        console.log('AnyRouter Auto Check-in: Starting check-in process...');

        try {
            // Open the check-in page in a background tab
            GM_openInTab(CHECKIN_URL, {
                active: false,  // Open in background
                insert: true    // Insert at the beginning of the tab list
            });
            
            // Immediately update the check-in status since we assume visiting the page completes check-in
            updateCheckinStatus();
            
            // Show notification
            try {
                GM_notification({
                    title: 'AnyRouter Auto Check-in',
                    text: 'Daily check-in initiated successfully!',
                    timeout: 5000
                });
            } catch (error) {
                console.log('AnyRouter Auto Check-in: Notification not supported, using console instead');
            }
            
            console.log('AnyRouter Auto Check-in: Check-in page opened in background tab');
        } catch (error) {
            console.error('AnyRouter Auto Check-in: Error opening check-in page:', error);
        }
    }

    // Delay execution to avoid affecting page load performance
    setTimeout(performCheckin, EXECUTION_DELAY);

})();
