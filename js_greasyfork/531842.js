// ==UserScript==
// @name         Godmod visuals
// @namespace    https://omgy.dev
// @uthor         OMGY and HaxBountyHunter
// @version      v1.2
// @license      MIT
// @description  dMN - UI Geliştirmesi: Combat'e Auto Push, yeni ayarlar (spike hesaplama süresi, hız, mod), AutoMill (Shift+M ile tetiklenecek) ve Misc içinde Visuals (Night Mode, Spike Ayarları, Blur) eklendi.
// @match        *://*.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531842/Godmod%20visuals.user.js
// @updateURL https://update.greasyfork.org/scripts/531842/Godmod%20visuals.meta.js
// ==/UserScript==
(function () {
    'use strict';

    console.log("Purple and Gold Visuals Loaded");

    // Apply custom background to the main menu
    const mainMenu = document.getElementById("mainMenu");
    if (mainMenu) {
        mainMenu.style.backgroundImage = "url('file:///C:/Users/cgranger9/Downloads/God%20Mod.png')";
        mainMenu.style.backgroundRepeat = "repeat";
        mainMenu.style.backgroundSize = "contain";
        console.log("Custom main menu background applied.");
    }

    // Custom colors for loading text (purple filling with gold outline)
    const loadingText = document.getElementById("loadingText");
    if (loadingText) {
        loadingText.style.color = "#800080"; // Purple
        loadingText.style.textShadow = "#FFD700 -2px -2px 10px, #FFD700 0px -5px 1px, #FFD700 0px -5px 10px"; // Gold shadow
        console.log("Custom loading text applied.");
    }

    // Game name styling (Updated to "Hax Legit")
    const gameNameElement = document.getElementById("gameName");
    if (gameNameElement) {
        gameNameElement.textContent = "God Mod"; // Updated game name
        gameNameElement.style.backgroundImage = "linear-gradient(to right, #800080, #FFD700)"; // Purple to Gold gradient
        gameNameElement.style.WebkitBackgroundClip = "text";
        gameNameElement.style.color = "transparent";
        gameNameElement.style.textShadow = "0 0 2px #800080, 0 0 5px #FFD700"; // Purple to Gold shadow
        gameNameElement.style.webkitTextFillColor = "transparent";
        gameNameElement.style.webkitTextStroke = "1px #FFD700"; // Gold outline
        console.log("Game name updated to 'God Mod' with purple and gold styling.");
    }

    // Custom player skin colors (purple filling with gold outline)
    const config = window.config || {};
    config.skinColors = [
        "#800080", "#800080", "#800080", // Purple skin
        "#FFD700", "#FFD700", "#FFD700", // Gold skin
        "#800080", "#FFD700", "#800080", // Alternating purple and gold
        "#FFD700", "#800080", "#FFD700" // Alternating purple and gold
    ];
    console.log("Custom player skin colors (purple and gold) applied.");

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
            background-color: rgba(128, 0, 128, 0.25); /* Purple background */
            border-radius: 4px;
            border: 3px solid #FFD700; /* Gold border */
            padding: 20px;
            color: white;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .menuB {
            text-align: center;
            background-color: rgba(128, 0, 128, 0.55); /* Purple background */
            color: #FFD700; /* Gold text */
            border: none;
            border-radius: 4px;
            padding: 4px 4px;
            cursor: pointer;
            transition: 0.3s ease;
        }

        .menuB:hover {
            background-color: #FFD700; /* Gold on hover */
            color: #800080; /* Purple text */
        }

        .menuB:active {
            transform: translateY(1px);
        }

        .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            border: 16px solid #800080; /* Purple border */
            border-radius: 50%;
            border-top: 16px solid #FFD700; /* Gold spinner */
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
    console.log("Custom UI styles (purple and gold) applied.");
})();
