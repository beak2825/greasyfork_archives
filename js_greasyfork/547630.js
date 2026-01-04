// ==UserScript==
// @name         Drawaria Optimized Physics (v4.0 - ULTRA FLUID - No Trails)
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  Motor de física súper-optimizado para Drawaria.online con objetos interactivos (pelotas y cuadrados), colisiones y modo arcoíris. ¡Ahora sin rastros visibles en el servidor!
// @author       YouTubeDrawaria + GPT-4 (Optimized & Enhanced - Ultra Fluid - No Trails)
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547630/Drawaria%20Optimized%20Physics%20%28v40%20-%20ULTRA%20FLUID%20-%20No%20Trails%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547630/Drawaria%20Optimized%20Physics%20%28v40%20-%20ULTRA%20FLUID%20-%20No%20Trails%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ----------  SHARED SYSTEM COMPONENTS  ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Optimized command queue with intelligent batching
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8; // Aumentado ligeramente el tamaño del lote para mayor eficiencia
    const BATCH_INTERVAL = 60; // Reducido el intervalo para enviar actualizaciones más rápido, mejor para la fluidez

    // Position cache for physics objects (to avoid redrawing static objects)
    const positionCache = new Map();
    // Umbral de movimiento: solo redibujar si el objeto se ha movido significativamente.
    // Un valor más bajo (cercano a 0) asegura que cualquier movimiento se "borre",
    // pero aumenta los comandos. Para 'no rastros', se activa incluso con pequeño movimiento.
    const MOVEMENT_THRESHOLD = 3; // Manteniendo el umbral para evitar spam excesivo en movimientos diminutos.

    // Intercept WebSocket
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for physics engine.');
            startBatchProcessor();
        }
        return originalWebSocketSend.apply(this, args);
    };

    function startBatchProcessor() {
        if (batchProcessor) return;

        batchProcessor = setInterval(() => {
            if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN || commandQueue.length === 0) {
                return;
            }

            // Procesar comandos en pequeños lotes
            const batch = commandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try {
                    drawariaSocket.send(cmd);
                } catch (e) {
                    console.warn('Failed to send command:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /**
     * Función unificada para encolar comandos de dibujo.
     * La clave para la fluidez del lado del servidor es enviar la MENOR cantidad de comandos posibles.
     * Usamos una línea muy corta y un grosor negativo para dibujar formas rellenas con un solo comando.
     *
     * @param {number} x1 - Coordenada X inicial
     * @param {number} y1 - Coordenada Y inicial
     * @param {number} x2 - Coordenada X final (para crear una "punto" virtual para formas)
     * @param {number} y2 - Coordenada Y final (para crear una "punto" virtual para formas)
     * @param {string} color - Color del objeto (ej. '#FFFFFF')
     * @param {number} thickness - Grosor efectivo del objeto (negativo para relleno)
     */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        // ¡Esta es la optimización clave!
        // Un solo comando "drawcmd" con grosor negativo grande para dibujar una forma rellena.
        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);

        // Renderizado LOCAL para retroalimentación visual inmediata.
        if (drawariaCtx) {
            drawariaCtx.strokeStyle = color;
            drawariaCtx.lineWidth = thickness;
            drawariaCtx.lineCap = 'round';
            drawariaCtx.lineJoin = 'round';
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(x1, y1);
            drawariaCtx.lineTo(x2, y2);
            drawariaCtx.stroke();
        }
    }


    /* ----------  OPTIMIZED FOOTBALL PHYSICS ENGINE (ENHANCED)  ---------- */

    // Constants for physics (now including square properties)
    const PHYSICS_CONSTANTS = {
        GRAVITY: 500,
        BALL_MASS: 0.43,
        BALL_RADIUS: 40,
        SQUARE_MASS: 0.8, // Heavier than ball
        SQUARE_SIZE: 60, // Aumentado para mayor visibilidad y diferenciación
        TIMESTEP: 1/60, // Aumentada la frecuencia de actualización de física para mayor precisión
        MAX_VELOCITY: 800,
        AIR_RESISTANCE: 0.008,
        RESTITUTION_BALL: 0.75,
        RESTITUTION_SQUARE: 0.6, // Squares might bounce less
        RESTITUTION_WALL: 0.6,
        FRICTION_GRASS: 0.85
    };

    class OptimizedDrawariaPhysics {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map(); // Stores all active balls and squares
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30; // 30 FPS rendering para el servidor (menos comandos)

            this.controls = {
                kickPower: 400,
                kickAngle: 0,
                interactionPower: 500, // New slider for laser blast etc. (now unused for rainbow)
                showTrails: false, // Desactivado por defecto
                showDebug: false,
                enableNetworkSync: false,
                autoDetectFields: true,
                rainbowModeActive: false, // NEW: State for rainbow mode
            };
            this.rainbowHue = 0; // NEW: Current hue for rainbow effect
            this.rainbowInterval = null; // NEW: To store the interval ID for rainbow color updates

            this.init();
        }

        init() {
            if (this.initialized) return;

            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas; // Assign to global for unified drawing
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d'); // Assign to global for local rendering

                    this.initialized = true;
                    this.createOptimizedPanel();
                    console.log('✅ Optimized Drawaria Physics Engine initialized');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createOptimizedPanel() {
            const existingPanel = document.getElementById('football-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'football-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 350px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
                border: 2px solid #4fd1c7 !important;
                border-radius: 12px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 20px rgba(79,209,199,0.3) !important;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(45deg, #4fd1c7, #38b2ac) !important;
                padding: 12px 20px !important;
                font-weight: bold !important;
                text-align: center !important;
                font-size: 14px !important;
            `;
            header.innerHTML = '⚽ OPTIMIZED DRAWARIA PHYSICS v4.0';

            const content = document.createElement('div');
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="toggle-physics" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #4fd1c7, #38b2ac);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                    ">🚀 Launch Physics Engine</button>
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px;">
                        💪 Kick Power: <span id="kick-power-display">400</span>
                    </label>
                    <input type="range" id="kick-power-slider" min="100" max="800" value="400" style="width: 100%;">
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px;">
                        🧭 Kick Angle: <span id="kick-angle-display">0°</span>
                    </label>
                    <input type="range" id="kick-angle-slider" min="-90" max="90" value="0" style="width: 100%;">
                </div>

                <div style="margin-bottom: 15px;">
                    <button id="kick-all-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #ed8936, #dd6b20);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🦵 Kick All Objects</button>
                </div>

                 <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px;">
                        ⚙️ (Unused) Interaction Power: <span id="interaction-power-display">500</span>
                    </label>
                    <input type="range" id="interaction-power-slider" min="100" max="1000" value="500" style="width: 100%;">
                </div>

                <div style="margin-bottom: 15px;">
                    <button id="laser-blast-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #ff00ff, #800080);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🌈 Toggle Rainbow Mode</button>
                </div>

                <div style="margin-bottom: 15px;">
                    <button id="clear-all-btn" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #990000, #cc0000);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🗑️ Clear All Objects</button>
                </div>

                <div id="stats" style="
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    text-align: center;
                ">
                    <div>Objects: <span id="object-count">0</span></div>
                    <div>Commands in Queue: <span id="queue-count">0</span></div>
                    <div>Performance: <span id="performance">Optimal</span></div>
                </div>

                <div style="
                    text-align: center;
                    margin-top: 15px;
                    font-size: 10px;
                    color: rgba(255,255,255,0.6);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 10px;
                ">
                    Click canvas to create balls • Shift+Click for squares • B for random ball • S for random square • Space to kick all • R to reset all
                    <br><span style="color: #ffcc00;">Nota: El "no rastro" en el servidor requiere dibujar sobre las posiciones antiguas en blanco, lo que aumenta los comandos de red.</span>
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            this.setupEventListeners();
            this.startStatsMonitoring();
        }

        setupEventListeners() {
            const toggleBtn = document.getElementById('toggle-physics');
            const kickBtn = document.getElementById('kick-all-btn');
            const toggleRainbowBtn = document.getElementById('laser-blast-btn'); // Renamed for clarity
            const clearAllBtn = document.getElementById('clear-all-btn');
            const powerSlider = document.getElementById('kick-power-slider');
            const angleSlider = document.getElementById('kick-angle-slider');
            const interactionPowerSlider = document.getElementById('interaction-power-slider');

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.togglePhysics());
            }

            if (kickBtn) {
                kickBtn.addEventListener('click', () => this.executeKick());
            }

            if (toggleRainbowBtn) { // Changed listener
                toggleRainbowBtn.addEventListener('click', () => this.toggleRainbowMode());
            }

            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => this.clearAllObjects());
            }

            if (powerSlider) {
                powerSlider.addEventListener('input', (e) => {
                    this.controls.kickPower = parseInt(e.target.value);
                    const display = document.getElementById('kick-power-display');
                    if (display) display.textContent = this.controls.kickPower;
                });
            }

            if (angleSlider) {
                angleSlider.addEventListener('input', (e) => {
                    this.controls.kickAngle = parseInt(e.target.value);
                    const display = document.getElementById('kick-angle-display');
                    if (display) display.textContent = this.controls.kickAngle + '°';
                });
            }

            // This slider is now unused for rainbow mode, but keeping listener for consistency
            if (interactionPowerSlider) {
                interactionPowerSlider.addEventListener('input', (e) => {
                    this.controls.interactionPower = parseInt(e.target.value);
                    const display = document.getElementById('interaction-power-display');
                    if (display) display.textContent = this.controls.interactionPower;
                });
            }

            if (this.canvasElement) {
                this.canvasElement.addEventListener('click', (e) => this.handleCanvasClick(e));
            }

            document.addEventListener('keydown', (e) => this.handleKeyInput(e));
        }

        startStatsMonitoring() {
            setInterval(() => {
                const objectCount = document.getElementById('object-count');
                const queueCount = document.getElementById('queue-count');
                const performance = document.getElementById('performance');

                if (objectCount) objectCount.textContent = this.physicsObjects.size;
                if (queueCount) queueCount.textContent = commandQueue.length;
                if (performance) {
                    const queueSize = commandQueue.length;
                    // Adjusted thresholds for performance feedback due to increased commands
                    if (queueSize < 20) { // Higher threshold for optimal
                        performance.textContent = 'Optimal';
                        performance.style.color = '#48bb78';
                    } else if (queueSize < 100) { // Higher threshold for good
                        performance.textContent = 'Good';
                        performance.style.color = '#ed8936';
                    } else {
                        performance.textContent = 'Overloaded';
                        performance.style.color = '#f56565';
                    }
                }
            }, 1000);
        }

        togglePhysics() {
            const toggleBtn = document.getElementById('toggle-physics');

            if (!this.isActive) {
                this.startPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🛑 Stop Physics Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                }
            } else {
                this.stopPhysics();
                if (toggleBtn) {
                    toggleBtn.textContent = '🚀 Launch Physics Engine';
                    toggleBtn.style.background = 'linear-gradient(135deg, #4fd1c7, #38b2ac)';
                }
            }
        }

        startPhysics() {
            if (this.isActive) return;

            this.isActive = true;

            // Clear any existing objects before starting fresh
            this.clearAllObjects(false); // Clear without showing feedback

            // Create multiple initial objects (balls and squares)
            if (this.canvasElement) {
                const numObjects = 0; // Se recomienda que el usuario cree objetos manualmente para evitar spam inicial
                const centerX = this.canvasElement.width / 2;
                const centerY = this.canvasElement.height / 2;
                const spread = Math.min(this.canvasElement.width, this.canvasElement.height) * 0.2;

                for (let i = 0; i < numObjects; i++) {
                    const randX = centerX + (Math.random() - 0.5) * spread;
                    const randY = centerY + (Math.random() - 0.5) * spread;
                    if (Math.random() < 0.5) {
                        this.createBall(randX, randY);
                    } else {
                        this.createSquare(randX, randY);
                    }
                }
            }

            this.startGameLoop();
            console.log('🚀 Optimized Physics Engine started!');
        }

        stopPhysics() {
            this.isActive = false;
            this.clearAllObjects(false); // Clear objects when stopping
            if (this.controls.rainbowModeActive) { // Ensure rainbow mode is stopped
                this.toggleRainbowMode();
            }
            console.log('🛑 Physics Engine stopped');
        }

        clearAllObjects(showFeedback = true) {
            if (this.controls.rainbowModeActive) { // NEW: Deactivate rainbow mode when clearing objects
                this.toggleRainbowMode();
            }
            // Clear physics objects data
            this.physicsObjects.clear();
            positionCache.clear(); // Clear local position cache

            // For the server-side, we must "clear" all previously drawn objects by drawing over them in white.
            // This is complex for "clear all" as we don't know all past positions of all objects already drawn on server.
            // A more robust "clear all" for the server would require storing *all* historical positions, which is too heavy.
            // For practical purposes, "clear all" just stops redrawing them, and existing trails fade or are drawn over by new elements.
            // However, we can enforce a full local canvas clear.
            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
                // Optionally, if you want to force clear the server, you could draw a giant white rectangle
                // over the entire canvas here, but this is extremely spammy and often causes lag.
                // Example (DO NOT UNCOMMENT FOR REGULAR USE, USE WITH CAUTION):
                // enqueueDrawCommand(0, 0, drawariaCanvas.width, drawariaCanvas.height, '#FFFFFF', Math.max(drawariaCanvas.width, drawariaCanvas.height));
            }
            if (showFeedback) {
                this.showFeedback('🗑️ OBJECTS CLEARED!', '#cc0000');
            }
            console.log('🗑️ All physics objects cleared.');
        }

        createBall(x, y) {
            const id = `ball_${this.objectIdCounter++}`;
            const ball = {
                id: id,
                type: 'ball',
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                radius: PHYSICS_CONSTANTS.BALL_RADIUS,
                color: '#00000', // Default color
                mass: PHYSICS_CONSTANTS.BALL_MASS,
                restitution: PHYSICS_CONSTANTS.RESTITUTION_BALL,
                friction: PHYSICS_CONSTANTS.FRICTION_GRASS,
                lastRenderX: -9999, // Force initial render for both client and server
                lastRenderY: -9999
            };
            this.physicsObjects.set(id, ball);
            console.log(`⚽ Created ball: ${id} at (${x}, ${y})`);
            return ball;
        }

        createSquare(x, y) {
            const id = `square_${this.objectIdCounter++}`;
            const square = {
                id: id,
                type: 'square',
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                size: PHYSICS_CONSTANTS.SQUARE_SIZE, // Width and height
                color: '#ffcc00', // Default color
                mass: PHYSICS_CONSTANTS.SQUARE_MASS,
                restitution: PHYSICS_CONSTANTS.RESTITUTION_SQUARE,
                friction: PHYSICS_CONSTANTS.FRICTION_GRASS,
                lastRenderX: -9999, // Force initial render for both client and server
                lastRenderY: -9999
            };
            this.physicsObjects.set(id, square);
            console.log(`⬛ Created square: ${id} at (${x}, ${y})`);
            return square;
        }

        startGameLoop() {
            if (!this.isActive) return;

            const currentTime = performance.now();

            // Control rendering frequency for better performance
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updatePhysics();
                this.renderOptimized(); // This handles drawing for both client and server
                this.lastRenderTime = currentTime;
            }

            requestAnimationFrame(() => this.startGameLoop());
        }

        updatePhysics() {
            const dt = PHYSICS_CONSTANTS.TIMESTEP;

            // Step 1: Apply forces and update positions for each object
            this.physicsObjects.forEach(obj => {
                // Apply air resistance
                obj.vx *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * dt);
                obj.vy *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * dt);

                // Apply gravity
                obj.vy += PHYSICS_CONSTANTS.GRAVITY * dt;

                // Update position
                obj.x += obj.vx * dt;
                obj.y += obj.vy * dt;

                // Collisions with canvas boundaries
                if (this.canvasElement) {
                    let objHalfSize;
                    if (obj.type === 'ball') {
                        objHalfSize = obj.radius;
                    } else if (obj.type === 'square') {
                        objHalfSize = obj.size / 2;
                    } else {
                        return; // Unknown object type
                    }

                    const rightBoundary = this.canvasElement.width - objHalfSize;
                    const bottomBoundary = this.canvasElement.height - objHalfSize;

                    if (obj.x < objHalfSize) {
                        obj.x = objHalfSize;
                        obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                    } else if (obj.x > rightBoundary) {
                        obj.x = rightBoundary;
                        obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                    }

                    if (obj.y < objHalfSize) {
                        obj.y = objHalfSize;
                        obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                    } else if (obj.y > bottomBoundary) {
                        obj.y = bottomBoundary;
                        obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                        obj.vx *= obj.friction; // Apply friction on the ground
                    }
                }

                // Limit maximum velocity
                const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
                if (speed > PHYSICS_CONSTANTS.MAX_VELOCITY) {
                    obj.vx = (obj.vx / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                    obj.vy = (obj.vy / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                }
            });

            // Step 2: Handle object-to-object collisions
            const objectsArray = Array.from(this.physicsObjects.values());
            for (let i = 0; i < objectsArray.length; i++) {
                const objA = objectsArray[i];
                for (let j = i + 1; j < objectsArray.length; j++) {
                    const objB = objectsArray[j];

                    if (objA.type === 'ball' && objB.type === 'ball') {
                        this.handleBallBallCollision(objA, objB);
                    } else if (objA.type === 'ball' && objB.type === 'square') {
                        this.handleBallSquareCollision(objA, objB);
                    } else if (objA.type === 'square' && objB.type === 'ball') {
                        this.handleBallSquareCollision(objB, objA); // Ball always first argument
                    }
                    // Square-square collisions are more complex; not implemented in this basic version.
                }
            }
        }

        // Helper: Get closest point on a rectangle's boundary to a circle's center
        getClosestPointOnRectangle(circleX, circleY, rectX, rectY, rectWidth, rectHeight) {
            let testX = circleX;
            let testY = circleY;

            // Find the closest point in the rectangle to the center of the circle
            if (circleX < rectX) testX = rectX;
            else if (circleX > rectX + rectWidth) testX = rectX + rectWidth;

            if (circleY < rectY) testY = rectY;
            else if (circleY > rectY + rectHeight) testY = rectY + rectHeight;

            return { x: testX, y: testY };
        }

        handleBallBallCollision(ball1, ball2) {
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball1.radius + ball2.radius;

            if (distance < minDistance && distance !== 0) { // Avoid division by zero
                // Collision detected
                const normalX = dx / distance;
                const normalY = dy / distance;

                // Separation: Push them apart by half the overlap
                const overlap = minDistance - distance;
                ball1.x -= normalX * overlap * 0.5;
                ball1.y -= normalY * overlap * 0.5;
                ball2.x += normalX * overlap * 0.5;
                ball2.y += normalY * overlap * 0.5;

                // Relative velocity
                const rvX = ball2.vx - ball1.vx;
                const rvY = ball2.vy - ball1.vy;

                // Velocity along the normal
                const velAlongNormal = rvX * normalX + rvY * normalY;

                // Do not resolve if objects are already separating
                if (velAlongNormal > 0) return;

                // Restitution (average)
                const e = (ball1.restitution + ball2.restitution) * 0.5;

                // Impulse scalar
                let j = -(1 + e) * velAlongNormal;
                j /= (1 / ball1.mass) + (1 / ball2.mass);

                // Apply impulse
                const impulseX = j * normalX;
                const impulseY = j * normalY;

                ball1.vx -= impulseX / ball1.mass;
                ball1.vy -= impulseY / ball1.mass;
                ball2.vx += impulseX / ball2.mass;
                ball2.vy += impulseY / ball2.mass;

                // Simple friction
                const tangentX = -normalY;
                const tangentY = normalX;
                const vt = rvX * tangentX + rvY * tangentY;
                const friction = (ball1.friction + ball2.friction) * 0.5;
                const frictionImpulse = -vt * friction;
                if (Math.abs(velAlongNormal) > 0.01) { // Apply friction only if not perfectly separating
                    ball1.vx -= frictionImpulse * tangentX / ball1.mass;
                    ball1.vy -= frictionImpulse * tangentY / ball1.mass;
                    ball2.vx += frictionImpulse * tangentX / ball2.mass;
                    ball2.vy += frictionImpulse * tangentY / ball2.mass;
                }
            }
        }

        handleBallSquareCollision(ball, square) {
            // Calculate square's AABB for collision detection
            const sqLeft = square.x - square.size / 2;
            const sqRight = square.x + square.size / 2;
            const sqTop = square.y - square.size / 2;
            const sqBottom = square.y + square.size / 2;

            const closestPoint = this.getClosestPointOnRectangle(ball.x, ball.y, sqLeft, sqTop, square.size, square.size);

            const normalX = ball.x - closestPoint.x;
            const normalY = ball.y - closestPoint.y;
            const distance = Math.sqrt(normalX * normalX + normalY * normalY);

            if (distance < ball.radius && distance !== 0) { // Collision detected
                const overlap = ball.radius - distance;
                const normalizedNormalX = normalX / distance;
                const normalizedNormalY = normalY / distance;

                // Separation: Push ball out of square
                ball.x += normalizedNormalX * overlap;
                ball.y += normalizedNormalY * overlap;

                // Relative velocity (assuming square is static for this basic interaction)
                const rvX = ball.vx;
                const rvY = ball.vy;

                // Velocity along the normal
                const velAlongNormal = rvX * normalizedNormalX + rvY * normalizedNormalY;

                // Do not resolve if already separating
                if (velAlongNormal > 0) return;

                // Restitution (ball's restitution against a surface)
                const e = ball.restitution;

                // Impulse scalar
                let j = -(1 + e) * velAlongNormal;
                j /= (1 / ball.mass); // Only ball's mass because square is treated as infinite mass

                // Apply impulse
                const impulseX = j * normalizedNormalX;
                const impulseY = j * normalizedNormalY;

                ball.vx -= impulseX / ball.mass;
                ball.vy -= impulseY / ball.mass;

                // Simple friction (against the square's surface)
                const tangentX = -normalizedNormalY;
                const tangentY = normalizedNormalX;
                const vt = rvX * tangentX + rvY * tangentY;
                const friction = ball.friction;
                const frictionImpulse = -vt * friction;
                if (Math.abs(velAlongNormal) > 0.01) {
                    ball.vx -= frictionImpulse * tangentX / ball.mass;
                    ball.vy -= frictionImpulse * tangentY / ball.mass;
                }
            }
        }

        renderOptimized() {
            // Clear local canvas to prevent trails FOR YOUR CLIENT-SIDE VIEW.
            // This does NOT affect what other players see.
            if (drawariaCtx && drawariaCanvas) {
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }

            this.physicsObjects.forEach(obj => {
                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                // Determine if a server-side update (erase + redraw) is needed.
                // It's needed if rainbow mode is active (color is changing),
                // or if the position has changed beyond the threshold.
                const needsServerRedraw = this.controls.rainbowModeActive ||
                                          (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD);

                if (needsServerRedraw) {
                    // Step 1: "Erase" the object at its old position on the server.
                    // We draw a white shape over where it *was*.
                    // This is only done if the object has been rendered before (not its initial draw).
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        if (obj.type === 'ball') {
                            this.drawBall(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF'); // Draw in white
                        } else if (obj.type === 'square') {
                            this.drawSquare(obj.lastRenderX, obj.lastRenderY, obj.size, '#FFFFFF'); // Draw in white
                        }
                    }

                    // Step 2: Draw the object at its new, current position with its current color.
                    if (obj.type === 'ball') {
                        this.drawBall(obj.x, obj.y, obj.radius, obj.color);
                    } else if (obj.type === 'square') {
                        this.drawSquare(obj.x, obj.y, obj.size, obj.color);
                    }

                    // Update last rendered positions for the next frame's "erase" step.
                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });
        }

        /**
         * Dibuja una pelota como un círculo relleno enviando un solo comando al servidor.
         * @param {number} x - Coordenada X del centro.
         * @param {number} y - Coordenada Y del centro.
         * @param {number} radius - Radio de la pelota.
         * @param {string} color - Color de la pelota.
         */
        drawBall(x, y, radius, color) {
            // El grosor negativo hace que Drawaria dibuje un círculo relleno.
            const effectiveThickness = radius * 2.5; // Ligeramente mayor al diámetro para asegurar cobertura completa y evitar bordes
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness); // Pequeña línea para simular un punto central
        }

        /**
         * Dibuja un cuadrado como un cuadrado relleno enviando un solo comando al servidor.
         * @param {number} x - Coordenada X del centro.
         * @param {number} y - Coordenada Y del centro.
         * @param {number} size - Tamaño del lado del cuadrado.
         * @param {string} color - Color del cuadrado.
         */
        drawSquare(x, y, size, color) {
            // El grosor negativo hace que Drawaria dibuje un cuadrado relleno.
            const effectiveThickness = size * 1.1; // Ligeramente mayor al tamaño para asegurar cobertura completa y evitar bordes
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness); // Pequeña línea para simular un punto central
        }


        executeKick() {
            if (this.physicsObjects.size === 0) {
                this.showFeedback('⚠️ Launch physics engine first!', '#ed8936');
                return;
            }

            const power = this.controls.kickPower;
            const angle = this.controls.kickAngle * Math.PI / 180; // Convert to radians

            const kickForceX = Math.cos(angle) * power * 0.3;
            const kickForceY = Math.sin(angle) * power * 0.3;

            this.physicsObjects.forEach(obj => {
                obj.vx += kickForceX;
                obj.vy += kickForceY;
            });

            console.log(`⚽ Kick executed: Power=${power}, Angle=${this.controls.kickAngle}°`);
            this.showFeedback(`⚽ KICK! Power: ${power} | Angle: ${this.controls.kickAngle}°`, '#ed8936');
        }

        // NEW FUNCTION: Toggles the rainbow mode for all physics objects
        toggleRainbowMode() {
            const toggleRainbowBtn = document.getElementById('laser-blast-btn'); // Renamed for clarity

            if (!this.controls.rainbowModeActive) {
                // Activate Rainbow Mode
                this.controls.rainbowModeActive = true;
                if (toggleRainbowBtn) {
                    toggleRainbowBtn.textContent = '🌈 Deactivate Rainbow Mode';
                    toggleRainbowBtn.style.background = 'linear-gradient(135deg, #00bfff, #0080ff)'; // Blue gradient for active
                }
                this.showFeedback('🌈 RAINBOW MODE ACTIVATED!', '#00bfff');
                console.log('🌈 Rainbow Mode activated.');

                // Start interval to update colors
                this.rainbowInterval = setInterval(() => {
                    if (!this.isActive && this.controls.rainbowModeActive) { // If physics engine stops unexpectedly
                        this.toggleRainbowMode(); // Deactivate itself
                        return;
                    }

                    this.rainbowHue = (this.rainbowHue + 5) % 360; // Increment hue, wrap around 360

                    const hslColor = `hsl(${this.rainbowHue}, 100%, 70%)`; // Full saturation, good lightness

                    this.physicsObjects.forEach(obj => {
                        obj.color = hslColor;
                    });
                }, 100); // Update color every 100ms for a smooth transition
            } else {
                // Deactivate Rainbow Mode
                this.controls.rainbowModeActive = false;
                if (toggleRainbowBtn) {
                    toggleRainbowBtn.textContent = '🌈 Toggle Rainbow Mode';
                    toggleRainbowBtn.style.background = 'linear-gradient(135deg, #ff00ff, #800080)'; // Original purple gradient
                }
                this.showFeedback('🌈 RAINBOW MODE DEACTIVATED!', '#ff00ff');
                console.log('🌈 Rainbow Mode deactivated.');

                clearInterval(this.rainbowInterval); // Stop the interval

                // Reset all objects to their default colors and force a redraw
                this.physicsObjects.forEach(obj => {
                    obj.color = obj.type === 'ball' ? '#ffffff' : '#ffcc00'; // Reset to original colors
                    // Force re-render by setting lastRenderX/Y to an invalid value for immediate visual update
                    // This will trigger an erase+draw in the next render cycle to reset colors cleanly on server.
                    obj.lastRenderX = -9999;
                    obj.lastRenderY = -9999;
                });
            }
        }

        showFeedback(message, color) {
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${color};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: bold;
                z-index: 2147483648;
                font-size: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;
            feedback.innerHTML = message;

            document.body.appendChild(feedback);
            setTimeout(() => feedback.style.opacity = '1', 10); // Fade in
            setTimeout(() => feedback.style.opacity = '0', 1500); // Fade out
            setTimeout(() => feedback.remove(), 1800); // Remove after fade out
        }

        handleCanvasClick(event) {
            if (!this.isActive || !this.canvasElement) return;

            const rect = this.canvasElement.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            if (event.shiftKey) {
                this.createSquare(clickX, clickY);
            } else {
                this.createBall(clickX, clickY);
            }
        }

        handleKeyInput(event) {
            if (!this.isActive) return;

            switch(event.code) {
                case 'Space':
                    event.preventDefault();
                    this.executeKick();
                    break;
                case 'KeyR':
                    if (this.canvasElement) {
                        this.physicsObjects.forEach(obj => {
                            if (obj.type === 'ball' || obj.type === 'square') {
                                obj.x = this.canvasElement.width / 2 + (Math.random() - 0.5) * 50;
                                obj.y = this.canvasElement.height / 2 + (Math.random() - 0.5) * 50;
                                obj.vx = 0;
                                obj.vy = 0;
                                // Reset color if rainbow mode is off or if it was overridden
                                if (!this.controls.rainbowModeActive) {
                                     obj.color = obj.type === 'ball' ? '#ffffff' : '#ffcc00';
                                }
                                // Force a redraw (erase+draw) in the next cycle to reset position cleanly on server
                                obj.lastRenderX = -9999;
                                obj.lastRenderY = -9999;
                            }
                        });
                        this.showFeedback('🔄 All objects reset!', '#4fd1c7');
                        console.log('🔄 All objects reset');
                    }
                    break;
                case 'KeyB': // Create a new ball
                    event.preventDefault();
                    if (this.canvasElement) {
                        const randX = Math.random() * this.canvasElement.width;
                        const randY = Math.random() * this.canvasElement.height * 0.5; // Top half of canvas
                        this.createBall(randX, randY);
                    }
                    break;
                case 'KeyS': // Create a new square
                    event.preventDefault();
                    if (this.canvasElement) {
                        const randX = Math.random() * this.canvasElement.width;
                        const randY = Math.random() * this.canvasElement.height * 0.5; // Top half of canvas
                        this.createSquare(randX, randY);
                    }
                    break;
            }
        }
    }


    /* ----------  GLOBAL INITIALIZATION  ---------- */
    let footballEngine = null;

    const initPhysicsEngine = () => {
        if (!footballEngine) {
            console.log('🎮 Initializing Drawaria Optimized Physics Engine...');
            footballEngine = new OptimizedDrawariaPhysics();

            // Confirmation message for script load
            setTimeout(() => {
                const confirmMsg = document.createElement('div');
                confirmMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(45deg, #4fd1c7, #38b2ac);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 15px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 2147483648;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(79,209,199,0.5);
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                `;
                confirmMsg.innerHTML = '✅ OPTIMIZED PHYSICS ENGINE LOADED!<br><span style="font-size: 12px;">Ready to play - Check top-right panel</span>';

                document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 3000);
                setTimeout(() => confirmMsg.remove(), 3300);
            }, 1000);
        }
    };

    // Initialize when DOM is ready or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhysicsEngine);
    } else {
        initPhysicsEngine();
    }
    setTimeout(initPhysicsEngine, 2000); // Fallback in case DOMContentLoaded is missed

    console.log('🌌 Drawaria Optimized Physics Engine v4.0 loaded successfully! 🌌');

})();