// ==UserScript==
// @name         MyDealz Konversationen löschen
// @namespace    https://www.mydealz.de/
// @version      1.4
// @description  Automatisches Löschen von MyDealz Konversationen mit bestimmtem Inhalt + 429 Retry-Logic
// @author       MD928835
// @match        https://www.mydealz.de/profile/messages*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537022/MyDealz%20Konversationen%20l%C3%B6schen.user.js
// @updateURL https://update.greasyfork.org/scripts/537022/MyDealz%20Konversationen%20l%C3%B6schen.meta.js
// ==/UserScript==

(async function () {
    let SEARCH_TEXT = "Täglich Geld & Gutscheine verdienen";
    const startTime = new Date();
    const BATCH_SIZE = 20;
    let MAX_PARALLEL = 8;
    const LOG_BATCH_SIZE = 100;
    const CHECKPOINT_INTERVAL = 5000;
    const RATE_LIMIT_WAIT = 5000;

    // Batch-Timing-Variablen
    let lastBatchStartTime = null;
    let totalKeepCount = 0;

    // Zentrale Retry-Funktion für alle HTTP-Requests
    async function fetchWithRetry(url, options = {}, maxRetries = 5) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.status === 429) {
                    addToLogBuffer(`429 Rate Limit bei ${url} - Warte ${RATE_LIMIT_WAIT/1000}s (Versuch ${i+1}/${maxRetries})`);
                    if (i === maxRetries - 1) {
                        throw new Error(`Server überlastet nach ${maxRetries} Versuchen`);
                    }
                    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WAIT));
                    continue;
                }
                return response;
            } catch (error) {
                if (i === maxRetries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return null;
    }

    // Erstelle Dateiname mit Startzeitpunkt
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    };

    const logFileName = `250k_analyse_${formatDateTime(startTime)}.txt`;
    let logContent = `Mydealz Nachrichten-Analyse gestartet: ${startTime.toLocaleString()}\n`;
    logContent += `Suchtext: "${SEARCH_TEXT}"\n`;
    logContent += `Parallelität: ${MAX_PARALLEL}\n`;
    logContent += `Hybrid-Logging: Batch-Size ${LOG_BATCH_SIZE}, Checkpoints alle ${CHECKPOINT_INTERVAL}\n\n`;

    // Batch-Logging System
    let logBuffer = [];
    let totalProcessed = 0;
    let deleteMode = false;
    let processedIds = new Set(); // Tracking verarbeiteter IDs

    const style = document.createElement('style');
    style.textContent = `
        #export-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width:600px;
            max-width: 1600px;
            width: 900px;
            max-height: 80vh;
            overflow-y: auto;
            color: #333;
        }
        #export-popup h2 {
            margin-top: 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        #export-popup .buttons {
            margin-top: 15px;
            text-align: right;
        }
        #export-popup button {
            padding: 8px 15px;
            margin-left: 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        #export-popup .status {
            margin-top: 10px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        #export-popup .progress {
            margin-top: 10px;
            height: 20px;
            background-color: #eee;
            border-radius: 4px;
            overflow: hidden;
        }
        #export-popup .progress-bar {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
        #export-popup .log {
            margin-top: 10px;
            max-height: 400px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            background-color: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
            word-break: break-all;
        }
    `;
    document.head.appendChild(style);

    // Batch-Logging Funktionen
    function addToLogBuffer(message) {
        logBuffer.push(message);
        if (logBuffer.length >= LOG_BATCH_SIZE) {
            flushLogBuffer();
        }
    }

    function flushLogBuffer() {
        if (logBuffer.length > 0) {
            logContent += logBuffer.join('\n') + '\n';
            logBuffer = [];
        }
    }

    function downloadLogFile(filename = logFileName) {
        flushLogBuffer();
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function checkAutoBackup(logDiv) {
        if (totalProcessed > 0 && totalProcessed % CHECKPOINT_INTERVAL === 0) {
            const checkpointName = `${logFileName.replace('.txt', '')}_checkpoint_${totalProcessed}.txt`;
            downloadLogFile(checkpointName);
            logDiv.textContent += `Checkpoint bei ${totalProcessed} Nachrichten gespeichert\n`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }

    // XSRF Token aus Cookies extrahieren
    function getXSRFToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'xsrf_t') {
                return value.replace(/"/g, '');
            }
        }
        return null;
    }

    async function waitForContacts(maxWaitMs = 10000) {
        let waited = 0;
        while (document.querySelectorAll('.conversationList > li').length === 0 && waited < maxWaitMs) {
            await new Promise(r => setTimeout(r, 300));
            waited += 300;
        }
    }

    function hasMoreConversationsAvailable() {
        const allButtons = document.querySelectorAll('button[data-handler="replace"]');
        for (const button of allButtons) {
            if (button.textContent.includes('Weitere Nachrichten laden') ||
                button.textContent.includes('Weitere') ||
                button.textContent.includes('laden')) {
                return !button.disabled && button.offsetParent !== null;
            }
        }
        return false;
    }

    // Erweiterte loadNextBatch-Funktion mit Batch-Timing
    async function loadNextBatch(logDiv) {

                    const waitTime = 2500 // Verzögerung


        await new Promise(resolve => setTimeout(resolve, waitTime));

        const allButtons = document.querySelectorAll('button[data-handler="replace"]');
        let loadMoreButton = null;

        for (const button of allButtons) {
            if (button.textContent.includes('Weitere Nachrichten laden') ||
                button.textContent.includes('Weitere') ||
                button.textContent.includes('laden')) {
                loadMoreButton = button;
                break;
            }
        }

        if (loadMoreButton && !loadMoreButton.disabled && loadMoreButton.offsetParent !== null) {
            const currentCount = getValidConversations().length;
            const currentIds = getValidConversations().map(item => item.id);

            // Batch-Timing starten
            const batchStartTime = Date.now();

            try {
                loadMoreButton.click();

                // Erweiterte Wartezeit mit DOM-Debugging
                for (let i = 0; i < 15; i++) {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // DOM komplett neu abfragen
                    const newItems = document.querySelectorAll('.conversationList > li[id^="conversation-"]');
                    const newCount = newItems.length;
                    const newIds = Array.from(newItems).map(item => item.id);
                    const uniqueNewIds = newIds.filter(id => !currentIds.includes(id));

                    if (newCount > currentCount && uniqueNewIds.length > 0) {
                        // Batch-Timing berechnen
                        const batchEndTime = Date.now();
                        const batchDuration = (batchEndTime - batchStartTime) / 1000;

                        logDiv.textContent += `Batch ${batchDuration.toFixed(1)} Sekunden: ${newCount} Konversationen (${totalKeepCount} zu behalten)\n`;
                        logDiv.scrollTop = logDiv.scrollHeight;

                        // Für nächsten Batch speichern
                        lastBatchStartTime = batchStartTime;

                        return true;
                    }
                }

                logDiv.textContent += `Timeout: Keine neuen DOM-Elemente nach 7.5s\n`;
                return false;

            } catch (error) {
                logDiv.textContent += `ERROR: ${error.message}\n`;
                return false;
            }
        }
        return false;
    }

    // Korrigierte getValidConversations-Funktion mit Duplikat-Vermeidung
    function getValidConversations() {
        // DOM neu abfragen um aktuelle Elemente zu erfassen
        const allItems = document.querySelectorAll('.conversationList > li');
        const validConversations = [];
        const seenIds = new Set();

        for (const item of allItems) {
            if (item.classList.contains('moreMessages') ||
                item.classList.contains('moreConversations') ||
                !item.hasAttribute('data-replace') ||
                !item.id ||
                !item.id.startsWith('conversation-')) {
                continue;
            }

            // Duplikate vermeiden
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                validConversations.push(item);
            }
        }

        return validConversations;
    }

    // Optimierte DOM-Analyse ohne API-Calls
    async function analyzeConversation(item, conversationIndex) {
        const conversationId = item.id || `conversation-${conversationIndex}`;
        const usernameElement = item.querySelector('.conversationList-senderLine');
        const username = usernameElement ? usernameElement.textContent.trim() : 'unbekannt';

        try {
            const msgPreviewElement = item.querySelector('.conversationList-msgPreview');
            if (!msgPreviewElement) {
                throw new Error('Kein msgPreview-Element gefunden');
            }

            // HTML-Entities und Unicode-Escapes dekodieren
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = msgPreviewElement.innerHTML;
            let messageContent = tempDiv.textContent.trim();

            // Unicode-Normalisierung
            messageContent = messageContent.normalize('NFC');
            const normalizedSearchText = SEARCH_TEXT.normalize('NFC');

            // Prüfung auf Suchtext
            const shouldDelete = messageContent.includes(normalizedSearchText);

            return {
                item,
                username,
                conversationId,
                messageCount: 1,
                shouldDelete,
                success: true
            };

        } catch (error) {
            return {
                item,
                username,
                conversationId,
                messageCount: 0,
                shouldDelete: false,
                success: false,
                error: error.message
            };
        }
    }

    // Direkte API-Löschung mit fetchWithRetry
    async function deleteConversationDirect(conversationId) {
        try {
            const xsrfToken = getXSRFToken();
            if (!xsrfToken) {
                throw new Error('XSRF Token nicht gefunden');
            }

            const response = await fetchWithRetry(`https://www.mydealz.de/conversation/delete/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'de-DE,en;q=0.5',
                    'X-XSRF-TOKEN': xsrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': 'https://www.mydealz.de',
                    'Referer': window.location.href
                }
            });

            return response && response.ok;

        } catch (error) {
            addToLogBuffer(`Löschfehler bei ${conversationId}: ${error.message}`);
            return false;
        }
    }

    // Batch-Verarbeitung mit Duplikat-Vermeidung
    async function processBatchUltraFast(batch, maxParallel, logDiv) {
        // Filtere bereits verarbeitete Konversationen
        const unprocessedBatch = batch.filter(item => !processedIds.has(item.id));

        if (unprocessedBatch.length === 0) {
            return { results: [], deletedCount: 0 };
        }

        const results = [];

        // Phase 1: Parallelisierte DOM-Analyse
        for (let i = 0; i < unprocessedBatch.length; i += maxParallel) {
            const chunk = unprocessedBatch.slice(i, i + maxParallel);
            const chunkPromises = chunk.map((item, index) =>
                analyzeConversation(item, i + index + 1)
            );

            const chunkResults = await Promise.all(chunkPromises);
            results.push(...chunkResults);

            // Markiere als verarbeitet
            chunk.forEach(item => processedIds.add(item.id));

            if (i + maxParallel < unprocessedBatch.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        // Phase 2: Parallelisierte API-Löschung (nur wenn deleteMode aktiv)
        const toDelete = results.filter(r => r.shouldDelete);
        const toKeep = results.filter(r => r.success && !r.shouldDelete);
        let deletedCount = 0;

        // KEEP-Counter aktualisieren
        totalKeepCount += toKeep.length;

        if (deleteMode && toDelete.length > 0) {
            const deleteParallel = Math.min(5, toDelete.length);

            for (let i = 0; i < toDelete.length; i += deleteParallel) {
                if (!continueLoading) break;

                const deleteChunk = toDelete.slice(i, i + deleteParallel);
                const deletePromises = deleteChunk.map(result => {
                    const conversationId = result.conversationId.replace('conversation-', '');
                    return deleteConversationDirect(conversationId);
                });

                const deleteResults = await Promise.all(deletePromises);
                deletedCount += deleteResults.filter(success => success).length;

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Schreibe nur KEEP-Ergebnisse in den Log-Buffer
        const timestamp = new Date().toLocaleTimeString();
        for (const result of results) {
            if (result.success && !result.shouldDelete) {
                addToLogBuffer(`[${timestamp}] KEEP ${result.username} ${result.conversationId}`);
            } else if (!result.success) {
                addToLogBuffer(`[${timestamp}] ERROR ${result.username}: ${result.error}`);
            }
            totalProcessed++;
            checkAutoBackup(logDiv);
        }

        return { results, deletedCount };
    }

    await waitForContacts();

    let continueLoading = true;

    function showPopup() {
        if (document.querySelector('#export-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'export-popup';
        popup.innerHTML = `
            <h2>MyDealz Konversations-Manager v1.4</h2>
            <table style="width: 100%; margin-bottom: 15px;">
                <tr><td><strong>Suchstring:</strong></td><td><input type="text" id="search-input" value="${SEARCH_TEXT}" style="width: 100%;"></td></tr>
                <tr><td><strong>Modus:</strong></td><td><select id="mode-select"><option value="analyze">Nur analysieren</option><option value="delete">Analysieren & Löschen</option></select></td></tr>
                <tr><td><strong>Parallele Anfragen:</strong></td><td><input type="number" id="parallel-input" value="${MAX_PARALLEL}" min="1" max="20"> (1-20, für 250k empfohlen: 8-12)</td></tr>
                <tr><td><strong>Log-Datei:</strong></td><td>${logFileName}</td></tr>
                <tr><td><strong>Logging:</strong></td><td>Batch-Size: ${LOG_BATCH_SIZE}, Checkpoints: alle ${CHECKPOINT_INTERVAL}</td></tr>
            </table>
            <div class="buttons">
                <button id="start-btn" style="background: #4CAF50; color: white; border: none;">Start</button>
                <button id="stop-btn" style="background: #f44336; color: white; border: none;" disabled>Stop</button>
                <button id="download-btn" style="background: #2196F3; color: white; border: none;">Log herunterladen</button>
                <button id="close-btn" style="background: #999; color: white; border: none;">Schließen</button>
            </div>
            <div class="status" id="status">Bereit zum Start</div>
            <div class="progress"><div class="progress-bar" id="progress-bar"></div></div>
            <div class="log" id="log"></div>
        `;

        document.body.appendChild(popup);

        document.getElementById('start-btn').onclick = startProcessing;
        document.getElementById('stop-btn').onclick = stopProcessing;
        document.getElementById('download-btn').onclick = () => downloadLogFile();
        document.getElementById('close-btn').onclick = () => popup.remove();
    }

    async function startProcessing() {
        SEARCH_TEXT = document.getElementById('search-input').value;
        deleteMode = document.getElementById('mode-select').value === 'delete';
        MAX_PARALLEL = parseInt(document.getElementById('parallel-input').value);

        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const statusDiv = document.getElementById('status');
        const logDiv = document.getElementById('log');
        const progressBar = document.getElementById('progress-bar');

        startBtn.disabled = true;
        stopBtn.disabled = false;
        continueLoading = true;

        // Reset KEEP-Counter
        totalKeepCount = 0;

        let totalFound = 0;
        let totalDeleted = 0;
        let batchCount = 0;

        try {
            while (continueLoading) {
                const allConversations = getValidConversations();
                const unprocessedConversations = allConversations.filter(conv => !processedIds.has(conv.id));

                if (unprocessedConversations.length === 0) {
                    if (hasMoreConversationsAvailable()) {
                        const loaded = await loadNextBatch(logDiv);
                        if (!loaded) {
                            break;
                        }
                        continue;
                    } else {
                        break;
                    }
                }

                const batch = unprocessedConversations.slice(0, BATCH_SIZE);
                const { results, deletedCount } = await processBatchUltraFast(batch, MAX_PARALLEL, logDiv);

                batchCount++;
                totalFound += results.filter(r => r.shouldDelete).length;
                totalDeleted += deletedCount;

                statusDiv.innerHTML = `
                    Batch ${batchCount} | Verarbeitet: ${totalProcessed} |
                    Gefunden: ${totalFound} | Gelöscht: ${totalDeleted}
                `;

                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            statusDiv.textContent = `Fehler: ${error.message}`;
            addToLogBuffer(`FATAL ERROR: ${error.message}`);
        } finally {
            startBtn.disabled = false;
            stopBtn.disabled = true;

            const endTime = new Date();
            const duration = Math.round((endTime - startTime) / 1000);
            const finalStats = `\n=== FINALE STATISTIKEN ===\nLaufzeit: ${duration}s\nVerarbeitet: ${totalProcessed}\nGefunden: ${totalFound}\nGelöscht: ${totalDeleted}\n`;

            addToLogBuffer(finalStats);
            statusDiv.textContent += ` | Fertig in ${duration}s`;

            downloadLogFile();
        }
    }

    function stopProcessing() {
        continueLoading = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('status').textContent += " | Gestoppt";
    }

    showPopup();
})();
