// ==UserScript==
// @name         Drawaria Generative Animator Suite
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Convierte tus dibujos en múltiples animaciones espectaculares usando un bot.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539212/Drawaria%20Generative%20Animator%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/539212/Drawaria%20Generative%20Animator%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTADO GLOBAL ---
    let isAnimating = false;
    let drawingPixels = [];
    let botSocket = null;
    let originalCanvas = null;
    let cw = 0, ch = 0;
    let isPanelVisible = true;

    console.log("Drawaria Animator Suite: Script iniciado.");

    // --- LÓGICA DEL BOT Y DIBUJO ---
    function findBotSocket() {
        if (window.___BOT && window.___BOT.conn && window.___BOT.conn.socket?.readyState === WebSocket.OPEN) {
            botSocket = window.___BOT.conn.socket;
            return true;
        }
        botSocket = null;
        return false;
    }

    function sendDrawCmd(start, end, color, thickness) {
        if (!findBotSocket()) {
            isAnimating = false;
            return false;
        }
        const p1x = Math.max(0, Math.min(1, start[0])), p1y = Math.max(0, Math.min(1, start[1]));
        const p2x = Math.max(0, Math.min(1, end[0])), p2y = Math.max(0, Math.min(1, end[1]));
        const payload = `42["drawcmd",0,[${p1x},${p1y},${p2x},${p2y},false,${0 - thickness},"${color}",0,0,{}]]`;
        botSocket.send(payload);
        return true;
    }

    async function clearCanvasViaBot() {
        if (findBotSocket()) {
            botSocket.send('42["drawcmd",4,[]]');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    function captureDrawing() {
        if (!originalCanvas) { alert("Error: Canvas no encontrado."); return; }
        const ctx = originalCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, cw, ch);
        const data = imageData.data;
        drawingPixels = [];
        const sampleRate = 4;

        for (let y = 0; y < ch; y += sampleRate) {
            for (let x = 0; x < cw; x += sampleRate) {
                const i = (y * cw + x) * 4;
                if (data[i+3] > 100 && (data[i] < 250 || data[i+1] < 250 || data[i+2] < 250)) {
                    drawingPixels.push({ x: x / cw, y: y / ch, color: `rgb(${data[i]},${data[i+1]},${data[i+2]})` });
                }
            }
        }
        alert(`¡Dibujo capturado! ${drawingPixels.length} puntos de animación listos.`);
        updateUIState('idle');
    }

    // --- BIBLIOTECA DE ANIMACIONES ---
    async function runSelectedAnimation() {
        if (drawingPixels.length === 0) {
            alert("Primero, captura un dibujo.");
            return;
        }
        if (!findBotSocket()) {
            alert("El bot no está conectado. Invoca tu bot primero.");
            return;
        }
        if (isAnimating) return;

        const selectedEffect = document.getElementById('animation-select').value;
        const effectFunction = animations[selectedEffect];

        if (effectFunction) {
            isAnimating = true;
            updateUIState('animating');
            await clearCanvasViaBot();

            await effectFunction(); // Ejecuta la animación seleccionada

            isAnimating = false;
            updateUIState('idle');
            console.log(`Animator: Animación "${selectedEffect}" completada.`);
        }
    }

    const animations = {
        celestialBallet: async () => {
            const dancers = drawingPixels.map(p => ({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 0.015, vy: (Math.random() - 0.5) * 0.015, color: p.color, lastX: p.x, lastY: p.y }));
            for (let step = 0; step < 180 && isAnimating; step++) {
                for (const d of dancers) {
                    d.lastX = d.x; d.lastY = d.y;
                    d.vx += (0.5 - d.x) * 0.0001; d.vy += (0.5 - d.y) * 0.0001;
                    d.vx *= 0.98; d.vy *= 0.98;
                    d.x += d.vx; d.y += d.vy;
                    if (d.x < 0.01 || d.x > 0.99) d.vx *= -1;
                    if (d.y < 0.01 || d.y > 0.99) d.vy *= -1;
                    if (!sendDrawCmd([d.lastX, d.lastY], [d.x, d.y], d.color, 3)) return;
                }
                await new Promise(resolve => setTimeout(resolve, 30));
            }
        },
        fireworks: async () => {
            const particleCount = 30; // Chispas por cada píxel
            for (const pixel of drawingPixels) {
                if (!isAnimating) break;
                const explosionCenterX = pixel.x;
                const explosionCenterY = pixel.y;
                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const distance = Math.random() * 0.1 + 0.02; // Longitud de la chispa
                    const endX = explosionCenterX + distance * Math.cos(angle);
                    const endY = explosionCenterY + distance * Math.sin(angle);
                    sendDrawCmd([explosionCenterX, explosionCenterY], [endX, endY], pixel.color, 2);
                }
                 await new Promise(resolve => setTimeout(resolve, 5)); // Pausa entre explosiones
            }
        },
        hueBlast: async () => {
            const steps = 100;
            for (let i = 0; i < steps && isAnimating; i++) {
                 const progress = i / steps;
                 // Seleccionar un píxel aleatorio de nuestro dibujo para usar su color
                 const basePixel = drawingPixels[Math.floor(Math.random() * drawingPixels.length)];
                 const [r,g,b] = basePixel.color.match(/\d+/g).map(Number);
                 const hue = rgbToHsl(r,g,b)[0] * 360;
                 const newHue = (hue + progress * 180) % 360;
                 const color = `hsl(${newHue}, 100%, 60%)`;

                 // Dibujar una ráfaga desde el centro
                 const angle = Math.random() * 2 * Math.PI;
                 const startX = 0.5;
                 const startY = 0.5;
                 const endX = startX + progress * 0.6 * Math.cos(angle);
                 const endY = startY + progress * 0.6 * Math.sin(angle);

                 if (!sendDrawCmd([startX, startY], [endX, endY], color, 10 + i * 0.1)) return;
                 await new Promise(resolve => setTimeout(resolve, 20));
            }
        },
        colorFestival: async () => {
            const numShapes = 80;
            for (let i = 0; i < numShapes && isAnimating; i++) {
                 const pixel = drawingPixels[Math.floor(Math.random() * drawingPixels.length)];
                 const x = Math.random() * 0.9 + 0.05;
                 const y = Math.random() * 0.9 + 0.05;
                 const size = Math.random() * 0.06 + 0.02;
                 const thickness = Math.floor(Math.random() * 8) + 3;

                 // Dibujar una forma aleatoria
                 const shapeType = Math.floor(Math.random() * 3);
                 if (shapeType === 0) { // Cuadrado
                     sendDrawCmd([x-size, y-size], [x+size, y-size], pixel.color, thickness);
                     sendDrawCmd([x+size, y-size], [x+size, y+size], pixel.color, thickness);
                     sendDrawCmd([x+size, y+size], [x-size, y+size], pixel.color, thickness);
                     sendDrawCmd([x-size, y+size], [x-size, y-size], pixel.color, thickness);
                 } else if (shapeType === 1) { // Estrella
                     for (let k = 0; k < 5; k++) {
                         const angle = (k / 5) * 2 * Math.PI;
                         sendDrawCmd([x, y], [x + size * Math.cos(angle), y + size * Math.sin(angle)], pixel.color, thickness);
                     }
                 } else { // Espiral
                     let lastX = x, lastY = y;
                     for (let k = 0; k <= 20; k++) {
                         const angle = (k / 20) * 4 * Math.PI;
                         const radius = (k / 20) * size;
                         const currentX = x + radius * Math.cos(angle);
                         const currentY = y + radius * Math.sin(angle);
                         sendDrawCmd([lastX, lastY], [currentX, currentY], pixel.color, thickness);
                         lastX = currentX; lastY = currentY;
                     }
                 }
                 await new Promise(resolve => setTimeout(resolve, 50));
            }
        },
        pixelArt: async () => {
            await clearCanvasViaBot();
            const pixelSize = 0.01; // Tamaño de cada "píxel" en el lienzo
            const quadrant = { xMin: 0.1, yMin: 0.1, xMax: 0.9, yMax: 0.9 }; // Dibujar en el centro
            const totalSpriteW = (cw / 4) * pixelSize; // Ajustar al tamaño del canvas
            const totalSpriteH = (ch / 4) * pixelSize;
            const startX = quadrant.xMin + (quadrant.xMax - quadrant.xMin - totalSpriteW) / 2;
            const startY = quadrant.yMin + (quadrant.yMax - quadrant.yMin - totalSpriteH) / 2;

            for(const pixel of drawingPixels) {
                if(!isAnimating) break;
                // Mapear la posición original del píxel a la nueva ubicación pixelada
                const drawX = startX + (pixel.x * totalSpriteW);
                const drawY = startY + (pixel.y * totalSpriteH);
                const thickness = pixelSize * Math.min(cw, ch) * 0.9;
                if (!sendDrawCmd([drawX, drawY], [drawX + 0.0001, drawY + 0.0001], pixel.color, thickness)) break;
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }
    };

    // --- HELPERS ---
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    // --- UI ---
    function createAnimationPanel() {
        const panel = document.createElement('div');
        panel.id = 'animator-panel';
        panel.innerHTML = `
            <div id="animator-header">
                <h3>Animador Generativo</h3>
                <button id="toggle-panel-btn" class="btn btn-outline-secondary">Ocultar</button>
            </div>
            <div id="bot-status" class="status-disconnected">Esperando al Bot...</div>
            <hr>
            <div class="animator-row">
                <button id="capture-btn" class="btn btn-outline-secondary" title="Analiza tu dibujo actual">1. Capturar Dibujo</button>
            </div>
            <div class="animator-row">
                <select id="animation-select" class="form-control" title="Elige un efecto de animación">
                    <option value="celestialBallet">Ballet Celestial</option>
                    <option value="fireworks">Fuegos Artificiales</option>
                    <option value="hueBlast">Ráfaga de Tono</option>
                    <option value="colorFestival">Festival de Color</option>
                    <option value="pixelArt">Pixelizar Dibujo</option>
                </select>
                <button id="animate-btn" class="btn btn-primary" title="Inicia la animación con el bot" disabled>2. Animar</button>
            </div>
            <div class="animator-row" style="margin-top: 5px;">
                <button id="stop-animation-btn" class="btn btn-danger" title="Detiene la animación en curso" disabled style="width:100%">Detener Animación</button>
            </div>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            #animator-panel { position: fixed; bottom: 15px; right: 15px; z-index: 9999;
                background: rgba(245, 245, 245, 0.95); padding: 15px; border: 1px solid #ccc;
                border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                backdrop-filter: blur(5px); font-family: sans-serif; width: 280px; }
            #animator-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            #animator-header h3 { margin: 0; text-align: left; font-size: 16px; color: #333; }
            #toggle-panel-btn { cursor: pointer; }
            #bot-status { text-align: center; font-weight: bold; padding: 5px; border-radius: 4px; margin-bottom: 10px; transition: background-color 0.3s; }
            .status-connected { background-color: #28a745; color: white; }
            .status-disconnected { background-color: #ffc107; color: black; }
            .animator-row { display: flex; gap: 8px; justify-content: center; margin-bottom: 8px; }
            #animator-panel button, #animator-panel select { flex-grow: 1; cursor: pointer; }
            #animator-panel button:disabled { cursor: not-allowed; opacity: 0.6; }
            hr { border: none; border-top: 1px solid #ddd; margin: 15px 0; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        // Hacer el panel arrastrable
        const header = document.getElementById('animator-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Obtener la posición inicial del cursor
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Mover el elemento al mover el cursor
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calcular la nueva posición del cursor
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Establecer la nueva posición del elemento
            const panel = document.getElementById('animator-panel');
            panel.style.top = (panel.offsetTop - pos2) + "px";
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Detener el movimiento al soltar el botón del mouse
            document.onmouseup = null;
            document.onmousemove = null;
        }

        document.getElementById('capture-btn').addEventListener('click', captureDrawing);
        document.getElementById('animate-btn').addEventListener('click', runSelectedAnimation);
        document.getElementById('stop-animation-btn').addEventListener('click', () => isAnimating = false);
        document.getElementById('toggle-panel-btn').addEventListener('click', togglePanelVisibility);
    }

    function togglePanelVisibility() {
        const panel = document.getElementById('animator-panel');
        const toggleBtn = document.getElementById('toggle-panel-btn');
        if (isPanelVisible) {
            panel.style.display = 'none';
            toggleBtn.textContent = 'Mostrar';
        } else {
            panel.style.display = 'block';
            toggleBtn.textContent = 'Ocultar';
        }
        isPanelVisible = !isPanelVisible;
    }

    function updateUIState(state) {
        const captureBtn = document.getElementById('capture-btn');
        const animateBtn = document.getElementById('animate-btn');
        const stopBtn = document.getElementById('stop-animation-btn');
        const select = document.getElementById('animation-select');

        if (!captureBtn || !animateBtn || !stopBtn) return;
        const botIsConnected = findBotSocket();

        const isBusy = state === 'animating';
        captureBtn.disabled = isBusy;
        select.disabled = isBusy;
        animateBtn.disabled = isBusy || drawingPixels.length === 0 || !botIsConnected;
        stopBtn.disabled = !isBusy;
    }

    function updateBotStatusUI(isConnected) {
        const statusDiv = document.getElementById('bot-status');
        if (!statusDiv) return;
        statusDiv.textContent = isConnected ? "Bot Detectado" : "Bot no encontrado";
        statusDiv.className = isConnected ? "status-connected" : "status-disconnected";
        updateUIState(isAnimating ? 'animating' : 'idle');
    }

    // --- INICIALIZACIÓN ---
    function initialize() {
        setInterval(() => {
            const gameCanvas = document.getElementById('canvas');
            const panelExists = document.getElementById('animator-panel');
            if (gameCanvas && gameCanvas.offsetParent && !panelExists) {
                originalCanvas = gameCanvas;
                cw = originalCanvas.width;
                ch = originalCanvas.height;
                createAnimationPanel();
            }
            if (panelExists) {
                updateBotStatusUI(findBotSocket());
            }
        }, 1000);
    }

    window.addEventListener('load', initialize);

})();
