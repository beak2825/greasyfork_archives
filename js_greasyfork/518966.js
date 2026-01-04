// ==UserScript==
// @name         Google 100 Results
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mostra 100 risultati per pagina nelle SERP di Google (desktop e mobile)
// @author       Il tuo nome
// @match        https://www.google.*/*?q=*
// @match        https://www.google.*/*search*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518966/Google%20100%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/518966/Google%20100%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    // Imposta "num=100" solo se non è già presente
    if (url.searchParams.get('num') !== '100') {
        url.searchParams.set('num', '100');

        // Reindirizza solo se l'URL risultante è diverso
        if (url.toString() !== window.location.href) {
            window.location.replace(url.toString());
        }
    }
})();
