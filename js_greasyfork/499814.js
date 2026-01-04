// ==UserScript==
// @name         Connect 4 AI for papergames
// @namespace    https://github.com/longkidkoolstar
// @version      0.2.5
// @description  Adds an autonomous AI player to Connect 4 on papergames.io with Python mouse control and multiple AI APIs
// @author       longkidkoolstar
// @icon         https://th.bing.com/th/id/R.2ea02f33df030351e0ea9bd6df0db744?rik=Pnmqtc4WLvL0ow&pid=ImgRaw&r=0
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://papergames.io/*
// @license      none
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      connect4.gamesolver.org
// @connect      kevinalbs.com
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/499814/Connect%204%20AI%20for%20papergames.user.js
// @updateURL https://update.greasyfork.org/scripts/499814/Connect%204%20AI%20for%20papergames.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    // Configuration variables
    const PYTHON_SERVER_URL = 'http://localhost:8765';
    const MOVE_DELAY = 1500; // Delay before making a move (ms)
    const COOLDOWN_DELAY = 2000; // Cooldown after making a move (ms)
    const BOARD_CHECK_INTERVAL = 1000; // How often to check the board (ms)
    const RESET_CHECK_INTERVAL = 500; // How often to check for reset buttons (ms)
    const SERVER_CHECK_INTERVAL = 10000; // How often to check Python server status (ms)
    const SERVER_RETRY_INTERVAL = 3000; // How often to retry connecting to the server when disconnected (ms)
    const AUTO_QUEUE_CHECK_INTERVAL = 1000; // How often to check for auto-queue buttons (ms)
    const AUTO_QUEUE_ENABLED_DEFAULT = false; // Default state for auto-queue
    
    // State variables
    var username = await GM.getValue('username');
    var player;
    var prevChronometerValue = '';
    var moveHistory = [];
    var lastBoardState = [];
    var aiTurn = false;
    var processingMove = false;
    var moveCooldown = false;
    var pythonServerAvailable = false;
    var serverCheckRetryCount = 0;
    var autoPlayEnabled = true; // Auto-play is enabled by default
    var bestMoveStrategy = 'optimal'; // 'optimal', 'random', 'defensive'
    var keyboardControlsEnabled = true; // Enable keyboard controls by default
    var selectedAPI = await GM.getValue('selectedAPI', 'gamesolver'); // Default to gamesolver API
    var isAutoQueueOn = await GM.getValue('autoQueueEnabled', AUTO_QUEUE_ENABLED_DEFAULT); // Get auto-queue state from storage

    // If username is not set, prompt the user
    if (!username) {
        username = prompt('Please enter your Papergames username (case-sensitive):');
        await GM.setValue('username', username);
    }

    // Reset all game state variables
    function resetVariables() {
        player = undefined;
        prevChronometerValue = '';
        moveHistory = [];
        lastBoardState = [];
        aiTurn = false;
        processingMove = false;
        moveCooldown = false;
        console.log("Variables reset to default states");
    }

    // Check for UI elements that indicate we should reset game state
    function checkForResetButtons() {
        var playOnlineButton = document.querySelector("body > app-root > app-navigation > div > div.d-flex.flex-column.h-100.w-100 > main > app-game-landing > div > div > div > div.col-12.col-lg-9.dashboard > div.card.area-buttons.d-flex.justify-content-center.align-items-center.flex-column > button.btn.btn-secondary.btn-lg.position-relative");
        var leaveRoomButton = document.querySelector("button.btn-light.ng-tns-c189-7");
        var customResetButton = document.querySelector("button.btn.btn-outline-dark.ng-tns-c497539356-18.ng-star-inserted");
    
        if (playOnlineButton || leaveRoomButton || customResetButton) {
            resetVariables();
        }
        
        // Also reset if we're on certain pages
        if (window.location.href.includes("/match-history") ||
            window.location.href.includes("/friends") ||
            window.location.href.includes("/chat")) {
            resetVariables();
        }
    }

    // Handle keyboard input for column selection
    function setupKeyboardControls() {
        document.addEventListener('keydown', function(event) {
            // Only process if keyboard controls are enabled and we're on a game page
            if (!keyboardControlsEnabled || !document.querySelector(".grid.size6x7")) return;
            
            // Check if the key is a number between 1-7
            const column = parseInt(event.key);
            if (column >= 1 && column <= 7) {
                // Don't process if we're already processing a move or server is unavailable
                if (processingMove || !pythonServerAvailable) return;
                
                // Don't capture keyboard input if user is typing in an input field
                if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
                
                console.log(`Keyboard input detected: Column ${column}`);
                processingMove = true;
                clickColumn(column);
                
                // Prevent default action (like scrolling)
                event.preventDefault();
            }
            
            // Toggle auto-play with 'a' key
            if (event.key === 'a' || event.key === 'A') {
                toggleAutoPlay();
                event.preventDefault();
            }
            
            // Toggle keyboard controls with 'k' key
            if (event.key === 'k' || event.key === 'K') {
                toggleKeyboardControls();
                event.preventDefault();
            }
            
            // Toggle API with 'h' key (for Human mode)
            if (event.key === 'h' || event.key === 'H') {
                toggleAPI();
                event.preventDefault();
            }
            
            // Toggle Auto-Queue with 'q' key
            if (event.key === 'q' || event.key === 'Q') {
                toggleAutoQueue();
                event.preventDefault();
            }
        });
    }
    
    // Toggle keyboard controls
    function toggleKeyboardControls() {
        keyboardControlsEnabled = !keyboardControlsEnabled;
        const $btn = $('#keyboard-controls-toggle');
        
        if (keyboardControlsEnabled) {
            $btn.text('Keyboard Controls: ON')
               .removeClass('btn-danger')
               .addClass('btn-success');
            console.log("Keyboard controls enabled");
        } else {
            $btn.text('Keyboard Controls: OFF')
               .removeClass('btn-success')
               .addClass('btn-danger');
            console.log("Keyboard controls disabled");
        }
    }

    // Check if it's the AI's turn to play
    function updateBoard() {
        if (!autoPlayEnabled) return; // Skip if auto-play is disabled
        
        var profileOpeners = document.querySelectorAll(".text-truncate.cursor-pointer");
        var profileOpener = Array.from(profileOpeners).find(opener => opener.textContent.trim() === username);

        var chronometer = document.querySelector("app-chronometer");
        var numberElement;

        if (profileOpener) {
            var profileParent = profileOpener.parentNode;
            numberElement = profileOpener.parentNode.querySelectorAll("span")[4];

            var profileOpenerParent = profileOpener.parentNode.parentNode;
            var svgElementDark = profileOpenerParent.querySelector("circle.circle-dark");
            var svgElementLight = profileOpenerParent.querySelector("circle.circle-light");

            if (svgElementDark) {
                player = 'R';
            } else if (svgElementLight) {
                player = 'Y';
            }
        }

        var currentElement = chronometer || numberElement;
        if (currentElement && currentElement.textContent !== prevChronometerValue && profileOpener) {
            prevChronometerValue = currentElement.textContent;
            console.log("AI's turn detected. Waiting before making a move...");
            aiTurn = true;
            setTimeout(() => {
                if (!moveCooldown && autoPlayEnabled) {
                    console.log("Making AI move...");
                    makeAPIMove();
                }
            }, MOVE_DELAY);
        } else {
            aiTurn = false;
        }
    }

    // Get the current state of the board
    function getBoardState() {
        const boardContainer = document.querySelector(".grid.size6x7");
        if (!boardContainer) {
            console.error("Board container not found");
            return [];
        }
    
        let boardState = [];
    
        // Iterate over cells in a more flexible way
        for (let row = 1; row <= 6; row++) {
            let rowState = [];
            for (let col = 1; col <= 7; col++) {
                // Use a selector that matches the class names correctly
                const cellSelector = `.grid-item.cell-${row}-${col}`;
                const cell = boardContainer.querySelector(cellSelector);
                if (cell) {
                    // Check the circle class names to determine the cell's state
                    const circle = cell.querySelector("circle");
                    if (circle) {
                        if (circle.classList.contains("circle-dark")) {
                            rowState.push("R");
                        } else if (circle.classList.contains("circle-light")) {
                            rowState.push("Y");
                        } else {
                            rowState.push("E");
                        }
                    } else {
                        rowState.push("E");
                    }
                } else {
                    console.error(`Cell not found: ${cellSelector}`);
                    rowState.push("E");
                }
            }
            boardState.push(rowState);
        }
    
        return boardState;
    }
    
    // Detect if a new move has been made
    function detectNewMove() {
        const currentBoardState = getBoardState();
        let newMove = false;
    
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (lastBoardState[row] && lastBoardState[row][col] === 'E' && currentBoardState[row][col] !== 'E') {
                    moveHistory.push(col + 1);
                    newMove = true;
                }
            }
        }
    
        lastBoardState = currentBoardState;
        return newMove;
    }
    
    // Click on a column using the Python mouse controller
    function clickColumn(column) {
        console.log(`Requesting Python mouse click on column ${column}`);
        
        if (!pythonServerAvailable) {
            console.error("Python server not available. Cannot make move.");
            processingMove = false;
            return;
        }
        
        // Send click request to Python server (0-indexed)
        sendClickRequestToPython(column - 1);
    }

    // Send a click request to the Python server using GM.xmlHttpRequest to avoid CORS issues
    function sendClickRequestToPython(column) {
        GM.xmlHttpRequest({
            method: "POST",
            url: `${PYTHON_SERVER_URL}/api/click`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ column: column }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('Python click response:', data);
                    processingMove = false;
                    moveCooldown = true;
                    setTimeout(() => moveCooldown = false, COOLDOWN_DELAY);
                } catch (error) {
                    console.error('Error parsing Python server response:', error);
                    processingMove = false;
                }
            },
            onerror: function(error) {
                console.error('Error communicating with Python server:', error);
                processingMove = false;
                pythonServerAvailable = false;
                updateServerStatusIndicator(false);
                // Schedule a retry to check server status
                setTimeout(checkPythonServerStatus, SERVER_RETRY_INTERVAL);
            }
        });
    }

    // Check if the Python server is running using GM.xmlHttpRequest to avoid CORS issues
    function checkPythonServerStatus() {
        GM.xmlHttpRequest({
            method: "GET",
            url: `${PYTHON_SERVER_URL}/api/status`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('Python server status:', data);
                    pythonServerAvailable = true;
                    serverCheckRetryCount = 0;
                    updateServerStatusIndicator(true, data.calibrated);
                } catch (error) {
                    console.error('Error parsing Python server status:', error);
                    pythonServerAvailable = false;
                    updateServerStatusIndicator(false);
                    scheduleServerRetry();
                }
            },
            onerror: function(error) {
                console.error('Python server not available:', error);
                pythonServerAvailable = false;
                updateServerStatusIndicator(false);
                scheduleServerRetry();
            }
        });
    }
    
    // Schedule a retry to check server status with exponential backoff
    function scheduleServerRetry() {
        serverCheckRetryCount++;
        const delay = Math.min(SERVER_RETRY_INTERVAL * Math.pow(1.5, serverCheckRetryCount - 1), 30000);
        console.log(`Scheduling server check retry in ${delay}ms (attempt ${serverCheckRetryCount})`);
        setTimeout(checkPythonServerStatus, delay);
    }

    // Make a move using the Connect 4 solver API
    function makeAPIMove() {
        if (!aiTurn || processingMove || !autoPlayEnabled) return;
        
        // Check if Python server is available before proceeding
        if (!pythonServerAvailable) {
            console.error("Python server not available. Cannot make move.");
            return;
        }
        
        processingMove = true;

        // Use the selected API
        if (selectedAPI === 'gamesolver') {
            makeGameSolverAPIMove();
        } else if (selectedAPI === 'human') {
            makeHumanModeAPIMove();
        }
    }

    // Make a move using the gamesolver.org API
    function makeGameSolverAPIMove() {
        detectNewMove();
        console.log("Move history:", moveHistory);

        let pos = moveHistory.join("");
        console.log("API position string:", pos);

        const apiUrl = `https://connect4.gamesolver.org/solve?pos=${pos}`;
        console.log("API URL:", apiUrl);

        GM.xmlHttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                console.log("API response received");
                try {
                    const data = JSON.parse(response.responseText);
                    const scores = data.score;
                    console.log("Move scores:", scores);
                    
                    // Display the evaluations on the board
                    displayEvaluations(scores);
                    
                    // Choose the best move based on the selected strategy
                    const bestMove = chooseBestMove(scores);
                    
                    console.log(`Best move (column): ${bestMove + 1} with strategy: ${bestMoveStrategy}`);
                    if (bestMove !== -1) {
                        clickColumn(bestMove + 1); // Convert from 0-indexed to 1-indexed
                    } else {
                        console.log("No valid moves available");
                        processingMove = false;
                    }
                } catch (error) {
                    console.error("Error parsing API response:", error);
                    processingMove = false;
                }
            },
            onerror: function(error) {
                console.error("API request failed:", error);
                processingMove = false;
            }
        });
    }

    // Make a move using the human mode API (kevinalbs.com)
    function makeHumanModeAPIMove() {
        const boardState = getHumanModeBoardState();
        console.log("Current board state (human mode):", boardState);

        // Convert player from R/Y to 1/2
        let humanModePlayer;
        if (player === 'R') {
            humanModePlayer = '1';
        } else if (player === 'Y') {
            humanModePlayer = '2';
        } else {
            // If player is not set, try to determine it from the board state
            console.log("Player not set, attempting to determine from board state");
            
            // Count pieces to determine whose turn it is
            let count1 = 0;
            let count2 = 0;
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === '1') count1++;
                if (boardState[i] === '2') count2++;
            }
            
            // If equal counts or more 1s, it's player 2's turn, otherwise player 1's turn
            humanModePlayer = count1 <= count2 ? '1' : '2';
            console.log(`Determined player: ${humanModePlayer} (counts: 1=${count1}, 2=${count2})`);
        }
        
        const apiUrl = `https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data=${boardState}&player=${humanModePlayer}`;
        console.log("Human Mode API URL:", apiUrl);

        GM.xmlHttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                console.log("Human Mode API response received:", response.responseText);
                try {
                    const data = JSON.parse(response.responseText);
                    console.log("Parsed Human Mode API data:", data);

                    let bestMove = -1;
                    let bestScore = -Infinity;
                    
                    // Find the best move based on the scores
                    for (let move in data) {
                        if (data[move] > bestScore) {
                            bestScore = data[move];
                            bestMove = parseInt(move);
                        }
                    }

                    console.log("Best move (column):", bestMove);
                    if (bestMove !== -1) {
                        // Display evaluations in a format compatible with the display function
                        const scores = Array(7).fill(100); // Default to invalid
                        for (let move in data) {
                            scores[parseInt(move)] = data[move];
                        }
                        displayEvaluations(scores);
                        
                        clickColumn(bestMove + 1); // Convert from 0-indexed to 1-indexed
                    } else {
                        console.log("No valid moves available");
                        processingMove = false;
                    }
                } catch (error) {
                    console.error("Error parsing Human Mode API response:", error);
                    processingMove = false;
                }
            },
            onerror: function(error) {
                console.error("Human Mode API request failed:", error);
                processingMove = false;
            }
        });
    }

    // Choose the best move based on the selected strategy
    function chooseBestMove(scores) {
        // Filter out invalid moves (score = 100 means column is full)
        const validMoves = scores.map((score, index) => ({ score, index }))
                                .filter(move => move.score !== 100);
        
        if (validMoves.length === 0) return -1;
        
        switch (bestMoveStrategy) {
            case 'optimal':
                // Choose the move with the highest score
                return validMoves.reduce((best, current) => 
                    current.score > best.score ? current : best, validMoves[0]).index;
                
            case 'random':
                // Choose a random valid move
                return validMoves[Math.floor(Math.random() * validMoves.length)].index;
                
            case 'defensive':
                // Choose the move that minimizes opponent's advantage
                // For negative scores, choose the least negative
                // For positive scores, choose the highest
                return validMoves.reduce((best, current) => {
                    if (best.score < 0 && current.score < 0) {
                        return current.score > best.score ? current : best;
                    } else {
                        return current.score > best.score ? current : best;
                    }
                }, validMoves[0]).index;
                
            default:
                // Default to optimal
                return validMoves.reduce((best, current) => 
                    current.score > best.score ? current : best, validMoves[0]).index;
        }
    }

    // Display evaluations on the board
    function displayEvaluations(scores) {
        const boardContainer = document.querySelector(".grid.size6x7");
        let evalContainer = document.querySelector("#evaluation-container");

        if (!evalContainer) {
            evalContainer = document.createElement("div");
            evalContainer.id = "evaluation-container";
            evalContainer.style.display = "flex";
            evalContainer.style.justifyContent = "space-around";
            evalContainer.style.marginTop = "10px";
            evalContainer.style.fontFamily = "Arial, sans-serif";
            boardContainer.parentNode.insertBefore(evalContainer, boardContainer.nextSibling);
        }

        // Clear existing evaluation cells
        evalContainer.innerHTML = '';

        scores.forEach((score, index) => {
            const evalCell = document.createElement("div");
            evalCell.textContent = score === 100 ? "X" : score; // Show X for invalid moves
            evalCell.style.textAlign = 'center';
            evalCell.style.fontWeight = 'bold';
            evalCell.style.fontSize = '16px';
            evalCell.style.width = '40px';
            evalCell.style.padding = '5px';
            evalCell.style.borderRadius = '5px';
            
            // Color based on score
            if (score === 100) {
                evalCell.style.color = '#888'; // Gray for invalid moves
            } else if (score > 0) {
                evalCell.style.backgroundColor = `rgba(0, 128, 0, ${Math.min(Math.abs(score) / 20, 1)})`;
                evalCell.style.color = 'white';
            } else if (score < 0) {
                evalCell.style.backgroundColor = `rgba(255, 0, 0, ${Math.min(Math.abs(score) / 20, 1)})`;
                evalCell.style.color = 'white';
            } else {
                evalCell.style.color = 'black';
            }
            
            evalContainer.appendChild(evalCell);
        });
    }

    // Initialize AI player information
    function initAITurn() {
        const boardState = getBoardState();
        
        if (!player) {
            for (let row of boardState) {
                for (let cell of row) {
                    if (cell !== "E") {
                        player = cell === "R" ? "Y" : "R";
                        break;
                    }
                }
                if (player) break;
            }
        }
    }

    // Logout function
    function logout() {
        GM.setValue('username', '');
        location.reload();
    }

    // Update server status indicator
    function updateServerStatusIndicator(isAvailable, isCalibrated) {
        const $status = $('#python-server-status');
        
        if (isAvailable) {
            if (isCalibrated) {
                $status.text('Python Server: Connected & Calibrated')
                      .css('backgroundColor', '#28a745');
            } else {
                $status.text('Python Server: Connected (Not Calibrated)')
                      .css('backgroundColor', '#ffc107');
            }
        } else {
            $status.text('Python Server: Disconnected')
                  .css('backgroundColor', '#dc3545');
        }
        
        // Disable auto-play if server is not available or not calibrated
        if ((!isAvailable || (isAvailable && !isCalibrated)) && autoPlayEnabled) {
            autoPlayEnabled = false;
            const $btn = $('#auto-play-toggle');
            $btn.text('Auto-Play: OFF')
               .removeClass('btn-success')
               .addClass('btn-danger');
            
            if (!isAvailable) {
                console.log("Auto-play disabled because Python server is not available");
            } else if (!isCalibrated) {
                console.log("Auto-play disabled because Python server is not calibrated");
                alert("Please calibrate the board in the Python application before enabling Auto-Play.");
            }
        }
    }
    
    // Toggle auto-play functionality
    function toggleAutoPlay() {
        // Don't allow enabling auto-play if Python server is not available
        if (!pythonServerAvailable && !autoPlayEnabled) {
            alert("Cannot enable Auto-Play: Python server is not connected.");
            return;
        }
        
        // Check if the server is calibrated
        GM.xmlHttpRequest({
            method: "GET",
            url: `${PYTHON_SERVER_URL}/api/status`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data.calibrated && !autoPlayEnabled) {
                        alert("Cannot enable Auto-Play: Board is not calibrated. Please calibrate the board in the Python application first.");
                        return;
                    }
                    
                    // If we get here, we can toggle auto-play
                    autoPlayEnabled = !autoPlayEnabled;
                    const $btn = $('#auto-play-toggle');
                    
                    if (autoPlayEnabled) {
                        $btn.text('Auto-Play: ON')
                           .removeClass('btn-danger')
                           .addClass('btn-success');
                    } else {
                        $btn.text('Auto-Play: OFF')
                           .removeClass('btn-success')
                           .addClass('btn-danger');
                    }
                } catch (error) {
                    console.error('Error checking calibration status:', error);
                    alert("Cannot enable Auto-Play: Error checking calibration status.");
                }
            },
            onerror: function(error) {
                console.error('Error checking server status:', error);
                alert("Cannot enable Auto-Play: Python server is not connected.");
            }
        });
    }

    // Toggle API selection
    async function toggleAPI() {
        selectedAPI = selectedAPI === 'gamesolver' ? 'human' : 'gamesolver';
        await GM.setValue('selectedAPI', selectedAPI);
        
        const $btn = $('#api-toggle');
        
        if (selectedAPI === 'gamesolver') {
            $btn.text('API: GameSolver')
               .removeClass('btn-info')
               .addClass('btn-primary');
            console.log("Switched to GameSolver API");
        } else {
            $btn.text('API: Human Mode')
               .removeClass('btn-primary')
               .addClass('btn-info');
            console.log("Switched to Human Mode API");
        }
    }

    // Get the current state of the board for the human mode API
    function getHumanModeBoardState() {
        const boardContainer = document.querySelector(".grid.size6x7");
        if (!boardContainer) {
            console.error("Board container not found");
            return "";
        }
    
        // The Human Mode API expects a 42-character string representing the board
        // from top to bottom, left to right (0 = empty, 1 = dark/red, 2 = light/yellow)
        let boardState = "";
    
        // Iterate over cells in a more flexible way
        for (let row = 1; row <= 6; row++) {
            for (let col = 1; col <= 7; col++) {
                // Use a selector that matches the class names correctly
                const cellSelector = `.grid-item.cell-${row}-${col}`;
                const cell = boardContainer.querySelector(cellSelector);
                if (cell) {
                    // Check the circle class names to determine the cell's state
                    const circle = cell.querySelector("circle");
                    if (circle) {
                        if (circle.classList.contains("circle-dark")) {
                            boardState += "1";
                        } else if (circle.classList.contains("circle-light")) {
                            boardState += "2";
                        } else {
                            boardState += "0";
                        }
                    } else {
                        boardState += "0";
                    }
                } else {
                    console.error(`Cell not found: ${cellSelector}`);
                    boardState += "0";
                }
            }
        }
    
        console.log("Human Mode board state (42-char string):", boardState);
        return boardState;
    }

    // Create the UI elements with a calibration button
    function createUI() {
        // Create main container
        const $container = $('<div>')
            .attr('id', 'connect4-ai-controls')
            .css({
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'flex-end'
            })
            .appendTo('body');
            
        // Create server status indicator
        const $serverStatus = $('<div>')
            .attr('id', 'python-server-status')
            .text('Python Server: Checking...')
            .css({
                padding: '5px 10px',
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '5px',
                fontSize: '12px',
                marginBottom: '5px'
            })
            .appendTo($container);
        
        // Create calibration button
        const $calibrateBtn = $('<button>')
            .text('Calibrate Board')
            .addClass('btn btn-warning')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: 'none',
                marginBottom: '5px'
            })
            .on('click', function() {
                if (!pythonServerAvailable) {
                    alert("Python server is not connected. Cannot calibrate.");
                    return;
                }
                
                alert("Please switch to the Python application window and follow the calibration instructions.");
                
                // Send a message to the Python server to start calibration
                GM.xmlHttpRequest({
                    method: "POST",
                    url: `${PYTHON_SERVER_URL}/api/calibrate`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({ start: true }),
                    onload: function(response) {
                        console.log('Calibration request sent');
                    },
                    onerror: function(error) {
                        console.error('Error sending calibration request:', error);
                    }
                });
            })
            .appendTo($container);
            
        // Create auto-play toggle button
        const $autoPlayBtn = $('<button>')
            .attr('id', 'auto-play-toggle')
            .text('Auto-Play: ON')
            .addClass('btn btn-success')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: 'none'
            })
            .on('click', toggleAutoPlay)
            .appendTo($container);
            
        // Create auto-queue toggle button (moved up in the UI for better visibility)
        const $autoQueueBtn = $('<button>')
            .attr('id', 'auto-queue-toggle')
            .text('Auto-Queue: OFF')
            .addClass('btn btn-danger')
            .attr('title', 'Automatically leaves room and queues for a new game when a game ends')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: 'none',
                marginTop: '5px'
            })
            .on('click', toggleAutoQueue)
            .appendTo($container);
            
        // Create keyboard controls toggle button
        const $keyboardBtn = $('<button>')
            .attr('id', 'keyboard-controls-toggle')
            .text('Keyboard Controls: ON')
            .addClass('btn btn-success')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: 'none',
                marginTop: '5px'
            })
            .on('click', toggleKeyboardControls)
            .appendTo($container);
            
        // Create API toggle button
        const $apiToggleBtn = $('<button>')
            .attr('id', 'api-toggle')
            .text(selectedAPI === 'gamesolver' ? 'API: GameSolver' : 'API: Human Mode')
            .addClass(selectedAPI === 'gamesolver' ? 'btn btn-primary' : 'btn btn-info')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                border: 'none',
                marginTop: '5px'
            })
            .on('click', toggleAPI)
            .appendTo($container);
            
        // Create keyboard shortcuts info
        const $keyboardInfo = $('<div>')
            .css({
                backgroundColor: '#333',
                color: 'white',
                padding: '8px',
                borderRadius: '5px',
                fontSize: '12px',
                marginTop: '5px',
                maxWidth: '200px'
            })
            .html('Keyboard Shortcuts:<br>1-7: Click column<br>A: Toggle Auto-Play<br>K: Toggle Keyboard<br>H: Toggle API<br>Q: Toggle Auto-Queue')
            .appendTo($container);
            
        // Create strategy selector
        const $strategyContainer = $('<div>')
            .css({
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#333',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '5px'
            })
            .appendTo($container);
            
        $('<div>')
            .text('AI Strategy:')
            .css({
                color: 'white',
                marginBottom: '5px',
                fontSize: '12px'
            })
            .appendTo($strategyContainer);
            
        const $strategySelect = $('<select>')
            .attr('id', 'strategy-select')
            .css({
                padding: '5px',
                borderRadius: '3px',
                border: 'none'
            })
            .on('change', function() {
                bestMoveStrategy = $(this).val();
                console.log(`Strategy changed to: ${bestMoveStrategy}`);
            })
            .appendTo($strategyContainer);
            
        $('<option>').val('optimal').text('Optimal').appendTo($strategySelect);
        $('<option>').val('defensive').text('Defensive').appendTo($strategySelect);
        $('<option>').val('random').text('Random').appendTo($strategySelect);
            
        // Create manual column click buttons
        const $columnButtonsContainer = $('<div>')
            .css({
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#333',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '5px'
            })
            .appendTo($container);
            
        $('<div>')
            .text('Manual Column Click:')
            .css({
                color: 'white',
                marginBottom: '5px',
                fontSize: '12px'
            })
            .appendTo($columnButtonsContainer);
            
        const $buttonRow = $('<div>')
            .css({
                display: 'flex',
                gap: '3px'
            })
            .appendTo($columnButtonsContainer);
            
        // Add column buttons
        for (let i = 1; i <= 7; i++) {
            $('<button>')
                .text(i)
                .css({
                    width: '25px',
                    height: '25px',
                    padding: '0',
                    fontSize: '12px',
                    textAlign: 'center',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none'
                })
                .on('click', function() {
                    if (!processingMove && pythonServerAvailable) {
                        processingMove = true;
                        clickColumn(i);
                    }
                })
                .appendTo($buttonRow);
        }
            
        // Create logout button
        const $logoutBtn = $('<button>')
            .text('Logout')
            .addClass('btn btn-secondary')
            .css({
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '5px'
            })
            .on('click', logout)
            .appendTo($container);
            
        // Initialize auto-queue state
        updateAutoQueueButton();
    }
    
    // Auto-queue functionality
    async function toggleAutoQueue() {
        isAutoQueueOn = !isAutoQueueOn;
        await GM.setValue('autoQueueEnabled', isAutoQueueOn);
        updateAutoQueueButton();
        console.log(`Auto-Queue ${isAutoQueueOn ? 'enabled' : 'disabled'}`);
        
        if (isAutoQueueOn) {
            showAutoQueueNotification("Auto-Queue enabled - will automatically join new games");
        } else {
            showAutoQueueNotification("Auto-Queue disabled");
        }
    }
    
    function updateAutoQueueButton() {
        const $btn = $('#auto-queue-toggle');
        
        if (isAutoQueueOn) {
            $btn.text('Auto-Queue: ON')
               .removeClass('btn-danger')
               .addClass('btn-success');
        } else {
            $btn.text('Auto-Queue: OFF')
               .removeClass('btn-success')
               .addClass('btn-danger');
        }
    }

    function clickLeaveRoomButton() {
        const leaveButton = $("button.btn-light.ng-tns-c189-7");
        if (leaveButton.length) {
            console.log("Auto-Queue: Clicking leave room button");
            leaveButton.click();
            return true;
        }
        return false;
    }

    function clickPlayOnlineButton() {
        const playButton = document.querySelector("body > app-root > app-navigation > div.d-flex.h-100 > div.d-flex.flex-column.h-100.w-100 > main > app-game-landing > div > div > div > div.col-12.col-lg-9.dashboard > div.card.area-buttons.d-flex.justify-content-center.align-items-center.flex-column > button.btn.btn-secondary.btn-lg.position-relative");
        if (playButton) {
            console.log("Auto-Queue: Clicking play online button");
            playButton.click();
            return true;
        }
        return false;
    }

    function checkButtonsPeriodically() {
        if (!isAutoQueueOn) return;
        
        // Try to leave room first
        if (clickLeaveRoomButton()) {
            // Add visual feedback
            showAutoQueueNotification("Auto-Queue: Leaving room...");
            return;
        }
        
        // If we couldn't leave (maybe already left), try to play online
        if (clickPlayOnlineButton()) {
            showAutoQueueNotification("Auto-Queue: Joining new game...");
            return;
        }
        
        // Check for other buttons that might indicate game end
        const playAgainButton = $("button:contains('Play Again')");
        if (playAgainButton.length) {
            console.log("Auto-Queue: Clicking play again button");
            playAgainButton.click();
            showAutoQueueNotification("Auto-Queue: Playing again...");
            return;
        }
    }

    // Show a temporary notification for auto-queue actions
    function showAutoQueueNotification(message) {
        let $notification = $('#auto-queue-notification');
        
        if (!$notification.length) {
            $notification = $('<div>')
                .attr('id', 'auto-queue-notification')
                .css({
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    zIndex: '10000',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    opacity: '0',
                    transition: 'opacity 0.3s ease'
                })
                .appendTo('body');
        }
        
        $notification.text(message)
            .css('opacity', '1');
            
        // Hide after 3 seconds
        setTimeout(() => {
            $notification.css('opacity', '0');
        }, 3000);
    }

    // Handle countdown clicks for auto-queue
    let previousNumber = null;
    function trackAndClickIfDifferent() {
        const $spanElement = $('app-count-down span');
        if ($spanElement.length) {
            const number = parseInt($spanElement.text(), 10);
            if (!isNaN(number) && previousNumber !== null && number !== previousNumber && isAutoQueueOn) {
                $spanElement.click();
            }
            previousNumber = number;
        }
    }

    // Display board state in console for debugging
    function displayAIBoard() {
        const boardState = getBoardState();
        console.log("Current board state:");
        boardState.forEach(row => {
            console.log(row.join(" | "));
        });
    }

    // Initialize the script
    async function initialize() {
        console.log("Connect 4 AI script initializing...");
        
        // Load auto-queue state from storage
        isAutoQueueOn = await GM.getValue('autoQueueEnabled', AUTO_QUEUE_ENABLED_DEFAULT);
        console.log(`Auto-Queue initialized: ${isAutoQueueOn ? 'ON' : 'OFF'}`);
        
        // Create UI elements
        createUI();
        
        // Check Python server status initially and periodically
        checkPythonServerStatus();
        setInterval(checkPythonServerStatus, SERVER_CHECK_INTERVAL);
        
        // Set up game state monitoring
        setInterval(function() {
            updateBoard();
            initAITurn();
        }, BOARD_CHECK_INTERVAL);
        
        // Set up reset button monitoring
        setInterval(checkForResetButtons, RESET_CHECK_INTERVAL);
        
        // Set up auto-queue functionality
        setInterval(checkButtonsPeriodically, AUTO_QUEUE_CHECK_INTERVAL);
        setInterval(trackAndClickIfDifferent, AUTO_QUEUE_CHECK_INTERVAL);
        
        // Set up move detection
        setInterval(detectNewMove, 100);
        
        // Debug board display
        if (localStorage.getItem('debugMode') === 'true') {
            setInterval(displayAIBoard, 5000);
        }
        
        // Set up keyboard controls
        setupKeyboardControls();
        
        console.log("Connect 4 AI script loaded and running");
    }
    
    // Start the script
    initialize();
})(); 