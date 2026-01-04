// ==UserScript==
// @name         Drawaria Friend Chat Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  La herramienta definitiva para descargar conversaciones de chat en Drawaria.online. Incluye múltiples formatos (TXT, JSON, CSV), filtrado avanzado por fecha, copia al portapapeles, posición persistente del menú y opciones de personalización del mensaje. Mejora en parseo y depuración de fechas.
// @author       YouTubeDrawaria
// @match        *://*.drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/542959/Drawaria%20Friend%20Chat%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/542959/Drawaria%20Friend%20Chat%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. CONSTANTES Y CONFIGURACIÓN ---

    // Define los selectores CSS para los elementos clave de la interfaz de chat de Drawaria.
    // Si Drawaria cambia su HTML, solo necesitas actualizar estos selectores.
    const CHAT_SELECTORS = {
        CHAT_CONTAINER: 'div#friends-tabmessages-list',
        CHAT_HEADER: 'div#friends-tabmessages-header',
        MESSAGE_ELEMENT: '.message',
        SENDER_NAME: '.sender-name, .username', // Puede que no exista explícitamente, se infiere con .fromself
        MESSAGE_CONTENT: '.message-content, .message-text, .text-content, .msg-text',
        MESSAGE_TIMESTAMP: '.message-timestamp, .timestamp, .msg-time, small' // 'small' es una suposición basada en captura
    };

    const SCROLL_LOAD_MAX_ATTEMPTS = 30; // Máximo de intentos para scroll y cargar mensajes
    const SCROLL_LOAD_PAUSE_MS = 250;    // Pausa en ms después de cada scroll

    // --- 1. ESTILOS Y HTML DEL MENÚ ---
    GM_addStyle(`
        #chat-downloader-container {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 340px;
            background-color: #fff;
            border: 1px solid #d3d3d3;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #333;
        }
        #chat-downloader-header {
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
        #chat-downloader-toggle {
            padding: 4px 0;
            background-color: #f8f9fa;
            text-align: center;
            cursor: pointer;
            border-bottom: 1px solid #d3d3d3;
            user-select: none;
        }
        #chat-downloader-toggle:hover {
            background-color: #e2e6ea;
        }
        #chat-downloader-body {
            padding: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        #chat-downloader-container.collapsed #chat-downloader-body {
            display: none;
        }
        #chat-downloader-container.collapsed #chat-downloader-toggle {
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            border-bottom: none;
        }
        body.chat-downloader-dragging, body.chat-downloader-dragging * {
            cursor: move !important;
            user-select: none !important;
        }
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
        }
        .section-toggle {
            background: none;
            border: none;
            color: #007bff;
            cursor: pointer;
            padding: 8px 0;
            font-weight: bold;
            text-align: left;
            flex-grow: 1;
        }
        .collapsible-section {
            display: block; /* Default to open for chat download section */
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 5px;
        }
        #chat-downloader-body label {
            display: block;
            margin: 12px 0 5px 0;
            font-weight: 600;
            color: #333;
        }
        #chat-downloader-body select,
        #chat-downloader-body input[type="date"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            margin-bottom: 5px; /* Spacing for date inputs */
        }
        .input-group {
            display: flex;
            gap: 10px;
            width: 100%;
        }
        .input-group > div {
            flex: 1;
        }
        .input-group label {
            margin-top: 0;
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .button-group button {
            flex-grow: 1;
            padding: 10px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #download-chat-btn { background-color: #28a745; }
        #download-chat-btn:hover { background-color: #218838; }
        #copy-chat-btn { background-color: #007bff; }
        #copy-chat-btn:hover { background-color: #0056b3; }

        #download-chat-btn:disabled, #copy-chat-btn:disabled {
            background-color: #aaa;
            cursor: not-allowed;
        }
        #progress-indicator {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
            color: #007bff;
            display: none;
        }
        #chat-downloader-log {
            margin-top: 10px;
            padding: 8px;
            background-color: #fff;
            border: 1px solid #ddd;
            height: 100px;
            overflow-y: auto;
            font-size: 12px;
            border-radius: 4px;
            line-height: 1.5;
            position: relative;
        }
        #chat-downloader-log-clear {
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
        #chat-downloader-log-clear:hover {
            opacity: 1;
            background: #e0e0e0;
        }
        .log-info { color: #555; }
        .log-success { color: #28a745; font-weight: bold; }
        .log-error { color: #dc3545; font-weight: bold; }
    `);

    const menuHTML = `
        <div id="chat-downloader-container">
            <div id="chat-downloader-header">💬 Drawaria Friend Chat Downloader</div>
            <div id="chat-downloader-toggle">▼</div>
            <div id="chat-downloader-body">
                <div id="chat-download-section">
                    <p>Abre el chat con la persona deseada antes de usar esta función.</p>

                    <label for="export-format">Formato de Exportación:</label>
                    <select id="export-format">
                        <option value="txt">Texto Plano (.txt)</option>
                        <option value="json">JSON (.json)</option>
                        <option value="csv">CSV (.csv)</option>
                    </select>

                    <label for="timestamp-format">Formato de Fecha/Hora:</label>
                    <select id="timestamp-format">
                        <option value="full">Fecha y Hora Completa (ej. 7/12/25, 2:55:30 PM)</option>
                        <option value="time">Solo Hora (ej. 2:55:30 PM)</option>
                        <option value="date">Solo Fecha (ej. 7/12/25)</option>
                        <option value="iso">ISO 8601 (ej. 2025-07-12T14:55:30.000Z)</option>
                    </select>

                    <label for="message-detail-format">Detalle del Mensaje:</label>
                    <select id="message-detail-format">
                        <option value="full_detail">Fecha, Remitente y Mensaje (ej. [Fecha] Nombre: Mensaje)</option>
                        <option value="no_timestamp">Remitente y Mensaje (ej. Nombre: Mensaje)</option>
                        <option value="content_only">Solo Mensaje (ej. Mensaje)</option>
                    </select>

                    <label>Filtrar por Fecha:</label>
                    <div class="input-group">
                        <div>
                            <label for="start-date">Desde:</label>
                            <input type="date" id="start-date">
                        </div>
                        <div>
                            <label for="end-date">Hasta:</label>
                            <input type="date" id="end-date">
                        </div>
                    </div>

                    <div class="button-group">
                        <button id="download-chat-btn">Descargar</button>
                        <button id="copy-chat-btn">Copiar al Portapapeles</button>
                    </div>

                    <div id="progress-indicator">Cargando mensajes...</div>
                </div>
                <div id="chat-downloader-log">
                    <button id="chat-downloader-log-clear">Limpiar</button>
                    Esperando instrucciones...
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    // --- 2. DEFINICIÓN DE VARIABLES Y ELEMENTOS DE UI ---
    const ui = {
        container: document.getElementById('chat-downloader-container'),
        header: document.getElementById('chat-downloader-header'),
        toggleButton: document.getElementById('chat-downloader-toggle'),
        body: document.getElementById('chat-downloader-body'),
        logPanel: document.getElementById('chat-downloader-log'),
        logClearButton: document.getElementById('chat-downloader-log-clear'),
        downloadChatButton: document.getElementById('download-chat-btn'),
        copyChatButton: document.getElementById('copy-chat-btn'),
        exportFormatSelect: document.getElementById('export-format'),
        timestampFormatSelect: document.getElementById('timestamp-format'),
        messageDetailFormatSelect: document.getElementById('message-detail-format'),
        startDateInput: document.getElementById('start-date'),
        endDateInput: document.getElementById('end-date'),
        progressIndicator: document.getElementById('progress-indicator'),
    };

    // --- 3. FUNCIONES AUXILIARES ---

    /**
     * Escribe un mensaje en el panel de log del script.
     * @param {string} message El mensaje a loguear.
     * @param {string} type El tipo de mensaje (e.g., 'info', 'success', 'error').
     */
    function logToPanel(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        ui.logPanel.insertAdjacentHTML('beforeend', `<div class="log-${type}">[${timestamp}] ${message}</div>`);
        ui.logPanel.scrollTop = ui.logPanel.scrollHeight;
    }

    /**
     * Colapsa o expande el menú del script y guarda el estado.
     * @param {boolean} collapsed Si el menú debe estar colapsado.
     */
    function setMenuCollapsed(collapsed) {
        if (collapsed) {
            ui.container.classList.add('collapsed');
            ui.toggleButton.textContent = '▲';
        } else {
            ui.container.classList.remove('collapsed');
            ui.toggleButton.textContent = '▼';
        }
        GM_setValue('chatDownloaderMenuCollapsed', collapsed);
    }

    /**
     * Habilita/deshabilita los botones de acción y muestra/oculta el indicador de progreso.
     * @param {boolean} disabled Si los botones deben estar deshabilitados.
     */
    function toggleButtonsAndProgress(disabled) {
        ui.downloadChatButton.disabled = disabled;
        ui.copyChatButton.disabled = disabled;
        ui.progressIndicator.style.display = disabled ? 'block' : 'none';
    }

    /**
     * Permite arrastrar un elemento por un handle. Guarda la posición.
     * @param {HTMLElement} elmnt El elemento que se puede arrastrar.
     * @param {HTMLElement} dragHandle El elemento que actúa como handle de arrastre.
     */
    function dragElement(elmnt, dragHandle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // Cargar posición guardada
        const savedTop = GM_getValue('chatDownloaderMenuTop', '10px');
        const savedLeft = GM_getValue('chatDownloaderMenuLeft', '10px');
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
            // Guardar posición actual
            GM_setValue('chatDownloaderMenuTop', elmnt.style.top);
            GM_setValue('chatDownloaderMenuLeft', elmnt.style.left);
        }
    }

    /**
     * Intenta extraer la parte de fecha/hora limpia de una cadena que pueda contener otros textos.
     * Esto es crucial si el selector `MESSAGE_TIMESTAMP` a veces capta más que solo la fecha.
     * @param {string} fullText La cadena de texto completa del elemento timestamp.
     * @returns {string} La parte de la cadena que probablemente es la fecha/hora o la cadena original.
     */
    function extractCleanTimestampPart(fullText) {
        // Regex para encontrar "M/D/YY, H:MM AM/PM" o "M/D/YYYY, H:MM:SS AM/PM"
        // Hago el patrón para segundos opcional `(?::\d{2})?`
        const match = fullText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?::\d{2})? (?:AM|PM))/i);
        if (match && match[1]) {
            return match[1];
        }
        // Si no coincide con el formato completo, devuelve la cadena original para que parseTimestampToDate
        // intente con sus otros métodos (ISO, Date constructor).
        return fullText;
    }


    /**
     * Parsea una cadena de timestamp o un número (epoch) en un objeto Date.
     * @param {string|number} rawTimestamp La cadena de timestamp o el número epoch.
     * @returns {Date|null} Un objeto Date o null si no se puede parsear.
     */
    function parseTimestampToDate(rawTimestamp) {
        console.log(`[DEBUG] parseTimestampToDate - Raw input: "${rawTimestamp}" (Type: ${typeof rawTimestamp})`);

        if (rawTimestamp instanceof Date) {
            return rawTimestamp;
        }
        if (typeof rawTimestamp === 'number') { // Asume epoch en milisegundos
            const date = new Date(rawTimestamp);
            console.log(`[DEBUG] parseTimestampToDate - Parsed from number: ${date.toISOString()}`);
            return date;
        }
        if (typeof rawTimestamp === 'string') {
            const cleanedTimestamp = extractCleanTimestampPart(rawTimestamp);
            console.log(`[DEBUG] parseTimestampToDate - Cleaned string: "${cleanedTimestamp}"`);

            // Intenta formato ISO (si extractCleanTimestampPart no lo alteró o era ISO)
            let dateObj = new Date(cleanedTimestamp);
            if (!isNaN(dateObj.getTime())) {
                console.log(`[DEBUG] parseTimestampToDate - Parsed as ISO/Standard: ${dateObj.toISOString()}`);
                return dateObj;
            }

            // Intenta "M/D/YY, H:MM(:SS)? AM/PM"
            // Ahora el regex es más flexible para segundos opcionales
            const parts = cleanedTimestamp.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4}), (\d{1,2}):(\d{2})(?::(\d{2}))? (AM|PM)/i);
            if (parts) {
                let [_, month, day, year, hour, minute, second, ampm] = parts;
                let fullYear = parseInt(year, 10);
                if (fullYear < 100) {
                    fullYear += (fullYear > (new Date().getFullYear() % 100) + 1 ? 1900 : 2000);
                }
                let h = parseInt(hour, 10);
                if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
                if (ampm.toUpperCase() === 'AM' && h === 12) h = 0; // Medianoche (12 AM es 0 horas)
                const s = second ? parseInt(second, 10) : 0; // Segundos opcionales

                dateObj = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10), h, parseInt(minute, 10), s, 0);
                if (!isNaN(dateObj.getTime())) {
                    console.log(`[DEBUG] parseTimestampToDate - Parsed with regex: ${dateObj.toISOString()}`);
                    return dateObj;
                }
            }

            // Fallback: intenta con Date.parse() para formatos que JS pueda reconocer directamente
            dateObj = new Date(Date.parse(cleanedTimestamp));
            if (!isNaN(dateObj.getTime())) {
                console.log(`[DEBUG] parseTimestampToDate - Parsed with Date.parse() fallback: ${dateObj.toISOString()}`);
                return dateObj;
            }

            // Si todo falla, loguear el problema para depuración
            console.error(`[ERROR] parseTimestampToDate - Falla final al parsear: "${rawTimestamp}" (limpiado: "${cleanedTimestamp}"). No es un formato de fecha reconocido.`);
        }
        return null; // No se pudo parsear
    }

    /**
 * Formatea un objeto Date según el formato seleccionado por el usuario.
 * Si dateObj es inválido, usa la hora actual del sistema.
 * @param {Date} dateObj El objeto Date a formatear.
 * @param {string} format 'full', 'time', 'date', 'iso'.
 * @returns {string} El timestamp formateado.
 */
function formatTimestamp(dateObj, format) {
    let dateToFormat = dateObj;

    // Si dateObj es inválido, usa la fecha y hora actual
    if (!dateObj || isNaN(dateObj.getTime())) {
        dateToFormat = new Date(); // <--- AQUÍ ESTÁ EL CAMBIO CLAVE
        console.warn(`${dateToFormat.toISOString()}`);
    }

    if (format === 'iso') {
        return dateToFormat.toISOString();
    }

    let options = {};
    const locale = 'es-ES'; // O usa undefined para la configuración regional del navegador del usuario

    switch (format) {
        case 'full':
            options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Para AM/PM
            };
            break;
        case 'time':
            options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true // Para AM/PM
            };
            break;
        case 'date':
            options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            break;
        default:
            // Fallback si el formato no es reconocido, usa el formato completo por defecto
            options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            console.warn(`[formatTimestamp] Formato desconocido "${format}". Usando formato completo por defecto.`);
            break;
    }

    try {
        return dateToFormat.toLocaleString(locale, options);
    } catch (e) {
        console.error("Error al formatear fecha con toLocaleString:", e);
        // Fallback robusto, quizás a ISO o a toString si toLocaleString falla completamente.
        return dateToFormat.toISOString();
    }
}

    /**
     * Extrae de forma robusta el nombre del amigo del encabezado del chat.
     * @returns {string} El nombre del amigo o 'UnknownFriend' si no se encuentra.
     */
    function getFriendName() {
        const headerElement = document.querySelector(CHAT_SELECTORS.CHAT_HEADER);
        if (!headerElement) {
            return 'UnknownFriend';
        }

        // Intento 1: Buscar elementos específicos para el nombre de usuario
        const nameEl = headerElement.querySelector('.username, .playername');
        if (nameEl && nameEl.textContent.trim()) {
            return nameEl.textContent.trim();
        }

        // Intento 2: Extraer texto del encabezado, evitando "Messages"
        const messagesTitle = headerElement.textContent.trim();
        if (messagesTitle.includes('Messages')) {
            const parts = messagesTitle.split(' ').filter(part => part.toLowerCase() !== 'messages' && part.trim() !== '');
            if (parts.length > 0) {
                return parts.join(' ');
            }
        }

        // Intento 3: Extraer cualquier nodo de texto significativo
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
     * Desplaza el contenedor del chat hacia arriba para cargar todo el historial.
     * @param {HTMLElement} chatContainer El elemento del chat con scroll.
     */
    async function scrollToLoadAllMessages(chatContainer) {
        logToPanel('Intentando cargar todo el historial de chat...', 'info');
        toggleButtonsAndProgress(true); // Deshabilita botones y muestra progreso

        let previousScrollHeight = 0;
        let attempts = 0;

        while (attempts < SCROLL_LOAD_MAX_ATTEMPTS) {
            chatContainer.scrollTop = 0; // Desplazarse a la parte superior
            await new Promise(resolve => setTimeout(resolve, SCROLL_LOAD_PAUSE_MS)); // Esperar a que cargue

            const currentScrollHeight = chatContainer.scrollHeight;

            if (currentScrollHeight === previousScrollHeight) {
                logToPanel(`Historial cargado. ${attempts + 1} intentos de scroll.`, 'info');
                break; // El scrollHeight ya no cambia, asumimos que todo está cargado
            } else {
                previousScrollHeight = currentScrollHeight;
                attempts++;
                logToPanel(`Cargando... Altura de scroll: ${currentScrollHeight}px`, 'info');
            }
        }

        if (attempts >= SCROLL_LOAD_MAX_ATTEMPTS) {
            logToPanel('Advertencia: El historial de chat podría no estar completamente cargado (límite de intentos alcanzado).', 'error');
        }
        // Los botones se re-habilitan en el 'finally' de handleChatExport
    }

    /**
     * Recolecta y procesa todos los mensajes de chat, aplicando filtros de fecha.
     * @returns {Array<Object>} Un array de objetos de mensaje.
     */
    async function getFilteredChatMessages() {
        const chatContainer = document.querySelector(CHAT_SELECTORS.CHAT_CONTAINER);
        if (!chatContainer) {
            logToPanel('Error: No se encontró la ventana de chat activa. Asegúrate de tener una conversación abierta.', 'error');
            return [];
        }

        await scrollToLoadAllMessages(chatContainer);

        const messagesElements = chatContainer.querySelectorAll(CHAT_SELECTORS.MESSAGE_ELEMENT);
        if (messagesElements.length === 0) {
            logToPanel('No se encontraron mensajes en la conversación. Asegúrate de tener un historial de chat visible.', 'error');
            return [];
        }

        const friendName = getFriendName();

        const startDateStr = ui.startDateInput.value;
        const endDateStr = ui.endDateInput.value;

        let filterStartDate = null;
        let filterEndDate = null;

        if (startDateStr) {
            filterStartDate = new Date(startDateStr);
            filterStartDate.setHours(0, 0, 0, 0); // Inicio del día
            if (isNaN(filterStartDate.getTime())) {
                logToPanel('Advertencia: Fecha de inicio inválida. Ignorando filtro de inicio.', 'error');
                filterStartDate = null;
            }
        }
        if (endDateStr) {
            filterEndDate = new Date(endDateStr);
            filterEndDate.setHours(23, 59, 59, 999); // Fin del día
            if (isNaN(filterEndDate.getTime())) {
                logToPanel('Advertencia: Fecha de fin inválida. Ignorando filtro de fin.', 'error');
                filterEndDate = null;
            }
        }

        const collectedMessages = [];

        messagesElements.forEach(msgEl => {
            let sender = 'Desconocido';
            let content = '';
            let rawTimestamp = '';

            // 1. Extraer Timestamp
            const timestampEl = msgEl.querySelector(CHAT_SELECTORS.MESSAGE_TIMESTAMP);
            if (timestampEl) {
                rawTimestamp = timestampEl.textContent.trim();
            } else {
                // Fallback: buscar atributos de fecha/hora si no hay elemento explícito
                const dateMeta = msgEl.querySelector('[data-timestamp], [title]');
                if (dateMeta && dateMeta.dataset.timestamp) {
                    rawTimestamp = parseInt(dateMeta.dataset.timestamp, 10);
                } else if (dateMeta && dateMeta.title) {
                    // Si hay un título, intentar extraer fecha de ahí, ya que a veces contiene la fecha completa
                    const titleMatch = dateMeta.title.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?::\d{2})? (?:AM|PM))/i);
                    if (titleMatch && titleMatch[1]) {
                        rawTimestamp = titleMatch[1];
                    } else {
                        rawTimestamp = dateMeta.title; // Usar el título completo si no se encuentra un patrón específico
                    }
                }
            }
            const messageDate = parseTimestampToDate(rawTimestamp);

            // Aplicar filtros de fecha
            if (messageDate) {
                if (filterStartDate && messageDate < filterStartDate) {
                    return; // Saltar mensaje anterior a la fecha de inicio
                }
                if (filterEndDate && messageDate > filterEndDate) {
                    return; // Saltar mensaje posterior a la fecha de fin
                }
            } else {
                 // Solo loguear advertencia si hay filtros de fecha activos y la fecha no se pudo parsear
                 if (filterStartDate || filterEndDate) {
                    logToPanel(`Advertencia: Mensaje omitido porque no se pudo parsear la fecha/hora para el filtro: "${rawTimestamp}".`, 'info');
                    return; // Omitir el mensaje si no tiene fecha válida y hay filtros activos
                 }
                 // Si no se pudo parsear la fecha y no hay filtros, el mensaje se incluirá sin una fecha válida.
                 // formatTimestamp lo marcará como "Fecha inválida".
            }


            // 2. Determinar Remitente
            const senderEl = msgEl.querySelector(CHAT_SELECTORS.SENDER_NAME);
            if (senderEl && senderEl.textContent.trim()) {
                sender = senderEl.textContent.trim();
            } else if (msgEl.classList.contains('fromself')) {
                sender = 'Yo'; // Mensaje propio
            } else {
                sender = friendName; // Mensaje del amigo
            }

            // 3. Extraer Contenido del Mensaje
            const contentEl = msgEl.querySelector(CHAT_SELECTORS.MESSAGE_CONTENT);
            if (contentEl && contentEl.textContent.trim()) {
                content = contentEl.textContent.trim();
            } else {
                // Fallback: extraer texto directamente de los nodos hijos del mensaje, excluyendo el timestamp
                content = Array.from(msgEl.childNodes)
                            .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
                            .map(node => node.textContent.trim())
                            .join(' ');
                if (!content && msgEl.children.length > 0) {
                    // Si el texto directo es vacío, intentar desde un hijo que no sea el timestamp
                    const relevantChild = Array.from(msgEl.children)
                                                .find(child => !child.matches(CHAT_SELECTORS.MESSAGE_TIMESTAMP) && child.textContent.trim().length > 0);
                    if (relevantChild) {
                        content = relevantChild.textContent.trim();
                    }
                }
            }

            collectedMessages.push({
                date: messageDate, // El objeto Date real para ordenación/filtrado
                sender: sender,
                content: content
            });
        });

        logToPanel(`Se recolectaron ${collectedMessages.length} mensajes después de aplicar filtros.`, 'success');
        return collectedMessages;
    }

    /**
     * Genera el contenido del chat en formato de texto plano.
     * @param {Array<Object>} messages Los mensajes a exportar.
     * @param {string} friendName Nombre del amigo.
     * @param {string} timestampFormat Formato de fecha/hora.
     * @param {string} messageDetailFormat Formato de detalle del mensaje.
     * @returns {string} El contenido del archivo de texto.
     */
    function exportChatAsText(messages, friendName, timestampFormat, messageDetailFormat) {
        let chatText = `--- Conversación con ${friendName} ---\n\n`;
        messages.forEach(msg => {
            let line = '';
            const formattedTimestamp = formatTimestamp(msg.date, timestampFormat);

            if (messageDetailFormat === 'content_only') {
                line = `${msg.content}\n`;
            } else if (messageDetailFormat === 'no_timestamp') {
                line = `${msg.sender}: ${msg.content}\n`;
            } else { // full_detail
                line = `[${formattedTimestamp}] ${msg.sender}: ${msg.content}\n`;
            }
            chatText += line;
        });
        return chatText;
    }

    /**
     * Genera el contenido del chat en formato JSON.
     * @param {Array<Object>} messages Los mensajes a exportar.
     * @param {string} friendName Nombre del amigo.
     * @param {string} timestampFormat Formato de fecha/hora.
     * @param {string} messageDetailFormat Formato de detalle del mensaje.
     * @returns {string} El contenido JSON.
     */
    function exportChatAsJson(messages, friendName, timestampFormat, messageDetailFormat) {
        const data = {
            friend: friendName,
            exportedAt: new Date().toISOString(),
            messages: messages.map(msg => {
                const messageObject = {};

                if (messageDetailFormat === 'full_detail') {
                    // For JSON, force ISO or full string representation if not 'content_only'
                    messageObject.timestamp = formatTimestamp(msg.date, timestampFormat === 'iso' ? 'iso' : 'full');
                    messageObject.sender = msg.sender;
                } else if (messageDetailFormat === 'no_timestamp') {
                    messageObject.sender = msg.sender;
                }
                messageObject.content = msg.content;
                return messageObject;
            })
        };
        return JSON.stringify(data, null, 2); // Pretty print JSON
    }

    /**
     * Genera el contenido del chat en formato CSV.
     * @param {Array<Object>} messages Los mensajes a exportar.
     * @param {string} friendName Nombre del amigo.
     * @param {string} timestampFormat Formato de fecha/hora.
     * @param {string} messageDetailFormat Formato de detalle del mensaje.
     * @returns {string} El contenido CSV.
     */
    function exportChatAsCsv(messages, friendName, timestampFormat, messageDetailFormat) {
        const headers = [];
        if (messageDetailFormat === 'full_detail') {
            headers.push("Timestamp", "Sender", "Content");
        } else if (messageDetailFormat === 'no_timestamp') {
            headers.push("Sender", "Content");
        } else { // content_only
            headers.push("Content");
        }

        let csv = headers.join(",") + "\n";

        messages.forEach(msg => {
            const row = [];
            // Función para escapar comas y comillas en CSV
            const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;

            if (messageDetailFormat === 'full_detail') {
                const formattedTimestamp = formatTimestamp(msg.date, timestampFormat === 'iso' ? 'iso' : 'full');
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
     * Crea un enlace de descarga y lo "clica" para iniciar la descarga del archivo.
     * @param {string} filename Nombre del archivo.
     * @param {string} content Contenido del archivo.
     * @param {string} mimeType Tipo MIME del archivo.
     * @returns {boolean} True si la descarga se inició correctamente, false en caso contrario.
     */
    function createDownloadFile(filename, content, mimeType) {
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
            logToPanel(`Error al iniciar la descarga: ${error.message}. Verifique la consola para más detalles.`, 'error');
            console.error('Error during download link creation/click:', error);
            return false;
        }
    }


    /**
     * Función principal que orquesta la recolección, procesamiento y exportación/copia del chat.
     * @param {string} action 'download' para descargar, 'copy' para copiar al portapapeles.
     */
    async function handleChatExport(action) {
        logToPanel('Iniciando exportación de chat...', 'info');
        toggleButtonsAndProgress(true); // Deshabilita botones al inicio del proceso

        try {
            const messages = await getFilteredChatMessages();
            if (messages.length === 0) {
                logToPanel('No hay mensajes para exportar después de aplicar filtros.', 'error');
                return;
            }

            const friendName = getFriendName();
            const exportFormat = ui.exportFormatSelect.value;
            const timestampFormat = ui.timestampFormatSelect.value;
            const messageDetailFormat = ui.messageDetailFormatSelect.value;

            let fileContent = '';
            let fileExtension = '';
            let mimeType = '';

            switch (exportFormat) {
                case 'txt':
                    fileContent = exportChatAsText(messages, friendName, timestampFormat, messageDetailFormat);
                    fileExtension = 'txt';
                    mimeType = 'text/plain;charset=utf-8';
                    break;
                case 'json':
                    fileContent = exportChatAsJson(messages, friendName, timestampFormat, messageDetailFormat);
                    fileExtension = 'json';
                    mimeType = 'application/json;charset=utf-8';
                    break;
                case 'csv':
                    fileContent = exportChatAsCsv(messages, friendName, timestampFormat, messageDetailFormat);
                    fileExtension = 'csv';
                    mimeType = 'text/csv;charset=utf-8';
                    break;
                default:
                    logToPanel('Error: Formato de exportación no reconocido.', 'error');
                    return;
            }

            if (action === 'download') {
                const filename = `Drawaria_Chat_${friendName.replace(/[^a-zA-Z0-9_.-]/g, '')}_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
                if (createDownloadFile(filename, fileContent, mimeType)) {
                    logToPanel(`Conversación con ${friendName} descargada como "${filename}".`, 'success');
                }
            } else if (action === 'copy') {
                try {
                    GM_setClipboard(fileContent, mimeType);
                    logToPanel(`Contenido del chat (${exportFormat.toUpperCase()}) copiado al portapapeles.`, 'success');
                } catch (clipboardError) {
                    logToPanel(`Error al copiar al portapapeles: ${clipboardError.message}. Asegúrate de que Tampermonkey tenga permiso para acceder al portapapeles (grant GM_setClipboard).`, 'error');
                    console.error('Error copying to clipboard:', clipboardError);
                }
            }

        } catch (error) {
            logToPanel(`Error general al exportar chat: ${error.message}.`, 'error');
            console.error('Error exporting chat:', error);
        } finally {
            toggleButtonsAndProgress(false); // Siempre habilita los botones al finalizar
        }
    }


    // --- 4. INICIALIZACIÓN DEL SCRIPT ---
    (function init() {
        // Cargar estado guardado del menú (colapsado/expandido)
        const isCollapsed = GM_getValue('chatDownloaderMenuCollapsed', false);
        setMenuCollapsed(isCollapsed);

        // Cargar preferencias guardadas
        ui.exportFormatSelect.value = GM_getValue('chatDownloaderExportFormat', 'txt');
        ui.timestampFormatSelect.value = GM_getValue('chatDownloaderTimestampFormat', 'full');
        ui.messageDetailFormatSelect.value = GM_getValue('chatDownloaderMessageDetailFormat', 'full_detail');
        ui.startDateInput.value = GM_getValue('chatDownloaderStartDate', '');
        ui.endDateInput.value = GM_getValue('chatDownloaderEndDate', '');

        // Asignar eventos a los elementos de la UI
        ui.toggleButton.addEventListener('click', () => {
            setMenuCollapsed(ui.container.classList.toggle('collapsed'));
        });

        ui.downloadChatButton.addEventListener('click', () => handleChatExport('download'));
        ui.copyChatButton.addEventListener('click', () => handleChatExport('copy'));

        // Re-attach event listener for clear button as innerHTML replaces it
        ui.logClearButton.addEventListener('click', () => {
            // Eliminar solo los divs de mensajes de log, dejando el botón de limpiar
            Array.from(ui.logPanel.children).forEach(child => {
                if (child.tagName === 'DIV') {
                    ui.logPanel.removeChild(child);
                }
            });
            logToPanel('Log limpiado.');
        });


        // Guardar preferencias al cambiar
        ui.exportFormatSelect.addEventListener('change', (e) => {
            GM_setValue('chatDownloaderExportFormat', e.target.value);
            logToPanel(`Formato de exportación cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });

        ui.timestampFormatSelect.addEventListener('change', (e) => {
            GM_setValue('chatDownloaderTimestampFormat', e.target.value);
            logToPanel(`Formato de fecha/hora cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });

        ui.messageDetailFormatSelect.addEventListener('change', (e) => {
            GM_setValue('chatDownloaderMessageDetailFormat', e.target.value);
            logToPanel(`Detalle de mensaje cambiado a: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });

        ui.startDateInput.addEventListener('change', (e) => GM_setValue('chatDownloaderStartDate', e.target.value));
        ui.endDateInput.addEventListener('change', (e) => GM_setValue('chatDownloaderEndDate', e.target.value));

        // Inicializar la funcionalidad de arrastre del menú
        dragElement(ui.container, ui.header);
    })();
})();