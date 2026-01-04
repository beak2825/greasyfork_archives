// ==UserScript==
// @name         Permitir Mediafire en identi
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modifica checkBlockedURL para permitir enlaces de Mediafire
// @match        *://identi.io/*
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/535079/Permitir%20Mediafire%20en%20identi.user.js
// @updateURL https://update.greasyfork.org/scripts/535079/Permitir%20Mediafire%20en%20identi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Guardar la función original
    const originalCheckBlockedURL = window.checkBlockedURL;

    // Interceptar y modificar el comportamiento de checkBlockedURL
    window.checkBlockedURL = function(txt) {
        if (/mediafire\.com/gi.test(txt)) {
            return true; // Permitir enlaces de Mediafire
        }
        return originalCheckBlockedURL(txt);
    };

})();
