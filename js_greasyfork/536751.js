// ==UserScript==
// @name         Drawaria Flag Draw Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Herramienta de dibujo de banderas para Drawaria.online, con renderizado local y menú arrastrable.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/536751/Drawaria%20Flag%20Draw%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/536751/Drawaria%20Flag%20Draw%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Global Variables & Constants ===
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let socket; // La conexión WebSocket principal del juego

    // Variables para Autodraw (imágenes y banderas)
    let drawing_active = false;
    let previewCanvas = document.createElement('canvas'); // Canvas auxiliar para cargar y procesar imágenes
    let previewCtx = previewCanvas.getContext('2d');
    let imgDataGlobal; // Datos de píxeles de la imagen cargada
    let executionLine = []; // Líneas a dibujar

    // Configuración por defecto de Autodraw (ajustables desde la UI)
    let autodrawImageSize = 4;
    let autodrawBrushSize = 13;
    let autodrawPixelSize = 2;
    let autodrawOffsetX = 0;
    let autodrawOffsetY = 0;

    let socketStatus = 'disconnected'; // Estado de la conexión WebSocket

    // === Hook into WebSocket (Captura la conexión principal del juego) ===
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) { // Si aún no hemos capturado el socket principal
            socket = this; // Guárdalo
            // Añade un listener para monitorear el estado del socket
            this.addEventListener('open', () => updateConnectionStatus('connected'));
            this.addEventListener('close', () => updateConnectionStatus('disconnected'));
            this.addEventListener('error', () => updateConnectionStatus('disconnected'));
            // Monitorear mensajes entrantes para mantener el estado (opcional, pero útil)
            this.addEventListener('message', (event) => {
                let message = String(event.data);
                if (message.startsWith('430')) { // Mensaje de configuración de sala
                    try {
                        let configs = JSON.parse(message.slice(3))[0];
                        if (configs.roomid) {
                            updateConnectionStatus('connected'); // Confirma conexión al entrar a una sala
                        }
                    } catch (e) {
                        console.debug('Error parsing room config message:', e);
                    }
                } else if (message.startsWith('41')) { // Mensaje de ping/pong o cierre
                    // Este es un mensaje de "ping" o similar, no necesariamente desconexión
                }
            });
            console.log('Drawaria Flag Draw Tool: WebSocket hooked successfully.');
            if (this.readyState === WebSocket.OPEN) {
                 updateConnectionStatus('connected');
            }
        }
        return originalSend.apply(this, args);
    };


    // === Flag Configurations ===
    const flags = {
        Russia: 'https://flagcdn.com/w320/ru.png',
        Ukraine: 'https://flagcdn.com/w320/ua.png',
        Uzbekistan: 'https://flagcdn.com/w320/uz.png',
        India: 'https://flagcdn.com/w320/in.png',
        Armenia: 'https://flagcdn.com/w320/am.png',
        Latvia: 'https://flagcdn.com/w320/lv.png',
        Estonia: 'https://flagcdn.com/w320/ee.png',
        Bulgaria: 'https://flagcdn.com/w320/bg.png',
        Germany: 'https://flagcdn.com/w320/de.png',
        Netherlands: 'https://flagcdn.com/w320/nl.png',
        Hungary: 'https://flagcdn.com/w320/hu.png',
        Luxembourg: 'https://flagcdn.com/w320/lu.png'
    };


    // === Utility Functions ===
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateConnectionStatus(status) {
        socketStatus = status;
        const statusIndicator = document.getElementById('connectionStatus');
        const statusText = document.getElementById('statusText');

        if (statusIndicator && statusText) {
            if (status === 'connected') {
                statusIndicator.className = 'status-indicator status-connected';
                statusText.textContent = 'Connected';
            } else {
                statusIndicator.className = 'status-indicator status-disconnected';
                statusText.textContent = 'Disconnected';
            }
        }
    }

    // === Drawing Functions (Local Rendering + Sending) ===

    // Función central para dibujar una línea (local y remoto)
    function drawLineAndSendCommand(x1, y1, x2, y2, color, thickness) {
        if (!canvas) {
            console.error('Canvas element not found.');
            return;
        }

        // Dibuja localmente en tu lienzo
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Envía el comando al servidor vía WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
            const normX1 = (x1 / canvas.width).toFixed(4);
            const normY1 = (y1 / canvas.height).toFixed(4);
            const normX2 = (x2 / canvas.width).toFixed(4);
            const normY2 = (y2 / canvas.height).toFixed(4);

            const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
            socket.send(command);
        } else {
            console.warn('WebSocket not open. Command not sent to server.');
        }
    }

    // === Autodraw Core Functions (Flags) ===

    // Convierte coordenadas de píxeles a coordenadas normalizadas (0-1) con offset
    function recalc(value, offset) {
        const cw = canvas.width;
        const ch = canvas.height;
        return [
            Math.min(1, Math.max(0, (value[0] / cw + offset.x / 100))).toFixed(4),
            Math.min(1, Math.max(0, (value[1] / ch + offset.y / 100))).toFixed(4)
        ];
    }

    // Carga la imagen en un canvas auxiliar para obtener sus datos de píxeles
    function loadImageForAutodraw(url) {
        let img = new Image();
        img.crossOrigin = 'anonymous'; // Necesario para imágenes de diferentes orígenes
        img.src = url;
        img.addEventListener('load', () => {
            if (!canvas) { // Asegúrate de que el canvas principal existe
                console.error('Main canvas element not found for Autodraw.');
                return;
            }
            const cw = canvas.width;
            const ch = canvas.height;

            previewCanvas.width = cw;
            previewCanvas.height = ch;
            previewCtx.clearRect(0, 0, cw, ch); // Limpia el canvas auxiliar

            // Escala y centra la imagen en el canvas auxiliar
            let scale = Math.min(cw / img.width, ch / img.height); // Usa Math.min para que la imagen quepa completamente
            let scaledWidth = img.width * scale;
            let scaledHeight = img.height * scale;
            let dx = (cw - scaledWidth) / 2;
            let dy = (ch - scaledHeight) / 2;

            previewCtx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
            imgDataGlobal = previewCtx.getImageData(0, 0, cw, ch).data; // Almacena los datos de píxeles
            console.debug('Image loaded and processed for Autodraw.');
        });
        img.addEventListener('error', () => {
            console.error('Failed to load image for Autodraw:', url);
        });
    }

    // Procesa los datos de la imagen para generar la línea de ejecución de dibujo
    function processImageForAutodraw(size, modifier = 1, thickness = 5, offset = { x: 0, y: 0 }, ignoreColors = []) {
        if (!imgDataGlobal || !canvas) {
            console.error('No image data or canvas available for processing.');
            return;
        }
        executionLine = [];
        const cw = canvas.width;
        const ch = canvas.height;
        const step = size * modifier; // Distancia de muestreo entre píxeles

        // Recorre la imagen fila por fila
        for (let y = 0; y < ch; y += step) {
            let startX = 0;
            let currentColor = null;

            for (let x = 0; x < cw; x += 1) { // Recorre píxel por píxel horizontalmente para detectar cambios de color
                const currentPixelX = Math.floor(x / step) * step; // Asegura que se muestree en la cuadrícula
                const currentPixelY = Math.floor(y / step) * step;

                const index = (Math.floor(currentPixelY) * cw + Math.floor(currentPixelX)) * 4;
                const a = imgDataGlobal[index + 3] || 0; // Canal alfa

                if (a > 20) { // Si el píxel no es transparente
                    const r = imgDataGlobal[index + 0] || 0;
                    const g = imgDataGlobal[index + 1] || 0;
                    const b = imgDataGlobal[index + 2] || 0;
                    const color = `rgb(${r},${g},${b})`;

                    if (!ignoreColors.includes(color)) {
                        if (color !== currentColor) { // Si el color cambia
                            if (currentColor !== null && x > startX) { // Si había un segmento de color anterior
                                executionLine.push({
                                    pixelPos1: [startX, y],
                                    pixelPos2: [x, y],
                                    color: currentColor,
                                    thickness: thickness,
                                });
                            }
                            currentColor = color;
                            startX = x;
                        }
                    } else { // Si el color está en la lista de ignorados o es transparente
                        if (currentColor !== null && x > startX) {
                            executionLine.push({
                                pixelPos1: [startX, y],
                                pixelPos2: [x, y],
                                color: currentColor,
                                thickness: thickness,
                            });
                        }
                        currentColor = null;
                    }
                } else { // Si el píxel es transparente
                    if (currentColor !== null && x > startX) {
                        executionLine.push({
                            pixelPos1: [startX, y],
                            pixelPos2: [x, y],
                            color: currentColor,
                            thickness: thickness,
                        });
                    }
                    currentColor = null;
                }
            }
            // Agrega el último segmento de la fila si existe
            if (currentColor !== null && cw > startX) {
                executionLine.push({
                    pixelPos1: [startX, y],
                    pixelPos2: [cw, y], // Hasta el final de la fila
                    color: currentColor,
                    thickness: thickness,
                });
            }
        }
        console.debug('Image processing complete, lines:', executionLine.length);
    }

    // Ejecuta el dibujo de las líneas generadas
    async function executeAutodraw() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            alert('WebSocket no está conectado. Asegúrate de estar en una sala de Drawaria.');
            return;
        }
        if (executionLine.length === 0) {
            alert('No se generaron líneas para dibujar. Carga y procesa una imagen primero.');
            return;
        }

        drawing_active = true;
        for (let i = 0; i < executionLine.length; i++) {
            if (!drawing_active) {
                console.log('Autodraw detenido por el usuario.');
                break;
            }
            const line = executionLine[i];
            const p1 = recalc(line.pixelPos1, { x: autodrawOffsetX, y: autodrawOffsetY }); // Normalizadas para enviar
            const p2 = recalc(line.pixelPos2, { x: autodrawOffsetX, y: autodrawOffsetY });
            const color = line.color;
            const thickness = line.thickness;

            // Dibuja localmente y envía el comando
            drawLineAndSendCommand(line.pixelPos1[0], line.pixelPos1[1], line.pixelPos2[0], line.pixelPos2[1], color, thickness);
            await delay(1); // Pequeña pausa para evitar sobrecargar el servidor
        }
        drawing_active = false;
        console.log('Autodraw completo.');
    }


    // === UI Elements CSS ===
    const style = document.createElement('style');
    style.textContent = `
        /* Boxicons - if not already linked by Tampermonkey's @require */
        @import url('https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css');

        .drawaria-flag-autodraw-tool-container { /* Changed class name */
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            max-height: 90vh; /* Limita la altura para que no desborde la pantalla */
            background: #2c3e50;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            color: #ecf0f1;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
            overflow: hidden; /* Oculta el scroll si no es necesario */
            display: none; /* Hidden by default, toggled by 'T' button */
            flex-direction: column; /* Para layout interno */
        }

        .drawaria-flag-autodraw-tool-header { /* Changed class name */
            padding: 12px 15px;
            cursor: grab; /* Cursor para arrastrar */
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #2c3e50;
            user-select: none; /* Evita selección de texto al arrastrar */
        }
        .drawaria-flag-autodraw-tool-header.dragging { /* Changed class name */
            cursor: grabbing;
        }

        .drawaria-flag-autodraw-tool-title { /* Changed class name */
            font-weight: 600;
            font-size: 16px;
            color: #ecf0f1;
        }

        .drawaria-flag-autodraw-tool-close { /* Changed class name */
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            transition: color 0.2s;
        }

        .drawaria-flag-autodraw-tool-close:hover { /* Changed class name */
            color: #e74c3c;
        }

        .drawaria-flag-autodraw-tool-content { /* Changed class name */
            padding: 15px;
            overflow-y: auto; /* Scroll si el contenido es demasiado largo */
            flex-grow: 1; /* Permite que el contenido se expanda */
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            color: #bdc3c7;
        }

        .form-control {
            width: calc(100% - 24px); /* Ancho total menos padding */
            padding: 8px 12px;
            border: 1px solid #2c3e50;
            border-radius: 4px;
            font-size: 13px;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            outline: none;
            border-color: #3498db;
        }

        .btn {
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        .btn-primary {
            background: #3498db;
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background: #2980b9;
        }

        .btn-danger {
            background: #e74c3c;
            color: white;
            border: none;
        }

        .btn-danger:hover {
            background: #c0392b;
        }

        .btn-outline {
            background: transparent;
            border: 1px solid #3498db;
            color: #3498db;
        }

        .btn-outline:hover {
            background: rgba(52, 152, 219, 0.1);
        }

        .btn-block {
            width: 100%;
        }

        .btn-group {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
        }

        .btn-group .btn {
            flex: 1;
        }

        .select-control {
            position: relative;
        }

        .select-control:after {
            content: "▼";
            font-size: 10px;
            color: #bdc3c7;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
        }

        .slider-container {
            margin-bottom: 10px;
        }

        .slider-container label {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            color: #bdc3c7;
        }

        .slider-value {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
            color: #7f8c8d;
        }

        input[type="range"] {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            border-radius: 3px;
            margin: 5px 0;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #3498db;
            border-radius: 50%;
            cursor: pointer;
        }

        .section-title {
            font-size: 14px;
            color: #3498db;
            margin-top: 10px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #2c3e50;
            font-weight: bold;
        }

        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
        }

        .status-connected {
            background-color: #2ecc71;
        }

        .status-disconnected {
            background-color: #e74c3c;
        }

        /* Styles for the main toggle button */
        #drawariaFlagToolToggleButton { /* Changed ID */
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 1001; /* Higher z-index to be above the main panel */
            background-color: #4CAF50; /* Green color to make it stand out */
            color: white;
            font-weight: bold;
            font-size: 18px;
            cursor: pointer;
            width: 45px; /* Increased size */
            height: 45px; /* Increased size */
            border-radius: 50%; /* Make it round */
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s, transform 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #drawariaFlagToolToggleButton:hover { /* Changed ID */
            background-color: #45a049;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);


    // === UI Elements HTML Structure ===
    const mainContainer = document.createElement('div');
    mainContainer.className = 'drawaria-flag-autodraw-tool-container'; // Changed class name
    mainContainer.innerHTML = `
        <div class="drawaria-flag-autodraw-tool-header">
            <div class="drawaria-flag-autodraw-tool-title">Drawaria Flag Autodraw Tool</div>
            <button class="drawaria-flag-autodraw-tool-close">×</button>
        </div>
        <div class="drawaria-flag-autodraw-tool-content">
            <div class="section-title">Connection Status</div>
            <div style="margin-bottom: 15px;">
                <span id="connectionStatus" class="status-indicator status-disconnected"></span>
                <span id="statusText">Disconnected</span>
            </div>

            <div class="section-title">Flag Drawing</div>
            <div class="form-group">
                <label for="flagSelect">Select Flag to Draw</label>
                <div class="select-control">
                    <select id="flagSelect" class="form-control">
                        <option value="">Select a Flag</option>
                        ${Object.keys(flags).map(flag => `<option value="${flag}">${flag}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="slider-container">
                <label for="autodraw_imagesize">Image Size</label>
                <div class="slider-value">
                    <span>Big</span>
                    <span id="autodrawImagesizeValue">4</span>
                    <span>Small</span>
                </div>
                <input type="range" id="autodraw_imagesize" min="1" max="10" value="4">
            </div>

            <div class="slider-container">
                <label for="autodraw_brushsize">Brush Size</label>
                <div class="slider-value">
                    <span>Thin</span>
                    <span id="autodrawBrushsizeValue">13</span>
                    <span>Thick</span>
                </div>
                <input type="range" id="autodraw_brushsize" min="2" max="20" value="13">
            </div>

            <div class="slider-container">
                <label for="autodraw_pixelsize">Pixel Distance</label>
                <div class="slider-value">
                    <span>Close</span>
                    <span id="autodrawPixelsizeValue">2</span>
                    <span>Far</span>
                </div>
                <input type="range" id="autodraw_pixelsize" min="2" max="20" value="2">
            </div>

            <div class="slider-container">
                <label for="autodraw_offset_x">Horizontal Offset (%)</label>
                <div class="slider-value">
                    <span>0</span>
                    <span id="autodrawOffsetXValue">0</span>
                    <span>100</span>
                </div>
                <input type="range" id="autodraw_offset_x" min="0" max="100" value="0">
            </div>

            <div class="slider-container">
                <label for="autodraw_offset_y">Vertical Offset (%)</label>
                <div class="slider-value">
                    <span>0</span>
                    <span id="autodrawOffsetYValue">0</span>
                    <span>100</span>
                </div>
                <input type="range" id="autodraw_offset_y" min="0" max="100" value="0">
            </div>

            <div class="btn-group">
                <button id="startAutodrawButton" class="btn btn-primary"><i class='bx bx-play-circle'></i> Start Autodraw</button>
                <button id="stopAutodrawButton" class="btn btn-danger"><i class='bx bx-stop-circle'></i> Stop Autodraw</button>
            </div>

            <div class="btn-group">
                <button id="clearCanvasButton" class="btn btn-outline"><i class='bx bxs-eraser'></i> Clear All</button>
            </div>
        </div>
    `;
    document.body.appendChild(mainContainer);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'drawariaFlagToolToggleButton'; // Changed ID
    toggleButton.innerText = 'T';
    document.body.appendChild(toggleButton);


    // === UI Elements References ===
    // Autodraw (Flags)
    const flagSelect = document.getElementById('flagSelect');
    // Removed imageFileInput as it's no longer needed
    const autodrawImageSizeInput = document.getElementById('autodraw_imagesize');
    const autodrawBrushSizeInput = document.getElementById('autodraw_brushsize');
    const autodrawPixelSizeInput = document.getElementById('autodraw_pixelsize');
    const autodrawOffsetXInput = document.getElementById('autodraw_offset_x');
    const autodrawOffsetYInput = document.getElementById('autodraw_offset_y');
    const startAutodrawButton = document.getElementById('startAutodrawButton');
    const stopAutodrawButton = document.getElementById('stopAutodrawButton');
    const clearCanvasButton = document.getElementById('clearCanvasButton');


    // === Event Handlers ===

    // Make the main container draggable
    let isDragging = false;
    let offsetX, offsetY;
    const header = mainContainer.querySelector('.drawaria-flag-autodraw-tool-header'); // Changed class name

    header.addEventListener('mousedown', (e) => {
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
        isDragging = false;
        mainContainer.classList.remove('dragging');
    });

    // Close button for the main container
    mainContainer.querySelector('.drawaria-flag-autodraw-tool-close').addEventListener('click', () => { // Changed class name
        mainContainer.style.display = 'none';
        // Reset toggle button color
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.color = 'white';
        toggleButton.style.transform = 'scale(1)';
    });


    // Update slider values display
    const updateSliderValueDisplay = (sliderInput, valueSpan) => {
        valueSpan.textContent = sliderInput.value;
        sliderInput.addEventListener('input', () => {
            valueSpan.textContent = sliderInput.value;
        });
    };
    updateSliderValueDisplay(autodrawImageSizeInput, document.getElementById('autodrawImagesizeValue'));
    updateSliderValueDisplay(autodrawBrushSizeInput, document.getElementById('autodrawBrushsizeValue'));
    updateSliderValueDisplay(autodrawPixelSizeInput, document.getElementById('autodrawPixelsizeValue'));
    updateSliderValueDisplay(autodrawOffsetXInput, document.getElementById('autodrawOffsetXValue'));
    updateSliderValueDisplay(autodrawOffsetYInput, document.getElementById('autodrawOffsetYValue'));


    // Autodraw Event Listeners
    flagSelect.addEventListener('change', (e) => {
        const selectedFlagName = e.target.value;
        if (selectedFlagName && flags[selectedFlagName]) {
            // No need to clear imageFileInput as it doesn't exist anymore
            loadImageForAutodraw(flags[selectedFlagName]);
        } else if (!selectedFlagName) {
            imgDataGlobal = null; // Clear image data if no flag is selected
            console.debug('No flag selected, image data cleared.');
        }
    });

    // Removed imageFileInput.addEventListener('change', ...) as it's no longer needed

    startAutodrawButton.addEventListener('click', () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            alert('WebSocket no está conectado. Asegúrate de estar en una sala de Drawaria.');
            return;
        }
        if (!imgDataGlobal) {
            alert('Por favor, selecciona una bandera primero para el autodraw.');
            return;
        }

        autodrawImageSize = parseInt(autodrawImageSizeInput.value, 10);
        autodrawBrushSize = parseInt(autodrawBrushSizeInput.value, 10);
        autodrawPixelSize = parseInt(autodrawPixelSizeInput.value, 10);
        autodrawOffsetX = parseInt(autodrawOffsetXInput.value, 10);
        autodrawOffsetY = parseInt(autodrawOffsetYInput.value, 10);

        processImageForAutodraw(autodrawImageSize, autodrawPixelSize, autodrawBrushSize, { x: autodrawOffsetX, y: autodrawOffsetY });
        executeAutodraw();
    });

    stopAutodrawButton.addEventListener('click', () => {
        drawing_active = false;
        console.log('Autodraw stopped by user.');
    });

    clearCanvasButton.addEventListener('click', async () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            alert('WebSocket no está conectado. No se puede borrar el lienzo.');
            return;
        }

        // Borrar lienzo local inmediatamente
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Enviar múltiples comandos de borrado al servidor
        const clearThickness = 1000;
        const clearColor = '#ffffff'; // Blanco para borrar
        const steps = 5; // Número de líneas para cubrir el lienzo

        for (let i = 0; i <= steps; i++) {
            // Líneas horizontales
            drawLineAndSendCommand(0, (i / steps) * canvas.height, canvas.width, (i / steps) * canvas.height, clearColor, clearThickness);
            await delay(5);
            // Líneas verticales
            drawLineAndSendCommand((i / steps) * canvas.width, 0, (i / steps) * canvas.width, canvas.height, clearColor, clearThickness);
            await delay(5);
        }
    });


    // Toggle Button Logic (activar/desactivar el menú principal)
    toggleButton.addEventListener('click', () => {
        const isHidden = mainContainer.style.display === 'none' || mainContainer.style.display === '';
        mainContainer.style.display = isHidden ? 'flex' : 'none'; // 'flex' para mantener el layout interno

        if (isHidden) {
            toggleButton.style.backgroundColor = '#949494'; // Color gris cuando está abierto
            toggleButton.style.color = 'white';
            toggleButton.style.transform = 'scale(1)'; // Quita el efecto de hover
        } else {
            toggleButton.style.backgroundColor = '#4CAF50'; // Vuelve al color original cuando está cerrado
            toggleButton.style.color = 'white';
        }
    });

    // Initial check for connection status
    if (socket && socket.readyState === WebSocket.OPEN) {
        updateConnectionStatus('connected');
    } else {
        updateConnectionStatus('disconnected');
    }

})();