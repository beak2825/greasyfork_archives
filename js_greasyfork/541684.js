// ==UserScript==
// @name         autosalir de sala por no dibujar despues de 100s
// @namespace    https://greasyfork.org
// @version      1.0
// @description  te saca del juego cuando no dibujas por 100segundos
// @match        *://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541684/autosalir%20de%20sala%20por%20no%20dibujar%20despues%20de%20100s.user.js
// @updateURL https://update.greasyfork.org/scripts/541684/autosalir%20de%20sala%20por%20no%20dibujar%20despues%20de%20100s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const leaveAfter = 100000; // 100 seconds in milliseconds
    let drawingStarted = false;
    let leaveTimeout = null;

    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let lastImageData = null;

    function hasDrawn() {
        if (!lastImageData) return false;

        const current = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < current.length; i += 4) {
            if (current[i] !== lastImageData[i]) {
                return true;
            }
        }
        return false;
    }

    function monitorDrawing() {
        lastImageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        drawingStarted = false;

        // Clear previous timer if any
        if (leaveTimeout) clearTimeout(leaveTimeout);

        leaveTimeout = setTimeout(() => {
            if (!drawingStarted) {
                alert("You didn't draw anything for 100 seconds. Leaving the game...");
                const leaveButton = [...document.querySelectorAll("button")].find(btn => btn.textContent.toLowerCase().includes("leave"));
                if (leaveButton) leaveButton.click();
            }
        }, leaveAfter);
    }

    // Detect when it's your turn to draw
    const turnObserver = new MutationObserver(() => {
        const wordElement = document.querySelector(".word-chooser, .drawer-word");
        if (wordElement) {
            console.log("🎨 It's your turn to draw. Timer started.");
            monitorDrawing();
        }
    });

    turnObserver.observe(document.body, { childList: true, subtree: true });

    // Monitor drawing activity
    canvas.addEventListener("mousedown", () => {
        drawingStarted = true;
        if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            console.log("✅ Drawing detected. Canceling auto-leave.");
        }
    });
})();