// ==UserScript==
// @name         ASM Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Will Log ASM into ASM function
// @author       craihowa
// @match        https://aftlite-portal.amazon.com/indirect_action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390610/ASM%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/390610/ASM%20Labor%20Kiosk.meta.js
// ==/UserScript==

var myVar = setInterval(labortrack, 60000);

function labortrack() {

(document.getElementById('scan_name').value= 'craihowa')
document.getElementById('scan_code').value= 'ASM'
    document.querySelector("input[type='submit']").click();
}