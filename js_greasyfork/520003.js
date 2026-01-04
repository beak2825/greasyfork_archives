// ==UserScript==
// @name         really cool ffa theme
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @description  :)
// @author       alc
// @match        https://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520003/really%20cool%20ffa%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/520003/really%20cool%20ffa%20theme.meta.js
// ==/UserScript==

const INTERVAL_IN_SECONDS = 0.08;

main();

function main() {
    setInterval(doTheThing, INTERVAL_IN_SECONDS * 1000);
}

function doTheThing() {
    const NUM_NET_COLORS = 18;
    const NUM_UI_COLORS = 8;
    const NUM_OTHER_COLORS = 11;

    let colors = [];

    // net_replace_colors

    for (let i = 0; i < NUM_NET_COLORS; i++) {
        colors[i] = randomHexColor();
    }

    let netString = "net_replace_colors";
    for (let i = 0; i < NUM_NET_COLORS; i++) {
        netString += " ";
        netString += colors[i];
    }

    // ui_replace_colors

    for (let i = 0; i < NUM_UI_COLORS; i++) {
        colors[i] = randomHexColor();
    }

    let uiString = "ui_replace_colors";
    for (let i = 0; i < NUM_UI_COLORS; i++) {
        uiString += " ";
        uiString += colors[i];
    }

    // other

    for (let i = 0; i < NUM_UI_COLORS; i++) {
        colors[i] = randomHexColor();
    }

    input.execute(netString);
    input.execute(uiString);

    // aaaaaaaaaaaaaaaaaa

    input.execute("ren_background_color " + colors[0]);
    input.execute("ren_border_color " + colors[1]);
    input.execute("ren_minimap_background_color " + colors[2]);
    input.execute("ren_minimap_border_color " + colors[3]);
    input.execute("ren_health_fill_color " + colors[4]);
    input.execute("ren_health_background_color " + colors[5]);
    input.execute("ren_xp_bar_fill_color " + colors[6]);
    input.execute("ren_score_bar_fill_color " + colors[7]);
    input.execute("ren_bar_background_color " + colors[8]);
    input.execute("ren_stroke_solid_color " + colors[9]);
    input.execute("ren_grid_color " + colors[10]);
}

// i wuv pwoxy <3 uwu

function randomHexColor() {
    const hex = '0123456789ABCDEF';
    let output = '0x';

    for (let i = 0; i < 6; i++) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }

    return output;
}