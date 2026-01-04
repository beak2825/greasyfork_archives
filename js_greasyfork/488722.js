// ==UserScript==
// @name         Remove User Avatars from LZT
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Removes all user avatars from Zelenka.guru
// @author       @vortexvisuals
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488722/Remove%20User%20Avatars%20from%20LZT.user.js
// @updateURL https://update.greasyfork.org/scripts/488722/Remove%20User%20Avatars%20from%20LZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideAvatars() {
        // Находим все элементы с классом 'avatar' и атрибутом 'data-avatarhtml="true"'
        const avatars = document.querySelectorAll('a.avatar[data-avatarhtml="true"]');
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