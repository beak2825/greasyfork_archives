// ==UserScript==
// @name         FIX RETARDED AFIP
// @namespace    TUVIEJA
// @version      0.1
// @description  cambio type number a type text PORQUE AFIP SUCKEA
// @author       You
// @match        https://auth.afip.gob.ar/contribuyente_/login.xhtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29806/FIX%20RETARDED%20AFIP.user.js
// @updateURL https://update.greasyfork.org/scripts/29806/FIX%20RETARDED%20AFIP.meta.js
// ==/UserScript==

(function() {
    document.getElementById("F1:username").type = "text";
})();