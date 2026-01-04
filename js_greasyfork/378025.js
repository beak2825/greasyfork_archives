// ==UserScript==
// @name         surveillTAG
// @namespace https://greasyfork.org/users/184736
// @version      0.3
// @description  Outil pour le Chat SurveilleTAG, appuyez sur 1,2,3,...,9 pour obtenir le TM voulu.
// @author       Tey
// @match        https://s1.abyssus.games/jeu.php?page=multichat&idchat=282
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378025/surveillTAG.user.js
// @updateURL https://update.greasyfork.org/scripts/378025/surveillTAG.meta.js
// ==/UserScript==

document.onkeypress = function myKeyPress(e){
    e = e || window.event;
    var keynum;
    keynum = e.which;

    getTM(String.fromCharCode(keynum));
}

function getTM(number) {
    var target = "";
    switch (number) {
        case "0":
            target = "-Pan-";
            break;
        case "1":
            target = "Kaatlyyn";
            break;
        case "2":
            target = "Nyx";
            break;
        case "3":
            target = "Sorgas";
            break;
        case "4":
            target = "Starter4219";
            break;
        case "5":
            target = "Mr_B";
            break;
        case "6":
            target = "-broz-";
            break;
        case "7":
            target = "Kaat";
            break;
        case "8":
            target = "Pastis";
            break;
        case "9":
            target = "requin_tigre";
            break;
        default:
    }
    if (target != "") {
        document.getElementById("message").value = "!tm " + target;
        document.getElementById("envoimessage").click();
    }
}