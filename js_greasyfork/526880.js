// ==UserScript==
// @name         hackqd's Render Options {Zombia.io}
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Simple yet modern render options for zombia.io with draggable UI.
// @author       hackqd
// @match        *://zombia.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526880/hackqd%27s%20Render%20Options%20%7BZombiaio%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/526880/hackqd%27s%20Render%20Options%20%7BZombiaio%7D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let disableBackground = false;
    let disableProjectiles = false;
    let disableBuildings = false;
    let disableZombies = false;
    let disableScenery = false;
    let disablePlayers = false;

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = "grabbing";
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = (e.clientX - offsetX) + "px";
                element.style.top = (e.clientY - offsetY) + "px";
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = "grab";
        });
    }

    const settingsButton = document.createElement("div");
    settingsButton.innerHTML = "⚙️";
    settingsButton.style.position = "absolute";
    settingsButton.style.top = "10px";
    settingsButton.style.left = "10px";
    settingsButton.style.width = "40px";
    settingsButton.style.height = "40px";
    settingsButton.style.background = "#717d7e";
    settingsButton.style.color = "white";
    settingsButton.style.fontSize = "24px";
    settingsButton.style.textAlign = "center";
    settingsButton.style.lineHeight = "40px";
    settingsButton.style.borderRadius = "8px";
    settingsButton.style.cursor = "grab";
    settingsButton.style.zIndex = "1000";
    document.body.appendChild(settingsButton);
    makeDraggable(settingsButton);

    const settingsPanel = document.createElement("div");
    settingsPanel.style.position = "absolute";
    settingsPanel.style.top = "60px";
    settingsPanel.style.left = "10px";
    settingsPanel.style.padding = "15px";
    settingsPanel.style.background = "rgba(255, 255, 255, 0.1)";
    settingsPanel.style.backdropFilter = "blur(10px)";
    settingsPanel.style.borderRadius = "12px";
    settingsPanel.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.4)";
    settingsPanel.style.color = "white";
    settingsPanel.style.display = "none";
    settingsPanel.style.zIndex = "1000";
    settingsPanel.style.minWidth = "200px";
    settingsPanel.style.width = "auto";
    document.body.appendChild(settingsPanel);
    makeDraggable(settingsPanel);

    const title = document.createElement("div");
    title.innerText = "Render Options";
    title.style.fontSize = "18px";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "10px";
    settingsPanel.appendChild(title);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "grid";
    buttonContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    buttonContainer.style.gridGap = "10px";
    buttonContainer.style.marginBottom = "15px";
    settingsPanel.appendChild(buttonContainer);

    function createToggleButton(text, callback) {
        const button = document.createElement("button");
        button.innerText = text;
        button.style.padding = "8px 15px";
        button.style.background = "red";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        button.style.fontSize = "14px";
        button.style.transition = "background-color 0.3s";
        button.style.minWidth = "120px";
        button.style.outline = "none";
        button.addEventListener("click", callback);
        buttonContainer.appendChild(button);
        return button;
    }

    const toggleOptions = [
        { label: "Background", prop: "groundLayer" },
        { label: "Projectiles", prop: "projectiles" },
        { label: "Buildings", prop: "buildings" },
        { label: "Zombies", prop: "zombieLayer" },
        { label: "Scenery", prop: "scenery" },
        { label: "Players", prop: "players" }
    ];

    toggleOptions.forEach(option => {
        createToggleButton(`Stop Rendering ${option.label}`, function() {
            let prop = `disable${option.label}`;
            window[prop] = !window[prop];
            this.innerText = window[prop] ? `Start Rendering ${option.label}` : `Stop Rendering ${option.label}`;
            this.style.background = window[prop] ? "green" : "red";

            if (window.game && window.game.renderer && window.game.renderer[option.prop]) {
                window.game.renderer[option.prop].setVisible(!window[prop]);
            } else {
                console.warn(`${option.label} layer not found`);
            }
        });
    });

    settingsButton.addEventListener("click", function() {
        settingsPanel.style.display = (settingsPanel.style.display === "none") ? "block" : "none";
    });
})();
