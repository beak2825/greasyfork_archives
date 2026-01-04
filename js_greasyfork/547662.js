// ==UserScript==
// @name         Drawaria.online RPG Mode🗡️
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Pixel companions with player selector, very optimized, monster enemies, and DOM-based image mode
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/547662/Drawariaonline%20RPG%20Mode%F0%9F%97%A1%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547662/Drawariaonline%20RPG%20Mode%F0%9F%97%A1%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ----------  SISTEMA BASE OPTIMIZADO  ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;
    let drawariaCtx = null;

    // Queue optimizado para comandos con batching inteligente
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60;

    // Variables de control del sistema
    let systemActive = false;
    let selectedPlayerId = null;
    let selectedPlayerName = null;
    let renderMode = 'drawings'; // 'drawings' o 'images'
    let activeComponents = {
        hearts: true,
        sword: true,
        shield: true,
        monsters: true
    };

    // Función auxiliar para delays
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Intercept WebSocket optimizado
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 [PIXEL COMPANIONS] Socket capturado para Pixel Companions');
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
                try {
                    drawariaSocket.send(cmd);
                } catch (e) {
                    console.warn('⚠️ [PIXEL COMPANIONS] Error enviando comando:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /* ----------  SISTEMA DE IMÁGENES  ---------- */
    class ImageAssetManager {
        constructor() {
            this.loadedImages = new Map();
            this.imageUrls = {
                sword: 'https://i.ibb.co/KpD33DZV/espada.png',
                shield: 'https://i.ibb.co/XxbQXt5g/escudo.png',
                hearts: 'https://i.ibb.co/b5HT0JDQ/hearts-fw.png',
                monster: 'https://media.tenor.com/dPsOXgYjb30AAAAj/pixel-pixelart.gif'
            };
            this.loadingPromises = new Map();
            this.preloadImages();
        }

        preloadImages() {
            console.log('🖼️ [IMAGE MODE] Precargando imágenes...');

            Object.entries(this.imageUrls).forEach(([key, url]) => {
                this.loadImage(key, url);
            });
        }

        loadImage(key, url) {
            if (this.loadingPromises.has(key)) {
                return this.loadingPromises.get(key);
            }

            const promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';

                img.onload = () => {
                    this.loadedImages.set(key, img);
                    console.log(`✅ [IMAGE MODE] Imagen cargada: ${key} (${img.width}x${img.height})`);
                    resolve(img);
                };

                img.onerror = (error) => {
                    console.error(`❌ [IMAGE MODE] Error cargando imagen ${key}:`, error);
                    reject(error);
                };

                img.src = url;
            });

            this.loadingPromises.set(key, promise);
            return promise;
        }

        getImage(key) {
            return this.loadedImages.get(key) || null;
        }

        isImageLoaded(key) {
            return this.loadedImages.has(key);
        }

        async waitForImage(key) {
            if (this.isImageLoaded(key)) {
                return this.getImage(key);
            }

            if (this.loadingPromises.has(key)) {
                return await this.loadingPromises.get(key);
            }

            return null;
        }

        getLoadedImagesCount() {
            return this.loadedImages.size;
        }
    }

    /* ----------  PATRONES PIXEL ART OPTIMIZADOS + MONSTER  ---------- */
    const pixelPatterns = {
        'heart': [
            " RR   RR ",
            "RRRR RRRR",
            "RRRRRRRRR",
            " RRRRRRR ",
            "  RRRRR  ",
            "   RRR   ",
            "    R    "
        ],
        'sword': [
            "    W    ",
            "    W    ",
            "    W    ",
            "    W    ",
            "    W    ",
            "    W    ",
            "    W    ",
            "  BBBBB  ",
            "    B    ",
            "    B    "
        ],
        'shield': [
            "  BBBBB  ",
            " BWWWWWB ",
            "BWWWWWWB",
            "BWWWWWWB",
            "BWWWWWWB",
            "BWWWWWWB",
            " BWWWWB ",
            "  BWWB  ",
            "   BB   "
        ],
        'monster': [
            "  RRRRR  ",
            " RRRRRRR ",
            "RRR G RRR",
            "RRR   RRR",
            "RRR G RRR",
            "RRRRRRRRR",
            "RRR RRR RR",
            "RR  R  RR",
            " R     R ",
            "RR     RR"
        ]
    };

    const specificColorSchemes = {
        heart: {
            classic: { 'R': '#FF0000', 'W': '#FFFFFF', 'B': '#000000', ' ': null },
            dark: { 'R': '#330000', 'W': '#333333', 'B': '#111111', ' ': null }
        },
        sword: {
            classic: { 'W': '#00FFFF', 'B': '#0000FF', ' ': null },
            dark: { 'W': '#006666', 'B': '#000066', ' ': null }
        },
        shield: {
            classic: { 'W': '#FFFF00', 'B': '#000000', ' ': null },
            dark: { 'W': '#666600', 'B': '#111111', ' ': null }
        },
        monster: {
            classic: { 'R': '#CC0000', 'G': '#00FF00', ' ': null },
            angry: { 'R': '#FF0000', 'G': '#FFFF00', ' ': null }
        }
    };

    /* ----------  SISTEMA DE MONSTRUOS  ---------- */
    class MonsterSystem {
        constructor(companionSystem) {
            this.monsters = [];
            this.companionSystem = companionSystem;
            this.spawnTimer = 0;
            this.SPAWN_INTERVAL = 8000;
            this.MONSTER_SPEED = 0.8;
            this.COLLISION_DISTANCE = 25;
            this.MAX_MONSTERS = 3;
            this.lastSpawnTime = 0;
        }

        getRandomSpawnPosition() {
            if (!drawariaCanvas) return null;

            const margin = 50;
            const sides = ['top', 'bottom', 'left', 'right'];
            const side = sides[Math.floor(Math.random() * sides.length)];

            let x, y;

            switch(side) {
                case 'top':
                    x = Math.random() * (drawariaCanvas.width - 2 * margin) + margin;
                    y = margin;
                    break;
                case 'bottom':
                    x = Math.random() * (drawariaCanvas.width - 2 * margin) + margin;
                    y = drawariaCanvas.height - margin;
                    break;
                case 'left':
                    x = margin;
                    y = Math.random() * (drawariaCanvas.height - 2 * margin) + margin;
                    break;
                case 'right':
                    x = drawariaCanvas.width - margin;
                    y = Math.random() * (drawariaCanvas.height - 2 * margin) + margin;
                    break;
            }

            return { x, y, side };
        }

        spawnMonster() {
            if (this.monsters.length >= this.MAX_MONSTERS) return;

            const position = this.getRandomSpawnPosition();
            if (!position) return;

            const monster = {
                id: `monster_${Date.now()}_${Math.random()}`,
                x: position.x,
                y: position.y,
                spawnSide: position.side,
                lastX: -9999,
                lastY: -9999,
                targetX: position.x,
                targetY: position.y,
                speed: this.MONSTER_SPEED,
                active: true,
                chaseMode: false,
                needsRedraw: true,
                colorScheme: 'classic',
                domElement: null // Para modo images
            };

            this.monsters.push(monster);

            // Crear elemento DOM si estamos en modo images
            if (renderMode === 'images') {
                this.createMonsterDOMElement(monster);
            }

            console.log(`👹 [MONSTERS] Nuevo monstruo spawneado en ${position.side}: ${monster.id}`);
        }

        createMonsterDOMElement(monster) {
            const element = document.createElement('div');
            element.style.cssText = `
                position: fixed;
                width: 120px;
                height: 120px;
                background-image: url('${this.companionSystem.imageAssetManager.imageUrls.monster}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                pointer-events: none;
                z-index: 1001;
                display: block;
                will-change: transform, left, top;
            `;

            monster.domElement = element;
            document.body.appendChild(element);
        }

        updateMonsters() {
            if (!activeComponents.monsters || !systemActive) return;

            const now = Date.now();

            if (now - this.lastSpawnTime > this.SPAWN_INTERVAL) {
                this.spawnMonster();
                this.lastSpawnTime = now;
            }

            this.monsters.forEach(monster => {
                this.updateSingleMonster(monster);
            });

            this.monsters = this.monsters.filter(monster => monster.active);
        }

        updateSingleMonster(monster) {
            if (!monster.active) return;

            const targetPlayers = this.companionSystem.getTargetPlayerCoords(selectedPlayerId);
            if (!targetPlayers || targetPlayers.length === 0) return;

            let closestPlayer = targetPlayers;
            let minDistance = Infinity;

            targetPlayers.forEach(player => {
                const distance = Math.sqrt(
                    Math.pow(player.x - monster.x, 2) +
                    Math.pow(player.y - monster.y, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPlayer = player;
                }
            });

            if (minDistance < this.COLLISION_DISTANCE) {
                console.log(`💥 [MONSTERS] ¡Monstruo ${monster.id} colisionó con jugador!`);

                // Limpiar según el modo
                if (renderMode === 'drawings' && monster.lastX !== -9999) {
                    this.companionSystem.drawOptimizedPixelArt('monster', 'classic', 4,
                        monster.lastX, monster.lastY, 0, true);
                } else if (renderMode === 'images' && monster.domElement) {
                    if (monster.domElement.parentNode) {
                        monster.domElement.parentNode.removeChild(monster.domElement);
                    }
                }

                monster.active = false;

                if (!this.companionSystem.animationState.damageSequence) {
                    this.companionSystem.executeDamageSequence();
                    this.companionSystem.executeSwordAttack();
                }

                return;
            }

            const deltaX = closestPlayer.x - monster.x;
            const deltaY = closestPlayer.y - monster.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 0) {
                const moveX = (deltaX / distance) * monster.speed;
                const moveY = (deltaY / distance) * monster.speed;

                monster.targetX = monster.x + moveX;
                monster.targetY = monster.y + moveY;

                monster.x = monster.targetX;
                monster.y = monster.targetY;

                monster.chaseMode = distance < 150;
                monster.colorScheme = monster.chaseMode ? 'angry' : 'classic';
            }

            this.drawMonster(monster);
        }

        drawMonster(monster) {
            const newX = Math.round(monster.x);
            const newY = Math.round(monster.y);

            const deltaX = Math.abs(newX - monster.lastX);
            const deltaY = Math.abs(newY - monster.lastY);

            if (deltaX > 2 || deltaY > 2 || monster.needsRedraw) {
                if (renderMode === 'drawings') {
                    if (monster.lastX !== -9999) {
                        this.companionSystem.drawOptimizedPixelArt('monster', 'classic', 4,
                            monster.lastX, monster.lastY, 0, true);
                    }
                    this.companionSystem.drawOptimizedPixelArt('monster', monster.colorScheme, 4,
                        newX, newY, 0, false);
                } else if (renderMode === 'images' && monster.domElement) {
                    // Obtener canvas para posición relativa
                    const canvas = document.getElementById('canvas');
                    if (canvas) {
                        const canvasRect = canvas.getBoundingClientRect();
                        const finalX = canvasRect.left + newX - 30;
                        const finalY = canvasRect.top + newY - 30;

                        monster.domElement.style.left = `${finalX}px`;
                        monster.domElement.style.top = `${finalY}px`;
                    }
                }

                monster.lastX = newX;
                monster.lastY = newY;
                monster.needsRedraw = false;
            }
        }

        clearAllMonsters() {
            console.log('🧹 [MONSTERS] Limpiando todos los monstruos...');

            this.monsters.forEach(monster => {
                if (renderMode === 'drawings' && monster.lastX !== -9999) {
                    this.companionSystem.drawOptimizedPixelArt('monster', 'classic', 4,
                        monster.lastX, monster.lastY, 0, true);
                } else if (renderMode === 'images' && monster.domElement) {
                    if (monster.domElement.parentNode) {
                        monster.domElement.parentNode.removeChild(monster.domElement);
                    }
                }
            });

            this.monsters = [];
            this.lastSpawnTime = 0;
            console.log('🧹 [MONSTERS] Todos los monstruos eliminados');
        }

        getStats() {
            return {
                active: this.monsters.length,
                chasing: this.monsters.filter(m => m.chaseMode).length
            };
        }
    }

    /* ----------  GESTIÓN DE JUGADORES SIMPLIFICADA  ---------- */
    class PlayerManager {
        constructor() {
            this.validPlayers = [];
            this.updateInterval = null;
        }

        updatePlayerOptions() {
            const playerSelect = document.getElementById('player-selector');
            if (!playerSelect) return;

            const currentSelection = playerSelect.value;
            playerSelect.innerHTML = '';

            const playerElements = document.querySelectorAll('.spawnedavatar[data-playerid], .playerlist-row[data-playerid]');
            const validPlayers = [];

            playerElements.forEach(el => {
                const playerId = el.dataset.playerid;

                if (!playerId || playerId === '0' || el.dataset.self === 'true') {
                    return;
                }

                let playerName = '';

                const nicknameEl = el.querySelector('.nickname, .playerlist-name a, .player-name');
                if (nicknameEl) {
                    playerName = nicknameEl.textContent.trim();
                }

                if (!playerName) {
                    const parentRow = el.closest('.playerlist-row');
                    if (parentRow) {
                        const nameEl = parentRow.querySelector('.playerlist-name a, .player-name');
                        if (nameEl) {
                            playerName = nameEl.textContent.trim();
                        }
                    }
                }

                if (!playerName) {
                    playerName = `Player ${playerId}`;
                }

                if (!validPlayers.some(p => p.id === playerId)) {
                    validPlayers.push({
                        id: playerId,
                        name: playerName
                    });
                }
            });

            this.validPlayers = validPlayers;

            if (validPlayers.length === 0) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = '❌ No players available';
                opt.disabled = true;
                playerSelect.appendChild(opt);

                const startBtn = document.getElementById('start-system-btn');
                if (startBtn) startBtn.disabled = true;
            } else {
                const allOpt = document.createElement('option');
                allOpt.value = 'all';
                allOpt.textContent = `🌍 All Players (${validPlayers.length})`;
                playerSelect.appendChild(allOpt);

                validPlayers.forEach(player => {
                    const opt = document.createElement('option');
                    opt.value = player.id;
                    opt.textContent = `🎯 ${player.name}`;
                    opt.dataset.playerName = player.name;
                    playerSelect.appendChild(opt);
                });

                const stillExists = currentSelection === 'all' || validPlayers.some(p => p.id === currentSelection);

                if (currentSelection && stillExists) {
                    playerSelect.value = currentSelection;
                    if (currentSelection === 'all') {
                        selectedPlayerName = 'Todos los jugadores';
                    } else {
                        const selectedPlayer = validPlayers.find(p => p.id === currentSelection);
                        selectedPlayerName = selectedPlayer ? selectedPlayer.name : null;
                    }
                } else if (currentSelection && !stillExists) {
                    playerSelect.value = 'all';
                    selectedPlayerId = 'all';
                    selectedPlayerName = 'Todos los jugadores';
                } else {
                    playerSelect.value = 'all';
                    selectedPlayerId = 'all';
                    selectedPlayerName = 'Todos los jugadores';
                }

                const startBtn = document.getElementById('start-system-btn');
                if (startBtn) startBtn.disabled = false;
            }

            selectedPlayerId = playerSelect.value;
        }

        startAutoUpdate() {
            if (this.updateInterval) return;

            this.updateInterval = setInterval(() => {
                this.updatePlayerOptions();
            }, 2000);

            this.updatePlayerOptions();
        }

        stopAutoUpdate() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }
    }

    /* ----------  SISTEMA DE DIBUJO OPTIMIZADO  ---------- */
    function enqueueDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!drawariaCanvas || !drawariaSocket || !systemActive) return;

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
            drawariaCtx.beginPath();
            drawariaCtx.moveTo(x1, y1);
            drawariaCtx.lineTo(x2, y2);
            drawariaCtx.stroke();
        }
    }

    /* ----------  SISTEMA PRINCIPAL MEJORADO  ---------- */
    class EnhancedPixelCompanionSystem {
        constructor() {
            this.initialized = false;
            this.lives = 3;
            this.lastPlayerPositions = new Map();
            this.playerManager = new PlayerManager();
            this.imageAssetManager = new ImageAssetManager();
            this.monsterSystem = new MonsterSystem(this);

            // Elementos DOM para modo images
            this.imageElements = null;

            this.MOVEMENT_THRESHOLD = 4;
            this.UPDATE_INTERVAL = 80;
            this.lastUpdateTime = 0;
            this.COLLISION_COOLDOWN = 3000;
            this.lastCollisionTime = 0;

            this.companionStates = new Map();
            this.animationState = {
                damageSequence: false,
                swordAttack: false,
                shieldDefend: false
            };

            this.cachedPatterns = this.preOptimizePatterns();
            this.init();
        }

        init() {
            const checkGameReady = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    this.canvasElement = gameCanvas;
                    drawariaCanvas = gameCanvas;
                    this.canvasContext = gameCanvas.getContext('2d');
                    drawariaCtx = gameCanvas.getContext('2d');

                    this.initialized = true;
                    this.createControlInterface();
                    console.log('✅ [PIXEL COMPANIONS] Sistema inicializado correctamente');
                } else {
                    setTimeout(checkGameReady, 100);
                }
            };
            checkGameReady();
        }

        preOptimizePatterns() {
            const optimized = {};
            Object.keys(pixelPatterns).forEach(patternName => {
                optimized[patternName] = this.optimizePatternToLines(pixelPatterns[patternName]);
            });
            return optimized;
        }

        optimizePatternToLines(pattern) {
            const lines = [];
            for (let row = 0; row < pattern.length; row++) {
                let currentLine = null;
                for (let col = 0; col < pattern[row].length; col++) {
                    const char = pattern[row][col];
                    if (char !== ' ') {
                        if (!currentLine || currentLine.char !== char) {
                            if (currentLine) lines.push(currentLine);
                            currentLine = { char, startCol: col, endCol: col, row };
                        } else {
                            currentLine.endCol = col;
                        }
                    } else {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = null;
                        }
                    }
                }
                if (currentLine) lines.push(currentLine);
            }
            return lines;
        }

        createImageElements() {
            console.log('🖼️ [DOM SIMPLE] Creando elementos DOM para companions...');

            // Limpiar elementos previos
            if (this.imageElements) {
                Object.values(this.imageElements).forEach(element => {
                    if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });
            }

            this.imageElements = {};

            const configs = {
                hearts: { width: '80px', height: '30px', url: this.imageAssetManager.imageUrls.hearts },
                sword: { width: '50px', height: '50px', url: this.imageAssetManager.imageUrls.sword },
                shield: { width: '50px', height: '50px', url: this.imageAssetManager.imageUrls.shield }
            };

            // Usar exactamente el mismo método que los monstruos
            Object.entries(configs).forEach(([type, config]) => {
                const element = document.createElement('div');
                element.id = `companion-${type}`;

                element.style.cssText = `
                    position: fixed;
                    width: ${config.width};
                    height: ${config.height};
                    background-image: url('${config.url}');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    pointer-events: none;
                    z-index: 1001;
                    display: block;
                    will-change: transform, left, top;
                    left: 200px;
                    top: 200px;
                `;

                this.imageElements[type] = element;
                document.body.appendChild(element);

                console.log(`✅ [DOM SIMPLE] ${type} creado exitosamente`);
            });
        }

        getTargetPlayerCoords(playerId = null) {
            if (!playerId || playerId === 'all') {
                const allPlayers = [];
                const avatars = document.querySelectorAll('.spawnedavatar[data-playerid]:not([data-playerid="0"]):not(.self)');

                avatars.forEach(avatar => {
                    if (!this.canvasElement) return;

                    const cRect = this.canvasElement.getBoundingClientRect();
                    const aRect = avatar.getBoundingClientRect();

                    if (aRect.width > 0 && aRect.height > 0) {
                        allPlayers.push({
                            id: avatar.dataset.playerid || `player_${allPlayers.length}`,
                            x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                            y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                            width: aRect.width,
                            height: aRect.height
                        });
                    }
                });

                return allPlayers.length > 0 ? allPlayers : null;
            }

            const targetPlayers = [];
            const avatars = document.querySelectorAll(`.spawnedavatar[data-playerid="${playerId}"]`);

            avatars.forEach(avatar => {
                if (!this.canvasElement) return;

                const cRect = this.canvasElement.getBoundingClientRect();
                const aRect = avatar.getBoundingClientRect();

                if (aRect.width > 0 && aRect.height > 0) {
                    targetPlayers.push({
                        id: playerId,
                        x: Math.round((aRect.left - cRect.left) + (aRect.width / 2)),
                        y: Math.round((aRect.top - cRect.top) + (aRect.height / 2)),
                        width: aRect.width,
                        height: aRect.height
                    });
                }
            });

            return targetPlayers.length > 0 ? targetPlayers : null;
        }

        detectCollisionWithOtherPlayers() {
            if (selectedPlayerId === 'all') return false;

            const myPos = this.getTargetPlayerCoords(selectedPlayerId);
            if (!myPos || myPos.length === 0) return false;

            const now = Date.now();
            if (now - this.lastCollisionTime < this.COLLISION_COOLDOWN) {
                return false;
            }

            const otherPlayers = document.querySelectorAll('.spawnedavatar.spawnedavatar-otherplayer');
            const collisionDistance = 45;

            for (let otherPlayer of otherPlayers) {
                if (!this.canvasElement) continue;

                const cRect = this.canvasElement.getBoundingClientRect();
                const otherRect = otherPlayer.getBoundingClientRect();

                const otherX = (otherRect.left - cRect.left) + (otherRect.width / 2);
                const otherY = (otherRect.top - cRect.top) + (otherRect.height / 2);

                const distance = Math.sqrt(
                    Math.pow(myPos.x - otherX, 2) + Math.pow(myPos.y - otherY, 2)
                );

                if (distance < collisionDistance) {
                    this.lastCollisionTime = now;
                    return true;
                }
            }
            return false;
        }

        drawOptimizedPixelArt(patternName, colorScheme, pixelSize, centerX, centerY, rotation = 0, eraseMode = false) {
            const lines = this.cachedPatterns[patternName];
            if (!lines) return;

            let colors;
            if (eraseMode) {
                colors = Object.keys(specificColorSchemes[patternName][colorScheme] || {})
                    .reduce((acc, key) => {
                        acc[key] = key === ' ' ? null : '#FFFFFF';
                        return acc;
                    }, {});
            } else {
                colors = specificColorSchemes[patternName] ?
                         specificColorSchemes[patternName][colorScheme] :
                         specificColorSchemes.heart[colorScheme];
            }

            const patternCenter = Math.floor(pixelPatterns[patternName].length / 2);

            lines.forEach(line => {
                if (!colors[line.char]) return;

                const startX = centerX + (line.startCol - patternCenter) * pixelSize;
                const endX = centerX + (line.endCol - patternCenter) * pixelSize + pixelSize;
                const y = centerY + (line.row - patternCenter) * pixelSize;

                enqueueDrawCommand(startX, y, endX, y, colors[line.char], pixelSize * 1.2);
            });
        }

        async executeDamageSequence() {
            if (this.animationState.damageSequence || this.lives <= 0) return;

            this.animationState.damageSequence = true;
            console.log(`💔 [PIXEL COMPANIONS] ¡Daño recibido! Vidas restantes: ${this.lives - 1}`);

            this.lives--;

            if (this.lives <= 0) {
                console.log('💀 [PIXEL COMPANIONS] ¡Sin vidas! Reiniciando sistema...');
                await new Promise(r => setTimeout(r, 2000));
                this.lives = 3;
                console.log('🔄 [PIXEL COMPANIONS] Sistema reiniciado con 3 vidas');
            }

            this.animationState.damageSequence = false;
        }

        async executeSwordAttack() {
            if (this.animationState.swordAttack) return;

            this.animationState.swordAttack = true;
            console.log('⚔️ [PIXEL COMPANIONS] ¡Ejecutando ataque con espada!');

            await new Promise(r => setTimeout(r, 1000));

            this.animationState.swordAttack = false;
        }

        async executeShieldDefense() {
            if (this.animationState.shieldDefend) return;

            this.animationState.shieldDefend = true;
            console.log('🛡️ [PIXEL COMPANIONS] ¡Activando defensa con escudo!');

            await new Promise(r => setTimeout(r, 800));

            this.animationState.shieldDefend = false;
        }

        async cleanCanvas() {
            if (!drawariaCanvas) return;

            console.log('🧹 [PIXEL COMPANIONS] Limpiando canvas...');

            const canvasWidth = drawariaCanvas.width;
            const canvasHeight = drawariaCanvas.height;

            for (let y = 0; y < canvasHeight; y += 100) {
                for (let x = 0; x < canvasWidth; x += 100) {
                    const width = Math.min(100, canvasWidth - x);
                    const height = Math.min(100, canvasHeight - y);
                    enqueueDrawCommand(x, y, x + width, y + height, '#FFFFFF', Math.max(width, height));
                    await sleep(5);
                }
            }

            if (drawariaCtx) {
                drawariaCtx.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            console.log('🧹 [PIXEL COMPANIONS] Canvas limpiado completamente!');
        }

        updateCompanions() {
            if (!systemActive || !this.initialized) return;

            const now = Date.now();
            if (now - this.lastUpdateTime < this.UPDATE_INTERVAL) return;

            const targetPlayers = this.getTargetPlayerCoords(selectedPlayerId);
            if (!targetPlayers) return;

            this.monsterSystem.updateMonsters();

            if (selectedPlayerId !== 'all') {
                const collision = this.detectCollisionWithOtherPlayers();
                if (collision && !this.animationState.damageSequence) {
                    this.executeDamageSequence();
                    this.executeSwordAttack();
                    this.executeShieldDefense();
                }
            }

            targetPlayers.forEach(player => {
                this.updateCompanionForPlayer(player);
            });

            this.lastUpdateTime = now;
        }

        updateCompanionForPlayer(player) {
            const playerId = player.id;

            if (!this.companionStates.has(playerId)) {
                this.companionStates.set(playerId, {
                    hearts: Array(3).fill().map(() => ({ active: true, lastX: -9999, lastY: -9999, needsRedraw: true })),
                    sword: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true },
                    shield: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true }
                });
            }

            const state = this.companionStates.get(playerId);
            const lastPos = this.lastPlayerPositions.get(playerId) || { x: 0, y: 0 };

            const deltaX = Math.abs(player.x - lastPos.x);
            const deltaY = Math.abs(player.y - lastPos.y);
            const significantMovement = deltaX > this.MOVEMENT_THRESHOLD || deltaY > this.MOVEMENT_THRESHOLD;

            // Renderizado según el modo
            if (renderMode === 'drawings') {
                this.updateCompanionDrawings(player, state, significantMovement);
            } else if (renderMode === 'images') {
                this.updateCompanionImages(player, state, significantMovement);
            }

            if (significantMovement) {
                this.lastPlayerPositions.set(playerId, { x: player.x, y: player.y });
            }
        }

        updateCompanionDrawings(player, state, significantMovement) {
            if (activeComponents.hearts) {
                for (let i = 0; i < 3; i++) {
                    const heartX = player.x + (i - 1) * 32;
                    const heartY = player.y - player.height / 2 - 25;

                    if (significantMovement || state.hearts[i].needsRedraw) {
                        if (state.hearts[i].lastX !== -9999) {
                            this.drawOptimizedPixelArt('heart', 'classic', 3,
                                state.hearts[i].lastX, state.hearts[i].lastY, 0, true);
                        }

                        const scheme = state.hearts[i].active ? 'classic' : 'dark';
                        this.drawOptimizedPixelArt('heart', scheme, 3, heartX, heartY, 0, false);

                        state.hearts[i].lastX = heartX;
                        state.hearts[i].lastY = heartY;
                        state.hearts[i].needsRedraw = false;
                    }
                }
            }

            if (activeComponents.sword) {
                const swordX = player.x + player.width / 2 + 30;
                const swordY = player.y;

                if (significantMovement || state.sword.needsRedraw) {
                    if (state.sword.lastX !== -9999) {
                        this.drawOptimizedPixelArt('sword', 'classic', 5,
                            state.sword.lastX, state.sword.lastY, 0, true);
                    }

                    this.drawOptimizedPixelArt('sword', 'classic', 5, swordX, swordY, state.sword.rotation, false);

                    state.sword.lastX = swordX;
                    state.sword.lastY = swordY;
                    state.sword.needsRedraw = false;
                }
            }

            if (activeComponents.shield) {
                const shieldX = player.x - player.width / 2 - 30;
                const shieldY = player.y;

                if (significantMovement || state.shield.needsRedraw) {
                    if (state.shield.lastX !== -9999) {
                        this.drawOptimizedPixelArt('shield', 'classic', 5,
                            state.shield.lastX, state.shield.lastY, 0, true);
                    }

                    this.drawOptimizedPixelArt('shield', 'classic', 5, shieldX, shieldY, 0, false);

                    state.shield.lastX = shieldX;
                    state.shield.lastY = shieldY;
                    state.shield.needsRedraw = false;
                }
            }
        }

        // ✅ FUNCIÓN COMPLETA: updateCompanionImages
        updateCompanionImages(player, state, significantMovement) {
            // Crear elementos si no existen
            if (!this.imageElements) {
                this.createImageElements();
                return;
            }

            // Obtener canvas para posición relativa (igual que los monstruos)
            const canvas = document.getElementById('canvas');
            if (!canvas) return;

            const canvasRect = canvas.getBoundingClientRect();

            // ✅ ACTUALIZAR HEARTS (usando método exacto de monstruos)
            if (activeComponents.hearts && this.imageElements.hearts) {
                const heartsElement = this.imageElements.hearts;
                // Posicionar arriba del jugador, centrado
                const heartsX = canvasRect.left + player.x - 40; // Centrar (80px width / 2)
                const heartsY = canvasRect.top + player.y - player.height / 2 - 40;

                heartsElement.style.left = `${heartsX}px`;
                heartsElement.style.top = `${heartsY}px`;
                heartsElement.style.display = 'block';
            } else if (this.imageElements?.hearts) {
                this.imageElements.hearts.style.display = 'none';
            }

            // ✅ ACTUALIZAR SWORD (usando método exacto de monstruos)
            if (activeComponents.sword && this.imageElements.sword) {
                const swordElement = this.imageElements.sword;
                // Posicionar a la derecha del jugador
                const swordX = canvasRect.left + player.x + player.width / 2 + 30 - 25; // 30 offset - 25 center
                const swordY = canvasRect.top + player.y - 25; // Centrar verticalmente

                swordElement.style.left = `${swordX}px`;
                swordElement.style.top = `${swordY}px`;
                swordElement.style.display = 'block';
            } else if (this.imageElements?.sword) {
                this.imageElements.sword.style.display = 'none';
            }

            // ✅ ACTUALIZAR SHIELD (usando método exacto de monstruos)
            if (activeComponents.shield && this.imageElements.shield) {
                const shieldElement = this.imageElements.shield;
                // Posicionar a la izquierda del jugador
                const shieldX = canvasRect.left + player.x - player.width / 2 - 30 - 25; // 30 offset - 25 center
                const shieldY = canvasRect.top + player.y - 25; // Centrar verticalmente

                shieldElement.style.left = `${shieldX}px`;
                shieldElement.style.top = `${shieldY}px`;
                shieldElement.style.display = 'block';
            } else if (this.imageElements?.shield) {
                this.imageElements.shield.style.display = 'none';
            }
        }

        // ✅ FUNCIÓN COMPLETA: debugCompanionSystem
        debugCompanionSystem() {
            console.log('🐛 [SYSTEM DEBUG] === ESTADO DEL SISTEMA ===');
            console.log('System active:', systemActive);
            console.log('Render mode:', renderMode);
            console.log('Selected player:', selectedPlayerId);
            console.log('Active components:', activeComponents);
            console.log('Image elements exists:', !!this.imageElements);
            console.log('Canvas element:', !!this.canvasElement);

            // Debug de jugadores target
            const targetPlayers = this.getTargetPlayerCoords(selectedPlayerId);
            console.log('Target players found:', targetPlayers?.length || 0);
            if (targetPlayers && targetPlayers.length > 0) {
                console.log('First player coords:', targetPlayers);
            }

            if (this.imageElements) {
                Object.keys(this.imageElements).forEach(type => {
                    const element = this.imageElements[type];
                    console.log(`${type}:`, {
                        exists: !!element,
                        display: element?.style.display,
                        left: element?.style.left,
                        top: element?.style.top,
                        inDOM: document.body.contains(element)
                    });
                });
            }

            console.log('🐛 [SYSTEM DEBUG] === FIN DEBUG ===');
        }

        // ✅ FUNCIÓN COMPLETA: verifyElementsInDOM
        verifyElementsInDOM() {
            console.log('🔍 [DOM VERIFY] === VERIFICANDO ELEMENTOS ===');

            if (!this.imageElements) {
                console.error('❌ [DOM VERIFY] imageElements no existe');
                return;
            }

            Object.keys(this.imageElements).forEach(type => {
                const element = document.getElementById(`companion-${type}`);
                const inMemory = this.imageElements[type];
                const inDOM = document.body.contains(inMemory);

                console.log(`${type}:`, {
                    'En DOM por ID': !!element,
                    'En memoria': !!inMemory,
                    'Conectado al DOM': inDOM,
                    'Style ready': !!(inMemory && inMemory.style),
                    'Background set': !!(inMemory && inMemory.style.backgroundImage),
                                        'Position set': !!(inMemory && inMemory.style.left && inMemory.style.top)
                });

                if (inMemory && inDOM) {
                    const rect = inMemory.getBoundingClientRect();
                    console.log(`${type} rect:`, rect);
                }
            });

            console.log('🔍 [DOM VERIFY] === FIN VERIFICACIÓN ===');
        }

        startSystem() {
            if (!this.initialized) {
                console.log('❌ [PIXEL COMPANIONS] Sistema no inicializado. Esperando canvas...');
                return;
            }

            if (!selectedPlayerId) {
                console.log('❌ [PIXEL COMPANIONS] No hay jugador seleccionado');
                return;
            }

            systemActive = true;
            this.playerManager.startAutoUpdate();

            this.companions = {
                hearts: Array(3).fill().map(() => ({ active: true, lastX: -9999, lastY: -9999, needsRedraw: true })),
                sword: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true },
                shield: { rotation: 0, lastX: -9999, lastY: -9999, needsRedraw: true }
            };

            // Crear elementos DOM para modo imágenes
            if (renderMode === 'images') {
                this.createImageElements();
            }

            const updateLoop = () => {
                if (systemActive && this.initialized) {
                    this.updateCompanions();
                    this.updateStatusDisplay();
                }
                if (systemActive) {
                    requestAnimationFrame(updateLoop);
                }
            };
            updateLoop();

            console.log('🎮 [PIXEL COMPANIONS] Sistema iniciado exitosamente');
            console.log(`🎯 [PIXEL COMPANIONS] Target: ${selectedPlayerName || 'Jugador desconocido'}`);
            console.log(`📱 [PIXEL COMPANIONS] Modo de renderizado: ${renderMode}`);
            console.log(`⚙️ [PIXEL COMPANIONS] Componentes activos: ${Object.entries(activeComponents).filter(([,v]) => v).map(([k]) => k).join(', ')}`);

            if (renderMode === 'images') {
                console.log(`🖼️ [IMAGE MODE] Imágenes cargadas: ${this.imageAssetManager.getLoadedImagesCount()}/4`);
                console.log(`🖼️ [IMAGE MODE] Usando elementos DOM como monstruos - Sin rastros!`);
            }
        }

        async stopSystem() {
            console.log('⏹️ [PIXEL COMPANIONS] Deteniendo sistema...');

            systemActive = false;
            this.playerManager.stopAutoUpdate();

            this.monsterSystem.clearAllMonsters();

            // Limpiar elementos DOM individuales (no container)
            if (this.imageElements) {
                Object.values(this.imageElements).forEach(element => {
                    if (element && element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });
                this.imageElements = null;
                console.log('🖼️ [IMAGE MODE] Elementos DOM eliminados');
            }

            // Solo limpiar canvas en modo drawings
            if (renderMode === 'drawings') {
                await this.cleanCanvas();
            }

            commandQueue.length = 0;
            this.companionStates.clear();
            this.lastPlayerPositions.clear();

            this.animationState = {
                damageSequence: false,
                swordAttack: false,
                shieldDefend: false
            };

            this.lives = 3;

            console.log('⏹️ [PIXEL COMPANIONS] Sistema detenido completamente');
        }

        createControlInterface() {
            const existingPanel = document.getElementById('pixel-companions-control');
            if (existingPanel) existingPanel.remove();

            const controlPanel = document.createElement('div');
            controlPanel.id = 'pixel-companions-control';
            controlPanel.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 9999;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                color: white; padding: 20px; border-radius: 15px;
                font-family: 'Segoe UI', Arial, sans-serif;
                border: 2px solid #4fd1c7; min-width: 320px;
                box-shadow: 0 0 30px rgba(79,209,199,0.4);
                font-size: 14px;
            `;

            controlPanel.innerHTML = `
                <div style="text-align: center; font-weight: bold; color: #4fd1c7; margin-bottom: 15px;">
                    🎮 DRAWARIA RPG Mode🗡️
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; color: #FFD700;">🎨 Render Mode:</label>
                    <div style="display: flex; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="render-mode" value="drawings" checked style="accent-color: #4fd1c7;">
                            <span>🖌️ Drawings</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="radio" name="render-mode" value="images" style="accent-color: #4fd1c7;">
                            <span>🖼️ Images (DOM)</span>
                        </label>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #FFD700;">🎯 Target Player:</label>
                    <select id="player-selector" style="width: 100%; padding: 8px; border-radius: 5px; background: #2d2d2d; color: white; border: 1px solid #4fd1c7;">
                        <option value="">🔍 Scanning players...</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 8px; color: #FFD700;">⚙️ Active Components:</label>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" id="hearts-toggle" checked style="accent-color: #FF0000;">
                            <span>💖 Hearts</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" id="sword-toggle" checked style="accent-color: #00FFFF;">
                            <span>⚔️ Sword</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" id="shield-toggle" checked style="accent-color: #FFFF00;">
                            <span>🛡️ Shield</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" id="monsters-toggle" checked style="accent-color: #CC0000;">
                            <span>👹 Monsters</span>
                        </label>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="start-system-btn" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #00FF00, #32CD32); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;" disabled>
                        ▶️ START
                    </button>
                    <button id="stop-system-btn" style="flex: 1; padding: 10px; background: linear-gradient(135deg, #FF4444, #CC0000); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;" disabled>
                        ⏹️ STOP
                    </button>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="debug-system-btn" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #FF8C00, #FF6347); color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        🐛 DEBUG
                    </button>
                    <button id="verify-dom-btn" style="flex: 1; padding: 8px; background: linear-gradient(135deg, #9370DB, #8A2BE2); color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
                        🔍 VERIFY DOM
                    </button>
                </div>

                <div id="system-status" style="text-align: center; padding: 10px; background: #333; border-radius: 5px; margin-bottom: 10px;">
                    ⏸️ System: <span style="color: #FF6B6B;">STOPPED</span> | Ready to start
                </div>

                <div id="companion-stats" style="font-size: 12px; color: #888;">
                    📊 Players: 0 | Images: 0/4 | Monsters: 0/0 chasing
                </div>

                <div style="font-size: 11px; color: #666; margin-top: 10px; text-align: center;">
                    🖼️ DOM Mode: Images without trails using monster method!
                </div>
            `;

            document.body.appendChild(controlPanel);
            this.setupEventListeners();
        }

        setupEventListeners() {
            const playerSelect = document.getElementById('player-selector');
            const heartsToggle = document.getElementById('hearts-toggle');
            const swordToggle = document.getElementById('sword-toggle');
            const shieldToggle = document.getElementById('shield-toggle');
            const monstersToggle = document.getElementById('monsters-toggle');
            const startBtn = document.getElementById('start-system-btn');
            const stopBtn = document.getElementById('stop-system-btn');
            const debugBtn = document.getElementById('debug-system-btn');
            const verifyBtn = document.getElementById('verify-dom-btn');
            const renderModeRadios = document.querySelectorAll('input[name="render-mode"]');

            // Guardar referencia a 'this'
            const self = this;

            // Event listener para modo de renderizado
            renderModeRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const oldMode = renderMode;
                    renderMode = e.target.value;
                    console.log(`🎨 [PIXEL COMPANIONS] Modo de renderizado cambiado a: ${renderMode}`);

                    if (renderMode === 'images') {
                        console.log(`🖼️ [IMAGE MODE] Usando elementos DOM como monstruos - Sin rastros!`);
                    }

                    // Si el sistema está activo y cambiamos el modo, reiniciar companions
                    if (systemActive && oldMode !== renderMode) {
                        console.log('🔄 [PIXEL COMPANIONS] Reiniciando por cambio de modo...');

                        if (oldMode === 'images' && self.imageElements) {
                            Object.values(self.imageElements).forEach(element => {
                                if (element && element.parentNode) {
                                    element.parentNode.removeChild(element);
                                }
                            });
                            self.imageElements = null;
                        }

                        if (self.companionStates) {
                            self.companionStates.forEach(state => {
                                state.hearts.forEach(heart => heart.needsRedraw = true);
                                state.sword.needsRedraw = true;
                                state.shield.needsRedraw = true;
                            });
                        }
                    }
                });
            });

            // Event listeners para botones de debug
            debugBtn?.addEventListener('click', () => {
                self.debugCompanionSystem();
            });

            verifyBtn?.addEventListener('click', () => {
                self.verifyElementsInDOM();
            });

            playerSelect?.addEventListener('change', (e) => {
                selectedPlayerId = e.target.value;

                if (selectedPlayerId === 'all') {
                    selectedPlayerName = 'Todos los jugadores';
                } else if (selectedPlayerId) {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    selectedPlayerName = selectedOption.dataset.playerName ||
                                       selectedOption.textContent.replace('🎯 ', '') ||
                                       `Jugador ${selectedPlayerId}`;
                } else {
                    selectedPlayerName = null;
                }

                if (startBtn) startBtn.disabled = !selectedPlayerId;
            });

            heartsToggle?.addEventListener('change', (e) => {
                activeComponents.hearts = e.target.checked;
                console.log(`💖 [PIXEL COMPANIONS] Corazones: ${e.target.checked ? 'Activados' : 'Desactivados'}`);
            });

            swordToggle?.addEventListener('change', (e) => {
                activeComponents.sword = e.target.checked;
                console.log(`⚔️ [PIXEL COMPANIONS] Espada: ${e.target.checked ? 'Activada' : 'Desactivada'}`);
            });

            shieldToggle?.addEventListener('change', (e) => {
                activeComponents.shield = e.target.checked;
                console.log(`🛡️ [PIXEL COMPANIONS] Escudo: ${e.target.checked ? 'Activado' : 'Desactivado'}`);
            });

            monstersToggle?.addEventListener('change', (e) => {
                activeComponents.monsters = e.target.checked;
                console.log(`👹 [MONSTERS] Monstruos: ${e.target.checked ? 'Activados' : 'Desactivados'}`);

                if (!e.target.checked && self.monsterSystem) {
                    self.monsterSystem.clearAllMonsters();
                }
            });

            startBtn?.addEventListener('click', () => {
                if (!selectedPlayerId) {
                    console.log('🚫 [PIXEL COMPANIONS] Error: No hay jugador seleccionado');
                    return;
                }

                self.startSystem();
                startBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = false;
            });

            stopBtn?.addEventListener('click', async () => {
                stopBtn.disabled = true;
                stopBtn.textContent = '🧹 CLEANING...';

                await self.stopSystem();

                stopBtn.textContent = '⏹️ STOP';
                if (startBtn) startBtn.disabled = false;
                stopBtn.disabled = true;
            });

            setTimeout(() => {
                self.playerManager.startAutoUpdate();
            }, 1000);
        }

        updateStatusDisplay() {
            const statusDiv = document.getElementById('system-status');
            const statsDiv = document.getElementById('companion-stats');

            if (statusDiv) {
                const status = systemActive ?
                    `▶️ System: <span style="color: #00FF00;">ACTIVE</span> | Mode: ${renderMode} | Target: ${selectedPlayerName || 'Unknown'}` :
                    `⏸️ System: <span style="color: #FF6B6B;">STOPPED</span> | Mode: ${renderMode} | Ready to start`;
                statusDiv.innerHTML = status;
            }

            if (statsDiv) {
                const monsterStats = this.monsterSystem.getStats();
                const imagesLoaded = this.imageAssetManager.getLoadedImagesCount();

                statsDiv.textContent = `📊 Players: ${this.playerManager.validPlayers.length} | Images: ${imagesLoaded}/4 | Monsters: ${monsterStats.active}/${monsterStats.chasing} chasing`;
            }
        }
    }

    /* ----------  INICIALIZACIÓN  ---------- */
    let enhancedCompanionSystem = null;

    const initEnhancedSystem = () => {
        if (!enhancedCompanionSystem) {
            console.log('🚀 [PIXEL COMPANIONS] Inicializando Enhanced Pixel Companions System v3.9 DOM MODE...');
            enhancedCompanionSystem = new EnhancedPixelCompanionSystem();

            setTimeout(() => {
                console.log('');
                console.log('✅ [PIXEL COMPANIONS] ENHANCED PIXEL COMPANIONS v3.9 LOADED! (DOM MODE)');
                console.log('🖼️ [DOM MODE] NEW: Images using DOM elements like monsters!');
                console.log('🚫 [DOM MODE] NO TRAILS: Elements move cleanly without canvas interference');
                console.log('📱 [DOM MODE] position: fixed + background-image like monster system');
                console.log('🎨 [RENDER MODE] Toggle: Drawings (canvas) vs Images (DOM)');
                console.log('👹 [MONSTERS] Compatible with both render modes');
                console.log('🧹 [CLEANUP] Smart cleanup: Canvas for drawings, DOM removal for images');
                console.log('⚡ [PERFORMANCE] Smooth following without rastros/estelas');
                console.log('🐛 [DEBUG] Added debug buttons for troubleshooting');
                console.log('');
                console.log('🖼️ [IMAGES] Hearts, Sword, Shield, Monster GIF as DOM elements');
                console.log('🎯 [USAGE] Select "Images (DOM)" mode for clean sprite following!');
                console.log('🔧 [MONSTER METHOD] Using exact same technique as monsters for companions');
                console.log('');
            }, 1000);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedSystem);
    } else {
        setTimeout(initEnhancedSystem, 500);
    }

    setTimeout(initEnhancedSystem, 2000);

    console.log('🌟 [PIXEL COMPANIONS] Enhanced Drawaria Pixel Companions v3.9 DOM MODE loaded! 🌟');
    console.log('🖼️ [DOM MODE] Images follow using monster method - Clean and smooth, no trails!');

})();
