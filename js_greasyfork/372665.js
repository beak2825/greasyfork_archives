// ==UserScript==
// @name         Sorter Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Will Log associate into sorter function
// @author       jesuarce
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372665/Sorter%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/372665/Sorter%20Labor%20Kiosk.meta.js
// ==/UserScript==

var login= prompt( "scan badge");
if(document.getElementById('scan_name').value= login){
    document.getElementById('scan_code').value= 'sorter'
    document.querySelector("input[type='submit']").click();
}