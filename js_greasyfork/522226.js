// ==UserScript==
// @name         YouTube Tab Title Improver Extreme Deluxe
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MIT
// @description  Adds channel names as prefixes to YouTube video titles and formats playlist titles better. Adds video length. Makes it easier to understand YouTube Sidebery tabs.
// @author
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/522226/YouTube%20Tab%20Title%20Improver%20Extreme%20Deluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/522226/YouTube%20Tab%20Title%20Improver%20Extreme%20Deluxe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------
    // 1. SETTINGS + MENU FUNCTIONS
    // -----------------------------

    // Default settings
    const settings = {
        removeNotificationCounter: true,
        addChannelName: true,
        addVideoLength: true
    };

    // Load settings from storage or use defaults
    const userSettings = GM_getValue('userSettings', settings);

    function saveSettings(newSettings) {
        GM_setValue('userSettings', newSettings);
    }

    function editSettings() {
        const menu = `Edit Settings:\n
1. Remove notification counter: ${userSettings.removeNotificationCounter ? 'ON' : 'OFF'}\n
2. Add channel name: ${userSettings.addChannelName ? 'ON' : 'OFF'}\n
3. Add video length: ${userSettings.addVideoLength ? 'ON' : 'OFF'}\n\nEnter the number to toggle:`;

        const choice = prompt(menu);

        if (choice === '1') {
            userSettings.removeNotificationCounter = !userSettings.removeNotificationCounter;
        } else if (choice === '2') {
            userSettings.addChannelName = !userSettings.addChannelName;
        } else if (choice === '3') {
            userSettings.addVideoLength = !userSettings.addVideoLength;
        } else {
            alert('Invalid choice. Please try again.');
            return;
        }

        saveSettings(userSettings);
        alert('Settings updated!');
    }

    GM_registerMenuCommand('Edit Script Settings', editSettings);

    // Load the channel name map from storage or use default values
    const defaultChannelNameMap = {
        'Digital Foundry': 'DF',
        'Kurzgesagt – In a Nutshell': 'Kurzgesagt'
    };

    const channelNameMap = GM_getValue('channelNameMap', defaultChannelNameMap);

    function saveChannelNameMap(newMap) {
        GM_setValue('channelNameMap', newMap);
    }

    function editChannelNameMap() {
        const keys = Object.keys(channelNameMap);
        const values = Object.values(channelNameMap);

        let menu = 'Edit Channel Name Substitutions:\n';
        keys.forEach((key, index) => {
            menu += `${index + 1}. ${key} -> ${values[index]}\n`;
        });
        menu += '\nEnter the number of the channel to edit, or type "add" to add a new substitution, or "delete" to remove one:';

        const userChoice = prompt(menu);

        if (userChoice === "add") {
            const newKey = prompt("Enter the full channel name:");
            const newValue = prompt("Enter the short name or abbreviation:");

            if (newKey && newValue) {
                channelNameMap[newKey] = newValue;
                saveChannelNameMap(channelNameMap);
                alert("Channel added successfully!");
            } else {
                alert("Invalid input. Please try again.");
            }
        } else if (userChoice === "delete") {
            const deleteKey = prompt("Enter the full channel name to delete:");

            if (deleteKey && channelNameMap[deleteKey]) {
                delete channelNameMap[deleteKey];
                saveChannelNameMap(channelNameMap);
                alert("Channel removed successfully!");
            } else {
                alert("Channel not found. Please try again.");
            }
        } else if (!isNaN(userChoice) && userChoice > 0 && userChoice <= keys.length) {
            const index = parseInt(userChoice) - 1;
            const selectedKey = keys[index];
            const newValue = prompt(`Enter a new short name for "${selectedKey}" (currently "${values[index]}"):`);

            if (newValue) {
                channelNameMap[selectedKey] = newValue;
                saveChannelNameMap(channelNameMap);
                alert("Channel updated successfully!");
            } else {
                alert("Invalid input. Please try again.");
            }
        } else {
            alert("Invalid choice. Please try again.");
        }
    }

    GM_registerMenuCommand('Edit Channel Name Substitutions', editChannelNameMap);


    // ---------------------------------
    // 2. GET VIDEO INFO FROM JSON-LD
    // ---------------------------------
    /**
     * Attempts to parse the JSON-LD from the <script type="application/ld+json">
     * found inside "#microformat player-microformat-renderer".
     * Returns an object like:
     *  {
     *    name: "Video Title",
     *    author: "Channel Name",
     *    duration: "PT542S"  // ISO 8601
     *  }
     * or null if not found/failed.
     */
    function getVideoInfoFromJSONLD() {
        const scriptTag = document.querySelector(
          '#microformat player-microformat-renderer > script[type="application/ld+json"]'
        );
        if (scriptTag) {
            try {
                const data = JSON.parse(scriptTag.textContent);
                // We'll only return the fields we actually use:
                return {
                    name:    data.name || '',
                    author:  data.author || '',
                    // e.g. "PT542S"
                    duration: data.duration || ''
                };
            } catch (err) {
                console.error('JSON parse error:', err);
            }
        }
        return null;
    }


    // --------------------------------
    // 3. CORE LOGIC: MODIFY TITLES
    // --------------------------------

    // Converts an ISO 8601 duration (e.g. "PT542S") into something like "9:02"
    // If you prefer to keep using the .ytp-time-duration from the player, skip this function.
    function parseIsoDuration(isoDuration) {
        // Quick-and-dirty parse for "PT#M#S" or "PT#S" or "PT#H#M#S" etc.
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '';

        let hours   = parseInt(match[1] || '0', 10);
        let minutes = parseInt(match[2] || '0', 10);
        let seconds = parseInt(match[3] || '0', 10);

        let result = '';
        if (hours > 0) {
            result += hours + ':';
            // pad minutes if < 10
            result += minutes < 10 ? '0' + minutes : minutes;
            result += ':';
            // pad seconds if < 10
            result += seconds < 10 ? '0' + seconds : seconds;
        } else {
            // just minutes:seconds
            result += minutes + ':';
            result += seconds < 10 ? '0' + seconds : seconds;
        }
        return result;
    }

    function modifyVideoTitle() {
        const info = getVideoInfoFromJSONLD();
        if (!info) {
            // No JSON-LD found? YouTube might be in a weird state, or
            // the page hasn't loaded that script yet. We'll skip for now.
            return;
        }

        // Extract from JSON
        let videoTitle = (info.name || '').trim();
        let originalChannelName = (info.author || '').trim();

        // If the "author" is sometimes an object, you may need something like:
        //   originalChannelName = typeof info.author === 'object' ? info.author.name : info.author;
        // But in your example, "author" is just "Max Fosh".

        // Possibly read the actual rendered video length from .ytp-time-duration
        // This is the official YouTube overlay. If we rely on the ISO parse, skip this.
        // We'll do it your old way:
        const videoLengthElement = document.querySelector('.ytp-time-duration');
        let finalLength = '';
        if (userSettings.addVideoLength && videoLengthElement) {
            finalLength = videoLengthElement.textContent.trim();
        }

        // Or you can parse the ISO for a guaranteed result, even if not playing yet:
        // let finalLength = parseIsoDuration(info.duration);

        // Let user’s short channel name override the original
        const shortChannelName = channelNameMap[originalChannelName] || originalChannelName;

        // Add channel name as prefix
        if (userSettings.addChannelName && shortChannelName) {
            const prefix = `${shortChannelName} - `;
            if (!videoTitle.startsWith(prefix)) {
                videoTitle = prefix + videoTitle;
            }
        }

        // Add video length at the end
        if (userSettings.addVideoLength && finalLength) {
            if (!videoTitle.endsWith(` (${finalLength})`)) {
                videoTitle += ` (${finalLength})`;
            }
        }

        // Remove notification counter (e.g. (3) ) if enabled
        if (userSettings.removeNotificationCounter) {
            videoTitle = videoTitle.replace(/^\(\d+\)\s*/, '');
        }

        // Finally, set the document title
        if (document.title !== videoTitle) {
            document.title = videoTitle;
        }
    }

    // (Optional) old function to modify playlist title (unchanged for now)
    function modifyPlaylistTitle() {
        const playlistTitleSelector = 'h1.title.style-scope.ytd-playlist-header-renderer yt-formatted-string';
        const channelNameSelector = '.yt-simple-endpoint.style-scope.yt-formatted-string';

        const playlistTitleElement = document.querySelector(playlistTitleSelector);
        const channelNameElement = document.querySelector(channelNameSelector);

        if (playlistTitleElement && channelNameElement) {
            const playlistTitle = playlistTitleElement.textContent.trim();
            let channelName = channelNameElement.textContent.trim();
            channelName = channelName.replace(/^[^\w\s]*\s*/, '').trim();

            const newTitle = `${playlistTitle} - ${channelName}`;

            if (userSettings.removeNotificationCounter) {
                document.title = document.title.replace(/^\(\d+\)\s*/, '');
            }
            if (document.title !== newTitle) {
                document.title = newTitle;
            }
        }
    }

    // Decides which function to use based on URL
    function detectAndModifyTitle() {
        const url = window.location.href;
        if (url.includes('playlist')) {
            modifyPlaylistTitle();
        } else if (url.includes('watch')) {
            modifyVideoTitle();
        }
    }

    // -----------------------------
    // 4. DEBOUNCING HELPER
    // -----------------------------
    function debounce(fn, delay) {
        let timeoutID;
        return function(...args) {
            if (timeoutID) clearTimeout(timeoutID);
            timeoutID = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const debouncedDetectAndModifyTitle = debounce(detectAndModifyTitle, 300);

    // -----------------------------
    // 5. OBSERVERS & EVENT HOOKS
    // -----------------------------

    // (A) Broad observer on <ytd-app> to detect major DOM changes
    function initObserver() {
        const targetNode = document.querySelector('ytd-app');

        if (!targetNode) {
            console.log('ytd-app not found. Retrying in 1 second...');
            setTimeout(initObserver, 1000);
            return;
        }

        const observerConfig = {
            childList: true,
            subtree: true
        };

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    debouncedDetectAndModifyTitle();
                    break;
                }
            }
        });

        observer.observe(targetNode, observerConfig);
        console.log('Broad MutationObserver initialized on <ytd-app>.');
    }

    // (B) More specific observer: watch the microformat script area
    //     If YouTube updates the JSON-LD for queued videos, we can catch it.
    function initMicroformatObserver() {
        const microformatContainer = document.querySelector('#microformat player-microformat-renderer');
        if (!microformatContainer) {
            console.log('Microformat container not found. Retrying in 1 second...');
            setTimeout(initMicroformatObserver, 1000);
            return;
        }

        const observerConfig = {
            childList: true,
            subtree: true,
            characterData: true
        };

        const observer = new MutationObserver(() => {
            debouncedDetectAndModifyTitle();
        });

        observer.observe(microformatContainer, observerConfig);
        console.log('Observer initialized on the microformat container.');
    }

    // (C) Listen for history changes (SPA navigation)
    function listenForHistoryChanges() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            debouncedDetectAndModifyTitle();
        });

        console.log('History change listeners set up.');
    }

    // -----------------------------
    // 6. INITIALIZATION
    // -----------------------------
    function initialize() {
        initObserver();             // broad observer on <ytd-app>
        initMicroformatObserver();  // observer on the JSON-LD microformat area
        listenForHistoryChanges();
        detectAndModifyTitle();     // Initial run
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})();