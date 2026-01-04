// ==UserScript==
// @name         WME GPX/KML Segment Selector
// @namespace    https://waze.com/editor
// @version      1.1
// @description  Select Waze Map Editor segments based on GPX/KML file import
// @author       Dosojintaizo
// @license         MIT/BSD/X11
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @include     https://beta.waze.com/editor*
// @include     https://beta.waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520500/WME%20GPXKML%20Segment%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/520500/WME%20GPXKML%20Segment%20Selector.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Wait until WME is ready
    if (!W?.userscripts?.state.isReady) {
        await new Promise(resolve => {
            document.addEventListener('wme-ready', resolve, { once: true });
        });
    }

    console.log('WME KML Segment Inspector loaded.');

    // Register a sidebar tab for the userscript
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('kml-segment-inspector');

    tabLabel.innerText = 'KML Inspector';
    tabLabel.title = 'Inspect and select segments using a KML file';

    // Create content for the tab
    tabPane.innerHTML = `
        <div style="padding: 10px;">
            <h3>KML Segment Inspector</h3>
            <p>Upload a KML file to inspect and select segments near the path:</p>
            <input type="file" id="kmlFileInput" accept=".kml" />
            <p id="statusMessage" style="color: green; margin-top: 10px;"></p>
            <textarea id="segmentList" style="width: 100%; height: 200px; margin-top: 10px;" readonly></textarea>
        </div>
    `;

    const kmlFileInput = tabPane.querySelector('#kmlFileInput');
    const statusMessage = tabPane.querySelector('#statusMessage');
    const segmentList = tabPane.querySelector('#segmentList');

    kmlFileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        statusMessage.innerText = 'Reading file...';
        segmentList.value = '';

        try {
            const content = await file.text();
            const coordinates = parseKML(content);
            if (coordinates.length === 0) {
                statusMessage.innerText = 'No valid coordinates found in the file.';
                return;
            }

            const crossedSegments = findCrossedSegments(coordinates);
            if (crossedSegments.length === 0) {
                statusMessage.innerText = 'No segments found matching the path.';
                return;
            }

            segmentList.value = crossedSegments.map(segment => `ID: ${segment.attributes.id}`).join('\n');
            statusMessage.innerText = `${crossedSegments.length} segments found. Selecting segments...`;

            selectSegments(crossedSegments.map(segment => segment.attributes.id));
        } catch (error) {
            console.error(error);
            statusMessage.innerText = 'Error processing the file.';
        }
    });

    // Parse KML content to extract coordinates
    function parseKML(data) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const coordinateElements = xmlDoc.getElementsByTagName('coordinates');
        const coordinates = [];

        for (const element of coordinateElements) {
            const coordText = element.textContent.trim();
            const coordPairs = coordText.split(/\s+/);

            coordPairs.forEach(pair => {
                const [lon, lat] = pair.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lon)) {
                    coordinates.push([lon, lat]);
                }
            });
        }

        return coordinates;
    }

    // Check if a segment intersects with the KML path
    function findCrossedSegments(pathCoordinates) {
        const segments = W.model.segments.getObjectArray();
        const crossedSegments = [];

        segments.forEach(segment => {
            const segmentGeometry = W.userscripts.toGeoJSONGeometry(segment.geometry);

            if (segmentGeometry.type === 'LineString') {
                const segmentCoordinates = segmentGeometry.coordinates;

                if (doesLineIntersectPath(segmentCoordinates, pathCoordinates)) {
                    crossedSegments.push(segment);
                }
            }
        });

        return crossedSegments;
    }

    // Check for intersection between a segment and the KML path
    function doesLineIntersectPath(segmentCoords, pathCoords) {
        for (let i = 0; i < pathCoords.length - 1; i++) {
            for (let j = 0; j < segmentCoords.length - 1; j++) {
                if (linesIntersect(
                    pathCoords[i], pathCoords[i + 1],
                    segmentCoords[j], segmentCoords[j + 1]
                )) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if two line segments intersect
    function linesIntersect(p1, p2, q1, q2) {
        const orientation = (p, q, r) => (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

        const o1 = orientation(p1, p2, q1);
        const o2 = orientation(p1, p2, q2);
        const o3 = orientation(q1, q2, p1);
        const o4 = orientation(q1, q2, p2);

        return o1 * o2 < 0 && o3 * o4 < 0;
    }

    // Select segments by their IDs
    function selectSegments(segmentIds) {
        if (segmentIds.length === 0) return;

        const selectionManager = W.selectionManager;
        selectionManager.setSelectedModels(segmentIds.map(id => W.model.segments.getObjectById(id)));
        console.log('Selected segments:', segmentIds);
    }

})();