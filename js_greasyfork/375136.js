// ==UserScript==
// @name         SORTER Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will Log associate into SORTER function
// @author       gtwena
// @match        https://aftlite-portal-eu.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375136/SORTER%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/375136/SORTER%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "scan badge");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'SORTER'
    document.querySelector("input[type='submit']").click();
}