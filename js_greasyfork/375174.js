// ==UserScript==
// @name         EU Break Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will Log associate into break function
// @author       gtwena
// @match        https://aftlite-portal-eu.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375174/EU%20Break%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/375174/EU%20Break%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "scan badge");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'BRK'
    document.querySelector("input[type='submit']").click();
}