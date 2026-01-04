// ==UserScript==
// @name         Webgate BomB
// @version      0.1
// @author       You
// @description  Webgate BomB Script
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @namespace none
// @downloadURL https://update.greasyfork.org/scripts/460649/Webgate%20BomB.user.js
// @updateURL https://update.greasyfork.org/scripts/460649/Webgate%20BomB.meta.js
// ==/UserScript==

function WebgateBomb(){
    console.log("Webgate BomB Running...");
    var macro = setInterval(function() {
        WG_CancelWebGate();
    }, 100);
    setTimeout(function() {
        clearInterval(macro);
    }, 300000);
}

if( $WG_Config !=null ) {
    WebgateBomb();
    return;
}