// ==UserScript==
// @name         Fast link for forum BR | Для ЗГА
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fast link for forum BR
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486833/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/486833/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonWarningP = document.createElement("button");
    ButtonRep.textContent = "Админ раздел";
    ButtonWarning.textContent = "Жб на адм";
    ButtonWarningP.textContent = "Жб на игроков";

    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonWarningP);

    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#b4b5b8"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "1px solid #4a4b4d"

    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#b4b5b8"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"

    ButtonWarningP.style.margin = "10px";
    ButtonWarningP.style.background = "#b4b5b8"
    ButtonWarningP.style.borderRadius = "15px"
    ButtonWarningP.style.boreder = "2px solid #4a4b4d"

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2432/';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/";
    };

    function BWarningP() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/";
    };

    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#fff"
    });

    ButtonWarning.addEventListener("click", () => {
        BWarning();
        ButtonWarning.style.background = "#fff"
    });

    ButtonWarningP.addEventListener("click", () => {
        BWarningP();
        ButtonWarningP.style.background = "#fff"
    });
})();