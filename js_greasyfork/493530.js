// ==UserScript==
// @name         Mr.Penguin Visuales (Official)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Personaliza las visuales en moomoo.io y sandbox.moomoo.io
// @author       Mr.Penguin
// @match        https://*.moomoo.io/*
// @match        https://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493530/MrPenguin%20Visuales%20%28Official%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493530/MrPenguin%20Visuales%20%28Official%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ctxx = CanvasRenderingContext2D;
    var visualsEnabled = true;

    function toggleVisuals() {
        visualsEnabled = !visualsEnabled;
        updateVisuals();
        updateButton();
    }

    function toggleMenu() {
        var menu = document.getElementById("visualsMenu");
        menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
    }

    function handleKeyPress(event) {
        if (event.key === "Escape") {
            toggleMenu();
        }
    }

    function updateVisuals() {
        if (ctxx.prototype.roundRect) {
            ctxx.prototype.roundRect = ((func) => function() {
                if (visualsEnabled) {
                    if (this.fillStyle === "#8ecc51") { // Allies (green)
                        this.fillStyle = "rgba(224, 255, 255, 0.7)"; // Light blue with slight transparency
                    } else if (this.fillStyle === "#cc5151") { // Enemies (red)
                        this.fillStyle = "rgba(65, 105, 225, 0.7)"; // Intense blue with slight transparency
                    } else if (this.fillStyle === "#3d3f42") { // Health bar background (gray)
                        this.fillStyle = "rgba(66, 66, 66, 0.7)"; // Gray with slight transparency
                    }
                } else {
                    if (this.fillStyle === "rgba(224, 255, 255, 0.7)") { // Light blue
                        this.fillStyle = "#8ecc51"; // Allies (green)
                    } else if (this.fillStyle === "rgba(65, 105, 225, 0.7)") { // Intense blue
                        this.fillStyle = "#cc5151"; // Enemies (red)
                    } else if (this.fillStyle === "rgba(66, 66, 66, 0.7)") { // Gray
                        this.fillStyle = "#3d3f42"; // Health bar background (gray)
                    }
                }
            })(ctxx.prototype.roundRect);
        }
    }

    function updateButton() {
        var button = document.getElementById("visualsToggle");
        if (visualsEnabled) {
            button.textContent = "Health Bar Visual (Activado)";
            button.style.backgroundColor = "#00FF00"; // Verde
            button.style.color = "#FFFFFF"; // Blanco
        } else {
            button.textContent = "Health Bar Visual (Desactivado)";
            button.style.backgroundColor = ""; // Volver al color predeterminado
            button.style.color = ""; // Volver al color predeterminado
        }
    }

    // Add menu for toggling visuals
    var menu = document.createElement("div");
    menu.id = "visualsMenu";
    menu.style = "position: fixed; top: 10px; right: 10px; background-color: rgba(255, 255, 255, 0.5); padding: 10px; border-radius: 5px; z-index: 999; display: block;";
    menu.innerHTML = `
        <button id="visualsToggle">${visualsEnabled ? "Health Bar Visual (Activado)" : "Health Bar Visual (Desactivado)"}</button>
    `;
    document.body.appendChild(menu);

    document.getElementById("visualsToggle").addEventListener("click", function() {
        toggleVisuals();
    });

    document.addEventListener("keydown", function(event) {
        handleKeyPress(event);
    });

    updateVisuals();
})();
