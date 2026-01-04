// ==UserScript==
 
// @name         AGARIO Vanilla (@ya6h_)
 
// @namespace    real agar.io from 2015.
 
// @version     v1.0
 
// @description   2015/2016 
 
// @author       © @ya6h_
 
// @match        *://agar.io/*
 
// @run-at       document-start
 
// @grant        GM_xmlhttpRequest
 
// @connect      ext.agarbot.ovh
 
// @downloadURL https://update.greasyfork.org/scripts/512775/AGARIO%20Vanilla%20%28%40ya6h_%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512775/AGARIO%20Vanilla%20%28%40ya6h_%29.meta.js
// ==/UserScript==
 
if (location.host === "agar.io" && location.pathname === "/") {
 
   window.stop();
 
   location.href = "https://agar.io/agarbot" + location.hash;
 
   return;
 
}
 
document.documentElement.innerHTML = "";
 
GM_xmlhttpRequest({
 
    method : "GET",
 
    url : "https://ext.agarbot.ovh/",
 
    onload : function(e) {
 
        document.open();
 
        document.write(e.responseText);
 
        document.close();
 
    }
 
});