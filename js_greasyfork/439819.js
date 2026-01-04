// ==UserScript==
// @name         Wordle Unlimited - Word Reveal Hack
// @namespace    q1k
// @version      1.0.1
// @description  The script shows the current word below the game, simply hover over the grey area and it will show you the current word. Brag to your friends that you can solve any word no matter the size on the first try. Need autosolving and stats editing? Try my other script https://greasyfork.org/en/scripts/439732-
// @author       q1k
// @match        *://www.wordleunlimited.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439819/Wordle%20Unlimited%20-%20Word%20Reveal%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439819/Wordle%20Unlimited%20-%20Word%20Reveal%20Hack.meta.js
// ==/UserScript==

var mydiv = document.createElement("div");
mydiv.setAttribute("id","word-reveal");
var styles = document.createElement("style");
styles.innerHTML="#word-reveal{user-select:none;text-align:center;background:#555;color:#555;} #word-reveal:hover{color:white;} .game-id{display:none;}";
document.body.appendChild(styles);
document.querySelector(".Game").appendChild(mydiv);
var target = document.querySelector(".game-id");
var observer = new MutationObserver(function(mutations) {
    mydiv.innerHTML = "Current word: "+atob(document.querySelector(".game-id").childNodes[1].textContent).toUpperCase();
});
var config = { characterData: true, attributes: false, childList: false, subtree: true };
observer.observe(target, config);
mydiv.innerHTML = "Current word: "+atob(document.querySelector(".game-id").childNodes[1].textContent).toUpperCase();

