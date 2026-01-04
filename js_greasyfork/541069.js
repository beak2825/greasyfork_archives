// ==UserScript==
// @name         Verbandsrückmeldung und Nächster Einsatz (Version 0.8 + Anpassungen)
// @namespace    http://tampermonkey.net/
// @version      0.8.4
// @description  Fügt einen Button hinzu, der Verbandsrückmeldung sendet und zum nächsten Einsatz navigiert. Jetzt mit "✉️" für Absenden und Warnung bei leerem Feld.
// @author       Masklin
// @match        *://www.leitstellenspiel.de/missions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541069/Verbandsr%C3%BCckmeldung%20und%20N%C3%A4chster%20Einsatz%20%28Version%2008%20%2B%20Anpassungen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541069/Verbandsr%C3%BCckmeldung%20und%20N%C3%A4chster%20Einsatz%20%28Version%2008%20%2B%20Anpassungen%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomButton() {
        // --- Elementfindung ---
        const replyContentInput = document.getElementById('mission_reply_content');
        const originalSubmitButton = document.querySelector('#new_mission_reply button[type="submit"]');

        if (!replyContentInput || !originalSubmitButton) {
            console.error("Fehler: Benötigte Formularelemente (Input-Feld oder Absenden-Button) nicht gefunden. Skript wird beendet.");
            return;
        }

        // Finde das Eltern-Div .input-group-addon, das den originalen "Absenden"-Button enthält.
        const inputGroupAddon = originalSubmitButton.closest('.input-group-addon');
        if (!inputGroupAddon) {
            console.error("Fehler: Das 'input-group-addon' für den 'Absenden'-Button wurde nicht gefunden. Skript wird beendet.");
            return;
        }

        // Das ist das <div class="input-group ..."> (für die Platzierung der Warnmeldung)
        const inputGroupDiv = inputGroupAddon.parentNode;


        // --- SCHRITT 1: Funktion zum Anzeigen einer Warnmeldung ---
        function showWarning(message) {
            const existingWarning = document.getElementById('missionReplyWarning');
            if (existingWarning) {
                existingWarning.remove();
            }

            const warningDiv = document.createElement('div');
            warningDiv.id = 'missionReplyWarning';
            warningDiv.className = 'alert alert-warning'; // Bootstrap-Warnungsstil
            warningDiv.style.marginTop = '10px';
            warningDiv.textContent = 'Achtung: ' + message;

            if (inputGroupDiv && inputGroupDiv.parentNode) {
                inputGroupDiv.parentNode.insertBefore(warningDiv, inputGroupDiv.nextSibling);
            } else {
                console.error("Warnmeldung konnte nicht platziert werden, da Parent der Input-Gruppe nicht gefunden wurde.");
            }

            setTimeout(() => {
                if (warningDiv.parentNode) {
                    warningDiv.remove();
                }
            }, 3000);
        }

        // --- SCHRITT 2: Erstelle einen internen Flex-Container für die Buttons innerhalb des inputGroupAddon ---
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.alignItems = 'stretch';
        buttonWrapper.style.justifyContent = 'flex-end';
        buttonWrapper.style.height = '100%';
        buttonWrapper.style.width = '100%';
        buttonWrapper.style.padding = '0';


        // --- SCHRITT 3: Verschiebe den originalen "Absenden"-Button in den neuen Wrapper ---
        inputGroupAddon.removeChild(originalSubmitButton);

        buttonWrapper.appendChild(originalSubmitButton);

        // Sicherstellen, dass der Original-Button keine 'pull-right' Klasse hat
        originalSubmitButton.classList.remove('pull-right');

        // === ANPASSUNG: TEXT DES ABSENDEN-BUTTONS HIER ÄNDERN ===
        originalSubmitButton.textContent = '✉️'; // Setzt den Text auf das Emoji

        // Stil-Anpassung für visuelle Trennung
        originalSubmitButton.style.background = 'rgba(255, 255, 255, 0.2)';
        originalSubmitButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        originalSubmitButton.style.color = 'white';
        originalSubmitButton.style.padding = '6px 12px';
        originalSubmitButton.style.borderRadius = '4px';


        // --- SCHRITT 4: Erstelle den neuen "Nächster"-Button ---
        const customButton = document.createElement('button');
        customButton.textContent = '✉️ ➔';
        customButton.className = 'btn btn-success';
        customButton.style.background = 'rgba(255, 255, 255, 0.2)';
        customButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        customButton.style.color = 'white';
        customButton.style.padding = '6px 12px';
        customButton.style.marginLeft = '5px';
        customButton.style.borderRadius = '4px';
        customButton.type = 'button';


        // --- SCHRITT 5: Füge den neuen Button dem Wrapper hinzu ---
        buttonWrapper.appendChild(customButton);

        // --- SCHRITT 6: Füge den Wrapper in das inputGroupAddon ein ---
        inputGroupAddon.appendChild(buttonWrapper);


        // --- SCHRITT 7: Event Listener für den neuen Button ---
        customButton.addEventListener('click', function(event) {
            event.preventDefault();

            console.log("------------------------------------------");
            console.log("Aktion: Eigener Button 'Nächster' wurde geklickt.");

            if (replyContentInput.value.trim() === "") {
                showWarning("Nichts geschrieben! Bitte gib eine Rückmeldung ein.");
                console.log("Aktion abgebrochen: Rückmeldungsfeld ist leer.");
                return;
            }

            console.log("Info: Rückmeldungsfeld hat Inhalt: '" + replyContentInput.value.trim() + "'.");
            console.log("Info: 'Absenden'-Button für Verbandsrückmeldung gefunden. Klicke...");
            originalSubmitButton.click();

            // --- NEUER TEIL: MutationObserver für den "Nächster Einsatz"-Button ---
            console.log("Info: Starte Überwachung für 'Nächster Einsatz'-Button...");

            const targetNode = document.body; // Beobachte den gesamten Body auf Änderungen
            const config = { childList: true, subtree: true }; // Änderungen an Kindelementen und deren Unterbäumen

            let observer = null; // Observer-Variable deklarieren, um sie später zu stoppen

            const callback = function(mutationsList, currentObserver) {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const nextMissionBtn = document.getElementById('mission_next_mission_btn');
                        if (nextMissionBtn) {
                            console.log("Info: 'Nächster Einsatz'-Button gefunden (durch Observer). Klicke...");
                            nextMissionBtn.click();
                            currentObserver.disconnect(); // Observer beenden, sobald der Button gefunden wurde
                            clearTimeout(observerTimeout); // Fallback-Timeout löschen
                            console.log("------------------------------------------");
                            return; // Callback beenden
                        }
                    }
                }
            };

            observer = new MutationObserver(callback);
            observer.observe(targetNode, config);

            // Fallback-Timeout, falls der Button nach X Sekunden nicht gefunden wird (z.B. bei einem unerwarteten Fehler)
            const observerTimeout = setTimeout(() => {
                if (observer) {
                    observer.disconnect();
                    console.warn("Warnung: MutationObserver nach 10 Sekunden abgelaufen. 'Nächster Einsatz'-Button nicht gefunden oder Ladezeit zu lang.");
                    console.log("------------------------------------------");
                }
            }, 10000); // 10 Sekunden Timeout
            // --- ENDE NEUER TEIL ---
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCustomButton);
    } else {
        addCustomButton();
    }
})();