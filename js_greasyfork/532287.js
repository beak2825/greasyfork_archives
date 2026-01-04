// ==UserScript==
// @name         Infinite Craft Random Button (Simulates Drag & Drop)
// @namespace    none
// @version      2024-04-09
// @description  Combine two random discovered items in Infinite Craft by simulating drag & drop (safe approach)
// @author       Gonso
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532287/Infinite%20Craft%20Random%20Button%20%28Simulates%20Drag%20%20Drop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532287/Infinite%20Craft%20Random%20Button%20%28Simulates%20Drag%20%20Drop%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 200);
    }

    function getDiscoveredItems() {
        return Array.from(document.querySelectorAll('.items .item'));
    }

    function simulateDragAndDrop(item, x, y) {
        const rect = item.getBoundingClientRect();

        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        item.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: startX,
            clientY: startY
        }));

        document.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            clientX: x,
            clientY: y
        }));

        document.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            clientX: x,
            clientY: y
        }));
    }

    function getCenter(offsetY = 0) {
        return [
            Math.floor(window.innerWidth / 2),
            Math.floor(window.innerHeight / 2) + offsetY
        ];
    }

    waitForElement('.side-controls', (controls) => {
        const btn = document.createElement('img');
        btn.src = 'https://api.iconify.design/ic:outline-question-mark.svg';
        btn.style.width = '23px';
        btn.style.cursor = 'pointer';
        btn.style.margin = '6px';
        btn.title = 'Random Combine';

        controls.insertBefore(btn, controls.firstChild);

        btn.addEventListener('click', () => {
            const items = getDiscoveredItems();
            if (items.length < 2) {
                alert('You need at least 2 items!');
                return;
            }

            const shuffled = items.sort(() => Math.random() - 0.5);
            const [item1, item2] = shuffled;

            const [centerX, centerY] = getCenter();

            // Simulate drag & drop
            simulateDragAndDrop(item1, centerX, centerY - 30);
            setTimeout(() => {
                simulateDragAndDrop(item2, centerX, centerY + 30);
            }, 200);
        });

        console.log('[Tampermonkey] Random combine button added!');
    });
})();
