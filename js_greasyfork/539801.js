// ==UserScript==
// @name         Drawaria Brusher Engine Pro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Implementa un motor de pinceles profesional y una nueva UI, con una arquitectura clara para la integración de red, panel arrastrable y múltiples tipos de pinceles.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/539801/Drawaria%20Brusher%20Engine%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/539801/Drawaria%20Brusher%20Engine%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // MÓDULO 1: UIManager - GESTOR DE LA INTERFAZ DE USUARIO
    // Responsable de crear y manejar el panel de herramientas.
    // =========================================================================
    const UIManager = {
        panel: null,
        brushState: null,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,

        initialize(initialState) {
            this.brushState = initialState;
            this.createPanel();
            this.attachEventListeners();
        },

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.id = 'pro-brush-panel';
            this.panel.innerHTML = `
                <h4 id="proBrushPanelHeader" title="Arrastra para mover el panel">Motor de Pincel PRO</h4>
                <div class="control-group">
                    <label>Color: <input type="color" id="proBrushColor" value="${this.brushState.color}" title="Selecciona el color del pincel"></label>
                </div>
                <div class="control-group">
                    <label>Tamaño: <span id="proBrushSizeValue">${this.brushState.size}</span></label>
                    <input type="range" id="proBrushSize" min="1" max="150" value="${this.brushState.size}" title="Ajusta el tamaño del pincel">
                </div>
                <div class="control-group">
                    <label>Opacidad: <span id="proBrushOpacityValue">${this.brushState.opacity}</span></label>
                    <input type="range" id="proBrushOpacity" min="0.01" max="1.0" step="0.01" value="${this.brushState.opacity}" title="Ajusta la opacidad del pincel">
                </div>
                <div class="control-group">
                    <label>Tipo de Pincel:</label>
                    <select id="proBrushType" title="Selecciona el tipo de pincel">
                        <option value="pencil">Lápiz (Básico)</option>
                        <option value="dynamic" selected>Dinámico (Velocidad)</option>
                        <option value="calligraphy">Caligrafía</option>
                        <option value="airbrush">Aerógrafo</option>
                        <option value="marker">Rotulador</option>
                        <option value="chalk">Tiza</option>
                        <option value="watercolor">Acuarela (Simple)</option>
                        <option value="pixel">Pixel</option>
                        <option value="dot">Puntos</option>
                        <option value="line">Línea Sólida</option>
                        <option value="dashed">Línea Discontinua</option>
                        <option value="fur">Pelo/Pasto (Simulado)</option>
                        <option value="scatter">Dispersión (Simple)</option>
                        <option value="smoother">Suavizador (Simple)</option>
                        <option value="star">Estrella (Estampado)</option>
                        <option value="heart">Corazón (Estampado)</option>
                        <option value="square">Cuadrado (Estampado)</option>
                        <option value="circle">Círculo (Estampado)</option>
                        <option value="eraser">Borrador</option>
                        <option value="fill">Relleno (Experimental)</option>
                        <option value="blur">Desenfoque (Experimental)</option>
                        <option value="sharpen">Enfocar (Experimental)</option>
                        <option value="lighten">Aclarar (Experimental)</option>
                        <option value="darken">Oscurecer (Experimental)</option>
                        <!-- Total: 24 tipos de pincel (incluyendo los 3 originales) -->
                    </select>
                </div>
                <div class="info-warning">Modo Un Jugador: Solo tú ves estos trazos. Para Multijugador, analiza la red (F12 > Network > WS).</div>
            `;
            document.body.appendChild(this.panel);
            this.injectCSS();
        },

        injectCSS() {
            const style = document.createElement('style');
            style.innerHTML = `
                #pro-brush-panel {
                    position: fixed; top: 15px; right: 160px; background: #fff;
                    border: 1px solid #ccc; padding: 15px; border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.25); z-index: 10001;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 280px;
                    cursor: default; /* Default cursor for content */
                }
                #proBrushPanelHeader {
                    margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #ddd;
                    cursor: grab; /* Cursor for dragging */
                    user-select: none; /* Prevent text selection during drag */
                    -webkit-user-select: none; /* Safari */
                    -moz-user-select: none; /* Firefox */
                    -ms-user-select: none; /* IE/Edge */
                }
                #proBrushPanelHeader:active {
                    cursor: grabbing;
                }
                .control-group { margin-bottom: 12px; }
                .control-group label { display: flex; justify-content: space-between; align-items: center; }
                .control-group input[type=range] { flex-grow: 1; margin-left: 10px; }
                .info-warning { font-size: 0.8em; color: #888; margin-top: 15px; text-align: center; }
                input[type="color"] { border: none; padding: 0; width: 40px; height: 25px; cursor: pointer; }
                select { width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
            `;
            document.head.appendChild(style);
        },

        attachEventListeners() {
            const header = document.getElementById('proBrushPanelHeader');

            // Draggable functionality
            header.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragOffsetX = e.clientX - this.panel.getBoundingClientRect().left;
                this.dragOffsetY = e.clientY - this.panel.getBoundingClientRect().top;
                this.panel.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                this.panel.style.left = `${e.clientX - this.dragOffsetX}px`;
                this.panel.style.top = `${e.clientY - this.dragOffsetY}px`;
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
                this.panel.style.cursor = 'default';
            });

            // UI Control Event Listeners
            document.getElementById('proBrushColor').addEventListener('input', (e) => this.brushState.color = e.target.value);
            document.getElementById('proBrushSize').addEventListener('input', (e) => {
                this.brushState.size = parseFloat(e.target.value);
                document.getElementById('proBrushSizeValue').textContent = this.brushState.size.toFixed(0);
            });
            document.getElementById('proBrushOpacity').addEventListener('input', (e) => {
                this.brushState.opacity = parseFloat(e.target.value);
                document.getElementById('proBrushOpacityValue').textContent = this.brushState.opacity.toFixed(2);
            });
            document.getElementById('proBrushType').addEventListener('change', (e) => {
                this.brushState.brushType = e.target.value;
                // Reset some properties if changing brush type, e.g., for eraser
                if (e.target.value === 'eraser') {
                    document.getElementById('proBrushColor').value = '#000000'; // Color doesn't matter for eraser visually
                    document.getElementById('proBrushOpacity').value = 1.0;
                    this.brushState.color = '#000000'; // Update internal state too
                    this.brushState.opacity = 1.0;
                    document.getElementById('proBrushOpacityValue').textContent = '1.00';
                }
            });
        }
    };

    // =========================================================================
    // MÓDULO 2: NetworkHandler - GESTOR DE COMUNICACIÓN
    // Responsable de enviar los datos de dibujo al servidor.
    // ESTA ES LA PARTE QUE REQUIERE ANÁLISIS MANUAL.
    // =========================================================================
    const NetworkHandler = {
        // En un escenario real, aquí se usaría el objeto `socket` del juego.
        // Ejemplo: `const socket = window.io;`

        sendDrawCommand(commandData) {
            // TODO: ¡Esta es la parte más crítica y compleja!
            // Para que funcione en multijugador, necesitas descifrar y replicar
            // los mensajes que envía el juego.

            // 1. Usa las "Herramientas de Desarrollador" de tu navegador (F12).
            // 2. Ve a la pestaña "Red" (Network) y filtra por "WS" (WebSockets).
            // 3. Dibuja un trazo en el juego y observa los mensajes enviados.
            // 4. Analiza la estructura de esos datos. Probablemente sea un array o un objeto JSON.
            //    Ejemplo de formato posible: `socket.emit('drawcmd', [0, x1, y1, x2, y2, color, size, opacity]);`

            // Reemplaza el console.log con el `socket.emit` real cuando lo hayas descifrado.
            console.log("Comando de Red (Simulado):", commandData);

            // Si el juego usa un objeto 'socket' global (común con Socket.IO):
            // if (window.socket && typeof window.socket.emit === 'function') {
            //     // Un ejemplo común para dibujar una línea:
            //     // window.socket.emit('draw', {
            //     //     type: 0, // 0 for line, 1 for fill, etc. (depends on game)
            //     //     x1: commandData[1], y1: commandData[2],
            //     //     x2: commandData[3], y2: commandData[4],
            //     //     color: commandData[5],
            //     //     size: commandData[6],
            //     //     opacity: commandData[7]
            //     // });
            //     // O más simple si solo replica la entrada del ratón:
            //     // window.socket.emit('drawPoint', { x: commandData[3], y: commandData[4], color: commandData[5], size: commandData[6], opacity: commandData[7] });
            //     // ¡Es CRÍTICO que el formato coincida con lo que el juego espera!
            //     // Para los pinceles más complejos que dibujan múltiples elementos (ej. aerógrafo, tiza),
            //     // podría ser necesario enviar múltiples comandos de línea/punto simples,
            //     // o si el juego lo soporta, un comando con un 'brushType' personalizado.
            // }
        }
    };

    // =========================================================================
    // MÓDULO 3: BrushEngine - EL MOTOR DE PINCEL
    // Contiene toda la lógica sobre cómo se dibuja en el lienzo.
    // =========================================================================
    const BrushEngine = {
        ctx: null,
        canvas: null,
        brushState: {
            color: '#1a1a1a',
            size: 20,
            opacity: 1.0,
            brushType: 'dynamic', // Default
            isDrawing: false,
            lastX: 0, lastY: 0,
            lastTime: 0, lastWidth: 20
        },

        initialize(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { willReadFrequently: true }); // Enable for pixel manipulation
            UIManager.initialize(this.brushState); // Conectar UI al estado del motor
        },

        startDrawing(pos) {
            this.brushState.isDrawing = true;
            [this.brushState.lastX, this.brushState.lastY] = [pos.x, pos.y];
            this.brushState.lastTime = Date.now();
            this.brushState.lastWidth = this.brushState.size;

            // For some brush types, a single 'dot' or 'stamp' might be needed on start
            if (['dot', 'star', 'heart', 'square', 'circle'].includes(this.brushState.brushType)) {
                this.drawSinglePoint(pos);
            }
        },

        stopDrawing() {
            this.brushState.isDrawing = false;
        },

        getDistance(p1, p2) {
            return Math.hypot(p2.x - p1.x, p2.y - p1.y);
        },

        // Function to draw a single point or stamp for certain brush types
        drawSinglePoint(pos) {
            const ctx = this.ctx;
            const state = this.brushState;

            ctx.save(); // Save current state
            ctx.strokeStyle = state.color;
            ctx.fillStyle = state.color;
            ctx.globalAlpha = state.opacity;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = state.size;
            ctx.filter = 'none'; // Ensure no lingering filters

            switch(state.brushType) {
                case 'dot':
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, state.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case 'star':
                    this.drawStar(ctx, pos.x, pos.y, 5, state.size / 2, state.size / 4);
                    ctx.fill();
                    break;
                case 'heart':
                    this.drawHeart(ctx, pos.x, pos.y, state.size / 2);
                    ctx.fill();
                    break;
                case 'square':
                    ctx.fillRect(pos.x - state.size / 2, pos.y - state.size / 2, state.size, state.size);
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, state.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                default:
                    // For other brushes, a single point draw isn't typical, but this is a fallback
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, state.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                    break;
            }
            ctx.restore(); // Restore to previous state
            NetworkHandler.sendDrawCommand([
                0, // Hypothetical command for "point" or "shape"
                pos.x, pos.y, pos.x, pos.y, // start/end same for point
                state.color, state.size, state.opacity, state.brushType // Include brush type for potential network replication
            ]);
        },

        // Helper function for drawing a star
        drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            let step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
        },

        // Helper function for drawing a heart
        drawHeart(ctx, x, y, size) {
            ctx.beginPath();
            ctx.moveTo(x, y + size / 4);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x + size, y, x, y + size);
            ctx.bezierCurveTo(x - size, y, x - size / 2, y - size / 2, x, y + size / 4);
            ctx.closePath();
        },


        draw(pos) {
            if (!this.brushState.isDrawing) return;

            const ctx = this.ctx;
            const state = this.brushState;
            const currentTime = Date.now();
            const timeDiff = currentTime - state.lastTime;
            const distance = this.getDistance({x: state.lastX, y: state.lastY}, pos);
            const speed = distance / (timeDiff || 1); // Avoid division by zero

            let currentWidth = state.size;
            let currentAlpha = state.opacity;
            let currentLineCap = 'round';
            let currentLineJoin = 'round';
            let globalComposite = 'source-over'; // Default blending mode

            ctx.save(); // Save the current canvas state before applying transformations/styles
            ctx.filter = 'none'; // Reset any previous filter

            switch(state.brushType) {
                case 'dynamic':
                    const dynamicWidth = Math.max(state.size / (speed * 0.5 + 1), state.size * 0.1);
                    currentWidth = (state.lastWidth * 0.7) + (dynamicWidth * 0.3); // Smoothed
                    break;
                case 'calligraphy':
                    currentWidth = Math.max(state.size - (distance * 0.5), state.size * 0.2);
                    currentLineCap = 'butt';
                    currentLineJoin = 'miter';
                    break;
                case 'pencil':
                    currentWidth = state.size;
                    currentAlpha = state.opacity * 0.8; // Slightly less opaque
                    break;
                case 'airbrush':
                    // Simulate airbrush by drawing multiple semi-transparent dots or small lines
                    ctx.globalAlpha = state.opacity * 0.1; // Very low opacity for each sub-stroke
                    ctx.fillStyle = state.color;
                    for (let i = 0; i < 5; i++) {
                        const offsetX = (Math.random() - 0.5) * state.size * 2;
                        const offsetY = (Math.random() - 0.5) * state.size * 2;
                        ctx.beginPath();
                        ctx.arc(pos.x + offsetX, pos.y + offsetY, state.size / 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore(); // Restore before the main stroke path to not interfere
                    // No main line drawn for airbrush, it's all dots
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return; // Skip the main stroke drawing below

                case 'marker':
                    currentWidth = state.size;
                    currentAlpha = state.opacity * 0.9; // Slightly less transparent than full opacity
                    currentLineCap = 'square';
                    currentLineJoin = 'miter';
                    break;
                case 'chalk':
                    // Simulate rough texture by drawing multiple slightly offset lines
                    ctx.globalAlpha = state.opacity * 0.4;
                    ctx.strokeStyle = state.color;
                    for (let i = 0; i < 3; i++) {
                        const offsetX = (Math.random() - 0.5) * state.size * 0.2;
                        const offsetY = (Math.random() - 0.5) * state.size * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(state.lastX + offsetX, state.lastY + offsetY);
                        ctx.lineTo(pos.x + offsetX, pos.y + offsetY);
                        ctx.lineWidth = state.size * (0.8 + Math.random() * 0.4);
                        ctx.stroke();
                        ctx.closePath();
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'watercolor':
                    // Simulate transparency and blending. Very basic approximation.
                    ctx.globalAlpha = state.opacity * 0.3; // Low opacity
                    ctx.strokeStyle = state.color;
                    ctx.lineWidth = state.size;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    for (let i = 0; i < 3; i++) {
                        // Draw slightly offset and blurred lines
                        ctx.filter = `blur(${state.size / 10}px)`; // Apply blur
                        ctx.beginPath();
                        ctx.moveTo(state.lastX + (Math.random() - 0.5) * state.size / 5, state.lastY + (Math.random() - 0.5) * state.size / 5);
                        ctx.lineTo(pos.x + (Math.random() - 0.5) * state.size / 5, pos.y + (Math.random() - 0.5) * state.size / 5);
                        ctx.stroke();
                        ctx.closePath();
                    }
                    ctx.filter = 'none'; // Reset filter
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return; // Skip main stroke

                case 'pixel':
                    currentWidth = Math.max(1, Math.round(state.size / 5)) * 5; // Snap to a grid-like size
                    currentAlpha = state.opacity;
                    currentLineCap = 'butt';
                    currentLineJoin = 'miter';
                    ctx.fillStyle = state.color; // Use fill for pixel squares
                    // This creates a continuous pixel line
                    const dx = pos.x - state.lastX;
                    const dy = pos.y - state.lastY;
                    const steps = Math.max(Math.abs(dx), Math.abs(dy)) / currentWidth; // Number of "pixels"
                    for (let i = 0; i <= steps; i++) {
                        const px = state.lastX + (dx * i / steps);
                        const py = state.lastY + (dy * i / steps);
                        ctx.fillRect(Math.round(px / currentWidth) * currentWidth, Math.round(py / currentWidth) * currentWidth, currentWidth, currentWidth);
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'dot':
                    // Draw dots along the path
                    const stepDistance = state.size * 0.75; // Distance between dots
                    const numDots = Math.floor(distance / stepDistance);
                    for (let i = 0; i <= numDots; i++) {
                        const ratio = i / numDots;
                        const interpolatedX = state.lastX + (pos.x - state.lastX) * ratio;
                        const interpolatedY = state.lastY + (pos.y - state.lastY) * ratio;
                        ctx.beginPath();
                        ctx.arc(interpolatedX, interpolatedY, state.size / 2, 0, Math.PI * 2);
                        ctx.fillStyle = state.color;
                        ctx.globalAlpha = state.opacity;
                        ctx.fill();
                        ctx.closePath();
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'line': // Simple solid line
                    currentWidth = state.size;
                    break;
                case 'dashed':
                    currentWidth = state.size;
                    ctx.setLineDash([state.size / 2, state.size / 2]); // Dashes and gaps are half size
                    break;
                case 'fur':
                    // Simulate fur by drawing many short, slightly randomized strokes
                    ctx.globalAlpha = state.opacity * 0.5;
                    const angle = Math.atan2(pos.y - state.lastY, pos.x - state.lastX);
                    ctx.strokeStyle = state.color;
                    ctx.lineWidth = Math.max(1, state.size / 5);
                    for (let i = 0; i < 10; i++) {
                        const offsetAngle = angle + (Math.random() - 0.5) * Math.PI / 4; // Vary angle
                        const length = state.size * (0.5 + Math.random() * 0.5); // Vary length
                        const startX = pos.x + Math.cos(offsetAngle + Math.PI / 2) * (Math.random() - 0.5) * state.size * 0.5;
                        const startY = pos.y + Math.sin(offsetAngle + Math.PI / 2) * (Math.random() - 0.5) * state.size * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(startX + Math.cos(offsetAngle) * length, startY + Math.sin(offsetAngle) * length);
                        ctx.stroke();
                        ctx.closePath();
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'scatter':
                    // Draw random dots around the line path
                    const numScatters = Math.floor(distance / (state.size / 2));
                    ctx.fillStyle = state.color;
                    for (let i = 0; i < numScatters; i++) {
                        const ratio = i / numScatters;
                        const interpolatedX = state.lastX + (pos.x - state.lastX) * ratio;
                        const interpolatedY = state.lastY + (pos.y - state.lastY) * ratio;
                        const scatterX = interpolatedX + (Math.random() - 0.5) * state.size * 2;
                        const scatterY = interpolatedY + (Math.random() - 0.5) * state.size * 2;
                        ctx.beginPath();
                        ctx.arc(scatterX, scatterY, state.size * (0.1 + Math.random() * 0.3), 0, Math.PI * 2);
                        ctx.globalAlpha = state.opacity * (0.2 + Math.random() * 0.8);
                        ctx.fill();
                        ctx.closePath();
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'smoother':
                    // A simple approximation using blur. Real smoothing is complex.
                    currentWidth = state.size * 1.5;
                    currentAlpha = state.opacity * 0.1; // Very low alpha to subtly blend
                    ctx.globalCompositeOperation = 'source-over'; // Ensures it blends
                    ctx.filter = `blur(${state.size / 5}px)`; // Apply blur
                    ctx.strokeStyle = state.color; // Color doesn't matter much here
                    break;

                case 'star':
                case 'heart':
                case 'square':
                case 'circle':
                    // These are stamping brushes, drawing on mousemove along the path
                    const stampDistance = state.size * 0.5; // Distance between stamps
                    const numStamps = Math.floor(distance / stampDistance);
                    for (let i = 0; i <= numStamps; i++) {
                        const ratio = i / numStamps;
                        const interpolatedX = state.lastX + (pos.x - state.lastX) * ratio;
                        const interpolatedY = state.lastY + (pos.y - state.lastY) * ratio;
                        this.drawSinglePoint({x: interpolatedX, y: interpolatedY}); // Reuse drawSinglePoint
                    }
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'eraser':
                    currentWidth = state.size;
                    currentAlpha = 1.0; // Eraser is typically full opacity
                    globalComposite = 'destination-out'; // Makes pixels transparent
                    break;

                // Experimental Image Manipulation Brushes (VERY CPU Intensive and limited)
                // These will modify existing pixels rather than drawing new ones.
                // Not suitable for networked play as they modify image data directly,
                // not vector commands.
                case 'fill':
                    // This isn't a "brush" in the stroke sense. For a fill tool, you'd usually
                    // click once and fill a contiguous area. As a "brush" it means painting solid color.
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, state.size / 2, 0, Math.PI * 2); // Draw a solid circle
                    ctx.fillStyle = state.color;
                    ctx.globalAlpha = state.opacity;
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                case 'blur':
                case 'sharpen':
                case 'lighten':
                case 'darken':
                    // These require direct ImageData manipulation which is extremely slow
                    // for continuous drawing and cannot be sent over network as vector data.
                    // They are generally tools applied on an area, not real-time brushes.
                    // For demonstration, we're applying a filter *globally* to the canvas
                    // but triggering it by drawing, making it seem localized.
                    // This is NOT a true localized pixel manipulation brush.
                    ctx.filter = ''; // Reset filter first

                    if (state.brushType === 'blur') ctx.filter = `blur(${state.size / 10}px)`;
                    else if (state.brushType === 'sharpen') ctx.filter = `contrast(1.1) brightness(1.05)`; // Simple sharpen approx
                    else if (state.brushType === 'lighten') ctx.filter = `brightness(1.1) saturate(1.05)`;
                    else if (state.brushType === 'darken') ctx.filter = `brightness(0.9) saturate(1.05)`;

                    // Draw a transparent line. The purpose is to trigger the filter on the context.
                    // The filter applies to everything drawn *after* it's set until it's reset.
                    // This is a hack, not a true pixel-level brush.
                    ctx.beginPath();
                    ctx.moveTo(state.lastX, state.lastY);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = state.color; // Color doesn't technically matter for filter effect
                    ctx.lineWidth = state.size;
                    ctx.globalAlpha = 0.01; // Very low alpha so it's practically invisible, but triggers the filter context
                    ctx.stroke();
                    ctx.closePath();

                    ctx.filter = 'none'; // Reset filter immediately
                    ctx.restore();
                    [state.lastX, state.lastY] = [pos.x, pos.y];
                    state.lastTime = currentTime;
                    return;

                default: // Default to pencil if unknown, or basic line for others
                    currentWidth = state.size;
                    break;
            }

            // Apply calculated styles
            ctx.strokeStyle = state.color;
            ctx.lineWidth = currentWidth;
            ctx.globalAlpha = currentAlpha;
            ctx.lineCap = currentLineCap;
            ctx.lineJoin = currentLineJoin;
            ctx.globalCompositeOperation = globalComposite;
            ctx.setLineDash([]); // Ensure no dashes from previous strokes

            ctx.beginPath();
            ctx.moveTo(state.lastX, state.lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.closePath();

            ctx.restore(); // Restore the canvas state (important for filters, composite operations etc.)

            // Here, send the command through the network handler.
            // It's crucial to send parameters that the game's server expects.
            // For complex brushes, you might need to send multiple simpler commands
            // or a custom command type if the game supports it.
            NetworkHandler.sendDrawCommand([
                0, // Hypothetical command for "line"
                state.lastX, state.lastY,
                pos.x, pos.y,
                state.color, currentWidth, currentAlpha, state.brushType // Include brush type and final calculated properties
            ]);

            // Update last positions for next segment
            [state.lastX, state.lastY] = [pos.x, pos.y];
            state.lastTime = currentTime;
            state.lastWidth = currentWidth; // Store current width for smoothing
        }
    };

    // =========================================================================
    // MÓDULO 4: CanvasHijacker - INTERCEPTOR DEL LIENZO
    // Toma el control de los eventos del lienzo original del juego.
    // =========================================================================
    const CanvasHijacker = {
        initialize(canvas) {
            // Esta función reemplaza todos los listeners de eventos del ratón
            // clonando el nodo, para desactivar la lógica original del juego.
            // Nota: Clonar el nodo puede resetear algunas propiedades del canvas
            // que el juego pudo haber configurado. Si hay problemas, una alternativa
            // sería usar removeEventListener si se conoce el listener, o añadir
            // nuestros listeners con useCapture = true y stopPropagation().
            const newCanvas = canvas.cloneNode(true);
            canvas.parentNode.replaceChild(newCanvas, canvas);
            console.log("Control del lienzo tomado. La lógica de dibujo original ha sido desactivada.");

            // Asegurar que el nuevo canvas tenga el mismo tamaño
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;

            BrushEngine.initialize(newCanvas); // Iniciar nuestro motor en el nuevo lienzo

            function getMousePos(evt) {
                const rect = newCanvas.getBoundingClientRect();
                return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
            }

            // Mouse Events
            newCanvas.addEventListener('mousedown', (e) => {
                e.stopPropagation(); e.preventDefault(); // Prevent game's default behavior
                BrushEngine.startDrawing(getMousePos(e));
            });
            newCanvas.addEventListener('mousemove', (e) => {
                e.stopPropagation(); e.preventDefault();
                BrushEngine.draw(getMousePos(e));
            });
            newCanvas.addEventListener('mouseup', () => BrushEngine.stopDrawing());
            newCanvas.addEventListener('mouseleave', () => BrushEngine.stopDrawing());

            // Touch Events for basic mobile compatibility
            newCanvas.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent scrolling/zooming on canvas
                const touch = e.touches[0];
                BrushEngine.startDrawing(getMousePos({ clientX: touch.clientX, clientY: touch.clientY }));
            }, { passive: false }); // Use passive: false to allow preventDefault

            newCanvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                BrushEngine.draw(getMousePos({ clientX: touch.clientX, clientY: touch.clientY }));
            }, { passive: false });

            newCanvas.addEventListener('touchend', () => BrushEngine.stopDrawing());
            newCanvas.addEventListener('touchcancel', () => BrushEngine.stopDrawing());
        }
    };

    // --- PUNTO DE ENTRADA DEL SCRIPT ---
    const
        // Se ejecuta repetidamente hasta que el lienzo del juego esté listo.
        initInterval = setInterval(() => {
            const gameCanvas = document.getElementById('canvas');
            if (gameCanvas && gameCanvas.getContext) {
                clearInterval(initInterval);
                console.log("Canvas de Drawaria detectado. Iniciando script de Motor de Pincel Profesional...");
                CanvasHijacker.initialize(gameCanvas);
            }
        }, 500);

})();