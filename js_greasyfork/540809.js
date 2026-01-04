// ==UserScript==
// @name         Waze Scan Closures
// @namespace    https://github.com/WazeDev/waze-scan-closures
// @version      0.0.30
// @description  Passively scans for user-generated/reported road closures in WME and sends Discord/Slack notifications when new closures are reported.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      wsc.gc-p.zip
// @downloadURL https://update.greasyfork.org/scripts/540809/Waze%20Scan%20Closures.user.js
// @updateURL https://update.greasyfork.org/scripts/540809/Waze%20Scan%20Closures.meta.js
// ==/UserScript==

(function () {
    'use strict';
    unsafeWindow.SDK_INITIALIZED.then(init);
    let sdk;
    let userReportedClosures = [];
    let trackedClosures = [];
    let wazeEditorName;
    let url = localStorage.getItem("waze-scan-closures-url") || "https://wsc.gc-p.zip";
    let endpoints = {
        "TRACKED_CLOSURES": `${url}/trackedClosures`,
        "UPLOAD_CLOSURES": `${url}/uploadClosures`
    }
    // Status message element reference
    let statusMsgEl = null;

    function titleCase(s) {
        return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async function init() {
        sdk = unsafeWindow.getWmeSdk({
            scriptId: 'wme-scan-closures',
            scriptName: 'Waze Scan Closures'
        });
        while (sdk.State.getUserInfo() === null) {
            console.log("Waze Scan Closures: Waiting for user to be logged in...");
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        wazeEditorName = sdk.State.getUserInfo().userName;
        console.log(`Waze Scan Closures: Logged in as ${wazeEditorName}`);
        getTrackedClosures();
        sdk.Events.trackDataModelEvents({
            dataModelName: "roadClosures"
        });
        sdk.Events.on({
            eventName: "wme-data-model-objects-added",
            eventHandler: updateRoadClosures
        });
        userReportedClosures = filterUserClosures(sdk.DataModel.RoadClosures.getAll());
        sdk.Sidebar.registerScriptTab().then(async (res) => {
            res.tabLabel.innerText = "WSC";
            // Create text area for inputting url, update variable when value changes
            res.tabPane.innerHTML = `
                <div>
                    <label for="WSCApiUrl">API URL:</label>
                    <input type="text" id="WSCApiUrl" value="${url}" style="width: 100%;" />
                </div>
                <div id="WSCStatusMsg" style="margin-top:8px;color:#007700;font-weight:bold;"></div>
            `;
            res.tabPane.querySelector("#WSCApiUrl").addEventListener("input", (e) => {
                url = e.target.value;
                localStorage.setItem("waze-scan-closures-url", url);
                endpoints["TRACKED_CLOSURES"] = `${url}/trackedClosures`;
                endpoints["UPLOAD_CLOSURES"] = `${url}/uploadClosures`;
            });
            statusMsgEl = res.tabPane.querySelector("#WSCStatusMsg");
        });
        console.log(`Waze Scan Closures: Initialized!`);
    }

    // Helper to set status message
    function setStatusMsg(msg, color = '#007700') {
        if (statusMsgEl) {
            statusMsgEl.textContent = msg;
            statusMsgEl.style.color = color;
        }
    }

    function getTrackedClosures() {
        if (url === "" || wazeEditorName === undefined || wazeEditorName === null) {
            console.error("Waze Scan Closures: URL not set!");
            setStatusMsg("Upload failed: URL not set!", '#bb0000');
            return;
        }
        let data = {
            userName: wazeEditorName,
            env: sdk.Settings.getRegionCode()
        }
        let details = {
            method: "POST",
            data: JSON.stringify(data),
            url: endpoints["TRACKED_CLOSURES"],
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                let responseData = JSON.parse(response.responseText);
                
                // Handle both old format (array) and new format (object)
                if (Array.isArray(responseData)) {
                    trackedClosures = responseData;
                } else {
                    trackedClosures = responseData.trackedClosures || [];
                }
                
                console.log(`Waze Scan Closures: Retrieved ${trackedClosures.length} tracked closures!`);
            },
            onerror: function () {
                setStatusMsg("Failed to retrieve tracked closures!", '#bb0000');
            }
        };
        console.log(`Waze Scan Closures: Retriving tracked closures...`);
        GM_xmlhttpRequest(details);
    }

    // Allowed durations (in ms):
    const ALLOWED_DURATIONS = [
        30 * 60 * 1000, // 30 minutes
        1 * 60 * 60 * 1000, // 1 hour
        5 * 60 * 60 * 1000, // 5 hours
        16 * 60 * 60 * 1000, // 16 hours
        72 * 60 * 60 * 1000 // 72 hours
    ];

    // Margin of error around each target (1 minute = 60 000 ms)
    const MARGIN = 60 * 1000;

    function filterUserClosures(closures) {
        return closures.filter(c => {
            // must have no description, valid dates, not already tracked
            if (
                c.description ||
                !c.startDate ||
                !c.endDate ||
                trackedClosures.includes(c.id)
            ) {
                return false;
            }

            // compute actual duration in ms
            const duration =
                new Date(c.endDate).getTime() -
                new Date(c.startDate).getTime();

            // check if it matches any allowed duration within the margin
            return ALLOWED_DURATIONS.some(
                target => Math.abs(duration - target) <= MARGIN
            );
        });
    }

    // Function to find adjacent closures by traversing connected segments
    function findAdjacentClosures(closureSegmentId, allClosures, visited = new Set()) {
        // Avoid infinite loops
        if (visited.has(closureSegmentId)) {
            return [];
        }
        visited.add(closureSegmentId);

        const adjacentClosures = [];
        const segment = sdk.DataModel.Segments.getById({ segmentId: closureSegmentId });
        
        if (!segment) {
            return adjacentClosures;
        }

        // Get nodes connected to this segment
        const nodeIds = [segment.fromNodeId, segment.toNodeId].filter(id => id !== null);
        
        for (const nodeId of nodeIds) {
            const node = sdk.DataModel.Nodes.getById({ nodeId: nodeId });
            if (!node) continue;

            // Get all segments connected to this node
            const connectedSegmentIds = node.connectedSegmentIds || [];
            
            for (const connectedSegmentId of connectedSegmentIds) {
                // Skip the original segment
                if (connectedSegmentId === closureSegmentId) continue;
                
                // Check if this connected segment has a closure
                const closureOnSegment = allClosures.find(closure => closure.segmentId === connectedSegmentId);
                if (closureOnSegment) {
                    adjacentClosures.push({
                        closure: closureOnSegment,
                        connectionNodeId: nodeId,
                        segmentId: connectedSegmentId
                    });
                    
                    // Recursively find closures adjacent to this one
                    const furtherAdjacent = findAdjacentClosures(connectedSegmentId, allClosures, visited);
                    adjacentClosures.push(...furtherAdjacent);
                }
            }
        }

        return adjacentClosures;
    }

    // Function to group closures by adjacency
    function groupClosuresByAdjacency(closures) {
        const groups = [];
        const processed = new Set();

        for (const closure of closures) {
            if (processed.has(closure.id)) continue;

            const group = [closure];
            processed.add(closure.id);

            // Find all adjacent closures for this closure
            const adjacent = findAdjacentClosures(closure.segmentId, closures);
            
            for (const adj of adjacent) {
                if (!processed.has(adj.closure.id)) {
                    group.push(adj.closure);
                    processed.add(adj.closure.id);
                }
            }

            groups.push({
                closures: group,
                isGroup: group.length > 1,
                groupId: group.map(c => c.id).sort().join('-')
            });
        }

        return groups;
    }

    function removeObjectProperties(obj, props) {

        for (var i = 0; i < props.length; i++) {
            if (obj.hasOwnProperty(props[i])) {
                delete obj[props[i]];
            }
        }

    };

    function updateRoadClosures() {
        let currentUserReportedClosures = filterUserClosures(
            sdk.DataModel.RoadClosures.getAll()
        );
        if (currentUserReportedClosures.length !== 0) {
            userReportedClosures = currentUserReportedClosures;
            console.log(
                `Waze Scan Closures: Found ${userReportedClosures.length} user reported ` +
                'closures!'
            );
            setStatusMsg(`Found ${userReportedClosures.length} user reported closures!`, '#0055bb');

            // Group closures by adjacency
            const closureGroups = groupClosuresByAdjacency(userReportedClosures);
            console.log(`Waze Scan Closures: Grouped into ${closureGroups.length} closure groups`);

            // helper: convert ms → "Xh Ym"
            const formatDuration = ms => {
                const totalMin = Math.round(ms / 60000);
                const hrs = Math.floor(totalMin / 60);
                const mins = totalMin % 60;
                let str = '';
                if (hrs) str += `${hrs}h`;
                if (mins) str += `${hrs ? ' ' : ''}${mins}m`;
                return str || '0m';
            };

            // Process all closures and add adjacency information
            const allProcessedClosures = [];

            for (const group of closureGroups) {
                // Filter out closures without valid segments first
                const validClosures = group.closures.filter(closure => {
                    if (closure.segmentId !== null) {
                        closure.segment = sdk.DataModel.Segments.getById({
                            segmentId: closure.segmentId
                        });
                    }

                    if (!closure.segment) {
                        console.log(`Waze Scan Closures: Skipping closure ${closure.id} - no segment found`);
                        return false;
                    }
                    return true;
                });

                validClosures.forEach(i => {
                    // track
                    trackedClosures.push(i.id);

                    if (i.segment) {
                        i.roadType =
                            I18n.t('segment.road_types')[i.segment.roadType];
                        i.roadTypeEnum = i.segment.roadType;
                        i.lon = i.segment.geometry.coordinates
                            .reduce((s, c) => s + c[0], 0) /
                            i.segment.geometry.coordinates.length;
                        i.lat = i.segment.geometry.coordinates
                            .reduce((s, c) => s + c[1], 0) /
                            i.segment.geometry.coordinates.length;
                    }

                    // Get address using the SDK method
                    const address = sdk.DataModel.Segments.getAddress({ segmentId: i.segmentId });

                    // build human-readable location using address components
                    const location = [];

                    if (address && !address.isEmpty) {
                        if (address.street && address.street.name.trim() !== '') {
                            location.push(address.street.name);
                        }
                        if (address.city && address.city.name.trim() !== '') {
                            location.push(address.city.name);
                        }
                        if (address.state && address.state.name.trim() !== '') {
                            location.push(address.state.name);
                        }
                        if (address.country && address.country.name.trim() !== '') {
                            location.push(address.country.name);
                        }
                    }

                    i.location = location.join(', ');

                    // metadata
                    i.createdBy = i.modificationData.createdBy;
                    i.createdOn = i.modificationData.createdOn;
                    i.direction = i.isForward ? 'A➜B' : 'B➜A';
                    i.status = titleCase(i.status);

                    // ← NEW: compute duration
                    const durationMs =
                        new Date(i.endDate).getTime() -
                        new Date(i.startDate).getTime();
                    i.durationMs = durationMs;
                    i.duration = formatDuration(durationMs);

                    // Add adjacency information
                    i.isPartOfGroup = group.isGroup;
                    i.groupId = group.groupId;
                    i.groupSize = group.closures.length;
                    if (group.isGroup) {
                        i.adjacentClosureIds = group.closures
                            .filter(c => c.id !== i.id)
                            .map(c => c.id);
                    }

                    // strip out unneeded props before upload
                    removeObjectProperties(i, [
                        'isPermanent',
                        'description',
                        'endDate',
                        'modificationData',
                        'startDate',
                        'isForward',
                        'segment',
                        'trafficEventId'
                    ]);
                });

                allProcessedClosures.push(...validClosures);
            }

            const uploadData = {
                // bbox: sdk.Map.getMapExtent(),
                userName: wazeEditorName,
                zoomLevel: sdk.Map.getZoomLevel(),
                closures: allProcessedClosures
            };
            sendClosures(uploadData);
        } else {
            console.log('Waze Scan Closures: No new closures found...');
            setStatusMsg('No new closures found...', '#e6b800');
        }
    }

    function sendClosures(uploadData) {
        if (url === "" || wazeEditorName === undefined || wazeEditorName === null) {
            console.error("Waze Scan Closures: URL not set!");
            setStatusMsg("Upload failed: URL not set!", '#bb0000');
            return;
        }
        // use GM_xmlhttpRequest(details)
        let details = {
            method: "POST",
            url: endpoints["UPLOAD_CLOSURES"],
            data: JSON.stringify(uploadData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            onload: function (response) {
                setStatusMsg(`${uploadData.closures.length} closures uploaded successfully!`, '#007700');
                getTrackedClosures();
            },
            onerror: function () {
                setStatusMsg("Upload failed: Network error", '#bb0000');
            }
        };
        setStatusMsg(`Uploading ${uploadData.closures.length} closures...`, '#0055bb');
        GM_xmlhttpRequest(details);
        getTrackedClosures();
    }
})();
