// ==UserScript==
// @name         SpaceX Starship Smiley Doggo
// @namespace    http://www.linuxmint.ro/
// @version      1.2
// @description  Smiley Doggo for Starship flights! :D
// @author       Nicolae Crefelean
// @match        https://www.spacex.com/vehicles/starship/*
// @license      CC BY 4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425942/SpaceX%20Starship%20Smiley%20Doggo.user.js
// @updateURL https://update.greasyfork.org/scripts/425942/SpaceX%20Starship%20Smiley%20Doggo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = document.querySelector("#opacity > div");
    target.insertAdjacentHTML("beforeend", "<img src='https://i.imgur.com/SkEbA68.png' style='width: 100px;border-radius: 50px;margin-left: 40px;box-shadow: 2px 2px 15px #444;'>");
    target.insertAdjacentHTML("beforeend", "<img src='https://i.imgur.com/g1AmdDs.png' style='position: relative;width: 50px;left: -25px;top: 10px;'>");
})();