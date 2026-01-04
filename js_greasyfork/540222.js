// ==UserScript==
// @name         Auto Scroll Up & Down
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Auto-scroll any page. Press "S" to scroll down, Shift+S to scroll up. Use ↑ and ↓ to adjust speed in real time.
// @author       Syntax-Surfer-1
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540222/Auto%20Scroll%20Up%20%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/540222/Auto%20Scroll%20Up%20%20Down.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isScrolling = false;
    let scrollInterval = null;
    let scrollDirection = 1;
    let scrollSpeed = 20;
    const SCROLL_STEP = 1;
    let hasShownInstructions = false;

    function startScrolling() {
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, scrollDirection * SCROLL_STEP);
            }, scrollSpeed);
            console.log(`✅ Auto-scroll ${scrollDirection === 1 ? 'down' : 'up'} started.`);

            if (!hasShownInstructions) {
                alert('🖱️ Auto Scroll Started!\n\nControls:\n- "S" = scroll down\n- "Shift + S" = scroll up\n- "↑ / ↓" = adjust speed');
                console.log('🖱️ Controls:\n- S = scroll down\n- Shift+S = scroll up\n- ↑ / ↓ = adjust speed');
                hasShownInstructions = true;
            }
        }
    }

    function stopScrolling() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
            console.log("⏹️ Auto-scroll stopped.");
        }
    }

    function toggleScrolling(direction = 1) {
        if (isScrolling && scrollDirection === direction) {
            stopScrolling();
            isScrolling = false;
        } else {
            stopScrolling();
            scrollDirection = direction;
            startScrolling();
            isScrolling = true;
        }
    }

    function restartScrolling() {
        if (isScrolling) {
            stopScrolling();
            startScrolling();
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        const key = e.key;

        if (key.toLowerCase() === 's') {
            toggleScrolling(e.shiftKey ? -1 : 1);
        }

        if (key === 'ArrowUp') {
            e.preventDefault();
            scrollSpeed = Math.max(5, scrollSpeed - 5);
            restartScrolling();
            console.log(`⚡ Faster scroll (speed: ${scrollSpeed}ms)`);
        }

        if (key === 'ArrowDown') {
            e.preventDefault();
            scrollSpeed += 5;
            restartScrolling();
            console.log(`🐢 Slower scroll (speed: ${scrollSpeed}ms)`);
        }
    });
})();
