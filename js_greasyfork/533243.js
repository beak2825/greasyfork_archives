// ==UserScript==
// @name         Machu Jump - Auto Jumper
// @version      0.1
// @license      GPLv3
// @description  This userscript automatically performs jumps in the web game (https://bocchinet.com/GQux/).
// @match        https://bocchinet.com/GQux/
// @resource     originalGameJS https://bocchinet.com/GQux/game.js
// @grant        GM_getResourceText
// @run-at       document-start
// @namespace https://greasyfork.org/users/1459377
// @downloadURL https://update.greasyfork.org/scripts/533243/Machu%20Jump%20-%20Auto%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/533243/Machu%20Jump%20-%20Auto%20Jumper.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const SCRIPT_NAME = "Machu Auto-Jump Script";
    console.log(`${SCRIPT_NAME}: Initializing...`);
 
    // --- Configuration ---
    const TARGET_SCRIPT_FILENAME = 'game.js';
    const PHYSICS_LOG_INTERVAL = 30;
 
    // Auto-jump tuning parameters
    const PREDICT_BASE_VX = -5.0;
    const PREDICT_BASE_VY = -6.5;
    const HOLE_ATTRACTION = 2.5;
    const PREDICTION_SUCCESS_FACTOR = 0.8;
 
    let physicsUpdateLogCounter = 0;
 
    // Find and block the original game script
    const findAndBlockOriginalScript = () => {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.endsWith(TARGET_SCRIPT_FILENAME)) {
                console.log(`${SCRIPT_NAME}: Found target script tag.`);
                script.type = 'text/javascript-blocked';
                console.log(`${SCRIPT_NAME}: Tag blocked.`);
                return script;
            }
        }
        console.error(`${SCRIPT_NAME}: Target script tag not found.`);
        return null;
    };
 
    // Get the original game code
    const getOriginalCode = () => {
        try {
            // Try using GM_getResourceText first
            const code = GM_getResourceText('originalGameJS');
            if (code && code.trim() !== '') {
                console.log(`${SCRIPT_NAME}: Code obtained via GM_getResourceText.`);
                return Promise.resolve(code);
            }
            throw new Error("GM_getResourceText failed or returned empty result");
        } catch (e) {
            // Fall back to fetch
            console.log(`${SCRIPT_NAME}: Initiating fallback fetch...`);
            const gameJsUrl = new URL(TARGET_SCRIPT_FILENAME, window.location.href).href;
            return fetch(gameJsUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.text();
                })
                .then(text => {
                    console.log(`${SCRIPT_NAME}: Code obtained via fallback fetch.`);
                    return text;
                })
                .catch(err => {
                    console.error(`${SCRIPT_NAME}: Fetch failed:`, err);
                    alert(`${SCRIPT_NAME} Error: Could not fetch game code`);
                    return null;
                });
        }
    };
 
    // Execute the modified code
    const executeCode = (codeToExecute) => {
        try {
            const scriptElement = document.createElement('script');
            scriptElement.id = 'machu-jump-modified-script';
            scriptElement.textContent = codeToExecute;
            (document.head || document.documentElement).appendChild(scriptElement);
            console.log(`${SCRIPT_NAME}: Modified script executed.`);
        } catch (e) {
            console.error(`${SCRIPT_NAME}: Execution error:`, e);
            alert(`${SCRIPT_NAME} Execution Error`);
        }
    };
 
    // Modify the game code and inject our auto-jump logic
    const modifyAndInject = (codeToModify) => {
        if (!codeToModify) {
            console.error(`${SCRIPT_NAME}: No code to modify.`);
            return;
        }
 
        console.log(`${SCRIPT_NAME}: Modifying code...`);
        let modifiedCode = codeToModify;
 
        // Find the updatePhysics function to inject our code
        const functionSignature = 'function updatePhysics() {';
        const functionIndex = modifiedCode.indexOf(functionSignature);
 
        if (functionIndex === -1) {
            console.error(`${SCRIPT_NAME}: updatePhysics function not found.`);
            executeCode(modifiedCode); // Execute unmodified code anyway
            return;
        }
 
        // Prepare the code to inject
        const injectionCode = `
            try {
                if (typeof physicsUpdateLogCounter === 'undefined') {
                    physicsUpdateLogCounter = 0;
                }
                physicsUpdateLogCounter++;
 
                // Predict if jump will succeed
                let shouldPredictJump = (
                    typeof gameState !== 'undefined' &&
                    gameState &&
                    gameState.ball &&
                    gameState.ball.isMoving &&
                    gameState.canJump &&
                    !gameState.hasJumped
                );
 
                let predictionResult = false;
                let finalSimDist = -1;
 
                if (shouldPredictJump) {
                    try {
                        // Initial simulation values
                        const startX = gameState.ball.x;
                        const startY = gameState.ball.y;
                        let simVX = ${PREDICT_BASE_VX};
                        let simVY = ${PREDICT_BASE_VY};
 
                        // Hole attraction calculation
                        const holeAttractionFactor = ${HOLE_ATTRACTION};
                        const toHoleX = gameState.hole.x - startX;
                        const toHoleY = gameState.hole.y - startY;
                        const distToHole = Math.sqrt(toHoleX * toHoleX + toHoleY * toHoleY);
 
                        if (distToHole > 0) {
                            simVX += (toHoleX / distToHole) * holeAttractionFactor;
                        }
 
                        // Simulation variables
                        let simX = startX;
                        let simY = startY;
                        const simGravity = 0.3;
                        const simFriction = 0.99;
                        const maxSteps = 60;
 
                        // Run simulation
                        for (let i = 0; i < maxSteps; i++) {
                            // Apply physics
                            simVY += simGravity;
                            simVX *= simFriction;
                            simVY *= simFriction;
                            simX += simVX;
                            simY += simVY;
 
                            // Calculate current distance to hole
                            const curDist = Math.sqrt(
                                Math.pow(simX - gameState.hole.x, 2) +
                                Math.pow(simY - gameState.hole.y, 2)
                            );
                            finalSimDist = curDist;
 
                            // Apply hole attraction in simulation
                            const attractionRadius = gameState.hole.radius * 4.0;
                            if (curDist < attractionRadius && curDist > 0) {
                                const holeVecX = gameState.hole.x - simX;
                                const holeVecY = gameState.hole.y - simY;
                                const pullFactor = 0.2 * (1 - curDist / attractionRadius);
                                simVX += (holeVecX / curDist) * pullFactor;
                                simVY += (holeVecY / curDist) * pullFactor;
                            }
 
                            // Check for success - requires getting close enough to hole
                            if (curDist < (gameState.hole.radius * ${PREDICTION_SUCCESS_FACTOR})) {
                                predictionResult = true;
                                break;
                            }
 
                            // Check for out of bounds (fail condition)
                            let ch = (typeof canvas !== 'undefined') ? canvas.height : 1000;
                            let cw = (typeof canvas !== 'undefined') ? canvas.width : 2000;
                            if (simY > ch || simX < 0 || simX > cw) {
                                predictionResult = false;
                                break;
                            }
                        }
                    } catch (predErr) {
                        console.error("Prediction error:", predErr);
                        predictionResult = false;
                    }
                }
 
                // Log state periodically
                if (physicsUpdateLogCounter % ${PHYSICS_LOG_INTERVAL} === 1) {
                    if (typeof gameState !== 'undefined' && gameState && gameState.ball) {
                        console.log(
                            'Frame=' + physicsUpdateLogCounter +
                            ' Moving=' + gameState.ball.isMoving +
                            ' CanJump=' + gameState.canJump +
                            ' HasJumped=' + gameState.hasJumped +
                            ' Predict=' + predictionResult +
                            ' (SimDist=' + (finalSimDist !== -1 ? finalSimDist.toFixed(2) : 'N/A') + ')'
                        );
                    } else {
                        console.log('Frame=' + physicsUpdateLogCounter + ', gameState not ready');
                    }
                }
 
                // Auto-jump logic
                if (predictionResult &&
                    typeof gameState !== 'undefined' &&
                    gameState &&
                    !gameState.isGameOver &&
                    !gameState.isTimeUp &&
                    !gameState.showTitleScreen &&
                    gameState.ball &&
                    gameState.ball.isMoving &&
                    gameState.canJump &&
                    !gameState.hasJumped &&
                    typeof performJump === 'function')
                {
                    console.log("Auto-Jump triggered: Prediction=" + predictionResult);
                    performJump();
                }
            } catch (e) {
                console.error("Error in injected code:", e);
            }
        `;
 
        // Inject the code at the beginning of updatePhysics
        const injectionPoint = functionIndex + functionSignature.length;
        modifiedCode = modifiedCode.slice(0, injectionPoint) + injectionCode + modifiedCode.slice(injectionPoint);
        console.log(`${SCRIPT_NAME}: Code modification complete.`);
 
        executeCode(modifiedCode);
    };
 
    const originalScriptTag = findAndBlockOriginalScript();
    if (originalScriptTag) {
        getOriginalCode().then(code => {
            if (code) {
                modifyAndInject(code);
            } else {
                console.error(`${SCRIPT_NAME}: Failed to get original code.`);
            }
        });
    } else {
        console.log(`${SCRIPT_NAME}: Script won't execute as target was not found.`);
    }
})();
