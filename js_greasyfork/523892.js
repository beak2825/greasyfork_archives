// ==UserScript==
// @name         AnimeStars Авто-плавка повторок
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  В выбранном ранге нажимаете на кнопку и скрипт сплавит все повторки не трогая 1 оригинальную.
// @author       eretly
// @match        https://animestars.org/cards_remelt/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523892/AnimeStars%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523892/AnimeStars%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BF%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%BE%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let selectedCards = 0;
    let processedCardIds = new Set();

    const controlButton = document.createElement('button');
    controlButton.innerHTML = 'Start Auto Remelt';
    controlButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;';
    document.body.appendChild(controlButton);

    const notificationElement = document.createElement('div');
    notificationElement.style.cssText = 'position: fixed; top: 60px; right: 10px; z-index: 9999; padding: 10px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; display: none;';
    document.body.appendChild(notificationElement);

    function showNotification(message) {
        notificationElement.textContent = message;
        notificationElement.style.display = 'block';
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000);
    }

    function stopScript(message) {
        isRunning = false;
        controlButton.innerHTML = 'Start Auto Remelt';
        controlButton.style.background = '#4CAF50';
        showNotification(message);
    }

    controlButton.addEventListener('click', function() {
        isRunning = !isRunning;
        this.innerHTML = isRunning ? 'Stop Auto Remelt' : 'Start Auto Remelt';
        this.style.background = isRunning ? '#f44336' : '#4CAF50';
        if (isRunning) {
            processedCardIds.clear();
            findAndClickMatches();
        }
    });

    function findAndClickMatches() {
        if (!isRunning) return;

        const container = document.querySelector('.remelt__inventory-list');
        if (!container) return;

        const cards = container.querySelectorAll('.remelt__inventory-item');
        const cardMap = new Map();

        cards.forEach(card => {
            const img = card.querySelector('img');
            const cardId = card.getAttribute('data-id');
            if (img && img.src && cardId && !processedCardIds.has(cardId)) {
                if (!cardMap.has(img.src)) {
                    cardMap.set(img.src, []);
                }
                cardMap.get(img.src).push(card);
            }
        });

        let totalDuplicates = 0;
        let cardsToSelect = [];

        cardMap.forEach((matchingCards, src) => {
            if (matchingCards.length >= 2) {
                totalDuplicates += matchingCards.length - 1;
                const cardsToAdd = matchingCards.slice(0, Math.min(matchingCards.length - 1, 3 - selectedCards));
                cardsToSelect = cardsToSelect.concat(cardsToAdd);
            }
        });

        if (totalDuplicates <= 2) {
            let message = '';
            switch(totalDuplicates) {
                case 0:
                    message = 'Все карты уникальны. Повторяющихся карт не найдено.';
                    break;
                case 1:
                    message = 'Осталась только 1 повторяющаяся карта.';
                    break;
                case 2:
                    message = 'Осталось только 2 повторяющиеся карты.';
                    break;
            }
            stopScript(message);
            return;
        }

        if (cardsToSelect.length > 0) {
            selectCards(cardsToSelect);
        } else if (isRunning) {
            setTimeout(findAndClickMatches, 1000);
        }
    }

    function selectCards(cards) {
        let index = 0;
        function clickNextCard() {
            if (index < cards.length && selectedCards < 3) {
                const card = cards[index];
                const cardId = card.getAttribute('data-id');
                if (cardId) {
                    processedCardIds.add(cardId);
                }
                card.click();
                selectedCards++;
                index++;
                setTimeout(clickNextCard, 250);
            } else if (selectedCards >= 3) {
                setTimeout(startRemelt, 250);
            } else if (isRunning) {
                setTimeout(findAndClickMatches, 750);
            }
        }
        clickNextCard();
    }

    function startRemelt() {
        if (!isRunning) return;

        const remeltButton = document.querySelector('.remelt__start-btn');
        if (remeltButton) {
            remeltButton.click();

            setTimeout(() => {
                const closeButton = document.querySelector('.ui-dialog-titlebar-close');
                if (closeButton) {
                    closeButton.click();
                    selectedCards = 0;
                    setTimeout(findAndClickMatches, 500);
                }
            }, 2000);
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (isRunning) {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    setTimeout(findAndClickMatches, 1000);
                }
            });
        }
    });

    function startObserving() {
        const container = document.querySelector('.remelt__inventory-list');
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(startObserving, 1000);
        }
    }

    startObserving();
})();

