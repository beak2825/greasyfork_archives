// ==UserScript==
// @name         WME Irish Tunnel Closures
// @author       DiffLok
// @namespace    https://waze.com
// @version      0.2
// @license MIT
// @description  Compare Irish tunnel published closures with Waze Map Editor and export a CSV of the differences for WME Advanced Closures.
// @match        https://*.waze.com/*editor*
// @grant        GM.xmlHttpRequest
// @connect      dublintunnel.ie
// @connect      jacklynchtunnel.ie
// @downloadURL https://update.greasyfork.org/scripts/517698/WME%20Irish%20Tunnel%20Closures.user.js
// @updateURL https://update.greasyfork.org/scripts/517698/WME%20Irish%20Tunnel%20Closures.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TUNNELS = {
        'Dublin Port Tunnel': {
            url: 'https://dublintunnel.ie/tunnel-closures/',
            segments: {
                446442265: 'North Bore',
                446442268: 'South Bore',
            },
        },
        'Jack Lynch Tunnel': {
            url: 'https://jacklynchtunnel.ie/tunnel-closures/',
            segments: {
                296753602: 'North Bore',
                296753600: 'South Bore',
            },
        },
    };

    let selectedTunnel = null;
    let tabRegistered = false;
    let tabPane = null;

    const parseDate = (date, time) => {
        const [day, month, year] = date.split('/').map(Number);
        const [hour, minute] = time.replace('.', ':').split(':').map(Number);
        return new Date(year, month - 1, day, hour, minute);
    };

    const ensureArray = value => (Array.isArray(value) ? value : [value]);

    const isSegmentOnScreen = segmentID => Boolean(W?.model?.segments?.objects?.[segmentID]);

    const fetchClosureData = async (url, tunnelName) => {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const rows = Array.from(doc.querySelectorAll('table tbody tr'));

                            const closures = rows.map(row => {
                                const cells = row.querySelectorAll('td');
                                const [startDate, startTime, endDate, endTime, details] = Array.from(cells, cell => cell.textContent.trim());

                                const startDateTime = parseDate(startDate, startTime);
                                const endDateTime = parseDate(endDate, endTime);

                                if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                                    console.warn('WME IrishTunnelClosures: Invalid date encountered:', { startDate, startTime, endDate, endTime });
                                    return null;
                                }

                                const boreId = details.toLowerCase().includes('north bore')
                                    ? [Object.keys(TUNNELS[tunnelName].segments)[0]]
                                    : details.toLowerCase().includes('south bore')
                                        ? [Object.keys(TUNNELS[tunnelName].segments)[1]]
                                        : details.toLowerCase().includes('full tunnel closure')
                                            ? Object.keys(TUNNELS[tunnelName].segments)
                                            : null;

                                return {
                                    startDateTime,
                                    endDateTime,
                                    boreId: ensureArray(boreId),
                                    isFullClosure: details.toLowerCase().includes('full tunnel closure'),
                                };
                            }).filter(Boolean);

                            resolve(closures);
                        } catch (error) {
                            reject(`Parsing error: ${error.message}`);
                        }
                    } else {
                        reject(`Failed to fetch data. Status: ${response.status}`);
                    }
                },
                onerror: error => reject(`Request error: ${error}`),
            });
        });
    };

    const renderTunnelSelection = () => {
        if (!tabRegistered) {
            const tab = W.userscripts.registerSidebarTab('tunnel-closure-sync');
            tabRegistered = true;
            tab.tabLabel.innerText = 'Tunnel Closures';
            tab.tabLabel.title = 'Synchronize Tunnel Closures';
            tabPane = tab.tabPane;
        }

        const buttons = Object.keys(TUNNELS)
            .map(tunnel => `<button class="tunnel-select" data-tunnel="${tunnel}">${tunnel}</button>`)
            .join('');

        tabPane.innerHTML = `
            <h3>Select a Tunnel</h3>
            ${buttons}
        `;

        tabPane.querySelectorAll('.tunnel-select').forEach(button =>
            button.addEventListener('click', e => {
                const tunnelName = e.target.dataset.tunnel;
                selectedTunnel = TUNNELS[tunnelName];
                if (Object.keys(selectedTunnel.segments).some(isSegmentOnScreen)) {
                    renderTunnelSyncUI(tunnelName);
                } else {
                    alert(`No segments of the ${tunnelName} are on screen. Please adjust the map view.`);
                }
            })
        );
    };

    const renderTunnelSyncUI = async tunnelName => {
        try {
            const { url, segments } = TUNNELS[tunnelName];
            const remoteClosures = await fetchClosureData(url, tunnelName);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sortedRemoteClosures = remoteClosures
                .filter(rc => rc.startDateTime >= today)
                .sort((a, b) => a.boreId[0] - b.boreId[0] || a.startDateTime - b.startDateTime);

            const currentClosures = W.model.roadClosures.getObjectArray()
                .filter(closure => {
                    const segID = closure.attributes.segID;
                    const startDate = new Date(closure.attributes.startDate);
                    return segments[segID] && startDate >= today;
                })
                .sort((a, b) => a.attributes.segID - b.attributes.segID || new Date(a.attributes.startDate) - new Date(b.attributes.startDate));

            const remoteMap = new Map();
            sortedRemoteClosures.forEach(rc =>
                rc.boreId.forEach(id => remoteMap.set(`${rc.startDateTime.toISOString()}-${rc.endDateTime.toISOString()}-${id}`, rc))
            );

            const currentMap = new Map();
            currentClosures.forEach(cc => {
                const { startDate, endDate, segID } = cc.attributes;
                currentMap.set(`${new Date(startDate).toISOString()}-${new Date(endDate).toISOString()}-${segID}`, cc);
            });

            const toAdd = sortedRemoteClosures.flatMap(rc =>
                rc.boreId
                    .filter(id => !currentMap.has(`${rc.startDateTime.toISOString()}-${rc.endDateTime.toISOString()}-${id}`))
                    .map(id => ({ ...rc, boreId: [id] }))
            );

            const toRemove = currentClosures.filter(cc => {
                const { startDate, endDate, segID } = cc.attributes;
                return !remoteMap.has(`${new Date(startDate).toISOString()}-${new Date(endDate).toISOString()}-${segID}`);
            });

            displayDiff(tunnelName, toAdd, toRemove);
        } catch (error) {
            console.error("WME IrishTunnelClosures: Error during synchronization:", error);
            alert("Failed to synchronize closures. Check the console for details.");
        }
    };

    const displayDiff = (tunnelName, toAdd, toRemove) => {
        const { segments } = TUNNELS[tunnelName];

        const segmentDisplay = Object.keys(segments)
            .map(segID => {
                const addList = toAdd
                    .filter(closure => closure.boreId.includes(segID))
                    .map(closure => `<li>${formatDate(closure.startDateTime)} → ${formatDate(closure.endDateTime)}</li>`)
                    .join('') || '<li>No closures to add</li>';

                const removeList = toRemove
                    .filter(closure => closure.attributes.segID == segID)
                    .map(closure => `<li>${formatDate(new Date(closure.attributes.startDate))} → ${formatDate(new Date(closure.attributes.endDate))}</li>`)
                    .join('') || '<li>No closures to remove</li>';

                return `
                    <h4>${segments[segID]}</h4>
                    <div><strong>To Add:</strong></div>
                    <ul>${addList}</ul>
                    <div><strong>To Remove:</strong></div>
                    <ul>${removeList}</ul>
                `;
            })
            .join('');

        tabPane.innerHTML = `
            <h3>${tunnelName} Closures</h3>
            ${segmentDisplay}
            <button id="download-csv">Download CSV</button>
            <button id="back-button">Back</button>
        `;

        document.getElementById('download-csv').addEventListener('click', () => downloadCSV(toAdd, toRemove));
        document.getElementById('back-button').addEventListener('click', renderTunnelSelection);
    };

    const downloadCSV = (toAdd, toRemove) => {
        const headers = ["header,reason,start date,end date,direction,ignore traffic,segment IDs,lon/lat,zoom,MTE ID,comment"];
        const rows = [];

        toAdd.forEach(closure =>
            closure.boreId.forEach(id => {
                const segment = W.model.segments.get(id);
                const direction = segment.attributes.revDirection ? "B to A" : "A to B";
                const lonLat = getSegmentMidpointCoordinates(segment);
                rows.push(`add,Scheduled closure,${formatDateCSV(closure.startDateTime)},${formatDateCSV(closure.endDateTime)},${direction},Yes,${id},${lonLat},15,,`);
            })
        );

        toRemove.forEach(closure => {
            const { startDate, endDate, segID } = closure.attributes;
            const direction = W.model.segments.get(segID).attributes.revDirection ? "B to A" : "A to B";
            const lonLat = getSegmentMidpointCoordinates(W.model.segments.get(segID));
            rows.push(`remove,Scheduled closure,${formatDateCSV(new Date(startDate))},${formatDateCSV(new Date(endDate))},${direction},Yes,${segID},${lonLat},15,,`);
        });

        const csvContent = [headers.join("\n"), ...rows].join("\n");
        downloadBlob(csvContent, 'closures.csv', 'text/csv');
    };

    const getSegmentMidpointCoordinates = segment => {
        const { coordinates } = segment.attributes.geoJSONGeometry;
        const midpoint = coordinates[Math.floor(coordinates.length / 2)];
        return `lon=${midpoint[0].toFixed(5)}&lat=${midpoint[1].toFixed(5)}`;
    };

    const downloadBlob = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = date =>
    date.toLocaleString('en-GB', {
        timeZone: 'Europe/Dublin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).replace(',', '');

    const formatDateCSV = date => {
        const dublinTime = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Dublin' }));
        const pad = num => String(num).padStart(2, '0');
        return `${dublinTime.getFullYear()}-${pad(dublinTime.getMonth() + 1)}-${pad(dublinTime.getDate())} ${pad(dublinTime.getHours())}:${pad(dublinTime.getMinutes())}`;
    };

    const bootstrap = (tries = 1) => {
        if (W && W.map && W.model && WazeWrap.Ready) {
            console.log('WME IrishTunnelClosures: Initialized');
            renderTunnelSelection();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries + 1), 200);
        }
    };

    bootstrap();
})();
