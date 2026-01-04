// ==UserScript==
// @name         Chess.com Stockfish Bot
// @namespace    BottleOrg Scripts
// @version      1.7.1
// @description  Chess.com Stockfish Bot with decent stability(will keep on fixing!)
// @author       [REDACTED] - Rightful Owner(qbaonguyen050@gmail.com), BottleOrg(bottleorg.1@gmail.com), Gemini 2.5 Pro
// @license      Chess.com Bot/Cheat by BottleOrg(bottleorg.1@gmail.com) and its rightful owner!
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/445697/code/index.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542194/Chesscom%20Stockfish%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/542194/Chesscom%20Stockfish%20Bot.meta.js
// ==/UserScript==

const currentVersion = '1.7.1';
const scriptURL = 'https://greasyfork.org/en/scripts/542194-chess-com-stockfish-bot/code';

function checkForUpdate() {
    console.log("Checking for script updates...");
    GM_xmlhttpRequest({
        method: "GET",
        url: scriptURL,
        onload: function(response) {
            if (response.status === 200) {
                const html = response.responseText;
                const versionMatch = html.match(/@version\s+([\d.]+)/);
                if (versionMatch && versionMatch[1]) {
                    const latestVersion = versionMatch[1];
                    console.log("Latest version found:", latestVersion);
                    if (compareVersions(latestVersion, currentVersion) > 0) {
                        const message = `New Version: ${latestVersion} has been uploaded. Would you like me to take you there or continue with old version ${currentVersion}? (Not recommended for stability)`;
                        if (confirm(message)) {
                            window.location.href = scriptURL;
                        } else {
                            console.log("User chose to continue with old version.");
                        }
                    } else {
                        console.log("No newer version available.");
                    }
                } else {
                    console.error("Could not find version in Greasy Fork page.");
                }
            } else {
                console.error("Failed to fetch script page:", response.status);
            }
        },
        onerror: function(error) {
            console.error("Error checking for update:", error);
        }
    });
}

function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

