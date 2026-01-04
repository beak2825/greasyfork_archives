// ==UserScript==
// @name         DogeChess
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Doge pieces
// @author       Firecreper2
// @match        https://www.chess.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/425584/DogeChess.user.js
// @updateURL https://update.greasyfork.org/scripts/425584/DogeChess.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pawn = document.createElement("img");
    let rook = document.createElement("img");
    let bishop = document.createElement("img");
    let knight = document.createElement("img");
    let king = document.createElement("img");
    let queen = document.createElement("img");

    pawn.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogepawn.png";
    pawn.width = 100
    pawn.height = 110
    pawn.draggable = false

    rook.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogerook.png";
    rook.width = 100
    rook.height = 110
    rook.draggable = false

    bishop.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogebishop.png";
    bishop.width = 100
    bishop.height = 110
    bishop.draggable = false

    knight.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogeknight.png";
    knight.width = 100
    knight.height = 110
    knight.draggable = false

    king.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogeking.png";
    king.width = 100
    king.height = 110
    king.draggable = false

    queen.src = "https://raw.githubusercontent.com/Firecreper2/DogeChess/main/dogequeen.png";
    queen.width = 100
    queen.height = 110
    queen.draggable = false

    let loop = setInterval((e)=>{
        let pawnList = []
        let bishopList = []
        let rookList = []
        let knightList = []
        for(let i = 0; i <= document.getElementsByClassName("wp").length - 1; i++){
            pawnList[i] = pawn.cloneNode()
            document.getElementsByClassName("wp")[i].appendChild(pawnList[i])
        }
        for(let i = 0; i <= document.getElementsByClassName("wb").length - 1; i++){
            bishopList[i] = bishop.cloneNode()
            document.getElementsByClassName("wb")[i].appendChild(bishopList[i])
        }
        for(let i = 0; i <= document.getElementsByClassName("wr").length - 1; i++){
            rookList[i] = rook.cloneNode()
            document.getElementsByClassName("wr")[i].appendChild(rookList[i])
        }
        for(let i = 0; i <= document.getElementsByClassName("wn").length - 1; i++){
            knightList[i] = knight.cloneNode()
            document.getElementsByClassName("wn")[i].appendChild(knightList[i])
        }
        for(let i = 0; i <= document.getElementsByClassName("wq").length - 1; i++){
            document.getElementsByClassName("wq")[i].appendChild(queen);
        }
        for(let i = 0; i <= document.getElementsByClassName("wk").length - 1; i++){
            document.getElementsByClassName("wk")[i].appendChild(king);
        }
    }, 1000)
    })();