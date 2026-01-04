// ==UserScript==
// @name         Drawaria Layer System for Canvas
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a client-side layer system to Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/537426/Drawaria%20Layer%20System%20for%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/537426/Drawaria%20Layer%20System%20for%20Canvas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    let layers = [];
    let activeLayerId = null;
    let mainCanvas = null;
    let mainCtx = null;
    let layerCounter = 1;
    let isDrawing = false;
    let lastX, lastY;

    // Temporary canvas to store background layers for efficient drawing of the active layer
    let tempBackgroundCanvas = document.createElement('canvas');
    let tempBackgroundCtx = tempBackgroundCanvas.getContext('2d');

    // --- Layer Class ---
    function Layer(id, name, order) {
        this.id = id;
        this.name = name;
        this.canvas = document.createElement('canvas');
        if (mainCanvas) { // Ensure mainCanvas is available
            this.canvas.width = mainCanvas.width;
            this.canvas.height = mainCanvas.height;
        }
        this.ctx = this.canvas.getContext('2d');
        this.isVisible = true;
        this.order = order; // Used for Z-ordering layers (front to back)
    }

    // --- UI Functions ---
    function createLayerPanelUI() {
        const panelHTML = `
            <div id="layerPanel" style="position: fixed; top: 100px; right: 10px; width: 220px; background: #f8f9fa; border: 1px solid #ced4da; padding: 10px; z-index: 10000; font-family: Arial, sans-serif; font-size: 13px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
              <h4 style="margin-top: 0; margin-bottom:10px; text-align: center; color: #343a40; border-bottom: 1px solid #dee2e6; padding-bottom: 5px;">Layers</h4>
              <button id="newLayerBtn" style="width: 100%; margin-bottom: 10px; padding: 6px 10px; background-color: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size:12px;">New Layer</button>
              <ul id="layerList" style="list-style: none; padding: 0; margin-top: 10px; max-height: 300px; overflow-y: auto;"></ul>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        document.getElementById('newLayerBtn').addEventListener('click', addNewLayer);
    }

    function renderLayerList() {
        const layerListUI = document.getElementById('layerList');
        if (!layerListUI) return;
        layerListUI.innerHTML = '';

        // Sort layers to display top layer first in the UI list
        layers.slice().sort((a, b) => b.order - a.order).forEach(layer => {
            const listItem = document.createElement('li');
            listItem.style.padding = "6px 8px";
            listItem.style.marginBottom = "5px";
            listItem.style.background = layer.id === activeLayerId ? "#cce5ff" : "#fff";
            listItem.style.border = "1px solid #dee2e6";
            listItem.style.borderRadius = "3px";
            listItem.style.display = "flex";
            listItem.style.justifyContent = "space-between";
            listItem.style.alignItems = "center";
            listItem.setAttribute('data-layer-id', layer.id);

            const layerNameSpan = document.createElement('span');
            layerNameSpan.textContent = layer.name;
            layerNameSpan.style.cursor = "pointer";
            layerNameSpan.style.flexGrow = "1";
            layerNameSpan.style.overflow = "hidden";
            layerNameSpan.style.textOverflow = "ellipsis";
            layerNameSpan.style.whiteSpace = "nowrap";
            layerNameSpan.title = `Activate ${layer.name}`;
            layerNameSpan.addEventListener('click', () => setActiveLayer(layer.id));

            const visibilityButton = document.createElement('button');
            visibilityButton.innerHTML = layer.isVisible ? '👁️' : '🙈';
            visibilityButton.title = layer.isVisible ? "Hide layer" : "Show layer";
            visibilityButton.style.cssText = "background:none; border:none; cursor:pointer; margin-right:5px; font-size:16px;";
            visibilityButton.addEventListener('click', (e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); });

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️';
            deleteButton.title = "Delete layer";
            deleteButton.style.cssText = "background:none; border:none; cursor:pointer; font-size:16px;";
            deleteButton.addEventListener('click', (e) => { e.stopPropagation(); deleteLayer(layer.id); });
            // Disable delete if only one layer left
            if (layers.length <= 1) {
                deleteButton.disabled = true;
                deleteButton.style.opacity = "0.5";
            }

            const controlsDiv = document.createElement('div');
            controlsDiv.style.flexShrink = "0";
            controlsDiv.appendChild(visibilityButton);
            controlsDiv.appendChild(deleteButton);

            listItem.appendChild(layerNameSpan);
            listItem.appendChild(controlsDiv);
            layerListUI.appendChild(listItem);
        });
    }

    // --- Layer Management Functions ---
    function addInitialLayer() {
        // Add one default layer when the script starts
        const initialLayer = new Layer(`layer_${layerCounter}`, `Layer ${layerCounter}`, 0);
        layerCounter++;
        layers.push(initialLayer);
        activeLayerId = initialLayer.id;
        renderLayerList();
    }

    function addNewLayer() {
        if (layers.length >= 10) {
            alert("Maximum of 10 layers reached.");
            return;
        }
        // Assign a new order to the new layer, placing it on top
        const newOrder = layers.length > 0 ? Math.max(...layers.map(l => l.order)) + 1 : 0;
        const newLayer = new Layer(`layer_${layerCounter}`, `Layer ${layerCounter}`, newOrder);
        layerCounter++;
        layers.push(newLayer);
        setActiveLayer(newLayer.id);
    }

    function setActiveLayer(layerId) {
        activeLayerId = layerId;
        console.log("Active layer set to:", layerId);
        renderLayerList(); // Re-render to highlight active layer
        flattenAndDraw(); // Redraw canvas to show active layer on top visually (though it's only active for drawing)
    }

    function toggleLayerVisibility(layerId) {
        const layer = layers.find(l => l.id === layerId);
        if (layer) {
            layer.isVisible = !layer.isVisible;
            renderLayerList();
            flattenAndDraw(); // Redraw canvas to reflect visibility change
        }
    }

    function deleteLayer(layerId) {
        if (layers.length <= 1) {
            alert("Cannot delete the only layer.");
            return;
        }
        layers = layers.filter(l => l.id !== layerId);
        // If the active layer was deleted, set a new active layer (e.g., the top-most remaining one)
        if (activeLayerId === layerId) {
            activeLayerId = layers.length > 0 ? layers.sort((a,b) => b.order - a.order)[0].id : null;
        }
        renderLayerList();
        flattenAndDraw(); // Redraw canvas after deletion
    }

    function getActiveLayer() {
        return layers.find(l => l.id === activeLayerId);
    }

    // --- Drawing and Flattening Logic ---
    // Prepares a temporary canvas with all non-active, visible layers merged
    function prepareTempBackground() {
        if (!mainCanvas) return;
        tempBackgroundCanvas.width = mainCanvas.width;
        tempBackgroundCanvas.height = mainCanvas.height;

        tempBackgroundCtx.fillStyle = 'white';
        tempBackgroundCtx.fillRect(0, 0, tempBackgroundCanvas.width, tempBackgroundCanvas.height);

        // Draw all layers EXCEPT the active one onto the temporary background canvas
        layers.slice().sort((a,b)=> a.order - b.order).forEach(layer => {
            if (layer.isVisible && layer.id !== activeLayerId) {
                tempBackgroundCtx.drawImage(layer.canvas, 0, 0);
            }
        });
    }

    // Merges all visible layers onto the main Drawaria canvas
    function flattenAndDraw() {
        if (!mainCanvas || !mainCtx) return;

        // Clear the main Drawaria canvas
        mainCtx.fillStyle = 'white';
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Draw all layers onto the main canvas, sorted by their order
        layers.slice().sort((a,b)=> a.order - b.order).forEach(layer => {
            if (layer.isVisible) {
                mainCtx.drawImage(layer.canvas, 0, 0);
            }
        });
    }

    // --- Intercepting Drawing ---
    // Copies current Drawaria tool settings to the active layer's context
    function copyDrawariaStylesToLayer(layerCtx) {
        if (!mainCtx || !layerCtx) return;
        layerCtx.strokeStyle = mainCtx.strokeStyle;
        layerCtx.lineWidth = mainCtx.lineWidth;
        layerCtx.lineCap = mainCtx.lineCap;
        layerCtx.lineJoin = mainCtx.lineJoin;
        layerCtx.globalCompositeOperation = mainCtx.globalCompositeOperation; // Important for eraser
    }

    function handlePointerDown(e) {
        const activeLayer = getActiveLayer();
        if (!activeLayer || !activeLayer.isVisible) return; // Only draw on visible active layer

        // Check if the click is on the layer panel or other UI elements we control
        if (e.target.closest && e.target.closest("#layerPanel")) return;

        isDrawing = true;
        copyDrawariaStylesToLayer(activeLayer.ctx);

        const rect = mainCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;

        prepareTempBackground(); // Update background for live drawing preview

        activeLayer.ctx.beginPath();
        // For a single dot on click (especially important for small brush sizes)
        if (activeLayer.ctx.globalCompositeOperation === 'source-over') {
            activeLayer.ctx.fillStyle = activeLayer.ctx.strokeStyle; // Use strokeStyle for fill color of the dot
            activeLayer.ctx.arc(lastX, lastY, activeLayer.ctx.lineWidth / 2, 0, Math.PI * 2);
            activeLayer.ctx.fill();
        } else if (activeLayer.ctx.globalCompositeOperation === 'destination-out') { // Eraser dot
            activeLayer.ctx.arc(lastX, lastY, activeLayer.ctx.lineWidth / 2, 0, Math.PI * 2);
            activeLayer.ctx.fill(); // For eraser, fill clears
        }
        activeLayer.ctx.beginPath(); // Start the actual line path
        activeLayer.ctx.moveTo(lastX, lastY);

        e.stopPropagation(); // Crucial to prevent Drawaria's default drawing
        e.preventDefault();  // May prevent some default browser actions
    }

    function handlePointerMove(e) {
        if (!isDrawing) return;
        const activeLayer = getActiveLayer();
        if (!activeLayer || !activeLayer.isVisible) return;

        const rect = mainCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        activeLayer.ctx.lineTo(currentX, currentY);
        activeLayer.ctx.stroke();

        lastX = currentX;
        lastY = currentY;

        // Live preview: Clear main canvas, draw merged background, then draw active layer content
        mainCtx.fillStyle = 'white';
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainCtx.drawImage(tempBackgroundCanvas, 0, 0); // Draw combined background
        mainCtx.drawImage(activeLayer.canvas, 0, 0);    // Draw active layer on top

        e.stopPropagation();
    }

    function handlePointerUpOrOut(e) {
        if (!isDrawing) return;
        const activeLayer = getActiveLayer();
        if (activeLayer && activeLayer.isVisible) {
             activeLayer.ctx.closePath(); // Close the current drawing path
        }
        isDrawing = false;
        flattenAndDraw(); // Final merge of all layers onto the main canvas after drawing is done
        e.stopPropagation();
    }

    // Attaches custom drawing listeners to the main Drawaria canvas
    function setupDrawingListeners() {
        // Use capture phase to intercept events before Drawaria's handlers
        mainCanvas.addEventListener('pointerdown', handlePointerDown, true);
        mainCanvas.addEventListener('pointermove', handlePointerMove, true);
        mainCanvas.addEventListener('pointerup', handlePointerUpOrOut, true);
        mainCanvas.addEventListener('pointerout', handlePointerUpOrOut, true); // Handles mouse leaving canvas
    }

    // --- Initialization ---
    function initializeLayerScript() {
        mainCanvas = document.getElementById('canvas');
        if (!mainCanvas) {
            console.error("Drawaria Layer System: Main canvas not found!");
            return;
        }
        mainCtx = mainCanvas.getContext('2d');

        // Resize layer canvases and temp background canvas when main canvas resizes
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target.id === 'canvas') {
                    const newWidth = mainCanvas.width;
                    const newHeight = mainCanvas.height;

                    layers.forEach(layer => {
                        // Create a temporary copy to preserve content during resize
                        const tempCopy = document.createElement('canvas');
                        tempCopy.width = layer.canvas.width;
                        tempCopy.height = layer.canvas.height;
                        tempCopy.getContext('2d').drawImage(layer.canvas, 0, 0);

                        layer.canvas.width = newWidth;
                        layer.canvas.height = newHeight;
                        // Redraw scaled content from temp copy to new canvas size
                        layer.ctx.drawImage(tempCopy, 0, 0, tempCopy.width, tempCopy.height, 0, 0, newWidth, newHeight);
                    });
                    tempBackgroundCanvas.width = newWidth;
                    tempBackgroundCanvas.height = newHeight;
                    flattenAndDraw(); // Redraw everything after resize
                }
            }
        });
        resizeObserver.observe(mainCanvas);


        createLayerPanelUI();
        addInitialLayer(); // Add one default layer
        setupDrawingListeners();
        flattenAndDraw(); // Initial draw to ensure canvas is clear and layers are rendered
    }

    // Wait for the Drawaria canvas to be available before initializing the script
    const CMAX_WAIT_FOR_CANVAS = 20000; // Max wait time in ms
    const CINTERVAL_WAIT_FOR_CANVAS = 200; // Check interval in ms
    let waitTimeElapsed = 0;
    const g_interv = setInterval(function() {
        if (document.getElementById('canvas') && document.getElementById('canvas').getContext('2d')) {
            clearInterval(g_interv);
            initializeLayerScript();
        } else if (waitTimeElapsed >= CMAX_WAIT_FOR_CANVAS) {
            clearInterval(g_interv);
            console.error("Drawaria Layer System: Canvas not ready in time, script initialization aborted.");
        }
        waitTimeElapsed += CINTERVAL_WAIT_FOR_CANVAS;
    }, CINTERVAL_WAIT_FOR_CANVAS);

})();