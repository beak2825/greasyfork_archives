// ==UserScript==
// @name         EA.com Pack Opener & Manager
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatisiert das Öffnen von Packs, das Senden von Spielern zum Verein und das Schnellverkaufen von Duplikaten unter 85 GES auf EA.com.
// @author       Your Name
// @match        https://www.ea.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544908/EAcom%20Pack%20Opener%20%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/544908/EAcom%20Pack%20Opener%20%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAutomationRunning = false;
    let automationTimeoutId = null; // Zum Speichern der Timeout-ID für das Stoppen

    // --- HILFSFUNKTION: Element finden und mit Verzögerung klicken ---
    async function findAndClick(selector, actionName = 'Element', delay = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`Klicke auf '${actionName}' (${selector})...`);
                    element.click();
                    resolve(true);
                } else {
                    console.warn(`'${actionName}'-Element nicht gefunden (${selector}).`);
                    resolve(false);
                }
            }, delay);
        });
    }

    // --- HILFSFUNKTION: Auf das Erscheinen eines bestimmten Elements warten ---
    async function waitForElement(selector, timeout = 10000, interval = 500) {
        const startTime = Date.now();
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    console.warn(`Timeout beim Warten auf Element: ${selector}`);
                    resolve(null);
                }
            }, interval);
        });
    }

    // --- HAUPT-AUTOMATISIERUNGSLOGIK ---
    async function startPackAutomation() {
        if (!isAutomationRunning) {
            console.log('Automatisierung gestoppt.');
            return;
        }

        console.log('Versuche, Pack zu öffnen...');

        // 1. "Pack öffnen"-Button finden und klicken
        // !!! WICHTIG: Ersetze '.your-open-pack-button-selector' durch den tatsächlichen Selektor für den "Pack öffnen"-Button.
        const openPackClicked = await findAndClick('.your-open-pack-button-selector', 'Pack öffnen Button', 2000);

        if (!openPackClicked) {
            console.log('Kein "Pack öffnen"-Button gefunden. Stoppe Automatisierung.');
            stopPackAutomation();
            return;
        }

        // 2. Auf das Laden der Pack-Öffnungs-Animation/Ergebnisse warten
        // !!! WICHTIG: Ersetze '.your-player-card-container-selector' durch einen Selektor, der den Container identifiziert,
        //                in dem neue Spielerkarten nach dem Öffnen eines Packs erscheinen.
        const playerCardContainer = await waitForElement('.your-player-card-container-selector', 15000); // Erhöhtes Timeout für Animationen

        if (!playerCardContainer) {
            console.warn('Spielerkarten-Container nach dem Öffnen des Packs nicht gefunden. Versuche es erneut oder stoppe.');
            // Erwäge einen Wiederholungsmechanismus oder stoppe je nach gewünschtem Verhalten
            automationTimeoutId = setTimeout(startPackAutomation, 5000); // Erneut versuchen nach einer Verzögerung
            return;
        }

        console.log('Spielerkarten geladen. Verarbeite Spieler...');

        // 3. Jeden im Pack gefundenen Spieler verarbeiten
        // !!! WICHTIG: Ersetze '.your-individual-player-card-selector' durch einen Selektor für jede einzelne Spielerkarte.
        const playerCards = playerCardContainer.querySelectorAll('.your-individual-player-card-selector');

        if (playerCards.length === 0) {
            console.log('Keine Spieler im Pack gefunden. Gehe zum nächsten Schritt oder stoppe.');
            // Dies könnte passieren, wenn ein Pack leer ist oder der Selektor falsch ist.
            // Fahre fort, um nach dem nächsten Pack zu suchen oder zu stoppen.
        }

        for (const playerCard of playerCards) {
            // !!! WICHTIG: Spieler-GES extrahieren und auf Duplikatsstatus prüfen
            // Dieser Teil hängt stark von der DOM-Struktur von EA.com ab.
            // Du musst den HTML-Code der Spielerkarte untersuchen, um diese Werte zu finden.

            const gesElement = playerCard.querySelector('.your-player-ges-selector'); // Beispiel: '.player-rating'
            const isDuplicateElement = playerCard.querySelector('.your-duplicate-indicator-selector'); // Beispiel: '.icon-duplicate'

            let playerGES = 0;
            if (gesElement) {
                playerGES = parseInt(gesElement.textContent.trim(), 10);
                console.log('Spieler GES:', playerGES);
            } else {
                console.warn('GES-Element des Spielers für eine Spielerkarte nicht gefunden.');
            }

            const isDuplicate = isDuplicateElement ? true : false; // Prüft, ob ein Duplikatsindikator-Element existiert
            console.log('Ist Duplikat:', isDuplicate);

            if (isDuplicate && playerGES < 85) {
                console.log(`Duplikatspieler (GES ${playerGES} < 85). Versuche Schnellverkauf.`);
                // !!! WICHTIG: Ersetze '.your-quick-sell-button-selector'
                await findAndClick('.your-quick-sell-button-selector', 'Schnellverkauf Button', 1000);
                // !!! WICHTIG: Wenn es eine Bestätigung für den Schnellverkauf gibt, musst du diese möglicherweise auch klicken.
                // await findAndClick('.your-quick-sell-confirm-button-selector', 'Schnellverkauf bestätigen', 1000);
            } else {
                console.log(`Spieler (GES ${playerGES}, Duplikat: ${isDuplicate}). Versuche, zum Verein zu senden.`);
                // !!! WICHTIG: Ersetze '.your-send-to-club-button-selector'
                await findAndClick('.your-send-to-club-button-selector', 'Zum Verein senden Button', 1000);
            }

            // Kurze Verzögerung zwischen der Verarbeitung von Spielern im selben Pack
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. Prüfen, ob weitere Packs verfügbar sind und fortfahren
        // !!! WICHTIG: Ersetze '.your-remaining-packs-indicator-selector' durch einen Selektor,
        //                der die Anzahl der verbleibenden Packs anzeigt oder eine "Keine Packs mehr"-Nachricht.
        // Dies ist ein Platzhalter. Eine robustere Prüfung würde das Auslesen einer numerischen Anzahl beinhalten.
        const remainingPacksElement = document.querySelector('.your-remaining-packs-indicator-selector');
        const noMorePacksMessage = document.querySelector('.your-no-more-packs-message-selector'); // z.B. '.empty-packs-message'

        if (remainingPacksElement && !noMorePacksMessage) {
            console.log('Weitere Packs scheinen verfügbar zu sein. Setze Automatisierung fort...');
            automationTimeoutId = setTimeout(startPackAutomation, 3000); // Warten, bevor das nächste Pack geöffnet wird
        } else {
            console.log('Keine Packs mehr gefunden oder Automatisierung gestoppt.');
            stopPackAutomation();
        }
    }

    function stopPackAutomation() {
        isAutomationRunning = false;
        if (automationTimeoutId) {
            clearTimeout(automationTimeoutId);
            automationTimeoutId = null;
        }
        console.log('Pack-Automatisierung gestoppt.');
        updateButtonState(); // Button-Text aktualisieren
    }

    function updateButtonState() {
        const button = document.getElementById('ea-custom-action-button');
        if (button) {
            button.textContent = isAutomationRunning ? 'Automation läuft... (Tippen zum Stoppen)' : 'Packs automatisch öffnen';
            button.style.backgroundColor = isAutomationRunning ? '#dc3545' : '#007bff'; // Rot, wenn läuft; Blau, wenn gestoppt
        }
    }

    // Funktion, die ausgeführt wird, wenn das DOM vollständig geladen ist
    function onDOMLoaded() {
        console.log('EA.com Customizer-Script geladen und läuft!');

        // --- Beispiel 1: Ein bestimmtes Element ausblenden (aus der vorherigen Version) ---
        const elementToHide = document.querySelector('.ea-news-banner'); // Beispiel: Ersetze mit tatsächlichem Selektor
        if (elementToHide) {
            elementToHide.style.display = 'none';
            console.log('Element ausgeblendet:', elementToHide);
        } else {
            console.log('Element zum Ausblenden nicht gefunden (Selektor: .ea-news-banner)');
        }

        // --- Den neuen benutzerdefinierten Button für die Pack-Automatisierung hinzufügen ---
        const customButton = document.createElement('button');
        customButton.id = 'ea-custom-action-button'; // Gib ihm eine ID für einfachen Zugriff
        updateButtonState(); // Setze den anfänglichen Text und die Farbe

        customButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        `;

        customButton.onmouseover = () => {
            customButton.style.backgroundColor = isAutomationRunning ? '#c82333' : '#0056b3';
        };
        customButton.onmouseout = () => {
            customButton.style.backgroundColor = isAutomationRunning ? '#dc3545' : '#007bff';
        };

        customButton.onclick = () => {
            // Die folgende Zeile wurde entfernt, da sie den unerwünschten Alert verursacht hat:
            // alert('Custom action performed! You can replace this with any JavaScript logic.');
            console.log('Custom button clicked!'); // Diese Konsole-Ausgabe bleibt zur Fehlerbehebung

            if (isAutomationRunning) {
                stopPackAutomation();
            } else {
                isAutomationRunning = true;
                updateButtonState();
                startPackAutomation();
            }
        };

        document.body.appendChild(customButton);
        console.log('Benutzerdefinierter Pack-Automatisierungs-Button zur Seite hinzugefügt.');
    }

    // Prüfen, ob das Dokument bereits geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMLoaded);
    } else {
        onDOMLoaded();
    }
})();