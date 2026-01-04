// ==UserScript==
// @name         RXY V1 - Aimbot and ESP for cxryzen.io
// @description  Aimlock with right mouse button
// @version      1.0.0
// @namespace    https://shadowt3ch.site/
// @author       ShadowT3ch
// @match        https://cryzen.io/*
// @run-at       document-start
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/529763/RXY%20V1%20-%20Aimbot%20and%20ESP%20for%20cxryzenio.user.js
// @updateURL https://update.greasyfork.org/scripts/529763/RXY%20V1%20-%20Aimbot%20and%20ESP%20for%20cxryzenio.meta.js
// ==/UserScript==
// Material property definition
Object.defineProperty(Object.prototype, 'material', {
    get() { return this._material; },
    set(material) {
        if (this.type === 'SkinnedMesh' && this?.skeleton) {
            // Set custom properties for material
            Object.defineProperties(material, {
                'depthTest': {
                    get() { return false; },
                    set() {},
                },
                'transparent': {
                    get() { return true; },
                    set() {},
                }
            });

            // Set additional properties
            material.wireframe = true;
            material.opacity = 1;
        }
        this._material = material;
    }
});

// Game state property definition
(function () {
    Object.defineProperty(Object.prototype, 'gameState', {
        set(state) {
            window._debugWorld = state;
            let isRightClickHeld = false;
            let closestEnemy = null;

            // Interval to check for game state updates
            const gameWorldInterval = setInterval(() => {
                const { gameWorld } = window._debugWorld;

                if (gameWorld && gameWorld.server) {
                    clearInterval(gameWorldInterval);
                    const calculateDistance = (playerPos, enemyPos) =>
                        Math.hypot(enemyPos.x - playerPos.x, enemyPos.y - playerPos.y, enemyPos.z - playerPos.z);

                    const updatePlayerRotationAndPosition = () => {
                        const player = gameWorld.player;
                        const serverPlayers = gameWorld.server.players;

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

                                // Apply rotations to player
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

                    // Start the update loop
                    setInterval(updatePlayerRotationAndPosition, 2);
                }
            });
        },
        get() { return window._debugWorld; }
    });
})();

