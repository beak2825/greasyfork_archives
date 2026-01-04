// ==UserScript==
// @name         SCRIPT | Быстрый доступ | VERSION = Hellsing - VOLGOGRAD | CONFIGURATION - CF
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Быстрый доступ для форума | Конфигурация: КФ
// @author       V.Oleinik VERSION = Hellsing
// @match        https://forum.blackrussia.online/*
// @icon         https://sun9-3.userapi.com/impg/GZy29ANLWXVTMSVKo3QHE10eGbWldcLUa2S7eA/tSGyZ25sYU8.jpg?size=2560x2560&quality=95&sign=06e2ed62b4c0f981ab3a6f90be84892c&type=album
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531065/SCRIPT%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD%20%7C%20CONFIGURATION%20-%20CF.user.js
// @updateURL https://update.greasyfork.org/scripts/531065/SCRIPT%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VERSION%20%3D%20Hellsing%20-%20VOLGOGRAD%20%7C%20CONFIGURATION%20-%20CF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const ButtonOrg = document.createElement("button");
    const ButtonZhb = document.createElement("button");
    const ButtonSit = document.createElement("button");
    const ButtonBio = document.createElement("button");


    ButtonOrg.textContent = "Организации";
    ButtonZhb.textContent = "Жалобы";
    ButtonSit.textContent = "Ситуации";
    ButtonBio.textContent = "Биографии";

    bgButtons.append(ButtonOrg, ButtonZhb, ButtonSit, ButtonBio,);

    const buttons = [ButtonOrg, ButtonZhb, ButtonSit, ButtonBio,];

    buttons.forEach((button, index) => {
        const colors = ["#FFFFFF",];
        button.style.margin = "px";
        button.style.background = colors;
        button.style.borderRadius = "30px";
        button.style.border = "4px solid #000000";
        button.style.color = "#000000";
        button.style.fontFamily = "Georgia";
    });

    ButtonOrg.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1763/";
    });

    ButtonZhb.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1786/?prefix_id=14&last_days=7";
    });

    ButtonSit.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.1765/";
    });

    ButtonBio.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1766/";
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
