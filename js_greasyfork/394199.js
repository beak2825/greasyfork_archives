// ==UserScript==
// @name         test
// @namespace    test
// @version      1.0.0.1.alpha
// @description  test.a
// @author       szymy, Nyx
// @match        *://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      ogar-mod.ucoz.net
// @downloadURL https://update.greasyfork.org/scripts/394199/test.user.js
// @updateURL https://update.greasyfork.org/scripts/394199/test.meta.js
// ==/UserScript==

if (location.host === "agar.io" && location.pathname === "/") {
    window.stop();
    location.href = "https://agar.io/ogario" + location.hash;
}

GM_xmlhttpRequest({
    method : "GET",
    url : "https://ogar-mod.ucoz.net/v4-5582/index.html",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});
