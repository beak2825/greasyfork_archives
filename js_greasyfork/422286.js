    // ==UserScript==
    // @name         START Labor Kiosk
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  Will Log associate into START function
    // @author       ajacobth
    // @match        https://aftlite-portal.amazon.com/indirect_action
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422286/START%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/422286/START%20Labor%20Kiosk.meta.js
    // ==/UserScript==

    var login= prompt( "Scan Badge to Log Into START");
    if(document.getElementById('scan_name').value= login){
        document.getElementById('scan_code').value= 'START'
        document.querySelector("input[type='submit']").click();
    }