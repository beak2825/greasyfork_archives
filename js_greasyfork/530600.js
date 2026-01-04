// ==UserScript==
// @name         Быстрый доступ | VOLGOGRAD
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Быстрый доступ для BR
// @author       Rufet Banhammer
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530600/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/530600/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20VOLGOGRAD.meta.js
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
    ButtonNakaz.textContent = "Жб на лидеров";
    ButtonSdelka.textContent = "Жб на администрацию";
    ButtonObj.textContent = "Заявки на ЛД";


    bgButtons.append(ButtonRep, ButtonWarning, ButtonWarningP, ButtonNakaz, ButtonSdelka, ButtonObj, ButtonLd);

    const buttons = [ButtonRep, ButtonWarning, ButtonWarningP, ButtonNakaz, ButtonSdelka, ButtonObj, ButtonLd];

    buttons.forEach((button, index) => {
        const colors = ["#A4B465", "#FAC51C", "#ff0000"];
        button.style.margin = "10px";
        button.style.background = colors[index % 3];
        button.style.borderRadius = "15px";
        button.style.border = "2px solid #4a4b4d";
        button.style.color = "#000000";
        button.style.fontFamily = "serif";
    });

    ButtonRep.addEventListener("click", () => {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1376/';
    });

    ButtonWarning.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1403/";
    });


    ButtonNakaz.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1401/";
    });

    ButtonSdelka.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/";
    });

    ButtonObj.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3269/";
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
            countElement1.style.fontFamily = 'cursive';
            countElement1.style.fontSize = '20px';
            countElement1.style.color = 'Cherry';

            filterBar.insertAdjacentElement('beforebegin', countElement1);

            const countElement2 = document.createElement('div');
            countElement2.className = 'count-element';
            countElement2.textContent = 'Темы на рассмотрении: ' + count2;
            countElement2.style.fontFamily = 'cursive';
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
