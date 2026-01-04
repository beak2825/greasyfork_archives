// ==UserScript==
// @name         ExtensionnnOB
// @version      1.0
// @namespace    Cold
// @description  dualagar extension
// @author       Cold
// @match        http://dual-agar.me/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31210/ExtensionnnOB.user.js
// @updateURL https://update.greasyfork.org/scripts/31210/ExtensionnnOB.meta.js
// ==/UserScript==
 
window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d")
var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://googledrive.com/host/0B_y9Ph24r5OgQVZ0ZThGbnl4Nmc/CoLDx.js";
$("head").append(s);
    };