// ==UserScript==
// @name        eksiduyuru mal turnusolu
// @namespace   Violentmonkey Scripts
// @match       https://www.eksiduyuru.com/*
// @grant       none
// @version     2.2
// @author      -
// @description 6/23/2024, 12:54:18 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/503072/eksiduyuru%20mal%20turnusolu.user.js
// @updateURL https://update.greasyfork.org/scripts/503072/eksiduyuru%20mal%20turnusolu.meta.js
// ==/UserScript==

(function() {
    const mallarListesi = ["duygusalatasi", "moonie", "nundu", "kassiopeia", "alimcgraw", "logisticsmanager", "huzurlarinizda huzursuzluk", "pispinti", "ghilleinthemis", "mutekebbir", "sir william jones", "mirket", "muhayyer divan", "neira", "Jux", "arbre", "abuzer", "respect", "Topalordek", "aguen", "peki madem"];
    const aldigiNefesIsrafOlanlar = ["basond", "deer hunter", "HellKeePer"];

    function malTurnusolu(mallarListesi) {
        document.querySelectorAll('li').forEach(li => {
            let liText = li.textContent.toLowerCase();
            for (let keyword of mallarListesi) {
                if (liText.includes(keyword.toLowerCase())) {
                    li.style.border = '3px solid red';
                    break;
                }
            }
        });
    }

    function israfTurnusolu(aldigiNefesIsrafOlanlar) {
        document.querySelectorAll('li').forEach(li => {
            let liText = li.textContent.toLowerCase();
            for (let keyword of aldigiNefesIsrafOlanlar) { 
                if (liText.includes(keyword.toLowerCase())) {
                    li.style.border = '3px solid purple';
                    break;
                }
            }
        });
    }

    setInterval(() => malTurnusolu(mallarListesi), 250);
    setInterval(() => israfTurnusolu(aldigiNefesIsrafOlanlar), 250);
})();
