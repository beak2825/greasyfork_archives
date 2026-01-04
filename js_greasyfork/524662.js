// ==UserScript==
// @name         WME StreetTagger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to facilitate street naming using an API.
// @author       Astheron
// @match        https://www.waze.com/*
// @grant        GM_xmlhttpRequest
// @connect      openstreetmap.org
// @connect      update.greasyfork.org
// @license      MIT
// @run-at       document-idle
// @supportURL   https://www.waze.com/es/user/editor/Astheron
// @downloadURL https://update.greasyfork.org/scripts/524662/WME%20StreetTagger.user.js
// @updateURL https://update.greasyfork.org/scripts/524662/WME%20StreetTagger.meta.js
// ==/UserScript==

/**
 * License and Credits:
 *
 * This script is licensed under the MIT License:
 * Copyright (c) 2024 Astheron
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this script and associated documentation files (the "Script"), to deal
 * in the Script without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Script, and to permit persons to whom the Script is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Script.
 *
 * THE SCRIPT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SCRIPT OR THE USE OR OTHER DEALINGS IN THE
 * SCRIPT.
 *
 * **Contact:** For more details or inquiries, you can contact the author, Astheron, on the Waze forum.
 */

(function() {
    'use strict';

    const currentVersion = '1.0';
    const scriptMetaUrl = 'https://update.greasyfork.org/scripts/524662/meta.js';

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: scriptMetaUrl,
            onload: function(response) {
                const meta = response.responseText;
                const newVersion = getVersionFromMeta(meta);
                if (isNewVersion(newVersion, currentVersion)) {
                    showUpdateNotification(newVersion);
                }
            },
            onerror: function(error) {
                console.error('Error checking for updates:', error);
            }
        });
    }

    function getVersionFromMeta(meta) {
        const versionMatch = meta.match(/@version\s+(\d+\.\d+)/);
        return versionMatch ? versionMatch[1] : null;
    }

    function isNewVersion(newVersion, currentVersion) {
        if (!newVersion) return false;
        const newVerParts = newVersion.split('.').map(Number);
        const currentVerParts = currentVersion.split('.').map(Number);

        for (let i = 0; i < newVerParts.length; i++) {
            if (newVerParts[i] > (currentVerParts[i] || 0)) {
                return true;
            } else if (newVerParts[i] < (currentVerParts[i] || 0)) {
                return false;
            }
        }
        return false;
    }

    function showUpdateNotification(newVersion) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = '#fff';
        notification.style.padding = '20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.fontSize = '16px';
        notification.style.textAlign = 'center';
        notification.style.zIndex = '9999';

        notification.innerHTML = `
            <strong>New version ${newVersion} is available!</strong><br>
            A new version of WME StreetTagger is available. Would you like to update it?<br><br>
            <button id="updateButton" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #007bff; border: none; color: white; border-radius: 4px;">
                Update Now
            </button>
        `;

        document.body.appendChild(notification);

        document.getElementById('updateButton').addEventListener('click', function() {
            window.open('https://greasyfork.org/en/scripts/524662-wme-streettagger', '_blank');
            notification.remove();
        });

        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    checkForUpdates();

    const translations = {
        en: {
            title: 'WME StreetTagger',
            button: 'Fill Street Name',
            success: 'Street name filled successfully.',
            noName: 'No street name found.',
            error: 'Error fetching street name.',
            loading: 'Fetching street name...',
            selectSegment: 'Please select a segment first.',
            apply: 'Apply',
            tooManySegments: 'For safety, please select less than 5 segments at a time.'
        },
        es: {
            title: 'WME Etiquetador de Calles',
            button: 'Rellenar Nombre de Calle',
            success: 'Nombre de calle rellenado exitosamente.',
            noName: 'No se encontró nombre de calle.',
            error: 'Error al obtener el nombre de la calle.',
            loading: 'Obteniendo nombre de la calle...',
            selectSegment: 'Por favor, selecciona un segmento primero.',
            apply: 'Aplicar',
            tooManySegments: 'Por seguridad, por favor selecciona menos de 5 segmentos a la vez.'
        },
        ca: {
            title: 'WME Etiquetador de Carrers',
            button: 'Omplir Nom de Carrer',
            success: 'Nom de carrer omplert correctament.',
            noName: 'No s\'ha trobat nom de carrer.',
            error: 'Error en obtenir el nom del carrer.',
            loading: 'Obtenint nom de carrer...',
            selectSegment: 'Si us plau, selecciona un segment primer.',
            apply: 'Aplicar',
            tooManySegments: 'Per seguretat, si us plau, selecciona menys de 5 segments alhora.'
        }
    };

    function getEditorLanguage() {
        const url = window.location.href;
        if (url.includes('/es/')) return 'es';
        if (url.includes('/ca/')) return 'ca';
        return 'en';
    }
    const lang = getEditorLanguage();
    const t = translations[lang] || translations.en;

    const WAIT_SHORT = 300;
    const WAIT_MED   = 500;

    let isButtonInjected = false;

    setInterval(() => {
        const sidebar = document.querySelector('div.segment.sidebar-column');
        if (!sidebar) return;
        const foundButton = sidebar.querySelector('#auto-street-name-filler-button');
        if (!foundButton) {
            isButtonInjected = false;
            injectToolbarButton(sidebar);
        }
    }, 2000);

    function injectToolbarButton(sidebarColumn) {
        if (!sidebarColumn || isButtonInjected) return;

        const container = document.createElement('div');
        container.style.marginBottom = '20px';
        container.style.marginTop = '20px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        const button = document.createElement('button');
        button.id = 'auto-street-name-filler-button';
        button.innerText = t.button;
        button.title = t.title;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.background = 'linear-gradient(90deg, #2196F3 0%, #0D47A1 100%)';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';

        const statusMsg = document.createElement('div');
        statusMsg.id = 'auto-street-name-filler-status';
        statusMsg.style.color = '#555';
        statusMsg.style.fontSize = '14px';
        statusMsg.style.textAlign = 'center';
        statusMsg.style.marginTop = '5px';

        container.appendChild(button);
        container.appendChild(statusMsg);

        sidebarColumn.insertBefore(container, sidebarColumn.firstChild);
        isButtonInjected = true;

        button.addEventListener('click', async () => {
            const segs = getSelectedSegments();

            // Check if more than 5 segments are selected
            if (segs.length > 5) {
                statusMsg.textContent = t.tooManySegments;  // Display the warning message
                return;
            }

            statusMsg.textContent = t.loading;

            const seg = segs[0];

            const [midLat, midLon] = getSegmentMidpoint(seg);
            if (midLat === 0 && midLon === 0) {
                statusMsg.textContent = t.error;
                return;
            }

            try {
                const streetName = await fetchStreetName(midLat, midLon);
                let finalName;
                if (streetName) {
                    updateSegmentName(seg, streetName);
                    finalName = streetName;
                } else {
                    finalName = (lang === 'es') ? 'Sin nombre' :
                                (lang === 'ca') ? 'Sense nom' : 'No name';
                    updateSegmentName(seg, finalName);
                }

                await fillStreetNameAndApply(finalName);

                await sleep(WAIT_MED);

                const actual = getSegmentNameFromModel(seg);
                if (actual === finalName) {
                    statusMsg.textContent = streetName ? t.success : t.noName;
                } else {
                    statusMsg.textContent = t.error;
                }
            } catch (err) {
                console.error(err);
                statusMsg.textContent = t.error;
            }
        });
    }

    function getSelectedSegments() {
        if (W?.model?.selectionManager?.selectedSegments) {
            return W.model.selectionManager.selectedSegments;
        }
        if (W?.selectionManager?.selectedSegments) {
            return W.selectionManager.selectedSegments;
        }
        if (W?.selectionManager?.getSelectedSegments) {
            return W.selectionManager.getSelectedSegments();
        }
        if (W?.model?.segments?.getObjectArray) {
            return W.model.segments.getObjectArray().filter(s => s.isSelected());
        }
        return [];
    }

    function getSegmentMidpoint(segment) {
        let geojson = null;
        if (segment.getOLGeometry) {
            const olGeom = segment.getOLGeometry();
            geojson = W.userscripts.toGeoJSONGeometry(olGeom);
        } else if (segment.geometry) {
            geojson = W.userscripts.toGeoJSONGeometry(segment.geometry);
        } else if (segment.ol?.getGeometry) {
            const ol = segment.ol.getGeometry();
            geojson = W.userscripts.toGeoJSONGeometry(ol);
        }

        if (!geojson?.coordinates || geojson.coordinates.length < 2) {
            return [0, 0];
        }
        const from = geojson.coordinates[0];
        const to = geojson.coordinates[geojson.coordinates.length - 1];
        const midLat = (from[1] + to[1]) / 2;
        const midLon = (from[0] + to[0]) / 2;
        return [midLat, midLon];
    }

    function updateSegmentName(segment, streetName) {
        if (typeof segment.setAttribute === 'function') {
            segment.setAttribute('name', streetName);
        } else if ('name' in segment) {
            segment.name = streetName;
        } else if (segment.attributes?.name !== undefined) {
            segment.attributes.name = streetName;
        } else {
            console.warn("[NoBackspace] No se pudo actualizar name en el modelo.");
        }
    }

    function getSegmentNameFromModel(segment) {
        if (typeof segment.getAttribute === 'function') {
            const val = segment.getAttribute('name');
            if (val) return val;
        }
        if (segment.name) return segment.name;
        if (segment.attributes?.name) return segment.attributes.name;
        return "";
    }

    async function fillStreetNameAndApply(streetName) {
        await openAddressEditorIfNeeded();

        const addressEdits = deepQuerySelectorAll('div.address-edit');
        if (!addressEdits.length) return;
        const container = addressEdits[0];

        const streetAuto = deepQuerySelectorAll('wz-autocomplete.street-name', container)[0];
        if (!streetAuto) return;

        const input = findInputRecursively(streetAuto);
        if (!input) return;

        input.focus();
        await sleep(WAIT_SHORT);

        input.value = "";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        await sleep(WAIT_MED);

        input.value = streetName;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        input.disabled = true;
        await sleep(WAIT_SHORT);

        clickOutsideInAddressContainer(container, streetAuto);
        await sleep(WAIT_MED);

        const form = deepQuerySelectorAll('form.address-form', container)[0];
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
            });

            const saveButton = deepQuerySelectorAll('wz-button.save-button', container)[0];
            if (saveButton) {
                saveButton.click();
            }
        } else {
            console.log("[NoBackspace] No se encontró el formulario.");
        }

        await sleep(WAIT_MED);
    }

    function clickOutsideInAddressContainer(addressContainer, excludeElem) {
        const candidates = [...addressContainer.querySelectorAll('label, div, span')]
            .filter(el => el !== excludeElem);
        if (candidates.length) {
            candidates[0].click();
            return;
        }
        const headerSegName = document.querySelector('.header-segment-name');
        if (headerSegName) {
            headerSegName.click();
            return;
        }
        document.body.click();
    }

    async function openAddressEditorIfNeeded() {
        const streetField = deepQuerySelectorAll('wz-autocomplete.street-name')[0];
        if (streetField) {
            return;
        }

        const event = new KeyboardEvent('keydown', {
            key: 'e',
            keyCode: 69,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);

        await sleep(1000);

        const addressEditView = deepQuerySelectorAll('div.address-edit-view')[0];
        if (addressEditView && addressEditView.style.display !== 'none' && addressEditView.offsetHeight !== 0) {
            console.log("[NoBackspace] El contenedor se desplegó correctamente.");
        } else {
            console.log("[NoBackspace] El contenedor no se desplegó.");
        }
    }


    function fetchStreetName(lat, lon) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                format: 'json',
                lat: lat,
                lon: lon,
                addressdetails: 1,
                zoom: 18,
                extratags: 1,
                namedetails: 1
            });
            const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;

            GM_xmlhttpRequest({
                method: "GET",
                url,
                headers: {
                    'User-Agent': 'WME-Auto-Street-Name-Filler/1.1 (NoBackspace)',
                    'Accept': 'application/json'
                },
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            const data = JSON.parse(resp.responseText);
                            if (data && data.address) {
                                resolve(data.address.road || data.address.street || null);
                            } else {
                                resolve(null);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`Network response not ok: ${resp.status}`));
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    function deepQuerySelectorAll(selector, root = document) {
        let results = [];
        if (root.matches?.(selector)) results.push(root);
        if (root.shadowRoot) {
            results = results.concat(deepQuerySelectorAll(selector, root.shadowRoot));
        }
        for (const child of root.children || []) {
            results = results.concat(deepQuerySelectorAll(selector, child));
        }
        return results;
    }

    function findInputRecursively(element) {
        if (!element) return null;
        if (element.tagName === 'INPUT') return element;
        if (element.shadowRoot) {
            for (const child of element.shadowRoot.children) {
                const found = findInputRecursively(child);
                if (found) return found;
            }
        }
        for (const child of element.children || []) {
            const found = findInputRecursively(child);
            if (found) return found;
        }
        return null;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function init() {
        const sidebar = document.querySelector('div.segment.sidebar-column');
        if (sidebar) {
            injectToolbarButton(sidebar);
        }
    }

    if (typeof W !== 'undefined' && W.state?.isReady) {
        init();
    } else {
        document.addEventListener("wme-ready", init, { once: true });
    }

})();
