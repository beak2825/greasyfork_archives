// ==UserScript==
// @name         Lokman Dz Plus1
// @namespace    Extension
// @version      1.0
// @description  Extension 3rb.be By the ripper
// @author       Lokman Dz
// @run-at       document-start
// @match        http://3rb.be/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/378181/Lokman%20Dz%20Plus1.user.js
// @updateURL https://update.greasyfork.org/scripts/378181/Lokman%20Dz%20Plus1.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = null;
var ae = document;
GM_xmlhttpRequest({
    method : "GET",
    url : "http://lokmandz.000webhostapp.com/",
    onload : function(html) {
        ae.open();
        ae.write(html.responseText);
        ae.close();
    }
});