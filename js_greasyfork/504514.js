// ==UserScript==
// @name         Detect Gamemode
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  try to take over the world!
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504514/Detect%20Gamemode.user.js
// @updateURL https://update.greasyfork.org/scripts/504514/Detect%20Gamemode.meta.js
// ==/UserScript==

let gamemode;
function check_gamemode (){
    gamemode = document.querySelector("#gamemode-selector > div > div.selected > div.dropdown-label").innerHTML;;
    window.gm = gamemode;
    console.log(gamemode);
}

setInterval(check_gamemode, 100);