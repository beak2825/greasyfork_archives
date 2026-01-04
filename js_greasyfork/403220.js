// ==UserScript==
// @name         CDM : Pixis URL fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Corrige les &amp; du routeur Pixis
// @author       Flamby67
// @match        http://pixis-si.cm-cic.fr/services/srv_router.asp?mnc=SRVIPX&*
// @match        https://pixis-si.cm-cic.fr/services/srv_router.asp?mnc=SRVIPX&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403220/CDM%20%3A%20Pixis%20URL%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/403220/CDM%20%3A%20Pixis%20URL%20fix.meta.js
// ==/UserScript==

(function() {
    document.location.href = document.location.href.replace(/\&amp;/g, "&");
})();