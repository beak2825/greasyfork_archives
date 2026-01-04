// ==UserScript==
// @name         Aternos Auto Button Clicker
// @namespace    -
// @version      1.2
// @description  Automates button clicking on Aternos menus to save time and reduce repetitive tasks.
// @author       Taichums
// @match        https://aternos.org/*
// @icon         https://aternos.org/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473467/Aternos%20Auto%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/473467/Aternos%20Auto%20Button%20Clicker.meta.js
// ==/UserScript==

// Features:
// - Automatically clicks buttons in specific menus on Aternos
// - Works with ad blockers to streamline navigation

const debug = false; // Toggle debug mode

function clickButtons() {
    try {
        const elements = document.querySelectorAll(".btn.btn-white.SDZZVHLLAEzR");
        elements.forEach(element => {
            element.click();
            if (debug) {
                console.log('Clicked!');
            }
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

addEventListener("load", () => {
    setInterval(() => {
        clickButtons();
    }, 5 * 60 * 1000); // 5 minutes interval
    // Initial click
    clickButtons();
});