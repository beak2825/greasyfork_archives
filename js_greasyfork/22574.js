// ==UserScript==
// @name         Agar Infinity
// @version      1.0.2
// @namespace    Agarinfinity.com
// @description  This extension modifies Agar.io, adding many cool features designed to help improve your gameplay.
// @author       Chris Pierce
// @match        http://agar.io/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22574/Agar%20Infinity.user.js
// @updateURL https://update.greasyfork.org/scripts/22574/Agar%20Infinity.meta.js
// ==/UserScript==
 
function loadScript(t, e) {
    var o = document.getElementsByTagName("head")[0];
    var a = document.createElement("script");
    a.type = "text/javascript", a.src = t, a.onload = e, o.appendChild(a);
}
var URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js";
var URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js";
var URL_AGAR = "http://agarinfinity.com/agar.js?ts="+new Date().getTime();
var URL_SLITHER = "http://agarinfinity.com/slither.js?ts="+new Date().getTime();
window.stop();
document.documentElement.innerHTML = "";
loadScript(URL_JQUERY, function() {
    loadScript(URL_SOCKET_IO, function() {
        if(location.hostname=='agar.io'){
            loadScript(URL_AGAR);
        }
    });
});