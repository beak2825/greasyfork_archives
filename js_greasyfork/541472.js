// ==UserScript==
// @name         archer_range
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  не подходи на прямую нубас
// @author       Kogich
// @license      MIT
// @match        https://*.lordswm.com/war*
// @match        https://*.heroeswm.ru/war*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/541472/archer_range.user.js
// @updateURL https://update.greasyfork.org/scripts/541472/archer_range.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const uw = unsafeWindow;
    const highlightColor = "rgba(0, 255, 0, 0.3)";
    const highlighted = [];
    let isRangeVisible = false;
    let currentUnit = null;

    function paint_coords(x, y, color) {
        const tile = uw.shado?.[x + y * uw.defxn];
        if (!tile) return;
        tile.fill(color);
        uw.set_visible(tile, 1);
    }

    function clear_coords(x, y) {
        const tile = uw.shado?.[x + y * uw.defxn];
        if (!tile) return;
        tile.fill(null);
        uw.set_visible(tile, 0);
    }

    function showRange(unit) {
        const range = unit.range || unit.maxrange || unit.real_range || 6;
        const ux = unit.x;
        const uy = unit.y;

        console.log(`[N] ${unit.nametxt} (${unit.nownumber}) → range: ${range}`);

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const tx = ux + dx;
                const ty = uy + dy;
                if (tx >= 0 && ty >= 0 && tx <= uw.defxn && ty <= uw.defyn) {
                    const dist2 = dx * dx + dy * dy;
                    if (dist2 <= range * range) {
                        paint_coords(tx, ty, highlightColor);
                        highlighted.push([tx, ty]);
                    }
                }
            }
        }
    }

    function clearRange() {
        for (const [x, y] of highlighted) {
            clear_coords(x, y);
        }
        highlighted.length = 0;
    }

    function getUnitAt(x, y) {
        const objs = uw.stage?.pole?.obj;
        if (!objs) return null;

        for (let i in objs) {
            const unit = objs[i];
            if (!unit || typeof unit.x !== "number" || typeof unit.y !== "number") continue;
            if (unit.x === x && unit.y === y && unit.shooter && unit.nowhealth > 0) {
                return unit;
            }
        }

        return null;
    }

    function monitorKey() {
        document.addEventListener("keydown", (e) => {
            if (e.code !== "KeyN") return;

            if (isRangeVisible) {
                clearRange();
                isRangeVisible = false;
                currentUnit = null;
                return;
            }

            const x = uw.xr_last;
            const y = uw.yr_last;
            const unit = getUnitAt(x, y);

            if (!unit) {
                console.log(`[N] Shooter not found at (${x}, ${y})`);
                return;
            }

            currentUnit = unit;
            showRange(currentUnit);
            isRangeVisible = true;
        });
    }

    function monitorMouseRepaint() {
        document.addEventListener("mousemove", () => {
            if (isRangeVisible && currentUnit) {
                clearRange();
                showRange(currentUnit);
            }
        });
    }

    const initInterval = setInterval(() => {
        if (uw.stage?.pole?.obj && uw.shado && uw.xr_last !== undefined) {
            monitorKey();
            monitorMouseRepaint();
            clearInterval(initInterval);

        }
    }, 1000);
})();
