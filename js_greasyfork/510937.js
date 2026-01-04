// ==UserScript==
// @name         убирает аватары полностью
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  основа скрипта - https://lolz.live/threads/6722319/
// @author       lolz.live/andrey/
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510937/%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D1%8B%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D1%81%D1%82%D1%8C%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/510937/%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D1%8B%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D1%81%D1%82%D1%8C%D1%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAvatars() {
        // Находим все элементы с классом 'avatar' и атрибутом 'data-avatarhtml="true"', а также элементы с классом 'unfurl_user-avatar'
        const avatars = document.querySelectorAll('a.avatar[data-avatarhtml="true"], .unfurl_user-avatar');
        avatars.forEach(avatar => {
            // Скрываем каждый найденный элемент
            avatar.style.opacity = '0'; // делаем элемент полностью прозрачным
            // Заменяем изображение на пустое, если необходимо полностью избавиться от визуального отображения, сохраняя пространство
            if(avatar.querySelector('img')) {
                avatar.querySelector('img').src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
        });
    }

    window.addEventListener('load', hideAvatars);

    // Для отслеживания динамически добавляемых элементов используем MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) hideAvatars();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();