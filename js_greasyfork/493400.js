// ==UserScript==
// @name         Chrome Dino Game Helper
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  Helper functions for the Chrome Dino game
// @author       You
// @match        https://chromedino.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chromedino.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493400/Chrome%20Dino%20Game%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493400/Chrome%20Dino%20Game%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to check if the Runner object is available
    function checkRunner() {
        if (typeof Runner !== 'undefined') {
            // Runner object is available, add the gameOver function
            Runner.prototype.gameOver = function() {
                console.log("hi");
            };
            
            // Add toggle menu
            addToggleMenu();
        } else {
            // Runner object is not available yet, wait and try again
            setTimeout(checkRunner, 100);
        }
    }

    // Function to add toggle menu
    function addToggleMenu() {
        const menuDiv = document.createElement('div');
        menuDiv.innerHTML = `
            <div id="helperMenu" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background-color: rgba(255, 255, 255, 0.8); padding: 10px; border: 1px solid #ccc;">
                <label><input type="checkbox" id="gameOverToggle"> Game Over Toggle</label>
            </div>
        `;
        document.body.appendChild(menuDiv);

        const toggleCheckbox = document.getElementById('gameOverToggle');
        toggleCheckbox.addEventListener('change', function() {
            if (toggleCheckbox.checked) {
                // Enable game over function
                Runner.prototype.gameOver = function() {
                    console.log("hi");
                };
            } else {
                // Disable game over function
                delete Runner.prototype.gameOver;
            }
        });
    }

    // Start checking for the Runner object
    checkRunner();
})();
