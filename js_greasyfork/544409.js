// ==UserScript==
// @name Drawaria fetched from JSON Animation
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Animates characters on Drawaria.online canvas with optimized drawing commands, fetched from JSON, and precisely centered on the canvas. Supports multiple animations and a delay between loops.
// @author YouTubeDrawaria
// @match https://drawaria.online/*
// @grant none
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/544409/Drawaria%20fetched%20from%20JSON%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/544409/Drawaria%20fetched%20from%20JSON%20Animation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SPACE_INVADER_ANIMATION_JSON_URL = "https://raw.githubusercontent.com/NuevoMundoOficial/DrawariaASCIIPacks/main/spaceinvaders-videogames_drawaria_animation.json";
    const MARIO_ANIMATION_JSON_URL = "https://raw.githubusercontent.com/NuevoMundoOficial/DrawariaASCIIPacks/main/mario_drawaria_animation.json";
    const SONIC_ANIMATION_JSON_URL = "https://raw.githubusercontent.com/NuevoMundoOficial/DrawariaASCIIPacks/main/sonic_drawaria_animation.json";
    const DEFAULT_ANIMATION_DISPLAY_SIZE_PX = 30;
    const LOOPS_BEFORE_PAUSE = 1;
    const PAUSE_DURATION_MS = 10000;
    const COMMANDS_PER_CHUNK = 50;
    const CHUNK_DELAY_MS = 10;

    // --- GLOBAL SHARED WEBSOCKET HOOKING SYSTEM ---
    const _activeSockets = window._drawariaActiveSockets || [];
    if (!window._drawariaActiveSockets) {
        window._drawariaActiveSockets = _activeSockets;
        const _originalWebSocketSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function (...args) {
            if (_activeSockets.indexOf(this) === -1) {
                _activeSockets.push(this);
                this.addEventListener('close', () => {
                    const index = _activeSockets.indexOf(this);
                    if (index > -1) {
                        _activeSockets.splice(index, 1);
                    }
                });
            }
            return _originalWebSocketSend.apply(this, args);
        };
    }

    function _getGameSocket() {
        return _activeSockets.find(s => s.url.includes("drawaria.online/socket.io") && s.readyState === WebSocket.OPEN);
    }

    function _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function _clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function _sendAndRenderDrawCmd(canvas, ctx, start_norm, end_norm, color, thickness_game_units, isEraser = false) {
        const gameSocket = _getGameSocket();
        if (!gameSocket || gameSocket.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket no conectado. No se puede enviar ni renderizar el comando de dibujo.");
            return false;
        }
        const p1x_norm = _clamp(start_norm[0], 0, 1);
        const p1y_norm = _clamp(start_norm[1], 0, 1);
        const p2x_norm = _clamp(end_norm[0], 0, 1);
        const p2y_norm = _clamp(end_norm[1], 0, 1);
        let numThickness = parseFloat(thickness_game_units);
        if (isNaN(numThickness)) { numThickness = 5; }

        ctx.strokeStyle = color;
        ctx.lineWidth = numThickness * (canvas.width / 100);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
        }
        ctx.beginPath();
        ctx.moveTo(p1x_norm * canvas.width, p1y_norm * canvas.height);
        ctx.lineTo(p2x_norm * canvas.width, p2y_norm * canvas.height);
        ctx.stroke();
        if (isEraser) {
            ctx.globalCompositeOperation = 'source-over';
        }

        const gT = isEraser ? numThickness : 0 - numThickness;
        gameSocket.send(`42["drawcmd",0,[${p1x_norm.toFixed(4)},${p1y_norm.toFixed(4)},${p2x_norm.toFixed(4)},${p2y_norm.toFixed(4)},${isEraser},${gT},"${color}",0,0,{}]]`);
        return true;
    }

    async function _clearCanvas(canvas, ctx, messageCallback) {
        const gameSocket = _getGameSocket();
        if (!gameSocket || gameSocket.readyState !== WebSocket.OPEN) {
            messageCallback("warning", "No hay conexión al juego para limpiar el lienzo.");
            return;
        }

        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        gameSocket.send(`42["drawcmd",0,[0.5,0.5,0.5,0.5,true,-2000,"#FFFFFF",0,0,{}]]`);
        messageCallback("success", "Lienzo limpiado para todos.");
        await _delay(100);
    }

    function makeDraggable(element, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragHandle = header || element;
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    class DrawariaAnimator {
        constructor() {
            this._currentAnimationType = 'spaceInvader';
            this._animationJsonUrl = this._getAnimationUrlByType(this._currentAnimationType);
            this._defaultAnimationDisplaySizePx = DEFAULT_ANIMATION_DISPLAY_SIZE_PX;
            this._mainCanvas = null;
            this._mainCtx = null;
            this._animationFrames = [];
            this._animationMetadata = {};
            this._currentFrameIndex = 0;
            this._animationTimeoutId = null;
            this._loopCount = 0;
            this._isActive = false;
            this._isAnimating = false;
            this._ui = {};
            this._notificationTimeout = null;
            this._init();
        }

        _getAnimationUrlByType(type) {
            switch (type) {
                case 'spaceInvader':
                    return SPACE_INVADER_ANIMATION_JSON_URL;
                case 'mario':
                    return MARIO_ANIMATION_JSON_URL;
                case 'sonic':
                    return SONIC_ANIMATION_JSON_URL;
                default:
                    return SPACE_INVADER_ANIMATION_JSON_URL;
            }
        }

        _init() {
            const checkCanvas = () => {
                this._mainCanvas = document.getElementById('canvas');
                if (this._mainCanvas) {
                    this._mainCtx = this._mainCanvas.getContext('2d');
                    this._setupUI();
                    this._loadAnimationData();
                    this._updateUIState();
                    this._notify("info", "Image Animator cargado.");
                } else {
                    setTimeout(checkCanvas, 500);
                }
            };
            checkCanvas();
        }

        _setupUI() {
            this._ui.mainContainer = document.createElement('div');
            this._ui.mainContainer.id = 'image-animator-menu';
            this._ui.mainContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                width: 250px;
                background: #2b2b2b;
                border: 1px solid #444;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                font-family: Arial, sans-serif;
                color: #f0f0f0;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                user-select: none;
            `;
            document.body.appendChild(this._ui.mainContainer);

            this._ui.header = document.createElement('div');
            this._ui.header.style.cssText = `
                padding: 10px;
                background: #3c3c3c;
                border-bottom: 1px solid #555;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                font-weight: bold;
                cursor: grab;
                text-align: center;
            `;
            this._ui.header.textContent = "Drawaria Animator";
            this._ui.mainContainer.appendChild(this._ui.header);
            makeDraggable(this._ui.mainContainer, this._ui.header);

            this._ui.content = document.createElement('div');
            this._ui.content.style.cssText = `
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            `;
            this._ui.mainContainer.appendChild(this._ui.content);

            this._ui.moduleToggleButton = this._createButton('toggle-module-btn-invader', '<i class="fas fa-power-off"></i> Activar Animador', 'info');
            this._ui.moduleToggleButton.addEventListener('click', () => this._toggleModuleActive());
            this._ui.content.appendChild(this._ui.moduleToggleButton);

            this._ui.imagePreview = document.createElement('img');
            this._ui.imagePreview.id = 'imagePreview';
            this._ui.imagePreview.style.cssText = "width:60px;height:60px; margin: 10px auto; display: block;";
            this._ui.content.appendChild(this._ui.imagePreview);

            this._ui.prevAnimButton = this._createButton('prev-anim-btn', '<i class="fas fa-step-backward"></i> Anterior', 'info');
            this._ui.prevAnimButton.addEventListener('click', () => this._prevAnimation());
            this._ui.content.appendChild(this._ui.prevAnimButton);

            this._ui.nextAnimButton = this._createButton('next-anim-btn', '<i class="fas fa-step-forward"></i> Siguiente', 'info');
            this._ui.nextAnimButton.addEventListener('click', () => this._nextAnimation());
            this._ui.content.appendChild(this._ui.nextAnimButton);

            this._ui.speedInput = this._createInput('number', 50, 2500, 2500);
            this._ui.content.appendChild(this._createFormGroup("Velocidad (ms/frame):", this._ui.speedInput));

            this._ui.brushSizeInput = this._createInput('number', 1, 100, 40);
            this._ui.content.appendChild(this._createFormGroup("Grosor del Pincel (1-100):", this._ui.brushSizeInput));

            const btnGroup1 = document.createElement('div');
            btnGroup1.style.cssText = "display: flex; gap: 5px;";
            this._ui.startButton = this._createButton('start-anim-btn', '<i class="fas fa-play"></i> Iniciar Animación', 'success');
            this._ui.startButton.addEventListener('click', () => this._startAnimation());
            this._ui.stopButton = this._createButton('stop-anim-btn', '<i class="fas fa-stop"></i> Detener Animación', 'danger');
            this._ui.stopButton.addEventListener('click', () => this._stopAnimation());
            btnGroup1.append(this._ui.startButton, this._ui.stopButton);
            this._ui.content.appendChild(btnGroup1);

            this._ui.clearCanvasButton = this._createButton('clear-canvas-btn', 'Limpiar Lienzo', 'warning');
            this._ui.clearCanvasButton.title = "Limpia el lienzo con una línea blanca muy grande.";
            this._ui.clearCanvasButton.addEventListener('click', () => {
                _clearCanvas(this._mainCanvas, this._mainCtx, this._notify.bind(this));
            });
            this._ui.content.appendChild(this._ui.clearCanvasButton);

            this._ui.statusDisplay = document.createElement('div');
            this._ui.statusDisplay.style.cssText = "text-align:center; margin-top:10px; font-size:0.9em; color:#aaffaa;";
            this._ui.mainContainer.appendChild(this._ui.statusDisplay);
        }

        _createButton(id, html, type) {
            const button = document.createElement('button');
            button.id = id;
            button.innerHTML = html;
            button.style.cssText = `
                flex: 1; padding: 8px; border: none; border-radius: 4px;
                color: white; font-weight: bold; cursor: pointer;
                transition: background-color 0.2s;
                background: ${type === 'success' ? '#28a745' :
                            type === 'danger' ? '#dc3545' :
                            type === 'warning' ? '#ffc107' :
                            type === 'info' ? '#17a2b8' : '#6c757d'};
            `;
            button.onmouseover = () => button.style.backgroundColor = (type === 'success' ? '#218838' :
                                                                       type === 'danger' ? '#c82333' :
                                                                       type === 'warning' ? '#e0a800' :
                                                                       type === 'info' ? '#138496' : '#5a6268');
            button.onmouseout = () => button.style.backgroundColor = (type === 'success' ? '#28a745' :
                                                                      type === 'danger' ? '#dc3545' :
                                                                      type === 'warning' ? '#e0a800' :
                                                                      type === 'info' ? '#138496' : '#5a6268');
            return button;
        }

        _createInput(type, min, max, value) {
            const input = document.createElement('input');
            input.type = type;
            input.min = min;
            input.max = max;
            input.value = value;
            input.style.cssText = `
                width: 100%; padding: 6px; border: 1px solid #555; border-radius: 4px;
                background: #3c3c3c; color: #f0f0f0; box-sizing: border-box;
            `;
            return input;
        }

        _createFormGroup(labelText, inputElement) {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.cssText = "font-size:0.9em; color:#bbb;";
            div.append(label, inputElement);
            return div;
        }

        _toggleModuleActive() {
            this._isActive = !this._isActive;
            this._updateUIState();
            if (this._isActive) {
                this._notify("info", "Image Animator ACTIVADO.");
            } else {
                this._notify("info", "Image Animator DESACTIVADO.");
                if (this._isAnimating) {
                    this._stopAnimation();
                }
            }
        }

        _updateUIState() {
            const isConnected = _getGameSocket() !== null;
            const hasFrames = this._animationFrames.length > 0;
            this._ui.moduleToggleButton.innerHTML = this._isActive ? '<i class="fas fa-power-off"></i> Desactivar Animador' : '<i class="fas fa-power-off"></i> Activar Animador';
            this._ui.moduleToggleButton.classList.toggle('active', this._isActive);
            this._ui.startButton.disabled = !this._isActive || this._isAnimating || !isConnected || !hasFrames;
            this._ui.stopButton.disabled = !this._isAnimating;
            this._ui.speedInput.disabled = !this._isActive || this._isAnimating;
            this._ui.brushSizeInput.disabled = !this._isActive || this._isAnimating;
            this._ui.clearCanvasButton.disabled = !this._isActive || !isConnected || this._isAnimating;
            this._ui.prevAnimButton.disabled = this._isAnimating || !this._isActive;
            this._ui.nextAnimButton.disabled = this._isAnimating || !this._isActive;
            this._ui.statusDisplay.textContent = isConnected ? (this._isActive ? (this._isAnimating ? "Estado: Animando..." : "Estado: Listo.") : "Estado: Módulo Inactivo.") : "Estado: No conectado al juego. Conéctate a una sala primero.";
        }

        _notify(type, message) {
            if (this._notificationTimeout) {
                clearTimeout(this._notificationTimeout);
            }
            const statusColor = type === 'success' ? '#aaffaa' : type === 'info' ? '#aaddff' : type === 'warning' ? '#ffccaa' : '#ffaaaa';
            this._ui.statusDisplay.style.color = statusColor;
            this._ui.statusDisplay.textContent = `Estado: ${message}`;
            this._notificationTimeout = setTimeout(() => {
                this._ui.statusDisplay.style.color = '#aaffaa';
                this._ui.statusDisplay.textContent = _getGameSocket() ? (this._isActive ? (this._isAnimating ? "Animando..." : "Listo.") : "Módulo Inactivo.") : "No conectado al juego. Conéctate a una sala primero.";
            }, 3000);
        }

        _prevAnimation() {
            if (this._isAnimating) {
                this._notify("warning", "Detén la animación antes de cambiar de fuente.");
                return;
            }

            const animations = ['spaceInvader', 'mario', 'sonic'];
            const currentIndex = animations.indexOf(this._currentAnimationType);
            const prevIndex = (currentIndex - 1 + animations.length) % animations.length;
            this._currentAnimationType = animations[prevIndex];
            this._animationJsonUrl = this._getAnimationUrlByType(this._currentAnimationType);
            this._updateImagePreview();
            this._updateUIState();
            this._loadAnimationData();
            this._notify("info", `Cargada animación: ${this._currentAnimationType}`);
        }

        _nextAnimation() {
            if (this._isAnimating) {
                this._notify("warning", "Detén la animación antes de cambiar de fuente.");
                return;
            }

            const animations = ['spaceInvader', 'mario', 'sonic'];
            const currentIndex = animations.indexOf(this._currentAnimationType);
            const nextIndex = (currentIndex + 1) % animations.length;
            this._currentAnimationType = animations[nextIndex];
            this._animationJsonUrl = this._getAnimationUrlByType(this._currentAnimationType);
            this._updateImagePreview();
            this._updateUIState();
            this._loadAnimationData();
            this._notify("info", `Cargada animación: ${this._currentAnimationType}`);
        }

        _updateImagePreview() {
            switch (this._currentAnimationType) {
                case 'spaceInvader':
                    this._ui.imagePreview.src = "https://www.space-invaders.com/static/img/icons/icon.png";
                    break;
                case 'mario':
                    this._ui.imagePreview.src = "https://static.wikia.nocookie.net/fantendo/images/0/0e/NES_Mario.jpg";
                    break;
                case 'sonic':
                    this._ui.imagePreview.src = "https://www.sonicthehedgehog.com/wp-content/uploads/2021/08/sonic-animated.gif";
                    break;
            }
        }

        async _loadAnimationData() {
            this._notify("info", `Cargando datos de animación (${this._currentAnimationType})...`);
            try {
                const response = await fetch(this._animationJsonUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.frames || !Array.isArray(data.frames) || data.frames.length === 0) {
                    throw new Error("Formato de datos de animación JSON inválido o vacío.");
                }
                this._animationFrames = data.frames;
                this._animationMetadata = data.metadata || {};
                this._notify("success", `Datos de animación cargados: ${this._animationFrames.length} frames.`);
                this._updateUIState();
            } catch (error) {
                this._notify("error", `Error al cargar datos de animación: ${error.message}.`);
                console.error("Error loading animation data:", error);
                this._animationFrames = [];
                this._animationMetadata = {};
                this._updateUIState();
            }
        }

        _startAnimation() {
            if (this._isAnimating) return;
            if (this._animationFrames.length === 0) {
                this._notify("warning", "No hay frames cargados para animar.");
                return;
            }
            if (!_getGameSocket()) {
                this._notify("error", "No conectado al juego. Conéctate a una sala primero.");
                return;
            }
            this._isAnimating = true;
            this._currentFrameIndex = 0;
            this._loopCount = 0;
            this._updateUIState();
            this._notify("info", `Iniciando animación ${this._currentAnimationType}...`);
            _clearCanvas(this._mainCanvas, this._mainCtx, this._notify.bind(this)).then(() => {
                this._animateLoop();
            });
        }

        _stopAnimation() {
            this._isAnimating = false;
            if (this._animationTimeoutId) {
                clearTimeout(this._animationTimeoutId);
                this._animationTimeoutId = null;
            }
            this._updateUIState();
            this._notify("info", "Animación detenida.");
        }

        async _animateLoop() {
            if (!this._isAnimating) return;

            const gameSocket = _getGameSocket();
            if (!gameSocket || gameSocket.readyState !== WebSocket.OPEN) {
                console.warn("WebSocket no conectado. Esperando reconexión para la animación...");
                this._animationTimeoutId = setTimeout(() => this._animateLoop(), 500);
                return;
            }

            const frameDelay = parseInt(this._ui.speedInput.value);
            const brushThickness = parseInt(this._ui.brushSizeInput.value);
            const currentFrameCommands = this._animationFrames[this._currentFrameIndex];

            const animWidthGameUnits = this._animationMetadata.width || this._defaultAnimationDisplaySizePx;
            const animHeightGameUnits = this._animationMetadata.height || this._defaultAnimationDisplaySizePx;

            const animWidthFraction = animWidthGameUnits / 100;
            const animHeightFraction = animHeightGameUnits / 100;

            const offsetXForCentering = (1 - animWidthFraction) / 2;
            const offsetYForCentering = (1 - animHeightFraction) / 2;

            const centerXOfAnimArea = offsetXForCentering + (animWidthFraction / 2);
            const centerYOfAnimArea = offsetYForCentering + (animHeightFraction / 2);

            _sendAndRenderDrawCmd(
                this._mainCanvas, this._mainCtx,
                [centerXOfAnimArea, centerYOfAnimArea],
                [centerXOfAnimArea, centerYOfAnimArea],
                '#FFFFFF',
                Math.max(animWidthGameUnits, animHeightGameUnits) * 1.2,
                true
            );

            await _delay(30);

            for (let i = 0; i < currentFrameCommands.length; i++) {
                if (!this._isAnimating) break;
                const cmd = currentFrameCommands[i];

                const p1x_final = (cmd.start_norm[0] * animWidthFraction) + offsetXForCentering;
                const p1y_final = (cmd.start_norm[1] * animHeightFraction) + offsetYForCentering;
                const p2x_final = (cmd.end_norm[0] * animWidthFraction) + offsetXForCentering;
                const p2y_final = (cmd.end_norm[1] * animHeightFraction) + offsetYForCentering;

                _sendAndRenderDrawCmd(
                    this._mainCanvas, this._mainCtx,
                    [p1x_final, p1y_final],
                    [p2x_final, p2y_final],
                    cmd.color,
                    brushThickness
                );

                if ((i + 1) % COMMANDS_PER_CHUNK === 0) {
                    await _delay(CHUNK_DELAY_MS);
                    if (!this._isAnimating) break;
                }
            }

            this._currentFrameIndex = (this._currentFrameIndex + 1) % this._animationFrames.length;

            if (this._currentFrameIndex === 0) {
                this._loopCount++;
                if (this._loopCount >= LOOPS_BEFORE_PAUSE) {
                    this._notify("info", `Pausa de ${PAUSE_DURATION_MS / 1000} segundos para aliviar el servidor.`);
                    this._stopAnimation();
                    setTimeout(() => {
                        this._startAnimation();
                    }, PAUSE_DURATION_MS);
                    return;
                }
            }

            this._animationTimeoutId = setTimeout(() => this._animateLoop(), frameDelay);
        }
    }

    window.addEventListener('load', () => {
        new DrawariaAnimator();
    });
})();
