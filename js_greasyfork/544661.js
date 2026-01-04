// ==UserScript==
// @name         8 Ball Helper for CrazyGames
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Cheat for 8 Ball Pool on CrazyGames with manual calibration and correct alignment.
// @author       Adapted by Mazurka
// @match        https://www.crazygames.com/game/8-ball-pool-billiards-multiplayer*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544661/8%20Ball%20Helper%20for%20CrazyGames.user.js
// @updateURL https://update.greasyfork.org/scripts/544661/8%20Ball%20Helper%20for%20CrazyGames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'Advanced8BallPoolGuide_v2_1_0';

    // Default config with calibration points roughly around the iframe center
    let config = {
        calibPoints: [
            { x: 50, y: 50 },   // Top-left corner of game area inside iframe
            { x: 750, y: 50 },  // Top-right
            { x: 750, y: 450 }, // Bottom-right
            { x: 50, y: 450 }   // Bottom-left
        ],
        cueBallPos: { x: 400, y: 300 }, // Initial cue ball position inside iframe
        lineWidth: 2,
        lineColor: '#FFFFFF',
        guideLineColor: 'rgba(200, 200, 200, 0.6)',
        calibPointMarkerColor: 'rgba(0, 255, 0, 0.5)',
        calibPointSize: 30,
        cueBallSize: 15,
        calibrationLocked: false,
        settingsPanelVisible: true,
        settingsPanelPos: { top: '10px', left: '10px' }
    };

    let gameIframe = null;
    let overlayCanvas = null;
    let ctx = null;
    let settingsPanel = null;
    let cueBallMarker = null;
    let calibMarkers = [];
    let isDraggingCueBall = false;
    let isDraggingCalibPoint = false;
    let activeCalibIndex = -1;
    let isDraggingPanel = false;
    let dragStartMouse = { x: 0, y: 0 };
    let dragStartPos = { x: 0, y: 0 };
    let drawRequested = false;

    // Calculate pockets based on calibration points
    function calculatePockets() {
        if (config.calibPoints.length !== 4) return [];
        const [tl, tr, br, bl] = config.calibPoints;
        let pockets = [];
        pockets.push({ x: tl.x, y: tl.y, name: 'Top-Left' });
        pockets.push({ x: tr.x, y: tr.y, name: 'Top-Right' });
        pockets.push({ x: br.x, y: br.y, name: 'Bottom-Right' });
        pockets.push({ x: bl.x, y: bl.y, name: 'Bottom-Left' });
        // Mid pockets on top and bottom cushions
        pockets.push({ x: (tl.x + tr.x) / 2, y: (tl.y + tr.y) / 2, name: 'Top-Mid' });
        pockets.push({ x: (bl.x + br.x) / 2, y: (bl.y + br.y) / 2, name: 'Bottom-Mid' });
        return pockets;
    }

    // Save config persistently
    function saveSettings() {
        GM_setValue(SCRIPT_ID + '_settings', JSON.stringify(config));
    }

    // Load config from storage
    function loadSettings() {
        const saved = GM_getValue(SCRIPT_ID + '_settings');
        if (saved) {
            try {
                const loaded = JSON.parse(saved);
                for (const key in config) {
                    if (loaded[key] !== undefined) {
                        config[key] = loaded[key];
                    }
                }
            } catch (e) {
                console.warn(SCRIPT_ID + ': Failed to parse saved settings', e);
            }
        }
    }

    // Find the game iframe by matching its src URL pattern
    function getGameIframe() {
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            if (iframe.src && iframe.src.includes('8-ball-pool-billiards-multiplayer')) {
                return iframe;
            }
        }
        return null;
    }

    // Create the settings panel UI
    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.id = SCRIPT_ID + '_SettingsPanel';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = config.settingsPanelPos.top;
        settingsPanel.style.left = config.settingsPanelPos.left;
        settingsPanel.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
        settingsPanel.style.color = 'white';
        settingsPanel.style.padding = '10px';
        settingsPanel.style.borderRadius = '8px';
        settingsPanel.style.zIndex = 10002;
        settingsPanel.style.minWidth = '250px';
        settingsPanel.style.fontFamily = 'Arial, sans-serif';
        settingsPanel.style.userSelect = 'none';
        settingsPanel.style.display = config.settingsPanelVisible ? 'block' : 'none';

        settingsPanel.innerHTML = `
            <div id="${SCRIPT_ID}_PanelHeader" style="cursor: grab; font-weight: bold; margin-bottom: 8px; text-align: center;">8 Ball Pool Guide (Toggle: Insert)</div>
            <label>Line Width: <span id="${SCRIPT_ID}_lineWidthValue">${config.lineWidth}</span> px</label>
            <input type="range" id="${SCRIPT_ID}_lineWidth" min="1" max="10" value="${config.lineWidth}" style="width: 100%;">
            <label>Line Color:</label>
            <input type="color" id="${SCRIPT_ID}_lineColor" value="${config.lineColor}" style="width: 100%;">
            <label><input type="checkbox" id="${SCRIPT_ID}_calibrationLocked" ${config.calibrationLocked ? 'checked' : ''}> Lock Calibration Points</label>
            <button id="${SCRIPT_ID}_saveSettings" style="width: 100%; margin-top: 10px;">Save Settings</button>
            <button id="${SCRIPT_ID}_resetCalibration" style="width: 100%; margin-top: 5px;">Reset Calibration</button>
            <div style="font-size: 12px; margin-top: 10px; color: #ccc;">Drag green points to calibrate corners.<br>Drag red circle to move cue ball.</div>
        `;

        document.body.appendChild(settingsPanel);

        // Event listeners
        document.getElementById(`${SCRIPT_ID}_lineWidth`).addEventListener('input', e => {
            config.lineWidth = parseInt(e.target.value);
            document.getElementById(`${SCRIPT_ID}_lineWidthValue`).textContent = config.lineWidth;
            requestDraw();
        });

        document.getElementById(`${SCRIPT_ID}_lineColor`).addEventListener('input', e => {
            config.lineColor = e.target.value;
            requestDraw();
        });

        document.getElementById(`${SCRIPT_ID}_calibrationLocked`).addEventListener('change', e => {
            config.calibrationLocked = e.target.checked;
            updateMarkersVisibility();
            saveSettings();
        });

        document.getElementById(`${SCRIPT_ID}_saveSettings`).addEventListener('click', () => {
            saveSettings();
            alert('Settings saved!');
        });

        document.getElementById(`${SCRIPT_ID}_resetCalibration`).addEventListener('click', () => {
            resetCalibrationPoints();
            saveSettings();
            requestDraw();
        });

        // Drag panel
        const header = document.getElementById(`${SCRIPT_ID}_PanelHeader`);
        header.addEventListener('mousedown', e => {
            isDraggingPanel = true;
            dragStartMouse = { x: e.clientX, y: e.clientY };
            dragStartPos = { x: settingsPanel.offsetLeft, y: settingsPanel.offsetTop };
            header.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingPanel) {
                isDraggingPanel = false;
                header.style.cursor = 'grab';
                document.body.style.userSelect = '';
                config.settingsPanelPos = { top: settingsPanel.style.top, left: settingsPanel.style.left };
                saveSettings();
            }
        });

        window.addEventListener('mousemove', e => {
            if (isDraggingPanel) {
                const dx = e.clientX - dragStartMouse.x;
                const dy = e.clientY - dragStartMouse.y;
                settingsPanel.style.left = dragStartPos.x + dx + 'px';
                settingsPanel.style.top = dragStartPos.y + dy + 'px';
            }
        });

        // Toggle panel visibility with Insert key
        window.addEventListener('keydown', e => {
            if (e.key === 'Insert') {
                config.settingsPanelVisible = !config.settingsPanelVisible;
                settingsPanel.style.display = config.settingsPanelVisible ? 'block' : 'none';
                saveSettings();
            }
        });
    }

    // Reset calibration points to default
    function resetCalibrationPoints() {
        config.calibPoints = [
            { x: 50, y: 50 },
            { x: 750, y: 50 },
            { x: 750, y: 450 },
            { x: 50, y: 450 }
        ];
        config.cueBallPos = { x: 400, y: 300 };
        updateMarkersPosition();
    }

    // Create overlay canvas and draggable markers
    function createOverlayAndMarkers() {
        // Create overlay canvas
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = SCRIPT_ID + '_Overlay';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.zIndex = 10000;
        overlayCanvas.style.pointerEvents = 'none'; // Let mouse events pass through
        document.body.appendChild(overlayCanvas);
        ctx = overlayCanvas.getContext('2d');

        // Create cue ball marker (red circle)
        cueBallMarker = document.createElement('div');
        cueBallMarker.id = SCRIPT_ID + '_CueBallMarker';
        cueBallMarker.style.position = 'absolute';
        cueBallMarker.style.width = config.cueBallSize * 2 + 'px';
        cueBallMarker.style.height = config.cueBallSize * 2 + 'px';
        cueBallMarker.style.border = '3px solid red';
        cueBallMarker.style.borderRadius = '50%';
        cueBallMarker.style.backgroundColor = 'rgba(255,0,0,0.3)';
        cueBallMarker.style.cursor = 'grab';
        cueBallMarker.style.zIndex = 10001;
        document.body.appendChild(cueBallMarker);

        cueBallMarker.addEventListener('mousedown', e => {
            e.stopPropagation();
            isDraggingCueBall = true;
            dragStartMouse = { x: e.clientX, y: e.clientY };
            dragStartPos = { ...config.cueBallPos };
            cueBallMarker.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        // Create calibration point markers (green squares)
        calibMarkers = [];
        for (let i = 0; i < 4; i++) {
            const marker = document.createElement('div');
            marker.className = SCRIPT_ID + '_CalibMarker';
            marker.style.position = 'absolute';
            marker.style.width = config.calibPointSize + 'px';
            marker.style.height = config.calibPointSize + 'px';
            marker.style.backgroundColor = config.calibPointMarkerColor;
            marker.style.borderRadius = '6px';
            marker.style.cursor = 'grab';
            marker.style.zIndex = 10001;
            marker.dataset.index = i;
            document.body.appendChild(marker);

            marker.addEventListener('mousedown', e => {
                e.stopPropagation();
                if (config.calibrationLocked) return;
                isDraggingCalibPoint = true;
                activeCalibIndex = parseInt(marker.dataset.index);
                dragStartMouse = { x: e.clientX, y: e.clientY };
                dragStartPos = { ...config.calibPoints[activeCalibIndex] };
                marker.style.cursor = 'grabbing';
                document.body.style.userSelect = 'none';
            });

            calibMarkers.push(marker);
        }

        updateMarkersVisibility();
        updateMarkersPosition();
    }

    // Update visibility of calibration markers based on lock state
    function updateMarkersVisibility() {
        calibMarkers.forEach(marker => {
            marker.style.display = config.calibrationLocked ? 'none' : 'block';
            marker.style.cursor = config.calibrationLocked ? 'default' : 'grab';
        });
    }

    // Update position of all markers relative to iframe
    function updateMarkersPosition() {
        if (!gameIframe) return;
        const rect = gameIframe.getBoundingClientRect();

        // Position cue ball marker
        cueBallMarker.style.left = rect.left + config.cueBallPos.x - config.cueBallSize + 'px';
        cueBallMarker.style.top = rect.top + config.cueBallPos.y - config.cueBallSize + 'px';

        // Position calibration markers
        calibMarkers.forEach((marker, i) => {
            const p = config.calibPoints[i];
            marker.style.left = rect.left + p.x - config.calibPointSize / 2 + 'px';
            marker.style.top = rect.top + p.y - config.calibPointSize / 2 + 'px';
        });
    }

    // Update overlay canvas size and position to match iframe
    function updateOverlaySizeAndPosition() {
        if (!gameIframe || !overlayCanvas) return;
        const rect = gameIframe.getBoundingClientRect();
        overlayCanvas.style.left = rect.left + 'px';
        overlayCanvas.style.top = rect.top + 'px';
        overlayCanvas.width = rect.width;
        overlayCanvas.height = rect.height;
        updateMarkersPosition();
        requestDraw();
    }

    // Request a redraw on next animation frame
    function requestDraw() {
        if (!drawRequested) {
            drawRequested = true;
            requestAnimationFrame(() => {
                draw();
                drawRequested = false;
            });
        }
    }

    // Draw guide lines and calibration grid
    function draw() {
        if (!ctx || !overlayCanvas) return;
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Draw calibration grid lines if unlocked
        if (!config.calibrationLocked && config.calibPoints.length === 4) {
            const [tl, tr, br, bl] = config.calibPoints;
            ctx.strokeStyle = config.guideLineColor;
            ctx.lineWidth = Math.max(1, config.lineWidth / 2);
            ctx.beginPath();
            ctx.moveTo(tl.x, tl.y);
            ctx.lineTo(tr.x, tr.y);
            ctx.lineTo(br.x, br.y);
            ctx.lineTo(bl.x, bl.y);
            ctx.closePath();
            ctx.moveTo(tl.x, tl.y);
            ctx.lineTo(br.x, br.y);
            ctx.moveTo(tr.x, tr.y);
            ctx.lineTo(bl.x, bl.y);
            ctx.stroke();
        }

        // Draw lines from cue ball to pockets
        const pockets = calculatePockets();
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;
        pockets.forEach(pocket => {
            ctx.beginPath();
            ctx.moveTo(config.cueBallPos.x, config.cueBallPos.y);
            ctx.lineTo(pocket.x, pocket.y);
            ctx.stroke();
        });
    }

    // Handle mouse move for dragging markers
    function onDocumentMouseMove(e) {
        if (!gameIframe) return;
        if (!isDraggingCueBall && !isDraggingCalibPoint && !isDraggingPanel) return;

        const rect = gameIframe.getBoundingClientRect();
        const mouseXInIframe = e.clientX - rect.left;
        const mouseYInIframe = e.clientY - rect.top;

        if (isDraggingPanel) {
            // Handled in panel drag listeners
            return;
        }

        if (isDraggingCueBall) {
            const dx = mouseXInIframe - (dragStartMouse.x - rect.left);
            const dy = mouseYInIframe - (dragStartMouse.y - rect.top);
            config.cueBallPos.x = dragStartPos.x + dx;
            config.cueBallPos.y = dragStartPos.y + dy;
            clampCueBallPosition();
            updateMarkersPosition();
            requestDraw();
        } else if (isDraggingCalibPoint && activeCalibIndex !== -1) {
            const dx = mouseXInIframe - (dragStartMouse.x - rect.left);
            const dy = mouseYInIframe - (dragStartMouse.y - rect.top);
            config.calibPoints[activeCalibIndex].x = dragStartPos.x + dx;
            config.calibPoints[activeCalibIndex].y = dragStartPos.y + dy;
            clampCalibrationPoint(activeCalibIndex);
            updateMarkersPosition();
            requestDraw();
        }
    }

    // Clamp cue ball position inside iframe bounds
    function clampCueBallPosition() {
        if (!gameIframe) return;
        const rect = gameIframe.getBoundingClientRect();
        config.cueBallPos.x = Math.min(Math.max(config.cueBallPos.x, 0), rect.width);
        config.cueBallPos.y = Math.min(Math.max(config.cueBallPos.y, 0), rect.height);
    }

    // Clamp calibration points inside iframe bounds
    function clampCalibrationPoint(index) {
        if (!gameIframe) return;
        const rect = gameIframe.getBoundingClientRect();
        let p = config.calibPoints[index];
        p.x = Math.min(Math.max(p.x, 0), rect.width);
        p.y = Math.min(Math.max(p.y, 0), rect.height);
    }

    // Handle mouse up to stop dragging
    function onDocumentMouseUp(e) {
        if (isDraggingCueBall) {
            isDraggingCueBall = false;
            cueBallMarker.style.cursor = 'grab';
            document.body.style.userSelect = '';
            saveSettings();
        }
        if (isDraggingCalibPoint) {
            isDraggingCalibPoint = false;
            if (activeCalibIndex !== -1) {
                calibMarkers[activeCalibIndex].style.cursor = 'grab';
            }
            activeCalibIndex = -1;
            document.body.style.userSelect= '';
            saveSettings();
        }
    }

    // Initialize everything after iframe is ready
    function init() {
        console.log(SCRIPT_ID + ': Initializing...');
        loadSettings();

        gameIframe = getGameIframe();
        if (!gameIframe) {
            console.warn(SCRIPT_ID + ': Game iframe not found.');
            return;
        }

        createOverlayAndMarkers();
        createSettingsPanel();
        updateOverlaySizeAndPosition();
        requestDraw();

        window.addEventListener('resize', updateOverlaySizeAndPosition);
        window.addEventListener('scroll', updateOverlaySizeAndPosition);
        document.addEventListener('mousemove', onDocumentMouseMove);
        document.addEventListener('mouseup', onDocumentMouseUp);

        console.log(SCRIPT_ID + ': Initialization complete.');
    }

    // Wait for iframe to be available and loaded
    function waitForIframeAndInit() {
        gameIframe = getGameIframe();
        if (gameIframe && gameIframe.contentWindow) {
            // Wait for iframe to load fully
            if (gameIframe.contentDocument && gameIframe.contentDocument.readyState === 'complete') {
                init();
            } else {
                gameIframe.addEventListener('load', () => {
                    init();
                });
            }
        } else {
            console.log(SCRIPT_ID + ': Waiting for game iframe...');
            setTimeout(waitForIframeAndInit, 500);
        }
    }

    waitForIframeAndInit();

})();