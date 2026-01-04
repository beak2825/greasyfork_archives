// ==UserScript==
// @name         Agarix
// @namespace    Agar.ix
// @description  Custom mod for agar.io
// @match        *://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @version      1.0.0
// @connect      glitch.me
// @downloadURL https://update.greasyfork.org/scripts/415490/Agarix.user.js
// @updateURL https://update.greasyfork.org/scripts/415490/Agarix.meta.js
// ==/UserScript==

if (location.host === "agar.io" && location.pathname === "/") {
    window.stop();
    location.href = "https://agar.io/ix" + location.hash;
    return;
}

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://sentinelix-source-agarix.glitch.me/index.html?v=' + Math.random(),
    onload: function(data) {
        document.open();
        document.write(data.responseText);
        document.close();
    }
});