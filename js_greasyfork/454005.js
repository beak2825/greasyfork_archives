// ==UserScript==
// @name         Chess.com Game Preview Styling
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Applies custom styling to Chess.com board components.
// @author       SaberSpeed77
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454005/Chesscom%20Game%20Preview%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/454005/Chesscom%20Game%20Preview%20Styling.meta.js
// ==/UserScript==
 
const imgs = new Map([
  /* White Pieces */
  ["wp", ""],
  ["wn", ""],
  ["wb", ""],
  ["wr", ""],
  ["wq", ""],
  ["wk", ""],

  /* Black Pieces */
  ["bp", ""],
  ["bn", ""],
  ["bb", ""],
  ["br", ""],
  ["bq", ""],
  ["bk", ""],
]);

/* Background */
const background = "";

/*========= ↑ STYLE / CODE ↓ =========*/

const styleElement = document.createElement("style");
const CSS = `
*:not(svg) {
  --theme-piece-set-wp: url(${imgs.get("wp")});
  --theme-piece-set-wn: url(${imgs.get("wn")});
  --theme-piece-set-wb: url(${imgs.get("wb")});
  --theme-piece-set-wr: url(${imgs.get("wr")});
  --theme-piece-set-wq: url(${imgs.get("wq")});
  --theme-piece-set-wk: url(${imgs.get("wk")});

  --theme-piece-set-bp: url(${imgs.get("bp")});
  --theme-piece-set-bn: url(${imgs.get("bn")});
  --theme-piece-set-bb: url(${imgs.get("bb")});
  --theme-piece-set-br: url(${imgs.get("br")});
  --theme-piece-set-bq: url(${imgs.get("bq")});
  --theme-piece-set-bk: url(${imgs.get("bk")});

  --theme-board-style-image: url(${background});
}
`

styleElement.appendChild(document.createTextNode(CSS));
document.head.appendChild(styleElement);