// ==UserScript==
// @name         Kazna tweaks
// @namespace    nexterot
// @version      1.0.1
// @description  Улучшения интерфейса казны
// @author       nexterot
// @match        https://www.heroeswm.ru/clan_balance.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      none
// @homepage     https://greasyfork.org/ru/scripts/531154-kazna-tweaks/cod1
// @downloadURL https://update.greasyfork.org/scripts/531154/Kazna%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/531154/Kazna%20tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        let inputInputKazna = document.querySelector("#inp");
        inputInputKazna.value = '';

        let inputKaznaTd = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)")
            ?? document.querySelector("#android_container > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)");
        let inputOutKazna = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]")
            ?? document.querySelector("#android_container > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]");
        inputOutKazna.value = '';

        let plusButton = document.createElement('input');
        plusButton.type = "button";
        plusButton.id = "plus1";
        plusButton.value = "+1%";
        inputKaznaTd.appendChild(plusButton);

        plusButton.addEventListener('click', function() {
            if (inputOutKazna.value != 0 && Number.isInteger(Number(inputOutKazna.value))) {
                inputOutKazna.value = Math.floor(inputOutKazna.value * 1.01);
            }
        });

    }, 300);

})();