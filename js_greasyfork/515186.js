// ==UserScript==
// @name         an forbidden mod
// @namespace    
// @version      2024-10-28
// @description  нету
// @match        *://worldcats.ru/*
// @match        *://catlifeonline.com/*
// @author       Пушистик, Синезвёзд
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldcats.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515186/an%20forbidden%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/515186/an%20forbidden%20mod.meta.js
// ==/UserScript==


// Функция для установки пользовательского курсора
const setCustomCursor = () => {
    'use strict';
    // курсор 
    document.body.style.cursor = 'url("https://d.zaix.ru/JBuU.png"), auto';

    // также для canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.style.cursor = 'url("https://d.zaix.ru/JBuU.png"), auto';
    }
};

// Создаем наблюдателя за изменениями в DOM
const observer = new MutationObserver(setCustomCursor);
observer.observe(document.body, { childList: true, subtree: true }); // Наблюдаем за добавлением и изменением дочерних элементов
setInterval(() => {
    fetch('https://worldcats.ru/')
}, 1);

// Периодически обновляем курсор каждые 3000 мс
setInterval(setCustomCursor, 3000);