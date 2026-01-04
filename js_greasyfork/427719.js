// ==UserScript==
// @name         Orange color for Meow Playground
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Color #2
// @author       Picky Panda
// @match        https://www.meowplayground.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427719/Orange%20color%20for%20Meow%20Playground.user.js
// @updateURL https://update.greasyfork.org/scripts/427719/Orange%20color%20for%20Meow%20Playground.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function changeBackground(color) {
   document.body.style.background = color;
}
 
window.addEventListener("load",function() { changeBackground('orange') });
})();
document.getElementById("header").style.backgroundColor = "#FFA500";
document.getElementById("bottom-holder").style.backgroundColor = "#FFA500";
document.getElementById("chat").style.backgroundColor = "#FFA500";
document.getElementById("messages-list").style.backgroundColor = "#FF8C00";
document.getElementById("friends-list").style.backgroundColor = "#FFD700";
document.getElementById("room-desc").style.backgroundColor = "#FFA500";