// ==UserScript==
// @name         Diep.io Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Shomei14's Dark Mode
// @author       You
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540748/Diepio%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540748/Diepio%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const applyDarkMode = () => {
        input.execute("net_replace_color 8 0x232323"); // Squares
        input.execute("net_replace_color 9 0x232323"); // Triangles
        input.execute("net_replace_color 10 0x232323"); // Pentagons
        input.execute("net_replace_color 11 0x826483"); // Crashers
        input.execute("net_replace_color 14 0x202020"); // Maze Walls
        input.execute("ren_background_color 0x131313"); // Background
        input.execute("ui_replace_colors 0x202020 0x202020 0x202020 0x202020 0x202020 0x202020 0x202020 0x202020"); // Stat Colors and Backgrounds of Achievements and Upgrades (Goes from Movement Speed to Health Regeneration)
    };

    const waitForInput = setInterval(() => {
        if (typeof input !== "undefined" && typeof input.execute === "function") {
            clearInterval(waitForInput);
            applyDarkMode();
        }
    }, 100);
})();