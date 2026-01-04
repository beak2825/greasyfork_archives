// ==UserScript==
// @name         Za4et
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace "Неявка" and "Не зачет" icons on ISU Points View page, as well as modify badge values
// @author       bomjik321
// @match        https://isu.uust.ru/student_points_view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523381/Za4et.user.js
// @updateURL https://update.greasyfork.org/scripts/523381/Za4et.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'customIconHTML'; // Ключ для хранения изменения
    const defaultIcon = '<i class="glyphicon glyphicon-ok-sign text-success" title="Зачтено"></i>'; // Иконка по умолчанию

    // Восстановление сохраненного значения или использование значения по умолчанию
    const savedIcon = localStorage.getItem(storageKey) || defaultIcon;

    document.querySelectorAll('span.text-red').forEach(element => {
        if (element.textContent.trim() === 'Неявка') {
            const newElement = document.createElement('span');
            newElement.innerHTML = savedIcon;
            element.replaceWith(newElement);
        }

        // Обработка клика для изменения значения
        element.addEventListener('click', () => {
            const newIcon = prompt('Введите новый HTML-код для замены:', savedIcon);
            if (newIcon) {
                const newElement = document.createElement('span');
                newElement.innerHTML = newIcon;
                element.replaceWith(newElement);
                localStorage.setItem(storageKey, newIcon);
            }
        });
    });

    // Изменение элемента "Не зачет" на "Зачтено"
    document.querySelectorAll('i.glyphicon.glyphicon-ok-sign.text-danger[title="Не зачет"]').forEach(iconElement => {
        const newElement = document.createElement('i');
        newElement.className = 'glyphicon glyphicon-ok-sign text-success';
        newElement.title = 'Зачтено';
        iconElement.replaceWith(newElement);
    });

    // Изменение бейджа "1" на "4"
    document.querySelectorAll('span.badge.bg-danger').forEach(badgeElement => {
        if (badgeElement.textContent.trim() === '1') {
            const newElement = document.createElement('span');
            newElement.className = 'badge bg-success';
            newElement.textContent = '4';
            badgeElement.replaceWith(newElement);
        }
    });
})();
