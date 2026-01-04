// ==UserScript==
// @name         mgcmFS - Play Magicami in Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a fullscreen button to browser-based versions of Magicami. Akisa best girl!
// @author       xnapx
// @match        https://api.magicami.jp/Top/Main*
// @match        https://api.magicami.johren.games/*
// @match        https://en-api.magicami.johren.games/Top/Main*
// @match        https://tw-api.magicami.johren.games/Top/Main*
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/443986/mgcmFS%20-%20Play%20Magicami%20in%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/443986/mgcmFS%20-%20Play%20Magicami%20in%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var gameContainer = document.getElementById('gameContainer');
    var fs_button = document.createElement('button');
    fs_button.type = 'button';
    fs_button.style.fontSize = '1em';
    fs_button.style.color = 'white';
    fs_button.style.backgroundColor = 'black';
    fs_button.style.display = 'relative';
    fs_button.style.float = 'right';
    fs_button.style.padding = '10px 8px 4px';
    fs_button.style.margin = '-8px 0px 5px';
    fs_button.style.border = '2px solid purple';
    fs_button.style.borderRadius = '8px';
    fs_button.innerHTML = 'Fullscreen';
    fs_button.onclick = () => { gameInstance.SetFullscreen(1); };
    gameContainer.appendChild(fs_button);
})();