// ==UserScript==
// @name         Drawaria Chat Tools (Downloader & Message All Friends)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  La herramienta definitiva para descargar conversaciones de chat y enviar mensajes masivos en Drawaria.online. Ambos menús coexisten independientemente.
// @author       YouTubeDrawaria
// @match        *://*.drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/542234/Drawaria%20Chat%20Tools%20%28Downloader%20%20Message%20All%20Friends%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542234/Drawaria%20Chat%20Tools%20%28Downloader%20%20Message%20All%20Friends%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GLOBAL STYLES FOR BOTH MENUS ---
    // Combined and scoped CSS to prevent conflicts
    GM_addStyle(`
        /* Base styles for both containers */
        #chat-downloader-container, #mass-msg-container {
            position: fixed;
            background-color: #fff;
            border: 1px solid #d3d3d3;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #333;
        }

        /* Header styles for both menus */
        #chat-downloader-header, #mass-msg-header {
            padding: 10px;
            cursor: move;
            z-index: 10000;
            background-color: #007bff;
            color: #fff;
            border-top-left-radius: 7px;
            border-top-right-radius: 7px;
            text-align: center;
            font-weight: bold;
        }

        /* Toggle button styles for both menus */
        #chat-downloader-toggle, #mass-msg-toggle {
            padding: 4px 0;
            background-color: #f8f9fa;
            text-align: center;
            cursor: pointer;
            border-bottom: 1px solid #d3d3d3;
            user-select: none;
        }
        #chat-downloader-toggle:hover, #mass-msg-toggle:hover {
            background-color: #e2e6ea;
        }

        /* Body styles for both menus */
        #chat-downloader-body, #mass-msg-body {
            padding: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        /* Collapsed state for both menus */
        #chat-downloader-container.collapsed #chat-downloader-body,
        #mass-msg-container.collapsed #mass-msg-body {
            display: none;
        }
        #chat-downloader-container.collapsed #chat-downloader-toggle,
        #mass-msg-container.collapsed #mass-msg-toggle {
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7m;
            border-bottom: none;
        }

        /* Dragging cursor styles for both */
        body.chat-downloader-dragging, body.chat-downloader-dragging *,
        body.mass-msg-dragging, body.mass-msg-dragging * {
            cursor: move !important;
            user-select: none !important;
        }

        /* Common input/select styles scoped to containers */
        #chat-downloader-container label, #mass-msg-container label {
            display: block;
            margin: 12px 0 5px 0;
            font-weight: 600;
            color: #333;
        }
        #chat-downloader-container select,
        #chat-downloader-container input[type="date"],
        #mass-msg-container input,
        #mass-msg-container select,
        #mass-msg-container textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-bottom: 5px; /* Added for date inputs spacing */
        }
        #mass-msg-container textarea { resize: vertical; min-height: 80px; }

        /* Generic section headers for both */
        #chat-downloader-container .section-header, #mass-msg-container .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
        }
        #chat-downloader-container .section-toggle, #mass-msg-container .section-toggle {
            background: none;
            border: none;
            color: #007bff;
            cursor: pointer;
            padding: 8px 0;
            font-weight: bold;
            text-align: left;
            flex-grow: 1;
        }
        #chat-downloader-container .collapsible-section, #mass-msg-container .collapsible-section {
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 5px;
        }
        /* Default for chat downloader section is open, mass message advanced options default closed */
        #chat-downloader-container #chat-download-section { display: block; }
        #mass-msg-container #advanced-options, #mass-msg-container #profile-section { display: none; }


        /* Button groups */
        #chat-downloader-container .button-group, #mass-msg-container .button-container {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        #chat-downloader-container .button-group button, #mass-msg-container .button-container button {
            flex-grow: 1;
            padding: 10px;
            color: black;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #chat-downloader-container #download-chat-btn, #mass-msg-container #start-mass-msg, #mass-msg-container #progress-bar-inner { background-color: #28a745; }
        #chat-downloader-container #download-chat-btn:hover, #mass-msg-container #start-mass-msg:hover { background-color: #218838; }
        #chat-downloader-container #copy-chat-btn { background-color: #007bff; }
        #chat-downloader-container #copy-chat-btn:hover { background-color: #0056b3; }
        #mass-msg-container #stop-mass-msg { background-color: #dc3545; display: none; } /* Default hidden for mass msg */
        #mass-msg-container #stop-mass-msg:hover { background-color: #c82333; }

        #chat-downloader-container #download-chat-btn:disabled, #chat-downloader-container #copy-chat-btn:disabled,
        #mass-msg-container #start-mass-msg:disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }

        /* Progress indicator for chat downloader */
        #chat-downloader-container #progress-indicator {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
            color: #007bff;
            display: none;
        }

        /* Log panel styles for both menus */
        #chat-downloader-container #chat-downloader-log, #mass-msg-container #mass-msg-log {
            margin-top: 10px;
            padding: 8px;
            background-color: #fff;
            border: 1px solid #ddd;
            height: 100px; /* Adjusted to 100px for consistency, mass-msg was 120px */
            overflow-y: auto;
            font-size: 12px;
            border-radius: 4px;
            line-height: 1.5;
            position: relative;
        }
        #chat-downloader-container #chat-downloader-log-clear {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 2px 5px;
            font-size: 10px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        #chat-downloader-container #chat-downloader-log-clear:hover {
            opacity: 1;
            background: #e0e0e0;
        }

        /* Log message types for both */
        .log-info { color: #555; }
        .log-success { color: #28a745; font-weight: bold; }
        .log-error { color: #dc3545; font-weight: bold; }
        .log-pause { color: #ff8c00; font-style: italic; } /* Specific to mass message */

        /* Styles specific to Mass Message menu */
        #mass-msg-container { width: 360px; } /* Specific width */
        #mass-msg-container .info-button { font-size: 14px; font-weight: bold; color: #007bff; cursor: pointer; border: 1px solid #007bff; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s, color 0.2s; }
        #mass-msg-container .info-button:hover { background-color: #007bff; color: #fff; }
        #mass-msg-container .input-grid { display: flex; gap: 10px; margin-top: 12px; }
        #mass-msg-container .grid-item { flex: 1; min-width: 0; }
        #mass-msg-container .grid-item label { margin-top: 0; }
        #mass-msg-container #profile-manager { display: flex; gap: 5px; align-items: center; }
        #mass-msg-container #profile-manager select { flex-grow: 1; }
        #mass-msg-container #profile-manager button { padding: 8px; white-space: nowrap; }
        #mass-msg-container #exclusion-controls { display: flex; gap: 5px; margin: 8px 0; }
        #mass-msg-container #exclusion-controls button { flex: 1; padding: 3px; font-size: 10px; }
        #mass-msg-container #progress-container { margin-top: 15px; display: none; }
        #mass-msg-container #progress-bar { width: 100%; height: 20px; background-color: #e9ecef; border-radius: 4px; overflow: hidden; }
        #mass-msg-container #progress-bar-inner { width: 0%; height: 100%; transition: width 0.3s ease; }
        #mass-msg-container #progress-text { text-align: center; font-size: 12px; margin-top: 4px; }
        #mass-msg-container .exclusion-container { border: 1px solid #e0e0e0; border-radius: 4px; background: #fff; margin-bottom: 8px; }
        #mass-msg-container #exclusion-list { max-height: 60px; overflow-y: auto; }
        #mass-msg-exclusion-list { display: none; }

    `);

    // --- Module 1: Drawaria Friend Chat Downloader ---
    (function() {
        // --- 0. CONSTANTS AND CONFIGURATION ---
        const CHAT_SELECTORS = {
            CHAT_CONTAINER: 'div#friends-tabmessages-list',
            CHAT_HEADER: 'div#friends-tabmessages-header',
            MESSAGE_ELEMENT: '.message',
            SENDER_NAME: '.sender-name, .username',
            MESSAGE_CONTENT: '.message-content, .message-text, .text-content, .msg-text',
            MESSAGE_TIMESTAMP: '.message-timestamp, .timestamp, .msg-time, small'
        };

        const SCROLL_LOAD_MAX_ATTEMPTS = 30;
        const SCROLL_LOAD_PAUSE_MS = 250;

        // --- 1. HTML FOR THE MENU ---
        const chatDownloaderMenuHTML = `


            <div id="chat-downloader-container">
                <div id="chat-downloader-header">💬 Drawaria Friend Chat Downloader</div>
                <div id="chat-downloader-toggle">▼</div>
                <div id="chat-downloader-body">
                    <div id="chat-download-section">
                        <p>Abre el chat con la persona deseada antes de usar esta función.</p>

                        <label for="chat-downloader-export-format">Formato de Exportación:</label>
                        <select id="chat-downloader-export-format">
                            <option value="txt">Texto Plano (.txt)</option>
                            <option value="json">JSON (.json)</option>
                            <option value="csv">CSV (.csv)</option>
                        </select>

                        <label for="chat-downloader-timestamp-format">Formato de Fecha/Hora:</label>
                        <select id="chat-downloader-timestamp-format">
                            <option value="full">Fecha y Hora Completa (ej. 7/12/25, 2:55:30 PM)</option>
                            <option value="time">Solo Hora (ej. 2:55:30 PM)</option>
                            <option value="date">Solo Fecha (ej. 7/12/25)</option>
                            <option value="iso">ISO 8601 (ej. 2025-07-12T14:55:30.000Z)</option>
                        </select>

                        <label for="chat-downloader-message-detail-format">Detalle del Mensaje:</label>
                        <select id="chat-downloader-message-detail-format">
                            <option value="full_detail">Fecha, Remitente y Mensaje (ej. [Fecha] Nombre: Mensaje)</option>
                            <option value="no_timestamp">Remitente y Mensaje (ej. Nombre: Mensaje)</option>
                            <option value="content_only">Solo Mensaje (ej. Mensaje)</option>
                        </select>

                        <label>Filtrar por Fecha:</label>
                        <div class="input-group">
                            <div>
                                <label for="chat-downloader-start-date">Desde:</label>
                                <input type="date" id="chat-downloader-start-date">
                            </div>
                            <div>
                                <label for="chat-downloader-end-date">Hasta:</label>
                                <input type="date" id="chat-downloader-end-date">
                            </div>
                        </div>

                        <div class="button-group">
                            <button id="chat-downloader-download-chat-btn">Descargar</button>
                            <button id="chat-downloader-copy-chat-btn">Copiar al Portapapeles</button>
                        </div>

                        <div id="chat-downloader-progress-indicator">Cargando mensajes...</div>
                    </div>
                    <div id="chat-downloader-log">
                        <button id="chat-downloader-log-clear">Limpiar</button>
                        Esperando instrucciones...
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatDownloaderMenuHTML);



        // --- 2. DEFINITION OF VARIABLES AND UI ELEMENTS ---
        const chatDownloader_ui = {
            container: document.getElementById('chat-downloader-container'),
            header: document.getElementById('chat-downloader-header'),
            toggleButton: document.getElementById('chat-downloader-toggle'),
            body: document.getElementById('chat-downloader-body'),
            logPanel: document.getElementById('chat-downloader-log'),
            logClearButton: document.getElementById('chat-downloader-log-clear'),
            downloadChatButton: document.getElementById('chat-downloader-download-chat-btn'),
            copyChatButton: document.getElementById('chat-downloader-copy-chat-btn'),
            exportFormatSelect: document.getElementById('chat-downloader-export-format'),
            timestampFormatSelect: document.getElementById('chat-downloader-timestamp-format'),
            messageDetailFormatSelect: document.getElementById('chat-downloader-message-detail-format'),
            startDateInput: document.getElementById('chat-downloader-start-date'),
            endDateInput: document.getElementById('chat-downloader-end-date'),
            progressIndicator: document.getElementById('chat-downloader-progress-indicator'),
        };

        // --- 3. HELPER FUNCTIONS ---

        /**
         * Writes a message to the script's log panel.
         * @param {string} message The message to log.
         * @param {string} type The message type (e.g., 'info', 'success', 'error').
         */
        function chatDownloader_logToPanel(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            chatDownloader_ui.logPanel.insertAdjacentHTML('beforeend', `<div class="log-${type}">[${timestamp}] ${message}</div>`);
            chatDownloader_ui.logPanel.scrollTop = chatDownloader_ui.logPanel.scrollHeight;
        }

        /**
         * Collapses or expands the script menu and saves the state.
         * @param {boolean} collapsed Whether the menu should be collapsed.
         */
        function chatDownloader_setMenuCollapsed(collapsed) {
            if (collapsed) {
                chatDownloader_ui.container.classList.add('collapsed');
                chatDownloader_ui.toggleButton.textContent = '▲';
            } else {
                chatDownloader_ui.container.classList.remove('collapsed');
                chatDownloader_ui.toggleButton.textContent = '▼';
            }
            GM_setValue('chatDownloader_menuCollapsed', collapsed);
        }

        /**
         * Enables/disables action buttons and shows/hides the progress indicator.
         * @param {boolean} disabled Whether buttons should be disabled.
         */
        function chatDownloader_toggleButtonsAndProgress(disabled) {
            chatDownloader_ui.downloadChatButton.disabled = disabled;
            chatDownloader_ui.copyChatButton.disabled = disabled;
            chatDownloader_ui.progressIndicator.style.display = disabled ? 'block' : 'none';
        }

        /**
         * Allows an element to be dragged by a handle. Saves its position.
         * @param {HTMLElement} elmnt The element that can be dragged.
         * @param {HTMLElement} dragHandle The element that acts as the drag handle.
         */
        function chatDownloader_dragElement(elmnt, dragHandle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            // Load saved position
            const savedTop = GM_getValue('chatDownloader_menuTop', '10px');
            const savedLeft = GM_getValue('chatDownloader_menuLeft', '10px');
            elmnt.style.top = savedTop;
            elmnt.style.left = savedLeft;

            dragHandle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.body.classList.add('chat-downloader-dragging');
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.body.classList.remove('chat-downloader-dragging');
                document.onmouseup = null;
                document.onmousemove = null;
                // Save current position
                GM_setValue('chatDownloader_menuTop', elmnt.style.top);
                GM_setValue('chatDownloader_menuLeft', elmnt.style.left);
            }
        }

        /**
         * Attempts to extract the clean date/time part from a string that may contain other text.
         * This is crucial if the `MESSAGE_TIMESTAMP` selector sometimes captures more than just the date.
         * @param {string} fullText The full text string of the timestamp element.
         * @returns {string} The part of the string that is likely the date/time or the original string.
         */
        function chatDownloader_extractCleanTimestampPart(fullText) {
            const match = fullText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?::\d{2})? (?:AM|PM))/i);
            if (match && match[1]) {
                return match[1];
            }
            return fullText;
        }

        /**
         * Parses a timestamp string or number (epoch) into a Date object.
         * @param {string|number} rawTimestamp The timestamp string or epoch number.
         * @returns {Date|null} A Date object or null if it cannot be parsed.
         */
        function chatDownloader_parseTimestampToDate(rawTimestamp) {
            if (rawTimestamp instanceof Date) {
                return rawTimestamp;
            }
            if (typeof rawTimestamp === 'number') {
                const date = new Date(rawTimestamp);
                return date;
            }
            if (typeof rawTimestamp === 'string') {
                const cleanedTimestamp = chatDownloader_extractCleanTimestampPart(rawTimestamp);

                let dateObj = new Date(cleanedTimestamp);
                if (!isNaN(dateObj.getTime())) {
                    return dateObj;
                }

                const parts = cleanedTimestamp.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})(?::(\d{2}))? (AM|PM)/i);
                if (parts) {
                    let [_, month, day, year, hour, minute, second, ampm] = parts;
                    let fullYear = parseInt(year, 10);
                    if (fullYear < 100) {
                        fullYear += (fullYear > (new Date().getFullYear() % 100) + 1 ? 1900 : 2000);
                    }
                    let h = parseInt(hour, 10);
                    if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                    if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
                    const s = second ? parseInt(second, 10) : 0;

                    dateObj = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10), h, parseInt(minute, 10), s, 0);
                    if (!isNaN(dateObj.getTime())) {
                        return dateObj;
                    }
                }

                dateObj = new Date(Date.parse(cleanedTimestamp));
                if (!isNaN(dateObj.getTime())) {
                    return dateObj;
                }
            }
            return null;
        }

        /**
         * Formats a Date object according to the user's selected format.
         * If dateObj is invalid, it uses the current system time.
         * @param {Date} dateObj The Date object to format.
         * @param {string} format 'full', 'time', 'date', 'iso'.
         * @returns {string} The formatted timestamp.
         */
        function chatDownloader_formatTimestamp(dateObj, format) {
            let dateToFormat = dateObj;

            if (!dateObj || isNaN(dateObj.getTime())) {
                dateToFormat = new Date();
                console.warn(`[chatDownloader_formatTimestamp] Invalid date object received. Using current time: ${dateToFormat.toISOString()}`);
            }

            if (format === 'iso') {
                return dateToFormat.toISOString();
            }

            let options = {};
            const locale = 'es-ES';

            switch (format) {
                case 'full':
                    options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                    break;
                case 'time':
                    options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                    break;
                case 'date':
                    options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    break;
                default:
                    options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                    console.warn(`[chatDownloader_formatTimestamp] Unknown format "${format}". Using default full format.`);
                    break;
            }

            try {
                return dateToFormat.toLocaleString(locale, options);
            } catch (e) {
                console.error("Error formatting date with toLocaleString:", e);
                return dateToFormat.toISOString();
            }
        }

        /**
         * Robustly extracts the friend's name from the chat header.
         * @returns {string} The friend's name or 'UnknownFriend' if not found.
         */
        function chatDownloader_getFriendName() {
            const headerElement = document.querySelector(CHAT_SELECTORS.CHAT_HEADER);
            if (!headerElement) {
                return 'UnknownFriend';
            }

            const nameEl = headerElement.querySelector('.username, .playername');
            if (nameEl && nameEl.textContent.trim()) {
                return nameEl.textContent.trim();
            }

            const messagesTitle = headerElement.textContent.trim();
            if (messagesTitle.includes('Messages')) {
                const parts = messagesTitle.split(' ').filter(part => part.toLowerCase() !== 'messages' && part.trim() !== '');
                if (parts.length > 0) {
                    return parts.join(' ');
                }
            }

            const headerTextNodes = Array.from(headerElement.childNodes)
                                     .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
                                     .map(node => node.textContent.trim());
            const filteredText = headerTextNodes.filter(text => text.toLowerCase() !== 'messages').join(' ');
            if (filteredText) {
                return filteredText;
            }

            return 'UnknownFriend';
        }

        /**
         * Scrolls the chat container up to load all history.
         * @param {HTMLElement} chatContainer The scrollable chat element.
         */
        async function chatDownloader_scrollToLoadAllMessages(chatContainer) {
            chatDownloader_logToPanel('Intentando cargar todo el historial de chat...', 'info');
            chatDownloader_toggleButtonsAndProgress(true);

            let previousScrollHeight = 0;
            let attempts = 0;

            while (attempts < SCROLL_LOAD_MAX_ATTEMPTS) {
                chatContainer.scrollTop = 0;
                await new Promise(resolve => setTimeout(resolve, SCROLL_LOAD_PAUSE_MS));

                const currentScrollHeight = chatContainer.scrollHeight;

                if (currentScrollHeight === previousScrollHeight) {
                    chatDownloader_logToPanel(`Historial cargado. ${attempts + 1} intentos de scroll.`, 'info');
                    break;
                } else {
                    previousScrollHeight = currentScrollHeight;
                    attempts++;
                    chatDownloader_logToPanel(`Cargando... Altura de scroll: ${currentScrollHeight}px`, 'info');
                }
            }

            if (attempts >= SCROLL_LOAD_MAX_ATTEMPTS) {
                chatDownloader_logToPanel('Advertencia: El historial de chat podría no estar completamente cargado (límite de intentos alcanzado).', 'error');
            }
        }

        /**
         * Collects and processes all chat messages, applying date filters.
         * @returns {Array<Object>} An array of message objects.
         */
        async function chatDownloader_getFilteredChatMessages() {
            const chatContainer = document.querySelector(CHAT_SELECTORS.CHAT_CONTAINER);
            if (!chatContainer) {
                chatDownloader_logToPanel('Error: No se encontró la ventana de chat activa. Asegúrate de tener una conversación abierta.', 'error');
                return [];
            }

            await chatDownloader_scrollToLoadAllMessages(chatContainer);

            const messagesElements = chatContainer.querySelectorAll(CHAT_SELECTORS.MESSAGE_ELEMENT);
            if (messagesElements.length === 0) {
                chatDownloader_logToPanel('No se encontraron mensajes en la conversación. Asegúrate de tener un historial de chat visible.', 'error');
                return [];
            }

            const friendName = chatDownloader_getFriendName();

            const startDateStr = chatDownloader_ui.startDateInput.value;
            const endDateStr = chatDownloader_ui.endDateInput.value;

            let filterStartDate = null;
            let filterEndDate = null;

            if (startDateStr) {
                filterStartDate = new Date(startDateStr);
                filterStartDate.setHours(0, 0, 0, 0);
                if (isNaN(filterStartDate.getTime())) {
                    chatDownloader_logToPanel('Advertencia: Fecha de inicio inválida. Ignorando filtro de inicio.', 'error');
                    filterStartDate = null;
                }
            }
            if (endDateStr) {
                filterEndDate = new Date(endDateStr);
                filterEndDate.setHours(23, 59, 59, 999);
                if (isNaN(filterEndDate.getTime())) {
                    chatDownloader_logToPanel('Advertencia: Fecha de fin inválida. Ignorando filtro de fin.', 'error');
                    filterEndDate = null;
                }
            }

            const collectedMessages = [];

            messagesElements.forEach(msgEl => {
                let sender = 'Desconocido';
                let content = '';
                let rawTimestamp = '';

                const timestampEl = msgEl.querySelector(CHAT_SELECTORS.MESSAGE_TIMESTAMP);
                if (timestampEl) {
                    rawTimestamp = timestampEl.textContent.trim();
                } else {
                    const dateMeta = msgEl.querySelector('[data-timestamp], [title]');
                    if (dateMeta && dateMeta.dataset.timestamp) {
                        rawTimestamp = parseInt(dateMeta.dataset.timestamp, 10);
                    } else if (dateMeta && dateMeta.title) {
                        const titleMatch = dateMeta.title.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?::\d{2})? (?:AM|PM))/i);
                        if (titleMatch && titleMatch[1]) {
                            rawTimestamp = titleMatch[1];
                        } else {
                            rawTimestamp = dateMeta.title;
                        }
                    }
                }
                const messageDate = chatDownloader_parseTimestampToDate(rawTimestamp);

                if (messageDate) {
                    if (filterStartDate && messageDate < filterStartDate) {
                        return;
                    }
                    if (filterEndDate && messageDate > filterEndDate) {
                        return;
                    }
                } else {
                    if (filterStartDate || filterEndDate) {
                        chatDownloader_logToPanel(`Advertencia: Mensaje omitido porque no se pudo parsear la fecha/hora para el filtro: "${rawTimestamp}".`, 'info');
                        return;
                    }
                }

                const senderEl = msgEl.querySelector(CHAT_SELECTORS.SENDER_NAME);
                if (senderEl && senderEl.textContent.trim()) {
                    sender = senderEl.textContent.trim();
                } else if (msgEl.classList.contains('fromself')) {
                    sender = 'Yo';
                } else {
                    sender = friendName;
                }

                const contentEl = msgEl.querySelector(CHAT_SELECTORS.MESSAGE_CONTENT);
                if (contentEl && contentEl.textContent.trim()) {
                    content = contentEl.textContent.trim();
                } else {
                    content = Array.from(msgEl.childNodes)
                                .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
                                .map(node => node.textContent.trim())
                                .join(' ');
                    if (!content && msgEl.children.length > 0) {
                        const relevantChild = Array.from(msgEl.children)
                                                    .find(child => !child.matches(CHAT_SELECTORS.MESSAGE_TIMESTAMP) && child.textContent.trim().length > 0);
                        if (relevantChild) {
                            content = relevantChild.textContent.trim();
                        }
                    }
                }

                collectedMessages.push({
                    date: messageDate,
                    sender: sender,
                    content: content
                });
            });

            chatDownloader_logToPanel(`Se recolectaron ${collectedMessages.length} mensajes después de aplicar filtros.`, 'success');
            return collectedMessages;
        }

        /**
         * Generates chat content in plain text format.
         * @param {Array<Object>} messages The messages to export.
         * @param {string} friendName Friend's name.
         * @param {string} timestampFormat Date/time format.
         * @param {string} messageDetailFormat Message detail format.
         * @returns {string} The text file content.
         */
        function chatDownloader_exportChatAsText(messages, friendName, timestampFormat, messageDetailFormat) {
            let chatText = `--- Conversación con ${friendName} ---\n\n`;
            messages.forEach(msg => {
                let line = '';
                const formattedTimestamp = chatDownloader_formatTimestamp(msg.date, timestampFormat);

                if (messageDetailFormat === 'content_only') {
                    line = `${msg.content}\n`;
                } else if (messageDetailFormat === 'no_timestamp') {
                    line = `${msg.sender}: ${msg.content}\n`;
                } else {
                    line = `[${formattedTimestamp}] ${msg.sender}: ${msg.content}\n`;
                }
                chatText += line;
            });
            return chatText;
        }

        /**
         * Generates chat content in JSON format.
         * @param {Array<Object>} messages The messages to export.
         * @param {string} friendName Friend's name.
         * @param {string} timestampFormat Date/time format.
         * @param {string} messageDetailFormat Message detail format.
         * @returns {string} The JSON content.
         */
        function chatDownloader_exportChatAsJson(messages, friendName, timestampFormat, messageDetailFormat) {
            const data = {
                friend: friendName,
                exportedAt: new Date().toISOString(),
                messages: messages.map(msg => {
                    const messageObject = {};
                    if (messageDetailFormat === 'full_detail') {
                        messageObject.timestamp = chatDownloader_formatTimestamp(msg.date, timestampFormat === 'iso' ? 'iso' : 'full');
                        messageObject.sender = msg.sender;
                    } else if (messageDetailFormat === 'no_timestamp') {
                        messageObject.sender = msg.sender;
                    }
                    messageObject.content = msg.content;
                    return messageObject;
                })
            };
            return JSON.stringify(data, null, 2);
        }

        /**
         * Generates chat content in CSV format.
         * @param {Array<Object>} messages The messages to export.
         * @param {string} friendName Friend's name.
         * @param {string} timestampFormat Date/time format.
         * @param {string} messageDetailFormat Message detail format.
         * @returns {string} The CSV content.
         */
        function chatDownloader_exportChatAsCsv(messages, friendName, timestampFormat, messageDetailFormat) {
            const headers = [];
            if (messageDetailFormat === 'full_detail') {
                headers.push("Timestamp", "Sender", "Content");
            } else if (messageDetailFormat === 'no_timestamp') {
                headers.push("Sender", "Content");
            } else {
                headers.push("Content");
            }

            let csv = headers.join(",") + "\n";

            messages.forEach(msg => {
                const row = [];
                const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;

                if (messageDetailFormat === 'full_detail') {
                    const formattedTimestamp = chatDownloader_formatTimestamp(msg.date, timestampFormat === 'iso' ? 'iso' : 'full');
                    row.push(escapeCsv(formattedTimestamp));
                    row.push(escapeCsv(msg.sender));
                } else if (messageDetailFormat === 'no_timestamp') {
                    row.push(escapeCsv(msg.sender));
                }
                row.push(escapeCsv(msg.content));
                csv += row.join(",") + "\n";
            });
            return csv;
        }

        /**
         * Creates a download link and "clicks" it to initiate file download.
         * @param {string} filename File name.
         * @param {string} content File content.
         * @param {string} mimeType File MIME type.
         * @returns {boolean} True if download started successfully, false otherwise.
         */
        function chatDownloader_createDownloadFile(filename, content, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            try {
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                return true;
            } catch (error) {
                chatDownloader_logToPanel(`Error al iniciar la descarga: ${error.message}. Verifique la consola para más detalles.`, 'error');
                console.error('Error during download link creation/click:', error);
                return false;
            }
        }

        /**
         * Main function that orchestrates chat collection, processing, and export/copy.
         * @param {string} action 'download' to download, 'copy' to copy to clipboard.
         */
        async function chatDownloader_handleChatExport(action) {
            chatDownloader_logToPanel('Iniciando exportación de chat...', 'info');
            chatDownloader_toggleButtonsAndProgress(true);

            try {
                const messages = await chatDownloader_getFilteredChatMessages();
                if (messages.length === 0) {
                    chatDownloader_logToPanel('No hay mensajes para exportar después de aplicar filtros.', 'error');
                    return;
                }

                const friendName = chatDownloader_getFriendName();
                const exportFormat = chatDownloader_ui.exportFormatSelect.value;
                const timestampFormat = chatDownloader_ui.timestampFormatSelect.value;
                const messageDetailFormat = chatDownloader_ui.messageDetailFormatSelect.value;

                let fileContent = '';
                let fileExtension = '';
                let mimeType = '';

                switch (exportFormat) {
                    case 'txt':
                        fileContent = chatDownloader_exportChatAsText(messages, friendName, timestampFormat, messageDetailFormat);
                        fileExtension = 'txt';
                        mimeType = 'text/plain;charset=utf-8';
                        break;
                    case 'json':
                        fileContent = chatDownloader_exportChatAsJson(messages, friendName, timestampFormat, messageDetailFormat);
                        fileExtension = 'json';
                        mimeType = 'application/json;charset=utf-8';
                        break;
                    case 'csv':
                        fileContent = chatDownloader_exportChatAsCsv(messages, friendName, timestampFormat, messageDetailFormat);
                        fileExtension = 'csv';
                        mimeType = 'text/csv;charset=utf-8';
                        break;
                    default:
                        chatDownloader_logToPanel('Error: Formato de exportación no reconocido.', 'error');
                        return;
                }

                if (action === 'download') {
                    const filename = `Drawaria_Chat_${friendName.replace(/[^a-zA-Z0-9_.-]/g, '')}_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
                    if (chatDownloader_createDownloadFile(filename, fileContent, mimeType)) {
                        chatDownloader_logToPanel(`Conversación con ${friendName} descargada como "${filename}".`, 'success');
                    }
                } else if (action === 'copy') {
                    try {
                        GM_setClipboard(fileContent, mimeType);
                        chatDownloader_logToPanel(`Contenido del chat (${exportFormat.toUpperCase()}) copiado al portapapeles.`, 'success');
                    } catch (clipboardError) {
                        chatDownloader_logToPanel(`Error al copiar al portapapeles: ${clipboardError.message}. Asegúrate de que Tampermonkey tenga permiso para acceder al portapapeles (grant GM_setClipboard).`, 'error');
                        console.error('Error copying to clipboard:', clipboardError);
                    }
                }

            } catch (error) {
                chatDownloader_logToPanel(`Error general al exportar chat: ${error.message}.`, 'error');
                console.error('Error exporting chat:', error);
            } finally {
                chatDownloader_toggleButtonsAndProgress(false);
            }
        }

        // --- 4. SCRIPT INITIALIZATION ---
        (function chatDownloader_init() {
            // Load saved state of the menu (collapsed/expanded)
            const isCollapsed = GM_getValue('chatDownloader_menuCollapsed', false);
            chatDownloader_setMenuCollapsed(isCollapsed);

            // Load saved preferences
            chatDownloader_ui.exportFormatSelect.value = GM_getValue('chatDownloader_exportFormat', 'txt');
            chatDownloader_ui.timestampFormatSelect.value = GM_getValue('chatDownloader_timestampFormat', 'full');
            chatDownloader_ui.messageDetailFormatSelect.value = GM_getValue('chatDownloader_messageDetailFormat', 'full_detail');
            chatDownloader_ui.startDateInput.value = GM_getValue('chatDownloader_startDate', '');
            chatDownloader_ui.endDateInput.value = GM_getValue('chatDownloader_endDate', '');

            // Assign events to UI elements
            chatDownloader_ui.toggleButton.addEventListener('click', () => {
                chatDownloader_setMenuCollapsed(chatDownloader_ui.container.classList.toggle('collapsed'));
            });

            chatDownloader_ui.downloadChatButton.addEventListener('click', () => chatDownloader_handleChatExport('download'));
            chatDownloader_ui.copyChatButton.addEventListener('click', () => chatDownloader_handleChatExport('copy'));

            chatDownloader_ui.logClearButton.addEventListener('click', () => {
                Array.from(chatDownloader_ui.logPanel.children).forEach(child => {
                    if (child.tagName === 'DIV') {
                        chatDownloader_ui.logPanel.removeChild(child);
                    }
                });
                chatDownloader_logToPanel('Log limpiado.');
            });

            // Save preferences on change
            chatDownloader_ui.exportFormatSelect.addEventListener('change', (e) => {
                GM_setValue('chatDownloader_exportFormat', e.target.value);
                chatDownloader_logToPanel(`Formato de exportación cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
            });

            chatDownloader_ui.timestampFormatSelect.addEventListener('change', (e) => {
                GM_setValue('chatDownloader_timestampFormat', e.target.value);
                chatDownloader_logToPanel(`Formato de fecha/hora cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
            });

            chatDownloader_ui.messageDetailFormatSelect.addEventListener('change', (e) => {
                GM_setValue('chatDownloader_messageDetailFormat', e.target.value);
                chatDownloader_logToPanel(`Detalle de mensaje cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
            });

            chatDownloader_ui.startDateInput.addEventListener('change', (e) => GM_setValue('chatDownloader_startDate', e.target.value));
            chatDownloader_ui.endDateInput.addEventListener('change', (e) => GM_setValue('chatDownloader_endDate', e.target.value));

            // Initialize menu dragging functionality
            chatDownloader_dragElement(chatDownloader_ui.container, chatDownloader_ui.header);
        })();
    })();

    // --- Module 2: Drawaria Message All Friends ---
    (function() {
        let massMsg_isSending = false;
        const MASS_MSG_BATCH_PAUSE_SECONDS = 60;
        const massMsg_profileHelpText = `Saves and loads all your configurations (message, filters, delays, etc.) for easy reuse.\n\n--- HOW TO USE ---\n\n1. SAVE:\n   - Configure everything to your liking.\n   - Enter a name for the profile.\n   - Click on 'Save Current Profile'.\n\n2. LOAD:\n   - Select a profile from the dropdown menu.\n\n3. DELETE:\n   - Load a profile and click the trash can icon (🗑️).`;

        // --- 1. HTML FOR THE MENU ---
        const massMsgMenuHTML = `
            <div id="mass-msg-container">
                <div id="mass-msg-header">✉️ Drawaria Message All Friends</div>

                <div id="mass-msg-toggle">▼</div>
                <div id="mass-msg-body">
                    <label for="mass-msg-text">Message (use {name} to personalize):</label>
                    <textarea id="mass-msg-text" placeholder="Hello, {name}! How are you?"></textarea>
                    <div class="section-header"> <button class="section-toggle" data-target="mass-msg-profile-section">Profile Manager ▼</button> <span id="mass-msg-profile-info-btn" class="info-button">ⓘ</span> </div>
                    <div id="mass-msg-profile-section" class="collapsible-section">
                        <div id="mass-msg-profile-manager"> <select id="mass-msg-profile-select"><option value="">--- Load Profile ---</option></select> <button id="mass-msg-delete-profile-btn" title="Delete Selected Profile">🗑️</button> </div>
                        <input type="text" id="mass-msg-profile-name" placeholder="New profile name..." style="margin-top: 5px;"> <button id="mass-msg-save-profile-btn" style="width:100%; margin-top:5px;">Save Current Profile</button>
                    </div>
<button id="mass-msg-exclusion-toggle">Mostrar/Ocultar lista de exclusión</button>
<div id="mass-msg-exclusion-list" style="display:none;">
          #mass-msg-container .exclusion-item { display: flex; align-items: center; padding: 1px 3px; border-bottom: 1px solid #f8f9fa; font-size: 10px; line-height: 1.1; }
        #mass-msg-container .exclusion-item label { margin: 0 0 0 4px; font-weight: normal; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        #mass-msg-container .exclusion-item input[type="checkbox"] { width: 10px; height: 10px; margin: 0; }
        #mass-msg-container #exclusion-controls { display: flex; gap: 4px; margin: 6px 0; }
</div>
                    <div class="input-grid">
                         <div class="grid-item"><label for="mass-msg-delay">Delay (ms):</label><input type="number" id="mass-msg-delay" value="1500" min="500" step="100"></div>
                         <div class="grid-item"><label for="mass-msg-lang-filter">Send to:</label><select id="mass-msg-lang-filter"><option value="all">All / Todos</option><option value="es">Spanish</option><option value="en">English</option><option value="ru">Russian</option><option value="ar">Arabic</option></select></div>
                         <div class="grid-item"><label for="mass-msg-count-limit">Limit:</label><input type="number" id="mass-msg-count-limit" placeholder="All"></div>
                    </div>
                    <label for="mass-msg-exclusion-search">Skip these people:</label>
                    <div id="mass-msg-exclusion-controls"> <button id="mass-msg-select-all-exclude">All</button> <button id="mass-msg-deselect-all-exclude">None</button> <button id="mass-msg-invert-exclude">Invert</button> </div>
                    <div class="exclusion-container"> <input type="text" id="mass-msg-exclusion-search" placeholder="Search friend to skip..."> <div id="mass-msg-exclusion-list">Open friends list to populate.</div> </div>
                    <div class="section-header"> <button class="section-toggle" data-target="mass-msg-advanced-options">Advanced Options (Batches) ▼</button> </div>
                    <div id="mass-msg-advanced-options" class="collapsible-section">
                        <label for="mass-msg-batch-size">Batch Size (e.g. 50):</label> <input type="number" id="mass-msg-batch-size" placeholder="Leave empty to not use batches"> <small>There will be a 60-second pause between each batch.</small>
                    </div>
                    <div class="button-container"> <button id="mass-msg-start-mass-msg">Send</button> <button id="mass-msg-stop-mass-msg">Stop Sending</button> </div>
                    <div id="mass-msg-progress-container"> <div id="mass-msg-progress-bar"><div id="mass-msg-progress-bar-inner"></div></div> <div id="mass-msg-progress-text"></div> </div>
                    <div id="mass-msg-log">Waiting for instructions...</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', massMsgMenuHTML);

        // --- 2. VARIABLE AND UI ELEMENT DEFINITIONS ---
        const massMsg_ui = {
            container: document.getElementById('mass-msg-container'),
            header: document.getElementById('mass-msg-header'),
            toggleButton: document.getElementById('mass-msg-toggle'),
            body: document.getElementById('mass-msg-body'),
            startButton: document.getElementById('mass-msg-start-mass-msg'),
            stopButton: document.getElementById('mass-msg-stop-mass-msg'),
            messageInput: document.getElementById('mass-msg-text'),
            delayInput: document.getElementById('mass-msg-delay'),
            logPanel: document.getElementById('mass-msg-log'),
            langFilter: document.getElementById('mass-msg-lang-filter'),
            countLimit: document.getElementById('mass-msg-count-limit'),
            exclusionList: document.getElementById('mass-msg-exclusion-list'),
            exclusionSearch: document.getElementById('mass-msg-exclusion-search'),
            batchSizeInput: document.getElementById('mass-msg-batch-size'),
            profileSelect: document.getElementById('mass-msg-profile-select'),
            profileNameInput: document.getElementById('mass-msg-profile-name'),
            saveProfileButton: document.getElementById('mass-msg-save-profile-btn'),
            deleteProfileButton: document.getElementById('mass-msg-delete-profile-btn'),
            selectAllButton: document.getElementById('mass-msg-select-all-exclude'),
            deselectAllButton: document.getElementById('mass-msg-deselect-all-exclude'),
            invertButton: document.getElementById('mass-msg-invert-exclude'),
            progressContainer: document.getElementById('mass-msg-progress-container'),
            progressBarInner: document.getElementById('mass-msg-progress-bar-inner'),
            progressText: document.getElementById('mass-msg-progress-text'),
            profileInfoButton: document.getElementById('mass-msg-profile-info-btn'),
        };

document.getElementById('mass-msg-exclusion-toggle').addEventListener('click', function() {
    var list = document.getElementById('mass-msg-exclusion-list');
    if (list.style.display === 'none' || list.style.display === '') {
        list.style.display = 'block';
        this.textContent = 'Ocultar lista de exclusión';
    } else {
        list.style.display = 'none';
        this.textContent = 'Mostrar lista de exclusión';
    }
});


        // --- 3. FUNCTION DEFINITIONS ---
        function massMsg_logToPanel(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            massMsg_ui.logPanel.innerHTML += `<div class="log-${type}">[${timestamp}] ${message}</div>`;
            massMsg_ui.logPanel.scrollTop = massMsg_ui.logPanel.scrollHeight;
        }

        function massMsg_setMenuCollapsed(collapsed) {
            if (collapsed) {
                massMsg_ui.container.classList.add('collapsed');
                massMsg_ui.toggleButton.textContent = '▲';
            } else {
                massMsg_ui.container.classList.remove('collapsed');
                massMsg_ui.toggleButton.textContent = '▼';
            }
            GM_setValue('massMsg_menuCollapsed', collapsed);
        }

        function massMsg_saveCurrentSettings() {
            return {
                message: massMsg_ui.messageInput.value,
                delay: massMsg_ui.delayInput.value,
                lang: massMsg_ui.langFilter.value,
                limit: massMsg_ui.countLimit.value,
                batchSize: massMsg_ui.batchSizeInput.value,
            };
        }

        function massMsg_loadSettings(settings) {
            massMsg_ui.messageInput.value = settings.message || '';
            massMsg_ui.delayInput.value = settings.delay || 1500;
            massMsg_ui.langFilter.value = settings.lang || 'all';
            massMsg_ui.countLimit.value = settings.limit || '';
            massMsg_ui.batchSizeInput.value = settings.batchSize || '';
        }

        function massMsg_populateProfileDropdown() {
            const profiles = GM_getValue('massMsg_savedProfiles', {});
            massMsg_ui.profileSelect.innerHTML = '<option value="">--- Load Profile ---</option>';
            for (const name in profiles) {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                massMsg_ui.profileSelect.appendChild(option);
            }
        }

        function massMsg_setAllCheckboxes(checked) {
            massMsg_ui.exclusionList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checked);
        }

        function massMsg_stopSending(finished = false) {
            if (finished) {
                massMsg_logToPanel('--- Process finished! ---', 'success');
            }
            massMsg_isSending = false;
            massMsg_ui.startButton.style.display = 'block';
            massMsg_ui.stopButton.style.display = 'none';
            massMsg_ui.startButton.disabled = false;
            massMsg_ui.progressContainer.style.display = 'none';
        }

        function massMsg_filterByLanguage(elements, lang) {
            if (lang === 'all') return elements;
            const patterns = {
                es: /[ñáéíóúü¡¿]/i,
                ru: /[а-яА-Я]/,
                ar: /[\u0600-\u06FF]/,
                en: /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]*$/
            };
            const otherLangsPattern = /([ñáéíóúü¡¿]|[а-яА-Я]|[\u0600-\u06FF])/i;

            return elements.filter(el => {
                const username = el.querySelector('.playername')?.textContent || '';
                return lang === 'en' ? !otherLangsPattern.test(username) : (patterns[lang] && patterns[lang].test(username));
            });
        }

        function massMsg_populateExclusionList() {
            const friendElements = document.querySelectorAll('#friends-tabfriendlist .content .tabrow');
            if (friendElements.length === 0) return;
            massMsg_ui.exclusionList.innerHTML = '';
            friendElements.forEach((el, index) => {
                const uid = el.dataset.playeruid;
                const name = el.querySelector('.playername')?.textContent || uid;
                massMsg_ui.exclusionList.insertAdjacentHTML('beforeend', `<div class="exclusion-item" data-name="${name.toLowerCase()}"><input type="checkbox" id="mass-msg-exclude-${index}" data-uid="${uid}"><label for="mass-msg-exclude-${index}">${name}</label></div>`);
            });
        }

        function massMsg_updateProgress(current, total) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            massMsg_ui.progressBarInner.style.width = `${percentage}%`;
            const etaText = massMsg_calculateETA(current, total);
            massMsg_ui.progressText.textContent = `Sent ${current} / ${total} ${etaText}`;
        }

        function massMsg_formatTime(seconds) {
            if (seconds < 60) return `${Math.round(seconds)}s`;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.round(seconds % 60);
            return `${minutes}m ${remainingSeconds}s`;
        }

        function massMsg_calculateETA(current, total) {
            if (current >= total) return '';
            const remaining = total - current;
            const delay = (parseInt(massMsg_ui.delayInput.value, 10) || 1500) / 1000;
            const batchSize = parseInt(massMsg_ui.batchSizeInput.value, 10) || 0;
            let estimatedSeconds = remaining * delay;
            if (batchSize > 0) {
                const batchesLeft = Math.floor((total - 1) / batchSize) - Math.floor((current - 1) / batchSize);
                estimatedSeconds += batchesLeft * MASS_MSG_BATCH_PAUSE_SECONDS;
            }
            return `| ETA: ~${massMsg_formatTime(estimatedSeconds)}`;
        }

        function massMsg_applyFilters(elements) {
            massMsg_logToPanel("Applying filters...");
            const lang = massMsg_ui.langFilter.value;
            const friendsByLang = massMsg_filterByLanguage(elements, lang);
            massMsg_logToPanel(`Filtered by language '${lang}': ${friendsByLang.length} friends.`);
            const excludedUIDs = Array.from(massMsg_ui.exclusionList.querySelectorAll('input:checked')).map(cb => cb.dataset.uid);
            const friendsAfterExclusion = friendsByLang.filter(el => !excludedUIDs.includes(el.dataset.playeruid));
            massMsg_logToPanel(`After exclusion: ${friendsAfterExclusion.length} friends to send.`);
            const limit = parseInt(massMsg_ui.countLimit.value, 10);
            const finalFriendList = (limit > 0) ? friendsAfterExclusion.slice(0, limit) : friendsAfterExclusion;
            if (limit > 0) massMsg_logToPanel(`Limit applied: Sending to the first ${finalFriendList.length}.`);
            return finalFriendList;
        }

        function massMsg_dragElement(elmnt, dragHandle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            // Load saved position
            const savedTop = GM_getValue('massMsg_menuTop', '10px');
            const savedLeft = GM_getValue('massMsg_menuLeft', '380px'); // Adjusted initial position
            elmnt.style.top = savedTop;
            elmnt.style.left = savedLeft;

            dragHandle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.body.classList.add('mass-msg-dragging');
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.body.classList.remove('mass-msg-dragging');
                document.onmouseup = null;
                document.onmousemove = null;
                // Save current position
                GM_setValue('massMsg_menuTop', elmnt.style.top);
                GM_setValue('massMsg_menuLeft', elmnt.style.left);
            }
        }

        async function massMsg_startSending() {
            if (!massMsg_ui.messageInput.value.trim()) {
                alert('Message cannot be empty.');
                return;
            }
            massMsg_isSending = true;
            massMsg_ui.logPanel.innerHTML = '';
            massMsg_logToPanel('--- Starting script ---');
            massMsg_ui.startButton.style.display = 'none';
            massMsg_ui.stopButton.style.display = 'block';
            massMsg_ui.startButton.disabled = true;
            massMsg_ui.progressContainer.style.display = 'block';

            const allFriends = Array.from(document.querySelectorAll('#friends-tabfriendlist .content .tabrow'));
            if (allFriends.length === 0) {
                massMsg_logToPanel('Error: Friends list not found or empty. Please open your friends list in Drawaria.', 'error');
                massMsg_stopSending(false);
                return;
            }

            const finalFriendList = massMsg_applyFilters(allFriends);
            const totalToSend = finalFriendList.length;
            massMsg_updateProgress(0, totalToSend);

            const batchSize = parseInt(massMsg_ui.batchSizeInput.value, 10) || 0;

            for (let i = 0; i < totalToSend; i++) {
                if (!massMsg_isSending) {
                    massMsg_logToPanel('Sending stopped by user.', 'error');
                    break;
                }
                if (batchSize > 0 && i > 0 && i % batchSize === 0) {
                    massMsg_logToPanel(`Batch completed. Pausing for ${MASS_MSG_BATCH_PAUSE_SECONDS} seconds...`, 'pause');
                    for (let s = 0; s < MASS_MSG_BATCH_PAUSE_SECONDS; s++) {
                        if (!massMsg_isSending) break;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    if (!massMsg_isSending) {
                        massMsg_logToPanel('Sending stopped during pause.', 'error');
                        break;
                    }
                    massMsg_logToPanel(`Resuming sending...`, 'pause');
                }

                const friendElement = finalFriendList[i];
                const uid = friendElement.dataset.playeruid;
                const name = friendElement.querySelector('.playername')?.textContent || uid;
                const delay = parseInt(massMsg_ui.delayInput.value, 10) || 1500;
                const personalizedMessage = massMsg_ui.messageInput.value.replace(/{name}/g, name);

                massMsg_logToPanel(`(${i + 1}/${totalToSend}) Sending to: ${name}`, 'info');
                try {
                    await $.post("/friendsapi/sendmessage", { uid, message: personalizedMessage });
                    massMsg_logToPanel(`✔ Message sent to ${name}`, 'success');
                } catch (error) {
                    massMsg_logToPanel(`✖ Failed to send to ${name}.`, 'error');
                    console.error(`Error sending to ${name} (UID: ${uid})`, error);
                }
                massMsg_updateProgress(i + 1, totalToSend);

                if (massMsg_isSending && i < totalToSend - 1 && !(batchSize > 0 && (i + 1) % batchSize === 0)) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            massMsg_stopSending(true);
        }

        // --- 4. INITIALIZATION ---
        (function massMsg_init() {
            // Load saved state
            const isCollapsed = GM_getValue('massMsg_menuCollapsed', false);
            massMsg_setMenuCollapsed(isCollapsed);
            massMsg_ui.messageInput.value = GM_getValue('massMsg_savedMessage', 'Hello, {name}!');
            massMsg_ui.delayInput.value = GM_getValue('massMsg_savedDelay', 1500);
            massMsg_ui.langFilter.value = GM_getValue('massMsg_savedLang', 'all');
            massMsg_ui.countLimit.value = GM_getValue('massMsg_savedCount', '');
            massMsg_ui.batchSizeInput.value = GM_getValue('massMsg_savedBatchSize', '');
            massMsg_populateProfileDropdown();

            // Assign events
            massMsg_ui.toggleButton.addEventListener('click', () => {
                const currentlyCollapsed = massMsg_ui.container.classList.toggle('collapsed');
                massMsg_setMenuCollapsed(currentlyCollapsed);
            });

            document.querySelectorAll('#mass-msg-container .section-toggle').forEach(button => {
                button.addEventListener('click', () => {
                    const target = document.getElementById(button.dataset.target);
                    const isVisible = target.style.display === 'block';
                    target.style.display = isVisible ? 'none' : 'block';
                    button.textContent = button.textContent.includes('▼') ? button.textContent.replace('▼', '▲') : button.textContent.replace('▲', '▼');
                });
            });

            massMsg_ui.messageInput.addEventListener('input', () => GM_setValue('massMsg_savedMessage', massMsg_ui.messageInput.value));
            massMsg_ui.delayInput.addEventListener('input', () => GM_setValue('massMsg_savedDelay', massMsg_ui.delayInput.value));
            massMsg_ui.langFilter.addEventListener('change', () => GM_setValue('massMsg_savedLang', massMsg_ui.langFilter.value));
            massMsg_ui.countLimit.addEventListener('input', () => GM_setValue('massMsg_savedCount', massMsg_ui.countLimit.value));
            massMsg_ui.batchSizeInput.addEventListener('input', () => GM_setValue('massMsg_savedBatchSize', massMsg_ui.batchSizeInput.value));
            massMsg_ui.profileInfoButton.addEventListener('click', () => alert(massMsg_profileHelpText));

            massMsg_ui.saveProfileButton.addEventListener('click', () => {
                const name = massMsg_ui.profileNameInput.value.trim();
                if (!name) {
                    alert('Please enter a profile name.');
                    return;
                }
                const profiles = GM_getValue('massMsg_savedProfiles', {});
                profiles[name] = massMsg_saveCurrentSettings();
                GM_setValue('massMsg_savedProfiles', profiles);
                massMsg_ui.profileNameInput.value = '';
                massMsg_populateProfileDropdown();
                alert(`Profile '${name}' saved.`);
            });

            massMsg_ui.profileSelect.addEventListener('change', () => {
                const name = massMsg_ui.profileSelect.value;
                if (!name) return;
                const profiles = GM_getValue('massMsg_savedProfiles', {});
                if (profiles[name]) {
                    massMsg_loadSettings(profiles[name]);
                    massMsg_logToPanel(`Profile '${name}' loaded.`);
                }
            });

            massMsg_ui.deleteProfileButton.addEventListener('click', () => {
                const name = massMsg_ui.profileSelect.value;
                if (!name) {
                    alert('Select a profile to delete.');
                    return;
                }
                if (confirm(`Are you sure you want to delete profile '${name}'?`)) {
                    const profiles = GM_getValue('massMsg_savedProfiles', {});
                    delete profiles[name];
                    GM_setValue('massMsg_savedProfiles', profiles);
                    massMsg_populateProfileDropdown();
                    alert(`Profile '${name}' deleted.`);
                }
            });

            massMsg_ui.selectAllButton.addEventListener('click', () => massMsg_setAllCheckboxes(true));
            massMsg_ui.deselectAllButton.addEventListener('click', () => massMsg_setAllCheckboxes(false));
            massMsg_ui.invertButton.addEventListener('click', () => {
                massMsg_ui.exclusionList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = !cb.checked);
            });

            massMsg_ui.exclusionSearch.addEventListener('input', e => {
                const searchTerm = e.target.value.toLowerCase();
                massMsg_ui.exclusionList.querySelectorAll('.exclusion-item').forEach(item => {
                    item.style.display = item.dataset.name.includes(searchTerm) ? 'flex' : 'none';
                });
            });

            massMsg_ui.startButton.addEventListener('click', massMsg_startSending);
            massMsg_ui.stopButton.addEventListener('click', () => { massMsg_isSending = false; });

            // DOM observer for the friends list
            const observer = new MutationObserver(() => {
                if (document.querySelector('#friends-tabfriendlist .content .tabrow')) {
                    massMsg_populateExclusionList();
                }
            });
            const friendsWg = document.getElementById('friends-wg');
            if (friendsWg) {
                observer.observe(friendsWg, { childList: true, subtree: true });
            }

            // Initialize menu dragging
            massMsg_dragElement(massMsg_ui.container, massMsg_ui.header);
        })();
    })();
})();