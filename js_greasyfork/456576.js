// ==UserScript==
// @name         GR - Agregar elemento a en IPs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega elemento a en IPs
// @author       Facu
// @match        https://gestionreal.com.ar/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gestionreal.com.ar
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456576/GR%20-%20Agregar%20elemento%20a%20en%20IPs.user.js
// @updateURL https://update.greasyfork.org/scripts/456576/GR%20-%20Agregar%20elemento%20a%20en%20IPs.meta.js
// ==/UserScript==

waitForKeyElements (".tbl_tabla", function(e) {

    $('td[data-heading="IP"]').each(function(i, v) {
        $(v).contents().wrap('<a class="link" href="http://'+$(v).text()+'" target="_blank"/>')
    });

});