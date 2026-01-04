// ==UserScript==
// @name         Leitstellenspiel Patient Entlassen
// @namespace    http://tampermonkey.net/
// @version      0.74
// @description  Fügt einen Button hinzu, der Sprechwünsche für FMS 5-Fahrzeuge sammelt
// @author       Gemini
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537616/Leitstellenspiel%20Patient%20Entlassen.user.js
// @updateURL https://update.greasyfork.org/scripts/537616/Leitstellenspiel%20Patient%20Entlassen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('LSS Patient Entlassen Skript geladen (Version 0.74).');

    let buttonSetupCompleted = false; // Flag, um sicherzustellen, dass der Button nur einmal hinzugefügt wird
    let styleTagAdded = false; // Flag, um sicherzustellen, dass der Style-Tag nur einmal hinzugefügt wird

    /**
     * Formatiert eine Anzahl von Sekunden in das MM:SS Format.
     * @param {number} totalSeconds Die Gesamtzahl der Sekunden.
     * @returns {string} Die formatierte Zeit als MM:SS.
     */
    function formatSecondsToMMSS(totalSeconds) {
        if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
            return 'N/A';
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Konvertiert eine Zeit im MM:SS Format in Sekunden.
     * @param {string} mmssString Die Zeit als MM:SS String.
     * @returns {number|null} Die Zeit in Sekunden oder null, wenn das Format ungültig ist.
     */
    function parseMMSS(mmssString) {
        const parts = mmssString.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                return minutes * 60 + seconds;
            }
        }
        return null;
    }

    /**
     * Diese Funktion verarbeitet die Tabelle, sobald der Button geklickt wird.
     * Sie sammelt die Patient-Entlassen-Links, gruppiert sie nach Benutzer und zeigt eine Bestätigungsübersicht an.
     * Die Prüfung der Fahrzeugseite erfolgt nun VOR der endgültigen Bestätigung zum Entlassen.
     */
    async function processPatientRelease() {
        const table = document.getElementById('mission_vehicle_at_mission');

        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            const collectedLinksByUser = {}; // Objekt zum Sammeln der Links, gruppiert nach Benutzer
            const allUniqueOwners = new Set(); // Set zum Sammeln aller einzigartigen Besitzer

            rows.forEach((row, index) => {
                const firstCell = row.querySelector('td:nth-child(1)'); // Erste Spalte (FMS-Status)
                if (firstCell) {
                    const spanWithExactClasses = firstCell.querySelector('span.building_list_fms.building_list_fms_5');

                    if (spanWithExactClasses) {
                        const vehicleLink = row.querySelector('td:nth-child(2) a'); // Link zum Fahrzeug
                        const ownerCell = row.querySelector('td:nth-child(5)'); // Die gesamte 5. Zelle (Besitzer)
                        let ownerLink = null;
                        if (ownerCell) {
                            ownerLink = ownerCell.querySelector('a');
                        }

                        if (vehicleLink && vehicleLink.href) {
                            const vehiclePageUrl = vehicleLink.href;
                            let ownerName = 'Unbekannter Benutzer';
                            let ownerProfileUrl = '#';

                            if (ownerLink && ownerLink.textContent) {
                                ownerName = ownerLink.textContent.trim();
                                ownerProfileUrl = ownerLink.href;
                            }
                            allUniqueOwners.add(ownerName); // Besitzer zu den einzigartigen Besitzern hinzufügen

                            const match = vehiclePageUrl.match(/\/vehicles\/(\d+)/);
                            if (match && match[1]) {
                                const vehicleId = match[1];
                                const patientReleaseLink = `https://www.leitstellenspiel.de/vehicles/${vehicleId}/patient/-1`;

                                if (!collectedLinksByUser[ownerName]) {
                                    collectedLinksByUser[ownerName] = {
                                        count: 0,
                                        links: [],
                                        profileUrl: ownerProfileUrl
                                    };
                                }
                                collectedLinksByUser[ownerName].count++;
                                collectedLinksByUser[ownerName].links.push({
                                    patientRelease: patientReleaseLink,
                                    vehiclePage: vehiclePageUrl
                                });

                            }
                        }
                    }
                }
            });

            const userNames = Object.keys(collectedLinksByUser);
            let totalLinksToProcess = 0;
            userNames.forEach(userName => {
                totalLinksToProcess += collectedLinksByUser[userName].links.length;
            });

            if (totalLinksToProcess === 0) {
                showCustomModal('Keine passenden Sprechwünsche (FMS 5) zum Entlassen gefunden.');
                return; // Skript beenden, wenn keine Links gefunden wurden
            }

            // Vorabprüfung der Fahrzeugseiten und ELW-SEG-Status
            let preCheckSuccessPages = 0;
            let preCheckFailedPages = 0;
            let preCheckFoundButtons = 0;
            let preCheckDetails = {}; // Speichert die Ergebnisse der Vorabprüfung pro Benutzer

            // Initialisiere preCheckDetails für alle einzigartigen Besitzer, die bereits aus FMS5-Fahrzeugen gesammelt wurden
            allUniqueOwners.forEach(ownerName => {
                preCheckDetails[ownerName] = {
                    totalFMS5: collectedLinksByUser[ownerName] ? collectedLinksByUser[ownerName].links.length : 0,
                    successPage: 0,
                    failPage: 0,
                    foundButton: 0,
                    hasElwSegOnRoute: false,
                    elwSegArrivalTime: null,
                    hasElwSegOnScene: false
                };
            });


            showCustomModal(`Fahrzeugseiten und ELW-SEG-Status werden im Hintergrund geprüft...`, true);

            // --- ELW-SEG Prüfung (Anfahrt - direkt auf der aktuellen Seite) ---
            const drivingTable = document.getElementById('mission_vehicle_driving');
            if (drivingTable) {
                const drivingRows = drivingTable.querySelectorAll('tbody tr');
                drivingRows.forEach(row => {
                    const vehicleLink = row.querySelector('a[vehicle_type_id="59"]'); // ELW-SEG (Fahrzeug-ID 59)
                    if (vehicleLink) {
                        const ownerLink = row.querySelector('a[href*="/profile/"]'); // Suche nach einem Link zum Profil
                        if (ownerLink && ownerLink.textContent) {
                            const ownerName = ownerLink.textContent.trim();

                            const vehicleIdMatch = vehicleLink.href.match(/\/vehicles\/(\d+)/);
                            let arrivalTime = null;
                            if (vehicleIdMatch && vehicleIdMatch[1]) {
                                const vehicleId = vehicleIdMatch[1];
                                const arrivalTimeCell = row.querySelector(`#vehicle_drive_${vehicleId}`);
                                if (arrivalTimeCell) {
                                    const displayedTime = arrivalTimeCell.textContent.trim();
                                    arrivalTime = parseMMSS(displayedTime);
                                    if (arrivalTime === null && arrivalTimeCell.hasAttribute('sortvalue')) {
                                        const sortValueTime = parseInt(arrivalTimeCell.getAttribute('sortvalue'), 10);
                                        if (!isNaN(sortValueTime)) {
                                            arrivalTime = sortValueTime;
                                        }
                                    }
                                }
                            }

                            allUniqueOwners.add(ownerName);
                            if (!preCheckDetails[ownerName]) {
                                preCheckDetails[ownerName] = {
                                    totalFMS5: 0, successPage: 0, failPage: 0, foundButton: 0,
                                    hasElwSegOnRoute: false, elwSegArrivalTime: null, hasElwSegOnScene: false
                                };
                            }
                            preCheckDetails[ownerName].hasElwSegOnRoute = true;
                            preCheckDetails[ownerName].elwSegArrivalTime = arrivalTime;
                        }
                    }
                });
            }

            // --- ELW-SEG Prüfung (Vor Ort, aktuelle Missionsseite) ---
            const atMissionTable = document.getElementById('mission_vehicle_at_mission');
            if (atMissionTable) {
                const atMissionRows = atMissionTable.querySelectorAll('tbody tr');
                atMissionRows.forEach(row => {
                    const vehicleLink = row.querySelector('a[vehicle_type_id="59"]'); // ELW-SEG (Fahrzeug-ID 59)
                    if (vehicleLink) {
                        const ownerCell = row.querySelector('td:nth-child(5) a'); // Besitzer in Spalte 5
                        if (ownerCell && ownerCell.textContent) {
                            const ownerName = ownerCell.textContent.trim();
                            allUniqueOwners.add(ownerName);
                            if (!preCheckDetails[ownerName]) {
                                preCheckDetails[ownerName] = {
                                    totalFMS5: 0, successPage: 0, failPage: 0, foundButton: 0,
                                    hasElwSegOnRoute: false, elwSegArrivalTime: null, hasElwSegOnScene: false
                                };
                            }
                            preCheckDetails[ownerName].hasElwSegOnScene = true;
                        }
                    }
                });
            }


            // Schleife zur Prüfung der FMS 5 Fahrzeugseiten (Patient entlassen Link)
            try {
                const fms5UserNames = Object.keys(collectedLinksByUser);
                for (const userName of fms5UserNames) {
                    const userData = collectedLinksByUser[userName];
                    for (const linkData of userData.links) {
                        await new Promise(resolve => {
                            GM.xmlHttpRequest({
                                method: "GET",
                                url: linkData.vehiclePage,
                                onload: function(response) {
                                    if (response.status === 200) {
                                        const htmlText = response.responseText;
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(htmlText, 'text/html');

                                        const patientReleaseButtonSpecific = doc.querySelector('a[href*="/patient/-1"][class*="btn"][class*="btn-sm"][class*="btn-default"]');
                                        if (patientReleaseButtonSpecific) {
                                            preCheckFoundButtons++;
                                            if (preCheckDetails[userName]) {
                                                preCheckDetails[userName].foundButton++;
                                            }
                                        }
                                        if (preCheckDetails[userName]) {
                                            preCheckSuccessPages++;
                                            preCheckDetails[userName].successPage++;
                                        }
                                    } else {
                                        console.error(`Fehler beim Abrufen der Fahrzeugseite ${linkData.vehiclePage}: Status ${response.status} - ${response.statusText}`);
                                        if (preCheckDetails[userName]) {
                                            preCheckFailedPages++;
                                            preCheckDetails[userName].failPage++;
                                        }
                                    }
                                    resolve();
                                },
                                onerror: function(error) {
                                    console.error(`Fehler beim Aufruf oder Parsen der Fahrzeugseite ${linkData.vehiclePage}:`, error);
                                    if (preCheckDetails[userName]) {
                                        preCheckFailedPages++;
                                        preCheckDetails[userName].failPage++;
                                    }
                                    resolve();
                                }
                            });
                        });
                    }
                }
            } catch (e) {
                console.error(`Ein Fehler ist während der Vorabprüfung aufgetreten: ${e.message}.`);
                showCustomModal(`Ein Fehler ist während der Vorabprüfung aufgetreten: ${e.message}.`);
                return;
            } finally {
                const currentModal = document.getElementById('customLSSModal');
                if (currentModal) {
                    currentModal.remove();
                }
            }


            const getSprechwunschText = (count) => count === 1 ? 'Sprechwunsch' : 'Sprechwünsche';

            let confirmationMessage = `Es wurden ${totalLinksToProcess} ${getSprechwunschText(totalLinksToProcess)} (FMS 5) gefunden.\n\n`;
            confirmationMessage += `--- Vorabprüfung der Fahrzeugseiten ---\n`;
            confirmationMessage += `Fahrzeuge erfolgreich geprüft: ${preCheckSuccessPages}\n`;
            if (preCheckFailedPages > 0) {
                confirmationMessage += `Seiten fehlgeschlagen: ${preCheckFailedPages}\n`;
            }
            confirmationMessage += `Bereit zum Entlassen: ${preCheckFoundButtons} ${getSprechwunschText(preCheckFoundButtons)}\n\n`;

            let hasElwSegFoundOverall = false;
            Array.from(allUniqueOwners).sort((a,b) => a.localeCompare(b)).forEach(userName => {
                const details = preCheckDetails[userName];
                if (!details) {
                    return;
                }

                const totalFMS5Count = details.totalFMS5;
                const entlassbarCount = details.foundButton;
                const failedPagesCount = details.failPage;

                let userSummaryLine = `@${userName}: `;

                if (totalFMS5Count > 0) {
                    userSummaryLine += `${totalFMS5Count} ${getSprechwunschText(totalFMS5Count)}`;
                    userSummaryLine += ` (${entlassbarCount} entlassbar)`; // Anpassung der Ausgabe
                } else {
                    userSummaryLine += `Keine FMS 5 Sprechwünsche`;
                }


                // ELW-SEG Status hinzufügen mit Hervorhebung, NUR wenn gefunden
                if (details.hasElwSegOnRoute || details.hasElwSegOnScene) {
                    hasElwSegFoundOverall = true;
                    let elwSegDisplayContent = '';
                    if (details.hasElwSegOnRoute && details.hasElwSegOnScene) {
                        elwSegDisplayContent = `ELW-SEG auf Anfahrt`;
                        if (details.elwSegArrivalTime !== null) {
                            elwSegDisplayContent += ` (${formatSecondsToMMSS(details.elwSegArrivalTime)})`;
                        }
                        elwSegDisplayContent += `, Vor Ort`;
                        userSummaryLine += ` (<span class="blink-red-bold">${elwSegDisplayContent}</span>)`;
                    } else if (details.hasElwSegOnRoute) {
                        elwSegDisplayContent = `ELW-SEG auf Anfahrt`;
                        if (details.elwSegArrivalTime !== null) {
                            elwSegDisplayContent += ` (${formatSecondsToMMSS(details.elwSegArrivalTime)})`;
                        }
                        userSummaryLine += ` (<span class="blink-red-bold">${elwSegDisplayContent}</span>)`;
                    } else if (details.hasElwSegOnScene) {
                        elwSegDisplayContent = `ELW-SEG: Vor Ort`;
                        userSummaryLine += ` (<span class="blink-red-bold">${elwSegDisplayContent}</span>)`;
                    }
                }


                if (failedPagesCount > 0) {
                    userSummaryLine += ` (${failedPagesCount} Seitenprüfung fehlgeschlagen)`;
                }
                confirmationMessage += `${userSummaryLine}\n`;
            });

            if (preCheckFoundButtons > 0) {
                // NEU: Textänderung
                confirmationMessage += `\nSoll die Entlassung der Patienten gestartet werden?`;
            }

            // Funktion, die die tatsächliche Entlassung durchführt
            const performReleaseActions = async () => {
                console.log(`Starte Entlassung von ${totalLinksToProcess} FMS 5 Patienten.`);
                let processedReleaseLinks = 0;
                let failedReleaseLinks = 0;
                let finalProcessingDetails = {};

                userNames.forEach(userName => {
                    finalProcessingDetails[userName] = { successRelease: 0, failRelease: 0, profileUrl: collectedLinksByUser[userName].profileUrl };
                });

                showCustomModal(`Verarbeite ${totalLinksToProcess} ${getSprechwunschText(totalLinksToProcess)} im Hintergrund...`, true);

                try {
                    for (const userName of userNames) {
                        const userData = collectedLinksByUser[userName];
                        for (const linkData of userData.links) {
                            try {
                                await fetch(linkData.patientRelease, { method: 'GET', mode: 'no-cors' });
                                console.log(`Entlasse Patient über Link: ${linkData.patientRelease}`);
                                processedReleaseLinks++;
                                if (finalProcessingDetails[userName]) {
                                    finalProcessingDetails[userName].successRelease++;
                                }
                            } catch (error) {
                                console.error(`Fehler beim Aufruf von Patient entlassen Link ${linkData.patientRelease}:`, error);
                                failedReleaseLinks++;
                                if (finalProcessingDetails[userName]) {
                                    finalProcessingDetails[userName].failRelease++;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Ein unerwarteter Fehler ist während der Entlassung aufgetreten: ${e.message}.`);
                    showCustomModal(`Ein unerwarteter Fehler ist aufgetreten: ${e.message}. Bitte prüfen Sie die Konsole für Details.`);
                    return;
                } finally {
                    const currentModal = document.getElementById('customLSSModal');
                    if (currentModal) {
                        currentModal.remove();
                    }
                }

                let summaryMessage = `Verarbeitung abgeschlossen:\n\n`;
                summaryMessage += `Gesamt "Patient entlassen" Links verarbeitet: ${processedReleaseLinks}\n`;
                if (failedReleaseLinks > 0) {
                    summaryMessage += `Fehlgeschlagen "Patient entlassen" Links: ${failedReleaseLinks}\n`;
                }
                summaryMessage += `\n--- Ergebnisse der Entlassung ---\n`;

                userNames.forEach(userName => {
                    const details = finalProcessingDetails[userName];
                    const userSummaryText = getSprechwunschText(details.successRelease);
                    summaryMessage += `${details.successRelease} erfolgreich ${userSummaryText} von ${userName}`;
                    if (details.failRelease > 0) {
                        summaryMessage += `, ${details.failRelease} fehlgeschlagen`;
                    }
                    summaryMessage += ` (Profil: ${details.profileUrl})\n`;
                });

                showCustomModal(summaryMessage);
            };

            // Der Callback für das ERSTE Bestätigungsmodal
            const firstModalConfirmCallback = preCheckFoundButtons > 0 ? async () => {
                if (hasElwSegFoundOverall) {
                    console.log('ELW-SEG gefunden: Zeige zusätzliche Warnung.');
                    // Wenn ELW-SEG gefunden wurde, zeige die Warnung
                    let elwSegDetailsFormatted = [];
                    Array.from(allUniqueOwners).sort((a,b) => a.localeCompare(b)).forEach(userName => {
                        const details = preCheckDetails[userName];
                        if (details && (details.hasElwSegOnRoute || details.hasElwSegOnScene)) {
                            let statusParts = [];
                            if (details.hasElwSegOnRoute) {
                                let timePart = details.elwSegArrivalTime !== null ? ` (${formatSecondsToMMSS(details.elwSegArrivalTime)})` : '';
                                statusParts.push(`auf Anfahrt${timePart}`);
                            }
                            if (details.hasElwSegOnScene) {
                                statusParts.push('vor Ort');
                            }
                            elwSegDetailsFormatted.push(`des Benutzers ${userName} ${statusParts.join(' / ')}`);
                        }
                    });

                    let elwSegWarningMessage = `<b>Achtung:</b> `;
                    if (elwSegDetailsFormatted.length > 0) {
                        elwSegWarningMessage += `Es wurde${elwSegDetailsFormatted.length > 1 ? 'n' : ' ein'} ELW-SEG Fahrzeug${elwSegDetailsFormatted.length > 1 ? 'e' : ''} `;
                        elwSegWarningMessage += elwSegDetailsFormatted.join(' und ') + ` gefunden.`;
                    } else {
                        elwSegWarningMessage += `Es wurden ELW-SEG Fahrzeuge gefunden.`; // Fallback, sollte nicht erreicht werden
                    }
                    elwSegWarningMessage += `<br><br>Sollen die Patienten WIRKLICH entlassen werden?`;

                    showCustomModal(elwSegWarningMessage, false, performReleaseActions, 'Ja, trotzdem entlassen', 'Abbrechen');
                } else {
                    console.log('Kein ELW-SEG gefunden: Fahre direkt mit Entlassung fort.');
                    // Wenn kein ELW-SEG gefunden wurde, fahre direkt mit der Entlassung fort
                    await performReleaseActions();
                }
            } : null;

            // Zeige das erste Bestätigungs-Modal mit den Ergebnissen der Vorabprüfung
            // NEU: Button-Text für das erste Modal angepasst
            showCustomModal(confirmationMessage, false, firstModalConfirmCallback, 'Entlassung starten');

        } else {
            console.warn('Tabelle "mission_vehicle_at_mission" nicht gefunden. Kann Sprechwünsche nicht verarbeiten.');
            showCustomModal('Die Tabelle "mission_vehicle_at_mission" konnte nicht gefunden werden. Bitte stellen Sie sicher, dass Sie sich auf einer Missionsseite befinden und die Tabelle geladen ist.');
        }
    }

    /**
     * Zeigt ein benutzerdefiniertes modales Fenster anstelle von alert().
     * @param {string} message Die anzuzeigende Nachricht (kann HTML enthalten).
     * @param {boolean} [showLoadingSpinner=false] Ob ein Lade-Spinner angezeigt werden soll.
     * @param {function} [confirmCallback=null] Callback-Funktion, die beim Klick auf den Bestätigungsbutton ausgeführt wird.
     * @param {string} [confirmButtonText='OK'] Text für den Bestätigungsbutton.
     * @param {string} [cancelButtonText='Schließen'] Text für den Abbrechen-Button.
     */
    function showCustomModal(message, showLoadingSpinner = false, confirmCallback = null, confirmButtonText = 'OK', cancelButtonText = 'Schließen') {
        const existingModal = document.getElementById('customLSSModal');
        if (existingModal) {
            existingModal.remove();
        }

        // CSS für Blinken und Fett einmalig hinzufügen
        if (!styleTagAdded) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes blink-red {
                    0%, 100% { color: red; }
                    50% { color: inherit; }
                }
                .blink-red-bold {
                    animation: blink-red 1s infinite;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
            styleTagAdded = true;
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'customLSSModal';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
            font-family: 'Inter', sans-serif;
            color: #333;
            position: relative;
            min-width: 300px;
            text-align: center;
        `;

        const messageParagraph = document.createElement('p');
        messageParagraph.innerHTML = message; // innerHTML statt textContent, um HTML-Tags zu erlauben
        messageParagraph.style.cssText = `
            white-space: pre-wrap;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.5;
            text-align: left;
        `;

        modalContent.appendChild(messageParagraph);

        if (showLoadingSpinner) {
            const spinner = document.createElement('div');
            spinner.style.cssText = `
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px auto;
            `;
            modalContent.appendChild(spinner);
        } else {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 10px;
            `;

            const closeButton = document.createElement('button');
            closeButton.textContent = cancelButtonText; // Text für Abbrechen-Button anpassbar
            closeButton.style.cssText = `
                background-color: #6c757d;
                color: white;
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            `;
            closeButton.onmouseover = function() { this.style.backgroundColor = '#5a6268'; };
            closeButton.onmouseout = function() { this.style.backgroundColor = '#6c757d'; };
            closeButton.onclick = () => modalOverlay.remove();
            buttonContainer.appendChild(closeButton);

            if (confirmCallback) {
                const confirmButton = document.createElement('button');
                confirmButton.textContent = confirmButtonText; // Text für Bestätigungsbutton anpassbar
                confirmButton.style.cssText = `
                    background-color: #28a745;
                    color: white;
                    padding: 8px 15px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                `;
                confirmButton.onmouseover = function() { this.style.backgroundColor = '#218838'; };
                confirmButton.onmouseout = function() { this.style.backgroundColor = '#28a745'; };
                confirmButton.onclick = () => {
                    modalOverlay.remove();
                    confirmCallback();
                };
                buttonContainer.appendChild(confirmButton);
            }
            modalContent.appendChild(buttonContainer);
        }

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }


    /**
     * Erstellt und platziert den Button auf der Seite.
     * Diese Funktion wird aufgerufen, sobald das Zielelement erkannt wird.
     */
    function setupButton() {
        if (buttonSetupCompleted) {
            return;
        }

        const targetHeading = document.getElementById('vehicles-at-mission-heading');
        const targetTable = document.getElementById('mission_vehicle_at_mission');

        let parentElementForButton = null;
        if (targetHeading && targetHeading.parentNode) {
            parentElementForButton = targetHeading;
        } else if (targetTable && targetTable.parentNode) {
            parentElementForButton = targetTable.parentNode; // Insert before table
        } else if (document.body) {
            parentElementForButton = document.body;
        }

        if (!parentElementForButton) {
            console.error('Kritischer Fehler: Kein passendes Zielelement für Button gefunden. Kann Button nicht hinzufügen.');
            return;
        }

        // --- Prüfung auf FMS 5 Fahrzeuge vor dem Anzeigen des Buttons ---
        let foundFMS5Vehicles = false;
        if (targetTable) {
            const rows = targetTable.querySelectorAll('tbody tr');
            for (const row of rows) {
                const firstCell = row.querySelector('td:nth-child(1)');
                if (firstCell && firstCell.querySelector('span.building_list_fms.building_list_fms_5')) {
                    foundFMS5Vehicles = true;
                    break;
                }
            }
        }

        if (foundFMS5Vehicles) {
            const button = document.createElement('button');
            button.id = 'sprechwuenscheEntlassenButton';
            button.textContent = 'Sprechwünsche gesammelt entlassen';
            button.style.cssText = `
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 0;
                box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.3s ease;
                display: block;
                width: fit-content;
                font-family: 'Inter', sans-serif;
            `;
            button.onmouseover = function() { this.style.backgroundColor = '#45a049'; };
            button.onmouseout = function() { this.style.backgroundColor = '#4CAF50'; };

            button.addEventListener('click', processPatientRelease);

            if (parentElementForButton === targetHeading) {
                targetHeading.insertAdjacentElement('afterend', button);
                console.log('Button "Sprechwünsche gesammelt entlassen" erfolgreich unter "vehicles-at-mission-heading" eingefügt.');
            } else if (parentElementForButton === targetTable.parentNode) {
                targetTable.parentNode.insertBefore(button, targetTable);
                console.log('Button als Fallback erfolgreich vor der Tabelle "mission_vehicle_at-mission" eingefügt.');
            } else if (parentElementForButton === document.body) {
                document.body.appendChild(button);
                console.log('Button als letzten Fallback erfolgreich am Ende des Body eingefügt.');
            }
            buttonSetupCompleted = true;
        } else {
            console.log('Keine Fahrzeuge mit FMS Status 5 gefunden. Button "Sprechwünsche gesammelt entlassen" wird nicht angezeigt.');
        }
    }

    // MutationObserver, um auf das Erscheinen des Zielelements (vehicles-at-mission-heading oder mission_vehicle_at_mission) zu warten
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        if (buttonSetupCompleted) {
            observerInstance.disconnect();
            return;
        }

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.id === 'vehicles-at-mission-heading' || node.querySelector('#vehicles-at-mission-heading') ||
                            node.id === 'mission_vehicle_at_mission' || node.querySelector('#mission_vehicle_at_mission')) {
                            setupButton();
                            if (buttonSetupCompleted) {
                                observerInstance.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        }
    });

    // Starte die Beobachtung des DOM, sobald das Skript geladen ist.
    const initialHeading = document.getElementById('vehicles-at-mission-heading');
    const initialTable = document.getElementById('mission_vehicle_at_mission');

    if (initialHeading || initialTable) {
        setupButton();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (!buttonSetupCompleted) {
                if (document.body instanceof Node) {
                    observer.observe(document.body, { childList: true, subtree: true });
                } else {
                    console.error('Kritischer Fehler: document.body ist auch nach DOMContentLoaded kein Node. Kann Observer nicht starten.');
                }
            }
        });
    }

    // Fallback-Check nach window.load, falls der Observer etwas verpasst hat
    window.addEventListener('load', () => {
        if (!buttonSetupCompleted) {
            setupButton();
        }
    });

})();
