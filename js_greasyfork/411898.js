// ==UserScript==
// @name         LOL
// @namespace    Discord: Crx#3084
// @version      0.4.0
// @description  Vanis.io extension
// @author       LOL
// @compatible   chrome
// @match        https://vanis.io/*
// @grant        GM_xmlhttpRequest
// @connect      lol734.glitch.me
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411898/LOL.user.js
// @updateURL https://update.greasyfork.org/scripts/411898/LOL.meta.js
// ==/UserScript==

if(window.location.origin + window.location.pathname !== 'https://vanis.io/lol'){
window.stop();
window.location.href = "https://vanis.io/lol";
}
document.body.innerHTML = `<center style="padding:40px;font-size:40px;color:white;">Loading LOL...</center>`
document.body.style.backgroundColor = "#151515"
GM_xmlhttpRequest({
    method : "GET",
    url : "https://lol734.glitch.me/vanis.io",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
    }
});
