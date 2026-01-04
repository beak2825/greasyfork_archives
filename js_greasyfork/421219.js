    // ==UserScript==
    // @name         ADMN Labor Kiosk
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  Will Log associate into ADMN function
    // @author       ajacobth (copied script from cpatters0
    // @match        https://aftlite-portal.amazon.com/indirect_action
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421219/ADMN%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/421219/ADMN%20Labor%20Kiosk.meta.js
    // ==/UserScript==

    var login= prompt( "Scan Badge to Log Into ADMN");
    if(document.getElementById('scan_name').value= login){
        document.getElementById('scan_code').value= 'ADMN'
        document.querySelector("input[type='submit']").click();
    }