function main() {
    let myVars = document.myVars = {
        autoMove: false,
        autoRun: false,
        autoMatch: false,
        delay: 0.1,
        hasAutoMatched: false,
        gameEnded: false
    };
    let myFunctions = document.myFunctions = {};
    const currentStockfishVersion = "Stockfish API";
    let uiElementsLoaded = false;
    const stockfishAPI_URI = "https://stockfish.online/api/s/v2.php";
    let stop_b = 0, stop_w = 0;
    let board;

    myFunctions.rescan = function() {
        console.log("Rescanning board...");
        const boardElement = document.querySelector('chess-board, wc-chess-board');
        if (!boardElement) {
            console.warn("No board element found. Using default FEN.");
            return "rnbqkbnr/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        }
        const pieces = $(boardElement).find(".piece").map(function() {
            return this.className;
        }).get();
        if (!pieces.length) {
            console.warn("No pieces found. Using default FEN.");
            return "rnbqkbnr/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        }
        let boardArray = Array(64).fill('');
        pieces.forEach(piece => {
            const classes = piece.split(' ');
            const squareClass = classes.find(c => c.startsWith('square-'));
            const pieceClass = classes.find(c => /^[wb][prnbqk]$/.test(c));
            if (squareClass && pieceClass) {
                const squareNum = squareClass.replace('square-', '');
                const file = parseInt(squareNum[0]) - 1;
                const rank = parseInt(squareNum[1]) - 1;
                const square = (7 - rank) * 8 + file;
                if (square >= 0 && square < 64) {
                    const pieceChar = {
                        'wp': 'P', 'bp': 'p', 'wr': 'R', 'br': 'r',
                        'wn': 'N', 'bn': 'n', 'wb': 'B', 'bb': 'b',
                        'wq': 'Q', 'bq': 'q', 'wk': 'K', 'bk': 'k'
                    }[pieceClass];
                    boardArray[square] = pieceChar;
                }
            }
        });
        let fen = '';
        for (let i = 0; i < 64; i++) {
            if (i % 8 === 0 && i > 0) fen += '/';
            const piece = boardArray[i];
            if (!piece) {
                let emptyCount = 1;
                while (i + 1 < 64 && !boardArray[i + 1] && (i + 1) % 8 !== 0) {
                    emptyCount++;
                    i++;
                }
                fen += emptyCount;
            } else {
                fen += piece;
            }
        }
        const turn = $('.coordinates').children().first().text() === "1" ? 'b' : 'w';
        const castling = ((stop_w ? '' : 'KQ') + (stop_b ? '' : 'kq')) || '-';
        fen += ` ${turn} ${castling} - 0 1`;
        console.log("Generated FEN:", fen);
        return fen;
    };

    myFunctions.color = function(dat) {
        console.log("myFunctions.color CALLED with:", dat);
        const bestmoveUCI = dat.split(' ')[1];
        console.log("Extracted bestmove UCI:", bestmoveUCI);
        if (myVars.autoMove) myFunctions.movePiece(bestmoveUCI);
        else myFunctions.highlightMove(bestmoveUCI);
        isThinking = false;
        myFunctions.spinner();
    };

    myFunctions.highlightMove = function(bestmoveUCI) {
        const res1 = bestmoveUCI.substring(0, 2);
        const res2 = bestmoveUCI.substring(2, 4);
        $(board).prepend(`<div class="highlight square-${res2}" style="background-color: rgb(235, 97, 80); opacity: 0.71;"></div>`)
            .children(':first').delay(1800).queue(function() { $(this).remove(); });
        $(board).prepend(`<div class="highlight square-${res1}" style="background-color: rgb(235, 97, 80); opacity: 0.71;"></div>`)
            .children(':first').delay(1800).queue(function() { $(this).remove(); });
        console.log("Highlighted:", bestmoveUCI);
    };

    myFunctions.movePiece = function(bestmoveUCI) {
        console.log("movePiece CALLED with:", bestmoveUCI);
        if (!board || !board.game) {
            console.error("Board or board.game not initialized!");
            return;
        }
        const fromSquare = bestmoveUCI.substring(0, 2);
        const toSquare = bestmoveUCI.substring(2, 4);
        const legalMoves = board.game.getLegalMoves();
        console.log("Legal moves:", legalMoves);
        const foundMove = legalMoves.find(move => move.from === fromSquare && move.to === toSquare);
        if (foundMove) {
            console.log("Executing move:", foundMove);
            board.game.move({ ...foundMove, promotion: 'q', animate: true, userGenerated: true });
            console.log("Move executed:", bestmoveUCI);
        } else {
            console.warn("No legal move found for:", bestmoveUCI);
        }
    };

    myFunctions.reloadChessEngine = function() {
        console.log("Reload not needed for API.");
    };

    myFunctions.loadChessEngine = function() {
        console.log("Using Stockfish API.");
        if (uiElementsLoaded) $('#engineVersionText')[0].innerHTML = "Engine: <strong>Stockfish API</strong>";
    };

    myFunctions.fetchBestMoveFromAPI = function(fen, depth) {
        const apiURL = `${stockfishAPI_URI}?fen=${encodeURIComponent(fen)}&depth=${depth}`;
        console.log(`Fetching from: ${apiURL}`);
        GM_xmlhttpRequest({
            method: "GET",
            url: apiURL,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        if (jsonResponse.success) {
                            console.log("API Response:", jsonResponse);
                            myFunctions.color(jsonResponse.bestmove);
                        } else {
                            console.error("API failed:", jsonResponse);
                            isThinking = false;
                            myFunctions.spinner();
                        }
                    } catch (e) {
                        console.error("API parse error:", e);
                        isThinking = false;
                        myFunctions.spinner();
                    }
                } else {
                    console.error("API error:", response.status);
                    isThinking = false;
                    myFunctions.spinner();
                }
            },
            onerror: function(error) {
                console.error("API request error:", error);
                isThinking = false;
                myFunctions.spinner();
            }
        });
    };

    myFunctions.startNewGame = function() {
        console.log("Attempting to start a new game with auto-detection...");

        // Robust selector for any "New Game" button in the game over modal/screen that isn't a "Rematch" button.
        const newGameButtonSelector = '.game-over-buttons-component .cc-button-component:not([aria-label="Rematch"])';
        const newGameButton = $(newGameButtonSelector);

        if (newGameButton.length > 0) {
            console.log("Found 'New Game' button with text:", newGameButton.text().trim());
            newGameButton[0].click();
            myVars.hasAutoMatched = true;
            return; // Exit after clicking
        }

        // Fallback for cases where the game-over screen might be different
        const guestButton = $('#guest-button.authentication-intro-guest');
        if (guestButton.length) {
            guestButton[0].click();
            console.log("Clicked Play as Guest.");
            setTimeout(() => {
                const playButton = $('.cc-button-component.cc-button-primary.cc-button-xx-large.cc-button-full');
                if (playButton.length) {
                    playButton[0].click();
                    console.log("Clicked Play button after guest prompt.");
                    myVars.hasAutoMatched = true;
                } else {
                    console.error("Play button not found after guest prompt!");
                }
            }, 500);
            return;
        }

        const newGameTab = $('[data-tab="newGame"]');
        if (newGameTab.length) {
            newGameTab[0].click();
            console.log("Clicked New Game tab.");
            setTimeout(() => {
                const playButton = $('.cc-button-component.cc-button-primary.cc-button-xx-large.cc-button-full');
                if (playButton.length) {
                    playButton[0].click();
                    console.log("Clicked Play button.");
                    myVars.hasAutoMatched = true;
                } else {
                    console.error("Play button not found!");
                }
            }, 500);
            return;
        }
        console.warn("Could not find any 'New Game' button to click.");
    };

    myFunctions.declineRematch = function() {
        const declineButton = $('.cc-button-component.cc-button-secondary[aria-label="Decline"], .cc-button-component.cc-button-secondary:contains("Decline")');
        if (declineButton.length) {
            declineButton[0].click();
            console.log("Declined rematch.");
            return true;
        } else {
            console.log("No rematch decline button found.");
            return false;
        }
    };

    let lastValue = 11, MAX_DEPTH = 15, MIN_DEPTH = 1;

    myFunctions.runChessEngine = function(depth) {
        depth = Math.max(MIN_DEPTH, Math.min(MAX_DEPTH, depth));
        const fen = myFunctions.rescan();
        console.log(`Analyzing FEN: ${fen}, Depth: ${depth}`);
        isThinking = true;
        myFunctions.spinner();
        myFunctions.fetchBestMoveFromAPI(fen, depth);
        lastValue = depth;
        updateDepthDisplay();
    };

    function updateDepthDisplay() {
        if (uiElementsLoaded && $('#depthText')[0]) {
            $('#depthText')[0].innerHTML = `Depth: <strong>${lastValue}</strong>`;
        }
    }

    myFunctions.incrementDepth = function(delta) {
        lastValue = Math.max(MIN_DEPTH, Math.min(MAX_DEPTH, lastValue + delta));
        updateDepthDisplay();
    };

    myFunctions.autoRun = function() {
        if (board && board.game && board.game.getTurn() === board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lastValue);
        }
    };

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 81: myFunctions.runChessEngine(1); break;
            case 87: myFunctions.runChessEngine(2); break;
            case 69: myFunctions.runChessEngine(3); break;
            case 82: myFunctions.runChessEngine(4); break;
            case 84: myFunctions.runChessEngine(5); break;
            case 89: myFunctions.runChessEngine(6); break;
            case 85: myFunctions.runChessEngine(7); break;
            case 73: myFunctions.runChessEngine(8); break;
            case 79: myFunctions.runChessEngine(9); break;
            case 80: myFunctions.runChessEngine(10); break;
            case 65: myFunctions.runChessEngine(11); break;
            case 83: myFunctions.runChessEngine(12); break;
            case 68: myFunctions.runChessEngine(13); break;
            case 70: myFunctions.runChessEngine(14); break;
            case 71: myFunctions.runChessEngine(15); break;
            case 187: myFunctions.incrementDepth(1); break;
            case 189: myFunctions.incrementDepth(-1); break;
        }
    };

    myFunctions.spinner = function() {
        if (uiElementsLoaded && $('#overlay')[0]) {
            $('#overlay')[0].style.display = isThinking ? 'block' : 'none';
        }
    };

    let dynamicStyles = null;
    function addAnimation(rule) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement('style');
            document.head.appendChild(dynamicStyles);
        }
        dynamicStyles.sheet.insertRule(rule, dynamicStyles.sheet.cssRules.length);
    }

    function addUIStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .chess-ui-panel { width: 280px; background: linear-gradient(135deg, #ffe6e6, #fff5f5); border: 2px solid #ffcccc; border-radius: 12px; box-shadow: 4px 4px 16px rgba(0,0,0,0.3); animation: fadeIn 1s ease-out; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; }
            .chess-ui-header { background: #ffcccc; border-bottom: 1px solid #ffb3b3; border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 8px; cursor: move; font-weight: bold; color: #800000; text-align: center; }
            .chess-ui-body { padding: 10px; }
            .chess-ui-panel button { background: #e91e63; border: none; color: white; padding: 8px 12px; margin: 4px 2px; border-radius: 5px; cursor: pointer; transition: box-shadow 0.3s ease, transform 0.2s ease; }
            .chess-ui-panel button:hover { box-shadow: 0 0 8px #ff69b4; transform: scale(1.05); }
            .chess-ui-panel input[type="checkbox"], .chess-ui-panel input[type="number"] { margin: 5px 0; padding: 4px; border: 1px solid #ffcccc; border-radius: 4px; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }

    function makeDraggable(panel, header) {
        let offsetX, offsetY;
        header.addEventListener('mousedown', e => {
            e.preventDefault();
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        });
        function elementDrag(e) {
            e.preventDefault();
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        }
        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    }

    let loaded = false;
    myFunctions.loadEx = function() {
        try {
            console.log("Attempting to load UI...");
            board = document.querySelector('chess-board, wc-chess-board');
            addUIStyles();
            const panel = document.createElement('div');
            panel.className = "chess-ui-panel";
            panel.style.position = 'fixed'; panel.style.top = '10px'; panel.style.right = '10px'; panel.style.zIndex = '10000';
            panel.innerHTML = `
                <div class="chess-ui-header">Stockfish Bot</div>
                <div class="chess-ui-body">
                    <p id="depthText">Depth: <strong>${lastValue}</strong></p>
                    <button id="depthMinus">-</button> <button id="depthPlus">+</button>
                    <p style="font-size: 12px;">Keys: Q-G (1-15), +/-</p>
                    <p id="engineVersionText">Engine: Stockfish API 😘</p>
                    <label><input type="checkbox" id="autoRun"> Auto Run</label><br>
                    <label><input type="checkbox" id="autoMove"> Auto Move</label><br>
                    <label><input type="checkbox" id="autoMatch"> Auto-Match</label><br>
                    <label>Min Delay (s): <input type="number" id="timeDelayMin" min="0.1" value="0.1" step="0.1" style="width: 60px;"></label><br>
                    <label>Max Delay (s): <input type="number" id="timeDelayMax" min="0.1" value="1" step="0.1" style="width: 60px;"></label>
                </div>`;
            document.body.appendChild(panel);
            const header = panel.querySelector('.chess-ui-header');
            makeDraggable(panel, header);

            setTimeout(() => {
                $('#depthPlus').off('click').on('click', () => myFunctions.incrementDepth(1));
                $('#depthMinus').off('click').on('click', () => myFunctions.incrementDepth(-1));
                $('#autoMatch').on('change', () => {
                    myVars.autoMatch = $('#autoMatch')[0].checked;
                    if (myVars.autoMatch && !myVars.hasAutoMatched) myFunctions.startNewGame();
                });
                console.log("Event listeners bound.");
            }, 100);

            const spinCont = document.createElement('div');
            spinCont.id = 'overlay';
            spinCont.style.cssText = 'display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
            panel.appendChild(spinCont);
            const spinr = document.createElement('div');
            spinr.style.cssText = "height: 64px; width: 64px; animation: rotate 0.8s infinite linear; border: 5px solid firebrick; border-right-color: transparent; border-radius: 50%;";
            spinCont.appendChild(spinr);
            addAnimation(`@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`);

            loaded = true;
            uiElementsLoaded = true;
            console.log("UI loaded successfully.");
            myFunctions.loadChessEngine();
            checkForUpdate();
        } catch (error) {
            console.error("loadEx error:", error);
        }
    };

    function other(delay) {
        const endTime = Date.now() + delay;
        const timer = setInterval(() => {
            if (Date.now() >= endTime) {
                myFunctions.autoRun();
                canGo = true;
                clearInterval(timer);
            }
        }, 10);
    }

    const waitForChessBoard = setInterval(() => {
        if (!loaded) {
            myFunctions.loadEx();
        } else {
            if (!board) board = document.querySelector('chess-board, wc-chess-board');
            myVars.autoRun = $('#autoRun')[0].checked;
            myVars.autoMove = $('#autoMove')[0].checked;
            myVars.autoMatch = $('#autoMatch')[0].checked;
            const minDel = parseFloat($('#timeDelayMin')[0].value) || 0.1;
            const maxDel = parseFloat($('#timeDelayMax')[0].value) || 1;
            myVars.delay = Math.random() * (maxDel - minDel) + minDel;
            myFunctions.spinner();
            myTurn = board && board.game && board.game.getTurn() === board.game.getPlayingAs();
            updateDepthDisplay();

            const isGameOver = document.querySelector('.game-over-modal-content, .game-over-message-component, .game-result');

            if (isGameOver && !myVars.gameEnded) {
                console.log("Game over detected.");
                myVars.gameEnded = true;
                if (myVars.autoMatch) {
                    myFunctions.declineRematch();
                    setTimeout(() => {
                        myVars.hasAutoMatched = false;
                        myFunctions.startNewGame();
                    }, 1500); // Wait 1.5s for modal animations
                }
            } else if (!isGameOver && myVars.gameEnded) {
                console.log("New game started, resetting gameEnded flag.");
                myVars.gameEnded = false;
            }

            if (myVars.autoRun && canGo && !isThinking && myTurn) {
                canGo = false;
                other(myVars.delay * 1000);
            }
        }
    }, 500);

    setTimeout(() => {
        if (!loaded) myFunctions.loadEx();
    }, 2000);
}

let isThinking = false, canGo = true, myTurn = false;
window.addEventListener("load", () => main());