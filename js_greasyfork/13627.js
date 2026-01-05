// ==UserScript==
// @name        Lichess Chess.com Graphic Pack
// @namespace   http://example.com
// @description gg
// @include     http://*.lichess.org/*
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13627/Lichess%20Chesscom%20Graphic%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/13627/Lichess%20Chesscom%20Graphic%20Pack.meta.js
// ==/UserScript==
 
 

 
 
 



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};







addGlobalStyle('piece.knight.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bn.png")!important;} ');
addGlobalStyle('piece.bishop.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bb.png")!important;} ');
addGlobalStyle('piece.queen.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bq.png")!important;} ');
addGlobalStyle('piece.rook.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/br.png")!important;} ');
addGlobalStyle('piece.pawn.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bp.png")!important;} ');
addGlobalStyle('piece.king.black { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/bk.png")!important;} ');
addGlobalStyle('piece.knight.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wn.png")!important;} ');
addGlobalStyle('piece.bishop.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wb.png")!important;} ');
addGlobalStyle('piece.queen.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wq.png")!important;} ');
addGlobalStyle('piece.rook.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wr.png")!important;} ');
addGlobalStyle('piece.pawn.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wp.png")!important;} ');
addGlobalStyle('piece.king.white { background-image: url("http://images.chesscomfiles.com/chess-themes/pieces/classic/80/wk.png")!important;} ');


addGlobalStyle('.cg-board { background-image: url("http://images.chesscomfiles.com/chess-themes/boards/translucent/80.png")!important;} ');

addGlobalStyle('square.last-move { background-color:rgba(255, 0, 0, 0.41) !important;box-sizing:border-box;border:2px solid red;} ');

addGlobalStyle('square.check {background-color:red !important;}');






$('.cg-board').css({"border-color": "#ccc", 
             "border-width":"5px", 
               "border-style":"solid"});



               
               
      