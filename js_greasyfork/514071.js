// ==UserScript==
// @name         GolemMinus - GolemPlus-Artikel ausblenden
// @namespace    lxtgb
// @version      2024-10-26
// @description  Alle GolemPlus-Artikel auf der Golem-Homepage ausblenden
// @author       lxtgb
// @match        https://www.golem.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=golem.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514071/GolemMinus%20-%20GolemPlus-Artikel%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/514071/GolemMinus%20-%20GolemPlus-Artikel%20ausblenden.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(
        document.querySelectorAll('.golemplus')
    ).forEach(a => {
        a.style.display='none';
        //a.style.opacity=.1;
    })
})();