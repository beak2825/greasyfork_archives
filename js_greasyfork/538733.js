// ==UserScript==
// @name         Kleinanzeigen-Datenexport (TO LLM) & Seitennavigation 🚀
// @namespace    http://tampermonkey.net/
// @version      22.8 // Version angehoben für A/D Navigation immer aktiv
// @description  Erfasst sichtbare Inhalte und Metadaten als JSONL für LLM-Verarbeitung. Unterstützt kontinuierliches Sammeln über mehrere Seiten (persistenter Modus) und Seitennavigation mit A/D. Exportiert nur sichtbare/lesbare Daten + Anzeigen-ID.
// @author       Assistant & User
// @license MIT
// @match        https://www.kleinanzeigen.de/*
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kleinanzeigen.de&size=64
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/538733/Kleinanzeigen-Datenexport%20%28TO%20LLM%29%20%20Seitennavigation%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/538733/Kleinanzeigen-Datenexport%20%28TO%20LLM%29%20%20Seitennavigation%20%F0%9F%9A%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Globale Variablen
    let pickerButton = null;
    let longPressTimer = null;
    const LONG_PRESS_THRESHOLD = 500; // ms, Wie lange der Klick gehalten werden muss für Langklick
    let isLockedMode = false; // true wenn im kontinuierlichen Sammel-Modus
    let allCollectedData = []; // Speichert JSONL-Objekte aus allen gesammelten Seiten
    let scriptErrors = []; // Speichert Skript-interne Fehler
    let countdownInterval = null; // Für den Countdown-Timer
    let lastKnownUrl = window.location.href; // Für die Erkennung von Seitenwechseln
    let mutationObserver = null; // Für DOM-Änderungen in SPAs
    let processingPage = false; // Flag, um mehrfache Verarbeitung bei schnellen DOM-Änderungen zu verhindern

    // Schlüssel für die Speicherung des Modus-Status
    const STORAGE_KEY_LOCKED_MODE = 'kleinanzeigen_picker_locked_mode';

    // Startzeit für Skript-Laufzeitmessung (für Metadaten)
    const scriptStartTime = performance.now();

    // CSS-Stile für den Button und Benachrichtigungen
    GM_addStyle(`
        #element-picker-btn {
            position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
            width: 100px; /* Länglicher */ height: 50px; /* Länglicher */
            background: #007185; border: none; border-radius: 8px; /* Leicht abgerundet */
            cursor: pointer; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            transition: background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
            color: white; font-size: 16px; font-weight: bold; text-align: center;
            line-height: 1.2;
            padding: 5px;
        }
        #element-picker-btn:hover { background-color: #005a6b; opacity: 0.9; }
        #element-picker-btn.active { background: #dc3545; animation: pulse 1s infinite; }
        #element-picker-btn.locked { background: #17a2b8; animation: pulse-locked 1s infinite; }
        #element-picker-btn.processing { opacity: 0.6; cursor: wait; } /* Visueller Hinweis während der Datenverarbeitung */

        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }
        @keyframes pulse-locked { 0% { box-shadow: 0 0 0 0 rgba(23, 162, 184, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(23, 162, 184, 0); } 100% { box-shadow: 0 0 0 0 rgba(23, 162, 184, 0); } }

        .picker-notification {
            position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
            padding: 10px 20px; border-radius: 5px; z-index: 10000; font-family: Arial, sans-serif;
            font-size: 14px; animation: slideIn 0.3s ease-out; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        .picker-status {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #343a40; color: white;
            padding: 8px 16px; border-radius: 5px; z-index: 10000; font-family: Arial, sans-serif;
            font-size: 12px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
    `);

    // --- FEHLERPROTOKOLLIERUNG ---
    function logScriptError(error, context) {
        scriptErrors.push({
            timestamp: new Date().toISOString(),
            context: context,
            message: error.message,
            stack: error.stack ? error.stack.split('\n') : 'No stack trace available'
        });
        console.error(`Kleinanzeigen-Skript Fehler [${context}]:`, error);
    }

    // --- HILFSFUNKTIONEN FÜR DATENEXTRAKTION ---
    function parseLocation(locationString) {
        try {
            if (!locationString) return { plz: null, stadt: null, entfernung_km: null };
            const cleanString = locationString.replace(/\s+/g, ' ').trim();
            const plzMatch = cleanString.match(/^(\d{5})/);
            let stadt = cleanString.replace(/^\d{5}\s*/, '').replace(/\(\d+\s*km\)/, '').trim();
            // Wenn die Stadt noch den PLZ-Teil enthält, entferne ihn erneut
            if (plzMatch && stadt.startsWith(plzMatch[1])) {
                stadt = stadt.substring(plzMatch[1].length).trim();
            }
            const distanceMatch = cleanString.match(/\((\d+)\s*km\)/);
            return {
                plz: plzMatch ? plzMatch[1] : null,
                stadt: stadt || null,
                entfernung_km: distanceMatch ? parseInt(distanceMatch[1], 10) : null
            };
        } catch (e) {
            logScriptError(e, 'parseLocation');
            return { plz: null, stadt: null, entfernung_km: null };
        }
    }

    function parsePrice(priceString) {
        try {
            if (!priceString) return { betrag: null, zusatz: null };
            const cleanString = priceString.replace(/\s+/g, ' ').trim();
            const betragMatch = cleanString.match(/(\d[\d\.]*)/);
            let betrag = null;
            if (betragMatch) {
                betrag = parseFloat(betragMatch[1].replace(/\./g, '').replace(/,/g, '.')); // Auch Kommas für Dezimalzahlen beachten
            }
            const zusatzMatch = cleanString.match(/VB/i);
            return { betrag: betrag, zusatz: zusatzMatch ? 'VB' : null };
        } catch (e) {
            logScriptError(e, 'parsePrice');
            return { betrag: null, zusatz: null };
        }
    }

    // Funktion zum Extrahieren von Anzeigen-spezifischen Daten
    function extractAdItemData(adListItem) {
        try {
            const data = {};
            const adid = adListItem.getAttribute('data-adid');
            if (adid) data.id_of_ad = adid; // Hier wird die Anzeigen-ID hinzugefügt

            // Nur die Key-Data, die ein Mensch auch lesen würde
            const titleElement = adListItem.querySelector('h2.text-module-begin a.ellipsis, h2.text-module-begin span.ellipsis');
            if (titleElement) data.title = titleElement.textContent.trim();
            const descElement = adListItem.querySelector('.aditem-main--middle--description');
            if (descElement) data.description = descElement.textContent.trim().replace(/\s+/g, ' ');
            const priceElement = adListItem.querySelector('.aditem-main--middle--price-shipping--price');
            if (priceElement) data.price = parsePrice(priceElement.textContent);
            const locationElement = adListItem.querySelector('.aditem-main--top--left');
            if (locationElement) data.location = parseLocation(locationElement.textContent);
            const dateElement = adListItem.querySelector('.aditem-main--top--right');
            if (dateElement) data.date = dateElement.textContent.trim();
            const linkElement = adListItem.querySelector('a[href^="/s-anzeige/"]');
            if(linkElement) data.link = `https://www.kleinanzeigen.de${linkElement.getAttribute('href')}`;
            const imageCountElement = adListItem.querySelector('.galleryimage--counter');
            if (imageCountElement) data.image_count = parseInt(imageCountElement.textContent.trim(), 10);
            const isShippingPossible = adListItem.querySelector('.simpletag.tag-with-icon .icon-package');
            if (isShippingPossible) data.shipping_possible = true;
            const isDirectBuy = adListItem.querySelector('.simpletag.tag-with-icon .icon-send-money');
            if (isDirectBuy) data.direct_buy_possible = true;

            // Wenn keine ID gefunden wurde, ist es wahrscheinlich kein gültiges Anzeigen-Element
            if (!data.id_of_ad) {
                return null;
            }

            // Entferne undefined-Werte
            Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
            return data;

        } catch (e) {
            logScriptError(e, 'extractAdItemData');
            return null;
        }
    }

    function extractPageMetadata() {
        try {
            const url = window.location.href;
            const title = document.title;
            const timestamp_utc = new Date().toISOString();
            const html_lang = document.documentElement.lang || 'de';
            const faviconLink = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
            const favicon_url = faviconLink ? faviconLink.href : 'https://www.kleinanzeigen.de/favicon.ico';
            const metaDescriptionTag = document.querySelector('meta[name="description"]');
            const metaDescription = metaDescriptionTag ? metaDescriptionTag.content : null;
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            const canonicalUrl = canonicalLink ? canonicalLink.href : null;

            const urlParams = new URLSearchParams(window.location.search);
            const url_parameters = {};
            for (const [key, value] of urlParams.entries()) {
                url_parameters[key] = value;
            }

            const schemaOrgData = [];
            document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
                try {
                    const json = JSON.parse(script.textContent);
                    if (json['@type']) {
                        // If it's an array of types, take them all
                        if (Array.isArray(json['@type'])) {
                            schemaOrgData.push(...json['@type']);
                        } else {
                            schemaOrgData.push(json['@type']);
                        }
                    }
                } catch (e) {
                    logScriptError(e, 'Parsing Schema.org JSON-LD');
                }
            });

            // Paginierungsinformationen werden hier direkt hinzugefügt
            const currentPageElement = document.querySelector('.pagination-current');
            const currentPage = currentPageElement ? parseInt(currentPageElement.textContent.trim()) : 1;

            const totalPagesElement = document.querySelector('.pagination-pages a:last-of-type');
            let totalPages = totalPagesElement ? parseInt(totalPagesElement.textContent.trim()) : null;

            if (!totalPages || isNaN(totalPages)) {
                const allPageLinks = document.querySelectorAll('.pagination-pages a.pagination-page, .pagination-current');
                if (allPageLinks.length > 0) {
                    const visiblePageNumbers = Array.from(allPageLinks)
                                                  .map(el => parseInt(el.textContent.trim()))
                                                  .filter(num => !isNaN(num));
                    totalPages = Math.max(...visiblePageNumbers, currentPage);
                }
            }

            const nextLinkElement = document.querySelector('a.pagination-next, span.pagination-next[data-url]');
            const nextPageLink = nextLinkElement ? (nextLinkElement.tagName.toLowerCase() === 'a' ? nextLinkElement.href : nextLinkElement.dataset.url) : null;

            const prevLinkElement = document.querySelector('a.pagination-prev, span.pagination-prev[data-url]');
            const prevPageLink = prevLinkElement ? (prevLinkElement.tagName.toLowerCase() === 'a' ? prevLinkElement.href : prevLinkElement.dataset.url) : null;


            return {
                metadata: {
                    url: url,
                    title: title,
                    timestamp_utc: timestamp_utc,
                    html_lang: html_lang,
                    favicon_url: favicon_url,
                    url_parameters: Object.keys(url_parameters).length > 0 ? url_parameters : null,
                    metaDescription: metaDescription,
                    canonicalUrl: canonicalUrl,
                    schemaOrgData: schemaOrgData.length > 0 ? Array.from(new Set(schemaOrgData)) : null, // Unique types
                    script_runtime: ((performance.now() - scriptStartTime) / 1000).toFixed(3) + 's',
                    script_version: GM_info.script.version,
                    page_load_errors: scriptErrors.length > 0 ? scriptErrors : null,
                    pagination: {
                        current_page: currentPage,
                        total_pages: totalPages,
                        next_page_link: nextPageLink,
                        prev_page_link: prevPageLink
                    }
                }
            };
        } catch (e) {
            logScriptError(e, 'extractPageMetadata');
            return { metadata: { url: window.location.href, error: e.message, page_load_errors: scriptErrors } };
        }
    }

    // --- HAUPTFUNKTIONEN & MODUS-STEUERUNG ---
    function collectCurrentPageData() {
        scriptErrors = []; // Fehler für jede neue Seite zurücksetzen
        const pageData = [extractPageMetadata()]; // Beginne immer mit Metadaten

        // Kleinanzeigen spezifische Ad-Items immer sammeln (wenn sichtbar und mit ID)
        // HINWEIS: Der Viewport-Check wurde hier entfernt, um alle Anzeigen der Liste zu erfassen.
        document.querySelectorAll('article.aditem, li.ad-listitem > article.aditem').forEach(item => {
            const adid = item.getAttribute('data-adid');
            if (adid) { // Nur Anzeigen mit einer ID
                const data = extractAdItemData(item);
                if (data) pageData.push(data);
            }
        });

        // Aktualisiere Metadaten mit tatsächlicher Anzahl gesammelter Elemente
        // Beachten: pageData[0] ist die Metadaten. Der Rest sind die Anzeigen.
        pageData[0].metadata.selected_elements_count = pageData.length - 1;
        console.log(`Kleinanzeigen-Skript: Gesammelte Anzeigen auf aktueller Seite: ${pageData.length - 1}`);
        return pageData;
    }

    function copyDataToClipboard(data) {
        try {
            const jsonlOutput = data.map(obj => JSON.stringify(obj)).join('\n');
            GM_setClipboard(jsonlOutput, 'text/plain');
            showNotification(`${data.length > 0 ? data.length - 1 : 0} Objekt(e) als JSONL kopiert!`);
        } catch (e) {
            logScriptError(e, 'copyDataToClipboard');
            showNotification('Fehler beim Kopieren der Daten!');
        }
    }

    // Funktion zum Anzeigen von Benachrichtigungen
    function showNotification(message, duration = 3000) {
        let notification = document.querySelector('.picker-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('picker-notification');
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.style.display = 'block'; // Sicherstellen, dass es sichtbar ist

        clearTimeout(notification.timer);
        notification.timer = setTimeout(() => {
            notification.style.display = 'none';
        }, duration);
    }

    // --- BUTTON INTERAKTION ---
    function handleButtonPress(e) {
        if (e.button !== 0) return; // Nur linke Maustaste

        // Verhindere Textauswahl bei Klick
        e.preventDefault();

        if (isLockedMode) {
            // Wenn im Sammel-Modus, beende den Modus und kopiere alles
            console.log("Kleinanzeigen-Skript: Sammel-Modus beenden durch Kurz-Klick.");
            deactivateLockedMode();
            return;
        }

        // Startet Timer für Langklick-Erkennung
        console.log("Kleinanzeigen-Skript: Maustaste gedrückt, starte Langklick-Timer.");
        longPressTimer = setTimeout(() => {
            console.log("Kleinanzeigen-Skript: Langklick-Schwelle erreicht, starte Countdown.");
            startCountdown(3); // Startet den visuellen Countdown
            longPressTimer = null; // Setzt Timer zurück, da Langklick erkannt
        }, LONG_PRESS_THRESHOLD);

        // Listener, um Langklick zu beenden, falls die Maustaste losgelassen wird
        // Oder wenn die Maus den Button verlässt, bevor der Langklick registriert wird
        // ACHTUNG: 'once: true' ist wichtig für den Mouseleave Listener auf dem Button
        pickerButton.addEventListener('mouseleave', handleButtonRelease, { once: true });
        // Der globale 'mouseup' Listener wird unten in 'init' hinzugefügt
    }

    function handleButtonRelease(e) {
        // Nur auslösen, wenn der Event vom Picker Button oder dem Dokument selbst kommt
        // (oder wenn der Event-Target nicht pickerButton ist, aber pickerButton ein Child von e.target ist, was für document.mouseup relevant ist)
        if (e.target !== pickerButton && !pickerButton.contains(e.target)) return;


        console.log("Kleinanzeigen-Skript: Maustaste losgelassen oder Maus vom Button entfernt.");
        if (countdownInterval) {
            // Wenn der Countdown aktiv ist, wurde der Langklick abgebrochen
            console.log("Kleinanzeigen-Skript: Langklick-Countdown abgebrochen.");
            clearInterval(countdownInterval);
            countdownInterval = null;
            pickerButton.textContent = 'TO LLM'; // Text zurücksetzen
            pickerButton.classList.remove('active'); // Puls entfernen
            showNotification('Langklick abgebrochen.');
        } else if (longPressTimer) {
            // Wenn der Timer noch läuft, war es ein kurzer Klick
            console.log("Kleinanzeigen-Skript: Kurzer Klick erkannt.");
            clearTimeout(longPressTimer);
            longPressTimer = null;
            // Kurzer Klick: Sammle Daten der aktuellen Seite und kopiere sie
            const currentPageData = collectCurrentPageData();
            copyDataToClipboard(currentPageData);
            showNotification('Aktuelle Seite als JSONL kopiert!');
            pickerButton.classList.remove('active'); // Setze Zustand zurück
        }
        // Nach jeder Button-Interaktion Timer und Listener aufräumen
        if (longPressTimer) { // Falls Timer noch aktiv, aber Release ausgelöst
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        pickerButton.removeEventListener('mouseleave', handleButtonRelease); // Sicherstellen, dass nur dieser Listener entfernt wird
    }

    function startCountdown(count) {
        let currentCount = count;
        pickerButton.textContent = currentCount;
        pickerButton.classList.add('active'); // Visuell als "aktiv" markieren

        countdownInterval = setInterval(() => {
            currentCount--;
            if (currentCount > 0) {
                pickerButton.textContent = currentCount;
            } else {
                clearInterval(countdownInterval);
                countdownInterval = null;
                pickerButton.textContent = 'STOP'; // Text für Sammel-Modus
                activateLockedMode(); // Aktiviere den kontinuierlichen Sammel-Modus
                showNotification('Sammel-Modus aktiv. Navigieren Sie durch Seiten.');
            }
        }, 1000);
    }

    function activateLockedMode() {
        console.log("Kleinanzeigen-Skript: Sammel-Modus aktiviert.");
        isLockedMode = true;
        GM_setValue(STORAGE_KEY_LOCKED_MODE, true); // Status speichern
        allCollectedData = []; // Alte Daten löschen
        processNewPage(); // Daten der Startseite sammeln
        pickerButton.classList.remove('active'); // Entferne "active" Puls
        pickerButton.classList.add('locked'); // Füge "locked" Puls hinzu
        pickerButton.title = 'Klicken, um Sammel-Modus zu beenden und alle gesammelten Daten zu kopieren';

        // Starte den MutationObserver für Seitenwechsel in SPAs
        observeDOMChanges();

        updateStatusDisplay();
    }

    function deactivateLockedMode() {
        console.log("Kleinanzeigen-Skript: Sammel-Modus deaktiviert.");
        isLockedMode = false;
        GM_setValue(STORAGE_KEY_LOCKED_MODE, false); // Status löschen

        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
            console.log("Kleinanzeigen-Skript: MutationObserver gestoppt.");
        }

        // Kopiere alle gesammelten Daten vor dem Löschen
        copyDataToClipboard(allCollectedData);
        allCollectedData = []; // Gesammelte Daten leeren nach dem Kopieren/Beenden

        pickerButton.classList.remove('locked', 'active', 'processing');
        pickerButton.textContent = 'TO LLM'; // Zurück zum Standardtext
        pickerButton.title = 'Daten der aktuellen Seite erfassen (Kurz-Klick) / Kontinuierlich sammeln (Langklick)';

        removeStatus();
        showNotification('Sammel-Modus beendet.');
    }

    // --- SEITENWECHSEL-ERKENNUNG (Primär über MutationObserver) ---
    function processNewPage() {
        if (processingPage) {
            console.log("Kleinanzeigen-Skript: Seitenverarbeitung bereits im Gange, überspringe.");
            return;
        }
        processingPage = true;
        pickerButton.classList.add('processing'); // Visueller Hinweis
        console.log(`Kleinanzeigen-Skript: Starte Datensammlung für aktuelle Seite: ${window.location.href}`);

        // Kleine Verzögerung, damit die Seite vollständig gerendert werden kann
        // und um Doppel-Sammlungen bei schnellen DOM-Updates zu vermeiden
        setTimeout(() => {
            allCollectedData.push(...collectCurrentPageData());
            updateStatusDisplay();
            showNotification(`Seite gesammelt: ${window.location.pathname.split('/').pop() || 'Startseite'}`);
            console.log(`Kleinanzeigen-Skript: Datensammlung für ${window.location.href} abgeschlossen. Total Datenpunkte: ${allCollectedData.length}`);

            pickerButton.classList.remove('processing');
            processingPage = false;
        }, 800); // Erhöhte Verzögerung für stabilere Erfassung
    }

    function observeDOMChanges() {
        if (mutationObserver) {
            mutationObserver.disconnect(); // Vorherigen Observer trennen
        }

        const targetNode = document.body;
        const config = { childList: true, subtree: true, attributes: false };

        mutationObserver = new MutationObserver(mutationsList => {
            const newUrl = window.location.href;
            if (newUrl !== lastKnownUrl) {
                // URL hat sich geändert (Browser-Nav, PushState), behandle als Seitenwechsel
                console.log(`Kleinanzeigen-Skript: URL-Wechsel erkannt: ${lastKnownUrl} -> ${newUrl}`);
                if (isLockedMode) {
                    processNewPage();
                }
                lastKnownUrl = newUrl; // URL aktualisieren
            } else {
                // URL ist gleich, aber DOM hat sich geändert (AJAX-Load, Filter)
                const adListContainer = document.getElementById('srchrslt-adtable'); // Der Container, der die Anzeigenliste hält

                const relevantChange = mutationsList.some(mutation => {
                    return (adListContainer && adListContainer.contains(mutation.target)) ||
                           mutation.addedNodes.length > 0 && Array.from(mutation.addedNodes).some(node => node.nodeType === Node.ELEMENT_NODE && (node.matches('.ad-listitem') || node.matches('.pagination-page')));
                });

                if (relevantChange && isLockedMode && !processingPage) {
                    console.log("Kleinanzeigen-Skript: Relevante DOM-Änderung erkannt und im Sammel-Modus.");
                    processNewPage();
                }
            }
        });

        mutationObserver.observe(targetNode, config);
        console.log("Kleinanzeigen-Skript: MutationObserver gestartet.");
    }

    // --- Statusanzeige am unteren Rand ---
    function updateStatusDisplay() {
        let statusElement = document.getElementById('picker-status-display');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'picker-status-display';
            statusElement.classList.add('picker-status');
            document.body.appendChild(statusElement);
        }
        // Datenpunkte = Gesamtanzahl der Objekte minus die Metadaten-Objekte (eines pro gesammelter Seite)
        const totalDataPoints = allCollectedData.length > 0 ? allCollectedData.filter(item => item.id_of_ad).length : 0;
        const totalPagesCollected = allCollectedData.length > 0 ? allCollectedData.filter(item => item.metadata).length : 0;

        statusElement.textContent = `Gesammelte Seiten: ${totalPagesCollected} | Anzeigen: ${totalDataPoints}`;
    }

    function removeStatus() {
        const statusElement = document.getElementById('picker-status-display');
        if (statusElement) {
            statusElement.remove();
        }
    }

    // Bombensichere Tastatur-Navigation (A/D)
    document.addEventListener('keydown', (e) => {
        // Die Bedingung `isLockedMode` wurde entfernt, damit die Navigation immer funktioniert.
        const targetTagName = e.target.tagName.toLowerCase();
        if (!(targetTagName === 'input' || targetTagName === 'textarea' || e.target.isContentEditable)) {
            // Verhindere Standard-Scrollverhalten bei A/D
            if (e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
            }

            let navigationElement = null;

            // Navigiere zur vorherigen Seite mit 'A'
            if (e.key === 'a' || e.key === 'A') {
                console.log("Kleinanzeigen-Skript: Suche nach vorheriger Seite...");
                // Spezifisch für Kleinanzeigen: a.pagination-prev oder span.pagination-prev[data-url]
                navigationElement = document.querySelector('a.pagination-prev, span.pagination-prev[data-url]');

                // Fallback für allgemeinere Selektoren, falls die spezifischen nicht gefunden werden
                if (!navigationElement) {
                    navigationElement = document.querySelector(
                        'a[title*="vorherige" i], ' +
                        'a[title*="Zurück" i], ' +
                        'a[aria-label*="vorherige" i], ' +
                        'a[aria-label*="Zurück" i], ' +
                        'a:contains("<"), ' +
                        'a:contains("«"), ' +
                        'a[rel="prev"], ' +
                        '.pagination-pages a:first-of-type, ' +
                        '.pagination-nav a:first-of-type'
                    );
                }

                if (navigationElement) {
                    console.log("Kleinanzeigen-Skript: Navigiere zur vorherigen Seite (gefunden).");
                    if (navigationElement.tagName.toLowerCase() === 'a') {
                        navigationElement.click();
                    } else if (navigationElement.tagName.toLowerCase() === 'span' && navigationElement.dataset.url) {
                        window.location.href = navigationElement.dataset.url;
                    } else {
                        // Fallback, wenn es ein unbekannter Typ ist aber klickbar scheint
                        navigationElement.click();
                    }
                } else {
                    console.log("Kleinanzeigen-Skript: Keine vorherige Seite gefunden.");
                }
            }
            // Navigiere zur nächsten Seite mit 'D'
            else if (e.key === 'd' || e.key === 'D') {
                console.log("Kleinanzeigen-Skript: Suche nach nächster Seite...");
                // Spezifisch für Kleinanzeigen: a.pagination-next oder span.pagination-next[data-url]
                navigationElement = document.querySelector('a.pagination-next, span.pagination-next[data-url]');

                // Fallback für allgemeinere Selektoren
                if (!navigationElement) {
                    navigationElement = document.querySelector(
                        'a[title*="nächste" i], ' +
                        'a[title*="Weiter" i], ' +
                        'a[aria-label*="nächste" i], ' +
                        'a[aria-label*="Weiter" i], ' +
                        'a:contains(">"), ' +
                        'a:contains("»"), ' +
                        'a[rel="next"], ' +
                        '.pagination-pages a:last-of-type, ' +
                        '.pagination-nav a:last-of-type'
                    );
                }

                if (navigationElement) {
                    console.log("Kleinanzeigen-Skript: Navigiere zur nächsten Seite (gefunden).");
                    if (navigationElement.tagName.toLowerCase() === 'a') {
                        navigationElement.click();
                    } else if (navigationElement.tagName.toLowerCase() === 'span' && navigationElement.dataset.url) {
                        window.location.href = navigationElement.dataset.url;
                    } else {
                        // Fallback, wenn es ein unbekannter Typ ist aber klickbar scheint
                        navigationElement.click();
                    }
                } else {
                    console.log("Kleinanzeigen-Skript: Keine nächste Seite gefunden.");
                }
            }
        }
    });

    // HILFSFUNKTION FÜR :contains Pseudo-Klasse
    // Da :contains keine native CSS-Selektor-Funktion ist, müssen wir sie nachbilden.
    // Dies erweitert querySelector/querySelectorAll, um :contains zu verstehen.
    // Die 'i' Flag in :contains("Text" i) macht die Suche case-insensitive.
    (function() {
        // Sicherstellen, dass Element.prototype.matches vorhanden ist
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }

        const originalQuerySelector = Document.prototype.querySelector;
        const originalQuerySelectorAll = Document.prototype.querySelectorAll;

        const handleContains = (selector) => {
            // Regex angepasst, um die 'i' Flag korrekt zu verarbeiten
            const containsRegex = /:contains\(['"]([^'"]+)['"]\s*(i)?\)/g;
            let match;
            let modifiedSelector = selector;
            const textsToFind = [];

            while ((match = containsRegex.exec(selector)) !== null) {
                textsToFind.push({
                    text: match[1],
                    caseInsensitive: !!match[2] // True, wenn 'i' Flag vorhanden ist
                });
                // Ersetze :contains im Selektor durch ''
                modifiedSelector = modifiedSelector.replace(match[0], '');
            }
            return { modifiedSelector, textsToFind };
        };

        Document.prototype.querySelector = function(selector) {
            const { modifiedSelector, textsToFind } = handleContains(selector);
            // Wenn der Selector nach dem Entfernen von :contains leer ist, können wir ihn nicht direkt verwenden.
            // In diesem Fall suchen wir einfach alle Elemente, die den Text enthalten könnten.
            const elementsToSearch = modifiedSelector.trim() === '' ? this.querySelectorAll('*') : originalQuerySelectorAll.call(this, modifiedSelector);

            if (textsToFind.length > 0) {
                // Finden des ersten Elements, das den Text enthält
                for (let i = 0; i < elementsToSearch.length; i++) {
                    const element = elementsToSearch[i];
                    if (textsToFind.some(item => {
                        const content = element.textContent;
                        return item.caseInsensitive ? content.toLowerCase().includes(item.text.toLowerCase()) : content.includes(item.text);
                    })) {
                        return element;
                    }
                }
                return null; // Kein Element mit passendem Text gefunden
            }
            // Wenn keine :contains-Klausel, nutze den ursprünglichen Selektor direkt
            return originalQuerySelector.call(this, selector);
        };

        Document.prototype.querySelectorAll = function(selector) {
            const { modifiedSelector, textsToFind } = handleContains(selector);
            // Wenn der Selector nach dem Entfernen von :contains leer ist, suchen wir alle Elemente.
            const elements = modifiedSelector.trim() === '' ? originalQuerySelectorAll.call(this, '*') : originalQuerySelectorAll.call(this, modifiedSelector);

            if (textsToFind.length > 0) {
                return Array.from(elements).filter(element =>
                    textsToFind.some(item => {
                        const content = element.textContent;
                        return item.caseInsensitive ? content.toLowerCase().includes(item.text.toLowerCase()) : content.includes(item.text);
                    })
                );
            }
            // Wenn keine :contains-Klausel, nutze den ursprünglichen Selektor direkt
            return originalQuerySelectorAll.call(this, selector);
        };
    })();

    // --- Skript starten ---
    function init() {
        console.log("Kleinanzeigen-Skript: Initialisiere...");
        // Stelle sicher, dass der Button nur einmal erstellt wird
        if (!document.getElementById('element-picker-btn')) {
            pickerButton = document.createElement('button');
            pickerButton.id = 'element-picker-btn';
            pickerButton.textContent = 'TO LLM';
            pickerButton.title = 'Daten der aktuellen Seite erfassen (Kurz-Klick) / Kontinuierlich sammeln (Langklick)';
            document.body.appendChild(pickerButton);

            // Event Listener für den Button hinzufügen
            pickerButton.addEventListener('mousedown', handleButtonPress);
            // Zusätzlicher Listener auf das Dokument, um sicherzustellen, dass `handleButtonRelease` immer gefangen wird,
            // auch wenn der Mauszeiger den Button verlässt, bevor die Maustaste losgelassen wird.
            document.addEventListener('mouseup', handleButtonRelease); // Globaler Listener, kein 'once'
        } else {
            pickerButton = document.getElementById('element-picker-btn');
            console.log("Kleinanzeigen-Skript: Button existiert bereits, überspringe Erstellung.");
        }


        // Lade den gespeicherten Modus-Status
        isLockedMode = GM_getValue(STORAGE_KEY_LOCKED_MODE, false);
        if (isLockedMode) {
            // Re-aktiviere den Locked Mode beim Laden, falls er aktiv war
            console.log("Kleinanzeigen-Skript: Locked Mode wurde beim Laden re-aktiviert.");
            pickerButton.textContent = 'STOP'; // Text anpassen
            pickerButton.classList.add('locked'); // Visuell anzeigen
            allCollectedData = []; // Sicherstellen, dass die Daten von der letzten Session nicht übernommen werden
            processNewPage(); // Starte die Datensammlung für die aktuelle Seite
            observeDOMChanges(); // Observer re-aktivieren
            updateStatusDisplay();
        }
        console.log("Kleinanzeigen-Skript: Initialisierung abgeschlossen.");
    }

    // Sicherstellen, dass das Skript läuft, wenn das DOM bereit ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();