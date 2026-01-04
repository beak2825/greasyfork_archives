// ==UserScript==
// @name         dark mode for meow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for a game i like
// @author       sleepy
// @match        https://www.meowplayground.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393872/dark%20mode%20for%20meow.user.js
// @updateURL https://update.greasyfork.org/scripts/393872/dark%20mode%20for%20meow.meta.js
// ==/UserScript==

(function() {
    'use strict';

function changeBackground(color) {
   document.body.style.background = color;
}

window.addEventListener("load",function() { changeBackground('black') });
})();
document.getElementById("header").style.backgroundColor = "#080808";
document.getElementById("bottom-holder").style.backgroundColor = "#080808";
document.getElementById("chat").style.backgroundColor = "#6666ff";
document.getElementById("messages-list").style.backgroundColor = "#080808";
document.getElementById("friends-list").style.backgroundColor = "#6666ff";
document.getElementById("room-desc").style.backgroundColor = "#6666ff";

