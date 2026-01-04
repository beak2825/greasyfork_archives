// ==UserScript==
// @name         Map Modes v2
// @namespace    https://u.cubeupload.com/laddy/drums.gif
// @version      2.0.0
// @description  Adds map modes to PxP canvases
// @author       Ladis
// @match        https://pixelplace.io/*
// @exclude      https://pixelplace.io/forums*
// @exclude      https://pixelplace.io/blog*
// @exclude      https://pixelplace.io/api*
// @exclude      https://pixelplace.io/gold-chart.php
// @exclude      https://pixelplace.io/*ypp=true
// @icon         https://img.icons8.com/?size=80&id=30566&format=png
// @run-at       document-end
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545334/Map%20Modes%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/545334/Map%20Modes%20v2.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(async () => {
    'use strict';

    // --- Main Module ---
    const MapModes = {

        /** State */
        cachedImages: {},
        currentOverlay: '',
        overlayCanvas: null,
        overlayCtx: null,

        /** Initialize the script */
        async init() {
            await this.getOverlayLinks();
            const paintingId = window.location.pathname.split('-')[0].slice(1);
            if (!this.overlayLinks[paintingId]) return; // no overlays for this canvas

            const canvas = await this.waitForCanvas();
            this.createOverlayCanvas(canvas);
            this.createUI(paintingId);
        },

        /** Get overlay links via API */
        async getOverlayLinks() {
            try {
                const response = await fetch('https://api.jsonsilo.com/public/c334751e-0a4b-4499-9d6d-05af19d0890b');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                this.overlayLinks = data.overlayLinks;
            } catch (error) {
                console.error("Could not get overlay links:", error);
            }
        },

        /** Wait until the PixelPlace canvas exists */
        async waitForCanvas() {
            let canvas;
            do {
                canvas = document.getElementById('canvas');
                await new Promise(r => setTimeout(r, 500));
            } while (!canvas);
            return canvas;
        },

        /** Create the overlay canvas */
        createOverlayCanvas(canvas) {
            const overlayCanvas = canvas.cloneNode();
            overlayCanvas.removeAttribute('id');
            overlayCanvas.style.imageRendering = 'pixelated';
            overlayCanvas.style.pointerEvents = 'none';
            overlayCanvas.style.position = 'absolute';
            overlayCanvas.style.top = 0;
            overlayCanvas.style.left = 0;
            overlayCanvas.style.zIndex = 0;
            overlayCanvas.style.opacity = 0;

            canvas.after(overlayCanvas);

            this.overlayCanvas = overlayCanvas;
            this.overlayCtx = overlayCanvas.getContext('2d');
        },

        /** Create the top bar UI */
        createUI(paintingId) {
            // Inject styles
            const style = document.createElement('style');
            style.textContent = `
                .mm-wrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: .3em;
                    z-index: 10;
                    font-family: sans-serif;
                }
                .mm-wrapper select,
                .mm-wrapper button,
                .mm-wrapper input[type="range"] {
                    color: #444;
                    font-weight: bold;
                    background: beige;
                    padding: 0.4em 0.8em;
                    border-radius: 7px;
                    border: 1px solid #ccc;
                    font-size: 0.9em;
                    line-height: 1.25em;
                    height: 2.5em;
                }
                .mm-wrapper button:hover {
                    background: lightgoldenrodyellow;
                    cursor: pointer;
                }
                .mm-wrapper input[type="range"] {
                    width: min-content;
                }
            `;
            document.head.append(style);

            const wrapper = document.createElement('div');
            wrapper.className = 'mm-wrapper';

            // Mode select
            const select = document.createElement('select');
            for (const mode of Object.keys(this.overlayLinks[paintingId])) {
                const option = document.createElement('option');
                option.value = option.textContent = mode;
                select.appendChild(option);
            }

            // Opacity range
            const range = document.createElement('input');
            range.type = 'range';
            range.min = 0;
            range.max = 1;
            range.step = 0.1;
            range.value = 1;
            range.title = 'Canvas opacity';
            range.oninput = () => {
                if (this.currentOverlay) this.overlayCanvas.style.opacity = range.value;
            };

            // Apply button
            const button = document.createElement('button');
            button.textContent = 'Apply';
            button.onclick = () => this.addOverlay(paintingId, select.value, range.value);

            wrapper.append(select, button, range);
            document.getElementById('container').prepend(wrapper);
        },

        /** Load and display an overlay */
        addOverlay(paintingId, mode, opacity) {
            // Toggle opacity if the same mode is clicked again
            if (this.currentOverlay === mode) {
                this.overlayCanvas.style.opacity = +this.overlayCanvas.style.opacity === 0 ? opacity : 0;
                return;
            }

            this.currentOverlay = mode;

            // Use cache if present
            if (this.cachedImages[mode]) {
                this.overlayCtx.drawImage(this.cachedImages[mode], 0, 0);
                this.overlayCanvas.style.opacity = opacity;
                return;
            }

            // Load new image
            const img = new Image();
            img.onload = () => {
                this.overlayCtx.drawImage(img, 0, 0);
                this.overlayCanvas.style.opacity = opacity;
                this.cachedImages[mode] = img;
            };
            img.src = this.overlayLinks[paintingId][mode];
        },
    };

    // --- Run the script ---
    MapModes.init();
})();
