// ==UserScript==
// @name         WME Limpiador de Emojis
// @namespace    https://greasyfork.org/es-419/users/67894-crotalo
// @version      1.0
// @description  Busca Places con emojis en sus nombres, los muestra en una ventana modal para aprobación y permite corregirlos
// @author       Crotalo
// @match        https://www.waze.com/*editor*
// @match        https://beta.waze.com/*editor*
// @exclude      https://beta.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543898/WME%20Limpiador%20de%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/543898/WME%20Limpiador%20de%20Emojis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        delayBetweenUpdates: 50,
        modalStyle: {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', padding: '20px', border: '2px solid #337ab7', borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: '10001', maxHeight: '80vh',
            overflowY: 'auto', width: 'auto', minWidth: '600px'
        }
    };

    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

    function waitForWME() {
        return new Promise(resolve => {
            const checkWME = () => {
                if (window.W && W.model && W.map && W.model.venues && W.model.actionManager && document.getElementById('user-tabs')) {
                    resolve();
                } else { setTimeout(checkWME, 500); }
            };
            checkWME();
        });
    }

    function getPlacesWithEmojis() {
        if (!W.model.venues?.objects || !W.map) return [];
        const mapBounds = W.map.getExtent();
        if (!mapBounds) {
            console.error("Limpiador de Emojis: No se pudieron obtener los límites del mapa.");
            return [];
        }
        const foundPlaces = [];
        for (const id in W.model.venues.objects) {
            const place = W.model.venues.getObjectById(id);
            if (!place || place.isDeleted() || !place.geometry) {
                continue;
            }
            const placeBounds = place.geometry.getBounds();
            if (placeBounds && mapBounds.intersectsBounds(placeBounds)) {
                const hasEmojiInName = emojiRegex.test(place.attributes.name);
                const hasEmojiInAliases = place.attributes.aliases.some(alias => emojiRegex.test(alias));
                if (hasEmojiInName || hasEmojiInAliases) {
                    foundPlaces.push(place);
                }
            }
        }
        return foundPlaces;
    }

    function generateCleanedNames(place) {
        const clean = (text) => text.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
        const cleanedName = clean(place.attributes.name);
        const cleanedAliases = place.attributes.aliases.map(clean).filter(Boolean);
        return { name: cleanedName, aliases: cleanedAliases };
    }

    function createApprovalTable(places) {
        document.getElementById('wme-emoji-cleaner-modal')?.remove();
        const modal = document.createElement('div');
        modal.id = 'wme-emoji-cleaner-modal';
        Object.assign(modal.style, CONFIG.modalStyle);
        modal.innerHTML = `
            <button id="wme-emoji-cleaner-close" style="position:absolute; right:10px; top:10px; background:transparent; border:none; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
            <h3 style="margin-top:0; color:#337ab7;">Limpiador de Emojis (${places.length} encontrados)</h3>
            <p style="font-size:12px; margin-bottom:15px;">Revisa los lugares y desmarca aquellos que no quieras modificar.</p>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
                <thead>
                    <tr style="background-color:#f5f5f5;"><th style="padding:8px; text-align:left; border-bottom:1px solid #ddd;">Nombre Original</th><th style="padding:8px; text-align:left; border-bottom:1px solid #ddd;">Nombre Limpio (Propuesto)</th><th style="padding:8px; text-align:center; border-bottom:1px solid #ddd; width:80px;">Aprobar</th></tr>
                </thead>
                <tbody>
                    ${places.map(place => {
                        const { name: cleanedName } = generateCleanedNames(place);
                        return `<tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 8px; word-break: break-all;">${place.attributes.name}</td>
                                    <td style="padding: 8px; color: #28a745; word-break: break-all;">${cleanedName}</td>
                                    <td style="padding: 8px; text-align: center;">
                                        <input type="checkbox" data-id="${place.attributes.id}" checked style="cursor:pointer; width:18px; height:18px;">
                                        </td>
                                </tr>`;
                    }).join('')}
                </tbody>
            </table>
            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                <button id="wme-emoji-cleaner-cancel" class="wz-button" style="background-color:#f44336; color:white;">Cancelar</button>
                <button id="wme-emoji-cleaner-apply" class="wz-button wz-primary">Aplicar ${places.length} Cambios</button>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('wme-emoji-cleaner-close').onclick = () => modal.remove();
        document.getElementById('wme-emoji-cleaner-cancel').onclick = () => modal.remove();
        document.getElementById('wme-emoji-cleaner-apply').onclick = () => applyChanges();
        modal.querySelectorAll("input[type='checkbox']").forEach(cb => {
            cb.onchange = () => {
                const checkedCount = modal.querySelectorAll("input[type='checkbox']:checked").length;
                document.getElementById('wme-emoji-cleaner-apply').textContent = `Aplicar ${checkedCount} Cambios`;
            };
        });
    }

    async function applyChanges() {
        const modal = document.getElementById('wme-emoji-cleaner-modal');
        if (!modal) return;
        const applyBtn = document.getElementById('wme-emoji-cleaner-apply');
        const checkboxes = modal.querySelectorAll("input[type='checkbox']:checked");
        const UpdateObject = require("Waze/Action/UpdateObject");
        if (!checkboxes.length) { alert('No hay cambios seleccionados para aplicar.'); return; }
        try {
            applyBtn.disabled = true; applyBtn.textContent = 'Guardando...';
            let successCount = 0;
            for (const checkbox of checkboxes) {
                const placeId = checkbox.dataset.id;
                const place = W.model.venues.getObjectById(placeId);
                if (!place) {
                    console.warn(`Limpiador de Emojis: No se encontró el lugar con ID ${placeId}.`);
                    continue;
                }
                const { name, aliases } = generateCleanedNames(place);
                const action = new UpdateObject(place, { name, aliases });
                W.model.actionManager.add(action);
                successCount++;
                await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenUpdates));
            }
            modal.remove();
            alert(`💾 ${successCount} lugares han sido limpiados. Recuerda presionar el botón de guardar de Waze para finalizar.`);
        } catch (error) {
            console.error('Limpiador de Emojis - Error al aplicar cambios:', error);
            alert('Ocurrió un error al guardar los cambios: ' + error.message);
            applyBtn.disabled = false; applyBtn.textContent = 'Aplicar Cambios';
        }
    }

    function runScript() {
        const placesWithEmojis = getPlacesWithEmojis();
        if (placesWithEmojis === null) return;
        if (!placesWithEmojis.length) {
            alert("¡Buenas noticias! No se encontraron lugares con emojis en la pantalla actual.");
            return;
        }
        createApprovalTable(placesWithEmojis);
    }

    function setupUI() {
        const userTabs = document.querySelector("#user-tabs .nav-tabs");
        if (!userTabs) return;
        const tabButton = document.createElement("li");
        tabButton.innerHTML = `<a href="#" title="Limpiar Emojis de Lugares">🧹 Limpiar Emojis</a>`;
        tabButton.addEventListener("click", function(e) {
            e.preventDefault();
            userTabs.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            tabButton.classList.add('active');
            runScript();
        });
        userTabs.appendChild(tabButton);
    }

    waitForWME().then(setupUI).catch(err => console.error("Limpiador de Emojis: Error al inicializar.", err));
})();