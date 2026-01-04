// ==UserScript==
// @name         Geoguessr Replay Analyzer
// @namespace    https://greasyfork.org/users/1179204
// @version      0.0.6
// @description  analyze geoguessr replay data
// @author       KaKa
// @match        https://www.geoguessr.com/duels/*
// @match        https://www.geoguessr.com/team-duels/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      BSD
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js
// @downloadURL https://update.greasyfork.org/scripts/529262/Geoguessr%20Replay%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/529262/Geoguessr%20Replay%20Analyzer.meta.js
// ==/UserScript==
(function() {
    let replayData,playersList,selectedPlayer,rounds,currentGameId

    async function getReplayer(gameId,round){
        let replayControls = document.querySelector('[class^="replay_main__"]');
        const keys = Object.keys(replayControls)
        const key = keys.find(key => key.startsWith("__reactProps"))
        const props = replayControls[key]
        playersList=props.children[4].props.players
        if(playersList) rounds=Math.max(...playersList.map(player => player.guesses?.length || 0));
        else rounds= document.querySelectorAll('[class*="playedRound"]').length -3;
        const selectedPlayerLabels = document.querySelectorAll('label[class*="switch_label"][aria-selected="true"]');
        selectedPlayerLabels.forEach(label => {
            const playerName = label.textContent.trim();
            if(playersList)selectedPlayer=playersList.find(player=>player.nick.trim()==playerName)
            else selectedPlayer = props.children[4].props.selectedPlayer
        });
        currentGameId=gameId
        replayData=await fetchReplayData(currentGameId,selectedPlayer.playerId,round)
    }

    async function fetchReplayData( gameId,userId,round) {
        const url = `https://www.geoguessr.com/api/v4/replays/${userId}/${gameId}/${round}`;
        try {
            const response = await fetch(url,{method: "GET",credentials: "include"});

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return null
            }
            return await response.json();

        } catch (error) {
            console.error('Error fetching replay data:', error);
            return null;
        }
    }

    function parseUrl() {
        const url = window.location.href;
        const urlObj = new URL(url);

        const pathSegments = urlObj.pathname.split('/');
        const gameId = pathSegments.length > 2 ? pathSegments[2] : null;

        const round = urlObj.searchParams.get("round");
        return { gameId, round };
    }

    async function downloadPanoramaImage(panoId, fileName, w, h, zoom,d) {
        return new Promise(async (resolve, reject) => {
            try {
                let canvas, ctx, tilesPerRow, tilesPerColumn, tileUrl, imageUrl;
                const tileWidth = 512;
                const tileHeight = 512;

                let zoomTiles;
                imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&zoom=${zoom}&nbt=0&fover=2`;
                zoomTiles = [2, 4, 8, 16, 32];
                tilesPerRow = Math.min(Math.ceil(w / tileWidth), zoomTiles[zoom - 1]);
                tilesPerColumn = Math.min(Math.ceil(h / tileHeight), zoomTiles[zoom - 1] / 2);

                const canvasWidth = tilesPerRow * tileWidth;
                const canvasHeight = tilesPerColumn * tileHeight;
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                const loadTile = (x, y) => {
                    return new Promise(async (resolveTile) => {
                        let tile;

                        tileUrl = `${imageUrl}&x=${x}&y=${y}`;


                        try {
                            tile = await loadImage(tileUrl);
                            ctx.drawImage(tile, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                            resolveTile();
                        } catch (error) {
                            console.error(`Error loading tile at ${x},${y}:`, error);
                            resolveTile();
                        }
                    });
                };

                let tilePromises = [];
                for (let y = 0; y < tilesPerColumn; y++) {
                    for (let x = 0; x < tilesPerRow; x++) {
                        tilePromises.push(loadTile(x, y));
                    }
                }

                await Promise.all(tilePromises);
                if(d){
                    resolve(canvas.toDataURL('image/jpeg'));}
                else{
                    canvas.toBlob(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        resolve();
                    }, 'image/jpeg');}
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.toString(),
                    icon: 'error',
                    backdrop: false
                });
                reject(error);
            }
        });
    }

    async function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
            img.src = url;
        });
    }

    async function searchGooglePano(t, e, z) {
        try {
            const u = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
            const r=50*(21-z)**2
            let payload = createPayload(t,e,r);

            const response = await fetch(u, {
                method: "POST",
                headers: {
                    "content-type": "application/json+protobuf",
                    "x-user-agent": "grpc-web-javascript/0.1"
                },
                body: payload,
                mode: "cors",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                if(t=='GetMetadata'){
                    return {
                        panoId: data[1][0][1][1],
                        heading: data[1][0][5][0][1][2][0],
                        worldHeight:data[1][0][2][2][0],
                        worldWidth:data[1][0][2][2][1]
                    };
                }
                return {
                    panoId: data[1][1][1],
                    heading: data[1][5][0][1][2][0]
                };
            }
        } catch (error) {
            console.error(`Failed to fetch metadata: ${error.message}`);
        }
    }

    function createPayload(mode,coorData,r) {
        let payload;
        if(!r)r=50
        if (mode === 'GetMetadata') {
            payload = [["apiv3",null,null,null,"US",null,null,null,null,null,[[0]]],["en","US"],[[[2,coorData]]],[[1,2,3,4,8,6]]];
        }
        else if (mode === 'SingleImageSearch') {
            payload =[["apiv3"],
                      [[null,null,coorData.lat,coorData.lng],r],
                      [null,["en","US"],null,null,null,null,null,null,[2],null,[[[2,true,2],[10,true,2]]]], [[1,2,3,4,8,6]]]
        } else {
            throw new Error("Invalid mode!");
        }
        return JSON.stringify(payload);
    }

    function analyze(round){

        Swal.fire({
            title: 'Replay Analysis',
            html: `
<div style="text-align: center; font-family: sans-serif;">
            <div style="margin-bottom: 10px;">
                <select id="roundSelect" style="background: #db173e; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <select id="playerSelect" style="background: #007bff; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <button id="toggleEventBtn" style="background: #28a745; color: white; font-size: 14px; padding: 8px 15px; border: 2px solid grey; border-radius: 6px; cursor: pointer; margin: 5px;">Event Analysis</button>
                <button id="toggleSVBtn" style="background: #ffc107; color: black; font-size: 14px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer;">StreetView Analysis</button>
            </div>
            <canvas id="chartCanvas" width="300" height="150" style="background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"></canvas>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 5px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <p><strong>Event Density:</strong> <span id="eventDensity">Loading...</span></p>
                    <p><strong>Avgerage Gap Time:</strong> <span id="AvgGapTime">Loading...</span></p>
                    <p><strong>Pano Event Ratio:</strong> <span id="streetViewRatio">Loading...</span></p>
                    <p><strong>First PanoZoom:</strong> <span id="firstPanoZoomTime">Loading...</span></p>
                    <p><strong>Longest Single Gap:</strong> <span id="longestGapTime">Loading...</span></p>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <p><strong>Switch Count:</strong> <span id="switchCount">Loading...</span></p>
                    <p><strong>Total Gap Time:</strong> <span id="stagnationTime">Loading...</span></p>
                    <p><strong>Map Event Ratio:</strong> <span id="mapEventRatio">Loading...</span></p>
                    <p><strong>First Map Zoom:</strong> <span id="firstMapZoomTime">Loading...</span></p>
                    <p><strong>Pano POV Speed:</strong> <span id="avgPovSpeed">Loading...</span></p>
                </div>
            </div>
        </div>
    `,
            width: 800,
            showCloseButton: true,
            backdrop:null,
            didOpen: () => {

                const canvas = document.getElementById('chartCanvas')
                const ctx = canvas.getContext('2d', {willReadFrequently: true })

                const playerSelect = document.getElementById("playerSelect");
                const roundSelect = document.getElementById("roundSelect");
                if(playersList){
                    playersList.forEach(player => {
                        let option = document.createElement("option");
                        option.value = player.playerId;
                        option.textContent = player.nick;
                        playerSelect.appendChild(option);
                    });
                    if(selectedPlayer)playerSelect.value=selectedPlayer.playerId;}
                else playerSelect.style.display='none'
                if(rounds){
                    for (let i = 1; i <= rounds; i++) {
                        let option =document.createElement("option")
                        option.value = i;
                        option.textContent=`Round ${i}`
                        roundSelect.appendChild(option);
                    }
                }
                if(round)roundSelect.value=parseInt(round)
                const toggleSVBtn = document.getElementById('toggleSVBtn');
                const toggleEventBtn = document.getElementById('toggleEventBtn');

                function updateChartData(data, playerName) {
                    chart.resize()
                    const interval = 1000;
                    const eventTypes = [
                        "PanoPov",
                        "PanoZoom",
                        "MapPosition",
                        "MapZoom",
                        "PinPosition",
                        "MapDisplay",
                        "PanoPosition",
                        "Focus",
                        "Timer",
                        "KeyPress",
                    ];

                    const keyEventTypes = ["PinPosition", "MapDisplay", "GuessWithLatLng","Timer", "Focus","KeyPress"];
                    const eventColors = {
                        "MapZoom": "#0000FF",
                        "MapPosition": "#FFA500",
                        "PanoPov": "#00FF00",
                        "PinPosition": "#00FFFF",
                        "MapDisplay": "#800080",
                        "PanoZoom": "#FF69B4",
                        "PanoPosition": "#1E90FF",
                        "KeyPress":"lightgreen",
                        "Timer":"red",
                        "Focus":"#FFD700"
                    };

                    const eventBuckets = {};
                    const allEventTimes = {};

                    eventTypes.forEach(eventType => {
                        eventBuckets[eventType] = {};

                    });
                    keyEventTypes.forEach(eventType => {
                        allEventTimes[eventType] = [];
                    });

                    data.forEach(event => {
                        const eventTime = event.time;
                        const relativeTime = eventTime - data[0].time;
                        if(eventBuckets[event.type]){
                            const bucket = Math.floor(relativeTime / interval);

                            if (!eventBuckets[event.type][bucket]) {
                                eventBuckets[event.type][bucket] = 0;
                            }
                            eventBuckets[event.type][bucket]++;
                        }
                        if(allEventTimes[event.type]){
                            allEventTimes[event.type].push(relativeTime); }
                    });

                    const labels = [];
                    const maxBucket = Math.max(
                        ...Object.values(eventBuckets).flatMap(bucket => Object.keys(bucket).map(Number))
                    );

                    for (let i = 0; i <= maxBucket; i++) {
                        const relativeSeconds = (i * interval + interval / 2) / 1000; // 获取3秒区间的中点
                        const minutes = Math.floor(relativeSeconds / 60);
                        const seconds = Math.floor(relativeSeconds % 60);
                        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        labels.push(formattedTime);
                    }

                    const datasets = eventTypes.map(eventType => {
                        const dataPoints = labels.map((label, index) => eventBuckets[eventType][index] || 0);
                        return {
                            label: eventType,
                            data: dataPoints,
                            fill: false,
                            borderColor: eventColors[eventType],
                            backgroundColor: eventColors[eventType],
                            tension: 0.5,
                            hidden: true
                        };
                    });

                    const totalEventsData = labels.map((label, index) => {
                        let total = 0;
                        eventTypes.forEach(eventType => {
                            total += eventBuckets[eventType][index] || 0;
                        });
                        return total;
                    });

                    datasets.push({
                        label: 'Total Events',
                        data: totalEventsData,
                        fill: false,
                        borderColor: 'rgba(0,0,0,0.6)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        tension: 0.5
                    });

                    const annotations = [];
                    const hiddenKeyPoints = [];

                    Object.keys(allEventTimes).forEach(eventType => {
                        allEventTimes[eventType].forEach((eventTime, idx) => {
                            const xPosition = eventTime / 1000;

                            const annotation = {
                                type: 'line',
                                xMin: xPosition,
                                xMax: xPosition,
                                borderColor: eventColors[eventType],
                                borderWidth: 1.5,
                                borderDash: [5, 5],
                            };

                            if (eventType === "KeyPress") {
                                const keyPayload = data.find(
                                    ev => ev.type === "KeyPress" && (ev.time - data[0].time) === eventTime
                                )?.payload?.key || "";

                                annotations.push({
                                    type: 'line',
                                    xMin: xPosition,
                                    xMax: xPosition,
                                    borderColor: eventColors[eventType],
                                    borderWidth: 1.5,
                                    borderDash: [5, 5],

                                    hiddenPoint: {
                                        x: xPosition,
                                        key: keyPayload
                                    }
                                });

                                hiddenKeyPoints.push({
                                    x: xPosition,
                                    y: 0,
                                    key: keyPayload
                                });
                            }

                            annotations.push(annotation);
                        });
                    });
                    datasets.push({
                        label: "KeyPressHidden",
                        data: hiddenKeyPoints,
                        parsing: false,
                        pointRadius: 4,
                        pointHoverRadius: 10,
                        borderWidth: 0,
                        borderColor: "rgba(0,0,0,0)",
                        backgroundColor: "rgba(0,0,0,0)",
                        showLine: false
                    });
                    chart.data.datasets = datasets;
                    chart.data.labels = labels;
                    chart.options.plugins.annotation.annotations = annotations;
                    chart.update();}

                const chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    boxWidth: 30,
                                    boxHeight: 15,
                                    padding: 30
                                },
                                position: 'top',
                                align: 'center',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    pointStyle: 'rectRounded'
                                },
                            },
                            tooltip: {
                                enabled: true,
                                intersect: false,
                                mode: "nearest",

                                callbacks: {
                                    title: () => "",
                                    label: (ctx) => {
                                        if (ctx.dataset.label === "KeyPressHidden") {
                                            return `Key: ${ctx.raw.key}`;
                                        }
                                        return null;
                                    }
                                },
                                backgroundColor: "rgba(0,0,0,0.75)",
                                padding: 8,
                                cornerRadius: 6
                            },
                            annotation: { annotations: {} },
                    customTooltip: true
                },
                                        scales: {
                                        x: { title: { display: true } },
                  y: { title: { display: true, text: 'Event Counts' }, beginAtZero: true }
 },

},

});

function updateEventAnalysisData(data) {
    const { eventDensity, switchCount, stagnationTime, stagnationCount, AvgGapTime, streetViewRatio, mapEventRatio, firstMapZoomTime, firstPanoZoomTime,longestGapTime,avgPovSpeed} = updateEventAnalysis(data);
    document.getElementById('eventDensity').textContent = eventDensity.toFixed(2) + " times/s";
    document.getElementById('stagnationTime').textContent = stagnationTime.toFixed(2) + " s";
    document.getElementById('longestGapTime').textContent = longestGapTime.toFixed(2) + " s";
    document.getElementById('avgPovSpeed').textContent = avgPovSpeed.toFixed(2) + " °/s";
    document.getElementById('switchCount').textContent = `${switchCount/2} times`;
    document.getElementById('AvgGapTime').textContent =!stagnationCount?'None': `${(parseFloat(stagnationTime/stagnationCount)).toFixed(2)}s`;
    document.getElementById('streetViewRatio').textContent = (streetViewRatio * 100).toFixed(2) + "%";
    document.getElementById('mapEventRatio').textContent = (mapEventRatio * 100).toFixed(2) + "%";
    document.getElementById('firstMapZoomTime').textContent = firstMapZoomTime === null ? "None" : "At " + firstMapZoomTime + " s";
    document.getElementById('firstPanoZoomTime').textContent = firstPanoZoomTime === null ? "None" : "At " + firstPanoZoomTime + " s";
}

updateChartData(replayData);
updateEventAnalysisData(replayData);
playerSelect.onchange = async () => {
    canvas.style.pointerEvents = 'auto';
    try{
        replayData=await fetchReplayData(currentGameId,playerSelect.value,roundSelect.value)
        selectedPlayer=playersList.find(player=>player.playerId==playerSelect.value)
    }
    catch(e){
        console.error("Error fetching replay data")
        return
    }
    updateChartData(replayData);
    updateEventAnalysisData(replayData);
};

roundSelect.onchange = async () => {
    canvas.style.pointerEvents = 'auto';
    try{
        replayData=await fetchReplayData(currentGameId,playerSelect.value||selectedPlayer.playerId,roundSelect.value)
    }
    catch(e){
        console.error("Error fetching replay data")
        return
    }
    updateChartData(replayData);
    updateEventAnalysisData(replayData);
};

toggleEventBtn.addEventListener('click',()=>{
    toggleSVBtn.style.border='none'
    toggleEventBtn.style.border='2px solid grey'
    canvas.style.pointerEvents = 'auto';
    updateChartData(replayData);
    updateEventAnalysisData(replayData);
})
toggleSVBtn.addEventListener('click',async () => {
    toggleEventBtn.style.border='none'
    toggleSVBtn.style.border='2px solid grey'
    canvas.style.pointerEvents='none'
    var centerHeading;
    const panoIds = replayData
    .filter(item => item.type === 'PanoPosition' && item.payload?.panoId)
    .map(item => item.payload.panoId);
    if(panoIds.length>1){
        var panoId=panoIds[Math.floor(Math.random() * panoIds.length)]
        }
    else{
        panoId=panoIds[0]
    }
    const metaData = await searchGooglePano('GetMetadata',panoId );

    var w = metaData.worldWidth;
    var h = metaData.worldHeight;

    centerHeading = metaData.heading;


    try {
        const imageUrl = await downloadPanoramaImage(panoId, panoId, w, h, w==13312?5:3, true);
        const img = await loadImage(imageUrl);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let lastPanoPov = { heading: 0, pitch: 0 };
        let stagnationPoints =[];
        const heatData = replayData.filter(event => ["PanoZoom", "PanoPov"].includes(event.type)).map((event, index, events) => {
            let heading, pitch, type;
            let time = event.time;

            if (event.type === "PanoPov") {
                [heading, pitch] =[event.payload.heading,event.payload.pitch]
                lastPanoPov = { heading, pitch };
                type = "PanoPov";
            } else if (event.type === "PanoZoom") {
                heading = lastPanoPov.heading;
                pitch = lastPanoPov.pitch;
                type = "PanoZoom";
            }

            if (index > 0) {
                const prevEvent = events[index - 1];
                const timeDiff = Math.abs(time - prevEvent.time);
                if (timeDiff > 3000) {
                    stagnationPoints.push(index);
                }
            }

            return { heading, pitch, type};
        });

        drawHeatMapOnImage(canvas, heatData, centerHeading,stagnationPoints);
    } catch (error) {
        console.error('Error downloading panorama image:', error);
    }

})}

});
}

function drawHeatMapOnImage(canvas, heatData, centerHeading,points) {
    const ctx = canvas.getContext('2d');
    heatData.forEach((point, index) => {
        let headingDifference = point.heading - centerHeading;
        if (headingDifference > 180) {
            headingDifference -= 360;
        } else if (headingDifference < -180) {
            headingDifference += 360;
        }
        const x = (headingDifference + 180) / 360 * canvas.width;
        const y = (90 - point.pitch) / 180 * canvas.height;

        ctx.beginPath();
        if(canvas.width===13312) ctx.arc(x, y, (points.includes(index))?80:40, 0,2* Math.PI);
        else ctx.arc(x, y, (points.includes(index))?30:15, 0,2* Math.PI);

        if (points.includes(index)) {
            ctx.fillStyle = 'yellow';
        } else if (point.type === "PanoZoom") {
            ctx.fillStyle = '#FF0000';
        } else if (point.type === "PanoPov") {
            ctx.fillStyle = '#00FF00';
        }

        ctx.fill();
    });
}

function updateEventAnalysis(data) {
    let totalEvents = 0;
    let totalTime = 0;
    let stagnationTime = 0;
    let stagnationCount = 0;
    let switchCount = 0;
    let streetViewEvents = 0;
    let mapEvents = 0;
    let lastEventTime = null;
    let longestGapTime = 0;

    let totalHeadingDifference = 0;
    let totalTimeGap = 0;

    let lastPanoPovEventTime = null;
    let lastHeading = null;

    data.forEach(event => {
        const eventTime = event.time;
        const relativeTime = Math.floor((eventTime - data[0].time) / 1000);

        totalEvents++;
        totalTime = relativeTime;

        if (event.type.includes("Pano")) {
            streetViewEvents++;
        } else if (event.type.includes("Map")) {
            mapEvents++;
        }

        if (lastEventTime !== null) {
            const timeGap = (eventTime - lastEventTime) / 1000;

            if (timeGap >= 3) {
                if (timeGap > longestGapTime) longestGapTime = timeGap;
                stagnationTime += timeGap;
                stagnationCount++;
            }
        }

        if (event.type === "PanoPov" && lastPanoPovEventTime !== null) {
            const headingDifference = Math.abs(event.payload.heading - lastHeading);
            const timeGap = (eventTime - lastPanoPovEventTime) / 1000;

            totalHeadingDifference += headingDifference;
            totalTimeGap += timeGap;
        }

        lastEventTime = eventTime;

        if (event.type === "PanoPov") {
            lastPanoPovEventTime = eventTime;
            lastHeading =event.payload.heading;
        }

        if (event.type === "Focus" && !event.payload.focus) {
            switchCount++;
        }
    });

    const eventDensity = totalEvents / totalTime;

    const streetViewRatio = streetViewEvents / totalEvents;
    const mapEventRatio = mapEvents / totalEvents;

    let firstMapZoomTime = null;
    let firstMapZoomTime_ = null;
    let firstPanoZoomTime_ = null;
    let firstPanoZoomTime = null;
    data.forEach(event => {
        if (event.type === "MapZoom" && !firstMapZoomTime) {
            if (firstMapZoomTime_ === null) firstMapZoomTime_ = 1;
            else {
                firstMapZoomTime = Math.floor((event.time - data[0].time) / 1000);
            }
        }
        if (event.type === "PanoZoom" && !firstPanoZoomTime) {
            if (firstPanoZoomTime_ === null) firstPanoZoomTime_ = 1;
            else {
                firstPanoZoomTime = Math.floor((event.time - data[0].time) / 1000);
            }
        }
    });

    let avgPovSpeed = 0;
    if (totalTimeGap > 0) {
        avgPovSpeed = totalHeadingDifference / totalTimeGap;
    }

    return {
        eventDensity,
        stagnationTime,
        switchCount,
        stagnationCount,
        streetViewRatio,
        mapEventRatio,
        firstPanoZoomTime,
        firstMapZoomTime,
        longestGapTime,
        avgPovSpeed
    };
}


let onKeyDown =async (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }
    if (e.shiftKey&&(e.key === 'K' || e.key === 'k')){
        const {gameId, round}=parseUrl()
        const selectedRounds = document.querySelectorAll('[class*="selectedRound"]');
        var match
        selectedRounds.forEach(round => {
            const roundTextElement = round.querySelector('[class*="roundText"], [class*="game-summary_text"]');
            if (roundTextElement && roundTextElement.textContent.includes('Round')) {
                match = roundTextElement.textContent.match(/Round\s+(\d+)/);
            }
        });
        await getReplayer(gameId,match[1])
        analyze(match[1])
    }
}

document.addEventListener("keydown", onKeyDown);
})();