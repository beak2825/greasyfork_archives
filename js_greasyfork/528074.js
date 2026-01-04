// ==UserScript==
// @name         Быстрый доступ | TULA
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Быстрый доступ 
// @author       Cliffford Arankay
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528074/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20TULA.user.js
// @updateURL https://update.greasyfork.org/scripts/528074/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20TULA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonWarningP = document.createElement("button");
    const ButtonNakaz = document.createElement("button");
    const ButtonSdelka = document.createElement("button");
    const ButtonObj = document.createElement("button");
    const ButtonLd = document.createElement("button");

    ButtonRep.textContent = "Админ раздел";
    ButtonWarning.textContent = "Обжалования";
    ButtonWarningP.textContent = "Жб на игроков";
    ButtonNakaz.textContent = "Жб на лидеров";
    ButtonSdelka.textContent = "Жб на администрацию";
    ButtonObj.textContent = "Заявки на АП";
    ButtonLd.textContent = "Заявки на ЛД";

    bgButtons.append(ButtonRep, ButtonWarning, ButtonWarningP, ButtonNakaz, ButtonSdelka, ButtonObj, ButtonLd);

    const buttons = [ButtonRep, ButtonWarning, ButtonWarningP, ButtonNakaz, ButtonSdelka, ButtonObj, ButtonLd];

    buttons.forEach((button, index) => {
        const colors = ["#2969B0", "#FAC51C", "#ff0000"];
        button.style.margin = "10px";
        button.style.background = colors[index % 3];
        button.style.borderRadius = "15px";
        button.style.border = "2px solid #4a4b4d";
        button.style.color = "#000000";
        button.style.fontFamily = "Georgia";
    });

    ButtonRep.addEventListener("click", () => {
        window.location.href = 'https://forum.blackrussia.online/forums/Админ-раздел.2264/';
    });

    ButtonWarning.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Обжалование-наказаний.2291/";
    });

    ButtonWarningP.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-игроков.2290/";
    });

    ButtonNakaz.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2289/";
    });

    ButtonSdelka.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2288/";
    });

    ButtonObj.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Агенты-поддержки.3149/";
    });

    ButtonLd.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Лидеры.3150/";
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
            countElement1.textContent = 'Темы в ожидании: ' + count1;
            countElement1.style.fontFamily = 'Georgia';
            countElement1.style.fontSize = '20px';
            countElement1.style.color = 'Cherry';

            filterBar.insertAdjacentElement('beforebegin', countElement1);

            const countElement2 = document.createElement('div');
            countElement2.className = 'count-element';
            countElement2.textContent = 'Темы на рассмотрении: ' + count2;
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
