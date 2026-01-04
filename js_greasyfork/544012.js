// ==UserScript==
// @name        Telegram-mini-app-start
// @name:ja     テレグラムミニアプリ自動スタート
// @match       https://web.telegram.org/*
// @namespace   https://blog.nyanco.me/telegram-mini-app-play-btn-auto-click/
// @version     1.1 // Увеличена версия, чтобы отметить изменение
// @description A super simple hack script that automatically clicks the start button of the Telegram mini app! Let's enjoy it little by little!
// @description:ja テレグラムのミニアプリのスタートボタンを自動クリックする超シンプルなハックスクリプト！少しずつ楽しよう！
// @author      Nikutama(https://x.com/MeatBallCat2929)
// @grant       none
// @run-at      document-idle // Лучше использовать document-idle для гарантии полной загрузки
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544012/Telegram-mini-app-start.user.js
// @updateURL https://update.greasyfork.org/scripts/544012/Telegram-mini-app-start.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для поиска и клика по кнопке
    function clickTelegramMiniAppButton() {
        // Ищем элемент кнопки, который запускает мини-приложение.
        // Класс 'new-message-bot-commands' обычно относится к командам бота в поле ввода,
        // а не к кнопке "Start" или "Open App".
        // Мы будем использовать более общий подход с текстом кнопки.
        // Ищем кнопку по тексту "Open App" (или аналогичному, если он меняется).
        // Можно также искать по более специфическим классам, если таковые появятся.
        const potentialButtons = document.querySelectorAll('button, div[role="button"]');
        let foundButton = null;

        for (const button of potentialButtons) {
            // Проверяем текст кнопки на наличие ключевых слов
            const buttonText = button.textContent.trim();
            if (buttonText.includes('Open App') || buttonText.includes('Start') || buttonText.includes('Играть') || buttonText.includes('Launch')) {
                // Дополнительная проверка, чтобы убедиться, что это действительно кнопка запуска мини-приложения
                // Например, ищем родителя с классом, указывающим на мини-приложение, или URL в кнопке
                // Это может потребовать более глубокого анализа DOM Telegram Mini App.
                // Пока что, полагаемся на текст и общие элементы.
                foundButton = button;
                break;
            }
        }

        if (foundButton) {
            console.log('Telegram mini-app start button found. Clicking it!', foundButton);
            foundButton.click();
            // Можно добавить clearInterval, если кнопка должна быть нажата только один раз
            // clearInterval(intervalId);
        } else {
            console.log('Telegram mini-app start button not found yet. Retrying...');
        }
    }

    // Вместо window.addEventListener('load') и setTimeout,
    // лучше использовать MutationObserver для отслеживания появления элемента,
    // или setInterval для периодической проверки.
    // 'document-idle' в @run-at также полезен.

    // Периодически проверяем наличие кнопки
    // Установим интервал для повторных попыток, так как кнопка может загружаться динамически.
    const intervalId = setInterval(clickTelegramMiniAppButton, 1000); // Проверяем каждую секунду

    // Остановка интервала после определенного времени, чтобы избежать бесконечной работы,
    // если кнопка так и не появится.
    setTimeout(() => {
        clearInterval(intervalId);
        console.log('Stopped checking for Telegram mini-app start button after 30 seconds.');
    }, 30000); // Остановить через 30 секунд

})();