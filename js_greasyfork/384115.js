// ==UserScript==
// @name         Keep Cursor on Screen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  attempt to keep the cusor on the input box for the dp license scan
// @author       You
// @match        https://logistics.amazon.com/tracks/idverification/barcodeinput
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384115/Keep%20Cursor%20on%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/384115/Keep%20Cursor%20on%20Screen.meta.js
// ==/UserScript==


setInterval(function(){ location.reload(); }, 60000);
setTimeout(function(){
    document.getElementById('okButton').click();
    document.getElementById('idKioskBarcodeData').value= "Scan Please";
document.getElementById('idKioskBarcodeData').select();
}, 2000)