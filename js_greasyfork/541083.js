// ==UserScript==
// @name         WME Pending Places Navigator
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Herramienta para gestionar TODOS los lugares nuevos y pendientes de aprobación en WME.
// @author       TuNombre (Modificado por Asistente AI)
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://www.waze.com/editor/*
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/541083/WME%20Pending%20Places%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/541083/WME%20Pending%20Places%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURACIÓN
    const TAB_NAME = "Pendientes";
    const DEBUG_MODE = true;
    const CATEGORIES_TO_FILTER = []; // Dejar vacío para seleccionar todas las categorías
    const ZOOM_LEVEL = 18; // Nivel de zoom al navegar a un lugar

    // ESTILOS CSS
    GM_addStyle(`
        #pendingPlacesPanel { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 100%; max-height: 80vh; overflow-y: auto; margin-top: 10px; border: 1px solid #ddd; }
        #placesList { width: 100%; margin: 15px 0; padding: 5px; max-height: 60vh; overflow-y: auto; }
        .place-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
        .place-checkbox { margin-right: 12px; cursor: pointer; }
        .place-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }
        .go-to-btn { background: #4CAF50; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-left: 10px; flex-shrink: 0; font-size: 13px; transition: background 0.2s; }
        .go-to-btn:hover { background: #3e8e41; }
        .action-buttons { display: flex; gap: 10px; margin-top: 15px; }
        .refresh-btn, .delete-btn { color: white; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer; flex-grow: 1; font-weight: bold; transition: opacity 0.2s; }
        .refresh-btn { background: #2196F3; }
        .delete-btn { background: #f44336; }
        .select-all-container { margin: 10px 0; font-size: 14px; display: flex; align-items: center; }
        .status-message { margin-top: 15px; padding: 10px; border-radius: 4px; font-size: 13px; text-align: center; display: none; }
        .success { background-color: #dff0d8; color: #3c763d; } .warning { background-color: #fcf8e3; color: #8a6d3b; } .error { background-color: #f2dede; color: #a94442; }
    `);

    let pendingPlaces = [];
    let panelInitialized = false;

    function debugLog(message) { if (DEBUG_MODE) console.log(`[Pending Places Nav] ${message}`); }

    // ----- INICIO DE LA FUNCIÓN CORREGIDA -----
    function goToPlace(place) {
        debugLog(`Navegando a (sin recargar): ${place.name || place.id}`);
        const urObject = place.venueObject; // 'ur' es el término común para Update Request

        if (!urObject) {
            showStatusMessage("Objeto del lugar no encontrado.", 'error');
            return;
        }

        try {
            // 1. Obtener la geometría y el centro del lugar.
            const geometry = urObject.getOLGeometry();
            if (!geometry) {
                showStatusMessage("No se pudo obtener la geometría del lugar.", 'error');
                return;
            }
            const center = geometry.getBounds().getCenterLonLat();

            // 2. Mover el mapa a la ubicación.
            W.map.setCenter(center, ZOOM_LEVEL);

            // 3. Usar un setTimeout para darle tiempo al mapa a moverse.
            setTimeout(() => {
                // 4. Intentar mostrar el panel de edición usando los controladores de WME.
                // Si no existen, no hacemos nada para evitar errores en la consola.
                if (W.control?.UR?.show) {
                    W.control.UR.show(urObject);
                    debugLog('Panel de UR mostrado vía W.control.UR.show');
                } else if (W.control?.MapUpdateRequest?.show) {
                    W.control.MapUpdateRequest.show(urObject);
                    debugLog('Panel de UR mostrado vía W.control.MapUpdateRequest.show');
                } else {
                    debugLog('No se encontró un método para mostrar el panel de edición. El mapa solo ha sido centrado.');
                }
            }, 300);

        } catch (e) {
            debugLog(`Error durante la navegación interna: ${e}`);
            showStatusMessage("Error al intentar navegar al lugar.", 'error');
        }
    }
    // ----- FIN DE LA FUNCIÓN CORREGIDA -----

    function deleteSelectedPlaces() {
        const checkboxes = document.querySelectorAll('#placesList .place-checkbox:checked');
        if (checkboxes.length === 0) { showStatusMessage('Selecciona al menos un lugar', 'warning'); return; }
        if (!confirm(`¿Estás seguro de que quieres eliminar ${checkboxes.length} lugar(es)?`)) return;

        let deletedCount = 0, errors = 0;
        const DeleteObject = require("Waze/Action/DeleteObject");

        checkboxes.forEach(checkbox => {
            const id = checkbox.dataset.id;
            const place = W.model.venues.getObjectById(id);
            if (place) {
                try {
                    W.model.actionManager.add(new DeleteObject(place));
                    deletedCount++;
                } catch (e) { debugLog(`Error eliminando el lugar ${id}: ${e}`); errors++; }
            } else { debugLog(`No se encontró el lugar con ID ${id}`); errors++; }
        });

        if (deletedCount > 0) {
            showStatusMessage(`Se procesaron ${deletedCount} eliminaciones (${errors} errores).`, 'success');
            updatePlacesList();
            setTimeout(() => {
                const saveButton = document.querySelector('[title="Save"], [title="Guardar"]');
                if (saveButton && saveButton.hasAttribute('disabled')) {
                    saveButton.removeAttribute('disabled');
                    debugLog('El botón de guardado fue activado forzosamente.');
                }
            }, 500);
        } else { showStatusMessage('No se pudo eliminar ningún lugar.', 'error'); }
    }

    function updateListDisplay() {
        const listContainer = document.getElementById('placesList');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        if (pendingPlaces.length === 0) {
            listContainer.innerHTML = '<div style="padding: 10px; text-align: center;">No se encontraron lugares pendientes</div>';
            return;
        }
        pendingPlaces.forEach((place, index) => {
            const item = document.createElement('div');
            item.className = 'place-item';
            item.innerHTML = `<input type="checkbox" class="place-checkbox" data-id="${place.id}"><span class="place-name" title="${place.name}">${place.name || `Lugar ${index + 1}`}</span><button class="go-to-btn" data-id="${place.id}">Ir</button>`;
            item.querySelector('.go-to-btn').addEventListener('click', () => goToPlace(place));
            listContainer.appendChild(item);
        });
    }

    function showStatusMessage(message, type) {
        debugLog(`Mensaje de estado [${type}]: ${message}`);
        const element = document.getElementById('statusMessage');
        if (!element) return;
        element.textContent = message;
        element.className = `status-message ${type}`;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 5000);
    }

    function updatePlacesList() {
        debugLog("Actualizando lista de lugares pendientes");
        if (!W || !W.model || !W.model.venues) { showStatusMessage("WME no está completamente cargado", 'error'); return; }
        pendingPlaces = [];
        const venues = W.model.venues.objects;
        let count = 0;
        for (let id in venues) {
            const venue = venues[id];
            const isPending = venue.isNew() || (venue.attributes.approved === false);
            if (isPending) {
                const venueCategories = venue.attributes.categories || [];
                const categoryMatch = CATEGORIES_TO_FILTER.length === 0 || venueCategories.some(cat => CATEGORIES_TO_FILTER.includes(cat));
                if (categoryMatch) {
                    const name = venue.attributes.name || 'Sin nombre';
                    const geom = venue.attributes.geoJSONGeometry;
                    if (geom && geom.coordinates) {
                        let lat, lon;
                        if (geom.type === "Point") { [lon, lat] = geom.coordinates; }
                        else if (geom.type === "Polygon") { [lon, lat] = geom.coordinates[0][0]; }
                        else { continue; }
                        pendingPlaces.push({ id: id, name: name, lat: lat, lon: lon, venueObject: venue });
                        count++;
                    }
                }
            }
        }
        updateListDisplay();
        showStatusMessage(`Encontrados ${count} lugares pendientes`, count > 0 ? 'success' : 'warning');
        debugLog(`Encontrados ${count} lugares pendientes`);
    }

    function initPanel(container) {
        if (panelInitialized) return;
        panelInitialized = true;
        debugLog("Inicializando panel");
        const panel = document.createElement('div'); panel.id = 'pendingPlacesPanel';
        panel.innerHTML = `<h3 style="margin-top: 0; color: #333;">Lugares Pendientes por Aprobar</h3><div class="select-all-container"><input type="checkbox" id="selectAllPlaces" class="place-checkbox"><label for="selectAllPlaces">Seleccionar todos</label></div><div id="placesList"></div><div class="action-buttons"><button class="refresh-btn">🔄 Actualizar</button><button class="delete-btn">🗑️ Eliminar</button></div><div id="statusMessage" class="status-message" style="display: none;"></div>`;
        panel.querySelector('#selectAllPlaces').addEventListener('change', function() { panel.querySelectorAll('#placesList .place-checkbox').forEach(checkbox => { checkbox.checked = this.checked; }); });
        panel.querySelector('.refresh-btn').addEventListener('click', updatePlacesList);
        panel.querySelector('.delete-btn').addEventListener('click', deleteSelectedPlaces);
        container.appendChild(panel);
        updatePlacesList();
    }

    function bootstrap() {
        if (typeof W === 'undefined' || !W.map || !W.model || !W.userscripts || typeof OpenLayers === 'undefined') {
            setTimeout(bootstrap, 1000);
            return;
        }

        debugLog("WME está listo. Iniciando WME Pending Places Navigator");
        try {
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('places-nav');
            tabLabel.innerText = TAB_NAME;
            tabPane.id = "placesNavTab";
            initPanel(tabPane);
        } catch (e) {
            debugLog("No se pudo usar la API de WME para crear la pestaña, usando método alternativo.");
            const userTabs = document.querySelector('#user-tabs ul');
            if (!userTabs) { debugLog("No se encontró #user-tabs."); return; }
            const tab = document.createElement('li');
            tab.innerHTML = `<a href="#sidepanel-places-nav" data-toggle="tab" title="${TAB_NAME}">${TAB_NAME}</a>`;
            const panel = document.createElement('div');
            panel.id = 'sidepanel-places-nav';
            panel.className = 'tab-pane';
            document.querySelector('.tab-content').appendChild(panel);
            userTabs.appendChild(tab);
            initPanel(panel);
        }
    }

    bootstrap();

})();