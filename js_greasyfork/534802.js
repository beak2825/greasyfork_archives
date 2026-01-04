// ==UserScript==
// @name         OMSK | Кнопки переходники
// @namespace    https://forum.blackrussia.online
// @version      1.1.1
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Sasha_Dodobrodel🦔
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/534802/OMSK%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/534802/OMSK%20%7C%20%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция создания кнопки
    const buttonConfig = (text, href) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("bgButton");
        button.addEventListener("click", () => {
            window.location.href = href;
        });
        return button;
    };

    // Инициализация скрипта
    const init = () => {
        const bgButtons = document.querySelector(".pageContent");

        if (!bgButtons) {
            setTimeout(init, 1000);
            return;
        }

        // Создаем кнопки
        const Button1 = buttonConfig("Адм раздел", 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1672/');
        const Button2 = buttonConfig("Жб на адм", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1696/');
        const Button3 = buttonConfig("Обж наказания", 'https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1699/');
        const Button4 = buttonConfig("Жб на игроков", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1698/');
        const Button5 = buttonConfig("Жб на лидеров", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1697/');
        const Button6 = buttonConfig("Заявки на АП/ЛД", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9637-omsk.3088/');

        // Добавляем кнопки напрямую в pageContent
        bgButtons.append(Button1);
        bgButtons.append(Button2);
        bgButtons.append(Button3);
        bgButtons.append(Button4);
        bgButtons.append(Button5);
        bgButtons.append(Button6);
    };

    // Запускаем скрипт
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();