// ==UserScript==
// @name         WME Places Finder
// @namespace    https://greasyfork.org/es-419/users/67894-crotalo
// @version      2025.05.13.03
// @description  Barrido por zonas para zonas escolares
// @author       Crotalo
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://www.waze.com/editor/*
// @grant        GM_addStyle
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/535484/WME%20Places%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/535484/WME%20Places%20Finder.meta.js
// ==/UserScript==

(function () {
'use strict';

GM_addStyle(`
  .places-finder-container {
    position: absolute;
    top: 70px;
    left: 10px;
    z-index: 9999;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    font-family: Arial, sans-serif;
    width: 280px;
  }
  .places-finder-btn {
    padding: 8px 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 10px;
    width: 100%;
  }
  .progress-container {
    width: 100%;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  .progress-bar {
    height: 20px;
    background: #4CAF50;
    border-radius: 4px;
    width: 0%;
    transition: width 0.3s;
    text-align: center;
    color: white;
    font-size: 12px;
    line-height: 20px;
  }
  .status-text {
    font-size: 12px;
    margin-top: 5px;
    word-wrap: break-word;
  }
`);

let collectedPlaces = [];
let collectedPlaceIds = new Set(); // To track duplicates
let gridCols = 7;
let gridRows = 6;
let currentCol = 0;
let currentRow = 0;
let initialBounds, stepLon, stepLat;
const INITIAL_ZOOM = 13;
const ZOOM_LEVEL = 17;
const DELAY_AFTER_ZOOM = 5000;
const DELAY_BETWEEN_ZONES = 6000;

let progressBar, statusText, startButton, exportButton;

function initSweep() {
    const map = W.map;
    W.map.getOLMap().zoomTo(INITIAL_ZOOM);

    setTimeout(() => {
        const proj = new OpenLayers.Projection("EPSG:4326");
        const bounds = map.getExtent().transform(map.getProjectionObject(), proj);

        initialBounds = {
            left: bounds.left,
            right: bounds.right,
            bottom: bounds.bottom,
            top: bounds.top
        };

        stepLon = (initialBounds.right - initialBounds.left) / gridCols;
        stepLat = (initialBounds.top - initialBounds.bottom) / gridRows;

        collectedPlaces = [];
        collectedPlaceIds.clear();
        currentCol = 0;
        currentRow = 0;

        startButton.disabled = true;
        exportButton.disabled = true;
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        statusText.textContent = 'Iniciando barrido...';

        console.log("[Places Finder] Iniciando barrido por zonas...");
        sweepNextZone();
    }, 2000);
}

function sweepNextZone() {
    const progress = ((currentRow * gridCols + currentCol) / (gridRows * gridCols)) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
    statusText.textContent = `Zona ${currentRow + 1}-${currentCol + 1} de ${gridRows}-${gridCols}`;

    if (currentRow >= gridRows) {
        const dateStr = new Date().toISOString().slice(0, 10);
        console.log(`[Places Finder] Barrido completo. Total lugares: ${collectedPlaces.length}`);
        console.log(`Exporta los resultados con el botón "Exportar Resultados"`);
        statusText.textContent = `Completado! ${collectedPlaces.length} lugares`;
        startButton.disabled = false;
        exportButton.disabled = false;
        return;
    }

    const targetLon = initialBounds.left + (stepLon * currentCol) + (stepLon / 2);
    const targetLat = initialBounds.bottom + (stepLat * currentRow) + (stepLat / 2);

    // Mostrar permalink del centro de zona
    const zoneLink = `https://www.waze.com/editor?env=row&lat=${targetLat}&lon=${targetLon}&zoomLevel=${ZOOM_LEVEL}`;
    console.log(`[Zona ${currentRow + 1}-${currentCol + 1}] Centro: ${zoneLink}`);

    const proj = new OpenLayers.Projection("EPSG:4326");
    const targetCenter = new OpenLayers.LonLat(targetLon, targetLat).transform(proj, W.map.getProjectionObject());
    W.map.setCenter(targetCenter, ZOOM_LEVEL);

    setTimeout(() => {
        const found = searchPlacesInZone(targetLat, targetLon);
        console.log(`[Zona ${currentRow + 1}-${currentCol + 1}] Encontrados: ${found} lugares`);

        currentCol++;
        if (currentCol >= gridCols) {
            currentCol = 0;
            currentRow++;
        }

        setTimeout(sweepNextZone, DELAY_BETWEEN_ZONES);
    }, DELAY_AFTER_ZOOM);
}

function searchPlacesInZone(centerLat, centerLon) {
    const venues = W.model.venues.objects;
    let count = 0;

    // Margen ampliado para asegurar cobertura
    const margin = 0.02;
    const minLon = centerLon - (stepLon/2) - margin;
    const maxLon = centerLon + (stepLon/2) + margin;
    const minLat = centerLat - (stepLat/2) - margin;
    const maxLat = centerLat + (stepLat/2) + margin;

    for (let id in venues) {
        const venue = venues[id];

        // Skip if we've already collected this place
        if (collectedPlaceIds.has(venue.attributes.id)) continue;

        const name = venue.attributes.name || '';
        const lowerName = name.toLowerCase();

        // Check category if available
        let isEducational = false;
        if (venue.attributes.categories && venue.attributes.categories.length > 0) {
            const category = venue.attributes.categories[0].toLowerCase();
            isEducational = category.includes('school') ||
                          category.includes('education') ||
                          category.includes('escuela') ||
                          category.includes('colegio');
        }

        // Filtro actualizado incluyendo liceos y categorías educativas
        if (!isEducational &&
            !lowerName.includes('colegio') &&
            !lowerName.includes('escuela') &&
            !lowerName.includes('jardin') &&
            !lowerName.includes('jardín') &&
            !lowerName.includes('universidad') &&
            !lowerName.includes('liceo')) {
            continue;
        }

        const geom = venue.attributes.geoJSONGeometry;
        if (!geom || !geom.coordinates) continue;

        let lat, lon;
        if (geom.type === "Point") {
            lon = geom.coordinates[0];
            lat = geom.coordinates[1];
        } else if (geom.type === "Polygon") {
            lon = geom.coordinates[0][0][0];
            lat = geom.coordinates[0][0][1];
        } else {
            continue;
        }

        if (lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat) {
            collectedPlaces.push({
                Nombre: name,
                Latitud: lat,
                Longitud: lon,
                ID: venue.attributes.id,
                Categoría: venue.attributes.categories ? venue.attributes.categories.join(', ') : '',
                Permalink: `https://www.waze.com/editor?env=row&lat=${lat}&lon=${lon}&zoomLevel=18&venues=${venue.attributes.id}`
            });
            collectedPlaceIds.add(venue.attributes.id);
            count++;
        }
    }

    return count;
}

function exportPlaces() {
    if (collectedPlaces.length === 0) {
        alert('No se encontraron places educativos.');
        return;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(collectedPlaces);
    XLSX.utils.book_append_sheet(wb, ws, "Lugares Educativos");
    XLSX.writeFile(wb, `places_educativos_${dateStr}.xlsx`);
}

function addUI() {
    const container = document.createElement('div');
    container.className = 'places-finder-container';

    startButton = document.createElement('button');
    startButton.className = 'places-finder-btn';
    startButton.textContent = '▶️ Iniciar Barrido Preciso';
    startButton.onclick = initSweep;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.textContent = '0%';

    statusText = document.createElement('div');
    statusText.className = 'status-text';
    statusText.textContent = 'Preparado para iniciar';

    exportButton = document.createElement('button');
    exportButton.className = 'places-finder-btn';
    exportButton.textContent = '📊 Exportar Resultados';
    exportButton.onclick = exportPlaces;
    exportButton.disabled = true;

    progressContainer.appendChild(progressBar);
    container.appendChild(startButton);
    container.appendChild(progressContainer);
    container.appendChild(statusText);
    container.appendChild(exportButton);

    document.body.appendChild(container);
}

function waitForWME() {
    if (typeof W === 'undefined' || !W.map || !W.model || !W.model.venues) {
        setTimeout(waitForWME, 1000);
    } else {
        addUI();
        console.log("[Place Sweeper] Script listo. Zoom inicial: 13");
    }
}

waitForWME();
})();