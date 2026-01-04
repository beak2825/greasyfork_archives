// ==UserScript==
// @name         Прокрутка чата
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Нажимает на кнопку прокрутки чата вниз
// @author       You
// @match        https://boosty.to/*/streams/only-chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517529/%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/517529/%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // XPath для страницы чата в отдельном окне
    const xpathChatPage = '//*[@id="root"]/div/div/div/div/div/div/div[1]/div/button';

    // Функция для поиска кнопки на странице чата
    function clickButtonOnChatPage() {
        const element = document.evaluate(xpathChatPage, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element) {
            console.log('Кнопку прокрутки найдена, клик');
            element.click();
        }
    }

    // Функция для постоянной проверки и клика
    function startClicking() {
        setInterval(() => {
            clickButtonOnChatPage(); // Постоянно проверяем и кликаем на кнопке чата
        }, 500); // Проверка каждые 500 мс
    }

    // Используем MutationObserver для отслеживания изменений в DOM и запуска скрипта
    const observer = new MutationObserver(() => {
        clickButtonOnChatPage(); // При изменении DOM пытаемся кликнуть по кнопке
    });

    // Настроим наблюдатель для изменений в DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Запускаем процесс постоянного клика
    startClicking();
})();
