// ==UserScript==
// @name         Make Google Tasks Great Again
// @version      0.15.2
// @description  Keeps the last edited task open when switching tabs
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Make%20Google%20Tasks%20Great%20Again]%20
// @match        https://tasks.google.com/*
// @match        https://calendar.google.com/calendar/u/0/r/tasks*
// @icon         https://ssl.gstatic.com//tasks/00d84c8baaaf6dd434993369f1441e47/favicon.ico
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/381416/Make%20Google%20Tasks%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/381416/Make%20Google%20Tasks%20Great%20Again.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function() {
    "use strict";
    GM.addStyle("html-blob {height: 100%; display: inline-block;}");
    GM.addStyle(".editing {max-height: initial!important;}");
    GM.addStyle(".bRcSk .KYeDle:not(.YfT1Ke) .UcEgAe {margin-top: 2px;}");
    GM.addStyle(".bRcSk .KYeDle.YfT1Ke .UcEgAe {width: calc(100% - 30px)}");

    var lastEditedTask;
    setInterval(()=>{
        var editedTask = document.querySelector("[data-is-editing='true']");
        if (editedTask){
            lastEditedTask?.classList?.remove("editing");
            lastEditedTask = editedTask;
        }
        if (lastEditedTask){
            lastEditedTask.classList.add("editing");
        }
    },50);
})();