// ==UserScript==
// @name         Mydealz Nachrichten-Exporter
// @namespace    https://www.mydealz.de/
// @version      1.0
// @description  Exportiert alle Nachrichten aller Kontakte als mbox-Datei
// @author       MD928835
// @match        https://www.mydealz.de/profile/messages*
// @match        https://www.mydealz.de/profile/*/settings*
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528546/Mydealz%20Nachrichten-Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/528546/Mydealz%20Nachrichten-Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Stil für das Popup
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
            max-width: 80%;
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
            max-height: 200px;
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

    // Prüfen, ob wir auf der Einstellungsseite sind
    if (window.location.href.includes('/settings')) {
        // Button zum Exportieren der Nachrichten auf der Einstellungsseite hinzufügen
        const nutzerdatenContainer = document.querySelector('.formList-row .formList-content .iGrid-item');

        if (nutzerdatenContainer) {
            const exportButton = document.createElement('button');
            exportButton.type = 'button';
            exportButton.className = 'width--all-12 hAlign--all-c button button--shape-circle button--type-secondary button--mode-default';
            exportButton.style.marginTop = '10px';
            exportButton.innerHTML = '<span class="flex--inline boxAlign-ai--all-c">Nachrichten exportieren</span>';

            exportButton.addEventListener('click', function() {
                window.location.href = 'https://www.mydealz.de/profile/messages';
            });

            nutzerdatenContainer.appendChild(exportButton);
        }
    }
    // Wenn wir auf der Nachrichtenseite sind, starte den Export
    else if (window.location.href.includes('/messages')) {
        // Prüfen, ob wir von der Einstellungsseite kommen
        if (document.referrer.includes('/settings')) {
            // Starte den Export automatisch
            setTimeout(exportAllMessages, 1000);
        }
    }

    async function exportAllMessages() {
        // Abbruch-Controller für Fetch-Anfragen
        const controller = new AbortController();
        let continueLoading = true;

        // Popup erstellen
        const popup = document.createElement('div');
        popup.id = 'export-popup';
        popup.innerHTML = `
            <h2>Alle Nachrichten exportieren</h2>
            <div class="status">Kontakte werden geladen...</div>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
            <div class="log"></div>
            <div class="buttons">
                <button id="schliessen-button">Schließen</button>
                <button id="export-button" disabled>Als mbox exportieren</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('schliessen-button').addEventListener('click', () => {
            popup.remove();
            continueLoading = false;
            controller.abort();
        });

        const statusElement = popup.querySelector('.status');
        const progressBar = popup.querySelector('.progress-bar');
        const logElement = popup.querySelector('.log');
        const exportButton = document.getElementById('export-button');

        // Aktuellen Benutzernamen ermitteln
        const currentUser = document.querySelector('.navDropDown-avatar').alt.replace("'s Profilbild", "");

        // Alle Kontakte laden
        const contacts = await loadAllContacts(statusElement, progressBar, logElement, controller, continueLoading);

        if (!continueLoading || contacts.length === 0) {
            statusElement.textContent = 'Keine Kontakte gefunden oder Export abgebrochen.';
            return;
        }

        statusElement.textContent = `${contacts.length} Kontakte gefunden. Nachrichten werden geladen...`;

        // Alle Nachrichten laden
        const allMessages = [];
        let processedContacts = 0;

        for (const contact of contacts) {
            if (!continueLoading) break;

            statusElement.textContent = `Lade Nachrichten von ${contact.username} (${processedContacts + 1}/${contacts.length})...`;
            progressBar.style.width = `${(processedContacts / contacts.length) * 100}%`;

            logElement.textContent += `Lade Nachrichten von ${contact.username} (ID: ${contact.userId})...\n`;

            const messages = await loadMessagesForUser(contact.userId, contact.username, currentUser, logElement, controller, continueLoading);
            allMessages.push(...messages);

            processedContacts++;

            // Kurze Pause, um den Server nicht zu überlasten
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!continueLoading) {
            statusElement.textContent = 'Export wurde abgebrochen.';
            return;
        }

        // Export vorbereiten
        statusElement.textContent = `${allMessages.length} Nachrichten von ${contacts.length} Kontakten geladen. Bereit zum Export.`;
        progressBar.style.width = '100%';
        exportButton.disabled = false;

        // Export-Funktion
        exportButton.addEventListener('click', () => {
            // mbox-Format erstellen
            const mboxContent = allMessages.map(msg => {
                return `From ${msg.from} ${msg.date}
From: ${msg.from}
To: ${msg.to}
Date: ${msg.date}
Subject: ${msg.subject}

${msg.content}

`;
            }).join('\n');

            const blob = new Blob([mboxContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `mydealz_alle_nachrichten_${new Date().toISOString().slice(0,10)}.mbox`;
            a.click();

            URL.revokeObjectURL(url);
        });
    }

    async function loadAllContacts(statusElement, progressBar, logElement, controller, continueLoading) {
        const contacts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && continueLoading) {
            try {
                statusElement.textContent = `Lade Kontakte Seite ${page}...`;

                const response = await fetch(`https://www.mydealz.de/conversation/recent/20/${page}`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (data && data.data && data.data.content) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.data.content;

                    // Prüfen, ob "Weitere Nachrichten laden" Button vorhanden ist
                    const loadMoreButton = tempDiv.querySelector('.moreConversations button');
                    hasMore = loadMoreButton !== null;

                    // Kontakte aus der Antwort extrahieren
                    const items = tempDiv.querySelectorAll('li[id^="conversation-"]');
                    items.forEach(item => {
                        const usernameElement = item.querySelector('.conversationList-senderLine');
                        if (usernameElement) {
                            const username = usernameElement.textContent.trim();
                            const userId = item.getAttribute('data-replace')?.match(/\/user\/(\d+)\//)?.[1];

                            if (username && userId && !contacts.some(c => c.userId === userId)) {
                                contacts.push({ userId, username });
                                logElement.textContent += `Kontakt gefunden: ${username} (ID: ${userId})\n`;
                            }
                        }
                    });
                } else {
                    hasMore = false;
                }

                page++;

                // Kurze Pause, um den Server nicht zu überlasten
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (error) {
                if (error.name === 'AbortError') {
                    logElement.textContent += `Export abgebrochen.\n`;
                    return contacts;
                }
                console.error('Fehler beim Laden der Kontakte:', error);
                logElement.textContent += `FEHLER: ${error.message}\n`;
                hasMore = false;
            }
        }

        return contacts;
    }

    async function loadMessagesForUser(userId, username, currentUser, logElement, controller, continueLoading) {
        const messages = [];
        let page = 1;
        let hasMoreMessages = true;

        while (hasMoreMessages && continueLoading) {
            try {
                const url = `https://www.mydealz.de/conversation/user/${userId}/0/${page}`;
                logElement.textContent += `  Lade Seite ${page}: ${url}\n`;

                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    signal: controller.signal
                });

                const data = await response.json();

                if (data && data.data && data.data.content) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.data.content;

                    // Nachrichten aus der Antwort extrahieren
                    const messageElements = tempDiv.querySelectorAll('.cept-message');

                    if (messageElements.length === 0) {
                        // Keine Nachrichten mehr, Ende erreicht
                        hasMoreMessages = false;
                    } else {
                        // Nachrichten verarbeiten
                        messageElements.forEach(messageElement => {
                            const senderElement = messageElement.querySelector('.button--type-text');
                            const dateElement = messageElement.querySelector('.mute--text');
                            const contentElement = messageElement.querySelector('.conversation-content');

                            if (senderElement && dateElement && contentElement) {
                                const sender = senderElement.textContent.trim();
                                const dateText = dateElement.textContent.trim();
                                const content = contentElement.textContent.trim().replace(/\s+/g, ' ');

                                // Datum in mbox-Format konvertieren
                                const dateParts = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
                                let mboxDate = '';
                                if (dateParts) {
                                    const [_, day, month, year, hours, minutes] = dateParts;
                                    const dateObj = new Date(year, month-1, day, hours, minutes);
                                    mboxDate = dateObj.toUTCString();
                                } else {
                                    mboxDate = new Date().toUTCString(); // Fallback
                                }

                                // Bestimmen, wer Sender und Empfänger ist
                                const from = sender === currentUser ?
                                    `${currentUser}@mydealz.de` :
                                    `${sender}@mydealz.de`;
                                const to = sender === currentUser ?
                                    `${username}@mydealz.de` :
                                    `${currentUser}@mydealz.de`;

                                // Betreff aus den ersten 40 Zeichen der Nachricht
                                const subject = content.substring(0, 40).replace(/\n/g, ' ');

                                messages.push({
                                    from,
                                    to,
                                    date: mboxDate,
                                    subject,
                                    content
                                });
                            }
                        });

                        // Wenn weniger als 10 Nachrichten zurückkommen, haben wir das Ende erreicht
                        if (messageElements.length < 10) {
                            hasMoreMessages = false;
                        }
                    }
                } else {
                    // Keine Daten mehr oder Fehler in der Antwort
                    hasMoreMessages = false;
                }

                page++;

                // Kurze Pause, um den Server nicht zu überlasten
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (error) {
                if (error.name === 'AbortError') {
                    logElement.textContent += `  Export abgebrochen.\n`;
                    return messages;
                }
                console.error('Fehler beim Laden der Nachrichten:', error);
                logElement.textContent += `  FEHLER: ${error.message}\n`;
                hasMoreMessages = false;
            }
        }

        logElement.textContent += `  ${messages.length} Nachrichten von ${username} geladen\n`;
        return messages;
    }
})();
