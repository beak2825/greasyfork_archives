// ==UserScript==
// @name         Warframe Market Название предмета на английском
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Английское название предмета в заголовок
// @author       You
// @match        https://warframe.market/ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531068/Warframe%20Market%20%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B0%20%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/531068/Warframe%20Market%20%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BC%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B0%20%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция добавления h2 после h1 с текстом из meta og:title
    function addH2() {
        const observer = new MutationObserver(() => {
            const h1 = document.querySelector('h1');
            const metaOgTitle = document.querySelector('meta[property="og:title"]');
            const search = document.querySelector('.container');
            if (h1 || search) {
                const titleText = metaOgTitle.content.split(' - ')[0]; // Получаем текст до первого " - "
                const h2 = document.createElement('h2');
                h2.textContent = titleText;
                h2.style.display = 'block';
                h2.style.width = '100%';
                h2.style.textAlign = 'center';
                h2.style.padding = '5px 0 0 0';
                if (h1){
                    h1.parentNode.insertAdjacentElement('afterend', h2);
                } else{
                    //search.insertAdjacentElement('afterend', h2);
                }
                //document.querySelector('.container.item__information').display = 'none!important';
                observer.disconnect(); // Останавливаем наблюдатель после выполнения
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    addH2();
})();
