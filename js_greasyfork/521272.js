// ==UserScript==
// @name         mine-craft.io coordinates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ez coordinates for mine-craft.io!
// @author       xDD scripter
// @match        *://mine-craft.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521272/mine-craftio%20coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/521272/mine-craftio%20coordinates.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Добавляем кнопку для вывода всех доступных объектов
    const debugButton = document.createElement("button");
    debugButton.textContent = "Log All Objects";
    debugButton.style.position = "fixed";
    debugButton.style.top = "10px";
    debugButton.style.right = "10px";
    debugButton.style.zIndex = "9999";
    debugButton.style.padding = "10px";
    debugButton.style.backgroundColor = "#ff6347";
    debugButton.style.color = "white";
    debugButton.style.border = "none";
    debugButton.style.borderRadius = "5px";
    debugButton.style.cursor = "pointer";
    document.body.appendChild(debugButton);

    debugButton.addEventListener("click", () => {
        console.log("=== Debugging Game Objects ===");
        console.log("Window keys:", Object.keys(window));
        if (window.Game) {
            console.log("Game object keys:", Object.keys(window.Game));
            console.log("Player object keys:", window.Game.player ? Object.keys(window.Game.player) : "No player found");
        } else {
            console.log("Game object not found.");
        }
    });
})();
