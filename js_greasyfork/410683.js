// ==UserScript==
// @name         Zásilkovna "Zaškrtnutí souhlasů"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.0
// @description  Automaticky zaškrtne Souhas s VOP na stránce ručního importu, podání zásilky a podání reklamačního asistenta.
// @author       Zuzana Nyiri
// @match        https://client.packeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410683/Z%C3%A1silkovna%20%22Za%C5%A1krtnut%C3%AD%20souhlas%C5%AF%22.user.js
// @updateURL https://update.greasyfork.org/scripts/410683/Z%C3%A1silkovna%20%22Za%C5%A1krtnut%C3%AD%20souhlas%C5%AF%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // import zásilek
    var element1 = document.getElementById('frm-packetUploadForm-termsAgreement');
    if(typeof(element1) != 'undefined' && element1 != null){
        element1.click();
        }
    //  duplikování zásilky
    var element2 = document.getElementById('frm-packetDraftsForm-form-termsAgreement')
        if(typeof(element2) != 'undefined' && element2 != null){
            element2.click();
        }
    // reklamační asistent
    var element3 = document.getElementById('frm-claimAssistantForm-termsAgreement')
        if(typeof(element3) != 'undefined' && element3 != null){
            element3.click();
        }
})();