// ==UserScript==
// @name         Spexi Network Explorer Tools
// @author       Secured_ on Discord
// @namespace    http://tampermonkey.net/
// @version      2.1
// @match        https://explorer.spexi.com/*
// @require      https://unpkg.com/h3-js@3.7.2/dist/h3-js.umd.js
// @license      MIT
// @grant        none
// @run-at       document-start
// @description Button to toggle 3D (Terrain) View on the Spexi Network Explorer
// @downloadURL https://update.greasyfork.org/scripts/533567/Spexi%20Network%20Explorer%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/533567/Spexi%20Network%20Explorer%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Destructure H3 functions
    const { h3ToGeo, h3ToGeoBoundary } = h3;

    // Global state
    let mapCounter = 0;
    let lastZone = null;
    let lastMissions = [];

    // Mapbox Map interception
    function setupMapInterception() {
        Object.defineProperty(Object.prototype, '_map', {
            configurable: true,
            set(val) {
                if (
                    val &&
                    typeof val.getStyle === 'function' &&
                    typeof val.setTerrain === 'function' &&
                    typeof val.addSource === 'function'
                ) {
                    window.__spexMap = val;
                    mapCounter += 1;
                    const thisMapId = mapCounter;
                    setTimeout(() => {
                        if (mapCounter === thisMapId) {
                            injectTerrainToggle();
                        }
                    }, 100);
                }
                Object.defineProperty(this, '_map', {
                    value: val,
                    writable: true,
                    configurable: true
                });
            }
        });
    }

    // UI Modifications
    function disableRowHover() {
        const style = document.createElement('style');
        style.textContent = `.c-cmpvrW tr:hover { background: transparent !important; }`;
        document.head.appendChild(style);
    }

    function injectTerrainToggle() {
        if (!window.__spexMap) return;
        try {
            const outer = document.querySelector('.PJLV.PJLV-ihFkYvu-css');
            if (!outer) return;
            const inner = outer.querySelector('.c-kiAJIg.c-kiAJIg-iTKOFX-dir-v.c-kiAJIg-fVlWzK-spacing-s');
            if (!inner || inner.querySelector('[data-spexi-terrain-toggle]')) return;

            const btn = document.createElement('button');
            btn.className = 'c-kSHLrh c-kSHLrh-eBJLUK-variant-neutral_solid c-kSHLrh-gAsrNz-size-m c-kSHLrh-fNianW-isCircle-true c-kSHLrh-kEvnuF-cv PJLV';
            btn.textContent = '3D';
            btn.dataset.spexiTerrainToggle = 'true';
            let terrainEnabled = false;

            btn.onclick = () => {
                const map = window.__spexMap;
                if (!map) return console.error('Terrain toggle: map not ready');
                try {
                    if (!terrainEnabled) {
                        if (!map.getSource('mapbox-dem')) {
                            map.addSource('mapbox-dem', {
                                type: 'raster-dem',
                                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                                tileSize: 512,
                                maxzoom: 14
                            });
                        }
                        map.setTerrain({ source: 'mapbox-dem' });
                        btn.textContent = '2D';
                        terrainEnabled = true;
                    } else {
                        map.setTerrain(null);
                        btn.textContent = '3D';
                        terrainEnabled = false;
                    }
                } catch (err) {
                    console.error('Terrain toggle error', err);
                }
            };

            inner.insertBefore(btn, inner.firstChild);
        } catch (err) {
            console.error('injectTerrainToggle error', err);
        }
    }

    // Zone and Mission Handling
    function overrideFetch() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            const url = args[0];
            if (typeof url === 'string' && url.includes('/prod/api/zones/')) {
                const m = url.match(/\/zones\/(\w{15})/);
                const zone = m?.[1];
                if (zone) {
                    response.clone().json().then(data => {
                        if (!data?.data?.isLocked) {
                            lastZone = zone;
                            loadMissions(zone);
                        } else {
                            removeMissionSection();
                            removePreview();
                        }
                    });
                }
            }
            return response;
        };
    }

    function removeMissionSection() {
        const el = document.querySelector('.zone__flights--available');
        if (el) el.remove();
    }

    function loadMissions(h3Hash) {
        removeMissionSection();
        fetch(`https://2139ukv0g6.execute-api.ca-central-1.amazonaws.com/prod/api/missions?status=active&status=hold&zone_hash=${h3Hash}`)
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data.length) {
                    lastMissions = res.data;
                    setTimeout(() => showMissionSection(res.data), 300);
                }
            });
    }

    function showMissionSection(missions) {
        const parent = document.querySelector('.c-kiAJIg.c-kiAJIg-iTKOFX-dir-v.c-kiAJIg-fVlWzK-spacing-s.c-kiAJIg-hinyfY-fillParent-true');
        if (!parent) return;
        const before = Array.from(parent.children).find(c => c.className.includes('c-kiAJIg-ibwOCkq-css'));
        if (!before) return;

        removeMissionSection();
        const container = document.createElement('div');
        container.className = 'c-eiktij c-eiktij-hVCjZQ-background-darken c-eiktij-ivYAPe-pagination-none c-eiktij-iydAuT-inlaid-true zone__flights--available';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'c-kiAJIg c-kiAJIg-knmidH-justify-spaced c-kiAJIg-eKWVTQ-spacing-m c-kiAJIg-iTjmwG-css';
        titleWrap.innerHTML = `<p class="c-lbNOYO c-lbNOYO-jwYGDW-variant-primary_header"><span class="c-jgPCyX c-jgPCyX-eKvWLo-variant-subtle">Available Missions</span></p>`;
        container.appendChild(titleWrap);

        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'c-kiAJIg c-kiAJIg-iTKOFX-dir-v c-kiAJIg-iiQOSPq-css';
        const fillDiv = document.createElement('div');
        fillDiv.className = 'c-kiAJIg c-kiAJIg-iTKOFX-dir-v c-kiAJIg-hinyfY-fillParent-true';
        const ltrDiv = document.createElement('div');
        ltrDiv.className = 'c-KHfmY';
        ltrDiv.setAttribute('dir', 'ltr');
        ltrDiv.style.position = 'relative';
        ltrDiv.style.setProperty('--radix-scroll-area-corner-width', '0px');
        ltrDiv.style.setProperty('--radix-scroll-area-corner-height', '0px');

        const styleTag = document.createElement('style');
        styleTag.textContent = '[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}';
        ltrDiv.appendChild(styleTag);

        const viewport = document.createElement('div');
        viewport.className = 'c-ktOQXn';
        viewport.setAttribute('data-radix-scroll-area-viewport', '');
        viewport.style.overflow = 'scroll';
        const tableWrap = document.createElement('div');
        tableWrap.style.minWidth = '100%';
        tableWrap.style.display = 'table';
        const table = document.createElement('table');
        table.className = 'c-hyjINs';

        const thead = document.createElement('thead');
        thead.className = 'c-bysKvn';
        thead.innerHTML = `<tr class="c-cHCiJL c-PJLV"><th class="c-inedAR"><p></p></th><th class="c-inedAR"><p>Reward</p></th><th class="c-inedAR"><p>Flight Plan</p></th><th class="c-inedAR"><p>Created</p></th></tr>`;

        const tbody = document.createElement('tbody');
        tbody.className = 'c-cmpvrW';

        missions.forEach((m, i) => {
            const tr = document.createElement('tr');
            tr.className = 'c-cHCiJL c-gvgkRI';
            tr.dataset.index = i;
            const tdName = document.createElement('td');
            tdName.className = 'c-inedAR';
            tdName.innerHTML = `<p class="c-lbNOYO c-lbNOYO-lmEyWq-variant-secondary_body c-lbNOYO-dKdvLu-size-s">${m.flight_plan.name}</p>`;
            const tdReward = document.createElement('td');
            tdReward.className = 'c-inedAR';
            tdReward.innerHTML = `<div class="c-kiAJIg c-kiAJIg-iTKOFX-dir-v c-kiAJIg-ivYAPe-spacing-none"><p class="c-lbNOYO c-lbNOYO-kpetlT-variant-primary_body c-lbNOYO-fsvfVm-size-xs">$${Number(m.amount / 100).toFixed(2)} ${m.currency}</p><p class="c-lbNOYO c-lbNOYO-lmEyWq-variant-secondary_body">+ ${m.rp_amount} RP</p></div>`;
            const tdAct = document.createElement('td');
            tdAct.className = 'c-inedAR';
            const btn = document.createElement('button');
            btn.textContent = 'Preview';
            btn.className = 'c-kSHLrh c-kSHLrh-dXpgym-variant-primary_outline c-kSHLrh-fyQYCy-size-s PJLV';
            btn.addEventListener('click', () => previewPanorama(i));
            tdAct.appendChild(btn);
            const btn2 = document.createElement('button');
            btn2.textContent = 'Export';
            btn2.className = 'c-kSHLrh c-kSHLrh-dXpgym-variant-primary_outline c-kSHLrh-fyQYCy-size-s PJLV';
            btn2.addEventListener('click', () => showExportMenu(m));
            tdAct.appendChild(btn2);
            const tdUpdated = document.createElement('td');
            tdUpdated.className = 'c-inedAR';
            tdUpdated.innerHTML = `<p class="c-lbNOYO c-lbNOYO-lmEyWq-variant-secondary_body c-lbNOYO-dKdvLu-size-s">${timeAgo(m.created_at)}</p>`;
            tr.append(tdName, tdReward, tdAct, tdUpdated);
            tbody.appendChild(tr);
        });

        table.append(thead, tbody);
        tableWrap.appendChild(table);
        viewport.appendChild(tableWrap);
        ltrDiv.appendChild(viewport);
        fillDiv.appendChild(ltrDiv);
        scrollWrapper.appendChild(fillDiv);
        container.appendChild(scrollWrapper);
        parent.insertBefore(container, before);
    }

    // Utility Functions
    function timeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `just now`;
    }

    function toRadians(d) {
        return d * Math.PI / 180;
    }

    function toDegrees(r) {
        return r * 180 / Math.PI;
    }

    function destinationPoint(lat, lng, dist, bearing) {
        const R = 6371000,
            δ = dist / R,
            θ = toRadians(bearing),
            φ1 = toRadians(lat),
            λ1 = toRadians(lng);
        const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
        const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
        return [toDegrees(φ2), ((toDegrees(λ2) + 540) % 360) - 180];
    }

    function distanceBetween([lat1, lng1], [lat2, lng2]) {
        const R = 6371000;
        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function calculateBearing(p1, p2) {
        if (!p1 || !p2 || !p1[0] || !p2[0]) {
            throw new Error("Invalid points for bearing calculation");
        }
        const lat1 = toRadians(p1[0]);
        const lng1 = toRadians(p1[1]);
        const lat2 = toRadians(p2[0]);
        const lng2 = toRadians(p2[1]);
        const dLng = lng2 - lng1;
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        return (toDegrees(Math.atan2(y, x)) + 360) % 360;
    }

    function lineIntersects(p1, p2, p3, p4) {
        const denom = (p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]);
        if (Math.abs(denom) < 1e-10) return null;

        const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denom;
        const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            const x = p1[0] + ua * (p2[0] - p1[0]);
            const y = p1[1] + ua * (p2[1] - p1[1]);
            return [x, y];
        }
        return null;
    }

    function densifyLine(coords, maxSpacingMeters = 50) {
        const densified = [];
        for (let i = 0; i < coords.length - 1; i++) {
            const [startLat, startLng] = coords[i];
            const [endLat, endLng] = coords[i + 1];
            const distance = distanceBetween([startLat, startLng], [endLat, endLng]);
            const numExtraPoints = Math.floor(distance / maxSpacingMeters);
            densified.push([startLat, startLng]);

            for (let j = 1; j <= numExtraPoints; j++) {
                const fraction = j / (numExtraPoints + 1);
                const interpLat = startLat + (endLat - startLat) * fraction;
                const interpLng = startLng + (endLng - startLng) * fraction;
                densified.push([interpLat, interpLng]);
            }
        }
        densified.push(coords[coords.length - 1]);
        return densified;
    }

    // Panorama and Map Rendering
    function makeCirclePolygon([lat, lng], radius = 5, sides = 32) {
        const coords = [];
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * 2 * Math.PI;
            const dx = radius * Math.cos(angle);
            const dy = radius * Math.sin(angle);
            const dest = destinationPoint(lat, lng, Math.sqrt(dx * dx + dy * dy), toDegrees(Math.atan2(dx, dy)));
            coords.push([dest[1], dest[0]]);
        }
        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coords]
            }
        };
    }

    function get7PanoramaPoints(zoneHash) {
        const center = h3ToGeo(zoneHash);
        const boundary = h3ToGeoBoundary(zoneHash, true);
        const pts = [center];
        const ratio = 0.622;
        for (let i = 0; i < 6; i++) {
            const [lng2, lat2] = boundary[i];
            const [lat1, lng1] = center;
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lng2 - lng1);
            const φ1 = toRadians(lat1);
            const φ2 = toRadians(lat2);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = 6371000 * c;
            const y = Math.sin(dLon) * Math.cos(φ2);
            const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLon);
            const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;
            pts.push(destinationPoint(lat1, lng1, dist * ratio, bearing));
        }
        return pts;
    }

    function getEdgeWaypoints(zoneHash) {
        const boundary = h3ToGeoBoundary(zoneHash, false);
        let longestEdge = { length: 0, startIdx: 0, endIdx: 0 };
        for (let i = 0; i < boundary.length; i++) {
            const p1 = boundary[i];
            const p2 = boundary[(i + 1) % boundary.length];
            const lat1 = toRadians(p1[0]);
            const lng1 = toRadians(p1[1]);
            const lat2 = toRadians(p2[0]);
            const lng2 = toRadians(p2[1]);
            const dLat = lat2 - lat1;
            const dLng = lng2 - lng1;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = 6371000 * c;
            if (distance > longestEdge.length) {
                longestEdge = { length: distance, startIdx: i, endIdx: (i + 1) % boundary.length };
            }
        }

        const startLongest = longestEdge.startIdx;
        const endLongest = longestEdge.endIdx;
        const startVertexIdx = (startLongest + boundary.length - 1) % boundary.length;
        const endVertexIdx = (endLongest + 1) % boundary.length;
        const startVertex = boundary[startVertexIdx];
        const endVertex = boundary[endVertexIdx];
        const startUp = boundary[(startVertexIdx + 1) % boundary.length];
        const startDown = boundary[(startVertexIdx + boundary.length - 1) % boundary.length];
        const endUp = boundary[(endVertexIdx + 1) % boundary.length];
        const endDown = boundary[(endVertexIdx + boundary.length - 1) % boundary.length];
        const ratio = 0.232;
        const sUp = interpolatePoints(startVertex, startUp, ratio, 4);
        const sDown = interpolatePoints(startVertex, startDown, ratio, 4);
        const eUp = interpolatePoints(endVertex, endUp, ratio, 4);
        const eDown = interpolatePoints(endVertex, endDown, ratio, 4);

        const ordered = [
            sDown[3], eUp[3], eUp[2], sDown[2], sDown[1], eUp[1], eUp[0], sDown[0],
            startVertex, endVertex, eDown[0], sUp[0], sUp[1], eDown[1], eDown[2], sUp[2], sUp[3], eDown[3]
        ];

        const coords = densifyLine(ordered, 25);
        return { coords };
    }

    function getEdgeWaypointsGridMap(zoneHash) {
        const boundary = h3ToGeoBoundary(zoneHash, false);
        let longestEdge = { length: 0, startIdx: 0 };
        for (let i = 0; i < boundary.length; i++) {
            const [aLat, aLng] = boundary[i];
            const [bLat, bLng] = boundary[(i + 1) % boundary.length];
            const d = distanceBetween([aLat, aLng], [bLat, bLng]);
            if (d > longestEdge.length) {
                longestEdge = { length: d, startIdx: i };
            }
        }

        const startIdx = (longestEdge.startIdx + 5) % 6;
        const endIdx = (longestEdge.startIdx + 2) % 6;
        const start = boundary[startIdx];
        const end = boundary[endIdx];
        const startUp = boundary[(startIdx + 1) % 6];
        const startDown = boundary[(startIdx + 5) % 6];
        const endUp = boundary[(endIdx + 1) % 6];
        const endDown = boundary[(endIdx + 5) % 6];
        const ratio = 0.232;
        const sUp = interpolatePoints(start, startUp, ratio, 4);
        const sDown = interpolatePoints(start, startDown, ratio, 4);
        const eUp = interpolatePoints(end, endUp, ratio, 4);
        const eDown = interpolatePoints(end, endDown, ratio, 4);

        const firstPart = [
            sDown[3], eUp[3], eUp[2], sDown[2], sDown[1], eUp[1], eUp[0], sDown[0],
            start, end, eDown[0], sUp[0], sUp[1], eDown[1], eDown[2], sUp[2], sUp[3], eDown[3]
        ];

        const firstPartBearing = calculateBearing(start, end);
        const perpendicularBearing = (firstPartBearing + 90) % 360;
        const lineStart = sDown[3];
        const lineEnd = eUp[3];
        const pointOnSecondLine = sDown[2];
        const bearingLine = calculateBearing(lineStart, lineEnd);
        const bearingToPoint = calculateBearing(lineStart, pointOnSecondLine);
        let angleDiffWithLine = Math.abs(bearingToPoint - bearingLine);
        if (angleDiffWithLine > 180) angleDiffWithLine = 360 - angleDiffWithLine;
        const directDistToPoint = distanceBetween(lineStart, pointOnSecondLine);
        const d = directDistToPoint * Math.sin(toRadians(angleDiffWithLine));
        const yellowVertexIdx = (longestEdge.startIdx - 1 + 6) % 6;
        const blueVertexIdx = (longestEdge.startIdx + 2) % 6;
        const yellowVertex = boundary[yellowVertexIdx];
        const blueVertex = boundary[blueVertexIdx];
        const directBearing = calculateBearing(yellowVertex, blueVertex);
        const directDistance = distanceBetween(yellowVertex, blueVertex);
        let angleDiff = Math.abs(directBearing - perpendicularBearing);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        if (angleDiff > 90) angleDiff = 180 - angleDiff;
        const sinAngle = Math.sin(toRadians(angleDiff));
        const adjustedStepDistance = sinAngle > 1e-6 ? d / sinAngle : d;
        const scanGapCount = Math.floor(directDistance / adjustedStepDistance);

        const waypoints = {};
        let waypointCounter = 1;

        for (let i = 0; i <= scanGapCount; i++) {
            let currentPoint = (i === 0) ? yellowVertex : destinationPoint(
                yellowVertex[0], yellowVertex[1],
                i * adjustedStepDistance, directBearing
            );

            const lStart = destinationPoint(currentPoint[0], currentPoint[1], 2000, perpendicularBearing);
            const lEnd = destinationPoint(currentPoint[0], currentPoint[1], 2000, (perpendicularBearing + 180) % 360);
            const intersections = [];
            for (let j = 0; j < boundary.length; j++) {
                const inter = lineIntersects(lStart, lEnd, boundary[j], boundary[(j + 1) % boundary.length]);
                if (inter) intersections.push(inter);
            }

            intersections.sort((a, b) => distanceBetween(currentPoint, a) - distanceBetween(currentPoint, b));
            if (intersections.length >= 2) {
                if (waypointCounter <= 22) waypoints[`WAYPOINT ${waypointCounter++}`] = intersections[0];
                if (waypointCounter <= 22) waypoints[`WAYPOINT ${waypointCounter++}`] = intersections[1];
            }
        }

        const waypointOrder = [
            "WAYPOINT 22", "WAYPOINT 21", "WAYPOINT 19", "WAYPOINT 20",
            "WAYPOINT 18", "WAYPOINT 17", "WAYPOINT 16", "WAYPOINT 15",
            "WAYPOINT 13", "WAYPOINT 14", "WAYPOINT 12", "WAYPOINT 11",
            "WAYPOINT 9", "WAYPOINT 10", "WAYPOINT 8", "WAYPOINT 7",
            "WAYPOINT 5", "WAYPOINT 6", "WAYPOINT 4", "WAYPOINT 3",
            "WAYPOINT 1", "WAYPOINT 2"
        ];

        const secondPart = waypointOrder.map(name => waypoints[name]).filter(Boolean);
        const firstPartOffset = offsetFirstPart(firstPart, 50);
        const secondPartOffset = offsetSecondPart(secondPart, 50);
        const coords = densifyLine([...firstPartOffset, ...secondPartOffset], 25);
        return { coords };
    }

    function interpolatePoints(p1, p2, ratio, count) {
        const points = [];
        for (let i = 1; i <= count; i++) {
            const lat = p1[0] + (p2[0] - p1[0]) * ratio * i;
            const lng = p1[1] + (p2[1] - p1[1]) * ratio * i;
            points.push([lat, lng]);
        }
        return points;
    }

    function offsetFirstPart(firstPart, offsetDistance) {
        return firstPart.map((pt, i) => {
            let bearing = i % 2 === 0
                ? calculateBearing(pt, firstPart[i + 1])
                : calculateBearing(firstPart[i - 1], pt);
            const offsetBearing = (bearing + 180) % 360;
            return destinationPoint(pt[0], pt[1], offsetDistance, offsetBearing);
        });
    }

    function offsetSecondPart(secondPart, offsetDistance) {
        return secondPart.map((pt, i) => {
            let bearing = i % 2 === 0
                ? calculateBearing(pt, secondPart[i + 1])
                : calculateBearing(secondPart[i - 1], pt);
            const offsetBearing = (bearing + 180) % 360;
            return destinationPoint(pt[0], pt[1], offsetDistance, offsetBearing);
        });
    }

    function previewPanorama(index) {
        if (!window.__spexMap) return console.error('Map not ready');
        const map = window.__spexMap;

        // Clear previous previews
        ['pan-extrusions', 'map-lines'].forEach(layer => {
            if (map.getLayer(layer)) map.removeLayer(layer);
            if (map.getSource(layer)) map.removeSource(layer);
        });

        const mission = lastMissions[index];
        const flightPlanId = mission.flight_plan_id;

        if (flightPlanId === 1 || flightPlanId === 4) {
            const { coords } = flightPlanId === 1 ? getEdgeWaypoints(lastZone) : getEdgeWaypointsGridMap(lastZone);
            const lineGeoJSON = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coords.map(([lat, lng]) => [lng, lat])
                    }
                }]
            };

            map.addSource('map-lines', { type: 'geojson', data: lineGeoJSON });
            map.addLayer({
                id: 'map-lines',
                type: 'line',
                source: 'map-lines',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 2
                }
            });

            const first = coords[0];
            map.flyTo({ center: [first[1], first[0]], zoom: 15 });
        } else {
            let extrusionFeatures = [];
            if (flightPlanId === 3) {
                const center = h3ToGeo(lastZone);
                extrusionFeatures = [makeCirclePolygon(center)];
            } else {
                const points = get7PanoramaPoints(lastZone);
                extrusionFeatures = points.map(p => makeCirclePolygon(p));
            }

            const extrusionGeoJSON = {
                type: 'FeatureCollection',
                features: extrusionFeatures
            };

            map.addSource('pan-extrusions', { type: 'geojson', data: extrusionGeoJSON });
            map.addLayer({
                id: 'pan-extrusions',
                type: 'fill-extrusion',
                source: 'pan-extrusions',
                paint: {
                    'fill-extrusion-color': '#ff5050',
                    'fill-extrusion-height': 80,
                    'fill-extrusion-base': 79.9,
                    'fill-extrusion-opacity': 0.95
                }
            });

            const center = extrusionFeatures[0].geometry.coordinates[0][0];
            map.flyTo({ center, zoom: 15 });
        }
    }

    function removePreview() {
        const map = window.__spexMap;
        if (!map) return;
        ['pan-points', 'pan-line', 'pan-extrusions', 'map-lines'].forEach(layer => {
            if (map.getLayer(layer)) map.removeLayer(layer);
            if (map.getSource(layer)) map.removeSource(layer);
        });
    }

    // Export Functions
    function showExportMenu(mission) {
        const existing = document.getElementById('export-flight-path');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'export-flight-path';
        overlay.className = 'c-kGOqqW';
        overlay.style = `
              background: rgba(0, 0, 0, 0.85);
              position: fixed;
              inset: 0;
              display: grid;
              place-items: center;
              z-index: 9999;
          `;

        const box = document.createElement('div');
        box.style = `
              background: #111;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              width: 240px;
              position: relative;
          `;

        const close = document.createElement('button');
        close.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        close.style = `
              position: absolute;
              top: 8px;
              right: 8px;
              background: transparent;
              border: none;
              color: white;
              cursor: pointer;
          `;
        close.onclick = () => overlay.remove();

        const title = document.createElement('h3');
        title.textContent = 'Export Flight Path';
        title.style = 'margin-top: 0; color: white;';

        const label = document.createElement('label');
        label.textContent = 'Format';
        label.style = 'color: white; display: block; margin: 8px 0 4px';

        const select = document.createElement('select');
        select.className = 'c-bFBfUq-biYssy-variant-input';
        select.style = `
              background: var(--colors-input_background);
              border: 1px solid var(--colors-input_border);
              border-radius: var(--radii-input);
              color: var(--colors-input_foreground);
              font-family: var(--fonts-body);
              font-size: var(--fontSizes-input);
              justify-content: space-between;
              padding: var(--space-3) var(--space-5);
              width: 100%;
          `;
        const opt0 = document.createElement('option');
        opt0.disabled = true;
        opt0.selected = true;
        opt0.textContent = 'Select format';
        const opt1 = document.createElement('option');
        opt1.value = 'geojson';
        opt1.textContent = '.geojson';
        const opt2 = document.createElement('option');
        opt2.value = 'kml';
        opt2.textContent = '.kml (Google Earth)';
        select.append(opt0, opt1, opt2);

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        exportBtn.className = 'c-kSHLrh c-kSHLrh-dXpgym-variant-primary_outline c-kSHLrh-fyQYCy-size-s PJLV';
        exportBtn.style.marginTop = '12px';
        exportBtn.onclick = () => {
            const format = select.value;
            if (!format || format === 'Select format') return alert('Please select a format');

            const points = mission.flight_plan_id === 3
                ? [h3ToGeo(lastZone)]
                : mission.flight_plan_id === 1
                    ? getEdgeWaypoints(lastZone).coords
                    : mission.flight_plan_id === 4
                        ? getEdgeWaypointsGridMap(lastZone).coords
                        : densifyLine(get7PanoramaPoints(lastZone), 25);

            if (format === 'kml') {
                exportFlightPathKML(mission, points);
            } else if (format === 'geojson') {
                exportFlightPathGeoJSON(mission, points);
            } else {
                alert(`Unsupported format selected: ${format}`);
            }
        };

        box.append(close, title, label, select, exportBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function exportFlightPathKML(mission, points) {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
      <name>${mission.zone_hash}-${mission.flight_plan.name} v${mission.flight_plan.version}</name>
      <Style id="lineStyle">
        <LineStyle>
          <color>ff0000ff</color>
          <width>2</width>
        </LineStyle>
        <PolyStyle>
          <color>00ffffff</color>
        </PolyStyle>
      </Style>
      <Placemark>
        <name>Flight Path</name>
        <styleUrl>#lineStyle</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <altitudeMode>relativeToGround</altitudeMode>
          <coordinates>`;
        let coords = points.length === 1
            ? `${points[0][1]},${points[0][0]},0 ${points[0][1]},${points[0][0]},80`
            : points.map(p => `${p[1]},${p[0]},80`).join(' ');
        const footer = `</coordinates>
        </LineString>
      </Placemark>
    </Document>
  </kml>`;

        const kml = header + coords + footer;
        const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mission.zone_hash}-${mission.flight_plan.name} v${mission.flight_plan.version}.kml`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportFlightPathGeoJSON(mission, points) {
        const geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: points.map(([lat, lng]) => [lng, lat, 80])
                },
                properties: {
                    name: `${mission.zone_hash}-${mission.flight_plan.name} v${mission.flight_plan.version}`
                }
            }]
        };

        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mission.zone_hash}-${mission.flight_plan.name} v${mission.flight_plan.version}.geojson`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // SPA Navigation Detection
    function setupSPADetection() {
        const origPush = history.pushState;
        history.pushState = function() {
            origPush.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        const origReplace = history.replaceState;
        history.replaceState = function() {
            origReplace.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
        };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', () => {
            removePreview();
            removeMissionSection();
        });
    }

    // Initialize
    setupMapInterception();
    disableRowHover();
    overrideFetch();
    setupSPADetection();
})();