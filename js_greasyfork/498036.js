// ==UserScript==
// @name         Grava
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Don't forget gravity!)
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498036/Grava.user.js
// @updateURL https://update.greasyfork.org/scripts/498036/Grava.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки флажка гравитации на странице редактирования
    function checkGravity(url, cell) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const checkbox = doc.querySelector('#IsGravityAvailable');

                if (checkbox) {
                    const statusText = document.createElement('div');
                    statusText.style.fontStyle = 'italic';

                    if (checkbox.checked) {
                        statusText.textContent = 'Gravity on';
                        statusText.style.color = 'green';
                    } else {
                        statusText.textContent = 'Gravity off';
                        statusText.style.color = 'red';
                    }

                    cell.appendChild(statusText);
                }
            })
            .catch(error => console.error('Ошибка при проверке гравитации:', error));
    }

    // Основной код запускается через 5 секунд
    setTimeout(function() {
        // Поиск ячеек с текстом "Bracelets"
        const braceletCells = Array.from(document.querySelectorAll('td')).filter(td => td.textContent.trim() === 'Bracelets');

        braceletCells.forEach(cell => {
            const row = cell.parentElement;
            const link = row.querySelector('a[href^="/Admin/CompareBag/EditBag/"]');

            if (link) {
                const url = link.href;
                checkGravity(url, cell);
            }
        });
    }, 5000); // Задержка 3000 миллисекунд (3 секунд)
})();