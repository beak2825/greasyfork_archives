// ==UserScript==
// @name         ZH - odfiltrovani uzivatelu na bazaru
// @namespace    http://tampermonkey.net/
// @version      2024-04-16
// @description  odfiltruje inzeráty podle autora
// @author       Varouch
// @match        https://www.zatrolene-hry.cz/bazar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zatrolene-hry.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492668/ZH%20-%20odfiltrovani%20uzivatelu%20na%20bazaru.user.js
// @updateURL https://update.greasyfork.org/scripts/492668/ZH%20-%20odfiltrovani%20uzivatelu%20na%20bazaru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const users = [];
    users.push("user1", "user2"); // tady si vypln uziv. jmena, jejichz inzeraty chces odfiltrovat

    var aTags = document.getElementsByTagName("a");
    var aTags2delete = [];

    for (var j = 0; j < users.length; j++) {
        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].getAttribute("href").includes('uzivatel') && aTags[i].textContent == users[j])
            {
               aTags2delete.push(aTags[i]);
            }
        }
    }

    aTags2delete.forEach((element) => element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove());
})();