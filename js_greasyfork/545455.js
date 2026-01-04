// ==UserScript==
// @name         Leitstellenspiel - Wachen Koordinator v15
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Das UI-Fenster wird nur noch angezeigt, wenn der Bau-Modus aktiv ist (Bau-Marker sichtbar).
// @author       Hendrik & Gemini
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545455/Leitstellenspiel%20-%20Wachen%20Koordinator%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/545455/Leitstellenspiel%20-%20Wachen%20Koordinator%20v15.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- KONFIGURATION ---
    const START_LAT = 54.881476; // Dein allererster Startpunkt hier eintragen
    const START_LON = 7.747385;
    const DISTANCE_KM = 10;
    const LOCATIONS_PER_ROW = 25;
    // --- ENDE KONFIGURATION ---


    // ===== AB HIER NICHTS ÄNDERN =====

    /**
     * Erstellt und injiziert das komplette UI-Fenster in die Seite.
     * Diese Funktion wird nur aufgerufen, wenn sie gebraucht wird.
     */
    function createAndInjectUI() {
        // Verhindert doppeltes Erstellen
        if (document.getElementById('wachen-koordinator')) return;

        const container = document.createElement('div');
        container.id = 'wachen-koordinator';
        document.body.appendChild(container);
        container.innerHTML = `
            <h3>Wachen Koordinator</h3>
            <div id="coord-status"></div>
            <div id="manual-set-div">
                <input type="number" id="manual-row" placeholder="Reihe" min="1">
                <input type="number" id="manual-col" placeholder="Wache" min="1">
                <button id="btn-manual-save" class="btn btn-default btn-xs">Setzen</button>
            </div>
            <button id="btn-set-marker" class="btn btn-success">Setze Marker</button>
            <button id="btn-clone-build" class="btn btn-info" style="display: none;"></button>
            <button id="btn-next-row" class="btn btn-warning">Nächste Reihe</button>
            <button id="btn-reset-coords" class="btn btn-danger btn-xs">Fortschritt zurücksetzen</button>
        `;

        // Event Listeners für alle Buttons hinzufügen
        document.getElementById('btn-set-marker').addEventListener('click', setMarkerToNextCoordinate);
        document.getElementById('btn-next-row').addEventListener('click', advanceToNextRow);
        document.getElementById('btn-reset-coords').addEventListener('click', resetProgress);
        document.getElementById('btn-manual-save').addEventListener('click', setManualState);

        GM_addStyle(`
            #wachen-koordinator { position: fixed; bottom: 100px; right: 20px; z-index: 9999; background-color: #343a40; color: white; padding: 15px; border-radius: 8px; border: 1px solid #495057; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
            #wachen-koordinator h3 { margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #495057; padding-bottom: 5px; }
            #wachen-koordinator button { display: block; width: 100%; margin-bottom: 10px; }
            #wachen-koordinator #coord-status { margin-bottom: 10px; padding: 5px; background-color: #212529; border-radius: 4px; font-weight: bold; }
            #manual-set-div { display: flex; gap: 5px; margin-bottom: 15px; align-items: center; justify-content: center; }
            #manual-set-div input { width: 60px; text-align: center; padding: 4px; }
            #manual-set-div button { width: auto; margin-bottom: 0; }
        `);

        updateStatusDisplay();
        manageBuildButtonClone(); // Startet die Überwachung für den Bau-Button
    }

    /**
     * Haupt-Schleife: Überprüft permanent den Spielzustand und zeigt das UI bei Bedarf an oder entfernt es.
     */
    setInterval(() => {
        const map = unsafeWindow.map;
        const panel = document.getElementById('wachen-koordinator');

        if (map) {
            const marker = findBuildingMarker(map);

            if (marker && !panel) {
                // Marker ist da, aber Panel nicht -> Panel erstellen
                createAndInjectUI();
            } else if (!marker && panel) {
                // Marker ist weg, aber Panel ist noch da -> Panel entfernen
                panel.remove();
            }
        } else if (panel) {
            // Keine Karte da, aber Panel ist noch da -> Panel entfernen
            panel.remove();
        }
    }, 1000); // Prüft jede Sekunde


    // --- Logik-Funktionen (bleiben größtenteils unverändert) ---
    function findBuildingMarker(mapInstance) {
        let buildingMarker = null;
        mapInstance.eachLayer(function(layer) {
            if (layer.options && layer.options.draggable && layer._latlng) {
                buildingMarker = layer;
            }
        });
        return buildingMarker;
    }

    function manageBuildButtonClone() {
        const cloneButton = document.getElementById('btn-clone-build');
        if (!cloneButton) return;

        const findVisibleBuildButton = () => {
            const allButtons = document.querySelectorAll('[id^="build_credits_"]');
            let visibleButton = null;
            allButtons.forEach(btn => {
                if (btn.getBoundingClientRect().width > 0) {
                    visibleButton = btn;
                }
            });
            return visibleButton;
        };

        cloneButton.addEventListener('click', () => {
            const originalButton = findVisibleBuildButton();
            if (originalButton) { originalButton.click(); }
        });

        // Eigener kleiner Intervall nur für diesen Button, der nur läuft, wenn das Panel existiert.
        const buttonInterval = setInterval(() => {
            if (!document.getElementById('wachen-koordinator')) {
                clearInterval(buttonInterval); // Stoppt sich selbst, wenn das Panel weg ist.
                return;
            }
            const originalButton = findVisibleBuildButton();
            if (originalButton) {
                cloneButton.style.display = 'block';
                cloneButton.innerText = originalButton.value;
            } else {
                cloneButton.style.display = 'none';
            }
        }, 500);
    }

    async function setMarkerToNextCoordinate() { /* ...unverändert... */ }
    async function setManualState() { /* ...unverändert... */ }
    function updateStatusDisplay() { /* ...unverändert... */ }
    async function advanceToNextRow() { /* ...unverändert... */ }
    async function resetProgress() { /* ...unverändert... */ }
    function calculateDestinationPoint(startPoint, distanceKm, bearing) { /* ...unverändert... */ }
    function toRad(degrees) { return degrees * Math.PI / 180; }
    function toDeg(radians) { return radians * 180 / Math.PI; }

    // --- Hier sind die unveränderten Funktionskörper (zur Übersichtlichkeit) ---
    setMarkerToNextCoordinate = async function() { const map = unsafeWindow.map; const marker = findBuildingMarker(map); if (!marker) { alert('Bau-Marker konnte nicht gefunden werden.'); return; } let currentRow = await GM_getValue('currentRow', 0); let currentCol = await GM_getValue('currentCol', 0); let rowStartPoint = { lat: START_LAT, lon: START_LON }; if (currentRow > 0) { rowStartPoint = calculateDestinationPoint(rowStartPoint, DISTANCE_KM * currentRow, 180); } let targetPoint = calculateDestinationPoint(rowStartPoint, DISTANCE_KM * currentCol, 90); const newLatLng = { lat: targetPoint.lat, lng: targetPoint.lon }; marker.setLatLng(newLatLng); map.panTo(newLatLng); marker.fire('dragend'); await GM_setValue('currentCol', currentCol + 1); updateStatusDisplay(); };
    setManualState = async function() { const rowInput = document.getElementById('manual-row'); const colInput = document.getElementById('manual-col'); const newRow = parseInt(rowInput.value, 10); const newCol = parseInt(colInput.value, 10); if (!isNaN(newRow) && newRow > 0) { await GM_setValue('currentRow', newRow - 1); } if (!isNaN(newCol) && newCol > 0) { await GM_setValue('currentCol', newCol - 1); } updateStatusDisplay(); rowInput.value = ''; colInput.value = ''; };
    updateStatusDisplay = function() { const currentRow = GM_getValue('currentRow', 0); const currentCol = GM_getValue('currentCol', 0); const statusDiv = document.getElementById('coord-status'); if (statusDiv) { statusDiv.innerText = `Reihe: ${currentRow + 1} / Wache: ${currentCol + 1}`; } };
    advanceToNextRow = async function() { let currentRow = await GM_getValue('currentRow', 0); await GM_setValue('currentRow', currentRow + 1); await GM_setValue('currentCol', 0); updateStatusDisplay(); };
    resetProgress = async function() { if (confirm('Bist du sicher?')) { await GM_setValue('currentRow', 0); await GM_setValue('currentCol', 0); updateStatusDisplay(); } };
    calculateDestinationPoint = function(startPoint, distanceKm, bearing) { const R = 6371; const lat1 = toRad(startPoint.lat), lon1 = toRad(startPoint.lon), brng = toRad(bearing); const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceKm / R) + Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(brng)); const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distanceKm / R) * Math.cos(lat1), Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)); return { lat: toDeg(lat2), lon: toDeg(lon2) }; };

})();