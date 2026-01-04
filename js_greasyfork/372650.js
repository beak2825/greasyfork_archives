// ==UserScript==
// @name         Fresh Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Will Log associate into Fresh function
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372650/Fresh%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/372650/Fresh%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "scan badge");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'Fresh'
    document.querySelector("input[type='submit']").click();
}