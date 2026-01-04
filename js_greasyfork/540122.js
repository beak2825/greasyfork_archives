// ==UserScript==
// @name         Drawaria Tetris Full Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Un modo de juego de Tetris completo para Drawaria.online con gráficos, sonido y partículas generados proceduralmente, ocupando gran parte de la pantalla.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540122/Drawaria%20Tetris%20Full%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/540122/Drawaria%20Tetris%20Full%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS Injection for Styling, Animations, and Particles ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes glowing-border {
            0% { box-shadow: 0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF, inset 0 0 5px rgba(0, 255, 255, 0.3); }
            50% { box-shadow: 0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF, inset 0 0 8px rgba(0, 255, 255, 0.5); }
            100% { box-shadow: 0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF, inset 0 0 5px rgba(0, 255, 255, 0.3); }
        }

        @keyframes title-pulse {
            0% { transform: scale(1); text-shadow: 0 0 5px #00FFFF; }
            50% { transform: scale(1.03); text-shadow: 0 0 10px #00FFFF, 0 0 20px #00FFFF; }
            100% { transform: scale(1); text-shadow: 0 0 5px #00FFFF; }
        }

        /* Added for potential hiding of Drawaria elements - EXPERIMENTAL */
        #main-game-container, #canvas-container { /* These are common IDs, adjust if Drawaria uses different ones */
             display: none !important; /* THIS IS EXPERIMENTAL and might break Drawaria */
        }

        .tetris-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* Center the container */
            background: #1a1a2e; /* Dark theme */
            border: 3px solid #00FFFF; /* Brighter and thicker border */
            border-radius: 15px;
            box-shadow: 0 0 20px #00FFFF, 0 0 30px #00FFFF; /* More intense glow */
            animation: glowing-border 2s infinite alternate; /* Pulsating glow */
            font-family: 'Press Start 2P', cursive, monospace; /* Pixelated font or similar */
            color: #E0E0E0;
            display: flex;
            flex-direction: column;
            overflow: hidden; /* For particles */
            z-index: 10000; /* Ensure it's on top */
            width: 80%; /* Occupy 80% of viewport width */
            max-width: 960px; /* Max width in pixels */
            height: 85vh; /* Occupy 85% of viewport height */
            max-height: 720px; /* Max height in pixels */
            padding: 15px;
            box-sizing: border-box; /* Include padding and border in element's total width and height */
            position: relative; /* For particle positioning */
        }

        .tetris-title {
            color: #00FFFF;
            font-size: clamp(2em, 5vw, 3.5em); /* Responsive font size */
            text-align: center;
            margin-bottom: 15px;
            text-shadow: 0 0 8px #00FFFF, 0 0 15px #00FFFF;
            animation: title-pulse 3s infinite ease-in-out;
        }

        .tetris-game-area {
            display: flex;
            justify-content: center; /* Center the game and sidebar */
            align-items: flex-start;
            flex-grow: 1; /* Allow game area to take available space */
            gap: 15px; /* Space between canvas and sidebar */
        }

        .tetris-canvas {
            background: #0d0d1a; /* Even darker background for the play area */
            border: 2px solid #00BFFF; /* Slightly different blue border */
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.5), 0 0 8px rgba(0, 255, 255, 0.3);
            display: block; /* Remove extra space below canvas */
            flex-shrink: 0; /* Prevent canvas from shrinking */
            /* Canvas will scale based on BLOCK_SIZE and COLS/ROWS */
        }

        .tetris-sidebar {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            background: #2a2a4a;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
            height: fit-content; /* Sidebar fits its content */
        }

        .tetris-info-box {
            background: #1d1d3d;
            border: 1px solid #00BFFF;
            padding: 10px;
            margin-bottom: 12px;
            border-radius: 6px;
            width: 120px; /* Adjusted width */
            text-align: center;
            box-sizing: border-box;
            font-size: 0.9em;
            text-shadow: 0 0 3px rgba(0, 255, 255, 0.5);
        }

        .tetris-info-box label {
            display: block;
            margin-bottom: 4px;
            color: #00FFFF;
            font-size: 0.85em;
        }

        .tetris-info-box span {
            font-weight: bold;
            color: #F0F0F0;
            font-size: 1.2em; /* Slightly larger text */
        }

        .tetris-next-piece-display {
            background: #1d1d3d;
            border: 1px solid #00BFFF;
            padding: 8px;
            margin-bottom: 12px;
            border-radius: 6px;
            width: 100px; /* Small fixed width for next piece */
            height: 100px; /* Adjust based on block size */
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .tetris-next-piece-display canvas {
            display: block;
        }

        .tetris-button {
            background: linear-gradient(145deg, #00FFFF, #00BFFF);
            color: #1a1a2e;
            border: none;
            padding: 12px 20px; /* Larger buttons */
            font-size: 1.1em;
            font-weight: bold;
            border-radius: 7px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.1s ease;
            box-shadow: 0 0 12px rgba(0, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 5px; /* Add some space above buttons */
        }

        .tetris-button:hover {
            background: linear-gradient(145deg, #00BFFF, #00FFFF);
            transform: translateY(-3px); /* More pronounced hover effect */
            box-shadow: 0 0 18px rgba(0, 255, 255, 0.9);
        }

        .tetris-button:active {
            transform: translateY(0);
        }

        .game-over-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85); /* Slightly more opaque */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #FF00FF; /* Neon magenta */
            font-size: 2.5em; /* Larger game over text */
            text-shadow: 0 0 10px #FF00FF, 0 0 20px #FF00FF;
            text-align: center;
            border-radius: 15px; /* Match container radius */
            z-index: 1000;
            box-sizing: border-box;
        }

        .game-over-overlay h2 {
            font-size: 1.5em; /* Scale down h2 a bit */
            margin-bottom: 15px;
        }

        .game-over-overlay p {
            margin: 10px 0;
            color: #FFC0CB; /* Pink for score/level text */
            font-size: 0.8em;
            text-shadow: 0 0 5px rgba(255, 192, 203, 0.5);
        }

        /* Particle animations */
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.7; }
            50% { transform: translateY(-15px) rotate(10deg) scale(1.2); opacity: 1; }
            100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.7; }
        }

        .tetris-particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.5); /* Semi-transparent white */
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.7); /* Cyan glow */
            opacity: 0; /* Start invisible */
            animation-name: float;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
            pointer-events: none; /* Do not block clicks */
            z-index: 0; /* Behind other content */
        }
    `;
    document.head.appendChild(style);

    // --- 2. HTML Structure Creation ---
    const tetrisContainer = document.createElement('div');
    tetrisContainer.className = 'tetris-container';

    tetrisContainer.innerHTML = `
        <h1 class="tetris-title">TETRIS</h1>
        <div class="tetris-game-area">
            <canvas id="tetrisCanvas" class="tetris-canvas"></canvas>
            <div class="tetris-sidebar">
                <div class="tetris-info-box">
                    <label>SCORE</label>
                    <span id="tetrisScore">0</span>
                </div>
                <div class="tetris-info-box">
                    <label>LEVEL</label>
                    <span id="tetrisLevel">1</span>
                </div>
                <div class="tetris-info-box">
                    <label>LINES</label>
                    <span id="tetrisLines">0</span>
                </div>
                <div class="tetris-info-box">
                    <label>NEXT</label>
                    <div class="tetris-next-piece-display">
                        <canvas id="nextPieceCanvas"></canvas>
                    </div>
                </div>
                <button id="tetrisStartButton" class="tetris-button">Start Game</button>
            </div>
        </div>
        <div id="gameOverOverlay" class="game-over-overlay" style="display: none;">
            <h2>GAME OVER!</h2>
            <p>Score: <span id="finalScore">0</span></p>
            <p>Level: <span id="finalLevel">1</span></p>
            <button id="restartButton" class="tetris-button">Play Again?</button>
        </div>
    `;

    document.body.appendChild(tetrisContainer);

    // Get elements
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('nextPieceCanvas');
    const nextCtx = nextPieceCanvas.getContext('2d');
    const scoreDisplay = document.getElementById('tetrisScore');
    const levelDisplay = document.getElementById('tetrisLevel');
    const linesDisplay = document.getElementById('tetrisLines');
    const startButton = document.getElementById('tetrisStartButton');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreDisplay = document.getElementById('finalScore');
    const finalLevelDisplay = document.getElementById('finalLevel');
    const restartButton = document.getElementById('restartButton');

    // --- 3. Web Audio API for Procedural Sound Generation ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function createOscillator(frequency, type = 'sine', duration = 0.1, volume = 0.5) {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    function playMoveSound() { createOscillator(260, 'triangle', 0.05, 0.2); }
    function playRotateSound() { createOscillator(440, 'square', 0.08, 0.3); createOscillator(550, 'square', 0.08, 0.3); }
    function playHardDropSound() { createOscillator(180, 'sawtooth', 0.1, 0.5); createOscillator(90, 'square', 0.1, 0.6); }
    function playLineClearSound() {
        const baseFreq = 600;
        for (let i = 0; i < 4; i++) { createOscillator(baseFreq + (i * 100), 'sine', 0.08, 0.4); }
    }
    function playGameOverSound() {
        createOscillator(100, 'square', 0.5, 0.7);
        createOscillator(50, 'sawtooth', 0.5, 0.8);
        setTimeout(() => { createOscillator(200, 'triangle', 0.3, 0.5); }, 300);
    }
    function playStartupMelody() {
        const notes = [
            { freq: 440, dur: 0.15 }, { freq: 523, dur: 0.15 }, { freq: 659, dur: 0.15 }, { freq: 880, dur: 0.3 }
        ];
        let currentTime = audioCtx.currentTime;
        notes.forEach(note => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            gainNode.gain.setValueAtTime(0.3, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.dur);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.dur);
            currentTime += note.dur;
        });
    }

    // --- 4. Tetris Game Logic ---
    const COLS = 10;
    const ROWS = 20;
    let BLOCK_SIZE; // Will be determined by canvas size and aspect ratio

    // Function to resize canvas and adjust block size dynamically
    function resizeGame() {
        const containerWidth = tetrisContainer.offsetWidth;
        const containerHeight = tetrisContainer.offsetHeight;

        // Calculate available space for game area excluding sidebar and title
        const sidebarWidth = 250; // Approximate sidebar width
        const titleHeight = 70; // Approximate title height

        const gameAreaMaxWidth = containerWidth * 0.75 - sidebarWidth; // Max width for canvas
        const gameAreaMaxHeight = containerHeight - titleHeight - 30; // Max height for canvas

        // Determine block size based on available space and aspect ratio
        const aspectRatio = COLS / ROWS;
        let calculatedBlockSizeWidth = gameAreaMaxWidth / COLS;
        let calculatedBlockSizeHeight = gameAreaMaxHeight / ROWS;

        BLOCK_SIZE = Math.min(calculatedBlockSizeWidth, calculatedBlockSizeHeight);

        // Ensure BLOCK_SIZE is at least 10px and not too large
        BLOCK_SIZE = Math.max(10, Math.min(BLOCK_SIZE, 30)); // Min 10px, Max 30px

        canvas.width = COLS * BLOCK_SIZE;
        canvas.height = ROWS * BLOCK_SIZE;
        nextPieceCanvas.width = 4 * BLOCK_SIZE; // For next piece display
        nextPieceCanvas.height = 4 * BLOCK_SIZE;

        // Adjust sidebar to align with canvas height
        const sidebar = tetrisContainer.querySelector('.tetris-sidebar');
        if (sidebar) {
             // sidebar.style.height = `${canvas.height}px`; // This might make sidebar too short if game area is constrained by width
        }

        // Redraw everything if game is running
        if (gameStarted && !gameOver) {
            drawBoard();
            drawCurrentPiece();
            drawNextPiece();
        } else if (!gameStarted) {
            drawBoard(); // Draw initial empty board if not started
            drawNextPiece(); // Draw initial empty next piece
        }
    }

    // Event listener for window resize
    window.addEventListener('resize', resizeGame);

    let board = [];
    let currentPiece;
    let nextPiece;
    let score = 0;
    let level = 1;
    let lines = 0;
    let gameOver = false;
    let dropInterval = 1000;
    let lastDropTime = 0;
    let gameStarted = false;

    const TETROMINOS = {
        'I': { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: '#00FFFF' },
        'J': { shape: [[1,0,0], [1,1,1], [0,0,0]], color: '#0000FF' },
        'L': { shape: [[0,0,1], [1,1,1], [0,0,0]], color: '#FFA500' },
        'O': { shape: [[1,1], [1,1]], color: '#FFFF00' },
        'S': { shape: [[0,1,1], [1,1,0], [0,0,0]], color: '#00FF00' },
        'T': { shape: [[0,1,0], [1,1,1], [0,0,0]], color: '#800080' },
        'Z': { shape: [[1,1,0], [0,1,1], [0,0,0]], color: '#FF0000' }
    };

    function initBoard() {
        board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
        score = 0; level = 1; lines = 0; gameOver = false;
        dropInterval = 1000;
        updateUI();
        generateNewPiece();
        generateNewPiece(true); // Generate next piece
        gameOverOverlay.style.display = 'none';
        startButton.textContent = 'Restart Game';
        resizeGame(); // Initialize canvas size
    }

    function updateUI() {
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        linesDisplay.textContent = lines;
    }

    function generateNewPiece(isNext = false) {
        const pieceNames = Object.keys(TETROMINOS);
        const randomName = pieceNames[Math.floor(Math.random() * pieceNames.length)];
        const newPiece = JSON.parse(JSON.stringify(TETROMINOS[randomName]));
        newPiece.x = Math.floor(COLS / 2) - Math.floor(newPiece.shape[0].length / 2);
        newPiece.y = 0;

        if (isNext) {
            nextPiece = newPiece;
            drawNextPiece();
        } else {
            currentPiece = newPiece;
            if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
                endGame();
            }
        }
    }

    function drawBlock(context, x, y, color, blockSize) {
        if (color === 0) return;

        context.fillStyle = color;
        context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

        // Add procedural highlights and shadows for depth
        const highlightColor = 'rgba(255, 255, 255, 0.6)';
        const shadowColor = 'rgba(0, 0, 0, 0.4)';

        context.strokeStyle = highlightColor;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(x * blockSize, y * blockSize);
        context.lineTo((x + 1) * blockSize -1, y * blockSize); // Slightly offset to avoid drawing over next block's border
        context.lineTo((x + 1) * blockSize -1, (y + 1) * blockSize -1);
        context.stroke();

        context.strokeStyle = shadowColor;
        context.beginPath();
        context.moveTo(x * blockSize, (y + 1) * blockSize -1);
        context.lineTo((x + 1) * blockSize -1, (y + 1) * blockSize -1);
        context.lineTo((x + 1) * blockSize -1, y * blockSize);
        context.stroke();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                drawBlock(ctx, col, row, board[row][col], BLOCK_SIZE);
            }
        }
    }

    function drawCurrentPiece() {
        if (!currentPiece) return;
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    drawBlock(ctx, currentPiece.x + col, currentPiece.y + row, currentPiece.color, BLOCK_SIZE);
                }
            }
        }
    }

    function drawNextPiece() {
        nextCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        if (!nextPiece) return;

        const pieceWidth = nextPiece.shape[0].length;
        const pieceHeight = nextPiece.shape.length;
        const startX = (4 - pieceWidth) / 2; // Center in 4x4 grid
        const startY = (4 - pieceHeight) / 2; // Center in 4x4 grid

        for (let row = 0; row < pieceHeight; row++) {
            for (let col = 0; col < pieceWidth; col++) {
                if (nextPiece.shape[row][col]) {
                    drawBlock(nextCtx, startX + col, startY + row, nextPiece.color, BLOCK_SIZE);
                }
            }
        }
    }

    function checkCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = x + col;
                    const boardY = y + row;

                    if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                        return true;
                    }
                    if (boardY >= 0 && board[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function mergePieceToBoard() {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const boardX = currentPiece.x + col;
                    const boardY = currentPiece.y + row;
                    if (boardY >= 0) {
                        board[boardY][boardX] = currentPiece.color;
                    }
                }
            }
        }
    }

    function clearLines() {
        let linesClearedThisTurn = 0;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
                linesClearedThisTurn++;
                playLineClearSound();
                row++; // Check the new line at this row index again
            }
        }

        if (linesClearedThisTurn > 0) {
            lines += linesClearedThisTurn;
            if (linesClearedThisTurn === 1) score += 100 * level;
            else if (linesClearedThisTurn === 2) score += 300 * level;
            else if (linesClearedThisTurn === 3) score += 500 * level;
            else if (linesClearedThisTurn === 4) score += 800 * level;

            const oldLevel = level;
            level = Math.floor(lines / 10) + 1;
            if (level > oldLevel) {
                dropInterval *= 0.8;
                if (dropInterval < 100) dropInterval = 100;
            }
            updateUI();
        }
    }

    function rotatePiece(piece) {
        const originalShape = piece.shape;
        const newShape = originalShape[0].map((val, index) => originalShape.map(row => row[index]).reverse());

        if (!checkCollision(piece.x, piece.y, newShape)) {
            piece.shape = newShape;
            playRotateSound();
            return true;
        }

        const kicks = [[-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1]]; // Basic wall kicks
        for (const [dx, dy] of kicks) {
            if (!checkCollision(piece.x + dx, piece.y + dy, newShape)) {
                piece.x += dx; piece.y += dy;
                piece.shape = newShape;
                playRotateSound();
                return true;
            }
        }
        return false;
    }

    function dropPiece() {
        if (gameOver) return;
        if (!checkCollision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        } else {
            mergePieceToBoard();
            clearLines();
            currentPiece = nextPiece;
            generateNewPiece(true);
            if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
                endGame();
            }
        }
    }

    function hardDrop() {
        if (gameOver) return;
        while (!checkCollision(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        }
        mergePieceToBoard();
        playHardDropSound();
        clearLines();
        currentPiece = nextPiece;
        generateNewPiece(true);
        if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) {
            endGame();
        }
    }

    function endGame() {
        gameOver = true;
        playGameOverSound();
        finalScoreDisplay.textContent = score;
        finalLevelDisplay.textContent = level;
        gameOverOverlay.style.display = 'flex';
        gameStarted = false;
    }

    function gameLoop(currentTime) {
        if (gameOver || !gameStarted) {
            requestAnimationFrame(gameLoop);
            return;
        }

        const deltaTime = currentTime - lastDropTime;
        if (deltaTime > dropInterval) {
            dropPiece();
            lastDropTime = currentTime;
        }

        drawBoard();
        drawCurrentPiece();

        requestAnimationFrame(gameLoop);
    }

    // --- 5. Input Handling ---
    document.addEventListener('keydown', (e) => {
        // Only process input if the Tetris container is focused or if it's a game-critical key
        // This is tricky. For now, let's assume we want Tetris input to always work if gameStarted.
        if (gameOver || !gameStarted) return;

        switch (e.key) {
            case 'ArrowLeft': e.preventDefault(); currentPiece.x--; if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) currentPiece.x++; else playMoveSound(); break;
            case 'ArrowRight': e.preventDefault(); currentPiece.x++; if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) currentPiece.x--; else playMoveSound(); break;
            case 'ArrowDown': e.preventDefault(); currentPiece.y++; if (checkCollision(currentPiece.x, currentPiece.y, currentPiece.shape)) { currentPiece.y--; dropPiece(); } else { playMoveSound(); score += 1; } lastDropTime = performance.now(); break;
            case 'ArrowUp': e.preventDefault(); rotatePiece(currentPiece); break;
            case 'x': e.preventDefault(); rotatePiece(currentPiece); break;
            case ' ': e.preventDefault(); hardDrop(); break;
        }
        drawBoard();
        drawCurrentPiece();
    });

    // --- 6. Particle System ---
    const particles = [];
    const NUM_PARTICLES = 20; // Increased number of particles

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'tetris-particle';
        tetrisContainer.appendChild(particle);

        const size = Math.random() * 4 + 3; // 3-7px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 6 + 6}s`; // 6-12s animation
        particle.style.animationDelay = `${Math.random() * -6}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.6; // 0.6 - 0.9 opacity

        particles.push(particle);
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
        createParticle();
    }

    // --- 7. Game Initialization and Start Button Logic ---
    function startGame() {
        if (!gameStarted) {
            playStartupMelody();
            initBoard();
            gameStarted = true;
            lastDropTime = performance.now();
            requestAnimationFrame(gameLoop);
        }
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    // Initial setup
    initBoard(); // Sets up board and UI elements initially
    resizeGame(); // Adjust canvas size on load
})();