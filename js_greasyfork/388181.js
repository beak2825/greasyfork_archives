// ==UserScript==
// @name         Horror-Plus-v4.2
// @description  Extension 3rb.be Savage
// @version      4.2
// @author       S | を#8073
// @icon         https://i.imgur.com/Jk9THpB.png
// @match        http://3rb.be/*
// @match        http://3rb.be/Rak
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==


window.stop();
document.documentElement.innerHTML = null;
var ae = document;
GM_xmlhttpRequest({
method : "GET",
url : "http://hsplus.ga/HS-PLUS-Orignal.html",
onload : function(html) {
ae.open();
ae.write(html.responseText);
ae.close();
}
});