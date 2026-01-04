// ==UserScript==
// @name         Infinite Craft auto maker -bugged
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Very fast automatic item explorer for infinite craft with a specific item
// @author       Aetherium
// @match        https://neal.fun/infinite-craft/
// @icon         https://cdn.discordapp.com/attachments/1149405048049254521/1213453447312179250/Leaf-PlexusBot.jpg?ex=65f58796&is=65e31296&hm=9429f9b475e4c8240d555afd1626549b179d6689dff76bd343d67de9898fe102&
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488798/Infinite%20Craft%20auto%20maker%20-bugged.user.js
// @updateURL https://update.greasyfork.org/scripts/488798/Infinite%20Craft%20auto%20maker%20-bugged.meta.js
// ==/UserScript==

let totalElements = 0;
let currentElement = 0;
let nextElement = 0;
let mobileItems;
let specificItem = 'wood'; // Change this to the item you want to craft with (e.g., 'wood', 'stone', 'iron', etc.)

function updateElements() {
    mobileItems = document.querySelectorAll('.mobile-item');
    if (mobileItems.length >= 2) {
        totalElements = mobileItems.length;
        currentElement = getRandomElementIndex(totalElements);
        nextElement = getRandomElementIndex(totalElements);
        while (nextElement === currentElement) {
            nextElement = getRandomElementIndex(totalElements);
        }
        if (mobileElementInRange(currentElement)) {
            if (mobileItems[currentElement].querySelector('.item').innerText.toLowerCase() === specificItem) {
                mobileItems[currentElement].querySelector('.item').click();
            }
        }
        if (mobileItems) {
            if (mobileItems[nextElement].querySelector('.item').innerText.toLowerCase() === specificItem) {
                mobileItems[nextElement].querySelector('.item').click();
            }
        }
    }
    document.title = `${currentElement}+${nextElement}|${totalElements}`;
}

function mobileElementInRange(index) {
    return index >= 0 && index < totalElements;
}

function getRandomElementIndex(max) {
    return Math.floor(Math.random() * max);
}

function animate() {
    updateElements();
    setTimeout(animate, 200); // Change this to 200 for not rate limited
}

animate();