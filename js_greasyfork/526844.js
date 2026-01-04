// ==UserScript==
// @name         Chess.com Help Button (Stockfish 3200 ELO)
// @namespace    http://chess.com/
// @version      2.0
// @description  Adds a Help button to Chess.com to suggest the best move with reasoning using Stockfish 3200 ELO.
// @author       URMAMA
// @match        *://www.chess.com/game/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526844/Chesscom%20Help%20Button%20%28Stockfish%203200%20ELO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526844/Chesscom%20Help%20Button%20%28Stockfish%203200%20ELO%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[Help Button] Script Loaded ✅");

    function addHelpButton() {
        if (document.querySelector("#help-button")) return; // Prevent duplicate buttons

        let button = document.createElement("button");
        button.id = "help-button";
        button.innerText = "♟️ Help (3200 ELO)";
        button.style.position = "absolute";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px";
        button.style.background = "#FF5722";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.zIndex = "1000";

        button.onclick = fetchBestMove;

        document.body.appendChild(button);
    }

    async function fetchBestMove() {
        let fen = getFEN();
        if (!fen) {
            alert("❌ Error: Could not retrieve game position.");
            return;
        }

        console.log(`Fetching best move for FEN: ${fen}`);

        let response = await fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`);
        let data = await response.json();

        if (data.pvs && data.pvs.length > 0) {
            let bestMove = data.pvs[0].moves.split(" ")[0]; // First move suggestion
            let depth = data.depth;
            let evalScore = data.pvs[0].cp !== undefined ? (data.pvs[0].cp / 100) : "Mate in " + data.pvs[0].mate;
            let reasoning = analyzeMove(bestMove, evalScore);
            showMove(bestMove, depth, evalScore, reasoning);
        } else {
            alert("❌ No move suggestion available.");
        }
    }

    function getFEN() {
        let boardElement = document.querySelector("[data-board]"); // Chess.com stores FEN in attributes
        return boardElement ? boardElement.getAttribute("data-board") : null;
    }

    function analyzeMove(move, evalScore) {
        if (move.includes("x")) return `Capturing material, improving position (Eval: ${evalScore}).`;
        if (move.includes("+")) return `Check move! Putting pressure on the king (Eval: ${evalScore}).`;
        if (move.includes("O-O") || move.includes("O-O-O")) return `Castling for king safety (Eval: ${evalScore}).`;
        return `Improving piece activity, controlling center (Eval: ${evalScore}).`;
    }

    function showMove(move, depth, evalScore, reasoning) {
        let moveBox = document.createElement("div");
        moveBox.className = "move-suggestion";
        moveBox.style.position = "absolute";
        moveBox.style.bottom = "60px";
        moveBox.style.right = "20px";
        moveBox.style.background = "#4CAF50";
        moveBox.style.color = "#fff";
        moveBox.style.padding = "10px";
        moveBox.style.borderRadius = "5px";
        moveBox.style.fontWeight = "bold";
        moveBox.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.2)";
        moveBox.style.zIndex = "1000";
        moveBox.innerText = `✅ Best Move: ${move} (Depth ${depth})\n🔍 Why: ${reasoning}`;

        document.body.appendChild(moveBox);
        setTimeout(() => moveBox.remove(), 5000);
    }

    function watchForChanges() {
        let observer = new MutationObserver(() => addHelpButton());
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[Help Button] Watching for Chess.com matches...");
    }

    addHelpButton();
    watchForChanges();
})();


