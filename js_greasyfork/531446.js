// ==UserScript==
// @name         WME Auto Name Places
// @namespace    https://greasyfork.org/es-419/users/67894-crotalo
// @version      2.71
// @description  Busca Places sin nombre, les asigna la categoría como nombre en español y permite eliminarlos.
// @author       Crotalo
// @match        https://www.waze.com/*editor*
// @match        https://beta.waze.com/*editor*
// @exclude      https://beta.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531446/WME%20Auto%20Name%20Places.user.js
// @updateURL https://update.greasyfork.org/scripts/531446/WME%20Auto%20Name%20Places.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        delayBetweenUpdates: 100, // ms entre actualizaciones
        modalStyle: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxHeight: '70vh',
            overflowY: 'auto',
            width: 'auto',
            minWidth: '650px'
        }
    };

    const CATEGORY_TRANSLATIONS = {
        'restaurant': 'Restaurante', 'college_university': 'Universidad', 'swimming_pool': 'Piscina', 'factory_industrial': 'Fábrica', 'farm': 'Granja', 'sea_lake_pool': 'Lago',
        'river_stream': 'Río', 'forest_grove': 'Bosque', 'cafe': 'Cafetería', 'sports_court': 'Cancha Deportiva', 'shopping_and_services': 'Tienda', 'car_services': 'Servios para el Automovil',
        'hotel': 'Hotel', 'swamp_marsh': 'Humedal', 'sport_court': 'Escenario Deportivo', 'gas station': 'Estación de servicio', 'hospital': 'Hospital', 'pharmacy': 'Farmacia',
        'Fast_food': 'Comida Rápida', 'Shopping_center': 'Almacén', 'Culture_and_entertainement': 'Cultura y Entretenimiento', 'bank': 'Banco', 'atm': 'Cajero automático',
        'parking': 'Estacionamiento', 'parking_lot': 'Parqueadero', 'garage_automotive_shop': 'Tienda para Vehículos', 'natural_features': 'Características Naturales',
        'school': 'Escuela', 'university': 'Universidad', 'professional_and_public': 'Lugar Profesional o Público', 'museum': 'Museo', 'park': 'Parque', 'mall': 'Centro comercial',
        'stadium_arena': 'Estadio', 'supermarket': 'Supermercado', 'gym': 'Gimnasio', 'church': 'Iglesia', 'police': 'Comisaría', 'fire station': 'Estación de bomberos',
        'library': 'Biblioteca', 'stadium': 'Estadio', 'cinema': 'Cine', 'theater': 'Teatro', 'zoo': 'Zoológico', 'airport': 'Aeropuerto', 'train station': 'Estación de tren',
        'bus station': 'Estación de autobuses', 'car wash': 'Lavado de coches', 'car repair': 'Taller mecánico', 'construction_site': 'Sitio en Construcción', 'dentist': 'Dentista',
        'doctor': 'Médico', 'clinic': 'Clínica', 'veterinary': 'Veterinario', 'post office': 'Oficina de correos', 'shopping': 'Tiendas', 'bakery': 'Panadería', 'butcher': 'Carnicería',
        'market': 'Mercado', 'florist': 'Florería', 'book store': 'Librería', 'electronics': 'Electrónica', 'furniture': 'Mueblería', 'jewelry': 'Joyería', 'optician': 'Óptica',
        'pet store': 'Tienda de mascotas', 'sports': 'Artículos deportivos', 'toy store': 'Juguetería', 'other': 'Otro', 'outdoors': 'Exteriores', 'bridge': 'Puente'
    };

    function waitForWME() {
        return new Promise(resolve => {
            if (window.W && W.model && W.model.venues && W.model.actionManager) {
                resolve();
            } else {
                setTimeout(() => resolve(waitForWME()), 500);
            }
        });
    }

    function getUnnamedPlaces() {
        if (!W.model.venues?.objects) return [];
        return Object.values(W.model.venues.objects).filter(place => {
            const name = place.attributes?.name;
            return !name || name.trim() === '';
        });
    }

    function generateName(place) {
        if (!place.attributes) return "Desconocido";
        if (place.attributes.residential) return "Residencial";
        if (place.attributes.categories?.[0]) {
            const category = place.attributes.categories[0].toLowerCase();
            return CATEGORY_TRANSLATIONS[category] || category.charAt(0).toUpperCase() + category.slice(1);
        }
        return "Desconocido";
    }

    // --- FUNCIÓN CORREGIDA ---
    function createApprovalTable(places) {
        document.getElementById('wme-auto-name-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'wme-auto-name-modal';
        Object.assign(modal.style, CONFIG.modalStyle);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '10px';
        closeBtn.style.top = '10px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => modal.remove();
        modal.appendChild(closeBtn);

        const title = document.createElement('h3');
        title.textContent = `Places sin nombre encontrados: ${places.length}`;
        title.style.marginTop = '0';
        title.style.color = '#333';
        modal.appendChild(title);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '15px';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">ID</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Permalink</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Categoría</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Nuevo Nombre</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Aprobar Nombre</th>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Eliminar</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        places.forEach(place => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #eee';
            const newName = generateName(place);
            const category = place.attributes.categories?.[0] ?
                             (CATEGORY_TRANSLATIONS[place.attributes.categories[0].toLowerCase()] || place.attributes.categories[0]) :
                             "N/A";

            // --- CORRECCIÓN AQUÍ ---
            // Se obtiene el centro de los límites (bounds) de la geometría, que funciona para puntos y áreas.
            const centerLonLat = place.geometry.getBounds().getCenterLonLat();
            const lon = centerLonLat.lon;
            const lat = centerLonLat.lat;
            const permalink = `https://www.waze.com/editor/?lon=${lon}&lat=${lat}&zoom=19&v=${place.id}`;

            row.innerHTML = `
                <td style="padding: 8px;">${place.attributes.id}</td>
                <td style="padding: 8px;"><a href="${permalink}" target="_blank" title="Abrir en una nueva pestaña">Ver en mapa</a></td>
                <td style="padding: 8px;">${category}</td>
                <td style="padding: 8px;">${newName}</td>
                <td style="padding: 8px; text-align: center;">
                    <input type='checkbox' class='approve-checkbox' data-id='${place.attributes.id}' checked>
                </td>
                <td style="padding: 8px; text-align: center;">
                    <input type='checkbox' class='delete-checkbox' data-id='${place.attributes.id}'>
                </td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        modal.appendChild(table);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';

        const createButton = (text, color, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.padding = '8px 16px';
            btn.style.background = color;
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.onclick = onClick;
            return btn;
        };

        buttonContainer.appendChild(createButton('Cancelar', '#f44336', () => modal.remove()));
        buttonContainer.appendChild(createButton('Aplicar Cambios', '#4CAF50', () => applyChanges(places)));
        modal.appendChild(buttonContainer);
        document.body.appendChild(modal);
    }

    async function applyChanges(places) {
        const modal = document.getElementById('wme-auto-name-modal');
        if (!modal) return;

        const applyBtn = modal.querySelector('button:last-child');
        const tableRows = modal.querySelectorAll("tbody tr");
        const UpdateObject = require("Waze/Action/UpdateObject");
        const DeleteObject = require("Waze/Action/DeleteObject");

        if (!tableRows.length) {
            alert('No hay lugares en la tabla para procesar.');
            return;
        }

        try {
            applyBtn.disabled = true;
            applyBtn.textContent = 'Guardando...';
            applyBtn.style.background = '#cccccc';

            let renamedCount = 0;
            let deletedCount = 0;

            for (const row of tableRows) {
                const approveCheckbox = row.querySelector('.approve-checkbox');
                const deleteCheckbox = row.querySelector('.delete-checkbox');
                const placeId = approveCheckbox.dataset.id;
                const place = W.model.venues.getObjectById(placeId);

                if (!place) {
                    console.warn(`⛔ No se encontró el lugar con ID: ${placeId}`);
                    continue;
                }

                if (deleteCheckbox.checked) {
                    try {
                        const action = new DeleteObject(place);
                        W.model.actionManager.add(action);
                        console.log(`🗑️ Lugar programado para eliminación: ID ${placeId}`);
                        deletedCount++;
                    } catch (error) {
                        console.error(`⛔ Error al eliminar el lugar ${placeId}:`, error);
                    }
                } else if (approveCheckbox.checked) {
                    const newName = generateName(place);
                    const currentName = place.attributes.name || "";
                    if (newName && newName !== "" && currentName.trim() !== newName) {
                        try {
                            const action = new UpdateObject(place, { name: newName });
                            W.model.actionManager.add(action);
                            console.log(`✅ Nombre actualizado: "${currentName}" → "${newName}"`);
                            renamedCount++;
                        } catch (error) {
                            console.error(`⛔ Error actualizando place ${placeId}:`, error);
                        }
                    } else {
                        console.log(`⏭ Sin cambios de nombre para ID ${placeId}`);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenUpdates));
            }

            modal.remove();

            const changesMade = renamedCount > 0 || deletedCount > 0;
            if (changesMade) {
                let messageParts = [];
                if (renamedCount > 0) messageParts.push(`${renamedCount} lugar${renamedCount > 1 ? 'es' : ''} renombrado${renamedCount > 1 ? 's' : ''}`);
                if (deletedCount > 0) messageParts.push(`${deletedCount} lugar${deletedCount > 1 ? 'es' : ''} eliminado${deletedCount > 1 ? 's' : ''}`);
                alert(`💾 ${messageParts.join(' y ')}. Recuerda presionar el botón de guardar en el editor.`);
                W.map?.invalidate?.();
            } else {
                alert("ℹ️ No se seleccionó ninguna acción para aplicar.");
            }

        } catch (error) {
            console.error('⛔ Error al aplicar cambios:', error);
            alert('Error al guardar cambios: ' + (error.message || error));
        } finally {
            if (applyBtn) {
                applyBtn.disabled = false;
                applyBtn.textContent = 'Aplicar Cambios';
                applyBtn.style.background = '#4CAF50';
            }
        }
    }

    function addScriptToSettingsTab() {
        const tabName = 'Auto Name Places';
        const tabSelector = `#user-tabs a[title="${tabName}"]`;

        if (document.querySelector(tabSelector)) return;

        const observer = new MutationObserver((mutations, obs) => {
            const settingsPanel = document.querySelector("#user-tabs");
            if (settingsPanel) {
                obs.disconnect();
                const newTab = document.createElement("li");
                newTab.innerHTML = `<a href="#" title="${tabName}">${tabName}</a>`;
                settingsPanel.appendChild(newTab);
                newTab.querySelector('a').addEventListener("click", function(e) {
                    e.preventDefault();
                    init();
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function init() {
        try {
            await waitForWME();
            const unnamedPlaces = getUnnamedPlaces();
            if (!unnamedPlaces.length) {
                alert("No se encontraron Places sin nombre en el área actual.");
                return;
            }
            createApprovalTable(unnamedPlaces);
        } catch (error) {
            console.error('⛔ Error en init:', error);
            alert('Error al buscar places sin nombre: ' + (error.message || error));
        }
    }

    waitForWME().then(() => {
        addScriptToSettingsTab();
    }).catch(error => {
        console.error('⛔ Error al inicializar WME:', error);
    });
})();