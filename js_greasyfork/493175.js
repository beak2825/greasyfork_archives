// ==UserScript==
// @name        simplemmo auto gather, by imtiyaz
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/crafting/material/gather/*
// @grant       none
// @version     1.2
// @author      BumbiSkyRender
// @description 4/22/2024, 3:07:23 PM
// @downloadURL https://update.greasyfork.org/scripts/493175/simplemmo%20auto%20gather%2C%20by%20imtiyaz.user.js
// @updateURL https://update.greasyfork.org/scripts/493175/simplemmo%20auto%20gather%2C%20by%20imtiyaz.meta.js
// ==/UserScript==

const gatherBtn = document.querySelector('[class=" nightwind-prevent mt-2 inline-flex text-xs sm:text-sm items-center justify-center px-4 py-2 h-12 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"]');
if (!gatherBtn) {
  window.location = "https://web.simple-mmo.com/travel";
}

function click(button) {
    const rect = button.getBoundingClientRect();

    // Calculate random coordinates within the button's area
    const offsetX = Math.random() * rect.height;
    const offsetY = Math.random() * rect.width;

    // Simulate a click at a random position within the button
    button.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            clientX: rect.left + offsetX,
            clientY: rect.top + offsetY
        })
    );
}

function getRandomOffset() {  // to not get banned lol
    // Generate a random offset between -5 and 5 (adjust as needed)
    return Math.random() * (50 + 50) - 50;
}

function getRandomInterval(max, min) {
    // Generate a random interval between min and max
    return Math.random() * (max - min) + min;
}

function gather() {
  click(gatherBtn);
}

setInterval(gather, getRandomInterval(2000, 2500));