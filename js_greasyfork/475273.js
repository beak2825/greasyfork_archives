// ==UserScript==
// @name         Chrome v117 update
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Odstranění nového řádku "naformátovat" který bránil správnému načtení programátorské tabulky
// @author       Jarda Kořínek
// @match        https://1xstavka.ru/LiveFeed/GetGameZip?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1xstavka.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475273/Chrome%20v117%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/475273/Chrome%20v117%20update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("div:empty").remove();
})();