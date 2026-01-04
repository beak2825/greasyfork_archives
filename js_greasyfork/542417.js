// ==UserScript==
// @name         Leitstellenspiel Massenkauf & Zurück
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Massenkauf von Fahrzeugen mit automatischer Rückkehr zur Wache.
// @author       Dein Name
// @match        https://www.leitstellenspiel.de/buildings/*/vehicles/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542417/Leitstellenspiel%20Massenkauf%20%20Zur%C3%BCck.user.js
// @updateURL https://update.greasyfork.org/scripts/542417/Leitstellenspiel%20Massenkauf%20%20Zur%C3%BCck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Finde alle Kauf-Links auf der Seite
    const buyLinks = document.querySelectorAll('a.buy-vehicle-btn');

    buyLinks.forEach(originalLink => {
        const originalHref = originalLink.getAttribute('href');

        // Prüfe, ob der Link ein "Credits"-Kauf ist
        if (originalHref && originalHref.includes('/credits')) {

            // Erstelle das Dropdown-Menü für die Anzahl
            const quantitySelect = document.createElement('select');
            quantitySelect.style.marginLeft = '5px';
            quantitySelect.style.padding = '5px';
            quantitySelect.classList.add('form-control', 'input-sm');

            // Schleife in 5er-Schritten bis 100
            for (let i = 5; i <= 100; i += 5) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                quantitySelect.appendChild(option);
            }

            // Erstelle den neuen "Massenkauf"-Button
            const massBuyButton = document.createElement('a');
            massBuyButton.textContent = 'Massenkauf';
            massBuyButton.classList.add('btn', 'btn-info');
            massBuyButton.style.marginLeft = '5px';
            massBuyButton.href = '#';

            // Event-Listener für den Klick auf den Massenkauf-Button
            massBuyButton.addEventListener('click', (event) => {
                event.preventDefault();

                const quantity = parseInt(quantitySelect.value, 10);
                const baseUrl = window.location.origin;
                const fullUrl = baseUrl + originalHref;

                console.log(`Starte Massenkauf: ${quantity}x für ${fullUrl}`);

                // Führe die Anfragen parallel aus
                for (let i = 0; i < quantity; i++) {
                    fetch(fullUrl).catch(error => console.error('Fehler bei der Anfrage (kann ignoriert werden):', error));
                }

                // === NEU: LOGIK FÜR WEITERLEITUNG ===

                // 1. Extrahiere die Wachen-ID aus der aktuellen URL
                const urlParts = window.location.pathname.split('/'); // Ergibt z.B. ["", "buildings", "20645805", "vehicles", "new"]
                const buildingId = urlParts[2];

                // 2. Gib dem Nutzer Feedback und deaktiviere den Button
                massBuyButton.textContent = `${quantity}x beauftragt! Leite weiter...`;
                massBuyButton.classList.remove('btn-info');
                massBuyButton.classList.add('btn-success', 'disabled'); // 'disabled' verhindert weitere Klicks

                // 3. Warte 2.5 Sekunden und leite dann zurück zur Wachenübersicht
                setTimeout(() => {
                    window.location.href = `${baseUrl}/buildings/${buildingId}#vehicle`;
                }, 2500); // 2.5 Sekunden Pause
            });

            // Füge die neuen Elemente nach dem originalen Button ein
            originalLink.parentNode.insertBefore(quantitySelect, originalLink.nextSibling);
            originalLink.parentNode.insertBefore(massBuyButton, quantitySelect.nextSibling);
        }
    });
})();