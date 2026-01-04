// ==UserScript==
// @name         SNX PLUS
// @description  Ola
// @version      1.0.0
// @author       Zirk
// @downloadUrl  http://snova.us/snx/snx.user.js
// @updateUrl    http://snova.us/snx/snx.user.js
// @match        http://dual-agar.me/
// @match        http://dual-agar.online/
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/149950
// @downloadURL https://update.greasyfork.org/scripts/33178/SNX%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/33178/SNX%20PLUS.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = null;
var zerocoderx = document;
GM_xmlhttpRequest({
    method : "GET",
    url : "http://snova.us/snx/index.html",
    onload : function(html) {
        zerocoderx.open();
        zerocoderx.write(html.responseText);
        zerocoderx.close();
    }
});