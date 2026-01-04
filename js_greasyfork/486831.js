// ==UserScript==
// @name         Fast link for forum BR | Для кураторов администрации
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fast link for forum BR
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486831/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/486831/Fast%20link%20for%20forum%20BR%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonNoActive = document.createElement("button");
    const ButtonHappyHours = document.createElement("button");
    const ButtonLobby = document.createElement("button");
    ButtonRep.textContent = "Заявки на доп реп";
    ButtonWarning.textContent = "Жб на адм";
    ButtonNoActive.textContent = "Заявки на не актив";
    ButtonHappyHours.textContent = "Заявление на счастливые часы";
    ButtonLobby.textContent = "Адм раздел";


    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonHappyHours)
    bgButtons.append(ButtonNoActive);
    bgButtons.append(ButtonLobby);

    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#b4b5b8"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "1px solid #4a4b4d"

    ButtonWarning.style.marginLeft = "10px";
    ButtonWarning.style.background = "#b4b5b8"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "2px solid #4a4b4d"

    ButtonNoActive.style.marginLeft = "10px";
    ButtonNoActive.style.background = "#b4b5b8"
    ButtonNoActive.style.borderRadius = "15px"
    ButtonNoActive.style.boreder = "1px solid #4a4b4d"

    ButtonHappyHours.style.marginLeft = "10px";
    ButtonHappyHours.style.background = "#b4b5b8"
    ButtonHappyHours.style.borderRadius = "15px"
    ButtonHappyHours.style.boreder = "1px solid #4a4b4d"

    ButtonLobby.style.marginLeft = "10px";
    ButtonLobby.style.background = "#b4b5b8"
    ButtonLobby.style.borderRadius = "15px"
    ButtonLobby.style.boreder = "1px solid #4a4b4d"

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%B1%D0%B0%D0%BB%D0%BB%D1%8B.7758938/page-999#footer';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/";
    };

    function BNoActive() {
        window.location.href = 'https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BD%D0%B5%D0%B0%D0%BA%D1%82%D0%B8%D0%B2.5946812/page-999#footer';
    };

    function BHappyHours() {
        window.location.href = "https://forum.blackrussia.online/threads/kursk-%D0%97%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D1%81%D1%87%D0%B0%D1%81%D1%82%D0%BB%D0%B8%D0%B2%D1%8B%D0%B5-%D1%87%D0%B0%D1%81%D1%8B.7758888/page-999#footer";
    };

    function BLobby() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2432/";
    };

    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#fff"

    });

    ButtonWarning.addEventListener("click", () => {
        BWarning();
        ButtonWarning.style.background = "#fff"

    });

    ButtonNoActive.addEventListener("click", () => {
        BNoActive();
        ButtonNoActive.style.background = "#fff"

    });

    ButtonHappyHours.addEventListener("click", () => {
        BHappyHours();
        ButtonHappyHours.style.background = "#fff"
    });

    ButtonLobby.addEventListener("click", () => {
        BLobby();
        ButtonLobby.style.background = "#fff"
    });
})();