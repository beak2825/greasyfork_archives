// ==UserScript==
// @name         Overpass Turbo to JSON
// @name         Overpass Turbo Export To Converter
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds a JSON export panel to Overpass Turbo. Download data, copy it, or send it to a converter tool that allows keeping properties as tags. Uses pako and osmtogeojson (MIT).
// @author       Parma
// @icon         https://geojson-converter.vercel.app/favicon.ico
// @match        *://overpass-turbo.eu/*
// @match        *://maps.mail.ru/osm/tools/overpass/*
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @require      https://unpkg.com/osmtogeojson@3.0.0-beta.5/osmtogeojson.js
// @downloadURL https://update.greasyfork.org/scripts/544986/Overpass%20Turbo%20to%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/544986/Overpass%20Turbo%20to%20JSON.meta.js
// ==/UserScript==

/*! ATTRIBUTION:
This userscript uses the following third-party libraries:
------------------------------------------------------------------------------
- pako (https://github.com/nodeca/pako)
  Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn
  Released under the MIT license.
- osmtogeojson (https://github.com/tyrasd/osmtogeojson)
  Copyright (C) 2012-2019 Martin Raifer
  Released under the MIT license.
------------------------------------------------------------------------------
*/

(function () {
    'use strict';

    let lastGeoJson = null;

    // Creates a DOM element with specified properties and children
    function createElement(tag, properties, children) {
        const element = document.createElement(tag);
        if (properties) {
            Object.keys(properties).forEach(key => {
                if (key === 'textContent') element.textContent = properties[key];
                else element[key] = properties[key];
            });
        }
        if (children) children.forEach(child => element.appendChild(child));
        return element;
    }

    // Resets button state after a timeout
    function resetBtn(button, originalText, timeout = 2000) {
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, timeout);
    }

    // Checks if GeoJSON data is available and shows alert if not
    function checkGeoJsonAvailable() {
        if (!lastGeoJson) {
            alert('No GeoJSON data available yet. Please wait for the Overpass query to finish.');
            return false;
        }
        return true;
    }

    // Downloads JSON data as a file
    function downloadJson(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Sends compressed GeoJSON to the converter tool
    function sendCompressedGeoJson(appWindow, geoJson) {
        const jsonStr = JSON.stringify(geoJson);
        const compressed = pako.deflate(jsonStr);
        const base64 = btoa(new Uint8Array(compressed).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        appWindow.postMessage({
            type: 'OVERPASS_DIRECT_DATA_COMPRESSED',
            payload: base64
        }, 'https://geojson-converter.vercel.app');
    }

    // Build properties consistent with Overpass Turbo's export
    function buildProperties(feature) {
        const p = feature && feature.properties ? feature.properties : {};
        const type = (p && p.type) != null ? p.type : undefined;
        const nid = (p && p.id) != null ? p.id : undefined;
        const idStr = feature.id || (type != null && nid != null ? `${type}/${nid}` : undefined);

        const properties = {};
        if (idStr != null) properties['@id'] = idStr;

        const reserved = new Set(['id', 'type', 'meta', 'timestamp', 'version', 'changeset', 'uid', 'user', 'geometry', 'relations']);
        let tagSource = null;
        if (p && typeof p.tags === 'object' && p.tags) {
            tagSource = p.tags;
        } else if (p && typeof p === 'object') {
            tagSource = {};
            Object.keys(p).forEach((k) => {
                // skip reserved and any keys that are Overpass-exposed fields starting with '@'
                if (reserved.has(k)) return;
                if (k.startsWith('@')) return;
                const v = p[k];
                // Only primitive-like tag values should be copied
                if (v === null) return;
                const t = typeof v;
                if (t === 'string' || t === 'number' || t === 'boolean') {
                    tagSource[k] = v;
                }
            });
        } else {
            tagSource = {};
        }
        Object.keys(tagSource).forEach((m) => {
            const key = m.replace(/^@/, '@@'); // escape leading '@'
            properties[key] = tagSource[m];
        });

        const meta = (p && typeof p.meta === 'object' && p.meta) ? p.meta : null;
        if (meta) {
            Object.keys(meta).forEach((m) => {
                properties[`@${m}`] = meta[m];
            });
        }

        if (p && (p.tainted !== undefined || p['@tainted'] !== undefined)) {
            const val = (p['@tainted'] !== undefined) ? p['@tainted'] : p.tainted;
            if (val !== undefined) properties['@tainted'] = val;
        }

        const geomHint = p && (p.geometry !== undefined ? p.geometry : p['@geometry']);
        if (geomHint !== undefined) {
            properties['@geometry'] = geomHint;
        }

        const relations = Array.isArray(p && p.relations) ? p.relations : (Array.isArray(p && p['@relations']) ? p['@relations'] : null);
        if (relations && relations.length > 0) {
            properties['@relations'] = relations;
        }

        return properties; // insertion order mirrors Overpass: @id, tags, @meta*, @tainted, @geometry, @relations
    }

    // Build GeoJSON FeatureCollection with metadata and normalized properties
    function buildGeoJson(geojson) {
        const features = (geojson && geojson.features ? geojson.features : []).map(f => ({
            type: 'Feature',
            properties: buildProperties(f),
            geometry: f.geometry,
            id: f.id || (f.properties && f.properties.type != null && f.properties.id != null ? `${f.properties.type}/${f.properties.id}` : undefined)
        }));
        return {
            type: 'FeatureCollection',
            generator: 'overpass-turbo',
            copyright: 'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.',
            timestamp: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
            features
        };
    }

    // Parse XML response from Overpass Turbo and convert to normalized GeoJSON
    function parseXmlResponse(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        try {
            return buildGeoJson(osmtogeojson(xmlDoc, { flatProperties: false }));
        } catch (err) {
            console.error('osmtogeojson XML conversion failed:', err);
            return { type: 'FeatureCollection', features: [] };
        }
    }

    // Converts GeoJSON to custom JSON format
    function convertGeoJsonToJSONFormat(geoJson) {
        const features = geoJson.features || [];
        const customCoordinates = [];

        features.forEach((feature, index) => {
            const coords = (function getFirstCoordinate(coords) {
                if (!Array.isArray(coords)) return null;
                if (coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') return [coords[0], coords[1]];
                for (const c of coords) { const r = getFirstCoordinate(c); if (r) return r; }
                return null;
            })(feature.geometry && feature.geometry.coordinates);
            if (coords) {
                customCoordinates.push({
                    lat: coords[1],
                    lng: coords[0],
                    extra: { id: index } // indexed ids for compatibility with other tools
                });
            }
        });

        return {
            name: 'overpass-json-export',
            customCoordinates: customCoordinates
        };
    }

    // Handles common conversion logic for buttons
    function handleConversion(button, originalText, successCallback, errorMessage) {
        try {
            button.textContent = 'Converting...';
            button.disabled = true;
            const convertedData = convertGeoJsonToJSONFormat(lastGeoJson);
            successCallback(convertedData, button, originalText);
        } catch (e) {
            button.textContent = errorMessage || 'Conversion failed!';
            button.disabled = false;
            console.error('Conversion failed', e);
            resetBtn(button, originalText);
        }
    }

    // Creates a standardized button class name
    function btnClass(type, extraClass) {
        const baseClass = 'button is-small is-link is-outlined';
        return `${type}-json-btn ${extraClass || type} ${baseClass}`;
    }

    // Sets button success state with timeout reset
    function markSuccess(btn, originalText, successText) {
        btn.textContent = successText;
        resetBtn(btn, originalText);
    }

    // Button configurations for different actions
    const buttonConfigs = {
        download: {
            className: btnClass('download', 'export'),
            text: 'download',
            title: 'Convert to JSON format and download',
            action: (convertedData, btn, originalText) => {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const filename = `overpass-export-${timestamp}.json`;
                downloadJson(convertedData, filename);
                markSuccess(btn, originalText, 'Downloaded!');
            }
        },
        copy: {
            className: btnClass('copy'),
            text: 'copy',
            title: 'Convert to JSON format and copy to clipboard',
            action: (convertedData, btn, originalText) => {
                const jsonString = JSON.stringify(convertedData, null, 2);
                navigator.clipboard.writeText(jsonString).then(() => {
                    markSuccess(btn, originalText, 'Copied!');
                }).catch(err => {
                    console.error('Failed to copy to clipboard:', err);
                    btn.textContent = 'Copy failed!';
                    resetBtn(btn, originalText);
                });
            }
        },
        send: {
            className: btnClass('send-converter'),
            text: 'send to converter',
            title: 'Send GeoJSON to the GeoJSON Converter Tool to select tags to keep',
            action: (btn, originalText) => {
                const appWindow = window.open('https://geojson-converter.vercel.app', '_blank');
                if (!appWindow) {
                    alert('Popup blocked! Please allow popups for this site.');
                    return;
                }
                let isSent = false;

                const sendData = () => {
                    if (isSent) return; // Prevent multiple sends
                    isSent = true;
                    window.removeEventListener('message', messageListener);

                    try {
                        sendCompressedGeoJson(appWindow, lastGeoJson);
                        markSuccess(btn, originalText, 'Sent successfully!');
                        // downloadJson(lastGeoJson, 'overpass-export.geojson'); // download geojson for debugging output
                    } catch (e) {
                        console.error("Failed to send data", e);
                        btn.textContent = 'Failed to send!';
                        resetBtn(btn, originalText);
                    }
                };

                // Wait for the converter to signal readiness
                const messageListener = (event) => {
                    if (event.data === 'CONVERTER_READY') {
                        sendData();
                    }
                };

                window.addEventListener('message', messageListener);

                // Fallback if no response in 2 seconds
                setTimeout(sendData, 2000);
            }
        }
    };

    // Creates a generic button with specified configuration
    function createButton(config) {
        const button = document.createElement('a');
        button.className = config.className;
        button.textContent = config.text;
        button.title = config.title;
        button.href = '';
        button.addEventListener('click', config.clickHandler);
        return button;
    }

    // Creates an action button using configuration
    function createActionButton(config) {
        return createButton({
            className: config.className,
            text: config.text,
            title: config.title,
            clickHandler: function (e) {
                e.preventDefault();
                if (!checkGeoJsonAvailable()) return;

                const button = this;
                if (config.className.includes('send-converter')) {
                    // Special handling for send button (no conversion needed)
                    config.action(button, config.text);
                } else {
                    handleConversion(button, config.text, config.action);
                }
            }
        });
    }

    // Updates the disabled state of all buttons based on data availability
    function updateButtonStates() {
        const buttons = document.querySelectorAll('#export-JSON .button');
        buttons.forEach(btn => {
            btn.disabled = !lastGeoJson;
        });
    }

    // Creates and injects the JSON export panel into the page
    function injectExportPanel() {
        const exportGeoJSON = document.getElementById('export-geoJSON');

        if (!exportGeoJSON) {
            return setTimeout(injectExportPanel, 300);
        }

        // Check if we already injected our JSON panel
        if (document.getElementById('export-JSON')) {
            return;
        }

        // Create buttons
        const buttons = [
            createActionButton(buttonConfigs.download),
            createActionButton(buttonConfigs.copy),
            createActionButton(buttonConfigs.send)
        ];
        buttons.forEach(btn => { btn.disabled = !lastGeoJson; });

        // Create UI structure
        const formatSpan = createElement('span', { className: 'format', textContent: 'JSON' });
        const fieldLabel = createElement('div', { className: 'field-label is-normal' }, [formatSpan]);
        const buttonsContainer = createElement('span', { className: 'buttons has-addons' }, buttons);
        const fieldBody = createElement('div', { className: 'field-body' }, [buttonsContainer]);
        const jsonPanel = createElement('p', {
            className: 'panel-block',
            id: 'export-JSON'
        }, [fieldLabel, fieldBody]);

        // Insert the JSON panel before the GeoJSON panel
        exportGeoJSON.parentNode.insertBefore(jsonPanel, exportGeoJSON);
    }

    // Monitors API requests and processes Overpass responses
    function monitorApiRequests() {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (body) {
            this.addEventListener('load', function () {
                if (this.responseURL.includes('interpreter')) {
                    try {
                        let responseData;
                        // Try to parse raw data as JSON first
                        try {
                            responseData = JSON.parse(this.responseText);
                        }
                        // If JSON parse fails, try XML parse
                        catch (e) {
                            responseData = parseXmlResponse(this.responseText);
                        }

                        // Convert raw data to GeoJSON and store
                        if (responseData && responseData.elements) {
                            try {
                                lastGeoJson = buildGeoJson(osmtogeojson(responseData, { flatProperties: false }));
                            } catch (err) {
                                console.error('osmtogeojson JSON conversion failed:', err);
                                lastGeoJson = { type: 'FeatureCollection', features: [] };
                            }
                        } else {
                            lastGeoJson = { type: 'FeatureCollection', features: [] };
                        }
                    } catch (error) {
                        console.error('Error processing Overpass response:', error);
                    }
                }
            });

            return originalSend.apply(this, arguments);
        };
    }

    function init() {
        monitorApiRequests();
        injectExportPanel();

        const exportButton = document.querySelector('[data-ide-handler="click:onExportClick"]');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                setTimeout(injectExportPanel, 100);
            });
        }

        setInterval(updateButtonStates, 500);
    }

    // Start the script when DOM is ready
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();