// ==UserScript==
// @name         Hypertion Beta
// @namespace    Hypertion
// @version      2.2
// @description  Vanis.io extension
// @author       Zimek
// @match        https://vanis.io/*
// @icon         https://zimek.tk/Hypertion/res/logo.png
// @grant        GM_xmlhttpRequest
// @connect      zimek.glitch.me
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/395672/Hypertion%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/395672/Hypertion%20Beta.meta.js
// ==/UserScript==

if(window.location.origin + window.location.pathname !== 'https://vanis.io/hypertion'){
window.stop();
window.location.href = "https://vanis.io/hypertion";
}
document.body.innerHTML = `<center style="padding:40px;font-size:40px;color:white;">Loading Hypertion...</center>`
document.body.style.backgroundColor = "#151515"
GM_xmlhttpRequest({
    method : "GET",
    url : "https://zimek.glitch.me/hypertion",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});
