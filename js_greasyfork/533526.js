// ==UserScript==
// @name         AnimeStars | ASStars Авто-плавка всех карт
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Плавит все карты, игнорируя скрытые и заблокированные.
// @author       bmr
// @match        https://astars.club/cards_remelt/*
// @match        https://asstars1.astars.club/cards_remelt/*
// @match        https://animestars.org/cards_remelt/*
// @match        https://as1.astars.club/cards_remelt/*
// @match        https://asstars.tv/cards_remelt/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533526/AnimeStars%20%7C%20ASStars%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%B2%D1%81%D0%B5%D1%85%20%D0%BA%D0%B0%D1%80%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/533526/AnimeStars%20%7C%20ASStars%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%B2%D1%81%D0%B5%D1%85%20%D0%BA%D0%B0%D1%80%D1%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;

    const controlButton = document.createElement('button');
    controlButton.innerHTML = '⭐ Начать плавить все карты';
    controlButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 42312331; padding: 10px; background: #6aa84f; color: white; border: none; border-radius: 5px; cursor: pointer;';
    document.body.appendChild(controlButton);

    controlButton.addEventListener('click', function () {
        isRunning = !isRunning;
        this.innerHTML = isRunning ? '⭐ Остановить плавку' : '⭐ Начать плавить все карты';
        this.style.background = isRunning ? '#f44336' : '#6aa84f';
        if (isRunning) {
            processNextBatch();
        }
    });

    function showNotification(message) {
        const existing = document.querySelector('.custom-card-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'custom-card-notification';
        notification.style.cssText = `
            position: fixed;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #f21db2, #db0b81);
            color: white;
            padding: 10px 24px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            max-width: 90%;
            white-space: pre-wrap;
            transition: top 0.5s ease-in-out;
        `;
        notification.textContent = '⭐ ' + message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.top = '20px';
        });

        setTimeout(() => {
            notification.style.top = '-100px';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    function stopScript(message) {
        isRunning = false;
        controlButton.innerHTML = '⭐ Начать плавить все карты';
        controlButton.style.background = '#6aa84f';
        showNotification(message);
    }

    function processNextBatch() {
        if (!isRunning) return;

        const container = document.querySelector('.remelt__inventory-list');
        if (!container) return;

        const allCards = Array.from(container.querySelectorAll('.remelt__inventory-item'));
        const availableCards = allCards.filter(card => {
            const isVisible = card.offsetParent !== null;
            const isLocked = card.classList.contains('remelt__inventory-item--lock');
            return isVisible && !isLocked;
        });

        const cardsToSelect = availableCards.slice(0, 3);

        if (cardsToSelect.length === 0) {
            stopScript('Карты для плавки закончились');
            return;
        }

        let selected = 0;
        function clickNext() {
            if (selected < cardsToSelect.length) {
                cardsToSelect[selected].click();
                selected++;
                setTimeout(clickNext, 200);
            } else {
                setTimeout(startRemelt, 500);
            }
        }

        clickNext();
    }

    function startRemelt() {
        if (!isRunning) return;

        const remeltButton = document.querySelector('.remelt__start-btn');
        if (remeltButton) {
            remeltButton.click();

            const observer = new MutationObserver(() => {
                const closeButton = document.querySelector('.ui-dialog-titlebar-close');
                if (closeButton) {
                    closeButton.click();
                    observer.disconnect();
                    setTimeout(processNextBatch, 1000);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
})();
