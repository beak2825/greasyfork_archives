// ==UserScript==
// @name         maca client cryzen.io 1.5 aimbot+FLYHACK
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  W rizz
// @author       You
// @match        https://cryzen.io/
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526600/maca%20client%20cryzenio%2015%20aimbot%2BFLYHACK.user.js
// @updateURL https://update.greasyfork.org/scripts/526600/maca%20client%20cryzenio%2015%20aimbot%2BFLYHACK.meta.js
// ==/UserScript==

(function () {
    Object.defineProperty(Object.prototype, 'gameState', {
        set(state) {
            window._debugWorld = state;
            let isRightClickHeld = false;
            let closestEnemy = null;

            // Volo
            let flying = false;  // Stato del volo
            let targetHeight = 0;  // Altezza target durante il volo
            let verticalVelocity = 0;  // Velocità verticale
            const ascentSpeed = 1;  // Velocità di salita
            const descentSpeed = -1;  // Velocità di discesa
            const stopSpeed = 0;  // Velocità di stop
            const heightIncrement = 11;  // Incremento dell'altezza quando il volo è attivato

            // Interval to check for game state updates
            const gameWorldInterval = setInterval(() => {
                const { gameWorld } = window._debugWorld;
                if (gameWorld && gameWorld.server) {
                    clearInterval(gameWorldInterval);

                    const player = gameWorld.player;
                    const serverPlayers = gameWorld.server.players;

                    const calculateDistance = (playerPos, enemyPos) =>
                        Math.hypot(enemyPos.x - playerPos.x, enemyPos.y - playerPos.y, enemyPos.z - playerPos.z);

                    const updatePlayerRotationAndPosition = () => {
                        let closestDistance = Infinity;

                        // Reset closest enemy if they are dead
                        if (closestEnemy?.dead) closestEnemy = null;

                        // Find the closest enemy
                        Object.values(serverPlayers).forEach(enemy => {
                            if (enemy?.model?.position && enemy.isEnemy && !enemy.dead) {
                                const distance = calculateDistance(player.position, enemy.model.position);
                                if (distance < closestDistance) {
                                    closestDistance = distance;
                                    closestEnemy = enemy;
                                }
                            }
                        });

                        // Update player rotation and movement if scoped or right-click held
                        if (isRightClickHeld || player.weapon?.scoping) {
                            if (closestEnemy) {
                                const directionToEnemy = {
                                    x: closestEnemy.model.position.x - player.position.x,
                                    z: closestEnemy.model.position.z - player.position.z,
                                };

                                const rotationY = Math.atan2(directionToEnemy.x, directionToEnemy.z);
                                const verticalDistance = (closestEnemy.model.position.y + (closestEnemy.crouching ? 0.55 : 0.65)) - player.position.y;
                                const horizontalDistance = Math.hypot(directionToEnemy.x, directionToEnemy.z);
                                let rotationX = Math.atan2(verticalDistance, horizontalDistance);

                                // Constrain vertical rotation
                                rotationX = Math.max(Math.min(rotationX, Math.PI / 2), -Math.PI / 2);
                                const normalizedRotationY = (rotationY + Math.PI) % (2 * Math.PI);

                                // Apply rotations to player (without modifying materials)
                                player.rotation.y = normalizedRotationY;
                                player.rotation.x = rotationX;

                                // Move the player closer if too far from the enemy
                                const moveSpeed = 0.1;
                                const movement = { x: closestEnemy.model.position.x - player.position.x, z: closestEnemy.model.position.z - player.position.z };
                                const distanceToEnemy = Math.hypot(movement.x, movement.z);
                                if (distanceToEnemy > 1) {
                                    player.position.x += movement.x / distanceToEnemy * moveSpeed;
                                    player.position.z += movement.z / distanceToEnemy * moveSpeed;
                                }
                            }
                        }
                    };

                    // Event listeners for right-click hold
                    const onRightClickDown = (event) => { if (event.button === 2) isRightClickHeld = true; };
                    const onRightClickUp = (event) => { if (event.button === 2) isRightClickHeld = false; };

                    document.addEventListener('mousedown', onRightClickDown);
                    document.addEventListener('mouseup', onRightClickUp);

                    // Ascolta l'input da "F" per attivare/disattivare il volo
                    document.addEventListener('keydown', (event) => {
                        if (event.code === 'KeyF') {
                            flying = !flying;  // Inverti lo stato del volo

                            if (flying) {
                                // Ogni volta che premi "F", aggiungi 1100 unità all'altezza target
                                targetHeight = player.position.y + heightIncrement;
                                verticalVelocity = 0;  // Mantieni la velocità verticale a 0 quando sei in volo
                            } else {
                                verticalVelocity = 0;  // Fermati quando il volo è disattivato
                            }
                        }
                    });

                    // Funzione per aggiornare la posizione del giocatore
                    const updatePlayer = () => {
                        if (flying) {
                            // Se il volo è attivato, mantieni la posizione del giocatore
                            player.position.y = targetHeight;
                        }
                    };

                    setInterval(updatePlayer, 10); // Esegui l'aggiornamento ogni 10ms

                    // Start the update loop for rotation and movement (without modifying any rendering properties)
                    setInterval(updatePlayerRotationAndPosition, 2); // Update every 2ms
                }
            });
        },
        get() { return window._debugWorld; }
    });
})();
