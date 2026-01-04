// ==UserScript==
// @name         fisher crosshair
// @namespace    http://tampermonkey.net/
// @version      2024-03-30
// @description  cyrex i amde out of your fisher emoji form dc so yeah
// @author       TEXTURESHEEP
// @match        http://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/3/3e/Blox.pl_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491285/fisher%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/491285/fisher%20crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

function myFunction() {
const myCrosshair = document.querySelector("#root > div.WholeAppWrapper > div > div.CrossHair")
if (myCrosshair) {
myCrosshair.textContent = '🎣';
      }
const annoyingIcons = document.querySelector("#root > div.WholeAppWrapper > div > div.BottomLeftIcons");
if (annoyingIcons) {
annoyingIcons.style.display = "none";
annoyingIcons.style.visibility = 'hidden';
    }
const annoyingIcons2 = document.querySelector("#root > div.WholeAppWrapper > div > div.TopRightElements")
if (annoyingIcons2) {
annoyingIcons2.style.display = "none";
annoyingIcons2.style.visibility = 'hidden';
     }
}

setInterval(myFunction, 1000)

const cpsCounter = document.querySelector("body > div:nth-child(10)")
if (cpsCounter) {
cpsCounter.style.fontSize = '40px';
}