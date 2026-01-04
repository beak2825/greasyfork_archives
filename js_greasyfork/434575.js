// ==UserScript==
// @name         Chess.com Piece Numbers
// @namespace    https://theusaf.org
// @version      0.1.1
// @description  Adds piece number data to pieces in the chess board
// @author       theusaf
// @match        https://www.chess.com/**
// @icon         https://www.google.com/s2/favicons?domain=chess.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434575/Chesscom%20Piece%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/434575/Chesscom%20Piece%20Numbers.meta.js
// ==/UserScript==

let tries = 0;

function init() {
  const board = document.querySelector("chess-board,wc-chess-board"),
  pieces = {
    black: {
      p: 2 // to fix promotion stuff
    },
    white: {
      p: 2
    }
  };

  if (board) {
    const observer = new MutationObserver((mutations, observer) => {
         console.log(mutations);
      const attributeMutations = new Set();
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const {addedNodes, removedNodes} = mutation;
          for (const node of addedNodes) {
            if (node.nodeName !== "DIV") {continue;}
            if (Array.from(node.classList)?.includes("piece")) {
              addPiece(node);
            }
          }
          for (const node of removedNodes) {
            if (node.nodeName !== "DIV") {continue;}
            if (Array.from(node.classList)?.includes("piece")) {
              removePiece(node);
            }
          }
        } else {
          const filter = (mutation) => {
            return (/piece/.test(mutation.oldValue) ||
            /piece/.test(mutation.target.className)) &&
            (!/dragging/.test(mutation.target.className) &&
            !/dragging/.test(mutation.oldValue) &&
            mutation.oldValue !== null);
          };
          if (filter(mutation)) {
            attributeMutations.add(mutation);
          }
        }
      }
      const out = [],
        moveSquaresProcessed = new Set(),
        toSwap = new Set();
      for (const mutation of attributeMutations) {
        out.push(mutation);
        const piecePosition = getPieceSquare(mutation.target.className),
          [pieceTeam, pieceType] = getPieceType(mutation.target.className),
          [originalPieceTeam, originalPieceType] = getPieceType(mutation.oldValue);
        if (piecePosition in moveSquaresProcessed) {continue;}
        moveSquaresProcessed.add(piecePosition);
        let shouldContinue = false;
        // console.log(piecePosition, pieceTeam, pieceType, originalPieceTeam, originalPieceType)
        for (const swap of toSwap) {
          const {team, type, swapWith} = swap;
          if (pieceTeam === team && pieceType === type) {
            console.log("swapping");
            swapPieces(mutation.target, swapWith);
            toSwap.delete(swap);
            shouldContinue = true;
            break;
          }
        }
        if (shouldContinue) {continue;}
        if (pieceTeam === originalPieceTeam && pieceType === originalPieceType) {
          // no change required
        } else {
          // uh oh, need to swap!
          toSwap.add({
            team: originalPieceTeam,
            type: originalPieceType,
            swapWith: mutation.target
          });
        }
      }
      if (out.length) {
        /*console.log(out.map(mutation => {
          return [`${mutation.oldValue} --> ${mutation.target.className}`, mutation.target];
        }));*/
        // Check for any abnormalities and fix issues
        moveSquaresProcessed.clear();
        for (const mutation of attributeMutations) {
          const piecePosition = getPieceSquare(mutation.target.className),
            currentPiece = getPieceType(mutation.target.className).join(""),
            originalPiece = mutation.target.getAttribute("original-piece");
          if (piecePosition in moveSquaresProcessed) {continue;}
          moveSquaresProcessed.add(piecePosition);
          if (!currentPiece || !piecePosition) {continue;}
          if (currentPiece !== originalPiece) {
            const pieces = [...document.querySelectorAll(`[original-piece=${currentPiece}]`)];
            for (const piece of pieces) {
              const pieceOrignalPiece = piece.getAttribute("original-piece"),
                pieceCurrentPiece = getPieceType(piece.className).join("");
              if (pieceOrignalPiece !== pieceCurrentPiece) {
                console.log("Swapping #2", mutation.target, piece);
                swapPieces(piece, mutation.target);
                // swap original pieces also
                mutation.target.setAttribute("original-piece", pieceOrignalPiece);
                piece.setAttribute("original-piece", originalPiece);
                break;
              }
            }
          }
        }
      }
    });
    observer.observe(board, {
      childList: true,
      subtree: true,
      attributeFilter: ["class"],
      attributeOldValue: true
    });
    const existingPieces = board.querySelectorAll(".piece");
    for (const piece of existingPieces) {
      addPiece(piece);
    }

    // check if it is just a temporary board
    setTimeout(() => {
      if (!board.isConnected) {
        if (++tries > 10) {return;}
        setTimeout(init, 500);
      }
    }, 500)
  } else {
    if (++tries > 10) {return;}
    setTimeout(init, 500);
  }

  function swapPieces(a, b) {
    const myNumber = a.getAttribute("piece-number"),
      myOriginalPiece = a.getAttribute("original-piece");
    a.setAttribute("piece-number", b.getAttribute("piece-number"));
    a.setAttribute("original-piece", b.getAttribute("original-piece"));
    b.setAttribute("piece-number", myNumber);
    b.setAttribute("original-piece", myOriginalPiece);
    if (a.getAttribute("piece-number") === "null") addPiece(a);
    if (b.getAttribute("piece-number") === "null") addPiece(b);
  }
  function getPieceSquare(name) {
    const piece = name.split(" ").find(word => /^square/.test(word));
    return piece?.split("-")[1];
  }
  function getPieceType(name) {
    const piece = name.split(" ").find(word => word.length === 2 && /^[wb]/.test(word));
    return piece?.split("") || [];
  }
  function addPiece(piece) {
    console.log("new piece", piece)
    const colorPieces = piece.classList[1][0] === "w" ? pieces.white : pieces.black,
    actualPiece = piece.classList[1][1];
    if (typeof colorPieces[actualPiece] !== "number") {colorPieces[actualPiece] = 0;}
    colorPieces[actualPiece]++;
    piece.setAttribute("piece-number", colorPieces[actualPiece]);
    piece.setAttribute("original-piece", getPieceType(piece.className).join(""));
  }
  function removePiece(piece) {
    const colorPieces = piece.classList[1][0] === "w" ? pieces.white : pieces.black,
    actualPiece = piece.classList[1][1];
    if (typeof colorPieces[actualPiece] !== "number") {colorPieces[actualPiece] = 0;}
    colorPieces[actualPiece]--;
  }
}

init();
