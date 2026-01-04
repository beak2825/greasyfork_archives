// ==UserScript==
// @name         fart epic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  slither io shows coords
// @author       Fardo
// @match        http://slither.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437626/fart%20epic.user.js
// @updateURL https://update.greasyfork.org/scripts/437626/fart%20epic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playButton = document.querySelector(".sadu1");
    var snakeX = 0;
    var snakeY = 0;
    window.addEventListener("click", function() {
        var para = document.createElement("DIV");
        para.innerText = "Your Coordinates are";
        para.className += "nsi";
        para.style.cssText = "position: fixed; left: 8px; top: 4px; width: 300px; height: 228px; color: rgb(255, 255, 255); font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 13px; overflow: hidden; overflow-wrap: break-word; opacity: 1; z-index: 7; display: inline; cursor: default; transform: translateZ(0px);";
        document.body.appendChild(para);
        setInterval(function() {
            snakeX = window.snake.xx;
            snakeY = window.snake.yy;
            para.innerText = "Your Coordinates are (" + snakeX + ", " + snakeY + ")";
        })
    });
})();