    // ==UserScript==
    // @name         EOS Labor Kiosk
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  Will log associate into EOS function
    // @author       ajacobth
    // @match        https://aftlite-portal.amazon.com/indirect_action
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422287/EOS%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/422287/EOS%20Labor%20Kiosk.meta.js
    // ==/UserScript==

    var login= prompt( "Scan Badge to Log Into EOS");
    if(document.getElementById('scan_name').value= login){
        document.getElementById('scan_code').value= 'EOS'
        document.querySelector("input[type='submit']").click();
    }