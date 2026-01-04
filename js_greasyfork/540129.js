// ==UserScript==
// @name         DrawariaCraft - Minecraft Full Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms Drawaria.online with a procedurally generated Minecraft-like world overlay.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540129/DrawariaCraft%20-%20Minecraft%20Full%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/540129/DrawariaCraft%20-%20Minecraft%20Full%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS for a pixelated font and general UI styling
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        #drawariacraft-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            font-family: 'Press Start 2P', cursive;
            color: white;
            text-shadow: 1px 1px 0px black;
            box-sizing: border-box;
        }

        #drawariacraft-sky-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgb(135, 206, 235);
            opacity: 0.5;
            transition: background-color 2s ease, opacity 2s ease;
            pointer-events: none;
        }

        #drawariacraft-world {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: 4px solid #5D4037;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-crisp-edges;
            pointer-events: auto;
            cursor: crosshair;
        }

        #drawariacraft-hud {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 5px;
            pointer-events: auto;
            background-color: rgba(0,0,0,0.5);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.7);
        }

        .hud-slot {
            width: 40px;
            height: 40px;
            border: 2px solid #BBBBBB;
            background-color: rgba(100,100,100,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2em;
            cursor: pointer;
            transition: all 0.1s ease;
            position: relative;
        }

        .hud-slot.selected {
            border-color: #FFEA00;
            box-shadow: 0 0 8px #FFEA00;
            background-color: rgba(150,150,150,0.8);
        }

        .hud-slot-count {
            position: absolute;
            bottom: 2px;
            right: 2px;
            font-size: 0.7em;
            color: white;
            text-shadow: 1px 1px 0px black;
        }

        #drawariacraft-toggle-button {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: #4CAF50;
            color: white;
            border: 2px solid #388E3C;
            padding: 8px 12px;
            cursor: pointer;
            font-family: 'Press Start 2P', cursive;
            font-size: 0.8em;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);

    // --- Configuration ---
    const TILE_SIZE = 16;
    const WORLD_WIDTH_TILES = 80;
    const WORLD_HEIGHT_TILES = 50;
    const VIEWPORT_WIDTH_TILES = 40;
    const VIEWPORT_HEIGHT_TILES = 30;

    const WORLD_WIDTH_PX = WORLD_WIDTH_TILES * TILE_SIZE;
    const WORLD_HEIGHT_PX = WORLD_HEIGHT_TILES * TILE_SIZE;
    const VIEWPORT_WIDTH_PX = VIEWPORT_WIDTH_TILES * TILE_SIZE;
    const VIEWPORT_HEIGHT_PX = VIEWPORT_HEIGHT_TILES * TILE_SIZE;

    // --- Global State ---
    let worldCanvas;
    let worldCtx;
    let hudElement;
    let isGameActive = false;

    let player = {
        x: WORLD_WIDTH_PX / 2,
        y: WORLD_HEIGHT_PX / 2,
        velY: 0,
        width: TILE_SIZE,
        height: TILE_SIZE * 1.5
    };
    let worldData = [];
    let hotbar = [
        {id: 1, count: 64},
        {id: 2, count: 64},
        {id: 3, count: 64},
        {id: 4, count: 64},
        {id: 0, count: 0},
        {id: 0, count: 0},
        {id: 0, count: 0},
        {id: 0, count: 0},
        {id: 0, count: 0}
    ];
    let selectedHotbarSlot = 0;
    let particles = [];
    let gameLoopInterval;
    let dayCycleTime = 0;

    // --- Block Types ---
    const BLOCK_TYPES = {
        0: { name: 'Air', color: 'rgba(0,0,0,0)', pixelArt: null },
        1: { name: 'Grass', baseColor: '#4CAF50', sideColor: '#689F38', dirtColor: '#795548', pixelArt: drawGrassBlock },
        2: { name: 'Dirt', baseColor: '#795548', pixelArt: drawSolidColor },
        3: { name: 'Stone', baseColor: '#9E9E9E', pixelArt: drawNoiseBlock },
        4: { name: 'Wood', baseColor: '#795548', stripeColor: '#5D4037', pixelArt: drawStripedBlock },
        5: { name: 'Leaves', baseColor: '#8BC34A', pixelArt: drawNoiseBlock },
        6: { name: 'Water', baseColor: 'rgba(33, 150, 243, 0.7)', pixelArt: drawSolidColor },
        7: { name: 'Lava', baseColor: 'rgba(255, 87, 34, 0.8)', glowColor: 'rgba(255, 152, 0, 0.5)', pixelArt: drawNoiseBlock },
        8: { name: 'Glowstone', baseColor: '#FFEB3B', glowColor: 'rgba(255, 235, 59, 0.8)', pixelArt: drawNoiseBlock }
    };

    // --- Pixel Art Drawing Functions ---
    function drawSolidColor(ctx, x, y, block) {
        ctx.fillStyle = block.baseColor;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }

    function drawNoiseBlock(ctx, x, y, block) {
        ctx.fillStyle = block.baseColor;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }

    function drawGrassBlock(ctx, x, y, block) {
        ctx.fillStyle = block.baseColor;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE / 4);
        ctx.fillStyle = block.dirtColor;
        ctx.fillRect(x, y + TILE_SIZE / 4, TILE_SIZE, TILE_SIZE * 3 / 4);
    }

    function drawStripedBlock(ctx, x, y, block) {
        ctx.fillStyle = block.baseColor;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }

    // --- World Generation ---
    function generateWorld() {
        worldData = Array(WORLD_HEIGHT_TILES).fill(0).map(() => Array(WORLD_WIDTH_TILES).fill(0));

        for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
            const surfaceY = Math.floor(Math.random() * 10) + WORLD_HEIGHT_TILES / 2 - 5;

            for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
                if (y < surfaceY) {
                    worldData[y][x] = 0;
                } else if (y === surfaceY) {
                    worldData[y][x] = 1;
                } else if (y > surfaceY && y < surfaceY + 5) {
                    worldData[y][x] = 2;
                } else {
                    worldData[y][x] = 3;
                }
            }
        }

        player.y = (Math.random() * 10) + WORLD_HEIGHT_TILES / 2 - 5 - player.height / TILE_SIZE;
        if (player.y < 0) player.y = 0;
    }

    // --- Game Loop ---
    function update() {
        if (!isGameActive) return;

        player.velY += 0.5;
        player.y += player.velY;

        const playerBottomTileY = Math.floor((player.y + player.height) / TILE_SIZE);
        const playerLeftTileX = Math.floor(player.x / TILE_SIZE);
        const playerRightTileX = Math.floor((player.x + player.width) / TILE_SIZE);

        let onGround = false;
        for (let i = playerLeftTileX; i <= playerRightTileX; i++) {
            if (playerBottomTileY < WORLD_HEIGHT_TILES && playerBottomTileY >= 0 &&
                i < WORLD_WIDTH_TILES && i >= 0 &&
                worldData[playerBottomTileY][i] !== 0 && worldData[playerBottomTileY][i] !== 6 && worldData[playerBottomTileY][i] !== 7) {
                player.y = playerBottomTileY * TILE_SIZE - player.height;
                player.velY = 0;
                onGround = true;
                break;
            }
        }
        if (!onGround && player.y + player.height > WORLD_HEIGHT_PX) {
            player.y = 0;
            player.x = WORLD_WIDTH_PX / 2;
            player.velY = 0;
        }

        particles.forEach(p => {
            p.x += p.velX;
            p.y += p.velY;
            p.velY += 0.2;
            p.alpha -= 0.02;
        });
        particles = particles.filter(p => p.alpha > 0);

        dayCycleTime = (dayCycleTime + 1) % 2400;
        const normalizedTime = dayCycleTime / 2400;

        let skyColor, ambientLight;
        if (normalizedTime < 0.25) {
            const t = normalizedTime / 0.25;
            skyColor = `rgb(${Math.floor(lerp(50, 135, t))}, ${Math.floor(lerp(50, 206, t))}, ${Math.floor(lerp(150, 235, t))})`;
            ambientLight = lerp(0.3, 1.0, t);
        } else if (normalizedTime < 0.75) {
            skyColor = `rgb(135, 206, 235)`;
            ambientLight = 1.0;
        } else {
            const t = (normalizedTime - 0.75) / 0.25;
            skyColor = `rgb(${Math.floor(lerp(135, 50, t))}, ${Math.floor(lerp(206, 50, t))}, ${Math.floor(lerp(235, 150, t))})`;
            ambientLight = lerp(1.0, 0.3, t);
        }

        document.getElementById('drawariacraft-sky-overlay').style.backgroundColor = skyColor;
        document.getElementById('drawariacraft-sky-overlay').style.opacity = 0.5 + (0.5 * (1 - ambientLight));

        render(ambientLight);
    }

    function render(ambientLight) {
        worldCtx.clearRect(0, 0, VIEWPORT_WIDTH_PX, VIEWPORT_HEIGHT_PX);

        const cameraOffsetX = Math.max(0, Math.min(WORLD_WIDTH_PX - VIEWPORT_WIDTH_PX, player.x - VIEWPORT_WIDTH_PX / 2));
        const cameraOffsetY = Math.max(0, Math.min(WORLD_HEIGHT_PX - VIEWPORT_HEIGHT_PX, player.y - VIEWPORT_HEIGHT_PX / 2));

        worldCtx.save();
        worldCtx.translate(-cameraOffsetX, -cameraOffsetY);

        const startTileX = Math.max(0, Math.floor(cameraOffsetX / TILE_SIZE));
        const endTileX = Math.min(WORLD_WIDTH_TILES, startTileX + VIEWPORT_WIDTH_TILES + 1);
        const startTileY = Math.max(0, Math.floor(cameraOffsetY / TILE_SIZE));
        const endTileY = Math.min(WORLD_HEIGHT_TILES, startTileY + VIEWPORT_HEIGHT_TILES + 1);

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const blockId = worldData[y][x];
                if (blockId !== 0) {
                    const block = BLOCK_TYPES[blockId];
                    const drawX = x * TILE_SIZE;
                    const drawY = y * TILE_SIZE;

                    worldCtx.filter = `brightness(${ambientLight})`;

                    if (block.glowColor) {
                        worldCtx.shadowBlur = TILE_SIZE / 2;
                        worldCtx.shadowColor = block.glowColor;
                    } else {
                        worldCtx.shadowBlur = 0;
                    }

                    if (block.pixelArt) {
                        block.pixelArt(worldCtx, drawX, drawY, block);
                    } else {
                        worldCtx.fillStyle = block.baseColor || '#FFFFFF';
                        worldCtx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }
        worldCtx.filter = 'none';
        worldCtx.shadowBlur = 0;

        worldCtx.fillStyle = 'brown';
        worldCtx.fillRect(player.x, player.y, player.width, player.height / 2);
        worldCtx.fillStyle = 'blue';
        worldCtx.fillRect(player.x, player.y + player.height / 2, player.width, player.height / 2);

        particles.forEach(p => {
            worldCtx.globalAlpha = p.alpha;
            worldCtx.fillStyle = p.color;
            worldCtx.fillRect(p.x, p.y, p.size, p.size);
            worldCtx.globalAlpha = 1.0;
        });

        worldCtx.restore();
    }

    function lerp(a, b, t) {
        return a + t * (b - a);
    }

    // --- Input Handling ---
    let keys = {};
    function handleKeyDown(e) {
        if (!isGameActive) return;
        keys[e.key] = true;
        if (e.key === ' ') {
            if (player.velY === 0) {
                player.velY = -8;
            }
            e.preventDefault();
        }
        if (e.key >= '1' && e.key <= '9') {
            selectedHotbarSlot = parseInt(e.key) - 1;
            updateHotbarDisplay();
        }
    }

    function handleKeyUp(e) {
        if (!isGameActive) return;
        keys[e.key] = false;
    }

    function handleGameMovement() {
        if (!isGameActive) return;
        if (keys['a'] || keys['A']) {
            player.x -= 5;
        }
        if (keys['d'] || keys['D']) {
            player.x += 5;
        }
        player.x = Math.max(0, Math.min(WORLD_WIDTH_PX - player.width, player.x));
    }

    function handleMouseClick(e) {
        if (!isGameActive || e.target !== worldCanvas) return;

        const rect = worldCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const cameraOffsetX = Math.max(0, Math.min(WORLD_WIDTH_PX - VIEWPORT_WIDTH_PX, player.x - VIEWPORT_WIDTH_PX / 2));
        const cameraOffsetY = Math.max(0, Math.min(WORLD_HEIGHT_PX - VIEWPORT_HEIGHT_PX, player.y - VIEWPORT_HEIGHT_PX / 2));

        const worldClickX = mouseX + cameraOffsetX;
        const worldClickY = mouseY + cameraOffsetY;

        const tileX = Math.floor(worldClickX / TILE_SIZE);
        const tileY = Math.floor(worldClickY / TILE_SIZE);

        if (tileX >= 0 && tileX < WORLD_WIDTH_TILES && tileY >= 0 && tileY < WORLD_HEIGHT_TILES) {
            if (e.button === 0) {
                if (worldData[tileY][tileX] !== 0) {
                    const brokenBlockId = worldData[tileY][tileX];
                    worldData[tileY][tileX] = 0;

                    for (let i = 0; i < 5; i++) {
                        particles.push({
                            x: tileX * TILE_SIZE + Math.random() * TILE_SIZE,
                            y: tileY * TILE_SIZE + Math.random() * TILE_SIZE,
                            velX: Math.random() * 4 - 2,
                            velY: Math.random() * -3,
                            size: TILE_SIZE / 4,
                            color: BLOCK_TYPES[brokenBlockId].baseColor || '#FFFFFF',
                            alpha: 1
                        });
                    }
                }
            } else if (e.button === 2) {
                const selectedBlock = hotbar[selectedHotbarSlot];
                if (selectedBlock.id !== 0 && selectedBlock.count > 0) {
                    const playerTileX = Math.floor(player.x / TILE_SIZE);
                    const playerTileY = Math.floor(player.y / TILE_SIZE);
                    const playerEndTileX = Math.floor((player.x + player.width - 1) / TILE_SIZE);
                    const playerEndTileY = Math.floor((player.y + player.height - 1) / TILE_SIZE);

                    let canPlace = true;
                    if (tileX >= playerTileX && tileX <= playerEndTileX &&
                        tileY >= playerTileY && tileY <= playerEndTileY) {
                        canPlace = false;
                    }
                    if (worldData[tileY][tileX] !== 0 && worldData[tileY][tileX] !== 6 && worldData[tileY][tileX] !== 7) {
                        canPlace = false;
                    }

                    if (canPlace) {
                        worldData[tileY][tileX] = selectedBlock.id;
                        selectedBlock.count--;
                        updateHotbarDisplay();
                    }
                }
            }
        }
    }

    // --- UI Elements & Functions ---
    function createUI() {
        const overlay = document.createElement('div');
        overlay.id = 'drawariacraft-overlay';
        document.body.appendChild(overlay);

        const skyOverlay = document.createElement('div');
        skyOverlay.id = 'drawariacraft-sky-overlay';
        overlay.appendChild(skyOverlay);

        worldCanvas = document.createElement('canvas');
        worldCanvas.id = 'drawariacraft-world';
        worldCanvas.width = VIEWPORT_WIDTH_PX;
        worldCanvas.height = VIEWPORT_HEIGHT_PX;
        worldCtx = worldCanvas.getContext('2d');
        worldCtx.imageSmoothingEnabled = false;
        overlay.appendChild(worldCanvas);

        hudElement = document.createElement('div');
        hudElement.id = 'drawariacraft-hud';
        overlay.appendChild(hudElement);
        updateHotbarDisplay();

        const toggleButton = document.createElement('button');
        toggleButton.id = 'drawariacraft-toggle-button';
        toggleButton.textContent = 'Activar DrawariaCraft';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', toggleGame);
        worldCanvas.addEventListener('mousedown', (e) => {
            if (e.button === 2) e.preventDefault();
        });
        worldCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
        worldCanvas.addEventListener('mouseup', handleMouseClick);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        setInterval(handleGameMovement, 1000 / 60);
    }

    function updateHotbarDisplay() {
        hudElement.innerHTML = '';
        hotbar.forEach((slot, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('hud-slot');
            if (index === selectedHotbarSlot) {
                slotDiv.classList.add('selected');
            }
            slotDiv.dataset.slotIndex = index;
            slotDiv.addEventListener('click', () => {
                selectedHotbarSlot = index;
                updateHotbarDisplay();
            });

            if (slot.id !== 0) {
                const blockType = BLOCK_TYPES[slot.id];
                const blockDisplayCanvas = document.createElement('canvas');
                blockDisplayCanvas.width = TILE_SIZE * 2;
                blockDisplayCanvas.height = TILE_SIZE * 2;
                const bdcCtx = blockDisplayCanvas.getContext('2d');
                bdcCtx.imageSmoothingEnabled = false;
                bdcCtx.scale(2, 2);
                if (blockType && blockType.pixelArt) {
                    blockType.pixelArt(bdcCtx, 0, 0, blockType);
                } else if (blockType) {
                    bdcCtx.fillStyle = blockType.baseColor || '#FFFFFF';
                    bdcCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
                }
                slotDiv.appendChild(blockDisplayCanvas);

                if (slot.count > 1 || (slot.count === 1 && hotbar[selectedHotbarSlot].id !== 0)) {
                    const countSpan = document.createElement('span');
                    countSpan.classList.add('hud-slot-count');
                    countSpan.textContent = slot.count;
                    slotDiv.appendChild(countSpan);
                }
            }
            hudElement.appendChild(slotDiv);
        });
    }

    function toggleGame() {
        isGameActive = !isGameActive;
        const overlay = document.getElementById('drawariacraft-overlay');
        const toggleButton = document.getElementById('drawariacraft-toggle-button');

        if (isGameActive) {
            overlay.style.display = 'flex';
            toggleButton.textContent = 'Desactivar DrawariaCraft';
            gameLoopInterval = setInterval(update, 1000 / 60);
        } else {
            overlay.style.display = 'none';
            toggleButton.textContent = 'Activar DrawariaCraft';
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }
    }

    // --- Initialization ---
    function init() {
        createUI();
        generateWorld();
        document.getElementById('drawariacraft-overlay').style.display = 'none';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
