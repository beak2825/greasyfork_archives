// ==UserScript==
// @name         Baby Blind Chess
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Lets you play baby blind chess on lichess.
// @author       SaberSpeed77
// @match        https://lichess.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455069/Baby%20Blind%20Chess.user.js
// @updateURL https://update.greasyfork.org/scripts/455069/Baby%20Blind%20Chess.meta.js
// ==/UserScript==

var numCircles = 1;
var colored = true;

var numInv = 1;

/*======= ↑ OPTIONS | CODE ↓ ======= */

var observer = new MutationObserver((mutations) => {
    let pieces = document.querySelector("cg-board").children;
    if (pieces.length == 32) {
        let randIdxs = [];

        let cirCount = 0;
        while (cirCount < numCircles) {
           let randIdx = Math.floor(Math.random() * pieces.length);
           if (!randIdxs.includes(randIdx)) {
               if (pieces[randIdx].cgPiece.includes("white"))
                   pieces[randIdx].style.backgroundImage = "url('https://raw.githubusercontent.com/lichess-org/lila/ebfb86d6800e644ca2c1e82d36b7927aa71c6655/public/piece/disguised/w.svg')";
               else
                   pieces[randIdx].style.backgroundImage = "url('https://raw.githubusercontent.com/lichess-org/lila/ebfb86d6800e644ca2c1e82d36b7927aa71c6655/public/piece/disguised/b.svg')";
               if (!colored) pieces[randIdx].style.backgroundImage = "url('https://i.imgur.com/YvdEvs1.png')";


               randIdxs.push(randIdx);
               cirCount += 1;
           }
        }

        let invCount = 0;
        while (invCount < numInv) {
            let randIdx = Math.floor(Math.random() * pieces.length);
            if (!randIdxs.includes(randIdx)) {
                pieces[randIdx].style.background = "url('')";
                randIdxs.push(randIdx);
                invCount +=1;
            }
        }
    observer.disconnect();
    $("square.selected").atr("style", "background-color: transparent !important"); // hides selected piece
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});
