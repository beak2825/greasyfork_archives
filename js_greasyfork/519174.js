// ==UserScript==
// @name         Magnetic Buttons for miniblox.io
// @namespace    http://tampermonkey.net/
// @description  Adds magnetic buttons to miniblox.io
// @author       Your Name
// @match        https://miniblox.io/*
// @grant        GM_addStyle
// @license      Redistribution prohibited
// @version      0.5
// @downloadURL https://update.greasyfork.org/scripts/519174/Magnetic%20Buttons%20for%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/519174/Magnetic%20Buttons%20for%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .button-animation {
            transition: transform 0.2s ease-in-out, scale 0.2s ease-in-out;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            position: relative;
        }

        .button-animation:hover {
            transform: scale(1.1); /* Увеличение кнопки при наведении */
        }
    `);

    document.addEventListener('mousemove', function(e) {
        const buttons = document.querySelectorAll('.button-animation');
        let closestButton = null;
        let closestDistance = Infinity;

        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const distance = Math.sqrt((e.clientX - rect.left - rect.width / 2) ** 2 + (e.clientY - rect.top - rect.height / 2) ** 2);
            if (distance < 100 && distance < closestDistance) { // Установите радиус притяжения
                closestDistance = distance;
                closestButton = button;
            }
        });

        buttons.forEach(button => {
            if (button === closestButton) {
                const rect = button.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.1; // Уменьшите коэффициент для менее сильного притяжения
                const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
                button.style.transform = `translate(${x}px, ${y}px)`;
            } else {
                button.style.transform = '';
            }
        });
    });

    const observer = new MutationObserver(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.classList.contains('button-animation')) {
                button.classList.add('button-animation');
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
