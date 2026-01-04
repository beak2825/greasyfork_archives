// ==UserScript==
// @name         [Diep.io] Sandbox Auto Respawn & Lvl Up
// @version      1.2
// @description  Auto Level Up & Respawn
// @author       _Vap
// @icon           https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @match        https://diep.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1245572
// @downloadURL https://update.greasyfork.org/scripts/484355/%5BDiepio%5D%20Sandbox%20Auto%20Respawn%20%20Lvl%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/484355/%5BDiepio%5D%20Sandbox%20Auto%20Respawn%20%20Lvl%20Up.meta.js
// ==/UserScript==

// Change these variables to false if you want to disable one of the features
let level = true;
let spawn = true;

// Change whats between the quotes to change the name to spawn with.
let spawnName = "";

setInterval(() => {
    if (level === true) {
        window.input.key_down(75);
    } else return;

    if (spawn === true) {
        window.input.execute(`game_spawn "${spawnName}"`);
    } else return;
}, 150);