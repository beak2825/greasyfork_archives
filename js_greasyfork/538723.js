// ==UserScript==
// @name         Fishtank.live Chat Bot Silencer & Extended Mute Tools
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Enables a filter to be turned on to your chat which prevents messages from appearing which contain commands for common bots (e.g. "!" and ">"), responses from said bots, specified keywords/phrases, specified usernames, or emote messages. Allows highlighting all messages from a specific user.
// @author       @c, with additions and conflict fix
// @match        https://fishtank.live/*
// @match        https://www.fishtank.live/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538723/Fishtanklive%20Chat%20Bot%20Silencer%20%20Extended%20Mute%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/538723/Fishtanklive%20Chat%20Bot%20Silencer%20%20Extended%20Mute%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Using a non-conflicting prefix for GM_getValue to avoid potential future issues.
    const SCRIPT_PREFIX = 'cbs_settings_';
    const DEBUG_MODE = true; // Set to true if wanting to enable console logging for debugging.

    // --- DOM Selectors & IDs ---
    const CHAT_MESSAGES_CONTAINER_ID = 'chat-messages'; // ID of the main chat message container.
    const CHAT_MESSAGE_WRAPPER_SELECTOR = 'div[class*="chat-message-default_chat-message-default__"]'; // Selector for standard chat message wrappers.
    const EMOTE_MESSAGE_WRAPPER_SELECTOR = 'div[class*="chat-message-emote_chat-message-emote__"]'; // Selector for emote-only/system message wrappers.
    const ALL_MESSAGE_SELECTORS_QUERY = `${CHAT_MESSAGE_WRAPPER_SELECTOR}, ${EMOTE_MESSAGE_WRAPPER_SELECTOR}`; // Combined selector for all message types.
    const MESSAGE_TEXT_SELECTOR = 'span[class*="chat-message-default_message__"]'; // Selector for the text content of a message.
    const MENTION_SELECTOR = 'span[class*="chat-message-default_mention__"]'; // Selector for @mentions in messages.
    const USERNAME_SELECTOR_DEFAULT = 'span[class*="chat-message-default_user__"]'; // Selector for usernames in standard messages.
    const USERNAME_SELECTOR_EMOTE = 'span[class*="chat-message-emote_user__"]'; // Selector for usernames in emote messages.
    const CHAT_HEADER_SELECTOR = 'div[class*="chat_header__"]'; // Selector for the chat header, where controls are added.

    // --- SVG Icons for UI elements ---
    const SVG_ICON_USER_FILTER_CONTROL = `<svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#D3D3D3"/><circle cx="12" cy="12" r="10" stroke="red" stroke-width="1.8" fill="none"/><line x1="4.93" y1="19.07" x2="19.07" y2="4.93" stroke="red" stroke-width="1.8"/></svg>`;
    const SVG_ICON_SETTINGS_GEAR = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0z"></path></svg>`;

    const SVG_ICON_ADD_PLUS = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>`;
    const SVG_ICON_TRASH = `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
    const SVG_ICON_HELP = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>`;

    // --- Bot Specific Identifiers ---
    const GRIZZBOT_USER_ID = "3640961d-d3d2-434e-9e16-e40a9b72fb7f"; // Profile ID for Grizzbot.
    const LEXXBOT_USER_ID = "4585f683-4656-4468-8918-b9b5ce471d12"; // Profile ID for Lexxbot.
    const GRIZZBOT_USERNAME = "grizzbot"; // Username for Grizzbot.
    const LEXXBOT_USERNAME = "lexxbot"; // Username for Lexxbot.

    let settings = {}; // Holds the current user settings for the script.
    const defaultSettings = { // Default settings, used if no saved settings are found.
        masterFilterActive: true,
        commandFilterEnabled: false,
        usernameFilterEnabled: true,
        blockedUsernames: [],
        keywordFilterEnabled: true,
        blockedKeywords: [],
        muteGrizzbot: false,
        muteLexxbot: false,
        muteEmotes: false,
        shortenSpamEnabled: true // NEW SETTING
    };

    // References to UI elements created by the script.
    let masterFilterBtn, settingsBtn, settingsPanelEl, chatObserver, controlsContainer;
    // Conditional logging function, only logs if DEBUG_MODE is true.
    const log = (...args) => DEBUG_MODE && console.log('[CBS ChatSilencer]', ...args);

    /**
     * Loads settings from browser storage (via GM_getValue).
     * Merges stored settings with defaults to ensure all settings are present.
     */
    function loadSettings() {
        const storedSettingsRaw = GM_getValue(SCRIPT_PREFIX + 'settings', null);
        let storedSettingsParsed = storedSettingsRaw ? JSON.parse(storedSettingsRaw) : {};
        // Migration: remove obsolete settings if they exist from older versions.
        delete storedSettingsParsed.userBlocklistEnabled;
        delete storedSettingsParsed.blockedUsers;
        // Merge default settings with stored settings, ensuring arrays are properly initialized.
        settings = {
            ...defaultSettings, ...storedSettingsParsed,
            blockedUsernames: Array.isArray(storedSettingsParsed.blockedUsernames) ? storedSettingsParsed.blockedUsernames : defaultSettings.blockedUsernames,
            blockedKeywords: Array.isArray(storedSettingsParsed.blockedKeywords) ? storedSettingsParsed.blockedKeywords : defaultSettings.blockedKeywords
        };
        log("Settings loaded:", JSON.parse(JSON.stringify(settings)));
    }

    /**
     * Saves the current settings to browser storage (via GM_setValue).
     */
    function saveSettings() {
        // Only save relevant settings to avoid storing unnecessary data.
        const settingsToSave = {
            masterFilterActive: settings.masterFilterActive,
            commandFilterEnabled: settings.commandFilterEnabled,
            usernameFilterEnabled: settings.usernameFilterEnabled,
            blockedUsernames: settings.blockedUsernames,
            keywordFilterEnabled: settings.keywordFilterEnabled,
            blockedKeywords: settings.blockedKeywords,
            muteGrizzbot: settings.muteGrizzbot,
            muteLexxbot: settings.muteLexxbot,
            muteEmotes: settings.muteEmotes,
            shortenSpamEnabled: settings.shortenSpamEnabled // SAVE NEW SETTING
        };
        GM_setValue(SCRIPT_PREFIX + 'settings', JSON.stringify(settingsToSave));
        log("Settings saved.");
    }

    loadSettings(); // Load settings when the script starts.

    // Reasons for blocking a message, used for logging.
    const BLOCK_REASONS = {
        GRIZZBOT_ID: 'Muting grizzbot (User ID)',
        LEXXBOT_ID: 'Muting lexxbot (User ID)',
        GRIZZBOT_NAME: 'Muting grizzbot (Username)',
        LEXXBOT_NAME: 'Muting lexxbot (Username)',
        SYSTEM_EMOTE: 'Muting system emote message (e.g. /roll, /fall)',
        CUSTOM_EMOTE_ONLY: 'Muting message composed entirely of custom emotes',
        USERNAME_FILTER: 'Filtering username',
        COMMAND_FILTER: 'Filtering command',
        KEYWORD_FILTER: 'Filtering keyword in message'
    };

    /**
     * Determines if a message should be blocked based on current filter settings.
     * @param {object} details - An object containing message details (userId, username, text, emotes, isSystemEmote).
     * @param {object} currentSettings - The current filter settings.
     * @returns {object} An object with `blocked: true` and a `reason` if the message should be blocked, otherwise `blocked: false`.
     */
    function getBlockReason(details, currentSettings) {
        const { userId, username, text, emotes, isSystemEmote } = details;
        const usernameLower = username ? username.toLowerCase() : null; // For case-insensitive username matching.
        const textTrimmedStart = text ? text.trimStart() : null; // For checking command prefixes.
        const textLower = text ? text.toLowerCase() : null; // For case-insensitive keyword matching.

        // --- Bot Muting Filters ---
        if (userId) {
            if (userId === GRIZZBOT_USER_ID && currentSettings.muteGrizzbot) return { blocked: true, reason: BLOCK_REASONS.GRIZZBOT_ID, data: GRIZZBOT_USERNAME };
            if (userId === LEXXBOT_USER_ID && currentSettings.muteLexxbot) return { blocked: true, reason: BLOCK_REASONS.LEXXBOT_ID, data: LEXXBOT_USERNAME };
        }
        if (usernameLower) {
            if (usernameLower === GRIZZBOT_USERNAME && currentSettings.muteGrizzbot) return { blocked: true, reason: BLOCK_REASONS.GRIZZBOT_NAME, data: GRIZZBOT_USERNAME };
            if (usernameLower === LEXXBOT_USERNAME && currentSettings.muteLexxbot) return { blocked: true, reason: BLOCK_REASONS.LEXXBOT_NAME, data: LEXXBOT_USERNAME };
        }

        // --- Emote and Slash Command Muting Filter (if muteEmotes is enabled) ---
        if (currentSettings.muteEmotes) {
            if (textTrimmedStart && textTrimmedStart.startsWith('/')) {
                return { blocked: true, reason: BLOCK_REASONS.SYSTEM_EMOTE, data: `Slash command: ${text.substring(0, 20).trim()}${username ? ` by ${username}` : ''}` };
            }
            if (text && emotes && Object.keys(emotes).length > 0) {
                const trimmedTextContent = text.trim();
                if (trimmedTextContent) {
                    const messageTokens = trimmedTextContent.split(/\s+/);
                    if (messageTokens.length > 0 && messageTokens.every(token => emotes.hasOwnProperty(token))) {
                        return { blocked: true, reason: BLOCK_REASONS.CUSTOM_EMOTE_ONLY, data: `Custom emotes: ${text.substring(0, 30).trim()}...` };
                    }
                }
            }
            if (isSystemEmote) {
                return { blocked: true, reason: BLOCK_REASONS.SYSTEM_EMOTE, data: `Marked emote message ${username ? `by ${username}` : '(system)'}${text ? ` (${text.substring(0,20).trim()}...)` : ''}` };
            }
        }

        // --- Other Filters ---
        if (currentSettings.usernameFilterEnabled && currentSettings.blockedUsernames.length > 0 && usernameLower) {
            if (currentSettings.blockedUsernames.some(bn => usernameLower.includes(bn.toLowerCase()))) return { blocked: true, reason: BLOCK_REASONS.USERNAME_FILTER, data: username };
        }
        if (currentSettings.commandFilterEnabled && textTrimmedStart && (textTrimmedStart.startsWith('!') || textTrimmedStart.startsWith('>'))) return { blocked: true, reason: BLOCK_REASONS.COMMAND_FILTER, data: text.substring(0, 20).trim() + '...' };
        if (currentSettings.keywordFilterEnabled && currentSettings.blockedKeywords.length > 0 && textLower) {
            if (currentSettings.blockedKeywords.some(kw => textLower.includes(kw.toLowerCase()))) return { blocked: true, reason: BLOCK_REASONS.KEYWORD_FILTER, data: text.substring(0,30).trim() + '...' };
        }
        return { blocked: false };
    }

    /**
     * Formats a log message for a blocked item.
     * @param {string} logContext - Context like 'PRE-FILTER' or 'DOM'.
     * @param {object} filterResult - The result from getBlockReason.
     * @returns {string} Formatted log string.
     */
    function formatBlockReasonLog(logContext, filterResult) {
        return `[${logContext}] ${filterResult.reason}${filterResult.data ? `: ${filterResult.data}` : ''}`;
    }

    // --- WebSocket Interception (Pre-filtering) ---
    const ORIGINAL_WEBSOCKET = window.WebSocket;
    const CHAT_WEBSOCKET_URL_PATTERN = /wss:\/\/chat\.fishtank\.live\/ws(?:\?.*)?$/;

    function parseWebSocketMessage(rawData) {
        try {
            const parsed = JSON.parse(rawData);
            if (parsed.type === 'MESSAGE_CREATE' && parsed.payload &&
                typeof parsed.payload.user_id !== 'undefined' &&
                typeof parsed.payload.message !== 'undefined' &&
                typeof parsed.payload.username !== 'undefined') {
                return {
                    userId: parsed.payload.user_id,
                    text: parsed.payload.message,
                    username: parsed.payload.username,
                    emotes: parsed.payload.emotes || {},
                    isSystemEmote: false
                };
            }
        } catch (e) {
            DEBUG_MODE && console.warn('[CBS ChatSilencer]', '[PRE-FILTER] Failed to parse WebSocket message or incomplete payload. Error:', e, 'Raw Data:', rawData);
        }
        return null;
    }

    function shouldPreFilterMessage(msgDataFromParser) {
        if (!msgDataFromParser || !settings.masterFilterActive) return false;
        const filterResult = getBlockReason(msgDataFromParser, settings);
        if (filterResult.blocked) {
            log(formatBlockReasonLog('PRE-FILTER', filterResult));
            return true;
        }
        return false;
    }

    /**
     * NEW: Advanced algorithm to detect and shorten repeating words or phrases.
     * @param {string} text The message content.
     * @returns {string} The shortened text, or the original text if no pattern is found.
     */
    function filterRepeatingText(text) {
        if (!text || typeof text !== 'string') return text;

        const trimmedText = text.trim();
        const tokens = trimmedText.split(/\s+/).filter(t => t.length > 0);
        const n = tokens.length;

        // Iterate through possible pattern lengths (L), from 1 up to half the message length.
        for (let L = 1; L <= Math.floor(n / 2); L++) {
            // A pattern can only repeat if the total length is a multiple of the pattern length.
            if (n % L !== 0) continue;

            const reps = n / L;

            // Set thresholds to avoid shortening legitimate phrases.
            // e.g., don't shorten "go go" (L=1, reps=2), but do shorten "go go go" (L=1, reps=3)
            // e.g., do shorten "spam message spam message" (L=2, reps=2)
            if ((L === 1 && reps < 3) || (L > 1 && reps < 2)) continue;

            const unit = tokens.slice(0, L);
            let isRepeating = true;

            // Check if the rest of the message consists of the same repeating unit.
            for (let i = 1; i < reps; i++) {
                const currentChunk = tokens.slice(i * L, (i + 1) * L);
                for (let j = 0; j < L; j++) {
                    if (unit[j] !== currentChunk[j]) {
                        isRepeating = false;
                        break;
                    }
                }
                if (!isRepeating) break;
            }

            if (isRepeating) {
                const patternString = unit.join(' ');
                log(`[REPETITION-FILTER] Found repeating pattern. Shortening "${trimmedText}" to "${patternString}"`);
                return patternString; // Return just one instance of the pattern.
            }
        }
        return text; // No repeating pattern found, return original text.
    }

    function processAndForwardWebSocketData(rawData, originalEvent, forwardCallback) {
        const parsedMsg = parseWebSocketMessage(rawData);
        if (shouldPreFilterMessage(parsedMsg)) return;

        let finalRawData = rawData;
        let isModified = false;

        // Apply text shortening if the setting is enabled
        if (parsedMsg && settings.shortenSpamEnabled) {
            const originalText = parsedMsg.text;
            const modifiedText = filterRepeatingText(originalText);

            if (originalText !== modifiedText) {
                log(`[SPAM-SHORTENER] Modifying message. From: "${originalText}" To: "${modifiedText}"`);
                try {
                    const parsedJson = JSON.parse(rawData);
                    parsedJson.payload.message = modifiedText;
                    finalRawData = JSON.stringify(parsedJson);
                    isModified = true;
                } catch (e) {
                    log('[SPAM-SHORTENER] Error re-serializing modified message. Passing original.', e);
                }
            }
        }

        let finalEvent = originalEvent;
        if (isModified) {
            finalEvent = new MessageEvent('message', {
                data: finalRawData,
                origin: originalEvent.origin,
                lastEventId: originalEvent.lastEventId,
                source: originalEvent.source,
                ports: originalEvent.ports || []
            });
        }
        forwardCallback(finalEvent);
    }

     window.WebSocket = function(url, protocols) {
        const socket = new ORIGINAL_WEBSOCKET(url, protocols);
        if (CHAT_WEBSOCKET_URL_PATTERN.test(url)) {
            log('[PRE-FILTER] Chat WebSocket identified, attaching proxy:', url);
            const originalAddEventListener = socket.addEventListener;
            socket.addEventListener = function(type, listener, options) {
                if (type === 'message') {
                    const wrappedListener = event => {
                        processAndForwardWebSocketData(event.data, event, (finalEvent) => {
                           if (typeof listener === 'function') listener.call(this, finalEvent);
                        });
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
            let onmessageDescriptor = Object.getOwnPropertyDescriptor(ORIGINAL_WEBSOCKET.prototype, 'onmessage');
            if (!onmessageDescriptor && Object.prototype.hasOwnProperty.call(socket, 'onmessage')) {
                 onmessageDescriptor = Object.getOwnPropertyDescriptor(socket, 'onmessage');
            }
            let actualOnMessageHandler = null;
            Object.defineProperty(socket, 'onmessage', {
                configurable: true, enumerable: true,
                get() {
                    return (onmessageDescriptor && onmessageDescriptor.get) ? onmessageDescriptor.get.call(socket) : actualOnMessageHandler;
                },
                set(callback) {
                    actualOnMessageHandler = callback;
                    const wrappedCallback = event => {
                         processAndForwardWebSocketData(event.data, event, (finalEvent) => {
                             if (actualOnMessageHandler && typeof actualOnMessageHandler === 'function') actualOnMessageHandler.call(socket, finalEvent);
                         });
                    };
                    if (onmessageDescriptor && onmessageDescriptor.set) onmessageDescriptor.set.call(socket, wrappedCallback);
                    else actualOnMessageHandler = wrappedCallback;
                 }
            });
        }
        return socket;
    };
    if (ORIGINAL_WEBSOCKET.prototype) {
        window.WebSocket.prototype = ORIGINAL_WEBSOCKET.prototype;
        window.WebSocket.prototype.constructor = window.WebSocket;
    } else {
        log('[PRE-FILTER] Warning: ORIGINAL_WEBSOCKET.prototype is undefined. Proxy might be incomplete.');
    }
    log('[PRE-FILTER] WebSocket proxy with repetition filter installed.');

    // --- CSS Styles for UI elements ---
    GM_addStyle(`
        /* Ensure the chat header establishes a positioning context */
        div[class*="chat_header__"] {
            position: relative !important;
        }
        /* Shift the existing channel selection menu to make space for our controls */
        div[class*="chat-room-selector"] {
            margin-right: 62px !important; /* Adjust this value if needed */
        }
        /* Container for script's control buttons in the chat header. */
        .cbs-controls {
            display: flex; align-items: center; position: absolute;
            right: 10px; top: 50%; transform: translateY(-50%);
            z-index: 10; flex-shrink: 0; gap: 5px;
        }
        /* General styling for script's buttons. */
        .cbs-btn {
            box-sizing: border-box; padding: 3px; cursor: pointer; border: 1px solid #404040;
            background-color: #282930; border-radius: 4px; display: inline-flex;
            align-items: center; justify-content: center; transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
            line-height: 1;
        }
        .cbs-btn:hover { background-color: #36393f; border-color: #505050; }
        .cbs-btn.active { background-color: #701f1f; border-color: #501010; }
        .cbs-btn.active:hover { background-color: #802f2f; border-color: #601818; }
        .cbs-btn:active { transform: translateY(1px); }
        /* Styling for the settings panel button (gear icon). */
        .cbs-settings-btn-app {
            box-sizing: border-box; background: transparent; border: none; padding: 3px;
            cursor: pointer; display: inline-flex; align-items: center;
            justify-content: center; color: #b0b3b8; transition: color 0.2s, transform 0.1s; line-height: 1;
        }
        .cbs-settings-btn-app:hover { color: #e1e3e6; }
        .cbs-settings-btn-app:active { transform: translateY(1px); }
        .cbs-btn svg, .cbs-settings-btn-app svg {
            width: 15px; height: 15px; display: block;
        }
        /* Class to hide filtered messages. */
        .cbs-hidden { display: none !important; }

        /* --- USER HIGHLIGHTING STYLES --- */
        /* Class for highlighting messages from a specific user. */
        div[class*="chat-message-default_chat-message-default__"].cbs-user-highlight,
        div[class*="chat-message-emote_chat-message-emote__"].cbs-user-highlight {
            background-color: rgba(255, 215, 0, 0.1) !important;
            border-left: 2px solid #bda234;
            transition: background-color 0.3s ease;
        }
        /* Make tagged usernames clickable for the right-click menu. */
        ${MENTION_SELECTOR} {
            cursor: pointer;
        }

        /* --- SETTINGS PANEL STYLES --- */
        .cbs-settings-panel {
            display: none; position: absolute;
            background-color: #1a1b1e; border: 1px solid #2d2f33;
            border-radius: 7px; padding: 9px; z-index: 2147483647 !important;
            min-width: 300px; box-shadow: 0 3px 7px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.15);
            color: #dcddde; font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-size: 13px; pointer-events: auto !important;
            overflow: visible !important;
        }
        .cbs-settings-panel * { pointer-events: auto !important; }
        .cbs-settings-section {
            background-color: #232529; padding: 14px; border-radius: 5px;
            margin-bottom: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08);
        }
        .cbs-settings-section:last-child { margin-bottom: 0; }
        .cbs-settings-section-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid #303236;
        }
        .cbs-settings-section-header h4 {
            font-size: 1.0em; color: #e0e2e5; font-weight: 600; margin: 0;
            text-transform: uppercase; letter-spacing: 0.4px; display: inline;
        }
        .cbs-toggle-switch-label { display: flex; align-items: center; cursor: pointer; font-size: 0.92em; color: #c8cacd; margin-bottom: 7px; }
        .cbs-toggle-switch-label:last-of-type { margin-bottom: 0; }
        .cbs-toggle-switch { position: relative; display: inline-block; width: 33px; height: 18px; margin-right: 10px; }
        .cbs-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .cbs-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444950; transition: .3s ease; border-radius: 18px; }
        .cbs-toggle-slider:before {
            position: absolute; content: ""; height: 13px; width: 13px;
            left: 2.5px; bottom: 2.5px; background-color: white;
            transition: .3s ease; border-radius: 50%;
        }
        .cbs-toggle-switch input:checked + .cbs-toggle-slider { background-color: #007bff; }
        .cbs-toggle-switch input:focus + .cbs-toggle-slider { box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3); }
        .cbs-toggle-switch input:checked + .cbs-toggle-slider:before { transform: translateX(15px); }
        .cbs-input-group { display: flex; margin-top: 9px; }
        .cbs-text-input {
            flex-grow: 1; padding: 8px 10px; background-color: #1c1d20;
            border: 1px solid #383a3f; color: #e1e3e6; border-radius: 4px;
            font-size: 0.92em; transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        }
        .cbs-text-input::placeholder { color: #6a6d73; }
        .cbs-text-input:focus {
            border-color: #007bff; background-color: #24262a;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); outline: none;
        }
        .cbs-action-button {
            padding: 8px 12px; margin-left: 7px; background-color: #007bff;
            color: white; border: none; border-radius: 4px; cursor: pointer;
            font-size: 0.92em; font-weight: 500; display: inline-flex; align-items: center;
            transition: background-color 0.2s, transform 0.1s;
        }
        .cbs-action-button:hover { background-color: #0069d9; }
        .cbs-action-button:active { transform: translateY(1px); }
        .cbs-action-button svg { margin-right: 5px; }
        .cbs-list-container {
            margin-top: 9px; max-height: 95px; overflow-y: auto;
            background-color: #1c1d20; border-radius: 4px; padding: 5px;
            border: 1px solid #383a3f; scrollbar-width: thin;
            scrollbar-color: #4f545c #222427;
        }
        .cbs-list-container::-webkit-scrollbar { width: 7px; }
        .cbs-list-container::-webkit-scrollbar-thumb { background-color: #4f545c; border-radius: 3px; border: 1.5px solid #1c1d20; }
        .cbs-list-container::-webkit-scrollbar-track { background-color: #1c1d20; border-radius: 3px; }
        .cbs-list { list-style: none; padding: 0; margin: 0; }
        .cbs-list-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 6px 9px; margin-bottom: 3px; background-color: #2b2d31;
            border-radius: 3px; color: #b0b3b8; font-size: 0.9em;
            transition: background-color 0.15s;
        }
        .cbs-list-item:last-child { margin-bottom: 0; }
        .cbs-list-item:hover { background-color: #36393f; color: #dadce0; }
        .cbs-list-item span { flex-grow: 1; overflow: hidden; text-overflow: ellipsis; margin-right: 7px; }
        .cbs-list-remove-btn {
            background: transparent; border: none; color: #828589; cursor: pointer;
            padding: 0; display: flex; align-items: center; justify-content: center;
            width: 22px; height: 22px; border-radius: 3px;
            transition: color 0.2s, background-color 0.2s, transform 0.1s;
        }
        .cbs-list-remove-btn:hover { color: #f04747; background-color: rgba(240, 71, 71, 0.1); }
        .cbs-list-remove-btn:active { transform: translateY(1px); }
       .cbs-tooltip-container {
            position: relative; display: inline-flex; align-items: center; justify-content: center;
            cursor: help; color: #72767d; transition: color 0.2s;
            margin-left: 7px; vertical-align: middle;
       }
      .cbs-tooltip-container svg { width: 13px; height: 13px; display: block; }
       .cbs-tooltip-container:hover { color: #b9bbbe; }
       .cbs-tooltip-text {
            visibility: hidden; opacity: 0;
            width: 210px; background-color: #111214; color: #dcdde0;
            text-align: left; font-size: 0.9em; font-weight: normal;
            text-transform: none; letter-spacing: normal; line-height: 1.4;
            border-radius: 4px; border: 1px solid #303236; padding: 9px 10px;
            position: absolute; z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: opacity 0.2s ease-in-out, visibility 0.2s;
            bottom: calc(100% + 9px);
            left: 50%; transform: translateX(-50%);
            transform-origin: bottom center;
        }
        .cbs-tooltip-text::after {
           content: ""; position: absolute; top: 100%; left: 50%;
           transform: translateX(-50%); border-width: 5px; border-style: solid;
           border-color: #111214 transparent transparent transparent;
         }
        .cbs-tooltip-container:hover .cbs-tooltip-text { visibility: visible; opacity: 1; }
    `);

    function escapeHTML(str) {
       if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function modifyOnlineCountDisplay(chatHeader) {
        if (!chatHeader) return;
        const presenceSelector = '.chat_presence__90XuO';
        const onlineTextSuffixPattern = /\s+Online$/i;
        const updatePresenceText = () => {
            const presenceEl = chatHeader.querySelector(presenceSelector);
            if (presenceEl) {
                for (const child of presenceEl.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE && onlineTextSuffixPattern.test(child.nodeValue)) {
                        child.nodeValue = child.nodeValue.replace(onlineTextSuffixPattern, '');
                        break;
                    }
                }
            }
        };
        updatePresenceText();
        const headerObserver = new MutationObserver(() => updatePresenceText());
        headerObserver.observe(chatHeader, { childList: true, characterData: true, subtree: true });
    }

    // --- User Highlighting ---

    let highlightedUsername = null; // Holds the username of the user whose messages are currently highlighted.

    /**
     * Extracts the sender's username from a message node, ignoring any clan tags.
     * @param {HTMLElement} messageNode - The message wrapper element.
     * @returns {string|null} The sender's username in lowercase, or null if not found.
     */
    function getSenderUsername(messageNode) {
        if (!messageNode) return null;
        const userSpan = messageNode.querySelector(`${USERNAME_SELECTOR_DEFAULT}, ${USERNAME_SELECTOR_EMOTE}`);
        if (!userSpan) return null;

        // The actual username is typically the last text node within the user span,
        // following the optional clan tag span. This is a robust way to get the name.
        if (userSpan.lastChild && userSpan.lastChild.nodeType === Node.TEXT_NODE) {
            return userSpan.lastChild.textContent.trim().toLowerCase();
        }
        // Fallback for simple structures without clan tags
        return userSpan.textContent.trim().toLowerCase();
    }

    /**
     * Applies or removes the highlight class from a single message node based on the globally highlighted user.
     * @param {HTMLElement} node - The message wrapper element to process.
     */
    function applyHighlightToNode(node) {
        if (!highlightedUsername) {
            node.classList.remove('cbs-user-highlight');
            return;
        }
        const sender = getSenderUsername(node);
        if (sender) {
            node.classList.toggle('cbs-user-highlight', sender === highlightedUsername);
        } else {
            node.classList.remove('cbs-user-highlight');
        }
    }

    /**
     * Iterates through all visible chat messages and updates their highlight state.
     */
    function updateAllHighlights() {
        log(`Updating all highlights for user: ${highlightedUsername || 'none'}`);
        document.querySelectorAll(ALL_MESSAGE_SELECTORS_QUERY).forEach(applyHighlightToNode);
    }

    /**
     * Sets up the right-click event listener on the chat container to handle user highlighting.
     * @param {HTMLElement} chatContainer - The main chat messages container element.
     */
    function setupHighlighting(chatContainer) {
        if (chatContainer.dataset.highlightListener) return; // Prevent adding multiple listeners
        chatContainer.dataset.highlightListener = 'true';

        chatContainer.addEventListener('contextmenu', (event) => {
            const mentionSpan = event.target.closest(MENTION_SELECTOR);
            if (mentionSpan) {
                event.preventDefault(); // Stop the browser's context menu.
                event.stopPropagation(); // Stop the event from bubbling further.
                const taggedName = mentionSpan.textContent.trim().substring(1).toLowerCase(); // remove '@'

                if (highlightedUsername === taggedName) {
                    highlightedUsername = null; // Toggle off
                    log('User highlight cleared.');
                } else {
                    highlightedUsername = taggedName; // Toggle on for this user
                    log(`Highlighting user: ${highlightedUsername}`);
                }
                updateAllHighlights(); // Apply changes to the entire chat.
            }
        });
        log('User highlight right-click listener attached to chat container.');
    }

    // --- DOM Filtering ---

    function processMessageNode(node) {
        if (!node || !(typeof node.matches === 'function' || typeof node.querySelector === 'function')) return;
        let messageDetails = {};
        let shouldHide = false;
        if (settings.masterFilterActive) {
            if (node.matches(EMOTE_MESSAGE_WRAPPER_SELECTOR)) {
                const userNameEl = node.querySelector(USERNAME_SELECTOR_EMOTE);
                const domUsername = userNameEl ? userNameEl.textContent.trim() : '';
                const textContentEl = node.querySelector('span[class*="message"]');
                const text = textContentEl ? textContentEl.textContent.trim() : '';
                messageDetails = { username: domUsername, text: text, emotes: {}, isSystemEmote: true };
            } else if (node.matches(CHAT_MESSAGE_WRAPPER_SELECTOR)) {
                const userId = node.dataset.userId;
                const userNameEl = node.querySelector(USERNAME_SELECTOR_DEFAULT);
                const domUsername = userNameEl ? userNameEl.textContent.trim() : '';
                const textEl = node.querySelector(MESSAGE_TEXT_SELECTOR);
                const text = textEl ? textEl.textContent : '';
                messageDetails = { userId: userId, username: domUsername, text: text, emotes: {}, isSystemEmote: false };
            } else {
                return;
            }
            const filterResult = getBlockReason(messageDetails, settings);
            if (filterResult.blocked) {
                shouldHide = true;
                log(formatBlockReasonLog('DOM', filterResult));
            }
        }
        node.classList.toggle('cbs-hidden', shouldHide);
    }

    function applyAllFiltersToExistingDOM() {
        log('[DOM-FILTER] Applying filters to all existing messages in DOM.');
        document.querySelectorAll(`#${CHAT_MESSAGES_CONTAINER_ID} ${ALL_MESSAGE_SELECTORS_QUERY}`).forEach(processMessageNode);
    }

    // --- UI Management ---

    function updateMasterFilterButton() {
        if (!masterFilterBtn) return;
        masterFilterBtn.innerHTML = SVG_ICON_USER_FILTER_CONTROL;
        masterFilterBtn.classList.toggle('active', settings.masterFilterActive);
        masterFilterBtn.title = `Chat filters ${settings.masterFilterActive ? 'ON' : 'OFF'}. Click to toggle.`;
    }

    function createSettingsPanelContent() {
        const renderToggle = (key, lbl) => `<label class="cbs-toggle-switch-label"><div class="cbs-toggle-switch"><input type="checkbox" data-setting="${key}" ${settings[key] ? 'checked' : ''}><span class="cbs-toggle-slider"></span></div>${escapeHTML(lbl)}</label>`;
        const renderListItems = (items, type) => items.map((item, i) => `<li class="cbs-list-item"><span>${escapeHTML(item)}</span><button class="cbs-list-remove-btn" data-${type}-index="${i}" title="Remove">${SVG_ICON_TRASH}</button></li>`).join('');
        const renderHeader = (title, tooltip) => `
             <div class="cbs-settings-section-header">
                 <h4>
                     ${escapeHTML(title)}
                     ${tooltip ? `<span class="cbs-tooltip-container">${SVG_ICON_HELP}<span class="cbs-tooltip-text">${escapeHTML(tooltip)}</span></span>` : ''}
                 </h4>
            </div>`;
         const TOOLTIPS = {
            GENERAL: "Turns the plugin on or off.",
            BOT_MUTE: "Options to mute bots, emote messages, or shorten repeated text.",
            COMMAND: "Filters user messages which start with ! or > (! is used to command lexxbot, > is used to command grizzbot).",
            USERNAME: "Filters user messages based on their username (including staff) or clan tag.",
            KEYWORD: "Filters messages based on words or phrases. You can also add usernames and it will filter any message where that user is tagged.",
         };
        let usernameListHTML = '';
        if (settings.blockedUsernames.length > 0) {
            usernameListHTML = `<div class="cbs-list-container" id="cbs-username-list-container"><ul class="cbs-list">${renderListItems(settings.blockedUsernames, 'username')}</ul></div>`;
        }
        let keywordListHTML = '';
        if (settings.blockedKeywords.length > 0) {
            keywordListHTML = `<div class="cbs-list-container" id="cbs-keyword-list-container"><ul class="cbs-list">${renderListItems(settings.blockedKeywords, 'keyword')}</ul></div>`;
        }
        settingsPanelEl.innerHTML = `
            <div class="cbs-settings-section">
                ${renderHeader('General', TOOLTIPS.GENERAL)}
                ${renderToggle('masterFilterActive', "Plugin Enabled")}
            </div>
            <div class="cbs-settings-section">
                 ${renderHeader('Content Filtering', TOOLTIPS.BOT_MUTE)}
                ${renderToggle('muteGrizzbot', `Mute ${GRIZZBOT_USERNAME}`)}
                ${renderToggle('muteLexxbot', `Mute ${LEXXBOT_USERNAME}`)}
                ${renderToggle('muteEmotes', "Mute emotes & slash commands")}
                ${renderToggle('shortenSpamEnabled', "Shorten repeated spam")}
            </div>
            <div class="cbs-settings-section">
                 ${renderHeader('Command Filter', TOOLTIPS.COMMAND)}
                 ${renderToggle('commandFilterEnabled', "Filter '!' or '>' commands")}
            </div>
            <div class="cbs-settings-section">
                 ${renderHeader('Username & Clan Filter', TOOLTIPS.USERNAME)}
                 ${renderToggle('usernameFilterEnabled', "Enabled")}
                <div class="cbs-input-group"><input type="text" id="cbs-username-input" class="cbs-text-input" placeholder="Add name or clan..."><button id="cbs-add-username-btn" class="cbs-action-button" title="Add">${SVG_ICON_ADD_PLUS}Add</button></div>
                ${usernameListHTML}
            </div>
             <div class="cbs-settings-section">
                ${renderHeader('Keyword Filter', TOOLTIPS.KEYWORD)}
                ${renderToggle('keywordFilterEnabled', "Enabled")}
                <div class="cbs-input-group"><input type="text" id="cbs-keyword-input" class="cbs-text-input" placeholder="Add keyword/phrase..."><button id="cbs-add-keyword-btn" class="cbs-action-button" title="Add">${SVG_ICON_ADD_PLUS}Add</button></div>
                ${keywordListHTML}
             </div>
        `;
    }

    function handleSettingsPanelChange(event) {
        log('handleSettingsPanelChange fired. Target:', event.target);
         if (event.target.closest('.cbs-tooltip-container')) return;
        event.stopImmediatePropagation();
        const target = event.target;
        if (target.matches('input[type="checkbox"][data-setting]')) {
            const settingKey = target.dataset.setting;
            settings[settingKey] = target.checked;
            log(`Setting '${settingKey}' toggled to ${target.checked}`);
            saveSettings();
            if (settingKey === "masterFilterActive") updateMasterFilterButton();
            applyAllFiltersToExistingDOM();
        }
    }

    function handleSettingsPanelClick(event) {
        log('handleSettingsPanelClick fired. Target:', event.target);
         if (event.target.closest('.cbs-tooltip-container')) {
              event.stopImmediatePropagation();
             return;
         }
        event.stopImmediatePropagation();
        const target = event.target.closest('button');
        if (!target) {
             log('Clicked inside panel, but not on a button we handle.');
             return;
        }
        log('Button clicked inside panel:', target.id || `data-${Object.keys(target.dataset)[0]}`);
        const processList = (listKey, inputId, type, action) => {
            if (action === 'add') {
                const inputEl = settingsPanelEl.querySelector(`#${inputId}`);
                const newItem = inputEl.value.trim();
                if (newItem && !settings[listKey].some(item => item.toLowerCase() === newItem.toLowerCase())) {
                    settings[listKey].push(newItem);
                    settings[listKey].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                    log(`${type} added: "${newItem}"`);
                    inputEl.value = ''; inputEl.focus();
                } else if (newItem) {
                    log(`${type} "${newItem}" already exists or is invalid.`);
                    inputEl.value = ''; inputEl.focus();
                } else {
                    inputEl.focus();
                }
            } else if (action === 'remove') {
                const itemIndex = parseInt(target.dataset[`${type.toLowerCase()}Index`], 10);
                if (!isNaN(itemIndex) && itemIndex >= 0 && itemIndex < settings[listKey].length) {
                    const removed = settings[listKey].splice(itemIndex, 1)[0];
                    log(`${type} removed: "${removed}"`);
                }
            }
            saveSettings();
            createSettingsPanelContent();
            applyAllFiltersToExistingDOM();
        };

        if (target.id === 'cbs-add-username-btn') processList('blockedUsernames', 'cbs-username-input', 'Username', 'add');
        else if (target.id === 'cbs-add-keyword-btn') processList('blockedKeywords', 'cbs-keyword-input', 'Keyword', 'add');
        else if (target.dataset.usernameIndex !== undefined) processList('blockedUsernames', '', 'Username', 'remove');
        else if (target.dataset.keywordIndex !== undefined) processList('blockedKeywords', '', 'Keyword', 'remove');
    }

    function addControls(chatHeader) {
        if (chatHeader.querySelector('.cbs-controls')) return true;
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'cbs-controls';

        masterFilterBtn = document.createElement('button');
        masterFilterBtn.className = 'cbs-btn';
        masterFilterBtn.addEventListener('click', () => {
            settings.masterFilterActive = !settings.masterFilterActive;
            saveSettings();
            updateMasterFilterButton();
            applyAllFiltersToExistingDOM();
        });
        controlsContainer.appendChild(masterFilterBtn);
        updateMasterFilterButton();

        settingsBtn = document.createElement('button');
        settingsBtn.className = 'cbs-settings-btn-app';
        settingsBtn.innerHTML = SVG_ICON_SETTINGS_GEAR;
        settingsBtn.title = 'Chat Enhancer Settings';
        settingsBtn.addEventListener('click', (e) => {
            log('Settings button clicked.');
            e.stopImmediatePropagation();
            const isVisible = settingsPanelEl.style.display === 'block';

            if (!isVisible) {
                createSettingsPanelContent();
                settingsPanelEl.style.visibility = 'hidden';
                settingsPanelEl.style.display = 'block';
                 setTimeout(() => {
                    const panelWidth = settingsPanelEl.offsetWidth;
                    const panelHeight = settingsPanelEl.offsetHeight;
                    settingsPanelEl.style.display = 'none';
                    settingsPanelEl.style.visibility = 'visible';
                    const controlsRect = controlsContainer.getBoundingClientRect();
                    let panelTop = controlsRect.bottom + window.scrollY + 6;
                    let panelLeft = controlsRect.right + window.scrollX - panelWidth;
                    const viewportWidth = document.documentElement.clientWidth;
                    const viewportHeight = document.documentElement.clientHeight;
                    const margin = 12;

                    if (panelLeft + panelWidth > viewportWidth + window.scrollX - margin) panelLeft = viewportWidth + window.scrollX - panelWidth - margin;
                    if (panelLeft < window.scrollX + margin) panelLeft = window.scrollX + margin;
                    if (panelTop + panelHeight > viewportHeight + window.scrollY - margin) {
                        if (controlsRect.top + window.scrollY - panelHeight - 6 > window.scrollY + margin) panelTop = controlsRect.top + window.scrollY - panelHeight - 6;
                        else panelTop = Math.max(margin, viewportHeight + window.scrollY - panelHeight - margin);
                    }
                    if (panelTop < window.scrollY + margin) panelTop = window.scrollY + margin;

                    settingsPanelEl.style.top = panelTop + 'px';
                    settingsPanelEl.style.left = panelLeft + 'px';
                    settingsPanelEl.style.display = 'block';
                    const firstInput = settingsPanelEl.querySelector('#cbs-username-input') || settingsPanelEl.querySelector('#cbs-keyword-input');
                    if(firstInput) firstInput.focus();
                }, 0);
            } else {
                settingsPanelEl.style.display = 'none';
            }
            log(`Settings panel display: ${settingsPanelEl.style.display}`);
        }, true);
        controlsContainer.appendChild(settingsBtn);

        settingsPanelEl = document.createElement('div');
        settingsPanelEl.className = 'cbs-settings-panel';
        settingsPanelEl.addEventListener('change', handleSettingsPanelChange, true);
        settingsPanelEl.addEventListener('click', handleSettingsPanelClick, true);
        document.body.appendChild(settingsPanelEl);

        const roomSelector = chatHeader.querySelector('div[class*="chat-room-selector"]');
        if (roomSelector) roomSelector.insertAdjacentElement('beforebegin', controlsContainer);
        else chatHeader.appendChild(controlsContainer);
        log('Controls added.');

        document.addEventListener('click', (e) => {
            if (settingsPanelEl && settingsPanelEl.style.display === 'block' &&
                e.target !== settingsBtn && !settingsBtn.contains(e.target) &&
                !settingsPanelEl.contains(e.target)) {
                 if (e.target.closest('.cbs-tooltip-container')) return;
                log('Clicked outside settings panel and button, closing.');
                settingsPanelEl.style.display = 'none';
            }
        }, true);
        return true;
    }

    function observeChatForDOMChanges() {
        const chatContainer = document.getElementById(CHAT_MESSAGES_CONTAINER_ID);
        if (!chatContainer) { log('[DOM-FILTER] Chat container not found.'); return false; }

        applyAllFiltersToExistingDOM();

        if (chatObserver) chatObserver.disconnect();
        chatObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                 if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const processAndHighlight = (msgNode) => {
                                if (settings.masterFilterActive) {
                                    processMessageNode(msgNode); // Apply filtering
                                }
                                applyHighlightToNode(msgNode); // Apply highlighting
                            };
                            if (node.matches(ALL_MESSAGE_SELECTORS_QUERY)) {
                                processAndHighlight(node);
                            } else {
                                node.querySelectorAll(ALL_MESSAGE_SELECTORS_QUERY).forEach(processAndHighlight);
                            }
                        }
                    }
                 }
            }
        });
        chatObserver.observe(chatContainer, { childList: true, subtree: true });
        log('[DOM-FILTER] MutationObserver attached.');
        return true;
    }

    function initUIDependantParts() {
        log('Initializing UI and DOM observer...');
        const chatHeader = document.querySelector(CHAT_HEADER_SELECTOR);
        const chatMessages = document.getElementById(CHAT_MESSAGES_CONTAINER_ID);

        if (chatHeader && chatMessages) {
            modifyOnlineCountDisplay(chatHeader);
            setupHighlighting(chatMessages); // Set up the new right-click highlight feature.
            if (addControls(chatHeader) && observeChatForDOMChanges()) {
                log('UI & DOM observer init successful.');
            } else {
                log('Failed to fully init UI/DOM observer parts, retrying.');
                setTimeout(initUIDependantParts, 2000);
            }
        } else {
            log('Core Fishtank elements not found. Retrying...');
            setTimeout(initUIDependantParts, 1500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUIDependantParts);
    } else {
        initUIDependantParts();
    }

})();