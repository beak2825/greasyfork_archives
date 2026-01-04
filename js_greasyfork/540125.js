// ==UserScript==
// @name         Super Mario Bros. Level Editor for Drawaria.online
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transform Drawaria.online into an immersive Super Mario Bros. level editor with dynamic elements and enhanced realism.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540125/Super%20Mario%20Bros%20Level%20Editor%20for%20Drawariaonline.user.js
// @updateURL https://update.greasyfork.org/scripts/540125/Super%20Mario%20Bros%20Level%20Editor%20for%20Drawariaonline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const EDITOR_WIDTH = 800; // Optimal width for the editor canvas
    const EDITOR_HEIGHT = 600; // Optimal height for the editor canvas
    const TILE_SIZE = 32; // Standard tile size for Mario elements
    const GRID_COLOR = 'rgba(0, 0, 0, 0.2)';

    // --- Global State ---
    let editorActive = false;
    let currentTool = 'block'; // 'block', 'enemy', 'powerup', 'mario_start', 'clear'
    let currentElement = null; // Specific element type (e.g., 'brick', 'goomba', 'mushroom')
    let levelData = []; // Stores the level layout: [{x, y, type}, ...]
    let gameCanvas = null;
    let gameCtx = null;
    let editorUI = null;
    let audioContext = null;
    let backgroundMusic = null;
    let gameInterval = null; // For game simulation

    // --- Asset Generation (Conceptual - Highly Complex in Reality) ---
    // In a real scenario, this would be done using pixel-by-pixel drawing on OffscreenCanvas
    // or through complex WebGL/SVG generation for high-fidelity vector graphics.
    // For sounds, Web Audio API's OscillatorNode and gain manipulation for synthesis.

    const MarioAssets = {
        // Example: Programmatic generation of a simple Mario sprite (very basic representation)
        generateMarioSprite: () => {
            const canvas = document.createElement('canvas');
            canvas.width = TILE_SIZE;
            canvas.height = TILE_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'red'; // Mario's hat/shirt
            ctx.fillRect(TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            ctx.fillStyle = 'brown'; // Mario's overalls
            ctx.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.5, TILE_SIZE * 0.6, TILE_SIZE * 0.4);
            ctx.fillStyle = 'peachpuff'; // Mario's skin
            ctx.beginPath();
            ctx.arc(TILE_SIZE / 2, TILE_SIZE * 0.3, TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.fill();
            return canvas; // Returns a canvas element as a sprite
        },
        // More sprites for blocks, enemies, power-ups would follow similar complex patterns.
        // Each would require meticulous drawing commands for every pixel or vector path.
        generateBlockSprite: (type) => {
            const canvas = document.createElement('canvas');
            canvas.width = TILE_SIZE;
            canvas.height = TILE_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
            if (type === 'brick') {
                ctx.fillStyle = '#A0522D'; // Sienna
                ctx.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.fillStyle = '#8B4513'; // SaddleBrown
                ctx.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            } else if (type === 'question_block') {
                ctx.fillStyle = '#FFD700'; // Gold
                ctx.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
                ctx.fillStyle = '#DAA520'; // Goldenrod
                ctx.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                ctx.font = `${TILE_SIZE * 0.7}px Arial`;
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', TILE_SIZE / 2, TILE_SIZE / 2);
            }
            return canvas;
        },
        generateGoombaSprite: () => {
            const canvas = document.createElement('canvas');
            canvas.width = TILE_SIZE;
            canvas.height = TILE_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#8B4513'; // Goomba body color
            ctx.beginPath();
            ctx.ellipse(TILE_SIZE / 2, TILE_SIZE * 0.6, TILE_SIZE * 0.4, TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white'; // Eyes
            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.35, TILE_SIZE * 0.45, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.arc(TILE_SIZE * 0.65, TILE_SIZE * 0.45, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'black'; // Pupils
            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.35, TILE_SIZE * 0.45, TILE_SIZE * 0.05, 0, Math.PI * 2);
            ctx.arc(TILE_SIZE * 0.65, TILE_SIZE * 0.45, TILE_SIZE * 0.05, 0, Math.PI * 2);
            ctx.fill();
            return canvas;
        },
        generateMushroomSprite: () => {
            const canvas = document.createElement('canvas');
            canvas.width = TILE_SIZE;
            canvas.height = TILE_SIZE;
            const ctx = canvas.getContext('2d');
            // Mushroom top
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(TILE_SIZE / 2, TILE_SIZE * 0.4, TILE_SIZE * 0.4, Math.PI, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            // Mushroom stem
            ctx.fillStyle = 'white';
            ctx.fillRect(TILE_SIZE * 0.4, TILE_SIZE * 0.5, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
            return canvas;
        },

        // Sound Synthesis: Very basic example, actual music requires complex sequencing
        // and instrument synthesis.
        generateCoinSound: () => {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // High frequency
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2); // Quick decay

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        },
        generateJumpSound: () => {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            oscillator.frequency.linearRampToValueAtTime(660, audioContext.currentTime + 0.1); // Rise
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        },
        generateBackgroundMusic: () => {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // This is a highly simplified placeholder.
            // Actual music would involve multiple oscillators, complex envelopes,
            // rhythm sequencing, and potentially custom waveforms.
            // For example, generating the Super Mario Bros. theme from scratch is a massive undertaking.
            // This function would return a Web Audio API graph or a playback function.
            console.warn("Generating complex background music from scratch is an advanced audio synthesis task.");
            // Example: A very simple, sustained low tone for 'background'
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            backgroundMusic = {
                play: () => { if (audioContext.state === 'suspended') audioContext.resume(); },
                stop: () => { if (audioContext.state === 'running') audioContext.suspend(); }
            };
        }
    };

    // Store generated sprites
    const sprites = {
        mario: MarioAssets.generateMarioSprite(),
        brick_block: MarioAssets.generateBlockSprite('brick'),
        question_block: MarioAssets.generateBlockSprite('question_block'),
        goomba: MarioAssets.generateGoombaSprite(),
        mushroom: MarioAssets.generateMushroomSprite(),
        // Add more dynamically generated sprites here
    };

    // --- UI Creation ---
    function createEditorUI() {
        // Create main editor container
        editorUI = document.createElement('div');
        editorUI.id = 'mario-editor-container';
        Object.assign(editorUI.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Pixelify Sans, sans-serif', // Use a pixel font for authenticity
            color: 'white',
            overflow: 'hidden'
        });

        // Add Google Fonts Pixelify Sans
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Pixelify+Sans&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        // Header
        const header = document.createElement('h1');
        header.textContent = 'Super Mario Level Editor';
        Object.assign(header.style, {
            fontSize: '3em',
            marginBottom: '20px',
            textShadow: '4px 4px 0px blue', // Add some depth
        });
        editorUI.appendChild(header);

        // Editor Canvas
        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'mario-editor-canvas';
        gameCanvas.width = EDITOR_WIDTH;
        gameCanvas.height = EDITOR_HEIGHT;
        Object.assign(gameCanvas.style, {
            border: '5px solid #8B4513', // Brown border
            background: 'linear-gradient(to bottom, skyblue, lightblue 70%, green 70%)', // Sky and ground
            boxShadow: '0 0 20px rgba(255, 255, 0, 0.7)', // Glow
            cursor: 'crosshair'
        });
        editorUI.appendChild(gameCanvas);
        gameCtx = gameCanvas.getContext('2d');

        // Tool Panel
        const toolPanel = document.createElement('div');
        Object.assign(toolPanel.style, {
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
        });
        editorUI.appendChild(toolPanel);

        // Tools
        const tools = [
            { id: 'tool-block', text: 'Block', type: 'block', elements: ['brick_block', 'question_block'] },
            { id: 'tool-enemy', text: 'Enemy', type: 'enemy', elements: ['goomba'] },
            { id: 'tool-powerup', text: 'Power-up', type: 'powerup', elements: ['mushroom'] },
            { id: 'tool-mario', text: 'Mario Start', type: 'mario_start', elements: ['mario'] },
            { id: 'tool-clear', text: 'Clear', type: 'clear' },
        ];

        tools.forEach(tool => {
            const button = document.createElement('button');
            button.id = tool.id;
            button.textContent = tool.text;
            Object.assign(button.style, {
                padding: '8px 15px',
                fontSize: '1em',
                backgroundColor: '#007bff', // Blue button
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: 'inherit'
            });
            button.onmouseover = () => button.style.backgroundColor = '#0056b3';
            button.onmouseout = () => button.style.backgroundColor = '#007bff';
            button.onclick = () => {
                currentTool = tool.type;
                if (tool.elements) {
                    currentElement = tool.elements[0]; // Select first element by default
                } else {
                    currentElement = null;
                }
                updateToolPanelSelection();
            };
            toolPanel.appendChild(button);
        });

        // Element Selector (for block, enemy, powerup types)
        const elementSelector = document.createElement('select');
        elementSelector.id = 'element-selector';
        Object.assign(elementSelector.style, {
            padding: '8px',
            fontSize: '1em',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            fontFamily: 'inherit',
            marginLeft: '10px'
        });
        elementSelector.onchange = (e) => {
            currentElement = e.target.value;
        };
        toolPanel.appendChild(elementSelector);

        // Action Buttons
        const actionPanel = document.createElement('div');
        Object.assign(actionPanel.style, {
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
        });
        editorUI.appendChild(actionPanel);

        const playButton = document.createElement('button');
        playButton.textContent = 'Test Level (Conceptual)';
        Object.assign(playButton.style, {
            padding: '10px 20px',
            fontSize: '1.2em',
            backgroundColor: '#28a745', // Green button
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit'
        });
        playButton.onmouseover = () => playButton.style.backgroundColor = '#218838';
        playButton.onmouseout = () => playButton.style.backgroundColor = '#28a745';
        playButton.onclick = () => {
            alert('Level testing is a complex game simulation not fully implemented. Imagine Mario running here!');
            MarioAssets.generateJumpSound(); // Simulate a jump sound
        };
        actionPanel.appendChild(playButton);

        const exitButton = document.createElement('button');
        exitButton.textContent = 'Exit Editor';
        Object.assign(exitButton.style, {
            padding: '10px 20px',
            fontSize: '1.2em',
            backgroundColor: '#dc3545', // Red button
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            fontFamily: 'inherit'
        });
        exitButton.onmouseover = () => exitButton.style.backgroundColor = '#c82333';
        exitButton.onmouseout = () => exitButton.style.backgroundColor = '#dc3545';
        exitButton.onclick = disableEditor;
        actionPanel.appendChild(exitButton);

        document.body.appendChild(editorUI);
        updateToolPanelSelection(); // Initial update
    }

    // --- Editor Logic ---
    function drawGrid() {
        gameCtx.strokeStyle = GRID_COLOR;
        for (let i = 0; i < EDITOR_WIDTH / TILE_SIZE; i++) {
            gameCtx.beginPath();
            gameCtx.moveTo(i * TILE_SIZE, 0);
            gameCtx.lineTo(i * TILE_SIZE, EDITOR_HEIGHT);
            gameCtx.stroke();
        }
        for (let i = 0; i < EDITOR_HEIGHT / TILE_SIZE; i++) {
            gameCtx.beginPath();
            gameCtx.moveTo(0, i * TILE_SIZE);
            gameCtx.lineTo(EDITOR_WIDTH, i * TILE_SIZE);
            gameCtx.stroke();
        }
    }

    function drawLevel() {
        gameCtx.clearRect(0, 0, EDITOR_WIDTH, EDITOR_HEIGHT);
        // The linear gradient is drawn as background of the canvas element itself
        // so it persists on clearRect.
        // gameCtx.fillStyle = 'linear-gradient(to bottom, skyblue, lightblue 70%, green 70%)'; // Sky and ground
        // gameCtx.fillRect(0, 0, EDITOR_WIDTH, EDITOR_HEIGHT);

        drawGrid();

        levelData.forEach(item => {
            const sprite = sprites[item.type];
            if (sprite) {
                gameCtx.drawImage(sprite, item.x, item.y, TILE_SIZE, TILE_SIZE);

                // Add glowing particle effects for power-ups (conceptual)
                if (item.type === 'mushroom') {
                    // This would involve rendering many small, semi-transparent circles
                    // or squares around the power-up, fading in and out.
                    // Example: simple static glow effect for demonstration
                    gameCtx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow glow
                    gameCtx.beginPath();
                    gameCtx.arc(item.x + TILE_SIZE / 2, item.y + TILE_SIZE / 2, TILE_SIZE * 0.7, 0, Math.PI * 2);
                    gameCtx.fill();
                }
            }
        });
    }

    function handleCanvasClick(event) {
        if (!editorActive) return;

        const rect = gameCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const gridX = Math.floor(mouseX / TILE_SIZE) * TILE_SIZE;
        const gridY = Math.floor(mouseY / TILE_SIZE) * TILE_SIZE;

        const existingElementIndex = levelData.findIndex(item => item.x === gridX && item.y === gridY);

        if (currentTool === 'clear') {
            if (existingElementIndex !== -1) {
                levelData.splice(existingElementIndex, 1);
            }
        } else if (currentElement) {
            if (existingElementIndex !== -1) {
                levelData[existingElementIndex] = { x: gridX, y: gridY, type: currentElement };
            } else {
                levelData.push({ x: gridX, y: gridY, type: currentElement });
            }
        }

        drawLevel();
        if (currentElement === 'brick_block' || currentElement === 'question_block') {
             MarioAssets.generateCoinSound(); // Play a sound when placing blocks
        }
    }

    function updateToolPanelSelection() {
        // Reset all button styles
        document.querySelectorAll('#mario-editor-container button').forEach(btn => {
            btn.style.backgroundColor = '#007bff';
        });

        // Highlight selected tool button
        let selectedButton = null;
        if (currentTool === 'block') selectedButton = document.getElementById('tool-block');
        else if (currentTool === 'enemy') selectedButton = document.getElementById('tool-enemy');
        else if (currentTool === 'powerup') selectedButton = document.getElementById('tool-powerup');
        else if (currentTool === 'mario_start') selectedButton = document.getElementById('tool-mario');
        else if (currentTool === 'clear') selectedButton = document.getElementById('tool-clear');

        if (selectedButton) {
            selectedButton.style.backgroundColor = '#0056b3'; // Darker blue for selected
        }

        // Update element selector options
        const elementSelector = document.getElementById('element-selector');
        elementSelector.innerHTML = ''; // Clear previous options

        let elementsForTool = [];
        if (currentTool === 'block') elementsForTool = ['brick_block', 'question_block'];
        else if (currentTool === 'enemy') elementsForTool = ['goomba'];
        else if (currentTool === 'powerup') elementsForTool = ['mushroom'];
        else if (currentTool === 'mario_start') elementsForTool = ['mario'];

        elementsForTool.forEach(el => {
            const option = document.createElement('option');
            option.value = el;
            option.textContent = el.replace(/_/g, ' ').toUpperCase();
            elementSelector.appendChild(option);
        });

        elementSelector.style.display = elementsForTool.length > 0 ? 'inline-block' : 'none';

        // Set currentElement to the first option if available, otherwise null
        currentElement = elementsForTool.length > 0 ? elementsForTool[0] : null;
        if (elementSelector.options.length > 0) {
            elementSelector.value = currentElement;
        }
    }

    // --- Editor Control ---
    function enableEditor() {
        if (editorActive) return;

        // Hide Drawaria.online's main content
        const mainContent = document.getElementById('main');
        if (mainContent) mainContent.style.display = 'none';
        const loginSection = document.getElementById('login');
        if (loginSection) loginSection.style.display = 'none';

        createEditorUI();
        drawLevel();
        editorActive = true;
        gameCanvas.addEventListener('click', handleCanvasClick);

        // Start conceptual background music
        MarioAssets.generateBackgroundMusic();
        if (backgroundMusic) backgroundMusic.play();
    }

    function disableEditor() {
        if (!editorActive) return;

        if (editorUI && editorUI.parentNode) {
            editorUI.parentNode.removeChild(editorUI);
        }

        // Show Drawaria.online's main content
        const mainContent = document.getElementById('main');
        if (mainContent) mainContent.style.display = '';
        const loginSection = document.getElementById('login');
        if (loginSection) loginSection.style.display = '';

        gameCanvas.removeEventListener('click', handleCanvasClick);
        editorActive = false;

        // Stop conceptual background music
        if (backgroundMusic) backgroundMusic.stop();
        backgroundMusic = null;
    }

    // --- Main Entry Point / Button to toggle editor ---
    function addToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Mario Editor';
        Object.assign(toggleButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 30px',
            fontSize: '1.5em',
            backgroundColor: '#FF4500', // Orange-red
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            zIndex: '10000',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            transition: 'background-color 0.3s, transform 0.2s',
            fontFamily: 'Pixelify Sans, sans-serif'
        });
        toggleButton.onmouseover = () => {
            toggleButton.style.backgroundColor = '#E03C00';
            toggleButton.style.transform = 'scale(1.05)';
        };
        toggleButton.onmouseout = () => {
            toggleButton.style.backgroundColor = '#FF4500';
            toggleButton.style.transform = 'scale(1)';
        };
        toggleButton.onclick = () => {
            if (editorActive) {
                disableEditor();
            } else {
                enableEditor();
            }
        };
        document.body.appendChild(toggleButton);
    }

    // Initial setup when the script runs
    window.addEventListener('load', () => {
        addToggleButton();
    });

})();