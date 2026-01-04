// ==UserScript==

// @name         Tu madre (@sca1land)

// @namespace    real agar.io from 2015.

// @version     v2.2

// @description   2015/2016 

// @author       © @sca1land

// @match        *://agar.io/*

// @run-at       document-start

// @grant        GM_xmlhttpRequest

// @connect      ext.agarbot.ovh

// @downloadURL https://update.greasyfork.org/scripts/453317/Tu%20madre%20%28%40sca1land%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453317/Tu%20madre%20%28%40sca1land%29.meta.js
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