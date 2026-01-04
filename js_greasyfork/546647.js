// ==UserScript==
// @name         Drawaria Avatar Physics Platformer🏃
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  This will allow you to move your avatar in the room like a videogame, you will need to see it other screen.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @include      https://drawaria.online*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546647/Drawaria%20Avatar%20Physics%20Platformer%F0%9F%8F%83.user.js
// @updateURL https://update.greasyfork.org/scripts/546647/Drawaria%20Avatar%20Physics%20Platformer%F0%9F%8F%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables for canvas and socket.
    let drawariaCanvas = null;
    let drawariaCtx = null;
    let drawariaSocket = null;
    let menuControllerInstance = null;

    // Hook into WebSocket to capture the game's socket at the earliest opportunity
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured by early hook.');
        }
        return originalWebSocketSend.apply(this, args);
    };

    // === Utility Functions ===
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // === Drawing Functions (now checks for drawariaCanvas internally) ===
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        // Ensure socket and canvas are ready for drawing commands
        if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN || !drawariaCanvas) {
            return;
        }
        const normX1 = (x1 / drawariaCanvas.width).toFixed(4);
        const normY1 = (y1 / drawariaCanvas.height).toFixed(4);
        const normX2 = (x2 / drawariaCanvas.width).toFixed(4);
        const normY2 = (y2 / drawariaCanvas.height).toFixed(4);
        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${0 - thickness},"${color}",0,0,{}]]`;
        drawariaSocket.send(command);
    }

    async function drawLine(startX, startY, endX, endY, color = '#000000', thickness = 2) {
        sendDrawCommand(startX, startY, endX, endY, color, thickness);
        await sleep(10);
    }

    async function drawRectangle(x, y, width, height, color = '#000000', thickness = 2) {
        await drawLine(x, y, x + width, y, color, thickness);
        await drawLine(x + width, y, x + width, y + height, color, thickness);
        await drawLine(x + width, y + height, x, y + height, color, thickness);
        await drawLine(x, y + height, x, y, color, thickness);
    }

    async function drawCircle(centerX, centerY, radius, color = '#000000', thickness = 2, segments = 24) {
        const angleStep = (Math.PI * 2) / segments;
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = (i + 1) * angleStep;
            const x1 = centerX + Math.cos(angle1) * radius;
            const y1 = centerY + Math.sin(angle1) * radius;
            const x2 = centerX + Math.cos(angle2) * radius;
            const y2 = centerY + Math.sin(angle2) * radius;
            await drawLine(x1, y1, x2, y2, color, thickness);
        }
    }

    // === Nuevas Definiciones Globales de Colores y Hitbox Types ===

    // Colores estándar en formato HEX y RGB
    const STANDARD_COLORS = {
        black: { hex: '#000000', r: 0, g: 0, b: 0 },
        white: { hex: '#ffffff', r: 255, g: 255, b: 255 },
        gray: { hex: '#7F7F7F', r: 127, g: 127, b: 127 },
        red: { hex: '#ff0000', r: 255, g: 0, b: 0 },
        green: { hex: '#00ff00', r: 0, g: 255, b: 0 },
        blue: { hex: '#0000ff', r: 0, g: 0, b: 255 },
        celeste: { hex: '#93cfff', r: 147, g: 207, b: 255 },
        yellow: { hex: '#ffff00', r: 255, g: 255, b: 0 },
        orange: { hex: '#ff9300', r: 255, g: 147, b: 0 },
        violet: { hex: '#7f007f', r: 127, g: 0, b: 127 },
        light_pink: { hex: '#ffbfff', r: 255, g: 191, b: 223 }, // Rosa claro
        brown: { hex: '#7f3f00', r: 127, g: 63, b: 0 }
    };

    // Definición de los tipos de hitbox y sus propiedades por defecto
    const DEFAULT_HITBOX_TYPES = {
        solid: { name: 'Tocable', colorKey: 'black', type: 'solid', description: 'Plataformas sólidas' },
        bounce: { name: 'Rebote', colorKey: 'yellow', type: 'bounce', description: 'Te hace rebotar' },
        speed_boost: { name: 'Más Velocidad', colorKey: 'red', type: 'speed_boost', description: 'Aumenta tu velocidad' },
        water: { name: 'Nadar', colorKey: 'blue', type: 'water', description: 'Permite nadar' },
        anti_gravity: { name: 'Gravedad Arriba', colorKey: 'green', type: 'anti_gravity', description: 'Invierte la gravedad' },
        normal_gravity: { name: 'Gravedad Normal', colorKey: 'light_pink', type: 'normal_gravity', description: 'Restablece la gravedad' },
        push_back: { name: 'Empuje Atrás', colorKey: 'violet', type: 'push_back', description: 'Te empuja en la dirección opuesta' }
    };

    // Función de ayuda para convertir HEX a RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }


    // ===============================
    // SISTEMA DE FÍSICA Y AVATAR
    // ===============================
    class Vector2D {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
        add(vector) { return new Vector2D(this.x + vector.x, this.y + vector.y); }
        subtract(vector) { return new Vector2D(this.x - vector.x, this.y - vector.y); }
        multiply(scalar) { return new Vector2D(this.x * scalar, this.y * scalar); }
        magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
        normalize() { const mag = this.magnitude(); return mag > 0 ? new Vector2D(this.x / mag, this.y / mag) : new Vector2D(0, 0); }
        copy() { return new Vector2D(this.x, this.y); }
    }

    class PhysicsAvatar {
        constructor() {
            // position.y represents the BOTTOM of the avatar in 0-100 game coords (100 is floor)
            this.position = new Vector2D(50, 100);
            this.velocity = new Vector2D(0, 0);
            this.mass = 1.0;
            this.friction = 0.1;
            this.jumpForce = 20;
            this.moveForce = 15;
            this.gravity = 0.8;
            this.onGround = false;
            this.keys = {};

            // Dynamic avatar dimensions in game units (0-100 scale)
            this.avatarDimensions = { width: 0, height: 0 };

            // Physics states
            this.isPhysicsActive = false; // Controlled by menu
            this.isSwimming = false;
            this.lastBounceSurface = 0; // To prevent infinite bounces

            // Specific Drawaria DOM selectors for avatar and game area
            this.gameAreaSelectors = [
                "#drawing-assistant-overlay", // Priorizar el canvas overlay
                "#gamearea",
                "#canvas",
                "body"
            ];
            this.myAvatarSelector = "body > div.spawnedavatar.spawnedavatar-self";
            this.myAvatarElement = null; // Actual DOM element of the avatar
            this.gameAreaElement = null; // Actual DOM element of the game area
            this.overlayCanvas = null; // Referencia específica al canvas overlay

            this.lastSentPosition = { x: -1, y: -1 };

            // Altura de la barra de UI inferior (en píxeles)
            this.bottomUIOffsetPx = 0;
            // Offset de píxeles visual controlado por el usuario para el suelo
            this.visualFloorOffsetPixels = 45; // PREDETERMINADO A 5 PÍXELES MÁS ARRIBA

            // NUEVO: Sistema de límites inteligente
            this.boundaryManager = null;

            // Reinicializar Interaction colors (RGB) con los nuevos tipos y colores por defecto
            this.surfaceColors = {}; // Se llenará en el constructor de PhysicsMenuController o con setHitboxColors

            // NUEVAS PROPIEDADES PARA EFECTOS DE FÍSICA
            this.originalGravity = this.gravity; // Guarda la gravedad inicial
            this.isAntiGravityActive = false;
            this.isSpeedBoostActive = false;
            this.currentSpeedBoostFactor = 1.0;
            this.pushBackForce = 20; // Fuerza del empuje hacia atrás
            this.speedBoostDuration = 1000; // Duración del speed boost en ms
            this.speedBoostTimeout = null;

            // AGREGAR AnimationShield
            this.animationShield = null; // Se inicializa al detectar el avatar

            this.setupInput();
            this.startAvatarDetection(); // Continuously detect avatar DOM element & sync position (passively)
            console.log('🎮 PhysicsAvatar created. Physics are DEACTIVATED by default. Click "Iniciar Física".');
        }

        setupInput() {
            // Specific controls: Alt+Z (Left), Alt+C (Right), Alt+X (Jump)
            document.addEventListener('keydown', (e) => {
                if (!this.isPhysicsActive) return;

                if (e.altKey && e.code === 'KeyZ') {
                    e.preventDefault();
                    this.keys['left'] = true;
                }
                if (e.altKey && e.code === 'KeyC') {
                    e.preventDefault();
                    this.keys['right'] = true;
                }
                if (e.altKey && e.code === 'KeyX') {
                    e.preventDefault();
                    this.keys['jump'] = true;
                }
            });

            document.addEventListener('keyup', (e) => {
                if (!this.isPhysicsActive) return;

                if (e.altKey && e.code === 'KeyZ') {
                    this.keys['left'] = false;
                }
                if (e.altKey && e.code === 'KeyC') {
                    this.keys['right'] = false;
                }
                if (e.altKey && e.code === 'KeyX') {
                    this.keys['jump'] = false;
                }
            });
        }

        // Nueva función para detectar específicamente el canvas overlay
        detectOverlayCanvas() {
            const overlayCanvas = document.getElementById('drawing-assistant-overlay');
            if (overlayCanvas) {
                this.overlayCanvas = overlayCanvas;
                console.log('🎯 Canvas overlay detectado:', {
                    width: overlayCanvas.width,
                    height: overlayCanvas.height,
                    styleWidth: overlayCanvas.style.width,
                    styleHeight: overlayCanvas.style.height
                });
                return true;
            }
            return false;
        }

        // Contenido del bucle de detección (extraído para claridad)
        _detectionLoopContent() {
            // Try to find avatar element
            if (!this.myAvatarElement) {
                const selectors = [
                    "body > div.spawnedavatar.spawnedavatar-self",
                    ".spawnedavatar-self",
                    "[class*='avatar'][class*='self']",
                    ".avatar.self"
                ];

                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        this.myAvatarElement = element;
                        console.log(`🎯 Avatar encontrado con selector: ${selector}`);
                        // Inicializar AnimationShield cuando se encuentra el avatar
                        if (!this.animationShield) {
                            this.animationShield = new AnimationShield(this);
                            console.log('🛡️ AnimationShield inicializado');
                        }
                        break;
                    }
                }
            }

            // Detectar canvas overlay específicamente
            if (!this.overlayCanvas) {
                this.detectOverlayCanvas();
            }

            // Try to find the best game area reference element (PRIORIZAR OVERLAY)
            if (!this.gameAreaElement) {
                for (const selector of this.gameAreaSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        this.gameAreaElement = element;
                        console.log(`🎮 Game area detectada: ${selector}`);
                        break; // Salir después de encontrar el mejor elemento
                    }
                }
            }

            // Si todos los elementos críticos están listos, inicializar BoundaryManager
            if (this.myAvatarElement && this.gameAreaElement && this.overlayCanvas && !this.boundaryManager) {
                this.boundaryManager = new BoundaryManager(this);
                console.log('📐 BoundaryManager inicializado');
            }


            // Detectar la altura de la UI inferior
            if (this.gameAreaElement) {
                // Selectores más específicos para barras de UI comunes
                const hotbarElement = document.querySelector('.hotbar, #colorpickercontainer, .inputcontainer, [class*="chat-input-row"], [class*="drawing-hotbar"]');
                if (hotbarElement) {
                    this.bottomUIOffsetPx = hotbarElement.offsetHeight > 0 ? hotbarElement.offsetHeight : 0;
                } else {
                    this.bottomUIOffsetPx = 0;
                }
            }


            // If elements are found and physics is NOT active, update position from DOM passively
            if (this.myAvatarElement && this.gameAreaElement && !this.isPhysicsActive) {
                this.updatePositionFromDOM(true);
            }
        }

        // Continuously try to find the avatar element and game area reference
        startAvatarDetection() {
            this.detectionInterval = setInterval(() => this._detectionLoopContent(), 50); // Llama al contenido del bucle
        }

        // Update internal physics position from DOM's avatar element
        updatePositionFromDOM(passiveSync = false) {
            if (!this.myAvatarElement || !this.gameAreaElement || !drawariaCanvas) return false;

            try {
                const avatarRect = this.myAvatarElement.getBoundingClientRect();
                const gameRect = this.gameAreaElement.getBoundingClientRect();

                // Update dynamic avatar dimensions (in game units 0-100)
                this.avatarDimensions.width = (avatarRect.width / gameRect.width) * 100;
                this.avatarDimensions.height = (avatarRect.height / gameRect.height) * 100;

                // Calculate current X based on center of avatar
                const currentX = ((avatarRect.left + avatarRect.width / 2 - gameRect.left) / gameRect.width) * 100;
                // Calculate current Y based on the BOTTOM of the avatar
                const currentY = ((avatarRect.bottom - gameRect.top) / gameRect.height) * 100;

                // Only update internal position if it's a significant change or active sync
                if (!passiveSync ||
                    (Math.abs(this.position.x - currentX) > 0.5 || Math.abs(this.position.y - currentY) > 0.5)) {
                    this.position.x = currentX;
                    this.position.y = currentY;

                    if (passiveSync) {
                        this.velocity = new Vector2D(0, 0); // Reset velocity if not active
                        this.onGround = (currentY >= 99.5); // Check if near ground
                    }
                }
                return true;
            } catch (e) {
                console.warn("Error reading avatar DOM position:", e);
                return false;
            }
        }

        // Activate physics: snap avatar to floor, reset velocity
        activatePhysics() {
            if (this.isPhysicsActive) return;

            this.isPhysicsActive = true;
            this.updatePositionFromDOM(); // Get current DOM position and dimensions

            // Force position to the ground (100) and reset motion for a stable start
            this.position.y = 100; // Snap avatar to the floor (bottom = 100)
            this.velocity = new Vector2D(0, 0);
            this.onGround = true; // Mark as grounded
            this.isSwimming = false; // Not swimming initially
            console.log('✅ Physics ACTIVATED. Avatar snapped to floor and motion reset.');
            console.log(`🎮 Controls: Alt+Z (left), Alt+C (right), Alt+X (jump).`);
        }

        // Deactivate physics: stop motion, clear keys
        deactivatePhysics() {
            if (!this.isPhysicsActive) return;

            this.isPhysicsActive = false;
            this.keys = {};
            this.velocity = new Vector2D(0, 0);
            this.onGround = false;
            this.isSwimming = false;
            // Al desactivar, restaurar gravedad a original
            this.gravity = this.originalGravity;
            this.isAntiGravityActive = false;
            this.isSpeedBoostActive = false;
            this.currentSpeedBoostFactor = 1.0;
            if(this.speedBoostTimeout) clearTimeout(this.speedBoostTimeout);
            console.log('❌ Physics DEACTIVATED. Avatar released from control.');
        }

        // Main physics update loop (called continuously by menuController)
        update() {
            if (!this.isPhysicsActive) return;

            // Apply gravity (reduced in water)
            if (this.isSwimming) {
                this.velocity.y += this.gravity * 0.3;
            } else {
                this.velocity.y += this.gravity;
            }

            // Handle input
            const currentMoveForce = this.moveForce * this.currentSpeedBoostFactor;
            if (this.keys['left']) this.velocity.x -= currentMoveForce * (this.isSwimming ? 0.15 : 0.1);
            if (this.keys['right']) this.velocity.x += currentMoveForce * (this.isSwimming ? 0.15 : 0.1);

            if (this.keys['jump'] && (this.onGround || this.isSwimming)) {
                this.velocity.y = -this.jumpForce * (this.isSwimming ? 0.7 : 1.0);
                this.onGround = false;
            }

            // Apply friction (increased in water)
            this.velocity.x *= (1 - (this.isSwimming ? 0.15 : this.friction));
            if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;

            // Calculate next position
            let nextX = this.position.x + (this.velocity.x * 0.1);
            let nextY = this.position.y + (this.velocity.y * 0.1);

            // **APLICAR LÍMITES INTELIGENTES ANTES DE RESOLVER COLISIONES**
            if (this.boundaryManager) {
                this.boundaryManager.updateCanvasBounds(); // Asegurar que los límites estén actualizados
                const bounds = this.boundaryManager.realTimeBounds;

                // Restringir X con límites inteligentes
                nextX = Math.max(bounds.minX, Math.min(bounds.maxX, nextX));

                // Restringir Y con límites inteligentes
                nextY = Math.max(bounds.minY, Math.min(bounds.maxY, nextY));
            }

            // Check and resolve collisions
            this.handleCollisions(nextX, nextY);

            // Send new position to Drawaria if changed significantly
            if (this.hasPositionChanged()) {
                this.sendPositionToDrawaria();
            }
        }

        // Handle all types of collisions based on pixel checks
        handleCollisions(nextX, nextY) {
            const collisions = this.checkAvatarCollisions();

            // Obtener el tipo de superficie en el centro o en la parte inferior si no hay centro específico
            // Prioridad: centro, luego bottom
            let primaryCollision = null;
            if (collisions.center && this.surfaceColors[collisions.center.type]) {
                primaryCollision = collisions.center;
            } else if (collisions.bottom && this.surfaceColors[collisions.bottom.type]) {
                primaryCollision = collisions.bottom;
            }

            // Reiniciar efectos que no son persistentes
            if (!primaryCollision || primaryCollision.type !== 'speed_boost') {
                if (this.isSpeedBoostActive) {
                    clearTimeout(this.speedBoostTimeout);
                    this.isSpeedBoostActive = false;
                    this.currentSpeedBoostFactor = 1.0;
                    console.log('💨 Speed Boost terminado/reseteado.');
                }
            }
            if (!primaryCollision || primaryCollision.type !== 'anti_gravity') {
                if (this.isAntiGravityActive) {
                    this.gravity = this.originalGravity;
                    this.isAntiGravityActive = false;
                    console.log('⬇️ Gravedad normal restablecida.');
                }
            }
            if (!primaryCollision || primaryCollision.type !== 'water') {
                if (this.isSwimming) {
                    console.log('🏊‍♂️ Exited water.');
                    this.isSwimming = false;
                }
            }

            if (primaryCollision) {
                switch (primaryCollision.type) {
                    case 'solid':
                        // Comportamiento por defecto, ya manejado
                        break;
                    case 'bounce':
                        // Comportamiento por defecto, ya manejado en resolvedY
                        break;
                    case 'speed_boost':
                        if (!this.isSpeedBoostActive) {
                            this.isSpeedBoostActive = true;
                            this.currentSpeedBoostFactor = 1.8; // Aumenta la velocidad en un 80%
                            console.log('⚡ Speed Boost activado!');
                            // Reiniciar speed boost si se pisa de nuevo antes de que termine
                            clearTimeout(this.speedBoostTimeout);
                            this.speedBoostTimeout = setTimeout(() => {
                                this.isSpeedBoostActive = false;
                                this.currentSpeedBoostFactor = 1.0;
                                console.log('💨 Speed Boost terminado.');
                            }, this.speedBoostDuration);
                        }
                        break;
                    case 'water':
                        if (!this.isSwimming) console.log('🏊‍♂️ Entered water.');
                        this.isSwimming = true;
                        break;
                    case 'anti_gravity':
                        if (!this.isAntiGravityActive) {
                            this.gravity = -0.8; // Gravedad invertida para ir hacia arriba
                            this.isAntiGravityActive = true;
                            this.velocity.y -= 5; // Un pequeño empuje inicial hacia arriba
                            console.log('⬆️ Gravedad invertida activada!');
                        }
                        break;
                    case 'normal_gravity':
                        if (this.isAntiGravityActive) {
                            this.gravity = this.originalGravity;
                            this.isAntiGravityActive = false;
                            console.log('⬇️ Gravedad normal restablecida.');
                        }
                        break;
                    case 'push_back':
                        if (this.onGround) { // Solo empujar si está en el suelo o moviéndose
                            if (this.velocity.x === 0) { // Si está quieto, empujar en una dirección aleatoria
                                this.velocity.x = (Math.random() > 0.5 ? 1 : -1) * this.pushBackForce;
                            } else { // Si se mueve, empujar en la dirección opuesta
                                this.velocity.x = -Math.sign(this.velocity.x) * this.pushBackForce;
                            }
                            this.velocity.y = -5; // Un pequeño salto al ser empujado
                            this.onGround = false;
                            console.log('↩️ Empuje hacia atrás activado!');
                        }
                        break;
                    case 'death':
                        // Ya manejado al principio, pero por si acaso
                        console.log('💀 Avatar tocó zona de MUERTE - ¡Reseteando!');
                        this.reset();
                        return;
                    default:
                        // Para cualquier hitbox personalizado sin lógica específica aún
                        console.log(`ℹ️ Colisión con hitbox tipo '${primaryCollision.type}'`);
                        break;
                }
            }

            // Resolve X-axis movement
            let resolvedX = nextX;
            if ((this.keys['left'] && collisions.left && collisions.left.type === 'solid') ||
                (this.keys['right'] && collisions.right && collisions.right.type === 'solid')) {
                this.velocity.x = 0; // Stop horizontal movement
                resolvedX = this.position.x; // Stay at current X
            }
            this.position.x = resolvedX; // Ya está limitado por boundaries del update()

            // Resolve Y-axis movement
            let resolvedY = nextY;
            if (this.velocity.y > 0) { // Moving downwards (falling or landing)
                if (collisions.bottom && (collisions.bottom.type === 'solid' || collisions.bottom.type === 'bounce')) {
                    this.velocity.y = 0; // Stop vertical motion
                    resolvedY = this.position.y; // Snap to current Y if hit (avoid falling through)
                    this.onGround = true; // Mark as grounded

                    // Handle bounce surface
                    if (collisions.bottom.type === 'bounce' && Date.now() - this.lastBounceSurface > 200) { // Small cooldown
                        console.log('🟡 Hit bounce pad!');
                        this.velocity.y = -this.jumpForce * 1.5; // Stronger bounce
                        this.onGround = false;
                        this.lastBounceSurface = Date.now();
                    }
                }
            } else if (this.velocity.y < 0) { // Moving upwards (jumping)
                if (collisions.top && collisions.top.type === 'solid') {
                    this.velocity.y = 0; // Stop vertical motion (hit ceiling)
                    resolvedY = this.position.y; // Snap to current Y
                }
            }
            this.position.y = resolvedY; // Ya está limitado por boundaries del update()

            // **VERIFICACIÓN FINAL DE SUELO INTELIGENTE**
            if (this.boundaryManager) {
                const maxY = this.boundaryManager.realTimeBounds.maxY;
                if (this.position.y >= maxY - this.boundaryManager.gameUnitFloorTolerance) { // Tolerancia para asegurar el snap
                    this.position.y = maxY;
                    this.velocity.y = 0;
                    this.onGround = true;
                } else if (this.position.y < maxY - this.boundaryManager.gameUnitFloorTolerance && collisions.bottom && collisions.bottom.type !== 'solid' && primaryCollision?.type !== 'water') {
                    // Si no está en el suelo y no hay colisión sólida debajo, y no está en agua, no está en el suelo
                    this.onGround = false;
                }
            } else { // Fallback si boundaryManager no está listo
                 if (this.position.y >= 99.5) { // Si muy cerca de 100 (suelo)
                    this.position.y = 100; // Snap precisamente al suelo
                    this.velocity.y = 0;
                    this.onGround = true;
                } else if (!collisions.bottom || collisions.bottom.type === 'water') {
                    this.onGround = false;
                }
            }
        }

        // Checks a pixel color at a specific game coordinate (0-100) with optional game offsets
        checkPixelCollision(gameX, gameY, gameOffsetX = 0, gameOffsetY = 0) {
            if (!drawariaCanvas || !drawariaCtx || !this.gameAreaElement) return null;

            try {
                const effectiveGameX = gameX + gameOffsetX;
                const effectiveGameY = gameY + gameOffsetY;

                const canvasWidthPx = drawariaCanvas.width;
                const canvasHeightPx = drawariaCanvas.height;

                // Convert combined game coordinates to canvas pixel coordinates
                const pixelX = Math.floor((effectiveGameX / 100) * canvasWidthPx);
                const pixelY = Math.floor((effectiveGameY / 100) * canvasHeightPx);

                // Ensure within canvas bounds
                if (pixelX < 0 || pixelX >= canvasWidthPx || pixelY < 0 || pixelY >= canvasHeightPx) {
                    return null;
                }

                const imageData = drawariaCtx.getImageData(pixelX, pixelY, 1, 1);
                const pixelData = imageData.data;
                const r = pixelData[0];
                const g = pixelData[1];
                const b = pixelData[2];
                const a = pixelData[3];

                if (a < 100) return null; // Treat mostly transparent pixels as no collision

                for (const typeKey in this.surfaceColors) {
                    const colorData = this.surfaceColors[typeKey];
                    const tolerance = 40; // Increased tolerance for color variations
                    if (Math.abs(r - colorData.r) < tolerance &&
                        Math.abs(g - colorData.g) < tolerance &&
                        Math.abs(b - colorData.b) < tolerance) {
                        return { color: colorData.hex, type: colorData.type, r, g, b };
                    }
                }
                return null; // No special color found (treat as non-collidable or background)
            } catch (error) {
                // This can happen if canvas is not yet ready or cross-origin
                // console.warn('Error in pixel detection:', error);
                return null;
            }
        }

        // Checks multiple points around the avatar for collisions
        checkAvatarCollisions() {
            const collisions = { bottom: null, top: null, left: null, right: null, center: null };

            const halfWidth = this.avatarDimensions.width / 2;
            const height = this.avatarDimensions.height;
            const checkOffset = 0.5; // Small offset to check just outside the avatar boundary

            // Bottom-center (for ground and bounce pads)
            collisions.bottom = this.checkPixelCollision(this.position.x, this.position.y + checkOffset);

            // Top-center (for ceiling collision)
            collisions.top = this.checkPixelCollision(this.position.x, this.position.y - height - checkOffset);

            // Mid-height left/right (for side walls)
            const midY = this.position.y - (height / 2);
            collisions.left = this.checkPixelCollision(this.position.x - halfWidth - checkOffset, midY);
            collisions.right = this.checkPixelCollision(this.position.x + halfWidth + checkOffset, midY);

            // Center (for water/death zones that affect the whole avatar)
            collisions.center = this.checkPixelCollision(this.position.x, midY);

            return collisions;
        }

        hasPositionChanged() {
            const threshold = 0.1; // Minimum change threshold to send command, reducido para más frecuencia
            return Math.abs(this.position.x - this.lastSentPosition.x) > threshold ||
                   Math.abs(this.position.y - this.lastSentPosition.y) > threshold;
        }

        // Sends the physics position to Drawaria's avatar system
        sendPositionToDrawaria() {
            const targetX = this.position.x;
            const targetYBottom = this.position.y; // This is the BOTTOM-Y in our physics model

            let adjustedDisplayY;
            if (this.avatarDimensions.height > 0) {
                // Adjust Y to be the CENTER of the avatar, as Drawaria usually expects center or top-left
                // (Bottom Y - Half Avatar Height)
                adjustedDisplayY = targetYBottom - (this.avatarDimensions.height / 2);
            } else {
                // Fallback estimate if dimensions not yet acquired
                adjustedDisplayY = targetYBottom - 6; // Rough estimate for center if avatar is 12 units high
            }
            // Ensure adjusted Y stays within 0-100 game unit bounds
            adjustedDisplayY = Math.max(0, Math.min(100, adjustedDisplayY));

            // SIEMPRE actualizar elementos visuales PRIMERO (no como fallback)
            this.updateVisualElements(targetX, adjustedDisplayY); // Pasa adjustedDisplayY que es el centro

            const socket = this.getAnyAvailableSocket();

            // Try window.game.sendMove first
            if (window.game && typeof window.game.sendMove === "function") {
                try {
                    window.game.sendMove(targetX, adjustedDisplayY);
                    this.lastSentPosition = { x: targetX, y: targetYBottom }; // Store physics position
                    return;
                } catch (error) {
                    console.warn('Error with game.sendMove, trying WebSocket fallback:', error);
                }
            }

            // Fallback to WebSocket command
            if (socket) {
                try {
                    const encodedPos = 1e4 * Math.floor((targetX / 100) * 1e4) + Math.floor((adjustedDisplayY / 100) * 1e4);
                    socket.send(`42["clientcmd",103,[${encodedPos},false]]`);
                    this.lastSentPosition = { x: targetX, y: targetYBottom };
                    return;
                } catch (error) {
                    console.warn('Error sending movement command via WebSocket:', error);
                }
            }
        }

        getAnyAvailableSocket() {
            if (drawariaSocket && drawariaSocket.readyState === WebSocket.OPEN) { return drawariaSocket; }
            if (window._io && window._io.socket && window._io.socket.readyState === WebSocket.OPEN) {
                drawariaSocket = window._io.socket; return drawariaSocket;
            }
            for (const prop in window) {
                try { if (window[prop] instanceof WebSocket && window[prop].readyState === WebSocket.OPEN && window[prop].url.includes('drawaria')) {
                        drawariaSocket = window[prop]; return drawariaSocket; }
                } catch (e) { /* Access denied */ }
            }
            return null;
        }

        // Update local visual elements (brush cursor, avatar DOM element)
        updateVisualElements(targetX, targetYCenter) { // targetYCenter es la posición Y del centro del avatar
            // PRIORIZAR el canvas overlay si está disponible, sino gameAreaElement
            const effectiveGameArea = this.overlayCanvas || this.gameAreaElement;

            if (!effectiveGameArea) {
                console.warn('No game area or overlay canvas available for visual updates');
                return;
            }

            const gameRect = effectiveGameArea.getBoundingClientRect();
            const displayWidth = gameRect.width;
            const displayHeight = gameRect.height; // Altura total del área de visualización

            // Calcula la altura base del área jugable (altura total - offset UI inferior detectado)
            const basePlayableHeightPx = Math.max(1, displayHeight - this.bottomUIOffsetPx);

            // Aplica el offset visual de píxeles controlado por el usuario para el suelo
            const finalPlayableHeightPx = basePlayableHeightPx - this.visualFloorOffsetPixels;

            // Usa dimensiones estimadas si las reales no están disponibles
            const effectiveAvatarGameHeight = this.avatarDimensions.height > 0 ? this.avatarDimensions.height : 12; // Fallback a 12 unidades de juego
            const effectiveAvatarGameWidth = this.avatarDimensions.width > 0 ? this.avatarDimensions.width : 8; // Fallback a 8 unidades de juego

            // Calcula las dimensiones del avatar en píxeles, basado en la altura total de visualización
            const avatarPixelWidth = (effectiveAvatarGameWidth / 100) * displayWidth;
            const avatarPixelHeight = (effectiveAvatarGameHeight / 100) * displayHeight;

            // Mapea la unidad Y del juego (targetYCenter, 0-100) al centro en píxeles del área jugable final.
            let avatarCenterPixelY = (targetYCenter / 100) * finalPlayableHeightPx;

            // Luego, calcula la posición en píxeles para la PARTE SUPERIOR del avatar.
            let pixelYTop = avatarCenterPixelY - (avatarPixelHeight / 2);

            // Cálculo de la posición X
            const pixelX = (targetX / 100) * displayWidth - (avatarPixelWidth / 2); // targetX es el centro

            // Aplicar límites para los elementos visuales (asegura que el avatar está dentro de finalPlayableHeightPx)
            const constrainedPixelX = Math.max(0, Math.min(pixelX, displayWidth - avatarPixelWidth));
            const constrainedPixelYTop = Math.max(0, Math.min(pixelYTop, finalPlayableHeightPx - avatarPixelHeight));

            // Actualizar brush cursor
            const brushCursor = document.querySelector('.brushcursor');
            if (brushCursor) {
                brushCursor.classList.remove('brushcursor-hidden');
                brushCursor.style.transform = `translate(${constrainedPixelX}px, ${constrainedPixelYTop}px)`;
                brushCursor.style.display = 'block';
                brushCursor.style.transition = 'transform 0.05s ease-out';
            }

            if (this.myAvatarElement) {
                this.myAvatarElement.style.transform = `translate(${constrainedPixelX}px, ${constrainedPixelYTop}px)`;
                this.myAvatarElement.style.position = 'absolute';
                this.myAvatarElement.style.zIndex = '100';
                this.myAvatarElement.style.transition = 'transform 0.05s ease-out';
                this.myAvatarElement.offsetHeight; // Forzar un repaint
            }
        }

        reset() {
            // Reset to current X, but force Y to ground (100) and zero velocity
            this.position.x = this.position.x; // Keep current X
            this.position.y = 100; // Force to ground
            this.velocity = new Vector2D(0, 0);
            this.onGround = true;
            this.isSwimming = false;
            // Al resetear, restaurar gravedad a original
            this.gravity = this.originalGravity;
            this.isAntiGravityActive = false;
            this.isSpeedBoostActive = false;
            this.currentSpeedBoostFactor = 1.0;
            if(this.speedBoostTimeout) clearTimeout(this.speedBoostTimeout);
            console.log('🔄 Avatar reseteado a posición actual y suelo.');
        }

        boost() {
            if (!this.isPhysicsActive) return;
            this.velocity.y = -this.jumpForce * 2;
            this.onGround = false;
            console.log('🚀 Boost aplicado');
        }

        destroy() {
            if (this.detectionInterval) {
                clearInterval(this.detectionInterval);
            }
            if (this.animationShield) { // Destruir AnimationShield
                this.animationShield.destroy();
            }
            if (this.boundaryManager) { // Destruir BoundaryManager
                this.boundaryManager.destroy();
            }
        }
    }

    // ======================================
    // CLASE PARA PROTEGER CONTROLES LOCALES DE ANIMACIONES DE SERVIDOR
    // ======================================
    class AnimationShield {
        constructor(avatar) {
            this.avatar = avatar;
            this.observer = null;
            this.reapplyInterval = null; // Para re-aplicar constantemente si es necesario

            this.setupProtection();
            console.log('🛡️ AnimationShield activado.');
        }

        setupProtection() {
            // Monitorear continuamente el avatar element para protegerlo
            this.startMonitoringAvatar();
        }

        startMonitoringAvatar() {
            if (this.avatar.myAvatarElement) {
                this.protectElement(this.avatar.myAvatarElement);
            }

            // Si el avatar element no está disponible al principio, inténtalo periódicamente
            this.reapplyInterval = setInterval(() => {
                if (this.avatar.myAvatarElement && !this.observer) {
                    this.protectElement(this.avatar.myAvatarElement);
                }
            }, 500); // Comprobar cada 0.5 segundos
        }

        protectElement(element) {
            if (this.observer) this.observer.disconnect(); // Desconectar si ya está observando

            this.observer = new MutationObserver((mutations) => {
                if (!this.avatar.isPhysicsActive) return; // Solo proteger si la física está activa

                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const style = element.style;

                        // Si detectamos una animación o transición que no es nuestra, la forzamos a detenerse
                        if (style.animation || style.transition !== 'transform 0.05s ease-out') {
                            this.observer.disconnect(); // Desconectar temporalmente para evitar loops
                            style.animation = '';
                            style.transition = 'transform 0.05s ease-out'; // Restaurar nuestra transición

                            // Reconectar observer después de un breve momento
                            setTimeout(() => {
                                if (this.observer) {
                                    this.observer.observe(element, { attributes: true, attributeFilter: ['style'] });
                                }
                            }, 0);
                        }

                        // Asegurar propiedades de posicionamiento
                        if (style.position !== 'absolute') style.position = 'absolute';
                        if (style.zIndex !== '100') style.zIndex = '100';
                        if (style.pointerEvents !== 'auto') style.pointerEvents = 'auto';
                    }
                });
            });

            this.observer.observe(element, { attributes: true, attributeFilter: ['style'] });
            console.log('👁️ Monitoring avatar element style for interference.');
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.reapplyInterval) {
                clearInterval(this.reapplyInterval);
                this.reapplyInterval = null;
            }
            console.log('🛡️ AnimationShield desactivado y destruido.');
        }
    }


    // ======================================
    // CLASE PARA GESTIONAR LÍMITES DEL CANVAS Y COLISIONES
    // ======================================
    class BoundaryManager {
        constructor(avatar) {
            this.avatar = avatar;
            this.canvasBounds = null;
            this.realTimeBounds = {
                minX: 0,
                maxX: 100,
                minY: 0,
                maxY: 100
            };
            this.gameUnitFloorTolerance = 0.5; // Pequeña tolerancia para la detección del suelo de la física (unidades de juego 0-100)
            this.updateInterval = null;
            this.startRealTimeUpdates();
        }

        startRealTimeUpdates() {
            // Actualización continua de límites en tiempo real
            this.updateInterval = setInterval(() => {
                this.updateCanvasBounds();
                // La aplicación de los límites se hace en PhysicsAvatar.update() y handleCollisions()
            }, 16); // ~60 FPS para detección suave
        }

        updateCanvasBounds() {
            // Detectar canvas overlay principal, mainCanvas o gameArea
            const overlayCanvas = document.getElementById('drawing-assistant-overlay');
            const mainCanvas = document.getElementById('canvas');
            const gameArea = document.getElementById('gamearea');

            const activeElement = overlayCanvas || mainCanvas || gameArea;

            if (activeElement) {
                const rect = activeElement.getBoundingClientRect();
                const style = window.getComputedStyle(activeElement);

                // Obtener dimensiones reales considerando CSS y atributos
                const realWidth = overlayCanvas ?
                    (overlayCanvas.width || parseFloat(style.width)) :
                    (activeElement.offsetWidth || rect.width);

                const realHeight = overlayCanvas ?
                    (overlayCanvas.height || parseFloat(style.height)) :
                    (activeElement.offsetHeight || rect.height);

                this.canvasBounds = {
                    element: activeElement,
                    rect: rect,
                    width: realWidth,
                    height: realHeight,
                    top: rect.top,
                    left: rect.left
                };

                // Calcular límites en coordenadas del juego (0-100)
                this.calculateGameBounds();
            }
        }

        calculateGameBounds() {
            if (!this.canvasBounds || !this.avatar.myAvatarElement) return;

            try {
                // Dimensiones del avatar en unidades de juego (0-100)
                // Usamos avatarDimensions del PhysicsAvatar que ya están en unidades de juego
                const avatarWidthGameUnits = this.avatar.avatarDimensions.width > 0 ? this.avatar.avatarDimensions.width : 8;
                const avatarHeightGameUnits = this.avatar.avatarDimensions.height > 0 ? this.avatar.avatarDimensions.height : 12;

                // Límites inteligentes para el sistema de física (0-100 game units)
                // minX/maxX para el CENTRO del avatar
                this.realTimeBounds = {
                    minX: avatarWidthGameUnits / 2, // Centro no se salga por la izquierda
                    maxX: 100 - (avatarWidthGameUnits / 2), // Centro no se salga por la derecha
                    minY: avatarHeightGameUnits, // Para que el TOP del avatar no se salga por arriba
                    maxY: 100 - this.gameUnitFloorTolerance // El "suelo" de la física, ligeramente por encima de 100 para estabilidad
                };

            } catch (error) {
                console.warn('Error calculando límites del juego:', error);
            }
        }

        // Debugging visual
        debugBounds() {
            console.log('🔍 Información de límites:');
            console.log('Canvas bounds:', this.canvasBounds);
            console.log('Game bounds (0-100):', this.realTimeBounds);
            console.log('Avatar current position (0-100):', this.avatar.position);
            console.log('Avatar dimensions (0-100):', this.avatar.avatarDimensions);
            console.log('Bottom UI Offset (px):', this.avatar.bottomUIOffsetPx);
            console.log('Visual Floor Offset (px):', this.avatar.visualFloorOffsetPixels);
        }

        destroy() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
            console.log('📐 BoundaryManager desactivado y destruido.');
        }
    }


    // ======================================
    // MENÚ PRINCIPAL CON PESTAÑAS
    // ======================================
    class PhysicsMenuController {
        constructor() {
            this.avatar = null;
            this.isRunning = false; // Controlled by menu buttons
            this.environmentDrawn = false;
            this.autoMovement = false;
            this.autoJump = false;
            this.boundaryBounce = false;

            // Nuevas propiedades para la sección de Hitbox Colors
            this.hitboxColorMap = {}; // Almacena los colores HEX actuales para cada tipo
            this.customHitboxTypes = []; // Para los tipos de hitbox personalizados
            this.nextCustomHitboxId = 0;
            this.selectedHitboxType = 'solid'; // Tipo de hitbox actualmente seleccionado para cambiar su color

            this.initHitboxColors(); // Inicializar el mapa de colores al inicio

            this.setupEventListeners();
            this.startStatusUpdates();
            this.startUpdateLoop(); // Physics loop always running, but avatar.update() is guarded by isPhysicsActive
        }

        // NUEVO: Inicializar los colores de los hitboxes
        initHitboxColors() {
            for (const key in DEFAULT_HITBOX_TYPES) {
                const typeInfo = DEFAULT_HITBOX_TYPES[key];
                this.hitboxColorMap[key] = STANDARD_COLORS[typeInfo.colorKey].hex;
            }
        }

        // NUEVO: Aplicar los colores actuales al PhysicsAvatar
        applyHitboxColorsToAvatar() {
            if (!this.avatar) return;
            this.avatar.surfaceColors = {}; // Limpiar los anteriores
            for (const typeKey in this.hitboxColorMap) {
                const hex = this.hitboxColorMap[typeKey];
                const rgb = hexToRgb(hex);
                this.avatar.surfaceColors[typeKey] = {
                    r: rgb.r, g: rgb.g, b: rgb.b,
                    type: typeKey, // El tipo de interacción es la misma key
                    hex: hex
                };
            }
            console.log('🎨 Colores de Hitbox aplicados al avatar:', this.avatar.surfaceColors);
        }

        // MODIFICAR initPhysicsSystem para aplicar los colores iniciales
        initPhysicsSystem() {
            if (this.avatar) return;

            this.avatar = new PhysicsAvatar();
            this.applyHitboxColorsToAvatar(); // Aplicar colores al avatar recién creado
            console.log('🎮 Physics Avatar system initialized. Physics are currently DEACTIVATED.');
            this.updateSliders();
        }

        // NUEVO: Método para actualizar la UI del color seleccionado
        updateSelectedColorInput() {
            const colorInput = document.getElementById('hitbox-color-input');
            if (colorInput && this.hitboxColorMap[this.selectedHitboxType]) {
                colorInput.value = this.hitboxColorMap[this.selectedHitboxType];
            }
            const selectedTypeDisplay = document.getElementById('selected-hitbox-type-display');
            if (selectedTypeDisplay) {
                selectedTypeDisplay.textContent = DEFAULT_HITBOX_TYPES[this.selectedHitboxType]?.name ||
                                                (this.customHitboxTypes.find(t => t.key === this.selectedHitboxType)?.name) ||
                                                this.selectedHitboxType;
            }
        }


        setupEventListeners() {
            // Tab switching
            document.querySelectorAll('#physics-menu .tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetTab = e.target.dataset.tab;
                    this.switchTab(targetTab);
                });
            });

            // Control buttons
            document.getElementById('start-physics').addEventListener('click', () => {
                if (this.avatar) {
                    this.avatar.activatePhysics();
                    this.isRunning = true;
                    document.getElementById('physics-status').textContent = 'Activo';
                    console.log('🚀 Physics system started.');
                } else { console.warn('Physics Avatar not initialized yet. Cannot start.'); }
            });

            document.getElementById('stop-physics').addEventListener('click', () => {
                if (this.avatar) {
                    this.avatar.deactivatePhysics();
                    this.isRunning = false;
                    document.getElementById('physics-status').textContent = 'Detenido';
                    console.log('⏹️ Physics system stopped.');
                } else { console.warn('Physics Avatar not initialized yet. Cannot stop.'); }
            });

            document.getElementById('reset-avatar').addEventListener('click', () => {
                if (this.avatar) this.avatar.reset(); else console.warn('Physics Avatar not initialized yet. Cannot reset.');
            });
            document.getElementById('avatar-boost').addEventListener('click', () => {
                if (this.avatar) this.avatar.boost(); else console.warn('Physics Avatar not initialized yet. Cannot boost.');
            });

            // Physics sliders - update if avatar is initialized
            document.getElementById('gravity-slider').addEventListener('input', (e) => {
                if (this.avatar) {
                    this.avatar.gravity = parseFloat(e.target.value);
                    this.avatar.originalGravity = parseFloat(e.target.value); // También actualizar la gravedad original
                }
                document.getElementById('gravity-display').textContent = parseFloat(e.target.value);
            });
            document.getElementById('move-force-slider').addEventListener('input', (e) => {
                if (this.avatar) this.avatar.moveForce = parseFloat(e.target.value);
                document.getElementById('move-force-display').textContent = parseFloat(e.target.value);
            });
            document.getElementById('jump-force-slider').addEventListener('input', (e) => {
                if (this.avatar) this.avatar.jumpForce = parseFloat(e.target.value);
                document.getElementById('jump-force-display').textContent = parseFloat(e.target.value);
            });
            document.getElementById('friction-slider').addEventListener('input', (e) => {
                if (this.avatar) this.avatar.friction = parseFloat(e.target.value);
                document.getElementById('friction-display').textContent = parseFloat(e.target.value);
            });
            document.getElementById('mass-slider').addEventListener('input', (e) => {
                if (this.avatar) this.avatar.mass = parseFloat(e.target.value);
                document.getElementById('mass-display').textContent = parseFloat(e.target.value);
            });

            // Preset buttons - apply if avatar is initialized
            document.getElementById('preset-normal').addEventListener('click', () => { if (this.avatar) this.setPreset('normal'); });
            document.getElementById('preset-heavy').addEventListener('click', () => { if (this.avatar) this.setPreset('heavy'); });
            document.getElementById('preset-light').addEventListener('click', () => { if (this.avatar) this.setPreset('light'); });
            document.getElementById('preset-bouncy').addEventListener('click', () => { if (this.avatar) this.setPreset('bouncy'); });

            // NUEVO: Control de offset visual del suelo (ahora en píxeles)
            document.getElementById('floor-offset-slider').addEventListener('input', (e) => {
                const newOffset = parseFloat(e.target.value); // Este es un valor en píxeles para ajustar visualmente
                if (this.avatar) {
                    this.avatar.visualFloorOffsetPixels = newOffset;
                }
                document.getElementById('floor-offset-display').textContent = newOffset;
            });

            // NUEVO: Botón de debug
            document.getElementById('debug-boundaries').addEventListener('click', () => {
                if (this.avatar && this.avatar.boundaryManager) {
                    this.avatar.boundaryManager.debugBounds();
                } else {
                    console.warn('BoundaryManager no está inicializado para debug.');
                }
            });

            // Automation toggles
            document.getElementById('auto-movement').addEventListener('change', (e) => {
                this.autoMovement = e.target.checked;
            });
            document.getElementById('auto-jump').addEventListener('change', (e) => {
                this.autoJump = e.target.checked;
            });
            document.getElementById('boundary-bounce').addEventListener('change', (e) => {
                this.boundaryBounce = e.target.checked;
            });

            // NUEVO: Event listeners para Hitbox Colors
            document.getElementById('hitbox-color-input').addEventListener('input', (e) => {
                const newHex = e.target.value;
                this.hitboxColorMap[this.selectedHitboxType] = newHex;
                this.updateHitboxColorSwatch(this.selectedHitboxType, newHex); // Actualizar el swatch
                this.applyHitboxColorsToAvatar(); // Aplicar al avatar inmediatamente
            });

            // Event listeners para los botones de selección de hitbox (estos se crean dinámicamente)
            // Usamos delegación de eventos para los botones de selección
            document.getElementById('tab-hitbox-colors').addEventListener('click', (e) => {
                if (e.target.closest('.select-hitbox-type')) { // Usar closest para el botón padre
                    const btn = e.target.closest('.select-hitbox-type');
                    const type = btn.dataset.hitboxType;
                    this.selectedHitboxType = type;
                    this.updateSelectedColorInput();
                    document.querySelectorAll('#tab-hitbox-colors .select-hitbox-type').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });


            document.getElementById('stop-automation').addEventListener('click', () => this.stopAutomation());
        }

        switchTab(targetTab) {
            document.querySelectorAll('#physics-menu .tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('#physics-menu .tab-panel').forEach(panel => panel.classList.remove('active'));

            document.querySelector(`#physics-menu [data-tab="${targetTab}"]`).classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            // Si cambiamos a la pestaña de hitboxes, actualizar su UI
            if (targetTab === 'hitbox-colors') {
                this.populateHitboxColorsUI();
            }
        }

        startPhysics() { // This method is now called by the menu button click, and activates Avatar physics
            if (this.isRunning) return;
            if (!this.avatar) {
                console.warn('Physics Avatar not yet available to start physics. Please wait for initialization.');
                return;
            }
            this.avatar.activatePhysics();
            this.isRunning = true;
            document.getElementById('physics-status').textContent = 'Activo';
            console.log('🚀 Physics system started via menu button.');
        }

        stopPhysics() { // This method is now called by the menu button click, and deactivates Avatar physics
            if (!this.isRunning) return;
            if (!this.avatar) {
                console.warn('Physics Avatar not available. Cannot stop.');
                return;
            }
            this.avatar.deactivatePhysics();
            this.isRunning = false;
            document.getElementById('physics-status').textContent = 'Detenido';
            console.log('⏹️ Physics system stopped via menu button.');
        }

        setPreset(preset) {
            if (!this.avatar) return;
            switch(preset) {
                case 'normal':
                    this.avatar.gravity = 0.8; this.avatar.moveForce = 15; this.avatar.jumpForce = 20;
                    this.avatar.friction = 0.1; this.avatar.mass = 1.0; break;
                case 'heavy':
                    this.avatar.gravity = 1.2; this.avatar.moveForce = 8; this.avatar.jumpForce = 15;
                    this.avatar.friction = 0.15; this.avatar.mass = 3.0; break;
                case 'light':
                    this.avatar.gravity = 0.3; this.avatar.moveForce = 25; this.avatar.jumpForce = 30;
                    this.avatar.friction = 0.05; this.avatar.mass = 0.3; break;
                case 'bouncy':
                    this.avatar.gravity = 0.6; this.avatar.moveForce = 20; this.avatar.jumpForce = 35;
                    this.avatar.friction = 0.02; this.avatar.mass = 0.8; break;
            }
            this.avatar.originalGravity = this.avatar.gravity; // Asegurar que la gravedad original también se actualice
            this.updateSliders();
            console.log(`🎯 Preset applied: ${preset}`);
        }

        updateSliders() {
            if (!this.avatar) return;
            document.getElementById('gravity-slider').value = this.avatar.gravity;
            document.getElementById('gravity-display').textContent = this.avatar.gravity;
            document.getElementById('move-force-slider').value = this.avatar.moveForce;
            document.getElementById('move-force-display').textContent = this.avatar.moveForce;
            document.getElementById('jump-force-slider').value = this.avatar.jumpForce;
            document.getElementById('jump-force-display').textContent = this.avatar.jumpForce;
            document.getElementById('friction-slider').value = this.avatar.friction;
            document.getElementById('friction-display').textContent = this.avatar.friction;
            document.getElementById('mass-slider').value = this.avatar.mass;
            document.getElementById('mass-display').textContent = this.avatar.mass;
        }

        async drawPlatform() {
            if (!drawariaCanvas) { console.warn('Cannot draw: Drawaria canvas not detected yet.'); return; }
            const x = 100 + Math.random() * (drawariaCanvas.width - 300);
            const y = 200 + Math.random() * (drawariaCanvas.height - 400);
            await drawRectangle(x, y, 150, 15, this.selectedColor, this.selectedThickness);
            console.log(`🏗️ Plataforma dibujada en (${x}, ${y})`);
        }

        async drawCircleObstacle() {
            if (!drawariaCanvas) { console.warn('Cannot draw: Drawaria canvas not detected yet.'); return; }
            const x = 100 + Math.random() * (drawariaCanvas.width - 200);
            const y = 100 + Math.random() * (drawariaCanvas.height - 200);
            const radius = 20 + Math.random() * 30;
            await drawCircle(x, y, radius, this.selectedColor, this.selectedThickness);
            console.log(`⭕ Círculo dibujado en (${x}, ${y}) con radio ${radius}`);
        }

        async drawEnvironment() {
            if (this.environmentDrawn) { console.log('🌍 Entorno ya dibujado. Ignorando.'); return; }
            if (!drawariaCanvas) { console.warn('Cannot draw: Drawaria canvas not detected yet for environment.'); return; }

            console.log('🌍 Dibujando entorno completo...');
            await drawRectangle(50, drawariaCanvas.height - 30, drawariaCanvas.width - 100, 20, '#4a4a4a', 3);
            await drawRectangle(100, drawariaCanvas.height - 150, 150, 15, '#6a6a6a', 2);
            await drawRectangle(300, drawariaCanvas.height - 250, 120, 15, '#6a6a6a', 2);
            await drawRectangle(500, drawariaCanvas.height - 180, 100, 15, '#6a6a6a', 2);
            await drawCircle(200, drawariaCanvas.height - 100, 25, '#8a4a4a', 2);
            await drawCircle(450, drawariaCanvas.height - 120, 20, '#8a4a4a', 2);
            this.environmentDrawn = true;
            console.log('✅ Entorno dibujado completamente');
        }

        clearCanvas() {
            if (drawariaSocket && drawariaSocket.readyState === WebSocket.OPEN) {
                drawariaSocket.send('42["drawcmd",1,[]]'); // Command to clear canvas on Drawaria server
                this.environmentDrawn = false;
                console.log('🗑️ Canvas cleared.');
            } else {
                console.warn('❌ WebSocket not open. Cannot send clear canvas command.');
            }
        }

        startDemoMode() {
            this.autoMovement = true;
            document.getElementById('auto-movement').checked = true;
            if (this.avatar) this.startPhysics();
            console.log('🎪 Demo Mode Activated.');
        }

        startChaosMode() {
            if (!this.avatar) return;
            this.avatar.gravity = Math.random() * 2; this.avatar.moveForce = 10 + Math.random() * 20;
            this.avatar.jumpForce = 15 + Math.random() * 25;
            this.autoMovement = true;
            document.getElementById('auto-movement').checked = true;
            this.startPhysics();
            this.updateSliders();
            console.log('🌪️ Chaos Mode Activated.');
        }

        stopAutomation() {
            this.autoMovement = false; this.autoJump = false; this.boundaryBounce = false;

            document.getElementById('auto-movement').checked = false;
            document.getElementById('auto-jump').checked = false;
            document.getElementById('boundary-bounce').checked = false;

            // Restablecer el offset visual del suelo
            if (this.avatar) {
                this.avatar.visualFloorOffsetPixels = 45; // Valor predeterminado de 5
            }
            document.getElementById('floor-offset-slider').value = 5;
            document.getElementById('floor-offset-display').textContent = 5;

            console.log('⏹️ Automation stopped.');
        }

        startUpdateLoop() {
            const update = () => {
                // This requestAnimationFrame loop is continuous
                if (this.isRunning && this.avatar) {
                    this.avatar.update();

                    if (this.autoMovement) {
                        if (Math.random() < 0.02) {
                            this.avatar.keys['left'] = false; this.avatar.keys['right'] = false;
                            const randomMove = Math.random();
                            if (randomMove < 0.4) this.avatar.keys['left'] = true;
                            else if (randomMove < 0.8) this.avatar.keys['right'] = true;
                        }
                    }

                    if (this.autoJump && this.avatar.onGround && Math.random() < 0.05) {
                        this.avatar.keys['jump'] = true;
                        setTimeout(() => this.avatar.keys['jump'] = false, 100);
                    }
                }
                requestAnimationFrame(update);
            };
            update(); // Initial call to start the loop
        }

        startStatusUpdates() {
            setInterval(() => {
                const avatarPositionElem = document.getElementById('avatar-position');
                const avatarGroundedElem = document.getElementById('avatar-grounded');
                const socketStatusElem = document.getElementById('socket-status');
                const velocityXElem = document.getElementById('velocity-x');
                const velocityYElem = document.getElementById('velocity-y');
                const canvasStatusElem = document.getElementById('canvas-status');

                // Update UI based on avatar's state (even if not fully initialized, show N/A)
                if (avatarPositionElem) avatarPositionElem.textContent = this.avatar ? `${this.avatar.position.x.toFixed(1)}, ${this.avatar.position.y.toFixed(1)}` : 'N/A';
                if (avatarGroundedElem) {
                    let status = this.avatar ? (this.avatar.onGround ? 'Sí' : 'No') : 'N/A';
                    if (this.avatar && this.avatar.isSwimming) status += ' (Nadando)';
                    avatarGroundedElem.textContent = status;
                } else if (avatarGroundedElem) {
                    avatarGroundedElem.textContent = 'N/A';
                }

                if (socketStatusElem) socketStatusElem.textContent = (drawariaSocket && drawariaSocket.readyState === WebSocket.OPEN) ? '✅ Conectado' : '❌ Desconectado';
                if (velocityXElem) velocityXElem.textContent = this.avatar ? this.avatar.velocity.x.toFixed(2) : 'N/A';
                if (velocityYElem) velocityYElem.textContent = this.avatar ? this.avatar.velocity.y.toFixed(2) : 'N/A';
                if (canvasStatusElem) canvasStatusElem.textContent = drawariaCanvas ? '✅ Sí' : '❌ No';

            }, 100);
        }

        // NUEVO: Método para poblar la UI de los colores de hitbox
        populateHitboxColorsUI() {
            const defaultHitboxesContainer = document.getElementById('default-hitboxes-container');
            const customHitboxesContainer = document.getElementById('custom-hitboxes-container');
            if (!defaultHitboxesContainer || !customHitboxesContainer) {
                console.warn('Contenedores de hitbox no encontrados en el DOM.');
                return;
            }
            defaultHitboxesContainer.innerHTML = '';
            customHitboxesContainer.innerHTML = '';

            for (const typeKey in DEFAULT_HITBOX_TYPES) {
                const typeInfo = DEFAULT_HITBOX_TYPES[typeKey];
                const currentHex = this.hitboxColorMap[typeKey];
                defaultHitboxesContainer.innerHTML += `
                    <div class="hitbox-item">
                        <button class="select-hitbox-type ${this.selectedHitboxType === typeKey ? 'active' : ''}" data-hitbox-type="${typeKey}">
                            <span class="hitbox-swatch" style="background-color: ${currentHex};"></span>
                            <span class="hitbox-name">${typeInfo.name}</span>
                            <span class="hitbox-description">${typeInfo.description}</span>
                        </button>
                    </div>
                `;
            }

            this.customHitboxTypes.forEach(customType => {
                const currentHex = this.hitboxColorMap[customType.key];
                customHitboxesContainer.innerHTML += `
                    <div class="hitbox-item">
                         <button class="select-hitbox-type ${this.selectedHitboxType === customType.key ? 'active' : ''}" data-hitbox-type="${customType.key}">
                            <span class="hitbox-swatch" style="background-color: ${currentHex};"></span>
                            <input type="text" class="custom-hitbox-name" value="${customType.name}" data-hitbox-key="${customType.key}" placeholder="Nombre de Hitbox">
                            <button class="remove-hitbox-type danger-btn" data-hitbox-key="${customType.key}">×</button>
                        </button>
                    </div>
                `;
            });

            // Asignar event listeners para la gestión de custom hitboxes
            this.addCustomHitboxEventListeners();
            this.updateSelectedColorInput(); // Asegurar que el input de color refleje el tipo seleccionado
        }

        // NUEVO: Método para añadir un hitbox personalizado a la UI
        addCustomHitboxUI() {
            const newKey = `custom_${this.nextCustomHitboxId++}`;
            const newName = `Custom ${this.nextCustomHitboxId}`;
            const defaultColor = STANDARD_COLORS.gray.hex;

            this.hitboxColorMap[newKey] = defaultColor;
            this.customHitboxTypes.push({ key: newKey, name: newName, type: 'solid' }); // Por defecto como 'solid'
            this.selectedHitboxType = newKey; // Seleccionar el nuevo hitbox

            this.populateHitboxColorsUI(); // Regenerar la UI
            this.applyHitboxColorsToAvatar(); // Aplicar cambios al avatar

            console.log(`➕ Hitbox personalizado '${newName}' agregado.`);
        }

        // NUEVO: Método para manejar eventos de custom hitboxes
        addCustomHitboxEventListeners() {
            const customHitboxesContainer = document.getElementById('custom-hitboxes-container');
            if (!customHitboxesContainer) return;

            customHitboxesContainer.querySelectorAll('.remove-hitbox-type').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevenir que el clic se propague al botón padre .select-hitbox-type
                    const keyToRemove = e.target.dataset.hitboxKey;
                    this.removeCustomHitbox(keyToRemove);
                });
            });

            customHitboxesContainer.querySelectorAll('.custom-hitbox-name').forEach(input => {
                input.addEventListener('change', (e) => {
                    const keyToUpdate = e.target.dataset.hitboxKey;
                    const newName = e.target.value;
                    const customType = this.customHitboxTypes.find(t => t.key === keyToUpdate);
                    if (customType) {
                        customType.name = newName;
                    }
                });
            });
        }

        // NUEVO: Método para remover un hitbox personalizado
        removeCustomHitbox(key) {
            delete this.hitboxColorMap[key];
            this.customHitboxTypes = this.customHitboxTypes.filter(type => type.key !== key);
            this.populateHitboxColorsUI(); // Regenerar la UI

            // Si el hitbox seleccionado fue el eliminado, seleccionar 'solid' por defecto
            if (this.selectedHitboxType === key) {
                this.selectedHitboxType = 'solid';
            }
            this.updateSelectedColorInput();
            this.applyHitboxColorsToAvatar(); // Aplicar cambios al avatar

            console.log(`🗑️ Hitbox '${key}' eliminado.`);
        }

        // NUEVO: Actualizar el color del "swatch"
        updateHitboxColorSwatch(typeKey, hex) {
            const swatch = document.querySelector(`.select-hitbox-type[data-hitbox-type="${typeKey}"] .hitbox-swatch`);
            if (swatch) {
                swatch.style.backgroundColor = hex;
            }
        }
    }

    // --- Core Logic for Menu and Physics Initialization ---

    // 1. Create and show the menu container immediately (DOM only)
    function createAndShowMenuContainer() {
        if (document.getElementById('physics-menu')) {
            console.log('✅ Menu container already exists in DOM. Skipping recreation.');
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'physics-menu';
        menu.innerHTML = `
            <div class="menu-header">
                <div class="menu-title">
                    <span class="menu-icon">🚀</span>
                    <span>Avatar Physics Control</span>
                </div>
                <div class="menu-controls">
                    <button id="menu-minimize" class="menu-btn">−</button>
                    <button id="menu-close" class="menu-btn">×</button>
                </div>
            </div>

            <div class="menu-content">
                <!-- Navigation Tabs -->
                <div class="menu-tabs">
                    <button class="tab-btn active" data-tab="control">🎮 Control</button>
                    <button class="tab-btn" data-tab="physics">⚡ Física</button>
                    <button class="tab-btn" data-tab="hitbox-colors">🎨 Hitbox Colors</button>
                    <button class="tab-btn" data-tab="automation">🤖 Auto</button>
                </div>

                <!-- Tab Content -->
                <div class="tab-panel active" id="tab-control">
                        <div class="control-section">
                            <h4>🎯 Control del Avatar</h4>
                            <div class="button-grid">
                                <button id="start-physics" class="action-btn primary">
                                    <span class="btn-icon">▶️</span> Iniciar Física
                                </button>
                                <button id="stop-physics" class="action-btn secondary">
                                    <span class="btn-icon">⏹️</span> Detener
                                </button>
                                <button id="reset-avatar" class="action-btn warning">
                                    <span class="btn-icon">🔄</span> Reset Posición
                                </button>
                                <button id="avatar-boost" class="action-btn special">
                                    <span class="btn-icon">🚀</span> Super Salto
                                </button>
                            </div>

                            <div class="status-display">
                                <div class="status-item">
                                    <span class="status-label">Estado:</span>
                                    <span id="physics-status" class="status-value">Detenido</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Posición:</span>
                                    <span id="avatar-position" class="status-value">N/A</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">En suelo:</span>
                                    <span id="avatar-grounded" class="status-value">N/A</span>
                                </div>
                            </div>
                        </div>

                        <div class="controls-info">
                            <h4>🎯 Controles del Teclado</h4>
                            <div class="controls-list">
                                <div class="control-item">
                                    <span class="key">Alt+Z</span>
                                    <span class="desc">Mover izquierda</span>
                                </div>
                                <div class="control-item">
                                    <span class="key">Alt+C</span>
                                    <span class="desc">Mover derecha</span>
                                </div>
                                <div class="control-item">
                                    <span class="key">Alt+X</span>
                                    <span class="desc">Saltar</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Physics Tab -->
                    <div class="tab-panel" id="tab-physics">
                        <div class="physics-section">
                            <h4>⚡ Configuración Física</h4>

                            <div class="slider-group">
                                <label>Gravedad: <span id="gravity-display">0.8</span></label>
                                <input type="range" id="gravity-slider" min="0" max="2" step="0.1" value="0.8">
                            </div>

                            <div class="slider-group">
                                <label>Fuerza de Movimiento: <span id="move-force-display">15</span></label>
                                <input type="range" id="move-force-slider" min="5" max="30" step="1" value="15">
                            </div>

                            <div class="slider-group">
                                <label>Fuerza de Salto: <span id="jump-force-display">20</span></label>
                                <input type="range" id="jump-force-slider" min="10" max="40" step="1" value="20">
                            </div>

                            <div class="slider-group">
                                <label>Fricción: <span id="friction-display">0.1</span></label>
                                <input type="range" id="friction-slider" min="0" max="0.5" step="0.01" value="0.1">
                            </div>

                            <div class="slider-group">
                                <label>Masa: <span id="mass-display">1.0</span></label>
                                <input type="range" id="mass-slider" min="0.1" max="5" step="0.1" value="1.0">
                            </div>

                            <div class="preset-buttons">
                                <button id="preset-normal" class="preset-btn">🔧 Normal</button>
                                <button id="preset-heavy" class="preset-btn">🪨 Pesado</button>
                                <button id="preset-light" class="preset-btn">🪶 Liviano</button>
                                <button id="preset-bouncy" class="preset-btn">🏀 Saltarín</button>
                            </div>

                            <!-- NUEVO: Control de offset visual del suelo -->
                            <div class="slider-group">
                                <label>Offset Suelo Visual (px): <span id="floor-offset-display">5</span></label>
                                <input type="range" id="floor-offset-slider" min="-20" max="20" step="1" value="5">
                            </div>

                            <!-- NUEVO: Botón de debug -->
                            <div class="debug-controls">
                                <button id="debug-boundaries" class="preset-btn">🔍 Debug Límites</button>
                            </div>
                        </div>
                    </div>

                <!-- Hitbox Colors Tab -->
                <div class="tab-panel" id="tab-hitbox-colors">
                    <div class="hitbox-colors-section">
                        <h4>🎨 Colores y Efectos de Hitbox</h4>

                        <div class="color-picker-control">
                            <label>Editar Color para: <span id="selected-hitbox-type-display">Tocable</span></label>
                            <input type="color" id="hitbox-color-input" value="#000000">
                        </div>

                        <h5>Hitbox Types por Defecto</h5>
                        <div id="default-hitboxes-container" class="hitbox-grid">
                            <!-- Los hitboxes por defecto se generarán aquí -->
                        </div>

                    </div>
                </div>

                    <!-- Automation Tab -->
                    <div class="tab-panel" id="tab-automation">
                        <div class="automation-section">
                            <h4>🤖 Automatización</h4>

                            <div class="automation-controls">
                                <div class="toggle-group">
                                    <label class="toggle-label">
                                        <input type="checkbox" id="auto-movement">
                                        <span class="toggle-slider"></span>
                                        <span class="toggle-text">Movimiento Automático</span>
                                    </label>
                                </div>

                                <div class="toggle-group">
                                    <label class="toggle-label">
                                        <input type="checkbox" id="auto-jump">
                                        <span class="toggle-slider"></span>
                                        <span class="toggle-text">Salto Automático</span>
                                    </label>
                                </div>

                                <div class="toggle-group">
                                    <label class="toggle-label">
                                        <input type="checkbox" id="boundary-bounce">
                                        <span class="toggle-slider"></span>
                                        <span class="toggle-text">Rebote en Bordes</span>
                                    </label>
                                </div>
                            </div>

                            <div class="automation-presets">
                                <button id="stop-automation" class="auto-btn secondary">
                                    <span class="btn-icon">⏹️</span> Detener Auto
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Info Tab -->
        `;

        styleMenu(menu);
        document.body.appendChild(menu);
        console.log('✅ Menu DOM structure appended to body.');

        // Setup immediate menu controls (minimize/close)
        document.getElementById('menu-minimize').addEventListener('click', () => {
            const content = document.querySelector('#physics-menu .menu-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            document.getElementById('menu-minimize').textContent = isHidden ? '−' : '+';
        });

        document.getElementById('menu-close').addEventListener('click', () => {
            document.getElementById('physics-menu').style.display = 'none';
        });

        makeDraggable(menu);
    }

    // Apply CSS styles to the menu (with !important for overriding game styles)
    function styleMenu(menu) {
        const style = document.createElement('style');
        style.textContent = `
            #physics-menu {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                left: auto !important;
                bottom: auto !important;
                width: 420px !important;
                max-height: 85vh !important;
                background: linear-gradient(145deg, #1e1e2e, #2d3748) !important;
                border: 2px solid #4299e1 !important;
                border-radius: 16px !important;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
                color: white !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                z-index: 2147483647 !important; /* Max z-index */
                backdrop-filter: blur(10px) !important;
                overflow: hidden !important;
                display: block !important; /* Ensure it's visible */
                opacity: 1 !important; /* Ensure full opacity */
                visibility: visible !important; /* Ensure visibility */
                pointer-events: auto !important; /* Ensure clicks are not blocked */
                transform: none !important; /* Prevent any default transforms */
            }

            .menu-header {
                display: flex; justify-content: space-between; align-items: center; padding: 16px 20px;
                background: linear-gradient(90deg, #4299e1, #3182ce); cursor: grab; user-select: none !important;
            } .menu-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: bold; }
            .menu-icon { font-size: 20px; } .menu-controls { display: flex; gap: 8px; }
            .menu-btn { background: rgba(255,255,255,0.2); border: none; color: white; width: 28px; height: 28px;
                border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.3s; }
            .menu-btn:hover { background: rgba(255,255,255,0.3); } .menu-content { max-height: 70vh; overflow-y: auto; }
            .menu-tabs { display: flex; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); }
            .tab-btn { flex: 1; padding: 12px 8px; background: none; border: none; color: #a0aec0; cursor: pointer;
                font-size: 11px; font-weight: 500; transition: all 0.3s; border-bottom: 3px solid transparent; }
            .tab-btn:hover { background: rgba(255,255,255,0.05); color: white; }
            .tab-btn.active { background: rgba(66,153,225,0.2); color: #4299e1; border-bottom-color: #4299e1; }
            .tab-content { padding: 20px; } .tab-panel { display: none; } .tab-panel.active { display: block; }
            .control-section, .physics-section, .hitbox-colors-section, .automation-section, .info-section { margin-bottom: 20px; }
            h4 { margin: 0 0 15px 0; color: #4299e1; font-size: 14px; font-weight: bold; padding-bottom: 8px;
                border-bottom: 1px solid rgba(66,153,225,0.3); }
            h5 { margin: 15px 0 8px 0; color: #63b3ed; font-size: 13px; }
            .button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .action-btn { padding: 12px 16px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;
                font-size: 12px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .action-btn.primary { background: linear-gradient(145deg, #48bb78, #38a169); color: white; }
            .action-btn.secondary { background: linear-gradient(145deg, #718096, #4a5568); color: white; }
            .action-btn.warning { background: linear-gradient(145deg, #ed8936, #dd6b20); color: white; }
            .action-btn.special { background: linear-gradient(145deg, #9f7aea, #805ad5); color: white; }
            .action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            .status-display { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .status-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .status-label { color: #a0aec0; font-size: 12px; }
            .status-value { color: #4299e1; font-weight: bold; font-size: 12px; }
            .controls-info { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; }
            .controls-list { display: flex; flex-direction: column; gap: 8px; }
            .control-item { display: flex; justify-content: space-between; align-items: center; }
            .key { background: #4299e1; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .desc { color: #a0aec0; font-size: 11px; } .slider-group { margin-bottom: 15px; }
            .slider-group label { display: block; margin-bottom: 8px; color: #e2e8f0; font-size: 12px; font-weight: 500; }
            .slider-group input[type="range"] { width: 100%; height: 6px; border-radius: 3px; background: #4a5568; outline: none; -webkit-appearance: none; }
            .slider-group input[type="range"]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #4299e1; cursor: pointer; }
            .preset-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 15px; }
            .preset-btn { padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                border-radius: 6px; color: white; cursor: pointer; font-size: 11px; transition: all 0.3s; }
            .preset-btn:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
            .debug-controls { margin-top: 15px; } /* Estilo adicional para los controles de debug */

            /* Estilos para la nueva sección de Hitbox Colors */
            .hitbox-colors-section { padding: 20px; }
            .color-picker-control { margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
            .color-picker-control label { color: #e2e8f0; font-size: 12px; font-weight: 500; }
            .color-picker-control #selected-hitbox-type-display { color: #4299e1; font-weight: bold; }
            .color-picker-control input[type="color"] { width: 40px; height: 28px; border: none; border-radius: 4px; cursor: pointer; }

            .hitbox-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
            }

            .hitbox-item {
                flex: 1 1 calc(50% - 8px); /* Dos columnas, con espacio entre ellas */
                max-width: calc(50% - 8px);
                min-width: 150px;
            }

            .hitbox-item button.select-hitbox-type {
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                color: white;
                cursor: pointer;
                font-size: 11px;
                padding: 8px 10px;
                width: 100%;
                text-align: left;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .hitbox-item button.select-hitbox-type:hover {
                background: rgba(255,255,255,0.15);
                border-color: #4299e1;
            }

            .hitbox-item button.select-hitbox-type.active {
                background: rgba(66,153,225,0.2);
                border-color: #4299e1;
                box-shadow: 0 0 8px rgba(66,153,225,0.4);
            }

            .hitbox-swatch {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 1px solid rgba(255,255,255,0.3);
                display: inline-block;
                flex-shrink: 0;
            }

            .hitbox-name {
                font-weight: bold;
                color: #e2e8f0;
            }
            .hitbox-description {
                font-size: 10px;
                color: #a0aec0;
                margin-left: 8px;
                flex-grow: 1; /* Para que la descripción ocupe el espacio restante */
            }

            .custom-hitbox-name {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 4px;
                color: white;
                padding: 4px 6px;
                font-size: 11px;
                flex-grow: 1;
                margin-left: 5px;
                margin-right: 5px;
            }
            .custom-hitbox-name:focus { outline: none; border-color: #4299e1; }

            .remove-hitbox-type {
                background: #e53e3e;
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                flex-shrink: 0;
                padding: 0;
                line-height: 1;
            }
            .remove-hitbox-type:hover { background: #c53030; }

            /* Scrollbar */
            #physics-menu ::-webkit-scrollbar { width: 6px; }
            #physics-menu ::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 3px; }
            #physics-menu ::-webkit-scrollbar-thumb { background: #4299e1; border-radius: 3px; }
            #physics-menu ::-webkit-scrollbar-thumb:hover { background: #3182ce; }
        `;
        document.head.appendChild(style);
    }

    // Make the menu draggable
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

        const header = element.querySelector('.menu-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });
    }

    // Function to ensure the menu stays visible (called periodically)
    function ensureMenuVisibility() {
        const menu = document.getElementById('physics-menu');
        if (menu) {
            menu.style.setProperty('display', 'block', 'important');
            menu.style.setProperty('opacity', '1', 'important');
            menu.style.setProperty('visibility', 'visible', 'important');
            menu.style.setProperty('pointer-events', 'auto', 'important');
        }
    }

    // Initialize the core physics logic and menu functionality
    function initializePhysicsAndMenu() {
        // Attempt to get canvas immediately
        drawariaCanvas = document.getElementById('canvas');
        if (drawariaCanvas && !drawariaCtx) {
            drawariaCtx = drawariaCanvas.getContext('2d');
            console.log('🎨 Drawaria Canvas and Context detected.');
        }

        // Create the Menu Controller instance immediately if it doesn't exist
        if (!menuControllerInstance) {
            menuControllerInstance = new PhysicsMenuController();
            console.log('🎮 PhysicsMenuController instance created. Waiting for manual activation.');
            // Cargar la UI de hitboxes al inicio
            menuControllerInstance.populateHitboxColorsUI();
        }

        // Initialize PhysicsAvatar within the controller if it hasn't been done yet.
        // This will allow the PhysicsAvatar to start detecting the DOM avatar.
        if (menuControllerInstance && !menuControllerInstance.avatar) {
            menuControllerInstance.initPhysicsSystem();
        }
    }

    // --- Entry point ---
    // Create and show the menu structure as soon as the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAndShowMenuContainer);
    } else {
        createAndShowMenuContainer();
    }

    // Start the continuous check for physics and menu functionality activation
    // This will also ensure the menu's visibility persistently
    setInterval(initializePhysicsAndMenu, 500);
    setInterval(ensureMenuVisibility, 500); // Ensure menu visibility periodically

    console.log('🌌 Drawaria Avatar Physics (v6.0) Loader initiated. Menu should be visible. Physics control is MANUAL.');

})();