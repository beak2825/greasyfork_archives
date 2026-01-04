// ==UserScript==
// @name         Florr Ultras Userscript (Test)
// @namespace    http://tampermonkey.net/
// @version      1.0 BETA
// @description  Grants some Ultras in florr
// @author       Your Name
// @match        *://*.florr.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510356/Florr%20Ultras%20Userscript%20%28Test%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510356/Florr%20Ultras%20Userscript%20%28Test%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // Function to obtain all ultras
    function getAllUltras() {
        // Assuming there's a global game object with a method to get ultras
        if (window.game && typeof window.game.obtainUltra === 'function') {
            const ultras = ['rose', 'starfish', 'sponge', 'wing', 'stinger', 'antenna', 'bubble', 'wing', 'shovel', 'stick', 'powder', 'light']; // List all ultras here
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
 
    // Wait for the game to load
    window.addEventListener('load', () => {
        addButton();
    });
})();