// ==UserScript==
// @name         OgarV4 mod [Nyx]
// @namespace    ogario.v4.b
// @version      4.0.0.38
// @description  OgarV4-mod [alpha release]
// @author       szymy, Nyx
// @match        *://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      ogar-mod.ucoz.net
// @downloadURL https://update.greasyfork.org/scripts/392564/OgarV4%20mod%20%5BNyx%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/392564/OgarV4%20mod%20%5BNyx%5D.meta.js
// ==/UserScript==

if (location.host === "agar.io" && location.pathname === "/") {
    window.stop();
    location.href = "https://agar.io/ogario" + location.hash;
}

GM_xmlhttpRequest({
    method : "GET",
    url : "https://ogar-mod.ucoz.net/v4/index.html",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});
