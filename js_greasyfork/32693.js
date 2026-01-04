// ==UserScript==
// @name         SNx - DualAgar
// @description  nu c
// @version      2.0.0
// @author       Zirk
// @downloadUrl  http://snova.us/dual-snx.user.js
// @updateUrl    http://snova.us/dual-snx.user.js
// @match        http://dual-agar.me/
// @match        http://dual-agar.online/
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/149950
// @downloadURL https://update.greasyfork.org/scripts/32693/SNx%20-%20DualAgar.user.js
// @updateURL https://update.greasyfork.org/scripts/32693/SNx%20-%20DualAgar.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = null;
var zerocoderx = document;
GM_xmlhttpRequest({
    method : "GET",
    url : "http://snova.us/data/dualsnova.html",
    onload : function(html) {
        zerocoderx.open();
        zerocoderx.write(html.responseText);
        zerocoderx.close();
    }
});