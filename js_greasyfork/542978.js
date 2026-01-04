// ==UserScript==
// @name         Chess.com AutoMove with Stockfish 17.1 (Fast Start)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically plays Stockfish 17.1 moves instantly on Chess.com (bot games only)
// @match        https://www.chess.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542978/Chesscom%20AutoMove%20with%20Stockfish%20171%20%28Fast%20Start%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542978/Chesscom%20AutoMove%20with%20Stockfish%20171%20%28Fast%20Start%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🧠 Use Stockfish 17.1 (WASM build — host your own or use a trusted CDN)
    const STOCKFISH_URL = 'https://lichess1.org/assets/engine/stockfish.wasm.js'; // Lichess-hosted (version may vary)

    let stockfish;
    let running = false;

    function initStockfish() {
        stockfish = new Worker(STOCKFISH_URL);
        stockfish.postMessage("uci");
    }

    function getFEN() {
        try {
            const game = window?.CHESS?.getGameData?.();
            if (game?.fen && !game.gameOver) return game.fen;
        } catch (e) {}
        return null;
    }

    function doMove(uci) {
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const fromSquare = document.querySelector(`[data-square='${from}']`);
        const toSquare = document.querySelector(`[data-square='${to}']`);
        if (fromSquare && toSquare) {
            fromSquare.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            toSquare.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }
    }

    function startAutoMove() {
        if (running) return;
        running = true;

        stockfish.onmessage = function (e) {
            const msg = e.data;
            if (typeof msg === "string" && msg.startsWith("bestmove")) {
                const move = msg.split(" ")[1];
                if (move && move.length >= 4) {
                    doMove(move);
                }
            }
        };

        setInterval(() => {
            const fen = getFEN();
            if (fen) {
                stockfish.postMessage(`position fen ${fen}`);
                stockfish.postMessage("go depth 12");
            }
        }, 1500); // every 1.5 sec
    }

    // 🧠 Start when DOM is ready
    window.addEventListener("load", () => {
        initStockfish();
        startAutoMove();
    });
})();

