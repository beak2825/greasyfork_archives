// ==UserScript==
// @name         Florr Ultras Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Grants all ultras in Florr
// @author       Your Name
// @match        *://*.florr.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499163/Florr%20Ultras%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/499163/Florr%20Ultras%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to obtain all ultras
    function getAllUltras() {
        // Debugging: Log the window object to find the game object
        console.log('window object:', window);

        // Check if the game object and obtainUltra method exist
        if (window.game && typeof window.game.obtainUltra === 'function') {
            console.log('Game object and obtainUltra method found.');
            const ultras = ['ultra1', 'ultra2', 'ultra3']; // List all ultras here
            ultras.forEach(ultra => {
                window.game.obtainUltra(ultra);
            });
            alert('All ultras have been obtained!');
        } else {
            console.error('Game object or obtainUltra method not found.');
        }
    }

    // Adding a button to the game interface for obtaining all ultras
    function addButton() {
        const btn = document.createElement('button');
        btn.innerHTML = 'Get All Ultras';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 1000;
        btn.addEventListener('click', getAllUltras);
        document.body.appendChild(btn);
    }

    // Function to wait for the game object to be ready
    function waitForGameObject() {
        const checkInterval = setInterval(() => {
            if (window.game && typeof window.game.obtainUltra === 'function') {
                clearInterval(checkInterval);
                addButton();
            }
        }, 1000);
    }

    // Wait for the game to load
    window.addEventListener('load', () => {
        waitForGameObject();
    });
})();
 