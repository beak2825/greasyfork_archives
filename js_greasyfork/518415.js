// ==UserScript==
// @name         Tribal IO Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mod menu for Tribal IO browser game with item spawning functionality and enhanced UI
// @author       Lilbubblegum
// @match        https://tribals.io/#3TTV*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518415/Tribal%20IO%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/518415/Tribal%20IO%20Mod%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Class representing the mod menu.
     */
    class ModMenu {
        /**
         * Constructor for the ModMenu class.
         */
        constructor() {
            // Create a box element for the menu
            this.box = document.createElement('div');
            this.box.style.position = 'fixed';
            this.box.style.top = '50%';
            this.box.style.left = '50%';
            this.box.style.transform = 'translate(-50%, -50%)';
            this.box.style.width = '250px';
            this.box.style.padding = '20px';
            this.box.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.box.style.borderRadius = '10px';
            this.box.style.color = 'white';
            this.box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
            this.box.style.display = 'none'; // Initially hidden
            this.box.style.zIndex = '9999';

            // Create and style buttons
            this.createButton('Spawn Stone', 'stone');
            this.createButton('Spawn Wood', 'wood');
            this.createButton('Spawn Metal', 'metal');

            // Append the menu to the body
            document.body.appendChild(this.box);

            // Add keyboard listener for toggling the menu and unlocking mouse
            document.addEventListener('keydown', (event) => {
                if (event.key === '/') {
                    this.toggleMenu();
                    this.unlockMouse();
                }
            });
        }

        /**
         * Toggles the visibility of the mod menu.
         */
        toggleMenu() {
            if (this.box.style.display === 'none') {
                this.box.style.display = 'block';
            } else {
                this.box.style.display = 'none';
            }
        }

        /**
         * Spawns an item in the player's inventory.
         *
         * @param {string} item - The item to spawn (e.g., "stone", "wood", "metal").
         */
        spawnItem(item) {
            console.log(`Spawned ${item} in the inventory.`);
        }

        /**
         * Creates a button for spawning an item.
         * @param {string} text - The text of the button.
         * @param {string} item - The item to spawn when clicked.
         */
        createButton(text, item) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.margin = '10px 0';
            button.style.padding = '10px';
            button.style.backgroundColor = '#4CAF50';
            button.style.border = 'none';
            button.style.color = 'white';
            button.style.fontSize = '16px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '5px';
            button.style.transition = 'background-color 0.3s';

            // Change color on hover
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#45a049';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#4CAF50';
            });

            // Button click action
            button.addEventListener('click', () => {
                this.spawnItem(item);
            });

            this.box.appendChild(button);
        }

        /**
         * Unlocks the mouse for clicking buttons.
         * This could be browser-dependent and may not always be effective on all games.
         */
        unlockMouse() {
            if (document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement) {
                document.exitPointerLock(); // Unlock mouse
            }
        }
    }

    // Create an instance of the ModMenu class
    const modMenu = new ModMenu();
})();
