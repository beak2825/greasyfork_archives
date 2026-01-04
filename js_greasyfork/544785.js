// ==UserScript==
// @name         Drawaria AutoDraw Vectorized (Fast)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pega imágenes con dos métodos: Pixel (detallado) y Vectorizado (extremadamente rápido, <100 comandos para imágenes simples). Incluye dibujador de texto. Ahora con renderizado local de los comandos.
// @author       YouTubeDrawaria
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544785/Drawaria%20AutoDraw%20Vectorized%20%28Fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544785/Drawaria%20AutoDraw%20Vectorized%20%28Fast%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // === 1. CAPTURA DEL WEBSOCKET Y CONFIGURACIÓN GLOBAL ===
    // =================================================================================

    const canvas = document.getElementById('canvas');
    const ctx = canvas ? canvas.getContext('2d') : null; // Ensure ctx is null if canvas isn't found
    let drawariaSocket;
    let socketStatus = 'disconnected'; // Current WebSocket connection status

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && (this.url.includes('drawaria') || this.url.includes('socket') || /:\d{4,5}/.test(this.url))) {
            drawariaSocket = this;
            this.addEventListener('open', () => updateConnectionStatus('connected'));
            this.addEventListener('close', () => updateConnectionStatus('disconnected'));
            this.addEventListener('error', () => updateConnectionStatus('disconnected'));
            if (this.readyState === WebSocket.OPEN) {
                updateConnectionStatus('connected');
            }
        }
        return originalSend.apply(this, args);
    };

    // Updates the connection status display in the UI
    function updateConnectionStatus(status) {
        socketStatus = status;
        const statusIndicator = document.getElementById('drwr-autodraw-connectionStatus');
        const statusText = document.getElementById('drwr-autodraw-statusText');

        if (statusIndicator && statusText) {
            if (status === 'connected') {
                statusIndicator.className = 'drwr-autodraw-status-indicator drwr-autodraw-status-connected';
                statusText.textContent = 'Connected';
            } else {
                statusIndicator.className = 'drwr-autodraw-status-indicator drwr-autodraw-status-disconnected';
                statusText.textContent = 'Disconnected';
            }
        }
    }

    // === Local Drawing Function ===
    // This function draws on the local canvas using normalized coordinates.
    // It's crucial for the "botless" local rendering.
    function drawLineLocally(startX_norm, startY_norm, endX_norm, endY_norm, thickness, color) {
        if (!canvas || !ctx) {
            console.error("Canvas or context not available for local drawing.");
            return;
        }

        // Convert normalized coordinates (0.0 to 1.0) to pixel coordinates for local drawing
        const startPixelX = startX_norm * canvas.width;
        const startPixelY = startY_norm * canvas.height;
        const endPixelX = endX_norm * canvas.width;
        const endPixelY = endY_norm * canvas.height;

        // Draw locally
        ctx.strokeStyle = color;
        // Drawaria uses negative thickness for drawing commands. Convert it to positive for local rendering.
        ctx.lineWidth = Math.abs(thickness);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startPixelX, startPixelY);
        ctx.lineTo(endPixelX, endPixelY);
        ctx.stroke();
    }


    // =================================================================================
    // === 2. NUEVA FUNCIONALIDAD: PEGADO VECTORIZADO ===
    // =================================================================================

    // --- Configuración para el método Vectorizado ---
    const VEC_RESOLUTION = 120; // Resolución a la que se procesa la imagen. 120 es un buen balance.
    const VEC_COLORS = 16;      // Número de colores a los que se reduce la imagen. Menos colores = menos comandos.
    const VEC_LINE_THICKNESS = 4; // Grosor de las líneas dibujadas. Ayuda a rellenar espacios.

    /**
     * Convierte una imagen en una serie de comandos de LÍNEAS HORIZONTALES.
     */
    function imageToScanlineCommands(img, callback) {
        const palette = [
            [0,0,0], [255,255,255], [255,0,0], [0,255,0], [0,0,255], [255,255,0],
            [0,255,255], [255,0,255], [128,128,128], [192,192,192], [128,0,0],
            [0,128,0], [0,0,128], [128,128,0], [128,0,128], [0,128,128]
        ].slice(0, VEC_COLORS);

        function findClosestColor(r, g, b) {
            let closest = palette[0];
            let minDistance = Infinity;
            for (const color of palette) {
                const dist = Math.sqrt(Math.pow(r - color[0], 2) + Math.pow(g - color[1], 2) + Math.pow(b - color[2], 2));
                if (dist < minDistance) {
                    minDistance = dist;
                    closest = color;
                }
            }
            return `rgb(${closest[0]},${closest[1]},${closest[2]})`;
        }

        const offCanvas = document.createElement('canvas');
        const aspectRatio = img.height / img.width;
        offCanvas.width = VEC_RESOLUTION;
        offCanvas.height = Math.round(VEC_RESOLUTION * aspectRatio);
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

        const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        const commands = [];
        const baseW = offCanvas.width;
        const baseH = offCanvas.height;

        const gameCanvasWidth = 780; // Drawaria's internal canvas width for normalization
        const gameCanvasHeight = 650; // Drawaria's internal canvas height for normalization

        for (let y = 0; y < baseH; y++) {
            let x = 0;
            while (x < baseW) {
                const i = (y * baseW + x) * 4;
                const r = imgData.data[i], g = imgData.data[i+1], b = imgData.data[i+2], a = imgData.data[i+3];

                if (a < 128) { // Ignorar píxeles transparentes
                    x++;
                    continue;
                }

                const color = findClosestColor(r, g, b);
                if (color === 'rgb(255,255,255)') { // Opcional: Ignorar el blanco para ahorrar comandos
                    x++;
                    continue;
                }

                let startX = x;
                while (x < baseW && findClosestColor(imgData.data[(y * baseW + x) * 4], imgData.data[(y * baseW + x) * 4 + 1], imgData.data[(y * baseW + x) * 4 + 2]) === color) {
                    x++;
                }
                let endX = x - 1;

                // Prepare parameters for both sending and local drawing
                const normX1 = ((startX * (gameCanvasWidth / baseW)) / gameCanvasWidth);
                const normY1 = ((y * (gameCanvasHeight / baseH)) / gameCanvasHeight);
                const normX2 = ((endX * (gameCanvasWidth / baseW)) / gameCanvasWidth);
                const protocolThickness = 0 - VEC_LINE_THICKNESS; // Negative thickness for Drawaria protocol

                // Store both the raw command string and the parameters for local drawing
                commands.push({
                    protocolCommand: `42["drawcmd",0,[${normX1.toFixed(4)},${normY1.toFixed(4)},${normX2.toFixed(4)},${normY1.toFixed(4)},false,${protocolThickness},"${color}",0,0,{}]]`,
                    localDrawParams: [normX1, normY1, normX2, normY1, protocolThickness, color]
                });
            }
        }
        callback(commands);
    }

    /**
     * Función genérica para enviar comandos y dibujarlos localmente.
     */
    function sendCommands(commands, statusElement, buttonElement) {
        if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN) {
            statusElement.innerText = `Error: Not connected to Drawaria.`;
            if(buttonElement) buttonElement.disabled = false;
            updateConnectionStatus('disconnected'); // Ensure UI reflects disconnection
            return;
        }
        statusElement.innerText = `Sending ${commands.length} commands...`;
        if(buttonElement) buttonElement.disabled = true;

        // Clear the local canvas before drawing a new image
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        let i = 0;
        function send() {
            for (let j = 0; j < 20 && i < commands.length; j++, i++) { // Send in batches to avoid overwhelming
                const cmd = commands[i];
                // Draw locally
                drawLineLocally(...cmd.localDrawParams);
                // Send to server
                drawariaSocket.send(cmd.protocolCommand);
            }
            if (i < commands.length) {
                setTimeout(send, 1); // Minimal pause for next batch
            } else {
                 statusElement.innerText = `Image pasted with ${commands.length} commands!`;
                 if(buttonElement) buttonElement.disabled = false;
            }
        }
        send();
    }


    // =================================================================================
    // === 3. INTERFAZ DE USUARIO (UI UNIFICADA Y MEJORADA) ===
    // =================================================================================

    // === UI Elements CSS ===
    const style = document.createElement('style');
    style.textContent = `
        /* Boxicons import for icons */
        @import url('https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css');

        .drwr-autodraw-tool-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            max-height: 90vh;
            background: #2c3e50;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            color: #ecf0f1;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
            overflow: hidden;
            display: none; /* Hidden by default, toggled by 'A' button */
            flex-direction: column;
        }

        .drwr-autodraw-tool-header {
            background: #34495e;
            padding: 12px 15px;
            cursor: grab;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #2c3e50;
            user-select: none;
        }
        .drwr-autodraw-tool-header.dragging {
            cursor: grabbing;
        }

        .drwr-autodraw-tool-title {
            font-weight: 600;
            font-size: 16px;
            color: #ecf0f1;
        }

        .drwr-autodraw-tool-close {
            background: none;
            border: none;
            color: #ecf0f1;
            font-size: 18px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .drwr-autodraw-tool-close:hover {
            color: #e74c3c;
        }

        .drwr-autodraw-tool-content {
            padding: 15px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .drwr-autodraw-section-title {
            font-size: 14px;
            color: #3498db;
            margin-top: 10px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #2c3e50;
            font-weight: bold;
        }

        .drwr-autodraw-form-group {
            margin-bottom: 15px;
        }

        .drwr-autodraw-form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            color: #bdc3c7;
        }

        .drwr-autodraw-btn {
            padding: 8px 10px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            border: none;
            color: white;
            background-color: #008000; /* Green for vectorized paste */
            width: 100%;
            margin-top: 5px;
        }
        .drwr-autodraw-btn:hover {
            background-color: #006400;
            transform: translateY(-1px);
        }
        .drwr-autodraw-btn:disabled {
            background-color: #555;
            cursor: not-allowed;
        }

        .drwr-autodraw-status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
        }
        .drwr-autodraw-status-connected { background-color: #2ecc71; }
        .drwr-autodraw-status-disconnected { background-color: #e74c3c; }

        /* File Input Styling */
        .drwr-autodraw-tool-container input[type="file"] {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            background-color: #34495e;
            border: 1px solid #2c3e50;
            border-radius: 4px;
            color: #ecf0f1;
            cursor: pointer;
            font-size: 13px;
        }
        .drwr-autodraw-tool-container input[type="file"]::file-selector-button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
            transition: background-color 0.2s;
        }
        .drwr-autodraw-tool-container input[type="file"]::file-selector-button:hover {
            background-color: #2980b9;
        }

        /* Toggle Button Styles */
        #drwr-autodraw-toggleButton {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 1001;
            background-color: #3498db; /* Blue color */
            color: white;
            font-weight: bold;
            font-size: 18px;
            cursor: pointer;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s, transform 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #drwr-autodraw-toggleButton:hover {
            background-color: #2980b9;
            transform: scale(1.05);
        }
        #drwr-autodraw-toggleButton.active {
            background-color: #7f8c8d; /* Grey when active/menu open */
        }
    `;
    document.head.appendChild(style);

    // === UI Elements HTML Structure ===
    const mainContainer = document.createElement('div');
    mainContainer.className = 'drwr-autodraw-tool-container';
    mainContainer.innerHTML = `
        <div class="drwr-autodraw-tool-header">
            <div class="drwr-autodraw-tool-title">AutoDraw Vectorized (Fast)</div>
            <button class="drwr-autodraw-tool-close">×</button>
        </div>
        <div class="drwr-autodraw-tool-content">
            <div class="drwr-autodraw-section-title">Connection Status</div>
            <div style="margin-bottom: 15px;">
                <span id="drwr-autodraw-connectionStatus" class="drwr-autodraw-status-indicator drwr-autodraw-status-disconnected"></span>
                <span id="drwr-autodraw-statusText">Disconnected</span>
            </div>

            <div class="drwr-autodraw-section-title">Pick Image and Press Start</div>
            <div class="drwr-autodraw-form-group">
                <label for="drwr-autodraw-imageInput">Select Image</label>
                <input type="file" id="drwr-autodraw-imageInput" accept="image/*">
            </div>
            <button id="drwr-autodraw-vectorizedButton" class="drwr-autodraw-btn">Start (Vectorized - FAST)</button>
            <div id="drwr-autodraw-imageStatus" style="font-size: 0.8em; margin-top: 5px; color: #bdc3c7;"></div>
        </div>
    `;
    document.body.appendChild(mainContainer);

    // Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'drwr-autodraw-toggleButton';
    toggleButton.innerHTML = `<i class="fas fa-paint-brush"></i>`; // Paint brush icon
    toggleButton.title = "Toggle AutoDraw Vectorized";
    document.body.appendChild(toggleButton);

    // === UI Elements References ===
    const imageInput = document.getElementById('drwr-autodraw-imageInput');
    const vectorizedButton = document.getElementById('drwr-autodraw-vectorizedButton');
    const imageStatus = document.getElementById('drwr-autodraw-imageStatus');


    // =================================================================================
    // === 4. MANEJADORES DE EVENTOS ===
    // =================================================================================

    function handleImageFile(callback) {
        if (!imageInput.files.length) { alert('Please select an image first.'); return; }
        if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN) { alert("Socket not ready. Draw something to activate the connection."); return; }

        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                callback(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Evento para el botón Vectorizado
    vectorizedButton.addEventListener('click', () => {
        handleImageFile((img) => {
            imageStatus.innerText = 'Processing image (Vectorizing)...';
            vectorizedButton.disabled = true;
            imageToScanlineCommands(img, (commands) => {
                sendCommands(commands, imageStatus, vectorizedButton);
            });
        });
    });

    // Make the main container draggable
    let isDragging = false;
    let offsetX, offsetY;
    const header = mainContainer.querySelector('.drwr-autodraw-tool-header');

    header.addEventListener('mousedown', (e) => {
        // Prevent dragging if click is on buttons within the header
        if (e.target.closest('button')) return;
        isDragging = true;
        offsetX = e.clientX - mainContainer.getBoundingClientRect().left;
        offsetY = e.clientY - mainContainer.getBoundingClientRect().top;
        mainContainer.classList.add('dragging');
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        mainContainer.style.left = `${e.clientX - offsetX}px`;
        mainContainer.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            mainContainer.classList.remove('dragging');
        }
    });

    // Close button for the main container
    mainContainer.querySelector('.drwr-autodraw-tool-close').addEventListener('click', () => {
        mainContainer.style.display = 'none';
        toggleButton.classList.remove('active'); // Deactivate toggle button
    });

    // Toggle Button Logic
    toggleButton.addEventListener('click', () => {
        const isHidden = mainContainer.style.display === 'none' || mainContainer.style.display === '';
        mainContainer.style.display = isHidden ? 'flex' : 'none'; // Use 'flex' for vertical layout

        if (isHidden) {
            toggleButton.classList.add('active'); // Style active state
            // Update canvas dimensions if they changed while menu was closed
            // No direct action needed here, as canvas.width/height are live properties.
        } else {
            toggleButton.classList.remove('active');
        }
    });

    // === Initialization ===
    function initializeScript() {
        // Wait for the main game canvas to be available and its dimensions to be non-zero
        // and for the chatbox_textinput (a common element that implies game is loaded)
        if (!document.getElementById('canvas') || !document.getElementById('chatbox_textinput') || !(canvas && canvas.width > 0 && canvas.height > 0)) {
            setTimeout(initializeScript, 500); // Retry after 500ms
            return;
        }

        // Initial setup for the UI and WebSocket status
        updateConnectionStatus(drawariaSocket && drawariaSocket.readyState === WebSocket.OPEN ? 'connected' : 'disconnected');
        console.log("Drawaria Bad AutoDraw Tool Loaded and Ready!");
    }

    // Run initialization function when document is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }

})();