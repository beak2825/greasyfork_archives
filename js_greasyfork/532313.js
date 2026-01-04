// ==UserScript==
// @name         Infinite Craft Random Button (2025 Fixed Version)
// @namespace    http://your-namespace.example
// @version      2025.04.09
// @description  Drop two random elements into Infinite Craft play area with one click
// @author       You
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532313/Infinite%20Craft%20Random%20Button%20%282025%20Fixed%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532313/Infinite%20Craft%20Random%20Button%20%282025%20Fixed%20Version%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    // Wait for Vue app to load
    while (!document.querySelector('.container')?.__vue__) {
        await wait(100);
    }

    const app = document.querySelector('.container').__vue__;
    const main = app.$children[0] || app;

    const getItems = () => Array.from(document.querySelectorAll('.items .item'));
    const getRandomItem = () => {
        const items = getItems();
        return items[Math.floor(Math.random() * items.length)];
    };

    const getCenterCoords = (offsetY = 0) => {
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2 + offsetY;
        return [x, y];
    };

    // Create the button
    const randomButton = document.createElement('img');
    randomButton.src = 'https://api.iconify.design/ic:outline-question-mark.svg';
    randomButton.style.width = '24px';
    randomButton.style.cursor = 'pointer';
    randomButton.style.margin = '8px';

    const controls = document.querySelector('.side-controls');
    controls.insertBefore(randomButton, controls.firstChild);

    randomButton.addEventListener('click', async () => {
        const item1 = getRandomItem();
        const item2 = getRandomItem();

        const simulateDrop = async (item, offsetY) => {
            // Simulate dragging the element
            item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await wait(50);

            const [x, y] = getCenterCoords(offsetY);
            document.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                clientX: x,
                clientY: y
            }));
            await wait(50);

            document.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                clientX: x,
                clientY: y
            }));

            await wait(100);
        };

        await simulateDrop(item1, -40);
        await simulateDrop(item2, 40);
    });
})();
