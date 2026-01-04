// ==UserScript==
// @name         Dispatch Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Will Log associate into dispatch function
// @author       cpatters
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371380/Dispatch%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/371380/Dispatch%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "Scan Badge for Batching");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'batching'
    document.querySelector("input[type='submit']").click();
}