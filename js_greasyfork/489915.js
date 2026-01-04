// ==UserScript==
// @name         Megamarket Calculate Review Bonuses
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate the total bonus amount for reviews on the megamarket.ru page
// @author       You
// @match        https://megamarket.ru/personal/reviews/goods-for-review
// @icon         https://www.google.com/s2/favicons?sz=64&domain=megamarket.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489915/Megamarket%20Calculate%20Review%20Bonuses.user.js
// @updateURL https://update.greasyfork.org/scripts/489915/Megamarket%20Calculate%20Review%20Bonuses.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let totalBonuses = 0;

    // Функция для подсчета суммы бонусов
    function calculateTotalBonuses() {
        let total = 0;
        const bonusElements = document.querySelectorAll('.review-bonuses-block .bonus-amount.bonus-amount_without-percent');
        bonusElements.forEach(element => {
            total += parseFloat(element.textContent.trim());
        });
        return total;
    }

    // Функция для обновления текста о сумме бонусов
    function updateTotalBonusesText() {
        totalBonuses = calculateTotalBonuses();
        const totalBonusesElement = document.getElementById('totalBonuses');
        if (totalBonusesElement) {
            totalBonusesElement.textContent = `Можно получить: ${totalBonuses}`;
        }
    }

    // Функция для добавления текста о сумме бонусов на страницу
    function addTotalBonusesText() {
        const navigationElement = document.querySelector('.personal-page-head__header-title');
        const totalBonusesElement = document.createElement('div');
        totalBonusesElement.id = 'totalBonuses';
        totalBonusesElement.textContent = `Можно получить: ${totalBonuses}`;
        navigationElement.parentNode.insertBefore(totalBonusesElement, navigationElement.nextSibling);
    }

    window.addEventListener('load', function() {
        setTimeout(() => {
            // Наблюдатель за изменениями в DOM
            const observer = new MutationObserver(mutationsList => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // При добавлении новых элементов обновляем сумму бонусов
                        updateTotalBonusesText();
                    }
                });
            });

            // Находим элемент, который будет изменяться при добавлении новых карточек
            const targetNode = document.querySelector('.reviews-goods-list__listing');

            // Настраиваем и запускаем наблюдатель
            if (targetNode) {
                observer.observe(targetNode, { childList: true, subtree: true });
            }

            // Вызываем функции для добавления и обновления текста о сумме бонусов при загрузке страницы
            addTotalBonusesText();
            updateTotalBonusesText();
        }, 1000);
    });

    // Создаем стиль для кнопки
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
    #totalBonuses {
        --mixin-calculated-line-height: 20px;
        color: #21BA72;
        font-family: SB Sans Text, sans-serif;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: normal;
        line-height: 20px;
        margin-left: 10px;
    }
`;

    // Добавляем стиль в head документа
    document.head.appendChild(buttonStyle);


})();
