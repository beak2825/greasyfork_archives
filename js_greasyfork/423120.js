// ==UserScript==
// @name Lichess 1 Kbyte Gambit piece set & board
// @namespace https://greasyfork.org/users/680946
// @version 1.0.0
// @description The pink board and the piece set for Lichess
// @grant GM_addStyle
// @run-at document-start
// @match *://*.lichess.org/*
// @downloadURL https://update.greasyfork.org/scripts/423120/Lichess%201%20Kbyte%20Gambit%20piece%20set%20%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/423120/Lichess%201%20Kbyte%20Gambit%20piece%20set%20%20board.meta.js
// ==/UserScript==

(function() {
let css = `
/* 
Created by Ka 
https://github.com/Ka-hu
*/

/* BOARD */
.pink .is2d cg-board {background-image: url("https://i.imgur.com/ILauYLS.png");}


/* PIECES */
.is2d .pawn.white {background-image: url("https://i.imgur.com/xURuYLt.png");}
.is2d .rook.white {background-image: url("https://i.imgur.com/eUcLbyJ.png");}
.is2d .knight.white {background-image: url("https://i.imgur.com/VR1pTyD.png");}
.is2d .bishop.white {background-image: url("https://i.imgur.com/tntAfms.png");}
.is2d .queen.white {background-image: url("https://i.imgur.com/55UWBZ5.png");}
.is2d .king.white {background-image: url("https://i.imgur.com/ZmN4djl.png");}


.is2d .pawn.black {background-image: url("https://i.imgur.com/IEg0DCj.png");}
.is2d .rook.black {background-image: url("https://i.imgur.com/WuVI9KS.png");}
.is2d .knight.black {background-image: url("https://i.imgur.com/mUYDMlq.png");}
.is2d .bishop.black {background-image: url("https://i.imgur.com/Mvfnpnu.png");}
.is2d .queen.black {background-image: url("https://i.imgur.com/rm97Y4r.png");}
.is2d .king.black {background-image: url("https://i.imgur.com/H0BsQFN.png");}

/* SQUARE/SELECT MARKERS */
square.last-move {background: none;border: 3px solid rgb(0, 230, 230);}
square.move-dest {background: radial-gradient(rgb(0, 230, 230) 19%, rgba(0,0,0,0) 20%);}
square.move-dest:hover {background-color: rgba(0, 230, 230, .2);border: 2px dashed #00e6e6;}
square.selected {background:none;border: 6px dotted #00e6e6;}
square.oc.move-dest {background: radial-gradient(transparent 0%, transparent 79%, #00e6e6 40%);}

/* MOUSE CURSOR */
.manipulable cg-board {cursor: crosshair;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
