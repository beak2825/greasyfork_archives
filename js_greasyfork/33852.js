// ==UserScript==
// @name         React edit :v
// @icon         http://akg.life/akg/img/akg.png
// @description  Extension with the most beautiful design for you
// @version      1.0.0
// @type         Beta
// @author       React
// @match        http://dual-agar.me/
// @match        https://dual-agar.me/
// @match        http://dual-agar.online/
// @homepage     http://akg.life/
// @downloadUrl  http://akg.life/akg/dualagar/install.user.js
// @updateUrl    http://akg.life/akg/dualagar/install.user.js
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/155236
// @downloadURL https://update.greasyfork.org/scripts/33852/React%20edit%20%3Av.user.js
// @updateURL https://update.greasyfork.org/scripts/33852/React%20edit%20%3Av.meta.js
// ==/UserScript==

// Copyright © 2017 - React

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