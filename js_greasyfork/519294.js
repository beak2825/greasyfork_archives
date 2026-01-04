// ==UserScript==
// @name         Get All Colors in game (Updated 2025)
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  console logs all colors in the new diep.io theme format
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519294/Get%20All%20Colors%20in%20game%20%28Updated%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519294/Get%20All%20Colors%20in%20game%20%28Updated%202025%29.meta.js
// ==/UserScript==

let diep_user_colors;
function get_style_color(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}

function update_your_colors() {
    let temp_container = {
        // Core render colors
        background: get_style_color("--theme-color-backgroundColor"),
        bar_background: get_style_color("--theme-color-barBackground"),
        border: get_style_color("--theme-color-worldBorderColor"),
        grid: get_style_color("--theme-color-gridColor"),
        healthbar_back: get_style_color("--theme-color-healthBarBackground"),
        healthbar_front: get_style_color("--theme-color-healthBarFill"),
        minimap: get_style_color("--theme-color-minimapBackgroundColor"),
        minimap_border: get_style_color("--theme-color-minimapBorderColor"),
        scorebar: get_style_color("--theme-color-scoreBarFillColor"),
        solid_border: get_style_color("--theme-color-border-color") || get_style_color("--theme-color-shadowColor"), // fallback
        xp_bar: get_style_color("--theme-color-xpBarFillColor"),

        // UI Colors
        ui1: get_style_color("--theme-color-uiColor1"),
        ui2: get_style_color("--theme-color-uiColor2"),
        ui3: get_style_color("--theme-color-uiColor3"),
        ui4: get_style_color("--theme-color-uiColor4"),
        ui5: get_style_color("--theme-color-uiColor5"),
        ui6: get_style_color("--theme-color-uiColor6"),
        ui7: get_style_color("--theme-color-uiColor7"),

        // Team and entity colors
        smasher_and_dominator: get_style_color("--theme-color-smasherColor"),
        barrels: get_style_color("--theme-color-cannonColor"),
        body: get_style_color("--theme-color-oldOutlineColor"),
        blue_team: get_style_color("--theme-color-blueTeamColor"),
        red_team: get_style_color("--theme-color-redTeamColor"),
        purple_team: get_style_color("--theme-color-purpleTeamColor"),
        green_team: get_style_color("--theme-color-greenTeamColor"),
        shiny_shapes: get_style_color("--theme-color-shinyShapeColor"),
        square: get_style_color("--theme-color-squareColor"),
        triangle: get_style_color("--theme-color-triangleColor"),
        pentagon: get_style_color("--theme-color-pentagonColor"),
        crashers: get_style_color("--theme-color-crasherColor"),
        arena_closers_neutral_dominators: get_style_color("--theme-color-arenaCloserColor"),
        scoreboard_ffa_etc: get_style_color("--theme-color-ffaEnemyColor"),
        maze_walls: get_style_color("--theme-color-mazeWallColor"),
        others_ffa: get_style_color("--theme-color-ffaFriendlyColor"),
        necromancer_squares: get_style_color("--theme-color-necroDroneColor"),
        fallen_bosses: get_style_color("--theme-color-fallenBossColor")
    };

    diep_user_colors = temp_container;
}

// 🟩 New helper — converts "rgb(...)" → hex for optional use
function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match) return rgb;
    const [r, g, b] = match.map(Number);
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

// 🟦 New helper — pretty-print with actual color preview
function logColors(colors) {
    console.log("%c────────── DIEP.IO THEME COLORS ──────────", "color: white; background: black; font-weight: bold;");
    for (const [name, value] of Object.entries(colors)) {
        const display = value || "undefined";
        console.log(`%c${name.padEnd(28)} %c${display}`, "color: white; background: #222; padding:2px 4px; border-radius:4px;", `color: ${value}; font-weight: bold;`);
    }
    console.log("%c──────────────────────────────────────────", "color: white; background: black; font-weight: bold;");
}

// 🔁 Auto-update loop
setInterval(() => {
        update_your_colors();
        //console.clear();
        //logColors(colors);
}, 1500);
