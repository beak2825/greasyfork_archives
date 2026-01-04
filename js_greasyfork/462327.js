// ==UserScript==
// @name         Pep today
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modifica el semestre del PEP
// @author       Profe UOC
// @match        https://campus.uoc.edu/tren*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/462327/Pep%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/462327/Pep%20today.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let data = new Date();
    let any = data.getFullYear();
    let mes = data.getMonth();
    let semestre;
    if (mes <=4 || mes === 11) { // De gener a maig i desembre (atenció, els mesos van de 0 (gener) a 11 (desembre)
        semestre = (any-1) + "2";
    } else { // (mes > 4 && mes <= 10) De juny a novembre
        semestre = any + "1";
    }
    if (document.accion.anyAcadSel.value !== semestre) {
        document.accion.anyAcadSel.value = semestre;
        ejecutar(70);
    }
    console.log(semestre);
})();