// ==UserScript==
// @name         8 Ball Helper for Crazygames
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  This Helper is for 8 ball pool billiards.
// @author       Made by Kakoncheater
// @match        https://www.crazygames.com/game/8-ball-pool-billiards-multiplayer
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536847/8%20Ball%20Helper%20for%20Crazygames.user.js
// @updateURL https://update.greasyfork.org/scripts/536847/8%20Ball%20Helper%20for%20Crazygames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'Advanced8BallPoolGuide_v1_9_1';

    let config = {
        calibPoints: [ { x: 100, y: 100 }, { x: 700, y: 100 }, { x: 700, y: 400 }, { x: 100, y: 400 } ],
        cueBallPos: { x: 250, y: 250 },
        lineWidth: 2,
        lineColor: '#FFFFFF',
        guideLineColor: 'rgba(200, 200, 200, 0.6)',
        cueBallMarkerBorderColor: 'rgba(255, 0, 0, 0.8)', // Farbe für den Rand des Cue-Markers
        calibPointMarkerColor: 'rgba(0, 255, 0, 0.4)',
        calibPointSize: 40,
        cueBallSize: 20, // Radius
        cueBallMarkerBorderSize: 2, // Dicke des Rands für den Cue-Marker
        showGridLines: true,
        calibrationLocked: false,
        settingsPanelVisible: true,
        settingsPanelPos: { top: '10px', left: '10px' }
    };

    let gameIframe;
    let overlayCanvas, ctx;
    let settingsPanel;
    let cueBallMarkerElement;
    let calibPointMarkerElements = [];

    let isDraggingCueBall = false;
    let activeCalibPointIndex = -1;
    let isDraggingCalibPoint = false;
    let isDraggingPanel = false;
    let dragStartMousePos = { x: 0, y: 0 };
    let dragStartElementPos = { x: 0, y: 0 };
    let calculatedPockets = [];
    let drawRequested = false;

    function calculatePocketPositions() { /* ... (same as v1.9) ... */ calculatedPockets = []; if (config.calibPoints.length !== 4) return; const [tl, tr, br, bl] = config.calibPoints; calculatedPockets.push({ x: tl.x, y: tl.y, name: 'TL' }); calculatedPockets.push({ x: tr.x, y: tr.y, name: 'TR' }); calculatedPockets.push({ x: br.x, y: br.y, name: 'BR' }); calculatedPockets.push({ x: bl.x, y: bl.y, name: 'BL' }); const topCushionY = (tl.y + tr.y) / 2; const bottomCushionY = (bl.y + br.y) / 2; calculatedPockets.push({ x: (tl.x + tr.x) / 2, y: topCushionY, name: 'TM' }); calculatedPockets.push({ x: (bl.x + br.x) / 2, y: bottomCushionY, name: 'BM' }); }
    function saveSettings() { GM_setValue(SCRIPT_ID + '_settings', JSON.stringify(config)); }
    function loadSettings() { const saved = GM_getValue(SCRIPT_ID + '_settings'); if (saved) { const loadedConfig = JSON.parse(saved); for (const key in config) { if (loadedConfig[key] !== undefined) { config[key] = loadedConfig[key]; } } } console.log("Settings loaded, panel visible:", config.settingsPanelVisible); }
    function getGameIframe() { return document.getElementById('game-iframe'); }

    function createSettingsPanel() { /* ... (same as v1.9) ... */
        console.log("Attempting to create settings panel. Initial visibility:", config.settingsPanelVisible);
        settingsPanel = document.createElement('div');
        settingsPanel.id = SCRIPT_ID + '_SettingsPanel';
        settingsPanel.style.display = config.settingsPanelVisible ? 'block' : 'none';
        settingsPanel.innerHTML = `
            <div id="${SCRIPT_ID}_PanelHeader" style="background-color:#333; color:white; padding:5px; cursor:grab; text-align:center;">8 Ball Guide (Toggle: Insert)</div>
            <div style="padding:10px;">
                <label>Line Width: <span id="${SCRIPT_ID}_lineWidthValue">${config.lineWidth}</span>px</label>
                <input type="range" id="${SCRIPT_ID}_lineWidth" min="1" max="10" value="${config.lineWidth}" style="width:100%;">
                <label>Line Color:</label>
                <input type="color" id="${SCRIPT_ID}_lineColor" value="${config.lineColor}" style="width:100%;">
                <label><input type="checkbox" id="${SCRIPT_ID}_showGridLines" ${config.showGridLines ? 'checked' : ''}> Show Grid Lines</label>
                <label><input type="checkbox" id="${SCRIPT_ID}_calibrationLocked" ${config.calibrationLocked ? 'checked' : ''}> Lock Calibration</label>
                <button id="${SCRIPT_ID}_saveSettings" style="width:100%; margin-top:10px;">Save All Settings</button>
            </div>`;
        document.body.appendChild(settingsPanel);
        GM_addStyle( `
            #${SCRIPT_ID}_SettingsPanel { position: fixed; top: ${config.settingsPanelPos.top}; left: ${config.settingsPanelPos.left}; background-color: rgba(70, 70, 70, 0.95); border: 1px solid #888; border-radius: 5px; z-index: 10002; color: white; font-family: sans-serif; font-size: 14px; min-width: 230px; }
            #${SCRIPT_ID}_SettingsPanel label { display: block; margin: 5px 0; }
            #${SCRIPT_ID}_SettingsPanel input[type="checkbox"] { margin-right: 5px; vertical-align: middle; }
            #${SCRIPT_ID}_SettingsPanel button { padding: 8px; background-color: #555; color: white; border: none; border-radius: 3px; cursor: pointer; }
            #${SCRIPT_ID}_SettingsPanel button:hover { background-color: #666; }
            body.dragging-active, body.dragging-active * { user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; }
        `);
        document.getElementById(`${SCRIPT_ID}_lineWidth`).addEventListener('input', (e) => { config.lineWidth = parseInt(e.target.value); document.getElementById(`${SCRIPT_ID}_lineWidthValue`).textContent = config.lineWidth; requestDraw(); });
        document.getElementById(`${SCRIPT_ID}_lineColor`).addEventListener('input', (e) => { config.lineColor = e.target.value; requestDraw(); });
        document.getElementById(`${SCRIPT_ID}_showGridLines`).addEventListener('change', (e) => { config.showGridLines = e.target.checked; requestDraw(); });
        document.getElementById(`${SCRIPT_ID}_calibrationLocked`).addEventListener('change', (e) => { config.calibrationLocked = e.target.checked; updateDraggableMarkersVisibilityAndStyle(); requestDraw(); });
        document.getElementById(`${SCRIPT_ID}_saveSettings`).addEventListener('click', () => { saveSettings(); alert('Settings Saved!'); });
        const panelHeader = document.getElementById(`${SCRIPT_ID}_PanelHeader`);
        panelHeader.addEventListener('mousedown', (e) => { isDraggingPanel = true; dragStartMousePos = { x: e.clientX, y: e.clientY }; dragStartElementPos = { x: settingsPanel.offsetLeft, y: settingsPanel.offsetTop }; panelHeader.style.cursor = 'grabbing'; document.body.classList.add('dragging-active'); if (overlayCanvas) overlayCanvas.style.pointerEvents = 'none !important'; });
        window.addEventListener('keydown', (e) => { if (e.key === 'Insert') { config.settingsPanelVisible = !config.settingsPanelVisible; if (settingsPanel) { settingsPanel.style.display = config.settingsPanelVisible ? 'block' : 'none'; } saveSettings(); } });
        console.log("Settings panel created and listeners attached.");
    }

    function createOverlayCanvasAndMarkers() {
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = SCRIPT_ID + '_Overlay';
        ctx = overlayCanvas.getContext('2d');
        overlayCanvas.style.pointerEvents = 'none !important';
        document.body.appendChild(overlayCanvas);
        GM_addStyle(`
            #${SCRIPT_ID}_Overlay { position: absolute; top: 0; left: 0; z-index: 10000; pointer-events: none !important; }
            .${SCRIPT_ID}_Marker { position: absolute; z-index: 10001; cursor: grab; box-sizing: border-box; /* border: 1px dashed rgba(255,255,255,0.5); */ }
        `);
        cueBallMarkerElement = document.createElement('div');
        cueBallMarkerElement.id = SCRIPT_ID + '_CueBallMarker';
        cueBallMarkerElement.className = `${SCRIPT_ID}_Marker`;
        cueBallMarkerElement.style.width = (config.cueBallSize * 2) + 'px';
        cueBallMarkerElement.style.height = (config.cueBallSize * 2) + 'px';
        cueBallMarkerElement.style.backgroundColor = 'transparent'; // Transparent machen
        cueBallMarkerElement.style.border = `${config.cueBallMarkerBorderSize}px solid ${config.cueBallMarkerBorderColor}`; // Rand hinzufügen
        cueBallMarkerElement.style.borderRadius = '50%';
        cueBallMarkerElement.addEventListener('mousedown', (e) => { e.stopPropagation(); isDraggingCueBall = true; dragStartMousePos = { x: e.clientX, y: e.clientY }; dragStartElementPos = { ...config.cueBallPos }; cueBallMarkerElement.style.cursor = 'grabbing'; document.body.classList.add('dragging-active'); if (overlayCanvas) overlayCanvas.style.pointerEvents = 'none !important'; });
        document.body.appendChild(cueBallMarkerElement);

        calibPointMarkerElements = [];
        for (let i = 0; i < 4; i++) {
            const marker = document.createElement('div');
            marker.id = `${SCRIPT_ID}_CalibMarker_${i}`;
            marker.className = `${SCRIPT_ID}_Marker`;
            marker.style.width = config.calibPointSize + 'px';
            marker.style.height = config.calibPointSize + 'px';
            marker.style.backgroundColor = config.calibPointMarkerColor;
            marker.dataset.index = i;
            marker.addEventListener('mousedown', (e) => { e.stopPropagation(); if (config.calibrationLocked) return; isDraggingCalibPoint = true; activeCalibPointIndex = parseInt(e.target.dataset.index); dragStartMousePos = { x: e.clientX, y: e.clientY }; dragStartElementPos = { ...config.calibPoints[activeCalibPointIndex] }; marker.style.cursor = 'grabbing'; document.body.classList.add('dragging-active'); if (overlayCanvas) overlayCanvas.style.pointerEvents = 'none !important'; });
            calibPointMarkerElements.push(marker);
            document.body.appendChild(marker);
        }
        updateDraggableMarkersVisibilityAndStyle();
        updateDraggableMarkersPosition();
    }
    function updateDraggableMarkersVisibilityAndStyle() { calibPointMarkerElements.forEach(m => { m.style.display = config.calibrationLocked ? 'none' : 'block'; m.style.cursor = config.calibrationLocked ? 'default' : 'grab'; }); }
    function updateDraggableMarkersPosition() { if (!gameIframe) return; const iframeRect = gameIframe.getBoundingClientRect(); if (cueBallMarkerElement) { cueBallMarkerElement.style.left = (iframeRect.left + config.cueBallPos.x - config.cueBallSize) + 'px'; cueBallMarkerElement.style.top = (iframeRect.top + config.cueBallPos.y - config.cueBallSize) + 'px'; } calibPointMarkerElements.forEach((marker, i) => { if (config.calibPoints[i]) { marker.style.left = (iframeRect.left + config.calibPoints[i].x - config.calibPointSize / 2) + 'px'; marker.style.top = (iframeRect.top + config.calibPoints[i].y - config.calibPointSize / 2) + 'px'; } }); }

    function handleDocumentMouseMove(e) { /* ... (same as v1.8 / v1.7) ... */
        if (!gameIframe) return;
        if (!isDraggingPanel && !isDraggingCueBall && !isDraggingCalibPoint) return;
        const iframeRect = gameIframe.getBoundingClientRect();
        if (isDraggingPanel) { const dx = e.clientX - dragStartMousePos.x; const dy = e.clientY - dragStartMousePos.y; settingsPanel.style.left = (dragStartElementPos.x + dx) + 'px'; settingsPanel.style.top = (dragStartElementPos.y + dy) + 'px'; return; }
        const mouseXOnIframe = e.clientX - iframeRect.left;
        const mouseYOnIframe = e.clientY - iframeRect.top;
        if (isDraggingCueBall) { const dx = mouseXOnIframe - (dragStartMousePos.x - iframeRect.left); const dy = mouseYOnIframe - (dragStartMousePos.y - iframeRect.top); config.cueBallPos.x = dragStartElementPos.x + dx; config.cueBallPos.y = dragStartElementPos.y + dy; updateDraggableMarkersPosition(); requestDraw();
        } else if (isDraggingCalibPoint && activeCalibPointIndex !== -1) { const dx = mouseXOnIframe - (dragStartMousePos.x - iframeRect.left); const dy = mouseYOnIframe - (dragStartMousePos.y - iframeRect.top); config.calibPoints[activeCalibPointIndex].x = dragStartElementPos.x + dx; config.calibPoints[activeCalibPointIndex].y = dragStartElementPos.y + dy; calculatePocketPositions(); updateDraggableMarkersPosition(); requestDraw(); }
    }
    function handleDocumentMouseUp(e) { /* ... (same as v1.8, mit Logging) ... */
        console.log("MouseUp event triggered. Target:", e.target ? e.target.id || e.target.tagName : 'N/A');
        console.log("Mouse buttons state:", e.buttons);
        console.log("Current dragging states before reset: CueBall:", isDraggingCueBall, "CalibPoint:", isDraggingCalibPoint, "Panel:", isDraggingPanel);
        document.body.classList.remove('dragging-active');
        if (overlayCanvas) { overlayCanvas.style.pointerEvents = 'none'; } // Bleibt 'none'
        let wasDraggingSomething = isDraggingCueBall || isDraggingCalibPoint || isDraggingPanel;
        if (isDraggingCueBall) { console.log("Releasing CueBall drag."); isDraggingCueBall = false; }
        if (isDraggingCalibPoint) { console.log("Releasing CalibPoint drag for index:", activeCalibPointIndex); isDraggingCalibPoint = false; }
        if (isDraggingPanel) { console.log("Releasing Panel drag."); isDraggingPanel = false; if (settingsPanel) { config.settingsPanelPos = { top: settingsPanel.style.top, left: settingsPanel.style.left }; saveSettings(); } }
        if (wasDraggingSomething) { requestDraw(); }
        if(cueBallMarkerElement) cueBallMarkerElement.style.cursor = 'grab';
        calibPointMarkerElements.forEach(m => m.style.cursor = 'grab');
        const panelHeader = document.getElementById(`${SCRIPT_ID}_PanelHeader`);
        if(panelHeader) panelHeader.style.cursor = 'grab';
    }

    function requestDraw() { if (!drawRequested) { drawRequested = true; requestAnimationFrame(() => { draw(); drawRequested = false; }); } }
    function draw() { /* ... (same as v1.8 / v1.7, ohne Angle Line) ... */ if (!ctx || !overlayCanvas || !gameIframe) return; ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); if (config.showGridLines && config.calibPoints.length === 4) { const [tl, tr, br, bl] = config.calibPoints; ctx.strokeStyle = config.guideLineColor; ctx.lineWidth = Math.max(1, config.lineWidth / 2); ctx.beginPath(); ctx.moveTo(tl.x, tl.y); ctx.lineTo(tr.x, tr.y); ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y); ctx.closePath(); ctx.moveTo(tl.x, tl.y); ctx.lineTo(br.x, br.y); ctx.moveTo(tr.x, tr.y); ctx.lineTo(bl.x, bl.y); ctx.stroke(); } ctx.strokeStyle = config.lineColor; ctx.lineWidth = config.lineWidth; if (calculatedPockets.length > 0) { calculatedPockets.forEach(pocket => { ctx.beginPath(); ctx.moveTo(config.cueBallPos.x, config.cueBallPos.y); ctx.lineTo(pocket.x, pocket.y); ctx.stroke(); }); } }
    function updateOverlaySizeAndPosition() { /* ... (same as v1.8 / v1.7) ... */ if (!gameIframe || !overlayCanvas) { if (overlayCanvas) overlayCanvas.style.display = 'none'; if(cueBallMarkerElement) cueBallMarkerElement.style.display = 'none'; calibPointMarkerElements.forEach(m => m.style.display = 'none'); return; } overlayCanvas.style.display = 'block'; if(cueBallMarkerElement) cueBallMarkerElement.style.display = 'block'; updateDraggableMarkersVisibilityAndStyle(); const rect = gameIframe.getBoundingClientRect(); overlayCanvas.style.left = rect.left + 'px'; overlayCanvas.style.top = rect.top + 'px'; overlayCanvas.width = rect.width; overlayCanvas.height = rect.height; updateDraggableMarkersPosition(); calculatePocketPositions(); requestDraw(); }
    function init() { /* ... (same as v1.8 / v1.7) ... */ console.log("Initializing script", SCRIPT_ID); loadSettings(); gameIframe = getGameIframe(); if (!gameIframe) { console.log(SCRIPT_ID + ": Game Iframe not found. Retrying..."); setTimeout(init, 2000); return; } console.log(SCRIPT_ID + ": Game Iframe found."); createOverlayCanvasAndMarkers(); createSettingsPanel(); calculatePocketPositions(); updateOverlaySizeAndPosition(); const resizeObserver = new ResizeObserver(updateOverlaySizeAndPosition); resizeObserver.observe(gameIframe); window.addEventListener('resize', updateOverlaySizeAndPosition); document.addEventListener('fullscreenchange', () => { setTimeout(updateOverlaySizeAndPosition, 150); }); document.addEventListener('mousemove', handleDocumentMouseMove); document.addEventListener('mouseup', handleDocumentMouseUp); requestDraw(); console.log("Initialization complete."); }
    const checkInterval = setInterval(() => { /* ... (same as v1.8 / v1.7) ... */ gameIframe = getGameIframe(); if (gameIframe && typeof gameIframe.getBoundingClientRect === 'function') { clearInterval(checkInterval); init(); } else if (document.readyState === "complete") { gameIframe = getGameIframe(); if (gameIframe && typeof gameIframe.getBoundingClientRect === 'function') { clearInterval(checkInterval); init(); } else { console.log(SCRIPT_ID + ": Game Iframe not definitively found after page load."); } } }, 500);

})();