// ==UserScript==
// @name         Škola Offline přihlašovač 3000
// @description  Skript pro automatické přihlášení do školy offline bez jediného kliknutí
// @namespace    http://tampermonkey.net/
// @version      2024-11-27
// @author       T0biasCZe, MarioDD
// @match        https://*.skolaonline.cz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skolaonline.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519081/%C5%A0kola%20Offline%20p%C5%99ihla%C5%A1ova%C4%8D%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/519081/%C5%A0kola%20Offline%20p%C5%99ihla%C5%A1ova%C4%8D%203000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //redirectne na prihlasovaci stranku kdyz clovek najede na frontpage
    if(window.location.href == "https://www.skolaonline.cz/"){
        location.replace("https://www.skolaonline.cz/prihlaseni/");
        return;
    }

    //na prihlasovaci strance vyplni prihlasovaci udaje a zmackne login tlacitko
    if(window.location.href == "https://www.skolaonline.cz/prihlaseni/"){
        //ZMĚNTĚ JMENO A HESLO NA VAŠE PŘIHLAŠOVACÍ ÚDAJE!!!
        //ZMĚNTĚ JMENO A HESLO NA VAŠE PŘIHLAŠOVACÍ ÚDAJE!!!
        //ZMĚNTĚ JMENO A HESLO NA VAŠE PŘIHLAŠOVACÍ ÚDAJE!!!
        document.getElementById("JmenoUzivatele").value = "jmeno";
        document.getElementById("HesloUzivatele").value = "heslo";
        document.querySelector("form").submit();
        return;
    }

    //zavre ten otravny popup ze ma clovek neprectene zpravy od telocvikare ktery posila 3 zprávy denně celé škole
    function checkPageAndClick() {
        var buttons = document.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
            if(buttons[i].id.includes("btnPozdeji")){
                buttons[i].click();
                clearInterval(checkInterval);
                break;
            }
        }
    }

    //zakomentujte tyhle 2 řádky s // jestli chcete vypnout zavirani popupu
    const checkInterval = setInterval(checkPageAndClick, 10);
    checkPageAndClick();
})();