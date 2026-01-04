// ==UserScript==
// @name         Sportradar - programátorská tabulka
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Upraví pozici programátorské tabulky - ta už nebude blokovat používání stránky
// @author       Jarda Kořínek
// @match        https://widgets.sir.sportradar.com/live-match-tracker
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sportradar.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470131/Sportradar%20-%20program%C3%A1torsk%C3%A1%20tabulka.user.js
// @updateURL https://update.greasyfork.org/scripts/470131/Sportradar%20-%20program%C3%A1torsk%C3%A1%20tabulka.meta.js
// ==/UserScript==

(function() {
    const div = document.createElement("div");
    document.body.insertBefore(div, document.body.firstChild);
    div.style.height = "50vh";

    setTimeout(()=> {
        const tabulka = document.getElementById("kvido_json_table");
        tabulka.style.display = "grid";
        tabulka.style.gridTemplateColumns = "repeat(3, 1fr)";
        tabulka.style.gridColumnGap = "5px";
        tabulka.style.gridRowGap = "5px";
        tabulka.style.maxHeight = "40vh";
        tabulka.style.overflow = "scroll";
    }, 3000)
})();