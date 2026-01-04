// ==UserScript==
// @name         Test
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  This is violet, great vibe color. 
// @author       Picky Panda
// @match        https://www.meowplayground.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427169/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/427169/Test.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
function changeBackground(color) {
   document.body.style.background = color;
}
 
window.addEventListener("load",function() { changeBackground('purple') });
})();
document.getElementById("buttons-holder").style.backgroundColor = "#FFFF00";