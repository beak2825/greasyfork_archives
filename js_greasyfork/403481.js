// ==UserScript==
// @name         Travador
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.0.0.0.0.0.0.1
// @description  ira travar tudo haahahah
// @author       You
// @match        https://greasyfork.org/pt-BR/script_versions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403481/Travador.user.js
// @updateURL https://update.greasyfork.org/scripts/403481/Travador.meta.js
// ==/UserScript==
var d = document.getElementsByTagName("tr");
var f = document.getElementsByTagName("span");
function botao() {
    var f = document.getElementsByTagName("span");
    f[33].click();
}
function abrir(q) {
    if (q == 22) {
        botao();
        d[+q].getElementsByTagName("a")[3].click();
    }
    d[+q].getElementsByTagName("a")[3].click();
}
    for(var i=0;i<22;i++) {
setInterval(() => {
    abrir(i)
}, 10);
    }
