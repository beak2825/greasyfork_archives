// ==UserScript==
// @name         Drawaria DOOM Full Game 3D
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transform Drawaria into a retro first-person maze shooter with procedural graphics and sound!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540131/Drawaria%20DOOM%20Full%20Game%203D.user.js
// @updateURL https://update.greasyfork.org/scripts/540131/Drawaria%20DOOM%20Full%20Game%203D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Game Constants ---
    const MAP_WIDTH = 24;
    const MAP_HEIGHT = 24;
    const TILE_SIZE = 64; // Logical tile size for calculations, not pixel size
    const WALL_HEIGHT = TILE_SIZE; // All walls have same logical height for simple raycasting
    const FOV_DEGREES = 60; // Field of View in degrees
    const FOV_RADIANS = FOV_DEGREES * Math.PI / 180;

    // --- Game State ---
    let player = {
        x: MAP_WIDTH * TILE_SIZE / 2,
        y: MAP_HEIGHT * TILE_SIZE / 2,
        angle: Math.PI / 2, // Looking right initially
        speed: 80, // Pixels per second
        rotationSpeed: 1.5, // Radians per second
        health: 100,
        ammo: 100,
        fireCooldown: 0,
        maxFireCooldown: 0.2 // seconds
    };

    // Maze map: 0 = empty, 1 = wall. Define walls using 1s.
    // This creates a basic maze structure.
    const worldMap = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // Enemies: id, position, state, animation frame, health, type (for drawing)
    const enemies = [
        { id: 'imp1', x: 5.5 * TILE_SIZE, y: 5.5 * TILE_SIZE, alive: true, frame: 0, animSpeed: 0.1, health: 30, type: 'imp' },
        { id: 'zombie1', x: 10.5 * TILE_SIZE, y: 15.5 * TILE_SIZE, alive: true, frame: 0, animSpeed: 0.05, health: 50, type: 'zombie' },
        { id: 'imp2', x: 18.5 * TILE_SIZE, y: 8.5 * TILE_SIZE, alive: true, frame: 0, animSpeed: 0.1, health: 30, type: 'imp' },
        { id: 'imp3', x: 20.5 * TILE_SIZE, y: 18.5 * TILE_SIZE, alive: true, frame: 0, animSpeed: 0.1, health: 30, type: 'imp' },
        { id: 'zombie2', x: 3.5 * TILE_SIZE, y: 18.5 * TILE_SIZE, alive: true, frame: 0, animSpeed: 0.05, health: 50, type: 'zombie' }
    ];

    const particles = []; // For muzzle flash, impact, etc.

    // --- Canvas Setup ---
    let gameCanvas;
    let ctx;
    let screenWidth, screenHeight;

    // --- Input State ---
    const keys = {};

    // --- Audio Context & Sounds ---
    let audioContext;
    let backgroundMusicOscillator;
    let backgroundMusicGain;
    let backgroundMusicNotes = [100, 110, 120, 110, 100, 90, 80, 90]; // Simple "melody"
    let backgroundMusicNoteIndex = 0;
    let backgroundMusicNextNoteTime = 0;

    // --- Game Loop Timing ---
    let lastFrameTime = 0;

    // --- Utility Functions (Colors, Drawing Primitives) ---

    // Convert hex to RGB for procedural shading
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        // Handle #RGB format
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // Handle #RRGGBB format
        else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return { r, g, b };
    }

    // Shade color based on a percentage (for distance shading and wall orientation)
    function shadeColor(color, percent) {
        let { r, g, b } = typeof color === 'string' ? hexToRgb(color) : color;
        r = Math.floor(Math.min(255, Math.max(0, r * (1 + percent))));
        g = Math.floor(Math.min(255, Math.max(0, g * (1 + percent))));
        b = Math.floor(Math.min(255, Math.max(0, b * (1 + percent))));
        return `rgb(${r},${g},${b})`;
    }

    // Procedural sprite drawing (simplified to rectangles with pixel-art-like features)
    function drawSprite(context, spriteData, currentTime) {
        context.save();
        context.translate(spriteData.x, spriteData.y + spriteData.height / 2); // Translate to sprite's screen position, centered vertically

        let fillColor;
        let glowColor = null;

        // Determine base color and glow based on sprite type
        if (spriteData.type === 'imp') {
            fillColor = '#800000'; // Dark red for imp
            glowColor = '#ff0000'; // Red glow
        } else if (spriteData.type === 'zombie') {
            fillColor = '#006400'; // Dark green for zombie
            glowColor = '#00ff00'; // Green glow
        } else if (spriteData.type === 'muzzle') {
            fillColor = '#FFFF00'; // Yellow for muzzle flash
            glowColor = '#FF8C00'; // Orange glow
            context.globalAlpha = spriteData.life; // Muzzle flash fades
        }


        // Simple animation: pulsating effect using current time
        const pulse = Math.sin(currentTime * 0.005) * 0.1 + 0.9; // Oscillates between 0.9 and 1.0
        const shadedFillColor = shadeColor(fillColor, (1 - spriteData.distance / 500) * 0.2); // Shade based on distance
        context.fillStyle = shadedFillColor;
        context.fillRect(-spriteData.width * pulse / 2, -spriteData.height * pulse / 2, spriteData.width * pulse, spriteData.height * pulse);

        // Add "Doom-like" elements for specific types
        if (spriteData.type === 'imp') {
            // Draw eyes (small rectangles)
            const eyeWidth = spriteData.width * 0.1;
            const eyeHeight = spriteData.height * 0.05;
            context.fillStyle = '#FFA500'; // Orange eyes
            context.fillRect(-spriteData.width * 0.2, -spriteData.height * 0.2, eyeWidth, eyeHeight);
            context.fillRect(spriteData.width * 0.1, -spriteData.height * 0.2, eyeWidth, eyeHeight);

            // Simple horns (triangles)
            context.fillStyle = '#4B0082'; // Indigo horns
            context.beginPath();
            context.moveTo(-spriteData.width * 0.3, -spriteData.height * 0.4);
            context.lineTo(-spriteData.width * 0.1, -spriteData.height * 0.2);
            context.lineTo(-spriteData.width * 0.2, -spriteData.height * 0.5);
            context.fill();
            context.beginPath();
            context.moveTo(spriteData.width * 0.3, -spriteData.height * 0.4);
            context.lineTo(spriteData.width * 0.1, -spriteData.height * 0.2);
            context.lineTo(spriteData.width * 0.2, -spriteData.height * 0.5);
            context.fill();
        } else if (spriteData.type === 'zombie') {
            // Draw a simplified "face" on the zombie
            context.fillStyle = '#8B4513'; // Brown for face details
            context.fillRect(-spriteData.width * 0.2, -spriteData.height * 0.2, spriteData.width * 0.4, spriteData.height * 0.1); // Mouth
            context.fillStyle = '#000000'; // Black eyes
            context.fillRect(-spriteData.width * 0.15, -spriteData.height * 0.3, spriteData.width * 0.05, spriteData.height * 0.05);
            context.fillRect(spriteData.width * 0.1, -spriteData.height * 0.3, spriteData.width * 0.05, spriteData.height * 0.05);
        }

        // Add glow effect for enemies (pulsating)
        if (glowColor) {
            for (let j = 0; j < 3; j++) {
                context.globalAlpha = 0.05 * (3 - j) * pulse; // Fade out effect with pulse
                context.fillStyle = glowColor;
                context.fillRect(-spriteData.width * (0.5 + j * 0.05), -spriteData.height * (0.5 + j * 0.05), spriteData.width * (1 + j * 0.1), spriteData.height * (1 + j * 0.1));
            }
        }
        context.globalAlpha = 1; // Reset alpha
        context.restore();
    }

    // --- Audio Functions ---
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            backgroundMusicGain = audioContext.createGain();
            backgroundMusicGain.gain.value = 0.05; // Low volume for background music
            backgroundMusicGain.connect(audioContext.destination);

            startBackgroundMusic();
        }
    }

    // Background music (simple oscillating tone for retro feel)
    function startBackgroundMusic() {
        if (backgroundMusicOscillator) {
            backgroundMusicOscillator.stop();
            backgroundMusicOscillator.disconnect();
        }
        backgroundMusicOscillator = audioContext.createOscillator();
        backgroundMusicOscillator.type = 'sawtooth'; // Aggressive waveform for DOOM-like sound

        backgroundMusicOscillator.connect(backgroundMusicGain);
        backgroundMusicOscillator.start();

        backgroundMusicNextNoteTime = audioContext.currentTime;
        scheduleNextMusicNote();
    }

    // Schedule the next note in the background music sequence
    function scheduleNextMusicNote() {
        if (audioContext && backgroundMusicOscillator) {
            backgroundMusicOscillator.frequency.setValueAtTime(backgroundMusicNotes[backgroundMusicNoteIndex], backgroundMusicNextNoteTime);
            backgroundMusicNoteIndex = (backgroundMusicNoteIndex + 1) % backgroundMusicNotes.length;
            backgroundMusicNextNoteTime += 0.25; // Each note lasts 0.25 seconds
            // Recursive call to schedule the next note, ensuring smooth playback
            const delay = (backgroundMusicNextNoteTime - audioContext.currentTime) * 1000;
            setTimeout(scheduleNextMusicNote, Math.max(0, delay));
        }
    }

    // Play a short sound effect
    function playSoundEffect(frequency, duration, type = 'square', volume = 0.5) {
        initAudio(); // Ensure audio context is initialized
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration); // Fade out to prevent clicks
    }

    // --- Game Initialization ---
    function initGame() {
        // Find existing Drawaria canvas and hide its parent to make space
        const drawariaCanvas = document.getElementById('canvas');
        if (drawariaCanvas) {
            let parentContainer = drawariaCanvas.closest('#main');
            if (parentContainer) {
                parentContainer.style.display = 'none'; // Hide main drawing area
            }
            // Hide other Drawaria UI elements that might interfere
            const uiElementsToHide = [
                '#leftbar', '#rightbar', '#chatbox_messages',
                '#chatbox_textinput', '#roomcontrols', '#playerlist',
                '#discordprombox', '.footer', '#howtoplaybox', '.roomlist',
                '#login-midcol', '#login-rightcol', '#login-leftcol', '#login'
            ];
            uiElementsToHide.forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.style.display = 'none';
            });
        }

        // Create our own game canvas
        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'doomaria-game-canvas';
        document.body.appendChild(gameCanvas);

        // Style the game canvas to fill the screen
        gameCanvas.style.position = 'fixed';
        gameCanvas.style.top = '0';
        gameCanvas.style.left = '0';
        gameCanvas.style.width = '100vw';
        gameCanvas.style.height = '100vh';
        gameCanvas.style.zIndex = '99999'; // Ensure it's on top of everything
        gameCanvas.style.backgroundColor = 'black'; // Background outside game view

        ctx = gameCanvas.getContext('2d');
        resizeCanvas();

        // Add event listeners for input
        window.addEventListener('keydown', (e) => { keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { keys[e.key] = false; });
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('click', handleMouseClick); // For firing

        // Start game loop
        requestAnimationFrame(gameLoop);

        // Initialize audio
        initAudio();
    }

    function resizeCanvas() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        gameCanvas.width = screenWidth;
        gameCanvas.height = screenHeight;
    }

    // --- Game Loop ---
    function gameLoop(currentTime) {
        const deltaTime = (currentTime - lastFrameTime) / 1000; // seconds
        lastFrameTime = currentTime;

        updateGame(deltaTime, currentTime);
        renderGame(currentTime);

        requestAnimationFrame(gameLoop);
    }

    // --- Game State Update ---
    function updateGame(deltaTime, currentTime) {
        // Player movement
        let moveStep = player.speed * deltaTime;
        let rotStep = player.rotationSpeed * deltaTime;

        if (keys['w'] || keys['W']) { // Move forward
            let newX = player.x + Math.cos(player.angle) * moveStep;
            let newY = player.y + Math.sin(player.angle) * moveStep;
            if (worldMap[Math.floor(newY / TILE_SIZE)][Math.floor(newX / TILE_SIZE)] === 0) {
                player.x = newX;
                player.y = newY;
            } else {
                playSoundEffect(100, 0.1, 'triangle', 0.8); // Wall hit sound
            }
        }
        if (keys['s'] || keys['S']) { // Move backward
            let newX = player.x - Math.cos(player.angle) * moveStep;
            let newY = player.y - Math.sin(player.angle) * moveStep;
            if (worldMap[Math.floor(newY / TILE_SIZE)][Math.floor(newX / TILE_SIZE)] === 0) {
                player.x = newX;
                player.y = newY;
            } else {
                playSoundEffect(100, 0.1, 'triangle', 0.8); // Wall hit sound
            }
        }
        if (keys['a'] || keys['A']) { // Rotate left
            player.angle -= rotStep;
        }
        if (keys['d'] || keys['D']) { // Rotate right
            player.angle += rotStep;
        }

        // Keep angle within 0 to 2*PI
        player.angle = player.angle % (2 * Math.PI);
        if (player.angle < 0) player.angle += (2 * Math.PI);

        // Update enemies (simple movement)
        enemies.forEach(enemy => {
            if (enemy.alive) {
                // Simple oscillating movement for 'imp' type
                if (enemy.type === 'imp') {
                    const movementFactor = Math.sin(currentTime * enemy.animSpeed * 0.005);
                    enemy.x += Math.cos(enemy.frame * 0.1) * movementFactor;
                    enemy.y += Math.sin(enemy.frame * 0.1) * movementFactor;
                }
                enemy.frame += enemy.animSpeed * deltaTime;
            }
        });

        // Update particles (move and fade)
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= deltaTime;
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }

        // Update fire cooldown
        if (player.fireCooldown > 0) {
            player.fireCooldown -= deltaTime;
        }
    }

    // Handle mouse click for firing
    function handleMouseClick(event) {
        if (event.button === 0 && player.fireCooldown <= 0 && player.ammo > 0) { // Left click
            playSoundEffect(600, 0.1, 'sawtooth', 0.8); // Shoot sound
            player.ammo--;
            player.fireCooldown = player.maxFireCooldown;

            // Spawn muzzle flash particles
            const muzzleFlashX = screenWidth / 2;
            const muzzleFlashY = screenHeight / 2 + 50; // Below crosshair
            addParticleEffect(muzzleFlashX, muzzleFlashY, 15, {r:255,g:200,b:0}, 5, 200, 0.5);

            // Raycast for hit detection
            const hitRayAngle = player.angle; // Ray directly from player's view center
            const hitRayX = player.x;
            const hitRayY = player.y;

            const dx = Math.cos(hitRayAngle);
            const dy = Math.sin(hitRayAngle);

            let closestEnemyHit = null;
            let minDistance = Infinity;

            enemies.forEach(enemy => {
                if (!enemy.alive) return;

                // Simple AABB collision detection for enemy sprites
                const enemySize = (WALL_HEIGHT / (TILE_SIZE * 0.8)) * screenHeight; // Approximate sprite size
                const enemyHalfSize = enemySize * 0.5;

                // Create a simplified ray-rectangle intersection test in world space
                const enemyWorldMinX = enemy.x - enemyHalfSize;
                const enemyWorldMaxX = enemy.x + enemyHalfSize;
                const enemyWorldMinY = enemy.y - enemyHalfSize;
                const enemyWorldMaxY = enemy.y + enemyHalfSize;

                // Test if ray intersects the enemy's bounding box in world coordinates
                // This is a simplified test, not perfect for arbitrary rotated rays or proper 3D bounding box
                // A more accurate test would involve projecting the ray to 2D screen space after raycasting walls.
                // For a 2.5D setup, we fire a ray from player center and check if it passes through enemy.
                const rayLength = 500; // Max effective range of shot
                for (let step = 0; step < rayLength; step++) {
                    const currentRayWorldX = hitRayX + dx * step;
                    const currentRayWorldY = hitRayY + dy * step;

                    if (currentRayWorldX >= enemyWorldMinX && currentRayWorldX <= enemyWorldMaxX &&
                        currentRayWorldY >= enemyWorldMinY && currentRayWorldY <= enemyWorldMaxY) {

                        const distToEnemy = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));
                        if (distToEnemy < minDistance) {
                            closestEnemyHit = enemy;
                            minDistance = distToEnemy;
                            break; // Hit, no need to check further along this ray for this enemy
                        }
                    }
                }
            });

            if (closestEnemyHit) {
                closestEnemyHit.health -= 25; // Damage enemy
                playSoundEffect(200, 0.1, 'sine', 0.8); // Enemy hit sound
                addParticleEffect(screenWidth/2, screenHeight/2, 20, {r:255,g:0,b:0}, 10, 300, 0.8); // Blood effect

                if (closestEnemyHit.health <= 0) {
                    closestEnemyHit.alive = false;
                    playSoundEffect(50, 0.5, 'triangle', 0.8); // Enemy death sound
                    addParticleEffect(screenWidth/2, screenHeight/2, 50, {r:255,g:100,b:0}, 20, 500, 1.0); // Explosion
                }
            }
        }
    }


    // Add a particle effect (like explosions, blood, muzzle flash)
    function addParticleEffect(centerX, centerY, count, color, sizeRange, speedRange, lifeRange) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * speedRange,
                vy: (Math.random() - 0.5) * speedRange,
                life: Math.random() * lifeRange + 0.1,
                maxLifeAlpha: 1, // Store initial alpha for fading
                size: Math.random() * sizeRange + 1,
                color: color
            });
        }
    }


    // --- Game Rendering ---
    function renderGame(currentTime) {
        // Clear canvas
        ctx.clearRect(0, 0, screenWidth, screenHeight);

        // Sky and Floor (simple gradients for atmospheric perspective)
        let skyGradient = ctx.createLinearGradient(0, 0, 0, screenHeight / 2);
        skyGradient.addColorStop(0, '#000000'); // Black (space)
        skyGradient.addColorStop(0.5, '#1A1A1A'); // Dark gray
        skyGradient.addColorStop(1, '#333333'); // Lighter gray (distant fog)
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, screenWidth, screenHeight / 2);

        let floorGradient = ctx.createLinearGradient(0, screenHeight / 2, 0, screenHeight);
        floorGradient.addColorStop(0, '#444444'); // Lighter gray (near floor)
        floorGradient.addColorStop(1, '#111111'); // Darker gray (distant floor)
        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, screenHeight / 2, screenWidth, screenHeight / 2);

        // Raycasting for walls
        const numRays = screenWidth; // One ray per pixel column for resolution
        const angleStep = FOV_RADIANS / numRays;

        for (let i = 0; i < numRays; i++) {
            let rayAngle = (player.angle - FOV_RADIANS / 2) + (i * angleStep);

            let currentMapX = Math.floor(player.x / TILE_SIZE);
            let currentMapY = Math.floor(player.y / TILE_SIZE);

            let deltaDistX = Math.abs(TILE_SIZE / Math.cos(rayAngle));
            let deltaDistY = Math.abs(TILE_SIZE / Math.sin(rayAngle));

            let stepX, stepY;
            let sideDistX, sideDistY;

            if (Math.cos(rayAngle) < 0) {
                stepX = -1;
                sideDistX = (player.x - currentMapX * TILE_SIZE) / Math.abs(Math.cos(rayAngle));
            } else {
                stepX = 1;
                sideDistX = ((currentMapX + 1) * TILE_SIZE - player.x) / Math.abs(Math.cos(rayAngle));
            }
            if (Math.sin(rayAngle) < 0) {
                stepY = -1;
                sideDistY = (player.y - currentMapY * TILE_SIZE) / Math.abs(Math.sin(rayAngle));
            } else {
                stepY = 1;
                sideDistY = ((currentMapY + 1) * TILE_SIZE - player.y) / Math.abs(Math.sin(rayAngle));
            }

            let hitWall = false;
            let wallSide = 0; // 0 = vertical wall hit (X-axis parallel), 1 = horizontal wall hit (Y-axis parallel)
            let wallDist = 0;

            while (!hitWall && wallDist < 10000) { // Max distance to prevent infinite loop
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    currentMapX += stepX;
                    wallSide = 0;
                } else {
                    sideDistY += deltaDistY;
                    currentMapY += stepY;
                    wallSide = 1;
                }

                if (currentMapX >= 0 && currentMapX < MAP_WIDTH && currentMapY >= 0 && currentMapY < MAP_HEIGHT) {
                    if (worldMap[currentMapY][currentMapX] > 0) {
                        hitWall = true;
                    }
                } else {
                    // Ray went out of bounds, treat as hit at max distance
                    hitWall = true;
                    wallDist = 10000;
                }
            }

            // Calculate distance to wall
            if (wallSide === 0) {
                wallDist = (currentMapX * TILE_SIZE - player.x + (1 - stepX) / 2 * TILE_SIZE) / Math.cos(rayAngle);
            } else {
                wallDist = (currentMapY * TILE_SIZE - player.y + (1 - stepY) / 2 * TILE_SIZE) / Math.sin(rayAngle);
            }

            // Correct fisheye lens distortion
            wallDist *= Math.cos(player.angle - rayAngle);

            // Calculate wall height on screen
            let wallSliceHeight = (WALL_HEIGHT / wallDist) * screenHeight;

            let drawStart = (screenHeight / 2) - (wallSliceHeight / 2);
            let drawEnd = (screenHeight / 2) + (wallSliceHeight / 2);

            // Apply shading based on distance and wall orientation for depth
            let baseColor = '#777777'; // Gray wall
            if (wallSide === 1) { // Horizontal walls are darker (common raycaster trick)
                baseColor = '#555555';
            }

            // Shade more based on distance
            const shadeFactor = Math.min(1, Math.max(0, wallDist / (TILE_SIZE * 8))); // Max shade at 8 tiles distance
            const finalColor = shadeColor(baseColor, -shadeFactor * 0.7); // Darken by up to 70%

            ctx.fillStyle = finalColor;
            ctx.fillRect(i, drawStart, 1, wallSliceHeight);
        }

        // Sort and draw sprites (enemies & muzzle flash)
        const visibleSprites = [];

        // Add enemies to visible sprites list
        enemies.forEach(enemy => {
            if (enemy.alive) {
                // Calculate distance from player to enemy
                const distToEnemy = Math.sqrt(Math.pow(enemy.x - player.x, 2) + Math.pow(enemy.y - player.y, 2));

                // If enemy is too close or too far, don't draw (optimization/clipping)
                if (distToEnemy < 10 || distToEnemy > 1000) return;

                // Calculate angle of enemy relative to player
                let angleToEnemy = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                let relativeAngle = angleToEnemy - player.angle;

                // Normalize relative angle to be within -PI to PI
                if (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
                if (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;

                // Check if enemy is within FOV
                if (Math.abs(relativeAngle) < FOV_RADIANS / 2) {
                    // Project enemy onto screen
                    const spriteScreenX = screenWidth / 2 + (relativeAngle / (FOV_RADIANS / 2)) * (screenWidth / 2);
                    const spriteHeight = (WALL_HEIGHT / distToEnemy) * screenHeight;
                    const spriteWidth = spriteHeight * 0.8; // Adjust aspect ratio if desired

                    visibleSprites.push({
                        id: enemy.id,
                        x: spriteScreenX,
                        y: (screenHeight / 2) - (spriteHeight / 2),
                        width: spriteWidth,
                        height: spriteHeight,
                        distance: distToEnemy,
                        type: enemy.type,
                        frame: enemy.frame,
                        health: enemy.health
                    });
                }
            }
        });

        // Sort sprites by distance (farthest to nearest) for proper drawing order
        visibleSprites.sort((a, b) => b.distance - a.distance);

        visibleSprites.forEach(sprite => {
            drawSprite(ctx, sprite, currentTime);
        });

        // Render particles
        ctx.globalAlpha = 0.8;
        particles.forEach(p => {
            ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.life * p.maxLifeAlpha})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        ctx.globalAlpha = 1;


        // --- HUD / UI Elements ---
        ctx.font = 'bold 20px "Press Start 2P", monospace'; // Use monospace as fallback
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Doom-style health bar
        ctx.fillStyle = '#6a0a0a'; // Dark red for health bar background
        ctx.fillRect(screenWidth * 0.02, screenHeight * 0.88, screenWidth * 0.25, screenHeight * 0.04);
        ctx.fillStyle = '#ff0000'; // Bright red for health value
        ctx.fillRect(screenWidth * 0.02, screenHeight * 0.88, screenWidth * 0.25 * (player.health / 100), screenHeight * 0.04);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenWidth * 0.02, screenHeight * 0.88, screenWidth * 0.25, screenHeight * 0.04);
        ctx.fillStyle = 'white';
        ctx.fillText(`HEALTH: ${player.health}%`, screenWidth * 0.02 + 10, screenHeight * 0.88 + 8);


        // Doom-style ammo bar
        ctx.fillStyle = '#0a0a6a'; // Dark blue for ammo bar background
        ctx.fillRect(screenWidth * 0.73, screenHeight * 0.88, screenWidth * 0.25, screenHeight * 0.04);
        ctx.fillStyle = '#0000ff'; // Bright blue for ammo value
        ctx.fillRect(screenWidth * 0.73, screenHeight * 0.88, screenWidth * 0.25 * (player.ammo / 100), screenHeight * 0.04);
        ctx.strokeRect(screenWidth * 0.73, screenHeight * 0.88, screenWidth * 0.25, screenHeight * 0.04);
        ctx.fillStyle = 'white';
        ctx.fillText(`AMMO: ${player.ammo}`, screenWidth * 0.73 + 10, screenHeight * 0.88 + 8);

        // Crosshair
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenWidth / 2 - 15, screenHeight / 2);
        ctx.lineTo(screenWidth / 2 + 15, screenHeight / 2);
        ctx.moveTo(screenWidth / 2, screenHeight / 2 - 15);
        ctx.lineTo(screenWidth / 2, screenHeight / 2 + 15);
        ctx.stroke();

        // Doom-style "face" (simplified: just a yellow square with pulsating glow)
        const faceSize = screenHeight * 0.08;
        const faceX = screenWidth / 2 - faceSize / 2;
        const faceY = screenHeight * 0.9 - faceSize / 2; // Position it lower
        ctx.fillStyle = '#FFD700'; // Gold for face
        ctx.fillRect(faceX, faceY, faceSize, faceSize);

        // Face glow (pulsating effect)
        const glowFactor = Math.sin(currentTime * 0.005) * 0.5 + 0.5; // Oscillates between 0.5 and 1
        for (let j = 0; j < 3; j++) {
            ctx.globalAlpha = 0.05 * (3 - j) * glowFactor;
            ctx.fillStyle = '#FFD700'; // Gold glow
            ctx.beginPath();
            ctx.arc(faceX + faceSize / 2, faceY + faceSize / 2, faceSize * (0.6 + j * 0.1), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1; // Reset alpha

        // "DOOMARIA" Title (top center, animated glow)
        ctx.font = 'bold 48px "Press Start 2P", monospace'; // Large title font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'orange';
        const titleText = "DOOMARIA";
        ctx.fillText(titleText, screenWidth / 2, screenHeight * 0.02);

        // Title glow (pulsating effect)
        const titleGlowFactor = Math.sin(currentTime * 0.003) * 0.5 + 0.5; // Slower oscillation
        for (let j = 0; j < 5; j++) {
            ctx.globalAlpha = 0.02 * (5 - j) * titleGlowFactor;
            ctx.fillStyle = 'gold';
            // Offset for blurry glow
            ctx.fillText(titleText, screenWidth / 2 + j * 0.5, screenHeight * 0.02 + j * 0.5);
            ctx.fillText(titleText, screenWidth / 2 - j * 0.5, screenHeight * 0.02 - j * 0.5);
        }
        ctx.globalAlpha = 1;
    }

    // --- Entry Point ---
    // Wait for the DOM to be fully loaded, including Drawaria's scripts and canvas
    window.addEventListener('load', () => {
        // Delay initialization slightly to ensure Drawaria's canvas is ready
        setTimeout(initGame, 500); // Increased delay for robustness
    });

})();