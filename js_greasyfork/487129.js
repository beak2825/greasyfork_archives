// ==UserScript==
// @name         Fast link for forum BR | Для ОЗГА
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fast link for forum BR
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487129/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%9E%D0%97%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/487129/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%9E%D0%97%D0%93%D0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*Заявление на повышение
Заявление на пост ап
обжалования
Заявки на пост обмен/продажа/покупка имущества
Отчёт на снятия наказания*/
 
const bgButtons = document.querySelector(".pageContent");       
    const ButtonLevelUp = document.createElement("button");
    const ButtonAp = document.createElement("button");
    const ButtonUnWarning = document.createElement("button");
    const ButtonTrade = document.createElement("button");
    const ButtonASD = document.createElement("button");
    ButtonLevelUp.textContent = "Повышения";
    ButtonAp.textContent = "Заявки на АП";
    ButtonUnWarning.textContent = "Обжалования";
    ButtonTrade.textContent = "Покупка/продажа/обмен имущ";
    ButtonASD.textContent = "Снятие наказаний";

    bgButtons.append(ButtonLevelUp);
    bgButtons.append(ButtonAp);
    bgButtons.append(ButtonUnWarning);
    bgButtons.append(ButtonTrade);
    bgButtons.append(ButtonASD);
 
    ButtonLevelUp.style.marginLeft = "40px";
    ButtonLevelUp.style.background = "#b4b5b8"
    ButtonLevelUp.style.borderRadius = "15px"
    ButtonLevelUp.style.boreder = "1px solid #4a4b4d"
 
    ButtonAp.style.marginLeft = "10px";
    ButtonAp.style.background = "#b4b5b8"
    ButtonAp.style.borderRadius = "15px"
    ButtonAp.style.boreder = "2px solid #4a4b4d"
    
    ButtonUnWarning.style.marginLeft = "10px";
    ButtonUnWarning.style.background = "#b4b5b8"
    ButtonUnWarning.style.borderRadius = "15px"
    ButtonUnWarning.style.boreder = "2px solid #4a4b4d"

    ButtonTrade.style.marginLeft = "10px";
    ButtonTrade.style.background = "#b4b5b8"
    ButtonTrade.style.borderRadius = "15px"
    ButtonTrade.style.boreder = "2px solid #4a4b4d"

    ButtonASD.style.marginLeft = "10px";
    ButtonASD.style.background = "#b4b5b8"
    ButtonASD.style.borderRadius = "15px"
    ButtonASD.style.boreder = "2px solid #4a4b4d"
 
    function BLevelUp() {
        window.location.href = 'https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BF%D0%BE%D0%B2%D1%8B%D1%88%D0%B5%D0%BD%D0%B8%D0%B5.5991038/page-9999#footer';
    };
 
    function BAp() {
        window.location.href = "https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BF%D0%BE%D1%81%D1%82-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%B0-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.7517550#footer";
    };

    function BUnWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2459";
    };

    function BTrade() {
        window.location.href = "https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D1%83-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D1%83-%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD-%D0%B8%D0%BC%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B0-%D1%81-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%B0%D0%BC%D0%B8.5946848/page-9999#footer";
    };

    function BASD() {
        window.location.href = "https://forum.blackrussia.online/threads/kursk-%D0%9E%D1%82%D1%87%D0%B5%D1%82-%D0%BD%D0%B0-%D1%81%D0%BD%D1%8F%D1%82%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.5991011/page-9999#footer";
    };
 
    ButtonLevelUp.addEventListener("click", () => {
        BLevelUp();
        ButtonLevelUp.style.background = "#fff"
    });
 
    ButtonAp.addEventListener("click", () => {
        BAp();
        ButtonAp.style.background = "#fff"
    });

    ButtonUnWarning.addEventListener("click", () => {
        BUnWarning();
        ButtonUnWarning.style.background = "#fff"
    });

    ButtonTrade.addEventListener("click", () => {
        BTrade();
        ButtonTrade.style.background = "#fff"
    });
    ButtonASD.addEventListener("click", () => {
        BASD();
        ButtonASD.style.background = "#fff"
    });
})();