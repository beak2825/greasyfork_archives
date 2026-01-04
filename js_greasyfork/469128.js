// ==UserScript==
// @name         Show FPS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show minimum FPS meter in all page.
// @author       waki285
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469128/Show%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/469128/Show%20FPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function inIframe () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    if (inIframe()) return;
    const el = document.createElement("span");
    el.style.position = "fixed";
    el.style.pointerEvents = "none";
    el.style.right = "0.5rem";
    el.style.top = "0.25rem";
    el.style.zIndex = "9999";
    function fpsMeter() {
        let prevTime = Date.now(),
            frames = 0;

        requestAnimationFrame(function loop() {
            const time = Date.now();
            frames++;
            if (time > prevTime + 500) {
                let fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
                prevTime = time;
                frames = 0;

                el.innerText = `${fps} FPS`
            }

            requestAnimationFrame(loop);
        });
     }

    fpsMeter();
    document.body.appendChild(el);
})();