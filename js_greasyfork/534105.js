// ==UserScript==
// @name         [NEWEST] #1 🏆 Chess.com Cheat/Bot!
// @namespace    Admin0
// @version      2.0.0
// @description  Chess.com Bot/Cheat that finds the best move!
// @author       Admin0
// @license      Chess.com Bot/Cheat © 2024 by Admin0, © All Rights Reserved
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     stockfish.js        https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://greasyfork.org/scripts/445697/code/index.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534105/%5BNEWEST%5D%201%20%F0%9F%8F%86%20Chesscom%20CheatBot%21.user.js
// @updateURL https://update.greasyfork.org/scripts/534105/%5BNEWEST%5D%201%20%F0%9F%8F%86%20Chesscom%20CheatBot%21.meta.js
// ==/UserScript==

// CLEAN REWRITE - CHESS.COM THEMED VERSION 2.0

const currentVersion = '2.0.0';

function main() {
    // Core variables setup
    var stockfishObjectURL;
    var engine = document.engine = {};
    var myVars = document.myVars = {};
    myVars.autoMove = GM_getValue('autoMove', false); // Load saved autoMove
    myVars.suggestMove = GM_getValue('suggestMove', false); // Load saved suggestMove
    myVars.autoMatch = GM_getValue('autoMatch', false); // Load saved autoMatch
    myVars.customDepth = GM_getValue('customDepth', 11); // Load saved depth, default to 11
    myVars.bestMoveHighlightColor = GM_getValue('bestMoveHighlightColor', '#7fa650'); // Chess.com green
    myVars.panelPosition = GM_getValue('panelPositionType', 'draggable'); // Position type: 'right' or 'draggable'
    var myFunctions = document.myFunctions = {};
    var lastValue = GM_getValue('customDepth', 11); // Also initialize lastValue with saved/default depth

    // Core chess engine logic from Script3 (the working one)
    // Track active highlights to prevent stacking
    myVars.activeHighlights = [];

    myFunctions.color = function(dat) {
        console.log("[Move] Processing:", dat);
        console.log("[Highlight] Attempting highlight on board element:", board ? board.nodeName : 'Board not found!'); // Diagnostic log
        let response = dat;
        let res1 = response.substring(0, 2); // From square
        let res2 = response.substring(2, 4); // To square

        // Execute move if auto-move is enabled
        if (myVars.autoMove === true) {
            myFunctions.movePiece(res1, res2);
        }

        // Reset thinking state
        isThinking = false;

        // Convert chess notation to Chess.com's grid system
        res1 = res1.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");
        res2 = res2.replace(/^a/, "1")
            .replace(/^b/, "2")
            .replace(/^c/, "3")
            .replace(/^d/, "4")
            .replace(/^e/, "5")
            .replace(/^f/, "6")
            .replace(/^g/, "7")
            .replace(/^h/, "8");

        // Clear any existing highlights to prevent stacking
        myFunctions.clearHighlights();

        // Highlight destination square with improved styling
        const destHighlight = $('<div class="highlight square-' + res2 + ' bro" style="background-color: ' + myVars.bestMoveHighlightColor + '; opacity: 0; border-radius: 5px; box-shadow: inset 0 0 5px rgba(255,255,255,0.5); data-test-element="highlight"></div>');
        $(board.nodeName).prepend(destHighlight);
        myVars.activeHighlights.push(destHighlight);

        // Animate the destination highlight
        destHighlight.animate({
            opacity: 0.7
        }, 300);

        // Highlight origin square with improved styling
        const originHighlight = $('<div class="highlight square-' + res1 + ' bro" style="background-color: ' + myVars.bestMoveHighlightColor + '; opacity: 0; border-radius: 5px; box-shadow: inset 0 0 5px rgba(255,255,255,0.5); data-test-element="highlight"></div>');
        $(board.nodeName).prepend(originHighlight);
        myVars.activeHighlights.push(originHighlight);

        // Animate the origin highlight
        originHighlight.animate({
            opacity: 0.7
        }, 300);

        // Set timeout to clear highlights after delay
        setTimeout(function() {
            myFunctions.clearHighlights();
        }, 1800);
    };

    // Function to clear all active highlights with fade-out animation
    myFunctions.clearHighlights = function() {
        if (myVars.activeHighlights && myVars.activeHighlights.length > 0) {
            myVars.activeHighlights.forEach(function(highlight) {
                // Animate fade out
                highlight.animate({
                    opacity: 0
                }, 300, function() {
                    // Remove after animation completes
                    $(this).remove();
                });
            });
            myVars.activeHighlights = [];
        }
        // Also fade out and remove any other highlights that might be present
        $('.highlight.bro').animate({
            opacity: 0
        }, 300, function() {
            $(this).remove();
        });
    };

    // Move execution function from Script3
    myFunctions.movePiece = function(from, to) {
        console.log("[Move] Executing move from", from, "to", to);
        try {
            // Get legal moves from the game
            let legalMoves = board.game.getLegalMoves();

            // Find our move in legal moves
            for (let each = 0; each < legalMoves.length; each++) {
                if (legalMoves[each].from === from && legalMoves[each].to === to) {
                    let move = legalMoves[each];

                    // Check for promotion (pawn to last rank)
                let promotion = undefined;
                    let piece = board.game.getPiece(from);
                if (piece && piece.type === 'p' && (to[1] === '8' || to[1] === '1')) {
                        promotion = 'q'; // Default promote to queen
                        console.log("[Move] Promoting pawn to queen");
                }

                    // Execute the move
                    board.game.move({
                        from: move.from,
                        to: move.to,
                        promotion: promotion,
                        animate: false,
                        userGenerated: true
                    });
                    console.log("[Move] Executed successfully");
                    return;
                }
            }
            console.warn("[Move] No legal move found:", from, to);
        } catch (error) {
            console.error("[Move] Error executing move:", error);
        }
    };

    // Enhanced parser to capture top moves
    function parser(e) {
        console.log("[Engine] Message:", e.data);

        // Track top moves during analysis
        if (e.data.includes('info depth') && e.data.includes('pv')) {
            try {
                // Extract move data from engine output
                const parts = e.data.split(' ');
                const depthIndex = parts.indexOf('depth');
                const scoreIndex = parts.indexOf('score');
                const pvIndex = parts.indexOf('pv');

                if (depthIndex >= 0 && scoreIndex >= 0 && pvIndex >= 0) {
                    const depth = parseInt(parts[depthIndex + 1]);
                    const scoreType = parts[scoreIndex + 1]; // cp or mate
                    const scoreValue = parseInt(parts[scoreIndex + 2]);
                    const move = parts[pvIndex + 1];

                    // Format evaluation text
                    let evalText = '';
                    if (scoreType === 'cp') {
                        // Convert centipawns to pawns with + or - sign
                        const pawns = (scoreValue / 100).toFixed(2);
                        evalText = (pawns > 0 ? '+' : '') + pawns;
                    } else if (scoreType === 'mate') {
                        // Show mate in X
                        evalText = 'M' + (scoreValue > 0 ? '+' : '') + scoreValue;
                    }

                    // Store in top moves array if this is a new depth
                    if (!myVars.topMoves) {
                        myVars.topMoves = [];
                    }

                    // Add to top moves if it's a new depth or replace existing entry
                    const existingIndex = myVars.topMoves.findIndex(m => m.move === move);
                    if (existingIndex >= 0) {
                        // Update existing move with new evaluation
                        myVars.topMoves[existingIndex] = { move, evalText, depth, score: scoreValue };
                    } else {
                        // Add new move
                        myVars.topMoves.push({ move, evalText, depth, score: scoreValue });
                    }

                    // Sort by score (higher is better)
                    myVars.topMoves.sort((a, b) => b.score - a.score);

                    // Keep only top 2 moves
                    myVars.topMoves = myVars.topMoves.slice(0, 2);

                    // Update UI if elements exist
                    if (document.getElementById('topMove1') && myVars.topMoves.length > 0) {
                        for (let i = 0; i < Math.min(2, myVars.topMoves.length); i++) {
                            const moveElem = document.getElementById(`topMove${i+1}`);
                            const evalElem = document.getElementById(`topMoveEval${i+1}`);

                            if (moveElem && evalElem) {
                                moveElem.innerText = myVars.topMoves[i].move;
                                evalElem.innerText = myVars.topMoves[i].evalText;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("[Engine] Error parsing move info:", error);
            }
        }

        // Process best move when analysis is complete
        if (e.data.includes('bestmove')) {
            console.log("[Engine] Found best move:", e.data);
            const bestMove = e.data.split(' ')[1];
            myFunctions.color(bestMove);
            isThinking = false;

            // Clear top moves array for next analysis
            myVars.topMoves = [];
        }
    }

    // Engine load function from Script3
    myFunctions.loadChessEngine = function() {
        console.log("[Engine] Loading Stockfish...");
        try {
            if (!stockfishObjectURL) {
            stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText('stockfish.js')], {type: 'application/javascript'}));
        }

            engine.engine = new Worker(stockfishObjectURL);

            engine.engine.onmessage = e => {
                parser(e);
            };

            engine.engine.onerror = e => {
                console.error("[Engine] Error:", e);
                isThinking = false;
            };

            engine.engine.postMessage('ucinewgame');
            console.log("[Engine] Loaded successfully");
        } catch (error) {
            console.error("[Engine] Load failed:", error);
        }
    };

    // Engine reload function
    myFunctions.reloadChessEngine = function() {
        console.log("[Engine] Reloading...");
        try {
            if (engine.engine) {
                engine.engine.terminate();
            }
            isThinking = false;
            stockfishObjectURL = null; // Force recreation
            setTimeout(() => {
                myFunctions.loadChessEngine();
                console.log("[Engine] Reloaded successfully");
            }, 100);
        } catch (error) {
            console.error("[Engine] Reload failed:", error);
        }
    };

    // Run engine at specified depth
    myFunctions.runChessEngine = function(depth) {
        console.log("[Engine] Running at depth", depth);
        let fen = board.game.getFEN();
        console.log("[Engine] Position:", fen);

        engine.engine.postMessage(`position fen ${fen}`);
        isThinking = true;
        engine.engine.postMessage(`go depth ${depth}`);
        lastValue = depth;
    };

    // Auto run function
    myFunctions.autoRun = function(depth) {
        if (board.game.getTurn() == board.game.getPlayingAs()) {
            myFunctions.runChessEngine(depth || myVars.customDepth);
        }
    };

    // Function to handle delayed auto-run
    function other(delay) {
        let endTime = Date.now() + delay;
        let timer = setInterval(() => {
            if (Date.now() >= endTime) {
                myFunctions.autoRun(myVars.customDepth);
                canGo = true;
                clearInterval(timer);
            }
        }, 10);
    }

    // Auto start new game
    myFunctions.startNewGame = function() {
        console.log("[Match] Starting new game...");

        // Find New Game button in different places
        const modalNewGameButton = $('.game-over-modal-content .game-over-buttons-component .cc-button-component:not([aria-label="Rematch"])');
        if (modalNewGameButton.length) {
            modalNewGameButton[0].click();
            console.log("[Match] Clicked New Game from modal");
            myVars.hasAutoMatched = true;
            myVars.gameEnded = false;
            return;
        }

        const newGameButton = $('.game-over-buttons-component .cc-button-component:not([aria-label="Rematch"])');
        if (newGameButton.length) {
            newGameButton[0].click();
            console.log("[Match] Clicked New Game button");
            myVars.hasAutoMatched = true;
            myVars.gameEnded = false;
            return;
        }

        console.log("[Match] No New Game button found");
    };

    // Function to handle spinner visibility
    myFunctions.spinner = function() {
        if (loaded && $('#overlay').length) {
            $('#overlay').css('display', isThinking ? 'block' : 'none');
        }
    };

    // Handle keyboard shortcuts
    document.onkeydown = function(e) {
        const depthKeys = {
            81: 1, 87: 2, 69: 3, 82: 4, 84: 5, 89: 6, 85: 7, 73: 8, 79: 9, 80: 10,
            65: 11, 83: 12, 68: 13, 70: 14, 71: 15, 72: 16, 74: 17, 75: 18, 76: 19,
            90: 20, 88: 21, 67: 22, 86: 23, 66: 24, 78: 25, 77: 26, 187: 100
        };

        if (depthKeys[e.keyCode]) {
            myVars.customDepth = depthKeys[e.keyCode];
            if (loaded) {
                $('#depthValue').text(myVars.customDepth);
            }
            GM_setValue('customDepth', myVars.customDepth); // Save the new depth
            location.reload(); // Reload the page
        }

        // Toggle UI with ESC
        if (e.keyCode === 27 && loaded) {
            $('#chessBot').toggle();
        }
    };

    // UI Creation function - CHESS.COM THEMED
    var loaded = false;
    myFunctions.loadEx = function() {
        if (loaded) return;

        try {
            console.log("[UI] Creating Chess.com themed interface...");
            board = $('chess-board')[0] || $('wc-chess-board')[0];
             if (!board) {
                console.warn("[UI] Board not found yet");
                return;
             }

            myVars.board = board;

            // Create main container with Chess.com styling
            const panel = document.createElement('div');
            panel.id = 'chessBot';
            // Load saved panel dimensions or use defaults
            const savedDimensions = GM_getValue('panelDimensions', {
                width: 220,
                height: 400,
                minWidth: 180,
                minHeight: 300
            });

            // Get panel position type
            const positionType = myVars.panelPosition; // 'right', 'bottom', or 'draggable'

            // Set initial position and dimensions based on position type
            let positionCSS = '';
            let dimensionsCSS = '';

            if (positionType === 'right') {
                // Right mode: Full height on right side
                positionCSS = `
                    right: 20px;
                    top: 20px;
                    bottom: 20px;
                    transform: none;
                `;
                dimensionsCSS = `
                    width: 280px;
                    height: auto;
                    overflow-y: auto;
                `;
            } else { // draggable (default)
                // Get saved position for draggable mode
                const savedPosition = GM_getValue('panelPosition', {
                    top: 100,
                    left: window.innerWidth - savedDimensions.width - 20,
                    right: 'auto'
                });

                positionCSS = `
                    right: ${savedPosition.right};
                    top: ${savedPosition.top}px;
                    left: ${savedPosition.left}px;
                    transform: none;
                `;
                dimensionsCSS = `
                    width: ${savedDimensions.width}px;
                    height: ${savedDimensions.height}px;
                `;
            }

            // If position type is invalid, default to draggable
            if (positionType !== 'right' && positionType !== 'draggable') {
                myVars.panelPosition = 'draggable';
                GM_setValue('panelPositionType', 'draggable');
            }

            panel.style = `
                position: fixed;
                ${positionCSS}
                ${dimensionsCSS}
                min-width: ${positionType === 'bottom' ? 'auto' : savedDimensions.minWidth + 'px'};
                min-height: ${positionType === 'right' ? 'auto' : savedDimensions.minHeight + 'px'};
                background-color: #312e2b;
                color: #bababa;
                font-family: "Segoe UI", Arial, sans-serif;
                z-index: 9999;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            `;

            // Create header
            const header = document.createElement('div');
            header.style = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #464442;
                padding-bottom: 10px;
            `;

            const title = document.createElement('h2');
            title.innerText = 'Chess.com Bot';
            title.style = `
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #bababa;
            `;

            const version = document.createElement('span');
            version.innerText = 'v2.0.0';
            version.style = `
                font-size: 12px;
                opacity: 0.8;
                color: #bababa;
            `;

            // Create a container for title and version
            const titleContainer = document.createElement('div');
            titleContainer.style = `
                display: flex;
                align-items: baseline;
                gap: 8px;
            `;

            titleContainer.appendChild(title);
            titleContainer.appendChild(version);

            // Add title container to the left side of header
            header.appendChild(titleContainer);
            panel.appendChild(header);

            // Create spinner overlay
            const overlay = document.createElement('div');
            overlay.id = 'overlay';
            overlay.style = `
    position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(49, 46, 43, 0.85);
    z-index: 10000;
    display: none;
                border-radius: 5px;
            `;

            const spinner = document.createElement('div');
            spinner.style = `
    position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin-top: -20px;
                margin-left: -20px;
                border: 3px solid #bababa;
                border-top-color: #7fa650;
    border-radius: 50%;
                animation: spin 1s infinite linear;
            `;

            const spinStyle = document.createElement('style');
            spinStyle.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;

            document.head.appendChild(spinStyle);
            overlay.appendChild(spinner);
            panel.appendChild(overlay);

            // Create scrollable content container
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'scroll-container';
            scrollContainer.style = `
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                padding-right: 5px; /* Add space for scrollbar */
                margin-right: -5px; /* Compensate for padding */
                scrollbar-width: thin; /* Firefox */
                scrollbar-color: #464442 #312e2b; /* Firefox */
            `;

            // Add custom scrollbar styles
            const scrollbarStyle = document.createElement('style');
            scrollbarStyle.textContent = `
                .scroll-container::-webkit-scrollbar {
                    width: 6px;
                }
                .scroll-container::-webkit-scrollbar-track {
                    background: #312e2b;
                }
                .scroll-container::-webkit-scrollbar-thumb {
                    background-color: #464442;
                    border-radius: 3px;
                }
                .scroll-container::-webkit-scrollbar-thumb:hover {
                    background-color: #5d5955;
                }
            `;
            document.head.appendChild(scrollbarStyle);

            panel.appendChild(scrollContainer);

            // Create collapsible content sections
            const createSection = (title) => {
                const section = document.createElement('div');
                section.className = 'collapsible-section';
                section.style = `
                    margin-bottom: 15px;
                `;

                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'section-header';
                sectionHeader.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    border-bottom: 1px solid #464442;
                    padding-bottom: 5px;
                    user-select: none;
                `;

                const sectionTitle = document.createElement('h3');
                sectionTitle.innerText = title;
                sectionTitle.style = `
                    margin: 0;
                    font-size: 16px;
                    color: #bababa;
                `;

                const collapseIcon = document.createElement('span');
                collapseIcon.className = 'collapse-icon';
                collapseIcon.innerHTML = '▼'; // Down arrow for expanded
                collapseIcon.style = `
                    font-size: 12px;
                    color: #bababa;
                    transition: transform 0.3s;
                `;

                sectionHeader.appendChild(sectionTitle);
                sectionHeader.appendChild(collapseIcon);

                const sectionContent = document.createElement('div');
                sectionContent.className = 'section-content';
                sectionContent.style = `
                    margin-top: 10px;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
                    max-height: 1000px; /* Start expanded */
                    opacity: 1;
                    visibility: visible;
                `;

                // Toggle collapse on header click with improved animation
                sectionHeader.addEventListener('click', function() {
                    const isCollapsed = sectionContent.style.maxHeight === '0px' || !sectionContent.style.maxHeight;

                    if (isCollapsed) {
                        // Expand - use scrollHeight to determine the actual height needed
                        sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        sectionContent.style.opacity = '1';
                        sectionContent.style.visibility = 'visible';
                        collapseIcon.innerHTML = '▼';
                        collapseIcon.style.transform = 'rotate(0deg)';

                        // Update maxHeight after content changes (for dynamic content)
                        setTimeout(() => {
                            sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        }, 50);
                    } else {
                        // Collapse with smooth animation
                        sectionContent.style.maxHeight = '0px';
                        sectionContent.style.opacity = '0';
                        // Don't hide immediately to allow animation to complete
                        setTimeout(() => {
                            if (sectionContent.style.maxHeight === '0px') {
                                sectionContent.style.visibility = 'hidden';
                            }
                        }, 300);
                        collapseIcon.innerHTML = '▶';
                        collapseIcon.style.transform = 'rotate(-90deg)';
                    }

                    // Save collapsed state
                    const collapsedSections = GM_getValue('collapsedSections', {});
                    collapsedSections[title] = !isCollapsed;
                    GM_setValue('collapsedSections', collapsedSections);
                });

                section.appendChild(sectionHeader);
                section.appendChild(sectionContent);

                // Set initial collapse state from saved preferences
                const collapsedSections = GM_getValue('collapsedSections', {});
                if (collapsedSections[title]) {
                    sectionContent.style.maxHeight = '0px';
                    sectionContent.style.opacity = '0';
                    sectionContent.style.visibility = 'hidden';
                    collapseIcon.innerHTML = '▶';
                    collapseIcon.style.transform = 'rotate(-90deg)';
                } else {
                    // Make sure expanded sections have proper height
                    setTimeout(() => {
                        if (sectionContent.style.maxHeight !== '0px') {
                            sectionContent.style.maxHeight = sectionContent.scrollHeight + 'px';
                        }
                    }, 50);
                }

                // Return the content div instead of the section
                return {
                    section: section,
                    content: sectionContent
                };
            };

            // Create depth section
            const depthSectionObj = createSection('Engine Depth');
            const depthSection = depthSectionObj.section;
            const depthContent = depthSectionObj.content;

            const depthDisplay = document.createElement('div');
            depthDisplay.style = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                background-color: #3a3634;
                padding: 8px 12px;
                border-radius: 4px;
            `;

            const depthLabel = document.createElement('span');
            depthLabel.innerText = 'Current Depth:';

            const depthValue = document.createElement('span');
            depthValue.id = 'depthValue';
            depthValue.innerText = myVars.customDepth;
            depthValue.style = `
                font-weight: bold;
                color: #7fa650;
            `;

            depthDisplay.appendChild(depthLabel);
            depthDisplay.appendChild(depthValue);

            // Removed "Press A-Z keys" message

            const depthInput = document.createElement('div');
            depthInput.style = `
                display: flex;
                align-items: center;
                margin-top: 10px;
            `;

            const depthInputLabel = document.createElement('label');
            depthInputLabel.innerText = 'Set Depth:';
            depthInputLabel.style = 'margin-right: 10px;';

            const depthInputField = document.createElement('input');
            depthInputField.type = 'number';
            depthInputField.id = 'customDepthInput';
            depthInputField.min = '1';
            depthInputField.max = '100';
            depthInputField.value = myVars.customDepth;
            depthInputField.style = `
                background-color: #3a3634;
                border: 1px solid #464442;
                color: #bababa;
                padding: 5px;
                border-radius: 3px;
                width: 60px;
            `;

            depthInputField.addEventListener('change', function() {
                const value = parseInt(this.value);
                if (!isNaN(value) && value >= 1 && value <= 100) {
                    myVars.customDepth = value;
                    depthValue.innerText = value;
                    GM_setValue('customDepth', myVars.customDepth); // Save the new depth
                    location.reload(); // Reload the page
                } else {
                    this.value = GM_getValue('customDepth', 11); // Reset to saved value if input is invalid
                }
            });

            depthInput.appendChild(depthInputLabel);
            depthInput.appendChild(depthInputField);

            depthContent.appendChild(depthDisplay);
            depthContent.appendChild(depthInput);
            scrollContainer.appendChild(depthSection);

            // Create game options section
            const optionsSectionObj = createSection('Game Options');
            const optionsSection = optionsSectionObj.section;
            const optionsContent = optionsSectionObj.content;

            const createCheckbox = (id, label) => {
                const container = document.createElement('div');
                container.style = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.style = `
                    margin-right: 10px;
                    cursor: pointer;
                `;

                const checkLabel = document.createElement('label');
                checkLabel.htmlFor = id;
                checkLabel.innerText = label;
                checkLabel.style = 'cursor: pointer;';

                container.appendChild(checkbox);
                container.appendChild(checkLabel);
                return container;
            };

            const autoRunCheck = createCheckbox('suggestMove', 'Enable Suggested Move');
            const autoMoveCheck = createCheckbox('autoMove', 'Enable auto move');
            const autoMatchCheck = createCheckbox('autoMatch', 'Enable auto match');

            optionsContent.appendChild(autoRunCheck);
            optionsContent.appendChild(autoMoveCheck);
            optionsContent.appendChild(autoMatchCheck);
            scrollContainer.appendChild(optionsSection);

            // Set initial state from loaded vars
            autoRunCheck.querySelector('input').checked = myVars.suggestMove;
            autoMoveCheck.querySelector('input').checked = myVars.autoMove;
            autoMatchCheck.querySelector('input').checked = myVars.autoMatch;

            // Create delay section
            const delaySectionObj = createSection('Suggestion Delay');
            const delaySection = delaySectionObj.section;
            const delayContent = delaySectionObj.content;

            const createDelayInput = (id, label, defaultValue) => {
                const container = document.createElement('div');
                container.style = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                `;

                const inputLabel = document.createElement('label');
                inputLabel.htmlFor = id;
                inputLabel.innerText = label;
                inputLabel.style = `
                    flex: 1;
                `;

                const input = document.createElement('input');
                input.type = 'number';
                input.id = id;
                input.min = '0.1';
                input.step = '0.1';
                input.value = defaultValue;
                input.style = `
                    background-color: #3a3634;
                    border: 1px solid #464442;
                    color: #bababa;
                    padding: 5px;
                    border-radius: 3px;
                    width: 60px;
                `;

                container.appendChild(inputLabel);
                container.appendChild(input);
                return container;
            };

            const minDelayInput = createDelayInput('timeDelayMin', 'Min Delay (s):', '0.1');
            const maxDelayInput = createDelayInput('timeDelayMax', 'Max Delay (s):', '1.0');

            delayContent.appendChild(minDelayInput);
            delayContent.appendChild(maxDelayInput);
            scrollContainer.appendChild(delaySection);

            // Create a settings button in the header (icon button)
            const settingsButton = document.createElement('button');
            settingsButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#bababa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="#bababa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            settingsButton.title = 'Settings';
            settingsButton.style = `
                background: #3a3634;
                border: 1px solid #464442;
                color: #bababa;
                width: 28px;
                height: 28px;
                cursor: pointer;
                margin-right: 10px;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            `;

            // Create settings screen (initially hidden)
            const settingsScreen = document.createElement('div');
            settingsScreen.id = 'chessBot-settings';
            settingsScreen.style = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: none;
            `;

            // Settings panel
            const settingsPanel = document.createElement('div');
            settingsPanel.style = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #312e2b;
                width: 300px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                padding: 15px;
                color: #bababa;
                font-family: "Segoe UI", Arial, sans-serif;
            `;

            // Settings title
            const settingsTitle = document.createElement('div');
            settingsTitle.innerText = 'Settings';
            settingsTitle.style = `
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #464442;
                color: #bababa;
            `;
            settingsPanel.appendChild(settingsTitle);

            // Panel position settings
            const positionTitle = document.createElement('div');
            positionTitle.innerText = 'Panel Position';
            positionTitle.style = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #bababa;
            `;
            settingsPanel.appendChild(positionTitle);

            // Position radio buttons
            const positionContainer = document.createElement('div');
            positionContainer.style = `
                margin-bottom: 20px;
            `;

            // Draggable option
            const draggableContainer = document.createElement('div');
            draggableContainer.style = `
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            `;

            const draggableRadio = document.createElement('input');
            draggableRadio.type = 'radio';
            draggableRadio.id = 'positionDraggable';
            draggableRadio.name = 'panelPosition';
            draggableRadio.value = 'draggable';
            draggableRadio.checked = myVars.panelPosition === 'draggable';
            draggableRadio.style.marginRight = '8px';

            const draggableLabel = document.createElement('label');
            draggableLabel.htmlFor = 'positionDraggable';
            draggableLabel.innerText = 'Draggable (Move Freely)';
            draggableLabel.style.color = '#bababa';

            draggableContainer.appendChild(draggableRadio);
            draggableContainer.appendChild(draggableLabel);
            positionContainer.appendChild(draggableContainer);

            // Right option
            const rightContainer = document.createElement('div');
            rightContainer.style = `
                display: flex;
                align-items: center;
            `;

            const rightRadio = document.createElement('input');
            rightRadio.type = 'radio';
            rightRadio.id = 'positionRight';
            rightRadio.name = 'panelPosition';
            rightRadio.value = 'right';
            rightRadio.checked = myVars.panelPosition === 'right';
            rightRadio.style.marginRight = '8px';

            const rightLabel = document.createElement('label');
            rightLabel.htmlFor = 'positionRight';
            rightLabel.innerText = 'Right Side';
            rightLabel.style.color = '#bababa';

            rightContainer.appendChild(rightRadio);
            rightContainer.appendChild(rightLabel);
            positionContainer.appendChild(rightContainer);

            // Add position container to panel
            settingsPanel.appendChild(positionContainer);

            // Highlight color settings
            const colorTitle = document.createElement('div');
            colorTitle.innerText = 'Highlight Color';
            colorTitle.style = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #bababa;
            `;
            settingsPanel.appendChild(colorTitle);

            // Color picker with improved UI
            const colorContainer = document.createElement('div');
            colorContainer.style = `
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
            `;

            // Color presets
            const presetColors = ['#7fa650', '#f1c40f', '#e74c3c', '#3498db', '#9b59b6'];
            const presetContainer = document.createElement('div');
            presetContainer.style = `
                display: flex;
                margin-bottom: 10px;
                gap: 8px;
            `;

            presetColors.forEach(color => {
                const preset = document.createElement('div');
                preset.style = `
                    width: 24px;
                    height: 24px;
                    background-color: ${color};
                    border-radius: 4px;
                    cursor: pointer;
                    border: 2px solid ${color === myVars.bestMoveHighlightColor ? '#bababa' : 'transparent'};
                `;
                preset.addEventListener('click', function() {
                    colorInput.value = color;
                    colorValue.innerText = color;
                    myVars.bestMoveHighlightColor = color;

                    // Update borders
                    presetContainer.querySelectorAll('div').forEach(el => {
                        el.style.border = '2px solid transparent';
                    });
                    preset.style.border = '2px solid #bababa';
                });
                presetContainer.appendChild(preset);
            });

            colorContainer.appendChild(presetContainer);

            // Custom color picker
            const customColorContainer = document.createElement('div');
            customColorContainer.style = `
                display: flex;
                align-items: center;
            `;

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = myVars.bestMoveHighlightColor;
            colorInput.style = `
                width: 30px;
                height: 30px;
                margin-right: 10px;
                padding: 0;
                border: none;
                cursor: pointer;
            `;

            const colorValue = document.createElement('span');
            colorValue.innerText = myVars.bestMoveHighlightColor;
            colorValue.style = `
                font-family: monospace;
                color: #bababa;
            `;

            customColorContainer.appendChild(colorInput);
            customColorContainer.appendChild(colorValue);
            colorContainer.appendChild(customColorContainer);

            settingsPanel.appendChild(colorContainer);

            // Save and close buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.style = `
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            `;

            const saveButton = document.createElement('button');
            saveButton.innerText = 'Save';
            saveButton.style = `
                background: #7fa650;
                border: none;
                color: white;
                padding: 8px 15px;
                border-radius: 3px;
                cursor: pointer;
                font-weight: bold;
            `;

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Cancel';
            closeButton.style = `
                background: #3a3634;
                border: 1px solid #464442;
                color: #bababa;
                padding: 8px 15px;
                border-radius: 3px;
                cursor: pointer;
            `;

            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(closeButton);
            settingsPanel.appendChild(buttonContainer);

            // Add settings panel to screen
            settingsScreen.appendChild(settingsPanel);
            document.body.appendChild(settingsScreen);

            // Event listeners
            settingsButton.addEventListener('click', function() {
                // Reset form values to current settings
                draggableRadio.checked = myVars.panelPosition === 'draggable';
                rightRadio.checked = myVars.panelPosition === 'right';
                colorInput.value = myVars.bestMoveHighlightColor;
                colorValue.innerText = myVars.bestMoveHighlightColor;

                // Show settings
                settingsScreen.style.display = 'block';
            });

            closeButton.addEventListener('click', function() {
                settingsScreen.style.display = 'none';
            });

            // Update color value when input changes
            colorInput.addEventListener('input', function() {
                colorValue.innerText = this.value;

                // Update preset borders
                presetContainer.querySelectorAll('div').forEach(el => {
                    el.style.border = '2px solid transparent';
                });

                // Check if the color matches any preset
                const matchingPreset = Array.from(presetContainer.querySelectorAll('div'))
                    .find(el => el.style.backgroundColor === this.value);

                if (matchingPreset) {
                    matchingPreset.style.border = '2px solid #bababa';
                }
            });

            saveButton.addEventListener('click', function() {
                // Save position setting
                if (draggableRadio.checked) {
                    myVars.panelPosition = 'draggable';
                    GM_setValue('panelPositionType', 'draggable');
                } else if (rightRadio.checked) {
                    myVars.panelPosition = 'right';
                    GM_setValue('panelPositionType', 'right');
                }

                // Save color setting
                myVars.bestMoveHighlightColor = colorInput.value;
                GM_setValue('bestMoveHighlightColor', colorInput.value);

                // Clear any existing content and show loading overlay
                settingsPanel.innerHTML = '';

                // Create loading overlay
                const loadingOverlay = document.createElement('div');
                loadingOverlay.style = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(49, 46, 43, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10002;
                    border-radius: 5px;
                `;

                const saveMessage = document.createElement('div');
                saveMessage.innerText = 'Settings saved. Reloading page...';
                saveMessage.style = `
                    color: #7fa650;
                    font-weight: bold;
                    font-size: 16px;
                    text-align: center;
                `;

                loadingOverlay.appendChild(saveMessage);
                settingsScreen.appendChild(loadingOverlay);

                // Reload page after 1 second
                setTimeout(function() {
                    location.reload();
                }, 1000);
            });

            // Add settings button to the right side of the header
            header.appendChild(settingsButton);

            // Create buttons section
            const actionsSectionObj = createSection('Actions');
            const actionsSection = actionsSectionObj.section;
            const actionsContent = actionsSectionObj.content;

            const createButton = (text, onClick, primary = false) => {
                const button = document.createElement('button');
                button.innerText = text;
                button.addEventListener('click', onClick);
                button.style = `
                    background-color: ${primary ? '#7fa650' : '#5d5955'};
                    color: #fff;
                    border: none;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 3px;
                    width: 100%;
                    cursor: pointer;
                    font-weight: ${primary ? 'bold' : 'normal'};
                    transition: background-color 0.2s;
                `;

                button.addEventListener('mouseover', function() {
                    this.style.backgroundColor = primary ? '#8fb761' : '#6e6a66';
                });

                button.addEventListener('mouseout', function() {
                    this.style.backgroundColor = primary ? '#7fa650' : '#5d5955';
                });

                return button;
            };

            const reloadButton = createButton('Reload Chess Engine', () => myFunctions.reloadChessEngine(), true);
            const issueButton = createButton('Report an Issue', () => {
                window.open('https://greasyfork.org/en/scripts/534105-chess-com-bot-cheat-by-admin0/feedback', '_blank');
            });

            const updateButton = createButton('Check for Updates', () => {
                window.open('https://greasyfork.org/en/scripts/534105-chess-com-bot-cheat-by-admin0', '_blank');
            });

            actionsContent.appendChild(reloadButton);
            actionsContent.appendChild(issueButton);
            actionsContent.appendChild(updateButton);
            scrollContainer.appendChild(actionsSection);

            // Create Top Moves section
            const topMovesSectionObj = createSection('Top Moves');
            const topMovesSection = topMovesSectionObj.section;
            const topMovesContent = topMovesSectionObj.content;

            // Create container for top moves display
            const topMovesContainer = document.createElement('div');
            topMovesContainer.style = `
                background-color: #3a3634;
                border-radius: 4px;
                padding: 10px;
            `;

            // Create header for top moves
            const topMovesHeader = document.createElement('div');
            topMovesHeader.style = `
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 12px;
                color: #bababa;
                opacity: 0.8;
            `;

            const moveHeader = document.createElement('span');
            moveHeader.innerText = 'Move';

            const evalHeader = document.createElement('span');
            evalHeader.innerText = 'Evaluation';

            topMovesHeader.appendChild(moveHeader);
            topMovesHeader.appendChild(evalHeader);
            topMovesContainer.appendChild(topMovesHeader);

            // Create elements for top 2 moves
            for (let i = 1; i <= 2; i++) {
                const moveRow = document.createElement('div');
                moveRow.style = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-top: 1px solid #464442;
                `;

                const moveNumber = document.createElement('span');
                moveNumber.style = `
                    background-color: ${i === 1 ? '#7fa650' : '#5d5955'};
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    margin-right: 8px;
                `;
                moveNumber.innerText = i;

                const moveText = document.createElement('span');
                moveText.id = `topMove${i}`;
                moveText.innerText = '...';
                moveText.style = `
                    font-family: monospace;
                    font-weight: ${i === 1 ? 'bold' : 'normal'};
                `;

                const moveLeft = document.createElement('div');
                moveLeft.style = `
                    display: flex;
                    align-items: center;
                `;
                moveLeft.appendChild(moveNumber);
                moveLeft.appendChild(moveText);

                const evalText = document.createElement('span');
                evalText.id = `topMoveEval${i}`;
                evalText.innerText = '...';
                evalText.style = `
                    font-family: monospace;
                    color: ${i === 1 ? '#7fa650' : '#bababa'};
                `;

                moveRow.appendChild(moveLeft);
                moveRow.appendChild(evalText);
                topMovesContainer.appendChild(moveRow);
            }

            topMovesContent.appendChild(topMovesContainer);
            scrollContainer.appendChild(topMovesSection);

            // Make the header draggable only in draggable mode
            header.style.cursor = positionType === 'draggable' ? 'move' : 'default';
            header.style.userSelect = 'none'; // Prevent text selection during drag

            // No visual indicator here - we'll add a single one later

            // Make panel draggable with improved handling (only when in draggable mode)
            let isDragging = false;
            let offsetX, offsetY;

            // Only set up dragging if in draggable mode
            if (positionType === 'draggable') {
                // Use mousedown on header for dragging
                header.addEventListener('mousedown', function(e) {
                    // Only initiate drag if clicking on the header itself, the drag handle, or its children
                    if (e.target === header || e.target === dragHandle || e.target === gripIcon || e.target === title || e.target === version) {
                        e.preventDefault(); // Prevent text selection during drag
                        isDragging = true;

                        // Calculate offset from the panel's top-left corner
                        const rect = panel.getBoundingClientRect();
                        offsetX = e.clientX - rect.left;
                        offsetY = e.clientY - rect.top;

                        // No appearance change during drag - keep solid

                        // Capture mouse events on the entire document
                        document.addEventListener('mousemove', handleDrag);
                        document.addEventListener('mouseup', stopDrag);
                    }
                });

                // Handle dragging
                function handleDrag(e) {
                    if (!isDragging) return;

                    const newLeft = e.clientX - offsetX;
                    const newTop = e.clientY - offsetY;

                    // Keep panel within viewport bounds
                    const maxX = window.innerWidth - panel.offsetWidth;
                    const maxY = window.innerHeight - panel.offsetHeight;

                    panel.style.right = 'auto';
                    panel.style.top = Math.max(0, Math.min(newTop, maxY)) + 'px';
                    panel.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
                    panel.style.transform = 'none';
                }

                // Stop dragging
                function stopDrag() {
                    if (!isDragging) return;

                    isDragging = false;

                    // Save position with more details
                    const rect = panel.getBoundingClientRect();
                    GM_setValue('panelPosition', {
                        top: rect.top,
                        left: rect.left,
                        right: 'auto'
                    });

                    // Remove temporary event listeners
                    document.removeEventListener('mousemove', handleDrag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                // Add a clean, modern drag handle
                const dragHandle = document.createElement('div');
                dragHandle.style = `
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 3px;
                    margin-right: 8px;
                    cursor: move;
                    user-select: none;
                    width: 16px;
                    height: 16px;
                `;

                // Create a simple grip icon for the drag handle
                const gripIcon = document.createElement('div');
                gripIcon.innerHTML = '≡'; // Unicode triple bar character
                gripIcon.style = ``;
                dragHandle.appendChild(gripIcon);

                header.insertBefore(dragHandle, header.firstChild);
            }

            // Add footer (outside scroll container)
            const footer = document.createElement('div');
            footer.style = `
                margin-top: 10px;
                padding-top: 8px;
                border-top: 1px solid #464442;
                font-size: 11px;
                text-align: center;
                opacity: 0.7;
                flex-shrink: 0; /* Prevent footer from shrinking */
                position: relative; /* For resize handle positioning */
            `;

            footer.innerText = 'Press ESC to toggle interface';
            panel.appendChild(footer);

            // Use browser's native resize functionality instead of custom handle
            if (positionType === 'draggable') {
                // Set panel to be resizable using browser's native resize
                panel.style.resize = 'both';
                panel.style.overflow = 'auto';

                // Add event listener to save dimensions when resizing stops
                let resizeTimeout;
                const saveResizedDimensions = function() {
                    // Save new dimensions
                    const width = panel.offsetWidth;
                    const height = panel.offsetHeight;

                    GM_setValue('panelDimensions', {
                        width: width,
                        height: height,
                        minWidth: savedDimensions.minWidth,
                        minHeight: savedDimensions.minHeight
                    });
                };

                // Use resize observer to detect when resizing happens
                const resizeObserver = new ResizeObserver(function() {
                    // Clear previous timeout
                    clearTimeout(resizeTimeout);

                    // Set new timeout to save dimensions after resizing stops
                    resizeTimeout = setTimeout(saveResizedDimensions, 500);
                });

                // Start observing the panel
                resizeObserver.observe(panel);
            }

            // Append panel to body
            document.body.appendChild(panel);

            loaded = true;
            console.log("[UI] Chess.com themed interface created successfully");
        } catch (error) {
            console.error("[UI] Error creating interface:", error);
        }
    };

    // Main interval loop
    const waitForChessBoard = setInterval(() => {
        if (loaded) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];

            // Read checkbox states directly from DOM
            try {
                myVars.suggestMove = document.getElementById('suggestMove').checked;
                myVars.autoMove = document.getElementById('autoMove').checked;
                myVars.autoMatch = document.getElementById('autoMatch').checked;

                // Save the current state
                GM_setValue('suggestMove', myVars.suggestMove);
                GM_setValue('autoMove', myVars.autoMove);
                GM_setValue('autoMatch', myVars.autoMatch);

                // Read delay values
                let minDelay = parseFloat(document.getElementById('timeDelayMin').value) || 0.1;
                let maxDelay = parseFloat(document.getElementById('timeDelayMax').value) || 1.0;
                myVars.delay = Math.random() * (maxDelay - minDelay) + minDelay;
            } catch (e) {
                console.warn("[UI] Error reading UI state:", e);
            }

            // Update spinner
            myVars.isThinking = isThinking;
            myFunctions.spinner();

            // Check for game over
            const gameOverModal = $('.game-over-modal-content');
            if (gameOverModal.length > 0 && !myVars.gameEnded) {
                console.log("[Game] Game over detected");
                myVars.gameEnded = true;
                myVars.hasAutoMatched = false;
            }

            // Check turn
            try {
                if (!myVars.gameEnded && board && board.game) {
                    myTurn = (board.game.getTurn() == board.game.getPlayingAs());
                } else {
                    myTurn = false;
                }
            } catch (e) {
                myTurn = false;
            }

            // Log state (for debugging)
            console.log(`[State] SuggestMove:${myVars.suggestMove} AutoMove:${myVars.autoMove} AutoMatch:${myVars.autoMatch} MyTurn:${myTurn} Thinking:${isThinking} CanGo:${canGo}`);

            // Make sure engine is loaded
            if (!engine.engine) {
                myFunctions.loadChessEngine();
            }

            // Auto Run Logic (Now Suggested Move Logic)
            if (myVars.suggestMove && canGo && !isThinking && myTurn && !myVars.gameEnded) {
                console.log("[Auto] Triggering suggested move analysis...");
                canGo = false;
                const currentDelay = myVars.delay * 1000;
                other(currentDelay);
            }

            // Auto Match Logic
            if (myVars.autoMatch && myVars.gameEnded && !myVars.hasAutoMatched) {
                console.log("[Auto] Triggering auto match...");
                myFunctions.startNewGame();
            }
        } else if ($('chess-board, wc-chess-board').length > 0) {
            // Try to load UI if not loaded yet
            myFunctions.loadEx();
        }
    }, 100);
}

// Global variables
var isThinking = false;
var canGo = true;
var myTurn = false;
var board;

// Add CSS to hide the menu icon
const hideMenuStyle = document.createElement('style');
hideMenuStyle.textContent = `
    .GM_menuCommand,
    #GM_menu,
    #GM_menu_button,
    .tampermonkey-menu-button,
    div[id^="tampermonkey-menu"],
    div[class^="tampermonkey-menu"],
    div[style*="position: fixed; right: auto; top: 59px; left: 420px;"],
    div[style*="position:fixed;right:auto;top:59px;left:420px;"],
    div[style*="z-index: 9999"]:not(#chessBot):not(#overlay):not(#chessBot-settings),
    div[id$="-menu"],
    div[class$="-menu"],
    div[style*="=="],
    div[style*="$0"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
`;
document.head.appendChild(hideMenuStyle);

// Register menu commands but they'll be hidden by CSS
function registerHiddenMenuCommands() {
    // Register menu commands for functionality but they'll be hidden
    GM_registerMenuCommand("Chess.com Bot v2.0.0", function() {
        // Toggle visibility of the bot panel
        const panel = document.getElementById('chessBot');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        }
    });
}

// Call this after the document is loaded
setTimeout(registerHiddenMenuCommands, 1000);

// Function to remove specific unwanted elements
function removeUnwantedElements() {
    // Find and remove elements with style containing "=="
    const elements = document.querySelectorAll('div');
    for (const el of elements) {
        if (el.getAttribute('style') &&
            (el.getAttribute('style').includes('==') ||
             el.getAttribute('style').includes('$0'))) {
            el.remove();
        }
    }

    // Keep checking periodically
    setTimeout(removeUnwantedElements, 1000);
}

// Start removing unwanted elements
setTimeout(removeUnwantedElements, 500);

// Start the script
window.addEventListener("load", (event) => {
    console.log("[Script] Chess.com Bot v2.0.0 starting...");
    main();
});
