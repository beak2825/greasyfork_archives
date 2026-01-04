// ==UserScript==
// @name         Auto Clicker Toggle randomized
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Toggle autoclicker with E, randomized 95-100 CPS at cursor (every millisecond)
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547370/Auto%20Clicker%20Toggle%20randomized.user.js
// @updateURL https://update.greasyfork.org/scripts/547370/Auto%20Clicker%20Toggle%20randomized.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoClicking = false;
    let clickInterval;
    let mouseX = 0, mouseY = 0;

    // Track mouse position
    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function startClicking() {
        if (clickInterval) return;

        function clickLoop() {
            if (!autoClicking) return;

            // Randomize CPS (95–100) *every millisecond*
            let cps = Math.floor(Math.random() * 6) + 95; // 95–100
            let delay = 1000 / cps; // convert to ms per click

            // Find element under cursor
            const target = document.elementFromPoint(mouseX, mouseY);
            if (target) {
                ["mousedown", "mouseup", "click"].forEach(type => {
                    target.dispatchEvent(new MouseEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: mouseX,
                        clientY: mouseY,
                        buttons: 1
                    }));
                });
            }

            // Schedule next click with freshly randomized delay
            clickInterval = setTimeout(clickLoop, delay);
        }
        clickLoop();
    }

    function stopClicking() {
        clearTimeout(clickInterval);
        clickInterval = null;
    }

    // Toggle with "E"
    document.addEventListener('keydown', function (e) {
        if (e.key.toLowerCase() === 'e') {
            autoClicking = !autoClicking;
            if (autoClicking) {
                console.log("AutoClicker ON");
                startClicking();
            } else {
                console.log("AutoClicker OFF");
                stopClicking();
            }
        }
    });
})();
