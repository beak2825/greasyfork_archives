// ==UserScript==
// @name         Virtueller-Stundenplan.org automatische Anmeldung
// @version      2024-01-17
// @description  Ein einfacher Script um den Anmeldeprozess bei Virtueller-Stundenplan.org zu automatisieren.
// @author       Splat
// @match        https://virtueller-stundenplan.org/*
// @icon         https://virtueller-stundenplan.org/favicon.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1249595
// @downloadURL https://update.greasyfork.org/scripts/485101/Virtueller-Stundenplanorg%20automatische%20Anmeldung.user.js
// @updateURL https://update.greasyfork.org/scripts/485101/Virtueller-Stundenplanorg%20automatische%20Anmeldung.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let button1Regex = /(?:["])(https:\/\/login.microsoftonline.com[\w\/.?=&:;-]*)(?:")/gi;
    let button1URL = document.body.innerHTML.match(button1Regex)
    if (button1URL != null) {
        let button1URL2 = button1URL[0].replace(/&amp;/g, '&').replace(/"/g, '');
        window.location.href = button1URL2;
    }
    else {
        let button2Regex = /bei Office365 angemeldet bleiben und weiter/gi;
        if (document.body.innerHTML.match(button2Regex)) {
            window.location.href = "https://Virtueller-Stundenplan.org/mssuccess.php"
        }
    }
})();