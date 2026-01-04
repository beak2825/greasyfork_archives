// ==UserScript==
// @name         Wormax.IO Zoom
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Another fix
// @author       AdamStorme
// @match        *://*.wormax.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542042/WormaxIO%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/542042/WormaxIO%20Zoom.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Wormax.IO Zoom [WORKS ONLY ON THORIUM] [Stutter fix]
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Stutter fix!
// @author       AdamStorme
// @match        *://*.wormax.io/*
// @grant        none
// @license      MIT
// @downloadURL none
// ==/UserScript==

(function () {
    const script = document.createElement('script');
    script.textContent = '(' + function () {
        let zoomTarget = 1.0;
        let zoomVelocity = 0.0;

        function findCameraController() {
            const stack = [window];
            const visited = new WeakSet();

            while (stack.length) {
                const obj = stack.pop();
                if (!obj || typeof obj !== 'object' || visited.has(obj)) continue;
                visited.add(obj);

                for (const key in obj) {
                    try {
                        const val = obj[key];
                        if (
                            val &&
                            typeof val === 'object' &&
                            val.camera &&
                            typeof val.camera.zoom === 'number' &&
                            'updateZoom' in val &&
                            'follow' in val
                        ) {
                            return val;
                        }
                        if (val && typeof val === 'object') {
                            stack.push(val);
                        }
                    } catch {}
                }
            }
            return null;
        }

        function enforceZoom(camera) {
            let actualZoom = camera.zoom;

            function loop() {
                const diff = zoomTarget - actualZoom;
                zoomVelocity = diff * 0.15;
                actualZoom += zoomVelocity;

                if (Math.abs(diff) < 0.0005) actualZoom = zoomTarget;

                camera.zoom = actualZoom;
                camera.update?.();

                requestAnimationFrame(loop);
            }

            requestAnimationFrame(loop);
        }

        function setupInput() {
            window.addEventListener('wheel', (e) => {
                const step = e.altKey ? 0.1 : e.shiftKey ? 1.0 : 0.2;
                zoomTarget = Math.max(0.1, Math.min(5.0, zoomTarget + (e.deltaY > 0 ? step : -step)));
                e.preventDefault();
            }, { passive: false });

            document.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 'r') {
                    zoomTarget = 1.0;
                    console.log('[ZoomMod] Zoom reset');
                }
            });
        }

        function waitForCamera() {
            const interval = setInterval(() => {
                const controller = findCameraController();
                if (controller && controller.camera && typeof controller.camera.zoom === 'number') {
                    clearInterval(interval);
                    controller.updateZoom = false;

                    setupInput();
                    enforceZoom(controller.camera);

                    console.log('[ZoomMod] Zoom enabled');
                }
            }, 500);
        }

        waitForCamera();
    } + ')();';

    document.body.appendChild(script);
})();