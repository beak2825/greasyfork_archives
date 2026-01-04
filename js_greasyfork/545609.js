// ==UserScript==
// @name         Export All DuckDuckGo AI Chats
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a minimal export button with auto-daily export when new chats are detected
// @author       manuc66
// @match        *://duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545609/Export%20All%20DuckDuckGo%20AI%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/545609/Export%20All%20DuckDuckGo%20AI%20Chats.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const STORAGE_KEYS = {
        LAST_EXPORT_DATE: 'aiChatExporter_lastExportDate',
        LAST_MOST_RECENT_EDIT: 'aiChatExporter_lastMostRecentEdit',
        DEVICE_ID_KEY: 'aiChatExporter_deviceID'
    };

    function getDeviceID() {
        let deviceID = localStorage.getItem(STORAGE_KEYS.DEVICE_ID_KEY);

        if (!deviceID) {
            // Generate a new device ID (UUID format)
            deviceID = 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
            localStorage.setItem(STORAGE_KEYS.DEVICE_ID_KEY, deviceID);
        }

        return deviceID;
    }

    // Utility functions
    function getFormattedDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}_${hours}-${minutes}`;
    }

    function getTodayDateString() {
        const now = new Date();
        return now.toDateString(); // Returns format like "Wed Oct 25 2023"
    }

    function getMostRecentChatEdit(savedAIChats) {
        try {
            const data = JSON.parse(savedAIChats);
            if (!data.chats || !Array.isArray(data.chats)) {
                return null;
            }

            const mostRecentEdit = data.chats.reduce((max, chat) =>
                    chat.lastEdit > max ? chat.lastEdit : max,
                "1970-01-01T00:00:00Z"
            );

            return new Date(mostRecentEdit);
        } catch (error) {
            console.error('Error getting most recent chat edit:', error);
            return null;
        }
    }

    function getExportFileName() {
        const datetime = getFormattedDateTime();
        const deviceID = getDeviceID();
        return `savedAIChats_${datetime}_${deviceID}.json`;
    }

    function exportChats(isAutomatic = false) {
        const savedAIChats = localStorage.getItem('savedAIChats');

        if (!savedAIChats) {
            if (!isAutomatic) {
                alert('No savedAIChats found in local storage.');
            }
            return false;
        }

        try {
            const data = JSON.parse(savedAIChats);
            const filename = getExportFileName();

            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            // Programmatically click the link to trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Update tracking data
            const today = getTodayDateString();
            const mostRecentEdit = getMostRecentChatEdit(savedAIChats);
            const chatCount = data.chats ? data.chats.length : 0;

            localStorage.setItem(STORAGE_KEYS.LAST_EXPORT_DATE, today);
            if (mostRecentEdit) {
                localStorage.setItem(STORAGE_KEYS.LAST_MOST_RECENT_EDIT, mostRecentEdit.toISOString());
            }

            if (isAutomatic) {
                showNotification(`Auto-exported ${chatCount} chats (${filename})`);
            }

            return true;
        } catch (error) {
            console.error('Export failed:', error);
            if (!isAutomatic) {
                alert('Export failed: ' + error.message);
            }
            return false;
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.fontSize = '14px';
        notification.style.maxWidth = '300px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(notification);

        // Fade in
        setTimeout(() => notification.style.opacity = '1', 100);

        // Fade out and remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 4000);
    }

    function checkForNewChats() {
        const savedAIChats = localStorage.getItem('savedAIChats');
        if (!savedAIChats) return false;

        try {
            const currentMostRecentEdit = getMostRecentChatEdit(savedAIChats);
            if (!currentMostRecentEdit) return false;

            const lastExportDate = localStorage.getItem(STORAGE_KEYS.LAST_EXPORT_DATE);
            const lastMostRecentEditStr = localStorage.getItem(STORAGE_KEYS.LAST_MOST_RECENT_EDIT);

            const today = getTodayDateString();
            const isNewDay = lastExportDate !== today;

            let hasNewChats = false;
            if (lastMostRecentEditStr) {
                const lastMostRecentEdit = new Date(lastMostRecentEditStr);
                hasNewChats = currentMostRecentEdit > lastMostRecentEdit;
            } else {
                // First time running, consider it as having new chats
                hasNewChats = true;
            }

            return isNewDay && hasNewChats;
        } catch (error) {
            console.error('Error checking for new chats:', error);
            return false;
        }
    }

    function startAutoExportCheck() {
        // Check immediately
        if (checkForNewChats()) {
            exportChats(true);
        }

        // Then check every 30 minutes
        setInterval(() => {
            if (checkForNewChats()) {
                exportChats(true);
            }
        }, 30 * 60 * 1000); // 30 minutes
    }

    // Create the export button
    const exportButton = document.createElement('button');
    exportButton.innerText = '💾';
    exportButton.title = 'Export AI Chats (Auto-exports daily when new chats detected)';
    exportButton.id = 'ai-chat-export-btn';

    // Base styles for the button
    exportButton.style.position = 'fixed';
    exportButton.style.top = '50%';
    exportButton.style.right = '10px';
    exportButton.style.transform = 'translateY(-50%)';
    exportButton.style.width = '40px';
    exportButton.style.height = '40px';
    exportButton.style.padding = '0';
    exportButton.style.backgroundColor = '#007bff';
    exportButton.style.color = '#fff';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '50%';
    exportButton.style.cursor = 'pointer';
    exportButton.style.zIndex = '9999';
    exportButton.style.fontSize = '16px';
    exportButton.style.display = 'flex';
    exportButton.style.alignItems = 'center';
    exportButton.style.justifyContent = 'center';
    exportButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    exportButton.style.transition = 'all 0.2s ease';

    // Add hover effects
    exportButton.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#0056b3';
        this.style.transform = 'translateY(-50%) scale(1.1)';
    });

    exportButton.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '#007bff';
        this.style.transform = 'translateY(-50%) scale(1)';
    });

    // Responsive styles using CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 600px) {
            #ai-chat-export-btn {
                width: 35px !important;
                height: 35px !important;
                font-size: 14px !important;
                right: 8px !important;
            }
        }

        @media (max-width: 400px) {
            #ai-chat-export-btn {
                width: 30px !important;
                height: 30px !important;
                font-size: 12px !important;
                right: 5px !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Append the button to the body
    document.body.appendChild(exportButton);

    // Add click event to the button
    exportButton.addEventListener('click', function () {
        // Add click animation
        this.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 100);

        exportChats(false);
    });

    // Start the auto-export monitoring
    // Wait a bit for the page to fully load
    setTimeout(startAutoExportCheck, 3000);
})();