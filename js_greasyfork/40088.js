// ==UserScript==
// @name         Feuerwerk Forum - Kartendaten Workaround
// @version      0.1
// @description  Kleine Hilfe beim "Es ist nicht möglich, ausreichend Kartendaten von Google Maps zu beziehen" Fehler. Nicht schön umgesetzt, aber reicht erstmal.
// @author       rabe85
// @match        https://www.feuerwerk-forum.de/kalender/create
// @match        https://www.feuerwerk-forum.de/kalender/*/event/edit
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/40088/Feuerwerk%20Forum%20-%20Kartendaten%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/40088/Feuerwerk%20Forum%20-%20Kartendaten%20Workaround.meta.js
// ==/UserScript==


document.body.addEventListener('mousemove', function(e){

    var submit0 = document.getElementsByClassName('button primary');
    for(var s = 0, submit; !!(submit=submit0[s]); s++) {
        submit.removeAttribute("disabled");
        submit.removeAttribute("class");
        submit.setAttribute('class','button primary');
    }

    document.getElementById('exposeMask').setAttribute('style','display: none;');

});
