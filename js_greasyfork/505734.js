// ==UserScript==
// @name         Быстрый доступ | Для VOLGOGRAD
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Быстрый доступ для BR
// @author       Valik
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505734/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/505734/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%7C%20%D0%94%D0%BB%D1%8F%20VOLGOGRAD.meta.js
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
    const Buttonvost = document.createElement("button");

    ButtonRep.textContent = "Админ раздел";
    ButtonWarning.textContent = "Обжалования";
    ButtonWarningP.textContent = "Жб на игроков";
    ButtonNakaz.textContent = "Жб на лидеров";
    ButtonSdelka.textContent = "Жб на администрацию";
    ButtonObj.textContent = "Заявки на АП";
    ButtonLd.textContent = "Заявки на ЛД";
    Buttonvost.textContent = "Восстановление";

    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);
    bgButtons.append(ButtonNakaz);
    bgButtons.append(ButtonSdelka);
    bgButtons.append(ButtonObj);
    bgButtons.append(ButtonLd);
    bgButtons.append(Buttonvost);

    const buttons = [ButtonRep, ButtonWarning, ButtonWarningP, ButtonNakaz, ButtonSdelka, ButtonObj, ButtonLd, Buttonvost];

    buttons.forEach((button, index) => {

        const colors = ["#2969B0", "#FAC51C", "#ff0000"];
        button.style.margin = "10px";
        button.style.background = colors[index % 3];
        button.style.borderRadius = "15px";
        button.style.border = "2px solid #4a4b4d";
        button.style.color = "#000000";
        button.style.fontFamily = "Georgia";
    });

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/Админ-раздел.1760/';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/Обжалование-наказаний.1787/";
    };

    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-игроков.1786/";
    };

    function BNakaz() {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1785/?prefix_id=14";
    };

    function BSdelka() {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1784/";
    };

    function BObj() {
        window.location.href = "https://forum.blackrussia.online/forums/Агенты-поддержки.3077/";
    };

    function BLd() {
        window.location.href = "https://forum.blackrussia.online/forums/Лидеры.3078/";
    };

    function Bvost() {
        window.location.href = "https://forum.blackrussia.online/forums/Восстановление-на-пост-администратора.491/";
    };

    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#fff";
    });

    ButtonWarning.addEventListener("click", () => {
        BWarning();
        ButtonWarning.style.background = "#fff";
    });

    ButtonWarningP.addEventListener("click", () => {
        BWarningP();
        ButtonWarningP.style.background = "#fff";
    });

    ButtonNakaz.addEventListener("click", () => {
        BNakaz();
        ButtonNakaz.style.background = "#fff";
    });

    ButtonSdelka.addEventListener("click", () => {
        BSdelka();
        ButtonSdelka.style.background = "#fff";
    });

    ButtonObj.addEventListener("click", () => {
        BObj();
        ButtonObj.style.background = "#fff";
    });

    ButtonLd.addEventListener("click", () => {
        BLd();
        ButtonLd.style.background = "#fff";
    });

    Buttonvost.addEventListener("click", () => {
        Bvost();
        Buttonvost.style.background = "#fff";
    });







    // Функция для подсчета элементов с классами 'structItem structItem--thread is-prefix14' и 'structItem structItem--thread is-prefix2'
    function countElements() {
        var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        var count1 = elements1.length;
        var count2 = elements2.length;

        var filterBar = document.querySelector('.filterBar');

        if (filterBar) {
            var countElement1 = document.createElement('div');
            countElement1.className = 'count-element';
            countElement1.textContent = 'Темы в ожидании: ' + count1;
            countElement1.style.fontFamily = 'Georgia';
            countElement1.style.fontSize = '20px';
            countElement1.style.color = 'Cherry';

            filterBar.insertAdjacentElement('beforebegin', countElement1);

            var countElement2 = document.createElement('div');
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


