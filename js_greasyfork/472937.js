// ==UserScript==
// @name         Basic Member Premium Log und Geocache/TB adoptieren
// @namespace    https://geocaching.com/
// @version      1.2
// @description  Fügt einen Premium-Log-Link mit Eingabefeld und einen Link zum Geocache-/TB-Adoptieren unter der Rubrik "Geocaches" auf der Profilseite von geocaching.com hinzu.
// @author       El Cheffe (H.Kusch)
// @match        *.geocaching.com/*
// @grant        none
// @icon         data:image/png;base64,R0lGODdhDwAPAPIAAP7+/rnS9UqI5D+A4gEqfCZFySZFySZFySH5BAEAAAUALAAAAAAPAA8AAAMsSLrcNDDKqKaFdQqbowCb1HncIwVAaaXTCLGiKcGU/AL04F66zfe/mGNISAAAOw==
// @downloadURL https://update.greasyfork.org/scripts/472937/Basic%20Member%20Premium%20Log%20und%20GeocacheTB%20adoptieren.user.js
// @updateURL https://update.greasyfork.org/scripts/472937/Basic%20Member%20Premium%20Log%20und%20GeocacheTB%20adoptieren.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Hinzufügen der Links
    function addPremiumLogAndAdoptLinks() {
        // Erstelle das Eingabefeld
        const codeInput = document.createElement('input');
        codeInput.setAttribute('type', 'text');
        codeInput.setAttribute('placeholder', 'GC-Code');
        codeInput.setAttribute('maxlength', '8');
        codeInput.style.width = '140px';
        codeInput.style.height = '20px';

        // Begrenze die Eingabe auf Großbuchstaben und Alphanumerische Zeichen
        codeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });

        // Erstelle den Premium-Log-Link (nur für Premiummitglieder)
        const premiumLogLink = document.createElement('a');
        premiumLogLink.textContent = 'Premium loggen';
        premiumLogLink.style.marginRight = '10px';
        premiumLogLink.style.cursor = 'pointer';
        premiumLogLink.addEventListener('click', function() {
            const code = codeInput.value;
            if (code) {
                const logUrl = 'https://www.geocaching.com/seek/log.aspx?wp=' + code;
                window.open(logUrl, '_blank');
            }
        });

        // Erstelle den Link zum Geocache-/TB-Adoptieren
        const adoptLink = document.createElement('a');
        adoptLink.textContent = 'Geocache/TB adoptieren';
        adoptLink.style.cursor = 'pointer';
        adoptLink.href = 'https://www.geocaching.com/adopt/';

        // Finde den Premium-Status des Benutzers
        const premiumStatus = document.querySelector('.bio-userrole');
        if (premiumStatus && premiumStatus.textContent === 'Basic') {
            // Füge den Premium-Log-Link nur für Premiummitglieder hinzu
            const geocacheList = document.querySelector('.link-block');
            if (geocacheList) {
                const listItem = document.createElement('li');
                listItem.appendChild(premiumLogLink);
                listItem.appendChild(codeInput);
                geocacheList.appendChild(listItem);
            }
        }

        // Füge den Adopt-Link immer hinzu
        const geocacheList = document.querySelector('.link-block');
        if (geocacheList) {
            const listItem = document.createElement('li');
            listItem.appendChild(adoptLink);
            geocacheList.appendChild(listItem);
        }
    }

    // Warte, bis das Dokument vollständig geladen ist
    window.addEventListener('load', function() {
        addPremiumLogAndAdoptLinks();
    });
})();