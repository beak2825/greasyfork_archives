// ==UserScript==
// @name         Configr disable free message
// @namespace    https://breskott.com.br/
// @version      0.1
// @site         https://www.breskott.com.br/
// @github       https://github.com/breskott
// @description  Made by Breskott to disappear with boring message
// @author       Breskott's Software House
// @match        https://cloud.configr.com/dashboard
// @include      http*://*.configr.com/*
// @include      http*://configr.com/*
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_getMetadata
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/403821/Configr%20disable%20free%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/403821/Configr%20disable%20free%20message.meta.js
// ==/UserScript==

// Wait page
window.addEventListener('load', function() {
    // Verified tag
   if(document.getElementsByTagName("app-subnavbar")){
       var elements = document.getElementsByTagName('app-subnavbar');
       // remove tag
       while(elements.length > 0){
           elements[0].parentNode.removeChild(elements[0]);
       }
   }
}, false);