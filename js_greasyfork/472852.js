// ==UserScript==
// @name         GPT Chat History Optimizer
// @name:uk      GPT Оптимізатор історії чатів
// @namespace    https://chat.openai.com
// @version      2023.08.11.0
// @description  Цей скрипт оптимізує історію чату GPT, зберігаючи лише останні повідомлення для покращення продуктивності та зниження використання ресурсів браузера. Видалені повідомлення все одно враховуються в нових відповідях чату, забезпечуючи ефективну та швидку роботу.
// @run-at       document-end
// @author       https://github.com/Aves2001
// @match        https://chat.openai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @homepageURL  https://github.com/Aves2001/GPT-Chat-History-Optimizer
// @supportURL   https://github.com/Aves2001/GPT-Chat-History-Optimizer/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472852/GPT%20Chat%20History%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/472852/GPT%20Chat%20History%20Optimizer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const targetClass = 'main > div.flex-1.overflow-hidden > div > div > div > div.group.w-full';
    const OBSERVED_CLASSES = [
        'flex-1 overflow-hidden',
        'flex flex-col text-sm dark:bg-gray-800',
        'relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1'
    ];

    let countKeepLastMessages = GM_getValue('countKeepLastMessages', 12);


    function keepLastMessages() {
        // Вибираємо всі цільові елементи
        let elements = document.querySelectorAll(targetClass);

        if (elements.length <= countKeepLastMessages) return;

        // Індекс останнього елемента, який слід залишити
        let lastIndexToKeep = elements.length - countKeepLastMessages;

        // Видаляємо зайві елементи
        for (let i = 0; i < lastIndexToKeep; i++) {
            elements[i].remove();
        }

        // Вивід кількості видалених повідомлень
        console.log("Було видалено повідомлень: " + lastIndexToKeep);
    }


    function saveSettings_CountKeepLastMessages() {
        let newCountKeepLastMessages = parseInt(prompt('Введіть нову кількість повідомлень:', countKeepLastMessages));
        if (!isNaN(newCountKeepLastMessages) && newCountKeepLastMessages >= 1) {
            GM_setValue('countKeepLastMessages', newCountKeepLastMessages);
            countKeepLastMessages = newCountKeepLastMessages;
            keepLastMessages();
        }
    }

    // Зареєструвати команди меню для виклику функції зміни налаштувань
    GM_registerMenuCommand('Змінити кількість повідомлень', saveSettings_CountKeepLastMessages, "K");
    GM_registerMenuCommand("Видалення зайвих елементів", function() {
        keepLastMessages();
    }, "C");



    // Функція для обробки комбінації клавіш Ctrl+Shift+Space
    function handleKeyPress(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'Space') {
            console.log('Натиснуто комбінацію Ctrl+Shift+Space');
            keepLastMessages();
        }
    }
    document.addEventListener('keydown', handleKeyPress);


    let observer = new MutationObserver(mutations => {
        for (let m of mutations) {
            if (m.type === 'childList' && OBSERVED_CLASSES.includes(m.target.className)) {
                keepLastMessages();
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

})();
