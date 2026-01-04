// ==UserScript==
// @name         Pessapalo - korekce url zápasu
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  Odstraní z url :443
// @author       Jarda Kořínek
// @match        https://www.pesistulokset.fi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pesistulokset.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484042/Pessapalo%20-%20korekce%20url%20z%C3%A1pasu.user.js
// @updateURL https://update.greasyfork.org/scripts/484042/Pessapalo%20-%20korekce%20url%20z%C3%A1pasu.meta.js
// ==/UserScript==

(function() {
    function showAlert() {
        alert("Skript byl úspěšně načten.");
    }

    setTimeout(() => {
        const zapasy = document.querySelectorAll(".match-item");

        zapasy.forEach(zapas => {
            zapas.href = zapas.href;
        });

        showAlert();
    }, 1000);
})();