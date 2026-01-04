// ==UserScript==
// @name         Chess.com Custom Pieces
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  A simple JavaScript project where it changes the pieces of chess.com with anything you want!
// @author       SkidFace
// @match        https://www.chess.com/*
// @icon         https://www.dictionary.com/e/wp-content/uploads/2020/02/uwu_800x800-300x300.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441841/Chesscom%20Custom%20Pieces.user.js
// @updateURL https://update.greasyfork.org/scripts/441841/Chesscom%20Custom%20Pieces.meta.js
// ==/UserScript==

//IMPORTANT!!!

//To use and modify this script to replace the images, simply replace the inside of the "url()" component of that const with a link to the image
//For example, if I wanted to change the White King piece to an UwU face, you would change line 34 to:

//const whiteKing = "url(https://avaazdo.s3.amazonaws.com/original_5ccdb9b8604f2.jpg)"


const blackPawn = "url()";
const blackRook = "url()";
const blackKnight = "url()";
const blackBishop = "url()";
const blackQueen = "url()";
const blackKing = "url()";


const whitePawn = "url()";
const whiteRook = "url()";
const whiteKnight = "url()";
const whiteBishop = "url()";
const whiteQueen = "url()";
const whiteKing = "url()";

//You do not need to change anything below. All you need to do is change the code above.


window.addEventListener('load', function() {
        //black pieces
    changePiece("bp", blackPawn);
    changePiece("br", blackRook);
    changePiece("bn", blackKnight);
    changePiece("bb", blackBishop);
    changePiece("bq", blackQueen);
    changePiece("bk", blackKing);

    //white pieces
    changePiece("wp", whitePawn);
    changePiece("wr", whiteRook);
    changePiece("wn", whiteKnight);
    changePiece("wb", whiteBishop);
    changePiece("wq", whiteQueen);
    changePiece("wk", whiteKing);
});

function changePiece(piece, url){
    for (let i = 0; i < document.getElementsByClassName(piece).length; i++) {
        document.getElementsByClassName(piece)[i].style.backgroundImage = url;
    }
}