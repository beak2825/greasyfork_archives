// ==UserScript==
// @name         Gats.io Flick and Shoot Aimbot Script with E Key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press E to flick, shoot, and aimbot in Gats.io
// @author       Dark
// @match        *://gats.io/*   // Adjust this to match the game URL exactly
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510319/Gatsio%20Flick%20and%20Shoot%20Aimbot%20Script%20with%20E%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/510319/Gatsio%20Flick%20and%20Shoot%20Aimbot%20Script%20with%20E%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables for custom key bindings
    const flickKey = 0; // 0 is the left mouse button (flick action)
    const pistolKey = 'F'; // Key to shoot
    const actionKey = 'E'; // Key to trigger both flick and shoot
    const flickDuration = 50; // Duration of the flick in milliseconds
    let isFlicking = false; // State to track whether the flick action is in progress

    // Function to simulate a key press event
    function simulateKeyPress(key) {
        const keydownEvent = new KeyboardEvent('keydown', {
            key: key,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keydownEvent);

        setTimeout(() => {
            const keyupEvent = new KeyboardEvent('keyup', {
                key: key,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyupEvent);
        }, 10); // Small delay to simulate a real key press
    }

    // Function to simulate mouse click (flick action)
    function simulateMouseClick() {
        const mousedownEvent = new MouseEvent('mousedown', {
            button: flickKey,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(mousedownEvent);

        setTimeout(() => {
            const mouseupEvent = new MouseEvent('mouseup', {
                button: flickKey,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(mouseupEvent);
        }, flickDuration);
    }

    // Aimbot logic
    function aimbot() {
        const me = game.getMyPlayer();
        const enemies = game.getEnemies();
        if (enemies.length > 0) {
            const closestEnemy = enemies.reduce((closest, enemy) => {
                const dist = calc.distance(me, enemy);
                return dist < closest.dist ? { enemy, dist } : closest;
            }, { enemy: null, dist: Infinity });

            if (closestEnemy.enemy) {
                const enemyVector = { x: closestEnemy.enemy.x - me.x, y: closestEnemy.enemy.y - me.y };
                const movementVector = calc.normalize(enemyVector, 1);
                const goal = calc.combine(me, movementVector);

                if (!game.isOutsideMap(goal)) {
                    // Simulate the mouse flick to aim at the enemy
                    console.log(`Aimbot targeting enemy at: ${goal.x}, ${goal.y}`);
                    GameInterface.conn.send(`move to ${goal.x}, ${goal.y}`);
                }
            }
        }
    }

    // Event listener for pressing the actionKey (E)
    document.addEventListener('keydown', (event) => {
        if (event.key === actionKey && !isFlicking) {
            isFlicking = true;

            // Activate aimbot during flick
            aimbot(); // Aim at the closest enemy

            // Simulate flick (mouse click) and shoot (key F press)
            console.log('Action key pressed: Flick and shoot initiated');

            // Simulate mouse click (flick action)
            simulateMouseClick();

            // Simulate pistol shot after flick duration
            setTimeout(() => {
                simulateKeyPress(pistolKey);
                isFlicking = false; // Reset flick state
            }, flickDuration);
        }
    });
})();
