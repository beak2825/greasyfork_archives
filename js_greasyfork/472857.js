// ==UserScript==
// @name         AGARIO Vanilla (harambroa)
// @namespace    real agar.io from 2015.
// @version      v72.1
// @description  Official Javascript client from 2015/2016 before emsscripten.
// @author       © agarbot.ovh
// @match        ://agar.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      ext.agarbot.ovh
// ==/UserScript==


if (location.host === "agar.io" && location.pathname === "/") {
   window.stop();
   location.href = "https://agar.io/agarbot" + location.hash;
   return;
}

document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "https://ext.agarbot.ovh/",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});