// ==UserScript==
// @name         Fast links | BR Forum
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       Владик
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn.icon-icons.com/icons2/4159/PNG/512/ui_app_application_computer_program_software_legacy_icon_261654.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487030/Fast%20links%20%7C%20BR%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/487030/Fast%20links%20%7C%20BR%20Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

const bgButtons = document.querySelector(".pageContent");
    const ButtonRep = document.createElement("button");
    const ButtonWarning = document.createElement("button");
    const ButtonAppeal = document.createElement("button");
    ButtonRep.textContent = "Main";
    ButtonWarning.textContent = "Admin complaints";
    ButtonAppeal.textContent = "Appeals"

    bgButtons.append(ButtonRep);
    bgButtons.append(ButtonWarning);
    bgButtons.append(ButtonAppeal);

    ButtonRep.style.marginLeft = "20px";
    ButtonRep.style.background = "#b4b5b8"
    ButtonRep.style.borderRadius = "15px"
    ButtonRep.style.boreder = "2px solid #4a4b4d"

    ButtonWarning.style.margin = "10px";
    ButtonWarning.style.background = "#b4b5b8"
    ButtonWarning.style.borderRadius = "15px"
    ButtonWarning.style.boreder = "1px solid #4a4b4d"

    ButtonAppeal.style.margin = "0px";
    ButtonAppeal.style.background = "#b4b5b8"
    ButtonAppeal.style.borderRadius = "15px"
    ButtonAppeal.style.boreder = "1px solid #4a4b4d"

    function BRep() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9647-krasnoyarsk.2095/';
    };

    function BWarning() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2120/";
    };
    function BAppeal() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2123/';
    };
    ButtonRep.addEventListener("click", () => {
        BRep();
        ButtonRep.style.background = "#fff"
    });

    ButtonWarning.addEventListener("click", () => {
        BWarning();
        ButtonWarning.style.background = "#fff"
    });
    ButtonAppeal.addEventListener("click", () => {
        BAppeal();
        ButtonAppeal.style.background = "#fff"
    });
})();