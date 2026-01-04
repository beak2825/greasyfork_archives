// ==UserScript==
// @name         Chess.com  Assistant Mazurka1
// @namespace    SecureChess
// @version      2.0.0
// @description  Advanced chess assistant with undetectable features
// @author       SecureChess
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     stockfish.js https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @antifeature  none
// @downloadURL https://update.greasyfork.org/scripts/544390/Chesscom%20%20Assistant%20Mazurka1.user.js
// @updateURL https://update.greasyfork.org/scripts/544390/Chesscom%20%20Assistant%20Mazurka1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        version: '2.0.0',
        defaultDepth: 11,      // Default engine depth (1-25)
        minDelay: 0.5,         // Minimum delay (seconds) for auto-run
        maxDelay: 2.0,         // Maximum delay (seconds) for auto-run
        stealthMode: false,     // Disables highlights/animations
        autoMove: false,       // Auto-execute best move
        autoRun: false          // Auto-run engine on turn
    };

    // State
    let engine = null;
    let isThinking = false;
    let canRun = true;
    let currentDepth = config.defaultDepth;
    let board = null;

    // Initialize Stockfish engine
    function initEngine() {
        if (!engine) {
            const stockfishURL = URL.createObjectURL(
                new Blob([GM_getResourceText('stockfish.js')], { type: 'application/javascript' })
            );
            engine = new Worker(stockfishURL);
            engine.onmessage = handleEngineResponse;
            engine.postMessage('ucinewgame');
            console.log('[Pentest] Engine initialized');
        }
    }

    // Handle engine responses (best moves)
    function handleEngineResponse(e) {
        if (e.data.includes('bestmove')) {
            const bestMove = e.data.split(' ')[1];
            if (bestMove && bestMove !== '(none)') {
                highlightMove(bestMove);
                if (config.autoMove) executeMove(bestMove);
            }
            isThinking = false;
        }
    }

    // Highlight suggested move (if stealth mode is off)
    function highlightMove(move) {
        if (config.stealthMode) return;

        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const boardElement = $(board.nodeName);

        boardElement.prepend(`
            <div class="highlight square-${to}" style="background-color: rgba(235, 97, 80, 0.7);"></div>
            <div class="highlight square-${from}" style="background-color: rgba(235, 97, 80, 0.7);"></div>
        `);

        setTimeout(() => boardElement.find('.highlight').remove(), 1800);
    }

    // Execute the move on the board
    function executeMove(move) {
        const legalMoves = board.game.getLegalMoves();
        for (const legalMove of legalMoves) {
            if (legalMove.from === move.substring(0, 2) && legalMove.to === move.substring(2, 4)) {
                board.game.move({
                    ...legalMove,
                    promotion: false,
                    animate: false,
                    userGenerated: true
                });
                break;
            }
        }
    }

    // Run engine with current depth
    function runEngine(depth) {
        if (!isThinking && board?.game) {
            const fen = board.game.getFEN();
            engine.postMessage(`position fen ${fen}`);
            engine.postMessage(`go depth ${depth}`);
            isThinking = true;
            currentDepth = depth;
        }
    }

    // Auto-run logic (with randomized delays)
    function autoRun() {
        if (config.autoRun && canRun && !isThinking && board?.game.getTurn() === board.game.getPlayingAs()) {
            canRun = false;
            const delay = (Math.random() * (config.maxDelay - config.minDelay) + config.minDelay) * 1000;
            setTimeout(() => {
                runEngine(currentDepth);
                canRun = true;
            }, delay);
        }
    }

    // Initialize the UI panel
    function initUI() {
        const ui = `
            <div id="chessAssistantUI" style="
                background: #2d2d2d;
                color: #fff;
                padding: 12px;
                border-radius: 8px;
                margin: 10px;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                width: 220px;
                position: fixed;
                right: 10px;
                top: 10px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: auto;
            ">
                <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 16px;">♔ Chess Assistant</h3>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Depth: <span id="depthValue">${currentDepth}</span></label>
                        <input type="range" id="depthSlider" min="1" max="25" value="${currentDepth}" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="checkbox" id="autoRunCheckbox" ${config.autoRun ? 'checked' : ''}>
                        <label for="autoRunCheckbox">Auto Run</label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="checkbox" id="autoMoveCheckbox" ${config.autoMove ? 'checked' : ''}>
                        <label for="autoMoveCheckbox">Auto Move</label>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <input type="checkbox" id="stealthModeCheckbox" ${config.stealthMode ? 'checked' : ''}>
                        <label for="stealthModeCheckbox">Stealth Mode</label>
                    </div>
                    <button id="runEngineButton" style="
                        width: 100%;
                        padding: 8px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Run Engine</button>
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #888; text-align: center; user-select: none;">
                    Made by Mazurka
                </div>
            </div>
        `;

        $('body').append(ui);

        // Event listeners
        $('#depthSlider').on('input', function() {
            currentDepth = parseInt($(this).val());
            $('#depthValue').text(currentDepth);
        });

        $('#autoRunCheckbox').change(() => config.autoRun = $('#autoRunCheckbox').is(':checked'));
        $('#autoMoveCheckbox').change(() => config.autoMove = $('#autoMoveCheckbox').is(':checked'));
        $('#stealthModeCheckbox').change(() => config.stealthMode = $('#stealthModeCheckbox').is(':checked'));
        $('#runEngineButton').click(() => runEngine(currentDepth));
    }

    // Main loop (checks for board and runs auto-logic)
    function mainLoop() {
        if (!board) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            if (board) {
                initEngine();
                initUI();
            }
        }
        autoRun();
        setTimeout(mainLoop, 100);
    }

    // Start the script
    window.addEventListener('load', mainLoop);
})();
