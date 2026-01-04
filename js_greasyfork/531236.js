// ==UserScript==
// @name         KobSteak!
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Jeu à la con
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531236/KobSteak%21.user.js
// @updateURL https://update.greasyfork.org/scripts/531236/KobSteak%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GRID_SIZE = 20;
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    const BASE_GAME_SPEED = 135;
    const BASE_OBSTACLE_SPAWN_INTERVAL = 6000;
    const BASE_OBSTACLE_MIN_LIFETIME = 7000;
    const BASE_OBSTACLE_MAX_LIFETIME = 20000;
    const BASE_OBSTACLE_MIN_SIZE = 3;
    const BASE_OBSTACLE_MAX_SIZE = 8;
    const BASE_MAX_OBSTACLES = 7;
    const BASE_THREAT_SPAWN_INTERVAL = 15000;
    const BASE_THREAT_SIZE = 1;

    const SNAKE_COLOR = 'blue'; const FOOD_COLOR = 'red'; const GOLDEN_FOOD_COLOR = 'gold'; const BACKGROUND_COLOR = 'black'; const TEXT_COLOR = 'white'; const CLOSE_BUTTON_COLOR = 'red'; const CLOSE_BUTTON_HOVER_BG = '#ff4d4d'; const COUNTDOWN_COLOR = 'white'; const OBSTACLE_COLOR = 'grey'; const OBSTACLE_BLINK_COLOR1 = '#555555'; const OBSTACLE_BLINK_COLOR2 = '#aaaaaa'; const THREAT_COLOR = '#7538bf'; const THREAT_WARNING_COLOR = 'rgba(90, 16, 130, 0.8)';
    const MAX_NORMAL_FOOD_DISTANCE = 15; const MAX_GOLDEN_FOOD_DISTANCE = 8;
    const GOLDEN_FOOD_SCORE = 10; const GOLDEN_FOOD_DURATION = 5000;
    const GOLDEN_FOOD_MIN_SPAWN_INTERVAL = 10000; const GOLDEN_FOOD_MAX_SPAWN_INTERVAL = 20000; const SPEED_BOOST_DURATION = 5000; const SPEED_BOOST_FACTOR = 1.875;
    const OBSTACLE_BLINK_DURATION = 3000;
    const THREAT_WARNING_DURATION = 2000;
    const SCORE_NOTIFICATION_DURATION = 500;
    const SCORE_NOTIFICATION_COLOR = 'white';

    const DIFFICULTIES = ['Nemo', 'Civis', 'Pragar'];
    const HIGH_SCORE_STORAGE_KEY = 'kobsteak_highscores_v1';

    let currentDifficultyIndex = 0;

    let activeGameSpeed = BASE_GAME_SPEED;
    let activeObstacleSpawnInterval = BASE_OBSTACLE_SPAWN_INTERVAL;
    let activeObstacleMinLifetime = BASE_OBSTACLE_MIN_LIFETIME;
    let activeObstacleMaxLifetime = BASE_OBSTACLE_MAX_LIFETIME;
    let activeObstacleMinSize = BASE_OBSTACLE_MIN_SIZE;
    let activeObstacleMaxSize = BASE_OBSTACLE_MAX_SIZE;
    let activeMaxObstacles = BASE_MAX_OBSTACLES;
    let activeThreatSpawnInterval = BASE_THREAT_SPAWN_INTERVAL;
    let activeThreatSize = BASE_THREAT_SIZE;
    let activeThreatMoveIntervalDuration = activeGameSpeed / 2;

    let canvas, ctx;
    let snake, food, goldenFood = null, obstacles = [], threat = null;
    let dx, dy, score;
    let currentGameSpeed = activeGameSpeed;
    let gameLoopInterval = null;
    let isRunning = false, isGameOver = false, isPaused = false, isMinimized = false, speedBoostActive = false;
    let boostStartTime = 0, pauseStartTime = 0;
    let isDragging = false, dragStartX, dragStartY, initialWindowX, initialWindowY;
    let goldenFoodTimer = null, goldenFoodSpawnCooldownTimer = null, goldenFoodSpawnGuaranteeTimer = null;
    let speedBoostTimer = null, boostCountdownInterval = null;
    let obstacleSpawnTimer = null;
    let threatSpawnCooldownTimer = null, threatSpawnGuaranteeTimer = null;
    let threatBlinkToggle = false;
    let scoreNotifications = [];

    let gameWindow = null, headerElement = null, pauseButton = null, difficultyButton = null, boostCountdownDisplay = null, helpButton = null;
    let initialKeyListener = null, gameKeyListener = null, escapeAndRestartListener = null;
    const handleDraggingBound = handleDragging.bind(this);
    const handleDragEndBound = handleDragEnd.bind(this);

    let highScores = {};

    function loadHighScores() {
        const storedScores = GM_getValue(HIGH_SCORE_STORAGE_KEY, '{}');
        try {
            highScores = JSON.parse(storedScores);
            DIFFICULTIES.forEach(diff => {
                if (typeof highScores[diff] !== 'number') {
                    highScores[diff] = 0;
                }
            });
        } catch (e) {
            highScores = {};
            DIFFICULTIES.forEach(diff => { highScores[diff] = 0; });
            saveHighScores();
        }
    }

    function saveHighScores() {
        try {
            GM_setValue(HIGH_SCORE_STORAGE_KEY, JSON.stringify(highScores));
        } catch (e) {

        }
    }

    function getCurrentHighScore() {
        const difficultyName = DIFFICULTIES[currentDifficultyIndex];
        return highScores[difficultyName] || 0;
    }

    function applyDifficultySettings() {
        const difficulty = DIFFICULTIES[currentDifficultyIndex];
        switch (difficulty) {
            case 'Civis':
                activeGameSpeed = Math.round(BASE_GAME_SPEED * 0.8);
                activeObstacleSpawnInterval = 5000;
                activeObstacleMinLifetime = 9000; activeObstacleMaxLifetime = 25000;
                activeObstacleMinSize = 3; activeObstacleMaxSize = 8;
                activeMaxObstacles = 8;
                activeThreatSpawnInterval = 12000;
                activeThreatSize = 5;
                break;
            case 'Pragar':
                activeGameSpeed = Math.round((BASE_GAME_SPEED * 0.9) * 0.7);
                activeObstacleSpawnInterval = 4000;
                activeObstacleMinLifetime = 9000; activeObstacleMaxLifetime = 25000;
                activeObstacleMinSize = 6; activeObstacleMaxSize = 10;
                activeMaxObstacles = 9;
                activeThreatSpawnInterval = 5000;
                activeThreatSize = 9;
                break;
            case 'Nemo': default:
                activeGameSpeed = BASE_GAME_SPEED;
                activeObstacleSpawnInterval = BASE_OBSTACLE_SPAWN_INTERVAL;
                activeObstacleMinLifetime = BASE_OBSTACLE_MIN_LIFETIME;
                activeObstacleMaxLifetime = BASE_OBSTACLE_MAX_LIFETIME;
                activeObstacleMinSize = BASE_OBSTACLE_MIN_SIZE; activeObstacleMaxSize = BASE_OBSTACLE_MAX_SIZE;
                activeMaxObstacles = BASE_MAX_OBSTACLES;
                activeThreatSpawnInterval = BASE_THREAT_SPAWN_INTERVAL;
                activeThreatSize = BASE_THREAT_SIZE;
                break;
        }
        activeThreatMoveIntervalDuration = activeGameSpeed / 2;
        if (!speedBoostActive) { currentGameSpeed = activeGameSpeed; }
    }

    function createGameWindow() {
        if (gameWindow) return;
        loadHighScores();

        GM_addStyle(` #snake-game-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${CANVAS_WIDTH + 20}px; height: ${CANVAS_HEIGHT + 60}px; background-color: #333; border: 2px solid #555; box-shadow: 0 0 15px rgba(0,0,0,0.5); z-index: 2147483647; display: flex; flex-direction: column; align-items: center; padding: 10px; box-sizing: border-box; font-family: sans-serif; color: ${TEXT_COLOR}; overflow: hidden; transition: height 0.2s ease-in-out; cursor: default; } #snake-game-container.dragging { cursor: grabbing; user-select: none; transition: none; } #snake-game-container.minimized { height: 50px; } #snake-game-canvas { background-color: ${BACKGROUND_COLOR}; border: 1px solid #444; position: relative; z-index: 1; } #snake-game-header { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #444; min-height: 25px; cursor: grab; } #snake-score { font-weight: bold; flex-shrink: 0; cursor: default; } #snake-game-title { font-weight: bold; font-size: 16px; text-align: center; flex-grow: 1; margin: 0 10px; color: lightblue; } #snake-header-buttons { display: flex; align-items: center; flex-shrink: 0; cursor: default; } .snake-header-button { cursor: pointer; font-weight: bold; padding: 3px 7px; border: 1px solid ${TEXT_COLOR}; border-radius: 3px; line-height: 1; margin-left: 8px; text-align: center; min-width: 50px; white-space: nowrap; } #snake-header-buttons .snake-header-button:first-child { margin-left: 0; } #snake-pause-button { border-color: ${TEXT_COLOR}; color: ${TEXT_COLOR}; } #snake-pause-button:hover { background-color: ${TEXT_COLOR}; color: #333; } #snake-difficulty-button { border-color: ${TEXT_COLOR}; color: ${TEXT_COLOR}; min-width: 60px; } #snake-difficulty-button:hover { background-color: ${TEXT_COLOR}; color: #333; } #snake-difficulty-button.disabled { cursor: not-allowed; opacity: 0.6; pointer-events: none; } #snake-close-button { border-color: ${CLOSE_BUTTON_COLOR}; color: ${CLOSE_BUTTON_COLOR}; } #snake-close-button:hover { background-color: ${CLOSE_BUTTON_HOVER_BG}; color: white; border-color: white; } #snake-help-button { border-color: ${TEXT_COLOR}; color: ${TEXT_COLOR}; min-width: 30px; } #snake-help-button:hover { background-color: ${TEXT_COLOR}; color: #333; } #snake-boost-countdown { position: absolute; top: 60%; left: 50%; transform: translateX(-50%); font-size: 28px; font-weight: bold; color: ${COUNTDOWN_COLOR}; background-color: rgba(0, 0, 0, 0.6); padding: 5px 15px; border-radius: 8px; z-index: 25; display: none; pointer-events: none; text-shadow: 1px 1px 3px black; } .snake-message-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; text-align: center; text-shadow: 2px 2px 4px black; pointer-events: none; display: none; z-index: 20; background-color: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 5px; border: 1px solid #555; } #snake-start-message { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); z-index: 10; pointer-events: none; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px black; background-color: rgba(0, 0, 0, 0.5); padding: 5px 10px; border-radius: 4px; text-align: center; } #snake-game-over { font-size: 24px; line-height: 1.4; } #snake-paused-message { font-size: 28px; color: yellow; }`);
        gameWindow = document.createElement('div'); gameWindow.id = 'snake-game-container';
        headerElement = document.createElement('div'); headerElement.id = 'snake-game-header';
        const scoreDisplay = document.createElement('span'); scoreDisplay.id = 'snake-score'; scoreDisplay.textContent = 'Score: 0';
        const titleDisplay = document.createElement('span'); titleDisplay.id = 'snake-game-title'; titleDisplay.textContent = 'KobSteak';
        const buttonGroup = document.createElement('div'); buttonGroup.id = 'snake-header-buttons';
        pauseButton = document.createElement('span'); pauseButton.id = 'snake-pause-button'; pauseButton.className = 'snake-header-button'; pauseButton.textContent = 'Pause'; pauseButton.onclick = togglePause;
        difficultyButton = document.createElement('span'); difficultyButton.id = 'snake-difficulty-button'; difficultyButton.className = 'snake-header-button'; difficultyButton.textContent = DIFFICULTIES[currentDifficultyIndex]; difficultyButton.onclick = changeDifficulty;
        helpButton = document.createElement('span');
        helpButton.id = 'snake-help-button';
        helpButton.className = 'snake-header-button';
        helpButton.textContent = '???';
        helpButton.onclick = openHelpWindow;
        const closeButton = document.createElement('span'); closeButton.id = 'snake-close-button'; closeButton.className = 'snake-header-button'; closeButton.textContent = 'X'; closeButton.onclick = closeGameWindow;
        buttonGroup.appendChild(pauseButton); buttonGroup.appendChild(difficultyButton); buttonGroup.appendChild(helpButton); buttonGroup.appendChild(closeButton);
        headerElement.appendChild(scoreDisplay); headerElement.appendChild(titleDisplay); headerElement.appendChild(buttonGroup);
        headerElement.addEventListener('dblclick', toggleMinimize);
        headerElement.addEventListener('mousedown', handleDragStart);
        canvas = document.createElement('canvas'); canvas.id = 'snake-game-canvas'; canvas.width = CANVAS_WIDTH; canvas.height = CANVAS_HEIGHT; ctx = canvas.getContext('2d');
        const startMessage = document.createElement('div'); startMessage.id = 'snake-start-message'; startMessage.textContent = 'Appuyez sur une flèche pour jouer';
        const gameOverMessage = document.createElement('div'); gameOverMessage.id = 'snake-game-over'; gameOverMessage.className = 'snake-message-overlay';
        const pausedMessage = document.createElement('div'); pausedMessage.id = 'snake-paused-message'; pausedMessage.className = 'snake-message-overlay'; pausedMessage.textContent = 'Paused';
        boostCountdownDisplay = document.createElement('div'); boostCountdownDisplay.id = 'snake-boost-countdown';
        gameWindow.appendChild(headerElement); gameWindow.appendChild(canvas); gameWindow.appendChild(startMessage); gameWindow.appendChild(gameOverMessage); gameWindow.appendChild(pausedMessage); gameWindow.appendChild(boostCountdownDisplay);
        document.body.appendChild(gameWindow);
        const rect = gameWindow.getBoundingClientRect(); gameWindow.style.left = `${window.scrollX + rect.left}px`; gameWindow.style.top = `${window.scrollY + rect.top}px`; gameWindow.style.transform = 'none';
        setupEscapeAndRestartListener();
        initializeGame();
        drawGame();
    }

    function gameOver() {
        isGameOver = true;
        isRunning = false;
        isPaused = false;
        deactivateSpeedBoost();
        clearAllTimers();
        obstacles = [];
        threat = null;
        goldenFood = null;

        if (gameKeyListener) document.removeEventListener('keydown', gameKeyListener);
        gameKeyListener = null;
        setupEscapeAndRestartListener();

        if (difficultyButton) difficultyButton.classList.remove('disabled');

        const difficultyName = DIFFICULTIES[currentDifficultyIndex];
        const currentHighScore = highScores[difficultyName] || 0;
        let newHighScoreMsg = "";
        if (score > currentHighScore) {
            highScores[difficultyName] = score;
            saveHighScores();
            newHighScoreMsg = `<br><span style="color: gold;">Nouveau High Score!</span>`;
        }
        const finalHighScore = highScores[difficultyName];

        const gameOverMsg = gameWindow?.querySelector('#snake-game-over');
        if (gameOverMsg) {
            gameOverMsg.innerHTML = `GAME OVER!<br>Score (${difficultyName}): ${score}`
                                  + `<br>High Score (${difficultyName}): ${finalHighScore}`
                                  + newHighScoreMsg
                                  + `<br><small>(SPACE to Restart | ESC to Close)</small>`;
            gameOverMsg.style.display = 'block';
        }

        const pausedMsg = gameWindow?.querySelector('#snake-paused-message');
        if (pausedMsg) pausedMsg.style.display = 'none';
        if (pauseButton) pauseButton.textContent = 'Pause';

        drawGame();
    }

    function clearAllTimers() {
        if (gameLoopInterval) clearInterval(gameLoopInterval); gameLoopInterval = null;
        if (goldenFoodTimer) clearTimeout(goldenFoodTimer); goldenFoodTimer = null;
        if (goldenFoodSpawnCooldownTimer) clearTimeout(goldenFoodSpawnCooldownTimer); goldenFoodSpawnCooldownTimer = null;
        if (goldenFoodSpawnGuaranteeTimer) clearTimeout(goldenFoodSpawnGuaranteeTimer); goldenFoodSpawnGuaranteeTimer = null;
        if (speedBoostTimer) clearTimeout(speedBoostTimer); speedBoostTimer = null;
        if (boostCountdownInterval) clearInterval(boostCountdownInterval); boostCountdownInterval = null;
        if (obstacleSpawnTimer) clearInterval(obstacleSpawnTimer); obstacleSpawnTimer = null;
        if (threatSpawnCooldownTimer) clearTimeout(threatSpawnCooldownTimer); threatSpawnCooldownTimer = null;
        if (threatSpawnGuaranteeTimer) clearTimeout(threatSpawnGuaranteeTimer); threatSpawnGuaranteeTimer = null;
        obstacles.forEach(obs => {
            if (obs.blinkInterval) clearInterval(obs.blinkInterval);
            if (obs.activationTimeout) clearTimeout(obs.activationTimeout);
            if (obs.removalTimeout) clearTimeout(obs.removalTimeout);
        });
        if (threat) {
            if (threat.warningBlinkInterval) clearInterval(threat.warningBlinkInterval);
            if (threat.activationTimeout) clearTimeout(threat.activationTimeout);
            if (threat.moveInterval) clearInterval(threat.moveInterval);
        }
    }


    function closeGameWindow() {
         clearAllTimers();
         document.removeEventListener('mousemove', handleDraggingBound); document.removeEventListener('mouseup', handleDragEndBound); if (gameWindow) { if (headerElement) { headerElement.removeEventListener('dblclick', toggleMinimize); headerElement.removeEventListener('mousedown', handleDragStart); } gameWindow.remove(); gameWindow = null; } if (initialKeyListener) document.removeEventListener('keydown', initialKeyListener); if (gameKeyListener) document.removeEventListener('keydown', gameKeyListener); if (escapeAndRestartListener) document.removeEventListener('keydown', escapeAndRestartListener); initialKeyListener = null; gameKeyListener = null; escapeAndRestartListener = null; isRunning = false; isGameOver = false; isPaused = false; isMinimized = false; speedBoostActive = false; goldenFood = null; obstacles = []; threat = null; scoreNotifications = [];
         currentGameSpeed = BASE_GAME_SPEED;
         isDragging = false; canvas = null; ctx = null; headerElement = null; pauseButton = null; difficultyButton = null; boostCountdownDisplay = null; helpButton = null;
    }

    function initializeGame() {
        clearAllTimers();
        obstacles = []; goldenFood = null; threat = null; scoreNotifications = [];
        applyDifficultySettings();
        const startX = Math.floor((CANVAS_WIDTH / GRID_SIZE) / 2) * GRID_SIZE; const startY = Math.floor((CANVAS_HEIGHT / GRID_SIZE) / 2) * GRID_SIZE;
        snake = [{ x: startX, y: startY }]; dx = 0; dy = 0; score = 0;
        isRunning = false; isGameOver = false; isPaused = false; isMinimized = false;
        speedBoostActive = false; currentGameSpeed = activeGameSpeed;
        if (gameWindow) { const go=gameWindow.querySelector('#snake-game-over'); if(go) go.style.display='none'; const st=gameWindow.querySelector('#snake-start-message'); if(st) st.style.display='block'; const pa=gameWindow.querySelector('#snake-paused-message'); if(pa) pa.style.display='none'; if(boostCountdownDisplay) boostCountdownDisplay.style.display='none'; gameWindow.classList.remove('minimized');}
        if (pauseButton) pauseButton.textContent = 'Pause';
        if (difficultyButton) {
             difficultyButton.textContent = DIFFICULTIES[currentDifficultyIndex];
             difficultyButton.classList.remove('disabled');
        }
        placeFood(); updateScoreDisplay(); setupInitialKeyListener();

        scheduleNextGoldenFoodAttempt();
        scheduleNextThreatAttempt();
        scheduleObstacleSpawning();

        drawGame();
    }

    function getGridDistance(x1, y1, x2, y2) { const gX1=x1/GRID_SIZE,gY1=y1/GRID_SIZE,gX2=x2/GRID_SIZE,gY2=y2/GRID_SIZE; return Math.abs(gX1-gX2)+Math.abs(gY1-gY2); }
    function isOccupied(checkX, checkY, checkThreatWarning = false) { for (const segment of snake) { if (segment.x === checkX && segment.y === checkY) return true; } if (food && food.x === checkX && food.y === checkY) return true; if (goldenFood && goldenFood.x === checkX && goldenFood.y === checkY) return true; for (const obs of obstacles) { for (const block of obs.blocks) { if (block.x === checkX && block.y === checkY) return true; } } if (threat) { if (threat.state === 'active') { for(const block of threat.blocks) { if (block.x === checkX && block.y === checkY) return true; } } if (checkThreatWarning && threat.state === 'warning' && threat.pathHighlight) { if(threat.pathHighlight.type === 'row' && threat.pathHighlight.index * GRID_SIZE === checkY) return true; if(threat.pathHighlight.type === 'col' && threat.pathHighlight.index * GRID_SIZE === checkX) return true; } } return false;}
    function placeFood() { let foodX, foodY, distance; const head = snake[0]; let attempts = 0; const maxAttempts = 100; do { attempts++; foodX = Math.floor(Math.random()*(CANVAS_WIDTH/GRID_SIZE))*GRID_SIZE; foodY = Math.floor(Math.random()*(CANVAS_HEIGHT/GRID_SIZE))*GRID_SIZE; if (isOccupied(foodX, foodY)) continue; distance = getGridDistance(head.x, head.y, foodX, foodY); } while ((distance > MAX_NORMAL_FOOD_DISTANCE || isOccupied(foodX, foodY)) && attempts < maxAttempts); if (attempts >= maxAttempts) { foodX = Math.floor(Math.random()*(CANVAS_WIDTH/GRID_SIZE))*GRID_SIZE; foodY = Math.floor(Math.random()*(CANVAS_HEIGHT/GRID_SIZE))*GRID_SIZE; let fallbackAttempts = 0; while(isOccupied(foodX, foodY) && fallbackAttempts < 50) { foodX = Math.floor(Math.random()*(CANVAS_WIDTH/GRID_SIZE))*GRID_SIZE; foodY = Math.floor(Math.random()*(CANVAS_HEIGHT/GRID_SIZE))*GRID_SIZE; fallbackAttempts++; }} food = { x: foodX, y: foodY };}
    function placeGoldenFood() { let goldX, goldY, distance; const head = snake[0]; let attempts = 0; const maxAttempts = 100; do { attempts++; goldX = Math.floor(Math.random()*(CANVAS_WIDTH/GRID_SIZE))*GRID_SIZE; goldY = Math.floor(Math.random()*(CANVAS_HEIGHT/GRID_SIZE))*GRID_SIZE; if (isOccupied(goldX, goldY)) continue; distance = getGridDistance(head.x, head.y, goldX, goldY); } while ((distance > MAX_GOLDEN_FOOD_DISTANCE || isOccupied(goldX, goldY)) && attempts < maxAttempts); if (attempts >= maxAttempts) { return false; } goldenFood = { x: goldX, y: goldY }; return true;}

    function trySpawnGoldenFood() {
        if (goldenFood || goldenFoodSpawnCooldownTimer || !isRunning || isPaused || isGameOver || isMinimized) {
            if (!goldenFood && !goldenFoodSpawnCooldownTimer) {
                 scheduleNextGoldenFoodAttempt();
            }
            return;
        }

        if (placeGoldenFood()) {
            if(goldenFoodTimer) clearTimeout(goldenFoodTimer);
            goldenFoodTimer = setTimeout(removeGoldenFood, GOLDEN_FOOD_DURATION);
            drawGame();
        } else {
            scheduleNextGoldenFoodAttempt(GOLDEN_FOOD_MIN_SPAWN_INTERVAL / 2);
        }
    }

    function scheduleNextGoldenFoodAttempt(delayOverride = null) {
         if (goldenFoodSpawnGuaranteeTimer) clearTimeout(goldenFoodSpawnGuaranteeTimer);
         goldenFoodSpawnGuaranteeTimer = null;
         if (!isRunning || isGameOver) return;

         const delay = delayOverride !== null ? delayOverride :
                       GOLDEN_FOOD_MIN_SPAWN_INTERVAL + Math.random() * (GOLDEN_FOOD_MAX_SPAWN_INTERVAL - GOLDEN_FOOD_MIN_SPAWN_INTERVAL);

         goldenFoodSpawnGuaranteeTimer = setTimeout(() => {
             goldenFoodSpawnGuaranteeTimer = null;
             trySpawnGoldenFood();
         }, delay);
    }

     function startGoldenFoodCooldown() {
        if (goldenFoodSpawnCooldownTimer) clearTimeout(goldenFoodSpawnCooldownTimer);
        goldenFoodSpawnCooldownTimer = setTimeout(() => {
            goldenFoodSpawnCooldownTimer = null;
            scheduleNextGoldenFoodAttempt();
        }, GOLDEN_FOOD_MIN_SPAWN_INTERVAL);
    }

    function removeGoldenFood() {
        if (goldenFoodTimer) clearTimeout(goldenFoodTimer);
        goldenFoodTimer = null;
        goldenFood = null;
        startGoldenFoodCooldown();
        drawGame();
    }


    function trySpawnObstacle() { if (!isRunning || isPaused || isGameOver || isMinimized || obstacles.length >= activeMaxObstacles) return; const size = Math.floor(Math.random() * (activeObstacleMaxSize - activeObstacleMinSize + 1)) + activeObstacleMinSize; let potentialBlocks = []; let startX, startY; let possible = false; let attempts = 0; const maxPlacementAttempts = 50; while (attempts < maxPlacementAttempts && !possible) { attempts++; startX = Math.floor(Math.random()*(CANVAS_WIDTH/GRID_SIZE))*GRID_SIZE; startY = Math.floor(Math.random()*(CANVAS_HEIGHT/GRID_SIZE))*GRID_SIZE; if (!isOccupied(startX, startY)) { possible = true; potentialBlocks.push({ x: startX, y: startY }); } } if (!possible) { return; } let currentSize = 1; let growthAttempts = 0; const maxGrowthAttempts = 10; while (currentSize < size && growthAttempts < maxGrowthAttempts * size) { growthAttempts++; const growFrom = potentialBlocks[Math.floor(Math.random()*potentialBlocks.length)]; const directions = [{dx:0,dy:-GRID_SIZE},{dx:0,dy:GRID_SIZE},{dx:-GRID_SIZE,dy:0},{dx:GRID_SIZE,dy:0}]; directions.sort(()=>Math.random()-0.5); let added = false; for (const dir of directions) { const nextX = growFrom.x+dir.dx; const nextY = growFrom.y+dir.dy; if (nextX < 0 || nextX >= CANVAS_WIDTH || nextY < 0 || nextY >= CANVAS_HEIGHT) continue; const alreadyExists = potentialBlocks.some(b=>b.x===nextX&&b.y===nextY); if (!alreadyExists && !isOccupied(nextX, nextY)) { potentialBlocks.push({x:nextX,y:nextY}); currentSize++; added = true; break; } } if (added) growthAttempts = 0; if(currentSize >= size) break; } const newObstacle = { id: Date.now()+Math.random(), blocks: potentialBlocks, state: 'blinking', spawnTime: Date.now(), blinkToggle: false, blinkInterval: null, activationTimeout: null, removalTimeout: null }; newObstacle.blinkInterval = setInterval(()=>{ newObstacle.blinkToggle = !newObstacle.blinkToggle; drawGame(); }, 300); newObstacle.activationTimeout = setTimeout(()=>{ activateObstacle(newObstacle.id); }, OBSTACLE_BLINK_DURATION); obstacles.push(newObstacle); drawGame(); }
    function activateObstacle(obstacleId) { const obstacle = obstacles.find(obs => obs.id === obstacleId); if (!obstacle || obstacle.state !== 'blinking') return; if (obstacle.blinkInterval) clearInterval(obstacle.blinkInterval); obstacle.blinkInterval = null; obstacle.activationTimeout = null; obstacle.state = 'active'; obstacle.activationTime = Date.now(); const head = snake[0]; for(const block of obstacle.blocks) { if(head.x === block.x && head.y === block.y) { gameOver(); return; } } const lifetime = activeObstacleMinLifetime + Math.random()*(activeObstacleMaxLifetime - activeObstacleMinLifetime); obstacle.removalTimeout = setTimeout(()=>{ removeObstacle(obstacle.id); }, lifetime); drawGame(); }
    function removeObstacle(obstacleId) { const index = obstacles.findIndex(obs => obs.id === obstacleId); if (index > -1) { const obs = obstacles[index]; if (obs.blinkInterval) clearInterval(obs.blinkInterval); if (obs.activationTimeout) clearTimeout(obs.activationTimeout); if (obs.removalTimeout) clearTimeout(obs.removalTimeout); obstacles.splice(index, 1); drawGame(); } }

    function scheduleObstacleSpawning() {
        if (obstacleSpawnTimer) clearInterval(obstacleSpawnTimer);
        obstacleSpawnTimer = setInterval(() => {
            if(isRunning && !isPaused && !isGameOver && !isMinimized) {
                trySpawnObstacle();
            }
        }, activeObstacleSpawnInterval);
    }


    function trySpawnThreat() { if (threat || threatSpawnCooldownTimer || !isRunning || isPaused || isGameOver || isMinimized) { if (!threat && !threatSpawnCooldownTimer) { scheduleNextThreatAttempt(); } return; } const isHorizontal = Math.random() < 0.5; let threatDx, threatDy, pathType, pathIndex; let potentialStartBlock; let threatBlocks = []; const gridWidth = CANVAS_WIDTH/GRID_SIZE; const gridHeight = CANVAS_HEIGHT/GRID_SIZE; let possibleStart = false; let startAttempts = 0; const maxStartAttempts = 50; while (!possibleStart && startAttempts < maxStartAttempts) { startAttempts++; threatBlocks = []; let currentStartX, currentStartY; if (isHorizontal) { pathType = 'row'; pathIndex = Math.floor(Math.random() * gridHeight); threatDy = 0; if (Math.random() < 0.5) { threatDx = GRID_SIZE; } else { threatDx = -GRID_SIZE; } potentialStartBlock = { y: pathIndex * GRID_SIZE, x: (threatDx > 0) ? 0 : CANVAS_WIDTH - GRID_SIZE }; } else { pathType = 'col'; pathIndex = Math.floor(Math.random() * gridWidth); threatDx = 0; if (Math.random() < 0.5) { threatDy = GRID_SIZE; } else { threatDy = -GRID_SIZE; } potentialStartBlock = { x: pathIndex * GRID_SIZE, y: (threatDy > 0) ? 0 : CANVAS_HEIGHT - GRID_SIZE }; } let allBlocksValid = true; for (let i = 0; i < activeThreatSize; i++) { let blockX, blockY; if (isHorizontal) { blockX = potentialStartBlock.x + i * threatDx; blockY = potentialStartBlock.y; } else { blockX = potentialStartBlock.x; blockY = potentialStartBlock.y + i * threatDy; } if (blockX < 0 || blockX >= CANVAS_WIDTH || blockY < 0 || blockY >= CANVAS_HEIGHT || isOccupied(blockX, blockY, true)) { allBlocksValid = false; break; } threatBlocks.push({ x: blockX, y: blockY }); } if (allBlocksValid) { possibleStart = true; } } if (!possibleStart) { scheduleNextThreatAttempt(activeThreatSpawnInterval / 2); return; } threat = { blocks: threatBlocks, dx: threatDx, dy: threatDy, state: 'warning', warningStartTime: Date.now(), pathHighlight: { type: pathType, index: pathIndex }, activationTimeout: null, moveInterval: null, warningBlinkInterval: null, remainingActivationTime: THREAT_WARNING_DURATION }; threatBlinkToggle = false; threat.warningBlinkInterval = setInterval(() => { threatBlinkToggle = !threatBlinkToggle; drawGame(); }, 250); threat.activationTimeout = setTimeout(() => { activateThreat(); }, threat.remainingActivationTime); startThreatCooldown(); drawGame(); }
    function activateThreat() { if (!threat || threat.state !== 'warning') return; if (threat.warningBlinkInterval) clearInterval(threat.warningBlinkInterval); threat.warningBlinkInterval = null; threat.activationTimeout = null; threat.state = 'active'; threat.pathHighlight = null; const head = snake[0]; for(const block of threat.blocks) { if(head.x === block.x && head.y === block.y) { gameOver(); return; } } threat.moveInterval = setInterval(moveThreat, activeThreatMoveIntervalDuration); drawGame(); }
    function moveThreat() { if (!threat || threat.state !== 'active' || isPaused) return; let isOffScreen = true; for (const block of threat.blocks) { block.x += threat.dx; block.y += threat.dy; if (!(threat.dx > 0 && block.x >= CANVAS_WIDTH) && !(threat.dx < 0 && block.x < -GRID_SIZE * (activeThreatSize -1)) && !(threat.dy > 0 && block.y >= CANVAS_HEIGHT) && !(threat.dy < 0 && block.y < -GRID_SIZE * (activeThreatSize -1))) { isOffScreen = false; } } if (isOffScreen) { removeThreat(); } else { if (checkCollision()) { gameOver(); return; } drawGame(); } }
    function removeThreat() { if (!threat) return; if (threat.moveInterval) clearInterval(threat.moveInterval); threat.moveInterval = null; if (threat.warningBlinkInterval) clearInterval(threat.warningBlinkInterval); threat.warningBlinkInterval = null; if (threat.activationTimeout) clearTimeout(threat.activationTimeout); threat.activationTimeout = null; threat = null; startThreatCooldown(); drawGame(); }

    function scheduleNextThreatAttempt(delayOverride = null) {
         if (threatSpawnGuaranteeTimer) clearTimeout(threatSpawnGuaranteeTimer);
         threatSpawnGuaranteeTimer = null;
         if (!isRunning || isGameOver) return;

         const delay = delayOverride !== null ? delayOverride : activeThreatSpawnInterval;

         threatSpawnGuaranteeTimer = setTimeout(() => {
             threatSpawnGuaranteeTimer = null;
             trySpawnThreat();
         }, delay);
    }

     function startThreatCooldown() {
        if (threatSpawnCooldownTimer) clearTimeout(threatSpawnCooldownTimer);
        threatSpawnCooldownTimer = setTimeout(() => {
            threatSpawnCooldownTimer = null;
            scheduleNextThreatAttempt();
        }, activeThreatSpawnInterval);
    }

    function activateSpeedBoost() { boostStartTime = Date.now(); if (speedBoostActive) { clearTimeout(speedBoostTimer); clearInterval(boostCountdownInterval); } else { currentGameSpeed = Math.round(activeGameSpeed / SPEED_BOOST_FACTOR); speedBoostActive = true; if (isRunning && !isPaused && !isMinimized && gameLoopInterval) { clearInterval(gameLoopInterval); gameLoopInterval = setInterval(gameLoop, currentGameSpeed); } } speedBoostTimer = setTimeout(deactivateSpeedBoost, SPEED_BOOST_DURATION); if (boostCountdownDisplay) { boostCountdownDisplay.style.display = 'block'; updateBoostCountdown(); boostCountdownInterval = setInterval(updateBoostCountdown, 100); } }
    function updateBoostCountdown() { if (!speedBoostActive || !boostCountdownDisplay) { if (boostCountdownInterval) clearInterval(boostCountdownInterval); boostCountdownInterval = null; if(boostCountdownDisplay) boostCountdownDisplay.style.display = 'none'; return; } const elapsed = Date.now() - boostStartTime; const remaining = Math.max(0, SPEED_BOOST_DURATION - elapsed); boostCountdownDisplay.textContent = `${(remaining / 1000).toFixed(1)}s`; if (remaining <= 0) { clearInterval(boostCountdownInterval); boostCountdownInterval = null; if (boostCountdownDisplay) boostCountdownDisplay.style.display = 'none'; } }
    function deactivateSpeedBoost() { if (!speedBoostActive) return; speedBoostActive = false; currentGameSpeed = activeGameSpeed; if (speedBoostTimer) clearTimeout(speedBoostTimer); speedBoostTimer = null; if (boostCountdownInterval) clearInterval(boostCountdownInterval); boostCountdownInterval = null; if (boostCountdownDisplay) boostCountdownDisplay.style.display = 'none'; if (isRunning && !isPaused && !isMinimized && gameLoopInterval) { clearInterval(gameLoopInterval); gameLoopInterval = setInterval(gameLoop, currentGameSpeed); } }
    function gameLoop() { if (isGameOver || !isRunning || isPaused || isMinimized) { drawGame(); return; } moveSnake(); if (checkCollision()) { gameOver(); return; } drawGame(); }
    function moveSnake() { const head = { x: snake[0].x + dx, y: snake[0].y + dy }; snake.unshift(head); let ateFood = false; if (goldenFood && head.x === goldenFood.x && head.y === goldenFood.y) { score += GOLDEN_FOOD_SCORE; scoreNotifications.push({ text: `+${GOLDEN_FOOD_SCORE}`, x: goldenFood.x + GRID_SIZE / 2, y: goldenFood.y - 5, expires: Date.now() + SCORE_NOTIFICATION_DURATION }); removeGoldenFood(); activateSpeedBoost(); ateFood = true; } else if (food && food.x === head.x && food.y === head.y) { score++; placeFood(); ateFood = true; } if (!ateFood) { snake.pop(); } updateScoreDisplay(); }
    function checkCollision() { const head = snake[0]; if (head.x < 0 || head.x >= CANVAS_WIDTH || head.y < 0 || head.y >= CANVAS_HEIGHT) return true; for (let i = 1; i < snake.length; i++) { if (head.x === snake[i].x && head.y === snake[i].y) return true; } for (const obs of obstacles) { if (obs.state === 'active') { for (const block of obs.blocks) { if (head.x === block.x && head.y === block.y) return true; } } } if (threat && threat.state === 'active') { for(const block of threat.blocks) { if (head.x === block.x && head.y === block.y) return true; } } return false; }
    function drawGame() { if (!ctx || !gameWindow) return; ctx.fillStyle = BACKGROUND_COLOR; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); if (isMinimized) return; if (food) { ctx.fillStyle = FOOD_COLOR; ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = BACKGROUND_COLOR; ctx.strokeRect(food.x, food.y, GRID_SIZE, GRID_SIZE); } if (goldenFood) { ctx.fillStyle = GOLDEN_FOOD_COLOR; ctx.fillRect(goldenFood.x, goldenFood.y, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = 'orange'; ctx.lineWidth = 2; ctx.strokeRect(goldenFood.x + 1, goldenFood.y + 1, GRID_SIZE - 2, GRID_SIZE - 2); ctx.lineWidth = 1; } obstacles.forEach(obs => { let fillColor = OBSTACLE_COLOR; if (obs.state === 'blinking') { fillColor = obs.blinkToggle ? OBSTACLE_BLINK_COLOR1 : OBSTACLE_BLINK_COLOR2; } ctx.fillStyle = fillColor; obs.blocks.forEach(block => { ctx.fillRect(block.x, block.y, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = BACKGROUND_COLOR; ctx.strokeRect(block.x, block.y, GRID_SIZE, GRID_SIZE); }); }); if (threat && threat.state === 'warning' && threat.pathHighlight) { ctx.fillStyle = THREAT_WARNING_COLOR; if (threatBlinkToggle) { if (threat.pathHighlight.type === 'row') { ctx.fillRect(0, threat.pathHighlight.index * GRID_SIZE, CANVAS_WIDTH, GRID_SIZE); } else { ctx.fillRect(threat.pathHighlight.index * GRID_SIZE, 0, GRID_SIZE, CANVAS_HEIGHT); } } } if (threat && threat.state === 'active') { ctx.fillStyle = THREAT_COLOR; threat.blocks.forEach(block => { ctx.fillRect(block.x, block.y, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = BACKGROUND_COLOR; ctx.strokeRect(block.x, block.y, GRID_SIZE, GRID_SIZE); }); } ctx.fillStyle = SNAKE_COLOR; if (snake) { snake.forEach((segment) => { ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = BACKGROUND_COLOR; ctx.strokeRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE); }); } const now = Date.now(); scoreNotifications = scoreNotifications.filter(notif => now < notif.expires); ctx.fillStyle = SCORE_NOTIFICATION_COLOR; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.shadowColor = 'black'; ctx.shadowBlur = 3; scoreNotifications.forEach(notif => { ctx.fillText(notif.text, notif.x, notif.y); }); ctx.shadowBlur = 0; const startMsg = gameWindow?.querySelector('#snake-start-message'); if (startMsg) startMsg.style.display = (isRunning || isGameOver) ? 'none' : 'block'; const pausedMsg = gameWindow?.querySelector('#snake-paused-message'); if (pausedMsg) pausedMsg.style.display = (isPaused && !isGameOver && !isMinimized) ? 'block' : 'none'; }
    function updateScoreDisplay() { const scoreDisplay = gameWindow?.querySelector('#snake-score'); if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`; }
    function togglePause() { if (!isRunning || isGameOver || isMinimized) return; isPaused = !isPaused; if (pauseButton) pauseButton.textContent = isPaused ? 'Resume' : 'Pause'; if (isPaused) { pauseStartTime = Date.now(); if (gameLoopInterval) clearInterval(gameLoopInterval); gameLoopInterval = null; if (threat && threat.state === 'warning' && threat.activationTimeout) { clearTimeout(threat.activationTimeout); const elapsedWarningTime = pauseStartTime - threat.warningStartTime; threat.remainingActivationTime = Math.max(0, THREAT_WARNING_DURATION - elapsedWarningTime); threat.activationTimeout = null; } if (boostCountdownInterval) clearInterval(boostCountdownInterval); boostCountdownInterval = null; if (speedBoostActive && speedBoostTimer) { clearTimeout(speedBoostTimer); const elapsedBoostTime = pauseStartTime - boostStartTime; speedBoostActive = false; speedBoostTimer = Math.max(0, SPEED_BOOST_DURATION - elapsedBoostTime); } } else { const pauseDuration = Date.now() - pauseStartTime; if (!gameLoopInterval) gameLoopInterval = setInterval(gameLoop, currentGameSpeed); if (threat && threat.state === 'warning' && threat.remainingActivationTime > 0 && !threat.activationTimeout) { threat.warningStartTime += pauseDuration; threat.activationTimeout = setTimeout(()=>{ activateThreat(); }, threat.remainingActivationTime); } if (typeof speedBoostTimer === 'number' && speedBoostTimer > 0) { boostStartTime += pauseDuration; speedBoostActive = true; const remainingBoostDuration = speedBoostTimer; speedBoostTimer = setTimeout(deactivateSpeedBoost, remainingBoostDuration); if (boostCountdownDisplay && !boostCountdownInterval) { updateBoostCountdown(); boostCountdownInterval = setInterval(updateBoostCountdown, 100); } } else { speedBoostActive = false; speedBoostTimer = null; } scheduleNextGoldenFoodAttempt(); scheduleNextThreatAttempt(); } drawGame(); }
    function toggleMinimize(event) { if (!gameWindow || !headerElement) return; const target = event.target; if (target.closest('.snake-header-button')) { event.stopPropagation(); return; } isMinimized = !isMinimized; gameWindow.classList.toggle('minimized', isMinimized); if (isMinimized && isRunning && !isPaused) togglePause(); drawGame(); }
    function changeDifficulty() { if (isRunning && !isGameOver) { if(difficultyButton) difficultyButton.classList.add('disabled'); return; } if(difficultyButton) difficultyButton.classList.remove('disabled'); currentDifficultyIndex = (currentDifficultyIndex + 1) % DIFFICULTIES.length; if (difficultyButton) difficultyButton.textContent = DIFFICULTIES[currentDifficultyIndex]; applyDifficultySettings(); }
    function openHelpWindow() { const difficultyName = DIFFICULTIES[currentDifficultyIndex]; const hs = getCurrentHighScore(); const allScores = DIFFICULTIES.map(d => `${d}: ${highScores[d] || 0}`).join('<br>'); const helpText = ` Être un kob bleu impérial. Manger des steaks. Eviter les obstacles. Les steaks dorés sont super mais ils font tourner la tête.<br><br> Pause pour mettre en pause.<br> Double clic sur la partie supérieur pour réduire la fenêtre.<br> Déplacer la fenêtre en cliquant enfoncé sur la partie supérieure.<br><br> Trois difficultés : Nemo, Civis, Pragar<br> High Score actuel (${difficultyName}): ${hs}<br><br> <b>High Scores :</b><br>${allScores}<br><br> Bon appétit. `.trim(); const windowFeatures = 'width=450,height=400,resizable=yes,scrollbars=yes,status=no,menubar=no,toolbar=no'; const helpWin = window.open('', 'KobSteakHelp', windowFeatures); if (!helpWin) { alert('Popup blocked! Please allow popups for this site to view help.'); return; } helpWin.document.write(` <!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>KobSteak - Aide & High Scores</title> <style>body { background-color: black; color: white; font-family: sans-serif; padding: 20px; line-height: 1.6; } b { color: lightblue; }</style> </head><body>${helpText}</body></html> `); helpWin.document.close(); helpWin.focus(); }
    function handleDragStart(event) { if (event.button !== 0 || !gameWindow || !headerElement) return; const target = event.target; if (target.closest('.snake-header-button')) return; isDragging = true; dragStartX = event.clientX; dragStartY = event.clientY; const rect = gameWindow.getBoundingClientRect(); initialWindowX = rect.left + window.scrollX; initialWindowY = rect.top + window.scrollY; gameWindow.style.transform = 'none'; gameWindow.style.left = `${initialWindowX}px`; gameWindow.style.top = `${initialWindowY}px`; gameWindow.classList.add('dragging'); headerElement.style.cursor = 'grabbing'; document.addEventListener('mousemove', handleDraggingBound); document.addEventListener('mouseup', handleDragEndBound, { once: true }); event.preventDefault(); }
    function handleDragging(event) { if (!isDragging || !gameWindow) return; const deltaX = event.clientX - dragStartX; const deltaY = event.clientY - dragStartY; gameWindow.style.left = `${initialWindowX + deltaX}px`; gameWindow.style.top = `${initialWindowY + deltaY}px`; }
    function handleDragEnd(event) { if (!isDragging || event.button !== 0) return; isDragging = false; if(gameWindow) gameWindow.classList.remove('dragging'); if(headerElement) headerElement.style.cursor = 'grab'; document.removeEventListener('mousemove', handleDraggingBound); }
    function setupInitialKeyListener() { if (initialKeyListener) document.removeEventListener('keydown', initialKeyListener); if (gameKeyListener) document.removeEventListener('keydown', gameKeyListener); gameKeyListener = null; initialKeyListener = function(event) { if (gameWindow && !isRunning && !isGameOver && !isMinimized && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) { handleKeyDown(event); if (dx !== 0 || dy !== 0) { applyDifficultySettings(); currentGameSpeed = activeGameSpeed; isRunning = true; isPaused = false; if (difficultyButton) difficultyButton.classList.add('disabled'); const startMsg = gameWindow.querySelector('#snake-start-message'); if (startMsg) startMsg.style.display = 'none'; if (!gameLoopInterval) gameLoopInterval = setInterval(gameLoop, currentGameSpeed); scheduleObstacleSpawning(); scheduleNextThreatAttempt(); scheduleNextGoldenFoodAttempt(); document.removeEventListener('keydown', initialKeyListener); initialKeyListener = null; setupGameKeyListener(); } } }; document.addEventListener('keydown', initialKeyListener); }

    function setupGameKeyListener() {
        if (gameKeyListener) document.removeEventListener('keydown', gameKeyListener);
        if (initialKeyListener) document.removeEventListener('keydown', initialKeyListener);
        initialKeyListener = null;
        gameKeyListener = function(event) {
            if (!gameWindow || isGameOver || isMinimized) return;

            const target = event.target;
            const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (event.key === ' ' && !isInputFocused) {
                event.preventDefault();
                togglePause();
                return;
            }
            if (isRunning && !isPaused && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                 if (!isInputFocused) {
                    handleKeyDown(event);
                 }
            }
        };
        document.addEventListener('keydown', gameKeyListener);
    }

    function setupEscapeAndRestartListener() { if (escapeAndRestartListener) document.removeEventListener('keydown', escapeAndRestartListener); escapeAndRestartListener = function(event) { if (!gameWindow) return; const target = event.target; const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable; if (event.key === 'Escape' && !isInputFocused) { event.preventDefault(); closeGameWindow(); } else if (event.key === ' ' && isGameOver && !isInputFocused) { event.preventDefault(); initializeGame(); } }; document.addEventListener('keydown', escapeAndRestartListener); }
    function handleKeyDown(event) { const currentDx = dx; const currentDy = dy; let newDx = dx; let newDy = dy; switch (event.key) { case 'ArrowUp': if (currentDy === 0) { newDx = 0; newDy = -GRID_SIZE; } break; case 'ArrowDown': if (currentDy === 0) { newDx = 0; newDy = GRID_SIZE; } break; case 'ArrowLeft': if (currentDx === 0) { newDx = -GRID_SIZE; newDy = 0; } break; case 'ArrowRight': if (currentDx === 0) { newDx = GRID_SIZE; newDy = 0; } break; default: return; } if ((currentDx === 0 && currentDy === 0) || !(newDx === -currentDx && newDy === -currentDy)) { dx = newDx; dy = newDy; event.preventDefault(); } }

    function handleGlobalKeyDown(event) {
         const target = event.target;
         const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
         if (event.shiftKey && event.key === 'F1' && !isInputFocused) {
             event.preventDefault();
             if (!gameWindow) {
                 createGameWindow();
             } else {
                 closeGameWindow();
             }
         }
    }

    loadHighScores();
    document.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('unload', closeGameWindow);

})();