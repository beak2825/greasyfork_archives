// ==UserScript==
// @name         Heatmap for Splix.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a heatmap feature to the minimap in Splix.io, highlighting recently captured territories in white, which fades to black over time.
// @author       fr13ndly
// @license      MIT
// @match        *://splix.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=splix.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463126/Heatmap%20for%20Splixio.user.js
// @updateURL https://update.greasyfork.org/scripts/463126/Heatmap%20for%20Splixio.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const MAX_HEAT_LEVEL = 5;

    class Heatmap {
        constructor() {
            this.isInitialUpdate = true;
            this.heatCells = [];
        }

        update(cells) {
            // HeatCell not found in cells? Remove it.
            for (let i = this.heatCells.length; i > 0; i--) {
                const heatCell = this.heatCells[i - 1];
                const cell = cells.findIndex(
                    (c) => c.x == heatCell.x && c.y == heatCell.y
                );

                if (cell == -1) {
                    this.heatCells.splice(i - 1, 1);
                }
            }
            // Update hot levels
            for (const cell of cells) {
                const heatCell = this.heatCells.find(
                    (c) => c.x == cell.x && c.y == cell.y
                );
                if (heatCell) {
                    if (heatCell.heatLevel > 0) {
                        heatCell.heatLevel--;
                    }
                    continue;
                }
                // Not found - create "hot" cell
                this.heatCells.push({
                    x: cell.x,
                    y: cell.y,
                    heatLevel: this.isInitialUpdate ? 0 : MAX_HEAT_LEVEL,
                });
            }
            this.isInitialUpdate = false;
        }

        get cells() {
            return this.heatCells;
        }
    }

    class HeatmapUtils {
        static getHeatCellColor(heatLevel) {
            const lightness = (100 / MAX_HEAT_LEVEL) * heatLevel;
            return `hsl(0, 0%, ${lightness}%)`;
        }
    }

    var HEATMAPS = {};

    // Setup custom handlers
    window.addEventListener("load", function () {
        window.doConnect = new Proxy(window.doConnect, {
            apply: (target, thisArg, argArray) => {
                const retValue = target.apply(thisArg, argArray);

                // Modify ws.onmessage handler
                if (window.ws) {
                    window.ws.onmessage = new Proxy(window.ws.onmessage, {
                        apply: (target, thisArg, argArray) => {
                            const retValue = target?.apply(thisArg, argArray);

                            heatmapWSMessageHandler.apply(thisArg, argArray);

                            return retValue;
                        },
                    });
                }

                return retValue;
            },
        });
    });

    function heatmapWSMessageHandler(e) {
        const m = new Uint8Array(e.data);

        if (m[0] != receiveAction.MINIMAP) {
            return;
        }

        const part = m[1];
        const z = 20 * part;

        if (!HEATMAPS[part]) {
            HEATMAPS[part] = new Heatmap();
        }

        const currentHeatmap = HEATMAPS[part];
        const partCells = [];

        // Unpack cells
        for (let i = 1; i < m.length; i++) {
            // Process each bit
            for (let b = 0; b < 8; b++) {
                const isBitSet = (m[i] & (1 << b)) !== 0;
                if (isBitSet) {
                    const Q = 8 * (i - 2) + b;
                    const x = (Math.floor(Q / 80) % 80) + z;
                    const y = Q % 80;

                    partCells.push({ x, y });
                }
            }
        }

        // Update heatmap
        currentHeatmap.update(partCells);

        // Clear minimap area
        minimapCtx.clearRect(2 * z, 0, 40, 160);
        minimapCtx.fillStyle = "#000000";

        // Render cells
        for (const heatCell of currentHeatmap.cells) {
            minimapCtx.fillStyle = HeatmapUtils.getHeatCellColor(
                heatCell.heatLevel
            );
            minimapCtx.fillRect(2 * heatCell.x, 2 * heatCell.y, 2, 2);
        }
    }
})();
