// ==UserScript==
// @name         Duolingo Button Animations
// @namespace    http://tampermonkey.net/
// @description  Adds cool animations to buttons in Duolingo
// @author       Your Name
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle
// @license      Redistribution prohibited
// @version      0.5
// @downloadURL https://update.greasyfork.org/scripts/519169/Duolingo%20Button%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/519169/Duolingo%20Button%20Animations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .button-animation {
            transition: transform 0.2s ease-in-out;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            position: relative;
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
                const x = (e.clientX - rect.left - rect.width / 2) * 0.3; // Увеличьте коэффициент для сильного притяжения
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
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
