// ==UserScript==
// @name         Highlight Cats and Auto Confirm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматическое подтверждение и подсветка котов с цветом статуса
// @author       Твой ник или имя
// @match        https://catwar.net/cw3/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537569/Highlight%20Cats%20and%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/537569/Highlight%20Cats%20and%20Auto%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переопределяем confirm для определённых сообщений
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        if (message.includes("Вы уверены, что хотите начать бить зубами?") ||
            message.includes("Вы уверены, что хотите начать бить когтями?")) {
            return true;
        }
        return originalConfirm(message);
    };

    // Функция для конвертации hex в rgba
    function hexToRgba(hex, alpha) {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Обязательно обратные кавычки
    }

    // Функция подсветки котов
    function highlightCats() {
        const cageItemsList = document.querySelectorAll('.cage_items'); 
        cageItemsList.forEach(cageItems => {
            const hasCatWithArrow = cageItems.querySelector('.catWithArrow') !== null; 
            if (hasCatWithArrow) {
                const catTooltip = cageItems.querySelector('.cat_tooltip');
                if (catTooltip) {
                    const statusElement = catTooltip.querySelector('.online font');
                    if (statusElement) {
                        const color = statusElement.getAttribute('color');
                        cageItems.style.backgroundColor = hexToRgba(color, 0.3); 
                    }
                }
            } else {
                cageItems.style.backgroundColor = '';
            }
        });
    }

    // Запускаем подсветку с интервалом
    setInterval(highlightCats, 50);

})();
