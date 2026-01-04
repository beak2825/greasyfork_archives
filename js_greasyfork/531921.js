// ==UserScript==
// @name           Dreadcast Dynamic Messages V1
// @namespace      http://tampermonkey.net/
// @version        1.9.2
// @description    Messagerie dynamique
// @author         Laïn
// @match          https://www.dreadcast.net/Main*
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @grant          GM_info
// @downloadURL https://update.greasyfork.org/scripts/531921/Dreadcast%20Dynamic%20Messages%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/531921/Dreadcast%20Dynamic%20Messages%20V1.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // --- Global Variables & Constants ---
    let MY_NAME = null;
    const ACTIVE_CONVERSATIONS = {}; // Stores { customWindow, originalWindow, latestMessageId, oldestMessageId, allMessagesLoaded, isLoadingOlder, participants, hasUnreadNotification, muteTimerIntervalId, unreadSeparatorVisible }
    let openingMutedOverride = null;
    let openingMutedOverrideTimer = null;
    const INITIAL_LOAD_COUNT = 10;
    const LOAD_MORE_COUNT = 10;
    // Click simulation delays
    const REFIND_DELAY = 50;
    const UI_CLICK_DELAY = 50;
    const UI_WAIT_DELAY = 100;
    const WAIT_FOR_ELEMENT_TIMEOUT = 1500;
    const NOTIFICATION_SOUND_URL = 'https://opengameart.org/sites/default/files/audio_preview/GUI%20Sound%20Effects_031.mp3.ogg';
    const UNOPENED_NOTIFICATION_SOUND_URL = 'https://orangefreesounds.com/wp-content/uploads/2020/10/Simple-notification-alert.mp3';

    // --- Version Info ---
    const SCRIPT_VERSION = '1.7.7';

    // --- UI Constants ---
    const MIN_WINDOW_WIDTH = 300;
    const MIN_WINDOW_HEIGHT = 200;
    const DEFAULT_THEME_COLOR = '#0b5a9c';
    const GLOBAL_THEME_STORAGE_KEY = 'dmm_theme_color_v1';
    const CONVERSATION_COLORS_STORAGE_KEY = 'dmm_conversation_colors_v2';
    // Notification Colors
    const UNREAD_NOTIFICATION_COLOR = '#cca300';
    const UNREAD_TEXT_COLOR = '#101010';
    const UNREAD_BORDER_COLOR = '#b0891a';
    // Sidebar Mute Highlight Color
    const SIDEBAR_MUTED_COLOR = '#ff6666';
    // Header Constants
    const HEADERS_STORAGE_KEY = 'dmm_message_headers_v1';
    const SELECTED_HEADER_STORAGE_KEY = 'dmm_selected_header_v1';
    const MAX_HEADER_LENGTH = 30;
    const MAX_HEADER_HISTORY = 6;

    // --- Global Sound Mute State ---
    let isGloballyMuted = false;
    const GLOBAL_SOUND_MUTE_STORAGE_KEY = 'dmm_global_sound_mute_v1';
    const GLOBAL_MUTE_BUTTON_ID = 'dmm-global-mute-button';

    // --- Mute Constants & Storage (v3 - Timed Mutes + Selected Duration) ---
    const MUTED_CONVERSATIONS_STORAGE_KEY_V3 = 'dmm_muted_conversations_v3';
    const MUTE_DURATIONS = { // milliseconds, null for forever, 0 for unmute
        UNMUTE: 0,
        TWO_MINUTES: 2 * 60 * 1000,
        FIFTEEN_MINUTES: 15 * 60 * 1000,
        ONE_HOUR: 60 * 60 * 1000,
        FOREVER: null
    };

    // --- Sound Settings ---
    const SOUND_SETTINGS_STORAGE_KEY = 'dmm_sound_settings_v1';
    const DEFAULT_SOUND_SETTINGS = {
        notificationVolume: 0.5,
        unopenedNotificationVolume: 0.5,
        customNotificationUrl: NOTIFICATION_SOUND_URL,
        customUnopenedUrl: UNOPENED_NOTIFICATION_SOUND_URL
    };

    // --- Unread Separator Constants & Cache ---
    const LAST_SEEN_MESSAGE_IDS_STORAGE_KEY = 'dmm_last_seen_message_ids_v1';
    let lastSeenMessageIds = {}; // Cache for loaded IDs
    const UNREAD_SEPARATOR_ID_PREFIX = 'dmm-unread-separator-'; // Prefix for separator ID
    // --- End Unread Separator ---

    // --- Message Cache Constants ---
    const MESSAGE_CACHE_EXPIRY = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    const MESSAGE_CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // Run cleanup every hour

    // --- Message Cache ---
    const messageCache = new Map(); // Will store { content, timestamp } objects

    // --- Tooltip Variables ---
    let avatarTooltipElement = null;
    let avatarTooltipTimeout = null;

    // --- Edit Mode Constants & Variables ---
    const EDIT_MODE_TOGGLE_BUTTON_ID = 'dmm-edit-mode-toggle';
    const EDIT_POPUP_ID = 'dmm-edit-popup';
    const CUSTOM_CONVO_DATA_STORAGE_KEY = 'dmm_custom_conv_data_v1';
    let isEditModeActive = false;
    let customConversationData = {}; // Cache for custom titles/images { convId: { title: '...', imageUrl: '...' } }
    // --- End Edit Mode ---


    function getSoundSettings() {
        try {
            const stored = localStorage.getItem(SOUND_SETTINGS_STORAGE_KEY);
            return stored ? { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SOUND_SETTINGS;
        } catch (e) {
            console.error("DMM Sound: Failed to load sound settings", e);
            return DEFAULT_SOUND_SETTINGS;
        }
    }

    function saveSoundSettings(settings) {
        try {
            localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("DMM Sound: Failed to save sound settings", e);
        }
    }

    function playNotificationSound(isUnopenedNotification = false) {
        const settings = getSoundSettings();
        try {
            const audio = new Audio(
                isUnopenedNotification ? settings.customUnopenedUrl : settings.customNotificationUrl
            );
            audio.volume = isUnopenedNotification ? settings.unopenedNotificationVolume : settings.notificationVolume;
            audio.play().catch(e => {
                console.warn("DMM: Audio playback failed:", e.name, e.message);
            });
        } catch (e) {
            console.error("DMM: Error creating/playing sound:", e);
        }
    }

    // --- Global Sound Mute Utilities ---
    function loadGlobalMuteState() {
        try {
            const storedValue = localStorage.getItem(GLOBAL_SOUND_MUTE_STORAGE_KEY);
            isGloballyMuted = storedValue === 'true'; // localStorage stores strings
        } catch (e) {
            console.error("DMM Global Mute: Failed to load state from localStorage.", e);
            isGloballyMuted = false; // Default to unmuted on error
        }
    }

    function saveGlobalMuteState() {
        try {
            localStorage.setItem(GLOBAL_SOUND_MUTE_STORAGE_KEY, String(isGloballyMuted));
        } catch (e) {
            console.error("DMM Global Mute: Failed to save state to localStorage.", e);
        }
    }

    function updateGlobalMuteButtonAppearance() {
        const button = document.getElementById(GLOBAL_MUTE_BUTTON_ID);
        if (button) {
            if (isGloballyMuted) {
                button.textContent = '🔇';
                button.title = 'Activer les sons du script DMM';
                button.style.textDecoration = 'line-through';
                button.style.opacity = '0.7';
                button.style.fontSize = '1.5em';
            } else {
                button.textContent = '🔈';
                button.title = 'Couper les sons du script DMM';
                button.style.textDecoration = 'none';
                button.style.opacity = '1';
                button.style.fontSize = '1.5em';
            }
        }
    }

    async function createGlobalMuteButton() {
        try {
            const newsDiv = await waitForElement('.news', 5000);
            if (!newsDiv || document.getElementById(GLOBAL_MUTE_BUTTON_ID)) {
                if (!newsDiv) console.warn("DMM Global Mute: '.news' div not found to attach button.");
                return; // Don't add if already exists or target not found
            }

            // Create container for both buttons
            const buttonContainer = document.createElement('span');
            buttonContainer.style.marginLeft = '10px';

            // Create settings button
            const settingsButton = document.createElement('span');
            settingsButton.id = 'dmm-sound-settings-button';
            settingsButton.textContent = '⚙';
            settingsButton.style.cursor = 'pointer';
            settingsButton.style.fontSize = '1.5em';
            settingsButton.style.verticalAlign = 'middle';
            settingsButton.style.marginRight = '5px';
            settingsButton.title = 'Paramètres des sons DMM';

            // Create settings panel
            const settingsPanel = document.createElement('div');
            settingsPanel.className = 'dmm-sound-settings-panel';
            settingsPanel.style.display = 'none';
            settingsPanel.innerHTML = `
                <div style="padding: 10px;">
                    <h4>Paramètres des Sons</h4>
                    <div class="setting-group">
                        <label>Volume notification (fenêtre ouverte):</label>
                        <input type="range" id="dmm-notification-volume" min="0" max="1" step="0.1">
                        <button class="test-sound-btn" data-type="notification">Test</button>
                    </div>
                    <div class="setting-group">
                        <label>Volume notification (fenêtre fermée):</label>
                        <input type="range" id="dmm-unopened-volume" min="0" max="1" step="0.1">
                        <button class="test-sound-btn" data-type="unopened">Test</button>
                    </div>
                    <div class="setting-group">
                        <label>URL son notification (ouverte):</label>
                        <input type="text" id="dmm-notification-url">
                        <button class="reset-url-btn" data-type="notification">Reset</button>
                    </div>
                    <div class="setting-group">
                        <label>URL son notification (fermée):</label>
                        <input type="text" id="dmm-unopened-url">
                        <button class="reset-url-btn" data-type="unopened">Reset</button>
                    </div>
                </div>
            `;

            // Add styles for settings panel
            GM_addStyle(`
                .dmm-sound-settings-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #2a2a2a;
                    border: 1px solid #444;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    z-index: 9999999999;
                    min-width: 300px;
                }
                .dmm-sound-settings-panel h4 {
                    margin: 0 0 10px 0;
                    color: #fff;
                    text-align: center;
                }
                .setting-group {
                    margin-bottom: 10px;
                }
                .setting-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #ccc;
                }
                .setting-group input[type="range"] {
                    width: 80%;
                    vertical-align: middle;
                }
                .setting-group input[type="text"] {
                    width: 80%;
                    padding: 4px;
                    margin-bottom: 5px;
                    background: #333;
                    border: 1px solid #555;
                    color: #fff;
                }
                .test-sound-btn, .reset-url-btn {
                    padding: 2px 8px;
                    margin-left: 5px;
                    background: #444;
                    border: 1px solid #666;
                    color: #fff;
                    cursor: pointer;
                    border-radius: 3px;
                }
                .test-sound-btn:hover, .reset-url-btn:hover {
                    background: #555;
                }
            `);

            // Initialize settings panel with saved values
            const settings = getSoundSettings();
            const notificationVolume = settingsPanel.querySelector('#dmm-notification-volume');
            const unopenedVolume = settingsPanel.querySelector('#dmm-unopened-volume');
            const notificationUrl = settingsPanel.querySelector('#dmm-notification-url');
            const unopenedUrl = settingsPanel.querySelector('#dmm-unopened-url');

            notificationVolume.value = settings.notificationVolume;
            unopenedVolume.value = settings.unopenedNotificationVolume;
            notificationUrl.value = settings.customNotificationUrl;
            unopenedUrl.value = settings.customUnopenedUrl;

            // Event handlers for settings panel
            settingsButton.addEventListener('click', () => {
                settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
            });

            // Save settings changes
            [notificationVolume, unopenedVolume, notificationUrl, unopenedUrl].forEach(input => {
                input.addEventListener('change', () => {
                    const newSettings = {
                        notificationVolume: parseFloat(notificationVolume.value),
                        unopenedNotificationVolume: parseFloat(unopenedVolume.value),
                        customNotificationUrl: notificationUrl.value,
                        customUnopenedUrl: unopenedUrl.value
                    };
                    saveSoundSettings(newSettings);
                });
            });

            // Test sound buttons
            settingsPanel.querySelectorAll('.test-sound-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    const settings = getSoundSettings();
                    const audio = new Audio(
                        type === 'notification' ? settings.customNotificationUrl : settings.customUnopenedUrl
                    );
                    audio.volume = type === 'notification' ? settings.notificationVolume : settings.unopenedNotificationVolume;
                    audio.play().catch(e => console.warn('DMM Sound Test: Playback failed:', e));
                });
            });

            // Reset URL buttons
            settingsPanel.querySelectorAll('.reset-url-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const type = btn.dataset.type;
                    const input = settingsPanel.querySelector(`#dmm-${type}-url`);
                    input.value = type === 'notification' ? NOTIFICATION_SOUND_URL : UNOPENED_NOTIFICATION_SOUND_URL;
                    input.dispatchEvent(new Event('change'));
                });
            });

            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!settingsPanel.contains(e.target) && e.target !== settingsButton) {
                    settingsPanel.style.display = 'none';
                }
            });

            // Create mute button (existing code)
            const muteButton = document.createElement('span');
            muteButton.id = GLOBAL_MUTE_BUTTON_ID;
            muteButton.style.cursor = 'pointer';
            muteButton.style.marginLeft = '10px'; // Space after news link
            muteButton.style.fontSize = '1em'; // Adjust size if needed
            muteButton.style.verticalAlign = 'middle'; // Align with text
            muteButton.style.zIndex = '9999999999'; // Very high z-index
            muteButton.style.position = 'relative'; // Needed for z-index to reliably apply vs static elements

            muteButton.addEventListener('click', () => {
                isGloballyMuted = !isGloballyMuted;
                saveGlobalMuteState();
                updateGlobalMuteButtonAppearance();
            });

            // Insert the button after the news div
            buttonContainer.appendChild(settingsButton);
            buttonContainer.appendChild(muteButton);
            newsDiv.insertAdjacentElement('afterend', buttonContainer);
            document.body.appendChild(settingsPanel);

            // Set initial appearance based on loaded state
            updateGlobalMuteButtonAppearance();

        } catch (error) {
            console.error("DMM Global Mute: Error creating or attaching global mute button:", error);
        }
    }
    // --- End Global Sound Mute Utilities ---

    // --- Header Management Functions ---
    function getHeaderHistory() {
        try {
            const stored = localStorage.getItem(HEADERS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("DMM: Failed to parse header history", e);
            return [];
        }
    }

    function addHeaderToHistory(header) {
        if (!header || header.length > MAX_HEADER_LENGTH) return;
        let headers = getHeaderHistory();
        // Remove if exists (to move to front)
        headers = headers.filter(h => h !== header);
        // Add to front
        headers.unshift(header);
        // Keep only MAX_HEADER_HISTORY entries
        headers = headers.slice(0, MAX_HEADER_HISTORY);
        try {
            localStorage.setItem(HEADERS_STORAGE_KEY, JSON.stringify(headers));
        } catch (e) {
            console.error("DMM: Failed to save header history", e);
        }
    }

    function getSelectedHeader() {
        return localStorage.getItem(SELECTED_HEADER_STORAGE_KEY) || '';
    }

    function setSelectedHeader(header) {
        if (header) {
            localStorage.setItem(SELECTED_HEADER_STORAGE_KEY, header);
        } else {
            localStorage.removeItem(SELECTED_HEADER_STORAGE_KEY);
        }
    }

    function updateHeaderHistory() {
        const headerPanel = document.querySelector('.header-panel');
        if (!headerPanel) return;

        const historyList = headerPanel.querySelector('.header-history-list');
        if (!historyList) return;

        const headers = getHeaderHistory();
        const selectedHeader = getSelectedHeader();

        // Clear existing list
        historyList.innerHTML = '';

        // Add each header to the list
        headers.forEach(header => {
            const item = document.createElement('div');
            item.classList.add('header-history-item');
            if (header === selectedHeader) {
                item.classList.add('selected');
            }
            item.textContent = header;
            item.dataset.header = header;
            historyList.appendChild(item);
        });

        // If empty, show placeholder
        if (headers.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.classList.add('header-history-item');
            placeholder.style.fontStyle = 'italic';
            placeholder.style.color = '#666';
            placeholder.textContent = 'Aucun entête enregistré';
            historyList.appendChild(placeholder);
        }
    }

    // --- End Header Management Functions ---

    // --- Mute Utilities ---
    function getMutedData() {
        try {
            let stored = localStorage.getItem(MUTED_CONVERSATIONS_STORAGE_KEY_V3);
            if (!stored) {
                 stored = '{}';
            }

            const parsed = JSON.parse(stored);
            // Basic validation: ensure it's an object
            return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) ? parsed : {};
        } catch (e) {
            console.error("DMM: Failed to parse muted conversation data (v3) from localStorage.", e);
            return {}; // Return empty object on error
        }
    }

    function saveMutedData(muteDataObject) {
        if (typeof muteDataObject !== 'object' || muteDataObject === null || Array.isArray(muteDataObject)) {
             console.error("DMM SaveMutedData: Attempted to save non-object:", muteDataObject);
             return;
        }
        try {
            localStorage.setItem(MUTED_CONVERSATIONS_STORAGE_KEY_V3, JSON.stringify(muteDataObject));
        } catch (e) {
            console.error("DMM: Failed to save muted conversation data (v3) to localStorage.", e);
        }
    }

    // Checks if a conversation is *currently* muted, cleans up expired entries AND updates sidebar UI
    function isConversationMuted(conversationId) {
        const idStr = String(conversationId);
        if (!idStr) return false;

        let mutedData = getMutedData();
        const entry = mutedData[idStr];
        let isCurrentlyMuted = false;
        let dataNeedsSaving = false;
        let needsSidebarUpdate = false;

        if (entry && typeof entry === 'object') {
            const endTime = entry.muteEndTime;
            if (endTime === null) { // Permanent mute
                isCurrentlyMuted = true;
            } else if (typeof endTime === 'number' && endTime > 0) {
                if (Date.now() < endTime) { // Timed mute still active
                    isCurrentlyMuted = true;
                } else {
                    // Mute expired! Clean up.
                    delete mutedData[idStr];
                    dataNeedsSaving = true;
                    isCurrentlyMuted = false;
                    needsSidebarUpdate = true;
                }
            } else {
                // Invalid entry (missing endTime or invalid type), clean up
                delete mutedData[idStr];
                dataNeedsSaving = true;
                isCurrentlyMuted = false;
                needsSidebarUpdate = true; // Trigger sidebar update on cleanup
            }
        } else {
             // No entry or invalid entry type
             if (entry) { // If entry existed but was invalid type
                 delete mutedData[idStr];
                 dataNeedsSaving = true;
                 needsSidebarUpdate = true; // Trigger sidebar update on cleanup
             }
             isCurrentlyMuted = false;
        }

        if (dataNeedsSaving) {
            saveMutedData(mutedData);
        }

        if (needsSidebarUpdate) { // NEW: Update sidebar if status changed due to expiry/cleanup
            updateSidebarMuteStatus(idStr);
        }

        return isCurrentlyMuted;
    }

    // Gets the current mute end time (null for permanent, 0 if not muted/expired, timestamp otherwise)
    function getConversationMuteEndTime(conversationId) {
         const idStr = String(conversationId);
         if (!idStr) return 0; // Treat as not muted

         let mutedData = getMutedData();
         const entry = mutedData[idStr];

         if (entry && typeof entry === 'object') {
             const endTime = entry.muteEndTime;
             if (endTime === null) {
                 return null; // Permanent
             } else if (typeof endTime === 'number' && endTime > 0) {
                 if (Date.now() < endTime) {
                     return endTime; // Active timed mute
                 } else {
                     // Expired, trigger potential cleanup and return 0
                      isConversationMuted(idStr); // Trigger cleanup side-effect (which now also updates sidebar)
                      return 0; // Treat as not muted
                 }
             }
         }
         // No valid entry or expired
         return 0; // Treat as not muted
    }

    // Gets the originally selected mute duration (used for checkmarks)
    function getConversationMuteSelectedDuration(conversationId) {
        const idStr = String(conversationId);
        if (!idStr) return MUTE_DURATIONS.UNMUTE; // Treat as unmuted

        const mutedData = getMutedData();
        const entry = mutedData[idStr];

        // First, check if it's *currently* muted at all
        if (!isConversationMuted(idStr)) {
            return MUTE_DURATIONS.UNMUTE; // Return Unmute duration if not currently muted
        }

        // If muted, retrieve the stored selected duration
        if (entry && typeof entry === 'object' && (typeof entry.selectedDuration === 'number' || entry.selectedDuration === null)) {
            return entry.selectedDuration;
        }

        // Fallback if data is somehow inconsistent (shouldn't happen with proper saving)
        // Try to infer based on endTime
        const endTime = entry?.muteEndTime;
        if (endTime === null) return MUTE_DURATIONS.FOREVER;
        // Cannot reliably infer timed duration, default to Unmute status display
        return MUTE_DURATIONS.UNMUTE;
    }


    // Sets mute status AND updates sidebar UI
    function setConversationMuted(conversationId, durationMs) {
        const idStr = String(conversationId);
        if (!idStr) return;

        let mutedData = getMutedData();
        let needsSave = false;
        const wasPreviouslyMuted = isConversationMuted(idStr); // Check *before* changing

        if (durationMs === MUTE_DURATIONS.UNMUTE) {
            if (mutedData[idStr]) {
                delete mutedData[idStr];
                needsSave = true;
            }
        } else if (durationMs === MUTE_DURATIONS.FOREVER) { // Mute forever
             if (!mutedData[idStr] || mutedData[idStr]?.muteEndTime !== null || mutedData[idStr]?.selectedDuration !== durationMs) {
                mutedData[idStr] = { muteEndTime: null, selectedDuration: MUTE_DURATIONS.FOREVER }; // Store duration
                needsSave = true;
             }
        } else if (typeof durationMs === 'number' && durationMs > 0) {
            const endTime = Date.now() + durationMs;
            // Update only if end time or selected duration changes
            if (!mutedData[idStr] || mutedData[idStr]?.muteEndTime !== endTime || mutedData[idStr]?.selectedDuration !== durationMs) {
                mutedData[idStr] = { muteEndTime: endTime, selectedDuration: durationMs }; // Store duration
                needsSave = true;
            }
        } else {
        }

        if (needsSave) {
             saveMutedData(mutedData);
        }

        const isNowMuted = isConversationMuted(idStr); // Check *after* changing

        // --- Trigger UI Updates ---
        // 1. Update DMM Window (Header, Menu Checkmarks/Timers, Theme)
        const convData = ACTIVE_CONVERSATIONS[idStr];
        if (convData?.customWindow && document.body.contains(convData.customWindow)) {
             updateHeaderMuteStatus(convData.customWindow, idStr);
             updateMuteOptionsUI(convData.customWindow, idStr);
             applyCurrentTheme(convData.customWindow, idStr);
        }

        // 2. Update Sidebar List Item (if status changed)
        if (wasPreviouslyMuted !== isNowMuted || needsSave) { // Update if status flipped or if save happened (covers initial mute)
             updateSidebarMuteStatus(idStr);
        }
    }
    // --- End Mute Utilities (v3 + Sidebar Update Trigger) ---

    // --- Sidebar Mute UI Update Functions ---
    /**
     * Updates the visual style of a conversation item in the main message list (#liste_messages)
     * based on its current mute status.
     * @param {string} conversationId The ID of the conversation.
     */
    function updateSidebarMuteStatus(conversationId) {
        const listItem = document.getElementById(`message_${conversationId}`);
        if (!listItem) {
            return; // Element not visible (e.g., different folder) or doesn't exist
        }

        const titleElement = listItem.querySelector('.message_titre');
        if (!titleElement) {
            return;
        }

        const currentlyMuted = isConversationMuted(conversationId); // Use the function that handles expiry checks

        if (currentlyMuted) {
            listItem.classList.add('dmm-muted-sidebar-item');
        } else {
            listItem.classList.remove('dmm-muted-sidebar-item');
        }
    }

    /**
     * Scans all visible message list items in the sidebar and updates their mute status highlighting.
     * Should be called on initial load and when the list content changes significantly.
     */
    function scanAndUpdateSidebarMutes() {
        const messageListItems = document.querySelectorAll('#liste_messages li.message[id^="message_"]');
        messageListItems.forEach(item => {
            const conversationId = item.id.replace('message_', '');
            if (conversationId) {
                // Existing mute status update
                updateSidebarMuteStatus(conversationId);

                // Apply customizations (NEW)
                applyCustomizationsToItem(item);

                // Apply edit mode visuals if active (NEW)
                if (isEditModeActive) {
                    item.classList.add('dmm-editable-item');
                    item.title = 'Cliquer pour éditer le titre/image';
                }
            }
        });
    }
    // --- End Sidebar Mute UI Update Functions ---


    // --- Mute UI Update Functions ---
    /**
     * Updates the mute status display in the chat window header.
     * @param {HTMLElement} chatWindow - The custom chat window element.
     * @param {string} conversationId - The ID of the conversation.
     */
    function updateHeaderMuteStatus(chatWindow, conversationId) {
        if (!chatWindow || !document.body.contains(chatWindow)) return;

        const muteStatusDisplay = chatWindow.querySelector('.custom-chat-head .mute-status-display');
        if (!muteStatusDisplay) return;

        const endTime = getConversationMuteEndTime(conversationId); // null (forever), 0 (unmuted), or timestamp

        if (endTime === null) { // Permanent mute
            muteStatusDisplay.textContent = '🔈 Muted';
            muteStatusDisplay.style.display = 'inline-block';
            muteStatusDisplay.title = 'Cette conversation est muette de façon permanente.';
        } else if (endTime > 0) { // Timed mute active (endTime is a future timestamp)
            const now = Date.now();
            if (endTime > now) {
                const remainingSeconds = Math.round((endTime - now) / 1000);
                const remainingMinutes = Math.ceil(remainingSeconds / 60);

                if (remainingMinutes > 1) {
                    muteStatusDisplay.textContent = `🔈 ${remainingMinutes} min`;
                    muteStatusDisplay.title = `Muet pour encore ${remainingMinutes} minutes (jusqu'à ${new Date(endTime).toLocaleTimeString()}).`;
                } else if (remainingSeconds > 0) {
                    muteStatusDisplay.textContent = '🔈 <1 min';
                    muteStatusDisplay.title = `Muet pour moins d'une minute (jusqu'à ${new Date(endTime).toLocaleTimeString()}).`;
                } else {
                    // Should technically be caught by getConversationMuteEndTime returning 0, but safe fallback
                    muteStatusDisplay.style.display = 'none';
                    muteStatusDisplay.textContent = '';
                    muteStatusDisplay.title = '';
                }
                 muteStatusDisplay.style.display = 'inline-block';
            } else {
                // Mute just expired, hide display (isConversationMuted will handle cleanup later)
                muteStatusDisplay.style.display = 'none';
                muteStatusDisplay.textContent = '';
                muteStatusDisplay.title = '';
            }
        } else { // Not muted (endTime is 0 or invalid)
            muteStatusDisplay.style.display = 'none';
            muteStatusDisplay.textContent = '';
            muteStatusDisplay.title = '';
        }
    }

    /**
     * Updates the checkmarks, styles, and timer display for mute options in the menu.
     * @param {HTMLElement} chatWindow - The custom chat window element containing the menu.
     * @param {string} conversationId - The ID of the conversation.
     */
    function updateMuteOptionsUI(chatWindow, conversationId) { // <<< MODIFIED >>>
        if (!chatWindow || !document.body.contains(chatWindow)) return;

        const muteOptionsContainer = chatWindow.querySelector('.more-opts-menu .mute-options-container');
        if (!muteOptionsContainer) return;

        const currentEndTime = getConversationMuteEndTime(conversationId); // null (forever), 0 (unmuted), or timestamp
        const currentlySelectedDuration = getConversationMuteSelectedDuration(conversationId); // 0, null, or duration ms
        const isTimedMuteActive = typeof currentEndTime === 'number' && currentEndTime > 0;

        muteOptionsContainer.querySelectorAll('.mute-option-item').forEach(item => {
            const checkmark = item.querySelector('.checkmark');
            const textSpan = item.querySelector('.item-text'); // Get the text span
            if (!checkmark || !textSpan) return;

            const itemDurationStr = item.dataset.duration;
            let itemDuration;
            if (itemDurationStr === 'null') itemDuration = null;
            else itemDuration = parseInt(itemDurationStr, 10);

            // --- Restore Original Label ---
            // Store original label if not already stored
            if (!item.dataset.originalLabel) {
                item.dataset.originalLabel = textSpan.textContent;
            }
            // Always reset to original label before adding timer or checkmark styling
            textSpan.textContent = item.dataset.originalLabel;

            // --- Reset styles ---
            checkmark.style.display = 'none';
            item.style.fontWeight = 'normal'; // Reset font weight

            // --- Check if this item matches the currently active selection ---
            if (itemDuration === currentlySelectedDuration) {
                checkmark.style.display = 'inline'; // Show checkmark
                item.style.fontWeight = 'bold'; // Optional: make selected bold

                // --- Add Timer Display if this is the ACTIVE TIMED mute ---
                if (isTimedMuteActive && itemDuration === currentlySelectedDuration && typeof itemDuration === 'number' && itemDuration > 0) {
                     const remainingMs = currentEndTime - Date.now();
                     const formattedTime = formatRemainingTime(remainingMs);
                     if (formattedTime) {
                         // Append timer to the (restored) original label
                         textSpan.textContent += ` (${formattedTime})`;
                         item.title = `${item.dataset.originalLabel} (Fin: ${new Date(currentEndTime).toLocaleTimeString()})`; // Update title too
                     } else {
                         // Mute expired just now? Reset title
                         item.title = item.dataset.originalLabel;
                     }
                } else {
                     // Reset title if it's not the active timed mute
                     item.title = item.dataset.originalLabel;
                 }
            } else {
                // Reset title if it's not selected at all
                 item.title = item.dataset.originalLabel;
            }
        }); // --- End forEach item ---

        // Dim "Unmute" if already unmuted
        const unmuteItem = muteOptionsContainer.querySelector('.mute-option-item[data-duration="0"]');
        if (unmuteItem) {
            const isCurrentlyUnmuted = (currentEndTime === 0);
            unmuteItem.style.opacity = isCurrentlyUnmuted ? '0.6' : '1';
            unmuteItem.style.cursor = isCurrentlyUnmuted ? 'default' : 'pointer';

            // Ensure checkmark and bold are correctly applied if Unmute is the "selected" state
             if (isCurrentlyUnmuted && currentlySelectedDuration === MUTE_DURATIONS.UNMUTE) {
                 const unmuteCheckmark = unmuteItem.querySelector('.checkmark');
                 if (unmuteCheckmark) unmuteCheckmark.style.display = 'inline';
                 unmuteItem.style.fontWeight = 'bold'; // Also bold if selected
             }
        }
    } // --- End updateMuteOptionsUI ---
    // --- End Mute UI Update Functions ---


    // --- Observers ---
    let mainObserver = null; // Observes body for added original message windows
    let sidebarObserver = null; // Observes the #liste_messages content UL for changes
    let sidebarScanDebounceTimer = null; // Timer for debouncing sidebar scans

    // --- Utility Functions ---
    function getMyCharacterName() {
        const nameElement = document.getElementById('txt_pseudo');
        if (nameElement) return nameElement.textContent.trim();
        console.error("DMM: #txt_pseudo not found?");
        return null;
    }

    function waitForElement(selector, timeout = WAIT_FOR_ELEMENT_TIMEOUT, container = document) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                try {
                    const element = container.querySelector(selector);
                    // Check visibility more robustly
                    if (element && document.body.contains(element) && element.offsetParent !== null && getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).display !== 'none') {
                        clearInterval(interval);
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new Error(`Element ${selector} not found or not visible within ${timeout}ms`));
                    }
                } catch (e) {
                    clearInterval(interval);
                    reject(new Error(`Error finding element ${selector}: ${e.message}`));
                }
            }, 50);
        });
    }

    /**
     * Formats remaining milliseconds into a user-friendly string.
     * @param {number} ms - Milliseconds remaining.
     * @returns {string} Formatted time string (e.g., "15 min left", "<1 min left").
     */
    function formatRemainingTime(ms) {
        if (ms <= 0) return ""; // No time left or invalid input

        const totalSeconds = Math.round(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);

        if (minutes >= 1) {
            return `${minutes} min`;
        } else if (totalSeconds > 0) {
            return "<1 min";
        } else {
            return ""; // Should already be caught by ms <= 0, but safe fallback
        }
    }

    function bringWindowToFront(window) {
        // Get all DMM windows
        const allWindows = document.querySelectorAll('.custom-chat-window');
        let maxZ = 999999; // Base z-index

        // Find highest current z-index
        allWindows.forEach(w => {
            const z = parseInt(getComputedStyle(w).zIndex) || 0;
            maxZ = Math.max(maxZ, z);
        });

        // Set the clicked window higher than all others
        window.style.zIndex = (maxZ + 1).toString();
    }

    // --- Tooltip Functions ---
    function createAvatarTooltip() {
        if (document.getElementById('dmm-avatar-tooltip')) {
            avatarTooltipElement = document.getElementById('dmm-avatar-tooltip');
            return;
        }
        avatarTooltipElement = document.createElement('div');
        avatarTooltipElement.id = 'dmm-avatar-tooltip';
        document.body.appendChild(avatarTooltipElement);
    }

    function showAvatarTooltip(avatarElement) {
        if (!avatarTooltipElement || !avatarElement) return;

        if (avatarTooltipTimeout) {
            clearTimeout(avatarTooltipTimeout);
            avatarTooltipTimeout = null;
        }

        const avatarSrc = avatarElement.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        if (!avatarSrc) return;

        const avatarRect = avatarElement.getBoundingClientRect();
        const tooltipWidth = 128 + 4;
        const tooltipHeight = 128 + 4;
        const spacing = 5;

        let idealTop = avatarRect.top - tooltipHeight - spacing;
        let idealLeft = avatarRect.left + (avatarRect.width / 2) - (tooltipWidth / 2);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (idealTop < 0) {
            idealTop = avatarRect.bottom + spacing;
        }

        if (idealTop + tooltipHeight > viewportHeight) {
            idealTop = Math.max(0, viewportHeight - tooltipHeight);
        }

        if (idealLeft < 0) {
            idealLeft = 0;
        }

        if (idealLeft + tooltipWidth > viewportWidth) {
            idealLeft = viewportWidth - tooltipWidth;
        }

        if (idealLeft < 0) idealLeft = 0;

        avatarTooltipElement.style.backgroundImage = `url('${avatarSrc}')`;
        avatarTooltipElement.style.top = `${Math.round(idealTop)}px`;
        avatarTooltipElement.style.left = `${Math.round(idealLeft)}px`;
        avatarTooltipElement.style.display = 'block';
    }

    function hideAvatarTooltip(delay = 150) {
        if (avatarTooltipTimeout) return;

        if (avatarTooltipElement) {
            avatarTooltipTimeout = setTimeout(() => {
                avatarTooltipElement.style.display = 'none';
                avatarTooltipElement.style.backgroundImage = '';
                avatarTooltipTimeout = null;
            }, delay);
        }
    }

    // --- Last Seen Message ID Management ---
    function loadLastSeenMessageIds() {
        try {
            const stored = localStorage.getItem(LAST_SEEN_MESSAGE_IDS_STORAGE_KEY);
            lastSeenMessageIds = stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("DMM: Failed to load last seen message IDs", e);
            lastSeenMessageIds = {};
        }
    }

    function saveLastSeenMessageId(conversationId, messageId) {
        if (!conversationId || !messageId) return; // Don't save invalid data
        const currentLatestId = String(messageId); // Ensure it's a string
        if (lastSeenMessageIds[conversationId] !== currentLatestId) {
            lastSeenMessageIds[conversationId] = currentLatestId;
            try {
                localStorage.setItem(LAST_SEEN_MESSAGE_IDS_STORAGE_KEY, JSON.stringify(lastSeenMessageIds));
            } catch (e) {
                console.error("DMM: Failed to save last seen message IDs", e);
            }
        }
    }

    function getLastSeenMessageId(conversationId) {
        return lastSeenMessageIds[conversationId] || null;
    }
    // --- End Last Seen Message ID Management ---


    // --- Theme Color Management ---
    function getSavedGlobalThemeColor() {
        return localStorage.getItem(GLOBAL_THEME_STORAGE_KEY) || DEFAULT_THEME_COLOR;
    }
    function getConversationColors() {
        try {
            const stored = localStorage.getItem(CONVERSATION_COLORS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("DMM: Failed to parse conversation colors from localStorage.", e);
            return {};
        }
    }
    function saveConversationColors(allColors) {
        try {
            localStorage.setItem(CONVERSATION_COLORS_STORAGE_KEY, JSON.stringify(allColors));
        } catch (e) {
            console.error("DMM: Failed to save conversation colors to localStorage.", e);
        }
    }
    function getConversationSetting(conversationId) {
        const allColors = getConversationColors();
        const setting = allColors[conversationId];
        if (setting && typeof setting === 'object' && typeof setting.enabled === 'boolean' && typeof setting.color === 'string') {
            return setting;
        }
        return { enabled: false, color: DEFAULT_THEME_COLOR };
    }
    function setConversationSetting(conversationId, setting) {
        if (typeof setting !== 'object' || typeof setting.enabled !== 'boolean' || typeof setting.color !== 'string') {
            console.warn(`DMM: Invalid setting provided for conversation ${conversationId}:`, setting);
            return;
        }
        const allColors = getConversationColors();
        allColors[conversationId] = setting;
        saveConversationColors(allColors);
    }
    function applyCurrentTheme(chatWindow, conversationId) {
        if (!chatWindow || !conversationId) return;
        const specificSetting = getConversationSetting(conversationId);
        const globalColor = getSavedGlobalThemeColor();
        const effectiveColor = specificSetting.enabled ? specificSetting.color : globalColor;

        // Apply standard theme colors
        chatWindow.style.setProperty('--dmm-primary-color', effectiveColor);
        chatWindow.style.setProperty('--dmm-header-bg', `color-mix(in srgb, ${effectiveColor} 70%, #080808)`);
        chatWindow.style.setProperty('--dmm-button-hover-bg', `color-mix(in srgb, ${effectiveColor} 85%, #ffffff)`);
        chatWindow.style.setProperty('--dmm-bubble-timestamp', `color-mix(in srgb, ${effectiveColor} 40%, #ffffff)`);
        chatWindow.style.setProperty('--dmm-border-color', effectiveColor);
        chatWindow.style.setProperty('--dmm-menu-hover-bg', effectiveColor);
        chatWindow.style.setProperty('--dmm-resize-border', `color-mix(in srgb, ${effectiveColor} 50%, #667788)`);

        // Re-apply notification style if needed (theme change shouldn't clear it)
        const convData = ACTIVE_CONVERSATIONS[conversationId];
        const isMuted = isConversationMuted(conversationId);
        if (convData?.hasUnreadNotification && !isMuted) {
             chatWindow.classList.add('has-unread-notification');
        } else {
             chatWindow.classList.remove('has-unread-notification');
        }
    }
    function saveGlobalThemeColor(newColor) {
        localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, newColor);
        for (const [convId, convData] of Object.entries(ACTIVE_CONVERSATIONS)) {
            if (convData.customWindow && document.body.contains(convData.customWindow)) {
                applyCurrentTheme(convData.customWindow, convId);
            }
        }
    }


    // --- Styles ---
     function addChatStyles() {
         GM_addStyle(`
             /* Styles pour la fenêtre de chat personnalisée */
             .custom-chat-window {
                 --dmm-primary-color: ${DEFAULT_THEME_COLOR}; /* Fallback */
                 --dmm-header-bg: color-mix(in srgb, var(--dmm-primary-color) 70%, #080808);
                 --dmm-button-hover-bg: color-mix(in srgb, var(--dmm-primary-color) 85%, #ffffff);
                 --dmm-bubble-timestamp: color-mix(in srgb, var(--dmm-primary-color) 40%, #ffffff);
                 --dmm-border-color: var(--dmm-primary-color);
                 --dmm-menu-hover-bg: var(--dmm-primary-color);
                 --dmm-resize-border: color-mix(in srgb, var(--dmm-primary-color) 50%, #667788);
                 position: fixed; z-index: 999999; width: 450px; height: 600px;
                 max-height: 95vh; max-width: 95vw; min-width: ${MIN_WINDOW_WIDTH}px; min-height: ${MIN_WINDOW_HEIGHT}px;
                 border: 1px solid var(--dmm-border-color); background-color: #101010; color: #e0e0e0;
                 border-radius: 5px; box-shadow: 0 0 15px color-mix(in srgb, var(--dmm-primary-color) 30%, transparent);
                 display: flex; flex-direction: column; top: 100px; left: calc(50% - 225px);
                 overflow: hidden; transition: max-height 0.3s ease-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Added transitions */
             }
             .custom-chat-head {
                 background-color: var(--dmm-header-bg); color: #fff; padding: 6px 10px; font-weight: bold;
                 border-bottom: 1px solid var(--dmm-border-color); cursor: move; display: flex;
                 justify-content: space-between; align-items: center; border-radius: 5px 5px 0 0;
                 flex-shrink: 0; position: relative;
                 transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-bottom-color 0.3s ease-in-out; /* Add transition for smooth color change */
             }
             /* Style for Unread Notification */
             .custom-chat-window.has-unread-notification {
                border-color: ${UNREAD_BORDER_COLOR}; /* Change main border */
                box-shadow: 0 0 15px color-mix(in srgb, ${UNREAD_NOTIFICATION_COLOR} 40%, transparent); /* Change shadow color */
             }
             .custom-chat-window.has-unread-notification .custom-chat-head {
                 background-color: ${UNREAD_NOTIFICATION_COLOR};
                 color: ${UNREAD_TEXT_COLOR};
                 border-bottom-color: ${UNREAD_BORDER_COLOR};
             }
             .custom-chat-window.has-unread-notification .custom-chat-head .title {
                 color: ${UNREAD_TEXT_COLOR}; /* Ensure title text is dark */
             }
             .custom-chat-window.has-unread-notification .custom-chat-head .controls span {
                 color: #333; /* Darker control icons on yellow */
             }
             .custom-chat-window.has-unread-notification .custom-chat-head .controls span:hover {
                 color: #000; /* Black on hover */
             }
             /* End Unread Notification */

             .custom-chat-head .title { flex-grow: 1; padding-right: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

             /* Styles for Header Mute Status */
             .custom-chat-head .mute-status-display {
                 font-size: 0.9em;
                 color: #ffcc66; /* Light orange/yellow */
                 margin-left: 10px; /* Space after title */
                 font-weight: normal;
                 display: none; /* Hidden by default */
                 vertical-align: middle; /* Align with title text */
                 white-space: nowrap; /* Prevent wrapping */
             }
             /* Unread notification state override for mute status */
              .custom-chat-window.has-unread-notification .custom-chat-head .mute-status-display {
                  color: var(--dmm-primary-color); /* Use theme color on yellow bg for contrast */
              }

             .custom-chat-head .controls { display: flex; align-items: center; flex-shrink: 0; white-space: nowrap; }
             .custom-chat-head .controls span { cursor: pointer; padding: 0 5px; font-size: 1.2em; font-family: Arial, sans-serif; font-weight: bold; user-select: none; line-height: 1; transition: color 0.2s ease; }
             .custom-chat-head .controls span:hover { color: #ffdddd; }
             .custom-chat-content { flex-grow: 1; overflow-y: auto; padding: 10px; background-color: #1a1a1a; display: flex; flex-direction: column; gap: 5px; transition: opacity 0.2s ease-out; }
             .custom-chat-content.loading::after { content: "Chargement des messages..."; display: block; text-align: center; padding: 20px; color: #ccc; font-style: italic; }
             .load-more-container { text-align: center; padding: 8px; border-bottom: 1px solid #2a2a2a; margin-bottom: 5px; flex-shrink: 0; }
             .load-more-link { color: #87ceeb; cursor: pointer; text-decoration: underline; font-size: 0.9em; }
             .load-more-link:hover { color: #aaeebb; }
             .load-more-link.loading { color: #aaa; cursor: default; text-decoration: none; }
             .load-more-link.loading::before { content: "Chargement... "; }
             .chat-bubble { max-width: 80%; padding: 8px 14px; border-radius: 18px; margin-bottom: 4px; line-height: 1.4; word-wrap: break-word; position: relative; }
             .bubble-content { white-space: pre-wrap; /* Changed from pre-wrap to normal for linkification */ }
             /* Style for links within bubbles */
             .bubble-content a { color: #add8e6 !important; /* Light blue, !important to override potential other styles */ text-decoration: underline !important; }
             .bubble-content a:hover { color: #ffeb3b !important; /* Yellow on hover */ }
             .my-bubble .bubble-content a { color: #ffffff !important; /* White link in my bubble */ text-decoration: underline !important; }
             .my-bubble .bubble-content a:hover { color: #ffff00 !important; /* Bright yellow on hover */ }

             /* Avatar styling - UPDATED */
             .their-bubble { display: flex; gap: 8px; }
             .their-bubble .bubble-avatar {
                 width: 28px;
                 height: 28px;
                 border-radius: 4px;
                 margin-top: 2px;
                 position: relative; /* Add for tooltip positioning */
                 background-size: cover;
                 background-position: center;
             }

             .their-bubble .bubble-content-wrapper {
                 flex: 1;
                 min-width: 0; /* Prevent flex item from overflowing */
                 display: flex;
                 flex-direction: column;
             }
             .their-bubble .bubble-header {
                 display: flex;
                 align-items: flex-start;
                 gap: 8px;
                 margin-bottom: 4px;
             }
             .their-bubble .bubble-sender-name {
                 flex: 1;
                 padding-top: 8px;
                 font-size: 0.8em;
                 font-weight: bold;
                 color: #87ceeb;
                 cursor: pointer; /* Show pointer on hover */
                 position: relative; /* For tooltip positioning */
             }

             .my-bubble { background-color: var(--dmm-primary-color); color: #ffffff; align-self: flex-end; border-bottom-right-radius: 5px; transition: background-color 0.3s ease-in-out; }
             .their-bubble { background-color: #3a3a3a; color: #e0e0e0; align-self: flex-start; border-bottom-left-radius: 5px; }

             /* Common header styles for both bubbles */
             .bubble-header {
                 display: flex;
                 align-items: flex-start;
                 gap: 8px;
                 margin-bottom: 4px;
             }
             .bubble-avatar {
                 width: 28px;
                 height: 28px;
                 border-radius: 4px;
                 margin-top: 2px;
                 background-size: cover;
                 background-position: center;
             }
             .bubble-sender-name {
                 flex: 1;
                 padding-top: 8px;
                 font-size: 0.8em;
                 font-weight: bold;
                 cursor: pointer;
                 position: relative;
             }

             /* Specific colors for their/my bubbles */
             .their-bubble .bubble-sender-name {
                 color: #87ceeb; /* Pale blue */
             }
             .my-bubble .bubble-sender-name {
                 color: #87ceeb; /* Blueish */
             }

             .bubble-timestamp { font-size: 0.7em; color: #a0a0a0; display: block; text-align: right; margin-top: 4px; clear: both; }
             .my-bubble .bubble-timestamp { color: var(--dmm-bubble-timestamp); transition: color 0.3s ease-in-out;}
             .custom-chat-reply { padding: 8px; border-top: 1px solid var(--dmm-border-color); background-color: #101010; display: flex; gap: 5px; flex-shrink: 0; transition: opacity 0.2s ease-out, border-color 0.3s ease-in-out; }
             .custom-chat-reply textarea { flex-grow: 1; height: 50px; min-height: 30px; max-height: 150px; padding: 5px; border: 1px solid #333; background-color: #222; color: #ddd; resize: vertical; font-family: inherit; font-size: 0.9em; }
             .custom-chat-reply button { padding: 10px 15px; background-color: var(--dmm-primary-color); color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold; align-self: center; transition: background-color 0.2s ease; }
             .custom-chat-reply button:hover { background-color: var(--dmm-button-hover-bg); }
             .custom-chat-reply button:disabled { background-color: #555; cursor: not-allowed; }
             .hidden-original-databox { position: absolute !important; top: -9999px !important; left: -9999px !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }
             .custom-chat-window.collapsed { max-height: 35px !important; min-height: 35px !important; height: 35px !important; }
             .custom-chat-window.collapsed .custom-chat-content,
             .custom-chat-window.collapsed .custom-chat-reply,
             .custom-chat-window.collapsed .participants-panel,
             .custom-chat-window.collapsed .color-picker-panel,
             .custom-chat-window.collapsed .more-opts-menu,
             .custom-chat-window.collapsed .resize-handle,
             .custom-chat-window.collapsed .mute-status-display { display: none; } /* Hide mute status when collapsed */
             .custom-chat-window.collapsed .custom-chat-head { border-radius: 5px; }
             .custom-chat-head .controls .theme-btn { padding: 0 8px; font-size: 1.1em; margin-right: 5px; font-family: 'Segoe UI Symbol', Arial, sans-serif; }
             .custom-chat-head .controls .participants-btn { padding: 0 8px; font-size: 1.2em; margin-right: 5px; font-family: 'Segoe UI Symbol', Arial, sans-serif; }
             .custom-chat-head .controls .more-opts-btn { padding: 0 8px; font-size: 1.4em; font-weight: bold; margin-right: 5px; font-family: 'Segoe UI Symbol', Arial, sans-serif; }
             .custom-chat-window .more-opts-menu { position: absolute; top: 35px; right: 5px; background-color: #2a2a2a; border: 1px solid var(--dmm-border-color); border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); z-index: 1000001; min-width: 150px; padding: 5px 0; display: none; transition: border-color 0.3s ease-in-out; }
             .custom-chat-window .color-picker-panel { position: absolute; top: 35px; right: 5px; background-color: #2a2a2a; border: 1px solid var(--dmm-border-color); border-radius: 4px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); z-index: 1000001; padding: 10px; display: none; text-align: center; transition: border-color 0.3s ease-in-out; }
             .custom-chat-window .color-picker-panel label { display: block; margin-bottom: 5px; font-size: 0.9em; color: #ccc; }
             .custom-chat-window .color-picker-panel input[type="color"] { cursor: pointer; border: 1px solid #555; width: 50px; height: 30px; padding: 0; background-color: #333; }
             .custom-chat-window .color-picker-panel .reset-color-btn {
                 cursor: pointer;
                 margin-left: 8px;
                 padding-bottom: 15px;
                 font-size: 1em;
                 vertical-align: middle;
                 opacity: 0.8;
             }
             .custom-chat-window .color-picker-panel .reset-color-btn:hover {
                 opacity: 1;
             }
             .custom-chat-window .more-opts-menu .menu-item { padding: 8px 15px; color: #e0e0e0; cursor: pointer; font-size: 0.9em; white-space: nowrap; }
             .custom-chat-window .more-opts-menu .menu-item:hover { background-color: var(--dmm-menu-hover-bg); color: #ffffff; }
             .custom-chat-window .more-opts-menu hr { border: none; border-top: 1px solid #444; margin: 5px 0; }
             /* Style for settings items (color) */
             .custom-chat-window .more-opts-menu .convo-settings-item { display: flex; align-items: center; justify-content: space-between; padding: 6px 15px; font-size: 0.9em; color: #ccc; }
             .custom-chat-window .more-opts-menu .convo-settings-item label { margin-right: 8px; white-space: nowrap; cursor: pointer; }
             .custom-chat-window .more-opts-menu .convo-settings-item input[type="checkbox"] { margin-right: 5px; cursor: pointer; vertical-align: middle; }
             .custom-chat-window .more-opts-menu .convo-settings-item input[type="color"] { cursor: pointer; border: 1px solid #555; width: 35px; height: 20px; padding: 0; background-color: #333; vertical-align: middle; }
             .custom-chat-window .more-opts-menu .convo-settings-item input[type="color"]:disabled { cursor: not-allowed; opacity: 0.5; }

             /* Mute options styling (with checkmark) */
             .custom-chat-window .more-opts-menu .mute-option-item {
                 display: flex; /* Use flexbox for easy alignment */
                 align-items: center;
                 /* Reuse base menu-item padding etc. */
             }
             .custom-chat-window .more-opts-menu .mute-option-item .checkmark {
                 display: none; /* Hidden by default */
                 margin-right: 8px; /* Space between checkmark and text */
                 color: #66ff66; /* Green checkmark */
                 font-weight: bold;
                 font-size: 1.1em;
                 line-height: 1; /* Ensure alignment */
             }
             .custom-chat-window .more-opts-menu .mute-option-item .item-text {
                 flex-grow: 1; /* Allow text to take remaining space */
                 /* Style for timer text within the label */
                 color: #e0e0e0; /* Ensure consistent color */
             }
             /* Style for the timer part specifically if needed (e.g., slightly dimmer) */
             .custom-chat-window .more-opts-menu .mute-option-item .item-text span {
                 /* Example: Make timer slightly dimmer */
                 /* color: #bbb; */
                 /* font-style: italic; */
             }


             /* Participants Panel */
             .participants-panel { position: absolute; top: 0; right: -250px; width: 250px; height: 100%; background-color: rgba(31, 31, 31, 0.95); border-left: 1px solid var(--dmm-border-color); box-shadow: -2px 0 5px rgba(0, 0, 0, 0.4); z-index: 999998; display: flex; flex-direction: column; transition: right 0.3s ease-in-out, border-color 0.3s ease-in-out; overflow: hidden; }
             .participants-panel.active { right: 0; }
             .participants-panel-header { padding: 8px 12px; font-weight: bold; color: #fff; background-color: var(--dmm-header-bg); border-bottom: 1px solid var(--dmm-border-color); flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out; }
             .participants-panel-header .close-panel-btn { font-size: 1.2em; cursor: pointer; padding: 0 5px; }
             .participants-panel-list { padding: 10px; overflow-y: auto; flex-grow: 1; color: #ccc; font-size: 0.9em; line-height: 1.4; }
             .participants-panel-list p { margin: 0; padding: 0; word-break: break-word; }
             .resize-handle { position: absolute; bottom: 0; right: 0; width: 15px; height: 15px; background-color: transparent; border-bottom: 2px solid var(--dmm-resize-border); border-right: 2px solid var(--dmm-resize-border); cursor: nwse-resize; z-index: 1000000; transition: border-color 0.3s ease-in-out; }
             .custom-chat-window.has-unread-notification .resize-handle { /* Optional: Change resize handle color too */
                 border-color: color-mix(in srgb, ${UNREAD_BORDER_COLOR} 50%, #667788);
             }

            /* Sidebar Mute Highlight */
            #liste_messages li.message.dmm-muted-sidebar-item .message_titre {
                color: ${SIDEBAR_MUTED_COLOR} !important; /* Use important to override potential inline styles */
                font-weight: bold; /* Optional: make it bolder */
            }
            #liste_messages li.message.dmm-muted-sidebar-item:hover .message_titre {
                /* Optional: Style on hover if needed */
                 text-decoration: line-through;
            }
            /* Ensure normal color when class is removed */
            #liste_messages li.message:not(.dmm-muted-sidebar-item) .message_titre {
                color: inherit !important; /* Revert to default color */
                font-weight: normal;
                text-decoration: none;
            }

            /* Header Panel */
            .header-panel {
                position: absolute;
                top: 35px;
                right: 5px;
                background-color: #2a2a2a;
                border: 1px solid var(--dmm-border-color);
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                z-index: 1000001;
                padding: 10px;
                display: none;
            }
            .header-input-container {
                display: flex;
                gap: 5px;
                margin-bottom: 10px;
            }
            .header-input-container input {
                flex-grow: 1;
                padding: 5px;
                background: #333;
                border: 1px solid #444;
                color: #fff;
                border-radius: 3px;
            }
            .header-input-container .checkmark-btn {
                cursor: pointer;
                color: #4CAF50;
                font-size: 1.2em;
                display: flex;
                align-items: center;
                padding: 0 5px;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            .header-input-container .checkmark-btn:hover {
                opacity: 1;
            }
            .header-history-list {
                max-height: 150px;
                overflow-y: auto;
            }
            .header-history-item {
                padding: 5px 10px;
                cursor: pointer;
                color: #ccc;
            }
            .header-history-item:hover {
                background-color: var(--dmm-menu-hover-bg);
                color: #fff;
            }
            .header-history-item.selected {
                background-color: var(--dmm-primary-color);
                color: #fff;
            }

            /* Unread Separator Line */ /* <<< NEW STYLE >>> */
             .unread-separator {
                 width: 100%;
                 display: flex;
                 align-items: center;
                 text-align: center;
                 margin: 10px 0;
                 padding: 0 5px; /* Padding inside */
                 box-sizing: border-box; /* Include padding in width */
                 opacity: 1;
                 transition: opacity 1.5s ease-out; /* Add transition */
             }
             .unread-separator.fade-out {
                 opacity: 0;
                 pointer-events: none;
             }
             .unread-separator::before,
             .unread-separator::after {
                 content: '';
                 flex: 1;
                 border-bottom: 1px solid #f06e6e; /* Red line */
             }
             .unread-separator:not(:empty)::before {
                 margin-right: .5em;
             }
             .unread-separator:not(:empty)::after {
                 margin-left: .5em;
             }
             .unread-separator span {
                 color: #f06e6e; /* Red text */
                 font-size: 0.8em;
                 font-weight: bold;
                 padding: 0 5px; /* Space around text */
                 white-space: nowrap;
             }

            /* Tooltip Element */
            #dmm-avatar-tooltip {
                position: fixed;
                width: 128px;
                height: 128px;
                border: 2px solid #555;
                border-radius: 4px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 99999999;
                pointer-events: none;
                display: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            }

            /* Touch-specific styles */
            @media (hover: none) and (pointer: coarse) {
                .custom-chat-head .controls span,
                .menu-item,
                .load-more-link {
                    padding: 12px 15px; /* Larger touch targets */
                }

                .resize-handle {
                    width: 24px;
                    height: 24px; /* Larger resize handle for touch */
                }

                .custom-chat-reply button {
                    padding: 12px 20px;
                }
            }

            /* --- Edit Mode Styles --- */
            #${EDIT_MODE_TOGGLE_BUTTON_ID} {
                position: fixed;
                z-index: 100001;
                cursor: pointer;
                padding: 1px 2px;
                background-color: #355b75; /* Default dreadcast blue */
                color: white;
                border-radius: 50%;
                font-size: 15px;
                line-height: 1;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                transition: background-color 0.3s ease, transform 0.2s ease;
                user-select: none;
            }
            #${EDIT_MODE_TOGGLE_BUTTON_ID}:hover {
                transform: scale(1.1);
            }
            #${EDIT_MODE_TOGGLE_BUTTON_ID}.active {
                background-color: #e67e22; /* Active orange */
            }

            #${EDIT_POPUP_ID} {
                display: none; /* Hidden by default */
                position: fixed;
                z-index: 999999999998;
                background-color: #2f2f2f;
                border: 1px solid #555;
                border-radius: 5px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                padding: 15px;
                min-width: 280px;
                color: #e0e0e0;
            }

            .dmm-edit-field {
                margin-bottom: 10px;
            }
            .dmm-edit-field label {
                display: block;
                margin-bottom: 4px;
                font-size: 0.9em;
                color: #ccc;
            }
            .dmm-edit-field input[type="text"] {
                width: calc(100% - 12px);
                padding: 6px;
                background-color: #1a1a1a;
                border: 1px solid #444;
                color: #ddd;
                border-radius: 3px;
            }
            .dmm-edit-buttons {
                margin-top: 15px;
                text-align: right;
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            .dmm-edit-buttons button {
                padding: 6px 12px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.2s ease;
            }
            #dmm-edit-save {
                background-color: #2ecc71;
                color: white;
            }
            #dmm-edit-save:hover {
                background-color: #27ae60;
            }
            #dmm-edit-cancel, #dmm-edit-reset {
                background-color: #7f8c8d;
                color: white;
            }
            #dmm-edit-reset {
                background-color: #e74c3c;
            }
            #dmm-edit-cancel:hover, #dmm-edit-reset:hover {
                background-color: #95a5a6;
            }
            #dmm-edit-reset:hover {
                background-color: #c0392b;
            }

            /* Style for editable items in sidebar */
            .dmm-edit-mode-active #liste_messages li.message.dmm-editable-item {
                cursor: pointer;
                outline: 1px dashed #e67e22;
                outline-offset: -1px;
            }
            .dmm-edit-mode-active #liste_messages li.message.dmm-editable-item:hover {
                background-color: rgba(230, 126, 34, 0.15);
            }
            /* --- End Edit Mode Styles --- */

            /* Invite Input Styles - Revised for Slim Line */
            .dmm-invite-container {
                display: none;
                padding: 3px 8px;
                border-top: 1px solid #333;
                background-color: #151515;
                flex-shrink: 0;
                width: 100%;
                box-sizing: border-box;
            }

            .dmm-invite-container label {
                display: none;
            }

            .dmm-invite-container input[type="text"] {
                width: 100%;
                border: none;
                border-bottom: 1px solid #555;
                background-color: transparent;
                padding: 2px 0;
                font-size: 0.85em;
                color: #ccc;
                outline: none;
                box-shadow: none;
                border-radius: 0;
                transition: border-bottom-color 0.2s ease;
            }

            .dmm-invite-container input[type="text"]:focus {
                border-bottom-color: var(--dmm-primary-color);
            }

            /* Style for the invite menu item when active */
            .custom-chat-window .more-opts-menu .menu-item.invite-active {
                background-color: rgba(255, 255, 255, 0.1);
                font-weight: bold;
            }
            .custom-chat-window .more-opts-menu .menu-item.invite-active::before {
                content: '✓ ';
                color: #66ff66;
                margin-right: 4px;
            }
            /* End Invite Input Styles */

            .custom-chat-reply {
                padding: 8px;
                border-top: 1px solid var(--dmm-border-color);
                background-color: #101010;
                display: flex;
                gap: 5px;
                flex-shrink: 0;
                transition: opacity 0.2s ease-out, border-color 0.3s ease-in-out;
            }
         `);
     }


    // --- Dragging/Resizing ---
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const h = element.querySelector(".custom-chat-head");
        if (h) {
            h.onmousedown = dragMouseDown;
            h.ontouchstart = dragTouchStart;
        }
        else {
            element.onmousedown = dragMouseDown;
            element.ontouchstart = dragTouchStart;
        }

        function dragTouchStart(e) {
            e.preventDefault();
            // Prevent drag if clicking on controls, menus, panels, or resize handle
            if (e.target.closest('.controls span') || e.target.closest('.more-opts-menu') ||
                e.target.closest('.participants-panel') || e.target.closest('.color-picker-panel') ||
                e.target.classList.contains('resize-handle')) return;

            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementTouchDrag;
        }

        function elementTouchDrag(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            element.style.top = Math.max(0, (element.offsetTop - pos2)) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function dragMouseDown(e) {
            // Prevent drag if clicking on controls, menus, panels, or resize handle
            if (e.target.closest('.controls span') || e.target.closest('.more-opts-menu') ||
                e.target.closest('.participants-panel') || e.target.closest('.color-picker-panel') ||
                e.target.classList.contains('resize-handle')) return;
            e = e || window.event;
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            element.style.top = Math.max(0, (element.offsetTop - pos2)) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }

    function makeResizable(element, handle) {
        let startX, startY, startWidth, startHeight;

        // Mouse events
        handle.addEventListener('mousedown', initResize, false);

        // Touch events
        handle.addEventListener('touchstart', initTouchResize, false);

        function initTouchResize(e) {
            e.preventDefault();
            const touch = e.touches[0];
            startResize(touch.clientX, touch.clientY);
            document.addEventListener('touchmove', doTouchResize, false);
            document.addEventListener('touchend', stopResize, false);
        }

        function doTouchResize(e) {
            e.preventDefault();
            const touch = e.touches[0];
            resizeElement(touch.clientX, touch.clientY);
        }

        function initResize(e) {
            e.preventDefault();
            startResize(e.clientX, e.clientY);
            document.addEventListener('mousemove', doResize, false);
            document.addEventListener('mouseup', stopResize, false);
        }

        function startResize(x, y) {
            startX = x;
            startY = y;
            const computedStyle = document.defaultView.getComputedStyle(element);
            startWidth = parseInt(computedStyle.width, 10);
            startHeight = parseInt(computedStyle.height, 10);
        }

        function doResize(e) {
            resizeElement(e.clientX, e.clientY);
        }

        function resizeElement(x, y) {
            let newWidth = startWidth + x - startX;
            let newHeight = startHeight + y - startY;
            newWidth = Math.max(MIN_WINDOW_WIDTH, newWidth);
            newHeight = Math.max(MIN_WINDOW_HEIGHT, newHeight);
            newWidth = Math.min(window.innerWidth - element.offsetLeft - 5, newWidth);
            newHeight = Math.min(window.innerHeight - element.offsetTop - 5, newHeight);
            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        }

        function stopResize() {
            document.removeEventListener('mousemove', doResize, false);
            document.removeEventListener('mouseup', stopResize, false);
            document.removeEventListener('touchmove', doTouchResize, false);
            document.removeEventListener('touchend', stopResize, false);
        }
    }


    // --- Message Parsing and Fetching ---

    function cleanupMessageCache() {
        const now = Date.now();
        let cleanupCount = 0;

        for (const [key, data] of messageCache.entries()) {
            if (now - data.timestamp > MESSAGE_CACHE_EXPIRY) {
                messageCache.delete(key);
                cleanupCount++;
            }
        }
    }

    function parseMessageElement(element) {
        const id = element.id.replace('convers_', ''); // Used for *content fetching*, not the LI ID
        const timestamp = element.querySelector('.ligne1')?.textContent.trim();
        const senderLine = element.querySelector('.ligne2')?.textContent.trim();
        const senderMatch = senderLine?.match(/Message de (.*)/);
        const sender = senderMatch ? senderMatch[1] : '?';
        if (!id || !timestamp || !senderLine) {
            return null;
        }
        return { id, timestamp, sender }; // 'id' here is the internal message_id for content
    }

    function fetchMessageContent(messageId, conversationId, callback) {
        const cacheKey = `${conversationId}_${messageId}`;

        // Check cache with expiry
        if (messageCache.has(cacheKey)) {
            const cachedData = messageCache.get(cacheKey);
            const now = Date.now();

            // If cached data is still valid
            if (now - cachedData.timestamp <= MESSAGE_CACHE_EXPIRY) {
                callback(cachedData.content);
                return;
            } else {
                // Remove expired entry
                messageCache.delete(cacheKey);
            }
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.dreadcast.net/Menu/Messaging/action=ReadMessage&id_message=${messageId}&id_conversation=${conversationId}`,
            timeout: 15000,
            onload: function(r) {
                if (r.status === 200 && r.responseText) {
                    try {
                        let p = new DOMParser(),
                            x = p.parseFromString(r.responseText, "text/xml"),
                            m = x.querySelector("message");
                        const content = m ? (m.textContent || m.innerHTML).trim() : "Erreur: Contenu message vide";

                        // Store content with timestamp
                        messageCache.set(cacheKey, {
                            content: content,
                            timestamp: Date.now()
                        });

                        callback(content);
                    } catch (e) {
                        console.error(`%cDMM fetchMessageContent[${conversationId}]: Parse XML error for msg ${messageId}`, "color: red", e);
                        callback("Erreur: Parse XML");
                    }
                } else {
                    callback(`Erreur: Load ${r.status}`);
                }
            },
            onerror: function(e) {
                console.error(`%cDMM fetchMessageContent[${conversationId}]: Network error for msg ${messageId}`, "color: red", e);
                callback("Erreur: Réseau");
            },
            ontimeout: function() {
                callback("Erreur: Timeout");
            }
        });
    }

    async function parseAndFetchInitialMessages(originalWindow, conversationId) {
        const logPrefix = `DMM PFIM (${conversationId}):`;
        const defaultResult = { messages: [], participants: [], totalMessages: 0, latestId: null, oldestId: null, allLoaded: true };
        const conversationZone = originalWindow.querySelector('.zone_conversation');
        if (!conversationZone) { return defaultResult; }

        // --- Participant Parsing (Keep existing logic) ---
        let participants = [];
        try {
            const participantsTitleDiv = Array.from(conversationZone.querySelectorAll('div')).find(div => div.textContent.includes('Participants'));
            if (participantsTitleDiv) {
                let currentElement = participantsTitleDiv.nextElementSibling;
                let participantsString = '';
                while(currentElement && currentElement.tagName !== 'P') {
                    currentElement = currentElement.nextElementSibling;
                }
                 if (currentElement && currentElement.tagName === 'P' && !currentElement.querySelector('.link.conversation')) {
                    participantsString = currentElement.textContent.trim();
                }
                if (participantsString) { participants = participantsString.split(',').map(name => name.trim()).filter(name => name.length > 0); }
            }
        } catch (e) { }

        const allElements = Array.from(conversationZone.querySelectorAll('.link.conversation[id^="convers_"]'));
        const total = allElements.length;
        if (total === 0) { defaultResult.participants = participants; return defaultResult; }

        const fetchElements = allElements.slice(0, INITIAL_LOAD_COUNT);
        let fetchedData = []; // This will hold the { id, timestamp, sender, content } objects
        const BATCH_SIZE = 15; // Keep batching

        for(let i = 0; i < Math.min(INITIAL_LOAD_COUNT, fetchElements.length); i += BATCH_SIZE) {
            const batch = fetchElements.slice(i, i + BATCH_SIZE);
            let batchPromises = []; // Promises for fetches within this batch

            for (const el of batch) {
                const parsed = parseMessageElement(el); // Get { id, timestamp, sender }
                if (parsed && parsed.id) { // Ensure we have a valid parsed object with an ID
                    let msgData = { ...parsed, content: null };
                    fetchedData.push(msgData); // Add structure immediately to fetchedData array

                    // --- Cache Check BEFORE deciding to Fetch ---
                    const cacheKey = `${conversationId}_${parsed.id}`;
                    const cached = messageCache.get(cacheKey);
                    const now = Date.now();

                    if (cached && (now - cached.timestamp <= MESSAGE_CACHE_EXPIRY)) {
                        // Use cached content directly & update the object in fetchedData
                        const targetMsg = fetchedData.find(m => m.id === parsed.id);
                        if (targetMsg) {
                             targetMsg.content = cached.content;
                        }
                    } else {
                        // Not cached or expired, push a fetch promise
                        batchPromises.push(new Promise((resolve) => {
                            // fetchMessageContent handles adding to cache on success
                            fetchMessageContent(parsed.id, conversationId, (content) => {
                                // Update the content in the already existing object in fetchedData
                                const targetMsg = fetchedData.find(m => m.id === parsed.id);
                                if (targetMsg) {
                                    targetMsg.content = content;
                                } else {
                                }
                                resolve(); // Resolve the promise for this specific fetch
                            });
                        }));
                    }
                    // --- End Cache Check ---
                } else {
                }
            } // End loop through batch elements

            // Process batch fetches (wait for all fetches in this batch to complete)
            if (batchPromises.length > 0) {
                await Promise.all(batchPromises);
            }
        } // End loop through batches

        // Reverse the array containing message data objects to show oldest first
        fetchedData.reverse();

        // Determine latest and oldest IDs from the fetchedData array
        const latestId = fetchedData.length > 0 ? fetchedData[fetchedData.length - 1].id : null;
        const oldestId = fetchedData.length > 0 ? fetchedData[0].id : null;
        const allLoaded = total <= INITIAL_LOAD_COUNT;

        const result = { messages: fetchedData, participants: participants, totalMessages: total, latestId: latestId, oldestId: oldestId, allLoaded: allLoaded };
        return result;
    }


    // --- UI Building and Manipulation ---

    // --- Custom Conversation Data Storage ---
    function loadCustomConversationData() {
        try {
            const stored = localStorage.getItem(CUSTOM_CONVO_DATA_STORAGE_KEY);
            customConversationData = stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("DMM EditMode: Failed to load custom conversation data", e);
            customConversationData = {};
        }
    }

    function saveCustomConversationData() {
        try {
            localStorage.setItem(CUSTOM_CONVO_DATA_STORAGE_KEY, JSON.stringify(customConversationData));
        } catch (e) {
            console.error("DMM EditMode: Failed to save custom conversation data", e);
        }
    }

    function getCustomData(conversationId) {
        const data = customConversationData[conversationId];
        if (data && (data.title !== undefined || data.imageUrl !== undefined)) {
            // Return a copy with defaults for potentially missing keys
            return {
                title: data.title !== undefined ? data.title : null,
                imageUrl: data.imageUrl !== undefined ? data.imageUrl : null
            };
        }
        return null; // No custom data set for this conversation
    }

    function setCustomData(conversationId, title, imageUrl) {
        const cleanTitle = title?.trim() || null;
        const cleanImageUrl = imageUrl?.trim() || null;

        if (cleanTitle === null && cleanImageUrl === null) {
            // If both are being removed, delete the entry
            if (customConversationData[conversationId]) {
                delete customConversationData[conversationId];
                saveCustomConversationData();
            } else {
            }
        } else {
            // Otherwise, create or update the entry
            if (!customConversationData[conversationId]) {
                customConversationData[conversationId] = {};
            }
            // Update only if values are provided (or explicitly nullified)
            if (title !== undefined) customConversationData[conversationId].title = cleanTitle;
            if (imageUrl !== undefined) customConversationData[conversationId].imageUrl = cleanImageUrl;

            // Clean up potentially nullified properties if they exist
            if (customConversationData[conversationId].title === null) delete customConversationData[conversationId].title;
            if (customConversationData[conversationId].imageUrl === null) delete customConversationData[conversationId].imageUrl;

            // If the object is now empty after removing nulls, remove the whole entry
            if (Object.keys(customConversationData[conversationId]).length === 0) {
                delete customConversationData[conversationId];
            } else {
            }
            saveCustomConversationData();
        }
    }
    // --- End Custom Conversation Data Storage ---

    // <<< NEW FUNCTION >>>
    function createUnreadSeparatorElement(conversationId) {
        const separator = document.createElement('div');
        separator.id = `${UNREAD_SEPARATOR_ID_PREFIX}${conversationId}`;
        separator.classList.add('unread-separator');
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Nouveaux messages';
        separator.appendChild(textSpan);
        return separator;
    }

    // ================== START OF MODIFIED addBubble FUNCTION ===============
    /**
     * Adds a message bubble to the chat window OR a DocumentFragment. Detects URLs and makes them clickable.
 * @param {object} msgData - The message data { id, timestamp, sender, content }. id is message_id.
 * @param {HTMLElement|DocumentFragment} containerOrFragment - The DOM element or fragment to add the bubble to.
 * @param {string} conversationId - The ID of the conversation.
 * @param {boolean} [prepend=false] - True if the bubble should be added to the top (loading older).
 * @param {boolean} [isInitialLoad=false] - True if this bubble is being added during the initial window build (affects sound/notification).
 * @returns {HTMLElement|null} The added bubble element, or null if not added.
 */
function addBubble(msgData, containerOrFragment, conversationId, prepend = false, isInitialLoad = false) {
    // Determine if we are working with the live container or a fragment
    const isLiveContainer = containerOrFragment instanceof HTMLElement;
    // Try to get the live container even if appending to a fragment, for checks/scroll later
    const liveContainer = isLiveContainer ? containerOrFragment : ACTIVE_CONVERSATIONS[conversationId]?.customWindow?.querySelector('.custom-chat-content');

    if (!MY_NAME || (!liveContainer && !isInitialLoad)) { // Allow initial load even if liveContainer isn't found *yet*
        return null;
    }

    // --- Perform checks against the LIVE container if available ---
    if (msgData.id && liveContainer) {
        const existingById = liveContainer.querySelector(`.chat-bubble[data-message-id="${msgData.id}"]`);
        if (existingById) {
            return null; // Don't add duplicates
        }
    }

    // --- Bubble Creation Logic (largely unchanged) ---
    let processedContent = msgData.content || "...";
    let headerText = null;
    const headerMatch = processedContent.match(/^\s*\|([^|]+)\|\s*(\n|$)/);
    if (headerMatch) {
        headerText = headerMatch[1].trim();
        processedContent = processedContent.substring(headerMatch[0].length).trim();
    }

    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    if (msgData.id) bubble.dataset.messageId = msgData.id;
    const isMine = msgData.sender === MY_NAME;
    bubble.classList.add(isMine ? 'my-bubble' : 'their-bubble');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('bubble-content-wrapper');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add('bubble-header');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('bubble-avatar');
    avatarDiv.style.cursor = 'pointer';
    avatarDiv.style.backgroundImage = `url('https://www.dreadcast.net/images/avatars/${encodeURIComponent(msgData.sender)}.png')`;
    avatarDiv.style.backgroundSize = 'cover';
    avatarDiv.style.backgroundPosition = 'center';
    avatarDiv.addEventListener('click', () => {
        window.open(`https://www.dreadcast.net/${msgData.sender}`, '_blank');
    });
    // Add hover listeners for tooltip
    avatarDiv.addEventListener('mouseenter', () => showAvatarTooltip(avatarDiv));
    avatarDiv.addEventListener('mouseleave', (e) => {
         if (!e.relatedTarget || !e.relatedTarget.closest('#dmm-avatar-tooltip')) {
             hideAvatarTooltip();
         }
    });
    headerContainer.appendChild(avatarDiv);

    const n = document.createElement('div');
    n.classList.add('bubble-sender-name');
    n.textContent = headerText ? `${msgData.sender} - ${headerText}` : msgData.sender;
    n.style.cursor = 'pointer';
    n.addEventListener('click', () => {
        window.open(`https://www.dreadcast.net/${msgData.sender}`, '_blank');
    });
    headerContainer.appendChild(n);
    contentWrapper.appendChild(headerContainer);

    const c = document.createElement('div');
    c.classList.add('bubble-content');

    // Linkification
    const tempDiv = document.createElement('div');
    tempDiv.textContent = processedContent;
    let escapedContent = tempDiv.innerHTML;
    escapedContent = escapedContent.replace(/\n/g, '<br>');
    const urlRegex = /(\b(?:https?:\/\/|www\.)[^\s<>"'()]+)/gi;
    const linkifiedContent = escapedContent.replace(urlRegex, (match) => {
        let href = match;
        if (href.toLowerCase().startsWith('www.')) {
            href = 'https://' + href;
        }
        // Ensure quotes in URL are handled correctly
        href = href.replace(/"/g, '%22').replace(/'/g, '%27');
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    c.innerHTML = linkifiedContent;
    contentWrapper.appendChild(c);

    if (msgData.timestamp) {
        const t = document.createElement('span');
        t.classList.add('bubble-timestamp');
        t.textContent = msgData.timestamp;
        contentWrapper.appendChild(t);
    }
    bubble.appendChild(contentWrapper);
    // --- End Bubble Creation ---


    // --- Scroll calculations should use the LIVE container if available ---
    let isScrolledToBottom = false;
    let shouldScrollDown = false;
    if (liveContainer) {
        // Consider a slightly larger threshold for scrolled to bottom
        isScrolledToBottom = Math.abs(liveContainer.scrollHeight - liveContainer.clientHeight - liveContainer.scrollTop) < 70;
        shouldScrollDown = !prepend && (isScrolledToBottom || isMine);
    }


    // --- Append to the correct target (live container or fragment) ---
    if (prepend) {
        // Prepending usually happens when loading older, directly into the live container
        if (isLiveContainer) {
             const loadMoreElem = containerOrFragment.querySelector('.load-more-container');
             if (loadMoreElem) {
                 // Use insertBefore on the *next* sibling of loadMoreElem
                 containerOrFragment.insertBefore(bubble, loadMoreElem.nextSibling);
             } else {
                 containerOrFragment.insertBefore(bubble, containerOrFragment.firstChild);
             }
        } else {
             // Prepending to a fragment (might happen during initial build if logic changes)
             // Insert before the first existing child of the fragment
             containerOrFragment.insertBefore(bubble, containerOrFragment.firstChild);
        }
    } else {
         // Append normally (to fragment during initial build, or live container otherwise)
         containerOrFragment.appendChild(bubble);
    }

    // --- Sound & Notification State (Only when adding to live container and not initial load) ---
    if (isLiveContainer && !isMine && !prepend && !isInitialLoad) {
         const isConvoMuted = isConversationMuted(conversationId);
         if (!isConvoMuted && !isGloballyMuted) {
             playNotificationSound(false);
             const convData = ACTIVE_CONVERSATIONS[conversationId];
             const chatWindow = liveContainer.closest('.custom-chat-window');
              if (convData && chatWindow && !chatWindow.classList.contains('has-unread-notification')) {
                  convData.hasUnreadNotification = true;
                  chatWindow.classList.add('has-unread-notification');
              }
          } else { // Muted or globally muted
              const convData = ACTIVE_CONVERSATIONS[conversationId];
              const chatWindow = liveContainer.closest('.custom-chat-window');
              if (convData && chatWindow && !chatWindow.classList.contains('has-unread-notification')) {
                 convData.hasUnreadNotification = true;
                 chatWindow.classList.add('has-unread-notification');
              }
          }
    }

    // --- Scrolling (Only if adding to live container and conditions met) ---
    if (isLiveContainer && shouldScrollDown) {
        // Use requestAnimationFrame for smoother scrolling after DOM update
        requestAnimationFrame(() => {
            // Double-check container exists before scrolling
            if (liveContainer && liveContainer.isConnected) {
                liveContainer.scrollTop = liveContainer.scrollHeight;
            }
        });
    }

    return bubble; // Return the created bubble element
} // --- END of modified addBubble function ---
    // =======================================================================
    // =================== END OF MODIFIED addBubble FUNCTION ================
    // =======================================================================


    // =======================================================================
    // ================== START OF MODIFIED buildInitialChatUI ===============
    // =======================================================================
    function buildInitialChatUI(messages, container, conversationId, allMessagesLoaded) {
        container.innerHTML = ''; // Clear existing content first
        container.classList.remove('loading');
        let separatorInserted = false;
        let separatorElement = null; // Keep track if separator element is created

        if (!MY_NAME) {
            container.innerHTML = "<p style='color:red;'>Erreur: Nom utilisateur non trouvé.</p>";
            return { latestId: null, oldestId: null, separatorInserted: false };
        }

        // --- Create a DocumentFragment ---
        const fragment = document.createDocumentFragment();

        // Add "Load More" link if applicable (to the fragment)
        if (!allMessagesLoaded) {
            // Create and append the load more link container to the fragment
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.classList.add('load-more-container');
            const loadMoreLink = document.createElement('a');
            loadMoreLink.classList.add('load-more-link');
            loadMoreLink.textContent = 'Afficher les messages précédents';
            loadMoreLink.href = '#';
            loadMoreLink.onclick = (e) => {
                e.preventDefault();
                const cData = ACTIVE_CONVERSATIONS[conversationId];
                if (cData && !cData.isLoadingOlder) {
                    loadOlderMessages(conversationId, loadMoreLink);
                }
            };
            loadMoreContainer.appendChild(loadMoreLink);
            fragment.appendChild(loadMoreContainer); // Add to fragment
        }

        // --- Get Last Seen ID ---
        const lastSeenId = getLastSeenMessageId(conversationId);
        let lastSeenBubbleFound = false;
        let insertBeforeBubbleId = null; // Store the ID of the bubble to insert before

        // --- Add Bubbles to Fragment and Find Insertion Point ---
        let firstId = null;
        let lastId = null;

        messages.forEach(msg => {
            // Add bubble returns the ELEMENT, but we add it to the FRAGMENT
            // Pass fragment as container initially
            const addedBubbleElement = addBubble(msg, fragment, conversationId, false, true);

            if (addedBubbleElement) {
                // Check if this bubble corresponds to the last seen ID
                if (lastSeenId && msg.id === lastSeenId) {
                    lastSeenBubbleFound = true;
                }
                // If we just found the last seen bubble, the *current* bubble is the one to insert before
                else if (lastSeenBubbleFound && !insertBeforeBubbleId && msg.id) {
                    insertBeforeBubbleId = msg.id; // Store the message ID
                }

                // Track oldest/latest IDs
                if (msg.id) {
                    const msgIdNum = parseInt(msg.id);
                    if (!firstId || (msgIdNum < parseInt(firstId))) { firstId = msg.id; }
                    if (!lastId || (msgIdNum > parseInt(lastId))) { lastId = msg.id; }
                }
            }
        }); // End messages.forEach

        // --- Insert Separator Logic (within the fragment) ---
        if (lastSeenId) {
            separatorElement = createUnreadSeparatorElement(conversationId); // Create it regardless
            let insertedInFragment = false;

            // Find the actual bubble element in the fragment using the stored ID
            const bubbleToInsertBefore = insertBeforeBubbleId ? fragment.querySelector(`.chat-bubble[data-message-id="${insertBeforeBubbleId}"]`) : null;

            if (bubbleToInsertBefore) {
                fragment.insertBefore(separatorElement, bubbleToInsertBefore);
                insertedInFragment = true;
            } else if (lastSeenBubbleFound) {
                // If last seen was the last message, append separator to fragment
                fragment.appendChild(separatorElement);
                insertedInFragment = true;
            } else {
                 // Last seen ID exists, but not found in this batch (all are new)
                 // Insert at top (after potential load-more link)
                 const loadMoreNode = fragment.querySelector('.load-more-container');
                 if (loadMoreNode) {
                     // Insert after load-more link in fragment
                     fragment.insertBefore(separatorElement, loadMoreNode.nextSibling);
                 } else {
                     // Insert as first child in fragment
                     fragment.insertBefore(separatorElement, fragment.firstChild);
                 }
                insertedInFragment = true;
            }
            separatorInserted = insertedInFragment; // Update the flag based on actual insertion into fragment
        }

        // --- Append the entire fragment to the live DOM ---
        container.appendChild(fragment);

        // --- Scroll Logic (Runs after DOM is updated) ---
        setTimeout(() => {
            // Re-find the separator element in the *live* DOM now IF it was inserted
            const liveSeparatorElement = separatorInserted ? container.querySelector(`#${UNREAD_SEPARATOR_ID_PREFIX}${conversationId}`) : null;

            if (container && container.isConnected) {
                if (liveSeparatorElement && container.contains(liveSeparatorElement)) {
                    // Scroll to separator
                    const containerRect = container.getBoundingClientRect();
                    const separatorRect = liveSeparatorElement.getBoundingClientRect();
                    const desiredTopOffset = container.clientHeight * 0.4;
                    const scrollAmount = container.scrollTop + (separatorRect.top - containerRect.top) - desiredTopOffset;
                    container.scrollTo({ top: scrollAmount, behavior: 'auto' });
                    // Attach listener to the container (it will find the separator)
                    attachSeparatorRemovalListener(container, conversationId, lastId);
                } else {
                    // No separator visible/inserted, scroll to bottom
                    container.scrollTop = container.scrollHeight;
                }
            }
        }, 100);

        // Return the actual oldest/latest IDs found in the initial message data and separator status
        return { latestId: lastId, oldestId: firstId, separatorInserted: separatorInserted };
    }
    // =======================================================================
    // =================== END OF MODIFIED buildInitialChatUI ================
    // =======================================================================


    // =======================================================================
    // ================== START OF NEW Separator Removal Logic ===============
    // =======================================================================
    function removeUnreadSeparator(container, conversationId, latestMessageIdInView) {
        const separatorId = `${UNREAD_SEPARATOR_ID_PREFIX}${conversationId}`;
        const separator = container?.querySelector(`#${separatorId}`);
        if (separator) {
            // Add fade-out class and wait for animation
            separator.classList.add('fade-out');

            // Remove after animation completes
            setTimeout(() => {
                if (separator.isConnected) {
                    separator.remove();
                }
            }, 1500); // Match the CSS transition duration

            // Update the last seen ID immediately (don't wait for animation)
            if (latestMessageIdInView) {
                lastSeenMessageIds[conversationId] = String(latestMessageIdInView);
            }

            // Mark in conversation data that it's gone
            const cData = ACTIVE_CONVERSATIONS[conversationId];
            if (cData) {
                cData.unreadSeparatorVisible = false;
            }
            return true;
        }
        return false;
    }

    function attachSeparatorRemovalListener(container, conversationId, initialLatestId) {
        if (!container || !conversationId) return;

        let currentLatestId = initialLatestId; // Keep track of the latest ID

        // Listener function
        const interactionListener = (event) => {
            // Find the current *actual* latest message ID when interaction happens
            const bubbles = container.querySelectorAll('.chat-bubble[data-message-id]');
             if (bubbles.length > 0) {
                 currentLatestId = bubbles[bubbles.length - 1].dataset.messageId;
             }

            // Attempt to remove the separator
            const removed = removeUnreadSeparator(container, conversationId, currentLatestId);

            if (removed) {
                // Remove the listeners if the separator was successfully removed
                container.removeEventListener('scroll', interactionListener);
                container.removeEventListener('mousedown', interactionListener);
                container.removeEventListener('touchstart', interactionListener); // Add touch
                container.removeEventListener('focusin', interactionListener);
            } else {
                 // If separator somehow wasn't found, maybe still remove listeners?
                 container.removeEventListener('scroll', interactionListener);
                 container.removeEventListener('mousedown', interactionListener);
                 container.removeEventListener('touchstart', interactionListener);
                 container.removeEventListener('focusin', interactionListener);
            }
        };

        // Attach listeners
        container.addEventListener('scroll', interactionListener, { passive: true }); // Use passive for scroll
        container.addEventListener('mousedown', interactionListener);
        container.addEventListener('touchstart', interactionListener, { passive: true }); // Add touch
        container.addEventListener('focusin', interactionListener); // Catches focus shifts e.g., clicking textarea

         // Store in conversation data that separator is visible (optional)
         const cData = ACTIVE_CONVERSATIONS[conversationId];
         if (cData) {
             cData.unreadSeparatorVisible = true;
         }
    }
    // =================== END OF NEW Separator Removal Logic ================


    function addLoadMoreLink(container, conversationId) {
        if (container.querySelector('.load-more-container')) return; // Avoid adding multiple links
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.classList.add('load-more-container');
        const loadMoreLink = document.createElement('a');
        loadMoreLink.classList.add('load-more-link');
        loadMoreLink.textContent = 'Afficher les messages précédents';
        loadMoreLink.href = '#';
        loadMoreLink.onclick = (e) => {
            e.preventDefault();
            const cData = ACTIVE_CONVERSATIONS[conversationId];
            if (cData && !cData.isLoadingOlder) {
                loadOlderMessages(conversationId, loadMoreLink);
            }
        };
        loadMoreContainer.appendChild(loadMoreLink);
        container.insertBefore(loadMoreContainer, container.firstChild);
    }


    async function loadOlderMessages(conversationId, linkElement) {
        const cData = ACTIVE_CONVERSATIONS[conversationId];
        const container = cData?.customWindow?.querySelector('.custom-chat-content');
        if (!cData || !container || cData.isLoadingOlder || cData.allMessagesLoaded) {
            if (cData?.allMessagesLoaded && linkElement?.parentElement) linkElement.parentElement.remove(); // Clean up link if already loaded
            return;
        }
        cData.isLoadingOlder = true;
        linkElement.classList.add('loading');
        linkElement.textContent = ''; // Clear text while loading


        try {
             // Fetch the full conversation page HTML to get all message elements
             const response = await new Promise((resolve, reject) => {
                 GM_xmlhttpRequest({
                     method: "GET", url: `https://www.dreadcast.net/Menu/Messaging/action=OpenMessage&id_conversation=${conversationId}`, timeout: 15000,
                     onload: (res) => { if (res.status === 200 && res.responseText) resolve(res.responseText); else reject(`HTTP Status ${res.status}`); },
                     onerror: (err) => reject("Network Error"), ontimeout: () => reject("Timeout")
                 });
             });

             const parser = new DOMParser();
             const doc = parser.parseFromString(response, 'text/html');
             const messageList = doc.querySelector('.zone_conversation');
             if (!messageList) throw new Error("Could not find .zone_conversation in older messages response.");

             // Get all message links (convers_...) from the fetched HTML
             const allElements = Array.from(messageList.querySelectorAll('.link.conversation[id^="convers_"]'));
             const currentOldestId = cData.oldestMessageId; // This is a message_id
             let olderElementsToLoad = [];

             // Find the index of the *element* corresponding to the current oldest message ID
             const currentOldestIndex = allElements.findIndex(el => el.id.replace('convers_', '') === currentOldestId);

             if (currentOldestIndex !== -1 && currentOldestId) {
                 // Find elements *before* the current oldest one in the full list (since list is newest first)
                 const startIndex = currentOldestIndex + 1;
                 const endIndex = Math.min(startIndex + LOAD_MORE_COUNT, allElements.length);
                 olderElementsToLoad = allElements.slice(startIndex, endIndex);
             } else if (currentOldestId) {
                  linkElement.textContent = 'Erreur index'; linkElement.style.color = '#aaa'; linkElement.onclick = (e) => e.preventDefault();
                  cData.isLoadingOlder = false; // Unlock
                  return;
             } else {
                 cData.allMessagesLoaded = true; // Assume loaded if we have no starting point
                 if(linkElement.parentElement) linkElement.parentElement.remove();
                 cData.isLoadingOlder = false; // Unlock
                 return;
             }


             if (olderElementsToLoad.length > 0) {
                 let fetchedData = []; let fetchPromises = [];
                 for (const el of olderElementsToLoad) {
                     const parsed = parseMessageElement(el); // Parse the 'convers_' element
                     // Ensure we don't re-add a bubble that might already exist somehow (defensive check)
                     if (parsed && !container.querySelector(`.chat-bubble[data-message-id="${parsed.id}"]`)) {
                         let msgData = { ...parsed, content: null }; // msgData.id is message_id
                         fetchedData.push(msgData);
                         fetchPromises.push(new Promise((resolve) => {
                             fetchMessageContent(msgData.id, conversationId, (content) => { // Use message_id
                                 const targetMsg = fetchedData.find(m => m.id === msgData.id);
                                 if (targetMsg) targetMsg.content = content; resolve();
                             });
                         }));
                     }
                 }

                 if (fetchPromises.length > 0) await Promise.all(fetchPromises);

                 const oldScrollHeight = container.scrollHeight; const oldScrollTop = container.scrollTop;

                 let newOldestId = cData.oldestMessageId; // Start with current oldest message_id
                 fetchedData.forEach(msg => {
                     // Pass 'false' for the isInitialLoad parameter when loading older
                     // addBubble now returns the element, we need the ID from msgData
                     addBubble(msg, container, conversationId, true, false); // prepend=true, isInitialLoad=false;
                     // Update the overall oldest message ID if the prepended one is older
                     if (msg.id && (!newOldestId || (parseInt(msg.id) < parseInt(newOldestId)))) {
                         newOldestId = msg.id;
                     }
                 });

                 // Restore scroll position relative to the old top content
                 if(fetchedData.length > 0) {
                      const newScrollHeight = container.scrollHeight;
                      container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
                 }

                 cData.oldestMessageId = newOldestId; // Update the tracked oldest message ID

                 // Check if we've reached the end of the conversation history
                 const endReached = (currentOldestIndex + 1 + olderElementsToLoad.length) >= allElements.length;
                 if (endReached || olderElementsToLoad.length < LOAD_MORE_COUNT) {
                     cData.allMessagesLoaded = true;
                     if (linkElement.parentElement) linkElement.parentElement.remove(); // Remove the link
                 }
             } else if (!cData.allMessagesLoaded && currentOldestId) {
                 cData.allMessagesLoaded = true;
                 if (linkElement.parentElement) linkElement.parentElement.remove();
             }

        } catch (error) {
             linkElement.textContent = 'Erreur chargement'; linkElement.style.color = 'red';
             linkElement.style.cursor = 'default'; linkElement.onclick = (e) => e.preventDefault(); // Prevent retries on error
        } finally {
             cData.isLoadingOlder = false;
             // Restore link text if still loading and no error occurred and not fully loaded
             if (!cData.allMessagesLoaded && linkElement.classList.contains('loading') && !linkElement.textContent.includes('Erreur')) {
                 linkElement.classList.remove('loading');
                 linkElement.textContent = 'Afficher les messages précédents';
             } else if (cData.allMessagesLoaded && linkElement.parentElement) {
                 // Ensure link is removed if finally block confirms all loaded
                 linkElement.parentElement.remove();
             }
        }
    }


    // =======================================================================
    // ================== START OF MODIFIED closeChatWindow ==================
    // =======================================================================
    let closeChatWindow = (conversationId, options = { removeOriginal: true }) => {
        const cData = ACTIVE_CONVERSATIONS[conversationId]; // Get data first

        // --- SAVE LAST SEEN ID --- // <<< NEW SECTION >>>
        if (cData?.customWindow && document.body.contains(cData.customWindow)) {
            const contentArea = cData.customWindow.querySelector('.custom-chat-content');
            if (contentArea) {
                const bubbles = contentArea.querySelectorAll('.chat-bubble[data-message-id]');
                if (bubbles.length > 0) {
                    const lastBubble = bubbles[bubbles.length - 1];
                    const lastVisibleId = lastBubble.dataset.messageId;
                    saveLastSeenMessageId(conversationId, lastVisibleId);
                } else {
                }
            }
        }
        // --- END SAVE LAST SEEN ID ---

        // Ensure timer clearing happens *before* data deletion (existing code)
        if (cData?.muteTimerIntervalId) {
            clearInterval(cData.muteTimerIntervalId);
        }

        const customWindowId = `custom-chat-${conversationId}`;
        const chatWindow = document.getElementById(customWindowId);
        if (chatWindow) { chatWindow.remove(); }

        if (cData) { // Check if data existed (might have already been partially cleaned) (existing code)
            const oRef = cData.originalWindow;
             // Only remove original if requested AND it wasn't specifically revealed for 'invite' action
             const shouldRemove = options.removeOriginal && oRef?.dataset.modernized !== 'revealed_for_invite';
            if (shouldRemove && oRef?.parentNode) {
                try { oRef.remove(); } catch (e) { }
            }
            delete ACTIVE_CONVERSATIONS[conversationId]; // Delete data *after* using it (existing code)
        }
    };


    function populateConversationSettingsUI(conversationId, checkbox, colorInput) {
        const setting = getConversationSetting(conversationId);
        checkbox.checked = setting.enabled;
        colorInput.value = setting.enabled ? setting.color : getSavedGlobalThemeColor(); // Show global if disabled
        colorInput.disabled = !setting.enabled;
    }
    async function createCustomWindow(conversationId, otherParticipantName_UNUSED, initialResult_IGNORED, originalWindowRef) {

        const windowId = `custom-chat-${conversationId}`;
        // --- Check if DMM window already exists ---
        if (document.getElementById(windowId)) {
            const existingData = ACTIVE_CONVERSATIONS[conversationId];
            if (existingData) {
                existingData.originalWindow = originalWindowRef; // Update ref
            }
            // Hide the newly added original window since DMM window exists
            if (originalWindowRef?.parentNode) {
                originalWindowRef.classList.add('hidden-original-databox');
                originalWindowRef.dataset.modernized = 'replaced';
            }
            // Bring existing DMM window to front and focus
            const existingWindow = document.getElementById(windowId);
            if (existingWindow) {
                bringWindowToFront(existingWindow);
                if (existingWindow.classList.contains('collapsed')) {
                    existingWindow.classList.remove('collapsed'); // Uncollapse if needed
                }
                const txtArea = existingWindow.querySelector('.custom-chat-reply textarea');
                if (txtArea) setTimeout(() => txtArea.focus(), 50); // Focus after slight delay
            }
            return; // Don't create a duplicate window
        }

        // --- Step 1: Create Window Structure IMMEDIATELY ---
        const chatWindow = document.createElement('div');
        chatWindow.id = windowId;
        chatWindow.classList.add('custom-chat-window');
        // Add temporary loading state class
        chatWindow.classList.add('dmm-loading-initial'); // New class for styling loading state
        chatWindow.style.zIndex = '999999'; // Ensure high z-index
        applyCurrentTheme(chatWindow, conversationId); // Apply theme early

        // Add click handler to bring window to front
        chatWindow.addEventListener('mousedown', function(e) {
            // Prevent drag if clicking interactive elements in header
            if (!e.target.closest('.controls span') &&
                !e.target.closest('.more-opts-menu') &&
                !e.target.closest('.participants-panel') &&
                !e.target.closest('.color-picker-panel') &&
                !e.target.closest('.header-panel') && // Added check
                !e.target.classList.contains('resize-handle')) {
                bringWindowToFront(chatWindow);
            }
        });

        // --- Create Header ---
        const head = document.createElement('div');
        head.classList.add('custom-chat-head');
        let actualTitleText = `Conversation ${conversationId}`;
        const originalTitleElement = originalWindowRef?.querySelector('.head .title');
        if (originalTitleElement) {
            actualTitleText = originalTitleElement.textContent.trim();
        } else {
            // Fallback title if original couldn't be read quickly
            actualTitleText = `Messages ${conversationId}`;
        }
        const title = document.createElement('span'); title.classList.add('title'); title.textContent = actualTitleText; title.title = actualTitleText;
        const muteStatusDisplay = document.createElement('span'); muteStatusDisplay.classList.add('mute-status-display');
        const controls = document.createElement('div'); controls.classList.add('controls');
        // Create control buttons (theme, participants, more, close)
        const themeBtn = document.createElement('span'); themeBtn.classList.add('theme-btn'); themeBtn.innerHTML = '🎨'; themeBtn.title = 'Changer la couleur GLOBALE du thème'; controls.appendChild(themeBtn);
        const participantsBtn = document.createElement('span'); participantsBtn.classList.add('participants-btn'); participantsBtn.innerHTML = '👥'; participantsBtn.title = 'Afficher les participants'; controls.appendChild(participantsBtn);
        const moreOptsBtn = document.createElement('span'); moreOptsBtn.classList.add('more-opts-btn'); moreOptsBtn.innerHTML = '⋮'; moreOptsBtn.title = "Plus d'options"; controls.appendChild(moreOptsBtn);
        const closeBtn = document.createElement('span'); closeBtn.innerHTML = '×'; closeBtn.title = 'Fermer'; controls.appendChild(closeBtn);
        // Append header elements
        head.appendChild(title);
        title.insertAdjacentElement('afterend', muteStatusDisplay); // Insert mute display after title
        head.appendChild(controls);
        chatWindow.appendChild(head);

        // --- Create Content Area (with loader) ---
        const content = document.createElement('div');
        content.classList.add('custom-chat-content');
        content.innerHTML = '<div class="dmm-initial-loader">Chargement des messages...</div>'; // Loader
        chatWindow.appendChild(content);

        // Add Invite Container between content and reply area
        const inviteContainer = document.createElement('div');
        inviteContainer.id = `dmm-invite-container-${conversationId}`;
        inviteContainer.classList.add('dmm-invite-container');
        inviteContainer.innerHTML = `
            <input type="text" id="dmm-invite-input-${conversationId}" name="dmm_invite_input" placeholder="Inviter (nom1, nom2, ...)">
        `;
        chatWindow.appendChild(inviteContainer);

        // --- Create Reply Area ---
        const replyDiv = document.createElement('div');
        replyDiv.classList.add('custom-chat-reply');
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Écrire un message...';
        textarea.setAttribute('aria-label', 'Message reply input');
        const sendButton = document.createElement('button');
        sendButton.textContent = 'Envoyer';
        replyDiv.appendChild(textarea);
        replyDiv.appendChild(sendButton);
        chatWindow.appendChild(replyDiv);

        // --- Create Hidden Menus/Panels ---
        // More Options Menu
        const moreOptionsMenu = document.createElement('div'); moreOptionsMenu.classList.add('more-opts-menu');
         const inviteItem = document.createElement('div'); inviteItem.classList.add('menu-item'); inviteItem.textContent = 'Inviter / Cacher Invite'; inviteItem.dataset.action = 'toggle_invite_input'; moreOptionsMenu.appendChild(inviteItem);
         const markUnreadItem = document.createElement('div'); markUnreadItem.classList.add('menu-item'); markUnreadItem.textContent = 'Marquer non lu'; markUnreadItem.dataset.action = 'mark_unread'; moreOptionsMenu.appendChild(markUnreadItem);
         const deleteItem = document.createElement('div'); deleteItem.classList.add('menu-item'); deleteItem.textContent = 'Supprimer'; deleteItem.dataset.action = 'delete'; moreOptionsMenu.appendChild(deleteItem);
         const headerBtnMenu = document.createElement('div'); headerBtnMenu.classList.add('menu-item'); headerBtnMenu.textContent = 'Entête'; headerBtnMenu.dataset.action = 'header'; moreOptionsMenu.appendChild(headerBtnMenu); // Button inside menu
         const settingsHr = document.createElement('hr'); moreOptionsMenu.appendChild(settingsHr);
         // Specific Color Setting
         const convoSettingsWrapper = document.createElement('div'); convoSettingsWrapper.classList.add('convo-settings-item');
         const specificColorLabel = document.createElement('label'); specificColorLabel.textContent = 'Couleur Spécifique:'; specificColorLabel.htmlFor = `dmm-specific-cb-${conversationId}`;
         const specificColorCheckbox = document.createElement('input'); specificColorCheckbox.type = 'checkbox'; specificColorCheckbox.id = `dmm-specific-cb-${conversationId}`; specificColorCheckbox.title = 'Activer une couleur unique pour cette conversation';
         const specificColorInput = document.createElement('input'); specificColorInput.type = 'color'; specificColorInput.id = `dmm-specific-color-${conversationId}`; specificColorInput.title = 'Choisir la couleur spécifique pour cette conversation';
         convoSettingsWrapper.appendChild(specificColorLabel); convoSettingsWrapper.appendChild(specificColorCheckbox); convoSettingsWrapper.appendChild(specificColorInput);
         moreOptionsMenu.appendChild(convoSettingsWrapper);
         // Mute Options
         const muteOptionsTitle = document.createElement('div'); muteOptionsTitle.textContent = 'Mute Options:'; muteOptionsTitle.style.padding = '6px 15px 3px'; muteOptionsTitle.style.fontSize = '0.8em'; muteOptionsTitle.style.color = '#aaa'; muteOptionsTitle.style.fontWeight = 'bold'; moreOptionsMenu.appendChild(muteOptionsTitle);
         const muteOptionsContainer = document.createElement('div'); muteOptionsContainer.classList.add('mute-options-container');
         const muteChoices = [
            { label: 'Unmute', duration: MUTE_DURATIONS.UNMUTE },
            { label: 'Mute 2 min', duration: MUTE_DURATIONS.TWO_MINUTES },
            { label: 'Mute 15 min', duration: MUTE_DURATIONS.FIFTEEN_MINUTES },
            { label: 'Mute 1 hour', duration: MUTE_DURATIONS.ONE_HOUR },
            { label: 'Mute Forever', duration: MUTE_DURATIONS.FOREVER }
         ];
         muteChoices.forEach(choice => {
           const item = document.createElement('div'); item.classList.add('menu-item', 'mute-option-item');
           const checkmarkSpan = document.createElement('span'); checkmarkSpan.classList.add('checkmark'); checkmarkSpan.innerHTML = '✓'; item.appendChild(checkmarkSpan);
           const textSpan = document.createElement('span'); textSpan.classList.add('item-text'); textSpan.textContent = choice.label; item.appendChild(textSpan);
           item.dataset.duration = choice.duration === null ? 'null' : String(choice.duration);
           item.dataset.originalLabel = choice.label; item.title = `${choice.label}`;
           muteOptionsContainer.appendChild(item);
         });
         moreOptionsMenu.appendChild(muteOptionsContainer);
        chatWindow.appendChild(moreOptionsMenu);

        // Modify menu click handler
        moreOptionsMenu.addEventListener('click', (event) => {
            // Handle menu item clicks: standard actions, mute options, settings clicks
            const menuItem = event.target.closest('.menu-item:not(.convo-settings-item):not(.mute-option-item)');
            const settingsItem = event.target.closest('.convo-settings-item');
            const muteOptionItem = event.target.closest('.mute-option-item');

            if (menuItem) { // Standard actions (invite, delete, mark unread, header)
                const action = menuItem.dataset.action;

                // --- Handle 'header' action ---
                if (action === 'header') {
                    event.stopPropagation(); // Prevent menu from closing itself immediately
                    const isDisplayed = headerPanel.style.display === 'block';
                    closeOtherPopups(isDisplayed ? 'none' : 'header');
                    headerPanel.style.display = isDisplayed ? 'none' : 'block';
                    if (!isDisplayed) {
                        updateHeaderHistory(); // Populate history when opened
                        setTimeout(() => {
                            if (!clickOutsideHeaderHandler) {
                                clickOutsideHeaderHandler = (e) => {
                                    if (!headerPanel.contains(e.target) && !menuItem.contains(e.target)) {
                                        closeOtherPopups('none');
                                    }
                                };
                                document.addEventListener('click', clickOutsideHeaderHandler, true);
                            }
                        }, 0);
                    }
                    return;
                }

                // Handle other actions
                if (action === 'toggle_invite_input') {
                    const invContainer = document.getElementById(`dmm-invite-container-${conversationId}`);
                    const invInput = document.getElementById(`dmm-invite-input-${conversationId}`);
                    if (invContainer && invInput) {
                        const isVisible = invContainer.style.display === 'block';
                        invContainer.style.display = isVisible ? 'none' : 'block';
                        menuItem.classList.toggle('invite-active', !isVisible);
                        if (!isVisible) {
                            setTimeout(() => invInput.focus(), 50);
                        }
                    }
                } else {
                    closeOtherPopups('none');
                }

                try {
                    const cData = ACTIVE_CONVERSATIONS[conversationId];
                    const currentOriginalWindow = cData?.originalWindow;
                    const messagerie = unsafeWindow?.nav?.getMessagerie();

                    if (action === 'mark_unread') {
                        if(messagerie) {
                            messagerie.notReadMessage(conversationId);
                            setTimeout(() => closeThisChatWindow({ removeOriginal: true }), 100);
                        } else {
                            alert("Erreur: Messagerie non trouvée.");
                        }
                    } else if (action === 'delete') {
                        if(messagerie) {
                            messagerie.deleteMessage(conversationId);
                            setTimeout(() => closeThisChatWindow({ removeOriginal: true }), 100);
                        } else {
                            alert("Erreur: Messagerie non trouvée.");
                        }
                    }
                } catch (e) {
                    alert(`Une erreur est survenue lors de l'action ${action}`);
                }

            } else if (muteOptionItem) {
                // ...existing mute option handling code...
            } else if (settingsItem) {
                // ...existing settings handling code...
            }
        });

        // Header Panel
        const headerPanel = document.createElement('div'); headerPanel.classList.add('header-panel');
        headerPanel.innerHTML = `
            <div class="header-input-container">
                <input type="text" maxlength="${MAX_HEADER_LENGTH}" placeholder="Entrez un entête...">
                <span class="checkmark-btn" title="Ajouter l'entête">✓</span>
            </div>
            <div class="header-history-container">
                <div class="header-history-list"></div>
            </div>`;
        chatWindow.appendChild(headerPanel);

        // Participants Panel
        const participantsPanel = document.createElement('div'); participantsPanel.classList.add('participants-panel');
        const panelHeader = document.createElement('div'); panelHeader.classList.add('participants-panel-header'); panelHeader.textContent = 'Participants';
        const closePanelBtn = document.createElement('span'); closePanelBtn.classList.add('close-panel-btn'); closePanelBtn.innerHTML = '×'; closePanelBtn.title = 'Fermer';
        panelHeader.appendChild(closePanelBtn); participantsPanel.appendChild(panelHeader);
        const participantsListDiv = document.createElement('div'); participantsListDiv.classList.add('participants-panel-list'); participantsPanel.appendChild(participantsListDiv);
        chatWindow.appendChild(participantsPanel);

        // Color Picker Panel
        const colorPickerPanel = document.createElement('div'); colorPickerPanel.classList.add('color-picker-panel');
         const colorLabel = document.createElement('label'); colorLabel.textContent = 'Couleur Globale :'; colorPickerPanel.appendChild(colorLabel);
         const colorInput = document.createElement('input'); colorInput.type = 'color'; colorInput.value = getSavedGlobalThemeColor(); colorPickerPanel.appendChild(colorInput);
         const resetColorBtn = document.createElement('span'); resetColorBtn.textContent = '❌'; resetColorBtn.title = 'Rétablir la couleur par défaut'; resetColorBtn.classList.add('reset-color-btn'); colorPickerPanel.appendChild(resetColorBtn);
        chatWindow.appendChild(colorPickerPanel);

        // Resize Handle
        const resizeHandle = document.createElement('div'); resizeHandle.classList.add('resize-handle'); resizeHandle.title = 'Redimensionner';
        chatWindow.appendChild(resizeHandle);

        // --- Add Skeleton Window to DOM ---
        document.body.appendChild(chatWindow);
        makeDraggable(chatWindow);
        makeResizable(chatWindow, resizeHandle);
        bringWindowToFront(chatWindow); // Bring new window to front

        // --- Define close function and other handlers early ---
        let clickOutsideMenuHandler = null, clickOutsidePanelHandler = null, clickOutsideColorPickerHandler = null, clickOutsideHeaderHandler = null;

        const closeOtherPopups = (except) => {
           if (except !== 'menu' && moreOptionsMenu.style.display === 'block') {
               moreOptionsMenu.style.display = 'none';
               if (clickOutsideMenuHandler) document.removeEventListener('click', clickOutsideMenuHandler, true);
               clickOutsideMenuHandler = null;
           }
           if (except !== 'header' && headerPanel.style.display === 'block') {
               headerPanel.style.display = 'none';
               if (clickOutsideHeaderHandler) document.removeEventListener('click', clickOutsideHeaderHandler, true);
               clickOutsideHeaderHandler = null;
           }
           if (except !== 'panel' && participantsPanel.classList.contains('active')) {
               participantsPanel.classList.remove('active');
               if (clickOutsidePanelHandler) document.removeEventListener('click', clickOutsidePanelHandler, true);
               clickOutsidePanelHandler = null;
           }
           if (except !== 'color' && colorPickerPanel.style.display === 'block') {
               colorPickerPanel.style.display = 'none';
               if (clickOutsideColorPickerHandler) document.removeEventListener('click', clickOutsideColorPickerHandler, true);
               clickOutsideColorPickerHandler = null;
           }
        };

        const closeThisChatWindow = (options = { removeOriginal: true }) => {
            chatWindow.removeEventListener('mousedown', clearNotification, true);
            chatWindow.removeEventListener('focusin', clearNotification);
            // Original close function handles interval clearing, data deletion, last seen ID saving
            closeChatWindow(conversationId, options);
            // Cleanup click handlers
            if (clickOutsideMenuHandler) document.removeEventListener('click', clickOutsideMenuHandler, true);
            if (clickOutsidePanelHandler) document.removeEventListener('click', clickOutsidePanelHandler, true);
            if (clickOutsideColorPickerHandler) document.removeEventListener('click', clickOutsideColorPickerHandler, true);
            if (clickOutsideHeaderHandler) document.removeEventListener('click', clickOutsideHeaderHandler, true);
            clickOutsideMenuHandler = clickOutsidePanelHandler = clickOutsideColorPickerHandler = clickOutsideHeaderHandler = null;
        };

        // --- Attach Event Listeners that work on the Skeleton ---
        const clearNotification = () => {
            const convData = ACTIVE_CONVERSATIONS[conversationId];
            if (convData && convData.hasUnreadNotification) {
                convData.hasUnreadNotification = false; // Clear flag regardless of mute
                if (!isConversationMuted(conversationId)) {
                    // Only remove visual style if not muted
                    const currentWindow = ACTIVE_CONVERSATIONS[conversationId]?.customWindow;
                    if (currentWindow) currentWindow.classList.remove('has-unread-notification');
                }
            }
        };
        chatWindow.addEventListener('mousedown', clearNotification, true);
        chatWindow.addEventListener('focusin', clearNotification);

        closeBtn.onclick = () => closeThisChatWindow({ removeOriginal: true });

        sendButton.onclick = () => {
            const selectedHeader = getSelectedHeader();
            const messageText = selectedHeader ?
                `| ${selectedHeader} |\n\n${textarea.value.trim()}` : // Wrap header
                textarea.value.trim();
            const cData = ACTIVE_CONVERSATIONS[conversationId];
            if (!messageText || sendButton.disabled) { if (!messageText) textarea.focus(); return; }
            if (!cData) { alert("Erreur critique DMM: Données de conversation manquantes."); return; }

            const currentOriginalWindow = cData.originalWindow;
            // Robust check for original window and elements
            if (!currentOriginalWindow || !document.body.contains(currentOriginalWindow)) {
                alert("Erreur DMM: Référence à la fenêtre originale perdue. La page pourrait nécessiter un rafraîchissement.");
                sendButton.disabled = true; sendButton.textContent = 'Erreur Orig.'; return;
            }
            const originalTextarea = currentOriginalWindow.querySelector('.zone_reponse textarea[name=nm_texte]');
            const originalSendButton = currentOriginalWindow.querySelector('.zone_reponse .btnTxt[onclick*="sendMessage"]');
            if (!originalTextarea || !originalSendButton) {
                alert("Erreur DMM: Éléments d'envoi originaux non trouvés. La page pourrait nécessiter un rafraîchissement.");
                sendButton.disabled = true; sendButton.textContent = 'Erreur Config'; return;
            }

            sendButton.disabled = true;
            const originalButtonText = sendButton.textContent; // Store original text
            sendButton.textContent = 'Envoi...';
            let sendAttemptError = null;
            let originalClickSuccess = false;

            try {
                originalTextarea.value = messageText;
                originalSendButton.click();
                originalClickSuccess = true;
                textarea.value = ''; // Clear custom textarea on success
            } catch (e) {
                sendAttemptError = e;
                sendButton.textContent = 'Erreur Envoi';
            }

            // Re-enable button after a delay, regardless of fetch outcome (fetch is for update, not send confirmation)
            setTimeout(() => {
                // Check if button still exists
                const currentSendButton = document.querySelector(`#${windowId} .custom-chat-reply button`);
                if (currentSendButton) {
                    currentSendButton.disabled = false;
                    currentSendButton.textContent = originalButtonText; // Restore original text
                }
                 if (sendAttemptError && !originalClickSuccess) { // Show alert only if click itself failed
                     alert(`Erreur DMM: Échec de l'envoi initial du message.\n${sendAttemptError.message}`);
                 }
            }, 1500); // Re-enable after 1.5 seconds

            // Fetch update immediately IF original click succeeded
            if (originalClickSuccess) {
                GM_xmlhttpRequest({
                    method: "GET", url: `https://www.dreadcast.net/Menu/Messaging/action=OpenMessage&id_conversation=${conversationId}`, timeout: 10000,
                    onload: function(response) {
                        // Check if our window still exists
                        const latestCData = ACTIVE_CONVERSATIONS[conversationId];
                        if (latestCData && latestCData.customWindow && document.body.contains(latestCData.customWindow)) {
                            if (response.status === 200 && response.responseText) {
                                try {
                                    handleOpenMessageResponse(conversationId, response.responseText);
                                } catch (handlerError) { }
                            } else { }
                        }
                    },
                    onerror: function(error) { },
                    ontimeout: function() { }
                });
            }
        }; // End sendButton.onclick

        textarea.addEventListener('keypress', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendButton.click(); } });
        head.addEventListener('dblclick', (e) => {
            // Prevent collapse if clicking interactive elements in header
            if (e.target.closest('.controls span') || e.target.closest('.mute-status-display')) return;
            const isCollapsed = chatWindow.classList.toggle('collapsed');
            if (isCollapsed) { closeOtherPopups('none'); }
        });

        // Theme Picker Listeners
        clickOutsideColorPickerHandler = (event) => { if (!colorPickerPanel.contains(event.target) && !themeBtn.contains(event.target)) { closeOtherPopups('none'); } };
        themeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isDisplayed = colorPickerPanel.style.display === 'block';
            closeOtherPopups(isDisplayed ? 'none' : 'color');
            colorInput.value = getSavedGlobalThemeColor(); // Ensure current global color shown
            colorPickerPanel.style.display = isDisplayed ? 'none' : 'block';
            if (!isDisplayed) { setTimeout(() => { document.addEventListener('click', clickOutsideColorPickerHandler, true); }, 0); }
        });
        colorInput.addEventListener('input', (event) => { saveGlobalThemeColor(event.target.value); });
        resetColorBtn.addEventListener('click', () => { colorInput.value = DEFAULT_THEME_COLOR; saveGlobalThemeColor(DEFAULT_THEME_COLOR); });

        // More Options Menu Listeners
        clickOutsideMenuHandler = (event) => { if (!moreOptionsMenu.contains(event.target) && !moreOptsBtn.contains(event.target)) { closeOtherPopups('none'); } };
        moreOptsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isDisplayed = moreOptionsMenu.style.display === 'block';
            closeOtherPopups(isDisplayed ? 'none' : 'menu');
            if (!isDisplayed) {
                // Update BOTH settings and mute UI when menu opens
                populateConversationSettingsUI(conversationId, specificColorCheckbox, specificColorInput);
                updateMuteOptionsUI(chatWindow, conversationId); // Pass chatWindow reference
            }
            moreOptionsMenu.style.display = isDisplayed ? 'none' : 'block';
            if (!isDisplayed) { setTimeout(() => { document.addEventListener('click', clickOutsideMenuHandler, true); }, 0); }
        });
        moreOptionsMenu.addEventListener('click', (event) => {
           // Handle menu item clicks: standard actions, mute options, settings clicks
            const menuItem = event.target.closest('.menu-item:not(.convo-settings-item):not(.mute-option-item)');
            const settingsItem = event.target.closest('.convo-settings-item');
            const muteOptionItem = event.target.closest('.mute-option-item');

            if (menuItem) { // Standard actions (invite, delete, mark unread, header)
                const action = menuItem.dataset.action;
                if (action !== 'header') { // Don't close menu for header action
                     closeOtherPopups('none');
                }
                try {
                    const cData = ACTIVE_CONVERSATIONS[conversationId];
                    const currentOriginalWindow = cData?.originalWindow;
                    const messagerie = unsafeWindow?.nav?.getMessagerie();

                    if (action === 'invite') { }
                    else if (action === 'mark_unread') { if(messagerie) { messagerie.notReadMessage(conversationId); setTimeout(() => closeThisChatWindow({ removeOriginal: true }), 100); } else { alert("Erreur: Messagerie non trouvée."); }}
                    else if (action === 'delete') { if(messagerie) { messagerie.deleteMessage(conversationId); setTimeout(() => closeThisChatWindow({ removeOriginal: true }), 100); } else { alert("Erreur: Messagerie non trouvée."); } }
                    // Header action is handled by its own listener below
                } catch (e) { alert(`Une erreur est survenue lors de l'action ${action}`); }

            } else if (muteOptionItem) { // Mute Option Click
                const durationStr = muteOptionItem.dataset.duration;
                let durationMs;
                if (durationStr === 'null') durationMs = null;
                else durationMs = parseInt(durationStr, 10);

                if (typeof durationMs === 'number' || durationMs === null) {
                    const currentEndTime = getConversationMuteEndTime(conversationId);
                    // Prevent clicking "Unmute" if already unmuted
                    if (!(durationMs === MUTE_DURATIONS.UNMUTE && currentEndTime === 0)) {
                       setConversationMuted(conversationId, durationMs);
                       // No need to close menu here, updateMuteOptionsUI will refresh it
                    }
                } else { }

            } else if (settingsItem) { // Color Settings Click (on wrapper)
                // Trigger click on checkbox if label is clicked
                if (event.target.tagName === 'LABEL') {
                    const inputId = event.target.htmlFor;
                    const inputElement = document.getElementById(inputId);
                    if (inputElement && inputElement.type === 'checkbox') inputElement.click();
                }
                // Allow event to propagate for direct clicks on checkbox/color input
            }
        });
        // Specific listeners for color settings inputs
        specificColorCheckbox.addEventListener('change', (event) => { const isEnabled = event.target.checked; const currentColor = specificColorInput.value; specificColorInput.disabled = !isEnabled; setConversationSetting(conversationId, { enabled: isEnabled, color: currentColor }); applyCurrentTheme(chatWindow, conversationId); });
        specificColorInput.addEventListener('input', (event) => { const newColor = event.target.value; if (!specificColorInput.disabled) { setConversationSetting(conversationId, { enabled: true, color: newColor }); applyCurrentTheme(chatWindow, conversationId); } });

        // Participants Panel Listeners
        clickOutsidePanelHandler = (event) => { if (!participantsPanel.contains(event.target) && !participantsBtn.contains(event.target)) { closeOtherPopups('none'); } };
        participantsBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const cData = ACTIVE_CONVERSATIONS[conversationId]; // Get current data
            if (!cData) return;
            const isActive = participantsPanel.classList.contains('active');
            closeOtherPopups(isActive ? 'none' : 'panel');
            // Populate ONLY when opening
            if (!isActive) {
               const listHtml = cData.participants && cData.participants.length > 0
                   ? cData.participants.join('<br>')
                   : '<p style="color:#888;font-style:italic;">Aucun participant trouvé.</p>';
               participantsListDiv.innerHTML = listHtml;
            }
            participantsPanel.classList.toggle('active');
            if (!isActive) { setTimeout(() => { document.addEventListener('click', clickOutsidePanelHandler, true); }, 0); }
        });
        closePanelBtn.addEventListener('click', () => { closeOtherPopups('none'); });

        // Header Panel Listeners (using headerBtnMenu from the options menu)
         clickOutsideHeaderHandler = (event) => { if (!headerPanel.contains(event.target) && !headerBtnMenu.contains(event.target)) { closeOtherPopups('none'); } };
         headerBtnMenu.addEventListener('click', (event) => { // Attach to the menu item
             event.stopPropagation(); // Stop menu from closing itself
             const isDisplayed = headerPanel.style.display === 'block';
             closeOtherPopups(isDisplayed ? 'none' : 'header'); // Close others except header panel
             headerPanel.style.display = isDisplayed ? 'none' : 'block';
             if (!isDisplayed) {
                 updateHeaderHistory(); // Populate history when opened
                 setTimeout(() => { document.addEventListener('click', clickOutsideHeaderHandler, true); }, 0); // Add close listener
             }
         });
        // Listener for header input submit button
        headerPanel.querySelector('.checkmark-btn').addEventListener('click', () => {
            const headerInput = headerPanel.querySelector('input');
            const header = headerInput.value.trim();
            if (header) {
                addHeaderToHistory(header);
                setSelectedHeader(header); // Auto-select the newly added header
                headerInput.value = '';
                updateHeaderHistory(); // Refresh display
            }
        });
        // Listener for clicking history items
        headerPanel.querySelector('.header-history-list').addEventListener('click', (e) => {
            const item = e.target.closest('.header-history-item');
            if (item) {
                const header = item.dataset.header;
                const currentSelected = getSelectedHeader();
                setSelectedHeader(currentSelected === header ? '' : header); // Toggle selection
                updateHeaderHistory(); // Update visuals
            }
        });
        // --- End Header Panel listeners ---

        // --- Step 2: Prepare Conversation Data Object (minimal initial state) ---
        ACTIVE_CONVERSATIONS[conversationId] = {
            customWindow: chatWindow,
            originalWindow: originalWindowRef,
            latestMessageId: null, // Set after fetch
            oldestMessageId: null, // Set after fetch
            allMessagesLoaded: false, // Assume not loaded
            isLoadingOlder: false,
            participants: [], // Set after fetch
            hasUnreadNotification: false,
            unreadSeparatorVisible: false, // Set after build
            muteTimerIntervalId: null // Set after fetch
        };

        // --- Step 3: Asynchronously Fetch and Build Content ---
        (async () => {
            let fetchedMessages = [];
            let fetchedParticipants = [];
            let initialLatestId = null;
            let initialOldestId = null;
            let allMessagesLoaded = true;
            let fetchError = null;

            try {
                // Ensure My Name is available
                if (!MY_NAME) MY_NAME = getMyCharacterName();
                if (!MY_NAME) throw new Error("Character name unavailable for fetching messages.");

                // Fetch initial data using the existing function
                const initialResult = await parseAndFetchInitialMessages(originalWindowRef, conversationId);
                if (!initialResult || typeof initialResult !== 'object') {
                    throw new Error(`parseAndFetchInitialMessages returned invalid result for ${conversationId}`);
                }
                fetchedMessages = initialResult.messages;
                fetchedParticipants = initialResult.participants;
                initialLatestId = initialResult.latestId;
                initialOldestId = initialResult.oldestId;
                allMessagesLoaded = initialResult.allLoaded;

            } catch (error) {
                fetchError = error;
            }

            // --- Re-check if window and data still exist before updating DOM ---
            const currentConvData = ACTIVE_CONVERSATIONS[conversationId];
            const currentChatWindow = document.getElementById(windowId); // Re-fetch window by ID

            if (!currentConvData || !currentChatWindow || !document.body.contains(currentChatWindow)) {
                // Ensure original window is handled if left in a hidden state
                if (originalWindowRef && originalWindowRef.dataset.modernized !== 'replaced' && originalWindowRef.dataset.modernized !== 'revealed_for_invite' && originalWindowRef.parentNode) {
                    try {
                        originalWindowRef.remove();
                    } catch(e){ }
                }
                return; // Stop processing if window was closed
            }

            // --- Update Conversation Data with Fetched Info ---
            currentConvData.participants = fetchedParticipants;
            currentConvData.latestMessageId = initialLatestId;
            currentConvData.oldestMessageId = initialOldestId;
            currentConvData.allMessagesLoaded = allMessagesLoaded;

            // --- Populate Content Area or Show Error ---
            let separatorInserted = false;
            if (content) { // Ensure content area still exists
                if (!fetchError) {
                    content.innerHTML = ''; // Clear loader FIRST
                    try {
                       const buildResult = buildInitialChatUI(fetchedMessages, content, conversationId, allMessagesLoaded);
                       // Update data with potentially more accurate IDs from buildResult
                       currentConvData.latestMessageId = buildResult.latestId ?? initialLatestId;
                       currentConvData.oldestMessageId = buildResult.oldestId ?? initialOldestId;
                       currentConvData.unreadSeparatorVisible = buildResult.separatorInserted;
                       separatorInserted = buildResult.separatorInserted; // Use for logging
                    } catch (buildError) {
                        content.innerHTML = `<div class="dmm-error">Erreur lors de l'affichage des messages.</div>`;
                        fetchError = buildError; // Mark as error state
                    }
                } else {
                    // Show fetch error in content area
                    content.innerHTML = `<div class="dmm-error">Erreur: ${fetchError.message || 'Impossible de charger les messages.'}</div>`;
                }
            } else {
                 fetchError = fetchError || new Error("Content area missing"); // Ensure error state if content missing
            }


            // --- Remove loading class from window ---
            currentChatWindow.classList.remove('dmm-loading-initial');

            // --- Setup Mute Timer Interval (now that IDs are potentially known) ---
            const muteTimerIntervalId = setInterval(() => {
               const convDataCheck = ACTIVE_CONVERSATIONS[conversationId];
               const windowCheck = document.getElementById(windowId); // Check by ID each time
               if (convDataCheck && windowCheck && document.body.contains(windowCheck)) {
                    updateHeaderMuteStatus(windowCheck, conversationId);
                    isConversationMuted(conversationId); // Checks expiry, updates sidebar if needed
                    const currentMenu = windowCheck.querySelector('.more-opts-menu');
                    if (currentMenu && currentMenu.style.display === 'block') {
                        updateMuteOptionsUI(windowCheck, conversationId);
                    }
               } else {
                   // Window gone, clear interval
                    const intervalIdToClear = ACTIVE_CONVERSATIONS[conversationId]?.muteTimerIntervalId;
                    if (intervalIdToClear) {
                        clearInterval(intervalIdToClear);
                        // Check existence before deleting property
                        if (ACTIVE_CONVERSATIONS[conversationId]) {
                            delete ACTIVE_CONVERSATIONS[conversationId].muteTimerIntervalId;
                        }
                    }
               }
            }, 20000); // 20 seconds
            currentConvData.muteTimerIntervalId = muteTimerIntervalId; // Store interval ID

            // --- Final UI Updates ---
            updateHeaderMuteStatus(currentChatWindow, conversationId);
            // Initial Mute options UI update (checkmarks etc.) only if menu exists
            const menuForUpdate = currentChatWindow.querySelector('.more-opts-menu');
            if(menuForUpdate) {
                updateMuteOptionsUI(currentChatWindow, conversationId);
            }

            // Focus textarea after content is loaded (or error shown)
            if(textarea && document.body.contains(textarea)) {
               setTimeout(() => textarea.focus(), 50);
            }

            // Mark original window as replaced *only* if everything succeeded
            if (!fetchError && originalWindowRef && originalWindowRef.parentNode) {
                originalWindowRef.dataset.modernized = 'replaced';
            } else if (fetchError && originalWindowRef) {
                 // Mark original window with error state if fetch/build failed
                 originalWindowRef.dataset.modernized = 'error_post_fetch';
            }

        })(); // --- End of async function execution ---

    } // --- END of createCustomWindow function ---
     // =======================================================================
     // =================== END OF MODIFIED createCustomWindow ================
     // =======================================================================


    // --- Click Simulation Functions ---
    function simulateClick(element) {
        return new Promise(resolve => {
            if (!element || !document.body.contains(element)) {
                resolve(false); return;
            }
            try { element.click(); resolve(true); }
            catch (e) { resolve(false); }
        });
    }
    async function initiateDoubleClick(selector, container = document) {
        const logPrefix = `DMM initiateDoubleClick (.click() x2) (${selector}):`;
        let element = null;
        try {
            element = container.querySelector(selector);
            if (!element || !document.body.contains(element)) { resolve(false); return; }
            element.click(); // First click
            await new Promise(r => setTimeout(r, REFIND_DELAY));
            element = null; // Reset before re-find
            element = container.querySelector(selector); // RE-FIND ELEMENT
            if (!element || !document.body.contains(element)) { resolve(false); return; }
            element.click(); // Second click
            return true;
        } catch (error) { return false; }
    }


    // --- Core Logic Handlers ---

    async function handleNewMessageEvent(conversationId, folderId) {
        const MAX_ATTEMPTS = 5;
        const RETRY_DELAY = 100;
        const logPrefix = `DMM /Check Sim Handler [${conversationId}/${folderId}]:`;
        let menuWasOpenedByScriptOnSuccessfulAttempt = false;
        let overallSuccess = false;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            let currentAttemptMenuOpened = false;

            try {
                // --- Step 1: Ensure Main Message Menu is Visible ---
                const messageListContainer = document.getElementById('liste_messages');
                const mainMenuButton = document.getElementById('display_messagerie');
                const isListVisibleCheck = () => messageListContainer && document.body.contains(messageListContainer) && messageListContainer.offsetParent !== null && getComputedStyle(messageListContainer).visibility !== 'hidden' && getComputedStyle(messageListContainer).display !== 'none';

                if (!isListVisibleCheck()) {
                    if (!mainMenuButton) {
                        return;
                    }
                    currentAttemptMenuOpened = true;
                    await new Promise(r => setTimeout(r, UI_CLICK_DELAY));
                    const click1Success = await simulateClick(mainMenuButton);
                    if (!click1Success) {
                        await new Promise(r => setTimeout(r, RETRY_DELAY));
                        continue;
                    }
                    await new Promise(r => setTimeout(r, UI_WAIT_DELAY));
                    try {
                        await waitForElement('#liste_messages');
                    } catch (waitError) {
                        await new Promise(r => setTimeout(r, RETRY_DELAY));
                        continue;
                    }
                }

                // --- Step 2: Ensure Correct Folder List is Visible ---
                const folderListULSelector = '#liste_messages ul#folder_list';
                let folderListUL = document.querySelector(folderListULSelector);
                const isFolderListVisibleCheck = () => folderListUL && folderListUL.offsetParent !== null && getComputedStyle(folderListUL).display !== 'none';
                if (!isFolderListVisibleCheck() && folderListUL) {
                     folderListUL.style.display = 'block'; // Force visible if needed
                     await new Promise(r => setTimeout(r, UI_WAIT_DELAY / 2));
                } else if (!folderListUL) {
                     await new Promise(r => setTimeout(r, RETRY_DELAY));
                     continue;
                 }

                // --- Step 3: Click Target Folder LI ---
                folderListUL = document.querySelector(folderListULSelector); // Re-select
                const targetFolderLiSelector = `li#folder_${folderId}`;
                if (!folderListUL || !document.body.contains(folderListUL)) {
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                    continue;
                }

                let targetFolderLi = null;
                try {
                    targetFolderLi = await waitForElement(targetFolderLiSelector, WAIT_FOR_ELEMENT_TIMEOUT, folderListUL);
                } catch (findError) {
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                    continue;
                }

                // Click the folder ONLY if it's not already the active one
                const currentFolderSpan = document.querySelector('#current_folder');
                const currentFolderId = currentFolderSpan?.dataset?.id;
                let folderClicked = false;
                if(currentFolderId !== folderId) {
                    await new Promise(r => setTimeout(r, UI_CLICK_DELAY));
                    const click3Success = await simulateClick(targetFolderLi);
                    if(!click3Success) {
                         await new Promise(r => setTimeout(r, RETRY_DELAY));
                         continue;
                    }
                    folderClicked = true;
                    // Wait longer if we clicked the folder, as it triggers an XHR load
                    await new Promise(r => setTimeout(r, UI_WAIT_DELAY * 1.5)); // Increased wait
                }

                // --- Step 4: Find and Double-Click the Message LI ---
                // Target the specific message LI within the main list container
                const messageListContentUL = document.querySelector('#liste_messages .content ul');
                if (!messageListContentUL || !document.body.contains(messageListContentUL)) {
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                    continue;
                }
                const targetMessageSelector = `li#message_${conversationId}`;

                let targetMessageLi = null;
                try {
                    // Wait longer if the folder was just clicked
                    targetMessageLi = await waitForElement(targetMessageSelector, WAIT_FOR_ELEMENT_TIMEOUT * (folderClicked ? 3 : 2) , messageListContentUL);
                } catch (findMsgError) {
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                    continue;
                }

                // Use the messageListContentUL as the container for the double-click simulation
                const success = await initiateDoubleClick(targetMessageSelector, messageListContentUL);

                if (success) {
                    overallSuccess = true;
                    menuWasOpenedByScriptOnSuccessfulAttempt = currentAttemptMenuOpened;
                    break; // Exit the retry loop
                } else {
                    await new Promise(r => setTimeout(r, RETRY_DELAY));
                    continue;
                }

            } catch (error) {
                await new Promise(r => setTimeout(r, RETRY_DELAY));
                continue;
            }
        } // --- END of for loop (attempts) ---

        if (!overallSuccess) {
        }

        // --- Auto-close Menu ---
        if (overallSuccess && menuWasOpenedByScriptOnSuccessfulAttempt) {
            await new Promise(r => setTimeout(r, 150)); // Short delay

            const finalMenuButton = document.getElementById('display_messagerie');
            const finalList = document.getElementById('liste_messages');
            const finalIsListVisibleCheck = () => finalList && document.body.contains(finalList) && finalList.offsetParent !== null && getComputedStyle(finalList).visibility !== 'hidden' && getComputedStyle(finalList).display !== 'none';

            if (finalMenuButton && finalIsListVisibleCheck()) {
                 await simulateClick(finalMenuButton);
            }
        }

    } // --- END of handleNewMessageEvent ---


    function handleOpenMessageResponse(conversationId, responseText) {
        const conversationData = ACTIVE_CONVERSATIONS[conversationId];
        const isConvoMuted = isConversationMuted(conversationId); // Check conversation-specific mute status

        // Check if window exists OR if it's a user override scenario (where window *should* exist soon)
        const dmmWindowExists = conversationData && conversationData.customWindow && document.body.contains(conversationData.customWindow);
        const isUserOverride = openingMutedOverride === conversationId; // Check if this ID is being overridden

        // If conversation muted AND the DMM window doesn't exist AND it's NOT a user override, suppress the update.
        if (isConvoMuted && !dmmWindowExists && !isUserOverride) {
            return;
        }

        // If window doesn't exist and it's *not* a user override case waiting for the window, abort.
        if (!dmmWindowExists && !isUserOverride) {
            return;
        }
        // At this point, either the window exists, or we expect it to exist shortly due to user override.

        const customContentArea = conversationData?.customWindow?.querySelector('.custom-chat-content');
        // If the window doesn't exist *yet* due to override, customContentArea will be null. This is handled below.
        if (!isUserOverride && !customContentArea) {
            return;
        }

        const currentLatestKnownId = conversationData?.latestMessageId; // This is message_id
        const currentLatestKnownIdNum = currentLatestKnownId ? parseInt(currentLatestKnownId) : 0;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, 'text/html');
            const latestConvList = doc.querySelector('.zone_conversation');
            if (!latestConvList) { return; }

            const serverElements = Array.from(latestConvList.querySelectorAll('.link.conversation[id^="convers_"]'));
            if (serverElements.length === 0) { return; }

            // --- Optimization: Find highest server ID first ---
            let highestServerId = null;
            let highestServerIdNum = 0;
            serverElements.forEach(el => {
                const msgId = el.id.replace('convers_', '');
                if (msgId) {
                    try {
                        const idNum = parseInt(msgId);
                        if (!isNaN(idNum) && idNum > highestServerIdNum) {
                            highestServerId = msgId;
                            highestServerIdNum = idNum;
                        }
                    } catch (e) { /* ignore parse errors */ }
                }
            });

            // --- Optimization: Early exit if client is already up-to-date ---
            if (highestServerIdNum > 0 && highestServerIdNum <= currentLatestKnownIdNum) {
                // Ensure the conversation data's latest ID reflects the server truth if needed
                if (conversationData && highestServerId && highestServerId !== conversationData.latestMessageId) {
                     if (!conversationData.latestMessageId || parseInt(highestServerId) > parseInt(conversationData.latestMessageId)) {
                         conversationData.latestMessageId = highestServerId;
                     }
                }
                return; // Nothing new to add
            }
            // --- End Optimizations ---

            let elementsToProcess = [];

            serverElements.forEach(el => {
                const parsed = parseMessageElement(el);
                if (parsed && parsed.id) {
                     try {
                         const elIdNum = parseInt(parsed.id);
                         if (isNaN(elIdNum)) return; // Skip if ID is not a number

                         // Check if newer than client's known latest ID
                         if (elIdNum > currentLatestKnownIdNum) {
                             // *** Optimization: Check for duplicates in live DOM BEFORE deciding to process/fetch ***
                             // This check requires customContentArea to exist, handle the override case where it might be null temporarily
                             const alreadyExists = customContentArea ? customContentArea.querySelector(`.chat-bubble[data-message-id="${parsed.id}"]`) : false;
                             if (!alreadyExists) {
                                 elementsToProcess.push(el); // Store the element
                             }
                         }
                     } catch (e) { /* ignore parse errors */ }
                 }
            });

            if (elementsToProcess.length > 0) {
                elementsToProcess.reverse(); // Process oldest new message first

                let newlyProcessedRealIds = []; // Store message_ids added
                let fetchPromises = elementsToProcess.map(element => {
                    return new Promise(async (resolve) => {
                        const parsed = parseMessageElement(element); // Parse again to get message_id etc.
                        if (parsed && parsed.id) { // Ensure parsed and id exist
                            // Wait briefly if it's an override, allowing createCustomWindow to potentially finish first
                            if (isUserOverride) await new Promise(r => setTimeout(r, 75)); // Slightly longer delay?

                            // Re-check DMM window/content area status right before fetching content
                            const finalConvDataCheck = ACTIVE_CONVERSATIONS[conversationId];
                            // Content area check is crucial here
                            const finalContentAreaCheck = finalConvDataCheck?.customWindow?.querySelector('.custom-chat-content');

                            // If window/content area still doesn't exist (even after potential override delay), skip adding bubble
                            if (!finalConvDataCheck || !finalConvDataCheck.customWindow || !document.body.contains(finalConvDataCheck.customWindow) || !finalContentAreaCheck) {
                                resolve(); return;
                            }
                            // Final duplicate check within the confirmed content area using message_id
                            if (finalContentAreaCheck.querySelector(`.chat-bubble[data-message-id="${parsed.id}"]`)) {
                                resolve(); return;
                            }

                            fetchMessageContent(parsed.id, conversationId, (content) => { // Use message_id to fetch
                                // Check window status *again* after async fetch returns
                                const finalConvData = ACTIVE_CONVERSATIONS[conversationId];
                                if (!finalConvData || !finalConvData.customWindow || !document.body.contains(finalConvData.customWindow)) { resolve(); return; }
                                const finalContentArea = finalConvData.customWindow.querySelector('.custom-chat-content');
                                if (!finalContentArea) { resolve(); return; }
                                // Check duplicate again *after* fetch, *before* adding
                                if (finalContentArea.querySelector(`.chat-bubble[data-message-id="${parsed.id}"]`)) {
                                        resolve(); return;
                                }

                                const msgData = { ...parsed, content: content };
                                const addedBubble = addBubble(msgData, finalContentArea, conversationId, false, false); // isInitialLoad=false here;
                                if (addedBubble && addedBubble.dataset.messageId) {
                                    newlyProcessedRealIds.push(addedBubble.dataset.messageId);
                                }
                                resolve();
                            });
                        } else { resolve(); }
                    });
                }); // End map

                Promise.all(fetchPromises).then(() => {
                    // Final check after all bubbles *should* have been added
                    const postProcessConvData = ACTIVE_CONVERSATIONS[conversationId];
                    if (!postProcessConvData || !postProcessConvData.customWindow || !document.body.contains(postProcessConvData.customWindow)) { return; }

                    let overallLatestId = postProcessConvData.latestMessageId; // message_id
                    let overallLatestNum = overallLatestId ? parseInt(overallLatestId) : 0;
                    let didUpdateLatest = false;

                    try {
                        newlyProcessedRealIds.forEach(processedId => { // processedId is message_id
                            if (!processedId) return;
                            const processedIdNum = parseInt(processedId);
                            if (!isNaN(processedIdNum) && processedIdNum > overallLatestNum) {
                                overallLatestId = processedId;
                                overallLatestNum = processedIdNum; // Update number for comparison
                                didUpdateLatest = true;
                            }
                        });

                        // Also consider the highest ID seen from the server response itself
                        if (highestServerIdNum > overallLatestNum) {
                             overallLatestId = highestServerId;
                             overallLatestNum = highestServerIdNum;
                             didUpdateLatest = true;
                        }

                        if (didUpdateLatest) {
                            postProcessConvData.latestMessageId = overallLatestId;
                        }
                    } catch (idUpdateError) { }
                }).catch(error => { });
            } else if (highestServerIdNum > 0 && highestServerIdNum > currentLatestKnownIdNum) {
                 // Update latest ID even if no new bubbles were added (they might have been added by another means or filtered)
                 const convDataForIdUpdate = ACTIVE_CONVERSATIONS[conversationId];
                 if (convDataForIdUpdate) { // Ensure data still exists
                    convDataForIdUpdate.latestMessageId = highestServerId;
                 }
             }
        } catch (e) {
        }
    } // --- END of handleOpenMessageResponse ---


    // --- Click Handling on Sidebar ---
    function handleMessageListClick(event) {
        // Ignore simulated clicks
        if (!event.isTrusted) return;

        const messageLi = event.target.closest('li.message[id^="message_"]');
        if (!messageLi) return;

        const conversationId = messageLi.id.replace('message_', '');

        // --- EDIT MODE CHECK (NEW) ---
        if (isEditModeActive) {
            event.preventDefault();
            event.stopPropagation();
            closeEditPopup();
            openEditPopup(conversationId, messageLi);
            return;
        }

        // Mute Handling Logic
        const isMuted = isConversationMuted(conversationId);
        if (isMuted) {
            // Set the override flag
            openingMutedOverride = conversationId;
            // Clear previous timer if any
            if (openingMutedOverrideTimer) clearTimeout(openingMutedOverrideTimer);
            // Set a timer to clear the flag shortly after, in case observer is slow or DC action fails
            openingMutedOverrideTimer = setTimeout(() => {
                if (openingMutedOverride === conversationId) { // Ensure it wasn't changed by another click
                    openingMutedOverride = null;
                }
                openingMutedOverrideTimer = null;
            }, 500); // 500ms should be enough for DC to add the window and observer to react

            // *** DO NOT preventDefault() or stopPropagation() here! ***
            // Let the original Dreadcast click handler proceed to open its own window.
            // The mainObserverCallback will handle the override.
            return;
        }
        // End Mute Handling


        // --- If NOT muted, proceed with existing logic ---
        const customWindowId = `custom-chat-${conversationId}`;
        const existingDMMData = ACTIVE_CONVERSATIONS[conversationId];
        const customWindowElement = document.getElementById(`custom-chat-${conversationId}`);

        if (existingDMMData && customWindowElement && existingDMMData.customWindow === customWindowElement && document.body.contains(customWindowElement)) {
            event.preventDefault(); // Stop Dreadcast from opening its own window
            event.stopPropagation(); // Stop event from bubbling further

            bringWindowToFront(customWindowElement); // Use new function to bring window to front
            if (customWindowElement.classList.contains('collapsed')) { customWindowElement.classList.remove('collapsed'); } // Uncollapse
            const textarea = customWindowElement.querySelector('.custom-chat-reply textarea');
            if (textarea) setTimeout(() => textarea.focus(), 50); // Focus after a tiny delay
            return; // Stop further processing by this handler
        }

        // If an original window was previously revealed for 'invite' and is still in the DOM...
        const revealedOriginal = document.querySelector(`#db_message_${conversationId}[data-modernized="revealed_for_invite"]`);
        if (revealedOriginal && document.body.contains(revealedOriginal)) {
            revealedOriginal.classList.add('hidden-original-databox'); // Re-hide the original
            revealedOriginal.dataset.modernized = ''; // Clear the state
        } // else: No DMM window open, or original not revealed. Allow default Dreadcast action.
    } // --- END of handleMessageListClick ---

    function setupClickListener() {
        const stableParent = document.getElementById('liste_messages');
        if (stableParent) {
            stableParent.removeEventListener('click', handleMessageListClick, true); // Remove first
            stableParent.addEventListener('click', handleMessageListClick, true); // Add listener (capture phase)
        } else {
            setTimeout(setupClickListener, 2000);
        }
    }


    // --- Main Observer Callback (Detects added original windows) ---
    const mainObserverCallback = async (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // Check if the added node is an original Dreadcast message window
                    if (node.nodeType === Node.ELEMENT_NODE && node.id?.startsWith('db_message_')) {
                        const originalWindow = node;
                        const conversationId = originalWindow.id.replace('db_message_', '');

                        // Mute Check Logic
                        const isMuted = isConversationMuted(conversationId);
                        let skipMuteRemoval = false; // Flag to allow modernization even if muted

                        if (isMuted) {
                            // Check if this opening was triggered by user override click
                            if (openingMutedOverride === conversationId) {
                                skipMuteRemoval = true; // Allow modernization
                                openingMutedOverride = null; // Consume the flag
                                if(openingMutedOverrideTimer) clearTimeout(openingMutedOverrideTimer); // Clear timer early
                                openingMutedOverrideTimer = null;
                            } else {
                                // Muted and NOT a user override click (e.g., from /Check simulation)
                                // Check if it hasn't ALREADY been marked/removed to avoid loops
                                if (originalWindow.dataset.modernized !== 'muted_removed') {
                                    originalWindow.dataset.modernized = 'muted_removed'; // Mark state FIRST
                                    try {
                                        // Add an extra check to ensure it's still in the DOM
                                        if (originalWindow.parentNode) {
                                            originalWindow.remove();
                                        }
                                    } catch (e) {
                                    }
                                }
                                continue; // <<< IMPORTANT: Stop processing this node further if muted and not overridden
                            }
                        }
                        // End Mute Check Logic

                        // Skip if already handled/marked (unless overridden)
                        if (['processing', 'replaced', 'error', 'revealed_for_invite', 'muted_removed'].includes(originalWindow.dataset.modernized) && !skipMuteRemoval) {
                             continue;
                        }

                        // --- Proceed with modernization if not muted OR if mute was overridden ---
                        const existingDMMData = ACTIVE_CONVERSATIONS[conversationId];
                        const existingDMMWindow = document.getElementById(`custom-chat-${conversationId}`);

                        if (existingDMMData && existingDMMWindow && document.body.contains(existingDMMWindow)) {
                            // Update reference and hide original if DMM window already exists
                            existingDMMData.originalWindow = originalWindow;
                            originalWindow.classList.add('hidden-original-databox');
                            originalWindow.dataset.modernized = 'replaced';
                        } else {
                            // This is a NEW conversation window to modernize
                            originalWindow.dataset.modernized = 'processing';
                            originalWindow.classList.add('hidden-original-databox'); // Hide it

                            if (!MY_NAME) MY_NAME = getMyCharacterName();
                            if (!MY_NAME) {
                                alert("Erreur critique DMM: Impossible d'obtenir le nom du personnage. Impossible d'ouvrir la fenêtre de message DMM.");
                                originalWindow.classList.remove('hidden-original-databox');
                                originalWindow.style.opacity = '0.7'; originalWindow.style.border = '2px dashed red'; originalWindow.style.pointerEvents = 'auto';
                                originalWindow.dataset.modernized = 'error';
                                continue; // Stop processing this node
                            }

                            // Fetch initial messages and create the DMM window
                            try {
                                const initialResult = await parseAndFetchInitialMessages(originalWindow, conversationId);
                                if (!initialResult || typeof initialResult !== 'object') { throw new Error(`parseAndFetchInitialMessages returned invalid result for ${conversationId}`); }
                                createCustomWindow(conversationId, null, initialResult, originalWindow);
                                originalWindow.dataset.modernized = 'replaced'; // Mark as replaced *after* successful creation
                            } catch (error) {
                                alert(`DMM Erreur: Impossible de charger la conversation ${conversationId}. La fenêtre originale reste visible (avec bordure rouge).`);
                                delete ACTIVE_CONVERSATIONS[conversationId]; // Clean up potentially partial data
                                originalWindow.classList.remove('hidden-original-databox');
                                originalWindow.style.opacity = '0.7'; originalWindow.style.border = '2px dashed red'; originalWindow.style.pointerEvents = 'auto';
                                originalWindow.dataset.modernized = 'error';
                            }
                        }
                    } // Fin if node.id startsWith db_message_
                } // Fin boucle addedNodes
            } // Fin if mutation.type childList
        } // Fin boucle mutationsList
    }; // --- END of mainObserverCallback ---

    // --- Sidebar Observer Callback (Detects changes in message list UL) ---
    const sidebarObserverCallback = (mutationsList) => {
        let listChanged = false;
        let contentChanged = false;

        for (const mutation of mutationsList) {
            // Check for both content UL changes and folder switches
            if (mutation.type === 'childList') {
                // Check added/removed nodes
                const changedNodes = [...mutation.addedNodes, ...mutation.removedNodes];
                for (const node of changedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check for direct message items
                        if (node.matches?.('li.message[id^="message_"]')) {
                            listChanged = true;
                            break;
                        }
                        // Check for content container changes (folder switch)
                        if (node.matches?.('.content')) {
                            contentChanged = true;
                            break;
                        }
                        // Check for UL replacement
                        if (node.tagName === 'UL') {
                            contentChanged = true;
                            break;
                        }
                    }
                }
            }
            if (listChanged || contentChanged) break;
        }

        // Handle the changes
        if (listChanged || contentChanged) {
            // Clear any pending scan
            if (sidebarScanDebounceTimer) {
                clearTimeout(sidebarScanDebounceTimer);
            }

            // Set different delays based on change type
            const delay = contentChanged ? 500 : 300; // Longer delay for folder switches

            sidebarScanDebounceTimer = setTimeout(() => {
                scanAndUpdateSidebarMutes();
                sidebarScanDebounceTimer = null;
            }, delay);
        }
    };

    // --- Script Initialization ---
    addChatStyles(); // Make sure styles are added

    // =======================================================================
    // ================== START OF MODIFIED initializeScript =================
    // =======================================================================
    async function initializeScript() {
        const essentialElements = [
             document.body,
             document.getElementById('zone_messagerie'),
             document.getElementById('txt_pseudo'),
             document.getElementById('liste_messages') // Ensure message list exists for listener/observer
        ];

        if (essentialElements.every(el => el)) {
            if (!MY_NAME) MY_NAME = getMyCharacterName();
            if (!MY_NAME) { return; }

            // --- Load Global Mute State ---
            loadGlobalMuteState();

            // --- Load Custom Conversation Data
            loadCustomConversationData();

            // --- Create Global Mute Button ---
            createGlobalMuteButton(); // Async, will attach when ready

            // --- Load Last Seen IDs --- // <<< NEW LINE >>>
            loadLastSeenMessageIds();

            // --- Start periodic cache cleanup ---
            const cacheCleanupIntervalId = setInterval(cleanupMessageCache, MESSAGE_CACHE_CLEANUP_INTERVAL);
            cleanupMessageCache(); // Initial cleanup
            if (!window.DMM_CACHE_CLEANUP_INTERVAL) {
                window.DMM_CACHE_CLEANUP_INTERVAL = cacheCleanupIntervalId;
            }


// --- Setup XHR Wrapper ---
            if (!unsafeWindow._original_XMLHttpRequest_open && !unsafeWindow._original_XMLHttpRequest_send) {
                const origOpen = unsafeWindow.XMLHttpRequest.prototype.open;
                const origSend = unsafeWindow.XMLHttpRequest.prototype.send;
                let requestCounter = 0;

                unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
                    // Store properties directly on the XHR object
                    this._dmm_requestMethod = method; // Use distinct property names
                    this._dmm_requestURL = url;
                    this._dmm_requestId = requestCounter++;
                    return origOpen.apply(this, arguments);
                };

                unsafeWindow.XMLHttpRequest.prototype.send = function(body) {
                    const xhr = this;
                    // Retrieve properties stored during open
                    const reqId = xhr._dmm_requestId;
                    const targetUrl = xhr._dmm_requestURL;
                    const method = xhr._dmm_requestMethod;
                    let payloadToSend = body; // Start with the original body

                    // --- Intercept POST to Menu/Messaging/NewMessage ---
                    // Check if properties were actually set during open
                    if (!method || !targetUrl) {
                    }
                    // *** Corrected URL Check: No leading slash ***
                    else if (method === 'POST' && typeof targetUrl === 'string' && targetUrl.includes('Menu/Messaging/NewMessage')) {

                        if (body && (typeof body === 'string' || body instanceof URLSearchParams)) {
                            try {
                                // Use a defensive copy if it's already URLSearchParams
                                const params = (body instanceof URLSearchParams) ? new URLSearchParams(body.toString()) : new URLSearchParams(body);
                                const conversationId = params.get('nm_idConvers');

                                if (conversationId) {
                                    const dmmInviteInputId = `dmm-invite-input-${conversationId}`;
                                    const dmmInviteInput = document.getElementById(dmmInviteInputId);

                                    // Robust check
                                    let inputFound = false;
                                    if (dmmInviteInput) {
                                        if (document.body.contains(dmmInviteInput)) {
                                            inputFound = true;
                                        } else {
                                            const parentWindow = dmmInviteInput.closest('.custom-chat-window');
                                        }
                                    } else {
                                    }

                                    if (inputFound) {
                                        const inviteValue = dmmInviteInput.value.trim();
                                        const currentCible = params.get('nm_cible') || '';

                                        params.set('nm_cible', inviteValue);
                                        payloadToSend = params.toString();

                                    } else {
                                    }
                                } else {
                                }
                            } catch (e) {
                                payloadToSend = body;
                            }
                        } else {
                        }
                    } else if (method === 'POST') { // Log why it didn't match if it was a POST
                    }
                    // --- End Intercept NewMessage block ---


                    // --- Setup readyState listener ---
                    const dmmReadyStateHandler = function() {
                        const rsUrl = xhr._dmm_requestURL; // Use stored URL
                        if (xhr.readyState === 4) {
                            const currentStatus = xhr.status; let currentResponseText = null;
                            try { currentResponseText = xhr.responseText; } catch(e) { /* Ignore */ }

                            // --- Handle /Check ---
                            if (rsUrl && typeof rsUrl === 'string' && rsUrl.includes('/Check')) {
                                if (currentStatus === 200 && currentResponseText) {
                                    let match = null;
                                    try {
                                        match = currentResponseText.match(/<evenement\s+type="nouveau_message">.*?<folder_(\d+)\s+quantite="\d+"\s+id_conversation="(\d+)"\s*\/?>.*?<\/evenement>/s);
                                    } catch (regexError) { }

                                    if (match && match[1] && match[2]) {
                                        const folderId = match[1]; const conversationId = match[2];
                                        const conversationData = ACTIVE_CONVERSATIONS[conversationId];
                                        const isWindowOpen = conversationData && conversationData.customWindow && document.body.contains(conversationData.customWindow);
                                        if (isWindowOpen) {
                                            try { setTimeout(() => handleNewMessageEvent(conversationId, folderId), 0); } catch (e) { }
                                        } else {
                                            const isSpecificConvoMuted = isConversationMuted(conversationId);
                                            if (isSpecificConvoMuted) {
                                                try { setTimeout(() => handleNewMessageEvent(conversationId, folderId), 0); } catch (e) { }
                                            } else {
                                                if (!isGloballyMuted) { playNotificationSound(true); }
                                            }
                                        }
                                        setTimeout(() => updateSidebarMuteStatus(conversationId), 150);
                                    }
                                 }
                            }
                            // --- Handle OpenMessage ---
                            else if (rsUrl && typeof rsUrl === 'string' && rsUrl.includes('action=OpenMessage&id_conversation=')) {
                                if (currentStatus === 200 && currentResponseText) {
                                    const conversationIdMatch = rsUrl.match(/id_conversation=(\d+)/);
                                    if (conversationIdMatch && conversationIdMatch[1]) {
                                        const conversationId = conversationIdMatch[1];
                                        try { setTimeout(() => handleOpenMessageResponse(conversationId, currentResponseText), 0); }
                                        catch (e) { }
                                    }
                                 }
                            }
                            // Remove listener once done
                            try { xhr.removeEventListener('readystatechange', dmmReadyStateHandler); } catch(removeError) { /* ignore */ }
                        } // end if readyState 4
                    };
                    // Attach listener
                    try { xhr.addEventListener('readystatechange', dmmReadyStateHandler); }
                    catch(addListenerError) { }

                    // Store originals safely
                    if(!unsafeWindow._original_XMLHttpRequest_open) unsafeWindow._original_XMLHttpRequest_open = origOpen;
                    if(!unsafeWindow._original_XMLHttpRequest_send) unsafeWindow._original_XMLHttpRequest_send = origSend;

                    // --- Call original send ---
                    return origSend.apply(this, [payloadToSend]); // Use the payloadToSend variable
                }; // --- END of send override ---
            } else {
            }
            // --- End XHR Wrapper Setup ---



            // Initialize Main Observer
            if (!mainObserver) {
                mainObserver = new MutationObserver(mainObserverCallback);
                mainObserver.observe(document.body, { childList: true, subtree: true });
            }

            // Initialize Sidebar Observer (modified to be more thorough)
            if (!sidebarObserver) {
                // Try to observe the entire message list container for better coverage
                const messageList = document.getElementById('liste_messages');
                if (messageList) {
                    sidebarObserver = new MutationObserver(sidebarObserverCallback);
                    sidebarObserver.observe(messageList, {
                        childList: true,
                        subtree: true,
                        attributes: false,
                        characterData: false
                    });

                    // Initial scan
                    scanAndUpdateSidebarMutes();
                } else {
                }
            }

            // Setup Click Listener for the sidebar
            setupClickListener();

            // Initial scan of sidebar items for mute status
            scanAndUpdateSidebarMutes();

            // Create tooltip element
            createAvatarTooltip();

            // Create Edit Mode UI
            createEditModeToggleButton();
            createEditPopup();

        } else {
            const missing = essentialElements.map((el, i) => el ? '' : ['body', '#zone_messagerie', '#txt_pseudo', '#liste_messages'][i]).filter(Boolean);
            setTimeout(initializeScript, 500); // Retry
        }
    } // --- END of initializeScript ---
    // =======================================================================
    // =================== END OF MODIFIED initializeScript ==================
    // =======================================================================


    // --- Start Initialization ---
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript(); // DOM is already ready
    }


    // --- Cleanup on page unload ---
     window.addEventListener('beforeunload', () => {
         if (mainObserver) mainObserver.disconnect(); mainObserver = null;
         if (sidebarObserver) sidebarObserver.disconnect(); sidebarObserver = null;
         if (sidebarScanDebounceTimer) clearTimeout(sidebarScanDebounceTimer); sidebarScanDebounceTimer = null;
         if (openingMutedOverrideTimer) clearTimeout(openingMutedOverrideTimer); openingMutedOverrideTimer = null;

         // Clear all mute timers BEFORE deleting conversation data
         Object.keys(ACTIVE_CONVERSATIONS).forEach(convId => {
            const cData = ACTIVE_CONVERSATIONS[convId];
            if(cData?.muteTimerIntervalId) {
                clearInterval(cData.muteTimerIntervalId);
            }
         });

         // Now close windows and delete data
         Object.keys(ACTIVE_CONVERSATIONS).forEach(convId => {
             try { closeChatWindow(convId, { removeOriginal: true }); } // closeChatWindow now saves last seen ID
             catch(e) { }
         });
         // Explicitly clear the object just in case closeChatWindow had issues
         for (let key in ACTIVE_CONVERSATIONS) { delete ACTIVE_CONVERSATIONS[key]; }

         // Clear cache cleanup interval
         if (window.DMM_CACHE_CLEANUP_INTERVAL) {
             clearInterval(window.DMM_CACHE_CLEANUP_INTERVAL);
             delete window.DMM_CACHE_CLEANUP_INTERVAL;
         }

         // Clear message cache
         messageCache.clear();

         const listenerTarget = document.getElementById('liste_messages');
         if (listenerTarget) { try { listenerTarget.removeEventListener('click', handleMessageListClick, true); } catch(e){} }

         // Remove global mute button listener if needed
         const globalMuteButton = document.getElementById(GLOBAL_MUTE_BUTTON_ID);
         // Basic check: if it still exists, remove it (or its listener)
         if(globalMuteButton && globalMuteButton.parentNode) {
            try { globalMuteButton.remove(); } catch(e) {}
         }

         try {
              const win = unsafeWindow;
              if (win._original_XMLHttpRequest_open) { win.XMLHttpRequest.prototype.open = win._original_XMLHttpRequest_open; delete win._original_XMLHttpRequest_open; }
              if (win._original_XMLHttpRequest_send) { win.XMLHttpRequest.prototype.send = win._original_XMLHttpRequest_send; delete win._original_XMLHttpRequest_send; }
         } catch (e) { }

     });

    // Add new functions near other UI/Click handling functions
    function createEditModeToggleButton() {
        if (document.getElementById(EDIT_MODE_TOGGLE_BUTTON_ID)) return;

        // Create the button
        const button = document.createElement('div');
        button.id = EDIT_MODE_TOGGLE_BUTTON_ID;
        button.textContent = '✏️';
        button.title = 'Activer/Désactiver le mode édition des conversations';
        button.addEventListener('click', toggleEditMode);

        // Position the button relative to grid-title
        const gridTitle = document.querySelector('.grid.grid-title');
        if (gridTitle) {
            // Wait for layout to be complete
            setTimeout(() => {
                const rect = gridTitle.getBoundingClientRect();
                button.style.top = `${rect.top + window.scrollY}px`;
                button.style.left = `${rect.right + window.scrollX - 12}px`;

                // Add scroll listener to maintain position
                window.addEventListener('scroll', () => {
                    const updatedRect = gridTitle.getBoundingClientRect();
                    button.style.top = `${updatedRect.top + window.scrollY}px`;
                    button.style.left = `${updatedRect.right + window.scrollX + 10}px`;
                });
            }, 0);
        } else {
        }

        document.body.appendChild(button);
        updateEditModeButtonVisuals();
    }

    function createEditPopup() {
        if (document.getElementById(EDIT_POPUP_ID)) return;

        const popup = document.createElement('div');
        popup.id = EDIT_POPUP_ID;
        popup.innerHTML = `
            <h4>Éditer Conversation <span id="dmm-edit-popup-conv-id"></span></h4>
            <div class="dmm-edit-field">
                <label for="dmm-edit-title">Titre:</label>
                <input type="text" id="dmm-edit-title" placeholder="Laisser vide pour restaurer">
            </div>
            <div class="dmm-edit-field">
                <label for="dmm-edit-image">URL Image:</label>
                <input type="text" id="dmm-edit-image" placeholder="Laisser vide pour restaurer">
            </div>
            <div class="dmm-edit-buttons">
                <button id="dmm-edit-save">Sauver</button>
                <button id="dmm-edit-cancel">Annuler</button>
                <button id="dmm-edit-reset">Reset</button>
            </div>
        `;
        popup.dataset.conversationId = '';

        document.body.appendChild(popup);
    }

    function updateEditModeButtonVisuals() {
        const button = document.getElementById(EDIT_MODE_TOGGLE_BUTTON_ID);
        if (!button) return;

        if (isEditModeActive) {
            button.classList.add('active');
            button.style.backgroundColor = '#e67e22';
        } else {
            button.classList.remove('active');
            button.style.backgroundColor = '#3498db';
        }
    }

    function toggleEditMode() {
        isEditModeActive = !isEditModeActive;
        closeEditPopup();
        updateEditModeButtonVisuals();
        updateSidebarItemsEditableState();
    }

    function updateSidebarItemsEditableState() {
        const messageListItems = document.querySelectorAll('#liste_messages li.message[id^="message_"]');
        messageListItems.forEach(item => {
            if (isEditModeActive) {
                item.classList.add('dmm-editable-item');
                item.title = 'Cliquer pour éditer le titre/image';
            } else {
                item.classList.remove('dmm-editable-item');
                item.title = '';
            }
        });
        document.body.classList.toggle('dmm-edit-mode-active', isEditModeActive);
    }

    let closePopupHandler = null;

    function openEditPopup(conversationId, listItemElement) {
        const popup = document.getElementById(EDIT_POPUP_ID);
        if (!popup || !listItemElement) return;

        const customData = getCustomData(conversationId) || { title: null, imageUrl: null };

        popup.querySelector('#dmm-edit-popup-conv-id').textContent = `(#${conversationId})`;
        popup.querySelector('#dmm-edit-title').value = customData.title || '';
        popup.querySelector('#dmm-edit-image').value = customData.imageUrl || '';
        popup.dataset.conversationId = conversationId;

        const saveBtn = popup.querySelector('#dmm-edit-save');
        const cancelBtn = popup.querySelector('#dmm-edit-cancel');
        const resetBtn = popup.querySelector('#dmm-edit-reset');

        saveBtn.replaceWith(saveBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        resetBtn.replaceWith(resetBtn.cloneNode(true));

        popup.querySelector('#dmm-edit-save').addEventListener('click', handleEditPopupSave);
        popup.querySelector('#dmm-edit-cancel').addEventListener('click', closeEditPopup);
        popup.querySelector('#dmm-edit-reset').addEventListener('click', handleEditPopupReset);

        // Position popup relative to list item
        const rect = listItemElement.getBoundingClientRect();
        const popupHeight = popup.offsetHeight || 150;
        const popupWidth = popup.offsetWidth || 300;

        let top = rect.top + window.scrollY - (popupHeight / 2) + (rect.height / 2);
        let left = rect.right + window.scrollX + 10;

        // Adjust if off-screen
        if (left + popupWidth > window.innerWidth) {
            left = rect.left + window.scrollX - popupWidth - 10;
        }
        if (top < window.scrollY) {
            top = window.scrollY + 5;
        }
        if (top + popupHeight > window.innerHeight + window.scrollY) {
            top = window.innerHeight + window.scrollY - popupHeight - 5;
        }
        if (left < window.scrollX) left = window.scrollX + 5;

        popup.style.top = `${Math.max(0, top)}px`;
        popup.style.left = `${Math.max(0, left)}px`;
        popup.style.display = 'block';
        popup.querySelector('#dmm-edit-title').focus();

        if (closePopupHandler) {
            document.removeEventListener('mousedown', closePopupHandler, true);
            document.removeEventListener('keydown', closePopupHandler, true);
            closePopupHandler = null;
        }

        closePopupHandler = (event) => {
            if (event.type === 'keydown' && event.key === 'Escape') {
                closeEditPopup();
            } else if (event.type === 'mousedown' && !popup.contains(event.target)) {
                const toggleButton = document.getElementById(EDIT_MODE_TOGGLE_BUTTON_ID);
                if (!toggleButton?.contains(event.target) && !listItemElement.contains(event.target)) {
                    closeEditPopup();
                }
            }
        };

        setTimeout(() => {
            document.addEventListener('mousedown', closePopupHandler, true);
            document.addEventListener('keydown', closePopupHandler, true);
        }, 50);
    }

    function closeEditPopup() {
        const popup = document.getElementById(EDIT_POPUP_ID);
        if (popup) {
            popup.style.display = 'none';
            popup.dataset.conversationId = '';
        }
        // Remove listeners
        if (closePopupHandler) {
            document.removeEventListener('mousedown', closePopupHandler, true);
            document.removeEventListener('keydown', closePopupHandler, true);
            closePopupHandler = null;
        }
    }

    function handleEditPopupSave() {
        const popup = document.getElementById(EDIT_POPUP_ID);
        const conversationId = popup.dataset.conversationId;
        if (!conversationId) return;

        const newTitle = popup.querySelector('#dmm-edit-title').value;
        const newImageUrl = popup.querySelector('#dmm-edit-image').value;

        setCustomData(conversationId, newTitle, newImageUrl);
        closeEditPopup();

        // Update the list item
        const listItem = document.getElementById(`message_${conversationId}`);
        if (listItem) {
            applyCustomizationsToItem(listItem);
        }
    }

    function handleEditPopupReset() {
        const popup = document.getElementById(EDIT_POPUP_ID);
        const conversationId = popup.dataset.conversationId;
        if (!conversationId) return;

        setCustomData(conversationId, null, null);
        closeEditPopup();

        // Update the list item to restore originals
        const listItem = document.getElementById(`message_${conversationId}`);
        if (listItem) {
            applyCustomizationsToItem(listItem);
        }
    }

    /**
     * Applies custom title and image to a sidebar list item, or restores originals.
     * Stores original values in data attributes if not already present.
     */
    function applyCustomizationsToItem(listItem) {
        if (!listItem || !listItem.id || !listItem.id.startsWith('message_')) return;

        const conversationId = listItem.id.replace('message_', '');
        const titleElement = listItem.querySelector('.message_titre');
        const imgElement = listItem.querySelector('img');

        if (!titleElement || !imgElement) {
            return;
        }

        // Store originals if not already stored
        if (!listItem.hasAttribute('data-original-title')) {
            listItem.setAttribute('data-original-title', titleElement.textContent);
        }
        if (!listItem.hasAttribute('data-original-src')) {
            listItem.setAttribute('data-original-src', imgElement.src);
        }

        // Get custom data
        const customData = getCustomData(conversationId);

        // Apply or restore
        let appliedCustomTitle = false;
        let appliedCustomImage = false;

        if (customData) {
            // Apply custom title if set
            if (customData.title) {
                titleElement.textContent = customData.title;
                appliedCustomTitle = true;
            }
            // Apply custom image if set
            if (customData.imageUrl) {
                if (customData.imageUrl.startsWith('http://') || customData.imageUrl.startsWith('https://')) {
                    imgElement.src = customData.imageUrl;
                    appliedCustomImage = true;
                } else {
                }
            }
        }

        // Restore title if not customized
        if (!appliedCustomTitle && listItem.hasAttribute('data-original-title')) {
            if (titleElement.textContent !== listItem.getAttribute('data-original-title')) {
                titleElement.textContent = listItem.getAttribute('data-original-title');
            }
        }

        // Restore image if not customized
        if (!appliedCustomImage && listItem.hasAttribute('data-original-src')) {
            if (imgElement.src !== listItem.getAttribute('data-original-src')) {
                imgElement.src = listItem.getAttribute('data-original-src');
            }
        }
    }
})();