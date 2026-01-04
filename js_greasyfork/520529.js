// ==UserScript==
// @name         Drawaria online Christmas Mod
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  Add snowfall, Christmas decorations, and a menu for playing/stopping a Christmas song to Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/520529/Drawaria%20online%20Christmas%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/520529/Drawaria%20online%20Christmas%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create snowflakes
    function createSnowflakes() {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        document.body.appendChild(snowContainer);

        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snowflake.style.animationDelay = `${Math.random() * 2}s`;
            snowContainer.appendChild(snowflake);
        }
    }

    // Function to create Christmas lights
    function createChristmasLights() {
        const lightContainer = document.createElement('div');
        lightContainer.id = 'light-container';
        document.body.appendChild(lightContainer);

        for (let i = 0; i < 20; i++) {
            const light = document.createElement('div');
            light.className = 'christmas-light';
            light.style.left = `${Math.random() * 100}vw`;
            light.style.animationDuration = `${Math.random() * 3 + 2}s`;
            light.style.animationDelay = `${Math.random() * 2}s`;
            lightContainer.appendChild(light);
        }
    }

    // Function to create Christmas decorations
    function createChristmasDecorations() {
        const decorationContainer = document.createElement('div');
        decorationContainer.id = 'decoration-container';
        document.body.appendChild(decorationContainer);

        const decorations = ['🎄', '🎅', '🎁', '🎀', '❄️', '🎉'];
        for (let i = 0; i < 10; i++) {
            const decoration = document.createElement('div');
            decoration.className = 'christmas-decoration';
            decoration.style.left = `${Math.random() * 100}vw`;
            decoration.style.top = `${Math.random() * 100}vh`;
            decoration.textContent = decorations[Math.floor(Math.random() * decorations.length)];
            decorationContainer.appendChild(decoration);
        }
    }

    // Function to create the menu
    function createMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'christmas-menu';
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '10px';
        menuContainer.style.right = '10px';
        menuContainer.style.zIndex = '1001';
        menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        menuContainer.style.padding = '10px';
        menuContainer.style.borderRadius = '5px';
        menuContainer.style.color = 'white';
        menuContainer.style.fontFamily = 'Arial, sans-serif';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'center';
        document.body.appendChild(menuContainer);

        // Play button
        const playButton = document.createElement('button');
        playButton.textContent = 'Play Christmas Song';
        playButton.style.marginBottom = '5px';
        playButton.style.padding = '5px 10px';
        playButton.style.borderRadius = '3px';
        playButton.style.border = 'none';
        playButton.style.backgroundColor = 'green';
        playButton.style.color = 'white';
        playButton.style.cursor = 'pointer';
        playButton.addEventListener('click', playChristmasSong);
        menuContainer.appendChild(playButton);

        // Stop button
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Christmas Song';
        stopButton.style.padding = '5px 10px';
        stopButton.style.borderRadius = '3px';
        stopButton.style.border = 'none';
        stopButton.style.backgroundColor = 'red';
        stopButton.style.color = 'white';
        stopButton.style.cursor = 'pointer';
        stopButton.addEventListener('click', stopChristmasSong);
        menuContainer.appendChild(stopButton);
    }

    // Audio element for the Christmas song
    const audio = new Audio('https://www.mariowiki.com/images/b/b6/SM3DL-Special_World_3.oga');
    audio.loop = true; // Make the song loop infinitely

    // Function to play the Christmas song
    function playChristmasSong() {
        audio.play();
    }

    // Function to stop the Christmas song
    function stopChristmasSong() {
        audio.pause();
        audio.currentTime = 0; // Reset the audio to the beginning
    }

    // Add CSS for snowflakes, lights, and decorations
    const style = document.createElement('style');
    style.innerHTML = `
        #snow-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }
        .snowflake {
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: fall linear infinite;
        }
        @keyframes fall {
            to {
                transform: translateY(100vh);
            }
        }
        #light-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }
        .christmas-light {
            position: absolute;
            width: 10px;
            height: 10px;
            background: yellow;
            border-radius: 50%;
            opacity: 0.8;
            animation: blink linear infinite;
        }
        @keyframes blink {
            0%, 100% {
                opacity: 0.8;
            }
            50% {
                opacity: 0.2;
            }
        }
        #decoration-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }
        .christmas-decoration {
            position: absolute;
            font-size: 24px;
            animation: float linear infinite;
        }
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);

    // Create snowflakes, lights, decorations, and menu
    createSnowflakes();
    createChristmasLights();
    createChristmasDecorations();
    createMenu();
})();