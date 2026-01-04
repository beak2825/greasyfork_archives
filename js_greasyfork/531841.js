// ==UserScript==
// @name         Hax Killer Visuals Only
// @namespace    none
// @version      1.1
// @description  Visuals from the Hax Killer mod for MooMoo.io, updated to "Hax Legit".
// @author       VisualsOnly
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531841/Hax%20Killer%20Visuals%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/531841/Hax%20Killer%20Visuals%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Hax Killer Visuals Loaded");

    // Apply custom background to the main menu
    const mainMenu = document.getElementById("mainMenu");
    if (mainMenu) {
        mainMenu.style.backgroundImage = "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW__q_hiNTduWCXL2JdSKgqbI-ZhdOegRusQ&s')";
        mainMenu.style.backgroundRepeat = "repeat";
        mainMenu.style.backgroundSize = "contain";
        console.log("Custom main menu background applied.");
    }

    // Custom colors for loading text
    const loadingText = document.getElementById("loadingText");
    if (loadingText) {
        loadingText.style.color = "#880808";
        loadingText.style.textShadow = "#880808 -2px -2px 10px, purple 0px -5px 1px, purple 0px -5px 10px";
        console.log("Custom loading text applied.");
    }

    // Game name styling (Updated to "Hax Legit")
    const gameNameElement = document.getElementById("gameName");
    if (gameNameElement) {
        gameNameElement.textContent = "Hax Legit"; // Updated game name
        gameNameElement.style.backgroundImage = "linear-gradient(to right, red, yellow)";
        gameNameElement.style.WebkitBackgroundClip = "text";
        gameNameElement.style.color = "transparent";
        gameNameElement.style.textShadow = "0 0 2px #880808, 0 0 5px red";
        gameNameElement.style.webkitTextFillColor = "transparent";
        gameNameElement.style.webkitTextStroke = "1px black";
        console.log("Game name updated to 'Hax Legit'.");
    }

    // Custom player skin colors
    const config = window.config || {};
    config.skinColors = [
        "#bf8f54", "#4c4c4c", "#896c4b",
        "#fadadc", "#ececec", "#c37373",
        "#000000", "#ecaff7", "#738cc3",
        "#8bc373", "#91b2db"
    ];
    console.log("Custom player skin colors applied.");

    // Set custom CSS for UI elements
    const style = document.createElement("style");
    style.innerHTML = `
        #gameUI .joinAlBtn, a {
            animation: 5s infinite linear both normal rainbow;
        }

        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }

        .menuCard {
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            border: 3px solid cyan;
            padding: 20px;
            color: white;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .menuB {
            text-align: center;
            background-color: rgba(0, 0, 0, 0.55);
            color: #000;
            border: none;
            border-radius: 4px;
            padding: 4px 4px;
            cursor: pointer;
            transition: 0.3s ease;
        }

        .menuB:hover {
            background-color: red;
            color: #000;
        }

        .menuB:active {
            transform: translateY(1px);
        }

        .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            border: 16px solid #333;
            border-radius: 50%;
            border-top: 16px solid #181818;
            width: 60px;
            height: 60px;
            animation: spin 0.5s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    console.log("Custom UI styles applied.");
})();
