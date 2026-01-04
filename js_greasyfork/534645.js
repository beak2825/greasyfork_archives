// ==UserScript==
// @name         SCRIPT | Быстрый доступ | VERSION = Hellsing - VOLGOGRAD | CONFIGURATION - ALL
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Быстрый доступ для форума | Конфигурация: Общий
// @author       V.Oleinik VERSION = Hellsing
// @match        https://forum.blackrussia.online/*
// @icon         https://sun9-3.userapi.com/impg/GZy29ANLWXVTMSVKo3QHE10eGbWldcLUa2S7eA/tSGyZ25sYU8.jpg?size=2560x2560&quality=95&sign=06e2ed62b4c0f981ab3a6f90be84892c&type=album
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534645/SCRIPT%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD%20%7C%20CONFIGURATION%20-%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/534645/SCRIPT%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD%20%7C%20CONFIGURATION%20-%20ALL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const ButtonAdmRazdel = document.createElement("button");
    const ButtonZhbAdm = document.createElement("button");
    const ButtonZhbLds = document.createElement("button");
    const ButtonZhbIgroki = document.createElement("button");
    const ButtonObj = document.createElement("button");
    const ButtonZayavki = document.createElement("button");

    ButtonAdmRazdel.textContent = "Админ-раздел";
    ButtonZhbAdm.textContent = "Жб на адм";
    ButtonZhbLds.textContent = "Жб на лд";
    ButtonZhbIgroki.textContent = "Жб на игроков";
    ButtonObj.textContent = "Обж-ния";
    ButtonZayavki.textContent = "Заявки";

    bgButtons.append(ButtonAdmRazdel, ButtonZhbAdm, ButtonZhbLds, ButtonZhbIgroki, ButtonObj, ButtonZayavki,);

    const buttons = [ButtonAdmRazdel, ButtonZhbAdm, ButtonZhbLds, ButtonZhbIgroki, ButtonObj, ButtonZayavki,];

    buttons.forEach((button, index) => {
        const colors = ["#000000", "#000000", "#000000"];
        button.style.margin = "px";
        button.style.background = colors[index % 3];
        button.style.borderRadius = "15px";
        button.style.border = "2px solid #4a4b4d";
        button.style.color = "#FFFFFF";
        button.style.fontFamily = "Georgia";
    });


    ButtonAdmRazdel.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1760/";
    });

    ButtonZhbAdm.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1784/?prefix_id=14&last_days=7";
    });

    ButtonZhbLds.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1785/?prefix_id=14&last_days=7";
    });

    ButtonZhbIgroki.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1786/?prefix_id=14&last_days=7";
    });

    ButtonObj.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1787/?prefix_id=14&last_days=7";
    });

    ButtonZayavki.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9639-volgograd.3076/";
    });

    function countElements() {
        const elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        const elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        const count1 = elements1.length;
        const count2 = elements2.length;

        const filterBar = document.querySelector('.filterBar');

        if (filterBar) {
            const countElement1 = document.createElement('div');
            countElement1.className = 'count-element';
            countElement1.textContent = 'В ожидании: ' + count1;
            countElement1.style.fontFamily = 'Georgia';
            countElement1.style.fontSize = '20px';
            countElement1.style.color = 'Cherry';

            filterBar.insertAdjacentElement('beforebegin', countElement1);

            const countElement2 = document.createElement('div');
            countElement2.className = 'count-element';
            countElement2.textContent = 'На рассмотрении: ' + count2;
            countElement2.style.fontFamily = 'Georgia';
            countElement2.style.fontSize = '20px';
            countElement2.style.color = 'Cherry';

            filterBar.insertAdjacentElement('beforebegin', countElement2);
        } else {
            console.log('Элемент с классом "filterBar" не найден.');
        }
    }

    window.onload = function() {
        countElements();
    };

})();
