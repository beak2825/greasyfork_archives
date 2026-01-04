// ==UserScript==
// @name        Fixit Menu Manga's
// @namespace   
// @match       https://remanga.org/manga/*
// @grant       none
// @version     0.4
// @author      JonFox
// @description Сдвигает меню в лево - Правильное расположение меню. И главное теперь не налезает на картинку.
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515068/Fixit%20Menu%20Manga%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/515068/Fixit%20Menu%20Manga%27s.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function adjustModalStyle() {
        const modal = document.querySelector('.modal.modalPaper');
        if (modal) {
            modal.style.left = '0%'; // Стандартное значение 60%
        }
    }
    const observer = new MutationObserver(adjustModalStyle);
    observer.observe(document.body, { childList: true, subtree: true });
    adjustModalStyle();
})();

(function() {
    'use strict';
    function adjustMenuStyle() {
        const menu = document.querySelector('.Menu_menuContainer__5fFYW'); // Select the menu element
        if (menu) {
            menu.style.left = '0px'; // Отступ бокового меню по умолчанию 4px
            menu.style.right = '';
        }
    }
    const observer = new MutationObserver(adjustMenuStyle);
    observer.observe(document.body, { childList: true, subtree: true });
    adjustMenuStyle();
})();