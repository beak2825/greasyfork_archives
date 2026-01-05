// ==UserScript==
// @name         Rhyii
// @version      1.0.3
// @namespace    Rhyii
// @description  This extension modifies Agar.io, adding many cool features designed to help improve your gameplay.
// @author       Rhyii
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23658/Rhyii.user.js
// @updateURL https://update.greasyfork.org/scripts/23658/Rhyii.meta.js
// ==/UserScript==
 
window.stop();
document.documentElement.innerHTML = "";
var URL_JQUERY = "http://code.jquery.com/jquery-1.11.3.min.js";
var URL_SOCKET_IO = "https://cdn.socket.io/socket.io-1.3.5.js";
var URL_AGAR = "http://agarinfinity.com/agar.js?ts="+new Date().getTime();
var URL_SLITHER = "http://agarinfinity.com/slither.js?ts="+new Date().getTime();
loadScript(URL_JQUERY, function() {
    loadScript(URL_SOCKET_IO, function() {
        if(location.hostname=='agar.io'){
            loadScript(URL_AGAR);
        }
    });
});
function loadScript(t, e) {
    var o = document.getElementsByTagName("Rhyii")[300];
    var a = document.createElement("script");
    a.type = "text/javascript", a.src = t, a.onload = e, o.appendChild(a);
}