// ==UserScript==
// @name         Minútové správy ako vertikálny sidebar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prerobenie sekcie s minútovými správami na vertikálny sidebar vpravo
// @author       You
// @match        https://standard.sk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476318/Min%C3%BAtov%C3%A9%20spr%C3%A1vy%20ako%20vertik%C3%A1lny%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/476318/Min%C3%BAtov%C3%A9%20spr%C3%A1vy%20ako%20vertik%C3%A1lny%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageHolders = document.querySelectorAll(".pageholder");
    const minutePageHolder = document.querySelector(".section__minute").closest(".pageholder");
    const sectionMinuteFlex = minutePageHolder.querySelector(".section__minute__wrap");

    //pageHolders.forEach(ph => { ph.style.margin = "0" }); //posunutie celej stránky na ľavý okraj

    minutePageHolder.style.position = "absolute";
    minutePageHolder.style.top = "0px"; //odsadenie sidebaru zhora
    minutePageHolder.style.right = "0px"; //odsadenie sidebaru sprava
    minutePageHolder.style.maxWidth = "200px"; //šírka sidebaru
    minutePageHolder.style.zIndex = "1000";
    sectionMinuteFlex.style.flexDirection = "column";
})();