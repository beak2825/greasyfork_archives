// ==UserScript==
// @name         selection of required blocks
// @description  По ключевым словам выделяет новости относящиеся только к вашей группе.
// @match        https://ipsilon.sgu.ru/newsfeed/news
// @license MIT
// @grant        GM_addStyle
// @version 0.0.1.20230614181428
// @namespace https://greasyfork.org/users/1098794
// @downloadURL https://update.greasyfork.org/scripts/468673/selection%20of%20required%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/468673/selection%20of%20required%20blocks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // получаем номер группы
    const barsNumber = document.querySelector('.name-faculty').textContent.match(/БАРС\s+(\d+)/i)[1];

    // объединяем базовые ключевые слова и ключевые слова, сохраненные в localStorage
    const baseKeywords = [barsNumber];
    const savedKeywords = localStorage.getItem('newsKeywords');
    const userKeywords = window.prompt("Введите номер вашей группы в таком формате(без пробелов через запятую): ИСП-21,ИСП21,21", savedKeywords || "");
    const allKeywords = [...baseKeywords, ...userKeywords.replace(/\s/g, "").split(",")];

    // сохраняем ключевые слова
    localStorage.setItem('newsKeywords', userKeywords);

    // получаем все блоки новостей на странице
    const newsBlocks = document.querySelectorAll('.b-news');

    // проходимся по каждому блоку и проверяем наличие ключевых слов в заголовке
    for (let i = 0; i < newsBlocks.length; i++) {
        const title = newsBlocks[i].querySelector('.b-news-title a').textContent.toLowerCase();
        const hasKeyword = allKeywords.some(keyword => title.includes(keyword.toLowerCase()));

        // если есть ключевые слова, то добавляем класс 'highlighted' для обводки рамкой
        if (hasKeyword) {
            newsBlocks[i].classList.add('highlighted');
        }

        // если нет ключевых слов, то делаем блок новости полупрозрачным
        else {
            newsBlocks[i].classList.add('semi-transparent');
        }
    }

    // добавляем стили для обводки рамкой и полупрозрачных блоков новостей
    GM_addStyle(`
        .highlighted {
            border: 2px solid green !important;
        }

        .semi-transparent {
            opacity: 0.5;
        }
    `);
})();

//автор https://vk.com/choosed3