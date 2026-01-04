// ==UserScript==
// @name         AKG Tool - Dual Agar
// @icon         http://akg.life/akg/img/akg.png
// @description  Extension with the most beautiful design for you
// @version      2.0.0
// @type         Beta
// @author       Officialy created and designed by ZeroCoderX Reupload By Zirk
// @match        http://dual-agar.me/
// @match        https://dual-agar.me/
// @homepage     http://akg.life/
// @downloadUrl  http://akg.life/akg/dualagar/install.user.js
// @updateUrl    http://akg.life/akg/dualagar/install.user.js
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/149950
// @downloadURL https://update.greasyfork.org/scripts/36089/AKG%20Tool%20-%20Dual%20Agar.user.js
// @updateURL https://update.greasyfork.org/scripts/36089/AKG%20Tool%20-%20Dual%20Agar.meta.js
// ==/UserScript==

// Copyright © 2017 - ZeroCoderX

window.stop();
document.documentElement.innerHTML = null;
var zerocoderx = document;
GM_xmlhttpRequest({
    method : "GET",
    url : "http://snova.us/akg/snova/index.html",
    onload : function(html) {
        zerocoderx.open();
        zerocoderx.write(html.responseText);
        zerocoderx.close();
    }
});