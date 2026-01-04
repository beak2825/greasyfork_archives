// ==UserScript==
// @name         Distraction free Gmail // inbox check detox
// @namespace    https://lukasferger.de
// @version      2025-03-27
// @description  Designed for people who use to check their inbox too often. This script hides the Inbox and allows only 3 checks per day for 10 Minutes. Searching for emails and writing emails is possible all day.
// @author       Lukas
// @license MIT means
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531818/Distraction%20free%20Gmail%20%20inbox%20check%20detox.user.js
// @updateURL https://update.greasyfork.org/scripts/531818/Distraction%20free%20Gmail%20%20inbox%20check%20detox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Konstanten
    const inboxSelector = 'div[role="main"]';
    const styleId = 'inbox-hide-style';
    const overlayId = 'flash-overlay';
    const maxViewsPerDay = 3;
    const viewDuration = 10 * 60 * 1000; // 10 Minuten
    const key = 'emailViews';
    var today = new Date().toISOString().split('T')[0];

    // Zähler laden/speichern
    let views = JSON.parse(localStorage.getItem(key) || '{}');
    if (!views[today]) { views[today] = 0; }
    localStorage.setItem(key, JSON.stringify(views));

    // Statusvariablen
    let manualViewActive = false; // Manuell aktivierte Ansicht (nur im aktuellen Tab)
    let timerId = null;
    let toggleButton = null;

    // CSS zum Ausblenden der Inbox – hier ohne innerHTML
    function injectHideStyle() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `${inboxSelector} { display: none !important; }`;
            document.documentElement.appendChild(style);
        }
    }
    function removeHideStyle() {
        const style = document.getElementById(styleId);
        if (style) { style.remove(); }
    }

    // Overlay einfügen, um Flash während des Ladevorgangs zu verhindern
    function injectOverlay() {
        if (!document.getElementById(overlayId)) {
            const overlay = document.createElement('div');
            overlay.id = overlayId;
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = '#ffffff';
            overlay.style.zIndex = '10000';
            overlay.style.pointerEvents = 'none';
            document.documentElement.appendChild(overlay);
        }
    }
    // Overlay wird nach dem Laden entfernt – unabhängig vom Rest
    function removeOverlay() {
        const overlay = document.getElementById(overlayId);
        if (overlay) { overlay.remove(); }
    }

    // Prüft, ob die aktuelle URL eine Suchseite ist
    function isSearchUrl() {
        return location.hash && location.hash.startsWith('#search');
    }

    // Aktiviert den manuellen View – verbraucht einen View und startet den 10-Minuten-Timer
    function activateManualView() {
        today = new Date().toISOString().split('T')[0];
        if (views[today] >= maxViewsPerDay) {
            alert("Tageslimit erreicht.");
            return;
        }
        removeHideStyle();
        manualViewActive = true;
        views[today]++;
        localStorage.setItem(key, JSON.stringify(views));
        updateToggleButton();
        if (timerId) { clearTimeout(timerId); }
        timerId = setTimeout(() => {
            deactivateManualView();
        }, viewDuration);
    }

    // Deaktiviert den manuellen View – Inbox wird ausgeblendet
    function deactivateManualView() {
        injectHideStyle();
        manualViewActive = false;
        updateToggleButton();
        if (timerId) { clearTimeout(timerId); timerId = null; }
    }

    // Aktiviert den Suchmodus – Suchergebnisse sollen immer sichtbar sein, ohne View-Verbrauch
    function activateSearchView() {
        removeHideStyle();
        if (toggleButton) { toggleButton.style.display = 'none'; }
    }

    // Aktualisiert den Toggle-Button: Auf Nicht-Suchseiten sichtbar, Text je nach Status
    function updateToggleButton() {
        if (!toggleButton) return;
        if (isSearchUrl()) {
            toggleButton.style.display = 'none';
        } else {
            toggleButton.style.display = 'block';

            const remaining = maxViewsPerDay - views[today];
            toggleButton.innerText = manualViewActive ? 'Inbox ausblenden' : 'Inbox anzeigen (' + remaining + ')';
        }
    }

    // Toggle-Button einrichten
    function addToggleButton() {
        const remaining = maxViewsPerDay - views[today];

        toggleButton = document.createElement('button');
        toggleButton.innerText = 'Inbox anzeigen (' + remaining + ')';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '10001';
        toggleButton.style.padding = '8px';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.backgroundColor = '#4285f4';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.onclick = () => {
            // Nur auf Nicht-Suchseiten
            if (manualViewActive) {
                deactivateManualView();
            } else {
                activateManualView();
            }
        };
        document.body.appendChild(toggleButton);
        updateToggleButton();
    }

    // Bei Navigation: Wenn du in einer Suchseite landest, aktiviere Suchmodus.
    // Falls du in Nicht-Suchseiten navigierst, bleibt der manuelle View aktiv, wenn er bereits aktiviert wurde.
    window.addEventListener('hashchange', () => {
        if (isSearchUrl()) {
            activateSearchView();
        } else {
            // Wenn manueller View aktiv, beibehalten – ansonsten Inbox ausblenden
            if (!manualViewActive) {
                injectHideStyle();
            }
            updateToggleButton();
        }
    });

    // Direkt beim Skriptstart: Inbox ausblenden und Overlay einfügen
    injectHideStyle();
    injectOverlay();

    // Sobald die Seite fertig geladen ist, wird der Overlay entfernt (unabhängig vom Rest)
    window.addEventListener('load', () => {
        removeOverlay();
        addToggleButton();
        if (isSearchUrl()) {
            activateSearchView();
        } else {
            // Wenn kein manueller View aktiv ist, bleibt die Inbox ausgeblendet
            if (!manualViewActive) {
                injectHideStyle();
            }
            updateToggleButton();
        }
    });
})();