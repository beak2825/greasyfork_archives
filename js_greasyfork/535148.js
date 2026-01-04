// ==UserScript==
// @name         WME Residencial Navigator
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Herramienta completa para gestionar lugares residenciales en WME con nombre visible
// @author       TuNombre
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://www.waze.com/editor/*
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/535148/WME%20Residencial%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/535148/WME%20Residencial%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración
    const TAB_NAME = "Residenciales";
    const DEBUG_MODE = true;

    // Estilos mejorados
    GM_addStyle(`
        #residentialPanel {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #ddd;
        }

        #residentialList {
            width: 100%;
            margin: 15px 0;
            padding: 5px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .residential-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .residential-checkbox {
            margin-right: 12px;
            cursor: pointer;
        }

        .residential-name {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
        }

        .go-to-btn {
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 10px;
            flex-shrink: 0;
            font-size: 13px;
            transition: background 0.2s;
        }

        .go-to-btn:hover {
            background: #3e8e41;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .refresh-btn, .delete-btn {
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            flex-grow: 1;
            font-weight: bold;
            transition: opacity 0.2s;
        }

        .refresh-btn {
            background: #2196F3;
        }

        .refresh-btn:hover {
            opacity: 0.9;
        }

        .delete-btn {
            background: #f44336;
        }

        .delete-btn:hover {
            opacity: 0.9;
        }

        .select-all-container {
            margin: 10px 0;
            font-size: 14px;
            display: flex;
            align-items: center;
        }

        .status-message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
            text-align: center;
            display: none;
        }

        .success {
            background-color: #dff0d8;
            color: #3c763d;
            border: 1px solid #d6e9c6;
        }

        .warning {
            background-color: #fcf8e3;
            color: #8a6d3b;
            border: 1px solid #faebcc;
        }

        .error {
            background-color: #f2dede;
            color: #a94442;
            border: 1px solid #ebccd1;
        }

        /* Estilo para la pestaña personalizada */
        #user-tabs .residential-tab {
            background-color: #f8f9fa;
        }

        #user-tabs .residential-tab.active {
            background-color: #e9ecef;
        }

        /* Asegurar que el texto de la pestaña sea visible */
        #user-tabs .residential-tab a {
            color: #333 !important;
            font-weight: bold;
            padding: 8px 12px;
            display: block;
        }

        /* Botón flotante de respaldo */
        #residentialFloatingBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: none;
        }
    `);

    let residentialPlaces = [];
    let panelInitialized = false;

    // Función para debug
    function debugLog(message) {
        if (DEBUG_MODE) {
            console.log(`[Residencial Navigator] ${message}`);
        }
    }

    // Función principal para registrar la pestaña
    function registerSidebarTab() {
        debugLog(`Intentando registrar pestaña: ${TAB_NAME}`);

        // Método 1: API oficial de WME
        if (typeof W !== 'undefined' && W.userscripts && typeof W.userscripts.registerSidebarTab === 'function') {
            try {
                const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(TAB_NAME);

                if (tabPane) {
                    debugLog("Pestaña registrada con API oficial");

                    // Asegurar que el nombre sea visible
                    tabLabel.textContent = TAB_NAME;
                    tabLabel.title = TAB_NAME;
                    tabLabel.style.color = "#333";
                    tabLabel.style.fontWeight = "bold";

                    const contentPanel = document.createElement("div");
                    contentPanel.id = "residential-content";
                    tabPane.appendChild(contentPanel);

                    tabLabel.addEventListener("click", function(e) {
                        e.preventDefault();
                        toggleResidentialPanel(contentPanel);
                    });

                    initResidentialPanel(contentPanel);
                    return;
                }
            } catch (e) {
                debugLog(`Error con API oficial: ${e}`);
            }
        }

        // Método 2: Alternativo si falla la API
        setupAlternativeTab();
    }

    // Método alternativo para crear pestaña
    function setupAlternativeTab() {
        debugLog("Usando método alternativo para crear pestaña");

        const userTabs = document.querySelector('#user-tabs ul');
        if (!userTabs) {
            debugLog("No se encontró #user-tabs, creando botón flotante");
            createFloatingButton();
            return;
        }

        // Verificar si la pestaña ya existe
        if (document.querySelector(`#user-tabs a[title="${TAB_NAME}"]`)) {
            debugLog("La pestaña ya existe");
            return;
        }

        // Crear nueva pestaña
        const tabItem = document.createElement('li');
        tabItem.className = 'residential-tab';

        const tabLink = document.createElement('a');
        tabLink.href = '#';
        tabLink.title = TAB_NAME;
        tabLink.textContent = TAB_NAME;

        tabItem.appendChild(tabLink);
        userTabs.appendChild(tabItem);

        // Crear panel de contenido
        const userPanel = document.querySelector('#user-panel');
        if (!userPanel) {
            debugLog("No se encontró #user-panel, creando botón flotante");
            createFloatingButton();
            return;
        }

        const contentPanel = document.createElement('div');
        contentPanel.id = 'residential-content';
        contentPanel.style.display = 'none';
        userPanel.appendChild(contentPanel);

        // Manejar clics en la pestaña
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleResidentialPanel(contentPanel);

            // Actualizar estado activo
            document.querySelectorAll('#user-tabs li').forEach(tab => {
                tab.classList.remove('active');
            });
            this.parentNode.classList.add('active');
        });

        initResidentialPanel(contentPanel);
    }

    // Crear botón flotante como respaldo
    function createFloatingButton() {
        debugLog("Creando botón flotante de respaldo");

        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'residentialFloatingBtn';
        floatingBtn.textContent = '🏠';
        floatingBtn.title = TAB_NAME;
        floatingBtn.style.display = 'block';
        document.body.appendChild(floatingBtn);

        const panel = document.createElement('div');
        panel.id = 'residentialPanel';
        panel.style.position = 'fixed';
        panel.style.right = '20px';
        panel.style.bottom = '80px';
        panel.style.zIndex = '9998';
        panel.style.display = 'none';
        panel.style.width = '300px';
        document.body.appendChild(panel);

        initResidentialPanel(panel);

        floatingBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Inicializar el panel de contenido
    function initResidentialPanel(container) {
        if (panelInitialized) return;
        panelInitialized = true;

        debugLog("Inicializando panel residencial");

        const panel = document.createElement('div');
        panel.id = 'residentialPanel';

        panel.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Lugares Residenciales</h3>
            <div class="select-all-container">
                <input type="checkbox" id="selectAllResidentials" class="residential-checkbox">
                <label for="selectAllResidentials">Seleccionar todos</label>
            </div>
            <div id="residentialList"></div>
            <div class="action-buttons">
                <button class="refresh-btn">🔄 Actualizar</button>
                <button class="delete-btn">🗑️ Eliminar</button>
            </div>
            <div id="statusMessage" class="status-message" style="display: none;"></div>
        `;

        // Configurar eventos
        panel.querySelector('#selectAllResidentials').addEventListener('change', function() {
            const checkboxes = panel.querySelectorAll('.residential-checkbox');
            checkboxes.forEach(checkbox => {
                if (checkbox !== this) checkbox.checked = this.checked;
            });
        });

        panel.querySelector('.refresh-btn').addEventListener('click', updateResidentialList);
        panel.querySelector('.delete-btn').addEventListener('click', deleteSelectedPlaces);

        container.appendChild(panel);
        updateResidentialList();
    }

    // Mostrar/ocultar panel
    function toggleResidentialPanel(contentPanel) {
        if (!contentPanel) return;

        debugLog("Alternando visibilidad del panel");

        // Ocultar todos los paneles primero
        document.querySelectorAll("#user-panel > div").forEach(panel => {
            panel.style.display = "none";
        });

        // Mostrar/ocultar nuestro panel
        contentPanel.style.display = contentPanel.style.display === "block" ? "none" : "block";

        // Cargar datos si se muestra
        if (contentPanel.style.display === "block" && residentialPlaces.length === 0) {
            updateResidentialList();
        }
    }

    // Actualizar lista de lugares residenciales
    function updateResidentialList() {
        debugLog("Actualizando lista de residenciales");

        if (!W || !W.model || !W.model.venues) {
            showStatusMessage("WME no está completamente cargado", 'error');
            return;
        }

        residentialPlaces = [];
        const venues = W.model.venues.objects;
        let count = 0;

        for (let id in venues) {
            const venue = venues[id];
            if (venue.attributes.categories && venue.attributes.categories.includes('RESIDENCE_HOME')) {
                const name = venue.attributes.name || 'Sin nombre';
                const geom = venue.attributes.geoJSONGeometry;

                if (geom && geom.coordinates) {
                    let lat, lon;
                    if (geom.type === "Point") {
                        [lon, lat] = geom.coordinates;
                    } else if (geom.type === "Polygon") {
                        [lon, lat] = geom.coordinates[0][0];
                    } else {
                        continue;
                    }

                    residentialPlaces.push({
                        id: id,
                        name: name,
                        lat: lat,
                        lon: lon,
                        venueObject: venue
                    });
                    count++;
                }
            }
        }

        updateListDisplay();
        showStatusMessage(`Encontrados ${count} lugares residenciales`, count > 0 ? 'success' : 'warning');
        debugLog(`Encontrados ${count} lugares residenciales`);
    }

    // Actualizar visualización de la lista
    function updateListDisplay() {
        const listContainer = document.getElementById('residentialList');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        if (residentialPlaces.length === 0) {
            listContainer.innerHTML = '<div style="padding: 10px; text-align: center;">No se encontraron lugares residenciales</div>';
            return;
        }

        residentialPlaces.forEach((place, index) => {
            const item = document.createElement('div');
            item.className = 'residential-item';
            item.innerHTML = `
                <input type="checkbox" class="residential-checkbox" data-id="${place.id}">
                <span class="residential-name" title="${place.name}">${place.name || `Lugar ${index + 1}`}</span>
                <button class="go-to-btn" data-id="${place.id}">Ir</button>
            `;

            item.querySelector('.go-to-btn').addEventListener('click', () => goToPlace(place));
            listContainer.appendChild(item);
        });
    }

    // Navegar a un lugar
    function goToPlace(place) {
        debugLog(`Navegando a lugar: ${place.name || place.id}`);

        if (!W || !W.map) return;

        try {
            const center = WazeWrap.LonLat.fromObject({lon: place.lon, lat: place.lat});
            W.map.setCenter(center, 18);

            if (place.venueObject) {
                W.model.venues.setSelectedVenue(place.venueObject);

                // Habilitar botón de guardar
                setTimeout(() => {
                    const saveBtn = document.querySelector('[title="Save"], [title="Guardar"]');
                    if (saveBtn) saveBtn.removeAttribute('disabled');
                }, 500);
            }
        } catch (e) {
            debugLog(`Error al navegar: ${e}`);
            showStatusMessage("Error al navegar al lugar", 'error');
        }
    }

    // Eliminar lugares seleccionados
    function deleteSelectedPlaces() {
        const checkboxes = document.querySelectorAll('.residential-checkbox:checked');
        if (checkboxes.length === 0) {
            showStatusMessage('Selecciona al menos un lugar', 'warning');
            return;
        }

        if (!confirm(`¿Eliminar ${checkboxes.length} lugar(es) seleccionado(s)?`)) return;

        let deletedCount = 0;
        let errors = 0;

        checkboxes.forEach(checkbox => {
            const id = checkbox.dataset.id;
            const place = W.model.venues.getObjectById(id);

            if (!place) {
                errors++;
                return;
            }

            try {
                const DeleteObject = require("Waze/Action/DeleteObject");
                const action = new DeleteObject(place);
                W.model.actionManager.add(action);
                deletedCount++;
                debugLog(`Eliminado lugar: ${id}`);
            } catch (e) {
                debugLog(`Error eliminando lugar ${id}: ${e}`);
                errors++;
            }
        });

        if (deletedCount > 0) {
            showStatusMessage(`Eliminados ${deletedCount} lugares (${errors} errores)`, 'success');
            updateResidentialList();

            // Habilitar botón de guardar
            setTimeout(() => {
                const saveBtn = document.querySelector('[title="Save"], [title="Guardar"]');
                if (saveBtn) saveBtn.removeAttribute('disabled');
            }, 500);
        } else {
            showStatusMessage("No se eliminaron lugares", 'warning');
        }
    }

    // Mostrar mensajes de estado
    function showStatusMessage(message, type) {
        debugLog(`Mensaje de estado [${type}]: ${message}`);

        const element = document.getElementById('statusMessage');
        if (!element) return;

        element.textContent = message;
        element.className = `status-message ${type}`;
        element.style.display = 'block';

        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // Inicialización del script

        let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 5;

function initScript() {
    debugLog("Iniciando WME Residencial Navigator");
    initAttempts++;

    if (document.querySelector("#user-tabs")) {
        registerSidebarTab();
    } else if (initAttempts < MAX_INIT_ATTEMPTS) {
        setTimeout(initScript, 500);
    } else {
        debugLog("No se encontró #user-tabs después de múltiples intentos");
        createFloatingButton();
    }
}
    

    // Esperar a que cargue WME
    if (document.readyState === 'complete') {
        initScript();
    } else {
        window.addEventListener('load', initScript);
    }

    debugLog("Script cargado correctamente");
})();