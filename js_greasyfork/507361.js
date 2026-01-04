// ==UserScript==
// @name         Fast link for forum BR | ОЗГА | NOVGOROD
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fast link for forum BR
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507361/Fast%20link%20for%20forum%20BR%20%7C%20%D0%9E%D0%97%D0%93%D0%90%20%7C%20NOVGOROD.user.js
// @updateURL https://update.greasyfork.org/scripts/507361/Fast%20link%20for%20forum%20BR%20%7C%20%D0%9E%D0%97%D0%93%D0%90%20%7C%20NOVGOROD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonNoActive = document.createElement("button");
    const ButtonLobby = document.createElement("button");

    ButtonRep.textContent = "Обжалования";
    ButtonWarning.textContent = "Жб на адм";
    ButtonNoActive.textContent = "Жалобы на игроков";
    ButtonLobby.textContent = "Адм раздел";


    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
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

    ButtonLobby.style.marginLeft = "10px";
    ButtonLobby.style.background = "#b4b5b8"
    ButtonLobby.style.borderRadius = "15px"
    ButtonLobby.style.boreder = "1px solid #4a4b4d"

    ButtonRep.addEventListener("click", () => {
        window.location.href = 'https://forum.blackrussia.online/forums/Обжалование-наказаний.3556/';
        ButtonRep.style.background = "#fff"

    });

    ButtonWarning.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3553/"; // asd
        ButtonWarning.style.background = "#fff"

    });

    ButtonNoActive.addEventListener("click", () => {
        window.location.href = 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3555/'; // asd
        ButtonNoActive.style.background = "#fff"

    });

    ButtonLobby.addEventListener("click", () => {
        window.location.href = "https://forum.blackrussia.online/forums/Админ-раздел.3537/"; // asda
        ButtonLobby.style.background = "#fff"
    });
})();