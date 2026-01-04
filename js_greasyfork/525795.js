// ==UserScript==
// @name         BFDIA 5b Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Mod menu to change level progress, deaths, win tokens, and additional features in BFDIA 5b
// @author       BakedCake
// @match        https://coppersalts.github.io/HTML5b/
// @license      CC BY-ND 4.0 - See below
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525795/BFDIA%205b%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/525795/BFDIA%205b%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "10px";
    menu.style.left = "10px";
    menu.style.padding = "10px";
    menu.style.border = "2px solid white";
    menu.style.fontFamily = "Arial, sans-serif";
    menu.style.zIndex = "9999";
    menu.style.borderRadius = "8px";
    menu.style.width = "300px";
    menu.style.cursor = "move";
    menu.style.userSelect = "none";
    menu.style.transition = "all 0.3s ease-in-out";

    function updateTheme() {
        let hour = new Date().getHours();
        if (hour >= 7 && hour < 19) {
            menu.style.background = "rgba(255, 255, 255, 0.9)";
            menu.style.color = "black";
            menu.style.border = "2px solid black";
        } else {
            menu.style.background = "rgba(0, 0, 0, 0.8)";
            menu.style.color = "white";
            menu.style.border = "2px solid white";
        }
    }

    updateTheme();
    setInterval(updateTheme, 60000);

    let isDragging = false;
    let offsetX, offsetY;

    menu.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    let closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to close the mod menu?")) {
            menu.remove();
        }
    });
    menu.appendChild(closeButton);

    let title = document.createElement("h3");
    title.innerText = "BFDIA 5b Mod Menu";
    title.style.margin = "0 0 10px 0";
    title.style.textAlign = "center";
    menu.appendChild(title);

    let inputLevel = document.createElement("input");
    inputLevel.type = "number";
    inputLevel.placeholder = "Enter level...";
    inputLevel.style.width = "100%";
    inputLevel.style.marginBottom = "5px";
    menu.appendChild(inputLevel);

    let buttonLevel = document.createElement("button");
    buttonLevel.innerText = "Set Level";
    buttonLevel.style.width = "100%";
    buttonLevel.style.cursor = "pointer";
    menu.appendChild(buttonLevel);

    let inputDeath = document.createElement("input");
    inputDeath.type = "number";
    inputDeath.placeholder = "Enter deaths...";
    inputDeath.style.width = "100%";
    inputDeath.style.marginBottom = "5px";
    menu.appendChild(inputDeath);

    let buttonDeath = document.createElement("button");
    buttonDeath.innerText = "Set Deaths";
    buttonDeath.style.width = "100%";
    buttonDeath.style.cursor = "pointer";
    menu.appendChild(buttonDeath);

    let levelDisplay = document.createElement("p");
    levelDisplay.style.marginTop = "10px";
    levelDisplay.style.textAlign = "center";
    menu.appendChild(levelDisplay);

    let unlockButton = document.createElement("button");
    unlockButton.innerText = "Unlock all levels";
    unlockButton.style.width = "100%";
    unlockButton.style.cursor = "pointer";
    unlockButton.style.marginTop = "5px";
    menu.appendChild(unlockButton);

    let winTokenButton = document.createElement("button");
    winTokenButton.innerText = "Collect all Win Tokens";
    winTokenButton.style.width = "100%";
    winTokenButton.style.cursor = "pointer";
    winTokenButton.style.marginTop = "5px";
    menu.appendChild(winTokenButton);

    let wipeDataButton = document.createElement("button");
    wipeDataButton.innerText = "Wipe Data";
    wipeDataButton.style.width = "100%";
    wipeDataButton.style.cursor = "pointer";
    wipeDataButton.style.marginTop = "5px";
    menu.appendChild(wipeDataButton);

    function updateLevelDisplay() {
        let currentProgress = localStorage.getItem('levelProgress') || "0";
        let currentDeaths = localStorage.getItem('deathCount') || "0";
        levelDisplay.innerText = `Level Progress: ${currentProgress} | Deaths: ${currentDeaths}`;
    }

    buttonLevel.addEventListener("click", function() {
        let newValue = inputLevel.value;
        if (newValue !== "") {
            localStorage.setItem('levelProgress', newValue);
            updateLevelDisplay();
        }
    });

    buttonDeath.addEventListener("click", function() {
        let newValue = inputDeath.value;
        if (newValue !== "") {
            localStorage.setItem('deathCount', newValue);
            updateLevelDisplay();
        }
    });

    unlockButton.addEventListener("click", function() {
        localStorage.setItem('levelProgress', "53");
        updateLevelDisplay();
    });

    winTokenButton.addEventListener("click", function() {
        localStorage.setItem('gotCoin', 'true,'.repeat(53).slice(0, -1));
    });

    wipeDataButton.addEventListener("click", function() {
        localStorage.clear();
        updateLevelDisplay();
    });

    let credits = document.createElement("p");
    credits.innerHTML = "Thanks to <a href='https://www.youtube.com/@minechat638' target='_blank'>@minechat638</a> | <a href='https://www.youtube.com/@bakedcake02' target='_blank'>BakedCake</a>";
    credits.style.textAlign = "center";
    credits.style.marginTop = "10px";
    menu.appendChild(credits);

    updateLevelDisplay();
    document.body.appendChild(menu);
})();
