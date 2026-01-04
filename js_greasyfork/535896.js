// ==UserScript==
// @name         Быстрый раздел || by G.White
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Быстрый раздел
// @author       ......................
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535896/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20%7C%7C%20by%20GWhite.user.js
// @updateURL https://update.greasyfork.org/scripts/535896/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20%7C%7C%20by%20GWhite.meta.js
// ==/UserScript==

(function() {
    'use strict';

const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonZB = document.createElement("button");
    const ButtonPR = document.createElement("button");

    ButtonRep.textContent = "Админ раздел";
    ButtonZB.textContent = "ЖБ на игроков";
    ButtonPR.textContent = "Правила";


    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonZB);
    bgButtons.append(ButtonPR);


    ButtonRep.style.marginLeft = "40px";
    ButtonRep.style.background = "#878686"
    ButtonRep.style.borderRadius = "20px"
    ButtonRep.style.boreder = "5px solid #4a4b4d"
    ButtonRep.style.font = "Cuprum"
    ButtonRep.style.span = "italic normal bold"

    ButtonZB.style.marginLeft = "40px";
    ButtonZB.style.background = "#878686"
    ButtonZB.style.borderRadius = "20px"
    ButtonZB.style.boreder = "5px solid #4a4b4d"
    ButtonZB.style.font = "Cuprum"

    ButtonPR.style.marginLeft = "40px";
    ButtonPR.style.background = "#878686"
    ButtonPR.style.borderRadius = "20px"
    ButtonPR.style.boreder = "5px solid #4a4b4d"
     ButtonPR.style.font = "Cuprum"



    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.3648/';
    };


    function BZB() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3666/';
    };

    function BPR() {
        window.location.href = 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/';
    };



    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#696969"
    });

    ButtonZB.addEventListener("click", () => {
        BZB();
        ButtonZB.style.background = "#696969"
    });

    ButtonPR.addEventListener("click", () => {
        BPR();
        ButtonPR.style.background = "#696969"
    });

})();