// ==UserScript==
// @name         Drawaria Physics Engine Football⚽
// @namespace    http://tampermonkey.net/
// @version      5.1.1
// @description  Adds an advanced physics-based football (soccer) mod, with realistic movement and collision Updated for drawaria sports update!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546653/Drawaria%20Physics%20Engine%20Football%E2%9A%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/546653/Drawaria%20Physics%20Engine%20Football%E2%9A%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- SHARED SYSTEM COMPONENTS ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Optimized command queue
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 12;
    const BATCH_INTERVAL = 45;

    const positionCache = new Map();
    const MOVEMENT_THRESHOLD = 3;

    // NEW: Particle system constants (still used internally)
    const PARTICLE_CONSTANTS = {
        MAX_PARTICLES: 0,
        PARTICLE_LIFE: 60,
        GRAVITY_PARTICLES: true,
        COLLISION_PARTICLES: true,
        GOAL_PARTICLES: true
    };

    // Field creation constants with match mode colors
    const FIELD_CONSTANTS = {
        GOAL_P1_COLOR: '#555555', // Darker for P1
        GOAL_P2_COLOR: '#787878', // Original color for P2
        TEXT_COLOR: '#000000',
        GRASS_COLOR: '#228B22',
        GOAL_THICKNESS: 10
    };

    // NEW: Match mode constants
    const MATCH_CONSTANTS = {
        MAX_GOALS: 4,
        PLAY_AREA_REDUCTION: {
            SIDES: 0.1,  // 10% from sides
            TOP: 0.4     // 40% from top
        }
    };

    // WebSocket interception
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for advanced physics engine.');
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
            const batch = commandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try { drawariaSocket.send(cmd); } catch (e) { console.warn('Failed to send command:', e); }
            });
        }, BATCH_INTERVAL);
    }

    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);

        const cmd = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);

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

    // Helper functions
    function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function randomColor() { return `hsl(${Math.random() * 360}, 70%, 60%)`; }

    /* ---------- PARTICLE SYSTEM (Internal) ---------- */
    class Particle {
        constructor(x, y, vx, vy, color, size, life) {
            this.x = x; this.y = y; this.vx = vx; this.vy = vy;
            this.color = color; this.size = size; this.life = life;
            this.maxLife = life; this.gravity = 0.2;
        }

        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.99; this.vy *= 0.99;
            this.life--;
        }

        draw() {
            if (this.life <= 0) return;
            const alpha = Math.max(0, this.life / this.maxLife);
            const currentSize = this.size * alpha;
            enqueueDrawCommand(
                this.x - currentSize/2, this.y - currentSize/2,
                this.x + currentSize/2, this.y + currentSize/2,
                this.color, currentSize
            );
        }

        isDead() { return this.life <= 0; }
    }

    class ParticleSystem {
        constructor() { this.particles = []; }

        addParticle(x, y, vx, vy, color, size = 3, life = 30) {
            if (this.particles.length < PARTICLE_CONSTANTS.MAX_PARTICLES) {
                this.particles.push(new Particle(x, y, vx, vy, color, size, life));
            }
        }

        explode(x, y, count = 15, color = null) {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                const speed = Math.random() * 6 + 2;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const particleColor = color || randomColor();
                const size = Math.random() * 4 + 2;
                const life = Math.random() * 40 + 20;
                this.addParticle(x, y, vx, vy, particleColor, size, life);
            }
        }

        trail(x, y, count = 5, color = null) {
            for (let i = 0; i < count; i++) {
                const vx = (Math.random() - 0.5) * 4;
                const vy = (Math.random() - 0.5) * 4;
                const particleColor = color || randomColor();
                const size = Math.random() * 3 + 1;
                const life = Math.random() * 20 + 10;
                this.addParticle(x, y, vx, vy, particleColor, size, life);
            }
        }

        update() {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.isDead());
        }

        draw() { this.particles.forEach(particle => particle.draw()); }
        clear() { this.particles = []; }
    }

    /* ---------- ADVANCED PHYSICS ENGINE ---------- */
    const PHYSICS_CONSTANTS = {
        GRAVITY: 500,
        BALL_MASS: 0.25,
        BALL_RADIUS: 40,
        // SQUARE_MASS: 0.8, // REMOVED
        // SQUARE_SIZE: 60,  // REMOVED
        TIMESTEP: 1/60,
        MAX_VELOCITY: 800,
        AIR_RESISTANCE: 0.008,
        RESTITUTION_BALL: 0.75,
        // RESTITUTION_SQUARE: 0.6, // REMOVED
        RESTITUTION_WALL: 0.6,
        FRICTION_GRASS: 0.85,
        PLAYER_INTERACTION_FORCE: 350,
        PLAYER_PUSH_MULTIPLIER: 2.5,
        PLAYER_RESTITUTION: 1.1,
        PLAYER_DETECTION_INTERVAL: 1000 / 60,
        PLAYER_DETECTION_RADIUS_MULTIPLIER: 1.3,
    };

    class AdvancedDrawariaPhysics {
        constructor() {
            this.initialized = false;
            this.isActive = false;
            this.physicsObjects = new Map();
            this.objectIdCounter = 0;
            this.lastRenderTime = 0;
            this.renderInterval = 1000 / 30;

            // Internal particle system (DISABLED)
            this.particleSystem = {
                addParticle: () => {},
                explode: () => {},
                trail: () => {},
                update: () => {},
                draw: () => {},
                clear: () => {}
            };

            // NEW: Match mode system
            this.matchMode = {
                active: false,
                scores: { p1: 0, p2: 0 },
                playArea: null,
                lastScorePositions: { p1: null, p2: null },
                goalCooldown: false // AÑADIDO: para evitar múltiples goles
            };

            // OLD: Auto kick system - REMOVED

            this.gameStats = {
                totalCollisions: 0,
                maxVelocityReached: 0,
                objectsCreated: 0,
                totalGoals: 0,
                particlesGenerated: 0
            };

            this.controls = {
                // kickPower: 400, // REMOVIDO
                // kickAngle: 0,   // REMOVIDO
                showTrails: false,
                showDebug: false,
                rainbowModeActive: false,
                // NEW: Updated controls
                defaultObjectColor: '#000000', // Black by default
                alternatePhysics: 'normal'
            };

            this.rainbowHue = 0;
            this.rainbowInterval = null;

            this.playerTracker = {
                players: new Map(),
                detectionRadius: PHYSICS_CONSTANTS.BALL_RADIUS * PHYSICS_CONSTANTS.PLAYER_DETECTION_RADIUS_MULTIPLIER,
                lastUpdateTime: 0
            };

            this.fieldDrawing = { isDrawing: false, isStopped: false };

            this.init();
        }

        init() {
            if (this.initialized) return;

            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas;
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d');

                    this.initialized = true;
                    this.createAdvancedPanel();
                    console.log('✅ Advanced Drawaria Physics Engine v5.1 initialized');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        createAdvancedPanel() {
            const existingPanel = document.getElementById('advanced-physics-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'advanced-physics-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                width: 380px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #0f0f23, #1a1a3a) !important;
                border: 2px solid #00d4ff !important;
                border-radius: 15px !important;
                color: white !important;
                font-family: 'Segoe UI', Arial, sans-serif !important;
                overflow: hidden !important;
                box-shadow: 0 0 30px rgba(0,212,255,0.4) !important;
            `;

            // NUEVO: Header draggable con botones
            const header = document.createElement('div');
            header.id = 'panel-header'; // ID importante para draggable
            header.style.cssText = `
                background: linear-gradient(45deg, #00d4ff, #0099cc) !important;
                padding: 12px 20px !important;
                font-weight: bold !important;
                text-align: center !important;
                font-size: 14px !important;
                cursor: move !important;
                user-select: none !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            `;

            // Título del header
            const title = document.createElement('div');
            title.innerHTML = '🏆 ADVANCED PHYSICS ENGINE v5.1';
            title.style.flex = '1';

            // Botones del header
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex !important;
                gap: 8px !important;
            `;

            // BOTÓN MINIMIZAR
            const minimizeBtn = document.createElement('button');
            minimizeBtn.id = 'minimize-btn';
            minimizeBtn.innerHTML = '−';
            minimizeBtn.style.cssText = `
                width: 25px !important;
                height: 25px !important;
                background: rgba(255,255,255,0.2) !important;
                border: none !important;
                border-radius: 4px !important;
                color: white !important;
                cursor: pointer !important;
                font-size: 16px !important;
                line-height: 1 !important;
                padding: 0 !important;
            `;

            // BOTÓN CERRAR
            const closeBtn = document.createElement('button');
            closeBtn.id = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                width: 25px !important;
                height: 25px !important;
                background: rgba(255,0,0,0.6) !important;
                border: none !important;
                border-radius: 4px !important;
                color: white !important;
                cursor: pointer !important;
                font-size: 18px !important;
                line-height: 1 !important;
                padding: 0 !important;
            `;

            buttonContainer.appendChild(minimizeBtn);
            buttonContainer.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(buttonContainer);

            // Contenido del panel (tu HTML existente)
            const content = document.createElement('div');
            content.id = 'panel-content';
            content.style.cssText = `padding: 20px !important;`;
            content.innerHTML = `
                <!-- CREATE FIELD BUTTON -->
                <div style="margin-bottom: 15px; text-align: center;">
                    <button id="create-field-btn" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, ${FIELD_CONSTANTS.GRASS_COLOR}, #32CD32);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">🏟️ Create Field</button>
                </div>

                <!-- LAUNCH PHYSICS BUTTON -->
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

                <!-- OBJECT CREATION BUTTONS -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="add-ball-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">⚽ Ball</button>
                    <!-- SQUARE BUTTON REMOVED -->
                </div>

                <!-- KICK CONTROLS REMOVED -->

                <!-- ACTION BUTTONS -->
                <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                    <!-- AUTO KICK TOGGLE REMOVED -->
                    <button id="reset-all-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: linear-gradient(135deg, #74b9ff, #0984e3);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                        font-size: 11px;
                    ">🔄 Reset</button>
                </div>

                <!-- NEW ADVANCED MODES -->
                <div style="margin-bottom: 15px;">
                    <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #00d4ff; text-align: center;">🌟 Advanced Modes</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="match-mode-toggle" class="mode-toggle" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #444, #666);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🏆 Match Mode</button>
                        <button id="clean-canvas-btn" style="
                            padding: 8px;
                            background: linear-gradient(135deg, #e17055, #d63031);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 10px;
                            font-weight: bold;
                        ">🧹 Clean Canvas</button>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <label style="font-size: 9px; color: #00d4ff;">Color:</label>
                            <input type="color" id="object-color-picker" value="#000000" style="
                                width: 30px;
                                height: 25px;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">
                        </div>
                    </div>
                </div>

                <!-- RAINBOW MODE -->
                <div style="margin-bottom: 15px;">
                    <button id="rainbow-toggle" style="
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

                <!-- PHYSICS SELECTION -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #00d4ff;">
                        🔬 Physics Mode:
                    </label>
                    <select id="physics-mode" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #00d4ff;
                        border-radius: 6px;
                        background: #1a1a3a;
                        color: white;
                        font-size: 12px;
                    ">
                        <option value="normal">🌍 Normal</option>
                        <option value="moon">🌙 Moon Gravity</option>
                        <option value="underwater">🌊 Underwater</option>
                        <option value="magnetic">🧲 Magnetic Field</option>
                    </select>
                </div>

                <!-- CLEAR ALL -->
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

                <!-- MATCH MODE SCOREBOARD -->
                <div id="match-scoreboard" style="
                    display: none;
                    background: rgba(0,0,0,0.4);
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 15px;
                    border: 2px solid #ffd700;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #ffd700; font-size: 14px;">🏆 MATCH SCORE</h4>
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                        <span>P1: <span id="score-p1" style="color: #ff6b6b;">0</span></span>
                        <span style="color: #666;">vs</span>
                        <span>P2: <span id="score-p2" style="color: #74b9ff;">0</span></span>
                    </div>
                </div>

                <!-- STATS -->
                <div id="stats" style="
                    background: rgba(0,0,0,0.3);
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 10px;
                    text-align: center;
                    border: 1px solid rgba(0,212,255,0.3);
                ">
                    <div>Objects: <span id="object-count">0</span> | Goals: <span id="goals-count">0</span></div>
                    <div>Collisions: <span id="collision-count">0</span> | Max Speed: <span id="max-speed">0</span></div>
                    <div>Queue: <span id="queue-count">0</span> | Performance: <span id="performance">Optimal</span></div>
                </div>

                <!-- HELP TEXT -->
                <div style="
                    text-align: center;
                    margin-top: 15px;
                    font-size: 9px;
                    color: rgba(255,255,255,0.6);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 10px;
                ">
                    Match Mode: Auto goals & scoreboards<br>
                    <span style="color: #00d4ff;">Color picker affects new objects (disabled during rainbow)</span>
                </div>
            `;

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            // Configurar draggable y botones
            this.makePanelDraggable();
            this.setupPanelButtons();
            this.setupAdvancedEventListeners();
            this.startAdvancedStatsMonitoring();
        }

        setupAdvancedEventListeners() {
            // Field and physics controls
            document.getElementById('create-field-btn')?.addEventListener('click', () => this.createFootballField());
            document.getElementById('toggle-physics')?.addEventListener('click', () => this.togglePhysics());

            // Object creation
            document.getElementById('add-ball-btn')?.addEventListener('click', () => this.addRandomBall());
            // document.getElementById('add-square-btn')?.addEventListener('click', () => this.addRandomSquare()); // REMOVED

            // Actions
            document.getElementById('reset-all-btn')?.addEventListener('click', () => this.resetAllObjects());
            document.getElementById('clear-all-btn')?.addEventListener('click', () => this.clearAllObjects());
            document.getElementById('rainbow-toggle')?.addEventListener('click', () => this.toggleRainbowMode());

            // NEW: Advanced controls
            document.getElementById('match-mode-toggle')?.addEventListener('click', () => this.toggleMatchMode());
            document.getElementById('clean-canvas-btn')?.addEventListener('click', () => this.cleanCanvas());

            // Auto kick toggle - REMOVIDO

            // Color picker
            document.getElementById('object-color-picker')?.addEventListener('change', (e) => {
                if (!this.controls.rainbowModeActive) {
                    this.controls.defaultObjectColor = e.target.value;
                    this.showFeedback(`🎨 New object color set!`, e.target.value);
                }
            });

            // Sliders - REMOVIDOS

            // Physics mode selection
            document.getElementById('physics-mode')?.addEventListener('change', (e) => {
                this.controls.alternatePhysics = e.target.value;
                this.showFeedback(`🔬 Physics Mode: ${e.target.options[e.target.selectedIndex].text}`, '#00d4ff');
            });

            // Canvas click for object creation
            if (this.canvasElement) {
                // Modificado para solo crear bolas
                this.canvasElement.addEventListener('click', (e) => this.createBall(e.clientX - this.canvasElement.getBoundingClientRect().left, e.clientY - this.canvasElement.getBoundingClientRect().top));
            }
        }

        setupToggleButton(buttonId, callback) {
            const button = document.getElementById(buttonId);
            if (!button) return;

            button.addEventListener('click', () => {
                const isActive = button.getAttribute('data-active') === 'true';
                const newState = !isActive;

                button.setAttribute('data-active', newState.toString());
                if (newState) {
                    button.style.background = 'linear-gradient(135deg, #6c5ce7, #5f3dc4)';
                } else {
                    button.style.background = 'linear-gradient(135deg, #444, #666)';
                }

                callback(newState);
            });
        }

        // NEW: Match Mode functionality
        toggleMatchMode() {
            const button = document.getElementById('match-mode-toggle');
            const scoreboard = document.getElementById('match-scoreboard');

            this.matchMode.active = !this.matchMode.active;

            if (this.matchMode.active) {
                button.style.background = 'linear-gradient(135deg, #ffd700, #ffb347)';
                scoreboard.style.display = 'block';
                this.setupMatchMode();
                this.showFeedback('🏆 MATCH MODE ACTIVATED!', '#ffd700');
            } else {
                button.style.background = 'linear-gradient(135deg, #444, #666)';
                scoreboard.style.display = 'none';
                this.resetMatch();
                this.showFeedback('🏆 Match Mode Deactivated', '#666');
            }
        }

        async setupMatchMode() {
            // Create field automatically
            await this.createMatchField();

            // Reset scores
            this.matchMode.scores = { p1: 0, p2: 0 };
            this.updateScoreboard();

            // Set up reduced play area
            this.setupReducedPlayArea();

            // Draw initial scoreboards on field
            await this.drawScoreboards();

            // AÑADIDO: Crear una pelota en el centro solo DESPUÉS de que el campo esté listo
            // Se usa setTimeout para asegurar que la cola de dibujo del campo se procese primero
            setTimeout(() => {
                this.addRandomBall(true);
            }, 500); // Pequeño delay adicional para visualización
        }


        async createMatchField() {
            if (this.fieldDrawing.isDrawing) return;

            this.fieldDrawing.isDrawing = true;
            this.fieldDrawing.isStopped = false;
            // No limpiar objetos aquí si la idea es solo redibujar el campo.
            // this.clearAllObjects(false); // Eliminado para no borrar las pelotas

            try {
                const coords = this.calculateFieldCoordinates();

                this.showFeedback(`🏟️ Redrawing field...`, FIELD_CONSTANTS.GOAL_P2_COLOR);
                await sleep(50); // Menor delay para redibujado rápido

                // Limpiar el área del campo (TODO: mejorar para solo limpiar el "campo")
                await this.cleanCanvas(); // Limpia todo el canvas para redibujar

                // Dibujar césped
                await this.drawGrass(coords);
                await sleep(100);

                // Dibujar porterías con diferentes colores para P1 y P2
                await this.drawMatchGoal(coords.leftGoal, FIELD_CONSTANTS.GOAL_P1_COLOR); // P1 - Darker
                await this.drawMatchGoal(coords.rightGoal, FIELD_CONSTANTS.GOAL_P2_COLOR); // P2 - Lighter
                await sleep(100);

                // Dibujar texto FOOTBALL
                await this.drawBlackPixelText("FOOTBALL", coords);
                await sleep(100);

                // Redibujar los marcadores después de redibujar el campo
                await this.drawScoreboards();

                this.showFeedback("🏆 FIELD REDRAW COMPLETE! 🎯", "#006400");

            } catch (error) {
                console.error("Error creating match field:", error);
                this.showFeedback(`❌ Error: ${error.message}`, "#B22222");
            } finally {
                this.fieldDrawing.isDrawing = false;
            }
        }


        async drawMatchGoal(goalCoords, goalColor) {
            const frameThickness = FIELD_CONSTANTS.GOAL_THICKNESS;
            const lineThickness = Math.max(1, Math.floor(FIELD_CONSTANTS.GOAL_THICKNESS/2));
            const lineMargin = Math.max(8, goalCoords.width * 0.08);
            const topOffset = goalCoords.height * 0.05;

            // Main frame
            await this.drawLineLocalAndServer(goalCoords.x, goalCoords.y, goalCoords.x, goalCoords.y + goalCoords.height, goalColor, frameThickness, 80);
            await this.drawLineLocalAndServer(goalCoords.x, goalCoords.y, goalCoords.x + goalCoords.width, goalCoords.y, goalColor, frameThickness, 80);
            await this.drawLineLocalAndServer(goalCoords.x + goalCoords.width, goalCoords.y, goalCoords.x + goalCoords.width, goalCoords.y + goalCoords.height, goalColor, frameThickness, 80);

            // Interior lines
            for (let i = 1; i <= 3; i++) {
                const x = goalCoords.x + (goalCoords.width * i / 4);
                await this.drawLineLocalAndServer(x, goalCoords.y + topOffset, x, goalCoords.y + goalCoords.height - topOffset, goalColor, lineThickness, 60);
            }

            for (let i = 1; i <= 4; i++) {
                const y = goalCoords.y + (goalCoords.height * i / 5);
                await this.drawLineLocalAndServer(goalCoords.x + lineMargin, y, goalCoords.x + goalCoords.width - lineMargin, y, goalColor, lineThickness, 60);
            }
        }

        setupReducedPlayArea() {
            if (!this.canvasElement) return;

            const reductionSides = this.canvasElement.width * MATCH_CONSTANTS.PLAY_AREA_REDUCTION.SIDES;
            const reductionTop = this.canvasElement.height * MATCH_CONSTANTS.PLAY_AREA_REDUCTION.TOP;

            this.matchMode.playArea = {
                left: reductionSides,
                right: this.canvasElement.width - reductionSides,
                top: reductionTop,
                bottom: this.canvasElement.height
            };
        }

        async drawScoreboards() {
            if (!this.canvasElement) return;

            const coords = this.calculateFieldCoordinates();

            // P1 scoreboard (above left goal)
            const p1X = coords.leftGoal.x + coords.leftGoal.width / 2;
            const p1Y = coords.leftGoal.y - 80;

            // P2 scoreboard (above right goal)
            const p2X = coords.rightGoal.x + coords.rightGoal.width / 2;
            const p2Y = coords.rightGoal.y - 80;

            // Draw P1 and P2 labels
            await this.drawPixelText("P1", p1X - 30, p1Y - 30, FIELD_CONSTANTS.TEXT_COLOR, 3);
            await this.drawPixelText("P2", p2X - 30, p2Y - 30, FIELD_CONSTANTS.TEXT_COLOR, 3);

            // Store positions for score updates
            this.matchMode.lastScorePositions = {
                p1: { x: p1X, y: p1Y },
                p2: { x: p2X, y: p2Y }
            };

            // Draw initial scores
            await this.updateScoreDisplay();
        }

        async updateScoreDisplay() {
            if (!this.matchMode.lastScorePositions.p1) return;

            const { p1, p2 } = this.matchMode.lastScorePositions;
            const pixelSize = 4;

            // Clear previous scores (draw white over them)
            await this.clearScoreArea(p1.x, p1.y, pixelSize);
            await this.clearScoreArea(p2.x, p2.y, pixelSize);

            // Draw new scores
            await this.drawPixelNumber(this.matchMode.scores.p1, p1.x, p1.y, FIELD_CONSTANTS.TEXT_COLOR, pixelSize);
            await this.drawPixelNumber(this.matchMode.scores.p2, p2.x, p2.y, FIELD_CONSTANTS.TEXT_COLOR, pixelSize);
        }

        async clearScoreArea(x, y, size) {
            // Clear a 7x5 area (number size) with white
            // Ajustar el área para que sea un poco más grande y cubra bien
            const clearWidth = size * 5 + 10; // Ancho del número + margen
            const clearHeight = size * 7 + 10; // Alto del número + margen
            const startX = x - 5; // Empezar un poco antes
            const startY = y - 5; // Empezar un poco antes

            // Dibujar un rectángulo blanco grande para borrar el área
            enqueueDrawCommand(startX, startY, startX + clearWidth, startY + clearHeight, '#FFFFFF', Math.max(clearWidth, clearHeight));
            await sleep(10);
        }

        // Pixel number patterns
        NUMBER_PATTERNS = {
            0: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            1: [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
            2: [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
            3: [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
            4: [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]]
        };

        async drawPixelNumber(number, x, y, color, pixelSize) {
            const pattern = this.NUMBER_PATTERNS[number];
            if (!pattern) return;

            for (let row = 0; row < pattern.length; row++) {
                for (let col = 0; col < pattern[row].length; col++) {
                    if (pattern[row][col] === 1) {
                        const pixelX = x + (col * pixelSize);
                        const pixelY = y + (row * pixelSize);
                        await this.drawPixel(pixelX, pixelY, color, pixelSize);
                    }
                }
            }
        }

        async drawPixelText(text, x, y, color, pixelSize) {
            const MINI_LETTERS = {
                'P': [[1,1,1],[1,0,1],[1,1,1],[1,0,0],[1,0,0]],
                '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
                '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
                // Añadir más letras si es necesario para "FOOTBALL" en el futuro
                'F': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
                'O': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
                'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
                'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
                'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
                'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]]
            };

            let currentX = x;
            for (let i = 0; i < text.length; i++) {
                const letter = text[i];
                const pattern = MINI_LETTERS[letter];
                if (pattern) {
                    for (let row = 0; row < pattern.length; row++) {
                        for (let col = 0; col < pattern[row].length; col++) {
                            if (pattern[row][col] === 1) {
                                const pixelX = currentX + (col * pixelSize);
                                const pixelY = y + (row * pixelSize);
                                await this.drawPixel(pixelX, pixelY, color, pixelSize);
                            }
                        }
                    }
                }
                currentX += pixelSize * 4; // Space between letters (ajustar según el ancho de la letra más grande + espacio)
            }
        }

        checkGoals() {
            if (!this.matchMode.active || !this.canvasElement) return;

            const coords = this.calculateFieldCoordinates();
            const currentTime = performance.now();

            // CREAR HITBOXES MÁS GRANDES PARA DETECCIÓN (considerando el radio de la pelota)
            const extraPadding = PHYSICS_CONSTANTS.BALL_RADIUS + 10; // Mayor padding para detección de gol

            // Clonar el mapa para iterar sin problemas de modificación durante el bucle
            Array.from(this.physicsObjects.values()).forEach(obj => {
                if (obj.type !== 'ball') return;

                // Cooldown por pelota para evitar múltiples goles de la misma pelota
                if (currentTime - obj.lastGoalTime < 2000) return; // 2 segundos de cooldown por pelota

                // Check P1 goal (left goal) - HITBOX EXPANDIDA
                if (obj.x >= coords.leftGoal.x - extraPadding &&
                    obj.x <= coords.leftGoal.x + coords.leftGoal.width + extraPadding &&
                    obj.y >= coords.leftGoal.y - extraPadding &&
                    obj.y <= coords.leftGoal.y + coords.leftGoal.height + extraPadding) {
                    obj.lastGoalTime = currentTime; // Actualizar cooldown de la pelota
                    this.scoreGoal('p2', obj); // Pasar el objeto pelota completo
                }

                // Check P2 goal (right goal) - HITBOX EXPANDIDA
                if (obj.x >= coords.rightGoal.x - extraPadding &&
                    obj.x <= coords.rightGoal.x + coords.rightGoal.width + extraPadding &&
                    obj.y >= coords.rightGoal.y - extraPadding &&
                    obj.y <= coords.rightGoal.y + coords.leftGoal.height + extraPadding) { // Usar leftGoal.height como referencia si ambas son iguales
                    obj.lastGoalTime = currentTime; // Actualizar cooldown de la pelota
                    this.scoreGoal('p1', obj); // Pasar el objeto pelota completo
                }
            });
        }


        async scoreGoal(player, scoredBallObject) {
            // Prevenir múltiples goles generales (cooldown del sistema)
            if (this.matchMode.goalCooldown) return;
            this.matchMode.goalCooldown = true;

            this.matchMode.scores[player]++;
            this.gameStats.totalGoals++;

            // Update scoreboard
            this.updateScoreboard();
            await this.updateScoreDisplay();

            // Goal particle effect en la posición de la pelota que anotó
            this.particleSystem.explode(scoredBallObject.x, scoredBallObject.y, 30, '#ffd700');

            this.showFeedback(`🥅 GOAL! ${player.toUpperCase()} SCORES!`, '#ffd700');

            // Borrar la pelota que anotó
            this.physicsObjects.delete(scoredBallObject.id);

            // Redibujar el campo completo (incluyendo las porterías) para asegurar la limpieza
            await this.createMatchField(); // Esto incluye un cleanCanvas interno

            // Crear una nueva pelota en el centro DESPUÉS de que el campo se redibuje
            this.addRandomBall(true); // Pasar 'true' para forzar la aparición en el centro

            // Cooldown de 2 segundos antes de permitir otro gol general
            setTimeout(() => {
                this.matchMode.goalCooldown = false;
            }, 2000); // 2 segundos de cooldown

            // Check for match end
            if (this.matchMode.scores[player] >= MATCH_CONSTANTS.MAX_GOALS) {
                await this.endMatch(player);
            }
        }

        // REMOVIDO: resetBallToCenter es reemplazado por la lógica en scoreGoal

        async endMatch(winner) {
            this.showFeedback(`🏆 ${winner.toUpperCase()} WINS THE MATCH!`, '#ffd700');

            // Big celebration effect
            for (let i = 0; i < 50; i++) {
                this.particleSystem.explode(
                    Math.random() * this.canvasElement.width,
                    Math.random() * this.canvasElement.height,
                    10,
                    '#ffd700'
                );
            }

            // Reset match after 3 seconds
            setTimeout(() => {
                this.resetMatch();
            }, 3000);
        }

        resetMatch() {
            this.matchMode.scores = { p1: 0, p2: 0 };
            this.updateScoreboard();
            if (this.matchMode.active) {
                // Primero limpia todas las pelotas
                this.clearAllObjects(false);
                // Luego redibuja el campo
                this.createMatchField().then(() => {
                    // Y finalmente, cuando el campo está listo, añade la nueva pelota
                    this.addRandomBall(true);
                });
            }
        }


        updateScoreboard() {
            document.getElementById('score-p1').textContent = this.matchMode.scores.p1;
            document.getElementById('score-p2').textContent = this.matchMode.scores.p2;
        }

        // NEW: Clean Canvas functionality
        async cleanCanvas() {
            if (!drawariaCanvas) return;

            this.showFeedback('🧹 Cleaning Canvas...', '#e17055');

            // Draw a giant white rectangle over entire canvas
            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            // Send multiple white rectangles to ensure complete coverage
            // Esto es crucial para la limpieza antes de redibujar el campo
            for (let y = 0; y < canvasHeight; y += 100) { // Mayor salto para eficiencia
                for (let x = 0; x < canvasWidth; x += 100) {
                    const width = Math.min(100, canvasWidth - x);
                    const height = Math.min(100, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(5); // Menor delay para una limpieza más rápida
                }
            }

            // Clear local canvas
            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            this.showFeedback('🧹 Canvas Cleaned!', '#00d084');
        }

        // Auto Kick functionality - REMOVIDO

        startAdvancedStatsMonitoring() {
            setInterval(() => {
                document.getElementById('object-count').textContent = this.physicsObjects.size;
                document.getElementById('goals-count').textContent = this.gameStats.totalGoals;
                document.getElementById('collision-count').textContent = this.gameStats.totalCollisions;
                document.getElementById('max-speed').textContent = Math.round(this.gameStats.maxVelocityReached);
                document.getElementById('queue-count').textContent = commandQueue.length;

                const queueSize = commandQueue.length;
                const performanceElement = document.getElementById('performance');
                if (queueSize < 30) {
                    performanceElement.textContent = 'Optimal';
                    performanceElement.style.color = '#48bb78';
                } else if (queueSize < 150) {
                    performanceElement.textContent = 'Good';
                    performanceElement.style.color = '#ed8936';
                } else {
                    performanceElement.textContent = 'Overloaded';
                    performanceElement.style.color = '#f56565';
                }
            }, 1000);
        }

        /* ---------- OBJECT CREATION ---------- */
        // Modificado para aceptar 'spawnAtCenterForGoal'
        addRandomBall(spawnAtCenterForGoal = false) {
            if (!this.canvasElement) return;

            let x, y;
            if (spawnAtCenterForGoal) {
                x = this.canvasElement.width / 2;
                y = this.canvasElement.height / 2;
            } else {
                // Generar en un área segura fuera de las porterías si es posible
                const padding = 150; // Para evitar spawnear muy cerca de los bordes o porterías
                x = Math.random() * (this.canvasElement.width - 2 * padding) + padding;
                y = Math.random() * (this.canvasElement.height * 0.5 - 2 * padding) + padding; // Spawnear más arriba
            }
            this.createBall(x, y);
            this.particleSystem.explode(x, y, 8, '#4fd1c7');
        }

        // REMOVED: addRandomSquare

        createBall(x, y) {
            const id = `ball_${this.objectIdCounter++}`;
            const ball = {
                id: id, type: 'ball',
                x: x, y: y, vx: 0, vy: 0,
                radius: PHYSICS_CONSTANTS.BALL_RADIUS,
                color: this.controls.rainbowModeActive ? '#ffffff' : this.controls.defaultObjectColor,
                mass: PHYSICS_CONSTANTS.BALL_MASS,
                restitution: PHYSICS_CONSTANTS.RESTITUTION_BALL,
                friction: PHYSICS_CONSTANTS.FRICTION_GRASS,
                lastRenderX: -9999, lastRenderY: -9999,
                creationTime: performance.now(),
                lastCollisionTime: 0,
                lastGoalTime: 0 // AÑADIDO: para cooldown de goles por pelota
            };
            this.physicsObjects.set(id, ball);
            this.gameStats.objectsCreated++;
            return ball;
        }

        // REMOVED: createSquare

        handleAdvancedCanvasClick(event) {
            if (!this.canvasElement) return;

            const rect = this.canvasElement.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            if (this.isActive) {
                // Solo crea bolas, se eliminó la lógica de shiftKey para cuadrados
                this.createBall(clickX, clickY);
            }
        }

        /* ---------- PHYSICS ENGINE ---------- */
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
            this.startGameLoop();
            this.showFeedback('🚀 Advanced Physics Engine Started!', '#4fd1c7');
        }

        stopPhysics() {
            this.isActive = false;
            // this.stopAutoKick(); // Stop auto kick when physics stops - REMOVIDO
            if (this.controls.rainbowModeActive) this.toggleRainbowMode();
            this.showFeedback('🛑 Physics Engine Stopped', '#f56565');
        }

        clearAllObjects(showFeedback = true) {
            if (this.controls.rainbowModeActive) this.toggleRainbowMode();
            this.physicsObjects.clear();
            this.particleSystem.clear();
            positionCache.clear();

            if (drawariaCtx && drawariaCanvas) {
                // Considera limpiar solo los objetos y no todo el canvas si el campo debe permanecer
                // Para una limpieza total de la pantalla, limpia el canvas
                drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
            }
            if (showFeedback) {
                this.showFeedback('🗑️ ALL OBJECTS CLEARED!', '#cc0000');
            }
        }

        resetAllObjects() {
            if (this.canvasElement) {
                this.physicsObjects.forEach(obj => {
                    // Si solo hay bolas, el tipo 'square' ya no es relevante
                    obj.x = this.canvasElement.width / 2 + (Math.random() - 0.5) * 100;
                    obj.y = this.canvasElement.height / 2 + (Math.random() - 0.5) * 100;
                    obj.vx = 0; obj.vy = 0;
                    // if (obj.type === 'square') { obj.angle = 0; obj.angularVelocity = 0; } // REMOVED
                    obj.lastRenderX = -9999; obj.lastRenderY = -9999;
                    obj.lastGoalTime = 0; // Resetear cooldown de gol al resetear objeto
                });

                this.particleSystem.explode(this.canvasElement.width / 2, this.canvasElement.height / 2, 20, '#74b9ff');
                this.showFeedback('🔄 All objects reset!', '#74b9ff');
            }
        }

        startGameLoop() {
            if (!this.isActive) return;
            const currentTime = performance.now();
            if (currentTime - this.lastRenderTime >= this.renderInterval) {
                this.updateAdvancedPhysics();
                this.renderOptimized();
                this.lastRenderTime = currentTime;
            }
            requestAnimationFrame(() => this.startGameLoop());
        }

        updateAdvancedPhysics() {
            const dt = PHYSICS_CONSTANTS.TIMESTEP;

            // Apply physics mode modifications
            let gravityMultiplier = 1;
            let airResistanceMultiplier = 1;

            switch(this.controls.alternatePhysics) {
                case 'moon':
                    gravityMultiplier = 0.16;
                    break;
                case 'underwater':
                    airResistanceMultiplier = 15;
                    gravityMultiplier = 0.3;
                    break;
                case 'magnetic':
                    break;
            }

            // Update all objects
            this.physicsObjects.forEach(obj => {
                // Apply air resistance
                obj.vx *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * airResistanceMultiplier * dt);
                obj.vy *= (1 - PHYSICS_CONSTANTS.AIR_RESISTANCE * airResistanceMultiplier * dt);

                // Apply gravity
                obj.vy += PHYSICS_CONSTANTS.GRAVITY * gravityMultiplier * dt;

                // Magnetic field effects
                if (this.controls.alternatePhysics === 'magnetic') {
                    this.physicsObjects.forEach(otherObj => {
                        if (otherObj.id !== obj.id) {
                            const dx = otherObj.x - obj.x;
                            const dy = otherObj.y - obj.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            if (distance > 0 && distance < 200) {
                                const magneticForce = 50 / (distance * distance);
                                const forceX = (dx / distance) * magneticForce;
                                const forceY = (dy / distance) * magneticForce;

                                obj.vx += forceX * dt;
                                obj.vy += forceY * dt;
                            }
                        }
                    });
                }

                // Update position
                obj.x += obj.vx * dt;
                obj.y += obj.vy * dt;

                // REMOVED: Square rotation logic
                // if (obj.type === 'square') { obj.angularVelocity *= obj.angularDamping; obj.angle += obj.angularVelocity * dt; }

                // Boundary collisions with DVD mode and match area consideration
                this.handleBoundaryCollisions(obj);

                // Track maximum velocity
                const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
                if (speed > this.gameStats.maxVelocityReached) {
                    this.gameStats.maxVelocityReached = speed;
                }

                // Limit maximum velocity
                if (speed > PHYSICS_CONSTANTS.MAX_VELOCITY) {
                    obj.vx = (obj.vx / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                    obj.vy = (obj.vy / speed) * PHYSICS_CONSTANTS.MAX_VELOCITY;
                }
            });

            // Handle collisions
            this.handleObjectCollisions();
            this.handleBallPlayerCollisions();
            // REMOVED: handleSquarePlayerCollisions();

            // Check for goals in match mode
            if (this.matchMode.active) {
                this.checkGoals();
            }

            // Update particle system
         // this.particleSystem.update();
        }

        handleBoundaryCollisions(obj) {
            if (!this.canvasElement) return;

            let objHalfSize = obj.radius; // Solo bolas ahora

            // Use match play area if active, otherwise use full canvas
            let boundaries;
            if (this.matchMode.active && this.matchMode.playArea) {
                boundaries = {
                    left: this.matchMode.playArea.left + objHalfSize,
                    right: this.matchMode.playArea.right - objHalfSize,
                    top: this.matchMode.playArea.top + objHalfSize,
                    bottom: this.matchMode.playArea.bottom - objHalfSize
                };
            } else {
                boundaries = {
                    left: objHalfSize,
                    right: this.canvasElement.width - objHalfSize,
                    top: objHalfSize,
                    bottom: this.canvasElement.height - objHalfSize
                };
            }

            let bounced = false;

            // Check boundaries (normal physics)
            if (obj.x < boundaries.left) {
                obj.x = boundaries.left;
                obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                bounced = true;
            } else if (obj.x > boundaries.right) {
                obj.x = boundaries.right;
                obj.vx = -obj.vx * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                bounced = true;
            }

            if (obj.y < boundaries.top) {
                obj.y = boundaries.top;
                obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                bounced = true;
            } else if (obj.y > boundaries.bottom) {
                obj.y = boundaries.bottom;
                obj.vy = -obj.vy * PHYSICS_CONSTANTS.RESTITUTION_WALL;
                obj.vx *= obj.friction; // Apply friction on ground
                bounced = true;
            }

            // REMOVED: Square rotation on bounce
            // if (bounced && obj.type === 'square') { obj.angularVelocity += (Math.random() - 0.5) * 10; }
        }

        // NEW: Handle collisions between objects
        handleObjectCollisions() {
            const objectsArray = Array.from(this.physicsObjects.values());
            for (let i = 0; i < objectsArray.length; i++) {
                const objA = objectsArray[i];
                for (let j = i + 1; j < objectsArray.length; j++) {
                    const objB = objectsArray[j];

                    // Solo quedan colisiones entre bolas
                    if (objA.type === 'ball' && objB.type === 'ball') {
                        if (this.handleBallBallCollision(objA, objB)) {
                            this.gameStats.totalCollisions++;
                            this.particleSystem.explode((objA.x + objB.x) / 2, (objA.y + objB.y) / 2, 12, '#ff6b6b');
                            objA.lastCollisionTime = performance.now();
                            objB.lastCollisionTime = performance.now();
                        }
                    }
                    // REMOVED: Ball-square and square-square collisions
                }
            }
        }

        handleBallBallCollision(ball1, ball2) {
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball1.radius + ball2.radius;

            if (distance < minDistance && distance !== 0) {
                const normalX = dx / distance;
                const normalY = dy / distance;

                const overlap = minDistance - distance;
                ball1.x -= normalX * overlap * 0.5;
                ball1.y -= normalY * overlap * 0.5;
                ball2.x += normalX * overlap * 0.5;
                ball2.y += normalY * overlap * 0.5;

                const rvX = ball2.vx - ball1.vx;
                const rvY = ball2.vy - ball1.vy;
                const velAlongNormal = rvX * normalX + rvY * normalY;

                if (velAlongNormal > 0) return false;

                const e = (ball1.restitution + ball2.restitution) * 0.5;
                let j = -(1 + e) * velAlongNormal;
                j /= (1 / ball1.mass) + (1 / ball2.mass);

                const impulseX = j * normalX;
                const impulseY = j * normalY;

                ball1.vx -= impulseX / ball1.mass;
                ball1.vy -= impulseY / ball1.mass;
                ball2.vx += impulseX / ball2.mass;
                ball2.vy += impulseY / ball2.mass;

                const tangentX = -normalY;
                const tangentY = normalX;
                const vt = rvX * tangentX + rvY * tangentY;
                const friction = (ball1.friction + ball2.friction) * 0.5;
                const frictionImpulse = -vt * friction;
                if (Math.abs(velAlongNormal) > 0.01) {
                    ball1.vx -= frictionImpulse * tangentX / ball1.mass;
                    ball1.vy -= frictionImpulse * tangentY / ball1.mass;
                    ball2.vx += frictionImpulse * tangentX / ball2.mass;
                    ball2.vy += frictionImpulse * tangentY / ball2.mass;
                }

                return true;
            }
            return false;
        }

        // REMOVED: handleBallSquareCollision
        // REMOVED: handleSquareSquareCollision

        getClosestPointOnRectangle(circleX, circleY, rectX, rectY, rectWidth, rectHeight) {
            let testX = circleX;
            let testY = circleY;

            if (circleX < rectX) testX = rectX;
            else if (circleX > rectX + rectWidth) testX = rectX + rectWidth;

            if (circleY < rectY) testY = rectY;
            else if (circleY > rectY + rectHeight) testY = rectY + rectHeight;

            return { x: testX, y: testY };
        }

        // REMOVED: handleSquarePlayerCollisions
        // REMOVED: resolveSquarePlayerCollision

        getPlayerPositions() {
            const currentTime = performance.now();
            const players = [];
            if (!drawariaCanvas) return players;

            const canvasRect = drawariaCanvas.getBoundingClientRect();
            const deltaTime = currentTime - this.playerTracker.lastUpdateTime;

            const selfPlayer = document.querySelector('div.spawnedavatar.spawnedavatar-self');
            if (selfPlayer) {
                const rect = selfPlayer.getBoundingClientRect();
                const currentPos = {
                    type: 'self',
                    id: selfPlayer.dataset.playerid || 'self',
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                const prevPlayer = this.playerTracker.players.get('self');
                if (prevPlayer && deltaTime > 0) {
                    currentPos.vx = (currentPos.x - prevPlayer.x) / (deltaTime / 1000);
                    currentPos.vy = (currentPos.y - prevPlayer.y) / (deltaTime / 1000);
                }

                players.push(currentPos);
                this.playerTracker.players.set('self', currentPos);
            }

            const otherPlayers = document.querySelectorAll('div.spawnedavatar.spawnedavatar-otherplayer');
            otherPlayers.forEach((player, index) => {
                const rect = player.getBoundingClientRect();
                const playerId = player.dataset.playerid || `other_${index}`;
                const currentPos = {
                    type: 'other',
                    id: playerId,
                    x: rect.left - canvasRect.left + rect.width / 2,
                    y: rect.top - canvasRect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    radius: Math.max(rect.width, rect.height) / 2,
                    vx: 0,
                    vy: 0
                };

                const prevPlayer = this.playerTracker.players.get(playerId);
                if (prevPlayer && deltaTime > 0) {
                    currentPos.vx = (currentPos.x - prevPlayer.x) / (deltaTime / 1000);
                    currentPos.vy = (currentPos.y - prevPlayer.y) / (deltaTime / 1000);
                }

                players.push(currentPos);
                this.playerTracker.players.set(playerId, currentPos);
            });

            this.playerTracker.lastUpdateTime = currentTime;

            return players.filter(p =>
                p.x >= -this.playerTracker.detectionRadius &&
                p.x <= drawariaCanvas.width + this.playerTracker.detectionRadius &&
                p.y >= -this.playerTracker.detectionRadius &&
                p.y <= drawariaCanvas.height + this.playerTracker.detectionRadius
            );
        }

        handleBallPlayerCollisions() {
            const players = this.getPlayerPositions();
            if (players.length === 0) return;

            this.physicsObjects.forEach(ball => {
                if (ball.type !== 'ball') return;

                players.forEach(player => {
                    const dx = ball.x - player.x;
                    const dy = ball.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const detectionDistance = this.playerTracker.detectionRadius;

                    if (distance < detectionDistance && distance > 0) {
                        const intensity = Math.max(0, (detectionDistance - distance) / detectionDistance);

                        if (distance < ball.radius + player.radius) {
                            this.resolveBallPlayerCollision(ball, player, dx, dy, distance, 'collision');
                        } else if (intensity > 0.3) {
                            this.resolveBallPlayerCollision(ball, player, dx, dy, distance, 'push', intensity);
                        }
                    }
                });
            });
        }

        resolveBallPlayerCollision(ball, player, dx, dy, distance, interactionType = 'collision', intensity = 1.0) {
            const normalX = dx / distance;
            const normalY = dy / distance;

            if (interactionType === 'collision') {
                const overlap = (ball.radius + player.radius) - distance;
                ball.x += normalX * overlap * 1.1;
                ball.y += normalY * overlap * 1.1;

                const relativeVelX = ball.vx - (player.vx || 0);
                const relativeVelY = ball.vy - (player.vy || 0);
                const velAlongNormal = relativeVelX * normalX + relativeVelY * normalY;

                if (velAlongNormal > 0) return;

                const restitution = PHYSICS_CONSTANTS.PLAYER_RESTITUTION;
                const impulse = -(1 + restitution) * velAlongNormal;

                ball.vx += impulse * normalX;
                ball.vy += impulse * normalY;

                if (player.vx || player.vy) {
                    const transferFactor = 0.7;
                    ball.vx += (player.vx || 0) * transferFactor;
                    ball.vy += (player.vy || 0) * transferFactor;
                }

                const additionalForce = PHYSICS_CONSTANTS.PLAYER_INTERACTION_FORCE * 1.5;
                ball.vx += normalX * additionalForce * PHYSICS_CONSTANTS.TIMESTEP;
                ball.vy += normalY * additionalForce * PHYSICS_CONSTANTS.TIMESTEP;

                // Player collision particle effect
                this.particleSystem.explode(player.x, player.y, 15, player.type === 'self' ? '#00ff00' : '#ff6600');

            } else if (interactionType === 'push') {
                const pushForce = PHYSICS_CONSTANTS.PLAYER_INTERACTION_FORCE *
                                 PHYSICS_CONSTANTS.PLAYER_PUSH_MULTIPLIER *
                                 intensity * intensity;

                ball.vx += normalX * pushForce * PHYSICS_CONSTANTS.TIMESTEP;
                ball.vy += normalY * pushForce * PHYSICS_CONSTANTS.TIMESTEP;

                if (player.vx || player.vy) {
                    const playerSpeed = Math.sqrt((player.vx || 0) ** 2 + (player.vy || 0) ** 2);
                    if (playerSpeed > 50) {
                        const moveTransfer = intensity * 0.4;
                        ball.vx += (player.vx || 0) * moveTransfer;
                        ball.vy += (player.vy || 0) * moveTransfer;
                    }
                }

                // Push particle trail
                if (Math.random() < 0.3) {
                    this.particleSystem.trail(ball.x, ball.y, 3, ball.color);
                }
            }

            const maxSpeed = PHYSICS_CONSTANTS.MAX_VELOCITY * 1.2;
            const currentSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
            if (currentSpeed > maxSpeed) {
                ball.vx = (ball.vx / currentSpeed) * maxSpeed;
                ball.vy = (ball.vy / currentSpeed) * maxSpeed;
            }

            this.showPlayerInteractionFeedback(player, ball, interactionType, intensity);
        }

        renderOptimized() {
        //  if (drawariaCtx && drawariaCanvas) {
        //      drawariaCtx.clearRect(0, 0, drawariaCanvas.width, drawariaCanvas.height);
        //  }

            this.physicsObjects.forEach(obj => {
                // Solo renderiza bolas ahora
                if (obj.type !== 'ball') return;

                const dx = Math.abs(obj.x - obj.lastRenderX);
                const dy = Math.abs(obj.y - obj.lastRenderY);

                const needsServerRedraw = this.controls.rainbowModeActive ||
                                          (dx > MOVEMENT_THRESHOLD || dy > MOVEMENT_THRESHOLD);

                if (needsServerRedraw) {
                    // Erase old position
                    if (obj.lastRenderX !== -9999 || obj.lastRenderY !== -9999) {
                        this.drawBall(obj.lastRenderX, obj.lastRenderY, obj.radius, '#FFFFFF');
                    }

                    // Draw at new position
                    this.drawBall(obj.x, obj.y, obj.radius, obj.color);

                    obj.lastRenderX = obj.x;
                    obj.lastRenderY = obj.y;
                }
            });

            // Render particle system
            // this.particleSystem.draw();
        }

        drawBall(x, y, radius, color) {
            const effectiveThickness = radius * 2.5;
            enqueueDrawCommand(x, y, x + 0.1, y + 0.1, color, effectiveThickness);
        }

        // REMOVED: drawFilledSquare

        executeKick() {
            if (this.physicsObjects.size === 0) {
                this.showFeedback('⚠️ Launch physics engine first!', '#ed8936');
                return;
            }

            // Usar valores fijos ya que los sliders han sido eliminados
            const power = 400; // Valor de potencia fijo
            const angle = 0;   // Ángulo fijo (0 grados para patada horizontal)

            const kickForceX = Math.cos(angle * Math.PI / 180) * power * 0.3;
            const kickForceY = Math.sin(angle * Math.PI / 180) * power * 0.3;

            this.physicsObjects.forEach(obj => {
                obj.vx += kickForceX;
                obj.vy += kickForceY;

                // REMOVED: Square rotational kick
            });

            // Kick particle effect
            if (this.canvasElement) {
                this.particleSystem.explode(
                    this.canvasElement.width / 2,
                    this.canvasElement.height / 2,
                    20,
                    '#ed8936'
                );
            }

            console.log(`⚽ Kick executed: Fixed Power=${power}, Angle=${angle}°`);
            this.showFeedback(`⚽ KICK! (Valores Fijos)`, '#ed8936');
        }

        toggleRainbowMode() {
            const toggleRainbowBtn = document.getElementById('rainbow-toggle');
            const colorPicker = document.getElementById('object-color-picker');

            if (!this.controls.rainbowModeActive) {
                this.controls.rainbowModeActive = true;
                if (toggleRainbowBtn) {
                    toggleRainbowBtn.textContent = '🌈 Deactivate Rainbow Mode';
                    toggleRainbowBtn.style.background = 'linear-gradient(135deg, #00bfff, #0080ff)';
                }
                if (colorPicker) colorPicker.disabled = true;
                this.showFeedback('🌈 RAINBOW MODE ACTIVATED!', '#00bfff');

                this.rainbowInterval = setInterval(() => {
                    if (!this.isActive && this.controls.rainbowModeActive) {
                        this.toggleRainbowMode();
                        return;
                    }

                    this.rainbowHue = (this.rainbowHue + 5) % 360;
                    const hslColor = `hsl(${this.rainbowHue}, 100%, 70%)`;

                    this.physicsObjects.forEach(obj => {
                        obj.color = hslColor;
                    });
                }, 100);
            } else {
                this.controls.rainbowModeActive = false;
                if (toggleRainbowBtn) {
                    toggleRainbowBtn.textContent = '🌈 Toggle Rainbow Mode';
                    toggleRainbowBtn.style.background = 'linear-gradient(135deg, #ff00ff, #800080)';
                }
                if (colorPicker) colorPicker.disabled = false;
                this.showFeedback('🌈 RAINBOW MODE DEACTIVATED!', '#ff00ff');

                clearInterval(this.rainbowInterval);

                this.physicsObjects.forEach(obj => {
                    obj.color = this.controls.defaultObjectColor;
                    obj.lastRenderX = -9999;
                    obj.lastRenderY = -9999;
                    // if (obj.type === 'square') obj.lastRenderAngle = -9999; // REMOVED
                });
            }
        }

        /* ---------- PANEL DRAGGABLE FUNCTIONS ---------- */
        makePanelDraggable() {
            const panel = document.getElementById('advanced-physics-panel');
            const header = document.getElementById('panel-header');

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            if (header) {
                // Hacer draggable desde el header
                header.onmousedown = dragMouseDown;
            } else {
                // Hacer draggable desde todo el panel (fallback)
                panel.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // Obtener posición inicial del mouse
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                panel.classList.add('panel-dragging'); // Añadir clase para mejorar UX
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // Calcular nueva posición
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // Establecer nueva posición del panel
                const newTop = panel.offsetTop - pos2;
                const newLeft = panel.offsetLeft - pos1;

                // Limitar a los bordes de la pantalla
                const maxLeft = window.innerWidth - panel.offsetWidth;
                const maxTop = window.innerHeight - panel.offsetHeight;

                panel.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
                panel.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
                panel.style.right = 'auto'; // Quitar posición right fija para que 'left' funcione bien
            }

            function closeDragElement() {
                // Detener el movimiento cuando se suelta el mouse
                document.onmouseup = null;
                document.onmousemove = null;
                panel.classList.remove('panel-dragging'); // Remover clase
            }
        }

        setupPanelButtons() {
            const minimizeBtn = document.getElementById('minimize-btn');
            const closeBtn = document.getElementById('close-btn');
            const content = document.getElementById('panel-content');
            const panel = document.getElementById('advanced-physics-panel');

            let isMinimized = false;

            // BOTÓN MINIMIZAR
            minimizeBtn?.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar activar draggable
                if (!panel) return; // Asegúrate de que el panel existe antes de manipularlo

                if (!isMinimized) {
                    // Minimizar
                    content.style.display = 'none';
                    panel.style.height = 'auto';
                    minimizeBtn.innerHTML = '+';
                    isMinimized = true;
                    this.showFeedback('📱 Panel Minimized', '#00d4ff');
                } else {
                    // Restaurar
                    content.style.display = 'block';
                    panel.style.height = 'auto'; // Ajustar altura para restaurar contenido
                    minimizeBtn.innerHTML = '−';
                    isMinimized = false;
                    this.showFeedback('📱 Panel Restored', '#00d4ff');
                }
            });

            // BOTÓN CERRAR
            closeBtn?.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar activar draggable
                if (!panel) return; // Asegúrate de que el panel existe antes de manipularlo

                if (confirm('¿Estás seguro de que quieres cerrar el panel de física?')) {
                    // Detener motor de física si está activo
                    if (this.isActive) {
                        this.stopPhysics();
                    }

                    // Remover panel
                    panel.remove();

                    this.showFeedback('❌ Physics Panel Closed', '#ff4757');
                    console.log('🔴 Advanced Physics Panel closed by user');
                }
            });

            // Efectos hover para botones
            [minimizeBtn, closeBtn].forEach(btn => {
                if (!btn) return;

                btn.addEventListener('mouseenter', () => {
                    btn.style.opacity = '0.8';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.opacity = '1';
                });
            });
        }

        /* ---------- FIELD CREATION METHODS ---------- */
        calculateFieldCoordinates() {
            const size = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            return {
                leftGoal: {
                    x: Math.floor(size.width * -0.05),
                    y: Math.floor(size.height * 0.67),
                    width: Math.floor(size.width * 0.25), // ← AUMENTA de 0.2 a 0.25 (25% más ancho)
                    height: Math.floor(size.height * 0.42) // ← AUMENTA de 0.36 a 0.42 (17% más alto)
                },
                rightGoal: {
                    x: Math.floor(size.width * 0.80), // ← CAMBIA de 0.85 a 0.80 (para compensar el ancho extra)
                    y: Math.floor(size.height * 0.67),
                    width: Math.floor(size.width * 0.25), // ← AUMENTA de 0.2 a 0.25
                    height: Math.floor(size.height * 0.42) // ← AUMENTA de 0.36 a 0.42
                },
                grass: {
                    y: size.height - 2,
                    triangleSpacing: Math.max(8, Math.floor(size.width * 0.015)),
                    triangleHeight: Math.max(10, Math.floor(size.height * 0.025))
                },
                text: {
                    x: Math.floor(size.width * 0.5),
                    y: Math.floor(size.height * 0.15),
                    pixelSize: Math.max(2, Math.floor(size.width * 0.006))
                }
            };
        }

        async createFootballField() {
            if (this.fieldDrawing.isDrawing) {
                this.showFeedback('⚠️ Field creation already in progress!', '#ed8936');
                return;
            }
            if (!drawariaSocket || !drawariaCanvas || !drawariaCtx) {
                this.showFeedback('❌ Canvas or WebSocket connection not detected!', '#f56565');
                return;
            }

            this.fieldDrawing.isDrawing = true;
            this.fieldDrawing.isStopped = false;
            // No limpiar objetos aquí si la idea es solo redibujar el campo.
            // this.clearAllObjects(false); // REMOVIDO para no borrar las pelotas existentes

            try {
                const coords = this.calculateFieldCoordinates();

                this.showFeedback(`🏟️ Creating field...`, FIELD_CONSTANTS.GOAL_P2_COLOR);
                await sleep(500);

                await this.cleanCanvas(); // Limpiar todo el canvas antes de dibujar el campo

                this.showFeedback("🏟️ Drawing grass...", FIELD_CONSTANTS.GRASS_COLOR);
                await this.drawGrass(coords);
                await sleep(300);

                this.showFeedback("⚽ Drawing goals...", FIELD_CONSTANTS.GOAL_P2_COLOR);
                await this.drawGoal(coords.leftGoal);
                await this.drawGoal(coords.rightGoal);
                await sleep(300);

                this.showFeedback("🎮 Drawing 'FOOTBALL' text...", FIELD_CONSTANTS.TEXT_COLOR);
                await this.drawBlackPixelText("FOOTBALL", coords);
                await sleep(300);

                this.showFeedback("🏆 FIELD CREATION COMPLETE! 🎯", "#006400");

                // Add field creation particle effect
                this.particleSystem.explode(drawariaCanvas.width / 2, drawariaCanvas.height / 4, 25, '#228B22');

            } catch (error) {
                console.error("Error creating field:", error);
                this.showFeedback(`❌ Error: ${error.message}`, "#B22222");
            } finally {
                this.fieldDrawing.isDrawing = false;
            }
        }

        async drawLineLocalAndServer(startX, startY, endX, endY, color, thickness, delay = 60) {
            if (this.fieldDrawing.isStopped) {
                this.fieldDrawing.isDrawing = false;
                return;
            }
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            startX = clamp(startX, -100, canvasSize.width + 100);
            startY = clamp(startY, 0, canvasSize.height);
            endX = clamp(endX, -100, canvasSize.width + 100);
            endY = clamp(endY, 0, canvasSize.height);
            enqueueDrawCommand(startX, startY, endX, endY, color, thickness);
            await sleep(delay);
        }

        async drawPixel(x, y, color, size = 2) {
            if (this.fieldDrawing.isStopped) return;
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            x = clamp(x, 0, canvasSize.width - size);
            y = clamp(y, 0, canvasSize.height - size);
            enqueueDrawCommand(x, y, x + 1, y + 1, color, size);
            await sleep(20);
        }

        async drawGrass(coords) {
            if (this.fieldDrawing.isStopped) return;
            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
            const lineThickness = Math.max(4, Math.floor(canvasSize.width * 0.01));
            await this.drawLineLocalAndServer(0, coords.grass.y, canvasSize.width, coords.grass.y, FIELD_CONSTANTS.GRASS_COLOR, lineThickness, 60);
            for (let x = 0; x < canvasSize.width; x += coords.grass.triangleSpacing) {
                if (this.fieldDrawing.isStopped) break;
                const height = coords.grass.triangleHeight + (Math.random() * 6 - 3);
                const tipX = x + (Math.random() * 4 - 2);
                const tipY = coords.grass.y - height;
                await this.drawLineLocalAndServer(x, coords.grass.y, tipX, tipY, FIELD_CONSTANTS.GRASS_COLOR, 2, 25);
                await this.drawLineLocalAndServer(tipX, tipY, x + coords.grass.triangleSpacing, coords.grass.y, FIELD_CONSTANTS.GRASS_COLOR, 2, 25);
            }
        }

        async drawGoal(goalCoords) {
            if (this.fieldDrawing.isStopped || !drawariaCanvas) return;
            const frameThickness = FIELD_CONSTANTS.GOAL_THICKNESS;
            const lineThickness = Math.max(1, Math.floor(FIELD_CONSTANTS.GOAL_THICKNESS/2));
            const lineMargin = Math.max(8, goalCoords.width * 0.08);
            const topOffset = goalCoords.height * 0.05;

            await this.drawLineLocalAndServer(goalCoords.x, goalCoords.y, goalCoords.x, goalCoords.y + goalCoords.height, FIELD_CONSTANTS.GOAL_P2_COLOR, frameThickness, 80);
            await this.drawLineLocalAndServer(goalCoords.x, goalCoords.y, goalCoords.x + goalCoords.width, goalCoords.y, FIELD_CONSTANTS.GOAL_P2_COLOR, frameThickness, 80);
            await this.drawLineLocalAndServer(goalCoords.x + goalCoords.width, goalCoords.y, goalCoords.x + goalCoords.width, goalCoords.y + goalCoords.height, FIELD_CONSTANTS.GOAL_P2_COLOR, frameThickness, 80);
            await sleep(100);

            for (let i = 1; i <= 3; i++) {
                const x = goalCoords.x + (goalCoords.width * i / 4);
                await this.drawLineLocalAndServer(x, goalCoords.y + topOffset, x, goalCoords.y + goalCoords.height - topOffset, FIELD_CONSTANTS.GOAL_P2_COLOR, lineThickness, 60);
            }

            for (let i = 1; i <= 4; i++) {
                const y = goalCoords.y + (goalCoords.height * i / 5);
                await this.drawLineLocalAndServer(goalCoords.x + lineMargin, y, goalCoords.x + goalCoords.width - lineMargin, y, FIELD_CONSTANTS.GOAL_P2_COLOR, lineThickness, 60);
            }
        }

        PIXEL_LETTERS = {
            'F': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0]],
            'O': [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]],
            'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
            'B': [[1,1,1,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,1,1,1]],
            'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1]],
            'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1]]
        };

        async drawBlackPixelText(text, coords) {
            if (this.fieldDrawing.isStopped) return;
            const letterSpacing = coords.text.pixelSize * 6;
            const textWidth = text.length * letterSpacing;
            let currentX = coords.text.x - (textWidth / 2);

            for (let i = 0; i < text.length; i++) {
                if (this.fieldDrawing.isStopped) break;
                const letter = text[i].toUpperCase();
                if (letter === ' ') { currentX += letterSpacing; continue; }
                const pattern = this.PIXEL_LETTERS[letter];
                if (!pattern) continue;

                for (let row = 0; row < pattern.length; row++) {
                    for (let col = 0; col < pattern[row].length; col++) {
                        if (pattern[row][col] === 1) {
                            const pixelX = currentX + (col * coords.text.pixelSize);
                            const pixelY = coords.text.y + (row * coords.text.pixelSize);
                            const canvasSize = { width: drawariaCanvas.width, height: drawariaCanvas.height };
                            if (pixelX >= 0 && pixelX < canvasSize.width && pixelY >= 0 && pixelY < canvasSize.height) {
                                await this.drawPixel(pixelX, pixelY, FIELD_CONSTANTS.TEXT_COLOR, coords.text.pixelSize);
                            }
                        }
                    }
                }
                currentX += letterSpacing;
                await sleep(50);
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
            setTimeout(() => feedback.style.opacity = '1', 10);
            setTimeout(() => feedback.style.opacity = '0', 1500);
            setTimeout(() => feedback.remove(), 1800);
        }

        showPlayerInteractionFeedback(player, obj, interactionType, intensity = 1.0) {
            console.log(`⚽ ${interactionType} with ${player.type} player: ${player.id} (intensity: ${intensity.toFixed(2)})`);

            if (this.controls.showDebug && drawariaCanvas) {
                const canvasRect = drawariaCanvas.getBoundingClientRect();
                const feedback = document.createElement('div');

                const size = Math.max(15, 25 * intensity);
                const color = interactionType === 'collision' ?
                             (player.type === 'self' ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 102, 0, 0.9)') :
                             (player.type === 'self' ? 'rgba(0, 200, 255, 0.7)' : 'rgba(255, 200, 0, 0.7)');

                feedback.style.cssText = `
                    position: fixed;
                    left: ${player.x + canvasRect.left - size/2}px;
                    top: ${player.y + canvasRect.top - size/2}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 2147483648;
                    animation: ${interactionType === 'collision' ? 'bounce-effect' : 'pulse-effect'} 0.4s ease-out;
                `;
                document.body.appendChild(feedback);
                setTimeout(() => feedback.remove(), 400);
            }
        }
    }

    /* ---------- GLOBAL INITIALIZATION ---------- */
    let advancedEngine = null;

    const initAdvancedPhysicsEngine = () => {
        if (!advancedEngine) {
            console.log('🎮 Initializing Advanced Drawaria Physics Engine v5.1...');
            advancedEngine = new AdvancedDrawariaPhysics();

            setTimeout(() => {
                const confirmMsg = document.createElement('div');
                confirmMsg.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(45deg, #ffd700, #ffb347);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 15px;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 2147483648;
                    text-align: center;
                    box-shadow: 0 0 30px rgba(255,215,0,0.5);
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                `;
                confirmMsg.innerHTML = '🏆 PHYSICS ENGINE v5.1 LOADED!<br><span style="font-size: 12px;">Match Mode • Only Balls • Fixed Kick • DVD Mode • Color Picker • Panel Draggable</span>';

              //document.body.appendChild(confirmMsg);
                setTimeout(() => confirmMsg.style.opacity = '1', 10);
                setTimeout(() => confirmMsg.style.opacity = '0', 3000);
                setTimeout(() => confirmMsg.remove(), 3300);
            }, 1000);
        }
    };

    // Enhanced CSS animations
    const advancedStyle = document.createElement('style');
    advancedStyle.textContent = `
        @keyframes bounce-effect {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }

        @keyframes pulse-effect {
            0% { transform: scale(0.5); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 0.6; }
            100% { transform: scale(0); opacity: 0; }
        }

        .toggle-btn[data-active="true"] {
            box-shadow: 0 0 15px rgba(108, 92, 231, 0.6) !important;
        }

        .mode-toggle[data-active="true"] {
            box-shadow: 0 0 15px rgba(108, 92, 231, 0.6) !important;
        }

        /* CSS adicional para panel draggable */
        #advanced-physics-panel {
            /* Para asegurar que el \`top\` y \`left\` se apliquen correctamente */
            transition: none !important;
        }

        #panel-header:hover {
            background: linear-gradient(45deg, #0099cc, #0080aa) !important;
        }

        #minimize-btn:hover {
            background: rgba(255,255,255,0.4) !important;
        }

        #close-btn:hover {
            background: rgba(255,0,0,0.8) !important;
        }

        .panel-dragging {
            user-select: none !important;
            pointer-events: none !important; /* Evita que el mouse interactúe con el contenido mientras arrastras */
            opacity: 0.9; /* Pequeña opacidad para indicar arrastre */
        }
    `;
    document.head.appendChild(advancedStyle);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdvancedPhysicsEngine);
    } else {
        initAdvancedPhysicsEngine();
    }
    setTimeout(initAdvancedPhysicsEngine, 2000);

    console.log('🌌 Advanced Drawaria Physics Engine v5.0 with Particle System loaded successfully! 🌌');
})();