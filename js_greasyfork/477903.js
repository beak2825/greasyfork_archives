// ==UserScript==
// @name         Dark Mode for MeowPlayground
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Color #4
// @author       Picky Panda
// @match        https://www.meowplayground.com/game
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/477903/Dark%20Mode%20for%20MeowPlayground.user.js
// @updateURL https://update.greasyfork.org/scripts/477903/Dark%20Mode%20for%20MeowPlayground.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function changeBackground(color) {
   document.body.style.background = color;
}
 
window.addEventListener("load",function() { changeBackground('gray') });
})();
document.getElementById("header").style.backgroundColor = "#363636";
document.getElementById("bottom-holder").style.backgroundColor = "#363636";
document.getElementById("chat").style.backgroundColor = "#363636";
document.getElementById("messages-list").style.backgroundColor = "#363636";
document.getElementById("friends-list").style.backgroundColor = "#363636";
document.getElementById("room-desc").style.backgroundColor = "#363636";