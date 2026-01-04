// ==UserScript==
// @name         Rounded Corners for MiniBlox.io
// @namespace    http://tampermonkey.net/
// @description  Adds rounded corners to all buttons and menu items on MiniBlox.io
// @match        https://miniblox.io/*
// @grant        GM_addStyle
// @version      1.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519295/Rounded%20Corners%20for%20MiniBloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/519295/Rounded%20Corners%20for%20MiniBloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Закругление углов для всех кнопок */
        button {
            border-radius: 12px;
        }

        /* Закругление углов для всех элементов меню */
        .menu, .menu-item {
            border-radius: 12px;
        }

        /* Закругление углов для других интерфейсных элементов, если необходимо */
        .interface-element {
            border-radius: 12px;
        }
    `);

    // Применение стилей ко всем кнопкам и элементам меню
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.borderRadius = '12px';
    });

    const menuItems = document.querySelectorAll('.menu, .menu-item');
    menuItems.forEach(item => {
        item.style.borderRadius = '12px';
    });

    // Дополнительные элементы интерфейса, если нужно
    const interfaceElements = document.querySelectorAll('.interface-element');
    interfaceElements.forEach(element => {
        element.style.borderRadius = '12px';
    });
})();
