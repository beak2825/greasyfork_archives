// ==UserScript==
// @name         FPS and Ping Drawer for Miniblox.io
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Displays the current FPS and ping on miniblox.io with color changes based on wellness criteria, toggled by F9 key
// @author       Royal-Elite
// @match        *://miniblox.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499628/FPS%20and%20Ping%20Drawer%20for%20Minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/499628/FPS%20and%20Ping%20Drawer%20for%20Minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fpsVisible = true;

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const fpsCounter = createStatElement('10px', '50%');
    document.body.appendChild(fpsCounter);

    const pingDisplay = createStatElement('40px', '50%');
    document.body.appendChild(pingDisplay);

    const FRAME_FILTER_STRENGTH = 20;
    const PING_FILTER_STRENGTH = 3;

    class ResourceMonitor {
        constructor() {
            this.beginTime = performance.now();
            this.prevTime = this.beginTime;
            this.instantFPS = 0;
            this.filteredFPS = 0;
            this.instantPing = 0;
            this.filteredPing = 0;
            this.lastFrameFinishedTimestamp = performance.now();
            this.framesSinceGraphUpdate = 0;
            this.lastGraphUpdateTimestamp = performance.now();
            this.mspt = 0;
            setInterval(() => { this.updateInstantFPS(); }, 300);
            setInterval(() => this.checkRoundTripPing(), 1000);
            requestAnimationFrame(() => this.frameFinished());
        }

        frameFinished() {
            const now = performance.now();
            let delta = now - this.lastFrameFinishedTimestamp;
            if (delta <= 0) delta = 1;

            const fps = 1000 / delta;
            this.lastFrameFinishedTimestamp = now;
            this.filteredFPS += (fps - this.filteredFPS) / FRAME_FILTER_STRENGTH;
            this.framesSinceGraphUpdate++;

            requestAnimationFrame(() => this.frameFinished());
        }

        updateInstantFPS() {
            const now = performance.now();
            const delta = now - this.lastGraphUpdateTimestamp;
            this.lastGraphUpdateTimestamp = now;
            this.instantFPS = this.framesSinceGraphUpdate / (delta / 1000);
            this.framesSinceGraphUpdate = 0;
        }

        async checkRoundTripPing() {
            const start = performance.now();
            try {
                const response = await fetch('https://miniblox.io/ping', { method: 'HEAD' });
                const end = performance.now();
                const ping = end - start;
                this.filteredPing += (ping - this.filteredPing) / PING_FILTER_STRENGTH;

                if (fpsVisible) {
                    const currentPing = this.filteredPing;
                    pingDisplay.innerText = `${currentPing.toFixed(1)} M/S`;

                    if (currentPing < 50) {
                        pingDisplay.style.color = 'green';
                    } else if (currentPing < 100) {
                        pingDisplay.style.color = 'yellow';
                    } else {
                        pingDisplay.style.color = 'red';
                    }
                }
            } catch (error) {
                console.error('Error calculating ping:', error);
            } finally {
                setTimeout(() => this.checkRoundTripPing(), 1000);
            }
        }
    }

    const resourceMonitor = new ResourceMonitor();

    function createStatElement(top, left) {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.top = top;
        element.style.left = left;
        element.style.transform = 'translateX(-50%)';
        element.style.padding = '5px 10px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        element.style.fontSize = '14px';
        element.style.zIndex = '9999';
        element.style.fontFamily = '"Press Start 2P", cursive';
        return element;
    }

    function updateDisplay() {
        if (fpsVisible) {
            const fps = resourceMonitor.filteredFPS;
            fpsCounter.innerText = `${fps.toFixed(1)} F/P/S`;

            if (fps > 50) {
                fpsCounter.style.color = 'green';
            } else if (fps > 30) {
                fpsCounter.style.color = 'yellow';
            } else {
                fpsCounter.style.color = 'red';
            }
        }

        requestAnimationFrame(updateDisplay);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F9') {
            fpsVisible = !fpsVisible;
            fpsCounter.style.display = fpsVisible ? 'block' : 'none';
            pingDisplay.style.display = fpsVisible ? 'block' : 'none';
        }
    });

    updateDisplay();
})();
