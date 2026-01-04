// ==UserScript==
// @name         Affianca Due Tab
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Affianca due tab nel browser
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508714/Affianca%20Due%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/508714/Affianca%20Due%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per affiancare i tab
    function affiancaTab() {
        const urlToAffiancare = prompt('Inserisci l\'URL da affiancare:');
        if (urlToAffiancare) {
            window.open(urlToAffiancare, '_blank', 'width=800,height=600,left=0,top=0');
        } else {
            alert('Per favore, inserisci un URL valido.');
        }
    }

    // Aggiungi un comando al menu di Violentmonkey per affiancare i tab
    GM_registerMenuCommand("Affianca Tab", affiancaTab);
})();
