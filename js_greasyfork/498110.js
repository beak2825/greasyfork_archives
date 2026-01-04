// ==UserScript==
// @name         Lifestyle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Don't forget lifestyle!)
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498110/Lifestyle.user.js
// @updateURL https://update.greasyfork.org/scripts/498110/Lifestyle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверка наличия заголовка Moderation tasks
    const moderationTasksHeader = document.querySelector('h3');
    if (!moderationTasksHeader || moderationTasksHeader.textContent.trim() !== 'Moderation tasks:') {
        return; // Если заголовок не найден или текст не соответствует, прерываем выполнение скрипта
    }

    // Функция для проверки флажка Lifestyle на странице редактирования
    function checkLifestyle(url, cell) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const checkbox = doc.querySelector('#IsLifestyleAvailable');

                if (checkbox) {
                    const statusText = document.createElement('div');
                    statusText.style.fontStyle = 'italic';

                    if (checkbox.checked) {
                        statusText.textContent = 'Lifestyle on';
                        statusText.style.color = 'green';
                    } else {
                        statusText.textContent = 'Lifestyle off';
                        statusText.style.color = 'red';
                    }

                    cell.appendChild(statusText);
                }
            })
            .catch(error => console.error('Ошибка при проверке флажка Lifestyle:', error));
    }

    // Основной код запускается без задержки
    // Поиск ячеек с текстом "Home24"
    const home24Cells = Array.from(document.querySelectorAll('td')).filter(td => td.textContent.trim() === 'Home24');

    home24Cells.forEach(cell => {
        const row = cell.parentElement;
        const link = row.querySelector('a[href^="/Admin/CompareBag/EditBag/"]');

        if (link) {
            const url = link.href;
            checkLifestyle(url, cell);
        }
    });
})();