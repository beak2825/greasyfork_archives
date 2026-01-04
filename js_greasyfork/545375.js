// ==UserScript==
// @name         Torn Bazaar Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Randomizes Torn Bazaar items by simulating drag-and-drop on manage page
// @author       Sanwise [3401293]
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545375/Torn%20Bazaar%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/545375/Torn%20Bazaar%20Randomizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Bazaar Randomizer] Script started');

    function checkAndInject() {
        if (window.location.hash.startsWith('#/manage')) {
            const container = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
            if (container && !document.getElementById('bazaarRandomizeBox')) {
                console.log('[Bazaar Randomizer] Manage page detected, container found');
                injectFloatingButton();
            }
        }
    }

    window.addEventListener('load', () => {
        const interval = setInterval(() => {
            checkAndInject();
            if (document.getElementById('bazaarRandomizeBox')) clearInterval(interval);
        }, 500);
    });

    window.addEventListener('hashchange', () => {
        checkAndInject();
    });

    function injectFloatingButton() {
        console.log('[Bazaar Randomizer] Injecting button');

        if (document.getElementById('bazaarRandomizeBox')) return;

        const box = document.createElement('div');
        box.id = 'bazaarRandomizeBox';
        Object.assign(box.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            zIndex: 99999,
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            cursor: 'move',
            userSelect: 'none',
        });

        const btn = document.createElement('button');
        btn.textContent = '🎲 Randomize Items';
        Object.assign(btn.style, {
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '5px',
            cursor: 'pointer',
        });

        box.appendChild(btn);
        document.body.appendChild(box);

        let offsetX, offsetY, dragging = false;
        box.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - box.offsetLeft;
            offsetY = e.clientY - box.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (dragging) {
                box.style.left = (e.clientX - offsetX) + 'px';
                box.style.top = (e.clientY - offsetY) + 'px';
                box.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            dragging = false;
        });

        btn.addEventListener('click', () => {
            btn.disabled = true;
            btn.textContent = 'Randomizing...';
            randomizeItems().then(() => {
                btn.textContent = '✅ Done!';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = '🎲 Randomize Items';
                }, 3000);
            });
        });
    }

    async function randomizeItems() {
        console.log('[Bazaar Randomizer] Starting item randomization');
        const container = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        if (!container) {
            alert('Bazaar container not found!');
            return;
        }

        let rows = Array.from(container.querySelectorAll('.row___n2Uxh'));
        if (rows.length < 2) {
            alert('Not enough items to randomize.');
            return;
        }

        // Assign a stable index to each row so we can reliably find it later
        rows.forEach((row, idx) => row.setAttribute('data-original-index', idx));

        // Create list of indexes and shuffle
        const indices = rows.map((_, i) => i);
        shuffleArray(indices);

        console.log('[Bazaar Randomizer] Shuffle order:', indices);

        for (let targetPos = 0; targetPos < indices.length; targetPos++) {
            const fromIndex = indices[targetPos];
            if (fromIndex === targetPos) continue;

            rows = Array.from(container.querySelectorAll('.row___n2Uxh'))
                .sort((a, b) => parseInt(a.getAttribute('data-original-index')) - parseInt(b.getAttribute('data-original-index')));

            const fromRow = rows[fromIndex];
            const toRow = rows[targetPos];

            if (!fromRow || !toRow) {
                console.warn(`[Bazaar Randomizer] Missing row at step ${targetPos}`);
                continue;
            }

            fromRow.scrollIntoView({ behavior: 'auto', block: 'center' });
            toRow.scrollIntoView({ behavior: 'auto', block: 'center' });

            await dragRow(fromRow, toRow);

            // Reorder indices after move
            const moved = indices.splice(fromIndex, 1)[0];
            indices.splice(targetPos, 0, moved);
        }
        console.log('[Bazaar Randomizer] Randomization complete');
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    async function dragRow(fromRow, toRow) {
        if (!fromRow || !toRow) return;

        const fromHandle = fromRow.querySelector('.draggableIcon___zAryO');
        const toHandle = toRow.querySelector('.draggableIcon___zAryO');

        if (!fromHandle || !toHandle) return;

        const fromRect = fromHandle.getBoundingClientRect();
        const toRect = toHandle.getBoundingClientRect();

        const startX = fromRect.left + fromRect.width / 2;
        const startY = fromRect.top + fromRect.height / 2;
        const endX = toRect.left + toRect.width / 2;
        const endY = toRect.top + toRect.height / 2;

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        const simulateMouseEvent = (element, type, x, y) => {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                view: window,
            });
            element.dispatchEvent(evt);
        };

        simulateMouseEvent(fromHandle, 'mousedown', startX, startY);
        await delay(100);

        simulateMouseEvent(document.body, 'mousemove', startX + 5, startY + 5);
        await delay(100);

        simulateMouseEvent(document.body, 'mousemove', endX, endY);
        await delay(100);

        simulateMouseEvent(toHandle, 'mouseup', endX, endY);
        await delay(200);
    }

})();