// ==UserScript==
// @name         LSS Fahrzeug verfolgen
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Zentriert die Kamera fest auf ein Fahrzeug
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494228/LSS%20Fahrzeug%20verfolgen.user.js
// @updateURL https://update.greasyfork.org/scripts/494228/LSS%20Fahrzeug%20verfolgen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Interval-Objekt für wiederholte Klicks auf den "vehicle_search" Button
    let intervalId = null;

    // Funktion zum Zentrieren der Karte auf ein Fahrzeug
    function centerOnVehicle(vehicleButton) {
        const vehicleId = vehicleButton.getAttribute('vehicle_id');
        const vehicleSearchButton = vehicleButton;

        //console.log('Zentriere Karte auf Fahrzeug mit ID:', vehicleId);

        // Klick auf den "vehicle_search" Button, um die Karte zu zentrieren
        vehicleSearchButton.click();

        // Starte Interval für wiederholte Klicks auf den "vehicle_search" Button
        intervalId = setInterval(() => {
            //console.log('Wiederhole Klick auf Fahrzeug mit ID:', vehicleId);
            vehicleSearchButton.click();
        }, 200);
    }

    // Funktion zum Hinzufügen des "Zentrieren"-Buttons neben den Fahrzeugen
    function addCenterButtons() {
        // Finde alle Fahrzeug-Buttons
        const vehicleButtons = document.querySelectorAll('.vehicle_search');
        vehicleButtons.forEach(vehicleButton => {
            // Überprüfe, ob bereits ein Event-Listener für Doppelklick hinzugefügt wurde
            if (!vehicleButton.dataset.dblclick) {
                // Füge den Event-Listener für Doppelklick hinzu
                vehicleButton.addEventListener('dblclick', (e) => {
                    // Verhindere, dass der Doppelklick die Seite unterbricht
                    e.stopPropagation();
                    centerOnVehicle(vehicleButton);
                });

                // Markiere den Button als bereits mit dem Event-Listener versehen
                vehicleButton.dataset.dblclick = 'true';
            }
        });
    }

    // Füge den "Zentrieren"-Button beim Laden des Dokuments hinzu
    window.addEventListener('load', () => {
        addCenterButtons();
    });

    // Event-Listener zum Stoppen des Intervalls bei einem Klick auf die Seite
    document.addEventListener('click', () => {
        if (intervalId) {
            //console.log('Klick auf Seite. Stoppe das Intervall.');
            clearInterval(intervalId);
            intervalId = null;
        }
    });

    // Überwache Änderungen im Dokument und füge bei Bedarf den Button hinzu
    const observer = new MutationObserver(() => {
        addCenterButtons();
    });

    // Starte die Überwachung für Änderungen im Dokument
    observer.observe(document.body, { childList: true, subtree: true });
})();