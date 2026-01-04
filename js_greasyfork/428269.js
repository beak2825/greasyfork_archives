// ==UserScript==
// @name         Fpuzzles-cpu
// @namespace    crul-scripts
// @version      1.1
// @description  Prevents re-drawing when inactive to save CPU.
// @author       Rangsk
// @match        https://*.f-puzzles.com/*
// @match        https://f-puzzles.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/428269/Fpuzzles-cpu.user.js
// @updateURL https://update.greasyfork.org/scripts/428269/Fpuzzles-cpu.meta.js
// ==/UserScript==

// Script idea is inspired by @Crul on the CTC Discord.

(function() {
    'use strict';

    const doShim = function() {
        let drawDirty = false;

        const origRequestAnimationFrame = window.requestAnimationFrame;
        const origDrawScreen = drawScreen;
        drawScreen = function(step, forced) {
            origDrawScreen(step, forced);
            drawDirty = false;
        }

        const setDrawDirty = function() {
            if (!drawDirty) {
                drawDirty = true;
                origRequestAnimationFrame(drawScreen);
            }
        }

        let firstDraw = true;
        window.requestAnimationFrame = function(callback) {
            if (firstDraw) {
                origRequestAnimationFrame(callback);
                updateTimer();
                firstDraw = false;
            }
        }

        // Mark dirty once per second for the timer
        const updateTimer = function() {
            setDrawDirty();
            setTimeout(updateTimer, 1000);
        }

        // Mark dirty after all user input
        const origOnInputEnd = onInputEnd;
        onInputEnd = function() {
            origOnInputEnd();
            setDrawDirty();
        }

        const origOnMouseMove = document.onmousemove;
        let prevHoveredButton = null;
        let prevMouseX = null;
        let prevMouseY = null;
        document.onmousemove = function(mouse) {
            let result = origOnMouseMove(mouse);
            let mouseMoved = prevMouseX !== mouseX || prevMouseY !== mouseY;
            prevMouseX = mouseX;
            prevMouseY = mouseY;

            if (holding && !testPaused() && !disableInputs) {
                setDrawDirty();
            }

            if (mouseMoved) {
                let curHoveredButton = null;
                for (let sidebar of sidebars) {
                    for (let button of sidebar.buttons) {
                        if (button.hovering()) {
                            curHoveredButton = button;
                            break;
                        }
                    }
                    if (curHoveredButton) {
                        break;
                    }
                }

                if (!curHoveredButton) {
                    for (let button of buttons) {
                        if (button.hovering()) {
                            curHoveredButton = button;
                            break;
                        }
                    }
                }

                if (curHoveredButton !== prevHoveredButton ||
                    curHoveredButton && descriptions[curHoveredButton.id] ||
                    prevHoveredButton && descriptions[prevHoveredButton.id]) {
                    setDrawDirty();
                    prevHoveredButton = curHoveredButton;
                }
            }

            return result;
        }

        const prevClosePopups = closePopups;
        closePopups = function() {
            prevClosePopups();
            setDrawDirty();
        }
    }

    if (window.grid) {
        doShim();
    } else {
        document.addEventListener('DOMContentLoaded', (event) => {
            doShim();
        });
    }
})();