// ==UserScript==
// @license MIT
// @description      Chess.com move suggestion bot using Stockfish
// @name             Chess.com Move Suggester
// @namespace        https://your-unique-namespace.com
// @match            https://www.chess.com/*
// @run-at           document-end
// @grant            none
// @version          1.0
// @downloadURL https://update.greasyfork.org/scripts/526460/Chesscom%20Move%20Suggester.user.js
// @updateURL https://update.greasyfork.org/scripts/526460/Chesscom%20Move%20Suggester.meta.js
// ==/UserScript==

(async function() {
    const stockfish = new Worker("https://raw.githubusercontent.com/official-stockfish/Stockfish-scripts/main/stockfish.js");
    let boardFEN = "";
    
    function getBoardFEN() {
        const fenElement = document.querySelector("[data-cy='board-controls']");
        return fenElement ? fenElement.getAttribute("data-fen") : null;
    }
    
    function suggestMove(fen) {
        return new Promise((resolve) => {
            stockfish.postMessage("uci");
            stockfish.postMessage("position fen " + fen);
            stockfish.postMessage("go depth 15");
            
            stockfish.onmessage = (event) => {
                if (event.data.includes("bestmove")) {
                    resolve(event.data.split(" ")[1]);
                }
            };
        });
    }
    
    function createButton() {
        const button = document.createElement("button");
        button.innerText = "Suggest Move";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "10px";
        button.style.padding = "10px";
        button.style.background = "blue";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        
        button.onclick = async () => {
            boardFEN = getBoardFEN();
            if (boardFEN) {
                const bestMove = await suggestMove(boardFEN);
                alert("Best move: " + bestMove);
            } else {
                alert("Could not retrieve board state.");
            }
        };
        
        document.body.appendChild(button);
    }
    
    createButton();
})();
