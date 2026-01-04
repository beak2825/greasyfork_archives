// ==UserScript==
// @name         Drawaria Layer Animation System
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Adds a layer-based animation system to Drawaria, create and manage multiple drawing layers with PokeAPI integration
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @match        *://*.drawaria.online/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/546120/Drawaria%20Layer%20Animation%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/546120/Drawaria%20Layer%20Animation%20System.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class RealLayerAnimationSystem {
        constructor() {
            this.layers = [{ commands: [], visible: true, name: 'Layer 1' }];
            this.currentLayer = 0;
            this.isDrawing = false;
            this.lastX = 0;
            this.lastY = 0;
            this.isAnimating = false;
            this.animationSpeed = 50;

            this.isLoopEnabled = false;

            // Nueva variable para controlar la calidad de importación
            this.highQualityImport = false;
            this.pixelProcessingStep = 2;
            this.targetImageResolution = 100;

            this.gameCanvas = null;
            this.gameCtx = null;
            this.previewCanvas = null;
            this.previewCtx = null;

            this.gameSocket = null;
            this.onionOpacity = 0.3;
            this.menuVisible = false;

            this.init();
        }

        init() {
            this.captureGameWebSocket();
            this.waitForGameCanvas();
            this.createCompactInterface();
            this.setupEventListeners();
        }

        // ... [mantengo todos los métodos existentes sin cambios hasta setupEventListeners]

        captureGameWebSocket() {
            const originalSend = WebSocket.prototype.send;
            WebSocket.prototype.send = function (...args) {
                if (!this.url || !this.url.includes('drawaria')) {
                    return originalSend.apply(this, args);
                }

                if (!window.layerAnimationSocket) {
                    window.layerAnimationSocket = this;
                    console.log('✅ WebSocket capturado para Layer Animation');
                }

                return originalSend.apply(this, args);
            };

            const checkExisting = () => {
                if (window.layerAnimationSocket && window.layerAnimationSocket.readyState === 1) {
                    this.gameSocket = window.layerAnimationSocket;
                    this.updateSocketStatus();
                    return;
                }
                setTimeout(checkExisting, 1000);
            };
            checkExisting();
        }

        sendRealDrawCommand(x1, y1, x2, y2, color, thickness) {
            if (!this.gameSocket || this.gameSocket.readyState !== 1) return false;

            const normX1 = (x1 / this.gameCanvas.width).toFixed(4);
            const normY1 = (y1 / this.gameCanvas.height).toFixed(4);
            const normX2 = (x2 / this.gameCanvas.width).toFixed(4);
            const normY2 = (y2 / this.gameCanvas.height).toFixed(4);

            const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;

            try {
                this.gameSocket.send(command);
                return true;
            } catch (error) {
                console.error('Error enviando comando:', error);
                return false;
            }
        }

        waitForGameCanvas() {
            const checkCanvas = () => {
                this.gameCanvas = document.getElementById('canvas');
                if (this.gameCanvas) {
                    this.gameCtx = this.gameCanvas.getContext('2d');
                    this.setupPreviewCanvas();
                } else {
                    setTimeout(checkCanvas, 100);
                }
            };
            checkCanvas();
        }

        setupPreviewCanvas() {
            this.previewCanvas = document.createElement('canvas');
            this.previewCtx = this.previewCanvas.getContext('2d');
            this.previewCanvas.width = 220;
            this.previewCanvas.height = 160;
            this.previewCanvas.id = 'layerPreviewCanvas';

            this.previewCtx.lineCap = 'round';
            this.previewCtx.lineJoin = 'round';
        }

        createCompactInterface() {
            const html = `
                <!-- Toggle Button -->
                <div id="layerToggleBtn" class="layer-toggle">🎬</div>

                <!-- Compact Panel -->
                <div id="layerCompactPanel" class="layer-compact-panel">
                    <div class="compact-header">
                        Layer Animator <span id="socketIndicator">⚫</span>
                    </div>

                    <div class="compact-canvas">
                        <div id="previewContainer"></div>
                    </div>

                    <div class="compact-controls">
                        <div class="layer-nav-compact">
                            <button id="prevLayer">◀</button>
                            <span id="layerInfo">1/1</span>
                            <button id="nextLayer">▶</button>
                        </div>

                        <div class="layer-actions-compact">
                            <button id="addLayer" title="Add Layer">➕</button>
                            <button id="removeLayer" title="Remove Layer">➖</button>
                            <button id="clearLayer" title="Clear Layer">🗑️</button>
                            <button id="duplicateLayer" title="Duplicate Layer">📋</button>
                            <button id="toggleLoopBtn" title="Toggle Loop Animation">🔄</button>
                            <button id="toggleQualityBtn" title="Toggle High Quality Image Import">⭐</button>
                            <button id="importImageBtn" title="Import Image(s)">🏞️</button>
                            <button id="loadPokemonBtn" title="Load Random Pokemon Pixel Art">🎮</button>
                            <input type="file" id="imageFileInput" multiple accept="image/*" style="display: none;">
                        </div>
                    </div>

                    <div class="onion-compact">
                        <label><input type="checkbox" id="onionToggle" checked> Onion</label>
                        <input type="range" id="onionRange" min="10" max="100" value="30">
                    </div>

                    <div class="animation-compact">
                        <button id="playBtn" class="play-btn-compact">▶️ PLAY</button>
                        <button id="stopBtn" class="stop-btn-compact" disabled>⏹️ STOP</button>

                        <div class="speed-compact">
                            <label class="speed-label">Speed: <span id="speedValue">18</span>ms</label>
                            <input type="range" id="speedRange" min="3" max="500" value="18" class="speed-slider">
                        </div>
                    </div>

                    <div class="layer-list-compact" id="layerListCompact"></div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', html);

            const container = document.getElementById('previewContainer');
            if (container && this.previewCanvas) {
                container.appendChild(this.previewCanvas);
            }

            this.addCompactStyles();
            this.updateLayerList();
            this.updateOnionSkin();
            this.updateSocketStatus();
            this.updateLoopButtonState();
            this.updateQualityButtonState();
        }

        addCompactStyles() {
            const css = `
                .layer-toggle {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(45deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                }

                .layer-toggle:hover {
                    transform: scale(1.1);
                }

                .layer-compact-panel {
                    position: fixed;
                    top: 60px;
                    right: 10px;
                    width: 260px;
                    background: linear-gradient(145deg, #2a2a2a, #1e1e1e);
                    border: 2px solid #4CAF50;
                    border-radius: 10px;
                    padding: 12px;
                    z-index: 9999;
                    font-family: 'Arial', sans-serif;
                    color: #fff;
                    font-size: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    display: none;
                }

                .compact-header {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #4CAF50;
                    border-bottom: 1px solid #444;
                    padding-bottom: 5px;
                }

                .compact-canvas {
                    margin-bottom: 10px;
                }

                #layerPreviewCanvas {
                    width: 100%;
                    height: 120px;
                    border: 2px solid #555;
                    border-radius: 5px;
                    background: white;
                    cursor: crosshair;
                    display: block;
                }

                .compact-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 10px;
                }

                .layer-nav-compact {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                }

                .layer-nav-compact button {
                    background: #4CAF50;
                    border: none;
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                }

                .layer-nav-compact button:hover:not(:disabled) {
                    background: #45a049;
                }

                .layer-nav-compact button:disabled {
                    background: #666;
                    cursor: not-allowed;
                }

                #layerInfo {
                    background: #333;
                    padding: 6px 12px;
                    border-radius: 4px;
                    min-width: 50px;
                    text-align: center;
                    font-size: 11px;
                    font-weight: bold;
                }

                .layer-actions-compact {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 6px;
                }

                .layer-actions-compact button {
                    background: #555;
                    border: none;
                    color: white;
                    padding: 6px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                    min-width: 30px;
                    text-align: center;
                }

                .layer-actions-compact button:hover:not(:disabled) {
                    background: #777;
                    transform: scale(1.05);
                }

                .layer-actions-compact button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                #toggleLoopBtn.active, #toggleQualityBtn.active {
                    background: linear-gradient(45deg, #FFD700, #DAA520);
                    color: #333;
                }

                #loadPokemonBtn {
                    background: linear-gradient(45deg, #FF6B35, #F7931E);
                    color: white;
                    animation: pokemonGlow 2s infinite alternate;
                }

                #loadPokemonBtn:hover:not(:disabled) {
                    background: linear-gradient(45deg, #F7931E, #FF6B35);
                    transform: scale(1.1);
                }

                @keyframes pokemonGlow {
                    0% { box-shadow: 0 0 5px rgba(255,107,53,0.5); }
                    100% { box-shadow: 0 0 15px rgba(255,107,53,0.8); }
                }

                .onion-compact {
                    background: #333;
                    padding: 8px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .onion-compact label {
                    font-size: 11px;
                }

                .onion-compact input[type="range"] {
                    width: 70px;
                }

                .animation-compact {
                    margin-bottom: 10px;
                }

                .play-btn-compact, .stop-btn-compact {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 8px;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .play-btn-compact {
                    background: linear-gradient(45deg, #4CAF50, #45a049);
                    color: white;
                }

                .stop-btn-compact {
                    background: linear-gradient(45deg, #f44336, #da190b);
                    color: white;
                }

                .play-btn-compact:hover:not(:disabled) {
                    transform: scale(1.02);
                }

                .stop-btn-compact:hover:not(:disabled) {
                    transform: scale(1.02);
                }

                .play-btn-compact:disabled, .stop-btn-compact:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .speed-compact {
                    background: #444;
                    padding: 8px;
                    border-radius: 5px;
                    text-align: center;
                }

                .speed-label {
                    display: block;
                    font-size: 11px;
                    margin-bottom: 5px;
                    color: #ccc;
                }

                .speed-slider {
                    width: 100%;
                    height: 4px;
                    background: #666;
                    outline: none;
                    border-radius: 2px;
                    cursor: pointer;
                }

                .speed-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #4CAF50;
                    border-radius: 50%;
                    cursor: pointer;
                }

                .speed-slider::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #4CAF50;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                }

                #speedValue {
                    font-weight: bold;
                    color: #4CAF50;
                }

                .layer-list-compact {
                    max-height: 120px;
                    overflow-y: auto;
                    background: #2a2a2a;
                    border-radius: 5px;
                    padding: 4px;
                }

                .layer-item-compact {
                    padding: 5px 8px;
                    border-bottom: 1px solid #444;
                    cursor: pointer;
                    font-size: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 3px;
                    transition: background 0.2s;
                }

                .layer-item-compact:hover {
                    background: #3a3a3a;
                }

                .layer-item-compact.active {
                    background: #4CAF50;
                    color: white;
                    font-weight: bold;
                }

                .layer-item-compact.has-content {
                    border-left: 3px solid #4CAF50;
                }

                .layer-visibility-compact {
                    cursor: pointer;
                    padding: 2px 4px;
                    border-radius: 2px;
                    background: #555;
                    font-size: 10px;
                }

                #socketIndicator.connected {
                    color: #4CAF50;
                }

                #socketIndicator.disconnected {
                    color: #f44336;
                }

                .layer-list-compact::-webkit-scrollbar {
                    width: 5px;
                }

                .layer-list-compact::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-radius: 2px;
                }

                .layer-list-compact::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 2px;
                }

                .layer-list-compact::-webkit-scrollbar-thumb:hover {
                    background: #777;
                }

                .pokemon-loading {
                    animation: pokemonSpin 1s linear infinite;
                }

                @keyframes pokemonSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;

            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }

        setupEventListeners() {
            document.getElementById('layerToggleBtn').addEventListener('click', () => this.togglePanel());

            this.setupCanvasDrawing();

            document.getElementById('prevLayer').addEventListener('click', () => this.previousLayer());
            document.getElementById('nextLayer').addEventListener('click', () => this.nextLayer());

            document.getElementById('addLayer').addEventListener('click', () => this.addLayer());
            document.getElementById('removeLayer').addEventListener('click', () => this.removeLayer());
            document.getElementById('clearLayer').addEventListener('click', () => this.clearCurrentLayer());
            document.getElementById('duplicateLayer').addEventListener('click', () => this.duplicateCurrentLayer());

            document.getElementById('toggleLoopBtn').addEventListener('click', () => this.toggleLoop());
            document.getElementById('importImageBtn').addEventListener('click', () => this.importImages());
            document.getElementById('imageFileInput').addEventListener('change', (e) => this.handleImageFiles(e.target.files));
            document.getElementById('toggleQualityBtn').addEventListener('click', () => this.toggleQuality());

            // Nuevo evento para el botón de Pokémon
            document.getElementById('loadPokemonBtn').addEventListener('click', () => this.loadRandomPokemon());

            document.getElementById('onionToggle').addEventListener('change', () => this.updateOnionSkin());
            document.getElementById('onionRange').addEventListener('input', (e) => {
                this.onionOpacity = e.target.value / 100;
                this.updateOnionSkin();
            });

            document.getElementById('playBtn').addEventListener('click', () => this.playRealAnimation());
            document.getElementById('stopBtn').addEventListener('click', () => this.stopAnimation());

            document.getElementById('speedRange').addEventListener('input', (e) => {
                this.animationSpeed = parseInt(e.target.value);
                document.getElementById('speedValue').textContent = this.animationSpeed;
            });
        }

        // Nueva función para cargar Pokémon aleatorio usando PokeAPI
        async loadRandomPokemon() {
            const pokemonBtn = document.getElementById('loadPokemonBtn');

            if (this.isAnimating) {
                console.log('No se puede cargar Pokémon durante la animación.');
                return;
            }

            // Animación de loading
            pokemonBtn.classList.add('pokemon-loading');
            pokemonBtn.disabled = true;

            try {
                // Generar ID aleatorio entre 1 y 1010 (cantidad aproximada de Pokémon en PokeAPI)
                const randomId = Math.floor(Math.random() * 1010) + 1;
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const pokemonData = await response.json();
                const spriteUrl = pokemonData.sprites.front_default;

                if (!spriteUrl) {
                    throw new Error('No sprite disponible para este Pokémon');
                }

                console.log(`🎮 Cargando ${pokemonData.name.toUpperCase()} (ID: ${pokemonData.id})`);

                // Crear nueva imagen y procesarla
                const img = new Image();
                img.crossOrigin = 'anonymous';

                img.onload = async () => {
                    try {
                        const newCommands = await this.processImageToCommands(img);
                        if (newCommands.length > 0) {
                            // Crear nueva capa para el Pokémon
                            this.addLayer();
                            this.layers[this.currentLayer].name = `🎮 ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}`;
                            this.layers[this.currentLayer].commands = newCommands;

                            console.log(`✅ ${pokemonData.name.toUpperCase()} importado exitosamente a la Capa ${this.currentLayer + 1}. Comandos: ${newCommands.length}`);
                            this.updateUI();
                        } else {
                            console.warn(`❌ No se pudieron generar comandos para ${pokemonData.name}`);
                        }
                    } catch (error) {
                        console.error('Error al procesar el sprite del Pokémon:', error);
                    } finally {
                        // Restaurar estado del botón
                        pokemonBtn.classList.remove('pokemon-loading');
                        pokemonBtn.disabled = false;
                    }
                };

                img.onerror = () => {
                    console.error(`❌ No se pudo cargar el sprite de ${pokemonData.name}`);
                    pokemonBtn.classList.remove('pokemon-loading');
                    pokemonBtn.disabled = false;
                };

                img.src = spriteUrl;

            } catch (error) {
                console.error('Error al cargar Pokémon desde PokeAPI:', error);
                pokemonBtn.classList.remove('pokemon-loading');
                pokemonBtn.disabled = false;
            }
        }

        // ... [resto de los métodos permanecen igual]

        togglePanel() {
            const panel = document.getElementById('layerCompactPanel');
            this.menuVisible = !this.menuVisible;
            panel.style.display = this.menuVisible ? 'block' : 'none';
        }

        setupCanvasDrawing() {
            if (!this.previewCanvas) return;

            this.previewCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.previewCanvas.addEventListener('mousemove', (e) => this.draw(e));
            this.previewCanvas.addEventListener('mouseup', () => this.stopDrawing());
            this.previewCanvas.addEventListener('mouseout', () => this.stopDrawing());
        }

        getMousePos(e) {
            const rect = this.previewCanvas.getBoundingClientRect();
            const scaleX = this.previewCanvas.width / rect.width;
            const scaleY = this.previewCanvas.height / rect.height;

            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }

        startDrawing(e) {
            this.isDrawing = true;
            const pos = this.getMousePos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
        }

        draw(e) {
            if (!this.isDrawing) return;

            const pos = this.getMousePos(e);
            const command = {
                type: 'line',
                x1: this.lastX,
                y1: this.lastY,
                x2: pos.x,
                y2: pos.y,
                color: this.getCurrentColor(),
                thickness: this.getCurrentThickness()
            };

            this.layers[this.currentLayer].commands.push(command);
            this.drawCommand(this.previewCtx, command);

            this.lastX = pos.x;
            this.lastY = pos.y;
            this.updateLayerList();
        }

        stopDrawing() {
            this.isDrawing = false;
        }

        getCurrentColor() {
            const colorPicker = document.querySelector('input[type="color"]');
            return colorPicker ? colorPicker.value : '#000000';
        }

        getCurrentThickness() {
            const thicknessPicker = document.querySelector('input[type="range"]');
            return thicknessPicker ? parseInt(thicknessPicker.value) : 5;
        }

        drawCommand(ctx, command) {
            if (command.type === 'line') {
                ctx.strokeStyle = command.color;
                ctx.lineWidth = command.thickness;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(command.x1, command.y1);
                ctx.lineTo(command.x2, command.y2);
                ctx.stroke();
            }
        }

        async playRealAnimation() {
            if (!this.gameCanvas || !this.gameSocket || this.isAnimating) {
                console.log('Canvas o WebSocket no disponible o animación ya en curso.');
                return;
            }

            this.isAnimating = true;
            document.getElementById('playBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            this.disableLayerControls(true);

            do {
                await this.clearRealCanvas();
                await this.delay(300);

                for (let layerIndex = 0; layerIndex < this.layers.length && this.isAnimating; layerIndex++) {
                    const layer = this.layers[layerIndex];
                    if (!layer.visible || layer.commands.length === 0) continue;

                    if (layerIndex > 0) {
                        await this.clearRealCanvas();
                        await this.delay(200);
                    }

                    for (let i = 0; i < layer.commands.length && this.isAnimating; i++) {
                        const command = layer.commands[i];
                        await this.executeRealCommand(command);
                        await this.delay(this.animationSpeed);
                    }

                    if (this.isAnimating && layerIndex < this.layers.length - 1) {
                        await this.delay(300);
                    }
                }

                if (this.isAnimating && this.isLoopEnabled) {
                    await this.delay(500);
                }

            } while (this.isAnimating && this.isLoopEnabled);

            this.stopAnimation();
        }

        async executeRealCommand(command) {
            if (!this.gameCanvas || !this.gameSocket) return;

            const scaleX = this.gameCanvas.width / this.previewCanvas.width;
            const scaleY = this.gameCanvas.height / this.previewCanvas.height;

            const gameX1 = command.x1 * scaleX;
            const gameY1 = command.y1 * scaleY;
            const gameX2 = command.x2 * scaleX;
            const gameY2 = command.y2 * scaleY;

            this.gameCtx.strokeStyle = command.color;
            this.gameCtx.lineWidth = command.thickness + 5;
            this.gameCtx.lineCap = 'round';
            this.gameCtx.beginPath();
            this.gameCtx.moveTo(gameX1, gameY1);
            this.gameCtx.lineTo(gameX2, gameY2);
            this.gameCtx.stroke();

            const success = this.sendRealDrawCommand(
                gameX1, gameY1, gameX2, gameY2,
                command.color, command.thickness
            );

            if (!success) {
                console.log('Error enviando comando real');
            }
        }

        async clearRealCanvas() {
            if (!this.gameSocket || !this.gameCtx || !this.gameCanvas) return;

            this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

            try {
                const clearThickness = Math.max(this.gameCanvas.width, this.gameCanvas.height) * 0.8;
                const clearColor = '#ffffff';

                const steps = 3;
                for (let i = 0; i < steps; i++) {
                    const y = (i / (steps - 1)) * this.gameCanvas.height;
                    const success = this.sendRealDrawCommand(
                        0, y,
                        this.gameCanvas.width, y,
                        clearColor, clearThickness
                    );

                    if (success) {
                        await this.delay(10);
                    }
                }
            } catch (error) {
                console.error('Error limpiando canvas real:', error);
            }
        }

        updateSocketStatus() {
            const indicator = document.getElementById('socketIndicator');
            if (!indicator) return;

            if (this.gameSocket && this.gameSocket.readyState === 1) {
                indicator.textContent = '🟢';
                indicator.className = 'connected';
            } else {
                indicator.textContent = '🔴';
                indicator.className = 'disconnected';
            }

            setTimeout(() => this.updateSocketStatus(), 3000);
        }

        stopAnimation() {
            this.isAnimating = false;
            document.getElementById('playBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            this.disableLayerControls(false);
        }

        disableLayerControls(disable) {
            document.getElementById('prevLayer').disabled = disable;
            document.getElementById('nextLayer').disabled = disable;
            document.getElementById('addLayer').disabled = disable;
            document.getElementById('removeLayer').disabled = disable;
            document.getElementById('clearLayer').disabled = disable;
            document.getElementById('duplicateLayer').disabled = disable;
            document.getElementById('toggleLoopBtn').disabled = disable;
            document.getElementById('importImageBtn').disabled = disable;
            document.getElementById('toggleQualityBtn').disabled = disable;
            document.getElementById('loadPokemonBtn').disabled = disable; // Nuevo control
            document.getElementById('onionToggle').disabled = disable;
            document.getElementById('onionRange').disabled = disable;
            document.getElementById('speedRange').disabled = disable;
        }

        addLayer() {
            this.layers.push({ commands: [], visible: true, name: `Layer ${this.layers.length + 1}` });
            this.currentLayer = this.layers.length - 1;
            this.updateUI();
            console.log(`Capa ${this.currentLayer + 1} agregada.`);
        }

        removeLayer() {
            if (this.layers.length <= 1) {
                console.log('No se puede eliminar la última capa.');
                return;
            }
            if (this.currentLayer === this.layers.length - 1) {
                this.currentLayer = Math.max(0, this.currentLayer - 1);
            }
            this.layers.splice(this.currentLayer, 1);
            this.updateUI();
            console.log(`Capa eliminada. Capas restantes: ${this.layers.length}`);
        }

        previousLayer() {
            if (this.currentLayer > 0) {
                this.currentLayer--;
                this.updateUI();
            }
        }

        nextLayer() {
            if (this.currentLayer < this.layers.length - 1) {
                this.currentLayer++;
                this.updateUI();
            }
        }

        clearCurrentLayer() {
            this.layers[this.currentLayer].commands = [];
            this.updateOnionSkin();
            this.updateLayerList();
            console.log(`Capa ${this.currentLayer + 1} limpiada.`);
        }

        duplicateCurrentLayer() {
            const duplicated = {
                commands: [...this.layers[this.currentLayer].commands],
                visible: true,
                name: `${this.layers[this.currentLayer].name} Copy`
            };
            this.layers.push(duplicated);
            this.currentLayer = this.layers.length - 1;
            this.updateUI();
            console.log(`Capa ${this.currentLayer + 1} duplicada.`);
        }

        toggleLoop() {
            this.isLoopEnabled = !this.isLoopEnabled;
            this.updateLoopButtonState();
            console.log(`Modo de bucle: ${this.isLoopEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
        }

        updateLoopButtonState() {
            const loopBtn = document.getElementById('toggleLoopBtn');
            if (loopBtn) {
                if (this.isLoopEnabled) {
                    loopBtn.classList.add('active');
                } else {
                    loopBtn.classList.remove('active');
                }
            }
        }

        toggleQuality() {
            this.highQualityImport = !this.highQualityImport;
            this.pixelProcessingStep = this.highQualityImport ? 1 : 2;
            this.targetImageResolution = this.highQualityImport ? 150 : 100;
            this.updateQualityButtonState();
            console.log(`Calidad de importación de imagen: ${this.highQualityImport ? 'ALTA' : 'NORMAL'} (paso de píxel: ${this.pixelProcessingStep}, resolución: ${this.targetImageResolution}x${this.targetImageResolution})`);
        }

        updateQualityButtonState() {
            const qualityBtn = document.getElementById('toggleQualityBtn');
            if (qualityBtn) {
                if (this.highQualityImport) {
                    qualityBtn.classList.add('active');
                } else {
                    qualityBtn.classList.remove('active');
                }
            }
        }

        importImages() {
            document.getElementById('imageFileInput').click();
        }

        async handleImageFiles(files) {
            if (files.length === 0) return;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    console.warn(`El archivo ${file.name} no es una imagen, se omitirá.`);
                    continue;
                }

                console.log(`Procesando imagen: ${file.name}`);
                const reader = new FileReader();

                reader.onload = async (e) => {
                    const img = new Image();
                    img.onload = async () => {
                        try {
                            const newCommands = await this.processImageToCommands(img);
                            if (newCommands.length > 0) {
                                this.addLayer();
                                this.layers[this.currentLayer].name = `Image Layer (${file.name.substring(0,15)}...)`;
                                this.layers[this.currentLayer].commands = newCommands;
                                console.log(`Imagen "${file.name}" importada a la Capa ${this.currentLayer + 1}. Comandos generados: ${newCommands.length}`);
                                this.updateUI();
                            } else {
                                console.warn(`No se pudieron generar comandos de dibujo para la imagen "${file.name}".`);
                            }
                        } catch (error) {
                            console.error('Error al procesar la imagen:', error);
                        }
                    };
                    img.onerror = () => {
                        console.error(`No se pudo cargar la imagen: ${file.name}`);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }

        async processImageToCommands(img) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            const maxWidth = this.targetImageResolution;
            const maxHeight = this.targetImageResolution;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            tempCanvas.width = width;
            tempCanvas.height = height;

            tempCtx.imageSmoothingEnabled = this.highQualityImport;
            tempCtx.imageSmoothingQuality = this.highQualityImport ? 'high' : 'medium';

            tempCtx.drawImage(img, 0, 0, width, height);

            const imageData = tempCtx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const commands = [];
            const previewWidth = this.previewCanvas.width;
            const previewHeight = this.previewCanvas.height;

            const currentPixelStep = this.pixelProcessingStep;
            const baseThickness = currentPixelStep;

            for (let y = 0; y < height; y += currentPixelStep) {
                let currentSegment = null;

                for (let x = 0; x < width; x += currentPixelStep) {
                    const i = (y * width + x) * 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    if (a < 50) {
                        if (currentSegment) {
                            const color = currentSegment.color;
                            commands.push({
                                type: 'line',
                                x1: (currentSegment.startX / width) * previewWidth,
                                y1: (y / height) * previewHeight,
                                x2: (x / width) * previewWidth,
                                y2: (y / height) * previewHeight,
                                color: color,
                                thickness: baseThickness
                            });
                            currentSegment = null;
                        }
                        continue;
                    }

                    const currentColor = `rgb(${r},${g},${b})`;

                    if (currentSegment === null) {
                        currentSegment = { startX: x, color: currentColor };
                    } else if (currentSegment.color !== currentColor) {
                        commands.push({
                            type: 'line',
                            x1: (currentSegment.startX / width) * previewWidth,
                            y1: (y / height) * previewHeight,
                            x2: (x / width) * previewWidth,
                            y2: (y / height) * previewHeight,
                            color: currentSegment.color,
                            thickness: baseThickness
                        });
                        currentSegment = { startX: x, color: currentColor };
                    }
                }

                if (currentSegment) {
                    commands.push({
                        type: 'line',
                        x1: (currentSegment.startX / width) * previewWidth,
                        y1: (y / height) * previewHeight,
                        x2: (width / width) * previewWidth,
                        y2: (y / height) * previewHeight,
                        color: currentSegment.color,
                        thickness: baseThickness
                    });
                }
            }

            return commands;
        }

        updateUI() {
            this.updateLayerInfo();
            this.updateOnionSkin();
            this.updateLayerList();
            this.updateButtonStates();
            this.updateLoopButtonState();
            this.updateQualityButtonState();
        }

        updateLayerInfo() {
            const info = document.getElementById('layerInfo');
            if (info) {
                info.textContent = `${this.currentLayer + 1}/${this.layers.length}`;
            }
        }

        updateButtonStates() {
            const prevBtn = document.getElementById('prevLayer');
            const nextBtn = document.getElementById('nextLayer');
            const removeBtn = document.getElementById('removeLayer');
            const addBtn = document.getElementById('addLayer');

            if (prevBtn) prevBtn.disabled = this.currentLayer === 0 || this.isAnimating;
            if (nextBtn) nextBtn.disabled = this.currentLayer === this.layers.length - 1 || this.isAnimating;
            if (removeBtn) removeBtn.disabled = this.layers.length <= 1 || this.isAnimating;
            if (addBtn) addBtn.disabled = this.isAnimating;

            document.getElementById('clearLayer').disabled = this.isAnimating;
            document.getElementById('duplicateLayer').disabled = this.isAnimating;
            document.getElementById('importImageBtn').disabled = this.isAnimating;
            document.getElementById('toggleQualityBtn').disabled = this.isAnimating;
            document.getElementById('loadPokemonBtn').disabled = this.isAnimating;
        }

        updateOnionSkin() {
            if (!this.previewCtx) return;

            this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            const showOnion = document.getElementById('onionToggle')?.checked;

            if (showOnion) {
                if (this.currentLayer > 0) {
                    this.previewCtx.globalAlpha = this.onionOpacity;
                    this.layers[this.currentLayer - 1].commands.forEach(command => {
                        this.drawCommand(this.previewCtx, {...command, color: '#ff6b6b'});
                    });
                }

                if (this.currentLayer < this.layers.length - 1) {
                    this.previewCtx.globalAlpha = this.onionOpacity;
                    this.layers[this.currentLayer + 1].commands.forEach(command => {
                        this.drawCommand(this.previewCtx, {...command, color: '#6bb6ff'});
                    });
                }
            }

            this.previewCtx.globalAlpha = 1;
            this.layers[this.currentLayer].commands.forEach(command => {
                this.drawCommand(this.previewCtx, command);
            });
        }

        updateLayerList() {
            const container = document.getElementById('layerListCompact');
            if (!container) return;

            container.innerHTML = '';

            this.layers.forEach((layer, index) => {
                const item = document.createElement('div');
                item.className = `layer-item-compact ${index === this.currentLayer ? 'active' : ''} ${layer.commands.length > 0 ? 'has-content' : ''}`;

                item.innerHTML = `
                    <span>${layer.name || `L${index + 1}`} (${layer.commands.length})</span>
                    <span class="layer-visibility-compact" data-layer="${index}">${layer.visible ? '👁️' : '🚫'}</span>
                `;

                item.addEventListener('click', (e) => {
                    if (this.isAnimating) return;
                    if (e.target.classList.contains('layer-visibility-compact')) {
                        this.layers[index].visible = !this.layers[index].visible;
                        this.updateLayerList();
                    } else {
                        this.currentLayer = index;
                        this.updateUI();
                    }
                });

                container.appendChild(item);
            });
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new RealLayerAnimationSystem(), 3000);
        });
    } else {
        setTimeout(() => new RealLayerAnimationSystem(), 3000);
    }
})();
