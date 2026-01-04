// ==UserScript==
// @name         AMQ BR Click-to-Walk
// @namespace    racoonseki
// @version      2.0
// @description  Smooth click-to-walk for AMQ BR map
// @match        https://animemusicquiz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535577/AMQ%20BR%20Click-to-Walk.user.js
// @updateURL https://update.greasyfork.org/scripts/535577/AMQ%20BR%20Click-to-Walk.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!document.getElementById("battleRoyalPage")) return;

    let current = null;
    const hooked = new WeakSet();
    let movementState = { isDiagonal: false };

    // --- Inject CSS for the floating text animation ---
    const style = document.createElement('style');
    style.textContent = `
        .ctw-item-get-text {
            position: absolute;
            color: white;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 1px 1px 3px black, -1px -1px 3px black, 1px -1px 3px black, -1px 1px 3px black;
            pointer-events: none;
            z-index: 100;
            transition: transform 2.5s ease-out, opacity 2.5s ease-out;
            white-space: nowrap;
        }
        .ctw-item-get-text.other-player {
            font-size: 12px;
            color: #cccccc;
        }
    `;
    document.head.appendChild(style);


    // --- HELPER FUNCTIONS ---
    const getGameInstances = () => window.battleRoyal?.map;

    const getPlayerPos = (playerInstance) => {
        return playerInstance ? { x: playerInstance.x, y: playerInstance.y } : null;
    };

    const getElementPos = el => {
        if (!el) return null;
        const mapInstance = getGameInstances();
        const mapContent = document.getElementById("brMapContent");
        if (!mapInstance || !mapInstance.pointPixelSize || !mapContent) return null;

        const r = el.getBoundingClientRect();
        const m = mapContent.getBoundingClientRect();
        const pixelX = r.left - m.left + r.width / 2;
        const pixelY = r.top - m.top + r.height / 2;

        return {
            x: pixelX / mapInstance.pointPixelSize,
            y: pixelY / mapInstance.pointPixelSize
        };
    };

    const getMousePosInGameUnits = e => {
        const mapInstance = getGameInstances();
        const mapContent = document.getElementById("brMapContent");
        if (!mapInstance || !mapInstance.pointPixelSize || !mapContent) return null;

        const r = mapContent.getBoundingClientRect();
        const pixelX = e.clientX - r.left;
        const pixelY = e.clientY - r.top;

        return {
            x: pixelX / mapInstance.pointPixelSize,
            y: pixelY / mapInstance.pointPixelSize
        };
    };

    // --- MODIFIED: Function to display the floating text for any player ---
    const showItemGetText = (itemName, targetPlayerElement, isSelf = false) => {
        const mapContent = document.getElementById("brMapContent");
        if (!targetPlayerElement || !mapContent || !itemName) return;

        const textDiv = document.createElement('div');
        textDiv.className = 'ctw-item-get-text';
        if (!isSelf) {
            textDiv.classList.add('other-player');
        }
        textDiv.innerText = `+ ${itemName}`;

        const playerTransform = targetPlayerElement.style.transform;
        const initialYOffset = isSelf ? -25 : -20;
        textDiv.style.transform = playerTransform.replace(/translateY\(([^)]+)\)/, `translateY(calc($1 + ${initialYOffset}px))`);
        textDiv.style.opacity = '1';

        mapContent.appendChild(textDiv);

        setTimeout(() => {
            const finalYOffset = isSelf ? -75 : -55;
            textDiv.style.transform = playerTransform.replace(/translateY\(([^)]+)\)/, `translateY(calc($1 + ${finalYOffset}px))`);
            textDiv.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            textDiv.remove();
        }, 2500);
    };


    // --- CONTROL FUNCTIONS ---
    const stopWalking = () => {
        const keys = getGameInstances()?.playerMovementController?.keysDown;
        if (keys) keys.up = keys.down = keys.left = keys.right = false;
        current = null;
        movementState.isDiagonal = false;
    };

    const walkTo = (target) => {
        stopWalking();
        current = target;
    };

    // --- EVENT HANDLERS ---
    const observeNewElements = () => {
        document.querySelectorAll(".brShowEntry, .brContainerEntry, .brTileGate").forEach(el => {
            if (hooked.has(el)) return;
            hooked.add(el);
            el.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                if (el.matches(".brTileGate")) {
                    const mapInstance = getGameInstances();
                    if (mapInstance && mapInstance.tileSize) {
                        const tileSize = mapInstance.tileSize;
                        const center = tileSize / 2;
                        let target = { el: el, x: center, y: center };
                        if (el.classList.contains('north')) target.y = 1;
                        else if (el.classList.contains('south')) target.y = tileSize - 1;
                        else if (el.classList.contains('west')) target.x = 1;
                        else if (el.classList.contains('east')) target.x = tileSize - 1;
                        walkTo(target);
                    } else {
                        walkTo({ el: el });
                    }
                } else {
                    walkTo({ el: el });
                }
            });
        });
    };

    const initMouseControls = () => {
        let isMouseDown = false;
        const map = document.getElementById("brMapContent");
        map?.addEventListener("mousedown", e => {
            if (e.target.closest(".brContainerContent, .brPlayer")) return;
            isMouseDown = true;
            const targetPos = getMousePosInGameUnits(e);
            if (targetPos) walkTo(targetPos);
        });
        map?.addEventListener("mouseup", () => isMouseDown = false);
        map?.addEventListener("mouseleave", () => isMouseDown = false);
        map?.addEventListener("mousemove", e => {
            if (isMouseDown) {
                if (e.target.closest(".brContainerEntry, .brPlayer")) return;
                const targetPos = getMousePosInGameUnits(e);
                if (targetPos) current = targetPos;
            }
        });
    };

    const initKeyboardInterrupt = () => {
        const dirMap = { KeyW: "up", KeyA: "left", KeyS: "down", KeyD: "right", ArrowUp: "up", ArrowLeft: "left", ArrowDown: "down", ArrowRight: "right" };
        window.addEventListener("keydown", e => {
            if (dirMap[e.code] && current) {
                stopWalking();
                const keys = getKeys();
                if (keys) keys[dirMap[e.code]] = true;
            }
        });
    };

    // --- CORE LOGIC: MONKEY-PATCHING THE GAME ENGINE ---
    const patchGameEngine = () => {
        const mapPrototype = window.BattleRoyalMap.prototype;
        if (!mapPrototype || mapPrototype.ctw_patched) return;
        const originalExecuteMove = mapPrototype.executeMove;
        mapPrototype.executeMove = function(...args) {
            if (current) {
                const now = { x: this.selfPlayer.x, y: this.selfPlayer.y };
                const goal = (current.x !== undefined && current.y !== undefined) ? { x: current.x, y: current.y } : getElementPos(current.el);
                if (!goal) {
                    stopWalking();
                } else {
                    const dx = goal.x - now.x;
                    const dy = goal.y - now.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const tolerance = this.activationRadius || 1.5;
                    const keys = this.playerMovementController.keysDown;
                    if (distance <= tolerance) {
                        if (current.el instanceof HTMLElement) {
                            originalExecuteMove.apply(this, [true]);
                            current.el.click();
                        }
                        stopWalking();
                    } else {
                        keys.up = keys.down = keys.left = keys.right = false;
                        const absDx = Math.abs(dx);
                        const absDy = Math.abs(dy);
                        const enterDiagonalRatio = 0.6;
                        const exitDiagonalRatio = 0.4;
                        let isPrimaryHorizontal = absDx > absDy;
                        let currentRatio = isPrimaryHorizontal ? (absDy / absDx) : (absDx / absDy);
                        if (isNaN(currentRatio)) currentRatio = 0;
                        if (movementState.isDiagonal) {
                            if (currentRatio < exitDiagonalRatio) movementState.isDiagonal = false;
                        } else {
                            if (currentRatio > enterDiagonalRatio) movementState.isDiagonal = true;
                        }
                        if (movementState.isDiagonal) {
                            if (dx > 0) keys.right = true; else keys.left = true;
                            if (dy > 0) keys.down = true; else keys.up = true;
                        } else {
                            if (isPrimaryHorizontal) {
                                if (dx > 0) keys.right = true; else keys.left = true;
                            } else {
                                if (dy > 0) keys.down = true; else keys.up = true;
                            }
                        }
                    }
                }
            }
            originalExecuteMove.apply(this, args);
        };
        mapPrototype.ctw_patched = true;
    };

    // --- INITIALIZATION ---
    const initialize = () => {
        const patchCheck = setInterval(() => {
            const mapInstance = getGameInstances();
            if (mapInstance && mapInstance.executeMove && window.Listener && window.battleRoyal?.collectionController) {
                clearInterval(patchCheck);
                patchGameEngine();

                // Listener for SELF collections
                new Listener("new collected name entry", (entry) => {
                    const name = window.battleRoyal.collectionController.extractShowName(entry);
                    const selfEl = document.querySelector(".brPlayer.self");
                    showItemGetText(name, selfEl, true);
                }).bindListener();

                // Listener for OTHER player collections
                new Listener("battle royal object despawn", (payload) => {
                    const map = getGameInstances();
                    if (!map) return;

                    const despawnedObject = map.mapObjects[payload.x]?.[payload.y];
                    // We get the object's name BEFORE it's fully removed by the game logic
                    const itemName = despawnedObject?.$html.data('bs.popover')?.options?.content;

                    // Delay slightly to get the most up-to-date player positions
                    setTimeout(() => {
                        let closestPlayer = null;
                        let minDistance = Infinity;

                        // Check all other players
                        Object.values(map.playerMap).forEach(player => {
                            const pPos = getPlayerPos(player);
                            const distance = Math.sqrt(Math.pow(pPos.x - payload.x, 2) + Math.pow(pPos.y - payload.y, 2));
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestPlayer = player;
                            }
                        });

                        // If the closest player is within interaction range, assume they picked it up
                        if (closestPlayer && minDistance < (map.activationRadius || 1.5)) {
                            showItemGetText(itemName, closestPlayer.$html[0], false);
                        }
                    }, 50); // 50ms delay
                }).bindListener();

                observeNewElements();
                const mapContent = document.getElementById("brMapContent");
                if (mapContent) {
                     new MutationObserver(observeNewElements).observe(mapContent, { childList: true, subtree: true });
                }

                initMouseControls();
                initKeyboardInterrupt();
            }
        }, 100);
    };

    const brPage = document.getElementById("battleRoyalPage");
    const brObserver = new MutationObserver(() => {
        if (brPage.classList.contains("text-center")) {
            brObserver.disconnect();
            initialize();
        }
    });

    if (brPage.classList.contains("text-center")) {
        initialize();
    } else {
        brObserver.observe(brPage, { attributes: true, attributeFilter: ["class"] });
    }
})();