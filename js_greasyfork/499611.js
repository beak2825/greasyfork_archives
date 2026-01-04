// ==UserScript==
// @name         Cryzen.io Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a simple mod menu to Cryzen.io for cheats and enhancements.
// @author       Me :)
// @match        https://cryzen.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499611/Cryzenio%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/499611/Cryzenio%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new div element for the mod menu
    const modMenu = document.createElement('div');
    modMenu.style.position = 'fixed';
    modMenu.style.top = '10px';
    modMenu.style.left = '10px';
    modMenu.style.padding = '10px';
    modMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modMenu.style.color = 'white';
    modMenu.style.zIndex = '10000';
    modMenu.style.fontFamily = 'Arial, sans-serif';
    modMenu.style.borderRadius = '5px';

    // Add title to the mod menu
    const title = document.createElement('h2');
    title.innerText = 'Cryzen.io Mod Menu';
    title.style.marginTop = '0';
    modMenu.appendChild(title);

    // Function to create a button
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.margin = '5px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#444';
        button.style.color = 'white';
        button.addEventListener('click', onClick);
        modMenu.appendChild(button);
    }

    // Function to add score
    function addScore(amount) {
        if (window.Cryzen && window.Cryzen.player) {
            window.Cryzen.player.score += amount;
            console.log(`Added ${amount} to score.`);
        } else {
            console.log('Cryzen.io player object not found.');
        }
    }

    // Function to increase speed
    function increaseSpeed(amount) {
        if (window.Cryzen && window.Cryzen.player) {
            window.Cryzen.player.speed += amount;
            console.log(`Increased speed by ${amount}.`);
        } else {
            console.log('Cryzen.io player object not found.');
        }
    }

    // Add buttons to the mod menu
    createButton('Add 1000 Score', () => addScore(1000));
    createButton('Add 5000 Score', () => addScore(5000));
    createButton('Increase Speed by 10', () => increaseSpeed(10));
    createButton('Increase Speed by 20', () => increaseSpeed(20));

    // Add the mod menu to the document body
    document.body.appendChild(modMenu);
})();