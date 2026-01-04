// ==UserScript==
// @name         Red color for Meow Playground
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Color #1
// @author       Picky Panda
// @match        https://www.meowplayground.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427710/Red%20color%20for%20Meow%20Playground.user.js
// @updateURL https://update.greasyfork.org/scripts/427710/Red%20color%20for%20Meow%20Playground.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function changeBackground(color) {
   document.body.style.background = color;
}
 
window.addEventListener("load",function() { changeBackground('red') });
})();
document.getElementById("header").style.backgroundColor = "#FF0000";
document.getElementById("bottom-holder").style.backgroundColor = "#FF0000";
document.getElementById("chat").style.backgroundColor = "#FF0000";
document.getElementById("messages-list").style.backgroundColor = "#FF0000";
document.getElementById("friends-list").style.backgroundColor = "#FFA500";
document.getElementById("room-desc").style.backgroundColor = "#FF0000";