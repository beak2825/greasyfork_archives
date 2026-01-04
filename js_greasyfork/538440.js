// ==UserScript==
// @name         Degrees of Lewdity - Grid Tracker
// @namespace    magoo_scripts
// @version      2.01
// @description  Tracks player position and POIs in Bird Hunt and Tentacle Plains minigames with a custom GUI.
// @author       You
// @match        file:///*/Degrees%20of%20Lewdity/*
// @icon         https://static.wikitide.net/degreesoflewditywiki/6/64/Favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538440/Degrees%20of%20Lewdity%20-%20Grid%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538440/Degrees%20of%20Lewdity%20-%20Grid%20Tracker.meta.js
// ==/UserScript==

/* globals SugarCube */

console.info("🌐 Degrees of Lewdity - Grid Tracker: Script Loaded");

(function () {
    'use strict';

    const gridSize = 11;
    const gridCenter = Math.floor(gridSize / 2);
    let currentGame = null;

    const POI_ICONS = {
        birdHunt: {
            '♖': () => [0, 0],
            '𐂂': () => getCoords(SugarCube.State.variables.daily, 'huntRemyCampEast', 'huntRemyCampNorth'),
            '🏕': () => getCoords(SugarCube.State.variables.daily, 'emptyCampEast', 'emptyCampNorth'),
        },
        tentaclePlains: {
            '𖦹': () => getCoords(SugarCube.State.variables, 'tentportaleast', 'tentportalnorth'),
            '🌶': () => [4, 4],
        }
    };

    const POI_DESCRIPTIONS = {
        '♖': 'Tower',
        '𐂂': "Remy's Goons",
        '🏕': 'Empty Camp',
        '𖦹': "<span class='jitter-text jitter-1 purple'>Portal</span>",
        '🌶': 'Pepper Spray'
    };

    function getCoords(obj, xKey, yKey) {
        const x = obj?.[xKey];
        const y = obj?.[yKey];
        return (x === undefined || y === undefined) ? null : [x, y];
    }

    function isGameRunning() {
        const psg = SugarCube?.State?.variables?.passage ?? "";
        if (psg.startsWith("Bird Hunt")) return "birdHunt";
        if (psg.startsWith("Tentacle Plains")) return "tentaclePlains";
        return null;
    }

    function getPlayerCoords(game) {
        if (game === "birdHunt") {
            return [
                SugarCube.State.variables.bird?.hunts?.distanceEast ?? 0,
                SugarCube.State.variables.bird?.hunts?.distanceNorth ?? 0
            ];
        } else if (game === "tentaclePlains") {
            return [
                SugarCube.State.variables.tenteast ?? 0,
                SugarCube.State.variables.tentnorth ?? 0
            ];
        }
        return [0, 0];
    }

    function clearGrid() {
        document.querySelector("#dol-grid-overlay")?.remove();
    }

    function drawGrid() {
        clearGrid();

        const [px, py] = getPlayerCoords(currentGame);
        const container = document.createElement("div");
        container.id = "dol-grid-overlay";
        container.style.position = "fixed";
        container.style.top = "40px";
        container.style.right = "10px";
        container.style.background = "rgba(0,0,0,0.5)";
        container.style.padding = "5px";
        container.style.fontFamily = "monospace";
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;
        container.style.userSelect = "none";

        const poiMap = POI_ICONS[currentGame] || {};
        const renderedPOIs = {};

        for (const [icon, getCoord] of Object.entries(poiMap)) {
            const coords = getCoord();
            if (Array.isArray(coords)) {
                const key = coords.join(",");
                if (!renderedPOIs[key]) renderedPOIs[key] = [];
                renderedPOIs[key].push(icon);
            }
        }

        for (let y = gridCenter; y > -gridCenter - 1; y--) {
            for (let x = -gridCenter; x < gridCenter + 1; x++) {
                const cell = document.createElement("div");
                const coordKey = `${x},${y}`;
                cell.style.position = "relative";
                cell.style.width = "20px";
                cell.style.height = "20px";
                cell.style.textAlign = "center";
                cell.style.lineHeight = "20px";
                cell.style.fontSize = "14px";
                cell.style.border = "1px dotted #1c1c1c";
                cell.style.cursor = "default";
                cell.style.color = "#fff";
                cell.style.userSelect = "none";
                cell.dataset.x = x;
                cell.dataset.y = y;

                const icons = renderedPOIs[coordKey] ? [...renderedPOIs[coordKey]] : [];

                const playerHere = (x === px && y === py);

                if (playerHere) {
                    if (icons.length === 0) {
                        icons.push("𐀪");
                        cell.textContent = icons.join(",");
                        cell.style.color = "#8c6";
                    } else {
                        cell.textContent = icons.join(",");
                        const tinyPlayer = document.createElement("div");
                        tinyPlayer.textContent = "𐀪";
                        tinyPlayer.style.color = "#8c6";
                        tinyPlayer.style.background = "black";
                        tinyPlayer.style.borderRadius = "10px";
                        tinyPlayer.style.padding = "1px 0 0 1px";
                        tinyPlayer.style.position = "absolute";
                        tinyPlayer.style.bottom = "1px";
                        tinyPlayer.style.right = "0px";
                        tinyPlayer.style.fontSize = "10px";
                        tinyPlayer.style.lineHeight = "10px";
                        tinyPlayer.style.pointerEvents = "none";
                        cell.appendChild(tinyPlayer);
                    }
                } else {
                    cell.textContent = icons.join(",");
                }

                if (currentGame === "tentaclePlains" && renderedPOIs[coordKey]?.includes("🌶") &&
                    SugarCube.State.variables.tentspray !== 1) {
                    cell.style.color = "red";
                }
                if (currentGame === "tentaclePlains" && renderedPOIs[coordKey]?.includes("𖦹")) {cell.style.color = "purple"}
                if (currentGame === "birdHunt"       && renderedPOIs[coordKey]?.includes("𐂂")) {cell.style.color = "orange"}
                if (currentGame === "birdHunt"       && renderedPOIs[coordKey]?.includes("🏕")) {cell.style.color = "darkcyan"}

                if (x === -5 || y === -5) {
                    const tinyCoord = document.createElement("div");
                    tinyCoord.textContent = x === -5 ? y : x;
                    tinyCoord.style.color = "#333";
                    tinyCoord.style.width = "8px";
                    tinyCoord.style.position = "absolute";
                    tinyCoord.style.bottom = "-2px";
                    tinyCoord.style.left = "-1px";
                    tinyCoord.style.fontSize = "7px";
                    tinyCoord.style.lineHeight = "10px";
                    tinyCoord.style.textAlign = "right";
                    cell.appendChild(tinyCoord);
                }

                cell.addEventListener("mouseenter", showTooltip);
                cell.addEventListener("mousemove", moveTooltip);
                cell.addEventListener("mouseleave", removeTooltip);

                container.appendChild(cell);
            }
        }

        document.body.appendChild(container);
    }

    function showTooltip(e) {
        removeTooltip();
        const x = this.dataset.x;
        const y = this.dataset.y;
        const icons = this.textContent.split(",").filter(Boolean);

        const playerOnCell = (parseInt(x) === getPlayerCoords(currentGame)[0]) && (parseInt(y) === getPlayerCoords(currentGame)[1]);
        if (playerOnCell && !icons.includes("𐀪")) {
            icons.push("𐀪");
        }

        const lines = [];
        for (const icon of icons) {
            if (icon === "𐀪") {
                lines.push("You are here.");
            } else if (POI_DESCRIPTIONS[icon]) {
                if (icon === "🌶" && SugarCube.State.variables.tentspray === 1) {
                    lines.push("Pepper Spray<br><span style='font-size:0.6em;color:gray'>(Already Acquired)</span>");
                } else {
                    lines.push(`${POI_DESCRIPTIONS[icon]}`);
                }
            }
        }

        lines.push(`<span style='font-size:0.6em;color:lightgray'>( ${x}, ${y} )</span>`);
        const tip = document.createElement("div");
        tip.className = "tooltip-popup";
        tip.style.textAlign = "center";
        tip.style.transform = "Scale(0.9)";
        tip.innerHTML = lines.join("<br>");
        document.body.appendChild(tip);
        e.currentTarget._tooltip = tip;
        moveTooltip.call(e.currentTarget, e);
    }

    function moveTooltip(e) {
        const tip = e.currentTarget._tooltip;
        if (!tip) return;
        const offsetX = 15;
        const offsetY = 15;
        const maxX = window.innerWidth - tip.offsetWidth - 5;
        const maxY = window.innerHeight - tip.offsetHeight - 5;

        let left = e.clientX + offsetX;
        let top = e.clientY + offsetY;

        if (left > maxX) left = maxX;
        if (top > maxY) top = maxY;

        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
    }

    function removeTooltip() {
        document.querySelectorAll(".tooltip-popup").forEach(t => t.remove());
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                return;
            }
            const waitObserver = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });
            waitObserver.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    // Inject additional CSS
    const style = document.createElement("style");
    style.textContent = `
        #story:has(~#dol-grid-overlay) .passage {
            padding-right: 240px;
        }`;
    document.head.appendChild(style);

    // Setup mutation observer and draw grid on initial load
    const observer = new MutationObserver(() => {
        const newGame = isGameRunning();
        if (newGame !== currentGame) {
            currentGame = newGame;
            clearGrid();
            if (currentGame) drawGrid();
        } else if (currentGame) {
            drawGrid();
        }
    });

    waitForElement("#passages").then(el => {
        observer.observe(el, { childList: true, subtree: true });

        // Trigger an initial draw if already in game
        currentGame = isGameRunning();
        if (currentGame) {
            drawGrid();
        }
    });

})();