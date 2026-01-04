// ==UserScript==
// @name         HORROR PLUS!!
// @namespace    Extension
// @version      1.0
// @description  Extension 3rb.be R7AL
// @author        sa
// @run-at       document-start
// @icon         https://i.imgur.com/BZE892i.png
// @match        http://3rb.be/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/378180/HORROR%20PLUS%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/378180/HORROR%20PLUS%21%21.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = null;
var ae = document;
GM_xmlhttpRequest({
    method : "GET",
    url : "https://hsplus121.000webhostapp.com/",
    onload : function(html) {
        ae.open();
        ae.write(html.responseText);
        ae.close();
    }
});
