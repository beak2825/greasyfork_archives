// ==UserScript==
// @name         Fast button for forum BR
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fast button
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://pm1.aminoapps.com/7778/7cda151a68829f233ba6295b8c2fc0a2cb3fa933r1-735-661v2_uhq.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486845/Fast%20button%20for%20forum%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/486845/Fast%20button%20for%20forum%20BR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const ButtonAdm = document.createElement("button");
    const ButtonPlayer = document.createElement("button");
    const ButtonAdmReport = document.createElement("button");
    const ButtonLeaderReport = document.createElement("button");
    const ButtonUnreport = document.createElement("button");
    const ButtonRules = document.createElement("button");

    ButtonAdm.textContent = "Админ раздел";
    ButtonPlayer.textContent = "Жалобы на игроков";
    ButtonAdmReport.textContent = "Жалобы на адм";
    ButtonLeaderReport.textContent = "Жалобы на лд";
    ButtonUnreport.textContent = "Обжалования";
    ButtonRules.textContent = "Правила серверов";

    bgButtons.append(ButtonAdm);
    bgButtons.append(ButtonPlayer);
    bgButtons.append(ButtonAdmReport);
    bgButtons.append(ButtonLeaderReport);
    bgButtons.append(ButtonUnreport);
    bgButtons.append(ButtonRules);

    ButtonAdm.style.marginLeft = "40px";
    ButtonAdm.style.background = "#b4b5b8"
    ButtonAdm.style.borderRadius = "15px"
    ButtonAdm.style.boreder = "1px solid #4a4b4d"

    ButtonPlayer.style.marginLeft = "10px"
    ButtonPlayer.style.background = "#b4b5b8"
    ButtonPlayer.style.borderRadius = "15px"
    ButtonPlayer.style.boreder = "2px solid #4a4b4d"

    ButtonAdmReport.style.marginLeft = "10px"
    ButtonAdmReport.style.background = "#b4b5b8"
    ButtonAdmReport.style.borderRadius = "15px"
    ButtonAdmReport.style.boreder = "2px solid #4a4b4d"

    ButtonLeaderReport.style.marginLeft = "10px"
    ButtonLeaderReport.style.background = "#b4b5b8"
    ButtonLeaderReport.style.borderRadius = "15px"
    ButtonLeaderReport.style.boreder = "2px solid #4a4b4d"

    ButtonUnreport.style.marginLeft = "10px"
    ButtonUnreport.style.background = "#b4b5b8"
    ButtonUnreport.style.borderRadius = "15px"
    ButtonUnreport.style.boreder = "2px solid #4a4b4d"

    ButtonRules.style.marginLeft = "10px"
    ButtonRules.style.background = "#b4b5b8"
    ButtonRules.style.borderRadius = "15px"
    ButtonRules.style.boreder = "2px solid #4a4b4d"

    function bAdm() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2432/';
    };

    function bPlayer() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/";
    };

    function bAdmReport() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/";
    };

    function bLeaderReport() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2457/";
    };

    function bUnreport() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2459/";
    };

    function bRules() {
        window.location.href = "https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/";
    };

    ButtonAdm.addEventListener("click", () => {
        bAdm();
        ButtonRep.style.background = "#fff"

    });

    ButtonPlayer.addEventListener("click", () => {
        bPlayer();
        ButtonWarning.style.background = "#fff"

    });

    ButtonAdmReport.addEventListener("click", () => {
        bAdmReport();
        ButtonRep.style.background = "#fff"

    });

    ButtonLeaderReport.addEventListener("click", () => {
        bLeaderReport();
        ButtonWarning.style.background = "#fff"

    });

    ButtonUnreport.addEventListener("click", () => {
        bUnreport();
        ButtonRep.style.background = "#fff"

    });

    ButtonRules.addEventListener("click", () => {
        bRules();
        ButtonWarning.style.background = "#fff"

    });
})();