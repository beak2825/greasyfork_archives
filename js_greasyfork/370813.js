// ==UserScript==
// @name         My OPR Keyboard shortcut
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://opr.ingress.com/recon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370813/My%20OPR%20Keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/370813/My%20OPR%20Keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let num = -1;
    window.addEventListener("keypress", (e) => {
        switch (e.key) {
            case "d": { num += 1; document.getElementById('map-filmstrip').children[0].children[num].children[0].click(); num += 1; break; }
            case "s": { num = 0; document.getElementById('map-filmstrip').children[0].children[num].children[0].click(); break; }
            case "1": { document.getElementsByClassName("btn-group")[0].childNodes[2].click();document.getElementsByClassName('modal-body')[0].getElementsByTagName("button")[1].click(); break; }
            case "3": { for ( var i = 0; i < document.getElementsByClassName("btn-group").length; i++ ) {document.getElementsByClassName("btn-group")[i].childNodes[6].click()};document.getElementById("submitDiv").getElementsByTagName("button")[0].click(); break; }
            case "5": { for ( var i = 0; i < document.getElementsByClassName("btn-group").length; i++ ) {document.getElementsByClassName("btn-group")[i].childNodes[10].click()};document.getElementById("submitDiv").getElementsByTagName("button")[0].click(); break; }
            case "g": { document.querySelector("#content > button").click();document.getElementsByClassName('modal-body')[0].getElementsByTagName("button")[1].click(); num = -1; break; }
            case "f": { window.location.assign("/recon"); num = -1; break; }
            default: break;
        }
    });
})();