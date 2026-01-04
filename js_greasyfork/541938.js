// ==UserScript==
// @license MIT
// @name         Roblox Auto Unfriend (With Start Button)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет кнопку для автоматического удаления друзей в Roblox
// @author       ChatGPT
// @match        https://www.roblox.com/users/friends*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541938/Roblox%20Auto%20Unfriend%20%28With%20Start%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541938/Roblox%20Auto%20Unfriend%20%28With%20Start%20Button%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Сколько друзей удалять за раз
    const batchSize = 10;

    // Создаём кнопку на странице
    function createStartButton() {
        const btn = document.createElement('button');
        btn.innerText = '🚫 Start Unfriending';
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.right = '20px';
        btn.style.padding = '10px 20px';
        btn.style.zIndex = '9999';
        btn.style.backgroundColor = '#ff4444';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        btn.onclick = startUnfriending;
        document.body.appendChild(btn);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startUnfriending() {
        alert("Начинаем удалять друзей! Не закрывай вкладку.");

        let totalRemoved = 0;

        while (true) {
            const buttons = Array.from(document.querySelectorAll('button')).filter(btn => btn.innerText.trim() === 'Unfriend');

            if (buttons.length === 0) {
                alert("Удаление завершено или друзей больше нет.");
                break;
            }

            for (let i = 0; i < Math.min(batchSize, buttons.length); i++) {
                buttons[i].click();
                console.log(`Удалён друг №${totalRemoved + 1}`);
                totalRemoved++;
                await wait(1500); // Задержка между действиями
            }

            // Немного прокрутить вниз и подождать
            window.scrollBy(0, 600);
            await wait(3000);

            location.reload(); // Перезагрузить для следующей волны друзей
            break; // После перезагрузки скрипт снова запустится
        }
    }

    // Ждём загрузки страницы и вставляем кнопку
    window.addEventListener('load', () => {
        setTimeout(createStartButton, 2000);
    });
})();
