
// ==UserScript==
// @name         Break Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Will Log associate into break function
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372016/Break%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/372016/Break%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "Scan Badge to Log into BREAK");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'BRK'
    document.querySelector("input[type='submit']").click();
}