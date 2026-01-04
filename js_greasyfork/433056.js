// ==UserScript==
// @name         Strava.cz LEPEK
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  zvýrazni lepková jídla na strava.cz
// @author       Vladimír Pilný
// @match        https://www.strava.cz/Strava/Stravnik/Objednavky
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433056/Stravacz%20LEPEK.user.js
// @updateURL https://update.greasyfork.org/scripts/433056/Stravacz%20LEPEK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var jidla = Array.from(document.getElementsByClassName('objednavka-jidlo-nazev'));

    for(var i in jidla) {
        var par = jidla[i].parentNode;
        var ale = (par) ? par.getElementsByClassName('objednavka-jidlo-alergeny-udaje') : [];

        if(ale && ale.length && ale[0].innerHTML.indexOf('01') != -1) {
            var lepek = document.createElement("div");
            lepek.innerHTML = "LEPEK";
            lepek.style = "position:relative;font-weight:bold;color:red;padding-left:20px;";
            par.appendChild(lepek);
        } else {
            if(jidla[i]) jidla[i].style = 'color:green;font-weight:bold';
        }
    }

})();