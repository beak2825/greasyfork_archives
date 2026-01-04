// ==UserScript==
// @name         KOOL Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will Log associate into KOOL function
// @author       gtwena
// @match        https://aftlite-portal-eu.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375137/KOOL%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/375137/KOOL%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "scan badge");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'KOOL'
    document.querySelector("input[type='submit']").click();
}