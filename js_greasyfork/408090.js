// ==UserScript==
// @name         Repubblica - Disabilita il refresh della pagina
// @name:it      Repubblica - Disabilita il refresh della pagina
// @namespace    http://cosoleto.free.fr/
// @version      0.2
// @description  Disabilita il refresh automatico della home page di repubblica.it
// @description:it  Disabilita il refresh automatico della home page di repubblica.it
// @author       Francesco Cosoleto
// @match        http*://www.repubblica.it
// @match        http*://www.repubblica.it/?ref=RHHD-L
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408090/Repubblica%20-%20Disabilita%20il%20refresh%20della%20pagina.user.js
// @updateURL https://update.greasyfork.org/scripts/408090/Repubblica%20-%20Disabilita%20il%20refresh%20della%20pagina.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
        if (callback.toString().includes('window.location.href=') && callback.toString().includes("refresh")) {
            //console.info(callback.toString());
            console.info('Refresh disabilitato');
            window.setTimeout = originalSetTimeout;
            return;
        }
    return originalSetTimeout(callback, delay, ...args);
    };
})();
